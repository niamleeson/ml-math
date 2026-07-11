# SGD & Fine-tuning Models
> **Source:** CS 221 · **Category:** Method · **Type:** ⚖️ Both · [↑ Full reference](../../ai-ml-cheatsheets.md)
> 📓 The coded examples form a runnable notebook section; an `.ipynb` will be generated.

## ✍️ Toy Examples

These tiny optimizer toys isolate the mechanics before the full worked example: one stochastic step, learning-rate size, mini-batch averaging, momentum memory, and a fine-tuning freeze mask.

### ✍️ Toy 1 · One SGD step for squared loss

SGD uses one example to estimate a downhill direction. For squared loss, the gradient is residual times the feature vector.

```python
import numpy as np
import matplotlib.pyplot as plt

t1_rng = np.random.default_rng(0)  # -> reproducible generator seeded with 0
t1_x = np.array([-2.0, -1.0, 0.0, 1.0, 2.0, 3.0])  # -> six scalar inputs
t1_y = np.array([-3.0, -1.0, 1.0, 3.0, 5.0, 7.0])  # -> targets from y = 1 + 2x
t1_features = np.column_stack([np.ones(len(t1_x)), t1_x])  # -> bias plus x feature
t1_weights = np.array([0.0, 0.0])  # -> start at zero intercept and zero slope
t1_index = 4  # -> choose the fifth example for this stochastic update
t1_phi = t1_features[t1_index]  # -> [1.0, 2.0]
t1_target = t1_y[t1_index]  # -> 5.0
t1_prediction = t1_phi @ t1_weights  # -> 0.0
t1_residual = t1_prediction - t1_target  # -> -5.0
t1_gradient = t1_residual * t1_phi  # -> [-5.0, -10.0]
t1_eta = 0.1  # -> learning rate
t1_new_weights = t1_weights - t1_eta * t1_gradient  # -> [0.5, 1.0]
print("rng seed:", 0)
print("x:", t1_x.tolist())
print("y:", t1_y.tolist())
print("features:", t1_features.tolist())
print("old weights:", t1_weights.tolist())
print("chosen phi:", t1_phi.tolist())
print("chosen target:", float(t1_target))
print("prediction:", float(t1_prediction))
print("residual:", float(t1_residual))
print("gradient:", t1_gradient.tolist())
print("new weights:", t1_new_weights.tolist())
assert np.allclose(t1_gradient, [-5.0, -10.0])
assert np.allclose(t1_new_weights, [0.5, 1.0])

t1_before = t1_features @ t1_weights  # -> [0.0, 0.0, 0.0, 0.0, 0.0, 0.0]
t1_after = t1_features @ t1_new_weights  # -> [-1.5, -0.5, 0.5, 1.5, 2.5, 3.5]
t1_fig, t1_ax = plt.subplots(figsize=(6, 3.5))
t1_ax.scatter(t1_x, t1_y, color="black", label="targets")
t1_ax.plot(t1_x, t1_before, linestyle="--", label="before step")
t1_ax.plot(t1_x, t1_after, marker="o", label="after one SGD step")
t1_ax.set_title("One example nudges both intercept and slope")
t1_ax.set_xlabel("x")
t1_ax.set_ylabel("prediction")
t1_ax.legend()
plt.show()
```
▶ What you'll see: the selected example creates gradient [-5, -10], so the weights jump from [0, 0] to [0.5, 1.0].

### ✍️ Toy 2 · Learning rate controls update motion

On a one-dimensional quadratic, the learning rate decides whether steps crawl, converge quickly, or bounce outward.

```python
import numpy as np
import matplotlib.pyplot as plt

t2_rng = np.random.default_rng(0)  # -> reproducible generator seeded with 0
t2_etas = np.array([0.05, 0.25, 1.10])  # -> small, useful, too-large learning rates
t2_start = -2.0  # -> starting weight
t2_minimum = 2.0  # -> minimum of L(w) = (w - 2)^2
t2_factor = 1.0 - 2.0 * t2_etas  # -> [0.9, 0.5, -1.2]
t2_steps = np.arange(7)  # -> [0, 1, 2, 3, 4, 5, 6]
t2_paths = t2_minimum + (t2_start - t2_minimum) * (t2_factor[:, None] ** t2_steps)  # -> three weight paths
t2_losses = (t2_paths - t2_minimum) ** 2  # -> losses along each path
print("rng seed:", 0)
print("learning rates:", t2_etas.tolist())
print("start weight:", t2_start)
print("minimum weight:", t2_minimum)
print("update factors 1 - 2eta:", np.round(t2_factor, 3).tolist())
print("steps:", t2_steps.tolist())
print("weight paths:", np.round(t2_paths, 3).tolist())
print("loss paths:", np.round(t2_losses, 3).tolist())
assert t2_losses[1, -1] < t2_losses[0, -1]
assert t2_losses[2, -1] > t2_losses[2, 0]

t2_fig, t2_ax = plt.subplots(figsize=(6, 3.5))
for t2_eta, t2_path, t2_loss in zip(t2_etas, t2_paths, t2_losses):
    t2_ax.plot(t2_path, t2_loss, marker="o", label=f"eta={t2_eta}")
t2_grid = np.linspace(-10.0, 12.0, 200)  # -> smooth x-values for the quadratic curve
t2_curve = (t2_grid - t2_minimum) ** 2  # -> L(w) values on the grid
t2_ax.plot(t2_grid, t2_curve, color="black", alpha=0.25, label="loss curve")
t2_ax.set_title("Learning rate changes the optimization path")
t2_ax.set_xlabel("weight w")
t2_ax.set_ylabel("loss")
t2_ax.legend()
plt.show()
```
▶ What you'll see: eta=0.25 quickly approaches the minimum, eta=0.05 crawls, and eta=1.10 oscillates with growing loss.

### ✍️ Toy 3 · Mini-batch gradient is an average of example gradients

A mini-batch step averages several per-example gradients, making it less noisy than one-example SGD but cheaper than a full batch.

```python
import numpy as np
import matplotlib.pyplot as plt

t3_rng = np.random.default_rng(0)  # -> reproducible generator seeded with 0
t3_x = np.array([-2.0, -1.0, 0.0, 1.0, 2.0, 3.0])  # -> six scalar inputs
t3_y = np.array([-3.0, -1.1, 0.9, 2.9, 5.2, 6.8])  # -> noisy linear targets
t3_features = np.column_stack([np.ones(len(t3_x)), t3_x])  # -> bias plus x feature
t3_weights = np.array([0.4, 1.2])  # -> current model parameters
t3_predictions = t3_features @ t3_weights  # -> [-2.0, -0.8, 0.4, 1.6, 2.8, 4.0]
t3_residuals = t3_predictions - t3_y  # -> [1.0, 0.3, -0.5, -1.3, -2.4, -2.8]
t3_per_example_gradients = t3_residuals[:, None] * t3_features  # -> one gradient row per example
t3_one_gradient = t3_per_example_gradients[0]  # -> [1.0, -2.0]
t3_mini_gradient = t3_per_example_gradients[:3].mean(axis=0)  # -> [0.267, -0.767]
t3_full_gradient = t3_per_example_gradients.mean(axis=0)  # -> [-0.95, -2.8]
t3_eta = 0.1  # -> shared learning rate
t3_updated_weights = np.vstack([t3_weights - t3_eta * t3_one_gradient, t3_weights - t3_eta * t3_mini_gradient, t3_weights - t3_eta * t3_full_gradient])  # -> [[0.3, 1.4], [0.373, 1.277], [0.495, 1.48]]
print("rng seed:", 0)
print("x:", t3_x.tolist())
print("y:", t3_y.tolist())
print("features:", t3_features.tolist())
print("weights:", t3_weights.tolist())
print("predictions:", np.round(t3_predictions, 3).tolist())
print("residuals:", np.round(t3_residuals, 3).tolist())
print("per-example gradients:", np.round(t3_per_example_gradients, 3).tolist())
print("one-example gradient:", np.round(t3_one_gradient, 3).tolist())
print("mini-batch gradient:", np.round(t3_mini_gradient, 3).tolist())
print("full-batch gradient:", np.round(t3_full_gradient, 3).tolist())
print("updated weights:", np.round(t3_updated_weights, 3).tolist())
assert np.allclose(np.round(t3_mini_gradient, 3), [0.267, -0.767])
assert np.allclose(np.round(t3_full_gradient, 2), [-0.95, -2.8])

t3_names = ["one", "mini", "full"]  # -> labels for the three gradient estimates
t3_gradients = np.vstack([t3_one_gradient, t3_mini_gradient, t3_full_gradient])  # -> stacked gradient table
t3_fig, t3_ax = plt.subplots(figsize=(6, 3.5))
t3_positions = np.arange(len(t3_names))
t3_ax.bar(t3_positions - 0.18, t3_gradients[:, 0], width=0.36, label="bias grad")
t3_ax.bar(t3_positions + 0.18, t3_gradients[:, 1], width=0.36, label="slope grad")
t3_ax.axhline(0.0, color="black", linewidth=1)
t3_ax.set_xticks(t3_positions, t3_names)
t3_ax.set_title("Batch size changes the gradient estimate")
t3_ax.set_ylabel("gradient component")
t3_ax.legend()
plt.show()
```
▶ What you'll see: the one-example gradient points differently from the average, while the mini-batch sits between one-example and full-batch estimates.

