# M20 · Fine-tuning / distillation
> **Domain:** Domain 4 · Applied LLMs / GenAI · **Maps to:** all · **Skip if you can already…** choose fine-tune vs distill and run it for a classifier.

## Overview

Prompting, fine-tuning, and distillation are three different answers to the same question: **what is the bottleneck?** If the base model already knows the task but needs clearer instructions, prompt. If it must learn a stable label taxonomy, style, policy, or domain behavior from examples, fine-tune. If the best model is too slow or expensive to serve, distill it into a smaller student.

The failure mode is expensive: teams fine-tune when a prompt would have worked, ship a giant teacher when a student would have met the latency budget, or train on labels without clean splits and then trust a classifier that will not hold up online. This module teaches the decision boundary, the LoRA parameter trick, the distillation objective, and the practical classifier run.

**By the end you can answer:**
- When should you prompt, fine-tune, or distill instead of doing the others?
- What is full fine-tuning vs PEFT/LoRA, and how does low-rank $\Delta W = BA$ save parameters?
- How do classification and generation fine-tuning objectives differ?
- What is distillation, and how does a student learn from teacher soft labels at temperature $T$?
- How do you fine-tune a classifier end-to-end?
- How does multilingual transfer with XLM-R change the classifier plan?

Two sub-lessons:

- **M20.1 Fine-tune vs prompt vs distill + PEFT/LoRA** — choosing the adaptation tool.
- **M20.2 Distillation & running a classifier** — teacher/student training and the classifier pipeline.

---

## M20.1 · Fine-tune vs prompt vs distill + PEFT/LoRA

**The idea.** Start with the cheapest change that addresses the real bottleneck.

| Bottleneck | Best first move | Why |
|---|---|---|
| Model can do the task, but outputs need formatting, examples, or instructions | Prompt / few-shot prompt | No training, easy to change |
| Stable taxonomy, style, policy, or domain behavior must be learned from many examples | Fine-tune, often PEFT/LoRA | The behavior becomes part of the model |
| Strong teacher works but is too slow, costly, or large | Distill | Student imitates the teacher at lower serving cost |
| Need more private/current facts | Retrieval / RAG first | Fine-tuning is a bad database |

Full fine-tuning updates every weight in the model. That can work, but it is costly, storage-heavy, and easier to overfit. **Parameter-efficient fine-tuning (PEFT)** freezes most weights and learns a small set of task-specific parameters. **LoRA** is the common example.

For a frozen weight matrix $W \in \mathbb{R}^{d \times k}$, LoRA uses the adapted weight

$$W' = W + \Delta W, \qquad \Delta W = BA,$$

where $B \in \mathbb{R}^{d \times r}$, $A \in \mathbb{R}^{r \times k}$, and rank $r$ is small. A full update would train $dk$ parameters; LoRA trains only $r(d+k)$ parameters for that matrix.

For $d=k=4096$:

- full update: $4096\cdot4096=16{,}777{,}216$ trainable parameters;
- LoRA rank $r=8$: $8(4096+4096)=65{,}536$ trainable parameters;
- savings: about **256× fewer** parameters, or **0.39%** of the full update.

The break case is also important: if $r=4096$, LoRA trains $4096(8192)=33{,}554{,}432$ parameters for this factorization — no longer a parameter-saving adaptation.

**Classification vs generation objectives.** A classifier fine-tune maps an input to a fixed label set and trains a label distribution, usually with cross-entropy:

$$L_{\text{cls}} = -\log p_\theta(y\mid x).$$

A generation fine-tune maps an input prompt to an output sequence and trains next-token prediction:

$$L_{\text{gen}} = -\sum_t \log p_\theta(y_t \mid x, y_{<t}).$$

That difference matters operationally. For an ads creative taxonomy such as `policy_safe`, `low_quality`, `needs_review`, classification gives a constrained label. For rewriting a creative headline in a brand voice, generation is the natural objective.

**Worked example — prompt, break, then choose LoRA.** Suppose Creative Intelligence needs to classify ad headlines into `clear_value_prop`, `missing_offer`, and `policy_risk`.

A prompt-only version works on common cases:

```python
prompt = "Classify the ad headline into one of: clear_value_prop, missing_offer, policy_risk. Return JSON."
```

It breaks after a week of review data: reviewers use a stable internal convention where "guaranteed results" is always `policy_risk`, but the base model sometimes calls it `clear_value_prop` if the sentence is polished. Adding more prompt text reduces but does not remove the inconsistency.

The fix is not necessarily full fine-tuning. The team has 60k reviewed examples, a stable label set, and a serving model already chosen. Use PEFT/LoRA on the classifier head and selected attention layers:

```python
if task_changes_weekly:
    use_prompt_or_rules()
elif labels_are_stable and examples_are_plentiful:
    train_lora_classifier(rank=8)
elif teacher_is_good_but_too_slow:
    distill_to_student()
```

Full fine-tuning could chase the same labels, but LoRA stores a small adapter per task and keeps the base model fixed. That is useful when multiple ad-quality tasks share one base model but need different adapters.

**Decision guide.**

| Need / constraint | Prompt | Fine-tune / PEFT | Distill |
|---|---|---|---|
| Task works with instruction and examples in context | Best first choice | Usually overkill | Not relevant |
| Stable label taxonomy or style learned from many examples | Brittle | Best choice; prefer PEFT when compute/storage is constrained | Optional after teacher exists |
| Need smaller/faster/cheaper model at serving | Does not reduce model cost | May still be too large | Best choice |
| Need maximum task quality and can afford training/serving | Limited by base model | Full FT or LoRA depending data/infra | Student may lose quality |
| Data is scarce or changing fast | Prompt + retrieval/examples | Risk of overfit | Needs a reliable teacher |

