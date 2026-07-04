# Lesson Plan — 31 Unsupervised Learning in AI (k-means, PCA)

| Field | Value |
|---|---|
| Source | CS 221 |
| Content category | Method |
| Example type | 💻 Colab |
| Colab notebook | Yes |
| Est. lesson time | 40–55 min |
| Source topic file | ../31-unsupervised-learning-ai.md |

## Part 1 — Overview (plan)
Unsupervised learning discovers latent structure without labels: k-means assigns points to clusters, while PCA finds directions of maximum variance. Hook: the same feature vectors can reveal groups, compression, or failure modes depending on geometry.

## Part 2 — Key Idea (plan)
- **Focus (per category = Method):** step-by-step algorithms for k-means clustering and PCA projection in an AI feature-vector setting.
- **Core artifacts to present:** clustering assignment $z_i\in\{1,\dots,k\}$; k-means objective $Loss_{k\text{-means}}=\sum_{i=1}^m\lVert\phi(x_i)-\mu_{z_i}\rVert^2$; assign step $z_i=\arg\min_j\lVert\phi(x_i)-\mu_j\rVert^2$; centroid update $\mu_j=\sum_i1_{z_i=j}\phi(x_i)/\sum_i1_{z_i=j}$; eigenvalue/eigenvector equation $Az=\lambda z$; spectral theorem for symmetric covariance; PCA normalization, covariance $\Sigma=\frac1m\sum_i x^{(i)}x^{(i)T}$, top eigenvectors $u_1,\dots,u_k$, projection onto their span, explained variance.

## Part 3 — Worked Examples

### 🟢 Basics (10)
| # | Title | Data source | Visualization(s) | Build steps |
|---|---|---|---|---|
| B1 | Compute squared distance from one point to one centroid | toy 2-D point and centroid | printed coordinate differences | ~2 |
| B2 | Assign one point to the nearest of two centroids | toy 2-D point and two centroids | tiny point-and-centroids plot | ~3 |
| B3 | Center a tiny matrix column by column for PCA | tiny 3×2 matrix | printed mean and centered matrix | ~3 |
| B4 | Recompute one centroid mean | toy assigned 2-D points | printed mean coordinates | ~2 |
| B5 | Compute total inertia for assigned points | toy points, labels, centroids | printed per-point costs | ~3 |
| B6 | Compute covariance of two centered features | tiny centered 3×2 matrix | printed covariance matrix | ~2 |
| B7 | Project one point onto one axis | toy centered point and unit axis | printed projected coordinate | ~2 |
| B8 | Compute variance explained by one component | toy eigenvalues | printed variance ratios | ~2 |
| B9 | Run one k-means assignment-update iteration | four toy 2-D points | printed labels and updated centers | ~3 |
| B10 | Build a distance matrix for three points | three toy 2-D points | printed pairwise distance table | ~2 |

### 🟡 Easy (5)
| # | Title | Data source | Visualization(s) | Build steps |
|---|---|---|---|---|
| E1 | k-means from scratch on three clean blobs | `blobs` | process: centroid initialization, assignment colors, centroid movement; result: colored clusters + final inertia | ~5 |
| E2 | One k-means iteration microscope | Tiny 2-D hand-sized array in notebook | process: distance matrix heatmap; result: assignment table and centroid update arrows | ~5 |
| E3 | Choosing $k$ with inertia and silhouette | `blobs` with known cluster count hidden | process: inertia and silhouette over $k=1..8$; result: elbow/silhouette selected $k$ marked | ~4 |
| E4 | PCA on a tilted 2-D cloud | Correlated Gaussian points | process: centered data, covariance ellipse, eigenvectors; result: PC axis projection with variance labels | ~5 |
| E5 | PCA compression and reconstruction | `digits` images | process: explained-variance curve; result: original vs reconstructed digits for multiple component counts | ~5 |

### 🔴 Advanced (5)
| # | Title | Data source | Visualization(s) | Build steps |
|---|---|---|---|---|
| A1 | Failure case: k-means on non-convex clusters | `moons` | process: centroid movement on crescents; result: wrong Voronoi-style clusters vs true shape | ~6 |
| A2 | Feature scaling changes both k-means and PCA | `wine` or synthetic features with mismatched units | process: raw vs standardized distance/covariance comparison; result: cluster map and PCA axes before/after scaling | ~6 |
| A3 | PCA as AI feature visualization | `digits` high-dimensional image features | process: standardize → covariance/SVD → project; result: 2-D PCA scatter colored by true digit labels | ~6 |
| A4 | Cluster in PCA space vs original space | `digits` or `wine` | process: PCA dimensionality sweep then k-means; result: accuracy/proxy metrics, silhouette, and projection map | ~7 |
| A5 | End-to-end unsupervised pipeline with upload/url option | `url`/`upload` tabular feature dataset fallback to `wine` | process: load → clean/scale → PCA → choose $k$ → k-means → profile clusters; result: cluster-profile heatmap + PCA map + interpretation | ~8 |

## Part 4 — Colab Notebook
- **Notebook file:** topics/notebooks/31-unsupervised-learning-ai.ipynb
- **Est. cell count:** ~110 (💻 topic → all 20 examples (10 basics + 5 easy + 5 advanced) coded with granular build↔see loops)
- **Key libraries:** numpy, pandas, matplotlib, scikit-learn (`make_blobs`, `make_moons`, `load_digits`, `load_wine`, `KMeans`, `PCA`, `StandardScaler`, `silhouette_score`), ipywidgets
- **Runtime:** CPU
- **Failure/edge dataset included:** `moons` in A1 — demonstrates that k-means' squared-distance/Voronoi geometry fails on non-convex crescent clusters.
- **Signature visualizations:** k-means centroid movement and final clusters; PCA principal axes/projection with explained variance; cluster-profile heatmap after PCA+k-means pipeline.
