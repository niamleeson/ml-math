# ✦ Ask Claude — highlight a passage, watch the lesson rewrite itself

Highlight any text in a lesson, type what's confusing, and Claude Code edits the lesson file
while you watch. The tab reloads itself at the same lesson and scroll position, so the paragraph
changes in front of you.

---

## The commands

One terminal.

```bash
yarn run dev
```

That's `node tools/tutor-server.js` under the hood — no dependencies, nothing to install first.
Then open **http://localhost:8080** in your browser (not `index.html` directly — the loop needs http).

Pass a port if 8080 is busy:

```bash
yarn run dev 8081              # or: node tools/tutor-server.js 8081
```

**Every question is acted on the moment you send it.** The server starts **one** headless Claude
Code worker at boot and keeps it alive for as long as the server runs, feeding it each question
over a streaming stdin. No polling, no second terminal, no per-question cold start.

Because it is one continuous session, it also **remembers your earlier questions** — "do the same
thing to this one" works, and it carries the house style it learned from the last edit into the
next. First question in a session takes ~11s; later ones ~7s.

A progress dock in the bottom-right shows where each request is, including the tool it is running
right now (`Edit course-diffusion-01.js`).

To stop: **Ctrl-C**. That stops the server and the worker together.

### Driving it from a Claude Code session instead

If you'd rather have your own interactive Claude Code handle the questions (so it keeps the
conversation context, and you can watch and interrupt it):

```bash
yarn run dev --no-worker
```

…and in a Claude Code terminal: `/loop 60s /tutor-inbox`. The progress dock works the same way —
the server watches the queue file, so it reports whatever is draining it.

---

## Using it

1. **Highlight** a sentence or paragraph in any lesson. A small **✦ Ask Claude** button appears
   just above your selection. (Keyboard: select, then **⌘⇧A**.)
2. **Click it.** A panel opens showing exactly which file and section you're pointing at.
3. **Type what you want.** Anything you'd say out loud:
   - *"expand this"*
   - *"why is this step true?"*
   - *"you lost me at the second line — add a worked example"*
   - *"this contradicts part 4"*

   Leave it blank and it defaults to *"Explain this in more detail."*
4. **Send** (or **⌘↵**). A card appears in the **progress dock**, bottom-right:

   | | |
   |---|---|
   | ◷ **Queued** | waiting for the request ahead of it |
   | ◐ **Claude is working** | elapsed time, and the tool it is running right now |
   | ✓ **Lesson updated** | the tab has reloaded; clears itself after 6s |
   | ✗ **Failed** | with the reason; stays up until you reload |

5. Claude edits the lesson `.js`, the server sees the write, and your tab reloads — same lesson,
   same scroll position.

You can queue several questions in a row while you read. They run **one at a time, oldest first** —
two runs editing the same lesson file concurrently would clobber each other.

---

## How it works

```
browser                    tutor-server.js                  worker
────────                   ───────────────                  ──────
highlight text
  │                        locate file on disk
  └─ POST /ask ──────────► .claude/ask-queue.jsonl ───────► claude -p
       ▲                     (status: queued)               follows
       │                            │                       tutor-inbox
       │                            └─ status: working ─────► SKILL.md
   dock updates ◄─ SSE ◄────────────┘                          │
                                                               ├─ edits lessons/*.js
                           fs.watch(lessons/) ◄────────────────┘
                                  │                    status: done
  reload ◄─ SSE /events ◄─────────┘
  (hash + scroll restored)
```

The queue file **is** the progress state: the server watches it as well as writing it, so the dock
reflects whatever is doing the work — the built-in worker or a `/loop` you drive yourself.

Each queued question carries the exact coordinates of what you highlighted, so Claude never has
to guess which of the 600 lesson files you meant:

```json
{
  "id": "8ffc7dfe",
  "ts": "2026-08-02T00:35:46.595Z",
  "status": "pending",
  "file": "lessons/all-ml-content-part-01.js",
  "resolved": true,
  "lessonId": "1.1",
  "section": "Intuition",
  "quote": "the whole course stands on it",
  "question": "Expand this into two paragraphs with a worked 3-pixel example."
}
```

### How `file` is found — one mechanism, no special cases

The page **cannot** know this on its own. It knows which file *pushed* the lesson, but most prose
is merged in from elsewhere: derivations, practice, walkthroughs, code, codeviz, and the whole
`all-ml` family (whose lessons are assembled by `all-ml-register.js`, a file containing no prose
at all — body text lives in `all-ml-content-part-*.js`, applications in `all-ml-apps-part-*.js`).

