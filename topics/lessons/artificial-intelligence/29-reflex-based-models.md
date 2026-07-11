# Reflex-based Models: Predictors & Loss
> **Source:** CS 221 · **Category:** Model/Concept · **Type:** ⚖️ Both · [↑ Full reference](../../ai-ml-cheatsheets.md)
> 📓 The coded examples form a runnable notebook section; an .ipynb will be generated.

## ✍️ Toy Examples

These tiny reflex-model toys isolate the core computations before the full worked example: build feature vectors, score them with a linear predictor, turn scores into margins and losses, update weights with a hinge-style rule, and see how feature choices change the boundary.

### ✍️ Toy 1 · Feature vectors and weighted score contributions

A reflex predictor first maps raw inputs into feature vectors. The linear score is just each feature times its weight, then summed.

```python
import numpy as np
import matplotlib.pyplot as plt

t1_rng = np.random.default_rng(0)  # -> reproducible generator seeded with 0
t1_raw = np.array([[0.0, 1.0], [1.0, 0.0], [2.0, 1.0], [3.0, 1.0], [1.0, 3.0], [2.0, 2.0]])  # -> six raw 2-D examples
t1_bias = np.ones((t1_raw.shape[0], 1))  # -> [[1.0], [1.0], [1.0], [1.0], [1.0], [1.0]]
t1_features = np.hstack([t1_bias, t1_raw])  # -> [[1.0, 0.0, 1.0], [1.0, 1.0, 0.0], [1.0, 2.0, 1.0], [1.0, 3.0, 1.0], [1.0, 1.0, 3.0], [1.0, 2.0, 2.0]]
t1_weights = np.array([-1.0, 0.8, 0.5])  # -> bias weight -1.0, x1 weight 0.8, x2 weight 0.5
t1_contributions = t1_features * t1_weights  # -> [[-1.0, 0.0, 0.5], [-1.0, 0.8, 0.0], [-1.0, 1.6, 0.5], [-1.0, 2.4, 0.5], [-1.0, 0.8, 1.5], [-1.0, 1.6, 1.0]]
t1_scores = t1_contributions.sum(axis=1)  # -> [-0.5, -0.2, 1.1, 1.9, 1.3, 1.6]
print("rng seed:", 0)
print("raw inputs:", t1_raw.tolist())
print("bias column:", t1_bias.ravel().tolist())
print("feature vectors phi(x):", t1_features.tolist())
print("weights w:", t1_weights.tolist())
print("feature contributions:", np.round(t1_contributions, 3).tolist())
print("linear scores:", np.round(t1_scores, 3).tolist())
assert np.allclose(t1_scores, [-0.5, -0.2, 1.1, 1.9, 1.3, 1.6])

t1_index = np.arange(len(t1_scores))  # -> [0, 1, 2, 3, 4, 5]
t1_fig, t1_ax = plt.subplots(figsize=(6, 3.5))
t1_ax.bar(t1_index, t1_scores, color=np.where(t1_scores >= 0.0, "seagreen", "salmon"), edgecolor="black")
t1_ax.axhline(0.0, color="black", linewidth=1)
t1_ax.set_title("Linear score = sum of feature contributions")
t1_ax.set_xlabel("example index")
t1_ax.set_ylabel("score")
plt.show()
```
▶ What you'll see: the first two examples have negative scores, while the later feature vectors accumulate enough positive evidence to cross zero.

### ✍️ Toy 2 · Linear classification margins and losses

For labels in {-1, +1}, the score sign gives the prediction and the margin y·score tells the loss how confident that prediction is.

```python
import numpy as np
import matplotlib.pyplot as plt

t2_rng = np.random.default_rng(0)  # -> reproducible generator seeded with 0
t2_points = np.array([[-2.0, -1.0], [-1.0, 0.0], [-0.5, 0.2], [0.5, 0.5], [1.0, 1.0], [2.0, 0.5]])  # -> six 2-D inputs
t2_labels = np.array([-1, -1, -1, 1, 1, 1])  # -> true classes
t2_features = np.column_stack([np.ones(len(t2_points)), t2_points])  # -> add a bias feature to every point
t2_weights = np.array([-0.2, 1.0, 0.8])  # -> [bias, x1, x2] weights
t2_scores = t2_features @ t2_weights  # -> [-3.0, -1.2, -0.54, 0.7, 1.6, 2.2]
t2_predictions = np.where(t2_scores >= 0.0, 1, -1)  # -> [-1, -1, -1, 1, 1, 1]
t2_margins = t2_labels * t2_scores  # -> [3.0, 1.2, 0.54, 0.7, 1.6, 2.2]
t2_zero_one = (t2_margins <= 0.0).astype(float)  # -> [0.0, 0.0, 0.0, 0.0, 0.0, 0.0]
t2_hinge = np.maximum(1.0 - t2_margins, 0.0)  # -> [0.0, 0.0, 0.46, 0.3, 0.0, 0.0]
t2_logistic = np.log1p(np.exp(-t2_margins))  # -> [0.049, 0.263, 0.459, 0.403, 0.184, 0.105]
print("rng seed:", 0)
print("points:", t2_points.tolist())
print("labels:", t2_labels.tolist())
print("features:", t2_features.tolist())
print("weights:", t2_weights.tolist())
print("scores:", np.round(t2_scores, 3).tolist())
print("predictions:", t2_predictions.tolist())
print("margins y*s:", np.round(t2_margins, 3).tolist())
print("zero-one losses:", t2_zero_one.tolist())
print("hinge losses:", np.round(t2_hinge, 3).tolist())
print("logistic losses:", np.round(t2_logistic, 3).tolist())
assert np.array_equal(t2_predictions, t2_labels)
assert np.allclose(np.round(t2_hinge, 2), [0.0, 0.0, 0.46, 0.3, 0.0, 0.0])

t2_grid = np.linspace(-0.2, 2.4, 100)  # -> 100 margins for smooth loss curves
t2_hinge_grid = np.maximum(1.0 - t2_grid, 0.0)  # -> hinge curve values
t2_logistic_grid = np.log1p(np.exp(-t2_grid))  # -> logistic curve values
t2_fig, t2_ax = plt.subplots(figsize=(6, 3.5))
t2_ax.plot(t2_grid, t2_hinge_grid, label="hinge")
t2_ax.plot(t2_grid, t2_logistic_grid, label="logistic")
t2_ax.scatter(t2_margins, t2_hinge, color="black", zorder=3, label="toy margins")
t2_ax.axvline(1.0, color="gray", linestyle="--")
t2_ax.set_title("Loss depends on margin, not raw score alone")
t2_ax.set_xlabel("margin y·score")
t2_ax.set_ylabel("loss")
t2_ax.legend()
plt.show()
```
▶ What you'll see: all signs are correct, but hinge loss still penalizes the two examples whose margins are below 1.

### ✍️ Toy 3 · Perceptron mask versus hinge update

A perceptron update fires only on mistakes, while hinge loss also updates correct-but-low-margin examples. This toy shows the hinge gradient moving the weights even when every sign is correct.

```python
import numpy as np
import matplotlib.pyplot as plt

t3_rng = np.random.default_rng(0)  # -> reproducible generator seeded with 0
t3_points = np.array([[-2.0, -1.0], [-1.0, -1.0], [-1.0, 0.0], [1.0, 0.0], [1.0, 1.0], [2.0, 1.0]])  # -> six labeled inputs
t3_labels = np.array([-1, -1, -1, 1, 1, 1])  # -> three negatives then three positives
t3_features = np.column_stack([np.ones(len(t3_points)), t3_points])  # -> bias plus two raw features
t3_weights = np.array([0.0, 0.2, 0.1])  # -> a small separating weight vector
t3_scores = t3_features @ t3_weights  # -> [-0.5, -0.3, -0.2, 0.2, 0.3, 0.5]
t3_margins = t3_labels * t3_scores  # -> [0.5, 0.3, 0.2, 0.2, 0.3, 0.5]
t3_perceptron_mask = (t3_margins <= 0.0).astype(float)  # -> [0.0, 0.0, 0.0, 0.0, 0.0, 0.0]
t3_hinge_mask = (t3_margins < 1.0).astype(float)  # -> [1.0, 1.0, 1.0, 1.0, 1.0, 1.0]
t3_weighted_labels = t3_labels * t3_hinge_mask  # -> [-1.0, -1.0, -1.0, 1.0, 1.0, 1.0]
t3_gradient = -(t3_features.T @ t3_weighted_labels) / len(t3_labels)  # -> [-0.0, -1.333, -0.667]
t3_eta = 0.5  # -> hinge-update learning rate
t3_new_weights = t3_weights - t3_eta * t3_gradient  # -> [0.0, 0.867, 0.433]
print("rng seed:", 0)
print("points:", t3_points.tolist())
print("labels:", t3_labels.tolist())
print("features:", t3_features.tolist())
print("old weights:", t3_weights.tolist())
print("scores:", np.round(t3_scores, 3).tolist())
print("margins:", np.round(t3_margins, 3).tolist())
print("perceptron mistake mask:", t3_perceptron_mask.tolist())
print("hinge active mask:", t3_hinge_mask.tolist())
print("labels times hinge mask:", t3_weighted_labels.tolist())
print("hinge gradient:", np.round(t3_gradient, 3).tolist())
print("new weights:", np.round(t3_new_weights, 3).tolist())
assert np.all(t3_perceptron_mask == 0.0)
assert np.allclose(t3_new_weights, [0.0, 0.8666666667, 0.4333333333])

t3_index = np.arange(len(t3_margins))  # -> [0, 1, 2, 3, 4, 5]
t3_fig, t3_ax = plt.subplots(figsize=(6, 3.5))
t3_ax.bar(t3_index, t3_margins, color="gold", edgecolor="black")
t3_ax.axhline(0.0, color="black", linewidth=1, label="perceptron threshold")
t3_ax.axhline(1.0, color="purple", linestyle="--", label="hinge comfort margin")
t3_ax.set_title("Correct signs can still be inside the hinge band")
t3_ax.set_xlabel("example index")
t3_ax.set_ylabel("margin")
t3_ax.legend()
plt.show()
```
▶ What you'll see: every margin is positive, so perceptron makes no move, but hinge updates all six low-margin examples.

### ✍️ Toy 4 · Linear regression residuals and average loss

For regression, the same dot product becomes a numeric prediction. Residuals drive squared and absolute losses.

```python
import numpy as np
import matplotlib.pyplot as plt

t4_rng = np.random.default_rng(0)  # -> reproducible generator seeded with 0
t4_x = np.array([0.0, 1.0, 2.0, 3.0, 4.0, 5.0])  # -> six scalar inputs
t4_y = np.array([0.2, 1.0, 2.1, 2.8, 3.7, 4.4])  # -> six regression targets
t4_features = np.column_stack([np.ones(len(t4_x)), t4_x])  # -> [[1.0, 0.0], ..., [1.0, 5.0]]
t4_weights = np.array([0.5, 0.8])  # -> intercept 0.5 and slope 0.8
t4_predictions = t4_features @ t4_weights  # -> [0.5, 1.3, 2.1, 2.9, 3.7, 4.5]
t4_residuals = t4_predictions - t4_y  # -> [0.3, 0.3, 0.0, 0.1, 0.0, 0.1]
t4_squared_losses = t4_residuals ** 2  # -> [0.09, 0.09, 0.0, 0.01, 0.0, 0.01]
t4_absolute_losses = np.abs(t4_residuals)  # -> [0.3, 0.3, 0.0, 0.1, 0.0, 0.1]
t4_mse = t4_squared_losses.mean()  # -> 0.033
t4_mae = t4_absolute_losses.mean()  # -> 0.133
print("rng seed:", 0)
print("x:", t4_x.tolist())
print("targets y:", t4_y.tolist())
print("features:", t4_features.tolist())
print("weights:", t4_weights.tolist())
print("predictions:", np.round(t4_predictions, 3).tolist())
print("residuals:", np.round(t4_residuals, 3).tolist())
print("squared losses:", np.round(t4_squared_losses, 3).tolist())
print("absolute losses:", np.round(t4_absolute_losses, 3).tolist())
print("mean squared loss:", round(float(t4_mse), 3))
print("mean absolute loss:", round(float(t4_mae), 3))
assert np.isclose(t4_mse, 1.0 / 30.0)
assert np.isclose(t4_mae, 0.13333333333333336)

t4_fig, t4_ax = plt.subplots(figsize=(6, 3.5))
t4_ax.scatter(t4_x, t4_y, color="steelblue", label="targets")
t4_ax.plot(t4_x, t4_predictions, color="black", label="linear predictor")
for t4_xi, t4_yi, t4_pi in zip(t4_x, t4_y, t4_predictions):
    t4_ax.plot([t4_xi, t4_xi], [t4_yi, t4_pi], color="salmon")
t4_ax.set_title("Residuals are vertical prediction errors")
t4_ax.set_xlabel("x")
t4_ax.set_ylabel("target / prediction")
t4_ax.legend()
plt.show()
```
▶ What you'll see: small vertical residual segments, with MSE about 0.033 and MAE about 0.133.

### ✍️ Toy 5 · Nonlinear feature vector, linear score, curved boundary

A model can stay linear in its feature vector while drawing a nonlinear boundary in raw input space by adding a radius-squared feature.

```python
import numpy as np
import matplotlib.pyplot as plt

t5_rng = np.random.default_rng(0)  # -> reproducible generator seeded with 0
t5_points = np.array([[-0.4, 0.0], [0.3, 0.2], [0.0, -0.5], [1.1, 0.0], [0.0, 1.2], [-1.0, -0.8]])  # -> six 2-D points
t5_labels = np.array([-1, -1, -1, 1, 1, 1])  # -> inner points negative, outer points positive
t5_radius_squared = np.sum(t5_points ** 2, axis=1)  # -> [0.16, 0.13, 0.25, 1.21, 1.44, 1.64]
t5_features = np.column_stack([np.ones(len(t5_points)), t5_points, t5_radius_squared])  # -> [1, x1, x2, r^2]
t5_weights = np.array([-0.5, 0.0, 0.0, 1.0])  # -> score = r^2 - 0.5
t5_scores = t5_features @ t5_weights  # -> [-0.34, -0.37, -0.25, 0.71, 0.94, 1.14]
t5_predictions = np.where(t5_scores >= 0.0, 1, -1)  # -> [-1, -1, -1, 1, 1, 1]
print("rng seed:", 0)
print("points:", t5_points.tolist())
print("labels:", t5_labels.tolist())
print("radius squared:", np.round(t5_radius_squared, 3).tolist())
print("features [1,x1,x2,r^2]:", np.round(t5_features, 3).tolist())
print("weights:", t5_weights.tolist())
print("scores:", np.round(t5_scores, 3).tolist())
print("predictions:", t5_predictions.tolist())
assert np.array_equal(t5_predictions, t5_labels)
assert np.allclose(np.round(t5_scores, 2), [-0.34, -0.37, -0.25, 0.71, 0.94, 1.14])

t5_fig, t5_ax = plt.subplots(figsize=(4.5, 4.5))
t5_ax.scatter(t5_points[:, 0], t5_points[:, 1], c=t5_predictions, cmap="bwr", s=90, edgecolor="black")
t5_circle = plt.Circle((0.0, 0.0), np.sqrt(0.5), fill=False, color="black", linestyle="--")
t5_ax.add_patch(t5_circle)
t5_ax.set_aspect("equal")
t5_ax.set_title("Linear in [1, x1, x2, r²] gives a circle")
t5_ax.set_xlabel("x1")
t5_ax.set_ylabel("x2")
plt.show()
```
▶ What you'll see: the linear score in radial-feature space separates inner and outer points with a circular boundary.


