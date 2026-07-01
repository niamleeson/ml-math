"""
F6 (Vision) shared dataset ladder — D1..D5 of rising complexity, CPU-only and run-all-safe.

This is the canonical ladder inlined into the classification-style Part-7 notebooks. Every
rung returns (X, y) with X shape (n, 8, 8) float in [0, 1] and integer labels y, so one
featurizer + classifier can run unchanged across all five rungs (the "watch it scale" story).

D4/D5 load real MNIST / CIFAR-10 via torchvision when the download is available (as in Colab);
offline they fall back to a harder synthetic set so run-all never fails. Code is written one
statement per line for readability.
"""

import numpy as np
from sklearn.datasets import load_digits
from sklearn.linear_model import LogisticRegression
from sklearn.model_selection import train_test_split


def _resize_to_8x8(img):
    """Nearest-neighbour resize of a 2-D array to 8x8 (no SciPy dependency)."""
    h, w = img.shape
    rows = (np.linspace(0, h - 1, 8)).round().astype(int)
    cols = (np.linspace(0, w - 1, 8)).round().astype(int)
    return img[np.ix_(rows, cols)]


def _normalize(x):
    """Scale an array into [0, 1]; a flat array becomes all zeros."""
    x = x.astype(float)
    lo = x.min()
    hi = x.max()
    if hi - lo < 1e-12:
        return np.zeros_like(x)
    return (x - lo) / (hi - lo)


def d1_hand_patches():
    """D1 — hand-built 4x4 patches, 2 classes: a vertical line (col 1) vs a horizontal line (row 1).

    Fixed positions with light jitter, so the two classes are cleanly separable and the
    mechanism is fully visible — the easy first rung.
    """
    rng = np.random.default_rng(0)
    images = []
    labels = []
    for _ in range(24):
        patch = rng.uniform(0.0, 0.15, size=(4, 4))
        patch[:, 1] = rng.uniform(0.85, 1.0)
        images.append(_resize_to_8x8(patch))
        labels.append(0)
    for _ in range(24):
        patch = rng.uniform(0.0, 0.15, size=(4, 4))
        patch[1, :] = rng.uniform(0.85, 1.0)
        images.append(_resize_to_8x8(patch))
        labels.append(1)
    return np.array(images), np.array(labels)


def d2_synthetic_shapes():
    """D2 — clean synthetic shapes on an 8x8 grid, 2 classes (square vs disc)."""
    rng = np.random.default_rng(1)
    yy, xx = np.mgrid[0:8, 0:8]
    images = []
    labels = []
    for _ in range(80):
        img = rng.uniform(0.0, 0.1, size=(8, 8))
        img[2:6, 2:6] = 0.9
        images.append(img)
        labels.append(0)
    for _ in range(80):
        img = rng.uniform(0.0, 0.1, size=(8, 8))
        disc = (xx - 3.5) ** 2 + (yy - 3.5) ** 2 <= 4.0
        img[disc] = 0.9
        images.append(img)
        labels.append(1)
    return np.array(images), np.array(labels)


def d3_sklearn_digits():
    """D3 — real sklearn digits (native 8x8), 4 classes for a fast, honest multi-class rung."""
    digits = load_digits()
    keep = np.isin(digits.target, [0, 1, 2, 3])
    X = digits.images[keep]
    y = digits.target[keep]
    X = np.array([_normalize(img) for img in X])
    return X, y


def _synthetic_textured(n_per_class, n_classes, noise, seed):
    """A harder synthetic fallback: textured class prototypes at 8x8 with noise."""
    rng = np.random.default_rng(seed)
    protos = [rng.uniform(0.0, 1.0, size=(8, 8)) for _ in range(n_classes)]
    images = []
    labels = []
    for cls in range(n_classes):
        for _ in range(n_per_class):
            img = protos[cls] + rng.normal(0.0, noise, size=(8, 8))
            images.append(_normalize(img))
            labels.append(cls)
    return np.array(images), np.array(labels)


def _call_with_timeout(fn, seconds):
    """Run fn() but abort with TimeoutError after `seconds` (guards slow/hanging downloads)."""
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


def _load_mnist_gray(classes, n_per_class, seed, shift=False, noise=0.0):
    """Load MNIST via torchvision, grayscale + resize to 8x8, subsample. Raises on failure.

    MNIST is a small (~11 MB) real dataset. CIFAR-10 is deliberately avoided (a 170 MB
    download breaks run-all-safety); the harder D5 rung instead shifts and noises MNIST.
    """
    import torchvision

    ds = torchvision.datasets.MNIST(root="./data", train=True, download=True)
    rng = np.random.default_rng(seed)
    targets = np.array(ds.targets)
    images = []
    labels = []
    for cls in classes:
        idx = np.where(targets == cls)[0][:n_per_class]
        for i in idx:
            arr = np.asarray(ds[int(i)][0], dtype=float)
            small = _resize_to_8x8(arr)
            if shift:
                small = np.roll(small, rng.integers(-1, 2), axis=0)
                small = np.roll(small, rng.integers(-1, 2), axis=1)
            if noise:
                small = small + rng.normal(0.0, noise * 255.0, size=(8, 8))
            images.append(_normalize(small))
            labels.append(cls)
    return np.array(images), np.array(labels)


def d4_mnist_or_fallback():
    """D4 — real MNIST (4 clean classes) when downloadable; else a harder synthetic set."""
    try:
        X, y = _call_with_timeout(lambda: _load_mnist_gray([0, 1, 2, 3], 60, seed=4), 30)
        return (X, y), "MNIST (real)"
    except Exception:
        return _synthetic_textured(60, 4, noise=0.35, seed=4), "synthetic (offline fallback)"


def d5_mnist_hard_or_fallback():
    """D5 — real MNIST, more classes with shift + noise (distribution shift); else hardest synthetic."""
    try:
        X, y = _call_with_timeout(lambda: _load_mnist_gray([0, 1, 2, 3, 4, 5], 60, seed=5, shift=True, noise=0.12), 30)
        return (X, y), "MNIST shifted+noisy (real, harder)"
    except Exception:
        return _synthetic_textured(60, 6, noise=0.6, seed=5), "synthetic (offline fallback)"


def load_ladder():
    """Return the five rungs as a list of (name, X, y). D4/D5 note whether real data loaded."""
    rungs = []
    rungs.append(("D1 hand patches", *d1_hand_patches()))
    rungs.append(("D2 synthetic shapes", *d2_synthetic_shapes()))
    rungs.append(("D3 sklearn digits", *d3_sklearn_digits()))
    (x4, y4), tag4 = d4_mnist_or_fallback()
    rungs.append((f"D4 {tag4}", x4, y4))
    (x5, y5), tag5 = d5_mnist_hard_or_fallback()
    rungs.append((f"D5 {tag5}", x5, y5))
    return rungs


def accuracy_with(featurize, X, y):
    """Map each image through featurize, train logistic regression, return held-out accuracy."""
    feats = np.array([featurize(img) for img in X])
    x_tr, x_te, y_tr, y_te = train_test_split(feats, y, test_size=0.4, random_state=0, stratify=y)
    clf = LogisticRegression(max_iter=2000)
    clf.fit(x_tr, y_tr)
    return clf.score(x_te, y_te)


if __name__ == "__main__":
    for name, X, y in load_ladder():
        print(f"{name:38s} X={X.shape} classes={sorted(set(y.tolist()))} acc(flatten)={accuracy_with(lambda im: im.ravel(), X, y):.3f}")
