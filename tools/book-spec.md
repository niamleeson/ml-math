# Book-lesson authoring spec

You turn ONE chapter of a specific book into lessons that follow the BOOK'S OWN structure.
These lessons use `template: "book"` and must NOT mirror the concept/paper scaffold used
elsewhere (no bigIdea/buildup/formula/whatItDoes fields).

You are given: the PDF path, the chapter's PDF page range, the book's module name, an id prefix,
and the fragment file to write. Read the assigned pages from the PDF before writing.

## GRANULARITY — one lesson per KEY POINT / concept
A chapter usually teaches several distinct key points (often the book's own named sections or
bolded terms). Make ONE lesson per key point — finer is better. A short chapter may be one
lesson; a rich chapter may be 3–8. Use the book's own names for the concepts as titles.

## WHAT EACH LESSON MUST CONTAIN — taken from the book, not invented
- Cover the key point the way the BOOK presents it: its definition, the reasoning/intuition the
  author gives, and the example(s) the author uses. Do NOT substitute your own analogies or
  examples — use the book's. Do NOT add concepts the chapter doesn't cover.
- Explain in clear, ORIGINAL wording that faithfully conveys the book's content. Do NOT copy the
  book's prose verbatim. Paraphrase. You may quote SHORT phrases (a sentence at most, rarely),
  in quotation marks, only when the exact wording matters — keep total quoted text minimal.
- **Pull the book's worked numbers.** Wherever the chapter works a calculation or gives concrete
  figures, reproduce that arithmetic in a `<ul class="steps">` (one step per `<li>`) and/or a
  `<table class="extable">` (thead; numeric cells `class="num"`; row labels `class="row-h"`).
  Use the book's actual numbers; recompute to confirm they're right.
- **Charts where the book has them.** If the chapter has a figure/plot/chart for this key point,
  recreate it as a CODEVIZ chart from the book's data (see chart spec below) with a `title` and an
  `interpret` line. If the book gives a table of values, you may also chart it. Do not fabricate
  figure data — use the book's values, or clearly-illustrative reconstructions labelled as such.

## LESSON OBJECT SHAPE (book template)
Register each lesson with the provided helper, e.g. in the fragment file:
```
(function () {
  window.LESSONS = window.LESSONS || [];
  window.CODEVIZ = window.CODEVIZ || {};
  const M = "<MODULE NAME GIVEN TO YOU>";
  const B = (o) => window.LESSONS.push(Object.assign({ module: M, template: "book", book: "<BOOK TITLE>" }, o));
  B({
    id: "<idprefix>-<concept-slug>",
    chapter: "Chapter N",            // the book's chapter label
    title: "<concept name — short, NO parentheses>",
    tagline: "<one-line statement of the key point>",   // optional
    sections: [
      { h: "<sub-heading>", body: "<HTML: paragraphs, lists, steps, tables>" },
      ...
    ],
    takeaways: ["<short point>", ...]   // optional, 2–5 bullets
  });
  // Only if the book has a figure for this lesson:
  window.CODEVIZ["<id>"] = { charts: [ { type:"bars", title:"…", interpret:"…", labels:[…], values:[…] } ] };
})();
```

Chart spec shapes (from `lessons/charts.js`) — use ONLY these keys:
- bars/hist: `{ type:"bars", labels:[…], values:[…], valueLabels?:[…], colors?:[…] }`
- line: `{ type:"line", xlabel?, ylabel?, series:[ {name,color,points:[[x,y],…]} ] }`
- scatter: `{ type:"scatter", xlabel?, ylabel?, groups:[ {name,color,points:[[x,y]]} ], lines?:[…] }`
- roc / confusion / heatmap as documented in charts.js.
Colors are hex strings ("#4ea1ff", "#7ee787", "#ffb454", "#c89bff").

## CONVENTIONS (hard)
- HTML strings. Math in `$...$` with DOUBLED backslashes (`$\\bar{x}$`). Never an HTML entity
  inside math — use `\\lt` / `\\gt`. In prose never a raw `<` before a letter/number — use `&lt;`.
- In a `` `template literal` `` never let `$` be immediately followed by `{`, and never put a
  backtick inside it. Prefer `"..."` strings for new content.
- Titles: short, NO parentheses.
- Arithmetic must be correct — recompute every number you pull.

## VERIFY (before reporting)
- `node --check <fragment file>` MUST pass.
- The fragment self-registers (IIFE) and pushes one lesson per key point.
- Any chart literally matches a spec shape above.

## REPORT
One line per lesson created: id + concept + (chart? table?). Note any chapter content you could
not fit and why.
