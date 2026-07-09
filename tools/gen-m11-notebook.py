#!/usr/bin/env python3
"""Generate afp/notebooks/M11-embeddings-representation.ipynb.

A runnable, beginner-friendly Colab notebook for module M11: embeddings &
representation learning. Part A covers what an embedding encodes, dot vs cosine
similarity, why L2-normalize, and ID vs text embeddings, ending with the
"checks before trusting neighbors" (norms, dot-vs-cosine neighbors, hubness).
Part B learns an embedding with negative sampling (matrix factorization / BPR —
the same objective as word2vec / skip-gram),
covers alignment & uniformity, and walks the evaluation ladder as concrete
CHECKS: recall@k, slice checks (cold-start gap), and probing.

Granular: small steps, plain-language explanation, print logging, and a
visualization for every idea. Colab-preinstalled libraries only
(numpy / pandas / scikit-learn / matplotlib).

Run: python3 tools/gen-m11-notebook.py
"""
import json, os

cells = []
def md(t):   cells.append({"cell_type": "markdown", "metadata": {}, "source": t.strip("\n").splitlines(keepends=True)})
def code(s): cells.append({"cell_type": "code", "metadata": {}, "execution_count": None, "outputs": [], "source": s.strip("\n").splitlines(keepends=True)})

# ------------------------------------------------------------------- intro
md(r"""
# M11 · Embeddings & Representation Learning — Hands-on, Step by Tiny Step

**Companion to lesson M11. Written for someone new to ML.**

An **embedding** turns any entity — a creator, a search query, an ad, a word — into a list of
numbers (a **vector**), placed in a space where **similar things sit close together**. That
lets you *search*, *cluster*, and *feed* entities into other models. The catch: "close" means
**"the training signal made these look similar,"** not "these are truly the same." This
notebook builds that intuition, then shows the two things you must be able to do:
**compare vectors correctly** and **check whether the space is any good.**

**What you'll do (every step has an explanation, logging, and a picture):**
- **Part A · What embeddings encode & similarity:** vectors as points, **dot product vs
  cosine**, why you **L2-normalize**, **ID vs text** embeddings, and the **checks before
  trusting neighbors** (norms, dot-vs-cosine, hubness).
- **Part B · Learning & evaluating:** **learn** an embedding with **negative sampling**
  (the same objective behind **word2vec / skip-gram**),
  measure **alignment & uniformity**, then run the evaluation **checks** — **recall@k**,
  **slice checks** (the cold-start gap), and **probing**.

We use **scikit-learn** + **matplotlib** (no installs in Colab). Run each cell with
**Shift+Enter**.
""")

md(r"""
## Step 1 · Setup
""")
code(r"""
import numpy as np, pandas as pd
import matplotlib.pyplot as plt
plt.rcParams.update({"axes.grid": True, "grid.alpha": .3, "figure.autolayout": True})
BLUE, GREEN, RED, PURPLE, GOLD, GRAY = "#4C72B0", "#55A868", "#C44E52", "#8172B3", "#CCB974", "#888"
print("ready")
""")

# =================================================================== PART A
md("---\n# Part A · What embeddings encode & similarity")

md(r"""
## Step 2 · An embedding is just a point in space

Give each creator a short vector. Here we use **2 numbers** each so we can *draw* them. Nearby
points = "the training signal saw these as similar." Notice the fitness creators cluster
together and the finance ones cluster elsewhere — **that clustering is the whole value.**
""")
code(r"""
creators = {
    "Fit-Anna":   [0.9, 0.2], "Fit-Ben":  [0.8, 0.35], "Fit-Cy": [0.95, 0.1],
    "Fin-Dana":   [0.2, 0.9], "Fin-Eli":  [0.1, 0.85], "Fin-Fay": [0.25, 0.95],
}
plt.figure(figsize=(5,5))
for name,(x,y) in creators.items():
    c = GREEN if name.startswith("Fit") else BLUE
    plt.scatter(x,y,s=120,color=c); plt.annotate(name,(x,y),textcoords="offset points",xytext=(6,4))
plt.xlabel("dim 1"); plt.ylabel("dim 2"); plt.title("creators as points — similar ones cluster")
plt.xlim(0,1.1); plt.ylim(0,1.1); plt.show()
print("dims usually aren't individually meaningful — read NEIGHBORHOODS, not single axes.")
""")

