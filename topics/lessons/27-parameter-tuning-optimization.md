# Parameter Tuning & Optimization
> **Source:** CS 230 · **Category:** Method/Tips · **Type:** ⚖️ Both · [↑ Full reference](../../ai-ml-cheatsheets.md)
> 📓 The coded examples form a runnable notebook section; an `.ipynb` will be generated.

## 1. Overview

Optimization is the engineering layer that turns a differentiable model into a trained model. The same architecture can converge quickly, crawl slowly, oscillate, or diverge depending on initialization, learning rate, optimizer, schedule, and whether we reuse pretrained weights.

**One-line intuition:** optimization is controlled motion on a loss landscape: initialization chooses the starting point, gradients choose the direction, learning rates choose step length, and adaptive optimizers reshape the steps coordinate-by-coordinate.

In deep learning, parameter tuning is not just “try a few numbers.” It is a disciplined loop:

1. initialize weights so signals do not explode or vanish,
2. choose a stable learning-rate scale,
3. pick an optimizer whose dynamics match the loss geometry,
4. schedule the step size as training progresses,
5. diagnose failure by plotting both loss curves and parameter paths.

## 2. Key Idea

Let $J(w)$ be a differentiable loss and let

$$
g_t=\nabla_w J(w_t)
$$

be the gradient at step $t$. The gradient points in the direction of steepest local increase, so optimization usually moves in the negative-gradient direction.

### Stochastic gradient descent

For learning rate $\alpha>0$,

$$
w_{t+1}=w_t-\alpha g_t.
$$

If $\alpha$ is too small, training is stable but slow. If $\alpha$ is too large, the update can overshoot the minimum, oscillate, or diverge.

For a mini-batch $\mathcal B_t$,

$$
g_t=\frac{1}{|\mathcal B_t|}\sum_{i\in\mathcal B_t}\nabla_w \ell(f_w(x_i),y_i),
$$

so SGD replaces the full-dataset gradient by a noisy but cheaper estimate.

### Momentum

Momentum keeps an exponentially weighted moving average of gradients:

$$
v_t=\beta v_{t-1}+(1-\beta)g_t,
$$

then updates

$$
w_{t+1}=w_t-\alpha v_t.
$$

The parameter $\beta\in[0,1)$ controls memory. Large $\beta$ dampens high-frequency zig-zags and accumulates consistent downhill directions.

### RMSprop

RMSprop keeps an exponentially weighted moving average of squared gradients:

$$
s_t=\beta s_{t-1}+(1-\beta)g_t^2,
$$

where the square is elementwise. It then scales each coordinate by its recent root-mean-square gradient:

$$
w_{t+1}=w_t-\alpha\frac{g_t}{\sqrt{s_t}+\epsilon}.
$$

Coordinates with consistently large gradients get smaller effective steps; coordinates with small gradients get larger relative steps.

### Adam

Adam combines momentum and RMSprop. With $\beta_1,\beta_2\in[0,1)$,

$$
v_t=\beta_1v_{t-1}+(1-\beta_1)g_t,
$$

$$
s_t=\beta_2s_{t-1}+(1-\beta_2)g_t^2.
$$

Because $v_0=s_0=0$, early moving averages are biased toward zero. Adam corrects this:

$$
\hat v_t=\frac{v_t}{1-\beta_1^t},
\qquad
\hat s_t=\frac{s_t}{1-\beta_2^t}.
$$

The update is

$$
w_{t+1}=w_t-\alpha\frac{\hat v_t}{\sqrt{\hat s_t}+\epsilon}.
$$

A common starting point is

$$
\alpha=10^{-3},\qquad \beta_1=0.9,
\qquad \beta_2=0.999,
\qquad \epsilon=10^{-8}.
$$

### Learning-rate schedules

A schedule changes $\alpha$ over iteration or epoch. Common choices are:

**Fixed schedule**

$$
\alpha_t=\alpha_0.
$$

**Step decay** with drop factor $\gamma\in(0,1)$ every $k$ epochs:

$$
\alpha_e=\alpha_0\gamma^{\left\lfloor e/k\right\rfloor}.
$$

**Exponential decay** with decay rate $\lambda>0$:

$$
\alpha_t=\alpha_0e^{-\lambda t}.
$$

**Cosine decay** over $T$ total steps:

$$
\alpha_t=\alpha_{\min}+\frac{1}{2}(\alpha_0-\alpha_{\min})\left(1+\cos\frac{\pi t}{T}\right).
$$

The usual pattern is: larger steps early for fast progress, smaller steps later for fine convergence.

### Xavier / Glorot initialization

For a layer with $n_{\text{in}}$ input units and $n_{\text{out}}$ output units, Xavier uniform initialization samples

$$
W_{ij}\sim U\left[-\sqrt{\frac{6}{n_{\text{in}}+n_{\text{out}}}},\sqrt{\frac{6}{n_{\text{in}}+n_{\text{out}}}}\right].
$$

The goal is to keep activation variance roughly stable across layers, especially for tanh-like nonlinearities. Too-small weights shrink signals toward zero; too-large weights saturate activations and produce poor gradients.

### Transfer-learning tuning rule of thumb

| Data size | Practical tuning choice | Why |
|---|---|---|
| Small | Freeze most layers; train only the head | Avoid overfitting many parameters. |
| Medium | Freeze early layers; tune later layers and head | Reuse general features while adapting task-specific features. |
| Large | Initialize from pretrained weights and fine-tune all layers | Enough data exists to safely adapt the full representation. |

## 3. Worked Examples

### Setup

Run this once before the coded examples. It imports all libraries, seeds randomness, defines optimizers, defines schedules, and defines plotting helpers. The examples below are intentionally small enough to run top-to-bottom on a CPU.

```python
import numpy as np  # Import NumPy for arrays, vectorized math, and reproducible random number generation.
import matplotlib.pyplot as plt  # Import Matplotlib for loss curves, contours, histograms, and paths.
from math import pi  # Import pi so the cosine learning-rate schedule is explicit and readable.

rng = np.random.default_rng(23027)  # Create one seeded generator so every stochastic example is reproducible.
np.set_printoptions(precision=4, suppress=True)  # Print small arrays in a compact lecture-friendly format.

plt.rcParams["figure.figsize"] = (7, 4)  # Set a consistent default figure size for notebook readability.
plt.rcParams["axes.grid"] = True  # Add light grids so optimization curves are easier to compare.


def quadratic_loss(w):  # Define the ill-conditioned two-dimensional quadratic loss used throughout.
    return 20.0 * w[0] ** 2 + 1.0 * w[1] ** 2  # Return J(w1,w2)=20w1^2+w2^2 so one direction is much steeper.


def quadratic_grad(w):  # Define the exact gradient of the two-dimensional quadratic.
    return np.array([40.0 * w[0], 2.0 * w[1]])  # Return [dJ/dw1,dJ/dw2]=[40w1,2w2].


def sgd_step(w, grad, state, lr):  # Define one plain SGD step with a shared optimizer interface.
    return w - lr * grad, state  # Move opposite the gradient and leave the empty state unchanged.


def momentum_step(w, grad, state, lr, beta=0.9):  # Define one momentum step with exponential gradient averaging.
    v = state.get("v", np.zeros_like(w))  # Read the previous velocity or initialize it to zeros.
    v = beta * v + (1.0 - beta) * grad  # Blend old velocity with the current gradient.
    state["v"] = v  # Store the updated velocity for the next iteration.
    return w - lr * v, state  # Move opposite the velocity-smoothed gradient.


def rmsprop_step(w, grad, state, lr, beta=0.9, eps=1e-8):  # Define one RMSprop step with squared-gradient scaling.
    s = state.get("s", np.zeros_like(w))  # Read the previous second-moment estimate or initialize zeros.
    s = beta * s + (1.0 - beta) * grad ** 2  # Track recent squared gradients coordinate-by-coordinate.
    state["s"] = s  # Store the updated second-moment estimate.
    return w - lr * grad / (np.sqrt(s) + eps), state  # Divide by RMS gradient so steep coordinates get smaller steps.


def adam_step(w, grad, state, lr, beta1=0.9, beta2=0.999, eps=1e-8):  # Define one Adam step with bias correction.
    t = state.get("t", 0) + 1  # Increase the time index because bias correction depends on t.
    v = state.get("v", np.zeros_like(w))  # Read the first-moment estimate or initialize zeros.
    s = state.get("s", np.zeros_like(w))  # Read the second-moment estimate or initialize zeros.
    v = beta1 * v + (1.0 - beta1) * grad  # Update the momentum-like first moment.
    s = beta2 * s + (1.0 - beta2) * grad ** 2  # Update the RMSprop-like second moment.
    v_hat = v / (1.0 - beta1 ** t)  # Correct first-moment bias caused by zero initialization.
    s_hat = s / (1.0 - beta2 ** t)  # Correct second-moment bias caused by zero initialization.
    state["t"] = t  # Store the new time index.
    state["v"] = v  # Store the new first moment.
    state["s"] = s  # Store the new second moment.
    return w - lr * v_hat / (np.sqrt(s_hat) + eps), state  # Apply Adam's adaptive signed step.


def fixed_schedule(epoch, lr0=0.1):  # Define a fixed learning-rate schedule.
    return lr0  # Return the same learning rate at every epoch.


def step_schedule(epoch, lr0=0.1, drop=0.5, every=10):  # Define a staircase decay schedule.
    return lr0 * (drop ** (epoch // every))  # Drop the learning rate by a factor after each interval.


def exponential_schedule(epoch, lr0=0.1, decay=0.08):  # Define a smooth exponential decay schedule.
    return lr0 * np.exp(-decay * epoch)  # Decay multiplicatively as epochs increase.


def cosine_schedule(epoch, lr0=0.1, lr_min=0.005, total=40):  # Define a cosine decay schedule.
    return lr_min + 0.5 * (lr0 - lr_min) * (1.0 + np.cos(pi * epoch / total))  # Anneal smoothly from lr0 to lr_min.


def run_optimizer(name, step_fn, w0, lr, steps=80, grad_fn=quadratic_grad, loss_fn=quadratic_loss, **kwargs):  # Run any optimizer on a loss.
    w = np.array(w0, dtype=float)  # Copy the starting point as floating-point parameters.
    state = {}  # Initialize optimizer memory such as velocity or second moments.
    path = [w.copy()]  # Save the initial point for plotting the optimization path.
    losses = [loss_fn(w)]  # Save the initial loss for plotting convergence.
    for _ in range(steps):  # Repeat the chosen update for the requested number of iterations.
        grad = grad_fn(w)  # Compute the gradient at the current point.
        w, state = step_fn(w, grad, state, lr, **kwargs)  # Apply one optimizer-specific update.
        path.append(w.copy())  # Store the new parameter vector.
        losses.append(loss_fn(w))  # Store the new loss value.
    return {"name": name, "path": np.array(path), "losses": np.array(losses)}  # Return all traces for analysis.


def plot_quadratic_contours(ax, limit=3.2):  # Draw contours of the two-dimensional quadratic surface.
    xs = np.linspace(-limit, limit, 220)  # Create x-axis coordinates for the contour grid.
    ys = np.linspace(-limit, limit, 220)  # Create y-axis coordinates for the contour grid.
    X, Y = np.meshgrid(xs, ys)  # Build a rectangular mesh of coordinates.
    Z = 20.0 * X ** 2 + Y ** 2  # Evaluate the quadratic loss on the grid.
    ax.contour(X, Y, Z, levels=25, cmap="Greys")  # Draw contour lines to show loss geometry.
    ax.set_xlabel("w1")  # Label the horizontal parameter axis.
    ax.set_ylabel("w2")  # Label the vertical parameter axis.
    ax.set_aspect("equal", adjustable="box")  # Use equal scaling so path directions are not distorted.
```