## 0. Step-by-Step Worked Example — Start Here (Beginner Friendly)

> 🧑‍🎓 **New to this topic? Start here.** This is a gentle, fully runnable walkthrough that
> builds up *every* idea in this lesson one tiny step at a time. Each step **prints** the
> numbers it computes and **draws a picture** so you can *see* what is happening. Run the
> cells in order from top to bottom. Nothing here needs the internet or any downloaded data.

### The Big Picture — What You'll Learn

In plain terms, here is what the steps below will show you:

- **Features and scores** break one dot product into visible weighted contributions.
- **Linear classification** uses score signs, a zero-score boundary, and margins.
- **Classification losses** show how zero-one, hinge, and logistic losses penalize margins differently.
- **Linear regression** reuses the same score as a numeric prediction and measures residual losses.
- **Training loss** averages example losses to compare candidate weights.
- **Linear versus non-linear predictors** show that non-linear features, kNN votes, and neural activations add flexible boundaries.

Everything below (starting at **§1 Overview**) develops these same ideas with full derivations,
more examples, and an interactive experiment.

**What we will build, step by step:**
1. **Features and scores** — turn raw inputs into numbers, weight them, and add contributions.
2. **Linear classification** — use the score sign, boundary, and margin for two classes.
3. **Classification losses** — compare zero-one, hinge, and logistic penalties by margin.
4. **Linear regression** — use the same score as a real-valued prediction and inspect residuals.
5. **Training loss** — average per-example losses to choose better weights.
6. **Linear versus non-linear predictors** — see how non-linear features, kNN, and neural units add flexibility.

### Step 0 — Set up our tools

We import NumPy (arrays + math) and Matplotlib (pictures). We fix a random **seed** so every
run gives the same printed numbers, then define a tiny `log()` helper for clearly labeled output.

```python
import numpy as np                       # NumPy: arrays, dot products, and tiny synthetic datasets.
import matplotlib.pyplot as plt          # Matplotlib: visual checks for scores, boundaries, and losses.

np.random.seed(0)                         # Fix the seed so every run prints the same numbers.
plt.rcParams["figure.figsize"] = (7, 4)   # Use a comfortable default plot size.


def log(label, value):                    # Define one small logger used in every worked-example cell.
    print(f"[{label}] {value}")           # Print each value with a readable label.

log("setup", "tools ready — NumPy + Matplotlib imported, seed fixed to 0")  # Confirm setup finished.
```
▶ What you'll see: one line confirming the tools are ready.

### Step 1 — Features and scores: weighted evidence

A reflex model first turns an input into a feature vector $\phi(x)$, then multiplies each feature by a weight.
The score $s=w\cdot\phi(x)$ is just the sum of those feature contributions, so we print every piece before adding.

```python
feature_names_demo = np.array(["bias", "likes", "recent", "has_question"])  # Name each feature in phi(x).
features_demo = np.array([1.0, 0.8, 0.4, 1.0])                                # Store one synthetic input as features.
weights_demo = np.array([-0.2, 1.1, 0.6, -0.5])                                # Store learned weights for those features.
contributions_demo = weights_demo * features_demo                              # Multiply feature by weight term-by-term.
score_demo = contributions_demo.sum()                                          # Add contributions to get s(x,w).
colors_demo = np.where(contributions_demo >= 0, "seagreen", "salmon")         # Color positive pushes green and negative pushes red.

log("feature vector phi(x)", np.round(features_demo, 2))                       # Print the numeric feature vector.
log("weights w", np.round(weights_demo, 2))                                    # Print the matching weight vector.
log("feature contributions w_j phi_j", np.round(contributions_demo, 3))        # Print each term in the dot product.
log("score s = w dot phi", round(score_demo, 3))                               # Print the final score.

plt.bar(feature_names_demo, contributions_demo, color=colors_demo, edgecolor="black")  # Draw each contribution as a bar.
plt.axhline(0.0, color="black", linewidth=1)                                  # Mark zero so upward and downward pushes are visible.
plt.ylabel("contribution to score")                                            # Label the vertical axis.
plt.title("Features and scores: add the weighted evidence")                    # Title the plot with the concept.
plt.show()                                                                      # Render the contribution chart.
```
▶ What you'll see: green bars push the score up, red bars push it down, and the printed sum is the final score.

### Step 2 — Linear classification: sign, boundary, and margin

For binary labels $y\in\{-1,+1\}$, the sign of the score is the prediction. The boundary is where the
score equals zero, and the margin $m=y\,s$ says whether the labeled point is correct and how confidently.

```python
points_demo = np.array([[-2.0, -1.2], [-1.4, 0.2], [-0.3, -1.0], [0.4, 0.8], [1.2, 0.4], [1.8, 1.5]])  # Create tiny 2D inputs.
labels_demo = np.array([-1, -1, -1, 1, 1, 1])                                                           # Store true class labels.
weights_class_demo = np.array([-0.1, 1.0, 0.7])                                                          # Store [bias, x1 weight, x2 weight].
features_class_demo = np.column_stack([np.ones(len(points_demo)), points_demo])                          # Add a bias column to the points.
scores_class_demo = features_class_demo @ weights_class_demo                                             # Compute one linear score per point.
predictions_demo = np.where(scores_class_demo >= 0.0, 1, -1)                                             # Predict class by the sign of the score.
margins_demo = labels_demo * scores_class_demo                                                           # Compute margin y*s for each labeled point.
line_x_demo = np.linspace(-2.5, 2.5, 100)                                                                # Build x-values for the decision boundary.
line_y_demo = -(weights_class_demo[0] + weights_class_demo[1] * line_x_demo) / weights_class_demo[2]      # Solve w0+w1*x1+w2*x2=0 for x2.

log("scores", np.round(scores_class_demo, 3))                                                           # Print raw scores before taking signs.
log("predictions", predictions_demo)                                                                     # Print predicted classes.
log("margins y*s", np.round(margins_demo, 3))                                                            # Print margins for correctness/confidence.
log("all margins positive?", bool(np.all(margins_demo > 0)))                                             # Check whether every example is correctly classified.

plt.scatter(points_demo[:, 0], points_demo[:, 1], c=labels_demo, cmap="bwr", s=90, edgecolor="black")    # Plot the labeled points.
plt.plot(line_x_demo, line_y_demo, color="black", linestyle="--", label="score = 0 boundary")           # Draw the separating line.
plt.xlabel("feature x1")                                                                                 # Label the horizontal feature.
plt.ylabel("feature x2")                                                                                 # Label the vertical feature.
plt.title("Linear classification uses the sign of the score")                                            # Title the classification plot.
plt.legend()                                                                                              # Show the boundary label.
plt.show()                                                                                                # Render the boundary plot.
```
▶ What you'll see: the dashed line is the zero-score boundary, and positive printed margins mean correct predictions.

### Step 3 — Classification losses: three ways to punish margins

Loss functions translate a margin into a penalty. Zero-one loss only asks if the sign is wrong, hinge loss
also wants a margin of at least $1$, and logistic loss is smooth so optimization can follow a gradient.

```python
margin_grid_demo = np.linspace(-3.0, 3.0, 300)                                # Create margins from very wrong to very correct.
zero_one_demo = (margin_grid_demo <= 0.0).astype(float)                        # Zero-one loss is 1 for non-positive margin.
hinge_demo = np.maximum(1.0 - margin_grid_demo, 0.0)                           # Hinge loss is positive until margin reaches 1.
logistic_demo = np.log1p(np.exp(-margin_grid_demo))                            # Logistic loss smoothly shrinks as margin grows.
example_margins_demo = np.array([-1.0, 0.0, 0.5, 2.0])                         # Pick a few margins to inspect numerically.
example_losses_demo = np.column_stack([(example_margins_demo <= 0.0).astype(float), np.maximum(1.0 - example_margins_demo, 0.0), np.log1p(np.exp(-example_margins_demo))])  # Compute all three losses.

for margin_demo, losses_demo in zip(example_margins_demo, example_losses_demo):  # Loop through the example margins.
    log(f"m={margin_demo}: 0/1, hinge, logistic", np.round(losses_demo, 3))       # Print the three penalties side by side.

plt.plot(margin_grid_demo, zero_one_demo, label="zero-one")                    # Plot the discontinuous zero-one loss.
plt.plot(margin_grid_demo, hinge_demo, label="hinge")                          # Plot the piecewise-linear hinge loss.
plt.plot(margin_grid_demo, logistic_demo, label="logistic")                    # Plot the smooth logistic loss.
plt.axvline(0.0, color="black", linewidth=1, linestyle="--")                  # Mark the correctness threshold.
plt.axvline(1.0, color="gray", linewidth=1, linestyle=":")                   # Mark the hinge comfort margin.
plt.xlabel("margin m = y s")                                                   # Label the margin axis.
plt.ylabel("loss")                                                             # Label the loss axis.
plt.title("Classification losses reward larger positive margins")             # Title the loss comparison.
plt.legend()                                                                    # Show the loss names.
plt.show()                                                                      # Render the loss curves.
```
▶ What you'll see: all losses are high for negative margins, but hinge and logistic still care about small positive margins.

### Step 4 — Linear regression: scores become real-valued predictions

For regression, the same linear score is the prediction $\hat y$. The residual $\hat y-y$ measures the
vertical miss, and squared loss punishes large misses more strongly than absolute loss.

```python
x_reg_demo = np.linspace(0.0, 5.0, 8)                                           # Create one tiny one-dimensional dataset.
y_reg_demo = 1.0 + 0.7 * x_reg_demo + np.array([0.2, -0.3, 0.1, 0.4, -0.4, 0.0, 0.3, -0.2])  # Add small fixed noise to targets.
weights_reg_demo = np.array([0.8, 0.8])                                         # Store [bias, slope] for a candidate regressor.
features_reg_demo = np.column_stack([np.ones(len(x_reg_demo)), x_reg_demo])      # Build [1, x] features for every point.
preds_reg_demo = features_reg_demo @ weights_reg_demo                           # Compute predicted y-values from the score.
residuals_demo = preds_reg_demo - y_reg_demo                                    # Compute prediction minus target.
squared_losses_demo = residuals_demo ** 2                                       # Square residuals for squared loss.
absolute_losses_demo = np.abs(residuals_demo)                                   # Take absolute residuals for absolute loss.

log("predictions", np.round(preds_reg_demo, 2))                                 # Print predicted values.
log("residuals pred - y", np.round(residuals_demo, 2))                          # Print misses around the line.
log("mean squared loss", round(squared_losses_demo.mean(), 3))                  # Print average squared loss.
log("mean absolute loss", round(absolute_losses_demo.mean(), 3))                # Print average absolute loss.

plt.scatter(x_reg_demo, y_reg_demo, color="steelblue", label="targets")        # Plot the observed targets.
plt.plot(x_reg_demo, preds_reg_demo, color="black", label="linear prediction") # Plot the candidate line.
for x_value_demo, y_value_demo, pred_demo in zip(x_reg_demo, y_reg_demo, preds_reg_demo):  # Loop over points to draw residuals.
    plt.plot([x_value_demo, x_value_demo], [y_value_demo, pred_demo], color="salmon", alpha=0.8)  # Draw one vertical residual.
plt.xlabel("input x")                                                           # Label the input axis.
plt.ylabel("target or prediction")                                              # Label the output axis.
plt.title("Linear regression: residuals are vertical misses")                   # Title the regression plot.
plt.legend()                                                                     # Show target and line labels.
plt.show()                                                                       # Render the residual plot.
```
▶ What you'll see: red vertical segments are residuals, and the logs show squared vs. absolute penalties.

### Step 5 — Training loss: average many example losses

Training loss is the average loss over the dataset, not just one example. We compare three candidate
weight vectors by computing their average hinge loss, then pick the one with the smallest average.

```python
points_train_demo = np.array([[-1.5, -0.7], [-0.8, -0.6], [-0.4, 0.2], [0.4, 0.4], [0.9, 0.8], [1.5, 0.7]])  # Create a small training set.
labels_train_demo = np.array([-1, -1, -1, 1, 1, 1])                                                            # Store labels for the training set.
features_train_demo = np.column_stack([np.ones(len(points_train_demo)), points_train_demo])                    # Add a bias feature for each example.
candidate_names_demo = np.array(["bad", "okay", "good"])                                                     # Name three candidate models.
candidate_weights_demo = np.array([[0.0, -0.8, 0.2], [-0.1, 0.5, 0.4], [-0.1, 1.0, 0.7]])                      # Store three weight vectors.
scores_train_demo = features_train_demo @ candidate_weights_demo.T                                             # Compute scores for every example/model pair.
margins_train_demo = labels_train_demo[:, None] * scores_train_demo                                            # Convert scores to margins using labels.
hinge_train_demo = np.maximum(1.0 - margins_train_demo, 0.0)                                                   # Compute hinge loss per example/model.
train_losses_demo = hinge_train_demo.mean(axis=0)                                                              # Average losses over the dataset.
best_index_demo = int(np.argmin(train_losses_demo))                                                            # Find the lowest-loss candidate.

for name_demo, loss_demo in zip(candidate_names_demo, train_losses_demo):                                       # Loop over candidate names and losses.
    log(f"average hinge loss for {name_demo}", round(loss_demo, 3))                                           # Print each training loss.
log("chosen weights", candidate_names_demo[best_index_demo])                                                   # Print the candidate selected by training loss.

plt.bar(candidate_names_demo, train_losses_demo, color=["salmon", "gold", "seagreen"], edgecolor="black")    # Plot average training losses.
plt.ylabel("average hinge loss")                                                                              # Label the loss axis.
plt.title("Training chooses weights with smaller average loss")                                                # Title the training-loss plot.
plt.show()                                                                                                     # Render the bar chart.
```
▶ What you'll see: the best candidate has the smallest average hinge loss across all training examples.

### Step 6 — Linear versus non-linear predictors: feature choices change the shape

A predictor is linear in the features it receives, but those features can be non-linear functions of the raw input.
Adding $x_1^2+x_2^2$ lets a linear score draw a circle, while kNN and neural units are other non-linear alternatives.

