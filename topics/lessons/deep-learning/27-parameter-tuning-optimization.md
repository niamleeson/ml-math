# Parameter Tuning & Optimization
> **Source:** CS 230 · **Category:** Method/Tips · **Type:** ⚖️ Both · [↑ Full reference](../../ai-ml-cheatsheets.md)
> 📓 The coded examples form a runnable notebook section; an `.ipynb` will be generated.

## ✍️ Toy Examples

These tiny optimization toys isolate the update and search mechanics before the full worked example. Each block prints the arithmetic, asserts the key result, and draws one visual.

### ✍️ Toy 1 · Learning-rate schedule

A schedule makes early steps large and later steps smaller by changing the learning rate over time.

```python
import numpy as np
import matplotlib.pyplot as plt

t1_rng = np.random.default_rng(0)  # -> reproducible generator seeded with 0
t1_steps = np.arange(8)  # -> [0, 1, 2, 3, 4, 5, 6, 7]
t1_initial_lr = 0.4  # -> 0.4
t1_decay = 0.5  # -> 0.5
t1_drop_every = 2  # -> 2
t1_drop_counts = t1_steps // t1_drop_every  # -> [0, 0, 1, 1, 2, 2, 3, 3]
t1_lrs = t1_initial_lr * (t1_decay ** t1_drop_counts)  # -> [0.4, 0.4, 0.2, 0.2, 0.1, 0.1, 0.05, 0.05]
t1_gradient = np.full_like(t1_lrs, 2.0, dtype=float)  # -> [2.0, 2.0, 2.0, 2.0, 2.0, 2.0, 2.0, 2.0]
t1_update_sizes = t1_lrs * t1_gradient  # -> [0.8, 0.8, 0.4, 0.4, 0.2, 0.2, 0.1, 0.1]
print("rng seed:", 0)
print("steps:", t1_steps.tolist())
print("drop counts:", t1_drop_counts.tolist())
print("learning rates:", t1_lrs.tolist())
print("fixed gradient:", t1_gradient.tolist())
print("update sizes lr * grad:", t1_update_sizes.tolist())
assert np.allclose(t1_lrs, [0.4, 0.4, 0.2, 0.2, 0.1, 0.1, 0.05, 0.05])
assert t1_update_sizes[-1] < t1_update_sizes[0]

t1_fig, t1_ax = plt.subplots(figsize=(6, 3.2))
t1_ax.step(t1_steps, t1_lrs, where="post", marker="o", label="learning rate")
t1_ax.step(t1_steps, t1_update_sizes, where="post", marker="s", label="update size")
t1_ax.set_xlabel("step")
t1_ax.set_title("Step-decay schedule shrinks updates")
t1_ax.legend()
plt.show()
```
▶ What you'll see: the learning rate stays flat for two steps, then halves, making the same gradient produce smaller updates later.

### ✍️ Toy 2 · Momentum

Momentum smooths gradients into a velocity so repeated directions build up and sign flips are damped.

```python
import numpy as np
import matplotlib.pyplot as plt

t2_rng = np.random.default_rng(0)  # -> reproducible generator seeded with 0
t2_gradients = np.array([4.0, 3.0, 2.0, -1.0, -2.0, -1.0])  # -> six scalar gradients
t2_beta = 0.8  # -> momentum memory
t2_lr = 0.1  # -> learning rate
t2_velocity = 0.0  # -> 0.0
t2_velocities = []  # -> []
for t2_grad in t2_gradients:
    t2_velocity = t2_beta * t2_velocity + (1.0 - t2_beta) * t2_grad
    t2_velocities.append(t2_velocity)
t2_velocities = np.array(t2_velocities)  # -> [0.8, 1.24, 1.392, 0.9136, 0.33088, 0.064704]
t2_updates = -t2_lr * t2_velocities  # -> [-0.08, -0.124, -0.1392, -0.09136, -0.033088, -0.0064704]
t2_start = 1.0  # -> 1.0
t2_position_path = t2_start + np.cumsum(t2_updates)  # -> [0.92, 0.796, 0.6568, 0.56544, 0.532352, 0.5258816]
print("rng seed:", 0)
print("gradients:", t2_gradients.tolist())
print("beta:", t2_beta)
print("velocities:", np.round(t2_velocities, 6).tolist())
print("updates:", np.round(t2_updates, 6).tolist())
print("position path:", np.round(t2_position_path, 6).tolist())
assert np.allclose(np.round(t2_velocities, 6), [0.8, 1.24, 1.392, 0.9136, 0.33088, 0.064704])
assert abs(t2_velocities[-1]) < abs(t2_gradients[-1])

t2_fig, t2_ax = plt.subplots(figsize=(6, 3.2))
t2_ax.plot(t2_gradients, marker="o", label="raw gradient")
t2_ax.plot(t2_velocities, marker="s", label="momentum velocity")
t2_ax.axhline(0.0, color="black", linewidth=0.8)
t2_ax.set_xlabel("step")
t2_ax.set_title("Momentum damps a late sign flip")
t2_ax.legend()
plt.show()
```
▶ What you'll see: the velocity changes direction more slowly than the raw gradients, so the update path is smoother.

### ✍️ Toy 3 · Adam update

Adam combines a first moment, a second moment, bias correction, and a coordinatewise scaled step.

```python
import numpy as np
import matplotlib.pyplot as plt

t3_rng = np.random.default_rng(0)  # -> reproducible generator seeded with 0
t3_w = np.array([1.0, -2.0])  # -> starting parameters
t3_grad = np.array([0.5, -1.5])  # -> current gradient
t3_lr = 0.1  # -> Adam learning rate
t3_beta1 = 0.9  # -> first-moment decay
t3_beta2 = 0.99  # -> second-moment decay
t3_eps = 1e-8  # -> numerical guard
t3_m = (1.0 - t3_beta1) * t3_grad  # -> [0.05, -0.15]
t3_v = (1.0 - t3_beta2) * (t3_grad ** 2)  # -> [0.0025, 0.0225]
t3_m_hat = t3_m / (1.0 - t3_beta1)  # -> [0.5, -1.5]
t3_v_hat = t3_v / (1.0 - t3_beta2)  # -> [0.25, 2.25]
t3_denom = np.sqrt(t3_v_hat) + t3_eps  # -> [0.50000001, 1.50000001]
t3_step = t3_lr * t3_m_hat / t3_denom  # -> [0.099999998, -0.0999999993]
t3_new_w = t3_w - t3_step  # -> [0.900000002, -1.9000000007]
print("rng seed:", 0)
print("w:", t3_w.tolist())
print("gradient:", t3_grad.tolist())
print("first moment m:", np.round(t3_m, 4).tolist())
print("second moment v:", np.round(t3_v, 4).tolist())
print("bias-corrected m_hat:", t3_m_hat.tolist())
print("bias-corrected v_hat:", t3_v_hat.tolist())
print("Adam step:", np.round(t3_step, 6).tolist())
print("new w:", np.round(t3_new_w, 6).tolist())
assert np.allclose(np.round(t3_step, 6), [0.1, -0.1])
assert np.allclose(np.round(t3_new_w, 6), [0.9, -1.9])

t3_fig, t3_ax = plt.subplots(figsize=(6, 3.2))
t3_positions = np.arange(t3_w.size)
t3_ax.bar(t3_positions - 0.18, t3_w, width=0.36, label="before")
t3_ax.bar(t3_positions + 0.18, t3_new_w, width=0.36, label="after Adam")
t3_ax.axhline(0.0, color="black", linewidth=0.8)
t3_ax.set_xticks(t3_positions, ["w0", "w1"])
t3_ax.set_title("One Adam update")
t3_ax.legend()
plt.show()
```
▶ What you'll see: after bias correction, the first Adam step moves each coordinate about 0.1 in the signed gradient direction.

### ✍️ Toy 4 · Grid vs random search

Grid search tests fixed Cartesian combinations, while random search spends the same budget exploring continuous values.

