"""
Shared, tested D1..D5 dataset ladders for the All ML notebook rebuild.

One statement per line, CPU-only, deterministic. Real datasets are sklearn-bundled (no
download) wherever possible; the few that download are guarded with a timeout + synthetic
fallback so run-all never hangs (mirrors tools/cv_ladder.py). Agents embed the functions they
need into a notebook's setup cell (self-contained for Colab) rather than importing this file.

Families covered here: F1 (supervised tabular: classification + regression), and the
data-quality / budget modifiers used by parts 17 and 18. Other families get their own helpers.
"""

import numpy as np
from sklearn.datasets import (
    load_iris,
    load_wine,
    load_breast_cancer,
    load_digits,
    load_diabetes,
    make_classification,
    make_blobs,
    make_moons,
    make_regression,
)
from sklearn.linear_model import LogisticRegression, LinearRegression
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler
from sklearn.metrics import accuracy_score, mean_squared_error


def _call_with_timeout(fn, seconds):
    """Run fn() but abort with TimeoutError after `seconds` (guards slow downloads)."""
    import signal

    def _raise(signum, frame):
        raise TimeoutError("download timed out")

    old = signal.signal(signal.SIGALRM, _raise)
    signal.alarm(seconds)
    try:
        return fn()
    finally:
        signal.alarm(0)
        signal.signal(signal.SIGALRM, old)


# ----------------------------------------------------------------------------- classification

def clf_ladder():
    """D1..D5 classification ladder of rising complexity. Returns [(name, X, y), ...].

    All X are 2-D float feature matrices, y integer labels, so one classifier runs unchanged
    across every rung (the 'watch it scale' story). Rungs get harder: clean+separable -> real
    high-dimensional. D1 is hand-built and fully inspectable.
    """
    rungs = []

    # D1 — four hand-placed 2-D points, 2 classes, clearly separable.
    x1 = np.array([[0.0, 0.0], [0.4, 0.2], [3.0, 3.0], [2.6, 3.2]])
    y1 = np.array([0, 0, 1, 1])
    rungs.append(("D1 hand 2-D points", x1, y1))

    # D2 — clean, well-separated Gaussian blobs.
    x2, y2 = make_blobs(n_samples=200, centers=3, cluster_std=0.8, random_state=1)
    rungs.append(("D2 clean blobs (3-class)", x2, y2))

    # D3 — non-linear, overlapping two-moons with noise.
    x3, y3 = make_moons(n_samples=300, noise=0.28, random_state=2)
    rungs.append(("D3 noisy moons (non-linear)", x3, y3))

    # D4 — real: Wine, 13 features, 3 classes.
    wine = load_wine()
    rungs.append(("D4 Wine (real, 13-D, 3-class)", wine.data, wine.target))

    # D5 — real, harder: Breast Cancer, 30 features, class imbalance.
    bc = load_breast_cancer()
    rungs.append(("D5 Breast Cancer (real, 30-D)", bc.data, bc.target))

    return rungs


def clf_digits_ladder():
    """A harder image-as-tabular classification ladder for DL topics (part 6).

    D1 XOR -> D2 blobs -> D3 noisy moons -> D4 sklearn digits (10-class, 64-D) ->
    D5 digits with label noise + feature noise (distribution shift).
    """
    rungs = []

    x1 = np.array([[0.0, 0.0], [1.0, 1.0], [0.0, 1.0], [1.0, 0.0]])
    y1 = np.array([0, 0, 1, 1])
    rungs.append(("D1 XOR", x1, y1))

    x2, y2 = make_blobs(n_samples=200, centers=3, cluster_std=1.0, random_state=1)
    rungs.append(("D2 blobs (3-class)", x2, y2))

    x3, y3 = make_moons(n_samples=300, noise=0.3, random_state=2)
    rungs.append(("D3 noisy moons", x3, y3))

    digits = load_digits()
    xd = digits.data / 16.0
    rungs.append(("D4 digits (real, 10-class, 64-D)", xd, digits.target))

    rng = np.random.default_rng(5)
    xn = xd + rng.normal(0.0, 0.25, size=xd.shape)
    yn = digits.target.copy()
    flip = rng.random(yn.shape) < 0.1
    yn[flip] = rng.integers(0, 10, size=int(flip.sum()))
    rungs.append(("D5 digits + label/feature noise", xn, yn))

    return rungs


def clf_accuracy(build_and_predict, X, y):
    """Split, call build_and_predict(x_tr, y_tr, x_te) -> preds, return held-out accuracy."""
    x_tr, x_te, y_tr, y_te = train_test_split(X, y, test_size=0.4, random_state=0, stratify=y)
    scaler = StandardScaler()
    x_tr = scaler.fit_transform(x_tr)
    x_te = scaler.transform(x_te)
    preds = build_and_predict(x_tr, y_tr, x_te)
    return accuracy_score(y_te, preds)


