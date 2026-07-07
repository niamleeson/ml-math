# Activation Functions
> **Source:** CS 230 · **Category:** Function · **Type:** ⚖️ Both · [↑ Full reference](../../ai-ml-cheatsheets.md)
> 📓 The coded examples form a runnable notebook section; an .ipynb will be generated.

## 1. Overview

Activation functions are the elementwise nonlinear functions that turn a stack of affine maps into a neural network capable of representing curved decision boundaries, saturating probabilities, and multiclass outputs. They matter twice: in the forward pass they shape the representation, and in the backward pass their derivatives decide how much gradient reaches earlier layers.

**One-line intuition:** an activation is a gate on both information and learning signal; the graph tells you what values pass forward, and the derivative tells you what errors pass backward.

## 2. Key Idea

A dense layer computes a pre-activation

$$
z = w^\top x + b,
$$

then applies an activation

$$
a = g(z).
$$

During backpropagation, if a later scalar loss $L$ depends on $a$, the chain rule gives

$$
\frac{\partial L}{\partial z}
= \frac{\partial L}{\partial a}\,g'(z).
$$

So a small derivative can shrink gradients, a zero derivative can stop learning through that unit, and a derivative near one can preserve signal.

### Sigmoid

$$
\sigma(z)=\frac{1}{1+e^{-z}}.
$$

Derivative:

$$
\sigma'(z)=\sigma(z)\bigl(1-\sigma(z)\bigr).
$$

Range:

$$
0<\sigma(z)<1.
$$

Important behavior:

$$
\lim_{z\to -\infty}\sigma(z)=0,
\qquad
\lim_{z\to +\infty}\sigma(z)=1,
\qquad
\max_z \sigma'(z)=\sigma'(0)=\frac14.
$$

Sigmoid is useful for binary probabilities, but its tails saturate. When $|z|$ is large, $\sigma'(z)\approx 0$, so gradients can vanish.

### Hyperbolic tangent

$$
\tanh(z)=\frac{e^z-e^{-z}}{e^z+e^{-z}}.
$$

Derivative:

$$
\frac{d}{dz}\tanh(z)=1-\tanh^2(z).
$$

Range:

$$
-1<\tanh(z)<1.
$$

Important behavior:

$$
\tanh(0)=0,
\qquad
\tanh'(0)=1,
\qquad
\lim_{|z|\to\infty}\tanh'(z)=0.
$$

Tanh is zero-centered, which often helps optimization compared with sigmoid, but it still saturates in both tails.

### ReLU

$$
\operatorname{ReLU}(z)=\max(0,z).
$$

Derivative/subgradient:

$$
\operatorname{ReLU}'(z)=
\begin{cases}
0, & z<0,\\
\text{undefined; choose a subgradient such as }0\text{ or }1, & z=0,\\
1, & z>0.
\end{cases}
$$

Range:

$$
0\le \operatorname{ReLU}(z)<\infty.
$$

ReLU is computationally simple and avoids saturation for positive $z$. Its danger is the **dying ReLU** problem: if a unit is pushed so that $z<0$ for all relevant inputs, then its derivative is $0$ and gradient descent may never revive it.

### Leaky ReLU

For a small $\epsilon>0$, usually $\epsilon\ll 1$,

$$
\operatorname{LeakyReLU}(z)=\max(\epsilon z,z).
$$

Derivative:

$$
\operatorname{LeakyReLU}'(z)=
\begin{cases}
\epsilon, & z<0,\\
\text{undefined at }0\text{; choose a subgradient}, & z=0,\\
1, & z>0.
\end{cases}
$$

Range:

$$
-\infty<\operatorname{LeakyReLU}(z)<\infty.
$$

The small negative slope keeps gradients nonzero on the negative side, directly addressing dying ReLUs.

### ELU

For $\alpha>0$, the exponential linear unit is

$$
\operatorname{ELU}(z)=\max\left(\alpha(e^z-1),z\right)
=
\begin{cases}
\alpha(e^z-1), & z<0,\\
z, & z\ge 0.
\end{cases}
$$

Derivative:

$$
\operatorname{ELU}'(z)=
\begin{cases}
\alpha e^z, & z<0,\\
1, & z>0.
\end{cases}
$$

If $\alpha=1$, the left derivative at $0$ is also $1$, so ELU is differentiable at $0$. Range:

$$
-\alpha<\operatorname{ELU}(z)<\infty.
$$

ELU has a smooth negative branch that saturates near $-\alpha$, while preserving the linear positive branch.

### Softmax

For a vector of class scores $x\in\mathbb{R}^n$, softmax outputs probabilities $p\in\mathbb{R}^n$:

$$
p_i=\frac{e^{x_i}}{\sum_{j=1}^n e^{x_j}}.
$$

Range and normalization:

$$
0<p_i<1,
\qquad
\sum_{i=1}^n p_i=1.
$$

Jacobian entries:

$$
\frac{\partial p_i}{\partial x_j}=p_i(\mathbf{1}_{i=j}-p_j).
$$

Softmax is invariant to adding the same constant to every score:

$$
\operatorname{softmax}(x)=\operatorname{softmax}(x-c\mathbf{1}).
$$

For numerical stability, choose

$$
c=\max_i x_i,
$$

so the largest exponent is $e^0=1$ rather than an overflowing number.

### Vanishing gradients

For a depth-$L$ scalar chain

$$
a_L=g(g(\cdots g(a_0)\cdots)),
$$

the derivative is a product:

$$
\frac{\partial a_L}{\partial a_0}=\prod_{\ell=1}^L g'(z_\ell).
$$

If each $|g'(z_\ell)|\le 0.25$, as can happen with sigmoid, then

$$
\left|\frac{\partial a_L}{\partial a_0}\right|\le (0.25)^L,
$$

which becomes extremely small for large $L$. This is why derivative shape is as important as function shape.

## 3. Worked Examples

### Setup

The following setup block is designed to run once at the top of a notebook. All later code blocks assume it has already been executed.

```python
import numpy as np  # Import NumPy once so every later numerical example uses the same array library.
import matplotlib.pyplot as plt  # Import Matplotlib once so every later visualization uses the same plotting API.
from math import exp  # Import the scalar exponential for short hand-check comparisons.
np.random.seed(23019)  # Seed NumPy once so synthetic data and model initialization are reproducible.
plt.rcParams["figure.figsize"] = (7, 4)  # Set a readable default figure size for notebook plots.
plt.rcParams["axes.grid"] = True  # Turn on light grid lines so slopes and saturation regions are easier to read.
EPSILON = 0.01  # Store the default Leaky ReLU negative slope used throughout the lesson.
ALPHA = 1.0  # Store the default ELU shape parameter used throughout the lesson.

def sigmoid(z):  # Define sigmoid as a reusable vectorized function.
    return 1.0 / (1.0 + np.exp(-z))  # Apply the exact formula sigma(z)=1/(1+e^{-z}).

def sigmoid_derivative(z):  # Define the derivative using the activation value for numerical consistency.
    s = sigmoid(z)  # Compute sigma(z) once so the derivative formula stays transparent.
    return s * (1.0 - s)  # Return sigma(z)(1-sigma(z)).

def tanh_derivative(z):  # Define tanh derivative as a reusable vectorized function.
    t = np.tanh(z)  # Compute tanh(z) once so the derivative formula stays transparent.
    return 1.0 - t**2  # Return 1-tanh^2(z).

def relu(z):  # Define ReLU as a reusable vectorized function.
    return np.maximum(0.0, z)  # Return max(0,z) element by element.

def relu_derivative(z):  # Define a practical ReLU subgradient function.
    return (z > 0.0).astype(float)  # Use derivative 1 for positive inputs and 0 otherwise.

def leaky_relu(z, epsilon=EPSILON):  # Define Leaky ReLU with a configurable negative slope.
    return np.maximum(epsilon * z, z)  # Return max(epsilon z,z) element by element.

def leaky_relu_derivative(z, epsilon=EPSILON):  # Define the Leaky ReLU derivative.
    return np.where(z > 0.0, 1.0, epsilon)  # Use slope 1 on the right and epsilon on the left.

def elu(z, alpha=ALPHA):  # Define ELU with a configurable alpha parameter.
    return np.where(z >= 0.0, z, alpha * (np.exp(z) - 1.0))  # Use the linear branch on the right and exponential branch on the left.

def elu_derivative(z, alpha=ALPHA):  # Define the ELU derivative.
    return np.where(z >= 0.0, 1.0, alpha * np.exp(z))  # Use derivative 1 on the right and alpha e^z on the left.

def softmax(logits):  # Define numerically stable softmax for vectors or row batches.
    x = np.asarray(logits, dtype=float)  # Convert input to a floating NumPy array so exponentials behave predictably.
    shifted = x - np.max(x, axis=-1, keepdims=True)  # Subtract the rowwise maximum to prevent exponential overflow.
    exp_shifted = np.exp(shifted)  # Exponentiate only shifted scores whose largest value is zero.
    return exp_shifted / np.sum(exp_shifted, axis=-1, keepdims=True)  # Normalize exponentials so probabilities sum to one.

def softmax_jacobian(probabilities):  # Define the softmax Jacobian from an already-computed probability vector.
    p = np.asarray(probabilities, dtype=float).reshape(-1)  # Flatten probabilities so the Jacobian is a standard square matrix.
    return np.diag(p) - np.outer(p, p)  # Return diag(p)-pp^T, equivalent to p_i(1_{i=j}-p_j).

def cross_entropy(probabilities, target_index):  # Define one-example cross-entropy for a class index target.
    p = np.asarray(probabilities, dtype=float).reshape(-1)  # Flatten probabilities so target indexing is unambiguous.
    return -np.log(p[target_index] + 1e-12)  # Add a tiny guard so log never receives exact zero.

def make_two_moons(n_samples=400, noise=0.08):  # Define a NumPy-only two-moons generator to avoid extra dependencies.
    half = n_samples // 2  # Split the sample count evenly between the two crescent classes.
    theta_top = np.random.rand(half) * np.pi  # Draw random angles for the upper moon.
    theta_bottom = np.random.rand(n_samples - half) * np.pi  # Draw random angles for the lower moon.
    top = np.c_[np.cos(theta_top), np.sin(theta_top)]  # Convert upper-moon angles to unit-circle coordinates.
    bottom = np.c_[1.0 - np.cos(theta_bottom), 0.5 - np.sin(theta_bottom)]  # Shift and flip the lower moon.
    X = np.vstack([top, bottom])  # Stack both moons into one feature matrix.
    y = np.r_[np.zeros(half, dtype=int), np.ones(n_samples - half, dtype=int)]  # Label the upper moon 0 and lower moon 1.
    X = X + noise * np.random.randn(*X.shape)  # Add Gaussian noise so the classification task is realistic.
    X = (X - X.mean(axis=0)) / X.std(axis=0)  # Standardize features so all activations see comparable input scales.
    return X, y  # Return features and integer labels.

def one_hot(y, n_classes):  # Define one-hot encoding for cross-entropy training examples.
    Y = np.zeros((len(y), n_classes))  # Allocate a matrix of zeros for all examples and classes.
    Y[np.arange(len(y)), y] = 1.0  # Place a one at the true class column for each example.
    return Y  # Return the encoded target matrix.
```

