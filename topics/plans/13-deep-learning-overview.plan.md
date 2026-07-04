# Lesson Plan — 13 Deep Learning Overview (Neural Nets, CNN, RNN, RL)

| Field | Value |
|---|---|
| Source | CS 229 |
| Content category | Model |
| Example type | 💻 Colab |
| Colab notebook | Yes |
| Est. lesson time | 55–75 min |
| Source topic file | ../13-deep-learning-overview.md |

## Part 1 — Overview (plan)
Deep learning stacks differentiable layers so models can learn representations instead of relying only on hand-designed features. Hook: one tiny network will learn a nonlinear decision boundary by repeating forward pass → loss → backpropagation → update.

## Part 2 — Key Idea (plan)
- **Focus (per category = Model):** formulation and when to use neural networks, CNNs, RNN/LSTMs, and reinforcement-learning value methods.
- **Core artifacts to present:** layer equation $z_j^{[i]}=w_j^{[i]T}x+b_j^{[i]}$; sigmoid/tanh/ReLU/leaky ReLU formulas; binary cross-entropy $L(z,y)=-[y\log z+(1-y)\log(1-z)]$; chain-rule backprop $\partial L/\partial w=(\partial L/\partial a)(\partial a/\partial z)(\partial z/\partial w)$; weight update $w\leftarrow w-\eta\partial L/\partial w$; dropout keep/drop probabilities; CNN output-size formula $N=(W-F+2P)/S+1$; batch normalization equation; LSTM gates; MDP tuple, Bellman equation, value iteration, and Q-learning update.

## Part 3 — Worked Examples

### 🟢 Easy (5)
| # | Title | Data source | Visualization(s) | Build steps |
|---|---|---|---|---|
| E1 | Tiny neuron: forward pass and activation shapes | `linearly_separable_2d` synthetic | activation curves; neuron score heatmap | ~5 |
| E2 | From-scratch logistic neuron with gradient descent | `make_classification` | process: loss-vs-iteration; result: decision boundary | ~6 |
| E3 | Tiny 2-layer neural net learns XOR/moons | `xor` / `moons` | boundary per epoch; training curve; hidden activations | ~8 |
| E4 | CNN arithmetic: convolution + padding + stride | generated 8×8 edge images | filter overlay; feature map after convolution; output-size annotation | ~6 |
| E5 | Mini value iteration on a gridworld | toy 4×4 gridworld | value heatmap updating per sweep; final policy arrows | ~6 |

### 🔴 Advanced (5)
| # | Title | Data source | Visualization(s) | Build steps |
|---|---|---|---|---|
| A1 | Backprop by hand-coded NumPy network | `moons` | granular forward→loss→backprop→update loop; boundary per epoch; gradient norms | ~10 |
| A2 | Learning-rate failure and Adam comparison | `moons` with noisy labels | loss curves for too-small/good/too-large $\eta$; boundary instability | ~7 |
| A3 | Dropout and overfitting diagnostics | small `digits` subset | train/validation curves; activation histograms; confusion matrix | ~8 |
| A4 | Simple RNN/LSTM intuition on sequence prediction | synthetic sine-wave / parity sequence | hidden-state traces over time; prediction vs truth | ~8 |
| A5 | Q-learning failure/edge: sparse rewards | slippery gridworld | episode reward curve; Q-value heatmaps; comparison to dense reward shaping | ~9 |

## Part 4 — Colab Notebook
- **Notebook file:** notebooks/13-deep-learning-overview.ipynb
- **Est. cell count:** ~95 (💻 topic → all 10 examples coded; backprop examples use granular build↔see loops)
- **Key libraries:** numpy, matplotlib, scikit-learn (`make_moons`, `make_classification`, `load_digits`, `confusion_matrix`), ipywidgets; optional torch if available for the dropout/RNN demos
- **Runtime:** CPU; GPU optional for faster neural-net/RNN cells but not required for the tiny datasets.
- **Failure/edge dataset included:** noisy `moons` and sparse-reward gridworld — shows unstable learning rates, overfitting, and reward sparsity.
- **Signature visualizations:** training curves; decision boundary per epoch; activation histograms / feature maps; confusion matrix; gridworld value heatmaps.

## Part 5 — Practice Questions
- **🟢 Easy (5) — themes:** identify layers/weights/biases; compute one activation value; read a cross-entropy term; compute CNN output size; name LSTM gates and MDP components.
- **🔴 Hard (5) — themes:** trace a one-sample backprop chain rule; diagnose vanishing gradients from activation choices; choose learning-rate remedies from curves; reason about dropout train vs inference scaling; apply Bellman or Q-learning updates to one transition.
