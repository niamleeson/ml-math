# Linear Models: Regression, Logistic Regression, and GLMs
> **Source:** CS 229 · **Category:** Model · **Type:** ⚖️ Both · [↑ Full reference](../../ai-ml-cheatsheets.md)
> 📓 The coded examples form a runnable notebook section; an .ipynb will be generated.

## 1. Overview

Linear models turn features into one weighted score, $\theta^Tx$. That score can be a real-valued prediction, a log-odds that becomes a probability, a multiclass score in softmax regression, or the natural parameter of a generalized linear model.

**One-line intuition:** learn a hyperplane first; then choose whether its output should mean a number, a probability, a class score, or a distribution parameter.

Linear models are fast, interpretable, and mathematically transparent. They are also the gateway to loss functions, likelihoods, gradient descent, decision boundaries, residual diagnostics, and the generalized linear model view used throughout machine learning and statistics.

## 2. Key Idea

### Linear hypothesis

Add an intercept coordinate $x_0=1$:

$$
x=\begin{bmatrix}1\\x_1\\\vdots\\x_n\end{bmatrix},
\qquad
\theta=\begin{bmatrix}\theta_0\\\theta_1\\\vdots\\\theta_n\end{bmatrix}.
$$

The linear hypothesis is

$$
\boxed{h_\theta(x)=\theta^Tx=\sum_{j=0}^{n}\theta_jx_j}.
$$

Geometrically, $\theta^Tx=c$ is a hyperplane. In regression, the score is the prediction. In binary classification, the score is a logit. In GLMs, the score is the natural parameter $\eta$.

### Least squares and the normal equations

For $m$ training examples, ordinary least squares minimizes

$$
J(\theta)=\frac{1}{2}\sum_{i=1}^{m}\left(h_\theta(x^{(i)})-y^{(i)}\right)^2.
$$

Let $X$ be the design matrix and $y$ the target vector. Then

$$
J(\theta)=\frac{1}{2}(X\theta-y)^T(X\theta-y).
$$

Expand:

$$
\begin{aligned}
J(\theta)
&=\frac{1}{2}\left[(X\theta)^T(X\theta)-2y^TX\theta+y^Ty\right]\\
&=\frac{1}{2}\left[\theta^TX^TX\theta-2\theta^TX^Ty+y^Ty\right].
\end{aligned}
$$

Differentiate:

$$
\nabla_\theta J(\theta)=X^TX\theta-X^Ty.
$$

At the minimum,

$$
\begin{aligned}
X^TX\theta-X^Ty&=0\\
X^TX\theta&=X^Ty.
\end{aligned}
$$

If $X^TX$ is invertible,

$$
\boxed{\theta=(X^TX)^{-1}X^Ty}.
$$

If it is singular or ill-conditioned, use the pseudoinverse $\theta=X^+y$.

### LMS / gradient descent

For one example,

$$
\frac{\partial}{\partial\theta_j}\frac{1}{2}\left(h_\theta(x^{(i)})-y^{(i)}\right)^2
=\left(h_\theta(x^{(i)})-y^{(i)}\right)x_j^{(i)}.
$$

Gradient descent subtracts this derivative. Written with error $y-h_\theta(x)$, the batch LMS update is

$$
\boxed{\forall j,\quad \theta_j\leftarrow\theta_j+\alpha\sum_{i=1}^{m}\left[y^{(i)}-h_\theta\left(x^{(i)}\right)\right]x_j^{(i)}}.
$$

Averaging by $m$ gives the same direction with a rescaled learning rate:

$$
\theta\leftarrow\theta-\alpha\frac{1}{m}X^T(X\theta-y).
$$

### Locally weighted regression

Locally weighted regression fits a query-specific linear model. A training point $x^{(i)}$ receives weight

$$
\boxed{w^{(i)}(x)=\exp\left(-\frac{\left(x^{(i)}-x\right)^2}{2\tau^2}\right)}.
$$

Small $\tau$ makes weights decay quickly; large $\tau$ makes LWR approach global OLS. With $W=\operatorname{diag}(w^{(1)},\ldots,w^{(m)})$,

$$
J_x(\theta)=\frac{1}{2}\sum_{i=1}^m w^{(i)}(x)\left(h_\theta(x^{(i)})-y^{(i)}\right)^2,
$$

and

$$
\boxed{\theta(x)=(X^TWX)^{-1}X^TWy}.
$$

### Logistic regression and sigmoid

The sigmoid is

$$
\boxed{g(z)=\frac{1}{1+e^{-z}}\in(0,1)}.
$$

Logistic regression assumes

$$
y\mid x;\theta\sim\operatorname{Bernoulli}(\phi),
$$

where

$$
\boxed{\phi=p(y=1\mid x;\theta)=g(\theta^Tx)=\frac{1}{1+\exp(-\theta^Tx)}}.
$$

For one example,

$$
p(y\mid x;\theta)=\phi^y(1-\phi)^{1-y}.
$$

The negative log-likelihood is the logistic loss:

$$
\boxed{\ell(\theta)=-\left[y\log\phi+(1-y)\log(1-\phi)\right]}.
$$

The decision boundary is

$$
g(\theta^Tx)=0.5\Longleftrightarrow \theta^Tx=0.
$$

There is no closed-form normal-equation solution for logistic regression, so we optimize numerically.

### Softmax and GLMs

For $K$ classes, softmax regression uses

$$
\boxed{\phi_i=\frac{\exp(\theta_i^Tx)}{\sum_{j=1}^{K}\exp(\theta_j^Tx)}}.
$$

Generalized linear models use exponential-family distributions:

$$
\boxed{p(y;\eta)=b(y)\exp(\eta T(y)-a(\eta))}.
$$

The GLM assumptions are

$$
(1)\quad y\mid x;\theta\sim\operatorname{ExpFamily}(\eta),
$$

