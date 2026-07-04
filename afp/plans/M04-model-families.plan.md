# Module Plan — M4 · Model families

| Field | Value |
|---|---|
| Domain | Domain 0 · ML Foundations |
| Skip if you can already… | say when you'd pick GBDT vs a neural net and why |
| Maps to (projects) | all |
| Primary structure(s) | S1 Model + Decision guide |
| Example type | 💻 Colab |
| Sub-lessons | 3 |
| Notebooks | 3 |

## Module hub (the "complete list")
Model families are different inductive biases: what patterns the learner finds easily, what it
ignores, and what it costs to train and serve. This module walks from linear/logistic baselines to
trees, ensembles, GBDT, and a first MLP, ending with a practical GBDT-vs-NN decision guide.

- M4.1 · From linear to trees
- M4.2 · Ensembles & GBDT
- M4.3 · Neural nets & choosing a family

## Questions this module answers (→ which sub-lesson teaches the answer)
- What can a linear/logistic model represent, and its limits? → M4.1
- How do trees split, and what do they capture that linear can't? → M4.1
- Bagging / random forests (variance reduction)? → M4.2
- How does gradient boosting (GBDT) work, and why does it dominate tabular? → M4.2
- Key GBDT knobs (trees, depth, lr) and failure modes? → M4.2
- What is an MLP and its inductive bias? → M4.3
- When GBDT vs neural net (tabular vs high-cardinality/sparse/sequence/image)? → M4.3
- Tradeoffs: interpretability, training cost, serving? → M4.3

_Every question maps to a sub-lesson (coverage confirmed below)._

## Concepts (ƒ = genuine, central formula)
- Linear regression / logistic regression **ƒ**; linear decision boundary; feature crosses for interactions
- Decision trees; splits; impurity / information gain **ƒ**; piecewise-constant decision regions
- Bagging; random forests; variance reduction by averaging
- Gradient boosting / GBDT additive model **ƒ**; residual/gradient fitting; shrinkage
- GBDT knobs: `n_trees`, depth, learning rate; overfit, underfit, leakage sensitivity, extrapolation limits
- MLP / neuron / layers / activation **ƒ**; representation learning; inductive bias
- Data-family fit: tabular vs high-cardinality/sparse vs sequence/image; interpretability, training cost, serving cost

## Sub-lessons

### M4.1 · From linear to trees  —  [S1 Model, 💻]
- **Makes answerable:** what linear/logistic models represent and where they fail; how trees split and what they capture that linear models cannot.
- **You'll be able to say:** "Linear/logistic models score an additive weighted sum, so they are strong baselines and easy to interpret but need engineered crosses for nonlinear interactions. Trees split feature space into regions, capturing thresholds and interactions automatically, though single trees are high-variance."
- **Concepts:** linear/logistic regression **ƒ**, decision boundary, feature crosses, trees, splits, impurity **ƒ**, interaction effects.
- **Key Idea focus:** formulation + when to use — linear models for simple/additive signals and interpretability; trees for thresholded, nonlinear tabular structure.
- **Worked-example shape:** 10 basics → 5 easy → 5 advanced: fit a line/logistic boundary, show XOR/threshold failure, then a shallow tree that handles the interaction.
- **Notebook:** Yes — compare logistic regression vs a decision tree on synthetic tabular click data with a threshold interaction; `assert` the tree improves on the interaction break case. Break case = XOR-style or spend-threshold interaction.
- **Real numbers to cite:** linear model misses "country=US and bid>5" interaction until crossed; depth-2 tree recovers it with two splits.

