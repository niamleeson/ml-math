# Trees, Ensembles & Non-parametric Methods
> **Source:** CS 229 · **Category:** Model · **Type:** 💻 Colab · [↑ Full reference](../../ai-ml-cheatsheets.md)
> 📓 This section is written as a runnable notebook; an `.ipynb` will be generated from it.

## 0. Step-by-Step Worked Example — Start Here (Beginner Friendly)

> 🧑‍🎓 **New to this topic? Start here.** This is a gentle, fully runnable walkthrough that
> builds up *every* idea in this lesson one tiny step at a time. Each step **prints** the
> numbers it computes and **draws a picture** so you can *see* what is happening. Run the
> cells in order from top to bottom. Nothing here needs the internet or any downloaded data.

**What we will build, step by step:**
1. **Decision-tree splitting** — how Gini, entropy, and information gain choose a threshold.
2. **k-nearest neighbors** — how distances, sorted neighbors, and majority vote make a prediction.
3. **Bagging and random forests** — how averaging many noisy trees reduces variance, especially when trees are decorrelated.
4. **Boosting** — how weak learners are added one at a time to correct residual errors.

### Step 0 — Set up our tools

We import NumPy (arrays + random numbers) and Matplotlib (pictures). We fix a random **seed**
so every run produces the same printed numbers, then define a tiny `log()` helper so each line
of output tells you what it means.

```python
import numpy as np                       # NumPy: arrays, distances, counts, bootstraps, and random draws.
import matplotlib.pyplot as plt          # Matplotlib: draw splits, neighbors, averaging, and boosting progress.

np.random.seed(0)                         # Fix the seed so every run prints the SAME numbers.
plt.rcParams["figure.figsize"] = (7, 4)   # Use a comfortable default plot size.


def log(label, value):                    # A tiny logger so each printed line explains itself.
    print(f"[{label}] {value}")           # Format is: [what this is] the value.

log("setup", "tools ready — NumPy + Matplotlib imported, seed fixed to 0")
```
▶ What you'll see: one line confirming the tools are ready.

### Step 1 — Decision-tree splitting: pick the threshold that cleans up labels

A decision tree asks simple yes/no questions such as "is feature 1 below this threshold?".
For each candidate split, CART compares the parent impurity to the weighted child impurity;
the drop is the **information gain**.

```python
x_tree_demo = np.array([1.0, 1.4, 1.8, 2.6, 3.0, 3.3, 4.2, 4.6])  # One sorted feature column.
y_tree_demo = np.array([0, 0, 0, 1, 1, 1, 0, 1])                  # Binary labels attached to those feature values.
threshold_tree_demo = 2.2                                           # Candidate rule: send x <= 2.2 left.
left_mask_demo = x_tree_demo <= threshold_tree_demo                 # Boolean mask for the left child.
right_mask_demo = ~left_mask_demo                                   # Boolean mask for the right child.

parent_counts_demo = np.bincount(y_tree_demo, minlength=2)          # Count labels before the split.
left_counts_demo = np.bincount(y_tree_demo[left_mask_demo], minlength=2)   # Count labels in the left child.
right_counts_demo = np.bincount(y_tree_demo[right_mask_demo], minlength=2) # Count labels in the right child.
parent_probs_demo = parent_counts_demo / parent_counts_demo.sum()   # Convert parent counts into class proportions.
left_probs_demo = left_counts_demo / left_counts_demo.sum()         # Convert left counts into class proportions.
right_probs_demo = right_counts_demo / right_counts_demo.sum()      # Convert right counts into class proportions.

parent_gini_demo = 1.0 - np.sum(parent_probs_demo**2)               # Gini impurity: 1 - sum p_k^2.
left_gini_demo = 1.0 - np.sum(left_probs_demo**2)                   # Left-child Gini impurity.
right_gini_demo = 1.0 - np.sum(right_probs_demo**2)                 # Right-child Gini impurity.
nonzero_parent_demo = parent_probs_demo > 0                         # Guard against log(0) for entropy.
parent_entropy_demo = -np.sum(parent_probs_demo[nonzero_parent_demo] * np.log(parent_probs_demo[nonzero_parent_demo]))  # Entropy: -sum p log p.
weighted_child_gini_demo = left_mask_demo.mean() * left_gini_demo + right_mask_demo.mean() * right_gini_demo  # Weighted child impurity.
gain_tree_demo = parent_gini_demo - weighted_child_gini_demo        # Information gain: impurity removed by the split.

log("parent counts", parent_counts_demo)                            # Show the mixed parent node.
log("left counts", left_counts_demo)                                # Show labels sent left.
log("right counts", right_counts_demo)                              # Show labels sent right.
log("parent Gini", round(parent_gini_demo, 3))                      # Print parent impurity.
log("parent entropy", round(parent_entropy_demo, 3))                # Print an alternate impurity measure.
log("weighted child Gini", round(weighted_child_gini_demo, 3))      # Print after-split impurity.
log("information gain", round(gain_tree_demo, 3))                   # Print the split improvement.

fig_tree_demo, axes_tree_demo = plt.subplots(1, 2, figsize=(10, 3.6))  # Create split-geometry and impurity panels.
axes_tree_demo[0].scatter(x_tree_demo[y_tree_demo == 0], np.zeros(np.sum(y_tree_demo == 0)), s=90, label="class 0")  # Draw class-0 points.
axes_tree_demo[0].scatter(x_tree_demo[y_tree_demo == 1], np.zeros(np.sum(y_tree_demo == 1)), s=90, label="class 1")  # Draw class-1 points.
axes_tree_demo[0].axvline(threshold_tree_demo, color="black", linestyle="--", label="threshold")  # Draw the candidate threshold.
axes_tree_demo[0].set_yticks([])                                    # Hide the unused vertical axis.
axes_tree_demo[0].set_xlabel("feature value")                       # Label the feature axis.
axes_tree_demo[0].set_title("Tree split: x <= 2.2")                 # Title the split panel.
axes_tree_demo[0].legend()                                          # Explain colors and threshold.
axes_tree_demo[1].bar(["parent", "children"], [parent_gini_demo, weighted_child_gini_demo], color=["gray", "seagreen"])  # Compare impurity before/after.
axes_tree_demo[1].set_ylabel("Gini impurity")                       # Label the impurity scale.
axes_tree_demo[1].set_title("Information gain = impurity drop")     # Title the score panel.
plt.tight_layout()                                                   # Keep the two panels from overlapping.
plt.show()                                                           # Render the decision-tree visualization.
```
▶ What you'll see: the dashed threshold makes the child nodes cleaner, so the weighted Gini bar drops below the parent bar.

### Step 2 — k-nearest neighbors: let nearby training points vote

kNN stores the training examples and waits until prediction time. For a new query point, it
computes distances, sorts neighbors, and predicts from the labels of the closest $k$ points.

```python
X_knn_demo = np.array([[0.0, 0.0], [0.4, 0.2], [0.2, 0.8], [2.0, 2.0], [2.4, 2.1], [2.1, 2.6], [1.2, 1.5]])  # Tiny 2-D training set.
y_knn_demo = np.array([0, 0, 0, 1, 1, 1, 0])                  # Class labels for the training points.
query_knn_demo = np.array([1.45, 1.55])                       # New point whose label we want.
dist_knn_demo = np.linalg.norm(X_knn_demo - query_knn_demo, axis=1)  # Euclidean distance from query to each point.
order_knn_demo = np.argsort(dist_knn_demo)                    # Neighbor indices sorted from nearest to farthest.
k_knn_demo = 3                                                 # Use the three closest neighbors for the main vote.
neighbors_knn_demo = order_knn_demo[:k_knn_demo]               # Select the k nearest indices.
votes_knn_demo = np.bincount(y_knn_demo[neighbors_knn_demo], minlength=2)  # Count class votes among those neighbors.
pred_knn_demo = int(np.argmax(votes_knn_demo))                 # Predict the class with the most votes.

log("all distances", np.round(dist_knn_demo, 3))               # Print every distance so the ranking is inspectable.
log("nearest order", order_knn_demo)                           # Print nearest-to-farthest indices.
log("k=3 neighbor labels", y_knn_demo[neighbors_knn_demo])      # Print the voters' labels.
log("k=3 vote counts", votes_knn_demo)                         # Print class vote totals.
log("k=3 prediction", pred_knn_demo)                           # Print the majority-vote prediction.

for k_try_demo in [1, 3, 5, 7]:                                 # Compare several neighborhood sizes.
    near_try_demo = order_knn_demo[:k_try_demo]                 # Select the first k sorted neighbors.
    votes_try_demo = np.bincount(y_knn_demo[near_try_demo], minlength=2)  # Count votes for this k.
    log(f"k={k_try_demo} votes", votes_try_demo)                # Print how the vote changes with k.

plt.scatter(X_knn_demo[y_knn_demo == 0, 0], X_knn_demo[y_knn_demo == 0, 1], s=85, label="class 0")  # Draw class-0 training points.
plt.scatter(X_knn_demo[y_knn_demo == 1, 0], X_knn_demo[y_knn_demo == 1, 1], s=85, label="class 1")  # Draw class-1 training points.
plt.scatter(query_knn_demo[0], query_knn_demo[1], s=170, marker="*", color="black", label=f"query → class {pred_knn_demo}")  # Draw the query.
plt.scatter(X_knn_demo[neighbors_knn_demo, 0], X_knn_demo[neighbors_knn_demo, 1], s=260, facecolors="none", edgecolors="black", linewidths=2, label="k=3 neighbors")  # Ring the voters.
plt.xlabel("feature 1")                                         # Label the horizontal feature.
plt.ylabel("feature 2")                                         # Label the vertical feature.
plt.title("kNN predicts from nearby votes")                     # Title the local-vote picture.
plt.legend()                                                     # Identify points, query, and voters.
plt.show()                                                       # Render the kNN visualization.
```
▶ What you'll see: the query star is classified by the circled nearby points, and changing $k$ changes which labels get to vote.

### Step 3 — Bagging and random forests: average noisy trees to reduce variance

A deep tree can be unstable, so bagging trains many trees on bootstrap samples and averages
or votes. Random forests add feature randomness to make trees less correlated, which makes
that averaging more effective.

```python
true_value_demo = 10.0                                            # Pretend the correct prediction at one query is 10.
num_trees_demo = 6                                                 # Build a tiny ensemble we can inspect by hand.
tree_preds_demo = true_value_demo + np.random.normal(0.0, 3.0, size=num_trees_demo)  # Simulate noisy tree predictions.
bagged_pred_demo = tree_preds_demo.mean()                         # Average the predictions like bagging.
log("individual tree predictions", np.round(tree_preds_demo, 2))  # Show the high-variance single-tree outputs.
log("bagged average", round(bagged_pred_demo, 2))                 # Show the stabilized ensemble output.

max_trees_demo = 30                                                # Compare ensemble sizes from 1 to 30.
trials_bag_demo = 2000                                             # Repeat many ensembles to estimate prediction variance.
shared_noise_demo = np.random.normal(0.0, 1.6, size=(trials_bag_demo, 1))  # Shared error makes tree predictions correlated.
private_noise_demo = np.random.normal(0.0, 2.4, size=(trials_bag_demo, max_trees_demo))  # Tree-specific error can cancel by averaging.
bag_errors_demo = shared_noise_demo + private_noise_demo           # Bagging-like errors still share some structure.
forest_errors_demo = 0.3 * shared_noise_demo + private_noise_demo  # Forest-like errors are less correlated after feature randomness.
bag_means_demo = np.cumsum(bag_errors_demo, axis=1) / np.arange(1, max_trees_demo + 1)  # Average first B bagged errors.
forest_means_demo = np.cumsum(forest_errors_demo, axis=1) / np.arange(1, max_trees_demo + 1)  # Average first B forest errors.
bag_var_demo = bag_means_demo.var(axis=0)                          # Estimate variance of bagged averages.
forest_var_demo = forest_means_demo.var(axis=0)                    # Estimate variance of decorrelated forest averages.
B_values_demo = np.arange(1, max_trees_demo + 1)                   # Ensemble-size axis for plotting.

sample_boot_demo = np.array([4.0, 6.0, 8.0, 10.0, 12.0])           # Tiny target sample for bootstrap intuition.
boot_ids_demo = np.random.randint(0, len(sample_boot_demo), size=(3, len(sample_boot_demo)))  # Draw rows with replacement.
boot_means_demo = np.array([sample_boot_demo[ids_demo].mean() for ids_demo in boot_ids_demo])  # Average each bootstrap sample.
log("bootstrap index rows", boot_ids_demo)                        # Show repeated and omitted rows.
log("bootstrap means", np.round(boot_means_demo, 2))              # Show different trees see different samples.
log("bag variance at B=30", round(bag_var_demo[-1], 3))           # Print variance after averaging many correlated trees.
log("forest variance at B=30", round(forest_var_demo[-1], 3))     # Print variance after averaging less-correlated trees.

plt.plot(B_values_demo, bag_var_demo, marker="o", markersize=3, label="bagging-like correlated trees")  # Plot correlated averaging.
plt.plot(B_values_demo, forest_var_demo, marker="s", markersize=3, label="forest-like decorrelated trees")  # Plot decorrelated averaging.
plt.xlabel("number of averaged trees B")                          # Label the ensemble-size axis.
plt.ylabel("variance of averaged prediction")                     # Label the variance being reduced.
plt.title("Averaging lowers variance; decorrelation helps more")  # Title the bagging/forest picture.
plt.legend()                                                       # Identify the two curves.
plt.show()                                                         # Render the variance-reduction plot.
```
▶ What you'll see: averaging many trees lowers prediction variance, and the less-correlated forest-like curve drops farther.

