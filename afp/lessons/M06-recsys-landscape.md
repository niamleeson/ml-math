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

<p class="cur-colab"><a class="cur-colab-btn" href="https://colab.research.google.com/github/niamleeson/ml-math/blob/main/afp/notebooks/M06-recsys-landscape.ipynb" target="_blank" rel="noopener">▶ Open the runnable notebook (20 examples + visualizations) in Google Colab</a></p>

---

## M6.1 · The recommendation problem & the funnel

<p class="cur-colab"><a class="cur-colab-btn" href="https://colab.research.google.com/github/niamleeson/ml-math/blob/main/afp/notebooks/M06-recsys-landscape.ipynb" target="_blank" rel="noopener">▶ Open the runnable notebook (20 examples + visualizations) in Google Colab</a></p>

**The idea.** A recommender maps a user, context, or request to a small ordered set of items from a much larger catalog.

**Everyday analogy.** Imagine walking into a giant bookstore and asking a clerk what to read next. They first pull one shelf of plausible books from millions of options, then sort that small pile by what seems best for you, then remove anything unavailable or inappropriate. Collaborative filtering is the clerk saying "people who liked what you liked also liked this," while matrix factorization is the clerk discovering hidden taste dimensions like mystery fan, romance reader, or beginner-friendly nonfiction.

Production systems usually split that into a **retrieval→ranking funnel**:

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

All code below mirrors the runnable notebook. Its setup creates `R`, a **200×120** implicit user-item matrix over **5 genres** with **86.5% sparsity**: each user prefers 1–2 genres, and observed interactions are sampled from `(genre affinity × item popularity)`.

```python
interactions = R.sum()
sparsity = 1 - interactions / R.size
print(f"interactions: {interactions}  |  matrix {R.shape}  |  sparsity {sparsity:.1%}")
```

