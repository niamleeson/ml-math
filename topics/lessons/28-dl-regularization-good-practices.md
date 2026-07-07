# DL Regularization & Good Practices
> **Source:** CS 230 · **Category:** Regularization · **Type:** ⚖️ Both · [↑ Full reference](../../ai-ml-cheatsheets.md)
> 📓 The coded examples form a runnable notebook section; an .ipynb will be generated.

## 0. Step-by-Step Worked Example — Start Here (Beginner Friendly)

> 🧑‍🎓 **New to this topic? Start here.** This is a gentle, fully runnable walkthrough that
> builds up *every* idea in this lesson one tiny step at a time. Each step **prints** the
> numbers it computes and **draws a picture** so you can *see* what is happening. Run the
> cells in order from top to bottom. Nothing here needs the internet or any downloaded data.

**What we will build, step by step:**
1. **Weight penalties: L1, L2, and elastic net** — charge large weights and compare shrinkage.
2. **Dropout** — randomly remove activations while preserving expected scale.
3. **Early stopping** — choose the best validation checkpoint instead of the final epoch.
4. **Batch normalization** — normalize a mini-batch, then learn scale and shift.
5. **Data augmentation** — add label-preserving variation to the training set.
6. **Good-practice sanity checks** — overfit a tiny batch and gradient-check one derivative.

### Step 0 — Set up our tools

We import NumPy (arrays + gradients) and Matplotlib (pictures). We fix a random **seed** so the
dropout masks and augmentation noise are reproducible. We also define a tiny `log()` helper so
every step prints clearly labeled numbers.

```python
import numpy as np                       # NumPy: arrays, random masks, penalties, and gradient checks.
import matplotlib.pyplot as plt          # Matplotlib: draw regularization diagnostics and sanity-check curves.

np.random.seed(0)                         # Fix the seed so every run prints the SAME numbers.
plt.rcParams["figure.figsize"] = (7, 4)   # A comfortable default plot size.

def log(label, value):                    # A tiny logger so each printed line explains itself.
    print(f"[{label}] {value}")           # Format is: [what this is] the value.

log("setup", "tools ready — NumPy + Matplotlib imported, seed fixed to 0")  # Confirm setup ran.
```
▶ What you'll see: one line confirming the tools are ready.

### Step 1 — Weight penalties: L1, L2, and elastic net

Regularization can add a cost to the training objective so large or unnecessary weights become
expensive. $L_2$ shrinks smoothly, $L_1$ can push small weights to exactly zero, and elastic net
mixes both effects.

```python
theta_demo = np.array([2.5, -0.8, 0.2])  # Start with three toy weights: large, medium, and small.
data_loss_demo = 1.4  # Pretend the data-fitting loss is already computed.
lambda_demo = 0.25  # Regularization strength.
elastic_alpha_demo = 0.5  # Mix half L1-style and half L2-style penalty.
eta_demo = 0.3  # Learning rate for one shrinkage-only update.
l1_norm_demo = np.sum(np.abs(theta_demo))  # Compute ||theta||_1.
l2_squared_demo = np.sum(theta_demo ** 2)  # Compute ||theta||_2^2.
l1_objective_demo = data_loss_demo + lambda_demo * l1_norm_demo  # Add the L1 penalty to the data loss.
l2_objective_demo = data_loss_demo + lambda_demo * l2_squared_demo  # Add the L2 penalty to the data loss.
elastic_objective_demo = data_loss_demo + lambda_demo * ((1.0 - elastic_alpha_demo) * l1_norm_demo + elastic_alpha_demo * l2_squared_demo)  # Add the mixed penalty.
l2_grad_demo = 2.0 * lambda_demo * theta_demo  # L2 contributes gradient 2 lambda theta.
theta_l2_step_demo = theta_demo - eta_demo * l2_grad_demo  # L2-only step smoothly shrinks every coordinate.
theta_l1_soft_demo = np.sign(theta_demo) * np.maximum(np.abs(theta_demo) - eta_demo * lambda_demo, 0.0)  # L1-style soft thresholding can create zeros.
log("L1 norm and L2 squared", (round(float(l1_norm_demo), 3), round(float(l2_squared_demo), 3)))  # Print penalty inputs.
log("objectives L1/L2/elastic", np.round([l1_objective_demo, l2_objective_demo, elastic_objective_demo], 3))  # Print total objectives.
log("L2 gradient", np.round(l2_grad_demo, 3))  # Print shrinkage gradient.
log("weights after L2 shrink", np.round(theta_l2_step_demo, 3))  # Print smooth shrinkage result.
log("weights after L1 threshold", np.round(theta_l1_soft_demo, 3))  # Print sparsity-friendly result.

fig_demo, axes_demo = plt.subplots(1, 2, figsize=(10.5, 4))  # Create objective and coefficient panels.
axes_demo[0].bar(["data", "L1", "L2", "elastic"], [data_loss_demo, l1_objective_demo, l2_objective_demo, elastic_objective_demo], color=["gray", "tab:orange", "tab:blue", "tab:green"])  # Compare objective values.
axes_demo[0].set_ylabel("objective value")  # Label objective scale.
axes_demo[0].set_title("penalties add to data loss")  # Title objective panel.
positions_demo = np.arange(theta_demo.size)  # One x-position per weight.
axes_demo[1].bar(positions_demo - 0.22, theta_demo, width=0.22, label="before")  # Plot starting weights.
axes_demo[1].bar(positions_demo, theta_l2_step_demo, width=0.22, label="L2 step")  # Plot L2-shrunken weights.
axes_demo[1].bar(positions_demo + 0.22, theta_l1_soft_demo, width=0.22, label="L1 threshold")  # Plot L1-thresholded weights.
axes_demo[1].axhline(0.0, color="black", linewidth=0.8)  # Mark zero for sparsity.
axes_demo[1].set_xticks(positions_demo, ["w1", "w2", "w3"])  # Label weight coordinates.
axes_demo[1].set_title("shrinkage versus sparsity")  # Title coefficient panel.
axes_demo[1].legend(fontsize=8)  # Identify bars.
plt.tight_layout()  # Keep labels readable.
plt.show()  # Render penalty visuals.
```
▶ What you'll see: all penalties raise the objective for large weights; L2 shrinks smoothly, while L1-style thresholding can drive the small weight to zero.

### Step 2 — Dropout: random sub-networks with preserved scale

Dropout samples a binary mask and zeros some activations during training. Inverted dropout divides
surviving activations by the keep probability, so the average activation stays near its original
scale.

```python
activation_demo = np.array([1.0, 2.0, 0.5, 3.0, 1.5, 2.5])  # Hidden activations before dropout.
keep_prob_demo = 0.6  # Keep each unit with probability q.
mask_demo = (np.random.rand(activation_demo.size) < keep_prob_demo).astype(float)  # Sample one dropout mask.
dropped_demo = mask_demo * activation_demo / keep_prob_demo  # Apply inverted dropout.
num_masks_demo = 4000  # Use many masks to estimate the expectation.
masks_demo = (np.random.rand(num_masks_demo, activation_demo.size) < keep_prob_demo).astype(float)  # Sample many masks.
dropped_many_demo = masks_demo * activation_demo / keep_prob_demo  # Apply inverted dropout to every mask.
mean_after_dropout_demo = dropped_many_demo.mean(axis=0)  # Estimate expected activation after dropout.
log("activation", activation_demo)  # Print original activations.
log("one dropout mask", mask_demo)  # Print kept and dropped units.
log("one dropout output", np.round(dropped_demo, 3))  # Print one training-time activation.
log("mean after many masks", np.round(mean_after_dropout_demo, 3))  # Show expectation is preserved.
log("absolute expectation error", np.round(np.abs(mean_after_dropout_demo - activation_demo), 3))  # Print Monte Carlo error.

fig_demo, axes_demo = plt.subplots(1, 2, figsize=(10.5, 4))  # Create bar and mask panels.
positions_demo = np.arange(activation_demo.size)  # One x-position per unit.
axes_demo[0].bar(positions_demo - 0.18, activation_demo, width=0.36, label="original")  # Plot original activations.
axes_demo[0].bar(positions_demo + 0.18, mean_after_dropout_demo, width=0.36, label="mean after dropout")  # Plot average dropout output.
axes_demo[0].set_xlabel("hidden unit")  # Label unit index.
axes_demo[0].set_ylabel("activation")  # Label activation value.
axes_demo[0].set_title("inverted dropout preserves expected scale")  # Title expectation panel.
axes_demo[0].legend(fontsize=8)  # Identify bars.
image_demo = axes_demo[1].imshow(masks_demo[:8], cmap="Greys", aspect="auto", vmin=0.0, vmax=1.0)  # Show several sampled masks.
axes_demo[1].set_xlabel("hidden unit")  # Label mask columns.
axes_demo[1].set_ylabel("training step")  # Label mask rows.
axes_demo[1].set_title("different sub-network each step")  # Title mask panel.
fig_demo.colorbar(image_demo, ax=axes_demo[1], label="kept = 1")  # Add mask legend.
plt.tight_layout()  # Keep panels readable.
plt.show()  # Render dropout visuals.
```
▶ What you'll see: each mask drops a different subset of units, but the average over many inverted-dropout masks nearly matches the original activations.

### Step 3 — Early stopping: keep the best validation checkpoint

Training loss can keep falling after validation loss has started to rise. Early stopping watches
validation loss and restores a checkpoint near the best epoch instead of trusting the final epoch.

```python
epochs_demo = np.arange(1, 16)  # Epoch numbers.
train_loss_demo = 1.1 * np.exp(-0.18 * epochs_demo) + 0.08  # Smoothly decreasing training loss.
val_loss_demo = np.array([0.95, 0.78, 0.63, 0.52, 0.45, 0.41, 0.39, 0.40, 0.43, 0.47, 0.52, 0.58, 0.65, 0.73, 0.82])  # Validation loss that overfits later.
best_index_demo = int(np.argmin(val_loss_demo))  # Find lowest validation loss.
best_epoch_demo = int(epochs_demo[best_index_demo])  # Convert index to epoch number.
patience_demo = 2  # Stop after two epochs without improvement.
stop_epoch_demo = int(min(epochs_demo[-1], best_epoch_demo + patience_demo))  # Demonstration stopping epoch.
log("best validation epoch", best_epoch_demo)  # Print selected checkpoint.
log("best validation loss", round(float(val_loss_demo[best_index_demo]), 3))  # Print best validation value.
log("final validation loss", round(float(val_loss_demo[-1]), 3))  # Print worse final value.
log("patience stop epoch", stop_epoch_demo)  # Print when patience would stop.

plt.plot(epochs_demo, train_loss_demo, marker="o", label="train loss")  # Draw training curve.
plt.plot(epochs_demo, val_loss_demo, marker="o", label="validation loss")  # Draw validation curve.
plt.axvline(best_epoch_demo, color="green", linestyle="--", label=f"best epoch {best_epoch_demo}")  # Mark best checkpoint.
plt.axvline(stop_epoch_demo, color="red", linestyle=":", label=f"stop epoch {stop_epoch_demo}")  # Mark patience stop.
plt.scatter([best_epoch_demo], [val_loss_demo[best_index_demo]], s=90, color="green", zorder=3)  # Highlight validation minimum.
plt.xlabel("epoch")  # Label epoch axis.
plt.ylabel("loss")  # Label loss axis.
plt.title("Early stopping chooses validation-best weights")  # Explain the plot.
plt.legend()  # Show curve and checkpoint labels.
plt.show()  # Render early-stopping plot.
```
▶ What you'll see: training loss keeps decreasing, but validation loss bottoms out and rises; early stopping chooses the bottom instead of the final epoch.

### Step 4 — Batch normalization: normalize, then scale and shift

Batch normalization computes a mini-batch mean and variance, normalizes activations, then applies
learned parameters $\gamma$ and $\beta$. This stabilizes scale without forcing the network to keep
mean 0 and variance 1 forever.

```python
z_batch_demo = np.array([8.0, 10.0, 9.0, 12.0, 11.0, 7.0, 13.0, 10.5])  # One mini-batch of pre-activations.
mu_bn_demo = z_batch_demo.mean()  # Compute batch mean.
var_bn_demo = np.mean((z_batch_demo - mu_bn_demo) ** 2)  # Compute batch variance.
eps_bn_demo = 1e-5  # Add epsilon to avoid division by zero.
z_hat_bn_demo = (z_batch_demo - mu_bn_demo) / np.sqrt(var_bn_demo + eps_bn_demo)  # Normalize to near mean 0 and std 1.
gamma_bn_demo = 1.4  # Learned scale parameter.
beta_bn_demo = -0.3  # Learned shift parameter.
z_tilde_bn_demo = gamma_bn_demo * z_hat_bn_demo + beta_bn_demo  # Apply learned scale and shift.
log("batch mean", round(float(mu_bn_demo), 3))  # Print mean.
log("batch variance", round(float(var_bn_demo), 3))  # Print variance.
log("z_hat mean/std", (round(float(z_hat_bn_demo.mean()), 3), round(float(z_hat_bn_demo.std()), 3)))  # Verify normalization.
log("z_tilde mean/std", (round(float(z_tilde_bn_demo.mean()), 3), round(float(z_tilde_bn_demo.std()), 3)))  # Show gamma and beta effect.
log("first normalized values", np.round(z_hat_bn_demo[:4], 3))  # Print a few normalized activations.

plt.hist(z_batch_demo, bins=6, alpha=0.55, label="raw z")  # Plot raw pre-activations.
plt.hist(z_hat_bn_demo, bins=6, alpha=0.55, label="normalized z_hat")  # Plot normalized values.
plt.hist(z_tilde_bn_demo, bins=6, alpha=0.55, label="gamma zhat + beta")  # Plot final batch-norm outputs.
plt.xlabel("activation value")  # Label value axis.
plt.ylabel("count")  # Label histogram count.
plt.title("Batch norm stabilizes and then learns activation scale")  # Explain the plot.
plt.legend()  # Identify distributions.
plt.show()  # Render batch-norm histograms.
```
▶ What you'll see: raw activations sit around a large positive mean; normalized values center near 0; learned scale and shift move them to a trainable range.

