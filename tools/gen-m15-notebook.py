#!/usr/bin/env python3
"""Generate afp/notebooks/M15-clustering.ipynb.

A runnable, VERY beginner-friendly Colab notebook for module M15: clustering &
cohort/persona discovery. Part A covers k-means (Lloyd's assign->update loop),
choosing k with the elbow + silhouette, silhouette by hand, and GMM soft
assignment. Part B covers density clustering and validation without labels:
the two-moons break case where k-means fails and DBSCAN recovers the shape and
marks noise.

Toy-example standard: tiny hand-traceable data, detailed step-by-step process,
print logging on every step, a visualization for every idea, a break case, and
asserts that pin the result. Colab-preinstalled libraries only
(numpy / scikit-learn / matplotlib). Run: python3 tools/gen-m15-notebook.py
"""
import json, os

cells = []
def md(t):   cells.append({"cell_type": "markdown", "metadata": {}, "source": t.strip("\n").splitlines(keepends=True)})
def code(s): cells.append({"cell_type": "code", "metadata": {}, "execution_count": None, "outputs": [], "source": s.strip("\n").splitlines(keepends=True)})

# ------------------------------------------------------------------- intro
md(r"""
# M15 · Clustering & Cohort/Persona Discovery — ✍️ Toy Example, Step by Tiny Step

**Companion to lesson M15. Written for someone new to ML.**

Clustering finds **structure before labels exist**: cohorts, personas, candidate groups. But a
cluster is a **hypothesis, not a truth** — so this notebook also teaches how to *validate* clusters
when you have no answer key. Every step below **prints** the numbers it computes and **draws a
picture** so you can *see* what is happening. Run the cells top to bottom; nothing needs the internet.

**What you'll do (every step has an explanation, logging, and a picture):**
- **Part A · k-means & validation:** the assign→update loop by hand, choosing **k** with the elbow
  and **silhouette**, silhouette computed by hand, and **GMM** soft assignment.
- **Part B · density clustering & the break case:** where k-means *fails* (two moons) and
  **DBSCAN** recovers the shape and marks **noise**.
""")

md(r"""
## Step 0 · Setup

Import NumPy (arrays/distances), Matplotlib (pictures), and a few scikit-learn helpers. Fix the
**seed** so the printed numbers are reproducible, and define a tiny `log()` helper.
""")
code(r"""
import numpy as np
import matplotlib.pyplot as plt
from sklearn.cluster import KMeans, DBSCAN
from sklearn.mixture import GaussianMixture
from sklearn.metrics import silhouette_score
from sklearn.datasets import make_moons

np.random.seed(0)
plt.rcParams["figure.figsize"] = (6, 4)

def log(label, value):
    print(f"[{label}] {value}")

log("setup", "tools ready — NumPy + scikit-learn + Matplotlib imported, seed fixed to 0")
""")

# =================================================================== PART A
md("---\n# Part A · k-means & validating clusters")

md(r"""
## Step 1 · A tiny dataset (10 points in 2 obvious blobs)

We start with 10 unlabeled points, hand-picked into two visible groups so you can check every
result by eye.
""")
code(r"""
X = np.array([[1,1],[1,2],[2,1],[1,3],[2,2],   # blob near (1,2)
              [8,8],[9,8],[8,9],[9,9],[8,7]], float)  # blob near (8,8)
log("X (10 points)", X.tolist())

plt.scatter(X[:,0], X[:,1], c="gray"); plt.title("Step 1 — raw unlabeled points")
plt.xlabel("feature 1"); plt.ylabel("feature 2"); plt.show()
""")
md("▶ What you'll see: ten gray points in two clear clumps — no labels yet.")

md(r"""
## Step 2 · k-means by hand — the assign → update loop

k-means alternates two moves until nothing changes:
1. **Assign** each point to its **nearest centroid** (smallest distance).
2. **Update** each centroid to the **average** of the points assigned to it.

We start the centroids deliberately *off* at `(0,0)` and `(10,10)`, and print the **inertia**
(total squared distance to the assigned centroid — the thing k-means minimizes) after each round.
""")
code(r"""
centroids = np.array([[0.0, 0.0], [10.0, 10.0]])   # deliberately bad start
inertias = []
for it in range(4):
    # --- assign: distance from every point to every centroid, pick the nearest ---
    dists = np.linalg.norm(X[:, None, :] - centroids[None, :, :], axis=2)  # shape 10x2 (each point's distance to both centroids)
    assign = dists.argmin(axis=1)                        # iter 0 -> [0 0 0 0 0 1 1 1 1 1]  (nearest centroid per point)
    inertia = float((dists[np.arange(len(X)), assign] ** 2).sum())  # iter 0 -> 63.0, then 8.0, 8.0, 8.0
    inertias.append(inertia)
    log(f"iter {it}: assignments", assign.tolist())
    log(f"iter {it}: inertia (total squared distance)", round(inertia, 2))
    # --- update: move each centroid to the mean of its members ---
    for k in range(2):
        if (assign == k).any():
            centroids[k] = X[assign == k].mean(axis=0)   # after iter 0 -> [[1.4, 1.8], [8.4, 8.2]]  (mean of each cluster)
    log(f"iter {it}: new centroids", np.round(centroids, 2).tolist())

assert inertias[-1] <= inertias[0]                                  # it got better
assert all(inertias[i+1] <= inertias[i] + 1e-9 for i in range(len(inertias)-1))  # never worse

# picture: final clusters + centroids
plt.scatter(X[:,0], X[:,1], c=assign, cmap="coolwarm")
plt.scatter(centroids[:,0], centroids[:,1], marker="X", s=200, c="black")
plt.title("Step 2 — k-means result (points colored by cluster, X = centroids)"); plt.show()
""")
md("▶ What you'll see: inertia drops (e.g. 63 → 8 → 8), the assignments stop changing, and the "
   "centroids land in the middle of each blob.")

