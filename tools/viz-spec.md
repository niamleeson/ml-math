# Per-formula diagram spec (Probability section "Visualize" cards)

You REWRITE the "Visualize" section of ONE lesson so it carries a HELPFUL DIAGRAM FOR
EACH KEY FORMULA in that lesson. The current single result-bar chart does NOT help readers
understand the math — replace it. Goal: a reader looking at the diagrams *sees what each
formula means* (its shape, its inputs → output, its mechanism).

You are given: the lesson id, the lesson source file, and where to write the result.

## STEP 1 — READ THE LESSON, LIST ITS FORMULAS
Open the lesson source file, find the object whose `id:` matches your lesson id. Read its
`formula`, `whatItDoes`, `walkthrough`, `example`, `symbols`. Make a list of EVERY key
formula/relationship the lesson teaches (there are usually 1–4). Example: the Normal lesson
teaches the PDF $f(x)$ and the 68-95-99.7 rule; the covariance lesson teaches
$\mathrm{Cov}=E[XY]-E[X]E[Y]$ AND $\rho=\mathrm{Cov}/(\sigma_X\sigma_Y)$ — that is two diagrams.

## STEP 2 — DESIGN ONE DIAGRAM PER FORMULA
Use ONLY these canvas chart types (the renderer supports nothing else):
- **line**  `{type:"line", xlabel, ylabel, series:[{name,color,points:[[x,y],...]}]}` —
  BEST for PDFs, CDFs, functions, convergence curves (LLN running mean), MGF curves.
  Plot the actual function by evaluating the formula at ~40–120 x values.
- **bars** / **hist**  `{type:"bars", labels:[...], values:[...], valueLabels?:[...], colors?:[...]}` —
  BEST for PMFs, expectation as a weighted sum, prior-vs-posterior, term-by-term breakdowns
  of a formula (show each term of the right-hand side as its own bar, then the result).
  Multi-series bars: `{type:"bars", series:[{name,color,points:[[x,y]]}], labels:[...]}`.
- **scatter**  `{type:"scatter", xlabel, ylabel, groups:[{name,color,points:[[x,y]]}], lines:[{color,dash,points:[[x,y]]}]}` —
  BEST for joint distributions, covariance/correlation point clouds (add a fitted line),
  independence (cloud vs tilted cloud).
- **heatmap**  `{type:"heatmap", rows:[...], cols:[...], matrix:[[...]], showVals:true}` —
  BEST for joint PMF/PDF tables, marginals (the row/col sums), covariance matrices,
  conditional-probability tables, 2-D Gaussians.

DIAGRAM DESIGN RULES:
- Each chart's `title` should NAME the formula it illustrates, e.g. "Normal PDF: f(x) bell
  curve, μ=170 σ=10" or "Cov = E[XY] − E[X]E[Y], term by term".
- Make the MECHANISM visible. Good moves: shade/recolor the special region with `colors`
  (e.g. the ±1σ bars green); overlay two `series` to contrast (e.g. μ=0 vs μ=2, or σ=1 vs
  σ=2; prior vs posterior; simulated vs theoretical); for a sum-formula draw each addend as
  a bar plus the total; for a convergence law draw the running estimate approaching a dashed
  true-value line.
- A "term-by-term" bar chart is the single most useful tool for an algebraic identity: one
  bar per piece of the right-hand side, one bar for the left-hand side, so the reader SEES
  the equation balance. Use it for Bayes, total probability, Cov, law of total variance,
  axioms, etc.

## STEP 3 — REAL NUMBERS ONLY (anti-hallucination)
Every value you put in a chart MUST be computed from the formula with correct arithmetic —
evaluate the PDF, sum the series, compute the posterior, etc. Do the math carefully (you may
reason it out or use the lesson's own worked `example` numbers). NEVER invent plausible-looking
numbers. If you contrast "simulated vs theory", the theory curve must be the exact formula and
you must say the simulated one is illustrative.

## STEP 4 — WRITE THE CODEVIZ ENTRY
Fields: `question` (a one-line hook, optional), `charts:[...]` (one per formula — REQUIRED,
≥1), `caption` (1–2 sentences tying the diagrams back to the formula(s)), `code` (a short
self-contained python/numpy snippet that computes the chart data from the formula — this is
shown under a "Code that made it" toggle, so it should actually reproduce the chart numbers).

WRITE TARGET — depends on the lesson (you are told which):
- **Shared-file lesson**: write a fragment file at the given path `/tmp/vizfrag/<id>.js`
  containing exactly:
  ```js
  window.CODEVIZ["<id>"] = {
    question: "...",
    charts: [ ... ],
    caption: "...",
    code: `...`
  };
  ```
  (Do NOT edit codeviz-01-probability.js / codeviz-06-prob-extra.js — the orchestrator
  assembles fragments.)
- **Inline-CODEVIZ lesson** (concept file): edit the concept file in place — find its existing
  `window.CODEVIZ["<id>"] = {...}` (or the `codeviz`/`CODEVIZ` assignment) and REPLACE the
  `charts`, `caption`, `question`, `code` with your new per-formula diagrams. Touch nothing else.

## CONVENTIONS (hard)
- Chart `title`, `caption`, `labels` are plain strings (NOT math markup — these render on a
  canvas / as plain HTML, so write "sigma", "mu", "P(A|B)", not LaTeX).
- The `code` field is a JS template-literal string: NEVER let a `$` be immediately followed by
  `{` (it triggers `${` interpolation and breaks the file); NEVER put a backtick inside it.
- Keep numbers as plain JS number literals. Colors: "#4ea1ff" (blue), "#7ee787" (green),
  "#ffb454" (orange), "#c89bff" (purple), "#ff7b72" (red), "#9aa7b4" (grey).
- `points` arrays are `[[x,y],...]` with real numbers.

## STEP 5 — VERIFY
Run `node --check` on your fragment file (or the concept file you edited) — it MUST pass.
For a fragment, also confirm it is exactly one `window.CODEVIZ["<id>"] = {...};` assignment.

## STEP 6 — REPORT
List each formula and the chart type you chose for it, confirm the numbers are computed (not
invented), and give the node --check result.
