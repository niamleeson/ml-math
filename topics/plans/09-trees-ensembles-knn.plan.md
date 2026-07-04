# Lesson Plan — 09 Trees, Ensembles & Non-parametric Methods

| Field | Value |
|---|---|
| Source | CS 229 |
| Content category | Model |
| Example type | 💻 Colab |
| Colab notebook | Yes |
| Est. lesson time | 55–70 min |
| Source topic file | ../09-trees-ensembles-knn.md |

## Part 1 — Overview (plan)
Trees, ensembles, and k-nearest neighbors are flexible non-parametric models that adapt their decision boundaries to data rather than imposing one global linear form. Hook: a model can be interpretable but high variance (single tree), smoother by voting (forest/boosting), or purely local (k-NN).

## Part 2 — Key Idea (plan)
- **Focus (per category = Model):** formulation + when to use CART, random forests, boosting, and k-nearest neighbors for classification/regression.
- **Core artifacts to present:** CART binary split rule; impurity criteria (Gini $1-\sum_k p_k^2$, entropy $-\sum_k p_k\log p_k$, squared-error reduction for regression); recursive tree growth/pruning intuition; random forest = bootstrap samples + random feature subsets + voting/averaging; boosting = sequential weak learners fit to errors or reweighted mistakes; k-NN prediction by majority vote/neighbor average and bias-variance effect of $k$.

## Part 3 — Worked Examples

### 🟢 Basics (10)
| # | Title | Data source | Visualization(s) | Build steps |
|---|---|---|---|---|
| B1 | Compute Gini impurity for one labeled node | toy class counts | printed values; tiny class-count bar | ~2 |
| B2 | Measure distances from one query to candidate neighbors | tiny 2-D toy points | scatter with query-to-point distance segments | ~3 |
| B3 | Majority vote from a short neighbor-label list | toy label list | printed values; vote-count bar | ~2 |
| B4 | Compute entropy for one label set | toy label set | printed values; class-count bar | ~2 |
| B5 | Information gain from one candidate split | toy parent/child class counts | printed values | ~2 |
| B6 | Count the majority class in one node | toy node labels | printed values; vote-count bar | ~2 |
| B7 | Sort candidate neighbors by distance | toy distance list | printed nearest-order table; sorted distance bars | ~2 |
| B8 | Select k-nearest labels for one query | toy neighbor distances and labels | printed values | ~2 |
| B9 | Weighted Gini of two child nodes | toy child class counts | printed values | ~2 |
| B10 | Make one stump threshold decision | toy feature value and threshold | printed rule; one-dimensional threshold plot | ~2 |

### 🟡 Easy (5)
| # | Title | Data source | Visualization(s) | Build steps |
|---|---|---|---|---|
| E1 | CART first split by Gini impurity | Tiny 2-D toy classification table generated in notebook | process: candidate split impurity bars; result: first split drawn on scatter | ~6 |
| E2 | Decision tree decision regions by depth | `make_blobs` or `make_moons` | process: boundary blockier as depth increases; result: depth panel grid | ~5 |
| E3 | k-NN with k sweeping | Two-class synthetic data | process: highlighted nearest neighbors for a query; result: decision regions for $k=1,3,11$ | ~5 |
| E4 | Random forest voting on noisy data | `make_classification` with redundant/noisy features | process: individual tree boundaries; result: forest average boundary + vote confidence | ~6 |
| E5 | Feature importance in a forest | Iris or breast-cancer dataset | feature-importance bars; confusion matrix | ~4 |

### 🔴 Advanced (5)
| # | Title | Data source | Visualization(s) | Build steps |
|---|---|---|---|---|
| A1 | Deep tree overfitting failure case | Noisy `make_moons` | train/test accuracy vs depth; boundary too jagged at high depth | ~7 |
| A2 | Bagging reduces variance | Synthetic data with repeated bootstrap samples | process: bootstrap sample overlays; result: variance of single-tree vs bagged predictions | ~7 |
| A3 | AdaBoost reweights mistakes | `make_gaussian_quantiles` or noisy blobs | process: sample weights growing on errors; result: additive boundary over rounds | ~8 |
| A4 | Gradient boosting fits residuals | 1-D nonlinear regression data | process: residual plots per stage; result: boosted curve approaching target | ~8 |
| A5 | k-NN scaling and irrelevant-feature edge case | Same 2-D signal plus many noise features | distance concentration plot; accuracy before/after scaling/feature selection | ~7 |

## Part 4 — Colab Notebook
- **Notebook file:** topics/notebooks/09-trees-ensembles-knn.ipynb
- **Est. cell count:** ~92 (💻 topic → all 13 examples (3 basics + 5 easy + 5 advanced) coded with granular build↔see loops)
- **Key libraries:** numpy, pandas, matplotlib, scikit-learn (`DecisionTreeClassifier`, `RandomForestClassifier`, `AdaBoostClassifier`, `GradientBoostingRegressor`, `KNeighborsClassifier`, `make_moons`, `make_classification`, `make_gaussian_quantiles`), ipywidgets
- **Runtime:** CPU
- **Failure/edge dataset included:** noisy `make_moons` in A1 shows deep decision-tree overfitting; high-dimensional noise in A5 shows k-NN distance degradation.
- **Signature visualizations:** decision regions that become blockier with depth; k-NN neighbor/highlight and k-sweep boundaries; feature-importance bars plus boosting residual/weight evolution.