### ✍️ Toy 4 · Momentum accumulates a velocity

Momentum mixes the previous velocity with the current gradient, so updates remember recent downhill directions instead of reacting only to the newest gradient.

```python
import numpy as np
import matplotlib.pyplot as plt

t4_rng = np.random.default_rng(0)  # -> reproducible generator seeded with 0
t4_gradients = np.array([4.0, 2.0, -1.0, -2.0, -1.0, 0.0])  # -> six scalar gradients over time
t4_beta = 0.8  # -> momentum coefficient
t4_eta = 0.1  # -> learning rate
t4_w0 = 0.0  # -> starting scalar parameter
t4_v0 = 0.0  # -> starting velocity
t4_v1 = t4_beta * t4_v0 + t4_gradients[0]  # -> 4.0
t4_w1 = t4_w0 - t4_eta * t4_v1  # -> -0.4
t4_v2 = t4_beta * t4_v1 + t4_gradients[1]  # -> 5.2
t4_w2 = t4_w1 - t4_eta * t4_v2  # -> -0.92
t4_v3 = t4_beta * t4_v2 + t4_gradients[2]  # -> 3.16
t4_w3 = t4_w2 - t4_eta * t4_v3  # -> -1.236
t4_v4 = t4_beta * t4_v3 + t4_gradients[3]  # -> 0.528
t4_w4 = t4_w3 - t4_eta * t4_v4  # -> -1.2888
t4_v5 = t4_beta * t4_v4 + t4_gradients[4]  # -> -0.5776
t4_w5 = t4_w4 - t4_eta * t4_v5  # -> -1.23104
t4_v6 = t4_beta * t4_v5 + t4_gradients[5]  # -> -0.46208
t4_w6 = t4_w5 - t4_eta * t4_v6  # -> -1.184832
t4_velocities = np.array([t4_v1, t4_v2, t4_v3, t4_v4, t4_v5, t4_v6])  # -> [4.0, 5.2, 3.16, 0.528, -0.5776, -0.46208]
t4_weights = np.array([t4_w1, t4_w2, t4_w3, t4_w4, t4_w5, t4_w6])  # -> [-0.4, -0.92, -1.236, -1.2888, -1.23104, -1.184832]
print("rng seed:", 0)
print("gradients:", t4_gradients.tolist())
print("beta:", t4_beta)
print("eta:", t4_eta)
print("start weight:", t4_w0)
print("start velocity:", t4_v0)
print("velocities:", np.round(t4_velocities, 5).tolist())
print("weights after momentum steps:", np.round(t4_weights, 5).tolist())
assert np.allclose(np.round(t4_velocities, 5), [4.0, 5.2, 3.16, 0.528, -0.5776, -0.46208])
assert np.isclose(t4_weights[-1], -1.184832)

t4_steps = np.arange(1, 7)  # -> [1, 2, 3, 4, 5, 6]
t4_fig, t4_ax = plt.subplots(figsize=(6, 3.5))
t4_ax.plot(t4_steps, t4_gradients, marker="o", label="raw gradient")
t4_ax.plot(t4_steps, t4_velocities, marker="s", label="momentum velocity")
t4_ax.axhline(0.0, color="black", linewidth=1)
t4_ax.set_title("Momentum smooths and carries gradient direction")
t4_ax.set_xlabel("update number")
t4_ax.set_ylabel("value")
t4_ax.legend()
plt.show()
```
▶ What you'll see: the velocity stays positive after the gradient turns negative, then gradually reverses as more negative gradients arrive.

### ✍️ Toy 5 · Fine-tuning freeze mask versus full update

Fine-tuning is still gradient descent, but a freeze mask decides which parameter block is allowed to move.

```python
import numpy as np
import matplotlib.pyplot as plt

t5_rng = np.random.default_rng(0)  # -> reproducible generator seeded with 0
t5_raw = np.array([[-1.0, 1.0], [0.0, 1.0], [1.0, 1.0], [2.0, 1.0], [1.0, 2.0], [2.0, 2.0]])  # -> six raw examples
t5_targets = np.array([-0.8, -0.1, 0.6, 1.3, 0.2, 0.9])  # -> target-domain labels
t5_base_scale = np.array([1.0, 1.0])  # -> base representation scales
t5_head_weights = np.array([0.5, -0.2])  # -> head weights
t5_representation = t5_raw * t5_base_scale  # -> same as raw while base scales are ones
t5_predictions = t5_representation @ t5_head_weights  # -> [-0.7, -0.2, 0.3, 0.8, 0.1, 0.6]
t5_residuals = t5_predictions - t5_targets  # -> [0.1, -0.1, -0.3, -0.5, -0.1, -0.3]
t5_initial_loss = np.mean(0.5 * t5_residuals ** 2)  # -> 0.0383
t5_grad_head = t5_representation.T @ t5_residuals / len(t5_targets)  # -> [-0.35, -0.267]
t5_grad_base = (t5_raw * t5_head_weights).T @ t5_residuals / len(t5_targets)  # -> [-0.175, 0.053]
t5_eta = 0.4  # -> fine-tuning step size
t5_frozen_base = t5_base_scale.copy()  # -> [1.0, 1.0]
t5_frozen_head = t5_head_weights - t5_eta * t5_grad_head  # -> [0.64, -0.093]
t5_full_base = t5_base_scale - t5_eta * t5_grad_base  # -> [1.07, 0.979]
t5_full_head = t5_head_weights - t5_eta * t5_grad_head  # -> [0.64, -0.093]
t5_frozen_predictions = (t5_raw * t5_frozen_base) @ t5_frozen_head  # -> [-0.733, -0.093, 0.547, 1.187, 0.453, 1.093]
t5_full_predictions = (t5_raw * t5_full_base) @ t5_full_head  # -> [-0.776, -0.091, 0.593, 1.278, 0.502, 1.187]
t5_frozen_loss = np.mean(0.5 * (t5_frozen_predictions - t5_targets) ** 2)  # -> 0.0101
t5_full_loss = np.mean(0.5 * (t5_full_predictions - t5_targets) ** 2)  # -> 0.0146
print("rng seed:", 0)
print("raw examples:", t5_raw.tolist())
print("targets:", t5_targets.tolist())
print("base scale:", t5_base_scale.tolist())
print("head weights:", t5_head_weights.tolist())
print("representation:", t5_representation.tolist())
print("predictions:", np.round(t5_predictions, 3).tolist())
print("residuals:", np.round(t5_residuals, 3).tolist())
print("initial loss:", round(float(t5_initial_loss), 4))
print("head gradient:", np.round(t5_grad_head, 3).tolist())
print("base gradient:", np.round(t5_grad_base, 3).tolist())
print("frozen base:", np.round(t5_frozen_base, 3).tolist())
print("frozen head:", np.round(t5_frozen_head, 3).tolist())
print("full-tune base:", np.round(t5_full_base, 3).tolist())
print("frozen predictions:", np.round(t5_frozen_predictions, 3).tolist())
print("full predictions:", np.round(t5_full_predictions, 3).tolist())
print("frozen loss:", round(float(t5_frozen_loss), 4))
print("full loss:", round(float(t5_full_loss), 4))
assert np.allclose(t5_frozen_base, [1.0, 1.0])
assert t5_frozen_loss < t5_initial_loss and t5_full_loss < t5_initial_loss

t5_index = np.arange(len(t5_targets))  # -> [0, 1, 2, 3, 4, 5]
t5_fig, t5_ax = plt.subplots(figsize=(6, 3.5))
t5_ax.plot(t5_index, t5_targets, marker="o", color="black", label="targets")
t5_ax.plot(t5_index, t5_predictions, marker="s", label="initial")
t5_ax.plot(t5_index, t5_frozen_predictions, marker="^", label="frozen base")
t5_ax.plot(t5_index, t5_full_predictions, marker="x", label="full tune")
t5_ax.set_title("Freeze mask changes which parameters move")
t5_ax.set_xlabel("example index")
t5_ax.set_ylabel("prediction")
t5_ax.legend()
plt.show()
```
▶ What you'll see: the frozen-base update changes only the head, while full fine-tuning also nudges the base scales.


