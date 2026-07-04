/* =====================================================================
   build-cheatsheet.js  —  fresh, dependency-free generator for the
   "AI Cheat Sheet" section. Converts the 6 Markdown lessons in
   topics/lessons/ into standalone HTML pages under cheatsheet/, plus a
   section index. Math ($...$ / $$...$$) is preserved raw for MathJax and
   code fences are handed to highlight.js. Nothing here is shared with the
   main app's lesson engine — it is written specifically for this section.
   Run:  node tools/build-cheatsheet.js
   ===================================================================== */
"use strict";
const fs = require("fs");
const path = require("path");

const ROOT = path.resolve(__dirname, "..");
const SRC = path.join(ROOT, "topics", "lessons");
const OUT = path.join(ROOT, "cheatsheet");

// Ordered list of the lessons in this section (fresh nav labels + blurbs).
const LESSONS = [
  { file: "02-discrete-random-variables", nav: "Discrete Random Variables", badge: "🧮", type: "Numeric", source: "Probability · MIT", blurb: "PMFs, expectation, variance, and the standard discrete distributions." },
  { file: "07-support-vector-machines", nav: "Support Vector Machines", badge: "⚖️", type: "Both", source: "CS 229", blurb: "Max-margin classification, the kernel trick, and soft margins." },
  { file: "11-clustering", nav: "Clustering", badge: "💻", type: "Colab", source: "CS 229", blurb: "k-means from scratch, EM, hierarchical clustering, and choosing k." },
  { file: "14-ml-metrics", nav: "ML Metrics", badge: "🧮", type: "Numeric", source: "CS 229", blurb: "Confusion matrices, precision / recall / F1, ROC-AUC, R², AIC/BIC." },
  { file: "32-search-optimization", nav: "Search Optimization", badge: "💻", type: "Colab", source: "CS 221", blurb: "BFS, DFS, uniform-cost, and A* search with admissible heuristics." },
  { file: "33-markov-decision-processes", nav: "MDPs & Q-learning", badge: "⚖️", type: "Both", source: "CS 221", blurb: "Bellman equations, value & policy iteration, and Q-learning." },
];

/* ---------- tiny Markdown -> HTML converter (math/code aware) ---------- */
function esc(s) { return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;"); }

function inline(text) {
  let t = esc(text);
  t = t.replace(/&lt;br\s*\/?&gt;/g, "<br>");                 // allow the one inline raw tag used in tables
  t = t.replace(/!\[([^\]]*)\]\(([^)]+)\)/g, '<img alt="$1" src="$2">');
  t = t.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>');
  t = t.replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>");
  t = t.replace(/(^|[^*])\*([^*\n]+)\*/g, "$1<em>$2</em>");   // italic, not touching ** already consumed
  return t;
}

function slug(s) { return s.toLowerCase().replace(/[^\w\s-]/g, "").replace(/\s+/g, "-"); }

