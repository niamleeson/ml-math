# Phrase / collocation detection: raw bigram frequency vs PMI
# LESSON: real multi-word phrases ("machine learning", "new york") are found
# by a STATISTICAL score (pointwise mutual information, PMI), not by counting.
# PROBLEM: ranking word pairs by RAW FREQUENCY surfaces filler ("of the",
# "in the") because common words co-occur a lot just by being common.
# FIX: PMI = log( p(a,b) / (p(a) p(b)) ) divides out how common each word is,
# so the true phrase rises to the top.

import numpy as np
from collections import Counter
import matplotlib.pyplot as plt

# ----------------------------------------------------------------------
# 1. LOAD REAL DATA: a small inline corpus (no downloads).
#    The true phrase "machine learning" recurs amid lots of filler words
#    ("the", "of", "in", "a"). "new york" also appears a couple of times.
# ----------------------------------------------------------------------
corpus = """
in the study of the field of the data the machine learning idea is in the air .
in the city of the team in the office in the building works on the data .
of the goal of the work of the day the team in the room reads of the news .
in the spring in the city of new york in the heart of the town it is nice .
of the data of the model of the team of the lab the work is in the report .
in the field of the work in the area of the task the machine learning helps .
of the city of new york of the place of the visit the trip is in the plan .
machine learning is in the news of the day of the year of the era of the world .
""".lower().split()

print(f"corpus length: {len(corpus)} tokens")

# Build unigram and bigram counts with collections.Counter
unigrams = Counter(corpus)
bigrams = Counter(zip(corpus[:-1], corpus[1:]))
N_uni = sum(unigrams.values())
N_bi = sum(bigrams.values())

# ----------------------------------------------------------------------
# 2. VISUALIZE THE PURE (raw) DATA: how often each word occurs.
#    The filler words ("the", "of", "in") dominate the raw word counts —
#    this is exactly why they will also dominate raw bigram counts.
# ----------------------------------------------------------------------
top_words = unigrams.most_common(8)
plt.figure(figsize=(7, 3))
plt.bar([w for w, _ in top_words], [c for _, c in top_words], color="#888")
plt.title("Raw word counts: filler words dominate the corpus")
plt.ylabel("count")
plt.tight_layout()
plt.show()

# ----------------------------------------------------------------------
# 3. REPRODUCE THE PROBLEM on raw data: rank bigrams by RAW FREQUENCY.
#    The top pairs are meaningless common-word pairs, NOT real phrases.
# ----------------------------------------------------------------------
raw_ranking = bigrams.most_common(8)
print("\nTop bigrams by RAW FREQUENCY (the PROBLEM — filler at the top):")
for (a, b), c in raw_ranking:
    print(f"  {a} {b:<10} count={c}")

# ----------------------------------------------------------------------
# 4. APPLY THE TECHNIQUE: score each bigram by PMI.
#    PMI(a,b) = log( p(a,b) / (p(a) * p(b)) )
#      p(a,b) = count(a,b) / (#bigrams)          -> how often they co-occur
#      p(a), p(b) = count / (#unigrams)          -> how common each word is
#    Dividing by p(a)*p(b) cancels out raw commonness, so glue-words score low.
#    Require count >= 2 so we score recurring pairs, not one-off flukes.
# ----------------------------------------------------------------------
pmi_scores = {}
for (a, b), c_ab in bigrams.items():
    if c_ab < 2:
        continue
    p_ab = c_ab / N_bi
    p_a = unigrams[a] / N_uni
    p_b = unigrams[b] / N_uni
    pmi_scores[(a, b)] = np.log(p_ab / (p_a * p_b))

pmi_ranking = sorted(pmi_scores.items(), key=lambda kv: kv[1], reverse=True)[:8]

# Visualize the ENGINEERED scores: PMI per bigram, true phrase on top.
plt.figure(figsize=(7, 3))
labels = [f"{a} {b}" for (a, b), _ in pmi_ranking]
plt.barh(labels[::-1], [s for _, s in pmi_ranking][::-1], color="#2a7")
plt.title("PMI per bigram: real phrases rise to the top")
plt.xlabel("PMI (higher = stronger phrase)")
plt.tight_layout()
plt.show()

print("\nTop bigrams by PMI (the FIX — real phrases at the top):")
for (a, b), s in pmi_ranking:
    print(f"  {a} {b:<10} PMI={s:.3f}")

# ----------------------------------------------------------------------
# 5. SHOW THE FIX side by side: raw-frequency ranking vs PMI ranking.
#    The real phrase "machine learning" tops the PMI list but is buried
#    (or absent) at the top of the raw-frequency list.
# ----------------------------------------------------------------------
fig, ax = plt.subplots(1, 2, figsize=(11, 4))

raw_labels = [f"{a} {b}" for (a, b), _ in raw_ranking]
raw_counts = [c for _, c in raw_ranking]
ax[0].barh(raw_labels[::-1], raw_counts[::-1], color="#888")
ax[0].set_title("PROBLEM: top bigrams by RAW FREQUENCY\n(filler wins)")
ax[0].set_xlabel("count")

pmi_labels = [f"{a} {b}" for (a, b), _ in pmi_ranking]
pmi_vals = [s for _, s in pmi_ranking]
colors = ["#2a7" if lab in ("machine learning", "new york") else "#888"
          for lab in pmi_labels]
ax[1].barh(pmi_labels[::-1], pmi_vals[::-1], color=colors[::-1])
ax[1].set_title("FIX: top bigrams by PMI\n(real phrases win)")
ax[1].set_xlabel("PMI")

plt.tight_layout()
plt.show()

# ----------------------------------------------------------------------
# One-line before/after summary: where does "machine learning" rank?
# ----------------------------------------------------------------------
raw_order = [f"{a} {b}" for (a, b), _ in bigrams.most_common()]
pmi_order = [f"{a} {b}" for (a, b), _ in
             sorted(pmi_scores.items(), key=lambda kv: kv[1], reverse=True)]
raw_rank = raw_order.index("machine learning") + 1
pmi_rank = pmi_order.index("machine learning") + 1
print(f"\n'machine learning' rank  PROBLEM (raw freq): #{raw_rank}"
      f"   →   FIX (PMI): #{pmi_rank}")