md(r"""
## Step 3 · The two ways to score similarity — dot product vs cosine

To rank items for a query you need a **similarity score**. The two you must know:
$$\text{dot}(q,x)=q^\top x \qquad \cos(q,x)=\frac{q^\top x}{\lVert q\rVert\,\lVert x\rVert}$$
- **Dot product** rewards **direction AND size (norm)**.
- **Cosine** divides out the norms → rewards **direction only** (the angle).

We use the lesson's exact example: query `q=[1,0]` and three items.
""")
code(r"""
q = np.array([1.0, 0.0])
items = {"A (big norm, same dir)": np.array([10.0, 0.0]),
         "B (small norm, near dir)": np.array([0.8, 0.6]),
         "C (orthogonal)": np.array([0.0, 1.0])}
print(f"{'item':>26}{'dot':>8}{'cosine':>9}")
for name, x in items.items():
    dot = q @ x
    cos = dot / (np.linalg.norm(q)*np.linalg.norm(x))
    print(f"{name:>26}{dot:>8.2f}{cos:>9.2f}")
print("\ndot says A is 12.5x stronger than B (its norm is 10).")
print("cosine says A is only 0.2 ahead of B (norm ignored, pure angle).")
""")

md(r"""
## Step 4 · *See* the difference, and why you **normalize**

Plot the query and items as arrows. **Dot** cares how far the arrow reaches along the query;
**cosine** cares only about the angle. The norm often secretly encodes **popularity /
frequency** — so **dot-product retrieval can bury a niche-but-perfectly-aligned item under a
popular one.** **L2-normalizing** (scaling every vector to length 1) removes that, making dot
product *equal* cosine, so pure **direction** wins.
""")
code(r"""
fig, ax = plt.subplots(1, 2, figsize=(10, 4.6))
def arrows(a, title, normalize):
    a.axhline(0,color=GRAY,lw=.6); a.axvline(0,color=GRAY,lw=.6)
    vecs = {"q":(q,"k")} | {n:(x,c) for (n,x),c in zip(items.items(),[RED,GREEN,BLUE])}
    for name,(v,c) in vecs.items():
        vv = v/np.linalg.norm(v) if normalize else v
        a.annotate("",xy=vv,xytext=(0,0),arrowprops=dict(arrowstyle="->",color=c,lw=2))
        a.annotate(name.split()[0],vv,color=c)
    lim = 1.3 if normalize else 10.5
    a.set_xlim(-0.2,lim); a.set_ylim(-0.2,lim); a.set_title(title)
arrows(ax[0],"raw vectors (A shoots far → dot loves it)",False)
arrows(ax[1],"L2-normalized (all length 1 → angle only)",True)
plt.show()
print("after normalizing, A and q point the same way (cosine 1.0), B is a 37-degree angle (0.8).")
print("normalize when you DON'T want norm to act like a popularity prior.")
""")

