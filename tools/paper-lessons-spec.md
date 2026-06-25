# Authoring a "Paper" lesson — read → understand → implement

Each lesson is ONE landmark ML/AI paper. The learner READS it, UNDERSTANDS the math (every symbol
defined in plain English, real numbers worked through the key equation), and IMPLEMENTS it in a
runnable Google Colab notebook. Many papers are also components of a CAPSTONE spine (a build-a-system
path) — see `tools/capstone-spec.md`. You write ONE self-contained file `lessons/concept-<id>.js`.

────────────────────────────────────────────────────────────────────────
## ANTI-HALLUCINATION — mandatory. The lesson must be GROUNDED, not recalled.
────────────────────────────────────────────────────────────────────────
1. FETCH THE PAPER FIRST. Use WebFetch on the arXiv abstract page (`https://arxiv.org/abs/<id>`) for
   metadata, and for the METHOD/equations use the ar5iv HTML mirror `https://ar5iv.labs.arxiv.org/html/<id>`
   (this renders reliably; note `arxiv.org/html/<id>` and the PDF often fail to parse — prefer ar5iv).
   If you do not know the arXiv id, web-search the title first. Write the explanation FROM the fetched
   text. Cite the section you are summarizing.
2. METADATA from the fetched source only — authors, year, venue, and (if shown) citation count. Stamp
   citations with the date and source, e.g. "210k+ (Semantic Scholar, 2026-06)". NEVER invent a number.
3. TRANSCRIBE the key equation from the paper (note its equation/section number). Do NOT recall it.
4. NEVER state a specific headline metric from memory. Either QUOTE it WITH its source (from the fetched
   text), or omit it. Every number in CODEVIZ is OUR OWN small run — label it explicitly:
   "our small-scale run, not the paper's reported number."
5. THE CODE IS THE ORACLE. Track A ends in `torch.allclose(mine, nn.X(...))`; Track B reproduces the
   paper's QUALITATIVE effect on toy data. If your math is wrong, the code disagrees — fix the math.
6. If the fetched source does not support a detail, OMIT it. Do not invent. Flag anything you are unsure of.
7. If WebFetch is unavailable in your environment, STOP and report that — do not fall back to pure recall.

────────────────────────────────────────────────────────────────────────
## TRACKS — implement the IDEA, import the PLUMBING
────────────────────────────────────────────────────────────────────────
- `track: "primitive"` (🔨A): the paper's contribution is something PyTorch now ships as one call
  (BatchNorm, Adam, Dropout, Convolution, LSTM/GRU cell, scaled dot-product Attention, LayerNorm,
  word2vec). BUILD IT FROM SCRATCH with raw tensors + autograd, then VERIFY with
  `torch.allclose(mine, nn.TheLayer(...))`. The payoff is the allclose: "my version IS PyTorch's."
- `track: "architecture"` (🧩B): the paper builds ON TOP of primitives (ResNet, Transformer, GAN, VAE,
  DDPM, PPO, DQN, CLIP, DETR...). Use `nn.Conv2d`/`nn.Linear`/etc.; implement ONLY the novel
  composition/algorithm; train on toy data; reproduce the effect; then ABLATE the novel part.
- `track: "read-only"` (📖): dataset / benchmark / survey / pure-scale result. No implementation cell.
  Strictest fetch + fact-check. Optionally a tiny CONCEPTUAL demo (e.g. in-context learning on a small
  model). Set `CODE`/`CODEVIZ` to a small conceptual illustration or omit.

