# M4 · Model families
> **Domain:** Domain 0 · ML Foundations · **Maps to:** all · **Skip if you can already…** say when you'd pick GBDT vs a neural net and why

## Overview

Model families are different bets about what patterns are easy to learn. A linear model bets that signals add up cleanly. A tree bets that thresholds and interactions matter. A boosted tree bets that many small corrections can build a strong tabular predictor. A neural network bets that useful representations can be learned from data.

This module is a decision module, not a full deep-learning course. The goal is to explain what each family naturally captures, where it fails, and why an ads pCTR or campaign-quality team might start with GBDT for tabular signals but choose a neural architecture for sparse IDs, text, sequences, or shared embeddings.

**By the end you can answer:**
- What can a linear or logistic model represent, and where does it fail?
- How do decision trees split, and what can they capture that linear models cannot?
- How do bagging and random forests reduce variance?
- How does gradient boosting work, and why is GBDT strong on tabular data?
- What knobs control GBDT capacity, and what are its failure modes?
- What is an MLP and what inductive bias does it bring?
- When would you pick GBDT vs a neural net?
- How do interpretability, training cost, and serving cost differ across families?

Three sub-lessons:

- **M4.1 From linear to trees** — additive baselines versus thresholded interactions.
- **M4.2 Ensembles & GBDT** — averaging noisy trees and boosting residual errors.
- **M4.3 Neural nets & choosing a family** — representation learning and the GBDT-vs-NN decision.

<p class="cur-colab"><a class="cur-colab-btn" href="https://colab.research.google.com/github/niamleeson/ml-math/blob/main/afp/notebooks/M04-model-families.ipynb" target="_blank" rel="noopener">▶ Open the runnable notebook (20 examples + visualizations) in Google Colab</a></p>

---

## M4.1 · From linear to trees

<p class="cur-colab"><a class="cur-colab-btn" href="https://colab.research.google.com/github/niamleeson/ml-math/blob/main/afp/notebooks/M04-model-families.ipynb" target="_blank" rel="noopener">▶ Open the runnable notebook (20 examples + visualizations) in Google Colab</a></p>

**The idea.** Linear regression and logistic regression score an additive weighted sum of features. Logistic regression turns that score into a probability for classification. The strength is clarity: each coefficient has a direction and magnitude, training is reliable, and serving is cheap. The limit is also clear: a purely additive model does not discover nonlinear thresholds or feature interactions unless you provide them.

A decision tree learns a sequence of splits: if bid is above a threshold, go right; otherwise left. Then maybe split by country, campaign age, or device. Each leaf predicts a value. Trees naturally capture thresholds and interactions because the meaning of a later split depends on earlier splits.

**Everyday analogy.** A linear model is like using one straight ruler to estimate lunch cost: add 8 dollars for a sandwich, 3 for a drink, 2 for tax, and every factor contributes separately. A tree is like a cashier's decision chart: "if it is after 2pm, use the happy-hour menu; if the customer is a student, apply another rule." The ruler maps to additive weights; the decision chart maps to threshold splits whose later rules depend on earlier ones.

All snippets below assume the notebook setup has created the shared ads table `df`, `train`, `valid`, `FEATS = ["is_US", "is_ios", "size_ord", "bid", "spend"]`, and the XOR split `X2tr/y2tr`, `X2va/y2va`.