$$
(2)\quad h_\theta(x)=\mathbb{E}[y\mid x;\theta],
$$

$$
(3)\quad \eta=\theta^Tx.
$$

OLS is the Gaussian GLM with identity link. Logistic regression is the Bernoulli GLM with logit link. Poisson regression is the count GLM with log link.

## 3. Worked Examples

### Setup

```python
# Import NumPy for vectorized numerical computing.
import numpy as np

# Import Matplotlib for plots and visual diagnostics.
import matplotlib.pyplot as plt

# Import synthetic binary and multiclass datasets from scikit-learn.
from sklearn.datasets import make_classification, make_moons, make_blobs

# Import scikit-learn linear models for comparison fits.
from sklearn.linear_model import LinearRegression, LogisticRegression

# Import train/test splitting for honest classification evaluation.
from sklearn.model_selection import train_test_split

# Import accuracy scoring for classification examples.
from sklearn.metrics import accuracy_score

# Import feature standardization for logistic regression stability.
from sklearn.preprocessing import StandardScaler

# Import pipelines so scaling and modeling happen together.
from sklearn.pipeline import make_pipeline

# Import sys so a missing notebook dependency can be installed with the current interpreter.
import sys

# Try to import ipywidgets for the live experiment.
try:
    # Import the widget function and slider classes when ipywidgets is already installed.
    from ipywidgets import interact, FloatSlider, IntSlider
# Provide a non-interactive fallback when ipywidgets is unavailable.
except ModuleNotFoundError:
    # Define a tiny slider object that stores the default value.
    class _FallbackSlider:
        # Accept the same keyword arguments used by ipywidgets sliders.
        def __init__(self, value, **kwargs):
            # Store the default value so the fallback can call the function once.
            self.value = value
    # Use the fallback slider for float-valued controls.
    FloatSlider = _FallbackSlider
    # Use the fallback slider for integer-valued controls.
    IntSlider = _FallbackSlider
    # Define a fallback interact that runs the function once in non-notebook Python.
    def interact(func, **kwargs):
        # Extract each slider's default value for a normal function call.
        values = {name: widget.value for name, widget in kwargs.items()}
        # Execute the plotting function once with default slider values.
        return func(**values)

# Fix the global random seed for reproducibility.
np.random.seed(229)

# Create a reusable random generator for synthetic noise.
rng = np.random.default_rng(229)

# Set a readable default figure size.
plt.rcParams["figure.figsize"] = (7, 4)

# Turn on light grid lines to make geometry easier to see.
plt.rcParams["axes.grid"] = True

# Define a numerically stable sigmoid helper.
def sigmoid(z):
    # Clip logits so the exponential does not overflow.
    z = np.clip(z, -500, 500)
    # Return the logistic transformation.
    return 1.0 / (1.0 + np.exp(-z))

# Define a helper that adds an intercept column to one-dimensional x-values.
def add_intercept(x):
    # Convert x to a flat array for predictable stacking.
    x = np.asarray(x).reshape(-1)
    # Return a matrix with ones in the first column and x in the second column.
    return np.column_stack([np.ones_like(x), x])

# Define mean squared error for regression summaries.
def mse(y_true, y_pred):
    # Average squared residuals into one scalar error metric.
    return np.mean((y_true - y_pred) ** 2)
```

### Data — swappable sources

```python
# Choose the regression source; valid options are "linear" and "sine".
REGRESSION_SOURCE = "linear"

# Choose the classification source; valid options are "separable", "moons", and "blobs3".
CLASSIFICATION_SOURCE = "separable"

# Define a reusable regression data generator.
def make_regression_data(source="linear", n=80):
    # Create evenly spaced one-dimensional feature values.
    x = np.linspace(-3.0, 3.0, n)
    # Generate linear data when the source is friendly to OLS.
    if source == "linear":
        # Draw Gaussian noise so the line is realistic rather than exact.
        noise = rng.normal(0.0, 0.8, n)
        # Create targets from a known line plus noise.
        y = 1.5 + 2.2 * x + noise
    # Generate nonlinear data when the source should break a global line.
    elif source == "sine":
        # Draw smaller noise so curvature remains visible.
        noise = rng.normal(0.0, 0.25, n)
        # Create targets from a sinusoidal curve plus mild trend.
        y = np.sin(2.0 * x) + 0.25 * x + noise
    # Reject misspelled source names clearly.
    else:
        # Raise a helpful error with valid choices.
        raise ValueError("source must be 'linear' or 'sine'")
    # Return features and targets.
    return x, y

# Define a reusable classification data generator.
def make_classification_data(source="separable", n=180):
    # Generate a linearly separable binary dataset.
    if source == "separable":
        # Make two informative features with a strong margin.
        X, y = make_classification(n_samples=n, n_features=2, n_redundant=0, n_informative=2, n_clusters_per_class=1, class_sep=1.8, random_state=229)
    # Generate nonlinear two moons for the failure case.
    elif source == "moons":
        # Make two interlocking half-circles that a line cannot separate perfectly.
        X, y = make_moons(n_samples=n, noise=0.22, random_state=229)
    # Generate three blobs for softmax regression.
    elif source == "blobs3":
        # Make three compact clusters in two dimensions.
        X, y = make_blobs(n_samples=n, centers=3, cluster_std=1.15, random_state=229)
    # Reject misspelled source names clearly.
    else:
        # Raise a helpful error with valid choices.
        raise ValueError("source must be 'separable', 'moons', or 'blobs3'")
    # Return features and labels.
    return X, y

# Generate the default regression data.
x_preview, y_preview = make_regression_data(REGRESSION_SOURCE)

# Generate the default classification data.
X_preview, y_preview_cls = make_classification_data(CLASSIFICATION_SOURCE)

# Create a preview figure with two panels.
fig, axes = plt.subplots(1, 2, figsize=(12, 4))

# Plot regression points in the first panel.
axes[0].scatter(x_preview, y_preview, color="black", alpha=0.75)

# Label the regression x-axis.
axes[0].set_xlabel("x")

# Label the regression y-axis.
axes[0].set_ylabel("y")

# Title the regression preview with the active source.
axes[0].set_title(f"Regression source: {REGRESSION_SOURCE}")

# Plot classification points in the second panel.
axes[1].scatter(X_preview[:, 0], X_preview[:, 1], c=y_preview_cls, cmap="coolwarm", edgecolor="k")

# Label the first classification feature.
axes[1].set_xlabel("feature 1")

# Label the second classification feature.
axes[1].set_ylabel("feature 2")

# Title the classification preview with the active source.
axes[1].set_title(f"Classification source: {CLASSIFICATION_SOURCE}")

# Prevent subplot labels from overlapping.
plt.tight_layout()

# Display the previews.
plt.show()
```

