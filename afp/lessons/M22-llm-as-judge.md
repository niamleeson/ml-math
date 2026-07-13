# M22 · LLM-as-judge
> **Domain:** Domain 4 · Applied LLMs / GenAI · **Maps to:** Creative Intelligence, Instream Ads perf · **Skip if you can already…** quantify a judge's agreement with humans and detect/correct its biases.

## Overview

An LLM judge is not automatically an evaluation metric. It becomes useful only after the task is defined, the rubric is anchored, agreement with human truth is measured, and systematic bias is tested. Otherwise a judge can confidently reward the first answer, the longer answer, or its own model family's style.

For Creative Intelligence and Instream Ads, judges can help score creative quality, compare generated variants, evaluate content helpfulness, or triage review queues. The protocol is always the same: **measure → validate against humans → detect bias → debias/calibrate → monitor.** This module is S8 Evaluation Protocol: the goal is not to admire the judge, but to prove when its measurements are trustworthy enough to use.

**By the end you can answer:**
- What is LLM-as-judge, and when is it used?
- How do you design a rubric for a judge?
- How do you measure judge↔human agreement with Cohen's kappa, correlation, or accuracy vs majority?
- How do you compute kappa on a small table by hand?
- What are position, verbosity, and self-preference biases?
- How do order-swap, length control, and other mitigations reduce those biases?
- How do you calibrate a judge before trusting it?

Two sub-lessons:

- **M22.1 Designing a judge & measuring agreement** — rubric, human truth, and agreement metrics.
- **M22.2 Detecting & correcting judge bias** — swap-order tests, bias numbers, debiasing, and calibration.

