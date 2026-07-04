# Module Plan — M15 · Clustering & cohort/persona discovery

| Field | Value |
|---|---|
| Domain | Domain 3 · Unsupervised |
| Skip if you can already… | pick a clustering method and validate clusters without labels |
| Maps to (projects) | all |
| Primary structure(s) | S2 Method / Algorithm |
| Example type | 💻 Colab |
| Sub-lessons | 2 |
| Notebooks | 2 |

## Module hub (the "complete list")
Clustering is useful when the team needs structure before labels exist: cohort discovery, persona
prototypes, candidate grouping, deduping, and exploratory slices for later supervised modeling. This
module teaches the learner to choose the clustering assumption, run the algorithm, and validate the
result without pretending internal scores are ground truth.

- M15.1 · k-means & GMM (objectives, soft assignment, choosing k)
- M15.2 · Density clustering & validation without labels (DBSCAN/HDBSCAN, silhouette, stability)

## Questions this module answers (→ which sub-lesson teaches the answer)
- When is clustering the right tool, and when is it the wrong tool? → M15.1, M15.2
- What objective does k-means optimize, and how does Lloyd's algorithm approximate it? → M15.1
- How do you choose k with elbow and silhouette, and what can those diagnostics miss? → M15.1, M15.2
- What is a Gaussian mixture model, and how does EM produce soft cluster assignment? → M15.1
- How do DBSCAN and HDBSCAN use density, mark noise, and avoid choosing k? → M15.2
- How do you validate clusters without labels using silhouette, Davies-Bouldin, and stability? → M15.2
- How do you use clustering for cohort/persona discovery without overclaiming causality or identity? → M15.1, M15.2
- How do you choose among k-means, GMM, DBSCAN, and HDBSCAN for a real dataset? → M15.2

_Every question maps to a sub-lesson (coverage confirmed below)._

## Concepts (ƒ = genuine, central formula)
- Clustering as exploratory structure discovery; distance/scale sensitivity; cohort/persona framing
- k-means objective: within-cluster sum of squared errors **ƒ**
- Lloyd's algorithm: assign to nearest centroid, update centroids, repeat
- Choosing k: elbow on inertia; silhouette coefficient **ƒ**; why neither proves semantic truth
- Gaussian mixture model (GMM); likelihood, responsibilities / soft assignment, EM **ƒ**
- DBSCAN: epsilon-neighborhood, min_samples, core/border/noise points; no k
- HDBSCAN: variable-density hierarchy, minimum cluster size, noise, cluster stability
- Internal validation: silhouette **ƒ**, Davies-Bouldin index, cluster-size sanity checks, resampling / perturbation stability

## Sub-lessons

### M15.1 · k-means & GMM (objectives, choosing k)  —  [S2 Method, 💻]
- **Makes answerable:** when clustering is appropriate; k-means objective and Lloyd's algorithm; choosing k with elbow/silhouette; GMM and EM soft assignment; first-pass cohort/persona discovery.
- **You'll be able to say:** "Use clustering for exploratory grouping when labels are absent and the feature representation makes distance meaningful. k-means minimizes within-cluster SSE by alternating nearest-centroid assignment and centroid updates; choose k by combining inertia/elbow, silhouette, cluster size, and usefulness. GMM generalizes centroids into Gaussian components and EM gives soft responsibilities, so it is better when membership is uncertain or clusters overlap."
- **Concepts:** clustering use cases, distance/scale, k-means SSE **ƒ**, Lloyd's algorithm, elbow, silhouette **ƒ**, GMM responsibilities + EM **ƒ**, persona summaries.
- **Key Idea focus:** step-by-step pseudocode — scale features, pick candidate k values, run k-means/GMM, read inertia/silhouette/soft memberships, then summarize clusters as cautious cohorts.
- **Worked-example shape:** 10+5+5, process viz — ten centroid-assignment/update micro-examples, five k sweeps, five overlapping-Gaussian soft-assignment cases.
- **Notebook:** Yes — synthetic member/ad-interest features plus a two-moons break case; compare k-means at k=2..8, plot inertia + silhouette, fit GMM and inspect responsibility entropy; `assert` inertia decreases as k increases and `assert` the moons silhouette/visual fit exposes k-means' shape assumption.
- **Real numbers to cite:** for k=3 personas, report centroid rows such as "high video engagement / low search intent"; show one ambiguous member with GMM responsibilities like [0.52, 0.43, 0.05]; show k-means inertia falling monotonically while silhouette peaks at a different k.