def logistic_baseline(x_tr, y_tr, x_te):
    """Default classifier used to demonstrate a ladder end to end."""
    clf = LogisticRegression(max_iter=2000)
    clf.fit(x_tr, y_tr)
    return clf.predict(x_te)


# --------------------------------------------------------------------------------- regression

def reg_ladder():
    """D1..D5 regression ladder of rising complexity. Returns [(name, X, y), ...]."""
    rungs = []

    x1 = np.array([[0.0], [1.0], [2.0], [3.0]])
    y1 = np.array([1.0, 3.0, 5.0, 7.0])
    rungs.append(("D1 hand line y=2x+1", x1, y1))

    rng = np.random.default_rng(1)
    x2 = np.linspace(-3, 3, 120).reshape(-1, 1)
    y2 = (2.0 * x2[:, 0] + 1.0) + rng.normal(0, 0.5, size=120)
    rungs.append(("D2 linear + noise", x2, y2))

    x3 = np.linspace(-3, 3, 160).reshape(-1, 1)
    y3 = np.sin(1.5 * x3[:, 0]) + rng.normal(0, 0.2, size=160)
    rungs.append(("D3 sine (non-linear)", x3, y3))

    dia = load_diabetes()
    rungs.append(("D4 Diabetes (real, 10-D)", dia.data, dia.target))

    x5, y5 = make_regression(n_samples=300, n_features=20, n_informative=8, noise=25.0, random_state=5)
    rungs.append(("D5 high-dim + noise (20-D)", x5, y5))

    return rungs


def reg_rmse(build_and_predict, X, y):
    """Split, call build_and_predict(x_tr, y_tr, x_te) -> preds, return held-out RMSE."""
    x_tr, x_te, y_tr, y_te = train_test_split(X, y, test_size=0.4, random_state=0)
    preds = build_and_predict(x_tr, y_tr, x_te)
    return float(np.sqrt(mean_squared_error(y_te, preds)))


def linear_baseline(x_tr, y_tr, x_te):
    clf = LinearRegression()
    clf.fit(x_tr, y_tr)
    return clf.predict(x_te)


# ------------------------------------------------------------------- modifier ladders (17, 18)

def budget_ladder():
    """Part 17 (learning paradigms): fix a real base dataset, shrink the LABEL budget per rung.

    Returns [(name, X, y, labeled_mask), ...] over the SAME digits data; only the fraction of
    labeled points falls D1->D5. The 'watch it scale' curve is accuracy vs label budget.
    """
    digits = load_digits()
    X = digits.data / 16.0
    y = digits.target
    rng = np.random.default_rng(17)
    rungs = []
    for name, frac in [("D1 100% labels", 1.0), ("D2 50% labels", 0.5), ("D3 20% labels", 0.2), ("D4 5% labels", 0.05), ("D5 2% labels", 0.02)]:
        mask = rng.random(y.shape) < frac
        if mask.sum() < 20:
            idx = rng.choice(len(y), size=20, replace=False)
            mask = np.zeros(len(y), dtype=bool)
            mask[idx] = True
        rungs.append((name, X, y, mask))
    return rungs


def dataquality_ladder():
    """Part 18 (data-centric): fix the model, DEGRADE data quality per rung.

    Returns [(name, X, y), ...] where the SAME Breast Cancer data is progressively corrupted:
    clean -> label noise -> class imbalance -> feature noise -> missing-then-imputed. The curve
    is accuracy vs data quality, so cleaning the data (not the model) is what moves it.
    """
    bc = load_breast_cancer()
    X0 = bc.data.astype(float)
    y0 = bc.target
    rng = np.random.default_rng(18)
    rungs = []

    rungs.append(("D1 clean", X0.copy(), y0.copy()))

    y2 = y0.copy()
    flip = rng.random(y2.shape) < 0.15
    y2[flip] = 1 - y2[flip]
    rungs.append(("D2 15% label noise", X0.copy(), y2))

    keep_pos = np.where(y0 == 1)[0]
    keep_neg = np.where(y0 == 0)[0][:30]
    idx = np.concatenate([keep_pos, keep_neg])
    rungs.append(("D3 class imbalance", X0[idx].copy(), y0[idx].copy()))

    X4 = X0 + rng.normal(0.0, X0.std(axis=0) * 0.5, size=X0.shape)
    rungs.append(("D4 heavy feature noise", X4, y0.copy()))

    X5 = X0.copy()
    holes = rng.random(X5.shape) < 0.2
    X5[holes] = np.nan
    col_means = np.nanmean(X5, axis=0)
    X5 = np.where(np.isnan(X5), col_means, X5)
    rungs.append(("D5 20% missing (mean-imputed)", X5, y0.copy()))

    return rungs


# ---------------------------------------------------------------- unsupervised (part 4: F2/F3)