```python
import numpy as np
import matplotlib.pyplot as plt

t4_rng = np.random.default_rng(0)  # -> reproducible generator seeded with 0
t4_target_log_lr = float(np.log10(0.03))  # -> -1.5228787452803376
t4_target_dropout = 0.2  # -> 0.2
t4_grid_lr = np.array([0.001, 0.01, 0.1])  # -> grid learning rates
t4_grid_dropout = np.array([0.0, 0.2, 0.4])  # -> grid dropout values
t4_grid_pairs = np.array([[t4_lr, t4_drop] for t4_lr in t4_grid_lr for t4_drop in t4_grid_dropout])  # -> 9 grid trials
t4_grid_log_error = np.log10(t4_grid_pairs[:, 0]) - t4_target_log_lr  # -> [-1.477, -1.477, -1.477, -0.477, -0.477, -0.477, 0.523, 0.523, 0.523]
t4_grid_drop_error = t4_grid_pairs[:, 1] - t4_target_dropout  # -> [-0.2, 0.0, 0.2, -0.2, 0.0, 0.2, -0.2, 0.0, 0.2]
t4_grid_scores = 1.0 - t4_grid_log_error ** 2 - 4.0 * t4_grid_drop_error ** 2  # -> [-1.342, -1.182, -1.342, 0.612, 0.772, 0.612, 0.567, 0.727, 0.567]
t4_random_log_lr = t4_rng.uniform(-3.0, -1.0, 9)  # -> [-1.726, -2.46, -2.918, -2.967, -1.373, -1.174, -1.787, -1.541, -1.913]
t4_random_lr = 10 ** t4_random_log_lr  # -> [0.0188, 0.0035, 0.0012, 0.0011, 0.0423, 0.0669, 0.0163, 0.0288, 0.0122]
t4_random_dropout = t4_rng.uniform(0.0, 0.4, 9)  # -> [0.374, 0.326, 0.001, 0.343, 0.013, 0.292, 0.07, 0.345, 0.217]
t4_random_pairs = np.column_stack([t4_random_lr, t4_random_dropout])  # -> 9 random trials
t4_random_log_error = np.log10(t4_random_pairs[:, 0]) - t4_target_log_lr  # -> [-0.203, -0.937, -1.395, -1.444, 0.15, 0.349, -0.264, -0.018, -0.391]
t4_random_drop_error = t4_random_pairs[:, 1] - t4_target_dropout  # -> [0.174, 0.126, -0.199, 0.143, -0.187, 0.092, -0.13, 0.145, 0.017]
t4_random_scores = 1.0 - t4_random_log_error ** 2 - 4.0 * t4_random_drop_error ** 2  # -> [0.838, 0.057, -1.105, -1.167, 0.838, 0.845, 0.863, 0.915, 0.847]
t4_best_grid_idx = int(np.argmax(t4_grid_scores))  # -> 4
t4_best_random_idx = int(np.argmax(t4_random_scores))  # -> 7
t4_best_grid_score = float(t4_grid_scores[t4_best_grid_idx])  # -> 0.7723553082947351
t4_best_random_score = float(t4_random_scores[t4_best_random_idx])  # -> 0.9152560558338341
print("rng seed:", 0)
print("grid pairs:", np.round(t4_grid_pairs, 4).tolist())
print("grid scores:", np.round(t4_grid_scores, 3).tolist())
print("best grid pair/score:", t4_grid_pairs[t4_best_grid_idx].tolist(), round(t4_best_grid_score, 3))
print("random pairs:", np.round(t4_random_pairs, 4).tolist())
print("random scores:", np.round(t4_random_scores, 3).tolist())
print("best random pair/score:", np.round(t4_random_pairs[t4_best_random_idx], 4).tolist(), round(t4_best_random_score, 3))
assert t4_best_grid_idx == 4
assert t4_best_random_score > t4_best_grid_score

t4_fig, t4_axes = plt.subplots(1, 2, figsize=(9, 3.5))
t4_axes[0].scatter(np.log10(t4_grid_pairs[:, 0]), t4_grid_pairs[:, 1], c=t4_grid_scores, cmap="viridis", s=90)
t4_axes[0].scatter(np.log10(t4_grid_pairs[t4_best_grid_idx, 0]), t4_grid_pairs[t4_best_grid_idx, 1], marker="*", s=180, color="red")
t4_axes[0].set_title("grid trials")
t4_axes[1].scatter(np.log10(t4_random_pairs[:, 0]), t4_random_pairs[:, 1], c=t4_random_scores, cmap="viridis", s=90)
t4_axes[1].scatter(np.log10(t4_random_pairs[t4_best_random_idx, 0]), t4_random_pairs[t4_best_random_idx, 1], marker="*", s=180, color="red")
t4_axes[1].set_title("random trials")
for t4_ax in t4_axes:
    t4_ax.set_xlabel("log10(lr)")
    t4_ax.set_ylabel("dropout")
plt.tight_layout()
plt.show()
```
▶ What you'll see: the grid checks regular lattice points, while random search samples uneven continuous locations and lands closer to the hidden optimum in this run.

## 0. Step-by-Step Worked Example — Start Here (Beginner Friendly)

> 🧑‍🎓 **New to this topic? Start here.** This is a gentle, fully runnable walkthrough that
> builds up *every* idea in this lesson one tiny step at a time. Each step **prints** the
> numbers it computes and **draws a picture** so you can *see* what is happening. Run the
> cells in order from top to bottom. Nothing here needs the internet or any downloaded data.

### The Big Picture — What You'll Learn

In plain terms, here is what the steps below will show you:

- **SGD** moves opposite the gradient, and **momentum** smooths repeated gradient directions.
- **RMSprop** scales coordinates by recent squared gradients, while **Adam** combines scaling, momentum, and bias correction.
- **Learning-rate schedules** reduce late jitter, and **Xavier initialization** keeps activation variance healthier.
- **Transfer-learning rules** connect data size to freezing, partial tuning, or full fine-tuning.

Everything below (starting at **§1 Overview**) develops these same ideas with full derivations,
more examples, and optimizer experiments.

**What we will build, step by step:**
1. **Stochastic gradient descent** — move opposite the gradient on a simple bowl.
2. **Momentum** — average gradients to damp zig-zags.
3. **RMSprop** — scale each coordinate by recent squared-gradient size.
4. **Adam** — combine momentum, RMSprop, and bias correction.
5. **Learning-rate schedules** — take larger steps early and smaller steps late.
6. **Xavier / Glorot initialization** — keep activation variance from collapsing or exploding.
7. **Transfer-learning tuning rule of thumb** — choose how many layers to train based on data size.

### Step 0 — Set up our tools

We import NumPy (vectors + gradients) and Matplotlib (pictures). We fix a random **seed** so the
optimizer paths are reproducible. We also define a tiny `log()` helper so every step prints a
clearly labeled line.

```python
import numpy as np                       # NumPy: vectors, gradients, random weights, and schedules.
import matplotlib.pyplot as plt          # Matplotlib: draw optimizer paths, curves, and histograms.

np.random.seed(0)                         # Fix the seed so every run prints the SAME numbers.
plt.rcParams["figure.figsize"] = (7, 4)   # A comfortable default plot size.

def log(label, value):                    # A tiny logger so each printed line explains itself.
    print(f"[{label}] {value}")           # Format is: [what this is] the value.

log("setup", "tools ready — NumPy + Matplotlib imported, seed fixed to 0")  # Confirm setup ran.
```
▶ What you'll see: one line confirming the tools are ready.

### Step 1 — Stochastic gradient descent: step downhill on a bowl

Gradient descent moves parameters opposite the gradient: $w_{t+1}=w_t-\alpha g_t$. We use a
2-D quadratic bowl because the gradient is exact and the path is easy to see.

```python
A_sgd_demo = np.array([[8.0, 0.0], [0.0, 1.0]])  # Curvature matrix for J(w)=1/2 w^T A w.
w_sgd_demo = np.array([2.6, 2.0])  # Start away from the minimum at (0,0).
alpha_sgd_demo = 0.09  # Learning rate controlling step length.
path_sgd_demo = [w_sgd_demo.copy()]  # Store every parameter vector for plotting.
loss_sgd_demo = [0.5 * w_sgd_demo @ A_sgd_demo @ w_sgd_demo]  # Store starting loss.
log("initial w", w_sgd_demo)  # Print starting point.
log("initial gradient", A_sgd_demo @ w_sgd_demo)  # Print g=A w at the start.
for step_sgd_demo in range(28):  # Run a short descent trajectory.
    grad_sgd_demo = A_sgd_demo @ w_sgd_demo  # Compute the exact gradient.
    w_sgd_demo = w_sgd_demo - alpha_sgd_demo * grad_sgd_demo  # Apply the SGD update.
    path_sgd_demo.append(w_sgd_demo.copy())  # Save the new point.
    loss_sgd_demo.append(0.5 * w_sgd_demo @ A_sgd_demo @ w_sgd_demo)  # Save the new loss.
log("first three SGD points", np.round(np.array(path_sgd_demo[:3]), 3))  # Show the first updates.
log("first/last loss", (round(float(loss_sgd_demo[0]), 3), round(float(loss_sgd_demo[-1]), 5)))  # Show loss decreased.

path_sgd_demo = np.array(path_sgd_demo)  # Convert the path to an array.
x1_sgd_demo = np.linspace(-3.0, 3.0, 160)  # Build contour x-coordinates.
x2_sgd_demo = np.linspace(-3.0, 3.0, 160)  # Build contour y-coordinates.
X1_sgd_demo, X2_sgd_demo = np.meshgrid(x1_sgd_demo, x2_sgd_demo)  # Create a grid of parameter values.
Z_sgd_demo = 0.5 * (8.0 * X1_sgd_demo ** 2 + X2_sgd_demo ** 2)  # Evaluate the quadratic loss.
plt.contour(X1_sgd_demo, X2_sgd_demo, Z_sgd_demo, levels=24, cmap="Greys")  # Draw equal-loss contours.
plt.plot(path_sgd_demo[:, 0], path_sgd_demo[:, 1], "o-", color="tab:blue", markersize=3, label="SGD path")  # Draw descent path.
plt.scatter([0.0], [0.0], marker="*", s=160, color="black", label="minimum")  # Mark the optimum.
plt.xlabel("w1")  # Label first parameter.
plt.ylabel("w2")  # Label second parameter.
plt.title("SGD walks downhill on a quadratic bowl")  # Explain the figure.
plt.axis("equal")  # Preserve geometry.
plt.legend()  # Show path and minimum labels.
plt.show()  # Render the SGD path.
```
▶ What you'll see: the path moves downhill toward the center, with larger early corrections in the steeper direction.

