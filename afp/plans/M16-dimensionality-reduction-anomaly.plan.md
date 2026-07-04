# Module Plan — M16 · Dimensionality reduction & anomaly detection

| Field | Value |
|---|---|
| Domain | Domain 3 · Unsupervised |
| Skip if you can already… | reduce/visualize high-dim features and flag outliers |
| Maps to (projects) | all |
| Primary structure(s) | S2 Method / Algorithm |
| Example type | ⚑ Both |
| Sub-lessons | 2 |
| Notebooks | 2 |

## Module hub (the "complete list")
High-dimensional features are hard to inspect, expensive to model, and easy to misunderstand. This
module teaches two related unsupervised skills: compressing/visualizing feature spaces and flagging
points that do not fit the learned pattern. The emphasis is practical: know what each projection or
outlier score can answer, and know what it cannot prove.

- M16.1 · Dimensionality reduction (PCA by hand; t-SNE/UMAP for visualization)
- M16.2 · Anomaly detection (reconstruction, Isolation Forest, LOF, Mahalanobis)

## Questions this module answers (→ which sub-lesson teaches the answer)
- Why reduce dimensionality, and what are the tradeoffs among compression, denoising, speed, and visualization? → M16.1
- How does PCA use covariance eigen-decomposition, explained variance, and projection? → M16.1
- How do you choose and interpret principal components? → M16.1
- How should t-SNE and UMAP be used, and why are they usually visualization tools rather than proof of clusters? → M16.1
- What is anomaly detection, and how do reconstruction error, Isolation Forest, LOF, and Mahalanobis distance flag outliers? → M16.2
- How do you choose an anomaly detector and threshold when labels are scarce? → M16.2
- How do dimensionality reduction and anomaly detection work together in high-dimensional AFP-style feature tables? → M16.1, M16.2

_Every question maps to a sub-lesson (coverage confirmed below)._

## Concepts (ƒ = genuine, central formula)
- Dimensionality reduction motives: compression, denoising, visualization, faster modeling, feature debugging
- PCA: centering, covariance matrix, eigen-decomposition, principal axes, projection **ƒ**
- Explained variance ratio and cumulative variance **ƒ**; loadings/component interpretation
- t-SNE and UMAP: nonlinear neighborhood embeddings, hyperparameters, stochasticity, visualization-only caveats
- Reconstruction error for PCA/autoencoder-style anomaly detection **ƒ**
- Isolation Forest: random splits isolate rare points quickly
- Local Outlier Factor (LOF): local density compared with neighbors
- Mahalanobis distance with covariance scaling **ƒ**
- Thresholding without labels: quantiles, expected alert budget, review set, slice checks, stability over time

## Sub-lessons

### M16.1 · Dimensionality reduction (PCA by hand; t-SNE/UMAP for viz)  —  [S2 Method, ⚑]
- **Makes answerable:** why reduce dimensionality; PCA covariance/eigen/projection/explained variance; choosing and interpreting components; t-SNE/UMAP use and caveats; how reduced views support AFP feature debugging.
- **You'll be able to say:** "I reduce dimensionality to compress correlated features, denoise, visualize, or speed later models, while accepting information loss. PCA centers data, finds covariance eigenvectors, projects rows onto top principal axes, and reports explained variance so I can pick enough components and inspect loadings. t-SNE/UMAP preserve neighborhoods for visualization, but their distances, cluster gaps, and apparent global geometry are not standalone evidence of real personas."
- **Concepts:** motives/tradeoffs, PCA covariance/eigen-decomposition/projection **ƒ**, explained variance **ƒ**, loadings, component interpretation, t-SNE/UMAP caveats.
- **Key Idea focus:** step-by-step pseudocode — scale/center, compute covariance, eigendecompose or call PCA, choose components by variance and validation need, inspect loadings, use UMAP/t-SNE only as a visual diagnostic.
- **Worked-example shape:** 10+5+5, process viz plus hand math — ten 2D PCA micro-calculations, five explained-variance/component-choice cases, five UMAP/t-SNE caveat readings.
- **Notebook:** Yes — correlated AFP-style engagement features plus a 2D hand-check cell; fit PCA, plot cumulative explained variance and loadings, compare PCA vs UMAP visualization; `assert` cumulative explained variance is non-decreasing and `assert` the selected n_components reaches the chosen threshold.
- **Real numbers to cite:** first 3 PCs explain, for example, 82% of variance; PC1 loadings high on clicks/views/dwell indicate general engagement; two UMAP blobs that disappear under a different seed/min_dist are visualization hypotheses, not labels.