### Data — swappable sources

This lesson mostly uses synthetic losses because optimizer behavior is clearest when we can see the exact surface. The data switch below also creates small classification datasets for the coded neural-network examples.

```python
DATA_SOURCE = "moons"  # Choose "linear", "moons", or "features" to swap the later supervised-learning data source.


def make_linear_data(n=240, seed=1):  # Define a linearly separable two-class dataset generator.
    local_rng = np.random.default_rng(seed)  # Create a local generator so data can be reproduced independently.
    x0 = local_rng.normal(loc=[-1.2, -1.0], scale=0.55, size=(n // 2, 2))  # Sample class 0 around a negative center.
    x1 = local_rng.normal(loc=[1.2, 1.0], scale=0.55, size=(n // 2, 2))  # Sample class 1 around a positive center.
    X = np.vstack([x0, x1])  # Stack both classes into one design matrix.
    y = np.hstack([np.zeros(n // 2), np.ones(n // 2)]).astype(int)  # Build binary labels for the stacked data.
    return X, y  # Return features and labels.


def make_moons_data(n=300, noise=0.12, seed=2):  # Define a dependency-free two-moons generator.
    local_rng = np.random.default_rng(seed)  # Create a local random generator for reproducible moons.
    m = n // 2  # Split observations evenly across the two moons.
    theta0 = local_rng.uniform(0.0, np.pi, size=m)  # Sample angles for the upper moon.
    theta1 = local_rng.uniform(0.0, np.pi, size=n - m)  # Sample angles for the lower moon.
    upper = np.c_[np.cos(theta0), np.sin(theta0)]  # Convert upper-moon polar coordinates to Cartesian coordinates.
    lower = np.c_[1.0 - np.cos(theta1), -np.sin(theta1) - 0.45]  # Convert lower-moon coordinates and shift them.
    X = np.vstack([upper, lower])  # Stack both nonlinear classes into one feature matrix.
    X = X + local_rng.normal(scale=noise, size=X.shape)  # Add Gaussian noise so the boundary is realistic.
    y = np.hstack([np.zeros(m), np.ones(n - m)]).astype(int)  # Create class labels for both moons.
    return X, y  # Return features and labels.


def make_feature_data(n=320, seed=3):  # Define a feature-transfer-style dataset with reusable hidden features.
    local_rng = np.random.default_rng(seed)  # Create a local generator for reproducibility.
    z = local_rng.normal(size=(n, 2))  # Sample two latent factors that play the role of pretrained features.
    y = ((z[:, 0] ** 2 + 0.6 * z[:, 1] + 0.25 * local_rng.normal(size=n)) > 0.9).astype(int)  # Create nonlinear labels.
    X = np.c_[z, z[:, 0] ** 2, z[:, 1] ** 2, z[:, 0] * z[:, 1]]  # Build fixed feature maps like a frozen representation.
    return X, y  # Return engineered features and labels.


def standardize(X):  # Define feature standardization for stable optimization.
    mu = X.mean(axis=0, keepdims=True)  # Compute feature means on the current data.
    sigma = X.std(axis=0, keepdims=True) + 1e-8  # Compute feature standard deviations with numerical protection.
    return (X - mu) / sigma  # Return standardized features.

if DATA_SOURCE == "linear":  # Select the linearly separable data source when requested.
    X_data, y_data = make_linear_data()  # Generate linear data.
elif DATA_SOURCE == "features":  # Select the pseudo-transfer feature data source when requested.
    X_data, y_data = make_feature_data()  # Generate feature-transfer data.
else:  # Use moons as the default because it exposes failure modes for linear models.
    X_data, y_data = make_moons_data()  # Generate nonlinear moons data.

X_data = standardize(X_data)  # Standardize the selected data so learning rates have comparable meaning.

plt.figure()  # Create a figure for the selected data source.
plt.scatter(X_data[:, 0], X_data[:, 1], c=y_data, cmap="coolwarm", s=22, edgecolor="k", linewidth=0.25)  # Plot labels in the first two features.
plt.title(f"Selected DATA_SOURCE = {DATA_SOURCE}")  # Name the active data source in the plot title.
plt.xlabel("feature 1")  # Label the first feature axis.
plt.ylabel("feature 2")  # Label the second feature axis.
plt.show()  # Display the plot in the notebook.
```

▶ What you'll see: the default moons data is not linearly separable, so later examples show why optimization settings can help training but cannot remove all modeling assumptions.

### 🟢 Basics (warm-up)

#### B1. One SGD scalar update

Goal: apply exactly one scalar SGD update using $w_0=2$, $g=4$, and $\alpha=0.1$.

By hand,

$$
w_1=w_0-\alpha g=2-0.1(4)=2-0.4=\boxed{1.6}.
$$

```python
w0 = 2.0  # Start from the scalar parameter value w0=2.
g = 4.0  # Use the scalar gradient g=4, which points toward increasing loss.
alpha = 0.1  # Use a learning rate of 0.1 for one SGD step.
w1 = w0 - alpha * g  # Apply the SGD rule w_new = w_old - alpha * gradient.

print(f"Before update: w0 = {w0:.2f}")  # Print the starting value.
print(f"Gradient:      g  = {g:.2f}")  # Print the gradient used by the update.
print(f"After update:  w1 = {w1:.2f}")  # Print the resulting value.

plt.figure()  # Create a figure for a one-dimensional number-line view.
plt.axhline(0.0, color="black", linewidth=1.0)  # Draw the number line.
plt.scatter([w0], [0.0], s=120, label="before", color="black")  # Mark the starting parameter.
plt.scatter([w1], [0.0], s=120, label="after", color="white", edgecolor="black")  # Mark the updated parameter.
plt.annotate("SGD step", xy=(w1, 0.0), xytext=(w0, 0.18), arrowprops={"arrowstyle": "->"})  # Draw the movement arrow.
plt.yticks([])  # Hide the vertical ticks because this is a number line.
plt.xlabel("w")  # Label the parameter axis.
plt.title("B1: one scalar SGD update")  # Title the plot.
plt.legend()  # Show labels for before and after points.
plt.show()  # Display the plot.
```

