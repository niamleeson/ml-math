# Lesson: tf-idf — down-weight common words, up-weight rare distinctive ones.
# tf-idf is a COLUMN SCALING of bag-of-words: each word's count column is multiplied by
# idf = log( (#docs) / (#docs containing the word) ) (+1 smoothing). A word in EVERY doc
# gets the smallest idf (here 1.0, its floor) so it barely counts; a word in just 1-2 docs
# gets a big idf (here ~2.0) so it counts a lot.
#
# PROBLEM (raw bag-of-words counts): a filler word like "the" appears MANY times in EVERY
# document. Cosine similarity adds up products of word counts, so those big shared "the"
# counts DOMINATE. Two docs look "most similar" mostly because they both repeat "the" a lot.
# So nearest-neighbor search returns the WRONG, off-topic document: the query (a VOLCANO
# news item) is matched to a filler-heavy OFFICE memo instead of the real volcano doc.
# FIX: TfidfVectorizer. "the" (in every doc) gets its floor weight, so it stops driving
# similarity; the rare distinctive shared words ("volcano", "lava", "crater", "eruption")
# now dominate, and nearest-neighbor returns the CORRECT topical volcano match.

import numpy as np
import matplotlib.pyplot as plt
from sklearn.feature_extraction.text import CountVectorizer, TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity

# ---- STEP 1: Load real data (a small REAL inline corpus) ---------------------
# 7 short English docs. Doc 0 is the QUERY: a volcano news item, padded (as real prose is)
# with lots of "the ... and ...". Doc 1 is its TRUE topical twin (also a volcano item: it
# shares the rare words volcano/lava/ash/crater/eruption, but uses little filler). Docs 2-6
# are OFF-TOPIC memos (office, finance, sports, cars, pets), each padded with the SAME heavy
# "the"/"and" filler as the query. Deterministic: a fixed inline corpus, no randomness.
docs = [
    "the lava and the ash and the crater and the smoke and the volcano and the eruption today",  # 0 QUERY: volcano
    "volcano lava ash crater eruption and the smoke",                                             # 1 TRUE match: volcano twin
    "the memo and the report and the budget and the meeting and the office and the plan today",   # 2 office (filler-heavy)
    "the bank and the loan and the rate and the cash and the market and the stock today",         # 3 finance
    "the team and the game and the score and the player and the goal and the coach today",        # 4 sports
    "the car and the road and the wheel and the engine and the speed and the brake today",        # 5 cars
    "the dog and the park and the walk and the leash and the treat and the owner today",          # 6 pets
]
labels = ["0 QUERY (volcano)", "1 volcano", "2 office", "3 finance", "4 sports", "5 cars", "6 pets"]
short = [l.split()[0] + " " + l.split()[1].strip("()") for l in labels]  # e.g. "0 QUERY"

# ---- STEP 2: Visualize the PURE (raw) data ----------------------------------
# Build the raw bag-of-words count matrix and look at a COMMON word ("the") vs a RARE
# distinctive word ("volcano") in every doc. "the" appears 6x in nearly every doc and
# towers over everything; "volcano" is a tiny spike present in only docs 0 and 1.
count_vec = CountVectorizer()
X_counts = count_vec.fit_transform(docs)
vocab = count_vec.vocabulary_
the_counts = X_counts[:, vocab["the"]].toarray().ravel()
volcano_counts = X_counts[:, vocab["volcano"]].toarray().ravel()

fig, ax = plt.subplots(1, 3, figsize=(16, 4.5))
xpos = np.arange(len(docs))
ax[0].bar(xpos - 0.2, the_counts, width=0.4, color="#7f8c8d", label="'the' (common)")
ax[0].bar(xpos + 0.2, volcano_counts, width=0.4, color="#c0392b", label="'volcano' (rare)")
ax[0].set_title("STEP 2: raw counts per doc\n'the' DROWNS OUT 'volcano'")
ax[0].set_xticks(xpos); ax[0].set_xticklabels(short, rotation=30, ha="right")
ax[0].set_xlabel("document"); ax[0].set_ylabel("word count"); ax[0].legend()