### Step 2 — Momentum: accumulate consistent gradients and damp zig-zags

Momentum keeps a moving average of gradients before taking the step. Consistent downhill signals
build velocity, while alternating left-right gradients partially cancel, reducing zig-zag motion.

```python
A_mom_demo = np.array([[14.0, 0.0], [0.0, 1.0]])  # Sharper bowl that makes zig-zags visible.
w0_mom_demo = np.array([2.4, 2.2])  # Shared starting point for plain and momentum updates.
alpha_mom_demo = 0.12  # Learning rate for both paths.
beta_mom_demo = 0.80  # Momentum memory parameter.
w_plain_demo = w0_mom_demo.copy()  # Initialize plain SGD path.
w_mom_demo = w0_mom_demo.copy()  # Initialize momentum path.
v_mom_demo = np.zeros_like(w0_mom_demo)  # Start velocity at zero.
path_plain_demo = [w_plain_demo.copy()]  # Store plain SGD points.
path_mom_demo = [w_mom_demo.copy()]  # Store momentum points.
for step_mom_demo in range(34):  # Run both optimizers for the same number of steps.
    grad_plain_demo = A_mom_demo @ w_plain_demo  # Compute plain SGD gradient.
    w_plain_demo = w_plain_demo - alpha_mom_demo * grad_plain_demo  # Update plain SGD.
    grad_mom_demo = A_mom_demo @ w_mom_demo  # Compute current gradient for momentum.
    v_mom_demo = beta_mom_demo * v_mom_demo + (1.0 - beta_mom_demo) * grad_mom_demo  # Smooth gradients into velocity.
    w_mom_demo = w_mom_demo - alpha_mom_demo * v_mom_demo  # Update using velocity.
    path_plain_demo.append(w_plain_demo.copy())  # Store plain point.
    path_mom_demo.append(w_mom_demo.copy())  # Store momentum point.
log("first unsmoothed gradient", np.round(A_mom_demo @ w0_mom_demo, 3))  # Print initial gradient.
log("final plain w", np.round(w_plain_demo, 3))  # Print plain final point.
log("final momentum w", np.round(w_mom_demo, 3))  # Print momentum final point.

path_plain_demo = np.array(path_plain_demo)  # Convert plain path for plotting.
path_mom_demo = np.array(path_mom_demo)  # Convert momentum path for plotting.
x1_mom_demo = np.linspace(-2.8, 2.8, 180)  # Build contour x-coordinates.
x2_mom_demo = np.linspace(-2.8, 2.8, 180)  # Build contour y-coordinates.
X1_mom_demo, X2_mom_demo = np.meshgrid(x1_mom_demo, x2_mom_demo)  # Create contour grid.
Z_mom_demo = 0.5 * (14.0 * X1_mom_demo ** 2 + X2_mom_demo ** 2)  # Evaluate the sharp bowl.
plt.contour(X1_mom_demo, X2_mom_demo, Z_mom_demo, levels=26, cmap="Greys")  # Draw loss contours.
plt.plot(path_plain_demo[:, 0], path_plain_demo[:, 1], "o-", markersize=3, label="plain SGD")  # Plot plain path.
plt.plot(path_mom_demo[:, 0], path_mom_demo[:, 1], "o-", markersize=3, label="momentum")  # Plot momentum path.
plt.scatter([0.0], [0.0], marker="*", s=160, color="black", label="minimum")  # Mark the optimum.
plt.xlabel("w1")  # Label steep coordinate.
plt.ylabel("w2")  # Label shallow coordinate.
plt.title("Momentum smooths repeated gradient directions")  # Explain the comparison.
plt.axis("equal")  # Preserve geometry.
plt.legend()  # Identify paths.
plt.show()  # Render the momentum comparison.
```
▶ What you'll see: plain SGD bounces more across the narrow valley, while momentum uses memory to smooth and accelerate the path.

### Step 3 — RMSprop: scale each coordinate by recent gradient size

RMSprop tracks an average of squared gradients, then divides each coordinate by its recent root
mean square. Coordinates with consistently huge gradients get smaller effective steps.

```python
A_rms_demo = np.array([[30.0, 0.0], [0.0, 0.8]])  # Make coordinate 1 much steeper than coordinate 2.
w_rms_demo = np.array([2.2, 2.2])  # Start both coordinates at the same value.
s_rms_demo = np.zeros_like(w_rms_demo)  # Initialize squared-gradient memory.
alpha_rms_demo = 0.18  # Base learning rate before adaptive scaling.
beta_rms_demo = 0.90  # Decay for squared-gradient memory.
eps_rms_demo = 1e-8  # Numerical guard for the denominator.
path_rms_demo = [w_rms_demo.copy()]  # Store RMSprop path.
denom_rms_demo = []  # Store denominators for inspection.
log("initial RMSprop gradient", A_rms_demo @ w_rms_demo)  # Show raw gradient scale mismatch.
for step_rms_demo in range(34):  # Run the adaptive optimizer.
    grad_rms_demo = A_rms_demo @ w_rms_demo  # Compute the exact gradient.
    s_rms_demo = beta_rms_demo * s_rms_demo + (1.0 - beta_rms_demo) * grad_rms_demo ** 2  # Update squared-gradient average.
    scale_rms_demo = np.sqrt(s_rms_demo) + eps_rms_demo  # Convert memory to RMS denominator.
    w_rms_demo = w_rms_demo - alpha_rms_demo * grad_rms_demo / scale_rms_demo  # Apply coordinate-scaled update.
    path_rms_demo.append(w_rms_demo.copy())  # Save new point.
    denom_rms_demo.append(scale_rms_demo.copy())  # Save denominator.
log("first RMS denominator", np.round(denom_rms_demo[0], 3))  # Print first adaptive scales.
log("final RMSprop w", np.round(w_rms_demo, 4))  # Print final parameters.

path_rms_demo = np.array(path_rms_demo)  # Convert path to array.
denom_rms_demo = np.array(denom_rms_demo)  # Convert denominators to array.
fig_rms_demo, axes_rms_demo = plt.subplots(1, 2, figsize=(11, 4))  # Create path and scale panels.
x1_rms_demo = np.linspace(-2.6, 2.6, 160)  # Build contour x-coordinates.
x2_rms_demo = np.linspace(-2.6, 2.6, 160)  # Build contour y-coordinates.
X1_rms_demo, X2_rms_demo = np.meshgrid(x1_rms_demo, x2_rms_demo)  # Create contour grid.
Z_rms_demo = 0.5 * (30.0 * X1_rms_demo ** 2 + 0.8 * X2_rms_demo ** 2)  # Evaluate uneven bowl.
axes_rms_demo[0].contour(X1_rms_demo, X2_rms_demo, Z_rms_demo, levels=25, cmap="Greys")  # Draw contours.
axes_rms_demo[0].plot(path_rms_demo[:, 0], path_rms_demo[:, 1], "o-", markersize=3, color="tab:green")  # Plot RMSprop path.
axes_rms_demo[0].scatter([0.0], [0.0], marker="*", s=150, color="black")  # Mark minimum.
axes_rms_demo[0].set_title("RMSprop path")  # Title path panel.
axes_rms_demo[0].set_xlabel("w1")  # Label coordinate 1.
axes_rms_demo[0].set_ylabel("w2")  # Label coordinate 2.
axes_rms_demo[1].plot(denom_rms_demo[:, 0], label="denominator for w1")  # Plot steep-coordinate denominator.
axes_rms_demo[1].plot(denom_rms_demo[:, 1], label="denominator for w2")  # Plot shallow-coordinate denominator.
axes_rms_demo[1].set_title("larger gradients get larger denominators")  # Title scale panel.
axes_rms_demo[1].set_xlabel("step")  # Label update step.
axes_rms_demo[1].legend()  # Identify denominators.
plt.tight_layout()  # Prevent overlap.
plt.show()  # Render RMSprop diagnostics.
```
▶ What you'll see: the steep coordinate receives a much larger denominator, so RMSprop avoids huge jumps along that axis.

