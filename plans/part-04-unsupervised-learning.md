# Part 4 — Unsupervised Learning

> Plan only — per-topic revamp plan. See ../00-MASTER-PLAN.md for the shared design & family registry (F1–F17).
> **Code style:** every notebook code cell is written one statement per line (newline-split, blank lines between logical groups) for readability — never dense, semicolon-packed one-liners. See ../00-MASTER-PLAN.md §B.4.
> Dominant families: F2 (Clustering/Density) and F3 (Dim-Reduction/Manifold).

### 4.1 — k-means & k-means++   [notebook: 4.1-k-means-plus-plus.ipynb]   (family: F2)

**Lesson — Real World Applications (5):**
1. Customer segmentation — assign each profile to the nearest segment center; lesson toy distance $0.25$ vs $16.25$ makes the nearer segment auditable.
2. Image color quantization — compress pixels to $k$ representative colors; illustrative $k=4$ centers gives the lesson's $J=4\cdot0.25=1.00$ toy audit.
3. Document clustering — group embeddings by nearest centroid; illustrative 2-centroid decision mirrors the lesson's min-distance rule.
4. Warehouse location — choose representative depots for delivery points; illustrative point $[1,2]$ is much closer to $[1,1.5]$ than $[4.5,4]$.
5. Sensor fleet summarization — replace many readings by centroids; cite lesson pitfall that unscaled units can dominate every distance.

**Notebook plan:**
- Family: F2 Clustering / Density
- Concept built once (D1): implement `method(X, k, init="kmeans++")` with assign/update steps; verify the lesson's $0.25$, $16.25$, and $J=1.00$ on four hand points.
- Datasets D1–D5: 4 pts · blobs · moons/anisotropic · iris(unlabeled) · digits
- Metric: silhouette across all rungs, with ARI shown only when hidden labels are available.
- Closing viz: (a) cluster-assignment panels  (b) silhouette-vs-complexity curve
- Pitfall on D5: unscaled pixel features dominate; reproduce with raw/offset features, then fix with scaling and stability reruns.
- Notes: delete dead template helper code; keep k-means++ seeding deterministic.

### 4.2 — Mean-shift clustering   [notebook: 4.2-mean-shift.ipynb]   (family: F2)

**Lesson — Real World Applications (5):**
1. Retail hotspot discovery — move stores/customers toward dense regions; lesson kernel weights $[0.607,1.000,0.607]$ normalize to middle influence $0.452$.
2. GPS stop detection — cluster repeated coordinates without choosing $k$; illustrative bandwidth $h=1$ uses the lesson's distance-to-weight calculation.
3. Cell microscopy — find nuclei centers as density modes; illustrative three-neighbor query gives $1/2.213=0.452$ central pull.
4. Social-event geofencing — find crowd modes from check-ins; cite lesson caveat that locality scale controls which pattern appears.
5. Feature-space mode seeking — summarize embeddings by density peaks; lesson pitfall: unscaled dimensions silently dominate distances.

**Notebook plan:**
- Family: F2 Clustering / Density
- Concept built once (D1): implement `method(X, bandwidth)` that iteratively shifts each point to a kernel-weighted mean; verify the lesson's $h=1$, sum $2.213$, weight $0.452$.
- Datasets D1–D5: 4 pts · blobs · moons/anisotropic · iris(unlabeled) · digits
- Metric: silhouette across all rungs.
- Closing viz: (a) cluster-assignment/mode panels  (b) silhouette-vs-complexity curve
- Pitfall on D5: bandwidth instability; reproduce mode explosion/collapse, then fix with bandwidth sweep and stability checks.
- Notes: remove unused generated helpers; emphasize no preset $k$ but a strong bandwidth dependence.

### 4.3 — Affinity propagation   [notebook: 4.3-affinity-propagation.ipynb]   (family: F2)

**Lesson — Real World Applications (5):**
1. Choosing exemplar documents — every article negotiates an exemplar; illustrative similarity weights reuse the lesson's normalized $0.452$ influence.
2. Product catalog deduplication — pick representative SKUs from pairwise similarities; illustrative $h=1$ distances $[1,0,1]$ yield sum $2.213$.
3. Image set summarization — select exemplar frames without preselecting $k$; lesson pitfall warns the optimized criterion is not ground truth.
4. Protein family grouping — use pairwise similarity messages; illustrative preference changes can flip exemplars, matching lesson stability warning.
5. Support-ticket routing — cluster tickets around exemplar cases; lesson number $0.607=e^{-0.5}$ keeps the similarity calculation re-derivable.

**Notebook plan:**
- Family: F2 Clustering / Density
- Concept built once (D1): implement `method(similarity, preference, damping)` with responsibilities/availabilities; verify the lesson's kernel-style normalized influence $0.452$ on a tiny similarity table.
- Datasets D1–D5: 4 pts · blobs · moons/anisotropic · iris(unlabeled) · digits
- Metric: silhouette across all rungs.
- Closing viz: (a) exemplar-labeled cluster panels  (b) silhouette-vs-complexity curve
- Pitfall on D5: preference/damping instability; reproduce exemplar count flips, then fix with preference sweep and resampled stability checks.
- Notes: delete dead template code; keep message updates visibly small enough to audit.

