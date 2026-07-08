# Lesson Plan — 26 Deep Learning: Data Processing & Training

| Field | Value |
|---|---|
| Source | CS 230 |
| Content category | Tips/Method |
| Example type | 💻 Colab |
| Colab notebook | Yes |
| Est. lesson time | 45–60 min |
| Source topic file | ../26-dl-data-processing-training.md |

## Part 1 — Overview (plan)
Strong deep-learning results often come from the training pipeline: better data, stable normalization, correct
losses, mini-batches, and a reliable forward→backward→update loop. Hook: "the same architecture can fail or
succeed depending on preprocessing and training mechanics."

## Part 2 — Key Idea (plan)
- **Focus (per category = Tips/Method):** the technique + why it helps, organized as a practical training
  recipe: augment data, normalize batches, choose mini-batches, compute loss, backpropagate gradients, and update
  weights over epochs.
- **Core artifacts to present:** augmentation table (flip, rotation, crop, color shift, noise, information loss,
  contrast); batch-normalization formula
  $x_i\leftarrow \gamma\frac{x_i-\mu_B}{\sqrt{\sigma_B^2+\epsilon}}+\beta$; epoch and mini-batch definitions;
  binary cross-entropy $L(z,y)=-[y\log z+(1-y)\log(1-z)]$; chain-rule backprop diagram
  $\frac{\partial L}{\partial f(x)}\frac{\partial f(x)}{\partial x}$; update rule
  $w\leftarrow w-\alpha\frac{\partial L}{\partial w}$; three-step train loop: forward, backprop, update.

## Part 3 — Worked Examples

### 🟢 Basics (10)
| # | Title | Data source | Visualization(s) | Build steps |
|---|---|---|---|---|
| B1 | Normalize one tiny feature array | toy feature values $[1,2,5,6]$ | printed values + before/after dot strip | ~3 |
| B2 | Compute one binary cross-entropy loss | toy scalar prediction and label | printed values + single loss marker on $z$ axis | ~2 |
| B3 | One scalar weight update | toy weight, gradient, and learning rate | printed values + number-line before/after | ~2 |
| B4 | Min-max normalize one array | toy feature values $[2,4,6,10]$ | printed values + before/after dot strip | ~3 |
| B5 | One-hot encode three labels | toy labels $[2,0,1]$ | printed matrix + one-hot heatmap | ~2 |
| B6 | Shuffle then batch indices | six toy example indices | printed batches + shuffled-order timeline | ~3 |
| B7 | One mini-batch mean gradient | three toy scalar gradients | printed mean + gradient bar chart | ~2 |
| B8 | Horizontal flip a tiny image | one $3\times3$ grayscale array | printed arrays + before/after image grid | ~2 |
| B9 | Batch-normalize one mini-batch | toy activation batch $[1,2,5,6]$ | printed stats + before/after bars | ~3 |
| B10 | Learning-rate times gradient update | toy scalar weight, gradient, and learning rate | printed values + number-line before/after | ~2 |

### 🟡 Easy (5)
| # | Title | Data source | Visualization(s) | Build steps |
|---|---|---|---|---|
| E1 | Visualize image augmentations | CIFAR-10 / Fashion-MNIST samples | process: original→flip/rotate/crop/color/noise/mask/contrast grid; result: augmentation montage | ~5 |
| E2 | Mini-batches and epochs | synthetic binary classification data | process: shuffled batch index timeline; result: loss updates per mini-batch vs epoch | ~4 |
| E3 | Cross-entropy by hand and in code | toy probabilities/labels | process: loss surface over prediction $z$; result: per-example loss table | ~4 |
| E4 | One-layer training loop from scratch | `make_moons` binary data | process: forward→loss→backward→update trace; result: decision boundary + loss curve | ~6 |
| E5 | Batch norm on activations | synthetic hidden activations | process: before/after activation histograms; result: normalized batch mean/variance check | ~5 |

### 🔴 Advanced (5)
| # | Title | Data source | Visualization(s) | Build steps |
|---|---|---|---|---|
| A1 | Augmentation improves generalization | small CIFAR-10 subset | process: augmented examples during training; result: train/val accuracy curves with/without augmentation | ~8 |
| A2 | Failure case — harmful augmentation | MNIST with invalid vertical flips / label-sensitive rotations | process: corrupted-label examples; result: validation accuracy drop + error examples | ~6 |
| A3 | Batch norm allows higher learning rate | Fashion-MNIST small CNN/MLP | process: activation distributions by layer; result: loss/accuracy curves with/without BN | ~8 |
| A4 | Full training loop with diagnostics | `make_circles` or Fashion-MNIST | process: gradient norms, learning rate, mini-batch loss; result: dashboard of loss/acc curves + confusion matrix | ~9 |
| A5 | End-to-end pipeline capstone | small image dataset from `tf.keras.datasets` / upload option | process: load→split→augment→normalize→train→evaluate; result: augmentation grid, curves, confusion matrix, misclassified examples | ~10 |

## Part 4 — Colab Notebook
- **Notebook file:** topics/notebooks/deep-learning/26-dl-data-processing-training.ipynb
- **Est. cell count:** ~88 (💻 topic → all 13 examples (3 basics + 5 easy + 5 advanced) coded; training diagnostics require repeated build↔see loops)
- **Key libraries:** numpy, pandas, matplotlib, scikit-learn, tensorflow/keras or torch, torchvision/tensorflow-datasets, seaborn, ipywidgets
- **Runtime:** CPU
- **Failure/edge dataset included:** invalid augmentation set in A2 — shows that augmentation must preserve labels; no-BN/high-learning-rate comparison in A3 shows unstable training.
- **Signature visualizations:** augmentation montage; batch-normalization activation histograms; loss/accuracy curves with diagnostics and misclassified-image grid.
