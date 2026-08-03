# Vector Search: from brute force to HNSW
## Full speaker transcript — 60 minutes

**Companion notebook:** `notebooks/talk-vector-search.ipynb`

**How to read this:** normal text is what you say. `[Square brackets]` are stage directions —
what to click, draw, or point at. Numbers in **bold** are the ones worth landing on; every one of
them comes from the notebook, so you can defend any of them by re-running a cell.

**Before you start:**
- Run the notebook end to end once, so every output is populated. Don't run it live from scratch —
  the HNSW build alone is 8 seconds, and dead air kills a talk.
- Have a whiteboard or iPad ready. Three drawings carry this talk and none of them are slides.
- **The measured numbers were taken on an M-series laptop.** On Colab they'll be roughly 2–3×
  slower across the board. Say this once if anyone asks — the *ratios* are what matter and those hold.
- Latencies shift a few percent between runs; **recalls are seeded and reproduce exactly.** The
  figures here match the deck (`talks/vector-search-talk.pptx`) — both come from the same run. If you
  re-run the notebook and want to re-quote, regenerate the deck with `talks/deck/build_deck.py`.

**The talk is four techniques.** kNN, ANN, IVF-PQ, HNSW. Everything else is scaffolding — the
recall metric, the ledger, and the filtering warning at the end. If you're running short, cut
from the ledger, never from the four.

**Timing map**

| Time | Section | Minutes |
|---|---|---|
| 0:00 | Open — the problem | 3 |
| 0:03 | **1. Exact kNN** | 7 |
| 0:10 | **2. ANN** — the bargain, and recall@k | 5 |
| 0:15 | **3. IVF-PQ** — 3a IVF (9) · 3b PQ (10) · 3c combined + rerank (5) | 24 |
| 0:39 | **4. HNSW** | 11 |
| 0:50 | 5. The ledger | 4 |
| 0:54 | 6. Filtering — the real gotcha | 4 |
| 0:58 | Close | 2 |
| 1:00 | Q&A | — |

---

# 0:00 — Open

Everything is a vector now.

When you embed a document, an image, a user, or a support ticket, you get back a list of numbers —
typically 256, 768, or 1536 of them. The useful property is that similar things land near each
other in that space. So "find me things like this" stops being a text problem and becomes a
geometry problem: given a query vector, find the closest vectors in my database.

Today I want to take you from the dumbest possible way to do that to what production systems
actually run, and at every step I want to answer one specific question: **what did this technique
buy me, and what did it cost?** Not how it works — what it's *for*.

**There are exactly four techniques, and that's the whole talk:**

1. **kNN** — exact search. Correct, simple, and it stops scaling.
2. **ANN** — the idea of trading a little correctness for a lot of speed.
3. **IVF-PQ** — partition the space, then compress what's in it.
4. **HNSW** — build a graph and walk it.

They're in the order they were invented, and each one exists because of a problem with the one
before it. By the end you'll be able to look at a vector database's config page and know what
every knob does.

One housekeeping note. Everything I'm about to claim, I measured. There's a notebook —
I'll share the link — and every table and chart in this talk comes out of it. If you don't
believe a number, you can change a constant at the top and re-run it. Nothing here is from a
vendor's benchmark page.

**One problem carries the whole talk.** I'm going to call it SupportBot.

