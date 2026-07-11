# M16 · Dimensionality reduction & anomaly detection
> **Domain:** Domain 3 · Unsupervised · **Maps to:** all · **Skip if you can already…** reduce/visualize high-dim features and flag outliers

## Overview

High-dimensional feature tables are hard to inspect, expensive to model, and easy to misread. Dimensionality reduction helps compress, denoise, visualize, and debug feature spaces. Anomaly detection ranks rows that do not fit a chosen reference pattern. In ads and LinkedIn-style systems, these tools support cohort visualization, feature-space debugging, and outlier flagging — but neither a pretty 2D plot nor a high anomaly score is proof of a real persona, fraud, or a product bug.

**By the end you can answer:**
- Why reduce dimensionality, and what are the tradeoffs among compression, denoising, speed, and visualization?
- How does PCA use covariance eigen-decomposition, explained variance, and projection?
- How do you choose and interpret principal components?
- How should t-SNE and UMAP be used, and why are they usually visualization tools rather than proof of clusters?
- What is anomaly detection, and how do reconstruction error, Isolation Forest, LOF, and Mahalanobis distance flag outliers?
- How do you choose an anomaly detector and threshold when labels are scarce?
- How do dimensionality reduction and anomaly detection work together in high-dimensional AFP-style feature tables?

Two sub-lessons:

- **M16.1 Dimensionality reduction** — PCA mechanics, explained variance, loadings, and UMAP caveats.
- **M16.2 Anomaly detection** — reconstruction error, Isolation Forest, LOF, Mahalanobis, PyOD, and scarce-label thresholding.

<p class="cur-colab"><a class="cur-colab-btn" href="https://colab.research.google.com/github/niamleeson/ml-math/blob/main/afp/notebooks/M16-dimensionality-reduction-anomaly.ipynb" target="_blank" rel="noopener">▶ Open the runnable toy-example notebook (PCA explained variance + loadings on correlated engagement features) in Google Colab</a></p>

---

## M16.1 · Dimensionality reduction

**The idea.** Reduce dimensionality when many features are correlated, noisy, expensive, or impossible to visualize directly. The tradeoff is information loss: a compressed representation may remove noise, but it may also remove rare signals. In ads, PCA can show that clicks, views, and dwell all load onto a general engagement axis; UMAP can help visualize neighborhoods of similar campaigns or members; neither should be treated as a final segmentation by itself.

**Everyday analogy.** PCA is like photographing a 3D object from the angle that shows the most of its shape in one flat picture. The object is the original high-dimensional feature table, the camera angle is a principal component, and "most shape preserved" means the projection keeps as much variance as possible. UMAP is more like a subway map: it deliberately distorts exact distances and geography so nearby stops and neighborhoods are easy to see. That makes it useful for exploration, but not for measuring precise distances or proving that two plotted blobs are real classes.

PCA is the linear, global baseline. Given centered data matrix $X$, compute the covariance matrix:

$$\Sigma = \frac{1}{n-1}X^\top X.$$

Then eigendecompose it:

$$\Sigma v_j = \lambda_j v_j,$$

where eigenvectors $v_j$ are principal axes and eigenvalues $\lambda_j$ are variances along those axes. Project rows onto the top $m$ axes:

$$Z_m = X V_m.$$

The explained-variance ratio for component $j$ is:

$$\text{EVR}_j = \frac{\lambda_j}{\sum_{\ell}\lambda_\ell}.$$

Choose components by cumulative explained variance, downstream validation, and interpretability. Loadings tell you which original features contribute to each component. If PC1 has high positive loadings on clicks, video completions, and dwell time, call it "general engagement" only as a shorthand; inspect the loadings before naming it.

UMAP and t-SNE are nonlinear neighborhood visualizers. They are useful for exploratory plots when similar rows should appear near each other locally. They are not reliable evidence of global geometry: gaps, blob sizes, and between-blob distances can change with seed, scaling, sample, and hyperparameters. Use UMAP for visualization, not as a default feature generator for production models. If you feed UMAP coordinates into a model, validate against a plain-feature or PCA baseline and watch for train/serve instability.

| Need | Prefer | Why / warning |
|---|---|---|
| Linear compression or denoising | PCA | fast, deterministic, interpretable loadings; captures only linear variance |
| Feature debugging | PCA loadings + variance plots | shows correlated feature blocks and dominant axes |
| Local neighborhood visualization | UMAP or t-SNE | good for exploratory plots; visual clusters are hypotheses only |
| Production features | Original features or PCA first | UMAP coordinates can be stochastic and parameter-sensitive |

**PCA vs UMAP, concretely.**