```python
angles_demo = np.linspace(0.0, 2.0 * np.pi, 40, endpoint=False)                  # Create angles for a small circular dataset.
inner_demo = 0.45 * np.column_stack([np.cos(angles_demo[:20]), np.sin(angles_demo[:20])])  # Create inner-ring points.
outer_demo = 1.05 * np.column_stack([np.cos(angles_demo[20:]), np.sin(angles_demo[20:])])  # Create outer-ring points.
points_ring_demo = np.vstack([inner_demo, outer_demo])                           # Combine inner and outer points.
labels_ring_demo = np.r_[-np.ones(len(inner_demo)), np.ones(len(outer_demo))]     # Label inner as -1 and outer as +1.
linear_scores_demo = points_ring_demo @ np.array([1.0, 0.0])                     # Use a plain linear score based only on x1.
linear_preds_demo = np.where(linear_scores_demo >= 0.0, 1, -1)                   # Predict with the linear score sign.
radius_feature_demo = np.sum(points_ring_demo ** 2, axis=1)                      # Build the non-linear feature x1^2 + x2^2.
circle_scores_demo = -0.55 + radius_feature_demo                                 # Use a linear score in [1, radius^2] feature space.
circle_preds_demo = np.where(circle_scores_demo >= 0.0, 1, -1)                   # Predict from the circular score.
query_demo = np.array([0.75, 0.15])                                               # Pick one query point for a tiny kNN vote.
distances_demo = np.sqrt(np.sum((points_ring_demo - query_demo) ** 2, axis=1))    # Measure distances from the query to training points.
nearest_demo = np.argsort(distances_demo)[:3]                                     # Find the three closest neighbors.
knn_vote_demo = np.sign(labels_ring_demo[nearest_demo].sum())                     # Vote by summing the nearest labels.
neural_activation_demo = np.tanh(4.0 * (np.sum(query_demo ** 2) - 0.55))          # Compute one non-linear neural-style hidden activation.

log("linear accuracy", round(np.mean(linear_preds_demo == labels_ring_demo), 3))  # Print accuracy without the radial feature.
log("circular-feature accuracy", round(np.mean(circle_preds_demo == labels_ring_demo), 3))  # Print accuracy with x1^2+x2^2.
log("3-NN neighbor labels", labels_ring_demo[nearest_demo].astype(int))           # Print nearby labels used by kNN.
log("3-NN vote for query", int(knn_vote_demo))                                    # Print the kNN prediction.
log("one neural-style tanh activation", round(float(neural_activation_demo), 3))  # Print a smooth non-linear unit value.

fig_demo, axes_demo = plt.subplots(1, 2, figsize=(9, 4))                          # Create side-by-side plots.
axes_demo[0].scatter(points_ring_demo[:, 0], points_ring_demo[:, 1], c=linear_preds_demo, cmap="bwr", s=70, edgecolor="black")  # Plot plain-linear predictions.
axes_demo[0].axvline(0.0, color="black", linestyle="--")                        # Draw the vertical linear boundary.
axes_demo[0].set_title("plain linear features")                                  # Title the first panel.
axes_demo[1].scatter(points_ring_demo[:, 0], points_ring_demo[:, 1], c=circle_preds_demo, cmap="bwr", s=70, edgecolor="black")  # Plot circular-feature predictions.
axes_demo[1].add_patch(plt.Circle((0.0, 0.0), np.sqrt(0.55), fill=False, color="black", linestyle="--"))  # Draw the circular boundary.
axes_demo[1].scatter(query_demo[0], query_demo[1], marker="*", s=180, color="gold", edgecolor="black")  # Mark the kNN query point.
axes_demo[1].set_title("linear in non-linear features")                          # Title the second panel.
for ax_demo in axes_demo:                                                         # Loop over both panels.
    ax_demo.set_aspect("equal")                                                  # Use equal scaling so circles look round.
    ax_demo.set_xlabel("x1")                                                     # Label x1 on each panel.
    ax_demo.set_ylabel("x2")                                                     # Label x2 on each panel.
fig_demo.suptitle("Non-linear features can make non-linear boundaries")          # Add an overall title.
plt.tight_layout()                                                                # Keep subplot labels from overlapping.
plt.show()                                                                        # Render the comparison.
```
▶ What you'll see: a straight-line feature split fails on rings, while the radial feature draws the right circular boundary.

---

## 1. Overview

A **reflex-based model** predicts directly from the current input features, without explicitly planning over future states. In supervised learning language, it turns an input $x$ into a feature vector $\phi(x)$, scores that vector with weights $w$, and chooses or improves the weights by minimizing a loss.

**One-line intuition:** write down useful measurements of the input, take a weighted sum, and let the loss tell you whether the weighted sum is good enough.

This lesson connects four ideas that appear throughout machine learning and AI:

1. **Feature maps** decide what information the model can see.
2. **Scores** turn features into a numerical prediction signal.
3. **Margins/residuals** measure prediction quality for classification/regression.
4. **Loss functions** convert prediction quality into an objective we can minimize.

## 2. Key Idea

### Features and scores

A feature vector maps an input $x$ to a vector in $\mathbb{R}^d$:

$$
\phi(x)=\begin{bmatrix}
\phi_1(x)\\
\vdots\\
\phi_d(x)
\end{bmatrix}\in\mathbb{R}^d.
$$

A linear reflex predictor assigns weights

$$
w=\begin{bmatrix}w_1\\\vdots\\w_d\end{bmatrix}\in\mathbb{R}^d
$$

and computes the score

$$
s(x,w)=w\cdot\phi(x)=\sum_{j=1}^{d}w_j\phi_j(x).
$$

Each term $w_j\phi_j(x)$ is a **feature contribution**. Positive contributions push the score upward; negative contributions push it downward.

### Linear classification

For binary classification with labels $y\in\{-1,+1\}$, the linear classifier is

$$
f_w(x)=\operatorname{sign}(s(x,w))=
\begin{cases}
+1 & \text{if } w\cdot\phi(x)>0,\\
-1 & \text{if } w\cdot\phi(x)<0,\\
? & \text{if } w\cdot\phi(x)=0.
\end{cases}
$$

The **decision boundary** is the set of points whose score is zero:

$$
w\cdot\phi(x)=0.
$$

The **margin** of a labeled example is

$$
m(x,y,w)=y\,s(x,w).
$$

Interpretation:

- $m>0$: correct sign prediction.
- $m=0$: exactly on the boundary.
- $m<0$: wrong sign prediction.
- Larger positive $m$: correct with more confidence.

### Classification losses

For a classification example $(x,y)$, the zero-one, hinge, and logistic losses are

$$
\operatorname{Loss}_{0/1}(x,y,w)=\mathbf{1}_{\{m(x,y,w)\le 0\}},
$$

$$
\operatorname{Loss}_{\text{hinge}}(x,y,w)=\max(1-m(x,y,w),0),
$$

and

$$
\operatorname{Loss}_{\text{logistic}}(x,y,w)=\log(1+e^{-m(x,y,w)}).
$$

Zero-one loss asks only whether the sign is wrong. Hinge loss asks whether the margin is at least $1$. Logistic loss is smooth and keeps rewarding larger positive margins.

### Linear regression

For regression with real-valued labels $y\in\mathbb{R}$, the same score becomes the prediction:

$$
f_w(x)=s(x,w).
$$

The residual is the amount by which the prediction overshoots the target:

$$
\operatorname{res}(x,y,w)=f_w(x)-y=s(x,w)-y.
$$

Two common regression losses are

$$
\operatorname{Loss}_{\text{squared}}(x,y,w)=\bigl(\operatorname{res}(x,y,w)\bigr)^2
$$

and

$$
\operatorname{Loss}_{\text{absolute}}(x,y,w)=\left|\operatorname{res}(x,y,w)\right|.
$$

Squared loss penalizes large residuals very strongly; absolute loss is more robust to outliers.

### Training loss

A training dataset is

$$
\mathcal{D}_{\text{train}}=\{(x_i,y_i)\}_{i=1}^{n}.
$$

The empirical training loss is

$$
\operatorname{TrainLoss}(w)=\frac{1}{|\mathcal{D}_{\text{train}}|}
\sum_{(x,y)\in\mathcal{D}_{\text{train}}}\operatorname{Loss}(x,y,w).
$$

Training means choosing weights $w$ that make this average small.

### Linear versus non-linear predictors

A linear predictor is linear in its chosen features:

$$
s(x,w)=w\cdot\phi(x).
$$

It can still form non-linear boundaries in the original input space if $\phi(x)$ contains non-linear features. For example, for a two-dimensional input $x=(x_1,x_2)$,

$$
\phi(x)=\begin{bmatrix}1\\x_1\\x_2\\x_1^2+x_2^2\end{bmatrix}
$$

allows a linear score in feature space to draw a circular boundary in the original plane.

Non-linear alternatives include:

- **$k$-nearest neighbors:** predict from nearby training examples. Small $k$ gives high variance; large $k$ gives higher bias.
- **Neural networks:** stack learned non-linear feature transformations. For layer $i$ and hidden unit $j$,

$$
z_j^{(i)}=w_j^{(i)T}x+b_j^{(i)}.
$$

## 3. Worked Examples

### Setup

Run this block once before the coded examples. It imports the libraries, seeds randomness, and defines reusable helpers.

```python
import numpy as np  # Load NumPy for arrays, vectorized math, and deterministic random number generation.
import matplotlib.pyplot as plt  # Load Matplotlib for all visualizations in the lesson.
from math import ceil  # Load ceil so grid layouts can be sized from the number of panels.
np.random.seed(22129)  # Seed the legacy NumPy generator so examples are reproducible in simple notebooks.
rng = np.random.default_rng(22129)  # Create a modern reproducible random generator for synthetic data.
plt.rcParams["figure.figsize"] = (7, 5)  # Set a readable default figure size for notebook plots.
plt.rcParams["axes.grid"] = True  # Turn on light grids so scores, margins, and residuals are easier to read.
plt.rcParams["font.size"] = 11  # Use a medium font size that remains readable in Colab.
def add_bias(X):  # Define a helper that adds an intercept feature to a two-dimensional array.
    X = np.asarray(X, dtype=float)  # Convert the input to a floating NumPy array so arithmetic is predictable.
    ones = np.ones((X.shape[0], 1))  # Create one bias value per row of the design matrix.
    return np.hstack([ones, X])  # Concatenate the bias column before the original features.
def sign_with_zero(scores):  # Define a sign function that keeps zero separate from positive and negative signs.
    scores = np.asarray(scores, dtype=float)  # Convert scores to an array so comparisons work elementwise.
    signs = np.where(scores > 0, 1, np.where(scores < 0, -1, 0))  # Return +1, -1, or 0 according to the score.
    return signs  # Return the computed signs to the caller.
def zero_one_loss(margins):  # Define zero-one loss as a function of classification margins.
    margins = np.asarray(margins, dtype=float)  # Convert the margin input to a floating NumPy array.
    return (margins <= 0).astype(float)  # Penalize every example whose margin is not positive.
def hinge_loss(margins):  # Define hinge loss as a function of classification margins.
    margins = np.asarray(margins, dtype=float)  # Convert the margin input to a floating NumPy array.
    return np.maximum(1.0 - margins, 0.0)  # Penalize margins below one and give zero loss after that.
def logistic_loss(margins):  # Define logistic loss as a numerically stable function of margins.
    margins = np.asarray(margins, dtype=float)  # Convert the margin input to a floating NumPy array.
    return np.logaddexp(0.0, -margins)  # Compute log(1 + exp(-margin)) without overflow.
def squared_loss(residuals):  # Define squared regression loss as a function of residuals.
    residuals = np.asarray(residuals, dtype=float)  # Convert residuals to a floating NumPy array.
    return residuals ** 2  # Square each residual to penalize large errors strongly.
def absolute_loss(residuals):  # Define absolute regression loss as a function of residuals.
    residuals = np.asarray(residuals, dtype=float)  # Convert residuals to a floating NumPy array.
    return np.abs(residuals)  # Take absolute values to measure error size robustly.
def feature_raw(X):  # Define the raw feature map phi(x) = (1, x1, x2).
    return add_bias(X)  # Add a bias feature to the original two coordinates.
def feature_radial(X):  # Define the radial feature map phi(x) = (1, x1, x2, x1^2 + x2^2).
    X = np.asarray(X, dtype=float)  # Convert the input points to a floating NumPy array.
    r2 = np.sum(X ** 2, axis=1, keepdims=True)  # Compute squared radius for each point.
    return np.hstack([np.ones((X.shape[0], 1)), X, r2])  # Return bias, raw coordinates, and squared radius.
def predict_scores(X, w, feature_fn=feature_raw):  # Define a score helper for any feature map and weight vector.
    Phi = feature_fn(X)  # Transform raw inputs into feature vectors.
    return Phi @ w  # Multiply features by weights to produce one score per example.
def accuracy_from_scores(X, y, w, feature_fn=feature_raw):  # Define an accuracy helper for binary scores.
    scores = predict_scores(X, w, feature_fn)  # Compute scores from the requested feature map.
    preds = np.where(scores >= 0, 1, -1)  # Convert scores to labels using zero as the boundary.
    return np.mean(preds == y)  # Return the fraction of labels predicted correctly.
def make_blobs_data(n_per_class=40, spread=0.55):  # Define a simple linearly separable blob dataset generator.
    neg = rng.normal(loc=(-1.2, -0.9), scale=spread, size=(n_per_class, 2))  # Sample negative-class points near the lower-left center.
    pos = rng.normal(loc=(1.1, 1.0), scale=spread, size=(n_per_class, 2))  # Sample positive-class points near the upper-right center.
    X = np.vstack([neg, pos])  # Stack negative and positive points into one matrix.
    y = np.hstack([-np.ones(n_per_class), np.ones(n_per_class)])  # Build labels with -1 for the first class and +1 for the second.
    return X, y  # Return features and labels.
def make_circles_data(n=160, noise=0.07):  # Define a concentric-circle dataset without relying on scikit-learn.
    half = n // 2  # Split the dataset evenly between inner and outer rings.
    angles_inner = rng.uniform(0.0, 2.0 * np.pi, half)  # Sample angles for inner-ring points.
    angles_outer = rng.uniform(0.0, 2.0 * np.pi, n - half)  # Sample angles for outer-ring points.
    inner_radius = 0.65 + rng.normal(0.0, noise, half)  # Add small radial noise to the inner ring.
    outer_radius = 1.35 + rng.normal(0.0, noise, n - half)  # Add small radial noise to the outer ring.
    inner = np.c_[inner_radius * np.cos(angles_inner), inner_radius * np.sin(angles_inner)]  # Convert inner polar coordinates to Cartesian coordinates.
    outer = np.c_[outer_radius * np.cos(angles_outer), outer_radius * np.sin(angles_outer)]  # Convert outer polar coordinates to Cartesian coordinates.
    X = np.vstack([inner, outer])  # Stack both rings into one feature matrix.
    y = np.hstack([np.ones(half), -np.ones(n - half)])  # Label the inner ring +1 and the outer ring -1.
    return X, y  # Return circle features and labels.
def make_moons_data(n=180, noise=0.12):  # Define a two-moons dataset without relying on scikit-learn.
    half = n // 2  # Split the dataset into two equally sized crescent arcs.
    t1 = rng.uniform(0.0, np.pi, half)  # Sample angles along the upper moon.
    t2 = rng.uniform(0.0, np.pi, n - half)  # Sample angles along the lower moon.
    moon1 = np.c_[np.cos(t1), np.sin(t1)]  # Convert upper-moon angles to coordinates.
    moon2 = np.c_[1.0 - np.cos(t2), -np.sin(t2) - 0.45]  # Convert lower-moon angles to shifted coordinates.
    X = np.vstack([moon1, moon2])  # Stack both moon-shaped classes into one matrix.
    X = X + rng.normal(0.0, noise, X.shape)  # Add isotropic noise so the task is realistic.
    y = np.hstack([np.ones(half), -np.ones(n - half)])  # Label the upper moon +1 and lower moon -1.
    return X, y  # Return moon features and labels.
def train_linear_classifier(X, y, loss_type="logistic", feature_fn=feature_raw, lr=0.1, steps=800, reg=0.001):  # Train a linear classifier by gradient descent.
    Phi = feature_fn(X)  # Build the design matrix from the chosen feature map.
    w = np.zeros(Phi.shape[1])  # Initialize all weights at zero for a neutral starting score.
    history = []  # Store loss values so we can plot optimization progress.
    for step in range(steps):  # Repeat gradient updates for a fixed number of steps.
        scores = Phi @ w  # Compute the current score for every training example.
        margins = y * scores  # Convert scores into signed margins using the true labels.
        if loss_type == "hinge":  # Choose the subgradient for hinge loss when requested.
            active = (margins < 1.0).astype(float)  # Mark examples still inside the hinge-loss margin band.
            grad = -(Phi.T @ (y * active)) / len(y) + reg * w  # Average the hinge subgradient and add L2 regularization.
            loss = np.mean(hinge_loss(margins)) + 0.5 * reg * np.sum(w ** 2)  # Compute regularized hinge objective value.
        else:  # Use logistic loss for every non-hinge request.
            coeff = -y / (1.0 + np.exp(margins))  # Compute d log(1+exp(-m)) / d score for each example.
            grad = (Phi.T @ coeff) / len(y) + reg * w  # Average the logistic gradient and add L2 regularization.
            loss = np.mean(logistic_loss(margins)) + 0.5 * reg * np.sum(w ** 2)  # Compute regularized logistic objective value.
        w = w - lr * grad  # Move weights in the negative-gradient direction.
        if step % 20 == 0 or step == steps - 1:  # Record enough points for a smooth but compact learning curve.
            history.append(loss)  # Save the current objective value.
    return w, np.array(history)  # Return trained weights and the recorded loss history.
def knn_predict(X_train, y_train, X_query, k=3):  # Predict labels using k-nearest neighbors with Euclidean distance.
    distances = np.sqrt(((X_query[:, None, :] - X_train[None, :, :]) ** 2).sum(axis=2))  # Compute all query-to-training distances.
    nearest = np.argsort(distances, axis=1)[:, :k]  # Keep the indices of the k closest training points for each query.
    votes = y_train[nearest].sum(axis=1)  # Sum labels among neighbors so positive sums vote +1 and negative sums vote -1.
    return np.where(votes >= 0, 1, -1)  # Break ties toward +1 and return predicted labels.
def plot_boundary(ax, X, y, score_fn, title, grid_steps=180):  # Plot a two-dimensional decision region from a score or label function.
    x_min, x_max = X[:, 0].min() - 0.6, X[:, 0].max() + 0.6  # Expand the horizontal plotting range beyond the data.
    y_min, y_max = X[:, 1].min() - 0.6, X[:, 1].max() + 0.6  # Expand the vertical plotting range beyond the data.
    xx, yy = np.meshgrid(np.linspace(x_min, x_max, grid_steps), np.linspace(y_min, y_max, grid_steps))  # Build a rectangular grid of evaluation points.
    grid = np.c_[xx.ravel(), yy.ravel()]  # Flatten the grid into a list of coordinate pairs.
    values = score_fn(grid).reshape(xx.shape)  # Evaluate the supplied function and reshape back to grid form.
    ax.contourf(xx, yy, values, levels=[-1e9, 0, 1e9], alpha=0.18, colors=["tab:red", "tab:blue"])  # Shade negative and positive decision regions.
    ax.contour(xx, yy, values, levels=[0], colors="black", linewidths=2)  # Draw the zero-score decision boundary.
    ax.scatter(X[y < 0, 0], X[y < 0, 1], c="tab:red", edgecolor="k", label="y=-1")  # Plot negative examples in red.
    ax.scatter(X[y > 0, 0], X[y > 0, 1], c="tab:blue", edgecolor="k", label="y=+1")  # Plot positive examples in blue.
    ax.set_title(title)  # Add the requested panel title.
    ax.set_xlabel("x1")  # Label the horizontal input coordinate.
    ax.set_ylabel("x2")  # Label the vertical input coordinate.
    ax.legend(loc="best")  # Show a legend so labels are identifiable.
def fit_regression_squared(X_design, y):  # Fit squared-loss linear regression by the normal equation.
    return np.linalg.pinv(X_design.T @ X_design) @ X_design.T @ y  # Use the pseudoinverse for numerical stability.
def fit_regression_absolute_gd(X_design, y, lr=0.03, steps=2500):  # Fit absolute-loss linear regression by subgradient descent.
    w = np.zeros(X_design.shape[1])  # Initialize regression weights at zero.
    for step in range(steps):  # Take a fixed number of subgradient steps.
        residuals = X_design @ w - y  # Compute current prediction errors.
        grad = X_design.T @ np.sign(residuals) / len(y)  # Average the subgradient of absolute loss.
        w = w - lr * grad  # Update weights in the downhill direction.
    return w  # Return the robust absolute-loss fit.
def train_tiny_nn(X, y, hidden=12, lr=0.05, steps=2500):  # Train a one-hidden-layer tanh neural network for binary classification.
    W1 = rng.normal(0.0, 0.8, size=(2, hidden))  # Initialize input-to-hidden weights with small random values.
    b1 = np.zeros(hidden)  # Initialize hidden-layer biases at zero.
    W2 = rng.normal(0.0, 0.8, size=hidden)  # Initialize hidden-to-output weights with small random values.
    b2 = 0.0  # Initialize the output bias at zero.
    y01 = (y > 0).astype(float)  # Convert labels from {-1,+1} into {0,1} for logistic output training.
    for step in range(steps):  # Run gradient descent for a fixed number of iterations.
        Z1 = X @ W1 + b1  # Compute hidden-layer preactivations z = Wx + b.
        H = np.tanh(Z1)  # Apply tanh nonlinearity to create curved features.
        logits = H @ W2 + b2  # Compute output logits from hidden features.
        probs = 1.0 / (1.0 + np.exp(-logits))  # Convert logits to probabilities with the sigmoid function.
        dlogits = (probs - y01) / len(y)  # Compute the averaged derivative of binary cross-entropy.
        grad_W2 = H.T @ dlogits  # Backpropagate to output weights.
        grad_b2 = dlogits.sum()  # Backpropagate to the output bias.
        dH = dlogits[:, None] * W2[None, :]  # Send output-layer error into hidden activations.
        dZ1 = dH * (1.0 - H ** 2)  # Multiply by the tanh derivative to get hidden preactivation gradients.
        grad_W1 = X.T @ dZ1  # Backpropagate to input-to-hidden weights.
        grad_b1 = dZ1.sum(axis=0)  # Backpropagate to hidden biases.
        W2 = W2 - lr * grad_W2  # Update output weights.
        b2 = b2 - lr * grad_b2  # Update output bias.
        W1 = W1 - lr * grad_W1  # Update hidden weights.
        b1 = b1 - lr * grad_b1  # Update hidden biases.
    return W1, b1, W2, b2  # Return all trained neural-network parameters.
def nn_scores(X, params):  # Compute signed neural-network scores from trained parameters.
    W1, b1, W2, b2 = params  # Unpack the trained network parameters.
    H = np.tanh(X @ W1 + b1)  # Recompute the hidden tanh features.
    return H @ W2 + b2  # Return output logits as classification scores.
```


