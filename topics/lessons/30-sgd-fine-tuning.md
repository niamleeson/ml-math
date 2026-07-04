# SGD & Fine-tuning Models
> **Source:** CS 221 · **Category:** Method · **Type:** ⚖️ Both · [↑ Full reference](../../ai-ml-cheatsheets.md)
> 📓 The coded examples form a runnable notebook section; an `.ipynb` will be generated.

## 1. Overview

Stochastic gradient descent (SGD) is the workhorse algorithm that turns local loss gradients into learned model parameters. Instead of solving for the best weights in one closed-form jump, SGD repeatedly asks: “for this example, which direction makes the loss smaller?”

**One-line intuition:** SGD learns by taking many small downhill steps; fine-tuning decides which parts of a previously learned model are allowed to move during those steps.

Fine-tuning is transfer learning with constraints. A pretrained representation supplies useful features, while the practitioner chooses whether to freeze early layers, train only a new head, partially unfreeze, or update the entire model.

## 2. Key Idea

Let a training example be $(x,y)$, let its feature vector be $\phi(x)\in\mathbb{R}^d$, and let the model parameters be $w\in\mathbb{R}^d$. A per-example loss is

$$
\operatorname{Loss}(x,y,w).
$$

The exact update rule from the reference is

$$
\boxed{w\leftarrow w-\eta\nabla_w\operatorname{Loss}(x,y,w)}
$$

where $\eta\in\mathbb{R}$ is the **learning rate** or **step size**.

### Batch vs. stochastic updates

For one example $(x_i,y_i)$, SGD uses

$$
g_i=\nabla_w\operatorname{Loss}(x_i,y_i,w),
\qquad
w\leftarrow w-\eta g_i.
$$

For a mini-batch $B$ of $m$ examples, mini-batch gradient descent uses

$$
g_B=\frac{1}{m}\sum_{i\in B}\nabla_w\operatorname{Loss}(x_i,y_i,w),
\qquad
w\leftarrow w-\eta g_B.
$$

For the entire training set $\mathcal{D}_{\text{train}}$ of $n$ examples, full-batch gradient descent uses

$$
g_{\text{full}}=\frac{1}{n}\sum_{i=1}^{n}\nabla_w\operatorname{Loss}(x_i,y_i,w),
\qquad
w\leftarrow w-\eta g_{\text{full}}.
$$

**Tradeoff:** SGD is noisy but cheap per update; full-batch GD is stable but expensive per update; mini-batches interpolate between the two.

### Learning-rate behavior

If $\eta$ is too small, then

$$
\|w_{t+1}-w_t\|=\eta\|\nabla_w\operatorname{Loss}\|
$$

is tiny, so training crawls. If $\eta$ is too large, the update can jump across the minimum and increase loss. A useful $\eta$ makes progress while keeping the loss trajectory stable.

### Logistic prediction and gradients

For binary classification, the sigmoid is

$$
\boxed{\sigma(z)=\frac{1}{1+e^{-z}}}
$$

with derivative

