# Authoring `whenToUse` + `pitfalls` for each lesson

Add TWO new fields to EVERY lesson object in your assigned file(s): `whenToUse` and
`pitfalls`. Both are HTML strings, like the other teaching fields (bigIdea, application…).
Insert them right AFTER the `application` field of each lesson object (if a lesson has no
`application`, put them after `example`/`derivation`). Do NOT modify any other field, the
demo functions, or code.

GOLD STANDARD: read the `cls-gradient-boosting` lesson in `lessons/09-classical-a.js` —
its `whenToUse` and `pitfalls` fields are the reference for depth, tone, and format.
Match that quality and density.

## whenToUse — renders under the heading "🎯 When to reach for it"
A practitioner decision guide — when do you actually pick this?
- One short intro sentence: the situation / data shape where this is the right tool.
- A short `<ul>` of what to choose it OVER (the real alternatives) and the tradeoff each.
- A short `<ul>` of when to pick a DIFFERENT tool instead.
- If relevant, which library / implementation you'd reach for in practice.
For pure-math / foundational concepts (vectors, derivatives, an eigen-decomposition, a
probability identity), frame it as "when this shows up in real ML/AI work, what it
unlocks, and which higher-level method relies on it." Stay concrete, never hand-wavy.

## pitfalls — renders under the heading "⚠️ Production pitfalls"
The real mistakes and failure modes, as a `<ul>` of 4–8 punchy bullets — each a
`<b>bolded lead</b>` then the fix.
- For models / algorithms: overfitting, data leakage, wrong train/test split,
  hyperparameter coupling, class imbalance, miscalibration, train/serving skew,
  latency & model size, reproducibility, numerical instability — whichever truly apply.
- For pure-math / foundational concepts: numerical-stability traps, common
  misconceptions, edge cases where the formula breaks, normalization / off-by-one
  mistakes, when an assumption silently fails. (The heading still says "Production
  pitfalls" — that's fine; just give the real gotchas a practitioner hits.)
Only list pitfalls that genuinely apply to THIS concept. Do not pad with generic filler.

## HARD CONVENTIONS
1. HTML strings — use `<p>`, `<b>`, `<i>`, `<ul><li>`, and `<code>` for code identifiers.
   Short, plain sentences.
2. Expand every abbreviation on first use within the field, in parentheses — e.g.
   "AUC (Area Under the Curve)", "CV (Cross-Validation)", "CNN (Convolutional Neural
   Network)". (House style; see tools/abbreviations.md for expansions.)
3. NEVER put a raw "<" immediately before a letter/number in prose — write `&lt;`
   (e.g. "n &lt; 50"). ">" is fine.
4. Any math goes in `$...$` with DOUBLED backslashes inside the JS string (`\\sigma`,
   `\\nabla`, `\\alpha`). Keep math light in these two fields.
5. Keep each field tight: `whenToUse` ~120–200 words; `pitfalls` ~5–7 bullets. Quality
   over length.
6. Run `node --check <file>` after editing each file; fix any syntax error before finishing.

Report, per file: how many lessons received the two new fields.
