# Model Selection & Diagnostics
> **Source:** CS 229 · **Category:** Concept/Tips · **Type:** ⚖️ Both · [↑ Full reference](../../ai-ml-cheatsheets.md)
> 📓 The coded examples form a runnable notebook section; an .ipynb will be generated.

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