$$
\boxed{\sigma'(z)=\sigma(z)(1-\sigma(z))}.
$$

A linear logistic model predicts

$$
p(y=1\mid x;w)=\sigma(w^\top\phi(x)).
$$

### Hypothesis class and fine-tuning

A hypothesis class with fixed features and varying weights is

$$
\boxed{\mathcal{F}=\{f_w:w\in\mathbb{R}^d\}}.
$$

Fine-tuning changes what parameter subspace is allowed to vary. If a model is decomposed as

$$
f(x)=h_{\theta_{\text{head}}}(r_{\theta_{\text{base}}}(x)),
$$

then common transfer-learning choices are:

- **Frozen feature extractor:** update $\theta_{\text{head}}$ only.
- **Partial unfreeze:** update $\theta_{\text{head}}$ and late base layers.
- **Full fine-tune:** update $\theta_{\text{head}}$ and all of $\theta_{\text{base}}$.

### Pseudocode

```text
Given training data D_train, learning rate eta, epochs T, and initial weights w
For epoch = 1, ..., T:
    Shuffle D_train
    For each mini-batch B in D_train:
        Compute predictions on B
        Compute average loss on B
        Compute gradient g_B = average gradient of loss with respect to trainable weights
        Update trainable weights: w <- w - eta g_B
Return w
```

For fine-tuning, the same loop is used, but gradients for frozen parameters are ignored:

```text
Given pretrained parameters theta_base, new head theta_head, and a freeze mask
For each update:
    Run forward pass through base and head
    Run backward pass to compute gradients
    If a parameter is frozen, set its gradient to 0 or skip its update
    Update only trainable parameters
Return the fine-tuned model
```

## 3. Worked Examples

### Setup

```python
import numpy as np  # Import NumPy once so every later example can use fast vector operations.
import matplotlib.pyplot as plt  # Import Matplotlib once so every later example can plot results.
try:  # Try to import notebook widgets for the final interactive experiment.
    import ipywidgets as widgets  # Import widgets when the notebook environment supports them.
    from IPython.display import display  # Import display so widget layouts can be shown.
    HAS_WIDGETS = True  # Record that interactive widgets are available.
except Exception:  # Fall back gracefully when widgets are not installed.
    widgets = None  # Store a harmless placeholder so later code can branch cleanly.
    display = print  # Reuse print as a minimal display replacement outside notebooks.
    HAS_WIDGETS = False  # Record that the non-widget fallback should be used.
np.random.seed(221)  # Seed NumPy's legacy RNG for reproducible helper behavior.
rng = np.random.default_rng(221)  # Create a modern reproducible random generator for data creation.
plt.rcParams["figure.figsize"] = (7, 4)  # Set a consistent figure size for readable lesson plots.
plt.rcParams["axes.grid"] = True  # Turn on grid lines so trajectories and curves are easier to compare.
def sigmoid(z):  # Define the logistic sigmoid used by classification and fine-tuning examples.
    z = np.clip(z, -40.0, 40.0)  # Clip extreme inputs to avoid unnecessary overflow in exp.
    return 1.0 / (1.0 + np.exp(-z))  # Return sigma(z)=1/(1+e^{-z}).
def binary_cross_entropy(y, p):  # Define average binary cross-entropy for labels y and probabilities p.
    p = np.clip(p, 1e-9, 1.0 - 1e-9)  # Clip probabilities so log never receives exactly zero.
    return float(-np.mean(y * np.log(p) + (1.0 - y) * np.log(1.0 - p)))  # Return the mean negative log-likelihood.
def accuracy(y, p):  # Define a simple 0/1 accuracy helper for probabilistic binary predictions.
    return float(np.mean((p >= 0.5) == y))  # Threshold probabilities at 0.5 and average correctness.
def add_bias(X):  # Define a helper that appends an intercept column to a design matrix.
    return np.c_[np.ones(X.shape[0]), X]  # Concatenate a leading column of ones with the original features.
def logistic_loss_and_grad(Xb, y, w, l2=0.0):  # Define logistic loss and gradient for biased feature matrix Xb.
    p = sigmoid(Xb @ w)  # Compute predicted probabilities from the current linear scores.
    loss = binary_cross_entropy(y, p) + 0.5 * l2 * float(np.sum(w[1:] ** 2))  # Add L2 penalty excluding bias.
    grad = (Xb.T @ (p - y)) / Xb.shape[0]  # Compute the average cross-entropy gradient.
    grad[1:] = grad[1:] + l2 * w[1:]  # Add the derivative of the L2 penalty to non-bias weights.
    return loss, grad, p  # Return loss, gradient, and probabilities for reuse in training loops.
def run_logistic_sgd(Xb, y, eta=0.1, epochs=60, batch_size=16, l2=0.0, seed=0):  # Train logistic regression by mini-batch SGD.
    local_rng = np.random.default_rng(seed)  # Create a local RNG so repeated calls are reproducible.
    w = np.zeros(Xb.shape[1])  # Initialize all weights at zero for a neutral starting point.
    losses = []  # Store full-data losses after updates so curves are comparable across settings.
    for epoch in range(epochs):  # Repeat multiple passes over the training data.
        order = local_rng.permutation(Xb.shape[0])  # Shuffle example order to make updates stochastic.
        for start in range(0, Xb.shape[0], batch_size):  # Walk through the shuffled data in mini-batches.
            idx = order[start:start + batch_size]  # Select the current mini-batch indices.
            _, grad, _ = logistic_loss_and_grad(Xb[idx], y[idx], w, l2=l2)  # Compute the mini-batch gradient.
            w = w - eta * grad  # Apply the SGD update w <- w - eta * gradient.
        loss, _, _ = logistic_loss_and_grad(Xb, y, w, l2=l2)  # Measure the full-data loss after this epoch.
        losses.append(loss)  # Save the epoch loss for plotting.
    return w, np.array(losses)  # Return the trained weights and the full loss history.
def mean_squared_error(y_true, y_pred):  # Define mean squared error for regression examples.
    return float(np.mean((y_true - y_pred) ** 2))  # Average squared residuals across all examples.
def polynomial_features(x, degree):  # Build polynomial columns 1, x, x^2, ..., x^degree.
    return np.vstack([x ** k for k in range(degree + 1)]).T  # Stack powers column-wise and transpose to rows.
```

#### Data — swappable sources

```python
DATA_SOURCE = "default"  # Choose "default", "noisy", or "shifted" to change the toy data source.
n_reg = 80  # Set the number of regression points used by SGD versus full-batch comparisons.
x_reg = rng.uniform(-2.0, 2.0, size=n_reg)  # Draw one-dimensional inputs for the linear regression task.
noise_scale = 0.7 if DATA_SOURCE == "noisy" else 0.35  # Increase noise when the noisy source is requested.
y_reg = 1.5 - 2.0 * x_reg + rng.normal(0.0, noise_scale, size=n_reg)  # Generate linear targets with Gaussian noise.
X_reg = add_bias(x_reg.reshape(-1, 1))  # Add an intercept column to create a two-parameter regression design.
n_cls = 160  # Set the number of binary-classification examples.
class0 = rng.normal(loc=[-1.2, -0.7], scale=[0.65, 0.55], size=(n_cls // 2, 2))  # Generate the negative class cloud.
class1 = rng.normal(loc=[1.1, 0.8], scale=[0.65, 0.55], size=(n_cls // 2, 2))  # Generate the positive class cloud.
X_cls = np.vstack([class0, class1])  # Combine both class clouds into one feature matrix.
y_cls = np.r_[np.zeros(n_cls // 2), np.ones(n_cls // 2)]  # Create binary labels aligned with the stacked features.
shift = np.array([0.35, -0.25]) if DATA_SOURCE == "shifted" else np.array([0.0, 0.0])  # Define an optional domain shift.
X_cls = X_cls + shift  # Apply the optional shift so learners can test robustness.
perm = rng.permutation(n_cls)  # Shuffle classification examples so class order is not grouped.
X_cls = X_cls[perm]  # Reorder features according to the shuffled indices.
y_cls = y_cls[perm]  # Reorder labels using the same shuffled indices.
X_cls_b = add_bias(X_cls)  # Add an intercept column for logistic regression.
x_sine = np.linspace(-3.0, 3.0, 90)  # Create evenly spaced inputs for polynomial regularization examples.
y_sine = np.sin(1.5 * x_sine) + rng.normal(0.0, 0.18, size=x_sine.shape[0])  # Generate noisy nonlinear targets.
train_idx = np.arange(0, 60)  # Use the first block as a simple training split for polynomial fitting.
val_idx = np.arange(60, 90)  # Use the remaining block as a validation split.
X_transfer = rng.normal(0.0, 1.0, size=(240, 2))  # Generate source inputs for the fine-tuning toy task.
source_labels = ((X_transfer[:, 0] + X_transfer[:, 1]) > 0.0).astype(float)  # Label the source task by a diagonal boundary.
target_labels = ((X_transfer[:, 0] - 0.8 * X_transfer[:, 1] + 0.2) > 0.0).astype(float)  # Label the target task by a rotated boundary.
plt.figure()  # Create a quick data overview figure.
plt.scatter(X_cls[:, 0], X_cls[:, 1], c=y_cls, cmap="coolwarm", edgecolor="k", alpha=0.75)  # Plot classification data by label.
plt.title("Swappable toy classification data")  # Title the data plot.
plt.xlabel("feature 1")  # Label the horizontal feature axis.
plt.ylabel("feature 2")  # Label the vertical feature axis.
plt.show()  # Display the data plot before the worked coded examples.
```

▶ What you'll see: a separable but not perfect two-class toy dataset. Later examples reuse it so optimizer behavior, not changing data, explains most differences.


### 🟢 Basics (warm-up)

#### B1. Apply one scalar SGD update $w\leftarrow w-\eta g$

Suppose

$$
w=4,
\qquad
\eta=0.25,
\qquad
g=\frac{\partial \operatorname{Loss}}{\partial w}=6.
$$

Apply the SGD rule:

$$
w_{\text{new}}=w-\eta g.
$$

Substitute values:

$$
w_{\text{new}}=4-(0.25)(6).
$$

Multiply the step size and gradient:

$$
(0.25)(6)=1.5.
$$

Subtract the downhill step:

$$
w_{\text{new}}=4-1.5=2.5.
$$

$$
\boxed{w_{\text{new}}=2.5}
$$

The sign matters: because $g>0$, increasing $w$ would increase the loss locally, so SGD decreases $w$.

```python
w_b1 = 4.0  # starting scalar parameter from the worked example.
eta_b1 = 0.25  # learning rate from the worked example.
g_b1 = 6.0  # scalar gradient from the worked example.
w_new_b1 = w_b1 - eta_b1 * g_b1  # one SGD step using w <- w - eta g.
print("updated w:", round(w_new_b1, 4))  # print the boxed value 2.5.
```

▶ What you'll see: the scalar parameter updates from 4.0 to 2.5.

👀 Takeaway: a positive gradient moves the parameter downward.

#### B2. Evaluate the loss before and after one update

Use scalar squared loss

$$
\operatorname{Loss}(w)=(w-1)^2.
$$

At $w=4$,

$$
\operatorname{Loss}(4)=(4-1)^2=3^2=9.
$$

The derivative is

$$
\frac{d}{dw}(w-1)^2=2(w-1).
$$

At $w=4$,

$$
g=2(4-1)=6.
$$

Using $\eta=0.25$ gives the same update as B1:

$$
w_{\text{new}}=4-0.25\cdot 6=2.5.
$$

Now evaluate the new loss:

$$
\operatorname{Loss}(2.5)=(2.5-1)^2=1.5^2=2.25.
$$

Compare:

$$
9\longrightarrow 2.25.
$$

$$
\boxed{\text{One correct SGD step reduced the loss from }9\text{ to }2.25.}
$$

```python
w_before_b2 = 4.0  # starting point used in the hand calculation.
eta_b2 = 0.25  # learning rate used in the hand calculation.
loss_before_b2 = (w_before_b2 - 1.0) ** 2  # squared loss before the update.
grad_b2 = 2.0 * (w_before_b2 - 1.0)  # derivative of (w - 1)^2 at w = 4.
w_after_b2 = w_before_b2 - eta_b2 * grad_b2  # one SGD step, matching B1.
loss_after_b2 = (w_after_b2 - 1.0) ** 2  # squared loss after the update.
print("loss change:", round(loss_before_b2, 4), "->", round(loss_after_b2, 4))  # print 9.0 -> 2.25.
```

▶ What you'll see: the loss drops from 9.0 to 2.25.

👀 Takeaway: a correctly sized downhill step can reduce loss immediately.

```python
w_before_b2 = 4.0  # starting point used in the hand calculation.
eta_b2 = 0.25  # learning rate used in the hand calculation.
grad_b2 = 2.0 * (w_before_b2 - 1.0)  # derivative of (w - 1)^2 at w = 4.
w_after_b2 = w_before_b2 - eta_b2 * grad_b2  # one SGD step, matching the math.
loss_before_b2 = (w_before_b2 - 1.0) ** 2  # squared loss before the update.
loss_after_b2 = (w_after_b2 - 1.0) ** 2  # squared loss after the update.
w_grid_b2 = np.linspace(0.0, 4.5, 100)  # grid of scalar w values for the loss bowl.
loss_grid_b2 = (w_grid_b2 - 1.0) ** 2  # squared loss values on the grid.
plt.plot(w_grid_b2, loss_grid_b2)  # draw the one-dimensional loss curve.
plt.scatter([w_before_b2, w_after_b2], [loss_before_b2, loss_after_b2])  # mark before and after points.
plt.title("B2: one SGD step lowers squared loss")  # title the micro-visualization.
plt.xlabel("w")  # label the horizontal axis.
plt.ylabel("Loss(w)")  # label the vertical axis.
plt.show()  # display the figure.
```

▶ What you'll see: the point moves downhill on the squared-loss bowl.

#### B3. Mark frozen vs. trainable parameters in a tiny layer

Consider a pretrained feature layer followed by a new classifier head:

$$
z=W_{\text{base}}x+b_{\text{base}},
\qquad
\hat{y}=\sigma(w_{\text{head}}^\top z+b_{\text{head}}).
$$

A frozen-feature fine-tuning plan is:

| Parameter | Role | Frozen? | Updated by SGD? |
|---|---:|---:|---:|
| $W_{\text{base}}$ | old representation | yes | no |
| $b_{\text{base}}$ | old representation bias | yes | no |
| $w_{\text{head}}$ | new task classifier | no | yes |
| $b_{\text{head}}$ | new task classifier bias | no | yes |

If $\nabla_{W_{\text{base}}}\operatorname{Loss}\neq 0$ but the base is frozen, the update is still

$$
W_{\text{base}}\leftarrow W_{\text{base}}.
$$

For the head,

$$
w_{\text{head}}\leftarrow w_{\text{head}}-\eta\nabla_{w_{\text{head}}}\operatorname{Loss}.
$$

$$
\boxed{\text{Freeze means “do not update,” not “the gradient concept disappears.”}}
$$


```python
params_b3 = np.array(["W_base", "b_base", "w_head", "b_head"])  # parameter names from the table.
frozen_b3 = np.array([True, True, False, False])  # freeze flags from the fine-tuning plan.
updated_b3 = np.logical_not(frozen_b3)  # SGD updates exactly the non-frozen parameters.
for name_b3, is_updated_b3 in zip(params_b3, updated_b3):  # inspect each parameter's update status.
    print(name_b3, "updated by SGD:", bool(is_updated_b3))  # print whether each parameter moves.
```

▶ What you'll see: base parameters are not updated, while head parameters are updated.

👀 Takeaway: freezing blocks parameter updates even when gradients exist.

#### B4. Compute the gradient of one scalar squared loss

Use

$$
\operatorname{Loss}(w)=(w-3)^2.
$$

Differentiate:

$$
\frac{d}{dw}(w-3)^2=2(w-3).
$$

At

$$
w=5,
$$

the gradient is

$$
g=2(5-3)=4.
$$

$$
\boxed{g=4}
$$

The positive gradient says to decrease $w$ if we want to move downhill.

```python
w_b4 = 5.0  # scalar point where the gradient is evaluated.
grad_b4 = 2.0 * (w_b4 - 3.0)  # derivative of (w - 3)^2 at w = 5.
print("gradient:", round(grad_b4, 4))  # print the boxed gradient 4.0.
```

▶ What you'll see: the computed scalar gradient is 4.0.

👀 Takeaway: the sign and size of the derivative define the local SGD direction.

#### B5. Compare a batch gradient with a single-point gradient

Suppose two example gradients are

$$
g_1=6,
\qquad
g_2=-2.
$$

A single SGD step on example $1$ uses

$$
g_{\text{SGD}}=g_1=6.
$$

A full-batch step averages both examples:

$$
g_{\text{batch}}=\frac{g_1+g_2}{2}=\frac{6+(-2)}{2}=2.
$$

$$
\boxed{g_{\text{SGD}}=6,\qquad g_{\text{batch}}=2}
$$

Batch gradients are smoother because opposite example signals can cancel.

```python
g1_b5 = 6.0  # first per-example gradient from the worked example.
g2_b5 = -2.0  # second per-example gradient from the worked example.
g_sgd_b5 = g1_b5  # one stochastic update uses only the first example's gradient.
g_batch_b5 = (g1_b5 + g2_b5) / 2.0  # full-batch gradient averages both examples.
print("gradients:", "SGD =", round(g_sgd_b5, 4), "batch =", round(g_batch_b5, 4))  # print 6.0 and 2.0.
```

▶ What you'll see: the stochastic gradient is 6.0, while the batch gradient is 2.0.

👀 Takeaway: averaging can soften conflicting example-level gradient signals.

#### B6. Show one too-large learning-rate step

Use the scalar loss

$$
\operatorname{Loss}(w)=w^2.
$$

At $w=1$, the gradient is

$$
g=2w=2.
$$

With an overly large learning rate $\eta=2$,

$$
w_{\text{new}}=1-2\cdot2=-3.
$$

The loss changes from

$$
\operatorname{Loss}(1)=1
$$

to

$$
\operatorname{Loss}(-3)=9.
$$

$$
\boxed{1\longrightarrow 9}
$$

One oversized step jumped past the minimum and made the loss worse.

```python
w_before_b6 = 1.0  # starting point on Loss(w) = w^2.
eta_b6 = 2.0  # intentionally oversized learning rate.
grad_b6 = 2.0 * w_before_b6  # derivative of w^2 at w = 1.
loss_before_b6 = w_before_b6 ** 2  # loss before the update.
w_after_b6 = w_before_b6 - eta_b6 * grad_b6  # one too-large SGD step.
loss_after_b6 = w_after_b6 ** 2  # loss after overshooting the minimum.
print("loss change:", round(loss_before_b6, 4), "->", round(loss_after_b6, 4))  # print 1.0 -> 9.0.
```

▶ What you'll see: the loss increases from 1.0 to 9.0 after the update.

👀 Takeaway: a downhill direction can still fail if the step size is too large.

```python
w_before_b6 = 1.0  # starting point on Loss(w) = w^2.
eta_b6 = 2.0  # intentionally oversized learning rate.
grad_b6 = 2.0 * w_before_b6  # derivative of w^2 at w = 1.
w_after_b6 = w_before_b6 - eta_b6 * grad_b6  # one too-large SGD step.
loss_before_b6 = w_before_b6 ** 2  # loss before the update.
loss_after_b6 = w_after_b6 ** 2  # loss after overshooting the minimum.
w_grid_b6 = np.linspace(-3.5, 1.5, 100)  # grid of scalar w values around the overshoot.
loss_grid_b6 = w_grid_b6 ** 2  # squared loss values for Loss(w) = w^2.
plt.plot(w_grid_b6, loss_grid_b6)  # draw the loss bowl.
plt.scatter([w_before_b6, w_after_b6], [loss_before_b6, loss_after_b6])  # mark before and after losses.
plt.plot([w_before_b6, w_after_b6], [loss_before_b6, loss_after_b6])  # connect the oversized step.
plt.title("B6: too-large learning rate overshoots")  # title the micro-visualization.
plt.xlabel("w")  # label the horizontal axis.
plt.ylabel("Loss(w)")  # label the vertical axis.
plt.show()  # display the figure.
```

▶ What you'll see: the update jumps across the minimum to a higher-loss point.

#### B7. Apply a freeze mask to one update

Let

$$
w=\begin{bmatrix}10\\1\\-2\end{bmatrix},
\qquad
g=\begin{bmatrix}5\\4\\-3\end{bmatrix},
\qquad
\eta=0.1.
$$

Use freeze mask

$$
\text{trainable}=\begin{bmatrix}0\\1\\1\end{bmatrix}.
$$

Mask the gradient:

$$
g_{\text{masked}}=\begin{bmatrix}0\\4\\-3\end{bmatrix}.
$$

Update only trainable entries:

$$
w_{\text{new}}=w-0.1g_{\text{masked}}
=\begin{bmatrix}10\\0.6\\-1.7\end{bmatrix}.
$$

$$
\boxed{w_{\text{new}}=(10,0.6,-1.7)}
$$

The frozen first parameter did not move.

```python
w_b7 = np.array([10.0, 1.0, -2.0])  # starting parameter vector from the worked example.
g_b7 = np.array([5.0, 4.0, -3.0])  # gradient vector from the worked example.
eta_b7 = 0.1  # learning rate from the worked example.
trainable_b7 = np.array([0.0, 1.0, 1.0])  # freeze mask with 0 for frozen and 1 for trainable.
g_masked_b7 = trainable_b7 * g_b7  # mask out the frozen parameter's gradient.
w_new_b7 = w_b7 - eta_b7 * g_masked_b7  # update only trainable entries.
print("updated w:", np.round(w_new_b7, 4))  # print the boxed vector [10.0, 0.6, -1.7].
```

▶ What you'll see: only the second and third entries change.

👀 Takeaway: a freeze mask turns selected gradient components into no-ops.

#### B8. Shuffle indices for one epoch

For four examples, begin with ordered indices

$$
[0,1,2,3].
$$

One possible shuffled epoch order is

$$
[2,0,3,1].
$$

SGD then visits examples in this order:

$$
x_2\rightarrow x_0\rightarrow x_3\rightarrow x_1.
$$

$$
\boxed{\text{one epoch uses each index exactly once, in shuffled order}}
$$

Shuffling changes the noise pattern without changing the dataset.

```python
indices_b8 = np.array([0, 1, 2, 3])  # original ordered example indices.
order_b8 = np.array([2, 0, 3, 1])  # one fixed shuffled order matching the worked example.
visited_once_b8 = np.array_equal(np.sort(order_b8), indices_b8)  # check that each index appears exactly once.
print("epoch order:", order_b8.tolist())  # print the shuffled order [2, 0, 3, 1].
print("uses each index once:", bool(visited_once_b8))  # print the boxed property of one epoch.
```

▶ What you'll see: the epoch visits [2, 0, 3, 1] and uses every index once.

👀 Takeaway: shuffling changes order, not membership.

#### B9. Compute a running average loss

Suppose the first three observed losses are

$$
4,
\qquad
2,
\qquad
3.
$$

The running average after three updates is

$$
\bar{L}_3=\frac{4+2+3}{3}=3.
$$

If the fourth loss is $1$, then

$$
\bar{L}_4=\frac{4+2+3+1}{4}=2.5.
$$

$$
\boxed{\bar{L}_3=3,\qquad \bar{L}_4=2.5}
$$

Running averages smooth noisy per-example losses.

```python
losses_b9 = np.array([4.0, 2.0, 3.0, 1.0])  # observed per-example losses from the worked example.
avg3_b9 = np.mean(losses_b9[:3])  # running average after the first three updates.
avg4_b9 = np.mean(losses_b9[:4])  # running average after the fourth update.
print("running averages:", "L3 =", round(avg3_b9, 4), "L4 =", round(avg4_b9, 4))  # print 3.0 and 2.5.
```

▶ What you'll see: the running averages are 3.0 after three losses and 2.5 after four.

👀 Takeaway: the average summarizes noisy losses with a smoother trend.

#### B10. Compute one momentum update

Let the previous velocity be

$$
v=0.4,
$$

the new gradient be

$$
g=2,
$$

and momentum coefficient be

$$
\beta=0.9.
$$

Compute the new velocity:

$$
v_{\text{new}}=\beta v+g=0.9(0.4)+2=2.36.
$$

With $\eta=0.1$, the parameter step is

$$
-\eta v_{\text{new}}=-0.236.
$$

$$
\boxed{v_{\text{new}}=2.36,\qquad \Delta w=-0.236}
$$

Momentum carries some direction from previous gradients into the next step.

```python
v_b10 = 0.4  # previous velocity from the worked example.
g_b10 = 2.0  # new gradient from the worked example.
beta_b10 = 0.9  # momentum coefficient from the worked example.
eta_b10 = 0.1  # learning rate from the worked example.
v_new_b10 = beta_b10 * v_b10 + g_b10  # momentum update for the new velocity.
delta_w_b10 = -eta_b10 * v_new_b10  # parameter change induced by the new velocity.
print("momentum:", "v_new =", round(v_new_b10, 4), "delta_w =", round(delta_w_b10, 4))  # print 2.36 and -0.236.
```

▶ What you'll see: the new velocity is 2.36 and the parameter step is -0.236.

👀 Takeaway: momentum mixes past direction with the current gradient.

```python
v_b10 = 0.4  # previous velocity from the worked example.
g_b10 = 2.0  # new gradient from the worked example.
beta_b10 = 0.9  # momentum coefficient from the worked example.
v_new_b10 = beta_b10 * v_b10 + g_b10  # momentum update for the new velocity.
steps_b10 = np.arange(2)  # two displayed moments: previous and new velocity.
velocities_b10 = np.array([v_b10, v_new_b10])  # velocity values before and after the update.
plt.plot(steps_b10, velocities_b10, marker="o")  # draw how momentum changes the velocity.
plt.title("B10: momentum carries velocity forward")  # title the micro-visualization.
plt.xlabel("momentum update index")  # label the horizontal axis.
plt.ylabel("velocity")  # label the vertical axis.
plt.show()  # display the figure.
```

▶ What you'll see: the velocity rises from the previous value to the momentum-combined value.

### 🟡 Easy

#### E1. Hand-compute one SGD update for squared loss

Use one example

$$
\phi(x)=\begin{bmatrix}1\\2\end{bmatrix},
\qquad
y=3,
\qquad
w=\begin{bmatrix}0\\1\end{bmatrix},
\qquad
\eta=0.1.
$$

Use squared loss with the convenient $\tfrac12$ factor:

$$
\operatorname{Loss}(x,y,w)=\frac12(w^\top\phi(x)-y)^2.
$$

**Step 1 — prediction.**

$$
\hat{y}=w^\top\phi(x)
=\begin{bmatrix}0&1\end{bmatrix}
\begin{bmatrix}1\\2\end{bmatrix}
=0\cdot 1+1\cdot 2=2.
$$

**Step 2 — residual.**

$$
r=\hat{y}-y=2-3=-1.
$$

**Step 3 — gradient.**

Because

$$
\operatorname{Loss}=\frac12 r^2,
\qquad
r=w^\top\phi(x)-y,
$$

the chain rule gives

$$
\nabla_w\operatorname{Loss}
=\frac{\partial}{\partial w}\frac12 r^2
=r\nabla_w r.
$$

Since

$$
\nabla_w(w^\top\phi(x)-y)=\phi(x),
$$

we get

$$
\nabla_w\operatorname{Loss}=r\phi(x)
=(-1)\begin{bmatrix}1\\2\end{bmatrix}
=\begin{bmatrix}-1\\-2\end{bmatrix}.
$$

**Step 4 — update.**

$$
w_{\text{new}}=w-\eta\nabla_w\operatorname{Loss}
=\begin{bmatrix}0\\1\end{bmatrix}
-0.1\begin{bmatrix}-1\\-2\end{bmatrix}.
$$

Distribute the learning rate:

$$
0.1\begin{bmatrix}-1\\-2\end{bmatrix}
=\begin{bmatrix}-0.1\\-0.2\end{bmatrix}.
$$

Subtracting a negative vector adds:

$$
w_{\text{new}}
=\begin{bmatrix}0\\1\end{bmatrix}
-\begin{bmatrix}-0.1\\-0.2\end{bmatrix}
=\begin{bmatrix}0.1\\1.2\end{bmatrix}.
$$

$$
\boxed{w_{\text{new}}=\begin{bmatrix}0.1\\1.2\end{bmatrix}}
$$

#### E2. Compute sigmoid outputs and derivatives, then plot the curve

Pen-and-paper values:

For $z=-1$,

$$
\sigma(-1)=\frac{1}{1+e^1}\approx\frac{1}{1+2.718}=0.269.
$$

$$
\sigma'(-1)=\sigma(-1)(1-\sigma(-1))\approx0.269(0.731)=0.197.
$$

For $z=0$,

$$
\sigma(0)=\frac{1}{1+1}=0.5,
\qquad
\sigma'(0)=0.5(1-0.5)=0.25.
$$

For $z=2$,

$$
\sigma(2)=\frac{1}{1+e^{-2}}\approx\frac{1}{1+0.135}=0.881,
$$

$$
\sigma'(2)=0.881(1-0.881)\approx0.105.
$$

```python
z_values = np.array([-1.0, 0.0, 2.0])  # Store the three requested scalar inputs.
s_values = sigmoid(z_values)  # Compute sigmoid values for the three inputs.
d_values = s_values * (1.0 - s_values)  # Compute sigmoid derivatives using sigma(z)(1-sigma(z)).
for z, s, d in zip(z_values, s_values, d_values):  # Iterate through each scalar result for a readable table.
    print(f"z={z:>4.1f}  sigma(z)={s:.3f}  sigma'(z)={d:.3f}")  # Print each value and derivative rounded to three decimals.
z_grid = np.linspace(-6.0, 6.0, 400)  # Create a dense grid so the sigmoid curve looks smooth.
s_grid = sigmoid(z_grid)  # Evaluate the sigmoid curve on the grid.
d_grid = s_grid * (1.0 - s_grid)  # Evaluate the derivative curve on the same grid.
plt.figure()  # Create a new figure for sigmoid and derivative curves.
plt.plot(z_grid, s_grid, label="sigmoid $\\sigma(z)$")  # Plot the S-shaped probability curve.
plt.plot(z_grid, d_grid, label="derivative $\\sigma(z)(1-\\sigma(z))$")  # Plot the bell-shaped derivative curve.
plt.scatter(z_values, s_values, color="black", zorder=3, label="requested z values")  # Mark the three hand-computed values.
plt.title("Sigmoid values and derivative")  # Title the plot.
plt.xlabel("z")  # Label the score axis.
plt.ylabel("value")  # Label the function-value axis.
plt.legend()  # Show curve labels.
plt.show()  # Display the plot.
```

▶ What you'll see: the sigmoid maps scores to probabilities, and its derivative is largest at $z=0$, where the model is most uncertain.

👀 Look for saturation: far from zero, the derivative is small, so gradient-based learning changes the score more slowly.

#### E3. Compare one SGD step with one full-batch step on two examples

Use two regression examples with $\phi_1=(1,0)$, $y_1=1$ and $\phi_2=(1,2)$, $y_2=5$. Start at $w=(0,0)$ and use $\eta=0.1$.

For squared loss $\tfrac12(w^\top\phi-y)^2$, the per-example gradient is

$$
\nabla_w\operatorname{Loss}_i=(w^\top\phi_i-y_i)\phi_i.
$$

At $w=(0,0)$,

$$
g_1=(0-1)\begin{bmatrix}1\\0\end{bmatrix}=\begin{bmatrix}-1\\0\end{bmatrix},
$$

and

$$
g_2=(0-5)\begin{bmatrix}1\\2\end{bmatrix}=\begin{bmatrix}-5\\-10\end{bmatrix}.
$$

A full-batch gradient averages them:

$$
g_{\text{batch}}=\frac12(g_1+g_2)=\frac12\begin{bmatrix}-6\\-10\end{bmatrix}=\begin{bmatrix}-3\\-5\end{bmatrix}.
$$

Full-batch update:

$$
w_{\text{batch}}=\begin{bmatrix}0\\0\end{bmatrix}-0.1\begin{bmatrix}-3\\-5\end{bmatrix}=\boxed{\begin{bmatrix}0.3\\0.5\end{bmatrix}}.
$$

One SGD update using only example 1 gives

$$
w_{\text{sgd},1}=\begin{bmatrix}0\\0\end{bmatrix}-0.1\begin{bmatrix}-1\\0\end{bmatrix}=\boxed{\begin{bmatrix}0.1\\0\end{bmatrix}}.
$$

```python
phis = np.array([[1.0, 0.0], [1.0, 2.0]])  # Store the two feature vectors from the derivation.
ys = np.array([1.0, 5.0])  # Store the two target values from the derivation.
w0 = np.array([0.0, 0.0])  # Initialize the shared starting weight vector.
eta = 0.1  # Set the learning rate used by both updates.
grads = ((phis @ w0) - ys)[:, None] * phis  # Compute both per-example gradients at the starting weights.
w_sgd = w0 - eta * grads[0]  # Apply one stochastic update using only the first example.
w_batch = w0 - eta * grads.mean(axis=0)  # Apply one full-batch update using the average gradient.
print("per-example gradients:\n", grads)  # Print the two gradients so the code matches the hand derivation.
print("one-example SGD w:", w_sgd)  # Print the stochastic update result.
print("full-batch w:", w_batch)  # Print the full-batch update result.
plt.figure()  # Create a weight-space arrow plot.
plt.scatter([w0[0]], [w0[1]], color="black", label="start")  # Mark the common starting point.
plt.arrow(w0[0], w0[1], w_sgd[0] - w0[0], w_sgd[1] - w0[1], head_width=0.03, length_includes_head=True, color="tab:orange")  # Draw the SGD arrow.
plt.arrow(w0[0], w0[1], w_batch[0] - w0[0], w_batch[1] - w0[1], head_width=0.03, length_includes_head=True, color="tab:blue")  # Draw the batch arrow.
plt.scatter([w_sgd[0]], [w_sgd[1]], color="tab:orange", label="SGD after one example")  # Mark the SGD endpoint.
plt.scatter([w_batch[0]], [w_batch[1]], color="tab:blue", label="batch after two examples")  # Mark the batch endpoint.
plt.title("One SGD step vs. one full-batch step")  # Title the comparison plot.
plt.xlabel("$w_0$ intercept")  # Label the intercept axis.
plt.ylabel("$w_1$ slope")  # Label the slope axis.
plt.legend()  # Show labels for start and endpoints.
plt.axis("equal")  # Use equal scaling so arrow directions are visually honest.
plt.show()  # Display the weight-space comparison.
```

▶ What you'll see: the full-batch arrow points in the average direction, while the SGD arrow reflects only one example and is therefore noisier.

👀 The stochastic step is not “wrong”; it is an unbiased sample of gradient information when examples are sampled uniformly.

#### E4. Train/validation/test split vocabulary

A split is not just bookkeeping. It protects the final evaluation from hyperparameter choices made during model development.

```python
n_items = 30  # Create a tiny index-only dataset of 30 examples for a split diagram.
indices = np.arange(n_items)  # Store example identifiers from 0 through 29.
train_end = int(0.6 * n_items)  # Reserve 60 percent of examples for training.
val_end = int(0.8 * n_items)  # Reserve the next 20 percent for validation.
train_ids = indices[:train_end]  # Select training indices used to fit parameters.
val_ids = indices[train_end:val_end]  # Select validation indices used to choose hyperparameters.
test_ids = indices[val_end:]  # Select test indices saved for final evaluation.
split_names = ["train", "validation", "test"]  # Name the three data partitions.
split_lengths = [len(train_ids), len(val_ids), len(test_ids)]  # Count examples in each partition.
colors = ["tab:red", "tab:green", "tab:blue"]  # Assign a distinct color to each partition.
plt.figure(figsize=(8, 1.8))  # Create a wide and short diagram for the split bar.
left = 0  # Initialize the left edge of the first stacked bar segment.
for name, length, color in zip(split_names, split_lengths, colors):  # Draw each split segment from left to right.
    plt.barh([0], [length], left=left, color=color, edgecolor="black", label=f"{name}: {length}")  # Add one segment to the bar.
    plt.text(left + length / 2, 0, name, ha="center", va="center", color="white", weight="bold")  # Label the segment center.
    left = left + length  # Move the left edge for the next segment.
plt.yticks([])  # Hide the unused vertical tick labels.
plt.xlabel("example index order")  # Label the horizontal axis.
plt.title("Train / validation / test split")  # Title the split diagram.
plt.legend(loc="upper center", bbox_to_anchor=(0.5, -0.35), ncol=3)  # Place a compact legend below the bar.
plt.show()  # Display the split visualization.
candidate_etas = np.array([0.001, 0.03, 0.3])  # List three hypothetical learning rates to compare.
validation_losses = np.array([0.61, 0.34, 0.49])  # Store validation losses from a pretend tuning run.
best_eta = candidate_etas[np.argmin(validation_losses)]  # Choose the learning rate with the lowest validation loss.
print("Choose eta from validation only:", best_eta)  # Print the selected hyperparameter.
print("Use the test set once after the choice is frozen.")  # Remind learners not to tune on the test set.
```

▶ What you'll see: parameters learn from training data, hyperparameters are selected on validation data, and the test set stays untouched until the end.

👀 If you repeatedly choose settings based on the test set, it silently becomes another validation set.

#### E5. Sweep the learning rate $\eta$ for logistic regression

```python
etas = [0.005, 0.15, 1.8]  # Compare too-small, useful, and too-large learning rates.
labels = ["too small", "good", "too large"]  # Give each learning-rate setting an interpretation label.
colors = ["tab:gray", "tab:green", "tab:red"]  # Use colors that match the interpretation of each curve.
results = []  # Store weights, loss curves, and accuracies for all learning rates.
for eta_value in etas:  # Train one model for each candidate learning rate.
    w_eta, losses_eta = run_logistic_sgd(X_cls_b, y_cls, eta=eta_value, epochs=50, batch_size=16, l2=0.001, seed=221)  # Run mini-batch SGD with fixed data and seed.
    probs_eta = sigmoid(X_cls_b @ w_eta)  # Compute final probabilities for the trained model.
    acc_eta = accuracy(y_cls, probs_eta)  # Compute final training accuracy for comparison.
    results.append((w_eta, losses_eta, acc_eta))  # Save this learning-rate result for plotting.
plt.figure()  # Create a loss-curve figure.
for label, color, (_, losses_eta, _) in zip(labels, colors, results):  # Plot every learning-rate curve on the same axes.
    plt.plot(losses_eta, color=color, label=label)  # Draw the epoch-by-epoch loss curve.
plt.title("Learning-rate sweep for logistic SGD")  # Title the loss comparison.
plt.xlabel("epoch")  # Label the epoch axis.
plt.ylabel("full-data logistic loss")  # Label the loss axis.
plt.legend()  # Show the learning-rate labels.
plt.show()  # Display the loss curves.
plt.figure()  # Create a final-accuracy bar chart.
plt.bar(labels, [acc for _, _, acc in results], color=colors, edgecolor="black")  # Plot final accuracies by learning-rate regime.
plt.ylim(0.0, 1.05)  # Use a probability-style vertical range.
plt.ylabel("accuracy")  # Label the accuracy axis.
plt.title("Final accuracy after the same number of epochs")  # Title the accuracy comparison.
plt.show()  # Display the accuracy bars.
```

▶ What you'll see: a too-small learning rate improves slowly, a good learning rate descends quickly, and an overly aggressive setting can oscillate or settle poorly.

👀 Learning rate is a hyperparameter: it is not learned by the basic SGD update; it controls the update.

### 🔴 Advanced

#### A1. Failure case: noisy SGD path vs. full-batch GD stability

We now implement linear regression optimization from scratch and compare the update paths. The objective is

$$
J(w)=\frac{1}{2n}\|Xw-y\|_2^2,
\qquad
\nabla J(w)=\frac{1}{n}X^\top(Xw-y).
$$

```python
def regression_loss_and_grad(X, y, w):  # Define squared-error loss and full-batch gradient for linear regression.
    residual = X @ w - y  # Compute prediction errors for all examples.
    loss = 0.5 * float(np.mean(residual ** 2))  # Compute the average half squared error.
    grad = (X.T @ residual) / X.shape[0]  # Compute the average gradient over the whole dataset.
    return loss, grad  # Return both loss and gradient for optimization loops.
def run_regression_optimizer(X, y, eta=0.05, steps=120, mode="sgd", seed=0):  # Run either stochastic or full-batch linear regression updates.
    local_rng = np.random.default_rng(seed)  # Create a reproducible RNG for stochastic example choices.
    w = np.array([3.0, 3.0])  # Start deliberately far from the true intercept and slope.
    path = [w.copy()]  # Store the weight path so the trajectory can be plotted.
    losses = []  # Store full-data losses after each update for a fair comparison.
    for step in range(steps):  # Perform a fixed number of parameter updates.
        if mode == "sgd":  # Use one randomly selected example for stochastic updates.
            i = local_rng.integers(0, X.shape[0])  # Sample one training example index.
            Xi = X[i:i + 1]  # Extract the sampled feature row as a mini matrix.
            yi = y[i:i + 1]  # Extract the sampled target as a length-one vector.
            _, grad = regression_loss_and_grad(Xi, yi, w)  # Compute the one-example gradient.
        else:  # Use all examples for full-batch updates.
            _, grad = regression_loss_and_grad(X, y, w)  # Compute the stable average gradient.
        w = w - eta * grad  # Apply the gradient descent update.
        loss, _ = regression_loss_and_grad(X, y, w)  # Measure full-data loss after the update.
        losses.append(loss)  # Save the measured loss.
        path.append(w.copy())  # Save the new position in weight space.
    return np.array(path), np.array(losses), w  # Return trajectory, losses, and final weights.
path_sgd, loss_sgd, w_sgd_final = run_regression_optimizer(X_reg, y_reg, eta=0.06, steps=140, mode="sgd", seed=2)  # Run noisy one-example SGD.
path_bgd, loss_bgd, w_bgd_final = run_regression_optimizer(X_reg, y_reg, eta=0.06, steps=140, mode="batch", seed=2)  # Run stable full-batch GD.
plt.figure()  # Create a weight-space trajectory figure.
plt.plot(path_sgd[:, 0], path_sgd[:, 1], color="tab:orange", alpha=0.75, label="SGD path")  # Plot the stochastic trajectory.
plt.plot(path_bgd[:, 0], path_bgd[:, 1], color="tab:blue", linewidth=2.5, label="batch GD path")  # Plot the full-batch trajectory.
plt.scatter([path_sgd[0, 0]], [path_sgd[0, 1]], color="black", label="start")  # Mark the shared starting point.
plt.scatter([w_sgd_final[0]], [w_sgd_final[1]], color="tab:orange", edgecolor="black", label="SGD final")  # Mark the SGD endpoint.
plt.scatter([w_bgd_final[0]], [w_bgd_final[1]], color="tab:blue", edgecolor="black", label="batch final")  # Mark the batch endpoint.
plt.xlabel("intercept")  # Label the intercept axis.
plt.ylabel("slope")  # Label the slope axis.
plt.title("Noisy SGD trajectory vs. smooth full-batch trajectory")  # Title the trajectory plot.
plt.legend()  # Show trajectory labels.
plt.show()  # Display the weight-space paths.
plt.figure()  # Create a loss-versus-update figure.
plt.plot(loss_sgd, color="tab:orange", alpha=0.75, label="SGD full-data loss")  # Plot the stochastic loss history.
plt.plot(loss_bgd, color="tab:blue", linewidth=2.5, label="batch GD full-data loss")  # Plot the batch loss history.
plt.yscale("log")  # Use a log scale to show early and late progress clearly.
plt.xlabel("update number")  # Label the update axis.
plt.ylabel("loss, log scale")  # Label the loss axis.
plt.title("Noisy descent can still reduce the objective")  # Title the loss comparison.
plt.legend()  # Show curve labels.
plt.show()  # Display the loss plot.
```

▶ What you'll see: SGD wiggles because each sampled example has its own gradient, while full-batch GD follows a smoother path.

👀 Noise is a cost and a feature: it makes individual updates unreliable, but it can move cheaply through large datasets.

#### A2. Mini-batch size tradeoff

Batch size changes gradient variance. We keep the same data and learning rate, then compare batch sizes $1$, $16$, and full batch.

```python
batch_sizes = [1, 16, X_cls_b.shape[0]]  # Compare pure SGD, mini-batch SGD, and full-batch GD.
batch_labels = ["batch=1", "batch=16", "full batch"]  # Name each batch-size regime.
batch_histories = []  # Store repeated loss histories for variance visualization.
for batch_size in batch_sizes:  # Train models for each batch size.
    repeated_losses = []  # Store loss curves from multiple random shuffles.
    for seed in range(5):  # Repeat each setting to reveal stochastic variability.
        _, losses_bs = run_logistic_sgd(X_cls_b, y_cls, eta=0.18, epochs=45, batch_size=batch_size, l2=0.001, seed=seed)  # Train with one batch size and seed.
        repeated_losses.append(losses_bs)  # Save this replicate's loss curve.
    batch_histories.append(np.vstack(repeated_losses))  # Stack replicates into a matrix for mean and spread.
plt.figure()  # Create a loss-band figure.
for label, history in zip(batch_labels, batch_histories):  # Plot mean and spread for every batch size.
    mean_loss = history.mean(axis=0)  # Compute the average loss curve across replicates.
    std_loss = history.std(axis=0)  # Compute the standard deviation across replicates.
    epochs = np.arange(history.shape[1])  # Create epoch indices for plotting.
    plt.plot(epochs, mean_loss, label=label)  # Plot the mean loss curve.
    plt.fill_between(epochs, mean_loss - std_loss, mean_loss + std_loss, alpha=0.18)  # Shade one standard deviation around the mean.
plt.title("Mini-batch size controls loss-curve variance")  # Title the variance comparison.
plt.xlabel("epoch")  # Label the epoch axis.
plt.ylabel("logistic loss")  # Label the loss axis.
plt.legend()  # Show batch-size labels.
plt.show()  # Display the loss-band plot.
updates_per_epoch = [int(np.ceil(X_cls_b.shape[0] / b)) for b in batch_sizes]  # Count parameter updates needed per epoch.
plt.figure()  # Create an update-count proxy figure.
plt.bar(batch_labels, updates_per_epoch, color=["tab:orange", "tab:green", "tab:blue"], edgecolor="black")  # Plot update counts by batch size.
plt.ylabel("updates per epoch")  # Label the vertical axis.
plt.title("Smaller batches take more, cheaper updates")  # Title the computational tradeoff plot.
plt.show()  # Display the update-count plot.
```

▶ What you'll see: small batches have noisier curves and more updates per epoch; full batches have smoother curves but each update uses all examples.

👀 In modern ML, mini-batches are popular because they balance gradient quality, hardware efficiency, and update frequency.

#### A3. Backpropagation through a tiny computation graph

Let

$$
out=(wx+b)^2.
$$

Define forward values:

$$
f_1=w,
\qquad
f_2=x,
\qquad
f_3=f_1f_2=wx,
\qquad
f_4=b,
\qquad
f_5=f_3+f_4=wx+b,
\qquad
f_6=f_5^2=out.
$$

Use $w=2$, $x=3$, $b=-1$. Forward pass:

$$
f_3=2\cdot3=6,
\qquad
f_5=6+(-1)=5,
\qquad
out=5^2=25.
$$

Backward sensitivities are $g_i=\partial out/\partial f_i$. Start from

$$
g_6=\frac{\partial out}{\partial f_6}=1.
$$

Because $f_6=f_5^2$,

$$
g_5=g_6\frac{\partial f_6}{\partial f_5}=1\cdot 2f_5=10.
$$

Because $f_5=f_3+f_4$,

$$
g_3=g_5\frac{\partial f_5}{\partial f_3}=10\cdot1=10,
\qquad
g_4=g_5\frac{\partial f_5}{\partial f_4}=10\cdot1=10.
$$

Because $f_3=f_1f_2$,

$$
g_1=g_3\frac{\partial f_3}{\partial f_1}=10\cdot x=30,
\qquad
g_2=g_3\frac{\partial f_3}{\partial f_2}=10\cdot w=20.
$$

Thus

$$
\boxed{\frac{\partial out}{\partial w}=30,
\qquad
\frac{\partial out}{\partial b}=10.}
$$

```python
w = 2.0  # Set the scalar weight from the hand derivation.
x = 3.0  # Set the scalar input from the hand derivation.
b = -1.0  # Set the scalar bias from the hand derivation.
f3 = w * x  # Compute the multiplication node wx.
f5 = f3 + b  # Compute the affine node wx+b.
out = f5 ** 2  # Compute the squared output node.
g_out = 1.0  # Initialize the output sensitivity d(out)/d(out).
g_f5 = g_out * 2.0 * f5  # Backpropagate through the square node.
g_f3 = g_f5 * 1.0  # Backpropagate through addition to the wx branch.
g_b = g_f5 * 1.0  # Backpropagate through addition to the bias branch.
g_w = g_f3 * x  # Backpropagate through multiplication to w.
g_x = g_f3 * w  # Backpropagate through multiplication to x.
eps = 1e-5  # Choose a tiny finite-difference step for numerical checking.
out_plus_w = (((w + eps) * x + b) ** 2)  # Compute output after nudging w upward.
out_minus_w = (((w - eps) * x + b) ** 2)  # Compute output after nudging w downward.
fd_w = (out_plus_w - out_minus_w) / (2.0 * eps)  # Estimate d(out)/dw by central difference.
out_plus_b = ((w * x + (b + eps)) ** 2)  # Compute output after nudging b upward.
out_minus_b = ((w * x + (b - eps)) ** 2)  # Compute output after nudging b downward.
fd_b = (out_plus_b - out_minus_b) / (2.0 * eps)  # Estimate d(out)/db by central difference.
print("forward out:", out)  # Print the forward output value.
print("backprop gradients dw, db:", g_w, g_b)  # Print analytic backprop gradients.
print("finite-difference gradients dw, db:", fd_w, fd_b)  # Print numerical gradient checks.
plt.figure()  # Create a small annotated graph-like bar chart.
plt.bar(["out", "dout/dw", "dout/db", "FD dw", "FD db"], [out, g_w, g_b, fd_w, fd_b], color=["tab:blue", "tab:orange", "tab:orange", "tab:green", "tab:green"], edgecolor="black")  # Compare forward value, analytic gradients, and checks.
plt.title("Backpropagation values checked by finite differences")  # Title the gradient-check plot.
plt.ylabel("value")  # Label the vertical axis.
plt.show()  # Display the gradient comparison.
```

▶ What you'll see: analytic backpropagation gradients match finite-difference estimates, confirming the chain-rule table.

👀 Backprop is not magic; it is organized bookkeeping of local derivatives and upstream sensitivities.

#### A4. Regularization and approximation/estimation error

Polynomial degree controls approximation power; ridge penalty $\lambda\|w\|_2^2$ controls estimation variance. We fit noisy sine data with degrees and penalties.

```python
degrees = [1, 3, 9]  # Compare underfit, reasonable, and high-variance polynomial classes.
lambdas = [0.0, 0.01, 1.0]  # Compare no regularization, light regularization, and strong regularization.
x_plot = np.linspace(-3.0, 3.0, 300)  # Create a dense input grid for fitted curves.
fig, axes = plt.subplots(len(degrees), len(lambdas), figsize=(12, 9), sharex=True, sharey=True)  # Create a grid of model fits.
summary_rows = []  # Store train and validation errors for a compact printed summary.
for row, degree in enumerate(degrees):  # Loop over polynomial hypothesis-class complexity.
    Phi_train = polynomial_features(x_sine[train_idx], degree)  # Build training polynomial features.
    Phi_val = polynomial_features(x_sine[val_idx], degree)  # Build validation polynomial features.
    Phi_plot = polynomial_features(x_plot, degree)  # Build plotting-grid polynomial features.
    for col, lam in enumerate(lambdas):  # Loop over ridge regularization strengths.
        penalty = lam * np.eye(Phi_train.shape[1])  # Create a ridge penalty matrix.
        penalty[0, 0] = 0.0  # Exclude the intercept from regularization.
        coef = np.linalg.solve(Phi_train.T @ Phi_train + penalty, Phi_train.T @ y_sine[train_idx])  # Solve the ridge normal equations.
        train_pred = Phi_train @ coef  # Predict on the training split.
        val_pred = Phi_val @ coef  # Predict on the validation split.
        plot_pred = Phi_plot @ coef  # Predict on the dense plotting grid.
        train_mse = mean_squared_error(y_sine[train_idx], train_pred)  # Compute training mean squared error.
        val_mse = mean_squared_error(y_sine[val_idx], val_pred)  # Compute validation mean squared error.
        summary_rows.append((degree, lam, train_mse, val_mse))  # Save this setting's metrics.
        ax = axes[row, col]  # Select the subplot for this degree and lambda.
        ax.scatter(x_sine[train_idx], y_sine[train_idx], s=14, alpha=0.65, label="train")  # Plot training data.
        ax.scatter(x_sine[val_idx], y_sine[val_idx], s=14, alpha=0.65, label="val")  # Plot validation data.
        ax.plot(x_plot, plot_pred, color="black", linewidth=2)  # Plot the fitted polynomial curve.
        ax.set_title(f"degree={degree}, lambda={lam}")  # Label the subplot with hyperparameters.
        ax.set_ylim(-2.0, 2.0)  # Keep all panels on the same vertical scale.
axes[0, 0].legend(loc="lower left")  # Add one legend for the data split markers.
fig.suptitle("Approximation, estimation, and ridge regularization", y=1.02)  # Add a figure-level title.
plt.tight_layout()  # Adjust subplot spacing.
plt.show()  # Display the grid of polynomial fits.
for degree, lam, train_mse, val_mse in summary_rows:  # Print every model-selection row.
    print(f"degree={degree:>2}, lambda={lam:>4}: train MSE={train_mse:.3f}, val MSE={val_mse:.3f}")  # Show train and validation errors.
```

▶ What you'll see: degree 1 underfits, high degree without regularization can wiggle, and ridge regularization can reduce validation error.

👀 Approximation error asks whether the class can represent the target; estimation error asks whether finite data selected a good member of that class.

#### A5. Fine-tuning / transfer learning strategy on toy data

We simulate a pretrained two-layer network. First it learns a source task. Then we transfer to a related target task under three policies: frozen base, partial unfreeze, and full fine-tune.

```python
def init_tiny_network(seed=0):  # Initialize a tiny neural network with one hidden layer.
    local_rng = np.random.default_rng(seed)  # Create a reproducible RNG for parameter initialization.
    params = {}  # Store parameters in a dictionary for clarity.
    params["W1"] = local_rng.normal(0.0, 0.8, size=(2, 5))  # Initialize base-layer weights from input to hidden units.
    params["b1"] = np.zeros(5)  # Initialize base-layer biases to zero.
    params["W2"] = local_rng.normal(0.0, 0.8, size=(5, 1))  # Initialize head weights from hidden units to one logit.
    params["b2"] = np.zeros(1)  # Initialize the head bias to zero.
    return params  # Return the parameter dictionary.
def forward_tiny(X, params):  # Run a forward pass through the tiny network.
    Z1 = X @ params["W1"] + params["b1"]  # Compute hidden pre-activations.
    H = np.tanh(Z1)  # Apply tanh to create nonlinear hidden features.
    logits = H @ params["W2"] + params["b2"]  # Compute the output logit.
    p = sigmoid(logits.ravel())  # Convert logits into positive-class probabilities.
    return Z1, H, p  # Return intermediate values needed for backpropagation.
def tiny_loss_and_grads(X, y, params):  # Compute binary loss and gradients for the tiny network.
    Z1, H, p = forward_tiny(X, params)  # Run the forward pass and keep hidden activations.
    loss = binary_cross_entropy(y, p)  # Compute the mean binary cross-entropy loss.
    dlogit = (p - y).reshape(-1, 1) / X.shape[0]  # Compute the averaged derivative of loss with respect to logits.
    grads = {}  # Store gradients in a dictionary parallel to params.
    grads["W2"] = H.T @ dlogit  # Backpropagate into head weights.
    grads["b2"] = dlogit.sum(axis=0)  # Backpropagate into the head bias.
    dH = dlogit @ params["W2"].T  # Move sensitivity from logits into hidden activations.
    dZ1 = dH * (1.0 - np.tanh(Z1) ** 2)  # Backpropagate through tanh using 1-tanh^2.
    grads["W1"] = X.T @ dZ1  # Backpropagate into base-layer weights.
    grads["b1"] = dZ1.sum(axis=0)  # Backpropagate into base-layer biases.
    return loss, grads, p  # Return loss, gradients, and probabilities.
def train_tiny(X, y, params, trainable, eta=0.2, epochs=120):  # Train selected parameters of the tiny network.
    params = {key: value.copy() for key, value in params.items()}  # Copy parameters so each strategy starts fairly.
    losses = []  # Store training loss after each epoch.
    accs = []  # Store training accuracy after each epoch.
    for epoch in range(epochs):  # Perform repeated full-batch gradient steps for simplicity.
        loss, grads, p = tiny_loss_and_grads(X, y, params)  # Compute current loss and gradients.
        for key in params:  # Visit every parameter tensor.
            if key in trainable:  # Update only parameters selected by the fine-tuning strategy.
                params[key] = params[key] - eta * grads[key]  # Apply the gradient update to trainable parameters.
        new_loss, _, new_p = tiny_loss_and_grads(X, y, params)  # Recompute metrics after the update.
        losses.append(new_loss)  # Save the post-update loss.
        accs.append(accuracy(y, new_p))  # Save the post-update accuracy.
    return params, np.array(losses), np.array(accs)  # Return trained parameters and learning curves.
source_params = init_tiny_network(seed=7)  # Initialize the model before source pretraining.
source_params, source_losses, source_accs = train_tiny(X_transfer, source_labels, source_params, trainable={"W1", "b1", "W2", "b2"}, eta=0.25, epochs=180)  # Pretrain all parameters on the source task.
strategies = {"frozen head only": {"W2", "b2"}, "partial unfreeze": {"b1", "W2", "b2"}, "full fine-tune": {"W1", "b1", "W2", "b2"}}  # Define which parameters each strategy updates.
ft_results = {}  # Store fine-tuning curves by strategy name.
for name, trainable in strategies.items():  # Run every transfer-learning strategy.
    _, losses_ft, accs_ft = train_tiny(X_transfer, target_labels, source_params, trainable=trainable, eta=0.18, epochs=120)  # Fine-tune on the target task.
    ft_results[name] = (losses_ft, accs_ft, len(trainable))  # Save target-task curves and parameter-group count.
plt.figure()  # Create a fine-tuning accuracy figure.
for name, (_, accs_ft, _) in ft_results.items():  # Plot the accuracy curve for each strategy.
    plt.plot(accs_ft, label=name)  # Draw target-task accuracy over epochs.
plt.title("Fine-tuning strategies on a related target task")  # Title the fine-tuning plot.
plt.xlabel("fine-tuning epoch")  # Label the epoch axis.
plt.ylabel("target accuracy")  # Label the target-task accuracy axis.
plt.legend()  # Show strategy labels.
plt.show()  # Display fine-tuning accuracy curves.
plt.figure()  # Create a trainable-parameter-group bar chart.
plt.bar(list(ft_results.keys()), [groups for _, _, groups in ft_results.values()], color=["tab:gray", "tab:orange", "tab:blue"], edgecolor="black")  # Plot how many parameter groups each strategy updates.
plt.ylabel("trainable parameter groups")  # Label the vertical axis.
plt.title("Freeze choices control what SGD may change")  # Title the trainability chart.
plt.xticks(rotation=15, ha="right")  # Rotate labels so long strategy names fit.
plt.show()  # Display the trainable-group comparison.
```

▶ What you'll see: head-only training adapts fastest with few parameters, while full fine-tuning can adapt more flexibly when the target boundary differs from the source boundary.

👀 Freezing is a modeling choice and an optimization choice: it reduces trainable parameters, but it also restricts the reachable hypothesis class.

### Interactive Experiment

Use the sliders to change batch size and learning rate. The plot retrains logistic regression and shows the resulting loss curve.

```python
def interactive_training(batch_size=16, learning_rate=0.15):  # Define the callback that redraws training behavior for slider values.
    chosen_batch = int(batch_size)  # Convert the widget value to an integer batch size.
    chosen_eta = float(learning_rate)  # Convert the widget value to a floating-point learning rate.
    w_live, losses_live = run_logistic_sgd(X_cls_b, y_cls, eta=chosen_eta, epochs=45, batch_size=chosen_batch, l2=0.001, seed=9)  # Train with the selected settings.
    probs_live = sigmoid(X_cls_b @ w_live)  # Compute final predicted probabilities.
    acc_live = accuracy(y_cls, probs_live)  # Compute final accuracy for the selected settings.
    plt.figure(figsize=(7, 4))  # Create a fresh loss-curve figure.
    plt.plot(losses_live, color="tab:purple")  # Plot the selected run's loss curve.
    plt.title(f"batch size={chosen_batch}, learning rate={chosen_eta:.3f}, accuracy={acc_live:.3f}")  # Put settings and accuracy in the title.
    plt.xlabel("epoch")  # Label the epoch axis.
    plt.ylabel("logistic loss")  # Label the loss axis.
    plt.show()  # Display the updated plot.
if HAS_WIDGETS:  # Use real sliders when ipywidgets is available.
    widgets.interact(interactive_training, batch_size=widgets.IntSlider(value=16, min=1, max=160, step=1), learning_rate=widgets.FloatLogSlider(value=0.15, base=10, min=-3, max=1, step=0.05))  # Launch the interactive experiment.
else:  # Use a deterministic fallback when running as a plain Python script.
    interactive_training(batch_size=16, learning_rate=0.15)  # Run one representative setting without widgets.
```

▶ What you'll see: small batches make the curve more jagged, large learning rates move faster but can destabilize training, and moderate settings usually give the best tradeoff.

👀 Try batch size $1$ with a high learning rate, then full batch with a small learning rate. The former is noisy; the latter is stable but may be slow.
