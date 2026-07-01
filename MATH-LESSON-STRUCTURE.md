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
One fully guided worked example in the **full guided-walkthrough format** (below) — difficulty
badge, skills tags, strategy cue, **interactive revealable hints**, one-operation-per-step,
verify, common mistakes, answer, connects-to — then faded practice problems. The worked example
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

1. **Problem** + difficulty badge (`●●●○○`) + skills tags.
2. **Strategy cue** — one line naming the obstacle and the tool.
3. **Hints** — 2–3 progressive and fading, rendered as **interactive** `<details class="hint">`
   "Show hint" toggles (see *Interactive elements*).
4. **Step-by-step** — **one operation per step**: `action → result`, then a short italic *why*.
   Define notation up front.
5. **Verify** — substitute back / sanity check (✓).
6. **Common mistakes** — 2–3 ❌ with how to avoid.
7. **Answer** — stated plainly.
8. **Connects to** — one line back to the lesson's concept.

**Rule: never bundle operations.** "Substitute, factor, and isolate" is three steps, not one.

### HTML patterns for §4

```html
<!-- difficulty + skills (top of the worked example) -->
<p class="lesson-meta"><span class="difficulty">●●●○○</span><span class="skills">factoring · limits</span></p>

<!-- strategy cue -->
<p class="strategy"><b>Strategy.</b> Direct substitution gives 0/0 — rewrite before you plug in.</p>

<!-- interactive revealable hints -->
<details class="hint"><summary>Hint 1</summary><p>Factor the numerator.</p></details>
<details class="hint"><summary>Hint 2</summary><p>Cancel the common factor, then substitute.</p></details>

<!-- step-by-step: one operation per <li> -->
<ol class="steps"><li><b>Factor</b> &rarr; (x-1)(x+1)/(x-1). <i>Difference of squares.</i></li></ol>

<!-- common mistakes -->
<ul class="steps"><li>❌ Saying the limit doesn't exist because f(1) is undefined.</li></ul>

<!-- connects-to -->
<p class="connects"><b>Connects to:</b> continuity — the limit is f's continuous extension at x=1.</p>
```

---

## Interactive elements

Lessons may include interactivity **where it aids understanding** — not on every lesson.

- **Revealable hints** — native `<details class="hint"><summary>…</summary>…</details>`. Zero JS,
  works inside the textbook page, keeps it uncluttered until the learner asks for help.
- **Interactive widget** — an optional `demo(host)` function on the lesson object. The book
  template mounts it into a `#demo-host` element (a "Play with it" card after the chapter, or
  inline if you place `<div class="demo" id="demo-host"></div>` in a section body). Use it for a
  visual that genuinely helps — drag `x → 1` and watch `f(x) → 2`, a slider over a parameter, a
  draggable vector. Keep it small and self-contained, and read theme colors from CSS variables
  (`--ink`, `--accent`, …) so it matches light/dark mode.

*Guideline: reach for a widget only when a static figure can't show the idea moving.*

---

## Practice-set design (the full-strength version of section 4)

- Exactly **20 problems, strictly increasing difficulty**, in **5 tiers of 4**; each tier adds
  exactly one new wrinkle:
  1. compute / apply the definition directly
  2. properties & basic inverses
  3. first-order applications
  4. second-order / structural cases (roots, poles, repeated/complex, etc.)
  5. advanced — forcing, convolution, impulse, and a **capstone** that reconnects to the big idea
- Every problem carries a difficulty badge + skills tags and is fully worked in the guided format.

(The generated lessons ship a compact worked example + a few faded problems; the full 20-problem
ladder is authored per lesson when depth is added.)

---

## Formatting conventions

- Readable math: `$...$` inline, `$$...$$` display (MathJax). Avoid heavy custom macros.
- **Bold** key terms on first meaningful use (*pole*, *eigenfunction*, *stable*).
- Use `<ul class="steps">` / `<ol class="steps">` for step lists, `<table class="extable">`
  for tables — these match the app's textbook styling.
- ✓ for verified checks, ❌ for pitfalls.
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
    problem: "…", difficulty: 4, skills: ["…"], strategy: "…",
    hints: ["…"],              // → interactive <details>
    steps: [{ do: "…", result: "…", why: "…" }],   // one operation per step
    verify: "…", answer: "…", mistakes: ["…"], connects: "…"
  },
  practice: [{ problem: "…", answer: "…" }],
  applications: [{ title: "…", background: "…", numbers: "…" }],   // ≥6
  applicationsClose: "…",      // §5 closing thread ("one idea, many uniforms")
  takeaways: ["…"],
  demo: function (host) { /* optional interactive widget, mounted into #demo-host */ }
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
