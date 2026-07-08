# Deep Learning: Data Processing & Training
> **Source:** CS 230 · **Category:** Tips/Method · **Type:** 💻 Colab · [↑ Full reference](../../ai-ml-cheatsheets.md)
> 📓 Runnable notebook section; an .ipynb will be generated.

## 0. Step-by-Step Worked Example — Start Here (Beginner Friendly)

> 🧑‍🎓 **New to this topic? Start here.** This is a gentle, fully runnable walkthrough that
> builds up *every* idea in this lesson one tiny step at a time. Each step **prints** the
> numbers it computes and **draws a picture** so you can *see* what is happening. Run the
> cells in order from top to bottom. Nothing here needs the internet or any downloaded data.

### The Big Picture — What You'll Learn

In plain terms, here is what the steps below will show you:

- **Normalization** makes feature scales and gradients more balanced, and **batch norm** stabilizes one mini-batch of activations.
- **Augmentation** creates extra safe views of one example while keeping its label unchanged.
- **Mini-batch gradient descent** connects forward propagation, binary cross-entropy, backpropagated gradients, and parameter updates.

Everything below (starting at **§1 Overview**) develops these same ideas with full derivations,
more examples, and a larger hands-on notebook section.

**What we will build, step by step:**
1. **Normalize inputs before asking gradients to behave** — standardize features and inspect batch norm.
2. **Augment data without changing labels** — create safe transformed views of one tiny image.
3. **Mini-batch gradient descent** — run forward propagation, binary cross-entropy, backpropagation, and updates.

### Step 0 — Set up our tools

We import NumPy (arrays + gradients) and Matplotlib (pictures). We fix a random **seed** so the
same mini-batches and augmentations appear every run. We also define a tiny `log()` helper so
every step prints clearly labeled numbers.

```python
import numpy as np                       # NumPy: arrays, synthetic data, probabilities, and gradients.
import matplotlib.pyplot as plt          # Matplotlib: draw preprocessing, augmentation, and training diagnostics.

np.random.seed(0)                         # Fix the seed so every run prints the SAME numbers.
plt.rcParams["figure.figsize"] = (7, 4)   # A comfortable default plot size.

def log(label, value):                    # A tiny logger so each printed line explains itself.
    print(f"[{label}] {value}")           # Format is: [what this is] the value.

log("setup", "tools ready — NumPy + Matplotlib imported, seed fixed to 0")  # Confirm setup ran.
```
▶ What you'll see: one line confirming the tools are ready.

### Step 1 — Normalize inputs before asking gradients to behave

When one feature is measured in huge units, dot products and gradients can be dominated by that
feature. Standardization puts columns on comparable scales; batch normalization applies the same
centering-and-scaling idea inside a network, then learns a scale and shift.

```python
X_raw_demo = np.array([[-2.0, -100.0], [-1.0, -100.0], [1.0, -100.0], [2.0, -100.0], [-2.0, 100.0], [-1.0, 100.0], [1.0, 100.0], [2.0, 100.0]])  # Two features with very different units.
y_raw_demo = np.array([-0.5, 0.0, 1.0, 1.5, -1.5, -1.0, 0.0, 0.5])  # Tiny regression targets for a gradient check.
mean_demo = X_raw_demo.mean(axis=0, keepdims=True)  # Compute one training-set mean per feature.
std_demo = X_raw_demo.std(axis=0, keepdims=True)  # Compute one training-set standard deviation per feature.
X_norm_demo = (X_raw_demo - mean_demo) / std_demo  # Standardize features with (x - mean) / std.
w_start_demo = np.zeros(2)  # Start a linear model at zero weights.
error_raw_demo = X_raw_demo @ w_start_demo - y_raw_demo  # Residuals before any update on raw inputs.
grad_raw_demo = 2.0 * X_raw_demo.T @ error_raw_demo / len(y_raw_demo)  # Raw-feature MSE gradient.
error_norm_demo = X_norm_demo @ w_start_demo - y_raw_demo  # Residuals before any update on normalized inputs.
grad_norm_demo = 2.0 * X_norm_demo.T @ error_norm_demo / len(y_raw_demo)  # Normalized-feature MSE gradient.
z_batch_demo = np.array([8.0, 10.0, 9.0, 12.0, 11.0, 7.0])  # One mini-batch of hidden pre-activations.
mu_batch_demo = z_batch_demo.mean()  # Batch-norm mean for this mini-batch.
var_batch_demo = z_batch_demo.var()  # Batch-norm variance for this mini-batch.
z_hat_demo = (z_batch_demo - mu_batch_demo) / np.sqrt(var_batch_demo + 1e-5)  # Normalize activations to near mean 0 and std 1.
gamma_demo = 1.3  # Learned batch-norm scale parameter for the demo.
beta_demo = -0.4  # Learned batch-norm shift parameter for the demo.
z_bn_demo = gamma_demo * z_hat_demo + beta_demo  # Apply learned scale and shift after normalization.
log("raw feature means", np.round(mean_demo.ravel(), 3))  # Print raw means.
log("raw feature stds", np.round(std_demo.ravel(), 3))  # Print raw spreads.
log("normalized means", np.round(X_norm_demo.mean(axis=0), 3))  # Verify centering.
log("normalized stds", np.round(X_norm_demo.std(axis=0), 3))  # Verify scaling.
log("raw gradient", np.round(grad_raw_demo, 3))  # Show the scale-dominated gradient.
log("normalized gradient", np.round(grad_norm_demo, 3))  # Show the balanced gradient.
log("batch norm mean/var", (round(float(mu_batch_demo), 3), round(float(var_batch_demo), 3)))  # Print batch statistics.
log("batch norm output mean/std", (round(float(z_bn_demo.mean()), 3), round(float(z_bn_demo.std()), 3)))  # Print transformed activation scale.

fig_demo, axes_demo = plt.subplots(1, 3, figsize=(12, 3.6))  # Create three beginner-friendly visuals.
axes_demo[0].scatter(X_raw_demo[:, 0], X_raw_demo[:, 1], c=y_raw_demo, cmap="viridis", s=80, edgecolor="black")  # Plot stretched raw feature geometry.
axes_demo[0].set_title("raw feature scale")  # Title the raw scatter.
axes_demo[0].set_xlabel("feature 1")  # Label the small-unit feature.
axes_demo[0].set_ylabel("feature 2")  # Label the large-unit feature.
axes_demo[1].scatter(X_norm_demo[:, 0], X_norm_demo[:, 1], c=y_raw_demo, cmap="viridis", s=80, edgecolor="black")  # Plot balanced normalized geometry.
axes_demo[1].set_title("standardized scale")  # Title the normalized scatter.
axes_demo[1].set_xlabel("normalized feature 1")  # Label normalized feature 1.
axes_demo[1].set_ylabel("normalized feature 2")  # Label normalized feature 2.
axes_demo[2].bar(np.arange(len(z_batch_demo)) - 0.2, z_batch_demo, width=0.2, label="raw z")  # Plot raw activations.
axes_demo[2].bar(np.arange(len(z_hat_demo)), z_hat_demo, width=0.2, label="z hat")  # Plot normalized activations.
axes_demo[2].bar(np.arange(len(z_bn_demo)) + 0.2, z_bn_demo, width=0.2, label="gamma zhat + beta")  # Plot scaled-shifted activations.
axes_demo[2].set_title("batch norm on one mini-batch")  # Title the batch-norm bars.
axes_demo[2].legend(fontsize=8)  # Identify the three activation versions.
plt.tight_layout()  # Keep subplot labels readable.
plt.show()  # Render all normalization visuals.
```
▶ What you'll see: raw features are stretched and give an unbalanced gradient, while normalized features and batch-normalized activations sit on controlled scales.

### Step 2 — Augment data without changing labels

Data augmentation makes extra training views from one example while preserving the correct label.
The important rule is semantic safety: a small shift, mirror, or mild noise helps only when the
label truly should stay the same.

```python
image_demo = np.zeros((7, 7), dtype=float)  # Start one tiny grayscale image with a dark background.
image_demo[1:6, 3] = 1.0  # Draw a bright vertical stroke.
image_demo[2, 2:5] = 0.8  # Add a short crossbar so transformations are visible.
label_demo = "vertical mark"  # Use a label that survives small shifts and horizontal flips.
flip_demo = image_demo[:, ::-1]  # Mirror the image left-to-right.
shift_demo = np.roll(image_demo, shift=1, axis=1)  # Shift the object one pixel to the right.
noise_demo = np.clip(image_demo + np.random.normal(0.0, 0.08, image_demo.shape), 0.0, 1.0)  # Add mild sensor-like noise.
variants_demo = [image_demo, flip_demo, shift_demo, noise_demo]  # Collect original and augmented views.
titles_demo = ["original", "horizontal flip", "shift right", "mild noise"]  # Name each view.
log("label reused for every view", label_demo)  # Print the unchanged label.
log("pixel sums", np.round([variant_demo.sum() for variant_demo in variants_demo], 3))  # Print a simple brightness diagnostic.
log("number of training views", len(variants_demo))  # Show the effective dataset expansion.

fig_demo, axes_demo = plt.subplots(1, len(variants_demo), figsize=(10, 2.8))  # Create one panel per image view.
for ax_demo, variant_demo, title_demo in zip(axes_demo, variants_demo, titles_demo):  # Draw every augmented view.
    ax_demo.imshow(variant_demo, cmap="gray", vmin=0.0, vmax=1.0)  # Show pixel intensities on a fixed scale.
    ax_demo.set_title(title_demo)  # Label the transformation.
    ax_demo.axis("off")  # Hide pixel ticks so the pattern is the focus.
fig_demo.suptitle("Label-preserving augmentation: same target, different view", y=1.05)  # Title the montage.
plt.tight_layout()  # Prevent titles from overlapping.
plt.show()  # Render the augmentation grid.
```
▶ What you'll see: the same tiny image appears in several safe variations, and every variation keeps the label `vertical mark`.

### Step 3 — Mini-batch gradient descent: forward, loss, backward, update

A training loop repeatedly shuffles data, takes a mini-batch, computes predictions, evaluates a
loss, backpropagates gradients, and updates parameters. We use logistic regression so every step
of binary cross-entropy and gradient descent is visible in a few lines.

```python
X_train_demo = np.array([[-2.0, -1.0], [-1.5, -0.5], [-1.0, -1.3], [-0.4, -0.8], [0.4, 0.8], [1.0, 1.2], [1.5, 0.6], [2.0, 1.0]])  # Tiny two-class feature matrix.
y_train_demo = np.array([0, 0, 0, 0, 1, 1, 1, 1], dtype=float)  # Binary labels for the points.
w_demo = np.zeros(2)  # Initialize two logistic-regression weights.
b_demo = 0.0  # Initialize the bias.
lr_demo = 0.45  # Choose a learning rate for visible progress.
batch_size_demo = 4  # Use four examples per mini-batch.
loss_history_demo = []  # Store full-data loss after each epoch.
for epoch_demo in range(24):  # Run a short CPU-friendly training loop.
    order_demo = np.random.permutation(len(y_train_demo))  # Shuffle examples at the start of each epoch.
    for start_demo in range(0, len(y_train_demo), batch_size_demo):  # Step through mini-batches.
        batch_indices_demo = order_demo[start_demo:start_demo + batch_size_demo]  # Select one mini-batch.
        xb_demo = X_train_demo[batch_indices_demo]  # Gather mini-batch features.
        yb_demo = y_train_demo[batch_indices_demo]  # Gather mini-batch labels.
        logits_demo = xb_demo @ w_demo + b_demo  # Forward pass: linear scores.
        probs_demo = 1.0 / (1.0 + np.exp(-np.clip(logits_demo, -30.0, 30.0)))  # Forward pass: sigmoid probabilities.
        loss_demo = -np.mean(yb_demo * np.log(probs_demo + 1e-8) + (1.0 - yb_demo) * np.log(1.0 - probs_demo + 1e-8))  # Binary cross-entropy.
        error_demo = probs_demo - yb_demo  # Backprop shortcut: dL/dlogit for sigmoid plus BCE.
        grad_w_demo = xb_demo.T @ error_demo / len(xb_demo)  # Average mini-batch weight gradient.
        grad_b_demo = float(error_demo.mean())  # Average mini-batch bias gradient.
        if epoch_demo == 0 and start_demo == 0:  # Print the first update in detail.
            log("first batch indices", batch_indices_demo)  # Show which examples formed the first mini-batch.
            log("first batch probabilities", np.round(probs_demo, 3))  # Show initial predictions.
            log("first batch BCE loss", round(float(loss_demo), 3))  # Show initial mini-batch loss.
            log("first batch grad_w", np.round(grad_w_demo, 3))  # Show the weight gradient.
            log("first batch grad_b", round(grad_b_demo, 3))  # Show the bias gradient.
        w_demo = w_demo - lr_demo * grad_w_demo  # Gradient descent weight update.
        b_demo = b_demo - lr_demo * grad_b_demo  # Gradient descent bias update.
    full_logits_demo = X_train_demo @ w_demo + b_demo  # Score all examples after the epoch.
    full_probs_demo = 1.0 / (1.0 + np.exp(-np.clip(full_logits_demo, -30.0, 30.0)))  # Convert scores to probabilities.
    full_loss_demo = -np.mean(y_train_demo * np.log(full_probs_demo + 1e-8) + (1.0 - y_train_demo) * np.log(1.0 - full_probs_demo + 1e-8))  # Full-data BCE.
    loss_history_demo.append(float(full_loss_demo))  # Save the epoch loss.
log("final weights", np.round(w_demo, 3))  # Print learned weights.
log("final bias", round(float(b_demo), 3))  # Print learned bias.
log("first/last full loss", (round(loss_history_demo[0], 3), round(loss_history_demo[-1], 3)))  # Show loss decreased.

fig_demo, axes_demo = plt.subplots(1, 2, figsize=(11, 4))  # Create loss and decision-boundary panels.
axes_demo[0].plot(loss_history_demo, marker="o", color="seagreen")  # Plot loss after each epoch.
axes_demo[0].set_xlabel("epoch")  # Label training epochs.
axes_demo[0].set_ylabel("binary cross-entropy")  # Label the optimized loss.
axes_demo[0].set_title("Mini-batch training lowers BCE")  # Title the loss curve.
x_grid_demo = np.linspace(-2.5, 2.5, 100)  # Create x-values for the learned boundary.
y_boundary_demo = -(w_demo[0] * x_grid_demo + b_demo) / (w_demo[1] + 1e-8)  # Solve w1*x + w2*y + b = 0.
axes_demo[1].scatter(X_train_demo[:, 0], X_train_demo[:, 1], c=y_train_demo, cmap="coolwarm", s=80, edgecolor="black")  # Plot labeled points.
axes_demo[1].plot(x_grid_demo, y_boundary_demo, color="black", label="p=0.5 boundary")  # Draw the learned decision line.
axes_demo[1].set_xlabel("feature 1")  # Label feature axis 1.
axes_demo[1].set_ylabel("feature 2")  # Label feature axis 2.
axes_demo[1].set_title("Learned classifier after mini-batches")  # Title the model view.
axes_demo[1].legend()  # Show the boundary label.
plt.tight_layout()  # Keep panels readable.
plt.show()  # Render training diagnostics.
```
▶ What you'll see: the first mini-batch prints probabilities, loss, and gradients; then the loss curve falls and the learned boundary separates the toy classes.