### M16.2 · Anomaly detection (reconstruction, Isolation Forest, LOF, Mahalanobis)  —  [S2 Method, ⚑]
- **Makes answerable:** anomaly detection methods; reconstruction error; Isolation Forest; LOF; Mahalanobis distance; detector/threshold choice without labels; how anomaly detection pairs with reduced features.
- **You'll be able to say:** "An anomaly is a point that scores unusual under a chosen reference pattern, not automatically fraud or a bug. PCA reconstruction error flags points poorly represented by the normal subspace; Isolation Forest isolates rare points in fewer random splits; LOF compares local density with neighbors; Mahalanobis distance measures covariance-scaled distance from a center. With few labels, I set thresholds by alert budget/quantile, inspect top cases, check slices and stability, and tune for review usefulness."
- **Concepts:** reconstruction error **ƒ**, Isolation Forest, LOF, Mahalanobis distance **ƒ**, covariance/robust scaling, scarce-label thresholding, alert budget, review loop.
- **Key Idea focus:** step-by-step pseudocode — define normal reference data, scale robustly, fit detector, score points, set a threshold from budget/quantile, inspect top anomalies, and monitor drift/slice concentration.
- **Worked-example shape:** 10+5+5, process viz plus math — ten score computations, five threshold/alert-budget cases, five detector-choice comparisons on global vs local vs covariance-shaped outliers.
- **Notebook:** Yes — synthetic high-dimensional member/campaign features with injected global outliers, local-density anomalies, and correlated-feature anomalies; compare PCA reconstruction error, IsolationForest, LOF, and Mahalanobis; `assert` injected outliers appear in the top anomaly quantile for at least one appropriate detector; plot score histograms and top-row explanations.
- **Real numbers to cite:** top 1% threshold on 10,000 rows yields 100 review candidates; a point with high raw clicks may be normal after covariance scaling, while a rare combination of high spend and low engagement has large Mahalanobis distance; PCA reconstruction error above the 99th percentile flags off-subspace behavior.

## Coverage check
All 7 module questions are answered: dimensionality-reduction motives, PCA mechanics, component choice, and t-SNE/UMAP caveats → M16.1; anomaly detectors, scarce-label thresholding, and reduced-feature workflow → M16.2. No gaps.

## Decision guide (only if the module has a when-to-pick-X-vs-Y)
| Need / data shape | Prefer | Why / warning |
|---|---|---|
| Linear compression, denoising, interpretable loadings | PCA | Fast and explainable; only captures linear variance and is scale-sensitive. |
| Visualizing local neighborhoods | UMAP or t-SNE | Useful for exploratory plots; do not treat visual gaps as validated clusters. |
| Off-subspace anomalies after linear compression | PCA reconstruction error | Good when normal data lies near a low-rank subspace; misses anomalies inside that subspace. |
| Generic high-dimensional outlier ranking | Isolation Forest | Few assumptions and scalable; scores need threshold/review calibration. |
| Local density anomalies | LOF | Finds points unusual relative to neighbors; sensitive to neighborhood size and scaling. |
| Correlated numeric features with a stable covariance estimate | Mahalanobis | Accounts for covariance; fragile with non-Gaussian data, outliers, or singular covariance. |

## Resources (from the guide)
- UMAP docs (nonlinear manifold embedding for visualization)
- PyOD docs (outlier detectors with a common API)
- scikit-learn — decomposition & outlier detection (PCA, IsolationForest, LOF)

## SOTA papers (from the guide)
- UMAP (McInnes et al., 2018)

## Notes / caveats
- **Overlaps the concurrent `topics/12-dimensionality-reduction.md` lesson.** Reference it for the broader dimensionality-reduction walkthrough; keep M16 focused on AFP high-dimensional feature debugging plus anomaly review workflows.
- Keep genuine math where it belongs: PCA projection/explained variance, reconstruction error, and Mahalanobis distance. t-SNE/UMAP, Isolation Forest, and LOF should be taught primarily as algorithmic intuition plus caveats.
- Anomaly scores are triage signals, not accusations. Always include review-budget thresholding, slice checks, and examples where a visually extreme point is benign after scaling/covariance context.