▶ What you'll see: raw data before fitting. The linear source favors OLS; the moons and sine sources reveal linear-model limitations.

👀 Always inspect geometry before trusting a linear model.

### 🟢 Basics (warm-up)

#### B1. Compute one linear score $\theta^Tx$ with an intercept

**Problem.** Let

$$
x=\begin{bmatrix}1\\2.5\end{bmatrix},\qquad
\theta=\begin{bmatrix}0.7\\1.2\end{bmatrix}.
$$

Compute $h_\theta(x)$.

**Steps.**

$$
\begin{aligned}
h_\theta(x)&=\theta^Tx\\
&=\begin{bmatrix}0.7&1.2\end{bmatrix}\begin{bmatrix}1\\2.5\end{bmatrix}\\
&=0.7\cdot1+1.2\cdot2.5\\
&=0.7+3.0\\
&=3.7.
\end{aligned}
$$

$$
\boxed{h_\theta(x)=3.7}
$$

```python
# Store the feature vector including intercept x_0 = 1.
x_b1 = np.array([1.0, 2.5])

# Store the parameter vector including intercept weight.
theta_b1 = np.array([0.7, 1.2])

# Compute the linear score as a dot product.
score_b1 = theta_b1 @ x_b1

# Print the feature vector.
print("x =", x_b1)

# Print the parameter vector.
print("theta =", theta_b1)

# Print the computed score.
print("theta^T x =", score_b1)
```

#### B2. Convert one score into a sigmoid probability

**Problem.** Convert $z=1.4$ into $g(z)$.

**Steps.**

$$
\begin{aligned}
g(1.4)&=\frac{1}{1+e^{-1.4}}\\
&=\frac{1}{1+0.2465969639}\\
&=0.8021838886.
\end{aligned}
$$

$$
\boxed{g(1.4)\approx0.8022}
$$

```python
# Store one logit value.
z_b2 = 1.4

# Convert the logit to a probability.
p_b2 = sigmoid(z_b2)

# Create a grid of logits for plotting the sigmoid curve.
z_grid_b2 = np.linspace(-6.0, 6.0, 400)

# Evaluate sigmoid on the grid.
p_grid_b2 = sigmoid(z_grid_b2)

# Start a new figure.
plt.figure()

# Plot the full sigmoid curve.
plt.plot(z_grid_b2, p_grid_b2, color="black", label="g(z)")

# Mark the single computed probability.
plt.scatter([z_b2], [p_b2], color="red", s=80, label=f"g({z_b2})={p_b2:.3f}")

# Draw the probability threshold line.
plt.axhline(0.5, color="gray", linestyle="--")

# Label the logit axis.
plt.xlabel("z")

# Label the probability axis.
plt.ylabel("g(z)")

# Title the plot.
plt.title("One sigmoid conversion")

# Show the legend.
plt.legend()

# Display the plot.
plt.show()

# Print the exact computed probability.
print(f"g({z_b2}) = {p_b2:.6f}")
```

▶ What you'll see: $z=1.4$ lands above probability $0.5$.

👀 Positive logits favor class 1; negative logits favor class 0.

#### B3. Compute one LWR weight

**Problem.** Compute $w^{(i)}(x)$ for $x^{(i)}=2.0$, query $x=1.2$, and $\tau=0.5$.

**Steps.**

$$
\begin{aligned}
w^{(i)}(x)&=\exp\left(-\frac{(2.0-1.2)^2}{2(0.5)^2}\right)\\
&=\exp\left(-\frac{0.64}{0.50}\right)\\
&=\exp(-1.28)\\
&\approx0.2780.
\end{aligned}
$$

$$
\boxed{w^{(i)}(1.2)\approx0.2780}
$$

```python
# Store the training point location.
x_train_b3 = 2.0

# Store the query location.
x_query_b3 = 1.2

# Store the bandwidth.
tau_b3 = 0.5

# Compute the squared distance from training point to query.
squared_distance_b3 = (x_train_b3 - x_query_b3) ** 2

# Compute the denominator in the LWR exponent.
denominator_b3 = 2.0 * tau_b3 ** 2

# Compute the final Gaussian-shaped weight.
weight_b3 = np.exp(-squared_distance_b3 / denominator_b3)

# Print the squared distance.
print("squared distance =", squared_distance_b3)

# Print the denominator.
print("2 tau^2 =", denominator_b3)

# Print the LWR weight.
print("weight =", weight_b3)
```

### 🟡 Easy

#### E1. Pen-and-paper: fit a line with the normal equations

**Problem.** Fit $y=\theta_0+\theta_1x$ to $(0,1)$, $(1,3)$, $(2,5)$.

**Step 1: write $X$ and $y$.**

$$
X=\begin{bmatrix}1&0\\1&1\\1&2\end{bmatrix},
\qquad
y=\begin{bmatrix}1\\3\\5\end{bmatrix}.
$$

**Step 2: compute $X^TX$.**

