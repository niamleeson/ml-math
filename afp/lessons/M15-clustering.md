# M15 · Clustering & cohort/persona discovery
> **Domain:** Domain 3 · Unsupervised · **Maps to:** all · **Skip if you can already…** pick a clustering method and validate clusters without labels

## Overview

Clustering is useful when an ads team needs structure before labels exist: cohort discovery, persona prototypes, candidate grouping, deduping, and exploratory slices for later supervised modeling. It is also easy to overclaim. A cluster is not a causal segment, not a fixed identity, and not automatically actionable. It is a pattern produced by a representation, a distance notion, and an algorithm assumption.

**By the end you can answer:**
- When is clustering the right tool, and when is it the wrong tool?
- What objective does k-means optimize, and how does Lloyd's algorithm approximate it?
- How do you choose k with elbow and silhouette, and what can those diagnostics miss?
- What is a Gaussian mixture model, and how does EM produce soft cluster assignment?
- How do DBSCAN and HDBSCAN use density, mark noise, and avoid choosing k?
- How do you validate clusters without labels using silhouette, Davies-Bouldin, and stability?
- How do you use clustering for cohort/persona discovery without overclaiming causality or identity?
- How do you choose among k-means, GMM, DBSCAN, and HDBSCAN for a real dataset?

Two sub-lessons:

- **M15.1 k-means & GMM** — centroid clusters, soft assignments, and choosing k.
- **M15.2 Density clustering & validating without labels** — DBSCAN/HDBSCAN, internal metrics, stability, and method choice.

<p class="cur-colab"><a class="cur-colab-btn" href="https://colab.research.google.com/github/niamleeson/ml-math/blob/main/afp/notebooks/M15-clustering.ipynb" target="_blank" rel="noopener">▶ Open the runnable clustering notebook (k-means by hand, elbow + silhouette, GMM soft assignment, and the two-moons DBSCAN break case) in Google Colab</a></p>

---

## M15.1 · k-means & GMM

**The idea.** Use clustering when labels are absent and the feature space makes distance meaningful. In ads, examples include grouping campaigns by engagement profile, finding member-interest cohorts, or creating tentative personas such as "high video engagement / low search intent." Do not use clustering when you already have a supervised target, when scale is arbitrary and unnormalized, or when the business question requires causality rather than exploratory grouping.

**Everyday analogy.** Clustering is like sorting a mixed pile of laundry when no one gave you labels for the piles. You group items by similarity — color, fabric, thickness — and decide how many piles are useful for the chore. In that mapping, each sock or shirt is a data point, the color/fabric measurements are features, distance means "how similar," and a cluster is one pile you can summarize without pretending it is the only true way to sort laundry. k-means is the version where you pick $k$ pile-centers, assign each item to the nearest center, recenter each pile, and repeat; GMM is the softer version where a striped sock might be 70% "darks" and 30% "colors."

For k-means, choose a number of clusters $k$ and find assignments $z_i \in \{1,\ldots,k\}$ and centroids $\mu_1,\ldots,\mu_k$ that minimize within-cluster squared distance:

$$\min_{z,\mu}\sum_{i=1}^{n}\left\|x_i - \mu_{z_i}\right\|_2^2.$$

Lloyd's algorithm approximates this objective by alternating two steps:

1. **Assign:** $z_i \leftarrow \arg\min_j \|x_i - \mu_j\|_2^2$.
2. **Update:** $\mu_j \leftarrow \frac{1}{|C_j|}\sum_{i:z_i=j}x_i$.

Repeat until assignments or inertia stop changing. Inertia always decreases as $k$ increases, so the elbow plot is a diagnostic, not proof. The silhouette coefficient for row $i$ compares within-cluster distance $a_i$ to nearest-other-cluster distance $b_i$:

$$s_i = \frac{b_i-a_i}{\max(a_i,b_i)}.$$

Scores near 1 mean separated; near 0 mean boundary; below 0 mean the row may fit another cluster better.

A Gaussian mixture model (GMM) replaces hard centroids with Gaussian components. Instead of saying member $i$ belongs only to persona 2, it gives responsibilities:

$$r_{ik}=\frac{\pi_k\mathcal{N}(x_i\mid\mu_k,\Sigma_k)}{\sum_{j=1}^{K}\pi_j\mathcal{N}(x_i\mid\mu_j,\Sigma_j)}.$$

EM alternates between computing these soft responsibilities (E-step) and updating component weights, means, and covariances (M-step). GMM is often better than k-means when clusters overlap, have elliptical shapes, or when uncertainty itself is useful.

**Worked example — member engagement personas.** Suppose each row is a member-campaign interaction summary with scaled features: video completion rate, click rate, search-intent score, article dwell, and ad-hide rate.