## 0. Step-by-Step Worked Example — Start Here (Beginner Friendly)

> 🧑‍🎓 **New to this topic? Start here.** This is a gentle, fully runnable walkthrough that
> builds up *every* idea in this lesson one tiny step at a time. Each step **prints** the
> numbers it computes and **draws a picture** so you can *see* what is happening. Run the
> cells in order from top to bottom. Nothing here needs the internet or any downloaded data.

### The Big Picture — What You'll Learn

In plain terms, here is what the steps below will show you:

- **Batch vs. stochastic updates** compare one-example, mini-batch, and full-batch gradient estimates.
- **Learning-rate behavior** shows why step size can make training crawl, converge, or bounce.
- **Logistic prediction and gradients** connect sigmoid probabilities to the cross-entropy gradient.
- **Hypothesis class and fine-tuning** demonstrate frozen-base versus full-parameter updates.
- **Pseudocode** becomes a complete mini-batch training loop with shuffled batches and logged losses.

Everything below (starting at **§1 Overview**) develops these same ideas with full derivations,
more examples, and an interactive experiment.

**What we will build, step by step:**
1. **Batch vs. stochastic updates** — compare one-example, mini-batch, and full-batch gradients.
2. **Learning-rate behavior** — watch small, useful, and too-large step sizes move on a loss curve.
3. **Logistic prediction and gradients** — compute sigmoid probabilities and the gradient they create.
4. **Hypothesis class and fine-tuning** — freeze or update parts of a tiny base+head model.
5. **Pseudocode** — run the whole mini-batch SGD loop from shuffle to update.

### Step 0 — Set up our tools

We import NumPy (arrays + gradients) and Matplotlib (pictures). We fix a random **seed** so every
run gives the same printed numbers, then define a tiny `log()` helper for clearly labeled output.

```python
import numpy as np                       # NumPy: vectors, matrix products, and tiny optimization loops.
import matplotlib.pyplot as plt          # Matplotlib: plots for gradients, learning rates, and losses.

np.random.seed(0)                         # Fix the seed so every run prints the same numbers.
plt.rcParams["figure.figsize"] = (7, 4)   # Use a comfortable default plot size.


def log(label, value):                    # Define one small logger used in every worked-example cell.
    print(f"[{label}] {value}")           # Print each value with a readable label.

log("setup", "tools ready — NumPy + Matplotlib imported, seed fixed to 0")  # Confirm setup finished.
```
▶ What you'll see: one line confirming the tools are ready.

### Step 1 — Batch vs. stochastic updates: noisy but cheap, stable but expensive

SGD estimates the gradient from one example, mini-batch gradient descent averages a few examples, and
full-batch gradient descent averages the whole dataset. We compute all three for the same squared-loss model.

```python
features_demo = np.array([[1.0, -2.0], [1.0, -1.0], [1.0, 1.0], [1.0, 2.0]])  # Build [bias, x] features for four examples.
targets_demo = np.array([-2.5, -0.5, 1.0, 3.0])                                # Store tiny regression targets.
weights_demo = np.array([0.2, 0.4])                                             # Start from one candidate weight vector.
eta_demo = 0.3                                                                  # Choose a learning rate for all updates.
preds_demo = features_demo @ weights_demo                                       # Compute predictions for every example.
residuals_demo = preds_demo - targets_demo                                      # Compute residuals pred - y.
per_example_grads_demo = residuals_demo[:, None] * features_demo                # Gradient of 0.5 residual^2 is residual * features.
sgd_grad_demo = per_example_grads_demo[0]                                       # Use one example for a stochastic update.
mini_grad_demo = per_example_grads_demo[:2].mean(axis=0)                        # Average two examples for a mini-batch update.
full_grad_demo = per_example_grads_demo.mean(axis=0)                            # Average all examples for a full-batch update.
update_names_demo = np.array(["SGD", "mini-batch", "full-batch"])             # Name the three gradient estimates.
update_grads_demo = np.vstack([sgd_grad_demo, mini_grad_demo, full_grad_demo])   # Stack gradients for printing and plotting.
updated_weights_demo = weights_demo - eta_demo * update_grads_demo              # Apply w <- w - eta * gradient for each case.

for name_demo, grad_demo, new_w_demo in zip(update_names_demo, update_grads_demo, updated_weights_demo):  # Loop over update types.
    log(f"{name_demo} gradient", np.round(grad_demo, 3))                         # Print the gradient estimate.
    log(f"{name_demo} updated weights", np.round(new_w_demo, 3))                 # Print the resulting weights.

x_axis_demo = np.arange(len(update_names_demo))                                  # Create bar positions for update types.
plt.bar(x_axis_demo - 0.18, update_grads_demo[:, 0], width=0.36, label="bias grad")  # Plot bias-gradient estimates.
plt.bar(x_axis_demo + 0.18, update_grads_demo[:, 1], width=0.36, label="slope grad") # Plot slope-gradient estimates.
plt.axhline(0.0, color="black", linewidth=1)                                    # Mark zero gradient.
plt.xticks(x_axis_demo, update_names_demo)                                       # Label each update type.
plt.ylabel("gradient component")                                                # Label the vertical axis.
plt.title("Batch size changes the gradient estimate")                           # Title the gradient comparison.
plt.legend()                                                                     # Show which bars are bias vs slope.
plt.show()                                                                       # Render the bar chart.
```
▶ What you'll see: the one-example gradient is noisier, while the full-batch gradient is an average of all examples.

### Step 2 — Learning-rate behavior: step size controls training motion

The update length is $\eta\|
abla L\|$. A tiny learning rate crawls, a useful one moves steadily, and a too-large
one can jump across the minimum and make the loss unstable.

```python
etas_demo = np.array([0.05, 0.35, 1.05])                                         # Compare small, useful, and too-large learning rates.
eta_names_demo = np.array(["too small", "useful", "too large"])                 # Name the learning-rate behaviors.
colors_demo = np.array(["gray", "seagreen", "salmon"])                          # Pick plot colors for the three paths.
steps_demo = 9                                                                    # Run a few gradient steps for each learning rate.
start_w_demo = -3.0                                                               # Start far from the minimum w=2.
grid_demo = np.linspace(-4.0, 5.0, 300)                                           # Create x-values for the loss curve.
loss_grid_demo = (grid_demo - 2.0) ** 2                                           # Use L(w)=(w-2)^2 as a simple loss surface.

plt.plot(grid_demo, loss_grid_demo, color="black", label="loss L(w)=(w-2)^2")    # Draw the one-dimensional loss curve.
for eta_value_demo, eta_name_demo, color_demo in zip(etas_demo, eta_names_demo, colors_demo):  # Loop over learning rates.
    path_demo = [start_w_demo]                                                    # Store the weight path for this eta.
    for step_demo in range(steps_demo):                                           # Take repeated gradient steps.
        grad_demo = 2.0 * (path_demo[-1] - 2.0)                                   # Compute d/dw (w-2)^2.
        path_demo.append(path_demo[-1] - eta_value_demo * grad_demo)              # Apply w <- w - eta * grad.
    path_demo = np.array(path_demo)                                                # Convert the path to an array for plotting.
    loss_path_demo = (path_demo - 2.0) ** 2                                       # Compute the loss along the path.
    log(f"{eta_name_demo} final w", round(path_demo[-1], 3))                      # Print the final weight.
    log(f"{eta_name_demo} final loss", round(loss_path_demo[-1], 3))              # Print the final loss.
    plt.plot(path_demo, loss_path_demo, marker="o", color=color_demo, label=f"eta={eta_value_demo}")  # Plot the optimization path.
plt.xlabel("weight w")                                                            # Label the horizontal axis.
plt.ylabel("loss")                                                                # Label the vertical axis.
plt.title("Learning rate decides whether updates crawl, converge, or bounce")     # Title the plot.
plt.legend()                                                                       # Show learning-rate labels.
plt.show()                                                                         # Render the learning-rate paths.
```
▶ What you'll see: the useful step size reaches the minimum quickly, while the tiny one crawls and the huge one bounces.

