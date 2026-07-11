# Model Selection & Diagnostics
> **Source:** CS 229 · **Category:** Concept/Tips · **Type:** ⚖️ Both · [↑ Full reference](../../ai-ml-cheatsheets.md)
> 📓 The coded examples form a runnable notebook section; an .ipynb will be generated.

## ✍️ Toy Examples

Before the full worked notebook, here are tiny, hand-traceable model-selection toys for the computational mechanics in this lesson. Each toy prints the intermediate arrays, checks one invariant, and draws a compact picture.

### ✍️ Toy 1 · Train/validation/test split

A split gives each row exactly one job: fit parameters, tune choices, or report the final untouched score.

```python
import numpy as np
import matplotlib.pyplot as plt

t1_rng = np.random.default_rng(0)  # -> seeded generator for reproducibility
t1_x = np.arange(12, dtype=float)  # -> [0.0, 1.0, ..., 11.0]
t1_y = 1.0 + 0.5 * t1_x  # -> [1.0, 1.5, ..., 6.5]
t1_indices = np.arange(t1_x.size)  # -> [0, 1, ..., 11]
t1_perm = t1_rng.permutation(t1_indices)  # -> [9, 2, 7, 4, 5, 11, 0, 3, 6, 10, 8, 1]
t1_train_idx = t1_perm[:6]  # -> [9, 2, 7, 4, 5, 11]
t1_val_idx = t1_perm[6:9]  # -> [0, 3, 6]
t1_test_idx = t1_perm[9:]  # -> [10, 8, 1]
t1_covered = np.sort(np.concatenate([t1_train_idx, t1_val_idx, t1_test_idx]))  # -> [0, 1, ..., 11]
t1_disjoint = np.unique(t1_covered).size == t1_x.size  # -> True
t1_complete = np.array_equal(t1_covered, t1_indices)  # -> True
print("seed:", 0)  # -> 0
print("x:", t1_x.tolist())  # -> [0.0, 1.0, ..., 11.0]
print("y:", t1_y.tolist())  # -> [1.0, 1.5, ..., 6.5]
print("permutation:", t1_perm.tolist())  # -> [9, 2, 7, 4, 5, 11, 0, 3, 6, 10, 8, 1]
print("train indices:", t1_train_idx.tolist())  # -> [9, 2, 7, 4, 5, 11]
print("validation indices:", t1_val_idx.tolist())  # -> [0, 3, 6]
print("test indices:", t1_test_idx.tolist())  # -> [10, 8, 1]
print("covered indices:", t1_covered.tolist())  # -> [0, 1, ..., 11]
print("disjoint:", bool(t1_disjoint))  # -> True
print("complete:", bool(t1_complete))  # -> True
assert t1_disjoint and t1_complete

plt.figure(figsize=(6, 3.5))
plt.scatter(t1_x[t1_train_idx], t1_y[t1_train_idx], s=90, label="train", color="steelblue")
plt.scatter(t1_x[t1_val_idx], t1_y[t1_val_idx], s=90, label="validation", color="orange")
plt.scatter(t1_x[t1_test_idx], t1_y[t1_test_idx], s=90, label="test", color="seagreen")
plt.xlabel("row index / x")
plt.ylabel("target y")
plt.title("Toy 1: every row has one role")
plt.legend()
plt.show()
```
▶ What you'll see: 12 rows are shuffled into 6 train, 3 validation, and 3 test points with no overlap.

### ✍️ Toy 2 · k-fold cross-validation average

Cross-validation rotates the validation fold, records one error per fold, and chooses the hyperparameter with the best mean error.

```python
import numpy as np
import matplotlib.pyplot as plt

t2_rng = np.random.default_rng(0)  # -> seeded generator for reproducibility
t2_x = np.arange(12, dtype=float)  # -> [0.0, 1.0, ..., 11.0]
t2_noise = np.array([0.0, 0.2, -0.1, 0.1, -0.2, 0.0, 0.2, -0.1, 0.1, -0.2, 0.0, 0.2])  # -> small deterministic wiggles
t2_y = 1.0 + 0.5 * t2_x  # -> straight-line signal
t2_y = t2_y + t2_noise  # -> [1.0, 1.7, 1.9, 2.6, 2.8, 3.5, 4.2, 4.4, 5.1, 5.3, 6.0, 6.7]
t2_perm = t2_rng.permutation(t2_x.size)  # -> [9, 2, 7, 4, 5, 11, 0, 3, 6, 10, 8, 1]
t2_folds = np.array_split(t2_perm, 3)  # -> [[9, 2, 7, 4], [5, 11, 0, 3], [6, 10, 8, 1]]
t2_degrees = np.array([0, 1, 3])  # -> [0, 1, 3]
t2_fold_errors = []  # -> will hold one row of fold MSEs per degree
for t2_degree in t2_degrees:
    t2_errors_for_degree = []
    for t2_val_idx in t2_folds:
        t2_train_idx = np.setdiff1d(np.arange(t2_x.size), t2_val_idx)
        t2_coef = np.polyfit(t2_x[t2_train_idx], t2_y[t2_train_idx], int(t2_degree))
        t2_pred = np.polyval(t2_coef, t2_x[t2_val_idx])
        t2_error = np.mean((t2_pred - t2_y[t2_val_idx]) ** 2)
        t2_errors_for_degree.append(float(t2_error))
    t2_fold_errors.append(t2_errors_for_degree)
t2_fold_errors = np.array(t2_fold_errors)  # -> [[1.827, 4.548, 3.098], [0.065, 0.019, 0.034], [0.066, 0.128, 0.054]]
t2_mean_errors = t2_fold_errors.mean(axis=1)  # -> [3.158, 0.04, 0.083]
t2_best_degree = int(t2_degrees[np.argmin(t2_mean_errors)])  # -> 1
print("seed:", 0)  # -> 0
print("x:", t2_x.tolist())  # -> [0.0, 1.0, ..., 11.0]
print("y:", np.round(t2_y, 3).tolist())  # -> [1.0, 1.7, 1.9, 2.6, 2.8, 3.5, 4.2, 4.4, 5.1, 5.3, 6.0, 6.7]
print("folds:", [fold.tolist() for fold in t2_folds])  # -> [[9, 2, 7, 4], [5, 11, 0, 3], [6, 10, 8, 1]]
print("degrees:", t2_degrees.tolist())  # -> [0, 1, 3]
print("fold MSEs:", np.round(t2_fold_errors, 3).tolist())  # -> [[1.827, 4.548, 3.098], [0.065, 0.019, 0.034], [0.066, 0.128, 0.054]]
print("mean CV MSE:", np.round(t2_mean_errors, 3).tolist())  # -> [3.158, 0.04, 0.083]
print("best degree:", t2_best_degree)  # -> 1
assert t2_best_degree == 1

plt.figure(figsize=(5, 3.5))
plt.plot(t2_degrees, t2_mean_errors, marker="o", color="black", label="mean CV MSE")
for t2_degree, t2_errors in zip(t2_degrees, t2_fold_errors):
    plt.scatter(np.repeat(t2_degree, t2_errors.size), t2_errors, color="gray", alpha=0.7)
plt.axvline(t2_best_degree, color="seagreen", linestyle="--", label="chosen degree")
plt.xlabel("polynomial degree")
plt.ylabel("validation MSE")
plt.title("Toy 2: k-fold CV averages fold errors")
plt.legend()
plt.show()
```
▶ What you'll see: the degree-1 line has the smallest average validation error across the three folds.

### ✍️ Toy 3 · Bias-variance pieces from repeated predictions

Bias measures how far the average prediction is from truth; variance measures how much predictions move across training sets.

```python
import numpy as np
import matplotlib.pyplot as plt

t3_rng = np.random.default_rng(0)  # -> seeded generator for reproducibility
t3_true_value = 2.0  # -> target f(x0)
t3_model_names = np.array(["simple", "flexible"])  # -> two model families
t3_predictions = np.array([[1.6, 1.7, 1.65, 1.55, 1.6, 1.7], [1.2, 2.8, 1.5, 2.6, 1.0, 2.9]])  # -> 6 repeated predictions per model
t3_mean_prediction = t3_predictions.mean(axis=1)  # -> [1.633, 2.0]
t3_bias2 = (t3_mean_prediction - t3_true_value) ** 2  # -> [0.134, 0.0]
t3_variance = t3_predictions.var(axis=1)  # -> [0.003, 0.617]
t3_noise = np.array([0.04, 0.04])  # -> irreducible noise floor
t3_total = t3_bias2 + t3_variance  # -> model-dependent error
t3_total = t3_total + t3_noise  # -> [0.178, 0.657]
print("seed:", 0)  # -> 0
print("true value:", t3_true_value)  # -> 2.0
print("model names:", t3_model_names.tolist())  # -> ['simple', 'flexible']
print("predictions:", t3_predictions.tolist())  # -> 6 repeated predictions per model
print("mean predictions:", np.round(t3_mean_prediction, 3).tolist())  # -> [1.633, 2.0]
print("bias^2:", np.round(t3_bias2, 3).tolist())  # -> [0.134, 0.0]
print("variance:", np.round(t3_variance, 3).tolist())  # -> [0.003, 0.617]
print("noise:", t3_noise.tolist())  # -> [0.04, 0.04]
print("total error pieces:", np.round(t3_total, 3).tolist())  # -> [0.178, 0.657]
assert t3_bias2[0] > t3_bias2[1] and t3_variance[1] > t3_variance[0]

plt.figure(figsize=(5, 3.5))
plt.bar(t3_model_names, t3_bias2, label="bias²", color="salmon")
plt.bar(t3_model_names, t3_variance, bottom=t3_bias2, label="variance", color="cornflowerblue")
plt.bar(t3_model_names, t3_noise, bottom=t3_bias2 + t3_variance, label="noise", color="lightgray")
plt.ylabel("error contribution")
plt.title("Toy 3: bias-variance trade-off")
plt.legend()
plt.show()
```
▶ What you'll see: the simple model is biased but stable, while the flexible model is centered but much more variable.

### ✍️ Toy 4 · Learning curve by training size

A learning curve refits the same model with more training rows and compares training error to validation error.

```python
import numpy as np
import matplotlib.pyplot as plt

t4_rng = np.random.default_rng(0)  # -> seeded generator for reproducibility
t4_x = np.arange(12, dtype=float)  # -> [0.0, 1.0, ..., 11.0]
t4_y = np.array([1.0, 1.5, 1.7, 2.3, 2.6, 3.1, 3.3, 3.9, 4.2, 4.7, 5.1, 5.3])  # -> 12 targets
t4_train_idx = np.arange(8)  # -> [0, 1, ..., 7]
t4_val_idx = np.arange(8, 12)  # -> [8, 9, 10, 11]
t4_sizes = np.array([3, 5, 8])  # -> [3, 5, 8]
t4_coefs = []  # -> one fitted line per size
t4_train_mse = []  # -> training errors
t4_val_mse = []  # -> validation errors
for t4_size in t4_sizes:
    t4_subset = t4_train_idx[:t4_size]
    t4_coef = np.polyfit(t4_x[t4_subset], t4_y[t4_subset], 1)
    t4_train_pred = np.polyval(t4_coef, t4_x[t4_subset])
    t4_val_pred = np.polyval(t4_coef, t4_x[t4_val_idx])
    t4_train_error = np.mean((t4_train_pred - t4_y[t4_subset]) ** 2)
    t4_val_error = np.mean((t4_val_pred - t4_y[t4_val_idx]) ** 2)
    t4_coefs.append(t4_coef)
    t4_train_mse.append(float(t4_train_error))
    t4_val_mse.append(float(t4_val_error))
t4_coefs = np.array(t4_coefs)  # -> [[0.35, 1.05], [0.4, 1.02], [0.402, 1.017]]
t4_train_mse = np.array(t4_train_mse)  # -> [0.005, 0.006, 0.007]
t4_val_mse = np.array(t4_val_mse)  # -> [0.209, 0.007, 0.007]
print("seed:", 0)  # -> 0
print("x:", t4_x.tolist())  # -> [0.0, 1.0, ..., 11.0]
print("y:", t4_y.tolist())  # -> 12 targets
print("train indices:", t4_train_idx.tolist())  # -> [0, 1, ..., 7]
print("validation indices:", t4_val_idx.tolist())  # -> [8, 9, 10, 11]
print("train sizes:", t4_sizes.tolist())  # -> [3, 5, 8]
print("line coefficients:", np.round(t4_coefs, 3).tolist())  # -> [[0.35, 1.05], [0.4, 1.02], [0.402, 1.017]]
print("train MSE:", np.round(t4_train_mse, 3).tolist())  # -> [0.005, 0.006, 0.007]
print("validation MSE:", np.round(t4_val_mse, 3).tolist())  # -> [0.209, 0.007, 0.007]
assert t4_val_mse[-1] <= t4_val_mse[0]

plt.figure(figsize=(5, 3.5))
plt.plot(t4_sizes, t4_train_mse, marker="o", label="train MSE")
plt.plot(t4_sizes, t4_val_mse, marker="o", label="validation MSE")
plt.xlabel("training rows used")
plt.ylabel("mean squared error")
plt.title("Toy 4: learning curve")
plt.legend()
plt.show()
```
▶ What you'll see: validation error drops sharply once the fitted line sees more of the training range.

### ✍️ Toy 5 · Regularization path for ridge weights

A regularization path solves the same model for several penalty strengths and tracks how weights shrink.

```python
import numpy as np
import matplotlib.pyplot as plt

t5_rng = np.random.default_rng(0)  # -> seeded generator for reproducibility
t5_x = np.linspace(-1.5, 1.5, 8)  # -> [-1.5, -1.071, -0.643, -0.214, 0.214, 0.643, 1.071, 1.5]
t5_y = np.array([-1.9, -1.1, -0.2, 0.4, 0.7, 1.0, 1.5, 2.4])  # -> 8 targets
t5_degree = 3  # -> cubic features
t5_X = np.vander(t5_x, N=t5_degree + 1, increasing=True)  # -> columns [1, x, x^2, x^3]
t5_lambdas = np.array([0.0, 0.1, 1.0, 10.0])  # -> regularization strengths
t5_penalty = np.eye(t5_degree + 1)  # -> identity penalty
t5_penalty[0, 0] = 0.0  # -> intercept is not penalized
t5_coefs = []  # -> coefficients by lambda
t5_norms = []  # -> non-intercept norms by lambda
t5_train_mse = []  # -> training errors by lambda
for t5_lambda in t5_lambdas:
    t5_system = t5_X.T @ t5_X
    t5_system = t5_system + t5_lambda * t5_penalty
    t5_rhs = t5_X.T @ t5_y
    t5_coef = np.linalg.solve(t5_system, t5_rhs)
    t5_pred = t5_X @ t5_coef
    t5_mse = np.mean((t5_pred - t5_y) ** 2)
    t5_norm = np.linalg.norm(t5_coef[1:])
    t5_coefs.append(t5_coef)
    t5_norms.append(float(t5_norm))
    t5_train_mse.append(float(t5_mse))
t5_coefs = np.array(t5_coefs)  # -> [[0.475, 0.88, -0.13, 0.25], [0.473, 0.819, -0.127, 0.28], [0.456, 0.556, -0.11, 0.399], [0.395, 0.27, -0.047, 0.403]]
t5_norms = np.array(t5_norms)  # -> [0.924, 0.875, 0.693, 0.488]
t5_train_mse = np.array(t5_train_mse)  # -> [0.008, 0.009, 0.024, 0.142]
print("seed:", 0)  # -> 0
print("x:", np.round(t5_x, 3).tolist())  # -> [-1.5, -1.071, -0.643, -0.214, 0.214, 0.643, 1.071, 1.5]
print("y:", t5_y.tolist())  # -> 8 targets
print("lambda values:", t5_lambdas.tolist())  # -> [0.0, 0.1, 1.0, 10.0]
print("coefficients:", np.round(t5_coefs, 3).tolist())  # -> [[0.475, 0.88, -0.13, 0.25], [0.473, 0.819, -0.127, 0.28], [0.456, 0.556, -0.11, 0.399], [0.395, 0.27, -0.047, 0.403]]
print("weight norms:", np.round(t5_norms, 3).tolist())  # -> [0.924, 0.875, 0.693, 0.488]
print("train MSE:", np.round(t5_train_mse, 3).tolist())  # -> [0.008, 0.009, 0.024, 0.142]
assert np.all(np.diff(t5_norms) <= 0.0)

t5_grid = np.linspace(-1.6, 1.6, 100)  # -> plotting grid
t5_grid_X = np.vander(t5_grid, N=t5_degree + 1, increasing=True)  # -> cubic grid features
plt.figure(figsize=(8, 3.5))
plt.subplot(1, 2, 1)
plt.scatter(t5_x, t5_y, color="black", label="data")
for t5_lambda, t5_coef in zip(t5_lambdas, t5_coefs):
    plt.plot(t5_grid, t5_grid_X @ t5_coef, label=f"λ={t5_lambda:g}")
plt.title("ridge fits")
plt.xlabel("x")
plt.ylabel("y")
plt.legend(fontsize=8)
plt.subplot(1, 2, 2)
plt.plot(t5_lambdas, t5_norms, marker="o", color="crimson")
plt.xscale("symlog", linthresh=0.1)
plt.xlabel("λ")
plt.ylabel("non-intercept norm")
plt.title("regularization path")
plt.tight_layout()
plt.show()
```
▶ What you'll see: larger `λ` values shrink the non-intercept weight norm, trading a little more training error for smoother weights.