### Step 4 — Boosting: add small models that fix current mistakes

Boosting builds an additive model one weak learner at a time. In squared-error regression,
the next learner fits the **residuals** $y-F(x)$ — the mistakes left by the current ensemble.

```python
x_boost_demo = np.array([0.0, 0.5, 1.0, 1.5, 2.0, 2.5])           # One-dimensional inputs so stumps are easy to see.
y_boost_demo = np.array([1.0, 1.2, 1.1, 2.8, 3.0, 3.2])           # Targets with a jump near the middle.
pred_boost_demo = np.full_like(y_boost_demo, y_boost_demo.mean()) # Start with the best constant prediction.
start_pred_demo = pred_boost_demo.copy()                         # Save the initial prediction for plotting.
learning_rate_demo = 0.8                                          # Shrink each residual correction.
thresholds_boost_demo = (x_boost_demo[:-1] + x_boost_demo[1:]) / 2.0  # Candidate stump thresholds.
mse_history_demo = [np.mean((y_boost_demo - pred_boost_demo) ** 2)]  # Track mean squared error by round.
log("initial prediction", np.round(start_pred_demo, 3))            # Print the flat starting model.
log("initial MSE", round(mse_history_demo[0], 3))                  # Print starting error.

for round_demo in range(3):                                        # Run three boosting rounds by hand.
    residual_demo = y_boost_demo - pred_boost_demo                 # Compute current mistakes y - F(x).
    best_loss_demo = np.inf                                        # Start with no best stump yet.
    best_correction_demo = None                                    # Store the best stump's residual predictions.
    best_threshold_demo = None                                     # Store the best threshold.
    for threshold_demo in thresholds_boost_demo:                   # Try every one-split stump.
        left_demo = x_boost_demo <= threshold_demo                 # Identify points on the left side.
        right_demo = ~left_demo                                    # Identify points on the right side.
        left_value_demo = residual_demo[left_demo].mean()          # Best left leaf predicts mean residual.
        right_value_demo = residual_demo[right_demo].mean()        # Best right leaf predicts mean residual.
        correction_try_demo = np.where(left_demo, left_value_demo, right_value_demo)  # Candidate residual correction.
        loss_try_demo = np.mean((residual_demo - correction_try_demo) ** 2)  # Score how well the stump fits residuals.
        if loss_try_demo < best_loss_demo:                         # Keep the lowest residual loss.
            best_loss_demo = loss_try_demo                         # Update the best loss.
            best_correction_demo = correction_try_demo             # Update the best correction vector.
            best_threshold_demo = threshold_demo                   # Update the best threshold.
    pred_boost_demo = pred_boost_demo + learning_rate_demo * best_correction_demo  # Add the shrunken weak learner.
    mse_history_demo.append(np.mean((y_boost_demo - pred_boost_demo) ** 2))  # Record new ensemble error.
    if round_demo == 0:                                            # Save the one-round model for plotting.
        one_round_pred_demo = pred_boost_demo.copy()               # Copy predictions after the first correction.
    log(f"round {round_demo + 1} best threshold", round(best_threshold_demo, 3))  # Print the chosen stump split.
    log(f"round {round_demo + 1} MSE", round(mse_history_demo[-1], 4))  # Print the updated error.

plt.scatter(x_boost_demo, y_boost_demo, s=90, color="black", label="targets")  # Draw the training targets.
plt.step(x_boost_demo, start_pred_demo, where="mid", label=f"start MSE={mse_history_demo[0]:.2f}")  # Draw the constant start.
plt.step(x_boost_demo, one_round_pred_demo, where="mid", label=f"1 round MSE={mse_history_demo[1]:.2f}")  # Draw after one correction.
plt.step(x_boost_demo, pred_boost_demo, where="mid", label=f"3 rounds MSE={mse_history_demo[-1]:.2f}")  # Draw final boosted predictions.
plt.xlabel("x")                                                     # Label the input axis.
plt.ylabel("prediction")                                           # Label the target/prediction scale.
plt.title("Boosting adds residual-correction stumps")              # Title the boosting picture.
plt.legend()                                                        # Identify targets and model stages.
plt.show()                                                          # Render the boosting progress plot.
```
▶ What you'll see: each round chooses a stump for the remaining residuals, and the MSE decreases as the step function moves toward the targets.

### Recap — what you just ran

- **Decision trees** scored a threshold by reducing impurity, using Gini, entropy, and information gain.
- **kNN** predicted from Euclidean distances, sorted neighbors, and a local majority vote.
- **Bagging and random forests** averaged noisy trees; decorrelating trees made the variance drop farther.
- **Boosting** added weak residual-correction stumps one round at a time.

Everything below (starting at **§1 Overview**) develops these same ideas with fuller examples,
model comparisons, and an interactive experiment.

---

## 1. Overview

Trees, ensembles, and $k$-nearest neighbors are flexible non-parametric methods: instead of imposing one global linear formula, they adapt their predictions to local regions of the data. A single tree is easy to inspect but high-variance, a forest or boosting model combines many weak trees, and kNN predicts directly from nearby training examples.

**One-line intuition:** decision trees carve feature space into rectangles, ensembles stabilize or improve many such trees, and kNN lets the training set itself vote locally.

## 2. Key Idea

### Decision-tree splitting

A CART tree chooses binary rules of the form

$$
R_\text{left}(j,t)=\{x:x_j\le t\},\qquad R_\text{right}(j,t)=\{x:x_j>t\}.
$$

For class proportions $p_k$ in a node, the exact impurities used in this notebook are

$$
Gini = 1-\sum_k p_k^2
$$

and

$$
Entropy = -\sum_k p_k\log p_k.
$$

The information gain for a split is

$$
IG(D_p,f)=I(D_p)-\frac{N_\text{left}}{N}I(D_\text{left})-\frac{N_\text{right}}{N}I(D_\text{right}).
$$

For regression trees, replace class impurity with squared-error reduction. CART pseudocode:

```text
Start with all examples at the root.
For every feature and candidate threshold:
  Split examples into left and right children.
  Score the split by weighted child impurity.
Choose the split with largest information gain.
Repeat recursively until a stopping rule is reached.
Predict by the majority class or average response in the reached leaf.
```

### k-nearest neighbors

kNN predicts a query $x$ from its nearest training examples under a distance such as

$$
d(x,x^{(i)})=\left\|x-x^{(i)}\right\|_2.
$$

For classification,

$$
\hat{y}(x)=\operatorname*{mode}_{i\in N_k(x)} y^{(i)}.
$$

For regression,

$$
\hat{y}(x)=\frac{1}{k}\sum_{i\in N_k(x)}y^{(i)}.
$$

Higher $k$ increases bias and lowers variance; lower $k$ lowers bias and raises variance.

### Bagging, random forests, and boosting

Bagging trains predictors on bootstrap samples and averages or votes:

$$
\hat{f}_\text{bag}(x)=\frac{1}{B}\sum_{b=1}^{B}\hat{f}^{(b)}(x),\qquad
\hat{y}_\text{bag}(x)=\operatorname*{mode}_{b=1}^{B}\hat{y}^{(b)}(x).
$$

Random forests are bagged trees that also use randomly selected feature subsets at splits, which decorrelates trees and improves variance reduction. Boosting combines weak learners sequentially:

$$
F_M(x)=\sum_{m=1}^{M}\alpha_m h_m(x).
$$

Adaptive boosting puts high weights on errors to improve at the next boosting step; gradient boosting trains weak learners on remaining errors or residuals.

```text
Random forest:
  Draw many bootstrap samples.
  Train a tree on each sample while considering random feature subsets.
  Predict by voting or averaging.

Boosting:
  Start with a weak model.
  Find examples or residuals the current model handles poorly.
  Fit another weak learner to that remaining signal.
  Add it to the ensemble.
```

## 3. Hands-on Notebook

### Setup

Run this first. The install line is commented because Colab usually includes these packages; uncomment it if your runtime is missing a dependency.

```python
# !pip -q install numpy pandas matplotlib scikit-learn ipywidgets  # install dependencies only when a fresh runtime lacks them.
import numpy as np  # use vectorized arrays for impurity, distance, bootstrap, and prediction calculations.
import pandas as pd  # use small tables for readable split and feature-importance summaries.
import matplotlib.pyplot as plt  # use plots because boundaries, votes, and residuals are visual ideas.
from sklearn.datasets import make_blobs, make_moons, make_circles, make_classification, make_gaussian_quantiles, load_iris  # use built-in data so the notebook runs offline.
from sklearn.model_selection import train_test_split  # create held-out splits to separate fitting from generalization.
from sklearn.preprocessing import StandardScaler  # scale features before distance-based kNN when units differ.
from sklearn.tree import DecisionTreeClassifier  # use CART after one from-scratch split search.
from sklearn.neighbors import KNeighborsClassifier  # use kNN for local-voting decision regions.
from sklearn.ensemble import RandomForestClassifier, AdaBoostClassifier, GradientBoostingRegressor, BaggingClassifier  # use ensemble estimators for forests, boosting, and bagging.
from sklearn.metrics import accuracy_score, confusion_matrix, ConfusionMatrixDisplay, mean_squared_error  # evaluate classification and regression examples.
try:  # try to enable live Colab controls.
    from ipywidgets import interact, IntSlider, Dropdown  # import widgets for the interactive experiment.
except ModuleNotFoundError:  # keep the notebook runnable without widget support.
    class _FallbackWidget:  # create a tiny replacement that stores default values.
        def __init__(self, value=None, **kwargs):  # accept widget-like keyword arguments.
            self.value = value  # remember the default value for non-interactive execution.
    IntSlider = _FallbackWidget  # replace integer sliders with the fallback holder.
    Dropdown = _FallbackWidget  # replace dropdowns with the fallback holder.
    def interact(function, **controls):  # define a fallback that calls the function once.
        values = {name: control.value for name, control in controls.items()}  # collect default values from controls.
        return function(**values)  # execute one static version of the interactive plot.
np.random.seed(229)  # seed legacy NumPy randomness for reproducible sklearn examples.
RNG = np.random.default_rng(229)  # seed modern NumPy randomness for custom sampling.
plt.style.use("seaborn-v0_8-whitegrid")  # use a clear grid style for teaching plots.
COLORS = np.array(["#4C72B0", "#DD8452", "#55A868", "#C44E52", "#8172B3"])  # define stable colors for classes.
def plot_decision_regions(model, X, y, ax=None, title="", grid_step=0.035):  # make one reusable boundary plotter.
    ax = plt.gca() if ax is None else ax  # draw on the current axes when no panel is supplied.
    x_min = X[:, 0].min() - 0.7  # add left margin around the data.
    x_max = X[:, 0].max() + 0.7  # add right margin around the data.
    y_min = X[:, 1].min() - 0.7  # add lower margin around the data.
    y_max = X[:, 1].max() + 0.7  # add upper margin around the data.
    xx, yy = np.meshgrid(np.arange(x_min, x_max, grid_step), np.arange(y_min, y_max, grid_step))  # create many query points.
    grid = np.c_[xx.ravel(), yy.ravel()]  # flatten the grid for sklearn prediction.
    Z = model.predict(grid).reshape(xx.shape)  # reshape predicted labels back to a grid.
    ax.contourf(xx, yy, Z, alpha=0.24, levels=np.arange(len(np.unique(y)) + 1) - 0.5, colors=COLORS[:len(np.unique(y))])  # color decision regions.
    for label in np.unique(y):  # overlay observed examples class by class.
        mask = y == label  # select examples with the current label.
        ax.scatter(X[mask, 0], X[mask, 1], s=32, color=COLORS[int(label) % len(COLORS)], edgecolor="white", linewidth=0.5, label=f"class {label}")  # draw labeled points.
    ax.set_title(title)  # title the panel.
    ax.set_xlabel("feature 1")  # label the horizontal feature.
    ax.set_ylabel("feature 2")  # label the vertical feature.
    return ax  # return axes for further annotation.
def plot_vote_confidence(model, X, y, ax=None, title="", grid_step=0.035):  # make one reusable probability plotter.
    ax = plt.gca() if ax is None else ax  # draw on the current axes when no panel is supplied.
    x_min = X[:, 0].min() - 0.7  # add left margin around the data.
    x_max = X[:, 0].max() + 0.7  # add right margin around the data.
    y_min = X[:, 1].min() - 0.7  # add lower margin around the data.
    y_max = X[:, 1].max() + 0.7  # add upper margin around the data.
    xx, yy = np.meshgrid(np.arange(x_min, x_max, grid_step), np.arange(y_min, y_max, grid_step))  # create many query points.
    grid = np.c_[xx.ravel(), yy.ravel()]  # flatten grid points for prediction.
    proba = model.predict_proba(grid)[:, 1].reshape(xx.shape)  # compute class-1 vote probability.
    image = ax.contourf(xx, yy, proba, levels=np.linspace(0, 1, 21), cmap="RdBu_r", alpha=0.70)  # show confidence as a smooth color map.
    for label in np.unique(y):  # overlay observed examples class by class.
        mask = y == label  # select examples with the current label.
        ax.scatter(X[mask, 0], X[mask, 1], s=30, color=COLORS[int(label)], edgecolor="white", linewidth=0.5, label=f"class {label}")  # draw labeled points.
    ax.set_title(title)  # title the panel.
    ax.set_xlabel("feature 1")  # label the horizontal feature.
    ax.set_ylabel("feature 2")  # label the vertical feature.
    plt.colorbar(image, ax=ax, fraction=0.046, pad=0.04, label="P(class 1)")  # add probability scale.
    return ax  # return axes for further annotation.
def make_lesson_data(source="overfit_moons", random_state=229):  # centralize swappable dataset creation.
    if source == "blobs":  # create compact Gaussian clusters.
        X, y = make_blobs(n_samples=360, centers=2, cluster_std=1.35, random_state=random_state)  # generate easy two-class blobs.
    elif source == "moons":  # create curved non-linear classes.
        X, y = make_moons(n_samples=360, noise=0.24, random_state=random_state)  # generate standard noisy moons.
    elif source == "circles":  # create nested non-linear classes.
        X, y = make_circles(n_samples=360, noise=0.12, factor=0.45, random_state=random_state)  # generate concentric circles.
    elif source == "iris":  # create a real binary Iris view.
        iris = load_iris()  # load Iris without network access.
        X = iris.data[:, [2, 3]]  # use petal length and width for a clean 2-D view.
        y = (iris.target == 0).astype(int)  # convert to binary setosa-vs-rest labels.
    elif source == "overfit_moons":  # create a noisy small case where a deep tree overfits.
        X, y = make_moons(n_samples=180, noise=0.36, random_state=random_state)  # generate noisy moons with limited samples.
    else:  # reject invalid names early.
        raise ValueError("Choose blobs, moons, circles, iris, or overfit_moons.")  # give a precise correction.
    return X.astype(float), y.astype(int)  # return numeric arrays.
```

