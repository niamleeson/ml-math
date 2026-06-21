# fe-image-features.py
# LESSON: Hand-crafted image features from gradients (HOG — Histogram of Oriented
# Gradients) vs RAW PIXELS.
#
# PROBLEM we reproduce: a classifier on RAW PIXEL intensities is BRITTLE to small
# spatial SHIFTS. A pixel value means "how bright is location (r, c)". If you slide
# the whole digit over by 1-2 pixels, every pixel value lands in a different column,
# so the feature vector changes a lot even though it is the SAME digit. We train on
# the original load_digits images, then test on SHIFTED copies -> raw-pixel accuracy
# DROPS a lot.
# FIX: describe each image by a gradient-ORIENTATION histogram (a simple HOG). We do
# NOT store brightness per location; we store "how much edge energy points in each
# DIRECTION", pooled over a few cells. Edge directions barely change when you nudge
# the image, so the SAME classifier holds up much better on the shifted test set.
#
# Runs top-to-bottom in Colab. Packages: numpy, matplotlib, scikit-learn only
# (we hand-roll HOG in numpy — no skimage).

import numpy as np
import matplotlib.pyplot as plt
from sklearn.datasets import load_digits
from sklearn.linear_model import LogisticRegression
from sklearn.model_selection import train_test_split
from sklearn.metrics import accuracy_score

# ---------------------------------------------------------------------------
# STEP 1: Load REAL data — sklearn's bundled handwritten digits (8x8 grayscale).
# Each image is an 8x8 array of pixel intensities (0..16). No download needed.
# ---------------------------------------------------------------------------
digits = load_digits()
images = digits.images                       # shape (1797, 8, 8)
y = digits.target                            # the digit 0..9 for each image
X_pixels = images.reshape(len(images), -1)   # flatten to 64 raw-pixel features

# Fixed split so the numbers reproduce.
idx = np.arange(len(images))
idx_tr, idx_te = train_test_split(idx, test_size=0.3, random_state=0, stratify=y)


def shift_image(img, dr, dc):
    """Slide an 8x8 image by (dr, dc) pixels using np.roll (wrap-around)."""
    return np.roll(np.roll(img, dr, axis=0), dc, axis=1)


def hog_features(img, n_bins=9):
    """Simple HOG in pure numpy.

    1. np.gradient -> how brightness changes down (gy) and across (gx).
    2. magnitude  = sqrt(gx^2 + gy^2)  -> how strong the edge is at each pixel.
    3. orientation = arctan2(gy, gx)   -> which DIRECTION the edge points.
    4. Split the 8x8 image into 2x2 = 4 cells. In each cell, build a histogram
       over orientation, where each pixel votes with its magnitude (strong edges
       count more). Concatenate the 4 cell histograms -> the feature vector.
    """
    gy, gx = np.gradient(img.astype(float))          # vertical & horizontal change
    mag = np.sqrt(gx ** 2 + gy ** 2)                 # edge strength per pixel
    ang = np.arctan2(gy, gx)                         # edge direction, in [-pi, pi]
    ang = (ang + np.pi) % np.pi                      # fold to [0, pi): edges are undirected
    feats = []
    half = img.shape[0] // 2                         # 8 -> cells of size 4x4
    bin_edges = np.linspace(0, np.pi, n_bins + 1)
    for r0 in (0, half):                             # loop over the 2x2 grid of cells
        for c0 in (0, half):
            cell_ang = ang[r0:r0 + half, c0:c0 + half].ravel()
            cell_mag = mag[r0:r0 + half, c0:c0 + half].ravel()
            # magnitude-weighted histogram of orientations in this cell
            hist, _ = np.histogram(cell_ang, bins=bin_edges, weights=cell_mag)
            feats.append(hist)
    h = np.concatenate(feats)
    return h / (np.linalg.norm(h) + 1e-6)            # normalize -> contrast-robust


