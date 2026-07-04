# M12 · Two-tower / EBR retrieval (+ serving)
> **Domain:** Domain 2 · Recommenders, Embeddings & Retrieval · **Maps to:** Creator Marketplace AI, Search Ads · **Skip if you can already…** build a two-tower retrieval model and reason about negatives.

## Overview

Two-tower retrieval is the standard first-stage pattern when a request must search millions of candidates. One tower encodes the query or request; the other tower encodes items. Because item embeddings can be precomputed, online serving only needs to run the query tower and perform vector search.

This module connects the model, the loss, the negative sampling choices, and the serving funnel. The key production question is: did the training objective teach a vector space that the ANN retrieval service can use without losing the items the downstream ranker needs?

**By the end you can answer:**
- What is the two-tower architecture, and why does it put queries and items in a shared space?
- How do in-batch softmax, sampled negatives, and the retrieval loss work?
- Why does sampled training create sampling bias, and how can correction help?
- What are hard negatives, and why do they change what the model learns?
- How is two-tower retrieval served with precomputed item embeddings and ANN?
- How do you measure recall@k and tune the retrieval funnel?

Two sub-lessons:

- **M12.1 The two-tower model & training** — architecture, dot scores, softmax loss, and negatives.
- **M12.2 Serving two-tower retrieval** — precompute, ANN, recall, and funnel tuning.

---

## M12.1 · The two-tower model & training

**The idea.** A two-tower model learns two encoders:

- a query tower $f_q(q)$ for the request, such as a Creator Marketplace search query or a Search Ads request;
- an item tower $f_i(i)$ for a creator, ad, document, or listing.

Both outputs live in the same vector space. The retrieval score is usually a dot product:

$$s(q,i)=f_q(q)^\top f_i(i).$$

If vectors are normalized, this becomes cosine-style retrieval. Without normalization, vector norms can encode confidence, popularity, or calibration.

The architecture is useful because item vectors are independent of the live query. You can compute them offline, build an ANN index, and search by maximum inner product when a request arrives. A cross-encoder that jointly reads `(query, item)` may be more accurate, but it cannot score millions of candidates in the first stage.

**Training data.** Each row needs a positive pair: query→clicked ad, advertiser brief→accepted creator, member query→selected result, or user→engaged item. The model then needs negatives. Negatives can be:

- random candidates from the corpus,
- in-batch negatives: the other positives in the same mini-batch,
- sampled negatives from a candidate distribution,
- hard negatives: plausible but wrong candidates, often retrieved by a previous model or lexical search.

**In-batch softmax.** In a batch of $B$ positive pairs $(q_b,i_b)$, score every query against every item in the batch. For row $b$, item $b$ is the positive and the other $B-1$ items are negatives:

$$p(i_b\mid q_b)=\frac{\exp(s(q_b,i_b))}{\sum_{j=1}^{B}\exp(s(q_b,i_j))}.$$

The loss is negative log probability:

$$\mathcal{L}_b=-\log \frac{\exp(s(q_b,i_b))}{\sum_{j=1}^{B}\exp(s(q_b,i_j))}.$$

If a hard negative has a score close to the positive, the denominator grows, the positive probability falls, and the loss stays high. That is exactly the pressure that teaches fine distinctions.

**Sampling-bias correction.** Sampled negatives often do not match the serving distribution. If popular items are over-sampled or under-sampled, the model can learn the sampler rather than the task. A common correction subtracts the log sampling probability from the sampled item's score:

$$s'(q,i)=s(q,i)-\log Q(i).$$

This logQ correction says: if an item appeared often because the sampler made it likely, discount that exposure before the softmax treats it as evidence.

**Worked example — one query, three candidates.** A Search Ads retrieval batch scores one query against three ads:

- ad 0 is the clicked positive, score 4.0;
- ad 1 is an easy negative, score 1.0;
- ad 2 is a hard negative, score 3.8.

The positive probability is:

$$\frac{e^{4.0}}{e^{4.0}+e^{1.0}+e^{3.8}}\approx 0.54.$$

The loss is $-\log(0.54)\approx 0.62$. If the hard negative score were 0.5 instead of 3.8, the positive probability would be about 0.94 and the loss would be tiny. Hard negatives keep the model learning where ranking mistakes are plausible.

```python
import numpy as np
scores = np.array([4.0, 1.0, 3.8])
probs = np.exp(scores) / np.exp(scores).sum()
loss = -np.log(probs[0])
print(round(probs[0], 2), round(loss, 2))  # 0.54 0.62
```

**Worked example — logQ correction.** Suppose a negative ad is sampled with $Q=0.20$ because it is popular, while another is sampled with $Q=0.01$. If both have raw score 2.0, corrected scores are:

- popular: $2.0-\log(0.20)=3.61$
- rare: $2.0-\log(0.01)=6.61$

The correction changes how sampled observations represent the full corpus. The exact convention depends on the sampled-softmax implementation, but the concept is stable: account for the negative sampler instead of pretending sampled candidates are naturally distributed.