md(r"""
## Step 4b · Practical test — *should* you normalize? (a decision you can measure)

"Normalize when norm shouldn't drive ranking" is the rule — but **how do you check?** The key
fact: a vector's **length (norm) is usually an accidental byproduct** — of **popularity,
frequency, or text length** — *not* of meaning. Frequent words and popular items pick up
**bigger norms** just from being seen more. So two concrete tests:

1. **Norm-vs-nuisance correlation.** Correlate each vector's **norm** with a quantity you
   *don't* want steering results (popularity / word frequency / document length). **High |r| →
   the norm is a popularity prior → normalize.**
2. **Ranking-flip test.** Compare **top-k by dot** vs **top-k by cosine**. If the lists **change
   a lot**, the norm is driving retrieval — normalize unless you *deliberately* want popularity
   in the score.

Below we build items whose norm leaked popularity, then run **both** tests.
""")
code(r"""
rng = np.random.default_rng(3)
d, n = 16, 300
pop  = rng.integers(1, 500, n)                                   # popularity/frequency: a NUISANCE
dirs = rng.normal(0, 1, (n, d)); dirs /= np.linalg.norm(dirs, axis=1, keepdims=True)  # pure MEANING (unit)
norms = 1.0 + pop/50.0 + rng.normal(0, 0.4, n)                  # popular -> longer vectors (real effect)
E = dirs * norms[:, None]                                        # embeddings whose LENGTH encodes popularity

# ---- TEST 1: does norm correlate with the nuisance (popularity)? ----
r = np.corrcoef(pop, norms)[0, 1]
print(f"TEST 1  corr(norm, popularity) = {r:+.2f}")
print("  |r| is large -> norm is basically a popularity meter -> NORMALIZE.\n")

# ---- TEST 2: do dot and cosine retrieve different items? ----
Q = rng.normal(0, 1, (200, d)); Q /= np.linalg.norm(Q, axis=1, keepdims=True)
dot_top = np.argsort(-(Q @ E.T),    axis=1)[:, :10]             # dot ranking (norm counts)
cos_top = np.argsort(-(Q @ dirs.T), axis=1)[:, :10]            # cosine ranking (angle only)
overlap = [len(set(a) & set(b)) / 10 for a, b in zip(dot_top, cos_top)]
print(f"TEST 2  avg top-10 overlap(dot, cosine) = {np.mean(overlap):.2f}")
print("  far below 1.0 -> normalizing changes WHO you retrieve -> the norm is steering results.")
""")
code(r"""
fig, ax = plt.subplots(1, 2, figsize=(11, 4.3))

# left: WHY normalize -- norm rises with popularity
ax[0].scatter(pop, norms, s=14, alpha=.5, color=BLUE)
ax[0].set_xlabel("item popularity (a nuisance)"); ax[0].set_ylabel("embedding norm  ||v||")
ax[0].set_title(f"TEST 1 -- norm leaks popularity  (r = {r:+.2f})")

# right: CONSEQUENCE -- how much retrieval changes when you normalize
ax[1].hist(overlap, bins=np.linspace(0, 1, 11), color=PURPLE, edgecolor="white")
ax[1].axvline(np.mean(overlap), color=RED, lw=2, ls="--", label=f"mean = {np.mean(overlap):.2f}")
ax[1].set_xlabel("per-query top-10 overlap (dot vs cosine)"); ax[1].set_ylabel("# queries")
ax[1].set_title("TEST 2 -- low overlap => norm steers retrieval"); ax[1].legend()
plt.show()
print("RULE OF THUMB: high corr(norm, nuisance) OR low dot-vs-cosine overlap  ->  L2-normalize.")
print("KEEP raw norms only when magnitude is MEANINGFUL (trained confidence/calibration you want).")
""")

md(r"""
## Step 5 · ID embeddings vs text embeddings

Two ways to get an entity's vector:
- **ID embedding** — a **learned lookup** vector per entity. Great for entities with **lots of
  history** (their vector memorizes real behavior). **Fails for new entities** — a fresh ID
  has no history, so its vector is random.
- **Text embedding** — an **encoder** reads the entity's text (bio, title) → a vector. It
  **generalizes to unseen entities** (cold-start), but may **miss platform behavior** (who
  actually converts).

Below: a brand-new creator's **ID** vector is random noise, but its **text** vector still
lands near the right topic.
""")
code(r"""
rng = np.random.default_rng(0)
d = 12
topic = rng.normal(0, 1, d); topic /= np.linalg.norm(topic)    # the 'cybersecurity' direction

established_id = topic + rng.normal(0, 0.05, d)   # learned ID vector: near the topic (rich history)
new_id        = rng.normal(0, 1, d)               # NEW creator's ID vector: random (no history!)
new_text      = topic + rng.normal(0, 0.15, d)    # text encoder: still near the topic from the bio

def cos(a, b): return a @ b / (np.linalg.norm(a) * np.linalg.norm(b))
print("cosine similarity to the 'cybersecurity' topic direction:")
print(f"  established creator, ID vector : {cos(established_id, topic):+.2f}  (history -> aligned)")
print(f"  NEW creator, ID vector         : {cos(new_id,  topic):+.2f}  (no history -> ~0, random!)")
print(f"  NEW creator, TEXT vector       : {cos(new_text, topic):+.2f}  (bio -> still aligned)")
print("\n-> production often BLENDS: text for cold-start, ID where history is rich.")
""")