$$
\begin{aligned}
X^TX
&=\begin{bmatrix}1&1&1\\0&1&2\end{bmatrix}
\begin{bmatrix}1&0\\1&1\\1&2\end{bmatrix}\\
&=\begin{bmatrix}3&3\\3&5\end{bmatrix}.
\end{aligned}
$$

**Step 3: compute $X^Ty$.**

$$
\begin{aligned}
X^Ty
&=\begin{bmatrix}1&1&1\\0&1&2\end{bmatrix}
\begin{bmatrix}1\\3\\5\end{bmatrix}\\
&=\begin{bmatrix}9\\13\end{bmatrix}.
\end{aligned}
$$

**Step 4: invert and multiply.**

$$
(X^TX)^{-1}=\frac{1}{3\cdot5-3\cdot3}\begin{bmatrix}5&-3\\-3&3\end{bmatrix}
=\frac{1}{6}\begin{bmatrix}5&-3\\-3&3\end{bmatrix}.
$$

$$
\begin{aligned}
\theta
&=(X^TX)^{-1}X^Ty\\
&=\frac{1}{6}\begin{bmatrix}5&-3\\-3&3\end{bmatrix}\begin{bmatrix}9\\13\end{bmatrix}\\
&=\frac{1}{6}\begin{bmatrix}45-39\\-27+39\end{bmatrix}\\
&=\begin{bmatrix}1\\2\end{bmatrix}.
\end{aligned}
$$

**Step 5: residuals.**

$$
\hat y=X\theta=\begin{bmatrix}1\\3\\5\end{bmatrix},
\qquad
r=y-\hat y=\begin{bmatrix}0\\0\\0\end{bmatrix}.
$$

$$
\boxed{\theta_0=1,\quad\theta_1=2,\quad\hat y=1+2x}
$$

#### E2. Coded: OLS line + residual anatomy

**Problem.** Fit OLS to noisy linear data and show the fitted line, residual segments, and residual histogram.

```python
# Generate noisy linear data.
x_e2, y_e2 = make_regression_data("linear", n=70)

# Add an intercept column.
X_e2 = add_intercept(x_e2)

# Solve OLS with the pseudoinverse.
theta_e2 = np.linalg.pinv(X_e2) @ y_e2

# Compute fitted values.
y_hat_e2 = X_e2 @ theta_e2

# Compute residuals as observed minus fitted.
residuals_e2 = y_e2 - y_hat_e2

# Compute mean squared error.
mse_e2 = mse(y_e2, y_hat_e2)

# Create two subplots.
fig, axes = plt.subplots(1, 2, figsize=(12, 4))

# Plot the data points.
axes[0].scatter(x_e2, y_e2, color="black", alpha=0.75, label="data")

# Plot the fitted line.
axes[0].plot(x_e2, y_hat_e2, color="red", linewidth=2, label="OLS fit")

# Draw residual segments one point at a time.
for x_i, y_i, yhat_i in zip(x_e2, y_e2, y_hat_e2):
    # Draw the vertical error between observed and fitted y-values.
    axes[0].plot([x_i, x_i], [yhat_i, y_i], color="gray", alpha=0.35)

# Label the x-axis.
axes[0].set_xlabel("x")

# Label the y-axis.
axes[0].set_ylabel("y")

# Title the line plot.
axes[0].set_title(f"y = {theta_e2[0]:.2f} + {theta_e2[1]:.2f}x")

# Show the legend.
axes[0].legend()

# Plot residual histogram.
axes[1].hist(residuals_e2, bins=14, color="steelblue", edgecolor="black")

# Draw the zero-residual reference.
axes[1].axvline(0.0, color="red", linestyle="--")

# Label the residual axis.
axes[1].set_xlabel("residual")

# Label the count axis.
axes[1].set_ylabel("count")

# Title the histogram.
axes[1].set_title(f"Residuals, MSE={mse_e2:.3f}")

# Tighten layout.
plt.tight_layout()

# Display the figure.
plt.show()

# Print the learned parameters.
print("theta =", theta_e2)
```

▶ What you'll see: the line runs through the center of the data cloud, and residuals are vertical gaps.

👀 OLS minimizes squared vertical gaps, not absolute gaps or perpendicular distances.

#### E3. Pen-and-paper: one LMS batch update by hand

**Problem.** Use

$$
x^{(1)}=\begin{bmatrix}1\\0\end{bmatrix},\ y^{(1)}=1,
\qquad
x^{(2)}=\begin{bmatrix}1\\2\end{bmatrix},\ y^{(2)}=5,
$$

with $\theta=\begin{bmatrix}0\\1\end{bmatrix}$ and $\alpha=0.1$.

**Predictions.**

$$
h_\theta(x^{(1)})=0\cdot1+1\cdot0=0,
\qquad
h_\theta(x^{(2)})=0\cdot1+1\cdot2=2.
$$

**Errors.**

$$
e^{(1)}=1-0=1,
\qquad
e^{(2)}=5-2=3.
$$

**Intercept update.**

$$
\begin{aligned}
\sum_i e^{(i)}x_0^{(i)}&=1\cdot1+3\cdot1=4,\\
\theta_0&\leftarrow0+0.1\cdot4=0.4.
\end{aligned}
$$

**Slope update.**

$$
\begin{aligned}
\sum_i e^{(i)}x_1^{(i)}&=1\cdot0+3\cdot2=6,\\
\theta_1&\leftarrow1+0.1\cdot6=1.6.
\end{aligned}
$$

$$
\boxed{\theta_{new}=\begin{bmatrix}0.4\\1.6\end{bmatrix}}
$$

The new predictions are $0.4$ and $0.4+1.6\cdot2=3.6$, closer to targets $1$ and $5$.

#### E4. Coded: logistic regression from score to probability

**Problem.** Fit logistic regression to separable data and plot the probability field and decision boundary.