### 4.4 — Hierarchical / agglomerative clustering   [notebook: 4.4-agglomerative-clustering.ipynb]   (family: F2)

**Lesson — Real World Applications (5):**
1. Taxonomy building — merge nearest items into a dendrogram; lesson toy distance $0.25$ beats $16.25$ for the first local decision.
2. Gene-expression grouping — inspect nested sample clusters; illustrative four-point merge can be checked against lesson $J=1.00$.
3. News topic hierarchy — cut a tree at different granularities; lesson pitfall: output is not ground truth.
4. Fraud case triage — group similar investigations before labels exist; illustrative 2-centroid distances show scale sensitivity.
5. Customer journey analysis — nested cohorts from behavior vectors; cite lesson stability check under resampling and linkage changes.

**Notebook plan:**
- Family: F2 Clustering / Density
- Concept built once (D1): implement `method(X, linkage, n_clusters)` that builds a merge trace and cuts it; verify the lesson's $0.25$, $16.25$, $J=1.00$ toy distances.
- Datasets D1–D5: 4 pts · blobs · moons/anisotropic · iris(unlabeled) · digits
- Metric: silhouette across all rungs.
- Closing viz: (a) cluster-assignment panels plus D1 dendrogram  (b) silhouette-vs-complexity curve
- Pitfall on D5: linkage choice changes the tree; reproduce single/complete/ward disagreement, then fix with scaling and stability reruns.
- Notes: remove dead helpers; keep dendrogram only for D1/D2 to avoid clutter.

### 4.5 — DBSCAN, OPTICS & HDBSCAN   [notebook: 4.5-dbscan-optics-hdbscan.ipynb]   (family: F2)

**Lesson — Real World Applications (5):**
1. GPS trajectory cleaning — dense stops become clusters and sparse pings become noise; illustrative $\epsilon$ neighborhoods use lesson distance decisions.
2. Fraud ring discovery — dense transaction neighborhoods surface groups; cite lesson warning that scale controls every distance.
3. Astronomy source detection — dense sky regions separated by sparse space; illustrative 4-point toy can yield $J=1.00$ when summarized.
4. Network intrusion triage — mark rare traffic as noise; lesson pitfall: training objective alone can fit noise.
5. Store catchment analysis — irregular regions need non-round clusters; illustrative moons rung demonstrates why centroid-only blobs fail.

**Notebook plan:**
- Family: F2 Clustering / Density
- Concept built once (D1): implement `method(X, eps, min_samples)` labeling core/border/noise; compare to lesson distance arithmetic $0.25$ vs $16.25$ for neighbor decisions.
- Datasets D1–D5: 4 pts · blobs · moons/anisotropic · iris(unlabeled) · digits
- Metric: silhouette on non-noise points, with noise rate reported alongside it.
- Closing viz: (a) cluster/noise assignment panels  (b) silhouette-vs-complexity curve
- Pitfall on D5: eps/min_samples sensitivity; reproduce all-noise or one-cluster collapse, then fix with k-distance plot and scaling.
- Notes: delete dead template code; if HDBSCAN is unavailable, plan DBSCAN/OPTICS only with a note.

### 4.6 — BIRCH   [notebook: 4.6-birch.ipynb]   (family: F2, gap)

**Lesson — Real World Applications (5):**
1. Streaming customer clustering — compress many points into clustering features; illustrative four-point summary matches lesson $J=1.00$ audit.
2. Log-event preclustering — maintain compact subclusters before global clustering; lesson distance $0.25$ vs $16.25$ shows threshold decisions.
3. Sensor network summarization — store counts/sums instead of all readings; illustrative 2-point subcluster center is re-derived by averaging.
4. Large image patch grouping — reduce patches into CF leaves; cite lesson pitfall that unscaled features dominate thresholds.
5. Incremental anomaly screening — tiny CF leaves can flag unusual areas; illustrative threshold chosen as "illustrative," not a lesson claim.

**Notebook plan:**
- Family: F2 Clustering / Density
- Concept built once (D1): implement `method(X, threshold, branching_factor)` as a small CF-tree sketch; verify lesson-style nearest-center distances $0.25$, $16.25$, and $J=1.00$.
- Datasets D1–D5: 4 pts · blobs · moons/anisotropic · iris(unlabeled) · digits
- Metric: silhouette across all rungs.
- Closing viz: (a) cluster-assignment panels with CF centroids  (b) silhouette-vs-complexity curve
- Pitfall on D5: threshold/order sensitivity; reproduce different digit clusters under shuffled order, then fix with scaling and threshold sweep.
- Notes: gap topic; lesson body may need richer BIRCH-specific authoring before notebook cites beyond generic distance math.

### 4.7 — Fuzzy c-means   [notebook: 4.7-fuzzy-c-means.ipynb]   (family: F2)