### Step 4 — Adam: combine momentum, RMSprop, and bias correction

Adam keeps both a first moment for direction and a second moment for scale. Because both start at
zero, the first few estimates are biased low, so Adam divides by $1-\beta^t$ before updating.

```python
A_adam_demo = np.array([[18.0, 0.0], [0.0, 1.2]])  # Shared quadratic bowl for Adam.
w_adam_demo = np.array([2.5, 2.0])  # Starting point.
m_adam_demo = np.zeros_like(w_adam_demo)  # First-moment memory.
s_adam_demo = np.zeros_like(w_adam_demo)  # Second-moment memory.
alpha_adam_demo = 0.12  # Adam learning rate for this tiny example.
beta1_adam_demo = 0.90  # First-moment decay.
beta2_adam_demo = 0.98  # Second-moment decay chosen to adapt visibly in a short run.
eps_adam_demo = 1e-8  # Numerical guard.
path_adam_demo = [w_adam_demo.copy()]  # Store Adam path.
for t_adam_demo in range(1, 37):  # Use one-based t for bias correction.
    grad_adam_demo = A_adam_demo @ w_adam_demo  # Compute current gradient.
    m_adam_demo = beta1_adam_demo * m_adam_demo + (1.0 - beta1_adam_demo) * grad_adam_demo  # Update first moment.
    s_adam_demo = beta2_adam_demo * s_adam_demo + (1.0 - beta2_adam_demo) * grad_adam_demo ** 2  # Update second moment.
    m_hat_adam_demo = m_adam_demo / (1.0 - beta1_adam_demo ** t_adam_demo)  # Bias-correct first moment.
    s_hat_adam_demo = s_adam_demo / (1.0 - beta2_adam_demo ** t_adam_demo)  # Bias-correct second moment.
    if t_adam_demo == 1:  # Print the startup correction once.
        log("raw first moment at t=1", np.round(m_adam_demo, 3))  # Show zero-biased first moment.
        log("corrected first moment at t=1", np.round(m_hat_adam_demo, 3))  # Show restored gradient scale.
        log("corrected second moment at t=1", np.round(s_hat_adam_demo, 3))  # Show squared-gradient scale.
    w_adam_demo = w_adam_demo - alpha_adam_demo * m_hat_adam_demo / (np.sqrt(s_hat_adam_demo) + eps_adam_demo)  # Apply Adam update.
    path_adam_demo.append(w_adam_demo.copy())  # Save new point.
log("final Adam w", np.round(w_adam_demo, 4))  # Print final parameters.

path_adam_demo = np.array(path_adam_demo)  # Convert path to array for plotting.
x1_adam_demo = np.linspace(-2.8, 2.8, 180)  # Build contour x-coordinates.
x2_adam_demo = np.linspace(-2.8, 2.8, 180)  # Build contour y-coordinates.
X1_adam_demo, X2_adam_demo = np.meshgrid(x1_adam_demo, x2_adam_demo)  # Create contour grid.
Z_adam_demo = 0.5 * (18.0 * X1_adam_demo ** 2 + 1.2 * X2_adam_demo ** 2)  # Evaluate the loss surface.
plt.contour(X1_adam_demo, X2_adam_demo, Z_adam_demo, levels=28, cmap="Greys")  # Draw contours.
plt.plot(path_adam_demo[:, 0], path_adam_demo[:, 1], "o-", markersize=3, color="tab:purple", label="Adam")  # Plot Adam path.
plt.scatter([0.0], [0.0], marker="*", s=160, color="black", label="minimum")  # Mark optimum.
plt.xlabel("w1")  # Label first coordinate.
plt.ylabel("w2")  # Label second coordinate.
plt.title("Adam uses corrected direction and corrected scale")  # Explain the path.
plt.axis("equal")  # Preserve geometry.
plt.legend()  # Identify the path.
plt.show()  # Render Adam path.
```
▶ What you'll see: the first raw moment is small because it starts from zero, but bias correction restores the proper scale before Adam takes adaptive steps.

### Step 5 — Learning-rate schedules: large early steps, smaller late steps

A schedule changes the learning rate over time. Large early steps make quick progress; smaller
late steps reduce noisy bouncing near the minimum.

```python
T_sched_demo = 60  # Number of toy training steps.
steps_sched_demo = np.arange(T_sched_demo)  # Step indices.
alpha0_sched_demo = 0.16  # Initial learning rate.
alpha_min_sched_demo = 0.015  # Cosine schedule floor.
fixed_sched_demo = np.full(T_sched_demo, alpha0_sched_demo)  # Fixed learning rate.
step_sched_demo = alpha0_sched_demo * (0.5 ** (steps_sched_demo // 15))  # Drop by half every 15 steps.
exp_sched_demo = alpha0_sched_demo * np.exp(-0.04 * steps_sched_demo)  # Smooth exponential decay.
cos_sched_demo = alpha_min_sched_demo + 0.5 * (alpha0_sched_demo - alpha_min_sched_demo) * (1.0 + np.cos(np.pi * steps_sched_demo / (T_sched_demo - 1)))  # Cosine decay.
rng_sched_demo = np.random.default_rng(0)  # Seeded noise source for mini-batch-like gradients.
w_fixed_demo = 2.2  # Initial scalar parameter for fixed-rate training.
w_cos_demo = 2.2  # Initial scalar parameter for decayed-rate training.
path_fixed_sched_demo = [w_fixed_demo]  # Store fixed-rate parameter path.
path_cos_sched_demo = [w_cos_demo]  # Store cosine-rate parameter path.
for t_sched_demo in range(T_sched_demo):  # Simulate noisy scalar optimization.
    noise_sched_demo = rng_sched_demo.normal(scale=0.35)  # Shared gradient noise for fair comparison.
    grad_fixed_sched_demo = 6.0 * w_fixed_demo + noise_sched_demo  # Noisy gradient with fixed learning rate.
    grad_cos_sched_demo = 6.0 * w_cos_demo + noise_sched_demo  # Same noisy gradient idea for cosine decay.
    w_fixed_demo = w_fixed_demo - fixed_sched_demo[t_sched_demo] * grad_fixed_sched_demo  # Update with constant step size.
    w_cos_demo = w_cos_demo - cos_sched_demo[t_sched_demo] * grad_cos_sched_demo  # Update with decayed step size.
    path_fixed_sched_demo.append(w_fixed_demo)  # Save fixed-rate parameter.
    path_cos_sched_demo.append(w_cos_demo)  # Save decayed-rate parameter.
log("first five step-decay lrs", np.round(step_sched_demo[:5], 3))  # Print early schedule values.
log("last five cosine lrs", np.round(cos_sched_demo[-5:], 3))  # Print late schedule values.
log("final |w| fixed vs cosine", (round(abs(w_fixed_demo), 4), round(abs(w_cos_demo), 4)))  # Compare final precision.

fig_sched_demo, axes_sched_demo = plt.subplots(1, 2, figsize=(11, 4))  # Create schedule and path panels.
axes_sched_demo[0].plot(fixed_sched_demo, label="fixed")  # Plot fixed schedule.
axes_sched_demo[0].plot(step_sched_demo, label="step")  # Plot step decay.
axes_sched_demo[0].plot(exp_sched_demo, label="exponential")  # Plot exponential decay.
axes_sched_demo[0].plot(cos_sched_demo, label="cosine")  # Plot cosine decay.
axes_sched_demo[0].set_title("learning-rate schedules")  # Title schedule panel.
axes_sched_demo[0].set_xlabel("step")  # Label step axis.
axes_sched_demo[0].set_ylabel("learning rate")  # Label learning-rate axis.
axes_sched_demo[0].legend(fontsize=8)  # Identify schedules.
axes_sched_demo[1].plot(path_fixed_sched_demo, label="fixed large lr")  # Plot fixed-rate noisy path.
axes_sched_demo[1].plot(path_cos_sched_demo, label="cosine-decayed lr")  # Plot decayed path.
axes_sched_demo[1].axhline(0.0, color="black", linestyle="--", linewidth=1.0, label="minimum")  # Mark optimum.
axes_sched_demo[1].set_title("decay reduces late jitter")  # Title convergence panel.
axes_sched_demo[1].set_xlabel("step")  # Label update step.
axes_sched_demo[1].set_ylabel("parameter w")  # Label parameter axis.
axes_sched_demo[1].legend(fontsize=8)  # Identify paths.
plt.tight_layout()  # Keep panels readable.
plt.show()  # Render schedules and paths.
```
▶ What you'll see: decaying schedules start high and end low; the decayed path jitters less near zero than a permanently large learning rate.