## 0. Step-by-Step Worked Example — Start Here (Beginner Friendly)

> 🧑‍🎓 **New to this topic? Start here.** This is a gentle, fully runnable walkthrough that
> builds up *every* idea in this lesson one tiny step at a time. Each step **prints** the
> numbers it computes and **draws a picture** so you can *see* what is happening. Run the
> cells in order from top to bottom. Nothing here needs the internet or any downloaded data.

### The Big Picture — What You'll Learn

In plain terms, here is what the steps below will show you:

- A **train/validation/test split** keeps fitting, tuning, and final reporting in separate buckets.
- **$k$-fold cross-validation** rotates the validation fold and averages the errors for model choice.
- **Bias-variance diagnostics** show why simple models underfit and very flexible models vary too much.
- **Regularization** shrinks coefficients so a flexible model becomes smoother.
- **Learning and validation curves** separate “need more data” from “need a different hyperparameter.”

Everything below (starting at **§1 Overview**) develops these same ideas with full derivations,
more examples, and diagnostic workflows.

**What we will build, step by step:**
1. **Train/validation/test split** — keep fitting, tuning, and final auditing separate.
2. **$k$-fold cross-validation** — rotate which fold validates and average the errors.
3. **Bias-variance decomposition** — see underfitting and overfitting as bias and variance.
4. **Regularization** — shrink coefficients to smooth a flexible model.
5. **Learning and validation curves** — diagnose whether data size or model complexity is the issue.

### Step 0 — Set up our tools

We import NumPy (arrays, random numbers, and small linear algebra) and Matplotlib (pictures).
We fix a random **seed** so every split, fitted curve, and printed diagnostic is reproducible.
The tiny `log()` helper makes each intermediate number easy to find in the output.

```python
import numpy as np                       # NumPy: arrays, random draws, polynomial fits, and linear algebra.
import matplotlib.pyplot as plt          # Matplotlib: plots for splits, CV errors, and diagnostics.

np.random.seed(0)                         # Fix the seed so every run prints the SAME numbers.
plt.rcParams["figure.figsize"] = (7, 4)   # Use a comfortable default figure size.


def log(label, value):                    # A tiny logger so each printed line explains itself.
    print(f"[{label}] {value}")           # Format is: [what this is] the value.

log("setup", "tools ready — NumPy + Matplotlib imported, seed fixed to 0")  # Confirm setup.
```
▶ What you'll see: one line confirming the tools are ready.

### Step 1 — Train/validation/test split: separate fitting, tuning, and final audit

A train/validation/test split gives each row exactly one job. Training rows fit parameters,
validation rows choose model settings, and test rows stay untouched until the final audit.
The first diagnostic is simply checking that the three index sets are disjoint and complete.

```python
n_split_demo = 30                                                   # Use 30 tiny examples so the split is easy to inspect.
x_split_demo = np.linspace(-3.0, 3.0, n_split_demo)                 # Create one input value per example.
y_split_demo = 0.7 * x_split_demo**2 - 0.4 * x_split_demo + np.random.normal(0.0, 0.8, n_split_demo)  # Make a noisy curved target.
shuffled_split_demo = np.random.permutation(n_split_demo)           # Shuffle row indices before assigning roles.
train_idx_demo = shuffled_split_demo[:18]                           # Use 60% of rows for parameter fitting.
val_idx_demo = shuffled_split_demo[18:24]                            # Use 20% of rows for tuning decisions.
test_idx_demo = shuffled_split_demo[24:]                             # Reserve 20% of rows for the final audit.
covered_idx_demo = np.sort(np.concatenate([train_idx_demo, val_idx_demo, test_idx_demo]))  # Combine all assigned indices.
disjoint_demo = len(np.unique(covered_idx_demo)) == n_split_demo     # Check that no row appears in two roles.
complete_demo = np.array_equal(covered_idx_demo, np.arange(n_split_demo))  # Check that every original row appears once.
log("train/val/test sizes", (len(train_idx_demo), len(val_idx_demo), len(test_idx_demo)))  # Print role sizes.
log("first validation indices", val_idx_demo[:5].tolist())          # Print a few validation indices for inspection.
log("disjoint split?", bool(disjoint_demo))                         # Print the no-overlap check.
log("complete coverage?", bool(complete_demo))                      # Print the no-missing-rows check.

plt.scatter(x_split_demo[train_idx_demo], y_split_demo[train_idx_demo], label="train", color="steelblue")  # Plot training rows.
plt.scatter(x_split_demo[val_idx_demo], y_split_demo[val_idx_demo], label="validation", color="orange")  # Plot validation rows.
plt.scatter(x_split_demo[test_idx_demo], y_split_demo[test_idx_demo], label="test", color="seagreen")  # Plot test rows.
plt.title("Train / validation / test rows have separate roles")     # Title the split picture.
plt.xlabel("x")                                                     # Label the input axis.
plt.ylabel("y")                                                     # Label the target axis.
plt.legend()                                                        # Show which color belongs to each role.
plt.show()                                                          # Render the split visualization.
```
▶ What you'll see: printed split sizes plus a scatter plot where every point is colored as train, validation, or test exactly once.

### Step 2 — $k$-fold cross-validation: average several validation estimates

A single validation split can be lucky or unlucky. In $k$-fold cross-validation, each fold
acts as validation once while the other folds train; then we average the fold errors and pick
the hyperparameter with the lowest average.

```python
x_cv_demo = np.linspace(-2.5, 2.5, 25)                               # Create a small one-dimensional regression dataset.
y_cv_demo = 1.0 + 0.4 * x_cv_demo - 0.6 * x_cv_demo**2 + np.random.normal(0.0, 0.35, x_cv_demo.size)  # Add curved signal plus noise.
folds_demo = np.array_split(np.random.permutation(x_cv_demo.size), 5) # Make five shuffled validation folds.
degrees_cv_demo = np.array([1, 2, 5])                                 # Try underfit, suitable, and flexible polynomial degrees.
mean_cv_errors_demo = []                                              # Store the average validation error for each degree.
all_fold_errors_demo = []                                             # Store fold-level errors for plotting.
for degree_cv_demo in degrees_cv_demo:                                # Evaluate one candidate model complexity at a time.
    fold_errors_demo = []                                             # Collect this degree's five validation errors.
    for val_idx_cv_demo in folds_demo:                                # Rotate which fold is held out.
        train_idx_cv_demo = np.setdiff1d(np.arange(x_cv_demo.size), val_idx_cv_demo)  # Use all non-fold rows for training.
        coef_cv_demo = np.polyfit(x_cv_demo[train_idx_cv_demo], y_cv_demo[train_idx_cv_demo], int(degree_cv_demo))  # Fit only training rows.
        pred_cv_demo = np.polyval(coef_cv_demo, x_cv_demo[val_idx_cv_demo])  # Predict the held-out fold.
        fold_errors_demo.append(np.mean((pred_cv_demo - y_cv_demo[val_idx_cv_demo]) ** 2))  # Save fold MSE.
    all_fold_errors_demo.append(fold_errors_demo)                     # Keep fold errors for the plot.
    mean_cv_errors_demo.append(float(np.mean(fold_errors_demo)))      # Average fold errors into CV_k(h).
best_degree_cv_demo = int(degrees_cv_demo[np.argmin(mean_cv_errors_demo)])  # Select the lowest-CV-error degree.
for degree_cv_demo, fold_errors_demo, mean_error_demo in zip(degrees_cv_demo, all_fold_errors_demo, mean_cv_errors_demo):  # Print each candidate.
    log(f"degree {degree_cv_demo} fold MSEs", np.round(fold_errors_demo, 3).tolist())  # Print granular fold results.
    log(f"degree {degree_cv_demo} mean CV MSE", round(mean_error_demo, 3))  # Print the fold average.
log("selected degree by CV", best_degree_cv_demo)                     # Print the model choice made by CV.

plt.plot(degrees_cv_demo, mean_cv_errors_demo, marker="o", label="mean CV MSE")  # Plot average CV error by degree.
for degree_cv_demo, fold_errors_demo in zip(degrees_cv_demo, all_fold_errors_demo):  # Add fold-level dots.
    plt.scatter(np.repeat(degree_cv_demo, len(fold_errors_demo)), fold_errors_demo, color="gray", alpha=0.55)  # Show fold variation.
plt.axvline(best_degree_cv_demo, color="black", linestyle="--", label="selected degree")  # Mark the CV winner.
plt.title("k-fold CV averages validation errors")                    # Title the CV diagnostic.
plt.xlabel("polynomial degree")                                      # Label the hyperparameter axis.
plt.ylabel("validation mean squared error")                          # Label the error metric.
plt.legend()                                                         # Show mean and selected-degree labels.
plt.show()                                                           # Render the CV plot.
```
▶ What you'll see: each degree prints five fold errors, then the plot shows their average and the selected degree.

### Step 3 — Bias-variance decomposition: watch underfit become overfit

For squared error, expected test error splits into **bias² + variance + irreducible noise**.
Simple models tend to have high bias; very flexible models can have high variance because their
predictions change a lot from one training sample to the next.

```python
x0_bv_demo = 1.0                                                     # Inspect predictions at one fixed input x0.
true_x0_demo = np.sin(1.2 * x0_bv_demo)                              # Compute the noiseless target f(x0).
noise_std_bv_demo = 0.25                                             # Set the irreducible noise standard deviation.
degrees_bv_demo = np.array([1, 3, 9])                                 # Compare underfit, middle, and very flexible models.
reps_bv_demo = 120                                                   # Repeat many tiny training sets to estimate bias and variance.
preds_bv_demo = np.zeros((len(degrees_bv_demo), reps_bv_demo))        # Store one prediction per degree and repeat.
for rep_bv_demo in range(reps_bv_demo):                               # Simulate repeated training datasets.
    x_train_bv_demo = np.sort(np.random.uniform(-3.0, 3.0, 18))       # Draw training inputs for this repeat.
    y_train_bv_demo = np.sin(1.2 * x_train_bv_demo) + np.random.normal(0.0, noise_std_bv_demo, x_train_bv_demo.size)  # Add noise.
    for pos_bv_demo, degree_bv_demo in enumerate(degrees_bv_demo):    # Fit each complexity on the same repeat.
        coef_bv_demo = np.polyfit(x_train_bv_demo, y_train_bv_demo, int(degree_bv_demo))  # Fit a polynomial model.
        preds_bv_demo[pos_bv_demo, rep_bv_demo] = np.polyval(coef_bv_demo, x0_bv_demo)  # Save prediction at x0.
mean_pred_bv_demo = preds_bv_demo.mean(axis=1)                        # Estimate E_D[hat f(x0)].
bias2_bv_demo = (mean_pred_bv_demo - true_x0_demo) ** 2               # Compute squared bias at x0.
variance_bv_demo = preds_bv_demo.var(axis=1)                          # Compute prediction variance at x0.
noise_bv_demo = np.repeat(noise_std_bv_demo**2, len(degrees_bv_demo))  # Store the irreducible noise term.
for degree_bv_demo, bias2_one_demo, variance_one_demo in zip(degrees_bv_demo, bias2_bv_demo, variance_bv_demo):  # Print the decomposition.
    log(f"degree {degree_bv_demo} bias^2", round(float(bias2_one_demo), 4))  # Print squared bias.
    log(f"degree {degree_bv_demo} variance", round(float(variance_one_demo), 4))  # Print prediction variance.

plt.bar(degrees_bv_demo, bias2_bv_demo, label="bias²", color="salmon")  # Draw the bias-squared component.
plt.bar(degrees_bv_demo, variance_bv_demo, bottom=bias2_bv_demo, label="variance", color="cornflowerblue")  # Stack variance.
plt.bar(degrees_bv_demo, noise_bv_demo, bottom=bias2_bv_demo + variance_bv_demo, label="noise", color="lightgray")  # Stack noise.
plt.title("Bias-variance pieces at one x value")                      # Title the decomposition plot.
plt.xlabel("polynomial degree")                                      # Label the complexity axis.
plt.ylabel("estimated error contribution")                           # Label the contribution scale.
plt.legend()                                                         # Show the three error pieces.
plt.show()                                                           # Render the stacked bars.
```
▶ What you'll see: low degree has more bias, high degree has more variance, and the noise floor stays the same.

### Step 4 — Regularization: shrink coefficients to smooth a flexible model

Regularization adds a penalty such as $\lambda\lVert w\rVert_2^2$ to the training loss. The model
can still be flexible, but large coefficients become expensive, so increasing $\lambda$ usually
smooths the fit and reduces variance.

```python
x_reg_demo = np.linspace(-3.0, 3.0, 20)                               # Create small training inputs.
y_reg_demo = np.sin(1.4 * x_reg_demo) + np.random.normal(0.0, 0.22, x_reg_demo.size)  # Create noisy nonlinear targets.
degree_reg_demo = 9                                                   # Use a flexible polynomial basis that can wiggle.
X_reg_demo = np.vander(x_reg_demo, N=degree_reg_demo + 1, increasing=True)  # Build columns [1, x, x^2, ...].
grid_reg_demo = np.linspace(-3.1, 3.1, 250)                           # Build a smooth grid for plotting fitted curves.
X_grid_reg_demo = np.vander(grid_reg_demo, N=degree_reg_demo + 1, increasing=True)  # Build grid polynomial features.
lambdas_reg_demo = np.array([0.0, 0.01, 0.1, 1.0, 10.0])               # Try no penalty through strong penalty.
penalty_reg_demo = np.eye(degree_reg_demo + 1)                         # Create the ridge penalty matrix.
penalty_reg_demo[0, 0] = 0.0                                           # Leave the intercept unpenalized.
fits_reg_demo = []                                                     # Store fitted curves for each lambda.
norms_reg_demo = []                                                    # Store non-intercept coefficient sizes.
for lambda_reg_demo in lambdas_reg_demo:                               # Solve one ridge system per penalty strength.
    system_reg_demo = X_reg_demo.T @ X_reg_demo + lambda_reg_demo * penalty_reg_demo  # Build X^T X + lambda D.
    rhs_reg_demo = X_reg_demo.T @ y_reg_demo                           # Build X^T y.
    coef_reg_demo = np.linalg.solve(system_reg_demo, rhs_reg_demo)      # Solve for ridge coefficients.
    fits_reg_demo.append(X_grid_reg_demo @ coef_reg_demo)               # Save the smooth fitted curve.
    norms_reg_demo.append(float(np.linalg.norm(coef_reg_demo[1:])))     # Save coefficient size excluding intercept.
log("lambda values", lambdas_reg_demo.tolist())                        # Print the tried regularization strengths.
log("coefficient norms", np.round(norms_reg_demo, 3).tolist())         # Print how shrinkage changes with lambda.

plt.subplot(1, 2, 1)                                                   # Start the fitted-curve panel.
plt.scatter(x_reg_demo, y_reg_demo, color="black", s=30, label="data")  # Plot the noisy training points.
for lambda_reg_demo, fit_reg_demo in zip(lambdas_reg_demo, fits_reg_demo):  # Draw one curve per lambda.
    plt.plot(grid_reg_demo, fit_reg_demo, label=f"λ={lambda_reg_demo:g}")  # Plot the regularized fit.
plt.title("regularization smooths a flexible fit")                    # Title the curve panel.
plt.xlabel("x")                                                       # Label the input axis.
plt.ylabel("y")                                                       # Label the target axis.
plt.legend(fontsize=8)                                                 # Show lambda labels.
plt.subplot(1, 2, 2)                                                   # Start the coefficient-norm panel.
plt.plot(lambdas_reg_demo, norms_reg_demo, marker="o")                 # Plot coefficient size versus lambda.
plt.xscale("symlog", linthresh=0.01)                                  # Show lambda=0 and positive lambdas on one axis.
plt.title("larger λ shrinks weights")                                 # Title the shrinkage panel.
plt.xlabel("λ")                                                       # Label regularization strength.
plt.ylabel("non-intercept weight norm")                               # Label coefficient size.
plt.tight_layout()                                                     # Prevent subplot labels from overlapping.
plt.show()                                                            # Render both regularization views.
```
▶ What you'll see: large $\lambda$ values print smaller coefficient norms and draw smoother curves.

### Step 5 — Learning and validation curves: diagnose data need and complexity choice

A **learning curve** changes the training-set size and asks whether more data helps. A
**validation curve** changes a hyperparameter and asks where the sweet spot lies between
underfitting and overfitting.

