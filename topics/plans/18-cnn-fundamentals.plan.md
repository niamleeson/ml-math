# Lesson Plan — 18 CNN Fundamentals: Layers, Filters, Tuning

| Field | Value |
|---|---|
| Source | CS 230 |
| Content category | Model/Concept |
| Example type | ⚖️ Both |
| Colab notebook | Yes |
| Est. lesson time | 45–65 min |
| Source topic file | ../18-cnn-fundamentals.md |

## Part 1 — Overview (plan)
Introduce CNNs as neural networks that preserve spatial structure through local filters, downsample with pooling, then classify with fully connected layers. Hook: "a CNN learns small visual detectors first, then composes them into higher-level evidence."

## Part 2 — Key Idea (plan)
- **Focus (per category = Model/Concept):** formulation and vocabulary for CONV, POOL, and FC layers; when CNNs are preferred over fully connected networks for image-like inputs; how filter hyperparameters control feature-map size and capacity.
- **Core artifacts to present:** CNN pipeline input → CONV → activation → POOL → flatten → FC; filter volume $F\times F\times C$ and $K$ filters; output-size formula $O=\frac{I-F+P_{\text{start}}+P_{\text{end}}}{S}+1$ (or $\frac{I-F+2P}{S}+1$); parameter counts $(F\times F\times C+1)K$, $0$ for pooling, and $(N_{\text{in}}+1)N_{\text{out}}$ for FC; valid/same/full padding; stride; receptive field $R_k=1+\sum_{j=1}^k(F_j-1)\prod_{i=0}^{j-1}S_i$.

## Part 3 — Worked Examples

### 🟢 Basics (10)
| # | Title | Data source | Visualization(s) | Build steps |
|---|---|---|---|---|
| B1 | Multiply one 2×2 image patch by one 2×2 filter | pen-and-paper $2\times2$ patch and $2\times2$ filter | highlighted patch with printed dot product | ~2 |
| B2 | Compute one convolution output size | toy scalars: $I=5,F=3,S=1,P=0$ | printed formula substitution | ~2 |
| B3 | Take one 2×2 max-pool value | pen-and-paper $2\times2$ activation patch | highlighted maximum in the patch | ~2 |
| B4 | Take one 2×2 average-pool value | pen-and-paper $2\times2$ activation patch | highlighted average over the patch | ~2 |
| B5 | Count parameters in one convolution layer | toy scalars: $F=3,C=2,K=4$ | printed parameter formula substitution | ~2 |
| B6 | Apply ReLU to a feature map | toy $2\times2$ feature map | before/after activation heatmap | ~2 |
| B7 | Compare stride effect on output size | toy scalars: $I=7,F=3,P=0,S\in\{1,2\}$ | side-by-side output-size values | ~2 |
| B8 | Zero-pad a tiny matrix | toy $2\times2$ image with $P=1$ | padded matrix display | ~2 |
| B9 | Apply a vertical-edge filter to one patch | toy $2\times2$ bright-right patch | highlighted edge response | ~2 |
| B10 | Flatten a small feature map length | toy tensor shape $2\times3\times4$ | shape-to-vector length annotation | ~2 |

### 🟡 Easy (5)
| # | Title | Data source | Visualization(s) | Build steps |
|---|---|---|---|---|
| E1 | Hand-compute one convolution output cell | pen-and-paper $5\times5$ grayscale grid + $3\times3$ edge filter | shape diagram; highlight one receptive field and resulting scalar | ~3 |
| E2 | Output dimensions for valid/same padding | pen-and-paper $I=32,F=3,S=1,P=0$ and $P=1$ cases | input/filter/output grids annotated with $I,F,S,P,O$ | ~3 |
| E3 | Parameter count for a CONV→POOL→FC toy CNN | pen-and-paper $32\times32\times3$, $K=16$, pool $2\times2$, FC 10 | layer table showing output shapes and parameter totals | ~4 |
| E4 | Build a tiny CNN on digits | `sklearn` digits or MNIST subset | process: training/validation curves; result: confusion matrix | ~6 |
| E5 | Visualize first-layer filters and feature maps | same trained digits CNN | process: selected input image through CONV; result: learned filters + activation maps | ~5 |

### 🔴 Advanced (5)
| # | Title | Data source | Visualization(s) | Build steps |
|---|---|---|---|---|
| A1 | Stride and padding compatibility edge case | pen-and-paper $I=28,F=5,S=2$ with invalid and fixed padding choices | compatibility table; red mark where $O$ is non-integer | ~4 |
| A2 | Receptive field through stacked layers | pen-and-paper two CONV layers plus one POOL layer | process: trace one deep activation back to input; result: receptive-field growth diagram | ~5 |
| A3 | CNN vs fully connected parameter explosion | MNIST-shaped tensor | bar chart comparing parameter counts for FC-only vs CNN architecture | ~5 |
| A4 | Feature maps under different filters | small natural images: cat, street sign, handwritten digit | process: convolution with blur, sharpen, vertical-edge filters; result: feature-map grid | ~6 |
| A5 | Failure case: translation/scale stress test | shifted/scaled digits or Fashion-MNIST subset | process: predictions before/after augmentation; result: misclassified examples + activation maps diagnosing sensitivity | ~8 |

## Part 4 — Colab Notebook
- **Notebook file:** notebooks/18-cnn-fundamentals.ipynb
- **Est. cell count:** ~84 (⚖️ topic → all 20 examples (10 basics + 5 easy + 5 advanced), from atomic CONV/POOL warm-ups to coded CNN visualizations)
- **Key libraries:** numpy, matplotlib, scikit-learn (`load_digits`), tensorflow/keras or torch, seaborn for confusion matrices, ipywidgets.
- **Runtime:** CPU
- **Failure/edge dataset included:** shifted/scaled digits in A5 — shows that basic CNNs still fail when transformations exceed learned invariances.
- **Signature visualizations:** feature maps and learned filters; layer output-shape table; training curves and confusion matrix.
