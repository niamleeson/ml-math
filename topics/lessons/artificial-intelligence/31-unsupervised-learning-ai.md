# Unsupervised Learning in AI (k-means, PCA)
> **Source:** CS 221 · **Category:** Method · **Type:** 💻 Colab · [↑ Full reference](../../ai-ml-cheatsheets.md)
> 📓 Runnable notebook section; an .ipynb will be generated.

## 0. Step-by-Step Worked Example — Start Here (Beginner Friendly)

> 🧑‍🎓 **New to this topic? Start here.** This is a gentle, fully runnable walkthrough that
> builds up *every* idea in this lesson one tiny step at a time. Each step **prints** the
> numbers it computes and **draws a picture** so you can *see* what is happening. Run the
> cells in order from top to bottom. Nothing here needs the internet or any downloaded data.

### The Big Picture — What You'll Learn

In plain terms, here is what the steps below will show you:

- **k-means clustering** alternates nearest-centroid assignments with centroid-mean updates and tracks distortion.
- **PCA dimensionality reduction** centers data, computes covariance eigenvectors, explains variance, and forms 1D projections.

Everything below (starting at **§1 Overview**) develops these same ideas with full derivations,
more examples, and an interactive experiment.

**What we will build, step by step:**
1. **k-means clustering** — alternate nearest-centroid assignments and centroid updates while distortion falls.
2. **PCA dimensionality reduction** — center data, find maximum-variance directions, and project to one dimension.

### Step 0 — Set up our tools

We import NumPy (arrays + linear algebra) and Matplotlib (pictures). We fix a random **seed** so every
run gives the same printed numbers, then define a tiny `log()` helper for clearly labeled output.

```python
import numpy as np                       # NumPy: distances, means, covariance matrices, and eigenvectors.
import matplotlib.pyplot as plt          # Matplotlib: plots for clusters, distortion, and PCA projections.

np.random.seed(0)                         # Fix the seed so every run prints the same numbers.
plt.rcParams["figure.figsize"] = (7, 4)   # Use a comfortable default plot size.


def log(label, value):                    # Define one small logger used in every worked-example cell.
    print(f"[{label}] {value}")           # Print each value with a readable label.

log("setup", "tools ready — NumPy + Matplotlib imported, seed fixed to 0")  # Confirm setup finished.
```
▶ What you'll see: one line confirming the tools are ready.

### Step 1 — k-means clustering: assign, update, repeat

k-means has no labels, only points and centroids. Each iteration assigns every point to its nearest centroid,
then moves each centroid to the mean of its assigned points; the distortion is the sum of squared assigned distances.

```python
cluster_left_demo = np.array([[-2.0, 0.0], [-1.6, 0.5], [-1.3, -0.4], [-1.8, -0.6]])  # Create a small left cloud.
cluster_right_demo = np.array([[1.2, 0.4], [1.7, 0.9], [2.1, 0.1], [1.6, -0.5]])       # Create a small right cloud.
points_demo = np.vstack([cluster_left_demo, cluster_right_demo])                       # Combine unlabeled examples.
centroids_demo = np.array([[-0.8, 1.0], [0.8, -0.8]])                                  # Choose two initial centroids.
distortions_demo = []                                                                   # Store distortion after each assignment step.

for iteration_demo in range(5):                                                         # Run a few coordinate-minimization rounds.
    diffs_demo = points_demo[:, None, :] - centroids_demo[None, :, :]                   # Compare every point to every centroid.
    distances_demo = np.sum(diffs_demo ** 2, axis=2)                                    # Convert differences to squared distances.
    assignments_demo = np.argmin(distances_demo, axis=1)                                # Assign each point to its nearest centroid.
    distortion_demo = distances_demo[np.arange(len(points_demo)), assignments_demo].sum() # Sum assigned squared distances.
    distortions_demo.append(distortion_demo)                                            # Save the current k-means objective value.
    log(f"iteration {iteration_demo} distortion", round(float(distortion_demo), 3))     # Print the loss before updating centroids.
    new_centroids_demo = centroids_demo.copy()                                          # Prepare updated centroid positions.
    for cluster_demo in range(2):                                                       # Update each cluster separately.
        new_centroids_demo[cluster_demo] = points_demo[assignments_demo == cluster_demo].mean(axis=0)  # Move centroid to cluster mean.
    log(f"iteration {iteration_demo} centroids", np.round(new_centroids_demo, 2))       # Print the new centroid locations.
    centroids_demo = new_centroids_demo                                                 # Use updated centroids for the next round.

final_diffs_demo = points_demo[:, None, :] - centroids_demo[None, :, :]                 # Recompute distances to final centroids.
final_distances_demo = np.sum(final_diffs_demo ** 2, axis=2)                            # Compute final squared distances.
final_assignments_demo = np.argmin(final_distances_demo, axis=1)                        # Assign points using final centroids.
final_distortion_demo = final_distances_demo[np.arange(len(points_demo)), final_assignments_demo].sum() # Compute final distortion.
log("final distortion", round(float(final_distortion_demo), 3))                         # Print the final objective value.

fig_demo, axes_demo = plt.subplots(1, 2, figsize=(10, 4))                                # Create cluster and loss panels.
axes_demo[0].scatter(points_demo[:, 0], points_demo[:, 1], c=final_assignments_demo, cmap="coolwarm", s=90, edgecolor="black")  # Plot final clusters.
axes_demo[0].scatter(centroids_demo[:, 0], centroids_demo[:, 1], marker="X", s=220, color="gold", edgecolor="black", label="centroids")  # Plot final centroids.
axes_demo[0].set_title("final nearest-centroid assignments")                            # Title the clustering panel.
axes_demo[0].set_xlabel("feature 1")                                                    # Label the first feature.
axes_demo[0].set_ylabel("feature 2")                                                    # Label the second feature.
axes_demo[0].legend()                                                                    # Show the centroid label.
axes_demo[1].plot(np.arange(len(distortions_demo)), distortions_demo, marker="o")       # Plot distortion across iterations.
axes_demo[1].set_title("distortion decreases")                                          # Title the loss panel.
axes_demo[1].set_xlabel("iteration")                                                    # Label the iteration axis.
axes_demo[1].set_ylabel("sum of squared distances")                                     # Label the k-means objective.
plt.tight_layout()                                                                       # Keep panel labels readable.
plt.show()                                                                               # Render the k-means visuals.
```
▶ What you'll see: assignments settle into two clusters, and the distortion log drops as centroids move to means.

### Step 2 — PCA dimensionality reduction: keep the directions with most variance

PCA first centers the data, then eigendecomposes the covariance matrix. The largest eigenvalue marks the direction
of maximum variance, and projecting onto its eigenvector gives a compressed one-dimensional summary.

```python
t_demo = np.linspace(-2.5, 2.5, 30)                                                     # Create a one-dimensional hidden source.
noise_demo = 0.25 * np.sin(4.0 * t_demo)                                                 # Add a tiny deterministic wiggle.
data_demo = np.column_stack([t_demo, 0.55 * t_demo + noise_demo])                        # Build correlated 2D observations.
mean_demo = data_demo.mean(axis=0)                                                       # Compute feature means for centering.
centered_demo = data_demo - mean_demo                                                    # Subtract means from every feature column.
cov_demo = centered_demo.T @ centered_demo / len(centered_demo)                          # Compute covariance X^T X / m.
eigvals_demo, eigvecs_demo = np.linalg.eigh(cov_demo)                                    # Compute eigenvalues/eigenvectors of symmetric covariance.
order_demo = np.argsort(eigvals_demo)[::-1]                                              # Sort eigenvalues from largest to smallest.
eigvals_demo = eigvals_demo[order_demo]                                                  # Reorder eigenvalues by explained variance.
eigvecs_demo = eigvecs_demo[:, order_demo]                                               # Reorder eigenvectors the same way.
explained_demo = eigvals_demo / eigvals_demo.sum()                                       # Compute explained-variance ratios.
top_vector_demo = eigvecs_demo[:, 0]                                                     # Keep the first principal direction.
projected_demo = centered_demo @ top_vector_demo                                         # Project centered data to one dimension.
reconstructed_demo = np.outer(projected_demo, top_vector_demo)                           # Map 1D coordinates back to the best-fit line.
axis_points_demo = np.array([-2.7, 2.7])[:, None] * top_vector_demo[None, :]              # Create a line along PC1 for plotting.

log("feature means", np.round(mean_demo, 3))                                             # Print the centering constants.
log("covariance matrix", np.round(cov_demo, 3))                                         # Print the covariance matrix.
log("eigenvalues", np.round(eigvals_demo, 3))                                           # Print variances along PCA directions.
log("explained variance ratio", np.round(explained_demo, 3))                            # Print how much variance each component keeps.
log("first five 1D coordinates", np.round(projected_demo[:5], 3))                       # Print a preview of compressed values.

fig_demo, axes_demo = plt.subplots(1, 2, figsize=(10, 4))                                # Create original-space and compressed-space panels.
axes_demo[0].scatter(centered_demo[:, 0], centered_demo[:, 1], color="steelblue", edgecolor="black", label="centered data")  # Plot centered points.
axes_demo[0].plot(axis_points_demo[:, 0], axis_points_demo[:, 1], color="black", linewidth=2, label="PC1 direction")  # Draw the first principal axis.
axes_demo[0].arrow(0.0, 0.0, eigvecs_demo[0, 1], eigvecs_demo[1, 1], color="salmon", width=0.015, label="PC2 direction")  # Draw the second direction.
axes_demo[0].set_aspect("equal")                                                       # Use equal scaling so directions are geometric.
axes_demo[0].set_title("PCA finds orthogonal variance directions")                      # Title the PCA direction panel.
axes_demo[0].set_xlabel("centered feature 1")                                           # Label centered feature 1.
axes_demo[0].set_ylabel("centered feature 2")                                           # Label centered feature 2.
axes_demo[0].legend()                                                                    # Show direction labels.
axes_demo[1].scatter(projected_demo, np.zeros_like(projected_demo), color="seagreen", edgecolor="black", label="1D projection")  # Plot compressed coordinates.
axes_demo[1].scatter(reconstructed_demo[:, 0], reconstructed_demo[:, 1], color="gold", edgecolor="black", alpha=0.8, label="back on PC1 line")  # Plot reconstructions.
axes_demo[1].set_title("top component gives a 1D summary")                              # Title the projection panel.
axes_demo[1].set_xlabel("PC1 coordinate or reconstructed x")                            # Label the mixed horizontal scale.
axes_demo[1].set_ylabel("zero line / reconstructed y")                                  # Label the vertical scale.
axes_demo[1].legend()                                                                    # Show projection labels.
plt.tight_layout()                                                                       # Keep subplot labels readable.
plt.show()                                                                               # Render the PCA visuals.
```
▶ What you'll see: most variance lies along PC1, so the 1D projection keeps almost all of the structure.

---

## 1. Overview

Unsupervised learning discovers structure in feature vectors without using target labels. In the CS 221 AI setting, those feature vectors might represent documents, images, search states, user behavior, or any object mapped through a feature extractor $\phi(x)$.

**One-line intuition:** k-means asks, "Which centroid is closest to each point?" while PCA asks, "Which directions explain the most variation in the data?"

## 2. Key Idea

### k-means clustering

Given unlabeled examples $x_1,\ldots,x_m$ and feature vectors $\phi(x_i)\in\mathbb{R}^n$, k-means assigns each point to one of $k$ clusters:

$$
z_i\in\{1,\ldots,k\}.
$$

The k-means objective, also called **distortion** or **inertia**, is the sum of squared distances from each feature vector to its assigned centroid:

$$
\operatorname{Loss}_{k\text{-means}}(z,\mu)
=\sum_{i=1}^{m}\left\|\phi(x_i)-\mu_{z_i}\right\|^2.
$$

The algorithm alternates between two coordinate-minimization steps:

$$
z_i=\operatorname*{argmin}_{j\in\{1,\ldots,k\}}\left\|\phi(x_i)-\mu_j\right\|^2
\quad\text{and}\quad
\mu_j=\frac{\sum_{i=1}^{m}\mathbf{1}_{\{z_i=j\}}\phi(x_i)}{\sum_{i=1}^{m}\mathbf{1}_{\{z_i=j\}}}.
$$

```text
Choose k initial centroids mu_1 through mu_k.
Repeat until assignments or centroids stop changing:
  Assignment step: set each z_i to the nearest centroid.
  Update step: set each mu_j to the mean of points assigned to cluster j.
Return assignments z, centroids mu, and final distortion.
```

Each assignment step minimizes the objective with centroids fixed; each update step minimizes it with assignments fixed. The loss therefore decreases monotonically, but the problem is non-convex, so initialization and feature scaling matter.

### PCA dimensionality reduction

Principal Component Analysis (PCA) projects data onto directions of maximum variance. For centered data matrix $X\in\mathbb{R}^{m\times n}$, the covariance matrix is

$$
\Sigma=\frac{1}{m}X^TX=\frac{1}{m}\sum_{i=1}^{m}x^{(i)}x^{(i)T}.
$$

