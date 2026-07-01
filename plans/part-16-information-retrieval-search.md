# Part 16 — Information Retrieval & Search

> Plan only — per-topic revamp plan. See ../00-MASTER-PLAN.md for the shared design & family registry (F1–F17).
> **Code style:** every notebook code cell is written one statement per line (newline-split, blank lines between logical groups) for readability — never dense, semicolon-packed one-liners. See ../00-MASTER-PLAN.md §B.4.
> Dominant family: F14 (Ranking / Retrieval / RecSys).

### 16.1 — Inverted indexes & Boolean retrieval   [notebook: 16.1-inverted-indexes.ipynb]   (family: F14)

**Lesson — Real World Applications (5):**
1. Site search facets — on the lesson toy corpus, `search` returns $P(search)=\{1,2,4\}$, so 3 of 4 docs are candidates.
2. Legal eDiscovery Boolean queries — `neural AND search` is $\{1,3\}\cap\{1,2,4\}=\{1\}$, a 1-document review set.
3. Code/documentation search — `graph OR retrieval` is $\{2,4\}\cup\{3,4\}=\{2,3,4\}$, 3 matches from 4 docs.
4. Security-log exclusion filters — `NOT neural` is $\{1,2,3,4\}\setminus\{1,3\}=\{2,4\}$, so 2 docs survive.
5. Case-normalized support search — if `Search` and `search` split, the lesson's 3-document `search` evidence can fragment into smaller postings lists (illustrative).

**Notebook plan:**
- Family: F14 Ranking/Retrieval/RecSys
- Concept built once (D1): `build_index()` + `boolean_query()`; verify $N=4$, $P(neural)=\{1,3\}$, $P(search)=\{1,2,4\}$, AND/OR/NOT set formulas.
- Datasets D1–D5: D1 four lesson docs · D2 12 clean topic docs · D3 +case variants, punctuation, ties · D4 sklearn 20newsgroups 3-category subset · D5 long-tail queries with negation and rare terms
- Metric: recall@k
- Closing viz: (a) postings/ranking panels per rung (b) recall@k-vs-complexity curve
- Pitfall on D5: forgetting normalization; reproduce `Search`/`search` recall loss, then lowercase/token-normalize.
- Notes: delete dead template helpers; keep Boolean as candidate generation, not scoring.

### 16.2 — BM25 & probabilistic retrieval   [notebook: 16.2-bm25.ipynb]   (family: F14)

**Lesson — Real World Applications (5):**
1. Enterprise keyword search — rare `neural` gets $idf=0.693$ vs common `search` $idf=0.357$, about $1.94\times$ the weight.
2. Anti-keyword-stuffing ranking — average-length TF multipliers are 1.000, 1.375, 1.774 for $tf=1,2,5$, so 5 repeats are not $5\times$.
3. Help-center search — query `neural search` ranks lesson $d_1$ first with BM25 $1.184$.
4. Legal/document retrieval — a one-rare-term doc $d_3=0.693$ beats two common-term-only $d_4=0.448$ in the lesson numbers.
5. Long-document normalization — lesson lengths $3,2,3,4$ give $avgdl=3.000$ and penalize the length-4 accidental match.

**Notebook plan:**
- Family: F14 Ranking/Retrieval/RecSys
- Concept built once (D1): `bm25_score()`; verify $idf(search)=0.357$, $idf(neural)=0.693$, $d_1=1.184$, and ranking $d_1>d_3>d_4>d_2$.
- Datasets D1–D5: D1 lesson four-doc corpus · D2 clean keyword docs · D3 +stuffed repeats/length variation · D4 sklearn 20newsgroups subset · D5 long documents with synonym misses
- Metric: NDCG@5
- Closing viz: (a) ranked slates with BM25 term contributions (b) NDCG@5-vs-complexity curve
- Pitfall on D5: expecting semantic recall; reproduce zero score for synonym-only relevant docs, then add a hybrid/dense fallback note.
- Notes: delete dead template helpers; scores only comparable inside one tokenization/index.

### 16.3 — Vector-space models   [notebook: 16.3-vector-space-models.ipynb]   (family: F14)

**Lesson — Real World Applications (5):**
1. Knowledge-base search — smoothed TF-IDF gives `neural` $idf=1.511$ and `search` $idf=1.223$ on the lesson corpus.
2. Document similarity search — query `neural search` has norm $\sqrt{1.511^2+1.223^2}=1.944$.
3. Duplicate/near-duplicate detection — exact query/document direction yields cosine $1.000$ before repeated-count effects.
4. Long-document correction — repeated `search` tilts $d_1$ to cosine $0.944$, showing length-normalized angle rather than raw size.
5. Search result ranking — lesson cosines rank $d_1=0.944>d_3=0.550>d_4=0.474>d_2=0.396$.

