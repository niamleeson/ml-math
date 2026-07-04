# M6 · RecSys landscape
> **Domain:** Domain 1 · Core: Ranking & Evaluation · **Maps to:** all · **Skip if you can already…** contrast CF vs two-tower vs generative rec and pick per use-case

## Overview

Recommendation systems are not one model. They are a staged product decision: start with a huge catalog, retrieve a manageable candidate set, rank those candidates, then serve, log feedback, and learn again. The right model family depends on what signal exists, how large the catalog is, how much latency you can spend, and whether recent sequence order matters.

**By the end you can answer:**
- What is the recommendation problem, and why is it usually organized as a retrieval→ranking funnel?
- How does collaborative filtering work, and where does it fail (cold-start, sparsity)?
- What is matrix factorization, and what are latent factors?
- Why are two-tower recommenders scalable for retrieval?
- When do sequential recommenders such as SASRec/BERT4Rec matter?
- What changes with generative recommenders such as TIGER/HSTU?
- How do you pick CF vs MF vs two-tower vs sequential vs generative retrieval for a use-case?

Two sub-lessons:

- **M6.1 The recommendation problem & the funnel** — CF, MF, latent factors, and the classic failure modes.
- **M6.2 Modern recommenders** — two-tower, sequential, generative, and the decision guide.

---

## M6.1 · The recommendation problem & the funnel

**The idea.** A recommender maps a user, context, or request to a small ordered set of items from a much larger catalog. Production systems usually split that into a **retrieval→ranking funnel**:

1. **Retrieval:** find hundreds or thousands of plausible candidates quickly.
2. **Ranking:** score those candidates with richer features and a more expensive model.
3. **Serving controls:** apply policy, diversity, freshness, budgets, and business rules.
4. **Feedback loop:** log exposure and outcomes so future training knows what was actually shown.

The funnel exists because scoring everything is too expensive. Ranking 1M items directly is 1M model calls per request; retrieving top 100–1000 candidates first lets the ranker spend effort only where it matters.

The mental model is a set of narrowing gates:

| Stage | Typical size | Main question |
|---|---:|---|
| Catalog | 10k–1B items | What could ever be shown? |
| Retrieval | 100–10k candidates | What is plausibly relevant now? |
| Ranking | 10–1k candidates | What order maximizes expected value? |
| Serving | final slate | What policy, diversity, and pacing constraints apply? |

A model family belongs where its serving cost fits. CF/MF can be retrieval baselines; a cross-feature neural ranker usually belongs after retrieval.


**Collaborative filtering.** CF uses the user–item interaction matrix: rows are users, columns are items, and entries are clicks, watches, saves, purchases, or ratings. If two users behaved similarly, recommend what one liked to the other. If two items were consumed by similar users, recommend neighboring items.

A genuine item-neighborhood score is a weighted average over similar items the user has already interacted with:

$$\text{score}(u, i)=\sum_{j\in I(u)} \text{sim}(i,j)\,r_{u,j}.$$

This is powerful when interactions are dense enough, but the failure mode is immediate: a new item with zero interactions has no neighbors, and a new user has no history.

**Matrix factorization.** MF compresses the same interaction matrix into latent vectors. Each user gets a vector $p_u$, each item gets a vector $q_i$, and affinity is usually a dot product:

$$\hat r_{u,i}=p_u^\top q_i.$$

The coordinates are **latent factors**: not hand-labeled concepts, but learned dimensions that often behave like taste, topic, price sensitivity, seniority, or style. MF generalizes beyond exact neighbors, but it still learns from interaction history; pure MF cannot infer much about an all-zero new item without content features or priors.

| Family | Uses | Strength | Main break |
|---|---|---|---|
| Popularity | Global/item counts | Strong cold baseline | Not personalized |
| Neighborhood CF | Similar users/items | Explainable, simple | Sparse matrix, cold-start |
| Matrix factorization | Latent user/item vectors | Compact personalization | Needs interactions |
| Hybrid/content | Metadata + interactions | Handles new items better | Feature quality matters |

**Worked example — tiny matrix to product scale.** Suppose a Creator Marketplace user interacted with creators A and B. Item-item CF sees that creator C is frequently saved by users who saved A and B, so C becomes a candidate. MF instead places the user near creators A, B, and C in latent space, so the dot product with C is high.

Now scale the same idea. With **10,000 users × 100,000 items**, there are **1B possible pairs**. At **0.1% observed**, the matrix is **99.9% sparse**. For dense users, CF/MF can beat a popularity baseline on held-out recall@k. For a newly launched creator or Event Ad with zero interactions, the item column is all zeros; pure CF has no evidence, and pure MF has no reliable item vector.

```python
observed_pairs = 1_000_000
all_pairs = 10_000 * 100_000
sparsity = 1 - observed_pairs / all_pairs
assert round(sparsity, 3) == 0.999
```

**Decision checkpoint.** If the catalog is small, interaction history is reasonably dense, and explainability matters, start with neighborhood CF. If you have enough interactions and need compact personalization, MF is the classic next step. If new users/items dominate, add content features and priors before trusting interaction-only models.

Ask these checks before choosing CF or MF:

- Are there enough repeated users and items for similarity to mean anything?
- Are new items important enough that metadata must enter the model?
- Does the product need explanations like "because you saved A"?
- Is the first goal retrieval recall, final ranking quality, or cold-start coverage?


**You'll be able to say:** *"A recommender retrieves plausible candidates from a huge catalog, ranks a smaller set, serves with controls, and learns from logged feedback. CF uses similar users/items in the interaction matrix but breaks under sparsity and cold-start. MF learns user/item latent factors and scores with a dot product, which generalizes better than exact neighbors but still needs interaction evidence unless content or priors are added."*

---

## M6.2 · Modern recommenders — two-tower, sequential, generative + when to use which

**The idea.** Modern recommenders keep the funnel but change how candidates are represented and retrieved. The practical question is not "Which architecture is newest?" It is: **what must be computed online, what can be precomputed, and what signal does the model need?**

**Two-tower retrieval.** A two-tower model encodes the user/query/context on one side and the item on the other side. The item vectors can be precomputed; online serving computes the user vector and performs approximate nearest-neighbor search. That is why two-tower systems scale for large retrieval.

```python
user_vec = user_tower(user_features)
item_vecs = load_precomputed_item_vectors()
candidates = ann_search(user_vec, item_vecs, k=500)
```

The price of scalability is that the two sides interact late, usually through a dot product or similarity. Cross features that require seeing the exact user and item together are often left to the downstream ranker.

That split creates a clean engineering contract:

- Item tower runs offline or asynchronously and writes item vectors.
- User tower runs online using fresh request/session features.
- ANN search returns candidates, not the final slate.
- Ranker reranks with exact crosses, calibration, and business features.


**Sequential recommenders.** SASRec/BERT4Rec-style models matter when **order** changes intent. A member who viewed "wedding photographer", then "event venue", then "catering" is not just a bag of categories; the recent sequence says something about next intent. Sequential models can use recency, position, and context windows. If shuffling the history does not change the right recommendation, a simpler bag-of-items model may be enough.

**Generative retrieval.** Generative recommenders such as TIGER/HSTU change retrieval from "search nearest item vectors" to "produce item identifiers, codes, or tokens." This can unify sequence modeling and retrieval, and it can represent structured item IDs. It also raises harder questions: how do you constrain outputs to valid items, control diversity and policy, evaluate missed candidates, and serve with low latency?

| Use-case signal | Prefer | Why |
|---|---|---|
| Large catalog, content/user features, ANN serving | Two-tower | Precompute item vectors and retrieve top candidates cheaply |
| Recent ordered behavior changes intent | Sequential recs | Order and context window matter |
| Sequence-native retrieval or item-code research path | Generative retrieval | Emits item/code tokens directly |
| Need rich exact crosses | Retrieve first, then cross-feature ranker | Ranking can spend expensive features on fewer items |
| New items dominate | Hybrid/content + priors | Pure interaction signals are missing |

**Worked example — one history, three model shapes.** A user recently viewed `data science course → ML interview prep → AI tutor`. A bag-of-items model retrieves broadly educational content. A sequential model notices the transition toward tutoring and ranks math-tutor or interview-practice items higher. A two-tower system precomputes item vectors and retrieves 500 candidates from a 1M-item catalog before the ranker scores them. A generative system might emit structured item codes for "AI tutoring" directly, then validate and rerank the generated candidates.

The serving win is concrete: scoring **1M** items directly means **1M** scores per request. Two-tower retrieval can precompute item vectors and retrieve **top 100–1000** candidates before ranking. The sequential or generative component is worth the extra complexity only when it recovers candidates the simpler funnel misses.

A useful break test is to shuffle history order. If quality barely changes, sequence modeling is probably not the bottleneck. If the next item changes from "generic education" to "AI interview practice" only when order is preserved, sequential modeling is carrying real signal.


**Decision checkpoint.** Pick the simplest family that matches the product constraint:

- **Neighborhood CF:** dense, small-ish, explainable baseline.
- **MF:** enough interactions and compact personalization.
- **Two-tower:** large-catalog retrieval with ANN and side features.
- **Sequential:** recent order changes next action.
- **Generative:** sequence-native retrieval research path with strong serving/eval controls.

**You'll be able to say:** *"Two-tower retrieval scales because item embeddings are precomputed and searched by nearest neighbor. Sequential recommenders matter when ordered recent actions change intent. Generative retrieval emits item IDs or codes directly, which can unify retrieval with sequence modeling but adds serving, validity, and evaluation complexity. I pick the model family from catalog size, available signal, latency, cold-start pressure, and whether order matters."*

---

## Resources
- Google — Recommendation Systems course (CF, MF, retrieval+ranking)
- Microsoft Recommenders (reference implementations across algorithms)
- Aggarwal — Recommender Systems (the comprehensive textbook)

## Papers
- Deep Neural Networks for YouTube Recommendations (Covington et al., 2016)
- SASRec (Kang & McAuley, 2018)
- BERT4Rec (Sun et al., 2019)
- TIGER: Generative Retrieval (Rajput et al., 2023)
- HSTU (Zhai et al., 2024)
