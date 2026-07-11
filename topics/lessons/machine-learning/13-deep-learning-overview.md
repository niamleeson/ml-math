# Deep Learning Overview (Neural Nets, CNN, RNN, RL)
> **Source:** CS 229 · **Category:** Model · **Type:** 💻 Colab · [↑ Full reference](../../ai-ml-cheatsheets.md)
> 📓 Runnable notebook section; an `.ipynb` will be generated.

## ✍️ Toy Examples

Before the full worked notebook, here are tiny, hand-traceable deep-learning toys for the computational mechanics in this lesson. Each toy prints the intermediate arrays, checks one invariant, and draws a compact picture.

### ✍️ Toy 1 · Perceptron score and threshold

A perceptron turns a weighted sum plus bias into a hard class prediction by checking whether the score crosses zero.

```python
import numpy as np
import matplotlib.pyplot as plt

t1_rng = np.random.default_rng(0)  # -> seeded generator for reproducibility
t1_X = np.array([[0.0, 0.0], [1.0, 0.0], [0.0, 1.0], [1.0, 1.0], [2.0, 1.0], [1.0, 2.0]])  # -> 6 two-feature items
t1_y = np.array([0, 0, 0, 1, 1, 1])  # -> [0, 0, 0, 1, 1, 1]
t1_w = np.array([1.0, 1.0])  # -> [1.0, 1.0]
t1_b = -1.5  # -> -1.5
t1_linear = t1_X @ t1_w  # -> [0.0, 1.0, 1.0, 2.0, 3.0, 3.0]
t1_scores = t1_linear + t1_b  # -> [-1.5, -0.5, -0.5, 0.5, 1.5, 1.5]
t1_pred = (t1_scores >= 0.0).astype(int)  # -> [0, 0, 0, 1, 1, 1]
t1_accuracy = np.mean(t1_pred == t1_y)  # -> 1.0
print("seed:", 0)  # -> 0
print("X:", t1_X.tolist())  # -> 6 two-feature items
print("labels:", t1_y.tolist())  # -> [0, 0, 0, 1, 1, 1]
print("weights:", t1_w.tolist())  # -> [1.0, 1.0]
print("bias:", t1_b)  # -> -1.5
print("linear part X @ w:", t1_linear.tolist())  # -> [0.0, 1.0, 1.0, 2.0, 3.0, 3.0]
print("scores:", t1_scores.tolist())  # -> [-1.5, -0.5, -0.5, 0.5, 1.5, 1.5]
print("predictions:", t1_pred.tolist())  # -> [0, 0, 0, 1, 1, 1]
print("accuracy:", float(t1_accuracy))  # -> 1.0
assert np.array_equal(t1_pred, t1_y)

t1_x_line = np.linspace(-0.2, 2.2, 50)  # -> 50 boundary x-values
t1_y_line = -t1_x_line - t1_b  # -> decision boundary x0 + x1 - 1.5 = 0
plt.figure(figsize=(5, 4))
plt.scatter(t1_X[:, 0], t1_X[:, 1], c=t1_pred, cmap="coolwarm", s=120, edgecolor="black")
plt.plot(t1_x_line, t1_y_line, color="black", linestyle="--", label="score = 0")
plt.xlim(-0.2, 2.2)
plt.ylim(-0.2, 2.2)
plt.xlabel("feature 0")
plt.ylabel("feature 1")
plt.title("Toy 1: perceptron threshold")
plt.legend()
plt.show()
```
▶ What you'll see: six points split perfectly by the zero-score line, with negative scores labeled `0` and positive scores labeled `1`.

### ✍️ Toy 2 · Forward pass through one hidden layer

A forward pass applies matrix multiplication, bias addition, an activation, and a final sigmoid probability in order.

```python
import numpy as np
import matplotlib.pyplot as plt

t2_rng = np.random.default_rng(0)  # -> seeded generator for reproducibility
t2_X = np.array([[0.0, 0.0], [0.0, 1.0], [1.0, 0.0], [1.0, 1.0], [2.0, 1.0], [1.0, 2.0]])  # -> 6 two-feature items
t2_W1 = np.array([[0.6, -0.4, 0.2], [-0.3, 0.8, 0.5]])  # -> shape (2, 3)
t2_b1 = np.array([0.1, -0.2, 0.0])  # -> [0.1, -0.2, 0.0]
t2_W2 = np.array([[1.0], [-0.7], [0.4]])  # -> shape (3, 1)
t2_b2 = np.array([-0.1])  # -> [-0.1]
t2_z1 = t2_X @ t2_W1  # -> hidden linear part
t2_z1 = t2_z1 + t2_b1  # -> [[0.1, -0.2, 0.0], [-0.2, 0.6, 0.5], [0.7, -0.6, 0.2], [0.4, 0.2, 0.7], [1.0, -0.2, 0.9], [0.1, 1.0, 1.2]]
t2_a1 = np.maximum(0.0, t2_z1)  # -> ReLU hidden activations
t2_z2 = t2_a1 @ t2_W2  # -> output linear part
t2_z2 = t2_z2 + t2_b2  # -> [0.0, -0.32, 0.68, 0.44, 1.26, -0.22]
t2_yhat = 1.0 / (1.0 + np.exp(-t2_z2))  # -> [0.5, 0.421, 0.664, 0.608, 0.779, 0.445]
print("seed:", 0)  # -> 0
print("X:", t2_X.tolist())  # -> 6 two-feature items
print("W1 shape:", t2_W1.shape)  # -> (2, 3)
print("b1:", t2_b1.tolist())  # -> [0.1, -0.2, 0.0]
print("hidden scores z1:", np.round(t2_z1, 3).tolist())  # -> [[0.1, -0.2, 0.0], [-0.2, 0.6, 0.5], [0.7, -0.6, 0.2], [0.4, 0.2, 0.7], [1.0, -0.2, 0.9], [0.1, 1.0, 1.2]]
print("hidden activations a1:", np.round(t2_a1, 3).tolist())  # -> [[0.1, 0.0, 0.0], [0.0, 0.6, 0.5], [0.7, 0.0, 0.2], [0.4, 0.2, 0.7], [1.0, 0.0, 0.9], [0.1, 1.0, 1.2]]
print("W2 shape:", t2_W2.shape)  # -> (3, 1)
print("b2:", t2_b2.tolist())  # -> [-0.1]
print("output scores z2:", np.round(t2_z2.ravel(), 3).tolist())  # -> [0.0, -0.32, 0.68, 0.44, 1.26, -0.22]
print("sigmoid probabilities:", np.round(t2_yhat.ravel(), 3).tolist())  # -> [0.5, 0.421, 0.664, 0.608, 0.779, 0.445]
assert t2_yhat.shape == (6, 1)

plt.figure(figsize=(5, 3.5))
plt.imshow(t2_a1, cmap="Purples", aspect="auto")
plt.colorbar(label="ReLU activation")
plt.xticks([0, 1, 2], ["h1", "h2", "h3"])
plt.yticks(np.arange(6), [f"item {i}" for i in range(6)])
plt.title("Toy 2: hidden activations after ReLU")
plt.tight_layout()
plt.show()
```
▶ What you'll see: negative hidden scores become zero, then the output sigmoid turns six final scores into probabilities.

### ✍️ Toy 3 · Backpropagation chain for logistic loss

Backprop multiplies local derivatives, then averages those per-example derivatives into a weight gradient.

```python
import numpy as np
import matplotlib.pyplot as plt

t3_rng = np.random.default_rng(0)  # -> seeded generator for reproducibility
t3_X = np.array([[0.0, 0.0], [1.0, 0.0], [0.0, 1.0], [1.0, 1.0], [2.0, 1.0], [1.0, 2.0]])  # -> 6 two-feature items
t3_y = np.array([0.0, 0.0, 0.0, 1.0, 1.0, 1.0])  # -> [0, 0, 0, 1, 1, 1]
t3_w = np.array([0.2, -0.1])  # -> [0.2, -0.1]
t3_b = 0.0  # -> 0.0
t3_z = t3_X @ t3_w  # -> [0.0, 0.2, -0.1, 0.1, 0.3, 0.0]
t3_z = t3_z + t3_b  # -> [0.0, 0.2, -0.1, 0.1, 0.3, 0.0]
t3_yhat = 1.0 / (1.0 + np.exp(-t3_z))  # -> [0.5, 0.55, 0.475, 0.525, 0.574, 0.5]
t3_loss_terms = -(t3_y * np.log(t3_yhat) + (1.0 - t3_y) * np.log(1.0 - t3_yhat))  # -> [0.693, 0.798, 0.644, 0.644, 0.554, 0.693]
t3_loss = t3_loss_terms.mean()  # -> 0.671
t3_dL_dyhat = -(t3_y / t3_yhat) + ((1.0 - t3_y) / (1.0 - t3_yhat))  # -> [2.0, 2.221, 1.905, -1.905, -1.741, -2.0]
t3_dyhat_dz = t3_yhat * (1.0 - t3_yhat)  # -> [0.25, 0.248, 0.249, 0.249, 0.244, 0.25]
t3_n = t3_X.shape[0]  # -> 6
t3_chain_dz = t3_dL_dyhat * t3_dyhat_dz / t3_n  # -> [0.0833, 0.0916, 0.0792, -0.0792, -0.0709, -0.0833]
t3_grad_w = t3_X.T @ t3_chain_dz  # -> [-0.2127, -0.2376]
t3_grad_b = t3_chain_dz.sum()  # -> 0.0207
t3_eps = 1e-5  # -> 0.00001
t3_w_plus = t3_w.copy()  # -> [0.2, -0.1]
t3_w_plus[0] = t3_w_plus[0] + t3_eps  # -> 0.20001
t3_z_plus = t3_X @ t3_w_plus  # -> score after nudging w0
t3_z_plus = t3_z_plus + t3_b  # -> score after bias
t3_yhat_plus = 1.0 / (1.0 + np.exp(-t3_z_plus))  # -> probabilities after nudging w0
t3_loss_plus_terms = -(t3_y * np.log(t3_yhat_plus) + (1.0 - t3_y) * np.log(1.0 - t3_yhat_plus))  # -> losses after nudging w0
t3_loss_plus = t3_loss_plus_terms.mean()  # -> 0.671
t3_finite_diff = (t3_loss_plus - t3_loss) / t3_eps  # -> -0.2127
print("seed:", 0)  # -> 0
print("scores z:", np.round(t3_z, 3).tolist())  # -> [0.0, 0.2, -0.1, 0.1, 0.3, 0.0]
print("predictions yhat:", np.round(t3_yhat, 3).tolist())  # -> [0.5, 0.55, 0.475, 0.525, 0.574, 0.5]
print("loss terms:", np.round(t3_loss_terms, 3).tolist())  # -> [0.693, 0.798, 0.644, 0.644, 0.554, 0.693]
print("mean loss:", round(float(t3_loss), 3))  # -> 0.671
print("dL/dyhat:", np.round(t3_dL_dyhat, 3).tolist())  # -> [2.0, 2.221, 1.905, -1.905, -1.741, -2.0]
print("dyhat/dz:", np.round(t3_dyhat_dz, 3).tolist())  # -> [0.25, 0.248, 0.249, 0.249, 0.244, 0.25]
print("dL/dz averaged:", np.round(t3_chain_dz, 4).tolist())  # -> [0.0833, 0.0916, 0.0792, -0.0792, -0.0709, -0.0833]
print("grad_w:", np.round(t3_grad_w, 4).tolist())  # -> [-0.2127, -0.2376]
print("grad_b:", round(float(t3_grad_b), 4))  # -> 0.0207
print("finite diff dL/dw0:", round(float(t3_finite_diff), 4))  # -> -0.2127
assert np.isclose(t3_grad_w[0], t3_finite_diff, atol=1e-4)

plt.figure(figsize=(5, 3.5))
plt.bar(["dw0", "dw1", "db"], [t3_grad_w[0], t3_grad_w[1], t3_grad_b], color=["crimson", "slateblue", "seagreen"])
plt.axhline(0.0, color="black", linewidth=1)
plt.ylabel("gradient value")
plt.title("Toy 3: backprop gradients")
plt.show()
```
▶ What you'll see: the chain-rule gradient for `w0` matches the finite-difference check.

### ✍️ Toy 4 · Activation functions on shared scores

Different activation functions transform the same raw scores in different ways: probabilities, centered squashes, hard zeros, or leaky negatives.

```python
import numpy as np
import matplotlib.pyplot as plt

t4_rng = np.random.default_rng(0)  # -> seeded generator for reproducibility
t4_z = np.array([-3.0, -1.0, -0.2, 0.0, 0.2, 1.0, 3.0])  # -> 7 raw neuron scores
t4_sigmoid = 1.0 / (1.0 + np.exp(-t4_z))  # -> [0.047, 0.269, 0.45, 0.5, 0.55, 0.731, 0.953]
t4_tanh = np.tanh(t4_z)  # -> [-0.995, -0.762, -0.197, 0.0, 0.197, 0.762, 0.995]
t4_relu = np.maximum(0.0, t4_z)  # -> [0.0, 0.0, 0.0, 0.0, 0.2, 1.0, 3.0]
t4_leaky = np.maximum(0.1 * t4_z, t4_z)  # -> [-0.3, -0.1, -0.02, 0.0, 0.2, 1.0, 3.0]
print("seed:", 0)  # -> 0
print("scores z:", t4_z.tolist())  # -> [-3.0, -1.0, -0.2, 0.0, 0.2, 1.0, 3.0]
print("sigmoid:", np.round(t4_sigmoid, 3).tolist())  # -> [0.047, 0.269, 0.45, 0.5, 0.55, 0.731, 0.953]
print("tanh:", np.round(t4_tanh, 3).tolist())  # -> [-0.995, -0.762, -0.197, 0.0, 0.197, 0.762, 0.995]
print("ReLU:", np.round(t4_relu, 3).tolist())  # -> [0.0, 0.0, 0.0, 0.0, 0.2, 1.0, 3.0]
print("leaky ReLU:", np.round(t4_leaky, 3).tolist())  # -> [-0.3, -0.1, -0.02, 0.0, 0.2, 1.0, 3.0]
assert np.isclose(t4_sigmoid[3], 0.5)

plt.figure(figsize=(6, 3.5))
plt.plot(t4_z, t4_sigmoid, marker="o", label="sigmoid")
plt.plot(t4_z, t4_tanh, marker="o", label="tanh")
plt.plot(t4_z, t4_relu, marker="o", label="ReLU")
plt.plot(t4_z, t4_leaky, marker="o", label="leaky ReLU")
plt.axhline(0.0, color="gray", linestyle="--")
plt.xlabel("score z")
plt.ylabel("activation")
plt.title("Toy 4: activation functions")
plt.legend()
plt.show()
```
▶ What you'll see: sigmoid stays between 0 and 1, tanh stays between -1 and 1, and ReLU clips negative scores to zero.

### ✍️ Toy 5 · One gradient descent update

A gradient descent step subtracts a learning-rate-scaled gradient, then the same forward pass should produce a lower loss.

```python
import numpy as np
import matplotlib.pyplot as plt

t5_rng = np.random.default_rng(0)  # -> seeded generator for reproducibility
t5_X = np.array([[0.0, 0.0], [1.0, 0.0], [0.0, 1.0], [1.0, 1.0], [2.0, 1.0], [1.0, 2.0]])  # -> 6 two-feature items
t5_y = np.array([0.0, 0.0, 0.0, 1.0, 1.0, 1.0])  # -> [0, 0, 0, 1, 1, 1]
t5_w = np.array([0.0, 0.0])  # -> [0.0, 0.0]
t5_b = 0.0  # -> 0.0
t5_eta = 0.4  # -> 0.4
t5_z = t5_X @ t5_w  # -> [0.0, 0.0, 0.0, 0.0, 0.0, 0.0]
t5_z = t5_z + t5_b  # -> [0.0, 0.0, 0.0, 0.0, 0.0, 0.0]
t5_yhat = 1.0 / (1.0 + np.exp(-t5_z))  # -> [0.5, 0.5, 0.5, 0.5, 0.5, 0.5]
t5_loss_terms = -(t5_y * np.log(t5_yhat) + (1.0 - t5_y) * np.log(1.0 - t5_yhat))  # -> all 0.693
t5_loss = t5_loss_terms.mean()  # -> 0.693
t5_dz = (t5_yhat - t5_y) / t5_X.shape[0]  # -> [0.0833, 0.0833, 0.0833, -0.0833, -0.0833, -0.0833]
t5_grad_w = t5_X.T @ t5_dz  # -> [-0.25, -0.25]
t5_grad_b = t5_dz.sum()  # -> 0.0
t5_w_new = t5_w - t5_eta * t5_grad_w  # -> [0.1, 0.1]
t5_b_new = t5_b - t5_eta * t5_grad_b  # -> -0.0
t5_z_new = t5_X @ t5_w_new  # -> [0.0, 0.1, 0.1, 0.2, 0.3, 0.3]
t5_z_new = t5_z_new + t5_b_new  # -> [0.0, 0.1, 0.1, 0.2, 0.3, 0.3]
t5_yhat_new = 1.0 / (1.0 + np.exp(-t5_z_new))  # -> [0.5, 0.525, 0.525, 0.55, 0.574, 0.574]
t5_loss_new_terms = -(t5_y * np.log(t5_yhat_new) + (1.0 - t5_y) * np.log(1.0 - t5_yhat_new))  # -> loss terms after update
t5_loss_new = t5_loss_new_terms.mean()  # -> 0.648
print("seed:", 0)  # -> 0
print("old yhat:", np.round(t5_yhat, 3).tolist())  # -> [0.5, 0.5, 0.5, 0.5, 0.5, 0.5]
print("old loss:", round(float(t5_loss), 3))  # -> 0.693
print("dL/dz averaged:", np.round(t5_dz, 4).tolist())  # -> [0.0833, 0.0833, 0.0833, -0.0833, -0.0833, -0.0833]
print("grad_w:", np.round(t5_grad_w, 4).tolist())  # -> [-0.25, -0.25]
print("grad_b:", round(float(t5_grad_b), 4))  # -> 0.0
print("new weights:", np.round(t5_w_new, 3).tolist())  # -> [0.1, 0.1]
print("new bias:", round(float(t5_b_new), 3))  # -> -0.0
print("new yhat:", np.round(t5_yhat_new, 3).tolist())  # -> [0.5, 0.525, 0.525, 0.55, 0.574, 0.574]
print("new loss:", round(float(t5_loss_new), 3))  # -> 0.648
assert t5_loss_new < t5_loss

plt.figure(figsize=(4, 3.5))
plt.bar(["before", "after"], [t5_loss, t5_loss_new], color=["salmon", "seagreen"])
plt.ylabel("mean binary cross-entropy")
plt.title("Toy 5: one gradient step lowers loss")
plt.show()
```
▶ What you'll see: the gradient step changes weights from `[0.0, 0.0]` to `[0.1, 0.1]` and lowers the loss from `0.693` to `0.648`.

## 0. Step-by-Step Worked Example — Start Here (Beginner Friendly)

> 🧑‍🎓 **New to this topic? Start here.** This is a gentle, fully runnable walkthrough that
> builds up *every* idea in this lesson one tiny step at a time. Each step **prints** the
> numbers it computes and **draws a picture** so you can *see* what is happening. Run the
> cells in order from top to bottom. Nothing here needs the internet or any downloaded data.

### The Big Picture — What You'll Learn

In plain terms, here is what the steps below will show you:

- **Neurons, activations, MLP forward passes, and cross-entropy** build predictions from layered differentiable pieces.
- **Backpropagation and gradient descent** compute local slopes, check them, and use them to reduce loss.
- **CNNs, batch norm, and RNN/LSTM memory** show common deep-learning layer patterns beyond dense MLPs.
- **Value iteration and Q-learning** show reinforcement learning updates for state values and action values.

Everything below (starting at **§1 Overview**) develops these same ideas with fuller examples,
from-scratch training loops, CNN/RNN/RL demos, and an interactive MLP experiment.