md(r"""
## Step 6 · CHECK #1 — before you trust the neighbors

Never trust an embedding's neighbor list blindly. Three quick diagnostics from the lesson:
1. **Norms** — are a few high-norm vectors dominating?
2. **dot vs cosine neighbors** — do the top results *change* when you normalize? (if yes, norm
   is driving retrieval)
3. **Hubness** — is one vector the nearest neighbor of *many* unrelated queries?
""")
code(r"""
rng = np.random.default_rng(1)
E = rng.normal(0, 1, (400, 16))
E[0] *= 8   # plant one artificially popular "hub" with a huge norm

norms = np.linalg.norm(E, axis=1)
print("CHECK norms:  min %.2f  median %.2f  max %.2f" % (norms.min(), np.median(norms), norms.max()))
print("  -> item 0 norm = %.1f is a big outlier (a popularity hub?)\n" % norms[0])

q = rng.normal(0, 1, 16)
dot_top = np.argsort(-(E @ q))[:5]
En = E / norms[:, None]
cos_top = np.argsort(-(En @ (q/np.linalg.norm(q))))[:5]
print("CHECK dot vs cosine neighbors for one query:")
print("  top-5 by DOT   :", dot_top.tolist(), "(item 0 sneaks in via norm)" if 0 in dot_top else "")
print("  top-5 by COSINE:", cos_top.tolist(), "(norm removed -> different list)")

# hubness: how often is each item SOMEONE's nearest neighbor
S = En @ En.T; np.fill_diagonal(S, -1e9)
nn = np.argmax(S, axis=1); counts = np.bincount(nn, minlength=len(E))
plt.figure(figsize=(5.5,3)); plt.hist(counts, bins=30, color=PURPLE)
plt.xlabel("# times an item is someone's nearest neighbor"); plt.ylabel("count")
plt.title("hubness check (a long right tail = hubs)"); plt.show()
print("CHECK hubness: biggest hub is the NN of", counts.max(), "others (watch for these).")
""")

# =================================================================== PART B
md("---\n# Part B · Learning & evaluating embeddings")

