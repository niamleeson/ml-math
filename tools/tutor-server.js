#!/usr/bin/env node
/* Local dev server for the tutor app. Node built-ins only — no install needed.
   Run:  node tools/tutor-server.js [port]     then open http://localhost:8080
   It does four things:
     1. serves the repo over http (so the page has something to talk to),
     2. takes "explain this highlighted passage" requests from the page, locates the file the
        quoted prose really lives in, and appends the request to .claude/ask-queue.jsonl,
     3. runs a headless Claude Code worker on that request immediately, one at a time,
        and streams its status back to the page (--no-worker to hand the queue to /loop instead),
     4. watches lessons/ and index.html and pushes a reload over SSE, so the edit appears in
        the open tab by itself.
   Opening index.html straight from file:// still works; the page degrades to
   copy-to-clipboard when no server is there. */

const http = require("http");
const fs = require("fs");
const path = require("path");
const crypto = require("crypto");
const { spawn } = require("child_process");

const ROOT = path.resolve(__dirname, "..");
const QUEUE = path.join(ROOT, ".claude", "ask-queue.jsonl");
const argv = process.argv.slice(2);
const NO_WORKER = argv.includes("--no-worker");
const PORT = Number(argv.find(a => /^\d+$/.test(a)) || process.env.PORT || 8080);
// The worker may only read and edit files. No Bash, no Write, no network.
const WORKER_TOOLS = "Read,Edit,Grep,Glob";
// A request that reaches for a tool it isn't allowed (Bash, say) can sit forever, and the queue
// is serial — so one stuck request would block every question behind it. Cap it.
const REQUEST_TIMEOUT_MS = Number(process.env.TUTOR_TIMEOUT_MS || 6 * 60 * 1000);

const MIME = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".mjs": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".ipynb": "application/json; charset=utf-8",
  ".md": "text/markdown; charset=utf-8",
  ".txt": "text/plain; charset=utf-8",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".gif": "image/gif",
  ".ico": "image/x-icon",
  ".woff": "font/woff",
  ".woff2": "font/woff2",
  ".ttf": "font/ttf",
  ".csv": "text/csv; charset=utf-8",
  ".wasm": "application/wasm",
};

// ---- resolving a highlighted quote back to the file that holds it ------------
// The page can only guess: it knows which file *pushed* the lesson, but prose is merged in
// from other files (derivations-*, practice-*, walkthroughs-*, code-*, codeviz-*,
// all-ml-content-part-*, …), and new merge mechanisms get added over time. The server has the
// disk, so it just looks. Searched fresh on every request — Claude edits these files while
// this is running, so a cached index would go stale.

// Strip only real HTML tags: "<"/"</" must be followed immediately by a letter. A bare
// <[^>]+> would run from a JS comparison (`i < n`) to the next ">" and swallow real prose.
const TAG = /<\/?[a-zA-Z][a-zA-Z0-9]*(?:\s[^<>]*)?>/g;