### Data — swappable sources

This notebook uses one `DATA_SOURCE` toggle. The `overfit_moons` option is intentionally included because a single deep tree can memorize noisy local rectangles there.

```python
DATA_SOURCE = "overfit_moons"  # choose "blobs", "moons", "circles", "iris", or "overfit_moons".
X_data, y_data = make_lesson_data(DATA_SOURCE)  # load the selected data source.
print(f"Loaded {DATA_SOURCE} with shape {X_data.shape}.")  # report the matrix size.
print("Class counts:", np.bincount(y_data))  # check class balance before modeling.
print("Feature means:", np.round(X_data.mean(axis=0), 3))  # inspect feature location.
print("Feature standard deviations:", np.round(X_data.std(axis=0), 3))  # inspect feature scale.
```

```python
plt.figure(figsize=(6.5, 5.2))  # create the raw-data plot.
for label in np.unique(y_data):  # plot each class separately.
    mask = y_data == label  # select one class.
    plt.scatter(X_data[mask, 0], X_data[mask, 1], s=42, color=COLORS[int(label)], edgecolor="white", linewidth=0.5, alpha=0.9, label=f"class {label}")  # draw raw labeled examples.
plt.title(f"Raw data: {DATA_SOURCE}")  # show the active source in the title.
plt.xlabel("feature 1")  # label the first feature.
plt.ylabel("feature 2")  # label the second feature.
plt.legend()  # show class labels.
plt.show()  # render the raw dataset.
```

▶ What you'll see: blobs are easy, moons and circles need nonlinear boundaries, Iris is real data, and `overfit_moons` has noisy points a deep tree can memorize.

### 📖 Concept walkthrough — build each idea from scratch

Before the warm-up examples, we build every Key Idea concept from scratch, one small step at a time. Each concept explains not just *what* the code does but *why* this code and *why* this logic. Everything here uses only NumPy + Matplotlib and tiny inline data, so you can read each printed value and watch the idea assemble. Variables carry a `_w` suffix so they never collide with the examples below.

```python
import numpy as np  # NumPy gives us arrays, counts, distances, bootstrap samples, and vectorized arithmetic.
import matplotlib.pyplot as plt  # Matplotlib makes split quality, neighbors, variance, and residuals visible.
np.random.seed(0)  # fix the random seed so every printed value and plot is reproducible.
```

#### 1. Decision-tree splitting: impurity, weighted children, and information gain

A decision tree asks one local question at a time: "does this feature fall below a threshold?" The best question is the one that makes the child nodes purer than the parent, because pure leaves make confident majority-class predictions. We build the split score by hand from class counts so the formula $1-\sum_k p_k^2$, entropy $-\sum_k p_k\log p_k$, and information gain all become inspectable numbers.

```python
y_node_w = np.array([0, 0, 0, 1, 1, 2])  # store labels currently sitting in one candidate tree node.
counts_w = np.bincount(y_node_w, minlength=3)  # count how many examples of each class the node contains.
probs_w = counts_w / counts_w.sum()  # convert counts into class proportions p_k.
gini_w = 1.0 - np.sum(probs_w ** 2)  # compute Gini impurity as 1 minus the probability two random labels match.
nonzero_w = probs_w > 0  # guard log(0) because empty classes should contribute zero to entropy.
entropy_w = -np.sum(probs_w[nonzero_w] * np.log(probs_w[nonzero_w]))  # compute entropy using only positive probabilities.
print("class counts:", counts_w)  # inspect the raw class mix.
print("class proportions:", np.round(probs_w, 3))  # inspect the normalized p_k values.
print("Gini:", round(gini_w, 3), "Entropy:", round(entropy_w, 3))  # compare the two impurity measures.
```
▶ What you'll see: a mixed node has positive Gini and entropy because no single class dominates completely.

Gini is low when one $p_k$ is near 1, because $\sum_k p_k^2$ is then large. Entropy is also low for confident nodes and high for uncertain ones; the `nonzero_w` guard is needed because $p\log p$ tends to 0 as $p\to 0$.

```python
X_split_w = np.array([1.0, 1.4, 1.8, 2.6, 3.0, 3.3, 4.2, 4.6])  # use one sorted feature so a threshold split is easy to audit.
y_split_w = np.array([0, 0, 0, 1, 1, 1, 0, 1])  # attach binary labels to those feature values.
threshold_w = 2.2  # try one candidate CART threshold x <= 2.2.
left_w = X_split_w <= threshold_w  # send small feature values to the left child.
right_w = ~left_w  # send the remaining feature values to the right child.
parent_counts_w = np.bincount(y_split_w, minlength=2)  # count labels before the split.
left_counts_w = np.bincount(y_split_w[left_w], minlength=2)  # count labels in the left child.
right_counts_w = np.bincount(y_split_w[right_w], minlength=2)  # count labels in the right child.
print("parent counts:", parent_counts_w)  # inspect the unsplit node.
print("left counts:", left_counts_w, "right counts:", right_counts_w)  # inspect the children produced by the threshold.
```
▶ What you'll see: the threshold isolates three class-0 examples on the left and leaves a mixed right child.

```python
def gini_from_counts_w(counts_w):  # define a tiny impurity helper for any node's class counts.
    total_w = counts_w.sum()  # compute how many examples are in this node.
    if total_w == 0:  # guard divide-by-zero for impossible empty children.
        return 0.0  # give empty nodes zero contribution because their split weight will be zero.
    p_w = counts_w / total_w  # convert counts to class proportions.
    return float(1.0 - np.sum(p_w ** 2))  # return Gini impurity as a plain Python float.
parent_gini_w = gini_from_counts_w(parent_counts_w)  # compute parent impurity before splitting.
left_gini_w = gini_from_counts_w(left_counts_w)  # compute left-child impurity.
right_gini_w = gini_from_counts_w(right_counts_w)  # compute right-child impurity.
weight_left_w = left_w.mean()  # compute N_left / N.
weight_right_w = right_w.mean()  # compute N_right / N.
weighted_child_w = weight_left_w * left_gini_w + weight_right_w * right_gini_w  # average child impurities by child size.
gain_w = parent_gini_w - weighted_child_w  # information gain is impurity removed by the split.
print("parent Gini:", round(parent_gini_w, 3))  # print impurity before the split.
print("weighted child Gini:", round(weighted_child_w, 3))  # print impurity after the split.
print("information gain:", round(gain_w, 3))  # print how much uncertainty the split removed.
```
▶ What you'll see: the weighted child impurity is lower than the parent impurity, so the information gain is positive.

Information gain is

$$
IG = I(D_p)-\frac{N_\text{left}}{N}I(D_\text{left})-\frac{N_\text{right}}{N}I(D_\text{right}).
$$

The child impurities are weighted because a huge pure child and a tiny messy child should not count the same. Lower impurity means the labels inside a child agree more often, so the leaf's majority vote will make fewer local mistakes.

```python
plt.figure(figsize=(6, 3.5))  # create a compact split-quality bar chart.
plt.bar(["before split", "after split"], [parent_gini_w, weighted_child_w], color=["gray", "seagreen"])  # compare parent impurity to weighted child impurity.
plt.ylabel("Gini impurity")  # label the score being minimized.
plt.title("1: impurity drops after a useful split")  # make the split-quality lesson explicit.
plt.ylim(0, max(parent_gini_w, weighted_child_w) + 0.15)  # leave space above the taller bar.
plt.show()  # render the before-versus-after impurity plot.
```
▶ What you'll see: the after-split bar is lower, which is exactly why CART prefers this threshold.

```python
plt.figure(figsize=(6, 3.2))  # create a one-dimensional threshold plot.
plt.scatter(X_split_w[y_split_w == 0], np.zeros(np.sum(y_split_w == 0)), s=90, color="steelblue", label="class 0")  # draw class-0 points on the feature line.
plt.scatter(X_split_w[y_split_w == 1], np.zeros(np.sum(y_split_w == 1)), s=90, color="darkorange", label="class 1")  # draw class-1 points on the feature line.
plt.axvline(threshold_w, color="black", linestyle="--", label="threshold")  # show the rule x <= threshold.
plt.yticks([])  # hide the vertical axis because this is a one-feature split.
plt.xlabel("feature value")  # label the feature being thresholded.
plt.title("1: CART split on one feature")  # title the figure with the subsection number.
plt.legend()  # identify classes and threshold.
plt.show()  # render the split geometry.
```
▶ What you'll see: the dashed line separates a pure left child from a less-pure right child.

*Why it's done this way: a tree is greedy, so it needs a local score for each candidate rule. Information gain is that score: choose the threshold that removes the most weighted impurity now, then repeat inside each child.*

#### 2. k-nearest neighbors: distances, sorting, and majority vote

kNN does not learn a global equation; it keeps the training examples and lets nearby points vote for each query. We build the prediction from Euclidean distances $\lVert x-x^{(i)}\rVert_2$, a sorted neighbor list, and a majority vote because those three steps are the entire algorithm. This also shows why changing $k$ changes the bias-variance tradeoff: small $k$ listens to local detail, while large $k$ smooths over it.

```python
X_knn_w = np.array([[0.0, 0.0], [0.4, 0.2], [0.2, 0.8], [2.0, 2.0], [2.4, 2.1], [2.1, 2.6], [1.2, 1.5]])  # create a tiny labeled 2-D training set.
y_knn_w = np.array([0, 0, 0, 1, 1, 1, 0])  # assign class labels to the training points.
query_w = np.array([1.45, 1.55])  # choose one new point whose label we want to predict.
dist_knn_w = np.linalg.norm(X_knn_w - query_w, axis=1)  # compute Euclidean distance from the query to every training point.
order_w = np.argsort(dist_knn_w)  # sort point indices from nearest to farthest.
print("distances:", np.round(dist_knn_w, 3))  # inspect all query-to-training distances.
print("nearest order:", order_w)  # inspect the sorted neighbor indices.
```
▶ What you'll see: every training point receives a distance, and the smallest distances define the local neighborhood.

```python
k_w = 3  # choose a small odd k so the majority vote cannot tie in this binary example.
neighbors_w = order_w[:k_w]  # take the first k sorted indices as the nearest neighbors.
votes_w = np.bincount(y_knn_w[neighbors_w], minlength=2)  # count class labels among the nearest neighbors.
pred_w = np.argmax(votes_w)  # choose the class with the largest vote count.
print("k nearest indices:", neighbors_w)  # print which training examples get to vote.
print("neighbor labels:", y_knn_w[neighbors_w])  # print the labels of those voters.
print("vote counts:", votes_w, "prediction:", pred_w)  # print the majority vote and predicted class.
```
▶ What you'll see: the query is classified by the labels of only its three closest examples.

