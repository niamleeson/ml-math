# Support Vector Machines
> **Source:** CS 229 · **Category:** Model · **Type:** ⚖️ Both · [↑ Full reference](../../ai-ml-cheatsheets.md)
> 📓 The coded examples form a runnable notebook section; an `.ipynb` will be generated. [![Open In Colab](https://colab.research.google.com/assets/colab-badge.svg)](#)

## 0. Step-by-Step Worked Example — Start Here (Beginner Friendly)

> 🧑‍🎓 **New to this topic? Start here.** This is a gentle, fully runnable walkthrough that
> builds up *every* idea in this lesson one tiny step at a time. Each step **prints** the
> numbers it computes and **draws a picture** so you can *see* what is happening. Run the
> cells in order from top to bottom. Nothing here needs the internet or any downloaded data.

### The Big Picture — What You'll Learn

In plain terms, here is what the steps below will show you:

- The **linear decision rule** classifies by the sign of $w^Tx-b$.
- The **functional margin** checks correctness in score units, while the **geometric margin** converts that score into distance.
- The **hard-margin objective** minimizes $\frac12\|w\|^2$ to maximize width.
- **Soft margins** use hinge loss and $C$ to handle violations.
- The **RBF kernel** turns distance into local similarity, and **support vectors** are the sparse nonzero-$\alpha$ points defining the boundary.

Everything below (starting at **§1 Overview**) develops these same ideas with full derivations,
more examples, and an interactive experiment.

**What we will build, step by step:**
1. **Linear decision rule and sign convention** — classify by the sign of $w^Tx-b$.
2. **Functional margin** — measure correctness with $y(w^Tx-b)$.
3. **Geometric margin and margin width** — turn scores into distances by dividing by $\|w\|$.
4. **Hard-margin SVM optimization** — see why maximizing the margin means minimizing $\frac12\|w\|^2$.
5. **Soft margins, slack, hinge loss, and $C$** — allow violations and charge them with hinge loss.
6. **Kernels and the RBF kernel** — convert distance into similarity for nonlinear boundaries.
7. **Lagrange multipliers and support-vector sparsity** — see why only margin points define the separator.

### Step 0 — Set up our tools

We import NumPy (vectors, dot products, norms) and Matplotlib (boundary and loss pictures). We
fix a random **seed** so every run is reproducible, and define a tiny `log()` helper so printed
quantities are easy to read.

```python
import numpy as np                       # NumPy: arrays, dot products, norms, exponentials, and grids.
import matplotlib.pyplot as plt          # Matplotlib: draw SVM boundaries, margins, losses, and kernels.

np.random.seed(0)                         # Fix the seed so every run prints the SAME numbers.
plt.rcParams["figure.figsize"] = (7, 4)   # A comfortable default plot size.

def log(label, value):                    # A tiny logger so each printed line explains itself.
    print(f"[{label}] {value}")           # Format is: [what this is] the value.

log("setup", "tools ready — NumPy + Matplotlib imported, seed fixed to 0")
```
▶ What you'll see: one line confirming the tools are ready.

### Step 1 — Linear decision rule and sign convention

An SVM starts with one signed score: $w^Tx-b$. Positive scores predict class $+1$, negative
scores predict class $-1$, and the boundary is the set of points where the score is exactly
zero.

```python
X_rule_demo = np.array([[-2.0, -1.0], [-1.0, -2.0], [-1.0, -1.0], [1.0, 1.0], [2.0, 1.0], [1.0, 2.0]])  # Six separable 2-D points.
y_rule_demo = np.array([-1, -1, -1, 1, 1, 1])                     # Labels use the SVM convention {-1, +1}.
w_rule_demo = np.array([0.5, 0.5])                                # A normal vector perpendicular to the boundary.
b_rule_demo = 0.0                                                  # The lesson's offset in w^T x - b.
scores_rule_demo = X_rule_demo @ w_rule_demo - b_rule_demo        # Compute each signed SVM score.
pred_rule_demo = np.where(scores_rule_demo >= 0.0, 1, -1)         # Convert score signs into predicted labels.

log("w", w_rule_demo)                                             # Show the separating direction.
log("b", b_rule_demo)                                             # Show the boundary offset.
log("scores w^T x - b", np.round(scores_rule_demo, 3))            # Show raw signed scores.
log("predicted signs", pred_rule_demo)                            # Show the sign-based predictions.
log("all predictions correct?", bool(np.all(pred_rule_demo == y_rule_demo)))  # Verify the sign rule.

x_grid_rule_demo = np.linspace(-3.0, 3.0, 200)                    # Create x-values for drawing the boundary.
y_boundary_rule_demo = (b_rule_demo - w_rule_demo[0] * x_grid_rule_demo) / w_rule_demo[1]  # Solve w1*x+w2*y-b=0.
plt.scatter(X_rule_demo[y_rule_demo == -1, 0], X_rule_demo[y_rule_demo == -1, 1], c="tab:blue", edgecolor="k", s=75, label="class -1")  # Draw negative points.
plt.scatter(X_rule_demo[y_rule_demo == 1, 0], X_rule_demo[y_rule_demo == 1, 1], c="tab:orange", edgecolor="k", s=75, label="class +1")  # Draw positive points.
plt.plot(x_grid_rule_demo, y_boundary_rule_demo, color="black", lw=2, label=r"$w^Tx-b=0$")  # Draw the zero-score boundary.
plt.xlim(-3, 3)                                                    # Keep the horizontal range focused.
plt.ylim(-3, 3)                                                    # Keep the vertical range focused.
plt.xlabel("feature 1")                                           # Label the first coordinate.
plt.ylabel("feature 2")                                           # Label the second coordinate.
plt.title("SVM decision rule: classify by the sign of the score") # Add a teaching title.
plt.legend()                                                      # Show class and boundary labels.
plt.show()                                                        # Render the plot.
```
▶ What you'll see: a straight boundary where one side has negative scores and the other side has positive scores.

### Step 2 — Functional margin: correctness in score units

The functional margin for one labeled point is $y(w^Tx-b)$. It is positive when the point is
classified correctly, but it changes if we multiply both $w$ and $b$ by the same positive
constant.

```python
functional_demo = y_rule_demo * scores_rule_demo                         # Compute y(w^T x-b) for each point.
scale_demo = 3.0                                                          # Choose a positive rescaling that leaves the boundary unchanged.
w_scaled_demo = scale_demo * w_rule_demo                                  # Scale the normal vector.
b_scaled_demo = scale_demo * b_rule_demo                                  # Scale the offset by the same amount.
scores_scaled_demo = X_rule_demo @ w_scaled_demo - b_scaled_demo          # Recompute scores after rescaling.
functional_scaled_demo = y_rule_demo * scores_scaled_demo                 # Recompute functional margins after rescaling.

log("functional margins", np.round(functional_demo, 3))                  # Show original scale-dependent margins.
log("scaled functional margins", np.round(functional_scaled_demo, 3))     # Show margins multiplied by the scale.
log("same predicted signs?", bool(np.all(np.sign(scores_rule_demo) == np.sign(scores_scaled_demo))))  # Check boundary signs.

positions_demo = np.arange(len(functional_demo))                          # Create bar positions for each data point.
plt.bar(positions_demo - 0.18, functional_demo, width=0.36, label="original", color="tab:blue")  # Plot original margins.
plt.bar(positions_demo + 0.18, functional_scaled_demo, width=0.36, label="scaled by 3", color="tab:orange")  # Plot scaled margins.
plt.axhline(1.0, color="black", linestyle="--", label="canonical target 1")  # Mark the SVM canonical margin level.
plt.xlabel("training point index")                                         # Label point index axis.
plt.ylabel(r"functional margin $y(w^Tx-b)$")                               # Label the margin axis.
plt.title("Functional margins depend on the scale of w and b")             # Add a teaching title.
plt.legend()                                                               # Show margin-bar labels.
plt.show()                                                                 # Render the plot.
```
▶ What you'll see: scaling $w,b$ multiplies the functional margins even though the predicted signs stay the same.

### Step 3 — Geometric margin and margin width

To get an actual distance to the boundary, divide the functional margin by $\|w\|$. Under
canonical scaling, the closest points have margin $1/\|w\|$, and the full margin strip has
width $2/\|w\|$.

```python
norm_rule_demo = np.linalg.norm(w_rule_demo)                              # Compute ||w|| for converting scores to distances.
geometric_demo = functional_demo / norm_rule_demo                         # Convert functional margins into geometric distances.
min_geometric_demo = np.min(geometric_demo)                               # Find the closest correct-side distance.
width_demo = 2.0 / norm_rule_demo                                         # Compute the distance between f=+1 and f=-1 lines.

log("||w||", round(float(norm_rule_demo), 4))                              # Show the separator norm.
log("geometric margins", np.round(geometric_demo, 3))                      # Show true point-to-boundary distances.
log("minimum geometric margin", round(float(min_geometric_demo), 4))       # Show the closest distance.
log("margin width 2/||w||", round(float(width_demo), 4))                   # Show the full strip width.

y_plus_demo = (b_rule_demo + 1.0 - w_rule_demo[0] * x_grid_rule_demo) / w_rule_demo[1]   # Solve w^T x-b=+1.
y_minus_demo = (b_rule_demo - 1.0 - w_rule_demo[0] * x_grid_rule_demo) / w_rule_demo[1]  # Solve w^T x-b=-1.
plt.scatter(X_rule_demo[y_rule_demo == -1, 0], X_rule_demo[y_rule_demo == -1, 1], c="tab:blue", edgecolor="k", s=75, label="class -1")  # Draw negative points.
plt.scatter(X_rule_demo[y_rule_demo == 1, 0], X_rule_demo[y_rule_demo == 1, 1], c="tab:orange", edgecolor="k", s=75, label="class +1")  # Draw positive points.
plt.plot(x_grid_rule_demo, y_boundary_rule_demo, color="black", lw=2, label="boundary")  # Draw the decision boundary.
plt.plot(x_grid_rule_demo, y_plus_demo, color="black", linestyle="--", label="margins")  # Draw the positive margin line.
plt.plot(x_grid_rule_demo, y_minus_demo, color="black", linestyle="--")      # Draw the negative margin line.
plt.annotate(f"width = {width_demo:.2f}", xy=(0.2, 1.8), xytext=(1.0, 2.5), arrowprops={"arrowstyle": "->"})  # Annotate the strip width.
plt.xlim(-3, 3)                                                             # Keep the horizontal range focused.
plt.ylim(-3, 3)                                                             # Keep the vertical range focused.
plt.xlabel("feature 1")                                                     # Label the first coordinate.
plt.ylabel("feature 2")                                                     # Label the second coordinate.
plt.title("Geometric margin turns scores into distances")                   # Add a teaching title.
plt.legend()                                                                # Show boundary and margin labels.
plt.show()                                                                  # Render the plot.
```
▶ What you'll see: two dashed margin lines around the boundary, with the closest points touching those lines.

### Step 4 — Hard-margin SVM optimization

For separable data, a hard-margin SVM asks for $y_i(w^Tx_i-b)\ge1$ for every point, then chooses
the feasible separator with the smallest $\frac12\|w\|^2$. On the same boundary direction,
over-scaling is feasible but wastes margin width and increases the objective.

```python
scale_values_demo = np.array([0.6, 1.0, 1.5, 2.0, 3.0])                   # Try several scalings of the same boundary.
min_constraints_demo = []                                                  # Store min_i y_i f_i for each scale.
objectives_demo = []                                                        # Store 1/2||w||^2 for each scale.
widths_demo = []                                                            # Store 2/||w|| for each scale.

for scale_value_demo in scale_values_demo:                                  # Loop over candidate scalings.
    w_candidate_demo = scale_value_demo * w_rule_demo                       # Scale w without rotating the boundary.
    b_candidate_demo = scale_value_demo * b_rule_demo                       # Scale b consistently.
    score_candidate_demo = X_rule_demo @ w_candidate_demo - b_candidate_demo  # Compute candidate scores.
    min_constraints_demo.append(np.min(y_rule_demo * score_candidate_demo)) # Record the tightest constraint.
    objectives_demo.append(0.5 * np.sum(w_candidate_demo ** 2))             # Record the hard-margin objective.
    widths_demo.append(2.0 / np.linalg.norm(w_candidate_demo))              # Record canonical margin-strip width.

min_constraints_demo = np.array(min_constraints_demo)                       # Convert constraints to an array.
objectives_demo = np.array(objectives_demo)                                 # Convert objectives to an array.
widths_demo = np.array(widths_demo)                                         # Convert widths to an array.
feasible_demo = min_constraints_demo >= 1.0                                 # Mark which scalings satisfy all constraints.

log("scale values", scale_values_demo)                                      # Show candidate scalings.
log("minimum constraints", np.round(min_constraints_demo, 3))               # Show feasibility numbers.
log("feasible?", feasible_demo)                                             # Show which scalings satisfy y_i f_i >= 1.
log("objectives 1/2||w||^2", np.round(objectives_demo, 3))                  # Show the norm penalty being minimized.
log("margin widths", np.round(widths_demo, 3))                              # Show how width changes with norm.

plt.subplot(1, 2, 1)                                                        # Left panel: hard-margin objective.
plt.plot(scale_values_demo, objectives_demo, marker="o", color="crimson")   # Draw objective versus scale.
plt.axvline(1.0, color="black", linestyle="--", label="smallest feasible scale")  # Mark the canonical feasible scale.
plt.xlabel("scale applied to w,b")                                          # Label the scale axis.
plt.ylabel(r"$\frac{1}{2}\|w\|^2$")                                         # Label the objective axis.
plt.title("Objective grows with scale")                                     # Title the objective panel.
plt.legend()                                                                # Show the canonical-scale label.
plt.subplot(1, 2, 2)                                                        # Right panel: margin width.
plt.plot(scale_values_demo, widths_demo, marker="s", color="tab:blue")      # Draw width versus scale.
plt.axvline(1.0, color="black", linestyle="--")                             # Mark the smallest feasible scale again.
plt.xlabel("scale applied to w,b")                                          # Label the scale axis.
plt.ylabel(r"width $2/\|w\|$")                                              # Label the margin-width axis.
plt.title("Width shrinks as ||w|| grows")                                   # Title the width panel.
plt.tight_layout()                                                          # Keep the two panels readable.
plt.show()                                                                  # Render both panels.
```
▶ What you'll see: the first feasible scale is the one with the smallest objective and the widest canonical margin strip.

### Step 5 — Soft margins, slack, hinge loss, and $C$

Real data can overlap, so soft-margin SVMs allow violations. The smallest slack for a point is
the hinge loss $\max(0,1-yf(x))$, and $C$ tells the model how expensive those violations are.

```python
X_soft_demo = np.array([[-2.0, -1.0], [-1.0, -2.0], [-0.2, 0.8], [0.3, -0.4], [1.0, 1.2], [2.0, 1.0]])  # Mostly separable points with two awkward cases.
y_soft_demo = np.array([-1, -1, -1, 1, 1, 1])                         # SVM labels for the soft-margin example.
w_soft_demo = np.array([0.7, 0.6])                                     # A plausible separator direction.
b_soft_demo = 0.05                                                     # A small offset in w^T x - b.
scores_soft_demo = X_soft_demo @ w_soft_demo - b_soft_demo             # Compute raw SVM scores.
signed_soft_demo = y_soft_demo * scores_soft_demo                      # Compute signed margins y f(x).
hinge_soft_demo = np.maximum(0.0, 1.0 - signed_soft_demo)              # Compute hinge loss, which equals minimum slack.
status_soft_demo = np.where(signed_soft_demo >= 1.0, "safe", np.where(signed_soft_demo > 0.0, "inside margin", "misclassified"))  # Label violation types.
C_values_demo = np.array([0.1, 1.0, 10.0])                             # Try weak, medium, and strong violation penalties.
regularizer_demo = 0.5 * np.sum(w_soft_demo ** 2)                      # Compute the 1/2||w||^2 part of the objective.
objectives_soft_demo = regularizer_demo + C_values_demo * np.sum(hinge_soft_demo)  # Compute soft-margin objectives.

log("signed margins y f(x)", np.round(signed_soft_demo, 3))            # Show correctness plus margin clearance.
log("hinge/slack values", np.round(hinge_soft_demo, 3))                # Show violation sizes.
log("statuses", status_soft_demo)                                      # Show each point's category.
log("regularizer", round(float(regularizer_demo), 3))                  # Show margin-size cost.
log("objectives for C=0.1,1,10", np.round(objectives_soft_demo, 3))    # Show how C changes violation cost.

margin_grid_demo = np.linspace(-1.5, 2.5, 200)                         # Create possible signed-margin values.
hinge_grid_demo = np.maximum(0.0, 1.0 - margin_grid_demo)              # Evaluate hinge loss on the grid.
plt.plot(margin_grid_demo, hinge_grid_demo, color="crimson", lw=2, label=r"$\max(0,1-yf)$")  # Draw the hinge-loss curve.
plt.scatter(signed_soft_demo, hinge_soft_demo, color="black", s=60, zorder=3, label="toy points")  # Place examples on the loss curve.
plt.axvline(1.0, color="gray", linestyle="--", label="margin satisfied")  # Mark the zero-loss threshold.
plt.axvline(0.0, color="gray", linestyle=":", label="decision boundary")  # Mark the sign-change threshold.
plt.xlabel(r"signed margin $y f(x)$")                                  # Label the signed-margin axis.
plt.ylabel("hinge loss / slack")                                       # Label the loss axis.
plt.title("Soft margin: hinge loss charges violations")                # Add a teaching title.
plt.legend()                                                           # Show curve and threshold meanings.
plt.show()                                                             # Render the plot.
```
▶ What you'll see: safe points have zero loss, inside-margin points have fractional loss, and larger $C$ makes the same violations cost more.

### Step 6 — Kernels and the RBF kernel

A kernel computes an inner product in a feature space without explicitly building that feature
map. The RBF kernel $K(x,z)=\exp(-\gamma\|x-z\|^2)$ acts like local similarity: nearby points
are close to 1, and faraway points are close to 0.

```python
anchor_demo = np.array([0.0, 0.0])                                      # Choose one reference point z.
query_points_demo = np.array([[0.0, 0.0], [0.5, 0.0], [1.0, 0.0], [2.0, 0.0], [3.0, 0.0]])  # Points at growing distances.
gamma_demo = 0.8                                                        # Choose one RBF sharpness value.
dist2_demo = np.sum((query_points_demo - anchor_demo) ** 2, axis=1)     # Compute squared distances ||x-z||^2.
rbf_demo = np.exp(-gamma_demo * dist2_demo)                             # Compute exp(-gamma ||x-z||^2).
sigma_demo = 1.0 / np.sqrt(2.0 * gamma_demo)                            # Convert gamma to sigma using gamma=1/(2 sigma^2).

log("squared distances", np.round(dist2_demo, 3))                       # Show distance inputs to the kernel.
log("RBF similarities", np.round(rbf_demo, 3))                          # Show kernel outputs between 0 and 1.
log("equivalent sigma", round(float(sigma_demo), 3))                    # Show the sigma interpretation.

distance_grid_demo = np.linspace(0.0, 3.0, 200)                         # Create distances for smooth decay curves.
gamma_smooth_demo = 0.2                                                 # Small gamma means broad similarity.
gamma_local_demo = 1.2                                                  # Large gamma means local similarity.
rbf_smooth_demo = np.exp(-gamma_smooth_demo * distance_grid_demo ** 2)  # Compute the broad RBF curve.
rbf_local_demo = np.exp(-gamma_local_demo * distance_grid_demo ** 2)    # Compute the local RBF curve.
xx_kernel_demo, yy_kernel_demo = np.meshgrid(np.linspace(-2.0, 2.0, 120), np.linspace(-2.0, 2.0, 120))  # Build a 2-D grid.
grid_kernel_demo = np.column_stack([xx_kernel_demo.ravel(), yy_kernel_demo.ravel()])  # Flatten grid coordinates.
heat_kernel_demo = np.exp(-gamma_demo * np.sum((grid_kernel_demo - anchor_demo) ** 2, axis=1)).reshape(xx_kernel_demo.shape)  # RBF similarity heatmap.

plt.subplot(1, 2, 1)                                                    # Left panel: one-dimensional decay.
plt.plot(distance_grid_demo, rbf_smooth_demo, label=r"$\gamma=0.2$", lw=2)  # Draw the smooth kernel.
plt.plot(distance_grid_demo, rbf_local_demo, label=r"$\gamma=1.2$", lw=2)   # Draw the local kernel.
plt.xlabel(r"distance $\|x-z\|$")                                       # Label distance axis.
plt.ylabel("RBF similarity")                                            # Label similarity axis.
plt.title("RBF decay")                                                  # Title the decay panel.
plt.legend()                                                            # Show gamma labels.
plt.subplot(1, 2, 2)                                                    # Right panel: 2-D similarity bump.
plt.contourf(xx_kernel_demo, yy_kernel_demo, heat_kernel_demo, levels=20, cmap="viridis")  # Draw similarity around the anchor.
plt.scatter([anchor_demo[0]], [anchor_demo[1]], color="red", edgecolor="k", s=70, label="anchor")  # Mark the anchor point.
plt.xlabel("feature 1")                                                 # Label first feature.
plt.ylabel("feature 2")                                                 # Label second feature.
plt.title("RBF similarity around one point")                            # Title the heatmap panel.
plt.legend()                                                            # Show the anchor label.
plt.tight_layout()                                                      # Keep panels readable.
plt.show()                                                              # Render both kernel views.
```
▶ What you'll see: larger $\gamma$ decays faster, and the heatmap shows a local similarity bump around the anchor.

### Step 7 — Lagrange multipliers and support-vector sparsity

In the dual view, $w=\sum_i \alpha_i y_i x_i$. Complementary slackness says non-support points
outside the margin must have $\alpha_i=0$, so only points on the margin need nonzero
multipliers.

```python
margin_sv_demo = y_rule_demo * (X_rule_demo @ w_rule_demo - b_rule_demo)   # Recompute canonical margin values.
support_mask_demo = np.isclose(margin_sv_demo, 1.0)                         # Identify points exactly on the margin.
alpha_demo = np.zeros(len(X_rule_demo))                                     # Start with zero dual weight for every point.
alpha_demo[support_mask_demo] = 0.25                                        # Give nonzero alpha only to the two margin points.
w_from_alpha_demo = np.sum((alpha_demo * y_rule_demo)[:, None] * X_rule_demo, axis=0)  # Rebuild w from support vectors.
kkt_demo = alpha_demo * (margin_sv_demo - 1.0)                              # Compute alpha_i(y_i f_i - 1) for KKT slackness.

log("margin values", np.round(margin_sv_demo, 3))                           # Show which points are on the margin.
log("support-vector mask", support_mask_demo)                               # Show which points become support vectors.
log("alpha values", alpha_demo)                                             # Show sparsity in the dual weights.
log("w rebuilt from alpha", np.round(w_from_alpha_demo, 3))                 # Verify the support vectors reconstruct w.
log("KKT products", np.round(kkt_demo, 10))                                 # Verify complementary slackness products are zero.

plt.scatter(X_rule_demo[y_rule_demo == -1, 0], X_rule_demo[y_rule_demo == -1, 1], c="tab:blue", edgecolor="k", s=75, label="class -1")  # Draw negative points.
plt.scatter(X_rule_demo[y_rule_demo == 1, 0], X_rule_demo[y_rule_demo == 1, 1], c="tab:orange", edgecolor="k", s=75, label="class +1")  # Draw positive points.
plt.scatter(X_rule_demo[support_mask_demo, 0], X_rule_demo[support_mask_demo, 1], s=230, facecolors="none", edgecolors="red", linewidths=2.4, label="support vectors")  # Circle support vectors.
plt.plot(x_grid_rule_demo, y_boundary_rule_demo, color="black", lw=2, label="boundary")  # Draw the decision boundary.
plt.plot(x_grid_rule_demo, y_plus_demo, color="black", linestyle="--", label="margins")  # Draw the positive margin.
plt.plot(x_grid_rule_demo, y_minus_demo, color="black", linestyle="--")       # Draw the negative margin.
plt.xlim(-3, 3)                                                              # Keep the horizontal range focused.
plt.ylim(-3, 3)                                                              # Keep the vertical range focused.
plt.xlabel("feature 1")                                                      # Label the first coordinate.
plt.ylabel("feature 2")                                                      # Label the second coordinate.
plt.title("Support vectors are the nonzero-alpha margin points")             # Add a teaching title.
plt.legend()                                                                 # Show class and support-vector labels.
plt.show()                                                                   # Render the plot.
```
▶ What you'll see: only the circled margin points have nonzero $\alpha$, and they alone rebuild the separator.

---

## 1. Overview

Support Vector Machines (SVMs) build classifiers by finding a decision boundary that separates classes with the widest possible margin. Instead of treating all training points equally, the fitted boundary is determined by a small set of critical points closest to the boundary: the **support vectors**.

**One-line intuition:** an SVM chooses the safest separator—the one with the largest buffer zone—then uses soft margins and kernels when the data are noisy or nonlinear.

SVMs are most useful when:

- the number of features is moderate to large;
- geometric separation matters more than calibrated probabilities;
- we want a sparse boundary described by support vectors;
- nonlinear structure can be captured through a kernel such as the Gaussian/RBF kernel.

---

## 2. Key Idea

### 2.1 Linear decision rule and sign convention

The reference classifier is

$$
h(x)=\operatorname{sign}(w^Tx-b),
$$

where $w\in\mathbb{R}^d$ is perpendicular to the separating hyperplane and $b\in\mathbb{R}$ shifts the hyperplane. The decision boundary is

$$
w^Tx-b=0.
$$

A point is classified as positive when $w^Tx-b>0$ and negative when $w^Tx-b<0$.

> Implementation note: scikit-learn writes the score as `coef_ @ x + intercept_`. In this lesson's formulas, that equals $w^Tx-b$, so `intercept_ = -b`.

### 2.2 Functional margin

For a labeled point $(x^{(i)},y^{(i)})$ with $y^{(i)}\in\{-1,+1\}$, define the score

$$
z^{(i)}=w^Tx^{(i)}-b.
$$

The **functional margin** is

$$
\hat\gamma^{(i)}=y^{(i)}(w^Tx^{(i)}-b).
$$

Why this works:

- if $y^{(i)}=+1$ and $w^Tx^{(i)}-b>0$, then $\hat\gamma^{(i)}>0$;
- if $y^{(i)}=-1$ and $w^Tx^{(i)}-b<0$, then $\hat\gamma^{(i)}>0$;
- a larger positive value means the point is classified correctly with more confidence under this scaling.

However, the functional margin is not scale-invariant: replacing $(w,b)$ by $(cw,cb)$ multiplies all functional margins by $c>0$ without changing the boundary. SVMs fix this by choosing the canonical scaling where the closest points satisfy

$$
y^{(i)}(w^Tx^{(i)}-b)=1.
$$

### 2.3 Geometric margin and margin width

The signed distance from a point $x$ to the hyperplane $w^Tx-b=0$ is

$$
\frac{w^Tx-b}{\|w\|}.
$$

Therefore the distance of labeled point $(x^{(i)},y^{(i)})$ to the correct side of the boundary is

$$
\gamma^{(i)}=\frac{y^{(i)}(w^Tx^{(i)}-b)}{\|w\|}.
$$

Under the canonical constraints $y^{(i)}(w^Tx^{(i)}-b)\ge 1$, the closest points have geometric margin

$$
\gamma_{\min}=\frac{1}{\|w\|}.
$$

The two margin lines are

$$
w^Tx-b=1
\quad\text{and}\quad
w^Tx-b=-1.
$$

Their distance apart is

$$
\frac{|1-(-1)|}{\|w\|}=\frac{2}{\|w\|}.
$$

So maximizing the margin width is the same as minimizing $\|w\|$, or equivalently minimizing $\frac12\|w\|^2$.

### 2.4 Hard-margin SVM optimization

For linearly separable data, the **optimal margin classifier** solves

$$
\min \frac{1}{2}\|w\|^2\quad\text{such that}\quad y^{(i)}(w^Tx^{(i)}-b)\geq 1.
$$

Derivation of the objective:

$$
\text{maximize margin width}
=\max \frac{2}{\|w\|}
$$

is equivalent to

$$
\min \|w\|
$$

because $2/t$ decreases as $t>0$ increases. Since $\|w\|\ge 0$, this is also equivalent to

$$
\min \frac12\|w\|^2,
$$

which is smooth and convex.

### 2.5 Soft margins, slack, hinge loss, and $C$

Real data may overlap. A soft-margin SVM allows some margin violations through slack variables $\xi_i\ge0$:

$$
\min_{w,b,\xi}\frac12\|w\|^2+C\sum_{i=1}^m\xi_i
\quad\text{such that}\quad
 y^{(i)}(w^Tx^{(i)}-b)\ge 1-\xi_i,
\quad
\xi_i\ge0.
$$

The parameter $C>0$ controls the tradeoff:

- large $C$: violations are expensive, so the model tries harder to classify training points correctly;
- small $C$: violations are cheaper, so the model prefers a wider, smoother margin.

The hinge loss is

$$
L(z,y)=[1-yz]_+=\max(0,1-yz),
$$

where $z=w^Tx-b$. For one point:

- if $yz\ge1$, the point is correctly classified outside the margin and loss is $0$;
- if $0<yz<1$, the point is correctly classified but inside the margin and loss is $1-yz$;
- if $yz\le0$, the point is misclassified and loss is at least $1$.

Thus soft-margin SVM training can be read as

$$
\min_{w,b}\frac12\|w\|^2+C\sum_{i=1}^m \max\left(0,1-y^{(i)}(w^Tx^{(i)}-b)\right).
$$

### 2.6 Kernels and the RBF kernel

A nonlinear SVM maps data through a feature map $\phi$ and learns a linear separator there. A kernel computes inner products in that feature space without explicitly constructing $\phi$:

$$
K(x,z)=\phi(x)^T\phi(z).
$$

The Gaussian/RBF kernel is

$$
K(x,z)=\exp\left(-\frac{\|x-z\|^2}{2\sigma^2}\right).
$$

If $x$ and $z$ are close, then $\|x-z\|^2$ is small and $K(x,z)\approx1$. If they are far apart, $K(x,z)\approx0$. In scikit-learn, the RBF kernel is parameterized as

$$
K(x,z)=\exp(-\gamma\|x-z\|^2),
$$

so

$$
\gamma=\frac{1}{2\sigma^2}.
$$

Small $\gamma$ means large $\sigma$ and a smoother boundary; large $\gamma$ means small $\sigma$ and a more local, wiggly boundary.

### 2.7 Lagrange multipliers and support-vector sparsity

The hard-margin Lagrangian can be written as

$$
\mathcal{L}(w,b,\alpha)
=\frac12\|w\|^2-
\sum_{i=1}^m \alpha_i\left[y^{(i)}(w^Tx^{(i)}-b)-1\right],
\quad \alpha_i\ge0.
$$

Stationarity with respect to $w$ gives

$$
\nabla_w\mathcal{L}=w-\sum_{i=1}^m\alpha_i y^{(i)}x^{(i)}=0,
$$

so

$$
w=\sum_{i=1}^m\alpha_i y^{(i)}x^{(i)}.
$$

Complementary slackness gives

$$
\alpha_i\left[y^{(i)}(w^Tx^{(i)}-b)-1\right]=0.
$$

Therefore:

- if a point lies strictly outside the margin, then $y^{(i)}(w^Tx^{(i)}-b)>1$, so $\alpha_i=0$;
- if $\alpha_i>0$, then $y^{(i)}(w^Tx^{(i)}-b)=1$, so the point lies exactly on a margin.

Only points with $\alpha_i>0$ affect $w$ and the dual prediction. These are the **support vectors**.

---

## 3. Worked Examples

### Setup

Run this once before any coded example. It imports libraries, fixes randomness, and defines one plotting helper that draws SVM decision regions, margins, and circled support vectors.

```python
import numpy as np  # Import NumPy for arrays, random numbers, and vectorized math.
import matplotlib.pyplot as plt  # Import Matplotlib for all plots in the lesson.
from sklearn.datasets import make_blobs, make_circles, make_moons  # Import synthetic data generators for controlled SVM examples.
from sklearn.svm import SVC, LinearSVC  # Import SVM estimators for linear, soft-margin, and kernel classifiers.
from sklearn.pipeline import make_pipeline  # Import pipeline construction so scaling and fitting stay bundled.
from sklearn.preprocessing import StandardScaler  # Import feature scaling because SVM margins depend on distances.
from sklearn.metrics import accuracy_score, hinge_loss, log_loss  # Import metrics for comparing classifiers and losses.
from sklearn.model_selection import train_test_split  # Import a splitter for honest train/test comparisons.
try:  # Try to import notebook widgets when the environment provides them.
    from ipywidgets import interact, FloatLogSlider, Dropdown  # Import widgets for the interactive experiment.
except ModuleNotFoundError:  # Fall back gracefully when running as a plain Python script without ipywidgets.
    def FloatLogSlider(value, base, min, max, step, description):  # Define a tiny fallback slider factory.
        return value  # Return the default value so the decorated function can run once.
    def Dropdown(options, value, description):  # Define a tiny fallback dropdown factory.
        return value  # Return the default selected option so the decorated function can run once.
    def interact(**controls):  # Define a tiny fallback decorator with the same basic call shape.
        def decorator(func):  # Define the decorator that receives the function being wrapped.
            func(**controls)  # Execute the function once using the default fallback control values.
            return func  # Return the original function so it remains callable.
        return decorator  # Return the decorator to mimic ipywidgets.interact.

SEED = 7  # Store one seed so every random example is reproducible.
rng = np.random.default_rng(SEED)  # Create a modern NumPy random generator for any manual randomness.
np.random.seed(SEED)  # Also seed legacy NumPy calls used by scikit-learn utilities.
plt.rcParams["figure.figsize"] = (7, 5)  # Set a readable default figure size for notebook-style plots.
plt.rcParams["axes.grid"] = True  # Turn on light grid lines to make margins easier to inspect.


def to_pm_one(y):  # Define a helper that converts labels from {0,1} to {-1,+1}.
    y_array = np.asarray(y)  # Convert the input labels to a NumPy array for vectorized operations.
    return np.where(y_array == 0, -1, 1)  # Map class 0 to -1 and every other class to +1.


def plot_svm_2d(model, X, y, title, ax=None, show_margins=True):  # Define a reusable SVM boundary plotter.
    if ax is None:  # Check whether the caller supplied an existing Matplotlib axis.
        fig, ax = plt.subplots()  # Create a fresh figure and axis when none was supplied.
    X = np.asarray(X)  # Ensure features are a NumPy array so slicing is reliable.
    y = np.asarray(y)  # Ensure labels are a NumPy array so masking is reliable.
    x_min = X[:, 0].min() - 0.8  # Extend the left plot boundary beyond the data.
    x_max = X[:, 0].max() + 0.8  # Extend the right plot boundary beyond the data.
    y_min = X[:, 1].min() - 0.8  # Extend the lower plot boundary beyond the data.
    y_max = X[:, 1].max() + 0.8  # Extend the upper plot boundary beyond the data.
    xx, yy = np.meshgrid(np.linspace(x_min, x_max, 350), np.linspace(y_min, y_max, 350))  # Build a dense grid.
    grid = np.c_[xx.ravel(), yy.ravel()]  # Flatten grid coordinates into two-column feature rows.
    scores = model.decision_function(grid).reshape(xx.shape)  # Evaluate signed distance-like SVM scores on the grid.
    ax.contourf(xx, yy, scores > 0, levels=1, alpha=0.18, colors=["tab:blue", "tab:orange"])  # Shade predicted regions.
    ax.contour(xx, yy, scores, levels=[0], colors="black", linewidths=2)  # Draw the separating boundary where score is zero.
    if show_margins:  # Decide whether to draw the canonical margin contours.
        ax.contour(xx, yy, scores, levels=[-1, 1], colors="black", linestyles="--", linewidths=1.4)  # Draw margin lines.
    ax.scatter(X[y == -1, 0], X[y == -1, 1], c="tab:blue", s=45, edgecolors="k", label="class -1")  # Plot negative points.
    ax.scatter(X[y == 1, 0], X[y == 1, 1], c="tab:orange", s=45, edgecolors="k", label="class +1")  # Plot positive points.
    if hasattr(model, "support_vectors_"):  # Check whether the estimator exposes support-vector coordinates.
        sv = model.support_vectors_  # Read the fitted support-vector coordinates from the SVC model.
        ax.scatter(sv[:, 0], sv[:, 1], s=180, facecolors="none", edgecolors="red", linewidths=2.2, label="support vectors")  # Circle support vectors.
    ax.set_title(title)  # Add a descriptive title to the plot.
    ax.set_xlabel("feature 1")  # Label the horizontal feature axis.
    ax.set_ylabel("feature 2")  # Label the vertical feature axis.
    ax.legend(loc="best")  # Place a legend wherever it fits best.
    return ax  # Return the axis so callers can further customize or test the plot.
```

### Data — swappable sources

The next block creates reusable datasets. Choose a source by changing `DATA_SOURCE`. The `upload` option is represented as a validated template: paste your own two-feature array into `uploaded_X` and labels into `uploaded_y`.

```python
DATA_SOURCE = "blobs_linsep"  # Choose one source: "blobs_linsep", "blobs_overlap", "moons", "circles", or "upload".

X_blobs_linsep, y_blobs_linsep_raw = make_blobs(n_samples=80, centers=[[-2, -2], [2, 2]], cluster_std=0.55, random_state=SEED)  # Create clean separable blobs.
y_blobs_linsep = to_pm_one(y_blobs_linsep_raw)  # Convert blob labels from {0,1} into {-1,+1}.

X_blobs_overlap, y_blobs_overlap_raw = make_blobs(n_samples=120, centers=[[-1.1, -1.0], [1.1, 1.0]], cluster_std=1.15, random_state=SEED)  # Create overlapping blobs.
y_blobs_overlap = to_pm_one(y_blobs_overlap_raw)  # Convert overlapping-blob labels to {-1,+1}.

X_moons, y_moons_raw = make_moons(n_samples=180, noise=0.18, random_state=SEED)  # Create crescent-shaped nonlinear data.
y_moons = to_pm_one(y_moons_raw)  # Convert moon labels to {-1,+1}.

X_circles, y_circles_raw = make_circles(n_samples=180, noise=0.08, factor=0.35, random_state=SEED)  # Create ring-shaped nonlinear data.
y_circles = to_pm_one(y_circles_raw)  # Convert circle labels to {-1,+1}.

uploaded_X = np.array([[0.0, 0.0], [1.0, 1.0], [1.0, 0.0], [0.0, 1.0]])  # Provide a safe two-feature fallback dataset for upload-style use.
uploaded_y = np.array([-1, -1, 1, 1])  # Provide matching labels so the upload path runs without external files.

sources = {"blobs_linsep": (X_blobs_linsep, y_blobs_linsep), "blobs_overlap": (X_blobs_overlap, y_blobs_overlap), "moons": (X_moons, y_moons), "circles": (X_circles, y_circles), "upload": (uploaded_X, uploaded_y)}  # Store all datasets in one switchable dictionary.
X_data, y_data = sources[DATA_SOURCE]  # Select the active dataset using the string toggle.

plt.figure()  # Create a figure for the selected raw data.
plt.scatter(X_data[y_data == -1, 0], X_data[y_data == -1, 1], c="tab:blue", edgecolors="k", label="class -1")  # Plot selected negative points.
plt.scatter(X_data[y_data == 1, 0], X_data[y_data == 1, 1], c="tab:orange", edgecolors="k", label="class +1")  # Plot selected positive points.
plt.title(f"Selected data source: {DATA_SOURCE}")  # Title the plot with the active source name.
plt.xlabel("feature 1")  # Label the horizontal axis.
plt.ylabel("feature 2")  # Label the vertical axis.
plt.legend()  # Show the class legend.
plt.show()  # Render the raw-data plot.
```

▶ What you'll see: a two-class scatter plot for whichever source `DATA_SOURCE` names. The linear blobs are nearly separable; the overlapping blobs require soft margins; moons and circles require nonlinear boundaries.

👀 **Takeaway:** SVMs are geometric, so the shape of the data strongly determines whether a linear or kernel SVM is appropriate.

---

### 📖 Concept walkthrough — build each idea from scratch

Before the warm-up examples, we build the SVM ideas from scratch, one small step at a time. Everything here uses only NumPy + Matplotlib and tiny inline data, so every score, margin, loss, and kernel value is inspectable. Variables carry a `_w` suffix so they never collide with the examples below.

```python
import numpy as np  # NumPy gives us vectors, dot products, norms, and small matrix calculations.
import matplotlib.pyplot as plt  # Matplotlib lets us see boundaries, margins, losses, and kernel similarity.
np.random.seed(0)  # reproducibility.
```

#### 1. Linear decision rule: scores, signs, and margins

An SVM starts with a signed score: $f(x)=w^\top x+b$. The sign gives the class prediction, while the labeled score $y f(x)$ says whether the point is correct and how far it is from the boundary in the model's current scaling. We compute both the functional margin $y(w^\top x+b)$ and the geometric margin:

$$
\frac{y(w^\top x+b)}{\lVert w\rVert}
$$

Dividing by $\lVert w\rVert$ matters because multiplying both $w$ and $b$ by 10 does not move the boundary, but it does multiply every raw score by 10. The norm removes that arbitrary scale and turns the score into an actual perpendicular distance.

```python
X_rule_w = np.array([[-2.0, -1.0], [-1.0, -2.0], [-1.0, -1.0], [1.0, 1.0], [2.0, 1.0], [1.0, 2.0]])  # create six separable 2-D points.
y_rule_w = np.array([-1, -1, -1, 1, 1, 1])  # label the first three negative and the last three positive.
w_rule_w = np.array([0.5, 0.5])  # choose a diagonal normal vector perpendicular to the boundary.
b_rule_w = 0.0  # choose the intercept in the code convention f(x)=w^T x+b.
print("points:\n", X_rule_w)  # inspect the tiny dataset.
print("labels:", y_rule_w)  # inspect the class signs.
print("w:", w_rule_w, "b:", b_rule_w)  # inspect the separator parameters.
```
▶ What you'll see: six points arranged in two diagonal classes, plus the hand-built separator parameters.

```python
score_rule_w = X_rule_w @ w_rule_w + b_rule_w  # compute f(x)=w^T x+b for every point at once.
pred_rule_w = np.where(score_rule_w >= 0.0, 1, -1)  # convert score signs into SVM class predictions.
print("scores:", np.round(score_rule_w, 3))  # print raw signed distances in arbitrary score units.
print("predictions:", pred_rule_w)  # print the predicted class signs.
print("correct?", pred_rule_w == y_rule_w)  # verify that the sign rule separates this toy data.
```
▶ What you'll see: negative points get negative scores, positive points get positive scores, and every prediction is correct.

```python
functional_rule_w = y_rule_w * score_rule_w  # compute y*f(x), positive when a point is correctly classified.
norm_rule_w = max(np.linalg.norm(w_rule_w), 1e-12)  # guard against divide-by-zero before making distances.
geometric_rule_w = functional_rule_w / norm_rule_w  # convert functional margins into perpendicular distances.
print("functional margins:", np.round(functional_rule_w, 3))  # inspect scale-dependent confidence.
print("||w||:", round(norm_rule_w, 3))  # inspect the scaling factor that controls distance conversion.
print("geometric margins:", np.round(geometric_rule_w, 3))  # inspect true distances to the correct side.
```
▶ What you'll see: the closest points have functional margin 1 and geometric margin $1/\lVert w\rVert$.

```python
x_grid_rule_w = np.linspace(-3.0, 3.0, 200)  # create x-values for drawing the boundary and margin lines.
safe_w2_rule_w = w_rule_w[1] if abs(w_rule_w[1]) > 1e-12 else 1e-12  # guard the line formula from vertical-boundary division.
y_boundary_rule_w = -(w_rule_w[0] * x_grid_rule_w + b_rule_w) / safe_w2_rule_w  # solve w1*x+w2*y+b=0 for y.
y_plus_rule_w = (1.0 - w_rule_w[0] * x_grid_rule_w - b_rule_w) / safe_w2_rule_w  # solve f(x)=+1 for the positive margin line.
y_minus_rule_w = (-1.0 - w_rule_w[0] * x_grid_rule_w - b_rule_w) / safe_w2_rule_w  # solve f(x)=-1 for the negative margin line.
plt.figure(figsize=(5.5, 4.2))  # create a compact geometry plot.
plt.scatter(X_rule_w[y_rule_w == -1, 0], X_rule_w[y_rule_w == -1, 1], c="tab:blue", edgecolors="k", s=70, label="class -1")  # draw negative points.
plt.scatter(X_rule_w[y_rule_w == 1, 0], X_rule_w[y_rule_w == 1, 1], c="tab:orange", edgecolors="k", s=70, label="class +1")  # draw positive points.
plt.plot(x_grid_rule_w, y_boundary_rule_w, c="black", lw=2, label="f(x)=0")  # draw the decision boundary.
plt.plot(x_grid_rule_w, y_plus_rule_w, c="black", ls="--", label="f(x)=+1")  # draw the positive margin.
plt.plot(x_grid_rule_w, y_minus_rule_w, c="black", ls="--", label="f(x)=-1")  # draw the negative margin.
plt.xlim(-3.0, 3.0)  # keep the horizontal range focused on the toy data.
plt.ylim(-3.0, 3.0)  # keep the vertical range focused on the toy data.
plt.xlabel("feature 1")  # label the horizontal coordinate.
plt.ylabel("feature 2")  # label the vertical coordinate.
plt.legend(loc="best")  # show classes, boundary, and margin-line meanings.
plt.title("1: linear rule, boundary, and margins")  # give the plot a lesson-numbered title.
plt.show()  # render the margin geometry.
```
▶ What you'll see: a diagonal decision boundary with two parallel margin lines touching the closest points.

*Why it's done this way: SVMs separate by the sign of one linear score, then measure safety by the closest labeled score. The geometric margin divides out arbitrary scaling so "far from the boundary" means real Euclidean distance, not just a bigger choice of $w$ and $b$.*

#### 2. Hard-margin SVM: maximize width by minimizing $\frac12\lVert w\rVert^2$

For separable data, the hard-margin SVM chooses the separator with the widest empty buffer. In canonical scaling, every point must satisfy:

$$
y_i(w^\top x_i+b)\geq 1
$$

The two margin lines are $f(x)=+1$ and $f(x)=-1$, so their distance apart is:

$$
\frac{2}{\lVert w\rVert}
$$

Maximizing that width is the same as minimizing $\lVert w\rVert$, and $\frac12\lVert w\rVert^2$ is used because it is smooth, convex, and has the same minimizer.

```python
X_hard_w = X_rule_w.copy()  # reuse the same separable points so the hard-margin constraints are visible.
y_hard_w = y_rule_w.copy()  # reuse the same labels.
w_large_w = np.array([1.0, 1.0])  # choose a steeper-scaled separator with the same boundary direction.
b_large_w = 0.0  # keep the boundary through the origin for easy comparison.
score_large_w = X_hard_w @ w_large_w + b_large_w  # compute scores for the scaled separator.
margin_large_w = y_hard_w * score_large_w  # compute hard-margin constraint values.
print("large-scale functional margins:", np.round(margin_large_w, 3))  # inspect that all constraints exceed 1.
print("large-scale min margin:", round(margin_large_w.min(), 3))  # inspect the closest constraint value.
```
▶ What you'll see: this separator classifies everything correctly, but its closest functional margin is larger than needed.

```python
scale_hard_w = max(margin_large_w.min(), 1e-12)  # find the factor needed to shrink the closest margin down to 1 safely.
w_hard_w = w_large_w / scale_hard_w  # rescale w without moving the decision boundary.
b_hard_w = b_large_w / scale_hard_w  # rescale b by the same amount so the boundary is unchanged.
score_hard_w = X_hard_w @ w_hard_w + b_hard_w  # recompute scores after canonical scaling.
constraint_hard_w = y_hard_w * score_hard_w  # recompute y*f(x), which should now have minimum 1.
print("canonical w:", np.round(w_hard_w, 3), "canonical b:", round(b_hard_w, 3))  # inspect the canonical separator.
print("canonical constraints:", np.round(constraint_hard_w, 3))  # verify y*f(x)>=1 for every point.
```
▶ What you'll see: the closest points land exactly at functional margin 1, which is the canonical SVM scaling.

```python
norm_large_w = max(np.linalg.norm(w_large_w), 1e-12)  # compute the norm of the over-scaled separator safely.
norm_hard_w = max(np.linalg.norm(w_hard_w), 1e-12)  # compute the norm of the canonical separator safely.
width_large_w = 2.0 / norm_large_w  # compute the over-scaled margin width.
width_hard_w = 2.0 / norm_hard_w  # compute the canonical margin width.
objective_large_w = 0.5 * norm_large_w ** 2  # compute 1/2||w||^2 for the over-scaled separator.
objective_hard_w = 0.5 * norm_hard_w ** 2  # compute 1/2||w||^2 for the canonical separator.
print("large width/objective:", round(width_large_w, 3), round(objective_large_w, 3))  # compare the worse scaling.
print("canonical width/objective:", round(width_hard_w, 3), round(objective_hard_w, 3))  # compare the wider, smaller-norm scaling.
```
▶ What you'll see: shrinking to canonical scale increases the margin width and lowers $\frac12\lVert w\rVert^2$.

```python
x_grid_hard_w = np.linspace(-3.0, 3.0, 200)  # create x-values for the hard-margin plot.
safe_w2_hard_w = w_hard_w[1] if abs(w_hard_w[1]) > 1e-12 else 1e-12  # guard against vertical-line division.
y0_hard_w = -(w_hard_w[0] * x_grid_hard_w + b_hard_w) / safe_w2_hard_w  # draw f(x)=0.
y1_hard_w = (1.0 - w_hard_w[0] * x_grid_hard_w - b_hard_w) / safe_w2_hard_w  # draw f(x)=+1.
ym1_hard_w = (-1.0 - w_hard_w[0] * x_grid_hard_w - b_hard_w) / safe_w2_hard_w  # draw f(x)=-1.
plt.figure(figsize=(5.5, 4.2))  # create the hard-margin figure.
plt.scatter(X_hard_w[y_hard_w == -1, 0], X_hard_w[y_hard_w == -1, 1], c="tab:blue", edgecolors="k", s=70, label="class -1")  # draw negative class points.
plt.scatter(X_hard_w[y_hard_w == 1, 0], X_hard_w[y_hard_w == 1, 1], c="tab:orange", edgecolors="k", s=70, label="class +1")  # draw positive class points.
plt.plot(x_grid_hard_w, y0_hard_w, c="black", lw=2, label="boundary")  # draw the separating line.
plt.plot(x_grid_hard_w, y1_hard_w, c="black", ls="--", label="margins")  # draw the upper margin.
plt.plot(x_grid_hard_w, ym1_hard_w, c="black", ls="--")  # draw the lower margin.
plt.annotate(f"width = {width_hard_w:.2f}", xy=(0.0, 1.0), xytext=(0.7, 1.7), arrowprops={"arrowstyle": "->"})  # mark the margin width numerically.
plt.xlim(-3.0, 3.0)  # focus on the data horizontally.
plt.ylim(-3.0, 3.0)  # focus on the data vertically.
plt.xlabel("feature 1")  # label the horizontal axis.
plt.ylabel("feature 2")  # label the vertical axis.
plt.legend(loc="best")  # show boundary and class labels.
plt.title("2: hard-margin width is 2 / ||w||")  # identify the hard-margin idea.
plt.show()  # render the figure.
```
▶ What you'll see: the widest empty strip sits between the dashed lines, with closest points touching the strip edges.

*Why it's done this way: the constraint $y_i(w^\top x_i+b)\geq 1$ fixes the otherwise arbitrary scale of the score. Once that scale is fixed, minimizing $\frac12\lVert w\rVert^2$ directly maximizes the geometric margin width.*

#### 3. Soft margin: hinge loss, slack, and the $C$ tradeoff

Real data overlap, so a perfect hard-margin separator may not exist or may be too brittle. Soft-margin SVMs introduce slack $\xi_i\geq 0$ so points can be inside the margin or even misclassified:

$$
y_i(w^\top x_i+b)\geq 1-\xi_i
$$

For a fixed separator, the smallest useful slack is exactly the hinge loss:

$$
\xi_i=\max(0,1-y_i f(x_i))
$$

The parameter $C$ controls how expensive these violations are: large $C$ punishes violations hard, while small $C$ accepts more violations to keep the margin wider.

```python
X_soft_w = np.array([[-2.0, -1.0], [-1.0, -2.0], [-0.2, 0.8], [0.3, -0.4], [1.0, 1.2], [2.0, 1.0]])  # create mostly separable points plus two awkward ones.
y_soft_w = np.array([-1, -1, -1, 1, 1, 1])  # keep binary labels in {-1,+1}.
w_soft_w = np.array([0.7, 0.6])  # choose a plausible but imperfect separator.
b_soft_w = -0.05  # shift the separator slightly so some points violate the margin.
score_soft_w = X_soft_w @ w_soft_w + b_soft_w  # compute f(x) for every soft-margin point.
signed_soft_w = y_soft_w * score_soft_w  # compute y*f(x), the margin score used by hinge loss.
print("signed margins y*f:", np.round(signed_soft_w, 3))  # inspect which points are safe, inside-margin, or wrong.
```
▶ What you'll see: some points have $y f(x)\geq 1$, some fall inside the margin, and possibly one is on the wrong side.

```python
hinge_soft_w = np.maximum(0.0, 1.0 - signed_soft_w)  # compute max(0, 1-y*f) point by point.
slack_soft_w = hinge_soft_w.copy()  # interpret the same values as the minimum slack variables xi.
status_soft_w = np.where(signed_soft_w >= 1.0, "safe", np.where(signed_soft_w > 0.0, "inside margin", "misclassified"))  # classify violation types.
print("hinge/slack values:", np.round(slack_soft_w, 3))  # print each point's violation size.
print("statuses:", status_soft_w)  # print the human-readable case for each point.
```
▶ What you'll see: safe points have zero loss, margin violators have fractional loss, and wrong-side points have loss above 1.

```python
C_values_soft_w = np.array([0.1, 1.0, 10.0])  # choose small, medium, and large violation penalties.
regularizer_soft_w = 0.5 * np.sum(w_soft_w ** 2)  # compute the margin-size penalty 1/2||w||^2.
objectives_soft_w = regularizer_soft_w + C_values_soft_w * np.sum(hinge_soft_w)  # compute soft-margin objective values.
print("regularizer:", round(regularizer_soft_w, 3))  # inspect the margin part of the cost.
print("sum hinge:", round(np.sum(hinge_soft_w), 3))  # inspect the total violation part.
print("objectives for C=0.1,1,10:", np.round(objectives_soft_w, 3))  # see how C changes the cost pressure.
```
▶ What you'll see: the same violations become much more expensive as $C$ grows.

```python
s_grid_soft_w = np.linspace(-1.5, 2.5, 200)  # create signed-margin values y*f across a useful range.
hinge_grid_soft_w = np.maximum(0.0, 1.0 - s_grid_soft_w)  # evaluate hinge loss on the grid.
plt.figure(figsize=(5.5, 3.8))  # create a hinge-loss figure.
plt.plot(s_grid_soft_w, hinge_grid_soft_w, c="crimson", lw=2, label="max(0, 1 - y f)")  # draw the hinge curve.
plt.scatter(signed_soft_w, hinge_soft_w, c="black", s=55, zorder=3, label="toy points")  # place the actual examples on the curve.
plt.axvline(1.0, c="gray", ls="--", label="margin threshold")  # mark where loss becomes zero.
plt.axvline(0.0, c="gray", ls=":", label="decision boundary")  # mark where classification changes sign.
plt.xlabel("signed margin y f(x)")  # label the horizontal axis with the SVM score.
plt.ylabel("hinge loss")  # label the vertical loss axis.
plt.legend(loc="best")  # show the curve and threshold meanings.
plt.title("3: hinge loss charges margin violations")  # identify the soft-margin idea.
plt.show()  # render the hinge-loss plot.
```
▶ What you'll see: a flat zero-loss region after $y f(x)=1$ and a linear penalty for every violation.

*Why it's done this way: slack turns an impossible hard constraint into a measurable violation, and hinge loss is the smallest slack needed for each point. The single knob $C$ then trades margin width against how much the model cares about those violations.*

#### 4. RBF kernel: distance becomes similarity for curved boundaries

A linear SVM draws a straight boundary in the input plane. A kernel SVM instead compares a point to training points through a similarity function, and the RBF kernel is:

$$
k(x,z)=\exp(-\gamma\lVert x-z\rVert^2)
$$

This formula is near 1 when $x$ and $z$ are close and decays toward 0 as their squared distance grows. Because predictions can combine many local similarities, the final boundary can bend around nonlinear shapes without explicitly building the high-dimensional feature map.

```python
anchor_rbf_w = np.array([0.0, 0.0])  # choose one reference point z.
query_rbf_w = np.array([[0.0, 0.0], [0.5, 0.0], [1.0, 0.0], [2.0, 0.0], [3.0, 0.0]])  # choose points at increasing distances.
gamma_rbf_w = 0.8  # choose one RBF sharpness value.
dist2_rbf_w = np.sum((query_rbf_w - anchor_rbf_w) ** 2, axis=1)  # compute squared distances ||x-z||^2.
k_rbf_w = np.exp(-gamma_rbf_w * dist2_rbf_w)  # compute exp(-gamma||x-z||^2).
print("squared distances:", np.round(dist2_rbf_w, 3))  # inspect the distance inputs to the kernel.
print("RBF similarities:", np.round(k_rbf_w, 3))  # inspect the similarity outputs.
```
▶ What you'll see: identical points have similarity 1, and farther points quickly approach similarity 0.

```python
d_grid_rbf_w = np.linspace(0.0, 3.0, 200)  # create distances from zero to far away.
gamma_slow_w = 0.2  # choose a small gamma for slow similarity decay.
gamma_fast_w = 1.2  # choose a large gamma for fast similarity decay.
k_slow_w = np.exp(-gamma_slow_w * d_grid_rbf_w ** 2)  # compute a broad RBF curve.
k_fast_w = np.exp(-gamma_fast_w * d_grid_rbf_w ** 2)  # compute a narrow RBF curve.
plt.figure(figsize=(5.5, 3.8))  # create the RBF decay figure.
plt.plot(d_grid_rbf_w, k_slow_w, label=r"$\gamma=0.2$", lw=2)  # draw the smoother, wider kernel.
plt.plot(d_grid_rbf_w, k_fast_w, label=r"$\gamma=1.2$", lw=2)  # draw the more local, sharper kernel.
plt.xlabel("distance ||x - z||")  # label the distance axis.
plt.ylabel("RBF similarity")  # label the kernel-value axis.
plt.legend(loc="best")  # show which curve belongs to which gamma.
plt.title("4: RBF similarity decays with distance")  # identify the RBF idea.
plt.show()  # render the decay plot.
```
▶ What you'll see: larger $\gamma$ makes similarity vanish faster, which makes the model more local and wiggly.

```python
support_rbf_w = np.array([[0.0, 0.0], [1.2, 0.2], [-1.2, 0.2], [0.0, 1.4]])  # create four hand-chosen support-like centers.
y_support_rbf_w = np.array([1, -1, -1, -1])  # make the center positive and surrounding points negative.
alpha_rbf_w = np.array([1.8, 0.7, 0.7, 0.7])  # choose dual-like weights that combine local similarities.
xx_rbf_w, yy_rbf_w = np.meshgrid(np.linspace(-2.0, 2.0, 160), np.linspace(-1.4, 2.4, 160))  # build a 2-D plotting grid.
grid_rbf_w = np.c_[xx_rbf_w.ravel(), yy_rbf_w.ravel()]  # flatten the grid into point rows.
dist2_grid_rbf_w = np.sum((grid_rbf_w[:, None, :] - support_rbf_w[None, :, :]) ** 2, axis=2)  # compute grid-to-support squared distances.
K_grid_rbf_w = np.exp(-1.4 * dist2_grid_rbf_w)  # compute RBF similarities from every grid point to every support point.
score_grid_rbf_w = K_grid_rbf_w @ (alpha_rbf_w * y_support_rbf_w)  # combine similarities into a kernel decision score.
plt.figure(figsize=(5.2, 4.2))  # create the nonlinear-boundary figure.
plt.contourf(xx_rbf_w, yy_rbf_w, score_grid_rbf_w.reshape(xx_rbf_w.shape), levels=[-10.0, 0.0, 10.0], colors=["tab:blue", "tab:orange"], alpha=0.18)  # shade negative and positive regions.
plt.contour(xx_rbf_w, yy_rbf_w, score_grid_rbf_w.reshape(xx_rbf_w.shape), levels=[0.0], colors="black", linewidths=2)  # draw the curved zero-score boundary.
plt.scatter(support_rbf_w[y_support_rbf_w == -1, 0], support_rbf_w[y_support_rbf_w == -1, 1], c="tab:blue", edgecolors="k", s=80, label="class -1")  # draw negative support-like points.
plt.scatter(support_rbf_w[y_support_rbf_w == 1, 0], support_rbf_w[y_support_rbf_w == 1, 1], c="tab:orange", edgecolors="k", s=80, label="class +1")  # draw positive support-like points.
plt.xlabel("feature 1")  # label the horizontal feature.
plt.ylabel("feature 2")  # label the vertical feature.
plt.legend(loc="best")  # show class meanings.
plt.title("4: RBF combinations can bend the boundary")  # identify the curved-boundary takeaway.
plt.show()  # render the hand-built kernel decision boundary.
```
▶ What you'll see: the zero-score contour curves around the central point instead of staying straight.

*Why it's done this way: the RBF kernel converts distance into local similarity, so nearby support vectors influence a prediction strongly and faraway ones barely matter. Combining those local bumps gives nonlinear boundaries while the algorithm still works through dot-product-like kernel values.*

#### 5. Support-vector sparsity: only margin points get nonzero $\alpha$

The dual view writes the separator as a weighted sum of training points:

$$
w=\sum_i \alpha_i y_i x_i
$$

The key KKT condition is complementary slackness:

$$
\alpha_i\left[y_i(w^\top x_i+b)-1\right]=0
$$

If a point is strictly outside the margin, then $y_i(w^\top x_i+b)>1$, so the bracket is positive and the only way the product can be zero is $\alpha_i=0$. Points on the margin can have $\alpha_i>0$; those are the support vectors that define the boundary.

```python
X_sv_w = X_rule_w.copy()  # reuse the clean hard-margin data.
y_sv_w = y_rule_w.copy()  # reuse the matching labels.
w_sv_w = w_hard_w.copy()  # reuse the canonical separator from the hard-margin section.
b_sv_w = b_hard_w  # reuse the canonical intercept.
margin_sv_w = y_sv_w * (X_sv_w @ w_sv_w + b_sv_w)  # compute y*f(x) for every point.
support_mask_sv_w = np.isclose(margin_sv_w, 1.0, atol=1e-9)  # identify points exactly on the margin.
print("margins:", np.round(margin_sv_w, 3))  # inspect which points are on or outside the margin.
print("support-vector mask:", support_mask_sv_w)  # show which points satisfy y*f(x)=1.
```
▶ What you'll see: only the two closest points sit exactly at margin value 1.

```python
alpha_sv_w = np.zeros(len(X_sv_w))  # start with zero dual weight on every point.
alpha_sv_w[support_mask_sv_w] = 0.25  # assign nonzero weights only to the margin points in this symmetric toy.
w_from_alpha_sv_w = np.sum((alpha_sv_w * y_sv_w)[:, None] * X_sv_w, axis=0)  # reconstruct w=sum alpha_i*y_i*x_i.
print("alpha values:", alpha_sv_w)  # inspect sparsity directly.
print("w from alpha:", np.round(w_from_alpha_sv_w, 3))  # verify the support vectors reconstruct the separator.
print("original w:", np.round(w_sv_w, 3))  # compare against the canonical primal vector.
```
▶ What you'll see: four alpha values are zero, and the two support vectors alone rebuild $w$.

```python
kkt_product_sv_w = alpha_sv_w * (margin_sv_w - 1.0)  # compute alpha_i * (y_i*f_i - 1) for complementary slackness.
print("KKT products:", np.round(kkt_product_sv_w, 10))  # verify the products are zero for all points.
print("support-vector coordinates:\n", X_sv_w[support_mask_sv_w])  # print the boundary-defining points.
```
▶ What you'll see: every KKT product is zero, even though most points are ignored because their alpha is zero.

```python
x_grid_sv_w = np.linspace(-3.0, 3.0, 200)  # create x-values for the sparsity plot.
safe_w2_sv_w = w_sv_w[1] if abs(w_sv_w[1]) > 1e-12 else 1e-12  # guard against vertical-boundary division.
y0_sv_w = -(w_sv_w[0] * x_grid_sv_w + b_sv_w) / safe_w2_sv_w  # compute the decision boundary.
y1_sv_w = (1.0 - w_sv_w[0] * x_grid_sv_w - b_sv_w) / safe_w2_sv_w  # compute the positive margin.
ym1_sv_w = (-1.0 - w_sv_w[0] * x_grid_sv_w - b_sv_w) / safe_w2_sv_w  # compute the negative margin.
plt.figure(figsize=(5.5, 4.2))  # create the support-vector plot.
plt.scatter(X_sv_w[y_sv_w == -1, 0], X_sv_w[y_sv_w == -1, 1], c="tab:blue", edgecolors="k", s=70, label="class -1")  # draw negative points.
plt.scatter(X_sv_w[y_sv_w == 1, 0], X_sv_w[y_sv_w == 1, 1], c="tab:orange", edgecolors="k", s=70, label="class +1")  # draw positive points.
plt.scatter(X_sv_w[support_mask_sv_w, 0], X_sv_w[support_mask_sv_w, 1], s=220, facecolors="none", edgecolors="red", linewidths=2.2, label="support vectors")  # circle only support vectors.
plt.plot(x_grid_sv_w, y0_sv_w, c="black", lw=2, label="boundary")  # draw the boundary.
plt.plot(x_grid_sv_w, y1_sv_w, c="black", ls="--", label="margins")  # draw one margin.
plt.plot(x_grid_sv_w, ym1_sv_w, c="black", ls="--")  # draw the other margin.
plt.xlim(-3.0, 3.0)  # focus the horizontal range.
plt.ylim(-3.0, 3.0)  # focus the vertical range.
plt.xlabel("feature 1")  # label the horizontal axis.
plt.ylabel("feature 2")  # label the vertical axis.
plt.legend(loc="best")  # show support-vector and class labels.
plt.title("5: support vectors define the SVM boundary")  # identify the sparsity idea.
plt.show()  # render the support-vector geometry.
```
▶ What you'll see: the circled margin points define the boundary; the farther points do not affect $w$.

*Why it's done this way: the dual/KKT conditions make SVMs sparse by construction. Training may look at every point, but prediction and the final boundary are governed only by points with nonzero $\alpha$ — the support vectors.*

### 🟢 Basics (warm-up)

#### B1. Compute one SVM score $w^Tx-b$ and its sign

Goal: evaluate one point with a fixed separator before fitting any model.

```python
w_b1 = np.array([1.0, -0.5])  # Choose a separator direction so the score is a simple dot product.
b_b1 = 0.25  # Choose an offset so the decision boundary is shifted away from the origin.
x_b1 = np.array([2.0, 1.0])  # Choose one point so we can classify exactly one example.
```

▶ What you'll see: no output yet; these are the three ingredients of the SVM score.

```python
score_b1 = w_b1 @ x_b1 - b_b1  # Compute w^T x - b because SVMs classify by the score's sign.
pred_b1 = np.sign(score_b1)  # Convert the score into class -1 or +1.
print(f"score = {score_b1:.2f}, predicted class = {int(pred_b1)}")  # Print the raw score and its sign.
```

▶ What you'll see: a positive score, so the point lands on the +1 side of the boundary.

👀 **Takeaway:** the SVM prediction starts with one signed score; margin ideas come after that.

#### B2. Check one margin constraint $y(w^Tx-b)\ge 1$

Goal: test whether one labeled point is not just correct, but outside the margin.

```python
w_b2 = np.array([1.0, 0.0])  # Use a vertical boundary so the margin lines are easy to see.
b_b2 = 0.0  # Put the separating boundary at x1 = 0.
x_b2 = np.array([1.4, 0.6])  # Choose one positive point to test against the margin.
y_b2 = 1  # Give the point its true SVM label.
```

▶ What you'll see: no output yet; this sets up one labeled margin check.

```python
margin_value_b2 = y_b2 * (w_b2 @ x_b2 - b_b2)  # Multiply by y so correct-side points have positive margin value.
passes_b2 = margin_value_b2 >= 1  # Check the canonical hard-margin requirement.
print(f"y(w^T x - b) = {margin_value_b2:.2f}; passes margin? {passes_b2}")  # Report the constraint result.
```

▶ What you'll see: the value is above 1, so this point satisfies the margin constraint.

```python
plt.figure(figsize=(5, 4))  # Create a compact sketch for the point and margin lines.
plt.axvline(0, color="black", linewidth=2, label="boundary: score 0")  # Draw w^T x - b = 0.
plt.axvline(1, color="black", linestyle="--", label="positive margin: score 1")  # Draw the +1 margin line.
plt.scatter([x_b2[0]], [x_b2[1]], c="tab:orange", edgecolors="k", s=80, label="tested +1 point")  # Plot the one checked point.
plt.xlim(-0.5, 2.0)  # Keep the sketch focused on the boundary and margin.
plt.ylim(0.0, 1.2)  # Keep the point visible with a little vertical room.
plt.legend()  # Label the boundary, margin, and point.
plt.show()  # Render the margin sketch.
```

▶ What you'll see: the point sits to the right of the dashed +1 margin line.

👀 **Takeaway:** correct classification is score sign; margin satisfaction asks whether the signed margin reaches at least 1.

#### B3. Evaluate one Gaussian kernel value $K(x,z)$

Goal: compute one RBF similarity number between two points.

```python
x_b3 = np.array([0.0, 0.0])  # Choose the first point as a simple reference.
z_b3 = np.array([1.0, 1.0])  # Choose a second point one diagonal step away.
sigma_b3 = 1.0  # Use sigma to control how quickly similarity decays with distance.
```

▶ What you'll see: no output yet; these are the two points and the RBF length scale.

```python
squared_distance_b3 = np.sum((x_b3 - z_b3) ** 2)  # Compute ||x-z||^2 because the Gaussian kernel depends on squared distance.
kernel_b3 = np.exp(-squared_distance_b3 / (2 * sigma_b3 ** 2))  # Apply exp(-distance^2 / (2 sigma^2)).
print(f"squared distance = {squared_distance_b3:.2f}")  # Print the distance term before exponentiating.
print(f"K(x, z) = {kernel_b3:.3f}")  # Print the final similarity value.
```

▶ What you'll see: the kernel value is between 0 and 1, with closer points giving larger values.

```python
closer_z_b3 = np.array([0.2, 0.2])  # Choose a nearby comparison point to isolate the effect of distance.
closer_kernel_b3 = np.exp(-np.sum((x_b3 - closer_z_b3) ** 2) / (2 * sigma_b3 ** 2))  # Reuse the same RBF formula for the closer point.
print(f"K(x, closer z) = {closer_kernel_b3:.3f}")  # Print the larger similarity for the closer point.
```

▶ What you'll see: the closer point has a much larger kernel similarity.

👀 **Takeaway:** an RBF kernel is a distance-to-similarity converter; nearby points behave more alike.

---


#### B4. Compute the weight norm $\|w\|$

Goal: measure the separator length that controls SVM margin width.

```python
w_b4 = np.array([3.0, 4.0])  # Choose a two-dimensional weight vector with a familiar length.
norm_b4 = np.linalg.norm(w_b4)  # Compute the Euclidean norm ||w||.
print(f"||w|| = {norm_b4:.2f}")  # Display the separator norm.
```

▶ What you'll see: the vector $(3,4)$ has norm $5$.

👀 **Takeaway:** smaller $\|w\|$ means wider canonical margins.

#### B5. Convert functional margin to geometric margin

Goal: divide one functional margin by $\|w\|$ to get distance in feature units.

```python
functional_margin_b5 = 2.5  # Store one value of y(w^T x - b).
norm_w_b5 = 5.0  # Store the separator norm.
geometric_margin_b5 = functional_margin_b5 / norm_w_b5  # Convert scaled margin into geometric distance.
print(f"geometric margin = {geometric_margin_b5:.3f}")  # Display the distance-to-correct-side margin.
```

▶ What you'll see: a functional margin of $2.5$ with $\|w\|=5$ becomes geometric margin $0.5$.

👀 **Takeaway:** geometric margins remove the arbitrary scaling of $w$ and $b$.

#### B6. Compute distance from one point to the boundary

Goal: find the signed distance from a point to the line $w^Tx-b=0$.

```python
w_b6 = np.array([0.0, 2.0])  # Choose a horizontal boundary normal for easy arithmetic.
b_b6 = 2.0  # Choose the offset so the boundary is y = 1.
x_b6 = np.array([3.0, 2.5])  # Choose one point above the boundary.
signed_distance_b6 = (w_b6 @ x_b6 - b_b6) / np.linalg.norm(w_b6)  # Divide score by ||w|| to get signed distance.
print(f"signed distance = {signed_distance_b6:.2f}")  # Display the point's distance from the boundary.
```

▶ What you'll see: the point is $1.5$ units on the positive side of the boundary.

👀 **Takeaway:** SVM geometry turns scores into distances by dividing by $\|w\|$.

#### B7. Evaluate one hinge loss

Goal: compute $\max(0,1-yf)$ for one labeled score.

```python
y_b7 = -1  # Store the true label.
f_b7 = -0.3  # Store the raw SVM score w^T x - b.
margin_b7 = y_b7 * f_b7  # Compute the signed margin y f.
hinge_b7 = max(0.0, 1.0 - margin_b7)  # Apply the hinge-loss formula.
print(f"margin = {margin_b7:.2f}")  # Display the signed margin.
print(f"hinge loss = {hinge_b7:.2f}")  # Display the loss from being inside the margin.
```

▶ What you'll see: the point is correctly signed but still inside the margin, so hinge loss is positive.

👀 **Takeaway:** hinge loss cares about both correctness and margin clearance.

#### B8. Compute one dot product $x^Tz$

Goal: calculate the linear-kernel similarity between two vectors.

```python
x_b8 = np.array([1.0, 2.0, -1.0])  # Store the first feature vector.
z_b8 = np.array([3.0, 0.5, 2.0])  # Store the second feature vector.
dot_b8 = x_b8 @ z_b8  # Sum coordinate-wise products to compute x^T z.
print(f"x^T z = {dot_b8:.2f}")  # Display the linear similarity.
```

▶ What you'll see: positive and negative coordinate products combine into one similarity score.

👀 **Takeaway:** kernels generalize the dot product used by linear separators.

#### B9. Scale $w,b$ and compare predictions

Goal: see that multiplying $w$ and $b$ by the same positive constant preserves the boundary sign.

```python
w_b9 = np.array([1.0, -1.0])  # Store an original separator direction.
b_b9 = 0.5  # Store the original offset.
x_b9 = np.array([2.0, 0.25])  # Store one point to classify.
scale_b9 = 3.0  # Choose a positive rescaling factor.
score_original_b9 = w_b9 @ x_b9 - b_b9  # Compute the original signed score.
score_scaled_b9 = (scale_b9 * w_b9) @ x_b9 - (scale_b9 * b_b9)  # Compute the rescaled signed score.
print(f"original sign = {np.sign(score_original_b9):.0f}")  # Display the original prediction sign.
print(f"scaled sign = {np.sign(score_scaled_b9):.0f}")  # Display the rescaled prediction sign.
```

▶ What you'll see: the score magnitude changes, but the predicted sign stays the same.

👀 **Takeaway:** functional margins change under scaling, but the classifier boundary does not.

#### B10. Identify which of two points is the support vector

Goal: choose the point closest to the canonical margin by comparing $y(w^Tx-b)$ values.

```python
margins_b10 = np.array([1.0, 2.7])  # Store two signed functional margins.
point_names_b10 = np.array(["point A", "point B"])  # Name the two candidate points.
support_index_b10 = np.argmin(margins_b10)  # Pick the smaller margin as the boundary-determining point.
print(f"support vector candidate = {point_names_b10[support_index_b10]}")  # Display the closest candidate.
print(f"margin value = {margins_b10[support_index_b10]:.1f}")  # Display its margin value.
```

▶ What you'll see: the point with margin $1.0$ is the support-vector candidate.

👀 **Takeaway:** support vectors are the closest points that pin down the margin.

### 🟡 Easy

#### E1. [pen-and-paper] Compute margin width for a candidate separator

**Problem.** Consider the candidate separator

$$
w=\begin{bmatrix}1\\1\end{bmatrix},\qquad b=0,
$$

with classifier

$$
h(x)=\operatorname{sign}(w^Tx-b)=\operatorname{sign}(x_1+x_2).
$$

The labeled points are

$$
(-2,-1),\;(-1,-2)\quad\text{with }y=-1,
$$

and

$$
(2,1),\;(1,2)\quad\text{with }y=+1.
$$

Compute the functional margins, geometric margins, margin width, and decide whether the candidate is in canonical SVM scaling.

**Hand solution.** The score is

$$
z=w^Tx-b=x_1+x_2.
$$

For each point:

$$
\begin{array}{c|c|c|c}
x & y & z=x_1+x_2 & yz \\
\hline
(-2,-1) & -1 & -3 & 3 \\
(-1,-2) & -1 & -3 & 3 \\
(2,1) & +1 & 3 & 3 \\
(1,2) & +1 & 3 & 3
\end{array}
$$

So every functional margin is

$$
y^{(i)}(w^Tx^{(i)}-b)=3.
$$

The norm of $w$ is

$$
\|w\|=\sqrt{1^2+1^2}=\sqrt2.
$$

Therefore every geometric margin is

$$
\gamma^{(i)}=\frac{y^{(i)}(w^Tx^{(i)}-b)}{\|w\|}
=\frac{3}{\sqrt2}.
$$

The candidate decision boundary is

$$
x_1+x_2=0.
$$

The canonical margin lines for this unscaled candidate would be

$$
x_1+x_2=1
\quad\text{and}\quad
x_1+x_2=-1,
$$

whose distance apart is

$$
\frac{2}{\|w\|}=\frac{2}{\sqrt2}=\sqrt2.
$$

But the closest training points have score $\pm3$, not $\pm1$. So this representation is not in canonical scaling. To rescale canonically, divide $w$ and $b$ by $3$:

$$
w'=\frac13\begin{bmatrix}1\\1\end{bmatrix},
\qquad
b'=0.
$$

Then each closest point has functional margin

$$
y^{(i)}((w')^Tx^{(i)}-b')=1.
$$

The canonical norm is

$$
\|w'\|=\frac{\sqrt2}{3}.
$$

Thus the true margin width between the support lines through the data is

$$
\frac{2}{\|w'\|}=\frac{2}{\sqrt2/3}=\frac{6}{\sqrt2}=3\sqrt2.
$$

$$
\boxed{\text{Functional margins under }(w,b):3;
\quad\text{geometric margins: }3/\sqrt2;
\quad\text{canonical margin width: }3\sqrt2.}
$$

The support lines passing through the closest data are $x_1+x_2=3$ and $x_1+x_2=-3$.

---

#### E2. [coded] Hard-margin SVM on clean separable blobs

We now fit an almost hard-margin linear SVM to clean blobs. We use a very large `C` so margin violations are heavily penalized.

**Build step 1 — select the clean separable data.**

```python
X_e2 = X_blobs_linsep.copy()  # Copy the clean separable features so later examples cannot mutate them.
y_e2 = y_blobs_linsep.copy()  # Copy the corresponding {-1,+1} labels.
print(X_e2.shape, y_e2.shape)  # Print dimensions to verify that features and labels align.
```

**Build step 2 — fit a linear SVM with large `C`.**

```python
svm_e2 = SVC(kernel="linear", C=1_000.0)  # Create a linear SVM that strongly penalizes margin violations.
svm_e2.fit(X_e2, y_e2)  # Fit the SVM so it finds a maximum-margin separating line.
train_pred_e2 = svm_e2.predict(X_e2)  # Predict labels on the training data to check separability.
acc_e2 = accuracy_score(y_e2, train_pred_e2)  # Compute training accuracy for the clean blobs.
print(f"training accuracy = {acc_e2:.3f}")  # Display the training accuracy.
print(f"number of support vectors = {svm_e2.support_vectors_.shape[0]}")  # Display how many points determine the boundary.
```

**Build step 3 — inspect the fitted hyperplane.**

```python
w_e2 = svm_e2.coef_[0]  # Extract the fitted normal vector w from the linear SVM.
intercept_e2 = svm_e2.intercept_[0]  # Extract scikit-learn's intercept, equal to -b in the lesson convention.
b_e2 = -intercept_e2  # Convert the intercept into the lesson's b for w^T x - b.
margin_width_e2 = 2.0 / np.linalg.norm(w_e2)  # Compute the canonical margin width 2 divided by ||w||.
print(f"w = {w_e2}")  # Print the learned normal vector.
print(f"b in w^T x - b = {b_e2:.3f}")  # Print the lesson-convention offset.
print(f"margin width = {margin_width_e2:.3f}")  # Print the distance between the two margin lines.
```

**Result visualization.**

```python
plot_svm_2d(svm_e2, X_e2, y_e2, "E2: hard-margin-style linear SVM on separable blobs")  # Plot boundary, margins, and support vectors.
plt.show()  # Render the completed SVM plot.
```

▶ What you'll see: a straight black decision boundary, dashed parallel margin lines, and only a few red-circled points touching or nearly touching the margins.

👀 **Takeaway:** when data are separable, the final classifier is determined by the closest training points, not by all points equally.

---

#### E3. [pen-and-paper] Hinge loss values for correctly/incorrectly classified points

**Problem.** For each example below, compute the margin $yz$ and hinge loss

$$
L(z,y)=\max(0,1-yz).
$$

$$
\begin{array}{c|c|c}
\text{case} & y & z=w^Tx-b \\
\hline
1 & +1 & 2.4 \\
2 & +1 & 0.3 \\
3 & -1 & -1.2 \\
4 & -1 & 0.7
\end{array}
$$

**Hand solution.** We compute $yz$ first, then apply $\max(0,1-yz)$.

Case 1:

$$
yz=(+1)(2.4)=2.4.
$$

Since $2.4\ge1$,

$$
L=\max(0,1-2.4)=\max(0,-1.4)=0.
$$

Case 2:

$$
yz=(+1)(0.3)=0.3.
$$

Since $0<0.3<1$, the point is correctly classified but inside the margin:

$$
L=\max(0,1-0.3)=0.7.
$$

Case 3:

$$
yz=(-1)(-1.2)=1.2.
$$

Since $1.2\ge1$,

$$
L=\max(0,1-1.2)=0.
$$

Case 4:

$$
yz=(-1)(0.7)=-0.7.
$$

This point is misclassified because $yz<0$:

$$
L=\max(0,1-(-0.7))=\max(0,1.7)=1.7.
$$

Therefore

$$
\begin{array}{c|c|c|c|c}
\text{case} & y & z & yz & L(z,y) \\
\hline
1 & +1 & 2.4 & 2.4 & 0 \\
2 & +1 & 0.3 & 0.3 & 0.7 \\
3 & -1 & -1.2 & 1.2 & 0 \\
4 & -1 & 0.7 & -0.7 & 1.7
\end{array}
$$

$$
\boxed{(0,\;0.7,\;0,\;1.7)}
$$

The hinge loss is zero only when the point is on the correct side with margin at least $1$.

---

#### E4. [coded] C controls soft-margin tolerance

Overlapping blobs cannot be perfectly separated by a clean margin. We fit several linear SVMs and watch how `C` changes the boundary, margin width, and support-vector count.

**Build step 1 — select overlapping data.**

```python
X_e4 = X_blobs_overlap.copy()  # Copy overlapping features to isolate this example.
y_e4 = y_blobs_overlap.copy()  # Copy overlapping labels to isolate this example.
C_values_e4 = [0.05, 0.5, 5.0, 50.0]  # Choose a sweep from tolerant to strict soft-margin penalties.
models_e4 = []  # Create an empty list that will store fitted SVMs.
```

**Build step 2 — fit one linear SVM for each C.**

```python
for C_value in C_values_e4:  # Loop over each soft-margin penalty.
    model = SVC(kernel="linear", C=C_value)  # Create a linear SVM with the current C value.
    model.fit(X_e4, y_e4)  # Fit the SVM to the overlapping data.
    models_e4.append(model)  # Store the fitted model for later plotting and comparison.
```

**Build step 3 — compute margin width and support-vector counts.**

```python
summary_e4 = []  # Create an empty list of numerical summaries.
for C_value, model in zip(C_values_e4, models_e4):  # Pair each C value with its fitted SVM.
    w = model.coef_[0]  # Extract the linear normal vector for this model.
    width = 2.0 / np.linalg.norm(w)  # Compute the canonical margin width.
    support_count = model.support_vectors_.shape[0]  # Count the support vectors for this model.
    accuracy = accuracy_score(y_e4, model.predict(X_e4))  # Compute training accuracy for this C value.
    summary_e4.append((C_value, width, support_count, accuracy))  # Store all summary quantities in one tuple.
for row in summary_e4:  # Loop over summary rows for readable printing.
    print(f"C={row[0]:>5}: margin_width={row[1]:.3f}, support_vectors={row[2]:>3}, accuracy={row[3]:.3f}")  # Print a compact comparison row.
```

**Result visualization.**

```python
fig, axes = plt.subplots(2, 2, figsize=(12, 10))  # Create a two-by-two panel for four C values.
for ax, C_value, model in zip(axes.ravel(), C_values_e4, models_e4):  # Loop over panels, C values, and fitted models.
    plot_svm_2d(model, X_e4, y_e4, f"E4: linear SVM with C={C_value}", ax=ax)  # Draw the boundary and support vectors.
plt.tight_layout()  # Reduce overlapping labels between subplots.
plt.show()  # Render the C-sweep figure.
```

▶ What you'll see: small `C` gives a wider, more tolerant margin with many support vectors; large `C` shifts the boundary to reduce training errors and often narrows the margin.

👀 **Takeaway:** `C` is not a kernel parameter; it is the price of violating the margin.

---

#### E5. [pen-and-paper] Kernel dot product without explicit features

**Problem.** Let

$$
x=\begin{bmatrix}x_1\\x_2\end{bmatrix},
\qquad
z=\begin{bmatrix}z_1\\z_2\end{bmatrix},
$$

and define the feature map

$$
\phi(x)=\begin{bmatrix}x_1^2\\ \sqrt2 x_1x_2\\ x_2^2\end{bmatrix}.
$$

Show that $\phi(x)^T\phi(z)=(x^Tz)^2$. Then compute the kernel value for

$$
x=\begin{bmatrix}1\\2\end{bmatrix},
\qquad
z=\begin{bmatrix}3\\4\end{bmatrix}.
$$

**Hand solution.** Start from the explicit feature inner product:

$$
\phi(x)^T\phi(z)
=
\begin{bmatrix}x_1^2 & \sqrt2 x_1x_2 & x_2^2\end{bmatrix}
\begin{bmatrix}z_1^2\\ \sqrt2 z_1z_2\\ z_2^2\end{bmatrix}.
$$

Multiply component by component:

$$
\phi(x)^T\phi(z)
=x_1^2z_1^2+(\sqrt2 x_1x_2)(\sqrt2 z_1z_2)+x_2^2z_2^2.
$$

Since $\sqrt2\sqrt2=2$,

$$
\phi(x)^T\phi(z)
=x_1^2z_1^2+2x_1x_2z_1z_2+x_2^2z_2^2.
$$

Now compute the ordinary dot product:

$$
x^Tz=x_1z_1+x_2z_2.
$$

Squaring it gives

$$
(x^Tz)^2=(x_1z_1+x_2z_2)^2.
$$

Expanding:

$$
(x^Tz)^2=x_1^2z_1^2+2x_1z_1x_2z_2+x_2^2z_2^2.
$$

Because scalar multiplication commutes,

$$
2x_1z_1x_2z_2=2x_1x_2z_1z_2.
$$

Therefore

$$
\phi(x)^T\phi(z)=(x^Tz)^2.
$$

For the numerical vectors,

$$
x^Tz=(1)(3)+(2)(4)=3+8=11.
$$

Thus

$$
K(x,z)=\phi(x)^T\phi(z)=(x^Tz)^2=11^2=121.
$$

$$
\boxed{\phi(x)^T\phi(z)=(x^Tz)^2,\qquad K([1,2]^T,[3,4]^T)=121.}
$$

The kernel trick lets us compute this value using only $x^Tz$, without explicitly building $\phi(x)$ and $\phi(z)$.

---

### 🔴 Advanced

#### A1. [coded] Linear SVM failure on nonlinear rings

A line cannot separate concentric rings. This is an edge case where a linear SVM has the wrong hypothesis class.

**Build step 1 — select ring-shaped data and split it.**

```python
X_a1 = X_circles.copy()  # Copy the nonlinear ring features.
y_a1 = y_circles.copy()  # Copy the ring labels.
X_train_a1, X_test_a1, y_train_a1, y_test_a1 = train_test_split(X_a1, y_a1, test_size=0.35, random_state=SEED, stratify=y_a1)  # Make a stratified train/test split.
```

**Build step 2 — fit a linear SVM.**

```python
linear_a1 = SVC(kernel="linear", C=10.0)  # Create a linear SVM that can only draw a straight boundary.
linear_a1.fit(X_train_a1, y_train_a1)  # Fit the linear model to the training rings.
train_acc_a1 = accuracy_score(y_train_a1, linear_a1.predict(X_train_a1))  # Compute training accuracy for the linear model.
test_acc_a1 = accuracy_score(y_test_a1, linear_a1.predict(X_test_a1))  # Compute test accuracy for the linear model.
print(f"linear SVM train accuracy = {train_acc_a1:.3f}")  # Display train accuracy.
print(f"linear SVM test accuracy = {test_acc_a1:.3f}")  # Display test accuracy.
```

**Build step 3 — identify misclassified points.**

```python
pred_a1 = linear_a1.predict(X_a1)  # Predict all ring labels using the linear SVM.
wrong_a1 = pred_a1 != y_a1  # Mark every point whose predicted label differs from its true label.
print(f"misclassified points = {wrong_a1.sum()} out of {len(y_a1)}")  # Print the failure count.
```

**Result visualization.**

```python
ax = plot_svm_2d(linear_a1, X_a1, y_a1, "A1: linear SVM fails on concentric rings")  # Plot the linear boundary on all ring data.
ax.scatter(X_a1[wrong_a1, 0], X_a1[wrong_a1, 1], s=260, facecolors="none", edgecolors="purple", linewidths=2.5, label="misclassified")  # Circle misclassified points in purple.
ax.legend(loc="best")  # Refresh the legend to include the misclassification marker.
plt.show()  # Render the failure plot.
```

▶ What you'll see: a straight line cuts the circular data poorly, leaving large arcs misclassified.

👀 **Takeaway:** margin maximization helps only within the chosen feature geometry; a linear separator cannot solve a circular separation problem.

---

#### A2. [coded] RBF kernel fixes nonlinear separation

The RBF kernel measures local similarity, allowing the SVM to form a curved boundary in the original input space.

**Build step 1 — fit a linear SVM and an RBF SVM on the same rings.**

```python
linear_a2 = SVC(kernel="linear", C=10.0)  # Create a straight-line baseline model.
rbf_a2 = SVC(kernel="rbf", C=10.0, gamma=2.0)  # Create an RBF-kernel SVM with a moderately local kernel.
linear_a2.fit(X_train_a1, y_train_a1)  # Fit the linear baseline on the ring training data.
rbf_a2.fit(X_train_a1, y_train_a1)  # Fit the nonlinear RBF model on the same training data.
```

**Build step 2 — compare train/test accuracy.**

```python
for name, model in [("linear", linear_a2), ("RBF", rbf_a2)]:  # Loop over both fitted models.
    train_acc = accuracy_score(y_train_a1, model.predict(X_train_a1))  # Compute training accuracy for this model.
    test_acc = accuracy_score(y_test_a1, model.predict(X_test_a1))  # Compute test accuracy for this model.
    support_count = model.support_vectors_.shape[0]  # Count support vectors for this model.
    print(f"{name:>6} SVM: train={train_acc:.3f}, test={test_acc:.3f}, support_vectors={support_count}")  # Print a model comparison row.
```

**Result visualization.**

```python
fig, axes = plt.subplots(1, 2, figsize=(13, 5))  # Create side-by-side panels for linear and RBF models.
plot_svm_2d(linear_a2, X_a1, y_a1, "A2: linear kernel", ax=axes[0])  # Plot the linear SVM boundary and support vectors.
plot_svm_2d(rbf_a2, X_a1, y_a1, "A2: RBF kernel", ax=axes[1])  # Plot the curved RBF boundary and support vectors.
plt.tight_layout()  # Adjust subplot spacing.
plt.show()  # Render the linear-vs-RBF comparison.
```

▶ What you'll see: the RBF panel draws a circular-ish boundary that follows the ring structure, while the linear panel remains a poor straight cut.

👀 **Takeaway:** the kernel trick changes inner products, effectively changing what “linear separation” means in a transformed feature space.

---

#### A3. [coded] Gamma/sigma controls boundary smoothness

For the RBF kernel,

$$
K(x,z)=\exp(-\gamma\|x-z\|^2)=\exp\left(-\frac{\|x-z\|^2}{2\sigma^2}\right),
$$

so $\gamma=1/(2\sigma^2)$. Low `gamma` means broad influence and smoother boundaries; high `gamma` means local influence and possible overfitting.

**Build step 1 — select moon-shaped data.**

```python
X_a3 = X_moons.copy()  # Copy the nonlinear moon features.
y_a3 = y_moons.copy()  # Copy the moon labels.
gamma_values_a3 = [0.2, 2.0, 25.0]  # Choose low, medium, and high RBF gamma values.
models_a3 = []  # Create an empty list to hold fitted RBF SVMs.
```

**Build step 2 — fit an RBF SVM for each gamma.**

```python
for gamma_value in gamma_values_a3:  # Loop over candidate gamma values.
    model = SVC(kernel="rbf", C=10.0, gamma=gamma_value)  # Create an RBF SVM with fixed C and current gamma.
    model.fit(X_a3, y_a3)  # Fit the model to the moon data.
    models_a3.append(model)  # Store the fitted model.
```

**Build step 3 — compare accuracy and support-vector counts.**

```python
for gamma_value, model in zip(gamma_values_a3, models_a3):  # Pair each gamma value with its model.
    accuracy = accuracy_score(y_a3, model.predict(X_a3))  # Compute training accuracy for this gamma.
    support_count = model.support_vectors_.shape[0]  # Count support vectors for this gamma.
    sigma = 1.0 / np.sqrt(2.0 * gamma_value)  # Convert gamma to the equivalent Gaussian sigma.
    print(f"gamma={gamma_value:>5}: sigma={sigma:.3f}, accuracy={accuracy:.3f}, support_vectors={support_count}")  # Print the comparison row.
```

**Result visualization.**

```python
fig, axes = plt.subplots(1, 3, figsize=(16, 4.8))  # Create three panels for the gamma sweep.
for ax, gamma_value, model in zip(axes, gamma_values_a3, models_a3):  # Loop over axes, gamma values, and models.
    plot_svm_2d(model, X_a3, y_a3, f"A3: RBF gamma={gamma_value}", ax=ax)  # Plot the RBF boundary and support vectors.
plt.tight_layout()  # Improve spacing between panels.
plt.show()  # Render the gamma comparison.
```

▶ What you'll see: low `gamma` underfits with a broad, smooth boundary; medium `gamma` follows the moon shape; high `gamma` may wrap tightly around individual points.

👀 **Takeaway:** `gamma` controls locality, while `C` controls violation cost; both affect overfitting.

---

#### A4. [coded] Hinge vs logistic loss shape and training behavior

Hinge loss and logistic loss both penalize wrong classifications, but hinge loss becomes exactly zero once $yz\ge1$, while logistic loss keeps shrinking smoothly.

**Build step 1 — plot loss as a function of margin.**

```python
margins_a4 = np.linspace(-3.0, 4.0, 400)  # Create a range of signed margins yz.
hinge_values_a4 = np.maximum(0.0, 1.0 - margins_a4)  # Compute hinge loss max(0, 1 - yz).
logistic_values_a4 = np.logaddexp(0.0, -margins_a4)  # Compute logistic loss log(1 + exp(-yz)) stably.
plt.figure(figsize=(7, 5))  # Create a loss-curve figure.
plt.plot(margins_a4, hinge_values_a4, label="hinge loss")  # Draw hinge loss against margin.
plt.plot(margins_a4, logistic_values_a4, label="logistic loss")  # Draw logistic loss against margin.
plt.axvline(1.0, color="black", linestyle="--", linewidth=1.2, label="SVM margin yz=1")  # Mark the hinge-loss zero threshold.
plt.xlabel("margin yz")  # Label the horizontal margin axis.
plt.ylabel("loss")  # Label the vertical loss axis.
plt.title("A4: hinge loss vs logistic loss")  # Title the loss comparison.
plt.legend()  # Show the loss legend.
plt.show()  # Render the loss curves.
```

▶ What you'll see: hinge loss is a broken line that hits zero at margin $1$; logistic loss is smooth and positive for every finite margin.

**Build step 2 — fit SVM and logistic-like linear classifiers for comparison.**

```python
X_a4 = X_blobs_overlap.copy()  # Reuse overlapping blobs for a realistic soft-margin comparison.
y_a4 = y_blobs_overlap.copy()  # Reuse labels in {-1,+1} form.
svm_a4 = LinearSVC(C=1.0, loss="hinge", max_iter=20000, random_state=SEED)  # Create a linear SVM trained with hinge loss.
logistic_like_a4 = make_pipeline(StandardScaler(), SVC(kernel="linear", C=1.0, probability=True))  # Create a linear SVC with probabilities for log-loss comparison.
svm_a4.fit(X_a4, y_a4)  # Fit the hinge-loss linear SVM.
logistic_like_a4.fit(X_a4, y_a4)  # Fit the probability-enabled linear SVC baseline.
```

**Build step 3 — compare empirical losses and accuracy.**

```python
svm_scores_a4 = svm_a4.decision_function(X_a4)  # Compute signed margins from the hinge-trained linear SVM.
svc_probs_a4 = logistic_like_a4.predict_proba(X_a4)  # Compute class probabilities from the probability-enabled SVC.
svm_hinge_a4 = hinge_loss(y_a4, svm_scores_a4)  # Compute average hinge loss for the hinge-trained SVM.
svc_log_a4 = log_loss(y_a4, svc_probs_a4, labels=[-1, 1])  # Compute log loss for the probability-enabled baseline.
svm_acc_a4 = accuracy_score(y_a4, svm_a4.predict(X_a4))  # Compute training accuracy for the hinge-trained SVM.
svc_acc_a4 = accuracy_score(y_a4, logistic_like_a4.predict(X_a4))  # Compute training accuracy for the probability-enabled baseline.
print(f"LinearSVC hinge loss = {svm_hinge_a4:.3f}, accuracy = {svm_acc_a4:.3f}")  # Print hinge-model performance.
print(f"Probability SVC log loss = {svc_log_a4:.3f}, accuracy = {svc_acc_a4:.3f}")  # Print probability-model performance.
```

**Result visualization.**

```python
svm_plot_a4 = SVC(kernel="linear", C=1.0)  # Create a plottable linear SVC with support_vectors_ exposed.
svm_plot_a4.fit(X_a4, y_a4)  # Fit the plottable model to the same data.
plot_svm_2d(svm_plot_a4, X_a4, y_a4, "A4: hinge-trained linear margin geometry")  # Plot the margin geometry of a linear SVM.
plt.show()  # Render the SVM geometry plot.
```

▶ What you'll see: the geometry plot resembles E4 with a compromise boundary through overlapping data, while the loss plot explains why points beyond the margin stop contributing hinge penalty.

👀 **Takeaway:** hinge loss is margin-focused and sparse in its active penalties; logistic loss keeps rewarding increasingly confident correct predictions.

---

#### A5. [pen-and-paper] Lagrangian/KKT intuition for support vectors

**Problem.** Consider four points in $\mathbb{R}^2$:

$$
x_1=(1,0),\; y_1=+1,
\qquad
x_2=(2,0),\; y_2=+1,
$$

$$
x_3=(-1,0),\; y_3=-1,
\qquad
x_4=(-2,0),\; y_4=-1.
$$

A candidate hard-margin separator is

$$
w=\begin{bmatrix}1\\0\end{bmatrix},
\qquad b=0,
\qquad w^Tx-b=x_1.
$$

Use the KKT complementary-slackness condition to identify which points can have nonzero Lagrange multipliers. Then find one valid set of multipliers $\alpha_i$ satisfying

$$
w=\sum_{i=1}^4 \alpha_i y_i x_i.
$$

**Hand solution.** First compute each constraint value

$$
y_i(w^Tx_i-b).
$$

For $x_1=(1,0)$:

$$
y_1(w^Tx_1-b)=(+1)(1)=1.
$$

For $x_2=(2,0)$:

$$
y_2(w^Tx_2-b)=(+1)(2)=2.
$$

For $x_3=(-1,0)$:

$$
y_3(w^Tx_3-b)=(-1)(-1)=1.
$$

For $x_4=(-2,0)$:

$$
y_4(w^Tx_4-b)=(-1)(-2)=2.
$$

The hard-margin constraints are all satisfied because every value is at least $1$.

Complementary slackness says

$$
\alpha_i\left[y_i(w^Tx_i-b)-1\right]=0.
$$

For $i=2$ and $i=4$, the bracket is

$$
y_i(w^Tx_i-b)-1=2-1=1.
$$

Thus

$$
\alpha_2(1)=0
\quad\Rightarrow\quad
\alpha_2=0,
$$

and

$$
\alpha_4(1)=0
\quad\Rightarrow\quad
\alpha_4=0.
$$

For $i=1$ and $i=3$, the bracket is

$$
y_i(w^Tx_i-b)-1=1-1=0.
$$

Complementary slackness imposes no requirement that $\alpha_1$ or $\alpha_3$ be zero. These points lie exactly on the margin and can be support vectors.

Now enforce stationarity:

$$
w=\sum_{i=1}^4 \alpha_i y_i x_i.
$$

Substitute $\alpha_2=\alpha_4=0$:

$$
w=\alpha_1(+1)(1,0)+\alpha_3(-1)(-1,0).
$$

Since

$$
(-1)(-1,0)=(1,0),
$$

we get

$$
w=(\alpha_1+\alpha_3)(1,0).
$$

But $w=(1,0)$, so

$$
\alpha_1+\alpha_3=1.
$$

Any nonnegative pair satisfying this equation works. A symmetric choice is

$$
\alpha_1=\frac12,
\qquad
\alpha_3=\frac12.
$$

Therefore one valid multiplier vector is

$$
\alpha=\left(\frac12,0,\frac12,0\right).
$$

$$
\boxed{x_1=(1,0)\text{ and }x_3=(-1,0)\text{ are support vectors; }\alpha=(1/2,0,1/2,0)\text{ is valid.}}
$$

This example shows why non-support vectors vanish from the dual prediction: their constraints are slack, so their multipliers must be zero.

---

### Interactive Experiment

Use the sliders to vary `C`, `kernel`, and `gamma`. For the linear kernel, `gamma` is ignored; for the RBF kernel, `gamma` controls locality.

```python
X_exp = X_moons.copy()  # Use moons because they reveal both linear failure and RBF success.
y_exp = y_moons.copy()  # Use the corresponding {-1,+1} moon labels.


@interact(C=FloatLogSlider(value=1.0, base=10.0, min=-2.0, max=2.0, step=0.25, description="C"), kernel=Dropdown(options=["linear", "rbf"], value="rbf", description="kernel"), gamma=FloatLogSlider(value=2.0, base=10.0, min=-2.0, max=2.0, step=0.25, description="gamma"))  # Create interactive controls.
def live_svm(C, kernel, gamma):  # Define the function that reruns whenever a widget changes.
    if kernel == "linear":  # Check whether the selected model is linear.
        model = SVC(kernel="linear", C=C)  # Build a linear SVM that ignores gamma.
    else:  # Handle the nonlinear RBF case.
        model = SVC(kernel="rbf", C=C, gamma=gamma)  # Build an RBF SVM with the selected C and gamma.
    model.fit(X_exp, y_exp)  # Fit the selected model to the moon data.
    accuracy = accuracy_score(y_exp, model.predict(X_exp))  # Compute training accuracy for immediate feedback.
    support_count = model.support_vectors_.shape[0]  # Count support vectors for immediate feedback.
    title = f"Interactive SVM: kernel={kernel}, C={C:.3g}, gamma={gamma:.3g}, acc={accuracy:.3f}, SV={support_count}"  # Build an informative plot title.
    plot_svm_2d(model, X_exp, y_exp, title)  # Draw the current decision boundary, margins, and support vectors.
    plt.show()  # Render the updated plot.
```

▶ What you'll see: increasing `C` usually reduces tolerance for margin violations; switching to RBF lets the boundary bend; increasing `gamma` makes the RBF boundary more local and potentially more jagged.

👀 **Takeaway:** useful SVM tuning is two-dimensional: choose the geometry (`kernel`, `gamma`) and then tune violation tolerance (`C`).

---