**Hard-negative caution.** A hard negative is useful only if it is actually negative. In Creator Marketplace AI, two creators with similar topics may both be acceptable for a brief; treating one accepted creator as the only positive and the other as a negative can teach the model to separate valid alternatives. Mine hard negatives, then filter with labels, business rules, or cross-encoder judgments, and monitor false-negative-heavy slices.

**You'll be able to say:** *"A two-tower model encodes the request and each item separately, then scores them with a dot product in a shared space. Training uses positives and many negatives, often the other items in the batch; because sampled negatives do not match the serving distribution, bias correction can subtract the log sampling probability. Hard negatives are plausible wrong items that force sharper decision boundaries than random negatives."*

---

## M12.2 · Serving two-tower retrieval

**The idea.** Serving works because the item tower is not request-dependent. The offline path computes item embeddings, validates them, builds an ANN index, and publishes it. The online path runs the query tower, searches the index, applies filters, and returns a candidate set for the downstream ranker.

A typical serving funnel:

1. Batch or streaming job computes creator/ad/item vectors.
2. Eligibility filters remove inactive, policy-blocked, exhausted, or out-of-market candidates.
3. ANN index is built and versioned.
4. Online request runs query tower.
5. ANN returns top $K$ candidates.
6. Lightweight filters and dedupe run.
7. Ranker reranks hundreds or thousands of candidates with richer features.

Recall@k compares approximate retrieval to the relevant set or exact baseline:

$$\text{recall@}k=\frac{|\text{relevant items retrieved in top }k|}{|\text{relevant items}|}.$$

For index recall, the denominator is often the exact top-k from brute-force vector search. If exact top-100 has 100 neighbors and ANN returns 92 of those, index recall@100 is 0.92.

**The S7 tradeoff surface.** Serving knobs move recall, latency, memory, freshness, and ranker cost:

- top-K candidate count: more candidates raise ranker opportunity but cost more;
- ANN search breadth: higher recall but higher p95 latency;
- embedding dimension: more capacity but more memory and compute;
- refresh cadence: fresher items but more index churn;
- filters before vs after ANN: cheaper search vs risk of filtered-out result sets;
- reranker budget: larger candidate pools help only if the reranker can score them.

**Worked example — knob sweep to operating point.** Creator Marketplace AI retrieves creators for "fitness creators in Toronto with brand partnership experience." Exact top-100 from brute-force search is the baseline. The team sweeps ANN search breadth and candidate count:

| Setting | Candidates to rank | Index recall@100 | p95 retrieval latency | Reranker cost | Decision |
|---|---:|---:|---:|---:|---|
| A | 200 | 0.88 | 8 ms | low | misses too many niche creators |
| B | 500 | 0.93 | 13 ms | medium | good default if ranker budget is tight |
| C | 1000 | 0.96 | 21 ms | high | best quality, may exceed p95 budget |
| D | 1500 | 0.97 | 32 ms | very high | small recall gain, too expensive |

If product quality requires recall@100 ≥ 0.93 and the p95 retrieval budget is 15 ms, setting B is the operating point. Setting C is attractive only if downstream conversion lift justifies the extra ranker cost.

**Worked example — stale embeddings.** A creator updates their profile from "general lifestyle" to "B2B cybersecurity podcast host." If item embeddings refresh daily, a morning advertiser search may miss that creator until the next batch build. ANN recall against yesterday's vectors can look fine while product recall for fresh creators is poor. Freshness is therefore a serving metric, not a modeling afterthought.

```python
import numpy as np

def topk(scores, k):
    return np.argsort(-scores)[:k]

def recall_at_k(approx_ids, exact_ids, k):
    return len(set(approx_ids[:k]) & set(exact_ids[:k])) / k

exact = np.array([9, 3, 7, 2, 5])
approx = np.array([9, 7, 2, 1, 4])
assert recall_at_k(approx, exact, 3) == 2 / 3
```

**Tuning checklist:**

- Measure exact or high-quality baseline recall.
- Sweep candidate count and ANN breadth together.
- Plot recall vs p50/p95 latency, memory, and ranker cost.
- Validate head, tail, cold-start, language, geography, and rare-query slices.
- Check freshness: how long from item update to searchable vector?
- Decide whether the bottleneck is index recall, candidate count, filters, or reranker capacity.

**You'll be able to say:** *"At serving time, item embeddings are precomputed and indexed; the online path only runs the query tower, probes ANN, and returns a candidate set for ranking. I tune the funnel by measuring recall@k against exact or labeled neighbors, then trading candidate count, ANN parameters, freshness, memory, and reranker capacity."*

---

## Resources
- TensorFlow Recommenders (GitHub) (two-tower retrieval reference)
- Google Rec course — retrieval stage (candidate generation with embeddings)

## Papers
- Sampling-Bias-Corrected Neural Two-Tower (Yi et al., 2019)
- Embedding-based Retrieval in Facebook Search (Huang et al., 2020)
- Dense Passage Retrieval (Karpukhin et al., 2020)