### Step 6 — Xavier / Glorot initialization: keep activations in a healthy range

Xavier initialization chooses weight scale from fan-in and fan-out so signals do not systematically
vanish or explode across layers. We push random data through tanh layers to see how variance moves.

```python
fan_in_demo = 60  # Number of input units.
fan_out_demo = 60  # Number of output units.
limit_xavier_demo = np.sqrt(6.0 / (fan_in_demo + fan_out_demo))  # Xavier uniform half-width.
rng_xavier_demo = np.random.default_rng(0)  # Seeded generator for weights and activations.
X_xavier_demo = rng_xavier_demo.normal(size=(500, fan_in_demo))  # Standardized input activations.
limits_demo = {"too small": 0.15 * limit_xavier_demo, "Xavier": limit_xavier_demo, "too large": 3.0 * limit_xavier_demo}  # Three initialization ranges.
variances_demo = {}  # Store layer-by-layer activation variance.
for label_demo, limit_demo in limits_demo.items():  # Try each initialization scale.
    activations_demo = X_xavier_demo.copy()  # Start from the same inputs.
    variances_demo[label_demo] = [float(activations_demo.var())]  # Record input variance.
    for layer_demo in range(5):  # Propagate through several tanh layers.
        W_xavier_demo = rng_xavier_demo.uniform(-limit_demo, limit_demo, size=(activations_demo.shape[1], fan_out_demo))  # Sample one dense weight matrix.
        activations_demo = np.tanh(activations_demo @ W_xavier_demo)  # Apply tanh to expose shrinking or saturation.
        variances_demo[label_demo].append(float(activations_demo.var()))  # Record activation variance after the layer.
log("Xavier uniform limit", round(float(limit_xavier_demo), 4))  # Print the recommended sampling range.
log("variance after 5 layers", {label_demo: round(values_demo[-1], 4) for label_demo, values_demo in variances_demo.items()})  # Compare final variances.

for label_demo, values_demo in variances_demo.items():  # Plot each variance curve.
    plt.plot(range(len(values_demo)), values_demo, "o-", label=label_demo)  # Draw variance across layers.
plt.xlabel("layer index (0 = input)")  # Label input and hidden layers.
plt.ylabel("activation variance")  # Label variance metric.
plt.title("Xavier keeps tanh activation variance healthier")  # Explain the figure.
plt.legend()  # Identify initialization scales.
plt.show()  # Render variance flow.
```
▶ What you'll see: tiny weights collapse variance, huge weights distort it through tanh saturation, and Xavier stays more stable across layers.

### Step 7 — Transfer-learning tuning rule of thumb: freeze more when data is small

Transfer learning starts from pretrained features. With little data, training too many parameters
can overfit; with lots of data, fine-tuning more layers becomes safer and more useful.

```python
data_sizes_demo = np.array([80, 800, 8000])  # Small, medium, and large synthetic dataset sizes.
choices_demo = ["freeze body\ntrain head", "freeze early\ntune late+head", "fine-tune\nall layers"]  # Practical tuning choices.
trainable_params_demo = np.array([1200, 9000, 42000])  # Toy count of trainable parameters for each choice.
learning_rates_demo = np.array([0.01, 0.003, 0.0008])  # Smaller learning rates for more pretrained layers.
log("small-data rule", "freeze most layers and train only the head")  # Print first rule.
log("medium-data rule", "freeze early layers; tune later layers and head")  # Print second rule.
log("large-data rule", "fine-tune all layers carefully with a small learning rate")  # Print third rule.
log("trainable parameter counts", trainable_params_demo)  # Print parameter-count tradeoff.
log("suggested learning rates", learning_rates_demo)  # Print cautious step sizes.

fig_transfer_demo, axes_transfer_demo = plt.subplots(1, 2, figsize=(11, 4))  # Create parameter and learning-rate panels.
axes_transfer_demo[0].bar(choices_demo, trainable_params_demo, color="steelblue")  # Show how many parameters are updated.
axes_transfer_demo[0].set_ylabel("trainable parameters")  # Label parameter count.
axes_transfer_demo[0].set_title("more data can support more tuning")  # Title the count panel.
axes_transfer_demo[1].bar(choices_demo, learning_rates_demo, color="darkorange")  # Show smaller rates for deeper tuning.
axes_transfer_demo[1].set_ylabel("suggested learning rate")  # Label learning-rate scale.
axes_transfer_demo[1].set_title("fine-tuning usually uses smaller steps")  # Title learning-rate panel.
for ax_transfer_demo in axes_transfer_demo:  # Format both panels.
    ax_transfer_demo.tick_params(axis="x", rotation=15)  # Rotate long labels.
plt.tight_layout()  # Keep labels readable.
plt.show()  # Render transfer-learning rule visuals.
```
▶ What you'll see: as data size grows, the recommended strategy trains more of the pretrained model, usually with a smaller learning rate for deeper layers.

---

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

### 📖 Concept walkthrough — build each idea from scratch

Before the warm-up examples, we build the optimizer ideas from scratch, one small step at a time. Everything here uses only NumPy + Matplotlib, tiny inline arrays, and inspectable two-dimensional bowls so every update can be printed and plotted. Variables carry a `_w` suffix so they never collide with the examples below.

```python
import numpy as np  # NumPy gives us vectors, gradients, random numbers, and layer-wise matrix products.
import matplotlib.pyplot as plt  # Matplotlib lets us inspect optimizer paths, schedules, and activation variance visually.
np.random.seed(23027)  # Fix the seed so every printed value and plotted trajectory is reproducible.
```

#### 1. SGD: plain gradient steps on a quadratic bowl

Stochastic gradient descent moves parameters opposite the gradient: $w_{t+1}=w_t-\eta\nabla J(w_t)$. We use a 2-D quadratic bowl because its gradient is exact, visible, and easy to check by hand. The bowl is steeper in one coordinate, so the plot shows why a single learning rate can overshoot in sharp directions while still crawling in flat ones.

```python
A_sgd_w = np.array([[8.0, 0.0], [0.0, 1.0]])  # Store bowl curvature so coordinate 1 is much steeper than coordinate 2.
w_sgd_w = np.array([2.6, 2.0])  # Start away from the minimum so the descent path is visible.
eta_sgd_w = 0.09  # Choose a learning rate small enough to converge but large enough to show motion.
steps_sgd_w = 28  # Run a short trajectory so each update remains inspectable.
print("initial w:", w_sgd_w)  # Print the starting point before any gradient step.
print("initial gradient:", A_sgd_w @ w_sgd_w)  # Print ∇J(w)=Aw for the quadratic J=1/2 w^T A w.
```

```python
path_sgd_w = [w_sgd_w.copy()]  # Keep every parameter vector so we can draw the full trajectory.
loss_sgd_w = [0.5 * w_sgd_w @ A_sgd_w @ w_sgd_w]  # Record the starting loss for convergence inspection.
for step_sgd_w in range(steps_sgd_w):  # Repeat plain gradient descent for the requested number of steps.
    grad_sgd_w = A_sgd_w @ w_sgd_w  # Compute the exact gradient ∇J(w)=Aw at the current point.
    w_sgd_w = w_sgd_w - eta_sgd_w * grad_sgd_w  # Move opposite the gradient using the SGD update rule.
    path_sgd_w.append(w_sgd_w.copy())  # Save the new parameters after the update.
    loss_sgd_w.append(0.5 * w_sgd_w @ A_sgd_w @ w_sgd_w)  # Save the new quadratic loss.
print("first three points:\n", np.round(np.array(path_sgd_w[:3]), 3))  # Inspect the first updates numerically.
print("final w:", np.round(w_sgd_w, 4))  # Inspect how close the final point is to the minimum at zero.
```

