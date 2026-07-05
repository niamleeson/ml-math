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

---

## M4.1 · From linear to trees

**The idea.** Linear regression and logistic regression score an additive weighted sum of features. Logistic regression turns that score into a probability for classification. The strength is clarity: each coefficient has a direction and magnitude, training is reliable, and serving is cheap. The limit is also clear: a purely additive model does not discover nonlinear thresholds or feature interactions unless you provide them.

A decision tree learns a sequence of splits: if bid is above a threshold, go right; otherwise left. Then maybe split by country, campaign age, or device. Each leaf predicts a value. Trees naturally capture thresholds and interactions because the meaning of a later split depends on earlier splits.

**Everyday analogy.** A linear model is like using one straight ruler to estimate lunch cost: add 8 dollars for a sandwich, 3 for a drink, 2 for tax, and every factor contributes separately. A tree is like a cashier's decision chart: "if it is after 2pm, use the happy-hour menu; if the customer is a student, apply another rule." The ruler maps to additive weights; the decision chart maps to threshold splits whose later rules depend on earlier ones.

**Linear needs crosses for interactions.** If clicks increase especially when `country=US` and `bid>5`, a linear model with only `country` and `bid` can learn a country effect and a bid effect, but not the special combination. Add a feature cross for `US_and_bid_gt_5`, and the linear model can represent it. A tree can learn the two-split rule directly.

**Worked example — the interaction a line misses.** Suppose four campaign situations have this pattern:

| Country | Bid | Click-prone? |
|---|---:|---|
| US | 3 | no |
| US | 7 | yes |
| IN | 3 | no |
| IN | 7 | no |

The signal is not "US" alone and not "bid high" alone. It is the interaction "US and bid > 5." A logistic model without a crossed feature struggles because the effects add separately. A depth-2 tree can split on `bid > 5`, then split the high-bid branch on `country == US`, putting the positive case in its own leaf.

A single tree is easy to inspect but high-variance: small data changes can change the split order. That is why production tabular systems often use tree ensembles rather than one tree.

**You'll be able to say:** *"Linear/logistic models score an additive weighted sum, so they are strong baselines and easy to interpret but need engineered crosses for nonlinear interactions. Trees split feature space into regions, capturing thresholds and interactions automatically, though single trees are high-variance."*

---

## M4.2 · Ensembles & GBDT

**The idea.** Ensembles combine many weak or unstable models. **Bagging** trains many trees on resampled versions of the data and averages them. A random forest adds random feature selection at each split so the trees make different errors. Averaging reduces variance: one tree may be noisy, but many differently noisy trees are more stable.

**Everyday analogy.** Think of proofreading a campaign brief with a room of junior editors. Bagging is asking many editors to review slightly different copies, then averaging their calls so one person's odd mistake does not dominate. Gradient boosting is a sequence of focused editing passes: the first editor fixes obvious errors, the next looks mainly at what remains wrong, and each small correction is added to the final draft.

**Gradient boosting** builds trees sequentially. Start with a simple prediction. Fit the next small tree to the current errors or loss gradients. Add it with a shrinkage factor. Repeat. The model is additive:

$$F_M(x)=\sum_{m=1}^{M}\eta f_m(x),$$

where each $f_m$ is a tree and $\eta$ is the learning rate.

GBDT dominates many tabular problems because shallow trees capture thresholds and interactions, boosting corrects mistakes step by step, and the model handles mixed numeric/categorical engineered features well with less preprocessing than neural nets.

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
for depth in [1, 3, 8]:
    model = fit_gbdt(max_depth=depth, n_trees=500, learning_rate=0.05)
    print(depth, auc(train, model), auc(val, model))
```

If validation stops improving while train keeps improving, capacity is no longer helping. Stop, regularize, reduce depth, or fix leakage/splits.

**You'll be able to say:** *"Bagging trains many noisy trees on resampled data and averages them to reduce variance. Gradient boosting builds trees sequentially, each one fitting the current loss gradient/residual, so many shallow trees become a strong tabular model. More trees/depth increase capacity; lower learning rate shrinks each step; failure modes include overfitting, slow training, leakage-amplification, and weak extrapolation."*

---

## M4.3 · Neural nets & choosing a family

**The idea.** A multilayer perceptron stacks learned linear transforms and nonlinear activations. One neuron looks like a learned weighted score passed through an activation; hidden layers compose many such units so the model can learn representations instead of relying only on hand-built feature crosses.

Neural nets are powerful when the input has structure that benefits from learned representations: sparse member/ad IDs with embeddings, text, image, sequence behavior, or a model shared across related tasks. They also need more data, tuning, monitoring, and serving discipline than a simple linear model or many GBDT setups.

**Everyday analogy.** Recognizing a song is easier if you build it up in layers: first hear beats, then riffs, then the chorus, then the full song identity. A neural net similarly learns low-level patterns in early layers and combines them into higher-level representations in later layers. For a tidy spreadsheet of lunch orders, a rule-based checklist may be enough; for raw audio, text, images, or huge sparse IDs, learned layers can discover structure you did not hand-code.

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