```python
x_curve_demo = np.linspace(-3.0, 3.0, 60)                              # Create a reusable synthetic regression dataset.
y_curve_demo = np.sin(1.3 * x_curve_demo) + 0.25 * x_curve_demo + np.random.normal(0.0, 0.3, x_curve_demo.size)  # Add trend and noise.
perm_curve_demo = np.random.permutation(x_curve_demo.size)             # Shuffle row indices before splitting.
train_curve_demo = perm_curve_demo[:42]                                # Use most rows for training.
val_curve_demo = perm_curve_demo[42:]                                  # Hold out the rest for validation.
sizes_curve_demo = np.array([6, 12, 24, 42])                            # Try growing amounts of training data.
learn_train_demo = []                                                  # Store learning-curve training MSE values.
learn_val_demo = []                                                    # Store learning-curve validation MSE values.
for size_curve_demo in sizes_curve_demo:                                # Fit the same complexity with more data each time.
    subset_curve_demo = train_curve_demo[:size_curve_demo]              # Select the first size_curve_demo training rows.
    coef_curve_demo = np.polyfit(x_curve_demo[subset_curve_demo], y_curve_demo[subset_curve_demo], 4)  # Fit a fixed degree-four model.
    learn_train_demo.append(np.mean((np.polyval(coef_curve_demo, x_curve_demo[subset_curve_demo]) - y_curve_demo[subset_curve_demo]) ** 2))  # Save train MSE.
    learn_val_demo.append(np.mean((np.polyval(coef_curve_demo, x_curve_demo[val_curve_demo]) - y_curve_demo[val_curve_demo]) ** 2))  # Save validation MSE.
degrees_curve_demo = np.arange(1, 10)                                  # Try polynomial degrees for a validation curve.
valid_train_demo = []                                                  # Store validation-curve training errors.
valid_val_demo = []                                                    # Store validation-curve validation errors.
for degree_curve_demo in degrees_curve_demo:                            # Fit one model per degree.
    coef_valid_demo = np.polyfit(x_curve_demo[train_curve_demo], y_curve_demo[train_curve_demo], int(degree_curve_demo))  # Fit on training rows.
    valid_train_demo.append(np.mean((np.polyval(coef_valid_demo, x_curve_demo[train_curve_demo]) - y_curve_demo[train_curve_demo]) ** 2))  # Save train MSE.
    valid_val_demo.append(np.mean((np.polyval(coef_valid_demo, x_curve_demo[val_curve_demo]) - y_curve_demo[val_curve_demo]) ** 2))  # Save validation MSE.
best_degree_demo = int(degrees_curve_demo[np.argmin(valid_val_demo)])  # Select the validation-curve minimum.
log("learning sizes", sizes_curve_demo.tolist())                       # Print data sizes used in the learning curve.
log("learning validation MSE", np.round(learn_val_demo, 3).tolist())   # Print validation error as data grows.
log("best validation-curve degree", best_degree_demo)                  # Print the selected model complexity.

plt.subplot(1, 2, 1)                                                   # Start the learning-curve panel.
plt.plot(sizes_curve_demo, learn_train_demo, marker="o", label="train")  # Plot training error versus data size.
plt.plot(sizes_curve_demo, learn_val_demo, marker="o", label="validation")  # Plot validation error versus data size.
plt.title("learning curve")                                           # Title the data-size diagnostic.
plt.xlabel("training examples")                                       # Label the sample-size axis.
plt.ylabel("mean squared error")                                      # Label the error metric.
plt.legend()                                                          # Show train and validation labels.
plt.subplot(1, 2, 2)                                                   # Start the validation-curve panel.
plt.plot(degrees_curve_demo, valid_train_demo, marker="o", label="train")  # Plot train error by degree.
plt.plot(degrees_curve_demo, valid_val_demo, marker="o", label="validation")  # Plot validation error by degree.
plt.axvline(best_degree_demo, color="black", linestyle="--", label="selected")  # Mark the sweet spot.
plt.title("validation curve")                                         # Title the hyperparameter diagnostic.
plt.xlabel("polynomial degree")                                      # Label the complexity axis.
plt.ylabel("mean squared error")                                     # Label the error metric.
plt.legend()                                                          # Show train, validation, and selected labels.
plt.tight_layout()                                                     # Keep subplot labels readable.
plt.show()                                                            # Render both diagnostic curves.
```
▶ What you'll see: one curve shows how error changes with more data, and the other marks the best complexity by validation error.

---

## 1. Overview

Model selection is the discipline of choosing a learning procedure without accidentally using the final test set as a guide. Diagnostics are the follow-up tools that tell us *why* a model is failing: high bias, high variance, data leakage, insufficient data, poor features, or systematic error patterns.

**One-line intuition:** training error tells you how well the model memorized what it saw; validation error tells you how well your current modeling choices generalize; test error is the final audit you touch only once.

A practical workflow is:

1. Reserve a test set before modeling decisions begin.
2. Use training data to fit candidate models.
3. Use validation or cross-validation to choose complexity, regularization, and preprocessing.
4. Diagnose the chosen model with learning curves, train/validation gaps, confusion matrices, and ablations.
5. Retrain the selected pipeline on the allowed training data and report performance on the untouched test set.

## 2. Key Idea

### 2.1 Train/validation/test split

Suppose the available labeled examples are

$$
\mathcal{D}=\{(x_i,y_i)\}_{i=1}^{n}.
$$

A standard split partitions the examples into disjoint sets

$$
\mathcal{D}_{\text{train}}\cap \mathcal{D}_{\text{val}}=\varnothing,
\quad
\mathcal{D}_{\text{train}}\cap \mathcal{D}_{\text{test}}=\varnothing,
\quad
\mathcal{D}_{\text{val}}\cap \mathcal{D}_{\text{test}}=\varnothing.
$$

The roles are:

| Set | Used for | Must not be used for |
|---|---|---|
| Training | Fit parameters such as weights | Final reporting |
| Validation / development | Choose model class, hyperparameters, threshold, features | Fitting parameters directly |
| Test | One-time estimate of final generalization | Iterative tuning |

For a model family indexed by hyperparameter $h$, training gives

$$
\hat{\theta}_{h}=\arg\min_{\theta}\frac{1}{|\mathcal{D}_{\text{train}}|}
\sum_{(x_i,y_i)\in\mathcal{D}_{\text{train}}}L(f_{\theta,h}(x_i),y_i).
$$

Validation chooses

$$
\hat{h}=\arg\min_{h}\frac{1}{|\mathcal{D}_{\text{val}}|}
\sum_{(x_i,y_i)\in\mathcal{D}_{\text{val}}}L(f_{\hat{\theta}_h,h}(x_i),y_i).
$$

The final test estimate is then computed only after selection:

$$
\widehat{E}_{\text{test}}=\frac{1}{|\mathcal{D}_{\text{test}}|}
\sum_{(x_i,y_i)\in\mathcal{D}_{\text{test}}}L(f_{\hat{\theta}_{\hat{h}},\hat{h}}(x_i),y_i).
$$

### 2.2 $k$-fold cross-validation

When data is scarce, a single validation split can be noisy. In $k$-fold cross-validation, split the training portion into $k$ disjoint folds

$$
F_1,F_2,\ldots,F_k,
\quad
F_a\cap F_b=\varnothing\text{ for }a\ne b,
\quad
\bigcup_{j=1}^{k}F_j=\mathcal{D}_{\text{train}}.
$$

For fold $j$, fit on all folds except $F_j$ and validate on $F_j$:

$$
\hat{\theta}_{h}^{(-j)}=\arg\min_{\theta}
\frac{1}{|\mathcal{D}_{\text{train}}\setminus F_j|}
\sum_{(x_i,y_i)\in\mathcal{D}_{\text{train}}\setminus F_j}
L(f_{\theta,h}(x_i),y_i).
$$

The fold error is

$$
\epsilon_j(h)=\frac{1}{|F_j|}
\sum_{(x_i,y_i)\in F_j}L(f_{\hat{\theta}_{h}^{(-j)},h}(x_i),y_i).
$$

The cross-validation error is the average

$$
\operatorname{CV}_k(h)=\frac{1}{k}\sum_{j=1}^{k}\epsilon_j(h).
$$

Choose

$$
\hat{h}=\arg\min_h\operatorname{CV}_k(h).
$$

**Pseudocode.**

```text
Input: data D_train, hyperparameter grid H, number of folds k
Split D_train into folds F_1, ..., F_k
For each hyperparameter h in H:
    For each fold j = 1, ..., k:
        Fit the full pipeline on D_train \ F_j only
        Evaluate error epsilon_j(h) on F_j
    CV_k(h) <- average_j epsilon_j(h)
Select h_hat <- argmin_h CV_k(h)
Refit the selected pipeline on all allowed training data
Evaluate once on the untouched test set
```

### 2.3 Bias-variance decomposition

For squared-error regression, suppose the data-generating process is

$$
y=f(x)+\varepsilon,
\quad
\mathbb{E}[\varepsilon]=0,
\quad
\operatorname{Var}(\varepsilon)=\sigma^2.
$$

Let $\hat{f}(x)$ be the predictor learned from a random training set. The expected prediction error at a fixed point $x$ is

$$
\mathbb{E}_{\mathcal{D},\varepsilon}\left[(y-\hat{f}(x))^2\right].
$$

Substitute $y=f(x)+\varepsilon$:

$$
\mathbb{E}\left[(f(x)+\varepsilon-\hat{f}(x))^2\right].
$$

Add and subtract $\mathbb{E}_{\mathcal{D}}[\hat{f}(x)]$:

$$
\mathbb{E}\left[
\left(f(x)-\mathbb{E}[\hat{f}(x)]
+\mathbb{E}[\hat{f}(x)]-\hat{f}(x)
+\varepsilon\right)^2
\right].
$$

The cross terms vanish because $\mathbb{E}[\varepsilon]=0$ and
$\mathbb{E}[\mathbb{E}[\hat{f}(x)]-\hat{f}(x)]=0$. Therefore

$$
\mathbb{E}\left[(y-\hat{f}(x))^2\right]
=
\underbrace{\left(f(x)-\mathbb{E}[\hat{f}(x)]\right)^2}_{\text{bias}^2}
+
\underbrace{\mathbb{E}\left[\left(\hat{f}(x)-\mathbb{E}[\hat{f}(x)]\right)^2\right]}_{\text{variance}}
+
\underbrace{\sigma^2}_{\text{irreducible noise}}.
$$

Diagnostic rules:

| Symptom | Interpretation | Common remedies |
|---|---|---|
| Training error high and validation error high, gap small | High bias / underfitting | Add features, use a richer model, reduce regularization, train longer |
| Training error low and validation error much higher | High variance / overfitting | Add data, regularize, simplify model, use ensembling or better validation |
| Training error low and validation error low | Good fit on current validation distribution | Preserve test set and check robustness |
| Validation much better than test | Test distribution shift, leakage, or repeated test-set tuning | Audit pipeline and collect representative data |

### 2.4 Regularization

Regularization adds a penalty to the empirical loss. For parameters $\theta$, a general regularized objective is

$$
J_{\lambda}(\theta)=\frac{1}{m}\sum_{i=1}^{m}L(f_{\theta}(x_i),y_i)+\lambda\Omega(\theta),
\quad \lambda\ge 0.
$$

Common penalties are:

$$
\text{LASSO:}\quad \Omega(\theta)=\|\theta\|_1=\sum_{j=1}^{d}|\theta_j|,
$$

$$
\text{Ridge:}\quad \Omega(\theta)=\|\theta\|_2^2=\sum_{j=1}^{d}\theta_j^2,
$$

$$
\text{Elastic Net:}\quad \Omega(\theta)=(1-\alpha)\|\theta\|_1+\alpha\|\theta\|_2^2,
\quad \alpha\in[0,1].
$$

Increasing $\lambda$ usually increases bias and decreases variance. The correct $\lambda$ is a validation decision, not a training-error decision.

### 2.5 Learning and validation curves

A **learning curve** plots training and validation error as the number of training examples grows:

$$
m\mapsto \widehat{E}_{\text{train}}(m),
\quad
m\mapsto \widehat{E}_{\text{val}}(m).
$$

A **validation curve** plots training and validation error as a hyperparameter changes:

$$
h\mapsto \widehat{E}_{\text{train}}(h),
\quad
h\mapsto \widehat{E}_{\text{val}}(h).
$$

Use them differently:

- If both curves are high and close, adding more data rarely fixes the problem; the model is biased.
- If training error is low and validation error is high, more data or stronger regularization can help.
- If validation error has a U-shape over complexity, the left side underfits and the right side overfits.

## 3. Worked Examples

### Setup

The next examples are coded. Run the Python blocks top-to-bottom. They use CPU-only NumPy, scikit-learn, and Matplotlib.

```python
# If this is running in a fresh notebook, install the required scientific Python stack quietly.
# %pip install -q numpy pandas matplotlib scikit-learn ipywidgets
```

```python
import numpy as np  # Import NumPy for arrays, random numbers, and numerical summaries.
import pandas as pd  # Import pandas for compact validation tables and diagnostics tables.
import matplotlib.pyplot as plt  # Import Matplotlib for train/validation curves and decision plots.
from sklearn.base import clone  # Import clone so custom cross-validation refits a fresh estimator each fold.
from sklearn.datasets import make_moons  # Import moons to create a nonlinear classification diagnostic dataset.
from sklearn.datasets import load_breast_cancer  # Import a real classification dataset for nested CV.
from sklearn.datasets import load_digits  # Import digits to inspect systematic classification errors.
from sklearn.datasets import load_diabetes  # Import a built-in regression dataset for ablation analysis.
from sklearn.linear_model import Ridge  # Import Ridge regression for L2 regularization examples.
from sklearn.linear_model import Lasso  # Import Lasso regression for L1 regularization examples.
from sklearn.linear_model import LogisticRegression  # Import logistic regression for low-complexity classification baselines.
from sklearn.metrics import accuracy_score  # Import accuracy for classification train/test comparisons.
from sklearn.metrics import confusion_matrix  # Import confusion matrices for error analysis.
from sklearn.metrics import mean_squared_error  # Import MSE to evaluate regression models.
from sklearn.model_selection import KFold  # Import KFold for honest fold generation.
from sklearn.model_selection import StratifiedKFold  # Import stratified folds for class-balanced CV.
from sklearn.model_selection import cross_val_score  # Import cross_val_score for comparison with manual CV.
from sklearn.model_selection import train_test_split  # Import train_test_split for hold-out validation sets.
from sklearn.pipeline import Pipeline  # Import Pipeline to prevent preprocessing leakage.
from sklearn.preprocessing import PolynomialFeatures  # Import polynomial features to control model complexity.
from sklearn.preprocessing import StandardScaler  # Import StandardScaler for regularized linear models.
from sklearn.svm import SVC  # Import support vector classifiers for nonlinear decision boundaries.
from sklearn.tree import DecisionTreeClassifier  # Import decision trees to demonstrate overfitting.
from sklearn.impute import SimpleImputer  # Import SimpleImputer for the leakage demonstration.

RANDOM_SEED = 7  # Fix a single seed so every split and plot is reproducible.
rng = np.random.default_rng(RANDOM_SEED)  # Create one modern random number generator for synthetic data.
np.random.seed(RANDOM_SEED)  # Also seed legacy NumPy calls used inside some libraries.
plt.rcParams["figure.figsize"] = (7, 4)  # Use readable default figure sizes for notebook plots.
plt.rcParams["axes.grid"] = True  # Add light grids so curve comparisons are easier to read.
```

```python
def rmse(y_true, y_pred):  # Define a reusable root-mean-squared-error helper.
    return np.sqrt(mean_squared_error(y_true, y_pred))  # Convert MSE to the original target scale.


def plot_regression_fit(ax, model, x_grid, x_train, y_train, title):  # Define one plotting helper for fitted curves.
    y_grid = model.predict(x_grid.reshape(-1, 1))  # Predict on a dense grid to draw a smooth fitted function.
    ax.scatter(x_train, y_train, s=24, alpha=0.75, label="training data")  # Show noisy observations as points.
    ax.plot(x_grid, y_grid, linewidth=2.5, label="model")  # Draw the fitted model as a curve.
    ax.set_title(title)  # Label the panel with the model setting.
    ax.set_xlabel("x")  # Label the horizontal axis.
    ax.set_ylabel("y")  # Label the vertical axis.
    ax.legend()  # Include a legend so points and model are distinguishable.


def make_mesh(X, padding=0.6, step=0.03):  # Define a mesh helper for classification decision boundaries.
    x_min = X[:, 0].min() - padding  # Extend the left plot boundary beyond the data.
    x_max = X[:, 0].max() + padding  # Extend the right plot boundary beyond the data.
    y_min = X[:, 1].min() - padding  # Extend the lower plot boundary beyond the data.
    y_max = X[:, 1].max() + padding  # Extend the upper plot boundary beyond the data.
    xx, yy = np.meshgrid(np.arange(x_min, x_max, step), np.arange(y_min, y_max, step))  # Build the evaluation grid.
    grid = np.c_[xx.ravel(), yy.ravel()]  # Flatten the grid into feature rows for prediction.
    return xx, yy, grid  # Return mesh coordinates and model-ready rows.


def plot_decision_boundary(ax, model, X, y, title):  # Define a helper that visualizes a classifier boundary.
    xx, yy, grid = make_mesh(X)  # Build a dense mesh around the observed feature space.
    labels = model.predict(grid).reshape(xx.shape)  # Predict a class for each mesh point and reshape for contours.
    ax.contourf(xx, yy, labels, alpha=0.25, levels=[-0.5, 0.5, 1.5])  # Fill the two predicted regions lightly.
    ax.scatter(X[:, 0], X[:, 1], c=y, s=25, edgecolor="k", linewidth=0.3)  # Overlay the observed labeled points.
    ax.set_title(title)  # Add a diagnostic title.
    ax.set_xlabel("feature 1")  # Label the first feature axis.
    ax.set_ylabel("feature 2")  # Label the second feature axis.
```