### M4.2 · Ensembles & GBDT  —  [S1 Model, 💻]
- **Makes answerable:** bagging/random forests as variance reduction; how GBDT works and why it dominates tabular; key GBDT knobs and failure modes.
- **You'll be able to say:** "Bagging trains many noisy trees on resampled data and averages them to reduce variance. Gradient boosting builds trees sequentially, each one fitting the current loss gradient/residual, so many shallow trees become a strong tabular model. More trees/depth increase capacity; lower learning rate shrinks each step; failure modes include overfitting, slow training, leakage-amplification, and weak extrapolation."
- **Concepts:** bagging, random forests, variance reduction, gradient boosting/GBDT **ƒ**, `n_trees`, depth, learning rate, shrinkage, failure modes.
- **Key Idea focus:** formulation + when to use — ensembles trade a single unstable tree for averaged or sequentially corrected trees; GBDT is a default for structured tabular data.
- **Worked-example shape:** 10 basics → 5 easy → 5 advanced: single tree variance, random-forest averaging, boosting residuals, then knob sweeps for depth/lr/trees.
- **Notebook:** Yes — train single tree, random forest, and GBDT on tabular data; sweep depth and learning rate; `assert` GBDT beats a single tree on validation but overfits at excessive depth/trees. Break case = high-cardinality ID leakage or too-deep boosted trees.
- **Real numbers to cite:** depth 1 underfits interactions; depth 8 with 500 trees can push train AUC near 1.00 while validation stalls; lowering lr from 0.3 to 0.05 needs more trees but smooths validation.

### M4.3 · Neural nets & choosing a family  —  [S1 Model + Decision guide, 💻]
- **Makes answerable:** what an MLP is and its inductive bias; when to pick GBDT vs neural net by data type; tradeoffs in interpretability, training cost, and serving.
- **You'll be able to say:** "An MLP stacks learned linear transforms and nonlinear activations, so it can learn representations but needs more data, tuning, and serving care. For medium tabular features, start with GBDT; for sparse IDs with embeddings, text/sequence/image, or shared learned representations, neural nets become more attractive. GBDT is usually more interpretable and cheaper to train; NNs can be more flexible but costlier."
- **Concepts:** MLP/neuron/layers **ƒ**, activations, embeddings, inductive bias per family, tabular vs sparse/sequence/image, interpretability/training/serving tradeoffs.
- **Key Idea focus:** formulation + when to use — neural networks learn features/representations; the decision depends on data modality and operational constraints.
- **Worked-example shape:** 10 basics → 5 easy → 5 advanced: one neuron as logistic regression, hidden layer with nonlinear boundary, embeddings for sparse IDs, then decision scenarios.
- **Notebook:** Yes — compare GBDT vs a small MLP on clean tabular data and a sparse-ID/embedding-flavored dataset; `assert` GBDT is competitive on tabular while NN improves when representation learning matters. Break case = tiny tabular dataset where MLP overfits.
- **Real numbers to cite:** 10k rows / 30 tabular columns → GBDT strong baseline; millions of sparse member/ad IDs or sequence/image inputs → NN/embedding architecture is usually favored.

## Coverage check
All 8 module questions map to a sub-lesson: linear/logistic limits + trees → M4.1; bagging/RF + GBDT mechanics/knobs/failures → M4.2; MLP + GBDT-vs-NN + cost/serving/interpretability tradeoffs → M4.3. No gaps.

## Decision guide (only if the module has a when-to-pick-X-vs-Y)
| Situation | Prefer GBDT | Prefer neural net |
|---|---|---|
| Medium structured/tabular features | Strong default; little preprocessing; handles nonlinear thresholds | Use if you need shared representations or have very large data |
| High-cardinality sparse IDs | Can work with careful encoding but may memorize/leak | Embeddings often fit naturally |
| Sequence, text, image, multimodal | Usually not the right inductive bias | Natural fit with deep architectures |
| Interpretability/debugging | Easier feature importance, splits, SHAP-style inspection | Harder; needs attribution tooling |
| Training/serving cost | Often cheaper CPU training/serving | Often more tuning, accelerators, latency planning |
| Extrapolation outside training range | Trees extrapolate poorly | NNs can extrapolate somewhat, but not guaranteed |

## Resources (from the guide)
- StatQuest — Gradient Boost (boosting from scratch, visually)
- XGBoost documentation (the production GBDT)
- d2l.ai (from linear models to MLPs)

## SOTA papers (from the guide)
- Wide & Deep Learning for Recommender Systems (Cheng et al., 2016)
- DeepFM (Guo et al., 2017)

## Notes / caveats
- Keep this as a model-family decision module, not a full deep-learning course. MLP is an intro and
  a bridge to later recommender / embedding / LLM modules.
- Use small CPU notebooks; do not require GPU. Keep examples ads-framed: pCTR tabular signals,
  campaign/member IDs, and serving-latency tradeoffs.