**Lesson — Real World Applications (5):**
1. Medical risk strata — patients can partly belong to multiple phenotypes; lesson responsibilities $[0.30,0.70]$ make soft membership visible.
2. Customer personas — one user can be 30% budget and 70% premium in the lesson's normalized toy.
3. Image segmentation — boundary pixels receive mixed memberships; lesson weighted update uses $[0.8,0.6,0.1]$ over $x=[0,1,4]$.
4. Climate-zone mapping — locations near borders are fuzzy; illustrative two-cluster memberships sum to $1.00$ as in the lesson.
5. Topic modeling pre-step — documents share clusters; cite lesson pitfall that soft assignments are still optimized criteria, not truth.

**Notebook plan:**
- Family: F2 Clustering / Density
- Concept built once (D1): implement `method(X, c, m)` returning memberships and centers; verify lesson score normalization $[0.30,0.70]$ and weighted mean update.
- Datasets D1–D5: 4 pts · blobs · moons/anisotropic · iris(unlabeled) · digits
- Metric: silhouette after hardening by max membership.
- Closing viz: (a) cluster-assignment panels with membership opacity  (b) silhouette-vs-complexity curve
- Pitfall on D5: fuzzifier/scale can hide ambiguous digits; reproduce over-soft memberships, then fix with scaling and $m$ sweep.
- Notes: remove generated dead helpers; preserve soft-vs-hard distinction.

### 4.8 — Gaussian Mixture Models & EM   [notebook: 4.8-gmm-em.ipynb]   (family: F2)

**Lesson — Real World Applications (5):**
1. Speaker diarization — frames have probabilistic speaker responsibilities; lesson $[0.30,0.70]$ responsibilities are the toy audit.
2. Customer mixture modeling — each account has soft segment probabilities; illustrative denominator $0.30+0.70=1.00$ is re-derivable.
3. Background subtraction — pixels are modeled as mixtures; lesson weighted update over $x=[0,1,4]$ shows EM's M-step shape.
4. Credit-risk cohorts — overlapping Gaussian cohorts avoid hard borders; cite lesson pitfall that optimized likelihood is not ground truth.
5. Sensor fault modes — multiple normal modes plus unusual readings; illustrative low-responsibility points flag candidates.

**Notebook plan:**
- Family: F2 Clustering / Density
- Concept built once (D1): implement `method(X, n_components)` with E-step responsibilities and M-step means; verify lesson responsibilities $[0.30,0.70]$ and weighted update.
- Datasets D1–D5: 4 pts · blobs · moons/anisotropic · iris(unlabeled) · digits
- Metric: silhouette from responsibility argmax across all rungs.
- Closing viz: (a) cluster-assignment panels with Gaussian ellipses  (b) silhouette-vs-complexity curve
- Pitfall on D5: covariance/initialization collapse; reproduce singular or tiny component, then fix with regularization and multiple seeds.
- Notes: delete dead template helpers; show likelihood only as secondary to the shared metric.

### 4.9 — Spectral clustering   [notebook: 4.9-spectral-clustering.ipynb]   (family: F2)

**Lesson — Real World Applications (5):**
1. Image segmentation graphs — pixels become affinity nodes; lesson Laplacian eigenvalues $[0.0,0.0,2.0,2.0]$ reveal two components.
2. Social-community detection — graph cuts separate communities; two zero eigenvalues in the lesson toy mean two disconnected groups.
3. Similarity search deduping — cluster items by graph affinity, not raw coordinates; illustrative degree vector $[1,1,1,1]$ is auditable.
4. Genomics sample graphs — nonlinear affinity clusters expression profiles; cite lesson pitfall about unscaled features in affinities.
5. Fraud network grouping — ring-like structures need graph geometry; illustrative two-component graph verifies the eigenvector mechanism.

**Notebook plan:**
- Family: F2 Clustering / Density
- Concept built once (D1): implement `method(X, affinity, n_clusters)` building $A,D,L$ and clustering eigenvectors; verify lesson $D=diag(1,1,1,1)$ and two zero eigenvalues.
- Datasets D1–D5: 4 pts · blobs · moons/anisotropic · iris(unlabeled) · digits
- Metric: silhouette across all rungs.
- Closing viz: (a) cluster-assignment panels plus D1 graph  (b) silhouette-vs-complexity curve
- Pitfall on D5: affinity scale/nearest-neighbor graph changes clusters; reproduce disconnected/overconnected graph, then fix with parameter sweep.
- Notes: remove dead helpers; keep graph matrices small and printed only for D1.

### 4.10 — Self-Organizing Maps   [notebook: 4.10-self-organizing-maps.ipynb]   (family: F2)

**Lesson — Real World Applications (5):**
1. Customer map dashboards — high-dimensional customers land on a 2D grid; lesson nearest-representative distance $0.25$ is the assignment audit.
2. Color palette maps — image colors organize on neighboring cells; illustrative four-color toy yields lesson-style $J=1.00$.
3. Industrial sensor maps — neighboring cells show operating regimes; cite lesson stability warning under hyperparameter reruns.
4. Document landscape maps — similar topics appear nearby; illustrative $[1,2]$ is far from $[4.5,4]$ by lesson distance $16.25$.
5. Fraud monitoring maps — unusual regions appear as sparse cells; lesson pitfall: map geometry is not ground truth.

