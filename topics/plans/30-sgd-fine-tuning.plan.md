# Lesson Plan — 30 SGD & Fine-tuning Models

| Field | Value |
|---|---|
| Source | CS 221 |
| Content category | Method |
| Example type | ⚖️ Both |
| Colab notebook | Yes |
| Est. lesson time | 45–60 min |
| Source topic file | ../30-sgd-fine-tuning.md |

## Part 1 — Overview (plan)
SGD is the basic engine that turns per-example loss gradients into learned weights, while fine-tuning controls which hypothesis class and hyperparameters are allowed to adapt. Hook: noisy single-example updates can reach a useful predictor faster than smooth full-batch updates, but tuning determines whether they generalize.

## Part 2 — Key Idea (plan)
- **Focus (per category = Method):** step-by-step SGD/BGD training, logistic fine-tuning, backpropagation signals, model-selection vocabulary, regularization, and train/validation/test workflow.
- **Core artifacts to present:** SGD update $w\leftarrow w-\eta\nabla_w Loss(x,y,w)$; BGD update using the average gradient over a batch; logistic function $\sigma(z)=1/(1+e^{-z})$ and derivative $\sigma'(z)=\sigma(z)(1-\sigma(z))$; hypothesis class $\mathcal F=\{f_w:w\in\mathbb R^d\}$; forward values $f_i$ and backward sensitivities $g_i=\partial out/\partial f_i$; approximation vs estimation error; regularization hyperparameter $\lambda$; hyperparameters $\eta,T,\lambda,$ features; train/validation/test split and final retraining protocol; transfer/fine-tuning choices (freeze, partial unfreeze, full fine-tune).

## Part 3 — Worked Examples

### 🟢 Basics (3)
| # | Title | Data source | Visualization(s) | Build steps |
|---|---|---|---|---|
| B1 | Apply one scalar SGD update $w\leftarrow w-\eta g$ | toy scalars | printed before/after weights | ~2 |
| B2 | Evaluate one sigmoid value $\sigma(z)$ | toy scalars | printed values | ~2 |
| B3 | Mark frozen vs trainable parameters in a tiny layer | toy weights | trainable-flag table | ~3 |

### 🟡 Easy (5)
| # | Title | Data source | Visualization(s) | Build steps |
|---|---|---|---|---|
| E1 | Hand-compute one SGD update for squared loss | One example $\phi(x)=(1,2)$, $y=3$, $w=(0,1)$, $\eta=0.1$ | lesson derivation: prediction, residual, gradient, new $w$; notebook: arrow in weight space | ~4 |
| E2 | Hand-compute one logistic/sigmoid output and derivative | Scalar $z=-1,0,2$ | lesson derivation: $\sigma(z)$ and $\sigma'(z)$ table; notebook: sigmoid and derivative curves | ~3 |
| E3 | SGD vs batch gradient on a two-example dataset | Tiny regression dataset | lesson derivation: one SGD step vs one batch step; notebook: smooth vs noisy descent arrows | ~4 |
| E4 | Train/validation/test split vocabulary | Small tabular dataset indices | split diagram with train, validation, test; metric table by split | ~3 |
| E5 | Hyperparameter sweep for step size $\eta$ | Logistic classifier on `make_classification` | loss curves for too-small, good, too-large $\eta$; final accuracy bars | ~5 |

### 🔴 Advanced (5)
| # | Title | Data source | Visualization(s) | Build steps |
|---|---|---|---|---|
| A1 | Failure case: SGD noise vs batch GD stability | Noisy linear regression with shuffled examples | process: noisy SGD path vs smooth BGD path; result: loss-vs-update and final fit | ~7 |
| A2 | Mini-batch size tradeoff | `make_classification` logistic regression from scratch | wall-clock/update count proxy; loss variance bands for batch sizes 1, 16, full | ~7 |
| A3 | Backpropagation through a tiny computation graph | Hand graph $out=(wx+b)^2$ then coded autograd-style checks | lesson derivation: forward $f_i$ and backward $g_i$ table; notebook: graph with gradients annotated | ~6 |
| A4 | Regularization and approximation/estimation error | Polynomial features on noisy sine data | train/val curves by degree and $\lambda$; underfit/overfit regions labeled | ~8 |
| A5 | Fine-tuning/transfer learning strategy | `digits` task with pretrained PCA/logistic features or small frozen feature extractor | accuracy curves for frozen head, partial unfreeze, full retrain; trainable-parameter bar chart | ~8 |

## Part 4 — Colab Notebook
- **Notebook file:** topics/notebooks/30-sgd-fine-tuning.ipynb
- **Est. cell count:** ~86 (⚖️ topic → 3 basics + hand SGD/backprop derivations + coded optimization/fine-tuning comparisons)
- **Key libraries:** numpy, matplotlib, scikit-learn (`make_classification`, polynomial features, `load_digits`), ipywidgets; optional torch for fine-tuning/backprop demo
- **Runtime:** CPU
- **Failure/edge dataset included:** noisy regression/classification with high SGD variance in A1 — contrasts noisy per-example updates against stable but costlier batch gradients.
- **Signature visualizations:** noisy vs smooth descent paths; loss curves by learning rate/batch size; fine-tuning accuracy curves and trainable-parameter bars.
