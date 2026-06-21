# Lesson: Feature hashing (the "hashing trick") — squash a HUGE categorical
# space into a fixed small number of buckets, instead of one-hot encoding
# every distinct value.
#
# PROBLEM: one-hot encoding a HIGH-CARDINALITY category (think: 50,000 distinct
# user IDs / URLs / device strings) gives one column PER value. The feature
# matrix becomes 50,000 columns wide, almost entirely zeros, and you must STORE
# a growing vocabulary (value -> column) that gets bigger every time a new value
# shows up. That is impractical: width and memory blow up with cardinality.
#
# FIX: FeatureHasher. Run each category string through a hash function and use
# (hash mod K) as its column, for a FIXED K (here 2**14 = 16,384). Width is
# ALWAYS 16,384 no matter how many distinct values exist (50,000 here, or
# millions), and there is NO vocabulary to store. Two different values can
# collide into the same bucket, but with enough buckets collisions are rare, so
# a downstream LINEAR model still classifies about as well.

import numpy as np
import matplotlib.pyplot as plt
from sklearn.feature_extraction import FeatureHasher
from sklearn.preprocessing import OneHotEncoder
from sklearn.linear_model import LogisticRegression
from sklearn.model_selection import train_test_split

# ---- STEP 1: Load / build real data -----------------------------------------
# We BUILD a realistic high-cardinality dataset with a fixed rng(0) so numbers
# reproduce. Each row is one event with a single categorical feature: a "user
# id" string like "user_03917". The id space is HUGE — 50,000 possible ids — so
# one-hot would need to reserve a column for every one (a growing vocabulary).
# The category carries real signal: each id belongs to one of 2 hidden groups,
# and the group decides the label (with a little label noise so it's not trivial).
rng = np.random.default_rng(0)
N_IDS = 50_000          # size of the POSSIBLE id space (the cardinality one-hot must reserve)
N_ROWS = 200_000        # number of training/eval events
id_group = rng.integers(0, 2, size=N_IDS)          # hidden group (0/1) per id -> the signal
# A pool of 4,000 ids actually fire, each repeating many times across events, so
# the per-id signal is genuinely LEARNABLE. The id space they're drawn from is
# still 50,000 wide -> one-hot must reserve all 50,000 columns / vocabulary slots.
active = rng.choice(N_IDS, size=4_000, replace=False)
row_ids = rng.choice(active, size=N_ROWS, replace=True)  # which id fired per event
y = id_group[row_ids].copy()                       # label = the id's group...
flip = rng.random(N_ROWS) < 0.05                   # ...with 5% label noise
y[flip] = 1 - y[flip]
cats = np.array([f"user_{i:05d}" for i in row_ids]) # the raw categorical strings

Xtr_cat, Xte_cat, ytr, yte = train_test_split(
    cats, y, test_size=0.25, random_state=0, stratify=y)
print(f"STEP 1  {N_ROWS} events, {len(np.unique(cats))} distinct ids seen "
      f"(out of {N_IDS} possible). High-cardinality categorical.")

# ---- STEP 2: Visualize the PURE (raw) data ----------------------------------
# Raw data is just category strings. The honest picture of "raw" here: out of
# 50,000 POSSIBLE ids, only a few thousand ever appear, and one-hot would still
# reserve a column for ALL of them. Plot how many ids appeared vs never appeared.
fig, ax = plt.subplots(1, 2, figsize=(13, 4.6))
counts = np.bincount(row_ids, minlength=N_IDS)     # times each id fired
n_seen = int((counts > 0).sum()); n_unseen = N_IDS - n_seen
ax[0].bar(["appeared", "never seen\n(still reserved)"], [n_seen, n_unseen],
          color=["#7f8c8d", "#bdc3c7"])
ax[0].set_title("STEP 2: most of the 50,000 id columns are empty\n"
                "(one-hot reserves a column for every possible id)")
ax[0].set_ylabel("number of ids")
for i, v in enumerate([n_seen, n_unseen]):
    ax[0].text(i, v, f"{v}", ha="center", va="bottom")

