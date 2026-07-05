# M1 · Supervised learning
> **Domain:** Domain 0 · ML Foundations · **Maps to:** all · **Skip if you can already…** frame a problem as features→label, split train/val/test, reason about over/underfitting, pick classification vs regression

## Overview

Supervised learning is the default shape of most production ML work: you have historical examples where the answer is known, and you train a function to predict that answer for new cases. In ads, that might mean predicting whether an impression will be clicked, how much value a campaign will deliver, or which creative class a review system should assign.

The skill is not just fitting a model. It is framing the task so the label is clear, the features are knowable at prediction time, and the evaluation split tells you whether the model will generalize rather than whether it memorized yesterday's data.

**By the end you can answer:**
- What are features, labels, examples, and supervised learning?
- How do you tell classification from regression, binary from multiclass, and multilabel from multiclass?
- How do you frame a real task like "will this ad be clicked?" as features→label with a prediction time?
- What is a baseline, and why must a model beat it?
- Why split train/validation/test, and what is each split for?
- When should a split be random, stratified, temporal, or grouped?
- Why is the test set read only once?
- What are overfitting and underfitting, and how do you read them from train↔validation behavior?
- What is the bias–variance tradeoff?

Three sub-lessons:

- **M1.1 Framing a supervised problem** — naming the example, features, label, prediction time, task type, and baseline.
- **M1.2 The split discipline** — train fits, validation tunes, test estimates generalization.
- **M1.3 Over/underfitting & the bias–variance tradeoff** — reading the train↔validation gap.

---

## M1.1 · Framing a supervised problem

**The idea.** A supervised dataset is made of **examples**. Each example has **features** — information available before the prediction — and a **label** — the answer you later learn. A model learns a mapping from features to label from historical labeled examples, then applies that mapping to new examples whose labels are not yet known.

**Everyday analogy.** Predicting whether a friend shows up to dinner. The **features** are what you know beforehand — did they RSVP, how far away they live, did they come last time. The **label** is what you find out afterward — did they actually show. You learn the pattern from past dinners (labeled examples) and apply it to the next invite. If they show up 90% of the time, the **baseline** is "always predict yes," and your model has to beat that to be worth anything. The answer's shape sets the task: "will they show?" is yes/no (classification); "how many minutes late?" is a number (regression).

For a pCTR model, one example might be one ad impression. The features include the campaign, creative, member context, placement, device, time, and recent campaign history known before the impression is served. The label is whether the member clicked within the attribution window. The prediction time is the moment the ranking or auction system needs the score.

**Task type comes from the label.**

| Label shape | Task type | Ads-flavored example |
|---|---|---|
| yes/no category | binary classification | clicked within 24h? |
| one of many categories | multiclass classification | which policy bucket does this creative fall into? |
| several categories can be true | multilabel classification | which topics describe this campaign? |
| number on a scale | regression | expected conversion value or watch time |

**Concrete label examples — one per task type.**

- **Binary classification:** label `clicked_24h` is either 0 or 1; an impression with no click in 24h has $y=0$.
- **Multiclass classification:** a creative-review label is exactly one of `{approved, needs_edit, rejected}`; a rejected ad gets only `rejected`, not the other two.
- **Multilabel classification:** a campaign can be tagged `{B2B, hiring}` at the same time, so the label vector might be `[B2B=1, hiring=1, learning=0]`.
- **Regression:** label `watch_seconds` is a number; a member who watches a video ad for 17.4 seconds has $y=17.4$.

A **baseline** is the simple thing your model must beat. For classification it may be the majority class or a constant probability; for regression it may be the training mean. Baselines keep you honest: if 6% of impressions click, a model that predicts "no click" for every impression gets 94% accuracy, but it has learned nothing useful for ranking clicks.

**Worked example — turn a product question into features→label.** Product question: "Will this sponsored update be clicked?"