**Notebook plan:**
- Family: F14 Ranking/Retrieval/RecSys
- Concept built once (D1): `tfidf_cosine_rank()`; verify smoothed $idf_j=\log((N+1)/(df_j+1))+1$, query norm 1.944, and the four lesson cosines.
- Datasets D1–D5: D1 lesson vocabulary/docs · D2 clean TF-IDF mini corpus · D3 +stopwords/synonyms/ties · D4 sklearn 20newsgroups subset · D5 long-tail vocabulary and stopword-heavy docs
- Metric: MRR
- Closing viz: (a) sparse-vector heatmaps/ranked slates (b) MRR-vs-complexity curve
- Pitfall on D5: assuming sparse vectors understand synonyms; reproduce `car`/`automobile` miss, then fix with preprocessing/synonym mapping caveat.
- Notes: delete dead template helpers; name the exact TF-IDF smoothing convention.

### 16.4 — Dense retrieval & embeddings   [notebook: 16.4-dense-retrieval.ipynb]   (family: F14)

**Lesson — Real World Applications (5):**
1. Semantic enterprise search — lesson query $q=[0.9,0.1]$ retrieves $z_1$ with cosine $0.994$ despite vector abstraction.
2. FAQ/search synonyms — $z_2=[0.8,0.2]$ scores $0.991$, nearly tied with $z_1$, illustrating semantic-neighbor recall.
3. Mismatch rejection — orthogonal $z_3=[0,1]$ scores only $0.110$.
4. Safety/constraint filtering — opposite-ish $z_4=[-0.2,0.9]$ scores $-0.108$, showing low semantic fit.
5. Vector database serving — exact dense scan costs $O(Nd)$ per query, the lesson motivation for ANN.

**Notebook plan:**
- Family: F14 Ranking/Retrieval/RecSys
- Concept built once (D1): `dense_cosine_rank()`; verify $\|q\|=0.906$ and lesson scores $0.994,0.991,0.110,-0.108$.
- Datasets D1–D5: D1 2D lesson embeddings · D2 clean synthetic semantic clusters · D3 +synonyms/noisy high-norm vectors · D4 sklearn 20newsgroups with tiny hashed/SVD embeddings · D5 off-domain/constraint-heavy queries
- Metric: recall@3
- Closing viz: (a) 2D/embedding-neighbor panels (b) recall@3-vs-complexity curve
- Pitfall on D5: skipping normalization while assuming cosine; reproduce high-norm dot-product winner, then L2-normalize.
- Notes: delete dead template helpers; keep CPU-only embeddings from tiny features/SVD, no large model download.

### 16.5 — Approximate nearest neighbors (FAISS, HNSW, IVF)   [notebook: 16.5-approximate-nearest-neighbors.ipynb]   (family: F14)

**Lesson — Real World Applications (5):**
1. Vector database search — exact nearest to $q=[3.1,3.0]$ is $[3,3]$ at distance $0.100$.
2. Image/product similarity — second neighbor $[3.2,3.1]$ is distance $0.141$, close enough to test recall@2.
3. Candidate pruning — $[4,3]$ is distance $0.900$ while far-cluster distances include $4.314,3.662,3.689$.
4. ANN recall monitoring — restricting to a candidate set $C(q)$ is valid only if it still contains the true nearest $[3,3]$.
5. Metric consistency checks — cosine/Euclidean order can change unless vectors are normalized (lesson caveat; illustrative).

**Notebook plan:**
- Family: F14 Ranking/Retrieval/RecSys
- Concept built once (D1): `ann_candidates_then_exact()`; verify exact distances 0.100, 0.141, 0.900 and candidate-restricted $\arg\min_{i\in C(q)}\|x_i-q\|_2$.
- Datasets D1–D5: D1 six lesson 2D points · D2 clean clustered vectors · D3 +overlap/ties · D4 sklearn 20newsgroups SVD vectors · D5 sparse/long-tail clusters with too-few probes
- Metric: recall@1 versus exact search
- Closing viz: (a) candidate regions/neighbor panels (b) recall@1-vs-complexity curve
- Pitfall on D5: using too few probes; reproduce missing the true nearest cluster, then increase probes/candidates.
- Notes: delete dead template helpers; implement tiny NumPy ANN simulation rather than requiring FAISS.

### 16.6 — Hybrid retrieval & re-ranking   [notebook: 16.6-hybrid-retrieval.ipynb]   (family: F14)