```python
path_sgd_w = np.array(path_sgd_w)  # Convert the saved list to an array for plotting.
x1_grid_sgd_w = np.linspace(-3.0, 3.0, 160)  # Create horizontal coordinates for the contour plot.
x2_grid_sgd_w = np.linspace(-3.0, 3.0, 160)  # Create vertical coordinates for the contour plot.
X1_sgd_w, X2_sgd_w = np.meshgrid(x1_grid_sgd_w, x2_grid_sgd_w)  # Build a 2-D grid of parameter values.
Z_sgd_w = 0.5 * (8.0 * X1_sgd_w ** 2 + X2_sgd_w ** 2)  # Evaluate the quadratic loss on the grid.
plt.figure(figsize=(6.4, 5.0))  # Create a readable figure for the descent path.
plt.contour(X1_sgd_w, X2_sgd_w, Z_sgd_w, levels=24, cmap="Greys")  # Draw equal-loss contours of the bowl.
plt.plot(path_sgd_w[:, 0], path_sgd_w[:, 1], "o-", color="tab:blue", markersize=3, label="SGD path")  # Draw the SGD trajectory.
plt.scatter([0.0], [0.0], marker="*", s=160, color="black", label="minimum")  # Mark the exact minimizer.
plt.title("1: SGD descent path on a 2-D quadratic")  # Title the figure with the subsection number.
plt.xlabel("w1")  # Label the first parameter axis.
plt.ylabel("w2")  # Label the second parameter axis.
plt.axis("equal")  # Preserve geometry so zig-zags are not visually distorted.
plt.legend()  # Show which curve is the optimizer path.
plt.show()  # Render the figure in the notebook.
```

▶ What you'll see: SGD walks downhill toward the center, with larger corrections along the steep $w_1$ direction.

For $J(w)=\frac{1}{2}w^TAw$, the gradient is $\nabla J(w)=Aw$. A learning rate $\eta$ multiplies that gradient, so it controls the step length but not the local downhill direction.

*Why it's done this way: the quadratic makes the descent rule transparent while still exposing the learning-rate tradeoff that appears in real models.*

#### 2. Momentum: accumulate consistent gradients and damp zig-zags

Momentum keeps a velocity, here $v_t=\beta v_{t-1}+g_t$, then steps with $v_t$. We build it beside plain SGD on the same bowl so the difference is visible: repeated gradients in a consistent direction build velocity, while alternating gradients in an oscillating direction cancel part of the velocity. This is why momentum often accelerates through long valleys and damps left-right bouncing.

```python
A_mom_w = np.array([[14.0, 0.0], [0.0, 1.0]])  # Use a sharper bowl to make oscillation and damping easier to see.
w0_mom_w = np.array([2.4, 2.2])  # Use one shared starting point for a fair comparison.
eta_mom_w = 0.12  # Use a learning rate that makes plain SGD zig-zag in the steep coordinate.
beta_mom_w = 0.80  # Keep substantial memory of past gradients without making the demo too slow.
print("shared start:", w0_mom_w)  # Print the common starting point for both methods.
print("beta:", beta_mom_w)  # Print the momentum memory parameter.
```

```python
w_plain_mom_w = w0_mom_w.copy()  # Initialize the plain SGD parameters.
w_vel_mom_w = w0_mom_w.copy()  # Initialize the momentum parameters.
v_mom_w = np.zeros_like(w0_mom_w)  # Start velocity at zero before any gradient history exists.
path_plain_mom_w = [w_plain_mom_w.copy()]  # Store the plain SGD trajectory.
path_vel_mom_w = [w_vel_mom_w.copy()]  # Store the momentum trajectory.
for step_mom_w in range(32):  # Run both optimizers for the same number of iterations.
    grad_plain_mom_w = A_mom_w @ w_plain_mom_w  # Compute the plain SGD gradient.
    w_plain_mom_w = w_plain_mom_w - eta_mom_w * grad_plain_mom_w  # Apply one plain SGD update.
    grad_vel_mom_w = A_mom_w @ w_vel_mom_w  # Compute the gradient for the momentum path.
    v_mom_w = beta_mom_w * v_mom_w + grad_vel_mom_w  # Accumulate current and past gradients into velocity.
    w_vel_mom_w = w_vel_mom_w - eta_mom_w * v_mom_w  # Step using the accumulated velocity.
    path_plain_mom_w.append(w_plain_mom_w.copy())  # Save the plain SGD parameters.
    path_vel_mom_w.append(w_vel_mom_w.copy())  # Save the momentum parameters.
print("first momentum velocity:", np.round(A_mom_w @ w0_mom_w, 3))  # Show that the first velocity equals the first gradient.
print("final plain vs momentum:", np.round(w_plain_mom_w, 3), np.round(w_vel_mom_w, 3))  # Compare final positions.
```

```python
path_plain_mom_w = np.array(path_plain_mom_w)  # Convert the plain path to an array for plotting.
path_vel_mom_w = np.array(path_vel_mom_w)  # Convert the momentum path to an array for plotting.
x1_grid_mom_w = np.linspace(-2.8, 2.8, 180)  # Create horizontal contour coordinates.
x2_grid_mom_w = np.linspace(-2.8, 2.8, 180)  # Create vertical contour coordinates.
X1_mom_w, X2_mom_w = np.meshgrid(x1_grid_mom_w, x2_grid_mom_w)  # Build the contour grid.
Z_mom_w = 0.5 * (14.0 * X1_mom_w ** 2 + X2_mom_w ** 2)  # Evaluate the sharper quadratic bowl.
plt.figure(figsize=(6.6, 5.0))  # Create a figure for path comparison.
plt.contour(X1_mom_w, X2_mom_w, Z_mom_w, levels=26, cmap="Greys")  # Draw loss contours.
plt.plot(path_plain_mom_w[:, 0], path_plain_mom_w[:, 1], "o-", markersize=3, color="tab:blue", label="plain SGD")  # Plot the zig-zagging SGD path.
plt.plot(path_vel_mom_w[:, 0], path_vel_mom_w[:, 1], "o-", markersize=3, color="tab:orange", label="momentum")  # Plot the momentum path.
plt.scatter([0.0], [0.0], marker="*", s=160, color="black", label="minimum")  # Mark the minimizer.
plt.title("2: Momentum vs plain SGD on a narrow bowl")  # Title the figure with the subsection number.
plt.xlabel("w1")  # Label the steep coordinate.
plt.ylabel("w2")  # Label the shallow coordinate.
plt.axis("equal")  # Keep distances visually meaningful.
plt.legend()  # Show which curve is which.
plt.show()  # Render the comparison plot.
```

▶ What you'll see: plain SGD bounces across the steep direction, while momentum smooths part of that alternating motion and moves faster down the valley.

The velocity accumulates consistent gradients because terms with the same sign reinforce each other in $v_t$. When the gradient sign alternates, the old and new terms partially cancel, which damps oscillation.

*Why it's done this way: comparing both paths on the same bowl isolates momentum's memory effect from every other training choice.*

#### 3. RMSprop: scale each coordinate by recent gradient size

RMSprop tracks squared gradients, $s_t=\beta s_{t-1}+(1-\beta)g_t\odot g_t$, then updates with $g_t/(\sqrt{s_t}+\epsilon)$. We use a bowl where one coordinate has much larger gradients so the adaptive denominator has a clear job. Dividing by recent root-mean-square gradient equalizes effective step sizes across dimensions.

```python
A_rms_w = np.array([[30.0, 0.0], [0.0, 0.8]])  # Make coordinate 1 much steeper than coordinate 2.
w_rms_w = np.array([2.2, 2.2])  # Start both coordinates at the same value for a clean scale comparison.
s_rms_w = np.zeros_like(w_rms_w)  # Initialize the squared-gradient average at zero.
eta_rms_w = 0.18  # Use a base learning rate that RMSprop will adapt per coordinate.
beta_rms_w = 0.90  # Use recent gradient memory for the second moment.
epsilon_rms_w = 1e-8  # Protect division by zero in coordinates with tiny recent gradients.
print("initial gradient:", A_rms_w @ w_rms_w)  # Show the raw gradient scale mismatch.
```

```python
path_rms_w = [w_rms_w.copy()]  # Store the RMSprop path for plotting.
scale_rms_w = []  # Store effective per-coordinate denominators for inspection.
for step_rms_w in range(34):  # Run enough steps to see adaptive scaling settle.
    grad_rms_w = A_rms_w @ w_rms_w  # Compute the exact gradient at the current point.
    s_rms_w = beta_rms_w * s_rms_w + (1.0 - beta_rms_w) * grad_rms_w ** 2  # Update running mean of squared gradients.
    denom_rms_w = np.sqrt(s_rms_w) + epsilon_rms_w  # Convert squared-gradient memory into RMS scale with protection.
    w_rms_w = w_rms_w - eta_rms_w * grad_rms_w / denom_rms_w  # Apply the RMSprop adaptive update.
    path_rms_w.append(w_rms_w.copy())  # Save the new parameters.
    scale_rms_w.append(denom_rms_w.copy())  # Save the adaptive denominators.
print("first denominator:", np.round(scale_rms_w[0], 3))  # Inspect the first per-coordinate scaling factors.
print("final w:", np.round(w_rms_w, 4))  # Inspect the final parameters.
```