### 📖 Concept walkthrough — build each idea from scratch

Before the warm-up examples, we build every reflex-model idea from scratch, one small step at a time. Everything here uses only NumPy + Matplotlib and tiny inline data, so every feature, score, loss, and fitted line is inspectable. Variables carry a `_w` suffix so they never collide with the examples below.

```python
import numpy as np  # NumPy gives us arrays, dot products, feature maps, and small least-squares solves.
import matplotlib.pyplot as plt  # Matplotlib lets us see scores, boundaries, losses, residuals, and feature-map effects.
np.random.seed(0)  # fix randomness so every printed value and figure is reproducible.
```

#### 1. Features and scores: turn raw inputs into useful measurements

A reflex model does not score the raw object directly; it first maps $x$ into features $\phi(x)$ that expose useful measurements. Then a linear score $s=w\cdot\phi(x)$ adds weighted feature contributions, so the sign or size of the score becomes the prediction signal. We build a tiny polynomial feature map because it shows why features matter: a linear score in feature space can still curve as the raw input changes.

```python
x_raw_w = np.array([-2.0, -1.0, 0.0, 1.0, 2.0])  # choose five one-dimensional raw inputs small enough to inspect.
Phi_score_w = np.column_stack([np.ones_like(x_raw_w), x_raw_w, x_raw_w ** 2])  # build phi(x)=[1,x,x^2] for every input.
w_score_w = np.array([-0.5, 1.2, 0.4])  # choose weights for bias, linear trend, and quadratic curvature.
print("raw x:", x_raw_w)  # inspect the inputs before feature engineering.
print("phi(x) rows:\n", Phi_score_w)  # inspect the feature vectors the model actually sees.
```
▶ What you'll see: each scalar input becomes a three-number feature vector with a bias, raw value, and squared value.

```python
contrib_score_w = Phi_score_w * w_score_w  # compute each feature's separate weighted contribution.
score_score_w = Phi_score_w @ w_score_w  # add contributions with w dot phi(x) to get one score per input.
print("feature contributions:\n", np.round(contrib_score_w, 2))  # inspect which features push scores up or down.
print("scores:", np.round(score_score_w, 2))  # inspect the final weighted sums.
```
The dot product is shorthand for adding aligned contributions:

$$
w\cdot\phi(x)=\sum_j w_j\phi_j(x).
$$

This matters because the model is still linear in $\phi(x)$, but $\phi(x)$ itself can contain non-linear measurements such as $x^2$.
▶ What you'll see: negative and positive feature contributions combine into one scalar score for each input.

```python
x_grid_score_w = np.linspace(-3.0, 3.0, 200)  # sample many raw inputs so the score curve is smooth.
Phi_grid_score_w = np.column_stack([np.ones_like(x_grid_score_w), x_grid_score_w, x_grid_score_w ** 2])  # map each grid input to phi(x).
score_grid_score_w = Phi_grid_score_w @ w_score_w  # compute w dot phi(x) across the grid.
plt.figure(figsize=(5.5, 3.8))  # create a compact score plot.
plt.plot(x_grid_score_w, score_grid_score_w, lw=2, c="purple", label="score")  # draw how the score changes with raw x.
plt.scatter(x_raw_w, score_score_w, c="black", zorder=3, label="tiny data")  # mark the inspectable inputs from above.
plt.axhline(0.0, c="gray", ls="--", label="score = 0")  # show the sign-changing threshold.
plt.xlabel("raw input x")  # label the raw input axis.
plt.ylabel(r"score $w\cdot\phi(x)$")  # label the weighted-sum axis.
plt.legend(loc="best")  # show curve and point meanings.
plt.title("1: feature map makes a curved score")  # title the concept figure.
plt.show()  # render the score curve.
```
▶ What you'll see: a curved score as a function of raw $x$, even though the model is linear in the chosen features.

*Why it's done this way: features decide what patterns the weighted sum can express. Adding $x^2$ gives a linear model one controlled non-linear measurement without changing the simple score formula.*

#### 2. Linear classification: predict from the sign of the score

Binary linear classification uses the score sign: predict $+1$ when $w\cdot\phi(x)>0$ and $-1$ when it is below zero. The decision boundary is where the score is exactly zero, and the margin $y\,w\cdot\phi(x)$ says whether the true label is on the correct side and how confidently. We use raw 2-D features plus a bias so the boundary is a line we can draw by hand.

```python
X_class_w = np.array([[-2.0, -1.0], [-1.5, 0.2], [-0.8, -1.2], [0.8, 1.1], [1.4, 0.4], [2.0, 1.6]])  # create six small 2-D examples.
y_class_w = np.array([-1, -1, -1, 1, 1, 1])  # assign negative labels to the left group and positive labels to the right group.
Phi_class_w = np.column_stack([np.ones(X_class_w.shape[0]), X_class_w])  # build phi(x)=[1,x1,x2] with a bias column.
w_class_w = np.array([-0.1, 1.0, 0.8])  # choose a linear separator in feature space.
print("points:\n", X_class_w)  # inspect the raw coordinates.
print("weights:", w_class_w)  # inspect the bias and two feature weights.
```
▶ What you'll see: two small point groups and one chosen separating weight vector.

```python
score_class_w = Phi_class_w @ w_class_w  # compute one score for every point.
pred_class_w = np.where(score_class_w >= 0.0, 1, -1)  # classify by the sign of the score.
margin_class_w = y_class_w * score_class_w  # compute labeled margins y times score.
print("scores:", np.round(score_class_w, 3))  # inspect signed distances in score units.
print("predictions:", pred_class_w)  # inspect the predicted labels.
print("margins:", np.round(margin_class_w, 3))  # inspect correctness and confidence at once.
```
A positive margin means the score sign matches the label; a negative margin means the sign is wrong. Larger positive margins are safer because the point can move farther before crossing the zero-score boundary.
▶ What you'll see: correctly classified points have positive margins, with larger numbers farther from the boundary in score units.

```python
x_line_class_w = np.linspace(-2.5, 2.5, 200)  # create x1 coordinates for the boundary line.
y_line_class_w = -(w_class_w[0] + w_class_w[1] * x_line_class_w) / w_class_w[2]  # solve w0+w1*x1+w2*x2=0 for x2.
plt.figure(figsize=(5.5, 4.2))  # create the classification geometry figure.
plt.scatter(X_class_w[y_class_w == -1, 0], X_class_w[y_class_w == -1, 1], c="tab:red", edgecolors="k", s=75, label="y=-1")  # draw negative examples.
plt.scatter(X_class_w[y_class_w == 1, 0], X_class_w[y_class_w == 1, 1], c="tab:blue", edgecolors="k", s=75, label="y=+1")  # draw positive examples.
plt.plot(x_line_class_w, y_line_class_w, c="black", lw=2, label="score = 0")  # draw the decision boundary.
plt.xlim(-2.6, 2.6)  # keep the horizontal view around the tiny data.
plt.ylim(-2.0, 2.2)  # keep the vertical view around the tiny data.
plt.xlabel("x1")  # label the first raw feature.
plt.ylabel("x2")  # label the second raw feature.
plt.legend(loc="best")  # show class and boundary meanings.
plt.title("2: linear classification by score sign")  # title the concept figure.
plt.show()  # render the boundary plot.
```
▶ What you'll see: a straight zero-score line separating the negative and positive points.

*Why it's done this way: a single score gives both a class decision and a confidence-like margin. Drawing the zero-score set makes the abstract sign rule visible as a boundary in input space.*

#### 3. Classification losses: penalize wrong or not-confident-enough scores

For labels $y\in\{-1,+1\}$, both hinge and logistic loss depend on the margin $m=y\cdot\text{score}$. Hinge loss is $\max(0,1-m)$, which becomes exactly zero after margin 1; logistic loss is $\log(1+e^{-m})$, which is smooth and keeps shrinking as margin grows. We compare them over the same score range because both punish confident-wrong predictions most strongly, but they differ in whether they stop charging confident-correct examples.

```python
score_loss_w = np.linspace(-4.0, 4.0, 9)  # choose inspectable raw scores for a positive-labeled example.
y_loss_w = 1.0  # use y=+1 so the margin equals the score for this first table.
margin_loss_w = y_loss_w * score_loss_w  # compute y times score.
hinge_loss_w = np.maximum(0.0, 1.0 - margin_loss_w)  # compute max(0,1-margin) pointwise.
logistic_loss_w = np.logaddexp(0.0, -margin_loss_w)  # compute log(1+exp(-margin)) stably.
print("scores:", np.round(score_loss_w, 2))  # inspect the score grid.
print("hinge:", np.round(hinge_loss_w, 3))  # inspect hinge penalties.
print("logistic:", np.round(logistic_loss_w, 3))  # inspect logistic penalties.
```
▶ What you'll see: large negative scores create large losses, while large positive scores create small losses.