md(r"""
## Step 7 · Word2vec / skip-gram — learn an embedding with negative sampling

Now we *train* vectors instead of hand-placing them. Setup: **advertiser briefs** and
**creators**, each in a **vertical** (topic), and creators have a **tenure** (established vs
new). Positives = brief↔creator pairs that "matched" (established creators get more matches —
richer history). We learn brief and creator vectors so a **positive scores higher than a
random negative** (BPR / matrix factorization — the same negative-sampling idea as M10).

> **This is exactly the word2vec / skip-gram engine.** Word2vec skip-gram learns *word*
> vectors by taking a word + a **nearby** word as a **positive** pair and a few **random**
> words as **negatives**, then nudging vectors so positives outscore negatives. Swap
> "word ↔ nearby word" for "brief ↔ matched creator" and it's the **same objective** — only
> the source of the positive pairs changes. So the loop below *is* skip-gram-style training,
> applied to briefs/creators instead of text.
""")
code(r"""
rng = np.random.default_rng(0)
dim, V = 16, 6
n_brief, n_creator = 1000, 1400

centers = rng.normal(0, 1, (V, dim))                 # a center per vertical (so topics cluster)
brief_v   = rng.integers(0, V, n_brief)
creator_v = rng.integers(0, V, n_creator)
Bf = centers[brief_v]   + rng.normal(0, 0.6, (n_brief, dim))     # TRUE latent taste (hidden)
Cf = centers[creator_v] + rng.normal(0, 0.6, (n_creator, dim))
established = rng.random(n_creator) < 0.7             # 70% established, 30% new
aff = Bf @ Cf.T

# build positive (brief, creator) pairs; established & common verticals get more interactions
train, test = {}, {}
for b in range(n_brief):
    w = np.exp(aff[b] - aff[b].max())
    w *= np.where(established, 4.0, 1.0)              # established -> more matches (rich history)
    w *= np.where(creator_v == 5, 0.25, 1.0)         # vertical 5 is RARE (few interactions)
    w /= w.sum()
    cs = list(rng.choice(n_creator, rng.integers(3, 8), replace=False, p=w))
    if len(cs) >= 2: test[b] = cs[-1]; train[b] = cs[:-1]   # hold out 1 positive per brief
    else: train[b] = cs
train_pairs = [(b, c) for b, cs in train.items() for c in cs]
print(f"{n_brief} briefs, {n_creator} creators, {len(train_pairs)} training positives")

# train with BPR: push positive above a random negative
Be = rng.normal(0, .1, (n_brief, dim)); Ce = rng.normal(0, .1, (n_creator, dim))
lr, reg = 0.1, 1e-5; losses = []
for epoch in range(40):
    rng.shuffle(train_pairs); tot = 0.0
    for b, c in train_pairs:
        neg = rng.integers(0, n_creator)
        diff = Be[b] @ Ce[c] - Be[b] @ Ce[neg]
        g = 1/(1 + np.exp(diff))                     # gradient weight = sigmoid(-diff)
        Be[b]  += lr * (g*(Ce[c]-Ce[neg]) - reg*Be[b])
        Ce[c]  += lr * (g*Be[b] - reg*Ce[c])
        Ce[neg]+= lr * (-g*Be[b] - reg*Ce[neg])
        tot += -np.log(1/(1+np.exp(-diff)))
    losses.append(tot/len(train_pairs))
    if epoch % 8 == 0: print(f"  epoch {epoch:>2}: avg BPR loss {losses[-1]:.4f}")
plt.figure(figsize=(5.5,3)); plt.plot(losses, color=BLUE)
plt.xlabel("epoch"); plt.ylabel("BPR loss"); plt.title("embedding training loss"); plt.show()
""")

md(r"""
## Step 8 · CHECK #2 — alignment & uniformity

A good space needs **two** things:
- **Alignment** — positive pairs are **close**: `E‖f(x)−f(y)‖²` (lower = better).
- **Uniformity** — vectors **spread out**, not collapsed into one blob:
  `log E e^{−2‖x−y‖²}` (lower = more spread).

The trap: a **collapsed** space (everything ≈ the same point) has *great* alignment but
*terrible* uniformity — every neighbor list is the same, so retrieval can't discriminate. We
compare our trained space to a deliberately collapsed one.
""")
code(r"""
def unit(X): return X / np.linalg.norm(X, axis=1, keepdims=True)   # these metrics live on the unit sphere
def alignment(x, y): return float(np.mean(np.sum((x - y)**2, axis=1)))
def uniformity(X, m=3000):
    i = rng.integers(0, len(X), m); j = rng.integers(0, len(X), m)
    return float(np.log(np.mean(np.exp(-2*np.sum((X[i]-X[j])**2, axis=1)))))

Bn, Cn = unit(Be), unit(Ce)                          # L2-normalize the learned vectors
bs = np.array(list(test.keys())); cs = np.array([test[b] for b in bs])
Xpos, Ypos = Bn[bs], Cn[cs]                          # held-out positive pairs (brief vs matched creator)

# a COLLAPSED space: every creator points in almost the SAME direction
v = rng.normal(0, 1, dim)
collapsed = unit(np.tile(v, (n_creator, 1)) + rng.normal(0, 0.05, (n_creator, dim)))
Xc = collapsed[cs]; Yc = unit(collapsed[cs] + rng.normal(0, 0.05, (len(cs), dim)))

print(f"{'space':>12}{'alignment':>12}{'uniformity':>12}")
print(f"{'trained':>12}{alignment(Xpos,Ypos):>12.3f}{uniformity(Cn):>12.2f}")
print(f"{'collapsed':>12}{alignment(Xc,Yc):>12.4f}{uniformity(collapsed):>12.2f}")
print("\ncollapsed has TINY alignment (looks great!) but uniformity ~0 (all jammed) -> useless.")
print("trained keeps positives close AND spreads everything else -> retrieval can discriminate.")
""")