▶ What you'll see: because the gradient is positive, the parameter moves left from $2.0$ to $1.6$.

#### B2. One momentum velocity update

Goal: compute one velocity update using $v_0=0$, $g=4$, and $\beta=0.9$.

By hand,

$$
v_1=\beta v_0+(1-\beta)g=0.9(0)+0.1(4)=\boxed{0.4}.
$$

If $\alpha=0.1$, then

$$
w_1=w_0-\alpha v_1=2-0.1(0.4)=\boxed{1.96}.
$$

```python
w0 = 2.0  # Start from the same scalar parameter as B1 for comparison.
v0 = 0.0  # Initialize momentum velocity at zero.
g = 4.0  # Use the same positive gradient as B1.
beta = 0.9  # Use a standard momentum memory coefficient.
alpha = 0.1  # Use the same learning rate as B1.
v1 = beta * v0 + (1.0 - beta) * g  # Compute the first exponentially weighted gradient.
w1 = w0 - alpha * v1  # Move the parameter using the smoothed velocity.

print(f"Velocity after one momentum update: v1 = {v1:.2f}")  # Print the velocity.
print(f"Parameter after momentum step:      w1 = {w1:.2f}")  # Print the parameter after using the velocity.

plt.figure()  # Create a figure for the velocity arrow.
plt.axhline(0.0, color="black", linewidth=1.0)  # Draw the number line.
plt.scatter([w0], [0.0], s=120, label="before", color="black")  # Mark the starting parameter.
plt.scatter([w1], [0.0], s=120, label="after momentum", color="white", edgecolor="black")  # Mark the momentum update.
plt.annotate("smoothed step", xy=(w1, 0.0), xytext=(w0, 0.18), arrowprops={"arrowstyle": "->"})  # Draw a small step arrow.
plt.yticks([])  # Hide vertical ticks for the number-line visualization.
plt.xlabel("w")  # Label the parameter axis.
plt.title("B2: first momentum step is conservative because velocity starts at zero")  # Title the plot.
plt.legend()  # Show plot labels.
plt.show()  # Display the plot.
```

▶ What you'll see: the first momentum step is only one-tenth of the plain SGD step because the velocity begins at zero.

#### B3. Compare two learning-rate steps

Goal: apply two SGD steps with the same gradient but different learning rates.

For $w_0=2$ and $g=4$,

$$
\alpha=0.05:\quad w_1=2-0.05(4)=\boxed{1.8},
$$

while

$$
\alpha=0.40:\quad w_1=2-0.40(4)=\boxed{0.4}.
$$

The larger step moves faster, but on curved losses it may overshoot.

```python
w0 = 2.0  # Use the same starting parameter so only the learning rate changes.
g = 4.0  # Use a fixed gradient to isolate the effect of alpha.
alphas = [0.05, 0.40]  # Compare a small stable step against a much larger step.
updates = [w0 - a * g for a in alphas]  # Compute both one-step SGD updates.

for a, w_new in zip(alphas, updates):  # Iterate through the learning-rate results.
    print(f"alpha = {a:.2f} gives w1 = {w_new:.2f}")  # Print the updated parameter for each alpha.

xs = np.linspace(-0.2, 2.3, 200)  # Create coordinates for a simple one-dimensional quadratic loss curve.
loss = xs ** 2  # Evaluate J(w)=w^2 so the minimum is visible at zero.

plt.figure()  # Create a figure for both learning-rate arrows.
plt.plot(xs, loss, color="black", label="$J(w)=w^2$")  # Plot the one-dimensional loss curve.
plt.scatter([w0], [w0 ** 2], s=90, color="black", label="start")  # Mark the common starting point.
for a, w_new in zip(alphas, updates):  # Draw one arrow for each learning rate.
    plt.annotate(f"α={a}", xy=(w_new, w_new ** 2), xytext=(w0, w0 ** 2), arrowprops={"arrowstyle": "->"})  # Show the step on the curve.
    plt.scatter([w_new], [w_new ** 2], s=90, label=f"after α={a}")  # Mark the endpoint.
plt.xlabel("w")  # Label the parameter axis.
plt.ylabel("J(w)")  # Label the loss axis.
plt.title("B3: the learning rate controls step length")  # Title the plot.
plt.legend()  # Show labels for all points and arrows.
plt.show()  # Display the plot.
```

▶ What you'll see: both steps descend here, but the larger learning rate travels much farther and foreshadows overshooting on steeper losses.


#### B4. One RMSprop scalar update

Goal: compute one RMSprop denominator and one parameter update.

By hand,

$$
s_1=0.9(0)+0.1(4^2)=1.6,
\qquad
w_1=2-0.1\frac{4}{\sqrt{1.6}+10^{-8}}\approx\boxed{1.684}.
$$

```python
w0 = 2.0  # Start from the scalar parameter value.
g = 4.0  # Use one positive gradient.
s0 = 0.0  # Initialize the squared-gradient average at zero.
beta = 0.9  # Use RMSprop's decay rate.
alpha = 0.1  # Use a small learning rate.
eps = 1e-8  # Add numerical protection in the denominator.
s1 = beta * s0 + (1.0 - beta) * g ** 2  # Update the squared-gradient moving average.
w1 = w0 - alpha * g / (np.sqrt(s1) + eps)  # Apply one RMSprop-scaled update.
print(f"s1 = {s1:.3f}")  # Print the second-moment estimate.
print(f"w1 = {w1:.3f}")  # Print the updated parameter.
plt.figure()  # Create a number-line figure.
plt.axhline(0.0, color="black", linewidth=1.0)  # Draw the number line.
plt.scatter([w0], [0.0], s=120, label="before", color="black")  # Mark the starting value.
plt.scatter([w1], [0.0], s=120, label="after RMSprop", color="white", edgecolor="black")  # Mark the updated value.
plt.annotate("scaled step", xy=(w1, 0.0), xytext=(w0, 0.18), arrowprops={"arrowstyle": "->"})  # Show the update direction.
plt.yticks([])  # Hide vertical ticks.
plt.xlabel("w")  # Label the parameter axis.
plt.title("B4: one RMSprop update")  # Title the plot.
plt.legend()  # Show labels.
plt.show()  # Display the plot.
```

▶ What you'll see: the large gradient also creates a large denominator, shrinking the effective step.

#### B5. One Adam moment update

Goal: compute Adam's first and second moments before applying the bias-corrected step.

By hand for $t=1$,

$$
v_1=0.1g=0.4,\qquad s_1=0.001g^2=0.016,
$$

and bias correction gives $\hat v_1=4$, $\hat s_1=16$.

```python
g = 4.0  # Use one scalar gradient.
beta1 = 0.9  # Use Adam's first-moment decay.
beta2 = 0.999  # Use Adam's second-moment decay.
v1 = beta1 * 0.0 + (1.0 - beta1) * g  # Compute the first-moment estimate.
s1 = beta2 * 0.0 + (1.0 - beta2) * g ** 2  # Compute the second-moment estimate.
v_hat = v1 / (1.0 - beta1)  # Bias-correct the first moment at t=1.
s_hat = s1 / (1.0 - beta2)  # Bias-correct the second moment at t=1.
print(f"v1 = {v1:.3f}, s1 = {s1:.3f}")  # Print raw moments.
print(f"v_hat = {v_hat:.3f}, s_hat = {s_hat:.3f}")  # Print bias-corrected moments.
plt.figure()  # Create a small comparison plot.
plt.bar(["v1", "v_hat", "s1", "s_hat"], [v1, v_hat, s1, s_hat])  # Compare raw and corrected estimates.
plt.title("B5: Adam moment estimates at the first step")  # Title the plot.
plt.ylabel("value")  # Label the values.
plt.show()  # Display the bars.
```

▶ What you'll see: raw Adam moments start small because they are averaged with zeros.

#### B6. Step-decay learning rate at one epoch

Goal: evaluate a learning-rate schedule at a single epoch.

For $\alpha_0=0.1$, drop factor $\gamma=0.5$, every $k=5$ epochs, at epoch $12$,

$$
\alpha_{12}=0.1(0.5)^{\lfloor 12/5\rfloor}=0.1(0.5)^2=\boxed{0.025}.
$$

```python
lr0 = 0.1  # Store the initial learning rate.
gamma = 0.5  # Store the multiplicative drop factor.
drop_every = 5  # Store how many epochs pass before each drop.
epoch = 12  # Choose one epoch to evaluate.
lr_epoch = lr0 * gamma ** (epoch // drop_every)  # Compute the step-decay learning rate.
print(f"epoch = {epoch}")  # Print the epoch.
print(f"learning rate = {lr_epoch:.3f}")  # Print the scheduled value.
epochs = np.arange(0, 16)  # Create epochs for context.
lrs = [lr0 * gamma ** (e // drop_every) for e in epochs]  # Compute the full staircase.
plt.figure()  # Create the schedule plot.
plt.step(epochs, lrs, where="post")  # Draw the step-decay curve.
plt.scatter([epoch], [lr_epoch], s=100, color="black", label="chosen epoch")  # Mark the evaluated epoch.
plt.xlabel("epoch")  # Label epoch axis.
plt.ylabel("learning rate")  # Label learning-rate axis.
plt.title("B6: one step-decay schedule value")  # Title the plot.
plt.legend()  # Show marker label.
plt.show()  # Display the plot.
```

