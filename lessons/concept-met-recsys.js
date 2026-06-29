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
      `<p>One user. Their truly relevant items are $R=\\{B, D, E\\}$, so $|R|=3$. Your top-5 list, with each slot's relevant flag and position discount $1/\\log_2(i+1)$:</p>
       <table class="extable">
         <caption>The top-5 list. DCG gain = flag × discount.</caption>
         <thead><tr><th class="num">position $i$</th><th>item</th><th class="num">$\\text{rel}_i$</th><th class="num">$1/\\log_2(i+1)$</th><th class="num">DCG gain</th></tr></thead>
         <tbody>
           <tr><td class="num">1</td><td>B</td><td class="num">1</td><td class="num">1.000</td><td class="num">1.000</td></tr>
           <tr><td class="num">2</td><td>X</td><td class="num">0</td><td class="num">0.631</td><td class="num">0.000</td></tr>
           <tr><td class="num">3</td><td>D</td><td class="num">1</td><td class="num">0.500</td><td class="num">0.500</td></tr>
           <tr><td class="num">4</td><td>Y</td><td class="num">0</td><td class="num">0.431</td><td class="num">0.000</td></tr>
           <tr><td class="num">5</td><td>E</td><td class="num">1</td><td class="num">0.387</td><td class="num">0.387</td></tr>
         </tbody>
       </table>
       <ul class="steps">
         <li><b>Precision@5</b> $= \\frac{1+0+1+0+1}{5} = \\frac{3}{5} = 0.60$. Three of the five shown were good.</li>
         <li><b>Recall@5</b> $= \\frac{3}{|R|} = \\frac{3}{3} = 1.0$. You caught all three relevant items.</li>
         <li><b>HR@5</b> $= 1$ (at least one relevant item appeared).</li>
         <li><b>MRR:</b> first relevant item ($B$) is at position $r=1$, so $1/r = 1.0$.</li>
         <li><b>DCG@5</b> = sum of the DCG-gain column = $1.000 + 0 + 0.500 + 0 + 0.387 = 1.887$.</li>
         <li><b>IDCG@5</b> (perfect order $[B,D,E,\\dots]$) $= 1.000 + 0.631 + 0.500 = 2.131$.</li>
         <li><b>NDCG@5</b> $= 1.887 / 2.131 \\approx 0.886$. Good, but not perfect — the relevant items were not all at the very top.</li>
       </ul>
       <p>Now a rating example with two items: true ratings $[5, 3]$, predicted $[4, 1]$.</p>
       <table class="extable">
         <caption>Rating errors feed MAE and RMSE.</caption>
         <thead><tr><th>item</th><th class="num">true $y_i$</th><th class="num">pred $\\hat{y}_i$</th><th class="num">$|y_i-\\hat{y}_i|$</th><th class="num">$(y_i-\\hat{y}_i)^2$</th></tr></thead>
         <tbody>
           <tr><td class="row-h">1</td><td class="num">5</td><td class="num">4</td><td class="num">1</td><td class="num">1</td></tr>
           <tr><td class="row-h">2</td><td class="num">3</td><td class="num">1</td><td class="num">2</td><td class="num">4</td></tr>
         </tbody>
       </table>
       <ul class="steps">
         <li><b>MAE</b> $= \\frac{1+2}{2} = 1.5$ — the average absolute miss.</li>
         <li><b>RMSE</b> $= \\sqrt{\\frac{1+4}{2}} = \\sqrt{2.5} \\approx 1.58$ — slightly higher, because the size-2 miss is squared before averaging.</li>
       </ul>`,

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
    question: "One user, R={B,D,E}, top list [B,X,D,Y,E,...]: how do Precision@k, Recall@k, HR@k and NDCG@k behave as k grows, how is NDCG@5 built, how does MAP average per-hit precisions, how does RMSE punish a big miss more than MAE? Then the shapes that bite: a good-ranking model whose Coverage collapses onto blockbusters while accuracy keeps climbing, and an NDCG curve that flatlines because every hit sits at the bottom of the list.",
    charts: [
      {
        type: "line",
        title: "Healthy: Precision@k, Recall@k, HR@k, NDCG@k vs k (R={B,D,E}, rel=[1,0,1,0,1,0,0,0])",
        xlabel: "k (number of top items looked at)",
        ylabel: "metric value",
        series: [
          { name: "Precision@k = hits/k", color: "#ff7b72", points: [[1, 1.0], [2, 0.5], [3, 0.667], [4, 0.5], [5, 0.6], [8, 0.375]] },
          { name: "Recall@k = hits/|R|", color: "#4ea1ff", points: [[1, 0.333], [2, 0.333], [3, 0.667], [4, 0.667], [5, 1.0], [8, 1.0]] },
          { name: "HR@k (any hit?)", color: "#ffb454", points: [[1, 1.0], [2, 1.0], [3, 1.0], [4, 1.0], [5, 1.0], [8, 1.0]] },
          { name: "NDCG@k", color: "#7ee787", points: [[1, 1.0], [2, 0.613], [3, 0.704], [4, 0.704], [5, 0.885], [8, 0.885]] }
        ],
        interpret: "x-axis = how many top items you inspect (k); y-axis = the metric. Blue Recall climbs monotonically to 1.0 — more slots can only catch more of the 3 relevant items. Red Precision wobbles DOWN as k grows because you dilute the good slots with junk. Orange HR is flat at 1.0 (a hit appeared at k=1, and you can't 'un-hit'). Green NDCG ratchets up at each hit then plateaus once all relevant items are covered. <b>Read it as:</b> precision and recall trade off against k — pick k from how many slots your screen shows, then read the metrics at that k."
      },
      {
        type: "bars",
        title: "NDCG@5 = DCG@5 / IDCG@5 = 1.887 / 2.131 = 0.885 (gain = rel / log2(i+1))",
        xlabel: "list / position",
        ylabel: "gain contributed",
        labels: ["pos1 B", "pos2 X", "pos3 D", "pos4 Y", "pos5 E", "DCG@5 total", "IDCG@5 (ideal)"],
        values: [1.0, 0.0, 0.5, 0.0, 0.387, 1.887, 2.131],
        valueLabels: ["1.0", "0", "0.5", "0", "0.387", "1.887", "2.131"],
        colors: ["#7ee787", "#9aa7b4", "#7ee787", "#9aa7b4", "#7ee787", "#4ea1ff", "#c89bff"],
        interpret: "Green bars are the relevant items, grey bars the irrelevant ones (zero gain). Notice the green bars SHRINK down the list: the same relevant item is worth 1.0 at slot 1 but only 0.387 at slot 5 — that is the position discount, log2(i+1). Blue sums the greens into DCG=1.887. Purple is IDCG, the score of the perfect order (all three relevant items first) = 2.131. NDCG divides them -> 0.885. <b>Read it as:</b> NDCG rewards putting relevant items HIGH, not just present; 1.0 only if every hit is at the very top."
      },
      {
        type: "bars",
        title: "MAP = mean of AP; AP averages precision at each hit (u1 AP=0.756, u2 AP=0.5 -> MAP=0.628)",
        xlabel: "precision recorded at each relevant hit",
        ylabel: "precision value",
        labels: ["u1 hit@1=1/1", "u1 hit@3=2/3", "u1 hit@5=3/5", "u1 AP", "u2 AP", "MAP"],
        values: [1.0, 0.667, 0.6, 0.756, 0.5, 0.628],
        valueLabels: ["1.0", "0.667", "0.6", "0.756", "0.5", "0.628"],
        colors: ["#4ea1ff", "#4ea1ff", "#4ea1ff", "#7ee787", "#ffb454", "#c89bff"],
        interpret: "Blue bars are the precision measured at each moment user1 hits a relevant item as you walk down the list (1/1, then 2/3, then 3/5). Green averages those into user1's Average Precision = 0.756. Orange is a second user's AP (0.5). Purple is MAP, the mean across users = 0.628. <b>Read it as:</b> AP rewards clustering MANY relevant items near the top (each later hit is recorded at a lower precision, so deep hits hurt). MAP is the per-user average — a single number for the whole population."
      },
      {
        type: "bars",
        title: "RMSE punishes the big miss: true [5,3], pred [4,1] -> errors [1,2] -> MAE 1.5 < RMSE 1.58",
        xlabel: "quantity",
        ylabel: "stars",
        labels: ["|err| item1", "|err| item2", "MAE (avg |err|)", "RMSE (sqrt mean err^2)"],
        values: [1.0, 2.0, 1.5, 1.581],
        valueLabels: ["1.0", "2.0", "1.5", "1.581"],
        colors: ["#9aa7b4", "#ff7b72", "#4ea1ff", "#c89bff"],
        interpret: "Grey and red are the two per-item rating errors (1 star and 2 stars off). Blue MAE just averages them (1.5). Purple RMSE squares first, averages, then square-roots — which inflates the bigger error, so RMSE (1.58) sits ABOVE MAE. <b>Read it as:</b> the gap between the blue and purple bars is a tell for outliers — when RMSE >> MAE, a few big misses dominate. Use these only when the product shows a predicted number (stars); for a ranked list, use the ranking metrics above."
      },
      {
        type: "bars",
        title: "Accuracy alone hides catalog collapse: Coverage & Diversity (personalized vs blockbuster list)",
        xlabel: "metric",
        ylabel: "value (0..1)",
        labels: ["Coverage personalized", "Coverage popularity", "Diversity varied list", "Diversity blockbuster list"],
        values: [0.621, 0.01, 0.697, 0.01],
        valueLabels: ["0.62", "0.01", "0.70", "0.01"],
        colors: ["#7ee787", "#ff7b72", "#7ee787", "#ff7b72"],
        interpret: "Pairs of bars: green is a healthy personalized system, red is one that recommends the same blockbusters to everyone. Coverage (fraction of the catalog ever shown) collapses 0.62 -> 0.01, and intra-list Diversity collapses 0.70 -> 0.01. Crucially, an accuracy metric like NDCG would look FINE in both cases. <b>Read it as:</b> when these two bars go red, your model has collapsed onto a handful of popular items even though accuracy stayed high — this is the failure accuracy cannot see."
      },
      {
        type: "line",
        title: "Variant — the collapse over training: NDCG keeps rising while Coverage dies (illustrative)",
        xlabel: "training epoch (optimising accuracy only)",
        ylabel: "value (0..1)",
        series: [
          { name: "NDCG@10 (accuracy)", color: "#7ee787", points: [[1, 0.62], [2, 0.71], [3, 0.77], [4, 0.80], [5, 0.82], [6, 0.83]] },
          { name: "Coverage", color: "#ff7b72", points: [[1, 0.45], [2, 0.34], [3, 0.22], [4, 0.12], [5, 0.06], [6, 0.04]] },
          { name: "Personalization", color: "#ffb454", points: [[1, 0.58], [2, 0.46], [3, 0.31], [4, 0.18], [5, 0.09], [6, 0.05]] }
        ],
        interpret: "Illustrative. x-axis = training epochs while optimising accuracy ALONE. The green accuracy curve rises and looks like steady progress. But the red Coverage and orange Personalization curves slide toward zero: the model is learning that recommending the same few blockbusters to everyone is the safest way to score hits. <b>How to recognise it:</b> the green and red curves DIVERGE — accuracy up, catalog metrics down. <b>What it means:</b> popularity collapse / long-tail starvation; set floors on Coverage and Diversity, and reward Novelty/Serendipity, before shipping."
      },
      {
        type: "bars",
        title: "Variant — NDCG@5 near zero: every hit dumped at the BOTTOM (illustrative)",
        xlabel: "list / position",
        ylabel: "gain contributed",
        labels: ["pos1 X", "pos2 Y", "pos3 Z", "pos4 D", "pos5 E", "DCG@5", "IDCG@5", "NDCG@5"],
        values: [0.0, 0.0, 0.0, 0.4307, 0.3869, 0.8176, 2.1309, 0.3837],
        valueLabels: ["0", "0", "0", "0.431", "0.387", "0.818", "2.131", "0.384"],
        colors: ["#9aa7b4", "#9aa7b4", "#9aa7b4", "#ffb454", "#ffb454", "#4ea1ff", "#c89bff", "#ff7b72"],
        interpret: "Illustrative: same 3 relevant items as the healthy chart, but ranked LAST instead of interleaved at the top — list [X,Y,Z,D,E]. The orange relevant bars now sit at slots 4-5 where the position discount is steep, so DCG is only 0.818 against the same ideal IDCG 2.131, giving NDCG 0.384 (red). <b>How to recognise it:</b> Recall@5 and HR@5 are still high (the items ARE in the top-5) yet NDCG is poor. <b>What it means:</b> the right items are present but badly ORDERED — exactly the gap NDCG exists to catch and that a hit-rate metric would miss."
      }
    ],
    caption: "Charts 1-5 build the metrics on the lesson's worked example (all numbers computed below). Charts 6-7 are the failure shapes: a model whose accuracy keeps climbing while Coverage/Personalization die (the blockbuster collapse over training), and a list where the right items are present but ranked at the bottom so NDCG craters while Recall and HR stay high. Each chart's own interpret box explains how to read it.",
    code: `import numpy as np

# ---- one user's ranked list; R = {B,D,E}, |R| = 3 ----
rel = np.array([1, 0, 1, 0, 1, 0, 0, 0])   # rel[i]=1 if top item i is relevant
nR = 3

def dcg(rels):
    rels = np.asarray(rels, float)
    return np.sum(rels / np.log2(np.arange(2, len(rels) + 2)))

ks = [1, 2, 3, 4, 5, 8]
for k in ks:
    r = rel[:k]
    idcg = dcg(np.ones(min(k, nR)))
    print("k", k,
          "P", round(r.sum()/k, 3),
          "R", round(r.sum()/nR, 3),
          "HR", 1.0 if r.sum() > 0 else 0.0,
          "NDCG", round(dcg(r)/idcg, 3))
# k1 P1.0 R0.333 HR1 NDCG1.0 ... k5 P0.6 R1.0 NDCG0.885

# ---- NDCG@5 breakdown ----
gains = rel[:5] / np.log2(np.arange(2, 7))   # [1.0, 0, 0.5, 0, 0.387]
print("DCG@5", round(gains.sum(), 3),               # 1.887
      "IDCG@5", round(dcg(np.ones(3)), 3),          # 2.131
      "NDCG@5", round(gains.sum()/dcg(np.ones(3)), 3))  # 0.885

# ---- MAP = mean of per-user Average Precision ----
def ap(r):
    hits, precs = 0, []
    for i, f in enumerate(r, start=1):
        if f:
            hits += 1
            precs.append(hits / i)
    return np.mean(precs) if precs else 0.0
ap1 = ap(rel)                       # 0.756 from [1.0, 0.667, 0.6]
ap2 = ap([0, 1, 0, 1, 0])           # 0.5 from [0.5, 0.5]
print("AP1", round(ap1, 3), "AP2", round(ap2, 3),
      "MAP", round(np.mean([ap1, ap2]), 3))   # 0.628

# ---- RMSE vs MAE on the lesson's rating pair ----
yt, yp = np.array([5., 3.]), np.array([4., 1.])
e = np.abs(yp - yt)                  # [1, 2]
print("MAE", round(e.mean(), 3),                       # 1.5
      "RMSE", round(np.sqrt((e**2).mean()), 3))        # 1.581

# ---- beyond-accuracy: coverage + intra-list diversity ----
catalog = 1000
cov_personalized = 621 / catalog     # many distinct items recommended -> 0.621
cov_popularity   = 10 / catalog      # SAME top-10 for everyone        -> 0.01
print("coverage", cov_personalized, cov_popularity)

def diversity(vecs):                 # avg pairwise (1 - cosine) within one list
    v = vecs / np.linalg.norm(vecs, axis=1, keepdims=True)
    s = v @ v.T
    iu = np.triu_indices(len(v), 1)
    return float((1 - s[iu]).mean())
varied      = diversity(np.array([[1,0,0],[0,1,0],[0.2,0.1,0.97],[0.1,0.9,0.4]], float))
blockbuster = diversity(np.array([[1,0,0],[0.97,0.1,0],[0.95,0.2,0.05],[0.99,0.05,0.1]], float))
print("diversity", round(varied, 3), round(blockbuster, 3))   # 0.697  0.01`
  };
})();