### Step 3 — Logistic prediction and gradients: sigmoid turns scores into probabilities

A logistic model computes $z=w^	op\phi(x)$, then predicts $\sigma(z)=1/(1+e^{-z})$. For cross-entropy loss,
the gradient is $(\sigma(z)-y)\phi(x)$, so the probability error directly scales the feature vector.

```python
z_grid_demo = np.linspace(-6.0, 6.0, 300)                                        # Create score values for plotting sigmoid behavior.
sigmoid_demo = 1.0 / (1.0 + np.exp(-z_grid_demo))                                # Compute sigma(z).
sigmoid_deriv_demo = sigmoid_demo * (1.0 - sigmoid_demo)                         # Compute sigma'(z)=sigma(z)(1-sigma(z)).
phi_demo = np.array([1.0, 0.6, -0.4])                                             # Store one feature vector with a bias term.
weights_log_demo = np.array([-0.2, 1.0, -0.5])                                    # Store logistic model weights.
y_log_demo = 1.0                                                                  # Store the binary target for this example.
z_demo = float(weights_log_demo @ phi_demo)                                       # Compute the raw linear score.
p_demo = 1.0 / (1.0 + np.exp(-z_demo))                                            # Convert the score to P(y=1|x;w).
grad_log_demo = (p_demo - y_log_demo) * phi_demo                                  # Compute the cross-entropy gradient.

log("score z", round(z_demo, 3))                                                  # Print the raw score.
log("sigmoid probability", round(p_demo, 3))                                      # Print the model probability.
log("sigmoid derivative at z", round(p_demo * (1.0 - p_demo), 3))                # Print the local sigmoid slope.
log("logistic gradient", np.round(grad_log_demo, 3))                              # Print the gradient vector.

plt.plot(z_grid_demo, sigmoid_demo, label="sigmoid sigma(z)")                    # Plot the probability curve.
plt.plot(z_grid_demo, sigmoid_deriv_demo, label="derivative sigma(z)(1-sigma(z))") # Plot the derivative curve.
plt.axvline(z_demo, color="black", linestyle="--", label="example z")          # Mark this example's score.
plt.xlabel("score z")                                                            # Label the score axis.
plt.ylabel("value")                                                              # Label probability/derivative values.
plt.title("Logistic prediction and gradient ingredients")                       # Title the logistic plot.
plt.legend()                                                                      # Show the curve names.
plt.show()                                                                        # Render the sigmoid figure.
```
▶ What you'll see: the sigmoid maps scores to probabilities, and its derivative is largest near score zero.

### Step 4 — Hypothesis class and fine-tuning: choose which parameters can move

With fixed features, the hypothesis class varies only the head weights. Fine-tuning changes the allowed parameter
subspace: frozen feature extractor updates only the head, while full fine-tuning updates both base and head.

```python
x_base_demo = np.array([-1.0, 0.0, 1.0, 2.0])                                     # Create raw scalar inputs.
y_base_demo = np.array([-1.0, 0.2, 1.6, 2.8])                                     # Create targets for the new task.
raw_features_demo = np.column_stack([x_base_demo, x_base_demo ** 2])              # Let the base produce raw [x, x^2] features.
base_scale_demo = np.array([1.0, 1.0])                                            # Store trainable base scales theta_base.
head_weights_demo = np.array([0.6, 0.1])                                          # Store trainable head weights theta_head.
eta_ft_demo = 0.4                                                                 # Choose a small fine-tuning step size.
representation_demo = raw_features_demo * base_scale_demo                         # Compute r_theta_base(x).
preds_initial_demo = representation_demo @ head_weights_demo                      # Compute h_theta_head(r_theta_base(x)).
residual_ft_demo = preds_initial_demo - y_base_demo                               # Compute residuals for squared loss.
grad_head_demo = representation_demo.T @ residual_ft_demo / len(y_base_demo)      # Differentiate loss with respect to head weights.
grad_base_demo = (raw_features_demo * head_weights_demo).T @ residual_ft_demo / len(y_base_demo)  # Differentiate loss with respect to base scales.
frozen_base_demo = base_scale_demo.copy()                                         # Keep the base unchanged for frozen-feature fine-tuning.
frozen_head_demo = head_weights_demo - eta_ft_demo * grad_head_demo               # Update only the head.
full_base_demo = base_scale_demo - eta_ft_demo * grad_base_demo                   # Update the base for full fine-tuning.
full_head_demo = head_weights_demo - eta_ft_demo * grad_head_demo                 # Update the head for full fine-tuning.
preds_frozen_demo = (raw_features_demo * frozen_base_demo) @ frozen_head_demo     # Predict after frozen-extractor update.
preds_full_demo = (raw_features_demo * full_base_demo) @ full_head_demo           # Predict after full fine-tuning update.

log("initial loss", round(float(np.mean(0.5 * residual_ft_demo ** 2)), 3))        # Print the starting mean loss.
log("head gradient", np.round(grad_head_demo, 3))                                 # Print the head gradient.
log("base gradient", np.round(grad_base_demo, 3))                                 # Print the base gradient.
log("frozen base after update", np.round(frozen_base_demo, 3))                    # Show frozen parameters did not move.
log("full-tune base after update", np.round(full_base_demo, 3))                   # Show full fine-tuning moved base parameters.

plt.scatter(x_base_demo, y_base_demo, color="black", label="targets")            # Plot the new-task targets.
plt.plot(x_base_demo, preds_initial_demo, marker="o", label="initial")           # Plot predictions before fine-tuning.
plt.plot(x_base_demo, preds_frozen_demo, marker="s", label="frozen base")        # Plot head-only fine-tuned predictions.
plt.plot(x_base_demo, preds_full_demo, marker="^", label="full fine-tune")       # Plot full fine-tuned predictions.
plt.xlabel("input x")                                                            # Label the input axis.
plt.ylabel("prediction")                                                         # Label target/prediction values.
plt.title("Fine-tuning decides which parameter subspace can change")             # Title the fine-tuning plot.
plt.legend()                                                                      # Show each prediction curve.
plt.show()                                                                        # Render the comparison.
```
▶ What you'll see: frozen fine-tuning leaves the base scales unchanged, while full fine-tuning moves them too.

### Step 5 — Pseudocode: the full mini-batch SGD loop

The pseudocode becomes a small loop: shuffle, slice a mini-batch, predict, compute average loss, compute an average
gradient, update trainable weights, and repeat. We use synthetic logistic data so the whole run is fast and inspectable.

