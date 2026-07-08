/* gen-cheatsheet-notebooks.js — generate topics/notebooks/<section>/<slug>.ipynb for every
   AI-Cheat-Sheet lesson that has runnable Python (the 💻/⚖️ lessons). Lessons live under
   topics/lessons/<section>/; the notebook tree mirrors that section layout. Standalone:
   does NOT touch the app (lessons/cheatsheet.js) or index.html. Same md->ipynb logic
   as build-cheatsheet.js. Run: node tools/gen-cheatsheet-notebooks.js */
"use strict";
const fs = require("fs");
const path = require("path");
const ROOT = path.resolve(__dirname, "..");
const SRC = path.join(ROOT, "topics", "lessons");
const NB_DIR = path.join(ROOT, "topics", "notebooks");

function nbSource(text) {
  const lines = text.split("\n");
  return lines.map((l, i) => (i < lines.length - 1 ? l + "\n" : l));
}

// Split a lesson's markdown into notebook cells: ```python fences -> code cells,
// everything else -> markdown cells. Non-python fences (pseudocode) stay in markdown.
function mdToNotebook(md, title) {
  const cells = [];
  let mdbuf = [], code = [], inCode = false;
  function flushMd() {
    // drop the page-only front-matter blockquotes (Source line / 📓 Colab note)
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
      language_info: { name: "python" },
    },
    nbformat: 4, nbformat_minor: 0,
  };
}

if (!fs.existsSync(NB_DIR)) fs.mkdirSync(NB_DIR, { recursive: true });

// Recursively discover topics/lessons/<section>/NN-*.md, ordered by NN across sections.
function discoverLessonFiles(dir) {
  const found = [];
  (function walk(d) {
    for (const e of fs.readdirSync(d, { withFileTypes: true })) {
      const p = path.join(d, e.name);
      if (e.isDirectory()) walk(p);
      else if (/^\d\d-.*\.md$/.test(e.name)) found.push({ section: path.relative(SRC, d), name: e.name });
    }
  })(dir);
  return found.sort((a, b) => a.name.localeCompare(b.name));
}

let made = 0;
for (const { section, name } of discoverLessonFiles(SRC)) {
  const md = fs.readFileSync(path.join(SRC, section, name), "utf8");
  if (!md.includes("```python")) continue; // numeric lessons: no notebook
  const title = (md.match(/^#\s+(.+)$/m) || [, name.replace(/\.md$/, "")])[1].trim();
  const nb = mdToNotebook(md, title);
  const codeCells = nb.cells.filter((c) => c.cell_type === "code").length;
  const outDir = path.join(NB_DIR, section);
  if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });
  const outName = name.replace(/\.md$/, ".ipynb");
  fs.writeFileSync(path.join(outDir, outName), JSON.stringify(nb, null, 1));
  made++;
  console.log(`  ${section ? section + "/" : ""}${outName}  —  ${nb.cells.length} cells (${codeCells} code)`);
}
console.log(`generated ${made} notebooks in topics/notebooks/<section>/`);
