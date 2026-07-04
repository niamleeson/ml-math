# Module Plan — M13 · ANN / vector search & indexing

| Field | Value |
|---|---|
| Domain | Domain 2 · Recommenders, Embeddings & Retrieval |
| Skip if you can already… | choose HNSW vs IVF-PQ and tune recall vs latency |
| Maps to (projects) | Creator Marketplace AI |
| Primary structure(s) | S7 Systems + Decision |
| Example type | ⚑ Both |
| Sub-lessons | 2 |
| Notebooks | 1 |

## Module hub (the "complete list")
Vector search turns embedding models into production candidate generators, but exact nearest-neighbor
search becomes too slow at marketplace scale. This module teaches the main approximate indexes and
how to pick/tune them by recall, latency, memory, freshness, and hybrid retrieval needs.

- M13.1 · ANN methods: HNSW vs IVF-PQ vs ScaNN
- M13.2 · Tuning recall/latency/memory + hybrid retrieval

## Questions this module answers (→ which sub-lesson teaches the answer)
- Why does exact kNN not scale, and what does ANN trade away? → M13.1
- How does HNSW work, including the graph idea and efSearch? → M13.1
- How do IVF, PQ, and IVF-PQ work, including quantization and nprobe? → M13.1
- What is ScaNN, and where does anisotropic/vector quantization fit? → M13.1
- How do recall, latency, and memory trade off, and how do you measure recall@k? → M13.2
- How does hybrid dense + term retrieval work, and when is it useful? → M13.2
- How do you pick HNSW vs IVF-PQ for an operating point? → M13.2

_Every question maps to a sub-lesson (coverage confirmed below)._

## Concepts (ƒ = genuine, central formula)
- Exact kNN cost: scan N vectors and compute a similarity for each
- Approximate nearest neighbors; recall@k **ƒ**; latency distribution; memory footprint; freshness
- HNSW: navigable small-world graph, layers, M, efConstruction, efSearch
- IVF: coarse centroids/lists; nprobe; residuals
- PQ and IVF-PQ: product quantization, codebooks, compressed vectors, asymmetric distance estimates
- ScaNN and anisotropic vector quantization; partition + score + rerank shape
- Recall/latency/memory tradeoff; operating point; offline exact baseline
- Hybrid dense + BM25 / term retrieval **ƒ**; score fusion, filtering, lexical constraints

## Sub-lessons

### M13.1 · ANN methods: HNSW vs IVF-PQ vs ScaNN  —  [S7 Systems + Decision, ⚑]
- **Makes answerable:** why exact kNN doesn't scale; what ANN trades; HNSW and efSearch; IVF/PQ/IVF-PQ and nprobe; ScaNN.
- **You'll be able to say:** "Exact kNN compares a query with every vector, so latency grows with corpus size. ANN reduces work by searching a graph (HNSW), probing only selected coarse clusters and compressed codes (IVF-PQ), or partitioning/quantizing/reranking vectors (ScaNN), accepting less-than-perfect recall for lower latency and memory."
- **Concepts:** exact kNN cost, ANN, HNSW graph/layers/efSearch, IVF centroids/nprobe, PQ codebooks/compression, IVF-PQ, ScaNN.
- **Key Idea focus:** the knobs + tradeoff surface for each index family — graph breadth, probed partitions, compression level, and rerank depth.
- **Worked-example shape:** knob-sweep → tradeoff curve → operating point: compare exact scan to an HNSW-like graph search and an IVF-style cluster probe; sweep efSearch/nprobe and explain how each recovers recall at more work.
- **Notebook:** Yes — brute-force top-k vs an approximate index using numpy clusters; optional faiss-cpu only if already available; `assert` recall@k improves as nprobe/candidate budget increases. Break case = too few probes misses a small but relevant cluster.
- **Real numbers to cite:** 10M vectors × 768 dimensions is billions of multiply-adds per query for exact scan; probing 10 of 1,000 lists searches about 1% of vectors before reranking.

### M13.2 · Tuning recall/latency/memory + hybrid retrieval  —  [S7 Systems, ⚑]
- **Makes answerable:** measuring recall@k; tuning recall vs latency vs memory; hybrid dense+term retrieval; choosing HNSW vs IVF-PQ.
- **You'll be able to say:** "I tune ANN by comparing approximate results to an exact or high-quality baseline, plotting recall@k against p50/p95 latency and memory, then choosing the cheapest point that satisfies product quality. HNSW is often strong for high recall and mutable-ish serving with more memory; IVF-PQ is attractive when memory is tight and large batches tolerate quantization; hybrid dense+BM25 helps when lexical constraints, rare terms, or exact names matter."
- **Concepts:** recall@k **ƒ**, p50/p95 latency, memory, build time, update/freshness, operating point, hybrid dense + BM25 **ƒ**, score fusion, HNSW vs IVF-PQ decision.
- **Key Idea focus:** production tuning — a knob is only good if it moves the operating point toward required recall within latency/memory/freshness constraints.
- **Worked-example shape:** knob-sweep → tradeoff curve → operating point. Build a table of `(knob, recall@10, p95 latency, memory)` and pick the first point meeting a recall SLO; add hybrid term recall for rare creator names or advertiser keywords.
- **Notebook:** No — covered by the M13.1 notebook; this sub-lesson uses pen-paper/system-design exercises and tradeoff tables.
- **Real numbers to cite:** example sweep: nprobe 1/4/16 gives recall@10 0.62/0.84/0.94 with latency proxy 1x/4x/16x; choose nprobe=4 if the SLO is 0.82 and latency is tight, nprobe=16 if quality needs 0.90+.

## Coverage check
All 7 module questions map to a sub-lesson: scaling limits and method mechanics → M13.1; recall/latency/memory measurement, hybrid retrieval, and HNSW vs IVF-PQ choice → M13.2. No gaps.

## Decision guide
| Need / constraint | Prefer HNSW | Prefer IVF-PQ | Consider ScaNN / hybrid |
|---|---|---|---|
| Highest recall at moderate scale | Yes, raise efSearch | Possible with high nprobe/rerank | ScaNN can be strong with rerank |
| Tight memory budget | Often expensive | Yes, PQ compression | Quantization helps |
| Very large static corpus | Good but memory-heavy | Strong fit | Strong fit |
| Frequent updates/freshness | Often easier than rebuilding compressed indexes, implementation-dependent | Harder if coarse/PQ rebuilds are needed | Depends on serving stack |
| Rare exact terms or filters | Add lexical/filter layer | Add lexical/filter layer | Hybrid dense+BM25 |

## Resources (from the guide)
- Faiss wiki (IVF, PQ, HNSW indexes and tuning)
- Pinecone — learning center (ANN concepts and recall/latency tradeoffs)

## SOTA papers (from the guide)
- HNSW (Malkov & Yashunin, 2018)
- ScaNN / Anisotropic Vector Quantization (Guo et al., 2020)
- Product Quantization (Jégou et al., 2011)

## Notes / caveats
- Worked-example shape should be knob-sweep → tradeoff curve → operating point for Creator Marketplace AI (Nano/Galene/HostedSearch-style retrieval).
- Notebook should be CPU-first: brute-force top-k vs approximate numpy index; use faiss-cpu only if already available, not as a required download.
- Do not teach ANN as "free speed"; every lesson must show the recall loss and the validation baseline.
