# Generative Learning: GDA & Naive Bayes
> **Source:** CS 229 · **Category:** Model · **Type:** ⚖️ Both · [↑ Full reference](../../ai-ml-cheatsheets.md)
> 📓 The coded examples form a runnable notebook section; an .ipynb will be generated.

## 1. Overview

Generative learning models how data is produced inside each class. Instead of drawing a boundary first, it estimates the prior $P(y)$ and the class-conditional likelihood $P(x\mid y)$, then applies Bayes' rule to classify.

**One-line intuition:** classify a point by asking which class most plausibly generated it.

Gaussian Discriminant Analysis (GDA) is a generative model for continuous features that are approximately Gaussian within each class. Naive Bayes is a generative model for discrete or count features, especially text, where estimating the full joint distribution would be impossible from modest data.

## 2. Key Idea

### Generative versus discriminative

A discriminative classifier learns

$$
P(y\mid x)\quad\text{or directly learns a decision rule}\quad h(x).
$$

A generative classifier learns

$$
P(x,y)=P(x\mid y)P(y),
$$

then uses Bayes' rule:

$$
P(y=k\mid x)=\frac{P(x\mid y=k)P(y=k)}{\sum_c P(x\mid y=c)P(y=c)}.
$$

For classification, the denominator is common to all classes, so

$$
\widehat y
=\operatorname*{argmax}_k P(y=k\mid x)
=\operatorname*{argmax}_k P(x\mid y=k)P(y=k).
$$

### Gaussian Discriminant Analysis

GDA assumes

$$
y\sim\operatorname{Bernoulli}(\phi),
$$

$$
x\mid y=0\sim\mathcal N(\mu_0,\Sigma),
\qquad
x\mid y=1\sim\mathcal N(\mu_1,\Sigma).
$$

The multivariate Gaussian likelihood is

$$
P(x\mid y=j)
=\frac{1}{(2\pi)^{n/2}|\Sigma|^{1/2}}
\exp\left(-\frac12(x-\mu_j)^T\Sigma^{-1}(x-\mu_j)\right).
$$

For $m$ training examples, the exact CS 229 maximum-likelihood estimates are

$$
\widehat{\phi}=\frac{1}{m}\sum_{i=1}^{m}\mathbf{1}_{\{y^{(i)}=1\}},
$$

$$
\widehat{\mu}_j
=\frac{\sum_{i=1}^{m}\mathbf{1}_{\{y^{(i)}=j\}}x^{(i)}}{\sum_{i=1}^{m}\mathbf{1}_{\{y^{(i)}=j\}}},
\qquad j\in\{0,1\},
$$

and

$$
\widehat{\Sigma}
=\frac{1}{m}\sum_{i=1}^{m}\left(x^{(i)}-\mu_{y^{(i)}}\right)
\left(x^{(i)}-\mu_{y^{(i)}}\right)^T.
$$

The decision boundary solves

$$
\log\frac{P(y=1\mid x)}{P(y=0\mid x)}=0.
$$

Using Bayes' rule,

$$
\log\frac{P(y=1\mid x)}{P(y=0\mid x)}
=\log\frac{P(x\mid y=1)P(y=1)}{P(x\mid y=0)P(y=0)}.
$$

Substitute the Gaussian densities:

$$
=\log\frac{\phi}{1-\phi}
-\frac12(x-\mu_1)^T\Sigma^{-1}(x-\mu_1)
+\frac12(x-\mu_0)^T\Sigma^{-1}(x-\mu_0).
$$

Expand one quadratic:

$$
(x-\mu_j)^T\Sigma^{-1}(x-\mu_j)
=x^T\Sigma^{-1}x-2\mu_j^T\Sigma^{-1}x+\mu_j^T\Sigma^{-1}\mu_j.
$$

Because both classes share the same $\Sigma$, the $x^T\Sigma^{-1}x$ terms cancel. Thus

$$
\log\frac{P(y=1\mid x)}{P(y=0\mid x)}
= (\mu_1-\mu_0)^T\Sigma^{-1}x
+\frac12\mu_0^T\Sigma^{-1}\mu_0
-\frac12\mu_1^T\Sigma^{-1}\mu_1
+\log\frac{\phi}{1-\phi},
$$

which has the linear form

$$
\theta^Tx+\theta_0.
$$

Therefore shared-covariance GDA produces a linear decision boundary.

### Naive Bayes

Naive Bayes assumes conditional independence:

$$
P(x\mid y)
=P(x_1,x_2,\ldots\mid y)
=P(x_1\mid y)P(x_2\mid y)\cdots
=\prod_{i=1}^n P(x_i\mid y).
$$

For discrete features $x_i\in\{1,\ldots,L\}$, maximum likelihood gives

$$
P(y=k)=\frac{1}{m}\times \#\{j\mid y^{(j)}=k\},
$$

and