### Step 5 — Data augmentation: label-preserving variation

Augmentation expands the training distribution with transformations that should not change the
label. Here, small jitter moves points within the same class neighborhood rather than across the
class boundary.

```python
X_aug_demo = np.array([[0.0, 0.2], [0.2, -0.1], [0.4, 0.1], [2.0, 2.1], [2.2, 1.9], [1.8, 2.2]])  # Two tiny labeled clusters.
y_aug_demo = np.array([0, 0, 0, 1, 1, 1])  # Cluster labels.
noise_aug_demo = 0.12 * np.random.randn(*X_aug_demo.shape)  # Small Gaussian jitter.
X_jitter_demo = X_aug_demo + noise_aug_demo  # Augmented points near originals.
y_jitter_demo = y_aug_demo.copy()  # Labels stay unchanged.
X_combined_demo = np.vstack([X_aug_demo, X_jitter_demo])  # Combine original and augmented inputs.
y_combined_demo = np.concatenate([y_aug_demo, y_jitter_demo])  # Combine labels.
log("original size", X_aug_demo.shape[0])  # Print original sample count.
log("augmented size", X_combined_demo.shape[0])  # Print expanded sample count.
log("labels preserved", bool(np.all(y_jitter_demo == y_aug_demo)))  # Verify labels were not changed.
log("first original vs jittered", (np.round(X_aug_demo[0], 3), np.round(X_jitter_demo[0], 3)))  # Show one pair.

plt.scatter(X_aug_demo[:, 0], X_aug_demo[:, 1], c=y_aug_demo, cmap="coolwarm", s=100, edgecolor="black", label="original")  # Plot originals.
plt.scatter(X_jitter_demo[:, 0], X_jitter_demo[:, 1], c=y_jitter_demo, cmap="coolwarm", s=100, marker="x", label="augmented")  # Plot jittered copies.
for idx_aug_demo in range(X_aug_demo.shape[0]):  # Draw connectors between each pair.
    plt.plot([X_aug_demo[idx_aug_demo, 0], X_jitter_demo[idx_aug_demo, 0]], [X_aug_demo[idx_aug_demo, 1], X_jitter_demo[idx_aug_demo, 1]], color="gray", alpha=0.7, linewidth=0.8)  # Show small movement.
plt.xlabel("feature 1")  # Label first feature.
plt.ylabel("feature 2")  # Label second feature.
plt.title("Augmentation adds nearby label-preserving examples")  # Explain the plot.
plt.legend()  # Identify original and augmented markers.
plt.show()  # Render augmentation scatter.
```
▶ What you'll see: each original point gets a nearby partner with the same color label, doubling the tiny dataset without changing class meaning.

### Step 6 — Good-practice sanity checks: overfit a tiny batch and check a gradient

Before trusting regularization, verify the model can fit a tiny clean batch when regularization is
off. Also compare analytical gradients with centered finite differences to catch implementation
bugs in backpropagation.

```python
x_small_demo = np.array([-1.0, 0.0, 1.0, 2.0])  # Tiny clean batch of one-dimensional inputs.
y_small_demo = 2.0 * x_small_demo + 1.0  # Exactly linear targets that should be easy to overfit.
w_small_demo = 0.0  # Initialize slope.
b_small_demo = 0.0  # Initialize intercept.
lr_small_demo = 0.12  # Learning rate for the tiny overfit check.
losses_small_demo = []  # Store small-batch losses.
for step_small_demo in range(120):  # Train long enough to fit the four examples.
    pred_small_demo = w_small_demo * x_small_demo + b_small_demo  # Forward pass for the tiny batch.
    err_small_demo = pred_small_demo - y_small_demo  # Residuals.
    loss_small_demo = float(np.mean(err_small_demo ** 2))  # Mean squared error.
    grad_w_small_demo = 2.0 * np.mean(err_small_demo * x_small_demo)  # Analytical slope gradient.
    grad_b_small_demo = 2.0 * np.mean(err_small_demo)  # Analytical intercept gradient.
    w_small_demo = w_small_demo - lr_small_demo * grad_w_small_demo  # Update slope.
    b_small_demo = b_small_demo - lr_small_demo * grad_b_small_demo  # Update intercept.
    losses_small_demo.append(loss_small_demo)  # Save loss.

def scalar_fn_demo(w_check_demo):  # Simple scalar function for gradient checking.
    return w_check_demo ** 3  # f(w)=w^3 has exact derivative 3w^2.

w_check_demo = 2.0  # Point where we check the derivative.
analytic_grad_demo = 3.0 * w_check_demo ** 2  # Exact derivative.
h_values_demo = np.logspace(-1, -7, 7)  # Candidate finite-difference step sizes.
errors_check_demo = []  # Store absolute gradient errors.
for h_demo in h_values_demo:  # Try each finite-difference step size.
    numeric_grad_demo = (scalar_fn_demo(w_check_demo + h_demo) - scalar_fn_demo(w_check_demo - h_demo)) / (2.0 * h_demo)  # Centered finite difference.
    errors_check_demo.append(abs(numeric_grad_demo - analytic_grad_demo))  # Save absolute error.
numeric_grad_demo = (scalar_fn_demo(w_check_demo + 1e-4) - scalar_fn_demo(w_check_demo - 1e-4)) / (2e-4)  # Representative numerical gradient.
relative_error_demo = abs(numeric_grad_demo - analytic_grad_demo) / max(1.0, abs(numeric_grad_demo), abs(analytic_grad_demo))  # Relative gradient-check error.
log("small-batch first/last loss", (round(losses_small_demo[0], 4), round(losses_small_demo[-1], 8)))  # Verify tiny batch overfits.
log("learned slope/intercept", (round(float(w_small_demo), 3), round(float(b_small_demo), 3)))  # Print fitted parameters.
log("analytic vs numeric grad", (round(float(analytic_grad_demo), 8), round(float(numeric_grad_demo), 8)))  # Compare gradients.
log("relative gradient error", f"{relative_error_demo:.2e}")  # Print gradient-check error.

fig_demo, axes_demo = plt.subplots(1, 2, figsize=(11, 4))  # Create overfit and gradient-check panels.
axes_demo[0].plot(losses_small_demo, color="seagreen")  # Plot tiny-batch training loss.
axes_demo[0].set_xlabel("gradient step")  # Label update steps.
axes_demo[0].set_ylabel("MSE on tiny batch")  # Label small-batch loss.
axes_demo[0].set_title("sanity check: tiny batch can be overfit")  # Title overfit panel.
axes_demo[1].loglog(h_values_demo, errors_check_demo, marker="o")  # Plot finite-difference error by step size.
axes_demo[1].invert_xaxis()  # Put smaller h values toward the right.
axes_demo[1].set_xlabel("finite-difference h")  # Label h axis.
axes_demo[1].set_ylabel("absolute gradient error")  # Label error axis.
axes_demo[1].set_title("gradient check for f(w)=w^3")  # Title gradient-check panel.
plt.tight_layout()  # Keep panels readable.
plt.show()  # Render sanity-check diagnostics.
```
▶ What you'll see: the tiny-batch loss drops almost to zero, and the numerical derivative matches the analytical derivative with a tiny relative error.

### Recap — what you just ran

- **Weight penalties** made large weights costly; **dropout** sampled sub-networks while preserving average activation scale.
- **Early stopping** selected the validation-best epoch; **batch norm** stabilized one mini-batch of activations.
- **Data augmentation** added safe variation, and the **sanity checks** verified that a model can overfit a tiny batch and that a gradient is implemented correctly.

Everything below (starting at **§1 Overview**) develops these same ideas with full derivations,
more examples, and practical regularization experiments.

---

## 1. Overview

Deep networks are expressive enough to fit real signal and accidental noise. **Regularization** is the set of penalties, randomization tricks, stopping rules, normalization methods, and data practices that make the useful solution easier to learn than the memorizing solution.

**One-line intuition:** regularization does not make a model less intelligent; it makes memorization expensive, unstable, or unnecessary.

In this lesson we study the CS 230 core ideas: $L_1/L_2$ weight penalties, dropout, early stopping, batch normalization, data augmentation, overfit-a-small-batch sanity checks, and gradient checking. Some examples are pure pen-and-paper so the algebra is visible; the coded examples form a runnable notebook-style section using only CPU-friendly `numpy`, `scikit-learn`, `matplotlib`, and `ipywidgets`.

## 2. Key Idea

Suppose a model with parameters $\theta$ minimizes empirical loss

$$
J_{\text{data}}(\theta)=\frac{1}{m}\sum_{i=1}^{m}\ell\left(f_\theta(x^{(i)}),y^{(i)}\right).
$$

Regularization changes either the **objective**, the **training process**, or the **data distribution** seen during training.

### Weight penalties: $L_1$, $L_2$, and elastic net

The common penalized objectives are

$$
J_{L_1}(\theta)=J_{\text{data}}(\theta)+\lambda\lVert\theta\rVert_1
=J_{\text{data}}(\theta)+\lambda\sum_j |\theta_j|,
$$

$$
J_{L_2}(\theta)=J_{\text{data}}(\theta)+\lambda\lVert\theta\rVert_2^2
=J_{\text{data}}(\theta)+\lambda\sum_j \theta_j^2,
$$

and

$$
J_{\text{elastic}}(\theta)=J_{\text{data}}(\theta)+\lambda\left[(1-\alpha)\lVert\theta\rVert_1+
\alpha\lVert\theta\rVert_2^2\right],\qquad \alpha\in[0,1].
$$

- $L_1$ encourages sparsity because the diamond-shaped constraint has corners on coordinate axes.
- $L_2$ shrinks weights smoothly because its circular constraint penalizes large magnitudes in every direction.
- Elastic net mixes sparsity and shrinkage.

For $L_2$ as written above,

$$
\nabla_\theta J_{L_2}(\theta)=\nabla_\theta J_{\text{data}}(\theta)+2\lambda\theta.
$$

Thus a gradient step becomes

$$
\theta_{t+1}=\theta_t-\eta\left(\nabla_\theta J_{\text{data}}(\theta_t)+2\lambda\theta_t\right)
=(1-2\eta\lambda)\theta_t-\eta\nabla_\theta J_{\text{data}}(\theta_t).
$$

This is why $L_2$ is often described as **weight decay**.

### Dropout

Let $a\in\mathbb{R}^d$ be a hidden activation vector. With drop probability $p$ and keep probability

$$
q=1-p,
$$

sample a binary mask

$$
m_j\sim\operatorname{Bernoulli}(q).
$$

In **inverted dropout**, the training-time activation is

$$
a_{\text{drop}}=\frac{m\odot a}{q}.
$$

The scaling keeps the expectation unchanged:

$$
\mathbb{E}\left[(a_{\text{drop}})_j\right]
=\mathbb{E}\left[\frac{m_j a_j}{q}\right]
=\frac{a_j}{q}\mathbb{E}[m_j]
=\frac{a_j}{q}q
=a_j.
$$

At test time no mask is sampled; the full network is used.

### Early stopping

Let $V_t$ be validation loss at epoch $t$. Early stopping chooses a checkpoint near

$$
t^*=\operatorname*{argmin}_t V_t
$$

or stops when validation loss has not improved for a chosen patience window. It regularizes because later epochs may continue decreasing training loss while increasing validation loss.

### Batch normalization

For a mini-batch of pre-activations $z_1,\ldots,z_B$, batch normalization computes

$$
\mu_B=\frac{1}{B}\sum_{i=1}^{B} z_i,
\qquad
\sigma_B^2=\frac{1}{B}\sum_{i=1}^{B}(z_i-\mu_B)^2,
$$

then normalizes and re-scales:

$$
\hat z_i=\frac{z_i-\mu_B}{\sqrt{\sigma_B^2+\epsilon}},
\qquad
\tilde z_i=\gamma\hat z_i+\beta.
$$

Batch norm is not merely a penalty; it improves optimization by stabilizing activation distributions. It can also interact with regularization because smoother training often reduces the need for extreme dropout or large learning-rate guesses.

### Data augmentation

Data augmentation replaces one fixed input $x$ with transformed examples $T(x)$ that preserve the label:

$$
y(T(x))=y(x).
$$

Examples include image flips, crops, color jitter, text noise, and small tabular perturbations when domain-valid. Augmentation reduces variance by teaching the model invariances directly.

### Good-practice sanity checks

