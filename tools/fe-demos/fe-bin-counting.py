# fe-bin-counting.py
# LESSON: Bin counting / target (response-rate) encoding — replace a HIGH-CARDINALITY
# category with the TARGET's statistics for that category (its historical positive rate),
# computed LEAKAGE-FREE (out-of-fold).
#
# PROBLEM we reproduce: a category with HUNDREDS of distinct IDs, one-hot encoded, makes a
# huge SPARSE matrix (one column per ID). Each ID is seen only a few times, so the linear
# model must estimate one weight per column from ~3 labels — pure noise. Regularization then
# SHRINKS every per-ID weight toward zero (the global mean), erasing the strong per-ID signal
# -> the model "barely learns" -> poor TEST accuracy (and an overfit train/test gap).
# FIX: replace the category with its OUT-OF-FOLD target mean (bin counting / target encoding):
# ONE dense, highly-predictive column = "what fraction of past rows with this ID were positive".
# Now there is a SINGLE logistic weight, fit from ALL train rows, that regularization can't
# wash out. Refit -> test accuracy jumps.
# CAVEAT: the target mean MUST be computed out-of-fold (KFold). A naive in-fold mean lets each
# row peek at its OWN label and LEAKS -> a fake-high train score that collapses on test data.
#
# Runs top-to-bottom in Colab. Packages: numpy, matplotlib, scikit-learn only.

import numpy as np
import matplotlib.pyplot as plt
from sklearn.linear_model import LogisticRegression
from sklearn.model_selection import train_test_split, KFold
from sklearn.metrics import accuracy_score

# ---------------------------------------------------------------------------
# STEP 1: Build the data with a fixed rng (illustrative — no bundled dataset has the right
# shape). One HIGH-CARDINALITY category "store_id" with 800 distinct IDs, each seen only ~4
# times. Each ID is either "mostly negative" (10% positive) or "mostly positive" (90%); the
# label is drawn from that rate. So the ID *is* the signal, but you learn it only by COUNTING
# outcomes per ID — and with ~4 rows per ID, one-hot has almost no data per column.
# ---------------------------------------------------------------------------
rng = np.random.default_rng(0)              # fixed seed -> reproducible numbers
n_ids = 800                                 # hundreds of categories = high cardinality
rows_per_id = 4                             # each ID seen only a handful of times
n = n_ids * rows_per_id

id_pos_rate = rng.choice([0.1, 0.9], size=n_ids)    # each ID is strongly - or strongly +
store_id = rng.integers(0, n_ids, size=n)           # each row belongs to some store
y = (rng.uniform(size=n) < id_pos_rate[store_id]).astype(int)   # label ~ that ID's rate

# Split BEFORE any encoding so the test set is truly held out.
idx = np.arange(n)
tr, te = train_test_split(idx, test_size=0.3, random_state=0, stratify=y)

# ---------------------------------------------------------------------------
# STEP 2: Visualize the PURE (raw) category — just an integer ID with no usable order, and
# each ID appears only a handful of times (sparse evidence per category).
# ---------------------------------------------------------------------------
fig, ax = plt.subplots(1, 2, figsize=(12, 4))
counts = np.bincount(store_id, minlength=n_ids)
ax[0].hist(counts, bins=range(0, counts.max() + 2), color="steelblue", align="left")
ax[0].set_title(f"STEP 2: rows per store_id (median={int(np.median(counts))}) — few per ID")
ax[0].set_xlabel("# rows for a given store_id"); ax[0].set_ylabel("# of store_ids")

# ---------------------------------------------------------------------------
# STEP 3: Reproduce the PROBLEM — ONE-HOT the 800 IDs, fit LogisticRegression.
# One-hot makes a WIDE SPARSE matrix (one column per ID). With ~3 train rows per column, the
# 800 per-ID weights are noisy and get SHRUNK toward zero by L2 -> the signal is lost ->
# poor TEST accuracy, plus an overfit train>test gap. (We build the one-hot by hand to keep
# deps minimal: column j = 1 if store_id == j.)
# ---------------------------------------------------------------------------
def one_hot(ids):
    M = np.zeros((ids.shape[0], n_ids))
    M[np.arange(ids.shape[0]), ids] = 1.0
    return M

