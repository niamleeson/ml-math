# Lesson Plan — 07 Support Vector Machines

| Field | Value |
|---|---|
| Source | CS 229 |
| Content category | Model |
| Example type | ⚖️ Both |
| Colab notebook | Yes |
| Est. lesson time | 50–65 min |
| Source topic file | ../07-support-vector-machines.md |

## Part 1 — Overview (plan)
Support Vector Machines choose the separating hyperplane with the largest margin, then extend that idea to soft margins and nonlinear boundaries with kernels. Hook: the classifier is determined by a few critical training points — the support vectors — not by every point equally.

## Part 2 — Key Idea (plan)
- **Focus (per category = Model):** formulation + when to use hard-margin SVMs, soft-margin/hinge-loss SVMs, and kernel SVMs.
- **Core artifacts to present:** classifier $h(x)=\operatorname{sign}(w^Tx-b)$; hard-margin program $\min \frac12\lVert w\rVert^2$ subject to $y^{(i)}(w^Tx^{(i)}-b)\ge 1$; geometric margin width $2/\lVert w\rVert$; hinge loss $L(z,y)=\max(0,1-yz)$; slack/regularization intuition for $C$; kernel definition $K(x,z)=\phi(x)^T\phi(z)$; Gaussian/RBF kernel $K(x,z)=\exp(-\lVert x-z\rVert^2/(2\sigma^2))$; Lagrange multipliers/support-vector sparsity.

## Part 3 — Worked Examples

### 🟢 Easy (5)
| # | Title | Data source | Visualization(s) | Build steps |
|---|---|---|---|---|
| E1 | [pen-and-paper] Compute margin width for a candidate separator | 2-D line with specified $w,b$ and labeled points | Margin-line sketch: $w^Tx-b=0,\pm1$ | pen-and-paper ~4 |
| E2 | [coded] Hard-margin SVM on clean separable blobs | `make_blobs` with two well-separated classes | boundary + margins + support vectors circled | ~5 |
| E3 | [pen-and-paper] Hinge loss values for correctly/incorrectly classified points | Four examples with given $y$ and score $z=w^Tx-b$ | Table of margin $yz$ and $\max(0,1-yz)$ | pen-and-paper ~4 |
| E4 | [coded] C controls soft-margin tolerance | Overlapping 2-D Gaussian blobs | process: boundary/margins as `C` changes; result: support-vector count vs `C` | ~5 |
| E5 | [pen-and-paper] Kernel dot product without explicit features | Polynomial feature map in 2-D | Expand $\phi(x)^T\phi(z)$ and match kernel value | pen-and-paper ~5 |

### 🔴 Advanced (5)
| # | Title | Data source | Visualization(s) | Build steps |
|---|---|---|---|---|
| A1 | [coded] Linear SVM failure on nonlinear rings | `make_circles` | linear boundary failure; misclassified region highlighted | ~5 |
| A2 | [coded] RBF kernel fixes nonlinear separation | same `make_circles` | boundary + margins/support vectors; before/after linear vs RBF panels | ~6 |
| A3 | [coded] Gamma/sigma controls boundary smoothness | `make_moons` | process: RBF boundaries for low/medium/high gamma; support vectors circled | ~6 |
| A4 | [coded] Hinge vs logistic loss shape and training behavior | Synthetic binary classification | loss curves over margin; optimization loss-vs-iteration comparison | ~5 |
| A5 | [pen-and-paper] Lagrangian/KKT intuition for support vectors | Tiny separable dataset with candidate active constraints | Identify active constraints, nonzero multipliers, and why non-support vectors vanish | pen-and-paper ~7 |

## Part 4 — Colab Notebook
- **Notebook file:** topics/notebooks/07-support-vector-machines.ipynb
- **Est. cell count:** ~70 (⚖️ topic → geometric derivations plus coded margin/kernel experiments)
- **Key libraries:** numpy, matplotlib, scikit-learn (`SVC`, `LinearSVC`, `make_blobs`, `make_moons`, `make_circles`), ipywidgets
- **Runtime:** CPU
- **Failure/edge dataset included:** `make_circles`/`make_moons` in A1 — shows a linear SVM cannot separate nonlinear geometry.
- **Signature visualizations:** decision boundary with parallel margins and circled support vectors; `C` sweep margin panels; linear-vs-RBF kernel comparison.

## Part 5 — Practice Questions
- **🟢 Easy (5) — themes:** compute margin width from $w$; identify support vectors from a plot; evaluate hinge loss; explain what increasing `C` usually does; distinguish linear and RBF kernels.
- **🔴 Hard (5) — themes:** derive why maximizing margin becomes minimizing $\frac12\lVert w\rVert^2$; reason about slack variables for overlapping data; predict gamma effects on overfitting; prove only support vectors affect the dual prediction; design a dataset where a linear SVM fails but RBF succeeds.
