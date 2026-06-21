# fe-end-to-end.py
# LESSON: End-to-end featurization for a CONTENT-BASED recommender. The book's
#         academic-paper recommender works like this: turn each item into a
#         feature VECTOR, then recommend items whose vectors are NEAREST to a
#         query item. The lesson: you must COMPOSE features and then SCALE /
#         NORMALIZE them BEFORE measuring similarity — otherwise one big-scale
#         feature silently decides every "nearest neighbor".
#
# PROBLEM we reproduce on RAW data: we build an item feature matrix where the
# columns live on VERY DIFFERENT SCALES. When we find nearest neighbors by
# distance/cosine WITHOUT scaling, the single large-scale feature DOMINATES the
# similarity, so neighbors are mostly the WRONG "topic" -> bad recommendations
# (low precision@5).
#
# FIX: StandardScale every column (so each feature counts equally), then
# L2-normalize each row (so cosine = a clean angle comparison). Redo the
# nearest-neighbor retrieval -> neighbors now share the item's topic ->
# precision@5 jumps. This IS the iterative "add a feature / scale it / re-measure
# the recommendations" loop a recommender engineer runs over and over.
#
# DATA: load_wine as the item catalog. 178 "items" (papers), 13 numeric features
# on wildly different scales (e.g. 'proline' is in the hundreds-to-thousands,
# 'nonflavanoid_phenols' is ~0.1-0.6), and 3 wine classes that we treat as the
# 3 "topics". A GOOD recommender returns neighbors of the SAME topic.
#
# Runs top-to-bottom in Colab. Packages: numpy, matplotlib, scikit-learn only.

import numpy as np
import matplotlib.pyplot as plt
from sklearn.datasets import load_wine
from sklearn.preprocessing import StandardScaler, normalize
from sklearn.neighbors import NearestNeighbors

# ---------------------------------------------------------------------------
# STEP 1: Load real data. X = item feature matrix (178 items x 13 features).
# topic = the class label per item (0/1/2) = the "topic" a good recommender
# should match. We NEVER feed 'topic' into the features; it is only the
# answer key we grade against.
# ---------------------------------------------------------------------------
data = load_wine()
X, topic = data.data, data.target           # X: 178 x 13 ; topic: 178 labels
n_items = X.shape[0]
K = 5                                        # recommend 5 neighbors per item

# ---------------------------------------------------------------------------
# STEP 2: Visualize the PURE (raw) data — show that the 13 feature columns live
# on totally different scales. We plot each column's spread (min..max range).
# One column ('proline') towers over all the others by ~1000x.
# ---------------------------------------------------------------------------
col_ranges = X.max(axis=0) - X.min(axis=0)   # how wide each feature spreads
order = np.argsort(col_ranges)               # smallest -> largest spread
fig, ax = plt.subplots(figsize=(9, 4))
ax.barh(np.array(data.feature_names)[order], col_ranges[order], color="indianred")
ax.set_xscale("log")                         # log axis or you can't see the small ones
ax.set_title("STEP 2: raw feature scales differ by ~1000x (note the log x-axis)")
ax.set_xlabel("range (max - min) of each raw feature, log scale")
plt.tight_layout(); plt.show()

# ---------------------------------------------------------------------------
# Helper: precision@k for the recommender. For every item, ask for its k
# nearest neighbors (excluding itself) and measure the fraction that share the
# item's topic. Average over all items. Higher = better recommendations.
# ---------------------------------------------------------------------------
def precision_at_k(features, k):
    # cosine distance; ask k+1 because the closest match is the item itself.
    nn = NearestNeighbors(n_neighbors=k + 1, metric="cosine").fit(features)
    neigh = nn.kneighbors(features, return_distance=False)[:, 1:]  # drop self
    same_topic = (topic[neigh] == topic[:, None])                 # hit / miss grid
    return same_topic.mean()                  # mean precision@k over all items

# ---------------------------------------------------------------------------
# STEP 3: Reproduce the PROBLEM — run the recommender on RAW features.
# Because 'proline' is ~1000x bigger than everything else, cosine similarity is
# essentially "how close is proline?", ignoring the other 12 features. Neighbors
# are mostly the WRONG topic -> low precision@5. Print the number.
# ---------------------------------------------------------------------------
raw_p5 = precision_at_k(X, K)
print(f"PROBLEM (raw, unscaled): precision@5 = {raw_p5:.3f}")

# ---------------------------------------------------------------------------
# STEP 4: Apply the technique, then visualize the ENGINEERED data.
# (a) StandardScale: subtract mean, divide by std -> every feature now has the
#     SAME spread, so none can dominate.
# (b) L2-normalize each row -> each item vector has length 1, so cosine compares
#     pure DIRECTION (the mix of features), which is what we want.
# ---------------------------------------------------------------------------
X_scaled = StandardScaler().fit_transform(X)     # (a) equalize column scales
X_eng = normalize(X_scaled, norm="l2", axis=1)   # (b) unit-length rows

eng_ranges = X_scaled.max(axis=0) - X_scaled.min(axis=0)
fig, ax = plt.subplots(1, 2, figsize=(12, 4))
ax[0].barh(np.array(data.feature_names)[order], col_ranges[order], color="indianred")
ax[0].set_xscale("log")
ax[0].set_title("STEP 4a: RAW scales (one feature dominates)")
ax[0].set_xlabel("range, log scale")
ax[1].barh(np.array(data.feature_names)[order], eng_ranges[order], color="seagreen")
ax[1].set_title("STEP 4b: SCALED — every feature now has a comparable range")
ax[1].set_xlabel("range after StandardScaler")
plt.tight_layout(); plt.show()

# ---------------------------------------------------------------------------
# STEP 5: Show the FIX — SAME recommender, now on scaled + L2-normalized
# features. Every feature gets a vote, so neighbors share the item's topic ->
# precision@5 jumps. Also sweep k=1..10 to show the win holds at every cutoff.
# ---------------------------------------------------------------------------
eng_p5 = precision_at_k(X_eng, K)
print(f"FIX (scaled + L2-normalized): precision@5 = {eng_p5:.3f}")

ks = range(1, 11)
raw_curve = [precision_at_k(X, k) for k in ks]
eng_curve = [precision_at_k(X_eng, k) for k in ks]

fig, ax = plt.subplots(1, 2, figsize=(12, 4))
ax[0].plot(list(ks), raw_curve, "o-", color="indianred", label="raw (unscaled)")
ax[0].plot(list(ks), eng_curve, "o-", color="seagreen", label="scaled + normalized")
ax[0].set_title("STEP 5a: precision@k — raw vs engineered (higher is better)")
ax[0].set_xlabel("k (number of recommendations)"); ax[0].set_ylabel("precision@k")
ax[0].set_ylim(0, 1.02); ax[0].legend()
ax[1].bar(["raw", "engineered"], [raw_p5, eng_p5], color=["indianred", "seagreen"])
ax[1].set_title("STEP 5b: mean precision@5 — raw vs engineered")
ax[1].set_ylabel("precision@5"); ax[1].set_ylim(0, 1.02)
for i, v in enumerate([raw_p5, eng_p5]):
    ax[1].text(i, v + 0.02, f"{v:.3f}", ha="center")
plt.tight_layout(); plt.show()

print(f"PROBLEM (raw): {raw_p5:.3f}   →   FIX (engineered): {eng_p5:.3f}")