Because $\Sigma$ is symmetric, the spectral theorem gives orthogonal eigenvectors:

$$
\Sigma u_j=\lambda_j u_j,
\qquad
\lambda_1\ge \lambda_2\ge\cdots\ge 0.
$$

PCA keeps the top $r$ eigenvectors $U_r=[u_1,\ldots,u_r]$ and projects each centered point by

$$
Y=XU_r.
$$

The explained-variance ratio of component $j$ is

$$
\frac{\lambda_j}{\sum_{\ell=1}^{n}\lambda_\ell}.
$$

```text
Center each feature column by subtracting its mean.
Optionally standardize features if units differ strongly.
Compute covariance Sigma = X^T X / m.
Compute eigenvalues and orthonormal eigenvectors of Sigma.
Sort eigenvectors by descending eigenvalue.
Project centered data onto the top r eigenvectors.
```

In AI pipelines, PCA is often used for visualization, compression, noise reduction, and as a preprocessing step before clustering.

## 3. Hands-on Notebook

### Setup

Run this first. The install line is commented because Colab usually includes these packages; uncomment it only if your runtime is missing a dependency.

```python
# !pip -q install numpy pandas matplotlib scikit-learn ipywidgets  # install the small scientific stack only if Colab does not already provide it.
import numpy as np  # use NumPy for vectorized distance calculations and linear algebra.
import pandas as pd  # use pandas for readable tables and cluster profiles.
import matplotlib.pyplot as plt  # use Matplotlib for every process and result visualization.
from sklearn.datasets import make_blobs, make_moons, load_iris, load_digits, load_wine  # use offline datasets so the notebook runs without network access.
from sklearn.cluster import KMeans  # use scikit-learn k-means after implementing k-means from scratch.
from sklearn.decomposition import PCA  # use scikit-learn PCA after implementing PCA from scratch.
from sklearn.metrics import silhouette_score, adjusted_rand_score  # evaluate cluster separation and optional hidden-label agreement.
from sklearn.preprocessing import StandardScaler  # standardize features so distances and covariance are not dominated by units.
try:  # try to import ipywidgets for the live Colab experiment.
    from ipywidgets import interact, IntSlider, Dropdown  # create sliders and dropdowns for the final interactive section.
except ModuleNotFoundError:  # keep the notebook runnable in basic Python environments without widgets.
    class _FallbackWidget:  # define a tiny widget stand-in that stores a default value.
        def __init__(self, value=None, **kwargs):  # accept the same keyword style as ipywidgets.
            self.value = value  # store the default value so the fallback can call the function once.
    IntSlider = _FallbackWidget  # replace integer sliders with the fallback class.
    Dropdown = _FallbackWidget  # replace dropdown widgets with the fallback class.
    def interact(function, **controls):  # define a minimal replacement for ipywidgets.interact.
        values = {name: control.value for name, control in controls.items()}  # extract defaults from fallback controls.
        return function(**values)  # run the target function once so the code still executes.
np.random.seed(221)  # seed NumPy's legacy random API for reproducibility.
RNG = np.random.default_rng(221)  # create a modern random generator for explicit sampling.
plt.style.use("seaborn-v0_8-whitegrid")  # choose a clean plotting style with visible grids.
COLORS = plt.cm.tab10.colors  # reuse a stable categorical color palette across examples.


def squared_distances_to_centers(X, centers):  # compute the full point-to-centroid squared-distance matrix.
    diff = X[:, None, :] - centers[None, :, :]  # broadcast each point against each centroid.
    distances = np.sum(diff ** 2, axis=2)  # sum squared coordinate differences for each point-centroid pair.
    return distances  # return an array with shape number_of_points by number_of_centroids.


def assign_to_centers(X, centers):  # assign every point to its nearest centroid.
    distances = squared_distances_to_centers(X, centers)  # compute squared distances because k-means minimizes squared Euclidean cost.
    labels = np.argmin(distances, axis=1)  # choose the nearest centroid index for every point.
    return labels  # return hard cluster labels.


def update_centers(X, labels, k, old_centers):  # update centroids to assigned-point means with empty-cluster protection.
    new_centers = old_centers.copy()  # start from old centers so empty clusters can keep their previous location.
    for cluster_id in range(k):  # update one centroid at a time.
        mask = labels == cluster_id  # select points assigned to the current cluster.
        if np.any(mask):  # update only when the cluster has at least one assigned point.
            new_centers[cluster_id] = X[mask].mean(axis=0)  # replace the centroid by the mean of its assigned points.
    return new_centers  # return the updated centroid matrix.


def compute_inertia(X, labels, centers):  # compute the k-means objective value.
    residuals = X - centers[labels]  # subtract each point's assigned centroid.
    inertia = float(np.sum(residuals ** 2))  # sum squared residuals into one scalar loss.
    return inertia  # return the total distortion.


def kmeans_from_scratch(X, k, max_iter=20, random_state=221):  # implement reproducible k-means for teaching.
    local_rng = np.random.default_rng(random_state)  # create a local generator so runs are repeatable.
    initial_indices = local_rng.choice(X.shape[0], size=k, replace=False)  # choose initial centroids from real data points.
    centers = X[initial_indices].copy()  # copy initial centroid coordinates so updates do not mutate X.
    history = []  # store each iteration for process visualizations.
    for iteration in range(max_iter):  # run a bounded number of assignment-update cycles.
        labels = assign_to_centers(X, centers)  # assign each point to the closest current centroid.
        inertia = compute_inertia(X, labels, centers)  # measure the objective before moving centers.
        history.append({"iteration": iteration, "centers": centers.copy(), "labels": labels.copy(), "inertia": inertia})  # save a complete snapshot for plotting.
        new_centers = update_centers(X, labels, k, centers)  # move each centroid to its assigned mean.
        if np.allclose(new_centers, centers):  # stop when the centroid movement is numerically negligible.
            break  # exit the loop because the algorithm has converged.
        centers = new_centers  # accept the updated centroids for the next iteration.
    final_labels = assign_to_centers(X, centers)  # compute labels for the final centroid state.
    final_inertia = compute_inertia(X, final_labels, centers)  # compute the final objective value.
    return centers, final_labels, final_inertia, history  # return model state and process history.


def plot_clusters_2d(X, labels=None, centers=None, title="", ax=None, xlabel="feature 1", ylabel="feature 2"):  # draw a reusable two-dimensional cluster plot.
    ax = plt.gca() if ax is None else ax  # use the current axes unless the caller passes a subplot axes.
    labels_to_plot = np.zeros(X.shape[0], dtype=int) if labels is None else np.asarray(labels)  # create a single color group when labels are absent.
    for label in np.unique(labels_to_plot):  # plot one group at a time so colors are stable.
        mask = labels_to_plot == label  # select points in the current plotted group.
        ax.scatter(X[mask, 0], X[mask, 1], s=38, alpha=0.82, color=COLORS[int(label) % len(COLORS)], label=f"group {label}")  # draw points for this group.
    if centers is not None:  # add centroids when available.
        ax.scatter(centers[:, 0], centers[:, 1], s=260, marker="X", color="black", edgecolor="white", linewidth=1.2, label="centroids")  # mark centroids clearly.
    ax.set_title(title)  # label the plot with the current step.
    ax.set_xlabel(xlabel)  # label the horizontal feature axis.
    ax.set_ylabel(ylabel)  # label the vertical feature axis.
    ax.legend(loc="best", fontsize=8)  # keep colors interpretable.
    return ax  # return axes so callers can annotate further.


def pca_from_scratch(X, n_components):  # implement PCA using centering, covariance, and eigenvectors.
    mean = X.mean(axis=0)  # compute feature means for centering.
    X_centered = X - mean  # subtract means so PCA directions explain variance around the origin.
    covariance = (X_centered.T @ X_centered) / X_centered.shape[0]  # compute the maximum-likelihood covariance matrix.
    eigenvalues, eigenvectors = np.linalg.eigh(covariance)  # use eigh because covariance is symmetric.
    order = np.argsort(eigenvalues)[::-1]  # sort eigenvalues from largest to smallest.
    eigenvalues = eigenvalues[order]  # reorder eigenvalues by explained variance.
    eigenvectors = eigenvectors[:, order]  # reorder eigenvectors to match eigenvalues.
    components = eigenvectors[:, :n_components]  # keep the top requested principal directions.
    scores = X_centered @ components  # project centered data into principal-component coordinates.
    explained = eigenvalues[:n_components] / np.sum(eigenvalues)  # compute explained-variance ratios for retained components.
    return scores, components, eigenvalues, explained, mean, covariance  # return all intermediate objects for teaching.
```

### Data — swappable sources

The single `DATA_SOURCE` switch below supports clean blobs, non-convex moons, and Iris. The `moons` source is deliberately included because k-means struggles on crescent-shaped clusters.

```python
DATA_SOURCE = "blobs"  # choose one source: "blobs", "moons", or "iris".


def load_unsupervised_source(source="blobs", random_state=221):  # load a consistent data bundle for the notebook.
    if source == "blobs":  # use compact Gaussian blobs where k-means assumptions are satisfied.
        X, y = make_blobs(n_samples=360, centers=3, cluster_std=0.75, random_state=random_state)  # generate three spherical clusters.
        feature_names = ["synthetic feature 1", "synthetic feature 2"]  # name the synthetic coordinates.
        description = "three compact Gaussian blobs"  # describe the data geometry.
    elif source == "moons":  # use non-convex data where k-means should fail geometrically.
        X, y = make_moons(n_samples=360, noise=0.07, random_state=random_state)  # generate two interleaving crescents.
        feature_names = ["moon feature 1", "moon feature 2"]  # name the moon coordinates.
        description = "two interleaving moons where k-means struggles"  # describe the failure case.
    elif source == "iris":  # use a classic real tabular dataset.
        iris = load_iris()  # load Iris from scikit-learn without downloading files.
        X = iris.data[:, [0, 2]]  # keep sepal length and petal length for a two-dimensional view.
        y = iris.target  # keep species labels for post-hoc evaluation only.
        feature_names = [iris.feature_names[0], iris.feature_names[2]]  # preserve real feature names.
        description = "Iris sepal length and petal length"  # describe the selected measurements.
    else:  # reject unsupported names early.
        raise ValueError("DATA_SOURCE must be 'blobs', 'moons', or 'iris'.")  # explain the valid switch values.
    return X, y, feature_names, description  # return features, hidden labels, names, and description.


X_data, y_hidden, feature_names, data_description = load_unsupervised_source(DATA_SOURCE)  # load the selected dataset.
print(f"Loaded {data_description} with shape {X_data.shape}.")  # print the dataset size for orientation.
print("Feature means:", np.round(X_data.mean(axis=0), 3))  # show means because centering and centroids depend on them.
print("Feature standard deviations:", np.round(X_data.std(axis=0), 3))  # show scales because Euclidean distance is scale-sensitive.
```

```python
plt.figure(figsize=(6.5, 5.2))  # create a first-look scatter plot.
plt.scatter(X_data[:, 0], X_data[:, 1], s=42, alpha=0.82, color="slateblue")  # draw the points without labels to respect the unsupervised setting.
plt.title(f"Raw unlabeled data: {data_description}")  # identify which source the switch loaded.
plt.xlabel(feature_names[0])  # label the first displayed feature.
plt.ylabel(feature_names[1])  # label the second displayed feature.
plt.show()  # render the raw data before any algorithm is applied.
```

▶ What you'll see: `blobs` shows compact groups, `iris` shows partially separated real measurements, and `moons` shows curved clusters that k-means will split poorly.

### 📖 Concept walkthrough — build each idea from scratch

Before the warm-up examples, we build the two core unsupervised-learning ideas from scratch, one small step at a time. Everything here uses only NumPy + Matplotlib and tiny inline data, so every assignment, centroid, covariance entry, eigenvector, projection, and variance ratio is inspectable. Variables carry a `_w` suffix so they never collide with the examples below.

```python
import numpy as np  # NumPy gives us arrays, distances, means, covariance matrices, and eigenvectors.
import matplotlib.pyplot as plt  # Matplotlib lets us see clusters, distortion curves, PCA directions, and projections.
np.random.seed(221)  # fix randomness so every printed value and figure is reproducible.
```

#### 1. k-means: assign $\rightarrow$ update loop

k-means starts with centroids, assigns each point to the nearest centroid, then moves each centroid to the mean of the points assigned to it. We build the loop by hand because the important idea is not the code length; it is that both steps reduce the same distortion

$$
J=\sum_i \lVert x^{(i)}-\mu_{c^{(i)}}\rVert^2.
$$

The mean is the optimal centroid for squared distance because differentiating $\sum_i \lVert x^{(i)}-\mu\rVert^2$ with respect to $\mu$ gives $2m\mu-2\sum_i x^{(i)}=0$, so $\mu=\frac{1}{m}\sum_i x^{(i)}$. The assignment step chooses the best centroid with $\mu$ fixed, and the update step chooses the best $\mu$ with assignments fixed, so the distortion cannot increase.

