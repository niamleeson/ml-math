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
  gymnasium:"gymnasium", gym:"gymnasium", stable_baselines3:"stable-baselines3",
  pytorch_lightning:"pytorch-lightning", lightning:"lightning", onnx:"onnx", onnxruntime:"onnxruntime" };
// torch / torchvision / torchaudio ship preinstalled in Colab — never pip-install them.
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

// --- data preview: when a notebook trains on a real dataset, prepend a cell that
// shows the data's structure BEFORE it gets used — column names + a few rows for
// tabular data, sample images for image data. Keeps learners from training on a
// black box. Returns [] for notebooks that build their own toy/synthetic arrays. ---
function firstLoader(code, tokens) {
  let best = null, bestIdx = Infinity;
  tokens.forEach(t => {
    const m = new RegExp("\\b" + t + "\\b").exec(code);
    if (m && m.index < bestIdx) { bestIdx = m.index; best = t; }
  });
  return best;
}
function dataPreviewCells(code) {
  if (!code) return [];
  const intro = "## First, look at the data\n\nBefore training on it, see what each example actually contains.";
  const imageGrid = "fig, axes = plt.subplots(1, 5, figsize=(8, 2))\nfor ax, (image, label) in zip(axes, samples):\n    ax.imshow(image, cmap=\"gray\")\n    ax.set_title(str(label))\n    ax.axis(\"off\")\nplt.show()";

  // 1) real tabular classification — has named feature columns and class labels
  let t = firstLoader(code, ["load_breast_cancer", "load_wine", "load_iris"]);
  if (t) return [mdCell(intro + " Each row is one example; the columns are its features, plus a class label."),
    codeCell(`from sklearn.datasets import ${t}\n\ndata = ${t}(as_frame=True)\nprint("rows x columns:", data.frame.shape)\nprint("feature columns:", list(data.data.columns))\nprint("target classes :", list(data.target_names))\ndata.frame.head()`)];

  // 2) real tabular regression — named columns, but a continuous target
  t = firstLoader(code, ["fetch_california_housing", "load_diabetes"]);
  if (t) return [mdCell(intro + " Each row is one example; the columns are its features, and the target is a continuous value."),
    codeCell(`from sklearn.datasets import ${t}\n\ndata = ${t}(as_frame=True)\nprint("rows x columns:", data.frame.shape)\nprint("feature columns:", list(data.data.columns))\nprint("target summary:")\nprint(data.target.describe())\ndata.frame.head()`)];

  // 3) sklearn image data — no columns; each sample is a pixel grid
  if (firstLoader(code, ["load_digits"])) return [mdCell(intro + " These are **images, not table columns** — each sample is an 8x8 grid of pixel intensities (0–16)."),
    codeCell(`from sklearn.datasets import load_digits\n\ndigits = load_digits()\nprint("image array:", digits.images.shape, " labels:", digits.target.shape)\nsamples = list(zip(digits.images, digits.target))\n${imageGrid}`)];
  if (firstLoader(code, ["fetch_olivetti_faces"])) return [mdCell(intro + " These are **face images, not table columns** — each sample is a 64x64 grayscale picture."),
    codeCell(`from sklearn.datasets import fetch_olivetti_faces\n\nfaces = fetch_olivetti_faces()\nprint("image array:", faces.images.shape, " labels:", faces.target.shape)\nsamples = list(zip(faces.images, faces.target))\n${imageGrid}`)];

  // 4) torchvision image datasets — download a few raw samples to look at
  t = firstLoader(code, ["FashionMNIST", "CIFAR100", "CIFAR10", "MNIST"]);
  if (t) return [mdCell(intro + " These are **images, not table columns**. We pull a few raw samples from the " + t + " dataset to see them before any transforms."),
    codeCell(`import torchvision\n\npreview = torchvision.datasets.${t}(root="./data", train=True, download=True)\nprint("dataset: ${t}   samples:", len(preview))\nfirst_image, first_label = preview[0]\nprint("one sample:", first_image.size, "image,  label =", first_label)\nprint("classes:", getattr(preview, "classes", "(digit labels 0-9)"))\nsamples = [preview[i] for i in range(5)]\n${imageGrid}`)];

  // 5) seaborn bundled dataset — a real DataFrame with named columns
  const sns = /\b(?:sns|seaborn)\.load_dataset\(\s*["']([^"']+)["']/.exec(code);
  if (sns) return [mdCell(intro + " It's a real table — here are its columns and the first few rows."),
    codeCell(`import seaborn as sns\n\ndata = sns.load_dataset("${sns[1]}")\nprint("rows x columns:", data.shape)\nprint("columns:", list(data.columns))\ndata.head()`)];

  // 6) sklearn synthetic generators — real "training data" but with no real-world
  // column names. Note that, so learners don't hunt for meaning that isn't there.
  // Guard: skip when make_* is a locally-defined helper, not the sklearn generator.
  const synth = ["make_classification", "make_blobs", "make_moons", "make_circles", "make_regression"];
  t = firstLoader(code, synth);
  if (t && !new RegExp("def\\s+" + t).test(code)) {
    return [mdCell(intro + " This lesson trains on **synthetic** data built by `" + t + "(...)` in the code below. There are no real-world column names — the features are unnamed numeric dimensions. As the cell runs, watch the shape of `X` (rows × features) and the labels in `y`.")];
  }

  return [];   // file reads with unknown paths / hand-built toy arrays: nothing safe to preview
}

let written = 0, skipped = 0;
const outDir = path.join(ROOT, "notebooks");
fs.mkdirSync(outDir, { recursive: true });

const ONLY = process.argv[2];   // optional: regenerate just one notebook, e.g. `node tools/gen-notebooks.js paper-cb-loss`
L.forEach(l => {
  const id = l.id, code = CODE[id], viz = CODEVIZ[id];
  if (ONLY && id !== ONLY) return;
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

  // Peek at the data before any cell uses it (real datasets only).
  const usedCode = ((code && code.code) || "") + "\n" + ((viz && viz.code) || "");
  dataPreviewCells(usedCode).forEach(c => cells.push(c));

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
  // Don't clobber hand-enhanced step-by-step walkthroughs. A notebook that carries
  // metadata.enhanced_walkthrough has been rewritten by hand into a multi-cell, paced
  // version; the auto-generator must leave it alone. Delete that flag to let it regenerate.
  const outPath = path.join(outDir, id + ".ipynb");
  if (fs.existsSync(outPath)) {
    try {
      const existing = JSON.parse(fs.readFileSync(outPath, "utf8"));
      if (existing.metadata && existing.metadata.enhanced_walkthrough) { skipped++; return; }
    } catch (e) { /* unreadable/old file — fall through and regenerate it */ }
  }
  fs.writeFileSync(outPath, JSON.stringify(nb, null, 1));
  written++;
});
console.log("wrote", written, "notebooks to notebooks/  (lessons:", L.length + ")");
if (skipped) console.log("skipped", skipped, "hand-enhanced notebooks (metadata.enhanced_walkthrough)");