#### Data — swappable sources

This lesson uses synthetic and built-in datasets so it can run without network access. The `DATA_SOURCE` switch demonstrates how a notebook section can swap data while keeping the model-selection workflow unchanged.

```python
DATA_SOURCE = "noisy_quadratic"  # Choose "noisy_quadratic", "moons", "breast_cancer", "digits", or "california".


def load_swappable_data(source=DATA_SOURCE):  # Define a data loader with one consistent interface.
    if source == "noisy_quadratic":  # Use this branch for regression model-selection curves.
        x = np.linspace(-3, 3, 90)  # Create evenly spaced one-dimensional inputs.
        noise = rng.normal(0, 1.2, size=x.shape[0])  # Add Gaussian noise so validation matters.
        y = 0.8 * x**2 - 0.5 * x + 2.0 + noise  # Generate a nonlinear quadratic target.
        return x.reshape(-1, 1), y  # Return a two-dimensional feature matrix and target vector.
    if source == "moons":  # Use this branch for nonlinear classification diagnostics.
        X, y = make_moons(n_samples=350, noise=0.28, random_state=RANDOM_SEED)  # Generate interleaving moon classes.
        return X, y  # Return features and class labels.
    if source == "breast_cancer":  # Use this branch for real nested-CV classification.
        data = load_breast_cancer()  # Load the built-in breast cancer dataset.
        return data.data, data.target  # Return numeric features and binary labels.
    if source == "digits":  # Use this branch for image-like error analysis.
        data = load_digits()  # Load the built-in handwritten digit dataset.
        return data.data, data.target  # Return flattened 8-by-8 images and labels.
    if source == "california":  # Use this branch for regression ablation analysis.
        data = load_diabetes()  # Load the built-in diabetes regression dataset without network access.
        return data.data, data.target  # Return numeric features and regression targets.
    raise ValueError("Unknown DATA_SOURCE")  # Fail loudly if the data source name is misspelled.

X_preview, y_preview = load_swappable_data(DATA_SOURCE)  # Load the selected dataset for a quick sanity check.
print(f"Data source: {DATA_SOURCE}")  # Print the chosen data source.
print(f"Feature shape: {X_preview.shape}")  # Print the number of examples and features.
print(f"Target shape: {y_preview.shape}")  # Print the target vector shape.
```

```python
if DATA_SOURCE == "noisy_quadratic":  # Plot the regression dataset when that source is selected.
    plt.figure()  # Create a new figure for the raw data.
    plt.scatter(X_preview[:, 0], y_preview, s=28, alpha=0.8)  # Show the noisy quadratic observations.
    plt.title("Raw data: noisy quadratic regression")  # Add a descriptive title.
    plt.xlabel("x")  # Label the input axis.
    plt.ylabel("y")  # Label the target axis.
    plt.show()  # Display the plot.
else:  # Plot the first two dimensions for any classification or tabular source.
    plt.figure()  # Create a new figure for the raw feature view.
    plt.scatter(X_preview[:, 0], X_preview[:, 1], c=y_preview, s=22, alpha=0.8)  # Color points by target value or class.
    plt.title(f"Raw data preview: {DATA_SOURCE}")  # Add a title using the selected source name.
    plt.xlabel("feature 1")  # Label the first feature axis.
    plt.ylabel("feature 2")  # Label the second feature axis.
    plt.show()  # Display the plot.
```

▶ What you'll see: the default source is a curved regression problem, which is perfect for watching underfitting become overfitting as polynomial degree increases.



### 📖 Concept walkthrough — build each idea from scratch

Before the warm-up examples, we build the model-selection and diagnostics ideas from scratch, one small step at a time. Everything here uses only NumPy + Matplotlib and tiny inline data, so every split, fold error, coefficient, and curve point is inspectable. Variables carry a `_w` suffix so they never collide with the examples below.

```python
import numpy as np  # NumPy gives us arrays, seeded randomness, polynomial fits, and linear algebra from scratch.
import matplotlib.pyplot as plt  # Matplotlib lets us inspect splits, fold errors, fitted curves, and diagnostics visually.
np.random.seed(15)  # Fix the seed so every shuffled index, noisy point, and plot is reproducible.
```

#### 1. Train/validation/test split: separate fitting, tuning, and final audit

A split assigns each example to exactly one role. Training data fits model parameters, validation data chooses modeling decisions, and test data estimates final performance only after those decisions are frozen. For disjoint sets, we want:

$$
\mathcal{D}_{\text{train}}\cap\mathcal{D}_{\text{val}}=\varnothing,
\quad
\mathcal{D}_{\text{train}}\cap\mathcal{D}_{\text{test}}=\varnothing,
\quad
\mathcal{D}_{\text{val}}\cap\mathcal{D}_{\text{test}}=\varnothing.
$$

We shuffle indices instead of rows first because the index lists make coverage and leakage easy to audit before any model is fit.

```python
x_split_w = np.arange(12)  # Create twelve tiny example IDs that are easy to inspect.
y_split_w = 2.0 * x_split_w + 1.0  # Create a simple target so each ID has a label.
shuffled_split_w = np.random.permutation(len(x_split_w))  # Shuffle row indices so the split is random but reproducible.
print("all indices:", np.arange(len(x_split_w)))  # Print every original row index before splitting.
print("shuffled indices:", shuffled_split_w)  # Print the random order that will be sliced into roles.
```
▶ What you'll see: the same twelve examples are present, but in a randomized order used only to assign roles.

```python
train_idx_split_w = shuffled_split_w[:7]  # Use the first seven shuffled indices for parameter fitting.
val_idx_split_w = shuffled_split_w[7:10]  # Use the next three shuffled indices for model-choice feedback.
test_idx_split_w = shuffled_split_w[10:]  # Reserve the last two shuffled indices for the final untouched audit.
print("train indices:", train_idx_split_w)  # Inspect which examples are allowed to fit weights.
print("validation indices:", val_idx_split_w)  # Inspect which examples are allowed to tune choices.
print("test indices:", test_idx_split_w)  # Inspect which examples must stay untouched until the end.
```
▶ What you'll see: each role receives a different slice of the shuffled index list.

```python
covered_split_w = np.sort(np.concatenate([train_idx_split_w, val_idx_split_w, test_idx_split_w]))  # Combine all roles and sort them for a coverage check.
disjoint_split_w = len(np.unique(covered_split_w)) == len(x_split_w)  # Verify no index was reused across roles.
complete_split_w = np.array_equal(covered_split_w, np.arange(len(x_split_w)))  # Verify no original index disappeared.
print("covered once:", covered_split_w)  # Print the sorted union of all split indices.
print("disjoint?", disjoint_split_w)  # Print whether any row leaked into multiple roles.
print("complete coverage?", complete_split_w)  # Print whether all rows were assigned exactly once.
```
▶ What you'll see: the union is `0` through `11`, disjointness is true, and coverage is complete.

```python
roles_split_w = np.empty(len(x_split_w), dtype=object)  # Allocate one role label per original example.
roles_split_w[train_idx_split_w] = "train"  # Mark training examples in the role table.
roles_split_w[val_idx_split_w] = "validation"  # Mark validation examples in the role table.
roles_split_w[test_idx_split_w] = "test"  # Mark test examples in the role table.
colors_split_w = {"train": "tab:blue", "validation": "tab:orange", "test": "tab:green"}  # Choose one color for each role.
plt.figure(figsize=(6.0, 3.8))  # Create a compact split visualization.
for role_split_w in ["train", "validation", "test"]:  # Draw each role separately so the legend is clear.
    mask_split_w = roles_split_w == role_split_w  # Select the examples assigned to the current role.
    plt.scatter(x_split_w[mask_split_w], y_split_w[mask_split_w], s=80, color=colors_split_w[role_split_w], label=role_split_w)  # Plot the examples in that role.
plt.xlabel("example index")  # Label the horizontal axis by original row index.
plt.ylabel("target y")  # Label the vertical axis by the tiny target value.
plt.title("1: train/validation/test split has disjoint roles")  # Title the figure with the concept number.
plt.legend(loc="best")  # Show which color means which data role.
plt.show()  # Render the split plot.
```
▶ What you'll see: every point appears once, colored as train, validation, or test.

The test set must stay untouched because every repeated look turns it into another validation set. If we use test error to choose features, degree, threshold, or regularization, the final estimate is optimistically biased.

*Why it's done this way: separating roles prevents feedback leakage. The validation set can guide choices many times, but the test set remains a one-time audit of the final frozen workflow.*

#### 2. k-fold cross-validation: average several validation estimates

A single validation split can be noisy when the dataset is small. In $k$-fold cross-validation, each fold takes a turn as validation while the remaining folds train the model, and the estimate is averaged:

$$
\operatorname{CV}_k(h)=\frac{1}{k}\sum_{j=1}^{k}\epsilon_j(h).
$$

Averaging reduces the variance of the validation estimate because fold-specific lucky or unlucky splits partially cancel each other instead of deciding the result alone.

```python
x_cv_w = np.linspace(-2.0, 2.0, 12)  # Create twelve ordered inputs for a tiny regression task.
y_cv_w = 1.0 + 0.8 * x_cv_w + np.array([0.2, -0.1, 0.1, -0.2, 0.0, 0.2, -0.1, 0.1, 0.0, -0.2, 0.1, -0.1])  # Add fixed small noise so outputs are inspectable.
perm_cv_w = np.random.permutation(len(x_cv_w))  # Shuffle row indices before forming folds.
folds_cv_w = np.array_split(perm_cv_w, 4)  # Split the shuffled indices into four folds by hand.
print("folds:", [fold_cv_w.tolist() for fold_cv_w in folds_cv_w])  # Print each fold's validation indices.
print("x values:", np.round(x_cv_w, 2))  # Print the tiny input grid for context.
```
▶ What you'll see: four short index lists, each ready to become validation data once.

```python
fold_errors_cv_w = []  # Create a list that will hold one validation MSE per fold.
for fold_number_cv_w, val_idx_cv_w in enumerate(folds_cv_w, start=1):  # Loop through folds so each one validates once.
    train_idx_cv_w = np.setdiff1d(perm_cv_w, val_idx_cv_w)  # Use every non-validation index for training in this fold.
    coef_cv_w = np.polyfit(x_cv_w[train_idx_cv_w], y_cv_w[train_idx_cv_w], deg=1)  # Fit a line using only this fold's training rows.
    pred_cv_w = np.polyval(coef_cv_w, x_cv_w[val_idx_cv_w])  # Predict the held-out fold with the fitted line.
    mse_cv_w = np.mean((pred_cv_w - y_cv_w[val_idx_cv_w]) ** 2)  # Compute mean squared error on the held-out fold.
    fold_errors_cv_w.append(mse_cv_w)  # Store the fold's validation error for averaging.
    print(f"fold {fold_number_cv_w}: val idx {val_idx_cv_w.tolist()}, mse {mse_cv_w:.4f}")  # Print the fold audit trail.
mean_error_cv_w = float(np.mean(fold_errors_cv_w))  # Average the fold errors into one CV estimate.
print("mean CV error:", round(mean_error_cv_w, 4))  # Print the final cross-validation estimate.
```
▶ What you'll see: every fold reports its own MSE, followed by the averaged CV error.

```python
plt.figure(figsize=(6.0, 3.8))  # Create a bar chart for fold-to-fold variation.
plt.bar(np.arange(1, 5), fold_errors_cv_w, color="tab:purple", alpha=0.75, label="fold MSE")  # Draw one bar per validation fold.
plt.axhline(mean_error_cv_w, color="black", linestyle="--", label=f"mean = {mean_error_cv_w:.3f}")  # Draw the average as a reference line.
plt.xlabel("validation fold")  # Label which fold is being scored.
plt.ylabel("mean squared error")  # Label the validation error metric.
plt.title("2: k-fold CV averages validation errors")  # Title the plot with the concept number.
plt.legend(loc="best")  # Show the bar and mean-line meanings.
plt.show()  # Render the cross-validation diagnostic.
```
▶ What you'll see: individual fold errors vary, while the dashed mean summarizes them into a steadier estimate.

*Why it's done this way: every example gets validated exactly once and trained on $k-1$ times. The average is less dependent on one lucky split, so it is usually a lower-variance guide for choosing hyperparameters.*

#### 3. Bias-variance decomposition: watch underfit become overfit

For squared loss, expected prediction error can be decomposed as:

$$
\mathbb{E}\left[(\hat{f}(x)-y)^2\right]
=\operatorname{Bias}(\hat{f}(x))^2+\operatorname{Var}(\hat{f}(x))+\sigma^2.
$$

Low-degree polynomials have high bias because they cannot bend enough; very high-degree polynomials have high variance because they chase noise. We fit increasing degrees to see training error fall while validation error becomes U-shaped.

```python
x_bv_w = np.linspace(-3.0, 3.0, 36)  # Create a small one-dimensional input grid.
noise_bv_w = np.random.normal(0.0, 0.35, size=x_bv_w.shape[0])  # Add reproducible noise to make overfitting possible.
y_bv_w = np.sin(1.4 * x_bv_w) + 0.25 * x_bv_w + noise_bv_w  # Generate a nonlinear target with a trend.
train_idx_bv_w = np.arange(0, 36, 2)  # Use alternating rows for training so coverage spans the whole x-range.
val_idx_bv_w = np.arange(1, 36, 2)  # Use the remaining alternating rows for validation.
print("train size:", len(train_idx_bv_w), "validation size:", len(val_idx_bv_w))  # Print split sizes for the diagnostic.
print("first training pairs:", list(zip(np.round(x_bv_w[train_idx_bv_w[:4]], 2), np.round(y_bv_w[train_idx_bv_w[:4]], 2))))  # Inspect a few training pairs.
```
▶ What you'll see: a small noisy regression dataset split into equal training and validation halves.

```python
degrees_bv_w = np.array([1, 2, 3, 5, 9, 13])  # Choose polynomial complexities from underfit to flexible.
train_errors_bv_w = []  # Store training MSE for each degree.
val_errors_bv_w = []  # Store validation MSE for each degree.
for degree_bv_w in degrees_bv_w:  # Fit each polynomial degree separately.
    coef_bv_w = np.polyfit(x_bv_w[train_idx_bv_w], y_bv_w[train_idx_bv_w], deg=int(degree_bv_w))  # Fit coefficients using only training rows.
    train_pred_bv_w = np.polyval(coef_bv_w, x_bv_w[train_idx_bv_w])  # Predict the training rows.
    val_pred_bv_w = np.polyval(coef_bv_w, x_bv_w[val_idx_bv_w])  # Predict the validation rows.
    train_errors_bv_w.append(np.mean((train_pred_bv_w - y_bv_w[train_idx_bv_w]) ** 2))  # Record training MSE.
    val_errors_bv_w.append(np.mean((val_pred_bv_w - y_bv_w[val_idx_bv_w]) ** 2))  # Record validation MSE.
print("degrees:", degrees_bv_w)  # Print the tried model complexities.
print("train MSE:", np.round(train_errors_bv_w, 3))  # Print training errors to show they generally decrease.
print("validation MSE:", np.round(val_errors_bv_w, 3))  # Print validation errors to show the U-shape.
```
▶ What you'll see: training error trends downward, while validation error is best at an intermediate degree.

```python
grid_bv_w = np.linspace(-3.1, 3.1, 300)  # Create a smooth grid for drawing fitted polynomials.
best_pos_bv_w = int(np.argmin(val_errors_bv_w))  # Find the degree with the lowest validation error.
plt.figure(figsize=(7.0, 4.2))  # Create a curve-comparison figure.
plt.scatter(x_bv_w[train_idx_bv_w], y_bv_w[train_idx_bv_w], s=35, color="tab:blue", label="train")  # Plot training observations.
plt.scatter(x_bv_w[val_idx_bv_w], y_bv_w[val_idx_bv_w], s=35, color="tab:orange", label="validation")  # Plot validation observations.
for degree_bv_w in [1, int(degrees_bv_w[best_pos_bv_w]), 13]:  # Draw underfit, selected, and overfit examples.
    coef_plot_bv_w = np.polyfit(x_bv_w[train_idx_bv_w], y_bv_w[train_idx_bv_w], deg=degree_bv_w)  # Refit the chosen degree on training rows.
    plt.plot(grid_bv_w, np.polyval(coef_plot_bv_w, grid_bv_w), linewidth=2, label=f"degree {degree_bv_w}")  # Draw the fitted curve.
plt.xlabel("x")  # Label the input axis.
plt.ylabel("y")  # Label the target axis.
plt.title("3: polynomial fits move from bias to variance")  # Title the figure with the concept number.
plt.legend(loc="best")  # Show which curve corresponds to which degree.
plt.show()  # Render the polynomial-fit plot.
```
▶ What you'll see: degree 1 underfits, the middle degree tracks the signal, and degree 13 wiggles toward noise.

