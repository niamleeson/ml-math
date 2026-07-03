/* =====================================================================
   AFP-AI NOTEBOOK GENERATOR
   ---------------------------------------------------------------------
   Reads tools/afp-authored/*.js and writes one Colab-ready notebook per
   module to notebooks/afp-mNN.ipynb from each module's `notebook` spec
   (an array of { t:"md"|"code", src:"..." } cells).

   Sets metadata.enhanced_walkthrough = true so tools/gen-notebooks.js
   never clobbers these.  Run:  node tools/gen-afp-notebooks.js  [afp-m07]
   ===================================================================== */
"use strict";
const fs = require("fs");
const path = require("path");
const ROOT = path.join(__dirname, "..");
const SRC = path.join(__dirname, "afp-authored");
const OUT = path.join(ROOT, "notebooks");

const pad = (x) => String(x).padStart(2, "0");
const mid = (m) => `afp-m${pad(m)}`;

function splitLines(s) {
  const lines = String(s).split("\n");
  return lines.map((ln, i) => (i < lines.length - 1 ? ln + "\n" : ln));
}
function mdCell(src) { return { cell_type: "markdown", metadata: {}, source: splitLines(src) }; }
function codeCell(src) { return { cell_type: "code", metadata: {}, execution_count: null, outputs: [], source: splitLines(src) }; }

// Arg can be: a single authored .js file (only its notebooks), a notebook id (afp-m07), or nothing.
const arg = process.argv[2];
let files, ONLY = null;
if (arg && arg.endsWith(".js")) files = [path.resolve(arg)];
else { files = fs.readdirSync(SRC).filter(f => /\.js$/.test(f)).sort().map(f => path.join(SRC, f)); ONLY = arg || null; }
let mods = [];
files.forEach(f => { mods = mods.concat(require(f)); });
fs.mkdirSync(OUT, { recursive: true });

let wrote = 0;
mods.forEach(o => {
  const id = mid(o.m);
  if (ONLY && id !== ONLY) return;
  if (!Array.isArray(o.notebook) || !o.notebook.length) {
    console.warn(`! ${id} has no notebook spec — skipped`);
    return;
  }
  const cells = o.notebook.map(c => (c.t === "code" ? codeCell(c.src) : mdCell(c.src)));
  const nb = {
    cells,
    metadata: {
      kernelspec: { name: "python3", display_name: "Python 3" },
      language_info: { name: "python" },
      colab: { provenance: [] },
      enhanced_walkthrough: true
    },
    nbformat: 4,
    nbformat_minor: 5
  };
  fs.writeFileSync(path.join(OUT, id + ".ipynb"), JSON.stringify(nb, null, 1));
  wrote++;
});
console.log(`Wrote ${wrote} AFP notebook(s) to notebooks/`);