→ output/result (notebook #1): `interactions: 3245  |  matrix (200, 120)  |  sparsity 86.5%`.

**Collaborative filtering — user-user (notebook #3).** User-user CF asks: "which other users have a similar row in `R`, and what did they interact with that this user has not seen?"

```python
from sklearn.metrics.pairwise import cosine_similarity

user_sim = cosine_similarity(R)            # 200x200, cosine of interaction rows
np.fill_diagonal(user_sim, 0)              # a user is not their own neighbor

u = 0
scores = user_sim[u] @ R                   # weighted vote: sum_v sim(u,v) * R[v,i]
scores[R[u] == 1] = -np.inf                # don't re-recommend seen items
recs = np.argsort(-scores)[:5]
print("user 0 fav genres:", [genres[g] for g in np.where(user_pref[0] > 0.2)[0]])
print("user-user CF recommends items:", recs.tolist(),
      "| their genres:", [genres[item_genre[i]] for i in recs])
```

→ output/result: user 0 likes `tech`; user-user CF recommends `[103, 32, 119, 111, 110]` with genres `['tech', 'tech', 'tech', 'travel', 'cooking']`.

Step by step:

1. A row of `R` is a user's behavior vector.
2. `cosine_similarity(R)` compares row **direction**, not raw length: two users are close if their clicks point toward the same items.
3. That matters because a hyper-active user should not dominate only because they clicked more; cosine normalizes away magnitude.
4. `user_sim[u] @ R` is a weighted neighbor vote for every item.
5. Already-seen items are masked so retrieval returns new candidates.

**Collaborative filtering — item-item (notebook #4).** Item-item CF asks: "which items were consumed by similar users, and how similar are they to the items this user already liked?"

The real score is:

$$\text{score}(u, i)=\sum_{j\in I(u)} \text{sim}(i,j)\,r_{u,j}.$$

In the notebook's implicit matrix, `r_{u,j}=1` for liked items, so the one-line score is `item_sim[:, liked].sum(1)`.

```python
item_sim = cosine_similarity(R.T)          # 120x120 item-item cosine
np.fill_diagonal(item_sim, 0)

u = 0
liked = np.where(R[u] == 1)[0]             # I(u): items the user interacted with
score_i = item_sim[:, liked].sum(1)        # sum_j sim(i,j) for j in I(u)
score_i[R[u] == 1] = -np.inf
recs = np.argsort(-score_i)[:5]
print("item-item CF recommends:", recs.tolist(),
      "| genres:", [genres[item_genre[i]] for i in recs])
```

→ output/result: item-item CF recommends `[103, 32, 119, 44, 82]`, all `tech`.

**Cold-start is not abstract — it is an all-zero column (notebook #6).** A brand-new item has no interactions, so its item vector in `R.T` is all zeros. Its cosine similarity to every existing item is 0; CF cannot rank it above anything.

```python
R_cold = np.hstack([R, np.zeros((n_users, 1), dtype=int)])   # append an all-zero new item
new_id = R_cold.shape[1] - 1
sims_to_new = cosine_similarity(R_cold.T)[new_id]
print(f"new item {new_id}: interactions={R_cold[:,new_id].sum()}, "
      f"max similarity to any item={np.nan_to_num(sims_to_new).max():.3f}")
```

→ output/result: `new item 120: interactions=0, max similarity to any item=0.000`. Pure CF gives it score 0 everywhere; it needs content features or priors.

**Matrix factorization.** MF compresses the same interaction matrix into latent vectors. Each user gets a vector $p_u$, each item gets a vector $q_i$, and affinity is usually a dot product:

$$\hat r_{u,i}=p_u^\top q_i.$$

The coordinates are **latent factors**: not hand-labeled concepts, but learned dimensions. The concrete learning rule in the notebook is BPR-SGD: sample a positive item `i` the user interacted with, sample an unseen item `j` as a negative, and update `P[u]`, `Q[i]`, and `Q[j]` so `score(u,i)` is greater than `score(u,j)`.

```python
K = 16
P = rng.normal(0, 0.1, (n_users, K))
Q = rng.normal(0, 0.1, (n_items, K))
pos = np.argwhere(R == 1)
lr, reg, epochs = 0.05, 0.02, 30
losses = []
for ep in range(epochs):
    rng.shuffle(pos)
    tot = 0.0
    for u, i in pos:
        j = rng.integers(n_items)             # a random negative item
        while R[u, j] == 1: j = rng.integers(n_items)
        diff = P[u] @ (Q[i] - Q[j])           # want score(u,i) > score(u,j)
        sig = 1/(1+np.exp(diff))
        P[u] += lr*(sig*(Q[i]-Q[j]) - reg*P[u])
        Q[i] += lr*(sig*P[u] - reg*Q[i])
        Q[j] += lr*(-sig*P[u] - reg*Q[j])
        tot += -np.log(1/(1+np.exp(-diff)))
    losses.append(tot/len(pos))
print("final BPR loss:", round(losses[-1], 3))
```

→ output/result (notebook #7): `final BPR loss: 0.145`.

Why the negative sample? In implicit feedback we mostly know what the user touched, not every item they disliked. A sampled unseen `j` gives the optimizer a local comparison: "make this observed item rank above this plausible non-observed item." Repeating that comparison across users creates the latent space.

**Latent factors become visible even without labels (notebook #8).**

```python
from sklearn.decomposition import PCA

Q2 = PCA(2).fit_transform(Q)
for g in range(n_genres):
    m = item_genre == g
    plt.scatter(Q2[m,0], Q2[m,1], s=22, label=genres[g])
```

→ output/result: the learned item vectors cluster by genre, even though the MF training loop never used `item_genre`.

**The payoff is measurable personalization, not a vibe (notebook #9).**

```python
def fav_share(score_fn):
    shares = []
    for u in range(n_users):
        fav = user_pref[u].argmax()
        s = np.asarray(score_fn(u), dtype=float); s[R[u] == 1] = -1e9
        top = np.argsort(-s)[:10]
        shares.append(np.mean(item_genre[top] == fav))
    return np.mean(shares)

mf_share   = fav_share(lambda u: P[u] @ Q.T)
pop_share  = fav_share(lambda u: R.sum(0))
rand_base  = np.mean([np.mean(item_genre == user_pref[u].argmax()) for u in range(n_users)])
print(f"fav-genre share in top-10 — MF {mf_share:.2f}  vs  popularity {pop_share:.2f}  vs  random {rand_base:.2f}")
```

→ output/result: `MF 0.54  vs  popularity 0.07  vs  random 0.20`. MF learns each user's taste instead of just returning globally popular items.

**CF vs MF as a recall@10 number (notebook #12).** With a leave-one-out split (`Rtr`, `test`), every model must recover the held-out item in its top 10.

```python
usim = cosine_similarity(Rtr); np.fill_diagonal(usim, 0)
isim = cosine_similarity(Rtr.T); np.fill_diagonal(isim, 0)
P, Q = train_mf(Rtr)
scorers = {
  "popularity": lambda u,Rt: Rt.sum(0).astype(float),
  "user-CF":    lambda u,Rt: usim[u] @ Rt,
  "item-CF":    lambda u,Rt: isim[:, np.where(Rt[u]==1)[0]].sum(1),
  "MF":         lambda u,Rt: P[u] @ Q.T,
}
res = {name: recall_at_k(fn, Rtr, test, 10) for name, fn in scorers.items()}
print({k: round(v,3) for k,v in res.items()})
```

→ output/result:

| Model | leave-one-out recall@10 |
|---|---:|
| Popularity | 0.275 |
| User-CF | 0.67 |
| Item-CF | 0.745 |
| MF | 0.71 |

| Family | Uses | Strength | Main break |
|---|---|---|---|
| Popularity | Global/item counts | Strong cold baseline | Not personalized |
| Neighborhood CF | Similar users/items | Explainable, simple; user-CF recall@10 `0.67`, item-CF `0.745` here | Sparse matrix, cold-start |
| Matrix factorization | Latent user/item vectors | Compact personalization; recall@10 `0.71`, fav-genre share `0.54` | Needs interactions |
| Hybrid/content | Metadata + interactions | Handles new items better | Feature quality matters |

**Worked example — tiny matrix to product scale.** Suppose a Creator Marketplace user interacted with creators A and B. Item-item CF scores creator C by summing `sim(C,A) + sim(C,B)`, so C becomes a candidate if it co-occurs with A and B across users. MF instead places the user vector near creator vectors A, B, and C in latent space, so $p_u^\top q_C$ is high even if exact neighbor overlap is imperfect.

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

**Everyday analogy.** A two-tower recommender is like a dating app that writes one profile summary for the member and one profile summary for each possible match, then quickly finds nearby summaries. Sequential recommendation is like noticing that someone searched "running shoes," then "10K training," then "hydration belt" — the order changes what they probably want next. Generative retrieval is closer to autocomplete: given the recent sequence, the system proposes the next item or item code directly, then serving checks that the suggestion is valid and safe.

**Two-tower retrieval (notebook #15).** A two-tower model encodes the user/query/context on one side and the item on the other side. In the notebook, `Uf = user_pref.copy()` is the user tower input, `If` is one-hot item genre plus log-popularity, and the learned towers are `Wu` and `Wi`.

The serving contract is concrete:

1. **Offline/asynchronous:** run the item tower for every item and store `item_emb = If @ Wi`.
2. **Online:** run one user tower pass, `(Uf[u] @ Wu)`.
3. **Retrieval:** dot that user vector against precomputed item vectors, usually through ANN.
4. **Ranking:** rerank the returned candidates with richer features.

```python
item_emb = If @ Wi                                           # precompute ALL item vectors offline
def tt_score(u, Rt): return (Uf[u]@Wu) @ item_emb.T          # online: one user vector + dot products
print("two-tower recall@10:", round(recall_at_k(tt_score, Rtr, test, 10), 3))
print("item vectors are precomputed once; serving = 1 user-tower pass + a dot-product scan")
```

→ output/result: `two-tower recall@10: 0.77`. In the same leave-one-out bake-off, this beats popularity `0.275`, user-CF `0.67`, item-CF `0.745`, and MF `0.71`.

The price of scalability is that the two sides interact late, usually through a dot product or similarity. Cross features that require seeing the exact user and item together are often left to the downstream ranker.

**ANN makes the two-tower contract serveable (notebook #16).** The notebook clusters `item_emb`, probes only the nearest clusters, and compares against brute-force top-10 retrieval.

| `nprobe` nearest clusters | Recall vs brute top-10 | Avg items scanned of 120 |
|---:|---:|---:|
| 1 | 0.72 | 12.70 |
| 2 | 0.94 | 28.48 |
| 4 | 0.93 | 54.28 |
| 8 | 1.00 | 120.00 |

That is the retrieval tradeoff in miniature: scan far fewer items, keep most of the candidates the exact dot-product search would have found.

**Sequential recommenders (notebook #17).** SASRec/BERT4Rec-style models matter when **order** changes intent. The notebook uses a first-order Markov model over genres: predict the next genre from the last genre. Then it runs the break test: shuffle each session and see whether accuracy drops.

```python
trans = np.array([[.5,.2,.1,.1,.1],[.1,.5,.2,.1,.1],[.1,.1,.5,.2,.1],[.1,.1,.1,.5,.2],[.2,.1,.1,.1,.5]])
sessions = []
for _ in range(600):
    g = rng.integers(n_genres); seq=[g]
    for _ in range(5): g = rng.choice(n_genres, p=trans[g]); seq.append(g)
    sessions.append(seq)

def next_acc(seqs):
    P = np.ones((n_genres,n_genres))                # add-1 smoothed transitions
    for s in seqs:
        for a,b in zip(s[:-1], s[1:]): P[a,b]+=1
    P /= P.sum(1,keepdims=True)
    hits=tot=0
    for s in seqs:
        for a,b in zip(s[:-1], s[1:]):
            if P[a].argmax()==b: hits+=1
            tot+=1
    return hits/tot

ordered = next_acc(sessions)
shuffled = next_acc([list(rng.permutation(s)) for s in sessions])
print(f"next-genre accuracy — ordered: {ordered:.2f}   shuffled: {shuffled:.2f}")
```

→ output/result: `next-genre accuracy — ordered: 0.49   shuffled: 0.35`.

Why this proves sequence signal: if shuffling history does not hurt, a bag-of-items model is probably enough. Here shuffling drops accuracy by 0.14, so "what happened last" carries intent. A member who viewed `running shoes → 10K training → hydration belt` is different from the same items in random order.

**Generative retrieval (notebook #18).** Generative recommenders such as TIGER/HSTU change retrieval from "nearest item vectors" to "produce item identifiers, codes, or tokens." The notebook makes that concrete with **semantic IDs**: each item vector gets a two-level residual clustering code `(coarse, fine)`. Similar items share a coarse prefix.

```python
from sklearn.cluster import KMeans

c1 = KMeans(6, n_init=5, random_state=0).fit(item_emb)
codebook1 = c1.labels_
resid = item_emb - c1.cluster_centers_[codebook1]           # residual quantization
c2 = KMeans(4, n_init=5, random_state=1).fit(resid)
codebook2 = c2.labels_
codes = pd.DataFrame({"item":range(n_items), "genre":[genres[g] for g in item_genre],
                      "code":[f"({a},{b})" for a,b in zip(codebook1, codebook2)]})
print("example semantic IDs:\n", codes.head(8).to_string(index=False))
g0 = codebook1[0]
print(f"\ngenerating coarse code {g0} retrieves items:",
      np.where(codebook1==g0)[0][:8].tolist(),
      "| dominant genre:", codes[codebook1==g0].genre.mode()[0])
```

→ output/result:

```text
example semantic IDs:
  item   genre  code
    0    tech (4,0)
    1  travel (0,3)
    2  travel (0,1)
    3 fitness (2,2)
    4 fitness (2,2)
    5 finance (3,0)
    6    tech (4,2)
    7  travel (5,3)

generating coarse code 4 retrieves items: [0, 6, 9, 17, 22, 32, 35, 40] | dominant genre: tech
```

That is the retrieval shift: a sequence model can generate `4` as the next coarse semantic group, and serving expands that prefix to many valid items before ranking. This unifies sequence modeling and retrieval because the same model that reads history can emit retrieval codes. The hard parts move to validity (only legal codes/items), diversity (not one collapsed code forever), evaluation (missed candidates are hard to see), and low-latency serving.

**Cold-start with content/two-tower features (notebook #20).** CF saw the new item as an all-zero column. A content tower can embed it on day one from genre/popularity features:

```python
new_feat = np.zeros(n_genres+1); new_feat[2] = 1; new_feat[-1] = 0.0   # new fitness item
new_item_emb = new_feat @ Wi
scores = np.array([(Uf[u]@Wu) @ new_item_emb for u in range(n_users)])
top_users = np.argsort(-scores)[:10]
frac = np.mean([user_pref[u,2] > 0.2 for u in top_users])
print(f"{frac:.0%} of its top-10 users are fitness fans")
```

→ output/result: `100% of its top-10 users are fitness fans`.

| Use-case signal | Prefer | Why |
|---|---|---|
| Large catalog, content/user features, ANN serving | Two-tower | Precompute item vectors; notebook recall@10 `0.77`; ANN gets `0.94` recall vs brute while scanning `28.48/120` items |
| Recent ordered behavior changes intent | Sequential recs | Shuffle test drops next-genre accuracy from `0.49` to `0.35` |
| Sequence-native retrieval or item-code research path | Generative retrieval | Emits coarse/fine semantic ID tokens, then expands a valid item group |
| Need rich exact crosses | Retrieve first, then cross-feature ranker | Ranking can spend expensive features on fewer items |
| New items dominate | Hybrid/content + priors | Pure CF sees an all-zero column; content/two-tower matched a new fitness item to fitness fans |

**Worked example — one history, three model shapes.** A user recently viewed `data science course → ML interview prep → AI tutor`. A bag-of-items model retrieves broadly educational content. A sequential model notices the transition toward tutoring and ranks math-tutor or interview-practice items higher. A two-tower system precomputes item vectors and retrieves 500 candidates from a 1M-item catalog before the ranker scores them. A generative system might emit structured item codes for "AI tutoring" directly, then validate and rerank the generated candidates.

The serving win is concrete: scoring **1M** items directly means **1M** scores per request. Two-tower retrieval can precompute item vectors and retrieve **top 100–1000** candidates before ranking. The sequential or generative component is worth the extra complexity only when it recovers candidates the simpler funnel misses.

A useful break test is to shuffle history order. If quality barely changes, sequence modeling is probably not the bottleneck. If the next item changes from "generic education" to "AI interview practice" only when order is preserved, sequential modeling is carrying real signal.


**Decision checkpoint.** Pick the simplest family that matches the product constraint:

- **Neighborhood CF:** dense, small-ish, explainable baseline; notebook item-CF recall@10 `0.745`.
- **MF:** enough interactions and compact personalization; notebook MF recall@10 `0.71` and fav-genre share `0.54`.
- **Two-tower:** large-catalog retrieval with ANN and side features; notebook recall@10 `0.77`.
- **Sequential:** recent order changes next action; shuffle test `0.49` ordered vs `0.35` shuffled.
- **Generative:** sequence-native retrieval research path with strong serving/eval controls.

**Concrete use-it-when examples.**

- **Neighborhood CF:** use it when a recruiter saved creator A and B, and creator C is frequently saved by the same recruiters; "because similar recruiters saved C" is the explanation.
- **MF:** use it when a member and an ad can each be represented by learned 32-dim vectors, and their dot product retrieves ads similar in latent taste even without exact neighbor overlap.
- **Two-tower:** use it when a 5M-item catalog must return 500 candidates in tens of milliseconds by precomputing item vectors and ANN-searching with the online member vector.
- **Sequential:** use it when `wedding venue → catering → photographer` should retrieve event-service ads, while the same items shuffled would be less informative.
- **Generative:** use it when a sequence-native model emits valid item-code candidates such as `event_services/photographer/*`, then a serving layer validates and reranks them.

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
