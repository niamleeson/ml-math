# Worked-example rewrite spec

You REWRITE the `example` field of a lesson so it shows the concept with a CONCRETE
real-number (or real-data) worked example — especially for any formula the lesson teaches.
The field is rendered as the lesson's worked-example card. Every lesson must, after you finish,
plug real numbers into its formula(s) and show the arithmetic step by step.

You are given the lesson id(s) and file. Read the lesson's `formula`, `whatItDoes`, `symbols`,
`walkthrough` first so the example uses the SAME formula and symbols.

## WHAT THE EXAMPLE MUST DO
1. **Real numbers in the formula.** Pick small concrete inputs and plug them in, showing the
   actual arithmetic (e.g. `XᵀX = 1·1 + 2·2 + 3·3 = 14`), ending in a final number. If the
   lesson has several formulas/metrics, work a number for each.
2. **Line-by-line, highly readable.** Lead with a one-sentence setup in a `<p>`, then a
   `<ul class="steps">` with ONE `<li>` per computation step — each step on its own line. Never
   bury the calculation in a paragraph.
3. **Use a TABLE when there is tabular data or a comparison.** Whenever the example involves any
   of these, present it as `<table class="extable">` (don't cram it into prose):
   - a small dataset / sample rows (columns = features + target);
   - a per-class / per-category / per-step breakdown (e.g. class → count → weight);
   - a before/after or method/metric comparison (e.g. MAE vs RMSE; raw vs scaled; CE vs focal);
   - a step → value ledger; a confusion-style or contingency grid.
   Header row in `<thead>`; numeric cells get `class="num"` (right-aligned, tabular figures);
   a row label can use `class="row-h"`. Add a short `<caption>` if it helps. You may keep BOTH
   a steps list AND a table (table for the data, steps for the calculation on it).
4. **Real-data lessons.** If the lesson is about a real dataset/benchmark, mirror its real
   structure (actual column names / a few representative rows) in a table — but do NOT invent
   precise real-world measurements you can't verify; use clearly-illustrative values and say so,
   or reuse numbers already in the lesson.

## CORRECTNESS (anti-hallucination)
The arithmetic must be RIGHT — re-add the sums, recompute the means, verify the final value.
Don't fabricate benchmark scores; for a method's headline result reuse the lesson's own numbers
or mark a value as illustrative. Tie every symbol to the lesson's `symbols`/`formula`.

## EDIT
Replace ONLY the `example` field of the given lesson(s). Change nothing else — not the formula,
CODE, CODEVIZ, or any other field. Keep the existing assignment form.

## CONVENTIONS (hard)
- `example` is an HTML string. Math in `$...$` with DOUBLED backslashes (e.g. `$\\bar{x}$`).
- NEVER an HTML entity inside math — use `\\lt`/`\\gt` for `<`/`>`.
- In prose, never a raw `<` before a letter/number — use `&lt;`.
- If the field is a `` `template literal` ``: NEVER let `$` be immediately followed by `{`;
  NEVER put a backtick inside it. A normal `"..."` string avoids both.
- Table markup: `<table class="extable"><caption>..</caption><thead><tr><th>..</th><th class="num">..</th></tr></thead><tbody><tr><td class="row-h">..</td><td class="num">..</td></tr>...</tbody></table>`.

## VERIFY
Run `node --check <file>` — MUST pass. Confirm the file still has the same number of
`window.LESSONS.push` blocks and exactly one `example:` per lesson you touched.

## REPORT (one short line per lesson)
e.g. "ok prob-bayes: worked Bayes with table of prior/likelihood/posterior + step calc, node --check pass".