```python
X_loop_w = np.array([[0.8, 1.0], [1.2, 0.7], [1.0, 1.3], [4.7, 4.9], [5.2, 5.1], [4.9, 5.4]])  # create two tiny 2-D blobs.
centroids_loop_w = np.array([[0.0, 0.0], [6.0, 6.0]])  # start with deliberately imperfect centroids so movement is visible.
print("points:\n", X_loop_w)  # inspect the raw unlabeled data.
print("initial centroids:\n", centroids_loop_w)  # inspect the starting representatives.
```
▶ What you'll see: six unlabeled points in two obvious groups, with two centroids that begin outside the group centers.

```python
distances_loop_w = np.sum((X_loop_w[:, None, :] - centroids_loop_w[None, :, :]) ** 2, axis=2)  # compute squared distance from every point to every centroid.
assignments_loop_w = np.argmin(distances_loop_w, axis=1)  # assign each point to the centroid with the smallest squared distance.
print("squared distances (points x centroids):\n", np.round(distances_loop_w, 3))  # inspect the assignment evidence.
print("assignments:", assignments_loop_w)  # inspect the chosen cluster index for each point.
```
▶ What you'll see: each row has two costs, and the smaller cost determines whether the point joins cluster 0 or cluster 1.

```python
updated_loop_w = np.array([X_loop_w[assignments_loop_w == j].mean(axis=0) for j in range(2)])  # update each centroid to the mean of its assigned points.
old_J_loop_w = float(np.sum((X_loop_w - centroids_loop_w[assignments_loop_w]) ** 2))  # compute distortion with old centroids and fixed assignments.
new_J_loop_w = float(np.sum((X_loop_w - updated_loop_w[assignments_loop_w]) ** 2))  # compute distortion after the mean update.
print("updated centroids:\n", np.round(updated_loop_w, 3))  # inspect where the means land.
print("J before update:", round(old_J_loop_w, 3))  # print the cost before moving centroids.
print("J after update :", round(new_J_loop_w, 3))  # print the cost after moving centroids.
```
▶ What you'll see: centroids jump to the middle of their assigned points, and distortion drops immediately.

```python
centroids_run_w = np.array([[0.0, 0.0], [6.0, 6.0]])  # restart from the same initial centroids for a full recorded run.
history_loop_w = []  # store the distortion after each full assign-update iteration.
for step_loop_w in range(5):  # run a few iterations because this tiny dataset converges quickly.
    distances_run_w = np.sum((X_loop_w[:, None, :] - centroids_run_w[None, :, :]) ** 2, axis=2)  # recompute all squared distances.
    labels_run_w = np.argmin(distances_run_w, axis=1)  # assign points to their nearest current centroid.
    centroids_run_w = np.array([X_loop_w[labels_run_w == j].mean(axis=0) for j in range(2)])  # update centroids to assigned means.
    history_loop_w.append(float(np.sum((X_loop_w - centroids_run_w[labels_run_w]) ** 2)))  # record the new distortion value.
print("distortion per iteration:", np.round(history_loop_w, 3))  # verify the values are non-increasing.
print("final centroids:\n", np.round(centroids_run_w, 3))  # inspect the final cluster representatives.
```
▶ What you'll see: the distortion decreases and then flattens once the assignments stop changing.

```python
fig_loop_w, ax_loop_w = plt.subplots(1, 2, figsize=(8.0, 3.4))  # create one panel for clusters and one for the cost curve.
ax_loop_w[0].scatter(X_loop_w[:, 0], X_loop_w[:, 1], c=labels_run_w, cmap="viridis", s=90, edgecolors="black")  # draw points colored by final assignment.
ax_loop_w[0].scatter(centroids_run_w[:, 0], centroids_run_w[:, 1], marker="X", s=220, c="red", edgecolors="white", label="centroids")  # draw final centroids.
ax_loop_w[0].set_title("1: k-means final clusters")  # title the cluster geometry panel.
ax_loop_w[0].set_xlabel("feature 1")  # label the horizontal feature.
ax_loop_w[0].set_ylabel("feature 2")  # label the vertical feature.
ax_loop_w[0].legend()  # show the centroid marker meaning.
ax_loop_w[1].plot(range(1, len(history_loop_w) + 1), history_loop_w, marker="o", color="purple")  # draw distortion across iterations.
ax_loop_w[1].set_title("1: distortion decreases")  # title the cost panel.
ax_loop_w[1].set_xlabel("iteration")  # label the iteration axis.
ax_loop_w[1].set_ylabel("distortion J")  # label the objective value.
plt.tight_layout()  # keep the two panels from overlapping.
plt.show()  # render the k-means loop figure.
```
▶ What you'll see: two compact clusters with red centroids, plus a distortion curve that only moves downward or stays flat.

*Why it's done this way: k-means is coordinate descent on the squared-distance objective — nearest-centroid assignment is optimal for fixed centroids, and the mean is optimal for fixed assignments — so each loop monotonically lowers distortion until a local minimum is reached.*

#### 2. Choosing $k$: inertia and the elbow

The number of clusters $k$ is a modeling choice, not something k-means discovers by itself. We compute the inertia

$$
\sum_i \lVert x^{(i)}-\mu_{c^{(i)}}\rVert^2
$$

for $k=1,2,3,4,5$ to see how the within-cluster sum of squares changes. Inertia always drops as $k$ increases because extra centroids give the optimizer more freedom: it can always imitate the smaller-$k$ solution and ignore the extra center, or use it to reduce distances further. The elbow is the point where the next centroid buys much less improvement, suggesting a useful tradeoff between simplicity and fit.

```python
X_elbow_w = np.array([[0.0, 0.2], [0.4, -0.1], [-0.3, 0.0], [3.0, 3.2], [3.4, 2.9], [2.8, 3.1], [6.0, 0.2], [6.3, -0.2], [5.7, 0.0]])  # create three tiny 2-D groups.
print("candidate data shape:", X_elbow_w.shape)  # inspect the small dataset size.
print("first three points:\n", X_elbow_w[:3])  # inspect one visible blob.
```
▶ What you'll see: nine points arranged as three small groups, but still with no labels supplied to the algorithm.

```python
def run_kmeans_elbow_w(X_input_w, k_input_w, steps_input_w=8):  # define a small deterministic k-means helper for elbow testing.
    centers_input_w = X_input_w[np.linspace(0, len(X_input_w) - 1, k_input_w, dtype=int)].copy()  # initialize centers from spread-out data points.
    for iter_input_w in range(steps_input_w):  # repeat assign-update enough times for this tiny dataset.
        dist_input_w = np.sum((X_input_w[:, None, :] - centers_input_w[None, :, :]) ** 2, axis=2)  # compute squared distances to centers.
        labels_input_w = np.argmin(dist_input_w, axis=1)  # assign each point to its closest center.
        centers_input_w = np.array([X_input_w[labels_input_w == j].mean(axis=0) if np.any(labels_input_w == j) else centers_input_w[j] for j in range(k_input_w)])  # update nonempty centers to means.
    inertia_input_w = float(np.sum((X_input_w - centers_input_w[labels_input_w]) ** 2))  # compute final within-cluster sum of squares.
    return inertia_input_w, centers_input_w, labels_input_w  # return the score and fitted clustering.
```

```python
ks_elbow_w = np.arange(1, 6)  # test k values from 1 through 5.
inertias_elbow_w = []  # collect one inertia value per k.
for k_elbow_w in ks_elbow_w:  # loop over candidate cluster counts.
    inertia_elbow_w, centers_elbow_w, labels_elbow_w = run_kmeans_elbow_w(X_elbow_w, k_elbow_w)  # fit the scratch k-means helper.
    inertias_elbow_w.append(inertia_elbow_w)  # store the final inertia.
    print("k =", k_elbow_w, "inertia =", round(inertia_elbow_w, 3))  # inspect the score for this k.
```
▶ What you'll see: inertia falls for every larger $k$, with a large improvement up to the natural cluster count and smaller gains afterward.

```python
best3_inertia_w, best3_centers_w, best3_labels_w = run_kmeans_elbow_w(X_elbow_w, 3)  # compute the k=3 solution for visualization.
fig_elbow_w, ax_elbow_w = plt.subplots(1, 2, figsize=(8.2, 3.4))  # create one panel for clusters and one for the elbow curve.
ax_elbow_w[0].scatter(X_elbow_w[:, 0], X_elbow_w[:, 1], c=best3_labels_w, cmap="tab10", s=90, edgecolors="black")  # draw the k=3 cluster assignments.
ax_elbow_w[0].scatter(best3_centers_w[:, 0], best3_centers_w[:, 1], marker="X", s=220, c="red", edgecolors="white")  # draw the k=3 centroids.
ax_elbow_w[0].set_title("2: k=3 clustering")  # title the fitted clustering panel.
ax_elbow_w[0].set_xlabel("feature 1")  # label the horizontal feature.
ax_elbow_w[0].set_ylabel("feature 2")  # label the vertical feature.
ax_elbow_w[1].plot(ks_elbow_w, inertias_elbow_w, marker="o", color="darkorange")  # draw inertia as a function of k.
ax_elbow_w[1].set_title("2: elbow in inertia")  # title the elbow panel.
ax_elbow_w[1].set_xlabel("number of clusters k")  # label the model-complexity axis.
ax_elbow_w[1].set_ylabel("total inertia")  # label the within-cluster squared error.
ax_elbow_w[1].set_xticks(ks_elbow_w)  # show each tested k as a tick.
plt.tight_layout()  # keep subplot labels readable.
plt.show()  # render the elbow figure.
```
▶ What you'll see: the left plot shows three natural groups, while the right plot bends sharply around $k=3$.

*Why it's done this way: inertia is the exact k-means objective, so plotting it against $k$ reveals how much objective improvement each extra centroid buys; the elbow chooses the smallest $k$ after the biggest gains have already been captured.*

#### 3. PCA: centering, covariance, and eigenvectors

PCA first centers every feature because variance should describe spread around the data mean, not distance from the origin. For centered data matrix $X$, the covariance matrix is

$$
\Sigma=\frac{1}{m}X^\top X.
$$

An eigenvector $u$ of $\Sigma$ points in a direction whose variance is $u^\top\Sigma u$; the largest eigenvalue $\lambda_1$ gives the largest possible variance over all unit directions. That is why the top eigenvector is the maximum-variance direction.

```python
t_base_w = np.linspace(-2.0, 2.0, 9)  # create one latent coordinate that will drive correlation.
X_pca_w = np.column_stack([t_base_w, 0.75 * t_base_w + np.array([-0.3, 0.1, -0.1, 0.2, 0.0, -0.2, 0.1, -0.1, 0.3])])  # build a small correlated 2-D cloud.
mean_pca_w = X_pca_w.mean(axis=0)  # compute the feature means for centering.
X_centered_w = X_pca_w - mean_pca_w  # subtract the mean so PCA studies spread around zero.
print("feature mean:", np.round(mean_pca_w, 3))  # inspect the center of the cloud.
print("first centered rows:\n", np.round(X_centered_w[:3], 3))  # inspect centered coordinates.
```
▶ What you'll see: the centered rows are the original points shifted so the cloud has mean zero.

```python
Sigma_pca_w = (X_centered_w.T @ X_centered_w) / len(X_centered_w)  # compute the 2x2 covariance matrix from scratch.
eigvals_pca_w, eigvecs_pca_w = np.linalg.eigh(Sigma_pca_w)  # eigen-decompose the symmetric covariance matrix.
order_pca_w = np.argsort(eigvals_pca_w)[::-1]  # sort eigenvalues from largest to smallest.
eigvals_pca_w = eigvals_pca_w[order_pca_w]  # reorder eigenvalues so lambda_1 comes first.
eigvecs_pca_w = eigvecs_pca_w[:, order_pca_w]  # reorder matching eigenvectors.
print("Sigma:\n", np.round(Sigma_pca_w, 3))  # inspect covariance entries.
print("eigenvalues:", np.round(eigvals_pca_w, 3))  # inspect variances along principal directions.
print("eigenvectors:\n", np.round(eigvecs_pca_w, 3))  # inspect the principal directions as columns.
```
▶ What you'll see: one eigenvalue is much larger, matching the long direction of the correlated cloud.

