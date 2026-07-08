# Lesson Plan — 27 Parameter Tuning & Optimization

| Field | Value |
|---|---|
| Source | CS 230 |
| Content category | Method/Tips |
| Example type | ⚖️ Both |
| Colab notebook | Yes |
| Est. lesson time | 45–60 min |
| Source topic file | ../27-parameter-tuning-optimization.md |

## Part 1 — Overview (plan)
Optimization choices often decide whether the same neural network trains smoothly, stalls, or diverges. Hook: one tiny quadratic and one small classifier show why initialization, learning rate, momentum/RMSprop/Adam, schedules, and transfer-learning choices matter.

## Part 2 — Key Idea (plan)
- **Focus (per category = Method/Tips):** step-by-step optimizer mechanics plus practical tuning heuristics: initialize well, choose a stable learning rate, damp oscillations, adapt per-parameter steps, schedule the learning rate, and reuse pretrained weights when data is limited.
- **Core artifacts to present:** Xavier/Glorot initialization $W_{ij}\sim U[-\sqrt{6/(n_{in}+n_{out})},\sqrt{6/(n_{in}+n_{out})}]$; SGD $w\leftarrow w-\alpha g$; momentum $v\leftarrow \beta v+(1-\beta)g$, $w\leftarrow w-\alpha v$; RMSprop $s\leftarrow \beta s+(1-\beta)g^2$, $w\leftarrow w-\alpha g/(\sqrt{s}+\epsilon)$; Adam $v_t,s_t$ with bias corrections $\hat v_t=v_t/(1-\beta_1^t)$, $\hat s_t=s_t/(1-\beta_2^t)$, $w\leftarrow w-\alpha\hat v_t/(\sqrt{\hat s_t}+\epsilon)$; fixed/step/exponential/cosine LR schedules; transfer-learning freeze/unfreeze table for small/medium/large data.

## Part 3 — Worked Examples

### 🟢 Basics (10)
| # | Title | Data source | Visualization(s) | Build steps |
|---|---|---|---|---|
| B1 | One SGD scalar update | toy scalars $w=2$, $g=4$, $\alpha=0.1$ | printed values + number-line before/after | ~2 |
| B2 | One momentum velocity update | toy scalars $v_0=0$, $g=4$, $\beta=0.9$ | printed values + velocity arrow | ~2 |
| B3 | Compare two learning-rate steps | toy scalar gradient with two $\alpha$ values | printed values + two arrows on a 1-D loss curve | ~3 |
| B4 | One RMSprop scalar update | toy scalars $w=2$, $g=4$, $s_0=0$ | printed denominator + number-line before/after | ~3 |
| B5 | One Adam moment update | toy scalar gradient at $t=1$ | printed moments + raw-vs-corrected bar chart | ~3 |
| B6 | Step-decay learning rate at one epoch | toy schedule values | printed learning rate + schedule plot | ~3 |
| B7 | Xavier initialization scale | layer shape $n_{in}=4$, $n_{out}=2$ | printed limit + weight histogram | ~2 |
| B8 | Gradient of a quadratic at one point | $J(w)=20w_1^2+w_2^2$, $w=(1,-3)$ | printed gradient + vector arrow | ~2 |
| B9 | Loss decrease after one small step | one stable SGD step on the quadratic | printed before/after loss + loss bars | ~3 |
| B10 | Clip one gradient norm | toy gradient $g=(3,4)$ and threshold 2 | printed norm/scale + vector comparison | ~3 |

### 🟡 Easy (5)
| # | Title | Data source | Visualization(s) | Build steps |
|---|---|---|---|---|
| E1 | Hand-compute one SGD and momentum update on $J(w)=w^2$ | Tiny numeric case: $w_0=2$, $g=4$, $\alpha=0.1$, $v_0=0$, $\beta=0.9$ | lesson derivation: number-line movement; notebook: 1-D loss curve with before/after points | ~3 |
| E2 | Hand-compute one RMSprop step with a large gradient coordinate | Tiny vector case: $w=(1,1)$, $g=(10,1)$, $s_0=0$, $\beta=0.9$ | lesson derivation: per-coordinate denominator table; notebook: bar chart of raw vs scaled step sizes | ~3 |
| E3 | Hand-compute first Adam update with bias correction | Tiny scalar case: $w_0=1$, $g_1=0.5$, $\alpha=0.01$, $\beta_1=0.9$, $\beta_2=0.999$ | lesson derivation: $v_1,s_1,\hat v_1,\hat s_1$ table; notebook: Adam update annotation | ~4 |
| E4 | Xavier vs too-small vs too-large initialization | Synthetic 5-layer tanh network with random Gaussian inputs | activation histograms per layer; variance-vs-layer line plot | ~5 |
| E5 | Learning-rate schedule basics | Logistic classifier on `make_classification` | loss curves for fixed, step decay, exponential decay, cosine decay; schedule value over epoch | ~5 |

### 🔴 Advanced (5)
| # | Title | Data source | Visualization(s) | Build steps |
|---|---|---|---|---|
| A1 | Optimizer paths on an ill-conditioned bowl | Synthetic quadratic $J(w_1,w_2)=20w_1^2+w_2^2$ | process: gradient path on 3-D/contour surface; result: loss-vs-iteration comparing SGD, momentum, RMSprop, Adam | ~7 |
| A2 | Failure case: learning rate too high diverges | Same quadratic plus `make_classification` logistic loss | exploding trajectory arrows; log-scale loss curve showing divergence vs stable run | ~6 |
| A3 | Tune Adam hyperparameters on noisy gradients | Mini-batch MLP on two-moons classification | train/validation loss curves, decision boundary snapshots, heatmap over $(\alpha,\beta_1)$ | ~8 |
| A4 | Schedule effects after a plateau | Small MLP on `digits` or Fashion-MNIST subset | LR-vs-epoch overlay with loss/accuracy; final confusion matrix for best schedule | ~7 |
| A5 | Transfer learning: freeze head vs unfreeze last block | `sklearn digits` as pseudo-pretrained features or small image-feature extractor | bar chart of trainable parameters; train/val accuracy curves for frozen, partial, full fine-tune | ~8 |

## Part 4 — Colab Notebook
- **Notebook file:** topics/notebooks/deep-learning/27-parameter-tuning-optimization.ipynb
- **Est. cell count:** ~80 (⚖️ topic → all 13 examples (3 basics + 5 easy + 5 advanced) in the notebook, with optimizer derivations and coded visualizations)
- **Key libraries:** numpy, matplotlib, scikit-learn (`make_classification`, `make_moons`, `load_digits`), ipywidgets; optional torch only if available for the MLP/fine-tuning demo
- **Runtime:** CPU
- **Failure/edge dataset included:** ill-conditioned quadratic with an intentionally too-high learning rate in A2 — shows oscillation/divergence instead of convergence.
- **Signature visualizations:** optimizer gradient paths on a 3-D/contour loss surface; loss curves by optimizer; LR-schedule effects over epochs.
