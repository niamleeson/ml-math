# Paper-lesson "Evaluate it" spec

You ADD an `evaluation` field to ONE paper lesson. Building the system is half the job — this
field teaches the reader how to CHECK whether their build actually works. It is rendered as
the "🧪 Evaluate it — is your build actually working?" card, after the code.

You are given the lesson file (a `concept-paper-*.js`) and its id.

## STEP 1 — READ THE LESSON
Read the lesson object: especially `results` (the paper's own reported numbers — reuse these,
do NOT invent new ones), `recipe`, `architecture`, `formula`, `implementBoundary`, `pitfalls`,
and the `paper:{}` metadata. Understand what the system DOES and what "working" means for it.

## STEP 2 — WRITE THE `evaluation` FIELD
An HTML string covering these, tailored to THIS paper (not generic boilerplate). Use `<p>` and
`<ul><li>`. Aim for 5 short, concrete parts:

1. **The metric & benchmark.** The primary metric(s) you compute for THIS system and on what
   data / standard benchmark (the paper's eval setup). Name the no-skill / baseline value so
   "better than trivial" is defined (e.g. random = 50% AUC; majority-class accuracy; a copy
   baseline; the paper's prior-SOTA it beat).
2. **Sanity checks BEFORE the full run.** Cheap tests that catch a broken build early — e.g.
   overfit a single batch and watch the loss go to ~0; check output shapes/ranges/that
   probabilities sum to 1; gradient-check a custom backward; a known-answer unit test; verify
   the loss at init matches the theoretical value (e.g. $-\\ln(1/K)$ for K-way softmax).
3. **Expected range.** What a correct implementation should roughly reach, anchored to the
   paper's reported number (quote it with its source — reuse the lesson's `results`), plus how
   far off is "probably a bug" vs "tuning."
4. **Ablations — prove the key idea earns its keep.** Turn OFF the paper's central component
   (the thing it introduced) and confirm the metric DROPS; if it doesn't, the component isn't
   wired in or isn't helping. Name the specific knob for this paper.
5. **Failure signals & what they mean.** Concrete symptoms of a broken system and the likely
   cause — e.g. metric stuck at chance (labels shuffled / not learning), loss NaN (LR too high /
   bad init), collapsed/identical outputs (mode collapse / posterior collapse), train-good
   val-bad (overfit / leakage). Tie to the lesson's "what you might see" diagram variants where
   relevant.

Keep it specific and runnable-in-spirit. Prefer the paper's actual eval datasets/metrics.

## ANTI-HALLUCINATION
Quote only the paper's real reported numbers (from the lesson's `results`/abstract) with their
source. Never invent benchmark scores. Where you give a target, say it is approximate and cite
the paper. For empirical thresholds you choose (e.g. "loss should halve in N steps"), mark them
as rules of thumb, not paper claims.

## STEP 3 — EDIT THE FILE IN PLACE
Add the `evaluation` field to the lesson object (the `window.LESSONS.push({...})`), placed right
after the `results` field (or after `implementBoundary` if no `results`). Change NOTHING else —
do not touch other fields, `window.CODE`, or `window.CODEVIZ`. If an `evaluation` field already
exists, REPLACE its value with a proper one per this spec.

## CONVENTIONS (hard)
- HTML string. Math in `$...$` with DOUBLED backslashes in the JS string (e.g. `$-\\ln K$`).
- NEVER an HTML entity inside math — use `\\lt`/`\\gt` for `<`/`>`.
- In prose, never a raw `<` before a letter/number — use `&lt;`.
- If the field is written as a `` `template literal` ``: NEVER let `$` be immediately followed
  by `{`; NEVER put a backtick inside it. (A normal `"..."` string avoids both hazards.)

## STEP 4 — VERIFY
Run `node --check <file>` — MUST pass. Confirm the file still has exactly one
`window.LESSONS.push`, and that `evaluation` appears exactly once in the lesson object.

## STEP 5 — REPORT (ONE short line)
e.g. "ok paper-resnet: evaluation added (top-1 on ImageNet vs 3.57% paper, overfit-batch sanity,
ablate skip-connections, NaN/collapse signals), node --check pass".