The majority vote is just $\operatorname*{mode}_{i\in N_k(x)}y^{(i)}$. The distance formula decides who is local; the vote turns that local label distribution into a prediction.

```python
for k_try_w in [1, 3, 5, 7]:  # test several neighborhood sizes on the same query.
    nb_w = order_w[:k_try_w]  # select the k closest points for this value of k.
    vote_w = np.bincount(y_knn_w[nb_w], minlength=2)  # count labels in that neighborhood.
    pred_try_w = np.argmax(vote_w)  # choose the class with the most votes.
    print("k =", k_try_w, "neighbors =", nb_w, "votes =", vote_w, "prediction =", pred_try_w)  # compare how k changes the decision.
```
▶ What you'll see: small and large neighborhoods can vote differently because they include different amounts of surrounding structure.

```python
plt.figure(figsize=(5.5, 4.5))  # create a compact kNN geometry plot.
plt.scatter(X_knn_w[y_knn_w == 0, 0], X_knn_w[y_knn_w == 0, 1], s=85, color="steelblue", label="class 0")  # draw class-0 training points.
plt.scatter(X_knn_w[y_knn_w == 1, 0], X_knn_w[y_knn_w == 1, 1], s=85, color="darkorange", label="class 1")  # draw class-1 training points.
plt.scatter(query_w[0], query_w[1], s=170, marker="*", color="black", label=f"query → class {pred_w}")  # draw the query and its predicted class.
plt.scatter(X_knn_w[neighbors_w, 0], X_knn_w[neighbors_w, 1], s=260, facecolors="none", edgecolors="black", linewidths=2.0, label="k=3 neighbors")  # ring the voters used for prediction.
plt.title("2: kNN predicts by nearby votes")  # title the figure with the subsection number.
plt.xlabel("feature 1")  # label the horizontal feature.
plt.ylabel("feature 2")  # label the vertical feature.
plt.legend()  # keep classes, query, and neighbors identifiable.
plt.show()  # render the local-vote picture.
```
▶ What you'll see: the query star is surrounded by the circled neighbors that determine its predicted label.

*Why it's done this way: kNN trusts locality — points close in feature space should have similar labels. Sorting distances makes that locality explicit, and majority vote converts nearby examples into a simple non-parametric classifier.*

#### 3. Bagging and random forests: averaging noisy trees to reduce variance

A single deep tree can change a lot if the training data changes slightly, which means high variance. Bagging trains many such predictors on bootstrap samples and averages them; random forests add random feature subsets so the trees are less correlated before averaging. We build the variance reduction directly: if independent tree errors have variance $\sigma^2$, averaging $B$ of them gives variance $\sigma^2/B$.

```python
true_value_w = 10.0  # pretend the true prediction at one query point should be 10.
B_demo_w = 6  # draw a small number of noisy tree-like predictions to inspect by hand.
tree_preds_w = true_value_w + np.random.normal(0.0, 3.0, size=B_demo_w)  # simulate high-variance trees around the truth.
bagged_pred_w = np.mean(tree_preds_w)  # average the noisy predictors like bagging does.
print("individual tree predictions:", np.round(tree_preds_w, 2))  # inspect how much single trees wobble.
print("bagged average:", round(bagged_pred_w, 2), "true value:", true_value_w)  # compare the average to the target.
```
▶ What you'll see: individual predictions jump around, while their average is more stable.

Averaging works because positive and negative errors cancel. With independent errors $\epsilon_b$, the average error is $\frac{1}{B}\sum_b\epsilon_b$, whose variance is $\sigma^2/B$; random forests try to make tree errors less correlated so this cancellation is closer to true.

```python
max_B_w = 40  # allow ensemble sizes from 1 to 40.
trials_w = 2000  # repeat many synthetic experiments so variance estimates are stable.
sigma_w = 3.0  # set the standard deviation of one noisy tree.
noise_w = np.random.normal(0.0, sigma_w, size=(trials_w, max_B_w))  # simulate many independent tree errors.
ensemble_means_w = np.cumsum(noise_w, axis=1) / np.arange(1, max_B_w + 1)  # compute running averages for B = 1,...,40.
variance_by_B_w = np.var(ensemble_means_w, axis=0)  # estimate variance of the averaged prediction for each B.
print("variance at B=1:", round(variance_by_B_w[0], 3))  # inspect variance for a single tree.
print("variance at B=10:", round(variance_by_B_w[9], 3))  # inspect variance after averaging ten trees.
print("variance at B=40:", round(variance_by_B_w[39], 3))  # inspect variance after averaging forty trees.
```
▶ What you'll see: the variance shrinks quickly as more predictors are averaged.

```python
B_values_w = np.arange(1, max_B_w + 1)  # create the x-axis of ensemble sizes.
theory_w = sigma_w ** 2 / B_values_w  # compute the ideal independent-error variance curve.
plt.figure(figsize=(6, 3.6))  # create a variance-shrinkage plot.
plt.plot(B_values_w, variance_by_B_w, marker="o", markersize=3, label="simulated averaging")  # plot observed variance from repeated experiments.
plt.plot(B_values_w, theory_w, linestyle="--", color="black", label=r"$\sigma^2/B$")  # plot the theoretical 1/B curve.
plt.xlabel("number of averaged trees B")  # label the ensemble size.
plt.ylabel("prediction variance")  # label the variance being reduced.
plt.title("3: bagging reduces variance by averaging")  # title the figure with the subsection number.
plt.legend()  # distinguish simulation from theory.
plt.show()  # render the variance curve.
```
▶ What you'll see: the simulated variance follows the dashed $1/B$ curve closely.

```python
sample_w = np.array([4.0, 6.0, 8.0, 10.0, 12.0])  # create a tiny training target sample for bootstrap intuition.
boot_ids_w = np.random.randint(0, len(sample_w), size=(4, len(sample_w)))  # draw four bootstrap resamples with replacement.
boot_means_w = np.array([sample_w[ids_w].mean() for ids_w in boot_ids_w])  # compute one resampled estimate per bootstrap draw.
print("bootstrap index rows:\n", boot_ids_w)  # show that bootstrap samples repeat some rows and omit others.
print("bootstrap means:", np.round(boot_means_w, 2))  # inspect the noisy estimates trained on resampled data.
print("bagged bootstrap mean:", round(boot_means_w.mean(), 2))  # average the resampled estimates like a bagged ensemble.
```
▶ What you'll see: each bootstrap sample gives a slightly different estimate, and averaging smooths them.

*Why it's done this way: bagging targets variance, not bias — it keeps flexible trees but averages away their instability. Random forests strengthen the same effect by decorrelating trees through feature randomness before the final vote or average.*

#### 4. Boosting: sequential residual correction

Boosting takes the opposite personality from bagging: instead of fitting many independent models, it fits the next weak learner to what the current ensemble still gets wrong. For squared-error regression, those remaining errors are residuals, so each new stump is a small correction added to the running prediction. We build three rounds by hand to see the model become a sum $F_M(x)=\sum_{m=1}^M\alpha_m h_m(x)$ and the error decrease.

```python
X_boost_w = np.array([0.0, 0.5, 1.0, 1.5, 2.0, 2.5])  # create one-dimensional inputs so stumps are visible.
y_boost_w = np.array([1.0, 1.2, 1.1, 2.8, 3.0, 3.2])  # create targets with a clear jump near x = 1.5.
F_boost_w = np.full_like(y_boost_w, y_boost_w.mean())  # start from the best constant prediction for squared error.
print("x values:", X_boost_w)  # inspect the training inputs.
print("targets:", y_boost_w)  # inspect the regression targets.
print("initial constant prediction:", np.round(F_boost_w, 3))  # inspect the starting ensemble.
```
▶ What you'll see: the initial prediction is flat, so it misses the low-left and high-right pattern.

```python
def stump_predict_w(x_w, threshold_w, left_value_w, right_value_w):  # define a two-leaf regression stump.
    return np.where(x_w <= threshold_w, left_value_w, right_value_w)  # send each x to the left or right leaf value.
def fit_stump_to_target_w(x_w, target_w):  # fit one stump to the current target values or residuals.
    thresholds_w = (x_w[:-1] + x_w[1:]) / 2.0  # try midpoints so every split has data on both sides.
    best_loss_w = np.inf  # initialize the best squared error as infinitely bad.
    best_params_w = None  # store the best threshold and leaf values.
    for threshold_try_w in thresholds_w:  # evaluate every candidate split.
        left_mask_w = x_w <= threshold_try_w  # identify points going left.
        right_mask_w = ~left_mask_w  # identify points going right.
        left_value_w = target_w[left_mask_w].mean()  # optimal left leaf is the mean residual or target there.
        right_value_w = target_w[right_mask_w].mean()  # optimal right leaf is the mean residual or target there.
        pred_try_w = stump_predict_w(x_w, threshold_try_w, left_value_w, right_value_w)  # predict with this candidate stump.
        loss_try_w = np.mean((target_w - pred_try_w) ** 2)  # score the candidate by mean squared error.
        if loss_try_w < best_loss_w:  # keep the split with the smallest residual error.
            best_loss_w = loss_try_w  # update the best loss.
            best_params_w = (threshold_try_w, left_value_w, right_value_w)  # update the best stump parameters.
    return best_params_w, best_loss_w  # return both the fitted stump and its training loss.
params1_w, loss1_w = fit_stump_to_target_w(X_boost_w, y_boost_w - F_boost_w)  # fit the first stump to initial residuals.
print("first stump params:", np.round(params1_w, 3), "residual loss:", round(loss1_w, 3))  # inspect the first correction.
```
▶ What you'll see: the first stump chooses a threshold near the jump and predicts different corrections on each side.

The residual is $y-F(x)$: positive where the ensemble is too low and negative where it is too high. Fitting the next stump to residuals is useful because it turns "fix the model" into an ordinary supervised problem whose target is the remaining error.

```python
learning_rate_w = 0.8  # shrink each correction so the additive model improves steadily rather than overshooting.
F_round_w = F_boost_w.copy()  # keep a running prediction vector for the ensemble.
stumps_w = []  # store the fitted correction stumps.
mse_history_w = [np.mean((y_boost_w - F_round_w) ** 2)]  # record the initial mean squared error.
for round_w in range(3):  # run three boosting rounds by hand.
    residual_w = y_boost_w - F_round_w  # compute what the current ensemble still misses.
    params_w, loss_w = fit_stump_to_target_w(X_boost_w, residual_w)  # fit a stump to those residuals.
    correction_w = stump_predict_w(X_boost_w, *params_w)  # compute the stump's correction on training points.
    F_round_w = F_round_w + learning_rate_w * correction_w  # add the shrunken correction to the ensemble.
    stumps_w.append(params_w)  # remember the stump parameters for inspection.
    mse_history_w.append(np.mean((y_boost_w - F_round_w) ** 2))  # record the new error after this round.
    print("round", round_w + 1, "params", np.round(params_w, 3), "MSE", round(mse_history_w[-1], 4))  # show each residual correction.
```
▶ What you'll see: each round adds a stump and the mean squared error decreases.

```python
F_one_w = F_boost_w + learning_rate_w * stump_predict_w(X_boost_w, *stumps_w[0])  # reconstruct the prediction after one round.
plt.figure(figsize=(6, 3.8))  # create a boosting progress plot.
plt.scatter(X_boost_w, y_boost_w, s=85, color="black", label="targets")  # draw the observed targets.
plt.step(X_boost_w, F_boost_w, where="mid", color="gray", label=f"start MSE={mse_history_w[0]:.2f}")  # draw the constant starting prediction.
plt.step(X_boost_w, F_one_w, where="mid", color="steelblue", label=f"1 round MSE={mse_history_w[1]:.2f}")  # draw the first corrected prediction.
plt.step(X_boost_w, F_round_w, where="mid", color="darkorange", label=f"3 rounds MSE={mse_history_w[-1]:.2f}")  # draw the final boosted prediction.
plt.xlabel("x")  # label the input feature.
plt.ylabel("prediction")  # label the target and model output scale.
plt.title("4: boosting adds residual-correction stumps")  # title the figure with the subsection number.
plt.legend()  # identify targets and ensemble stages.
plt.show()  # render the improvement over rounds.
```
▶ What you'll see: the boosted step function moves closer to the targets after each residual-correction round.

*Why it's done this way: boosting is additive repair. Each weak learner only needs to explain the current residuals, and the sum of many small corrections can fit structure that no single stump captures well.*

### 🟢 Basics (warm-up)

#### B1. Compute Gini impurity for one labeled node

**Goal.** Compute one node's impurity from class counts.