So the server doesn't reason about any of that. It **searches `lessons/` for the quoted text**:

- Comparison is *letters only* — case, punctuation, whitespace, HTML tags, entities and doubled
  LaTeX backslashes are all stripped from both sides. A selection spanning `<b>…</b>` still matches.
- Files are read fresh on every request, and the tree is walked recursively, so **new lesson files,
  new subdirectories and new merge mechanisms are picked up with no code change.** This is the
  single property that keeps it working for lesson pages that don't exist yet.
- One match → `resolved: true`. Several → the lesson id breaks the tie (the file keyed to this
  lesson wins); still tied → `resolved: false` plus a `candidates` list. None → `resolved: false`
  with a `why`, which means you highlighted page chrome rather than lesson prose.

`section` follows the same principle: it's the nearest heading above your selection, found by
document position rather than a list of CSS classes, so new templates need no registration.

The page's own guess is still sent, as `fileHint` — but only as a tiebreaker. It is never trusted
over the disk.

Entries are marked `"status": "done"` once handled, so nothing is answered twice.

---

## The pieces

| File | What it does |
|---|---|
| `tools/tutor-server.js` | Static server + `POST /ask` + SSE `/events` + `fs.watch` on `lessons/`. Node built-ins only — nothing to install. |
| `index.html` | The `_src` stamp on the lesson registry, the selection widget (button / panel / toast), and the SSE reload client. |
| `.claude/skills/tutor-inbox/SKILL.md` | The Claude side: how to find the quote, rewrite in the file's house style, and mark the entry done. |
| `.claude/ask-queue.jsonl` | The queue *and* the progress state. Gitignored, local to your machine. |

### What the worker is allowed to do

It runs as `claude -p --input-format stream-json --output-format stream-json --verbose
--allowed-tools "Read,Edit,Grep,Glob" --permission-mode acceptEdits`, in the repo root. So it can
**read and edit files, and nothing else** — no Bash, no Write, no network, no new files. The skill
scopes it further to the one lesson file the request resolved to.

It is primed once at startup with the rules (read the skill, one request per message), then each
question is just the request JSON — so the skill file stays the single definition of the job, and
the worker doesn't re-read it 20 times a session.

Two things worth knowing: each question is a real Claude Code run, so it costs tokens; and edits
are applied without asking you first — that's the point of the loop, but it means you'll want the
repo in git (it is) so you can always see and revert what changed.

---

## Troubleshooting

**"port 8080 is busy"** — the server tells you the next command to try:
`node tools/tutor-server.js 8081`.

**The Ask button doesn't appear** — you need a selection of at least 3 characters, inside the
lesson body (`#content`). Selections in the sidebar are ignored on purpose.

**"No server running — prompt copied to clipboard"** — you're on `file://`, or the server isn't
up. This is the deliberate fallback: paste that clipboard text straight into Claude Code and it
has everything needed to make the edit. Nothing is lost.

**The tab doesn't reload after an edit** — check the server terminal. It logs
`changed: lessons/… → reloading N tab(s)` on every write. If N is 0, the tab lost its SSE
connection; reload once by hand and it reconnects.

**A card sits on ◷ Queued and never moves** — either a longer request is still running ahead of it
(they're serial), or you started the server with `--no-worker` and nothing is draining the queue.
The card says which.

**✗ Failed** — the reason is on the card, and the full output is in the server terminal. The most
common cause is `claude` not being on PATH for the shell that started the server.

**You changed `tools/tutor-server.js` and nothing behaves differently** — the server doesn't reload
itself. Ctrl-C and `yarn run dev` again. Questions asked just before a restart are **not** lost:
on boot the server adopts every unfinished entry in the queue (including one whose worker died
mid-run) and works through them.

**A stray `claude … stream-json` process after a hard kill** — Ctrl-C stops the worker cleanly, but
`kill -9` on the server leaves it orphaned. `pkill -f "input-format stream-json"` clears it.

---

## Not using it

Nothing here is load-bearing. Opening `index.html` by double-clicking still works exactly as it
always did — the widget detects `file://` and degrades to clipboard, the SSE client doesn't start,
and the `_src` stamp is a no-op you'll never see. Delete `tools/tutor-server.js` and the
`Ask Claude` blocks in `index.html` to remove it entirely.
