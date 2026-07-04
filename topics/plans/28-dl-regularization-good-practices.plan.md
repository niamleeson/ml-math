# Lesson Plan — 28 DL Regularization & Good Practices

| Field | Value |
|---|---|
| Source | CS 230 |
| Content category | Regularization |
| Example type | ⚖️ Both |
| Colab notebook | Yes |
| Est. lesson time | 45–60 min |
| Source topic file | ../28-dl-regularization-good-practices.md |

## Part 1 — Overview (plan)
Regularization controls overfitting by changing what solutions are easy for the network to use. Hook: the same flexible model memorizes noisy data without constraints, but generalizes when dropout, L2, early stopping, batch norm, and sanity checks are used correctly.

## Part 2 — Key Idea (plan)
- **Focus (per category = Regularization):** penalties and training practices that reduce variance, expose implementation bugs, and improve generalization.
- **Core artifacts to present:** dropout with drop probability $p$ and keep probability $q=1-p$ using inverted scaling $a_{drop}=m\odot a/q$; L1/L2/elastic-net objectives $J+\lambda\lVert\theta\rVert_1$, $J+\lambda\lVert\theta\rVert_2^2$, $J+\lambda[(1-\alpha)\lVert\theta\rVert_1+\alpha\lVert\theta\rVert_2^2]$; L2 gradient contribution $2\lambda\theta$; early-stopping rule from validation loss; batch normalization $\hat z=(z-\mu_B)/\sqrt{\sigma_B^2+\epsilon}$, $\tilde z=\gamma\hat z+\beta$; overfit-a-small-batch and gradient-checking central difference $(f(x+h)-f(x-h))/(2h)$.

## Part 3 — Worked Examples

### 🟢 Basics (3)
| # | Title | Data source | Visualization(s) | Build steps |
|---|---|---|---|---|
| B1 | Apply one dropout mask | toy activation vector and binary mask | printed values + before/mask/after bars | ~2 |
| B2 | Compute only an L2 penalty | toy weight vector and $\lambda$ | printed values + penalty contribution bar | ~2 |
| B3 | Read a train-vs-validation gap | toy train/validation loss numbers | printed values + two-point gap plot | ~2 |

### 🟡 Easy (5)
| # | Title | Data source | Visualization(s) | Build steps |
|---|---|---|---|---|
| E1 | Hand-compute L2-regularized loss and gradient | Tiny weights $\theta=(3,4)$, base loss $2.0$, $\lambda=0.1$ | lesson derivation: penalty and $2\lambda\theta$ table; notebook: weight-shrink arrow plot | ~3 |
| E2 | Hand-apply inverted dropout to one hidden layer | Tiny activation vector $a=(2,0,4,6)$, mask $(1,0,1,0)$, keep $q=0.5$ | lesson derivation: before/mask/after table; notebook: neuron dropout diagram | ~3 |
| E3 | Early stopping from a validation-loss sequence | Small numeric epoch table | lesson derivation: identify patience/minimum epoch; notebook: train/val curves with stop marker | ~3 |
| E4 | Batch normalization on one mini-batch | Tiny pre-activation batch $z=[1,2,5,6]$ with $\gamma=2,\beta=-1$ | lesson derivation: mean/variance/normalized table; notebook: histograms before/after BN | ~4 |
| E5 | Gradient checking a scalar neuron | $f(w)=w^3$, $w=2$, $h=10^{-4}$ | lesson derivation: numerical vs analytical gradient; notebook: error vs step-size curve | ~4 |

### 🔴 Advanced (5)
| # | Title | Data source | Visualization(s) | Build steps |
|---|---|---|---|---|
| A1 | Failure case: overfitting without regularization | Noisy two-moons classification with oversized MLP | train/validation curves with and without regularization; decision boundary becoming jagged | ~7 |
| A2 | L1 vs L2 vs elastic net on redundant features | `make_regression` with correlated and irrelevant features | coefficient paths as $\lambda$ changes; weight histogram/sparsity bar chart | ~7 |
| A3 | Dropout rate sweep | Noisy `digits` subset or two-moons MLP | validation accuracy vs dropout rate; activation/weight histograms; underfit at high dropout | ~7 |
| A4 | Early stopping plus checkpoint selection | Same MLP with noisy labels | epoch-by-epoch train/val curves; selected checkpoint marker; final test comparison | ~6 |
| A5 | Batch norm as a good practice and its edge cases | Deep ReLU network on standardized vs unstandardized synthetic features | activation distribution by layer; loss curves with/without BN; small-batch noisy BN failure | ~8 |

## Part 4 — Colab Notebook
- **Notebook file:** topics/notebooks/28-dl-regularization-good-practices.ipynb
- **Est. cell count:** ~84 (⚖️ topic → all 13 examples (3 basics + 5 easy + 5 advanced) in the notebook, with regularization derivations and coded behavior examples)
- **Key libraries:** numpy, matplotlib, scikit-learn (`make_moons`, `make_regression`, `load_digits`), ipywidgets; optional torch for neural-network dropout/batch-norm demos
- **Runtime:** CPU
- **Failure/edge dataset included:** noisy two-moons with an oversized MLP and no regularization in A1 — demonstrates memorization and validation loss rising.
- **Signature visualizations:** train/validation curves with and without regularization; weight histograms/coefficient paths; early-stopping marker and dropout/batch-norm activation plots.