**Overfit a small batch.** Before trusting regularization, turn it off and verify the model can fit a tiny subset. If it cannot, the architecture, loss, labels, or gradients may be wrong.

**Gradient checking.** For a scalar parameter $w$, compare the analytical gradient with the centered finite difference

$$
\frac{df}{dw}(w)\approx \frac{f(w+h)-f(w-h)}{2h}.
$$

The relative error is often measured by

$$
\operatorname{relerr}=\frac{|g_{\text{analytic}}-g_{\text{numeric}}|}{\max(1,|g_{\text{analytic}}|,|g_{\text{numeric}}|)}.
$$

## 3. Worked Examples

### Setup

Run this once before the coded examples.

```python
import numpy as np  # Import NumPy for arrays, random numbers, and vectorized math.
import matplotlib.pyplot as plt  # Import Matplotlib for all plots in the lesson.
from sklearn.datasets import make_moons, make_regression, load_digits  # Import small CPU-friendly datasets.
from sklearn.model_selection import train_test_split  # Import a reproducible train/validation/test splitter.
from sklearn.preprocessing import StandardScaler, PolynomialFeatures  # Import scaling and feature expansion helpers.
from sklearn.linear_model import Ridge, Lasso, ElasticNet, LogisticRegression  # Import regularized baseline models.
from sklearn.metrics import log_loss, accuracy_score, mean_squared_error  # Import metrics used in examples.
from sklearn.neural_network import MLPClassifier  # Import a compact CPU neural-network classifier.
from sklearn.pipeline import make_pipeline  # Import a simple way to chain preprocessing and models.
try:  # Try the normal widget import first because Colab usually has ipywidgets ready.
    from ipywidgets import interact, FloatSlider  # Import widgets for the interactive experiment.
except ModuleNotFoundError:  # Keep the notebook runnable even in plain Python environments without widgets.
    class FloatSlider:  # Define a tiny fallback slider that stores only the default value.
        def __init__(self, value, min, max, step, description):  # Accept the same arguments used below.
            self.value = value  # Store the default value so the fallback can run once.
    def interact(**controls):  # Define a tiny fallback interact decorator for non-widget environments.
        def decorator(func):  # Build a decorator that immediately calls the function once.
            defaults = {name: control.value for name, control in controls.items()}  # Extract default slider values.
            print("ipywidgets is unavailable, so the interactive experiment runs once with default values.")  # Explain the fallback behavior.
            func(**defaults)  # Run the experiment once so the code remains executable.
            return func  # Return the original function for normal reuse.
        return decorator  # Return the decorator expected by @interact.
SEED = 23028  # Store one seed so every randomized example is reproducible.
rng = np.random.default_rng(SEED)  # Create one modern NumPy random generator for controlled randomness.
np.random.seed(SEED)  # Seed legacy NumPy calls used internally by some libraries.
plt.rcParams["figure.figsize"] = (7, 4)  # Set a readable default plot size for notebook output.
plt.rcParams["axes.grid"] = True  # Add light grids so curves and bars are easier to compare.
```

### Data — swappable sources

The examples use noisy two-moons classification, correlated-feature regression, and digits classification. The two-moons data intentionally includes a failure mode: an over-flexible model can memorize the training set and generalize poorly.

```python
DATA_SOURCE = "moons"  # Choose "moons", "regression", or "digits" as the active demonstration source.
if DATA_SOURCE == "moons":  # Build the classification dataset used for overfitting demonstrations.
    X_raw, y_raw = make_moons(n_samples=420, noise=0.32, random_state=SEED)  # Create nonlinear noisy two-moons data.
    X_raw = StandardScaler().fit_transform(X_raw)  # Standardize features so optimization is well-conditioned.
    X_train, X_temp, y_train, y_temp = train_test_split(X_raw, y_raw, test_size=0.40, random_state=SEED, stratify=y_raw)  # Hold out validation and test data.
    X_val, X_test, y_val, y_test = train_test_split(X_temp, y_temp, test_size=0.50, random_state=SEED, stratify=y_temp)  # Split held-out data into validation and test sets.
elif DATA_SOURCE == "regression":  # Build the regression dataset used for coefficient-penalty demonstrations.
    X_base, y_raw = make_regression(n_samples=260, n_features=6, n_informative=3, noise=18.0, random_state=SEED)  # Create a small noisy linear problem.
    X_raw = np.c_[X_base, X_base[:, 0] + 0.03 * rng.normal(size=X_base.shape[0]), rng.normal(size=X_base.shape[0])]  # Add one correlated and one irrelevant feature.
    X_raw = StandardScaler().fit_transform(X_raw)  # Standardize columns so penalties treat features comparably.
    X_train, X_temp, y_train, y_temp = train_test_split(X_raw, y_raw, test_size=0.40, random_state=SEED)  # Hold out validation and test data.
    X_val, X_test, y_val, y_test = train_test_split(X_temp, y_temp, test_size=0.50, random_state=SEED)  # Split held-out data into validation and test sets.
else:  # Build the digits dataset used for dropout-rate intuition.
    digits = load_digits()  # Load the built-in handwritten digit dataset.
    X_raw = digits.data / 16.0  # Scale pixel intensities from 0..16 into 0..1.
    y_raw = digits.target  # Store digit labels as integers from 0 to 9.
    X_train, X_temp, y_train, y_temp = train_test_split(X_raw, y_raw, test_size=0.40, random_state=SEED, stratify=y_raw)  # Hold out validation and test data.
    X_val, X_test, y_val, y_test = train_test_split(X_temp, y_temp, test_size=0.50, random_state=SEED, stratify=y_temp)  # Split held-out data into validation and test sets.
print(f"DATA_SOURCE={DATA_SOURCE}, train={X_train.shape}, val={X_val.shape}, test={X_test.shape}")  # Print shapes so the active dataset is explicit.
fig, ax = plt.subplots()  # Create one exploratory figure for the active data source.
if DATA_SOURCE == "moons":  # Plot two-dimensional classification data directly.
    ax.scatter(X_train[:, 0], X_train[:, 1], c=y_train, cmap="coolwarm", s=24, edgecolor="k", linewidth=0.2)  # Draw training points colored by class.
    ax.set_title("Noisy two-moons data: useful signal plus label noise")  # Explain why this source can overfit.
elif DATA_SOURCE == "regression":  # Plot the first feature against the target for regression data.
    ax.scatter(X_train[:, 0], y_train, s=24, alpha=0.8)  # Draw a one-feature projection of the regression problem.
    ax.set_title("Regression projection: correlated and irrelevant features exist")  # Explain why penalties help.
else:  # Plot one digit image for image-like data.
    ax.imshow(X_train[0].reshape(8, 8), cmap="gray_r")  # Display one normalized handwritten digit.
    ax.set_title(f"Digits source: one 8x8 image with label {y_train[0]}")  # Label the example image.
plt.show()  # Render the data preview.
```

▶ What you'll see: the active dataset and split sizes, plus a quick visual showing why the chosen source is not perfectly clean.

---

### 📖 Concept walkthrough — build each idea from scratch

Before the warm-up examples, we build each regularization idea from scratch with tiny inline data. Everything here uses only NumPy + Matplotlib, seeded randomness, and inspectable arrays, so each number can be traced by hand. Variables carry a `_w` suffix so they do not collide with later notebook examples.

```python
import numpy as np  # Use NumPy for tiny arrays, vectorized loss calculations, and reproducible random masks.
import matplotlib.pyplot as plt  # Use Matplotlib so every regularization idea has a visible diagnostic plot.
np.random.seed(23028)  # Seed legacy NumPy randomness so every mask, jitter, and synthetic target is reproducible.
```

#### 1. Weight penalties: $L_1$, $L_2$, and elastic net

**What:** weight penalties add a cost for large parameters, such as $\lambda\lVert w\rVert_1$, $\lambda\lVert w\rVert_2^2$, or a mixture of both. **Why:** the model must now trade training fit against parameter size, so memorizing noisy or redundant directions becomes expensive. **Why this approach:** a tiny regression with one real feature, one duplicate feature, and one noise feature lets us see how $L_2$ shrinks smoothly while $L_1$ creates exact zeros.

The $L_1$ objective has sharp corners where a coefficient is exactly zero, so an optimum often lands on an axis. The $L_2$ objective is round and differentiable, so it continuously pulls weights toward zero without usually making them exactly zero.

```python
X_penalty_w = np.array([[-2.0, -1.969, -0.704], [-1.429, -1.462, -1.265], [-0.857, -0.697, -0.623], [-0.286, -0.259, 0.041], [0.286, 0.152, -2.325], [0.857, 0.948, -0.219], [1.429, 1.755, -1.246], [2.0, 2.237, -0.732]])  # Create a tiny regression design with two correlated useful columns and one weak/noisy column.
y_penalty_w = np.array([-6.381, -4.507, -2.283, -0.127, 0.767, 3.528, 3.82, 6.246])  # Create targets that mostly follow the first two columns but include small noise.
X_penalty_w = (X_penalty_w - X_penalty_w.mean(axis=0)) / np.maximum(X_penalty_w.std(axis=0), 1e-8)  # Standardize columns and guard against division by zero.
y_penalty_w = y_penalty_w - y_penalty_w.mean()  # Center the target so the example can focus on weights rather than an intercept.
print("standardized X first rows:\n", np.round(X_penalty_w[:3], 3))  # Print the small standardized inputs for inspection.
print("centered y:", np.round(y_penalty_w, 3))  # Print the centered target values for inspection.
```

```python
penalty_grid_w = np.linspace(-4.0, 4.0, 41)  # Build a small candidate grid so the fit is understandable by brute force.
lambda_penalty_w = 0.5  # Choose a visible regularization strength for all three penalties.
alpha_penalty_w = 0.5  # Use an even elastic-net mix between L1-style sparsity and L2-style shrinkage.
best_penalty_w = {}  # Store the best weights and objective value for each penalty type.
for name_penalty_w in ["none", "l2", "l1", "elastic"]:  # Try unregularized, L2, L1, and elastic-net objectives.
    best_loss_w = np.inf  # Start each search with an infinitely bad objective.
    best_weights_w = None  # Reserve a slot for the best weight vector found on the grid.
    for w0_penalty_w in penalty_grid_w:  # Search the first coefficient.
        for w1_penalty_w in penalty_grid_w:  # Search the second coefficient.
            for w2_penalty_w in penalty_grid_w:  # Search the third coefficient.
                weights_candidate_w = np.array([w0_penalty_w, w1_penalty_w, w2_penalty_w])  # Pack the candidate weights.
                residuals_candidate_w = X_penalty_w @ weights_candidate_w - y_penalty_w  # Compute prediction errors for the candidate.
                data_loss_w = np.mean(residuals_candidate_w ** 2)  # Compute mean squared error as the data-fit term.
                l1_cost_w = np.sum(np.abs(weights_candidate_w))  # Compute $\lVert w\rVert_1$ as the sum of absolute weights.
                l2_cost_w = np.sum(weights_candidate_w ** 2)  # Compute $\lVert w\rVert_2^2$ as the sum of squared weights.
                penalty_cost_w = 0.0 if name_penalty_w == "none" else lambda_penalty_w * l2_cost_w if name_penalty_w == "l2" else lambda_penalty_w * l1_cost_w if name_penalty_w == "l1" else lambda_penalty_w * ((1.0 - alpha_penalty_w) * l1_cost_w + alpha_penalty_w * l2_cost_w)  # Select the requested penalty formula.
                total_loss_w = data_loss_w + penalty_cost_w  # Add data loss and penalty to form the training objective.
                if total_loss_w < best_loss_w:  # Keep the candidate if it improves the objective.
                    best_loss_w = total_loss_w  # Store the improved objective value.
                    best_weights_w = weights_candidate_w.copy()  # Store the improved weight vector.
    best_penalty_w[name_penalty_w] = (best_weights_w, best_loss_w)  # Save the best result for this penalty type.
for name_penalty_w, (weights_penalty_w, loss_penalty_w) in best_penalty_w.items():  # Print each fitted model for comparison.
    print(name_penalty_w, "weights=", np.round(weights_penalty_w, 3), "objective=", round(loss_penalty_w, 3))  # Show that L1 can choose exact zeros while L2 mainly shrinks.
```

```python
labels_penalty_w = list(best_penalty_w.keys())  # Collect model names in a stable order.
weights_matrix_w = np.vstack([best_penalty_w[label_penalty_w][0] for label_penalty_w in labels_penalty_w])  # Stack learned weights for plotting.
x_positions_w = np.arange(weights_matrix_w.shape[1])  # Create one x-position per feature weight.
bar_width_w = 0.18  # Use narrow bars so all penalty types fit side by side.
plt.figure(figsize=(7.5, 4.2))  # Create a readable figure for coefficient comparison.
for idx_penalty_w, label_penalty_w in enumerate(labels_penalty_w):  # Draw one bar group per penalty type.
    plt.bar(x_positions_w + (idx_penalty_w - 1.5) * bar_width_w, weights_matrix_w[idx_penalty_w], width=bar_width_w, label=label_penalty_w)  # Plot the three learned weights for this model.
plt.axhline(0.0, color="black", linewidth=0.8)  # Add a zero line so sparsity is visually obvious.
plt.xticks(x_positions_w, ["feature 0", "feature 1", "feature 2"])  # Label each coefficient position.
plt.ylabel("learned weight")  # Label the vertical axis as coefficient magnitude.
plt.title("1: Weight penalties shrink or zero learned coefficients")  # Title the figure with the subsection number.
plt.legend()  # Show which bars correspond to no penalty, L2, L1, and elastic net.
plt.show()  # Render the coefficient comparison.
```