---

## 1. Overview

Deep-learning performance is often decided before the model architecture becomes interesting: raw inputs must be normalized, examples must be batched, labels must match the loss, and the training loop must update weights with stable gradients. The same one-layer network can learn quickly or fail badly depending on preprocessing, augmentation, batch size, and learning rate.

**One-line intuition:** a neural network learns by repeating a disciplined recipe — prepare data, take a mini-batch, run forward propagation, compute loss, backpropagate gradients, update weights, and diagnose what changed.

## 2. Key Idea

### Normalize inputs before asking gradients to behave

For a feature vector or activation batch $x_1,\ldots,x_m$, standard normalization uses the batch mean and standard deviation:

$$
\tilde{x}_i=\frac{x_i-\mu}{\sqrt{\sigma^2+\epsilon}}
$$

This centers features near zero and puts them on comparable scales, so one large-magnitude feature does not dominate dot products and gradients. In deep networks, the same idea appears inside **batch normalization**, with learned scale and shift parameters:

$$
x_i \leftarrow \gamma\frac{x_i-\mu_B}{\sqrt{\sigma_B^2+\epsilon}}+\beta
$$

Batch norm is usually placed after a linear or convolutional layer and before a nonlinearity. It often allows higher learning rates and reduces sensitivity to initialization.

### Augment data without changing labels

Data augmentation creates new training examples from existing ones while preserving the target label. For image-like data, useful transformations include horizontal flips, small rotations, crops, brightness or color shifts, noise addition, masking information loss, and contrast changes. The critical rule is label preservation: an augmentation that changes the semantic class is harmful even if it increases dataset size.

| Augmentation | Why it can help | When it can hurt |
|---|---|---|
| Flip | Learns mirror invariance | Direction-sensitive labels |
| Rotation | Handles camera tilt | Digits or symbols whose meaning changes |
| Crop | Focuses on local evidence | Removes the object |
| Color/brightness shift | Handles exposure variation | Color defines the class |
| Noise | Handles sensor noise | Destroys weak signal |
| Masking | Robustness to missing pixels | Masks the only discriminative region |
| Contrast | Handles lighting changes | Saturates important detail |

### Mini-batch gradient descent

An **epoch** is one full pass through the training set. A **mini-batch** is a smaller subset used for one update. Full-batch training can be slow; one-example SGD can be noisy; mini-batches balance stable gradients and frequent updates.

For binary prediction $z\in(0,1)$ and label $y\in\{0,1\}$, binary cross-entropy is

$$
L(z,y)=-\left[y\log z+(1-y)\log(1-z)\right].
$$

For a model parameter $w$, backpropagation applies the chain rule, for example

$$
\frac{\partial L}{\partial x}=\frac{\partial L}{\partial f(x)}\frac{\partial f(x)}{\partial x},
$$

and gradient descent updates

$$
w\leftarrow w-\alpha\frac{\partial L}{\partial w}.
$$

A practical training-loop pseudocode is:

```text
Initialize weights and preprocessing parameters.
For each epoch:
  Shuffle the training indices.
  For each mini-batch:
    Augment only the training batch when appropriate.
    Normalize inputs using training statistics or batch statistics.
    Forward propagate to compute predictions.
    Compute cross-entropy loss.
    Backpropagate gradients through each operation.
    Update parameters with the learning rate.
  Evaluate diagnostics on train and validation data.
Return learned weights, curves, and failure-case diagnostics.
```

## 3. Hands-on Notebook

### Setup

Run this first. The notebook uses only CPU-friendly synthetic data, NumPy, Matplotlib, and an optional ipywidgets slider section.

