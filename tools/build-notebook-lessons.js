// Convert lesson-source Markdown in notebooks/lessons/*.md into runnable Colab
// notebooks at notebooks/<name>.ipynb. Each ```python fence becomes a code cell;
// contiguous prose (including "▶ What you'll see" / "👀 Takeaway" lines and any
// non-python fences) becomes a markdown cell. $...$/$$...$$ math is preserved raw
// for Colab/MathJax.
//
// Usage:
//   node tools/build-notebook-lessons.js                 # build all notebooks/lessons/*.md
//   node tools/build-notebook-lessons.js 15.1 15.2       # build only matching files
const fs = require("fs");
const path = require("path");
const formatNotebooks = require("./nbfmt-run");

const ROOT = path.resolve(__dirname, "..");
const SRC = path.join(ROOT, "notebooks", "lessons");
const OUT = path.join(ROOT, "notebooks");

function nbSource(text) {
  // notebook `source` is a list of lines, each (except the last) ending in \n
  const lines = String(text).split("\n");
  return lines.map((l, i) => (i < lines.length - 1 ? l + "\n" : l));
}

function firstH1(md) {
  const m = md.match(/^#\s+(.+)$/m);
  return m ? m[1].trim() : "Lesson";
}

function mdToNotebook(md, title) {
  const cells = [];
  let mdbuf = [], code = [], inCode = false;
  function flushMd() {
    const txt = mdbuf.join("\n").trim();
    mdbuf = [];
    if (txt) cells.push({ cell_type: "markdown", metadata: {}, source: nbSource(txt) });
  }
  md.split("\n").forEach((line) => {
    const open = line.match(/^```(\w*)\s*$/);
    if (!inCode && open && /^(python|py)$/i.test(open[1])) { flushMd(); inCode = true; code = []; return; }
    if (inCode && /^```\s*$/.test(line)) {
      cells.push({ cell_type: "code", metadata: {}, execution_count: null, outputs: [], source: nbSource(code.join("\n")) });
      inCode = false; return;
    }
    if (inCode) code.push(line); else mdbuf.push(line);
  });
  flushMd();
  return {
    cells,
    metadata: {
      colab: { name: title, provenance: [], toc_visible: true },
      kernelspec: { name: "python3", display_name: "Python 3" },
      language_info: { name: "python" }
    },
    nbformat: 4, nbformat_minor: 0
  };
}

const filter = process.argv.slice(2);
const files = fs.readdirSync(SRC)
  .filter((f) => f.endsWith(".md"))
  .filter((f) => filter.length === 0 || filter.some((k) => f.includes(k)))
  .sort();

let n = 0;
const written = [];
for (const f of files) {
  const md = fs.readFileSync(path.join(SRC, f), "utf8");
  const nb = mdToNotebook(md, firstH1(md));
  const out = path.join(OUT, f.replace(/\.md$/, ".ipynb"));
  fs.writeFileSync(out, JSON.stringify(nb, null, 1));
  written.push(out);
  const codeCells = nb.cells.filter((c) => c.cell_type === "code").length;
  console.log(`wrote ${path.relative(ROOT, out)}  (${nb.cells.length} cells, ${codeCells} code)`);
  n++;
}
formatNotebooks(written);
console.log(`\nbuilt ${n} notebook(s)`);