```python
rng_demo = np.random.default_rng(0)                                               # Create a reproducible generator for this mini training run.
x0_demo = rng_demo.normal(loc=-1.0, scale=0.45, size=(12, 2))                     # Draw class-0 synthetic points.
x1_demo = rng_demo.normal(loc=1.0, scale=0.45, size=(12, 2))                      # Draw class-1 synthetic points.
X_loop_demo = np.vstack([x0_demo, x1_demo])                                       # Combine the two classes into one feature matrix.
y_loop_demo = np.r_[np.zeros(len(x0_demo)), np.ones(len(x1_demo))]                # Create binary labels 0 and 1.
features_loop_demo = np.column_stack([np.ones(len(X_loop_demo)), X_loop_demo])    # Add a bias column for logistic regression.
weights_loop_demo = np.zeros(features_loop_demo.shape[1])                         # Initialize trainable weights at zero.
eta_loop_demo = 0.6                                                               # Choose a stable learning rate for the tiny dataset.
batch_size_demo = 6                                                               # Use mini-batches of six examples.
epochs_demo = 8                                                                   # Run just a few epochs to keep it fast.
losses_loop_demo = []                                                             # Store one full-dataset loss per epoch.

for epoch_demo in range(epochs_demo):                                             # Repeat the training loop for several epochs.
    order_demo = rng_demo.permutation(len(y_loop_demo))                           # Shuffle the training example order.
    for start_demo in range(0, len(y_loop_demo), batch_size_demo):                # Walk through shuffled mini-batches.
        batch_ids_demo = order_demo[start_demo:start_demo + batch_size_demo]      # Select the current mini-batch indices.
        xb_demo = features_loop_demo[batch_ids_demo]                              # Gather mini-batch features.
        yb_demo = y_loop_demo[batch_ids_demo]                                     # Gather mini-batch labels.
        logits_demo = xb_demo @ weights_loop_demo                                 # Compute linear scores on the mini-batch.
        probs_demo = 1.0 / (1.0 + np.exp(-logits_demo))                           # Convert scores to probabilities.
        grad_demo = xb_demo.T @ (probs_demo - yb_demo) / len(yb_demo)             # Average logistic gradient over the mini-batch.
        weights_loop_demo = weights_loop_demo - eta_loop_demo * grad_demo         # Update trainable weights.
    full_logits_demo = features_loop_demo @ weights_loop_demo                     # Compute full-dataset scores after the epoch.
    full_probs_demo = 1.0 / (1.0 + np.exp(-full_logits_demo))                     # Convert full-dataset scores to probabilities.
    loss_demo = -np.mean(y_loop_demo * np.log(full_probs_demo + 1e-9) + (1.0 - y_loop_demo) * np.log(1.0 - full_probs_demo + 1e-9))  # Compute cross-entropy loss.
    losses_loop_demo.append(loss_demo)                                            # Store the epoch loss.
    log(f"epoch {epoch_demo + 1} loss", round(float(loss_demo), 3))              # Print a granular loss trace.

log("final weights", np.round(weights_loop_demo, 3))                              # Print the learned weights.
plt.plot(np.arange(1, epochs_demo + 1), losses_loop_demo, marker="o")            # Plot loss versus epoch.
plt.xlabel("epoch")                                                              # Label the epoch axis.
plt.ylabel("cross-entropy loss")                                                 # Label the loss axis.
plt.title("Mini-batch SGD loop: shuffle, average gradient, update")              # Title the training-loop plot.
plt.show()                                                                        # Render the loss curve.
```
▶ What you'll see: the printed loss decreases over epochs as the mini-batch SGD pseudocode updates the weights.

---

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


### 📖 Concept walkthrough — build each idea from scratch

Before the warm-up examples, we build the SGD and fine-tuning ideas from scratch, one small step at a time. Everything here uses only NumPy + Matplotlib and tiny inline data, so every update, gradient, loss, and trajectory is inspectable. Variables carry a `_w` suffix so they never collide with the examples below.

```python
import numpy as np  # NumPy gives us arrays, dot products, gradients, and reproducible toy data.
import matplotlib.pyplot as plt  # Matplotlib lets us see optimizer paths, loss curves, and fine-tuning shifts.
np.random.seed(30)  # Fix the seed so every printed number and plotted trajectory is reproducible.
```

#### 1. Batch vs stochastic updates: one exact average versus one noisy sample

Gradient descent needs a direction that lowers loss. Full-batch gradient descent computes the average gradient over every example, while SGD uses one example as a cheap estimate of that average. We build both on a tiny regression problem so the stochastic direction is visibly noisier but much cheaper and more frequent.

For squared error on one example, $\frac{1}{2}(\theta^\top x-y)^2$, the gradient is $(\theta^\top x-y)x$. Full-batch GD averages that gradient:

$$
\nabla J(\theta)=\frac{1}{n}\sum_{i=1}^n(\theta^\top x_i-y_i)x_i.
$$

```python
X_batch_w = np.array([[1.0, -2.0], [1.0, -1.0], [1.0, 0.0], [1.0, 1.0], [1.0, 2.0]])  # Add a bias column and one scalar feature.
y_batch_w = np.array([-3.1, -1.0, 0.9, 3.2, 5.1])  # Create tiny linear-regression targets near y=1+2x.
theta_batch_w = np.array([0.0, 0.0])  # Start from a deliberately bad intercept and slope.
print("X:\n", X_batch_w)  # Inspect the design matrix used by both batch and stochastic updates.
print("y:", y_batch_w)  # Inspect the target values.
print("start theta:", theta_batch_w)  # Inspect the initial parameters before any update.
```
▶ What you'll see: five inspectable examples, each with a bias feature and one input feature.

```python
pred_batch_w = X_batch_w @ theta_batch_w  # Predict with the starting weights for all examples at once.
err_batch_w = pred_batch_w - y_batch_w  # Compute residuals, the signed mistakes that drive squared-error gradients.
grad_each_w = err_batch_w[:, None] * X_batch_w  # Compute one gradient row per example using (prediction - target) * x.
grad_full_w = grad_each_w.mean(axis=0)  # Average all example gradients to get the full-batch direction.
grad_one_w = grad_each_w[4]  # Pick one example's gradient as a stochastic estimate of the full gradient.
print("per-example gradients:\n", np.round(grad_each_w, 3))  # Inspect how much each example disagrees.
print("full-batch gradient:", np.round(grad_full_w, 3))  # Inspect the exact average direction.
print("single-example gradient:", np.round(grad_one_w, 3))  # Inspect the noisy one-example estimate.
```
▶ What you'll see: the single-example gradient points roughly downhill but does not equal the full average.

```python
eta_batch_w = 0.12  # Choose a modest learning rate shared by both methods.
theta_full_next_w = theta_batch_w - eta_batch_w * grad_full_w  # Take one full-batch update.
theta_one_next_w = theta_batch_w - eta_batch_w * grad_one_w  # Take one stochastic update from the selected example.
print("theta after full-batch step:", np.round(theta_full_next_w, 3))  # Inspect the stable average step.
print("theta after one SGD step:", np.round(theta_one_next_w, 3))  # Inspect the noisier but cheaper step.
print("gradient difference:", np.round(grad_one_w - grad_full_w, 3))  # Inspect the noise in the stochastic estimate.
```
▶ What you'll see: both steps move away from zero, but the stochastic step overreacts to the sampled point.

```python
def mse_batch_w(theta_w):  # Define mean squared error for the tiny regression problem.
    return float(np.mean((X_batch_w @ theta_w - y_batch_w) ** 2))  # Return average squared residual size.
theta_gd_w = np.array([0.0, 0.0])  # Initialize the full-batch trajectory.
theta_sgd_w = np.array([0.0, 0.0])  # Initialize the stochastic trajectory.
traj_gd_w = [theta_gd_w.copy()]  # Store full-batch parameter positions for plotting.
traj_sgd_w = [theta_sgd_w.copy()]  # Store stochastic parameter positions for plotting.
loss_gd_w = [mse_batch_w(theta_gd_w)]  # Store full-batch losses for inspection.
loss_sgd_w = [mse_batch_w(theta_sgd_w)]  # Store stochastic losses measured on the full dataset.
for step_w in range(18):  # Run a few cheap updates so the path shape is visible.
    grad_gd_w = ((X_batch_w @ theta_gd_w - y_batch_w)[:, None] * X_batch_w).mean(axis=0)  # Compute exact batch gradient.
    theta_gd_w = theta_gd_w - eta_batch_w * grad_gd_w  # Move once using the full average.
    idx_w = step_w % len(y_batch_w)  # Cycle through examples to make deterministic SGD noise.
    grad_sgd_w = (X_batch_w[idx_w] @ theta_sgd_w - y_batch_w[idx_w]) * X_batch_w[idx_w]  # Compute one-example gradient.
    theta_sgd_w = theta_sgd_w - eta_batch_w * grad_sgd_w  # Move once using the stochastic estimate.
    traj_gd_w.append(theta_gd_w.copy())  # Save the full-batch position.
    traj_sgd_w.append(theta_sgd_w.copy())  # Save the stochastic position.
    loss_gd_w.append(mse_batch_w(theta_gd_w))  # Save full-batch loss after the step.
    loss_sgd_w.append(mse_batch_w(theta_sgd_w))  # Save stochastic path loss after the step.
print("final GD theta/loss:", np.round(theta_gd_w, 3), round(loss_gd_w[-1], 3))  # Inspect final full-batch result.
print("final SGD theta/loss:", np.round(theta_sgd_w, 3), round(loss_sgd_w[-1], 3))  # Inspect final stochastic result.
```
▶ What you'll see: GD moves smoothly, while SGD wiggles because each update listens to one example.

