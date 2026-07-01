# Math Lesson Structure — Authoring Spec

Canonical spec for authoring lessons in the **Mathematics for ML** track of this app.
Every lesson is one instance of this template. This document is the source of truth;
`tools/gen-math.js` + `tools/math-authored.js` implement it.

> Scope note: this governs the `template:"math"` lessons under `lessons/math-*.js`, rendered by
> `renderMath`. The pre-existing app lessons and their renderers are untouched.

---

## At a glance

Five sections, plain titles, warm prose inside:

1. **Connections**
2. **Motivation & Intuition**
3. **Definition & Assumptions**
4. **Worked Example & Practice**
5. **Real-World Applications in CS & ML**

Sections 1 and 5 bookend the lesson: 1 is the forward map, 5 is the concrete payoff.
There is **no** standalone "Why It Works" or "Summary" section — the poles/stability-style
insight is folded into the worked example and the applications; the "one idea, many fields"
thread closes section 5.

---

## Voice & tone (throughout)

- Warm, encouraging, human — like a real teacher who is glad you're here.
- Start from what the learner **can already do**, name the difficulty honestly, celebrate instincts.
- Warmth lives in the **explaining** (sections 1, 2, 5); **precision** governs definitions, steps,
  answers, and numbers.
- Section **titles stay plain and boring**; the **prose inside is warm**.
- "You" for the learner, "let's / we" for shared work. Never cloying.

---

## The five sections

### 1. Connections
Opens the lesson as a map. Three short groups:
- **Builds on** — the prerequisite ideas (doubles as a readiness checklist).
- **Leads to** — what this unlocks next.
- **Used with** — its **mathematical** neighbors only (other concepts, other topics).
  All CS/ML real-world uses belong in section 5, not here.

*Voice: brief, orienting.*

### 2. Motivation & Intuition
A concrete problem the learner can't yet solve, then the promise, then the single
load-bearing idea plus a mental-model metaphor. Begin with something easy they can do.

*Voice: warm, story-like.*

### 3. Definition & Assumptions
The precise statement with every symbol annotated in plain English. **Derive** the key
property rather than asserting it. Fold in the conditions/assumptions that must hold
(linearity, domain, region of convergence, etc.).

*Voice: precise, lightly warm.*