```python
counts_b1 = np.array([9, 5, 2])  # store toy class counts in one node.
labels_b1 = np.arange(len(counts_b1))  # create class labels for plotting.
proportions_b1 = counts_b1 / counts_b1.sum()  # convert counts into p_k values.
gini_b1 = 1.0 - np.sum(proportions_b1 ** 2)  # compute Gini = 1 - sum_k p_k^2.
entropy_b1 = -np.sum(proportions_b1 * np.log(proportions_b1))  # compute entropy = -sum_k p_k log p_k.
print("counts:", counts_b1)  # print raw counts.
print("proportions:", np.round(proportions_b1, 3))  # print estimated probabilities.
print(f"Gini={gini_b1:.3f}, entropy={entropy_b1:.3f}")  # print both impurity values.
plt.figure(figsize=(5.5, 3.6))  # create a small bar plot.
plt.bar(labels_b1, counts_b1, color=COLORS[:len(counts_b1)])  # draw the class-count bars.
plt.title(f"B1: class counts in one node, Gini={gini_b1:.3f}")  # title the plot with impurity.
plt.xlabel("class")  # label the class axis.
plt.ylabel("count")  # label the count axis.
plt.show()  # render the node composition.
```

▶ What you'll see: a mixed node dominated by class 0, with nonzero Gini and entropy.

👀 Takeaway: impurity is zero only when the node is pure.

#### B2. Measure distances from one query to candidate neighbors

**Goal.** Compute query-to-point distances that determine nearest neighbors.

```python
points_b2 = np.array([[0.0, 0.0], [1.0, 0.4], [2.0, 1.8], [3.2, 2.9], [4.0, 0.2]])  # create toy candidate neighbors.
labels_b2 = np.array([0, 0, 1, 1, 0])  # attach labels to candidate neighbors.
query_b2 = np.array([2.4, 1.2])  # choose one unlabeled query point.
distances_b2 = np.sqrt(np.sum((points_b2 - query_b2) ** 2, axis=1))  # compute Euclidean distances to the query.
order_b2 = np.argsort(distances_b2)  # sort neighbors by distance.
print(pd.DataFrame({"x1": points_b2[:, 0], "x2": points_b2[:, 1], "label": labels_b2, "distance": np.round(distances_b2, 3)}).iloc[order_b2])  # print nearest-to-farthest table.
plt.figure(figsize=(6, 4.8))  # create a distance geometry plot.
for idx in range(points_b2.shape[0]):  # draw one segment per candidate neighbor.
    plt.plot([query_b2[0], points_b2[idx, 0]], [query_b2[1], points_b2[idx, 1]], color="gray", alpha=0.45)  # show the measured distance segment.
    plt.text(points_b2[idx, 0] + 0.04, points_b2[idx, 1] + 0.04, f"d={distances_b2[idx]:.2f}")  # annotate the distance value.
plt.scatter(points_b2[:, 0], points_b2[:, 1], s=95, color=COLORS[labels_b2], edgecolor="white", linewidth=0.8, label="training")  # draw candidate points by label.
plt.scatter(query_b2[0], query_b2[1], s=180, marker="*", color="black", label="query")  # mark the query point.
plt.title("B2: distances from query to candidate neighbors")  # title the plot.
plt.xlabel("feature 1")  # label first feature.
plt.ylabel("feature 2")  # label second feature.
plt.legend()  # identify query and training points.
plt.show()  # render the distance plot.
```

▶ What you'll see: the shortest segments identify the nearest neighbors.

👀 Takeaway: kNN delays computation until prediction time, then measures local distances.

#### B3. Majority vote from a short neighbor-label list

**Goal.** Turn selected neighbor labels into a prediction.

```python
neighbor_labels_b3 = np.array([1, 0, 1, 1, 0])  # store labels of the five nearest neighbors.
classes_b3, counts_b3 = np.unique(neighbor_labels_b3, return_counts=True)  # count votes per class.
prediction_b3 = classes_b3[np.argmax(counts_b3)]  # choose the class with the most votes.
print("neighbor labels:", neighbor_labels_b3)  # print local labels.
print("vote counts:", dict(zip(classes_b3.tolist(), counts_b3.tolist())))  # print vote totals.
print("majority-vote prediction:", int(prediction_b3))  # print the winning class.
plt.figure(figsize=(5.4, 3.6))  # create a vote-count plot.
plt.bar(classes_b3, counts_b3, color=COLORS[classes_b3])  # draw one bar per class.
plt.xticks(classes_b3)  # show class labels on the x-axis.
plt.title(f"B3: majority vote predicts class {prediction_b3}")  # title the result.
plt.xlabel("class")  # label class axis.
plt.ylabel("votes")  # label vote axis.
plt.show()  # render the vote chart.
```

▶ What you'll see: class 1 wins three votes to two.

👀 Takeaway: kNN classification is a local majority vote after neighbor selection.


#### B4. Compute entropy for one label set

**Goal.** Compute entropy from one small list of labels.

```python
labels_b4 = np.array([0, 0, 0, 1, 1, 2])  # store one mixed label set.
classes_b4, counts_b4 = np.unique(labels_b4, return_counts=True)  # count labels per class.
proportions_b4 = counts_b4 / counts_b4.sum()  # convert counts into probabilities.
entropy_b4 = -np.sum(proportions_b4 * np.log(proportions_b4))  # compute entropy = -sum p log p.
print("counts:", dict(zip(classes_b4.tolist(), counts_b4.tolist())))  # print class counts.
print("proportions:", np.round(proportions_b4, 3))  # print class probabilities.
print(f"entropy={entropy_b4:.3f}")  # print the impurity score.
plt.figure(figsize=(5.4, 3.6))  # create a tiny class-count plot.
plt.bar(classes_b4, counts_b4, color=COLORS[classes_b4])  # draw one bar per class.
plt.title(f"B4: entropy = {entropy_b4:.3f}")  # title the plot with entropy.
plt.xlabel("class")  # label class axis.
plt.ylabel("count")  # label count axis.
plt.show()  # render the label distribution.
```

▶ What you'll see: entropy is positive because more than one class appears.

👀 Takeaway: entropy is another way to measure how mixed a node is.

#### B5. Information gain from one candidate split

**Goal.** Compare parent impurity to weighted child impurity for a single split.

```python
parent_counts_b5 = np.array([6, 4])  # store parent class counts.
left_counts_b5 = np.array([5, 1])  # store left-child class counts.
right_counts_b5 = np.array([1, 3])  # store right-child class counts.
def gini_from_counts_b5(counts):  # define one local impurity helper.
    p = counts / counts.sum()  # convert counts into proportions.
    return 1.0 - np.sum(p ** 2)  # compute Gini impurity.
parent_gini_b5 = gini_from_counts_b5(parent_counts_b5)  # compute parent impurity.
left_gini_b5 = gini_from_counts_b5(left_counts_b5)  # compute left-child impurity.
right_gini_b5 = gini_from_counts_b5(right_counts_b5)  # compute right-child impurity.
weighted_child_b5 = (left_counts_b5.sum() * left_gini_b5 + right_counts_b5.sum() * right_gini_b5) / parent_counts_b5.sum()  # weight child impurities by child sizes.
gain_b5 = parent_gini_b5 - weighted_child_b5  # compute impurity reduction.
print(f"parent Gini={parent_gini_b5:.3f}")  # print parent impurity.
print(f"weighted child Gini={weighted_child_b5:.3f}")  # print split cost.
print(f"information gain={gain_b5:.3f}")  # print the improvement from splitting.
```

▶ What you'll see: the split reduces impurity, so information gain is positive.

👀 Takeaway: tree splits are scored by how much impurity they remove.

#### B6. Count the majority class in one node

**Goal.** Find the class a leaf would predict from its training labels.

```python
node_labels_b6 = np.array([2, 2, 1, 2, 0, 1, 2])  # store labels that reached one leaf.
classes_b6, counts_b6 = np.unique(node_labels_b6, return_counts=True)  # count examples per class.
majority_b6 = classes_b6[np.argmax(counts_b6)]  # choose the most frequent class.
print("leaf labels:", node_labels_b6)  # print the labels in the node.
print("class counts:", dict(zip(classes_b6.tolist(), counts_b6.tolist())))  # print vote totals.
print("leaf prediction:", int(majority_b6))  # print the majority-class prediction.
plt.figure(figsize=(5.4, 3.6))  # create a small count plot.
plt.bar(classes_b6, counts_b6, color=COLORS[classes_b6])  # draw class counts.
plt.title(f"B6: leaf predicts class {majority_b6}")  # title the prediction.
plt.xlabel("class")  # label class axis.
plt.ylabel("count")  # label count axis.
plt.show()  # render the majority count.
```

▶ What you'll see: class 2 appears most often and becomes the prediction.

👀 Takeaway: a classification-tree leaf predicts by majority class.

#### B7. Sort candidate neighbors by distance

**Goal.** Rank already-computed distances from nearest to farthest.

```python
names_b7 = np.array(["A", "B", "C", "D"])  # name four candidate neighbors.
distances_b7 = np.array([1.8, 0.7, 2.4, 1.1])  # store their distances to one query.
order_b7 = np.argsort(distances_b7)  # sort indices by increasing distance.
print(pd.DataFrame({"neighbor": names_b7[order_b7], "distance": distances_b7[order_b7]}))  # print nearest-to-farthest order.
plt.figure(figsize=(5.4, 3.6))  # create a sorted-distance plot.
plt.bar(names_b7[order_b7], distances_b7[order_b7], color="slateblue")  # draw bars in nearest-to-farthest order.
plt.title("B7: neighbors sorted by distance")  # title the plot.
plt.xlabel("neighbor")  # label neighbor axis.
plt.ylabel("distance")  # label distance axis.
plt.show()  # render sorted distances.
```

▶ What you'll see: the shortest distance appears first.

👀 Takeaway: kNN selects neighbors from a distance ranking.

#### B8. Select k-nearest labels for one query

**Goal.** Slice the first $k$ labels after sorting neighbors by distance.

```python
labels_b8 = np.array([0, 1, 1, 0, 1])  # store labels for five candidate neighbors.
distances_b8 = np.array([1.6, 0.4, 1.1, 2.0, 0.9])  # store their distances to one query.
k_b8 = 3  # choose how many neighbors get to vote.
order_b8 = np.argsort(distances_b8)  # rank candidates by distance.
k_labels_b8 = labels_b8[order_b8[:k_b8]]  # keep labels of the nearest k candidates.
print("sorted distances:", np.round(distances_b8[order_b8], 2))  # print ranked distances.
print("k-nearest labels:", k_labels_b8)  # print labels that will vote.
print("prediction:", np.bincount(k_labels_b8).argmax())  # print the majority among selected labels.
```

▶ What you'll see: only the three closest labels are used.

👀 Takeaway: $k$ defines the local voting window.

#### B9. Weighted Gini of two child nodes

**Goal.** Combine two child impurities using their sample counts.

```python
left_counts_b9 = np.array([4, 1])  # store class counts in the left child.
right_counts_b9 = np.array([2, 3])  # store class counts in the right child.
def gini_from_counts_b9(counts):  # define a local Gini helper.
    p = counts / counts.sum()  # convert counts to proportions.
    return 1.0 - np.sum(p ** 2)  # compute Gini impurity.
left_gini_b9 = gini_from_counts_b9(left_counts_b9)  # compute left-child impurity.
right_gini_b9 = gini_from_counts_b9(right_counts_b9)  # compute right-child impurity.
weighted_gini_b9 = (left_counts_b9.sum() * left_gini_b9 + right_counts_b9.sum() * right_gini_b9) / (left_counts_b9.sum() + right_counts_b9.sum())  # average by child size.
print(f"left Gini={left_gini_b9:.3f}, right Gini={right_gini_b9:.3f}")  # print both child impurities.
print(f"weighted child Gini={weighted_gini_b9:.3f}")  # print the split score.
```

▶ What you'll see: each child contributes in proportion to its size.

👀 Takeaway: large impure children hurt a split score more than small ones.

#### B10. Make one stump threshold decision

**Goal.** Apply one threshold rule to classify a single point.

```python
feature_value_b10 = 2.7  # store one query's feature value.
threshold_b10 = 2.0  # store the stump threshold.
left_prediction_b10 = 0  # define the class predicted on the left branch.
right_prediction_b10 = 1  # define the class predicted on the right branch.
prediction_b10 = left_prediction_b10 if feature_value_b10 <= threshold_b10 else right_prediction_b10  # route through the split rule.
print(f"if x <= {threshold_b10}, predict {left_prediction_b10}; otherwise predict {right_prediction_b10}")  # print the rule.
print(f"query x={feature_value_b10} -> prediction {prediction_b10}")  # print the routed prediction.
plt.figure(figsize=(5.6, 2.4))  # create a one-dimensional threshold plot.
plt.axvline(threshold_b10, color="black", linestyle="--", label="threshold")  # draw the split threshold.
plt.scatter([feature_value_b10], [0], s=120, color=COLORS[prediction_b10], label="query")  # draw the query point.
plt.yticks([])  # hide the unused vertical axis.
plt.xlabel("feature value")  # label the feature axis.
plt.title("B10: one decision-stump threshold")  # title the plot.
plt.legend()  # identify threshold and query.
plt.show()  # render the threshold decision.
```

▶ What you'll see: the query falls to the right of the threshold and gets the right-side class.

👀 Takeaway: a stump is one if/else decision.

### 🟡 Easy Examples

#### E1. CART first split by Gini impurity

**Goal.** Build a decision tree's first best-split search from scratch.  
**Data source.** Tiny 2-D toy classification table.  
**We'll build this in 6 steps:** create data, compute parent impurity, enumerate thresholds, score splits, plot candidate impurities, and draw the winning split.

