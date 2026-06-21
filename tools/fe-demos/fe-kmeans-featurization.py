# K-means featurization (model stacking): cluster the data first, then use each
# point's CLUSTER MEMBERSHIP as new features for a downstream LINEAR model.
#
# THE STORY:
#   The "two moons" dataset has two interlocking crescent shapes. The boundary
#   between them is CURVED. A plain linear model (LogisticRegression) can only
#   draw ONE straight line, so it slices both moons in half and gets a lot wrong.
#   FIX: run KMeans with MANY small clusters to "tile" the curved shape. Replace
#   each point's [x, y] with a one-hot vector saying WHICH cluster it landed in.
#   The SAME linear model now assigns a weight per cluster -> it can stitch
#   together a piecewise, curved-looking boundary that follows the moons.

import numpy as np
import matplotlib.pyplot as plt
from sklearn.datasets import make_moons
from sklearn.cluster import KMeans
from sklearn.preprocessing import OneHotEncoder
from sklearn.linear_model import LogisticRegression

# ----------------------------------------------------------------------------
# 1. LOAD DATA. The classic two-moons dataset: two crescent shapes that curve
#    around each other. We use sklearn's bundled generator (no download) with a
#    fixed random_state so the numbers reproduce exactly every run.
# ----------------------------------------------------------------------------
X, y = make_moons(n_samples=400, noise=0.1, random_state=0)   # X is (400, 2)

# ----------------------------------------------------------------------------
# 2. VISUALIZE THE RAW DATA. Scatter colored by class. You can SEE that the two
#    moons interlock -- no single straight line can cleanly separate them.
# ----------------------------------------------------------------------------
fig, axes = plt.subplots(1, 2, figsize=(12, 5))

# Build a grid of points covering the plot so we can paint each model's
# decision region (the colored background = what the model predicts there).
x_min, x_max = X[:, 0].min() - 0.5, X[:, 0].max() + 0.5
y_min, y_max = X[:, 1].min() - 0.5, X[:, 1].max() + 0.5
gx, gy = np.meshgrid(np.linspace(x_min, x_max, 300),
                     np.linspace(y_min, y_max, 300))
grid = np.column_stack([gx.ravel(), gy.ravel()])   # every pixel as an [x, y]

# ----------------------------------------------------------------------------
# 3. REPRODUCE THE PROBLEM. Fit a LINEAR model on the raw [x, y] coordinates.
#    Its decision boundary is a single straight line -> it cuts across the
#    curved moons and misclassifies many points. Print the accuracy.
# ----------------------------------------------------------------------------
lin = LogisticRegression()
lin.fit(X, y)
acc_raw = lin.score(X, y)                            # train accuracy on raw [x, y]
print(f"PROBLEM  -- linear model on raw [x, y]            accuracy = {acc_raw:.3f}")

ax = axes[0]
zz = lin.predict(grid).reshape(gx.shape)             # prediction at each pixel
ax.contourf(gx, gy, zz, alpha=0.25, cmap="coolwarm") # colored regions = model
ax.scatter(X[y == 0, 0], X[y == 0, 1], c="tab:blue",   s=14, label="class 0")
ax.scatter(X[y == 1, 0], X[y == 1, 1], c="tab:red",    s=14, label="class 1")
ax.set_title(f"RAW [x, y]: linear model FAILS\n"
             f"one straight line can't follow the moons (acc={acc_raw:.3f})")
ax.set_xlabel("x"); ax.set_ylabel("y")
ax.legend(loc="upper right", fontsize=8)

# ----------------------------------------------------------------------------
# 4. APPLY THE TECHNIQUE. Run KMeans with MANY clusters (k=30) to tile the two
#    crescents with little patches. Each point's new feature is a one-hot vector
#    naming its cluster: cluster 7 -> [0,0,...,1,...,0]. We overlay the cluster
#    centroids on the moons so you can SEE the manifold being tiled.
# ----------------------------------------------------------------------------
K = 30
km = KMeans(n_clusters=K, n_init=10, random_state=0)
clusters = km.fit_predict(X)                         # which cluster each point is in

enc = OneHotEncoder(sparse_output=False, categories=[range(K)])
X_eng = enc.fit_transform(clusters.reshape(-1, 1))   # (400, K) one-hot features

ax = axes[1]
# Decision region of the FIXED model (computed in step 5) painted underneath.
grid_clusters = km.predict(grid)
grid_eng = enc.transform(grid_clusters.reshape(-1, 1))

# ----------------------------------------------------------------------------
# 5. SHOW THE FIX. Fit the SAME LogisticRegression on the one-hot cluster
#    features. It learns a weight per cluster, so its boundary is piecewise and
#    hugs the moons. Accuracy jumps. Print it and the before/after summary.
# ----------------------------------------------------------------------------
clf = LogisticRegression(max_iter=1000)
clf.fit(X_eng, y)
acc_eng = clf.score(X_eng, y)
print(f"FIX      -- same model on k-means cluster one-hot  accuracy = {acc_eng:.3f}")

zz2 = clf.predict(grid_eng).reshape(gx.shape)        # fixed model at each pixel
ax.contourf(gx, gy, zz2, alpha=0.25, cmap="coolwarm")
ax.scatter(X[y == 0, 0], X[y == 0, 1], c="tab:blue", s=14, label="class 0")
ax.scatter(X[y == 1, 0], X[y == 1, 1], c="tab:red",  s=14, label="class 1")
ax.scatter(km.cluster_centers_[:, 0], km.cluster_centers_[:, 1],
           c="black", marker="x", s=60, lw=1.5, label=f"{K} cluster centroids")
ax.set_title(f"K-MEANS FEATURES: same linear model WORKS\n"
             f"cluster patches let it follow the moons (acc={acc_eng:.3f})")
ax.set_xlabel("x"); ax.set_ylabel("y")
ax.legend(loc="upper right", fontsize=8)

plt.tight_layout()
plt.show()

# Explicit before/after summary.
print(f"PROBLEM (raw): {acc_raw:.3f}   ->   FIX (engineered): {acc_eng:.3f}")