```python
origin_pca_w = mean_pca_w  # draw eigenvectors starting at the original data mean.
scale1_pca_w = np.sqrt(eigvals_pca_w[0])  # scale the first eigenvector by one standard deviation.
scale2_pca_w = np.sqrt(eigvals_pca_w[1])  # scale the second eigenvector by one standard deviation.
plt.figure(figsize=(5.4, 4.4))  # create a square-ish PCA geometry plot.
plt.scatter(X_pca_w[:, 0], X_pca_w[:, 1], s=80, color="slateblue", edgecolors="black", label="data")  # draw the correlated cloud.
plt.scatter(origin_pca_w[0], origin_pca_w[1], s=120, color="black", marker="+", label="mean")  # draw the data mean.
plt.arrow(origin_pca_w[0], origin_pca_w[1], scale1_pca_w * eigvecs_pca_w[0, 0], scale1_pca_w * eigvecs_pca_w[1, 0], width=0.025, color="crimson", length_includes_head=True, label="PC1")  # draw the top eigenvector scaled by sqrt(lambda_1).
plt.arrow(origin_pca_w[0], origin_pca_w[1], scale2_pca_w * eigvecs_pca_w[0, 1], scale2_pca_w * eigvecs_pca_w[1, 1], width=0.025, color="darkgreen", length_includes_head=True, label="PC2")  # draw the second eigenvector scaled by sqrt(lambda_2).
plt.title("3: PCA eigenvectors scaled by sqrt(lambda)")  # title the covariance-eigenvector plot.
plt.xlabel("feature 1")  # label the horizontal feature.
plt.ylabel("feature 2")  # label the vertical feature.
plt.axis("equal")  # use equal units so directions and lengths are not distorted.
plt.legend()  # show data, mean, and principal-component labels.
plt.show()  # render the eigenvector figure.
```
▶ What you'll see: the red vector follows the long axis of the cloud, and the green vector points across the short axis.

*Why it's done this way: centering makes covariance measure spread, $\Sigma$ summarizes all pairwise feature co-movement, and eigenvectors reveal the orthogonal directions where that spread is largest and smallest.*

#### 4. PCA: projection and variance explained

After PCA finds the top direction $u_1$, a one-dimensional representation is just the dot product of each centered point with that direction:

$$
y_i=x_i^\top u_1.
$$

The eigenvalue $\lambda_1$ is the variance captured because $\operatorname{Var}(Xu_1)=u_1^\top\Sigma u_1=\lambda_1$ when $u_1$ is a unit eigenvector. The explained-variance ratio in two dimensions is therefore $\frac{\lambda_1}{\lambda_1+\lambda_2}$.

```python
u1_proj_w = eigvecs_pca_w[:, 0]  # choose the top eigenvector from the previous PCA subsection.
scores_proj_w = X_centered_w @ u1_proj_w  # project each centered point onto the one-dimensional PC1 axis.
reconstructed_proj_w = np.outer(scores_proj_w, u1_proj_w) + mean_pca_w  # map 1-D scores back to the original 2-D space for plotting.
ratio_proj_w = eigvals_pca_w[0] / np.sum(eigvals_pca_w)  # compute lambda_1 divided by total variance.
print("PC1 direction:", np.round(u1_proj_w, 3))  # inspect the projection direction.
print("1-D scores:", np.round(scores_proj_w, 3))  # inspect the compressed coordinate for each point.
print("variance explained by PC1:", round(ratio_proj_w, 3))  # inspect the fraction of variance captured.
```
▶ What you'll see: each 2-D point becomes one scalar score, and PC1 captures most of the variance.

```python
captured_variance_w = float(np.var(scores_proj_w))  # compute the variance of the projected scores directly.
print("variance of projected scores:", round(captured_variance_w, 3))  # inspect the empirical variance after projection.
print("lambda_1:", round(float(eigvals_pca_w[0]), 3))  # compare it to the top eigenvalue.
print("match?", np.allclose(captured_variance_w, eigvals_pca_w[0]))  # verify eigenvalue equals captured variance under 1/m covariance.
```
▶ What you'll see: the projected-score variance matches $\lambda_1$, confirming what the eigenvalue means.

```python
fig_proj_w, ax_proj_w = plt.subplots(1, 2, figsize=(8.4, 3.6))  # create one panel for 2-D projection and one for 1-D scores.
ax_proj_w[0].scatter(X_pca_w[:, 0], X_pca_w[:, 1], s=70, color="slateblue", edgecolors="black", label="original")  # draw original points.
ax_proj_w[0].scatter(reconstructed_proj_w[:, 0], reconstructed_proj_w[:, 1], s=55, color="crimson", label="on PC1")  # draw points after projection back to the PC1 line.
for i_proj_w in range(len(X_pca_w)):  # connect each original point to its PC1 reconstruction.
    ax_proj_w[0].plot([X_pca_w[i_proj_w, 0], reconstructed_proj_w[i_proj_w, 0]], [X_pca_w[i_proj_w, 1], reconstructed_proj_w[i_proj_w, 1]], color="gray", alpha=0.45)  # show the information lost by 1-D projection.
ax_proj_w[0].set_title("4: projection onto PC1")  # title the 2-D projection panel.
ax_proj_w[0].set_xlabel("feature 1")  # label the horizontal feature.
ax_proj_w[0].set_ylabel("feature 2")  # label the vertical feature.
ax_proj_w[0].axis("equal")  # preserve geometric distances.
ax_proj_w[0].legend()  # identify original and projected points.
ax_proj_w[1].scatter(scores_proj_w, np.zeros_like(scores_proj_w), s=80, color="crimson", edgecolors="black")  # draw the compressed data on a one-dimensional axis.
ax_proj_w[1].axhline(0.0, color="black", linewidth=1)  # draw the PC1 number line.
ax_proj_w[1].set_yticks([])  # hide the meaningless vertical coordinate.
ax_proj_w[1].set_xlabel("PC1 score")  # label the compressed coordinate.
ax_proj_w[1].set_title(f"4: 1-D projection, {ratio_proj_w:.0%} variance")  # title the one-dimensional representation.
plt.tight_layout()  # prevent panel labels from overlapping.
plt.show()  # render the PCA projection figure.
```
▶ What you'll see: each point drops onto the PC1 line, and the right panel shows the resulting one-dimensional coordinates.

*Why it's done this way: projecting onto the top eigenvector keeps the direction with maximum variance, and the eigenvalue ratio tells us exactly how much of the original spread survives in the compressed representation.*

### 🟢 Basics (warm-up)

#### B1. Compute squared distance from one point to one centroid

**Goal.** Practice the atomic cost term inside the k-means objective.

```python
point_b1 = np.array([2.0, 1.0])  # define one feature vector for the data point.
centroid_b1 = np.array([5.0, 5.0])  # define one candidate cluster centroid.
difference_b1 = point_b1 - centroid_b1  # compute coordinate-wise offsets from centroid to point.
squared_distance_b1 = np.sum(difference_b1 ** 2)  # square the offsets and add them to get squared Euclidean distance.
print("point:", point_b1)  # print the point coordinates.
print("centroid:", centroid_b1)  # print the centroid coordinates.
print("coordinate differences:", difference_b1)  # print the offsets that will be squared.
print("squared distance:", squared_distance_b1)  # print the scalar k-means cost contribution.
```

```python
plt.figure(figsize=(5.2, 4.2))  # create a compact geometric check.
plt.scatter(point_b1[0], point_b1[1], s=100, color="slateblue", label="point")  # draw the point.
plt.scatter(centroid_b1[0], centroid_b1[1], s=180, marker="X", color="black", label="centroid")  # draw the centroid as an X marker.
plt.plot([point_b1[0], centroid_b1[0]], [point_b1[1], centroid_b1[1]], linestyle="--", color="gray")  # connect the two coordinates with the measured segment.
plt.title("B1: one squared point-to-centroid distance")  # title the warm-up plot.
plt.xlabel("feature 1")  # label the horizontal axis.
plt.ylabel("feature 2")  # label the vertical axis.
plt.legend()  # identify markers.
plt.show()  # render the distance geometry.
```

▶ What you'll see: one point, one centroid, and a dashed segment whose squared length is $(-3)^2+(-4)^2=25$.

👀 **Takeaway.** k-means is built from many small squared-distance calculations.

#### B2. Assign one point to the nearest of two centroids

**Goal.** Practice the k-means assignment step $z_i=\arg\min_j\|\phi(x_i)-\mu_j\|^2$.

```python
point_b2 = np.array([2.0, 1.0])  # define the point to assign.
centroids_b2 = np.array([[0.0, 0.0], [5.0, 5.0]])  # define two candidate centroids.
distances_b2 = np.sum((centroids_b2 - point_b2) ** 2, axis=1)  # compute one squared distance to each centroid.
chosen_b2 = int(np.argmin(distances_b2))  # choose the centroid with the smallest squared distance.
print("squared distances to centroids:", distances_b2)  # print both candidate costs.
print("assigned centroid index:", chosen_b2)  # print the winning cluster index.
```

```python
plt.figure(figsize=(5.2, 4.2))  # create a visual assignment comparison.
plt.scatter(point_b2[0], point_b2[1], s=100, color="slateblue", label="point")  # draw the point being assigned.
plt.scatter(centroids_b2[:, 0], centroids_b2[:, 1], s=180, marker="X", color=["orange", "black"], label="centroids")  # draw both centroids.
plt.plot([point_b2[0], centroids_b2[0, 0]], [point_b2[1], centroids_b2[0, 1]], linestyle="--", color="orange")  # show distance to centroid 0.
plt.plot([point_b2[0], centroids_b2[1, 0]], [point_b2[1], centroids_b2[1, 1]], linestyle="--", color="black")  # show distance to centroid 1.
plt.title("B2: assign to the nearer centroid")  # title the assignment plot.
plt.xlabel("feature 1")  # label the horizontal axis.
plt.ylabel("feature 2")  # label the vertical axis.
plt.legend()  # identify plotted objects.
plt.show()  # render the assignment decision.
```

▶ What you'll see: the shorter dashed segment goes to centroid 0, so the hard assignment is cluster 0.

👀 **Takeaway.** The assignment step is an `argmin` over candidate centroids.

#### B3. Center a tiny matrix column by column for PCA

**Goal.** Practice the first PCA operation: subtract each feature mean.

```python
X_b3 = np.array([[1.0, 2.0], [3.0, 4.0], [5.0, 8.0]])  # create a tiny three-point, two-feature matrix.
column_means_b3 = X_b3.mean(axis=0)  # compute one mean per feature column.
X_centered_b3 = X_b3 - column_means_b3  # subtract column means so every feature has mean zero.
print("original matrix:\n", X_b3)  # print the raw data matrix.
print("column means:", column_means_b3)  # print the vector subtracted from every row.
print("centered matrix:\n", X_centered_b3)  # print the centered data used by PCA.
print("centered column means:", X_centered_b3.mean(axis=0))  # verify that centering produced zero means.
```

👀 **Takeaway.** PCA finds variance directions after moving the data cloud to be centered at the origin.


#### B4. Recompute one centroid mean

**Goal.** Practice the k-means update step for one cluster.

```python
points_b4 = np.array([[1.0, 2.0], [3.0, 4.0], [5.0, 6.0]])  # collect three points assigned to one cluster.
centroid_b4 = points_b4.mean(axis=0)  # average each coordinate to recompute the cluster centroid.
print("assigned points:\n", points_b4)  # show the points that belong to this cluster.
print("new centroid:", centroid_b4)  # show the coordinate-wise mean.
```

👀 **Takeaway.** A centroid update is just a coordinate-wise mean of assigned points.

#### B5. Compute total inertia for assigned points

**Goal.** Add several squared point-to-centroid costs into the k-means objective.

```python
X_b5 = np.array([[0.0, 0.0], [1.0, 0.0], [4.0, 4.0]])  # define three tiny data points.
labels_b5 = np.array([0, 0, 1])  # assign the first two points to centroid 0 and the last to centroid 1.
centers_b5 = np.array([[0.0, 0.0], [5.0, 4.0]])  # define two fixed centroids.
residuals_b5 = X_b5 - centers_b5[labels_b5]  # subtract each point's assigned centroid.
per_point_b5 = np.sum(residuals_b5 ** 2, axis=1)  # compute each point's squared contribution.
inertia_b5 = per_point_b5.sum()  # add contributions into total inertia.
print("per-point squared costs:", per_point_b5)  # display the objective terms.
print("total inertia:", inertia_b5)  # display the summed k-means loss.
```

👀 **Takeaway.** Inertia is the sum of all assigned squared distances.

#### B6. Compute covariance of two centered features

**Goal.** Practice the matrix PCA diagonalizes.

```python
X_b6 = np.array([[-1.0, -2.0], [0.0, 0.0], [1.0, 2.0]])  # define centered two-feature data.
cov_b6 = (X_b6.T @ X_b6) / X_b6.shape[0]  # compute covariance using the PCA convention from the lesson.
print("centered data:\n", X_b6)  # show the centered rows.
print("covariance matrix:\n", cov_b6)  # show variances on the diagonal and covariance off diagonal.
```

👀 **Takeaway.** PCA uses covariance to measure how features vary together.

#### B7. Project one point onto one axis

**Goal.** Compute a one-dimensional PCA coordinate by a dot product.

```python
point_b7 = np.array([3.0, 4.0])  # define one centered point.
axis_b7 = np.array([0.6, 0.8])  # define a unit direction to project onto.
score_b7 = point_b7 @ axis_b7  # take a dot product to get the coordinate along the axis.
print("point:", point_b7)  # show the original centered point.
print("unit axis:", axis_b7)  # show the projection direction.
print("projected coordinate:", score_b7)  # show the one-dimensional PCA-style score.
```

👀 **Takeaway.** Projection onto a principal component is a dot product with a unit axis.

#### B8. Compute variance explained by one component