▶ What you'll see: $L_2$ distributes smaller weights across correlated features, while $L_1$ can place an exactly zero weight on a feature. Elastic net sits between those behaviors.

*Why it's done this way: the brute-force grid is slower than a real optimizer but makes the objective visible, and the correlated tiny data exposes the different geometry of $L_1$ corners versus $L_2$ circles.*

#### 2. Dropout: random sub-networks with preserved activation scale

**What:** dropout samples a binary mask and computes $a_{\text{drop}}=\frac{m\odot a}{q}$, where $q$ is the keep probability. **Why:** a hidden unit cannot rely on every other hidden unit being present, so co-adaptation becomes harder. **Why this approach:** repeated masks on one activation vector let us verify the expected activation is preserved and visualize a different sub-network at each step.

Inverted dropout scales by $\frac{1}{q}$ during training so no matching scale correction is needed at test time. Averaging many masked networks behaves like a cheap form of model averaging because each step trains a different thinned network.

```python
activation_dropout_w = np.array([1.0, 2.0, 0.5, 3.0, 1.5, 2.5])  # Define six hidden activations before dropout.
keep_prob_dropout_w = 0.6  # Keep each unit with probability q and drop it otherwise.
mask_dropout_w = (np.random.rand(activation_dropout_w.size) < keep_prob_dropout_w).astype(float)  # Sample one Bernoulli mask for this training step.
dropped_activation_w = mask_dropout_w * activation_dropout_w / max(keep_prob_dropout_w, 1e-8)  # Apply inverted dropout with a division-by-zero guard.
print("activation:", activation_dropout_w)  # Print the original activation vector.
print("mask:", mask_dropout_w)  # Print which units survive in this sub-network.
print("after inverted dropout:", np.round(dropped_activation_w, 3))  # Print the scaled training activation.
```

```python
num_masks_dropout_w = 4000  # Use many masks so the empirical expectation is stable.
masks_dropout_w = (np.random.rand(num_masks_dropout_w, activation_dropout_w.size) < keep_prob_dropout_w).astype(float)  # Sample many independent dropout masks.
dropped_many_w = masks_dropout_w * activation_dropout_w / max(keep_prob_dropout_w, 1e-8)  # Apply inverted dropout to every sampled mask.
mean_after_dropout_w = dropped_many_w.mean(axis=0)  # Estimate the expected activation after dropout.
print("original activation:", np.round(activation_dropout_w, 3))  # Print the reference activation.
print("mean after many masks:", np.round(mean_after_dropout_w, 3))  # Print the empirical expectation after dropout.
print("absolute error:", np.round(np.abs(mean_after_dropout_w - activation_dropout_w), 3))  # Print the small Monte Carlo error.
```

```python
plt.figure(figsize=(7.5, 4.2))  # Create a figure for expected-scale preservation.
positions_dropout_w = np.arange(activation_dropout_w.size)  # Create one position per hidden unit.
plt.bar(positions_dropout_w - 0.18, activation_dropout_w, width=0.36, label="original")  # Plot original activations.
plt.bar(positions_dropout_w + 0.18, mean_after_dropout_w, width=0.36, label="mean after dropout")  # Plot empirical mean after many masks.
plt.xlabel("hidden unit")  # Label the unit index axis.
plt.ylabel("activation value")  # Label the activation magnitude axis.
plt.title("2: Inverted dropout preserves expected activation")  # Title the figure with the subsection number.
plt.legend()  # Show which bars are original and averaged dropout outputs.
plt.show()  # Render the expectation comparison.
```

▶ What you'll see: the averaged dropout activations nearly match the original activations, confirming the $\frac{1}{q}$ scaling.

```python
example_masks_w = masks_dropout_w[:5]  # Select five masks to represent five training steps.
plt.figure(figsize=(7.5, 3.8))  # Create a figure showing the sub-network pattern over steps.
plt.imshow(example_masks_w, cmap="Greys", aspect="auto", vmin=0.0, vmax=1.0)  # Show kept units as dark cells and dropped units as light cells.
plt.xlabel("hidden unit")  # Label columns as hidden units.
plt.ylabel("training step")  # Label rows as separate stochastic updates.
plt.title("2: Dropout samples a different sub-network each step")  # Title the figure with the subsection number.
plt.colorbar(label="kept = 1, dropped = 0")  # Add a legend for mask values.
plt.show()  # Render the sub-network mask visualization.
```

▶ What you'll see: each row keeps a different subset of hidden units, so the same layer behaves like many related sub-networks during training.

*Why it's done this way: one activation vector isolates the dropout mechanism from optimizer details, while many sampled masks prove the expectation claim numerically.*

#### 3. Early stopping: stop when validation loss turns upward

**What:** early stopping saves the checkpoint near $t^*=\operatorname*{argmin}_t V_t$ instead of training until the final epoch. **Why:** a model can keep fitting training data while validation performance gets worse, which signals overfitting. **Why this approach:** hand-built train and validation curves make the stopping decision visible without needing a large neural-network training loop.

Stopping at the first sustained validation rise keeps the model near the point where learned structure still generalizes. It acts as regularization because later parameter updates would specialize more to the training set than to the data distribution.

```python
epochs_stop_w = np.arange(1, 16)  # Create a short sequence of training epochs.
train_loss_stop_w = 1.10 * np.exp(-0.18 * epochs_stop_w) + 0.08  # Build a steadily decreasing training-loss curve.
validation_loss_stop_w = np.array([0.95, 0.78, 0.63, 0.52, 0.45, 0.41, 0.39, 0.40, 0.43, 0.47, 0.52, 0.58, 0.65, 0.73, 0.82])  # Build a validation curve that improves and then overfits.
best_index_stop_w = int(np.argmin(validation_loss_stop_w))  # Find the epoch index with the lowest validation loss.
best_epoch_stop_w = int(epochs_stop_w[best_index_stop_w])  # Convert the best index to the displayed epoch number.
print("best validation epoch:", best_epoch_stop_w)  # Print the selected checkpoint epoch.
print("best validation loss:", round(float(validation_loss_stop_w[best_index_stop_w]), 3))  # Print the best validation loss.
print("final validation loss:", round(float(validation_loss_stop_w[-1]), 3))  # Print the worse final validation loss for contrast.
```

```python
rising_after_best_w = validation_loss_stop_w[best_index_stop_w + 1:] > validation_loss_stop_w[best_index_stop_w]  # Check whether later validation losses are higher than the best value.
first_rise_epoch_w = int(epochs_stop_w[best_index_stop_w + 1]) if rising_after_best_w.size and rising_after_best_w[0] else best_epoch_stop_w  # Mark the first epoch after the best when validation begins rising.
print("validation starts rising at epoch:", first_rise_epoch_w)  # Print the first visible overfitting epoch.
print("extra epochs after best:", int(epochs_stop_w[-1] - best_epoch_stop_w))  # Print how long training would continue without early stopping.
```

```python
plt.figure(figsize=(7.5, 4.2))  # Create a figure for loss curves.
plt.plot(epochs_stop_w, train_loss_stop_w, marker="o", label="train loss")  # Plot the monotonically decreasing training loss.
plt.plot(epochs_stop_w, validation_loss_stop_w, marker="o", label="validation loss")  # Plot the validation loss that eventually rises.
plt.axvline(best_epoch_stop_w, color="green", linestyle="--", label=f"stop at epoch {best_epoch_stop_w}")  # Mark the best validation checkpoint.
plt.scatter([best_epoch_stop_w], [validation_loss_stop_w[best_index_stop_w]], color="green", s=90, zorder=3)  # Highlight the exact minimum validation point.
plt.xlabel("epoch")  # Label the epoch axis.
plt.ylabel("loss")  # Label the loss axis.
plt.title("3: Early stopping keeps the best validation checkpoint")  # Title the figure with the subsection number.
plt.legend()  # Show curve labels and stopping marker.
plt.show()  # Render the early-stopping plot.
```

▶ What you'll see: training loss keeps dropping, but validation loss bottoms out and then rises; early stopping chooses the bottom rather than the final epoch.

*Why it's done this way: synthetic loss curves remove training-loop clutter and focus attention on the validation signal that actually triggers the regularizer.*

#### 4. Batch normalization: normalize, then scale and shift

**What:** batch normalization transforms mini-batch pre-activations with $\hat z_i=\frac{z_i-\mu_B}{\sqrt{\sigma_B^2+\epsilon}}$ and then learns $\tilde z_i=\gamma\hat z_i+\beta$. **Why:** keeping activation distributions in a stable range makes optimization less sensitive to drifting layer inputs. **Why this approach:** one mini-batch makes the batch mean, variance, normalized values, and learned scale/shift all inspectable.

The small $\epsilon$ prevents division by zero when a batch has tiny variance. The learned $\gamma$ and $\beta$ matter because normalization should stabilize training without permanently forcing every layer to have mean $0$ and variance $1$.

```python
z_batchnorm_w = np.array([8.0, 10.0, 9.0, 12.0, 11.0, 7.0, 13.0, 10.5])  # Create one mini-batch of pre-activation values.
mu_batchnorm_w = np.mean(z_batchnorm_w)  # Compute the batch mean $\mu_B$.
var_batchnorm_w = np.mean((z_batchnorm_w - mu_batchnorm_w) ** 2)  # Compute the batch variance $\sigma_B^2$.
epsilon_batchnorm_w = 1e-5  # Add epsilon to guard against division by zero.
z_hat_batchnorm_w = (z_batchnorm_w - mu_batchnorm_w) / np.sqrt(var_batchnorm_w + epsilon_batchnorm_w)  # Normalize the batch to roughly zero mean and unit variance.
print("batch mean:", round(float(mu_batchnorm_w), 3))  # Print the mean used by batch norm.
print("batch variance:", round(float(var_batchnorm_w), 3))  # Print the variance used by batch norm.
print("normalized values:", np.round(z_hat_batchnorm_w, 3))  # Print the standardized pre-activations.
```

```python
gamma_batchnorm_w = 1.4  # Choose a learned scale parameter for the demonstration.
beta_batchnorm_w = -0.3  # Choose a learned shift parameter for the demonstration.
z_tilde_batchnorm_w = gamma_batchnorm_w * z_hat_batchnorm_w + beta_batchnorm_w  # Apply the trainable scale and shift after normalization.
print("normalized mean/std:", round(float(z_hat_batchnorm_w.mean()), 3), round(float(z_hat_batchnorm_w.std()), 3))  # Show the standardized distribution statistics.
print("scaled-shifted mean/std:", round(float(z_tilde_batchnorm_w.mean()), 3), round(float(z_tilde_batchnorm_w.std()), 3))  # Show how gamma and beta change the final distribution.
```

```python
plt.figure(figsize=(7.5, 4.2))  # Create a figure comparing distributions.
plt.hist(z_batchnorm_w, bins=6, alpha=0.55, label="before batch norm")  # Plot the raw pre-activation distribution.
plt.hist(z_hat_batchnorm_w, bins=6, alpha=0.55, label="normalized")  # Plot the zero-centered normalized distribution.
plt.hist(z_tilde_batchnorm_w, bins=6, alpha=0.55, label="scaled and shifted")  # Plot the final gamma-beta output distribution.
plt.xlabel("value")  # Label the value axis.
plt.ylabel("count")  # Label histogram counts.
plt.title("4: Batch normalization stabilizes activation scale")  # Title the figure with the subsection number.
plt.legend()  # Show which histogram is before, normalized, or scaled-shifted.
plt.show()  # Render the distribution comparison.
```

▶ What you'll see: raw pre-activations sit around a large positive mean, normalized values center near $0$, and $\gamma,\beta$ move the distribution to a learned scale and location.

*Why it's done this way: a single mini-batch shows the exact arithmetic of batch normalization while the histogram shows why stable activation scale helps optimization.*

#### 5. Data augmentation: label-preserving variation

**What:** data augmentation replaces a single fixed input with transformed versions $T(x)$ that keep the same label. **Why:** the model sees more plausible variations of the same example, so it learns invariances instead of memorizing exact coordinates. **Why this approach:** a tiny two-dimensional class pattern can be jittered by a small label-preserving shift and plotted before and after augmentation.

Augmentation regularizes only when the transform preserves the target: a small image shift may preserve a digit label, but a semantic-changing transform would inject label noise. The transform should reflect the invariance we want the model to learn.

```python
X_aug_w = np.array([[0.0, 0.2], [0.2, -0.1], [0.4, 0.1], [2.0, 2.1], [2.2, 1.9], [1.8, 2.2]])  # Create two tiny point clusters with stable labels.
y_aug_w = np.array([0, 0, 0, 1, 1, 1])  # Assign one label to each cluster.
noise_aug_w = 0.12 * np.random.randn(*X_aug_w.shape)  # Sample small Gaussian jitter as a label-preserving transform.
X_augmented_w = X_aug_w + noise_aug_w  # Create augmented points by shifting each original point slightly.
y_augmented_w = y_aug_w.copy()  # Keep labels unchanged because the jitter is intentionally small.
print("original first points:\n", np.round(X_aug_w[:3], 3))  # Print a few original points.
print("augmented first points:\n", np.round(X_augmented_w[:3], 3))  # Print their jittered versions.
```

