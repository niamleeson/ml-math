/* =====================================================================
   METRICS & EVALUATION LESSON (BEGINNER) — "met-recsys"
   Metrics for recommender systems.
   Self-contained: registers the lesson, its CODE, and its CODEVIZ.
   Cross-links: [met-ranking] (the general ranking-metric family) and the
   recommender lab (cls-recommender).
   ===================================================================== */
(function () {
  window.LESSONS.push({
    id: "met-recsys",
    title: "Metrics for recommender systems",
    tagline: "Score a list of suggestions: are the good items near the top, and is the catalog still alive?",
    module: "Metrics & Evaluation — measuring models, data & statistics",
    prereqs: ["ml-classification-metrics", "cls-recommender"],

    whenToUse:
      `<p>A <b>recommender system</b> is a model that suggests items to a user — videos, songs, products, friends. It does not give one answer; it gives an <i>ordered list</i> (a "top-N" list). So you grade the <i>list</i>, not a single prediction.</p>
       <p><b>Reach for the ranking metrics (Precision@k, Recall@k, NDCG@k, MAP, MRR, Hit Rate) when the system shows a ranked list of top-N items.</b> "@k" means "looking only at the first k items on the list" — k is how many slots the screen shows (a row of 10 thumbnails -&gt; k = 10). These metrics ask: are the items the user actually likes near the top?</p>
       <p><b>Reach for RMSE / MAE when the system predicts an explicit rating</b> — a number like "we think you'd give this 4.2 stars". Then the question is "how far off is the predicted star count?", which is a regression question, so you use regression error.</p>
       <p><b>Reach for the beyond-accuracy metrics (Coverage, Diversity, Novelty, Serendipity, Personalization) whenever the system runs in production.</b> A recommender can score high on accuracy and still be terrible: it learns to suggest only the few mega-popular items to everyone. Accuracy will not catch that — these metrics will. See the trade-off below and cross-link <code>[met-ranking]</code> for the underlying ranking math, and the recommender lab <code>[cls-recommender]</code> for the model that produces the lists.</p>`,

    application:
      `<p>Every "you might also like" row is graded with these. <b>Streaming</b> (Netflix, Spotify) tunes NDCG@k and Hit Rate on the home rows, then watches Coverage and Diversity so the catalog does not collapse onto blockbusters. <b>E-commerce</b> (Amazon) uses Precision@k and MAP on the recommendation carousel. <b>Rating-prediction</b> contests — the famous Netflix Prize — were scored purely on RMSE of predicted stars. <b>Social feeds and friend suggestions</b> watch Personalization and Serendipity so two different users do not see the same suggestions. In all of them the offline metric is a stand-in for the real goal (clicks, watch-time, purchases), which is why the pitfalls below matter so much.</p>`,

    pitfalls:
      `<ul>
         <li><b>Optimizing accuracy and killing diversity.</b> Tell: NDCG climbs but every user sees the same 20 hit items. A model can maximize "did they like it?" by only ever recommending the safest blockbusters. Fix: always report <b>Coverage</b> and intra-list <b>Diversity</b> alongside the accuracy number, and set a floor on them.</li>
         <li><b>Popularity bias.</b> Tell: a "recommend the globally most popular item to everyone" baseline scores almost as well as your fancy model. Popular items are popular partly <i>because</i> they were shown a lot, so accuracy metrics reward recommending them again. Fix: compare against that popularity baseline and reward <b>Novelty</b> / <b>Serendipity</b>, not just hits.</li>
         <li><b>The long tail gets starved.</b> Tell: 1% of items get 99% of the recommendations; most of the catalog is never suggested (low Coverage). Niche items that a few users would love are never surfaced. Fix: measure catalog Coverage and the share of long-tail items in the lists.</li>
         <li><b>Offline metrics do not match online engagement.</b> Tell: NDCG went up in the offline test but clicks went down in the A/B test. Offline metrics use <i>logged</i> data, which only contains items the old system already showed — they cannot see how users react to genuinely new suggestions. Fix: treat offline ranking metrics as a filter, then confirm with a live A/B test on real engagement.</li>
         <li><b>Using RMSE when nobody acts on a rating.</b> Tell: you report RMSE but the product shows a ranked list, not predicted stars. Low rating error does not guarantee a good <i>order</i>. Fix: if the output is a list, grade the list with ranking metrics, not RMSE.</li>
       </ul>`,

    bigIdea:
      `<p>Three families of questions, three families of metrics.</p>
       <p><b>1. Is the order good?</b> (ranking metrics) — the user sees a list; did you put the items they like near the top? Precision@k, Recall@k, NDCG@k, MAP, MRR, Hit Rate.</p>
       <p><b>2. Is the predicted number close?</b> (rating-prediction metrics) — if you guess a star rating, how far off is it? RMSE and MAE.</p>
       <p><b>3. Is the recommender actually good for the business?</b> (beyond-accuracy metrics) — does it use the whole catalog, show variety, surprise people, and treat users as individuals? Coverage, Diversity, Novelty, Serendipity, Personalization.</p>
       <p>The big trap: a model can ace family 1 and 2 and still fail family 3 by collapsing onto blockbusters. That is why all three exist.</p>`,

    buildup:
      `<p>Set up the words first. For one user, the recommender outputs a <b>ranked list</b> of items, best-guess first. Some items in the catalog are <b>relevant</b> to that user (they actually like them); the rest are not. "Relevant" is the ground truth — usually items the user clicked, bought, or rated highly in held-out data.</p>
       <p><b>@k</b> means "cut the list off after the first $k$ items and only look at those". A "hit" is a relevant item that appears in your list.</p>
       <p><b>The ranking metrics — defined one by one:</b></p>
       <ul>
         <li><b>Precision@k</b> — of the top $k$ items you showed, what fraction are relevant? "How clean is the top of the list?" High precision = little junk near the top.</li>
         <li><b>Recall@k</b> — of all the items the user actually likes, what fraction did you manage to fit into the top $k$? "How many of the good ones did you catch?" Recall rises as $k$ grows (more slots, more chances to catch them).</li>
         <li><b>Hit Rate / HR@k</b> — the simplest one. Did <i>at least one</i> relevant item make it into the top $k$? It is 1 if yes, 0 if no, averaged over users. "Did we get anything right at all?"</li>
         <li><b>NDCG@k</b> — Normalized Discounted Cumulative Gain. Like precision but <i>position-aware</i>: a relevant item at slot 1 is worth more than the same item at slot 8, because people look at the top first. It divides by the best-possible score so it lands in $[0,1]$ (1 = perfect order).</li>
         <li><b>MRR</b> — Mean Reciprocal Rank. Look only at <i>where the first relevant item appears</i>. If the first good item is at position $r$, you score $1/r$ (so position 1 -&gt; 1.0, position 2 -&gt; 0.5, position 4 -&gt; 0.25). Average over users. "How quickly do we hit a good item?" — perfect for "I just need one good answer" tasks like search.</li>
         <li><b>MAP</b> — Mean Average Precision. For one user, walk down the list; every time you hit a relevant item, record the precision <i>at that point</i>, then average those. That is Average Precision (AP). MAP is AP averaged over all users. It rewards putting <i>many</i> relevant items high up, not just one.</li>
       </ul>
       <p><b>The rating-prediction metrics</b> (when you predict a number like stars):</p>
       <ul>
         <li><b>MAE</b> — Mean Absolute Error. Average of the absolute gaps between predicted and true rating. "On average, how many stars off are we?" Easy to read, treats all errors equally.</li>
         <li><b>RMSE</b> — Root Mean Squared Error. Square each gap, average, take the square root. Same units as stars, but it <i>punishes big misses harder</i> than MAE because squaring blows up large errors.</li>
       </ul>
       <p><b>The beyond-accuracy metrics</b> (do the lists make a healthy product?):</p>
       <ul>
         <li><b>Coverage</b> (catalog coverage) — what fraction of the whole catalog ever shows up in <i>anyone's</i> recommendations? Low coverage = the system ignores most of your inventory.</li>
         <li><b>Diversity</b> (intra-list diversity) — within a <i>single</i> user's list, how different are the items from each other? Measured as average dissimilarity (1 minus similarity) between every pair. High = a varied list, not ten near-duplicates.</li>
         <li><b>Novelty</b> — how unfamiliar / non-obvious are the recommended items? Usually measured by how <i>unpopular</i> they are (recommending a smash hit is not novel; everyone knows it already).</li>
         <li><b>Serendipity</b> — items that are both <i>relevant</i> and <i>surprising</i> — a good suggestion the user would not have found on their own and that an obvious popularity baseline would not have made. "Relevant + unexpected."</li>
         <li><b>Personalization</b> — how different are two users' lists from each other? High personalization = the system tailors to the person; low = it shows everyone the same thing.</li>
       </ul>
       <p><b>The long-tail problem.</b> A catalog has a few mega-popular items (the "head") and a huge number of rarely-touched items (the "long tail"). If you grade only on accuracy, the safest bet is always to recommend head items — they are liked by almost everyone, so they reliably score hits. The model "collapses onto blockbusters": Coverage craters, Diversity and Novelty die, Personalization vanishes (everyone sees the same hits). The accuracy number stays high the whole time, which is exactly why you must watch Coverage and Diversity to catch the collapse. The chart below makes this concrete.</p>`,

    symbols: [
      { sym: "$k$", desc: "how many top items you look at (the cutoff). A row of 10 thumbnails means $k = 10$." },
      { sym: "$\\text{rel}_i$", desc: "is item at position $i$ relevant? $1$ if the user actually likes it, $0$ if not." },
      { sym: "$R$", desc: "the set of all items relevant to the user (the ground-truth 'good' items)." },
      { sym: "$|R|$", desc: "how many relevant items the user has in total — the size of $R$." },
      { sym: "$r$", desc: "the position of the FIRST relevant item in the list (used by MRR)." },
      { sym: "$\\hat{y}_i,\\ y_i$", desc: "the predicted rating and the true rating for item $i$ (used by RMSE / MAE)." },
      { sym: "$N$", desc: "the number of ratings, or the number of items in the catalog, depending on the metric." },
      { sym: "$\\text{sim}(a,b)$", desc: "a similarity score between two items $a$ and $b$ (e.g. cosine). $1 - \\text{sim}$ is their dissimilarity, used for Diversity." }
    ],

    formula:
      `$$ \\text{Precision@}k = \\frac{1}{k}\\sum_{i=1}^{k}\\text{rel}_i, \\qquad \\text{Recall@}k = \\frac{1}{|R|}\\sum_{i=1}^{k}\\text{rel}_i, \\qquad \\text{HR@}k = \\mathbb{1}\\!\\left[\\sum_{i=1}^{k}\\text{rel}_i > 0\\right] $$
       $$ \\text{NDCG@}k = \\frac{\\text{DCG@}k}{\\text{IDCG@}k},\\quad \\text{DCG@}k=\\sum_{i=1}^{k}\\frac{\\text{rel}_i}{\\log_2(i+1)}, \\qquad \\text{MRR}=\\frac{1}{|U|}\\sum_{u}\\frac{1}{r_u} $$
       $$ \\text{RMSE}=\\sqrt{\\tfrac{1}{N}\\textstyle\\sum_{i}(\\hat{y}_i-y_i)^2}, \\qquad \\text{MAE}=\\tfrac{1}{N}\\textstyle\\sum_{i}|\\hat{y}_i-y_i|, \\qquad \\text{Coverage}=\\frac{\\#\\{\\text{items ever recommended}\\}}{\\#\\{\\text{catalog}\\}} $$`,

    whatItDoes:
      `<p><b>Precision@k</b> sums the relevant flags in the top $k$ and divides by $k$ — the fraction of the top slots that are good. <b>Recall@k</b> divides that same sum by $|R|$ (all the user's relevant items) — the fraction you managed to surface. <b>HR@k</b> is just "is that sum &gt; 0?" — did anything good appear.</p>
       <p><b>NDCG@k</b>: DCG adds up the relevant flags but <i>discounts</i> each by $\\log_2(i+1)$, so an item deeper in the list contributes less. IDCG is the DCG of the perfect order (all relevant items first). Dividing by it normalizes to $[0,1]$. <b>MRR</b> averages $1/r_u$ — one over the rank of each user's first hit.</p>
       <p><b>RMSE / MAE</b> compare predicted and true ratings; RMSE squares the errors first (so big misses hurt more), MAE takes plain absolute values. <b>Coverage</b> counts how much of the catalog ever appears — a direct check on the long-tail collapse.</p>`,

    derivation:
      `<p><b>Why discount by position in NDCG?</b> Users read top-down and rarely scroll. So a relevant item at slot 1 is more useful than the same item at slot 10. The factor $1/\\log_2(i+1)$ is large near the top and shrinks slowly as you go down — a smooth "the lower, the less it counts". Normalizing by the best-possible order (IDCG) turns it into a 0-to-1 score you can compare across users with different numbers of relevant items.</p>
       <p><b>Why reciprocal rank in MRR?</b> If you only need <i>one</i> right answer fast (a search box), what matters is how far the user scrolls before hitting it. Position 1 is twice as good as position 2 ($1/1$ vs $1/2$), four times as good as position 4. The reciprocal captures "the cost of scrolling".</p>
       <p><b>Why RMSE punishes big errors.</b> Squaring turns a gap of 4 into 16 but a gap of 1 into 1 — so one large miss dominates the average. Taking the square root at the end puts the number back in star units. MAE skips the squaring, so every star of error counts the same; use MAE when an outlier rating should not dominate.</p>
       <p><b>Why accuracy alone causes catalog collapse.</b> Head items are liked by nearly everyone, so recommending them is the safest way to score hits. A pure accuracy objective therefore <i>pushes</i> the model toward a tiny set of blockbusters — high Precision/NDCG, near-zero Coverage. The only defense is to measure Coverage / Diversity / Novelty directly; they are the metrics that "see" the collapse the accuracy number hides.</p>`,

    example:
      `<p>One user. Their truly relevant items are $R=\\{B, D, E\\}$, so $|R|=3$. Your top-5 list is:</p>
       <ul class="steps">
         <li>Positions 1..5 = $[B,\\ X,\\ D,\\ Y,\\ E]$. Relevant flags $\\text{rel} = [1,0,1,0,1]$.</li>
         <li><b>Precision@5</b> $= \\frac{1+0+1+0+1}{5} = \\frac{3}{5} = 0.60$. Three of the five shown were good.</li>
         <li><b>Recall@5</b> $= \\frac{3}{|R|} = \\frac{3}{3} = 1.0$. You caught all three of their relevant items.</li>
         <li><b>HR@5</b> $= 1$ (at least one relevant item appeared).</li>
         <li><b>MRR:</b> first relevant item ($B$) is at position $r=1$, so $1/r = 1.0$.</li>
         <li><b>DCG@5</b> $= \\frac{1}{\\log_2 2}+\\frac{0}{\\log_2 3}+\\frac{1}{\\log_2 4}+\\frac{0}{\\log_2 5}+\\frac{1}{\\log_2 6} = 1 + 0 + 0.5 + 0 + 0.387 = 1.887$.</li>
         <li><b>IDCG@5</b> (perfect order $[B,D,E,\\dots]$) $= \\frac{1}{\\log_2 2}+\\frac{1}{\\log_2 3}+\\frac{1}{\\log_2 4} = 1 + 0.631 + 0.5 = 2.131$.</li>
         <li><b>NDCG@5</b> $= 1.887 / 2.131 \\approx 0.886$. Good, but not perfect — the relevant items were not all at the very top.</li>
       </ul>
       <p>Now a rating example: true ratings $[5, 3]$, predicted $[4, 1]$. Errors $[1, 2]$. <b>MAE</b> $=\\frac{1+2}{2}=1.5$. <b>RMSE</b> $=\\sqrt{\\frac{1^2+2^2}{2}}=\\sqrt{2.5}\\approx 1.58$ — slightly higher, because the size-2 miss is squared.</p>`,

    practice: [
      {
        q: `A top-3 list for a user whose relevant set is $R=\\{P,Q,R,S\\}$ ($|R|=4$) comes out as $[Q,\\ Z,\\ S]$. Compute Precision@3, Recall@3, HR@3, and MRR.`,
        steps: [
          { do: `Relevant flags: $Q$ is in $R$ -> 1; $Z$ is not -> 0; $S$ is in $R$ -> 1. So $\\text{rel}=[1,0,1]$.`, why: `Mark each shown item against the ground-truth relevant set $R$.` },
          { do: `Precision@3 $=\\frac{1+0+1}{3}=\\frac{2}{3}\\approx 0.67$.`, why: `Fraction of the 3 shown slots that are relevant.` },
          { do: `Recall@3 $=\\frac{2}{|R|}=\\frac{2}{4}=0.5$.`, why: `Of the 4 items the user likes, 2 made the top 3.` },
          { do: `HR@3 $=1$ and MRR $=\\frac{1}{1}=1.0$.`, why: `At least one relevant item appeared (HR), and the first relevant item $Q$ is at position 1, so $1/r=1$.` }
        ],
        answer: `Precision@3 $\\approx 0.67$, Recall@3 $=0.5$, HR@3 $=1$, MRR $=1.0$.`
      },
      {
        q: `Your model scores NDCG@10 = 0.81 (up from 0.78) but catalog Coverage dropped from 0.40 to 0.06 and Personalization fell sharply. What is happening, and which metric proves it?`,
        steps: [
          { do: `Read the accuracy signal: NDCG rose, so the items shown are well-ordered and relevant.`, why: `Accuracy alone looks like an improvement — this is the trap.` },
          { do: `Read the beyond-accuracy signals: Coverage 0.40 -> 0.06 means only 6% of the catalog is ever recommended; falling Personalization means users increasingly see the SAME items.`, why: `These are the symptoms of collapse onto blockbusters / the long-tail problem.` },
          { do: `Conclude: the model is maximizing hits by recommending a tiny set of popular head items to everyone.`, why: `Head items reliably score hits, so a pure-accuracy objective pushes the model there.` }
        ],
        answer: `The recommender has collapsed onto blockbusters (popularity bias / long-tail starvation). Coverage (0.40 -> 0.06) and the drop in Personalization prove it — the accuracy gain (NDCG) hid the collapse. Fix: set floors on Coverage / Diversity and reward Novelty / Serendipity.`
      },
      {
        q: `For a star-rating model, true ratings are $[4, 5, 2]$ and predictions are $[4, 4, 5]$. Compute MAE and RMSE, and say why they differ.`,
        steps: [
          { do: `Errors: $|4-4|=0$, $|5-4|=1$, $|2-5|=3$. So absolute errors $=[0,1,3]$.`, why: `Both metrics start from the per-item gaps.` },
          { do: `MAE $=\\frac{0+1+3}{3}=\\frac{4}{3}\\approx 1.33$.`, why: `MAE averages the absolute gaps, treating every star of error equally.` },
          { do: `RMSE $=\\sqrt{\\frac{0^2+1^2+3^2}{3}}=\\sqrt{\\frac{10}{3}}=\\sqrt{3.33}\\approx 1.83$.`, why: `Squaring makes the size-3 miss dominate, so RMSE &gt; MAE.` }
        ],
        answer: `MAE $\\approx 1.33$, RMSE $\\approx 1.83$. RMSE is larger because squaring punishes the single big (3-star) miss far more than MAE does.`
      }
    ]
  });

  window.CODE["met-recsys"] = {
    lib: "scikit-learn",
    runnable: false,
    explain: `<p>From-scratch <code>NumPy</code> for every top-N metric — Precision@k, Recall@k, NDCG@k, Hit Rate, catalog Coverage, and intra-list Diversity — plus RMSE / MAE for ratings. In production, reach for dedicated libraries: <code>recmetrics</code> (coverage / novelty / personalization helpers on top of pandas), <code>RecBole</code> (a full recommender benchmark with all these metrics built in), and <code>surprise</code> (rating-prediction models with RMSE / MAE evaluation).</p>`,
    code: `import numpy as np

# --- ranking metrics on ONE user's ranked list ---
# rel[i] = 1 if the item at position i is relevant to the user, else 0
rel = np.array([1, 0, 1, 0, 1])         # top-5 list, relevant at slots 1,3,5
n_relevant_total = 3                     # |R|: items the user actually likes

def precision_at_k(rel, k):
    return rel[:k].sum() / k

def recall_at_k(rel, k, n_relevant_total):
    return rel[:k].sum() / n_relevant_total

def hit_rate_at_k(rel, k):
    return 1.0 if rel[:k].sum() > 0 else 0.0

def dcg_at_k(rel, k):
    rel = rel[:k]
    discounts = np.log2(np.arange(2, len(rel) + 2))   # log2(i+1), i starts at 1
    return float((rel / discounts).sum())

def ndcg_at_k(rel, k, n_relevant_total):
    ideal = np.ones(min(k, n_relevant_total))         # perfect order: all relevant first
    idcg = dcg_at_k(ideal, k)
    return dcg_at_k(rel, k) / idcg if idcg > 0 else 0.0

k = 5
print("precision@5", round(precision_at_k(rel, k), 3))
print("recall@5   ", round(recall_at_k(rel, k, n_relevant_total), 3))
print("hit_rate@5 ", hit_rate_at_k(rel, k))
print("ndcg@5     ", round(ndcg_at_k(rel, k, n_relevant_total), 3))

# --- MRR: reciprocal rank of the FIRST relevant item, averaged over users ---
def mrr(list_of_rel):
    rr = []
    for r in list_of_rel:
        hit = np.nonzero(r)[0]
        rr.append(1.0 / (hit[0] + 1) if len(hit) else 0.0)
    return float(np.mean(rr))

print("MRR        ", round(mrr([rel, np.array([0, 1, 0])]), 3))

# --- rating-prediction metrics ---
y_true = np.array([5.0, 3.0, 4.0])
y_pred = np.array([4.0, 1.0, 4.0])
rmse = np.sqrt(np.mean((y_pred - y_true) ** 2))
mae  = np.mean(np.abs(y_pred - y_true))
print("RMSE       ", round(float(rmse), 3), " MAE", round(float(mae), 3))

# --- beyond-accuracy: catalog Coverage and intra-list Diversity ---
catalog_size = 1000
recommended_items = {3, 17, 42, 88, 91, 3, 17}        # union over ALL users' lists
coverage = len(set(recommended_items)) / catalog_size
print("coverage   ", round(coverage, 3))

# intra-list diversity = average pairwise dissimilarity (1 - cosine) within one list
item_vecs = np.array([[1, 0, 0], [0, 1, 0], [0.9, 0.1, 0], [0, 0, 1]], dtype=float)
item_vecs /= (np.linalg.norm(item_vecs, axis=1, keepdims=True) + 1e-9)
sims = item_vecs @ item_vecs.T
n = len(item_vecs)
iu = np.triu_indices(n, k=1)                           # each unordered pair once
diversity = float((1 - sims[iu]).mean())
print("diversity  ", round(diversity, 3))`
  };

  window.CODEVIZ["met-recsys"] = {
    question: "Run a REAL item-item recommender on the digits images: as we show more items (larger k), how do Precision@k, Recall@k, and NDCG@k trade off — and does personalizing beat a popularity baseline on catalog coverage?",
    charts: [
      {
        type: "line",
        title: "Ranking metrics vs k (real item-item recommender on load_digits)",
        xlabel: "k (number of recommended items shown)",
        ylabel: "metric value",
        series: [
          { name: "Precision@k", color: "#ff7b72", points: [[1, 1.0], [3, 0.99], [5, 0.984], [10, 0.967], [20, 0.939], [50, 0.865]] },
          { name: "Recall@k", color: "#4ea1ff", points: [[1, 0.006], [3, 0.017], [5, 0.028], [10, 0.054], [20, 0.105], [50, 0.242]] },
          { name: "NDCG@k", color: "#7ee787", points: [[1, 1.0], [3, 0.992], [5, 0.987], [10, 0.975], [20, 0.953], [50, 0.892]] }
        ]
      },
      {
        type: "bars",
        title: "Catalog coverage: personalized recommender vs popularity baseline",
        xlabel: "strategy",
        ylabel: "fraction of catalog ever recommended",
        labels: ["personalized (item-item)", "popularity (same top-10 for all)"],
        values: [0.621, 0.006],
        valueLabels: ["0.62", "0.006"],
        colors: ["#7ee787", "#ff7b72"]
      }
    ],
    caption: "Real numbers from load_digits (1797 images, 200 query users). As k grows, Precision@k falls (1.0 -> 0.865) and NDCG@k decays while Recall@k rises (0.006 -> 0.242) — the classic precision/recall trade-off. The popularity baseline shows the SAME 10 items to everyone, so it touches just 0.6% of the catalog; the personalized recommender reaches 62% — the long-tail / catalog-collapse story in one chart.",
    code: `import numpy as np
from sklearn.datasets import load_digits

# Real user-item ranking proxy: each "user" is a query image; the recommender
# returns the most cosine-similar OTHER images; an item is "relevant" if it is
# the same digit class as the query. This is a real item-item recommender.
rng = np.random.default_rng(0)
digits = load_digits()
X = digits.data.astype(float)
y = digits.target
X = X / (np.linalg.norm(X, axis=1, keepdims=True) + 1e-9)   # unit-norm -> dot = cosine

idx = rng.choice(len(X), 200, replace=False)                # 200 query users
S = X[idx] @ X.T                                             # 200 x 1797 similarities
for i, qi in enumerate(idx):
    S[i, qi] = -np.inf                                       # never recommend the query itself
order = np.argsort(-S, axis=1)                               # ranked lists, best first

def dcg(rels):
    rels = np.asarray(rels, float)
    return np.sum(rels / np.log2(np.arange(2, len(rels) + 2)))

ks = [1, 3, 5, 10, 20, 50]
prec, rec, ndcg = [], [], []
for k in ks:
    ps, rs, ns = [], [], []
    for i, qi in enumerate(idx):
        topk = order[i, :k]
        rel = (y[topk] == y[qi]).astype(float)
        n_rel = (y == y[qi]).sum() - 1                       # exclude the query itself
        ps.append(rel.sum() / k)
        rs.append(rel.sum() / n_rel)
        idcg = dcg(np.ones(min(k, n_rel)))
        ns.append(dcg(rel) / idcg if idcg > 0 else 0.0)
    prec.append(np.mean(ps)); rec.append(np.mean(rs)); ndcg.append(np.mean(ns))

print("k         ", ks)
print("precision ", [round(v, 3) for v in prec])   # [1.0, 0.99, 0.984, 0.967, 0.939, 0.865]
print("recall    ", [round(v, 3) for v in rec])    # [0.006, 0.017, 0.028, 0.054, 0.105, 0.242]
print("ndcg      ", [round(v, 3) for v in ndcg])   # [1.0, 0.992, 0.987, 0.975, 0.953, 0.892]

# Catalog coverage: personalized recs (top-10 each) vs a popularity baseline
N = len(X)
recset = set()
for i in range(len(idx)):
    recset.update(order[i, :10].tolist())
cov_model = len(recset) / N                          # ~0.62

avgsim = (X @ X.T).mean(0)                            # globally most-similar items
popset = set(np.argsort(-avgsim)[:10].tolist())      # SAME top-10 shown to everyone
cov_pop = len(popset) / N                            # ~0.006
print("coverage personalized", round(cov_model, 3), " popularity", round(cov_pop, 3))`
  };
})();