```python
path_rms_w = np.array(path_rms_w)  # Convert the path list to an array for plotting.
scale_rms_w = np.array(scale_rms_w)  # Convert denominator history to an array for plotting.
x1_grid_rms_w = np.linspace(-2.6, 2.6, 180)  # Create horizontal contour coordinates.
x2_grid_rms_w = np.linspace(-2.6, 2.6, 180)  # Create vertical contour coordinates.
X1_rms_w, X2_rms_w = np.meshgrid(x1_grid_rms_w, x2_grid_rms_w)  # Build the parameter grid.
Z_rms_w = 0.5 * (30.0 * X1_rms_w ** 2 + 0.8 * X2_rms_w ** 2)  # Evaluate the anisotropic quadratic.
plt.figure(figsize=(6.6, 5.0))  # Create a figure for the RMSprop path.
plt.contour(X1_rms_w, X2_rms_w, Z_rms_w, levels=26, cmap="Greys")  # Draw loss contours.
plt.plot(path_rms_w[:, 0], path_rms_w[:, 1], "o-", markersize=3, color="tab:green", label="RMSprop")  # Plot the adaptive trajectory.
plt.scatter([0.0], [0.0], marker="*", s=160, color="black", label="minimum")  # Mark the minimizer.
plt.title("3: RMSprop adaptive path")  # Title the figure with the subsection number.
plt.xlabel("w1")  # Label coordinate 1.
plt.ylabel("w2")  # Label coordinate 2.
plt.axis("equal")  # Preserve path geometry.
plt.legend()  # Label the plotted path.
plt.show()  # Render the figure.
```

▶ What you'll see: the path avoids huge jumps in the steep coordinate because that coordinate gets a larger denominator.

The square $g_t\odot g_t$ is elementwise, so each parameter gets its own recent magnitude estimate. A large $\sqrt{s_t}$ shrinks the effective step for that coordinate, while $\epsilon$ prevents division by zero.

*Why it's done this way: a deliberately uneven bowl makes the reason for per-parameter scaling impossible to miss.*

#### 4. Adam: combine momentum, RMSprop, and bias correction

Adam combines a first moment $m_t$ for direction with a second moment $s_t$ for scale. Because both moving averages start at zero, early estimates are biased too small; Adam corrects them with $\hat m_t=\frac{m_t}{1-\beta_1^t}$ and $\hat s_t=\frac{s_t}{1-\beta_2^t}$. We run Adam on the same style of bowl and compare it to the earlier optimizers.

```python
A_adam_w = np.array([[18.0, 0.0], [0.0, 1.2]])  # Define one shared bowl for all optimizer comparisons.
w0_adam_w = np.array([2.5, 2.0])  # Choose one shared starting point.
eta_adam_w = 0.12  # Use a base learning rate suitable for adaptive methods in this tiny demo.
beta1_adam_w = 0.90  # Set the first-moment decay used by Adam.
beta2_adam_w = 0.98  # Set the second-moment decay smaller than usual so the short demo visibly adapts.
epsilon_adam_w = 1e-8  # Guard every adaptive division against zero.
print("Adam start:", w0_adam_w)  # Print the common starting point.
```

```python
def run_optimizer_w(name_w, kind_w, eta_w, steps_w=36):  # Define a tiny optimizer runner for this comparison.
    w_w = w0_adam_w.copy()  # Copy the shared starting point.
    m_w = np.zeros_like(w_w)  # Initialize first-moment memory for momentum or Adam.
    s_w = np.zeros_like(w_w)  # Initialize second-moment memory for RMSprop or Adam.
    path_w = [w_w.copy()]  # Store the initial point.
    for t_w in range(1, steps_w + 1):  # Iterate with one-based t for Adam bias correction.
        g_w = A_adam_w @ w_w  # Compute the exact quadratic gradient.
        if kind_w == "sgd":  # Select the plain SGD update.
            step_w = g_w  # Use the raw gradient as the step direction.
        elif kind_w == "momentum":  # Select the momentum update.
            m_w = beta1_adam_w * m_w + g_w  # Accumulate gradients into velocity.
            step_w = m_w  # Use velocity as the step direction.
        elif kind_w == "rmsprop":  # Select the RMSprop update.
            s_w = beta2_adam_w * s_w + (1.0 - beta2_adam_w) * g_w ** 2  # Track squared gradients.
            step_w = g_w / (np.sqrt(s_w) + epsilon_adam_w)  # Scale raw gradients by recent RMS magnitude.
        else:  # Select the Adam update.
            m_w = beta1_adam_w * m_w + (1.0 - beta1_adam_w) * g_w  # Track the first moment of gradients.
            s_w = beta2_adam_w * s_w + (1.0 - beta2_adam_w) * g_w ** 2  # Track the second moment of gradients.
            m_hat_w = m_w / (1.0 - beta1_adam_w ** t_w)  # Correct first-moment bias from zero initialization.
            s_hat_w = s_w / (1.0 - beta2_adam_w ** t_w)  # Correct second-moment bias from zero initialization.
            step_w = m_hat_w / (np.sqrt(s_hat_w) + epsilon_adam_w)  # Combine corrected direction and corrected scale.
        w_w = w_w - eta_w * step_w  # Apply the selected update to the parameters.
        path_w.append(w_w.copy())  # Save the new point.
    return name_w, np.array(path_w)  # Return the label and trajectory.
```

```python
traces_adam_w = [run_optimizer_w("SGD", "sgd", 0.055), run_optimizer_w("Momentum", "momentum", 0.014), run_optimizer_w("RMSprop", "rmsprop", 0.12), run_optimizer_w("Adam", "adam", eta_adam_w)]  # Run all optimizers.
first_grad_adam_w = A_adam_w @ w0_adam_w  # Compute the initial gradient for the bias-correction printout.
first_m_raw_adam_w = (1.0 - beta1_adam_w) * first_grad_adam_w  # Compute Adam's uncorrected first moment at t=1.
first_m_hat_adam_w = first_m_raw_adam_w / (1.0 - beta1_adam_w)  # Compute Adam's corrected first moment at t=1.
print("raw first moment:", np.round(first_m_raw_adam_w, 3))  # Show how zero initialization shrinks the first estimate.
print("bias-corrected first moment:", np.round(first_m_hat_adam_w, 3))  # Show that correction restores the initial gradient scale.
```

```python
x1_grid_adam_w = np.linspace(-2.8, 2.8, 180)  # Create horizontal coordinates for contours.
x2_grid_adam_w = np.linspace(-2.8, 2.8, 180)  # Create vertical coordinates for contours.
X1_adam_w, X2_adam_w = np.meshgrid(x1_grid_adam_w, x2_grid_adam_w)  # Build a contour grid.
Z_adam_w = 0.5 * (18.0 * X1_adam_w ** 2 + 1.2 * X2_adam_w ** 2)  # Evaluate the shared loss surface.
plt.figure(figsize=(6.8, 5.2))  # Create a figure for optimizer comparison.
plt.contour(X1_adam_w, X2_adam_w, Z_adam_w, levels=28, cmap="Greys")  # Draw the shared bowl contours.
for name_trace_adam_w, path_trace_adam_w in traces_adam_w:  # Loop through each saved optimizer path.
    plt.plot(path_trace_adam_w[:, 0], path_trace_adam_w[:, 1], "o-", markersize=2.8, label=name_trace_adam_w)  # Plot each optimizer trajectory.
plt.scatter([0.0], [0.0], marker="*", s=170, color="black", label="minimum")  # Mark the exact minimum.
plt.title("4: Adam compared with SGD, momentum, and RMSprop")  # Title the figure with the subsection number.
plt.xlabel("w1")  # Label the first parameter axis.
plt.ylabel("w2")  # Label the second parameter axis.
plt.axis("equal")  # Keep optimizer paths geometrically comparable.
plt.legend()  # Identify each optimizer.
plt.show()  # Render the comparison.
```

▶ What you'll see: Adam usually takes stable adaptive steps early, while the other methods emphasize only raw gradients, velocity, or scale.

Bias correction matters early because $m_0=s_0=0$ makes the first moving averages artificially small. Dividing by $1-\beta^t$ removes that startup bias before the adaptive step is computed.

*Why it's done this way: one shared bowl shows that Adam is not a new gradient, but a combination of smoothing, scaling, and early-step correction.*

#### 5. Learning-rate schedules: large steps first, small steps later

A schedule changes $\eta$ over time rather than keeping it fixed. We plot step decay and cosine decay, then use a noisy quadratic gradient to show why decay helps: large early steps move fast, but smaller late steps reduce jitter near the minimum. The noisy gradient mimics mini-batch training where $\nabla J(w_t)$ is only estimated.