function convert(md) {
  const code = [], disp = [], icode = [], imath = [];
  // Protect (order matters): fenced code -> display math -> inline code -> inline math
  md = md.replace(/```(\w*)\n([\s\S]*?)```/g, (m, lang, c) => { code.push({ lang: lang || "text", c }); return "\n\u0000c" + (code.length - 1) + "\u0000\n"; });
  md = md.replace(/\$\$([\s\S]*?)\$\$/g, (m, x) => { disp.push(x); return "\u0000m" + (disp.length - 1) + "\u0000"; });
  md = md.replace(/`([^`]+)`/g, (m, x) => { icode.push(x); return "\u0000j" + (icode.length - 1) + "\u0000"; });
  md = md.replace(/\$([^$\n]+?)\$/g, (m, x) => { imath.push(x); return "\u0000x" + (imath.length - 1) + "\u0000"; });

  const lines = md.split("\n");
  let html = "", i = 0, title = "";

  function parseBlocks(ls) {
    let out = "", k = 0;
    while (k < ls.length) {
      let line = ls[k];
      if (!line.trim()) { k++; continue; }
      // standalone protected code block
      let mc = line.match(/^\u0000c(\d+)\u0000$/);
      if (mc) { out += "\u0000c" + mc[1] + "\u0000\n"; k++; continue; }
      // raw HTML line (e.g. <details>, </details>, <summary>..., <div>)
      if (/^<[a-zA-Z\/]/.test(line.trim())) { out += line.trim() + "\n"; k++; continue; }
      // heading
      let mh = line.match(/^(#{1,6})\s+(.*)$/);
      if (mh) { const lvl = mh[1].length; out += "<h" + lvl + ">" + inline(mh[2].trim()) + "</h" + lvl + ">\n"; k++; continue; }
      // hr
      if (/^(-{3,}|\*{3,}|_{3,})$/.test(line.trim())) { out += "<hr>\n"; k++; continue; }
      // blockquote
      if (/^>\s?/.test(line)) {
        const buf = [];
        while (k < ls.length && /^>\s?/.test(ls[k])) { buf.push(ls[k].replace(/^>\s?/, "")); k++; }
        out += "<blockquote>\n" + parseBlocks(buf) + "</blockquote>\n"; continue;
      }
      // table: header row + separator
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
      // list (ordered / unordered, nested by indent)
      if (/^\s*([-*+]|\d+\.)\s+/.test(line)) {
        const items = [];
        while (k < ls.length && /^\s*([-*+]|\d+\.)\s+/.test(ls[k])) {
          const m = ls[k].match(/^(\s*)([-*+]|\d+\.)\s+(.*)$/);
          items.push({ indent: m[1].length, ordered: /\d+\./.test(m[2]), text: m[3] });
          k++;
        }
        out += buildList(items) + "\n"; continue;
      }
      // paragraph: gather until blank / block start
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

  // Pull the first H1 out as the page title (rendered by the template header).
  const firstH1 = lines.findIndex((l) => /^#\s+/.test(l));
  if (firstH1 !== -1) { title = lines[firstH1].replace(/^#\s+/, "").trim(); lines.splice(firstH1, 1); }

  html = parseBlocks(lines);

  // Restore protected spans
  html = html.replace(/\u0000c(\d+)\u0000/g, (m, n) => '<pre><code class="language-' + code[n].lang + '">' + esc(code[n].c.replace(/\n$/, "")) + "</code></pre>");
  html = html.replace(/\u0000m(\d+)\u0000/g, (m, n) => "$$" + disp[n] + "$$");
  html = html.replace(/\u0000j(\d+)\u0000/g, (m, n) => "<code>" + esc(icode[n]) + "</code>");
  html = html.replace(/\u0000x(\d+)\u0000/g, (m, n) => "$" + imath[n] + "$");
  // Fix the reference breadcrumb path (was relative to topics/lessons/)
  html = html.replace(/\.\.\/\.\.\/ai-ml-cheatsheets\.md/g, "../ai-ml-cheatsheets.md");
  return { title, html };
}

/* ---------- page + index templates (fresh B&W styling) ---------- */
const HEAD = (title, extraCss) => `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<title>${title} — AI Cheat Sheet</title>
<script>
  window.MathJax = {
    tex: { inlineMath: [['$', '$'], ['\\\\(', '\\\\)']], displayMath: [['$$', '$$'], ['\\\\[', '\\\\]']], processEscapes: true },
    svg: { fontCache: 'global' },
    options: { skipHtmlTags: ['script', 'noscript', 'style', 'textarea', 'pre', 'code'] }
  };