```python
plt.figure(figsize=(6.0, 3.8))  # Create an error-curve figure.
plt.plot(degrees_bv_w, train_errors_bv_w, marker="o", label="train MSE")  # Plot training error against complexity.
plt.plot(degrees_bv_w, val_errors_bv_w, marker="o", label="validation MSE")  # Plot validation error against complexity.
plt.axvline(degrees_bv_w[best_pos_bv_w], color="black", linestyle="--", label="best validation degree")  # Mark the validation-selected complexity.
plt.xlabel("polynomial degree")  # Label model complexity on the x-axis.
plt.ylabel("mean squared error")  # Label the error metric.
plt.title("3: train error falls while validation error is U-shaped")  # Title the diagnostic curve.
plt.legend(loc="best")  # Show train, validation, and selection meanings.
plt.show()  # Render the bias-variance diagnostic.
```
▶ What you'll see: the validation curve forms a U-shape, which is the practical sign of the bias-variance tradeoff.

*Why it's done this way: increasing degree gives the model more freedom. That freedom first reduces bias, then eventually raises variance when the model starts fitting sample noise instead of stable signal.*

#### 4. Regularization: shrink coefficients to smooth a flexible model

Regularization adds a penalty to the training objective so a flexible model cannot use huge coefficients without paying for them. Ridge-style polynomial regression solves:

$$
\min_w \frac{1}{m}\sum_{i=1}^{m}(x_i^\top w-y_i)^2+\lambda\sum_{j=1}^{p}w_j^2.
$$

The intercept is usually left unpenalized; the penalty targets slope and curvature terms so increasing $\lambda$ shrinks them and smooths the fitted curve.

```python
x_reg_w = x_bv_w[train_idx_bv_w]  # Reuse the tiny training inputs from the bias-variance section.
y_reg_w = y_bv_w[train_idx_bv_w]  # Reuse the matching training targets.
degree_reg_w = 9  # Choose a flexible polynomial that can wiggle without regularization.
X_reg_w = np.vander(x_reg_w, N=degree_reg_w + 1, increasing=True)  # Build [1, x, x^2, ...] features by hand.
grid_reg_w = np.linspace(-3.1, 3.1, 300)  # Create a smooth x-grid for plotting fitted curves.
X_grid_reg_w = np.vander(grid_reg_w, N=degree_reg_w + 1, increasing=True)  # Build matching polynomial features for the grid.
print("design shape:", X_reg_w.shape)  # Print rows and polynomial-feature columns.
print("first design row:", np.round(X_reg_w[0, :5], 3))  # Inspect the first few powers for one example.
```
▶ What you'll see: the manual design matrix contains powers of each input, starting with the intercept column.

```python
lambdas_reg_w = np.array([0.0, 0.01, 0.1, 1.0, 10.0])  # Try penalties from none to strong.
coefs_reg_w = []  # Store one coefficient vector per lambda.
fits_reg_w = []  # Store one smooth fitted curve per lambda.
penalty_reg_w = np.eye(degree_reg_w + 1)  # Create the ridge penalty matrix.
penalty_reg_w[0, 0] = 0.0  # Do not penalize the intercept term.
for lambda_reg_w in lambdas_reg_w:  # Solve one ridge system for each regularization strength.
    system_reg_w = X_reg_w.T @ X_reg_w + lambda_reg_w * penalty_reg_w  # Build X^T X + lambda D by hand.
    rhs_reg_w = X_reg_w.T @ y_reg_w  # Build X^T y by hand.
    coef_reg_w = np.linalg.solve(system_reg_w, rhs_reg_w)  # Solve the linear system for ridge coefficients.
    coefs_reg_w.append(coef_reg_w)  # Store the coefficients for inspection.
    fits_reg_w.append(X_grid_reg_w @ coef_reg_w)  # Store the smooth fitted curve for plotting.
print("lambda values:", lambdas_reg_w)  # Print the tried penalty strengths.
print("coefficient norms:", np.round([np.linalg.norm(coef_reg_w[1:]) for coef_reg_w in coefs_reg_w], 3))  # Print non-intercept shrinkage.
```
▶ What you'll see: as $\lambda$ grows, the non-intercept coefficient norm shrinks.

```python
plt.figure(figsize=(7.0, 4.2))  # Create a regularization fit figure.
plt.scatter(x_reg_w, y_reg_w, s=40, color="black", label="training data")  # Plot the data used to fit the curves.
for lambda_reg_w, fit_reg_w in zip(lambdas_reg_w, fits_reg_w):  # Draw one curve per regularization strength.
    plt.plot(grid_reg_w, fit_reg_w, linewidth=2, label=f"lambda={lambda_reg_w:g}")  # Plot the ridge-smoothed polynomial.
plt.xlabel("x")  # Label the input axis.
plt.ylabel("y")  # Label the target axis.
plt.title("4: regularization shrinks and smooths")  # Title the plot with the concept number.
plt.legend(loc="best")  # Show the mapping from curve to lambda.
plt.show()  # Render the regularized fits.
```
▶ What you'll see: the unregularized curve is most wiggly, and larger $\lambda$ values produce smoother curves.

```python
coef_matrix_reg_w = np.vstack(coefs_reg_w)  # Stack coefficient vectors into a lambda-by-feature matrix.
plt.figure(figsize=(6.0, 3.8))  # Create a coefficient-shrinkage figure.
plt.plot(lambdas_reg_w, np.linalg.norm(coef_matrix_reg_w[:, 1:], axis=1), marker="o")  # Plot non-intercept coefficient norm versus lambda.
plt.xscale("symlog", linthresh=0.01)  # Use a symmetric log scale so lambda=0 and larger values fit together.
plt.xlabel("lambda")  # Label the regularization strength.
plt.ylabel("non-intercept coefficient norm")  # Label the shrinkage summary.
plt.title("4: ridge penalty makes coefficients smaller")  # Title the coefficient diagnostic.
plt.show()  # Render the shrinkage plot.
```
▶ What you'll see: coefficient size drops as the penalty increases, matching the smoother fitted curves.

*Why it's done this way: high-degree features can fit noise by using large canceling coefficients. Ridge regularization keeps the flexible basis but charges coefficient size, reducing variance without forcing the model class to be purely linear.*

#### 5. Learning and validation curves: diagnose data need and complexity choice

A learning curve plots error versus training-set size; it answers whether more data may help. A validation curve plots error versus a hyperparameter such as model complexity; it answers where the sweet spot between underfitting and overfitting lies.

We build both from scratch with the same train/validation split so the axes change one at a time: first sample size, then polynomial degree.

```python
x_curve_w = x_bv_w.copy()  # Reuse the tiny nonlinear inputs for comparable diagnostics.
y_curve_w = y_bv_w.copy()  # Reuse the same noisy targets for comparable diagnostics.
train_idx_curve_w = train_idx_bv_w.copy()  # Reuse the training indices from the earlier split.
val_idx_curve_w = val_idx_bv_w.copy()  # Reuse the validation indices from the earlier split.
sizes_curve_w = np.array([4, 8, 12, 16, len(train_idx_curve_w)])  # Choose growing training-set sizes.
degree_curve_w = 5  # Hold model complexity fixed while building the learning curve.
print("learning-curve sizes:", sizes_curve_w)  # Print the sample sizes that will be tested.
print("fixed degree:", degree_curve_w)  # Print the fixed model complexity for the learning curve.
```
▶ What you'll see: the learning curve will add training examples while keeping polynomial degree fixed.

```python
learn_train_errors_w = []  # Store training errors for each sample size.
learn_val_errors_w = []  # Store validation errors for each sample size.
for size_curve_w in sizes_curve_w:  # Fit the same degree with progressively more training rows.
    subset_idx_curve_w = train_idx_curve_w[:size_curve_w]  # Take the first size_curve_w training indices.
    coef_curve_w = np.polyfit(x_curve_w[subset_idx_curve_w], y_curve_w[subset_idx_curve_w], deg=degree_curve_w)  # Fit the fixed-degree polynomial.
    train_pred_curve_w = np.polyval(coef_curve_w, x_curve_w[subset_idx_curve_w])  # Predict the subset used for fitting.
    val_pred_curve_w = np.polyval(coef_curve_w, x_curve_w[val_idx_curve_w])  # Predict the same validation set each time.
    learn_train_errors_w.append(np.mean((train_pred_curve_w - y_curve_w[subset_idx_curve_w]) ** 2))  # Record subset training MSE.
    learn_val_errors_w.append(np.mean((val_pred_curve_w - y_curve_w[val_idx_curve_w]) ** 2))  # Record validation MSE.
print("learning train MSE:", np.round(learn_train_errors_w, 3))  # Print training error versus sample size.
print("learning validation MSE:", np.round(learn_val_errors_w, 3))  # Print validation error versus sample size.
```
▶ What you'll see: training error often rises from tiny samples, while validation error usually becomes more stable with more data.

```python
complexities_curve_w = np.arange(1, 11)  # Choose polynomial degrees for a validation curve.
valid_train_errors_w = []  # Store training errors for each degree.
valid_val_errors_w = []  # Store validation errors for each degree.
for degree_valid_w in complexities_curve_w:  # Fit one model per complexity value.
    coef_valid_w = np.polyfit(x_curve_w[train_idx_curve_w], y_curve_w[train_idx_curve_w], deg=int(degree_valid_w))  # Fit the current polynomial degree on all training rows.
    train_pred_valid_w = np.polyval(coef_valid_w, x_curve_w[train_idx_curve_w])  # Predict training rows for this degree.
    val_pred_valid_w = np.polyval(coef_valid_w, x_curve_w[val_idx_curve_w])  # Predict validation rows for this degree.
    valid_train_errors_w.append(np.mean((train_pred_valid_w - y_curve_w[train_idx_curve_w]) ** 2))  # Store training MSE for this degree.
    valid_val_errors_w.append(np.mean((val_pred_valid_w - y_curve_w[val_idx_curve_w]) ** 2))  # Store validation MSE for this degree.
best_degree_curve_w = int(complexities_curve_w[np.argmin(valid_val_errors_w)])  # Select the degree with the lowest validation error.
print("validation-curve degrees:", complexities_curve_w)  # Print the complexity grid.
print("best degree by validation:", best_degree_curve_w)  # Print the sweet-spot complexity.
```
▶ What you'll see: the selected degree is the one with the smallest validation error, not necessarily the smallest training error.

```python
plt.figure(figsize=(10.0, 4.0))  # Create a two-panel diagnostic figure.
plt.subplot(1, 2, 1)  # Start the learning-curve panel.
plt.plot(sizes_curve_w, learn_train_errors_w, marker="o", label="train MSE")  # Plot training error versus sample size.
plt.plot(sizes_curve_w, learn_val_errors_w, marker="o", label="validation MSE")  # Plot validation error versus sample size.
plt.xlabel("training-set size")  # Label the learning-curve x-axis.
plt.ylabel("mean squared error")  # Label the shared error metric.
plt.title("5: learning curve")  # Title the first panel.
plt.legend(loc="best")  # Show train and validation meanings.
plt.subplot(1, 2, 2)  # Start the validation-curve panel.
plt.plot(complexities_curve_w, valid_train_errors_w, marker="o", label="train MSE")  # Plot training error versus complexity.
plt.plot(complexities_curve_w, valid_val_errors_w, marker="o", label="validation MSE")  # Plot validation error versus complexity.
plt.axvline(best_degree_curve_w, color="black", linestyle="--", label="sweet spot")  # Mark the validation-selected degree.
plt.annotate("sweet spot", xy=(best_degree_curve_w, min(valid_val_errors_w)), xytext=(best_degree_curve_w + 1.0, min(valid_val_errors_w) + 0.5), arrowprops={"arrowstyle": "->"})  # Label the chosen complexity.
plt.xlabel("polynomial degree")  # Label the validation-curve x-axis.
plt.ylabel("mean squared error")  # Label the error metric for the second panel.
plt.title("5: validation curve")  # Title the second panel.
plt.legend(loc="best")  # Show train, validation, and sweet-spot meanings.
plt.tight_layout()  # Prevent labels from overlapping across panels.
plt.show()  # Render both diagnostic curves.
```
▶ What you'll see: the learning curve shows the effect of more data, and the validation curve marks the model-complexity sweet spot.

*Why it's done this way: learning curves separate data scarcity from model mismatch, while validation curves isolate a hyperparameter choice. Together they say whether to collect more data, simplify, regularize, or allow more flexibility.*


### 🟢 Basics (warm-up)

#### B1. Split six examples into train and validation indices

**Problem.** Six examples are indexed

$$
0,1,2,3,4,5.
$$

Use the first four as training data and the last two as validation data. Write the two index sets and verify they are disjoint.

**Solution.**

Step 1: Define the full index set.

$$
I=\{0,1,2,3,4,5\}.
$$

Step 2: Put the first four indices into training.

$$
I_{\text{train}}=\{0,1,2,3\}.
$$

Step 3: Put the remaining two indices into validation.

$$
I_{\text{val}}=\{4,5\}.
$$

Step 4: Check disjointness.

$$
I_{\text{train}}\cap I_{\text{val}}
=
\{0,1,2,3\}\cap\{4,5\}
=
\varnothing.
$$

Step 5: Check coverage.

$$
I_{\text{train}}\cup I_{\text{val}}
=
\{0,1,2,3\}\cup\{4,5\}
=
\{0,1,2,3,4,5\}=I.
$$

$$
\boxed{I_{\text{train}}=\{0,1,2,3\},\quad I_{\text{val}}=\{4,5\}.}
$$

Interpretation: the training and validation subsets use different examples, so validation can estimate held-out behavior.

```python
indices_b1 = np.arange(6)  # store the six example indices.
train_b1 = indices_b1[:4]  # take the first four indices for training.
val_b1 = indices_b1[4:]  # take the last two indices for validation.
intersection_b1 = np.intersect1d(train_b1, val_b1)  # compute the overlap between train and validation.
coverage_b1 = np.union1d(train_b1, val_b1)  # compute the covered indices after the split.
print("train:", train_b1.tolist())  # print the training index set.
print("validation:", val_b1.tolist())  # print the validation index set.
print("disjoint:", intersection_b1.size == 0)  # print whether the sets are disjoint.
print("covers all:", np.array_equal(coverage_b1, indices_b1))  # print whether the split covers all examples.
```

▶ What you'll see: train `[0, 1, 2, 3]`, validation `[4, 5]`, with disjoint and coverage checks both true.

👀 Takeaway: a validation split should be separate from the training examples it evaluates.

#### B2. Average two validation errors into one CV error

**Problem.** A 2-fold cross-validation run gives validation errors

$$
\epsilon_1=0.30,
\qquad
\epsilon_2=0.20.
$$

Compute the cross-validation error.

**Solution.**

Step 1: Use the $k$-fold average formula.

$$
\operatorname{CV}_k=\frac{1}{k}\sum_{j=1}^{k}\epsilon_j.
$$

Step 2: Substitute $k=2$.

$$
\operatorname{CV}_2=\frac{1}{2}(\epsilon_1+\epsilon_2).
$$

Step 3: Substitute the two errors.

$$
\operatorname{CV}_2=\frac{1}{2}(0.30+0.20).
$$

Step 4: Add and divide.

$$
\operatorname{CV}_2=\frac{0.50}{2}=0.25.
$$

$$
\boxed{\operatorname{CV}_2=0.25.}
$$

Interpretation: the cross-validation estimate summarizes the two held-out fold errors by averaging them.

```python
fold_errors_b2 = np.array([0.30, 0.20])  # store the two validation fold errors.
cv_error_b2 = fold_errors_b2.mean()  # average the fold errors to match the formula.
print("fold errors:", fold_errors_b2)  # print the intermediate fold errors.
print(f"CV_2={cv_error_b2:.2f}")  # print the final cross-validation error.
```

▶ What you'll see: the two fold errors average to `CV_2=0.25`.

👀 Takeaway: k-fold CV reports the mean validation error across folds.

#### B3. Diagnose one train/validation error pair

**Problem.** A classifier has training error

$$
E_{\text{train}}=0.02
$$

and validation error

$$
E_{\text{val}}=0.25.
$$

Diagnose the main issue and name two remedies.

**Solution.**

Step 1: Compute the generalization gap.

$$
\text{gap}=E_{\text{val}}-E_{\text{train}}.
$$

Step 2: Substitute the numbers.

$$
\text{gap}=0.25-0.02=0.23.
$$

