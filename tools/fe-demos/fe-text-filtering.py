# Lesson: Text filtering — shrink + clean a bag-of-words vocabulary.
# A plain bag-of-words counts EVERY word. Two kinds of words just add junk:
#   1. STOPWORDS  — "the", "a", "is", "and" — appear everywhere, in BOTH
#      classes, so they carry no signal. They sit at the TOP of the counts.
#   2. RARE one-off tokens — a word that shows up in only ONE document
#      (a typo, a name) — can't generalize and just bloats the vocabulary.
# FIX: drop English stopwords (stop_words='english') and drop words that appear
# in fewer than 2 documents (min_df=2). The vocabulary gets much SMALLER, the
# top features become real CONTENT words, and the SAME classifier matches or
# beats the unfiltered one with far fewer features.

import numpy as np
import matplotlib.pyplot as plt
from sklearn.feature_extraction.text import CountVectorizer
from sklearn.linear_model import LogisticRegression

# ---- STEP 1: Load real data --------------------------------------------------
# A small REAL inline corpus of short product reviews. No downloads.
# label 1 = positive, label 0 = negative. Note every sentence is padded with
# ordinary English stopwords (the, a, is, and, this, ...) exactly like real text,
# and a few one-off rare words (gizmo, thingy, acme, brandx) appear just once.
texts = [
    "the product is great and i really love it",        # 1
    "a wonderful gadget the build is excellent",        # 1
    "this is a fantastic and reliable device gizmo",    # 1
    "i love the design it is great and sturdy",         # 1
    "the gadget is wonderful and works perfectly acme", # 1
    "an excellent reliable product i really love this",  # 1
    "the product is terrible and i really hate it",     # 0
    "a horrible gadget the build is awful thingy",      # 0
    "this is a broken and unreliable device",           # 0
    "i hate the design it is terrible and flimsy",      # 0
    "the gadget is horrible and breaks constantly",     # 0
    "an awful unreliable product i really hate brandx", # 0
]
y = np.array([1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0])

# Hold out 4 brand-new sentences the model never sees during training.
test_texts = [
    "the product is great and reliable",   # 1
    "a wonderful excellent gadget",        # 1
    "this gadget is terrible and awful",   # 0
    "the design is horrible and broken",   # 0
]
test_y = np.array([1, 1, 0, 0])


def top_tokens(matrix, vocab, k=10):
    """Return the k most frequent (token, total_count) pairs, biggest first."""
    totals = matrix.sum(axis=0)
    order = np.argsort(totals)[::-1][:k]
    return [vocab[i] for i in order], [int(totals[i]) for i in order]


# ---- STEP 2 + 3: RAW (unfiltered) bag-of-words -> reproduce the PROBLEM -------
# Plain CountVectorizer: keep every word, including stopwords and one-off tokens.
raw_vec = CountVectorizer()
Xr = raw_vec.fit_transform(texts).toarray()
raw_vocab = raw_vec.get_feature_names_out()
raw_words, raw_counts = top_tokens(Xr, raw_vocab)
print("STEP 3 PROBLEM  raw (unfiltered) bag-of-words")
print(f"  vocabulary size = {len(raw_vocab)} words")
print(f"  top tokens (mostly meaningless stopwords): {list(zip(raw_words, raw_counts))}")

clf = LogisticRegression(max_iter=1000, random_state=0)
clf.fit(Xr, y)
raw_acc = (clf.predict(raw_vec.transform(test_texts).toarray()) == test_y).mean()
print(f"  held-out accuracy = {raw_acc:.3f} (using all {len(raw_vocab)} features)")

# ---- STEP 4: Apply the FILTER, then look at the engineered vocabulary ---------
# stop_words='english' uses scikit-learn's BUILT-IN english stopword list (no
# nltk). min_df=2 drops any word seen in fewer than 2 documents (kills one-offs).
filt_vec = CountVectorizer(stop_words="english", min_df=2)
Xf = filt_vec.fit_transform(texts).toarray()
filt_vocab = filt_vec.get_feature_names_out()
filt_words, filt_counts = top_tokens(Xf, filt_vocab)
print("\nSTEP 4 FIX      filtered bag-of-words (stop_words='english', min_df=2)")
print(f"  vocabulary size = {len(filt_vocab)} words")
print(f"  top tokens (now real content words): {list(zip(filt_words, filt_counts))}")

# ---- STEP 5: Show the FIX — SAME classifier on the smaller feature set --------
clf2 = LogisticRegression(max_iter=1000, random_state=0)
clf2.fit(Xf, y)
filt_acc = (clf2.predict(filt_vec.transform(test_texts).toarray()) == test_y).mean()
print(f"  held-out accuracy = {filt_acc:.3f} (using only {len(filt_vocab)} features)")

# ---- PLOTS -------------------------------------------------------------------
fig, ax = plt.subplots(1, 3, figsize=(16, 4.6))

# Top tokens BEFORE filtering: stopwords dominate the top of the bar chart.
ax[0].barh(range(len(raw_words))[::-1], raw_counts, color="#c0392b")
ax[0].set_yticks(range(len(raw_words))[::-1]); ax[0].set_yticklabels(raw_words)
ax[0].set_title("BEFORE: top tokens are stopwords\n(the, a, is, and ... no signal)")
ax[0].set_xlabel("total count in corpus")

# Top tokens AFTER filtering: real content words rise to the top.
ax[1].barh(range(len(filt_words))[::-1], filt_counts, color="#27ae60")
ax[1].set_yticks(range(len(filt_words))[::-1]); ax[1].set_yticklabels(filt_words)
ax[1].set_title("AFTER: top tokens are content words\n(gadget, product, love, hate ...)")
ax[1].set_xlabel("total count in corpus")

# Vocabulary size + accuracy, before vs after, side by side.
x = np.arange(2)
ax[2].bar(x - 0.2, [len(raw_vocab), len(filt_vocab)], width=0.4,
          color="#8e44ad", label="vocab size")
ax2b = ax[2].twinx()
ax2b.bar(x + 0.2, [raw_acc, filt_acc], width=0.4, color="#2980b9", label="accuracy")
ax[2].set_xticks(x); ax[2].set_xticklabels(["BEFORE\n(raw)", "AFTER\n(filtered)"])
ax[2].set_ylabel("vocabulary size (purple)"); ax2b.set_ylabel("accuracy (blue)")
ax2b.set_ylim(0, 1.05)
ax[2].set_title("vocab size shrinks, accuracy holds/improves")
plt.tight_layout(); plt.show()

# ---- One-line summary --------------------------------------------------------
print(f"\nPROBLEM (raw): vocab={len(raw_vocab)}, acc={raw_acc:.3f}   ->   "
      f"FIX (filtered): vocab={len(filt_vocab)}, acc={filt_acc:.3f}")
