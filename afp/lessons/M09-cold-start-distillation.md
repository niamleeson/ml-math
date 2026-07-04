# M9 · Cold-start / warm-start / transfer & distillation
> **Domain:** Domain 1 · Core: Ranking & Evaluation · **Maps to:** all · **Skip if you can already…** design a cold→warm handoff with exit criteria

## Overview

Cold-start is the moment when the model has the least evidence but the product still has to decide. New users, new items, and new systems do not wait for perfect labels. The safe pattern is to begin with priors, content, and guardrails, then hand off to learned evidence only when the evidence is strong enough.

**By the end you can answer:**
- What are cold-start types (item/user/system), and why do they break learned models?
- How do content features, popularity priors, and heuristics bridge cold-start?
- How do you design a cold→warm handoff with exit criteria?
- When does transfer learning help?
- Why use distillation for latency or warm-start?
- How do you blend a prior with learned evidence using confidence?

Two sub-lessons:

- **M9.1 Cold-start & the cold→warm handoff** — priors, confidence blends, and exit criteria.
- **M9.2 Transfer & distillation** — reuse signal and compress expensive teachers.

---

## M9.1 · Cold-start & the cold→warm handoff (priors, confidence blend, exit criteria)

**The idea.** Cold-start has several forms:

| Type | What is missing | Example |
|---|---|---|
| New item | Item interaction history | New Event Ad or creator profile |
| New user | User history | First-session member |
| New system/marketplace | Reliable labels and policy history | New product surface |

These break learned models because ID embeddings, historical rates, and collaborative signals are missing or unstable. The answer is not "turn off ML"; it is a controlled bridge from safe priors to learned evidence.

**Naive → break.** A new Event Ad receives **2 clicks / 20 impressions**, a raw CTR of **10%**. If the system treats that as a stable learned estimate, pacing may overallocate budget to a noisy early spike. If the learned-only model has no item history, it may also score the ad as zero or near-random.

**Fix with content, priors, heuristics.** Start with features available at launch: event category, target audience, creative text, advertiser history, similar-event priors, and safe pacing rules. A category prior of **1.0%** CTR is less exciting than 2/20, but it is much more stable.

Cold-start bridges are deliberately boring:

- Content features say what the item is.
- Popularity/category priors say what similar items usually do.
- Heuristics keep the product safe before labels arrive.
- Exploration gives the system a fair chance to collect evidence.


A genuine confidence blend combines the prior and learned estimate:

$$\hat p = (1-c_n)p_{\text{prior}} + c_n p_{\text{learned}},$$

where $c_n$ grows with evidence. A simple choice is $c_n=n/(n+k)$, with $k$ controlling how much evidence is needed before trusting the learned rate.

**Worked example — early spike, controlled handoff.** Let $p_{prior}=1.0\%$, $p_{learned}=10.0\%$, $n=20$, and $k=1000$. Then $c_n=20/1020\approx0.02$, so the blended score is about **1.18%**, not 10%. After **1,000 impressions** and at least **20 positives**, the learned component can carry much more weight.

```python
p_prior = 0.010
p_learned = 0.100
n = 20
k = 1000
confidence = n / (n + k)
p_blend = (1 - confidence) * p_prior + confidence * p_learned
assert round(p_blend, 4) == 0.0118
```

**Exit criteria.** A cold→warm handoff needs explicit gates, not intuition:

The handoff can be gradual rather than binary. Increase learned-model weight as evidence grows, but keep a rollback path when calibration, pacing, or guardrails become unstable.


- Minimum impressions, such as **≥1,000**.
- Minimum positives, such as **≥20** clicks/conversions.
- Stable calibration on the relevant slice.
- Pacing stability for ads budgets.
- Guardrail metrics not regressing.

**Scale.** Different cold-start types need different bridges. New item: content + category priors. New user: context/session/popularity. New system: heuristics + transferred representation + careful experimentation. For Event Ads pacing, never let the first few sparse events dominate budget allocation.

Operationally, log which regime produced each score: cold prior, blended, or warm learned. That lets offline analysis separate "the model is bad" from "the handoff happened too early." It also lets you replay launch periods and tune the confidence schedule without guessing.


A decision guide:

