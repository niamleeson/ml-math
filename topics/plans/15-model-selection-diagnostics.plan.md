# Lesson Plan — 15 Model Selection & Diagnostics

| Field | Value |
|---|---|
| Source | CS 229 |
| Content category | Concept/Tips |
| Example type | ⚖️ Both |
| Colab notebook | Yes |
| Est. lesson time | 45–60 min |
| Source topic file | ../15-model-selection-diagnostics.md |

## Part 1 — Overview (plan)
Model selection is how we choose a model without fooling ourselves; diagnostics explain what to fix next. Hook: train error alone cannot tell whether to add features, regularize, collect data, or stop.

## Part 2 — Key Idea (plan)
- **Focus (per category = Concept/Tips):** vocabulary and workflow structure, plus diagnostic rules that map symptoms to remedies.
- **Core artifacts to present:** train/validation/test split; $k$-fold and leave-$p$-out cross-validation; cross-validation error average; regularization penalties LASSO $\lambda\|\theta\|_1$, Ridge $\lambda\|\theta\|_2^2$, Elastic Net $\lambda[(1-\alpha)\|\theta\|_1+\alpha\|\theta\|_2^2]$; bias/variance symptoms table; learning curves; error analysis and ablative analysis checklists.

## Part 3 — Worked Examples

### 🟢 Easy (5)
| # | Title | Data source | Visualization(s) | Build steps |
|---|---|---|---|---|
| E1 | Hand-split a dataset into train/validation/test | Pen-and-paper: 20 indexed examples | colored split bar matching source diagram | ~3 |
| E2 | Compute 5-fold CV error by hand | Pen-and-paper: fold errors $0.22,0.18,0.20,0.24,0.16$ | fold table with held-out block moving | ~3 |
| E3 | Polynomial degree selection | synthetic noisy quadratic | train/validation error vs degree; fitted curves for degree 1/2/12 | ~5 |
| E4 | Ridge vs LASSO coefficient shrinkage | `diabetes` or synthetic correlated features | coefficient paths vs $\lambda$; validation score curve | ~5 |
| E5 | Learning curve diagnosis | synthetic regression with adjustable sample size | training/validation error vs number of examples | ~5 |

### 🔴 Advanced (5)
| # | Title | Data source | Visualization(s) | Build steps |
|---|---|---|---|---|
| A1 | Bias vs variance: choose the right remedy | `moons` classification with underfit/logistic, good/RBF, overfit/tree | decision boundaries; train/test gap table | ~6 |
| A2 | Data leakage failure in cross-validation | synthetic scaled classification with preprocessing inside vs outside CV | optimistic vs honest CV bar chart; pipeline diagram | ~7 |
| A3 | Nested CV for hyperparameter selection | `breast_cancer` or `wine` | inner/outer fold schematic; score distribution | ~7 |
| A4 | Error analysis on misclassified examples | `digits` subset | confusion matrix; grid of common confusions; error-category counts | ~7 |
| A5 | Ablative analysis of a feature pipeline | `california_housing` subset or synthetic feature blocks | ablation bar chart; validation/test score table | ~8 |

## Part 4 — Colab Notebook
- **Notebook file:** notebooks/15-model-selection-diagnostics.ipynb
- **Est. cell count:** ~78 (⚖️ topic → E1–E2 pen-and-paper style in lesson; coded model-selection and diagnostic examples in notebook)
- **Key libraries:** numpy, pandas, matplotlib, scikit-learn (`train_test_split`, `KFold`, `cross_val_score`, `Pipeline`, `PolynomialFeatures`, `Ridge`, `Lasso`, `LogisticRegression`, `DecisionTreeClassifier`, `SVC`, `confusion_matrix`)
- **Runtime:** CPU
- **Failure/edge dataset included:** leakage demo in A2 — shows validation scores inflated when preprocessing uses held-out fold information.
- **Signature visualizations:** moving-fold CV schematic; train/validation learning curves; bias-variance decision boundaries; coefficient paths; confusion matrix with error-analysis grid.

## Part 5 — Practice Questions
- **🟢 Easy (5) — themes:** define train/validation/test roles; average CV errors; identify underfit vs overfit from train/test errors; match LASSO/Ridge/Elastic Net to use cases; read a learning curve.
- **🔴 Hard (5) — themes:** design leakage-free CV pipelines; choose remedies from bias/variance symptoms; compare hold-out, k-fold, and LOOCV costs; justify nested CV for hyperparameter search; plan an error-analysis and ablation study.
