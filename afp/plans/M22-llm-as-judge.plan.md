# Module Plan — M22 · LLM-as-judge & validating the judge

| Field | Value |
|---|---|
| Domain | Domain 4 · Applied LLMs / GenAI |
| Skip if you can already… | quantify a judge's agreement with humans and detect/correct its biases |
| Maps to (projects) | Creative Intelligence, Instream Ads perf |
| Primary structure(s) | S8 Evaluation Protocol |
| Example type | ⚑ Both |
| Sub-lessons | 2 |
| Notebooks | 1 |

## Module hub (the "complete list")
An LLM judge is useful only if its measurements are defined, validated against human truth, and
monitored for bias. This module teaches the judge loop: design the rubric, quantify agreement with
humans, then detect and correct position/verbosity/self-preference biases before using the judge in
a Creative Intelligence or Instream Ads evaluation.

- M22.1 · Designing a judge & measuring agreement
- M22.2 · Detecting & correcting judge bias

## Questions this module answers (→ which sub-lesson teaches the answer)
- What is LLM-as-judge, and when is it used? → M22.1
- How do you design a rubric for a judge? → M22.1
- How do you measure judge↔human agreement with Cohen's kappa, correlation, or accuracy vs majority? → M22.1
- How do you compute kappa on a small table by hand? → M22.1
- What are position, verbosity, and self-preference biases? → M22.2
- How do order-swap, length control, and other mitigations reduce those biases? → M22.2
- How do you calibrate a judge before trusting it? → M22.2

_Every question maps to a sub-lesson (coverage confirmed below)._

## Concepts (ƒ = genuine, central formula)
- LLM-as-judge: pairwise preference, pointwise scoring, rubric-based grading, reference-free/reference-based eval
- Rubric design: criteria, scale anchors, examples, disallowed shortcuts, abstain/uncertain option
- Human truth set; majority vote; inter-annotator agreement; judge↔human validation
- Cohen's kappa **ƒ**; observed agreement p_o, expected agreement p_e; correlation; accuracy vs majority
- Position bias, verbosity bias, self-preference/model-family bias; prompt leakage; non-determinism
- Mitigations: order-swap, randomized order, length control, blinded model names, calibration set, threshold tuning
- Judge calibration: reliability by score bucket, threshold selection, slice monitoring, periodic human audits

## Sub-lessons

### M22.1 · Designing a judge & measuring agreement  —  [S8 Eval, ⚑]
- **Makes answerable:** what LLM-as-judge is and when used; how to design a rubric; how to measure judge↔human agreement; how to compute Cohen's kappa by hand.
- **You'll be able to say:** "LLM-as-judge uses a model to grade or compare outputs when exact labels are expensive or subjective, but it must be anchored by a rubric and validated against human judgments. I measure agreement with accuracy against majority labels, correlation for numeric scores, and Cohen's kappa for categorical agreement beyond chance: κ=(p_o-p_e)/(1-p_e)."
- **Concepts:** LLM-as-judge use cases; rubric design; human truth set; majority vote; accuracy/correlation; Cohen's kappa **ƒ**.
- **Key Idea focus:** what to measure and how to validate it against truth before trusting automated evaluation.
- **Worked-example shape:** measure → validate vs truth → debias. Draft a 1–5 rubric for ad creative quality or answer helpfulness, score a small table, compute majority-human accuracy and kappa by hand.
- **Notebook:** Yes — simulate human and judge labels/scores; compute accuracy, correlation, and Cohen's kappa with numpy; `assert` perfect agreement has κ=1 and chance-like agreement is near 0. Break case = high raw accuracy on an imbalanced label set but low kappa.
- **Real numbers to cite:** for 20 examples with p_o=0.80 and p_e=0.50, κ=(0.80-0.50)/(1-0.50)=0.60; if all examples are "good," majority accuracy can look high while kappa exposes little beyond-chance signal.

### M22.2 · Detecting & correcting judge bias  —  [S8 Eval, ⚑]
- **Makes answerable:** position/verbosity/self-preference biases; mitigations such as order-swap and length control; judge calibration before production use.
- **You'll be able to say:** "A judge can prefer the first answer, the longer answer, or its own model family's style. I test this by swapping answer order, controlling length, blinding model identity, and checking slices. I calibrate by comparing judge scores with human outcomes on a held-out set, choosing thresholds from reliability/error curves, and keeping a human audit loop."
- **Concepts:** position bias, verbosity bias, self-preference; order-swap/randomization; length control; blinded identities; calibration set; threshold tuning; slice monitoring.
- **Key Idea focus:** detect systematic measurement error, correct the protocol, and only then use the judge as a scalable metric.
- **Worked-example shape:** measure → validate vs human truth → detect & correct bias. Show a pairwise judge prefers A when order is AB and still prefers first after BA; apply order-swap aggregation and length normalization; recalibrate threshold.
- **Notebook:** Yes — extend the M22.1 simulation with a position-biased judge; show order-swap flips a verdict; aggregate swapped judgments; `assert` bias rate drops after swap-averaging. Break case = verbose answer wins despite lower human score.
- **Real numbers to cite:** if a judge picks position 1 on 70/100 randomized ties, position bias is +20 points over the 50/50 expectation; after order-swap aggregation it should move closer to 50/50. Track calibration buckets such as predicted 0.8 quality → about 80% human win rate.

## Coverage check
All 7 module questions are answered: judge definition, rubric, agreement metrics, and hand kappa → M22.1; biases, mitigations, and calibration → M22.2. No gaps.

## Decision guide (only if the module has a when-to-pick-X-vs-Y)
| Evaluation need | Use | Validate with | Main caveat |
|---|---|---|---|
| Subjective quality where humans have a rubric | LLM-as-judge pointwise score | Human score correlation/calibration | Rubric ambiguity |
| Compare two outputs for a task | Pairwise judge | Human majority agreement + order-swap consistency | Position/verbosity bias |
| Exact factual metric exists | Deterministic metric first | Unit tests / labels | Judge may add noise |
| Production monitoring at scale | Calibrated judge + sampled human audits | Slice calibration, drift checks | Bias can reappear as data changes |

## Resources (from the guide)
- MT-Bench (Zheng et al.) (LLM-as-judge benchmark + agreement study)
- G-Eval (Liu et al.) (rubric-based LLM evaluation)
- Eugene Yan — LLM-evaluators (practical judge design + pitfalls)
- Ragas docs (RAG/LLM eval metrics)

## SOTA papers (from the guide)
- Judging LLM-as-a-Judge with MT-Bench (Zheng et al., 2023)
- G-Eval (Liu et al., 2023)
- LLMs are not Fair Evaluators — position bias (Wang et al., 2023)
- Constitutional AI (Bai et al., 2022)

## Notes / caveats
- Keep Cohen's kappa as the genuine formula; do not manufacture equations for every bias.
- Use deterministic/simulated judge outputs in notebooks; no external LLM API calls are needed.
- Always teach judge metrics as a supplement to human truth, not a replacement for validation.