```python
X_combined_aug_w = np.vstack([X_aug_w, X_augmented_w])  # Combine original and augmented examples into one training set.
y_combined_aug_w = np.concatenate([y_aug_w, y_augmented_w])  # Combine labels while preserving class identities.
print("original size:", X_aug_w.shape[0])  # Print the original sample count.
print("augmented size:", X_combined_aug_w.shape[0])  # Print the expanded sample count.
print("labels preserved:", bool(np.all(y_augmented_w == y_aug_w)))  # Verify that augmentation did not change labels.
```

```python
plt.figure(figsize=(7.0, 4.5))  # Create a figure for original and augmented data.
plt.scatter(X_aug_w[:, 0], X_aug_w[:, 1], c=y_aug_w, cmap="coolwarm", s=90, edgecolor="black", label="original")  # Plot the original labeled points.
plt.scatter(X_augmented_w[:, 0], X_augmented_w[:, 1], c=y_augmented_w, cmap="coolwarm", s=90, marker="x", label="augmented")  # Plot jittered points with the same labels.
for idx_aug_w in range(X_aug_w.shape[0]):  # Draw one connector per original-to-augmented pair.
    plt.plot([X_aug_w[idx_aug_w, 0], X_augmented_w[idx_aug_w, 0]], [X_aug_w[idx_aug_w, 1], X_augmented_w[idx_aug_w, 1]], color="gray", linewidth=0.8, alpha=0.7)  # Show the small label-preserving shift.
plt.xlabel("feature 1")  # Label the first feature axis.
plt.ylabel("feature 2")  # Label the second feature axis.
plt.title("5: Data augmentation adds label-preserving variations")  # Title the figure with the subsection number.
plt.legend()  # Show which markers are original and augmented examples.
plt.show()  # Render the augmentation plot.
```

▶ What you'll see: each original point gets a nearby jittered partner with the same color label, increasing coverage around the same class region.

*Why it's done this way: tiny jitter is easy to inspect and demonstrates the central rule of augmentation: expand the training distribution only along directions that should not change the label.*

---

### 🟢 Basics (warm-up)

#### B1. Apply one dropout mask

Goal: apply inverted dropout to a tiny hidden activation vector.

```python
a = np.array([2.0, 0.0, 4.0, 6.0])  # Store a four-neuron activation vector before dropout.
mask = np.array([1.0, 0.0, 1.0, 0.0])  # Store a fixed mask so the example is deterministic.
q = 0.5  # Store the keep probability, meaning two of four neurons are kept here.
a_drop = mask * a / q  # Apply inverted dropout by zeroing dropped units and scaling kept units.
print(f"a       = {a}")  # Print the original activations.
print(f"mask    = {mask}")  # Print which neurons survive.
print(f"a_drop  = {a_drop}")  # Print the dropout-transformed activations.
fig, ax = plt.subplots()  # Create a compact bar chart.
positions = np.arange(len(a))  # Create one x-position per neuron.
ax.bar(positions - 0.25, a, width=0.25, label="before")  # Plot original activations.
ax.bar(positions, mask, width=0.25, label="mask")  # Plot the binary mask.
ax.bar(positions + 0.25, a_drop, width=0.25, label="after")  # Plot inverted-dropout activations.
ax.set_xticks(positions)  # Mark the four neuron indices.
ax.set_title("B1 inverted dropout on one activation vector")  # Label the operation.
ax.legend()  # Show which bars are before, mask, and after.
plt.show()  # Render the comparison.
```

▶ What you'll see: neurons 2 and 4 are dropped to zero; kept neurons are doubled because $q=0.5$.

👀 **Takeaway:** inverted dropout preserves expected activation scale while forcing the network not to rely on every unit.

---

#### B2. Compute only an L2 penalty

Goal: compute the penalty term before worrying about gradients or updates.

```python
theta = np.array([3.0, 4.0, 0.0])  # Store a toy weight vector with Euclidean norm 5.
lambda_l2 = 0.1  # Store the L2 regularization strength.
squared_norm = np.sum(theta ** 2)  # Compute ||theta||_2^2 by summing squared coordinates.
penalty = lambda_l2 * squared_norm  # Multiply by lambda to get the objective contribution.
print(f"||theta||_2^2 = {squared_norm:.1f}")  # Print the squared norm.
print(f"lambda * ||theta||_2^2 = {penalty:.1f}")  # Print the L2 penalty.
fig, ax = plt.subplots()  # Create a small contribution plot.
ax.bar(["base loss", "L2 penalty"], [2.0, penalty], color=["gray", "tab:blue"])  # Compare a sample base loss to the penalty.
ax.set_ylabel("objective contribution")  # Label the vertical axis.
ax.set_title("B2 L2 adds a nonnegative cost for large weights")  # State the regularization effect.
plt.show()  # Render the bars.
```

▶ What you'll see: $\lVert(3,4,0)\rVert_2^2=25$, so the added penalty is $2.5$.

👀 **Takeaway:** $L_2$ does not care about signs; it charges every large magnitude.

---

#### B3. Read a train-vs-validation gap

Goal: diagnose overfitting from two loss numbers.

```python
train_loss = 0.08  # Store a very low training loss.
val_loss = 0.42  # Store a much higher validation loss.
gap = val_loss - train_loss  # Compute the generalization gap as validation minus training loss.
print(f"train loss = {train_loss:.2f}")  # Print the training loss.
print(f"validation loss = {val_loss:.2f}")  # Print the validation loss.
print(f"gap = {gap:.2f}")  # Print the gap that signals possible overfitting.
fig, ax = plt.subplots()  # Create a two-bar diagnostic plot.
ax.bar(["train", "validation"], [train_loss, val_loss], color=["tab:green", "tab:red"])  # Plot the two losses side by side.
ax.set_ylabel("loss")  # Label the metric axis.
ax.set_title("B3 a large validation gap suggests overfitting")  # Name the diagnostic.
plt.show()  # Render the gap plot.
```

▶ What you'll see: validation loss is much larger than training loss, even though training looks excellent.

👀 **Takeaway:** regularization is motivated by validation behavior, not by training loss alone.

---


#### B4. Compute an L1 penalty

Goal: compute the absolute-value penalty term for one weight vector.

```python
theta = np.array([3.0, -4.0, 0.0])  # Store a toy weight vector with positive, negative, and zero entries.
lambda_l1 = 0.2  # Store the L1 regularization strength.
l1_norm = np.sum(np.abs(theta))  # Compute ||theta||_1 by summing absolute values.
penalty = lambda_l1 * l1_norm  # Multiply by lambda to get the objective contribution.
print(f"||theta||_1 = {l1_norm:.1f}")  # Print the absolute-value norm.
print(f"lambda * ||theta||_1 = {penalty:.1f}")  # Print the L1 penalty.
fig, ax = plt.subplots()  # Create a small contribution plot.
ax.bar(["|w1|", "|w2|", "|w3|"], np.abs(theta), color="tab:orange")  # Show absolute coordinate contributions.
ax.set_ylabel("absolute weight")  # Label the vertical axis.
ax.set_title("B4 L1 sums absolute weight magnitudes")  # State the primitive.
plt.show()  # Render the bars.
```

▶ What you'll see: signs disappear before the values are summed, so $3$ and $-4$ contribute $7$ total.

👀 **Takeaway:** $L_1$ charges absolute magnitudes and can encourage weights to become exactly zero.

---

#### B5. Gradient of an L2 penalty

Goal: compute the extra gradient term added by $L_2$ regularization.

```python
theta = np.array([3.0, 4.0, 0.0])  # Reuse a tiny weight vector.
lambda_l2 = 0.1  # Store the L2 regularization strength.
l2_grad = 2.0 * lambda_l2 * theta  # Compute the gradient contribution of lambda * ||theta||_2^2.
print(f"theta = {theta}")  # Print the weights.
print(f"2 * lambda * theta = {l2_grad}")  # Print the penalty gradient.
fig, ax = plt.subplots()  # Create a gradient bar chart.
ax.bar(["w1", "w2", "w3"], l2_grad, color="tab:blue")  # Plot the regularization gradient per coordinate.
ax.set_ylabel("gradient contribution")  # Label the vertical axis.
ax.set_title("B5 L2 gradient points with the weights")  # State the effect.
plt.show()  # Render the bars.
```

▶ What you'll see: larger weights get larger shrinkage gradients, while a zero weight gets none.

👀 **Takeaway:** $L_2$ turns weight size directly into an update pressure back toward zero.

---

#### B6. Scale activations by keep probability

Goal: isolate the inverted-dropout scaling step after a mask has kept some units.

```python
a = np.array([2.0, 0.0, 4.0, 6.0])  # Store pre-dropout activations.
mask = np.array([1.0, 0.0, 1.0, 0.0])  # Store a deterministic dropout mask.
q = 0.5  # Store the keep probability.
kept = mask * a  # Apply only the masking step first.
scaled = kept / q  # Divide kept activations by keep probability for inverted dropout.
print(f"kept activations = {kept}")  # Print the masked vector.
print(f"scaled activations = {scaled}")  # Print the inverted-dropout scaling result.
fig, ax = plt.subplots()  # Create a before-after scaling plot.
positions = np.arange(len(a))  # Create one x-position per neuron.
ax.bar(positions - 0.18, kept, width=0.36, label="masked only")  # Plot kept values before scaling.
ax.bar(positions + 0.18, scaled, width=0.36, label="divided by q")  # Plot scaled values.
ax.set_xticks(positions)  # Mark neuron positions.
ax.set_title("B6 inverted dropout scaling")  # Label the operation.
ax.legend()  # Show the two stages.
plt.show()  # Render the bars.
```

▶ What you'll see: kept activations double when $q=0.5$.

👀 **Takeaway:** inverted dropout separates two primitives: masking units and scaling survivors to preserve expected size.

---

#### B7. Early-stopping decision from validation history

Goal: decide whether to stop after validation loss has stopped improving.

```python
val_losses = np.array([0.62, 0.50, 0.44, 0.46, 0.49])  # Store validation loss by epoch.
patience = 2  # Stop after two epochs without a new best validation loss.
best_epoch = int(np.argmin(val_losses))  # Find the epoch index with the lowest validation loss.
epochs_since_best = len(val_losses) - 1 - best_epoch  # Count how many epochs have passed since the best checkpoint.
should_stop = epochs_since_best >= patience  # Apply the early-stopping rule.
print(f"best epoch = {best_epoch}")  # Print the best checkpoint index.
print(f"epochs since best = {epochs_since_best}")  # Print the patience counter.
print(f"stop now? {should_stop}")  # Print the decision.
fig, ax = plt.subplots()  # Create a validation-loss curve.
ax.plot(np.arange(len(val_losses)), val_losses, marker="o")  # Plot validation loss by epoch.
ax.axvline(best_epoch, color="tab:green", linestyle="--", label="best")  # Mark the best epoch.
ax.set_xlabel("epoch")  # Label the epoch axis.
ax.set_ylabel("validation loss")  # Label the monitored metric.
ax.set_title("B7 early-stopping patience check")  # State the decision primitive.
ax.legend()  # Show the best marker.
plt.show()  # Render the curve.
```

▶ What you'll see: the best validation loss was two epochs ago, so patience 2 says to stop.

👀 **Takeaway:** early stopping uses held-out validation history, not just the latest training loss.

---

#### B8. Weight norm before and after one L2 step

Goal: see how an L2-only update shrinks a weight vector.

```python
theta = np.array([3.0, 4.0])  # Store a vector with norm five.
eta = 0.1  # Store the learning rate.
lambda_l2 = 0.2  # Store the L2 strength.
theta_new = theta - eta * (2.0 * lambda_l2 * theta)  # Apply one update using only the L2 gradient.
norm_before = np.linalg.norm(theta)  # Compute the starting weight norm.
norm_after = np.linalg.norm(theta_new)  # Compute the post-update weight norm.
print(f"norm before = {norm_before:.3f}")  # Print the original norm.
print(f"norm after = {norm_after:.3f}")  # Print the shrunken norm.
fig, ax = plt.subplots()  # Create a norm comparison.
ax.bar(["before", "after"], [norm_before, norm_after], color=["tab:red", "tab:green"])  # Plot norm before and after decay.
ax.set_ylabel("L2 norm")  # Label the metric.
ax.set_title("B8 L2-only update shrinks the weight norm")  # State the effect.
plt.show()  # Render the bars.
```

▶ What you'll see: the norm decreases because the update subtracts a positive fraction of the weights.

👀 **Takeaway:** with no data gradient, $L_2$ acts exactly like multiplicative weight decay.

---

#### B9. Add a penalty to a base loss

Goal: combine data loss and regularization into one objective value.

