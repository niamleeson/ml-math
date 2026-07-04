# Module Plan — M1 · Supervised learning

| Field | Value |
|---|---|
| Domain | Domain 0 · ML Foundations |
| Skip if you can already… | frame a problem as features→label, split train/val/test, reason about over/underfitting, pick classification vs regression |
| Maps to (projects) | all |
| Primary structure(s) | S5 Concept / Framework (with an S2 Method slice for the fit→judge loop) |
| Example type | 🧮/💻 |
| Sub-lessons | 3 |
| Notebooks | 2 |

## Module hub (the "complete list")
Almost every model the team ships is supervised: historical examples where the answer is known, and
a function that predicts it for new cases. This module frames a task as features→label, teaches the
split discipline that keeps offline numbers honest, and builds the intuition for over/underfitting.
Three sub-lessons; two carry a hands-on notebook.

- M1.1 · Framing a supervised problem
- M1.2 · The split discipline (train/val/test, honestly)
- M1.3 · Over/underfitting & the bias–variance tradeoff

## Questions this module answers (→ which sub-lesson teaches the answer)
- What are features vs a label, and what makes a task supervised? → M1.1
- Classification vs regression vs multiclass/multilabel — how do you tell? → M1.1
- How do you frame a real task ("will this ad be clicked?") as features→label with a clear prediction time? → M1.1
- Why split train/validation/test, and what is each split for? → M1.2
- Random vs stratified vs temporal vs grouped splits — when does each matter? → M1.2
- Why is the test set read only once (the generalization gap)? → M1.2
- What is a baseline and why must a model beat it? → M1.1
- What are overfitting and underfitting, and how do you read them from the train↔val gap? → M1.3
- What is the bias–variance tradeoff? → M1.3

_Every question maps to a sub-lesson (coverage confirmed below)._

## Concepts (ƒ = genuine, central formula)
- Features / feature vector / feature space; label; example
- Supervised vs unsupervised; classification vs regression; binary/multiclass/multilabel
- Model as a function f_θ; parameters
- Empirical risk = average loss **ƒ**; true risk; generalization gap **ƒ**
- Train / validation / test split; stratified, temporal, grouped splitting
- Overfitting vs underfitting; bias–variance tradeoff; model capacity
- Learning curves; baselines (majority/mean); IID assumption

## Sub-lessons

### M1.1 · Framing a supervised problem  —  [S5 Concept, 🧮]
- **Makes answerable:** features vs label; classification vs regression vs multiclass/multilabel; framing a real task with a clear prediction time; baselines.
- **You'll be able to say:** "Supervised = learn a function from labeled examples. The label's type sets the task: categorical → classification (binary/multiclass/multilabel by shape), continuous → regression. Frame a task by naming the label, the features knowable before it, and the prediction time; a model must beat the majority/mean baseline to be worth anything."
- **Concepts:** features/label, task types, f_θ, baseline, IID (prose; **no forced math**).
- **Key Idea focus:** vocabulary + structure — how to turn "will this ad be clicked?" into features→label and pick the task type.
- **Worked-example shape:** small illustrative cases — classify three tasks (click? / minutes-watched / topic) into task types + choose a baseline.
- **Notebook:** No (🧮). Pen-paper task-framing exercises in the lesson.
- **Real numbers:** majority-class baseline accuracy for a 6%-positive click task = 0.94 to beat.

### M1.2 · The split discipline (train/val/test, honestly)  —  [S5 Concept + S2 Method, 💻]
- **Makes answerable:** why split; what each split is for; random vs stratified vs temporal vs grouped; test read once.
- **You'll be able to say:** "Train fits, validation tunes, test is read once as an honest estimate of true risk. Stratify for rare events, split by time for time-ordered data, split by entity when members/campaigns repeat. Reusing test turns it into a second training set and inflates the number."
- **Concepts:** train/val/test, stratified/temporal/grouped splits, empirical vs true risk **ƒ**, generalization gap **ƒ**.
- **Key Idea focus:** fit on train, tune on val, read test once; pick the split that matches the data (rare events → stratify; time series → temporal; repeated entities → grouped).
- **Worked-example shape:** the fit→judge loop — fit a small model, read train vs val, choose the split that keeps positives balanced.
- **Notebook:** Yes — stratified split on a rare-positive synthetic click set; `assert` the train and val positive rates are close; show a random split can starve a fold. Break case = a random split with too few positives.
- **Real numbers:** 50,000 rows / 200 positives; random split can leave a fold with ~40 positives vs stratified ~60 per 1,000-row fold.

### M1.3 · Over/underfitting & the bias–variance tradeoff  —  [S5 Concept + S2 Method, 💻]
- **Makes answerable:** over/underfitting from the train↔val gap; bias–variance; capacity; learning curves.
- **You'll be able to say:** "Overfitting = low train loss but a large train↔val gap (high variance); underfitting = high loss on both (high bias). The gap, not the train score, is the signal. Capacity and data size trade off along the bias–variance curve; a learning curve shows whether more data or more capacity is what's missing."
- **Concepts:** overfitting/underfitting, bias–variance tradeoff, model capacity, learning curves.
- **Key Idea focus:** the gap (not the train score) is the signal; capacity and data size interact.
- **Worked-example shape:** grow capacity / shrink data and watch the train↔val gap widen; read a learning curve.
- **Notebook:** Yes — fit models of rising capacity on a fixed set; plot train vs val; `assert` the gap grows with capacity past a point. Break case = tiny data + many noise features (deliberate overfit).
- **Real numbers:** train AUC 0.99 vs val 0.71 (gap 0.28) flags overfitting; the gap shrinks with more data.

## Coverage check
All 9 module questions map to a sub-lesson: framing/task-type/baseline → M1.1; split discipline + generalization gap → M1.2; over/underfitting + bias–variance → M1.3. No gaps.

## Decision guide
Classification vs regression: categorical target → classification (binary/multiclass/multilabel by
label shape); continuous target → regression. Split choice: rare events → stratify; time-ordered →
temporal; repeated entities (member/campaign) → grouped.

## Resources (from the guide)
- Andrew Ng — Machine Learning (Coursera) — the classic first pass
- Google Machine Learning Crash Course — framing, splits, generalization with runnable exercises
- StatQuest — supervised learning playlist — short, visual explanations

## SOTA papers (from the guide)
- (M1 has no dedicated SOTA papers in the guide; supervised-learning foundations. Optionally cite
  Practical Lessons from Predicting Clicks on Ads (He et al., 2014) as a supervised-in-ads example.)

## Notes / caveats
- **Overlaps the concurrent `topics/` curriculum** (05-supervised-learning-intro, 15-model-selection-diagnostics).
  Reference it; keep M1 short and ads-framed rather than duplicating the general treatment.
- Keep M1.1 prose-only — no manufactured formulas. The only genuine ƒ is empirical/true risk in M1.2.