```python
X_e1 = np.array([[0.4, 1.6], [0.7, 1.2], [1.0, 0.8], [1.4, 1.0], [2.0, 2.2], [2.4, 2.0], [2.8, 2.6], [3.2, 2.4]])  # create tiny two-feature data.
y_e1 = np.array([0, 0, 0, 0, 1, 1, 1, 1])  # create labels separated mostly by x1.
def gini(labels):  # define Gini impurity for labels.
    values, counts = np.unique(labels, return_counts=True)  # count each class.
    proportions = counts / counts.sum()  # convert counts to probabilities.
    return 1.0 - np.sum(proportions ** 2)  # apply Gini = 1 - sum p_k^2.
parent_gini_e1 = gini(y_e1)  # compute root impurity.
candidates_e1 = []  # store split candidates.
for feature in range(X_e1.shape[1]):  # search both feature columns.
    values = np.sort(np.unique(X_e1[:, feature]))  # get sorted unique values.
    thresholds = (values[:-1] + values[1:]) / 2.0  # create midpoint thresholds.
    for threshold in thresholds:  # evaluate every candidate threshold.
        left = X_e1[:, feature] <= threshold  # send smaller values left.
        right = ~left  # send larger values right.
        weighted = left.mean() * gini(y_e1[left]) + right.mean() * gini(y_e1[right])  # compute weighted child Gini.
        gain = parent_gini_e1 - weighted  # compute information gain.
        candidates_e1.append({"feature": feature, "threshold": threshold, "weighted_gini": weighted, "information_gain": gain})  # save the result.
scores_e1 = pd.DataFrame(candidates_e1).sort_values("weighted_gini")  # rank splits by lowest child impurity.
best_e1 = scores_e1.iloc[0]  # choose the best split.
print(scores_e1.head(8))  # show the best candidate splits.
print(f"Best split: x{int(best_e1.feature)+1} <= {best_e1.threshold:.2f}; IG={best_e1.information_gain:.3f}")  # print the selected CART rule.
plt.figure(figsize=(8, 4.2))  # create candidate bar plot.
labels_e1 = [f"x{int(r.feature)+1}≤{r.threshold:.2f}" for r in scores_e1.itertuples()]  # format split labels.
plt.bar(np.arange(len(scores_e1)), scores_e1["weighted_gini"], color="slateblue")  # plot weighted child Gini.
plt.xticks(np.arange(len(scores_e1)), labels_e1, rotation=45, ha="right")  # label each candidate split.
plt.title("E1 step 5: candidate split impurity")  # title process plot.
plt.ylabel("weighted child Gini")  # label impurity axis.
plt.show()  # render candidate scores.
plt.figure(figsize=(6.4, 5.0))  # create final split plot.
for label in np.unique(y_e1):  # draw points by class.
    mask = y_e1 == label  # select one class.
    plt.scatter(X_e1[mask, 0], X_e1[mask, 1], s=90, color=COLORS[int(label)], edgecolor="white", linewidth=0.8, label=f"class {label}")  # draw class points.
if int(best_e1.feature) == 0:  # draw a vertical split for feature x1.
    plt.axvline(float(best_e1.threshold), color="black", linestyle="--", linewidth=2, label="best split")  # show x1 threshold.
else:  # draw a horizontal split for feature x2.
    plt.axhline(float(best_e1.threshold), color="black", linestyle="--", linewidth=2, label="best split")  # show x2 threshold.
plt.title("E1 final: first CART split")  # title final plot.
plt.xlabel("x1")  # label first feature.
plt.ylabel("x2")  # label second feature.
plt.legend()  # show classes and split.
plt.show()  # render final split.
```

▶ What you'll see: candidate impurity bars identify the best threshold, and the dashed line draws that first split on the scatter.

👀 **Takeaway.** CART is an explicit search over rules, scored by information gain.

#### E2. Decision tree decision regions by depth

**Goal.** Watch tree boundaries become blockier and more flexible as depth increases.  
**Data source.** `make_moons`.  
**We'll build this in 5 steps:** generate data, split, fit multiple depths, plot boundaries, and compare metrics.

```python
X_e2, y_e2 = make_moons(n_samples=420, noise=0.24, random_state=229)  # generate nonlinear data for tree regions.
X_train_e2, X_test_e2, y_train_e2, y_test_e2 = train_test_split(X_e2, y_e2, test_size=0.35, stratify=y_e2, random_state=229)  # create a test split.
depths_e2 = [1, 2, 4, 8]  # choose a depth ramp from stump to flexible tree.
models_e2 = []  # store fitted trees.
for depth in depths_e2:  # train one model per depth.
    model = DecisionTreeClassifier(max_depth=depth, random_state=229)  # configure depth-limited CART.
    model.fit(X_train_e2, y_train_e2)  # fit the model.
    models_e2.append(model)  # save for plotting.
    print(f"depth={depth}: train={model.score(X_train_e2, y_train_e2):.3f}, test={model.score(X_test_e2, y_test_e2):.3f}")  # print train/test accuracy.
fig, axes = plt.subplots(2, 2, figsize=(12, 10))  # create region panels.
for ax, depth, model in zip(axes.ravel(), depths_e2, models_e2):  # draw one panel per depth.
    plot_decision_regions(model, X_train_e2, y_train_e2, ax=ax, title=f"depth={depth}, test={model.score(X_test_e2, y_test_e2):.2f}")  # show boundary.
plt.tight_layout()  # avoid overlaps.
plt.show()  # render boundary panels.
plt.figure(figsize=(6.4, 4.2))  # create metric plot.
plt.plot(depths_e2, [m.score(X_train_e2, y_train_e2) for m in models_e2], marker="o", label="train")  # show train accuracy.
plt.plot(depths_e2, [m.score(X_test_e2, y_test_e2) for m in models_e2], marker="o", label="test")  # show test accuracy.
plt.title("E2 final: depth is a complexity knob")  # title metric plot.
plt.xlabel("max_depth")  # label depth axis.
plt.ylabel("accuracy")  # label accuracy axis.
plt.ylim(0.5, 1.02)  # fix the score range.
plt.legend()  # identify curves.
plt.show()  # render metric plot.
```

▶ What you'll see: shallow trees underfit with coarse rectangles; deeper trees trace moons with more axis-aligned steps.

👀 **Takeaway.** Tree depth trades bias for variance.

#### E3. kNN with k sweeping

**Goal.** Highlight nearest neighbors for one query and compare decision regions for $k=1,3,11$.  
**Data source.** Two-class synthetic moons.  
**We'll build this in 5 steps:** generate data, highlight neighbors, fit k values, plot boundaries, and compare accuracy.

```python
X_e3, y_e3 = make_moons(n_samples=360, noise=0.22, random_state=230)  # create nonlinear data for kNN.
X_train_e3, X_test_e3, y_train_e3, y_test_e3 = train_test_split(X_e3, y_e3, test_size=0.35, stratify=y_e3, random_state=229)  # create held-out data.
query_e3 = np.array([0.25, 0.55])  # choose a boundary-near query point.
distances_e3 = np.sqrt(np.sum((X_train_e3 - query_e3) ** 2, axis=1))  # compute distances to every training point.
nearest_e3 = np.argsort(distances_e3)[:11]  # keep the eleven closest neighbors.
print("nearest labels:", y_train_e3[nearest_e3].tolist())  # print labels that vote locally.
plt.figure(figsize=(6.4, 5.0))  # create neighbor plot.
for label in np.unique(y_train_e3):  # draw each class.
    mask = y_train_e3 == label  # select class examples.
    plt.scatter(X_train_e3[mask, 0], X_train_e3[mask, 1], s=28, color=COLORS[int(label)], alpha=0.65, label=f"class {label}")  # draw training data.
plt.scatter(X_train_e3[nearest_e3, 0], X_train_e3[nearest_e3, 1], s=130, facecolors="none", edgecolors="black", linewidth=1.5, label="11 nearest")  # circle nearest neighbors.
plt.scatter(query_e3[0], query_e3[1], s=180, marker="*", color="black", label="query")  # mark query.
plt.title("E3 step 2: nearest neighbors for one query")  # title process plot.
plt.xlabel("feature 1")  # label first feature.
plt.ylabel("feature 2")  # label second feature.
plt.legend()  # identify markers.
plt.show()  # render neighbor plot.
k_values_e3 = [1, 3, 11]  # choose requested k values.
models_e3 = []  # store fitted kNN models.
for k in k_values_e3:  # fit one model for each k.
    model = KNeighborsClassifier(n_neighbors=k)  # configure kNN.
    model.fit(X_train_e3, y_train_e3)  # store training examples inside the estimator.
    models_e3.append(model)  # save model.
    print(f"k={k}: query={model.predict(query_e3.reshape(1, -1))[0]}, test={model.score(X_test_e3, y_test_e3):.3f}")  # print query and test results.
fig, axes = plt.subplots(1, 3, figsize=(16, 4.8))  # create k-sweep panels.
for ax, k, model in zip(axes, k_values_e3, models_e3):  # plot each k.
    plot_decision_regions(model, X_train_e3, y_train_e3, ax=ax, title=f"k={k}, test={model.score(X_test_e3, y_test_e3):.2f}")  # show boundary.
    ax.scatter(query_e3[0], query_e3[1], s=170, marker="*", color="black")  # mark query in every panel.
plt.tight_layout()  # keep panels readable.
plt.show()  # render k-sweep regions.
```

▶ What you'll see: $k=1$ is jagged, $k=3$ is smoother, and $k=11$ smooths still more.

👀 **Takeaway.** The neighborhood size $k$ is kNN's bias-variance knob.

#### E4. Random forest voting on noisy data

**Goal.** Compare individual tree boundaries with forest vote confidence.  
**Data source.** `make_classification` with redundant/noisy features.  
**We'll build this in 6 steps:** generate noisy data, fit single trees, plot tree diversity, fit forest, plot confidence, and compare accuracy.

```python
X_e4_full, y_e4 = make_classification(n_samples=520, n_features=6, n_informative=2, n_redundant=2, n_clusters_per_class=1, class_sep=0.85, flip_y=0.08, random_state=229)  # create noisy features and noisy labels.
X_e4 = X_e4_full[:, :2]  # keep two features for visible decision regions.
X_train_e4, X_test_e4, y_train_e4, y_test_e4 = train_test_split(X_e4, y_e4, test_size=0.35, stratify=y_e4, random_state=229)  # create a held-out split.
single_trees_e4 = []  # store bootstrap-trained trees.
for seed in [1, 2, 3, 4]:  # fit several different trees.
    sample_idx = RNG.choice(X_train_e4.shape[0], size=X_train_e4.shape[0], replace=True)  # draw a bootstrap sample.
    tree = DecisionTreeClassifier(max_depth=5, random_state=seed)  # configure one tree.
    tree.fit(X_train_e4[sample_idx], y_train_e4[sample_idx])  # fit on the bootstrap sample.
    single_trees_e4.append(tree)  # save tree.
    print(f"tree {seed} test={tree.score(X_test_e4, y_test_e4):.3f}")  # print held-out score.
fig, axes = plt.subplots(2, 2, figsize=(12, 10))  # create tree panels.
for ax, tree, seed in zip(axes.ravel(), single_trees_e4, [1, 2, 3, 4]):  # draw each single tree.
    plot_decision_regions(tree, X_train_e4, y_train_e4, ax=ax, title=f"single tree seed {seed}")  # show tree boundary.
plt.tight_layout()  # avoid overlap.
plt.show()  # render single-tree boundaries.
forest_e4 = RandomForestClassifier(n_estimators=120, max_depth=5, max_features="sqrt", bootstrap=True, random_state=229)  # configure random forest voting.
forest_e4.fit(X_train_e4, y_train_e4)  # fit the forest.
print(f"forest train={forest_e4.score(X_train_e4, y_train_e4):.3f}, test={forest_e4.score(X_test_e4, y_test_e4):.3f}")  # print forest scores.
plt.figure(figsize=(7, 5.4))  # create confidence figure.
plot_vote_confidence(forest_e4, X_train_e4, y_train_e4, title="E4 final: forest vote confidence")  # show averaged votes.
plt.show()  # render confidence map.
```

▶ What you'll see: individual trees disagree in noisy regions; the forest confidence map smooths their votes.

👀 **Takeaway.** Random forests reduce variance by averaging many decorrelated trees.

#### E5. Feature importance in a forest

**Goal.** Train a forest on Iris, then plot feature importances and a confusion matrix.  
**Data source.** Iris.  
**We'll build this in 4 steps:** load Iris, train forest, plot importances, and inspect errors.