```python
base_loss = 1.2  # Store the empirical data loss.
theta = np.array([1.0, -2.0])  # Store a tiny weight vector.
lambda_l2 = 0.1  # Store the L2 strength.
penalty = lambda_l2 * np.sum(theta ** 2)  # Compute the L2 penalty contribution.
total_loss = base_loss + penalty  # Add data loss and penalty to get the optimized objective.
print(f"base loss = {base_loss:.2f}")  # Print data loss.
print(f"penalty = {penalty:.2f}")  # Print regularization cost.
print(f"total objective = {total_loss:.2f}")  # Print combined objective.
fig, ax = plt.subplots()  # Create a stacked objective plot.
ax.bar(["objective"], [base_loss], label="base loss", color="gray")  # Plot base loss at the bottom.
ax.bar(["objective"], [penalty], bottom=[base_loss], label="L2 penalty", color="tab:blue")  # Stack penalty above base loss.
ax.set_ylabel("loss")  # Label the vertical axis.
ax.set_title("B9 regularization adds to the objective")  # State the primitive.
ax.legend()  # Show stacked components.
plt.show()  # Render the stack.
```

▶ What you'll see: the optimizer sees the sum, so regularization can change which parameter values look best.

👀 **Takeaway:** regularization is not a separate report card; it is part of the objective being minimized.

---

#### B10. Effect of lambda on one weight

Goal: compare how two $L_2$ strengths shrink the same scalar weight in one step.

```python
w = 5.0  # Store one scalar weight.
eta = 0.1  # Store the learning rate.
lambdas = np.array([0.01, 0.20])  # Compare weak and strong L2 regularization.
new_weights = w - eta * (2.0 * lambdas * w)  # Apply the L2-only update for each lambda.
print("lambdas:", lambdas)  # Print regularization strengths.
print("weights after one L2 step:", np.round(new_weights, 3))  # Print resulting weights.
fig, ax = plt.subplots()  # Create a comparison plot.
ax.bar(["λ=0.01", "λ=0.20"], new_weights, color=["tab:blue", "tab:orange"])  # Plot post-update weights.
ax.axhline(w, color="black", linestyle="--", label="before")  # Mark the original weight.
ax.set_ylabel("weight after step")  # Label the outcome.
ax.set_title("B10 larger lambda causes stronger shrinkage")  # State the effect.
ax.legend()  # Show before line.
plt.show()  # Render the bars.
```

▶ What you'll see: the larger regularization strength pulls the weight farther toward zero.

👀 **Takeaway:** $\lambda$ controls how expensive large weights are and therefore how hard weight decay pushes.

---


### 🟡 Easy

#### E1. Hand-compute L2-regularized loss, gradient, and update

**Problem.** Let

$$
\theta=\begin{bmatrix}3\\4\end{bmatrix},\qquad
J_{\text{data}}(\theta)=2.0,
\qquad
\lambda=0.1,
\qquad
\nabla J_{\text{data}}(\theta)=\begin{bmatrix}1\\-2\end{bmatrix},
\qquad
\eta=0.05.
$$

Compute $J_{L_2}$, $\nabla J_{L_2}$, and one gradient step.

**Step-by-step solution.** The $L_2$ objective is

$$
J_{L_2}(\theta)=J_{\text{data}}(\theta)+\lambda\lVert\theta\rVert_2^2.
$$

Compute the squared norm:

$$
\lVert\theta\rVert_2^2=3^2+4^2=9+16=25.
$$

Compute the penalty:

$$
\lambda\lVert\theta\rVert_2^2=0.1(25)=2.5.
$$

Compute the total objective:

$$
J_{L_2}(\theta)=2.0+2.5=4.5.
$$

The $L_2$ gradient contribution is

$$
\nabla_\theta\lambda\lVert\theta\rVert_2^2=2\lambda\theta.
$$

Substitute:

$$
2\lambda\theta=2(0.1)\begin{bmatrix}3\\4\end{bmatrix}
=0.2\begin{bmatrix}3\\4\end{bmatrix}
=\begin{bmatrix}0.6\\0.8\end{bmatrix}.
$$

Add the data gradient:

$$
\nabla J_{L_2}(\theta)
=\begin{bmatrix}1\\-2\end{bmatrix}+\begin{bmatrix}0.6\\0.8\end{bmatrix}
=\begin{bmatrix}1.6\\-1.2\end{bmatrix}.
$$

Apply one step:

$$
\theta^+=\theta-\eta\nabla J_{L_2}(\theta)
=\begin{bmatrix}3\\4\end{bmatrix}-0.05\begin{bmatrix}1.6\\-1.2\end{bmatrix}.
$$

Compute coordinates:

$$
\theta^+=\begin{bmatrix}3-0.08\\4+0.06\end{bmatrix}
=\begin{bmatrix}2.92\\4.06\end{bmatrix}.
$$

**Boxed answer.**

$$
\boxed{J_{L_2}=4.5,
\qquad
\nabla J_{L_2}=\begin{bmatrix}1.6\\-1.2\end{bmatrix},
\qquad
\theta^+=\begin{bmatrix}2.92\\4.06\end{bmatrix}.}
$$

```python
theta = np.array([3.0, 4.0])  # Store the starting two-dimensional weight vector.
data_grad = np.array([1.0, -2.0])  # Store the unregularized gradient from the data loss.
lambda_l2 = 0.1  # Store the L2 strength from the hand calculation.
eta = 0.05  # Store the learning rate from the hand calculation.
l2_grad = 2.0 * lambda_l2 * theta  # Compute the L2 gradient contribution 2 lambda theta.
total_grad = data_grad + l2_grad  # Add data gradient and penalty gradient.
theta_next = theta - eta * total_grad  # Take one penalized gradient step.
print(f"L2 gradient = {l2_grad}")  # Verify the penalty gradient.
print(f"total gradient = {total_grad}")  # Verify the full gradient.
print(f"next theta = {theta_next}")  # Verify the updated weights.
fig, ax = plt.subplots()  # Create a two-dimensional update diagram.
ax.quiver(0, 0, theta[0], theta[1], angles="xy", scale_units="xy", scale=1, color="gray", label="theta")  # Draw the original weight vector.
ax.quiver(theta[0], theta[1], theta_next[0] - theta[0], theta_next[1] - theta[1], angles="xy", scale_units="xy", scale=1, color="tab:blue", label="update")  # Draw the update arrow.
ax.scatter([theta[0], theta_next[0]], [theta[1], theta_next[1]], c=["gray", "tab:blue"])  # Mark start and end points.
ax.set_xlim(0, 4)  # Set x-limits to include both vectors.
ax.set_ylim(0, 5)  # Set y-limits to include both vectors.
ax.set_aspect("equal")  # Use equal aspect so vector lengths are visually meaningful.
ax.set_title("E1 L2 adds a shrinkage component to the update")  # Explain the plot.
ax.legend()  # Show the vector labels.
plt.show()  # Render the update diagram.
```

▶ What you'll see: the code reproduces the boxed gradient and shows the penalized update in weight space.

👀 **Takeaway:** $L_2$ changes the direction of the update by adding a component proportional to the current weight vector.

---

#### E2. Hand-apply inverted dropout to one hidden layer

**Problem.** Let

$$
a=\begin{bmatrix}2\\0\\4\\6\end{bmatrix},
\qquad
m=\begin{bmatrix}1\\0\\1\\0\end{bmatrix},
\qquad
q=0.5.
$$

Compute $a_{\text{drop}}=m\odot a/q$.

**Step-by-step solution.** First multiply elementwise:

$$
m\odot a=\begin{bmatrix}1\cdot2\\0\cdot0\\1\cdot4\\0\cdot6\end{bmatrix}
=\begin{bmatrix}2\\0\\4\\0\end{bmatrix}.
$$

Then divide by the keep probability:

$$
a_{\text{drop}}=\frac{1}{0.5}\begin{bmatrix}2\\0\\4\\0\end{bmatrix}
=2\begin{bmatrix}2\\0\\4\\0\end{bmatrix}
=\begin{bmatrix}4\\0\\8\\0\end{bmatrix}.
$$

Check the expectation for one coordinate:

$$
\mathbb{E}\left[\frac{m_j a_j}{q}\right]
=\frac{a_j}{q}\mathbb{E}[m_j]
=\frac{a_j}{q}q
=a_j.
$$

**Boxed answer.**

$$
\boxed{a_{\text{drop}}=\begin{bmatrix}4\\0\\8\\0\end{bmatrix}.}
$$

```python
a = np.array([2.0, 0.0, 4.0, 6.0])  # Store the hidden-layer activations.
mask = np.array([1.0, 0.0, 1.0, 0.0])  # Store the dropout mask used in the derivation.
q = 0.5  # Store the keep probability.
a_after = mask * a / q  # Compute inverted dropout exactly as in the formula.
labels = ["unit 1", "unit 2", "unit 3", "unit 4"]  # Create readable neuron labels.
fig, ax = plt.subplots()  # Create one dropout diagram.
ax.bar(labels, a, alpha=0.45, label="before", color="gray")  # Draw original activations.
ax.bar(labels, a_after, alpha=0.75, label="after inverted dropout", color="tab:orange")  # Draw scaled kept activations.
for index, kept in enumerate(mask):  # Loop through neurons to annotate dropped units.
    if kept == 0.0:  # Identify neurons removed by dropout.
        ax.text(index, 0.25, "dropped", ha="center", color="red")  # Mark dropped neurons on the chart.
ax.set_ylabel("activation")  # Label activation magnitude.
ax.set_title("E2 dropout removes units and scales survivors")  # State the transformation.
ax.legend()  # Show before and after labels.
plt.show()  # Render the dropout bars.
```

▶ What you'll see: only units 1 and 3 remain active, and their heights double.

👀 **Takeaway:** dropout is multiplicative noise during training, not a permanent pruning of neurons.

---

#### E3. Early stopping from a validation-loss sequence

**Problem.** A model is trained for eight epochs with validation losses

$$
[0.90,0.70,0.55,0.48,0.47,0.50,0.54,0.60].
$$

Using patience $2$, find the best epoch and the stopping epoch.

**Step-by-step solution.** Write the sequence with epoch numbers:

$$
\begin{array}{c|cccccccc}
\text{epoch} & 1&2&3&4&5&6&7&8\\
\hline
V_t &0.90&0.70&0.55&0.48&0.47&0.50&0.54&0.60
\end{array}
$$

The minimum validation loss is

$$
\min_t V_t=0.47,
$$

which occurs at

$$
t^*=5.
$$

After epoch $5$, the next losses are

$$
V_6=0.50>0.47,
\qquad
V_7=0.54>0.47.
$$

That is two consecutive non-improvements. With patience $2$, training stops at epoch $7$ while restoring the epoch-$5$ checkpoint.

**Boxed answer.**

$$
\boxed{\text{best checkpoint}=5,
\qquad
\text{stop after epoch}=7.}
$$

```python
epochs = np.arange(1, 9)  # Create epoch numbers from 1 through 8.
train_losses = np.array([1.05, 0.82, 0.63, 0.49, 0.39, 0.31, 0.25, 0.20])  # Store monotonically decreasing training losses.
val_losses = np.array([0.90, 0.70, 0.55, 0.48, 0.47, 0.50, 0.54, 0.60])  # Store validation losses that eventually rise.
best_index = int(np.argmin(val_losses))  # Find the zero-based index of the best validation loss.
best_epoch = int(epochs[best_index])  # Convert the best index to a human epoch number.
stop_epoch = 7  # Store the patience-two stopping epoch from the hand derivation.
fig, ax = plt.subplots()  # Create a training-curve plot.
ax.plot(epochs, train_losses, marker="o", label="train loss")  # Draw the training loss curve.
ax.plot(epochs, val_losses, marker="o", label="validation loss")  # Draw the validation loss curve.
ax.axvline(best_epoch, color="tab:green", linestyle="--", label="best checkpoint")  # Mark the validation minimum.
ax.axvline(stop_epoch, color="tab:red", linestyle=":", label="stop epoch")  # Mark the stopping epoch.
ax.set_xlabel("epoch")  # Label the horizontal axis.
ax.set_ylabel("loss")  # Label the vertical axis.
ax.set_title("E3 early stopping restores the best validation checkpoint")  # State the lesson.
ax.legend()  # Show curve and marker labels.
plt.show()  # Render the early-stopping plot.
```

▶ What you'll see: validation loss bottoms out at epoch 5, then patience triggers stopping after epoch 7.

👀 **Takeaway:** early stopping uses validation loss to choose a checkpoint, not the final epoch.

---

#### E4. Batch normalization on one mini-batch

**Problem.** For

$$
z=[1,2,5,6],\qquad \gamma=2,
\qquad \beta=-1,
\qquad \epsilon=0,
$$

compute batch-normalized outputs.

**Step-by-step solution.** Compute the batch mean:

$$
\mu_B=\frac{1+2+5+6}{4}=\frac{14}{4}=3.5.
$$

Compute centered values:

$$
z-\mu_B=[-2.5,-1.5,1.5,2.5].
$$

Compute variance:

$$
\sigma_B^2=\frac{(-2.5)^2+(-1.5)^2+(1.5)^2+(2.5)^2}{4}
=\frac{6.25+2.25+2.25+6.25}{4}
=\frac{17}{4}=4.25.
$$

Compute the standard deviation:

$$
\sigma_B=\sqrt{4.25}\approx2.0616.
$$

Normalize:

$$
\hat z=\frac{z-\mu_B}{\sigma_B}
\approx[-1.2127,-0.7276,0.7276,1.2127].
$$

Scale and shift:

$$
\tilde z=\gamma\hat z+\beta=2\hat z-1.
$$

Therefore

