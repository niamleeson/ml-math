# Paper-lesson enrichment spec

You ENRICH exactly ONE existing lesson file so it COMPLETELY and CLEARLY captures the
paper's key points — every key equation, the model architecture, the key concepts — with
NO redundancy or filler. You will be told the file, the paper title, and the source.

GOAL: a reader gets the paper's full math and mechanism from the lesson. You MAY REPLACE
thin or wordy field content wholesale — the point is completeness + clarity, NOT volume.
Cut noise and repetition.

## STEP 1 — READ THE REAL PAPER
- arXiv id given → WebFetch `https://arxiv.org/abs/<id>` AND `https://ar5iv.labs.arxiv.org/html/<id>`.
  If ar5iv returns only a wrapper / metadata, fall back to the PDF `https://arxiv.org/pdf/<id>`
  (WebFetch saves it; read it). 
- No arXiv (a URL given) → WebFetch the URL; if it is a PDF that WebFetch can't parse, it is
  saved locally — read it with the Read tool.
Collect EVERY key EQUATION (with its section/equation number), the full model ARCHITECTURE
or algorithm structure, and the key CONCEPTS / design choices.

## STEP 2 — READ THE EXISTING FILE
Read it fully. It registers ONE lesson via `window.LESSONS.push({...})` plus
`window.CODE[id]` and `window.CODEVIZ[id]`.

## STEP 3 — REWRITE THE TEACHING FIELDS (replace as needed; each field has a DISTINCT job —
never repeat the same explanation across fields):
- **formula**: ALL the paper's key equations as a sequence of `$$...$$` display-math blocks,
  each followed by a one-line plain-English caption naming its section/eq number. Transcribe
  faithfully. Do NOT leave it as one short equation. If the paper is genuinely light on math
  (a dataset / survey / empirical paper), include the few formulas it has and say so plainly.
- **architecture** (ADD this field right after `walkthrough` if absent): the model/method
  component by component — layers/blocks, dimensions, data flow, connections. For an
  optimizer/algorithm paper: the per-iteration procedure. For a theory/dataset paper: the
  structure/pipeline. If truly not applicable, a short honest note — never padding.
- **symbols**: EVERY symbol appearing in EVERY equation, defined in plain English.
- **walkthrough**: the step-by-step narrative (distinct from architecture's structural view).
- **whatItDoes**: what each equation says in words.
- **derivation**: why the key result holds.
- **example**: worked real numbers through the key formula.

## PRESERVE UNCHANGED
The object structure; ALL metadata (`id`, `title`, `tagline`, `module`, `track`, the
`paper:{...}` block, `conceptLink`, `prereqs`, `partOf`); the `window.CODE[...]` block; the
`window.CODEVIZ[...]` block (keep its numbers and "our small run" captions); the `practice`
array. Do not delete the lesson's working code. Invent nothing.

## ANTI-HALLUCINATION
Ground every equation/claim/number in the fetched paper. Never invent citation counts or
metrics (quote the paper's reported numbers only with their source). Keep CODEVIZ numbers
labeled "our small run, not the paper's number".

## CONVENTIONS (hard)
- All teaching fields are HTML strings.
- Math in `$...$` / `$$...$$` with DOUBLED backslashes in the JS string (e.g. `$\\sqrt{d_k}$`).
- NEVER put an HTML entity inside math — use `\\lt` / `\\gt` for `<`/`>` (only allowed
  exception is the `^{&lt;t&gt;}` timestep notation).
- In prose, never write a raw `<` before a letter/number — use `&lt;`.
- Inside JS template literals, NEVER let a `$` be immediately followed by `{` (it starts a
  `${` interpolation and breaks the file) — restructure the math if needed.
- Expand abbreviations on first use.

## STEP 4 — VERIFY ON DISK
Run `node --check <file>` — it MUST pass. Confirm the file still registers exactly ONE
lesson id with `window.CODE` and `window.CODEVIZ` present. Fix until clean.

## STEP 5 — REPORT
Which equations are now in `formula` (with §), what `architecture` covers, symbol count,
what you replaced vs kept, the `node --check` result, and anything you could NOT ground.
