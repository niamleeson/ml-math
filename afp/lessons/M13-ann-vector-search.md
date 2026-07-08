# M13 · ANN / vector search & indexing
> **Domain:** Domain 2 · Recommenders, Embeddings & Retrieval · **Maps to:** Creator Marketplace AI · **Skip if you can already…** choose HNSW vs IVF-PQ and tune recall vs latency.

## Overview

Vector search turns embeddings into a production retrieval system. Exact nearest-neighbor search compares a query vector to every candidate vector. That is simple and correct, but at marketplace scale it becomes too slow and too expensive. Approximate nearest neighbor (ANN) indexes reduce work by searching a graph, probing selected partitions, compressing vectors, or reranking a smaller candidate set.

ANN is not free speed. It trades recall for latency and memory. The engineering job is to measure the loss against an exact baseline, sweep the knobs, and choose an operating point that satisfies product quality, latency, memory, freshness, and filtering constraints.

**Example note.** The corpus sizes, recall, latency, and memory values in this lesson are synthetic operating examples for learning the tradeoff. They are not Creator Marketplace production measurements.

**By the end you can answer:**
- Why does exact kNN not scale, and what does ANN trade away?
- How does HNSW work, including the graph idea and efSearch?
- How do IVF, PQ, and IVF-PQ work, including quantization and nprobe?
- What is ScaNN, and where does anisotropic/vector quantization fit?
- How do recall, latency, and memory trade off, and how do you measure recall@k?
- How does hybrid dense + term retrieval work, and when is it useful?
- How do you pick HNSW vs IVF-PQ for an operating point?

Two sub-lessons:

- **M13.1 ANN methods: HNSW vs IVF-PQ vs ScaNN** — how the major index families reduce work.
- **M13.2 Tuning recall/latency/memory + hybrid retrieval** — knob sweep, tradeoff curve, and operating point.

<p class="cur-colab"><a class="cur-colab-btn" href="https://colab.research.google.com/github/niamleeson/ml-math/blob/main/afp/notebooks/M13-ann-vector-search.ipynb" target="_blank" rel="noopener">▶ Open the runnable ANN notebook (toy IVF, PQ &amp; HNSW, recall-vs-latency tuning) in Google Colab</a></p>

---

## M13.1 · ANN methods: HNSW vs IVF-PQ vs ScaNN

**The idea.** Exact kNN computes a similarity from the query to every vector, then sorts or selects top-k. With 10M vectors and 768 dimensions, one query requires billions of multiply-adds before reranking. That can be acceptable for an offline evaluation baseline, but not for a low-latency Creator Marketplace search endpoint.

ANN indexes avoid scoring everything. They search a subset likely to contain the true nearest neighbors. The cost is recall loss: the approximate top-k may miss items that exact search would have returned.

**Everyday analogy.** Finding the closest coffee shop by checking every shop in the city is exact, but slow. A good index is like using neighborhoods and landmarks to skip most streets: HNSW is a highway network of shortcuts between promising areas, while IVF-PQ is filing cabinets of coarse neighborhoods plus compressed shop summaries. The faster and smaller the guide, the more often it may miss the true closest shop, so you tune for the right recall, latency, and memory tradeoff.

Recall@k is the core validation metric:

$$\text{recall@}k=\frac{|\text{approx top-}k\cap\text{exact top-}k|}{k}.$$

If approximate top-50 contains 46 of the exact top-50, recall@50 is $46/50=0.92$.

**HNSW.** Hierarchical Navigable Small World builds a graph where each vector connects to nearby vectors. Search starts from an entry point, greedily walks toward better neighbors through upper layers, then explores a candidate set near the bottom layer. Important knobs:

- `M`: number of graph connections per node, affecting memory and graph quality;
- `efConstruction`: build-time search breadth, affecting index quality and build cost;
- `efSearch`: query-time breadth, raising recall at higher latency.

HNSW is often strong when high recall matters and memory is available. It can support updates in many implementations better than heavily compressed indexes, though operational details matter.

**IVF.** Inverted File indexing clusters vectors into coarse centroids. Each vector is assigned to a list. At query time, search probes only the nearest lists. The main knob is `nprobe`: how many lists to scan. If there are 1,000 lists and `nprobe=10`, the search may examine roughly 1% of vectors before reranking.

**PQ and IVF-PQ.** Product Quantization compresses vectors by splitting each vector into subvectors and replacing each subvector with a codebook index. Instead of storing every float, the index stores compact codes. IVF-PQ combines coarse partitioning with compressed residual or vector codes. It reduces memory dramatically but introduces quantization error. Higher compression saves memory but can lower recall.

**ScaNN.** ScaNN-style systems combine partitioning, vector quantization, asymmetric scoring, and a rerank step on a candidate set. The important pattern is partition → score compressed candidates → rerank a limited number with more accurate vectors. Anisotropic vector quantization spends accuracy where score errors matter most for maximum inner product search.

**Graph vs quantization families, concretely.** These families save work in different ways:

- **Graph family (HNSW):** store neighbor links; for a query near $[1,0]$, walk from a broad entry node to increasingly closer creator nodes until the local candidate set stabilizes.
- **Partition family (IVF):** assign each vector to one coarse centroid; with 1,000 lists and `nprobe=10`, search about 1% of the corpus before rerank.
- **Quantization family (PQ / IVF-PQ / ScaNN):** store compressed codes; a 768-d float32 vector is 3,072 bytes, while a 64-byte PQ code is 48× smaller before metadata and rerank vectors.

**Method operating points, concretely.** On the same illustrative 5M-vector creator index with recall measured against exact top-50:

| Method | What it is | Example operating point |
|---|---|---|
| **HNSW** | graph search through neighbor links | `efSearch=160` → recall@50 0.97, p95 22 ms, memory 18 GB; choose when recall beats memory pressure |
| **IVF-PQ** | coarse partitions plus compressed vector codes | `nprobe=32` + 500 exact rerank → recall@50 0.94, p95 19 ms, memory 6 GB; choose under an 8 GB shard budget |
| **ScaNN** | partition + anisotropic/vector quantization + reorder/rerank | 2,000 leaves, 80 probes, 1,000 reorder → recall@50 0.96, p95 17 ms, memory 9 GB; choose when the serving stack supports its MIPS-tuned rerank path |

**Worked example — exact scan vs selected partitions.** In a toy Creator Marketplace-style index with 10M creator vectors, exact search compares the advertiser query to all 10M. IVF with 1,000 lists and `nprobe=10` searches about 100k vectors, then reranks. It may miss a niche creator if that creator sits in the 11th-nearest list, so recall must be measured against exact top-k.

```python
import numpy as np

def brute_force_topk(q, X, k):
    scores = X @ q
    return np.argsort(-scores)[:k]

rng = np.random.default_rng(7)
X = rng.normal(size=(1000, 32))
q = rng.normal(size=32)
exact = brute_force_topk(q, X, 10)
# A toy "approximate" search: score only a candidate subset.
candidates = rng.choice(len(X), size=200, replace=False)
approx_local = brute_force_topk(q, X[candidates], 10)
approx = candidates[approx_local]
recall10 = len(set(exact) & set(approx)) / 10
print(round(recall10, 2))
```

**Method comparison.** These are not universal rankings; they are operating tendencies you validate on your data.

| Method | How it saves work | Main knobs | Strengths | Watch out for |
|---|---|---|---|---|
| HNSW | graph walk visits promising neighbors | M, efConstruction, efSearch | high recall, simple query tuning | memory-heavy; build/update cost |
| IVF | probes selected coarse clusters | number of lists, nprobe | scalable; intuitive latency knob | misses items in unprobed lists |
| PQ | compressed vector codes | subquantizers, bits/code, rerank | low memory | quantization lowers score accuracy |
| IVF-PQ | partitions plus compressed codes | nlist, nprobe, PQ code size | very large corpora under memory limits | needs careful training and rerank |
| ScaNN | partition + quantize + rerank | leaves/probes, reorder size | strong MIPS/semantic search pattern | implementation-specific tuning |

**Knob intuition.** Raising `efSearch`, `nprobe`, or rerank depth usually increases recall and latency. Increasing compression usually decreases memory and may decrease recall. Better build-time settings can improve recall but cost more offline.

**You'll be able to say:** *"Exact kNN compares a query with every vector, so latency grows with corpus size. ANN reduces work by searching a graph (HNSW), probing only selected coarse clusters and compressed codes (IVF-PQ), or partitioning/quantizing/reranking vectors (ScaNN), accepting less-than-perfect recall for lower latency and memory."*

---

## M13.2 · Tuning recall/latency/memory + hybrid retrieval

**The idea.** ANN tuning is a systems tradeoff. You do not ask "which index is best?" in isolation. You ask which configuration meets recall, p95 latency, memory, build time, update freshness, filtering, and ranking constraints for the product.

**Everyday analogy.** Choosing an ANN setting is like choosing a delivery route for a courier with a deadline and a backpack size. Taking every side street finds the perfect stop but misses the deadline; taking only highways is fast but may skip a small address. More maps, shortcuts, and notes improve success but use memory, so the chosen route is the cheapest one that finds enough right addresses on time.

The correct worked example shape is S7: knob-sweep → tradeoff curve → operating point.

**Step 1 — choose the baseline.** Build a held-out query set. For each query, compute exact top-k if possible, or use a high-quality exhaustive/offline index. This gives the denominator for recall. Include Creator Marketplace queries with rare creator names, niche verticals, geography, language, and policy filters.

**Step 2 — sweep knobs.** For HNSW, sweep `efSearch`. For IVF-PQ, sweep `nprobe`, compression, and rerank depth. Measure recall@k, p50/p95 latency, memory, and freshness.

**Step 3 — pick an operating point.** Choose the cheapest point that satisfies quality. Do not maximize recall blindly if it blows the p95 budget or starves the reranker.