```python
# Generate separable binary data.
X_e4, y_e4 = make_classification_data("separable", n=220)

# Split into train and test sets.
X_train_e4, X_test_e4, y_train_e4, y_test_e4 = train_test_split(X_e4, y_e4, test_size=0.30, random_state=229, stratify=y_e4)

# Build a standardized logistic regression pipeline.
model_e4 = make_pipeline(StandardScaler(), LogisticRegression(random_state=229))

# Fit logistic regression to the training data.
model_e4.fit(X_train_e4, y_train_e4)

# Predict held-out classes.
pred_e4 = model_e4.predict(X_test_e4)

# Compute held-out accuracy.
acc_e4 = accuracy_score(y_test_e4, pred_e4)

# Create horizontal grid bounds.
x0_min_e4, x0_max_e4 = X_e4[:, 0].min() - 1.0, X_e4[:, 0].max() + 1.0

# Create vertical grid bounds.
x1_min_e4, x1_max_e4 = X_e4[:, 1].min() - 1.0, X_e4[:, 1].max() + 1.0

# Build a dense prediction grid.
xx_e4, yy_e4 = np.meshgrid(np.linspace(x0_min_e4, x0_max_e4, 250), np.linspace(x1_min_e4, x1_max_e4, 250))

# Flatten the grid into coordinate pairs.
grid_e4 = np.column_stack([xx_e4.ravel(), yy_e4.ravel()])

# Predict class-one probabilities on the grid.
prob_e4 = model_e4.predict_proba(grid_e4)[:, 1].reshape(xx_e4.shape)

# Create two panels.
fig, axes = plt.subplots(1, 2, figsize=(12, 4))

# Create logits for the sigmoid display.
z_e4 = np.linspace(-8.0, 8.0, 400)

# Plot the sigmoid curve.
axes[0].plot(z_e4, sigmoid(z_e4), color="black")

# Mark the probability threshold.
axes[0].axhline(0.5, color="red", linestyle="--")

# Mark the zero-logit boundary.
axes[0].axvline(0.0, color="red", linestyle="--")

# Label the logit axis.
axes[0].set_xlabel("z")

# Label the probability axis.
axes[0].set_ylabel("g(z)")

# Title the sigmoid panel.
axes[0].set_title("Sigmoid probability")

# Plot probability contours.
cf_e4 = axes[1].contourf(xx_e4, yy_e4, prob_e4, levels=20, cmap="coolwarm", alpha=0.75)

# Draw the 0.5 boundary.
axes[1].contour(xx_e4, yy_e4, prob_e4, levels=[0.5], colors="black", linewidths=2)

# Overlay data points.
axes[1].scatter(X_e4[:, 0], X_e4[:, 1], c=y_e4, cmap="coolwarm", edgecolor="k")

# Label the first feature.
axes[1].set_xlabel("feature 1")

# Label the second feature.
axes[1].set_ylabel("feature 2")

# Title the boundary panel.
axes[1].set_title(f"Decision boundary, accuracy={acc_e4:.3f}")

# Add a probability colorbar.
fig.colorbar(cf_e4, ax=axes[1], label="P(y=1|x)")

# Tighten layout.
plt.tight_layout()

# Display the figure.
plt.show()
```

▶ What you'll see: a smooth probability gradient with a straight black $p=0.5$ boundary.

👀 Logistic regression is linear in its boundary but nonlinear in its probability output.

#### E5. Pen-and-paper: Bernoulli logistic likelihood for one example

**Problem.** Let $y=1$ and $z=\theta^Tx=-0.7$. Compute probability, likelihood, log-likelihood, and loss.

**Probability.**

$$
\begin{aligned}
\phi&=g(-0.7)=\frac{1}{1+e^{0.7}}\\
&=\frac{1}{1+2.0137527}\\
&\approx0.3318122.
\end{aligned}
$$

**Likelihood.**

$$
\begin{aligned}
p(y\mid x;\theta)&=\phi^y(1-\phi)^{1-y}\\
&=\phi^1(1-\phi)^0\\
&=0.3318122.
\end{aligned}
$$

**Log-likelihood.**

$$
\log L=\log(0.3318122)\approx-1.1031860.
$$

**Loss.**

$$
\begin{aligned}
\ell&=-\left[y\log\phi+(1-y)\log(1-\phi)\right]\\
&=-\log(0.3318122)\\
&\approx1.1031860.
\end{aligned}
$$

$$
\boxed{\phi\approx0.3318,\quad L\approx0.3318,\quad \log L\approx-1.1032,\quad \ell\approx1.1032}
$$

### 🔴 Advanced

#### A1. Coded: normal equations and gradient descent on one dataset

**Problem.** Fit linear regression by normal equations and gradient descent. Show a loss curve, fitted lines, and residuals.