**What we will build, step by step:**
1. **Neuron scores and activations** — affine evidence $w^Tx+b$ followed by sigmoid, tanh, ReLU, or leaky ReLU.
2. **MLP forward pass** — hidden layer scores, hidden activations, output score, and predicted probability.
3. **Binary cross-entropy loss** — a scalar penalty for probability predictions.
4. **Backpropagation** — chain-rule factors for one logistic neuron.
5. **Gradient descent** — repeated parameter updates that lower loss.
6. **CNN local filters and output size** — convolution arithmetic with $N=(W-F+2P)/S+1$.
7. **Batch normalization** — normalize a mini-batch, then rescale and shift.
8. **RNNs and LSTM gates** — reuse weights over time and gate memory.
9. **MDPs and value iteration** — Bellman backups for state values.
10. **Q-learning** — temporal-difference updates for action values.

### Step 0 — Set up our tools

We import NumPy (arrays + math) and Matplotlib (pictures). We fix a random **seed** so the
printed values are reproducible, then define a tiny `log()` helper so every line says what it is.

```python
import numpy as np                       # NumPy: vectors, matrices, gradients, convolutions, and tiny RL tables.
import matplotlib.pyplot as plt          # Matplotlib: draw activations, losses, filters, gates, and value tables.

np.random.seed(0)                         # Fix the seed so every run prints the SAME numbers.
plt.rcParams["figure.figsize"] = (7, 4)   # Use a comfortable default plot size.


def log(label, value):                    # A tiny logger so each printed line explains itself.
    print(f"[{label}] {value}")           # Format is: [what this is] the value.

log("setup", "tools ready — NumPy + Matplotlib imported, seed fixed to 0")
```
▶ What you'll see: one line confirming the tools are ready.

### Step 1 — Neuron scores and activations

A neuron first adds weighted input evidence, $z=w^Tx+b$. An activation then transforms that raw
score; sigmoid makes probabilities, tanh centers outputs, ReLU keeps positives, and leaky ReLU
keeps a small negative slope.

```python
def sigmoid_demo(z_demo):                                                     # Define a stable sigmoid helper used throughout this walkthrough.
    return 1.0 / (1.0 + np.exp(-np.clip(z_demo, -50.0, 50.0)))                 # Clip large scores so exponentials stay safe.

x_neuron_demo = np.array([1.2, -0.7, 0.5])                                     # One tiny three-feature input vector.
w_neuron_demo = np.array([0.8, -1.1, 0.4])                                     # One learnable weight per input feature.
b_neuron_demo = -0.2                                                           # One learnable bias/intercept.
parts_neuron_demo = w_neuron_demo * x_neuron_demo                              # Feature-by-feature contributions to the score.
z_neuron_demo = float(parts_neuron_demo.sum() + b_neuron_demo)                 # Affine score z = w^T x + b.
sigmoid_neuron_demo = float(sigmoid_demo(z_neuron_demo))                       # Sigmoid activation for probability-like output.
tanh_neuron_demo = float(np.tanh(z_neuron_demo))                               # Tanh activation for centered output.
relu_neuron_demo = float(np.maximum(0.0, z_neuron_demo))                       # ReLU activation keeps positive scores.
leaky_neuron_demo = float(np.maximum(0.05 * z_neuron_demo, z_neuron_demo))      # Leaky ReLU keeps a small negative slope.

log("feature contributions", np.round(parts_neuron_demo, 3))                  # Print each weighted input term.
log("bias", round(float(b_neuron_demo), 3))                                   # Print the bias term.
log("affine score z", round(z_neuron_demo, 3))                                # Print the raw neuron score.
log("sigmoid/tanh/ReLU/leaky", np.round([sigmoid_neuron_demo, tanh_neuron_demo, relu_neuron_demo, leaky_neuron_demo], 3))  # Print activations.

z_grid_demo = np.linspace(-6.0, 6.0, 300)                                      # Create scores for activation curves.
plt.plot(z_grid_demo, sigmoid_demo(z_grid_demo), label="sigmoid", linewidth=2) # Draw sigmoid curve.
plt.plot(z_grid_demo, np.tanh(z_grid_demo), label="tanh", linewidth=2)         # Draw tanh curve.
plt.plot(z_grid_demo, np.maximum(0.0, z_grid_demo), label="ReLU", linewidth=2) # Draw ReLU curve.
plt.plot(z_grid_demo, np.maximum(0.05 * z_grid_demo, z_grid_demo), label="leaky ReLU", linewidth=2)  # Draw leaky ReLU curve.
plt.scatter([z_neuron_demo], [sigmoid_neuron_demo], color="black", s=70, label="our sigmoid output")  # Mark our computed neuron.
plt.xlabel("affine score z")                                                   # Label score axis.
plt.ylabel("activation g(z)")                                                  # Label activation axis.
plt.title("One affine score can feed many activation functions")               # Title the activation plot.
plt.legend()                                                                   # Identify activation curves.
plt.show()                                                                     # Render the neuron visualization.
```
▶ What you'll see: the printed score is one number, but different activation curves transform it in different ways.

### Step 2 — MLP forward pass: layer by layer

A small MLP evaluates many neurons at once. The hidden layer computes $z_1=xW_1+b_1$, applies a
nonlinearity to get $a_1$, then the output neuron computes a score and sigmoid probability.

```python
x_mlp_demo = np.array([[0.6, -1.0]])                                           # One example stored as a 1-by-2 row.
W1_mlp_demo = np.array([[0.7, -0.4, 0.2], [-0.5, 0.9, 0.8]])                   # Input-to-hidden weights with shape 2-by-3.
b1_mlp_demo = np.array([[0.1, -0.2, 0.05]])                                    # One hidden bias per hidden unit.
W2_mlp_demo = np.array([[1.1], [-0.8], [0.6]])                                 # Hidden-to-output weights with shape 3-by-1.
b2_mlp_demo = np.array([[-0.1]])                                               # One output bias.
z1_mlp_demo = x_mlp_demo @ W1_mlp_demo + b1_mlp_demo                           # Hidden affine scores.
a1_mlp_demo = np.maximum(0.0, z1_mlp_demo)                                     # Hidden ReLU activations.
z2_mlp_demo = a1_mlp_demo @ W2_mlp_demo + b2_mlp_demo                          # Output affine score.
yhat_mlp_demo = sigmoid_demo(z2_mlp_demo)                                      # Output probability.

log("x shape", x_mlp_demo.shape)                                               # Print input shape.
log("W1 shape", W1_mlp_demo.shape)                                             # Print first weight-matrix shape.
log("hidden scores z1", np.round(z1_mlp_demo, 3))                              # Print hidden pre-activations.
log("hidden activations a1", np.round(a1_mlp_demo, 3))                         # Print hidden activations after ReLU.
log("output score z2", np.round(z2_mlp_demo, 3))                               # Print final score.
log("predicted probability", np.round(yhat_mlp_demo, 3))                       # Print final probability.

plt.bar(["h1", "h2", "h3"], a1_mlp_demo.ravel(), color="slateblue")          # Draw one bar per hidden unit.
plt.ylabel("ReLU activation")                                                  # Label activation magnitude.
plt.title("Hidden units become learned intermediate features")                 # Title the hidden-layer plot.
plt.ylim(0.0, max(1.0, float(a1_mlp_demo.max()) + 0.2))                         # Keep the y-axis readable.
plt.show()                                                                     # Render hidden activations.
```
▶ What you'll see: matrix shapes line up, negative hidden scores become zero, and the output sigmoid produces one probability.

### Step 3 — Binary cross-entropy loss: penalize probability mistakes

For binary labels, cross-entropy is $-[y\log(\hat y)+(1-y)\log(1-\hat y)]$. It gives small loss to
confident correct probabilities and very large loss to confident wrong probabilities.

```python
y_loss_demo = np.array([1.0, 0.0, 1.0, 0.0])                                  # Four binary labels.
yhat_loss_demo = np.array([0.92, 0.25, 0.40, 0.85])                            # Four predicted class-one probabilities.
p_loss_demo = np.clip(yhat_loss_demo, 1e-9, 1.0 - 1e-9)                        # Clip probabilities so logs are safe.
terms_loss_demo = -(y_loss_demo * np.log(p_loss_demo) + (1.0 - y_loss_demo) * np.log(1.0 - p_loss_demo))  # Per-example BCE terms.
mean_loss_demo = terms_loss_demo.mean()                                        # Average loss over the mini-batch.

log("labels", y_loss_demo.astype(int))                                         # Print true labels.
log("predicted probabilities", yhat_loss_demo)                                 # Print predictions.
log("per-example BCE", np.round(terms_loss_demo, 3))                           # Print each example's loss.
log("mean BCE", round(float(mean_loss_demo), 3))                               # Print the batch loss.

prob_grid_demo = np.linspace(0.001, 0.999, 300)                                # Safe probability grid for plotting.
plt.plot(prob_grid_demo, -np.log(prob_grid_demo), label="loss if y=1", linewidth=2)  # Draw positive-label loss.
plt.plot(prob_grid_demo, -np.log(1.0 - prob_grid_demo), label="loss if y=0", linewidth=2)  # Draw negative-label loss.
plt.scatter(yhat_loss_demo, terms_loss_demo, color="black", s=65, label="our examples")  # Mark the batch examples.
plt.ylim(0.0, 7.0)                                                             # Focus on the readable loss range.
plt.xlabel(r"predicted probability $\hat y$")                                 # Label probability axis.
plt.ylabel("binary cross-entropy")                                             # Label loss axis.
plt.title("Cross-entropy grows when confidence points the wrong way")          # Title the loss plot.
plt.legend()                                                                   # Identify curves and examples.
plt.show()                                                                     # Render the cross-entropy visualization.
```
▶ What you'll see: the wrong confident prediction near 0.85 for a true 0 has a tall loss marker.

### Step 4 — Backpropagation: multiply local chain-rule factors

Backpropagation reuses local derivatives. For one logistic neuron, changing a weight changes
$z$, changing $z$ changes $\hat y$, and changing $\hat y$ changes the loss, so the factors multiply.

```python
x_back_demo = np.array([1.5, -0.5])                                            # One two-feature training example.
y_back_demo = 1.0                                                              # Positive target label.
w_back_demo = np.array([0.4, -0.3])                                            # Current weights.
b_back_demo = 0.1                                                              # Current bias.
z_back_demo = float(w_back_demo @ x_back_demo + b_back_demo)                   # Affine score.
yhat_back_demo = float(sigmoid_demo(z_back_demo))                              # Sigmoid prediction.
loss_back_demo = -np.log(np.clip(yhat_back_demo, 1e-9, 1.0))                   # BCE loss for y=1.
dL_dyhat_demo = -y_back_demo / np.clip(yhat_back_demo, 1e-9, 1.0) + (1.0 - y_back_demo) / np.clip(1.0 - yhat_back_demo, 1e-9, 1.0)  # dL/dyhat.
dyhat_dz_demo = yhat_back_demo * (1.0 - yhat_back_demo)                        # Sigmoid derivative.
dz_dw_demo = x_back_demo.copy()                                                # dz/dw equals the input vector.
dL_dw_demo = dL_dyhat_demo * dyhat_dz_demo * dz_dw_demo                        # Chain-rule gradient for both weights.

eps_back_demo = 1e-5                                                           # Tiny finite-difference step.
w_plus_back_demo = w_back_demo.copy()                                          # Copy weights for a perturbation check.
w_plus_back_demo[0] = w_plus_back_demo[0] + eps_back_demo                      # Nudge the first weight upward.
yhat_plus_back_demo = float(sigmoid_demo(w_plus_back_demo @ x_back_demo + b_back_demo))  # Recompute prediction after the nudge.
loss_plus_back_demo = -np.log(np.clip(yhat_plus_back_demo, 1e-9, 1.0))          # Recompute loss after the nudge.
finite_diff_back_demo = (loss_plus_back_demo - loss_back_demo) / eps_back_demo # Numeric gradient estimate for weight 0.

log("z / yhat / loss", np.round([z_back_demo, yhat_back_demo, loss_back_demo], 3))  # Print forward values.
log("dL/dyhat", round(float(dL_dyhat_demo), 3))                               # Print loss-to-prediction derivative.
log("dyhat/dz", round(float(dyhat_dz_demo), 3))                               # Print sigmoid local derivative.
log("dz/dw", np.round(dz_dw_demo, 3))                                          # Print score-to-weight derivative.
log("dL/dw", np.round(dL_dw_demo, 3))                                          # Print final chain-rule gradient.
log("finite diff dL/dw0", round(float(finite_diff_back_demo), 5))              # Print numerical gradient check.

factor_names_demo = ["dL/dŷ", "dŷ/dz", "dz/dw0", "dL/dw0"]                  # Names for first-weight chain factors.
factor_values_demo = [float(dL_dyhat_demo), float(dyhat_dz_demo), float(dz_dw_demo[0]), float(dL_dw_demo[0])]  # Values for those factors.
plt.bar(factor_names_demo, factor_values_demo, color=["tab:red", "tab:green", "tab:blue", "tab:purple"])  # Draw derivative factors.
plt.axhline(0.0, color="black", linewidth=1.0)                                # Mark zero for sign interpretation.
plt.ylabel("value")                                                            # Label derivative value axis.
plt.title("Backprop is local derivatives multiplied together")                # Title the backprop plot.
plt.show()                                                                     # Render the chain-rule visualization.
```
▶ What you'll see: the analytic gradient for weight 0 matches the finite-difference check, confirming the chain rule.

### Step 5 — Gradient descent: update parameters downhill

The gradient points uphill in loss, so gradient descent subtracts it: $w\leftarrow w-\eta\nabla_wL$.
Repeating forward pass, loss, backprop, and update is the basic training loop.

```python
x_gd_demo = np.array([1.0, 2.0])                                               # One tiny training input.
y_gd_demo = 1.0                                                               # Positive target label.
w_gd_demo = np.array([-0.6, 0.2])                                             # Initial weights.
b_gd_demo = -0.1                                                              # Initial bias.
eta_gd_demo = 0.35                                                            # Learning rate.
losses_gd_demo = []                                                           # Store loss before each update.

for step_gd_demo in range(14):                                                 # Run several gradient-descent steps.
    z_gd_demo = float(w_gd_demo @ x_gd_demo + b_gd_demo)                       # Compute current score.
    yhat_gd_demo = float(sigmoid_demo(z_gd_demo))                              # Compute current probability.
    loss_gd_demo = -np.log(np.clip(yhat_gd_demo, 1e-9, 1.0))                   # Compute BCE for y=1.
    grad_w_gd_demo = (yhat_gd_demo - y_gd_demo) * x_gd_demo                    # Sigmoid+BCE weight gradient.
    grad_b_gd_demo = yhat_gd_demo - y_gd_demo                                  # Sigmoid+BCE bias gradient.
    losses_gd_demo.append(float(loss_gd_demo))                                 # Save current loss.
    if step_gd_demo in [0, 1, 13]:                                             # Log a few representative steps.
        log(f"step {step_gd_demo} yhat/loss", np.round([yhat_gd_demo, loss_gd_demo], 3))  # Print probability and loss.
    w_gd_demo = w_gd_demo - eta_gd_demo * grad_w_gd_demo                       # Update weights downhill.
    b_gd_demo = b_gd_demo - eta_gd_demo * grad_b_gd_demo                       # Update bias downhill.

log("final weights", np.round(w_gd_demo, 3))                                  # Print trained weights.
log("final bias", round(float(b_gd_demo), 3))                                 # Print trained bias.
log("loss trace", np.round(losses_gd_demo, 3))                                # Print all losses.

plt.plot(np.arange(len(losses_gd_demo)), losses_gd_demo, marker="o", color="darkorange", linewidth=2)  # Plot loss by update step.
plt.xlabel("gradient-descent step")                                           # Label step axis.
plt.ylabel("binary cross-entropy")                                            # Label loss axis.
plt.title("Repeated gradient updates lower the loss")                         # Title the update plot.
plt.show()                                                                     # Render the loss curve.
```
▶ What you'll see: the probability moves toward the positive label and the loss curve slopes downward.

### Step 6 — CNN local filters and output size

A convolutional filter reuses the same small weight patch at every spatial location. In one spatial
dimension, the output width is $N=(W-F+2P)/S+1$, where $W$ is input width, $F$ filter width,
$P$ padding, and $S$ stride.

```python
image_cnn_demo = np.zeros((6, 6))                                               # Create a tiny 6-by-6 image.
image_cnn_demo[:, 3:] = 1.0                                                     # Make the right half bright to create a vertical edge.
kernel_cnn_demo = np.array([[-1.0, 0.0, 1.0], [-1.0, 0.0, 1.0], [-1.0, 0.0, 1.0]])  # Vertical-edge filter.
W_cnn_demo = image_cnn_demo.shape[0]                                            # Input width W.
F_cnn_demo = kernel_cnn_demo.shape[0]                                           # Filter width F.
P_cnn_demo = 1                                                                  # Padding P.
S_cnn_demo = 1                                                                  # Stride S.
N_cnn_demo = int((W_cnn_demo - F_cnn_demo + 2 * P_cnn_demo) / S_cnn_demo + 1)   # Output width formula.
padded_cnn_demo = np.pad(image_cnn_demo, pad_width=P_cnn_demo, mode="constant")  # Zero-pad the image.
feature_cnn_demo = np.zeros((N_cnn_demo, N_cnn_demo))                           # Allocate the convolution feature map.

for row_cnn_demo in range(N_cnn_demo):                                          # Loop over output rows.
    for col_cnn_demo in range(N_cnn_demo):                                      # Loop over output columns.
        patch_cnn_demo = padded_cnn_demo[row_cnn_demo:row_cnn_demo + F_cnn_demo, col_cnn_demo:col_cnn_demo + F_cnn_demo]  # Extract one receptive field.
        feature_cnn_demo[row_cnn_demo, col_cnn_demo] = np.sum(patch_cnn_demo * kernel_cnn_demo)  # Multiply filter by patch and sum.

activated_cnn_demo = np.maximum(0.0, feature_cnn_demo)                          # Apply ReLU to keep positive edge evidence.
log("output width formula N", N_cnn_demo)                                      # Print formula result.
log("feature map shape", feature_cnn_demo.shape)                               # Print actual map shape.
log("example raw conv score", round(float(feature_cnn_demo[2, 3]), 3))          # Print one local weighted sum.

fig_cnn_demo, axes_cnn_demo = plt.subplots(1, 3, figsize=(10, 3.2))             # Create input/filter/feature panels.
axes_cnn_demo[0].imshow(image_cnn_demo, cmap="gray", vmin=0.0, vmax=1.0)       # Show the input image.
axes_cnn_demo[0].set_title("input image")                                      # Title input panel.
axes_cnn_demo[1].imshow(kernel_cnn_demo, cmap="coolwarm")                     # Show filter weights.
axes_cnn_demo[1].set_title("shared filter")                                    # Title filter panel.
axes_cnn_demo[2].imshow(activated_cnn_demo, cmap="magma")                     # Show activated feature map.
axes_cnn_demo[2].set_title("conv + ReLU map")                                  # Title feature panel.
for ax_cnn_demo in axes_cnn_demo:                                               # Clean image-style panels.
    ax_cnn_demo.set_xticks([])                                                  # Hide x ticks.
    ax_cnn_demo.set_yticks([])                                                  # Hide y ticks.
plt.tight_layout()                                                              # Prevent panel overlap.
plt.show()                                                                      # Render CNN arithmetic.
```
▶ What you'll see: the filter lights up near the vertical edge, and the output shape matches the formula.

### Step 7 — Batch normalization: normalize, then rescale and shift

Batch normalization computes mini-batch mean and variance, standardizes activations, then applies
learned scale $\gamma$ and shift $\beta$. This keeps layer inputs in a numerically friendly range
while preserving flexibility.