md(r"""
## Step 3 · Choosing k — elbow (inertia) + silhouette

We didn't *know* there were 2 clusters. Two label-free diagnostics help pick **k**:
- **Inertia (elbow):** always falls as k rises — look for the bend where it stops dropping fast.
- **Silhouette:** a score in −1…1 for how compact-and-separated the clusters are (higher = better).

The trap: inertia falls *forever*, so it can't pick k alone. Silhouette usually peaks at the right k.
""")
code(r"""
ks = range(2, 6)
inertia_by_k, sil_by_k = {}, {}
for k in ks:
    km = KMeans(n_clusters=k, n_init=10, random_state=0).fit(X)
    inertia_by_k[k] = km.inertia_                            # falls with k: 8.00, 5.83, 3.67, 2.83
    sil_by_k[k] = silhouette_score(X, km.labels_)            # peaks at k=2: 0.858, 0.547, 0.251, 0.175
    log(f"k={k}", f"inertia={km.inertia_:.2f}  silhouette={sil_by_k[k]:.3f}")

best_k = max(sil_by_k, key=sil_by_k.get)                    # -> 2  (highest silhouette)
log("best k by silhouette", best_k)
assert best_k == 2

fig, ax = plt.subplots(1, 2, figsize=(10, 3.6))
ax[0].plot(list(ks), [inertia_by_k[k] for k in ks], "-o"); ax[0].set_title("elbow (inertia)")
ax[0].set_xlabel("k"); ax[0].set_ylabel("inertia")
ax[1].plot(list(ks), [sil_by_k[k] for k in ks], "-o"); ax[1].set_title("silhouette")
ax[1].set_xlabel("k"); ax[1].set_ylabel("silhouette (higher = better)")
plt.tight_layout(); plt.show()
""")
md("▶ What you'll see: inertia keeps falling with k, while silhouette **peaks at k=2** — the honest answer.")

md(r"""
## Step 4 · Silhouette by hand (so it isn't a black box)

For one point, silhouette = **(b − a) / max(a, b)** where
`a` = average distance to points **in its own cluster**, and
`b` = average distance to points **in the nearest other cluster**.
Near **1** = snug in its cluster and far from others (good).
""")
code(r"""
km2 = KMeans(n_clusters=2, n_init=10, random_state=0).fit(X)
labels = km2.labels_
p = 0                                                        # look at point 0 = [1,1]
own   = [q for q in range(len(X)) if labels[q] == labels[p] and q != p]
other = [q for q in range(len(X)) if labels[q] != labels[p]]
a = np.mean([np.linalg.norm(X[p] - X[q]) for q in own])     # avg distance within its cluster
b = np.mean([np.linalg.norm(X[p] - X[q]) for q in other])   # avg distance to the other cluster
sil = (b - a) / max(a, b)
log("point 0", X[p].tolist())
log("a = avg distance to OWN cluster", round(a, 3))
log("b = avg distance to OTHER cluster", round(b, 3))
log("silhouette = (b - a) / max(a, b)", round(sil, 3))
assert sil > 0.5                                            # clearly well-clustered
""")
md("▶ What you'll see: a is tiny (~1.35), b is large (~10.3), so silhouette ≈ 0.87 — a confidently placed point.")

