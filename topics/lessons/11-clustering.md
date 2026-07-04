# Clustering: EM, k-means, Hierarchical
> **Source:** CS 229 · **Category:** Method · **Type:** 💻 Colab · [↑ Full reference](../../ai-ml-cheatsheets.md)
> 📓 This section is written as a runnable notebook; an `.ipynb` will be generated from it. [![Open In Colab](https://colab.research.google.com/assets/colab-badge.svg)](#)

## 1. Overview

Clustering is the unsupervised-learning task of finding hidden group structure in unlabeled observations $\{x^{(1)},\ldots,x^{(m)}\}$. The key difficulty is that there is no target label to optimize directly, so the algorithm's geometry assumptions decide what counts as a good group.

**One-line intuition:** clustering asks, "Which points naturally belong together?"; k-means answers with spherical distance-to-centroid groups, EM answers with probabilistic soft membership, and hierarchical clustering answers with a nested merge tree.

## 2. Key Idea

### k-means objective and assign $\rightarrow$ update loop

We note $c^{(i)}$ the cluster of data point $i$ and $\mu_j$ the center of cluster $j$. After randomly initializing the cluster centroids $\mu_1,\mu_2,\ldots,\mu_k\in\mathbb{R}^n$, k-means repeats assignment and centroid update until the assignments or centroids stop changing:

$$
c^{(i)}=\operatorname*{argmin}_{j}\left\|x^{(i)}-\mu_j\right\|^2\quad\text{and}\quad \mu_j=\frac{\sum_{i=1}^{m}\mathbf{1}_{\{c^{(i)}=j\}}x^{(i)}}{\sum_{i=1}^{m}\mathbf{1}_{\{c^{(i)}=j\}}}
$$

The distortion function measures the total squared distance from each point to its assigned centroid:

$$
J(c,\mu)=\sum_{i=1}^{m}\left\|x^{(i)}-\mu_{c^{(i)}}\right\|^2
$$

A useful pseudocode version is:

```text
Choose k initial centroids.
Repeat until convergence:
  Assignment step: assign each point to its nearest centroid.
  Update step: replace each centroid by the mean of its assigned points.
Return the final centroids, assignments, and distortion.
```

Each assignment step minimizes $J$ while centroids are fixed; each update step minimizes $J$ while assignments are fixed. Therefore k-means monotonically decreases distortion, though it can still converge to a local minimum.

### EM as soft assignment

Expectation-Maximization (EM) generalizes the hard assignments of k-means. Instead of saying point $x^{(i)}$ belongs to exactly one cluster, EM evaluates posterior probabilities over latent cluster identities:

$$
Q_i(z^{(i)})=P(z^{(i)}\mid x^{(i)};\theta)
$$

Then the M-step uses those posterior probabilities as weights when re-estimating parameters:

$$
\theta_i=\operatorname*{argmax}_{\theta}\sum_i\int_{z^{(i)}}Q_i(z^{(i)})\log\left(\frac{P(x^{(i)},z^{(i)};\theta)}{Q_i(z^{(i)})}\right)dz^{(i)}
$$

For Gaussian mixtures, this means a boundary point can be 55% in one Gaussian and 45% in another; k-means would force the same point into exactly one cluster.

### Hierarchical linkage

Agglomerative hierarchical clustering starts with each point as its own cluster and repeatedly merges the two nearest clusters. Different linkage rules define "nearest" differently:

| Ward linkage | Average linkage | Complete linkage |
|---|---|---|
| Minimize within cluster distance | Minimize average distance between cluster pairs | Minimize maximum distance of between cluster pairs |

The output is a dendrogram: a tree showing which points merge early, which merge late, and where a horizontal cut would produce a chosen number of clusters.

### Silhouette coefficient

In unsupervised learning, evaluation is subtle because true labels may be absent. The silhouette coefficient compares within-cluster compactness to separation from the next nearest cluster. By noting $a$ and $b$ the mean distance between a sample and all other points in the same class, and between a sample and all other points in the next nearest cluster, the silhouette coefficient $s$ for a single sample is:

$$
s=\frac{b-a}{\max(a,b)}
$$

Values near $1$ indicate well-separated points, values near $0$ indicate boundary points, and negative values suggest points may be assigned to the wrong cluster.

## 3. Hands-on Notebook

### Setup

Run this first. The install line is commented because Colab usually includes these packages; uncomment it if your runtime is missing a dependency.

```python
# !pip -q install numpy matplotlib scikit-learn scipy ipywidgets seaborn  # install the small scientific stack only if the runtime does not already provide it.
import numpy as np  # use NumPy arrays so distance calculations and linear algebra stay vectorized.
import matplotlib.pyplot as plt  # use Matplotlib because every clustering step needs a direct visual check.
from sklearn.datasets import make_blobs, make_moons, load_iris, load_wine, load_breast_cancer  # use built-in and real tabular datasets without network dependence.
from sklearn.cluster import KMeans, AgglomerativeClustering  # use scikit-learn clustering implementations after the from-scratch example.
from sklearn.metrics import silhouette_score, silhouette_samples, adjusted_rand_score  # measure unsupervised quality and compare to hidden labels when available.
from sklearn.preprocessing import StandardScaler  # standardize features so Euclidean distance is not dominated by large-scale columns.
from sklearn.decomposition import PCA  # project high-dimensional data to two dimensions for visualization.
from scipy.cluster.hierarchy import linkage, dendrogram, fcluster  # build dendrograms and cut hierarchical trees.
from scipy.spatial.distance import cdist  # compute all point-to-centroid distances cleanly for from-scratch k-means.
try:  # try to import ipywidgets so Colab can show live sliders.
    from ipywidgets import interact, IntSlider, FloatSlider, Dropdown  # create the live Colab controls in the experiment section.
except ModuleNotFoundError:  # keep the notebook runnable in minimal Python environments without ipywidgets.
    class _FallbackWidget:  # define a tiny stand-in that stores the default widget value.
        def __init__(self, value=None, **kwargs):  # accept the same keyword pattern used by real widgets below.
            self.value = value  # store the selected value so the fallback interaction can call the function once.
    IntSlider = _FallbackWidget  # replace integer sliders with the fallback value holder.
    FloatSlider = _FallbackWidget  # replace float sliders with the fallback value holder.
    Dropdown = _FallbackWidget  # replace dropdowns with the fallback value holder.
    def interact(function, **controls):  # define a fallback interact that runs the function once.
        values = {name: control.value for name, control in controls.items()}  # extract default values from fallback controls.
        return function(**values)  # call the interactive function once so the code path remains runnable.
try:  # try to import seaborn for a polished capstone heatmap.
    import seaborn as sns  # make the capstone heatmap readable with minimal plotting code.
except ModuleNotFoundError:  # keep the heatmap runnable when seaborn is not installed.
    class _FallbackSeaborn:  # define a minimal object with a seaborn-like heatmap method.
        @staticmethod  # allow heatmap to be called as sns.heatmap without creating an instance.
        def heatmap(data, cmap="vlag", center=0, xticklabels=None, yticklabels=None, cbar_kws=None):  # accept the arguments used in the capstone cell.
            ax = plt.gca()  # draw the fallback heatmap on the current axes.
            image = ax.imshow(data, aspect="auto", cmap="coolwarm")  # display the profile matrix as colored cells.
            ax.set_xticks(np.arange(data.shape[1]))  # create one x tick per feature.
            ax.set_yticks(np.arange(data.shape[0]))  # create one y tick per cluster.
            ax.set_xticklabels(xticklabels if xticklabels is not None else np.arange(data.shape[1]))  # label columns with feature names when provided.
            ax.set_yticklabels(yticklabels if yticklabels is not None else np.arange(data.shape[0]))  # label rows with cluster names when provided.
            colorbar = plt.colorbar(image, ax=ax)  # add a colorbar so standardized means are interpretable.
            colorbar.set_label((cbar_kws or {}).get("label", "value"))  # use the requested colorbar label when supplied.
            return ax  # return axes to match seaborn's general calling style.
    sns = _FallbackSeaborn()  # expose the fallback object under the same name used later.
np.random.seed(229)  # seed the global random generator so notebook results are reproducible.
plt.style.use("seaborn-v0_8-whitegrid")  # choose a light grid style so centroids and clusters are easy to read.
RNG = np.random.default_rng(229)  # create a modern reproducible random generator for custom initialization.
COLOR_CYCLE = plt.cm.tab10.colors  # reuse a stable categorical palette across all examples.

def plot_2d_points(X, labels=None, centers=None, title="", ax=None, true_labels=None):  # define one helper for repeated two-dimensional cluster plots.
    ax = plt.gca() if ax is None else ax  # reuse the current axes when no axes object is supplied.
    labels_to_plot = np.zeros(X.shape[0], dtype=int) if labels is None else np.asarray(labels)  # give every point one color group when labels are absent.
    unique_labels = np.unique(labels_to_plot)  # list the groups that will be drawn.
    for label in unique_labels:  # draw each cluster separately so the legend names are meaningful.
        mask = labels_to_plot == label  # select the points assigned to the current cluster.
        ax.scatter(X[mask, 0], X[mask, 1], s=42, alpha=0.82, color=COLOR_CYCLE[int(label) % len(COLOR_CYCLE)], label=f"cluster {label}")  # show the cluster points with a stable color.
    if true_labels is not None:  # optionally outline points by their hidden real class for diagnostic comparisons.
        ax.scatter(X[:, 0], X[:, 1], s=72, facecolors="none", edgecolors="black", linewidths=0.6, alpha=0.45)  # add thin outlines without hiding cluster colors.
    if centers is not None:  # optionally add centroids when an algorithm produces representative centers.
        ax.scatter(centers[:, 0], centers[:, 1], s=260, marker="X", color="black", edgecolor="white", linewidth=1.4, label="centroids")  # mark centroids as large black X symbols.
    ax.set_title(title)  # label the plot with the current modeling step.
    ax.set_xlabel("feature 1")  # name the horizontal axis generically because sources vary.
    ax.set_ylabel("feature 2")  # name the vertical axis generically because sources vary.
    ax.legend(loc="best", fontsize=8)  # keep the cluster color mapping visible.
    return ax  # return axes so callers can further annotate the plot.

def compute_inertia(X, labels, centers):  # define distortion so from-scratch and sklearn outputs can be compared.
    return float(np.sum((X - centers[labels]) ** 2))  # add squared point-to-assigned-centroid distances to match the k-means objective.

def standardize_for_clustering(X):  # define a small scaling helper used by examples that compare raw and scaled features.
    scaler = StandardScaler()  # create a fresh scaler so each dataset gets its own mean and standard deviation.
    X_scaled = scaler.fit_transform(X)  # fit the scaler on the current data and transform it to zero mean and unit variance.
    return X_scaled, scaler  # return both transformed data and fitted scaler for inspection if needed.
```

### Data — swappable sources

We will keep one `DATA_SOURCE` toggle so the same plotting and modeling code can be rerun on easy blobs, non-spherical moons, Iris, Wine, and a real capstone dataset. The `moons` option is intentionally included because k-means fails on crescent-shaped clusters.

```python
DATA_SOURCE = "blobs"  # choose one source: "blobs", "moons", "iris", "wine", or "cancer".

def load_clustering_data(source="blobs", random_state=229):  # wrap data loading so examples can swap sources consistently.
    if source == "blobs":  # use clean Gaussian blobs for the first successful k-means demonstrations.
        X, y = make_blobs(n_samples=360, centers=3, cluster_std=0.75, random_state=random_state)  # create three compact spherical clusters.
        feature_names = ["synthetic x1", "synthetic x2"]  # name the two synthetic coordinates.
        description = "three compact Gaussian blobs"  # summarize the source for plot titles.
    elif source == "moons":  # use two interleaving crescents to expose the spherical-cluster assumption.
        X, y = make_moons(n_samples=360, noise=0.07, random_state=random_state)  # create non-convex clusters that nearest-centroid methods split poorly.
        feature_names = ["moon x1", "moon x2"]  # name the moon coordinates.
        description = "two interleaving moons"  # summarize the source for diagnosis.
    elif source == "iris":  # use a classic real dataset with three botanical species.
        iris = load_iris()  # load Iris from scikit-learn so the notebook needs no download.
        X = iris.data[:, [0, 2]]  # keep sepal length and petal length for a two-dimensional first look.
        y = iris.target  # keep species labels only for evaluation after clustering.
        feature_names = [iris.feature_names[0], iris.feature_names[2]]  # preserve the real feature names.
        description = "Iris using sepal length and petal length"  # summarize the source for titles.
    elif source == "wine":  # use a higher-dimensional real dataset for PCA and capstone examples.
        wine = load_wine()  # load Wine from scikit-learn so the notebook remains offline-friendly.
        X = wine.data  # keep all chemical measurements for realistic scaling and projection.
        y = wine.target  # keep cultivar labels for optional external validation.
        feature_names = list(wine.feature_names)  # keep all feature names for cluster profiles.
        description = "Wine chemical measurements"  # summarize the source for titles.
    elif source == "cancer":  # use another real tabular dataset as a stand-in for upload-style workflows.
        cancer = load_breast_cancer()  # load a real medical feature matrix available inside scikit-learn.
        X = cancer.data  # keep all measured cell-nucleus features.
        y = cancer.target  # keep diagnosis labels only for optional external validation.
        feature_names = list(cancer.feature_names)  # keep feature names for profile interpretation.
        description = "Breast cancer diagnostic measurements"  # summarize the source for titles.
    else:  # reject misspelled source names early.
        raise ValueError("DATA_SOURCE must be one of: blobs, moons, iris, wine, cancer")  # give a precise fix for invalid input.
    return X, y, feature_names, description  # return the data bundle in a consistent order.

X_raw, y_true, feature_names, data_description = load_clustering_data(DATA_SOURCE)  # load the selected source once for exploration.
print(f"Loaded {data_description} with shape {X_raw.shape}.")  # report rows and columns so students know the modeling scale.
print(f"First feature names: {feature_names[:5]}")  # show feature names without flooding the output for high-dimensional datasets.
```

```python
print("Feature means:", np.round(X_raw.mean(axis=0)[:5], 3))  # inspect the first few means because centroids live in feature space.
print("Feature standard deviations:", np.round(X_raw.std(axis=0)[:5], 3))  # inspect scales because Euclidean distance is scale-sensitive.
print("Number of hidden reference classes:", len(np.unique(y_true)))  # reveal label count only as a diagnostic, not as training supervision.
```

```python
X_plot = X_raw[:, :2] if X_raw.shape[1] > 2 else X_raw  # use the first two columns for raw visualization when data has many features.
plt.figure(figsize=(6.5, 5))  # create a readable figure for the first look.
plt.scatter(X_plot[:, 0], X_plot[:, 1], s=42, alpha=0.8, c="slateblue")  # plot raw points without cluster labels to mimic the unsupervised setting.
plt.title(f"Raw data view: {data_description}")  # identify which source the toggle loaded.
plt.xlabel(feature_names[0])  # label the first displayed feature.
plt.ylabel(feature_names[1] if len(feature_names) > 1 else "feature 2")  # label the second displayed feature safely.
plt.show()  # render the raw-data scatter before any model is fit.
```

▶ What you'll see: an unlabeled point cloud. For `blobs`, three compact groups are visually obvious; for `moons`, the two curved groups already hint that spherical centroids will struggle.

### 🟢 Easy Examples

#### E1. k-means on 3 clean blobs from scratch

**Goal.** Build k-means ourselves on clean Gaussian blobs so every line maps to the formula in §2.  
**Data source.** `blobs`.  
**We'll build this in 5 steps:** load clean data, initialize centroids, assign points, update centroids, and loop while plotting every iteration.

```python
X_e1, y_e1, _, _ = load_clustering_data("blobs", random_state=229)  # create the clean three-blob dataset for from-scratch k-means.
k_e1 = 3  # set the true number of clusters so the algorithm's mechanics are the focus.
plt.figure(figsize=(6, 5))  # create a raw-data figure before initialization.
plt.scatter(X_e1[:, 0], X_e1[:, 1], s=42, alpha=0.8, c="gray")  # show unlabeled points so the task is visually clear.
plt.title("E1 step 1: clean blob data before clustering")  # mark this as the starting state.
plt.xlabel("feature 1")  # label the horizontal coordinate.
plt.ylabel("feature 2")  # label the vertical coordinate.
plt.show()  # render the starting data cloud.
```

▶ What you'll see: three compact gray clouds with no labels; k-means should be a good geometric match.

```python
initial_indices_e1 = RNG.choice(X_e1.shape[0], size=k_e1, replace=False)  # choose three actual data points as reproducible initial centroids.
centers_e1 = X_e1[initial_indices_e1].copy()  # copy the selected rows so later updates do not modify X_e1.
labels_e1 = np.zeros(X_e1.shape[0], dtype=int)  # create an initial label array that will be overwritten by assignment.
history_e1 = [centers_e1.copy()]  # store centroid positions so we can plot their migration.
plt.figure(figsize=(6, 5))  # create an initialization figure.
plot_2d_points(X_e1, labels=np.zeros(X_e1.shape[0], dtype=int), centers=centers_e1, title="E1 step 2: random centroid initialization")  # show all points plus the starting centroids.
plt.show()  # render the initial centroids.
```

▶ What you'll see: three black X markers placed at random data points; some may start far from the centers of the visible blobs.

```python
distances_e1 = cdist(X_e1, centers_e1, metric="sqeuclidean")  # compute squared distance from every point to every centroid.
labels_e1 = np.argmin(distances_e1, axis=1)  # assign each point to the nearest centroid according to squared Euclidean distance.
inertia_after_assign_e1 = compute_inertia(X_e1, labels_e1, centers_e1)  # measure distortion after this hard assignment step.
print(f"Inertia after first assignment: {inertia_after_assign_e1:.2f}")  # print the objective so students can track improvement.
plt.figure(figsize=(6, 5))  # create an assignment-state figure.
plot_2d_points(X_e1, labels=labels_e1, centers=centers_e1, title="E1 step 3: assign each point to nearest centroid")  # show Voronoi-style hard assignments.
plt.show()  # render assignments before centroids move.
```

▶ What you'll see: each point is colored by its nearest current centroid, so the colors may cut through natural blobs before updates fix the centers.

```python
new_centers_e1 = np.vstack([X_e1[labels_e1 == j].mean(axis=0) for j in range(k_e1)])  # replace each centroid with the mean of its assigned points.
centers_e1 = new_centers_e1.copy()  # accept the centroid update as the new model state.
history_e1.append(centers_e1.copy())  # save the updated centroids for the migration path.
inertia_after_update_e1 = compute_inertia(X_e1, labels_e1, centers_e1)  # recompute distortion using the moved centroids.
print(f"Inertia after first centroid update: {inertia_after_update_e1:.2f}")  # show that the update step decreases distortion.
plt.figure(figsize=(6, 5))  # create an update-state figure.
plot_2d_points(X_e1, labels=labels_e1, centers=centers_e1, title="E1 step 4: update centroids to assigned means")  # show centroids after moving to cluster means.
plt.show()  # render the update result.
```

▶ What you'll see: the black X markers move toward the centers of their colored point groups, reducing within-cluster squared distance.

```python
centers_loop_e1 = centers_e1.copy()  # start the full loop from the first updated centroids.
inertias_e1 = []  # store distortion values across iterations to verify monotonic improvement.
fig, axes = plt.subplots(2, 3, figsize=(15, 9))  # create a grid that can show several iterations at once.
axes_flat = axes.ravel()  # flatten axes so the loop can index panels directly.
for iteration in range(6):  # run a fixed small number of iterations because this easy dataset converges quickly.
    distances_loop_e1 = cdist(X_e1, centers_loop_e1, metric="sqeuclidean")  # compute point-to-centroid squared distances for this iteration.
    labels_loop_e1 = np.argmin(distances_loop_e1, axis=1)  # assign each point to its closest centroid.
    inertia_loop_e1 = compute_inertia(X_e1, labels_loop_e1, centers_loop_e1)  # evaluate the current distortion before the update.
    inertias_e1.append(inertia_loop_e1)  # record the objective for the convergence trace.
    plot_2d_points(X_e1, labels=labels_loop_e1, centers=centers_loop_e1, title=f"iteration {iteration}, J={inertia_loop_e1:.1f}", ax=axes_flat[iteration])  # visualize this iteration's assignments and centers.
    centers_loop_e1 = np.vstack([X_e1[labels_loop_e1 == j].mean(axis=0) for j in range(k_e1)])  # update every centroid to its assigned mean.
plt.tight_layout()  # prevent subplot labels from overlapping.
plt.show()  # render the iteration-by-iteration k-means process.
```

▶ What you'll see: centroids migrate into the middle of the blobs, colors stabilize, and the displayed distortion drops until nearly unchanged.

```python
final_distances_e1 = cdist(X_e1, centers_loop_e1, metric="sqeuclidean")  # compute final distances to the converged centroids.
final_labels_e1 = np.argmin(final_distances_e1, axis=1)  # assign final labels using the converged centroids.
final_inertia_e1 = compute_inertia(X_e1, final_labels_e1, centers_loop_e1)  # compute final distortion for the from-scratch solution.
final_silhouette_e1 = silhouette_score(X_e1, final_labels_e1)  # compute silhouette to summarize compactness and separation.
plt.figure(figsize=(6.5, 5.2))  # create the final result figure.
plot_2d_points(X_e1, labels=final_labels_e1, centers=centers_loop_e1, title=f"E1 final: inertia={final_inertia_e1:.1f}, silhouette={final_silhouette_e1:.2f}")  # display final clusters and metrics.
plt.show()  # render the final from-scratch clustering.
print("Inertia trace:", np.round(inertias_e1 + [final_inertia_e1], 1))  # print the monotone objective trace for numerical confirmation.
```

▶ What you'll see: three stable colored blobs, centroids in the middle, high silhouette, and a decreasing inertia trace.

👀 **Takeaway.** k-means is just the repeated application of the two formulas in §2: nearest-centroid assignment and assigned-mean update.

#### E2. Choosing $k$ with the elbow method

**Goal.** Fit k-means for many values of $k$ and look for the point where extra clusters give diminishing returns.  
**Data source.** `blobs`.  
**We'll build this in 3 steps:** prepare the data, fit a sweep over $k$, and mark the elbow.

```python
X_e2, y_e2, _, _ = load_clustering_data("blobs", random_state=231)  # generate another clean blob dataset for model-selection practice.
k_values_e2 = np.arange(1, 11)  # test candidate cluster counts from one to ten.
inertias_e2 = []  # store the k-means distortion for each candidate k.
plt.figure(figsize=(6, 5))  # create the raw-data context plot.
plt.scatter(X_e2[:, 0], X_e2[:, 1], s=40, alpha=0.78, c="gray")  # show the data before selecting k.
plt.title("E2 step 1: data for choosing k")  # label the first step.
plt.xlabel("feature 1")  # label the horizontal coordinate.
plt.ylabel("feature 2")  # label the vertical coordinate.
plt.show()  # render the data used by the k sweep.
```

▶ What you'll see: three visually distinct clusters, so the elbow should occur near $k=3$.

```python
for k in k_values_e2:  # fit one model for each candidate number of clusters.
    model_e2 = KMeans(n_clusters=int(k), init="k-means++", n_init=20, random_state=229)  # use robust k-means++ initialization to reduce random-start noise.
    model_e2.fit(X_e2)  # fit k-means to the same data for this candidate k.
    inertias_e2.append(model_e2.inertia_)  # store sklearn's inertia, which equals the distortion objective J.
print(dict(zip(k_values_e2.tolist(), np.round(inertias_e2, 1).tolist())))  # print the numeric elbow table for exact reading.
```

```python
plt.figure(figsize=(7, 5))  # create the elbow-curve figure.
plt.plot(k_values_e2, inertias_e2, marker="o", linewidth=2.5)  # plot distortion as a function of k.
plt.axvline(3, color="crimson", linestyle="--", label="visual elbow near k=3")  # mark the expected elbow from the data geometry.
plt.title("E2 step 2: elbow curve for k-means")  # title the model-selection plot.
plt.xlabel("number of clusters k")  # label the candidate cluster count axis.
plt.ylabel("inertia / distortion J")  # label the objective axis.
plt.legend()  # show the elbow annotation.
plt.show()  # render the elbow curve.
```

▶ What you'll see: inertia always decreases with $k$, but the improvement sharply slows after $k=3$.

```python
chosen_k_e2 = 3  # choose the elbow value as the final model size.
final_model_e2 = KMeans(n_clusters=chosen_k_e2, init="k-means++", n_init=20, random_state=229)  # configure the selected k-means model.
labels_e2 = final_model_e2.fit_predict(X_e2)  # fit the selected model and return cluster labels.
silhouette_e2 = silhouette_score(X_e2, labels_e2)  # compute a separation metric for the selected k.
plt.figure(figsize=(6.5, 5.2))  # create the chosen-k result figure.
plot_2d_points(X_e2, labels=labels_e2, centers=final_model_e2.cluster_centers_, title=f"E2 final: chosen k={chosen_k_e2}, silhouette={silhouette_e2:.2f}")  # show the chosen clustering.
plt.show()  # render the selected-k result.
print(f"Chosen-k inertia: {final_model_e2.inertia_:.2f}")  # print the final distortion metric.
```

▶ What you'll see: the selected $k=3$ model recovers the three natural groups and has a strong silhouette score.

👀 **Takeaway.** The elbow method does not find the "true" $k$ mathematically; it identifies where additional clusters stop buying much distortion reduction.

#### E3. k-means on real data: Iris with two features

**Goal.** Cluster real Iris measurements and compare the unsupervised clusters to species labels only after fitting.  
**Data source.** `iris`.  
**We'll build this in 4 steps:** load two features, fit k-means, inspect iterations through sklearn's final state, and compare clusters with true species.

```python
X_e3, y_e3, feature_names_e3, _ = load_clustering_data("iris", random_state=229)  # load Iris using sepal length and petal length.
plt.figure(figsize=(6, 5))  # create a raw Iris plot.
plt.scatter(X_e3[:, 0], X_e3[:, 1], s=50, alpha=0.8, c="gray")  # show Iris points without species colors because clustering is unsupervised.
plt.title("E3 step 1: Iris features before clustering")  # label the raw-data step.
plt.xlabel(feature_names_e3[0])  # show the real first feature name.
plt.ylabel(feature_names_e3[1])  # show the real second feature name.
plt.show()  # render the raw two-feature Iris view.
```

▶ What you'll see: one group separates strongly, while two groups overlap more, foreshadowing imperfect clustering.

```python
model_e3 = KMeans(n_clusters=3, init="k-means++", n_init=30, random_state=229)  # configure k-means with three clusters to match the known species count.
labels_e3 = model_e3.fit_predict(X_e3)  # fit on measurements only and obtain unsupervised cluster assignments.
silhouette_e3 = silhouette_score(X_e3, labels_e3)  # compute silhouette without using the species labels.
ari_e3 = adjusted_rand_score(y_e3, labels_e3)  # compare to species labels after fitting using a label-permutation-invariant score.
print(f"Iris inertia={model_e3.inertia_:.2f}, silhouette={silhouette_e3:.2f}, ARI vs species={ari_e3:.2f}")  # report internal and external diagnostics.
```

```python
plt.figure(figsize=(6.5, 5.2))  # create the cluster result figure.
plot_2d_points(X_e3, labels=labels_e3, centers=model_e3.cluster_centers_, title="E3 step 2: k-means clusters on Iris")  # show the k-means partition.
plt.xlabel(feature_names_e3[0])  # keep the real feature name on the x-axis.
plt.ylabel(feature_names_e3[1])  # keep the real feature name on the y-axis.
plt.show()  # render the unsupervised Iris clusters.
```

▶ What you'll see: k-means finds one very clean cluster and splits the overlapping region into two centroid-based groups.

```python
fig, axes = plt.subplots(1, 2, figsize=(12, 5))  # create side-by-side panels for cluster labels and true species.
plot_2d_points(X_e3, labels=labels_e3, centers=model_e3.cluster_centers_, title="k-means clusters", ax=axes[0])  # show unsupervised assignments on the left.
plot_2d_points(X_e3, labels=y_e3, centers=None, title="true Iris species", ax=axes[1])  # show species labels on the right for evaluation only.
axes[0].set_xlabel(feature_names_e3[0])  # label the left x-axis with the feature name.
axes[0].set_ylabel(feature_names_e3[1])  # label the left y-axis with the feature name.
axes[1].set_xlabel(feature_names_e3[0])  # label the right x-axis with the feature name.
axes[1].set_ylabel(feature_names_e3[1])  # label the right y-axis with the feature name.
plt.tight_layout()  # avoid panel overlap.
plt.show()  # render the comparison.
```

▶ What you'll see: one species is almost perfectly isolated, while the other two are partly mixed because two features do not fully separate them.

```python
plt.figure(figsize=(6.5, 4.2))  # create a compact metric summary plot.
plt.bar(["silhouette", "ARI vs species"], [silhouette_e3, ari_e3], color=["steelblue", "darkorange"])  # compare internal and external scores.
plt.ylim(0, 1)  # put both metrics on a common interpretable scale.
plt.title("E3 final: internal quality vs external agreement")  # explain what the two bars mean.
plt.ylabel("score")  # label the score axis.
plt.show()  # render the metric comparison.
```

▶ What you'll see: silhouette and ARI are positive but not perfect, reflecting that real biological classes are not exactly spherical in these two measurements.

👀 **Takeaway.** Real labels are not used by k-means; they are only a post-hoc check that the distance-based clusters align with domain categories.

#### E4. Initialization matters: random vs k-means++

**Goal.** Show that k-means can land in different local minima, and that k-means++ makes bad starts less likely.  
**Data source.** `blobs`.  
**We'll build this in 4 steps:** create a challenging blob layout, run random starts, run k-means++ starts, and compare distributions of inertia.

```python
X_e4, y_e4 = make_blobs(n_samples=420, centers=[[-5, 0], [0, 0], [5, 0]], cluster_std=[1.8, 0.4, 1.8], random_state=229)  # create two diffuse edge blobs and one tight middle blob so poor initialization can waste centroids.
seeds_e4 = [1, 2, 3, 4, 5, 6]  # choose several deterministic seeds to expose run-to-run variation.
plt.figure(figsize=(7, 4.8))  # create the challenging-data plot.
plt.scatter(X_e4[:, 0], X_e4[:, 1], s=38, alpha=0.78, c="gray")  # show the stretched horizontal arrangement before fitting.
plt.title("E4 step 1: data where local minima are possible")  # label why this dataset is useful.
plt.xlabel("feature 1")  # label the horizontal coordinate.
plt.ylabel("feature 2")  # label the vertical coordinate.
plt.show()  # render the data geometry.
```

▶ What you'll see: three nearby blobs along a line; unlucky initial centers can waste two centroids on one group.

```python
random_models_e4 = []  # store random-initialized models for later plotting.
for seed in seeds_e4:  # run the same algorithm with different random initial centroids.
    model = KMeans(n_clusters=3, init="random", n_init=1, random_state=seed)  # use exactly one random initialization to make local minima visible.
    labels = model.fit_predict(X_e4)  # fit the model and obtain labels for this seed.
    random_models_e4.append((seed, model, labels))  # keep the seed, fitted model, and labels together.
print([round(model.inertia_, 1) for _, model, _ in random_models_e4])  # print the random-start inertias to show variability.
```

```python
fig, axes = plt.subplots(2, 3, figsize=(15, 8))  # create a grid for random-start outcomes.
for ax, (seed, model, labels) in zip(axes.ravel(), random_models_e4):  # draw one panel per seed.
    plot_2d_points(X_e4, labels=labels, centers=model.cluster_centers_, title=f"random seed {seed}, J={model.inertia_:.0f}", ax=ax)  # show the clustering and its inertia.
plt.tight_layout()  # prevent crowded titles and legends.
plt.show()  # render the random-initialization grid.
```

▶ What you'll see: some seeds split the three blobs cleanly, while others produce a visibly worse partition with higher inertia.

```python
plusplus_models_e4 = []  # store k-means++ models for comparison.
for seed in seeds_e4:  # repeat the experiment with k-means++ initialization.
    model = KMeans(n_clusters=3, init="k-means++", n_init=1, random_state=seed)  # use one k-means++ initialization so the initializer itself is being compared.
    labels = model.fit_predict(X_e4)  # fit the k-means++ model for this seed.
    plusplus_models_e4.append((seed, model, labels))  # keep each fitted result for plotting.
print([round(model.inertia_, 1) for _, model, _ in plusplus_models_e4])  # print k-means++ inertias to compare variability.
```

```python
fig, axes = plt.subplots(2, 3, figsize=(15, 8))  # create a grid for k-means++ outcomes.
for ax, (seed, model, labels) in zip(axes.ravel(), plusplus_models_e4):  # draw one panel per seed.
    plot_2d_points(X_e4, labels=labels, centers=model.cluster_centers_, title=f"k-means++ seed {seed}, J={model.inertia_:.0f}", ax=ax)  # show the improved initialization behavior.
plt.tight_layout()  # keep panels readable.
plt.show()  # render the k-means++ grid.
```

▶ What you'll see: k-means++ more consistently spreads initial centroids across the data, reducing poor local minima.

```python
random_inertias_e4 = [model.inertia_ for _, model, _ in random_models_e4]  # collect random-start distortions.
plusplus_inertias_e4 = [model.inertia_ for _, model, _ in plusplus_models_e4]  # collect k-means++ distortions.
plt.figure(figsize=(7, 4.8))  # create the final comparison figure.
plt.plot(seeds_e4, random_inertias_e4, marker="o", label="random init")  # show random-start inertia by seed.
plt.plot(seeds_e4, plusplus_inertias_e4, marker="o", label="k-means++ init")  # show k-means++ inertia by seed.
plt.title("E4 final: initialization changes the local optimum")  # explain the comparison.
plt.xlabel("random seed")  # label the seed axis.
plt.ylabel("inertia / distortion J")  # label the objective axis.
plt.legend()  # identify the two initializers.
plt.show()  # render the inertia comparison.
print(f"Best random J={min(random_inertias_e4):.1f}; best k-means++ J={min(plusplus_inertias_e4):.1f}")  # print the best observed objective for each strategy.
```

▶ What you'll see: random initialization has larger variance; k-means++ is usually lower and more stable, though multiple `n_init` runs remain valuable.

👀 **Takeaway.** k-means solves a non-convex problem; smarter initialization and multiple restarts are practical defenses against bad local minima.

#### E5. Judging quality with silhouette scores

**Goal.** Move beyond inertia by asking whether each point is closer to its own cluster than to neighboring clusters.  
**Data source.** `blobs`.  
**We'll build this in 4 steps:** fit k-means, compute per-sample silhouettes, draw the silhouette plot, and connect low-score points to the scatter.

```python
X_e5, y_e5, _, _ = load_clustering_data("blobs", random_state=236)  # generate clean clusters for a silhouette demonstration.
model_e5 = KMeans(n_clusters=3, init="k-means++", n_init=20, random_state=229)  # configure a stable three-cluster model.
labels_e5 = model_e5.fit_predict(X_e5)  # fit k-means and obtain cluster labels.
sample_sil_e5 = silhouette_samples(X_e5, labels_e5)  # compute the silhouette coefficient for every point.
mean_sil_e5 = silhouette_score(X_e5, labels_e5)  # compute the average silhouette across all points.
print(f"Mean silhouette: {mean_sil_e5:.3f}")  # report the headline quality metric.
```

```python
plt.figure(figsize=(6.5, 5.2))  # create the clustered scatter plot.
plot_2d_points(X_e5, labels=labels_e5, centers=model_e5.cluster_centers_, title="E5 step 1: clusters before silhouette diagnosis")  # show the clusters to be diagnosed.
plt.show()  # render the clustered data.
```

▶ What you'll see: three clusters that look visually reasonable; silhouette will quantify which points are least secure.

```python
fig, ax = plt.subplots(figsize=(7.5, 5.5))  # create the silhouette plot canvas.
y_lower_e5 = 10  # start with a small vertical gap before the first cluster band.
for cluster_id in range(3):  # draw one sorted silhouette band per cluster.
    cluster_values = np.sort(sample_sil_e5[labels_e5 == cluster_id])  # sort within-cluster silhouettes so the band shape is readable.
    y_upper_e5 = y_lower_e5 + cluster_values.shape[0]  # compute the vertical extent for this cluster band.
    ax.fill_betweenx(np.arange(y_lower_e5, y_upper_e5), 0, cluster_values, alpha=0.75, color=COLOR_CYCLE[cluster_id])  # fill the silhouette values horizontally.
    ax.text(-0.08, y_lower_e5 + 0.5 * cluster_values.shape[0], str(cluster_id))  # label the band by cluster id.
    y_lower_e5 = y_upper_e5 + 10  # add spacing before the next cluster band.
ax.axvline(mean_sil_e5, color="crimson", linestyle="--", label=f"mean={mean_sil_e5:.2f}")  # mark the average silhouette.
ax.set_title("E5 step 2: per-sample silhouette plot")  # title the diagnostic plot.
ax.set_xlabel("silhouette coefficient s")  # label the silhouette axis.
ax.set_ylabel("points grouped by cluster")  # label the vertical grouping.
ax.legend()  # identify the mean line.
plt.show()  # render the silhouette diagnostic.
```

▶ What you'll see: most bars extend well to the right of zero; short bars are boundary points with weaker assignments.

```python
low_mask_e5 = sample_sil_e5 < np.percentile(sample_sil_e5, 10)  # mark the lowest 10 percent of silhouette values as boundary-like points.
plt.figure(figsize=(6.5, 5.2))  # create the low-silhouette location plot.
plot_2d_points(X_e5, labels=labels_e5, centers=model_e5.cluster_centers_, title=f"E5 final: mean silhouette={mean_sil_e5:.2f}")  # show the full clustering first.
plt.scatter(X_e5[low_mask_e5, 0], X_e5[low_mask_e5, 1], s=130, facecolors="none", edgecolors="black", linewidths=1.6, label="lowest 10% silhouette")  # circle the least secure points.
plt.legend()  # include the boundary-point marker in the legend.
plt.show()  # render the final silhouette interpretation.
print(f"Lowest silhouette value: {sample_sil_e5.min():.3f}")  # print the weakest individual assignment.
```

▶ What you'll see: the circled low-silhouette points sit near gaps between clusters, exactly where assignment ambiguity is highest.

👀 **Takeaway.** Inertia rewards compactness but always improves with larger $k$; silhouette asks whether clusters are both compact and separated.

### 🔴 Advanced Examples

#### A1. Where k-means fails: non-spherical moons

**Goal.** Diagnose a failure case where the true clusters are curved rather than centroid-shaped.  
**Data source.** `moons`.  
**We'll build this in 5 steps:** load moons, run k-means, visualize the wrong split, inspect iteration behavior, and compare to a linkage method.

```python
X_a1, y_a1, _, _ = load_clustering_data("moons", random_state=229)  # load two crescent-shaped clusters that violate k-means assumptions.
plt.figure(figsize=(6.5, 5.2))  # create the raw moons plot.
plt.scatter(X_a1[:, 0], X_a1[:, 1], s=42, alpha=0.82, c="gray")  # show unlabeled moons before fitting.
plt.title("A1 step 1: non-spherical moon data")  # label the failure-case geometry.
plt.xlabel("feature 1")  # label the horizontal coordinate.
plt.ylabel("feature 2")  # label the vertical coordinate.
plt.show()  # render the raw moon shapes.
```

▶ What you'll see: two interleaving crescents; each cluster is curved, not a compact ball around one centroid.

```python
model_a1 = KMeans(n_clusters=2, init="k-means++", n_init=30, random_state=229)  # configure k-means with the correct number of groups.
labels_a1 = model_a1.fit_predict(X_a1)  # fit k-means even though its geometry is inappropriate.
silhouette_a1 = silhouette_score(X_a1, labels_a1)  # compute the internal silhouette of the centroid split.
ari_a1 = adjusted_rand_score(y_a1, labels_a1)  # compare to the known moon identities after fitting.
print(f"k-means on moons: silhouette={silhouette_a1:.2f}, ARI vs true moons={ari_a1:.2f}")  # report that internal and external views can disagree.
```

```python
fig, axes = plt.subplots(1, 2, figsize=(12, 5))  # create side-by-side panels for diagnosis.
plot_2d_points(X_a1, labels=labels_a1, centers=model_a1.cluster_centers_, title="k-means split", ax=axes[0])  # show the centroid-based split.
plot_2d_points(X_a1, labels=y_a1, centers=None, title="true crescent structure", ax=axes[1])  # show the real crescent membership for comparison.
plt.tight_layout()  # keep panels from overlapping.
plt.show()  # render the failure comparison.
```

▶ What you'll see: k-means cuts the moons into left/right convex regions instead of following the two curved crescents.

```python
centers_a1 = X_a1[RNG.choice(X_a1.shape[0], size=2, replace=False)].copy()  # choose two starting centroids to visualize the k-means process.
fig, axes = plt.subplots(1, 5, figsize=(18, 3.8))  # create a compact iteration strip.
for iteration in range(5):  # run five visible assignment-update cycles.
    labels_iter_a1 = np.argmin(cdist(X_a1, centers_a1, metric="sqeuclidean"), axis=1)  # assign each moon point to its nearest centroid.
    plot_2d_points(X_a1, labels=labels_iter_a1, centers=centers_a1, title=f"iter {iteration}", ax=axes[iteration])  # show the current convex split.
    centers_a1 = np.vstack([X_a1[labels_iter_a1 == j].mean(axis=0) for j in range(2)])  # update centroids to means of their assigned halves.
plt.tight_layout()  # keep the iteration strip readable.
plt.show()  # render k-means iterations on moons.
```

▶ What you'll see: centroids settle into two positions that define a straight-ish boundary, which cannot wrap around a crescent.

```python
agg_a1 = AgglomerativeClustering(n_clusters=2, linkage="single")  # configure single-linkage clustering, which can follow chained non-convex shapes.
labels_agg_a1 = agg_a1.fit_predict(X_a1)  # fit hierarchical clustering to the moon data.
ari_agg_a1 = adjusted_rand_score(y_a1, labels_agg_a1)  # compare the linkage result to the true moon labels.
fig, axes = plt.subplots(1, 2, figsize=(12, 5))  # create side-by-side algorithm comparison panels.
plot_2d_points(X_a1, labels=labels_a1, centers=model_a1.cluster_centers_, title=f"k-means ARI={ari_a1:.2f}", ax=axes[0])  # display the failing centroid model.
plot_2d_points(X_a1, labels=labels_agg_a1, centers=None, title=f"single-linkage ARI={ari_agg_a1:.2f}", ax=axes[1])  # display a method better matched to crescent connectivity.
plt.tight_layout()  # keep comparison panels clean.
plt.show()  # render the final failure diagnosis.
print(f"Single-linkage ARI on moons: {ari_agg_a1:.2f}")  # print the improved external agreement.
```

▶ What you'll see: single linkage tracks the crescent connectivity better, while k-means remains trapped by spherical Voronoi geometry.

👀 **Takeaway.** k-means is not a universal clustering method; it works best when clusters are compact, similarly sized, and roughly spherical in the chosen feature space.

#### A2. Feature scaling and standardization effect

**Goal.** Show that Euclidean clustering changes when one feature has a much larger scale than another.  
**Data source.** `iris`.  
**We'll build this in 5 steps:** use all Iris features, distort one scale, cluster raw distorted data, standardize, and compare assignments.

```python
iris_a2 = load_iris()  # load the full four-feature Iris dataset.
X_a2 = iris_a2.data.copy()  # copy measurements so scaling experiments do not mutate the source object.
y_a2 = iris_a2.target.copy()  # keep species labels for post-fit evaluation.
feature_names_a2 = iris_a2.feature_names  # keep feature names for axis labels and scale inspection.
X_distorted_a2 = X_a2.copy()  # create a separate matrix for the scale-distortion demonstration.
X_distorted_a2[:, 0] = X_distorted_a2[:, 0] * 100.0  # exaggerate sepal length so it dominates Euclidean distance.
print("Distorted standard deviations:", dict(zip(feature_names_a2, np.round(X_distorted_a2.std(axis=0), 2))))  # show the scale imbalance numerically.
```

```python
plt.figure(figsize=(6.5, 5.2))  # create a plot of the distorted first two features.
plt.scatter(X_distorted_a2[:, 0], X_distorted_a2[:, 2], s=48, alpha=0.82, c="gray")  # show the feature with exaggerated scale against petal length.
plt.title("A2 step 1: one feature artificially dominates distance")  # label the scale problem.
plt.xlabel("100 × sepal length")  # make the distorted axis explicit.
plt.ylabel("petal length")  # label the comparison feature.
plt.show()  # render the distorted feature view.
```

▶ What you'll see: the horizontal axis scale is enormous, so nearest-centroid distance will mostly care about sepal length.

```python
raw_model_a2 = KMeans(n_clusters=3, init="k-means++", n_init=30, random_state=229)  # configure k-means on distorted raw features.
raw_labels_a2 = raw_model_a2.fit_predict(X_distorted_a2)  # fit using the unstandardized distorted feature matrix.
raw_ari_a2 = adjusted_rand_score(y_a2, raw_labels_a2)  # compare raw-scale clusters to species labels after fitting.
raw_sil_a2 = silhouette_score(X_distorted_a2, raw_labels_a2)  # compute silhouette in the distorted distance space.
print(f"Raw distorted features: silhouette={raw_sil_a2:.2f}, ARI={raw_ari_a2:.2f}")  # report the raw-scale result.
```

```python
plt.figure(figsize=(6.5, 5.2))  # create the raw-scale clustering plot.
plot_2d_points(X_distorted_a2[:, [0, 2]], labels=raw_labels_a2, centers=raw_model_a2.cluster_centers_[:, [0, 2]], title="A2 step 2: clustering before standardization")  # visualize clustering in two displayed dimensions.
plt.xlabel("100 × sepal length")  # label the distorted horizontal feature.
plt.ylabel("petal length")  # label the vertical feature.
plt.show()  # render raw-scale clusters.
```

▶ What you'll see: clusters are strongly organized by the oversized horizontal feature, even if biology depends on other features.

```python
X_scaled_a2, scaler_a2 = standardize_for_clustering(X_distorted_a2)  # standardize every feature to equalize distance contributions.
print("Scaled means:", np.round(X_scaled_a2.mean(axis=0), 3))  # verify centering close to zero.
print("Scaled standard deviations:", np.round(X_scaled_a2.std(axis=0), 3))  # verify unit variance after scaling.
```

```python
scaled_model_a2 = KMeans(n_clusters=3, init="k-means++", n_init=30, random_state=229)  # configure the same model after standardization.
scaled_labels_a2 = scaled_model_a2.fit_predict(X_scaled_a2)  # fit k-means in standardized feature space.
scaled_ari_a2 = adjusted_rand_score(y_a2, scaled_labels_a2)  # compare scaled clusters to species labels after fitting.
scaled_sil_a2 = silhouette_score(X_scaled_a2, scaled_labels_a2)  # compute silhouette in the standardized distance space.
print(f"Standardized features: silhouette={scaled_sil_a2:.2f}, ARI={scaled_ari_a2:.2f}")  # report the scaled result.
```

```python
fig, axes = plt.subplots(1, 2, figsize=(12, 5))  # create side-by-side raw-versus-scaled panels.
plot_2d_points(X_distorted_a2[:, [0, 2]], labels=raw_labels_a2, centers=raw_model_a2.cluster_centers_[:, [0, 2]], title=f"raw distorted ARI={raw_ari_a2:.2f}", ax=axes[0])  # show raw distorted clusters.
plot_2d_points(X_scaled_a2[:, [0, 2]], labels=scaled_labels_a2, centers=scaled_model_a2.cluster_centers_[:, [0, 2]], title=f"standardized ARI={scaled_ari_a2:.2f}", ax=axes[1])  # show standardized clusters.
axes[0].set_xlabel("100 × sepal length")  # label the raw x-axis.
axes[0].set_ylabel("petal length")  # label the raw y-axis.
axes[1].set_xlabel("scaled sepal length")  # label the scaled x-axis.
axes[1].set_ylabel("scaled petal length")  # label the scaled y-axis.
plt.tight_layout()  # keep panels readable.
plt.show()  # render the scaling comparison.
```

▶ What you'll see: standardization changes the geometry, usually improving agreement with species because no single measurement dominates by units alone.

```python
plt.figure(figsize=(6.5, 4.5))  # create the final metric comparison chart.
plt.bar(["raw distorted", "standardized"], [raw_ari_a2, scaled_ari_a2], color=["tomato", "seagreen"])  # compare external agreement before and after scaling.
plt.ylim(0, 1)  # use a fixed score scale.
plt.title("A2 final: scaling changes cluster quality")  # title the final result.
plt.ylabel("Adjusted Rand Index vs species")  # label the metric axis.
plt.show()  # render the metric comparison.
```

▶ What you'll see: the standardized pipeline is less controlled by arbitrary measurement units and is the safer default for distance-based clustering.

👀 **Takeaway.** If distance matters, units matter; standardization is usually a required preprocessing step before k-means, hierarchical Ward linkage, or PCA.

#### A3. Hierarchical clustering with a dendrogram

**Goal.** Build a dendrogram, cut it into clusters, and contrast hierarchical structure with k-means.  
**Data source.** `blobs` and `moons`.  
**We'll build this in 6 steps:** sample data, compute linkage, draw dendrogram, cut the tree, fit agglomerative clustering, and compare to k-means.

```python
X_a3_full, y_a3_full, _, _ = load_clustering_data("blobs", random_state=240)  # load compact blobs for a clean dendrogram first.
sample_idx_a3 = RNG.choice(X_a3_full.shape[0], size=80, replace=False)  # sample fewer points so dendrogram labels remain readable.
X_a3 = X_a3_full[sample_idx_a3]  # keep the sampled observations.
y_a3 = y_a3_full[sample_idx_a3]  # keep reference labels for later comparison.
plt.figure(figsize=(6.5, 5.2))  # create the sampled-data plot.
plt.scatter(X_a3[:, 0], X_a3[:, 1], s=48, alpha=0.82, c="gray")  # show the points that enter the dendrogram.
plt.title("A3 step 1: sampled blob data for dendrogram")  # label the sample.
plt.xlabel("feature 1")  # label the horizontal coordinate.
plt.ylabel("feature 2")  # label the vertical coordinate.
plt.show()  # render the dendrogram input points.
```

▶ What you'll see: a smaller set of points from three compact groups; fewer points make the tree easier to read.

```python
Z_ward_a3 = linkage(X_a3, method="ward")  # compute Ward linkage merges that minimize within-cluster distance.
print("First five linkage rows:\n", np.round(Z_ward_a3[:5], 3))  # show merge indices, distances, and cluster sizes for the earliest merges.
```

```python
plt.figure(figsize=(14, 5.5))  # create a wide dendrogram canvas.
dendrogram(Z_ward_a3, no_labels=True, color_threshold=9.0)  # draw the hierarchical merge tree without crowded leaf labels.
plt.axhline(9.0, color="crimson", linestyle="--", label="cut height")  # mark a horizontal cut that creates clusters.
plt.title("A3 step 2: Ward-linkage dendrogram")  # title the dendrogram.
plt.xlabel("data points")  # label the leaf axis.
plt.ylabel("merge distance")  # label the vertical merge-distance axis.
plt.legend()  # identify the cut line.
plt.show()  # render the dendrogram.
```

▶ What you'll see: short low merges within blobs and tall late merges between blobs; the cut line intersects three main branches.

```python
cut_labels_a3 = fcluster(Z_ward_a3, t=3, criterion="maxclust") - 1  # cut the linkage tree into exactly three clusters and convert labels to zero-based ids.
cut_sil_a3 = silhouette_score(X_a3, cut_labels_a3)  # compute silhouette for the dendrogram cut.
plt.figure(figsize=(6.5, 5.2))  # create the cut-result scatter plot.
plot_2d_points(X_a3, labels=cut_labels_a3, centers=None, title=f"A3 step 3: dendrogram cut, silhouette={cut_sil_a3:.2f}")  # show clusters implied by the horizontal cut.
plt.show()  # render the cut clusters.
```

▶ What you'll see: cutting the dendrogram at three groups recovers the visible blob structure.

```python
agg_ward_a3 = AgglomerativeClustering(n_clusters=3, linkage="ward")  # configure sklearn's agglomerative Ward clustering for the same objective.
agg_labels_a3 = agg_ward_a3.fit_predict(X_a3)  # fit agglomerative clustering directly to the sampled points.
km_a3 = KMeans(n_clusters=3, init="k-means++", n_init=30, random_state=229)  # configure k-means for comparison on compact blobs.
km_labels_a3 = km_a3.fit_predict(X_a3)  # fit k-means to the same points.
print(f"Ward silhouette={silhouette_score(X_a3, agg_labels_a3):.2f}; k-means silhouette={silhouette_score(X_a3, km_labels_a3):.2f}")  # compare internal quality on the easy shape.
```

```python
fig, axes = plt.subplots(1, 2, figsize=(12, 5))  # create a side-by-side comparison.
plot_2d_points(X_a3, labels=agg_labels_a3, centers=None, title="Agglomerative Ward", ax=axes[0])  # show hierarchical Ward clusters.
plot_2d_points(X_a3, labels=km_labels_a3, centers=km_a3.cluster_centers_, title="k-means", ax=axes[1])  # show k-means clusters.
plt.tight_layout()  # keep comparison panels readable.
plt.show()  # render the blob comparison.
```

▶ What you'll see: on compact blobs, Ward hierarchical clustering and k-means often agree because both favor compact groups.

```python
X_a3_moons, y_a3_moons, _, _ = load_clustering_data("moons", random_state=241)  # load a non-convex dataset to contrast linkage choices.
agg_single_a3 = AgglomerativeClustering(n_clusters=2, linkage="single")  # configure single linkage for connectivity-shaped clusters.
labels_single_a3 = agg_single_a3.fit_predict(X_a3_moons)  # fit single linkage to the moon data.
agg_complete_a3 = AgglomerativeClustering(n_clusters=2, linkage="complete")  # configure complete linkage for compact-diameter clusters.
labels_complete_a3 = agg_complete_a3.fit_predict(X_a3_moons)  # fit complete linkage to the same moon data.
print(f"Single-linkage ARI={adjusted_rand_score(y_a3_moons, labels_single_a3):.2f}; complete-linkage ARI={adjusted_rand_score(y_a3_moons, labels_complete_a3):.2f}")  # compare linkage behavior on non-convex shapes.
```

```python
fig, axes = plt.subplots(1, 2, figsize=(12, 5))  # create linkage comparison panels.
plot_2d_points(X_a3_moons, labels=labels_single_a3, centers=None, title="single linkage on moons", ax=axes[0])  # show chain-based clustering.
plot_2d_points(X_a3_moons, labels=labels_complete_a3, centers=None, title="complete linkage on moons", ax=axes[1])  # show diameter-based clustering.
plt.tight_layout()  # avoid overlap.
plt.show()  # render the linkage comparison.
```

▶ What you'll see: linkage choice changes the answer; single linkage can follow curves, while complete linkage prefers compact separated sets.

```python
plt.figure(figsize=(7, 4.5))  # create the final method-summary plot.
method_names_a3 = ["Ward blobs", "k-means blobs", "single moons", "complete moons"]  # name each evaluated method-context pair.
method_scores_a3 = [silhouette_score(X_a3, agg_labels_a3), silhouette_score(X_a3, km_labels_a3), adjusted_rand_score(y_a3_moons, labels_single_a3), adjusted_rand_score(y_a3_moons, labels_complete_a3)]  # collect comparable diagnostic scores for the summary.
plt.bar(method_names_a3, method_scores_a3, color=["steelblue", "darkorange", "seagreen", "purple"])  # draw the summary bars.
plt.xticks(rotation=20, ha="right")  # rotate labels so method names fit.
plt.title("A3 final: hierarchical clustering depends on linkage")  # title the final comparison.
plt.ylabel("score")  # label the score axis.
plt.show()  # render the final summary.
```

▶ What you'll see: no linkage rule is universally best; the data geometry determines which rule is appropriate.

👀 **Takeaway.** A dendrogram is not just a clustering result; it is a full merge history that lets you inspect cluster structure at many resolutions.

#### A4. High-dimensional data with PCA projection

**Goal.** Cluster a high-dimensional real dataset, then use PCA to visualize the result without pretending the model saw only two dimensions.  
**Data source.** `wine`.  
**We'll build this in 6 steps:** load features, scale, fit k-means in full dimension, compute PCA, plot explained variance, and visualize clusters in 2-D PCA space.

```python
X_a4, y_a4, feature_names_a4, _ = load_clustering_data("wine", random_state=229)  # load all Wine chemical features.
print(f"Wine shape: {X_a4.shape}")  # report rows and dimensions for the high-dimensional setting.
print("First five features:", feature_names_a4[:5])  # show representative feature names.
print("Raw standard deviations:", np.round(X_a4.std(axis=0)[:5], 2))  # show scale differences that motivate standardization.
```

```python
X_scaled_a4, scaler_a4 = standardize_for_clustering(X_a4)  # standardize all chemical features before distance-based clustering.
print("Scaled feature mean range:", (round(X_scaled_a4.mean(axis=0).min(), 3), round(X_scaled_a4.mean(axis=0).max(), 3)))  # verify near-zero feature means.
print("Scaled feature std range:", (round(X_scaled_a4.std(axis=0).min(), 3), round(X_scaled_a4.std(axis=0).max(), 3)))  # verify unit feature scales.
```

```python
model_a4 = KMeans(n_clusters=3, init="k-means++", n_init=50, random_state=229)  # configure k-means for the known three wine cultivars.
labels_a4 = model_a4.fit_predict(X_scaled_a4)  # fit in the full standardized feature space.
sil_a4 = silhouette_score(X_scaled_a4, labels_a4)  # compute silhouette in the same full space used by the model.
ari_a4 = adjusted_rand_score(y_a4, labels_a4)  # compare clusters to cultivar labels after fitting.
print(f"Full-dimensional k-means: inertia={model_a4.inertia_:.1f}, silhouette={sil_a4:.2f}, ARI={ari_a4:.2f}")  # summarize clustering quality.
```

```python
pca_full_a4 = PCA(random_state=229)  # configure PCA to compute the whole variance spectrum.
pca_full_a4.fit(X_scaled_a4)  # fit PCA on standardized features so variance is not unit-driven.
explained_a4 = np.cumsum(pca_full_a4.explained_variance_ratio_)  # compute cumulative explained variance.
plt.figure(figsize=(7, 4.8))  # create the explained-variance plot.
plt.plot(np.arange(1, len(explained_a4) + 1), explained_a4, marker="o")  # show how much variance is captured as components are added.
plt.axhline(0.8, color="crimson", linestyle="--", label="80% variance")  # mark a common variance-retention target.
plt.title("A4 step 1: PCA cumulative explained variance")  # title the PCA diagnostic.
plt.xlabel("number of principal components")  # label the component-count axis.
plt.ylabel("cumulative explained variance")  # label the variance axis.
plt.legend()  # identify the target line.
plt.show()  # render the variance curve.
```

▶ What you'll see: the first few principal components capture a large fraction of standardized Wine variation, but not all of it.

```python
pca2_a4 = PCA(n_components=2, random_state=229)  # configure a two-dimensional projection for visualization.
X_pca2_a4 = pca2_a4.fit_transform(X_scaled_a4)  # project standardized data into the first two principal-component coordinates.
centers_pca2_a4 = pca2_a4.transform(model_a4.cluster_centers_)  # project full-dimensional centroids into the same two-dimensional PCA space.
print("PC1+PC2 explained variance:", round(pca2_a4.explained_variance_ratio_.sum(), 3))  # report how much information the plot preserves.
```

```python
fig, axes = plt.subplots(1, 2, figsize=(12, 5))  # create side-by-side PCA plots.
plot_2d_points(X_pca2_a4, labels=labels_a4, centers=centers_pca2_a4, title="clusters projected by PCA", ax=axes[0])  # show k-means clusters in PC space.
plot_2d_points(X_pca2_a4, labels=y_a4, centers=None, title="true cultivars in PCA space", ax=axes[1])  # show cultivar labels for post-fit interpretation.
axes[0].set_xlabel("PC1")  # label the first principal component.
axes[0].set_ylabel("PC2")  # label the second principal component.
axes[1].set_xlabel("PC1")  # label the first principal component on the reference panel.
axes[1].set_ylabel("PC2")  # label the second principal component on the reference panel.
plt.tight_layout()  # keep panels readable.
plt.show()  # render the PCA comparison.
```

▶ What you'll see: clusters fitted in all 13 dimensions become visible in two principal-component axes, with strong but imperfect cultivar alignment.

```python
component_loadings_a4 = pca2_a4.components_.T  # collect feature loadings for the first two principal components.
loading_strength_a4 = np.linalg.norm(component_loadings_a4, axis=1)  # measure how strongly each feature contributes to the 2-D PCA plane.
top_features_a4 = np.argsort(loading_strength_a4)[-6:][::-1]  # select the six features with largest loading magnitude.
plt.figure(figsize=(8, 4.8))  # create a loading-summary plot.
plt.bar([feature_names_a4[i] for i in top_features_a4], loading_strength_a4[top_features_a4], color="teal")  # show influential features in the projection.
plt.xticks(rotation=35, ha="right")  # rotate feature names for readability.
plt.title("A4 final: features most visible in the PCA map")  # title the interpretability plot.
plt.ylabel("loading magnitude on PC1-PC2")  # label the loading axis.
plt.show()  # render the feature-loading summary.
print(f"Final full-space silhouette={sil_a4:.2f}; PCA plot preserves {pca2_a4.explained_variance_ratio_.sum():.1%} of variance.")  # connect the metric to the visualization limitation.
```

▶ What you'll see: the PCA map is interpretable through its strongest feature loadings, but the clustering metric still belongs to full standardized space.

👀 **Takeaway.** PCA is a visualization lens, not a replacement for high-dimensional clustering unless you deliberately fit the model on the reduced representation.

#### A5. Full real-data clustering pipeline

**Goal.** Run a complete unsupervised workflow: load real data, scale, choose $k$, fit, profile clusters, project to 2-D, and explain the groups.  
**Data source.** `wine` as the built-in URL-style real dataset; the same pipeline can be adapted to an uploaded CSV.  
**We'll build this in 8 steps:** load, audit scales, standardize, select $k$, fit, profile, visualize, and interpret.

```python
X_a5, y_a5, feature_names_a5, description_a5 = load_clustering_data("wine", random_state=229)  # load the real Wine dataset for the capstone pipeline.
print(f"Capstone dataset: {description_a5}")  # state the dataset in plain language.
print(f"Rows={X_a5.shape[0]}, features={X_a5.shape[1]}")  # report the matrix shape.
print("Feature names:", feature_names_a5)  # print all feature names because profiles will use them.
```

```python
raw_std_a5 = X_a5.std(axis=0)  # compute raw feature standard deviations to audit distance scales.
plt.figure(figsize=(9, 4.8))  # create the scale-audit figure.
plt.bar(feature_names_a5, raw_std_a5, color="slateblue")  # show how differently features vary before scaling.
plt.xticks(rotation=45, ha="right")  # rotate feature names so all labels fit.
plt.title("A5 step 1: raw feature scales before clustering")  # title the scale audit.
plt.ylabel("standard deviation")  # label the scale axis.
plt.show()  # render the scale audit.
```

▶ What you'll see: raw Wine features have very different spreads, so unscaled Euclidean distance would be dominated by high-variance columns.

```python
X_scaled_a5, scaler_a5 = standardize_for_clustering(X_a5)  # standardize the full real dataset before selecting k.
print("After scaling, mean of first five features:", np.round(X_scaled_a5.mean(axis=0)[:5], 3))  # verify centering for a few columns.
print("After scaling, std of first five features:", np.round(X_scaled_a5.std(axis=0)[:5], 3))  # verify unit spread for a few columns.
```

```python
k_grid_a5 = np.arange(2, 9)  # evaluate plausible cluster counts from two through eight.
inertia_grid_a5 = []  # store k-means distortion for each k.
silhouette_grid_a5 = []  # store silhouette for each k.
for k in k_grid_a5:  # loop over candidate cluster counts.
    model = KMeans(n_clusters=int(k), init="k-means++", n_init=50, random_state=229)  # use many restarts for stable capstone results.
    labels = model.fit_predict(X_scaled_a5)  # fit k-means in standardized space.
    inertia_grid_a5.append(model.inertia_)  # record distortion for the elbow view.
    silhouette_grid_a5.append(silhouette_score(X_scaled_a5, labels))  # record separation for the silhouette view.
print("k grid:", k_grid_a5.tolist())  # print evaluated k values.
print("silhouettes:", np.round(silhouette_grid_a5, 3).tolist())  # print silhouette values for exact comparison.
```

```python
fig, axes = plt.subplots(1, 2, figsize=(12, 4.8))  # create elbow and silhouette panels.
axes[0].plot(k_grid_a5, inertia_grid_a5, marker="o", linewidth=2.5)  # plot inertia across candidate k values.
axes[0].set_title("A5 step 2: elbow curve")  # title the elbow panel.
axes[0].set_xlabel("k")  # label the cluster-count axis.
axes[0].set_ylabel("inertia")  # label the distortion axis.
axes[1].plot(k_grid_a5, silhouette_grid_a5, marker="o", color="seagreen", linewidth=2.5)  # plot silhouette across candidate k values.
axes[1].set_title("A5 step 3: silhouette by k")  # title the silhouette panel.
axes[1].set_xlabel("k")  # label the cluster-count axis.
axes[1].set_ylabel("mean silhouette")  # label the silhouette axis.
plt.tight_layout()  # avoid overlap between panels.
plt.show()  # render the k-selection diagnostics.
```

▶ What you'll see: inertia decreases with $k$, while silhouette usually favors a small number of well-separated Wine groups.

```python
chosen_k_a5 = int(k_grid_a5[np.argmax(silhouette_grid_a5)])  # choose the k with the highest silhouette for this capstone pipeline.
final_model_a5 = KMeans(n_clusters=chosen_k_a5, init="k-means++", n_init=80, random_state=229)  # configure a final stable model at the selected k.
labels_a5 = final_model_a5.fit_predict(X_scaled_a5)  # fit the final model and produce cluster assignments.
final_sil_a5 = silhouette_score(X_scaled_a5, labels_a5)  # compute final silhouette in standardized space.
final_ari_a5 = adjusted_rand_score(y_a5, labels_a5)  # compare to wine cultivar labels only after unsupervised fitting.
print(f"Chosen k={chosen_k_a5}, final silhouette={final_sil_a5:.3f}, ARI vs cultivar={final_ari_a5:.3f}")  # report final capstone metrics.
```

```python
cluster_profiles_a5 = np.vstack([X_scaled_a5[labels_a5 == j].mean(axis=0) for j in range(chosen_k_a5)])  # compute standardized mean feature profile for each cluster.
plt.figure(figsize=(12, 1.8 + 0.45 * chosen_k_a5))  # size the heatmap based on the number of clusters.
sns.heatmap(cluster_profiles_a5, cmap="vlag", center=0, xticklabels=feature_names_a5, yticklabels=[f"cluster {j}" for j in range(chosen_k_a5)], cbar_kws={"label": "standardized mean"})  # show which features are high or low in each cluster.
plt.xticks(rotation=45, ha="right")  # rotate feature names for readability.
plt.title("A5 step 4: cluster-profile heatmap")  # title the profile visualization.
plt.show()  # render the heatmap.
```

▶ What you'll see: each cluster has a feature signature; red means above-average standardized value and blue means below-average standardized value.

```python
pca_a5 = PCA(n_components=2, random_state=229)  # configure PCA for final two-dimensional visualization.
X_pca_a5 = pca_a5.fit_transform(X_scaled_a5)  # project all standardized observations into two principal components.
centers_pca_a5 = pca_a5.transform(final_model_a5.cluster_centers_)  # project final cluster centers into the PCA view.
plt.figure(figsize=(7, 5.5))  # create the final map figure.
plot_2d_points(X_pca_a5, labels=labels_a5, centers=centers_pca_a5, title=f"A5 step 5: final clusters in PCA map, silhouette={final_sil_a5:.2f}")  # show final clusters in a readable 2-D projection.
plt.xlabel("PC1")  # label the first principal component.
plt.ylabel("PC2")  # label the second principal component.
plt.show()  # render the final PCA map.
```

▶ What you'll see: the final clusters form separated regions in the PCA map, but overlap can remain because the model was fit in all dimensions.

```python
cluster_sizes_a5 = np.bincount(labels_a5, minlength=chosen_k_a5)  # count how many observations fall in each cluster.
for cluster_id in range(chosen_k_a5):  # summarize each cluster in plain language using its strongest profile features.
    top_high = np.argsort(cluster_profiles_a5[cluster_id])[-3:][::-1]  # find the three most above-average features for this cluster.
    top_low = np.argsort(cluster_profiles_a5[cluster_id])[:3]  # find the three most below-average features for this cluster.
    high_names = [feature_names_a5[i] for i in top_high]  # convert high-feature indices to names.
    low_names = [feature_names_a5[i] for i in top_low]  # convert low-feature indices to names.
    print(f"Cluster {cluster_id}: n={cluster_sizes_a5[cluster_id]}, high={high_names}, low={low_names}")  # print an interpretable profile statement.
```

```python
plt.figure(figsize=(7, 4.8))  # create the final capstone metric figure.
plt.bar(["silhouette", "ARI vs cultivar", "PC variance shown"], [final_sil_a5, final_ari_a5, pca_a5.explained_variance_ratio_.sum()], color=["seagreen", "darkorange", "steelblue"])  # summarize internal quality, external agreement, and visualization coverage.
plt.ylim(0, 1)  # use a common metric scale.
plt.title("A5 final: capstone diagnostics")  # title the summary chart.
plt.ylabel("score or fraction")  # label the score axis.
plt.show()  # render the final diagnostic summary.
```

▶ What you'll see: a compact dashboard of the final cluster quality, label agreement, and how much variance the 2-D PCA view displays.

👀 **Takeaway.** A publication-quality clustering result is a pipeline, not a single `.fit()`: scale features, choose $k$, fit robustly, validate geometry, profile clusters, and state limitations.

### Interactive Experiment

Use the sliders to change the dataset, spread, initialization method, and number of clusters. Watch how the same k-means algorithm succeeds on round blobs and fails on crescent moons.

```python
def interactive_kmeans(k=3, cluster_std=0.8, init="k-means++", source="blobs"):  # define the function that ipywidgets will rerun after each slider change.
    if source == "blobs":  # create spherical clusters when the source dropdown is blobs.
        X_live, y_live = make_blobs(n_samples=360, centers=3, cluster_std=cluster_std, random_state=229)  # generate blobs with controllable spread.
    elif source == "moons":  # create curved clusters when the source dropdown is moons.
        X_live, y_live = make_moons(n_samples=360, noise=min(cluster_std / 10.0, 0.35), random_state=229)  # map the spread slider to moon noise.
    else:  # create a real-data view when the source dropdown is iris.
        iris_live = load_iris()  # load Iris for a stable real-data option.
        X_live = iris_live.data[:, [0, 2]]  # keep two visible features.
        y_live = iris_live.target  # keep hidden labels only for optional mental comparison.
    model_live = KMeans(n_clusters=k, init=init, n_init=10, random_state=229)  # configure k-means with the selected controls.
    labels_live = model_live.fit_predict(X_live)  # fit the selected model to the selected data.
    score_live = silhouette_score(X_live, labels_live) if len(np.unique(labels_live)) > 1 else np.nan  # compute silhouette when at least two clusters exist.
    plt.figure(figsize=(7, 5.5))  # create a fresh live plot for the current slider state.
    plot_2d_points(X_live, labels=labels_live, centers=model_live.cluster_centers_, title=f"interactive k={k}, init={init}, silhouette={score_live:.2f}")  # show clusters and centroids for the selected settings.
    plt.show()  # render the interactive plot.

interact(interactive_kmeans, k=IntSlider(value=3, min=2, max=8, step=1, description="k"), cluster_std=FloatSlider(value=0.8, min=0.2, max=2.5, step=0.1, description="spread"), init=Dropdown(options=["k-means++", "random"], value="k-means++", description="init"), source=Dropdown(options=["blobs", "moons", "iris"], value="blobs", description="source"));  # display interactive controls for live clustering experiments.
```

▶ What you'll see: increasing spread lowers silhouette, random initialization can change the result, larger $k$ can over-split blobs, and moons remain a geometry mismatch for k-means.