```python
T_sched_w = 60  # Choose the number of training steps for the schedule demo.
steps_sched_w = np.arange(T_sched_w)  # Create integer step indices.
eta0_sched_w = 0.16  # Set the initial learning rate.
eta_min_sched_w = 0.015  # Set the cosine schedule floor.
step_decay_sched_w = eta0_sched_w * (0.5 ** (steps_sched_w // 15))  # Drop the learning rate every 15 steps.
cosine_sched_w = eta_min_sched_w + 0.5 * (eta0_sched_w - eta_min_sched_w) * (1.0 + np.cos(np.pi * steps_sched_w / (T_sched_w - 1)))  # Smoothly anneal with cosine decay.
print("first five step-decay lrs:", np.round(step_decay_sched_w[:5], 3))  # Inspect early staircase values.
print("last five cosine lrs:", np.round(cosine_sched_w[-5:], 3))  # Inspect late cosine values near the floor.
```

```python
plt.figure(figsize=(7.0, 4.0))  # Create a figure for learning-rate curves.
plt.plot(steps_sched_w, step_decay_sched_w, label="step decay")  # Plot the staircase schedule.
plt.plot(steps_sched_w, cosine_sched_w, label="cosine decay")  # Plot the smooth cosine schedule.
plt.title("5: Learning-rate schedules")  # Title the figure with the subsection number.
plt.xlabel("step")  # Label the horizontal axis.
plt.ylabel("learning rate $\\eta_t$")  # Label the vertical axis using eta notation.
plt.legend()  # Show both schedule names.
plt.show()  # Render the schedule plot.
```

▶ What you'll see: step decay drops suddenly at milestones, while cosine decay decreases smoothly toward its floor.

```python
rng_sched_w = np.random.default_rng(23027)  # Create a seeded generator for reproducible noisy gradients.
curvature_sched_w = 6.0  # Set the scalar quadratic curvature for J(w)=1/2*c*w^2.
w_fixed_sched_w = 2.2  # Initialize the fixed-learning-rate parameter.
w_decay_sched_w = 2.2  # Initialize the decayed-learning-rate parameter from the same point.
path_fixed_sched_w = [w_fixed_sched_w]  # Store fixed-rate parameter values.
path_decay_sched_w = [w_decay_sched_w]  # Store decayed-rate parameter values.
for t_sched_w in range(T_sched_w):  # Simulate noisy mini-batch training steps.
    noise_sched_w = rng_sched_w.normal(scale=0.35)  # Draw one shared gradient-noise value for a fair comparison.
    grad_fixed_sched_w = curvature_sched_w * w_fixed_sched_w + noise_sched_w  # Estimate the fixed-rate gradient with noise.
    grad_decay_sched_w = curvature_sched_w * w_decay_sched_w + noise_sched_w  # Estimate the decayed-rate gradient with the same noise.
    w_fixed_sched_w = w_fixed_sched_w - eta0_sched_w * grad_fixed_sched_w  # Update with a fixed large learning rate.
    w_decay_sched_w = w_decay_sched_w - cosine_sched_w[t_sched_w] * grad_decay_sched_w  # Update with the decaying cosine learning rate.
    path_fixed_sched_w.append(w_fixed_sched_w)  # Save the fixed-rate parameter.
    path_decay_sched_w.append(w_decay_sched_w)  # Save the decayed-rate parameter.
print("final absolute w, fixed vs decayed:", round(abs(w_fixed_sched_w), 4), round(abs(w_decay_sched_w), 4))  # Compare final precision near zero.
```

```python
plt.figure(figsize=(7.0, 4.2))  # Create a figure for convergence paths.
plt.plot(path_fixed_sched_w, label="fixed large $\\eta$")  # Plot the fixed-rate noisy trajectory.
plt.plot(path_decay_sched_w, label="cosine-decayed $\\eta_t$")  # Plot the decayed-rate noisy trajectory.
plt.axhline(0.0, color="black", linewidth=1.0, linestyle="--", label="minimum")  # Mark the true minimizer.
plt.title("5: Decayed LR settles more precisely than fixed large LR")  # Title the figure with the subsection number.
plt.xlabel("step")  # Label the training step axis.
plt.ylabel("parameter w")  # Label the scalar parameter axis.
plt.legend()  # Identify both trajectories.
plt.show()  # Render the convergence comparison.
```

▶ What you'll see: both methods move toward zero, but the fixed large learning rate keeps bouncing more because gradient noise is multiplied by a large constant.

The learning rate controls both signal and noise in the update. Decay preserves fast early motion while reducing late-stage noise amplification.

*Why it's done this way: noisy one-dimensional training makes the practical reason for schedules visible without hiding it inside a large neural network.*

#### 6. Xavier initialization and the transfer-learning tuning rule

Xavier/Glorot initialization chooses a scale from layer widths, with standard-deviation-style scale $\sqrt{\frac{2}{\text{fan\_in}+\text{fan\_out}}}$ and uniform limit $\sqrt{\frac{6}{\text{fan\_in}+\text{fan\_out}}}$. We test it by pushing random activations through several tanh layers and measuring variance. Too-small weights shrink signals, too-large weights saturate them, while transfer learning usually freezes early general features and fine-tunes later task-specific layers with a small learning rate.

```python
fan_in_xav_w = 80  # Set the incoming layer width.
fan_out_xav_w = 80  # Set the outgoing layer width.
scale_xav_w = np.sqrt(2.0 / (fan_in_xav_w + fan_out_xav_w))  # Compute the Xavier standard-deviation-style scale.
limit_xav_w = np.sqrt(6.0 / (fan_in_xav_w + fan_out_xav_w))  # Compute the equivalent Xavier uniform sampling limit.
print("Xavier scale sqrt(2/(fan_in+fan_out)):", round(scale_xav_w, 4))  # Print the scale used for variance reasoning.
print("Xavier uniform limit sqrt(6/(fan_in+fan_out)):", round(limit_xav_w, 4))  # Print the uniform range endpoint.
```

```python
rng_xav_w = np.random.default_rng(23027)  # Create a seeded generator for reproducible weights and activations.
X_xav_w = rng_xav_w.normal(size=(600, fan_in_xav_w))  # Create a batch of standardized input activations.
scales_xav_w = {"too small": 0.15 * limit_xav_w, "Xavier": limit_xav_w, "too large": 3.0 * limit_xav_w}  # Define three initialization ranges.
variances_xav_w = {}  # Prepare a dictionary for layer-by-layer activation variances.
for label_xav_w, limit_current_xav_w in scales_xav_w.items():  # Try each initialization scale.
    activations_xav_w = X_xav_w.copy()  # Start each trial from the same input activations.
    variances_xav_w[label_xav_w] = [activations_xav_w.var()]  # Record the input variance before hidden layers.
    for layer_xav_w in range(5):  # Pass through a few hidden layers to see variance drift.
        W_xav_w = rng_xav_w.uniform(-limit_current_xav_w, limit_current_xav_w, size=(activations_xav_w.shape[1], fan_out_xav_w))  # Sample one dense weight matrix.
        activations_xav_w = np.tanh(activations_xav_w @ W_xav_w)  # Apply a tanh layer to expose shrinking or saturation.
        variances_xav_w[label_xav_w].append(activations_xav_w.var())  # Record the activation variance after the layer.
print("variance after 5 layers:", {key_xav_w: round(value_xav_w[-1], 4) for key_xav_w, value_xav_w in variances_xav_w.items()})  # Inspect final variance by scale.
```

```python
plt.figure(figsize=(7.0, 4.2))  # Create a figure for activation variance flow.
for label_xav_w, values_xav_w in variances_xav_w.items():  # Plot each initialization scale.
    plt.plot(range(len(values_xav_w)), values_xav_w, "o-", label=label_xav_w)  # Draw variance across input and hidden layers.
plt.title("6: Xavier initialization keeps activation variance stable")  # Title the figure with the subsection number.
plt.xlabel("layer index")  # Label layer 0 as input and later layers as hidden activations.
plt.ylabel("activation variance")  # Label the measured quantity.
plt.legend()  # Identify each initialization scale.
plt.show()  # Render the variance plot.
```

▶ What you'll see: too-small initialization collapses variance, too-large initialization distorts it through tanh saturation, and Xavier stays more stable.

```python
transfer_rule_xav_w = "freeze early reusable layers; fine-tune late task-specific layers with a small learning rate"  # State the practical transfer-learning tuning rule.
print("Transfer-learning rule:", transfer_rule_xav_w)  # Print the rule so it is visible in notebook output.
```

The scale balances fan-in and fan-out so forward activations and backward gradients do not systematically grow or vanish. In transfer learning, early layers often encode general features, so freezing them reduces overfitting and compute while a small $\eta$ safely adapts later layers.

*Why it's done this way: measuring activation variance makes initialization concrete, and the transfer rule connects optimizer tuning to pretrained model practice.*

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
