# Module Plan — M6 · RecSys landscape (CF/MF → two-tower → sequential & generative)

| Field | Value |
|---|---|
| Domain | Domain 1 · Core: Ranking & Evaluation |
| Skip if you can already… | contrast CF vs two-tower vs generative rec and pick per use-case |
| Maps to (projects) | all |
| Primary structure(s) | S5 Concept / Framework + Decision guide |
| Example type | 💻 Colab |
| Sub-lessons | 2 |
| Notebooks | 2 |

## Module hub (the "complete list")
Recommendation systems are a staged decision problem: retrieve a manageable candidate set, rank it,
then serve and learn from feedback. This module gives the map from classic collaborative filtering
and matrix factorization through two-tower retrieval, sequence-aware models, and generative retrieval,
with a practical "which one would I pick?" lens.

- M6.1 · The recommendation problem & the funnel (CF, MF, latent factors)
- M6.2 · Modern recommenders — two-tower, sequential, generative + when to use which

## Questions this module answers (→ which sub-lesson teaches the answer)
- What is the recommendation problem, and why is it usually organized as a retrieval→ranking funnel? → M6.1
- How does collaborative filtering work, and where does it fail (cold-start, sparsity)? → M6.1
- What is matrix factorization, and what are latent factors? → M6.1
- Why are two-tower recommenders scalable for retrieval? → M6.2
- When do sequential recommenders such as SASRec/BERT4Rec matter? → M6.2
- What changes with generative recommenders such as TIGER/HSTU? → M6.2
- How do you pick CF vs MF vs two-tower vs sequential vs generative retrieval for a use-case? → M6.1, M6.2

_Every question maps to a sub-lesson (coverage confirmed below)._

## Concepts (ƒ = genuine, central formula)
- User–item interaction matrix
- Retrieval→ranking funnel
- Collaborative filtering (neighborhoods) **ƒ**
- Sparsity & cold-start
- Matrix factorization **ƒ**
- Latent factors
- Two-tower
- Sequential recs
- Generative retrieval
- Selection per use-case

## Sub-lessons

### M6.1 · The recommendation problem & the funnel (CF, MF, latent factors)  —  [S5 Concept + Decision, 💻]
- **Makes answerable:** recommendation problem + retrieval→ranking funnel; CF how it works & where it fails (cold-start, sparsity); MF & latent factors; the classic side of the use-case decision.
- **You'll be able to say:** "A recommender starts from a huge catalog, retrieves plausible candidates, then ranks a smaller set. CF uses similar users/items from the interaction matrix, but sparsity and new users/items break it. MF compresses the matrix into user/item latent factors so a dot product can score affinity, but it still needs interaction history unless content or priors are added."
- **Concepts:** user–item interaction matrix, retrieval→ranking funnel, collaborative filtering (neighborhoods) **ƒ**, sparsity & cold-start, matrix factorization **ƒ**, latent factors, selection per use-case.
- **Key Idea focus:** vocabulary + structure — the funnel, the interaction matrix, and the first decision boundary between memory-based CF and latent-factor models.
- **Worked-example shape:** small illustrative cases — build a tiny user×item matrix, compute a neighborhood score, factor it into latent vectors, then identify the cold-start row/column that cannot be learned from interactions alone.
- **Notebook:** Yes — synthetic user×item implicit ratings; item-item CF vs low-rank MF; signature viz = matrix heatmap plus 2D latent-factor plot; genuine metric/assert = `assert` held-out recall@k beats popularity on dense users and fails on a new item. Break case = all-zero new-item column.
- **Real numbers to cite:** 10,000 users × 100,000 items is 1B possible pairs; at 0.1% observed, the matrix is 99.9% sparse. A new item with zero interactions has no CF neighbors.

### M6.2 · Modern recommenders — two-tower, sequential, generative + when to use which  —  [S5 Concept + Decision, 💻]
- **Makes answerable:** why two-tower is scalable; sequential recs when order matters; generative recs what changes; how to pick per use-case across the modern options.
- **You'll be able to say:** "Two-tower retrieval is scalable because user/query and item embeddings are computed separately and searched by nearest neighbor. Sequential models help when the order of recent actions changes intent, not just the bag of past actions. Generative retrieval turns recommendation into producing item IDs/tokens or structured identifiers, which can unify retrieval with sequence modeling but raises serving, control, and evaluation complexity."
- **Concepts:** two-tower, sequential recs, generative retrieval, retrieval→ranking funnel, selection per use-case.
- **Key Idea focus:** compare modern model families by serving shape, signal requirements, and failure modes.
- **Worked-example shape:** small illustrative cases — same user history under bag-of-items vs ordered sequence; precompute item embeddings for two-tower ANN; sketch how a generative model emits item codes.
- **Notebook:** Yes — small item catalog with content/category features; two-tower-style embedding retrieval plus an ordered-session heuristic/model toy; signature viz = nearest-neighbor retrieval table and sequence-position attention/score table; genuine assert/metric = `assert` candidate retrieval latency/scoring count is lower than scoring all items and ordered session recovers a different next item than bag history. Break case = shuffled sequence where order no longer helps.
- **Real numbers to cite:** ranking 1M items directly is 1M scores per request; two-tower retrieval can precompute item vectors and retrieve top 100–1000 candidates before ranking.

## Coverage check
All 7 module questions map to a sub-lesson: funnel, CF failures, MF/latent factors → M6.1; two-tower, sequential, generative retrieval → M6.2; use-case selection → both through the decision guide. No gaps.

## Decision guide (only if the module has a when-to-pick-X-vs-Y)
| Situation | Prefer | Why |
|---|---|---|
| Small catalog, dense interactions, explainability matters | Neighborhood CF | Similar-user/item reasoning is transparent and quick to baseline. |
| Dense enough interaction history, need compact personalization | Matrix factorization | Latent factors generalize beyond exact neighbors. |
| Large catalog retrieval with content/user features and ANN serving | Two-tower | Separately encodes users/items, precomputes item vectors, scales retrieval. |
| Recent ordered behavior changes intent | Sequential recs | SASRec/BERT4Rec-style models use order and context windows. |
| Need sequence-native retrieval or item-code generation research path | Generative retrieval | Emits item/code tokens directly, but needs careful serving/eval controls. |
| New users/items dominate | Hybrid/content + priors first | Pure interaction CF/MF has little or no signal. |

## Resources (from the guide)
- Google — Recommendation Systems course (CF, MF, retrieval+ranking)
- Microsoft Recommenders (reference implementations across algorithms)
- Aggarwal — Recommender Systems (the comprehensive textbook)

## SOTA papers (from the guide)
- Deep Neural Networks for YouTube Recommendations (Covington et al., 2016)
- SASRec (Kang & McAuley, 2018)
- BERT4Rec (Sun et al., 2019)
- TIGER: Generative Retrieval (Rajput et al., 2023)
- HSTU (Zhai et al., 2024)

## Notes / caveats
- Keep this module a landscape and decision guide, not a deep implementation of every architecture.
- The genuine formulas are CF neighborhood scoring and MF dot-product/objective; do not force math for "generative retrieval" beyond prose and model shape.
