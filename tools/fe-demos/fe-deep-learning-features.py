# Deep-learning features / transfer learning: learned representations are LABEL-EFFICIENT.
#
# THE IDEA: instead of feeding a classifier RAW PIXELS, feed it the activations of a
# network that already learned a good representation of images. With only a few labels
# per class, raw pixels overfit and generalize poorly; learned features need far fewer
# labels to hit the same accuracy.
#
# NOTE: real "deep features" come from a big CNN PRETRAINED ON IMAGENET (millions of
# labeled images). We can't download/run that in a notebook, so we use a small,
# reproducible STAND-IN: pretrain a tiny MLP on an ABUNDANT, DISJOINT pool of digits and
# freeze its hidden layer as a feature extractor. Same lesson, runs offline in seconds.

import numpy as np
import matplotlib.pyplot as plt
from sklearn.datasets import load_digits
from sklearn.neural_network import MLPClassifier
from sklearn.linear_model import LogisticRegression
from sklearn.preprocessing import StandardScaler
from sklearn.metrics import accuracy_score

# ---------- 1. LOAD REAL DATA (8x8 handwritten digits, 0-9) ----------
X, y = load_digits(return_X_y=True)        # X: (1797, 64) pixel intensities 0-16
X = X / 16.0                                # scale pixels to [0, 1]
rng = np.random.default_rng(0)             # fixed seed -> fully deterministic

# DISJOINT SPLITS (no leakage): the pretrain pool, the few-label train set, and the
# test set come from completely separate samples. The pretrain pool is treated as
# "abundant other data" — its labels are NOT used when training the digit classifier.
idx = rng.permutation(len(X))
pre_idx, pool_idx = idx[:1000], idx[1000:]          # 1000 pretrain, rest for eval
te_idx = pool_idx[:500]                              # held-out test set
train_pool = pool_idx[500:]                          # draw the few labels from here
X_pre = X[pre_idx]                                   # pretrain features (labels y[pre_idx] only for the proxy)
X_te, y_te = X[te_idx], y[te_idx]

# ---------- 2. VISUALIZE THE PURE (raw) DATA ----------
fig, ax = plt.subplots(1, 2, figsize=(10, 4))
ax[0].imshow(X[0].reshape(8, 8), cmap="gray"); ax[0].set_title(f"raw 8x8 pixels (label={y[0]})")
ax[0].axis("off")

# ---------- PRETRAIN THE FROZEN FEATURE EXTRACTOR (the CNN stand-in) ----------
# Train a small MLP on the abundant DISJOINT pool, then reuse its hidden layer as a
# fixed feature map. We DO use labels here, but only on data disjoint from train/test —
# this mimics a network pretrained on a separate, large image corpus.
scaler = StandardScaler().fit(X_pre)
extractor = MLPClassifier(hidden_layer_sizes=(64,), max_iter=400, random_state=0)
extractor.fit(scaler.transform(X_pre), y[pre_idx])

def learned_features(Xin):
    # forward pass to the hidden layer only (ReLU activations) = the "deep" feature vector
    h = scaler.transform(Xin) @ extractor.coefs_[0] + extractor.intercepts_[0]
    return np.maximum(h, 0.0)

# ---------- 3 & 5. PROBLEM (raw pixels) vs FIX (learned features) across label budgets ----------
budgets = [1, 2, 3, 5, 10, 20]   # labeled examples PER CLASS
acc_raw, acc_feat = [], []
for k in budgets:
    # pick k labeled examples per class from the train pool (deterministic)
    sel = []
    for c in range(10):
        cls = train_pool[y[train_pool] == c]
        sel.extend(rng.permutation(cls)[:k])
    sel = np.array(sel)
    Xtr, ytr = X[sel], y[sel]

    # PROBLEM: LogisticRegression on RAW PIXELS
    raw_clf = LogisticRegression(max_iter=2000, random_state=0).fit(Xtr, ytr)
    acc_raw.append(accuracy_score(y_te, raw_clf.predict(X_te)))

    # FIX: SAME classifier on FROZEN LEARNED FEATURES
    feat_clf = LogisticRegression(max_iter=2000, random_state=0).fit(learned_features(Xtr), ytr)
    acc_feat.append(accuracy_score(y_te, feat_clf.predict(learned_features(X_te))))

# ---------- 4. VISUALIZE: accuracy vs labels-per-class (the payoff plot) ----------
ax[1].plot(budgets, acc_raw, "o--", label="raw pixels")
ax[1].plot(budgets, acc_feat, "s-", label="learned features (frozen)")
ax[1].set_xlabel("labels per class"); ax[1].set_ylabel("test accuracy")
ax[1].set_title("learned features win, biggest gap when labels are scarce")
ax[1].legend(); ax[1].grid(alpha=0.3)
plt.tight_layout(); plt.show()

# ---------- SUMMARY at the smallest label budget ----------
print(f"labels/class: {budgets}")
print(f"raw pixels   : {[round(a,3) for a in acc_raw]}")
print(f"learned feats: {[round(a,3) for a in acc_feat]}")
print(f"PROBLEM (raw, {budgets[0]} label/class): {acc_raw[0]:.3f}   "
      f"→   FIX (learned features): {acc_feat[0]:.3f}")