```python
from sklearn.cluster import KMeans
from sklearn.mixture import GaussianMixture
from sklearn.metrics import silhouette_score
from sklearn.preprocessing import StandardScaler

X = StandardScaler().fit_transform(df[features])

scores = []
for k in range(2, 8):
    km = KMeans(n_clusters=k, n_init="auto", random_state=7).fit(X)
    scores.append((k, km.inertia_, silhouette_score(X, km.labels_)))

km = KMeans(n_clusters=3, n_init="auto", random_state=7).fit(X)
gmm = GaussianMixture(n_components=3, covariance_type="full", random_state=7).fit(X)
responsibilities = gmm.predict_proba(X)
```

The k sweep might show inertia falling for every $k$, while silhouette peaks at $k=3$. A centroid table might read:

| Cluster | Video completion | Search intent | Click rate | Cautious persona summary |
|---|---:|---:|---:|---|
| 0 | high | low | medium | video-first browsers |
| 1 | low | high | high | active searchers |
| 2 | medium | medium | low | light engagers |

One row has GMM responsibilities $[0.52, 0.43, 0.05]$. That member is not cleanly one persona; the right product interpretation is "ambiguous between video-first and searcher," not "misclassified." For campaign planning, you might summarize cohorts and inspect creative response by cohort, but you would not claim the clusters caused response differences.

**What the k diagnostics can miss.**

- A clean elbow can come from campaign-size effects, not meaningful personas.
- A high silhouette can prefer two big easy groups while hiding small useful cohorts.
- A low silhouette can unfairly punish overlapping but actionable audiences.
- Very small clusters may be rare valuable segments, data bugs, or just noise.
- A stable k is still only a hypothesis until the cluster summaries are readable.

**You'll be able to say:** *"Use clustering for exploratory grouping when labels are absent and the feature representation makes distance meaningful. k-means minimizes within-cluster SSE by alternating nearest-centroid assignment and centroid updates; choose k by combining inertia/elbow, silhouette, cluster size, and usefulness. GMM generalizes centroids into Gaussian components and EM gives soft responsibilities, so it is better when membership is uncertain or clusters overlap."*

---

## M15.2 · Density clustering & validating without labels

**The idea.** k-means and GMM assume compact centroid-like or Gaussian-like clusters. Density clustering asks a different question: which points live in dense regions, and which points are sparse enough to be noise? DBSCAN uses an $\epsilon$-neighborhood and `min_samples` to define core points, border points, and noise. HDBSCAN builds a density hierarchy, handles variable density better, and returns stable clusters plus noise without choosing $k$.

**Everyday analogy.** Imagine the same laundry pile, but now some piles are huge and tightly packed, some are small and loose, and a few odd socks sit by themselves. Density clustering forms piles where many similar items are close together and leaves isolated odd socks as "noise" instead of forcing them into a bad pile. DBSCAN uses one rule for how close and how many items make a dense patch; HDBSCAN lets dense and sparse piles coexist and asks which piles stay stable across density levels. Validating without labels is checking whether the piles are tight, separated, stable when you reshuffle, and useful for the decision you need.

This matters for ads feature tables because real cohorts may be non-spherical: a curved path from "low intent" to "high intent," a dense brand-loyal group inside a larger audience, or rare outlier campaigns that should not be forced into a persona.

| Method | Use when | Watch out for | Output to inspect |
|---|---|---|---|
| k-means | compact, roughly spherical clusters; need simple centroids | must choose $k$; scale-sensitive; breaks on non-convex shapes | centroids, inertia, silhouette, cluster sizes |
| GMM | overlapping elliptical clusters; need soft membership | assumes mixture family; must choose components; covariance can be fragile | responsibilities, covariance shape, entropy |
| DBSCAN | arbitrary shapes, one density scale, explicit outliers | sensitive to `eps`; struggles with variable density | core/border/noise labels, noise rate |
| HDBSCAN | variable-density, noisy exploratory cohorts | parameters still need review; small clusters may be unstable | cluster stability, noise rate, membership strengths |

**Which clustering method, concretely.** Use the same 2-D axes — scaled search intent $x$ and scaled video completion $y$ — and choose the method whose assumption matches the scatter, not the one with the prettiest plot.

| Method | Concrete "use it when..." instance | What distinguishes it from siblings |
|---|---|---|
| **k-means** | Use it when the points look like two compact, similar-size round blobs, e.g. $\{(0,0),(0,1),(1,0),(1,1)\}$ and $\{(5,5),(5,6),(6,5),(6,6)\}$. With $k=2$, the centroids land near $(0.5,0.5)$ and $(5.5,5.5)$. | Hard assignment to nearest center is reasonable because both cohorts are spherical and balanced. |
| **GMM** | Use it when two cohorts overlap or stretch diagonally, e.g. one cloud along low-intent/high-video and another along mid-intent/mid-video, with a member at $(3.0,3.1)$ plausibly belonging partly to both. | The useful output is mixed responsibility across components plus elliptical covariance, not a forced nearest-centroid label. |
| **HDBSCAN** | Use it when density varies and there is noise, e.g. a tight active-searcher patch near $(0,0)$, a looser video-browser patch spread from $(4,4)$ to $(7,5)$, and isolated points like $(10,0)$. | It can keep both dense and sparse cohorts while marking isolated rows as noise instead of forcing every point into $k$ clusters. |