```python
# Generate one noisy linear dataset.
x_a1, y_a1 = make_regression_data("linear", n=90)

# Add the intercept column.
X_a1 = add_intercept(x_a1)

# Count examples for average gradients.
m_a1 = X_a1.shape[0]

# Compute the closed-form OLS solution.
theta_ne_a1 = np.linalg.pinv(X_a1) @ y_a1

# Initialize gradient descent far from the optimum.
theta_gd_a1 = np.array([-3.0, -1.0])

# Set a stable learning rate.
alpha_a1 = 0.08

# Set the number of epochs.
epochs_a1 = 120

# Create a list for parameter history.
theta_path_a1 = []

# Create a list for loss history.
loss_path_a1 = []

# Run batch gradient descent.
for epoch_a1 in range(epochs_a1):
    # Predict with current parameters.
    pred_a1 = X_a1 @ theta_gd_a1
    # Compute prediction-minus-target errors.
    error_a1 = pred_a1 - y_a1
    # Store average half-MSE loss.
    loss_path_a1.append(0.5 * np.mean(error_a1 ** 2))
    # Store current parameters.
    theta_path_a1.append(theta_gd_a1.copy())
    # Compute average gradient.
    grad_a1 = (X_a1.T @ error_a1) / m_a1
    # Step opposite the gradient.
    theta_gd_a1 = theta_gd_a1 - alpha_a1 * grad_a1

# Convert loss history to an array.
loss_path_a1 = np.array(loss_path_a1)

# Convert parameter history to an array.
theta_path_a1 = np.array(theta_path_a1)

# Compute closed-form predictions.
y_ne_a1 = X_a1 @ theta_ne_a1

# Compute gradient-descent predictions.
y_gd_a1 = X_a1 @ theta_gd_a1

# Compute gradient-descent residuals.
residuals_a1 = y_a1 - y_gd_a1

# Create three panels.
fig, axes = plt.subplots(1, 3, figsize=(15, 4))

# Plot the optimization loss curve.
axes[0].plot(loss_path_a1, color="black")

# Label the epoch axis.
axes[0].set_xlabel("epoch")

# Label the loss axis.
axes[0].set_ylabel("average half-MSE")

# Title the loss panel.
axes[0].set_title("Gradient descent loss")

# Plot data points.
axes[1].scatter(x_a1, y_a1, color="black", alpha=0.7, label="data")

# Plot normal-equation line.
axes[1].plot(x_a1, y_ne_a1, color="blue", linewidth=2, label="normal equations")

# Plot gradient-descent line.
axes[1].plot(x_a1, y_gd_a1, color="red", linestyle="--", linewidth=2, label="gradient descent")

# Label the feature axis.
axes[1].set_xlabel("x")

# Label the target axis.
axes[1].set_ylabel("y")

# Title the fit panel.
axes[1].set_title("Two ways to the same line")

# Show the legend.
axes[1].legend()

# Plot residuals against x.
axes[2].scatter(x_a1, residuals_a1, color="purple", alpha=0.75)

# Draw a zero-residual line.
axes[2].axhline(0.0, color="black", linestyle="--")

# Label the feature axis.
axes[2].set_xlabel("x")

# Label the residual axis.
axes[2].set_ylabel("residual")

# Title the residual panel.
axes[2].set_title("Residual diagnostic")

# Tighten layout.
plt.tight_layout()

# Display the panels.
plt.show()

# Print closed-form parameters.
print("normal equations theta =", theta_ne_a1)

# Print gradient-descent parameters.
print("gradient descent theta =", theta_gd_a1)
```

▶ What you'll see: loss decreases, and the gradient-descent line nearly overlaps the normal-equation line.

👀 Normal equations solve in one matrix step; gradient descent solves by repeated small updates.

#### A2. Coded: locally weighted regression vs global OLS

**Problem.** On nonlinear data, compare one global line to LWR curves with several $\tau$ values.

```python
# Generate nonlinear sine data.
x_a2, y_a2 = make_regression_data("sine", n=100)

# Build the global design matrix.
X_a2 = add_intercept(x_a2)

# Fit one global OLS line.
theta_global_a2 = np.linalg.pinv(X_a2) @ y_a2

# Compute global OLS predictions.
y_global_a2 = X_a2 @ theta_global_a2

# Create query points for smooth curves.
x_query_a2 = np.linspace(x_a2.min(), x_a2.max(), 220)

# Define one-query LWR prediction.
def lwr_predict_one(x_train, y_train, x_query, tau):
    # Add an intercept column to training features.
    X_train = add_intercept(x_train)
    # Compute query-centered Gaussian weights.
    weights = np.exp(-((x_train - x_query) ** 2) / (2.0 * tau ** 2))
    # Store weights on the diagonal.
    W = np.diag(weights)
    # Compute the weighted normal-equation left side.
    left = X_train.T @ W @ X_train
    # Compute the weighted normal-equation right side.
    right = X_train.T @ W @ y_train
    # Solve using a pseudoinverse for stability.
    theta_local = np.linalg.pinv(left) @ right
    # Build the query feature vector.
    x_vec = np.array([1.0, x_query])
    # Return the local prediction at the query.
    return x_vec @ theta_local

# Store bandwidths to compare.
taus_a2 = [0.20, 0.45, 1.00]

# Compute LWR curves for every bandwidth.
lwr_curves_a2 = {tau: np.array([lwr_predict_one(x_a2, y_a2, xq, tau) for xq in x_query_a2]) for tau in taus_a2}

# Select one query location for weight visualization.
x_focus_a2 = 1.0

# Select one bandwidth for weight visualization.
tau_focus_a2 = 0.45

# Compute focus weights.
weights_focus_a2 = np.exp(-((x_a2 - x_focus_a2) ** 2) / (2.0 * tau_focus_a2 ** 2))

# Create two panels.
fig, axes = plt.subplots(1, 2, figsize=(13, 4))

# Plot weighted points with marker size proportional to weight.
axes[0].scatter(x_a2, y_a2, s=30 + 220 * weights_focus_a2, c=weights_focus_a2, cmap="viridis", edgecolor="k")

# Mark the query location.
axes[0].axvline(x_focus_a2, color="red", linestyle="--")

# Label the x-axis.
axes[0].set_xlabel("x")

# Label the y-axis.
axes[0].set_ylabel("y")

# Title the weight panel.
axes[0].set_title(f"Weights near x={x_focus_a2}")

# Plot original data.
axes[1].scatter(x_a2, y_a2, color="black", alpha=0.55, label="data")

# Plot global OLS line.
axes[1].plot(x_a2, y_global_a2, color="red", linewidth=2, label="global OLS")

# Plot each LWR curve.
for tau, curve in lwr_curves_a2.items():
    # Draw the curve for one bandwidth.
    axes[1].plot(x_query_a2, curve, linewidth=2, label=f"LWR tau={tau}")

# Label the x-axis.
axes[1].set_xlabel("x")

# Label the prediction axis.
axes[1].set_ylabel("prediction")

# Title the curve panel.
axes[1].set_title("Local lines form a nonlinear curve")

# Show the legend.
axes[1].legend()

# Tighten layout.
plt.tight_layout()

# Display the figure.
plt.show()
```