```python
import numpy as np  # import NumPy once for arrays, random numbers, vectorized math, and from-scratch gradients.
import matplotlib.pyplot as plt  # import Matplotlib once for all diagnostic plots and visual explanations.
try:  # try optional widgets so the final experiment is interactive in Colab.
    from ipywidgets import interact, IntSlider, FloatSlider  # import sliders and the interact decorator for live loss curves.
except ModuleNotFoundError:  # keep the notebook runnable in plain Python if ipywidgets is unavailable.
    class IntSlider:  # define a tiny integer-slider fallback that stores a default value.
        def __init__(self, value=1, min=1, max=10, step=1, description=""):  # accept the same keyword style used by ipywidgets.
            self.value = value  # store the default value so the fallback can call the function once.
    class FloatSlider:  # define a tiny float-slider fallback that stores a default value.
        def __init__(self, value=0.1, min=0.0, max=1.0, step=0.01, description="", readout_format=".3f"):  # accept the same keyword style used by ipywidgets.
            self.value = value  # store the default value so the fallback can call the function once.
    def interact(function, **controls):  # define a simple fallback that executes the experiment once.
        values = {name: control.value for name, control in controls.items()}  # collect each default slider value by name.
        return function(**values)  # run the supplied function once with default controls.
np.random.seed(230)  # seed legacy NumPy calls so every learner sees the same notebook outputs.
RNG = np.random.default_rng(230)  # create a modern generator for reproducible synthetic datasets and augmentations.
EPS = 1e-8  # define one small constant to avoid division by zero and log of zero.
plt.style.use("seaborn-v0_8-whitegrid")  # choose a clean plotting style for loss curves and image grids.
def sigmoid(z):  # define the logistic nonlinearity used by every binary classifier below.
    return 1.0 / (1.0 + np.exp(-np.clip(z, -40.0, 40.0)))  # clip logits so exponentials stay numerically stable.
def bce_loss(y_prob, y_true):  # define mean binary cross-entropy for probabilities and labels.
    p = np.clip(y_prob, EPS, 1.0 - EPS)  # clip probabilities so logarithms never receive exactly zero.
    return float(-np.mean(y_true * np.log(p) + (1.0 - y_true) * np.log(1.0 - p)))  # average the per-example cross-entropy.
def accuracy(y_prob, y_true):  # define binary accuracy from predicted probabilities.
    return float(np.mean((y_prob >= 0.5).astype(int) == y_true.astype(int)))  # threshold at one half and compare to integer labels.
def standardize_fit(X):  # fit feature normalization statistics on a training matrix.
    mean = X.mean(axis=0, keepdims=True)  # compute one mean per feature so every column is centered independently.
    std = X.std(axis=0, keepdims=True) + EPS  # compute one standard deviation per feature and protect constant columns.
    return mean, std  # return statistics so validation data can use the same training transform.
def standardize_apply(X, mean, std):  # apply previously fitted normalization statistics.
    return (X - mean) / std  # subtract training means and divide by training standard deviations.
def train_val_split(X, y, val_fraction=0.25):  # create a reproducible train-validation split without external libraries.
    indices = RNG.permutation(len(X))  # shuffle row indices so both sets represent the same distribution.
    cut = int(len(X) * (1.0 - val_fraction))  # compute how many examples belong in the training set.
    train_idx = indices[:cut]  # take the first shuffled block for training.
    val_idx = indices[cut:]  # take the remaining shuffled block for validation.
    return X[train_idx], y[train_idx], X[val_idx], y[val_idx]  # return split arrays in a consistent order.
def make_two_blob_data(n=240, scale_second_feature=1.0, noise=0.75):  # create linearly learnable synthetic binary tabular data.
    half = n // 2  # split the sample count evenly between two classes.
    class0 = RNG.normal(loc=[-1.2, -0.8], scale=[noise, noise], size=(half, 2))  # draw class-zero points around a lower-left center.
    class1 = RNG.normal(loc=[1.2, 0.8], scale=[noise, noise], size=(n - half, 2))  # draw class-one points around an upper-right center.
    X = np.vstack([class0, class1])  # stack both classes into one feature matrix.
    y = np.concatenate([np.zeros(half), np.ones(n - half)]).astype(int)  # create binary labels aligned with the stacked rows.
    X[:, 1] = X[:, 1] * scale_second_feature  # optionally inflate one feature to demonstrate normalization effects.
    order = RNG.permutation(n)  # shuffle examples so labels are not grouped by class.
    return X[order], y[order]  # return shuffled features and labels.
def make_moons_np(n=300, noise=0.12):  # create a two-moons binary dataset using only NumPy.
    half = n // 2  # split examples evenly between the two arcs.
    theta0 = RNG.uniform(0.0, np.pi, size=half)  # sample angles for the upper moon.
    theta1 = RNG.uniform(0.0, np.pi, size=n - half)  # sample angles for the lower shifted moon.
    upper = np.column_stack([np.cos(theta0), np.sin(theta0)])  # convert upper-moon angles into x-y coordinates.
    lower = np.column_stack([1.0 - np.cos(theta1), 0.5 - np.sin(theta1)])  # convert lower-moon angles into shifted x-y coordinates.
    X = np.vstack([upper, lower])  # combine both curved classes into one feature matrix.
    y = np.concatenate([np.zeros(half), np.ones(n - half)]).astype(int)  # create class labels for the two arcs.
    X = X + RNG.normal(0.0, noise, size=X.shape)  # add Gaussian noise so the task is realistic rather than perfectly separable.
    order = RNG.permutation(n)  # shuffle examples so mini-batches mix both classes.
    return X[order], y[order]  # return shuffled moon data and labels.
def make_image_dataset(n=160, size=12, label_rule="bar_orientation"):  # create tiny grayscale image-like arrays with labels.
    images = np.zeros((n, size, size), dtype=float)  # allocate one square image per example.
    labels = np.zeros(n, dtype=int)  # allocate one binary label per image.
    for i in range(n):  # fill every synthetic image with a simple class-dependent pattern.
        label = i % 2  # alternate labels to keep the dataset balanced.
        labels[i] = label  # store the label for the current image.
        base = RNG.normal(0.10, 0.03, size=(size, size))  # start with a dim noisy background.
        if label_rule == "bar_orientation":  # use vertical bars for class zero and horizontal bars for class one.
            if label == 0:  # choose the vertical-bar pattern for class zero.
                base[:, size // 3:size // 3 + 2] += 0.85  # draw a bright vertical bar in the left-middle region.
            else:  # choose the horizontal-bar pattern for class one.
                base[size // 3:size // 3 + 2, :] += 0.85  # draw a bright horizontal bar in the upper-middle region.
        else:  # use top-vs-bottom bright patch labels for harmful-flip examples.
            if label == 0:  # choose a top patch for class zero.
                base[1:5, 4:8] += 0.85  # draw a bright patch near the top.
            else:  # choose a bottom patch for class one.
                base[7:11, 4:8] += 0.85  # draw a bright patch near the bottom.
        images[i] = np.clip(base, 0.0, 1.0)  # clip pixel intensities into the valid grayscale range.
    order = RNG.permutation(n)  # shuffle images so classes are not ordered.
    return images[order], labels[order]  # return shuffled image-like data and labels.
def flip_horizontal(images):  # define a label-preserving horizontal flip for many image tasks.
    return images[:, :, ::-1]  # reverse the width axis while keeping batch and height unchanged.
def flip_vertical(images):  # define a vertical flip that is harmful for top-vs-bottom labels.
    return images[:, ::-1, :]  # reverse the height axis while keeping batch and width unchanged.
def add_noise_images(images, amount=0.12):  # define additive pixel noise augmentation.
    return np.clip(images + RNG.normal(0.0, amount, size=images.shape), 0.0, 1.0)  # add noise and keep pixels valid.
def shift_brightness(images, shift=0.15):  # define a simple brightness or color-shift analogue for grayscale images.
    return np.clip(images + shift, 0.0, 1.0)  # shift every pixel and clip to the valid range.
def change_contrast(images, factor=1.4):  # define contrast augmentation around mid-gray.
    return np.clip((images - 0.5) * factor + 0.5, 0.0, 1.0)  # expand or shrink distance from gray and clip values.
def mask_patch(images, top=4, left=4, height=3, width=3):  # define information-loss augmentation by masking a rectangle.
    masked = images.copy()  # copy images so the original batch is not modified in place.
    masked[:, top:top + height, left:left + width] = 0.0  # set the chosen rectangle to black.
    return masked  # return the masked batch.
def crop_center_resize_nearest(images, crop=10):  # define a tiny crop-and-resize augmentation using nearest-neighbor indexing.
    n, size, _ = images.shape  # read the batch size and image side length.
    start = (size - crop) // 2  # compute a centered crop start index.
    cropped = images[:, start:start + crop, start:start + crop]  # take the centered crop from each image.
    grid = np.linspace(0, crop - 1, size).round().astype(int)  # map output pixels back to nearest crop pixels.
    resized = cropped[:, grid][:, :, grid]  # resize the crop back to the original side length.
    return resized  # return image-like arrays with the original shape.
def rotate_90(images):  # define a deterministic rotation augmentation used for demonstration.
    return np.rot90(images, k=1, axes=(1, 2))  # rotate each image by ninety degrees around its spatial axes.
def plot_image_grid(images, titles, main_title, columns=4):  # create a reusable image-montage helper.
    rows = int(np.ceil(len(images) / columns))  # compute how many subplot rows are needed.
    fig, axes = plt.subplots(rows, columns, figsize=(3.0 * columns, 3.0 * rows))  # allocate a grid of image axes.
    axes = np.atleast_1d(axes).ravel()  # flatten axes so one loop can address them.
    for ax, image, title in zip(axes, images, titles):  # draw each provided image in order.
        ax.imshow(image, cmap="gray", vmin=0.0, vmax=1.0)  # display grayscale intensity on a fixed scale.
        ax.set_title(title)  # label the transformation shown in this cell.
        ax.axis("off")  # hide tick marks because pixel coordinates are not the focus.
    for ax in axes[len(images):]:  # clean up any unused subplot cells.
        ax.axis("off")  # hide empty axes for a tidy grid.
    fig.suptitle(main_title, y=1.02)  # add a single title describing the montage.
    plt.tight_layout()  # reduce overlap between image titles and axes.
def train_logistic(X_train, y_train, X_val=None, y_val=None, lr=0.1, epochs=40, batch_size=32, normalize=False, augment_fn=None):  # train binary logistic regression from scratch.
    mean, std = standardize_fit(X_train) if normalize else (np.zeros((1, X_train.shape[1])), np.ones((1, X_train.shape[1])))  # fit optional training normalization.
    Xtr = standardize_apply(X_train, mean, std)  # transform training features using the chosen statistics.
    Xva = None if X_val is None else standardize_apply(X_val, mean, std)  # transform validation features without refitting statistics.
    w = RNG.normal(0.0, 0.05, size=Xtr.shape[1])  # initialize weights near zero so early predictions are uncertain.
    b = 0.0  # initialize the bias at zero for a neutral decision threshold.
    history = {"loss": [], "val_loss": [], "acc": [], "val_acc": [], "grad_norm": []}  # allocate lists for training diagnostics.
    for epoch in range(epochs):  # repeat passes through the data.
        order = RNG.permutation(len(Xtr))  # reshuffle examples each epoch to create new mini-batches.
        batch_losses = []  # collect mini-batch losses for this epoch.
        batch_grad_norms = []  # collect gradient norms for this epoch.
        for start in range(0, len(Xtr), batch_size):  # step through mini-batches by index range.
            idx = order[start:start + batch_size]  # select the current mini-batch indices.
            xb = Xtr[idx]  # gather the current mini-batch features.
            yb = y_train[idx]  # gather the current mini-batch labels.
            if augment_fn is not None:  # optionally augment already-vectorized features for simple image experiments.
                xb = augment_fn(xb)  # apply the augmentation only to training mini-batches.
            logits = xb @ w + b  # compute linear scores for the current mini-batch.
            probs = sigmoid(logits)  # convert scores to probabilities.
            loss = bce_loss(probs, yb)  # compute binary cross-entropy for the batch.
            error = probs - yb  # compute dL/dlogit for sigmoid plus cross-entropy.
            grad_w = xb.T @ error / len(xb)  # compute the average weight gradient over the mini-batch.
            grad_b = float(np.mean(error))  # compute the average bias gradient over the mini-batch.
            w = w - lr * grad_w  # update weights by stepping opposite the gradient.
            b = b - lr * grad_b  # update the bias by stepping opposite its gradient.
            batch_losses.append(loss)  # store this mini-batch loss for the epoch summary.
            batch_grad_norms.append(float(np.linalg.norm(grad_w)))  # store gradient size as a stability diagnostic.
        train_probs = sigmoid(Xtr @ w + b)  # compute probabilities for the full training set after the epoch.
        history["loss"].append(bce_loss(train_probs, y_train))  # record full training loss after all mini-batch updates.
        history["acc"].append(accuracy(train_probs, y_train))  # record full training accuracy after the epoch.
        history["grad_norm"].append(float(np.mean(batch_grad_norms)))  # record the typical mini-batch gradient norm.
        if Xva is not None:  # compute validation diagnostics when validation data is supplied.
            val_probs = sigmoid(Xva @ w + b)  # compute validation probabilities using the same learned parameters.
            history["val_loss"].append(bce_loss(val_probs, y_val))  # record validation loss for generalization checks.
            history["val_acc"].append(accuracy(val_probs, y_val))  # record validation accuracy for generalization checks.
    model = {"w": w, "b": b, "mean": mean, "std": std, "history": history}  # package parameters and diagnostics in one dictionary.
    return model  # return the trained model dictionary.
def predict_logistic(model, X):  # predict probabilities from a trained logistic model dictionary.
    Xn = standardize_apply(X, model["mean"], model["std"])  # apply the stored preprocessing transform.
    return sigmoid(Xn @ model["w"] + model["b"])  # compute probabilities from normalized inputs and learned parameters.
def plot_loss_curves(histories, title):  # plot one or more loss curves on shared axes.
    plt.figure(figsize=(7.2, 4.5))  # create a readable loss-curve figure.
    for label, history in histories.items():  # draw each named training run.
        plt.plot(history["loss"], label=f"{label} train loss")  # plot training loss for the run.
        if len(history["val_loss"]) > 0:  # add validation loss if it was recorded.
            plt.plot(history["val_loss"], linestyle="--", label=f"{label} val loss")  # plot validation loss with a dashed line.
    plt.xlabel("epoch")  # label the horizontal axis with training epochs.
    plt.ylabel("binary cross-entropy")  # label the vertical axis with the optimized loss.
    plt.title(title)  # add a diagnostic title.
    plt.legend()  # show which curve corresponds to each training run.
    plt.show()  # render the figure.
def plot_decision_boundary(model, X, y, title):  # visualize a two-dimensional logistic decision boundary.
    x_min, x_max = X[:, 0].min() - 0.6, X[:, 0].max() + 0.6  # create horizontal plotting limits with margin.
    y_min, y_max = X[:, 1].min() - 0.6, X[:, 1].max() + 0.6  # create vertical plotting limits with margin.
    xx, yy = np.meshgrid(np.linspace(x_min, x_max, 160), np.linspace(y_min, y_max, 160))  # create a dense grid for probabilities.
    grid = np.column_stack([xx.ravel(), yy.ravel()])  # flatten grid coordinates into a feature matrix.
    zz = predict_logistic(model, grid).reshape(xx.shape)  # predict class-one probability at every grid location.
    plt.figure(figsize=(6.2, 5.2))  # create a readable boundary plot.
    plt.contourf(xx, yy, zz, levels=np.linspace(0, 1, 21), cmap="RdBu_r", alpha=0.55)  # draw the probability field.
    plt.contour(xx, yy, zz, levels=[0.5], colors="black", linewidths=2.0)  # draw the decision threshold line.
    plt.scatter(X[:, 0], X[:, 1], c=y, cmap="bwr", edgecolors="white", linewidths=0.5, s=38)  # overlay labeled training points.
    plt.title(title)  # add the plot title.
    plt.xlabel("feature 1")  # label the first feature axis.
    plt.ylabel("feature 2")  # label the second feature axis.
    plt.show()  # render the plot.
```

### Data — swappable sources

The notebook uses one switch for two kinds of offline data: tabular two-dimensional classification and tiny image-like arrays. The `tabular_unscaled` source is intentionally difficult for unnormalized training, and the `image_top_bottom` source is intentionally vulnerable to harmful vertical flips.

```python
DATA_SOURCE = "tabular_moons"  # choose "tabular_blobs", "tabular_unscaled", "tabular_moons", "image_bars", or "image_top_bottom".
def load_lesson_data(source):  # define a single data-loading switch so later cells can be rerun with another source.
    if source == "tabular_blobs":  # choose simple linearly separable blobs for basic training-loop success.
        X, y = make_two_blob_data(n=260, scale_second_feature=1.0, noise=0.70)  # generate balanced two-blob tabular data.
        description = "balanced two-blob tabular data"  # describe the selected source for printed output.
    elif source == "tabular_unscaled":  # choose a version with one huge feature scale to demonstrate slow training.
        X, y = make_two_blob_data(n=260, scale_second_feature=80.0, noise=0.70)  # inflate feature two so normalization matters.
        description = "two-blob tabular data with one feature scaled by 80"  # describe the selected source for diagnostics.
    elif source == "tabular_moons":  # choose a nonlinear dataset that a one-layer model cannot perfectly solve.
        X, y = make_moons_np(n=300, noise=0.12)  # generate NumPy-only crescent-shaped classes.
        description = "nonlinear two-moons tabular data"  # describe the selected source for diagnostics.
    elif source == "image_bars":  # choose tiny images where horizontal flips preserve labels.
        X, y = make_image_dataset(n=180, size=12, label_rule="bar_orientation")  # generate vertical-vs-horizontal bar images.
        description = "12x12 image-like bars where horizontal flips preserve labels"  # describe the selected source for diagnostics.
    elif source == "image_top_bottom":  # choose tiny images where vertical flips change the label rule.
        X, y = make_image_dataset(n=180, size=12, label_rule="top_bottom")  # generate top-vs-bottom patch images.
        description = "12x12 image-like top-vs-bottom patches where vertical flips are harmful"  # describe the selected source for diagnostics.
    else:  # reject invalid source names with a clear message.
        raise ValueError("Use tabular_blobs, tabular_unscaled, tabular_moons, image_bars, or image_top_bottom.")  # explain valid options.
    return X, y, description  # return the selected dataset and text description.
X_demo, y_demo, data_description = load_lesson_data(DATA_SOURCE)  # load the selected demonstration data.
print(f"Loaded {data_description}.")  # print the human-readable source name.
print(f"Feature shape: {X_demo.shape}; label shape: {y_demo.shape}.")  # print array shapes so learners know whether data is tabular or image-like.
print(f"Class balance: {np.bincount(y_demo.astype(int))}.")  # print class counts because imbalance changes loss interpretation.
```

```python
if X_demo.ndim == 2:  # check whether the selected source is tabular.
    plt.figure(figsize=(6.2, 5.0))  # create a scatterplot canvas.
    plt.scatter(X_demo[:, 0], X_demo[:, 1], c=y_demo, cmap="bwr", edgecolors="white", linewidths=0.4, s=38)  # show labeled points for teaching purposes.
    plt.title(f"Raw tabular source: {data_description}")  # title the raw-data plot.
    plt.xlabel("feature 1")  # label the first feature axis.
    plt.ylabel("feature 2")  # label the second feature axis.
    plt.show()  # render the scatterplot.
else:  # handle image-like sources with a montage.
    plot_image_grid(X_demo[:8], [f"label {int(v)}" for v in y_demo[:8]], f"Raw image-like source: {data_description}", columns=4)  # display sample images with labels.
    plt.show()  # render the image grid.
```

▶ What you'll see: a scatterplot for tabular sources or a montage for image-like sources. The raw view tells you whether normalization, augmentation, or model capacity is likely to be the limiting factor.

### 📖 Concept walkthrough — build each idea from scratch

Before the warm-up examples, we build the data-processing and training ideas from scratch, one small step at a time. Everything here uses only NumPy + Matplotlib and tiny inline data, so every array, transformation, gradient, and loss curve is inspectable. Variables carry a `_w` suffix so they never collide with the examples below.

```python
import numpy as np  # use NumPy for tiny arrays, vectorized normalization, augmentation, and gradients.
import matplotlib.pyplot as plt  # use Matplotlib so every preprocessing and optimization step can be checked visually.
np.random.seed(230)  # fix randomness so the walkthrough prints and figures are reproducible.
```

#### 1. Normalize inputs before training

Neural-network gradients behave better when input features have comparable scales. We standardize each feature with:

$$
\tilde{x}=\frac{x-\mu}{\sigma}
$$

where $\mu$ is the feature mean and $\sigma$ is the feature standard deviation. This approach centers every column near zero and gives every column unit spread, so a large-unit feature cannot dominate dot products, gradients, or the loss geometry.