md(r"""
## Step 5 · GMM — soft assignment (a point can partly belong to two clusters)

k-means says "you are 100% in cluster 1." A **Gaussian Mixture Model** gives **responsibilities**:
soft memberships that sum to 1. On **overlapping** data, a boundary point can be ~50/50 — genuine
uncertainty k-means hides.
""")
code(r"""
# two OVERLAPPING blobs so a boundary point is genuinely ambiguous
G = np.vstack([np.random.normal([0, 0], 1.0, (30, 2)),
               np.random.normal([2.6, 0], 1.0, (30, 2))])
gmm = GaussianMixture(n_components=2, random_state=0).fit(G)
resp = gmm.predict_proba(G)                                 # 60 x 2 responsibilities (each row sums to 1)
entropy = -(resp * np.log(resp + 1e-12)).sum(axis=1)        # higher = more ambiguous
amb = int(entropy.argmax())
log("most ambiguous point", np.round(G[amb], 2).tolist())
log("its responsibilities [cluster0, cluster1]", np.round(resp[amb], 3).tolist())
assert abs(resp[amb].sum() - 1.0) < 1e-9                    # responsibilities are a probability

plt.scatter(G[:,0], G[:,1], c=resp[:,0], cmap="coolwarm")   # color = P(cluster 0)
plt.scatter(*G[amb], marker="*", s=250, c="black")
plt.title("Step 5 — GMM soft membership (color = P(cluster 0); star = most ambiguous)"); plt.show()
""")
md("▶ What you'll see: the boundary point's responsibilities are ~[0.50, 0.50] — soft membership, not a hard label.")

# =================================================================== PART B
md("---\n# Part B · Density clustering & the break case")

md(r"""
## Step 6 · Two moons — where k-means BREAKS and DBSCAN wins

k-means only makes **round** clusters, so it fails on non-spherical shapes. **DBSCAN** groups points
by **density** instead: dense regions become clusters, sparse points are marked **noise** (label −1),
and it needs **no k**. We add 3 obvious outliers so you can watch DBSCAN flag them as noise.
""")
code(r"""
Xm, _ = make_moons(n_samples=60, noise=0.06, random_state=0)
outliers = np.array([[-1.2, 1.2], [2.2, 1.2], [0.5, -1.5]])   # 3 points in sparse regions
Xm = np.vstack([Xm, outliers])

# k-means (forced k=2): slices the moons the WRONG way
km_moons = KMeans(n_clusters=2, n_init=10, random_state=0).fit(Xm)

# DBSCAN: follows density, recovers the two crescents, marks the outliers as noise
db = DBSCAN(eps=0.35, min_samples=5).fit(Xm)
n_clusters = len(set(db.labels_)) - (1 if -1 in db.labels_ else 0)
n_noise = int((db.labels_ == -1).sum())
log("DBSCAN clusters found", n_clusters)
log("DBSCAN noise points (label -1)", n_noise)
log("labels of the 3 outliers (want -1)", db.labels_[-3:].tolist())
assert n_clusters == 2 and n_noise >= 1                       # 2 crescents + the outliers flagged

fig, ax = plt.subplots(1, 2, figsize=(10, 3.8))
ax[0].scatter(Xm[:,0], Xm[:,1], c=km_moons.labels_, cmap="coolwarm")
ax[0].set_title("k-means (k=2) — WRONG: cuts the moons in half")
noise = db.labels_ == -1
ax[1].scatter(Xm[~noise,0], Xm[~noise,1], c=db.labels_[~noise], cmap="coolwarm")
ax[1].scatter(Xm[noise,0], Xm[noise,1], c="black", marker="x", s=80, label="noise")
ax[1].set_title("DBSCAN — RIGHT: 2 crescents + noise"); ax[1].legend()
plt.tight_layout(); plt.show()
""")
md("▶ What you'll see: k-means slices both crescents down the middle, while DBSCAN traces each moon "
   "and marks the 3 outliers as noise (x).")

md(r"""
## Recap — the M15 toolkit

- **k-means** = assign to nearest centroid → move centroid to the **average** → repeat; it minimizes
  **inertia** but only makes **round** clusters and needs **k**.
- **Choose k** by combining the **elbow** and **silhouette** — never trust inertia alone.
- **Silhouette** = `(b − a)/max(a,b)`; validate **without labels** using silhouette + stability + human sense.
- **GMM** gives **soft** membership (responsibilities) for overlapping clusters.
- **DBSCAN/HDBSCAN** cluster by **density**, handle **arbitrary shapes**, and mark **noise** — the fix
  when k-means breaks (two moons).

**Decision guide:** round blobs → k-means · overlapping ellipses → GMM · arbitrary shapes + outliers →
DBSCAN · variable density → HDBSCAN. And always: **a cluster is a hypothesis, not a causal segment.**
""")

nb = {"cells": cells,
      "metadata": {"kernelspec": {"display_name": "Python 3", "language": "python", "name": "python3"},
                   "language_info": {"name": "python"}},
      "nbformat": 4, "nbformat_minor": 5}
out = os.path.join(os.path.dirname(__file__), "..", "afp", "notebooks", "M15-clustering.ipynb")
with open(out, "w") as f:
    json.dump(nb, f, indent=1)
print("wrote", os.path.relpath(out), "with", len(cells), "cells",
      f"({sum(c['cell_type']=='code' for c in cells)} code)")
