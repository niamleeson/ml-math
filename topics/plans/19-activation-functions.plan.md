# Lesson Plan — 19 Activation Functions (Deep Learning)

| Field | Value |
|---|---|
| Source | CS 230 |
| Content category | Function |
| Example type | ⚖️ Both |
| Colab notebook | Yes |
| Est. lesson time | 40–60 min |
| Source topic file | ../19-activation-functions.md |

## Part 1 — Overview (plan)
Activation functions inject nonlinearity into neural networks and shape how gradients flow during training. Hook: "the same linear layers can learn radically different functions depending on the activation and its derivative."

## Part 2 — Key Idea (plan)
- **Focus (per category = Function):** formula, graph, and gradient for common activations; connect derivative shape to saturation, dying ReLUs, and multiclass probability outputs.
- **Core artifacts to present:** sigmoid $\sigma(z)=1/(1+e^{-z})$ and $\sigma'(z)=\sigma(z)(1-\sigma(z))$; $\tanh(z)$ and $1-\tanh^2(z)$; ReLU $\max(0,z)$ and subgradient; Leaky ReLU $\max(\epsilon z,z)$; ELU $\max(\alpha(e^z-1),z)$; softmax $p_i=e^{x_i}/\sum_j e^{x_j}$; softmax probabilities summing to 1; Jacobian entries $\partial p_i/\partial x_j=p_i(\mathbf{1}_{i=j}-p_j)$; numerical-stability trick subtracting $\max x$.

## Part 3 — Worked Examples

### 🟢 Easy (5)
| # | Title | Data source | Visualization(s) | Build steps |
|---|---|---|---|---|
| E1 | Derive and evaluate sigmoid gradient | pen-and-paper $z\in\{-2,0,2\}$ | sigmoid curve with derivative overlaid at sampled points | ~3 |
| E2 | Derive and evaluate tanh gradient | pen-and-paper $z\in\{-1,0,1\}$ | tanh curve with derivative overlaid | ~3 |
| E3 | ReLU and Leaky ReLU by cases | pen-and-paper $z=(-3,0,4)$, $\epsilon=0.01$ | piecewise graphs with slopes labeled | ~3 |
| E4 | Plot activation functions and derivatives | generated grid $z\in[-6,6]$ | result: sigmoid, tanh, ReLU, Leaky ReLU, ELU and derivatives overlaid | ~5 |
| E5 | Softmax probabilities for three class scores | pen-and-paper logits $(2,1,0)$ | probability bar chart; sum-to-one annotation | ~4 |

### 🔴 Advanced (5)
| # | Title | Data source | Visualization(s) | Build steps |
|---|---|---|---|---|
| A1 | Softmax Jacobian and cross-entropy gradient | pen-and-paper logits $(1,2,-1)$ with class 2 target | matrix heatmap of Jacobian; final $p-y$ gradient vector | ~6 |
| A2 | Saturation and vanishing gradients | generated $z\in[-12,12]$ | derivative overlays showing sigmoid/tanh near-zero tails | ~5 |
| A3 | Dying ReLU failure case | synthetic 2D binary classification with large negative bias initialization | process: activation histograms per layer; result: dead-neuron percentage | ~7 |
| A4 | Compare activations in a tiny MLP | `make_moons` | process: loss curves; result: decision boundaries for sigmoid/tanh/ReLU/Leaky ReLU | ~8 |
| A5 | Numerically stable softmax | extreme logits $(1000,1001,999)$ and batch logits | process: overflow demo; result: stable probabilities and cross-entropy | ~5 |

## Part 4 — Colab Notebook
- **Notebook file:** notebooks/19-activation-functions.ipynb
- **Est. cell count:** ~66 (⚖️ topic → derivations plus plots and small-network experiments)
- **Key libraries:** numpy, matplotlib, scikit-learn (`make_moons`), tensorflow/keras or torch, ipywidgets.
- **Runtime:** CPU
- **Failure/edge dataset included:** large negative initialization in A3 — demonstrates the dying ReLU problem; extreme logits in A5 demonstrate softmax overflow.
- **Signature visualizations:** each activation and derivative overlaid; activation/gradient histograms; softmax probability bars and Jacobian heatmap.