$$
P(x_i=l\mid y=k)
=\frac{\#\{j\mid y^{(j)}=k\text{ and }x_i^{(j)}=l\}}{\#\{j\mid y^{(j)}=k\}}.
$$

For text counts, with vocabulary $V$ and word count $N_{k,w}$ in class $k$,

$$
\widehat P(w\mid y=k)=\frac{N_{k,w}}{\sum_{v\in V}N_{k,v}}.
$$

Laplace smoothing prevents zero probabilities:

$$
\widehat P_{\text{Laplace}}(w\mid y=k)
=\frac{N_{k,w}+1}{\sum_{v\in V}N_{k,v}+|V|}.
$$

For a document with counts $x_w$, the log posterior score is

$$
\log P(y=k)+\sum_{w\in V}x_w\log P(w\mid y=k),
$$

and the classifier predicts the class with the largest score.

## 3. Worked Examples

### (For coded examples) Setup

```python
import numpy as np  # Import NumPy for arrays, random sampling, linear algebra, and stable numeric work.
import matplotlib.pyplot as plt  # Import Matplotlib for scatter plots, contours, heatmaps, and bar charts.
from sklearn.linear_model import LogisticRegression  # Import logistic regression for a discriminative comparison.
from sklearn.naive_bayes import MultinomialNB  # Import multinomial Naive Bayes for count-vector examples.
from sklearn.feature_extraction.text import CountVectorizer  # Import CountVectorizer to turn text into count matrices.
from sklearn.metrics import accuracy_score, brier_score_loss  # Import accuracy and calibration metrics.
from sklearn.model_selection import train_test_split  # Import a train-test split helper for the advanced failure case.

np.random.seed(8)  # Seed legacy NumPy randomness for reproducibility in any library code that uses it.
RNG = np.random.default_rng(8)  # Create one modern random generator used throughout this notebook section.
plt.rcParams["figure.figsize"] = (7, 5)  # Set a readable default figure size.
plt.rcParams["axes.grid"] = True  # Add light grids to make boundaries and densities easier to inspect.


def stable_softmax(log_scores):  # Define a stable normalizer for unnormalized log posterior scores.
    shifted = log_scores - np.max(log_scores)  # Subtract the largest log score to avoid overflow.
    weights = np.exp(shifted)  # Exponentiate the shifted scores into positive weights.
    return weights / weights.sum()  # Normalize the weights into probabilities.


def fit_gda(X, y, jitter=1e-6):  # Fit binary shared-covariance Gaussian Discriminant Analysis.
    X = np.asarray(X, dtype=float)  # Convert features to a float array for linear algebra.
    y = np.asarray(y, dtype=int)  # Convert labels to integer class IDs.
    m, n = X.shape  # Store the number of examples and feature dimensions.
    phi = np.mean(y == 1)  # Estimate P(y=1) as the observed positive-label fraction.
    means = np.vstack([X[y == 0].mean(axis=0), X[y == 1].mean(axis=0)])  # Estimate class means by coordinate-wise averaging.
    residuals = X - means[y]  # Subtract each observation's own class mean.
    sigma = residuals.T @ residuals / m  # Compute the shared covariance MLE with denominator m.
    sigma = sigma + jitter * np.eye(n)  # Add tiny diagonal jitter to keep the covariance invertible.
    inv_sigma = np.linalg.inv(sigma)  # Precompute the inverse covariance for Mahalanobis distances.
    sign, logdet = np.linalg.slogdet(sigma)  # Compute the log determinant in a numerically stable way.
    priors = np.array([1.0 - phi, phi])  # Store class priors in class order 0, 1.
    return {"phi": phi, "means": means, "sigma": sigma, "inv_sigma": inv_sigma, "logdet": logdet, "priors": priors}  # Return fitted parameters.


def gda_log_likelihood(X, params):  # Compute log P(x | y=k) under fitted GDA for k=0,1.
    X = np.asarray(X, dtype=float)  # Convert inputs to a float feature matrix.
    n = X.shape[1]  # Store the feature dimension for the Gaussian normalizer.
    columns = []  # Allocate a list of class-specific log-likelihood columns.
    for k in [0, 1]:  # Loop over the two classes.
        diff = X - params["means"][k]  # Center every point at the class-k mean.
        quad = np.sum((diff @ params["inv_sigma"]) * diff, axis=1)  # Compute Mahalanobis squared distances.
        log_pdf = -0.5 * (n * np.log(2.0 * np.pi) + params["logdet"] + quad)  # Compute Gaussian log density.
        columns.append(log_pdf)  # Store the class-k log-likelihood column.
    return np.column_stack(columns)  # Return an m-by-2 log-likelihood matrix.


def gda_predict_proba(X, params):  # Convert GDA likelihoods and priors into posterior probabilities.
    log_lik = gda_log_likelihood(X, params)  # Compute class-conditional log likelihoods.
    log_scores = log_lik + np.log(params["priors"])  # Add log priors to get posterior log scores up to a constant.
    shifted = log_scores - log_scores.max(axis=1, keepdims=True)  # Stabilize every row before exponentiating.
    weights = np.exp(shifted)  # Exponentiate scores into positive weights.
    return weights / weights.sum(axis=1, keepdims=True)  # Normalize each row into posterior probabilities.


def gaussian_pdf_grid(xx, yy, mean, covariance):  # Evaluate a 2-D Gaussian density over a mesh grid.
    grid = np.column_stack([xx.ravel(), yy.ravel()])  # Flatten grid coordinates into a two-column matrix.
    inv_cov = np.linalg.inv(covariance)  # Invert the covariance matrix for the quadratic form.
    sign, logdet = np.linalg.slogdet(covariance)  # Compute the log determinant stably.
    diff = grid - mean  # Center grid points at the Gaussian mean.
    quad = np.sum((diff @ inv_cov) * diff, axis=1)  # Compute one Mahalanobis distance per grid point.
    log_pdf = -0.5 * (2 * np.log(2.0 * np.pi) + logdet + quad)  # Compute 2-D Gaussian log density.
    return np.exp(log_pdf).reshape(xx.shape)  # Return density values in mesh-grid shape.


def make_shared_gaussian(n_per_class=90, separation=2.4):  # Generate a two-class dataset satisfying GDA assumptions.
    covariance = np.array([[1.0, 0.45], [0.45, 0.9]])  # Use one tilted covariance matrix for both classes.
    mean0 = np.array([-separation / 2.0, -0.2])  # Place class 0 left of center.
    mean1 = np.array([separation / 2.0, 0.35])  # Place class 1 right of center.
    X0 = RNG.multivariate_normal(mean0, covariance, size=n_per_class)  # Sample class-0 Gaussian points.
    X1 = RNG.multivariate_normal(mean1, covariance, size=n_per_class)  # Sample class-1 Gaussian points.
    X = np.vstack([X0, X1])  # Combine both classes into one feature matrix.
    y = np.array([0] * n_per_class + [1] * n_per_class)  # Create matching binary labels.
    return X, y  # Return the synthetic dataset.


def plot_gda(ax, X, y, params, title):  # Plot GDA contours and the posterior decision boundary.
    x_min, x_max = X[:, 0].min() - 1.0, X[:, 0].max() + 1.0  # Compute x-axis limits with margin.
    y_min, y_max = X[:, 1].min() - 1.0, X[:, 1].max() + 1.0  # Compute y-axis limits with margin.
    xs = np.linspace(x_min, x_max, 180)  # Create x grid coordinates.
    ys = np.linspace(y_min, y_max, 180)  # Create y grid coordinates.
    xx, yy = np.meshgrid(xs, ys)  # Build a rectangular coordinate mesh.
    for k, color in [(0, "tab:blue"), (1, "tab:orange")]:  # Loop over class IDs and colors.
        density = gaussian_pdf_grid(xx, yy, params["means"][k], params["sigma"])  # Evaluate the fitted class-k Gaussian.
        ax.contour(xx, yy, density, levels=5, colors=color, alpha=0.75)  # Draw class-k density contours.
    grid = np.column_stack([xx.ravel(), yy.ravel()])  # Flatten the grid for posterior prediction.
    prob1 = gda_predict_proba(grid, params)[:, 1].reshape(xx.shape)  # Compute P(y=1 | x) on the grid.
    ax.contour(xx, yy, prob1, levels=[0.5], colors="black", linewidths=2.0)  # Draw the decision boundary.
    ax.scatter(X[y == 0, 0], X[y == 0, 1], s=28, alpha=0.75, label="class 0")  # Plot class-0 observations.
    ax.scatter(X[y == 1, 0], X[y == 1, 1], s=28, alpha=0.75, label="class 1")  # Plot class-1 observations.
    ax.scatter(params["means"][:, 0], params["means"][:, 1], c="black", marker="x", s=130, label="means")  # Mark fitted means.
    ax.set_title(title)  # Add the requested title.
    ax.set_xlabel("feature 1")  # Label the first feature axis.
    ax.set_ylabel("feature 2")  # Label the second feature axis.
    ax.legend(loc="best")  # Show class and mean labels.


def count_words_by_class(docs, labels, vocabulary):  # Count vocabulary terms separately by class.
    counts = {0: dict.fromkeys(vocabulary, 0), 1: dict.fromkeys(vocabulary, 0)}  # Initialize all class-word counts to zero.
    doc_counts = {0: 0, 1: 0}  # Initialize document counts per class.
    for doc, label in zip(docs, labels):  # Iterate over paired documents and labels.
        doc_counts[int(label)] += 1  # Count one more document for its class.
        for token in doc.lower().split():  # Tokenize by lowercasing and splitting on spaces.
            if token in vocabulary:  # Ignore words outside the fixed vocabulary.
                counts[int(label)][token] += 1  # Add one count for the observed class-word pair.
    return counts, doc_counts  # Return word counts and document counts.
```

### Data — swappable sources

```python
DATA_SOURCE = "shared_gaussian"  # Choose "shared_gaussian", "unequal_gaussian", "toy_text", or "correlated_binary".
TEXT_SOURCE = "spam_toy"  # Choose "spam_toy" or replace the documents below with your own same-format strings.

if DATA_SOURCE == "shared_gaussian":  # Select numeric data that satisfies GDA's shared-covariance assumption.
    X_demo, y_demo = make_shared_gaussian(n_per_class=80, separation=2.4)  # Generate two Gaussian clouds with one covariance.
elif DATA_SOURCE == "unequal_gaussian":  # Select numeric data that violates the shared-covariance assumption.
    X0_demo = RNG.multivariate_normal([-1.2, 0.0], [[1.4, 0.9], [0.9, 1.0]], size=80)  # Sample class 0 with a wide tilted covariance.
    X1_demo = RNG.multivariate_normal([1.2, 0.2], [[0.45, -0.2], [-0.2, 1.6]], size=80)  # Sample class 1 with a different covariance.
    X_demo = np.vstack([X0_demo, X1_demo])  # Combine unequal-covariance feature rows.
    y_demo = np.array([0] * 80 + [1] * 80)  # Create labels for the combined numeric data.
elif DATA_SOURCE in ["toy_text", "correlated_binary"]:  # Select sources that are constructed inside later examples.
    X_demo, y_demo = None, None  # Store no generic numeric dataset for these source modes.
else:  # Handle accidental misspellings.
    raise ValueError("Unknown DATA_SOURCE.")  # Raise a clear error for invalid source names.

spam_docs = ["win cash prize now", "cheap prize win offer", "cash offer now", "team meeting schedule", "project meeting today", "schedule project update"]  # Store a tiny spam/ham corpus.
spam_labels = np.array([1, 1, 1, 0, 0, 0])  # Label spam as 1 and ham as 0.
spam_vocab = ["win", "cash", "prize", "now", "cheap", "offer", "team", "meeting", "schedule", "project", "today", "update"]  # Fix a vocabulary.

if X_demo is not None:  # Visualize numeric sources immediately.
    fig, ax = plt.subplots(figsize=(6, 4.5))  # Create a compact inspection plot.
    ax.scatter(X_demo[y_demo == 0, 0], X_demo[y_demo == 0, 1], label="class 0", alpha=0.75)  # Plot class-0 points.
    ax.scatter(X_demo[y_demo == 1, 0], X_demo[y_demo == 1, 1], label="class 1", alpha=0.75)  # Plot class-1 points.
    ax.set_title(f"Current DATA_SOURCE = {DATA_SOURCE}")  # Display the active data source.
    ax.set_xlabel("feature 1")  # Label the x-axis.
    ax.set_ylabel("feature 2")  # Label the y-axis.
    ax.legend()  # Show class labels.
    plt.show()  # Render the inspection plot.
else:  # Preview nonnumeric sources by printing documents.
    print(f"Current DATA_SOURCE = {DATA_SOURCE}")  # Print the active data source.
    for doc, label in zip(spam_docs, spam_labels):  # Iterate over toy text examples.
        print(f"label={label}: {doc}")  # Print each document with its label.
```

▶ What you'll see: Gaussian sources produce a scatter plot; text sources print labeled short documents.

👀 **Takeaway:** generative models are assumption-driven, so the data source should make the assumption visible.

### 🟢 Basics (warm-up)

#### B1. Estimate one Bernoulli class prior $\widehat\phi$

```python
labels_b1 = np.array([0, 1, 1, 0, 1, 1, 0, 1])  # Store a tiny binary label vector.
positive_b1 = np.sum(labels_b1 == 1)  # Count labels equal to 1.
total_b1 = labels_b1.size  # Count all labels.
phi_b1 = positive_b1 / total_b1  # Estimate phi as the positive-label fraction.
print(f"phi_hat = {positive_b1}/{total_b1} = {phi_b1:.3f}")  # Print the MLE calculation.
```

▶ What you'll see: $\widehat\phi=5/8=0.625$.

👀 **Takeaway:** a Bernoulli prior MLE is a count divided by the sample size.

---

#### B2. Compute one GDA class mean $\widehat\mu_j$

```python
points_b2 = np.array([[1.0, 2.0], [2.0, 1.0], [3.0, 3.0]])  # Store three points from one class.
mu_b2 = points_b2.mean(axis=0)  # Average each feature coordinate across the class.
print(f"mu_hat_j = {mu_b2}")  # Print the fitted class mean.
fig, ax = plt.subplots(figsize=(5, 4))  # Create a small mean-visualization plot.
ax.scatter(points_b2[:, 0], points_b2[:, 1], s=80, label="class points")  # Plot the observations.
ax.scatter(mu_b2[0], mu_b2[1], c="black", marker="x", s=150, label="mean")  # Plot the coordinate-wise average.
ax.set_title("B2 one GDA class mean")  # Title the plot.
ax.set_xlabel("feature 1")  # Label the x-axis.
ax.set_ylabel("feature 2")  # Label the y-axis.
ax.legend()  # Show plot labels.
plt.show()  # Render the plot.
```

▶ What you'll see: the black mean marker lies at $(2,2)$.

👀 **Takeaway:** a GDA class mean is the centroid of that class's feature vectors.

---

#### B3. Multiply two Naive Bayes likelihood terms

```python
p_x1_given_y_b3 = 0.7  # Store P(x_1 = observed value | y = k).
p_x2_given_y_b3 = 0.2  # Store P(x_2 = observed value | y = k).
likelihood_b3 = p_x1_given_y_b3 * p_x2_given_y_b3  # Multiply terms under conditional independence.
print(f"P(x | y=k) = {p_x1_given_y_b3} * {p_x2_given_y_b3} = {likelihood_b3:.3f}")  # Print the product likelihood.
```

▶ What you'll see: $P(x\mid y=k)=0.14$.

👀 **Takeaway:** Naive Bayes replaces a joint likelihood with a product of feature likelihoods.

---

### 🟡 Easy

#### E1. Estimate GDA class prior and means by hand

**Problem.** Four labeled points are

$$
((0,0),0),\quad ((2,0),0),\quad ((3,3),1),\quad ((5,3),1).
$$

Compute $\widehat\phi$, $\widehat\mu_0$, and $\widehat\mu_1$.

**Step-by-step solution.** There are $m=4$ examples. The prior estimate is

$$
\widehat\phi=\frac{1}{4}\sum_{i=1}^4\mathbf{1}_{\{y^{(i)}=1\}}.
$$

Two labels equal $1$, so

$$
\sum_{i=1}^4\mathbf{1}_{\{y^{(i)}=1\}}=2.
$$

Therefore

$$
\widehat\phi=\frac24=\frac12.
$$

For class $0$,

$$
\widehat\mu_0=\frac{(0,0)+(2,0)}{2}=\frac{(2,0)}{2}=(1,0).
$$

For class $1$,

$$
\widehat\mu_1=\frac{(3,3)+(5,3)}{2}=\frac{(8,6)}{2}=(4,3).
$$

**Boxed answer.**

$$
\boxed{\widehat\phi=\frac12,\qquad \widehat\mu_0=(1,0),\qquad \widehat\mu_1=(4,3).}
$$

---

#### E2. Shared covariance by hand

**Problem.** Using the same points and means $\mu_0=(1,0)$, $\mu_1=(4,3)$, compute

$$
\widehat\Sigma=\frac14\sum_{i=1}^4(x^{(i)}-\mu_{y^{(i)}})(x^{(i)}-\mu_{y^{(i)}})^T.
$$

**Step-by-step solution.** The class-0 residuals are

$$
(0,0)-(1,0)=(-1,0),
\qquad
(2,0)-(1,0)=(1,0).
$$

Their outer products are

$$
\begin{bmatrix}-1\\0\end{bmatrix}\begin{bmatrix}-1&0\end{bmatrix}
=\begin{bmatrix}1&0\\0&0\end{bmatrix},
\qquad
\begin{bmatrix}1\\0\end{bmatrix}\begin{bmatrix}1&0\end{bmatrix}
=\begin{bmatrix}1&0\\0&0\end{bmatrix}.
$$

The class-1 residuals are

$$
(3,3)-(4,3)=(-1,0),
\qquad
(5,3)-(4,3)=(1,0),
$$

with the same outer products:

$$
\begin{bmatrix}1&0\\0&0\end{bmatrix},
\qquad
\begin{bmatrix}1&0\\0&0\end{bmatrix}.
$$

Summing gives

$$
\sum_{i=1}^4 r^{(i)}r^{(i)T}
=4\begin{bmatrix}1&0\\0&0\end{bmatrix}
=\begin{bmatrix}4&0\\0&0\end{bmatrix}.
$$

Divide by $4$:

$$
\widehat\Sigma
=\frac14\begin{bmatrix}4&0\\0&0\end{bmatrix}
=\begin{bmatrix}1&0\\0&0\end{bmatrix}.
$$

This matrix is singular because the residuals have no second-coordinate variation. In software, we usually add small diagonal regularization.

**Boxed answer.**

$$
\boxed{\widehat\Sigma=\begin{bmatrix}1&0\\0&0\end{bmatrix}.}
$$

---

#### E3. GDA on two Gaussian clouds

**Problem.** Fit GDA on two 2-D Gaussian classes and plot per-class Gaussian contours plus the decision boundary.

```python
X_e3, y_e3 = make_shared_gaussian(n_per_class=100, separation=2.6)  # Generate data that matches GDA assumptions.
params_e3 = fit_gda(X_e3, y_e3)  # Estimate the prior, means, and shared covariance.
prob_e3 = gda_predict_proba(X_e3, params_e3)[:, 1]  # Compute fitted posterior probabilities for class 1.
pred_e3 = (prob_e3 >= 0.5).astype(int)  # Convert posterior probabilities into class predictions.
print(f"phi_hat = {params_e3['phi']:.3f}")  # Print the fitted positive-class prior.
print(f"mu_0_hat = {params_e3['means'][0]}")  # Print the class-0 mean estimate.
print(f"mu_1_hat = {params_e3['means'][1]}")  # Print the class-1 mean estimate.
print(f"training accuracy = {accuracy_score(y_e3, pred_e3):.3f}")  # Print the training accuracy.
fig, ax = plt.subplots(figsize=(7, 5.5))  # Create a plot for density contours and boundary.
plot_gda(ax, X_e3, y_e3, params_e3, "E3 fitted GDA contours and boundary")  # Draw contours, data, means, and boundary.
plt.show()  # Render the plot.
```

▶ What you'll see: two fitted Gaussian contour families and a straight black posterior-$0.5$ boundary.

👀 **Takeaway:** the GDA boundary is linear because both fitted classes share one covariance matrix.

---

#### E4. Naive Bayes word counts for spam by hand

**Problem.** Vocabulary $V=\{\text{win},\text{meeting},\text{project}\}$ and messages are:

| message | label |
|---|---|
| win win | spam |
| win project | spam |
| meeting project | ham |
| meeting meeting | ham |

Let spam be $y=1$ and ham be $y=0$. Estimate priors and Laplace-smoothed word probabilities.

**Step-by-step solution.** There are two spam and two ham documents:

$$
P(y=1)=\frac24=\frac12,
\qquad
P(y=0)=\frac24=\frac12.
$$

Spam word counts are

$$
N_{1,\text{win}}=3,
\quad
N_{1,\text{meeting}}=0,
\quad
N_{1,\text{project}}=1,
$$

so

$$
N_{1,\cdot}=3+0+1=4.
$$

With $|V|=3$ and Laplace smoothing,

$$
P(\text{win}\mid y=1)=\frac{3+1}{4+3}=\frac47,
$$

$$
P(\text{meeting}\mid y=1)=\frac{0+1}{4+3}=\frac17,
$$

$$
P(\text{project}\mid y=1)=\frac{1+1}{4+3}=\frac27.
$$

Ham word counts are

$$
N_{0,\text{win}}=0,
\quad
N_{0,\text{meeting}}=3,
\quad
N_{0,\text{project}}=1,
$$

so

$$
N_{0,\cdot}=0+3+1=4.
$$

Thus

$$
P(\text{win}\mid y=0)=\frac17,
\qquad
P(\text{meeting}\mid y=0)=\frac47,
\qquad
P(\text{project}\mid y=0)=\frac27.
$$

**Boxed answer.**

$$
\boxed{P(y=0)=P(y=1)=\frac12,}
$$

$$
\boxed{P(\cdot\mid y=1)=\left(\frac47,\frac17,\frac27\right),\quad
P(\cdot\mid y=0)=\left(\frac17,\frac47,\frac27\right)}
$$

in the order $(\text{win},\text{meeting},\text{project})$.

---

#### E5. Multinomial Naive Bayes text toy example

**Problem.** Fit a toy text classifier, plot class word probabilities, and classify `win cash offer`.

```python
counts_e5, doc_counts_e5 = count_words_by_class(spam_docs, spam_labels, spam_vocab)  # Count words and documents by class.
priors_e5 = {0: doc_counts_e5[0] / len(spam_docs), 1: doc_counts_e5[1] / len(spam_docs)}  # Estimate class priors from document frequencies.
word_probs_e5 = {0: {}, 1: {}}  # Allocate nested dictionaries for smoothed word probabilities.
for k_e5 in [0, 1]:  # Loop over ham and spam classes.
    total_e5 = sum(counts_e5[k_e5].values())  # Count all observed vocabulary tokens in class k.
    denom_e5 = total_e5 + len(spam_vocab)  # Add one pseudo-count for every vocabulary word.
    for word_e5 in spam_vocab:  # Loop through vocabulary words.
        word_probs_e5[k_e5][word_e5] = (counts_e5[k_e5][word_e5] + 1) / denom_e5  # Compute Laplace-smoothed P(word | class).
query_e5 = "win cash offer".split()  # Tokenize a new query document.
log_scores_e5 = np.array([np.log(priors_e5[k]) + sum(np.log(word_probs_e5[k][w]) for w in query_e5) for k in [0, 1]])  # Compute class log scores.
posterior_e5 = stable_softmax(log_scores_e5)  # Convert log scores into posterior probabilities.
print(f"P(ham | query) = {posterior_e5[0]:.3f}")  # Print ham posterior probability.
print(f"P(spam | query) = {posterior_e5[1]:.3f}")  # Print spam posterior probability.
fig, axes = plt.subplots(1, 2, figsize=(12, 4))  # Create side-by-side plots.
pos_e5 = np.arange(len(spam_vocab))  # Create x positions for vocabulary bars.
axes[0].bar(pos_e5 - 0.18, [word_probs_e5[0][w] for w in spam_vocab], width=0.36, label="ham")  # Plot ham word probabilities.
axes[0].bar(pos_e5 + 0.18, [word_probs_e5[1][w] for w in spam_vocab], width=0.36, label="spam")  # Plot spam word probabilities.
axes[0].set_xticks(pos_e5)  # Place one tick per vocabulary word.
axes[0].set_xticklabels(spam_vocab, rotation=45, ha="right")  # Label and rotate vocabulary ticks.
axes[0].set_ylabel("smoothed P(word | class)")  # Label the word-probability axis.
axes[0].set_title("E5 class word probabilities")  # Title the word-probability chart.
axes[0].legend()  # Show class labels.
axes[1].bar(["ham", "spam"], posterior_e5, color=["tab:blue", "tab:orange"])  # Plot posterior probabilities.
axes[1].set_ylim(0.0, 1.0)  # Use a probability range from 0 to 1.
axes[1].set_ylabel("posterior probability")  # Label the posterior axis.
axes[1].set_title("E5 posterior for query")  # Title the posterior chart.
plt.tight_layout()  # Prevent tick labels from overlapping.
plt.show()  # Render the plots.
```

▶ What you'll see: spam-associated words have higher spam probabilities, and the query is classified as spam.

👀 **Takeaway:** multinomial Naive Bayes accumulates word evidence additively in log-space.

---

### 🔴 Advanced

#### A1. GDA versus logistic regression boundary

**Problem.** Compare a generative GDA boundary to a discriminative logistic-regression boundary on data satisfying GDA assumptions.

```python
X_a1, y_a1 = make_shared_gaussian(n_per_class=130, separation=2.2)  # Generate shared-covariance Gaussian data.
params_a1 = fit_gda(X_a1, y_a1)  # Fit the generative GDA model.
logreg_a1 = LogisticRegression(solver="lbfgs")  # Create a logistic regression classifier.
logreg_a1.fit(X_a1, y_a1)  # Fit the discriminative classifier to labels.
xs_a1 = np.linspace(X_a1[:, 0].min() - 1.0, X_a1[:, 0].max() + 1.0, 220)  # Create grid x coordinates.
ys_a1 = np.linspace(X_a1[:, 1].min() - 1.0, X_a1[:, 1].max() + 1.0, 220)  # Create grid y coordinates.
xx_a1, yy_a1 = np.meshgrid(xs_a1, ys_a1)  # Build a 2-D grid.
grid_a1 = np.column_stack([xx_a1.ravel(), yy_a1.ravel()])  # Flatten the grid into feature rows.
prob_log_a1 = logreg_a1.predict_proba(grid_a1)[:, 1].reshape(xx_a1.shape)  # Evaluate logistic posterior probabilities on the grid.
fig, axes = plt.subplots(1, 2, figsize=(13, 5))  # Create two comparison panels.
plot_gda(axes[0], X_a1, y_a1, params_a1, "A1 GDA: densities imply boundary")  # Draw the GDA density and boundary view.
axes[1].scatter(X_a1[y_a1 == 0, 0], X_a1[y_a1 == 0, 1], s=25, alpha=0.75, label="class 0")  # Plot class-0 points for logistic regression.
axes[1].scatter(X_a1[y_a1 == 1, 0], X_a1[y_a1 == 1, 1], s=25, alpha=0.75, label="class 1")  # Plot class-1 points for logistic regression.
axes[1].contour(xx_a1, yy_a1, prob_log_a1, levels=[0.5], colors="black", linewidths=2.0)  # Draw the logistic decision boundary.
axes[1].set_title("A1 logistic regression: boundary directly")  # Title the logistic panel.
axes[1].set_xlabel("feature 1")  # Label the x-axis.
axes[1].set_ylabel("feature 2")  # Label the y-axis.
axes[1].legend()  # Show class labels.
plt.tight_layout()  # Adjust panel spacing.
plt.show()  # Render the comparison.
print(f"GDA accuracy = {accuracy_score(y_a1, (gda_predict_proba(X_a1, params_a1)[:, 1] >= 0.5).astype(int)):.3f}")  # Print GDA accuracy.
print(f"Logistic accuracy = {accuracy_score(y_a1, logreg_a1.predict(X_a1)):.3f}")  # Print logistic accuracy.
```

▶ What you'll see: both models draw similar straight boundaries, but only GDA visualizes class densities.

👀 **Takeaway:** when GDA assumptions hold, generative and discriminative linear boundaries often agree.

---

#### A2. Unequal covariance failure mode for shared-$\Sigma$ GDA

**Problem.** Fit shared-covariance GDA when the two classes actually have different covariances.

```python
cov0_a2 = np.array([[1.4, 0.95], [0.95, 1.1]])  # Define a wide tilted covariance for class 0.
cov1_a2 = np.array([[0.45, -0.20], [-0.20, 1.7]])  # Define a differently shaped covariance for class 1.
X0_a2 = RNG.multivariate_normal([-1.1, 0.0], cov0_a2, size=140)  # Sample class-0 data from its covariance.
X1_a2 = RNG.multivariate_normal([1.2, 0.2], cov1_a2, size=140)  # Sample class-1 data from a different covariance.
X_a2 = np.vstack([X0_a2, X1_a2])  # Combine both classes.
y_a2 = np.array([0] * len(X0_a2) + [1] * len(X1_a2))  # Create binary labels.
params_a2 = fit_gda(X_a2, y_a2)  # Force a shared-covariance GDA fit.
pred_a2 = (gda_predict_proba(X_a2, params_a2)[:, 1] >= 0.5).astype(int)  # Predict labels using the misspecified model.
xs_a2 = np.linspace(X_a2[:, 0].min() - 1.0, X_a2[:, 0].max() + 1.0, 220)  # Create x grid coordinates.
ys_a2 = np.linspace(X_a2[:, 1].min() - 1.0, X_a2[:, 1].max() + 1.0, 220)  # Create y grid coordinates.
xx_a2, yy_a2 = np.meshgrid(xs_a2, ys_a2)  # Build the contour grid.
true0_a2 = gaussian_pdf_grid(xx_a2, yy_a2, np.array([-1.1, 0.0]), cov0_a2)  # Evaluate the true class-0 density.
true1_a2 = gaussian_pdf_grid(xx_a2, yy_a2, np.array([1.2, 0.2]), cov1_a2)  # Evaluate the true class-1 density.
fig, axes = plt.subplots(1, 2, figsize=(13, 5))  # Create true-versus-fitted panels.
axes[0].scatter(X_a2[y_a2 == 0, 0], X_a2[y_a2 == 0, 1], s=22, alpha=0.65, label="class 0")  # Plot class-0 samples.
axes[0].scatter(X_a2[y_a2 == 1, 0], X_a2[y_a2 == 1, 1], s=22, alpha=0.65, label="class 1")  # Plot class-1 samples.
axes[0].contour(xx_a2, yy_a2, true0_a2, levels=5, colors="tab:blue")  # Draw true class-0 contours.
axes[0].contour(xx_a2, yy_a2, true1_a2, levels=5, colors="tab:orange")  # Draw true class-1 contours.
axes[0].set_title("A2 true unequal covariances")  # Title the true-density panel.
axes[0].legend()  # Show class labels.
plot_gda(axes[1], X_a2, y_a2, params_a2, "A2 shared-covariance GDA fit")  # Draw the forced shared-covariance fit.
plt.tight_layout()  # Adjust panel spacing.
plt.show()  # Render the failure-mode plot.
print(f"shared-covariance GDA accuracy = {accuracy_score(y_a2, pred_a2):.3f}")  # Print model accuracy under misspecification.
```

▶ What you'll see: true contours have different shapes, but GDA averages them into one shape and keeps a linear boundary.

👀 **Takeaway:** unequal covariances call for a quadratic boundary; shared-$\Sigma$ GDA cannot represent it.

---

#### A3. Bayes posterior from GDA likelihoods by hand

**Problem.** A one-dimensional GDA model has

$$
\phi=0.4,
\qquad
\mu_0=0,
\qquad
\mu_1=2,
\qquad
\Sigma=1.
$$

For $x=1.5$, compute $P(y=1\mid x)$ and the decision.

**Step-by-step solution.** The likelihood is

$$
P(x\mid y=j)=\frac{1}{\sqrt{2\pi}}\exp\left(-\frac12(x-\mu_j)^2\right).
$$

For class $0$,

$$
x-\mu_0=1.5-0=1.5,
$$

so

$$
P(x=1.5\mid y=0)=\frac{1}{\sqrt{2\pi}}e^{-\frac12(1.5)^2}
=\frac{1}{\sqrt{2\pi}}e^{-1.125}.
$$

For class $1$,

$$
x-\mu_1=1.5-2=-0.5,
$$

so

$$
P(x=1.5\mid y=1)=\frac{1}{\sqrt{2\pi}}e^{-\frac12(-0.5)^2}
=\frac{1}{\sqrt{2\pi}}e^{-0.125}.
$$

Bayes' rule gives

$$
P(y=1\mid x)=\frac{P(x\mid y=1)P(y=1)}{P(x\mid y=1)P(y=1)+P(x\mid y=0)P(y=0)}.
$$

Substitute the terms:

$$
P(y=1\mid x=1.5)
=\frac{\frac{1}{\sqrt{2\pi}}e^{-0.125}(0.4)}{\frac{1}{\sqrt{2\pi}}e^{-0.125}(0.4)+\frac{1}{\sqrt{2\pi}}e^{-1.125}(0.6)}.
$$

Cancel $1/\sqrt{2\pi}$:

$$
=\frac{0.4e^{-0.125}}{0.4e^{-0.125}+0.6e^{-1.125}}.
$$

Factor out $e^{-0.125}$:

$$
=\frac{0.4}{0.4+0.6e^{-1}}.
$$

Using $e^{-1}\approx0.3679$,

$$
P(y=1\mid x=1.5)\approx\frac{0.4}{0.4+0.6(0.3679)}
=\frac{0.4}{0.6207}
\approx0.644.
$$

Since $0.644>0.5$, choose class $1$.

**Boxed answer.**

$$
\boxed{P(y=1\mid x=1.5)\approx0.644,
\qquad
\widehat y=1.}
$$

---

#### A4. Laplace smoothing prevents zero-probability collapse

**Problem.** Show how unseen words make unsmoothed Naive Bayes collapse and how Laplace smoothing fixes the posterior.

```python
vocab_a4 = ["win", "cash", "meeting", "project"]  # Define a tiny vocabulary.
counts_a4 = {0: {"win": 0, "cash": 0, "meeting": 3, "project": 2}, 1: {"win": 3, "cash": 2, "meeting": 0, "project": 0}}  # Store class-word counts with zeros.
priors_a4 = {0: 0.5, 1: 0.5}  # Use balanced priors to isolate likelihood effects.
query_a4 = ["win", "meeting"]  # Choose a query containing one word unseen in each class.
raw_probs_a4 = {0: {}, 1: {}}  # Allocate unsmoothed word probabilities.
smooth_probs_a4 = {0: {}, 1: {}}  # Allocate smoothed word probabilities.
for k_a4 in [0, 1]:  # Loop over classes.
    total_a4 = sum(counts_a4[k_a4].values())  # Count all tokens in class k.
    for word_a4 in vocab_a4:  # Loop over vocabulary words.
        raw_probs_a4[k_a4][word_a4] = counts_a4[k_a4][word_a4] / total_a4  # Compute unsmoothed probabilities.
        smooth_probs_a4[k_a4][word_a4] = (counts_a4[k_a4][word_a4] + 1) / (total_a4 + len(vocab_a4))  # Compute Laplace-smoothed probabilities.
raw_scores_a4 = np.array([priors_a4[k] * np.prod([raw_probs_a4[k][w] for w in query_a4]) for k in [0, 1]])  # Multiply unsmoothed likelihood terms.
smooth_log_a4 = np.array([np.log(priors_a4[k]) + sum(np.log(smooth_probs_a4[k][w]) for w in query_a4) for k in [0, 1]])  # Add smoothed log probabilities.
smooth_post_a4 = stable_softmax(smooth_log_a4)  # Normalize smoothed log scores.
print(f"unsmoothed scores = {raw_scores_a4}")  # Print the collapsed unsmoothed scores.
print(f"smoothed posterior = {smooth_post_a4}")  # Print the recovered smoothed posterior.
fig, axes = plt.subplots(1, 2, figsize=(10, 4))  # Create two panels for before and after smoothing.
axes[0].bar(["ham", "spam"], raw_scores_a4, color=["tab:blue", "tab:orange"])  # Plot raw unnormalized class scores.
axes[0].set_title("A4 unsmoothed collapse")  # Title the raw-score panel.
axes[0].set_ylabel("prior × likelihood")  # Label the raw-score axis.
axes[1].bar(["ham", "spam"], smooth_post_a4, color=["tab:blue", "tab:orange"])  # Plot smoothed posterior probabilities.
axes[1].set_ylim(0.0, 1.0)  # Use a probability range.
axes[1].set_title("A4 Laplace-smoothed posterior")  # Title the smoothed panel.
axes[1].set_ylabel("posterior probability")  # Label the posterior axis.
plt.tight_layout()  # Prevent panel overlap.
plt.show()  # Render the smoothing comparison.
```

▶ What you'll see: unsmoothed scores are zero, while smoothed probabilities remain finite and comparable.

👀 **Takeaway:** Laplace smoothing turns impossible unseen events into small but nonzero events.

---

#### A5. Correlated features break Naive Bayes independence

**Problem.** Generate binary features where dependence differs by class. Compare the empirical joint distribution to the Naive Bayes product approximation.

```python
n_a5 = 2500  # Choose enough samples for stable empirical frequencies.
y_a5 = RNG.binomial(1, 0.5, size=n_a5)  # Sample balanced class labels.
X_a5 = np.zeros((n_a5, 2), dtype=int)  # Allocate two binary features per example.
for i_a5 in range(n_a5):  # Generate each example so dependence is class-specific.
    if y_a5[i_a5] == 1:  # Make class 1 features positively correlated.
        base_a5 = RNG.binomial(1, 0.7)  # Draw a shared latent bit.
        flips_a5 = RNG.binomial(1, 0.08, size=2)  # Draw rare independent flips.
        X_a5[i_a5] = np.logical_xor(base_a5, flips_a5).astype(int)  # Store mostly equal features.
    else:  # Make class 0 features negatively correlated.
        first_a5 = RNG.binomial(1, 0.5)  # Draw the first feature.
        noise_a5 = RNG.binomial(1, 0.08)  # Draw a rare noise bit.
        X_a5[i_a5] = [first_a5, int(np.logical_xor(1 - first_a5, noise_a5))]  # Store mostly opposite features.
X_train_a5, X_test_a5, y_train_a5, y_test_a5 = train_test_split(X_a5, y_a5, test_size=0.35, random_state=8, stratify=y_a5)  # Split data for evaluation.
nb_a5 = MultinomialNB(alpha=1.0)  # Create a Laplace-smoothed Naive Bayes classifier.
nb_a5.fit(X_train_a5, y_train_a5)  # Fit using marginal count information.
prob_a5 = nb_a5.predict_proba(X_test_a5)[:, 1]  # Predict class-1 probabilities.
pred_a5 = (prob_a5 >= 0.5).astype(int)  # Convert probabilities into labels.
patterns_a5 = np.array([[0, 0], [0, 1], [1, 0], [1, 1]])  # Enumerate all binary patterns.
true_joint_a5 = np.zeros((2, 4))  # Allocate empirical joint probabilities.
nb_joint_a5 = np.zeros((2, 4))  # Allocate product-approximation probabilities.
for k_a5 in [0, 1]:  # Loop over classes.
    rows_a5 = X_train_a5[y_train_a5 == k_a5]  # Select rows from class k.
    marg_a5 = (rows_a5.sum(axis=0) + 1) / (rows_a5.shape[0] + 2)  # Estimate Bernoulli marginals with smoothing.
    for j_a5, pattern_a5 in enumerate(patterns_a5):  # Loop over possible feature patterns.
        true_joint_a5[k_a5, j_a5] = np.mean(np.all(rows_a5 == pattern_a5, axis=1))  # Estimate the empirical joint probability.
        p0_a5 = marg_a5[0] if pattern_a5[0] == 1 else 1.0 - marg_a5[0]  # Select the first marginal probability.
        p1_a5 = marg_a5[1] if pattern_a5[1] == 1 else 1.0 - marg_a5[1]  # Select the second marginal probability.
        nb_joint_a5[k_a5, j_a5] = p0_a5 * p1_a5  # Multiply marginals as Naive Bayes would.
bins_a5 = np.linspace(0.0, 1.0, 6)  # Define probability bins for calibration.
ids_a5 = np.digitize(prob_a5, bins_a5, right=True) - 1  # Assign each prediction to a bin.
mean_pred_a5 = []  # Allocate mean predicted probabilities per bin.
mean_true_a5 = []  # Allocate observed positive rates per bin.
for b_a5 in range(len(bins_a5) - 1):  # Loop over bins.
    mask_a5 = ids_a5 == b_a5  # Select examples in the current bin.
    if np.any(mask_a5):  # Skip empty bins.
        mean_pred_a5.append(prob_a5[mask_a5].mean())  # Store average predicted probability.
        mean_true_a5.append(y_test_a5[mask_a5].mean())  # Store observed positive frequency.
fig, axes = plt.subplots(1, 3, figsize=(15, 4))  # Create heatmap and calibration panels.
axes[0].imshow(true_joint_a5, cmap="Blues", vmin=0.0, vmax=true_joint_a5.max())  # Plot empirical joint probabilities.
axes[0].set_title("A5 empirical P(x1,x2 | y)")  # Title the empirical heatmap.
axes[0].set_yticks([0, 1])  # Place class-row ticks.
axes[0].set_yticklabels(["y=0", "y=1"])  # Label class rows.
axes[0].set_xticks(range(4))  # Place pattern-column ticks.
axes[0].set_xticklabels(["00", "01", "10", "11"])  # Label feature patterns.
axes[1].imshow(nb_joint_a5, cmap="Oranges", vmin=0.0, vmax=true_joint_a5.max())  # Plot Naive Bayes product probabilities.
axes[1].set_title("A5 NB product approximation")  # Title the approximation heatmap.
axes[1].set_yticks([0, 1])  # Place class-row ticks.
axes[1].set_yticklabels(["y=0", "y=1"])  # Label class rows.
axes[1].set_xticks(range(4))  # Place pattern-column ticks.
axes[1].set_xticklabels(["00", "01", "10", "11"])  # Label feature patterns.
for r_a5 in range(2):  # Loop over heatmap rows.
    for c_a5 in range(4):  # Loop over heatmap columns.
        axes[0].text(c_a5, r_a5, f"{true_joint_a5[r_a5, c_a5]:.2f}", ha="center", va="center")  # Annotate empirical values.
        axes[1].text(c_a5, r_a5, f"{nb_joint_a5[r_a5, c_a5]:.2f}", ha="center", va="center")  # Annotate NB values.
axes[2].plot([0, 1], [0, 1], "k--", label="perfect calibration")  # Draw the ideal calibration line.
axes[2].plot(mean_pred_a5, mean_true_a5, marker="o", label="Naive Bayes")  # Plot observed versus predicted probabilities.
axes[2].set_xlim(0.0, 1.0)  # Set x-axis probability limits.
axes[2].set_ylim(0.0, 1.0)  # Set y-axis probability limits.
axes[2].set_xlabel("mean predicted P(y=1)")  # Label the x-axis.
axes[2].set_ylabel("observed fraction y=1")  # Label the y-axis.
axes[2].set_title("A5 calibration under dependence")  # Title the calibration panel.
axes[2].legend()  # Show the calibration legend.
plt.tight_layout()  # Prevent subplot overlap.
plt.show()  # Render the full failure-case figure.
print(f"test accuracy = {accuracy_score(y_test_a5, pred_a5):.3f}")  # Print held-out accuracy.
print(f"Brier score = {brier_score_loss(y_test_a5, prob_a5):.3f}")  # Print calibration-sensitive probability error.
```

▶ What you'll see: the empirical joint distribution concentrates on dependent patterns, while the Naive Bayes approximation spreads probability according to marginal products.

👀 **Takeaway:** Naive Bayes may classify well while still producing distorted probabilities when conditional independence is badly false.

---

### Interactive Experiment

```python
try:  # Try to enable widgets when running in Jupyter or Colab.
    import ipywidgets as widgets  # Import slider and checkbox widgets.
    from IPython.display import display  # Import display for showing the widget UI.
    def interactive_gda_demo(separation=2.5, shared_covariance=True):  # Define the live plotting function.
        local_rng = np.random.default_rng(12)  # Use a fixed local seed so slider changes are interpretable.
        cov_shared = np.array([[1.0, 0.45], [0.45, 0.9]])  # Define the shared covariance option.
        cov_other = np.array([[0.45, -0.25], [-0.25, 1.55]])  # Define an alternate class-1 covariance.
        mean0 = np.array([-separation / 2.0, 0.0])  # Move class 0 left as separation increases.
        mean1 = np.array([separation / 2.0, 0.15])  # Move class 1 right as separation increases.
        X0 = local_rng.multivariate_normal(mean0, cov_shared, size=100)  # Sample class 0.
        X1_cov = cov_shared if shared_covariance else cov_other  # Choose class-1 covariance from the checkbox.
        X1 = local_rng.multivariate_normal(mean1, X1_cov, size=100)  # Sample class 1.
        X = np.vstack([X0, X1])  # Combine feature rows.
        y = np.array([0] * 100 + [1] * 100)  # Create labels.
        params = fit_gda(X, y)  # Fit shared-covariance GDA to the generated data.
        fig, ax = plt.subplots(figsize=(7, 5))  # Create the live plot canvas.
        plot_gda(ax, X, y, params, f"separation={separation:.1f}, shared={shared_covariance}")  # Draw densities and boundary.
        plt.show()  # Render the current widget state.
    ui = widgets.interactive(interactive_gda_demo, separation=widgets.FloatSlider(value=2.5, min=0.5, max=5.0, step=0.25, description="separation"), shared_covariance=widgets.Checkbox(value=True, description="shared covariance"))  # Build the controls.
    display(ui)  # Display the interactive experiment.
except Exception as error:  # Fall back outside notebook environments.
    print("Run this cell in Colab or Jupyter to use the interactive sliders.")  # Explain the missing widget UI.
    print(f"Widget error: {error}")  # Print the underlying exception.
```

▶ What you'll see: increasing separation reduces overlap; turning off shared covariance makes the data geometry less compatible with GDA's straight boundary.

👀 **Takeaway:** the experiment ties the visual boundary to GDA's modeling assumptions: Gaussian classes, priors, and shared covariance.
