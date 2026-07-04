# 📐 ML Math Tutor

A self-contained web app that teaches the **maths behind Machine Learning, Deep Learning & AI** from scratch — rebuilt from the Stanford/MIT "All Cheat Sheets" PDF into beginner lessons.

## Open it
Double-click **`index.html`** (or drag it into a browser). No server, no install.
> Formulas are rendered by MathJax from a CDN, so the **first load needs internet**. After that the browser caches it.

## What's inside
**107 lessons** across 5 modules, each built up from basics:

| Module | Lessons |
|---|---|
| Foundations (linear algebra + calculus) | 9 |
| Probability & Statistics | 22 |
| Machine Learning (CS229) | 27 |
| Deep Learning (CS230) | 27 |
| Artificial Intelligence (CS221) | 22 |

Every lesson has the same beginner-friendly shape:
- 💡 **The big idea** — plain-English intuition
- 🪜 **Building up to it** — connects to what you already know
- 🔤 **Every symbol explained** — no symbol used before it's defined
- ➗ **The formula**
- 📜 **Why it's true** — a derivation / proof + intuition for the formula
- 🔢 **Concrete example** — real numbers, worked step by step
- 🚀 **Where you actually use this**
- 🧠 **Check yourself** — a quiz with a revealed answer
- ✏️ **Practice — 10 problems** — each with a collapsible step-by-step solution
  where every step says *what* to do and *why* (1,070 problems in total)

Features: collapsible sidebar, search, prev/next navigation, and **progress is saved in your browser** (click "Mark complete").

## Structure
```
index.html              the app engine (layout, sidebar, renderer, MathJax)
lessons/00-foundations.js   ← gold-standard style
lessons/01-probability.js
lessons/02-ml.js
lessons/03-deeplearning.js
lessons/04-ai.js
lessons/derivations-*.js     ← proofs / intuition, merged into lessons by id
lessons/practice-*.js        ← 10 step-by-step problems per lesson, merged by id
```
Each `lessons/*.js` just pushes lesson objects into `window.LESSONS`. To **add a lesson**, copy one object and edit it. To **add a module**, add a new file, list it in the `<script src>` block in `index.html`, and add its name to `MODULE_ORDER`.

> LaTeX tip when editing: inside JS strings every backslash is **doubled** (`\\frac`, `\\sum`). A matrix row-break is `\\\\`.