**You'll be able to say:** *"Prompting is first when the base model can already do the task and errors are instruction/schema issues; fine-tune when behavior or labels must be learned from examples; distill when a strong teacher is too slow or costly and I need a smaller student. Full fine-tuning updates every weight; LoRA freezes $W$ and learns $\Delta W=BA$ with rank $r$, so a $d\times k$ matrix uses $r(d+k)$ trainable parameters instead of $dk$. Classification predicts labels; generation predicts next tokens."*

---

## M20.2 · Distillation & running a classifier

**The idea.** Distillation trains a smaller **student** model to imitate a stronger **teacher**. The teacher may be a large LLM, an ensemble, or a fine-tuned model that is too expensive to serve. Instead of training only on hard labels like `policy_risk`, the student learns from the teacher's full probability distribution — including which wrong classes are plausible.

Given teacher logits $z^{(T)}$ and student logits $z^{(S)}$, temperature $T$ softens probabilities:

$$p_i^{(T)} = \frac{\exp(z_i^{(T)}/T)}{\sum_j \exp(z_j^{(T)}/T)}, \qquad
p_i^{(S)} = \frac{\exp(z_i^{(S)}/T)}{\sum_j \exp(z_j^{(S)}/T)}.$$

The distillation loss often uses KL divergence from teacher to student:

$$L_{\text{KD}} = T^2 \sum_i p_i^{(T)} \log\frac{p_i^{(T)}}{p_i^{(S)}}.$$

The $T^2$ factor is commonly used to keep gradient scale comparable when changing temperature. In practice this is often mixed with hard-label cross-entropy:

$$L = \alpha L_{\text{CE}}(y, p^{(S)}) + (1-\alpha)L_{\text{KD}}.$$

For teacher logits $[4,1,-1]$, $T=1$ produces a very peaky target. At $T=2$, the non-top classes receive more probability mass, so the student learns that class 2 is more plausible than class 3 even when both are not the top label.

**The classifier run.** A clean classifier fine-tune is an evaluation pipeline, not just a training command:

1. Define the label taxonomy and examples for each class.
2. Freeze train/validation/test splits before training.
3. Map labels to stable IDs.
4. Tokenize with the model's tokenizer.
5. Add or configure a classification head.
6. Train on cross-entropy or a CE+KD mix.
7. Track accuracy/F1/AUC as appropriate, plus calibration and confusion matrix.
8. Slice errors by product surface, language, campaign type, advertiser segment, and time.
9. Compare student vs teacher quality and latency before serving.

```python
# Sketch only: the important part is the protocol, not this exact framework.
train, val, test = frozen_split(examples, by="time_and_campaign")
teacher_probs = teacher.predict_proba(train.text, temperature=2.0)
student = init_classifier("xlm-roberta-base", num_labels=3)

for batch in train.batches():
    hard_loss = cross_entropy(student(batch.text), batch.label_id)
    soft_loss = kl_divergence(
        softmax(teacher.logits(batch.text) / 2.0),
        softmax(student.logits(batch.text) / 2.0),
    ) * (2.0 ** 2)
    loss = 0.5 * hard_loss + 0.5 * soft_loss
    loss.backward()
```

**Worked example — deploy the student, not the teacher.** Creative Intelligence has a large teacher that labels headline quality with 93% agreement to senior reviewers, but it is too slow for batch scoring millions of creatives. A small student trained only on hard labels reaches 86% validation accuracy and misses ambiguous cases. The same student trained with hard labels plus teacher soft labels reaches 89% and matches the teacher on borderline `missing_offer` vs `clear_value_prop` examples.

The serving decision is not "student beats teacher." It is: the student is close enough on quality, much cheaper, and its failures are known. Track:

- hard-label accuracy vs human majority;
- teacher-student agreement;
- latency and cost per 1M examples;
- calibration by score bucket;
- per-slice metrics for languages and product surfaces.

**Multilingual transfer with XLM-R.** XLM-R uses a multilingual subword vocabulary and encoder, so one classifier can transfer across languages. That changes the plan:

- do not validate only on English if Spanish and French ads will be served;
- keep language labels in evaluation even if the model is shared;
- compare zero-shot transfer, translate-train, and language-specific examples;
- watch low-resource languages where subword coverage and review-label quality may be weaker.

A good result might be EN 91%, ES 88%, FR 87%; a hidden failure is EN 92%, ES 71%, FR 69% with the average masked by English volume.

**You'll be able to say:** *"Distillation trains a student to match a teacher's softened probability distribution, often with KL divergence at temperature $T$, optionally mixed with hard-label cross-entropy. A classifier run needs frozen splits, label IDs, tokenization, a classification head, train/val metrics, calibration/error checks, and a held-out test. For multilingual transfer, XLM-R lets one encoder share subword representations across languages, but I still validate by language and watch low-resource degradation."*

---

## Resources
- HuggingFace — PEFT / LoRA (parameter-efficient fine-tuning)
- DeepLearning.AI — Finetuning LLMs (when and how to fine-tune)

## Papers
- LoRA (Hu et al., 2021)
- DistilBERT (Sanh et al., 2019)
- XLM-R (Conneau et al., 2020)