**Notebook plan:**
- Family: F2 Clustering / Density
- Concept built once (D1): implement `method(X, grid_shape, sigma, lr)` with best-matching-unit assignment and neighbor updates; verify lesson nearest-center distances and $J=1.00$.
- Datasets D1–D5: 4 pts · blobs · moons/anisotropic · iris(unlabeled) · digits
- Metric: silhouette from BMU-derived clusters.
- Closing viz: (a) BMU cluster-assignment panels  (b) silhouette-vs-complexity curve
- Pitfall on D5: grid size and initialization create fragile maps; reproduce shuffled-seed changes, then fix with scaling and stability reruns.
- Notes: delete dead template code; optionally include a U-matrix only as an extra D5 panel.

### 4.11 — Cluster evaluation (silhouette, Davies–Bouldin, ARI)   [notebook: 4.11-cluster-evaluation.ipynb]   (family: F2)

**Lesson — Real World Applications (5):**
1. Model-selection reviews — compare clusterings with silhouette; lesson $a=0.50,b=3.00$ gives $s=0.833$.
2. Search-result grouping QA — reject tangled clusters using Davies-Bouldin; lesson scatters $0.40,0.50$ and separation $3.00$ give $DB=0.300$.
3. Bioinformatics validation — use ARI when hidden labels exist; illustrative labels are only for evaluation, not training.
4. Customer-segment governance — track stability over resamples; cite lesson pitfall that lower objective can fit noise.
5. Dashboard monitoring — report metric plus visual inspection; lesson warns output is criterion-aligned, not truth.

**Notebook plan:**
- Family: F2 Clustering / Density
- Concept built once (D1): implement `method(X, labels, y_true=None)` computing silhouette, Davies-Bouldin, and optional ARI; verify lesson $s=0.833$ and $DB=0.300$.
- Datasets D1–D5: 4 pts · blobs · moons/anisotropic · iris(unlabeled) · digits
- Metric: silhouette across all rungs.
- Closing viz: (a) cluster-assignment panels annotated with scores  (b) silhouette-vs-complexity curve
- Pitfall on D5: metric-only selection can prefer bad digit groupings; reproduce disagreement with ARI/visuals, then fix with multi-metric checks.
- Notes: delete dead helpers; this notebook becomes the evaluation reference for other F2 notebooks.

### 4.12 — Principal Component Analysis   [notebook: 4.12-pca.ipynb]   (family: F3)

**Lesson — Real World Applications (5):**
1. Genomics visualization — project thousands of genes to PCs; lesson singular energies $8$ and $2$ make first-PC variance $0.800$.
2. Finance risk factors — summarize correlated returns; illustrative two-factor toy uses lesson centered means $[2.50,2.50]$.
3. Image compression — keep leading directions; lesson first component retains $8/(8+2)=0.800$ of toy variance.
4. Sensor denoising — remove low-variance directions; cite lesson pitfall that unscaled features dominate covariance.
5. ML preprocessing — feed lower-dimensional features to later models; illustrative $m\times n$ to $m\times r$ follows lesson $Z=X_cV_r$.

**Notebook plan:**
- Family: F3 Dim-Reduction / Manifold
- Concept built once (D1): implement `method(X, n_components)` via centering, SVD, projection; verify lesson means $[2.50,2.50]$, singular values $[2.828,1.414]$, and explained variance $0.800$.
- Datasets D1–D5: 2D toy · swiss-roll · S-curve · digits · faces
- Metric: explained variance for linear PCA, with reconstruction error shown as a secondary check.
- Closing viz: (a) 2D-embedding panels  (b) explained-var-vs-complexity curve
- Pitfall on D5: unscaled face/pixel features dominate PCs; reproduce raw-scale distortion, then fix with centering/scaling.
- Notes: remove dead code; ensure D5 faces uses a bundled or lightweight sklearn source/subsample.

### 4.13 — Truncated SVD / Latent Semantic Analysis   [notebook: 4.13-truncated-svd-lsa.ipynb]   (family: F3)

**Lesson — Real World Applications (5):**
1. Search LSA — compress term-document matrices; lesson energies $8$ and $2$ give retained share $0.800$ in the toy.
2. Recommender latent factors — reduce sparse user-item matrices; illustrative $Z=X_cV_r$ maps many columns to $r$ factors.
3. Log template mining — discover latent event axes; lesson centered mean $2.50$ shows preprocessing arithmetic.
4. Topic exploration — documents cluster in low-rank space; cite lesson pitfall that factors are criterion outputs, not truth.
5. Embedding compression — reduce feature stores; illustrative 2 singular values retain $80\%$ of toy energy.