```python
iris_e5 = load_iris()  # load the real Iris dataset.
X_e5 = iris_e5.data  # use all four features.
y_e5 = iris_e5.target  # use three species labels.
feature_names_e5 = np.array(iris_e5.feature_names)  # store feature names.
X_train_e5, X_test_e5, y_train_e5, y_test_e5 = train_test_split(X_e5, y_e5, test_size=0.35, stratify=y_e5, random_state=229)  # create held-out split.
forest_e5 = RandomForestClassifier(n_estimators=200, max_depth=4, random_state=229)  # configure a stable forest.
forest_e5.fit(X_train_e5, y_train_e5)  # train the forest.
y_pred_e5 = forest_e5.predict(X_test_e5)  # predict held-out labels.
print(f"train={forest_e5.score(X_train_e5, y_train_e5):.3f}, test={accuracy_score(y_test_e5, y_pred_e5):.3f}")  # print accuracy.
importances_e5 = forest_e5.feature_importances_  # read impurity-based feature importances.
order_e5 = np.argsort(importances_e5)  # sort features for plotting.
plt.figure(figsize=(7.5, 4.8))  # create importance plot.
plt.barh(feature_names_e5[order_e5], importances_e5[order_e5], color="teal")  # draw horizontal importance bars.
plt.title("E5 step 3: Iris forest feature importances")  # title feature plot.
plt.xlabel("mean impurity decrease")  # label importance axis.
plt.show()  # render importances.
disp_e5 = ConfusionMatrixDisplay(confusion_matrix=confusion_matrix(y_test_e5, y_pred_e5), display_labels=iris_e5.target_names)  # prepare confusion matrix.
disp_e5.plot(cmap="Blues", values_format="d")  # draw matrix counts.
plt.title("E5 final: Iris forest confusion matrix")  # title error plot.
plt.show()  # render confusion matrix.
print(pd.DataFrame({"feature": feature_names_e5, "importance": importances_e5}).sort_values("importance", ascending=False))  # print exact importance table.
```

▶ What you'll see: petal features dominate, and most confusion-matrix mass lies on the diagonal.

👀 **Takeaway.** Forest importances help inspect which features were useful for splits, not which features are causal.

### 🔴 Advanced Examples

#### A1. Deep tree overfitting failure case

**Goal.** Compare a deep overfitting tree with a random forest on noisy moons.  
**Data source.** Noisy `make_moons`.  
**We'll build this in 7 steps:** generate, split, sweep depth, plot accuracies, compare shallow/deep boundaries, fit forest, and summarize metrics.

```python
X_a1, y_a1 = make_moons(n_samples=260, noise=0.36, random_state=231)  # generate noisy moons.
X_train_a1, X_test_a1, y_train_a1, y_test_a1 = train_test_split(X_a1, y_a1, test_size=0.40, stratify=y_a1, random_state=229)  # create a large test set.
depths_a1 = list(range(1, 21))  # evaluate many tree depths.
train_scores_a1 = []  # store training scores.
test_scores_a1 = []  # store test scores.
for depth in depths_a1:  # fit one tree per depth.
    tree = DecisionTreeClassifier(max_depth=depth, random_state=229)  # configure depth-limited tree.
    tree.fit(X_train_a1, y_train_a1)  # fit tree.
    train_scores_a1.append(tree.score(X_train_a1, y_train_a1))  # record train accuracy.
    test_scores_a1.append(tree.score(X_test_a1, y_test_a1))  # record test accuracy.
plt.figure(figsize=(7, 4.8))  # create overfitting curve.
plt.plot(depths_a1, train_scores_a1, marker="o", label="train")  # plot training scores.
plt.plot(depths_a1, test_scores_a1, marker="o", label="test")  # plot test scores.
plt.title("A1 step 3: deep tree overfitting")  # title diagnostic.
plt.xlabel("max_depth")  # label depth axis.
plt.ylabel("accuracy")  # label score axis.
plt.ylim(0.55, 1.02)  # fix score range.
plt.legend()  # identify curves.
plt.show()  # render overfitting curve.
shallow_a1 = DecisionTreeClassifier(max_depth=3, random_state=229)  # configure shallow tree.
deep_a1 = DecisionTreeClassifier(max_depth=None, random_state=229)  # configure unpruned tree.
forest_a1 = RandomForestClassifier(n_estimators=200, max_depth=None, max_features="sqrt", random_state=229)  # configure forest.
shallow_a1.fit(X_train_a1, y_train_a1)  # fit shallow tree.
deep_a1.fit(X_train_a1, y_train_a1)  # fit deep tree.
forest_a1.fit(X_train_a1, y_train_a1)  # fit forest.
fig, axes = plt.subplots(1, 3, figsize=(16, 4.8))  # create comparison panels.
plot_decision_regions(shallow_a1, X_train_a1, y_train_a1, ax=axes[0], title=f"shallow test={shallow_a1.score(X_test_a1, y_test_a1):.2f}")  # show shallow boundary.
plot_decision_regions(deep_a1, X_train_a1, y_train_a1, ax=axes[1], title=f"deep test={deep_a1.score(X_test_a1, y_test_a1):.2f}")  # show memorizing boundary.
plot_vote_confidence(forest_a1, X_train_a1, y_train_a1, ax=axes[2], title=f"forest test={forest_a1.score(X_test_a1, y_test_a1):.2f}")  # show forest confidence.
plt.tight_layout()  # keep panels readable.
plt.show()  # render model comparison.
print(pd.DataFrame({"model": ["shallow", "deep", "forest"], "train": [shallow_a1.score(X_train_a1, y_train_a1), deep_a1.score(X_train_a1, y_train_a1), forest_a1.score(X_train_a1, y_train_a1)], "test": [shallow_a1.score(X_test_a1, y_test_a1), deep_a1.score(X_test_a1, y_test_a1), forest_a1.score(X_test_a1, y_test_a1)]}))  # print final metrics.
```

▶ What you'll see: the deep tree creates tiny noisy rectangles; the forest keeps nonlinear structure with smoother votes.

👀 **Takeaway.** Averaging many deep trees reduces the variance of one overfit tree.

#### A2. Bagging reduces variance

**Goal.** Show repeated bootstrap trees disagree, while bagging stabilizes predictions.  
**Data source.** Synthetic noisy moons.  
**We'll build this in 7 steps:** generate data, create bootstraps, fit trees, map disagreement, fit bagging, compare boundaries, and summarize scores.

```python
X_a2, y_a2 = make_moons(n_samples=320, noise=0.30, random_state=232)  # create noisy nonlinear data.
X_train_a2, X_test_a2, y_train_a2, y_test_a2 = train_test_split(X_a2, y_a2, test_size=0.35, stratify=y_a2, random_state=229)  # create held-out split.
bootstrap_indices_a2 = [RNG.choice(X_train_a2.shape[0], size=X_train_a2.shape[0], replace=True) for _ in range(25)]  # draw bootstrap samples.
trees_a2 = []  # store bootstrap trees.
for idx, sample_idx in enumerate(bootstrap_indices_a2):  # fit one tree per bootstrap sample.
    tree = DecisionTreeClassifier(max_depth=None, random_state=idx)  # configure fully grown tree.
    tree.fit(X_train_a2[sample_idx], y_train_a2[sample_idx])  # train on bootstrap sample.
    trees_a2.append(tree)  # store tree.
x_min_a2, x_max_a2 = X_train_a2[:, 0].min() - 0.6, X_train_a2[:, 0].max() + 0.6  # set x grid limits.
y_min_a2, y_max_a2 = X_train_a2[:, 1].min() - 0.6, X_train_a2[:, 1].max() + 0.6  # set y grid limits.
xx_a2, yy_a2 = np.meshgrid(np.linspace(x_min_a2, x_max_a2, 120), np.linspace(y_min_a2, y_max_a2, 120))  # create prediction grid.
grid_a2 = np.c_[xx_a2.ravel(), yy_a2.ravel()]  # flatten grid.
preds_a2 = np.vstack([tree.predict(grid_a2) for tree in trees_a2])  # collect predictions from all bootstrap trees.
variance_a2 = preds_a2.var(axis=0).reshape(xx_a2.shape)  # measure disagreement by grid location.
plt.figure(figsize=(7, 5.4))  # create variance heatmap.
plt.contourf(xx_a2, yy_a2, variance_a2, levels=20, cmap="magma", alpha=0.75)  # plot prediction variance.
plt.colorbar(label="prediction variance")  # add variance scale.
plt.scatter(X_train_a2[:, 0], X_train_a2[:, 1], s=26, color=COLORS[y_train_a2], edgecolor="white", linewidth=0.4)  # overlay data.
plt.title("A2 step 4: bootstrap tree disagreement")  # title heatmap.
plt.xlabel("feature 1")  # label first feature.
plt.ylabel("feature 2")  # label second feature.
plt.show()  # render variance map.
bag_a2 = BaggingClassifier(estimator=DecisionTreeClassifier(max_depth=None, random_state=229), n_estimators=80, bootstrap=True, random_state=229)  # configure bagged trees.
single_a2 = DecisionTreeClassifier(max_depth=None, random_state=229)  # configure single reference tree.
bag_a2.fit(X_train_a2, y_train_a2)  # fit bagged model.
single_a2.fit(X_train_a2, y_train_a2)  # fit single tree.
fig, axes = plt.subplots(1, 2, figsize=(13, 5))  # create boundary comparison.
plot_decision_regions(single_a2, X_train_a2, y_train_a2, ax=axes[0], title=f"single tree test={single_a2.score(X_test_a2, y_test_a2):.2f}")  # show single tree.
plot_vote_confidence(bag_a2, X_train_a2, y_train_a2, ax=axes[1], title=f"bagging test={bag_a2.score(X_test_a2, y_test_a2):.2f}")  # show bagged confidence.
plt.tight_layout()  # keep panels readable.
plt.show()  # render comparison.
print(f"mean bootstrap-tree test accuracy={np.mean([t.score(X_test_a2, y_test_a2) for t in trees_a2]):.3f}; bagging test accuracy={bag_a2.score(X_test_a2, y_test_a2):.3f}")  # print variance-reduction summary.
```

▶ What you'll see: disagreement is highest near boundaries; bagging smooths these unstable regions.

👀 **Takeaway.** Bagging averages away bootstrap-specific errors.

#### A3. AdaBoost reweights mistakes

**Goal.** Show AdaBoost focusing on mistakes and building an additive boundary.  
**Data source.** `make_gaussian_quantiles`.  
**We'll build this in 8 steps:** create data, initialize weights, fit AdaBoost, inspect first mistakes, plot weak-learner weights, show staged boundaries, plot final boundary, and chart test accuracy.

```python
X_a3, y_a3 = make_gaussian_quantiles(n_samples=420, n_features=2, n_classes=2, cov=2.5, random_state=233)  # create nonlinear quantile data.
y_a3 = y_a3.astype(int)  # ensure integer labels for plotting.
X_train_a3, X_test_a3, y_train_a3, y_test_a3 = train_test_split(X_a3, y_a3, test_size=0.35, stratify=y_a3, random_state=229)  # create held-out split.
weights0_a3 = np.ones_like(y_train_a3, dtype=float) / len(y_train_a3)  # initialize equal sample weights conceptually.
ada_a3 = AdaBoostClassifier(estimator=DecisionTreeClassifier(max_depth=1, random_state=229), n_estimators=45, learning_rate=0.7, algorithm="SAMME", random_state=229)  # configure boosted stumps.
ada_a3.fit(X_train_a3, y_train_a3)  # fit sequential weak learners.
first_stump_a3 = ada_a3.estimators_[0]  # extract first stump.
missed_a3 = first_stump_a3.predict(X_train_a3) != y_train_a3  # find first-stump mistakes.
plt.figure(figsize=(6.5, 5.2))  # create mistake plot.
plot_decision_regions(first_stump_a3, X_train_a3, y_train_a3, title="A3 step 4: first stump mistakes")  # show first weak learner.
plt.scatter(X_train_a3[missed_a3, 0], X_train_a3[missed_a3, 1], s=130, facecolors="none", edgecolors="black", linewidth=1.4, label="mistake")  # circle mistakes.
plt.legend()  # show mistake marker.
plt.show()  # render first-stump mistakes.
plt.figure(figsize=(7, 4.4))  # create weight plot.
plt.plot(np.arange(1, len(ada_a3.estimator_weights_) + 1), ada_a3.estimator_weights_, marker="o", markersize=3)  # plot additive learner weights.
plt.title("A3 step 5: weak-learner additive weights")  # title weight plot.
plt.xlabel("boosting round")  # label round axis.
plt.ylabel("alpha_m")  # label additive coefficient.
plt.show()  # render weak learner weights.
rounds_a3 = [1, 5, 15, 45]  # choose staged ensembles.
fig, axes = plt.subplots(2, 2, figsize=(12, 10))  # create stage panels.
for ax, rounds in zip(axes.ravel(), rounds_a3):  # draw each stage.
    partial = AdaBoostClassifier(estimator=DecisionTreeClassifier(max_depth=1, random_state=229), n_estimators=rounds, learning_rate=0.7, algorithm="SAMME", random_state=229)  # configure partial ensemble.
    partial.fit(X_train_a3, y_train_a3)  # fit partial ensemble.
    plot_decision_regions(partial, X_train_a3, y_train_a3, ax=ax, title=f"{rounds} stumps, test={partial.score(X_test_a3, y_test_a3):.2f}")  # show staged boundary.
plt.tight_layout()  # keep panels readable.
plt.show()  # render staged boundaries.
stage_test_a3 = [accuracy_score(y_test_a3, pred) for pred in ada_a3.staged_predict(X_test_a3)]  # compute test accuracy by stage.
plt.figure(figsize=(7, 4.4))  # create metric plot.
plt.plot(np.arange(1, len(stage_test_a3) + 1), stage_test_a3, color="seagreen")  # plot staged test accuracy.
plt.title("A3 final: AdaBoost test accuracy by round")  # title metric plot.
plt.xlabel("boosting round")  # label round axis.
plt.ylabel("test accuracy")  # label score axis.
plt.show()  # render metric plot.
print(f"AdaBoost train={ada_a3.score(X_train_a3, y_train_a3):.3f}, test={ada_a3.score(X_test_a3, y_test_a3):.3f}")  # print final scores.
```