```python
batch_bn_demo = np.array([[2.0, 10.0], [4.0, 14.0], [6.0, 18.0], [8.0, 22.0]])  # Four examples with two features on different scales.
mu_bn_demo = batch_bn_demo.mean(axis=0)                                         # Batch mean per feature.
var_bn_demo = batch_bn_demo.var(axis=0)                                         # Batch variance per feature.
eps_bn_demo = 1e-5                                                              # Small constant for numerical stability.
gamma_bn_demo = np.array([1.5, 0.6])                                            # Learned scale parameters.
beta_bn_demo = np.array([-0.2, 0.3])                                            # Learned shift parameters.
standard_bn_demo = (batch_bn_demo - mu_bn_demo) / np.sqrt(var_bn_demo + eps_bn_demo)  # Normalize to mean 0 and variance 1.
out_bn_demo = gamma_bn_demo * standard_bn_demo + beta_bn_demo                   # Rescale and shift normalized values.

log("batch mean", np.round(mu_bn_demo, 3))                                      # Print batch means.
log("batch variance", np.round(var_bn_demo, 3))                                # Print batch variances.
log("normalized mean", np.round(standard_bn_demo.mean(axis=0), 6))             # Verify mean approximately 0.
log("normalized variance", np.round(standard_bn_demo.var(axis=0), 6))          # Verify variance approximately 1.
log("first BN output row", np.round(out_bn_demo[0], 3))                        # Print one transformed row.

fig_bn_demo, axes_bn_demo = plt.subplots(1, 2, figsize=(10, 3.6))               # Create before/after panels.
axes_bn_demo[0].plot(batch_bn_demo, marker="o")                                # Plot raw batch feature columns.
axes_bn_demo[0].set_title("raw batch activations")                              # Title raw panel.
axes_bn_demo[0].set_xlabel("example")                                           # Label example axis.
axes_bn_demo[0].set_ylabel("value")                                             # Label raw values.
axes_bn_demo[1].plot(out_bn_demo, marker="o")                                  # Plot batch-normalized outputs.
axes_bn_demo[1].set_title("after BN scale + shift")                             # Title BN panel.
axes_bn_demo[1].set_xlabel("example")                                           # Label example axis.
axes_bn_demo[1].set_ylabel("value")                                             # Label transformed values.
plt.tight_layout()                                                              # Keep panels readable.
plt.show()                                                                      # Render batch-normalization visualization.
```
▶ What you'll see: raw feature scales differ a lot, while normalized outputs are centered and controlled before the learned scale/shift.

### Step 8 — RNNs and LSTM gates: reuse weights and control memory

RNNs apply the same recurrence at every time step, so one set of weights processes a whole sequence.
LSTMs add gates: forget old cell state, write candidate memory, and expose part of the memory as hidden state.

```python
x_seq_demo = np.array([0.2, 0.8, -0.1, 0.5])[:, None]                          # A length-4 one-feature sequence.
Wx_rnn_demo = np.array([[0.7, -0.4]])                                           # Shared input-to-hidden weights.
Wh_rnn_demo = np.array([[0.5, 0.1], [-0.3, 0.4]])                               # Shared hidden-to-hidden weights.
b_rnn_demo = np.array([0.0, 0.1])                                               # Shared hidden bias.
h_rnn_demo = np.zeros(2)                                                        # Initial hidden state.
states_rnn_demo = []                                                            # Store hidden state at every time step.

for t_rnn_demo, x_t_demo in enumerate(x_seq_demo):                              # Unroll the same recurrence over time.
    h_rnn_demo = np.tanh(x_t_demo @ Wx_rnn_demo + h_rnn_demo @ Wh_rnn_demo + b_rnn_demo)  # Reuse weights to update hidden state.
    states_rnn_demo.append(h_rnn_demo.copy())                                   # Save the hidden state for plotting.
    log(f"RNN hidden at t={t_rnn_demo}", np.round(h_rnn_demo, 3))              # Print each hidden state.

states_rnn_demo = np.array(states_rnn_demo)                                     # Convert hidden trace to an array.
c_prev_lstm_demo = np.array([0.3, -0.2])                                        # Previous LSTM cell state.
forget_gate_demo = sigmoid_demo(np.array([1.0, -0.4]))                          # Forget gate: how much old memory to keep.
input_gate_demo = sigmoid_demo(np.array([0.2, 0.9]))                            # Input gate: how much candidate memory to write.
output_gate_demo = sigmoid_demo(np.array([0.7, -0.1]))                          # Output gate: how much cell state to reveal.
candidate_lstm_demo = np.tanh(np.array([0.5, -0.8]))                            # Candidate memory values.
c_new_lstm_demo = forget_gate_demo * c_prev_lstm_demo + input_gate_demo * candidate_lstm_demo  # New LSTM cell state.
h_new_lstm_demo = output_gate_demo * np.tanh(c_new_lstm_demo)                  # New LSTM hidden state.

log("forget/input/output gates", np.round([forget_gate_demo, input_gate_demo, output_gate_demo], 3))  # Print gate vectors.
log("candidate memory", np.round(candidate_lstm_demo, 3))                      # Print candidate memory.
log("new cell state", np.round(c_new_lstm_demo, 3))                            # Print updated cell state.
log("new hidden state", np.round(h_new_lstm_demo, 3))                          # Print gated hidden output.

fig_rnn_demo, axes_rnn_demo = plt.subplots(1, 2, figsize=(10, 3.6))             # Create RNN and LSTM panels.
axes_rnn_demo[0].plot(states_rnn_demo[:, 0], marker="o", label="hidden 1")    # Plot first hidden unit over time.
axes_rnn_demo[0].plot(states_rnn_demo[:, 1], marker="o", label="hidden 2")    # Plot second hidden unit over time.
axes_rnn_demo[0].set_title("RNN hidden state evolves over time")               # Title recurrent trace panel.
axes_rnn_demo[0].set_xlabel("time step")                                       # Label time axis.
axes_rnn_demo[0].legend()                                                       # Identify hidden units.
axes_rnn_demo[1].bar(["forget", "input", "output"], [forget_gate_demo.mean(), input_gate_demo.mean(), output_gate_demo.mean()], color=["gray", "steelblue", "darkorange"])  # Plot average gate strengths.
axes_rnn_demo[1].set_ylim(0.0, 1.0)                                             # Gates live between 0 and 1.
axes_rnn_demo[1].set_title("LSTM gates control memory flow")                   # Title gate panel.
plt.tight_layout()                                                              # Keep panels readable.
plt.show()                                                                      # Render sequence-memory visualization.
```
▶ What you'll see: RNN hidden units change at each time step, while LSTM gates choose how much memory to keep, write, and reveal.

### Step 9 — MDPs and value iteration: Bellman backups

A Markov Decision Process has states, actions, transitions, rewards, and a discount. Value iteration
repeatedly applies a Bellman backup: each state asks, "which action gives the best immediate reward
plus discounted next-state value?"

```python
states_vi_demo = np.array([0, 1, 2])                                            # Three states: start, middle, goal.
actions_vi_demo = np.array([0, 1])                                              # Two actions: 0=stay/left-ish, 1=move right-ish.
next_vi_demo = np.array([[0, 1], [0, 2], [2, 2]])                               # Deterministic next state for each state-action pair.
reward_vi_demo = np.array([[-0.04, -0.04], [-0.04, 1.0], [0.0, 0.0]])           # Step costs and reward for reaching the goal.
gamma_vi_demo = 0.9                                                             # Discount factor.
V_vi_demo = np.zeros(len(states_vi_demo))                                       # Start with zero value estimates.
history_vi_demo = []                                                            # Store value estimates after each sweep.

for sweep_vi_demo in range(6):                                                  # Run several synchronous Bellman sweeps.
    V_new_vi_demo = V_vi_demo.copy()                                            # Copy old values for a clean sweep.
    for state_vi_demo in [0, 1]:                                                # Update nonterminal states only.
        scores_vi_demo = reward_vi_demo[state_vi_demo] + gamma_vi_demo * V_vi_demo[next_vi_demo[state_vi_demo]]  # Bellman action scores.
        V_new_vi_demo[state_vi_demo] = np.max(scores_vi_demo)                   # Keep the best action score.
    V_new_vi_demo[2] = 0.0                                                       # Keep terminal goal value fixed at zero future value.
    V_vi_demo = V_new_vi_demo                                                   # Accept the sweep update.
    history_vi_demo.append(V_vi_demo.copy())                                    # Save values for plotting.
    log(f"value sweep {sweep_vi_demo + 1}", np.round(V_vi_demo, 3))            # Print values after this sweep.

history_vi_demo = np.array(history_vi_demo)                                     # Convert value history to an array.
plt.plot(history_vi_demo[:, 0], marker="o", label="V(start)")                 # Plot value propagation to the start state.
plt.plot(history_vi_demo[:, 1], marker="o", label="V(middle)")                # Plot value for the middle state.
plt.axhline(0.0, color="gray", linestyle="--", linewidth=1)                   # Mark terminal future value baseline.
plt.xlabel("Bellman sweep")                                                     # Label sweep axis.
plt.ylabel("state value")                                                       # Label value axis.
plt.title("Value iteration propagates reward backward")                        # Title value-iteration plot.
plt.legend()                                                                    # Identify states.
plt.show()                                                                      # Render Bellman backup visualization.
```
▶ What you'll see: the middle state's value jumps first because it can reach the goal, then the start state's value rises after more sweeps.

### Step 10 — Q-learning: update one state-action value from experience

