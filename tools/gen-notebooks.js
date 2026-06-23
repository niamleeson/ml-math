// Generates one Colab-ready starter notebook per lesson under notebooks/<id>.ipynb.
// Cells: title+intro (markdown) -> pip install (code) -> library implementation (code)
// -> visualization (code) -> practice prompts (markdown + empty code cells).
// Run: node tools/gen-notebooks.js
const fs = require("fs"), path = require("path");
const ROOT = path.resolve(__dirname, "..");

// --- load the lesson registries with the same shims the validation scripts use ---
global.window = { LESSONS: [], CODE: {}, CODEVIZ: {}, WALKTHROUGHS: {} };
global.document = { createElement: () => ({ getContext: () => ({}), style: {}, appendChild() {}, setAttribute() {} }) };
global.Demos = new Proxy({}, { get: () => function () {} });
global.getComputedStyle = () => ({ getPropertyValue: () => "" });
global.Charts = { draw() {} };

const base = ["demos","00-foundations","01-probability","02-ml","03-deeplearning","04-ai","05-linalg","06-prob-extra","07-ml-extra","08-ai-extra","09-classical-a","09-classical-b","10-modern-a","10-modern-b"];
base.forEach(f => require(path.join(ROOT, "lessons", f + ".js")));
const codeFiles = base.filter(f => f !== "demos").map(f => "code-" + f);
const vizFiles = base.filter(f => f !== "demos").map(f => "codeviz-" + f);
[...codeFiles, ...vizFiles].forEach(f => { try { require(path.join(ROOT, "lessons", f + ".js")); } catch (e) {} });
// self-registering concept lessons (few-shot + skills) carry their own CODE/CODEVIZ
fs.readdirSync(path.join(ROOT, "lessons")).filter(f => /^concept-.*\.js$/.test(f)).forEach(f => require(path.join(ROOT, "lessons", f)));

const L = global.window.LESSONS, CODE = global.window.CODE, CODEVIZ = global.window.CODEVIZ;

// --- helpers ---
function htmlToText(s) {
  return String(s || "")
    .replace(/<li>/gi, "\n- ").replace(/<\/(p|div|ul|ol|h3|h4)>/gi, "\n\n")
    .replace(/<br\s*\/?>/gi, "\n").replace(/<[^>]+>/g, "")
    .replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&amp;/g, "&").replace(/&nbsp;/g, " ")
    .replace(/\n{3,}/g, "\n\n").trim();
}
// pip-installable libs that are NOT preinstalled in Colab; map import token -> pip name
const PIP = { cleanlab:"cleanlab", evidently:"evidently", fairlearn:"fairlearn", mapie:"mapie",
  river:"river", nannyml:"nannyml", pandera:"pandera", ydata_profiling:"ydata-profiling",
  pandas_profiling:"ydata-profiling", shap:"shap", catboost:"catboost", mlxtend:"mlxtend",
  umap:"umap-learn", great_expectations:"great-expectations", pyspark:"pyspark",
  rapidfuzz:"rapidfuzz", pandera:"pandera", polars:"polars",
  gymnasium:"gymnasium", gym:"gymnasium", stable_baselines3:"stable-baselines3" };
function neededPips(code) {
  const found = new Set();
  Object.keys(PIP).forEach(tok => { if (new RegExp("\\b" + tok + "\\b").test(code)) found.add(PIP[tok]); });
  return [...found];
}
function mdCell(text) { return { cell_type: "markdown", metadata: {}, source: splitLines(text) }; }
function codeCell(text) { return { cell_type: "code", metadata: {}, execution_count: null, outputs: [], source: splitLines(text) }; }
function splitLines(s) {
  const lines = String(s).split("\n");
  return lines.map((ln, i) => i < lines.length - 1 ? ln + "\n" : ln);
}

let written = 0;
const outDir = path.join(ROOT, "notebooks");
fs.mkdirSync(outDir, { recursive: true });

L.forEach(l => {
  const id = l.id, code = CODE[id], viz = CODEVIZ[id];
  const cells = [];
  // intro
  let intro = "# " + (l.title || id) + "\n\n";
  if (l.module) intro += "_" + l.module + "_\n\n";
  if (l.tagline) intro += "**" + htmlToText(l.tagline) + "**\n\n";
  if (l.bigIdea) intro += htmlToText(l.bigIdea).split("\n\n").slice(0, 2).join("\n\n") + "\n\n";
  intro += "---\n\nThis notebook is a practice scaffold for the **" + (l.title || id) + "** lesson. Run the cells, then tackle the practice problems at the bottom. _Save a copy to your Drive (File → Save a copy in Drive) to edit and keep your work._";
  cells.push(mdCell(intro));

  // setup / pip
  const pips = new Set();
  if (code && code.code) neededPips(code.code).forEach(p => pips.add(p));
  if (viz && viz.code) neededPips(viz.code).forEach(p => pips.add(p));
  let setup = "# Setup — numpy / pandas / scikit-learn / matplotlib ship with Colab.";
  if (pips.size) setup += "\n!pip install -q " + [...pips].join(" ");
  setup += "\nimport numpy as np, matplotlib.pyplot as plt";
  cells.push(codeCell(setup));

  // Feature-Engineering "reproduce the problem -> apply the fix" demo (tools/fe-demos/<id>.py).
  // Shows raw data + the problem it causes, then engineered data + the fix, with before/after numbers.
  const demoPath = path.join(ROOT, "tools", "fe-demos", id + ".py");
  if (fs.existsSync(demoPath)) {
    cells.push(mdCell("## See it for yourself: the problem, then the fix\n\nRun this cell. It plots the **raw** data and reproduces the problem it causes, then plots the **engineered** data and shows the fix — with before/after numbers."));
    cells.push(codeCell(fs.readFileSync(demoPath, "utf8").trim()));
  }

  // library implementation
  if (code && code.code) {
    cells.push(mdCell("## Reference implementation" + (code.lib ? " — " + htmlToText(code.lib) : "")));
    cells.push(codeCell(code.code));
  }
  // visualization
  if (viz && viz.code) {
    cells.push(mdCell("## Visualize the data & results" + (viz.question ? "\n\n_" + htmlToText(viz.question) + "_" : "")));
    cells.push(codeCell(viz.code));
  }
  // practice
  if (Array.isArray(l.practice) && l.practice.length) {
    cells.push(mdCell("## Practice\n\nTry each one in the empty cell below it, then reveal the worked solution."));
    l.practice.forEach((pr, i) => {
      cells.push(mdCell("**Problem " + (i + 1) + ".** " + htmlToText(pr.q)));
      cells.push(codeCell("# Your turn:\n"));
      let sol = "<details><summary>Show worked solution</summary>\n\n";
      (pr.steps || []).forEach(s => { sol += "- " + htmlToText(s.do) + (s.why ? " — _" + htmlToText(s.why) + "_" : "") + "\n"; });
      if (pr.answer) sol += "\n**Answer:** " + htmlToText(pr.answer) + "\n";
      sol += "\n</details>";
      cells.push(mdCell(sol));
    });
  }

  const nb = { cells, metadata: { kernelspec: { name: "python3", display_name: "Python 3" }, language_info: { name: "python" }, colab: { provenance: [] } }, nbformat: 4, nbformat_minor: 5 };
  fs.writeFileSync(path.join(outDir, id + ".ipynb"), JSON.stringify(nb, null, 1));
  written++;
});
console.log("wrote", written, "notebooks to notebooks/  (lessons:", L.length + ")");
