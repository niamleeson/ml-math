# Expansion brief — convert every lesson to FULL PROSE (read before the expansion pass)

The 27 section plans already contain, for **every** lesson, the verified technical substance: a complete
step-by-step derivation (or `explain-only`), symbol glosses, and six concept-specific applications with
sympy/numpy-verified numbers. **This pass adds the missing narrative prose so every lesson reads like the
section's model entry — not just one lesson per section.**

## The task (per lesson)

Rewrite each `### \`math-NN-LL\`` entry from the compressed shorthand into the **full model-entry format**
(the one lesson already written that way in each file is your local template — imitate it exactly):

```
### `math-NN-LL` — Title
**Connections (§1).**
> A short welcoming paragraph in plain prose: what the reader already knows that makes this approachable,
> and where it leads. NOT a builds-on/used-with/leads-to bullet list. 3–6 sentences.

**Motivation & Intuition (§2).**
> A clear multi-paragraph explanation of the idea itself, starting from what the reader can already do,
> then the concrete gap, then the load-bearing idea. Expand the one-line "Intuition." into real prose
> (usually 2 short paragraphs). An explanation, not a hook.

**Definition & Assumptions (§3).** <keep the existing derivation VERBATIM — the numbered steps, the
formula, the symbol glosses, the assumptions. You may add one lead-in sentence, but DO NOT change any
math, any step, or any number.>

**Real-World Applications (§5).** <keep the existing six applications VERBATIM — same titles, same
numbers. You may lightly smooth the wording into sentences, but DO NOT change any number.>
```

## Hard rules

1. **Preserve all verified content.** Do not alter derivation steps, symbols, application numbers, or the
   explain-only decision. Those were verified with sympy/numpy. Only ADD prose (§1, §2) and lightly smooth.
   If you think a number is wrong, leave it and note it at the top — do not silently change it.
2. **Voice: plain, warm textbook — never poetic or attention-grabbing.** BANNED: rhetorical-question
   openers ("How do you…?"), hype ("quiet miracle", "beating heart", "brutal", "magic"), exclamation,
   cheerleading, "one idea many uniforms". Match the section's existing model entry exactly.
3. **Every lesson gets full §1 + §2 prose** — including the ones currently marked `explain-only` (they
   still get Connections + Motivation; they just keep "no formula to derive" in §3).
4. **Keep the file's non-lesson sections** (title/preamble, Scorecard, Priority & systemic issues, Build
   order) and the `deep-authored` header. The model entry stays as-is (already full prose).
5. Keep each lesson's flags line (e.g. `· rewrite §5 · AUTHOR derivation`) after the title if present.

## Result

The file grows substantially (every lesson becomes a full entry). That is expected and correct — the goal
is that a reader opening any lesson sees the same depth and warmth as the model entry, not a bullet spec.