Q-learning learns action values from sampled transitions. The update moves $Q(s,a)$ toward
$r+\gamma\max_{a'}Q(s',a')$, so it can learn without knowing the full transition table in advance.

```python
Q_q_demo = np.zeros((3, 2))                                                     # Initialize Q(s,a) for three states and two actions.
alpha_q_demo = 0.6                                                              # Learning rate for temporal-difference updates.
gamma_q_demo = 0.9                                                              # Discount factor.
experience_q_demo = [(0, 1), (1, 1), (0, 1), (1, 1), (0, 1), (1, 1)]            # Repeated sampled actions: move right from start, then right to goal.

for update_q_demo, (state_q_demo, action_q_demo) in enumerate(experience_q_demo, start=1):  # Process sampled transitions.
    next_state_q_demo = int(next_vi_demo[state_q_demo, action_q_demo])           # Look up next state for this toy experience.
    reward_q_demo = float(reward_vi_demo[state_q_demo, action_q_demo])           # Look up observed reward for this transition.
    future_q_demo = 0.0 if next_state_q_demo == 2 else gamma_q_demo * np.max(Q_q_demo[next_state_q_demo])  # Discounted future value.
    target_q_demo = reward_q_demo + future_q_demo                                # Q-learning target.
    td_error_q_demo = target_q_demo - Q_q_demo[state_q_demo, action_q_demo]      # Temporal-difference error.
    Q_q_demo[state_q_demo, action_q_demo] = Q_q_demo[state_q_demo, action_q_demo] + alpha_q_demo * td_error_q_demo  # Update Q(s,a).
    log(f"update {update_q_demo} target/error", np.round([target_q_demo, td_error_q_demo], 3))  # Print target and correction.

log("learned Q table", np.round(Q_q_demo, 3))                                  # Print final action-value table.
log("greedy actions", np.argmax(Q_q_demo, axis=1))                             # Print best action per state.

plt.imshow(Q_q_demo, cmap="viridis")                                           # Draw Q table as a heatmap.
plt.colorbar(label="Q(s,a)")                                                   # Add value scale.
plt.xticks([0, 1], ["action 0", "action 1"])                                  # Label action columns.
plt.yticks([0, 1, 2], ["start", "middle", "goal"])                           # Label state rows.
plt.title("Q-learning fills action values from experience")                    # Title Q-learning heatmap.
for state_plot_demo in range(Q_q_demo.shape[0]):                                # Loop over state rows for annotations.
    for action_plot_demo in range(Q_q_demo.shape[1]):                           # Loop over action columns for annotations.
        plt.text(action_plot_demo, state_plot_demo, f"{Q_q_demo[state_plot_demo, action_plot_demo]:.2f}", ha="center", va="center", color="white")  # Write Q value in each cell.
plt.show()                                                                      # Render action-value visualization.
```
▶ What you'll see: the action that reaches the goal gets high value, and that value backs up to the start action after repeated experience.

---

## 1. Overview

Deep learning stacks differentiable layers so models learn features and predictors together. In this lesson, one tiny network will learn a nonlinear decision boundary by repeating forward pass → loss → backpropagation → update.

**One-line intuition:** neural networks learn by composing many simple neurons, measuring the error, and pushing every weight in the direction that reduces that error.

## 2. Key Idea

A neuron first computes an affine score

$$
z_j^{[i]}=w_j^{[i]T}x+b_j^{[i]},
$$

then applies an activation $a_j^{[i]}=g(z_j^{[i]})$. Common activations are

$$
g(z)=\frac{1}{1+e^{-z}},\qquad g(z)=\frac{e^z-e^{-z}}{e^z+e^{-z}},\qquad g(z)=\max(0,z),\qquad g(z)=\max(\epsilon z,z).
$$

A small MLP composes these maps:

```text
Input x
Hidden scores: z1 = x W1 + b1
Hidden activations: a1 = tanh(z1) or ReLU(z1)
Output score: z2 = a1 W2 + b2
Probability: y_hat = sigmoid(z2)
```

For binary classification, cross-entropy is

$$
L(\hat y,y)=-\left[y\log(\hat y)+(1-y)\log(1-\hat y)\right].
$$

Backpropagation uses the chain rule:

$$
\frac{\partial L(z,y)}{\partial w}=\frac{\partial L(z,y)}{\partial a}\times\frac{\partial a}{\partial z}\times\frac{\partial z}{\partial w}.
$$

Gradient descent then updates weights by

$$
w\leftarrow w-\eta\frac{\partial L(z,y)}{\partial w}.
$$

```text
Initialize weights.
Repeat:
  Forward pass: compute predictions.
  Loss: compare predictions to labels.
  Backward pass: compute gradients by the chain rule.
  Update: subtract learning-rate-scaled gradients.
```

CNNs reuse local filters across space; the one-dimensional output size formula is

$$
N=\frac{W-F+2P}{S}+1.
$$

Batch normalization rescales a batch by

$$
x_i\leftarrow \gamma\frac{x_i-\mu_B}{\sqrt{\sigma_B^2+\epsilon}}+\beta.
$$

RNNs reuse weights over time; LSTMs add input, forget, output, and candidate gates so memory can persist. Reinforcement learning uses an MDP $(S,A,\{P_{sa}\},\gamma,R)$, value iteration applies

$$
V_{i+1}(s)=R(s)+\max_{a\in A}\left[\sum_{s'\in S}\gamma P_{sa}(s')V_i(s')\right],
$$

and Q-learning applies

$$
Q(s,a)\leftarrow Q(s,a)+\alpha\left[R(s,a,s')+\gamma\max_{a'}Q(s',a')-Q(s,a)\right].
$$

## 3. Hands-on Notebook

### Setup

Run this first. The install line is commented because Colab normally includes these packages; uncomment it only if a dependency is missing.

```python
# !pip -q install numpy matplotlib scikit-learn ipywidgets  # install the required scientific packages only when the runtime is missing them.
import numpy as np  # use NumPy for arrays, gradients, and simulations.
import matplotlib.pyplot as plt  # use Matplotlib for curves, decision boundaries, heatmaps, and images.
from sklearn.datasets import make_moons, make_circles, make_blobs, make_classification, load_digits  # load synthetic and built-in datasets without network access.
from sklearn.model_selection import train_test_split  # split examples into train and validation sets.
from sklearn.preprocessing import StandardScaler  # standardize features so optimization is stable.
from sklearn.metrics import accuracy_score, confusion_matrix  # evaluate classification results and mistakes.
try:  # try to enable live Colab widgets.
    from ipywidgets import interact, FloatSlider, IntSlider, Dropdown  # import widget controls for the experiment section.
except ModuleNotFoundError:  # keep the notebook runnable if widgets are unavailable.
    class _FallbackWidget:  # define a small replacement widget class.
        def __init__(self, value=None, **kwargs):  # accept the same style of arguments as ipywidgets.
            self.value = value  # store the default value for fallback execution.
    FloatSlider = _FallbackWidget  # replace FloatSlider with the fallback holder.
    IntSlider = _FallbackWidget  # replace IntSlider with the fallback holder.
    Dropdown = _FallbackWidget  # replace Dropdown with the fallback holder.
    def interact(function, **controls):  # define a fallback interact function.
        values = {name: control.value for name, control in controls.items()}  # collect default control values.
        return function(**values)  # run the function once with defaults.
np.random.seed(229)  # seed older NumPy randomness for reproducibility.
RNG = np.random.default_rng(229)  # create a modern reproducible random generator.
plt.style.use("seaborn-v0_8-whitegrid")  # use a readable plotting style.
EPS = 1e-9  # define a tiny constant for numerical stability.

def sigmoid(z):  # define the sigmoid activation.
    return 1.0 / (1.0 + np.exp(-np.clip(z, -50.0, 50.0)))  # clip inputs so exponentials do not overflow.

def relu(z):  # define the ReLU activation.
    return np.maximum(0.0, z)  # keep positive values and zero negative values.

def relu_grad(z):  # define the ReLU derivative.
    return (z > 0.0).astype(float)  # return one for active units and zero for inactive units.

def bce(y_hat, y):  # define binary cross-entropy.
    p = np.clip(y_hat, EPS, 1.0 - EPS)  # clip probabilities away from zero and one.
    return float(-np.mean(y * np.log(p) + (1.0 - y) * np.log(1.0 - p)))  # average the per-example loss.

def one_hot(y, classes):  # convert integer labels into one-hot rows.
    Y = np.zeros((len(y), classes))  # allocate the target matrix.
    Y[np.arange(len(y)), y.astype(int)] = 1.0  # place one in the correct class column.
    return Y  # return one-hot labels.

def softmax(logits):  # convert multiclass scores into probabilities.
    shifted = logits - logits.max(axis=1, keepdims=True)  # subtract row maxima for stability.
    exp_scores = np.exp(shifted)  # exponentiate shifted scores.
    return exp_scores / exp_scores.sum(axis=1, keepdims=True)  # normalize each row.

def make_xor(n=360, noise=0.16, seed=229):  # generate a noisy XOR dataset.
    rng = np.random.default_rng(seed)  # create a local random generator.
    X = rng.uniform(-1.25, 1.25, size=(n, 2))  # sample points in a square.
    y = ((X[:, 0] * X[:, 1]) > 0.0).astype(int)  # label opposite diagonal quadrants as class one.
    X = X + rng.normal(0.0, noise, size=X.shape)  # add Gaussian noise to make the task realistic.
    return X, y  # return features and labels.

def standardize(X):  # standardize a feature matrix.
    scaler = StandardScaler()  # create a scaler object.
    return scaler.fit_transform(X), scaler  # fit the scaler and return transformed data plus scaler.

def load_deep_data(source="moons", seed=229):  # load one of the swappable 2-D datasets.
    if source == "moons":  # choose interleaving moons.
        X, y = make_moons(n_samples=360, noise=0.16, random_state=seed)  # generate noisy moons.
        desc = "two noisy interleaving moons"  # describe the source.
    elif source == "circles":  # choose concentric circles.
        X, y = make_circles(n_samples=360, noise=0.08, factor=0.42, random_state=seed)  # generate rings.
        desc = "concentric circles"  # describe the source.
    elif source == "blobs":  # choose two Gaussian blobs.
        X, y = make_blobs(n_samples=360, centers=2, cluster_std=1.35, random_state=seed)  # generate blobs.
        desc = "two Gaussian blobs"  # describe the source.
    elif source == "xor":  # choose noisy XOR quadrants.
        X, y = make_xor(n=360, noise=0.16, seed=seed)  # generate XOR.
        desc = "noisy XOR quadrants"  # describe the source.
    else:  # reject unsupported names.
        raise ValueError("DATA_SOURCE must be 'moons', 'circles', 'blobs', or 'xor'.")  # explain valid options.
    X_scaled, scaler = standardize(X)  # standardize features for gradient descent.
    return X_scaled, y.astype(int), scaler, desc  # return a consistent data bundle.

def plot_binary_data(X, y, title="", ax=None):  # plot a two-class 2-D dataset.
    ax = plt.gca() if ax is None else ax  # choose the current axes when none are supplied.
    ax.scatter(X[:, 0], X[:, 1], c=y, cmap="coolwarm", s=38, edgecolor="white", linewidth=0.5, alpha=0.9)  # draw points colored by class.
    ax.set_title(title)  # set the title.
    ax.set_xlabel("feature 1")  # label the x-axis.
    ax.set_ylabel("feature 2")  # label the y-axis.
    return ax  # return axes for reuse.

def plot_boundary(predict_fn, X, y, title="", ax=None):  # plot class-one probability and decision boundary.
    ax = plt.gca() if ax is None else ax  # choose the current axes when needed.
    x_min, x_max = X[:, 0].min() - 0.7, X[:, 0].max() + 0.7  # set horizontal grid bounds.
    y_min, y_max = X[:, 1].min() - 0.7, X[:, 1].max() + 0.7  # set vertical grid bounds.
    xx, yy = np.meshgrid(np.linspace(x_min, x_max, 170), np.linspace(y_min, y_max, 170))  # create a dense grid.
    grid = np.c_[xx.ravel(), yy.ravel()]  # flatten grid points into rows.
    probs = predict_fn(grid).reshape(xx.shape)  # evaluate probabilities on the grid.
    ax.contourf(xx, yy, probs, levels=np.linspace(0.0, 1.0, 21), cmap="coolwarm", alpha=0.35)  # paint probability regions.
    ax.contour(xx, yy, probs, levels=[0.5], colors="black", linewidths=2.0)  # draw the 0.5 boundary.
    ax.scatter(X[:, 0], X[:, 1], c=y, cmap="coolwarm", s=30, edgecolor="white", linewidth=0.45)  # overlay examples.
    ax.set_title(title)  # set the title.
    ax.set_xlabel("feature 1")  # label the x-axis.
    ax.set_ylabel("feature 2")  # label the y-axis.
    return ax  # return axes.

def init_mlp(n_features, hidden, seed=229):  # initialize a one-hidden-layer binary MLP.
    rng = np.random.default_rng(seed)  # create a local generator.
    params = {}  # create a parameter dictionary.
    params["W1"] = rng.normal(0.0, np.sqrt(2.0 / n_features), size=(n_features, hidden))  # initialize first-layer weights.
    params["b1"] = np.zeros((1, hidden))  # initialize first-layer biases.
    params["W2"] = rng.normal(0.0, np.sqrt(2.0 / hidden), size=(hidden, 1))  # initialize output weights.
    params["b2"] = np.zeros((1, 1))  # initialize output bias.
    return params  # return trainable parameters.

def mlp_forward(X, params):  # compute one MLP forward pass.
    z1 = X @ params["W1"] + params["b1"]  # compute hidden affine scores.
    a1 = np.tanh(z1)  # apply tanh hidden activation.
    z2 = a1 @ params["W2"] + params["b2"]  # compute output affine score.
    y_hat = sigmoid(z2)  # convert output score to probability.
    cache = {"X": X, "z1": z1, "a1": a1, "z2": z2, "y_hat": y_hat}  # cache values for backprop.
    return y_hat, cache  # return probabilities and cache.

def mlp_backward(y, params, cache):  # compute MLP gradients by backpropagation.
    m = len(y)  # count examples for averaging.
    y_col = y.reshape(-1, 1)  # reshape labels into a column.
    dz2 = (cache["y_hat"] - y_col) / m  # combine sigmoid and BCE derivative.
    dW2 = cache["a1"].T @ dz2  # compute output-weight gradients.
    db2 = dz2.sum(axis=0, keepdims=True)  # compute output-bias gradient.
    da1 = dz2 @ params["W2"].T  # propagate error to hidden activations.
    dz1 = da1 * (1.0 - cache["a1"] ** 2)  # apply tanh derivative.
    dW1 = cache["X"].T @ dz1  # compute first-layer weight gradients.
    db1 = dz1.sum(axis=0, keepdims=True)  # compute first-layer bias gradients.
    return {"W1": dW1, "b1": db1, "W2": dW2, "b2": db2}  # return gradients.

def apply_update(params, grads, lr):  # apply one gradient-descent update.
    for key in params:  # loop over all parameters.
        params[key] = params[key] - lr * grads[key]  # subtract the scaled gradient.
    return params  # return updated parameters.

def train_mlp(X, y, hidden=8, lr=0.08, epochs=600, seed=229, snapshots=None):  # train a one-hidden-layer MLP.
    params = init_mlp(X.shape[1], hidden, seed=seed)  # initialize parameters.
    losses = []  # store loss values.
    accs = []  # store accuracy values.
    saved = {}  # store requested parameter snapshots.
    snapshot_set = set([] if snapshots is None else snapshots)  # prepare snapshot lookup.
    for epoch in range(epochs + 1):  # include epoch zero for an untrained baseline.
        y_hat, cache = mlp_forward(X, params)  # run the forward pass.
        losses.append(bce(y_hat.ravel(), y))  # record binary cross-entropy.
        accs.append(accuracy_score(y, (y_hat.ravel() >= 0.5).astype(int)))  # record threshold accuracy.
        if epoch in snapshot_set:  # save selected epochs.
            saved[epoch] = {key: value.copy() for key, value in params.items()}  # deep-copy parameter arrays.
        if epoch < epochs:  # skip the update after the final logged epoch.
            grads = mlp_backward(y, params, cache)  # compute gradients.
            params = apply_update(params, grads, lr)  # update parameters.
    return params, np.array(losses), np.array(accs), saved  # return model and diagnostics.

def train_logistic(X, y, lr=0.15, epochs=500):  # train a single logistic neuron.
    w = np.zeros(X.shape[1])  # initialize weights at zero.
    b = 0.0  # initialize bias at zero.
    losses = []  # store cross-entropy values.
    for epoch in range(epochs):  # repeat gradient descent.
        p = sigmoid(X @ w + b)  # compute probabilities.
        losses.append(bce(p, y))  # record current loss.
        error = p - y  # compute prediction error.
        w = w - lr * (X.T @ error / len(y))  # update weights.
        b = b - lr * float(np.mean(error))  # update bias.
    return w, b, np.array(losses)  # return learned parameters and loss trace.

def conv2d(image, kernel, padding=0, stride=1):  # compute a single-filter 2-D convolution/correlation.
    padded = np.pad(image, pad_width=padding, mode="constant")  # add zero padding.
    out_rows = (padded.shape[0] - kernel.shape[0]) // stride + 1  # compute output row count.
    out_cols = (padded.shape[1] - kernel.shape[1]) // stride + 1  # compute output column count.
    output = np.zeros((out_rows, out_cols))  # allocate feature map.
    for row in range(out_rows):  # loop over output rows.
        for col in range(out_cols):  # loop over output columns.
            patch = padded[row * stride:row * stride + kernel.shape[0], col * stride:col * stride + kernel.shape[1]]  # extract receptive field.
            output[row, col] = np.sum(patch * kernel)  # multiply by filter and sum.
    return output  # return feature map.

def max_pool2d(feature_map, pool=2, stride=2):  # apply max pooling.
    out_rows = (feature_map.shape[0] - pool) // stride + 1  # compute pooled row count.
    out_cols = (feature_map.shape[1] - pool) // stride + 1  # compute pooled column count.
    pooled = np.zeros((out_rows, out_cols))  # allocate pooled output.
    for row in range(out_rows):  # loop over pooled rows.
        for col in range(out_cols):  # loop over pooled columns.
            patch = feature_map[row * stride:row * stride + pool, col * stride:col * stride + pool]  # extract pooling window.
            pooled[row, col] = patch.max()  # keep the maximum activation.
    return pooled  # return pooled map.
```

### Data — swappable sources

`DATA_SOURCE` can be `moons`, `circles`, `blobs`, or `xor`. The non-linearly-separable choices show why hidden layers matter.

```python
DATA_SOURCE = "moons"  # choose one source: "moons", "circles", "blobs", or "xor".
X_data, y_data, data_scaler, data_desc = load_deep_data(DATA_SOURCE, seed=229)  # load and scale the selected dataset.
print(f"Loaded {data_desc} with shape {X_data.shape}.")  # report the dataset shape.
print("Class counts:", np.bincount(y_data))  # report class balance.
print("Feature means:", np.round(X_data.mean(axis=0), 3))  # show standardized means.
print("Feature standard deviations:", np.round(X_data.std(axis=0), 3))  # show standardized scales.
```

```python
plt.figure(figsize=(6.5, 5.2))  # create the raw-data figure.
plot_binary_data(X_data, y_data, title=f"Data source: {data_desc}")  # visualize the selected data.
plt.show()  # render the plot.
```

▶ What you'll see: `blobs` is close to linearly separable, while `moons`, `circles`, and `xor` require nonlinear boundaries.


### 📖 Concept walkthrough — build each idea from scratch

Before the warm-up examples, we build the deep-learning Key Idea from scratch, one small step at a time. Everything here uses only NumPy + Matplotlib and tiny inline data, so every affine score, activation, loss, gradient factor, and update is inspectable. Variables carry a `_w` suffix so they never collide with the examples below.

```python
import numpy as np  # NumPy gives us vectors, matrix multiplies, stable logs, and reproducible tiny arrays.
import matplotlib.pyplot as plt  # Matplotlib lets us see activations, hidden units, losses, gradients, and training progress.
np.random.seed(229)  # fix the seed so every printed value and plot in this walkthrough is reproducible.
```

#### 1. The neuron: affine score plus activation

A neuron first compresses an input vector into one affine score, $z=w^\top x+b$, then applies a nonlinear activation such as $\sigma(z)=\frac{1}{1+e^{-z}}$ or $\max(0,z)$. We build one unit by hand because the split matters: the affine part learns a weighted direction, while the activation lets stacked neurons bend decision boundaries instead of staying linear.

```python
x_neuron_w = np.array([1.2, -0.7, 0.5])  # choose one tiny three-feature input vector.
w_neuron_w = np.array([0.8, -1.1, 0.4])  # choose one learnable weight per input feature.
b_neuron_w = -0.2  # choose one learnable bias that shifts the score.
parts_neuron_w = w_neuron_w * x_neuron_w  # compute each feature's contribution before adding them.
z_neuron_w = float(np.sum(parts_neuron_w) + b_neuron_w)  # compute z=w^T x+b as one scalar score.
print("feature contributions:", np.round(parts_neuron_w, 3))  # inspect how each input pushes the neuron.
print("bias:", round(b_neuron_w, 3))  # inspect the intercept term.
print("affine score z:", round(z_neuron_w, 3))  # inspect the raw pre-activation score.
```
▶ What you'll see: each feature contributes a signed amount, then the bias shifts the final score.

```python
sigmoid_neuron_w = 1.0 / (1.0 + np.exp(-z_neuron_w))  # squash the score into a probability-like value between 0 and 1.
relu_neuron_w = np.maximum(0.0, z_neuron_w)  # keep positive scores and zero out negative scores.
print("sigmoid activation:", round(sigmoid_neuron_w, 3))  # inspect the smooth probability-style activation.
print("ReLU activation:", round(relu_neuron_w, 3))  # inspect the piecewise-linear activation.
```
▶ What you'll see: the same affine score becomes different activations depending on the chosen nonlinearity.

```python
z_grid_neuron_w = np.linspace(-6.0, 6.0, 300)  # create input scores for plotting activation shapes.
sigmoid_grid_neuron_w = 1.0 / (1.0 + np.exp(-z_grid_neuron_w))  # evaluate sigmoid on the score grid.
relu_grid_neuron_w = np.maximum(0.0, z_grid_neuron_w)  # evaluate ReLU on the score grid.
plt.figure(figsize=(5.8, 3.8))  # create a compact activation figure.
plt.plot(z_grid_neuron_w, sigmoid_grid_neuron_w, label=r"$\sigma(z)$", lw=2)  # draw the sigmoid curve.
plt.plot(z_grid_neuron_w, relu_grid_neuron_w, label="ReLU(z)", lw=2)  # draw the ReLU curve.
plt.scatter([z_neuron_w], [sigmoid_neuron_w], c="black", s=60, zorder=3, label="our sigmoid output")  # mark the hand-computed neuron.
plt.xlabel("affine score z")  # label the horizontal axis.
plt.ylabel("activation")  # label the vertical axis.
plt.legend(loc="best")  # show which curve is which.
plt.title("1: neuron activation curves")  # title the subsection figure.
plt.show()  # render the activation plot.
```
▶ What you'll see: sigmoid smoothly saturates between 0 and 1, while ReLU is flat for negative scores and linear for positive scores.

*Why it's done this way: separating $w^\top x+b$ from the activation makes the learnable linear evidence visible before the nonlinearity transforms it. Deep networks repeat this simple unit many times so small learned scores become flexible functions.*

#### 2. A layer and forward pass through a small net

A layer is several neurons evaluated side by side: $z^{[1]}=xW^{[1]}+b^{[1]}$, then $a^{[1]}=g(z^{[1]})$. A tiny two-layer network uses hidden ReLU units to create intermediate features, then an output sigmoid unit to turn those features into $\hat y$. We use one example so every matrix shape and intermediate value can be printed.

```python
x_forward_w = np.array([[0.6, -1.0]])  # store one example as a 1x2 row so matrix products keep batch shape.
W1_forward_w = np.array([[0.7, -0.4, 0.2], [-0.5, 0.9, 0.8]])  # create input-to-hidden weights with shape 2x3.
b1_forward_w = np.array([[0.1, -0.2, 0.05]])  # create one bias for each of the three hidden neurons.
W2_forward_w = np.array([[1.1], [-0.8], [0.6]])  # create hidden-to-output weights with shape 3x1.
b2_forward_w = np.array([[-0.1]])  # create one output bias.
print("x shape:", x_forward_w.shape)  # inspect the input batch shape.
print("W1 shape:", W1_forward_w.shape)  # inspect the first weight matrix shape.
print("W2 shape:", W2_forward_w.shape)  # inspect the second weight matrix shape.
```
▶ What you'll see: the shapes line up as input $1\times2$, hidden weights $2\times3$, and output weights $3\times1$.

```python
z1_forward_w = x_forward_w @ W1_forward_w + b1_forward_w  # compute hidden affine scores for all three hidden units.
a1_forward_w = np.maximum(0.0, z1_forward_w)  # apply ReLU to create hidden activations.
print("hidden scores z1:", np.round(z1_forward_w, 3))  # inspect the pre-activation hidden values.
print("hidden activations a1:", np.round(a1_forward_w, 3))  # inspect which hidden units are active after ReLU.
```
▶ What you'll see: negative hidden scores become zero, while positive scores pass through unchanged.

```python
z2_forward_w = a1_forward_w @ W2_forward_w + b2_forward_w  # combine hidden activations into one output score.
yhat_forward_w = 1.0 / (1.0 + np.exp(-z2_forward_w))  # apply sigmoid to convert the score into a probability.
print("output score z2:", np.round(z2_forward_w, 3))  # inspect the final affine score.
print("predicted probability y_hat:", np.round(yhat_forward_w, 3))  # inspect the network prediction.
```
▶ What you'll see: the hidden features feed one output neuron that returns a class-one probability.

```python
plt.figure(figsize=(5.6, 3.6))  # create a hidden-activation bar chart.
plt.bar(["h1", "h2", "h3"], a1_forward_w.ravel(), color="slateblue")  # draw one bar per hidden neuron.
plt.ylabel("ReLU activation")  # label the activation magnitude axis.
plt.ylim(0.0, max(1.0, float(a1_forward_w.max()) + 0.2))  # keep the vertical range readable.
plt.title("2: hidden activations in a tiny net")  # title the subsection figure.
plt.show()  # render the hidden-layer plot.
```
▶ What you'll see: only hidden units with positive scores send signal forward to the output unit.

*Why it's done this way: writing the forward pass as matrix products evaluates all neurons in a layer at once, which is both readable and fast. The hidden activations are useful because later layers learn from these transformed features rather than from raw inputs alone.*

#### 3. Loss functions: measuring prediction error

A loss turns predictions into one scalar training objective. Mean squared error measures squared distance, binary cross-entropy measures the negative log-likelihood of a Bernoulli label, and softmax cross-entropy does the same for multiclass probabilities. We compute all three because deep learning is mostly "choose a differentiable loss, then reduce it by gradients."

```python
y_reg_loss_w = np.array([2.0, -1.0, 0.5])  # choose tiny regression targets.
yhat_reg_loss_w = np.array([1.6, -0.4, 0.8])  # choose tiny regression predictions.
mse_loss_w = np.mean((yhat_reg_loss_w - y_reg_loss_w) ** 2)  # compute mean squared error.
print("squared errors:", np.round((yhat_reg_loss_w - y_reg_loss_w) ** 2, 3))  # inspect each regression penalty.
print("MSE:", round(float(mse_loss_w), 3))  # inspect the average squared penalty.
```
▶ What you'll see: larger regression misses contribute quadratically more to the average loss.

```python
y_bin_loss_w = np.array([1.0, 0.0, 1.0])  # choose three binary labels.
yhat_bin_loss_w = np.array([0.9, 0.2, 0.4])  # choose three predicted class-one probabilities.
p_bin_loss_w = np.clip(yhat_bin_loss_w, 1e-9, 1.0 - 1e-9)  # guard log(0) by clipping probabilities safely.
bce_terms_loss_w = -(y_bin_loss_w * np.log(p_bin_loss_w) + (1.0 - y_bin_loss_w) * np.log(1.0 - p_bin_loss_w))  # compute each binary cross-entropy term.
bce_loss_w = np.mean(bce_terms_loss_w)  # average the binary cross-entropy terms.
print("BCE terms:", np.round(bce_terms_loss_w, 3))  # inspect which binary examples are costly.
print("BCE:", round(float(bce_loss_w), 3))  # inspect the average binary classification loss.
```
▶ What you'll see: a correct confident probability has small loss, while a weak or wrong probability costs more.

```python
logits_loss_w = np.array([[2.0, 0.5, -1.0]])  # choose one row of three class scores.
y_class_loss_w = 0  # choose the correct class index.
shifted_loss_w = logits_loss_w - logits_loss_w.max(axis=1, keepdims=True)  # subtract the max for stable exponentials.
exp_loss_w = np.exp(shifted_loss_w)  # exponentiate shifted logits.
softmax_loss_w = exp_loss_w / exp_loss_w.sum(axis=1, keepdims=True)  # normalize scores into class probabilities.
sce_loss_w = -np.log(np.clip(softmax_loss_w[0, y_class_loss_w], 1e-9, 1.0))  # compute softmax cross-entropy for the correct class.
print("softmax probabilities:", np.round(softmax_loss_w, 3))  # inspect the multiclass probability distribution.
print("softmax cross-entropy:", round(float(sce_loss_w), 3))  # inspect the negative log probability of the true class.
```
▶ What you'll see: the loss is small when the true class receives high softmax probability.

```python
prob_grid_loss_w = np.linspace(0.001, 0.999, 300)  # create candidate probabilities while avoiding exact 0 and 1.
ce_true1_loss_w = -np.log(prob_grid_loss_w)  # compute BCE when the true label is 1.
ce_true0_loss_w = -np.log(1.0 - prob_grid_loss_w)  # compute BCE when the true label is 0.
plt.figure(figsize=(5.8, 3.8))  # create a cross-entropy curve figure.
plt.plot(prob_grid_loss_w, ce_true1_loss_w, label="true y=1", lw=2)  # draw loss for positive labels.
plt.plot(prob_grid_loss_w, ce_true0_loss_w, label="true y=0", lw=2)  # draw loss for negative labels.
plt.ylim(0.0, 7.0)  # focus on the interpretable part of the steep curve.
plt.xlabel(r"predicted probability $\hat y$")  # label the probability axis.
plt.ylabel("cross-entropy loss")  # label the loss axis.
plt.legend(loc="best")  # show which curve belongs to which label.
plt.title("3: cross-entropy punishes confident-wrong")  # title the subsection figure.
plt.show()  # render the cross-entropy plot.
```
▶ What you'll see: cross-entropy explodes when the model is very confident in the wrong class.

*Why it's done this way: losses translate prediction quality into one number that optimization can minimize. Cross-entropy is especially useful for classification because it rewards calibrated probabilities and strongly penalizes confident wrong answers.*

#### 4. Backpropagation: chain-rule gradients through one logistic neuron

Backpropagation is organized chain rule. For one logistic neuron with $\hat y=\sigma(z)$ and $z=w^\top x+b$, the weight gradient factors as

$$
\frac{\partial L}{\partial w}=\frac{\partial L}{\partial \hat y}\frac{\partial \hat y}{\partial z}\frac{\partial z}{\partial w}.
$$

We compute each local derivative because backprop works by reusing these local pieces layer after layer.

```python
x_backprop_w = np.array([1.5, -0.5])  # choose one two-feature training example.
y_backprop_w = 1.0  # choose the binary target label.
w_backprop_w = np.array([0.4, -0.3])  # choose current neuron weights.
b_backprop_w = 0.1  # choose the current bias.
z_backprop_w = float(w_backprop_w @ x_backprop_w + b_backprop_w)  # compute the affine score.
yhat_backprop_w = 1.0 / (1.0 + np.exp(-z_backprop_w))  # compute the sigmoid prediction.
loss_backprop_w = -(y_backprop_w * np.log(np.clip(yhat_backprop_w, 1e-9, 1.0)) + (1.0 - y_backprop_w) * np.log(np.clip(1.0 - yhat_backprop_w, 1e-9, 1.0)))  # compute binary cross-entropy safely.
print("z:", round(z_backprop_w, 3))  # inspect the pre-activation score.
print("y_hat:", round(float(yhat_backprop_w), 3))  # inspect the predicted probability.
print("loss:", round(float(loss_backprop_w), 3))  # inspect the scalar objective value.
```
▶ What you'll see: the neuron predicts a probability, then binary cross-entropy turns it into a loss.

```python
dL_dyhat_backprop_w = -y_backprop_w / np.clip(yhat_backprop_w, 1e-9, 1.0) + (1.0 - y_backprop_w) / np.clip(1.0 - yhat_backprop_w, 1e-9, 1.0)  # compute dL/dy_hat for BCE.
dyhat_dz_backprop_w = yhat_backprop_w * (1.0 - yhat_backprop_w)  # compute d sigmoid(z)/dz.
dz_dw_backprop_w = x_backprop_w.copy()  # compute dz/dw, which equals the input vector.
dL_dw_backprop_w = dL_dyhat_backprop_w * dyhat_dz_backprop_w * dz_dw_backprop_w  # multiply local derivatives by the chain rule.
print("dL/dy_hat:", round(float(dL_dyhat_backprop_w), 3))  # inspect the loss sensitivity to the prediction.
print("dy_hat/dz:", round(float(dyhat_dz_backprop_w), 3))  # inspect the sigmoid local slope.
print("dz/dw:", np.round(dz_dw_backprop_w, 3))  # inspect how each weight changes z.
print("dL/dw:", np.round(dL_dw_backprop_w, 3))  # inspect the final weight gradient.
```
The chain rule composes local derivatives because a small change in $w$ first changes $z$, that change alters $\hat y$, and that altered prediction changes $L$. Multiplying the local rates gives the total rate from the parameter to the loss.
▶ What you'll see: each printed factor has a clear local meaning, and their product is the gradient for each weight.

```python
eps_backprop_w = 1e-5  # choose a tiny finite-difference step.
w_plus_backprop_w = w_backprop_w.copy()  # copy weights for a positive perturbation.
w_plus_backprop_w[0] = w_plus_backprop_w[0] + eps_backprop_w  # nudge the first weight upward.
z_plus_backprop_w = float(w_plus_backprop_w @ x_backprop_w + b_backprop_w)  # recompute the perturbed score.
yhat_plus_backprop_w = 1.0 / (1.0 + np.exp(-z_plus_backprop_w))  # recompute the perturbed prediction.
loss_plus_backprop_w = -np.log(np.clip(yhat_plus_backprop_w, 1e-9, 1.0))  # compute the perturbed loss for y=1.
finite_diff_backprop_w = (loss_plus_backprop_w - loss_backprop_w) / eps_backprop_w  # estimate the first gradient numerically.
print("analytic dL/dw0:", round(float(dL_dw_backprop_w[0]), 5))  # print the chain-rule gradient for weight zero.
print("finite-diff dL/dw0:", round(float(finite_diff_backprop_w), 5))  # print the numerical check for weight zero.
```
▶ What you'll see: the finite-difference estimate closely matches the chain-rule derivative.

```python
factor_names_backprop_w = ["dL/dŷ", "dŷ/dz", "dz/dw0", "dL/dw0"]  # name the scalar factors for the first weight.
factor_values_backprop_w = [float(dL_dyhat_backprop_w), float(dyhat_dz_backprop_w), float(dz_dw_backprop_w[0]), float(dL_dw_backprop_w[0])]  # collect the factor values.
plt.figure(figsize=(6.0, 3.8))  # create a derivative-factor figure.
plt.bar(factor_names_backprop_w, factor_values_backprop_w, color=["tab:red", "tab:green", "tab:blue", "tab:purple"])  # draw one bar per derivative piece.
plt.axhline(0.0, color="black", linewidth=1.0)  # mark the zero-gradient baseline.
plt.ylabel("value")  # label the value axis.
plt.title("4: chain-rule derivative factors")  # title the subsection figure.
plt.show()  # render the derivative plot.
```
▶ What you'll see: the final gradient inherits its sign and scale from the local derivative factors.

*Why it's done this way: backprop avoids re-deriving a whole network derivative from scratch by caching forward values and multiplying local derivatives backward. That makes gradients for many layers systematic, efficient, and inspectable.*

#### 5. Gradient-descent update: move parameters downhill

Once backprop gives a gradient, gradient descent applies $w\leftarrow w-\eta\frac{\partial L}{\partial w}$. The minus sign matters: the gradient points uphill, so subtracting a learning-rate-scaled gradient nudges the parameter toward lower loss. We train one logistic neuron for a few steps to watch that happen numerically and visually.

```python
x_update_w = np.array([1.0, 2.0])  # choose one small input vector.
y_update_w = 1.0  # choose a positive target label.
w_update_w = np.array([-0.6, 0.2])  # start with weights that are not yet ideal.
b_update_w = -0.1  # start with a bias that is not yet ideal.
eta_update_w = 0.35  # choose a modest learning rate.
z_update_w = float(w_update_w @ x_update_w + b_update_w)  # compute the current affine score.
yhat_update_w = 1.0 / (1.0 + np.exp(-z_update_w))  # compute the current probability.
loss_update_w = -np.log(np.clip(yhat_update_w, 1e-9, 1.0))  # compute BCE for y=1 with log safety.
grad_w_update_w = (yhat_update_w - y_update_w) * x_update_w  # compute the sigmoid+BCE weight gradient.
grad_b_update_w = yhat_update_w - y_update_w  # compute the sigmoid+BCE bias gradient.
print("before update w:", np.round(w_update_w, 3), "b:", round(b_update_w, 3), "loss:", round(float(loss_update_w), 3))  # inspect the starting point.
print("gradient w:", np.round(grad_w_update_w, 3), "gradient b:", round(float(grad_b_update_w), 3))  # inspect the downhill information.
```
▶ What you'll see: the gradient reports how each parameter should change to reduce the current loss.

```python
w_one_update_w = w_update_w - eta_update_w * grad_w_update_w  # apply one weight update w <- w - eta*dL/dw.
b_one_update_w = b_update_w - eta_update_w * grad_b_update_w  # apply one bias update b <- b - eta*dL/db.
z_one_update_w = float(w_one_update_w @ x_update_w + b_one_update_w)  # recompute the score after one update.
yhat_one_update_w = 1.0 / (1.0 + np.exp(-z_one_update_w))  # recompute the probability after one update.
loss_one_update_w = -np.log(np.clip(yhat_one_update_w, 1e-9, 1.0))  # recompute BCE after one update.
print("after one update w:", np.round(w_one_update_w, 3), "b:", round(float(b_one_update_w), 3))  # inspect the changed parameters.
print("loss after one update:", round(float(loss_one_update_w), 3))  # inspect whether the loss dropped.
```
▶ What you'll see: the prediction moves toward the target class and the loss decreases after one update.

```python
w_loop_update_w = w_update_w.copy()  # reset weights to the original starting point.
b_loop_update_w = float(b_update_w)  # reset bias to the original starting point.
losses_update_w = []  # collect loss values over repeated updates.
for step_update_w in range(12):  # run a dozen simple gradient-descent steps.
    z_loop_update_w = float(w_loop_update_w @ x_update_w + b_loop_update_w)  # compute the current score.
    yhat_loop_update_w = 1.0 / (1.0 + np.exp(-z_loop_update_w))  # compute the current probability.
    loss_loop_update_w = -np.log(np.clip(yhat_loop_update_w, 1e-9, 1.0))  # compute the current BCE loss.
    losses_update_w.append(float(loss_loop_update_w))  # store the current loss before updating.
    grad_w_loop_update_w = (yhat_loop_update_w - y_update_w) * x_update_w  # compute the current weight gradient.
    grad_b_loop_update_w = yhat_loop_update_w - y_update_w  # compute the current bias gradient.
    w_loop_update_w = w_loop_update_w - eta_update_w * grad_w_loop_update_w  # update weights downhill.
    b_loop_update_w = b_loop_update_w - eta_update_w * grad_b_loop_update_w  # update bias downhill.
print("losses:", np.round(losses_update_w, 3))  # inspect the loss trace across steps.
print("final w:", np.round(w_loop_update_w, 3), "final b:", round(float(b_loop_update_w), 3))  # inspect the final parameters.
```
▶ What you'll see: each update usually makes the single-example loss smaller than before.

```python
plt.figure(figsize=(5.8, 3.8))  # create a training-progress figure.
plt.plot(range(len(losses_update_w)), losses_update_w, marker="o", lw=2, color="darkorange")  # draw loss versus update step.
plt.xlabel("gradient-descent step")  # label the horizontal axis.
plt.ylabel("binary cross-entropy")  # label the loss axis.
plt.title("5: gradient descent lowers loss")  # title the subsection figure.
plt.show()  # render the loss-decrease plot.
```
▶ What you'll see: the loss curve slopes downward as repeated updates move the neuron toward the target.

*Why it's done this way: each update uses the local slope to make a small, controlled downhill move instead of guessing new parameters. Repeating forward pass, loss, backprop, and update is the core training loop for deep networks of any size.*

### 🟢 Basics (warm-up)

#### B1. Compute one neuron's affine score $w^Tx+b$

```python
x_b1 = np.array([1.5, -0.7])  # choose one input vector.
w_b1 = np.array([0.8, -1.2])  # choose one weight per feature.
b_b1 = 0.3  # choose one scalar bias.
parts_b1 = w_b1 * x_b1  # compute feature-wise contributions.
z_b1 = float(np.dot(w_b1, x_b1) + b_b1)  # compute the affine score.
print("weighted inputs:", np.round(parts_b1, 3))  # print feature contributions.
print("bias:", b_b1)  # print the bias term.
print("z = w^T x + b:", round(z_b1, 3))  # print the final score.
```

```python
plt.figure(figsize=(6, 4))  # create a contribution plot.
plt.bar(["w1*x1", "w2*x2", "b"], [parts_b1[0], parts_b1[1], b_b1], color=["steelblue", "darkorange", "gray"])  # show additive terms.
plt.axhline(0.0, color="black", linewidth=1.0)  # mark zero contribution.
plt.title(f"B1: additive terms sum to z={z_b1:.2f}")  # title the plot.
plt.ylabel("contribution")  # label the vertical axis.
plt.show()  # render the plot.
```

▶ What you'll see: the bar heights add to the printed affine score.

👀 **Takeaway.** A neuron begins with a linear score before any activation is applied.

#### B2. Apply one activation to one scalar

```python
z_b2 = -1.4  # choose one scalar score.
print("sigmoid:", round(float(sigmoid(z_b2)), 3))  # print sigmoid activation.
print("tanh:", round(float(np.tanh(z_b2)), 3))  # print tanh activation.
print("ReLU:", round(float(relu(z_b2)), 3))  # print ReLU activation.
print("Leaky ReLU:", round(float(np.maximum(0.05 * z_b2, z_b2)), 3))  # print leaky ReLU activation.
```

```python
z_grid_b2 = np.linspace(-5.0, 5.0, 400)  # create a grid of scores.
plt.figure(figsize=(7, 5))  # create activation curve figure.
plt.plot(z_grid_b2, sigmoid(z_grid_b2), label="sigmoid")  # plot sigmoid.
plt.plot(z_grid_b2, np.tanh(z_grid_b2), label="tanh")  # plot tanh.
plt.plot(z_grid_b2, relu(z_grid_b2), label="ReLU")  # plot ReLU.
plt.scatter([z_b2], [sigmoid(z_b2)], color="black", s=80, label="chosen z on sigmoid")  # mark the chosen score.
plt.title("B2: one score through activation functions")  # title the plot.
plt.xlabel("z")  # label score axis.
plt.ylabel("g(z)")  # label activation axis.
plt.legend()  # show curve labels.
plt.show()  # render the plot.
```

▶ What you'll see: the same scalar is squashed, centered, or zeroed depending on the activation.

👀 **Takeaway.** Activations inject nonlinearity into networks.

#### B3. Compute binary cross-entropy for one prediction

```python
y_b3 = 1.0  # choose a positive true label.
y_hat_b3 = 0.23  # choose an underconfident positive-class prediction.
loss_b3 = -(y_b3 * np.log(y_hat_b3) + (1.0 - y_b3) * np.log(1.0 - y_hat_b3))  # compute one-example BCE.
print("y:", y_b3)  # print true label.
print("y_hat:", y_hat_b3)  # print predicted probability.
print("loss:", round(float(loss_b3), 3))  # print binary cross-entropy.
```

```python
p_grid_b3 = np.linspace(0.01, 0.99, 300)  # create a safe probability grid.
plt.figure(figsize=(7, 5))  # create loss curve figure.
plt.plot(p_grid_b3, -np.log(p_grid_b3), label="loss if y=1")  # plot positive-label loss.
plt.plot(p_grid_b3, -np.log(1.0 - p_grid_b3), label="loss if y=0")  # plot negative-label loss.
plt.scatter([y_hat_b3], [loss_b3], color="black", s=90, label="chosen prediction")  # mark the selected prediction.
plt.title("B3: binary cross-entropy loss curve")  # title the plot.
plt.xlabel("predicted probability of class 1")  # label x-axis.
plt.ylabel("loss")  # label y-axis.
plt.legend()  # show labels.
plt.show()  # render the plot.
```

▶ What you'll see: the chosen point is high on the $y=1$ curve because $0.23$ assigns too little probability to the true class.

👀 **Takeaway.** Cross-entropy rewards confident correct probabilities and punishes confident wrong probabilities.


#### B4. Apply ReLU and sigmoid to a vector

Goal: transform several scores element by element.

```python
z_b4 = np.array([-2.0, -0.5, 0.0, 1.5, 3.0])  # choose a small vector of neuron scores.
relu_b4 = relu(z_b4)  # apply ReLU element by element.
sigmoid_b4 = sigmoid(z_b4)  # apply sigmoid element by element.
print("z:", z_b4)  # print original scores.
print("ReLU(z):", relu_b4)  # print ReLU activations.
print("sigmoid(z):", np.round(sigmoid_b4, 3))  # print sigmoid activations.
```

```python
plt.figure(figsize=(6, 3.6))  # create a compact activation comparison.
plt.plot(z_b4, relu_b4, marker="o", label="ReLU")  # show ReLU outputs.
plt.plot(z_b4, sigmoid_b4, marker="o", label="sigmoid")  # show sigmoid outputs.
plt.title("B4: vector activations")  # title the plot.
plt.xlabel("z")  # label input score axis.
plt.ylabel("activation")  # label output axis.
plt.legend()  # identify activations.
plt.show()  # render the comparison.
```

▶ What you'll see: ReLU clips negatives to zero while sigmoid squashes all scores into $(0,1)$.

👀 **Takeaway.** Activations are applied element by element across a layer's score vector.

#### B5. Compute MSE loss for three predictions

Goal: average squared prediction errors.

```python
y_true_b5 = np.array([1.0, 0.0, 1.0])  # store three target values.
y_pred_b5 = np.array([0.8, 0.3, 0.4])  # store three model predictions.
squared_errors_b5 = (y_pred_b5 - y_true_b5) ** 2  # compute one squared error per example.
mse_b5 = squared_errors_b5.mean()  # average squared errors to get MSE.
print("squared errors:", np.round(squared_errors_b5, 3))  # print per-example losses.
print("MSE:", round(float(mse_b5), 3))  # print mean squared error.
```

```python
plt.figure(figsize=(5.5, 3.6))  # create a loss contribution chart.
plt.bar(np.arange(len(squared_errors_b5)), squared_errors_b5, color="steelblue")  # show each squared error.
plt.title(f"B5: MSE = {mse_b5:.3f}")  # title with average loss.
plt.xlabel("example")  # label example axis.
plt.ylabel("squared error")  # label loss axis.
plt.show()  # render loss contributions.
```

▶ What you'll see: the largest miss contributes the tallest squared-error bar.

👀 **Takeaway.** MSE is a simple average of squared prediction mistakes.

#### B6. Softmax three logits

Goal: convert three class scores into probabilities that sum to one.

```python
logits_b6 = np.array([[1.2, 0.4, -0.7]])  # store one row of three class logits.
probs_b6 = softmax(logits_b6)[0]  # apply the stable softmax helper and unwrap the row.
print("logits:", logits_b6[0])  # print raw scores.
print("softmax probabilities:", np.round(probs_b6, 3))  # print class probabilities.
print("sum:", round(float(probs_b6.sum()), 3))  # verify probabilities sum to one.
```

```python
plt.figure(figsize=(5.4, 3.6))  # create a probability bar chart.
plt.bar([0, 1, 2], probs_b6, color=["steelblue", "darkorange", "gray"])  # show one probability per class.
plt.title("B6: softmax class probabilities")  # title the plot.
plt.xlabel("class")  # label class axis.
plt.ylabel("probability")  # label probability axis.
plt.show()  # render the distribution.
```

▶ What you'll see: the largest logit gets the largest probability, but all probabilities sum to one.

👀 **Takeaway.** Softmax turns multiclass scores into a probability distribution.

#### B7. One-hot encode one label

Goal: represent one integer class as a target vector.

```python
label_b7 = 2  # choose one integer class label.
num_classes_b7 = 4  # choose the total number of classes.
one_hot_b7 = np.zeros(num_classes_b7)  # start with zeros for every class.
one_hot_b7[label_b7] = 1.0  # place one at the correct class index.
print("label:", label_b7)  # print the class index.
print("one-hot vector:", one_hot_b7)  # print the target vector.
```

```python
plt.figure(figsize=(5.4, 3.2))  # create a target-vector plot.
plt.bar(np.arange(num_classes_b7), one_hot_b7, color="steelblue")  # show the active class entry.
plt.title("B7: one-hot target")  # title the plot.
plt.xlabel("class")  # label class axis.
plt.ylabel("target value")  # label target axis.
plt.show()  # render the one-hot vector.
```

▶ What you'll see: exactly one class position is 1 and all others are 0.

👀 **Takeaway.** One-hot targets let multiclass losses compare a probability vector to the true class.

#### B8. Derivative of sigmoid at one score

Goal: compute the local slope $\sigma(z)(1-\sigma(z))$.

```python
z_b8 = 0.7  # choose one sigmoid input score.
s_b8 = float(sigmoid(z_b8))  # compute sigmoid activation.
derivative_b8 = s_b8 * (1.0 - s_b8)  # compute sigmoid derivative from its output.
print("z:", z_b8)  # print the input score.
print("sigmoid(z):", round(s_b8, 3))  # print the activation.
print("sigmoid derivative:", round(derivative_b8, 3))  # print the local slope.
```

```python
z_grid_b8 = np.linspace(-6.0, 6.0, 400)  # create a score grid.
s_grid_b8 = sigmoid(z_grid_b8)  # compute sigmoid values.
plt.figure(figsize=(6, 4))  # create a derivative plot.
plt.plot(z_grid_b8, s_grid_b8 * (1.0 - s_grid_b8), label="sigmoid derivative")  # draw derivative curve.
plt.scatter([z_b8], [derivative_b8], color="black", s=80, label="chosen z")  # mark the chosen score.
plt.title("B8: sigmoid derivative")  # title the plot.
plt.xlabel("z")  # label score axis.
plt.ylabel("slope")  # label derivative axis.
plt.legend()  # show marker label.
plt.show()  # render the local slope.
```

▶ What you'll see: sigmoid has its largest slope near zero and smaller slopes far from zero.

👀 **Takeaway.** Backpropagation needs activation derivatives to pass gradients through nonlinearities.

#### B9. Count parameters in one dense layer

Goal: count weights and biases in a tiny fully connected layer.

```python
input_dim_b9 = 3  # choose three input features.
output_dim_b9 = 4  # choose four output neurons.
weight_count_b9 = input_dim_b9 * output_dim_b9  # count one weight for every input-output pair.
bias_count_b9 = output_dim_b9  # count one bias per output neuron.
total_params_b9 = weight_count_b9 + bias_count_b9  # add weights and biases.
print("weights:", weight_count_b9)  # print number of weights.
print("biases:", bias_count_b9)  # print number of biases.
print("total parameters:", total_params_b9)  # print full layer parameter count.
```

```python
plt.figure(figsize=(5.4, 3.4))  # create a parameter-count chart.
plt.bar(["weights", "biases"], [weight_count_b9, bias_count_b9], color=["steelblue", "gray"])  # compare parameter types.
plt.title("B9: dense-layer parameters")  # title the plot.
plt.ylabel("count")  # label count axis.
plt.show()  # render the count chart.
```

▶ What you'll see: most parameters are weights, plus one bias per output unit.

👀 **Takeaway.** Dense layers scale as inputs times outputs, then add biases.

#### B10. One gradient-descent weight update

Goal: subtract a learning-rate-scaled gradient from one weight.

```python
w_b10 = 0.8  # store the current weight.
grad_b10 = 0.25  # store the gradient of loss with respect to that weight.
learning_rate_b10 = 0.1  # choose a small learning rate.
new_w_b10 = w_b10 - learning_rate_b10 * grad_b10  # apply the gradient descent update.
print("old weight:", w_b10)  # print starting weight.
print("gradient:", grad_b10)  # print local slope of loss.
print("new weight:", round(float(new_w_b10), 3))  # print updated weight.
```

```python
plt.figure(figsize=(5.4, 3.2))  # create a before/after plot.
plt.plot([0, 1], [w_b10, new_w_b10], marker="o", color="steelblue")  # connect old and new weights.
plt.xticks([0, 1], ["before", "after"])  # label update states.
plt.ylabel("weight value")  # label weight axis.
plt.title("B10: one gradient-descent update")  # title the plot.
plt.show()  # render the update.
```

▶ What you'll see: a positive gradient makes the weight decrease by $\eta$ times the gradient.

👀 **Takeaway.** Learning is repeated tiny parameter updates in the direction that lowers loss.

### 🟡 Easy Examples

#### E1. Tiny neuron: forward pass and activation shapes

**Goal.** Use one logistic neuron on linearly separable data and visualize its score heatmap.  
**Data source.** `linearly_separable_2d`.  
**We'll build this in 5 steps:** create data, choose weights, compute probabilities, plot the boundary, and inspect score distributions.

```python
X_e1, y_e1 = make_classification(n_samples=260, n_features=2, n_redundant=0, n_informative=2, n_clusters_per_class=1, class_sep=1.7, random_state=229)  # create a two-feature linear task.
X_e1, scaler_e1 = standardize(X_e1)  # scale features.
w_e1 = np.array([1.7, -1.2])  # choose hand-built weights.
b_e1 = -0.05  # choose a bias.
z_e1 = X_e1 @ w_e1 + b_e1  # compute affine scores.
p_e1 = sigmoid(z_e1)  # convert scores to probabilities.
acc_e1 = accuracy_score(y_e1, (p_e1 >= 0.5).astype(int))  # compute hand-built neuron accuracy.
print("first scores:", np.round(z_e1[:5], 3))  # show the first scores.
print("first probabilities:", np.round(p_e1[:5], 3))  # show the first probabilities.
print("accuracy:", round(acc_e1, 3))  # show accuracy.
```

```python
plt.figure(figsize=(6.8, 5.4))  # create boundary figure.
plot_boundary(lambda grid: sigmoid(grid @ w_e1 + b_e1), X_e1, y_e1, title=f"E1: one-neuron boundary, accuracy={acc_e1:.2f}")  # plot probability heatmap.
plt.show()  # render the figure.
```

▶ What you'll see: one straight black line separates the two classes.

```python
plt.figure(figsize=(7, 4.5))  # create score histogram figure.
plt.hist(z_e1[y_e1 == 0], bins=25, alpha=0.7, label="class 0")  # plot scores for class zero.
plt.hist(z_e1[y_e1 == 1], bins=25, alpha=0.7, label="class 1")  # plot scores for class one.
plt.axvline(0.0, color="black", linestyle="--", label="score 0")  # mark decision threshold.
plt.title("E1 final: score distributions by class")  # title the plot.
plt.xlabel("z = w^T x + b")  # label x-axis.
plt.ylabel("count")  # label y-axis.
plt.legend()  # show labels.
plt.show()  # render histogram.
```

▶ What you'll see: the class histograms mostly fall on different sides of zero.

👀 **Takeaway.** A single logistic neuron is powerful when a straight line is enough.

#### E2. From-scratch logistic neuron with gradient descent

**Goal.** Implement forward pass, loss, gradient, and update for a single logistic neuron.  
**Data source.** `make_classification`.  
**We'll build this in 6 steps:** initialize, compute initial loss, compute gradients, train, plot loss, and show the decision boundary.

```python
X_e2, y_e2 = make_classification(n_samples=320, n_features=2, n_redundant=0, n_informative=2, n_clusters_per_class=1, class_sep=1.35, flip_y=0.03, random_state=230)  # create a noisy linear dataset.
X_e2, scaler_e2 = standardize(X_e2)  # standardize features.
w0_e2 = np.zeros(2)  # initialize weights at zero.
b0_e2 = 0.0  # initialize bias at zero.
p0_e2 = sigmoid(X_e2 @ w0_e2 + b0_e2)  # compute initial probabilities.
print("initial loss:", round(bce(p0_e2, y_e2), 3))  # print initial loss.
print("initial mean probability:", round(float(p0_e2.mean()), 3))  # print mean probability.
```

```python
err0_e2 = p0_e2 - y_e2  # compute initial probability errors.
grad_w0_e2 = X_e2.T @ err0_e2 / len(y_e2)  # compute initial weight gradient.
grad_b0_e2 = float(np.mean(err0_e2))  # compute initial bias gradient.
print("initial grad_w:", np.round(grad_w0_e2, 4))  # print weight gradient.
print("initial grad_b:", round(grad_b0_e2, 4))  # print bias gradient.
```

```python
w_e2, b_e2, losses_e2 = train_logistic(X_e2, y_e2, lr=0.18, epochs=600)  # train the logistic neuron.
p_e2 = sigmoid(X_e2 @ w_e2 + b_e2)  # compute final probabilities.
acc_e2 = accuracy_score(y_e2, (p_e2 >= 0.5).astype(int))  # compute final accuracy.
print("learned weights:", np.round(w_e2, 3))  # print learned weights.
print("learned bias:", round(float(b_e2), 3))  # print learned bias.
print("final accuracy:", round(acc_e2, 3))  # print final accuracy.
```

```python
plt.figure(figsize=(7, 4.5))  # create loss curve figure.
plt.plot(losses_e2, color="black")  # plot loss over iterations.
plt.title("E2: logistic-neuron loss decreases")  # title the plot.
plt.xlabel("iteration")  # label x-axis.
plt.ylabel("binary cross-entropy")  # label y-axis.
plt.show()  # render loss curve.
```

▶ What you'll see: the loss falls quickly, then flattens as the linear classifier approaches its optimum.

```python
plt.figure(figsize=(6.8, 5.4))  # create boundary figure.
plot_boundary(lambda grid: sigmoid(grid @ w_e2 + b_e2), X_e2, y_e2, title=f"E2 final: trained logistic neuron, accuracy={acc_e2:.2f}")  # plot final boundary.
plt.show()  # render boundary.
```

▶ What you'll see: gradient descent found a straight boundary that separates most points.

👀 **Takeaway.** Logistic regression is a one-neuron network trained by the same forward-loss-backward-update pattern as deeper networks.

#### E3. Tiny 2-layer neural net learns XOR/moons

**Goal.** Train a one-hidden-layer MLP from scratch on nonlinear data and watch its boundary bend.  
**Data source.** `xor` / `moons`.  
**We'll build this in 8 steps:** load nonlinear data, initialize, show untrained boundary, train, plot curves, show boundary snapshots, inspect hidden activations, and evaluate.

```python
X_e3, y_e3, _, desc_e3 = load_deep_data("xor", seed=231)  # load nonlinear XOR data.
params0_e3 = init_mlp(2, 6, seed=231)  # initialize a six-hidden-unit MLP.
p0_e3, cache0_e3 = mlp_forward(X_e3, params0_e3)  # run the untrained network.
print("dataset:", desc_e3)  # print data description.
print("initial loss:", round(bce(p0_e3.ravel(), y_e3), 3))  # print initial loss.
```

```python
plt.figure(figsize=(6.8, 5.4))  # create untrained boundary figure.
plot_boundary(lambda grid: mlp_forward(grid, params0_e3)[0].ravel(), X_e3, y_e3, title="E3 step 1: untrained MLP")  # plot random boundary.
plt.show()  # render untrained state.
```

▶ What you'll see: the random boundary does not yet match the XOR quadrants.

```python
snap_e3 = [0, 20, 80, 200, 600]  # choose snapshot epochs.
params_e3, losses_e3, accs_e3, saved_e3 = train_mlp(X_e3, y_e3, hidden=6, lr=0.10, epochs=600, seed=231, snapshots=snap_e3)  # train the MLP.
p_e3 = mlp_forward(X_e3, params_e3)[0].ravel()  # compute final probabilities.
acc_e3 = accuracy_score(y_e3, (p_e3 >= 0.5).astype(int))  # compute final accuracy.
print("final loss:", round(losses_e3[-1], 3))  # print final loss.
print("final accuracy:", round(acc_e3, 3))  # print final accuracy.
```

```python
plt.figure(figsize=(7, 4.5))  # create training curve figure.
plt.plot(losses_e3, label="loss", color="black")  # plot loss.
plt.plot(accs_e3, label="accuracy", color="darkorange")  # plot accuracy.
plt.title("E3: MLP training curve on XOR")  # title the plot.
plt.xlabel("epoch")  # label x-axis.
plt.ylabel("value")  # label y-axis.
plt.legend()  # show labels.
plt.show()  # render curves.
```

▶ What you'll see: loss decreases while accuracy rises as hidden units learn useful regions.

```python
fig, axes = plt.subplots(1, len(snap_e3), figsize=(18, 3.8))  # create boundary snapshot panels.
for ax, epoch in zip(axes, snap_e3):  # loop over epochs.
    params_epoch = saved_e3[epoch]  # retrieve saved parameters.
    plot_boundary(lambda grid, p=params_epoch: mlp_forward(grid, p)[0].ravel(), X_e3, y_e3, title=f"epoch {epoch}", ax=ax)  # plot boundary snapshot.
plt.tight_layout()  # prevent overlap.
plt.show()  # render snapshots.
```

▶ What you'll see: the boundary evolves from arbitrary regions into a nonlinear separator.

```python
fig, axes = plt.subplots(1, 3, figsize=(14, 4))  # create hidden activation panels.
for unit in range(3):  # inspect three hidden units.
    xs = np.linspace(X_e3[:, 0].min() - 0.7, X_e3[:, 0].max() + 0.7, 120)  # create x grid.
    ys = np.linspace(X_e3[:, 1].min() - 0.7, X_e3[:, 1].max() + 0.7, 120)  # create y grid.
    xx, yy = np.meshgrid(xs, ys)  # create mesh grid.
    grid = np.c_[xx.ravel(), yy.ravel()]  # flatten grid.
    hidden = np.tanh(grid @ params_e3["W1"] + params_e3["b1"])[:, unit].reshape(xx.shape)  # compute hidden activation field.
    axes[unit].contourf(xx, yy, hidden, levels=20, cmap="viridis")  # plot activation field.
    axes[unit].scatter(X_e3[:, 0], X_e3[:, 1], c=y_e3, cmap="coolwarm", s=12, edgecolor="white", linewidth=0.2)  # overlay data.
    axes[unit].set_title(f"hidden unit {unit + 1}")  # title the panel.
plt.tight_layout()  # prevent overlap.
plt.show()  # render hidden units.
```

▶ What you'll see: each hidden unit creates a simple soft region; together they compose the XOR solution.

👀 **Takeaway.** Hidden layers turn raw inputs into features that a final neuron can separate.

#### E4. CNN arithmetic: convolution + padding + stride

**Goal.** Run a hand-coded convolution, ReLU, and max pool on an $8\times8$ edge image.  
**Data source.** Generated $8\times8$ edge image.  
**We'll build this in 6 steps:** create image, choose filter, compute output size, convolve, activate, and pool.

```python
image_e4 = np.zeros((8, 8))  # create an 8-by-8 image.
image_e4[:, 4:] = 1.0  # make the right half bright.
kernel_e4 = np.array([[-1.0, 0.0, 1.0], [-1.0, 0.0, 1.0], [-1.0, 0.0, 1.0]])  # define a vertical-edge filter.
W_e4 = image_e4.shape[0]  # read input width.
F_e4 = kernel_e4.shape[0]  # read filter width.
P_e4 = 1  # choose one-pixel padding.
S_e4 = 1  # choose stride one.
N_e4 = int((W_e4 - F_e4 + 2 * P_e4) / S_e4 + 1)  # compute output size.
print("expected output width:", N_e4)  # print formula result.
```

```python
feature_e4 = conv2d(image_e4, kernel_e4, padding=P_e4, stride=S_e4)  # compute convolution feature map.
activated_e4 = relu(feature_e4)  # apply ReLU to keep positive evidence.
pooled_e4 = max_pool2d(activated_e4, pool=2, stride=2)  # apply 2-by-2 max pooling.
print("feature shape:", feature_e4.shape)  # print convolution shape.
print("pooled shape:", pooled_e4.shape)  # print pooled shape.
```

```python
fig, axes = plt.subplots(1, 4, figsize=(14, 3.5))  # create CNN pipeline panels.
axes[0].imshow(image_e4, cmap="gray", vmin=0.0, vmax=1.0)  # show input image.
axes[0].set_title("input")  # title input.
axes[1].imshow(kernel_e4, cmap="coolwarm")  # show filter weights.
axes[1].set_title("filter")  # title filter.
axes[2].imshow(activated_e4, cmap="magma")  # show activated feature map.
axes[2].set_title("conv + ReLU")  # title feature map.
axes[3].imshow(pooled_e4, cmap="magma")  # show pooled map.
axes[3].set_title("max pool")  # title pooled map.
for ax in axes:  # clean all image panels.
    ax.set_xticks([])  # hide x ticks.
    ax.set_yticks([])  # hide y ticks.
plt.tight_layout()  # prevent overlap.
plt.show()  # render CNN arithmetic.
```

▶ What you'll see: the edge filter activates near the vertical edge, then pooling keeps strong local responses while shrinking the map.

```python
patch_e4 = np.pad(image_e4, pad_width=P_e4, mode="constant")[2:5, 3:6]  # extract one local receptive field.
score_e4 = float(np.sum(patch_e4 * kernel_e4))  # multiply and sum for one output pixel.
print("local patch:")  # introduce the patch.
print(patch_e4)  # display patch values.
print("patch score:", score_e4)  # print local convolution score.
```

▶ What you'll see: one feature-map entry is exactly a local weighted sum.

👀 **Takeaway.** A CNN layer is affine-plus-activation with weight sharing across spatial locations.

#### E5. Mini value iteration on a gridworld

**Goal.** Apply Bellman backups to a toy gridworld and extract a greedy policy.  
**Data source.** Toy $4\times4$ gridworld.  
**We'll build this in 6 steps:** define states/actions, implement transitions, sweep values, plot heatmaps, extract policy, and show arrows.

```python
grid_e5 = (4, 4)  # define grid size.
goal_e5 = (0, 3)  # define goal state.
wall_e5 = (1, 1)  # define blocked state.
actions_e5 = {"U": (-1, 0), "D": (1, 0), "L": (0, -1), "R": (0, 1)}  # define actions.
gamma_e5 = 0.92  # set discount factor.
V_e5 = np.zeros(grid_e5)  # initialize values.
```

```python
def step_e5(state, action):  # define deterministic transition function.
    if state == goal_e5:  # keep goal absorbing.
        return state, 1.0  # return goal reward.
    dr, dc_delta = actions_e5[action]  # read movement.
    row_new = state[0] + dr  # compute candidate row.
    col_new = state[1] + dc_delta  # compute candidate column.
    blocked = row_new < 0 or row_new >= grid_e5[0] or col_new < 0 or col_new >= grid_e5[1] or (row_new, col_new) == wall_e5  # detect invalid movement.
    next_state = state if blocked else (row_new, col_new)  # bounce off walls and boundaries.
    reward = 1.0 if next_state == goal_e5 else -0.04  # give goal reward or step cost.
    return next_state, reward  # return transition.
```

```python
snapshots_e5 = []  # store selected value tables.
for sweep in range(18):  # run Bellman sweeps.
    V_new = V_e5.copy()  # copy old values for synchronous update.
    for row in range(grid_e5[0]):  # loop over rows.
        for col in range(grid_e5[1]):  # loop over columns.
            state = (row, col)  # name current state.
            if state == wall_e5:  # skip wall.
                V_new[state] = np.nan  # mark wall as missing.
            elif state == goal_e5:  # handle goal.
                V_new[state] = 1.0  # set goal value.
            else:  # update ordinary states.
                scores = []  # collect action scores.
                for action in actions_e5:  # evaluate each action.
                    next_state, reward = step_e5(state, action)  # get transition.
                    scores.append(reward + gamma_e5 * V_e5[next_state])  # compute Bellman score.
                V_new[state] = max(scores)  # keep best action value.
    V_e5 = V_new.copy()  # accept new values.
    if sweep in [0, 1, 2, 5, 17]:  # save selected sweeps.
        snapshots_e5.append((sweep + 1, V_e5.copy()))  # store sweep number and values.
```

```python
fig, axes = plt.subplots(1, len(snapshots_e5), figsize=(18, 3.4))  # create heatmap panels.
for ax, (sweep, values) in zip(axes, snapshots_e5):  # loop over snapshots.
    image = ax.imshow(values, cmap="viridis")  # draw value heatmap.
    ax.set_title(f"sweep {sweep}")  # title panel.
    for row in range(grid_e5[0]):  # annotate rows.
        for col in range(grid_e5[1]):  # annotate columns.
            text = "W" if (row, col) == wall_e5 else f"{values[row, col]:.2f}"  # choose annotation.
            ax.text(col, row, text, ha="center", va="center", color="white")  # draw annotation.
fig.colorbar(image, ax=axes.ravel().tolist(), shrink=0.75)  # add shared colorbar.
plt.show()  # render value iteration progress.
```

▶ What you'll see: value propagates backward from the goal over Bellman sweeps.

```python
arrows_e5 = {"U": "↑", "D": "↓", "L": "←", "R": "→"}  # map actions to arrows.
policy_e5 = np.full(grid_e5, "", dtype=object)  # allocate policy grid.
for row in range(grid_e5[0]):  # loop over rows.
    for col in range(grid_e5[1]):  # loop over columns.
        state = (row, col)  # name state.
        if state == wall_e5:  # mark wall.
            policy_e5[state] = "W"  # write wall marker.
        elif state == goal_e5:  # mark goal.
            policy_e5[state] = "G"  # write goal marker.
        else:  # choose greedy action.
            score_map = {action: step_e5(state, action)[1] + gamma_e5 * V_e5[step_e5(state, action)[0]] for action in actions_e5}  # compute action values.
            policy_e5[state] = arrows_e5[max(score_map, key=score_map.get)]  # write best-action arrow.
print(policy_e5)  # print final policy.
```

```python
plt.figure(figsize=(5, 5))  # create final policy figure.
plt.imshow(V_e5, cmap="viridis")  # show value heatmap.
for row in range(grid_e5[0]):  # annotate rows.
    for col in range(grid_e5[1]):  # annotate columns.
        plt.text(col, row, policy_e5[row, col], ha="center", va="center", color="white", fontsize=18, fontweight="bold")  # draw policy symbols.
plt.title("E5 final: value function and greedy policy")  # title final plot.
plt.colorbar(label="V(s)")  # add colorbar.
plt.show()  # render policy.
```

▶ What you'll see: arrows point around the wall toward the goal.

👀 **Takeaway.** Value iteration is the Bellman equation turned into repeated computation.

### 🔴 Advanced Examples

#### A1. Backprop by hand-coded NumPy network

**Goal.** Build a tiny MLP from scratch, expose forward → loss → backprop → update, and show training curves plus decision boundaries per epoch.  
**Data source.** `moons`.  
**We'll build this in 10 steps:** load data, initialize, forward, loss, gradients, one update, full training, curves, boundaries, and gradient norms.

```python
X_a1, y_a1, _, desc_a1 = load_deep_data("moons", seed=232)  # load noisy moons.
params_a1 = init_mlp(2, 10, seed=232)  # initialize a 10-hidden-unit MLP.
yhat_a1, cache_a1 = mlp_forward(X_a1, params_a1)  # run one forward pass.
loss_a1 = bce(yhat_a1.ravel(), y_a1)  # compute initial loss.
print("dataset:", desc_a1)  # print dataset description.
print("initial loss:", round(loss_a1, 3))  # print initial loss.
print("W1 shape:", params_a1["W1"].shape)  # print hidden weight shape.
```

```python
grads_a1 = mlp_backward(y_a1, params_a1, cache_a1)  # compute manual backprop gradients.
norms_a1 = {key: float(np.linalg.norm(value)) for key, value in grads_a1.items()}  # compute gradient norms.
params_one_a1 = {key: value.copy() for key, value in params_a1.items()}  # copy parameters for one update.
params_one_a1 = apply_update(params_one_a1, grads_a1, lr=0.08)  # apply one gradient-descent step.
loss_one_a1 = bce(mlp_forward(X_a1, params_one_a1)[0].ravel(), y_a1)  # compute loss after one update.
print("gradient norms:", {key: round(value, 4) for key, value in norms_a1.items()})  # print norms.
print("loss after one update:", round(loss_one_a1, 3))  # print updated loss.
```

```python
snap_a1 = [0, 10, 50, 150, 400, 900]  # choose epochs for boundary snapshots.
params_a1_final, losses_a1, accs_a1, saved_a1 = train_mlp(X_a1, y_a1, hidden=10, lr=0.08, epochs=900, seed=232, snapshots=snap_a1)  # train the scratch MLP.
probs_a1 = mlp_forward(X_a1, params_a1_final)[0].ravel()  # compute final probabilities.
acc_a1 = accuracy_score(y_a1, (probs_a1 >= 0.5).astype(int))  # compute final accuracy.
print("final loss:", round(losses_a1[-1], 3))  # print final loss.
print("final accuracy:", round(acc_a1, 3))  # print final accuracy.
```

```python
plt.figure(figsize=(7.5, 4.8))  # create training curve figure.
plt.plot(losses_a1, color="black", label="loss")  # plot loss.
plt.plot(accs_a1, color="darkorange", label="accuracy")  # plot accuracy.
plt.title("A1: manual-backprop MLP training curve")  # title plot.
plt.xlabel("epoch")  # label x-axis.
plt.ylabel("value")  # label y-axis.
plt.legend()  # show labels.
plt.show()  # render plot.
```

▶ What you'll see: loss falls and accuracy rises as the nonlinear boundary improves.

```python
fig, axes = plt.subplots(2, 3, figsize=(15, 9))  # create boundary snapshot grid.
for ax, epoch in zip(axes.ravel(), snap_a1):  # loop over saved epochs.
    params_epoch = saved_a1[epoch]  # retrieve snapshot parameters.
    plot_boundary(lambda grid, p=params_epoch: mlp_forward(grid, p)[0].ravel(), X_a1, y_a1, title=f"epoch {epoch}", ax=ax)  # plot snapshot boundary.
plt.tight_layout()  # prevent overlap.
plt.show()  # render boundary evolution.
```

▶ What you'll see: the decision boundary bends gradually into the gap between the moons.

```python
grad_trace_a1 = []  # store total gradient norms.
params_diag_a1 = init_mlp(2, 10, seed=232)  # reset diagnostic model.
for epoch in range(120):  # run diagnostic training.
    yh_diag, cache_diag = mlp_forward(X_a1, params_diag_a1)  # forward pass.
    grads_diag = mlp_backward(y_a1, params_diag_a1, cache_diag)  # backward pass.
    grad_trace_a1.append(np.sqrt(sum(np.sum(value ** 2) for value in grads_diag.values())))  # store total gradient norm.
    params_diag_a1 = apply_update(params_diag_a1, grads_diag, lr=0.08)  # update parameters.
plt.figure(figsize=(7, 4.5))  # create gradient norm figure.
plt.plot(grad_trace_a1, color="purple")  # plot gradient norm.
plt.title("A1 final: total gradient norm")  # title plot.
plt.xlabel("diagnostic epoch")  # label x-axis.
plt.ylabel("gradient norm")  # label y-axis.
plt.show()  # render gradient diagnostic.
```

▶ What you'll see: gradient norms are larger early and generally shrink as the model improves.

👀 **Takeaway.** Backprop is cached forward values plus chain-rule gradients, repeated layer by layer.

#### A2. Learning-rate failure and Adam comparison

**Goal.** Compare too-small, good, and too-large learning rates, then compare gradient descent with Adam-style adaptive moments.  
**Data source.** `moons` with noisy labels.  
**We'll build this in 7 steps:** add noise, train learning rates, plot curves, plot boundaries, implement Adam, compare curves, and compare boundaries.

```python
X_a2, y_clean_a2, _, _ = load_deep_data("moons", seed=233)  # load moons.
y_a2 = y_clean_a2.copy()  # copy labels.
flip_a2 = RNG.choice(len(y_a2), size=int(0.08 * len(y_a2)), replace=False)  # choose labels to flip.
y_a2[flip_a2] = 1 - y_a2[flip_a2]  # inject label noise.
plt.figure(figsize=(6.5, 5.2))  # create noisy data figure.
plot_binary_data(X_a2, y_a2, title="A2: moons with 8% label noise")  # plot noisy labels.
plt.show()  # render data.
```

▶ What you'll see: most labels follow the moons, but a few contradictory labels create optimization and generalization difficulty.

```python
lr_values_a2 = [0.003, 0.08, 1.2]  # choose small, good, and large learning rates.
results_a2 = {}  # allocate result dictionary.
for lr in lr_values_a2:  # train each learning rate.
    params_lr, losses_lr, accs_lr, _ = train_mlp(X_a2, y_a2, hidden=12, lr=lr, epochs=450, seed=233, snapshots=[])  # run training.
    results_a2[lr] = {"params": params_lr, "losses": losses_lr, "accs": accs_lr}  # store run data.
    print(f"lr={lr}: loss={losses_lr[-1]:.3f}, acc={accs_lr[-1]:.3f}")  # summarize run.
```

```python
plt.figure(figsize=(7.5, 4.8))  # create learning-rate plot.
for lr in lr_values_a2:  # loop over learning rates.
    plt.plot(results_a2[lr]["losses"], label=f"lr={lr}")  # plot loss curve.
plt.ylim(0.0, 1.5)  # keep unstable curves readable.
plt.title("A2: learning-rate comparison")  # title plot.
plt.xlabel("epoch")  # label x-axis.
plt.ylabel("binary cross-entropy")  # label y-axis.
plt.legend()  # show labels.
plt.show()  # render plot.
```

▶ What you'll see: too-small learning moves slowly, a good rate learns steadily, and too-large learning can oscillate or settle poorly.

```python
fig, axes = plt.subplots(1, 3, figsize=(15, 4.5))  # create boundary panels.
for ax, lr in zip(axes, lr_values_a2):  # loop over learning rates.
    params_lr = results_a2[lr]["params"]  # get trained model.
    acc_lr = results_a2[lr]["accs"][-1]  # get final accuracy.
    plot_boundary(lambda grid, p=params_lr: mlp_forward(grid, p)[0].ravel(), X_a2, y_a2, title=f"lr={lr}, acc={acc_lr:.2f}", ax=ax)  # plot boundary.
plt.tight_layout()  # prevent overlap.
plt.show()  # render boundaries.
```

▶ What you'll see: the good learning rate gives the most useful nonlinear boundary for this noisy dataset.

```python
def train_mlp_adam(X, y, hidden=12, lr=0.025, epochs=450, seed=233):  # train the same MLP with Adam-style updates.
    params = init_mlp(X.shape[1], hidden, seed=seed)  # initialize parameters.
    m = {key: np.zeros_like(value) for key, value in params.items()}  # initialize first moments.
    v = {key: np.zeros_like(value) for key, value in params.items()}  # initialize second moments.
    losses = []  # store loss values.
    for epoch in range(1, epochs + 1):  # count from one for bias correction.
        yh, cache = mlp_forward(X, params)  # forward pass.
        losses.append(bce(yh.ravel(), y))  # record loss.
        grads = mlp_backward(y, params, cache)  # backward pass.
        for key in params:  # update every parameter.
            m[key] = 0.9 * m[key] + 0.1 * grads[key]  # update first moment.
            v[key] = 0.999 * v[key] + 0.001 * grads[key] ** 2  # update second moment.
            m_hat = m[key] / (1.0 - 0.9 ** epoch)  # bias-correct first moment.
            v_hat = v[key] / (1.0 - 0.999 ** epoch)  # bias-correct second moment.
            params[key] = params[key] - lr * m_hat / (np.sqrt(v_hat) + 1e-8)  # apply Adam step.
    return params, np.array(losses)  # return trained model and losses.
```

```python
params_adam_a2, losses_adam_a2 = train_mlp_adam(X_a2, y_a2, hidden=12, lr=0.025, epochs=450, seed=233)  # train Adam-style model.
plt.figure(figsize=(7.5, 4.8))  # create optimizer comparison figure.
plt.plot(results_a2[0.08]["losses"], label="gradient descent lr=0.08", color="black")  # plot GD curve.
plt.plot(losses_adam_a2, label="Adam-style lr=0.025", color="crimson")  # plot Adam-style curve.
plt.title("A2 final: GD vs Adam-style adaptive updates")  # title plot.
plt.xlabel("epoch")  # label x-axis.
plt.ylabel("binary cross-entropy")  # label y-axis.
plt.legend()  # show labels.
plt.show()  # render plot.
```

▶ What you'll see: Adam-style moments often reduce loss faster early by adapting each parameter's step size.

```python
fig, axes = plt.subplots(1, 2, figsize=(11, 4.8))  # create optimizer boundary panels.
plot_boundary(lambda grid: mlp_forward(grid, results_a2[0.08]["params"])[0].ravel(), X_a2, y_a2, title="plain gradient descent", ax=axes[0])  # show GD boundary.
plot_boundary(lambda grid: mlp_forward(grid, params_adam_a2)[0].ravel(), X_a2, y_a2, title="Adam-style updates", ax=axes[1])  # show Adam boundary.
plt.tight_layout()  # prevent overlap.
plt.show()  # render boundaries.
```

▶ What you'll see: both optimizers can learn the pattern, but their loss paths and boundary smoothness differ.

👀 **Takeaway.** The learning rate and optimizer control how gradient information is converted into parameter motion.

#### A3. Dropout and overfitting diagnostics

**Goal.** Train a small multiclass MLP on a small digits subset and compare no-dropout with dropout.  
**Data source.** Small `digits` subset.  
**We'll build this in 8 steps:** load digits, split data, implement dropout, train two models, plot curves, inspect activations, compute confusion matrix, and interpret errors.

```python
digits_a3 = load_digits()  # load 8-by-8 handwritten digits.
X_digits_a3 = digits_a3.data / 16.0  # scale pixels to 0..1.
y_digits_a3 = digits_a3.target.astype(int)  # read digit labels.
idx_a3 = np.r_[np.where(y_digits_a3 == 0)[0][:38], np.where(y_digits_a3 == 1)[0][:38], np.where(y_digits_a3 == 2)[0][:38], np.where(y_digits_a3 == 3)[0][:38]]  # choose a small four-class subset.
X_small_a3 = X_digits_a3[idx_a3]  # select features.
y_small_a3 = y_digits_a3[idx_a3]  # select labels.
X_train_a3, X_val_a3, y_train_a3, y_val_a3 = train_test_split(X_small_a3, y_small_a3, test_size=0.42, stratify=y_small_a3, random_state=229)  # split train and validation.
print("train shape:", X_train_a3.shape)  # print training shape.
print("validation shape:", X_val_a3.shape)  # print validation shape.
```

```python
fig, axes = plt.subplots(1, 8, figsize=(12, 2.2))  # create digit thumbnail row.
for ax, idx in zip(axes, range(8)):  # loop over thumbnails.
    ax.imshow(X_small_a3[idx].reshape(8, 8), cmap="gray_r")  # show one digit image.
    ax.set_title(f"y={y_small_a3[idx]}")  # label true digit.
    ax.set_xticks([])  # hide x ticks.
    ax.set_yticks([])  # hide y ticks.
plt.show()  # render thumbnails.
```

▶ What you'll see: tiny low-resolution digits from four classes.

```python
def train_dropout_mlp(X_train, y_train, X_val, y_val, hidden=48, dropout=0.0, lr=0.35, epochs=420, seed=229):  # train a one-hidden-layer multiclass MLP.
    rng = np.random.default_rng(seed)  # create random generator.
    classes = len(np.unique(y_train))  # count classes.
    W1 = rng.normal(0.0, np.sqrt(2.0 / X_train.shape[1]), size=(X_train.shape[1], hidden))  # initialize hidden weights.
    b1 = np.zeros((1, hidden))  # initialize hidden bias.
    W2 = rng.normal(0.0, np.sqrt(2.0 / hidden), size=(hidden, classes))  # initialize output weights.
    b2 = np.zeros((1, classes))  # initialize output bias.
    Y = one_hot(y_train, classes)  # one-hot encode labels.
    hist = {"train_loss": [], "val_loss": [], "train_acc": [], "val_acc": []}  # allocate history.
    for epoch in range(epochs):  # run training epochs.
        z1 = X_train @ W1 + b1  # compute hidden scores.
        a1 = relu(z1)  # apply ReLU.
        mask = (rng.random(a1.shape) > dropout).astype(float) / max(1.0 - dropout, EPS) if dropout > 0.0 else np.ones_like(a1)  # create inverted dropout mask.
        a1_drop = a1 * mask  # apply dropout to hidden activations.
        probs = softmax(a1_drop @ W2 + b2)  # compute class probabilities.
        loss = -np.mean(np.sum(Y * np.log(np.clip(probs, EPS, 1.0)), axis=1))  # compute cross-entropy.
        dz2 = (probs - Y) / len(y_train)  # compute output gradient.
        dW2 = a1_drop.T @ dz2  # compute output-weight gradient.
        db2 = dz2.sum(axis=0, keepdims=True)  # compute output-bias gradient.
        dz1 = (dz2 @ W2.T) * mask * relu_grad(z1)  # backprop through dropout and ReLU.
        dW1 = X_train.T @ dz1  # compute hidden-weight gradient.
        db1 = dz1.sum(axis=0, keepdims=True)  # compute hidden-bias gradient.
        W1 = W1 - lr * dW1  # update hidden weights.
        b1 = b1 - lr * db1  # update hidden bias.
        W2 = W2 - lr * dW2  # update output weights.
        b2 = b2 - lr * db2  # update output bias.
        train_pred = np.argmax(probs, axis=1)  # compute training predictions.
        val_hidden = relu(X_val @ W1 + b1)  # compute validation hidden activations without dropout.
        val_probs = softmax(val_hidden @ W2 + b2)  # compute validation probabilities.
        val_pred = np.argmax(val_probs, axis=1)  # compute validation predictions.
        hist["train_loss"].append(loss)  # store training loss.
        hist["val_loss"].append(-np.mean(np.log(np.clip(val_probs[np.arange(len(y_val)), y_val], EPS, 1.0))))  # store validation loss.
        hist["train_acc"].append(accuracy_score(y_train, train_pred))  # store training accuracy.
        hist["val_acc"].append(accuracy_score(y_val, val_pred))  # store validation accuracy.
    return {"W1": W1, "b1": b1, "W2": W2, "b2": b2}, hist  # return model and history.
```

```python
model_no_a3, hist_no_a3 = train_dropout_mlp(X_train_a3, y_train_a3, X_val_a3, y_val_a3, dropout=0.0, seed=229)  # train without dropout.
model_do_a3, hist_do_a3 = train_dropout_mlp(X_train_a3, y_train_a3, X_val_a3, y_val_a3, dropout=0.35, seed=229)  # train with dropout.
print("no-dropout validation accuracy:", round(hist_no_a3["val_acc"][-1], 3))  # print baseline validation accuracy.
print("dropout validation accuracy:", round(hist_do_a3["val_acc"][-1], 3))  # print dropout validation accuracy.
```

```python
fig, axes = plt.subplots(1, 2, figsize=(13, 4.5))  # create diagnostic panels.
axes[0].plot(hist_no_a3["train_loss"], label="train no dropout")  # plot baseline train loss.
axes[0].plot(hist_no_a3["val_loss"], label="val no dropout", linestyle="--")  # plot baseline val loss.
axes[0].plot(hist_do_a3["train_loss"], label="train dropout")  # plot dropout train loss.
axes[0].plot(hist_do_a3["val_loss"], label="val dropout", linestyle="--")  # plot dropout val loss.
axes[0].set_title("A3: train/validation loss")  # title loss panel.
axes[0].legend(fontsize=8)  # show legend.
axes[1].plot(hist_no_a3["train_acc"], label="train no dropout")  # plot baseline train accuracy.
axes[1].plot(hist_no_a3["val_acc"], label="val no dropout", linestyle="--")  # plot baseline val accuracy.
axes[1].plot(hist_do_a3["train_acc"], label="train dropout")  # plot dropout train accuracy.
axes[1].plot(hist_do_a3["val_acc"], label="val dropout", linestyle="--")  # plot dropout val accuracy.
axes[1].set_title("A3: train/validation accuracy")  # title accuracy panel.
axes[1].legend(fontsize=8)  # show legend.
plt.tight_layout()  # prevent overlap.
plt.show()  # render diagnostics.
```

▶ What you'll see: dropout usually trains more slowly but can reduce the train-validation gap.

```python
hidden_no_a3 = relu(X_val_a3 @ model_no_a3["W1"] + model_no_a3["b1"])  # compute hidden activations for baseline.
hidden_do_a3 = relu(X_val_a3 @ model_do_a3["W1"] + model_do_a3["b1"])  # compute hidden activations for dropout model.
plt.figure(figsize=(7.5, 4.6))  # create activation histogram.
plt.hist(hidden_no_a3.ravel(), bins=35, alpha=0.65, label="no dropout")  # plot baseline activations.
plt.hist(hidden_do_a3.ravel(), bins=35, alpha=0.65, label="dropout")  # plot dropout activations.
plt.title("A3: hidden activation histograms")  # title plot.
plt.xlabel("ReLU activation")  # label x-axis.
plt.ylabel("count")  # label y-axis.
plt.legend()  # show labels.
plt.show()  # render histogram.
```

▶ What you'll see: dropout changes the activation distribution because hidden units cannot co-adapt as easily.

```python
val_probs_a3 = softmax(relu(X_val_a3 @ model_do_a3["W1"] + model_do_a3["b1"]) @ model_do_a3["W2"] + model_do_a3["b2"])  # compute validation probabilities for dropout model.
val_pred_a3 = np.argmax(val_probs_a3, axis=1)  # compute predicted labels.
cm_a3 = confusion_matrix(y_val_a3, val_pred_a3, labels=[0, 1, 2, 3])  # compute confusion matrix.
plt.figure(figsize=(5.4, 4.8))  # create confusion matrix figure.
plt.imshow(cm_a3, cmap="Blues")  # draw heatmap.
plt.title("A3 final: validation confusion matrix")  # title plot.
plt.xlabel("predicted digit")  # label x-axis.
plt.ylabel("true digit")  # label y-axis.
plt.xticks(range(4), [0, 1, 2, 3])  # label predicted classes.
plt.yticks(range(4), [0, 1, 2, 3])  # label true classes.
for row in range(4):  # loop over rows.
    for col in range(4):  # loop over columns.
        plt.text(col, row, cm_a3[row, col], ha="center", va="center", color="black")  # annotate cell count.
plt.colorbar(label="count")  # add colorbar.
plt.show()  # render confusion matrix.
```

▶ What you'll see: most mass should be on the diagonal, and off-diagonal cells reveal confused digit pairs.

👀 **Takeaway.** Dropout is a training-time regularizer that forces a network to avoid relying on any one hidden unit too strongly.

#### A4. Simple RNN/LSTM intuition on sequence prediction

**Goal.** Implement a tiny recurrent network on a sine-wave next-step task and visualize hidden-state traces.  
**Data source.** Synthetic sine wave.  
**We'll build this in 8 steps:** create sequences, initialize recurrence, unroll, backprop through time, train, plot loss, plot hidden traces, and compare predictions.

```python
t_a4 = np.linspace(0.0, 18.0 * np.pi, 900)  # create time coordinates.
series_a4 = np.sin(t_a4) + 0.25 * np.sin(3.0 * t_a4)  # create a multi-frequency signal.
seq_len_a4 = 12  # choose input window length.
X_seq_a4 = np.array([series_a4[i:i + seq_len_a4] for i in range(len(series_a4) - seq_len_a4)])[..., None]  # build sequence windows with one feature.
y_seq_a4 = np.array([series_a4[i + seq_len_a4] for i in range(len(series_a4) - seq_len_a4)])  # build next-step targets.
X_train_a4 = X_seq_a4[:220]  # keep a small training subset for CPU speed.
y_train_a4 = y_seq_a4[:220]  # keep corresponding training targets.
X_test_a4 = X_seq_a4[650:810]  # choose held-out test windows.
y_test_a4 = y_seq_a4[650:810]  # choose held-out targets.
print("training sequence shape:", X_train_a4.shape)  # print RNN input shape.
```

```python
plt.figure(figsize=(8, 3.8))  # create sequence plot.
plt.plot(series_a4[:220], color="black")  # plot initial signal.
plt.title("A4: synthetic sequence")  # title plot.
plt.xlabel("time index")  # label x-axis.
plt.ylabel("value")  # label y-axis.
plt.show()  # render sequence.
```

▶ What you'll see: a smooth periodic signal whose next value depends on recent history.

```python
def train_tiny_rnn(X_train, y_train, hidden=8, lr=0.05, epochs=160, seed=229):  # train a small tanh RNN.
    rng = np.random.default_rng(seed)  # create generator.
    Wx = rng.normal(0.0, 0.4, size=(1, hidden))  # initialize input weights.
    Wh = rng.normal(0.0, 0.25, size=(hidden, hidden))  # initialize recurrent weights.
    bh = np.zeros((1, hidden))  # initialize hidden bias.
    Wy = rng.normal(0.0, 0.4, size=(hidden, 1))  # initialize output weights.
    by = np.zeros((1, 1))  # initialize output bias.
    losses = []  # store MSE.
    for epoch in range(epochs):  # train for epochs.
        dWx = np.zeros_like(Wx)  # reset input gradient.
        dWh = np.zeros_like(Wh)  # reset recurrent gradient.
        dbh = np.zeros_like(bh)  # reset hidden-bias gradient.
        dWy = np.zeros_like(Wy)  # reset output gradient.
        dby = np.zeros_like(by)  # reset output-bias gradient.
        total = 0.0  # reset total loss.
        for seq, target in zip(X_train, y_train):  # loop over windows.
            hs = []  # store hidden states.
            h = np.zeros((1, hidden))  # initialize hidden state.
            for x_t in seq:  # unroll over time.
                h = np.tanh(x_t.reshape(1, 1) @ Wx + h @ Wh + bh)  # update hidden state.
                hs.append(h.copy())  # store hidden state.
            pred = h @ Wy + by  # predict next value.
            err = pred - target  # compute scalar error.
            total += float(err ** 2)  # accumulate squared error.
            dWy += hs[-1].T @ err  # update output-weight gradient.
            dby += err  # update output-bias gradient.
            dh = err @ Wy.T  # start hidden gradient.
            for step in reversed(range(len(seq))):  # backpropagate through time.
                h_step = hs[step]  # get current hidden state.
                h_prev = np.zeros_like(h_step) if step == 0 else hs[step - 1]  # get previous hidden state.
                dz = dh * (1.0 - h_step ** 2)  # apply tanh derivative.
                dWx += seq[step].reshape(1, 1).T @ dz  # accumulate input gradient.
                dWh += h_prev.T @ dz  # accumulate recurrent gradient.
                dbh += dz  # accumulate hidden bias gradient.
                dh = dz @ Wh.T  # pass gradient backward in time.
        scale = 1.0 / len(X_train)  # compute averaging scale.
        for grad in [dWx, dWh, dbh, dWy, dby]:  # loop over gradients.
            np.clip(grad, -1.0, 1.0, out=grad)  # clip gradients for stability.
        Wx = Wx - lr * dWx * scale  # update input weights.
        Wh = Wh - lr * dWh * scale  # update recurrent weights.
        bh = bh - lr * dbh * scale  # update hidden bias.
        Wy = Wy - lr * dWy * scale  # update output weights.
        by = by - lr * dby * scale  # update output bias.
        losses.append(total * scale)  # record average MSE.
    return {"Wx": Wx, "Wh": Wh, "bh": bh, "Wy": Wy, "by": by}, np.array(losses)  # return model and loss.
```

```python
def rnn_predict(X, model):  # predict and trace hidden states.
    preds = []  # store predictions.
    traces = []  # store hidden traces.
    for seq in X:  # loop over windows.
        h = np.zeros((1, model["Wh"].shape[0]))  # initialize hidden state.
        hs = []  # store this sequence's hidden states.
        for x_t in seq:  # unroll over time.
            h = np.tanh(x_t.reshape(1, 1) @ model["Wx"] + h @ model["Wh"] + model["bh"])  # update hidden state.
            hs.append(h.ravel())  # store hidden state.
        preds.append(float(h @ model["Wy"] + model["by"]))  # store scalar prediction.
        traces.append(np.array(hs))  # store trace array.
    return np.array(preds), traces  # return predictions and traces.
```

```python
model_a4, losses_a4 = train_tiny_rnn(X_train_a4, y_train_a4, hidden=8, lr=0.05, epochs=160, seed=229)  # train tiny RNN.
preds_a4, traces_a4 = rnn_predict(X_test_a4, model_a4)  # predict held-out sequence windows.
print("final training MSE:", round(float(losses_a4[-1]), 4))  # print final MSE.
```

```python
plt.figure(figsize=(7.5, 4.5))  # create RNN loss figure.
plt.plot(losses_a4, color="black")  # plot MSE.
plt.title("A4: tiny RNN training loss")  # title plot.
plt.xlabel("epoch")  # label x-axis.
plt.ylabel("mean squared error")  # label y-axis.
plt.show()  # render loss curve.
```

▶ What you'll see: prediction error decreases as recurrent weights learn a memory of recent values.

```python
trace_a4 = traces_a4[20]  # choose one hidden trace.
plt.figure(figsize=(8, 4.5))  # create hidden trace figure.
for unit in range(4):  # show first four hidden units.
    plt.plot(trace_a4[:, unit], marker="o", label=f"hidden {unit + 1}")  # plot hidden unit over time.
plt.title("A4: hidden-state traces")  # title plot.
plt.xlabel("position in input window")  # label x-axis.
plt.ylabel("activation")  # label y-axis.
plt.legend()  # show labels.
plt.show()  # render hidden traces.
```

▶ What you'll see: hidden units evolve across positions, storing information about the recent sequence.

```python
plt.figure(figsize=(9, 4.5))  # create prediction plot.
plt.plot(y_test_a4, label="true next value", color="black")  # plot targets.
plt.plot(preds_a4, label="RNN prediction", color="crimson", alpha=0.85)  # plot predictions.
plt.title("A4 final: sequence prediction")  # title plot.
plt.xlabel("held-out window")  # label x-axis.
plt.ylabel("value")  # label y-axis.
plt.legend()  # show labels.
plt.show()  # render prediction comparison.
```

▶ What you'll see: the tiny RNN tracks the sine-wave phase, with small errors because it is intentionally minimal.

👀 **Takeaway.** RNNs share parameters across time; LSTM gates refine this idea by controlling memory writes, erases, and reads.

#### A5. Q-learning failure/edge: sparse rewards

**Goal.** Compare sparse-reward and shaped-reward Q-learning in a slippery gridworld.  
**Data source.** Slippery gridworld.  
**We'll build this in 9 steps:** define environment, implement slip, train sparse Q-learning, train shaped Q-learning, plot rewards, show Q heatmaps, extract policies, compare policies, and summarize success.

```python
grid_a5 = (5, 5)  # define grid size.
start_a5 = (4, 0)  # define start state.
goal_a5 = (0, 4)  # define goal state.
hazards_a5 = {(1, 3), (2, 2), (3, 1)}  # define hazardous terminal cells.
actions_a5 = ["U", "D", "L", "R"]  # list actions.
delta_a5 = {"U": (-1, 0), "D": (1, 0), "L": (0, -1), "R": (0, 1)}  # map actions to movement.
state_to_i_a5 = {(row, col): row * grid_a5[1] + col for row in range(grid_a5[0]) for col in range(grid_a5[1])}  # map states to row indices.
```

```python
def slip_step_a5(state, action, shaped=False, rng=None):  # simulate one slippery transition.
    rng = RNG if rng is None else rng  # choose random generator.
    chosen = action if rng.random() > 0.18 else rng.choice(actions_a5)  # slip to a random action sometimes.
    dr, dc_delta = delta_a5[chosen]  # read chosen movement.
    row_new = int(np.clip(state[0] + dr, 0, grid_a5[0] - 1))  # compute clipped row.
    col_new = int(np.clip(state[1] + dc_delta, 0, grid_a5[1] - 1))  # compute clipped column.
    next_state = (row_new, col_new)  # package next state.
    done = next_state == goal_a5 or next_state in hazards_a5  # detect terminal state.
    if next_state == goal_a5:  # handle goal.
        reward = 1.0  # give positive terminal reward.
    elif next_state in hazards_a5:  # handle hazard.
        reward = -1.0  # give negative terminal reward.
    elif shaped:  # handle dense shaping.
        old_dist = abs(state[0] - goal_a5[0]) + abs(state[1] - goal_a5[1])  # compute old Manhattan distance.
        new_dist = abs(next_state[0] - goal_a5[0]) + abs(next_state[1] - goal_a5[1])  # compute new Manhattan distance.
        reward = -0.03 + 0.04 * (old_dist - new_dist)  # reward progress and penalize steps.
    else:  # handle sparse nonterminal move.
        reward = 0.0  # give no nonterminal feedback.
    return next_state, reward, done  # return transition.
```

```python
def train_q(shaped=False, episodes=800, alpha=0.45, gamma=0.94, epsilon=0.25, seed=234):  # train tabular Q-learning.
    rng = np.random.default_rng(seed)  # create local generator.
    Q = np.zeros((grid_a5[0] * grid_a5[1], len(actions_a5)))  # initialize Q-table.
    rewards = []  # store episode returns.
    for episode in range(episodes):  # loop over episodes.
        state = start_a5  # reset state.
        total = 0.0  # reset return.
        for step in range(80):  # cap episode length.
            s_idx = state_to_i_a5[state]  # convert state to index.
            a_idx = int(rng.integers(len(actions_a5))) if rng.random() < epsilon else int(np.argmax(Q[s_idx]))  # choose epsilon-greedy action.
            next_state, reward, done = slip_step_a5(state, actions_a5[a_idx], shaped=shaped, rng=rng)  # sample transition.
            ns_idx = state_to_i_a5[next_state]  # convert next state to index.
            target = reward + gamma * np.max(Q[ns_idx]) * (0.0 if done else 1.0)  # compute Q-learning target.
            Q[s_idx, a_idx] = Q[s_idx, a_idx] + alpha * (target - Q[s_idx, a_idx])  # update Q-value.
            state = next_state  # advance state.
            total += reward  # accumulate reward.
            if done:  # stop at terminal state.
                break  # exit step loop.
        rewards.append(total)  # store episode return.
    return Q, np.array(rewards)  # return Q-table and rewards.
```

```python
Q_sparse_a5, rewards_sparse_a5 = train_q(shaped=False, episodes=800, seed=234)  # train sparse-reward agent.
Q_shaped_a5, rewards_shaped_a5 = train_q(shaped=True, episodes=800, seed=234)  # train shaped-reward agent.
print("last-100 sparse mean:", round(float(rewards_sparse_a5[-100:].mean()), 3))  # summarize sparse returns.
print("last-100 shaped mean:", round(float(rewards_shaped_a5[-100:].mean()), 3))  # summarize shaped returns.
```

```python
def moving_average(values, window=40):  # compute moving average for reward curves.
    return np.convolve(values, np.ones(window) / window, mode="valid")  # smooth values with a uniform window.
plt.figure(figsize=(8, 4.8))  # create reward curve figure.
plt.plot(moving_average(rewards_sparse_a5), label="sparse reward")  # plot sparse rewards.
plt.plot(moving_average(rewards_shaped_a5), label="shaped reward")  # plot shaped rewards.
plt.title("A5: Q-learning reward curves")  # title plot.
plt.xlabel("episode after smoothing")  # label x-axis.
plt.ylabel("moving-average return")  # label y-axis.
plt.legend()  # show labels.
plt.show()  # render curves.
```

▶ What you'll see: sparse rewards learn slowly and noisily because many early episodes provide little feedback.

```python
def values_from_Q(Q):  # convert Q-table to state-value grid.
    return np.max(Q, axis=1).reshape(grid_a5)  # take max action value per state.
fig, axes = plt.subplots(1, 2, figsize=(10, 4.4))  # create value heatmap panels.
for ax, values, title in [(axes[0], values_from_Q(Q_sparse_a5), "sparse Q-values"), (axes[1], values_from_Q(Q_shaped_a5), "shaped Q-values")]:  # loop over value grids.
    image = ax.imshow(values, cmap="viridis")  # draw heatmap.
    ax.set_title(title)  # title panel.
    for hazard in hazards_a5:  # mark hazards.
        ax.text(hazard[1], hazard[0], "H", ha="center", va="center", color="white", fontweight="bold")  # annotate hazard.
    ax.text(goal_a5[1], goal_a5[0], "G", ha="center", va="center", color="white", fontweight="bold")  # annotate goal.
fig.colorbar(image, ax=axes.ravel().tolist(), shrink=0.8)  # add colorbar.
plt.show()  # render heatmaps.
```

▶ What you'll see: shaped rewards create a smoother value gradient toward the goal.

```python
def policy_from_Q(Q):  # extract greedy policy arrows.
    arrows = {"U": "↑", "D": "↓", "L": "←", "R": "→"}  # map actions to symbols.
    policy = np.full(grid_a5, "", dtype=object)  # allocate symbol grid.
    for row in range(grid_a5[0]):  # loop over rows.
        for col in range(grid_a5[1]):  # loop over columns.
            state = (row, col)  # name current state.
            if state == goal_a5:  # mark goal.
                policy[state] = "G"  # write goal marker.
            elif state in hazards_a5:  # mark hazards.
                policy[state] = "H"  # write hazard marker.
            else:  # choose best action.
                action = actions_a5[int(np.argmax(Q[state_to_i_a5[state]]))]  # get greedy action.
                policy[state] = arrows[action]  # write action arrow.
    return policy  # return policy grid.
policy_sparse_a5 = policy_from_Q(Q_sparse_a5)  # extract sparse policy.
policy_shaped_a5 = policy_from_Q(Q_shaped_a5)  # extract shaped policy.
print("sparse policy:")  # introduce sparse policy.
print(policy_sparse_a5)  # print sparse policy.
print("shaped policy:")  # introduce shaped policy.
print(policy_shaped_a5)  # print shaped policy.
```

```python
fig, axes = plt.subplots(1, 2, figsize=(10, 4.4))  # create policy panels.
for ax, policy, values, title in [(axes[0], policy_sparse_a5, values_from_Q(Q_sparse_a5), "sparse policy"), (axes[1], policy_shaped_a5, values_from_Q(Q_shaped_a5), "shaped policy")]:  # loop over policies.
    ax.imshow(values, cmap="viridis")  # draw value background.
    ax.set_title(title)  # title panel.
    for row in range(grid_a5[0]):  # loop over rows.
        for col in range(grid_a5[1]):  # loop over columns.
            ax.text(col, row, policy[row, col], ha="center", va="center", color="white", fontsize=17, fontweight="bold")  # annotate policy.
plt.tight_layout()  # prevent overlap.
plt.show()  # render policy comparison.
```

▶ What you'll see: shaped rewards more consistently point the agent around hazards toward the goal.

```python
success_sparse_a5 = np.mean(rewards_sparse_a5[-100:] > 0.0)  # estimate recent sparse success frequency.
success_shaped_a5 = np.mean(rewards_shaped_a5[-100:] > 0.0)  # estimate recent shaped success frequency.
plt.figure(figsize=(5.5, 4.2))  # create success bar plot.
plt.bar(["sparse", "shaped"], [success_sparse_a5, success_shaped_a5], color=["steelblue", "darkorange"])  # compare success rates.
plt.ylim(0.0, 1.0)  # use probability scale.
plt.title("A5 final: positive-return frequency")  # title plot.
plt.ylabel("fraction of last 100 episodes")  # label y-axis.
plt.show()  # render final diagnostic.
```

▶ What you'll see: shaped rewards usually improve the recent positive-return rate in this small slippery world.

👀 **Takeaway.** Q-learning updates are simple, but sparse rewards can make exploration the central difficulty.

### Interactive Experiment

Use the sliders to retrain the from-scratch MLP. CPU is enough for these tiny datasets; no GPU is needed.

```python
def interactive_mlp_demo(data_source="moons", hidden_units=8, learning_rate=0.08, epochs=350):  # define widget-driven experiment.
    X_i, y_i, _, desc_i = load_deep_data(data_source, seed=240)  # load selected data.
    params_i, losses_i, accs_i, _ = train_mlp(X_i, y_i, hidden=int(hidden_units), lr=float(learning_rate), epochs=int(epochs), seed=240, snapshots=[])  # train MLP with selected settings.
    fig, axes = plt.subplots(1, 2, figsize=(13, 4.8))  # create boundary and curve panels.
    plot_boundary(lambda grid: mlp_forward(grid, params_i)[0].ravel(), X_i, y_i, title=f"{desc_i}: h={hidden_units}, lr={learning_rate:.3f}, acc={accs_i[-1]:.2f}", ax=axes[0])  # plot learned boundary.
    axes[1].plot(losses_i, color="black", label="loss")  # plot loss.
    axes[1].plot(accs_i, color="darkorange", label="accuracy")  # plot accuracy.
    axes[1].set_title("training diagnostics")  # title diagnostics.
    axes[1].set_xlabel("epoch")  # label x-axis.
    axes[1].set_ylabel("value")  # label y-axis.
    axes[1].legend()  # show labels.
    plt.tight_layout()  # prevent overlap.
    plt.show()  # render experiment.
    print(f"Final loss: {losses_i[-1]:.3f}; final accuracy: {accs_i[-1]:.3f}")  # print exact metrics.
```

```python
interact(interactive_mlp_demo, data_source=Dropdown(options=["moons", "circles", "blobs", "xor"], value="moons", description="data"), hidden_units=IntSlider(value=8, min=2, max=24, step=2, description="hidden"), learning_rate=FloatSlider(value=0.08, min=0.005, max=0.30, step=0.005, description="lr"), epochs=IntSlider(value=350, min=50, max=900, step=50, description="epochs"))  # create sliders for data, hidden units, learning rate, and epochs.
```

▶ What you'll see: hidden units control boundary flexibility, learning rate controls optimization behavior, and epochs control how long learning continues.

```python
interactive_mlp_demo(data_source="circles", hidden_units=10, learning_rate=0.07, epochs=300)  # run one non-interactive example for environments without widgets.
```

▶ What you'll see: the same scratch MLP learns a curved boundary for concentric circles.