1. **Example:** one impression of one ad to one member.
2. **Prediction time:** just before the ad is ranked or served.
3. **Features:** member country, device, ad format, campaign id, bid, historical campaign click rate before this impression, and creative metadata available before serving.
4. **Label:** clicked within 24 hours after the impression.
5. **Task type:** binary classification, because the label is yes/no.
6. **Baseline:** predict the training click rate for every row, or rank by a simple historical CTR feature.

Now compare three other tasks:

- "How many minutes will a member watch this video?" → regression, because the label is numeric.
- "Is this creative in policy bucket A, B, or C?" → multiclass, because exactly one class is chosen.
- "Which topics apply to this campaign: hiring, learning, B2B, events?" → multilabel, because several can be true at once.

**You'll be able to say:** *"Supervised = learn a function from labeled examples. The label's type sets the task: categorical → classification (binary/multiclass/multilabel by shape), continuous → regression. Frame a task by naming the label, the features knowable before it, and the prediction time; a model must beat the majority/mean baseline to be worth anything."*

---

## M1.2 · The split discipline (train/val/test, honestly)

**The idea.** A model can always look good on data it was allowed to learn from. Splits create roles: **train** is used to fit parameters, **validation** is used to choose features, hyperparameters, thresholds, and model versions, and **test** is read once at the end as an honest estimate of how the selected model generalizes.

**Everyday analogy.** Studying for an exam. The **training set** is the practice problems you learn from. The **validation set** is a mock exam you use to decide what to study next and which strategy works. The **test set** is the real exam — you sit it once, and if you'd already seen those exact questions, your score would be a lie. Peeking at the test to pick your approach is like getting the real exam's answers during practice: your grade stops predicting how you'll do on genuinely new questions. And if the real exam is next month, drilling only last year's identical questions (a random split) won't tell you how you'll handle this year's — you need to rehearse on newer material (a temporal split).

The genuine math idea is the gap between what you minimize and what you care about. Training minimizes empirical risk,

$$\hat{R}(f) = \frac{1}{n}\sum_{i=1}^{n}\ell(f(x_i), y_i),$$

an average loss on observed training examples. The real goal is low loss on new examples from the production population. The **generalization gap** is the difference between validation/test loss and training loss; a growing gap means the model is fitting details that do not transfer.

**Pick the split that matches the risk.**

| Split | Use when | What it prevents |
|---|---|---|
| Random | rows are roughly IID and plentiful | accidental ordering artifacts |
| Stratified | positives or classes are rare | a fold with too few positives |
| Temporal | the model will predict the future from the past | future information leaking backward |
| Grouped | members, campaigns, companies, or creatives repeat | the same entity appearing in train and eval |

**Same 12 impressions, four split choices.**

- **Random:** shuffle all 12 rows and put 9 in train / 3 in validation when rows are IID; row 7 can land in validation even if row 8 is in train.
- **Stratified:** if the 12 rows contain only 2 clicks, force each fold to keep roughly the same click rate instead of accidentally making a 3-row validation fold with 0 clicks.
- **Temporal:** train on Monday–Wednesday impressions and validate on Thursday when production will score future traffic from past training.
- **Grouped:** if campaign C has rows 1, 4, and 9, place all three on the same side so the model cannot recognize C in validation from C in train.

For pCTR and campaign models, temporal and grouped thinking often matter more than a random split. If campaign 123 appears in both train and validation, a model may memorize that campaign rather than learn a pattern that transfers to future campaigns.

**Worked example — why stratification and time matter.** Suppose you have 50,000 impressions and only 200 clicks. A naive random 1,000-row validation slice has an expected 4 clicks; by chance it may have 0, 1, or 2. A threshold decision tuned on that fold will be noisy. A stratified split keeps the positive rate close to the original rate in every fold.

```python
train, val = stratified_split(df, label="clicked")
train_rate = train.clicked.mean()
val_rate = val.clicked.mean()
assert abs(train_rate - val_rate) < 0.002
```

But stratification alone is not enough for time-ordered data. If the model will be trained on January and used in February, validate on later time, not on a random mixture of the whole month. And if the goal is to generalize to new campaigns, group by campaign so a campaign does not appear on both sides of the split.