```python
example_scores_loss_w = np.array([-2.0, 0.4, 1.8])  # choose one wrong, one correct-but-small, and one confident-correct score.
example_labels_loss_w = np.array([1.0, 1.0, 1.0])  # keep labels positive so cases are easy to read.
example_margins_loss_w = example_labels_loss_w * example_scores_loss_w  # compute margins for the examples.
example_hinge_loss_w = np.maximum(0.0, 1.0 - example_margins_loss_w)  # compute hinge losses.
example_logistic_loss_w = np.logaddexp(0.0, -example_margins_loss_w)  # compute logistic losses.
print("example margins:", example_margins_loss_w)  # inspect the three cases.
print("example hinge/logistic:\n", np.round(np.column_stack([example_hinge_loss_w, example_logistic_loss_w]), 3))  # compare both losses side by side.
```
The margin, not the raw score alone, is what matters: a score of $-2$ is good for label $-1$ but bad for label $+1$. Multiplying by $y$ turns "good for my class" into positive numbers for both classes.
▶ What you'll see: confident-wrong has the biggest penalty, while hinge gives zero to the margin-1-or-better point.

```python
margin_grid_loss_w = np.linspace(-4.0, 4.0, 300)  # create a smooth margin range.
hinge_grid_loss_w = np.maximum(0.0, 1.0 - margin_grid_loss_w)  # evaluate hinge loss on the grid.
logistic_grid_loss_w = np.logaddexp(0.0, -margin_grid_loss_w)  # evaluate logistic loss on the grid.
plt.figure(figsize=(5.5, 3.8))  # create the loss comparison figure.
plt.plot(margin_grid_loss_w, hinge_grid_loss_w, lw=2, label="hinge")  # draw the piecewise-linear hinge curve.
plt.plot(margin_grid_loss_w, logistic_grid_loss_w, lw=2, label="logistic")  # draw the smooth logistic curve.
plt.axvline(0.0, c="gray", ls=":", label="decision boundary")  # mark wrong versus correct sign.
plt.axvline(1.0, c="gray", ls="--", label="hinge zero point")  # mark the hinge margin threshold.
plt.xlabel(r"margin $y\cdot\mathrm{score}$")  # label the margin axis.
plt.ylabel("loss")  # label the loss axis.
plt.legend(loc="best")  # show curve meanings.
plt.title("3: hinge and logistic loss vs margin")  # title the concept figure.
plt.show()  # render the loss plot.
```
▶ What you'll see: both losses are high for negative margins; hinge becomes flat at margin 1, while logistic decays smoothly.

*Why it's done this way: zero-one correctness is too abrupt to optimize directly, so hinge and logistic provide usable penalties. They focus training on examples that are wrong or not confidently right, with hinge emphasizing a margin threshold and logistic giving a smooth gradient everywhere.*

#### 4. Linear regression and training loss: fit weights by shrinking residuals

For regression, the same score becomes a numeric prediction instead of a class sign. A linear model with features $\phi(x)=[1,x]$ predicts $\hat y=w\cdot\phi(x)$, and squared training loss averages the squared residuals $\hat y-y$. We fit the line by the least-squares normal equation because it is the direct from-scratch solution for minimizing squared residuals on a tiny design matrix.

```python
x_reg_w = np.array([-2.0, -1.0, 0.0, 1.0, 2.0, 3.0])  # create six one-dimensional training inputs.
y_reg_w = np.array([-1.1, 0.1, 0.9, 2.2, 2.8, 4.1])  # create noisy targets that roughly follow a line.
Phi_reg_w = np.column_stack([np.ones_like(x_reg_w), x_reg_w])  # build phi(x)=[1,x] for intercept and slope.
print("design matrix:\n", Phi_reg_w)  # inspect the regression features.
print("targets:", y_reg_w)  # inspect the numeric labels.
```
▶ What you'll see: each input has a bias feature and one raw coordinate, paired with a real-valued target.

```python
w_reg_w = np.linalg.pinv(Phi_reg_w.T @ Phi_reg_w) @ Phi_reg_w.T @ y_reg_w  # solve the least-squares normal equation.
y_hat_reg_w = Phi_reg_w @ w_reg_w  # compute fitted predictions on the training inputs.
resid_reg_w = y_hat_reg_w - y_reg_w  # compute residuals as prediction minus target.
mean_loss_reg_w = np.mean(resid_reg_w ** 2)  # average squared residuals to get training loss.
print("fitted weights [intercept, slope]:", np.round(w_reg_w, 3))  # inspect the learned line.
print("residuals:", np.round(resid_reg_w, 3))  # inspect the remaining errors.
print("mean squared training loss:", round(mean_loss_reg_w, 4))  # inspect the objective value.
```
The normal equation comes from setting the gradient of squared loss to zero. Squaring residuals makes positive and negative errors both count, and it penalizes large misses more than small ones.
▶ What you'll see: a fitted intercept and slope, plus residuals whose squares average to the printed training loss.

```python
x_grid_reg_w = np.linspace(-2.4, 3.4, 200)  # create a smooth x-range for the fitted line.
Phi_grid_reg_w = np.column_stack([np.ones_like(x_grid_reg_w), x_grid_reg_w])  # build design rows for the grid.
y_grid_reg_w = Phi_grid_reg_w @ w_reg_w  # compute line predictions across the grid.
plt.figure(figsize=(5.8, 4.0))  # create the regression figure.
plt.scatter(x_reg_w, y_reg_w, c="black", s=70, label="data")  # draw observed training points.
plt.plot(x_grid_reg_w, y_grid_reg_w, c="tab:green", lw=2, label="least-squares fit")  # draw the fitted line.
plt.vlines(x_reg_w, y_reg_w, y_hat_reg_w, colors="crimson", linestyles="--", label="residuals")  # draw vertical prediction errors.
plt.xlabel("x")  # label the input axis.
plt.ylabel("y")  # label the target axis.
plt.legend(loc="best")  # show data, line, and residual meanings.
plt.title("4: linear regression fit and residuals")  # title the concept figure.
plt.show()  # render the regression plot.
```
▶ What you'll see: the line balances the points, and dashed vertical segments show the residuals being squared in the loss.

*Why it's done this way: squared loss turns fitting into a smooth average-error objective with a closed-form solution for linear features. Plotting residuals shows exactly what the training loss is averaging.*

#### 5. Linear versus non-linear predictors: change the feature map to change the boundary

A predictor is linear in its chosen features, not necessarily linear in the original raw input. XOR-like data cannot be separated by one raw-input line, but the product feature $x_1x_2$ makes the class pattern visible to a linear score. We compare a raw linear attempt with a quadratic-style feature map to show that feature maps buy non-linear power while keeping the score formula $w\cdot\phi(x)$.

```python
X_xor_w = np.array([[-1.0, -1.0], [-1.0, 1.0], [1.0, -1.0], [1.0, 1.0]])  # create the four XOR corners.
y_xor_w = np.array([1, -1, -1, 1])  # label same-sign corners positive and opposite-sign corners negative.
Phi_linear_xor_w = np.column_stack([np.ones(X_xor_w.shape[0]), X_xor_w])  # build raw linear features [1,x1,x2].
w_linear_xor_w = np.linalg.pinv(Phi_linear_xor_w) @ y_xor_w  # find the least-squares linear classifier scores.
score_linear_xor_w = Phi_linear_xor_w @ w_linear_xor_w  # compute raw-linear scores.
pred_linear_xor_w = np.where(score_linear_xor_w >= 0.0, 1, -1)  # convert scores to labels.
print("raw-linear weights:", np.round(w_linear_xor_w, 3))  # inspect the best raw linear weights.
print("raw-linear predictions:", pred_linear_xor_w)  # inspect the failed signs.
```
▶ What you'll see: the raw linear model collapses toward zero scores and cannot get all four XOR labels right.

```python
Phi_quad_xor_w = np.column_stack([np.ones(X_xor_w.shape[0]), X_xor_w, X_xor_w[:, 0] * X_xor_w[:, 1]])  # add the interaction feature x1*x2.
w_quad_xor_w = np.linalg.pinv(Phi_quad_xor_w) @ y_xor_w  # fit a linear score in the expanded feature space.
score_quad_xor_w = Phi_quad_xor_w @ w_quad_xor_w  # compute expanded-feature scores.
pred_quad_xor_w = np.where(score_quad_xor_w >= 0.0, 1, -1)  # convert expanded scores to labels.
print("expanded weights [bias,x1,x2,x1*x2]:", np.round(w_quad_xor_w, 3))  # inspect the learned interaction rule.
print("expanded predictions:", pred_quad_xor_w)  # inspect that the XOR signs are now correct.
```
The feature $x_1x_2$ is positive in the same-sign quadrants and negative in the opposite-sign quadrants. A linear score on that feature can therefore draw a nonlinear boundary in the original $(x_1,x_2)$ plane.
▶ What you'll see: the expanded feature map separates the four points because the interaction feature matches the XOR pattern.

```python
grid_axis_xor_w = np.linspace(-1.6, 1.6, 180)  # create grid coordinates for both boundary plots.
xx_xor_w, yy_xor_w = np.meshgrid(grid_axis_xor_w, grid_axis_xor_w)  # build a square input grid.
grid_xor_w = np.c_[xx_xor_w.ravel(), yy_xor_w.ravel()]  # flatten the grid into two-column raw inputs.
Phi_grid_linear_xor_w = np.column_stack([np.ones(grid_xor_w.shape[0]), grid_xor_w])  # build raw linear grid features.
Phi_grid_quad_xor_w = np.column_stack([np.ones(grid_xor_w.shape[0]), grid_xor_w, grid_xor_w[:, 0] * grid_xor_w[:, 1]])  # build expanded grid features.
score_grid_linear_xor_w = (Phi_grid_linear_xor_w @ w_linear_xor_w).reshape(xx_xor_w.shape)  # reshape raw-linear scores for contouring.
score_grid_quad_xor_w = (Phi_grid_quad_xor_w @ w_quad_xor_w).reshape(xx_xor_w.shape)  # reshape expanded-feature scores for contouring.
fig_xor_w, ax_xor_w = plt.subplots(1, 2, figsize=(8.5, 3.8))  # create side-by-side comparison axes.
ax_xor_w[0].contourf(xx_xor_w, yy_xor_w, score_grid_linear_xor_w, levels=[-10.0, 0.0, 10.0], colors=["tab:red", "tab:blue"], alpha=0.18)  # shade raw-linear regions.
ax_xor_w[0].contour(xx_xor_w, yy_xor_w, score_grid_linear_xor_w, levels=[0.0], colors="black")  # draw raw-linear boundary.
ax_xor_w[1].contourf(xx_xor_w, yy_xor_w, score_grid_quad_xor_w, levels=[-10.0, 0.0, 10.0], colors=["tab:red", "tab:blue"], alpha=0.18)  # shade expanded-feature regions.
ax_xor_w[1].contour(xx_xor_w, yy_xor_w, score_grid_quad_xor_w, levels=[0.0], colors="black")  # draw expanded-feature boundary.
for axis_xor_w in ax_xor_w:  # decorate both panels in the same way.
    axis_xor_w.scatter(X_xor_w[y_xor_w == -1, 0], X_xor_w[y_xor_w == -1, 1], c="tab:red", edgecolors="k", s=75, label="y=-1")  # draw negative XOR points.
    axis_xor_w.scatter(X_xor_w[y_xor_w == 1, 0], X_xor_w[y_xor_w == 1, 1], c="tab:blue", edgecolors="k", s=75, label="y=+1")  # draw positive XOR points.
    axis_xor_w.set_xlabel("x1")  # label the first coordinate.
    axis_xor_w.set_ylabel("x2")  # label the second coordinate.
ax_xor_w[0].set_title("5: raw linear features fail")  # title the raw-feature panel.
ax_xor_w[1].set_title("5: interaction feature separates")  # title the expanded-feature panel.
ax_xor_w[1].legend(loc="best")  # show labels once to avoid clutter.
plt.tight_layout()  # prevent panel labels from overlapping.
plt.show()  # render the comparison.
```
▶ What you'll see: the raw linear boundary cannot isolate diagonal classes, while the interaction feature creates quadrant-style separation.

*Why it's done this way: changing $\phi$ changes the geometry a linear score can express. A nonlinear feature map can make raw-space patterns separable without abandoning the simple weighted-sum predictor.*


### 🟢 Basics (warm-up)

#### B1. Compute one linear score $w\cdot\phi(x)$

Goal: Compute a weighted feature score from one feature vector.

Let

$$
\phi(x)=\begin{bmatrix}1\\3\\2\end{bmatrix},
\qquad
w=\begin{bmatrix}-2\\1.5\\0.5\end{bmatrix}.
$$

Compute the score:

$$
\begin{aligned}
s(x,w)
&=w\cdot\phi(x)\\
&=(-2)(1)+(1.5)(3)+(0.5)(2)\\
&=-2+4.5+1\\
&=3.5.
\end{aligned}
$$

So

$$
\boxed{s(x,w)=3.5}.
$$

The contribution table is

| Feature | Value | Weight | Contribution |
|---|---:|---:|---:|
| bias | $1$ | $-2$ | $-2$ |
| links | $3$ | $1.5$ | $4.5$ |
| caps | $2$ | $0.5$ | $1$ |
| total |  |  | $3.5$ |

Interpretation: The positive feature contributions outweigh the negative bias, so the score is positive.

```python
phi_b1 = np.array([1.0, 3.0, 2.0])  # Store the same feature vector used in the hand calculation.
w_b1 = np.array([-2.0, 1.5, 0.5])  # Store the same weight vector used in the hand calculation.
contrib_b1 = w_b1 * phi_b1  # Compute each coordinate's contribution to the dot product.
score_b1 = float(w_b1 @ phi_b1)  # Add the contributions through a dot product to get the score.
print("contributions:", contrib_b1.tolist())  # Show the three terms -2, 4.5, and 1.
print("score:", score_b1)  # Print the score, matching the boxed answer 3.5.
```

▶ What you'll see: The three contributions sum to score $3.5$.

👀 Takeaway: A linear score is just a sum of weighted feature contributions.

#### B2. Convert one score into a sign prediction

Goal: Turn a positive score into a binary classifier output.

Use the score from B1:

$$
s(x,w)=3.5.
$$

The classifier is

$$
f_w(x)=\operatorname{sign}(s(x,w)).
$$

Since

$$
3.5>0,
$$

we get

$$
\begin{aligned}
f_w(x)&=\operatorname{sign}(3.5)\\
&=+1.
\end{aligned}
$$

Therefore

$$
\boxed{f_w(x)=+1}.
$$

Interpretation: Positive scores predict the positive class.

```python
score_b2 = 3.5  # Use the same positive score from the pen-and-paper calculation.
pred_b2 = 1 if score_b2 > 0 else -1 if score_b2 < 0 else 0  # Apply the sign rule with zero kept separate.
print("prediction:", pred_b2)  # Print the predicted class, matching the boxed answer +1.
```

▶ What you'll see: The printed prediction is `1`.

👀 Takeaway: Classification begins by converting score sign into a label.

#### B3. Compute hinge loss for one labeled example

Goal: Compute margin and hinge loss when the model is confidently wrong.

Suppose the true label is

$$
y=-1
$$

but the score is still

$$
s(x,w)=3.5.
$$

First compute the margin:

$$
\begin{aligned}
m(x,y,w)&=y\,s(x,w)\\
&=(-1)(3.5)\\
&=-3.5.
\end{aligned}
$$

Now compute hinge loss:

