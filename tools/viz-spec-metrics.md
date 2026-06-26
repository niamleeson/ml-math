# Per-formula diagram spec (Metrics & Evaluation "Visualize" cards)

You REWRITE the "Visualize" section of ONE metrics lesson so it carries a HELPFUL DIAGRAM
FOR EACH KEY METRIC/FORMULA in that lesson. The current single result chart does NOT help
readers understand the math — replace it. Goal: a reader looking at the diagrams *sees what
each metric measures* (how it is computed, what trades off, what a good vs bad value looks like).

You are given: the lesson id and its source file. The CODEVIZ is INLINE in that file.

## STEP 1 — READ THE LESSON, LIST ITS METRICS/FORMULAS
Open the file, read the lesson object's `formula`, `whatItDoes`, `walkthrough`, `example`,
`symbols`. Metrics lessons usually define SEVERAL metrics (e.g. precision, recall, F1, ROC-AUC;
or MAE, MSE, RMSE, R²). List the KEY formulas the lesson teaches. Aim for ONE diagram per key
formula, but be sensible: 3–6 well-chosen diagrams that cover the lesson's main metrics, not a
diagram for every trivial restatement. If two metrics are best shown together (precision vs
recall on the same axes), one combined chart is fine.

## STEP 2 — DESIGN ONE DIAGRAM PER KEY METRIC
Use ONLY these canvas chart types (the renderer supports nothing else):
- **confusion**  `{type:"confusion", labels:[...], matrix:[[...],...]}` — THE tool for any
  label-classification metric. Show the TP/FP/FN/TN counts; precision/recall/F1 are read off it.
- **roc**  `{type:"roc", auc?, points:[[fpr,tpr],...]}` — ROC curve for threshold/probability
  metrics (ROC-AUC). Provide the actual (fpr,tpr) sweep and the AUC.
- **line**  `{type:"line", xlabel, ylabel, series:[{name,color,points:[[x,y],...]}]}` — precision-
  recall curves, calibration reliability curves (predicted vs observed, with the y=x diagonal as
  a second series), error-vs-threshold, metric-vs-parameter, survival curves, forecast vs actual.
- **bars** / **hist**  `{type:"bars", labels:[...], values:[...], valueLabels?:[...], colors?:[...]}` —
  comparing metric values (MAE vs RMSE vs R²; macro vs micro F1; per-class scores), or the
  term-by-term breakdown of a formula (numerator vs denominator vs result).
  Multi-series: `{type:"bars", series:[{name,color,points:[[x,y]]}], labels:[...]}`.
- **scatter**  `{type:"scatter", xlabel, ylabel, groups:[{name,color,points:[[x,y]]}], lines:[{color,dash,points:[[x,y]]}]}` —
  predicted vs actual (regression, with the y=x line), clustering separation, residual plots.
- **heatmap**  `{type:"heatmap", rows:[...], cols:[...], matrix:[[...]], showVals:true}` —
  multi-class confusion, agreement tables, correlation/association matrices.

DIAGRAM DESIGN RULES:
- Each chart's `title` NAMES the metric/formula it illustrates, e.g. "Precision = TP/(TP+FP),
  recall = TP/(TP+FN) — read off the confusion matrix" or "RMSE vs MAE: RMSE punishes the big
  error more".
- Make the MECHANISM visible. Good moves: a confusion matrix whose cells the caption maps to
  precision/recall; an ROC curve with its AUC; a calibration line vs the perfect y=x diagonal;
  predicted-vs-actual scatter with the y=x reference line; a bar chart contrasting two metrics
  on the SAME data so the reader sees why they differ (e.g. accuracy high but F1 low on
  imbalanced data); term-by-term bars (numerator, denominator, ratio) for a definition.
- Prefer the metric-native chart: classification→confusion/roc, ranking→precision-recall or
  line, regression→scatter(pred vs actual)+bars, calibration→reliability line, clustering→
  scatter, distribution-distance→bars/line, agreement→heatmap.

## STEP 3 — REAL NUMBERS ONLY (anti-hallucination)
Every value MUST be computed correctly — derive TP/FP/FN/TN from a concrete labeled example
and compute precision/recall/F1/AUC from THOSE; compute MAE/RMSE/R² from a concrete (y, ŷ) set;
etc. Use the lesson's own worked `example` numbers when it has them. NEVER invent
plausible-looking metric values. If a curve is illustrative (a sampled ROC), say so in the
caption while keeping the summary numbers exact.

## STEP 4 — EDIT THE FILE IN PLACE
The lesson file contains `window.CODEVIZ["<id>"] = {...}` (or `window.CODEVIZ[ID] = {...}`).
REPLACE its `question`, `charts` (array — one per key metric, REQUIRED ≥1), `caption`, and
`code` (a short self-contained python/numpy/sklearn snippet that computes the chart numbers).
Touch NOTHING else — leave the lesson object (`window.LESSONS.push`) and `window.CODE` block
exactly as they are. Keep the existing `window.CODEVIZ[...] =` assignment form (if it uses the
`ID` variable, keep using `ID`).

## CONVENTIONS (hard)
- Chart `title`, `caption`, `labels` are plain strings (NOT LaTeX — they render on a canvas /
  as plain HTML). Write "precision", "F1", "TP/(TP+FP)", not "\\frac{...}".
- The `code` field is a JS template-literal string: NEVER let a `$` be immediately followed by
  `{`; NEVER put a backtick inside it.
- Numbers are plain JS number literals. Colors: "#4ea1ff" blue, "#7ee787" green, "#ffb454"
  orange, "#c89bff" purple, "#ff7b72" red, "#9aa7b4" grey.
- `roc.points` are [[fpr,tpr],...] starting [0,0] ending [1,1]; `confusion.matrix` rows=actual,
  cols=predicted.

## STEP 5 — VERIFY
Run `node --check <file>` — it MUST pass. Confirm the file still has exactly ONE
`window.LESSONS.push`, ONE `window.CODE[...]`, and ONE `window.CODEVIZ[...]`.

## STEP 6 — REPORT
List each metric/formula and the chart type chosen for it, confirm numbers are computed (not
invented), and give the node --check result.