────────────────────────────────────────────────────────────────────────
## FIELD SCHEMA
────────────────────────────────────────────────────────────────────────
```
(function () {
  window.LESSONS.push({
    id: "paper-<slug>",
    title: "<Short name> — <Paper title> (<year>)",
    tagline: "<one plain sentence: what it introduced>",
    module: "Papers · <Theme>",            // exact theme from the 200-list; capstone pages use "Capstones"
    track: "primitive" | "architecture" | "read-only",
    paper: {                               // ALL from the fetched source
      authors: "...", org: "...", year: <n>, venue: "...",
      citations: "... (<source>, <YYYY-MM>)",
      arxiv: "https://arxiv.org/abs/<id>", code: "<official repo if any>"
    },
    conceptLink: "<existing concept-lesson id or null>",   // math owner; recap+link, don't re-derive
    partOf: [ { capstone: "capstone-<id>", step: <n>, builds: "<the component>" } ],  // [] if standalone
    prereqs: [ <existing ids you VERIFY by grepping window.LESSONS> ],

    // WHY READ IT
    problem: `...`,        // what was broken before this paper (from the paper's intro)
    contribution: `...`,   // <ul> the 1-3 things it introduced
    whyItMattered: `...`,  // impact / what built on it

    // READING GUIDE
    readingGuide: `...`,   // which sections/figures/tables to read; what to skim

    // PREDICT + ATTEMPT (active learning)
    predict: `...`,        // a question the learner guesses before running (e.g. "will residual beat plain?")
    attempt: `...`,        // the spec of what they implement before the reveal (mirrors CODE, with TODOs)

    // ★ HOW IT WORKS — the explanation (largest section) ★
    walkthrough: `...`,    // the method in plain English, step by step (from the fetched paper)
    symbols: [ { sym:"$...$", desc:"plain-English meaning" }, ... ],  // EVERY symbol AND jargon term, before use
    formula: `$$...$$`,    // the key equation, transcribed from the paper (mention eq/section #)
    whatItDoes: `...`,     // what the equation says in words
    derivation: `...`,     // why it's true. FULL if conceptLink is null; SHORT recap + link if it exists.
    example: `...`,        // WORKED NUMBERS through the formula, step by step (must match the notebook output)
    recipe: `...`,         // the architecture/algorithm as numbered steps (what you'll implement)
    results: `...`,        // what they tested + headline figure — QUOTED with source, or omitted

    // IMPLEMENT + REFLECT
    implementBoundary: `...`,  // what you build by hand vs import (track A vs B)
    pitfalls: `...`,       // <ul> repro gotchas + common misreadings
    recall: [ "state the key equation from memory", "define $\\Gamma$", ... ],  // retrieval checkpoint
    practice: [ { q:`...`, steps:[{do:`...`, why:`...`}], answer:`...` }, ... ]  // includes an ablation
  });
  window.CODE["paper-<slug>"] = { lib:"PyTorch", runnable:false, explain:`...`, code:`...` };
  window.CODEVIZ["paper-<slug>"] = { question:"...", charts:[...], caption:"...", code:`...` };
})();
```

## PAGE RENDER ORDER (active)
paper card → tagline → problem → contribution → whyItMattered → readingGuide → predict → attempt →
(reveal) How-it-works: walkthrough · symbols · formula · whatItDoes · derivation · example(worked numbers) ·
recipe · results → conceptLink recap → implementBoundary → CODE → CODEVIZ → pitfalls → recall → practice.

## CODE (the notebook payload)
- `runnable:false` (runs in Colab; torch/torchvision are preinstalled — never pip-install them).
- Track A: build the primitive from raw tensors/autograd; INCLUDE the `torch.allclose(mine, nn.X(...))`
  verification and PRINT it. Then use it in a 2-line net.
- Track B: build the novel module/algorithm from `nn` primitives; train on tiny data (MNIST/CIFAR subset,
  toy text, CartPole); PRINT the headline effect; include the ABLATION that breaks the novel part.
- The WORKED EXAMPLE numbers from `example` must be recomputed in a cell and match.

## CODEVIZ
- Reproduce the paper's QUALITATIVE effect on toy data (residual beats plain; SGD vs Adam; GAN samples
  improve; PPO is more stable). Numbers are OURS — caption must say "our small run, not the paper's number."
- numpy/torch reproducible; subsample <= 60 points; RUN it and embed the real numbers.

## HARD CONVENTIONS
1. Teaching fields are HTML — `<p>`, `<b>`, `<i>`, `<ul>/<ol><li>`, `<code>`. Short, plain sentences.
   Define every term before using it.
2. Math in `$...$`/`$$...$$`; DOUBLE every backslash in JS strings. NEVER an HTML entity inside `$...$`
   (use `\\lt`/`\\gt`), EXCEPT the established timestep index notation `^{&lt;t&gt;}` which the app renders.
3. NEVER a raw "<" before a letter/number in prose — write `&lt;`.
4. Expand every abbreviation on first use.
5. Run `node --check lessons/concept-paper-<slug>.js` and fix any error.

## REPORT
paper id, track, arXiv id you fetched, the key equation (eq #), what CODE runs, the allclose/repro result,
any item you could NOT ground (for fact-check), and the node --check result.
