# Apply brief — turn a section PLAN into lesson content (read before applying)

Goal: transcribe one section's plan into an authored override file so the real lessons render the plan's
content. The pipeline is already built and proven (pilot: `math-10-01`). You only produce the override file.

## What you write

Create ONE file: `tools/authored/zz-<NN>-<slug>.js` (e.g. `tools/authored/zz-24-game-theory.js`).
It exports an object keyed by EVERY lesson id in the topic, e.g.:

```js
module.exports = {
  "math-24-01": {
    connectionsProse: "<p>…§1 Connections prose…</p>",
    motivation: "<p>…§2 paragraph 1…</p><p>…§2 paragraph 2…</p>",
    definition: "<p>…a crisp definition statement + a $$display formula$$ if there is one… </p>" +
                "<p><b>Assumptions that matter:</b> …</p>",
    symbols: [ { sym: "$x$", desc: "plain-English meaning" }, /* … every symbol from the plan */ ],
    derivation: [ { do: "…", result: "$…$", why: "…" }, /* … the plan's numbered §3 steps */ ],
    applications: [ { title: "…", background: "…", numbers: "$…$" }, /* exactly 6 from §5 */ ]
  },
  "math-24-02": { … },
  …every lesson…
};
```

## Field mapping (from the plan entry to the object)

- **connectionsProse** ← the plan's **Connections (§1)** paragraph, as one `<p>…</p>` HTML string.
- **motivation** ← the plan's **Motivation & Intuition (§2)**, one `<p>…</p>` per paragraph.
- **definition** ← a clean definition statement + assumptions. Take the plan's §3 lead-in and the central
  formula; state the concept and put a display formula in `$$…$$` when the lesson has one. Add an
  `<p><b>Assumptions that matter:</b> …</p>` sentence when the plan gives conditions. (Keep it short; the
  step-by-step goes in `derivation`, not here.)
- **symbols** ← the plan's **Symbols.** line, split into `{ sym, desc }` entries (one per symbol).
- **derivation** ← the plan's §3 numbered steps, as `[{ do, result, why }]`, one step each. **OMIT the
  `derivation` field entirely for explain-only lessons** (those whose plan says explain-only / has no
  numbered derivation). Never invent a proof.
- **applications** ← the plan's six **§5** items: `title` = the bold lead, `background` = the explanatory
  sentence, `numbers` = the numeric clause. Keep all six, numbers exactly as in the plan.

## Do NOT set these (they are preserved by the field-level merge)
`worked`, `practice`, `title`, `tagline`, `prereqs`, `connections`. Never include them.

## LaTeX rule (important)
Write LaTeX with **single backslashes exactly as it appears in the plan** — `\frac`, `\nabla`, `\sum`,
`\begin{bmatrix}…\\…\end{bmatrix}`, `\circ`, `\bmod`. **Do not double backslashes.** A separate normalizer
(`tools/fix-latex-backslashes.js`) doubles them afterward. Use double-quoted JS strings and `+`
concatenation (apostrophes like "it's" are then fine). Do not run node on the file; do not require it.

## Rules
1. Cover EVERY lesson in the topic. Do not skip any.
2. Numbers must match the plan exactly (they were sympy/numpy-verified). Do not change them.
3. Voice is already set in the plan — copy the plan's prose faithfully; do not re-editorialize or add hype.
4. Load ONLY this topic's plan file. Do not read other sections.
5. Output only the one `zz-<NN>-<slug>.js` file with the create tool.

## Slugs (filename per topic)
01 single-variable-calculus · 02 multivariable-vector-calculus · 03 differential-equations-odes ·
04 real-analysis · 05 functional-analysis · 06 harmonic-fourier-analysis · 07 measure-theory ·
08 numerical-analysis · 09 linear-algebra · 10 representation-theory · 11 analytic-geometry ·
12 differential-geometry · 13 topology · 14 discrete-math-combinatorics · 15 graph-theory ·
16 mathematical-logic-set-theory · 17 probability-theory · 18 mathematical-statistics-inference ·
19 stochastic-processes · 20 bayesian-statistics · 21 information-theory · 22 optimization ·
23 operations-research · 24 game-theory · 25 dynamical-systems-chaos · 26 control-theory ·
27 numerical-methods-scientific-computing
