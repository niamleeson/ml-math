/* =====================================================================
   gen-formulas-lessons.js — build the "Formulas" section (first section
   under the "Math" supergroup) from vector-math-formulas.md.

   Converts vector-math-formulas.md into lessons/math-00-formulas.js, whose
   objects are pushed into window.LESSONS (module "Formulas", superGroup
   "Math", template "formulas"). One lesson per "# Part N", plus an Overview,
   a through-line closer, and a Practice-drills links page.

   Run:  node tools/gen-formulas-lessons.js
   ===================================================================== */
"use strict";
const fs = require("fs");
const path = require("path");

const ROOT = path.resolve(__dirname, "..");
const SRC = path.join(ROOT, "vector-math-formulas.md");
const OUT = path.join(ROOT, "lessons", "math-00-formulas.js");
const REPO = "niamleeson/ml-math";

/* ---------- tiny Markdown -> HTML converter (same rules as build-curriculum.js) ---------- */
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

  let title = "";
  const firstH1 = lines.findIndex((l) => /^#\s+/.test(l));
  if (firstH1 !== -1) { title = lines[firstH1].replace(/^#\s+/, "").trim(); lines.splice(firstH1, 1); }

  let html = parseBlocks(lines);
  html = html.replace(/\u0000c(\d+)\u0000/g, (m, n) => '<pre><code class="language-' + code[n].lang + '">' + esc(code[n].c.replace(/\n$/, "")) + "</code></pre>");
  html = html.replace(/\u0000m(\d+)\u0000/g, (m, n) => "$$" + disp[n] + "$$");
  html = html.replace(/\u0000j(\d+)\u0000/g, (m, n) => "<code>" + esc(icode[n]) + "</code>");
  html = html.replace(/\u0000x(\d+)\u0000/g, (m, n) => "$" + imath[n] + "$");
  return { title, html: html.trim() };
}

/* ---------- split the source into sections and build lessons ---------- */
const raw = fs.readFileSync(SRC, "utf8");
// Split before every top-level "# " heading (intro, each "# Part N", "# The through-line").
const chunks = raw.split(/\n(?=# )/).map((c) => c.trim()).filter(Boolean);

const lessons = [];
chunks.forEach((chunk) => {
  const h1 = (chunk.match(/^#\s+(.*)$/m) || [, ""])[1].trim();
  const conv = convert(chunk);
  if (/^Vector Math Formulas/i.test(h1)) {
    lessons.push({ key: "00", title: "Overview & how to read", html: conv.html });
  } else if (/^Part\s+(\d+)/i.test(h1)) {
    const n = h1.match(/^Part\s+(\d+)/i)[1].padStart(2, "0");
    lessons.push({ key: n, title: h1, html: conv.html });
  } else if (/through-line/i.test(h1)) {
    lessons.push({ key: "97", title: "The through-line", html: "<h3>" + esc(h1) + "</h3>" + conv.html });
  }
});

// Practice-drills links page (points at the generated drills + self-checking notebook).
const colab = "https://colab.research.google.com/github/" + REPO + "/blob/main/afp/notebooks/vector-math-drills.ipynb";
const nbGh = "https://github.com/" + REPO + "/blob/main/afp/notebooks/vector-math-drills.ipynb";
const drillsGh = "https://github.com/" + REPO + "/blob/main/vector-math-drills.md";
lessons.push({
  key: "98",
  title: "Practice drills (1,395 questions)",
  html:
    "<p>Every formula on these pages has <strong>5 basic, 5 easy, and 5 advanced</strong> " +
    "hand-solved questions — <strong>1,395 in total</strong> — each worked one step at a time.</p>" +
    "<ul>" +
    '<li><a href="' + colab + '">Open the self-checking notebook in Colab</a> ' +
    "(recomputes and asserts every answer).</li>" +
    '<li><a href="' + nbGh + '">View the notebook on GitHub</a>.</li>' +
    '<li><a href="' + drillsGh + '">Read all 1,395 questions and solutions (Markdown)</a>.</li>' +
    "</ul>" +
    "<p>The drills follow the same order as these formula pages: Part 1 building blocks " +
    "through Part 17 probability vectors.</p>",
});

// Order: Overview, Part 01..17, through-line, practice.
lessons.sort((a, b) => a.key.localeCompare(b.key));

const data = lessons.map((l, i) => ({
  id: "formula-" + l.key,
  title: l.title,
  module: "Formulas",
  superGroup: "Math",
  template: "formulas",
  meta: "Math · Vector, matrix &amp; ML formula reference",
  prevId: i > 0 ? "formula-" + lessons[i - 1].key : "",
  nextId: i < lessons.length - 1 ? "formula-" + lessons[i + 1].key : "",
  html: l.html,
}));

const banner = "/* AUTO-GENERATED by tools/gen-formulas-lessons.js from vector-math-formulas.md — do not edit by hand. */\n";
const js = banner +
  "(function () {\n" +
  "  var L = (window.LESSONS = window.LESSONS || []);\n" +
  "  var data = " + JSON.stringify(data, null, 0) + ";\n" +
  "  data.forEach(function (o) { L.push(o); });\n" +
  "})();\n";
fs.writeFileSync(OUT, js);
console.log("wrote lessons/math-00-formulas.js  (" + data.length + " lessons, " + (js.length / 1024).toFixed(0) + " KB)");
data.forEach((d) => console.log("  " + d.id + "  —  " + d.title));