md(r"""
## Step 9 · CHECK #3 — retrieval recall@k (the first real metric)

The closest-to-production check: for each held-out positive, rank **all** creators by
similarity and ask **"is the true match in the top k?"** Averaged over briefs, that's
**recall@k**. Compare to a random baseline.
""")
code(r"""
def recall_at_k(mask=None, k=20):
    hits = tot = 0
    for b, ti in test.items():
        if mask is not None and not mask(ti): continue
        s = Be[b] @ Ce.T
        for c in train[b]: s[c] = -1e9               # exclude training positives
        if ti in np.argpartition(-s, k)[:k]: hits += 1
        tot += 1
    return hits / max(tot, 1), tot

overall, n = recall_at_k()
print(f"recall@20 overall: {overall:.2f}  (over {n} briefs)")
print(f"random baseline  : {20/n_creator:.3f}   -> the model is far above random")
""")

md(r"""
## Step 10 · CHECK #4 — SLICE checks (where cold-start hides)

**One overall number lies.** Break recall down by slice. Watch the **cold-start gap**:
established creators (rich history) retrieve well; **new** creators (little history) retrieve
poorly; a **rare vertical** is also weak. This is the single most important embedding check —
the fix isn't "bigger vectors," it's better text features / a cold-start blend / hard
negatives for rare verticals.
""")
code(r"""
overall, _  = recall_at_k()
est, _      = recall_at_k(mask=lambda c: established[c])
new, _      = recall_at_k(mask=lambda c: not established[c])
rare, _     = recall_at_k(mask=lambda c: creator_v[c] == 5)
rows = [("overall", overall), ("established", est), ("new (cold-start)", new), ("rare vertical", rare)]
for name, r in rows: print(f"  recall@20  {name:>18}: {r:.2f}")

plt.figure(figsize=(6,3.3))
names = [r[0] for r in rows]; vals = [r[1] for r in rows]
plt.bar(names, vals, color=[GRAY, GREEN, RED, GOLD]); plt.ylabel("recall@20")
plt.title("slice checks expose the cold-start gap"); plt.xticks(rotation=15); plt.show()
print("established >> new: the ID embedding memorized history the new creators don't have yet.")
""")

md(r"""
## Step 11 · CHECK #5 — probing (does the space encode what we think?)

Freeze the learned vectors and train a **tiny classifier** to predict a known label (here the
**vertical**) from them. High accuracy = the space really encodes topic structure. (Also a
bias audit: if a probe recovers a *protected* attribute you didn't intend, that's a red flag.)
""")
code(r"""
from sklearn.linear_model import LogisticRegression
from sklearn.model_selection import cross_val_score
acc = cross_val_score(LogisticRegression(max_iter=1000), Ce, creator_v, cv=3).mean()
print(f"probe: predict vertical from frozen creator vectors -> {acc:.2f} accuracy")
print(f"random guessing would be 1/{V} = {1/V:.2f}  -> the space clearly encodes vertical")
# visualize: project to 2D and color by vertical
from numpy.linalg import svd
U, S, Vt = svd(Ce - Ce.mean(0), full_matrices=False)
proj = (Ce - Ce.mean(0)) @ Vt[:2].T
plt.figure(figsize=(5.2,5))
plt.scatter(proj[:,0], proj[:,1], c=creator_v, cmap="tab10", s=8, alpha=.6)
plt.xlabel("component 1"); plt.ylabel("component 2")
plt.title("creators colored by vertical (clusters = learned structure)"); plt.show()
""")