Step 3: Interpret the train error.

$$
E_{\text{train}}=0.02
$$

is low, so the model fits the training set very well.

Step 4: Interpret the validation error.

$$
E_{\text{val}}=0.25
$$

is much larger than the training error, so performance collapses on held-out data.

Step 5: Use the diagnostic rule.

$$
\text{low train error} + \text{large validation gap}
\Longrightarrow \text{high variance / overfitting}.
$$

Two standard remedies are stronger regularization and more training data.

$$
\boxed{\text{Main issue: high variance / overfitting; remedies: regularize and add data.}}
$$

Interpretation: a low training error with a large validation gap means the model fits training data better than held-out data.

```python
train_error_b3 = 0.02  # store the training error.
val_error_b3 = 0.25  # store the validation error.
gap_b3 = val_error_b3 - train_error_b3  # compute the generalization gap.
diagnosis_b3 = "high variance / overfitting" if train_error_b3 < 0.05 and gap_b3 > 0.10 else "not high variance"  # apply the diagnostic rule.
remedies_b3 = ["regularize", "add data"]  # store two standard remedies.
print(f"gap={gap_b3:.2f}")  # print the computed gap.
print("diagnosis:", diagnosis_b3)  # print the selected diagnosis.
print("remedies:", remedies_b3)  # print the remedies from the math solution.
```

▶ What you'll see: the gap is `0.23`, so the printed diagnosis is high variance / overfitting.

👀 Takeaway: a large held-out gap is the numerical signature of overfitting.

#### B4. Split eight examples into train and test indices

**Problem.** Eight examples are indexed

$$
0,1,2,3,4,5,6,7.
$$

Use the first six as training data and the last two as test data.

**Solution.**

Step 1: Put the first six indices into training.

$$
I_{\text{train}}=\{0,1,2,3,4,5\}.
$$

Step 2: Put the untouched final two indices into test.

$$
I_{\text{test}}=\{6,7\}.
$$

Step 3: Verify that no index appears in both sets.

$$
I_{\text{train}}\cap I_{\text{test}}=\varnothing.
$$

$$
\boxed{I_{\text{train}}=\{0,1,2,3,4,5\},\quad I_{\text{test}}=\{6,7\}.}
$$

Interpretation: the test indices are held out from training so they can be used for a final audit only once.

```python
indices_b4 = np.arange(8)  # store the eight example indices.
train_b4 = indices_b4[:6]  # take the first six indices for training.
test_b4 = indices_b4[6:]  # take the last two indices for testing.
overlap_b4 = np.intersect1d(train_b4, test_b4)  # compute any overlap between train and test.
print("train:", train_b4.tolist())  # print the training index set.
print("test:", test_b4.tolist())  # print the test index set.
print("disjoint:", overlap_b4.size == 0)  # print whether the sets are disjoint.
```

▶ What you'll see: train `[0, 1, 2, 3, 4, 5]`, test `[6, 7]`, and a true disjointness check.

👀 Takeaway: the test set must not share examples with the training set.

#### B5. Compute train error vs test error

**Problem.** A classifier makes $1$ mistake on $10$ training examples and $4$ mistakes on $10$ test examples. Compute both errors.

**Solution.**

Step 1: Training error is mistakes divided by training examples.

$$
E_{\text{train}}=\frac{1}{10}=0.10.
$$

Step 2: Test error is mistakes divided by test examples.

$$
E_{\text{test}}=\frac{4}{10}=0.40.
$$

Step 3: Compare the held-out error to the training error.

$$
E_{\text{test}}-E_{\text{train}}=0.40-0.10=0.30.
$$

$$
\boxed{E_{\text{train}}=0.10,\quad E_{\text{test}}=0.40.}
$$

Interpretation: the test error is much larger than the training error, revealing weaker held-out performance.

```python
mistakes_b5 = np.array([1, 4])  # store training and test mistake counts.
examples_b5 = np.array([10, 10])  # store training and test example counts.
errors_b5 = mistakes_b5 / examples_b5  # divide mistakes by examples to compute errors.
gap_b5 = errors_b5[1] - errors_b5[0]  # compute the test-minus-train error gap.
print(f"E_train={errors_b5[0]:.2f}")  # print the training error.
print(f"E_test={errors_b5[1]:.2f}")  # print the test error.
print(f"gap={gap_b5:.2f}")  # print the held-out gap.
```

▶ What you'll see: `E_train=0.10`, `E_test=0.40`, and a gap of `0.30`.

👀 Takeaway: comparing train and test error reveals how much performance drops on held-out data.

#### B6. Make three fold index splits

**Problem.** Six examples are indexed $0,1,2,3,4,5$. Split them into $3$ folds of equal size.

**Solution.**

Step 1: Since there are $6$ examples and $3$ folds, each fold has

$$
\frac{6}{3}=2
$$

examples.

Step 2: Assign consecutive pairs to folds.

$$
F_1=\{0,1\},\qquad F_2=\{2,3\},\qquad F_3=\{4,5\}.
$$

Step 3: Check that the folds cover all examples without overlap.

$$
F_1\cup F_2\cup F_3=\{0,1,2,3,4,5\}.
$$

$$
\boxed{F_1=\{0,1\},\ F_2=\{2,3\},\ F_3=\{4,5\}.}
$$

Interpretation: equal-sized folds partition the data so each example can serve as validation once.

```python
indices_b6 = np.arange(6)  # store the six example indices.
folds_b6 = np.array_split(indices_b6, 3)  # split the indices into three equal folds.
covered_b6 = np.concatenate(folds_b6)  # combine the folds to check coverage.
fold_sizes_b6 = np.array([fold.size for fold in folds_b6])  # compute each fold size.
print("folds:", [fold.tolist() for fold in folds_b6])  # print the three fold index sets.
print("fold sizes:", fold_sizes_b6.tolist())  # print the fold sizes.
print("covers all:", np.array_equal(covered_b6, indices_b6))  # print whether the folds cover all examples.
```

▶ What you'll see: folds `[[0, 1], [2, 3], [4, 5]]`, each with size 2.

👀 Takeaway: cross-validation folds should cover the data without overlap.

#### B7. Label one validation-curve point

**Problem.** A validation curve at polynomial degree $d=1$ has

$$
E_{\text{train}}=0.34,\qquad E_{\text{val}}=0.36.
$$

Label the point as bias-like or variance-like.

**Solution.**

Step 1: The training error is high.

$$
E_{\text{train}}=0.34.
$$

Step 2: The validation error is also high and close to the training error.

$$
E_{\text{val}}-E_{\text{train}}=0.36-0.34=0.02.
$$

Step 3: High and close errors indicate the model is too simple.

$$
\text{high train error} + \text{small gap}\Longrightarrow \text{high bias / underfitting}.
$$

$$
\boxed{\text{The point is bias-like / underfit.}}
$$

Interpretation: high, similar training and validation errors indicate the model is too simple rather than too flexible.

```python
train_error_b7 = 0.34  # store the training error at degree one.
val_error_b7 = 0.36  # store the validation error at degree one.
gap_b7 = val_error_b7 - train_error_b7  # compute the validation-minus-training gap.
label_b7 = "bias-like / underfit" if train_error_b7 > 0.30 and gap_b7 < 0.05 else "variance-like"  # apply the validation-curve rule.
print(f"E_train={train_error_b7:.2f}")  # print the training error.
print(f"E_val={val_error_b7:.2f}")  # print the validation error.
print(f"gap={gap_b7:.2f}")  # print the gap.
print("label:", label_b7)  # print the final label.
```

▶ What you'll see: high errors with a tiny `0.02` gap produce the label bias-like / underfit.

👀 Takeaway: high and close errors usually point to underfitting.

#### B8. Show regularization $\lambda$ shrinking one weight

**Problem.** A one-weight ridge-style update can be summarized as

$$
w_{\text{new}}=\frac{w_{\text{unregularized}}}{1+\lambda}.
$$

If $w_{\text{unregularized}}=6$ and $\lambda=2$, compute $w_{\text{new}}$.

**Solution.**

Step 1: Substitute the values.

$$
w_{\text{new}}=\frac{6}{1+2}.
$$

Step 2: Simplify the denominator.

$$
w_{\text{new}}=\frac{6}{3}=2.
$$

Step 3: Interpret the effect.

$$
|2|<|6|,
$$

so increasing regularization shrank the weight toward zero.

$$
\boxed{w_{\text{new}}=2.}
$$

Interpretation: the positive regularization strength divides the unregularized weight by a larger denominator.

```python
w_unregularized_b8 = 6.0  # store the unregularized weight.
lambda_b8 = 2.0  # store the regularization strength.
w_new_b8 = w_unregularized_b8 / (1.0 + lambda_b8)  # apply the ridge-style shrinkage formula.
shrinkage_b8 = abs(w_new_b8) < abs(w_unregularized_b8)  # check whether the weight moved toward zero.
print(f"w_unregularized={w_unregularized_b8:.0f}")  # print the starting weight.
print(f"lambda={lambda_b8:.0f}")  # print the regularization strength.
print(f"w_new={w_new_b8:.0f}")  # print the shrunken weight.
print("shrank:", shrinkage_b8)  # print whether shrinkage occurred.
```

▶ What you'll see: `w_new=2`, which is smaller in magnitude than the original weight 6.

👀 Takeaway: stronger regularization can shrink coefficients toward zero.

#### B9. Read one learning-curve point

**Problem.** A learning curve reports that at training size $m=50$,

$$
E_{\text{train}}(50)=0.08,
\qquad
E_{\text{val}}(50)=0.18.
$$

Compute the train-validation gap at this point.

**Solution.**

Step 1: Use the gap formula at a fixed training size.

$$
\text{gap}(m)=E_{\text{val}}(m)-E_{\text{train}}(m).
$$

Step 2: Substitute $m=50$.

$$
\text{gap}(50)=0.18-0.08=0.10.
$$

$$
\boxed{\text{At }m=50,\text{ the gap is }0.10.}
$$

Interpretation: this learning-curve point has validation error ten percentage points above training error.

```python
m_b9 = 50  # store the training size for the learning-curve point.
train_error_b9 = 0.08  # store the training error at that size.
val_error_b9 = 0.18  # store the validation error at that size.
gap_b9 = val_error_b9 - train_error_b9  # compute the train-validation gap.
print(f"m={m_b9}")  # print the training size.
print(f"E_train({m_b9})={train_error_b9:.2f}")  # print the training error.
print(f"E_val({m_b9})={val_error_b9:.2f}")  # print the validation error.
print(f"gap({m_b9})={gap_b9:.2f}")  # print the final gap.
```

▶ What you'll see: at `m=50`, the printed gap is `0.10`.

👀 Takeaway: a learning-curve gap measures held-out error above training error at a fixed data size.

#### B10. Pick best model by validation score

**Problem.** Three candidate models have validation accuracies

$$
A:0.78,\qquad B:0.84,\qquad C:0.81.
$$

Which model should be selected before touching the test set?

**Solution.**

Step 1: Compare validation accuracies only.

$$
0.84>0.81>0.78.
$$

Step 2: The largest validation accuracy belongs to model $B$.

Step 3: Keep the test set untouched until after this choice is made.

$$
\boxed{\text{Select model }B\text{ by validation accuracy.}}
$$

Interpretation: model selection uses validation performance for the choice while keeping the test set untouched.

```python
model_names_b10 = np.array(["A", "B", "C"])  # store the candidate model names.
val_accuracies_b10 = np.array([0.78, 0.84, 0.81])  # store the validation accuracies.
best_index_b10 = np.argmax(val_accuracies_b10)  # find the index of the largest validation accuracy.
best_model_b10 = model_names_b10[best_index_b10]  # look up the model name at that index.
best_accuracy_b10 = val_accuracies_b10[best_index_b10]  # look up the best validation accuracy.
scores_b10 = {str(name): float(score) for name, score in zip(model_names_b10, val_accuracies_b10)}  # format scores for readable printing.
print("validation accuracies:", scores_b10)  # print all candidate scores.
print(f"best model={best_model_b10}")  # print the selected model.
print(f"best validation accuracy={best_accuracy_b10:.2f}")  # print the selected validation score.
```

▶ What you'll see: model `B` is selected because its validation accuracy is `0.84`.

👀 Takeaway: choose the model with the best validation score before evaluating on test data.

### 🟡 Easy

#### E1. Hand-split a dataset into train/validation/test

**Problem.** A dataset has 20 indexed examples

$$
0,1,2,\ldots,19.
$$

Use a 60% / 20% / 20% split into train, validation, and test sets, preserving index order. Give all three sets and verify their sizes.

**Solution.**

Step 1: Compute the training size.

$$
0.60\times 20=12.
$$

So the training set contains 12 examples.

Step 2: Compute the validation size.

$$
0.20\times 20=4.
$$

So the validation set contains 4 examples.

Step 3: Compute the test size.

$$
0.20\times 20=4.
$$

So the test set contains 4 examples.

Step 4: Assign the first 12 indices to training.

$$
I_{\text{train}}=\{0,1,2,3,4,5,6,7,8,9,10,11\}.
$$

Step 5: Assign the next 4 indices to validation.

$$
I_{\text{val}}=\{12,13,14,15\}.
$$

Step 6: Assign the last 4 indices to testing.

$$
I_{\text{test}}=\{16,17,18,19\}.
$$

Step 7: Verify the sizes.

$$
|I_{\text{train}}|=12,
\qquad
|I_{\text{val}}|=4,
\qquad
|I_{\text{test}}|=4.
$$

Step 8: Verify the total count.

$$
12+4+4=20.
$$

Step 9: Verify no overlap.

$$
I_{\text{train}}\cap I_{\text{val}}=\varnothing,
\quad
I_{\text{train}}\cap I_{\text{test}}=\varnothing,
\quad
I_{\text{val}}\cap I_{\text{test}}=\varnothing.
$$

$$
\boxed{
I_{\text{train}}=\{0,\ldots,11\},\quad
I_{\text{val}}=\{12,13,14,15\},\quad
I_{\text{test}}=\{16,17,18,19\}.
}
$$

#### E2. Compute 5-fold CV error by hand

**Problem.** A 5-fold cross-validation experiment produces fold errors

$$
0.22,\quad 0.18,\quad 0.20,\quad 0.24,\quad 0.16.
$$

Compute the cross-validation error.

**Solution.**

Step 1: Write the $k$-fold formula.

$$
\operatorname{CV}_5=\frac{1}{5}\sum_{j=1}^{5}\epsilon_j.
$$

Step 2: Substitute each fold error.

$$
\operatorname{CV}_5=
\frac{1}{5}(0.22+0.18+0.20+0.24+0.16).
$$

Step 3: Add the first two errors.

$$
0.22+0.18=0.40.
$$

Step 4: Add the third error.

$$
0.40+0.20=0.60.
$$

Step 5: Add the fourth error.

$$
0.60+0.24=0.84.
$$

Step 6: Add the fifth error.

$$
0.84+0.16=1.00.
$$

Step 7: Divide by 5.

$$
\operatorname{CV}_5=\frac{1.00}{5}=0.20.
$$

$$
\boxed{\operatorname{CV}_5=0.20.}
$$

#### E3. Polynomial degree selection

**Problem.** Use a train/validation split to choose the polynomial degree for noisy quadratic regression. Compare degrees 1 through 15 and visualize degree 1, degree 2, and degree 12 fits.

```python
X, y = load_swappable_data("noisy_quadratic")  # Load the synthetic regression dataset for degree selection.
X_train, X_val, y_train, y_val = train_test_split(X, y, test_size=0.30, random_state=RANDOM_SEED)  # Reserve validation data.
degrees = np.arange(1, 16)  # Test a range from linear to very wiggly polynomial models.
train_rmse = []  # Store training errors for each degree.
val_rmse = []  # Store validation errors for each degree.
models_by_degree = {}  # Store fitted models so selected fits can be plotted later.

for degree in degrees:  # Sweep model complexity one degree at a time.
    model = Pipeline([("poly", PolynomialFeatures(degree=degree, include_bias=False)), ("ridge", Ridge(alpha=1e-6))])  # Build polynomial regression with tiny ridge stabilization.
    model.fit(X_train, y_train)  # Fit coefficients using only the training split.
    y_train_pred = model.predict(X_train)  # Predict on training data to measure fit to seen examples.
    y_val_pred = model.predict(X_val)  # Predict on validation data to estimate generalization.
    train_rmse.append(rmse(y_train, y_train_pred))  # Record training RMSE for this degree.
    val_rmse.append(rmse(y_val, y_val_pred))  # Record validation RMSE for this degree.
    models_by_degree[degree] = model  # Save the fitted model for later visualization.

best_degree = int(degrees[np.argmin(val_rmse)])  # Select the degree with the lowest validation RMSE.
print(pd.DataFrame({"degree": degrees, "train_rmse": train_rmse, "val_rmse": val_rmse}).round(3))  # Display the model-selection table.
print(f"Selected degree by validation RMSE: {best_degree}")  # Report the validation-selected model complexity.

plt.figure()  # Create a figure for the validation curve.
plt.plot(degrees, train_rmse, marker="o", label="train RMSE")  # Plot training error across degrees.
plt.plot(degrees, val_rmse, marker="o", label="validation RMSE")  # Plot validation error across degrees.
plt.axvline(best_degree, linestyle="--", color="black", label=f"selected degree = {best_degree}")  # Mark the selected degree.
plt.xlabel("polynomial degree")  # Label the model-complexity axis.
plt.ylabel("RMSE")  # Label the error axis.
plt.title("Validation curve for polynomial degree")  # Title the diagnostic plot.
plt.legend()  # Show labels for the two curves and selected degree.
plt.show()  # Display the validation curve.

x_grid = np.linspace(X[:, 0].min(), X[:, 0].max(), 300)  # Build a dense grid for smooth model curves.
fig, axes = plt.subplots(1, 3, figsize=(15, 4))  # Create three panels for underfit, good fit, and overfit examples.
for ax, degree in zip(axes, [1, 2, 12]):  # Compare three representative complexities.
    plot_regression_fit(ax, models_by_degree[degree], x_grid, X_train[:, 0], y_train, f"degree {degree}")  # Draw the fitted curve.
plt.tight_layout()  # Reduce overlap among subplots.
plt.show()  # Display the fitted curves.
```