$$
\begin{aligned}
\operatorname{Loss}_{\text{hinge}}(x,y,w)
&=\max(1-m(x,y,w),0)\\
&=\max(1-(-3.5),0)\\
&=\max(4.5,0)\\
&=4.5.
\end{aligned}
$$

Thus

$$
\boxed{m=-3.5,\qquad \operatorname{Loss}_{\text{hinge}}=4.5}.
$$

Interpretation: The model is not merely wrong; it is confidently wrong, so the hinge penalty is large.

```python
y_b3 = -1.0  # Store the true class label from the hand calculation.
score_b3 = 3.5  # Store the score that has the wrong sign for this label.
margin_b3 = y_b3 * score_b3  # Compute the signed margin y times score.
hinge_b3 = max(1.0 - margin_b3, 0.0)  # Apply the hinge-loss formula max(1 - margin, 0).
print("margin:", margin_b3)  # Print the margin, matching the boxed answer -3.5.
print("hinge_loss:", hinge_b3)  # Print the hinge loss, matching the boxed answer 4.5.
```

▶ What you'll see: The margin is `-3.5` and the hinge loss is `4.5`.

👀 Takeaway: Negative margins make hinge loss larger than one.

```python
margin_point_b3 = -3.5  # Store the worked margin again so this visualization is self-contained.
hinge_point_b3 = max(1.0 - margin_point_b3, 0.0)  # Compute the worked hinge loss again for the plotted point.
margins_b3 = np.linspace(-4.0, 3.0, 200)  # Build margin values around the worked example.
losses_b3 = np.maximum(1.0 - margins_b3, 0.0)  # Compute hinge loss for each margin value.
plt.plot(margins_b3, losses_b3)  # Draw the hinge-loss curve.
plt.scatter([margin_point_b3], [hinge_point_b3], color="tab:red", zorder=3)  # Mark the worked example on the curve.
plt.title("B3: hinge loss at margin -3.5")  # Add a title that identifies the example.
plt.xlabel("margin")  # Label the horizontal axis as the margin.
plt.ylabel("hinge loss")  # Label the vertical axis as hinge loss.
plt.show()  # Display the figure in the notebook.
```

▶ What you'll see: A red point high on the hinge curve at margin $-3.5$.

#### B4. Build one feature vector $\phi(x)$

Goal: Convert raw toy-email measurements into a feature vector.

Let a toy email have $4$ links and $1$ all-caps word. Use the feature map

$$
\phi(x)=\begin{bmatrix}1\\\text{links}\\\text{caps}\end{bmatrix}.
$$

Substitute the observed values:

$$
\phi(x)=\begin{bmatrix}1\\4\\1\end{bmatrix}.
$$

$$
\boxed{\phi(x)=(1,4,1)}
$$

Interpretation: The first coordinate is the bias feature; it is always $1$.

```python
links_b4 = 4.0  # Store the observed number of links.
caps_b4 = 1.0  # Store the observed number of all-caps words.
phi_b4 = np.array([1.0, links_b4, caps_b4])  # Build the feature vector with a leading bias coordinate.
print("phi:", phi_b4.astype(int).tolist())  # Print the vector, matching the boxed answer (1, 4, 1).
```

▶ What you'll see: The printed feature vector is `[1, 4, 1]`.

👀 Takeaway: Feature maps turn raw observations into model-ready numbers.

#### B5. Compute a margin $y\cdot s$

Goal: Measure whether a score agrees with its true label.

Use label

$$
y=+1
$$

and score

$$
s=2.25.
$$

The margin is

$$
m=y\cdot s=(+1)(2.25)=2.25.
$$

$$
\boxed{m=2.25}
$$

Interpretation: Because the margin is positive, the sign prediction agrees with the label.

```python
y_b5 = 1.0  # Store the positive true label.
score_b5 = 2.25  # Store the model score from the hand calculation.
margin_b5 = y_b5 * score_b5  # Multiply label and score to compute the margin.
print("margin:", margin_b5)  # Print the margin, matching the boxed answer 2.25.
```

▶ What you'll see: The printed margin is `2.25`.

👀 Takeaway: A positive margin means the score has the correct sign.

```python
score_point_b5 = 2.25  # Store the worked score again so this visualization is self-contained.
plt.axvline(0.0, color="black", linewidth=1)  # Draw the decision boundary at zero score.
plt.scatter([score_point_b5], [0.0], color="tab:blue", zorder=3)  # Mark the worked score on the number line.
plt.title("B5: positive score gives positive margin for y=+1")  # Add a title explaining the margin sign.
plt.xlabel("score")  # Label the horizontal axis as score.
plt.yticks([])  # Hide the unused vertical tick labels.
plt.show()  # Display the one-dimensional score plot.
```

▶ What you'll see: The score lies to the positive side of the zero boundary.

#### B6. Compute logistic loss for one labeled example

Goal: Compute smooth logistic loss from a positive margin.

Use margin

$$
m=2.25.
$$

Logistic loss is

$$
\operatorname{Loss}_{\text{logistic}}=\log(1+e^{-m}).
$$

Substitute:

$$
\operatorname{Loss}_{\text{logistic}}=\log(1+e^{-2.25})\approx 0.1002.
$$

$$
\boxed{\operatorname{Loss}_{\text{logistic}}\approx 0.1002}
$$

Interpretation: A large positive margin gives a small but nonzero smooth penalty.

```python
margin_b6 = 2.25  # Store the same margin used in the hand calculation.
logistic_b6 = float(np.log1p(np.exp(-margin_b6)))  # Compute log(1 + exp(-margin)) with NumPy.
print("logistic_loss:", round(logistic_b6, 4))  # Print the rounded loss, matching the boxed answer 0.1002.
```

▶ What you'll see: The rounded logistic loss is `0.1002`.

👀 Takeaway: Logistic loss shrinks smoothly as margin grows.

```python
margin_point_b6 = 2.25  # Store the worked margin again so this visualization is self-contained.
logistic_point_b6 = float(np.log1p(np.exp(-margin_point_b6)))  # Compute the worked logistic loss again for the plotted point.
margins_b6 = np.linspace(-4.0, 5.0, 200)  # Build a range of margins around the worked example.
losses_b6 = np.log1p(np.exp(-margins_b6))  # Compute logistic loss for each margin.
plt.plot(margins_b6, losses_b6)  # Draw the logistic-loss curve.
plt.scatter([margin_point_b6], [logistic_point_b6], color="tab:red", zorder=3)  # Mark the worked margin and loss.
plt.title("B6: logistic loss at margin 2.25")  # Add a title identifying the worked point.
plt.xlabel("margin")  # Label the horizontal axis as margin.
plt.ylabel("logistic loss")  # Label the vertical axis as logistic loss.
plt.show()  # Display the figure in the notebook.
```

▶ What you'll see: A red point near the bottom of the smooth logistic curve.

#### B7. Compute squared loss for one regression prediction

Goal: Compute residual and squared error for one regression prediction.

Use regression prediction

$$
f_w(x)=7.5
$$

and target

$$
y=9.
$$

First compute the residual:

$$
\operatorname{res}=f_w(x)-y=7.5-9=-1.5.
$$

Then square it:

$$
\operatorname{Loss}_{\text{squared}}=(-1.5)^2=2.25.
$$

$$
\boxed{\operatorname{Loss}_{\text{squared}}=2.25}
$$

Interpretation: Squared loss ignores the sign of the residual and penalizes its size.

```python
prediction_b7 = 7.5  # Store the regression prediction from the hand calculation.
target_b7 = 9.0  # Store the target value from the hand calculation.
residual_b7 = prediction_b7 - target_b7  # Compute prediction minus target.
squared_b7 = residual_b7 ** 2  # Square the residual to get squared loss.
print("residual:", residual_b7)  # Print the residual, matching the hand value -1.5.
print("squared_loss:", squared_b7)  # Print the squared loss, matching the boxed answer 2.25.
```

▶ What you'll see: The residual is `-1.5` and the squared loss is `2.25`.

👀 Takeaway: Squared loss grows quadratically with residual size.

```python
residual_point_b7 = -1.5  # Store the worked residual again so this visualization is self-contained.
squared_point_b7 = residual_point_b7 ** 2  # Compute the worked squared loss again for the plotted point.
residuals_b7 = np.linspace(-3.0, 3.0, 200)  # Build residual values around the worked residual.
losses_b7 = residuals_b7 ** 2  # Compute squared loss for each residual.
plt.plot(residuals_b7, losses_b7)  # Draw the squared-loss curve.
plt.scatter([residual_point_b7], [squared_point_b7], color="tab:red", zorder=3)  # Mark the worked residual and loss.
plt.title("B7: squared loss at residual -1.5")  # Add a title identifying the worked point.
plt.xlabel("residual")  # Label the horizontal axis as residual.
plt.ylabel("squared loss")  # Label the vertical axis as squared loss.
plt.show()  # Display the figure in the notebook.
```

▶ What you'll see: A red point on the parabola at residual $-1.5$.

#### B8. Apply a quadratic feature map

Goal: Add a nonlinear radial feature while keeping a linear feature vector.

For input

$$
x=(2,-1),
$$

use the radial quadratic feature map

$$
\phi(x)=\begin{bmatrix}1\\x_1\\x_2\\x_1^2+x_2^2\end{bmatrix}.
$$

Compute the squared-radius feature:

$$
x_1^2+x_2^2=2^2+(-1)^2=5.
$$

So

$$
\boxed{\phi(x)=(1,2,-1,5)}.
$$

Interpretation: This is still a linear feature vector even though it contains a nonlinear measurement of the raw input.

```python
x_b8 = np.array([2.0, -1.0])  # Store the raw two-dimensional input point.
r2_b8 = float(x_b8[0] ** 2 + x_b8[1] ** 2)  # Compute the squared-radius feature x1^2 + x2^2.
phi_b8 = np.array([1.0, x_b8[0], x_b8[1], r2_b8])  # Build the radial quadratic feature vector.
print("phi:", phi_b8.astype(int).tolist())  # Print the vector, matching the boxed answer (1, 2, -1, 5).
```

▶ What you'll see: The printed feature vector is `[1, 2, -1, 5]`.

👀 Takeaway: Nonlinear raw measurements can be coordinates in a linear feature vector.

#### B9. Classify two points and count errors

Goal: Convert two scores to signs and count zero-one classification errors.

Use scores and labels

| Point | Score $s$ | Prediction $\operatorname{sign}(s)$ | True label $y$ |
|---|---:|---:|---:|
| A | $1.2$ | $+1$ | $+1$ |
| B | $-0.4$ | $-1$ | $+1$ |

Point A is correct because $+1=+1$. Point B is wrong because $-1\ne +1$.

$$
\boxed{\text{errors}=1\text{ out of }2}
$$

Interpretation: Zero-one error counts wrong signs, not how confident those signs were.

```python
scores_b9 = np.array([1.2, -0.4])  # Store the two scores from the table.
labels_b9 = np.array([1, 1])  # Store the two true labels from the table.
preds_b9 = np.where(scores_b9 > 0.0, 1, np.where(scores_b9 < 0.0, -1, 0))  # Convert scores into sign predictions.
errors_b9 = int(np.sum(preds_b9 != labels_b9))  # Count how many predictions disagree with the labels.
print("predictions:", preds_b9.tolist())  # Print the predictions +1 and -1 from the table.
print("errors:", errors_b9, "out of", len(scores_b9))  # Print the error count, matching the boxed answer.
```

▶ What you'll see: The predictions are `[1, -1]` with `1 out of 2` errors.

👀 Takeaway: Zero-one error is a count of sign mismatches.

```python
scores_plot_b9 = np.array([1.2, -0.4])  # Store the two scores again so this visualization is self-contained.
labels_plot_b9 = np.array([1, 1])  # Store the two true labels again for correctness coloring.
preds_plot_b9 = np.where(scores_plot_b9 > 0.0, 1, np.where(scores_plot_b9 < 0.0, -1, 0))  # Convert scores into sign predictions.
xpos_b9 = np.arange(len(scores_plot_b9))  # Create one horizontal position for each point.
colors_b9 = ["tab:blue" if preds_plot_b9[i] == labels_plot_b9[i] else "tab:red" for i in range(len(scores_plot_b9))]  # Color correct points blue and errors red.
plt.axhline(0.0, color="black", linewidth=1)  # Draw the zero-score decision boundary.
plt.scatter(xpos_b9, scores_plot_b9, c=colors_b9, s=80, zorder=3)  # Plot each point's score with correctness color.
plt.xticks(xpos_b9, ["A", "B"])  # Label the two plotted points by name.
plt.title("B9: one score has the wrong sign")  # Add a title describing the error count.
plt.xlabel("point")  # Label the horizontal axis as point.
plt.ylabel("score")  # Label the vertical axis as score.
plt.show()  # Display the score plot in the notebook.
```

▶ What you'll see: Point B appears red below the zero boundary.

#### B10. Compute the hinge-loss gradient for one point

Goal: Compute the active hinge-loss subgradient for one feature vector.

For one example, hinge loss is

$$
\max(1-yw\cdot\phi(x),0).
$$

If the margin is below $1$, a subgradient with respect to $w$ is

$$
-y\phi(x).
$$

Use

$$
y=-1,
\qquad
\phi(x)=\begin{bmatrix}1\\2\end{bmatrix},
\qquad
m=0.5<1.
$$

Therefore

$$
\nabla_w\operatorname{Loss}_{\text{hinge}}=-(-1)\begin{bmatrix}1\\2\end{bmatrix}=\begin{bmatrix}1\\2\end{bmatrix}.
$$

$$
\boxed{\nabla_w\operatorname{Loss}_{\text{hinge}}=(1,2)}
$$

Interpretation: The gradient appears only because this example is still inside the margin band.

```python
y_b10 = -1.0  # Store the true label from the hand calculation.
phi_b10 = np.array([1.0, 2.0])  # Store the feature vector from the hand calculation.
margin_b10 = 0.5  # Store the stated margin, which is inside the hinge band.
grad_b10 = -y_b10 * phi_b10 if margin_b10 < 1.0 else np.zeros_like(phi_b10)  # Use the active hinge subgradient rule.
print("gradient:", grad_b10.astype(int).tolist())  # Print the gradient, matching the boxed answer (1, 2).
```

▶ What you'll see: The printed gradient is `[1, 2]`.

👀 Takeaway: Active hinge examples push weights by $-y\phi(x)$.


### Data — swappable sources

The examples below use small synthetic datasets so that the geometry is visible. Change `DATA_SOURCE` to compare a dataset that is easy for a linear boundary with datasets where linear assumptions break.

```python
DATA_SOURCE = "blobs"  # Choose "blobs", "circles", or "moons" as the active dataset for exploratory plots.
if DATA_SOURCE == "blobs":  # Select a linearly friendly dataset when the toggle is set to blobs.
    X_base, y_base = make_blobs_data(n_per_class=45, spread=0.6)  # Generate two Gaussian clusters with opposite labels.
elif DATA_SOURCE == "circles":  # Select a radially separable but not raw-linearly separable dataset when requested.
    X_base, y_base = make_circles_data(n=140, noise=0.08)  # Generate two concentric noisy rings.
else:  # Use moons as the failure-case dataset for raw linear boundaries.
    X_base, y_base = make_moons_data(n=160, noise=0.12)  # Generate two interleaving crescent-shaped classes.
fig, ax = plt.subplots()  # Create one plotting panel for the active dataset.
ax.scatter(X_base[y_base < 0, 0], X_base[y_base < 0, 1], c="tab:red", edgecolor="k", label="y=-1")  # Draw the negative class.
ax.scatter(X_base[y_base > 0, 0], X_base[y_base > 0, 1], c="tab:blue", edgecolor="k", label="y=+1")  # Draw the positive class.
ax.set_title(f"Active DATA_SOURCE = {DATA_SOURCE}")  # Show the chosen data source in the title.
ax.set_xlabel("x1")  # Label the horizontal feature.
ax.set_ylabel("x2")  # Label the vertical feature.
ax.legend()  # Add a legend for class labels.
plt.show()  # Render the dataset plot.
```

