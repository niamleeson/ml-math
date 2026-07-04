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
const OUT = path.join(ROOT, "notebooks");
const { allFiles, loadFiles, flatten } = require("./afp-lib.js");

function splitLines(s) {
  const lines = String(s).split("\n");
  return lines.map((ln, i) => (i < lines.length - 1 ? ln + "\n" : ln));
}
function mdCell(src) { return { cell_type: "markdown", metadata: {}, source: splitLines(src) }; }
function codeCell(src) { return { cell_type: "code", metadata: {}, execution_count: null, outputs: [], source: splitLines(src) }; }

// Arg can be: a single authored .js file (only its notebooks), a notebook id (afp-m07 / afp-m02-01), or nothing.
const arg = process.argv[2];
let files, ONLY = null;
if (arg && arg.endsWith(".js")) files = [path.resolve(arg)];
else { files = allFiles(); ONLY = arg || null; }
const specs = flatten(loadFiles(files));
fs.mkdirSync(OUT, { recursive: true });

let wrote = 0;
specs.forEach(s => {
  const id = s.id;
  if (ONLY && id !== ONLY) return;
  if (s.kind === "section") return;   // section overview pages have no notebook
  const nbSpec = s.data.notebook;
  if (!Array.isArray(nbSpec) || !nbSpec.length) {
    console.warn(`! ${id} has no notebook spec — skipped`);
    return;
  }
  const cells = nbSpec.map(c => (c.t === "code" ? codeCell(c.src) : mdCell(c.src)));
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