▶ What you'll see: nearby points are weighted heavily, and small-$\tau$ LWR bends with the sine wave.

👀 LWR is locally linear but globally flexible because the fitted parameters depend on the query point.

#### A3. Coded: logistic regression failure on nonlinear classes

**Problem.** Fit linear logistic regression to moons and inspect the underfit boundary.

```python
# Generate nonlinear two-moons data.
X_a3, y_a3 = make_classification_data("moons", n=260)

# Split into train and test sets.
X_train_a3, X_test_a3, y_train_a3, y_test_a3 = train_test_split(X_a3, y_a3, test_size=0.30, random_state=229, stratify=y_a3)

# Build a standardized linear logistic regression model.
model_a3 = make_pipeline(StandardScaler(), LogisticRegression(random_state=229))

# Fit the model.
model_a3.fit(X_train_a3, y_train_a3)

# Predict test labels.
pred_a3 = model_a3.predict(X_test_a3)

# Compute held-out accuracy.
acc_a3 = accuracy_score(y_test_a3, pred_a3)

# Create grid bounds.
x0_min_a3, x0_max_a3 = X_a3[:, 0].min() - 0.6, X_a3[:, 0].max() + 0.6

# Create grid bounds for the second feature.
x1_min_a3, x1_max_a3 = X_a3[:, 1].min() - 0.6, X_a3[:, 1].max() + 0.6

# Build prediction grid.
xx_a3, yy_a3 = np.meshgrid(np.linspace(x0_min_a3, x0_max_a3, 300), np.linspace(x1_min_a3, x1_max_a3, 300))

# Flatten grid coordinates.
grid_a3 = np.column_stack([xx_a3.ravel(), yy_a3.ravel()])

# Predict probabilities over the grid.
prob_a3 = model_a3.predict_proba(grid_a3)[:, 1].reshape(xx_a3.shape)

# Start a figure.
plt.figure(figsize=(7, 5))

# Plot probability contours.
cf_a3 = plt.contourf(xx_a3, yy_a3, prob_a3, levels=20, cmap="coolwarm", alpha=0.75)

# Draw the p=0.5 boundary.
plt.contour(xx_a3, yy_a3, prob_a3, levels=[0.5], colors="black", linewidths=2)

# Overlay true data.
plt.scatter(X_a3[:, 0], X_a3[:, 1], c=y_a3, cmap="coolwarm", edgecolor="k")

# Label the first feature.
plt.xlabel("feature 1")

# Label the second feature.
plt.ylabel("feature 2")

# Title the underfit plot.
plt.title(f"Linear boundary underfits moons, accuracy={acc_a3:.3f}")

# Add probability colorbar.
plt.colorbar(cf_a3, label="P(y=1|x)")

# Display the plot.
plt.show()
```

▶ What you'll see: a straight boundary tries to split curved interlocking moons.

👀 This is an edge case: the model class is too simple in the original feature space.

#### A4. Coded: softmax regression on three classes

**Problem.** Fit multiclass logistic regression and visualize the softmax decision regions.

```python
# Generate three-class blob data.
X_a4, y_a4 = make_classification_data("blobs3", n=240)

# Split into train and test sets.
X_train_a4, X_test_a4, y_train_a4, y_test_a4 = train_test_split(X_a4, y_a4, test_size=0.30, random_state=229, stratify=y_a4)

# Build a standardized multinomial logistic regression model.
model_a4 = make_pipeline(StandardScaler(), LogisticRegression(solver="lbfgs", random_state=229))

# Fit the softmax model.
model_a4.fit(X_train_a4, y_train_a4)

# Predict test labels.
pred_a4 = model_a4.predict(X_test_a4)

# Compute held-out accuracy.
acc_a4 = accuracy_score(y_test_a4, pred_a4)

# Create horizontal bounds.
x0_min_a4, x0_max_a4 = X_a4[:, 0].min() - 1.0, X_a4[:, 0].max() + 1.0

# Create vertical bounds.
x1_min_a4, x1_max_a4 = X_a4[:, 1].min() - 1.0, X_a4[:, 1].max() + 1.0

# Build a dense grid.
xx_a4, yy_a4 = np.meshgrid(np.linspace(x0_min_a4, x0_max_a4, 300), np.linspace(x1_min_a4, x1_max_a4, 300))

# Flatten the grid.
grid_a4 = np.column_stack([xx_a4.ravel(), yy_a4.ravel()])

# Predict class probabilities.
prob_a4 = model_a4.predict_proba(grid_a4)

# Convert probabilities to grid classes.
class_grid_a4 = np.argmax(prob_a4, axis=1).reshape(xx_a4.shape)

# Extract maximum probability as confidence.
confidence_a4 = np.max(prob_a4, axis=1).reshape(xx_a4.shape)

# Create two panels.
fig, axes = plt.subplots(1, 2, figsize=(13, 4))

# Plot decision regions.
axes[0].contourf(xx_a4, yy_a4, class_grid_a4, levels=[-0.5, 0.5, 1.5, 2.5], cmap="Set2", alpha=0.65)

# Overlay true data.
axes[0].scatter(X_a4[:, 0], X_a4[:, 1], c=y_a4, cmap="Set2", edgecolor="k")

# Label the first feature.
axes[0].set_xlabel("feature 1")

# Label the second feature.
axes[0].set_ylabel("feature 2")

# Title the region panel.
axes[0].set_title(f"Softmax regions, accuracy={acc_a4:.3f}")

# Plot confidence field.
cf_a4 = axes[1].contourf(xx_a4, yy_a4, confidence_a4, levels=20, cmap="viridis")

# Overlay true data on confidence field.
axes[1].scatter(X_a4[:, 0], X_a4[:, 1], c=y_a4, cmap="Set2", edgecolor="k")

# Label the first feature.
axes[1].set_xlabel("feature 1")

# Label the second feature.
axes[1].set_ylabel("feature 2")

# Title the confidence panel.
axes[1].set_title("Maximum softmax probability")

# Add confidence colorbar.
fig.colorbar(cf_a4, ax=axes[1], label="max probability")

# Tighten layout.
plt.tight_layout()

# Display the figure.
plt.show()
```