**Notebook plan:**
- Family: F3 Dim-Reduction / Manifold
- Concept built once (D1): implement `method(X, n_components)` using truncated SVD without dense centering for sparse-style data; verify lesson singular-value energy $0.800$ on the toy matrix.
- Datasets D1–D5: 2D toy · swiss-roll · S-curve · digits · faces
- Metric: explained variance across all rungs.
- Closing viz: (a) 2D-embedding panels  (b) explained-var-vs-complexity curve
- Pitfall on D5: interpreting latent axes literally; reproduce rotated-equivalent components, then fix with reconstruction/nearest-neighbor validation.
- Notes: delete dead helpers; include a small synthetic term-document D1 before geometric ladder.

### 4.14 — Kernel PCA   [notebook: 4.14-kernel-pca.ipynb]   (family: F3)

**Lesson — Real World Applications (5):**
1. Nonlinear sensor manifolds — unwrap curved operating states; lesson kernel weights with sum $2.213$ show locality.
2. Image pose embeddings — separate nonlinear pose variation; illustrative $h=1$ central influence $0.452$ is re-derivable.
3. Bioassay curves — embed nonlinear dose-response profiles; cite lesson pitfall that bandwidth/scale can dominate.
4. Fraud behavior maps — reveal rings/moons in behavior space; illustrative $e^{-0.5}=0.607$ weights neighbor affinity.
5. Preprocessing for clustering — make curved structure linearly separable; lesson warns stability checks are required.

**Notebook plan:**
- Family: F3 Dim-Reduction / Manifold
- Concept built once (D1): implement `method(X, gamma, n_components)` by building/centering an RBF kernel and eigendecomposing it; verify lesson $h=1$, weights $[0.607,1.000,0.607]$, sum $2.213$, influence $0.452$.
- Datasets D1–D5: 2D toy · swiss-roll · S-curve · digits · faces
- Metric: trustworthiness across all rungs.
- Closing viz: (a) 2D-embedding panels  (b) trustworthiness-vs-complexity curve
- Pitfall on D5: kernel bandwidth collapse; reproduce all-near/all-far embeddings, then fix with gamma sweep and scaling.
- Notes: remove dead generated helpers; keep kernel matrix visualized only for D1.

### 4.15 — Independent Component Analysis   [notebook: 4.15-ica.ipynb]   (family: F3)

**Lesson — Real World Applications (5):**
1. Audio source separation — split mixed signals into independent sources; illustrative 2-source toy follows lesson matrix projection $Z=X_cV_r$.
2. EEG artifact removal — isolate eye-blink components; lesson first-step centering uses means $[2.50,2.50]$.
3. Financial factor discovery — find non-Gaussian independent shocks; illustrative retained energy $0.800$ is a PCA baseline, not ICA proof.
4. Image basis learning — components become edge-like sources; cite lesson pitfall that outputs are not ground truth.
5. Sensor cross-talk correction — recover independent drives from mixed readings; lesson warns unscaled features dominate linear algebra.

**Notebook plan:**
- Family: F3 Dim-Reduction / Manifold
- Concept built once (D1): implement `method(X, n_components)` with whitening then ICA rotation; verify lesson centering and SVD energy numbers as the whitening audit before ICA.
- Datasets D1–D5: 2D toy · swiss-roll · S-curve · digits · faces
- Metric: reconstruction error across all rungs, plus source-correlation on D1 only.
- Closing viz: (a) 2D-embedding/source panels  (b) reconstruction-error-vs-complexity curve
- Pitfall on D5: component sign/order instability; reproduce flipped components, then fix by comparing reconstruction and stability rather than names.
- Notes: delete dead helpers; explicitly mark PCA numbers as the lesson-provided linear algebra audit.

### 4.16 — Factor analysis   [notebook: 4.16-factor-analysis.ipynb]   (family: F3)

**Lesson — Real World Applications (5):**
1. Survey psychometrics — infer latent traits from answers; illustrative $r=2$ factors follow lesson projection $Z=X_cV_r$.
2. Credit behavior factors — compress correlated account signals; lesson centered means $[2.50,2.50]$ make preprocessing auditable.
3. Healthcare phenotype factors — separate common latent variation from noise; illustrative retained toy variance $0.800$ is a baseline.
4. Education assessment — reduce many test items to abilities; cite lesson pitfall that factors are criterion-aligned, not true labels.
5. Sensor calibration — model shared latent causes and unique noise; lesson warns unscaled inputs dominate.

**Notebook plan:**
- Family: F3 Dim-Reduction / Manifold
- Concept built once (D1): implement `method(X, n_components)` using covariance/factor loading estimates; verify lesson centering and SVD-style variance numbers as the linear-factor audit.
- Datasets D1–D5: 2D toy · swiss-roll · S-curve · digits · faces
- Metric: reconstruction error across all rungs.
- Closing viz: (a) 2D latent-factor panels  (b) reconstruction-error-vs-complexity curve
- Pitfall on D5: factor rotation/non-identifiability; reproduce rotated loadings with same reconstruction, then fix with validation on held-out reconstruction.
- Notes: remove dead template code; keep probabilistic assumptions explicit.

### 4.17 — Dictionary learning & sparse coding   [notebook: 4.17-dictionary-learning-sparse-coding.ipynb]   (family: F3)