# ------------------------------------------------------------------- eval toolkit
md(r"""
---
## Step 12 · The evaluation toolkit — every method, explained

You ran the checks above. Here's *when to trust each one and where it fits* — because no single
method is enough. Read each as: **what it is → what it's good for → the trap → where it fits →
rule of thumb.** They stack into a ladder from "soft intuition" to "hard, sliceable numbers."

### 0. t-SNE / UMAP (a picture)
- **What it is:** squashes your high-dim vectors down to **2D** so you can *see* whether similar
  things cluster (like the Step 11 scatter).
- **Good for:** building intuition, spotting gross failures (e.g. total collapse).
- **The trap:** it's **lossy and cosmetic** — cluster sizes and between-cluster distances are
  artifacts of the algorithm's settings (perplexity), not reality. It's not a number you can
  threshold, track, or slice, and a pretty plot can still hide terrible cold-start recall.
- **Where it fits:** **rung 0** — a debugging/sanity aid, never a grade.
- **Rule of thumb:** use it to *look and hypothesize*, then *prove* it with metrics.

### 1. Alignment & uniformity (structural health)
- **What it is:** two numbers — **alignment** = are positive pairs close? **uniformity** = are
  vectors spread out (not collapsed)?
- **Good for:** catching **collapse** — the failure where everything is near everything, so
  neighbor lists are all the same.
- **The trap:** each alone lies. **Great alignment with bad uniformity = a collapsed, useless
  space** (positives are close, but so is everything). You must read them **together**.
- **Where it fits:** a **structural health check** *before* trusting retrieval numbers.
- **Rule of thumb:** demand **both** — positives close *and* the rest spread.

### 2. Retrieval recall@k (the first real metric)
- **What it is:** put a query in the space, take its top-k neighbors, ask **"is the true match
  in there?"** Average over queries.
- **Good for:** directly measuring the job you'll serve — *does searching this space return the
  right item?* It's a real, trackable number.
- **The trap:** **meaningless without naming the candidate universe** — recall@k against a few
  sampled negatives is wildly optimistic vs against the full catalog. And a good *overall*
  number can hide bad slices.
- **Where it fits:** **rung 1** — the first metric you actually optimize.
- **Rule of thumb:** always report **recall@k + the universe you ranked against**.

### 3. Downstream lift (the metric that pays)
- **What it is:** feed the embedding into the **real product model** (ranker) and measure whether
  the business metric moves — CTR, conversion, invite-acceptance.
- **Good for:** the **only** check that proves the embedding is *useful*, not just *neat*. A
  space can have great recall@k and still not help the ranker.
- **The trap:** slow and expensive (needs an A/B test or a trained downstream model), and
  confounded by everything else in the system.
- **Where it fits:** **rung 2** — the ground truth of value.
- **Rule of thumb:** offline metrics are *proxies*; downstream lift is the *verdict*.

### 4. Probing (what does it encode?)
- **What it is:** freeze the vectors, train a **tiny classifier** to predict a known label
  (vertical, language) from them. High accuracy = that info is encoded.
- **Good for:** confirming the space captures the structure you *expect*, and **auditing bias**
  — if a probe recovers a *protected* attribute you never intended, that's a red flag.
- **The trap:** measures **presence of information, not usefulness for the task** — a probe can
  ace "predict language" while retrieval still fails. High probe accuracy ≠ good retrieval.
- **Where it fits:** **rung 3** — a diagnostic/audit, alongside (not instead of) recall.
- **Rule of thumb:** probe to understand *what's in there* and *what shouldn't be*.

### 5. Qualitative neighbors (eyeball the top-k)
- **What it is:** for real queries, actually **read the top neighbors** — for head, torso, tail,
  and cold-start examples.
- **Good for:** catching failures metrics miss — e.g. neighbors that are *topically* similar but
  *wrong for the product task* (right topic, wrong audience/region).
- **The trap:** **anecdotal and cherry-pickable** — a few good examples prove nothing; you must
  look across the distribution, not just the ones that look good.
- **Where it fits:** **rung 4** — a reality check on what the numbers claim.
- **Rule of thumb:** if you can't stomach the top-5 neighbors for a *tail* query, the metric is
  lying to you.

### 6. Slice checks (where cold-start hides) — the most important one
- **What it is:** break every metric down by **subgroup** — new vs established, rare verticals,
  languages, small advertisers.
- **Good for:** exposing the failures a **single average buries** — especially the **cold-start
  gap** (notebook: established 0.53 vs new 0.23).
- **The trap:** its own — you must pre-define the slices that matter, or you'll miss the one that
  breaks in production.
- **Where it fits:** **rung 5** — applied *on top of* recall / downstream / neighbors.
- **Rule of thumb:** **never ship on the overall number** — the fix for a bad slice isn't
  "bigger vectors," it's better features / a cold-start blend / hard negatives for that slice.

**The ladder in one line:** t-SNE to *look* → alignment/uniformity to check *health* →
recall@k for the *first number* → downstream lift for *real value* → probing to see *what's
encoded* → qualitative neighbors for a *reality check* → **slice checks** because the average
always lies.
""")