The test set is read only once because every time you choose the better model based on test, you train on the test signal. After enough tries, the test set becomes another validation set and its number is inflated.

**You'll be able to say:** *"Train fits, validation tunes, test is read once as an honest estimate of true risk. Stratify for rare events, split by time for time-ordered data, split by entity when members/campaigns repeat. Reusing test turns it into a second training set and inflates the number."*

---

## M1.3 · Over/underfitting & the bias–variance tradeoff

**The idea.** **Underfitting** means the model is too simple or poorly trained to capture the signal: train and validation are both bad. **Overfitting** means the model captured training-specific noise: train is good but validation is much worse. The key signal is the train↔validation gap, not the training score by itself.

**Everyday analogy.** Two students prepping from the same practice set. One *memorizes* the exact practice answers: perfect on the practice test (low train error), but bombs the real exam the moment questions are reworded (high validation error) — that's **overfitting**. The other barely studied and does badly on both practice and real exam — that's **underfitting**. The gap between practice and real-exam scores — not the practice score alone — tells you which student you're holding.

Capacity is the model's ability to fit complex patterns. More capacity can reduce bias — missing real structure — but can increase variance — sensitivity to the particular sample. The **bias–variance tradeoff** is the practical tension between models that are too rigid and models that are too flexible for the data you have.

**How to read the pattern:**

| Train result | Validation result | Diagnosis | Typical next move |
|---|---|---|---|
| bad | bad | underfitting / high bias | add useful features, increase capacity, train better |
| good | bad | overfitting / high variance | regularize, simplify, get more data, fix leakage/split |
| good | good | useful fit | compare to baseline and product metric |
| bad | good | suspicious | check metric, data, split, or bug |

**Concrete reads for each diagnosis row.**

- **Bad train, bad validation:** train AUC 0.55 and validation AUC 0.54 on pCTR means the model barely beats random in either place → underfitting.
- **Good train, bad validation:** train AUC 0.98 and validation AUC 0.64 means the model learned training-specific IDs/noise → overfitting or leakage/split trouble.
- **Good train, good validation:** train AUC 0.80 and validation AUC 0.78 means the fit is useful enough to compare against the baseline and product metric.
- **Bad train, good validation:** train AUC 0.52 and validation AUC 0.79 is not a miracle; check for a flipped metric, mislabeled split, leakage, or evaluation bug.

A learning curve shows performance as training data grows. If validation improves as more data arrives and the gap shrinks, data helps. If both train and validation remain bad, the feature set or model family is probably missing signal.

**Worked example — train AUC is not the win.** You train three pCTR models on the same campaign data:

| Model | Train AUC | Validation AUC | Read |
|---|---:|---:|---|
| tiny linear baseline | 0.61 | 0.60 | underfits, but honest |
| moderate GBDT | 0.79 | 0.75 | useful generalization |
| deep tree with many noisy IDs | 0.99 | 0.71 | overfits; 0.28 train↔val gap |

The third model can memorize rare campaign/member combinations and produce a beautiful training number. It is worse than the moderate model where it matters. If you add more data and the third model's validation AUC rises while train AUC falls, variance was the issue. If no model improves, the label framing, features, or task may need to change.

**You'll be able to say:** *"Overfitting = low train loss but a large train↔val gap (high variance); underfitting = high loss on both (high bias). The gap, not the train score, is the signal. Capacity and data size trade off along the bias–variance curve; a learning curve shows whether more data or more capacity is what's missing."*

---

## Resources
- Andrew Ng — Machine Learning (Coursera) — the classic first pass
- Google Machine Learning Crash Course — framing, splits, generalization with runnable exercises
- StatQuest — supervised learning playlist — short, visual explanations

## Papers
- (M1 has no dedicated SOTA papers in the guide; supervised-learning foundations. Optionally cite Practical Lessons from Predicting Clicks on Ads (He et al., 2014) as a supervised-in-ads example.)