$$
\tilde z\approx[-3.4254,-2.4552,0.4552,1.4254].
$$

**Boxed answer.**

$$
\boxed{\tilde z\approx[-3.4254,-2.4552,0.4552,1.4254].}
$$

```python
z = np.array([1.0, 2.0, 5.0, 6.0])  # Store the mini-batch pre-activations.
gamma_bn = 2.0  # Store the learned batch-norm scale parameter.
beta_bn = -1.0  # Store the learned batch-norm shift parameter.
epsilon = 0.0  # Use zero epsilon here to match the hand calculation.
mu = np.mean(z)  # Compute the mini-batch mean.
var = np.mean((z - mu) ** 2)  # Compute the mini-batch variance.
z_hat = (z - mu) / np.sqrt(var + epsilon)  # Normalize using the batch mean and variance.
z_tilde = gamma_bn * z_hat + beta_bn  # Apply learned scale and shift.
print(f"mean = {mu:.4f}, variance = {var:.4f}")  # Print the statistics.
print(f"z_hat = {np.round(z_hat, 4)}")  # Print normalized values.
print(f"z_tilde = {np.round(z_tilde, 4)}")  # Print final batch-norm outputs.
fig, ax = plt.subplots()  # Create a before-after histogram figure.
ax.hist(z, bins=4, alpha=0.55, label="raw z")  # Plot raw pre-activations.
ax.hist(z_hat, bins=4, alpha=0.55, label="normalized z_hat")  # Plot normalized values.
ax.hist(z_tilde, bins=4, alpha=0.55, label="scaled shifted z_tilde")  # Plot final outputs.
ax.set_title("E4 batch norm centers, scales, then shifts")  # Explain the transformation.
ax.legend()  # Show distribution labels.
plt.show()  # Render the histograms.
```

▶ What you'll see: the normalized values have mean near zero and standard deviation near one before learned scale/shift.

👀 **Takeaway:** batch norm standardizes using mini-batch statistics, then lets the network relearn scale and offset.

---

#### E5. Gradient checking a scalar neuron

**Problem.** Let

$$
f(w)=w^3,
\qquad
w=2,
\qquad
h=10^{-4}.
$$

Compare the analytical derivative with the centered finite-difference derivative.

**Step-by-step solution.** The analytical derivative is

$$
f'(w)=3w^2.
$$

At $w=2$,

$$
f'(2)=3(2)^2=12.
$$

The numerical centered difference is

$$
g_{\text{num}}=\frac{f(w+h)-f(w-h)}{2h}.
$$

Substitute $w=2$:

$$
g_{\text{num}}=\frac{(2+10^{-4})^3-(2-10^{-4})^3}{2\cdot10^{-4}}.
$$

Use the identity $(a+b)^3-(a-b)^3=6a^2b+2b^3$ with $a=2$ and $b=10^{-4}$:

$$
(2+h)^3-(2-h)^3=6(2)^2h+2h^3=24h+2h^3.
$$

Divide by $2h$:

$$
g_{\text{num}}=\frac{24h+2h^3}{2h}=12+h^2.
$$

With $h=10^{-4}$,

$$
g_{\text{num}}=12+10^{-8}=12.00000001.
$$

**Boxed answer.**

$$
\boxed{g_{\text{analytic}}=12,
\qquad
 g_{\text{numeric}}=12.00000001,
\qquad
\text{difference}=10^{-8}.}
$$

```python
def f_scalar(w):  # Define the scalar function whose gradient we check.
    return w ** 3  # Return w cubed so the exact derivative is simple.
w = 2.0  # Store the evaluation point.
analytic_grad = 3.0 * w ** 2  # Compute the exact derivative 3w^2.
h_values = np.logspace(-1, -8, 8)  # Create step sizes from coarse to very small.
errors = []  # Create an empty list for absolute gradient errors.
for h in h_values:  # Loop over candidate finite-difference step sizes.
    numeric_grad = (f_scalar(w + h) - f_scalar(w - h)) / (2.0 * h)  # Compute the centered finite difference.
    errors.append(abs(numeric_grad - analytic_grad))  # Store the absolute mismatch.
print(f"analytic gradient at w=2 is {analytic_grad:.8f}")  # Print the exact gradient.
print(f"numeric gradient at h=1e-4 is {(f_scalar(w + 1e-4) - f_scalar(w - 1e-4)) / (2e-4):.8f}")  # Print the requested check.
fig, ax = plt.subplots()  # Create an error-versus-step plot.
ax.loglog(h_values, errors, marker="o")  # Plot gradient-check error on log-log axes.
ax.set_xlabel("finite-difference step h")  # Label the step-size axis.
ax.set_ylabel("absolute error")  # Label the error axis.
ax.set_title("E5 gradient checking: too-large and too-small h can both hurt")  # Explain the trade-off.
ax.invert_xaxis()  # Show smaller h values toward the right.
plt.show()  # Render the gradient-check plot.
```

▶ What you'll see: the numerical gradient is essentially 12 near $h=10^{-4}$; the error curve illustrates finite-difference trade-offs.

👀 **Takeaway:** gradient checking is a debugging tool for implementations, not a replacement for backprop in training.

---

### 🔴 Advanced

#### A1. Failure case: overfitting without regularization, then fixing it with L2

Goal: use a noisy nonlinear classification problem to show a large train-validation gap and then reduce it with $L_2$.

```python
X_moons, y_moons = make_moons(n_samples=420, noise=0.32, random_state=SEED)  # Create a noisy nonlinear classification dataset.
X_moons = StandardScaler().fit_transform(X_moons)  # Standardize the two features for stable MLP optimization.
X_tr, X_hold, y_tr, y_hold = train_test_split(X_moons, y_moons, test_size=0.40, random_state=SEED, stratify=y_moons)  # Split into training and held-out data.
X_va, X_te, y_va, y_te = train_test_split(X_hold, y_hold, test_size=0.50, random_state=SEED, stratify=y_hold)  # Split held-out data into validation and test sets.
models = {"no regularization": MLPClassifier(hidden_layer_sizes=(80, 80), alpha=0.0, max_iter=1, warm_start=True, random_state=SEED, learning_rate_init=0.03), "L2 regularization": MLPClassifier(hidden_layer_sizes=(80, 80), alpha=0.08, max_iter=1, warm_start=True, random_state=SEED, learning_rate_init=0.03)}  # Create matched MLPs that differ mainly in L2 strength.
histories = {}  # Create a dictionary for train and validation loss curves.
for name, model in models.items():  # Train each model epoch by epoch so curves are visible.
    train_curve = []  # Store training log-loss values for this model.
    val_curve = []  # Store validation log-loss values for this model.
    for epoch in range(80):  # Run a modest number of CPU-friendly epochs.
        model.fit(X_tr, y_tr)  # Advance the warm-start MLP by one optimizer iteration.
        train_prob = model.predict_proba(X_tr)  # Compute predicted probabilities on training data.
        val_prob = model.predict_proba(X_va)  # Compute predicted probabilities on validation data.
        train_curve.append(log_loss(y_tr, train_prob))  # Append train log loss for the epoch.
        val_curve.append(log_loss(y_va, val_prob))  # Append validation log loss for the epoch.
    histories[name] = (np.array(train_curve), np.array(val_curve), model)  # Save curves and final fitted model.
fig, axes = plt.subplots(1, 2, figsize=(12, 4))  # Create side-by-side panels for curves and decision boundary.
for name, (train_curve, val_curve, model) in histories.items():  # Plot curves for both regularization settings.
    axes[0].plot(train_curve, label=f"{name} train")  # Draw the training curve.
    axes[0].plot(val_curve, linestyle="--", label=f"{name} validation")  # Draw the validation curve.
axes[0].set_xlabel("epoch")  # Label epochs.
axes[0].set_ylabel("log loss")  # Label loss values.
axes[0].set_title("A1 L2 reduces the train-validation gap")  # State the comparison.
axes[0].legend(fontsize=8)  # Show curve labels.
xx, yy = np.meshgrid(np.linspace(X_moons[:, 0].min() - 0.4, X_moons[:, 0].max() + 0.4, 160), np.linspace(X_moons[:, 1].min() - 0.4, X_moons[:, 1].max() + 0.4, 160))  # Build a grid for the boundary.
grid = np.c_[xx.ravel(), yy.ravel()]  # Flatten the grid into model inputs.
best_model = histories["L2 regularization"][2]  # Choose the regularized model for the boundary plot.
zz = best_model.predict_proba(grid)[:, 1].reshape(xx.shape)  # Compute class-one probabilities on the grid.
axes[1].contourf(xx, yy, zz, levels=20, cmap="coolwarm", alpha=0.75)  # Plot the smooth probability field.
axes[1].scatter(X_va[:, 0], X_va[:, 1], c=y_va, cmap="coolwarm", edgecolor="k", s=24)  # Overlay validation points.
axes[1].set_title("Regularized decision boundary on validation data")  # Label the boundary plot.
plt.tight_layout()  # Prevent overlap between panels.
plt.show()  # Render the advanced comparison.
```

▶ What you'll see: the unregularized curve can keep chasing the training set while validation loss stops improving; the L2 model usually has a smaller gap and smoother boundary.

👀 **Takeaway:** an overfitting failure case is recognized by validation loss, not by whether training loss is low.

---

#### A2. L1 vs L2 vs elastic net on redundant features

Goal: compare sparsity and shrinkage when features are correlated or irrelevant.

```python
X_base, y_reg = make_regression(n_samples=260, n_features=6, n_informative=3, noise=18.0, random_state=SEED)  # Create a noisy regression problem.
X_reg = np.c_[X_base, X_base[:, 0] + 0.03 * rng.normal(size=X_base.shape[0]), rng.normal(size=X_base.shape[0])]  # Add one redundant feature and one noise feature.
X_reg = StandardScaler().fit_transform(X_reg)  # Standardize features so penalty magnitudes are comparable.
Xr_tr, Xr_te, yr_tr, yr_te = train_test_split(X_reg, y_reg, test_size=0.35, random_state=SEED)  # Split regression data into train and test sets.
alphas = np.logspace(-3, 1, 18)  # Create penalty strengths from weak to strong.
ridge_norms = []  # Store Ridge coefficient norms.
lasso_nonzeros = []  # Store Lasso nonzero counts.
enet_nonzeros = []  # Store Elastic Net nonzero counts.
for alpha in alphas:  # Sweep regularization strength.
    ridge = Ridge(alpha=alpha).fit(Xr_tr, yr_tr)  # Fit L2-regularized regression.
    lasso = Lasso(alpha=alpha, max_iter=10000, random_state=SEED).fit(Xr_tr, yr_tr)  # Fit L1-regularized regression.
    enet = ElasticNet(alpha=alpha, l1_ratio=0.5, max_iter=10000, random_state=SEED).fit(Xr_tr, yr_tr)  # Fit mixed L1/L2 regression.
    ridge_norms.append(np.linalg.norm(ridge.coef_))  # Record Ridge shrinkage as coefficient norm.
    lasso_nonzeros.append(np.count_nonzero(np.abs(lasso.coef_) > 1e-6))  # Count Lasso selected features.
    enet_nonzeros.append(np.count_nonzero(np.abs(enet.coef_) > 1e-6))  # Count Elastic Net selected features.
final_ridge = Ridge(alpha=1.0).fit(Xr_tr, yr_tr)  # Fit a representative Ridge model for histograms.
final_lasso = Lasso(alpha=1.0, max_iter=10000, random_state=SEED).fit(Xr_tr, yr_tr)  # Fit a representative Lasso model for histograms.
final_enet = ElasticNet(alpha=1.0, l1_ratio=0.5, max_iter=10000, random_state=SEED).fit(Xr_tr, yr_tr)  # Fit a representative Elastic Net model.
fig, axes = plt.subplots(1, 2, figsize=(12, 4))  # Create panels for paths and coefficient magnitudes.
axes[0].semilogx(alphas, ridge_norms, marker="o", label="Ridge coefficient norm")  # Plot L2 shrinkage path.
axes[0].semilogx(alphas, lasso_nonzeros, marker="o", label="Lasso nonzero count")  # Plot L1 sparsity path.
axes[0].semilogx(alphas, enet_nonzeros, marker="o", label="Elastic Net nonzero count")  # Plot mixed sparsity path.
axes[0].set_xlabel("regularization strength alpha")  # Label penalty strength.
axes[0].set_title("A2 stronger penalties shrink or zero coefficients")  # State path behavior.
axes[0].legend(fontsize=8)  # Show path labels.
axes[1].hist(final_ridge.coef_, alpha=0.55, label="Ridge")  # Plot Ridge coefficients.
axes[1].hist(final_lasso.coef_, alpha=0.55, label="Lasso")  # Plot Lasso coefficients.
axes[1].hist(final_enet.coef_, alpha=0.55, label="Elastic Net")  # Plot Elastic Net coefficients.
axes[1].set_title("Coefficient histograms at alpha=1")  # Label the histogram comparison.
axes[1].legend(fontsize=8)  # Show model labels.
plt.tight_layout()  # Improve spacing.
plt.show()  # Render the coefficient comparison.
```

▶ What you'll see: Ridge mostly shrinks all coefficients, while Lasso and Elastic Net can drive some coefficients exactly to zero.

👀 **Takeaway:** $L_1$ is useful for variable selection; $L_2$ is useful for smooth shrinkage under correlated features.