- **PCA → linear/global/variance.** If scaled campaign features have clicks, impressions, and dwell moving together, PCA may make PC1 a global engagement axis and show a small number of PCs capturing most variance. Use that reduced representation as a denoising or speed baseline because the projection is deterministic and loadings show which original features drive each axis.
- **UMAP → nonlinear/local/visualization.** If campaigns form curved local neighborhoods — for example, gradual transitions from low-intent browsers to active searchers — UMAP can place nearby campaigns near each other in 2D for inspection. Do not treat the x/y coordinates, blob gaps, or blob sizes as calibrated distances; rerun across seeds and validate any downstream use against original features or PCA.

**Worked example — feature-space visualization for campaigns.** Suppose each campaign has 80 scaled features: spend, impressions, clicks, conversions, video completions, hides, dwell, audience breadth, and historical quality metrics. PCA shows the first three PCs explain 82% of variance. PC1 loads on impressions/clicks/dwell, PC2 loads on spend and audience breadth, and PC3 loads on ad-hide rate. That tells you which axes dominate the feature table before you fit a supervised model or create cohorts.

```python
from sklearn.decomposition import PCA
from sklearn.preprocessing import StandardScaler

X = StandardScaler().fit_transform(df[features])
pca = PCA(n_components=10, random_state=7).fit(X)
Z = pca.transform(X)

cumulative = pca.explained_variance_ratio_.cumsum()
loadings = pca.components_.T
```

If the first 5 PCs reach 90% cumulative explained variance, a 5D PCA representation may be useful for denoising or a fast baseline. If a UMAP plot shows two blobs, treat them as candidates for inspection: check whether the blobs persist across seeds, whether the feature summaries differ, and whether any downstream metric changes by blob. If the blobs vanish when `min_dist` or the sample changes, they were visualization artifacts, not robust personas.

**How to read components without overclaiming.**

- Name a component from its largest positive and negative loadings, not from the plot.
- Check whether the component is dominated by scale, missingness, or one feature family.
- Prefer cumulative variance thresholds as a starting point, then validate the reduced features in the actual task.
- Keep rare safety or quality features if the business cost of losing them is high, even when they explain little variance.
- Treat UMAP neighborhoods as inspection queues: "these rows look similar," not "these rows are a true class."

**You'll be able to say:** *"I reduce dimensionality to compress correlated features, denoise, visualize, or speed later models, while accepting information loss. PCA centers data, finds covariance eigenvectors, projects rows onto top principal axes, and reports explained variance so I can pick enough components and inspect loadings. t-SNE/UMAP preserve neighborhoods for visualization, but their distances, cluster gaps, and apparent global geometry are not standalone evidence of real personas."*

---

## M16.2 · Anomaly detection

**The idea.** An anomaly is a row that scores unusual under a chosen reference pattern. It is not automatically fraud, policy violation, or a data bug. In ads, anomaly detection can flag campaigns with rare high-spend/low-engagement combinations, members with unusual feature vectors, broken logging rows, or cohorts that need human review.

**Everyday analogy.** Anomaly detection is like looking at a scatter of normal credit-card purchases and spotting one transaction far away from the usual cloud. The row is the transaction, the features are things like amount, time, merchant, and location, and the anomaly score is how poorly it fits the normal pattern. Mahalanobis distance is the version that accounts for which directions usually vary together: an expensive hotel plus travel booking may be normal, while a smaller purchase with an impossible location/time combination may be far in covariance-scaled distance. A high score means "review this," not "this is definitely fraud."

Different detectors encode different definitions of unusual:

- **PCA reconstruction error:** fit a low-dimensional normal subspace, reconstruct each row, and flag rows with large residuals.
- **Isolation Forest:** random splits isolate rare points in fewer splits.
- **LOF:** a point is anomalous if its local density is much lower than its neighbors' density.
- **Mahalanobis distance:** a point is far from the center after accounting for covariance.

**Which anomaly method, concretely.**

- **PCA reconstruction error → off-subspace row.** If normal campaigns lie near a spend/impressions/clicks engagement plane, a row with ordinary spend and impressions but impossible feature combinations after a logging change can reconstruct poorly and get flagged by a large residual.
- **Isolation Forest → globally rare combination.** If a campaign has very high spend, very low impressions, and high hide rate, random splits can isolate it quickly even without estimating covariance; flag it for review as a rare global pattern.
- **LOF → sparse relative to peers.** If a new campaign looks ordinary globally but sits in a local neighborhood of similar objectives where all peers have much higher engagement, LOF can flag it because its local density is lower than its neighbors' density.
- **Mahalanobis distance → covariance-shaped extreme.** If spend and impressions usually rise together, high spend with high impressions may be normal, but high spend with low impressions can be far from the covariance-shaped cloud and receive a large Mahalanobis score.
- **PyOD → common-API comparison.** If the review team wants one weekly report, run several PyOD detectors on the same robust-scaled feature table, then compare their top-100 flags side by side before standardizing on the detector whose alerts are stable and useful.