Validation without labels is triangulation. Internal scores help, but they do not define truth.

- **Silhouette:** high when points are close to their own cluster and far from other clusters; can penalize non-convex clusters.
- **Davies-Bouldin:** lower is better; it compares within-cluster scatter to between-cluster separation, so compact well-separated clusters score well.
- **Stability:** rerun under seed changes, bootstrap samples, small feature perturbations, and time slices. Personas that disappear under tiny changes are weak hypotheses.
- **Sanity checks:** cluster sizes, noise rate, feature summaries, slice concentration, and whether the cohorts support a real downstream decision.

**How to read validation metrics, concretely.**

- **Silhouette → separated vs boundary rows.** If k-means on three campaign cohorts gives high positive silhouette for most rows, they are closer to their own centroid than to alternatives; if the "light engager" slice has rows with $s_i < 0$, those rows fit another cohort better and need inspection.
- **Davies-Bouldin → compact/separated tradeoff.** If $k=3$ has lower DB than $k=4$ on the same scaled features, read $k=3$ as more compact relative to between-cluster separation; still check sizes so one giant campaign-volume cluster is not dominating the score.
- **Stability → hypothesis strength.** If bootstrap reruns keep the same cohort summaries and most sampled rows stay with an equivalent cluster, the personas are stronger hypotheses; if a small "premium video" cluster appears in one seed and vanishes in the next, treat it as unstable even if its internal score looked good.

**Worked example — noisy audience shapes.** A two-moons dataset mimics a nonlinear audience path: members gradually move from browsing to active intent. k-means with $k=2$ cuts the moons into convex halves, even if the silhouette looks acceptable. DBSCAN with `eps=0.25, min_samples=5` can recover the curved dense regions and mark scattered points as noise. HDBSCAN can handle a denser "active searcher" moon and a sparser "video browser" moon without one global density threshold.

```python
from sklearn.cluster import DBSCAN
from sklearn.metrics import davies_bouldin_score, silhouette_score

labels = DBSCAN(eps=0.25, min_samples=5).fit_predict(X)
mask = labels != -1

if len(set(labels[mask])) > 1:
    sil = silhouette_score(X[mask], labels[mask])
    db = davies_bouldin_score(X[mask], labels[mask])
noise_rate = (labels == -1).mean()
```

If DBSCAN marks 12% of rows as noise, inspect those rows. In an ads setting, they might be harmless new campaigns with little history, unusual high-spend/low-engagement campaigns worth review, or data-quality bugs. A lower Davies-Bouldin score with unstable labels is not enough to declare a better persona set. Prefer the clustering that is stable, interpretable, and useful for the intended analysis.

A practical no-label validation loop:

1. Freeze the feature set and scaling.
2. Fit several candidate methods and parameter values.
3. Record silhouette, Davies-Bouldin, cluster sizes, and noise rate.
4. Refit under bootstrap samples, seeds, feature noise, and time windows.
5. Summarize each cluster in feature language, not identity language.
6. Ask whether the cohort changes a downstream decision: creative review, targeting exploration, model slice analysis, or outlier triage.

For a weekly AFP review, report clusters like an analysis artifact:

- method and parameters, including the scaler and features used;
- number of clusters, cluster sizes, and noise rate;
- internal scores and whether they improved or degraded versus baselines;
- stability under reruns and recent time windows;
- top positive/negative feature summaries for each cohort;
- a recommended next action, such as inspect creatives, create a slice report, or reject the clustering.

**You'll be able to say:** *"DBSCAN/HDBSCAN group points that live in dense regions and mark sparse points as noise, so they can find non-spherical cohorts and do not require k. Without labels, I triangulate internal scores (silhouette, Davies-Bouldin), stability under resampling/seed/noise, size/actionability, and human-readable summaries. I choose k-means for compact spherical clusters, GMM for overlapping ellipses and soft membership, DBSCAN for one density scale with noise, and HDBSCAN for variable-density/noisy exploratory data."*

---

## Resources
- scikit-learn — clustering (k-means, GMM, DBSCAN, metrics)
- HDBSCAN docs (density clustering with noise + variable density)
- StatQuest — k-means (the algorithm, visually)

## Papers
- Density-Based Clustering / HDBSCAN (Campello et al., 2013)
- BERTopic (Grootendorst, 2022)
