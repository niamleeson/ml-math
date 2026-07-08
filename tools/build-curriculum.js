/* =====================================================================
   build-curriculum.js — dependency-free generator for the "Recommender
   System ML" section (AFP-AI Learning Guide). Converts afp/lessons/M<NN>-*.md
   into lessons/curriculum.js, whose objects are pushed into window.LESSONS so
   the main app renders them (superGroup "Recommender System ML", template
   "curriculum"). One lesson page per module; the nav section is the module's
   Domain. Math ($...$/$$...$$) preserved for MathJax; code fences to highlight.js.
   Isolated from the app's own engine and from the AI Cheat Sheet build.
   Run:  node tools/build-curriculum.js
   ===================================================================== */
"use strict";
const fs = require("fs");
const path = require("path");

const ROOT = path.resolve(__dirname, "..");
const SRC = path.join(ROOT, "afp", "lessons");
const OUT = path.join(ROOT, "lessons", "curriculum.js");

// Module number -> Domain (nav section). Matches afp/plans/README.md.
function domainOf(n) {
  if (n <= 5) return "Domain 0 · ML Foundations";
  if (n <= 10) return "Domain 1 · Core: Ranking & Evaluation";
  if (n <= 14) return "Domain 2 · Recommenders, Embeddings & Retrieval";
  if (n <= 16) return "Domain 3 · Unsupervised";
  if (n <= 22) return "Domain 4 · Applied LLMs / GenAI";
  if (n <= 26) return "Domain 5 · Bandits & RL";
  return "Domain 6 · Optimization & Marketplace";
}

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

  let title = "";
  const firstH1 = lines.findIndex((l) => /^#\s+/.test(l));
  if (firstH1 !== -1) { title = lines[firstH1].replace(/^#\s+/, "").trim(); lines.splice(firstH1, 1); }

  let html = parseBlocks(lines);
  html = html.replace(/\u0000c(\d+)\u0000/g, (m, n) => '<pre><code class="language-' + code[n].lang + '">' + esc(code[n].c.replace(/\n$/, "")) + "</code></pre>");
  html = html.replace(/\u0000m(\d+)\u0000/g, (m, n) => "$$" + disp[n] + "$$");
  html = html.replace(/\u0000j(\d+)\u0000/g, (m, n) => "<code>" + esc(icode[n]) + "</code>");
  html = html.replace(/\u0000x(\d+)\u0000/g, (m, n) => "$" + imath[n] + "$");
  // Inline afp/assets images as base64 data URIs so no loose PNGs need committing
  // (the repo git-ignores *.png; images stay regenerable via tools/gen-*.py).
  html = html.replace(/<img alt="([^"]*)" src="(afp\/assets\/[^"]+)">/g, (m, alt, src) => {
    try {
      const ext = path.extname(src).slice(1).toLowerCase();
      const mime = ext === "svg" ? "image/svg+xml" : "image/" + (ext === "jpg" ? "jpeg" : ext);
      const b64 = fs.readFileSync(path.join(ROOT, src)).toString("base64");
      return '<img alt="' + alt + '" src="data:' + mime + ";base64," + b64 + '">';
    } catch (e) { console.warn("  ! missing image, keeping ref: " + src); return m; }
  });
  // Drop the leading meta blockquote (shown as the app meta line instead).
  html = html.replace(/^\s*(?:<blockquote>[\s\S]*?<\/blockquote>\s*)+/, "");
  return { title, html: html.trim() };
}

/* ---------- build the registration file ---------- */
const files = fs.readdirSync(SRC).filter((f) => /^M\d\d-.*\.md$/.test(f)).sort();
const data = files.map((f, i) => {
  const n = parseInt(f.slice(1, 3), 10);
  const md = fs.readFileSync(path.join(SRC, f), "utf8");
  const mapsTo = (md.match(/\*\*Maps to:\*\*\s*([^·\n]+?)\s*·/) || [, "all"])[1].trim();
  const conv = convert(md);
  return {
    id: "cur-" + f.replace(/\.md$/, ""),
    title: conv.title || f.replace(/\.md$/, ""),
    module: domainOf(n),
    superGroup: "Recommender System ML",
    template: "curriculum",
    meta: domainOf(n) + " · Maps to: " + mapsTo,
    prevId: i > 0 ? "cur-" + files[i - 1].replace(/\.md$/, "") : "",
    nextId: i < files.length - 1 ? "cur-" + files[i + 1].replace(/\.md$/, "") : "",
    html: conv.html,
  };
});

const banner = "/* AUTO-GENERATED by tools/build-curriculum.js from afp/lessons/*.md — do not edit by hand. */\n";
const js = banner +
  "(function () {\n" +
  "  var L = (window.LESSONS = window.LESSONS || []);\n" +
  "  var data = " + JSON.stringify(data, null, 0) + ";\n" +
  "  data.forEach(function (o) { L.push(o); });\n" +
  "})();\n";
fs.writeFileSync(OUT, js);
console.log("wrote lessons/curriculum.js  (" + data.length + " lessons, " + (js.length / 1024).toFixed(0) + " KB)");
data.forEach((d) => console.log("  " + d.id + "  [" + d.module + "]  —  " + d.title));
