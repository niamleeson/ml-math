# Lesson: Bag-of-words — turn raw text into a numeric word-count vector.
# A machine-learning model does math on NUMBERS. It cannot do math on a Python
# string like "great movie". So if you hand a classifier a list of raw text
# strings, fitting it FAILS — there is nothing to add or multiply.
# FIX: bag-of-words. Build a vocabulary of every word in the corpus, then turn
# each sentence into a vector of counts: how many times each vocab word appears.
# Now every sentence is a row of numbers, and the SAME classifier trains fine.

import numpy as np
import matplotlib.pyplot as plt
from sklearn.feature_extraction.text import CountVectorizer
from sklearn.linear_model import LogisticRegression

# ---- STEP 1: Load real data --------------------------------------------------
# A small REAL inline corpus of short movie reviews. No downloads.
# label 1 = positive review, label 0 = negative review. 10 sentences, 2 classes.
texts = [
    "great movie loved it",          # 1
    "what a fantastic film",         # 1
    "loved the acting wonderful",    # 1
    "an amazing and great story",    # 1
    "wonderful film truly amazing",  # 1
    "terrible movie hated it",       # 0
    "what an awful film",            # 0
    "boring and terrible acting",    # 0
    "a dull and awful story",        # 0
    "hated this boring film",        # 0
]
y = np.array([1, 1, 1, 1, 1, 0, 0, 0, 0, 0])

# Hold out 2 brand-new sentences the model never sees during training.
test_texts = ["a great wonderful film", "awful and boring movie"]
test_y = np.array([1, 0])  # positive, negative

# ---- STEP 2: Visualize the PURE (raw) data -----------------------------------
# "Raw data" here is just strings. The only number we can read off raw text is
# its length in characters — which has NOTHING to do with sentiment. Plot it to
# show raw text gives the model no usable signal.
char_len = np.array([len(t) for t in texts])
fig, ax = plt.subplots(1, 2, figsize=(13, 4.5))
colors = ["#27ae60" if lab == 1 else "#c0392b" for lab in y]
ax[0].bar(range(len(texts)), char_len, color=colors)
ax[0].set_title("STEP 2: raw text has no usable numbers\n(bar = #characters; "
                "green=positive, red=negative — length is meaningless)")
ax[0].set_xlabel("review index"); ax[0].set_ylabel("characters in string")

# ---- STEP 3: Reproduce the PROBLEM on the raw data ---------------------------
# Try to fit a classifier directly on the list of raw STRINGS. It cannot turn
# "great movie loved it" into numbers, so this raises an error. We catch it.
print("STEP 3 PROBLEM  feeding raw text strings straight to the model:")
raw_worked = False
try:
    LogisticRegression().fit(texts, y)   # texts is a list of strings, not numbers
    raw_worked = True
    print("  (unexpectedly succeeded)")
except Exception as e:
    print(f"  -> FAILED with {type(e).__name__}: {e}")
    print("  The model needs a numeric matrix; a list of strings is not one.")

# ---- STEP 4: Apply bag-of-words, then visualize the engineered data ----------
# CountVectorizer learns the vocabulary from the training corpus and turns each
# sentence into a row of word counts. Text -> a matrix of numbers.
vec = CountVectorizer()
X_train = vec.fit_transform(texts).toarray()   # shape (n_docs, n_vocab_words)
vocab = vec.get_feature_names_out()
print(f"\nSTEP 4 FIX      bag-of-words made a {X_train.shape[0]} x {X_train.shape[1]} "
      f"document-term matrix (rows=reviews, cols=words). Text is now numbers.")

# Heatmap of the document-term matrix: words on x, reviews on y, color = count.
im = ax[1].imshow(X_train, aspect="auto", cmap="Greens")
ax[1].set_xticks(range(len(vocab))); ax[1].set_xticklabels(vocab, rotation=90, fontsize=8)
ax[1].set_yticks(range(len(texts)))
ax[1].set_yticklabels([f"{i} ({'pos' if y[i] else 'neg'})" for i in range(len(texts))], fontsize=8)
ax[1].set_title("STEP 4: document-term matrix (bag-of-words)\ntext became a grid of word counts")
fig.colorbar(im, ax=ax[1], label="word count")
plt.tight_layout(); plt.show()

# ---- STEP 5: Show the FIX ----------------------------------------------------
# Same classifier, now on the numeric bag-of-words matrix. It trains, and it
# classifies the held-out sentences correctly.
clf = LogisticRegression()
clf.fit(X_train, y)                       # works now: X_train is numbers
X_test = vec.transform(test_texts).toarray()  # reuse the SAME vocabulary
pred = clf.predict(X_test)
acc = (pred == test_y).mean()
for t, p in zip(test_texts, pred):
    print(f"  held-out: {t!r:30s} -> predicted {'positive' if p else 'negative'}")

raw_score = 0.0 if not raw_worked else float("nan")  # raw could not even run
print(f"\nPROBLEM (raw text): cannot fit, accuracy = {raw_score:.3f}   ->   "
      f"FIX (bag-of-words): accuracy = {acc:.3f}")
