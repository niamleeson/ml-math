# Lesson Plan — 14 ML Metrics: Classification & Regression

| Field | Value |
|---|---|
| Source | CS 229 |
| Content category | Metric |
| Example type | 🧮 Numeric |
| Colab notebook | No |
| Est. lesson time | 35–50 min |
| Source topic file | ../14-ml-metrics.md |

## Part 1 — Overview (plan)
Metrics translate predictions into decisions about model quality. Hook: the same classifier can look excellent by accuracy and dangerous by recall when classes are imbalanced.

## Part 2 — Key Idea (plan)
- **Focus (per category = Metric):** formula + how to read each metric, including which failure modes it reveals.
- **Core artifacts to present:** confusion matrix with TP/FP/FN/TN; accuracy $(TP+TN)/(TP+TN+FP+FN)$; precision $TP/(TP+FP)$; recall/sensitivity $TP/(TP+FN)$; specificity $TN/(TN+FP)$; F1 $2TP/(2TP+FP+FN)$; ROC as TPR vs FPR over thresholds; AUC; regression sums $SS_{tot}$, $SS_{reg}$, $SS_{res}$; $R^2=1-SS_{res}/SS_{tot}$; adjusted $R^2$, Mallows' Cp, AIC, and BIC formulas.

## Part 3 — Worked Examples

### 🟢 Easy (5)
| # | Title | Given | Derivation focus |
|---|---|---|---|
| E1 | Fill and read a binary confusion matrix | 100 examples: TP=30, FP=10, FN=5, TN=55 | compute accuracy, precision, recall, and specificity from the 2×2 counts |
| E2 | Compute F1 from precision and recall | precision $0.80$, recall $0.50$ | compute the harmonic mean and explain why F1 is closer to the smaller value |
| E3 | Imbalanced accuracy trap | 1,000 patients: 20 positive; classifier predicts all negative | derive the confusion matrix and compare accuracy, recall, and specificity |
| E4 | One ROC point from a threshold | scores/labels for 8 examples at threshold 0.6 | compute predicted labels, TP, FP, TPR, and FPR by hand |
| E5 | Compute $R^2$ for a small regression | $y=[2,4,6]$, $\hat y=[2,5,5]$ | compute $\bar y$, $SS_{tot}$, $SS_{res}$, and $R^2$ |

### 🔴 Advanced (5)
| # | Title | Given | Derivation focus |
|---|---|---|---|
| A1 | Sweep thresholds and approximate ROC-AUC | 6 scored examples with labels sorted by score | compute TPR/FPR at each threshold and approximate AUC with step/trapezoid areas |
| A2 | Precision-recall tradeoff under rare positives | 200 examples, 10 positives; two confusion matrices from two thresholds | decide the threshold using a recall constraint, then compare precision and F1 |
| A3 | Negative $R^2$ edge case | $y=[1,2,3,4]$, model predicts $[10,10,10,10]$ | show $SS_{res}>SS_{tot}$ and interpret worse-than-mean baseline performance |
| A4 | Adjusted $R^2$ penalizes extra variables | $m=30$, model A: $n=2,R^2=.70$; model B: $n=8,R^2=.76$ | compute adjusted $R^2$ for both models and choose the better one |
| A5 | Compare AIC/BIC for model selection | two regression models with $m=100$, $n$, and $\log L$ values | compute both penalties and explain why BIC punishes complexity more |

## Part 4 — Colab Notebook (omit if 🧮)
N/A — 🧮 numeric topic (no notebook).

## Part 5 — Practice Questions
- **🟢 Easy (5) — themes:** compute TP/FP/FN/TN from labels; calculate accuracy/precision/recall/specificity; compute F1; read one ROC point; compute $SS_{tot}$ and $R^2$.
- **🔴 Hard (5) — themes:** choose metrics for imbalanced screening; derive when F1 improves after threshold change; compute ROC-AUC from ranked scores; interpret negative $R^2$; compare adjusted $R^2$, AIC, and BIC for nested models.