```python
X_raw_norm_w = np.array([[-2.0, -100.0], [-1.0, -100.0], [1.0, -100.0], [2.0, -100.0], [-2.0, 100.0], [-1.0, 100.0], [1.0, 100.0], [2.0, 100.0]])  # create two features with very different numerical scales but simple independent directions.
y_norm_w = np.array([-0.512, -0.006, 1.006, 1.512, -1.512, -1.006, 0.006, 0.512])  # create a tiny regression target so loss surfaces are inspectable.
print("raw feature matrix:\n", X_raw_norm_w)  # inspect the unnormalized inputs before any training step.
print("feature means:", np.round(X_raw_norm_w.mean(axis=0), 3))  # print each raw feature mean to expose the large offset difference.
print("feature stds:", np.round(X_raw_norm_w.std(axis=0), 3))  # print each raw feature spread to expose the scale difference.
```
▶ What you'll see: feature 2 is tens of times larger than feature 1, so raw gradients will be dominated by that column.

```python
mu_norm_w = X_raw_norm_w.mean(axis=0, keepdims=True)  # compute one mean per feature for centering.
sigma_norm_w = X_raw_norm_w.std(axis=0, keepdims=True)  # compute one standard deviation per feature for scaling.
X_scaled_norm_w = (X_raw_norm_w - mu_norm_w) / sigma_norm_w  # standardize each feature using (x-mu)/sigma.
print("normalized feature matrix:\n", np.round(X_scaled_norm_w, 3))  # inspect the transformed inputs after scaling.
print("normalized means:", np.round(X_scaled_norm_w.mean(axis=0), 3))  # verify that each transformed feature is centered near zero.
print("normalized stds:", np.round(X_scaled_norm_w.std(axis=0), 3))  # verify that each transformed feature has unit spread.
```
▶ What you'll see: both normalized columns now have mean $0$ and standard deviation $1$.

```python
fig_norm_w, axes_norm_w = plt.subplots(1, 2, figsize=(9.5, 3.8))  # create side-by-side axes for raw versus normalized geometry.
axes_norm_w[0].scatter(X_raw_norm_w[:, 0], X_raw_norm_w[:, 1], c=y_norm_w, cmap="viridis", s=80, edgecolors="black")  # plot raw features where one axis uses much larger units.
axes_norm_w[0].set_title("1: raw feature scales")  # title the raw-scale scatterplot.
axes_norm_w[0].set_xlabel("feature 1")  # label the small-scale raw feature.
axes_norm_w[0].set_ylabel("feature 2")  # label the large-scale raw feature.
axes_norm_w[1].scatter(X_scaled_norm_w[:, 0], X_scaled_norm_w[:, 1], c=y_norm_w, cmap="viridis", s=80, edgecolors="black")  # plot standardized features on comparable axes.
axes_norm_w[1].set_title("1: standardized feature scales")  # title the normalized scatterplot.
axes_norm_w[1].set_xlabel("standardized feature 1")  # label the centered and scaled first feature.
axes_norm_w[1].set_ylabel("standardized feature 2")  # label the centered and scaled second feature.
plt.tight_layout()  # keep labels and titles from overlapping.
plt.show()  # render the before-and-after scatterplots.
```
▶ What you'll see: the raw scatter is stretched by unequal units, while the standardized scatter uses balanced axes.

```python
w1_raw_grid_norm_w, w2_raw_grid_norm_w = np.meshgrid(np.linspace(-1.2, 1.2, 120), np.linspace(-0.08, 0.08, 120))  # build a raw-weight grid with a narrow range for the large-scale feature.
W_raw_grid_norm_w = np.column_stack([w1_raw_grid_norm_w.ravel(), w2_raw_grid_norm_w.ravel()])  # flatten raw-weight pairs into rows for vectorized loss evaluation.
loss_raw_norm_w = np.mean((X_raw_norm_w @ W_raw_grid_norm_w.T - y_norm_w[:, None]) ** 2, axis=0).reshape(w1_raw_grid_norm_w.shape)  # compute MSE over every raw-weight pair.
w1_scaled_grid_norm_w, w2_scaled_grid_norm_w = np.meshgrid(np.linspace(-2.0, 2.0, 120), np.linspace(-2.0, 2.0, 120))  # build a balanced weight grid for standardized features.
W_scaled_grid_norm_w = np.column_stack([w1_scaled_grid_norm_w.ravel(), w2_scaled_grid_norm_w.ravel()])  # flatten standardized-weight pairs into rows for vectorized loss evaluation.
loss_scaled_norm_w = np.mean((X_scaled_norm_w @ W_scaled_grid_norm_w.T - y_norm_w[:, None]) ** 2, axis=0).reshape(w1_scaled_grid_norm_w.shape)  # compute MSE over every standardized-weight pair.
cond_raw_norm_w = np.linalg.cond((X_raw_norm_w.T @ X_raw_norm_w) / len(X_raw_norm_w))  # measure raw curvature imbalance through the Hessian condition number.
cond_scaled_norm_w = np.linalg.cond((X_scaled_norm_w.T @ X_scaled_norm_w) / len(X_scaled_norm_w))  # measure normalized curvature imbalance after scaling.
print("condition number before normalization:", round(cond_raw_norm_w, 1))  # print how ill-conditioned the raw quadratic loss is.
print("condition number after normalization:", round(cond_scaled_norm_w, 1))  # print how much rounder the normalized quadratic loss is.
fig_loss_norm_w, axes_loss_norm_w = plt.subplots(1, 2, figsize=(10.0, 3.9))  # create side-by-side contour plots for the two loss surfaces.
axes_loss_norm_w[0].contour(w1_raw_grid_norm_w, w2_raw_grid_norm_w, loss_raw_norm_w, levels=18, cmap="magma")  # draw elongated raw-loss contours.
axes_loss_norm_w[0].set_title("1: elongated loss before normalization")  # title the raw loss surface.
axes_loss_norm_w[0].set_xlabel("raw weight 1")  # label the first raw-weight axis.
axes_loss_norm_w[0].set_ylabel("raw weight 2")  # label the second raw-weight axis.
axes_loss_norm_w[1].contour(w1_scaled_grid_norm_w, w2_scaled_grid_norm_w, loss_scaled_norm_w, levels=18, cmap="magma")  # draw the rounder normalized-loss contours.
axes_loss_norm_w[1].set_title("1: rounder loss after normalization")  # title the normalized loss surface.
axes_loss_norm_w[1].set_xlabel("normalized weight 1")  # label the first normalized-weight axis.
axes_loss_norm_w[1].set_ylabel("normalized weight 2")  # label the second normalized-weight axis.
plt.tight_layout()  # keep the contour labels readable.
plt.show()  # render the loss-surface comparison.
```
▶ What you'll see: the raw loss has long, skinny contours, while the normalized loss is much rounder.

Unequal scales make gradient descent zig-zag because the steep direction forces small safe steps, while the shallow direction still needs many updates. Normalization reduces this ill-conditioning, so the same learning rate can move more directly toward the minimum.

*Why it's done this way: standardization uses only simple training-set statistics, but it changes the optimization geometry from stretched to balanced. That makes gradient descent less sensitive to feature units and usually speeds convergence.*

#### 2. Augment data without changing labels

Data augmentation creates extra training views from an existing example while keeping the same target label. For image-like arrays, flips, small shifts, small rotations, and mild noise can teach invariances without collecting new labels. We use explicit NumPy transforms so it is clear which pixels move and why the class should remain the same.

```python
image_aug_w = np.zeros((7, 7), dtype=float)  # create one tiny grayscale image with a dark background.
image_aug_w[1:6, 3] = 1.0  # draw a bright vertical stroke as the class-defining object.
image_aug_w[2, 2:5] = 0.8  # add a short crossbar so rotation and shifting are visible.
label_aug_w = "vertical mark"  # name the label that should stay unchanged under mild transforms.
print("label:", label_aug_w)  # print the semantic label before augmentation.
print("original image array:\n", image_aug_w)  # inspect the actual pixel values of the source image.
```
▶ What you'll see: a tiny numeric image whose label describes the object, not its exact pixel coordinates.

```python
flip_aug_w = image_aug_w[:, ::-1]  # flip left-to-right because this label does not depend on mirror direction.
shift_aug_w = np.roll(image_aug_w, shift=1, axis=1)  # shift one pixel right to mimic a small change in object position.
noise_aug_w = np.clip(image_aug_w + np.random.normal(0.0, 0.08, image_aug_w.shape), 0.0, 1.0)  # add mild sensor-like noise while keeping pixels valid.
print("flip label:", label_aug_w)  # show that the flipped view keeps the same target.
print("shift label:", label_aug_w)  # show that the shifted view keeps the same target.
print("noise label:", label_aug_w)  # show that the noisy view keeps the same target.
```
▶ What you'll see: several transformed views all reuse the original label.

```python
angle_aug_w = np.deg2rad(12.0)  # choose a small rotation angle that should preserve the visual class.
coords_aug_w = np.indices(image_aug_w.shape).astype(float)  # create row and column coordinate grids for every output pixel.
center_aug_w = (np.array(image_aug_w.shape) - 1.0) / 2.0  # compute the image center so rotation happens around the middle.
y_centered_aug_w = coords_aug_w[0] - center_aug_w[0]  # center the output row coordinates before inverse rotation.
x_centered_aug_w = coords_aug_w[1] - center_aug_w[1]  # center the output column coordinates before inverse rotation.
source_y_aug_w = np.cos(angle_aug_w) * y_centered_aug_w + np.sin(angle_aug_w) * x_centered_aug_w + center_aug_w[0]  # map output rows back to source rows with inverse rotation.
source_x_aug_w = -np.sin(angle_aug_w) * y_centered_aug_w + np.cos(angle_aug_w) * x_centered_aug_w + center_aug_w[1]  # map output columns back to source columns with inverse rotation.
source_y_idx_aug_w = np.clip(np.rint(source_y_aug_w).astype(int), 0, image_aug_w.shape[0] - 1)  # round source rows to nearest valid pixels.
source_x_idx_aug_w = np.clip(np.rint(source_x_aug_w).astype(int), 0, image_aug_w.shape[1] - 1)  # round source columns to nearest valid pixels.
rotate_aug_w = image_aug_w[source_y_idx_aug_w, source_x_idx_aug_w]  # sample the original image to make the rotated view.
print("rotation degrees:", 12)  # print the small rotation amount for inspection.
print("rotate label:", label_aug_w)  # show that the rotated view keeps the same target.
```
▶ What you'll see: the small rotation is built from coordinate math, not a black-box image library.

```python
images_aug_w = [image_aug_w, flip_aug_w, shift_aug_w, rotate_aug_w, noise_aug_w]  # collect the original and augmented images for one montage.
titles_aug_w = ["original", "flip", "shift", "rotate", "noise"]  # create a short title for each image variant.
fig_aug_w, axes_aug_w = plt.subplots(1, len(images_aug_w), figsize=(11.0, 2.7))  # create one row of image panels.
axes_aug_w = np.atleast_1d(axes_aug_w).ravel()  # flatten axes so the loop works even if the panel count changes.
for ax_aug_w, image_variant_aug_w, title_aug_w in zip(axes_aug_w, images_aug_w, titles_aug_w):  # draw each image variant in a matching panel.
    ax_aug_w.imshow(image_variant_aug_w, cmap="gray", vmin=0.0, vmax=1.0)  # display the tiny array as a grayscale image.
    ax_aug_w.set_title(title_aug_w)  # label the transform used for this panel.
    ax_aug_w.axis("off")  # hide pixel ticks so the visual pattern is the focus.
fig_aug_w.suptitle("2: label-preserving image augmentation", y=1.05)  # title the full augmentation montage.
plt.tight_layout()  # reduce spacing conflicts between panel titles.
plt.show()  # render the augmented image variants.
```
▶ What you'll see: the object moves or changes slightly, but the semantic label remains the same.

Augmentation enlarges the effective dataset because the learner sees more plausible input variations without needing new manual labels. It reduces overfitting by discouraging a model from memorizing exact pixel locations, brightness, or noise patterns that should not define the class.

*Why it's done this way: each transform is small enough to preserve the label but different enough to make memorization harder. The important rule is semantic safety: augmentation helps only when the transformed example should truly keep the same target.*

#### 3. Mini-batch gradient descent

For mean squared error on a linear model, the full gradient is an average over all $m$ examples:

$$
\nabla_w J=\frac{2}{m}\sum_{i=1}^{m}(wx_i+b-y_i)x_i
$$

Full-batch gradient descent uses every example per update, SGD uses one example, and mini-batch gradient descent uses a small subset. Mini-batches trade some gradient noise for much cheaper steps than full-batch training and much smoother progress than single-sample SGD.

```python
x_gd_w = np.linspace(-2.0, 2.0, 12)  # create twelve one-dimensional training inputs.
y_gd_w = 1.4 * x_gd_w - 0.3 + np.random.normal(0.0, 0.18, size=x_gd_w.shape)  # create noisy linear targets from a known trend.
print("x values:", np.round(x_gd_w, 2))  # inspect the tiny input vector.
print("y values:", np.round(y_gd_w, 2))  # inspect the noisy target vector.
plt.figure(figsize=(5.8, 3.8))  # create a figure for the tiny regression data.
plt.scatter(x_gd_w, y_gd_w, s=70, edgecolors="black", color="tab:purple")  # plot the points that gradients will fit.
plt.title("3: tiny regression data for gradient descent")  # title the data plot.
plt.xlabel("x")  # label the input axis.
plt.ylabel("y")  # label the target axis.
plt.show()  # render the data before optimization.
```
▶ What you'll see: twelve noisy points following an approximately straight line.