▶ What you'll see: degree 1 underfits the curved trend, degree 2 usually matches the true shape, and degree 12 can chase noise even when training error keeps falling.

👀 Look for the U-shaped validation curve. The selected degree is not the one with the smallest training error; it is the one with the best held-out error.

#### E4. Ridge vs LASSO coefficient shrinkage

**Problem.** Build correlated features, sweep regularization strength $\lambda$, and compare how Ridge and LASSO shrink coefficients and validation error.

```python
n_samples = 220  # Choose a small dataset where regularization visibly matters.
base = rng.normal(size=n_samples)  # Create a shared latent signal that makes features correlated.
X_reg = np.column_stack([base + 0.05 * rng.normal(size=n_samples), base + 0.05 * rng.normal(size=n_samples), rng.normal(size=n_samples), rng.normal(size=n_samples)])  # Build two correlated useful features and two mostly noisy features.
true_coef = np.array([2.5, 2.5, 0.0, 0.0])  # Define sparse ground-truth coefficients for interpretability.
y_reg = X_reg @ true_coef + rng.normal(scale=1.0, size=n_samples)  # Generate a noisy linear target.
X_train, X_val, y_train, y_val = train_test_split(X_reg, y_reg, test_size=0.30, random_state=RANDOM_SEED)  # Split data for validation.
alphas = np.logspace(-3, 1.5, 35)  # Sweep lambda values from weak to strong regularization.
ridge_coefs = []  # Store Ridge coefficients for each lambda.
lasso_coefs = []  # Store LASSO coefficients for each lambda.
ridge_val = []  # Store Ridge validation RMSE values.
lasso_val = []  # Store LASSO validation RMSE values.

for alpha in alphas:  # Evaluate each regularization strength.
    ridge_model = Pipeline([("scale", StandardScaler()), ("model", Ridge(alpha=alpha))])  # Scale features before applying Ridge.
    lasso_model = Pipeline([("scale", StandardScaler()), ("model", Lasso(alpha=alpha, max_iter=20000))])  # Scale features before applying LASSO.
    ridge_model.fit(X_train, y_train)  # Fit Ridge on training data only.
    lasso_model.fit(X_train, y_train)  # Fit LASSO on training data only.
    ridge_coefs.append(ridge_model.named_steps["model"].coef_)  # Save Ridge coefficients after scaling.
    lasso_coefs.append(lasso_model.named_steps["model"].coef_)  # Save LASSO coefficients after scaling.
    ridge_val.append(rmse(y_val, ridge_model.predict(X_val)))  # Measure Ridge validation RMSE.
    lasso_val.append(rmse(y_val, lasso_model.predict(X_val)))  # Measure LASSO validation RMSE.

ridge_coefs = np.array(ridge_coefs)  # Convert Ridge coefficient history to an array for plotting.
lasso_coefs = np.array(lasso_coefs)  # Convert LASSO coefficient history to an array for plotting.
best_ridge_alpha = alphas[int(np.argmin(ridge_val))]  # Select the Ridge lambda with lowest validation error.
best_lasso_alpha = alphas[int(np.argmin(lasso_val))]  # Select the LASSO lambda with lowest validation error.
print(f"Best Ridge alpha: {best_ridge_alpha:.4f}")  # Print the selected Ridge strength.
print(f"Best LASSO alpha: {best_lasso_alpha:.4f}")  # Print the selected LASSO strength.

fig, axes = plt.subplots(1, 3, figsize=(16, 4))  # Create panels for coefficient paths and validation error.
for j in range(X_reg.shape[1]):  # Plot each Ridge coefficient path.
    axes[0].plot(alphas, ridge_coefs[:, j], label=f"feature {j}")  # Draw Ridge shrinkage for one coefficient.
axes[0].set_xscale("log")  # Use a log scale because alphas span orders of magnitude.
axes[0].set_title("Ridge coefficient paths")  # Title the Ridge coefficient panel.
axes[0].set_xlabel("lambda / alpha")  # Label the regularization axis.
axes[0].set_ylabel("coefficient")  # Label the coefficient axis.
axes[0].legend()  # Show feature labels.
for j in range(X_reg.shape[1]):  # Plot each LASSO coefficient path.
    axes[1].plot(alphas, lasso_coefs[:, j], label=f"feature {j}")  # Draw LASSO shrinkage for one coefficient.
axes[1].set_xscale("log")  # Use a log scale for the LASSO strengths.
axes[1].set_title("LASSO coefficient paths")  # Title the LASSO coefficient panel.
axes[1].set_xlabel("lambda / alpha")  # Label the regularization axis.
axes[1].set_ylabel("coefficient")  # Label the coefficient axis.
axes[2].plot(alphas, ridge_val, marker="o", label="Ridge validation RMSE")  # Plot Ridge validation performance.
axes[2].plot(alphas, lasso_val, marker="o", label="LASSO validation RMSE")  # Plot LASSO validation performance.
axes[2].set_xscale("log")  # Use a log scale for the alpha axis.
axes[2].set_title("Validation error vs regularization")  # Title the model-selection panel.
axes[2].set_xlabel("lambda / alpha")  # Label the regularization axis.
axes[2].set_ylabel("validation RMSE")  # Label the error axis.
axes[2].legend()  # Show model labels.
plt.tight_layout()  # Improve spacing among panels.
plt.show()  # Display all regularization plots.
```

▶ What you'll see: Ridge smoothly shrinks correlated coefficients, while LASSO can drive some coefficients exactly to zero. Very small $\lambda$ may overfit; very large $\lambda$ may underfit.

👀 Look for the validation minimum. The penalty strength is selected by held-out performance, not by the prettiest coefficient path.

#### E5. Learning curve diagnosis

**Problem.** Fit a moderately flexible polynomial model with increasing training-set sizes and plot the learning curve.

```python
X, y = load_swappable_data("noisy_quadratic")  # Load the noisy regression problem.
X_train_full, X_val, y_train_full, y_val = train_test_split(X, y, test_size=0.30, random_state=RANDOM_SEED)  # Hold validation data fixed.
train_sizes = np.linspace(10, X_train_full.shape[0], 10, dtype=int)  # Choose increasing training-set sizes.
lc_train_rmse = []  # Store training RMSE at each sample size.
lc_val_rmse = []  # Store validation RMSE at each sample size.

for size in train_sizes:  # Grow the amount of training data step by step.
    X_small = X_train_full[:size]  # Take the first size examples from the training pool.
    y_small = y_train_full[:size]  # Take the matching targets.
    model = Pipeline([("poly", PolynomialFeatures(degree=8, include_bias=False)), ("ridge", Ridge(alpha=0.05))])  # Use a flexible polynomial with mild regularization.
    model.fit(X_small, y_small)  # Fit on only the current subset.
    lc_train_rmse.append(rmse(y_small, model.predict(X_small)))  # Measure how well the model fits seen examples.
    lc_val_rmse.append(rmse(y_val, model.predict(X_val)))  # Measure generalization to the fixed validation set.

plt.figure()  # Create the learning-curve figure.
plt.plot(train_sizes, lc_train_rmse, marker="o", label="train RMSE")  # Plot training error as data grows.
plt.plot(train_sizes, lc_val_rmse, marker="o", label="validation RMSE")  # Plot validation error as data grows.
plt.xlabel("number of training examples")  # Label the sample-size axis.
plt.ylabel("RMSE")  # Label the error axis.
plt.title("Learning curve: does more data help?")  # Title the diagnostic plot.
plt.legend()  # Show train and validation labels.
plt.show()  # Display the learning curve.

final_gap = lc_val_rmse[-1] - lc_train_rmse[-1]  # Compute the final train-validation gap.
print(f"Final train RMSE: {lc_train_rmse[-1]:.3f}")  # Report final training error.
print(f"Final validation RMSE: {lc_val_rmse[-1]:.3f}")  # Report final validation error.
print(f"Final validation gap: {final_gap:.3f}")  # Report the generalization gap.
```

▶ What you'll see: with very little data, training error is often unrealistically low and validation error is high. As data grows, the curves usually move closer.

👀 If the validation curve is still dropping at the right edge, more data is likely useful. If both curves plateau high and close, model bias is the bigger problem.

### 🔴 Advanced

#### A1. Bias vs variance: choose the right remedy

**Problem.** Compare an underfit logistic classifier, a well-tuned RBF SVM, and an overfit decision tree on a nonlinear moons dataset. Use train/test gaps and decision boundaries to diagnose bias and variance.

```python
X_moon, y_moon = load_swappable_data("moons")  # Load the nonlinear two-moons classification dataset.
X_train, X_test, y_train, y_test = train_test_split(X_moon, y_moon, test_size=0.35, random_state=RANDOM_SEED, stratify=y_moon)  # Split while preserving class balance.
classifiers = {  # Define three models with different complexity profiles.
    "underfit logistic": Pipeline([("scale", StandardScaler()), ("model", LogisticRegression())]),  # Use a linear boundary that cannot bend around moons.
    "good RBF SVM": Pipeline([("scale", StandardScaler()), ("model", SVC(kernel="rbf", C=3.0, gamma=1.0))]),  # Use a smooth nonlinear boundary.
    "overfit tree": DecisionTreeClassifier(max_depth=None, min_samples_leaf=1, random_state=RANDOM_SEED),  # Use an unconstrained tree that can chase noise.
}
rows = []  # Store diagnostic metrics for a table.
fig, axes = plt.subplots(1, 3, figsize=(16, 4))  # Create one boundary panel per classifier.

for ax, (name, clf) in zip(axes, classifiers.items()):  # Fit and plot each candidate model.
    clf.fit(X_train, y_train)  # Train the model on the training split only.
    train_acc = accuracy_score(y_train, clf.predict(X_train))  # Compute training accuracy.
    test_acc = accuracy_score(y_test, clf.predict(X_test))  # Compute held-out test accuracy for diagnostic demonstration.
    rows.append({"model": name, "train_error": 1 - train_acc, "test_error": 1 - test_acc, "gap": test_acc - train_acc})  # Record errors and signed accuracy gap.
    plot_decision_boundary(ax, clf, X_moon, y_moon, f"{name}\ntrain acc={train_acc:.2f}, test acc={test_acc:.2f}")  # Visualize the boundary on all points.

plt.tight_layout()  # Improve subplot spacing.
plt.show()  # Display the decision boundaries.
summary = pd.DataFrame(rows)  # Convert diagnostic rows to a table.
summary["abs_error_gap"] = (summary["test_error"] - summary["train_error"]).abs()  # Compute absolute error gap for easier reading.
print(summary.round(3))  # Display train/test errors and gaps.
```

▶ What you'll see: logistic regression is too simple for the curved moons, the RBF SVM gives a smooth boundary, and the full tree can create jagged regions around individual points.

👀 Remedy map: underfit logistic needs more complexity; overfit tree needs pruning, regularization, or more data.

#### A2. Data leakage failure in cross-validation

**Problem.** Demonstrate an overfitting failure case: preprocessing outside cross-validation can leak validation-fold information. Compare an honest pipeline with a leaky procedure for missing-value imputation and feature selection.

```python
X_cancer, y_cancer = load_swappable_data("breast_cancer")  # Load a real binary classification dataset.
X_cancer = X_cancer.copy()  # Copy features so missing-value injection does not mutate library data.
missing_mask = rng.random(X_cancer.shape) < 0.08  # Randomly mark 8 percent of entries as missing.
X_cancer[missing_mask] = np.nan  # Insert missing values to make imputation part of the pipeline.
cv = StratifiedKFold(n_splits=5, shuffle=True, random_state=RANDOM_SEED)  # Create reproducible class-balanced folds.

honest_pipeline = Pipeline([("impute", SimpleImputer(strategy="mean")), ("scale", StandardScaler()), ("model", LogisticRegression(max_iter=5000))])  # Put every learned preprocessing step inside CV.
honest_scores = cross_val_score(honest_pipeline, X_cancer, y_cancer, cv=cv, scoring="accuracy")  # Evaluate the honest pipeline fold by fold.

leaky_imputer = SimpleImputer(strategy="mean")  # Create an imputer that will incorrectly see all rows.
X_leaky = leaky_imputer.fit_transform(X_cancer)  # Fit imputation on the full dataset before CV, which leaks fold statistics.
leaky_scaler = StandardScaler()  # Create a scaler that will incorrectly see all rows.
X_leaky = leaky_scaler.fit_transform(X_leaky)  # Fit scaling on the full dataset before CV, which leaks validation-fold statistics.
leaky_model = LogisticRegression(max_iter=5000)  # Define the classifier used after leaky preprocessing.
leaky_scores = cross_val_score(leaky_model, X_leaky, y_cancer, cv=cv, scoring="accuracy")  # Cross-validate only the model after leakage occurred.

leakage_table = pd.DataFrame({"fold": np.arange(1, 6), "honest_pipeline": honest_scores, "leaky_preprocessing": leaky_scores})  # Build a fold-by-fold comparison table.
print(leakage_table.round(4))  # Print the scores for each fold.
print(leakage_table.mean(numeric_only=True).round(4))  # Print the average score for each procedure.

plt.figure()  # Create the leakage comparison figure.
plt.bar([0, 1], [honest_scores.mean(), leaky_scores.mean()], yerr=[honest_scores.std(), leaky_scores.std()], capsize=8)  # Plot average CV accuracy with fold variability.
plt.xticks([0, 1], ["honest\nPipeline", "leaky\npreprocess first"])  # Label the two bars.
plt.ylabel("5-fold CV accuracy")  # Label the score axis.
plt.title("Leakage can make validation look too optimistic")  # Title the diagnostic plot.
plt.ylim(0.85, 1.00)  # Zoom in so small optimism is visible.
plt.show()  # Display the leakage bar chart.
```

▶ What you'll see: the leaky version can look slightly better because validation folds influenced preprocessing statistics. Even small leakage matters because it compounds across many model choices.

👀 Rule: any operation that learns from data—imputation, scaling, PCA, feature selection—belongs inside the cross-validation pipeline.

#### A3. Nested CV for hyperparameter selection

**Problem.** Estimate performance when hyperparameters are selected by inner cross-validation. Use outer folds for honest assessment and inner folds for choosing the SVM regularization strength $C$.