▶ What you'll see: blobs are almost linearly separable, circles need a radial feature, and moons need a more flexible non-linear predictor.

### 🟡 Easy

#### E1. Hand-build a feature vector and score

We model a toy email with features

$$
\phi(x)=(1,\text{links},\text{caps})
$$

and weights

$$
w=(-2,1.5,0.5).
$$

For an email with $3$ links and $2$ all-caps words,

$$
\phi(x)=(1,3,2).
$$

Now compute the dot product term by term:

$$
\begin{aligned}
w\cdot\phi(x)
&=(-2)(1)+(1.5)(3)+(0.5)(2)\\
&=-2+4.5+1\\
&=3.5.
\end{aligned}
$$

Therefore

$$
\boxed{s(x,w)=3.5}.
$$

The bias starts the email at $-2$, links add $4.5$, and caps add $1$.

```python
feature_names = ["bias", "links", "caps"]  # Name each coordinate of the toy email feature vector.
phi_email = np.array([1.0, 3.0, 2.0])  # Store phi(x) = (1, links, caps) for the sample email.
w_email = np.array([-2.0, 1.5, 0.5])  # Store the linear predictor weights for spam scoring.
contributions = w_email * phi_email  # Multiply coordinatewise to see each term in the dot product.
score_email = contributions.sum()  # Sum contributions to obtain w dot phi(x).
fig, ax = plt.subplots()  # Create a bar chart panel for feature contributions.
colors = ["tab:red" if c < 0 else "tab:blue" for c in contributions]  # Color negative pushes red and positive pushes blue.
ax.bar(feature_names, contributions, color=colors, edgecolor="black")  # Draw one contribution bar per feature.
ax.axhline(0.0, color="black", linewidth=1)  # Draw the zero line to separate positive and negative contributions.
ax.set_title(f"Feature contributions; total score = {score_email:.1f}")  # Put the final score in the title.
ax.set_ylabel("weight × feature value")  # Label the vertical axis as individual dot-product terms.
plt.show()  # Render the contribution chart.
```

▶ What you'll see: the bias contributes negatively, while links and caps push the score positive; the total score is $3.5$.

👀 A dot product is not a black box: it is a sum of interpretable weighted feature contributions.

#### E2. Hand-classify by sign and compute margin

Consider two labeled points and a weight vector with a bias:

$$
w=(-0.5,1,1),\qquad \phi(x)=(1,x_1,x_2).
$$

The score is

$$
s(x,w)=-0.5+x_1+x_2.
$$

For point $x^{(1)}=(1,1)$ with label $y^{(1)}=+1$:

$$
\begin{aligned}
s(x^{(1)},w)&=-0.5+1+1=1.5,\\
f_w(x^{(1)})&=\operatorname{sign}(1.5)=+1,\\
m(x^{(1)},y^{(1)},w)&=(+1)(1.5)=1.5.
\end{aligned}
$$

For point $x^{(2)}=(-1,-0.5)$ with label $y^{(2)}=-1$:

$$
\begin{aligned}
s(x^{(2)},w)&=-0.5+(-1)+(-0.5)=-2,\\
f_w(x^{(2)})&=\operatorname{sign}(-2)=-1,\\
m(x^{(2)},y^{(2)},w)&=(-1)(-2)=2.
\end{aligned}
$$

Thus

$$
\boxed{m^{(1)}=1.5,\qquad m^{(2)}=2}.
$$

Both examples are correctly classified because both margins are positive.

```python
X_e2 = np.array([[1.0, 1.0], [-1.0, -0.5]])  # Store the two hand-classified points.
y_e2 = np.array([1.0, -1.0])  # Store their labels in {-1,+1} form.
w_e2 = np.array([-0.5, 1.0, 1.0])  # Store weights for phi(x) = (1, x1, x2).
scores_e2 = feature_raw(X_e2) @ w_e2  # Compute scores for both points.
margins_e2 = y_e2 * scores_e2  # Compute signed margins by multiplying each score by its label.
fig, ax = plt.subplots()  # Create one panel for the decision line.
plot_boundary(ax, X_e2, y_e2, lambda G: feature_raw(G) @ w_e2, "Decision line for s(x,w) = -0.5 + x1 + x2", grid_steps=120)  # Draw the half-planes and boundary.
for i, point in enumerate(X_e2):  # Loop over the two points so each margin can be labeled.
    ax.annotate(f"s={scores_e2[i]:.1f}\nm={margins_e2[i]:.1f}", point + 0.08)  # Place score and margin text near the point.
plt.show()  # Render the decision-boundary plot.
```

▶ What you'll see: the black line is $s=0$; each point lies on the side matching its label and has a positive margin.

👀 The sign gives the prediction, while the margin tells how safely correct the prediction is.

#### E3. Compare zero-one, hinge, and logistic loss for one margin

Evaluate the three classification losses at margins

$$
m\in\{-1,0,0.5,1,2\}.
$$

The definitions are

$$
L_{0/1}(m)=\mathbf{1}_{\{m\le 0\}},
\qquad
L_{\text{hinge}}(m)=\max(1-m,0),
\qquad
L_{\text{logistic}}(m)=\log(1+e^{-m}).
$$

Compute each row:

| $m$ | $L_{0/1}(m)$ | $L_{\text{hinge}}(m)$ | $L_{\text{logistic}}(m)$ |
|---:|---:|---:|---:|
| $-1$ | $1$ | $\max(2,0)=2$ | $\log(1+e^1)\approx1.313$ |
| $0$ | $1$ | $\max(1,0)=1$ | $\log 2\approx0.693$ |
| $0.5$ | $0$ | $\max(0.5,0)=0.5$ | $\log(1+e^{-0.5})\approx0.474$ |
| $1$ | $0$ | $\max(0,0)=0$ | $\log(1+e^{-1})\approx0.313$ |
| $2$ | $0$ | $\max(-1,0)=0$ | $\log(1+e^{-2})\approx0.127$ |

So the boxed table is

$$
\boxed{
\begin{array}{c|ccccc}
m&-1&0&0.5&1&2\\\hline
L_{0/1}&1&1&0&0&0\\
L_{\text{hinge}}&2&1&0.5&0&0\\
L_{\text{logistic}}&1.313&0.693&0.474&0.313&0.127
\end{array}}
$$

```python
m_grid = np.linspace(-3.0, 4.0, 500)  # Create a dense range of margin values for smooth loss curves.
fig, ax = plt.subplots()  # Create one panel for comparing classification losses.
ax.plot(m_grid, zero_one_loss(m_grid), label="zero-one", linewidth=2)  # Plot the discontinuous zero-one loss.
ax.plot(m_grid, hinge_loss(m_grid), label="hinge", linewidth=2)  # Plot the piecewise-linear hinge loss.
ax.plot(m_grid, logistic_loss(m_grid), label="logistic", linewidth=2)  # Plot the smooth logistic loss.
ax.axvline(0.0, color="black", linestyle="--", linewidth=1)  # Mark the boundary between wrong and correct signs.
ax.axvline(1.0, color="gray", linestyle=":", linewidth=2)  # Mark the hinge margin target.
ax.set_ylim(-0.05, 4.0)  # Limit the y-axis so the main comparison is visible.
ax.set_title("Classification losses as functions of margin")  # Add a descriptive title.
ax.set_xlabel("margin m = y s(x,w)")  # Label the horizontal axis with the margin definition.
ax.set_ylabel("loss")  # Label the vertical axis as loss.
ax.legend()  # Show curve labels.
plt.show()  # Render the loss-curve plot.
```

▶ What you'll see: zero-one is flat and discontinuous, hinge is linear until margin $1$, and logistic is smooth everywhere.

👀 Loss choice changes the optimization problem even when the prediction rule is the same sign rule.

#### E4. Hand-compute residual, squared loss, and absolute loss

Use a tiny housing-style regression model with

$$
\phi(x)=(1,\text{size in 1000 sqft},\text{bedrooms}),
\qquad
w=(50,120,25).
$$

For a house with size $1.5$ and $3$ bedrooms,

$$
\phi(x)=(1,1.5,3).
$$

The predicted price, in thousands of dollars, is

$$
\begin{aligned}
f_w(x)&=s(x,w)\\
&=(50)(1)+(120)(1.5)+(25)(3)\\
&=50+180+75\\
&=305.
\end{aligned}
$$

If the true target is

$$
y=330,
$$

then the residual is

$$
\begin{aligned}
\operatorname{res}(x,y,w)&=f_w(x)-y\\
&=305-330\\
&=-25.
\end{aligned}
$$

Therefore

$$
\operatorname{Loss}_{\text{squared}}=(-25)^2=625
$$

and

$$
\operatorname{Loss}_{\text{absolute}}=|-25|=25.
$$

Thus

$$
\boxed{f_w(x)=305,\quad \operatorname{res}=-25,\quad L_{\text{squared}}=625,\quad L_{\text{absolute}}=25}.
$$

```python
x_line = np.linspace(0.5, 2.5, 100)  # Create possible house sizes measured in thousands of square feet.
y_line = 50.0 + 120.0 * x_line + 25.0 * 3.0  # Compute predictions when bedrooms are fixed at three.
x_house = 1.5  # Store the example house size from the hand derivation.
y_true_house = 330.0  # Store the true price in thousands of dollars.
y_pred_house = 50.0 + 120.0 * x_house + 25.0 * 3.0  # Compute the model prediction for the example house.
fig, ax = plt.subplots()  # Create one panel for the regression line and residual.
ax.plot(x_line, y_line, color="black", label="model prediction")  # Plot the fitted linear prediction as size varies.
ax.scatter([x_house], [y_true_house], color="tab:blue", edgecolor="k", s=90, label="true target")  # Plot the observed target point.
ax.scatter([x_house], [y_pred_house], color="tab:red", edgecolor="k", s=90, label="prediction")  # Plot the model's prediction at the same x-value.
ax.annotate("residual = prediction - target", xy=(x_house, (y_true_house + y_pred_house) / 2), xytext=(1.65, 320), arrowprops={"arrowstyle": "->"})  # Label the vertical residual arrow.
ax.vlines(x_house, y_pred_house, y_true_house, colors="tab:purple", linewidth=3)  # Draw the residual as a vertical segment.
ax.set_title("Regression residual for one house")  # Add a title describing the plot.
ax.set_xlabel("size in 1000 sqft")  # Label the horizontal feature.
ax.set_ylabel("price in $1000s")  # Label the target axis.
ax.legend()  # Show the legend.
plt.show()  # Render the residual plot.
```

▶ What you'll see: the residual is the vertical gap from the prediction to the true target.

👀 Regression loss measures how large the residual is, not whether a sign is correct.

#### E5. k-NN bias/variance intuition

Unlike a fixed linear score, $k$-nearest neighbors predicts from local training labels. The rule is

$$
f_k(x)=\operatorname{sign}\left(\sum_{i\in N_k(x)}y_i\right),
$$

where $N_k(x)$ is the set of the $k$ closest training examples to $x$.

Small $k$ follows individual points closely, which can create high variance. Large $k$ smooths over neighborhoods, which can create high bias.

```python
X_knn, y_knn = make_moons_data(n=120, noise=0.16)  # Generate a curved two-moons dataset where local methods help.
k_values = [1, 3, 9]  # Choose small, medium, and larger neighborhood sizes.
fig, axes = plt.subplots(1, 3, figsize=(15, 4))  # Create one panel per k value.
for ax, k in zip(axes, k_values):  # Loop over panels and neighborhood sizes together.
    score_fn = lambda G, kk=k: knn_predict(X_knn, y_knn, G, k=kk)  # Define a label-valued prediction function for this k.
    plot_boundary(ax, X_knn, y_knn, score_fn, f"k-NN decision regions with k={k}", grid_steps=140)  # Plot the induced decision regions.
plt.tight_layout()  # Adjust panel spacing to avoid label overlap.
plt.show()  # Render the three k-NN decision-region plots.
```

▶ What you'll see: $k=1$ creates jagged regions, $k=3$ is smoother, and $k=9$ smooths even more.

👀 Increasing $k$ usually lowers variance but raises bias.

### 🔴 Advanced

#### A1. Aggregate train loss over a tiny dataset by hand

Use four examples with fixed scores and labels:

| $i$ | $s_i$ | $y_i$ |
|---:|---:|---:|
| 1 | $2$ | $+1$ |
| 2 | $0.5$ | $+1$ |
| 3 | $-0.2$ | $-1$ |
| 4 | $1$ | $-1$ |

Margins are

$$
m_i=y_i s_i.
$$

Compute each one:

$$
\begin{aligned}
m_1&=(+1)(2)=2,\\
m_2&=(+1)(0.5)=0.5,\\
m_3&=(-1)(-0.2)=0.2,\\
m_4&=(-1)(1)=-1.
\end{aligned}
$$

Now compute hinge losses:

$$
\begin{aligned}
L_1&=\max(1-2,0)=0,\\
L_2&=\max(1-0.5,0)=0.5,\\
L_3&=\max(1-0.2,0)=0.8,\\
L_4&=\max(1-(-1),0)=2.
\end{aligned}
$$

The training loss is the average:

$$
\begin{aligned}
\operatorname{TrainLoss}(w)
&=\frac{1}{4}(0+0.5+0.8+2)\\
&=\frac{3.3}{4}\\
&=0.825.
\end{aligned}
$$

So

$$
\boxed{\operatorname{TrainLoss}_{\text{hinge}}(w)=0.825}.
$$

```python
scores_a1 = np.array([2.0, 0.5, -0.2, 1.0])  # Store the four fixed model scores from the hand calculation.
y_a1 = np.array([1.0, 1.0, -1.0, -1.0])  # Store the four true labels.
margins_a1 = y_a1 * scores_a1  # Compute one margin per example.
losses_a1 = hinge_loss(margins_a1)  # Compute one hinge loss per margin.
train_loss_a1 = losses_a1.mean()  # Average the per-example losses to obtain training loss.
fig, ax = plt.subplots()  # Create one panel for per-example losses.
ax.bar(np.arange(1, 5), losses_a1, color="tab:orange", edgecolor="black")  # Plot one loss bar per training example.
ax.axhline(train_loss_a1, color="black", linestyle="--", label=f"average = {train_loss_a1:.3f}")  # Draw the average training loss.
ax.set_xticks(np.arange(1, 5))  # Place x-ticks at example numbers.
ax.set_xlabel("example index")  # Label the horizontal axis.
ax.set_ylabel("hinge loss")  # Label the vertical axis.
ax.set_title("Training loss is the average of example losses")  # Add a descriptive title.
ax.legend()  # Show the average-loss legend.
plt.show()  # Render the loss-bar plot.
```

▶ What you'll see: example 4 dominates the average because its margin is negative.

👀 Training loss is not a new kind of loss; it is the dataset average of the chosen example-level loss.

#### A2. Feature engineering changes linear separability

Concentric circles are not separable by a raw straight line in $(x_1,x_2)$ space. But with

$$
\phi(x)=\begin{bmatrix}1\\x_1\\x_2\\x_1^2+x_2^2\end{bmatrix},
$$

