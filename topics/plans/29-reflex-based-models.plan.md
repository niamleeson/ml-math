# Lesson Plan — 29 Reflex-based Models: Predictors & Loss

| Field | Value |
|---|---|
| Source | CS 221 |
| Content category | Model/Concept |
| Example type | ⚖️ Both |
| Colab notebook | Yes |
| Est. lesson time | 45–60 min |
| Source topic file | ../29-reflex-based-models.md |

## Part 1 — Overview (plan)
Reflex-based models turn inputs into feature vectors, score them with weights, and improve by minimizing loss. Hook: one score $w\cdot\phi(x)$ can become a classifier, a regressor, a margin, or a training signal depending on the loss.

## Part 2 — Key Idea (plan)
- **Focus (per category = Model/Concept):** vocabulary and structure for feature maps, scores, linear classification/regression, margins/residuals, losses, train loss, and non-linear alternatives such as k-NN and neural-network layers.
- **Core artifacts to present:** feature vector $\phi(x)\in\mathbb{R}^d$; score $s(x,w)=w\cdot\phi(x)$; classifier $f_w(x)=\operatorname{sign}(s(x,w))$; margin $m=y\,s(x,w)$; regression prediction $f_w(x)=s(x,w)$; residual $f_w(x)-y$; zero-one, hinge $\max(1-m,0)$, logistic $\log(1+e^{-m})$, squared residual, absolute residual losses; train loss average $|D|^{-1}\sum Loss(x,y,w)$; k-NN bias/variance effect of $k$; neural-network preactivation $z_j^{(i)}=w_j^{(i)T}x+b_j^{(i)}$.

## Part 3 — Worked Examples

### 🟢 Easy (5)
| # | Title | Data source | Visualization(s) | Build steps |
|---|---|---|---|---|
| E1 | Hand-build a feature vector and score | Toy email/spam features $\phi(x)=(1,\text{links},\text{caps})$, $w=(-2,1.5,0.5)$ | lesson derivation: feature/weight dot-product table; notebook: score contribution bar chart | ~3 |
| E2 | Hand-classify by sign and compute margin | Two 2-D points with labels $y\in\{-1,+1\}$ | lesson derivation: $s$, sign, $m=ys$ table; notebook: decision line with positive/negative half-planes | ~3 |
| E3 | Compare zero-one, hinge, and logistic loss for one margin | Margins $m=-1,0,0.5,1,2$ | lesson derivation: loss table; notebook: three loss curves vs margin | ~4 |
| E4 | Hand-compute residual, squared loss, and absolute loss | Tiny housing-style feature vector and target price | lesson derivation: prediction/residual/loss table; notebook: residual arrow on fitted line | ~3 |
| E5 | k-NN bias/variance intuition | Small 2-D classification toy points | notebook: decision regions for $k=1,3,9$; lesson note: high variance vs high bias | ~4 |

### 🔴 Advanced (5)
| # | Title | Data source | Visualization(s) | Build steps |
|---|---|---|---|---|
| A1 | Aggregate train loss over a tiny dataset by hand | Four examples with fixed $w$ and labels | lesson derivation: per-example margin/loss and average train loss; notebook: per-example loss bars | ~5 |
| A2 | Feature engineering changes linear separability | `make_circles`: raw $(x_1,x_2)$ then add $r^2=x_1^2+x_2^2$ | before/after decision boundary; score heatmap | ~6 |
| A3 | Hinge vs logistic under outliers | Synthetic binary classification with one mislabeled high-leverage point | margin histograms; loss contribution bars; decision boundary comparison | ~7 |
| A4 | Regression loss choice with outliers | Synthetic linear regression with contaminated targets | fitted lines for squared vs absolute loss; residual/loss curves | ~6 |
| A5 | Failure case: linear predictor on non-linear data vs k-NN/NN | `make_moons` | linear boundary failure, k-NN flexible boundary, small neural-network boundary; accuracy bars | ~8 |

## Part 4 — Colab Notebook
- **Notebook file:** topics/notebooks/29-reflex-based-models.ipynb
- **Est. cell count:** ~70 (⚖️ topic → hand score/loss derivations + coded decision-boundary/loss visualizations)
- **Key libraries:** numpy, matplotlib, scikit-learn (`make_circles`, `make_moons`, `KNeighborsClassifier`, `LogisticRegression`, regression utilities), ipywidgets
- **Runtime:** CPU
- **Failure/edge dataset included:** `make_moons` in A5 — shows a raw linear score cannot represent the curved boundary while k-NN/neural nets can.
- **Signature visualizations:** decision boundary with score/margin regions; hinge/logistic/zero-one loss curves; residual and loss plots for regression.

## Part 5 — Practice Questions
- **🟢 Easy (5) — themes:** compute $\phi(x)$ and $w\cdot\phi(x)$; classify by sign; compute margin; evaluate hinge/logistic/squared loss; explain residual vs margin.
- **🔴 Hard (5) — themes:** average train loss over a dataset; design a feature map for non-linear separation; compare hinge/logistic sensitivity to outliers; choose squared vs absolute loss; reason about k-NN bias/variance as $k$ changes.