```python
w0_gd_w = 0.0  # start all methods from the same slope.
b0_gd_w = 0.0  # start all methods from the same intercept.
pred_full_gd_w = w0_gd_w * x_gd_w + b0_gd_w  # compute predictions for the full dataset at the starting point.
error_full_gd_w = pred_full_gd_w - y_gd_w  # compute full-dataset residuals at the starting point.
grad_full_gd_w = np.array([2.0 * np.mean(error_full_gd_w * x_gd_w), 2.0 * np.mean(error_full_gd_w)])  # compute the exact full-batch gradient.
idx_sgd_gd_w = 0  # choose one example for a single-sample SGD gradient estimate.
grad_sgd_gd_w = np.array([2.0 * (w0_gd_w * x_gd_w[idx_sgd_gd_w] + b0_gd_w - y_gd_w[idx_sgd_gd_w]) * x_gd_w[idx_sgd_gd_w], 2.0 * (w0_gd_w * x_gd_w[idx_sgd_gd_w] + b0_gd_w - y_gd_w[idx_sgd_gd_w])])  # compute one-example gradient estimate.
idx_mini_gd_w = np.array([0, 3, 6, 9])  # choose four examples for a mini-batch gradient estimate.
error_mini_gd_w = (w0_gd_w * x_gd_w[idx_mini_gd_w] + b0_gd_w) - y_gd_w[idx_mini_gd_w]  # compute mini-batch residuals at the starting point.
grad_mini_gd_w = np.array([2.0 * np.mean(error_mini_gd_w * x_gd_w[idx_mini_gd_w]), 2.0 * np.mean(error_mini_gd_w)])  # compute the mini-batch gradient estimate.
print("full-batch gradient:", np.round(grad_full_gd_w, 3), "cost = 12 examples")  # print the stable but expensive exact gradient.
print("single-sample gradient:", np.round(grad_sgd_gd_w, 3), "cost = 1 example")  # print the noisy but cheap SGD gradient.
print("mini-batch gradient:", np.round(grad_mini_gd_w, 3), "cost = 4 examples")  # print the intermediate mini-batch gradient.
```
▶ What you'll see: the single-sample gradient can point differently from the full gradient, while the mini-batch estimate is closer but still cheaper.

```python
lr_gd_w = 0.08  # choose one learning rate for all three methods.
steps_gd_w = 35  # choose the same number of parameter updates for all three methods.
batch_size_gd_w = 4  # choose four examples per mini-batch update.
params_full_gd_w = np.array([w0_gd_w, b0_gd_w], dtype=float)  # store full-batch slope and intercept together.
params_sgd_gd_w = np.array([w0_gd_w, b0_gd_w], dtype=float)  # store SGD slope and intercept together.
params_mini_gd_w = np.array([w0_gd_w, b0_gd_w], dtype=float)  # store mini-batch slope and intercept together.
losses_full_gd_w = []  # allocate full-batch loss history.
losses_sgd_gd_w = []  # allocate SGD loss history measured on the full dataset.
losses_mini_gd_w = []  # allocate mini-batch loss history measured on the full dataset.
for step_gd_w in range(steps_gd_w):  # run the same number of updates for each method.
    pred_all_full_gd_w = params_full_gd_w[0] * x_gd_w + params_full_gd_w[1]  # compute full-batch predictions for the exact update.
    err_all_full_gd_w = pred_all_full_gd_w - y_gd_w  # compute residuals for every example in the exact update.
    grad_all_full_gd_w = np.array([2.0 * np.mean(err_all_full_gd_w * x_gd_w), 2.0 * np.mean(err_all_full_gd_w)])  # average the exact full gradient.
    params_full_gd_w = params_full_gd_w - lr_gd_w * grad_all_full_gd_w  # update full-batch parameters.
    idx_one_gd_w = step_gd_w % len(x_gd_w)  # cycle through one example at a time for SGD.
    err_one_gd_w = params_sgd_gd_w[0] * x_gd_w[idx_one_gd_w] + params_sgd_gd_w[1] - y_gd_w[idx_one_gd_w]  # compute one-example residual for SGD.
    grad_one_gd_w = np.array([2.0 * err_one_gd_w * x_gd_w[idx_one_gd_w], 2.0 * err_one_gd_w])  # compute the one-example SGD gradient.
    params_sgd_gd_w = params_sgd_gd_w - lr_gd_w * grad_one_gd_w  # update SGD parameters using the noisy estimate.
    idx_batch_gd_w = (np.arange(batch_size_gd_w) + step_gd_w * batch_size_gd_w) % len(x_gd_w)  # cycle through four-example mini-batches.
    pred_batch_gd_w = params_mini_gd_w[0] * x_gd_w[idx_batch_gd_w] + params_mini_gd_w[1]  # compute mini-batch predictions.
    err_batch_gd_w = pred_batch_gd_w - y_gd_w[idx_batch_gd_w]  # compute mini-batch residuals.
    grad_batch_gd_w = np.array([2.0 * np.mean(err_batch_gd_w * x_gd_w[idx_batch_gd_w]), 2.0 * np.mean(err_batch_gd_w)])  # average the mini-batch gradient estimate.
    params_mini_gd_w = params_mini_gd_w - lr_gd_w * grad_batch_gd_w  # update mini-batch parameters.
    losses_full_gd_w.append(np.mean((params_full_gd_w[0] * x_gd_w + params_full_gd_w[1] - y_gd_w) ** 2))  # record full-batch method loss on all data.
    losses_sgd_gd_w.append(np.mean((params_sgd_gd_w[0] * x_gd_w + params_sgd_gd_w[1] - y_gd_w) ** 2))  # record SGD method loss on all data.
    losses_mini_gd_w.append(np.mean((params_mini_gd_w[0] * x_gd_w + params_mini_gd_w[1] - y_gd_w) ** 2))  # record mini-batch method loss on all data.
print("final full-batch params:", np.round(params_full_gd_w, 3))  # print the final exact-update slope and intercept.
print("final SGD params:", np.round(params_sgd_gd_w, 3))  # print the final one-example-update slope and intercept.
print("final mini-batch params:", np.round(params_mini_gd_w, 3))  # print the final mini-batch-update slope and intercept.
```
▶ What you'll see: all methods move toward a useful line, but their update paths differ because their gradients use different amounts of data.

```python
plt.figure(figsize=(7.2, 4.4))  # create a shared loss-trajectory figure.
plt.plot(losses_full_gd_w, label="full batch: smooth, costly")  # plot the full-batch loss curve.
plt.plot(losses_sgd_gd_w, label="single sample: noisy, cheap")  # plot the SGD loss curve.
plt.plot(losses_mini_gd_w, label="mini-batch: middle ground")  # plot the mini-batch loss curve.
plt.xlabel("parameter update")  # label the horizontal axis by update count.
plt.ylabel("mean squared error on all data")  # label the vertical axis by full-dataset loss.
plt.title("3: full-batch vs SGD vs mini-batch loss trajectories")  # title the optimization comparison.
plt.legend()  # show which curve belongs to each training method.
plt.show()  # render the three loss trajectories.
```
▶ What you'll see: full-batch descent is smooth, single-sample SGD is noisier, and mini-batch descent usually lands between them.

Mini-batches work because averaging a few examples reduces gradient noise compared with one-example SGD, while each update costs far less than scanning the full dataset. That is why deep-learning training loops usually shuffle data and update on mini-batches rather than using every example every step.

*Why it's done this way: full gradients are accurate but expensive, and one-sample gradients are cheap but jumpy. Mini-batches provide a practical compromise: enough averaging for stable progress and enough updates per epoch for efficient learning.*

### 🟢 Basics (warm-up)

#### B1. Normalize one tiny feature array

**Goal.** Normalize the toy feature values $[1,2,5,6]$ by hand in code and see that the result has mean zero and standard deviation one.

```python
x_b1 = np.array([1.0, 2.0, 5.0, 6.0])  # create the exact tiny feature array from the lesson plan.
mean_b1 = x_b1.mean()  # compute the feature mean used for centering.
std_b1 = x_b1.std()  # compute the feature standard deviation used for scaling.
x_norm_b1 = (x_b1 - mean_b1) / std_b1  # normalize each value by subtracting the mean and dividing by the standard deviation.
print("raw values:", x_b1)  # print the original values before preprocessing.
print("mean and std:", round(mean_b1, 3), round(std_b1, 3))  # print the fitted normalization statistics.
print("normalized values:", np.round(x_norm_b1, 3))  # print the transformed values for inspection.
print("normalized mean and std:", round(x_norm_b1.mean(), 3), round(x_norm_b1.std(), 3))  # verify the normalized scale.
plt.figure(figsize=(6.4, 2.2))  # create a compact before-after dot-strip plot.
plt.scatter(x_b1, np.zeros_like(x_b1), s=90, label="raw", color="tab:blue")  # plot raw points on a horizontal strip.
plt.scatter(x_norm_b1, np.ones_like(x_norm_b1), s=90, label="normalized", color="tab:orange")  # plot normalized points on a second strip.
plt.yticks([0, 1], ["raw", "normalized"])  # label the two horizontal strips.
plt.axvline(0.0, color="black", linewidth=1.0)  # mark zero so centering is visually obvious.
plt.title("B1: tiny-array normalization")  # title the warm-up visualization.
plt.legend()  # show which color is raw and normalized.
plt.show()  # render the dot strip.
```

▶ What you'll see: raw values live between 1 and 6, while normalized values are centered around 0 with unit spread.

#### B2. Compute one binary cross-entropy loss

**Goal.** Evaluate $L(z,y)=-[y\log z+(1-y)\log(1-z)]$ for one prediction and one label.

```python
z_b2 = 0.82  # choose one predicted probability for class one.
y_b2 = 1.0  # choose the true label as class one.
loss_b2 = -(y_b2 * np.log(z_b2) + (1.0 - y_b2) * np.log(1.0 - z_b2))  # compute the scalar binary cross-entropy exactly.
print(f"prediction z = {z_b2:.2f}")  # print the probability used in the formula.
print(f"label y = {y_b2:.0f}")  # print the target label used in the formula.
print(f"binary cross-entropy = {loss_b2:.4f}")  # print the resulting penalty.
z_grid_b2 = np.linspace(0.01, 0.99, 200)  # create possible prediction probabilities for a loss curve.
loss_grid_b2 = -np.log(z_grid_b2)  # compute the y=1 cross-entropy curve across probabilities.
plt.figure(figsize=(6.4, 3.6))  # create a simple loss-axis plot.
plt.plot(z_grid_b2, loss_grid_b2, color="tab:purple", label="loss when y=1")  # plot how loss changes with prediction confidence.
plt.scatter([z_b2], [loss_b2], s=100, color="black", zorder=3, label="our prediction")  # mark the chosen prediction and loss.
plt.xlabel("predicted probability z")  # label the probability axis.
plt.ylabel("cross-entropy loss")  # label the loss axis.
plt.title("B2: one binary cross-entropy value")  # title the warm-up visualization.
plt.legend()  # display the curve and marker labels.
plt.show()  # render the plot.
```

▶ What you'll see: confident correct predictions near 1 have small loss, while predictions near 0 have very large loss.

#### B3. One scalar weight update

**Goal.** Apply $w\leftarrow w-\alpha\frac{\partial L}{\partial w}$ to one scalar parameter.

```python
w_b3 = 2.0  # choose a starting scalar weight.
grad_b3 = 0.75  # choose a positive gradient, meaning increasing w would increase the loss.
lr_b3 = 0.20  # choose a learning rate for the update size.
w_new_b3 = w_b3 - lr_b3 * grad_b3  # apply the gradient-descent update rule.
print(f"old weight = {w_b3:.3f}")  # print the starting weight.
print(f"gradient = {grad_b3:.3f}")  # print the slope used for the update.
print(f"learning rate = {lr_b3:.3f}")  # print the step-size multiplier.
print(f"new weight = {w_new_b3:.3f}")  # print the updated weight.
plt.figure(figsize=(6.4, 1.8))  # create a compact number-line plot.
plt.hlines(0.0, 1.6, 2.2, color="gray", linewidth=2.0)  # draw the number line around the two weights.
plt.scatter([w_b3], [0.0], s=120, color="tab:red", label="before update")  # mark the old weight.
plt.scatter([w_new_b3], [0.0], s=120, color="tab:green", label="after update")  # mark the new weight.
plt.annotate("step opposite gradient", xy=(w_new_b3, 0.0), xytext=(w_b3, 0.08), arrowprops={"arrowstyle": "->"})  # draw an arrow from old to new.
plt.yticks([])  # remove the uninformative vertical axis ticks.
plt.xlabel("weight value")  # label the number-line axis.
plt.title("B3: one gradient-descent update")  # title the warm-up visualization.
plt.legend()  # show marker meanings.
plt.show()  # render the plot.
```

▶ What you'll see: the weight moves left because the gradient is positive and gradient descent steps in the negative-gradient direction.


#### B4. Min-max normalize one array

**Goal.** Rescale a tiny feature array into the $[0,1]$ range.