| Situation | Prefer | Guardrail |
|---|---|---|
| New item with metadata | Content model + category prior | Minimum impressions before full warm score |
| New user | Session/context + popularity | Do not overpersonalize from one action |
| New marketplace | Heuristic + transfer | Validate source-target match |
| Early Event Ads pacing | Prior + confidence blend | Budget cannot chase first few clicks |


**You'll be able to say:** *"User, item, and system cold-start break models because the historical interaction features or learned IDs are missing. Start with content features, popularity priors, and safe heuristics; blend the prior with the learned model as evidence grows; switch only when exit criteria such as impressions, positives, calibration confidence, or pacing stability are met. For Event Ads pacing, the cold phase should avoid overreacting to the first few sparse events."*

---

## M9.2 · Transfer & distillation

**The idea.** Transfer and distillation reuse signal, but they solve different problems. Transfer starts a target model from a source model or representation when target labels are scarce. Distillation trains a cheaper student to imitate a stronger teacher, often for latency, serving cost, or warm-start.

**When transfer helps.** Transfer helps when source and target share features, behavior, or representation. A model trained on mature event campaigns may help new Event Ads if the same audience, creative, and category signals matter. It can hurt when objectives differ: a source model optimized for clicks may transfer poorly to quality registrations or long-term value.

Check source-target fit explicitly:

- Are the feature meanings the same?
- Are labels measuring the same behavior?
- Are calibration and base rates similar enough to reuse?
- Does fine-tuning beat a scratch baseline on target validation?


**Naive → break.** Train a target model from scratch with **1k labels**. It underfits and has unstable calibration. Or copy a source model blindly and get negative transfer because the source objective is shifted.

**Fix.** Initialize from a related source, freeze or fine-tune shared layers, and compare against scratch with the same target validation. Transfer is a hypothesis, not a guarantee. A real number target: transfer reaches target AUC **0.70** with **1k** labels where scratch needs **10k** labels.

**Distillation.** A teacher may be accurate but too slow. A student learns from the teacher's soft labels. With temperature $T$, teacher probabilities are softened so the student sees more than hard 0/1 outcomes. The distillation term commonly uses KL divergence:

$$\mathcal{L}_{distill}=T^2\,\mathrm{KL}\left(\mathrm{softmax}(z_t/T)\;\|\;\mathrm{softmax}(z_s/T)\right).$$

The $T^2$ factor keeps gradient scales comparable as temperature changes. The practical idea is that the teacher's relative probabilities carry "dark knowledge": which wrong answers or lower-ranked items are almost plausible.

**Worked example — quality/latency tradeoff.** A teacher ranker gets AUC **0.78** but takes **40 ms**. A distilled student gets AUC **0.76** at **5 ms**. If serving latency is the bottleneck, the student may be the right production model. If the teacher's output is also used to warm-start a target with few labels, validate that the student improves early learning without copying source bias.

```python
teacher_ms = 40
student_ms = 5
teacher_auc = 0.78
student_auc = 0.76
assert student_ms < teacher_ms
assert teacher_auc - student_auc <= 0.03
```

**Break case.** A teacher trained on a biased old policy can distill that bias into the student. Distillation makes serving cheaper; it does not magically debias labels. Evaluate slices, calibration, and policy guardrails.

Distillation is a production tradeoff, not a free upgrade. Keep the teacher as an offline reference, compare student-vs-teacher disagreement on important slices, and rerun calibration because matching logits does not guarantee serving probability quality.

Use distillation when one of these is true:

- The teacher is too slow for online serving.
- The target task needs a warm-start before labels accumulate.
- A compact model is needed on a constrained serving path.



**You'll be able to say:** *"Transfer helps when source and target tasks share representations, features, or behavior patterns and the target has limited labels; it hurts when domains or objectives mismatch. Distillation trains a smaller or cheaper student to match a teacher's soft outputs, often with temperature to expose dark knowledge, so the student can serve faster or warm-start before enough target labels arrive."*

---

## Resources
- Eugene Yan — recsys writing (practical cold-start patterns)
- Microsoft Recommenders (content + hybrid cold-start baselines)

## Papers
- Distilling the Knowledge in a Neural Network (Hinton et al., 2015)
