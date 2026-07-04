# Support Vector Machines
> **Source:** CS 229 · **Category:** Model · **Type:** ⚖️ Both · [↑ Full reference](../../ai-ml-cheatsheets.md)
> 📓 The coded examples form a runnable notebook section; an `.ipynb` will be generated. [![Open In Colab](https://colab.research.google.com/assets/colab-badge.svg)](#)

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

### 🟢 Easy

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