# ---- STEP 3: Reproduce the PROBLEM on the raw data --------------------------
# One-hot encode against the FULL possible id space (the production reality: you
# must reserve a column for every id you might ever see). Width = 50,000 = an
# enormous, mostly-empty matrix, plus a stored vocabulary of that same size. We
# measure the width and the memory of one dense row, then train a linear model.
all_ids = np.array([f"user_{i:05d}" for i in range(N_IDS)])   # the full vocabulary
ohe = OneHotEncoder(categories=[all_ids], handle_unknown="ignore")
Xtr_oh = ohe.fit_transform(Xtr_cat.reshape(-1, 1))   # sparse, but width is huge
Xte_oh = ohe.transform(Xte_cat.reshape(-1, 1))
oh_width = Xtr_oh.shape[1]
oh_vocab = oh_width                                   # one stored entry per column
oh_dense_row_kb = oh_width * 8 / 1024                 # bytes if ONE row were dense (float64)
clf_oh = LogisticRegression(max_iter=1000)
clf_oh.fit(Xtr_oh, ytr)
acc_oh = clf_oh.score(Xte_oh, yte)
print(f"\nSTEP 3 PROBLEM  one-hot width = {oh_width} columns, "
      f"stored vocabulary = {oh_vocab} entries.")
print(f"                a single dense row would need {oh_dense_row_kb:,.1f} KB "
      f"(mostly zeros). Width grows with cardinality.")
print(f"                one-hot accuracy = {acc_oh:.3f}")

# ---- STEP 4: Apply feature hashing, then visualize the engineered data ------
# FeatureHasher maps each string to (hash mod K) for a FIXED K. No matter how
# many distinct ids exist, the width stays K and NO vocabulary is stored.
K = 2 ** 14   # 16,384 buckets — fixed width, still far below the 50,000 id space
hasher = FeatureHasher(n_features=K, input_type="string")
# FeatureHasher wants an iterable of token lists per row; one token (the id) each.
Xtr_h = hasher.transform([[c] for c in Xtr_cat])
Xte_h = hasher.transform([[c] for c in Xte_cat])
h_width = Xtr_h.shape[1]

# Show the engineered side: how the distinct ids spread over the K buckets.
# Most buckets hold 0 or 1 id -> collisions (2+ ids sharing a bucket) are rare.
seen_ids = np.unique(row_ids)
bucket_of_id = hasher.transform([[f"user_{i:05d}"] for i in seen_ids])
ids_per_bucket = np.asarray(np.abs(bucket_of_id).sum(axis=0)).ravel()  # ids in each bucket
load_hist = np.bincount(ids_per_bucket.astype(int))   # #buckets holding 0,1,2,... ids
ax[1].bar(range(len(load_hist)), load_hist, color="#2980b9")
ax[1].set_title(f"STEP 4: {len(seen_ids)} ids hashed into a FIXED {K} buckets\n"
                f"(x = ids sharing a bucket, y = #buckets — collisions are rare)")
ax[1].set_xlabel("ids landing in the same bucket"); ax[1].set_ylabel("number of buckets")
plt.tight_layout(); plt.show()

# ---- STEP 5: Show the FIX ----------------------------------------------------
# Same linear model, now on the fixed-width hashed features. Width collapsed
# from 50,000 to 16,384, no vocabulary stored, and accuracy stays about the same.
clf_h = LogisticRegression(max_iter=1000)
clf_h.fit(Xtr_h, ytr)
acc_h = clf_h.score(Xte_h, yte)
print(f"\nSTEP 5 FIX      hashed width = {h_width} columns (FIXED), "
      f"vocabulary stored = 0 entries.")
print(f"                hashed accuracy = {acc_h:.3f}")
print(f"\nWidth: {oh_width} cols (one-hot)  ->  {h_width} cols (hashed)   "
      f"= {oh_width / h_width:.1f}x narrower, no vocabulary.")
print(f"PROBLEM (one-hot acc): {acc_oh:.3f}   ->   FIX (hashed acc): {acc_h:.3f}")

# ---- The required side-by-side comparison: WIDTH and ACCURACY ----------------
# Left: feature-matrix width (one-hot grows with cardinality, hashed is fixed).
# Right: held-out accuracy (about the same — collisions cost little).
fig2, ax2 = plt.subplots(1, 2, figsize=(11, 4.4))
ax2[0].bar(["one-hot", "hashed"], [oh_width, h_width], color=["#c0392b", "#2980b9"])
ax2[0].set_title("Feature-matrix WIDTH (columns)\nlower is cheaper")
ax2[0].set_ylabel("number of columns")
for i, v in enumerate([oh_width, h_width]):
    ax2[0].text(i, v, f"{v}", ha="center", va="bottom")
ax2[1].bar(["one-hot", "hashed"], [acc_oh, acc_h], color=["#c0392b", "#2980b9"])
ax2[1].set_title("Held-out ACCURACY\nabout the same"); ax2[1].set_ylim(0, 1)
for i, v in enumerate([acc_oh, acc_h]):
    ax2[1].text(i, v, f"{v:.3f}", ha="center", va="bottom")
plt.tight_layout(); plt.show()