### 4. Worked Example & Practice
One fully guided worked example in the **guided-walkthrough format** (below) — skills tags,
strategy cue, one-operation-per-step, verify, answer, connects-to — then **5 practice problems**,
each with a full revealable step-by-step solution (see *Practice-set design*). The worked example
ends with **one sentence** planting the key reading (e.g. "the exponent −2 is a pole; negative
means it decays — stable") that section 5 builds on.

*Voice: patient.*

### 5. Real-World Applications in CS & ML
Replaces the old "Why It Works" and "Summary". **At least 6** concrete uses spanning CS and ML
(6 is the target floor, not a ceiling).
**Each application:**
- Opens with a short **flowing explanation that includes light background** (history / why it
  exists). **Do not** use a "What it is:" label.
- Then shows **real numbers** the learner can re-derive (a concrete calculation, not just prose).

Close on the transferable thread ("one idea, many uniforms").

*Voice: warm, concrete.*

---

## Guided-walkthrough format (worked example + every practice problem)

1. **Problem** + skills tags. (No difficulty badge — it added noise, not signal.)
2. **Strategy cue** — one line naming the obstacle and the tool.
3. **Step-by-step** — **one operation per step**: `action → result`, then a short italic *why*.
   Define notation up front. No separate hints: if a pointer is worth giving, put it directly in
   the strategy cue or a step's *why*.
4. **Verify** — substitute back / sanity check, in words (no check-mark glyphs).
5. **Answer** — stated plainly.
6. **Connects to** — one line back to the lesson's concept.

**No "Common mistakes" section.** If a misconception is important, address it inside the definition
or a step's *why* — do not add a separate list.

**No hints. No emojis** — not ✓, ❌, ⚠, or any decorative glyph. Plain words only.

**Rule: never bundle operations.** "Substitute, factor, and isolate" is three steps, not one.

**Lists are plain.** Use `<ol class="mnum">` (simple numbered) and `<ul class="mbul">` (simple
bulleted) — never the app's `.steps` class, whose number-circles and vertical connecting line are
visually distracting. `renderMath` already emits the plain classes; authors only supply the data.

### Data for §4 (the renderer builds the HTML)

```js
worked: {
  problem: "Compute …",
  skills: ["factoring", "indeterminate forms"],
  strategy: "Direct substitution gives 0/0 — rewrite before you plug in.",
  steps: [ { do: "Factor", result: "(x-1)(x+1)/(x-1)", why: "difference of squares" } ],
  verify: "x=0.99 → 1.99 and x=1.01 → 2.01, closing on 2 from both sides",
  answer: "2",
  connects: "continuity — the limit is f's continuous extension at x=1."
}
```

---

## Interactivity

- **Revealable step-by-step solutions** for the 5 practice problems — native
  `<details class="hint">` toggles (try it yourself, then reveal). This is the *only* interactivity
  the math track uses.
- **No hints, no widgets, no sliders/canvases/`demo()`** — they distract from the reading. If a
  visual is essential, prefer a static figure.

---

## Practice-set design (REQUIRED in every authored §4)

- **Exactly 5 practice problems.** Not 20 — five *substantive* problems beat twenty trivial ones.
  Pick problems that each genuinely need a multi-step solution (a real rewrite, rationalization,
  or limit process — not a one-line plug-in), and make the last one reach toward the CS/ML idea.
- **Each problem has a full step-by-step walkthrough**, not a one-liner. The walkthrough uses the
  same one-operation-per-step format as the lead example: `{ do, result, why }` per step, plus an
  answer. It is shown in a **revealable `<details>`** ("Step-by-step solution") so the page stays
  clean until the learner tries it.
- The single fully-worked example that opens §4 still uses the complete guided-walkthrough format
  (badge, skills, strategy, hints, one-op-per-step, verify, mistakes, connects-to).

Schema: `practice` is an array of 5 objects, each
`{ problem, steps: [ {do, result, why} ], answer }`. `renderMath` renders each problem with a
revealable step-by-step solution; it will not accept trivial answer-only entries as the standard.

---

## Formatting conventions

- Readable math: `$...$` inline, `$$...$$` display (MathJax). Avoid heavy custom macros.
- **Bold** key terms on first meaningful use (*pole*, *eigenfunction*, *stable*).
- Use `<ol class="mnum">` (numbered) / `<ul class="mbul">` (bulleted) for lists, and
  `<table class="extable">` for tables. Never use the app's `.steps` class in math lessons —
  its number-circles and connecting line are distracting. In authored data you just supply
  `steps: [{do,result,why}]`; `renderMath` emits the plain markup.
- No check-marks, crosses, warning signs, or any emoji/decorative glyph — plain words only.
- **One operation per step, always. Every application shows real numbers.**

---

## Adaptivity dials (per topic)

- **🟢 core vs 🟡 niche:** core topics expand section 4 (do-it) and keep the full 20 problems;
  niche topics expand sections 1/2/5 (intuition + why) and may trim practice to ~8–10.
- **Applied vs theory track:** applied → more worked examples and numbers; theory → fold proofs
  and convergence conditions into section 3.

---

## App implementation mapping

Each lesson is a JS object pushed into `window.LESSONS` with the **spec-native `math` template**.
The renderer (`renderMath` in `index.html`) builds the structure from named fields — the author
only fills fields, so the 5 sections and every guided-walkthrough element cannot drift.

```js
B({
  id: "math-<TT>-<LL>",        // e.g. "math-03-27" (topic 3, lesson 27)
  title: "The Laplace transform",
  tagline: "One-line hook.",
  prereqs: ["math-03-06"],     // optional; auto-chained to previous lesson if omitted
  connections: {               // §1
    buildsOn: ["…"], leadsTo: ["…"], usedWith: ["…"]
  },
  motivation: "…",             // §2  (HTML with $LaTeX$)
  definition: "…",             // §3
  worked: {                    // §4  (renderer lays out the guided-walkthrough)
    problem: "…", skills: ["…"], strategy: "…",
    steps: [{ do: "…", result: "…", why: "…" }],   // one operation per step
    verify: "…", answer: "…", connects: "…"
  },
  practice: [                  // exactly 5 problems, each fully worked (REQUIRED)
    { problem: "…", steps: [{ do: "…", result: "…", why: "…" }], answer: "…" }  // ×5
  ],
  applications: [{ title: "…", background: "…", numbers: "…" }],   // ≥6
  applicationsClose: "…",      // §5 closing thread ("one idea, many uniforms")
  takeaways: ["…"]
});
// B sets { module, template:"math", superGroup:"Math", book } automatically.
```

`module` (the topic) is the nav section; `book` is the breadcrumb (`"Mathematics · <Category>"`);
`superGroup: "Math"` nests all topic sections under one collapsible **Math** parent in the sidebar
(Math → topic sections → lessons). `template: "math"` triggers `renderMath`, which lays the fields
out as the monochrome, serif, black-and-white textbook page. Scaffolds fill only `connections`;
`renderMath` shows a muted "To be authored" note under the remaining sections.

### Authoring workflow (scaffold → gold standard)

1. Add a fully-authored entry keyed by lesson id in **`tools/math-authored.js`**.
2. Run **`node tools/gen-math.js`** to regenerate `lessons/math-*.js`.
3. Verify rendering (headless Chrome via puppeteer-core, or open `index.html`).

Any id not present in `math-authored.js` is emitted as a navigable **scaffold** that already
has the correct 5-section structure, ready to deepen.

---

*Reference example authored in full: `math-03-27` — The Laplace transform (see `tools/math-authored.js`).*