def cluster_ladder():
    """D1..D5 clustering ladder of rising difficulty. Returns [(name, X, y_true, k), ...].

    y_true is the generating label (for ARI scoring only — clustering does not see it).
    Rungs: hand points -> clean blobs -> anisotropic/overlap -> real Iris -> real digits(4-class).
    """
    rungs = []

    x1 = np.array([[0.0, 0.0], [0.3, 0.2], [3.0, 3.0], [3.2, 2.8], [0.1, 3.1], [0.2, 2.9]])
    y1 = np.array([0, 0, 1, 1, 2, 2])
    rungs.append(("D1 hand 3 clusters", x1, y1, 3))

    x2, y2 = make_blobs(n_samples=200, centers=3, cluster_std=0.7, random_state=1)
    rungs.append(("D2 clean blobs", x2, y2, 3))

    x3, y3 = make_blobs(n_samples=240, centers=3, cluster_std=1.6, random_state=2)
    transform = np.array([[0.6, -0.6], [-0.4, 0.8]])
    x3 = x3 @ transform
    rungs.append(("D3 anisotropic + overlap", x3, y3, 3))

    iris = load_iris()
    rungs.append(("D4 Iris (real, 4-D)", iris.data, iris.target, 3))

    digits = load_digits()
    keep = np.isin(digits.target, [0, 1, 2, 3])
    rungs.append(("D5 digits 0-3 (real, 64-D)", digits.data[keep] / 16.0, digits.target[keep], 4))

    return rungs


def cluster_ari(cluster_fn, X, k):
    """Call cluster_fn(X, k) -> labels; caller compares to y_true with adjusted_rand_score."""
    return cluster_fn(X, k)


def dimred_ladder():
    """D1..D5 dimensionality-reduction ladder. Returns [(name, X, y), ...] of rising ambient dim.

    2-D toy -> 3-D swiss-roll-ish -> digits(64-D) -> the same with noise dims -> a wide feature set.
    y is a color/label for visualization only.
    """
    rungs = []
    rng = np.random.default_rng(3)

    t = np.linspace(0, 4, 120)
    x1 = np.column_stack([t, 0.5 * t + rng.normal(0, 0.05, 120)])
    rungs.append(("D1 near-1-D line in 2-D", x1, t))

    tt = np.linspace(0, 3 * np.pi, 200)
    x2 = np.column_stack([tt * np.cos(tt), 8 * rng.random(200), tt * np.sin(tt)])
    rungs.append(("D2 swiss-roll (3-D)", x2, tt))

    digits = load_digits()
    rungs.append(("D3 digits (real, 64-D)", digits.data / 16.0, digits.target))

    xn = np.hstack([digits.data / 16.0, rng.normal(0, 1, size=(digits.data.shape[0], 32))])
    rungs.append(("D4 digits + 32 noise dims", xn, digits.target))

    bc = load_breast_cancer()
    rungs.append(("D5 Breast Cancer (30-D)", bc.data, bc.target))

    return rungs


if __name__ == "__main__":
    print("clf_ladder:")
    for name, X, y in clf_ladder():
        acc = clf_accuracy(logistic_baseline, X, y)
        print(f"  {name:36s} X={X.shape} k={len(set(y.tolist()))} logreg_acc={acc:.3f}")
    print("clf_digits_ladder:")
    for name, X, y in clf_digits_ladder():
        acc = clf_accuracy(logistic_baseline, X, y)
        print(f"  {name:36s} X={X.shape} k={len(set(y.tolist()))} logreg_acc={acc:.3f}")
    print("reg_ladder:")
    for name, X, y in reg_ladder():
        rmse = reg_rmse(linear_baseline, X, y)
        print(f"  {name:36s} X={X.shape} linreg_rmse={rmse:.3f}")
    print("budget_ladder:")
    for name, X, y, mask in budget_ladder():
        clf = LogisticRegression(max_iter=2000)
        clf.fit(StandardScaler().fit_transform(X[mask]), y[mask])
        acc = clf.score(StandardScaler().fit_transform(X), y)
        print(f"  {name:36s} labeled={int(mask.sum()):4d} acc={acc:.3f}")
    print("dataquality_ladder:")
    for name, X, y in dataquality_ladder():
        acc = clf_accuracy(logistic_baseline, X, y)
        print(f"  {name:36s} X={X.shape} pos_frac={y.mean():.2f} acc={acc:.3f}")
    print("cluster_ladder:")
    from sklearn.cluster import KMeans
    from sklearn.metrics import adjusted_rand_score
    for name, X, y, k in cluster_ladder():
        labels = KMeans(n_clusters=k, n_init=10, random_state=0).fit_predict(X)
        print(f"  {name:36s} X={X.shape} k={k} ARI={adjusted_rand_score(y, labels):.3f}")
    print("dimred_ladder:")
    from sklearn.decomposition import PCA
    for name, X, y in dimred_ladder():
        ev = PCA(n_components=2).fit(X).explained_variance_ratio_.sum()
        print(f"  {name:36s} X={X.shape} PCA-2D explained_var={ev:.3f}")