### Data — swappable sources

The data section gives coded examples a common source of scalars, grids, and synthetic points. Activation lessons mostly use generated grids rather than external datasets, but the `DATA_SOURCE` switch still makes the notebook swappable.

```python
DATA_SOURCE = "two_moons"  # Choose "two_moons", "linear_blobs", or "activation_grid" for later examples.
if DATA_SOURCE == "two_moons":  # Use this branch for the nonlinear decision-boundary experiment.
    X_data, y_data = make_two_moons(n_samples=500, noise=0.10)  # Generate two interleaving moons with mild noise.
elif DATA_SOURCE == "linear_blobs":  # Use this branch when a nearly linear problem is desired.
    X0 = np.random.randn(250, 2) + np.array([-1.0, -1.0])  # Generate class-0 points around a lower-left center.
    X1 = np.random.randn(250, 2) + np.array([1.0, 1.0])  # Generate class-1 points around an upper-right center.
    X_data = np.vstack([X0, X1])  # Combine both classes into one feature matrix.
    y_data = np.r_[np.zeros(250, dtype=int), np.ones(250, dtype=int)]  # Create matching binary labels.
elif DATA_SOURCE == "activation_grid":  # Use this branch when only one-dimensional activation curves are needed.
    X_data = np.linspace(-6.0, 6.0, 500).reshape(-1, 1)  # Create a dense one-dimensional grid of pre-activations.
    y_data = (X_data[:, 0] > 0.0).astype(int)  # Create simple signs as labels for completeness.
else:  # Protect the notebook from silent misspellings.
    raise ValueError("DATA_SOURCE must be 'two_moons', 'linear_blobs', or 'activation_grid'.")  # Explain the allowed options.
plt.figure()  # Create a fresh figure for the selected data source.
if X_data.shape[1] == 2:  # Plot a scatter only when the selected data has two feature columns.
    plt.scatter(X_data[:, 0], X_data[:, 1], c=y_data, cmap="coolwarm", s=18, edgecolor="k", linewidth=0.2)  # Color points by class.
    plt.title(f"Selected data source: {DATA_SOURCE}")  # Label the data source on the plot.
    plt.xlabel("feature 1")  # Label the horizontal feature axis.
    plt.ylabel("feature 2")  # Label the vertical feature axis.
else:  # Plot a line when the selected data is a one-dimensional grid.
    plt.plot(X_data[:, 0], y_data, ".")  # Show the sign labels over the activation grid.
    plt.title("Activation grid data source")  # Label the grid plot.
    plt.xlabel("z")  # Label the pre-activation axis.
    plt.ylabel("label")  # Label the simple sign label axis.
plt.show()  # Render the data-source plot.
```

▶ What you'll see: for `two_moons`, the classes are not linearly separable, which makes activation choice visible in the decision-boundary example.

### 📖 Concept walkthrough — build each idea from scratch

Before the warm-up examples, we build the main activation-function ideas from scratch with tiny NumPy arrays and direct Matplotlib plots. The goal is to see both the forward shape $g(z)$ and the backward slope $g'(z)$, because neural networks learn through both. Variables use a `_w` suffix so this walkthrough does not collide with the later notebook examples.

```python
import numpy as np  # Use NumPy so every activation and derivative can be computed element by element on arrays.
import matplotlib.pyplot as plt  # Use Matplotlib so the forward curves and gradient curves are visible, not just printed.
np.random.seed(23019)  # Seed randomness so any sampled values in the walkthrough are reproducible.
```

#### 1. Saturating activations: sigmoid and tanh

**What:** Sigmoid maps real numbers to $(0,1)$, while $\tanh$ maps real numbers to $(-1,1)$. **Why:** these bounded outputs are useful when we want probabilities or centered hidden features. **Why this approach:** we implement the formulas directly, inspect a few tail values, then plot both curves and their derivatives so saturation is visible.

The sigmoid function is

$$
\sigma(z)=\frac{1}{1+\exp(-z)},
$$

and its derivative is $\sigma'(z)=\sigma(z)(1-\sigma(z))$. The tanh derivative is $\frac{d}{dz}\tanh(z)=1-\tanh^2(z)$. Both derivatives become tiny in the tails, which means the unit changes very little when $z$ is already very negative or very positive.

```python
def sigmoid_w(z_w):  # Define sigmoid from the formula so the forward computation is explicit.
    return 1.0 / (1.0 + np.exp(-z_w))  # Return sigma(z)=1/(1+exp(-z)) using NumPy's vectorized exponential.

def sigmoid_derivative_w(z_w):  # Define the sigmoid derivative as its own helper for backprop inspection.
    s_w = sigmoid_w(z_w)  # Reuse the sigmoid value because sigma'(z)=sigma(z)(1-sigma(z)).
    return s_w * (1.0 - s_w)  # Return the elementwise derivative, whose largest possible value is 0.25.

def tanh_derivative_w(z_w):  # Define the tanh derivative as its own helper for comparison.
    t_w = np.tanh(z_w)  # Compute tanh(z) once so the derivative formula stays readable.
    return 1.0 - t_w**2  # Return 1-tanh(z)^2, which also shrinks toward zero in both tails.
```

```python
z_probe_w = np.array([-8.0, -2.0, 0.0, 2.0, 8.0])  # Choose center and tail inputs so saturation can be inspected numerically.
sigmoid_values_w = sigmoid_w(z_probe_w)  # Compute sigmoid outputs for each probe input.
sigmoid_slopes_w = sigmoid_derivative_w(z_probe_w)  # Compute sigmoid slopes to see where gradients survive.
tanh_values_w = np.tanh(z_probe_w)  # Compute tanh outputs for the same probe inputs.
tanh_slopes_w = tanh_derivative_w(z_probe_w)  # Compute tanh slopes to compare tail behavior.
print("z:", z_probe_w)  # Print the inspected pre-activation values.
print("sigmoid(z):", np.round(sigmoid_values_w, 4))  # Print sigmoid outputs, which approach 0 and 1 in the tails.
print("sigmoid'(z):", np.round(sigmoid_slopes_w, 6))  # Print sigmoid derivatives, which approach 0 in the tails.
print("tanh(z):", np.round(tanh_values_w, 4))  # Print tanh outputs, which approach -1 and 1 in the tails.
print("tanh'(z):", np.round(tanh_slopes_w, 6))  # Print tanh derivatives, which also approach 0 in the tails.
```

▶ What you'll see: at $z=-8$ and $z=8$, the activation values are near their bounds and the derivative values are almost zero.

```python
z_grid_w = np.linspace(-8.0, 8.0, 500)  # Create a dense grid so the S-curves and derivative curves look smooth.
plt.figure(figsize=(8, 4.8))  # Create a readable figure for two activations and two derivative curves.
plt.plot(z_grid_w, sigmoid_w(z_grid_w), label="sigmoid")  # Plot the bounded sigmoid S-curve.
plt.plot(z_grid_w, np.tanh(z_grid_w), label="tanh")  # Plot the zero-centered tanh S-curve.
plt.plot(z_grid_w, sigmoid_derivative_w(z_grid_w), "--", label="sigmoid derivative")  # Plot sigmoid slopes to show saturation.
plt.plot(z_grid_w, tanh_derivative_w(z_grid_w), "--", label="tanh derivative")  # Plot tanh slopes to show saturation.
plt.axhline(0.0, color="black", linewidth=0.8)  # Draw the zero line so tanh centering and derivative baselines are clear.
plt.title("1: Sigmoid and tanh saturation")  # Title the figure with the subsection number.
plt.xlabel("z")  # Label the pre-activation input axis.
plt.ylabel("activation or derivative")  # Label the shared value axis for outputs and slopes.
plt.legend()  # Show which line corresponds to each function or derivative.
plt.show()  # Render the saturation plot.
```

▶ What you'll see: the solid curves flatten in both tails, and the dashed derivative curves collapse toward zero in the same regions.

*Why it's done this way: direct formulas plus tail probes make the forward saturation and backward gradient shrinkage inspectable without any neural-network machinery.*

#### 2. ReLU family: ReLU, Leaky ReLU, and ELU

**What:** ReLU keeps positive inputs linear and clips negative inputs to zero; Leaky ReLU and ELU keep a nonzero or smooth negative branch. **Why:** the positive linear branch avoids saturation for $z>0$, while the modified negative branches reduce the dead-unit problem. **Why this approach:** we implement all three functions and derivatives side by side so the difference is just the branch rule.

ReLU is $\operatorname{ReLU}(z)=\max(0,z)$, so its positive-side derivative is $1$ instead of a small saturated number. A dead ReLU happens when a unit stays in the $z<0$ region, where the derivative is $0$; Leaky ReLU uses a small slope there, and ELU uses $\alpha\exp(z)$ on the negative branch.

```python
epsilon_w = 0.05  # Choose a visible Leaky ReLU negative slope for the walkthrough plot.
alpha_w = 1.0  # Choose the common ELU alpha value that makes the curve smooth at zero.

def relu_w(z_w):  # Define ReLU directly from max(0,z).
    return np.maximum(0.0, z_w)  # Return zero for negative inputs and z for positive inputs.

def relu_derivative_w(z_w):  # Define the practical ReLU derivative used in many implementations.
    return (z_w > 0.0).astype(float)  # Return 1 on positive inputs and 0 otherwise, using 0 as the subgradient at zero.

def leaky_relu_w(z_w, epsilon=epsilon_w):  # Define Leaky ReLU with a configurable negative slope.
    return np.where(z_w > 0.0, z_w, epsilon * z_w)  # Return z on the right and epsilon*z on the left.

def leaky_relu_derivative_w(z_w, epsilon=epsilon_w):  # Define the Leaky ReLU derivative.
    return np.where(z_w > 0.0, 1.0, epsilon)  # Return 1 on the right and the small leak slope on the left.

def elu_w(z_w, alpha=alpha_w):  # Define ELU with a configurable alpha value.
    return np.where(z_w >= 0.0, z_w, alpha * (np.exp(z_w) - 1.0))  # Return z on the right and alpha(exp(z)-1) on the left.

def elu_derivative_w(z_w, alpha=alpha_w):  # Define the ELU derivative.
    return np.where(z_w >= 0.0, 1.0, alpha * np.exp(z_w))  # Return 1 on the right and alpha*exp(z) on the left.
```