```python
x_b4 = np.array([2.0, 4.0, 6.0, 10.0])  # create a small feature vector with a visible minimum and maximum.
x_min_b4 = x_b4.min()  # compute the minimum value used as the new zero point.
x_max_b4 = x_b4.max()  # compute the maximum value used as the new one point.
x_scaled_b4 = (x_b4 - x_min_b4) / (x_max_b4 - x_min_b4)  # apply min-max normalization.
print("raw values:", x_b4)  # show the input values.
print("min, max:", x_min_b4, x_max_b4)  # show the fitted scaling endpoints.
print("scaled values:", np.round(x_scaled_b4, 3))  # show the transformed values.
plt.figure(figsize=(6.4, 2.2))  # create a compact dot-strip comparison.
plt.scatter(x_b4, np.zeros_like(x_b4), s=90, label="raw")  # plot raw values.
plt.scatter(x_scaled_b4, np.ones_like(x_scaled_b4), s=90, label="min-max")  # plot scaled values.
plt.yticks([0, 1], ["raw", "scaled"])  # label strips.
plt.title("B4: min-max normalization")  # title the warm-up.
plt.legend()  # show strip labels.
plt.show()  # render the comparison.
```

▶ What you'll see: the smallest value becomes 0, the largest becomes 1, and intermediate values keep their order.

#### B5. One-hot encode three labels

**Goal.** Convert integer class labels into one-hot rows for a multiclass loss.

```python
labels_b5 = np.array([2, 0, 1])  # store three class labels.
num_classes_b5 = 3  # define the number of possible classes.
one_hot_b5 = np.eye(num_classes_b5)[labels_b5]  # select one identity-matrix row per label.
print("labels:", labels_b5)  # print integer labels.
print("one-hot rows:\n", one_hot_b5.astype(int))  # print the encoded target matrix.
plt.figure(figsize=(4.0, 3.0))  # create a small matrix plot.
plt.imshow(one_hot_b5, cmap="Blues", vmin=0, vmax=1)  # display zeros and ones as colors.
plt.xlabel("class")  # label class axis.
plt.ylabel("example")  # label example axis.
plt.title("B5: one-hot encoded labels")  # title the encoding.
plt.colorbar()  # show the 0-to-1 scale.
plt.show()  # render the matrix.
```

▶ What you'll see: each example has exactly one 1 in the column for its class.

#### B6. Shuffle then batch indices

**Goal.** Shuffle six example indices and split them into mini-batches of size two.

```python
indices_b6 = np.arange(6)  # create six example indices.
shuffled_b6 = RNG.permutation(indices_b6)  # shuffle indices before batching.
batches_b6 = [shuffled_b6[start:start + 2] for start in range(0, len(shuffled_b6), 2)]  # cut the shuffled order into batches.
print("original indices:", indices_b6)  # show the dataset order.
print("shuffled indices:", shuffled_b6)  # show the training order for this epoch.
print("mini-batches:", batches_b6)  # show each batch of indices.
plt.figure(figsize=(6.4, 2.0))  # create a timeline view.
plt.scatter(np.arange(len(shuffled_b6)), shuffled_b6, s=100)  # plot which example appears at each training position.
plt.xlabel("position in epoch")  # label the shuffled order axis.
plt.ylabel("example index")  # label the example id axis.
plt.title("B6: shuffled mini-batch order")  # title the batching primitive.
plt.show()  # render the timeline.
```

▶ What you'll see: batching happens after shuffling, so neighboring examples in a batch are not just original neighbors.

#### B7. One mini-batch mean gradient

**Goal.** Average three per-example gradients into one mini-batch gradient.

```python
grads_b7 = np.array([0.4, 1.0, -0.2])  # store scalar gradients from three examples in a mini-batch.
mean_grad_b7 = grads_b7.mean()  # average per-example gradients to get the batch gradient.
print("per-example gradients:", grads_b7)  # show the individual contributions.
print("mini-batch mean gradient:", round(mean_grad_b7, 3))  # show the gradient used for the update.
plt.figure(figsize=(6.4, 3.0))  # create a small bar chart.
plt.bar(["ex 1", "ex 2", "ex 3"], grads_b7, label="per-example")  # plot individual gradients.
plt.axhline(mean_grad_b7, color="black", linestyle="--", label="batch mean")  # mark the average gradient.
plt.ylabel("gradient")  # label the vertical axis.
plt.title("B7: average gradients within a mini-batch")  # title the primitive.
plt.legend()  # show the mean line label.
plt.show()  # render the chart.
```

▶ What you'll see: the negative example gradient partly cancels the positive ones before the update is applied.

#### B8. Horizontal flip a tiny image

**Goal.** Apply one label-preserving horizontal flip to a small image-like array.

```python
image_b8 = np.array([[0.0, 0.2, 0.8], [0.1, 0.5, 1.0], [0.0, 0.3, 0.7]])  # create one tiny grayscale image.
flipped_b8 = image_b8[:, ::-1]  # reverse the width axis to make a horizontal flip.
print("original:\n", image_b8)  # print the original pixels.
print("flipped:\n", flipped_b8)  # print the flipped pixels.
fig, axes = plt.subplots(1, 2, figsize=(5.0, 2.5))  # create before-after image axes.
axes[0].imshow(image_b8, cmap="gray", vmin=0, vmax=1)  # show original image.
axes[0].set_title("original")  # label original.
axes[1].imshow(flipped_b8, cmap="gray", vmin=0, vmax=1)  # show flipped image.
axes[1].set_title("horizontal flip")  # label augmentation.
for ax in axes:  # clean both image axes.
    ax.axis("off")  # hide ticks.
plt.suptitle("B8: one image augmentation")  # title the figure.
plt.show()  # render the before-after images.
```

▶ What you'll see: columns swap left-to-right while pixel intensities are unchanged.

#### B9. Batch-normalize one mini-batch

**Goal.** Normalize one mini-batch of activations using its batch mean and variance.

```python
batch_b9 = np.array([1.0, 2.0, 5.0, 6.0])  # create one mini-batch of scalar activations.
mu_b9 = batch_b9.mean()  # compute the batch mean.
var_b9 = batch_b9.var()  # compute the batch variance.
bn_b9 = (batch_b9 - mu_b9) / np.sqrt(var_b9 + EPS)  # apply the batch-normalization centering and scaling step.
print("batch:", batch_b9)  # show raw activations.
print("mean, variance:", round(mu_b9, 3), round(var_b9, 3))  # show batch statistics.
print("normalized:", np.round(bn_b9, 3))  # show normalized activations.
print("normalized mean/std:", round(bn_b9.mean(), 3), round(bn_b9.std(), 3))  # verify the result.
plt.figure(figsize=(6.4, 3.0))  # create a before-after bar chart.
plt.bar(np.arange(len(batch_b9)) - 0.18, batch_b9, width=0.36, label="raw")  # plot raw activations.
plt.bar(np.arange(len(batch_b9)) + 0.18, bn_b9, width=0.36, label="batch norm")  # plot normalized activations.
plt.title("B9: batch normalization primitive")  # title the warm-up.
plt.legend()  # show labels.
plt.show()  # render the bars.
```

▶ What you'll see: normalized activations have mean near zero and standard deviation near one.

#### B10. Learning-rate times gradient update

**Goal.** Compute the actual parameter change produced by a learning rate and a gradient.

```python
w_b10 = -0.5  # choose one scalar parameter.
lr_b10 = 0.05  # choose a learning rate.
grad_b10 = -3.0  # choose a scalar gradient.
step_b10 = lr_b10 * grad_b10  # compute the signed amount subtracted from the weight.
w_new_b10 = w_b10 - step_b10  # apply the gradient-descent update.
print(f"old weight = {w_b10:.2f}")  # print the starting value.
print(f"lr * gradient = {step_b10:.2f}")  # print the signed update term.
print(f"new weight = {w_new_b10:.2f}")  # print the updated value.
plt.figure(figsize=(6.4, 1.8))  # create a number-line plot.
plt.hlines(0.0, -0.7, -0.2, color="gray", linewidth=2.0)  # draw the relevant weight interval.
plt.scatter([w_b10], [0.0], s=120, label="before")  # mark the original weight.
plt.scatter([w_new_b10], [0.0], s=120, label="after")  # mark the new weight.
plt.annotate("subtract lr·grad", xy=(w_new_b10, 0.0), xytext=(w_b10, 0.08), arrowprops={"arrowstyle": "->"})  # draw the update arrow.
plt.yticks([])  # hide vertical ticks.
plt.xlabel("weight value")  # label the number line.
plt.title("B10: learning-rate × gradient update")  # title the primitive.
plt.legend()  # show before/after labels.
plt.show()  # render the number line.
```

▶ What you'll see: because the gradient is negative, subtracting learning-rate times gradient moves the weight upward.


### 🟡 Easy Examples

#### E1. Visualize image augmentations

**Goal.** Build an original-to-augmented montage using synthetic image-like arrays: flip, rotation, crop, brightness/color shift, noise, information loss, and contrast.

```python
images_e1, labels_e1 = make_image_dataset(n=12, size=12, label_rule="bar_orientation")  # create tiny image-like examples with label-preserving horizontal flips.
image_e1 = images_e1[:1]  # keep one image as a batch of size one so augmentation helpers accept it.
augmented_e1 = [image_e1[0], flip_horizontal(image_e1)[0], rotate_90(image_e1)[0], crop_center_resize_nearest(image_e1)[0], shift_brightness(image_e1)[0], add_noise_images(image_e1)[0], mask_patch(image_e1)[0], change_contrast(image_e1)[0]]  # compute each planned augmentation.
titles_e1 = ["original", "flip", "rotate", "crop", "brightness", "noise", "mask", "contrast"]  # name each transformation in the montage.
plot_image_grid(augmented_e1, titles_e1, "E1: original → augmentation grid", columns=4)  # plot the original image beside every augmentation.
plt.show()  # render the augmentation montage.
```

▶ What you'll see: one synthetic image transformed in several ways. Some operations preserve the bar-orientation label; others, like a 90-degree rotation, may change orientation and should be treated carefully.

#### E2. Mini-batches and epochs

**Goal.** Shuffle synthetic data into mini-batches, show the batch timeline, and watch loss updates inside epochs.

```python
X_e2, y_e2 = make_two_blob_data(n=96, scale_second_feature=1.0, noise=0.70)  # create a small binary dataset for visible mini-batch updates.
mean_e2, std_e2 = standardize_fit(X_e2)  # fit normalization so optimization is stable.
Xn_e2 = standardize_apply(X_e2, mean_e2, std_e2)  # transform features before mini-batch training.
w_e2 = RNG.normal(0.0, 0.05, size=2)  # initialize two logistic-regression weights.
b_e2 = 0.0  # initialize the scalar bias.
lr_e2 = 0.25  # choose a learning rate large enough to show visible progress.
batch_size_e2 = 16  # choose a mini-batch size that creates six batches per epoch.
batch_losses_e2 = []  # store loss after each mini-batch update.
batch_ids_e2 = []  # store which batch number each update came from.
epoch_ids_e2 = []  # store which epoch each update came from.
for epoch in range(3):  # run three epochs so the timeline shows repeated full passes.
    order = RNG.permutation(len(Xn_e2))  # shuffle indices at the start of each epoch.
    for batch_number, start in enumerate(range(0, len(Xn_e2), batch_size_e2)):  # iterate over mini-batches within the epoch.
        idx = order[start:start + batch_size_e2]  # select one mini-batch of shuffled examples.
        xb = Xn_e2[idx]  # gather mini-batch features.
        yb = y_e2[idx]  # gather mini-batch labels.
        probs = sigmoid(xb @ w_e2 + b_e2)  # run the forward pass for the current mini-batch.
        error = probs - yb  # compute the sigmoid-cross-entropy derivative with respect to logits.
        w_e2 = w_e2 - lr_e2 * (xb.T @ error / len(xb))  # update weights using the mini-batch gradient.
        b_e2 = b_e2 - lr_e2 * float(np.mean(error))  # update bias using the mini-batch gradient.
        batch_losses_e2.append(bce_loss(sigmoid(Xn_e2 @ w_e2 + b_e2), y_e2))  # record full-data loss after this update.
        batch_ids_e2.append(batch_number)  # record the within-epoch batch number.
        epoch_ids_e2.append(epoch)  # record the epoch number for timeline coloring.
plt.figure(figsize=(8.0, 3.0))  # create a batch-timeline figure.
plt.scatter(range(len(batch_losses_e2)), epoch_ids_e2, c=batch_ids_e2, cmap="viridis", s=90)  # show update order colored by batch id and positioned by epoch.
plt.yticks([0, 1, 2], ["epoch 1", "epoch 2", "epoch 3"])  # label epoch rows.
plt.xlabel("mini-batch update number")  # label each update along the horizontal axis.
plt.title("E2: shuffled mini-batches across epochs")  # title the process visualization.
plt.colorbar(label="batch number within epoch")  # explain the color encoding.
plt.show()  # render the timeline plot.
```

▶ What you'll see: each epoch contains multiple mini-batch updates, and shuffling changes which examples appear together before the next pass through the full dataset.

```python
plt.figure(figsize=(7.0, 4.0))  # create a loss-update plot.
plt.plot(batch_losses_e2, marker="o", color="tab:green")  # plot full-data loss after every mini-batch update.
plt.xlabel("mini-batch update")  # label the update axis.
plt.ylabel("full-data BCE loss")  # label the loss axis.
plt.title("E2: loss can improve before an epoch finishes")  # title the result visualization.
plt.show()  # render the loss curve.
```

▶ What you'll see: loss is updated after each mini-batch, not only at epoch boundaries.

#### E3. Cross-entropy by hand and in code

**Goal.** Compare per-example cross-entropy values for several predictions and labels, then view the loss surface over $z$.

