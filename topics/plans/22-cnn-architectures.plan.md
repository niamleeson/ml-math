# Lesson Plan — 22 Advanced CNN Architectures: GAN, ResNet, Inception

| Field | Value |
|---|---|
| Source | CS 230 |
| Content category | Model |
| Example type | 💻 Colab |
| Colab notebook | Yes |
| Est. lesson time | 50–65 min |
| Source topic file | ../22-cnn-architectures.md |

## Part 1 — Overview (plan)
Modern CNN architectures use structural tricks to train deeper, generate images, and combine features at multiple
scales. Hook: "same convolution building blocks, three very different design ideas" — adversarial generation,
residual shortcuts, and parallel Inception branches.

## Part 2 — Key Idea (plan)
- **Focus (per category = Model):** formulation + when to use for GANs (generate realistic samples), ResNets
  (train very deep classifiers), and Inception modules (multi-scale feature extraction with lower compute).
- **Core artifacts to present:** GAN generator→discriminator real/fake pipeline; generator/discriminator loss
  intuition; ResNet residual block equation $a^{[l+2]}=g(a^{[l]}+z^{[l+2]})$; skip-connection diagram and
  gradient-flow intuition; Inception module branches ($1\times1$, $3\times3$, $5\times5$, pooling) + concatenate;
  $1\times1$ convolution as channel bottleneck for compute reduction.

## Part 3 — Worked Examples

### 🟢 Basics (10)
| # | Title | Data source | Visualization(s) | Build steps |
|---|---|---|---|---|
| B1 | Apply one 1×1 convolution to a tiny volume | toy 2×2×3 input volume and one filter | printed channel-weighted sums plus output heatmap | ~3 |
| B2 | Count parameters of one convolution layer | toy kernel size, input channels, output channels | printed formula and parameter total | ~2 |
| B3 | Add a residual shortcut $x+F(x)$ | two tiny 2×2 feature maps | before/after heatmaps and printed summed values | ~2 |
| B4 | Concatenate two feature maps like an Inception module | two toy 2×2 branch tensors | output channel grid and printed shapes | ~2 |
| B5 | Tiny generator forward pass from noise to vector | toy 2-D noise vector and generator weights | generated-feature bar chart | ~2 |
| B6 | Discriminator score with a sigmoid | toy sample vector and discriminator weights | sigmoid curve with sample score | ~2 |
| B7 | ReLU on a small activation volume | toy 2×2×2 activation tensor | before/after printed volume and channel heatmaps | ~2 |
| B8 | Parameter savings from a $1\times1$ bottleneck | toy channel counts for direct vs bottleneck conv | parameter-count bar chart | ~2 |
| B9 | Batch-normalize one activation value | one activation with mean, variance, scale, and shift | raw/standardized/output bar chart | ~2 |
| B10 | Global average pool a feature map | toy 2×2×2 feature tensor | pooled channel-average bar chart | ~2 |

### 🟡 Easy (5)
| # | Title | Data source | Visualization(s) | Build steps |
|---|---|---|---|---|
| E1 | Residual block forward pass on tiny feature maps | synthetic 8×8 image tensors | process: main path + skip tensor shapes; result: residual-add heatmaps before/after activation | ~5 |
| E2 | Plain CNN vs small ResNet on digits | `sklearn digits` upsampled / MNIST subset | process: loss/accuracy curves; result: confusion matrices + learned feature maps | ~6 |
| E3 | Build an Inception-style module | synthetic RGB patches | process: parallel branch output shapes; result: branch feature-map grid + concatenated tensor diagram | ~5 |
| E4 | $1\times1$ bottleneck saves compute | CIFAR-10 mini-batch | process: parameter/FLOP bar chart per branch; result: same output shape with reduced compute | ~4 |
| E5 | GAN "hello world" on 2-D points | 2-D Gaussian ring / moons | process: generator samples moving over epochs; result: discriminator decision surface + fake vs real scatter | ~7 |

### 🔴 Advanced (5)
| # | Title | Data source | Visualization(s) | Build steps |
|---|---|---|---|---|
| A1 | Train a tiny DCGAN | Fashion-MNIST | process: generator image grid every N epochs; result: real/fake comparison + discriminator confidence histogram | ~9 |
| A2 | GAN failure case — mode collapse | imbalanced 2-D Gaussian mixture | process: samples collapsing to one mode; result: mode-coverage plot + discriminator surface diagnosis | ~8 |
| A3 | Deep plain CNN vs ResNet under vanishing gradients | CIFAR-10 small subset | process: gradient-norm-by-layer curves; result: accuracy/loss curves showing residual shortcut benefit | ~8 |
| A4 | Inception module for multi-scale patterns | synthetic shapes with small/large objects | process: branch activations for $1\times1/3\times3/5\times5$/pool; result: multi-scale feature-map montage | ~8 |
| A5 | Architecture comparison capstone | CIFAR-10 small subset | process: train PlainCNN, ResNet-block CNN, Inception-block CNN; result: accuracy/params/FLOPs tradeoff chart + feature maps | ~10 |

## Part 4 — Colab Notebook
- **Notebook file:** topics/notebooks/22-cnn-architectures.ipynb
- **Est. cell count:** ~100 (💻 topic → all 13 examples (3 basics + 5 easy + 5 advanced) coded; GAN/ResNet/Inception blocks need granular build↔see loops)
- **Key libraries:** numpy, matplotlib, scikit-learn, tensorflow/keras or torch, torchvision/tensorflow-datasets, seaborn
- **Runtime:** GPU recommended (tiny subsets keep fallback possible, but GAN and CIFAR examples should flag GPU)
- **Failure/edge dataset included:** imbalanced 2-D Gaussian mixture in A2 — demonstrates GAN mode collapse; deep plain CNN in A3 shows vanishing-gradient/training degradation compared with ResNet.
- **Signature visualizations:** GAN real/fake grids and discriminator surface; residual-block skip/add feature maps; Inception branch/module diagrams with learned feature maps.
