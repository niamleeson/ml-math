---
name: tutor-inbox
description: Drain the ask-queue written by the tutor app — the user highlighted a passage in a lesson and asked for it to be explained better. Use when the user says "check the tutor inbox/queue", "any questions from the app", or runs this on a loop while reading lessons.
---

# Tutor inbox

The tutor app (`node tools/tutor-server.js`) queues "explain this passage" requests from the
browser. Each request names the exact file, lesson, section, and quoted text. Your job is to
answer them **by editing the lesson**, not by replying in chat — the server watches `lessons/`
and reloads the reader's tab as soon as you save.

## 1. Read the queue

```bash
cat .claude/ask-queue.jsonl 2>/dev/null | grep '"status":"queued"'
```

Nothing queued → say so in one line and stop. Do not edit anything.

Entries already marked `working` belong to the server's own worker — leave them alone; two
processes editing the same lesson file would clobber each other.

## 2. Handle each pending entry, oldest first

Each entry is `{id, ts, status, file, resolved, lessonId, section, quote, question}`.

**`file` is authoritative when `resolved: true`.** The server found that file by searching
`lessons/` for the quoted text itself, so it is where the prose actually lives — which is often
*not* the file that defines the lesson. Body prose, derivations, practice, walkthroughs, code and
applications are each merged in from their own files. Do not second-guess a resolved file.

1. Open `file` and find the `quote`. Match a distinctive **fragment** (a few words), not the whole
   string: the page collapses whitespace and your selection may span inline markup like `<b>`.
2. When `resolved: false`, the entry explains itself:
   - `candidates` present → the quote appears in several files; use `lessonId` and `section` to
     pick, and say which you chose.
   - `why: "quote not found in lessons/…"` → the highlight was page chrome (a button label, a
     `<summary>`), not lesson prose. Ask the user what they meant rather than guessing.
   - `why: "quote too short…"` → the quote alone can't locate a file, but `lessonId` + `section`
     usually still pin it exactly. Open the lesson, look inside that section, and if the quoted
     text occurs there exactly once, proceed — that is not ambiguous. Only ask the user if the
     section contains several matches.
3. Rewrite **in place**, answering `question`. Keep the surrounding prose intact — you are
   expanding or clarifying one passage, not restructuring the lesson.
4. Match the house style of the surrounding lesson exactly:
   - Same voice: second person, plain words first, every symbol defined before use.
   - `<p>`, `<b>`, `<ul>`, `<table class="symbols">`, `<div class="formula-box">` — the
     existing markup vocabulary of that file. Never introduce new CSS classes.
   - **LaTeX inside JS strings has doubled backslashes** (`\\frac`, `\\sum`, row break `\\\\`).
     This is the single most common way to break the page — check it before saving.
   - Prefer adding a "Read it out loud:" gloss after any new formula, as the courses do.
5. Never delete existing content to make room. If the answer is long, add a paragraph.

## 2b. Figures and diagrams

When the request asks for a diagram, picture, chart or illustration, don't go looking for the
convention — it is here. Pick by what the figure *is*:

**A data plot** — anything with axes and numbers behind it. Use the existing chart engine rather
than drawing it yourself. Add a spec to `window.CODEVIZ[<lessonId>].charts` in the matching
`lessons/codeviz-*.js` file; `Charts.draw` renders it. The spec types, from `lessons/charts.js`:

```
bars/hist : { type, labels:[…], values:[…], valueLabels?:[…], colors?:[…] }
line      : { type, xlabel?, ylabel?, series:[ {name,color,points:[[x,y],…]} ] }
scatter   : { type, xlabel?, ylabel?, groups:[ {name,color,points:[[x,y]]} ], lines?:[…] }
roc       : { type, auc?, points:[[fpr,tpr],…] }
confusion : { type, labels:[…], matrix:[[…],…] }
heatmap   : { type, rows?:[…], cols?:[…], matrix:[[…]], showVals? }
```

**A schematic** — a sequence of panels, boxes and arrows, an annotated grid: things with no axes.
`Charts` cannot draw these. Write **inline SVG directly in the lesson prose**, at the point it
belongs. This is allowed and is the only way to do it. Rules:

- `<svg viewBox="0 0 W H" width="100%" style="display:block;margin:10px auto;max-width:100%">` —
  scales with the column instead of overflowing it.
- **Colors come from the theme**: `var(--accent)`, `var(--accent-2)`, `var(--ink)`,
  `var(--ink-dim)`, `var(--border)`, `var(--panel)`, `var(--panel-2)`, `var(--good)`,
  `var(--warn)`. Never hard-code a hex that has to work in both light and dark mode.
- Give the `<svg>` a `role="img"` and an `aria-label` that describes what it shows.
- No new CSS classes, and no `<style>` blocks — inline `style=` attributes only.

**Never generate an image file.** You have no Bash and no Write; you cannot run a plotting script
or save a PNG, so do not try. If a request truly needs one, say so and stop.

**Placement.** Put the figure **immediately after the paragraph the reader quoted**, unless they
say otherwise — they highlighted that spot on purpose. Introduce it with a one-line lead-in and
follow it with a short "what to read off this" paragraph, the way the courses handle worked
examples.

**Check the numbers.** Any value written on a figure is a claim in a maths lesson, so work it out
before you label it — **by hand, in your reasoning**. You have no Bash, so do not reach for a shell
or a Python one-liner to do the arithmetic; that tool call will stall and cost minutes. Keep the
numbers simple enough to verify mentally (powers of 0.9, small square roots), and state the check
in your reply so it can be spot-read.

## 3. Mark it done

Skip this when the server's worker invoked you — it manages status itself and says so.
Otherwise, after the edit for entry `<ID>` is saved:

```bash
node -e 'const f=".claude/ask-queue.jsonl",fs=require("fs");
fs.writeFileSync(f, fs.readFileSync(f,"utf8").split("\n").filter(Boolean).map(l=>{
  const o=JSON.parse(l); if(o.id===process.argv[1]) o.status="done"; return JSON.stringify(o);
}).join("\n")+"\n")' <ID>
```

## 4. Report

One line per handled entry: the lesson, what you changed, and that the tab has reloaded.
Example: `diff-01 §"A picture is a list of numbers" — expanded the flattening argument with a
3-pixel worked example. Tab reloaded.`

## Notes

- The reader is looking at the page while you edit. Save once per entry, not repeatedly —
  every save triggers a reload in their browser.
- If a request is ambiguous or you'd have to guess at the intended math, leave the entry
  `pending` and ask the user in chat instead of writing something you can't defend.