▶ What you'll see: epoch 12 has passed two drop boundaries, so the learning rate is one quarter of the start.

#### B7. Xavier initialization scale

Goal: compute the Xavier uniform limit for one layer shape.

For $n_{in}=4$ and $n_{out}=2$,

$$
\text{limit}=\sqrt{\frac{6}{4+2}}=\boxed{1.0}.
$$

```python
n_in = 4  # Store the number of input units.
n_out = 2  # Store the number of output units.
limit = np.sqrt(6.0 / (n_in + n_out))  # Compute the Xavier uniform half-width.
weights = rng.uniform(-limit, limit, size=(n_in, n_out))  # Sample a tiny weight matrix from that range.
print(f"Xavier limit = {limit:.3f}")  # Print the allowed range endpoint.
print("sample weights:\n", weights)  # Print one reproducible sample.
plt.figure()  # Create a histogram figure.
plt.hist(weights.ravel(), bins=6, edgecolor="black")  # Show sampled weights within the interval.
plt.axvline(-limit, color="red", linestyle="--", label="limits")  # Mark lower limit.
plt.axvline(limit, color="red", linestyle="--")  # Mark upper limit.
plt.title("B7: Xavier uniform range")  # Title the plot.
plt.legend()  # Show limit label.
plt.show()  # Display the histogram.
```

▶ What you'll see: Xavier chooses a symmetric range from the layer's input and output sizes.

#### B8. Gradient of a quadratic at one point

Goal: compute $\nabla J(w)$ for the lesson's two-dimensional quadratic.

For $J(w)=20w_1^2+w_2^2$ at $w=(1,-3)$,

$$
\nabla J(w)=(40w_1,2w_2)=\boxed{(40,-6)}.
$$

```python
w = np.array([1.0, -3.0])  # Choose one point on the quadratic surface.
grad = quadratic_grad(w)  # Compute the exact gradient using the setup helper.
loss_value = quadratic_loss(w)  # Compute the loss value at the same point.
print(f"w = {w}")  # Print the point.
print(f"J(w) = {loss_value:.1f}")  # Print the scalar loss.
print(f"gradient = {grad}")  # Print the gradient vector.
plt.figure()  # Create a vector plot.
plt.quiver([w[0]], [w[1]], [grad[0]], [grad[1]], angles="xy", scale_units="xy", scale=50, color="tab:red")  # Draw the gradient direction.
plt.scatter([w[0]], [w[1]], color="black")  # Mark the point.
plt.xlabel("w1")  # Label first parameter.
plt.ylabel("w2")  # Label second parameter.
plt.title("B8: gradient points uphill")  # Title the plot.
plt.show()  # Display the vector.
```

▶ What you'll see: the first coordinate has a much larger gradient because the bowl is steeper in $w_1$.

#### B9. Loss decrease after one small step

Goal: verify that a small SGD step lowers the quadratic loss.

Starting at $w=(1,1)$ with $\alpha=0.01$,

$$
w_1=w_0-\alpha\nabla J(w_0).
$$

```python
w0 = np.array([1.0, 1.0])  # Choose a point where both gradient coordinates are positive.
grad = quadratic_grad(w0)  # Compute the exact gradient at the starting point.
alpha = 0.01  # Choose a small stable learning rate.
w1 = w0 - alpha * grad  # Apply one SGD update.
loss0 = quadratic_loss(w0)  # Evaluate loss before the update.
loss1 = quadratic_loss(w1)  # Evaluate loss after the update.
print(f"w0 = {w0}, J(w0) = {loss0:.3f}")  # Print the starting loss.
print(f"w1 = {w1}, J(w1) = {loss1:.3f}")  # Print the new loss.
plt.figure()  # Create a two-bar loss comparison.
plt.bar(["before", "after"], [loss0, loss1], color=["tab:red", "tab:green"])  # Plot loss before and after.
plt.ylabel("J(w)")  # Label the loss axis.
plt.title("B9: one small step decreases loss")  # Title the check.
plt.show()  # Display the bars.
```

▶ What you'll see: the loss drops after the update, confirming the step moved downhill for this learning rate.

#### B10. Clip one gradient norm

Goal: rescale a gradient vector whose norm is larger than a chosen threshold.

For $g=(3,4)$ and threshold $2$,

$$
\lVert g\rVert_2=5,
\qquad
\tilde g=g\frac{2}{5}=\boxed{(1.2,1.6)}.
$$

```python
g = np.array([3.0, 4.0])  # Store a gradient with norm five.
max_norm = 2.0  # Choose the clipping threshold.
norm = np.linalg.norm(g)  # Compute the L2 norm of the gradient.
scale = min(1.0, max_norm / norm)  # Compute the clipping scale, capped at one.
g_clipped = g * scale  # Apply norm clipping.
print(f"original norm = {norm:.2f}")  # Print the original norm.
print(f"scale = {scale:.2f}")  # Print the rescaling factor.
print(f"clipped gradient = {g_clipped}")  # Print the clipped gradient.
plt.figure()  # Create a vector comparison.
plt.quiver([0, 0], [0, 0], [g[0], g_clipped[0]], [g[1], g_clipped[1]], angles="xy", scale_units="xy", scale=1, color=["tab:red", "tab:green"])  # Draw original and clipped gradients.
plt.xlim(0, 3.5)  # Set horizontal range.
plt.ylim(0, 4.5)  # Set vertical range.
plt.xlabel("g1")  # Label first gradient coordinate.
plt.ylabel("g2")  # Label second gradient coordinate.
plt.title("B10: clipping preserves direction but limits length")  # Title the plot.
plt.show()  # Display the vectors.
```

▶ What you'll see: clipping keeps the direction of the gradient but shortens its length to the threshold.


### 🟡 Easy

#### E1. Hand-compute one SGD and momentum update on $J(w)=w^2$

Let

$$
J(w)=w^2,
\qquad
w_0=2,
\qquad
\alpha=0.1,
\qquad
v_0=0,
\qquad
\beta=0.9.
$$

First compute the gradient:

$$
\frac{dJ}{dw}=2w.
$$

At $w_0=2$,

$$
g_0=2w_0=2(2)=4.
$$

**Plain SGD:**

$$
w_1^{\text{SGD}}=w_0-\alpha g_0.
$$

Substitute numbers:

$$
w_1^{\text{SGD}}=2-0.1(4).
$$

Multiply:

$$
0.1(4)=0.4.
$$

Subtract:

$$
w_1^{\text{SGD}}=2-0.4=\boxed{1.6}.
$$

The loss after the update is

$$
J(1.6)=1.6^2=\boxed{2.56}.
$$

**Momentum:**

The velocity update is

$$
v_1=\beta v_0+(1-\beta)g_0.
$$

Substitute numbers:

$$
v_1=0.9(0)+(1-0.9)(4).
$$

Simplify:

$$
v_1=0+0.1(4)=0.4.
$$

Use the velocity in the parameter update:

$$
w_1^{\text{mom}}=w_0-\alpha v_1.
$$

Substitute numbers:

$$
w_1^{\text{mom}}=2-0.1(0.4)=2-0.04=\boxed{1.96}.
$$

The loss after the momentum update is

$$
J(1.96)=1.96^2=\boxed{3.8416}.
$$

**Interpretation:** on the first step, momentum is conservative because $v_0=0$. Momentum becomes powerful after several gradients point in a consistent direction.

#### E2. Hand-compute one RMSprop step with a large gradient coordinate

Let

$$
w_0=\begin{bmatrix}1\\1\end{bmatrix},
\qquad
 g_0=\begin{bmatrix}10\\1\end{bmatrix},
\qquad
s_0=\begin{bmatrix}0\\0\end{bmatrix},
\qquad
\beta=0.9,
\qquad
\alpha=0.1,
\qquad
\epsilon=10^{-8}.
$$

RMSprop first updates squared-gradient memory:

$$
s_1=\beta s_0+(1-\beta)g_0^2.
$$

Square the gradient coordinatewise:

$$
g_0^2=\begin{bmatrix}10^2\\1^2\end{bmatrix}
=\begin{bmatrix}100\\1\end{bmatrix}.
$$

Substitute:

$$
s_1=0.9\begin{bmatrix}0\\0\end{bmatrix}+0.1\begin{bmatrix}100\\1\end{bmatrix}.
$$

Compute:

$$
s_1=\begin{bmatrix}10\\0.1\end{bmatrix}.
$$

The RMSprop denominator is