**Goal.** Convert eigenvalues into explained-variance ratios.

```python
eigenvalues_b8 = np.array([6.0, 3.0, 1.0])  # list variances captured by three principal directions.
ratios_b8 = eigenvalues_b8 / eigenvalues_b8.sum()  # divide each variance by total variance.
print("eigenvalues:", eigenvalues_b8)  # show component variances.
print("explained variance ratios:", ratios_b8)  # show the fraction captured by each component.
print("PC1 percent:", ratios_b8[0] * 100)  # show the first component as a percent.
```

👀 **Takeaway.** Explained variance is a normalized share of total variance.

#### B9. Run one k-means assignment-update iteration

**Goal.** Combine one assignment step with one centroid update on a tiny dataset.

```python
X_b9 = np.array([[0.0, 0.0], [0.0, 2.0], [5.0, 5.0], [6.0, 5.0]])  # create four easy-to-see points.
centers_b9 = np.array([[0.0, 1.0], [5.0, 4.0]])  # choose two initial centroids.
labels_b9 = assign_to_centers(X_b9, centers_b9)  # assign every point to its nearest current centroid.
updated_b9 = update_centers(X_b9, labels_b9, k=2, old_centers=centers_b9)  # move centroids to assigned means.
print("labels after assignment:", labels_b9)  # show the hard cluster choices.
print("updated centers:\n", updated_b9)  # show the centroids after one update.
```

👀 **Takeaway.** One k-means iteration is assignment followed by averaging.

#### B10. Build a distance matrix for three points

**Goal.** See all pairwise distances in one small table.

```python
X_b10 = np.array([[0.0, 0.0], [3.0, 4.0], [6.0, 8.0]])  # define three points with familiar 3-4-5 distances.
diff_b10 = X_b10[:, None, :] - X_b10[None, :, :]  # broadcast each point against every other point.
distance_matrix_b10 = np.sqrt(np.sum(diff_b10 ** 2, axis=2))  # convert squared coordinate differences to Euclidean distances.
print("distance matrix:\n", distance_matrix_b10)  # display all pairwise distances.
```

👀 **Takeaway.** Distance matrices are built by comparing every point to every point.

### 🟡 Easy Examples

#### E1. k-means from scratch on three clean blobs

**Goal.** Build k-means on clean blobs so every line maps to the objective, assignment step, and update step.

```python
X_e1, y_e1, _, _ = load_unsupervised_source("blobs", random_state=221)  # load compact spherical clusters.
k_e1 = 3  # choose three clusters because the synthetic data was generated with three blob centers.
plt.figure(figsize=(6.2, 5.0))  # create a starting-state plot.
plt.scatter(X_e1[:, 0], X_e1[:, 1], s=38, alpha=0.82, color="gray")  # show unlabeled data before fitting.
plt.title("E1 step 1: clean blobs before k-means")  # title the raw-data step.
plt.xlabel("feature 1")  # label the horizontal axis.
plt.ylabel("feature 2")  # label the vertical axis.
plt.show()  # render the starting point cloud.
```

▶ What you'll see: three compact gray groups, exactly the geometry k-means expects.

```python
initial_indices_e1 = RNG.choice(X_e1.shape[0], size=k_e1, replace=False)  # choose three data rows as initial centroid locations.
centers_e1 = X_e1[initial_indices_e1].copy()  # copy initial centers so updates are independent of the original data.
plt.figure(figsize=(6.2, 5.0))  # create an initialization plot.
plot_clusters_2d(X_e1, labels=None, centers=centers_e1, title="E1 step 2: random centroid initialization")  # show starting centroids.
plt.show()  # render initial centroids.
```

▶ What you'll see: black X markers begin at random data points rather than at perfect cluster centers.

```python
distances_e1 = squared_distances_to_centers(X_e1, centers_e1)  # compute every point-to-centroid squared distance.
labels_e1 = np.argmin(distances_e1, axis=1)  # assign each point to its nearest current centroid.
first_inertia_e1 = compute_inertia(X_e1, labels_e1, centers_e1)  # compute the objective after assignment with fixed centers.
print(f"First-assignment inertia: {first_inertia_e1:.2f}")  # print the starting distortion value.
plt.figure(figsize=(6.2, 5.0))  # create an assignment plot.
plot_clusters_2d(X_e1, labels=labels_e1, centers=centers_e1, title="E1 step 3: nearest-centroid assignment")  # show hard assignments.
plt.show()  # render the first assignment state.
```

▶ What you'll see: colors form Voronoi-like regions around the current centroids, even if they do not yet match the natural blobs.

```python
new_centers_e1 = update_centers(X_e1, labels_e1, k_e1, centers_e1)  # update each centroid to the mean of its assigned points.
updated_inertia_e1 = compute_inertia(X_e1, labels_e1, new_centers_e1)  # compute the objective after moving centroids.
print(f"Inertia after centroid update: {updated_inertia_e1:.2f}")  # show that moving to means reduces squared error.
plt.figure(figsize=(6.2, 5.0))  # create an update plot.
plot_clusters_2d(X_e1, labels=labels_e1, centers=new_centers_e1, title="E1 step 4: centroid update to assigned means")  # show updated centroids.
plt.show()  # render the updated centroid state.
```

▶ What you'll see: black X markers jump toward the centers of their colored assigned groups.

```python
centers_final_e1, labels_final_e1, inertia_final_e1, history_e1 = kmeans_from_scratch(X_e1, k=3, max_iter=8, random_state=221)  # run the complete teaching implementation.
fig, axes = plt.subplots(2, 3, figsize=(15, 8))  # create a grid for the first six iterations.
for ax, snapshot in zip(axes.ravel(), history_e1[:6]):  # draw one saved state per subplot.
    plot_clusters_2d(X_e1, labels=snapshot["labels"], centers=snapshot["centers"], title=f"iter {snapshot['iteration']}, J={snapshot['inertia']:.0f}", ax=ax)  # show assignments and centers.
plt.tight_layout()  # prevent subplot labels from overlapping.
plt.show()  # render the k-means process.
```

▶ What you'll see: the centroids move less each iteration, the colors stabilize, and the displayed objective decreases.

```python
silhouette_e1 = silhouette_score(X_e1, labels_final_e1)  # compute compactness-versus-separation for the final clustering.
plt.figure(figsize=(6.5, 5.2))  # create the final result plot.
plot_clusters_2d(X_e1, labels=labels_final_e1, centers=centers_final_e1, title=f"E1 final: inertia={inertia_final_e1:.1f}, silhouette={silhouette_e1:.2f}")  # show final clusters and metrics.
plt.show()  # render the final clustering.
print("Inertia trace:", [round(s["inertia"], 1) for s in history_e1])  # print the objective trajectory.
```

▶ What you'll see: three colored blobs with centroids near their centers and a high silhouette score.

👀 **Takeaway.** k-means is the repeated loop of distance assignment and assigned-mean centroid updates.

#### E2. One k-means iteration microscope

**Goal.** Slow down one iteration on a hand-sized array to inspect the distance matrix, assignments, and centroid update arrows.

```python
X_e2 = np.array([[0.0, 0.0], [0.5, 0.2], [4.0, 4.0], [4.5, 3.8], [8.0, 0.0], [8.5, 0.3]])  # create six easy-to-read points.
centers_e2 = np.array([[0.0, 1.0], [5.0, 4.0], [7.0, 1.0]])  # choose three initial centroids.
plt.figure(figsize=(6.2, 4.8))  # create the initial tiny-data plot.
plot_clusters_2d(X_e2, labels=np.zeros(X_e2.shape[0], dtype=int), centers=centers_e2, title="E2 step 1: tiny data and starting centroids")  # show points and centers.
plt.show()  # render the tiny setup.
```

▶ What you'll see: six points arranged near three rough groups, with centroids slightly offset from them.

```python
distance_matrix_e2 = squared_distances_to_centers(X_e2, centers_e2)  # compute the full distance matrix for one assignment step.
distance_table_e2 = pd.DataFrame(distance_matrix_e2, columns=["centroid 0", "centroid 1", "centroid 2"])  # format distances as a readable table.
print(distance_table_e2.round(2))  # print rounded distances so the nearest centroid can be checked by eye.
```

```python
plt.figure(figsize=(6.8, 4.5))  # create a heatmap canvas.
plt.imshow(distance_matrix_e2, cmap="viridis")  # color the squared-distance matrix.
plt.colorbar(label="squared distance")  # add a colorbar so dark and bright values are interpretable.
plt.xticks(np.arange(3), ["centroid 0", "centroid 1", "centroid 2"])  # label distance columns.
plt.yticks(np.arange(X_e2.shape[0]), [f"point {i}" for i in range(X_e2.shape[0])])  # label point rows.
plt.title("E2 step 2: distance matrix heatmap")  # title the matrix view.
plt.show()  # render the heatmap.
```

▶ What you'll see: each row's darkest cell marks the nearest centroid for that point.

```python
labels_e2 = np.argmin(distance_matrix_e2, axis=1)  # convert each distance row into a nearest-centroid assignment.
assignment_table_e2 = pd.DataFrame({"x1": X_e2[:, 0], "x2": X_e2[:, 1], "assigned cluster": labels_e2})  # collect assignments in a readable table.
print(assignment_table_e2)  # display the assignment table.
plt.figure(figsize=(6.2, 4.8))  # create an assignment visualization.
plot_clusters_2d(X_e2, labels=labels_e2, centers=centers_e2, title="E2 step 3: assignments before update")  # show tiny-data assignments.
plt.show()  # render assignment colors.
```

▶ What you'll see: the table and plot agree; nearby point pairs share the same cluster color.

```python
new_centers_e2 = update_centers(X_e2, labels_e2, k=3, old_centers=centers_e2)  # compute the assigned-point mean for each cluster.
print(pd.DataFrame(new_centers_e2, columns=["new x1", "new x2"]).round(2))  # print the updated centroid coordinates.
plt.figure(figsize=(6.2, 4.8))  # create an update-arrow plot.
plot_clusters_2d(X_e2, labels=labels_e2, centers=new_centers_e2, title="E2 step 4: centroid update arrows")  # show new centers after update.
for old, new in zip(centers_e2, new_centers_e2):  # draw one arrow per centroid.
    plt.arrow(old[0], old[1], new[0] - old[0], new[1] - old[1], color="black", width=0.03, length_includes_head=True)  # show movement from old center to new mean.
plt.show()  # render the update arrows.
```

▶ What you'll see: each centroid arrow points toward the average location of its assigned points.

```python
old_inertia_e2 = compute_inertia(X_e2, labels_e2, centers_e2)  # measure distortion before the centroid update.
new_inertia_e2 = compute_inertia(X_e2, labels_e2, new_centers_e2)  # measure distortion after the centroid update with labels fixed.
print(f"old inertia = {old_inertia_e2:.2f}")  # print pre-update distortion.
print(f"new inertia = {new_inertia_e2:.2f}")  # print post-update distortion.
```

👀 **Takeaway.** A single k-means iteration is transparent: distance matrix → `argmin` assignments → cluster means.

#### E3. Choosing $k$ with inertia and silhouette

**Goal.** Sweep $k=1,\ldots,8$ and compare the elbow curve with silhouette scores.

```python
X_e3, y_e3, _, _ = load_unsupervised_source("blobs", random_state=225)  # load clean blobs while pretending the true k is hidden.
k_values_e3 = np.arange(1, 9)  # define candidate cluster counts from one to eight.
inertias_e3 = []  # store k-means inertia for each candidate k.
silhouettes_e3 = []  # store silhouette for each candidate k where it is defined.
for k in k_values_e3:  # fit one model for each candidate k.
    model_e3 = KMeans(n_clusters=int(k), init="k-means++", n_init=20, random_state=221)  # use robust restarts for each k.
    labels_e3 = model_e3.fit_predict(X_e3)  # fit and label the same dataset.
    inertias_e3.append(model_e3.inertia_)  # record the distortion objective.
    silhouettes_e3.append(np.nan if k == 1 else silhouette_score(X_e3, labels_e3))  # compute silhouette only for at least two clusters.
print(pd.DataFrame({"k": k_values_e3, "inertia": np.round(inertias_e3, 1), "silhouette": np.round(silhouettes_e3, 3)}))  # print the model-selection table.
```

```python
fig, axes = plt.subplots(1, 2, figsize=(12, 4.8))  # create side-by-side metric plots.
axes[0].plot(k_values_e3, inertias_e3, marker="o", linewidth=2.5)  # plot inertia against k.
axes[0].axvline(3, color="crimson", linestyle="--", label="elbow near 3")  # mark the expected elbow.
axes[0].set_title("E3 step 1: inertia elbow")  # title the inertia panel.
axes[0].set_xlabel("k")  # label the cluster-count axis.
axes[0].set_ylabel("inertia")  # label the objective axis.
axes[0].legend()  # identify the elbow marker.
axes[1].plot(k_values_e3[1:], silhouettes_e3[1:], marker="o", linewidth=2.5, color="seagreen")  # plot silhouette for k>=2.
axes[1].axvline(3, color="crimson", linestyle="--", label="best simple choice")  # mark the selected k.
axes[1].set_title("E3 step 2: silhouette by k")  # title the silhouette panel.
axes[1].set_xlabel("k")  # label the cluster-count axis.
axes[1].set_ylabel("mean silhouette")  # label the separation metric.
axes[1].legend()  # identify the chosen k marker.
plt.tight_layout()  # prevent panel overlap.
plt.show()  # render both model-selection curves.
```

