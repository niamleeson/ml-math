# Lesson: Bag-of-n-grams — count word PAIRS (bigrams), not just single words.
# Bag-of-words (unigrams) throws away word ORDER: it only counts how many times
# each word appears. So "good" and "not good" look almost the SAME to the model —
# both contain the word "good". A sentiment classifier then MISHANDLES NEGATION:
# it learns "good -> positive" and gets fooled by "not good".
# FIX: ngram_range=(1, 2) also counts adjacent word PAIRS like "not good" and
# "not bad". Now "not good" has its OWN feature, distinct from "good", so the
# SAME classifier can learn that "not good" is negative. Order is partly recovered.

import numpy as np
import matplotlib.pyplot as plt
from sklearn.feature_extraction.text import CountVectorizer
from sklearn.linear_model import LogisticRegression
from sklearn.metrics.pairwise import cosine_similarity

# ---- STEP 1: Load real data --------------------------------------------------
# A small REAL inline sentiment corpus (no downloads). Every example hinges on
# negation: the SAME adjective flips meaning when "not" is in front of it.
# label 1 = positive, 0 = negative.
# The corpus teaches BOTH that "good"/"bad" carry sentiment AND that "not good"/
# "not bad" flip it. The unigram model can only see the first lesson (it has no
# "not good" feature); the bigram model can see both. Held-out test = unseen
# SENTENCES that contain these negation phrases, so neither model memorized them.
train_texts = [
    # plain positives (label 1)
    "good", "this is good", "good film", "really good", "so good",
    # plain negatives (label 0)
    "bad", "this is bad", "bad film", "really bad", "so bad",
    # "not good" -> negative (label 0)
    "not good", "it was not good", "not good at all", "the acting is not good",
    # "not bad" -> positive (label 1)
    "not bad", "it was not bad", "not bad at all", "the acting is not bad",
]
train_labels = np.array(
    [1] * 5 +    # good ...
    [0] * 5 +    # bad ...
    [0] * 4 +    # not good ...
    [1] * 4      # not bad ...
)

# Held-out NEGATION sentences the model never saw verbatim. The UNIGRAM model
# only has "not"/"good"/"bad" columns, so it leans on "good"->positive and gets
# fooled; the BIGRAM model has a "not good"/"not bad" column and gets it right.
test_texts = [
    "the movie was not good",      # neg
    "honestly not good",            # neg
    "a not good experience",        # neg
    "the movie was not bad",        # pos
    "honestly not bad",             # pos
    "a not bad experience",         # pos
]
test_labels = np.array([0, 0, 0, 1, 1, 1])  # not good = neg, not bad = pos

# ---- STEP 2: Visualize the PURE (raw) representation -------------------------
# Vectorize with UNIGRAMS only (plain bag-of-words). Show the raw vectors for
# "good" vs "not good": they share the "good" column and differ only by "not".
uni_vec = CountVectorizer(ngram_range=(1, 1))
uni_vec.fit(train_texts + test_texts)
v_good_u = uni_vec.transform(["good"]).toarray()[0]
v_notgood_u = uni_vec.transform(["not good"]).toarray()[0]

fig, ax = plt.subplots(1, 2, figsize=(13, 4))
words = uni_vec.get_feature_names_out()
keep = np.where((v_good_u + v_notgood_u) > 0)[0]  # only columns either phrase uses
x = np.arange(len(keep))
ax[0].bar(x - 0.2, v_good_u[keep], 0.4, label='"good"', color="#27ae60")
ax[0].bar(x + 0.2, v_notgood_u[keep], 0.4, label='"not good"', color="#c0392b")
ax[0].set_xticks(x); ax[0].set_xticklabels(words[keep], rotation=0)
ax[0].set_ylabel("count")
ax[0].set_title("STEP 2: UNIGRAM bag-of-words\n'good' vs 'not good' — only differ by one 'not' column")
ax[0].legend()

# ---- STEP 3: Reproduce the PROBLEM on the raw (unigram) features -------------
# How similar do "good" and "not good" look to the model? Cosine similarity of
# their unigram vectors is HIGH (they share "good"), so they're easy to confuse.
cos_uni = cosine_similarity(v_good_u.reshape(1, -1), v_notgood_u.reshape(1, -1))[0, 0]
print(f'STEP 3  UNIGRAM cosine("good", "not good") = {cos_uni:.3f}  (high -> looks similar)')

# Train the SAME classifier on unigram features, score held-out negation examples.
X_train_u = uni_vec.transform(train_texts)
clf_u = LogisticRegression(max_iter=1000, random_state=0).fit(X_train_u, train_labels)
uni_acc = clf_u.score(uni_vec.transform(test_texts), test_labels)
print(f"STEP 3 PROBLEM  unigram bag-of-words, held-out negation accuracy = {uni_acc:.3f}")

# ---- STEP 4: Apply the technique (bigrams), visualize the engineered data ----
# ngram_range=(1, 2): keep unigrams AND adjacent pairs. Now "not good" gets its
# own column, so "good" and "not good" no longer share their non-zero features.
bi_vec = CountVectorizer(ngram_range=(1, 2))
bi_vec.fit(train_texts + test_texts)
v_good_b = bi_vec.transform(["good"]).toarray()[0]
v_notgood_b = bi_vec.transform(["not good"]).toarray()[0]

feats = bi_vec.get_feature_names_out()
keep_b = np.where((v_good_b + v_notgood_b) > 0)[0]
xb = np.arange(len(keep_b))
ax[1].bar(xb - 0.2, v_good_b[keep_b], 0.4, label='"good"', color="#27ae60")
ax[1].bar(xb + 0.2, v_notgood_b[keep_b], 0.4, label='"not good"', color="#c0392b")
ax[1].set_xticks(xb); ax[1].set_xticklabels(feats[keep_b], rotation=20, ha="right")
ax[1].set_ylabel("count")
cos_bi = cosine_similarity(v_good_b.reshape(1, -1), v_notgood_b.reshape(1, -1))[0, 0]
ax[1].set_title(f"STEP 4: with BIGRAMS (1,2)\n'not good' is its own feature — cosine drops to {cos_bi:.2f}")
ax[1].legend()
plt.tight_layout(); plt.show()

print(f'STEP 4  BIGRAM  cosine("good", "not good") = {cos_bi:.3f}  (lower -> now distinct)')

# ---- STEP 5: Show the FIX ----------------------------------------------------
# SAME LogisticRegression, now on (1,2)-gram features. It can finally tell that
# "not good" is negative, so held-out negation accuracy jumps.
X_train_b = bi_vec.transform(train_texts)
clf_b = LogisticRegression(max_iter=1000, random_state=0).fit(X_train_b, train_labels)
bi_acc = clf_b.score(bi_vec.transform(test_texts), test_labels)
print(f"STEP 5 FIX      bag-of-bigrams, held-out negation accuracy = {bi_acc:.3f}")

print(f"PROBLEM (unigram): {uni_acc:.3f}   ->   FIX (bigram): {bi_acc:.3f}")
