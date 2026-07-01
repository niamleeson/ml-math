# Authoring brief — Mathematics for ML lessons

You are authoring lessons for the "Mathematics for ML" track in the ml-math-tutor app
(cwd: /Users/jaykim/workspace/ml-math-tutor). Read this brief, then the two reference files
below, then author your assigned lessons.

## Read first
1. `MATH-LESSON-STRUCTURE.md` — the full authoring spec (voice, sections, rules).
2. `tools/math-authored.js` — study `t1_limits` (id "math-01-07") and `laplace` (id "math-03-27"),
   and the files in `tools/authored/` (t1-a … t1-g) — these are the GOLD STANDARD. Match their
   structure, depth, warmth, and formatting exactly.

## Output
Create ONE new file at the path you are given, whose entire contents are:
```
module.exports = {
  "math-TT-NN": { ...lesson object... },
  ...
};
```
Author exactly the lessons you are assigned (ids + titles), in order. Do not author any other ids.

## Schema — each lesson object has EXACTLY these fields, no others
```js
{
  id: "math-TT-NN",
  title: "…",                       // plain title (drop any leading "★ ")
  tagline: "… one warm sentence …",
  connections: { buildsOn: ["…"], leadsTo: ["…"], usedWith: ["…"] },  // usedWith = MATH neighbors only, NOT ML apps
  motivation: "<p>…</p><p>…</p>",   // warm; begin from something the learner already knows
  definition: "<p>…</p><p><b>Assumptions that matter:</b> …</p>",  // precise; define every symbol in plain English; justify/derive the key fact; state assumptions
  worked: {
    problem: "…",
    skills: ["…"],
    strategy: "… one line: the obstacle and the tool …",
    steps: [ { do:"…", result:"…", why:"…" }, … ],   // ONE operation per step
    verify: "… sanity check in words …",
    answer: "…",
    connects: "… one line linking back to the concept …"
  },
  practice: [   // EXACTLY 5 problems, each fully worked, increasing difficulty
    { problem:"…", steps:[ { do:"…", result:"…", why:"…" }, … ], answer:"…" },
    … (5 total)
  ],
  applications: [   // AT LEAST 6, each with light background AND real numbers
    { title:"…", background:"… short history / why it exists …", numbers:"… a concrete calculation with real numbers …" },
    … (>=6)
  ],
  applicationsClose: "… one closing sentence tying the applications together …",
  takeaways: ["…","…","…"]   // 3–5 crisp bullets
}
```

## HARD RULES (set by many rounds of feedback — follow exactly)
- **DOUBLE EVERY LaTeX BACKSLASH** in JS strings. Write `"$\\dfrac{a}{b}$"`, `"$\\lim_{x\\to0}$"`,
  `"$\\sqrt{x}$"`, `"$\\nabla f$"`, `"$\\partial$"`, `"$\\theta$"`, `"$\\int_0^1$"`. A single
  backslash (e.g. `"\frac"`) is silently corrupted by JavaScript. This is the #1 mistake — never do it.
- HTML + MathJax only. Inline math `$...$`, display `$$...$$`. No markdown.
- **NO italics** anywhere: never use `<i>` or `<em>`. Use `<b>` for emphasis, otherwise plain text.
- **NO emojis or decorative glyphs** at all (no check marks, crosses, warning signs, ✓, ❌, ⚠).
- In `steps`, the renderer automatically puts an arrow before `result` and an em-dash before `why`.
  So `result` is just the resulting expression (NO leading arrow) and `why` is a short reason.
- Do NOT add any field beyond the schema. Never add: prereqs, hints, mistakes, difficulty, demo, tier.
- Voice: warm, encouraging, like a wise teacher glad you are here — but definitions, steps, and
  numbers stay precise. ALL math must be CORRECT; re-check every arithmetic result.
- Exactly 5 practice problems; each a genuine MULTI-step {do,result,why} walkthrough (not a
  one-liner) plus a final `answer`; increasing difficulty; the last may connect to CS/ML.
- At least 6 applications; each has genuine light background AND real numbers a learner can re-derive.
- `usedWith` lists MATHEMATICAL neighbors only; put all CS/ML uses in `applications`.
- The final lesson of most topics is an ML capstone (title has no star here); make its worked
  example and applications concrete and ML-focused, with real numbers.

## Verify before finishing (run in the working directory; fix until clean)
- `node -e "require('./<your-file>')"`  → no error
- `grep -nE "<i>|<em>|✓|❌|✔|✅|⚠" <your-file>`  → no output
- Confirm every lesson has exactly 5 practice items and at least 6 applications.
Report the ids you wrote and confirm the checks passed. Modify ONLY your assigned file.
