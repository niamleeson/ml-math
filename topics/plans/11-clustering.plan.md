# Lesson Plan — 11 Clustering: EM, k-means, Hierarchical

| Field | Value |
|---|---|
| Source | CS 229 |
| Content category | Method |
| Example type | 💻 Colab |
| Colab notebook | Yes |
| Est. lesson time | 40–55 min |
| Source topic file | ../11-clustering.md |

## Part 1 — Overview (plan)
Clustering finds structure in **unlabeled** data by grouping similar points. Hook: "same data, different
assumptions → very different groups" — motivate why the choice of algorithm and geometry matters.

## Part 2 — Key Idea (plan)
- **Focus (per category = Method):** step-by-step algorithm (pseudocode) for k-means; contrast with EM (soft
  assignment) and hierarchical (linkage).
- **Core artifacts to present:** k-means objective (distortion) $J=\sum_i \lVert x^{(i)}-\mu_{c^{(i)}}\rVert^2$;
  assign→update loop; EM as soft k-means; linkage criteria table; cluster-quality metrics (inertia, silhouette).

## Part 3 — Worked Examples

### 🟢 Basics (3)
| # | Title | Data source | Visualization(s) | Build steps |
|---|---|---|---|---|
| B1 | Squared distance from one point to one centroid | toy 2-D point and centroid | printed values; point-to-centroid segment | ~2 |
| B2 | Assign one point to the nearer of two centroids | toy 2-D point and two centroids | scatter with two distance segments and chosen centroid highlighted | ~3 |
| B3 | Update one centroid by averaging assigned points | tiny assigned point set | printed values; before/after centroid marker | ~3 |

### 🟡 Easy (5)
| # | Title | Data source | Visualization(s) | Build steps |
|---|---|---|---|---|
| E1 | k-means on 3 clean blobs ("hello world") | `blobs` | process: centroids migrating per iteration; result: colored clusters + centroids + inertia | ~4 |
| E2 | Choosing k — the elbow method | `blobs` | process: inertia for k=1..10; result: elbow curve with chosen k marked | ~3 |
| E3 | k-means on real data (Iris, 2 features) | `iris` | process: iterations; result: clusters vs. true species side-by-side | ~3 |
| E4 | Initialization matters (random vs k-means++) | `blobs` | process: outcomes across seeds; result: grid of runs + inertia per seed (local minima) | ~4 |
| E5 | Judging quality — silhouette score | `blobs` | process: per-sample silhouette; result: silhouette plot + mean score | ~3 |

### 🔴 Advanced (5)
| # | Title | Data source | Visualization(s) | Build steps |
|---|---|---|---|---|
| A1 | Where k-means FAILS (non-spherical) | `moons` | process: iterations on crescents; result: wrong clusters vs. true shape → diagnosis | ~5 |
| A2 | Feature scaling / standardization effect | `iris` (raw vs scaled) | process: distance distortion; result: side-by-side boundaries (scaling fixes it) | ~5 |
| A3 | Hierarchical clustering + dendrogram (contrast) | `blobs`/`moons` | process: dendrogram building by linkage; result: dendrogram + cut line vs. k-means map | ~6 |
| A4 | High-dimensional data + PCA projection | `url` (wine/digits) | process: variance explained; result: 2-D PCA projection colored by cluster | ~6 |
| A5 | Full pipeline on a real dataset (capstone) | `url`/`upload` | process: load→scale→select k→fit stages; result: cluster-profile heatmap + 2-D map + plain-language interpretation | ~8 |

## Part 4 — Colab Notebook
- **Notebook file:** notebooks/11-clustering.ipynb
- **Est. cell count:** ~78 (💻 topic → all 13 examples (3 basics + 5 easy + 5 advanced) coded; granular build↔see loops)
- **Key libraries:** numpy, matplotlib, scikit-learn (`make_blobs`, `make_moons`, `KMeans`, `AgglomerativeClustering`, `silhouette_samples`, `PCA`), scipy (`dendrogram`)
- **Runtime:** CPU
- **Failure/edge dataset included:** `moons` in A1 — shows k-means' spherical-cluster assumption breaking.
- **Signature visualizations:** animated centroid migration; dendrogram with cut line; silhouette plot.
