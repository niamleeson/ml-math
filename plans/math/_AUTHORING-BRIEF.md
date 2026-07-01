# Authoring brief — deep section plans (read before writing any `math-part-NN` file)

This brief is the single source of truth for bringing a section plan to full depth. It consolidates the
governing master plan and the Part 02 exemplar. **Read all three before writing:**

1. `plans/math-track-explanation-improvements.md` — the master (four principles, fix recipe, DoD).
2. `plans/math/math-part-02-multivariable-vector-calculus.md` — the **format + depth + voice exemplar**.
3. This brief — the checklist.

---

## Voice (non-negotiable)

**Plain, warm textbook voice — like a good teacher, not an editorial.** Clear, calm, direct. Warm means
helpful and encouraging: start from what the reader already knows and explain *why* things are true.

**Banned:** rhetorical-question openers ("How do you…?", "What is…?"), hype and drama ("quiet miracle",
"beating heart", "brutal", "magic", "the one X that…"), exclamation, second-person cheerleading, and
"one idea, many uniforms" style taglines. If a sentence is trying to sound clever, cut it.

Good: *"The dot product multiplies two vectors to give a single number measuring how much they point the
same way."* Cut: *"You can multiply numbers — but how do you multiply two arrows?"*

---

## Per-lesson format (what to write for every lesson in the section)

Use the compressed shorthand from Part 02 (labels are plan-internal; they never appear in the app):

```
### `math-NN-LL` — Title  · <flags: rewrite §5 / AUTHOR derivation / deepen / explain-only>
- **Intuition.** 1–3 plain sentences: the concept itself, starting from what the reader knows. NOT a hook.
- **Connections.** (only for the section's 1 model entry — a short welcoming paragraph; otherwise fold a
  one-line "builds on / leads to" note into Intuition, in prose, no bullets.)
- **Derive (complete).** The case-by-case rule:
    • If the lesson has a non-obvious formula/identity/inequality/closed-form → give the COMPLETE
      step-by-step derivation, one operation per numbered step, each with a short plain-English why.
    • If it is a definition/concept with nothing to derive → write "explain-only" and a one-line reason.
- **Symbols.** Gloss every important symbol in the formula, in plain English (role/units). No symbol
  used before it is defined.
- **Apps.** Exactly 6 concept-specific applications. EACH must contain a number you can only get by using
  THIS lesson's concept (not a generic dot-product/among/norm). Verify every number (see below).
```

**One section gets a full-depth model entry** (like `math-02-13` in Part 02): write §1 Connections and §2
Motivation as complete flowing prose, to fix the voice bar for that section. Pick the section's most
central / most-boilerplate lesson.

---

## The core fixes (why these plans exist)

- **§5 boilerplate is the main disease.** Consecutive lessons currently share the *same 6 applications*.
  Replace each lesson's set with 6 that use its own worked object. Read the current content with
  `node tools/dump-section.js math-NN` to see exactly which apps are boilerplate.
- **Assert-not-derive.** Most definitions state the key property. Replace with the complete derivation.
- **Templated/thin motivation.** Replace stock openers ("You already have the coordinate tools…") with a
  real, plain explanation.
- **LaTeX bugs.** Some `numbers`/`definition` fields have an unclosed `$` or a lost matrix `\\` row break.
  Flag every one you find (list the lesson id + the fix).

---

## Numbers must be verified

Every numeric claim in an application (and in a derivation) must be checked. Run `python3` with
`sympy`/`numpy` and keep a short compute log in the file's intro or an inline note. Do **not** invent
numbers. If you can't verify a number, don't use it.

## Two clarifications (from batch 1 review)

- **Expect some `explain-only` lessons.** Pure concept/definition lessons (e.g. "What is a stochastic
  process?", "Block diagrams", overview lessons) have nothing to derive — mark them `explain-only`. Do not
  force a derivation onto them. A section that marks *every* lesson AUTHOR is usually over-forcing.
- **LaTeX-bug detection:** the dump tool now preserves math `<`/`>`, so `$e<0$` is fine and is **not** a
  bug. A genuine latent bug is an **unclosed `$`** (odd number of `$` in a field, e.g. `gives $2\times10^{-5}.`)
  or a lost matrix row break (`\begin{bmatrix}a&b\c&d`). Flag only those.

---

## File skeleton (match Part 02)

```
# Math · Part NN — <Section name>  (deep-authored reference)     ← keep "deep-authored" in the header
> Load with ../math-track-explanation-improvements.md … (1–2 line preamble; note numbers were verified)

**Section:** … · **Lessons:** N · **Breadcrumb:** `…` · **Priority:** …

## Scorecard (current defects)      ← §5 boilerplate / thin motivation / formula-not-display / LaTeX / derivations
## Priority & systemic issues        ← name the shared §5 block(s) and which lessons carry them; list LaTeX bugs
## Model entry (full prose)          ← the one lesson written at full §1+§2 depth
## Per-lesson change specs           ← every lesson, in the shorthand above
## Build order                       ← sensible authoring order for the section
```

> The generator `tools/gen-section-plans.js` will NOT overwrite a file whose header contains
> `deep-authored`, so your work is safe once the header is in place.
