# Module Plan — M12 · Two-tower / EBR retrieval (+ serving)

| Field | Value |
|---|---|
| Domain | Domain 2 · Recommenders, Embeddings & Retrieval |
| Skip if you can already… | build a two-tower retrieval model and reason about negatives |
| Maps to (projects) | Creator Marketplace AI, Search Ads |
| Primary structure(s) | S1 Model + S7 Systems |
| Example type | ⚑ Both |
| Sub-lessons | 2 |
| Notebooks | 2 |

## Module hub (the "complete list")
Two-tower retrieval is the standard first-stage architecture when a request must search millions of
candidates quickly. This module links the model shape, the training loss and negative sampling
choices, and the serving funnel where precomputed item embeddings meet ANN search.

- M12.1 · The two-tower model & training
- M12.2 · Serving two-tower retrieval

## Questions this module answers (→ which sub-lesson teaches the answer)
- What is the two-tower architecture, and why does it put queries and items in a shared space? → M12.1
- How do in-batch softmax, sampled negatives, and the retrieval loss work? → M12.1
- Why does sampled training create sampling bias, and how can correction help? → M12.1
- What are hard negatives, and why do they change what the model learns? → M12.1
- How is two-tower retrieval served with precomputed item embeddings and ANN? → M12.2
- How do you measure recall@k and tune the retrieval funnel? → M12.2

_Every question maps to a sub-lesson (coverage confirmed below)._

## Concepts (ƒ = genuine, central formula)
- Query tower and item tower; shared embedding space; independent item encoding
- Dot-product scoring **ƒ**; optional normalization/cosine scoring
- Positive pairs; in-batch negatives; sampled negatives; hard negatives
- In-batch softmax / sampled softmax loss **ƒ**; temperature or score scale where applicable
- Sampling-bias correction / logQ correction **ƒ**; popularity-skewed candidate sampling
- Offline retrieval recall@k **ƒ**; candidate generation vs ranking funnel
- Serving: precompute item embeddings, batch refresh, ANN index build, online query tower, top-k fetch
- Funnel tuning: candidate count, index recall, reranker budget, slice recall, freshness

## Sub-lessons

### M12.1 · The two-tower model & training  —  [S1 Model, ⚑]
- **Makes answerable:** the two-tower architecture; in-batch softmax and sampled negatives; the loss; sampling-bias correction; hard negatives.
- **You'll be able to say:** "A two-tower model encodes the request and each item separately, then scores them with a dot product in a shared space. Training uses positives and many negatives, often the other items in the batch; because sampled negatives do not match the serving distribution, bias correction can subtract the log sampling probability. Hard negatives are plausible wrong items that force sharper decision boundaries than random negatives."
- **Concepts:** query/item towers, shared space, dot-product scoring **ƒ**, in-batch softmax loss **ƒ**, sampled negatives, sampling-bias correction **ƒ**, hard negatives.
- **Key Idea focus:** formulation + when to use — decouple query and item encoding when first-stage retrieval needs fast maximum inner-product search.
- **Worked-example shape:** 10 basics → 5 easy → 5 advanced: draw towers; compute a 3-item dot-product score vector; compute one softmax loss; compare random vs hard negatives; apply a simple logQ correction for an over-sampled popular item.
- **Notebook:** Yes — numpy mini-batch with query/item vectors; compute in-batch softmax loss; `assert` the positive is the target class; show loss rises when a hard negative score approaches the positive. Break case = negatives sampled only from unpopular items produce a model that over-retrieves popular serving candidates.
- **Real numbers to cite:** for scores `[4.0, 1.0, 3.8]` with item 0 positive, softmax probability is about 0.54 and the near-positive hard negative at 3.8 keeps loss high; subtracting `log q(item)` reduces bias from over-sampled negatives.

### M12.2 · Serving two-tower retrieval  —  [S7 Systems, ⚑]
- **Makes answerable:** serving with precomputed item embeddings plus ANN; recall@k; tuning the retrieval funnel.
- **You'll be able to say:** "At serving time, item embeddings are precomputed and indexed; the online path only runs the query tower, probes ANN, and returns a candidate set for ranking. I tune the funnel by measuring recall@k against exact or labeled neighbors, then trading candidate count, ANN parameters, freshness, memory, and reranker capacity."
- **Concepts:** precomputed item embeddings, embedding refresh, ANN index, online query tower, top-k retrieval, recall@k **ƒ**, funnel tuning, slice recall.
- **Key Idea focus:** the knobs + tradeoff surface — precompute what is item-only, spend online latency on query encoding and candidate count, and measure recall loss before the reranker.
- **Worked-example shape:** knob-sweep → tradeoff curve → operating point. Sweep top-k and ANN recall; plot recall vs latency; pick a candidate budget that feeds the reranker without blowing latency.
- **Notebook:** Yes — synthetic query/item embeddings; exact top-k baseline vs approximate top-k by candidate subsampling or noisy scores; `assert` approximate recall@k is ≤ exact recall; plot recall and latency proxy as candidate count grows. Break case = stale item embeddings omit newly eligible creators/ads.
- **Real numbers to cite:** if exact top-100 contains 100 labeled positives and ANN returns 92 of them, index recall@100 = 0.92; increasing candidates from 200 to 1,000 may lift recall while adding reranker cost.

## Coverage check
All 6 module questions map to a sub-lesson: architecture, loss, sampled/in-batch negatives, bias correction, and hard negatives → M12.1; precompute+ANN serving, recall@k, and funnel tuning → M12.2. No gaps.

## Decision guide
Two-tower vs cross-encoder/reranker: use two-tower for cheap first-stage candidate generation over large corpora; use cross-encoder or richer rankers after retrieval on hundreds/thousands of candidates. Random negatives teach broad separation; hard negatives teach fine distinctions but can destabilize training if false negatives are common. Increase candidate count or ANN recall when downstream quality is recall-limited; reduce them when latency or reranker capacity is binding.

## Resources (from the guide)
- TensorFlow Recommenders (GitHub) (two-tower retrieval reference)
- Google Rec course — retrieval stage (candidate generation with embeddings)

## SOTA papers (from the guide)
- Sampling-Bias-Corrected Neural Two-Tower (Yi et al., 2019)
- Embedding-based Retrieval in Facebook Search (Huang et al., 2020)
- Dense Passage Retrieval (Karpukhin et al., 2020)

## Notes / caveats
- Keep M12 tied to Creator Marketplace AI and Search Ads candidate generation, not final ranking.
- Treat bias correction as genuine math because it changes the sampled-softmax objective; avoid deriving unnecessary variants.
- Serving notebooks should simulate ANN behavior without requiring faiss.