For PCA reconstruction, if $\hat{x}_i$ is the projection-reconstruction of $x_i$, a simple score is:

$$e_i = \|x_i - \hat{x}_i\|_2^2.$$

For correlated numeric features with a stable covariance estimate, Mahalanobis distance is:

$$D_M(x)=\sqrt{(x-\mu)^\top\Sigma^{-1}(x-\mu)}.$$

This matters when raw feature extremes are misleading. A campaign with high spend and high impressions may be normal; a campaign with high spend, low impressions, and high hide rate may have a large covariance-scaled distance.

PyOD is useful because it gives many outlier detectors behind a common API. That does not remove the hard part: choosing a detector, setting a threshold, and reviewing top cases.

```python
from sklearn.decomposition import PCA
from sklearn.ensemble import IsolationForest
from sklearn.preprocessing import RobustScaler
import numpy as np

X = RobustScaler().fit_transform(df[features])

pca = PCA(n_components=8, random_state=7).fit(X)
X_hat = pca.inverse_transform(pca.transform(X))
recon_error = ((X - X_hat) ** 2).sum(axis=1)

iso = IsolationForest(contamination=0.01, random_state=7).fit(X)
iso_score = -iso.score_samples(X)  # larger = more unusual

threshold = np.quantile(recon_error, 0.99)
review = df.loc[recon_error >= threshold]
```

**Worked example — outlier flagging with scarce labels.** A table has 10,000 campaigns and no reliable anomaly labels. The review team can inspect 100 cases per week, so you set a top-1% alert budget. PCA reconstruction flags rows poorly represented by the normal engagement/spend subspace. Isolation Forest flags globally rare combinations. LOF catches campaigns that look sparse relative to nearby campaigns. Mahalanobis flags covariance-shaped extremes.

A row with extremely high clicks may not be anomalous if spend, impressions, and audience size are also high. A row with modest clicks, very high spend, and unusually high hides may be anomalous because the combination is rare. After scoring, inspect the top rows by slice: advertiser vertical, campaign objective, geo, new-vs-mature campaign, and logging version. If 80 of the 100 alerts come from one newly launched logging path, you may have a pipeline issue rather than strange advertiser behavior.

Choose thresholds without labels by combining:

1. **Alert budget:** top 1% of 10,000 rows gives 100 review candidates.
2. **Quantiles:** compare 95th, 99th, and 99.5th percentile score cuts.
3. **Stability:** check whether the same row types appear across weeks and bootstrap samples.
4. **Slice checks:** avoid a detector that only flags one country, objective, or new-campaign slice unless that is intended.
5. **Review feedback:** collect labels or notes from human triage and tune toward useful alerts.

Dimensionality reduction and anomaly detection often work together. PCA can denoise first, reveal dominant axes, and produce reconstruction errors. UMAP can help visualize where high-score rows sit, but do not threshold based on UMAP plot position alone. The production artifact should be a reproducible score, threshold, and review loop — not a screenshot.

Use detector choice as a modeling assumption:

- Use reconstruction error when normal behavior is close to a low-rank subspace.
- Use Isolation Forest for a broad first-pass ranking with few distribution assumptions.
- Use LOF when "unusual relative to nearby peers" is the question.
- Use Mahalanobis when numeric features are correlated and covariance is stable enough to estimate.
- Use PyOD when you want to compare several detectors with one API, then standardize review reports.
- Avoid declaring success from precision alone if the reviewed set came only from the detector's own top scores; keep a small random audit sample.

**You'll be able to say:** *"An anomaly is a point that scores unusual under a chosen reference pattern, not automatically fraud or a bug. PCA reconstruction error flags points poorly represented by the normal subspace; Isolation Forest isolates rare points in fewer random splits; LOF compares local density with neighbors; Mahalanobis distance measures covariance-scaled distance from a center. With few labels, I set thresholds by alert budget/quantile, inspect top cases, check slices and stability, and tune for review usefulness."*

---

## Resources
- UMAP docs (nonlinear manifold embedding for visualization)
- PyOD docs (outlier detectors with a common API)
- scikit-learn — decomposition & outlier detection (PCA, IsolationForest, LOF)

## Papers
- UMAP (McInnes et al., 2018)