# ---------------------------------------------------------------------------
# STEP 2: Visualize the PURE (raw) data — one digit image, plus the HOG view of it.
# ---------------------------------------------------------------------------
sample = images[idx_te[0]]
gy, gx = np.gradient(sample.astype(float))
sample_ang = (np.arctan2(gy, gx) + np.pi) % np.pi
sample_mag = np.sqrt(gx ** 2 + gy ** 2)

fig, ax = plt.subplots(1, 2, figsize=(12, 4))
ax[0].imshow(sample, cmap="gray_r")
ax[0].set_title(f"STEP 2: raw digit image (label={y[idx_te[0]]})")
ax[0].set_xlabel("column (pixel position)"); ax[0].set_ylabel("row")
# gradient-orientation histogram of the WHOLE image (magnitude-weighted)
whole_hist, edges = np.histogram(sample_ang.ravel(), bins=np.linspace(0, np.pi, 10),
                                 weights=sample_mag.ravel())
centers = (edges[:-1] + edges[1:]) / 2
ax[1].bar(centers, whole_hist, width=(np.pi / 9) * 0.9, color="steelblue")
ax[1].set_title("STEP 4 preview: gradient-orientation histogram (HOG)")
ax[1].set_xlabel("edge direction (radians, 0..pi)"); ax[1].set_ylabel("magnitude-weighted votes")
plt.tight_layout(); plt.show()

# ---------------------------------------------------------------------------
# STEP 3: Reproduce the PROBLEM — train on ORIGINAL pixels, test on SHIFTED pixels.
# We shift each test image by (1, 1) pixels. Raw-pixel features change a lot.
# ---------------------------------------------------------------------------
shifted_images = np.array([shift_image(im, 1, 1) for im in images])
X_pixels_shift = shifted_images.reshape(len(images), -1)

pix_clf = LogisticRegression(max_iter=5000)
pix_clf.fit(X_pixels[idx_tr], y[idx_tr])                 # train on clean pixels
pix_acc_clean = accuracy_score(y[idx_te], pix_clf.predict(X_pixels[idx_te]))
pix_acc_shift = accuracy_score(y[idx_te], pix_clf.predict(X_pixels_shift[idx_te]))

# ---------------------------------------------------------------------------
# STEP 4: Apply the FIX — turn every image into HOG features, then visualize.
# (The per-image HOG bar chart above already showed what one looks like.)
# ---------------------------------------------------------------------------
X_hog = np.array([hog_features(im) for im in images])
X_hog_shift = np.array([hog_features(im) for im in shifted_images])

# ---------------------------------------------------------------------------
# STEP 5: Show the FIX — the SAME classifier on HOG features, tested on SHIFTED data.
# ---------------------------------------------------------------------------
hog_clf = LogisticRegression(max_iter=5000)
hog_clf.fit(X_hog[idx_tr], y[idx_tr])                    # train on clean HOG
hog_acc_clean = accuracy_score(y[idx_te], hog_clf.predict(X_hog[idx_te]))
hog_acc_shift = accuracy_score(y[idx_te], hog_clf.predict(X_hog_shift[idx_te]))

# Bar chart: accuracy on SHIFTED test data, raw pixels vs HOG.
fig2, ax2 = plt.subplots(figsize=(6, 4))
ax2.bar(["raw pixels", "HOG features"], [pix_acc_shift, hog_acc_shift],
        color=["indianred", "seagreen"])
ax2.set_title("STEP 5: accuracy on SHIFTED test images")
ax2.set_ylabel("accuracy"); ax2.set_ylim(0, 1.05)
for i, v in enumerate([pix_acc_shift, hog_acc_shift]):
    ax2.text(i, v + 0.02, f"{v:.3f}", ha="center")
plt.tight_layout(); plt.show()

print(f"raw pixels:   clean test acc = {pix_acc_clean:.3f}   shifted test acc = {pix_acc_shift:.3f}")
print(f"HOG features: clean test acc = {hog_acc_clean:.3f}   shifted test acc = {hog_acc_shift:.3f}")
print(f"PROBLEM (raw): {pix_acc_shift:.3f}   →   FIX (engineered): {hog_acc_shift:.3f}")
