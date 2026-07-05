# M11 · Embeddings & representation learning
> **Domain:** Domain 2 · Recommenders, Embeddings & Retrieval · **Maps to:** all · **Skip if you can already…** explain what an embedding space encodes and how you'd evaluate it.

## Overview

Embeddings are dense vectors learned from a task: clicks, co-occurrence, text matching, profile similarity, or labels. They are useful because nearby vectors can be searched, clustered, probed, and fed into downstream models. They are dangerous when we treat the geometry as universal truth. A vector space encodes the evidence and biases of the data and objective that produced it.

For Creator Marketplace AI, an embedding may put a creator, a brand brief, and a search query near each other because their text and past collaborations align. For Search Ads, an embedding may put a query near ads that historically got engagement. In both cases, the first question is not "what does this dimension mean?" but "what training signal made these neighborhoods appear?"

**By the end you can answer:**
- What does embedding geometry — distance, angle, and neighborhood structure — encode?
- Cosine vs dot-product similarity: what changes, and why normalize vectors?
- How are embeddings learned in skip-gram/word2vec, matrix factorization, and encoders?
- What makes a good embedding space, including alignment and uniformity?
- How do you evaluate embeddings with retrieval recall, downstream tasks, and probing?
- ID embeddings vs text embeddings: what do they capture, and when do they fail?

Two sub-lessons:

- **M11.1 What embeddings encode & similarity** — reading neighborhoods without overclaiming.
- **M11.2 Learning & evaluating embeddings** — training signals, alignment, uniformity, and task checks.

---

## M11.1 · What embeddings encode & similarity

**The idea.** An embedding maps an entity to a vector: an ID, a query, a profile, a post, an ad, or a creator brief becomes a point in a learned space. The neighborhood around a point means "items the objective learned to score similarly," not "items that are truly the same." A creator can be near another creator because they share audience, topics, skills, past advertisers, or platform popularity — whichever signals the training data rewarded.

**Everyday analogy.** Think of a map of cities where each dot is placed by travel patterns rather than by latitude and longitude. Cities with similar food, weather, and tourist behavior land near each other; in the embedding, creators, ads, or queries land near each other because the training objective saw similar evidence. A direction on the map can carry meaning too: in word embeddings, the classic "king − man + woman ≈ queen" says the gender direction is learned as a reusable offset. Evaluating the map means checking whether similar creators really land near each other for the product task, not just whether the picture looks neat.

Dense dimensions are latent factors. Some may correlate with human concepts, but they are not guaranteed to be individually interpretable. Interpret the space through scores, neighbors, slices, and downstream behavior.

The two most common scores are dot product and cosine similarity:

$$\text{dot}(q, x) = q^\top x$$

$$\cos(q,x)=\frac{q^\top x}{\lVert q\rVert\lVert x\rVert}$$

Dot product rewards both angle and vector norm. Cosine removes norm and mostly reads direction. If vectors are L2-normalized, dot product equals cosine:

$$\tilde q=\frac{q}{\lVert q\rVert},\quad \tilde x=\frac{x}{\lVert x\rVert},\quad \tilde q^\top \tilde x=\cos(q,x).$$

**When the norm matters.** A norm can encode popularity, confidence, frequency, or calibration. That is useful only if the product wants it. In Search Ads, a high-norm ad vector may be a learned prior for broadly relevant ads. In semantic creator search, that same effect can bury niche but highly aligned creators. Normalize when you want semantic angle to dominate; keep dot-product norms when the model was intentionally trained to use magnitude.

**ID vs text embeddings.** ID embeddings are learned lookup vectors. They are excellent for entities with repeated behavior: a creator with many impressions and responses, a campaign with long history, an ad account with stable preferences. They fail for cold-start entities because a new ID has little or no learned history. Text embeddings come from encoders over titles, bios, posts, job descriptions, and advertiser briefs. They generalize to unseen text, but they may miss platform-specific behavior such as which creators actually accept a collaboration or which ad wording converts for a vertical.

**Worked example — dot product changes the neighborhood.** Suppose a query embedding points along the horizontal axis:

- query $q=[1,0]$
- item A $a=[10,0]$ — very high norm and same direction
- item B $b=[0.8,0.6]$ — lower norm, nearby angle
- item C $c=[0,1]$ — orthogonal