</script>
<script id="MathJax-script" async src="https://cdn.jsdelivr.net/npm/mathjax@3/es5/tex-svg.js"></script>
<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/highlightjs/cdn-release@11.10.0/build/styles/atom-one-dark.min.css" />
<script defer src="https://cdn.jsdelivr.net/gh/highlightjs/cdn-release@11.10.0/build/highlight.min.js"></script>
<script defer src="https://cdn.jsdelivr.net/gh/highlightjs/cdn-release@11.10.0/build/languages/python.min.js"></script>
<style>
  :root { --line:#111; --rule:#d9d9d9; --muted:#555; --link:#0b5cad; --link2:#083e75; }
  * { box-sizing: border-box; }
  body { margin:0; background:#fff; color:#111;
         font-family: Georgia, "Times New Roman", serif; line-height:1.65; }
  .topbar { position:sticky; top:0; z-index:5; display:flex; align-items:center; gap:14px;
            background:#fff; border-bottom:1px solid var(--rule); padding:10px 20px;
            font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,sans-serif; font-size:14px; }
  .topbar a { color:var(--link); text-decoration:none; }
  .topbar a:hover { text-decoration:underline; }
  .topbar .sep { color:#bbb; }
  .topbar .here { color:#111; font-weight:600; }
  main { max-width: 820px; margin: 0 auto; padding: 28px 22px 100px; }
  h1 { font-size: 34px; line-height:1.15; margin: 6px 0 6px; }
  h2 { font-size: 25px; margin: 40px 0 10px; padding-bottom:6px; border-bottom:1px solid var(--rule); }
  h3 { font-size: 20px; margin: 30px 0 8px; }
  h4 { font-size: 17px; margin: 24px 0 6px; }
  p, li { font-size: 18px; }
  a { color: var(--link); }
  a:hover { color: var(--link2); }
  strong { font-weight: 700; }
  hr { border:0; border-top:1px solid var(--rule); margin: 34px 0; }
  blockquote { margin: 16px 0; padding: 6px 16px; border-left:3px solid #111; color:var(--muted);
               font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,sans-serif; font-size:15px; }
  blockquote p { font-size: 15px; margin: 4px 0; }
  code { font-family: "SF Mono", ui-monospace, Menlo, Consolas, monospace; font-size: 0.86em;
         background:#f2f2f2; padding: 1px 5px; border-radius: 4px; }
  pre { margin: 16px 0; border-radius: 8px; overflow:auto; }
  pre code { display:block; background:#282c34; padding:16px 18px; font-size:13.5px; line-height:1.55; border-radius:8px; }
  table { border-collapse: collapse; width:100%; margin: 18px 0; font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,sans-serif; font-size:15px; }
  th, td { border:1px solid var(--rule); padding: 8px 11px; text-align:left; vertical-align:top; }
  thead th { border-bottom:2px solid #111; font-weight:700; }
  details { margin: 18px 0; border:1px solid var(--rule); border-radius:8px; padding: 8px 14px; }
  summary { cursor:pointer; font-weight:700; font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,sans-serif; }
  img { max-width:100%; }
  .pager { display:flex; justify-content:space-between; gap:12px; margin-top:56px; border-top:1px solid var(--rule); padding-top:18px;
           font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,sans-serif; font-size:14px; }
  .pager a { display:inline-block; padding:10px 14px; border:1px solid var(--rule); border-radius:8px; color:var(--link); text-decoration:none; }
  .pager a:hover { border-color:var(--link); }
  .pager .spacer { flex:1; }
  mjx-container { color:#111; }
  ${extraCss || ""}
</style>
</head>`;

const FOOT = `<script>window.addEventListener('load',function(){if(window.hljs){document.querySelectorAll('pre code').forEach(function(b){try{hljs.highlightElement(b);}catch(e){}});}});</script>
</body></html>`;

function lessonPage(meta, idx) {
  const md = fs.readFileSync(path.join(SRC, meta.file + ".md"), "utf8");
  const { title, html } = convert(md);
  const prev = LESSONS[idx - 1], next = LESSONS[idx + 1];
  const pager =
    '<nav class="pager">' +
    (prev ? '<a href="' + prev.file + '.html">← ' + prev.nav + "</a>" : '<span></span>') +
    '<span class="spacer"></span>' +
    (next ? '<a href="' + next.file + '.html">' + next.nav + " →</a>" : '<span></span>') +
    "</nav>";
  const body =
    HEAD(title) + "\n<body>\n" +
    '<div class="topbar"><a href="../index.html">← ML Math</a><span class="sep">/</span>' +
    '<a href="index.html">AI Cheat Sheet</a><span class="sep">/</span><span class="here">' + esc(meta.nav) + "</span></div>\n" +
    "<main>\n<h1>" + esc(title) + "</h1>\n" +
    '<p style="font-family:-apple-system,BlinkMacSystemFont,\'Segoe UI\',Roboto,sans-serif;font-size:14px;color:#555;margin:0 0 26px;">' +
    meta.badge + " " + meta.type + " &nbsp;·&nbsp; " + esc(meta.source) + "</p>\n" +
    html + "\n" + pager + "\n</main>\n" + FOOT;
  fs.writeFileSync(path.join(OUT, meta.file + ".html"), body);
  return title;
}

function indexPage() {
  const groups = { Numeric: [], Colab: [], Both: [] };
  LESSONS.forEach((l) => groups[l.type].push(l));
  const label = { Numeric: "🧮 Numeric (pen-and-paper)", Colab: "💻 Colab (code + visualizations)", Both: "⚖️ Both (derive, then implement)" };
  let cards = "";
  ["Numeric", "Colab", "Both"].forEach((g) => {
    if (!groups[g].length) return;
    cards += "<h2>" + label[g] + "</h2>\n<div class=\"cards\">\n";
    groups[g].forEach((l) => {
      cards += '<a class="card" href="' + l.file + '.html"><span class="ct">' + esc(l.nav) + '</span>' +
        '<span class="cs">' + esc(l.source) + '</span><span class="cb">' + esc(l.blurb) + "</span></a>\n";
    });
    cards += "</div>\n";
  });
  const extra = `
  .lede { font-size:19px; color:#333; margin: 4px 0 10px; }
  .cards { display:grid; grid-template-columns: repeat(auto-fill,minmax(320px,1fr)); gap:14px; margin: 10px 0 26px; }
  .card { display:flex; flex-direction:column; gap:5px; border:1px solid var(--rule); border-radius:10px; padding:16px 18px; text-decoration:none; color:#111; background:#fff; }
  .card:hover { border-color:#111; }
  .card .ct { font-size:19px; font-weight:700; }
  .card .cs { font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif; font-size:12px; letter-spacing:.02em; text-transform:uppercase; color:#777; }
  .card .cb { font-size:15px; color:#444; }`;
  const body =
    HEAD("AI Cheat Sheet", extra) + "\n<body>\n" +
    '<div class="topbar"><a href="../index.html">← ML Math</a><span class="sep">/</span><span class="here">AI Cheat Sheet</span></div>\n' +
    "<main>\n<h1>AI Cheat Sheet</h1>\n" +
    '<p class="lede">University-style lessons distilled from the Stanford CS 229 / 230 / 221 and MIT probability cheat sheets — each with fully worked easy &amp; advanced examples, and runnable code where it helps.</p>\n' +
    cards + "\n</main>\n" + FOOT;
  fs.writeFileSync(path.join(OUT, "index.html"), body);
}

/* ---------- run ---------- */
if (!fs.existsSync(OUT)) fs.mkdirSync(OUT, { recursive: true });
LESSONS.forEach((m, i) => { const t = lessonPage(m, i); console.log("wrote cheatsheet/" + m.file + ".html  (" + t + ")"); });
indexPage();
console.log("wrote cheatsheet/index.html");
console.log("done: " + (LESSONS.length + 1) + " pages");