**Lesson — Real World Applications (5):**
1. Image patch dictionaries — reconstruct patches from few atoms; lesson notes $\ell_1$ sparsity and uses $Z=X_cV_r$ as linear-code shape.
2. Audio denoising — represent signals with sparse atoms; illustrative 2-atom code is marked illustrative.
3. Text feature compression — sparse topic atoms for documents; lesson retained-energy toy $0.800$ gives a comparison baseline.
4. Medical imaging — sparse lesion/texture bases; cite lesson pitfall that lower objective may fit noise.
5. Edge-device compression — transmit sparse coefficients instead of raw vectors; illustrative $r$-code follows lesson dimensionality reduction shape.

**Notebook plan:**
- Family: F3 Dim-Reduction / Manifold
- Concept built once (D1): implement `method(X, n_atoms, alpha)` alternating sparse codes and dictionary atoms; verify lesson centering/SVD energy numbers as a baseline before sparse coding.
- Datasets D1–D5: 2D toy · swiss-roll · S-curve · digits · faces
- Metric: reconstruction error across all rungs.
- Closing viz: (a) 2D sparse-code embedding panels  (b) reconstruction-error-vs-complexity curve
- Pitfall on D5: too many atoms memorizes noise; reproduce low training error with poor held-out reconstruction, then fix with sparsity/atom sweep.
- Notes: delete dead helpers; show learned atoms only for D4/D5 if compact.

### 4.18 — Random projections   [notebook: 4.18-random-projections.ipynb]   (family: F3)

**Lesson — Real World Applications (5):**
1. Fast approximate search — reduce embeddings before nearest-neighbor lookup; lesson $Z=X_cV_r$ supplies projection shape.
2. Privacy-preserving sketches — share projected features; illustrative random $r=2$ projection is marked illustrative.
3. Streaming compression — project high-dimensional events on arrival; lesson means $[2.50,2.50]$ contrast with no-training projection.
4. Large-scale clustering prep — shrink dimensions before F2 methods; cite lesson pitfall that stability checks matter under randomness.
5. Text feature hashing comparison — random maps compress sparse vectors; illustrative retained geometry is evaluated, not assumed.

**Notebook plan:**
- Family: F3 Dim-Reduction / Manifold
- Concept built once (D1): implement `method(X, n_components, seed)` with Gaussian random projection; verify lesson projection-shape arithmetic and compare with lesson SVD explained-variance baseline $0.800$.
- Datasets D1–D5: 2D toy · swiss-roll · S-curve · digits · faces
- Metric: trustworthiness across all rungs.
- Closing viz: (a) 2D random-projection panels  (b) trustworthiness-vs-complexity curve
- Pitfall on D5: random seed variability; reproduce different embeddings, then fix with multiple seeds and distance-preservation checks.
- Notes: remove dead template code; do not claim PCA-style optimal variance for random projections.

### 4.19 — t-SNE   [notebook: 4.19-t-sne.ipynb]   (family: F3)

**Lesson — Real World Applications (5):**
1. Single-cell RNA-seq maps — visualize local neighborhoods; lesson kernel influence $0.452$ shows local probability construction.
2. Image embedding exploration — inspect digit neighborhoods; illustrative $h=1$ distances $[1,0,1]$ give weights $[0.607,1.000,0.607]$.
3. NLP embedding audits — spot local semantic groups; cite lesson pitfall that output is not ground truth.
4. Fraud analyst maps — reveal local clusters for review; illustrative perplexity changes are marked illustrative and stability-checked.
5. Model debugging — compare representation layers; lesson warning: tiny hyperparameter changes can flip discovered patterns.

**Notebook plan:**
- Family: F3 Dim-Reduction / Manifold
- Concept built once (D1): implement `method(X, perplexity, seed)` using pairwise affinities then a sklearn TSNE call; verify lesson kernel normalization sum $2.213$ and influence $0.452$ on D1.
- Datasets D1–D5: 2D toy · swiss-roll · S-curve · digits · faces
- Metric: trustworthiness across all rungs.
- Closing viz: (a) 2D-embedding panels  (b) trustworthiness-vs-complexity curve
- Pitfall on D5: treating visual islands as true clusters; reproduce seed/perplexity changes, then fix with trustworthiness and neighbor checks.
- Notes: delete dead helpers; keep runtime bounded with subsampled D5.

### 4.20 — UMAP   [notebook: 4.20-umap.ipynb]   (family: F3)

**Lesson — Real World Applications (5):**
1. Biology atlas visualization — preserve neighbor graph structure; lesson Laplacian zeros count components ($2$ in the toy).
2. Image search maps — embed high-dimensional features into 2D; illustrative degree vector $[1,1,1,1]$ grounds graph construction.
3. Security behavior maps — visualize anomalous regions; cite lesson pitfall that graph scale changes the structure.
4. Customer journey maps — compare cohorts in a manifold layout; illustrative $Lv=\lambda v$ step is auditable on D1.
5. Representation monitoring — compare embeddings across model versions; lesson stability warning drives repeated seeds.

