# fe-categorical-encoding.py
# LESSON: One-hot encoding a nominal category vs naively label-encoding it as integers.
#
# PROBLEM we reproduce: a category like "city" has NO natural order. If we just hand
# the model integer codes 0,1,2,3, a LINEAR model reads those integers as NUMBERS:
# it assumes city 3 is "3x" city 1, and that city 1 sits "between" city 0 and city 2.
# That is a FALSE ORDER and FALSE DISTANCES. When the real city->target pattern is
# NON-monotonic in the arbitrary code (cities 0 and 2 high, cities 1 and 3 low), a
# single weight times the integer cannot fit it -> poor accuracy.
# FIX: one-hot encode. Each city gets its OWN 0/1 column, so the model learns one
# independent weight per city -> it can turn on exactly cities 0 and 2 -> accuracy jumps.
#
# Runs top-to-bottom in Colab. Packages: numpy, pandas, scikit-learn, matplotlib only.

import numpy as np
import pandas as pd
import matplotlib.pyplot as plt
from sklearn.linear_model import LogisticRegression
from sklearn.model_selection import train_test_split
from sklearn.metrics import accuracy_score

# ---------------------------------------------------------------------------
# STEP 1: Build the data with a fixed rng (illustrative — a nominal category with
# a NON-monotonic relationship to the target).  4 cities, coded 0..3.
# We choose target probability per city so it is HIGH for 0 and 2, LOW for 1 and 3:
# i.e. it zig-zags in the integer code, which no single line can follow.
# ---------------------------------------------------------------------------
rng = np.random.default_rng(0)                  # fixed seed -> reproducible numbers
n = 800
city = rng.integers(0, 4, size=n)               # arbitrary integer code 0,1,2,3
p_by_city = np.array([0.85, 0.15, 0.85, 0.15])  # zig-zag: 0,2 high ; 1,3 low
y = (rng.uniform(size=n) < p_by_city[city]).astype(int)

df = pd.DataFrame({"city": city, "y": y})

# Split ONCE on the raw integer column; reuse the same rows for both encodings.
idx = np.arange(n)
idx_tr, idx_te = train_test_split(idx, test_size=0.3, random_state=0, stratify=y)

# ---------------------------------------------------------------------------
# STEP 2: Visualize the PURE (raw) data — target rate per city.
# This bar chart shows the relationship ZIG-ZAGS in the integer code (non-monotonic),
# which is exactly what a "city * single weight" linear term cannot capture.
# ---------------------------------------------------------------------------
rates = df.groupby("city")["y"].mean()
fig, ax = plt.subplots(1, 2, figsize=(12, 4))
ax[0].bar(rates.index, rates.values, color=["steelblue", "salmon", "steelblue", "salmon"])
ax[0].plot(rates.index, rates.values, "k--o", lw=1.5, label="rate vs integer code")
ax[0].set_title("STEP 2: target rate per city — ZIG-ZAGS in the integer code")
ax[0].set_xlabel("city (integer code 0..3)"); ax[0].set_ylabel("rate of y=1")
ax[0].set_xticks([0, 1, 2, 3]); ax[0].set_ylim(0, 1.05); ax[0].legend(loc="upper right")

# ---------------------------------------------------------------------------
# STEP 3: Reproduce the PROBLEM — LogisticRegression on the RAW integer code.
# The model sees ONE number per row and fits ONE weight: P(y=1) = sigmoid(w*city + b),
# a monotone curve in city. It cannot say "high at 0 and 2 but low at 1 and 3".
# ---------------------------------------------------------------------------
X_int = df[["city"]].to_numpy(dtype=float)      # raw integer codes as a 2D matrix
int_clf = LogisticRegression()
int_clf.fit(X_int[idx_tr], y[idx_tr])
int_acc = accuracy_score(y[idx_te], int_clf.predict(X_int[idx_te]))

# ---------------------------------------------------------------------------
# STEP 4: Apply the FIX — one-hot encode the city, then visualize the new columns.
# pandas.get_dummies turns the single "city" column into 4 separate 0/1 columns.
# ---------------------------------------------------------------------------
X_oh = pd.get_dummies(df["city"], prefix="city").to_numpy(dtype=float)

# Show the one-hot layout for one example row per city (the identity-like block).
sample = np.vstack([X_oh[df["city"].to_numpy() == c][0] for c in range(4)])
ax[1].imshow(sample, cmap="Blues", vmin=0, vmax=1, aspect="auto")
ax[1].set_title("STEP 4: one-hot columns — each city is its OWN 0/1 feature")
ax[1].set_xlabel("one-hot column"); ax[1].set_ylabel("example from city")
ax[1].set_xticks(range(4)); ax[1].set_xticklabels([f"city_{c}" for c in range(4)])
ax[1].set_yticks(range(4)); ax[1].set_yticklabels([f"city {c}" for c in range(4)])
for i in range(4):
    for j in range(4):
        ax[1].text(j, i, int(sample[i, j]), ha="center", va="center")
plt.tight_layout(); plt.show()

# ---------------------------------------------------------------------------
# STEP 5: Show the FIX — the SAME LogisticRegression on the one-hot features.
# Now there is one independent weight per city, so it can lift cities 0 and 2 and
# drop cities 1 and 3 -> accuracy jumps toward the ~0.85 best-possible (label noise).
# ---------------------------------------------------------------------------
oh_clf = LogisticRegression()
oh_clf.fit(X_oh[idx_tr], y[idx_tr])
oh_acc = accuracy_score(y[idx_te], oh_clf.predict(X_oh[idx_te]))

print(f"PROBLEM (label-encoded integers): accuracy = {int_acc:.3f}")
print(f"FIX (one-hot encoded):            accuracy = {oh_acc:.3f}")
print(f"PROBLEM (raw): {int_acc:.3f}   →   FIX (engineered): {oh_acc:.3f}")
