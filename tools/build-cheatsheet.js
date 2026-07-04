/* =====================================================================
   build-cheatsheet.js  —  fresh, dependency-free generator for the
   "AI Cheat Sheet" section. Converts the 6 Markdown lessons in
   topics/lessons/ into ONE file, lessons/cheatsheet.js, whose objects are
   pushed into window.LESSONS so the main app renders them in its content
   pane (module "AI Cheat Sheet", template "cheatsheet"). Math ($...$ /
   $$...$$) is preserved raw for MathJax; code fences go to highlight.js.
   Nothing here is shared with the app's own lesson engine.
   Run:  node tools/build-cheatsheet.js
   ===================================================================== */
"use strict";
const fs = require("fs");
const path = require("path");

const ROOT = path.resolve(__dirname, "..");
const SRC = path.join(ROOT, "topics", "lessons");
const OUT = path.join(ROOT, "lessons", "cheatsheet.js");
const NB_DIR = path.join(ROOT, "topics", "notebooks");
const REPO = "niamleeson/ml-math", BRANCH = "main";

// Ordered lessons for this section (fresh nav labels + blurbs).
const LESSONS = [
  { file: "02-discrete-random-variables", nav: "Discrete Random Variables", badge: "🧮", type: "Numeric", source: "Probability · MIT" },
  { file: "07-support-vector-machines", nav: "Support Vector Machines", badge: "⚖️", type: "Both", source: "CS 229" },
  { file: "11-clustering", nav: "Clustering", badge: "💻", type: "Colab", source: "CS 229" },
  { file: "14-ml-metrics", nav: "ML Metrics", badge: "🧮", type: "Numeric", source: "CS 229" },
  { file: "32-search-optimization", nav: "Search Optimization", badge: "💻", type: "Colab", source: "CS 221" },
  { file: "33-markov-decision-processes", nav: "MDPs & Q-learning", badge: "⚖️", type: "Both", source: "CS 221" },
];

/* ---------- tiny Markdown -> HTML converter (math/code aware) ---------- */
function esc(s) { return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;"); }

function inline(text) {
  let t = esc(text);
  t = t.replace(/&lt;br\s*\/?&gt;/g, "<br>");
  t = t.replace(/!\[([^\]]*)\]\(([^)]+)\)/g, '<img alt="$1" src="$2">');
  t = t.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>');
  t = t.replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>");
  t = t.replace(/(^|[^*])\*([^*\n]+)\*/g, "$1<em>$2</em>");
  return t;
}