▶ What you'll see: inertia decreases for every larger $k$, while silhouette peaks around the natural three-cluster solution.

```python
chosen_k_e3 = 3  # choose k=3 based on the elbow and silhouette evidence.
model_final_e3 = KMeans(n_clusters=chosen_k_e3, init="k-means++", n_init=30, random_state=221)  # configure the final selected model.
labels_final_e3 = model_final_e3.fit_predict(X_e3)  # fit the chosen k-means model.
score_final_e3 = silhouette_score(X_e3, labels_final_e3)  # compute final silhouette.
plt.figure(figsize=(6.5, 5.2))  # create the chosen-k plot.
plot_clusters_2d(X_e3, labels=labels_final_e3, centers=model_final_e3.cluster_centers_, title=f"E3 final: k={chosen_k_e3}, silhouette={score_final_e3:.2f}")  # show selected clustering.
plt.show()  # render the final selected-k clusters.
```

▶ What you'll see: three compact groups, matching both the elbow and the silhouette evidence.

👀 **Takeaway.** Inertia alone always rewards larger $k$; silhouette helps judge separation as well as compactness.

#### E4. PCA on a tilted 2-D cloud

**Goal.** Implement PCA from scratch on a correlated cloud and draw the principal axes.

```python
mean_e4 = np.array([0.0, 0.0])  # set the Gaussian mean at the origin before sampling.
cov_e4 = np.array([[3.0, 2.4], [2.4, 2.2]])  # define a covariance matrix with a strong tilted direction.
X_e4 = RNG.multivariate_normal(mean_e4, cov_e4, size=320)  # sample a tilted two-dimensional cloud.
plt.figure(figsize=(6.2, 5.2))  # create the raw correlated-data plot.
plt.scatter(X_e4[:, 0], X_e4[:, 1], s=32, alpha=0.55, color="gray")  # show the uncentered correlated cloud.
plt.title("E4 step 1: tilted 2-D cloud")  # title the raw PCA input.
plt.xlabel("x1")  # label the first coordinate.
plt.ylabel("x2")  # label the second coordinate.
plt.axis("equal")  # use equal scaling so directions are not visually distorted.
plt.show()  # render the tilted cloud.
```

▶ What you'll see: an elongated ellipse of points, suggesting one high-variance diagonal direction.

```python
scores_e4, components_e4, eigenvalues_e4, explained_e4, mean_fit_e4, covariance_e4 = pca_from_scratch(X_e4, n_components=2)  # run from-scratch PCA.
print("mean:", np.round(mean_fit_e4, 3))  # print the fitted mean used for centering.
print("covariance:\n", np.round(covariance_e4, 3))  # print the covariance matrix whose eigenvectors define PCA.
print("eigenvalues:", np.round(eigenvalues_e4, 3))  # print variances along principal directions.
print("explained variance ratios:", np.round(explained_e4, 3))  # print variance fractions for PC1 and PC2.
```

```python
X_centered_e4 = X_e4 - mean_fit_e4  # center the cloud for plotting axes through the empirical mean.
plt.figure(figsize=(6.2, 5.2))  # create the principal-axis plot.
plt.scatter(X_e4[:, 0], X_e4[:, 1], s=32, alpha=0.45, color="gray")  # draw the original cloud.
for idx in range(2):  # draw PC1 and PC2 as arrows.
    direction = components_e4[:, idx] * np.sqrt(eigenvalues_e4[idx]) * 2.0  # scale each eigenvector by its standard deviation for visibility.
    plt.arrow(mean_fit_e4[0], mean_fit_e4[1], direction[0], direction[1], color=COLORS[idx], width=0.035, length_includes_head=True, label=f"PC{idx+1}")  # draw the positive principal direction.
    plt.arrow(mean_fit_e4[0], mean_fit_e4[1], -direction[0], -direction[1], color=COLORS[idx], width=0.035, length_includes_head=True)  # draw the negative principal direction.
plt.scatter(mean_fit_e4[0], mean_fit_e4[1], s=130, marker="X", color="black", label="mean")  # mark the empirical mean.
plt.title("E4 step 2: covariance eigenvectors as principal axes")  # title the axis visualization.
plt.xlabel("x1")  # label the first coordinate.
plt.ylabel("x2")  # label the second coordinate.
plt.axis("equal")  # preserve angle geometry.
plt.legend()  # identify principal components.
plt.show()  # render principal axes.
```

▶ What you'll see: PC1 points along the elongated direction, while PC2 points across the thinner direction.

```python
projection_onto_pc1_e4 = scores_e4[:, [0]] @ components_e4[:, [0]].T + mean_fit_e4  # reconstruct each point using only PC1.
plt.figure(figsize=(6.2, 5.2))  # create a projection plot.
plt.scatter(X_e4[:, 0], X_e4[:, 1], s=28, alpha=0.35, color="gray", label="original")  # draw original points faintly.
plt.scatter(projection_onto_pc1_e4[:, 0], projection_onto_pc1_e4[:, 1], s=28, alpha=0.65, color="darkorange", label="projection onto PC1")  # draw one-dimensional projections.
plt.title(f"E4 final: PC1 explains {explained_e4[0]:.1%} of variance")  # title with explained variance.
plt.xlabel("x1")  # label the first coordinate.
plt.ylabel("x2")  # label the second coordinate.
plt.axis("equal")  # keep geometry faithful.
plt.legend()  # distinguish original and projected points.
plt.show()  # render the projection result.
```

▶ What you'll see: projected points collapse onto one diagonal line while preserving most variation along the cloud.

👀 **Takeaway.** PCA is centering plus covariance eigendecomposition; the top eigenvector is the maximum-variance direction.

#### E5. PCA compression and reconstruction on digits

**Goal.** Compress handwritten digit images with PCA and reconstruct them with different component counts.

```python
digits_e5 = load_digits()  # load 8-by-8 handwritten digit images from scikit-learn.
X_e5 = digits_e5.data  # use flattened 64-pixel vectors as high-dimensional features.
y_e5 = digits_e5.target  # keep digit identities only for plot titles and later coloring.
X_scaled_e5 = X_e5 / 16.0  # scale pixel intensities from 0..16 into 0..1 for stable visualization.
print("digits feature matrix shape:", X_scaled_e5.shape)  # print number of images and features.
```

```python
pca_full_e5 = PCA(n_components=64, random_state=221)  # create a full PCA model to inspect all variance directions.
pca_full_e5.fit(X_scaled_e5)  # fit PCA on flattened digit images.
cumulative_e5 = np.cumsum(pca_full_e5.explained_variance_ratio_)  # accumulate explained variance as components are added.
plt.figure(figsize=(7.0, 4.8))  # create the explained-variance curve.
plt.plot(np.arange(1, 65), cumulative_e5, marker="o", markersize=3, linewidth=2)  # show cumulative explained variance.
plt.axhline(0.90, color="crimson", linestyle="--", label="90% variance")  # mark a common compression target.
plt.title("E5 step 1: explained variance for digit PCA")  # title the variance curve.
plt.xlabel("number of principal components")  # label the component-count axis.
plt.ylabel("cumulative explained variance")  # label the variance axis.
plt.legend()  # identify the target line.
plt.show()  # render the variance curve.
```

▶ What you'll see: the curve rises quickly at first, showing that many 64-pixel images can be summarized with far fewer directions.

```python
sample_indices_e5 = np.array([0, 1, 2, 3, 4, 5])  # choose six example digits for reconstruction comparisons.
component_choices_e5 = [2, 8, 16, 32]  # choose increasingly rich PCA compression levels.
fig, axes = plt.subplots(len(component_choices_e5) + 1, len(sample_indices_e5), figsize=(10, 7.5))  # create a grid for originals and reconstructions.
for col, idx in enumerate(sample_indices_e5):  # draw original images in the first row.
    axes[0, col].imshow(X_scaled_e5[idx].reshape(8, 8), cmap="gray_r", vmin=0, vmax=1)  # show the original digit image.
    axes[0, col].set_title(f"true {y_e5[idx]}")  # title each original with its digit label.
    axes[0, col].axis("off")  # hide axes for image readability.
for row, n_components in enumerate(component_choices_e5, start=1):  # reconstruct with each component count.
    pca_e5 = PCA(n_components=n_components, random_state=221)  # create a PCA compressor with the chosen dimension.
    Z_e5 = pca_e5.fit_transform(X_scaled_e5)  # project all digits into the lower-dimensional PCA space.
    X_recon_e5 = pca_e5.inverse_transform(Z_e5)  # reconstruct the digits back into 64-pixel space.
    for col, idx in enumerate(sample_indices_e5):  # draw each reconstructed sample.
        axes[row, col].imshow(X_recon_e5[idx].reshape(8, 8), cmap="gray_r", vmin=0, vmax=1)  # show the reconstructed digit.
        axes[row, col].set_title(f"{n_components} PCs")  # label the compression level.
        axes[row, col].axis("off")  # hide axes for image readability.
plt.tight_layout()  # prevent image titles from overlapping.
plt.show()  # render the reconstruction grid.
```

▶ What you'll see: two components capture rough style, while 16–32 components recover much sharper digit shapes.

```python
errors_e5 = []  # store reconstruction mean squared error for each component count.
for n_components in range(1, 65):  # evaluate all possible PCA dimensions for 64-pixel digits.
    pca_e5 = PCA(n_components=n_components, random_state=221)  # create a PCA model for this dimension.
    Z_e5 = pca_e5.fit_transform(X_scaled_e5)  # compress digits into n_components coordinates.
    X_recon_e5 = pca_e5.inverse_transform(Z_e5)  # reconstruct back to pixel space.
    errors_e5.append(np.mean((X_scaled_e5 - X_recon_e5) ** 2))  # record average reconstruction error.
plt.figure(figsize=(7.0, 4.8))  # create the reconstruction-error plot.
plt.plot(np.arange(1, 65), errors_e5, linewidth=2.5, color="darkorange")  # show error decreasing as components increase.
plt.title("E5 final: PCA reconstruction error")  # title the compression metric plot.
plt.xlabel("number of principal components")  # label the PCA dimension axis.
plt.ylabel("mean squared reconstruction error")  # label the reconstruction error axis.
plt.show()  # render the error curve.
```

▶ What you'll see: reconstruction error decreases monotonically as more principal components are retained.

👀 **Takeaway.** PCA gives a controllable compression knob: fewer components mean smaller representations but blurrier reconstructions.

### 🔴 Advanced Examples

#### A1. Failure case: k-means on non-convex clusters

**Goal.** Use a from-scratch k-means run to show why centroid-based Voronoi geometry fails on moons.

```python
X_a1, y_a1, _, _ = load_unsupervised_source("moons", random_state=221)  # load non-convex crescent clusters.
centers_a1, labels_a1, inertia_a1, history_a1 = kmeans_from_scratch(X_a1, k=2, max_iter=8, random_state=224)  # run from-scratch k-means with the correct number of groups.
ari_a1 = adjusted_rand_score(y_a1, labels_a1)  # compare k-means labels to the hidden crescent identities after fitting.
sil_a1 = silhouette_score(X_a1, labels_a1)  # compute internal separation for the centroid split.
print(f"k-means on moons: inertia={inertia_a1:.1f}, silhouette={sil_a1:.2f}, ARI={ari_a1:.2f}")  # report both internal and external diagnostics.
```

```python
fig, axes = plt.subplots(1, min(5, len(history_a1)), figsize=(17, 3.8))  # create an iteration strip for the failure case.
for ax, snapshot in zip(np.ravel(axes), history_a1[:5]):  # draw the first few iterations.
    plot_clusters_2d(X_a1, labels=snapshot["labels"], centers=snapshot["centers"], title=f"iter {snapshot['iteration']}", ax=ax)  # show centroid-driven partitions.
plt.tight_layout()  # keep subplot titles readable.
plt.show()  # render centroid movement on moons.
```

▶ What you'll see: centroids settle into positions that create a roughly straight boundary through two curved crescents.

```python
fig, axes = plt.subplots(1, 2, figsize=(12, 5))  # create a side-by-side failure diagnosis.
plot_clusters_2d(X_a1, labels=labels_a1, centers=centers_a1, title=f"k-means result, ARI={ari_a1:.2f}", ax=axes[0])  # show the learned centroid clusters.
plot_clusters_2d(X_a1, labels=y_a1, centers=None, title="hidden true crescent structure", ax=axes[1])  # show true moons only for diagnosis.
plt.tight_layout()  # prevent panel overlap.
plt.show()  # render the comparison.
```

▶ What you'll see: k-means cuts the space into convex regions instead of following each crescent's curved shape.