▶ What you'll see: early mistakes are circled, later boundaries become more detailed, and stage accuracy usually improves before flattening.

👀 **Takeaway.** AdaBoost sequentially adds weak learners that focus attention on hard examples.

#### A4. Gradient boosting fits residuals

**Goal.** Show boosted regression trees fitting remaining residuals.  
**Data source.** 1-D nonlinear regression.  
**We'll build this in 8 steps:** create data, fit boosting, inspect residuals, plot staged curves, plot residual snapshots, chart MSE, and show final curve.

```python
x_a4 = np.linspace(-3.0, 3.0, 240)  # create one-dimensional inputs.
y_true_a4 = np.sin(1.5 * x_a4) + 0.35 * x_a4  # define nonlinear signal.
y_a4 = y_true_a4 + RNG.normal(0.0, 0.28, size=x_a4.shape[0])  # add noise.
X_a4 = x_a4.reshape(-1, 1)  # reshape for sklearn.
X_train_a4, X_test_a4, y_train_a4, y_test_a4 = train_test_split(X_a4, y_a4, test_size=0.35, random_state=229)  # create train/test split.
gbr_a4 = GradientBoostingRegressor(n_estimators=80, learning_rate=0.08, max_depth=2, random_state=229)  # configure shallow boosted regression trees.
gbr_a4.fit(X_train_a4, y_train_a4)  # fit residual-additive model.
initial_residuals_a4 = y_train_a4 - y_train_a4.mean()  # compute residuals from mean-only baseline.
plt.figure(figsize=(7, 4.6))  # create residual plot.
plt.scatter(X_train_a4[:, 0], initial_residuals_a4, s=24, color="darkorange", alpha=0.75)  # show baseline residual pattern.
plt.axhline(0.0, color="black", linestyle="--")  # mark zero residual.
plt.title("A4 step 3: residuals after mean-only model")  # title residual plot.
plt.xlabel("x")  # label input axis.
plt.ylabel("residual")  # label residual axis.
plt.show()  # render residuals.
stages_a4 = [1, 5, 20, 80]  # choose prediction stages.
fig, axes = plt.subplots(2, 2, figsize=(13, 8))  # create stage panels.
staged_grid_a4 = list(gbr_a4.staged_predict(X_a4))  # compute predictions on dense grid for every stage.
for ax, stage in zip(axes.ravel(), stages_a4):  # draw each stage.
    ax.scatter(X_train_a4[:, 0], y_train_a4, s=18, color="lightgray", alpha=0.7, label="train")  # show noisy data.
    ax.plot(x_a4, y_true_a4, color="black", linewidth=2.0, label="true signal")  # show target signal.
    ax.plot(x_a4, staged_grid_a4[stage - 1], color="crimson", linewidth=2.2, label=f"stage {stage}")  # show staged prediction.
    ax.set_title(f"{stage} boosting stages")  # title panel.
    ax.set_xlabel("x")  # label x axis.
    ax.set_ylabel("y")  # label y axis.
    ax.legend(fontsize=8)  # identify curves.
plt.tight_layout()  # keep panels readable.
plt.show()  # render staged curves.
train_mse_a4 = []  # store train MSE by stage.
test_mse_a4 = []  # store test MSE by stage.
for train_pred, test_pred in zip(gbr_a4.staged_predict(X_train_a4), gbr_a4.staged_predict(X_test_a4)):  # iterate staged predictions.
    train_mse_a4.append(mean_squared_error(y_train_a4, train_pred))  # record train error.
    test_mse_a4.append(mean_squared_error(y_test_a4, test_pred))  # record test error.
plt.figure(figsize=(7, 4.6))  # create MSE plot.
plt.plot(train_mse_a4, label="train MSE")  # plot train error.
plt.plot(test_mse_a4, label="test MSE")  # plot test error.
plt.title("A4 step 7: boosted residual error by stage")  # title MSE plot.
plt.xlabel("boosting stage")  # label stage axis.
plt.ylabel("mean squared error")  # label error axis.
plt.legend()  # identify curves.
plt.show()  # render MSE curves.
plt.figure(figsize=(7.2, 4.8))  # create final fit plot.
plt.scatter(X_train_a4[:, 0], y_train_a4, s=20, color="lightgray", alpha=0.7, label="train")  # show observations.
plt.plot(x_a4, y_true_a4, color="black", linewidth=2.2, label="true signal")  # show true function.
plt.plot(x_a4, gbr_a4.predict(X_a4), color="crimson", linewidth=2.4, label="boosted fit")  # show final boosted model.
plt.title("A4 final: gradient boosting approximates nonlinear regression")  # title final plot.
plt.xlabel("x")  # label input axis.
plt.ylabel("y")  # label response axis.
plt.legend()  # identify curves.
plt.show()  # render final curve.
print(f"test MSE={mean_squared_error(y_test_a4, gbr_a4.predict(X_test_a4)):.3f}")  # print final held-out error.
```

▶ What you'll see: residual structure shrinks as stages are added, and the final curve follows the nonlinear signal.

👀 **Takeaway.** Gradient boosting repeatedly fits the errors left by the current additive model.

#### A5. kNN scaling and irrelevant-feature edge case

**Goal.** Show that irrelevant high-scale features break kNN distances, then recover with scaling and feature selection.  
**Data source.** Same 2-D signal plus many noise features.  
**We'll build this in 7 steps:** create signal, add noise, plot distance concentration, compare raw kNN, scale all features, select useful features, and summarize accuracy.

```python
X_signal_a5, y_a5 = make_moons(n_samples=600, noise=0.22, random_state=234)  # create useful 2-D signal.
noise_a5 = RNG.normal(0.0, 8.0, size=(X_signal_a5.shape[0], 30))  # create high-scale irrelevant features.
X_noisy_a5 = np.hstack([X_signal_a5, noise_a5])  # combine signal and noise dimensions.
X_train_a5, X_test_a5, y_train_a5, y_test_a5 = train_test_split(X_noisy_a5, y_a5, test_size=0.35, stratify=y_a5, random_state=229)  # create held-out split.
sample_a5 = X_train_a5[:80]  # sample points for pairwise distance analysis.
dist_signal_a5 = np.sqrt(np.sum((sample_a5[:, None, :2] - sample_a5[None, :, :2]) ** 2, axis=2))  # compute distances in useful space.
dist_noisy_a5 = np.sqrt(np.sum((sample_a5[:, None, :] - sample_a5[None, :, :]) ** 2, axis=2))  # compute distances in noisy space.
upper_a5 = np.triu_indices_from(dist_signal_a5, k=1)  # select unique non-self pairs.
plt.figure(figsize=(7, 4.6))  # create distance histogram.
plt.hist(dist_signal_a5[upper_a5], bins=25, alpha=0.65, density=True, label="2 signal features")  # plot useful distances.
plt.hist(dist_noisy_a5[upper_a5], bins=25, alpha=0.65, density=True, label="2 signal + 30 noise")  # plot noisy distances.
plt.title("A5 step 3: irrelevant features distort distances")  # title histogram.
plt.xlabel("pairwise Euclidean distance")  # label distance axis.
plt.ylabel("density")  # label density axis.
plt.legend()  # identify histograms.
plt.show()  # render distance comparison.
knn_signal_a5 = KNeighborsClassifier(n_neighbors=11)  # configure kNN for signal features.
knn_noisy_a5 = KNeighborsClassifier(n_neighbors=11)  # configure kNN for all noisy features.
knn_signal_a5.fit(X_train_a5[:, :2], y_train_a5)  # fit signal-only kNN.
knn_noisy_a5.fit(X_train_a5, y_train_a5)  # fit all-feature kNN.
acc_signal_a5 = knn_signal_a5.score(X_test_a5[:, :2], y_test_a5)  # evaluate signal-only model.
acc_noisy_a5 = knn_noisy_a5.score(X_test_a5, y_test_a5)  # evaluate noisy model.
scaler_a5 = StandardScaler()  # create standard scaler.
X_train_scaled_a5 = scaler_a5.fit_transform(X_train_a5)  # scale training data.
X_test_scaled_a5 = scaler_a5.transform(X_test_a5)  # scale test data.
knn_scaled_all_a5 = KNeighborsClassifier(n_neighbors=11)  # configure scaled all-feature kNN.
knn_scaled_all_a5.fit(X_train_scaled_a5, y_train_a5)  # fit scaled all-feature model.
acc_scaled_all_a5 = knn_scaled_all_a5.score(X_test_scaled_a5, y_test_a5)  # evaluate scaled all-feature model.
knn_selected_a5 = KNeighborsClassifier(n_neighbors=11)  # configure selected-feature kNN.
knn_selected_a5.fit(X_train_scaled_a5[:, :2], y_train_a5)  # fit scaled selected-feature model.
acc_selected_a5 = knn_selected_a5.score(X_test_scaled_a5[:, :2], y_test_a5)  # evaluate selected-feature model.
fig, axes = plt.subplots(1, 2, figsize=(13, 5))  # create boundary panels.
plot_decision_regions(knn_signal_a5, X_train_a5[:, :2], y_train_a5, ax=axes[0], title=f"signal only acc={acc_signal_a5:.2f}")  # show original useful-space boundary.
plot_decision_regions(knn_selected_a5, X_train_scaled_a5[:, :2], y_train_a5, ax=axes[1], title=f"scaled selected acc={acc_selected_a5:.2f}")  # show scaled selected boundary.
plt.tight_layout()  # keep panels readable.
plt.show()  # render boundary recovery.
plt.figure(figsize=(8, 4.6))  # create final metric chart.
plt.bar(["signal only", "all noisy", "scaled all", "scaled selected"], [acc_signal_a5, acc_noisy_a5, acc_scaled_all_a5, acc_selected_a5], color=["seagreen", "tomato", "orange", "teal"])  # compare kNN pipelines.
plt.ylim(0.45, 1.02)  # fix accuracy range.
plt.title("A5 final: kNN needs meaningful scaled distances")  # title summary.
plt.ylabel("test accuracy")  # label metric axis.
plt.show()  # render accuracy comparison.
```

▶ What you'll see: all-feature distances are dominated by noise, while scaling plus feature selection restores the useful neighborhood.

👀 **Takeaway.** kNN performance depends directly on the distance metric and feature representation.

### Interactive Experiment

Use the sliders to compare a decision tree, kNN, and a random forest on the same data. Change tree depth, neighbor count, and forest size to see bias-variance tradeoffs live.

```python
def interactive_boundaries(source="moons", tree_depth=3, k=7, n_estimators=80):  # define the live plotting function.
    X_live, y_live = make_lesson_data(source, random_state=229)  # load the selected data source.
    tree_live = DecisionTreeClassifier(max_depth=tree_depth, random_state=229)  # configure the selected tree depth.
    knn_live = KNeighborsClassifier(n_neighbors=k)  # configure the selected neighbor count.
    forest_live = RandomForestClassifier(n_estimators=n_estimators, max_depth=tree_depth, max_features="sqrt", random_state=229)  # configure selected forest size.
    tree_live.fit(X_live, y_live)  # fit tree.
    knn_live.fit(X_live, y_live)  # fit kNN.
    forest_live.fit(X_live, y_live)  # fit forest.
    fig, axes = plt.subplots(1, 3, figsize=(16, 4.8))  # create three model panels.
    plot_decision_regions(tree_live, X_live, y_live, ax=axes[0], title=f"tree depth={tree_depth}")  # draw tree boundary.
    plot_decision_regions(knn_live, X_live, y_live, ax=axes[1], title=f"kNN k={k}")  # draw kNN boundary.
    plot_vote_confidence(forest_live, X_live, y_live, ax=axes[2], title=f"forest trees={n_estimators}")  # draw forest confidence.
    plt.tight_layout()  # keep live panels readable.
    plt.show()  # render current controls.
interact(interactive_boundaries, source=Dropdown(options=["blobs", "moons", "circles", "overfit_moons"], value="moons", description="source"), tree_depth=IntSlider(value=3, min=1, max=12, step=1, description="depth"), k=IntSlider(value=7, min=1, max=31, step=2, description="k"), n_estimators=IntSlider(value=80, min=10, max=250, step=10, description="trees"));  # display sliders for depth, k, and number of trees.
```

▶ What you'll see: deeper trees add rectangles, larger $k$ smooths kNN, and more forest trees stabilize vote confidence.