```python
z_e3 = np.array([0.05, 0.20, 0.50, 0.80, 0.95])  # create a range of predicted probabilities.
y_e3 = np.array([0, 0, 1, 1, 1])  # create labels so some predictions are good and one is uncertain.
losses_e3 = -(y_e3 * np.log(z_e3) + (1.0 - y_e3) * np.log(1.0 - z_e3))  # compute per-example BCE values.
print(" prediction | label | loss")  # print a small table header.
for z_value, y_value, loss_value in zip(z_e3, y_e3, losses_e3):  # iterate through aligned prediction-label-loss triples.
    print(f"    {z_value:5.2f}   |  {int(y_value)}    | {loss_value:6.3f}")  # print one readable row per example.
print(f"mean loss = {losses_e3.mean():.3f}")  # print the average loss used during training.
z_grid_e3 = np.linspace(0.01, 0.99, 250)  # create a dense probability grid.
loss_y0_e3 = -np.log(1.0 - z_grid_e3)  # compute the loss curve when the true label is zero.
loss_y1_e3 = -np.log(z_grid_e3)  # compute the loss curve when the true label is one.
plt.figure(figsize=(7.0, 4.2))  # create a probability-loss figure.
plt.plot(z_grid_e3, loss_y0_e3, label="y=0", color="tab:blue")  # draw the class-zero loss curve.
plt.plot(z_grid_e3, loss_y1_e3, label="y=1", color="tab:red")  # draw the class-one loss curve.
plt.scatter(z_e3, losses_e3, c=y_e3, cmap="bwr", edgecolors="black", s=80, label="examples")  # overlay the example losses.
plt.xlabel("predicted probability z")  # label the probability axis.
plt.ylabel("binary cross-entropy")  # label the loss axis.
plt.title("E3: cross-entropy punishes confident wrong predictions")  # title the result visualization.
plt.legend()  # show curve labels.
plt.show()  # render the plot.
```

▶ What you'll see: the loss is small when the prediction is confidently correct and large when it is confidently wrong.

#### E4. One-layer training loop from scratch

**Goal.** Implement forward → loss → backward → update for logistic regression on NumPy two-moons data, then inspect the linear boundary and loss curve.

```python
X_e4, y_e4 = make_moons_np(n=300, noise=0.12)  # generate the planned make_moons-style binary data without internet or sklearn.
Xtr_e4, ytr_e4, Xva_e4, yva_e4 = train_val_split(X_e4, y_e4, val_fraction=0.25)  # split data so the loop reports validation behavior.
model_e4 = train_logistic(Xtr_e4, ytr_e4, Xva_e4, yva_e4, lr=0.35, epochs=80, batch_size=32, normalize=True)  # train a one-layer model from scratch.
print(f"final train loss = {model_e4['history']['loss'][-1]:.3f}")  # print the final training loss.
print(f"final validation loss = {model_e4['history']['val_loss'][-1]:.3f}")  # print the final validation loss.
print(f"final validation accuracy = {model_e4['history']['val_acc'][-1]:.3f}")  # print validation accuracy for the linear model.
plot_loss_curves({"one-layer": model_e4["history"]}, "E4: from-scratch training loop on two moons")  # plot the train and validation loss curves.
```

▶ What you'll see: loss decreases, but the validation accuracy is limited because a one-layer linear boundary cannot perfectly separate curved moons.

```python
plot_decision_boundary(model_e4, X_e4, y_e4, "E4: learned linear boundary on nonlinear data")  # visualize the learned probability field and decision line.
```

▶ What you'll see: a straight decision boundary cuts through crescent-shaped classes, illustrating that a correct training loop does not guarantee enough model capacity.

#### E5. Batch norm on activations

**Goal.** Normalize synthetic hidden activations with the batch-normalization formula and verify the batch mean and variance.

```python
activations_e5 = RNG.normal(loc=[-3.0, 0.5, 5.0], scale=[0.5, 2.0, 4.0], size=(128, 3))  # create three hidden units with very different activation scales.
gamma_e5 = np.array([1.5, 0.8, 1.0])  # choose learned scale parameters for the three units.
beta_e5 = np.array([0.0, 0.5, -0.5])  # choose learned shift parameters for the three units.
mu_e5 = activations_e5.mean(axis=0, keepdims=True)  # compute batch means per hidden unit.
var_e5 = activations_e5.var(axis=0, keepdims=True)  # compute batch variances per hidden unit.
normalized_e5 = (activations_e5 - mu_e5) / np.sqrt(var_e5 + EPS)  # perform the normalization part of batch norm.
bn_e5 = gamma_e5 * normalized_e5 + beta_e5  # apply learned scale gamma and shift beta.
print("before means:", np.round(activations_e5.mean(axis=0), 3))  # print activation means before batch norm.
print("before variances:", np.round(activations_e5.var(axis=0), 3))  # print activation variances before batch norm.
print("after means:", np.round(bn_e5.mean(axis=0), 3))  # print activation means after gamma and beta.
print("after variances:", np.round(bn_e5.var(axis=0), 3))  # print activation variances after gamma scaling.
fig, axes = plt.subplots(1, 2, figsize=(10.0, 3.8))  # create side-by-side histograms.
axes[0].hist(activations_e5, bins=22, label=["unit 1", "unit 2", "unit 3"], alpha=0.65)  # plot raw activation distributions.
axes[0].set_title("before batch norm")  # title the raw histogram.
axes[1].hist(bn_e5, bins=22, label=["unit 1", "unit 2", "unit 3"], alpha=0.65)  # plot normalized and shifted activation distributions.
axes[1].set_title("after batch norm")  # title the transformed histogram.
for ax in axes:  # apply shared axis formatting.
    ax.set_xlabel("activation value")  # label the activation axis.
    ax.set_ylabel("count")  # label histogram counts.
    ax.legend(fontsize=8)  # identify hidden units.
plt.suptitle("E5: batch normalization stabilizes activation scale")  # add a figure-level title.
plt.tight_layout()  # prevent labels from overlapping.
plt.show()  # render the histogram comparison.
```

▶ What you'll see: raw hidden units occupy very different ranges, while batch-normalized activations are recentered and rescaled according to gamma and beta.

### 🔴 Advanced Examples

#### A1. Augmentation improves generalization

**Goal.** Train on a small image-like dataset with and without label-preserving noise/brightness/contrast augmentation, then compare train and validation curves.

```python
images_a1, labels_a1 = make_image_dataset(n=180, size=12, label_rule="bar_orientation")  # create a small offline image-like classification dataset.
X_a1 = images_a1.reshape(len(images_a1), -1)  # flatten images so logistic regression can consume pixels as features.
Xtr_a1, ytr_a1, Xva_a1, yva_a1 = train_val_split(X_a1, labels_a1, val_fraction=0.35)  # create a relatively small training set and validation set.
def augment_flat_a1(xb):  # define label-preserving feature augmentation for flattened images.
    imgs = xb.reshape(len(xb), 12, 12)  # reshape flat vectors back into images for pixel operations.
    choice = RNG.integers(0, 4)  # choose one simple augmentation type for the whole mini-batch.
    if choice == 0:  # sometimes use a horizontal flip.
        imgs_aug = flip_horizontal(imgs)  # flip bars left-to-right while preserving orientation labels.
    elif choice == 1:  # sometimes use mild noise.
        imgs_aug = add_noise_images(imgs, amount=0.08)  # add small pixel noise to improve robustness.
    elif choice == 2:  # sometimes use brightness shift.
        imgs_aug = shift_brightness(imgs, shift=0.08)  # brighten the image slightly.
    else:  # otherwise use contrast change.
        imgs_aug = change_contrast(imgs, factor=1.2)  # increase contrast while preserving the label.
    return imgs_aug.reshape(len(xb), -1)  # flatten augmented images back into feature vectors.
plain_a1 = train_logistic(Xtr_a1, ytr_a1, Xva_a1, yva_a1, lr=0.45, epochs=70, batch_size=24, normalize=True)  # train without augmentation.
aug_a1 = train_logistic(Xtr_a1, ytr_a1, Xva_a1, yva_a1, lr=0.45, epochs=70, batch_size=24, normalize=True, augment_fn=augment_flat_a1)  # train with label-preserving augmentation.
print(f"plain validation accuracy = {plain_a1['history']['val_acc'][-1]:.3f}")  # print final validation accuracy without augmentation.
print(f"augmented validation accuracy = {aug_a1['history']['val_acc'][-1]:.3f}")  # print final validation accuracy with augmentation.
plot_image_grid([images_a1[0], flip_horizontal(images_a1[:1])[0], add_noise_images(images_a1[:1], 0.08)[0], change_contrast(images_a1[:1], 1.2)[0]], ["original", "flip", "noise", "contrast"], "A1: label-preserving augmentations used during training", columns=4)  # show the actual augmentations.
plt.show()  # render the augmentation examples.
```

▶ What you'll see: the montage shows the transformations injected into training mini-batches; they preserve the bar-orientation label.

```python
plot_loss_curves({"plain": plain_a1["history"], "augmented": aug_a1["history"]}, "A1: augmentation can improve validation behavior")  # compare training and validation curves.
```

▶ What you'll see: augmentation often slightly raises training loss but can improve validation accuracy or reduce the train-validation gap.

#### A2. Failure case — harmful augmentation

**Goal.** Show that vertical flips corrupt a top-vs-bottom image label rule, causing validation performance to drop.

```python
images_a2, labels_a2 = make_image_dataset(n=180, size=12, label_rule="top_bottom")  # create images where vertical position defines the class.
X_a2 = images_a2.reshape(len(images_a2), -1)  # flatten images into tabular pixel vectors.
Xtr_a2, ytr_a2, Xva_a2, yva_a2 = train_val_split(X_a2, labels_a2, val_fraction=0.35)  # split the dataset into train and validation subsets.
def harmful_flat_a2(xb):  # define an augmentation that violates the label-preservation rule.
    imgs = xb.reshape(len(xb), 12, 12)  # reshape flat vectors back into images.
    imgs_aug = flip_vertical(imgs)  # flip top patches to bottom patches and bottom patches to top patches.
    return imgs_aug.reshape(len(xb), -1)  # flatten the corrupted images back into vectors.
safe_a2 = train_logistic(Xtr_a2, ytr_a2, Xva_a2, yva_a2, lr=0.45, epochs=70, batch_size=24, normalize=True)  # train with no harmful augmentation.
harmful_a2 = train_logistic(Xtr_a2, ytr_a2, Xva_a2, yva_a2, lr=0.45, epochs=70, batch_size=24, normalize=True, augment_fn=harmful_flat_a2)  # train with label-corrupting vertical flips.
print(f"safe validation accuracy = {safe_a2['history']['val_acc'][-1]:.3f}")  # print validation accuracy for the safe pipeline.
print(f"harmful validation accuracy = {harmful_a2['history']['val_acc'][-1]:.3f}")  # print validation accuracy for the harmful pipeline.
plot_image_grid([images_a2[0], flip_vertical(images_a2[:1])[0], images_a2[1], flip_vertical(images_a2[1:2])[0]], [f"original label {labels_a2[0]}", "vertical flip", f"original label {labels_a2[1]}", "vertical flip"], "A2: vertical flips change the top-vs-bottom meaning", columns=4)  # show why the augmentation is harmful.
plt.show()  # render the harmful-augmentation examples.
```

▶ What you'll see: the transformed image looks like the opposite class even though the training label was not changed.

```python
plot_loss_curves({"safe": safe_a2["history"], "harmful flip": harmful_a2["history"]}, "A2: harmful augmentation degrades validation loss")  # compare safe and harmful training curves.
```

▶ What you'll see: the harmful pipeline receives contradictory evidence, so its validation curve is worse than the safe pipeline.

#### A3. Batch norm allows higher learning rate

**Goal.** Train a tiny two-layer neural network with and without batch normalization on hidden activations and compare stability at a high learning rate.