```python
xx_a1, yy_a1 = np.meshgrid(np.linspace(X_a1[:, 0].min() - 0.5, X_a1[:, 0].max() + 0.5, 250), np.linspace(X_a1[:, 1].min() - 0.5, X_a1[:, 1].max() + 0.5, 250))  # create a grid covering the moon data.
grid_a1 = np.c_[xx_a1.ravel(), yy_a1.ravel()]  # flatten the grid into coordinate rows.
grid_labels_a1 = assign_to_centers(grid_a1, centers_a1).reshape(xx_a1.shape)  # assign every grid point to the nearest centroid.
plt.figure(figsize=(6.8, 5.2))  # create the Voronoi-region plot.
plt.contourf(xx_a1, yy_a1, grid_labels_a1, alpha=0.18, levels=np.arange(3) - 0.5, colors=[COLORS[0], COLORS[1]])  # shade nearest-centroid regions.
plot_clusters_2d(X_a1, labels=labels_a1, centers=centers_a1, title="A1 final: Voronoi geometry cannot bend")  # overlay points and centroids.
plt.show()  # render the decision-region failure.
```

▶ What you'll see: the shaded k-means regions are separated by a straight-ish boundary, not by crescent connectivity.

👀 **Takeaway.** k-means assumes clusters are well represented by centroids; non-convex shapes violate that assumption.

#### A2. Feature scaling changes both k-means and PCA

**Goal.** Show that arbitrary units can dominate distances for k-means and variances for PCA.

```python
wine_a2 = load_wine()  # load a real multi-feature dataset with different measurement units.
X_a2 = wine_a2.data  # use all chemical measurements.
y_a2 = wine_a2.target  # keep cultivar labels only for post-hoc agreement checks.
feature_names_a2 = np.array(wine_a2.feature_names)  # keep feature names for interpretation.
raw_scales_a2 = X_a2.std(axis=0)  # compute raw feature standard deviations.
print(pd.DataFrame({"feature": feature_names_a2, "raw std": np.round(raw_scales_a2, 2)}).head(8))  # show several raw scales.
```

```python
raw_model_a2 = KMeans(n_clusters=3, init="k-means++", n_init=30, random_state=221)  # configure k-means on raw units.
raw_labels_a2 = raw_model_a2.fit_predict(X_a2)  # fit k-means before scaling.
raw_ari_a2 = adjusted_rand_score(y_a2, raw_labels_a2)  # compare raw-unit clusters to cultivars after fitting.
raw_pca_a2 = PCA(n_components=2, random_state=221)  # create PCA for raw-unit visualization.
raw_scores_a2 = raw_pca_a2.fit_transform(X_a2)  # project raw features into two PCs.
print("raw k-means ARI:", round(raw_ari_a2, 3))  # print raw clustering agreement.
print("raw PCA explained variance:", np.round(raw_pca_a2.explained_variance_ratio_, 3))  # print raw PCA variance dominance.
```

```python
scaler_a2 = StandardScaler()  # create a standardizer for zero mean and unit variance.
X_scaled_a2 = scaler_a2.fit_transform(X_a2)  # standardize all wine features.
scaled_model_a2 = KMeans(n_clusters=3, init="k-means++", n_init=30, random_state=221)  # configure k-means on standardized features.
scaled_labels_a2 = scaled_model_a2.fit_predict(X_scaled_a2)  # fit k-means after scaling.
scaled_ari_a2 = adjusted_rand_score(y_a2, scaled_labels_a2)  # compare standardized clusters to cultivars after fitting.
scaled_pca_a2 = PCA(n_components=2, random_state=221)  # create PCA for scaled visualization.
scaled_scores_a2 = scaled_pca_a2.fit_transform(X_scaled_a2)  # project standardized features into two PCs.
print("scaled k-means ARI:", round(scaled_ari_a2, 3))  # print scaled clustering agreement.
print("scaled PCA explained variance:", np.round(scaled_pca_a2.explained_variance_ratio_, 3))  # print scaled PCA variance distribution.
```

```python
fig, axes = plt.subplots(1, 2, figsize=(12.5, 5))  # create raw-versus-scaled PCA comparison panels.
axes[0].scatter(raw_scores_a2[:, 0], raw_scores_a2[:, 1], c=raw_labels_a2, cmap="tab10", s=45, alpha=0.85)  # show raw-unit PCA colored by raw k-means clusters.
axes[0].set_title(f"raw units: ARI={raw_ari_a2:.2f}")  # title raw-unit result.
axes[0].set_xlabel("raw PC1")  # label raw first PC.
axes[0].set_ylabel("raw PC2")  # label raw second PC.
axes[1].scatter(scaled_scores_a2[:, 0], scaled_scores_a2[:, 1], c=scaled_labels_a2, cmap="tab10", s=45, alpha=0.85)  # show scaled PCA colored by scaled k-means clusters.
axes[1].set_title(f"standardized: ARI={scaled_ari_a2:.2f}")  # title scaled result.
axes[1].set_xlabel("scaled PC1")  # label scaled first PC.
axes[1].set_ylabel("scaled PC2")  # label scaled second PC.
plt.tight_layout()  # prevent panel overlap.
plt.show()  # render raw versus scaled comparison.
```

▶ What you'll see: the PCA map and cluster assignments change after standardization because distance and variance now treat features more equally.

```python
plt.figure(figsize=(7.2, 4.8))  # create a metric comparison figure.
plt.bar(["raw units", "standardized"], [raw_ari_a2, scaled_ari_a2], color=["tomato", "seagreen"])  # compare cluster-label agreement before and after scaling.
plt.ylim(0, 1)  # use a fixed score range for interpretability.
plt.title("A2 final: scaling changes k-means quality")  # title the result.
plt.ylabel("Adjusted Rand Index vs hidden cultivar")  # label the external diagnostic metric.
plt.show()  # render the ARI comparison.
```

▶ What you'll see: standardized features usually align better with the known cultivars because no unit dominates by magnitude alone.

👀 **Takeaway.** For both k-means and PCA, preprocessing is part of the model: different scaling means different geometry.

#### A3. PCA as AI feature visualization

**Goal.** Treat digit images as high-dimensional AI feature vectors and visualize them in two PCA coordinates.

```python
digits_a3 = load_digits()  # load high-dimensional digit feature vectors.
X_a3 = digits_a3.data / 16.0  # scale pixel intensities into the 0..1 range.
y_a3 = digits_a3.target  # keep digit labels only for coloring the final visualization.
X_scaled_a3 = StandardScaler().fit_transform(X_a3)  # standardize pixels before covariance-based PCA.
scores_a3, components_a3, eigenvalues_a3, explained_a3, mean_a3, covariance_a3 = pca_from_scratch(X_scaled_a3, n_components=2)  # run from-scratch PCA to two dimensions.
print("covariance shape:", covariance_a3.shape)  # print the 64-by-64 covariance shape.
print("top eigenvalues:", np.round(eigenvalues_a3[:5], 3))  # print the largest variance directions.
print("top-2 explained variance:", np.round(explained_a3, 3))  # print how much variance the 2-D view keeps.
```

```python
fig, axes = plt.subplots(1, 2, figsize=(8, 3.8))  # create side-by-side component-image panels.
axes[0].imshow(components_a3[:, 0].reshape(8, 8), cmap="coolwarm")  # display PC1 loadings as an 8-by-8 image.
axes[0].set_title("A3 step 1: PC1 loading image")  # title the PC1 loading plot.
axes[0].axis("off")  # hide image axes.
axes[1].imshow(components_a3[:, 1].reshape(8, 8), cmap="coolwarm")  # display PC2 loadings as an 8-by-8 image.
axes[1].set_title("A3 step 2: PC2 loading image")  # title the PC2 loading plot.
axes[1].axis("off")  # hide image axes.
plt.tight_layout()  # keep titles readable.
plt.show()  # render component images.
```

▶ What you'll see: each principal component is a signed pixel pattern that captures a major way digits vary.

```python
plt.figure(figsize=(8.2, 6.5))  # create the 2-D PCA feature map.
scatter_a3 = plt.scatter(scores_a3[:, 0], scores_a3[:, 1], c=y_a3, cmap="tab10", s=18, alpha=0.78)  # plot each digit in PC1-PC2 space colored by hidden digit label.
plt.colorbar(scatter_a3, ticks=np.arange(10), label="hidden digit label")  # add a legend-like colorbar for digits.
plt.title("A3 final: digits visualized with from-scratch PCA")  # title the PCA feature visualization.
plt.xlabel(f"PC1 ({explained_a3[0]:.1%} variance)")  # label PC1 with explained variance.
plt.ylabel(f"PC2 ({explained_a3[1]:.1%} variance)")  # label PC2 with explained variance.
plt.show()  # render the high-dimensional feature map.
```

▶ What you'll see: some digits form partially separated regions, while visually similar digits overlap in this two-dimensional view.

👀 **Takeaway.** PCA turns high-dimensional feature vectors into a map humans can inspect, but a 2-D projection cannot preserve every distinction.

#### A4. Cluster in PCA space vs original space

**Goal.** Compare k-means on standardized digit features with k-means after PCA compression.

```python
X_a4 = X_scaled_a3  # reuse standardized digit features from A3.
y_a4 = y_a3  # reuse hidden digit labels only for post-hoc diagnostics.
component_grid_a4 = [2, 5, 10, 20, 40, 64]  # test a sweep of PCA dimensions before k-means.
rows_a4 = []  # store metrics for each PCA dimension.
for n_components in component_grid_a4:  # fit PCA and k-means at each dimension.
    pca_a4 = PCA(n_components=n_components, random_state=221)  # create a PCA reducer for the current dimension.
    Z_a4 = pca_a4.fit_transform(X_a4)  # project standardized digit features.
    labels_a4 = KMeans(n_clusters=10, init="k-means++", n_init=20, random_state=221).fit_predict(Z_a4)  # cluster the PCA representation into ten groups.
    rows_a4.append({"components": n_components, "variance": pca_a4.explained_variance_ratio_.sum(), "silhouette": silhouette_score(Z_a4, labels_a4), "ARI": adjusted_rand_score(y_a4, labels_a4)})  # record unsupervised and post-hoc metrics.
metrics_a4 = pd.DataFrame(rows_a4)  # convert results to a readable table.
print(metrics_a4.round(3))  # display the PCA-dimension sweep.
```

```python
fig, axes = plt.subplots(1, 3, figsize=(15, 4.6))  # create metric sweep panels.
axes[0].plot(metrics_a4["components"], metrics_a4["variance"], marker="o", linewidth=2.4)  # plot retained variance.
axes[0].set_title("retained PCA variance")  # title variance panel.
axes[0].set_xlabel("PCA components")  # label x-axis.
axes[0].set_ylabel("variance ratio")  # label y-axis.
axes[1].plot(metrics_a4["components"], metrics_a4["silhouette"], marker="o", linewidth=2.4, color="seagreen")  # plot silhouette after clustering.
axes[1].set_title("k-means silhouette")  # title silhouette panel.
axes[1].set_xlabel("PCA components")  # label x-axis.
axes[1].set_ylabel("silhouette")  # label y-axis.
axes[2].plot(metrics_a4["components"], metrics_a4["ARI"], marker="o", linewidth=2.4, color="darkorange")  # plot post-hoc agreement with digit labels.
axes[2].set_title("ARI vs hidden digits")  # title ARI panel.
axes[2].set_xlabel("PCA components")  # label x-axis.
axes[2].set_ylabel("ARI")  # label y-axis.
plt.tight_layout()  # prevent panel overlap.
plt.show()  # render the PCA-dimension sweep.
```

▶ What you'll see: very low-dimensional PCA is easy to plot but can discard information useful for clustering.

```python
pca_view_a4 = PCA(n_components=2, random_state=221)  # create a fixed 2-D PCA map for visualization.
Z_view_a4 = pca_view_a4.fit_transform(X_a4)  # project digits to two plotting coordinates.
labels_original_a4 = KMeans(n_clusters=10, init="k-means++", n_init=20, random_state=221).fit_predict(X_a4)  # cluster in the original standardized 64-D space.
labels_pca10_a4 = KMeans(n_clusters=10, init="k-means++", n_init=20, random_state=221).fit_predict(PCA(n_components=10, random_state=221).fit_transform(X_a4))  # cluster after ten PCA components.
fig, axes = plt.subplots(1, 2, figsize=(13, 5.2))  # create side-by-side maps.
axes[0].scatter(Z_view_a4[:, 0], Z_view_a4[:, 1], c=labels_original_a4, cmap="tab10", s=18, alpha=0.78)  # color the map by original-space clusters.
axes[0].set_title("clusters learned in original 64-D space")  # title original-space clustering.
axes[0].set_xlabel("PC1 for display")  # label display PC1.
axes[0].set_ylabel("PC2 for display")  # label display PC2.
axes[1].scatter(Z_view_a4[:, 0], Z_view_a4[:, 1], c=labels_pca10_a4, cmap="tab10", s=18, alpha=0.78)  # color the same map by PCA-space clusters.
axes[1].set_title("clusters learned after 10-D PCA")  # title PCA-space clustering.
axes[1].set_xlabel("PC1 for display")  # label display PC1.
axes[1].set_ylabel("PC2 for display")  # label display PC2.
plt.tight_layout()  # keep maps readable.
plt.show()  # render the cluster-space comparison.
```