a linear score in feature space can separate by radius.

```python
X_circ, y_circ = make_circles_data(n=180, noise=0.08)  # Generate concentric circles that break raw linear separation.
w_raw_circ, hist_raw_circ = train_linear_classifier(X_circ, y_circ, loss_type="logistic", feature_fn=feature_raw, lr=0.2, steps=1000)  # Train a raw linear classifier on (1,x1,x2).
w_rad_circ, hist_rad_circ = train_linear_classifier(X_circ, y_circ, loss_type="logistic", feature_fn=feature_radial, lr=0.2, steps=1000)  # Train a linear classifier after adding radius squared.
acc_raw_circ = accuracy_from_scores(X_circ, y_circ, w_raw_circ, feature_raw)  # Measure training accuracy with raw features.
acc_rad_circ = accuracy_from_scores(X_circ, y_circ, w_rad_circ, feature_radial)  # Measure training accuracy with radial features.
fig, axes = plt.subplots(1, 3, figsize=(16, 4))  # Create panels for raw boundary, radial boundary, and loss curves.
plot_boundary(axes[0], X_circ, y_circ, lambda G: feature_raw(G) @ w_raw_circ, f"Raw features; acc={acc_raw_circ:.2f}", grid_steps=160)  # Plot the raw-feature linear boundary.
plot_boundary(axes[1], X_circ, y_circ, lambda G: feature_radial(G) @ w_rad_circ, f"Add r² feature; acc={acc_rad_circ:.2f}", grid_steps=160)  # Plot the radial-feature boundary.
axes[2].plot(hist_raw_circ, label="raw features")  # Plot the raw-feature optimization history.
axes[2].plot(hist_rad_circ, label="radial features")  # Plot the radial-feature optimization history.
axes[2].set_title("Logistic training loss")  # Title the loss-history panel.
axes[2].set_xlabel("recorded step")  # Label the horizontal axis by recorded checkpoints.
axes[2].set_ylabel("regularized loss")  # Label the vertical axis by objective value.
axes[2].legend()  # Add a legend for the two feature maps.
plt.tight_layout()  # Adjust spacing between panels.
plt.show()  # Render all feature-engineering plots.
```

▶ What you'll see: raw features force a straight boundary, while adding $r^2$ creates a circular boundary.

👀 The model is linear in $\phi(x)$, but the boundary can be non-linear in the original input $x$.

#### A3. Hinge vs logistic under outliers

Now train two linear classifiers on the same data with one mislabeled high-leverage point. Hinge and logistic losses both use margins, but they distribute pressure differently.

```python
X_out, y_out = make_blobs_data(n_per_class=45, spread=0.45)  # Generate an almost linearly separable dataset.
X_out = np.vstack([X_out, np.array([[3.2, 3.0]])])  # Add one far-away point in the positive-looking region.
y_out = np.hstack([y_out, np.array([-1.0])])  # Deliberately label the far-away point as negative to make it an outlier.
w_hinge_out, hist_hinge_out = train_linear_classifier(X_out, y_out, loss_type="hinge", feature_fn=feature_raw, lr=0.05, steps=1400, reg=0.002)  # Train with hinge loss.
w_log_out, hist_log_out = train_linear_classifier(X_out, y_out, loss_type="logistic", feature_fn=feature_raw, lr=0.12, steps=1400, reg=0.002)  # Train with logistic loss.
margins_hinge_out = y_out * (feature_raw(X_out) @ w_hinge_out)  # Compute final margins under the hinge-trained model.
margins_log_out = y_out * (feature_raw(X_out) @ w_log_out)  # Compute final margins under the logistic-trained model.
fig, axes = plt.subplots(2, 2, figsize=(13, 10))  # Create a two-by-two comparison layout.
plot_boundary(axes[0, 0], X_out, y_out, lambda G: feature_raw(G) @ w_hinge_out, "Boundary trained with hinge loss", grid_steps=150)  # Plot the hinge-trained boundary.
plot_boundary(axes[0, 1], X_out, y_out, lambda G: feature_raw(G) @ w_log_out, "Boundary trained with logistic loss", grid_steps=150)  # Plot the logistic-trained boundary.
axes[1, 0].hist(margins_hinge_out, bins=18, alpha=0.7, label="hinge margins")  # Plot the hinge model's margin distribution.
axes[1, 0].hist(margins_log_out, bins=18, alpha=0.7, label="logistic margins")  # Overlay the logistic model's margin distribution.
axes[1, 0].axvline(0.0, color="black", linestyle="--")  # Mark the wrong-versus-correct margin threshold.
axes[1, 0].axvline(1.0, color="gray", linestyle=":")  # Mark the hinge-loss zero threshold.
axes[1, 0].set_title("Final margin histograms")  # Add a histogram title.
axes[1, 0].set_xlabel("margin")  # Label the histogram x-axis.
axes[1, 0].set_ylabel("count")  # Label the histogram y-axis.
axes[1, 0].legend()  # Show histogram labels.
axes[1, 1].plot(hist_hinge_out, label="hinge objective")  # Plot the hinge training curve.
axes[1, 1].plot(hist_log_out, label="logistic objective")  # Plot the logistic training curve.
axes[1, 1].set_title("Optimization histories")  # Add a title to the training curves.
axes[1, 1].set_xlabel("recorded step")  # Label the training-curve x-axis.
axes[1, 1].set_ylabel("regularized loss")  # Label the training-curve y-axis.
axes[1, 1].legend()  # Show curve labels.
plt.tight_layout()  # Improve spacing between comparison panels.
plt.show()  # Render the outlier comparison.
```

▶ What you'll see: the mislabeled far point pulls both models, but the final margins and boundaries are not identical.

👀 Loss functions encode how much pressure each margin exerts during training.

#### A4. Regression loss choice with outliers

Squared loss squares residuals, so a few contaminated targets can dominate the fit. Absolute loss grows linearly and is often more robust.

```python
x_reg = np.linspace(0.0, 6.0, 45)  # Create one-dimensional regression inputs.
y_clean = 2.0 + 1.4 * x_reg + rng.normal(0.0, 0.35, size=x_reg.shape)  # Generate mostly linear targets with moderate noise.
y_reg = y_clean.copy()  # Copy the clean targets before adding contamination.
y_reg[[8, 33, 39]] += np.array([5.5, -6.0, 5.0])  # Add three large target outliers.
X_reg_design = np.c_[np.ones_like(x_reg), x_reg]  # Build a design matrix with bias and slope features.
w_sq = fit_regression_squared(X_reg_design, y_reg)  # Fit the closed-form squared-loss line.
w_abs = fit_regression_absolute_gd(X_reg_design, y_reg, lr=0.025, steps=4000)  # Fit the absolute-loss line by subgradient descent.
y_sq_line = X_reg_design @ w_sq  # Compute squared-loss predictions at observed x-values.
y_abs_line = X_reg_design @ w_abs  # Compute absolute-loss predictions at observed x-values.
res_sq = y_sq_line - y_reg  # Compute residuals from the squared-loss fit.
res_abs = y_abs_line - y_reg  # Compute residuals from the absolute-loss fit.
fig, axes = plt.subplots(1, 2, figsize=(13, 4.5))  # Create panels for fitted lines and residual losses.
axes[0].scatter(x_reg, y_reg, color="tab:gray", edgecolor="k", label="observed data")  # Plot the contaminated data.
axes[0].plot(x_reg, y_sq_line, color="tab:red", linewidth=2, label="squared-loss fit")  # Plot the squared-loss fitted line.
axes[0].plot(x_reg, y_abs_line, color="tab:blue", linewidth=2, label="absolute-loss fit")  # Plot the absolute-loss fitted line.
axes[0].set_title("Fitted lines with target outliers")  # Title the fitted-line panel.
axes[0].set_xlabel("x")  # Label the input axis.
axes[0].set_ylabel("y")  # Label the target axis.
axes[0].legend()  # Show fit labels.
axes[1].scatter(res_sq, squared_loss(res_sq), color="tab:red", alpha=0.7, label="squared fit residual losses")  # Plot squared penalties for squared-fit residuals.
axes[1].scatter(res_abs, absolute_loss(res_abs), color="tab:blue", alpha=0.7, label="absolute fit residual losses")  # Plot absolute penalties for absolute-fit residuals.
axes[1].set_title("Residual-to-loss relationship on fitted data")  # Title the residual-loss panel.
axes[1].set_xlabel("residual")  # Label the residual axis.
axes[1].set_ylabel("loss")  # Label the loss axis.
axes[1].legend()  # Show residual-loss labels.
plt.tight_layout()  # Prevent panel labels from overlapping.
plt.show()  # Render the regression outlier comparison.
```

▶ What you'll see: the squared-loss line bends more toward extreme targets than the absolute-loss line.

👀 A loss is a modeling choice about which errors deserve the most attention.

#### A5. Failure case: linear predictor on non-linear data vs k-NN/NN

The two-moons dataset is a classic failure case for one raw linear boundary. We compare three predictors:

1. Raw linear classifier: $s=w\cdot(1,x_1,x_2)$.
2. k-NN classifier: flexible local voting.
3. Small neural network: learned non-linear hidden features.

```python
X_moon, y_moon = make_moons_data(n=180, noise=0.13)  # Generate a curved two-moons dataset.
w_linear_moon, hist_linear_moon = train_linear_classifier(X_moon, y_moon, loss_type="logistic", feature_fn=feature_raw, lr=0.15, steps=1600, reg=0.001)  # Train a raw linear logistic classifier.
nn_params_moon = train_tiny_nn(X_moon, y_moon, hidden=16, lr=0.08, steps=3500)  # Train a small one-hidden-layer neural network.
linear_preds_moon = np.where(feature_raw(X_moon) @ w_linear_moon >= 0, 1, -1)  # Convert linear scores to labels.
knn_preds_moon = knn_predict(X_moon, y_moon, X_moon, k=7)  # Predict the training set with k-NN using k=7.
nn_preds_moon = np.where(nn_scores(X_moon, nn_params_moon) >= 0, 1, -1)  # Convert neural-network logits to labels.
acc_linear_moon = np.mean(linear_preds_moon == y_moon)  # Compute raw linear training accuracy.
acc_knn_moon = np.mean(knn_preds_moon == y_moon)  # Compute k-NN training accuracy.
acc_nn_moon = np.mean(nn_preds_moon == y_moon)  # Compute neural-network training accuracy.
fig, axes = plt.subplots(1, 4, figsize=(19, 4))  # Create three boundary panels plus one accuracy panel.
plot_boundary(axes[0], X_moon, y_moon, lambda G: feature_raw(G) @ w_linear_moon, f"Linear; acc={acc_linear_moon:.2f}", grid_steps=160)  # Plot the raw linear boundary failure.
plot_boundary(axes[1], X_moon, y_moon, lambda G: knn_predict(X_moon, y_moon, G, k=7), f"k-NN; acc={acc_knn_moon:.2f}", grid_steps=160)  # Plot the flexible local-voting boundary.
plot_boundary(axes[2], X_moon, y_moon, lambda G: nn_scores(G, nn_params_moon), f"Tiny NN; acc={acc_nn_moon:.2f}", grid_steps=160)  # Plot the neural-network boundary.
axes[3].bar(["linear", "k-NN", "tiny NN"], [acc_linear_moon, acc_knn_moon, acc_nn_moon], color=["tab:red", "tab:green", "tab:blue"], edgecolor="black")  # Plot training accuracies side by side.
axes[3].set_ylim(0.0, 1.05)  # Use the full accuracy range from zero to one.
axes[3].set_title("Training accuracy")  # Title the accuracy panel.
axes[3].set_ylabel("accuracy")  # Label the accuracy axis.
plt.tight_layout()  # Improve spacing for the four-panel figure.
plt.show()  # Render the non-linear predictor comparison.
```

▶ What you'll see: one straight boundary cannot follow the moons, while k-NN and the small neural network can bend.

👀 Reflex-based does not mean linear; it means predicting directly from features. The feature map or model class determines the shape of the boundary.

### Interactive Experiment

Use the controls to change the loss and feature map. The plot retrains the model and redraws the boundary.

```python
try:  # Try to import widget tools when running in a notebook environment.
    from ipywidgets import interact, Dropdown, IntSlider, FloatSlider  # Import interactive controls for live experiments.
    widgets_available = True  # Record that interactive widgets are available.
except Exception:  # Fall back gracefully when ipywidgets is not installed.
    widgets_available = False  # Record that the notebook should use a static fallback.
def run_reflex_experiment(loss_type="logistic", feature_map="raw", dataset="moons", steps=900, learning_rate=0.12):  # Define the interactive experiment function.
    if dataset == "blobs":  # Choose the linearly friendly dataset when requested.
        X_exp, y_exp = make_blobs_data(n_per_class=45, spread=0.55)  # Generate blob data for the experiment.
    elif dataset == "circles":  # Choose the radial feature-engineering dataset when requested.
        X_exp, y_exp = make_circles_data(n=150, noise=0.08)  # Generate circle data for the experiment.
    else:  # Use moons as the default non-linear failure case.
        X_exp, y_exp = make_moons_data(n=150, noise=0.13)  # Generate moon data for the experiment.
    chosen_feature_fn = feature_radial if feature_map == "radial" else feature_raw  # Select raw or radial feature mapping.
    w_exp, hist_exp = train_linear_classifier(X_exp, y_exp, loss_type=loss_type, feature_fn=chosen_feature_fn, lr=learning_rate, steps=steps, reg=0.001)  # Train the selected linear-in-features model.
    acc_exp = accuracy_from_scores(X_exp, y_exp, w_exp, chosen_feature_fn)  # Compute training accuracy for the selected setup.
    fig, axes = plt.subplots(1, 2, figsize=(12, 4.5))  # Create panels for the boundary and optimization curve.
    plot_boundary(axes[0], X_exp, y_exp, lambda G: chosen_feature_fn(G) @ w_exp, f"{loss_type}, {feature_map}; acc={acc_exp:.2f}", grid_steps=150)  # Draw the learned decision boundary.
    axes[1].plot(hist_exp, color="tab:purple")  # Plot the recorded training loss values.
    axes[1].set_title("Training objective")  # Title the optimization panel.
    axes[1].set_xlabel("recorded step")  # Label the horizontal axis by checkpoint index.
    axes[1].set_ylabel("regularized loss")  # Label the vertical axis as objective value.
    plt.tight_layout()  # Keep the two panels readable.
    plt.show()  # Render the experiment output.
if widgets_available:  # Use live widgets when the environment supports them.
    interact(run_reflex_experiment, loss_type=Dropdown(options=["logistic", "hinge"], value="logistic"), feature_map=Dropdown(options=["raw", "radial"], value="raw"), dataset=Dropdown(options=["blobs", "circles", "moons"], value="moons"), steps=IntSlider(min=200, max=1600, step=100, value=900), learning_rate=FloatSlider(min=0.02, max=0.30, step=0.02, value=0.12))  # Display dropdowns and sliders that retrain on change.
else:  # Provide a runnable static version when widgets are unavailable.
    run_reflex_experiment(loss_type="logistic", feature_map="raw", dataset="moons", steps=900, learning_rate=0.12)  # Run one default experiment without interactive controls.
```

▶ What you'll see: radial features help on circles, raw features work on blobs, and moons remain hard for a linear-in-raw-features model.

👀 Try logistic versus hinge on the same dataset. The prediction rule is still the sign of the score, but the training pressure changes because the loss changes.