Dot scores:

- $q^\top a=10$
- $q^\top b=0.8$
- $q^\top c=0$

Cosine scores:

- $\cos(q,a)=1.0$
- $\cos(q,b)=0.8$
- $\cos(q,c)=0.0$

A wins under both, but dot says A is **12.5×** stronger than B; cosine says A is only **0.2** similarity points stronger. If A is a very popular broad creator and B is a niche creator whose profile better matches a specialized advertiser brief, dot-product serving may over-retrieve A because of norm. L2-normalization makes the retrieval question closer to "which direction best matches?"

```python
import numpy as np
q = np.array([1.0, 0.0])
items = np.array([[10.0, 0.0], [0.8, 0.6], [0.0, 1.0]])

dot = items @ q
cos = dot / (np.linalg.norm(items, axis=1) * np.linalg.norm(q))
print(dot)  # [10.   0.8  0. ]
print(cos)  # [1.  0.8 0. ]
```

**Worked example — diagnose the embedding type.** Creator Marketplace AI has two candidates for a new advertiser search "B2B cybersecurity podcast hosts":

- an ID embedding trained from past campaign interactions,
- a text embedding from creator bio, post topics, and audience description.

For established creators, ID vectors may capture real marketplace outcomes: who responds, whose audiences convert, and which verticals fit. For a new creator with no campaign history, the ID vector is missing or random. The text vector can still place the creator near "cybersecurity," "B2B," and "podcast." The practical system often concatenates, blends, or reranks both: use text for semantic cold-start, ID behavior where history is rich, and validate on cold-start slices.

**Checks before trusting neighbors:**

- Inspect vector norms; are high-norm items mostly popular hubs?
- Compare nearest neighbors under dot vs normalized cosine.
- Slice by new vs established entities.
- Verify that qualitative neighbors match the product task, not just generic topical similarity.
- Watch for hubness: a few vectors appearing as nearest neighbors for many unrelated queries.

**You'll be able to say:** *"An embedding space encodes what the training signal made nearby: co-clicked items, similar text, or shared labels. Dot product rewards both direction and norm, while cosine reads mostly angle after normalization; normalize when norm should not act like popularity or confidence. ID embeddings memorize observed entities, while text embeddings generalize by content but may miss platform-specific behavior."*

---

## M11.2 · Learning & evaluating embeddings

**The idea.** Embedding learning chooses vectors so positives score higher than negatives. The positive relation depends on the method: words near each other in text, users interacting with items, queries leading to clicked ads, or advertiser briefs matching creators. The trained space is good only if it supports the task you will serve.

**Everyday analogy.** Teaching an embedding is like arranging books in a store by how shoppers actually browse, not by publisher order. Books often bought together move onto nearby shelves; books shoppers never compare move apart. For Creator Marketplace, accepted brief→creator pairs are the "bought together" signal, and evaluation asks whether held-out good matches are easy to find from the learned shelf layout.

**Skip-gram / word2vec.** A target word predicts nearby context words. With negative sampling, the model increases the score for observed target-context pairs and decreases scores for sampled non-context words. A common objective for one positive pair $(w,c)$ and negatives $n_i$ is:

$$\log \sigma(v_w^\top u_c) + \sum_i \log \sigma(-v_w^\top u_{n_i}).$$

This is not magic semantics; it is co-occurrence geometry. Words or phrases used in similar contexts move together.

**Matrix factorization.** For user-item or entity-item interactions, factorization learns vectors whose dot product reconstructs observed behavior. A simple squared-error form is:

$$\min_{U,V}\sum_{(u,i)\in \Omega}(r_{ui}-U_u^\top V_i)^2 + \lambda(\lVert U_u\rVert^2+\lVert V_i\rVert^2).$$

For implicit feedback, the observed signal may be clicks, saves, replies, applications, or conversions, with unobserved pairs treated carefully as unknown or weak negative.

**Encoders.** A text or multimodal encoder maps raw content to a vector. Sentence encoders can embed new queries and new items without an ID lookup. They are trained by classification, masked language modeling, contrastive learning, supervised pairs, or task-specific fine-tuning.