```python
def train_tiny_mlp(X_train, y_train, X_val, y_val, lr=0.8, epochs=80, batch_size=32, use_bn=False):  # define a two-layer tanh network with optional batch norm.
    mean, std = standardize_fit(X_train)  # fit input normalization so the comparison focuses on hidden activations.
    Xtr = standardize_apply(X_train, mean, std)  # normalize training features.
    Xva = standardize_apply(X_val, mean, std)  # normalize validation features using training statistics.
    hidden = 8  # choose a small hidden layer so the network remains CPU-friendly.
    W1 = RNG.normal(0.0, 0.7, size=(Xtr.shape[1], hidden))  # initialize first-layer weights deliberately large enough to stress activations.
    b1 = np.zeros(hidden)  # initialize first-layer biases at zero.
    W2 = RNG.normal(0.0, 0.2, size=hidden)  # initialize output weights.
    b2 = 0.0  # initialize output bias.
    history = {"loss": [], "val_loss": [], "acc": [], "val_acc": [], "grad_norm": []}  # allocate diagnostic curves.
    for epoch in range(epochs):  # repeat training epochs.
        order = RNG.permutation(len(Xtr))  # shuffle examples each epoch.
        norms = []  # store gradient norms for this epoch.
        for start in range(0, len(Xtr), batch_size):  # iterate over mini-batches.
            idx = order[start:start + batch_size]  # select the current mini-batch indices.
            xb = Xtr[idx]  # gather mini-batch inputs.
            yb = y_train[idx]  # gather mini-batch labels.
            h_pre = xb @ W1 + b1  # compute hidden pre-activations.
            if use_bn:  # optionally normalize hidden pre-activations within the mini-batch.
                h_mu = h_pre.mean(axis=0, keepdims=True)  # compute mini-batch hidden means.
                h_std = h_pre.std(axis=0, keepdims=True) + EPS  # compute mini-batch hidden standard deviations.
                h_norm = (h_pre - h_mu) / h_std  # normalize hidden pre-activations.
            else:  # otherwise pass raw hidden pre-activations forward.
                h_norm = h_pre  # keep hidden activations unnormalized.
            h = np.tanh(h_norm)  # apply tanh nonlinearity after optional normalization.
            probs = sigmoid(h @ W2 + b2)  # compute output probabilities.
            error = probs - yb  # compute output derivative for sigmoid plus cross-entropy.
            grad_W2 = h.T @ error / len(xb)  # compute output-weight gradients.
            grad_b2 = float(np.mean(error))  # compute output-bias gradient.
            dh = np.outer(error, W2) * (1.0 - h ** 2)  # backpropagate through output weights and tanh.
            if use_bn:  # use a simplified batch-norm backward path sufficient for this demonstration.
                dh = dh / h_std  # scale gradients by the normalization standard deviation.
            grad_W1 = xb.T @ dh / len(xb)  # compute first-layer weight gradients.
            grad_b1 = dh.mean(axis=0)  # compute first-layer bias gradients.
            W2 = W2 - lr * grad_W2  # update output weights.
            b2 = b2 - lr * grad_b2  # update output bias.
            W1 = W1 - lr * grad_W1  # update first-layer weights.
            b1 = b1 - lr * grad_b1  # update first-layer bias.
            norms.append(float(np.sqrt(np.sum(grad_W1 ** 2) + np.sum(grad_W2 ** 2))))  # store combined gradient norm.
        def forward_eval(Xeval):  # define an evaluation forward pass with stored batch-style normalization by current data.
            hp = Xeval @ W1 + b1  # compute hidden pre-activations for evaluation data.
            if use_bn:  # normalize evaluation hidden activations for the demonstration model.
                hp = (hp - hp.mean(axis=0, keepdims=True)) / (hp.std(axis=0, keepdims=True) + EPS)  # apply evaluation-batch normalization.
            return sigmoid(np.tanh(hp) @ W2 + b2)  # return output probabilities.
        tr_probs = forward_eval(Xtr)  # compute training probabilities after the epoch.
        va_probs = forward_eval(Xva)  # compute validation probabilities after the epoch.
        history["loss"].append(bce_loss(tr_probs, y_train))  # store training loss.
        history["val_loss"].append(bce_loss(va_probs, y_val))  # store validation loss.
        history["acc"].append(accuracy(tr_probs, y_train))  # store training accuracy.
        history["val_acc"].append(accuracy(va_probs, y_val))  # store validation accuracy.
        history["grad_norm"].append(float(np.mean(norms)))  # store average gradient norm.
    return history  # return the recorded curves.
X_a3, y_a3 = make_two_blob_data(n=300, scale_second_feature=8.0, noise=0.90)  # create data with moderately imbalanced feature scale.
Xtr_a3, ytr_a3, Xva_a3, yva_a3 = train_val_split(X_a3, y_a3, val_fraction=0.25)  # split the data for validation diagnostics.
no_bn_a3 = train_tiny_mlp(Xtr_a3, ytr_a3, Xva_a3, yva_a3, lr=0.8, epochs=80, batch_size=32, use_bn=False)  # train without hidden batch normalization.
with_bn_a3 = train_tiny_mlp(Xtr_a3, ytr_a3, Xva_a3, yva_a3, lr=0.8, epochs=80, batch_size=32, use_bn=True)  # train with hidden batch normalization.
plot_loss_curves({"no BN": no_bn_a3, "with BN": with_bn_a3}, "A3: batch norm at a high learning rate")  # compare stability and convergence.
```

▶ What you'll see: the batch-normalized run usually has smoother or faster loss reduction at the high learning rate.

```python
plt.figure(figsize=(7.0, 4.0))  # create a gradient-norm diagnostic figure.
plt.plot(no_bn_a3["grad_norm"], label="no BN", color="tab:red")  # plot gradient norms without batch norm.
plt.plot(with_bn_a3["grad_norm"], label="with BN", color="tab:blue")  # plot gradient norms with batch norm.
plt.xlabel("epoch")  # label the epoch axis.
plt.ylabel("mean mini-batch gradient norm")  # label the diagnostic axis.
plt.title("A3: batch norm changes gradient scale")  # title the diagnostic plot.
plt.legend()  # identify the two runs.
plt.show()  # render the gradient-norm plot.
```

▶ What you'll see: hidden normalization changes gradient magnitudes, which is one reason larger learning rates can become easier to manage.

#### A4. Full training loop with diagnostics

**Goal.** Run a complete mini-batch training loop from scratch on toy data, tracking loss, accuracy, gradient norms, learning rate, and a confusion matrix.

```python
X_a4, y_a4 = make_two_blob_data(n=360, scale_second_feature=1.0, noise=0.95)  # create a noisy but mostly linear binary dataset.
Xtr_a4, ytr_a4, Xva_a4, yva_a4 = train_val_split(X_a4, y_a4, val_fraction=0.25)  # split data into training and validation sets.
model_a4 = train_logistic(Xtr_a4, ytr_a4, Xva_a4, yva_a4, lr=0.28, epochs=100, batch_size=24, normalize=True)  # run the full mini-batch loop from scratch.
val_probs_a4 = predict_logistic(model_a4, Xva_a4)  # compute validation probabilities for final diagnostics.
val_pred_a4 = (val_probs_a4 >= 0.5).astype(int)  # convert probabilities into class predictions.
conf_a4 = np.zeros((2, 2), dtype=int)  # allocate a 2-by-2 confusion matrix.
for true_label, pred_label in zip(yva_a4.astype(int), val_pred_a4.astype(int)):  # iterate through validation outcomes.
    conf_a4[true_label, pred_label] += 1  # increment the matching confusion-matrix cell.
fig, axes = plt.subplots(2, 2, figsize=(10.0, 8.0))  # create a compact diagnostics dashboard.
axes[0, 0].plot(model_a4["history"]["loss"], label="train")  # plot training loss.
axes[0, 0].plot(model_a4["history"]["val_loss"], label="validation")  # plot validation loss.
axes[0, 0].set_title("loss")  # title the loss panel.
axes[0, 0].legend()  # show curve labels.
axes[0, 1].plot(model_a4["history"]["acc"], label="train")  # plot training accuracy.
axes[0, 1].plot(model_a4["history"]["val_acc"], label="validation")  # plot validation accuracy.
axes[0, 1].set_title("accuracy")  # title the accuracy panel.
axes[0, 1].legend()  # show curve labels.
axes[1, 0].plot(model_a4["history"]["grad_norm"], color="tab:purple")  # plot average gradient norm per epoch.
axes[1, 0].set_title("gradient norm")  # title the gradient panel.
im_a4 = axes[1, 1].imshow(conf_a4, cmap="Blues")  # display the confusion matrix as a heatmap.
axes[1, 1].set_title("validation confusion matrix")  # title the confusion panel.
axes[1, 1].set_xlabel("predicted")  # label predicted classes.
axes[1, 1].set_ylabel("true")  # label true classes.
for row in range(2):  # annotate each confusion-matrix row.
    for col in range(2):  # annotate each confusion-matrix column.
        axes[1, 1].text(col, row, str(conf_a4[row, col]), ha="center", va="center", color="black")  # write the count in the cell.
plt.colorbar(im_a4, ax=axes[1, 1], fraction=0.046)  # add a colorbar for the heatmap counts.
plt.suptitle("A4: full training-loop diagnostic dashboard")  # add a dashboard title.
plt.tight_layout()  # avoid subplot overlap.
plt.show()  # render the dashboard.
```

▶ What you'll see: a complete training dashboard with optimization, generalization, gradient, and classification diagnostics.

```python
plot_decision_boundary(model_a4, np.vstack([Xtr_a4, Xva_a4]), np.concatenate([ytr_a4, yva_a4]), "A4: final decision boundary after mini-batch training")  # show the model learned by the full loop.
```

▶ What you'll see: the final probability field and decision line summarize what all mini-batch updates learned.

#### A5. End-to-end pipeline capstone and failure case

**Goal.** Compare the same pipeline on unnormalized versus normalized features, showing that unnormalized features can slow or destabilize training.

```python
X_a5, y_a5 = make_two_blob_data(n=340, scale_second_feature=90.0, noise=0.75)  # create an intentionally unnormalized feature-scale failure case.
Xtr_a5, ytr_a5, Xva_a5, yva_a5 = train_val_split(X_a5, y_a5, val_fraction=0.25)  # split the scaled data into train and validation sets.
raw_a5 = train_logistic(Xtr_a5, ytr_a5, Xva_a5, yva_a5, lr=0.0008, epochs=90, batch_size=32, normalize=False)  # train on raw features with a tiny learning rate to avoid divergence.
norm_a5 = train_logistic(Xtr_a5, ytr_a5, Xva_a5, yva_a5, lr=0.30, epochs=90, batch_size=32, normalize=True)  # train on normalized features with a practical learning rate.
print(f"raw final validation loss = {raw_a5['history']['val_loss'][-1]:.3f}")  # print the raw-feature validation loss.
print(f"normalized final validation loss = {norm_a5['history']['val_loss'][-1]:.3f}")  # print the normalized-feature validation loss.
print(f"raw final validation accuracy = {raw_a5['history']['val_acc'][-1]:.3f}")  # print the raw-feature validation accuracy.
print(f"normalized final validation accuracy = {norm_a5['history']['val_acc'][-1]:.3f}")  # print the normalized-feature validation accuracy.
plot_loss_curves({"raw unnormalized": raw_a5["history"], "normalized": norm_a5["history"]}, "A5: normalization changes trainability")  # compare the two training curves.
```

▶ What you'll see: the unnormalized run needs a tiny learning rate and often learns slowly, while normalized features support a much larger stable step size.

```python
fig, axes = plt.subplots(1, 2, figsize=(10.0, 4.0))  # create side-by-side feature-scale plots.
axes[0].scatter(X_a5[:, 0], X_a5[:, 1], c=y_a5, cmap="bwr", s=28, edgecolors="white", linewidths=0.3)  # plot raw scaled features.
axes[0].set_title("raw feature scale")  # title the raw feature view.
axes[0].set_xlabel("feature 1")  # label the raw first feature.
axes[0].set_ylabel("feature 2 multiplied by 90")  # label the inflated second feature.
mean_a5, std_a5 = standardize_fit(X_a5)  # fit normalization statistics for visualization.
Xn_a5 = standardize_apply(X_a5, mean_a5, std_a5)  # normalize both features for visualization.
axes[1].scatter(Xn_a5[:, 0], Xn_a5[:, 1], c=y_a5, cmap="bwr", s=28, edgecolors="white", linewidths=0.3)  # plot normalized features.
axes[1].set_title("normalized feature scale")  # title the normalized feature view.
axes[1].set_xlabel("normalized feature 1")  # label the normalized first feature.
axes[1].set_ylabel("normalized feature 2")  # label the normalized second feature.
plt.suptitle("A5: the same data geometry becomes optimizer-friendly after scaling")  # add a figure title.
plt.tight_layout()  # prevent overlap between labels and titles.
plt.show()  # render the side-by-side comparison.
```

▶ What you'll see: raw axes are badly mismatched, while normalized features occupy comparable ranges; the optimizer sees the second view.

### Interactive Experiment

Use the sliders to change mini-batch size and learning rate. The function retrains a small model and redraws the loss curve, so you can see noisy small-batch updates, slow tiny learning rates, and unstable large learning rates.

```python
def interactive_training_experiment(batch_size=24, learning_rate=0.25):  # define the live experiment controlled by sliders.
    X_i, y_i = make_two_blob_data(n=220, scale_second_feature=12.0, noise=0.85)  # generate a fresh but reproducible-style binary dataset.
    Xtr_i, ytr_i, Xva_i, yva_i = train_val_split(X_i, y_i, val_fraction=0.25)  # split the data for validation loss.
    model_i = train_logistic(Xtr_i, ytr_i, Xva_i, yva_i, lr=learning_rate, epochs=60, batch_size=batch_size, normalize=True)  # train with slider-selected hyperparameters.
    plt.figure(figsize=(7.2, 4.2))  # create the live loss-curve figure.
    plt.plot(model_i["history"]["loss"], label="train loss", color="tab:blue")  # plot training loss for the chosen settings.
    plt.plot(model_i["history"]["val_loss"], label="validation loss", color="tab:orange")  # plot validation loss for the chosen settings.
    plt.xlabel("epoch")  # label the epoch axis.
    plt.ylabel("binary cross-entropy")  # label the loss axis.
    plt.title(f"batch size = {batch_size}, learning rate = {learning_rate:.3f}")  # title the plot with current slider values.
    plt.legend()  # show which curve is train and validation.
    plt.show()  # render the live figure.
    print(f"final validation accuracy = {model_i['history']['val_acc'][-1]:.3f}")  # print the final validation accuracy for the chosen settings.
interact(interactive_training_experiment, batch_size=IntSlider(value=24, min=4, max=80, step=4, description="batch size"), learning_rate=FloatSlider(value=0.25, min=0.02, max=0.90, step=0.02, description="learning rate", readout_format=".2f"))  # create the interactive sliders and bind them to the experiment.
```

▶ What you'll see: changing batch size changes gradient noise and update frequency; changing learning rate changes whether loss decreases slowly, quickly, or unstably.