```python
z_relu_probe_w = np.array([-3.0, -0.5, 0.0, 0.5, 3.0])  # Choose negative, zero, and positive inputs to expose each branch.
print("z:", z_relu_probe_w)  # Print the branch-test inputs.
print("ReLU:", np.round(relu_w(z_relu_probe_w), 3))  # Print ReLU outputs to show clipping below zero.
print("ReLU':", np.round(relu_derivative_w(z_relu_probe_w), 3))  # Print ReLU slopes to show the zero-gradient negative side.
print("Leaky ReLU:", np.round(leaky_relu_w(z_relu_probe_w), 3))  # Print Leaky ReLU outputs to show the small negative branch.
print("Leaky ReLU':", np.round(leaky_relu_derivative_w(z_relu_probe_w), 3))  # Print Leaky ReLU slopes to show nonzero negative gradients.
print("ELU:", np.round(elu_w(z_relu_probe_w), 3))  # Print ELU outputs to show the smooth negative curve.
print("ELU':", np.round(elu_derivative_w(z_relu_probe_w), 3))  # Print ELU slopes to show the positive but shrinking negative gradient.
```

▶ What you'll see: ReLU has exact zero output and zero slope for negative inputs, while Leaky ReLU and ELU still pass some gradient on the negative side.

```python
z_relu_grid_w = np.linspace(-4.0, 4.0, 500)  # Create a grid wide enough to compare negative and positive branches.
plt.figure(figsize=(8, 4.8))  # Create a readable figure for the three activation curves.
plt.plot(z_relu_grid_w, relu_w(z_relu_grid_w), label="ReLU")  # Plot the piecewise-linear ReLU curve.
plt.plot(z_relu_grid_w, leaky_relu_w(z_relu_grid_w), label="Leaky ReLU")  # Plot the leaky version with a small negative slope.
plt.plot(z_relu_grid_w, elu_w(z_relu_grid_w), label="ELU")  # Plot the ELU curve with its smooth negative branch.
plt.axhline(0.0, color="black", linewidth=0.8)  # Draw the zero output level for reference.
plt.axvline(0.0, color="black", linewidth=0.8)  # Draw the branch point where each activation changes rule.
plt.title("2: ReLU family activations")  # Title the figure with the subsection number.
plt.xlabel("z")  # Label the pre-activation input axis.
plt.ylabel("g(z)")  # Label the activation output axis.
plt.legend()  # Show which curve belongs to each activation.
plt.show()  # Render the ReLU-family activation plot.
```

▶ What you'll see: all three activations are linear for positive inputs, but they behave differently for negative inputs.

```python
plt.figure(figsize=(8, 4.8))  # Create a second figure focused on gradients.
plt.plot(z_relu_grid_w, relu_derivative_w(z_relu_grid_w), label="ReLU derivative")  # Plot ReLU's zero-or-one derivative.
plt.plot(z_relu_grid_w, leaky_relu_derivative_w(z_relu_grid_w), label="Leaky ReLU derivative")  # Plot the leaky derivative with a nonzero left side.
plt.plot(z_relu_grid_w, elu_derivative_w(z_relu_grid_w), label="ELU derivative")  # Plot ELU's smooth negative derivative.
plt.title("2: ReLU family derivatives")  # Title the derivative figure with the subsection number.
plt.xlabel("z")  # Label the pre-activation input axis.
plt.ylabel("g'(z)")  # Label the gradient multiplier axis.
plt.legend()  # Show which derivative curve belongs to each activation.
plt.show()  # Render the derivative comparison plot.
```

▶ What you'll see: ReLU preserves a derivative of $1$ for $z>0$, while Leaky ReLU and ELU avoid the fully flat negative-side derivative.

*Why it's done this way: comparing branch outputs and branch slopes together shows why ReLU trains well on positive activations and why Leaky ReLU or ELU can recover gradient flow when units drift negative.*

#### 3. Softmax as stable normalized exponentials

**What:** Softmax converts a vector of logits into positive probabilities that sum to one. **Why:** multiclass neural networks need a differentiable way to turn arbitrary scores into a probability distribution. **Why this approach:** we subtract the maximum logit before exponentiating, then verify that the probabilities are unchanged except for improved numerical safety.

Softmax is

$$
p_i=\frac{\exp(x_i)}{\sum_j \exp(x_j)}.
$$

Subtracting $\max_j x_j$ does not change the result because it multiplies every numerator and the denominator by the same constant factor. It prevents overflow because the largest shifted logit is $0$, so the largest exponential is $\exp(0)=1$.

```python
def stable_softmax_w(logits_w):  # Define a stable softmax helper for one vector of logits.
    logits_w = np.asarray(logits_w, dtype=float)  # Convert the input to floating point so exponentials and division are safe.
    shifted_w = logits_w - np.max(logits_w)  # Subtract the largest logit so no exponent is larger than exp(0).
    exp_shifted_w = np.exp(shifted_w)  # Exponentiate the shifted logits after the overflow guard.
    probabilities_w = exp_shifted_w / np.sum(exp_shifted_w)  # Normalize by the sum so the outputs add to one.
    return probabilities_w, shifted_w, exp_shifted_w  # Return intermediates so each step can be inspected.
```

```python
logits_w = np.array([12.0, 8.0, 3.0, -2.0])  # Create four class scores with one clearly largest class.
probabilities_w, shifted_logits_w, exp_shifted_w = stable_softmax_w(logits_w)  # Compute stable softmax and keep intermediates.
print("logits:", logits_w)  # Print the original scores before stabilization.
print("shifted logits:", shifted_logits_w)  # Print scores after subtracting the maximum logit.
print("exp(shifted):", np.round(exp_shifted_w, 6))  # Print exponentials after shifting to show they are bounded by 1.
print("softmax:", np.round(probabilities_w, 6))  # Print the final probability vector.
print("sum:", np.round(np.sum(probabilities_w), 6))  # Print the normalization check, which should be 1.
```

▶ What you'll see: the largest logit becomes shifted value $0$, its exponential is $1$, and the final probabilities sum to exactly one up to rounding.

```python
same_shift_w = 1000.0  # Choose a huge constant shift that would make naive exponentials unsafe.
prob_original_w, _, _ = stable_softmax_w(logits_w)  # Compute stable softmax on the original logits.
prob_shifted_w, _, _ = stable_softmax_w(logits_w + same_shift_w)  # Compute stable softmax after adding the same huge constant to every logit.
print("softmax(original):", np.round(prob_original_w, 6))  # Print the original stable probabilities.
print("softmax(original + 1000):", np.round(prob_shifted_w, 6))  # Print the shifted stable probabilities.
print("maximum absolute difference:", np.max(np.abs(prob_original_w - prob_shifted_w)))  # Print the numerical invariance check.
```

```python
plt.figure(figsize=(7, 4.5))  # Create a readable probability bar chart.
plt.bar(["class 0", "class 1", "class 2", "class 3"], probabilities_w, color=["#4c72b0", "#55a868", "#c44e52", "#8172b3"])  # Draw one bar for each softmax probability.
plt.ylim(0.0, 1.0)  # Use probability-scale vertical limits.
plt.title("3: Stable softmax probabilities")  # Title the figure with the subsection number.
plt.ylabel("probability")  # Label the probability axis.
plt.show()  # Render the softmax bar plot.
```

▶ What you'll see: the highest logit receives the largest probability, lower logits receive smaller positive probabilities, and the bars form a distribution.

*Why it's done this way: subtracting the maximum is a mathematically invisible rewrite of softmax that turns a fragile exponential calculation into a safe one.*

#### 4. Vanishing gradients through a deep chain

**What:** A deep network multiplies many local derivatives during backpropagation. **Why:** if those derivatives are repeatedly small, the product reaching early layers can become nearly zero. **Why this approach:** we multiply simple derivative values directly so the vanishing-gradient mechanism is visible before adding weights, losses, or optimizers.

For a depth-$L$ scalar chain, the chain rule gives

$$
\frac{\partial a_L}{\partial a_0}=\prod_{\ell=1}^L g'(z_\ell).
$$

Because $\sigma'(z)\le \frac{1}{4}$ for every $z$, even the best-case sigmoid chain is bounded by $(0.25)^L$. ReLU helps on active positive paths because its derivative is $1$, so the product can remain $1$ instead of shrinking.

```python
depths_w = np.arange(1, 31)  # Create depths from 1 to 30 so the product can be tracked layer by layer.
best_sigmoid_products_w = 0.25 ** depths_w  # Compute the largest possible sigmoid derivative product at each depth.
active_relu_products_w = np.ones_like(depths_w, dtype=float)  # Compute the derivative product for an all-active ReLU chain.
print("first five sigmoid products:", best_sigmoid_products_w[:5])  # Print early products so the shrinkage starts visibly.
print("sigmoid product at depth 30:", best_sigmoid_products_w[-1])  # Print the deep product to show how tiny it becomes.
print("ReLU product at depth 30:", active_relu_products_w[-1])  # Print the active ReLU product for contrast.
```

▶ What you'll see: multiplying values no larger than $0.25$ quickly makes the sigmoid product tiny, while the active ReLU product stays at $1$.

```python
z_chain_w = np.linspace(-4.0, 4.0, 30)  # Create a deterministic sequence of pre-activations across a hypothetical deep chain.
sigmoid_chain_slopes_w = sigmoid_derivative_w(z_chain_w)  # Compute the sigmoid derivative at every layer in the chain.
sigmoid_chain_products_w = np.cumprod(sigmoid_chain_slopes_w)  # Multiply derivatives cumulatively to simulate backprop to earlier layers.
relu_chain_slopes_w = relu_derivative_w(np.ones_like(z_chain_w))  # Use positive ReLU pre-activations so every active derivative is 1.
relu_chain_products_w = np.cumprod(relu_chain_slopes_w)  # Multiply active ReLU derivatives cumulatively for comparison.
print("sample sigmoid slopes:", np.round(sigmoid_chain_slopes_w[[0, 10, 20, 29]], 6))  # Print representative sigmoid slopes from the chain.
print("final sigmoid chain product:", sigmoid_chain_products_w[-1])  # Print the final chain product after all layers.
print("final active ReLU chain product:", relu_chain_products_w[-1])  # Print the final active ReLU product after all layers.
```

```python
plt.figure(figsize=(8, 4.8))  # Create a readable figure for gradient products over depth.
plt.semilogy(depths_w, best_sigmoid_products_w, marker="o", label="sigmoid best-case $(0.25)^L$")  # Plot sigmoid products on a log scale so tiny values remain visible.
plt.semilogy(depths_w, active_relu_products_w, marker="s", label="active ReLU product")  # Plot the all-active ReLU product for contrast.
plt.semilogy(depths_w, sigmoid_chain_products_w, marker=".", label="sample sigmoid chain")  # Plot the products from the deterministic sigmoid chain.
plt.title("4: Vanishing gradients with depth")  # Title the figure with the subsection number.
plt.xlabel("depth L")  # Label the horizontal axis as network depth.
plt.ylabel("gradient product")  # Label the vertical axis as the cumulative chain-rule multiplier.
plt.legend()  # Show which curve corresponds to each gradient-product scenario.
plt.show()  # Render the vanishing-gradient plot.
```