# ------------------------------------------------------------------- recap
md(r"""
---
## Recap — the M11 toolkit + the checklist

**What embeddings encode (Part A).** A vector's **neighborhood** reflects the **training
signal**, not universal truth. Compare vectors with **dot product** (direction *and* norm —
norm often acts like popularity) or **cosine** (direction only, after **L2-normalizing**).
**ID** embeddings memorize history (great for established entities, random for new ones);
**text** embeddings generalize to cold-start but miss platform behavior — so **blend** them.

**Learning & evaluating (Part B).** You learn vectors by pushing **positives above sampled
negatives** (matrix factorization / BPR). A healthy space has **alignment** (positives close)
**and uniformity** (everything spread) — collapse kills retrieval.

**The checks — never skip these:**
1. **Norms & hubness** — are a few high-norm vectors dominating / is one item everyone's neighbor?
2. **dot vs cosine neighbors** — do results change when you normalize? (then norm drives retrieval)
3. **Alignment & uniformity** — positives close *without* the space collapsing.
4. **recall@k** — of held-out positives, how many land in the top k?
5. **Slice checks** — new vs established, rare verticals, languages: **this is where cold-start hides.**
6. **Probing** — can a light classifier recover expected labels (and not leak protected ones)?
7. **Qualitative neighbors** — do the top neighbors actually make sense for the *product task*?

**Where this connects:** M11's vectors and negative sampling build on M10 (implicit labels,
logQ) and feed **M12 two-tower retrieval** — the system that searches these embeddings at
scale. Cold-start (M9) reappears as the ID-embedding weakness the slice checks expose.
""")

nb = {"cells": cells,
      "metadata": {"kernelspec": {"name": "python3", "display_name": "Python 3"},
                   "language_info": {"name": "python"},
                   "colab": {"name": "M11 · Embeddings & Representation", "provenance": [], "toc_visible": True}},
      "nbformat": 4, "nbformat_minor": 5}
out = os.path.join(os.path.dirname(__file__), "..", "afp", "notebooks", "M11-embeddings-representation.ipynb")
os.makedirs(os.path.dirname(out), exist_ok=True)
with open(out, "w") as f: json.dump(nb, f, indent=1)
print("wrote", os.path.relpath(out), "with", len(cells), "cells", f"({sum(c['cell_type']=='code' for c in cells)} code)")