```python
traj_gd_w = np.array(traj_gd_w)  # Convert the saved full-batch path to an array for plotting.
traj_sgd_w = np.array(traj_sgd_w)  # Convert the saved stochastic path to an array for plotting.
plt.figure(figsize=(6.0, 4.2))  # Create a compact trajectory figure.
plt.plot(traj_gd_w[:, 0], traj_gd_w[:, 1], marker="o", label="full-batch GD")  # Plot the stable average-gradient path.
plt.plot(traj_sgd_w[:, 0], traj_sgd_w[:, 1], marker="x", label="SGD one-example updates")  # Plot the noisy stochastic path.
plt.scatter([1.0], [2.0], c="black", s=80, label="true-ish weights")  # Mark the target intercept and slope for orientation.
plt.xlabel("intercept")  # Label the first parameter axis.
plt.ylabel("slope")  # Label the second parameter axis.
plt.legend(loc="best")  # Show which curve is which.
plt.title("1: batch updates are smooth, SGD updates are noisy")  # Title the required figure for this concept.
plt.show()  # Render the optimizer trajectories.
```
▶ What you'll see: the batch path is smoother, while the SGD path zigzags around the same downhill trend.

*Why it's done this way: SGD trades a noisy estimate of $\nabla J$ for cheap, frequent updates. That noise can wobble, but it lets large models learn without waiting for a full pass through all data before every step.*

#### 2. Learning-rate behavior: too small, useful, and too large $\eta$

The learning rate $\eta$ controls how far each gradient step moves. On the simple bowl $J(w)=w^2$, the gradient is $\nabla J(w)=2w$, so the update is $w\leftarrow w-\eta(2w)$. We use this one-dimensional bowl because the three behaviors are impossible to miss: crawl, converge, or explode.

```python
w0_lr_w = 5.0  # Start far from the minimum at w=0.
etas_lr_w = {"too small": 0.05, "good": 0.35, "too large": 1.10}  # Compare three step sizes on the same bowl.
steps_lr_w = 16  # Use enough steps to reveal slow convergence or divergence.
print("objective: J(w)=w^2")  # State the bowl being optimized.
print("gradient: 2w")  # State the exact derivative used below.
print("learning rates:", etas_lr_w)  # Inspect the three eta values.
```
▶ What you'll see: all three runs start from the same point and differ only in $\eta$.

```python
paths_lr_w = {}  # Store parameter paths by learning-rate label.
losses_lr_w = {}  # Store objective values by learning-rate label.
for name_w, eta_lr_w in etas_lr_w.items():  # Run one trajectory for each learning rate.
    w_lr_w = w0_lr_w  # Reset to the same starting point for a fair comparison.
    path_lr_w = [w_lr_w]  # Record the starting parameter.
    loss_lr_w = [w_lr_w ** 2]  # Record the starting loss.
    for step_w in range(steps_lr_w):  # Apply repeated gradient-descent updates.
        grad_lr_w = 2.0 * w_lr_w  # Compute the gradient of w^2.
        w_lr_w = w_lr_w - eta_lr_w * grad_lr_w  # Move by eta times the gradient.
        path_lr_w.append(w_lr_w)  # Save the new parameter value.
        loss_lr_w.append(w_lr_w ** 2)  # Save the new objective value.
    paths_lr_w[name_w] = np.array(path_lr_w)  # Convert the path to an array for plotting.
    losses_lr_w[name_w] = np.array(loss_lr_w)  # Convert the losses to an array for plotting.
    print(name_w, "final w/loss:", round(w_lr_w, 3), round(loss_lr_w[-1], 3))  # Inspect each outcome.
```
▶ What you'll see: the small $\eta$ still has loss left, the good $\eta$ shrinks near zero, and the large $\eta$ grows.

```python
w_grid_lr_w = np.linspace(-7.0, 7.0, 240)  # Create a horizontal grid for drawing the bowl.
plt.figure(figsize=(6.0, 4.2))  # Create the bowl-and-steps figure.
plt.plot(w_grid_lr_w, w_grid_lr_w ** 2, c="lightgray", lw=3, label="J(w)=w^2")  # Draw the quadratic objective.
for name_w, path_lr_w in paths_lr_w.items():  # Plot each learning-rate path on top of the bowl.
    clipped_w = np.clip(path_lr_w, -7.0, 7.0)  # Clip only the display so diverging points stay on the axes.
    plt.plot(clipped_w, clipped_w ** 2, marker="o", label=name_w)  # Draw the sequence of visited losses.
plt.xlabel("w")  # Label the parameter axis.
plt.ylabel("J(w)")  # Label the objective axis.
plt.ylim(0.0, 55.0)  # Keep the view focused on the useful part of the bowl.
plt.legend(loc="best")  # Show which path belongs to each eta.
plt.title("2: learning-rate behavior on a quadratic bowl")  # Title the required figure for this concept.
plt.show()  # Render the step-size comparison.
```
▶ What you'll see: tiny steps crawl, useful steps descend, and too-large steps bounce outward.

```python
plt.figure(figsize=(6.0, 3.6))  # Create a loss-over-time figure.
for name_w, loss_lr_w in losses_lr_w.items():  # Plot the loss history for each learning rate.
    plt.plot(range(len(loss_lr_w)), loss_lr_w, marker="o", label=name_w)  # Draw loss versus update number.
plt.yscale("log")  # Use a log scale so slow and diverging behavior fit together.
plt.xlabel("update step")  # Label the update index.
plt.ylabel("loss J(w)")  # Label the loss scale.
plt.legend(loc="best")  # Show the three step-size cases.
plt.title("2: loss curves reveal crawl, convergence, and divergence")  # Give this inspectable plot a clear title.
plt.show()  # Render the loss curves.
```
▶ What you'll see: the good learning rate drops fastest without exploding; the large one increases after overshooting.

*Why it's done this way: $\eta$ is a step-size tradeoff. Small values are safe but slow, while large values can jump across the minimum so far that the next gradient is even bigger.*

#### 3. Logistic prediction and gradients: from $\sigma(w\cdot x+b)$ to one update

Logistic regression converts a linear score into a probability with $\sigma(z)=\frac{1}{1+e^{-z}}$. For binary log-loss, the gradient with respect to $w$ is $(\hat{y}-y)x$, which says: if the probability is too high, move against the active features; if it is too low, move with them. We compute every piece before taking one SGD step.

```python
x_log_w = np.array([1.4, -0.6])  # Define one two-feature training example.
y_log_w = 1.0  # Give the example a positive binary label.
w_log_w = np.array([0.2, -0.4])  # Start with a small logistic weight vector.
b_log_w = -0.1  # Start with a small bias term.
eta_log_w = 0.5  # Choose a visible one-step learning rate.
print("x:", x_log_w, "y:", y_log_w)  # Inspect the example and label.
print("start w,b:", w_log_w, b_log_w)  # Inspect the initial model parameters.
```
▶ What you'll see: one fully inspectable labeled example and starting logistic model.

```python
z_log_w = float(w_log_w @ x_log_w + b_log_w)  # Compute the linear score w dot x plus bias.
yhat_log_w = 1.0 / (1.0 + np.exp(-z_log_w))  # Apply the sigmoid sigma(z) to get a probability.
eps_log_w = 1e-12  # Guard log(0) in the log-loss calculation.
loss_log_w = -(y_log_w * np.log(yhat_log_w + eps_log_w) + (1.0 - y_log_w) * np.log(1.0 - yhat_log_w + eps_log_w))  # Compute binary log-loss.
print("z = w·x + b:", round(z_log_w, 4))  # Inspect the raw score.
print("y_hat = sigma(z):", round(yhat_log_w, 4))  # Inspect the predicted probability.
print("log-loss:", round(float(loss_log_w), 4))  # Inspect the loss before the update.
```
▶ What you'll see: a score, a probability between 0 and 1, and the corresponding log-loss.