```python
X_bc, y_bc = load_swappable_data("breast_cancer")  # Load the breast cancer classification data.
outer_cv = StratifiedKFold(n_splits=5, shuffle=True, random_state=RANDOM_SEED)  # Create outer folds for unbiased assessment.
inner_cv = StratifiedKFold(n_splits=4, shuffle=True, random_state=RANDOM_SEED + 1)  # Create inner folds for model selection.
C_grid = np.logspace(-2, 2, 7)  # Define candidate SVM regularization strengths.
outer_scores = []  # Store each outer-fold test score.
chosen_C_values = []  # Store the hyperparameter selected inside each outer fold.

for outer_fold, (train_idx, test_idx) in enumerate(outer_cv.split(X_bc, y_bc), start=1):  # Loop over outer folds.
    X_outer_train = X_bc[train_idx]  # Select the outer training features.
    y_outer_train = y_bc[train_idx]  # Select the outer training labels.
    X_outer_test = X_bc[test_idx]  # Select the untouched outer test features.
    y_outer_test = y_bc[test_idx]  # Select the untouched outer test labels.
    mean_inner_scores = []  # Store average inner-CV scores for each C.
    for C in C_grid:  # Evaluate each candidate hyperparameter only inside the outer training data.
        candidate = Pipeline([("scale", StandardScaler()), ("model", SVC(kernel="linear", C=C))])  # Build a scaled linear SVM pipeline.
        scores = cross_val_score(candidate, X_outer_train, y_outer_train, cv=inner_cv, scoring="accuracy")  # Score this C using inner CV.
        mean_inner_scores.append(scores.mean())  # Record the mean inner score.
    best_C = C_grid[int(np.argmax(mean_inner_scores))]  # Select the C with best inner-CV accuracy.
    chosen_C_values.append(best_C)  # Save the selected C for diagnostics.
    final_model = Pipeline([("scale", StandardScaler()), ("model", SVC(kernel="linear", C=best_C))])  # Rebuild the pipeline with the selected C.
    final_model.fit(X_outer_train, y_outer_train)  # Fit on the full outer training fold.
    outer_score = accuracy_score(y_outer_test, final_model.predict(X_outer_test))  # Evaluate once on the outer test fold.
    outer_scores.append(outer_score)  # Store the honest outer-fold score.
    print(f"Outer fold {outer_fold}: selected C={best_C:.3f}, outer accuracy={outer_score:.3f}")  # Report fold-level selection and assessment.

nested_results = pd.DataFrame({"outer_fold": np.arange(1, 6), "chosen_C": chosen_C_values, "outer_accuracy": outer_scores})  # Build a compact results table.
print(nested_results.round(4))  # Print the nested-CV table.
print(f"Nested CV accuracy: {np.mean(outer_scores):.3f} ± {np.std(outer_scores):.3f}")  # Summarize the outer-fold distribution.

plt.figure()  # Create a figure for outer-fold scores.
plt.plot(nested_results["outer_fold"], nested_results["outer_accuracy"], marker="o")  # Plot honest performance per outer fold.
plt.xlabel("outer fold")  # Label the outer-fold axis.
plt.ylabel("accuracy")  # Label the score axis.
plt.title("Nested CV: outer folds estimate selected-pipeline performance")  # Title the nested-CV plot.
plt.ylim(0.85, 1.01)  # Use a stable accuracy range for visual comparison.
plt.show()  # Display the outer-fold score plot.
```

▶ What you'll see: each outer fold may choose a different $C$. The reported performance is the distribution of outer-fold scores, not the best inner-CV score.

👀 Nested CV answers: “How well does my *selection procedure* generalize?” rather than “How good was the best hyperparameter on the data I reused?”

#### A4. Error analysis on misclassified examples

**Problem.** Train a digit classifier, inspect the confusion matrix, and display representative misclassified images for the most common confusion.

```python
X_digits, y_digits = load_swappable_data("digits")  # Load 8-by-8 digit images flattened into 64 features.
X_train, X_test, y_train, y_test = train_test_split(X_digits, y_digits, test_size=0.30, random_state=RANDOM_SEED, stratify=y_digits)  # Create a stratified hold-out split.
digit_model = Pipeline([("scale", StandardScaler()), ("model", LogisticRegression(max_iter=5000, multi_class="auto"))])  # Build a scaled multiclass logistic classifier.
digit_model.fit(X_train, y_train)  # Fit the classifier on training images.
y_pred = digit_model.predict(X_test)  # Predict labels for held-out images.
cm = confusion_matrix(y_test, y_pred)  # Count true-vs-predicted label pairs.
accuracy = accuracy_score(y_test, y_pred)  # Compute overall held-out accuracy.
print(f"Held-out digit accuracy: {accuracy:.3f}")  # Report the aggregate metric.

plt.figure(figsize=(7, 6))  # Create a square-ish confusion matrix figure.
plt.imshow(cm, cmap="Blues")  # Display the confusion matrix as an intensity image.
plt.title("Confusion matrix for digit classifier")  # Title the diagnostic plot.
plt.xlabel("predicted label")  # Label the prediction axis.
plt.ylabel("true label")  # Label the truth axis.
plt.colorbar(label="count")  # Add a colorbar to interpret counts.
for i in range(cm.shape[0]):  # Loop over true labels for annotations.
    for j in range(cm.shape[1]):  # Loop over predicted labels for annotations.
        plt.text(j, i, cm[i, j], ha="center", va="center", color="black")  # Write each count inside its cell.
plt.show()  # Display the confusion matrix.

cm_without_diagonal = cm.copy()  # Copy the matrix so the diagonal can be removed.
np.fill_diagonal(cm_without_diagonal, 0)  # Ignore correct classifications when finding the largest error category.
true_label, predicted_label = np.unravel_index(np.argmax(cm_without_diagonal), cm_without_diagonal.shape)  # Find the most common off-diagonal confusion.
print(f"Most common confusion: true {true_label} predicted {predicted_label}")  # Report the dominant error category.

misclassified_mask = (y_test == true_label) & (y_pred == predicted_label)  # Locate examples in that error category.
misclassified_images = X_test[misclassified_mask][:8]  # Take up to eight representative misclassified images.
fig, axes = plt.subplots(1, max(1, len(misclassified_images)), figsize=(12, 2))  # Create one row of image panels.
axes = np.atleast_1d(axes)  # Ensure axes is iterable even if there is only one image.
for ax, image in zip(axes, misclassified_images):  # Loop through representative errors.
    ax.imshow(image.reshape(8, 8), cmap="gray_r")  # Reshape the flat vector back into an 8-by-8 image.
    ax.axis("off")  # Hide axes so the digit shape is the focus.
    ax.set_title(f"{true_label}→{predicted_label}")  # Label the true-to-predicted error.
plt.suptitle("Representative misclassified examples")  # Add a figure-level title.
plt.show()  # Display the error examples.

error_counts = pd.Series(y_test[y_test != y_pred]).value_counts().sort_index()  # Count errors by true digit label.
print(error_counts.rename("number_of_errors_by_true_label"))  # Print which true labels contribute most errors.
```

▶ What you'll see: the confusion matrix reveals whether errors are random or concentrated in particular digit pairs.

👀 Error analysis turns “accuracy is imperfect” into concrete next actions: collect more examples of confused classes, add features, augment images, or change the model.

#### A5. Ablative analysis of a feature pipeline

**Problem.** Measure how feature groups contribute to a regression pipeline by removing groups and comparing validation/test RMSE.

```python
diabetes = load_diabetes()  # Load a built-in regression dataset for a network-free ablation study.
X_house = diabetes.data  # Use standardized clinical measurements as the feature matrix.
y_house = diabetes.target  # Use disease progression as the regression target.
feature_names = np.array(diabetes.feature_names)  # Store feature names for group definitions.
feature_groups = {  # Define interpretable feature groups for ablation.
    "all_features": np.arange(X_house.shape[1]),  # Use every available feature as the current model.
    "no_bmi": np.array([i for i, name in enumerate(feature_names) if name != "bmi"]),  # Remove body-mass index, a strong single predictor.
    "only_blood": np.array([i for i, name in enumerate(feature_names) if name.startswith("s")]),  # Keep only serum-measurement features.
    "no_blood": np.array([i for i, name in enumerate(feature_names) if not name.startswith("s")]),  # Remove serum-measurement features.
}
X_train, X_temp, y_train, y_temp = train_test_split(X_house, y_house, test_size=0.40, random_state=RANDOM_SEED)  # Split off validation plus test data.
X_val, X_test, y_val, y_test = train_test_split(X_temp, y_temp, test_size=0.50, random_state=RANDOM_SEED)  # Split validation and test equally.
ablation_rows = []  # Store validation and test performance for each feature group.

for group_name, columns in feature_groups.items():  # Evaluate each ablated feature set.
    model = Pipeline([("scale", StandardScaler()), ("ridge", Ridge(alpha=10.0))])  # Use one fixed model so feature changes are isolated.
    model.fit(X_train[:, columns], y_train)  # Train on the selected feature columns only.
    val_error = rmse(y_val, model.predict(X_val[:, columns]))  # Measure validation RMSE for selection-oriented comparison.
    test_error = rmse(y_test, model.predict(X_test[:, columns]))  # Measure test RMSE as a final audit for this demonstration.
    ablation_rows.append({"feature_set": group_name, "num_features": len(columns), "validation_RMSE": val_error, "test_RMSE": test_error})  # Save the ablation result.

ablation_table = pd.DataFrame(ablation_rows).sort_values("validation_RMSE")  # Sort by validation performance.
print(ablation_table.round(3))  # Display the ablation table.

plt.figure()  # Create the ablation bar chart.
plt.bar(ablation_table["feature_set"], ablation_table["validation_RMSE"])  # Plot validation RMSE by feature set.
plt.ylabel("validation RMSE")  # Label the error axis.
plt.title("Ablative analysis: which feature groups matter?")  # Title the diagnostic plot.
plt.xticks(rotation=25, ha="right")  # Rotate labels so they remain readable.
plt.show()  # Display the ablation chart.
```

▶ What you'll see: removing important feature groups worsens validation RMSE, while redundant groups may have little effect.

👀 Ablation asks: “What part of my current system explains the gain over a baseline?” It is different from error analysis, which asks: “What errors remain?”

##### Implementation detail inside A3: k-fold CV implementation from scratch

**Problem.** Implement $k$-fold cross-validation manually for polynomial Ridge regression and verify the result against scikit-learn's `cross_val_score`.

```python
X, y = load_swappable_data("noisy_quadratic")  # Load the regression dataset.
manual_model = Pipeline([("poly", PolynomialFeatures(degree=4, include_bias=False)), ("ridge", Ridge(alpha=0.1))])  # Define the model to cross-validate.
kfold = KFold(n_splits=5, shuffle=True, random_state=RANDOM_SEED)  # Create reproducible fold indices.
manual_fold_rmse = []  # Store validation RMSE for each manually evaluated fold.

for fold_number, (train_idx, val_idx) in enumerate(kfold.split(X), start=1):  # Loop over each fold's train and validation indices.
    fold_model = clone(manual_model)  # Clone a fresh unfitted model to avoid carrying information across folds.
    fold_model.fit(X[train_idx], y[train_idx])  # Fit only on this fold's training indices.
    fold_pred = fold_model.predict(X[val_idx])  # Predict on this fold's held-out validation indices.
    fold_error = rmse(y[val_idx], fold_pred)  # Compute RMSE for this fold.
    manual_fold_rmse.append(fold_error)  # Save the fold error for averaging.
    print(f"Fold {fold_number}: RMSE={fold_error:.3f}, train_size={len(train_idx)}, val_size={len(val_idx)}")  # Print fold details.

manual_cv_rmse = float(np.mean(manual_fold_rmse))  # Average fold errors to get the manual CV estimate.
sklearn_negative_mse = cross_val_score(manual_model, X, y, cv=kfold, scoring="neg_mean_squared_error")  # Ask scikit-learn for fold negative MSE scores.
sklearn_rmse = np.sqrt(-sklearn_negative_mse)  # Convert negative MSE scores into RMSE values.
print(f"Manual 5-fold CV RMSE: {manual_cv_rmse:.3f}")  # Print the manual CV estimate.
print(f"sklearn 5-fold CV RMSE: {sklearn_rmse.mean():.3f}")  # Print the library CV estimate.

plt.figure()  # Create a fold-error plot.
plt.plot(np.arange(1, 6), manual_fold_rmse, marker="o", label="manual fold RMSE")  # Plot manual fold errors.
plt.axhline(manual_cv_rmse, linestyle="--", color="black", label="manual average")  # Mark the average CV error.
plt.xlabel("fold")  # Label the fold axis.
plt.ylabel("RMSE")  # Label the error axis.
plt.title("Manual k-fold cross-validation")  # Title the plot.
plt.legend()  # Show fold and average labels.
plt.show()  # Display the manual CV diagnostic.
```

▶ What you'll see: every example is validation data exactly once, and the average of fold errors matches the scikit-learn calculation up to scoring conventions.

👀 The key implementation detail is cloning a fresh model inside each fold. Reusing a fitted model would leak information across folds.

##### Diagnostic extension inside A5: regularization-strength sweep as a validation curve

**Problem.** For a high-degree polynomial model, sweep Ridge strength $\lambda$ and identify under-regularization, a good region, and over-regularization.

```python
X, y = load_swappable_data("noisy_quadratic")  # Load the noisy regression dataset.
X_train, X_val, y_train, y_val = train_test_split(X, y, test_size=0.30, random_state=RANDOM_SEED)  # Create a hold-out validation split.
lambdas = np.logspace(-6, 3, 40)  # Sweep Ridge strengths from almost none to very strong.
reg_train_rmse = []  # Store training error for each lambda.
reg_val_rmse = []  # Store validation error for each lambda.

for lam in lambdas:  # Evaluate each regularization strength.
    model = Pipeline([("poly", PolynomialFeatures(degree=14, include_bias=False)), ("ridge", Ridge(alpha=lam))])  # Use high complexity so lambda has a visible effect.
    model.fit(X_train, y_train)  # Fit the regularized model on training data only.
    reg_train_rmse.append(rmse(y_train, model.predict(X_train)))  # Measure training error.
    reg_val_rmse.append(rmse(y_val, model.predict(X_val)))  # Measure validation error.

best_lambda = lambdas[int(np.argmin(reg_val_rmse))]  # Select the lambda with lowest validation RMSE.
print(f"Best lambda by validation RMSE: {best_lambda:.6f}")  # Report the selected regularization strength.

plt.figure()  # Create the regularization validation curve.
plt.plot(lambdas, reg_train_rmse, marker="o", label="train RMSE")  # Plot train error versus lambda.
plt.plot(lambdas, reg_val_rmse, marker="o", label="validation RMSE")  # Plot validation error versus lambda.
plt.axvline(best_lambda, linestyle="--", color="black", label="selected lambda")  # Mark the chosen lambda.
plt.xscale("log")  # Use a log axis because lambda spans many orders of magnitude.
plt.xlabel("Ridge lambda / alpha")  # Label the regularization axis.
plt.ylabel("RMSE")  # Label the error axis.
plt.title("Validation curve for regularization strength")  # Title the diagnostic plot.
plt.legend()  # Show curve labels.
plt.show()  # Display the validation curve.
```

▶ What you'll see: extremely small $\lambda$ allows the high-degree model to overfit; extremely large $\lambda$ makes the model too rigid; the validation minimum sits between them.

👀 Regularization is not simply “more is better.” It is a bias-variance dial chosen with validation data.

### Interactive Experiment

Move the sliders to see how model complexity and regularization jointly control train and validation error.

```python
try:  # Try to import notebook widgets when the environment supports them.
    from ipywidgets import interact, IntSlider, FloatLogSlider  # Import interactive sliders for degree and lambda.
except Exception as exc:  # Catch environments without widget support.
    interact = None  # Mark widgets as unavailable so the fallback can run.
    print(f"ipywidgets unavailable: {exc}")  # Explain why the interactive display is skipped.

X_interactive, y_interactive = load_swappable_data("noisy_quadratic")  # Load the shared regression dataset for the experiment.
X_i_train, X_i_val, y_i_train, y_i_val = train_test_split(X_interactive, y_interactive, test_size=0.30, random_state=RANDOM_SEED)  # Fix one validation split.
x_i_grid = np.linspace(X_interactive[:, 0].min(), X_interactive[:, 0].max(), 300).reshape(-1, 1)  # Build a dense grid for fitted curves.


def complexity_regularization_experiment(degree=4, ridge_lambda=0.1):  # Define the live experiment function.
    model = Pipeline([("poly", PolynomialFeatures(degree=degree, include_bias=False)), ("ridge", Ridge(alpha=ridge_lambda))])  # Build the selected model.
    model.fit(X_i_train, y_i_train)  # Fit the model on the fixed training split.
    train_error = rmse(y_i_train, model.predict(X_i_train))  # Compute training RMSE.
    val_error = rmse(y_i_val, model.predict(X_i_val))  # Compute validation RMSE.
    plt.figure(figsize=(8, 4))  # Create a fresh plot for this slider state.
    plt.scatter(X_i_train[:, 0], y_i_train, s=24, alpha=0.65, label="train")  # Plot training points.
    plt.scatter(X_i_val[:, 0], y_i_val, s=32, alpha=0.85, marker="x", label="validation")  # Plot validation points.
    plt.plot(x_i_grid[:, 0], model.predict(x_i_grid), color="black", linewidth=2.5, label="fitted curve")  # Plot the current model fit.
    plt.title(f"degree={degree}, lambda={ridge_lambda:.4f}, train RMSE={train_error:.2f}, val RMSE={val_error:.2f}")  # Summarize the diagnostic state.
    plt.xlabel("x")  # Label the input axis.
    plt.ylabel("y")  # Label the target axis.
    plt.legend()  # Show point and curve labels.
    plt.show()  # Display the interactive plot.

if interact is not None:  # Use interactive widgets when available.
    interact(complexity_regularization_experiment, degree=IntSlider(value=4, min=1, max=15, step=1), ridge_lambda=FloatLogSlider(value=0.1, base=10, min=-6, max=3, step=0.25))  # Create sliders for model complexity and regularization.
else:  # Use a deterministic fallback when widgets are not available.
    complexity_regularization_experiment(degree=4, ridge_lambda=0.1)  # Show one representative experiment state.
```

▶ What you'll see: high degree with tiny $\lambda$ wiggles; low degree or huge $\lambda$ underfits; a middle setting tracks the trend without chasing every noisy point.

👀 Try increasing degree first, then increasing $\lambda$. Complexity gives the model capacity; regularization decides how much of that capacity it is allowed to use.
