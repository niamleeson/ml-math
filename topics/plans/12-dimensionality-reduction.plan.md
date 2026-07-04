# Lesson Plan — 12 Dimensionality Reduction: PCA & ICA

| Field | Value |
|---|---|
| Source | CS 229 |
| Content category | Method |
| Example type | ⚖️ Both |
| Colab notebook | Yes |
| Est. lesson time | 45–60 min |
| Source topic file | ../12-dimensionality-reduction.md |

## Part 1 — Overview (plan)
Dimensionality reduction compresses high-dimensional data while preserving the structure that matters. Hook: PCA finds directions of maximum variance, while ICA tries to recover independent hidden sources from mixed observations.

## Part 2 — Key Idea (plan)
- **Focus (per category = Method):** step-by-step algorithms for PCA and ICA, with the hand math on tiny matrices before scaling to real datasets.
- **Core artifacts to present:** eigenvalue/eigenvector definition $Az=\lambda z$; spectral theorem $A=U\Lambda U^T$ for symmetric covariance matrices; PCA normalize→covariance→eigenvectors→project loop; explained variance ratio; reconstruction error; ICA mixing model $x=As$, unmixing matrix $W=A^{-1}$, likelihood $p(x)=\prod_i p_s(w_i^Tx)|W|$, and Bell-Sejnowski stochastic gradient update.

## Part 3 — Worked Examples

### 🟢 Basics (10)
| # | Title | Data source | Visualization(s) | Build steps |
|---|---|---|---|---|
| B1 | Center a tiny matrix column by column | toy 3×2 matrix | printed values; before/after mini heatmap | ~3 |
| B2 | Compute covariance between two centered features | toy centered feature columns | printed values; tiny covariance heatmap | ~3 |
| B3 | Project one point onto a given unit axis | toy 2-D point and unit vector | point, axis, and projected coordinate on a line | ~3 |
| B4 | Compute variance of one feature | toy feature column | printed values; squared-deviation bars | ~2 |
| B5 | Unit-normalize a vector | toy 2-D vector | printed values; original/unit vector arrows | ~2 |
| B6 | Compute explained variance ratio | toy eigenvalues | printed values; ratio bar + cumulative line | ~2 |
| B7 | Reconstruct one point from one component | toy mean, axis, coordinate | printed values; component-line reconstruction | ~2 |
| B8 | Dot two orthonormal vectors | toy unit axes | printed values; perpendicular vector arrows | ~2 |
| B9 | Total variance as covariance trace | toy covariance matrix | printed values; covariance heatmap | ~2 |
| B10 | Eigenvalues of a 2×2 covariance matrix by formula | toy 2×2 covariance matrix | printed values; eigenvalue bars | ~2 |

### 🟡 Easy (5)
| # | Title | Data source | Visualization(s) | Build steps |
|---|---|---|---|---|
| E1 | Hand-compute eigenvectors of a 2×2 covariance matrix | Pen-and-paper: $\Sigma=\begin{bmatrix}3&1\\1&3\end{bmatrix}$ | principal axes drawn on a 2-D ellipse; variance along each axis labeled | ~4 |
| E2 | PCA projection by hand for four centered 2-D points | Pen-and-paper: $(2,0),(0,2),(-2,0),(0,-2)$ after scaling | original points + chosen unit vector + 1-D projected coordinates | ~4 |
| E3 | PCA on a tilted Gaussian cloud | `gaussian_2d` synthetic | process: mean-centering and covariance heatmap; result: principal axes drawn over scatter | ~5 |
| E4 | Explained variance on Iris | `iris` | scree plot / cumulative variance explained; 2-D PCA projection colored by species | ~4 |
| E5 | Reconstruction from 1, 2, and 3 principal components | `digits` small image data | variance-explained curve; original vs reconstructed digit grid | ~5 |

### 🔴 Advanced (5)
| # | Title | Data source | Visualization(s) | Build steps |
|---|---|---|---|---|
| A1 | PCA failure: high variance is not always predictive | synthetic `variance_trap` with low-variance class signal | scatter with class labels; PC1/PC2 axes; classification accuracy before/after projection | ~6 |
| A2 | Scaling changes PCA directions | `wine` raw vs standardized | raw/scaled covariance heatmaps; side-by-side principal axes or loading bars | ~6 |
| A3 | ICA source separation for mixed signals | synthetic sine + square + sawtooth signals mixed by matrix $A$ | observed mixtures, recovered independent components, correlation-to-source heatmap | ~7 |
| A4 | PCA denoising vs information loss | noisy `digits` | noise level panels; reconstruction error vs number of PCs; denoised image grid | ~7 |
| A5 | Capstone: reduce a real dataset then inspect loadings | `breast_cancer` or `wine` | 2-D projection, loading biplot, cumulative variance, failure notes for overlapping classes | ~8 |

## Part 4 — Colab Notebook
- **Notebook file:** notebooks/12-dimensionality-reduction.ipynb
- **Est. cell count:** ~82 (⚖️ topic → all 13 examples (3 basics + 5 easy + 5 advanced) live in the notebook with granular build↔see loops)
- **Key libraries:** numpy, matplotlib, scikit-learn (`PCA`, `FastICA`, `StandardScaler`, `load_iris`, `load_digits`, `load_wine`, `load_breast_cancer`)
- **Runtime:** CPU
- **Failure/edge dataset included:** `variance_trap` in A1 — shows PCA can discard low-variance but label-relevant information.
- **Signature visualizations:** principal axes drawn on scatterplots; variance-explained / scree curve; 2-D projection and reconstruction grids.