$$
\sqrt{s_1}+\epsilon
\approx
\begin{bmatrix}\sqrt{10}\\\sqrt{0.1}\end{bmatrix}
=
\begin{bmatrix}3.1623\\0.3162\end{bmatrix}.
$$

The scaled gradient is

$$
\frac{g_0}{\sqrt{s_1}+\epsilon}
\approx
\begin{bmatrix}10/3.1623\\1/0.3162\end{bmatrix}
=
\begin{bmatrix}3.1623\\3.1623\end{bmatrix}.
$$

So the update vector is

$$
\alpha\frac{g_0}{\sqrt{s_1}+\epsilon}
\approx
0.1
\begin{bmatrix}3.1623\\3.1623\end{bmatrix}
=
\begin{bmatrix}0.3162\\0.3162\end{bmatrix}.
$$

Finally,

$$
w_1=w_0-\alpha\frac{g_0}{\sqrt{s_1}+\epsilon}
\approx
\begin{bmatrix}1\\1\end{bmatrix}-
\begin{bmatrix}0.3162\\0.3162\end{bmatrix}
=
\boxed{\begin{bmatrix}0.6838\\0.6838\end{bmatrix}}.
$$

**Interpretation:** even though the first raw gradient coordinate is ten times larger, RMSprop rescales it so both coordinates take similar first-step magnitudes.

#### E3. Hand-compute the first Adam update with bias correction

Let

$$
w_0=1,
\qquad
 g_1=0.5,
\qquad
\alpha=0.01,
\qquad
\beta_1=0.9,
\qquad
\beta_2=0.999,
\qquad
\epsilon=10^{-8},
\qquad
v_0=s_0=0.
$$

First moment:

$$
v_1=\beta_1v_0+(1-\beta_1)g_1.
$$

Substitute:

$$
v_1=0.9(0)+0.1(0.5)=0.05.
$$

Second moment:

$$
s_1=\beta_2s_0+(1-\beta_2)g_1^2.
$$

Square the gradient:

$$
g_1^2=(0.5)^2=0.25.
$$

Substitute:

$$
s_1=0.999(0)+0.001(0.25)=0.00025.
$$

Bias-correct the first moment:

$$
\hat v_1=\frac{v_1}{1-\beta_1^1}
=\frac{0.05}{1-0.9}
=\frac{0.05}{0.1}
=0.5.
$$

Bias-correct the second moment:

$$
\hat s_1=\frac{s_1}{1-\beta_2^1}
=\frac{0.00025}{1-0.999}
=\frac{0.00025}{0.001}
=0.25.
$$

Now compute the Adam step:

$$
w_1=w_0-\alpha\frac{\hat v_1}{\sqrt{\hat s_1}+\epsilon}.
$$

Substitute:

$$
w_1=1-0.01\frac{0.5}{\sqrt{0.25}+10^{-8}}.
$$

Because $\sqrt{0.25}=0.5$,

$$
w_1\approx1-0.01\frac{0.5}{0.5}=1-0.01=\boxed{0.99}.
$$

**Interpretation:** on the first scalar step, bias-corrected Adam mostly uses the sign of the gradient, producing a step of about $\alpha$.

#### E4. Xavier vs too-small vs too-large initialization

Goal: pass random inputs through a 5-layer tanh network and compare how activation variance changes under three initialization scales.

```python
def init_matrix(n_in, n_out, scheme, local_rng):  # Define one weight initializer for a fully connected layer.
    if scheme == "too_small":  # Use tiny Gaussian weights for the vanishing-activation case.
        return local_rng.normal(0.0, 0.03, size=(n_in, n_out))  # Return weights that shrink signals layer by layer.
    if scheme == "too_large":  # Use large Gaussian weights for the saturated-activation case.
        return local_rng.normal(0.0, 2.0, size=(n_in, n_out))  # Return weights that push tanh toward -1 or 1.
    limit = np.sqrt(6.0 / (n_in + n_out))  # Compute the Xavier uniform bound.
    return local_rng.uniform(-limit, limit, size=(n_in, n_out))  # Return Xavier-initialized weights.


def forward_tanh_variances(scheme, depth=5, width=80, n=1000, seed=44):  # Propagate random inputs through a tanh network.
    local_rng = np.random.default_rng(seed)  # Create a local seeded generator for reproducibility.
    A = local_rng.normal(size=(n, width))  # Sample standardized input activations.
    activations = [A]  # Store input and each hidden-layer activation.
    for _ in range(depth):  # Build a stack of hidden layers.
        W = init_matrix(width, width, scheme, local_rng)  # Initialize one layer's weights according to the requested scheme.
        Z = A @ W  # Compute pre-activations by matrix multiplication.
        A = np.tanh(Z)  # Apply tanh nonlinearity to get bounded hidden activations.
        activations.append(A)  # Save the current layer's activations.
    variances = [layer.var() for layer in activations]  # Compute total activation variance at every depth.
    return activations, variances  # Return raw activations for histograms and variances for curves.

schemes = ["too_small", "xavier", "too_large"]  # Compare bad-small, recommended, and bad-large initializations.
results = {scheme: forward_tanh_variances(scheme) for scheme in schemes}  # Run all initialization schemes.

fig, axes = plt.subplots(1, 3, figsize=(13, 3.6), sharey=True)  # Create one histogram panel per scheme.
for ax, scheme in zip(axes, schemes):  # Loop over panels and initialization schemes.
    last_layer = results[scheme][0][-1].ravel()  # Flatten final-layer activations for a histogram.
    ax.hist(last_layer, bins=40, color="white", edgecolor="black")  # Plot the final activation distribution.
    ax.set_title(scheme)  # Label the initialization scheme.
    ax.set_xlabel("final tanh activation")  # Label the histogram axis.
axes[0].set_ylabel("count")  # Label the shared count axis.
plt.suptitle("E4: final-layer activation histograms")  # Add an overall title.
plt.tight_layout()  # Reduce overlap between panels.
plt.show()  # Display the histograms.

plt.figure()  # Create a figure for variance-vs-layer curves.
for scheme in schemes:  # Plot one curve per initialization scheme.
    plt.plot(results[scheme][1], marker="o", label=scheme)  # Show how variance evolves across layers.
plt.xlabel("layer index (0 = input)")  # Label the layer axis.
plt.ylabel("activation variance")  # Label the variance axis.
plt.title("Xavier keeps variance healthier across depth")  # Title the variance comparison.
plt.legend()  # Show the scheme names.
plt.show()  # Display the variance plot.
```

▶ What you'll see: tiny weights collapse activations toward zero, huge weights saturate tanh near $\pm1$, and Xavier keeps the layer-to-layer variance more usable.

#### E5. Learning-rate schedule basics

Goal: train the same logistic classifier with fixed, step-decay, exponential-decay, and cosine-decay learning rates.

```python
def sigmoid(z):  # Define the logistic sigmoid function.
    return 1.0 / (1.0 + np.exp(-np.clip(z, -40.0, 40.0)))  # Clip logits to avoid numerical overflow.


def logistic_loss_and_grad(theta, X, y):  # Compute binary cross-entropy loss and gradient.
    logits = X @ theta  # Compute linear scores for every observation.
    probs = sigmoid(logits)  # Convert scores into probabilities.
    eps = 1e-8  # Define a small constant for safe logarithms.
    loss = -np.mean(y * np.log(probs + eps) + (1.0 - y) * np.log(1.0 - probs + eps))  # Compute average cross-entropy.
    grad = X.T @ (probs - y) / X.shape[0]  # Compute the exact full-batch gradient.
    return loss, grad  # Return both the scalar loss and the gradient vector.

X_lr = np.c_[np.ones(X_data.shape[0]), X_data[:, :2]]  # Add a bias column to the first two standardized features.
y_lr = y_data.astype(float)  # Convert labels to floats for logistic loss formulas.
schedule_fns = {"fixed": fixed_schedule, "step": step_schedule, "exponential": exponential_schedule, "cosine": cosine_schedule}  # Collect schedules.
schedule_histories = {}  # Prepare a dictionary for losses and learning rates.

epochs = 40  # Train long enough to see schedule differences without a long runtime.
for name, schedule_fn in schedule_fns.items():  # Train one logistic model per schedule.
    theta = np.zeros(X_lr.shape[1])  # Initialize parameters at zero for a fair comparison.
    losses = []  # Store loss values across epochs.
    lrs = []  # Store learning rates across epochs.
    for epoch in range(epochs):  # Repeat full-batch gradient descent for each epoch.
        lr = schedule_fn(epoch, lr0=0.7)  # Query the current schedule value.
        loss, grad = logistic_loss_and_grad(theta, X_lr, y_lr)  # Compute current loss and gradient.
        theta = theta - lr * grad  # Apply one gradient descent update.
        losses.append(loss)  # Save the pre-update loss for plotting.
        lrs.append(lr)  # Save the learning rate for plotting.
    schedule_histories[name] = {"losses": np.array(losses), "lrs": np.array(lrs)}  # Store the history.

fig, axes = plt.subplots(1, 2, figsize=(12, 4))  # Create side-by-side panels for loss and learning rate.
for name, hist in schedule_histories.items():  # Plot every schedule's history.
    axes[0].plot(hist["losses"], label=name)  # Plot loss versus epoch.
    axes[1].plot(hist["lrs"], label=name)  # Plot learning rate versus epoch.
axes[0].set_xlabel("epoch")  # Label the loss x-axis.
axes[0].set_ylabel("cross-entropy loss")  # Label the loss y-axis.
axes[0].set_title("Training loss")  # Title the loss panel.
axes[1].set_xlabel("epoch")  # Label the learning-rate x-axis.
axes[1].set_ylabel("learning rate")  # Label the learning-rate y-axis.
axes[1].set_title("Schedule value")  # Title the learning-rate panel.
axes[0].legend()  # Show schedule names on the loss panel.
axes[1].legend()  # Show schedule names on the learning-rate panel.
plt.tight_layout()  # Reduce plot overlap.
plt.show()  # Display both panels.
```