**Alignment and uniformity.** A useful embedding space has matching pairs close together but does not collapse all vectors into one region. Alignment measures whether positives are close:

$$\mathcal{L}_{align}=\mathbb{E}_{(x,y)^+}\lVert f(x)-f(y)\rVert^2.$$

Uniformity measures whether vectors spread across the space rather than forming a collapsed ball:

$$\mathcal{L}_{uniform}=\log \mathbb{E}_{x,y}\left[e^{-2\lVert f(x)-f(y)\rVert^2}\right].$$

Good alignment with poor uniformity means everything is close to everything — retrieval cannot discriminate. Good spread with poor alignment means the model separates points but not according to the task.

**Evaluation ladder.** Do not stop at a pretty t-SNE plot. Evaluate from closest to production outward:

1. **Retrieval recall@k:** of held-out positives, how many are in the top $k$?
2. **Downstream lift:** does the embedding improve CTR, conversion, invite acceptance, or search success in the model that consumes it?
3. **Probing:** can a lightweight classifier recover expected labels, such as vertical or language, without revealing leakage or bias?
4. **Qualitative neighbors:** are top neighbors sensible for head, torso, tail, and cold-start examples?
5. **Slice checks:** new creators, rare industries, multilingual queries, small advertisers, and policy-sensitive categories.

Recall is:

$$\text{recall@}k=\frac{|\text{relevant items retrieved in top }k|}{|\text{all relevant items}|}.$$

If 8 of 10 held-out positive creator matches appear in top-20, recall@20 is $0.80$.

**Worked example — train signal to evaluation.** A Creator Marketplace embedding job has positive pairs `(advertiser brief, creator)` from accepted collaborations. Random creators are sampled as negatives. After training, the system evaluates 1,000 held-out briefs. For each brief, exact search over the candidate set returns top-20 creators; 8,000 of 10,000 held-out accepted creators appear in those lists, so recall@20 is 0.80.

That number is not enough. The team slices by creator tenure:

| Slice | Recall@20 | Diagnosis |
|---|---:|---|
| Established creators | 0.86 | behavior-rich ID signal helps |
| New creators | 0.52 | ID embedding has little history |
| Text-only new creators | 0.71 | content encoder improves cold-start |
| Rare verticals | 0.48 | positives and negatives underrepresent niche topics |

The fix is not "make vectors bigger." It may be better text features, hard negatives from rare verticals, a cold-start blend, or a reranker that uses profile metadata.

**Worked example — collapse vs useful geometry.** Suppose every query and creator vector is almost identical. Positive pairs have small distances, so alignment looks good. But every negative pair also has small distance. Uniformity is poor, top-k lists all contain the same high-popularity creators, and long-tail recall collapses. A healthy space keeps positives closer than negatives while spreading unrelated examples enough that nearest-neighbor search can choose.

```python
import numpy as np

def recall_at_k(ranked_ids, relevant, k):
    return len(set(ranked_ids[:k]) & set(relevant)) / len(relevant)

ranked = ["c7", "c2", "c9", "c1", "c5"]
relevant = {"c2", "c5", "c8"}
assert recall_at_k(ranked, relevant, 5) == 2 / 3
```

**Practical evaluation recipe:**

- Define positives from the product outcome, not convenience alone.
- Hold out by time or entity so near-duplicates do not leak.
- Compare against a lexical, popularity, or previous-model baseline.
- Measure recall@k and downstream metrics.
- Inspect neighbors on representative and failure slices.
- Decide whether ID, text, or a blended representation should serve each slice.

**You'll be able to say:** *"Embedding learning chooses vectors so positives score above negatives: word2vec predicts nearby words, MF reconstructs observed interactions, and encoders map raw text to vectors. A useful space aligns matching pairs without collapsing everything together; I evaluate it with recall@k, downstream lift, probes, and slice checks, especially cold-start slices where ID and text embeddings differ."*

---

## Resources
- Google — Embeddings module (MLCC) (what latent dimensions capture)
- Jay Alammar — illustrated embeddings/word2vec (visual intuition)

## Papers
- Efficient Estimation of Word Representations / word2vec (Mikolov et al., 2013)
- E5 Text Embeddings (Wang et al., 2022)
- Sentence-BERT (Reimers & Gurevych, 2019)