[Show the problem slide, or the notebook's Section 0.]

> We have **200,000** past support tickets. A new ticket comes in, and we want to surface the most
> similar past tickets so the agent can reuse the resolution. Each ticket is a **256-dimensional**
> float32 embedding. We need **200 queries per second** at **p99 under 50 milliseconds**.

Swap in whatever your team actually works on — job postings, member profiles, code snippets. The
numbers barely change.

The one number to hold onto: 200,000 tickets times 256 dimensions times 4 bytes per float is
**205 megabytes** of raw vectors. Remember that, because in about twenty-five minutes I'm going to make
it six.

One last piece of vocabulary, and then we start. You'll see three distance metrics in this world:
Euclidean, dot product, and cosine. Here's the thing nobody tells you up front: **if you normalize
your vectors to length one when you write them, all three rank identically.** So normalize once at
write time and stop thinking about it. That's what the notebook does, and it's why I can use
whichever is convenient without any result changing.

---

# 0:03 — 1. Exact kNN

Let's start with the dumbest thing that works, because it's better than you think.

**The algorithm is one line: compare the query to every single vector, keep the best ten.** It's a
full scan with a heap. And it's *exact* — it always returns the true nearest neighbors.

[Switch to the notebook, Section 1, the three-line search.]

Here is the entire search engine.

```python
scores = tickets @ query
top = np.argpartition(-scores, k)[:k]
return top[np.argsort(-scores[top])]
```

One matrix-vector product, one partial sort, done.

**The value here is twofold, and the second one is what people forget.**

The first value is obvious: it's the simplest thing that works. No index. No training step. No
tuning. No new service in your architecture. Adding a vector is `append`. Deleting one is a mask.
It cannot silently break, because there's nothing in it to break.

**If your team is standing up a vector database for fifty thousand rows — this cell is the whole
talk.** Genuinely. I've seen a lot of Kubernetes deployed in service of a problem that was three
lines of numpy. Come find me afterward and we'll look at your row count together.

The second value is the one I want to make sure lands: **exact search is your ruler.** Everything
approximate that follows gets measured against it. You run it once on a sample of queries, you
save the answers, and that file is now the only thing that can tell you whether last week's index
config change made search quietly worse. **You will keep exact search in your stack forever, even
after you stop serving from it.**

[Point at the assert in the sanity-check cell.]

Notice there's an assert there. Exact search scored against its own ground truth has to come out
at exactly 1.0. If that ever fails, the ruler is broken and every number after it is meaningless.

So — where does this fall over?

[Show the timing cell output.]

On our 200,000 tickets, one query takes **4.0 milliseconds**. To sustain 200 queries a second
that's **0.8 of a CPU core.**

[Pause. Let that sit for a beat — it's deliberately anticlimactic.]

Which is... completely fine. Nothing is wrong. And I want to be straight with you about that,
because it's the first real lesson: **at 200,000 vectors you do not need any of the next fifty
minutes.** Anyone who tells you otherwise is selling something.

Here's where it breaks. Look at the projection.

| Corpus | Per query | Cores at 200 QPS |
|---|---|---|
| 200,000 | 4.0 ms | 0.8 |
| 2,000,000 | 40 ms | **7.9** |
| 20,000,000 | 396 ms | **79.2** |

**The cost is exactly linear.** Ten times the tickets, ten times the bill. At twenty million
you're burning something like eighty cores continuously — a meaningful chunk of a rack — to
answer a question that ought to fit on a laptop. And you blew the 50ms p99 somewhere around two
million.

Exact search doesn't fail. It just gets linearly more expensive until the invoice becomes absurd.

Now, the obvious question: isn't this a solved problem? Don't we have spatial indexes — kd-trees,
R-trees, quadtrees?

We do, and **they genuinely work in two or three dimensions, and they are useless at 256.** Above
roughly twenty dimensions they degrade to scanning everything anyway, plus overhead. The reason is
the *curse of dimensionality*: in high dimensions, almost every point sits at almost the same
distance from your query. The distances all bunch up. And if everything is roughly equidistant,
there's no tight region to prune — pruning is the only thing a tree was ever doing for you.

**There is no exact escape hatch.** That's not a gap in the literature; it's the reason this
entire field exists. So we have to give something up.

---

# 0:10 — 2. ANN: the bargain

What we give up is *being exactly right*, and we give up a surprisingly small amount of it.

Approximate Nearest Neighbor search — ANN — trades a little correctness for a lot of speed. The
pitch is: *I'll give you nine of the true top ten, a hundred times faster, in a tenth of the
memory.*

To trade something you have to measure it, so here's the one metric for the rest of the talk.

**Recall at k is the fraction of the true top-k that you actually returned.** You asked for ten,
you got nine of the right ones, recall@10 is 0.9. That's the whole definition. You compute it by
running exact search on a thousand sampled queries and diffing.

[Optionally show the math cell — the formal statement of top-k and recall@k.]

Now, the objection you will get in the room, and you should get it, is: *isn't 0.9 bad? We're just
accepting wrong answers?*

Here's the answer I'd give. **Your embeddings were already approximate.** The embedding model made
a judgment call about what "similar" means. The true seventh-nearest neighbor by cosine distance
is not a ground truth about ticket relevance — it's one model's opinion, and a noisy one. Chasing
the exact geometry of a fuzzy measurement is false precision. Missing the true #7 usually costs
you nothing a user can perceive.

**But** — and this is the part that keeps you honest — that argument has a hard boundary. If
you're doing deduplication, or license-key lookup, or "have we seen this exact document before,"
then a missed neighbor isn't a ranking nudge, it's a correctness bug. In that regime recall 0.95
means **five percent wrong answers**, and that's a very different conversation. So the first
question to ask about any vector search feature is: which regime am I in?

The last thing I'll say here is about how this field communicates. There's one chart, and you'll
see it on every library's README: **recall on the y-axis, queries per second on the x-axis, log
scale, one curve per configuration.** Up and to the right wins. We'll build that chart at the end
out of our own measurements.

Everything from here is one of three ideas: **partition the space so you scan less of it**,
**compress the vectors so each comparison is cheaper**, or **build a graph and walk toward the
answer.** The first two combine, which is why "IVF-PQ" is one word.

---

# 0:15 — 3. IVF-PQ

Third technique, and it's the one with a compound name because **it is literally two ideas bolted
together.** I'm going to teach them separately, measure each one alone, and then combine them —
that's the only way this ever makes sense.

- **IVF** partitions the space so you scan a slice of it. It buys **time**.
- **PQ** compresses each vector so comparisons are cheap. It buys **memory**.

They're independent. You can run either alone. Nearly everyone runs both, which is why you'll only
ever see them written as one word.

---

## 0:15 — 3a. IVF: skip the data that was never going to win

First idea: partitioning. The technique is called IVF — Inverted File Index.

**Think of a library.** You want a book on beekeeping. You do not scan every book in the building.
You walk to the right few shelves and scan those.

That's it, that's IVF. Two steps.

**Build:** run k-means over your corpus to get some number of centroids — we use 512. Every ticket
gets assigned to its nearest centroid. Now you have 512 buckets, averaging about 390 tickets each.
The proper name for those buckets is Voronoi cells.

**Search:** compare the query against the 512 centroids only — that's cheap — pick the closest
`nprobe` buckets, and brute-force *just those*.

**The value: you stop looking at data that was never going to win.**

[Switch to the notebook, the nprobe sweep table.]

This is the most important table in the section. `nprobe` is the dial — how many buckets we open.

| nprobe | scanned | % of corpus | ms/query | recall@10 |
|---|---|---|---|---|
| 1 | 391 | 0.2% | 0.022 | 0.592 |
| 2 | 781 | 0.4% | 0.019 | 0.817 |
| **4** | **1,562** | **0.8%** | **0.034** | **0.958** |
| 8 | 3,125 | 1.6% | 0.063 | 0.999 |
| 16 | 6,250 | 3.1% | 0.122 | 1.000 |
| 64 | 25,000 | 12.5% | 0.603 | 1.000 |
| 512 | 200,000 | 100% | 3.729 | 1.000 |

[Give them a few seconds to actually read it. Then point at row 3.]

Look at the `nprobe=4` row. We scanned **eight tenths of one percent** of the corpus and got
**96% of the right answers**, in **0.034 milliseconds** instead of 4.0. That's more than a
**hundredfold speedup** for four points of recall.

Two things I want you to take from this table.

**First: one row here is a product decision.** It is not a benchmark and it is not a library
default. Somebody has to look at this table, know the latency budget and the quality bar, and pick
a row. That is the actual deliverable of index tuning, and it's a conversation between whoever
owns latency and whoever owns quality.

**Second, and this is the general shape of every knob in this talk:** recall climbs fast and then
flattens, while cost keeps climbing linearly and never flattens. Going from 1 to 4 buys you
**37 points** of recall for three hundredths of a millisecond. Going from 64 to 512 buys you
**zero** and costs you 3.1 milliseconds. **Almost all of the value is in the first few probes.**

[Show the two-panel chart.]

The left panel is that saturation. The right panel is the trade-off curve — recall against
latency, with exact search marked as the dashed line on the right. That's the shape you're
buying.

Now let me show you where IVF is *wrong*, because this is the part that makes it debuggable.

[Switch to the 2D Voronoi picture.]

I've dropped 3,000 points in two dimensions and clustered them into 12 cells so we can actually
see this. The red star is a query. The green diamond is its true nearest neighbor. The circled
points are the one cell we'd probe at `nprobe=1`.

**The answer is one cell over.** The query landed near a boundary, its true nearest neighbor fell
on the far side of that line, and we never looked.

That's IVF's entire failure mode, and I love it, because **it's specific and predictable.** When
somebody files a ticket saying "search gave me a bad result," you can check whether their query
landed near a cell boundary, and `nprobe` is exactly the fix. **Errors you can explain are errors
you can debug.** Compare that to "the neural network felt differently that day."

Where does IVF's value run out? Three things.

**One: memory is completely unchanged.** Look at the notebook — the IVF index still holds all 205
megabytes of full float32 vectors. IVF buys **time**, not **space**. Hold that thought for exactly
ninety seconds.

**Two: it needs training.** You have to run k-means over a representative sample before you can
insert a single vector. That surprises people who expect an index to be write-and-go.

**Three: it drifts.** Centroids fitted on last year's tickets get lopsided as topics shift. One
bucket ends up with ten times its share, and probing that bucket is slow. Retraining is real,
scheduled, operational work — put it on the roadmap when you adopt this, not after.

---

## 0:24 — 3b. PQ: thirty-two times less memory

So IVF made us fast but left us fat. 205 megabytes, and that's for a corpus most of us would call
small. Second idea: compression. Product Quantization.

**The analogy is a color palette.** Instead of storing every pixel's exact 24-bit color, you store
an index into a 256-color palette. One byte instead of three, and the picture still looks like the
picture.

Here's the construction. Three steps.

**Step one: split.** Each 256-dimensional vector gets chopped into 32 sub-vectors of 8 dimensions
each.

**Step two: cluster each chunk position independently.** Take all the chunk-ones across the whole
corpus, run k-means, get 256 centroids. Separately, all the chunk-twos, another 256 centroids. And
so on. Thirty-two little codebooks of 256 entries each.

**Step three: encode.** Replace each chunk with the ID of its nearest centroid — a number from 0
to 255. **That's one byte.**

So a vector that was 256 floats — **1,024 bytes** — becomes **32 bytes**.

[Show the codes cell in the notebook.]

There it is. Ticket zero used to be 256 floating point numbers. It is now literally these
thirty-two bytes. **205 megabytes becomes 6.4 megabytes. Thirty-two times smaller.**

Quick aside on the name, because it confuses people: it's called *product* quantization because
the effective codebook is the Cartesian *product* of the 32 sub-codebooks. You can represent 256
to the 32nd power distinct vectors while only storing 32 times 256 centroids. That combinatorial
blow-up is the trick that makes it tractable.

**Now — the value. And I want to be precise, because this one is different from the others.**

**PQ's value is a deployment value, not a latency value.** It's what turns "we need a dedicated
cluster with a lot of RAM" into "this fits next to the app."

[Show the instance-type table.]

| Corpus | Raw | With PQ | What changes |
|---|---|---|---|
| 200,000 | 0.2 GB | 0.01 GB | fits **inside your app process** — no separate service |
| 2,000,000 | 2.0 GB | 0.06 GB | growth stopped being an infra project |
| 100,000,000 | 102 GB | 3.2 GB | one big machine instead of a cluster |
| 1,000,000,000 | 1,024 GB | 32 GB | **billion-scale on a single host** |

Three separate arguments live in that table and they get better as you go down. The top row means
you delete a service from your architecture diagram — no network hop, no separate thing to
operate, no on-call rotation. The bottom row is why PQ exists at all.

Now the honest part. What did we lose?

[Show the m-sweep table.]

`m` — the number of sub-vectors — is PQ's dial. And unlike `nprobe`'s smooth curve, **this one
falls off a cliff.**

| m | bytes/vector | compression | recall@10 |
|---|---|---|---|
| 16 | 16 | 64× | **0.156** |
| 32 | 32 | 32× | **0.388** |
| 64 | 64 | 16× | 0.632 |
| 128 | 128 | 8× | 0.870 |

[Let them react. These numbers look terrible and that's intentional.]

Yes. At the 32× compression we just celebrated, raw PQ ranking gets **39% of the right answers.**
That is not a search index. If you shipped that you'd be fired.

Here's why, and it matters: at 32× compression the reconstruction error is comparable to the *gap*
between the true #1 result and the true #40. The distances are right on average but noisy in
exactly the range where the top-10 live.

So the real lesson is: **PQ alone is not a search index. It's a shortlisting index.** Hold that
for five minutes and I'll fix it with three lines of code.

But before I do — I want to show you the genuinely clever part, because it's the best idea in this
talk and most people who use PQ have never looked at it.

[Slow down here. This is the moment.]

The natural assumption is that compressed data has to be decompressed before you can use it.
**PQ never decompresses. Not once.**

Here's how. Squared distance is *separable* — the distance between two vectors is just the sum of
the distances between their chunks. That's not a trick, it's arithmetic. So:

At query time, you split the query into its 32 chunks, and you precompute a **lookup table**: the
distance from query-chunk-*i* to each of the 256 centroids in codebook *i*. That's 32 times 256 —
**8,192 tiny computations, once per query.**

And then the distance to **any** ticket in the corpus is:

**Thirty-two table lookups and thirty-two adds.**

No multiplications. No 256-dimensional math. You just index into the table with the bytes you
already stored.

[Show the hand-built ADC cell.]

I built this by hand in the notebook so you can see there's nothing hidden — that's the lookup
table, 32 by 256, and our hand-rolled version agrees with faiss on **10 out of 10** results, with
a **0.97 correlation** to the true distances.

One caveat so you don't misread the output: our numpy version reports about 20 milliseconds. That
is numpy's fancy-indexing overhead, not the algorithm. faiss does the identical math in **1.3
milliseconds** with SIMD over packed bytes. The point of the cell is that the *math* is only
lookups and adds.

And notice what just happened. **The same 32 bytes that saved us memory also made the comparison
cheaper.** Compression and speed normally trade against each other. Here one bought both. That's
rare and it's worth appreciating.

The proper name for this, if you want to look it up, is **ADC — asymmetric distance computation.**
Asymmetric because the query stays full precision and only the database side is compressed, which
keeps the error meaningfully lower than quantizing both sides.

---

## 0:34 — 3c. IVF-PQ combined, and the rerank that saves it

So let's actually combine them. **IVF-PQ is "go to the right shelves, and read compressed
summaries once you're there."** IVF picks the buckets, PQ makes scanning them cheap. That's the
index that real billion-scale systems ship, and it's a two-line change from what we already have.

[Show the IVF-PQ build cell.]

And it's fast — **0.093 milliseconds** — and tiny. And its recall is **0.485**, which is useless.

So we're fast, we're small, and we're wrong. Let's fix the wrong part.

**Retrieve the top 100 by cheap PQ distance. Load those 100 full vectors. Rescore them exactly.
Return the true top 10 of those.**

That's it. A hundred exact distance computations is nothing.

[Show the rerank sweep.]

| candidates | ms/query | recall@10 | gain |
|---|---|---|---|
| — (no rerank) | 0.093 | 0.485 | — |
| 20 | 0.100 | 0.691 | +0.206 |
| 50 | 0.112 | 0.903 | +0.418 |
| **100** | **0.127** | **0.971** | **+0.486** |
| 200 | 0.161 | 0.996 | +0.512 |

[Land on this hard.]

**Recall went from 0.485 to 0.971. That's forty-nine points, for 35 microseconds.**

If this room takes home exactly one implementation detail, make it this one. It is the highest
effort-to-payoff ratio in the entire stack, and it is **the single most common missing piece in
hand-rolled vector search.** Every few months someone concludes "we tried PQ, the quality was
terrible, we went back to storing full vectors" — and what they actually mean is they shipped a
shortlisting index without the second stage.

**Now the catch, and I want to give it to you straight, because it's the thing the blog posts skip.**

Reranking needs the full vectors. Which we just spent an entire section compressing away. So
where do they live? Three options, all real:

**On SSD.** Read a hundred vectors per query, a few hundred kilobytes. Keeps the memory win.
Usually the right answer.

**In RAM.** faiss has `IndexRefineFlat` which does exactly this. Fastest option — and **you just
gave back the entire 32× saving.** Sometimes that's the correct call. Just know that you made it.

**In practice it's SSD**, and the arithmetic is comfortable: a hundred vectors at a kilobyte each
is a few hundred kilobytes per query. You keep the 32× win that made you pick IVF-PQ in the first
place, and you spend a little I/O for it.

I'm telling you about the catch on purpose. When you present this to your own team and somebody
asks "wait, doesn't reranking need the vectors you deleted?" — you want to have already said it.
**Naming the cost of your own fix is what makes the rest of your numbers believable.**

---

# 0:39 — 4. HNSW: walk the graph

Last idea, and it's a completely different philosophy. Don't partition. Don't compress. Build a
graph and walk it.

HNSW — Hierarchical Navigable Small World. Terrible name, beautiful algorithm.

**The travel analogy.** You're in a small town in Japan and you need to get to a specific café in
Osaka. You do not consult a street map of the entire country. You take a **flight** to the region,
a **train** to the city, and you **walk** the last few blocks. Long hops first, short hops last.

[If the room is systems-heavy, add:] If you know skip lists — it's a skip list where the base
layer is a proximity graph instead of a sorted list. Same idea, one dimension up.

[Draw this on the whiteboard. Three lines, twenty seconds.]

```
L2:   A ------------------------ Z        few nodes, long hops
L1:   A ------- M -------------- Z
L0:   A - c - f - M - p - t - w - Z       every node, short hops
```

Layer 0 has every vector, linked to its ~16 nearest neighbors. Each layer up holds a random subset
— each node gets promoted with exponentially decaying probability — and those sparse layers carry
the long-range links.

**The search, in one breath:** start at the entry point in the top layer. Greedily walk to whichever
neighbor is closer to the query. When no neighbor improves, drop down a layer and keep going. At
layer zero, do the same but keep a candidate list of size `efSearch` instead of just the single
best. Return the top k from that list.

Roughly **O(log N)** hops.

**HNSW has two values, and the second one is badly underrated.**

**Value one: it is simply the best point on the curve when your data fits in RAM.** Higher recall
*and* lower latency than IVF-PQ. That's why it's the default in pgvector, Qdrant, Weaviate, Milvus,
and OpenSearch. If you've used a vector database, you've used HNSW.

**Value two: `efSearch` is tunable per request, at runtime, with no rebuild.**

[Show the ef sweep.]

| efSearch | ms/query | recall@10 | plausible use case |
|---|---|---|---|
| 10 | 0.033 | 0.749 | type-ahead |
| 50 | 0.091 | 0.963 | standard search |
| 100 | 0.147 | 0.988 | |
| 200 | 0.238 | 0.998 | RAG / agent context |
| 400 | 0.448 | 0.999 | offline eval |

**Same index. Same box. No rebuild. It's a per-request parameter.**

Your latency-sensitive type-ahead and your quality-critical RAG pipeline can be served by *one*
deployment, at different quality tiers, decided per call. IVF's `nprobe` gives you the same
freedom — I should say that — but I've watched a lot of teams treat both of these as config-file
settings they set once at deploy time, and they're not. They're request parameters. That's free
capability most people leave on the floor.

Now let me show you the actual graph, because faiss exposes the internals and I think seeing it
makes it click.

[Show the three-layer graph visualization.]

Five hundred points in 2D. Layer 0 has all 500 nodes densely connected. Layer 1 has 62. Layer 2
has 5.

**Read it right to left, the way a search actually runs.** Start up in that sparse top layer where
five nodes span the entire space and a couple of hops take you anywhere. Descend into layer 1,
which refines your position. Land in layer 0 and do the fine-grained local search. That's the
flight, the train, and the walk — drawn from a real index.

And here's the argument that actually matters. Not the latency at one size — **the shape of the
curve as you grow.**

[Show the scaling table and log-log chart.]

| Corpus | Exact | HNSW | speedup |
|---|---|---|---|
| 12,500 | 0.16 ms | 0.042 ms | 4× |
| 25,000 | 0.45 ms | 0.065 ms | 7× |
| 50,000 | 0.97 ms | 0.100 ms | 10× |
| 100,000 | 1.86 ms | 0.117 ms | 16× |
| 200,000 | 3.44 ms | 0.153 ms | **22×** |

**The corpus grew 16×. Exact search got 22.0× slower. HNSW got 3.6× slower.**

That's the whole pitch in one line. And notice the top row — at twelve thousand vectors HNSW is
only 4× faster, which circles right back to where we started: **at small N, don't bother.** The
data agrees with the advice.

**Where does HNSW's value run out? Three places, and they're serious.**

**Memory.** HNSW stores the full vectors **plus** the graph. Measured: 230 megabytes, against
IVF-PQ's 6.4. That's **36× more memory.** And there's your one-sentence comparison for the whole
talk: **HNSW buys speed with RAM. IVF-PQ buys RAM with accuracy.**

**Deletes are genuinely awkward.** You cannot cleanly cut a node out of the graph without risking
disconnecting part of it, so implementations use tombstones and rebuild periodically. If your data
is high-churn — sessions, carts, ephemeral documents — that's a real operational cost, not a
footnote. Ask about it before you pick a database.

**Build time.** You saw it: 8 seconds for 200,000. At ten million it's hours. Check whether your
system can build and serve at the same time, because eventually you'll need to.

---

# 0:50 — 5. The ledger

Let me put all of it on one scoreboard. Same problem, same machine, all measured.

[Show the ledger table. This is your closing slide — leave it up through Q&A.]

| Step | ms/query | speedup | memory | recall@10 | What it bought |
|---|---|---|---|---|---|
| Exact (numpy) | 3.959 | 1× | 204.8 MB | 1.000 | correctness + ground truth |
| **+ IVF** (nprobe=16) | 0.122 | 32× | 204.8 MB | 1.000 | 32× less data scanned |
| **+ PQ** (IVF-PQ) | 0.093 | 43× | **6.4 MB** | 0.485 | 32× less memory |
| **+ rerank** (top-100) | 0.127 | 31× | **6.4 MB** | 0.971 | recall bought back, ~free |
| **HNSW** (efSearch=100) | 0.147 | 27× | 230.4 MB | 0.988 | best recall/latency — for RAM |

Read the memory column and the recall column together. That's the entire engineering trade in this
field: **the bottom two rows are the same speed and nearly the same quality, and one of them uses
36× less memory.** That's your decision.

[Show the recall-vs-QPS chart.]

And here's that standard chart, built from our numbers. IVF sweeping `nprobe`, HNSW sweeping
`efSearch`, the two IVF-PQ points, and exact search. Up and to the right wins. **Every technique
in this talk was a way to push a point up and to the right on this plot.**

**So how do you choose? Read straight down.**

- **Under 100,000 vectors** — brute force. Three lines of numpy. Don't add an index.
- **Fits in RAM, and you want the best quality per millisecond** — **HNSW**. It's the default in
  every major system for a reason.
- **RAM is your constraint, or you're past a hundred million vectors** — **IVF-PQ, with reranking.**
  Non-negotiable on the reranking.
- **And always** — keep exact search around as the ruler.

**That's the entire decision tree.** Two indexes, and you pick by asking which resource you're
short of: if it's RAM, IVF-PQ; if it's latency or recall, HNSW. There are exotic hybrids out
there, and you don't need them until one of these two demonstrably fails you.

One more, and it's the one I'd actually lead with in a design review: **if you're already on
Postgres, `pgvector` gives you HNSW in the database you already run.** It'll take you into the tens
of millions of rows. One less system to operate beats a marginally better index almost every time.

---

# 0:54 — 6. The gotcha that actually decides your architecture

I have four minutes left and I want to spend them on the thing that will actually bite you,
because everything I've shown you assumed the query is *just* a vector.

Real queries are never just a vector. Real queries look like:

> Nearest neighbors **WHERE** `tenant_id = 47` **AND** `status = 'open'` **AND** `created_at > last_monday`.

Let me show you what happens if you do the obvious thing.

[Show the filtering cell.]

The obvious thing is **post-filtering**: run normal ANN search, then drop the results that fail the
predicate. I tagged 2% of our tickets as "priority" — a completely ordinary filter selectivity —
and searched.

**We asked for 10 results. On average we got 0.18. Eighty-four percent of queries returned
absolutely nothing.**

[Let that sit.]

That is not a tuning problem. **That is a broken product feature.** There were nearly four thousand
matching tickets in the corpus — plenty of good answers — they just weren't in the top 10 by pure
vector similarity. The user gets an empty page and concludes your search is broken, which, fairly,
it is.

The fix is to push the predicate **into** the search, so the index keeps walking until it has
enough *matching* results. In faiss that's an `IDSelector`.

| Strategy | Avg results out of 10 |
|---|---|
| post-filter (search, then drop) | **0.18** |
| IVF + IDSelector (pushed down) | **10.00** |
| HNSW + IDSelector (pushed down) | **10.00** |

Same index, same query, same filter. **Zero-point-one-eight versus ten**, entirely determined by
whether the predicate went into the search or after it.

**Filtered search deserves its own talk, and if there's appetite I'll give it.** The short version
of what I'm leaving out:

- **Pre-filtering** — materialize the matching IDs and just brute-force those — wins when the
  filter is *very* selective. If only 500 tickets match, scan the 500. Don't be clever.
- **Filtered graph traversal degrades** when the filter is selective *and* the matches are
  scattered: the walk burns its whole budget stepping through rejected nodes and can strand itself.
- **Partitioned indexes** — one index per tenant — sidestep the whole problem, at the cost of many
  small indexes and worse memory locality.
- Every vector database handles this differently, and their marketing pages mostly don't tell you
  how. **This, more than raw QPS, is what should decide which one you pick.** Benchmark it with
  your real filter selectivity before you commit.

---

# 0:58 — Close

Four techniques. That's all this was.

**kNN** — exact, correct, and linear, which is what kills it. **ANN** — the bargain: trade a little
recall for a lot of speed, and measure exactly how much you traded. **IVF-PQ** — partition so you
scan less, compress so each scan is cheap, rerank so the compression doesn't cost you quality.
**HNSW** — skip the partitioning and the compression entirely, build a graph, and walk it in
logarithmic time.

Three things I'd like you to actually leave with:

**One.** Under a hundred thousand vectors, the answer is three lines of numpy. Check your row count
before you check out a vector database.

**Two.** If you use PQ, rerank. Point-four-eight-five to point-nine-seven-one for 35
microseconds. It is the cheapest quality win in this entire field and it is routinely missing.

**Three.** Recall degrades **silently**. There's no exception, no alert, no 500 — just quietly
worse results and a slow drift in whatever metric you actually care about. Ship the ground-truth
job *with* the index, not after the incident. That weekly diff against exact search is the only
smoke detector you get.

The notebook is at `notebooks/talk-vector-search.ipynb`. Every number I put on a slide comes out of
it. There's a section at the end called "Things to try" with seven experiments — my favorite is
number two: set the number of topics to 1, so the data has no cluster structure at all, and watch
every single technique here collapse. That's the curse of dimensionality with the gloves off, and
it's also a warning about benchmarking on random vectors.

Questions.

---

# 1:00 — Q&A: the ones you'll actually get

**"Why not just use Postgres?"**
You can, and often should. `pgvector` supports both IVFFlat and HNSW and is fine into the tens of
millions of rows. One less system to operate beats a better index most of the time. I'd make you
justify *not* using it.

**"How does this relate to RAG?"**
This *is* the retrieval step in RAG. Every knob in this talk is a knob on your RAG quality, and
it's usually the cheapest quality lever available — cheaper than prompt engineering, much cheaper
than fine-tuning. If your RAG is returning weak context, measure recall before you touch the
prompt.

**"Is GPU brute force competitive?"**
Further than you'd expect. faiss on GPU does *exact* search over a few million vectors fast enough
for a lot of real workloads. Sometimes renting a GPU is genuinely cheaper than the engineering time
to tune an index, and you get recall 1.0. Worth pricing before you assume you need ANN.

**"What about LSH — locality-sensitive hashing?"**
Historically important, largely superseded by graph methods on the recall-versus-speed curve. It
still shows up where you need the hash itself — dedup, sketching, streaming. For top-k retrieval,
HNSW beats it, which is why I left it out of the four.

**"How do I pick `nlist` / `M` / `efConstruction`?"**
Start at `nlist ≈ sqrt(N)`, `M = 16`, `efConstruction = 200`. Then tune only `nprobe` or `efSearch`
against your own recall target — those are the two that don't require a rebuild. And be generous
with `efConstruction` specifically: it costs build time and is **free at query time**. It's the one
knob with no runtime downside.

**"What do we do about updates?"**
IVF handles inserts easily; the centroids just get stale, so schedule retraining. HNSW handles
inserts fine and deletes badly — tombstone and rebuild. If you're high-churn, ask that question
loudly during database selection, because it's where the differences are biggest and the docs are
quietest.

**"How often should we re-measure recall?"**
Weekly, on sampled production queries, against cached exact ground truth. It's a cron job and about
thirty lines. You want it in place *before* you need it, because the failure mode is invisible.