// Compare letters only. Immune to markup inside the selection, HTML entities, doubled
// backslashes in LaTeX, smart quotes, and the whitespace collapsing the browser does.
function letters(s) {
  return s.replace(TAG, " ").replace(/&[a-z#0-9]+;/gi, " ").toLowerCase().replace(/[^a-z]/g, "");
}

// Every content file, walked fresh each request: new lesson files (and new subdirectories)
// are picked up without touching this code.
function contentFiles(dir = "lessons", out = []) {
  let entries;
  try { entries = fs.readdirSync(path.join(ROOT, dir), { withFileTypes: true }); } catch { return out; }
  for (const e of entries) {
    const rel = dir + "/" + e.name;
    if (e.isDirectory()) contentFiles(rel, out);
    else if (e.name.endsWith(".js")) out.push(rel);
  }
  return out;
}

function resolveFile(quote, hint, lessonId) {
  const probe = letters(quote || "");
  // Too little signal to be sure — anything under ~20 letters matches half the corpus.
  if (probe.length < 20) return { file: hint || null, resolved: false, why: "quote too short to locate" };

  const hits = [];
  const mentionsId = new Set();
  for (const rel of contentFiles()) {
    let src;
    try { src = fs.readFileSync(path.join(ROOT, rel), "utf8"); } catch { continue; }
    if (!letters(src).includes(probe)) continue;
    hits.push(rel);
    // A file keyed to this lesson is far likelier to be the one being read than a file that
    // merely happens to repeat the sentence.
    if (lessonId && src.includes(lessonId)) mentionsId.add(rel);
  }

  if (hits.length === 1) return { file: hits[0], resolved: true };
  if (hits.length > 1) {
    const keyed = hits.filter(h => mentionsId.has(h));
    if (keyed.length === 1) return { file: keyed[0], resolved: true, alsoIn: hits.filter(h => h !== keyed[0]) };
    if (hint && hits.includes(hint)) return { file: hint, resolved: true, alsoIn: hits.filter(h => h !== hint) };
    return { file: (keyed[0] || hits[0]), resolved: false, why: "quote appears in several files", candidates: keyed.length ? keyed : hits };
  }
  return { file: hint || null, resolved: false, why: "quote not found in lessons/ (page chrome, or rendered text)" };
}

// ---- SSE: every open tab holds one of these ----------------------------------
const clients = new Set();

function broadcast(event, data) {
  const frame = `event: ${event}\ndata: ${JSON.stringify(data)}\n\n`;
  for (const res of clients) { try { res.write(frame); } catch { clients.delete(res); } }
}

// ---- the queue file is the single source of truth for progress ---------------
// The page renders whatever status is in here; the worker (or a /loop running the
// tutor-inbox skill) moves entries through queued → working → done.

function readQueue() {
  try {
    return fs.readFileSync(QUEUE, "utf8").split("\n").filter(Boolean)
      .map(l => { try { return JSON.parse(l); } catch { return null; } }).filter(Boolean);
  } catch { return []; }
}

function writeQueue(entries) {
  fs.mkdirSync(path.dirname(QUEUE), { recursive: true });
  fs.writeFileSync(QUEUE, entries.map(e => JSON.stringify(e)).join("\n") + "\n");
}

function setStatus(id, status, extra = {}) {
  const entries = readQueue();
  const e = entries.find(x => x.id === id);
  if (!e) return;
  e.status = status;
  Object.assign(e, extra);
  writeQueue(entries);
  broadcast("queue", activeEntries());
}

// Only what the page should still be showing: anything unfinished, plus recently
// finished ones so the reader sees the ✓ land before it fades.
function activeEntries() {
  const cutoff = Date.now() - 10 * 60 * 1000;
  return readQueue()
    .filter(e => e.status !== "done" || Date.parse(e.finishedAt || e.ts) > cutoff)
    .slice(-8)
    .map(e => ({
      id: e.id, status: e.status, lessonId: e.lessonId, section: e.section,
      quote: e.quote, question: e.question, file: e.file, error: e.error, step: e.step,
      startedAt: e.startedAt, finishedAt: e.finishedAt, worker: e.worker !== false,
    }));
}

// ---- the worker: ONE long-lived Claude Code process for the life of the server ----
// It is spawned at startup and fed one request at a time over stream-json stdin, so there is
// no per-question cold start and it keeps context between your questions — it remembers the
// lessons it has already touched and the decisions it made. Requests stay strictly serial:
// two edits to the same lesson file at once would clobber each other.
const pendingIds = [];
let worker = null;          // the child process
let current = null;         // id of the request it is working on right now
let priming = false;        // swallow the result of the initial rules message
let workerBuf = "";         // stdout line buffer
let workerErr = "";         // recent stderr, for failure messages
let lastStep = null;        // most recent tool call, shown live in the page's dock
let restarts = 0;
let shuttingDown = false;
let deadline = null;        // timer for the request in flight

const PRIMER = [
  "You are the worker behind this repo's ✦ Ask Claude tool. A reader highlights a passage in a",
  "lesson page and asks for it to be fixed or explained better; each of my messages is one such",
  "request, as JSON.",
  "",
  "Read .claude/skills/tutor-inbox/SKILL.md now and follow it for every request I send. Skip its",
  "step 1 (reading the queue) and step 3 (marking done): I select the entry and manage its status.",
  "For each request, edit the lesson file and nothing else, then reply with one short line saying",
  "what you changed. Reply READY when you have read the skill.",
].join("\n");

function startWorker() {
  if (NO_WORKER) return;
  worker = spawn("claude", [
    "-p",
    "--input-format", "stream-json",
    "--output-format", "stream-json",
    "--verbose",                       // required by the CLI alongside stream-json output
    "--allowed-tools", WORKER_TOOLS,
    "--permission-mode", "acceptEdits",
  ], { cwd: ROOT, stdio: ["pipe", "pipe", "pipe"] });

  workerBuf = ""; workerErr = "";
  worker.stdout.on("data", d => { workerBuf += d; drainWorkerLines(); });
  worker.stderr.on("data", d => { workerErr = (workerErr + d).slice(-2000); });
  worker.on("error", e => log(`worker could not start: ${e.message}`));
  worker.on("close", onWorkerClose);

  priming = true;
  sendToWorker(PRIMER);
  log(`worker started (pid ${worker.pid}) — persists until this server stops`);
}

function sendToWorker(text) {
  if (!worker || !worker.stdin.writable) return false;
  const msg = { type: "user", message: { role: "user", content: [{ type: "text", text }] } };
  try { worker.stdin.write(JSON.stringify(msg) + "\n"); return true; } catch { return false; }
}

function drainWorkerLines() {
  let i;
  while ((i = workerBuf.indexOf("\n")) >= 0) {
    const line = workerBuf.slice(0, i);
    workerBuf = workerBuf.slice(i + 1);
    if (!line.trim()) continue;
    let ev; try { ev = JSON.parse(line); } catch { continue; }
    handleWorkerEvent(ev);
  }
}

function handleWorkerEvent(ev) {
  // Live activity, so the dock can say what it is doing rather than just "working".
  if (ev.type === "assistant" && ev.message && Array.isArray(ev.message.content)) {
    for (const c of ev.message.content) {
      if (c.type !== "tool_use") continue;
      const f = c.input && (c.input.file_path || c.input.path || c.input.pattern);
      const step = `${c.name}${f ? " " + String(f).split("/").pop() : ""}`;
      if (step !== lastStep && current) {
        lastStep = step;
        setStatus(current, "working", { step });
      }
    }
  }
  if (ev.type !== "result") return;
  if (priming) {                       // the "READY" for the rules message
    priming = false;
    log(`worker ready`);
    return pump();
  }
  if (!current) return;
  const id = current; current = null; lastStep = null;
  if (ev.is_error) finish(id, false, String(ev.result || "worker reported an error").slice(-400));
  else finish(id, true, String(ev.result || "").trim().slice(-400));
}

function onWorkerClose(code) {
  const wasWorking = current;
  worker = null; current = null; priming = false;
  if (shuttingDown) return;
  log(`worker exited (${code}) — restarting`);
  // Don't lose the request it died on: put it back at the front of the line.
  if (wasWorking) pendingIds.unshift(wasWorking);
  if (++restarts > 5) {
    log(`worker has died ${restarts} times; giving up. Fix the cause and restart the server.`);
    if (wasWorking) { pendingIds.shift(); finish(wasWorking, false, (workerErr || "worker keeps crashing").slice(-400)); }
    return;
  }
  setTimeout(startWorker, 500);
}

function enqueueWork(id) {
  if (NO_WORKER) return;
  pendingIds.push(id);
  pump();
}

// A question asked seconds before a restart, or one whose worker died mid-run, would otherwise
// sit in the file forever — nothing re-reads it. On boot, adopt everything unfinished.
// ("pending" is the status name this file used before the worker existed.)
function recover() {
  const entries = readQueue();
  const stale = entries.filter(e => e.status === "queued" || e.status === "pending" || e.status === "working");
  if (!stale.length) return;
  for (const e of stale) {
    e.status = "queued";
    delete e.startedAt;
    // Entries written before the file-resolver existed carry no location — give them one now.
    if (!e.file) {
      const loc = resolveFile(e.quote, e.fileHint || null, e.lessonId || null);
      e.file = loc.file; e.resolved = loc.resolved;
      if (loc.why) e.why = loc.why;
      if (loc.candidates) e.candidates = loc.candidates;
    }
  }
  writeQueue(entries);
  log(`recovered ${stale.length} unfinished request(s) from a previous run`);
  if (NO_WORKER) return;
  for (const e of stale) enqueueWork(e.id);
}

function pump() {
  // worker.killed flips synchronously on kill(), so a timed-out worker can't be handed more work
  // in the window before its close event arrives.
  if (!worker || worker.killed || priming || current || !pendingIds.length) return;
  const id = pendingIds.shift();
  const entry = readQueue().find(e => e.id === id);
  if (!entry) return pump();

  current = id;
  lastStep = null;
  setStatus(id, "working", { startedAt: new Date().toISOString(), step: null });
  log(`worker ▶ ${id} · ${entry.file || "unlocated"}`);

  const sent = sendToWorker(["<request>", JSON.stringify(entry, null, 2), "</request>"].join("\n"));
  if (!sent) { current = null; pendingIds.unshift(id); return; }  // pipe gone; close handler restarts it

  // If it hasn't finished in time, restart the worker. Killing it is the only way to interrupt a
  // turn — but the session is lost, so this is a last resort, not routine flow control.
  clearTimeout(deadline);
  deadline = setTimeout(() => {
    if (current !== id) return;
    log(`worker ⏱ ${id} timed out after ${Math.round(REQUEST_TIMEOUT_MS / 1000)}s — restarting it`);
    current = null;                          // so onWorkerClose doesn't also re-queue it
    if (worker) { try { worker.stdin.end(); } catch {} worker.kill(); }
    finish(id, false, `timed out after ${Math.round(REQUEST_TIMEOUT_MS / 60000)} min. It may have `
      + `tried a tool it is not allowed (only ${WORKER_TOOLS}). Any edits it already saved are kept.`);
  }, REQUEST_TIMEOUT_MS);
}

function finish(id, ok, note) {
  clearTimeout(deadline); deadline = null;
  if (ok) {
    setStatus(id, "done", { finishedAt: new Date().toISOString(), step: null, note });
    log(`worker ✓ ${id}${note ? " — " + note.split("\n")[0].slice(0, 90) : ""}`);
  } else {
    setStatus(id, "failed", { finishedAt: new Date().toISOString(), step: null, error: note });
    log(`worker ✗ ${id}: ${note}`);
  }
  restarts = 0;                  // it completed something, so it isn't in a crash loop
  pump();
}

// ---- watch the content files, debounced (one save can fire several events) ----
let pending = null;
const changed = new Set();

function onChange(file) {
  if (!file) return;
  if (!/\.(js|html|css)$/.test(file)) return;
  changed.add(file);
  clearTimeout(pending);
  pending = setTimeout(() => {
    const files = [...changed];
    changed.clear();
    log(`changed: ${files.join(", ")} → reloading ${clients.size} tab(s)`);
    broadcast("reload", { files });
  }, 250);
}

function watch() {
  const lessons = path.join(ROOT, "lessons");
  try {
    fs.watch(lessons, (_e, f) => onChange(f && `lessons/${f}`));
    fs.watch(ROOT, (_e, f) => { if (f === "index.html") onChange(f); });
    log(`watching lessons/ and index.html`);
  } catch (e) {
    log(`could not start watcher: ${e.message} (live reload disabled)`);
  }
  // The queue file is the progress state, and this server is not its only writer — a
  // /loop running the tutor-inbox skill edits it too. Watch it so the dock reflects that
  // work as well, not just the built-in worker's.
  try {
    fs.mkdirSync(path.dirname(QUEUE), { recursive: true });
    if (!fs.existsSync(QUEUE)) fs.writeFileSync(QUEUE, "");
    let qt = null;
    fs.watch(QUEUE, () => {
      clearTimeout(qt);
      qt = setTimeout(() => broadcast("queue", activeEntries()), 120);
    });
  } catch (e) {
    log(`could not watch the queue file: ${e.message}`);
  }
}

// ---- request handling --------------------------------------------------------
function serveStatic(req, res) {
  let rel = decodeURIComponent(new URL(req.url, "http://x").pathname);
  if (rel === "/") rel = "/index.html";
  const file = path.join(ROOT, rel);
  // never serve outside the repo
  if (!file.startsWith(ROOT + path.sep)) return send(res, 403, "forbidden");

  fs.stat(file, (err, st) => {
    if (err || !st.isFile()) return send(res, 404, `not found: ${rel}`);
    res.writeHead(200, {
      "Content-Type": MIME[path.extname(file).toLowerCase()] || "application/octet-stream",
      "Content-Length": st.size,
      "Cache-Control": "no-cache",   // always re-read edited lesson files
    });
    fs.createReadStream(file).pipe(res);
  });
}

function send(res, code, body, type = "text/plain; charset=utf-8") {
  res.writeHead(code, { "Content-Type": type });
  res.end(body);
}

function readBody(req, limit = 1e6) {
  return new Promise((resolve, reject) => {
    let buf = "";
    req.on("data", c => {
      buf += c;
      if (buf.length > limit) { reject(new Error("body too large")); req.destroy(); }
    });
    req.on("end", () => resolve(buf));
    req.on("error", reject);
  });
}

async function handleAsk(req, res) {
  let body;
  try { body = JSON.parse(await readBody(req)); }
  catch (e) { return send(res, 400, `bad request: ${e.message}`); }

  const { fileHint, lessonId, section, quote, question } = body || {};
  if (!quote || !String(quote).trim()) return send(res, 400, "missing quote");

  const q = String(quote).trim();
  const loc = resolveFile(q, fileHint || null, lessonId || null);

  const entry = {
    id: crypto.randomUUID().slice(0, 8),
    ts: new Date().toISOString(),
    status: "queued",
    worker: !NO_WORKER,                 // false → the page tells you to run /loop yourself
    file: loc.file,                     // where the prose actually lives, found on disk
    resolved: loc.resolved,             // false → treat `file` as a guess and grep instead
    lessonId: lessonId || null,
    section: section || null,
    quote: q,
    question: String(question || "").trim() || "Explain this in more detail.",
  };
  if (loc.why) entry.why = loc.why;
  if (loc.candidates) entry.candidates = loc.candidates;
  if (loc.alsoIn) entry.alsoIn = loc.alsoIn;
  if (fileHint && fileHint !== loc.file) entry.fileHint = fileHint;

  fs.mkdirSync(path.dirname(QUEUE), { recursive: true });
  fs.appendFileSync(QUEUE, JSON.stringify(entry) + "\n");
  log(`queued ${entry.id} · ${entry.file || "unlocated"}${entry.resolved ? "" : " (unresolved)"} · "${entry.quote.slice(0, 50)}…"`);
  broadcast("queue", activeEntries());
  enqueueWork(entry.id);                // acted on now, not on the next poll
  send(res, 200, JSON.stringify({ ok: true, id: entry.id }), MIME[".json"]);
}

function handleEvents(req, res) {
  res.writeHead(200, {
    "Content-Type": "text/event-stream",
    "Cache-Control": "no-cache",
    Connection: "keep-alive",
  });
  res.write("retry: 1000\n\n");
  clients.add(res);
  // A tab that just reloaded needs the current state, not only future changes.
  try { res.write(`event: queue\ndata: ${JSON.stringify(activeEntries())}\n\n`); } catch {}
  const ping = setInterval(() => { try { res.write(": ping\n\n"); } catch {} }, 25000);
  req.on("close", () => { clearInterval(ping); clients.delete(res); });
}

const server = http.createServer((req, res) => {
  const { pathname } = new URL(req.url, "http://x");
  if (req.method === "POST" && pathname === "/ask") return handleAsk(req, res);
  if (req.method === "GET" && pathname === "/events") return handleEvents(req, res);
  if (req.method === "GET" && pathname === "/queue") return send(res, 200, JSON.stringify(activeEntries()), MIME[".json"]);
  if (req.method === "GET" || req.method === "HEAD") return serveStatic(req, res);
  send(res, 405, "method not allowed");
});

function log(msg) { process.stdout.write(`[tutor] ${msg}\n`); }

module.exports = { resolveFile, letters };
if (require.main !== module) return;   // required by a test — don't take the port

server.listen(PORT, "127.0.0.1", () => {
  log(`serving ${ROOT}`);
  log(`open http://localhost:${PORT}`);
  log(`questions queue → ${path.relative(ROOT, QUEUE)}`);
  log(NO_WORKER
    ? `worker OFF (--no-worker) — drain the queue yourself with: /loop 60s /tutor-inbox`
    : `worker ON — each question runs "claude -p" immediately (tools: ${WORKER_TOOLS})`);
  watch();
  startWorker();
  recover();
});

// The worker is a child of this process and should not outlive it.
for (const sig of ["SIGINT", "SIGTERM"]) {
  process.on(sig, () => {
    if (shuttingDown) process.exit(1);
    shuttingDown = true;
    log("shutting down — stopping the worker");
    if (worker) { try { worker.stdin.end(); } catch {} worker.kill(); }
    server.close(() => process.exit(0));
    setTimeout(() => process.exit(0), 1500).unref();
  });
}

server.on("error", e => {
  if (e.code === "EADDRINUSE") log(`port ${PORT} is busy — try: node tools/tutor-server.js ${PORT + 1}`);
  else log(`server error: ${e.message}`);
  process.exit(1);
});