---

#### A3. Dropout-rate sweep with a CPU approximation

Goal: simulate dropout-like input corruption on digits and show underfitting when the dropout rate is too high.

```python
digits = load_digits()  # Load small handwritten digits data.
X_digits = digits.data / 16.0  # Normalize pixels to the unit interval.
y_digits = digits.target  # Store digit labels.
Xd_tr, Xd_hold, yd_tr, yd_hold = train_test_split(X_digits, y_digits, test_size=0.40, random_state=SEED, stratify=y_digits)  # Split into train and held-out data.
Xd_va, Xd_te, yd_va, yd_te = train_test_split(Xd_hold, yd_hold, test_size=0.50, random_state=SEED, stratify=yd_hold)  # Split held-out data into validation and test data.
drop_rates = np.array([0.0, 0.15, 0.30, 0.50, 0.70])  # Choose dropout-like corruption rates to test.
train_scores = []  # Store train accuracies.
val_scores = []  # Store validation accuracies.
weight_norms = []  # Store fitted weight norms as a rough magnitude diagnostic.
for drop_rate in drop_rates:  # Sweep corruption strengths.
    keep_prob = 1.0 - drop_rate  # Convert drop probability to keep probability.
    corruption_mask = rng.binomial(1, keep_prob, size=Xd_tr.shape) / max(keep_prob, 1e-8)  # Sample inverted input-dropout mask.
    X_aug = Xd_tr * corruption_mask  # Apply dropout-like corruption to the training inputs only.
    clf = LogisticRegression(max_iter=800, C=2.0, solver="lbfgs", multi_class="auto", random_state=SEED)  # Create a regularized multiclass classifier.
    clf.fit(X_aug, yd_tr)  # Fit on corrupted inputs to mimic dropout robustness pressure.
    train_scores.append(accuracy_score(yd_tr, clf.predict(Xd_tr)))  # Evaluate clean training accuracy.
    val_scores.append(accuracy_score(yd_va, clf.predict(Xd_va)))  # Evaluate clean validation accuracy.
    weight_norms.append(np.linalg.norm(clf.coef_))  # Record coefficient magnitude.
fig, axes = plt.subplots(1, 2, figsize=(12, 4))  # Create accuracy and weight-magnitude panels.
axes[0].plot(drop_rates, train_scores, marker="o", label="train accuracy")  # Plot train accuracy versus dropout rate.
axes[0].plot(drop_rates, val_scores, marker="o", label="validation accuracy")  # Plot validation accuracy versus dropout rate.
axes[0].set_xlabel("input dropout-like rate")  # Label the corruption rate.
axes[0].set_ylabel("accuracy")  # Label accuracy.
axes[0].set_title("A3 too much dropout-like noise underfits")  # Explain the sweep.
axes[0].legend()  # Show score labels.
axes[1].bar([str(rate) for rate in drop_rates], weight_norms, color="tab:purple")  # Plot weight norms by corruption rate.
axes[1].set_xlabel("drop rate")  # Label drop-rate bars.
axes[1].set_ylabel("coefficient norm")  # Label magnitude diagnostic.
axes[1].set_title("Weight magnitude changes under corruption")  # Explain the second panel.
plt.tight_layout()  # Improve panel spacing.
plt.show()  # Render the dropout sweep.
```

▶ What you'll see: moderate corruption can preserve validation accuracy, while extreme corruption removes too much information and underfits.

👀 **Takeaway:** dropout has a tuning range; more dropout is not automatically better.

---

#### A4. Early stopping plus checkpoint selection

Goal: train epoch by epoch, choose the validation-best checkpoint, and compare it with the final model.

```python
X_es, y_es = make_moons(n_samples=360, noise=0.30, random_state=SEED + 1)  # Create another noisy classification dataset.
X_es = StandardScaler().fit_transform(X_es)  # Standardize features for the MLP.
Xe_tr, Xe_hold, ye_tr, ye_hold = train_test_split(X_es, y_es, test_size=0.45, random_state=SEED, stratify=y_es)  # Create train and held-out splits.
Xe_va, Xe_te, ye_va, ye_te = train_test_split(Xe_hold, ye_hold, test_size=0.50, random_state=SEED, stratify=ye_hold)  # Create validation and test splits.
es_model = MLPClassifier(hidden_layer_sizes=(60, 60), alpha=0.002, max_iter=1, warm_start=True, random_state=SEED, learning_rate_init=0.025)  # Create a warm-start MLP.
train_losses_es = []  # Store training losses.
val_losses_es = []  # Store validation losses.
best_val = np.inf  # Initialize the best validation loss as infinity.
best_epoch = -1  # Initialize the best epoch marker.
best_weights = None  # Reserve space for the best model weights.
best_biases = None  # Reserve space for the best model biases.
for epoch in range(90):  # Train for a fixed budget so early stopping can choose within it.
    es_model.fit(Xe_tr, ye_tr)  # Advance training by one optimizer iteration.
    tr_prob = es_model.predict_proba(Xe_tr)  # Compute train probabilities.
    va_prob = es_model.predict_proba(Xe_va)  # Compute validation probabilities.
    tr_loss = log_loss(ye_tr, tr_prob)  # Compute train log loss.
    va_loss = log_loss(ye_va, va_prob)  # Compute validation log loss.
    train_losses_es.append(tr_loss)  # Record train loss.
    val_losses_es.append(va_loss)  # Record validation loss.
    if va_loss < best_val:  # Check whether this epoch is the best validation checkpoint.
        best_val = va_loss  # Update the best validation loss.
        best_epoch = epoch + 1  # Store a one-based epoch number.
        best_weights = [coef.copy() for coef in es_model.coefs_]  # Copy weights for checkpoint restoration.
        best_biases = [bias.copy() for bias in es_model.intercepts_]  # Copy biases for checkpoint restoration.
final_test_acc = accuracy_score(ye_te, es_model.predict(Xe_te))  # Evaluate the final epoch on test data.
es_model.coefs_ = best_weights  # Restore best-checkpoint weights.
es_model.intercepts_ = best_biases  # Restore best-checkpoint biases.
best_test_acc = accuracy_score(ye_te, es_model.predict(Xe_te))  # Evaluate the restored checkpoint on test data.
fig, ax = plt.subplots()  # Create a checkpoint-selection plot.
ax.plot(train_losses_es, label="train loss")  # Draw the training curve.
ax.plot(val_losses_es, label="validation loss")  # Draw the validation curve.
ax.axvline(best_epoch - 1, color="tab:green", linestyle="--", label=f"best epoch {best_epoch}")  # Mark the selected checkpoint.
ax.set_xlabel("epoch")  # Label epochs.
ax.set_ylabel("log loss")  # Label loss.
ax.set_title(f"A4 restored test acc={best_test_acc:.3f}, final test acc={final_test_acc:.3f}")  # Compare final and restored checkpoints.
ax.legend()  # Show curve labels.
plt.show()  # Render the early-stopping curve.
```

▶ What you'll see: the selected checkpoint is the validation minimum, which can outperform or match the final epoch on test accuracy.

👀 **Takeaway:** early stopping is a model-selection rule over epochs.

---

#### A5. Batch norm as a good practice and its edge cases

Goal: see why activation scale matters, and why tiny batches make batch statistics noisy.

```python
X_bn, y_bn = make_moons(n_samples=320, noise=0.25, random_state=SEED + 2)  # Create a nonlinear dataset for activation diagnostics.
X_bad_scale = np.c_[100.0 * X_bn[:, 0], 0.01 * X_bn[:, 1]]  # Deliberately put features on incompatible scales.
X_good_scale = StandardScaler().fit_transform(X_bad_scale)  # Standardize features as a batch-norm-like first fix.
W1 = rng.normal(scale=1.0, size=(2, 40))  # Create first-layer random weights.
b1 = rng.normal(scale=0.1, size=40)  # Create first-layer random biases.
raw_pre = X_bad_scale @ W1 + b1  # Compute pre-activations from badly scaled inputs.
scaled_pre = X_good_scale @ W1 + b1  # Compute pre-activations from standardized inputs.
raw_relu = np.maximum(raw_pre, 0.0)  # Apply ReLU to raw-scale pre-activations.
scaled_relu = np.maximum(scaled_pre, 0.0)  # Apply ReLU to standardized pre-activations.
small_batch = raw_pre[:4, 0]  # Select four examples to mimic a very small batch statistic.
large_batch = raw_pre[:128, 0]  # Select many examples to mimic a stable batch statistic.
small_mean = np.mean(small_batch)  # Compute the small-batch mean.
large_mean = np.mean(large_batch)  # Compute the larger-batch mean.
fig, axes = plt.subplots(1, 3, figsize=(14, 4))  # Create activation and batch-stat panels.
axes[0].hist(raw_pre.ravel(), bins=35, alpha=0.75, label="badly scaled inputs")  # Plot raw pre-activation distribution.
axes[0].hist(scaled_pre.ravel(), bins=35, alpha=0.75, label="standardized inputs")  # Plot standardized pre-activation distribution.
axes[0].set_title("Pre-activation scale before ReLU")  # Label pre-activation comparison.
axes[0].legend(fontsize=8)  # Show distribution labels.
axes[1].hist(raw_relu.ravel(), bins=35, alpha=0.75, label="badly scaled")  # Plot ReLU outputs from raw-scale inputs.
axes[1].hist(scaled_relu.ravel(), bins=35, alpha=0.75, label="standardized")  # Plot ReLU outputs from standardized inputs.
axes[1].set_title("ReLU activations after scale change")  # Label activation comparison.
axes[1].legend(fontsize=8)  # Show activation labels.
axes[2].bar(["batch size 4", "batch size 128"], [small_mean, large_mean], color=["tab:red", "tab:blue"])  # Compare noisy and stable batch means.
axes[2].set_title("Tiny batches give noisier BN statistics")  # State the edge case.
axes[2].set_ylabel("mean of one pre-activation")  # Label the statistic.
plt.tight_layout()  # Improve spacing.
plt.show()  # Render batch-norm diagnostics.
```

▶ What you'll see: standardized inputs produce more controlled activations; the batch-size-4 statistic can differ sharply from the larger-batch estimate.

👀 **Takeaway:** batch norm improves activation conditioning, but very small batches can make its statistics noisy.

---

### Interactive Experiment

Use the sliders to vary $\lambda$ and dropout-like input corruption. The model trains quickly on noisy two-moons data and plots train versus validation curves.

```python
@interact(lambda_l2=FloatSlider(value=0.02, min=0.0, max=0.20, step=0.01, description="lambda"), dropout_rate=FloatSlider(value=0.10, min=0.0, max=0.70, step=0.05, description="dropout"))  # Create interactive sliders for regularization strength and corruption.
def regularization_experiment(lambda_l2, dropout_rate):  # Define the interactive experiment function.
    X_exp, y_exp = make_moons(n_samples=360, noise=0.32, random_state=SEED)  # Recreate a fixed noisy two-moons dataset.
    X_exp = StandardScaler().fit_transform(X_exp)  # Standardize features for neural-network optimization.
    Xe_tr, Xe_va, ye_tr, ye_va = train_test_split(X_exp, y_exp, test_size=0.35, random_state=SEED, stratify=y_exp)  # Build train and validation splits.
    keep_prob = 1.0 - dropout_rate  # Convert drop probability to keep probability.
    model = MLPClassifier(hidden_layer_sizes=(50, 50), alpha=lambda_l2, max_iter=1, warm_start=True, random_state=SEED, learning_rate_init=0.025)  # Create a warm-start MLP with slider-controlled L2.
    train_curve = []  # Store train log-loss values.
    val_curve = []  # Store validation log-loss values.
    local_rng = np.random.default_rng(SEED)  # Create a local random generator so slider reruns are reproducible.
    for epoch in range(55):  # Train for a short CPU-friendly budget.
        mask = local_rng.binomial(1, keep_prob, size=Xe_tr.shape) / max(keep_prob, 1e-8)  # Sample inverted input-dropout corruption.
        X_corrupt = Xe_tr * mask  # Apply corruption only to training inputs.
        model.fit(X_corrupt, ye_tr)  # Advance the model by one epoch on corrupted data.
        train_curve.append(log_loss(ye_tr, model.predict_proba(Xe_tr)))  # Evaluate clean train log loss.
        val_curve.append(log_loss(ye_va, model.predict_proba(Xe_va)))  # Evaluate clean validation log loss.
    fig, ax = plt.subplots(figsize=(7, 4))  # Create one curve plot for this slider setting.
    ax.plot(train_curve, label="train loss")  # Draw train loss over epochs.
    ax.plot(val_curve, label="validation loss")  # Draw validation loss over epochs.
    ax.set_xlabel("epoch")  # Label epochs.
    ax.set_ylabel("log loss")  # Label loss.
    ax.set_title(f"lambda={lambda_l2:.2f}, dropout-like rate={dropout_rate:.2f}")  # Show current slider values.
    ax.legend()  # Show curve labels.
    plt.show()  # Render the interactive output.
```

▶ What you'll see: small regularization may overfit, moderate regularization can reduce the validation gap, and excessive corruption can underfit both curves.

👀 **Try:** increase $\lambda$ until training loss rises noticeably, then adjust dropout and watch whether validation improves or degrades.