function convert(md) {
  const code = [], disp = [], icode = [], imath = [];
  md = md.replace(/```(\w*)\n([\s\S]*?)```/g, (m, lang, c) => { code.push({ lang: lang || "text", c }); return "\n\u0000c" + (code.length - 1) + "\u0000\n"; });
  md = md.replace(/\$\$([\s\S]*?)\$\$/g, (m, x) => { disp.push(x); return "\u0000m" + (disp.length - 1) + "\u0000"; });
  md = md.replace(/`([^`]+)`/g, (m, x) => { icode.push(x); return "\u0000j" + (icode.length - 1) + "\u0000"; });
  md = md.replace(/\$([^$\n]+?)\$/g, (m, x) => { imath.push(x); return "\u0000x" + (imath.length - 1) + "\u0000"; });

  const lines = md.split("\n");

  function parseBlocks(ls) {
    let out = "", k = 0;
    while (k < ls.length) {
      let line = ls[k];
      if (!line.trim()) { k++; continue; }
      let mc = line.match(/^\u0000c(\d+)\u0000$/);
      if (mc) { out += "\u0000c" + mc[1] + "\u0000\n"; k++; continue; }
      if (/^<[a-zA-Z\/]/.test(line.trim())) { out += line.trim() + "\n"; k++; continue; }
      let mh = line.match(/^(#{1,6})\s+(.*)$/);
      if (mh) { const lvl = mh[1].length; out += "<h" + lvl + ">" + inline(mh[2].trim()) + "</h" + lvl + ">\n"; k++; continue; }
      if (/^(-{3,}|\*{3,}|_{3,})$/.test(line.trim())) { out += "<hr>\n"; k++; continue; }
      if (/^>\s?/.test(line)) {
        const buf = [];
        while (k < ls.length && /^>\s?/.test(ls[k])) { buf.push(ls[k].replace(/^>\s?/, "")); k++; }
        out += "<blockquote>\n" + parseBlocks(buf) + "</blockquote>\n"; continue;
      }
      if (line.indexOf("|") !== -1 && k + 1 < ls.length && /^\s*\|?[\s:|-]+\|?\s*$/.test(ls[k + 1]) && ls[k + 1].indexOf("-") !== -1) {
        const cells = (r) => r.trim().replace(/^\|/, "").replace(/\|$/, "").split("|").map((c) => c.trim());
        const header = cells(line);
        k += 2;
        let thead = "<thead><tr>" + header.map((c) => "<th>" + inline(c) + "</th>").join("") + "</tr></thead>";
        let body = "";
        while (k < ls.length && ls[k].indexOf("|") !== -1 && ls[k].trim()) {
          const row = cells(ls[k]);
          body += "<tr>" + row.map((c) => "<td>" + inline(c) + "</td>").join("") + "</tr>"; k++;
        }
        out += "<table>" + thead + "<tbody>" + body + "</tbody></table>\n"; continue;
      }
      if (/^\s*([-*+]|\d+\.)\s+/.test(line)) {
        const items = [];
        while (k < ls.length && /^\s*([-*+]|\d+\.)\s+/.test(ls[k])) {
          const m = ls[k].match(/^(\s*)([-*+]|\d+\.)\s+(.*)$/);
          items.push({ indent: m[1].length, ordered: /\d+\./.test(m[2]), text: m[3] });
          k++;
        }
        out += buildList(items) + "\n"; continue;
      }
      const buf = [];
      while (k < ls.length && ls[k].trim() && !/^(#{1,6}\s|>\s?|\s*([-*+]|\d+\.)\s|-{3,}$)/.test(ls[k]) && !/^\u0000c\d+\u0000$/.test(ls[k].trim()) && !/^<[a-zA-Z\/]/.test(ls[k].trim())) {
        buf.push(ls[k]); k++;
      }
      if (buf.length) out += "<p>" + inline(buf.join(" ")) + "</p>\n";
      else { k++; }
    }
    return out;
  }

  function buildList(items) {
    let idx = 0;
    function build(minIndent) {
      const ordered = items[idx].ordered;
      let h = ordered ? "<ol>" : "<ul>";
      while (idx < items.length && items[idx].indent >= minIndent) {
        const cur = items[idx];
        if (cur.indent > minIndent) { h += build(cur.indent); continue; }
        idx++;
        let li = "<li>" + inline(cur.text);
        if (idx < items.length && items[idx].indent > cur.indent) li += build(items[idx].indent);
        li += "</li>";
        h += li;
      }
      h += ordered ? "</ol>" : "</ul>";
      return h;
    }
    return build(items[0].indent);
  }

  // Extract + drop the first H1 (rendered by the app as the lesson title).
  let title = "";
  const firstH1 = lines.findIndex((l) => /^#\s+/.test(l));
  if (firstH1 !== -1) { title = lines[firstH1].replace(/^#\s+/, "").trim(); lines.splice(firstH1, 1); }

  let html = parseBlocks(lines);
  html = html.replace(/\u0000c(\d+)\u0000/g, (m, n) => '<pre><code class="language-' + code[n].lang + '">' + esc(code[n].c.replace(/\n$/, "")) + "</code></pre>");
  html = html.replace(/\u0000m(\d+)\u0000/g, (m, n) => "$$" + disp[n] + "$$");
  html = html.replace(/\u0000j(\d+)\u0000/g, (m, n) => "<code>" + esc(icode[n]) + "</code>");
  html = html.replace(/\u0000x(\d+)\u0000/g, (m, n) => "$" + imath[n] + "$");
  html = html.replace(/\.\.\/\.\.\/ai-ml-cheatsheets\.md/g, "ai-ml-cheatsheets.md");
  // Drop the leading breadcrumb / Colab-badge blockquotes (shown as the app meta line instead).
  html = html.replace(/^\s*(?:<blockquote>[\s\S]*?<\/blockquote>\s*)+/, "");
  return { title, html: html.trim() };
}

/* ---------- Markdown -> runnable .ipynb (for 💻 / ⚖️ lessons) ---------- */
function nbSource(text) {
  const lines = text.split("\n");
  return lines.map((l, i) => (i < lines.length - 1 ? l + "\n" : l));
}
function mdToNotebook(md, title) {
  const cells = [];
  let mdbuf = [], code = [], inCode = false;
  function flushMd() {
    const kept = mdbuf.filter((l) => !/^>\s*(?:\*\*Source|📓)/.test(l) && !/colab-badge|Open In Colab/i.test(l));
    const txt = kept.join("\n").trim();
    mdbuf = [];
    if (txt) cells.push({ cell_type: "markdown", metadata: {}, source: nbSource(txt) });
  }
  md.split("\n").forEach((line) => {
    const open = line.match(/^```(\w*)\s*$/);
    if (!inCode && open && /^(python|py)$/i.test(open[1])) { flushMd(); inCode = true; code = []; return; }
    if (inCode && /^```\s*$/.test(line)) { cells.push({ cell_type: "code", metadata: {}, execution_count: null, outputs: [], source: nbSource(code.join("\n")) }); inCode = false; return; }
    if (inCode) code.push(line); else mdbuf.push(line);
  });
  flushMd();
  return {
    cells: cells,
    metadata: {
      colab: { name: title, provenance: [], toc_visible: true },
      kernelspec: { name: "python3", display_name: "Python 3" },
      language_info: { name: "python" }
    },
    nbformat: 4, nbformat_minor: 0
  };
}

/* ---------- build the registration file ---------- */
const data = LESSONS.map((m, i) => {
  const md = fs.readFileSync(path.join(SRC, m.file + ".md"), "utf8");
  const hasNb = m.type === "Colab" || m.type === "Both";
  let title, html;
  if (hasNb) {
    // Split at the hands-on section (## 3.). Everything from there lives ONLY in the
    // notebook, so the lesson page never duplicates the notebook's content.
    const lines = md.split("\n");
    const s3 = lines.findIndex((l) => /^##\s+3\./.test(l));
    const pre = (s3 === -1 ? lines : lines.slice(0, s3)).join("\n");
    const hands = s3 === -1 ? "" : lines.slice(s3).join("\n");
    const conv = convert(pre);          // page keeps only Overview + Key Idea
    title = conv.title || m.nav;
    // 1) runnable notebook = the whole hands-on section (+ a short title / intro)
    if (!fs.existsSync(NB_DIR)) fs.mkdirSync(NB_DIR, { recursive: true });
    const nbMd = "# " + title + " — hands-on notebook\n\n> Runnable companion for the **" + title +
      "** lesson in the AI Cheat Sheet. The lesson page has the concept overview; this is the lab.\n\n" + hands;
    fs.writeFileSync(path.join(NB_DIR, m.file + ".ipynb"), JSON.stringify(mdToNotebook(nbMd, title), null, 1));
    // 2) lesson page hands-on section = just a Colab button + an index of what's inside
    const url = "https://colab.research.google.com/github/" + REPO + "/blob/" + BRANCH + "/topics/notebooks/" + m.file + ".ipynb";
    const btn = '<p class="cs-colab"><a class="cs-colab-btn" href="' + url + '" target="_blank" rel="noopener">▶ Open the runnable notebook in Google Colab</a></p>';
    const exs = (hands.match(/^#{3,4}\s+[EA]\d+\..*$/gm) || []).map((h) => "<li>" + esc(h.replace(/^#{3,4}\s+/, "").trim()) + "</li>").join("");
    const list = exs ? '<p>It builds these step by step, with commented code and plots:</p><ul class="cs-nb-list">' + exs + "</ul>" : "";
    html = conv.html + "\n<h2>3. Hands-on Notebook</h2>\n" + btn + list;
  } else {
    const conv = convert(md);
    title = conv.title || m.nav;
    html = conv.html;
  }
  return {
    id: "cs-" + m.file,
    title: title,
    module: "AI Cheat Sheet",
    template: "cheatsheet",
    meta: m.badge + " " + m.type + " · " + m.source,
    prevId: i > 0 ? "cs-" + LESSONS[i - 1].file : "",
    nextId: i < LESSONS.length - 1 ? "cs-" + LESSONS[i + 1].file : "",
    html: html,
  };
});

const banner = "/* AUTO-GENERATED by tools/build-cheatsheet.js from topics/lessons/*.md — do not edit by hand. */\n";
const js = banner +
  "(function () {\n" +
  "  var L = (window.LESSONS = window.LESSONS || []);\n" +
  "  var data = " + JSON.stringify(data, null, 0) + ";\n" +
  "  data.forEach(function (o) { L.push(o); });\n" +
  "})();\n";

fs.writeFileSync(OUT, js);
console.log("wrote lessons/cheatsheet.js  (" + data.length + " lessons, " + (js.length / 1024).toFixed(0) + " KB)");
data.forEach((d) => console.log("  " + d.id + "  —  " + d.title));