Xoh_tr, Xoh_te = one_hot(store_id[tr]), one_hot(store_id[te])
oh_clf = LogisticRegression(max_iter=2000, C=0.1)   # C=0.1: realistic L2 -> shrinks weights
oh_clf.fit(Xoh_tr, y[tr])
oh_train_acc = accuracy_score(y[tr], oh_clf.predict(Xoh_tr))
oh_acc = accuracy_score(y[te], oh_clf.predict(Xoh_te))
oh_width = Xoh_tr.shape[1]                   # 800 columns

# ---------------------------------------------------------------------------
# STEP 4: Apply the FIX — OUT-OF-FOLD target encoding (bin counting) with smoothing.
# For each TRAIN row, compute its ID's positive rate using ONLY the OTHER folds, so the row
# never sees its own label (no leakage). Smoothing (s + SM*global) / (c + SM) shrinks rare
# IDs toward the global mean — a sane prior when an ID has only 1-2 rows. For TEST, use the
# rate learned on the FULL train set.
# ---------------------------------------------------------------------------
global_mean = y[tr].mean()
SMOOTH = 5.0                                 # pseudo-count toward the global mean

def smoothed_means(ids, labels):
    """Smoothed per-ID positive rate from (ids, labels)."""
    s = np.bincount(ids, weights=labels, minlength=n_ids)   # # positives per ID
    c = np.bincount(ids, minlength=n_ids)                   # # rows per ID
    return (s + SMOOTH * global_mean) / (c + SMOOTH)

# 4a. Honest TRAIN encoding: K-fold, each row encoded from the OTHER folds only.
enc_tr = np.empty(tr.shape[0])
kf = KFold(n_splits=5, shuffle=True, random_state=0)
for fit_i, enc_i in kf.split(tr):           # indices INTO the train block
    m = smoothed_means(store_id[tr][fit_i], y[tr][fit_i])
    enc_tr[enc_i] = m[store_id[tr][enc_i]]

# 4b. TEST encoding: rate learned from the FULL train set (test labels never touched).
m_full = smoothed_means(store_id[tr], y[tr])
enc_te = m_full[store_id[te]]

# Visualize the engineered feature: the single encoded column vs the actual label —
# the two ID groups separate into a low cluster (~0.1) and a high cluster (~0.9).
sub = rng.permutation(te.shape[0])[:600]    # subsample so the scatter stays readable
ax[1].scatter(enc_te[sub], y[te][sub] + rng.normal(0, 0.03, len(sub)), s=8, alpha=0.4)
ax[1].set_title("STEP 4: target-encoded feature (1 dense col) vs y")
ax[1].set_xlabel("out-of-fold positive-rate for this ID"); ax[1].set_ylabel("y (0/1, jittered)")
plt.tight_layout(); plt.show()

# ---------------------------------------------------------------------------
# STEP 5: Show the FIX — SAME LogisticRegression on the SINGLE target-encoded column.
# ---------------------------------------------------------------------------
te_clf = LogisticRegression(max_iter=2000)
te_clf.fit(enc_tr.reshape(-1, 1), y[tr])
te_acc = accuracy_score(y[te], te_clf.predict(enc_te.reshape(-1, 1)))

# CAUTIONARY NOTE: naive IN-FOLD encoding (use each row's own label in the mean) LEAKS.
# It looks great on TRAIN but is dishonest. We show the inflated TRAIN score as a warning.
leak_enc_tr = m_full[store_id[tr]]          # encoded using the SAME rows' labels -> leak
leak_clf = LogisticRegression(max_iter=2000).fit(leak_enc_tr.reshape(-1, 1), y[tr])
leak_train_acc = accuracy_score(y[tr], leak_clf.predict(leak_enc_tr.reshape(-1, 1)))
leak_test_acc = accuracy_score(y[te], leak_clf.predict(enc_te.reshape(-1, 1)))

print(f"PROBLEM (one-hot {oh_width} cols, sparse):  train acc = {oh_train_acc:.3f}  "
      f"test acc = {oh_acc:.3f}  (overfit gap, signal shrunk away)")
print(f"FIX (out-of-fold target encoding, 1 col): test acc = {te_acc:.3f}")
print(f"  matrix width: {oh_width} cols  ->  1 col")
print(f"LEAKAGE CAVEAT — naive in-fold encoding: train acc = {leak_train_acc:.3f} "
      f"(looks great!) but test acc = {leak_test_acc:.3f}; the train score is a MIRAGE.")
print(f"PROBLEM (raw): {oh_acc:.3f}   →   FIX (engineered): {te_acc:.3f}")