**Linear regression — additive numeric effects (notebook #1).**

```python
from sklearn.linear_model import LinearRegression

lin = LinearRegression().fit(train[["bid", "spend"]], train["value"])
print("intercept:", round(lin.intercept_, 2),
      "| coef(bid, spend):", np.round(lin.coef_, 3))
```

→ output/result: `intercept: 5.42 | coef(bid, spend): [1.22  0.019]`; value rises additively with bid and spend.

**Logistic regression — additive probability baseline (notebook #2).**

```python
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import roc_auc_score

feats = ["bid", "spend", "is_US", "is_ios", "size_ord"]
lr = LogisticRegression(max_iter=1000).fit(train[feats], train.clicked)
auc = roc_auc_score(valid.clicked, lr.predict_proba(valid[feats])[:, 1])
print("val AUC:", round(auc, 3))
```

→ output/result: validation AUC `0.674`; a strong cheap baseline, but still additive.

**Linear needs crosses for interactions.** If clicks increase especially when `country=US` and `bid>5`, a linear model with only `country` and `bid` can learn a country effect and a bid effect, but not the special combination. Add a feature cross for `US_and_bid_gt_5`, and the linear model can represent it. A tree can learn the two-split rule directly.

**The interaction a line misses (notebook #3).**

```python
add = LogisticRegression(max_iter=1000).fit(train[["is_US", "bid"]], train.clicked)
auc_add = roc_auc_score(valid.clicked,
    add.predict_proba(valid[["is_US", "bid"]])[:, 1])
print("additive logistic val AUC:", round(auc_add, 3))
```

→ output/result: additive logistic AUC `0.635` (~0.64); it cannot isolate only the `US & bid > 5` corner.

**Add the cross explicitly (notebook #4).**

```python
for d in (train, valid):
    d["US_and_bid_gt_5"] = ((d.is_US == 1) & (d.bid > 5)).astype(int)

feats2 = ["is_US", "bid", "US_and_bid_gt_5"]
crossed = LogisticRegression(max_iter=1000).fit(train[feats2], train.clicked)
auc_cross = roc_auc_score(valid.clicked, crossed.predict_proba(valid[feats2])[:, 1])
print(f"additive AUC {auc_add:.3f} -> with cross {auc_cross:.3f}")
```

→ output/result: AUC moves `0.635 -> 0.670` (~0.64→0.67); the linear model needed the engineered cross.

**Worked example — the interaction a line misses.** Suppose four campaign situations have this pattern:

| Country | Bid | Click-prone? |
|---|---:|---|
| US | 3 | no |
| US | 7 | yes |
| IN | 3 | no |
| IN | 7 | no |

The signal is not "US" alone and not "bid high" alone. It is the interaction "US and bid > 5." A logistic model without a crossed feature struggles because the effects add separately. A depth-2 tree can split on `bid > 5`, then split the high-bid branch on `country == US`, putting the positive case in its own leaf.

**Decision tree learns the split pattern (notebook #5).**

```python
from sklearn.tree import DecisionTreeClassifier

tree = DecisionTreeClassifier(max_depth=3, random_state=0).fit(train[FEATS], train.clicked)
auc_tree = roc_auc_score(valid.clicked, tree.predict_proba(valid[FEATS])[:, 1])
print("tree val AUC:", round(auc_tree, 3))
```

→ output/result: validation AUC `0.709` (~0.71); the tree learns thresholded interactions from `FEATS`.

**Tree boxes vs one line on XOR (notebook #6).**

```python
fig, ax = plt.subplots(1, 2, figsize=(8, 4))
line = LogisticRegression().fit(X2tr, y2tr)
boxy = DecisionTreeClassifier(max_depth=4, random_state=0).fit(X2tr, y2tr)
plot_boundary(ax[0], line, "logistic (one line — fails XOR)")
plot_boundary(ax[1], boxy, "decision tree (boxes — solves it)")
```

→ output/result: logistic draws one separating line; the tree carves boxes that match XOR.

A single tree is easy to inspect but high-variance: small data changes can change the split order. That is why production tabular systems often use tree ensembles rather than one tree.

**Single-tree variance from bootstrap resamples (notebook #7).**

```python
fig, ax = plt.subplots(1, 2, figsize=(8, 4))
for a, seed in zip(ax, [1, 2]):
    idx = np.random.default_rng(seed).integers(0, len(X2tr), len(X2tr))
    t = DecisionTreeClassifier(max_depth=6, random_state=0).fit(X2tr[idx], y2tr[idx])
    plot_boundary(a, t, f"deep tree on bootstrap #{seed}")
```

→ output/result: same model family, different resample → visibly different boundary; high variance motivates ensembles.

**You'll be able to say:** *"Linear/logistic models score an additive weighted sum, so they are strong baselines and easy to interpret but need engineered crosses for nonlinear interactions. Trees split feature space into regions, capturing thresholds and interactions automatically, though single trees are high-variance."*

---

## M4.2 · Ensembles & GBDT

**The idea.** Ensembles combine many weak or unstable models. **Bagging** trains many trees on resampled versions of the data and averages them. A random forest adds random feature selection at each split so the trees make different errors. Averaging reduces variance: one tree may be noisy, but many differently noisy trees are more stable.

**Everyday analogy.** Think of proofreading a campaign brief with a room of junior editors. Bagging is asking many editors to review slightly different copies, then averaging their calls so one person's odd mistake does not dominate. Gradient boosting is a sequence of focused editing passes: the first editor fixes obvious errors, the next looks mainly at what remains wrong, and each small correction is added to the final draft.

**Bagging / random forest averages noisy trees (notebook #8).**

```python
from sklearn.ensemble import RandomForestClassifier

rf = RandomForestClassifier(n_estimators=300, random_state=0).fit(X2tr, y2tr)
one = DecisionTreeClassifier(max_depth=6, random_state=0).fit(X2tr, y2tr)
print("single tree:", round(roc_auc_score(y2va, one.predict_proba(X2va)[:, 1]), 3),
      "| random forest:", round(roc_auc_score(y2va, rf.predict_proba(X2va)[:, 1]), 3))
```

→ output/result: XOR AUC `0.922 | 0.950`; averaging many trees smooths variance.

**Gradient boosting** builds trees sequentially. Start with a simple prediction. Fit the next small tree to the current errors or loss gradients. Add it with a shrinkage factor. Repeat. The model is additive:

$$F_M(x)=\sum_{m=1}^{M}\eta f_m(x),$$

where each $f_m$ is a tree and $\eta$ is the learning rate.

GBDT dominates many tabular problems because shallow trees capture thresholds and interactions, boosting corrects mistakes step by step, and the model handles mixed numeric/categorical engineered features well with less preprocessing than neural nets.

**Gradient boosting on the shared ads table (notebook #9).**

```python
from sklearn.ensemble import GradientBoostingClassifier

gb = GradientBoostingClassifier(n_estimators=200, max_depth=3,
                                learning_rate=0.1, random_state=0)
gb.fit(train[FEATS], train.clicked)
staged = [roc_auc_score(valid.clicked, p[:, 1])
          for p in gb.staged_predict_proba(valid[FEATS])]
print("final GBDT val AUC:", round(staged[-1], 3))
```

→ output/result: final GBDT validation AUC `0.740`; successive trees improve the tabular predictor.

**Key knobs and failure modes:**

| Knob | Effect | Too low | Too high |
|---|---|---|---|
| `n_trees` | number of boosting steps | underfits | overfits / slow |
| depth | interaction complexity per tree | misses interactions | memorizes slices |
| learning rate | size of each correction | needs many trees | unstable / overfits faster |
| subsampling | randomness and robustness | may underuse data | less regularization |

GBDT failure modes include leakage amplification, overfitting rare IDs, slow training at large sweeps, and poor extrapolation outside the feature ranges it saw. A tree leaf cannot naturally predict a trend beyond the max training bid; it predicts from learned regions.

**Worked example — why knobs matter.** On a tabular pCTR dataset:

- A depth-1 model sees only one split per tree and underfits country×bid or creative×device interactions.
- A depth-3 model with a moderate number of trees can capture useful interactions and improve validation.
- A depth-8 model with 500 trees can push train AUC near 1.00 while validation stalls or drops.
- Lowering learning rate from 0.3 to 0.05 makes each correction smaller; it usually needs more trees but gives smoother validation curves.

```python
rows = []
for depth in [1, 2, 3, 5, 8]:
    m = GradientBoostingClassifier(n_estimators=200, max_depth=depth,
                                   learning_rate=0.1, random_state=0)
    m.fit(train[FEATS], train.clicked)
    rows.append((depth,
        roc_auc_score(train.clicked, m.predict_proba(train[FEATS])[:, 1]),
        roc_auc_score(valid.clicked, m.predict_proba(valid[FEATS])[:, 1])))
print(pd.DataFrame(rows, columns=["depth", "train_AUC", "val_AUC"]).round(3))
```

→ output/result (notebook #11): depth sweep shows `val_AUC` peaks near depth 2 (`0.744`) while train AUC keeps rising to `1.000` by depth 8. If validation stops improving while train keeps improving, capacity is no longer helping. Stop, regularize, reduce depth, or fix leakage/splits.

**Learning rate ↔ number of trees (notebook #12).**

```python
for lr in [0.3, 0.1, 0.03]:
    m = GradientBoostingClassifier(n_estimators=300, max_depth=3,
                                   learning_rate=lr, random_state=0)
    m.fit(train[FEATS], train.clicked)
    staged = [roc_auc_score(valid.clicked, p[:, 1])
              for p in m.staged_predict_proba(valid[FEATS])]
    print(lr, round(max(staged), 3), "best tree", np.argmax(staged) + 1)
```

→ output/result: smaller learning rates need more trees and usually give smoother validation curves.

**Single tree vs RF vs GBDT bake-off (notebook #13).**

```python
res = {
  "single tree": DecisionTreeClassifier(random_state=0),
  "random forest": RandomForestClassifier(n_estimators=300, random_state=0),
  "GBDT": GradientBoostingClassifier(n_estimators=200, max_depth=3, random_state=0),
}
aucs = {k: roc_auc_score(valid.clicked, v.fit(train[FEATS], train.clicked)
                         .predict_proba(valid[FEATS])[:, 1])
        for k, v in res.items()}
print({k: round(v, 3) for k, v in aucs.items()})
```

→ output/result: `{'single tree': 0.599, 'random forest': 0.702, 'GBDT': 0.74}`; ensembles win, and boosted trees win here.

**Feature importance for debugging (notebook #14).**

```python
feats = FEATS + ["US_and_bid_gt_5"]
gb = GradientBoostingClassifier(n_estimators=200, max_depth=3, random_state=0)
gb.fit(train[feats], train.clicked)
print(pd.Series(gb.feature_importances_, index=feats).sort_values().round(3))
```

→ output/result: `US_and_bid_gt_5` and `spend` rank highest; importance is a starting point for inspection, not causal proof.

**Trees do not extrapolate trends (notebook #15).**

```python
from sklearn.tree import DecisionTreeRegressor
from sklearn.ensemble import GradientBoostingRegressor

xr = np.sort(np.random.default_rng(1).uniform(0, 5, 120))
yr = 2 + 1.5 * xr + np.random.default_rng(2).normal(0, 1, 120)
lin = LinearRegression().fit(xr[:, None], yr)
tre = DecisionTreeRegressor(max_depth=4, random_state=0).fit(xr[:, None], yr)
gbr = GradientBoostingRegressor(n_estimators=200, max_depth=3, random_state=0).fit(xr[:, None], yr)
print("x=8 predictions:", round(lin.predict([[8]])[0], 2),
      round(tre.predict([[8]])[0], 2), round(gbr.predict([[8]])[0], 2))
```

→ output/result: beyond the training range (`x > 5`), tree and GBDT predictions flatten while linear regression keeps trending.

**You'll be able to say:** *"Bagging trains many noisy trees on resampled data and averages them to reduce variance. Gradient boosting builds trees sequentially, each one fitting the current loss gradient/residual, so many shallow trees become a strong tabular model. More trees/depth increase capacity; lower learning rate shrinks each step; failure modes include overfitting, slow training, leakage-amplification, and weak extrapolation."*

---

## M4.3 · Neural nets & choosing a family

**The idea.** A multilayer perceptron stacks learned linear transforms and nonlinear activations. One neuron looks like a learned weighted score passed through an activation; hidden layers compose many such units so the model can learn representations instead of relying only on hand-built feature crosses.

Neural nets are powerful when the input has structure that benefits from learned representations: sparse member/ad IDs with embeddings, text, image, sequence behavior, or a model shared across related tasks. They also need more data, tuning, monitoring, and serving discipline than a simple linear model or many GBDT setups.

**Everyday analogy.** Recognizing a song is easier if you build it up in layers: first hear beats, then riffs, then the chorus, then the full song identity. A neural net similarly learns low-level patterns in early layers and combines them into higher-level representations in later layers. For a tidy spreadsheet of lunch orders, a rule-based checklist may be enough; for raw audio, text, images, or huge sparse IDs, learned layers can discover structure you did not hand-code.

**MLP learns a smooth XOR boundary (notebook #10).**

```python
from sklearn.neural_network import MLPClassifier

mlp = MLPClassifier(hidden_layer_sizes=(16, 16), max_iter=800, random_state=0)
mlp.fit(X2tr, y2tr)
print("XOR val AUC — MLP:", round(roc_auc_score(y2va, mlp.predict_proba(X2va)[:, 1]), 3))
```

→ output/result: XOR validation AUC `0.950`; nonlinear layers learn a smooth boundary without hand-coded boxes.

**Entity embeddings compress sparse IDs (notebook #16).**

```python
from sklearn.decomposition import TruncatedSVD
from sklearn.preprocessing import OneHotEncoder

ctx = OneHotEncoder(sparse_output=False).fit_transform(df[["country", "device", "creative_size"]])
codes, uniq = pd.factorize(df.campaign_id)
agg = np.zeros((len(uniq), ctx.shape[1])); np.add.at(agg, codes, ctx)
emb = TruncatedSVD(n_components=2, random_state=0).fit_transform(agg)
print("one-hot columns:", ctx.shape[1] + len(uniq), "-> dense embedding dims:", emb.shape[1])
```

→ output/result: `314 -> 2`; this SVD stand-in shows why neural `Embedding` layers are natural for high-cardinality IDs.

**Decision guide.**

| Situation | Prefer GBDT | Prefer neural net |
|---|---|---|
| Medium structured/tabular features | Strong default; little preprocessing; handles nonlinear thresholds | Use if you need shared representations or have very large data |
| High-cardinality sparse IDs | Can work with careful encoding but may memorize/leak | Embeddings often fit naturally |
| Sequence, text, image, multimodal | Usually not the right inductive bias | Natural fit with deep architectures |
| Interpretability/debugging | Easier feature importance, splits, SHAP-style inspection | Harder; needs attribution tooling |
| Training/serving cost | Often cheaper CPU training/serving | Often more tuning, accelerators, latency planning |
| Extrapolation outside training range | Trees extrapolate poorly | NNs can extrapolate somewhat, but not guaranteed |

**Shared pCTR task — pick each family when it fits.**

- **Linear/logistic:** choose it for a 50k-row pCTR baseline with 20 clean features when you need calibrated probabilities, cheap serving, and coefficients you can inspect; add a `US_and_bid_gt_5` cross if that interaction matters.
- **GBDT:** choose it for the same task after you have 1M tabular rows with bid thresholds, country×device effects, and campaign-age interactions; shallow boosted trees can learn those splits with little preprocessing.
- **Neural net:** choose it when the task grows to hundreds of millions of impressions with sparse member IDs, advertiser IDs, creative text, and sequence history; embeddings and encoders can share signal across related IDs and content.

**Family bake-off: accuracy and cost (notebook #17).**

```python
from sklearn.preprocessing import StandardScaler

Xtr, Xva = train[FEATS].to_numpy(), valid[FEATS].to_numpy()
sc = StandardScaler().fit(Xtr); Xtr_z, Xva_z = sc.transform(Xtr), sc.transform(Xva)
models = {
  "logistic": (LogisticRegression(max_iter=1000), Xtr_z, Xva_z),
  "randomforest": (RandomForestClassifier(n_estimators=300, random_state=0), Xtr, Xva),
  "GBDT": (GradientBoostingClassifier(n_estimators=200, max_depth=3, random_state=0), Xtr, Xva),
  "MLP": (MLPClassifier(hidden_layer_sizes=(32, 16), max_iter=600, random_state=0), Xtr_z, Xva_z),
}
for name, (m, a, b) in models.items():
    m.fit(a, train.clicked)
    print(name, round(roc_auc_score(valid.clicked, m.predict_proba(b)[:, 1]), 3))
```

→ output/result: logistic `0.674`, RF `0.702`, GBDT `0.740`, MLP `0.738`; GBDT and MLP are close, with different cost/ops tradeoffs.

**Big MLP on tiny data overfits (notebook #18).**

```python
tiny = train.sample(60, random_state=0)
sc = StandardScaler().fit(tiny[FEATS])
Xt, Xv = sc.transform(tiny[FEATS]), sc.transform(valid[FEATS])
big = MLPClassifier(hidden_layer_sizes=(128, 128, 64), max_iter=1500, random_state=0).fit(Xt, tiny.clicked)
small = LogisticRegression(max_iter=1000).fit(Xt, tiny.clicked)
print("big MLP val", round(roc_auc_score(valid.clicked, big.predict_proba(Xv)[:, 1]), 3),
      "| logistic val", round(roc_auc_score(valid.clicked, small.predict_proba(Xv)[:, 1]), 3))
```

→ output/result: big MLP validation AUC `0.520` vs logistic `0.619`; high capacity can memorize 60 rows.

**Calibration differs by family (notebook #19).**

```python
from sklearn.calibration import calibration_curve

fitted = {
  "logistic": LogisticRegression(max_iter=1000).fit(train[FEATS], train.clicked),
  "randomforest": RandomForestClassifier(n_estimators=300, random_state=0).fit(train[FEATS], train.clicked),
  "GBDT": GradientBoostingClassifier(n_estimators=200, max_depth=3, random_state=0).fit(train[FEATS], train.clicked),
}
for name, m in fitted.items():
    frac, mean = calibration_curve(valid.clicked, m.predict_proba(valid[FEATS])[:, 1], n_bins=10)
    print(name, "first bin", round(mean[0], 3), "->", round(frac[0], 3))
```

→ output/result: reliability curves are family-specific; check calibration before treating scores as probabilities.

**Decision-boundary gallery (notebook #20).**

```python
gallery = {
  "logistic": LogisticRegression().fit(X2tr, y2tr),
  "decision tree": DecisionTreeClassifier(max_depth=5, random_state=0).fit(X2tr, y2tr),
  "random forest": RandomForestClassifier(n_estimators=300, random_state=0).fit(X2tr, y2tr),
  "GBDT": GradientBoostingClassifier(n_estimators=200, max_depth=3, random_state=0).fit(X2tr, y2tr),
  "MLP": MLPClassifier(hidden_layer_sizes=(16, 16), max_iter=800, random_state=0).fit(X2tr, y2tr),
}
for name, m in gallery.items():
    print(name, round(roc_auc_score(y2va, m.predict_proba(X2va)[:, 1]), 2))
```

→ output/result: one dataset, five inductive biases — lines, boxes, averaged boxes, boosted boxes, and smooth neural boundaries.

**Worked example — two ads modeling choices.** Scenario A: 10k rows, 30 clean tabular columns, a few countries and campaign attributes. Start with logistic regression and GBDT. The GBDT is likely strong, cheap, and easier to debug.

Scenario B: hundreds of millions of impressions with sparse member IDs, advertiser IDs, creative text, and sequence history. A neural model with embeddings and text/sequence encoders can share statistical strength across IDs and learn representations that a tabular GBDT would need awkward encodings to approximate.

A bad use case is a tiny tabular dataset with a large MLP. It may fit train perfectly and fail validation because the representation learner has more flexibility than the data can support.

**You'll be able to say:** *"An MLP stacks learned linear transforms and nonlinear activations, so it can learn representations but needs more data, tuning, and serving care. For medium tabular features, start with GBDT; for sparse IDs with embeddings, text/sequence/image, or shared learned representations, neural nets become more attractive. GBDT is usually more interpretable and cheaper to train; NNs can be more flexible but costlier."*

---

## Resources
- StatQuest — Gradient Boost (boosting from scratch, visually)
- XGBoost documentation (the production GBDT)
- d2l.ai (from linear models to MLPs)

## Papers
- Wide & Deep Learning for Recommender Systems (Cheng et al., 2016)
- DeepFM (Guo et al., 2017)