# ---- STEP 3: Reproduce the PROBLEM on the raw counts -------------------------
# Cosine similarity of the QUERY (doc 0) against every other doc, using RAW counts.
# Every filler-heavy memo shares the query's big "the" mass, so an OFF-TOPIC memo looks
# most similar and the real volcano twin (doc 1, low on filler) ranks LAST. WRONG.
raw_sims = cosine_similarity(X_counts[0], X_counts).ravel()
raw_order = np.argsort(-raw_sims)
raw_nn = raw_order[raw_order != 0][0]  # nearest doc that is not the query itself
print("STEP 3 PROBLEM - nearest-neighbor by RAW-count cosine similarity:")
for j in raw_order:
    tag = "  <-- QUERY" if j == 0 else ("  <-- picked (WRONG)" if j == raw_nn else "")
    print(f"   sim={raw_sims[j]:.3f}  doc {labels[j]}{tag}")
print(f"   raw picks doc {raw_nn} ({labels[raw_nn]}) - off-topic filler, NOT the volcano twin (doc 1).\n")

# ---- STEP 4: Apply tf-idf, then visualize the engineered data ---------------
# tf-idf re-scales each word column by idf. Compare the WEIGHT a common vs rare word carries.
tfidf_vec = TfidfVectorizer()
X_tfidf = tfidf_vec.fit_transform(docs)
idf = tfidf_vec.idf_
tvocab = tfidf_vec.vocabulary_
idf_the, idf_volcano = idf[tvocab["the"]], idf[tvocab["volcano"]]

# Bar: a common word's vs a rare word's "weight" under raw counts vs tf-idf.
# "Raw weight" = how much that word can contribute (its max count in any doc); under raw
# counts "the" carries a huge weight. Under tf-idf, "the" drops to its idf floor while
# "volcano" gets boosted by its high idf.
raw_w_the, raw_w_volcano = the_counts.max(), volcano_counts.max()
ax[1].bar([0, 1], [raw_w_the, raw_w_volcano], width=0.4, color="#7f8c8d", label="raw counts")
ax[1].bar([0.4, 1.4], [idf_the, idf_volcano], width=0.4, color="#27ae60", label="tf-idf (idf)")
ax[1].set_xticks([0.2, 1.2]); ax[1].set_xticklabels(["'the'\n(common)", "'volcano'\n(rare)"])
ax[1].set_title("STEP 4: word weight, raw vs tf-idf\n'the' falls to its floor; 'volcano' boosted")
ax[1].set_ylabel("weight"); ax[1].legend()
print(f"STEP 4 - idf('the')={idf_the:.2f} (its floor; appears in every doc)   "
      f"idf('volcano')={idf_volcano:.2f} (high; appears in only 2 docs)")

# ---- STEP 5: Show the FIX ---------------------------------------------------
# Same cosine similarity, same query, now on tf-idf vectors. The shared "the" mass no
# longer dominates, so the rare topical words decide it: the true volcano twin (doc 1)
# is correctly picked as nearest neighbor.
eng_sims = cosine_similarity(X_tfidf[0], X_tfidf).ravel()
eng_order = np.argsort(-eng_sims)
eng_nn = eng_order[eng_order != 0][0]
print("\nSTEP 5 FIX - nearest-neighbor by tf-idf cosine similarity:")
for j in eng_order:
    tag = "  <-- QUERY" if j == 0 else ("  <-- picked (CORRECT)" if j == eng_nn else "")
    print(f"   sim={eng_sims[j]:.3f}  doc {labels[j]}{tag}")

# Plot: similarity to the query, raw vs tf-idf, side by side per non-query doc.
others = [j for j in range(len(docs)) if j != 0]
ax[2].bar(np.array(others) - 0.2, raw_sims[others], width=0.4, color="#7f8c8d", label="raw counts")
ax[2].bar(np.array(others) + 0.2, eng_sims[others], width=0.4, color="#27ae60", label="tf-idf")
ax[2].set_title(f"STEP 5: cosine sim to QUERY (doc 0)\nraw picks {raw_nn}, tf-idf picks {eng_nn} (volcano)")
ax[2].set_xticks(others); ax[2].set_xticklabels([short[j] for j in others], rotation=30, ha="right")
ax[2].set_xlabel("document"); ax[2].set_ylabel("cosine similarity to query"); ax[2].legend()
plt.tight_layout(); plt.show()

print(f"\nPROBLEM (raw): nearest = doc {raw_nn} ({labels[raw_nn]})   ->   "
      f"FIX (tf-idf): nearest = doc {eng_nn} ({labels[eng_nn]})")