▶ What you'll see: schedules that reduce the learning rate often make rapid early progress and then settle into smoother late-stage convergence.

### 🔴 Advanced

#### A1. Optimizer paths on an ill-conditioned bowl

Goal: implement SGD, momentum, RMSprop, and Adam from scratch, then compare their paths and loss curves on

$$
J(w_1,w_2)=20w_1^2+w_2^2.
$$

This loss is steep in $w_1$ and shallow in $w_2$, so plain SGD tends to zig-zag unless the learning rate is small.

```python
w0 = np.array([2.6, 2.6])  # Start far from the optimum in both coordinates.
optimizer_runs = [  # Define optimizers and tuned learning rates for the quadratic bowl.
    run_optimizer("SGD", sgd_step, w0, lr=0.045, steps=80),  # Run plain SGD with a stable small learning rate.
    run_optimizer("Momentum", momentum_step, w0, lr=0.16, steps=80, beta=0.9),  # Run momentum with larger steps and damping.
    run_optimizer("RMSprop", rmsprop_step, w0, lr=0.13, steps=80, beta=0.9),  # Run RMSprop with coordinate scaling.
    run_optimizer("Adam", adam_step, w0, lr=0.16, steps=80, beta1=0.9, beta2=0.999),  # Run Adam with both moment estimates.
]  # Finish the optimizer run list.

fig, axes = plt.subplots(1, 2, figsize=(12, 5))  # Create panels for paths and losses.
plot_quadratic_contours(axes[0])  # Draw the quadratic contour map behind the paths.
for run in optimizer_runs:  # Plot each optimizer trace.
    path = run["path"]  # Read the stored path for this optimizer.
    axes[0].plot(path[:, 0], path[:, 1], marker="o", markersize=2.5, linewidth=1.4, label=run["name"])  # Draw the trajectory.
    axes[1].semilogy(run["losses"], label=run["name"])  # Draw the loss curve on a log scale.
axes[0].scatter([0.0], [0.0], marker="*", s=160, color="black", label="minimum")  # Mark the true minimizer.
axes[0].set_title("Optimization paths")  # Title the contour-path panel.
axes[1].set_xlabel("iteration")  # Label the iteration axis.
axes[1].set_ylabel("loss (log scale)")  # Label the loss axis.
axes[1].set_title("Loss curves")  # Title the convergence panel.
axes[0].legend()  # Show optimizer names on the path panel.
axes[1].legend()  # Show optimizer names on the loss panel.
plt.tight_layout()  # Reduce spacing issues.
plt.show()  # Display the comparison.
```

▶ What you'll see: SGD must move cautiously across the steep direction, while momentum and adaptive methods travel more directly toward the minimum.

#### A2. Failure case: learning rate too high diverges

Goal: deliberately choose a learning rate that is unstable for the steep coordinate of the quadratic.

For the $w_1$ coordinate,

$$
J(w_1)=20w_1^2,
\qquad
\frac{dJ}{dw_1}=40w_1.
$$

SGD gives

$$
w_{1,t+1}=w_{1,t}-\alpha(40w_{1,t})=(1-40\alpha)w_{1,t}.
$$

Convergence in this coordinate requires

$$
|1-40\alpha|<1.
$$

Solve the inequality:

$$
-1<1-40\alpha<1.
$$

Subtract $1$:

$$
-2<-40\alpha<0.
$$

Divide by $-40$ and reverse inequalities:

$$
0<\alpha<0.05.
$$

So $\alpha=0.08$ should diverge in the steep coordinate.

```python
stable = run_optimizer("stable α=0.045", sgd_step, w0=np.array([2.0, 2.0]), lr=0.045, steps=40)  # Run SGD below the stability limit.
divergent = run_optimizer("too high α=0.080", sgd_step, w0=np.array([2.0, 2.0]), lr=0.080, steps=40)  # Run SGD above the stability limit.

fig, axes = plt.subplots(1, 2, figsize=(12, 5))  # Create panels for trajectories and losses.
plot_quadratic_contours(axes[0], limit=8.0)  # Draw wider contours so divergent steps remain visible.
for run in [stable, divergent]:  # Plot both stable and unstable traces.
    path = run["path"]  # Read the path array.
    axes[0].plot(path[:, 0], path[:, 1], marker="o", markersize=2.5, label=run["name"])  # Draw the trajectory on contours.
    axes[1].semilogy(run["losses"], marker="o", markersize=2.5, label=run["name"])  # Draw the loss curve on log scale.
axes[0].set_xlim(-8.0, 8.0)  # Limit the horizontal axis to keep the plot readable.
axes[0].set_ylim(-4.0, 4.0)  # Limit the vertical axis to keep the plot readable.
axes[0].set_title("Stable descent vs divergent oscillation")  # Title the path panel.
axes[1].set_xlabel("iteration")  # Label the iteration axis.
axes[1].set_ylabel("loss (log scale)")  # Label the loss axis.
axes[1].set_title("Divergence appears as exploding loss")  # Title the loss panel.
axes[0].legend()  # Show labels for both trajectories.
axes[1].legend()  # Show labels for both loss curves.
plt.tight_layout()  # Reduce overlap.
plt.show()  # Display the failure case.
```

▶ What you'll see: the high learning rate flips across the valley with growing amplitude, and the log-loss curve rises instead of falls.

#### A3. Tune Adam hyperparameters on noisy gradients

Goal: train a small neural network on two-moons data while varying $\alpha$ and $\beta_1$. This shows that Adam is robust but not magic.