<p class="cur-colab"><a class="cur-colab-btn" href="https://colab.research.google.com/github/niamleeson/ml-math/blob/main/afp/notebooks/M22-llm-as-judge.ipynb" target="_blank" rel="noopener">▶ Open the runnable LLM-as-judge notebook (rubric scoring, human-agreement / Cohen's kappa, position/verbosity/self-preference bias, and judge calibration) in Google Colab</a></p>

---

## M22.1 · Designing a judge & measuring agreement

**The idea.** LLM-as-judge uses a model to grade or compare outputs when exact labels are expensive, subjective, or slow to collect. Common modes are:

**Everyday analogy.** Hiring an LLM judge is like hiring an essay grader for a large class. Before trusting their scores, you give them a rubric, compare their grades with expert human graders, and check whether they are reliable on different kinds of essays. The judge model maps to the grader, the rubric maps to grading instructions, and agreement metrics measure whether the grader is close enough to human truth.

- **pointwise scoring:** rate one creative or answer on a 1–5 scale;
- **pairwise preference:** choose which of two outputs is better;
- **rubric-based grading:** score criteria such as clarity, factuality, safety, brand fit;
- **reference-based evaluation:** compare against a gold answer or policy;
- **reference-free evaluation:** judge quality directly from the prompt and output.

**Judge mode examples, concretely.**

- **Pointwise scoring:** score one Instream creative from 1–5 for "clear, relevant, safe, compelling"; a single weak creative can receive 2 without being compared to another output.
- **Pairwise preference:** show two generated headline variants for the same campaign and ask which is better; the output is `A`, `B`, `tie`, or `uncertain`.
- **Rubric-based grading:** give separate 1–5 scores for clarity, factual support, policy safety, and brand fit, so a creative can be clear but unsafe.
- **Reference-based evaluation:** compare a generated policy explanation against the approved policy answer and penalize missing required caveats.
- **Reference-free evaluation:** judge whether a product-image prompt/output pair looks useful and non-misleading even when no gold image exists.

Use a judge when human review is expensive and the task has a stable rubric. Do not use it as a replacement for deterministic checks when exact metrics exist: if a JSON schema, policy keyword, or unit test can decide the issue, use that first.

**Rubric design is prose, not math.** A good rubric states the task, criteria, scale anchors, examples, disallowed shortcuts, and what to do when uncertain. For an Instream Ads creative-quality judge:

- Task: score whether the creative is likely to be useful and appropriate for the viewer.
- Criteria: relevance to advertiser offer, clarity, factual support, policy safety, visual/text consistency.
- Scale: 1 = harmful or irrelevant, 3 = acceptable but generic, 5 = clear, relevant, safe, and compelling.
- Anchors: include examples at 1/3/5.
- Disallowed shortcuts: do not reward length alone; do not infer missing claims; ignore model/vendor names.
- Abstain: return `uncertain` if the content is outside rubric scope.

**Human truth set.** Before trusting the judge, create a held-out calibration set labeled by humans. For categorical labels, use majority vote and inter-annotator agreement. For numeric scores, compare with human mean or median scores. Keep slices: language, campaign type, ad format, industry, and content length.

**Agreement metrics.** Raw accuracy against human majority is easy:

$$\text{accuracy} = \frac{\#\text{judge labels matching human majority}}{\#\text{examples}}.$$

For numeric scores, use correlation to ask whether judge scores move with human scores. For categorical agreement beyond chance, use Cohen's kappa:

$$\kappa = \frac{p_o - p_e}{1-p_e},$$

where $p_o$ is observed agreement and $p_e$ is expected agreement from the two raters' marginal label frequencies. $\kappa=1$ means perfect agreement, $\kappa=0$ means chance-level agreement under the marginals, and negative values mean worse than chance.

**Raw agreement vs kappa, concretely.**

- **Raw agreement / accuracy:** if humans and the judge match on 8 of 10 creative labels, raw agreement is $8/10=0.80$. It answers "how often did they match?" but ignores whether matching was easy because almost everything had the same label.
- **Cohen's kappa:** if both raters' label frequencies imply chance agreement $p_e=0.50$ and observed agreement is $p_o=0.80$, then $\kappa=(0.80-0.50)/(1-0.50)=0.60$. It answers "how much better than chance under these marginals?"

**Worked example — compute agreement by hand.** Suppose 20 creatives have human-majority labels `good`/`bad`. The judge matches the majority on 16, so

$$p_o = 16/20 = 0.80.$$

The human labels are 10 good and 10 bad. The judge predicts 12 good and 8 bad. Expected chance agreement from marginals is

$$p_e = (10/20)(12/20) + (10/20)(8/20) = 0.30 + 0.20 = 0.50.$$

So

$$\kappa = \frac{0.80-0.50}{1-0.50}=0.60.$$

A $\kappa$ around 0.60 is useful but not magic; inspect disagreements before deployment.

Now the break case: if 95 of 100 creatives are `good`, a judge that always says `good` gets 95% accuracy. But it has no ability to detect bad creatives. Kappa exposes that because the expected agreement from the skewed marginals is also high. High raw accuracy on an imbalanced set is not enough.

```python
po = 0.80
pe = 0.50
kappa = (po - pe) / (1 - pe)
assert round(kappa, 2) == 0.60
```

**You'll be able to say:** *"LLM-as-judge uses a model to grade or compare outputs when exact labels are expensive or subjective, but it must be anchored by a rubric and validated against human judgments. I measure agreement with accuracy against majority labels, correlation for numeric scores, and Cohen's kappa for categorical agreement beyond chance: $\kappa=(p_o-p_e)/(1-p_e)$."*

---

## M22.2 · Detecting & correcting judge bias

**The idea.** A judge can agree with humans on average and still be biased in a way that breaks product decisions. Three common biases matter for Creative Intelligence and Instream Ads:

**Everyday analogy.** An essay grader can look accurate overall but still have bad habits: giving the first essay on the desk a higher grade, mistaking longer essays for better ones, or favoring essays written in their own style. The swap-order test is like re-grading the same two essays after swapping their order; if the winner flips just because position changed, the grader has position bias. In LLM judging, position, verbosity, and self-preference biases are those grading habits turned into measurable protocol failures.

- **Position bias:** in pairwise judging, the first or second answer wins too often.
- **Verbosity bias:** longer answers or creatives are rewarded even when humans prefer concise ones.
- **Self-preference bias:** the judge prefers outputs from its own model family or style.

**Bias examples, concretely.**

- **Position bias:** run the same pair twice: `(A,B)` and `(B,A)`. If A wins in `(A,B)` but B wins in `(B,A)`, and this flip pattern repeats across many pairs, the detectable instance is "the first slot wins," not "the better creative wins."
- **Verbosity bias:** humans prefer a concise two-sentence Instream ad description, but after appending harmless filler to the weaker answer, the judge flips to the longer one. The detectable instance is a length-only edit changing the winner without a human preference change.
- **Self-preference bias:** blind source names and compare outputs from model family X vs Y. If a judge from family X prefers X outputs on slices where humans are tied or prefer Y, the detectable instance is source-family preference after controlling for content.

Bias quantification should use concrete counterfactual tests, not vibes.

**Worked example — measure → validate vs humans → detect bias → debias.** You evaluate two generated ad descriptions, A and B, for 100 creative prompts. Human reviewers prefer A on 52 and B on 48, roughly tied. The judge is run in original order `(A,B)` and swapped order `(B,A)`.

Before debiasing:

| Test | Judge result |
|---|---:|
| Original order `(A,B)` | picks first item 72/100 |
| Swapped order `(B,A)` | picks first item 68/100 |
| Randomized ties | picks position 1 on 70/100 |

On randomized ties, position 1 should win about 50/100. The observed first-position rate is

$$70/100 - 50/100 = 0.20,$$

or a **+20 percentage point** position bias. Agreement with human majority also drops under the swap: 78% in original order, 61% in swapped order. The content did not change; only the order changed. That is position bias.

Debias the protocol:

1. Randomize order for every pair.
2. Run both orders for important comparisons.
3. Aggregate only order-consistent wins; mark contradictions as tie/uncertain.
4. Blind model names and generation source.
5. Normalize or control length when testing verbosity.
6. Recompute judge↔human agreement after the protocol change.

After order-swap aggregation:

| Metric | Before | After |
|---|---:|---:|
| Position-1 win rate on ties | 70% | 53% |
| Human agreement, original order | 78% | 75% |
| Human agreement, swapped order | 61% | 73% |
| Contradictory pairwise verdicts | not tracked | 14% marked uncertain |

The judge is now less decisive, but more honest. The uncertain bucket is a feature: send those examples to humans or a stronger review path.

```python
first_position_rate = 70 / 100
bias_pp = first_position_rate - 0.50
assert round(bias_pp, 2) == 0.20

before_swap_gap = 0.78 - 0.61
after_swap_gap = 0.75 - 0.73
assert after_swap_gap < before_swap_gap
```

**Verbosity and self-preference tests.** For verbosity, create pairs where humans prefer the concise answer, then add harmless extra wording to the losing answer. If the judge flips toward the longer answer without human support, length is acting as a shortcut. Mitigate with rubric language ("do not reward length alone"), length-matched comparisons, or score normalization by answer length slices.

For self-preference, blind model names and compare outputs from different model families. If the judge prefers its own family when humans do not, use blinded prompts, multiple judges, or a judge from a different family. Track agreement by source model, not just overall.

**Calibration before production.** Calibration asks whether judge scores mean what they claim. If the judge says a creative has 0.8 probability of human preference, about 80% of those examples should win with humans. Bucket scores and compare:

| Judge score bucket | Human win rate | Readout |
|---|---:|---|
| 0.9–1.0 | 86% | slightly overconfident |
| 0.7–0.8 | 76% | well calibrated |
| 0.5–0.6 | 52% | near tie |
| 0.3–0.4 | 41% | weak negative signal |

Choose thresholds from the reliability curve. For example, auto-approve only above 0.85 if that bucket reaches the required human agreement; route 0.45–0.65 to human review; monitor slices weekly.

**Evaluation protocol for launch.**

| Evaluation need | Use | Validate with | Main caveat |
|---|---|---|---|
| Subjective quality where humans have a rubric | LLM-as-judge pointwise score | Human score correlation/calibration | Rubric ambiguity |
| Compare two outputs for a task | Pairwise judge | Human majority agreement + order-swap consistency | Position/verbosity bias |
| Exact factual metric exists | Deterministic metric first | Unit tests / labels | Judge may add noise |
| Production monitoring at scale | Calibrated judge + sampled human audits | Slice calibration, drift checks | Bias can reappear as data changes |

Do not launch a judge as a product metric until the calibration set, agreement report, bias tests, thresholds, and human audit loop are documented.

**You'll be able to say:** *"A judge can prefer the first answer, the longer answer, or its own model family's style. I test this by swapping answer order, controlling length, blinding model identity, and checking slices. I calibrate by comparing judge scores with human outcomes on a held-out set, choosing thresholds from reliability/error curves, and keeping a human audit loop."*

---

## Resources
- MT-Bench (Zheng et al.) (LLM-as-judge benchmark + agreement study)
- G-Eval (Liu et al.) (rubric-based LLM evaluation)
- Eugene Yan — LLM-evaluators (practical judge design + pitfalls)
- Ragas docs (RAG/LLM eval metrics)

## Papers
- Judging LLM-as-a-Judge with MT-Bench (Zheng et al., 2023)
- G-Eval (Liu et al., 2023)
- LLMs are not Fair Evaluators — position bias (Wang et al., 2023)
- Constitutional AI (Bai et al., 2022)