▶ What you'll see: the sigmoid products fall rapidly toward zero as depth increases, while an active ReLU path stays flat at $1$.

*Why it's done this way: multiplying derivatives directly isolates the chain-rule bottleneck, making clear why saturated sigmoid or tanh units can stall early-layer learning and why active ReLU units preserve gradient flow.*

### 🟢 Basics (warm-up)

#### B1. Evaluate one ReLU value and slope

Goal: compute one ReLU output and its derivative at $z=-2$.

```python
z = np.array([-2.0])  # Store the single pre-activation value as a one-element array for reuse with vectorized helpers.
value = relu(z)[0]  # Apply ReLU and extract the scalar output.
slope = relu_derivative(z)[0]  # Apply the ReLU derivative rule and extract the scalar slope.
print(f"ReLU({z[0]:.1f}) = {value:.1f}")  # Print the forward-pass value.
print(f"ReLU'({z[0]:.1f}) = {slope:.1f}")  # Print the backward-pass slope.
```

The calculation is

$$
\operatorname{ReLU}(-2)=\max(0,-2)=0,
$$

and since $-2<0$,

$$
\operatorname{ReLU}'(-2)=0.
$$

$$
\boxed{\operatorname{ReLU}(-2)=0,\quad \operatorname{ReLU}'(-2)=0}
$$

#### B2. Compute sigmoid at zero

Goal: verify that sigmoid maps $0$ to the middle of the probability interval.

```python
z0 = np.array([0.0])  # Store the scalar z=0 as a one-element array for vectorized evaluation.
s0 = sigmoid(z0)[0]  # Compute sigma(0) using the reusable sigmoid helper.
d0 = sigmoid_derivative(z0)[0]  # Compute sigma'(0) using sigma(z)(1-sigma(z)).
plt.figure()  # Create a fresh figure for the sigmoid point.
grid = np.linspace(-6.0, 6.0, 400)  # Create a smooth grid so the sigmoid curve is visible.
plt.plot(grid, sigmoid(grid), label="sigmoid")  # Plot the full sigmoid curve for context.
plt.scatter([0.0], [s0], color="red", zorder=3, label="sigma(0)")  # Mark the evaluated point in red.
plt.title("B2: sigmoid at zero")  # Give the plot a descriptive title.
plt.xlabel("z")  # Label the pre-activation axis.
plt.ylabel("sigma(z)")  # Label the activation axis.
plt.legend()  # Show the curve and point labels.
plt.show()  # Render the plot.
print(f"sigmoid(0) = {s0:.3f}")  # Print the activation value.
print(f"sigmoid'(0) = {d0:.3f}")  # Print the derivative value.
```

▶ What you'll see: the point $(0,0.5)$ sits exactly halfway between the sigmoid's lower and upper asymptotes.

By hand,

$$
\sigma(0)=\frac{1}{1+e^{-0}}
=\frac{1}{1+1}
=\frac12.
$$

Also,

$$
\sigma'(0)=\sigma(0)(1-\sigma(0))
=\frac12\left(1-\frac12\right)
=\frac14.
$$

$$
\boxed{\sigma(0)=0.5,\quad \sigma'(0)=0.25}
$$

#### B3. Softmax a three-score vector

Goal: convert logits $(1,0,-1)$ into probabilities and check that they sum to one.

```python
logits_b3 = np.array([1.0, 0.0, -1.0])  # Store the three class scores in descending order.
prob_b3 = softmax(logits_b3)  # Apply numerically stable softmax to obtain probabilities.
plt.figure()  # Create a fresh figure for the softmax probabilities.
plt.bar(["class 0", "class 1", "class 2"], prob_b3, color=["#4c72b0", "#55a868", "#c44e52"])  # Draw one bar per class.
plt.ylim(0.0, 1.0)  # Use probability-scale vertical limits.
plt.title("B3: softmax probabilities for logits (1, 0, -1)")  # Give the plot a descriptive title.
plt.ylabel("probability")  # Label the probability axis.
plt.show()  # Render the probability bar chart.
print("probabilities:", np.round(prob_b3, 4))  # Print probabilities rounded for readability.
print("sum:", np.round(prob_b3.sum(), 4))  # Print the sum-to-one check.
```

▶ What you'll see: the largest logit gets the largest probability, but all probabilities remain positive and sum to one.

Hand computation:

$$
\sum_j e^{x_j}=e^1+e^0+e^{-1}=e+1+e^{-1}.
$$

Therefore

$$
p_1=\frac{e}{e+1+e^{-1}},
\quad
p_2=\frac{1}{e+1+e^{-1}},
\quad
p_3=\frac{e^{-1}}{e+1+e^{-1}}.
$$

Using $e\approx2.7183$ and $e^{-1}\approx0.3679$,

$$
e+1+e^{-1}\approx2.7183+1+0.3679=4.0862.
$$

So

$$
p\approx
\left(
\frac{2.7183}{4.0862},
\frac{1}{4.0862},
\frac{0.3679}{4.0862}
\right)
=(0.6652,0.2447,0.0900).
$$

$$
\boxed{\operatorname{softmax}(1,0,-1)\approx(0.6652,0.2447,0.0900)}
$$


#### B4. Compute tanh at zero

Goal: evaluate one zero-centered activation value.

```python
z_b4 = np.array([0.0])  # Store the scalar pre-activation z=0.
tanh_b4 = np.tanh(z_b4)[0]  # Apply NumPy's tanh function and extract the scalar.
print(f"tanh(0) = {tanh_b4:.1f}")  # Print the activation value.
```

By formula,

$$
\tanh(0)=\frac{e^0-e^{-0}}{e^0+e^{-0}}=\frac{1-1}{1+1}=0.
$$

$$
\boxed{\tanh(0)=0}
$$

#### B5. Compute one Leaky ReLU value

Goal: evaluate the negative branch of Leaky ReLU.

```python
z_b5 = np.array([-3.0])  # Store a negative pre-activation value.
value_b5 = leaky_relu(z_b5)[0]  # Apply Leaky ReLU with the lesson's EPSILON.
print(f"LeakyReLU({z_b5[0]:.1f}) = {value_b5:.2f}")  # Print the forward value.
```

Since $z=-3<0$ and $\epsilon=0.01$,

$$
\operatorname{LeakyReLU}(-3)=0.01(-3)=-0.03.
$$

$$
\boxed{\operatorname{LeakyReLU}(-3)=-0.03}
$$

#### B6. Compute one ELU value

Goal: evaluate the negative exponential branch of ELU.

```python
z_b6 = np.array([-1.0])  # Store a negative pre-activation for the ELU branch.
value_b6 = elu(z_b6)[0]  # Apply ELU with the lesson's ALPHA.
print(f"ELU({z_b6[0]:.1f}) = {value_b6:.3f}")  # Print the forward value.
```

With $\alpha=1$ and $z=-1$,

$$
\operatorname{ELU}(-1)=e^{-1}-1\approx0.3679-1=-0.6321.
$$

$$
\boxed{\operatorname{ELU}(-1)\approx-0.632}
$$

#### B7. Compute the sigmoid derivative at one point

Goal: use $\sigma'(z)=\sigma(z)(1-\sigma(z))$ once.

```python
z_b7 = np.array([2.0])  # Choose one positive pre-activation.
s_b7 = sigmoid(z_b7)[0]  # Compute sigmoid(z).
d_b7 = sigmoid_derivative(z_b7)[0]  # Compute sigmoid'(z).
print(f"sigmoid(2) = {s_b7:.4f}")  # Print the activation value.
print(f"sigmoid'(2) = {d_b7:.4f}")  # Print the derivative value.
```

Using $\sigma(2)\approx0.8808$,

$$
\sigma'(2)=0.8808(1-0.8808)\approx0.1050.
$$

$$
\boxed{\sigma'(2)\approx0.105}
$$

#### B8. Compute ReLU derivatives at two points

Goal: compare the left and right slopes of ReLU.

```python
z_b8 = np.array([-1.0, 2.0])  # Store one negative and one positive pre-activation.
deriv_b8 = relu_derivative(z_b8)  # Apply the practical ReLU derivative helper.
print(dict(zip(z_b8, deriv_b8)))  # Print each z value with its slope.
```

The derivative rule gives

$$
\operatorname{ReLU}'(-1)=0,
\qquad
\operatorname{ReLU}'(2)=1.
$$

$$
\boxed{\text{left slope }0,\quad\text{right slope }1}
$$

#### B9. Plot one activation over a grid

Goal: draw one activation curve before comparing many curves.

```python
grid_b9 = np.linspace(-4.0, 4.0, 200)  # Create evenly spaced pre-activation values.
values_b9 = np.tanh(grid_b9)  # Evaluate tanh on the whole grid.
plt.figure()  # Create a fresh plot.
plt.plot(grid_b9, values_b9, label="tanh(z)")  # Draw the activation curve.
plt.axhline(0.0, color="black", linewidth=0.8)  # Mark the zero output line for reference.
plt.title("B9: tanh over a grid")  # Title the plot.
plt.xlabel("z")  # Label the pre-activation axis.
plt.ylabel("tanh(z)")  # Label the activation axis.
plt.legend()  # Show the curve label.
plt.show()  # Render the plot.
```

▶ What you'll see: tanh is zero-centered and saturates near $-1$ and $1$.

#### B10. Compare sigmoid and tanh at $z=-2$ and $z=2$

Goal: evaluate two activations at symmetric inputs.

```python
z_b10 = np.array([-2.0, 2.0])  # Choose symmetric negative and positive pre-activations.
sig_b10 = sigmoid(z_b10)  # Evaluate sigmoid at both points.
tanh_b10 = np.tanh(z_b10)  # Evaluate tanh at both points.
for z, s, t in zip(z_b10, sig_b10, tanh_b10):  # Print one comparison row per input.
    print(f"z={z:+.0f}: sigmoid={s:.3f}, tanh={t:.3f}")  # Show both activation values.
```

The values are approximately

$$
\sigma(-2)=0.119,\quad \sigma(2)=0.881,
$$

while

$$
\tanh(-2)=-0.964,\quad \tanh(2)=0.964.
$$

$$
\boxed{\text{sigmoid is positive; tanh is zero-centered.}}
$$

### 🟡 Easy

#### E1. Derive and evaluate sigmoid gradient

Goal: derive $\sigma'(z)$ and evaluate it at $z\in\{-2,0,2\}$.

Start with

$$
\sigma(z)=\frac{1}{1+e^{-z}}=(1+e^{-z})^{-1}.
$$

Differentiate using the chain rule:

$$
\frac{d}{dz}\sigma(z)
= -1(1+e^{-z})^{-2}\cdot \frac{d}{dz}(1+e^{-z}).
$$

Since

$$
\frac{d}{dz}(1+e^{-z})=-e^{-z},
$$

we get

$$
\sigma'(z)=\frac{e^{-z}}{(1+e^{-z})^2}.
$$

Now rewrite this in terms of $\sigma(z)$:

$$
\sigma(z)(1-\sigma(z))
=\frac{1}{1+e^{-z}}\left(1-\frac{1}{1+e^{-z}}\right).
$$

Simplify the second factor:

$$
1-\frac{1}{1+e^{-z}}
=\frac{1+e^{-z}-1}{1+e^{-z}}
=\frac{e^{-z}}{1+e^{-z}}.
$$

Therefore

$$
\sigma(z)(1-\sigma(z))
=\frac{1}{1+e^{-z}}\cdot\frac{e^{-z}}{1+e^{-z}}
=\frac{e^{-z}}{(1+e^{-z})^2}
=\sigma'(z).
$$

So

$$
\boxed{\sigma'(z)=\sigma(z)(1-\sigma(z))}.
$$

Evaluate at the three requested points.

For $z=-2$,

$$
\sigma(-2)=\frac{1}{1+e^2}\approx\frac{1}{1+7.3891}=0.1192,
$$

so

$$
\sigma'(-2)=0.1192(1-0.1192)=0.1192(0.8808)=0.1050.
$$

For $z=0$,

$$
\sigma(0)=\frac12,
\qquad
\sigma'(0)=\frac12\left(1-\frac12\right)=\frac14=0.25.
$$

For $z=2$,

$$
\sigma(2)=\frac{1}{1+e^{-2}}\approx\frac{1}{1+0.1353}=0.8808,
$$

so

$$
\sigma'(2)=0.8808(1-0.8808)=0.8808(0.1192)=0.1050.
$$

$$
\boxed{
\sigma'(-2)\approx0.1050,
\quad
\sigma'(0)=0.2500,
\quad
\sigma'(2)\approx0.1050
}
$$

```python
points_e1 = np.array([-2.0, 0.0, 2.0])  # Store the three hand-computed points for visual confirmation.
grid_e1 = np.linspace(-6.0, 6.0, 500)  # Create a dense grid for smooth sigmoid and derivative curves.
plt.figure()  # Create a fresh figure for the overlay.
plt.plot(grid_e1, sigmoid(grid_e1), label="sigmoid")  # Plot sigmoid values over the grid.
plt.plot(grid_e1, sigmoid_derivative(grid_e1), label="sigmoid derivative")  # Plot sigmoid derivatives over the same grid.
plt.scatter(points_e1, sigmoid_derivative(points_e1), color="red", zorder=3, label="sampled derivatives")  # Mark the derivative values from the hand calculation.
plt.title("E1: sigmoid and its derivative")  # Give the plot a descriptive title.
plt.xlabel("z")  # Label the pre-activation axis.
plt.ylabel("value")  # Label the shared value axis.
plt.legend()  # Show curve labels.
plt.show()  # Render the overlay plot.
```

▶ What you'll see: the derivative peaks at $z=0$ and shrinks symmetrically in the two tails.

#### E2. Derive and evaluate tanh gradient

Goal: derive $\frac{d}{dz}\tanh(z)$ and evaluate it at $z\in\{-1,0,1\}$.

Start with

$$
\tanh(z)=\frac{e^z-e^{-z}}{e^z+e^{-z}}.
$$

Let

$$
u=e^z-e^{-z},
\qquad
v=e^z+e^{-z}.
$$

Then

$$
u'=e^z+e^{-z}=v,
\qquad
v'=e^z-e^{-z}=u.
$$

By the quotient rule,

$$
\frac{d}{dz}\tanh(z)
=\frac{u'v-uv'}{v^2}
=\frac{v^2-u^2}{v^2}
=1-\left(\frac{u}{v}\right)^2.
$$

Since $u/v=\tanh(z)$,

$$
\boxed{\frac{d}{dz}\tanh(z)=1-\tanh^2(z)}.
$$

Evaluate at $z=-1$:

$$
\tanh(-1)\approx -0.7616,
$$

so

$$
\tanh'(-1)=1-(-0.7616)^2=1-0.5800=0.4200.
$$

Evaluate at $z=0$:

$$
\tanh(0)=0,
\qquad
\tanh'(0)=1-0^2=1.
$$

Evaluate at $z=1$:

$$
\tanh(1)\approx0.7616,
$$

so

$$
\tanh'(1)=1-(0.7616)^2=1-0.5800=0.4200.
$$

$$
\boxed{
\tanh'(-1)\approx0.4200,
\quad
\tanh'(0)=1.0000,
\quad
\tanh'(1)\approx0.4200
}
$$

```python
points_e2 = np.array([-1.0, 0.0, 1.0])  # Store the three hand-computed points for visual confirmation.
grid_e2 = np.linspace(-4.0, 4.0, 500)  # Create a dense grid for smooth tanh and derivative curves.
plt.figure()  # Create a fresh figure for the overlay.
plt.plot(grid_e2, np.tanh(grid_e2), label="tanh")  # Plot tanh values over the grid.
plt.plot(grid_e2, tanh_derivative(grid_e2), label="tanh derivative")  # Plot tanh derivatives over the same grid.
plt.scatter(points_e2, tanh_derivative(points_e2), color="red", zorder=3, label="sampled derivatives")  # Mark the derivative values from the hand calculation.
plt.title("E2: tanh and its derivative")  # Give the plot a descriptive title.
plt.xlabel("z")  # Label the pre-activation axis.
plt.ylabel("value")  # Label the shared value axis.
plt.legend()  # Show curve labels.
plt.show()  # Render the overlay plot.
```

▶ What you'll see: tanh is zero-centered, and its derivative reaches $1$ at the origin before decaying in both tails.

#### E3. ReLU and Leaky ReLU by cases

Goal: compute ReLU and Leaky ReLU values and slopes at $z=(-3,0,4)$ with $\epsilon=0.01$.

For ReLU,

$$
\operatorname{ReLU}(z)=
\begin{cases}
0, & z<0,\\
z, & z\ge 0.
\end{cases}
$$

At $z=-3$,

$$
\operatorname{ReLU}(-3)=0,
\qquad
\operatorname{ReLU}'(-3)=0.
$$

At $z=0$,

$$
\operatorname{ReLU}(0)=0.
$$

The derivative is not classically defined because the left slope is $0$ and the right slope is $1$:

$$
\lim_{h\to0^-}\frac{\operatorname{ReLU}(h)-\operatorname{ReLU}(0)}{h}=0,
\qquad
\lim_{h\to0^+}\frac{\operatorname{ReLU}(h)-\operatorname{ReLU}(0)}{h}=1.
$$

In implementations, a subgradient such as $0$ is often chosen.

At $z=4$,

$$
\operatorname{ReLU}(4)=4,
\qquad
\operatorname{ReLU}'(4)=1.
$$

Thus

$$
\boxed{
\operatorname{ReLU}(-3,0,4)=(0,0,4),
\quad
\operatorname{ReLU}'(-3,0,4)=(0,\text{subgradient},1)
}
$$

For Leaky ReLU with $\epsilon=0.01$,

$$
\operatorname{LeakyReLU}(z)=
\begin{cases}
0.01z, & z<0,\\
z, & z\ge0.
\end{cases}
$$

At $z=-3$,

$$
\operatorname{LeakyReLU}(-3)=0.01(-3)=-0.03,
\qquad
\operatorname{LeakyReLU}'(-3)=0.01.
$$

At $z=0$,

$$
\operatorname{LeakyReLU}(0)=0.
$$

The left and right slopes are $0.01$ and $1$, so implementations choose a subgradient at zero.

At $z=4$,

$$
\operatorname{LeakyReLU}(4)=4,
\qquad
\operatorname{LeakyReLU}'(4)=1.
$$

Therefore

$$
\boxed{
\operatorname{LeakyReLU}(-3,0,4)=(-0.03,0,4),
\quad
\operatorname{LeakyReLU}'(-3,0,4)=(0.01,\text{subgradient},1)
}
$$

```python
points_e3 = np.array([-3.0, 0.0, 4.0])  # Store the requested case-study points.
grid_e3 = np.linspace(-5.0, 5.0, 500)  # Create a grid wide enough to show both negative and positive branches.
plt.figure()  # Create a fresh figure for the piecewise functions.
plt.plot(grid_e3, relu(grid_e3), label="ReLU")  # Plot the ReLU piecewise function.
plt.plot(grid_e3, leaky_relu(grid_e3), label="Leaky ReLU, epsilon=0.01")  # Plot the Leaky ReLU piecewise function.
plt.scatter(points_e3, relu(points_e3), color="blue", zorder=3, label="ReLU sampled values")  # Mark ReLU values at the requested points.
plt.scatter(points_e3, leaky_relu(points_e3), color="orange", zorder=3, label="Leaky sampled values")  # Mark Leaky ReLU values at the requested points.
plt.title("E3: ReLU and Leaky ReLU by cases")  # Give the plot a descriptive title.
plt.xlabel("z")  # Label the pre-activation axis.
plt.ylabel("activation")  # Label the activation axis.
plt.legend()  # Show all curve and point labels.
plt.show()  # Render the piecewise graph.
```

▶ What you'll see: the only visible difference is on the negative side, where Leaky ReLU keeps a small nonzero slope.

#### E4. Plot activation functions and derivatives

Goal: compare sigmoid, tanh, ReLU, Leaky ReLU, and ELU on the same grid.

```python
grid_e4 = np.linspace(-6.0, 6.0, 800)  # Create a wide grid so saturation and linear regions are both visible.
activations_e4 = {  # Store each activation curve in a dictionary for consistent plotting.
    "sigmoid": sigmoid(grid_e4),  # Compute sigmoid values on the grid.
    "tanh": np.tanh(grid_e4),  # Compute tanh values on the grid.
    "ReLU": relu(grid_e4),  # Compute ReLU values on the grid.
    "Leaky ReLU": leaky_relu(grid_e4),  # Compute Leaky ReLU values on the grid.
    "ELU": elu(grid_e4),  # Compute ELU values on the grid.
}  # Close the activation dictionary.
derivatives_e4 = {  # Store each derivative curve in a dictionary for consistent plotting.
    "sigmoid'": sigmoid_derivative(grid_e4),  # Compute sigmoid derivative values on the grid.
    "tanh'": tanh_derivative(grid_e4),  # Compute tanh derivative values on the grid.
    "ReLU'": relu_derivative(grid_e4),  # Compute ReLU derivative values on the grid.
    "Leaky ReLU'": leaky_relu_derivative(grid_e4),  # Compute Leaky ReLU derivative values on the grid.
    "ELU'": elu_derivative(grid_e4),  # Compute ELU derivative values on the grid.
}  # Close the derivative dictionary.
fig, axes = plt.subplots(1, 2, figsize=(13, 4))  # Create side-by-side panels for functions and derivatives.
for name, values in activations_e4.items():  # Loop through every activation curve.
    axes[0].plot(grid_e4, values, label=name)  # Draw the activation curve on the left panel.
for name, values in derivatives_e4.items():  # Loop through every derivative curve.
    axes[1].plot(grid_e4, values, label=name)  # Draw the derivative curve on the right panel.
axes[0].set_title("Activation functions")  # Title the left panel.
axes[0].set_xlabel("z")  # Label the left horizontal axis.
axes[0].set_ylabel("g(z)")  # Label the left vertical axis.
axes[0].legend()  # Show activation labels.
axes[1].set_title("Activation derivatives")  # Title the right panel.
axes[1].set_xlabel("z")  # Label the right horizontal axis.
axes[1].set_ylabel("g'(z)")  # Label the right vertical axis.
axes[1].legend()  # Show derivative labels.
plt.tight_layout()  # Prevent labels from overlapping.
plt.show()  # Render the comparison figure.
```

▶ What you'll see: sigmoid and tanh derivatives collapse in the tails, ReLU derivatives are zero on the negative side, and Leaky ReLU/ELU keep negative-side gradients alive.

#### E5. Softmax probabilities for three class scores

Goal: compute softmax by hand for logits $(2,1,0)$.

Start with

$$
x=(2,1,0).
$$

The unnormalized exponentials are

$$
e^{x_1}=e^2,
\qquad
e^{x_2}=e^1,
\qquad
e^{x_3}=e^0=1.
$$

The normalization constant is

$$
Z=e^2+e+1.
$$

Using

$$
e^2\approx7.3891,
\qquad
e\approx2.7183,
$$

we obtain

$$
Z\approx7.3891+2.7183+1=11.1074.
$$

Thus

$$
p_1=\frac{e^2}{Z}\approx\frac{7.3891}{11.1074}=0.6652,
$$

$$
p_2=\frac{e}{Z}\approx\frac{2.7183}{11.1074}=0.2447,
$$

and

$$
p_3=\frac{1}{Z}\approx\frac{1}{11.1074}=0.0900.
$$

Check normalization:

$$
p_1+p_2+p_3\approx0.6652+0.2447+0.0900=0.9999\approx1.
$$

$$
\boxed{\operatorname{softmax}(2,1,0)\approx(0.6652,0.2447,0.0900)}
$$

The probability vector is identical to B3's result because $(2,1,0)=(1,0,-1)+(1,1,1)$ and softmax is unchanged by adding a constant to all logits.

```python
logits_e5 = np.array([2.0, 1.0, 0.0])  # Store the logits from the hand calculation.
prob_e5 = softmax(logits_e5)  # Compute stable softmax probabilities.
plt.figure()  # Create a fresh figure for the probability bar chart.
plt.bar(["class 1", "class 2", "class 3"], prob_e5, color=["#4c72b0", "#55a868", "#c44e52"])  # Draw one probability bar per class.
plt.ylim(0.0, 1.0)  # Use probability-scale vertical limits.
plt.title("E5: softmax for logits (2, 1, 0)")  # Give the plot a descriptive title.
plt.ylabel("probability")  # Label the probability axis.
plt.text(1.0, 0.85, f"sum = {prob_e5.sum():.4f}", ha="center")  # Annotate the sum-to-one check.
plt.show()  # Render the bar chart.
print(np.round(prob_e5, 4))  # Print probabilities rounded to match the hand calculation.
```

▶ What you'll see: adding the same constant to all logits does not change the softmax probabilities.

### 🔴 Advanced

#### A1. Softmax Jacobian and cross-entropy gradient

Goal: derive the softmax Jacobian and the gradient of cross-entropy for logits $(1,2,-1)$ with class-2 target. We use zero-based code indexing later, but by hand call the second class the target.

Let

$$
x=(1,2,-1).
$$

First compute exponentials:

$$
e^1=e,
\qquad
e^2=e^2,
\qquad
e^{-1}=e^{-1}.
$$

The normalizer is

$$
Z=e+e^2+e^{-1}
\approx2.7183+7.3891+0.3679=10.4753.
$$

Therefore

$$
p_1=\frac{e}{Z}\approx\frac{2.7183}{10.4753}=0.2595,
$$

$$
p_2=\frac{e^2}{Z}\approx\frac{7.3891}{10.4753}=0.7054,
$$

and

$$
p_3=\frac{e^{-1}}{Z}\approx\frac{0.3679}{10.4753}=0.0351.
$$

So

$$
p\approx(0.2595,0.7054,0.0351).
$$

For softmax,

$$
p_i=\frac{e^{x_i}}{\sum_k e^{x_k}}.
$$

Differentiate with respect to $x_j$. If $i=j$,

$$
\frac{\partial p_i}{\partial x_i}
=\frac{e^{x_i}Z-e^{x_i}e^{x_i}}{Z^2}
=\frac{e^{x_i}}{Z}\left(1-\frac{e^{x_i}}{Z}\right)
=p_i(1-p_i).
$$

If $i\ne j$,

$$
\frac{\partial p_i}{\partial x_j}
=\frac{0\cdot Z-e^{x_i}e^{x_j}}{Z^2}
=-\frac{e^{x_i}}{Z}\frac{e^{x_j}}{Z}
=-p_i p_j.
$$

Combining both cases,

$$
\boxed{\frac{\partial p_i}{\partial x_j}=p_i(\mathbf{1}_{i=j}-p_j)}.
$$

Using $p\approx(0.2595,0.7054,0.0351)$, the Jacobian is

$$
J=\operatorname{diag}(p)-pp^\top.
$$

Compute diagonal terms:

$$
J_{11}=0.2595(1-0.2595)=0.1922,
$$

$$
J_{22}=0.7054(1-0.7054)=0.2078,
$$

$$
J_{33}=0.0351(1-0.0351)=0.0339.
$$

Compute off-diagonal terms:

$$
J_{12}=J_{21}=-0.2595(0.7054)=-0.1831,
$$

$$
J_{13}=J_{31}=-0.2595(0.0351)=-0.0091,
$$

$$
J_{23}=J_{32}=-0.7054(0.0351)=-0.0248.
$$

So

$$
\boxed{
J\approx
\begin{bmatrix}
0.1922 & -0.1831 & -0.0091\\
-0.1831 & 0.2078 & -0.0248\\
-0.0091 & -0.0248 & 0.0339
\end{bmatrix}}
$$

For one-hot target class 2,

$$
y=(0,1,0).
$$

Cross-entropy is

$$
L=-\sum_i y_i\log p_i=-\log p_2.
$$

The standard softmax-cross-entropy simplification gives

$$
\frac{\partial L}{\partial x}=p-y.
$$

Therefore

$$
\frac{\partial L}{\partial x}
\approx(0.2595,0.7054,0.0351)-(0,1,0)
=(0.2595,-0.2946,0.0351).
$$

$$
\boxed{\nabla_x L\approx(0.2595,-0.2946,0.0351)}
$$

```python
logits_a1 = np.array([1.0, 2.0, -1.0])  # Store the logits from the hand derivation.
prob_a1 = softmax(logits_a1)  # Compute the softmax probabilities stably.
J_a1 = softmax_jacobian(prob_a1)  # Compute the Jacobian diag(p)-pp^T.
target_a1 = np.array([0.0, 1.0, 0.0])  # Encode class 2 as a one-hot target vector.
grad_a1 = prob_a1 - target_a1  # Use the softmax-cross-entropy gradient simplification p-y.
fig, axes = plt.subplots(1, 2, figsize=(11, 4))  # Create panels for the Jacobian and gradient.
im = axes[0].imshow(J_a1, cmap="coolwarm", vmin=-0.25, vmax=0.25)  # Show the Jacobian as a signed heatmap.
axes[0].set_title("Softmax Jacobian")  # Title the Jacobian panel.
axes[0].set_xlabel("logit index j")  # Label Jacobian columns.
axes[0].set_ylabel("probability index i")  # Label Jacobian rows.
plt.colorbar(im, ax=axes[0])  # Add a color scale for derivative magnitude.
axes[1].bar(["class 1", "class 2", "class 3"], grad_a1, color=["#4c72b0", "#55a868", "#c44e52"])  # Plot the p-y gradient vector.
axes[1].axhline(0.0, color="black", linewidth=1.0)  # Draw a zero line to separate positive and negative updates.
axes[1].set_title("Cross-entropy gradient p - y")  # Title the gradient panel.
axes[1].set_ylabel("gradient")  # Label the gradient axis.
plt.tight_layout()  # Prevent labels and colorbar from overlapping.
plt.show()  # Render the advanced softmax visualization.
print("p =", np.round(prob_a1, 4))  # Print probabilities for comparison with the hand calculation.
print("J =\n", np.round(J_a1, 4))  # Print the Jacobian matrix for comparison with the hand calculation.
print("p - y =", np.round(grad_a1, 4))  # Print the gradient vector for comparison with the hand calculation.
```

▶ What you'll see: increasing the target logit lowers the loss, so the target-class gradient is negative while non-target gradients are positive.

#### A2. Saturation and vanishing gradients

Goal: plot every activation and derivative overlaid, then show how sigmoid/tanh derivatives approach zero in the tails.

```python
grid_a2 = np.linspace(-12.0, 12.0, 1200)  # Create a very wide grid to emphasize saturation in the tails.
curves_a2 = [  # Store activation names, functions, derivatives, and plotting limits together.
    ("sigmoid", sigmoid(grid_a2), sigmoid_derivative(grid_a2), (-0.1, 1.1)),  # Package sigmoid values and derivatives.
    ("tanh", np.tanh(grid_a2), tanh_derivative(grid_a2), (-1.1, 1.1)),  # Package tanh values and derivatives.
    ("ReLU", relu(grid_a2), relu_derivative(grid_a2), (-1.0, 12.0)),  # Package ReLU values and derivatives.
    ("Leaky ReLU", leaky_relu(grid_a2), leaky_relu_derivative(grid_a2), (-1.0, 12.0)),  # Package Leaky ReLU values and derivatives.
    ("ELU", elu(grid_a2), elu_derivative(grid_a2), (-1.2, 12.0)),  # Package ELU values and derivatives.
]  # Close the list of curve packages.
fig, axes = plt.subplots(len(curves_a2), 1, figsize=(8, 14), sharex=True)  # Create one row per activation.
for ax, (name, values, derivs, ylim) in zip(axes, curves_a2):  # Iterate through axes and activation packages together.
    ax.plot(grid_a2, values, label=f"{name} g(z)")  # Plot the activation function.
    ax.plot(grid_a2, derivs, linestyle="--", label=f"{name} g'(z)")  # Overlay the derivative with a dashed line.
    ax.set_ylim(*ylim)  # Use activation-specific limits so both curves remain readable.
    ax.set_title(f"{name}: function and derivative overlaid")  # Title the row with the activation name.
    ax.set_ylabel("value")  # Label the shared vertical meaning.
    ax.legend(loc="upper left")  # Display function and derivative labels.
axes[-1].set_xlabel("z")  # Label the shared pre-activation axis on the bottom row.
plt.tight_layout()  # Prevent subplot titles from overlapping.
plt.show()  # Render the overlay figure.
```

▶ What you'll see: sigmoid and tanh flatten at large $|z|$, while ReLU-like units preserve a slope of one on the positive side.

Now quantify tail derivatives.

```python
tail_points_a2 = np.array([-12.0, -6.0, 0.0, 6.0, 12.0])  # Choose representative tail and center points.
summary_a2 = np.c_[tail_points_a2, sigmoid_derivative(tail_points_a2), tanh_derivative(tail_points_a2)]  # Combine z, sigmoid', and tanh' into one table.
print("columns: z, sigmoid'(z), tanh'(z)")  # Print the meaning of each table column.
print(np.round(summary_a2, 8))  # Print the derivative table with enough precision to show near-zero tails.
```

The product problem is immediate. If a chain has $L=20$ layers and the derivative at each layer is at most $0.25$, then

$$
\left|\frac{\partial a_{20}}{\partial a_0}\right|
\le (0.25)^{20}
=\left(\frac14\right)^{20}
=\frac{1}{4^{20}}
=\frac{1}{1{,}099{,}511{,}627{,}776}
\approx9.09\times10^{-13}.
$$

$$
\boxed{(0.25)^{20}\approx9.09\times10^{-13}}
$$

#### A3. Dying ReLU failure case

Goal: show how a large negative bias can make ReLU units output zero for nearly every example, killing gradients through those units.

```python
X_a3, y_a3 = make_two_moons(n_samples=600, noise=0.10)  # Generate a nonlinear binary dataset for activation statistics.
layer_width_a3 = 40  # Choose enough hidden units to see a meaningful dead-neuron percentage.
W_bad_a3 = 0.5 * np.random.randn(X_a3.shape[1], layer_width_a3)  # Initialize random first-layer weights.
b_bad_a3 = -5.0 * np.ones(layer_width_a3)  # Use a large negative bias that pushes pre-activations below zero.
z_bad_a3 = X_a3 @ W_bad_a3 + b_bad_a3  # Compute first-layer pre-activations for every example and unit.
a_bad_a3 = relu(z_bad_a3)  # Apply ReLU to obtain hidden activations.
dead_by_unit_a3 = (a_bad_a3 == 0.0).mean(axis=0)  # Measure the fraction of examples for which each unit is inactive.
fully_dead_fraction_a3 = (dead_by_unit_a3 == 1.0).mean()  # Measure the fraction of units that are inactive for all examples.
W_ok_a3 = 0.5 * np.random.randn(X_a3.shape[1], layer_width_a3)  # Initialize a comparison layer with similar weight scale.
b_ok_a3 = np.zeros(layer_width_a3)  # Use zero bias so units are not artificially shifted negative.
z_ok_a3 = X_a3 @ W_ok_a3 + b_ok_a3  # Compute comparison pre-activations.
a_ok_a3 = relu(z_ok_a3)  # Apply ReLU to the comparison layer.
dead_by_unit_ok_a3 = (a_ok_a3 == 0.0).mean(axis=0)  # Measure inactive-example fractions for the comparison layer.
fig, axes = plt.subplots(1, 2, figsize=(12, 4))  # Create two panels for bad and healthy initializations.
axes[0].hist(z_bad_a3.ravel(), bins=40, color="#c44e52", alpha=0.85)  # Plot the bad pre-activation distribution.
axes[0].axvline(0.0, color="black", linewidth=1.0)  # Mark the ReLU threshold.
axes[0].set_title("Large negative bias: z mostly below 0")  # Title the bad initialization panel.
axes[0].set_xlabel("pre-activation z")  # Label the bad histogram axis.
axes[0].set_ylabel("count")  # Label the count axis.
axes[1].hist(z_ok_a3.ravel(), bins=40, color="#4c72b0", alpha=0.85)  # Plot the healthy pre-activation distribution.
axes[1].axvline(0.0, color="black", linewidth=1.0)  # Mark the ReLU threshold.
axes[1].set_title("Zero bias: z straddles 0")  # Title the healthy initialization panel.
axes[1].set_xlabel("pre-activation z")  # Label the healthy histogram axis.
plt.tight_layout()  # Prevent panel labels from overlapping.
plt.show()  # Render the pre-activation histograms.
print(f"fraction of fully dead ReLU units with bad bias: {fully_dead_fraction_a3:.2%}")  # Print the dead-unit percentage for the bad layer.
print(f"median inactive fraction with zero bias: {np.median(dead_by_unit_ok_a3):.2%}")  # Print a healthy comparison statistic.
```

▶ What you'll see: the biased layer puts almost all $z$ values left of zero, so many ReLU units output zero and have zero derivative for every example.

Hand interpretation: for one dead unit $j$,

$$
a_j=\max(0,z_j)=0
\quad\text{for all examples.}
$$

For every example where $z_j<0$,

$$
\frac{\partial a_j}{\partial z_j}=0.
$$

Thus, for any incoming weight $w_{ij}$,

$$
\frac{\partial L}{\partial w_{ij}}
=\frac{\partial L}{\partial a_j}\frac{\partial a_j}{\partial z_j}\frac{\partial z_j}{\partial w_{ij}}
=\frac{\partial L}{\partial a_j}\cdot0\cdot x_i
=0.
$$

$$
\boxed{\text{A permanently negative ReLU unit receives zero gradient and may stay dead.}}
$$

#### A4. Compare activations in a tiny MLP

Goal: train the same small two-layer neural network with sigmoid, tanh, ReLU, and Leaky ReLU on two moons, then compare losses and decision boundaries.

```python
X_a4, y_a4 = make_two_moons(n_samples=500, noise=0.12)  # Generate a nonlinear dataset where hidden activations matter.
Y_a4 = one_hot(y_a4, 2)  # Convert integer labels into two-class one-hot targets.

def activation_forward(name, z):  # Define a dispatcher for hidden-layer activation functions.
    if name == "sigmoid":  # Check whether the requested activation is sigmoid.
        return sigmoid(z)  # Return sigmoid activations.
    if name == "tanh":  # Check whether the requested activation is tanh.
        return np.tanh(z)  # Return tanh activations.
    if name == "relu":  # Check whether the requested activation is ReLU.
        return relu(z)  # Return ReLU activations.
    if name == "leaky_relu":  # Check whether the requested activation is Leaky ReLU.
        return leaky_relu(z)  # Return Leaky ReLU activations.
    raise ValueError("unknown activation")  # Stop if the activation name is unsupported.

def activation_backward(name, z):  # Define a dispatcher for hidden-layer activation derivatives.
    if name == "sigmoid":  # Check whether the requested derivative is sigmoid.
        return sigmoid_derivative(z)  # Return sigmoid derivatives.
    if name == "tanh":  # Check whether the requested derivative is tanh.
        return tanh_derivative(z)  # Return tanh derivatives.
    if name == "relu":  # Check whether the requested derivative is ReLU.
        return relu_derivative(z)  # Return ReLU derivatives.
    if name == "leaky_relu":  # Check whether the requested derivative is Leaky ReLU.
        return leaky_relu_derivative(z)  # Return Leaky ReLU derivatives.
    raise ValueError("unknown activation")  # Stop if the activation name is unsupported.

def train_tiny_mlp(X, Y, activation_name, epochs=900, lr=0.08, hidden=16):  # Define a compact full-batch trainer.
    n, d = X.shape  # Read the number of examples and input features.
    W1 = 0.7 * np.random.randn(d, hidden) / np.sqrt(d)  # Initialize first-layer weights with scale control.
    b1 = np.zeros(hidden)  # Initialize first-layer biases to zero.
    W2 = 0.7 * np.random.randn(hidden, Y.shape[1]) / np.sqrt(hidden)  # Initialize output-layer weights with scale control.
    b2 = np.zeros(Y.shape[1])  # Initialize output-layer biases to zero.
    losses = []  # Create a list that will store loss values during training.
    for epoch in range(epochs):  # Run full-batch gradient descent for the requested number of epochs.
        z1 = X @ W1 + b1  # Compute hidden pre-activations.
        a1 = activation_forward(activation_name, z1)  # Apply the selected hidden activation.
        logits = a1 @ W2 + b2  # Compute output logits.
        probs = softmax(logits)  # Convert logits to probabilities using stable softmax.
        loss = -np.mean(np.sum(Y * np.log(probs + 1e-12), axis=1))  # Compute mean cross-entropy loss.
        losses.append(loss)  # Save the loss so we can plot learning progress.
        dlogits = (probs - Y) / n  # Compute the gradient of mean softmax cross-entropy with respect to logits.
        dW2 = a1.T @ dlogits  # Backpropagate into output-layer weights.
        db2 = dlogits.sum(axis=0)  # Backpropagate into output-layer biases.
        da1 = dlogits @ W2.T  # Backpropagate from logits into hidden activations.
        dz1 = da1 * activation_backward(activation_name, z1)  # Apply the selected activation derivative.
        dW1 = X.T @ dz1  # Backpropagate into first-layer weights.
        db1 = dz1.sum(axis=0)  # Backpropagate into first-layer biases.
        W2 = W2 - lr * dW2  # Update output-layer weights by gradient descent.
        b2 = b2 - lr * db2  # Update output-layer biases by gradient descent.
        W1 = W1 - lr * dW1  # Update first-layer weights by gradient descent.
        b1 = b1 - lr * db1  # Update first-layer biases by gradient descent.
    params = (W1, b1, W2, b2)  # Pack trained parameters for prediction.
    return params, np.array(losses)  # Return parameters and the loss curve.

def predict_tiny_mlp(X, params, activation_name):  # Define prediction for the trained tiny MLP.
    W1, b1, W2, b2 = params  # Unpack trained parameters.
    z1 = X @ W1 + b1  # Compute hidden pre-activations.
    a1 = activation_forward(activation_name, z1)  # Apply the selected hidden activation.
    logits = a1 @ W2 + b2  # Compute output logits.
    return softmax(logits)  # Return class probabilities.
activations_a4 = ["sigmoid", "tanh", "relu", "leaky_relu"]  # List the activations to compare.
results_a4 = {}  # Create a dictionary for trained parameters and losses.
for activation_name in activations_a4:  # Train one model per activation.
    params, losses = train_tiny_mlp(X_a4, Y_a4, activation_name)  # Train the tiny MLP with the current activation.
    results_a4[activation_name] = (params, losses)  # Store the trained result for later plotting.
plt.figure(figsize=(8, 4))  # Create a fresh figure for loss curves.
for activation_name, (_, losses) in results_a4.items():  # Loop through all stored loss curves.
    plt.plot(losses, label=activation_name)  # Plot each activation's loss over epochs.
plt.title("A4: loss curves by activation")  # Give the loss plot a descriptive title.
plt.xlabel("epoch")  # Label the training-iteration axis.
plt.ylabel("cross-entropy loss")  # Label the loss axis.
plt.legend()  # Show activation labels.
plt.show()  # Render the loss-curve comparison.
```

▶ What you'll see: activations with healthier gradients usually descend faster on the two-moons task, though exact curves depend on initialization.

```python
x_min, x_max = X_a4[:, 0].min() - 0.7, X_a4[:, 0].max() + 0.7  # Compute horizontal plot limits with padding.
y_min, y_max = X_a4[:, 1].min() - 0.7, X_a4[:, 1].max() + 0.7  # Compute vertical plot limits with padding.
xx, yy = np.meshgrid(np.linspace(x_min, x_max, 180), np.linspace(y_min, y_max, 180))  # Create a dense grid for decision regions.
grid_points_a4 = np.c_[xx.ravel(), yy.ravel()]  # Flatten the grid into point coordinates for prediction.
fig, axes = plt.subplots(2, 2, figsize=(11, 9))  # Create one decision-boundary panel per activation.
for ax, activation_name in zip(axes.ravel(), activations_a4):  # Iterate through panels and activation names together.
    params, losses = results_a4[activation_name]  # Retrieve the trained parameters and loss curve.
    probs_grid = predict_tiny_mlp(grid_points_a4, params, activation_name)[:, 1].reshape(xx.shape)  # Predict class-1 probabilities over the grid.
    probs_train = predict_tiny_mlp(X_a4, params, activation_name)  # Predict class probabilities on training data.
    accuracy = (probs_train.argmax(axis=1) == y_a4).mean()  # Compute training accuracy as a simple performance metric.
    ax.contourf(xx, yy, probs_grid, levels=20, cmap="coolwarm", alpha=0.75)  # Draw a smooth probability background.
    ax.contour(xx, yy, probs_grid, levels=[0.5], colors="black", linewidths=1.5)  # Draw the decision boundary where probability is 0.5.
    ax.scatter(X_a4[:, 0], X_a4[:, 1], c=y_a4, cmap="coolwarm", s=14, edgecolor="k", linewidth=0.2)  # Overlay the training data.
    ax.set_title(f"{activation_name}: accuracy={accuracy:.2%}")  # Title each panel with activation and accuracy.
    ax.set_xlabel("feature 1")  # Label the horizontal feature axis.
    ax.set_ylabel("feature 2")  # Label the vertical feature axis.
plt.tight_layout()  # Prevent subplot labels from overlapping.
plt.show()  # Render the decision-boundary comparison.
```

▶ What you'll see: the same architecture can learn different nonlinear boundaries because each activation changes both hidden features and gradients.

#### A5. Numerically stable softmax

Goal: show why subtracting the maximum logit is required for extreme scores such as $(1000,1001,999)$.

By the exact formula,

$$
p_i=\frac{e^{x_i}}{\sum_j e^{x_j}}.
$$

For

$$
x=(1000,1001,999),
$$

direct computation asks for $e^{1001}$, which is far larger than standard floating-point numbers can represent. But softmax is shift-invariant. Let

$$
c=\max_i x_i=1001.
$$

Then

$$
x-c\mathbf{1}=(-1,0,-2).
$$

Thus

$$
\operatorname{softmax}(1000,1001,999)
=\operatorname{softmax}(-1,0,-2).
$$

The stable denominator is

$$
e^{-1}+e^0+e^{-2}
\approx0.3679+1+0.1353=1.5032.
$$

So

$$
p\approx
\left(
\frac{0.3679}{1.5032},
\frac{1}{1.5032},
\frac{0.1353}{1.5032}
\right)
=(0.2447,0.6652,0.0900).
$$

$$
\boxed{\operatorname{softmax}(1000,1001,999)\approx(0.2447,0.6652,0.0900)}
$$

```python
extreme_logits_a5 = np.array([1000.0, 1001.0, 999.0])  # Store logits large enough to overflow naive exponentials.
with np.errstate(over="ignore", invalid="ignore"):  # Suppress expected overflow warnings for the intentional naive demonstration.
    naive_exp_a5 = np.exp(extreme_logits_a5)  # Compute naive exponentials that overflow to infinity.
    naive_probs_a5 = naive_exp_a5 / naive_exp_a5.sum()  # Divide infinities by infinity, producing invalid probabilities.
stable_probs_a5 = softmax(extreme_logits_a5)  # Compute the same softmax using the max-subtraction trick.
print("naive exponentials:", naive_exp_a5)  # Show why the direct formula is numerically unsafe.
print("naive probabilities:", naive_probs_a5)  # Show the invalid result produced by overflow.
print("stable probabilities:", np.round(stable_probs_a5, 4))  # Show the correct stable probabilities.
print("stable sum:", stable_probs_a5.sum())  # Confirm that stable probabilities still sum to one.
```

Now apply stable softmax to a batch of extreme logits and compute cross-entropy.

```python
batch_logits_a5 = np.array([[1000.0, 1001.0, 999.0], [1200.0, 1199.0, 1198.0], [-1000.0, -999.0, -1001.0]])  # Store three extreme logit rows.
targets_a5 = np.array([1, 0, 1])  # Store one target class index per row.
batch_probs_a5 = softmax(batch_logits_a5)  # Compute stable probabilities row by row.
losses_a5 = -np.log(batch_probs_a5[np.arange(len(targets_a5)), targets_a5] + 1e-12)  # Compute per-example cross-entropy losses.
plt.figure()  # Create a fresh figure for the stable batch probabilities.
plt.imshow(batch_probs_a5, cmap="viridis", vmin=0.0, vmax=1.0)  # Display probabilities as a heatmap.
plt.colorbar(label="probability")  # Add a color scale for probability magnitude.
plt.xticks([0, 1, 2], ["class 0", "class 1", "class 2"])  # Label class columns.
plt.yticks([0, 1, 2], ["example 0", "example 1", "example 2"])  # Label example rows.
plt.title("A5: stable softmax on extreme batch logits")  # Give the heatmap a descriptive title.
plt.show()  # Render the batch probability heatmap.
print("batch probabilities:\n", np.round(batch_probs_a5, 4))  # Print the stable probabilities for all rows.
print("cross-entropy losses:", np.round(losses_a5, 4))  # Print the per-example losses.
print("mean cross-entropy:", np.round(losses_a5.mean(), 4))  # Print the average loss.
```

▶ What you'll see: naive exponentials overflow, but subtracting the row maximum keeps probabilities finite and unchanged mathematically.

### Interactive Experiment

Use the widget to choose an activation and compare its function with its derivative. If widgets are unavailable in a plain Python script, the fallback draws ReLU.

```python
try:  # Try to import notebook widgets for an interactive Colab control.
    from ipywidgets import interact, Dropdown, FloatSlider  # Import the minimal widget tools needed for the experiment.
    WIDGETS_AVAILABLE = True  # Record that interactive widgets can be used.
except ImportError:  # Handle environments where ipywidgets is not installed.
    WIDGETS_AVAILABLE = False  # Record that the static fallback should be used.

def plot_activation_experiment(activation="relu", epsilon=0.01, alpha=1.0):  # Define the plotting function controlled by widgets.
    z = np.linspace(-8.0, 8.0, 800)  # Create a dense grid for smooth activation and derivative curves.
    if activation == "sigmoid":  # Select sigmoid when requested.
        values = sigmoid(z)  # Compute sigmoid values.
        derivs = sigmoid_derivative(z)  # Compute sigmoid derivatives.
    elif activation == "tanh":  # Select tanh when requested.
        values = np.tanh(z)  # Compute tanh values.
        derivs = tanh_derivative(z)  # Compute tanh derivatives.
    elif activation == "relu":  # Select ReLU when requested.
        values = relu(z)  # Compute ReLU values.
        derivs = relu_derivative(z)  # Compute ReLU derivatives.
    elif activation == "leaky_relu":  # Select Leaky ReLU when requested.
        values = leaky_relu(z, epsilon=epsilon)  # Compute Leaky ReLU values with the chosen epsilon.
        derivs = leaky_relu_derivative(z, epsilon=epsilon)  # Compute Leaky ReLU derivatives with the chosen epsilon.
    elif activation == "elu":  # Select ELU when requested.
        values = elu(z, alpha=alpha)  # Compute ELU values with the chosen alpha.
        derivs = elu_derivative(z, alpha=alpha)  # Compute ELU derivatives with the chosen alpha.
    else:  # Protect against unsupported activation names.
        raise ValueError("unknown activation")  # Explain that the activation name is invalid.
    plt.figure(figsize=(8, 4))  # Create a fresh figure for the selected activation.
    plt.plot(z, values, label=f"{activation} g(z)")  # Plot the activation function.
    plt.plot(z, derivs, linestyle="--", label=f"{activation} g'(z)")  # Overlay the derivative.
    plt.axhline(0.0, color="black", linewidth=0.8)  # Draw the horizontal zero line for orientation.
    plt.axvline(0.0, color="black", linewidth=0.8)  # Draw the vertical zero line for orientation.
    plt.title("Interactive activation and derivative")  # Give the plot a descriptive title.
    plt.xlabel("z")  # Label the pre-activation axis.
    plt.ylabel("value")  # Label the shared value axis.
    plt.legend()  # Show function and derivative labels.
    plt.show()  # Render the selected activation plot.
if WIDGETS_AVAILABLE:  # Use the interactive version when widgets are installed.
    interact(plot_activation_experiment, activation=Dropdown(options=["sigmoid", "tanh", "relu", "leaky_relu", "elu"], value="relu"), epsilon=FloatSlider(value=0.01, min=0.0, max=0.3, step=0.01), alpha=FloatSlider(value=1.0, min=0.1, max=3.0, step=0.1))  # Create controls for activation, epsilon, and alpha.
else:  # Use a deterministic static fallback otherwise.
    plot_activation_experiment("relu", epsilon=0.01, alpha=1.0)  # Draw the default ReLU plot without widgets.
```

▶ What you'll see: changing the activation changes not just the curve, but the exact locations where gradients are zero, small, or near one.