```python
def make_mlp_params(seed=5, hidden=12):  # Initialize a tiny one-hidden-layer MLP.
    local_rng = np.random.default_rng(seed)  # Create a reproducible local generator.
    limit1 = np.sqrt(6.0 / (2 + hidden))  # Compute Xavier bound for the input-to-hidden layer.
    limit2 = np.sqrt(6.0 / (hidden + 1))  # Compute Xavier bound for the hidden-to-output layer.
    params = {  # Store parameters in a dictionary for readable updates.
        "W1": local_rng.uniform(-limit1, limit1, size=(2, hidden)),  # Initialize first-layer weights.
        "b1": np.zeros(hidden),  # Initialize hidden biases at zero.
        "W2": local_rng.uniform(-limit2, limit2, size=(hidden, 1)),  # Initialize output-layer weights.
        "b2": np.zeros(1),  # Initialize output bias at zero.
    }  # Finish the parameter dictionary.
    return params  # Return initialized parameters.


def mlp_forward(params, X):  # Run a forward pass through the tiny MLP.
    Z1 = X @ params["W1"] + params["b1"]  # Compute hidden pre-activations.
    A1 = np.tanh(Z1)  # Apply tanh nonlinearity.
    logits = A1 @ params["W2"] + params["b2"]  # Compute output logits.
    probs = sigmoid(logits[:, 0])  # Convert logits to probabilities.
    cache = {"X": X, "Z1": Z1, "A1": A1, "probs": probs}  # Save intermediate values for backpropagation.
    return probs, cache  # Return probabilities and cache.


def mlp_loss_grads(params, X, y):  # Compute binary cross-entropy loss and gradients for the MLP.
    probs, cache = mlp_forward(params, X)  # Run the forward pass.
    eps = 1e-8  # Set a small constant for safe logarithms.
    loss = -np.mean(y * np.log(probs + eps) + (1.0 - y) * np.log(1.0 - probs + eps))  # Compute average cross-entropy.
    dlogits = (probs - y)[:, None] / X.shape[0]  # Compute derivative of loss with respect to logits.
    grads = {}  # Create a dictionary for parameter gradients.
    grads["W2"] = cache["A1"].T @ dlogits  # Compute hidden-to-output weight gradients.
    grads["b2"] = dlogits.sum(axis=0)  # Compute output bias gradient.
    dA1 = dlogits @ params["W2"].T  # Backpropagate gradients into hidden activations.
    dZ1 = dA1 * (1.0 - np.tanh(cache["Z1"]) ** 2)  # Apply tanh derivative.
    grads["W1"] = cache["X"].T @ dZ1  # Compute input-to-hidden weight gradients.
    grads["b1"] = dZ1.sum(axis=0)  # Compute hidden bias gradient.
    return loss, grads  # Return scalar loss and gradient dictionary.


def adam_update_dict(params, grads, state, lr, beta1=0.9, beta2=0.999, eps=1e-8):  # Apply Adam to a parameter dictionary.
    state["t"] = state.get("t", 0) + 1  # Increment Adam time step.
    for key in params:  # Update each parameter tensor independently.
        v_key = "v_" + key  # Build the state key for first moments.
        s_key = "s_" + key  # Build the state key for second moments.
        state[v_key] = beta1 * state.get(v_key, np.zeros_like(params[key])) + (1.0 - beta1) * grads[key]  # Update first moment.
        state[s_key] = beta2 * state.get(s_key, np.zeros_like(params[key])) + (1.0 - beta2) * grads[key] ** 2  # Update second moment.
        v_hat = state[v_key] / (1.0 - beta1 ** state["t"])  # Bias-correct first moment.
        s_hat = state[s_key] / (1.0 - beta2 ** state["t"])  # Bias-correct second moment.
        params[key] = params[key] - lr * v_hat / (np.sqrt(s_hat) + eps)  # Apply the Adam parameter update.
    return params, state  # Return updated parameters and state.

X_moon, y_moon = make_moons_data(n=360, noise=0.13, seed=6)  # Generate a nonlinear two-moons classification dataset.
X_moon = standardize(X_moon)  # Standardize the moon features for stable learning rates.
indices = rng.permutation(X_moon.shape[0])  # Shuffle indices for a reproducible train-validation split.
train_idx = indices[:260]  # Use the first shuffled block for training.
val_idx = indices[260:]  # Use the remaining block for validation.
X_train, y_train = X_moon[train_idx], y_moon[train_idx].astype(float)  # Build the training set.
X_val, y_val = X_moon[val_idx], y_moon[val_idx].astype(float)  # Build the validation set.

alphas = [0.003, 0.01, 0.03]  # Try small, default-like, and large Adam learning rates.
betas1 = [0.5, 0.9, 0.99]  # Try short, standard, and very long momentum memory.
heatmap = np.zeros((len(betas1), len(alphas)))  # Prepare validation-loss results for the grid.
curves = {}  # Store detailed curves for selected settings.

for i, beta1 in enumerate(betas1):  # Loop over beta1 values.
    for j, lr in enumerate(alphas):  # Loop over learning rates.
        params = make_mlp_params(seed=7)  # Reinitialize the same MLP for fair comparison.
        state = {}  # Reset Adam moments for this run.
        train_losses = []  # Store training losses over epochs.
        val_losses = []  # Store validation losses over epochs.
        for epoch in range(160):  # Train for a modest number of epochs.
            loss, grads = mlp_loss_grads(params, X_train, y_train)  # Compute training loss and gradients.
            params, state = adam_update_dict(params, grads, state, lr=lr, beta1=beta1)  # Apply one full-batch Adam step.
            val_loss, _ = mlp_loss_grads(params, X_val, y_val)  # Evaluate validation loss after the update.
            train_losses.append(loss)  # Save the training loss.
            val_losses.append(val_loss)  # Save the validation loss.
        heatmap[i, j] = val_losses[-1]  # Store the final validation loss for this hyperparameter pair.
        curves[(lr, beta1)] = (np.array(train_losses), np.array(val_losses), params)  # Store curves and final parameters.

fig, axes = plt.subplots(1, 2, figsize=(12, 4.5))  # Create panels for curves and the hyperparameter heatmap.
for key in [(0.003, 0.9), (0.01, 0.9), (0.03, 0.9)]:  # Plot a clean learning-rate sweep at standard beta1.
    axes[0].plot(curves[key][1], label=f"α={key[0]}, β1={key[1]}")  # Draw validation loss over epochs.
im = axes[1].imshow(heatmap, cmap="Greys_r")  # Draw the final validation-loss grid.
axes[0].set_xlabel("epoch")  # Label the curve x-axis.
axes[0].set_ylabel("validation loss")  # Label the curve y-axis.
axes[0].set_title("Adam learning-rate sweep")  # Title the curve panel.
axes[0].legend()  # Show the selected hyperparameter settings.
axes[1].set_xticks(range(len(alphas)), [str(a) for a in alphas])  # Label heatmap columns by learning rate.
axes[1].set_yticks(range(len(betas1)), [str(b) for b in betas1])  # Label heatmap rows by beta1.
axes[1].set_xlabel("learning rate α")  # Label heatmap x-axis.
axes[1].set_ylabel("β1")  # Label heatmap y-axis.
axes[1].set_title("Final validation loss")  # Title the heatmap.
plt.colorbar(im, ax=axes[1])  # Add a colorbar for validation loss values.
plt.tight_layout()  # Reduce overlap.
plt.show()  # Display both panels.
```

▶ What you'll see: Adam often tolerates several settings, but overly large learning rates or overly sluggish momentum can still produce worse validation loss.

#### A4. Schedule effects after a plateau

Goal: train the same MLP using different schedules and observe how reducing the learning rate helps after the loss plateaus.

```python
schedule_choices = {"fixed": fixed_schedule, "step": step_schedule, "exponential": exponential_schedule, "cosine": cosine_schedule}  # Reuse the schedule functions from setup.
schedule_results = {}  # Prepare storage for losses, accuracies, and learning rates.

for name, schedule_fn in schedule_choices.items():  # Train one MLP per schedule.
    params = make_mlp_params(seed=11)  # Initialize the model identically for fair comparison.
    state = {}  # Reset Adam state for each schedule.
    losses = []  # Store validation losses.
    accs = []  # Store validation accuracies.
    lrs = []  # Store the schedule values.
    for epoch in range(180):  # Train long enough for plateau behavior to appear.
        lr = schedule_fn(epoch, lr0=0.025)  # Compute this epoch's learning rate.
        loss, grads = mlp_loss_grads(params, X_train, y_train)  # Compute training loss and gradients.
        params, state = adam_update_dict(params, grads, state, lr=lr, beta1=0.9)  # Apply Adam with the scheduled learning rate.
        val_loss, _ = mlp_loss_grads(params, X_val, y_val)  # Compute validation loss.
        val_probs, _ = mlp_forward(params, X_val)  # Compute validation probabilities.
        val_acc = np.mean((val_probs >= 0.5) == y_val)  # Convert probabilities to labels and measure accuracy.
        losses.append(val_loss)  # Save validation loss.
        accs.append(val_acc)  # Save validation accuracy.
        lrs.append(lr)  # Save learning rate.
    schedule_results[name] = {"losses": np.array(losses), "accs": np.array(accs), "lrs": np.array(lrs)}  # Store traces.

fig, axes = plt.subplots(1, 3, figsize=(15, 4))  # Create panels for loss, accuracy, and learning rate.
for name, result in schedule_results.items():  # Plot every schedule.
    axes[0].plot(result["losses"], label=name)  # Plot validation loss.
    axes[1].plot(result["accs"], label=name)  # Plot validation accuracy.
    axes[2].plot(result["lrs"], label=name)  # Plot learning-rate values.
axes[0].set_title("Validation loss")  # Title the loss panel.
axes[1].set_title("Validation accuracy")  # Title the accuracy panel.
axes[2].set_title("Learning-rate schedule")  # Title the schedule panel.
for ax in axes:  # Apply shared axis formatting.
    ax.set_xlabel("epoch")  # Label each panel's x-axis.
    ax.legend()  # Show schedule names on each panel.
axes[0].set_ylabel("loss")  # Label the validation-loss axis.
axes[1].set_ylabel("accuracy")  # Label the validation-accuracy axis.
axes[2].set_ylabel("learning rate")  # Label the learning-rate axis.
plt.tight_layout()  # Reduce overlap between panels.
plt.show()  # Display the schedule comparison.
```

▶ What you'll see: after early progress slows, decaying schedules reduce update noise and can produce smoother validation curves than a permanently large fixed step.

#### A5. Transfer learning: freeze head vs unfreeze last block

Goal: simulate transfer learning with a fixed feature extractor. We compare training only the output head, training a small adapter plus head, and training all feature weights.