**Lesson — Real World Applications (5):**
1. Production web/app search — with $\alpha=0.5$, lesson fusion gives $d_1=0.450$ from BM25-heavy evidence.
2. Semantic FAQ retrieval — dense-heavy $d_2$ rises to $0.550$, admitted despite low sparse score.
3. Balanced candidate generation — $d_3$ also scores $0.550$, preserving lexical+dense mixed evidence.
4. Low-evidence filtering — $d_4=0.200$ falls behind because both sparse and dense scores are weak.
5. Query-adaptive weighting — exact-code queries can raise sparse weight above the lesson's illustrative $\alpha=0.5$.

**Notebook plan:**
- Family: F14 Ranking/Retrieval/RecSys
- Concept built once (D1): `hybrid_fuse_and_rerank()`; verify $s_h=\alpha s_b+(1-\alpha)s_e$ with lesson scores $[0.450,0.550,0.550,0.200]$.
- Datasets D1–D5: D1 four lesson score vectors · D2 clean lexical+semantic docs · D3 +scale mismatch/synonyms/ties · D4 sklearn 20newsgroups subset · D5 exact-id plus vague semantic long-tail queries
- Metric: candidate recall@5
- Closing viz: (a) sparse/dense/hybrid ranked slates (b) recall@5-vs-complexity curve
- Pitfall on D5: averaging raw scores; reproduce larger-range score domination, then min-max/z-score normalize before fusion.
- Notes: delete dead template helpers; measure candidate recall before any re-ranker.

### 16.7 — Cross-encoders vs bi-encoders   [notebook: 16.7-cross-vs-bi-encoders.ipynb]   (family: F14)

**Lesson — Real World Applications (5):**
1. First-stage semantic retrieval — lesson bi-encoder cosines rank $d_1=0.994>d_2=0.707>d_3=0.000$.
2. Search re-ranking — cross-encoder scores $[0.62,0.88,0.10]$ flip the top order to $d_2>d_1>d_3$.
3. Large-corpus serving — with $N=1{,}000{,}000,d=2$, bi-encoder retrieval compares $2{,}000{,}000$ coordinates after precompute.
4. Shortlist scoring — scoring only top 100 costs 100 cross-encoder passes instead of 1,000,000.
5. Latency-quality tradeoff — the lesson shortlist cuts cross-encoder passes by $1{,}000{,}000/100=10{,}000\times$.

**Notebook plan:**
- Family: F14 Ranking/Retrieval/RecSys
- Concept built once (D1): `bi_retrieve_then_cross_rerank()`; verify bi cosines 0.994/0.707/0.000, cross scores 0.62/0.88/0.10, and 10,000x pass reduction.
- Datasets D1–D5: D1 three lesson vectors/pair scores · D2 clean synthetic query-doc pairs · D3 +hard negatives/ties · D4 sklearn 20newsgroups subset with tiny lexical pair scorer · D5 true-best document below a small bi cutoff
- Metric: NDCG@3
- Closing viz: (a) before/after reranked slates (b) NDCG@3-vs-complexity/cutoff curve
- Pitfall on D5: using a bi-encoder cutoff that is too small; reproduce missed best doc, then raise cutoff/measure recall.
- Notes: delete dead template helpers; simulate cross scores with transparent features, no transformer download.

### 16.8 — Retrieval evaluation   [notebook: 16.8-retrieval-evaluation.ipynb]   (family: F14)

**Lesson — Real World Applications (5):**
1. Search UI quality at top 3 — relevance $[1,0,1,1,0]$ gives $P@3=0.667$.
2. Candidate completeness — the same list gives $R@3=0.667$ with 3 relevant docs total.
3. Full-list recall auditing — at top 5, $P@5=0.600$ but $R@5=1.000$.
4. Rank-sensitive evaluation — lesson $DCG@5=1.931$, $IDCG@5=2.131$, so $nDCG@5=0.906$.
5. Mean average precision reporting — relevant ranks 1,3,4 yield $AP=(1.000+0.667+0.750)/3=0.806$.

**Notebook plan:**
- Family: F14 Ranking/Retrieval/RecSys
- Concept built once (D1): `retrieval_metrics()`; verify P@3/R@3 0.667, P@5 0.600, R@5 1.000, nDCG 0.906, AP 0.806.
- Datasets D1–D5: D1 lesson ranked list · D2 clean multi-query labels · D3 +ties/incomplete judgments · D4 sklearn 20newsgroups query-label subset · D5 rare-query slices and long-tail relevance
- Metric: nDCG@5
- Closing viz: (a) per-query ranked-list metric panels (b) nDCG@5-vs-complexity curve
- Pitfall on D5: averaging queries without looking at slices; reproduce good mean hiding rare-query failure, then add slice metrics.
- Notes: delete dead template helpers; choose cutoff $k$ to match the displayed/consumed result window.