▶ What you'll see: three linear regions meet at boundaries, and confidence rises inside each region.

👀 Softmax regression normalizes competing linear scores into class probabilities.

#### A5. Pen-and-paper: GLM mapping for Gaussian, Bernoulli, and Poisson

**Problem.** Map three common models into the GLM template.

**Gaussian.** For unit variance,

$$
p(y;\mu)=\frac{1}{\sqrt{2\pi}}\exp\left(-\frac{(y-\mu)^2}{2}\right).
$$

Expand:

$$
\begin{aligned}
-\frac{(y-\mu)^2}{2}
&=-\frac{y^2-2\mu y+\mu^2}{2}\\
&=\mu y-\frac{\mu^2}{2}-\frac{y^2}{2}.
\end{aligned}
$$

So

$$
\eta=\mu,\quad T(y)=y,\quad a(\eta)=\frac{\eta^2}{2},\quad \mu=\theta^Tx.
$$

Thus

$$
\boxed{\mathbb{E}[y\mid x]=\theta^Tx}.
$$

**Bernoulli.**

$$
\begin{aligned}
p(y;\phi)&=\phi^y(1-\phi)^{1-y}\\
&=\exp\left(y\log\frac{\phi}{1-\phi}+\log(1-\phi)\right).
\end{aligned}
$$

Thus

$$
\eta=\log\frac{\phi}{1-\phi}.
$$

Solve:

$$
\begin{aligned}
e^\eta&=\frac{\phi}{1-\phi}\\
e^\eta(1-\phi)&=\phi\\
e^\eta&=\phi(1+e^\eta)\\
\phi&=\frac{e^\eta}{1+e^\eta}=\frac{1}{1+e^{-\eta}}.
\end{aligned}
$$

With $\eta=\theta^Tx$,

$$
\boxed{\mathbb{E}[y\mid x]=g(\theta^Tx)}.
$$

**Poisson.**

$$
\begin{aligned}
p(y;\lambda)&=\frac{e^{-\lambda}\lambda^y}{y!}\\
&=\frac{1}{y!}\exp(y\log\lambda-\lambda).
\end{aligned}
$$

Thus

$$
\eta=\log\lambda,
\quad
T(y)=y,
\quad
a(\eta)=e^\eta.
$$

Since $\lambda=e^\eta$ and $\eta=\theta^Tx$,

$$
\boxed{\mathbb{E}[y\mid x]=e^{\theta^Tx}}.
$$

| Model | Distribution | Natural parameter | Mean response |
|---|---|---|---|
| OLS | Gaussian | $\eta=\mu$ | $\theta^Tx$ |
| Logistic | Bernoulli | $\eta=\log\frac{\phi}{1-\phi}$ | $g(\theta^Tx)$ |
| Poisson | Poisson | $\eta=\log\lambda$ | $e^{\theta^Tx}$ |

### Interactive Experiment

```python
# Generate a fixed dataset for the interactive experiment.
x_int, y_int = make_regression_data("linear", n=75)

# Add an intercept column.
X_int = add_intercept(x_int)

# Count examples for gradient averaging.
m_int = X_int.shape[0]

# Define the function controlled by sliders.
def interactive_regression_fit(learning_rate=0.05, epochs=80):
    # Initialize parameters at the same point for every slider change.
    theta_int = np.array([-2.5, -1.0])
    # Create an empty list for losses.
    losses_int = []
    # Run gradient descent for the selected number of epochs.
    for epoch_int in range(epochs):
        # Compute predictions.
        pred_int = X_int @ theta_int
        # Compute errors.
        error_int = pred_int - y_int
        # Store average half-MSE loss.
        losses_int.append(0.5 * np.mean(error_int ** 2))
        # Compute average gradient.
        grad_int = (X_int.T @ error_int) / m_int
        # Update parameters.
        theta_int = theta_int - learning_rate * grad_int
    # Compute final predictions.
    final_pred_int = X_int @ theta_int
    # Create two panels.
    fig, axes = plt.subplots(1, 2, figsize=(12, 4))
    # Plot training data.
    axes[0].scatter(x_int, y_int, color="black", alpha=0.75, label="data")
    # Plot fitted line.
    axes[0].plot(x_int, final_pred_int, color="red", linewidth=2, label="GD fit")
    # Label the x-axis.
    axes[0].set_xlabel("x")
    # Label the y-axis.
    axes[0].set_ylabel("y")
    # Title the fit panel.
    axes[0].set_title(f"theta=[{theta_int[0]:.2f}, {theta_int[1]:.2f}]")
    # Show the legend.
    axes[0].legend()
    # Plot loss history.
    axes[1].plot(losses_int, color="black")
    # Label the epoch axis.
    axes[1].set_xlabel("epoch")
    # Label the loss axis.
    axes[1].set_ylabel("average half-MSE")
    # Title the loss panel.
    axes[1].set_title(f"final loss={losses_int[-1]:.3f}")
    # Tighten layout.
    plt.tight_layout()
    # Display the plot.
    plt.show()

# Launch the interactive widget with learning-rate and epoch sliders.
interact(interactive_regression_fit, learning_rate=FloatSlider(value=0.05, min=0.001, max=0.25, step=0.001, description="learning rate"), epochs=IntSlider(value=80, min=1, max=300, step=1, description="epochs"))
```

▶ What you'll see: changing learning rate changes step size; changing epochs changes how long optimization runs.

👀 Too small learns slowly, moderate converges, and too large can overshoot.