```python
X_feat, y_feat = make_feature_data(n=420, seed=14)  # Generate a dataset with engineered reusable features.
X_feat = standardize(X_feat)  # Standardize feature columns for stable optimization.
perm = rng.permutation(X_feat.shape[0])  # Shuffle observations before splitting.
train_ids = perm[:300]  # Select training indices.
val_ids = perm[300:]  # Select validation indices.
XF_train, yF_train = X_feat[train_ids], y_feat[train_ids].astype(float)  # Build transfer-learning training data.
XF_val, yF_val = X_feat[val_ids], y_feat[val_ids].astype(float)  # Build transfer-learning validation data.


def feature_model_init(seed=19, d_in=5, hidden=10):  # Initialize a small feature model with one hidden block and one head.
    local_rng = np.random.default_rng(seed)  # Create a local generator for reproducibility.
    limit_block = np.sqrt(6.0 / (d_in + hidden))  # Compute Xavier bound for the feature block.
    limit_head = np.sqrt(6.0 / (hidden + 1))  # Compute Xavier bound for the output head.
    return {  # Return the model parameter dictionary.
        "block_W": local_rng.uniform(-limit_block, limit_block, size=(d_in, hidden)),  # Initialize feature block weights.
        "block_b": np.zeros(hidden),  # Initialize feature block biases.
        "head_W": local_rng.uniform(-limit_head, limit_head, size=(hidden, 1)),  # Initialize classifier head weights.
        "head_b": np.zeros(1),  # Initialize classifier head bias.
    }  # Finish the dictionary.


def feature_model_loss_grads(params, X, y):  # Compute loss and gradients for the transfer-style model.
    H_pre = X @ params["block_W"] + params["block_b"]  # Compute hidden feature pre-activations.
    H = np.tanh(H_pre)  # Apply tanh to form learned features.
    logits = H @ params["head_W"] + params["head_b"]  # Compute classifier logits from features.
    probs = sigmoid(logits[:, 0])  # Convert logits to probabilities.
    eps = 1e-8  # Define safe-log constant.
    loss = -np.mean(y * np.log(probs + eps) + (1.0 - y) * np.log(1.0 - probs + eps))  # Compute binary cross-entropy.
    dlogits = (probs - y)[:, None] / X.shape[0]  # Compute output gradient.
    grads = {}  # Prepare gradient dictionary.
    grads["head_W"] = H.T @ dlogits  # Compute head weight gradient.
    grads["head_b"] = dlogits.sum(axis=0)  # Compute head bias gradient.
    dH = dlogits @ params["head_W"].T  # Backpropagate into hidden features.
    dH_pre = dH * (1.0 - np.tanh(H_pre) ** 2)  # Apply tanh derivative.
    grads["block_W"] = X.T @ dH_pre  # Compute feature-block weight gradient.
    grads["block_b"] = dH_pre.sum(axis=0)  # Compute feature-block bias gradient.
    return loss, grads  # Return the scalar loss and gradients.


def train_feature_model(mode, epochs=160, lr=0.02):  # Train transfer-style model with selected trainable components.
    params = feature_model_init()  # Initialize the same architecture.
    state = {}  # Initialize Adam state.
    val_accs = []  # Store validation accuracies.
    val_losses = []  # Store validation losses.
    trainable = {  # Define which parameters each transfer-learning mode updates.
        "head_only": ["head_W", "head_b"],  # Train only the classifier head.
        "adapter_plus_head": ["block_b", "head_W", "head_b"],  # Tune a tiny adapter-like bias plus the head.
        "full_finetune": ["block_W", "block_b", "head_W", "head_b"],  # Train the entire feature block and head.
    }[mode]  # Select the trainable parameter names for the requested mode.
    for _ in range(epochs):  # Repeat optimization for the requested number of epochs.
        _, grads = feature_model_loss_grads(params, XF_train, yF_train)  # Compute full gradients on the training set.
        masked_grads = {key: (grads[key] if key in trainable else np.zeros_like(grads[key])) for key in params}  # Zero frozen gradients.
        params, state = adam_update_dict(params, masked_grads, state, lr=lr, beta1=0.9)  # Update only trainable parameters through masked gradients.
        val_loss, _ = feature_model_loss_grads(params, XF_val, yF_val)  # Compute validation loss.
        H_pre = XF_val @ params["block_W"] + params["block_b"]  # Compute validation hidden pre-activations.
        H = np.tanh(H_pre)  # Compute validation hidden features.
        probs = sigmoid((H @ params["head_W"] + params["head_b"])[:, 0])  # Compute validation probabilities.
        acc = np.mean((probs >= 0.5) == yF_val)  # Compute validation accuracy.
        val_losses.append(val_loss)  # Store validation loss.
        val_accs.append(acc)  # Store validation accuracy.
    trainable_count = sum(params[key].size for key in trainable)  # Count trainable scalar parameters for the mode.
    return np.array(val_losses), np.array(val_accs), trainable_count  # Return curves and trainable parameter count.

modes = ["head_only", "adapter_plus_head", "full_finetune"]  # Define transfer-learning strategies to compare.
transfer_results = {mode: train_feature_model(mode) for mode in modes}  # Train all strategies.

fig, axes = plt.subplots(1, 3, figsize=(15, 4))  # Create panels for parameters, loss, and accuracy.
axes[0].bar(modes, [transfer_results[m][2] for m in modes], color="white", edgecolor="black")  # Plot trainable parameter counts.
for mode in modes:  # Plot curves for each transfer-learning mode.
    axes[1].plot(transfer_results[mode][0], label=mode)  # Plot validation loss.
    axes[2].plot(transfer_results[mode][1], label=mode)  # Plot validation accuracy.
axes[0].set_title("Trainable parameters")  # Title parameter-count panel.
axes[1].set_title("Validation loss")  # Title loss panel.
axes[2].set_title("Validation accuracy")  # Title accuracy panel.
axes[0].tick_params(axis="x", rotation=25)  # Rotate long mode labels.
axes[1].set_xlabel("epoch")  # Label loss x-axis.
axes[2].set_xlabel("epoch")  # Label accuracy x-axis.
axes[1].set_ylabel("loss")  # Label loss y-axis.
axes[2].set_ylabel("accuracy")  # Label accuracy y-axis.
axes[1].legend()  # Show mode names on loss plot.
axes[2].legend()  # Show mode names on accuracy plot.
plt.tight_layout()  # Reduce overlap.
plt.show()  # Display the transfer-learning comparison.
```

▶ What you'll see: head-only training changes the fewest parameters, partial tuning is a middle ground, and full fine-tuning has the most flexibility but also the greatest overfitting risk on small data.

### Interactive Experiment

Use the widget to choose an optimizer and learning rate, then watch the path on the same two-dimensional loss surface. If widgets are unavailable, the fallback call still produces one static plot.

```python
def interactive_optimizer_plot(optimizer="Adam", learning_rate=0.10):  # Define the plotting function controlled by widgets.
    step_map = {"SGD": sgd_step, "Momentum": momentum_step, "RMSprop": rmsprop_step, "Adam": adam_step}  # Map names to optimizer functions.
    kwargs_map = {"SGD": {}, "Momentum": {"beta": 0.9}, "RMSprop": {"beta": 0.9}, "Adam": {"beta1": 0.9, "beta2": 0.999}}  # Map names to optimizer parameters.
    run = run_optimizer(optimizer, step_map[optimizer], w0=np.array([2.7, 2.3]), lr=learning_rate, steps=55, **kwargs_map[optimizer])  # Run the selected optimizer.
    fig, axes = plt.subplots(1, 2, figsize=(12, 4.5))  # Create panels for path and loss.
    plot_quadratic_contours(axes[0])  # Draw the loss contours.
    path = run["path"]  # Read the optimization path.
    axes[0].plot(path[:, 0], path[:, 1], marker="o", markersize=3, color="black")  # Plot the selected path.
    axes[0].scatter([0.0], [0.0], marker="*", s=150, color="black")  # Mark the optimum.
    axes[0].set_title(f"{optimizer} path, α={learning_rate:.3f}")  # Title the path panel.
    axes[1].semilogy(run["losses"], color="black")  # Plot the selected loss curve on a log scale.
    axes[1].set_xlabel("iteration")  # Label the iteration axis.
    axes[1].set_ylabel("loss")  # Label the loss axis.
    axes[1].set_title("Loss curve")  # Title the loss panel.
    plt.tight_layout()  # Reduce overlap.
    plt.show()  # Display the interactive plot.

try:  # Try to enable notebook widgets when ipywidgets is installed.
    from ipywidgets import interact, Dropdown, FloatSlider  # Import widget controls for interactive notebooks.
    interact(  # Create an interactive control panel around the plotting function.
        interactive_optimizer_plot,  # Use the optimizer plotting function as the callback.
        optimizer=Dropdown(options=["SGD", "Momentum", "RMSprop", "Adam"], value="Adam", description="optimizer"),  # Add optimizer selector.
        learning_rate=FloatSlider(value=0.10, min=0.005, max=0.20, step=0.005, description="α"),  # Add learning-rate slider.
    )  # Finish widget construction.
except Exception as exc:  # Fall back gracefully when widgets are not available.
    print(f"ipywidgets unavailable ({exc}); showing a static Adam run instead.")  # Explain why the fallback is used.
    interactive_optimizer_plot(optimizer="Adam", learning_rate=0.10)  # Produce a static plot that still teaches the idea.
```

▶ What you'll see: SGD is sensitive to the learning rate on the steep valley; momentum smooths oscillations; RMSprop and Adam adapt coordinate steps and often take cleaner paths.