### M15.2 · Density clustering & validating without labels  —  [S2 Method, 💻]
- **Makes answerable:** density clustering with DBSCAN/HDBSCAN; validating without labels; what elbow/silhouette can miss; cohort/persona use without overclaiming; choosing among clustering methods.
- **You'll be able to say:** "DBSCAN/HDBSCAN group points that live in dense regions and mark sparse points as noise, so they can find non-spherical cohorts and do not require k. Without labels, I triangulate internal scores (silhouette, Davies-Bouldin), stability under resampling/seed/noise, size/actionability, and human-readable summaries. I choose k-means for compact spherical clusters, GMM for overlapping ellipses and soft membership, DBSCAN for one density scale with noise, and HDBSCAN for variable-density/noisy exploratory data."
- **Concepts:** DBSCAN/HDBSCAN density, core/border/noise, no k, variable density, silhouette **ƒ**, Davies-Bouldin, stability, method selection.
- **Key Idea focus:** step-by-step pseudocode — choose representation/scale, sweep density parameters, label noise, compute internal scores, test stability, and translate clusters into tentative cohorts.
- **Worked-example shape:** 10+5+5, process viz — ten neighborhood/core-point checks, five parameter sweeps, five validation/stability readings including a misleading high/low score.
- **Notebook:** Yes — moons + anisotropic blobs + AFP-flavored feature table; show k-means breaking on moons/anisotropic shapes, then DBSCAN/HDBSCAN recovering density structure and marking noise; compute silhouette and Davies-Bouldin where defined; bootstrap/resample labels and `assert` HDBSCAN or DBSCAN marks at least one point as noise on the noisy dataset.
- **Real numbers to cite:** DBSCAN `eps=0.25, min_samples=5` marks ~5–15% as noise on noisy moons; HDBSCAN `min_cluster_size=20` returns variable-size clusters; a lower Davies-Bouldin with unstable labels is not enough to declare a better persona set.

## Coverage check
All 8 module questions are answered: clustering fit-for-purpose and persona framing → M15.1/M15.2; k-means/Lloyd's and k selection → M15.1; GMM/EM → M15.1; DBSCAN/HDBSCAN → M15.2; no-label validation and method choice → M15.2. No gaps.

## Decision guide (only if the module has a when-to-pick-X-vs-Y)
| Situation | Prefer | Why / warning |
|---|---|---|
| Compact, roughly spherical clusters; need simple centroids | k-means | Fast, explainable centroids; requires k and breaks on non-convex or unequal-density shapes. |
| Overlapping elliptical clusters; need probabilistic membership | GMM | Soft responsibilities and covariance shape; still assumes mixture family and needs component count. |
| Arbitrary shapes, one density scale, explicit outliers | DBSCAN | Finds dense regions and noise without k; sensitive to eps and scaling. |
| Variable density, noisy exploratory cohorts | HDBSCAN | Avoids one global eps and ranks stable clusters; parameters still need inspection. |
| Persona/cohort discovery | Any method + validation | Treat clusters as hypotheses for analysis/action, not causal segments or immutable identities. |

## Resources (from the guide)
- scikit-learn — clustering (k-means, GMM, DBSCAN, metrics)
- HDBSCAN docs (density clustering with noise + variable density)
- StatQuest — k-means (the algorithm, visually)

## SOTA papers (from the guide)
- Density-Based Clustering / HDBSCAN (Campello et al., 2013)
- BERTopic (Grootendorst, 2022)

## Notes / caveats
- **Overlaps the concurrent `topics/11-clustering.md` lesson.** Reference that lesson for the general clustering treatment; keep M15 AFP-framed around cohort/persona discovery, validation without labels, and method choice.
- Include a dataset where k-means breaks (moons and/or anisotropic blobs). Do not let a single internal metric substitute for domain review or downstream usefulness.
- Keep formulas only where genuine: k-means SSE, silhouette, and GMM/EM responsibilities. Density-clustering intuition is mostly prose and process visualization.