▶ What you'll see: clustering in different spaces can produce different labels even when displayed on the same 2-D PCA map.

```python
ari_original_a4 = adjusted_rand_score(y_a4, labels_original_a4)  # compute post-hoc agreement for original-space clusters.
ari_pca10_a4 = adjusted_rand_score(y_a4, labels_pca10_a4)  # compute post-hoc agreement for PCA-space clusters.
sil_original_a4 = silhouette_score(X_a4, labels_original_a4)  # compute silhouette in original standardized space.
sil_pca10_a4 = silhouette_score(PCA(n_components=10, random_state=221).fit_transform(X_a4), labels_pca10_a4)  # compute silhouette in ten-dimensional PCA space.
print(f"original 64-D: silhouette={sil_original_a4:.3f}, ARI={ari_original_a4:.3f}")  # print original-space metrics.
print(f"10-D PCA: silhouette={sil_pca10_a4:.3f}, ARI={ari_pca10_a4:.3f}")  # print PCA-space metrics.
```

👀 **Takeaway.** PCA can denoise and compress before clustering, but too few components can merge structure that k-means might need.

#### A5. End-to-end unsupervised pipeline with upload/url option

**Goal.** Build a complete tabular pipeline: load, clean, scale, PCA, choose $k$, cluster, and profile clusters.

```python
PIPELINE_SOURCE = "wine"  # choose "wine", "upload", or "url"; upload/url fall back to wine in this offline lesson.

def load_pipeline_table(source="wine"):  # load a tabular feature matrix for the capstone pipeline.
    if source == "wine":  # use the built-in wine dataset for a reliable offline run.
        data = load_wine()  # load wine measurements from scikit-learn.
        frame = pd.DataFrame(data.data, columns=data.feature_names)  # convert features to a named DataFrame.
        hidden_labels = data.target  # keep cultivars only for optional post-hoc diagnostics.
        note = "built-in wine dataset"  # describe the actual source.
    elif source == "upload":  # provide the branch a learner would replace in a real Colab upload.
        data = load_wine()  # use wine as a runnable fallback instead of requiring a file prompt.
        frame = pd.DataFrame(data.data, columns=data.feature_names)  # create the same DataFrame shape as a CSV load would produce.
        hidden_labels = data.target  # keep optional diagnostics available.
        note = "upload fallback: built-in wine dataset"  # make the fallback explicit.
    elif source == "url":  # provide the branch a learner would replace with pd.read_csv(url).
        data = load_wine()  # use wine as a runnable fallback so the notebook needs no internet.
        frame = pd.DataFrame(data.data, columns=data.feature_names)  # create a tabular feature DataFrame.
        hidden_labels = data.target  # keep optional diagnostics available.
        note = "url fallback: built-in wine dataset"  # make the fallback explicit.
    else:  # reject unsupported options.
        raise ValueError("PIPELINE_SOURCE must be 'wine', 'upload', or 'url'.")  # explain valid options.
    return frame, hidden_labels, note  # return the table, hidden labels, and source description.


frame_a5, hidden_a5, note_a5 = load_pipeline_table(PIPELINE_SOURCE)  # load the capstone table.
print(note_a5)  # print which branch actually loaded.
print(frame_a5.head())  # inspect the first rows of the feature table.
```

```python
numeric_frame_a5 = frame_a5.select_dtypes(include=[np.number]).copy()  # keep numeric columns because k-means and PCA require numeric features.
numeric_frame_a5 = numeric_frame_a5.fillna(numeric_frame_a5.median(numeric_only=True))  # fill missing values with medians for a simple robust cleaning step.
scaler_a5 = StandardScaler()  # create a standardizer for the full pipeline.
X_scaled_a5 = scaler_a5.fit_transform(numeric_frame_a5)  # standardize all numeric features.
print("pipeline matrix shape:", X_scaled_a5.shape)  # print rows and columns after cleaning.
print("max absolute scaled mean:", np.abs(X_scaled_a5.mean(axis=0)).max().round(6))  # verify centering numerically.
```

```python
pca_a5 = PCA(n_components=min(5, X_scaled_a5.shape[1]), random_state=221)  # fit enough components for visualization and variance inspection.
Z_a5 = pca_a5.fit_transform(X_scaled_a5)  # project standardized features into PCA space.
plt.figure(figsize=(7.0, 4.8))  # create explained-variance bar plot.
plt.bar(np.arange(1, len(pca_a5.explained_variance_ratio_) + 1), pca_a5.explained_variance_ratio_, color="steelblue")  # show variance per component.
plt.plot(np.arange(1, len(pca_a5.explained_variance_ratio_) + 1), np.cumsum(pca_a5.explained_variance_ratio_), marker="o", color="crimson", label="cumulative")  # overlay cumulative variance.
plt.title("A5 step 1: PCA variance in the pipeline")  # title the PCA diagnostic.
plt.xlabel("principal component")  # label component axis.
plt.ylabel("explained variance ratio")  # label variance axis.
plt.legend()  # identify cumulative curve.
plt.show()  # render the variance diagnostic.
```

▶ What you'll see: the first few PCs explain a substantial share of standardized tabular variance, but not all of it.

```python
k_values_a5 = np.arange(2, 8)  # test a practical range of cluster counts.
inertias_a5 = []  # store distortion values.
silhouettes_a5 = []  # store silhouette values.
for k in k_values_a5:  # fit the full pipeline clustering for each k.
    model_a5 = KMeans(n_clusters=int(k), init="k-means++", n_init=30, random_state=221)  # configure a robust k-means model.
    labels_a5 = model_a5.fit_predict(X_scaled_a5)  # cluster standardized original features.
    inertias_a5.append(model_a5.inertia_)  # record inertia for elbow reasoning.
    silhouettes_a5.append(silhouette_score(X_scaled_a5, labels_a5))  # record silhouette for compactness and separation.
print(pd.DataFrame({"k": k_values_a5, "inertia": np.round(inertias_a5, 1), "silhouette": np.round(silhouettes_a5, 3)}))  # print candidate-k metrics.
```

```python
fig, axes = plt.subplots(1, 2, figsize=(12, 4.8))  # create candidate-k diagnostic panels.
axes[0].plot(k_values_a5, inertias_a5, marker="o", linewidth=2.4)  # draw inertia curve.
axes[0].set_title("A5 step 2: inertia by k")  # title the inertia diagnostic.
axes[0].set_xlabel("k")  # label cluster-count axis.
axes[0].set_ylabel("inertia")  # label objective axis.
axes[1].plot(k_values_a5, silhouettes_a5, marker="o", linewidth=2.4, color="seagreen")  # draw silhouette curve.
axes[1].set_title("A5 step 3: silhouette by k")  # title silhouette diagnostic.
axes[1].set_xlabel("k")  # label cluster-count axis.
axes[1].set_ylabel("silhouette")  # label silhouette axis.
plt.tight_layout()  # keep panels readable.
plt.show()  # render k-selection diagnostics.
```

▶ What you'll see: the elbow and silhouette offer practical evidence for choosing a small number of clusters.

```python
chosen_k_a5 = int(k_values_a5[np.argmax(silhouettes_a5)])  # choose the k with highest silhouette in this simple pipeline.
final_model_a5 = KMeans(n_clusters=chosen_k_a5, init="k-means++", n_init=50, random_state=221)  # configure the final capstone clusterer.
final_labels_a5 = final_model_a5.fit_predict(X_scaled_a5)  # fit final clusters in standardized feature space.
profile_a5 = pd.DataFrame(X_scaled_a5, columns=numeric_frame_a5.columns).groupby(final_labels_a5).mean()  # compute standardized feature means by cluster.
print("chosen k:", chosen_k_a5)  # print selected cluster count.
print("cluster sizes:", pd.Series(final_labels_a5).value_counts().sort_index().to_dict())  # print the number of rows in each cluster.
print("post-hoc ARI vs hidden wine labels:", round(adjusted_rand_score(hidden_a5, final_labels_a5), 3))  # print optional external check for this built-in dataset.
```

```python
plt.figure(figsize=(12, 4.8))  # create the cluster-profile heatmap.
plt.imshow(profile_a5.values, aspect="auto", cmap="coolwarm", vmin=-1.5, vmax=1.5)  # display standardized cluster means as colors.
plt.colorbar(label="cluster mean in standardized units")  # add a color scale for interpretation.
plt.xticks(np.arange(profile_a5.shape[1]), profile_a5.columns, rotation=70, ha="right")  # label feature columns.
plt.yticks(np.arange(profile_a5.shape[0]), [f"cluster {i}" for i in profile_a5.index])  # label cluster rows.
plt.title("A5 step 4: cluster profile heatmap")  # title the profile view.
plt.tight_layout()  # prevent feature names from being clipped.
plt.show()  # render the profile heatmap.
```

▶ What you'll see: each row summarizes which standardized features are high or low for that cluster.

```python
plt.figure(figsize=(7.2, 5.6))  # create the final PCA map for the pipeline.
plt.scatter(Z_a5[:, 0], Z_a5[:, 1], c=final_labels_a5, cmap="tab10", s=55, alpha=0.86)  # plot the first two PCs colored by final clusters.
plt.title("A5 final: end-to-end unsupervised pipeline map")  # title the capstone visualization.
plt.xlabel(f"PC1 ({pca_a5.explained_variance_ratio_[0]:.1%} variance)")  # label PC1 with explained variance.
plt.ylabel(f"PC2 ({pca_a5.explained_variance_ratio_[1]:.1%} variance)")  # label PC2 with explained variance.
plt.show()  # render the final pipeline map.
```

▶ What you'll see: clusters occupy different regions of the PCA map, while the heatmap explains what feature patterns define them.

👀 **Takeaway.** A practical unsupervised AI workflow combines cleaning, scaling, PCA inspection, $k$ selection, clustering, and cluster profiling.

### Interactive Experiment

Use the controls to change the number of k-means clusters and the number of PCA components. The plot always shows a two-dimensional view; when `n_components=1`, the second displayed coordinate is set to zero so the one-dimensional projection is still visible.

```python
X_interactive_raw, y_interactive, _, _ = load_unsupervised_source("moons", random_state=221)  # use moons by default so learners can see a failure mode.
X_interactive_scaled = StandardScaler().fit_transform(X_interactive_raw)  # scale the interactive data for consistent PCA and k-means geometry.


def run_interactive(k=2, n_components=2, source="moons"):  # define the function controlled by widgets.
    X_raw, y_hidden_local, _, desc = load_unsupervised_source(source, random_state=221)  # load the selected source each time the widget changes.
    X_scaled = StandardScaler().fit_transform(X_raw)  # standardize the selected data before PCA and k-means.
    n_components_safe = min(n_components, X_scaled.shape[1])  # cap PCA components at the available feature dimension.
    pca_model = PCA(n_components=n_components_safe, random_state=221)  # create the PCA projection model.
    Z = pca_model.fit_transform(X_scaled)  # project data into the requested PCA space.
    if Z.shape[1] == 1:  # handle the one-component display case.
        Z_plot = np.c_[Z[:, 0], np.zeros(Z.shape[0])]  # create a zero vertical coordinate for plotting.
    else:  # handle two-or-more-component display.
        Z_plot = Z[:, :2]  # use the first two PCs for plotting.
    labels = KMeans(n_clusters=k, init="k-means++", n_init=20, random_state=221).fit_predict(X_scaled)  # cluster in standardized original feature space.
    score = silhouette_score(X_scaled, labels) if k > 1 else np.nan  # compute silhouette for valid cluster counts.
    plt.figure(figsize=(7.2, 5.6))  # create the live plot canvas.
    plt.scatter(Z_plot[:, 0], Z_plot[:, 1], c=labels, cmap="tab10", s=45, alpha=0.84)  # show PCA projection colored by k-means cluster.
    plt.title(f"{desc}: k={k}, PCA display dims={n_components_safe}, silhouette={score:.2f}")  # summarize current settings and score.
    plt.xlabel("PC1")  # label the first display coordinate.
    plt.ylabel("PC2 or zero line")  # label the second display coordinate.
    plt.show()  # render the live experiment plot.
    print("Hidden-label ARI for diagnosis only:", round(adjusted_rand_score(y_hidden_local, labels), 3))  # print optional agreement with hidden labels.


interact(run_interactive, source=Dropdown(options=["blobs", "moons", "iris"], value="moons", description="data"), k=IntSlider(value=2, min=2, max=8, step=1, description="k"), n_components=IntSlider(value=2, min=1, max=2, step=1, description="PCA dims"))  # create Colab controls for source, k, and PCA dimension.
```

▶ What you'll see: increasing $k$ can improve or fragment clusters, and `moons` remains difficult because k-means boundaries are centroid-based rather than crescent-shaped.
