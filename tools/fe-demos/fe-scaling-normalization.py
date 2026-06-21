# Feature scaling / standardization — why distance-based models NEED it
# =====================================================================
# THE BIG IDEA (in plain words):
#   k-Nearest Neighbors (k-NN) classifies a point by looking at its CLOSEST
#   neighbors. "Closest" means smallest distance. Distance adds up the gaps on
#   EVERY feature. If one feature has BIG numbers (hundreds) and another has
#   SMALL numbers (about 1), the big-number feature alone decides the distance.
#   The small feature is basically ignored — even if it carries real signal.
#   FIX: rescale every feature to the same size (StandardScaler), so each one
#   gets a fair vote in the distance.

# --- Step 1: Load real data ------------------------------------------------
# load_wine: 178 wines, 3 classes (cultivars). We pick TWO REAL features that
# live on wildly different scales:
#   'proline'  -> hundreds to ~1700  (a big-number feature)
#   'hue'      -> roughly 0.5 to 1.7  (a small-number feature)
import numpy as np
import matplotlib.pyplot as plt
from sklearn.datasets import load_wine
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler
from sklearn.neighbors import KNeighborsClassifier
from sklearn.metrics import accuracy_score

wine = load_wine()
feat_names = list(wine.feature_names)
i_proline = feat_names.index("proline")   # big scale
i_hue = feat_names.index("hue")           # small scale
X = wine.data[:, [i_proline, i_hue]]      # columns: [proline, hue]
y = wine.target

# Fixed split so the numbers reproduce every run.
X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.30, random_state=0, stratify=y
)

# Show just how different the scales are (this is the whole point).
print(f"proline range: {X[:,0].min():7.1f} .. {X[:,0].max():7.1f}  (hundreds)")
print(f"hue     range: {X[:,1].min():7.2f} .. {X[:,1].max():7.2f}  (about 1)")

# --- Step 2: Visualize the PURE (raw) data ---------------------------------
# Build the standardized version now so we can plot raw vs scaled side by side.
scaler = StandardScaler().fit(X_train)
X_train_s = scaler.transform(X_train)
X_test_s = scaler.transform(X_test)
X_s = scaler.transform(X)

fig, ax = plt.subplots(1, 2, figsize=(11, 4.5))
for c in np.unique(y):
    ax[0].scatter(X[y == c, 0], X[y == c, 1], s=18, alpha=0.7,
                  label=wine.target_names[c])
ax[0].set_title("RAW: cloud STRETCHED along proline")
ax[0].set_xlabel("proline (hundreds)")
ax[0].set_ylabel("hue (~1)")
ax[0].legend(fontsize=8)

# --- Step 3: Reproduce the PROBLEM on RAW data -----------------------------
# Same k-NN, raw features. Distance is basically just |proline difference|,
# because proline numbers dwarf hue numbers. hue is ignored -> weak accuracy.
knn_raw = KNeighborsClassifier(n_neighbors=5)
knn_raw.fit(X_train, y_train)
acc_raw = accuracy_score(y_test, knn_raw.predict(X_test))
print(f"\nPROBLEM  k-NN on RAW features: accuracy = {acc_raw:.3f}")

# --- Step 4: Apply the technique, then visualize the ENGINEERED data --------
# StandardScaler: for each feature subtract its mean, divide by its std.
# Now BOTH features span roughly the same range -> the cloud looks ROUND and
# both axes are comparable, so both can contribute to the distance.
for c in np.unique(y):
    ax[1].scatter(X_s[y == c, 0], X_s[y == c, 1], s=18, alpha=0.7,
                  label=wine.target_names[c])
ax[1].set_title("STANDARDIZED: round cloud, axes comparable")
ax[1].set_xlabel("proline (standardized)")
ax[1].set_ylabel("hue (standardized)")
ax[1].set_aspect("equal", "box")
ax[1].legend(fontsize=8)
plt.tight_layout()
plt.show()

# --- Step 5: Show the FIX --------------------------------------------------
# SAME k-NN (k=5), now on standardized features. Both features get a fair vote
# in the distance -> accuracy jumps.
knn_fix = KNeighborsClassifier(n_neighbors=5)
knn_fix.fit(X_train_s, y_train)
acc_fix = accuracy_score(y_test, knn_fix.predict(X_test_s))
print(f"FIX      k-NN on STANDARDIZED features: accuracy = {acc_fix:.3f}")

# One-line before/after summary.
print(f"\nPROBLEM (raw): {acc_raw:.3f}   →   FIX (standardized): {acc_fix:.3f}")