**Concrete HNSW sweep.** Same illustrative 5M-vector creator index, recall against exact top-50:

| Index | Knob | Recall@50 | p95 latency | Memory | Notes |
|---|---:|---:|---:|---:|---|
| HNSW | efSearch 40 | 0.88 | 7 ms | 18 GB | too much recall loss |
| HNSW | efSearch 80 | 0.93 | 12 ms | 18 GB | viable default |
| HNSW | efSearch 160 | 0.97 | 22 ms | 18 GB | strong quality, higher p95 |
| HNSW | efSearch 320 | 0.985 | 41 ms | 18 GB | diminishing returns |

If the SLO is recall@50 ≥ 0.95 and p95 ≤ 25 ms, `efSearch=160` is the operating point. If p95 must be ≤ 15 ms, the team either accepts `efSearch=80`, improves the reranker to recover quality, or changes the index/hardware budget.

**Concrete IVF-PQ sweep.** Same illustrative corpus compressed with IVF-PQ:

| Index | Knob | Recall@50 | p95 latency | Memory | Notes |
|---|---:|---:|---:|---:|---|
| IVF-PQ | nprobe 4 | 0.78 | 5 ms | 4 GB | fast, misses many niche creators |
| IVF-PQ | nprobe 16 | 0.89 | 11 ms | 4 GB | memory-efficient, recall below HNSW |
| IVF-PQ | nprobe 64 | 0.95 | 29 ms | 4 GB | meets recall, may miss latency |
| IVF-PQ + rerank | nprobe 64 + 2k rerank | 0.97 | 38 ms | 6 GB | quality up, latency high |

IVF-PQ is attractive when memory is tight or the corpus is very large and relatively static. HNSW is attractive when high recall at moderate latency is more important than memory.

**Tradeoff curve reading.** Plot recall on the y-axis and p95 latency on the x-axis. Good configurations are on the frontier: no other point has both higher recall and lower latency. Points off the frontier are dominated and should not be chosen unless they have another advantage such as memory or freshness.

**Hybrid dense + term retrieval.** Dense vectors are good for semantic matches: "brand-safe fitness creators" can find profiles that do not repeat that exact phrase. Term retrieval is good for exact names, rare tokens, SKUs, compliance phrases, and advertiser keywords. Hybrid retrieval combines both:

- run dense ANN and BM25/term retrieval in parallel;
- union or interleave candidates;
- fuse scores, for example with weighted normalized scores;
- let the ranker make final decisions with both dense and lexical features.

A simple fusion score is:

$$\text{score}=\alpha\,\text{dense\_score}+(1-\alpha)\,\text{lexical\_score}.$$

Use hybrid when queries include exact creator names, product names, rare industries, or strict keyword constraints. In Creator Marketplace AI, "Dr. Lina Chen robotics creator" should not be lost because a dense model thinks many AI creators are semantically similar.

**Decision guide.**

| Need / constraint | Prefer HNSW | Prefer IVF-PQ | Consider ScaNN / hybrid |
|---|---|---|---|
| Highest recall at moderate scale | Yes, raise efSearch | Possible with high nprobe/rerank | ScaNN can be strong with rerank |
| Tight memory budget | Often expensive | Yes, PQ compression | Quantization helps |
| Very large static corpus | Good but memory-heavy | Strong fit | Strong fit |
| Frequent updates/freshness | Often easier than rebuilding compressed indexes, implementation-dependent | Harder if coarse/PQ rebuilds are needed | Depends on serving stack |
| Rare exact terms or filters | Add lexical/filter layer | Add lexical/filter layer | Hybrid dense+BM25 |

**Worked operating decision.** In an illustrative Creator Marketplace-style service, assume a 20 ms p95 retrieval budget, 8 GB memory budget per shard, and recall@50 target of 0.94. HNSW at `efSearch=160` reaches 0.97 recall but uses 18 GB, so it misses memory. IVF-PQ at `nprobe=64` reaches 0.95 recall in 29 ms, so it misses latency. IVF-PQ at `nprobe=32` with a small exact rerank of 500 candidates reaches 0.94 in 19 ms and 6 GB. That is the selected point, with hybrid lexical retrieval added for exact creator-name queries.

**You'll be able to say:** *"I tune ANN by comparing approximate results to an exact or high-quality baseline, plotting recall@k against p50/p95 latency and memory, then choosing the cheapest point that satisfies product quality. HNSW is often strong for high recall and mutable-ish serving with more memory; IVF-PQ is attractive when memory is tight and large batches tolerate quantization; hybrid dense+BM25 helps when lexical constraints, rare terms, or exact names matter."*

---

## Resources
- Faiss wiki (IVF, PQ, HNSW indexes and tuning)
- Pinecone — learning center (ANN concepts and recall/latency tradeoffs)

## Papers
- HNSW (Malkov & Yashunin, 2018)
- ScaNN / Anisotropic Vector Quantization (Guo et al., 2020)
- Product Quantization (Jégou et al., 2011)