```python
grad_w_log_w = (yhat_log_w - y_log_w) * x_log_w  # Compute the logistic gradient for weights.
grad_b_log_w = yhat_log_w - y_log_w  # Compute the logistic gradient for the bias.
print("prediction error y_hat - y:", round(float(yhat_log_w - y_log_w), 4))  # Inspect the scalar error factor.
print("gradient wrt w:", np.round(grad_w_log_w, 4))  # Inspect (y_hat - y) times each feature.
print("gradient wrt b:", round(float(grad_b_log_w), 4))  # Inspect the bias gradient.
```
The factor $(\hat{y}-y)$ is negative here because the model underpredicts a positive example. Subtracting the gradient therefore increases weights aligned with positive features, which raises $z$ and lowers the log-loss.
▶ What you'll see: the gradient direction is built from one scalar error times the feature vector.

```python
w_log_next_w = w_log_w - eta_log_w * grad_w_log_w  # Take one SGD step on the weights.
b_log_next_w = b_log_w - eta_log_w * grad_b_log_w  # Take one SGD step on the bias.
z_log_next_w = float(w_log_next_w @ x_log_w + b_log_next_w)  # Recompute the score after the update.
yhat_log_next_w = 1.0 / (1.0 + np.exp(-z_log_next_w))  # Recompute the probability after the update.
loss_log_next_w = -(y_log_w * np.log(yhat_log_next_w + eps_log_w) + (1.0 - y_log_w) * np.log(1.0 - yhat_log_next_w + eps_log_w))  # Recompute guarded log-loss.
print("new w,b:", np.round(w_log_next_w, 4), round(float(b_log_next_w), 4))  # Inspect updated parameters.
print("new y_hat/loss:", round(float(yhat_log_next_w), 4), round(float(loss_log_next_w), 4))  # Confirm the probability improves and loss falls.
```
▶ What you'll see: one step increases the positive-class probability and lowers the loss.

```python
line_log_w = np.linspace(-3.0, 3.0, 240)  # Create possible score values for plotting sigmoid and loss point.
sig_log_w = 1.0 / (1.0 + np.exp(-line_log_w))  # Compute sigmoid values across the score grid.
plt.figure(figsize=(6.0, 4.0))  # Create a figure for the logistic transformation.
plt.plot(line_log_w, sig_log_w, label=r"$\sigma(z)$")  # Draw the sigmoid curve.
plt.scatter([z_log_w, z_log_next_w], [yhat_log_w, yhat_log_next_w], c=["crimson", "seagreen"], s=80, label="before/after step")  # Mark prediction before and after one step.
plt.axhline(y_log_w, c="gray", ls="--", label="target y=1")  # Show the target probability for a positive label.
plt.xlabel("score z")  # Label the score axis.
plt.ylabel("predicted probability")  # Label the probability axis.
plt.legend(loc="best")  # Identify the curve and update points.
plt.title("3: logistic step moves prediction toward the label")  # Title the required figure for this concept.
plt.show()  # Render the logistic prediction plot.
```
▶ What you'll see: the after-update point moves upward on the sigmoid, closer to the positive label.

*Why it's done this way: the compact gradient $(\hat{y}-y)x$ combines model error with feature responsibility. Subtracting it changes $w\cdot x+b$ in the direction that makes the observed label less surprising.*

#### 4. Hypothesis class and fine-tuning: reuse features, adjust only the head

A pretrained model can be viewed as a fixed feature map $r_{\theta_{\text{base}}}(x)$ followed by a small trainable head $h_{\theta_{\text{head}}}$. Fine-tuning often starts by freezing the base and moving only the head, or by using a small learning rate so useful pretrained structure is not destroyed. We simulate that with hand-built features and a pretrained-looking weight vector.

```python
X_ft_w = np.array([[-1.5, -1.0], [-1.0, -0.4], [-0.2, 0.2], [0.4, 0.8], [1.0, 1.2], [1.6, 1.0]])  # Create tiny target-domain inputs.
Phi_ft_w = np.c_[X_ft_w[:, 0], X_ft_w[:, 1], X_ft_w[:, 0] * X_ft_w[:, 1]]  # Build fixed base features, including an interaction.
y_ft_w = np.array([0.0, 0.0, 0.0, 1.0, 1.0, 1.0])  # Define target labels for the new task.
w_pre_ft_w = np.array([1.2, 0.9, -0.15])  # Pretend these head weights came from pretraining.
b_pre_ft_w = -0.1  # Pretend this bias came from pretraining.
print("fixed features Phi:\n", np.round(Phi_ft_w, 3))  # Inspect the frozen representation.
print("pretrained-looking head:", w_pre_ft_w, "bias:", b_pre_ft_w)  # Inspect the head that will be fine-tuned.
```
▶ What you'll see: the base features are computed once, while only the head parameters are trainable.

```python
def sigmoid_ft_w(z_w):  # Define a local sigmoid helper for the fine-tuning example.
    return 1.0 / (1.0 + np.exp(-z_w))  # Convert scores into probabilities.
def logloss_ft_w(w_w, b_w):  # Define average binary log-loss for the fixed-feature head.
    p_w = sigmoid_ft_w(Phi_ft_w @ w_w + b_w)  # Predict probabilities from frozen features and current head.
    eps_w = 1e-12  # Guard log(0) so the loss stays finite.
    return float(np.mean(-(y_ft_w * np.log(p_w + eps_w) + (1.0 - y_ft_w) * np.log(1.0 - p_w + eps_w))))  # Average guarded log-loss.
print("initial fine-tuning loss:", round(logloss_ft_w(w_pre_ft_w, b_pre_ft_w), 4))  # Inspect the pretrained head before adaptation.
```
▶ What you'll see: the pretrained head is plausible but not perfectly adapted to the new data.

```python
w_head_ft_w = w_pre_ft_w.copy()  # Copy the pretrained head so fine-tuning starts from learned structure.
b_head_ft_w = float(b_pre_ft_w)  # Copy the pretrained bias.
eta_ft_w = 0.08  # Use a small learning rate to make a gentle target-domain adjustment.
losses_ft_w = [logloss_ft_w(w_head_ft_w, b_head_ft_w)]  # Store losses during fine-tuning.
for step_w in range(25):  # Run a short head-only fine-tuning loop.
    p_ft_w = sigmoid_ft_w(Phi_ft_w @ w_head_ft_w + b_head_ft_w)  # Predict with the current head.
    grad_head_ft_w = ((p_ft_w - y_ft_w)[:, None] * Phi_ft_w).mean(axis=0)  # Compute gradient only for head weights.
    grad_bias_ft_w = float(np.mean(p_ft_w - y_ft_w))  # Compute gradient only for the head bias.
    w_head_ft_w = w_head_ft_w - eta_ft_w * grad_head_ft_w  # Update the trainable head weights.
    b_head_ft_w = b_head_ft_w - eta_ft_w * grad_bias_ft_w  # Update the trainable head bias.
    losses_ft_w.append(logloss_ft_w(w_head_ft_w, b_head_ft_w))  # Record the target-domain loss.
print("fine-tuned head:", np.round(w_head_ft_w, 4), "bias:", round(b_head_ft_w, 4))  # Inspect the adapted head.
print("weight change:", np.round(w_head_ft_w - w_pre_ft_w, 4))  # Inspect the small parameter adjustment.
print("loss before/after:", round(losses_ft_w[0], 4), round(losses_ft_w[-1], 4))  # Confirm the target loss improved.
```
▶ What you'll see: only the last-layer weights move, and they move by a small amount.