**Notebook plan:**
- Family: F3 Dim-Reduction / Manifold
- Concept built once (D1): implement `method(X, n_neighbors, min_dist)` as graph-affinity construction plus UMAP/sklearn fallback; verify lesson $D=diag(1,1,1,1)$ and eigenvalues $[0,0,2,2]$.
- Datasets D1–D5: 2D toy · swiss-roll · S-curve · digits · faces
- Metric: trustworthiness across all rungs.
- Closing viz: (a) 2D-embedding panels  (b) trustworthiness-vs-complexity curve
- Pitfall on D5: `n_neighbors`/`min_dist` changes global story; reproduce layout drift, then fix with parameter sweep and trustworthiness.
- Notes: if `umap-learn` is unavailable, plan spectral/manifold fallback while preserving the UMAP caveat.

### 4.21 — Manifold learning (Isomap, LLE, MDS, Laplacian eigenmaps)   [notebook: 4.21-manifold-learning.ipynb]   (family: F3)

**Lesson — Real World Applications (5):**
1. Robotics configuration spaces — recover low-dimensional motion manifolds; lesson graph eigenvalues show component structure.
2. Medical shape analysis — embed anatomical surfaces; illustrative graph degree $[1,1,1,1]$ is the D1 audit.
3. Image pose manifolds — unwrap rotations/poses; cite lesson pitfall that neighborhood choices can flip results.
4. Sensor calibration curves — discover drift manifolds; illustrative two zero eigenvalues mean two disconnected graph pieces.
5. Recommender behavior maps — visualize nonlinear user trajectories; lesson output is not treated as labels.

**Notebook plan:**
- Family: F3 Dim-Reduction / Manifold
- Concept built once (D1): implement `method(X, algorithm, n_neighbors)` comparing Isomap/LLE/MDS/Laplacian eigenmaps; verify lesson $L=D-A$ and eigenvalues $[0.0,0.0,2.0,2.0]$.
- Datasets D1–D5: 2D toy · swiss-roll · S-curve · digits · faces
- Metric: trustworthiness across all rungs.
- Closing viz: (a) 2D-embedding panels  (b) trustworthiness-vs-complexity curve
- Pitfall on D5: disconnected or short-circuit neighbor graphs; reproduce broken embedding, then fix with neighbor sweep/connectivity checks.
- Notes: delete dead code; keep D1 graph printed so matrix math remains auditable.

### 4.22 — Non-negative Matrix Factorization   [notebook: 4.22-nmf.ipynb]   (family: F3)

**Lesson — Real World Applications (5):**
1. Topic parts discovery — nonnegative document factors are additive topics; illustrative low-rank code follows lesson $Z=X_cV_r$ shape.
2. Face-parts decomposition — images become additive eyes/noses/mouth atoms; lesson first-component energy $0.800$ is a baseline comparison.
3. Audio spectrogram parts — decompose magnitude spectrograms; illustrative nonnegative matrix uses no negative cancellation.
4. Recommender factors — explain ratings by additive latent interests; cite lesson pitfall that factors are not ground truth.
5. Genomics signatures — separate additive expression programs; lesson warns scale changes factorization.

**Notebook plan:**
- Family: F3 Dim-Reduction / Manifold
- Concept built once (D1): implement `method(X_nonnegative, n_components)` minimizing nonnegative reconstruction error; verify lesson SVD energy $0.800$ only as a linear-factor baseline and enforce nonnegativity.
- Datasets D1–D5: 2D toy · swiss-roll · S-curve · digits · faces
- Metric: reconstruction error across all rungs.
- Closing viz: (a) 2D embedding/factor panels  (b) reconstruction-error-vs-complexity curve
- Pitfall on D5: negative preprocessing breaks NMF; reproduce failure after centering, then fix with nonnegative scaling.
- Notes: remove dead helpers; do not center NMF inputs despite lesson's generic SVD formula.

### 4.23 — Biclustering / co-clustering   [notebook: 4.23-biclustering.ipynb]   (family: F2)

**Lesson — Real World Applications (5):**
1. Gene-condition biclusters — rows and columns move together; lesson block mean $(5+5+5+4)/4=4.750$ is auditable.
2. Recommender co-clusters — group users and items jointly; lesson residue squared mean $0.0625$ measures block coherence.
3. Market-basket co-occurrence — cluster shoppers and products together; illustrative coherent block uses lesson residue idea.
4. Text term-document blocks — find topics as row/column submatrices; cite lesson pitfall that a clean block can be irrelevant.
5. A/B metric matrices — discover segments where metrics move together; lesson stability warning requires resampling blocks.

**Notebook plan:**
- Family: F2 Clustering / Density
- Concept built once (D1): implement `method(X, n_row_clusters, n_col_clusters)` scoring block residue; verify lesson block mean $4.750$ and residue $0.0625$.
- Datasets D1–D5: 4 pts · blobs · moons/anisotropic · iris(unlabeled) · digits
- Metric: ARI after comparing row clusters to hidden rung labels where available; silhouette on row embeddings otherwise.
- Closing viz: (a) reordered matrix/cluster-assignment panels  (b) ARI-or-silhouette-vs-complexity curve
- Pitfall on D5: overfitting tiny coherent blocks; reproduce low residue on noise, then fix with held-out residue and stability checks.
- Notes: adapt F2 ladder by turning each rung into a sample-feature matrix; delete dead helpers.