```python
score_pre_ft_w = Phi_ft_w @ w_pre_ft_w + b_pre_ft_w  # Compute pretrained scores on the target data.
score_new_ft_w = Phi_ft_w @ w_head_ft_w + b_head_ft_w  # Compute fine-tuned scores on the same frozen features.
plt.figure(figsize=(6.0, 4.0))  # Create a figure showing the adaptation.
plt.scatter(score_pre_ft_w, score_new_ft_w, c=y_ft_w, cmap="coolwarm", edgecolors="k", s=80)  # Compare before and after scores for each example.
plt.plot([score_pre_ft_w.min() - 0.2, score_pre_ft_w.max() + 0.2], [score_pre_ft_w.min() - 0.2, score_pre_ft_w.max() + 0.2], c="gray", ls="--", label="no change")  # Draw a reference line.
plt.xlabel("pretrained head score")  # Label the before-fine-tuning axis.
plt.ylabel("fine-tuned head score")  # Label the after-fine-tuning axis.
plt.legend(loc="best")  # Show the no-change reference.
plt.title("4: fine-tuning makes a small head adjustment")  # Title the required figure for this concept.
plt.show()  # Render the score-shift plot.
```
▶ What you'll see: points move slightly off the no-change line because the head adapts while features stay fixed.

```python
plt.figure(figsize=(6.0, 3.5))  # Create a second compact fine-tuning diagnostic.
plt.plot(range(len(losses_ft_w)), losses_ft_w, marker="o", color="purple")  # Plot target-domain loss during head-only updates.
plt.xlabel("head-only update")  # Label the update count.
plt.ylabel("average log-loss")  # Label the fine-tuning objective.
plt.title("4: small learning-rate fine-tuning lowers target loss")  # Title the loss curve.
plt.show()  # Render the fine-tuning loss curve.
```
▶ What you'll see: the target-domain loss decreases smoothly because the small learning rate preserves the pretrained starting point.

*Why it's done this way: fine-tuning reuses learned features instead of relearning them from a tiny target dataset. Freezing the base and nudging the head keeps the hypothesis class small enough to adapt without immediately forgetting useful structure.*

#### 5. SGD pseudocode in practice: shuffle, mini-batch, update, repeat

The pseudocode becomes real by shuffling data each epoch, slicing mini-batches, computing average loss and gradients on each mini-batch, and updating trainable weights. One epoch means one full pass through the training set. We implement the loop directly so every variable in the pseudocode has a concrete NumPy counterpart.

```python
X_loop_raw_w = np.array([[-2.0, -1.0], [-1.5, -0.7], [-0.8, -1.1], [-0.2, 0.4], [0.5, 0.8], [1.0, 1.1], [1.4, 0.7], [2.0, 1.5]])  # Create a tiny binary dataset.
y_loop_w = np.array([0.0, 0.0, 0.0, 0.0, 1.0, 1.0, 1.0, 1.0])  # Create labels aligned with the rows.
X_loop_w = np.c_[np.ones(len(X_loop_raw_w)), X_loop_raw_w]  # Add a bias column so the bias is learned as weight 0.
w_loop_w = np.zeros(X_loop_w.shape[1])  # Initialize logistic weights to zero.
eta_loop_w = 0.4  # Choose a learning rate for mini-batch SGD.
batch_size_loop_w = 2  # Use mini-batches of two examples so multiple updates happen per epoch.
print("X with bias:\n", X_loop_w)  # Inspect the training matrix.
print("initial weights:", w_loop_w)  # Inspect the trainable parameters.
```
▶ What you'll see: eight examples, three trainable weights, and mini-batches of size two.

```python
def loss_loop_w(w_w):  # Define full-dataset logistic loss for monitoring the SGD loop.
    p_w = 1.0 / (1.0 + np.exp(-(X_loop_w @ w_w)))  # Predict probabilities for all examples.
    eps_w = 1e-12  # Guard log(0) for numerical safety.
    return float(np.mean(-(y_loop_w * np.log(p_w + eps_w) + (1.0 - y_loop_w) * np.log(1.0 - p_w + eps_w))))  # Return average log-loss.
print("initial full loss:", round(loss_loop_w(w_loop_w), 4))  # Inspect the loss before training.
```
▶ What you'll see: zero weights predict 0.5 for every row, giving the baseline logistic loss.

```python
rng_loop_w = np.random.default_rng(30)  # Create a seeded generator for reproducible shuffling.
loss_history_loop_w = [loss_loop_w(w_loop_w)]  # Store full-dataset loss after each mini-batch update.
order_first_epoch_w = None  # Save the first shuffle order so we can inspect what one epoch means.
for epoch_w in range(8):  # Repeat several epochs, where each epoch is one pass through all rows.
    order_loop_w = rng_loop_w.permutation(len(y_loop_w))  # Shuffle example indices at the start of the epoch.
    if epoch_w == 0:  # Check whether this is the first epoch.
        order_first_epoch_w = order_loop_w.copy()  # Save the first epoch's order for printing.
    for start_w in range(0, len(y_loop_w), batch_size_loop_w):  # Step through consecutive mini-batches.
        batch_idx_w = order_loop_w[start_w:start_w + batch_size_loop_w]  # Select this mini-batch's shuffled indices.
        Xb_loop_w = X_loop_w[batch_idx_w]  # Gather the mini-batch feature rows.
        yb_loop_w = y_loop_w[batch_idx_w]  # Gather the mini-batch labels.
        p_loop_w = 1.0 / (1.0 + np.exp(-(Xb_loop_w @ w_loop_w)))  # Predict probabilities on the mini-batch.
        grad_loop_w = ((p_loop_w - yb_loop_w)[:, None] * Xb_loop_w).mean(axis=0)  # Average mini-batch logistic gradients.
        w_loop_w = w_loop_w - eta_loop_w * grad_loop_w  # Apply the SGD update to trainable weights.
        loss_history_loop_w.append(loss_loop_w(w_loop_w))  # Monitor full loss after this mini-batch update.
print("first epoch shuffled order:", order_first_epoch_w)  # Inspect the shuffled pass through the data.
print("final weights:", np.round(w_loop_w, 4))  # Inspect the trained parameters.
print("final loss:", round(loss_history_loop_w[-1], 4))  # Inspect the final monitored loss.
```
▶ What you'll see: each epoch visits every example once in shuffled order, and each mini-batch causes one update.

```python
plt.figure(figsize=(6.0, 3.8))  # Create the practical SGD training figure.
plt.plot(range(len(loss_history_loop_w)), loss_history_loop_w, marker="o", color="seagreen")  # Plot monitored loss after each mini-batch update.
plt.xlabel("mini-batch update")  # Label the update number.
plt.ylabel("full-dataset log-loss")  # Label the monitored loss.
plt.title("5: SGD loop lowers loss over shuffled mini-batches")  # Title the required figure for this concept.
plt.show()  # Render the loss curve.
```
▶ What you'll see: the loss generally trends downward, with small bumps possible because mini-batches are noisy.

```python
xx_loop_w, yy_loop_w = np.meshgrid(np.linspace(-2.5, 2.5, 120), np.linspace(-1.6, 1.8, 120))  # Build a grid for visualizing the learned classifier.
grid_loop_w = np.c_[np.ones(xx_loop_w.size), xx_loop_w.ravel(), yy_loop_w.ravel()]  # Add a bias column to every grid point.
prob_grid_loop_w = 1.0 / (1.0 + np.exp(-(grid_loop_w @ w_loop_w)))  # Predict probabilities on the grid.
plt.figure(figsize=(5.5, 4.2))  # Create the classifier visualization.
plt.contourf(xx_loop_w, yy_loop_w, prob_grid_loop_w.reshape(xx_loop_w.shape), levels=[0.0, 0.5, 1.0], colors=["tab:blue", "tab:orange"], alpha=0.18)  # Shade predicted classes.
plt.contour(xx_loop_w, yy_loop_w, prob_grid_loop_w.reshape(xx_loop_w.shape), levels=[0.5], colors="black", linewidths=2)  # Draw the 0.5 decision boundary.
plt.scatter(X_loop_raw_w[:, 0], X_loop_raw_w[:, 1], c=y_loop_w, cmap="coolwarm", edgecolors="k", s=80)  # Plot the training examples.
plt.xlabel("feature 1")  # Label the first feature axis.
plt.ylabel("feature 2")  # Label the second feature axis.
plt.title("5: mini-batch SGD learns a logistic boundary")  # Title the final visual check.
plt.show()  # Render the learned boundary.
```
▶ What you'll see: the learned boundary separates the tiny classes after repeated shuffled mini-batch updates.

*Why it's done this way: the pseudocode's shuffle → mini-batch → gradient → update loop makes SGD scalable. Shuffling prevents repeated ordering bias, mini-batches make gradients cheap, and one epoch simply means every example has had one chance to influence the weights.*

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