### 4.24 — Anomaly & outlier detection (Isolation Forest, One-Class SVM, LOF)   [notebook: 4.24-anomaly-outlier-detection.ipynb]   (family: F2)

**Lesson — Real World Applications (5):**
1. Fraud detection — score transactions far from normal behavior; lesson outlier score $5.586$ exceeds largest normal score $0.137$.
2. Manufacturing QA — flag sensor readings outside normal clusters; lesson center $[0.067,0.033]$ is re-derived from three normals.
3. Network intrusion detection — rare traffic receives high anomaly scores; illustrative threshold is marked illustrative.
4. Healthcare monitoring — unusual vitals trigger review; cite lesson pitfall that score criterion is not ground truth.
5. Data-cleaning pipelines — remove gross outliers before modeling; lesson warns unscaled features dominate distances.

**Notebook plan:**
- Family: F2 Clustering / Density
- Concept built once (D1): implement `method(X, contamination)` returning anomaly scores from a center/density baseline before sklearn detectors; verify lesson center $[0.067,0.033]$, outlier score $5.586$, normal max $0.137$.
- Datasets D1–D5: 4 pts · blobs · moons/anisotropic · iris(unlabeled) · digits
- Metric: ARI treating anomaly/normal as two clusters when labels exist; otherwise silhouette on score-binned assignments.
- Closing viz: (a) anomaly-score/assignment panels  (b) ARI-or-silhouette-vs-complexity curve
- Pitfall on D5: contamination and scaling change flagged digits; reproduce false positives, then fix with scaling and threshold calibration.
- Notes: delete dead helper code; report score distributions, not just binary labels.

### 4.25 — Kernel Density Estimation   [notebook: 4.25-kernel-density-estimation.ipynb]   (family: F2)

**Lesson — Real World Applications (5):**
1. Demand density maps — estimate where customers appear; lesson $h=1$ weights normalize to middle influence $0.452$.
2. Risk scoring — low-density observations become review candidates; illustrative density threshold is marked illustrative.
3. Spatial epidemiology — smooth case locations into hot spots; lesson exponentials $[0.607,1.000,0.607]$ show kernel contribution.
4. Simulation diagnostics — compare generated vs observed densities; cite lesson pitfall that bandwidth controls the story.
5. Sensor likelihood monitoring — track normal density over readings; lesson sum $2.213$ makes probability normalization auditable.

**Notebook plan:**
- Family: F2 Clustering / Density
- Concept built once (D1): implement `method(X, bandwidth)` returning KDE log-density and density-derived assignments; verify lesson weights, sum $2.213$, influence $0.452$.
- Datasets D1–D5: 4 pts · blobs · moons/anisotropic · iris(unlabeled) · digits
- Metric: silhouette after assigning points to density basins/peaks.
- Closing viz: (a) density/cluster-assignment panels  (b) silhouette-vs-complexity curve
- Pitfall on D5: bandwidth oversmoothing/undersmoothing; reproduce flat or spiky digit densities, then fix with validation sweep.
- Notes: remove dead helpers; keep density contours for 2D rungs and score histograms for digits.

### 4.26 — Association rule mining (Apriori, FP-growth)   [notebook: 4.26-association-rule-mining.ipynb]   (family: F2)

**Lesson — Real World Applications (5):**
1. Retail baskets — bread/milk rule audit uses lesson support $2/4=0.500$, confidence $2/3=0.667$, lift $0.889$.
2. Web click paths — page co-visits become rules; illustrative support threshold is marked illustrative.
3. Clinical co-morbidity rules — condition pairs are counted, not supervised; cite lesson pitfall that frequent rules may be irrelevant.
4. Incident correlation — alerts that co-occur above chance form rules; lesson lift compares with independence via $P(B)$.
5. Course enrollment planning — itemsets reveal common class bundles; lesson confidence $P(B|A)$ is the re-derivable number.

**Notebook plan:**
- Family: F2 Clustering / Density
- Concept built once (D1): implement `method(transactions, min_support)` computing support, confidence, and lift; verify lesson bread/milk support $0.500$, confidence $0.667$, lift $0.889$.
- Datasets D1–D5: 4 pts · blobs · moons/anisotropic · iris(unlabeled) · digits
- Metric: ARI after converting frequent-rule signatures into item/point groups across the F2 rungs.
- Closing viz: (a) rule-induced cluster-assignment panels  (b) ARI-vs-complexity curve
- Pitfall on D5: high support but low lift or spurious rules; reproduce the lesson's lift-below-1 pattern, then fix by filtering on lift and stability.
- Notes: F2 ladder must discretize numeric rungs into transactions; delete dead template code and keep association metrics separate from clustering metric.
