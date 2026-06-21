/* =====================================================================
   STANDALONE LESSON — Scoring clusters with no labels.
   Module: Metrics & Evaluation. BEGINNER audience.
   Same gentle style as the rest of the app:
     - short sentences, one idea each
     - define EVERY symbol and term in plain English BEFORE using it
     - HTML teaching fields; math in $...$ / $$...$$ with DOUBLED backslashes
     - NEVER a raw "<" before a letter/number in prose — write &lt;
     - a worked example with real numbers and a REAL-data CODEVIZ
   Pushed into window.LESSONS; CODE + CODEVIZ merged by id.
   ===================================================================== */
(function () {
  window.LESSONS.push({
    id: "met-clustering",
    title: "Scoring clusters with no labels",
    tagline: "Two kinds of cluster score: internal (is each cluster tight and well separated?) and external (does it match the known truth?).",
    module: "Metrics & Evaluation — measuring models, data & statistics",
    prereqs: ["ml-kmeans", "mlx-clustering-metrics"],

    whenToUse:
      `<p><b>Clustering</b> means grouping data points so that similar ones land together, <i>without</i> being told the answer ahead of time. The hard part: once you have groups, how do you tell a good grouping from a bad one? There are two families of score, and which you reach for depends on one question — <b>do you have ground-truth labels to compare against?</b></p>
       <ul>
         <li><b>No labels (use INTERNAL metrics).</b> This is the normal case. You only have the points and the cluster each was assigned to. Internal metrics ask: <i>is each cluster tight, and are the clusters far apart from each other?</i> Use them to <b>choose the number of clusters $k$</b> — try $k=2,3,4,\\dots$, score each, and keep the $k$ that scores best. Reach for the <b>silhouette score</b> as your default, and cross-check with <b>Calinski–Harabasz</b> and <b>Davies–Bouldin</b>.</li>
         <li><b>You DO have labels (use EXTERNAL metrics).</b> Sometimes you have a held-out true grouping — species, customer segments a human tagged, a benchmark — and you want to <i>validate</i> how well an unsupervised algorithm recovered it. External metrics compare your clustering to that truth. Reach for the <b>Adjusted Rand Index (ARI)</b> and <b>Adjusted Mutual Information (AMI)</b> as defaults, because they are <b>corrected for chance</b> (a random clustering scores ~0).</li>
       </ul>
       <p><b>One-line memory aid:</b> internal = "is it tight &amp; separated?"; external = "does it match the truth?"</p>`,

    application:
      `<p>These scores show up everywhere clustering is used. <b>Customer segmentation</b>: marketers sweep $k$ with the silhouette to decide how many segments are real, not arbitrary. <b>Image / document grouping</b>: pick the number of topics or visual groups with Calinski–Harabasz. <b>Anomaly and fraud detection</b>: a point with a strongly negative silhouette sits between clusters and is worth flagging. <b>Benchmarking algorithms</b>: when a labeled dataset exists (single-cell biology, named-entity clusters, the iris flowers below), ARI and AMI rank competing methods fairly. <b>Vector-search and embeddings</b>: internal scores sanity-check that an embedding actually separates the classes you care about.</p>`,

    pitfalls:
      `<ul>
         <li><b>The silhouette favors round, convex blobs.</b> It is built on average distances, so it rewards ball-shaped clusters and <i>punishes</i> long, curved, or interleaved shapes (two moons, concentric rings) even when the clustering is correct. Fix: on non-convex data, judge with a density-aware view or compare against known labels (ARI / AMI) instead.</li>
         <li><b>Never compare <code>inertia</code> across different $k$ — it ALWAYS drops.</b> Inertia (within-cluster sum of squares) can only shrink as you add clusters; at $k=n$ it hits zero. So "smaller inertia" never tells you the right $k$. Fix: use the <b>elbow</b> (where the drop suddenly flattens) or a chance-corrected metric like the silhouette or the gap statistic.</li>
         <li><b>The plain Rand Index is NOT corrected for chance.</b> Two random clusterings can score a deceptively high Rand Index (often 0.6–0.7), so a big number means little. Fix: use the <b>Adjusted</b> Rand Index, which subtracts the expected-by-chance value so random scores ~0.</li>
         <li><b>Purity rewards making many tiny clusters.</b> Split every point into its own singleton cluster and purity hits a perfect $1.0$ while telling you nothing. Fix: never use purity alone for choosing $k$; pair it with a metric that penalizes over-splitting (V-measure, AMI), or fix $k$ first.</li>
         <li><b>Mutual Information (un-normalized) grows with more clusters.</b> Raw MI rises as you add clusters regardless of quality. Fix: use the <b>Normalized</b> (NMI) or, better, the <b>Adjusted</b> (AMI) version.</li>
         <li><b>Internal high, external low?</b> Tight-and-separated does not guarantee "matches the truth". A clustering can be geometrically clean yet split a real class in half. If you have labels, trust the external score for correctness.</li>
       </ul>`,

    bigIdea:
      `<p>Clustering hands you groups but no grades. A score has to come from one of two places.</p>
       <p><b>INTERNAL metrics</b> grade using only the points and their assigned cluster — no answer key. They all chase the same intuition: a good clustering has each cluster <b>tight</b> (members close together) and the clusters <b>far apart</b> (well separated). Tight + separated = good.</p>
       <p><b>EXTERNAL metrics</b> grade by comparing your clustering to a <b>known true grouping</b>. They ask: do points that the truth puts together end up together, and do points the truth keeps apart stay apart? Matches truth = good.</p>
       <p>Use internal scores to <b>choose $k$</b> when you have no labels; use external scores to <b>validate</b> when you do.</p>`,

    buildup:
      `<p>Picture three clean clouds of dots. "Tight" means small distances <i>inside</i> a cloud. "Separated" means large distances <i>between</i> clouds. Every internal metric is a different way to package those two numbers into one score.</p>
       <p>Now suppose someone hands you the true color of every dot. "Matches the truth" means: each pair of dots that share a true color also share a cluster, and each pair with different true colors lands in different clusters. Every external metric is a different way to count those agreements.</p>
       <p>Below, the under-the-hood section defines each member of both families with its formula and a tiny number.</p>`,

    symbols: [
      { sym: "$n$", desc: "the number of data points being clustered." },
      { sym: "$k$", desc: "the number of clusters (groups). With no labels you sweep $k=2,3,4,\\dots$ and score each." },
      { sym: "$C_i$", desc: "cluster number $i$; $|C_i|$ is how many points it contains; $c_i$ is its centroid (mean point)." },
      { sym: "$c$", desc: "the centroid of all the data (the global mean point)." },
      { sym: "$a,\\,b$", desc: "for one point in the silhouette: $a$ = its mean distance to its own cluster (tightness, smaller better); $b$ = its mean distance to the nearest other cluster (separation, larger better)." },
      { sym: "$s$", desc: "the silhouette of a point, $s=(b-a)/\\max(a,b)$, between $-1$ and $+1$." },
      { sym: "$U,\\,V$", desc: "two groupings of the same points: $U$ = the true labels, $V$ = your clustering. External metrics compare $U$ and $V$." },
      { sym: "$a,b,c,d$ (Rand)", desc: "counts over all pairs of points: $a$ = pairs together in both $U$ and $V$; $b$ = pairs together in $U$ only; $c$ = together in $V$ only; $d$ = apart in both." },
      { sym: "$H(\\cdot),\\,I(U;V)$", desc: "$H$ = entropy (a grouping's uncertainty in bits); $I(U;V)$ = mutual information (how much knowing one grouping tells you about the other)." }
    ],

    formula:
      `$$ s=\\frac{b-a}{\\max(a,b)} \\qquad \\text{ARI}=\\frac{\\text{RI}-\\mathbb{E}[\\text{RI}]}{\\max(\\text{RI})-\\mathbb{E}[\\text{RI}]} \\qquad \\text{NMI}=\\frac{I(U;V)}{\\sqrt{H(U)\\,H(V)}} $$`,

    whatItDoes:
      `<p>Three representative formulas — one internal (the silhouette), two external. The full roster is below.</p>
       <p><b>INTERNAL — grade tightness &amp; separation (no labels):</b></p>
       <ul>
         <li><b>Silhouette score</b> $s=\\dfrac{b-a}{\\max(a,b)}$, averaged over all points. Per point: $+1$ deep inside a tight, well-separated cluster; $\\approx 0$ on a border; negative if probably mis-assigned. Range $[-1,1]$; <b>higher is better</b>.</li>
         <li><b>Davies–Bouldin index (DBI).</b> For each cluster, find its worst rival: $(\\text{spread}_i+\\text{spread}_j)/\\text{dist}(c_i,c_j)$, where spread is the mean distance of members to their centroid. Average each cluster's worst ratio. It punishes fat clusters that sit close together — so <b>lower is better</b> (best is $0$).</li>
         <li><b>Calinski–Harabasz index (CH), the variance-ratio.</b> $\\text{CH}=\\dfrac{\\text{between-cluster spread}/(k-1)}{\\text{within-cluster spread}/(n-k)}$. The top is how far the cluster centers sit from the global center; the bottom is how scattered points are inside their cluster. Big top, small bottom = well separated &amp; tight, so <b>higher is better</b>.</li>
         <li><b>Dunn index.</b> $\\dfrac{\\text{smallest gap between any two clusters}}{\\text{largest diameter of any single cluster}}$. One bad (too-wide or too-close) cluster drags it down. <b>Higher is better</b>.</li>
         <li><b>Inertia / within-cluster sum of squares (WCSS).</b> $\\sum_i\\sum_{x\\in C_i}\\lVert x-c_i\\rVert^2$ — total squared distance of points to their own centroid. This is exactly what $k$-means minimizes. <b>Lower is tighter</b>, BUT it ALWAYS drops as $k$ grows, so use the <b>elbow</b>, never the raw value, to pick $k$.</li>
         <li><b>Gap statistic &amp; BIC for choosing $k$.</b> The <b>gap statistic</b> compares your inertia at each $k$ to the inertia you would get on random reference data with no structure; the best $k$ is where your clustering beats random by the most. <b>BIC (Bayesian Information Criterion)</b> does the same idea probabilistically for model-based clustering (e.g. Gaussian mixtures): it rewards fit and penalizes extra clusters, and you pick the $k$ with the best BIC. Both exist to dodge inertia's "always drops" trap.</li>
       </ul>
       <p><b>EXTERNAL — grade match to the truth (labels needed):</b></p>
       <ul>
         <li><b>Rand Index (RI).</b> Over every <i>pair</i> of points, the fraction the two groupings agree on (together-together or apart-apart): $\\text{RI}=(a+d)/(a+b+c+d)$. Range $[0,1]$, higher better — but <b>not chance-corrected</b>, so random clusterings score high.</li>
         <li><b>Adjusted Rand Index (ARI).</b> The Rand Index minus its expected-by-chance value, rescaled so a <b>random</b> clustering scores $\\approx 0$ and a perfect one scores $1$ (it can go slightly negative). This is the external default.</li>
         <li><b>Normalized Mutual Information (NMI)</b> $=\\dfrac{I(U;V)}{\\sqrt{H(U)H(V)}}$. Mutual information $I(U;V)$ is how much knowing the cluster tells you about the true label; dividing by the entropies $H$ scales it to $[0,1]$. Higher = the clustering carries more of the label's information.</li>
         <li><b>Adjusted Mutual Information (AMI).</b> NMI's chance-corrected cousin: subtracts the MI expected at random so it sits near $0$ for random clusterings. Prefer it over NMI when comparing across different $k$.</li>
         <li><b>Homogeneity, Completeness, V-measure.</b> <b>Homogeneity</b>: each cluster contains only ONE true class (no mixing inside a cluster). <b>Completeness</b>: each true class lands in ONE cluster (the class is not split across clusters). <b>V-measure</b> is their harmonic mean — like an F1 (the balanced average) for clustering — so it is high only when both hold. All three are in $[0,1]$, higher better.</li>
         <li><b>Fowlkes–Mallows index (FMI).</b> The geometric mean of pairwise precision and recall: $\\text{FMI}=\\sqrt{\\dfrac{a}{a+c}\\cdot\\dfrac{a}{a+b}}$ — of the pairs you put together, what fraction truly belong together, and of the pairs that truly belong together, what fraction did you find. Range $[0,1]$, higher better.</li>
         <li><b>Purity.</b> Assign each cluster the most common true label in it, then count how many points that gets right, divided by $n$. Simple and intuitive, but it <b>rewards tiny clusters</b> (singletons score a perfect $1$), so never use it alone to pick $k$.</li>
       </ul>`,

    derivation:
      `<p><b>Why these formulas measure what they claim.</b></p>
       <ul class="steps">
         <li><b>Silhouette is bounded in $[-1,1]$.</b> Both $a\\ge0$ and $b\\ge0$. If $a\\le b$ then $\\max=b$ and $s=(b-a)/b=1-a/b\\in[0,1]$. If $a\\gt b$ then $\\max=a$ and $s=(b-a)/a=b/a-1\\in[-1,0)$. So a point closer to a rival cluster than to its own ($a\\gt b$) is correctly flagged negative.</li>
         <li><b>Why "adjusted" exists.</b> A raw agreement count (Rand Index, mutual information) has a non-zero average even for random clusterings — and that average grows with $k$. Correcting subtracts that expectation: $\\text{adjusted}=\\dfrac{\\text{index}-\\mathbb{E}[\\text{index}]}{\\max-\\mathbb{E}[\\text{index}]}$. Now random $\\to 0$, perfect $\\to 1$, and scores are comparable across different $k$. This is the whole reason to prefer ARI over RI and AMI over NMI.</li>
         <li><b>Why inertia cannot pick $k$.</b> Add one more centroid and every point can only move to an equal-or-closer center, so $\\sum\\lVert x-c_i\\rVert^2$ can only stay the same or shrink. At $k=n$ each point IS its own center and inertia $=0$. A quantity that is monotone in $k$ carries no information about the <i>right</i> $k$ — hence the elbow and the gap statistic.</li>
         <li><b>Why homogeneity and completeness are two different things.</b> They are opposite failure modes. Over-splitting a true class into many pure clusters keeps homogeneity high but wrecks completeness. Merging two true classes into one cluster keeps completeness high but wrecks homogeneity. V-measure (their harmonic mean) is only large when both are, which is why it resists both kinds of cheating. $\\blacksquare$</li>
       </ul>`,

    example:
      `<p>Five points, true labels $U=[\\,A,A,A,B,B\\,]$. Your clustering $V=[\\,1,1,2,2,2\\,]$ — close but it splits the A's and lumps one A with the B's.</p>
       <ul class="steps">
         <li><b>Count over all $\\binom{5}{2}=10$ pairs.</b> A pair is "together" in a grouping if both points share a label/cluster.
           <ul>
             <li>$a$ = together in BOTH: pair $(1,2)$ only $\\Rightarrow a=1$.</li>
             <li>$b$ = together in $U$ only: A-pairs $(1,3),(2,3)$ are split in $V$ $\\Rightarrow b=2$.</li>
             <li>$c$ = together in $V$ only: $V$'s cluster 2 puts $(3,4),(3,5)$ together though their labels differ $\\Rightarrow c=2$. (Pair $(4,5)$ is together in both $U$ and $V$, so it is already counted in $a$ — recount: $a$ = $(1,2)$ and $(4,5)$ $\\Rightarrow a=2$.)</li>
             <li>$d$ = apart in both = the remaining $10-a-b-c$ pairs $\\Rightarrow d=10-2-2-2=4$.</li>
           </ul>
         </li>
         <li><b>Rand Index</b> $=\\dfrac{a+d}{10}=\\dfrac{2+4}{10}=0.60$. Looks decent — but a random clustering would score near this, which is exactly why we adjust.</li>
         <li><b>Fowlkes–Mallows</b> $=\\sqrt{\\dfrac{a}{a+c}\\cdot\\dfrac{a}{a+b}}=\\sqrt{\\dfrac{2}{4}\\cdot\\dfrac{2}{4}}=\\sqrt{0.25}=0.50$.</li>
         <li><b>Purity</b>: cluster 1 = $\\{A,A\\}$ (majority A, 2 right); cluster 2 = $\\{A,B,B\\}$ (majority B, 2 right). Purity $=(2+2)/5=0.80$. Note how it ignores that the A class got torn apart — that is the over-split blind spot.</li>
         <li><b>Takeaway.</b> Three metrics, three different verdicts on the SAME clustering. The chance-corrected ARI (computed in code) lands much lower than the raw RI of $0.60$, which is the honest number.</li>
       </ul>`,

    practice: [
      {
        q: `You run $k$-means for $k=2,3,4,5$ and the within-cluster inertia is $152,\\,79,\\,57,\\,46$. A teammate says "$k=5$ has the lowest inertia, so use 5 clusters." Why is that wrong, and what should you do?`,
        steps: [
          { do: `Recall how inertia behaves as $k$ grows.`, why: `Adding a centroid can only keep points at an equal-or-closer center, so inertia can only drop — it is monotone in $k$.` },
          { do: `Notice the drops: $152\\to79$ (big), $79\\to57$ (smaller), $57\\to46$ (small).`, why: `The right $k$ is the elbow — where extra clusters stop buying much tightness — not the smallest value.` },
          { do: `Cross-check with a chance-aware internal score.`, why: `The silhouette or gap statistic does not blindly reward more clusters, so it can actually pick $k$.` }
        ],
        answer: `<p>Lowest inertia never picks $k$ — inertia ALWAYS falls as $k$ rises and hits $0$ at $k=n$. The big drop is $152\\to79$ (going from $2$ to $3$) and it flattens after, so the <b>elbow is at $k=3$</b>. Confirm with the silhouette / gap statistic, which (unlike inertia) penalize over-splitting. On the iris data below, the elbow and the truth both say $3$.</p>`
      },
      {
        q: `You cluster with no labels and your silhouette peaks at $k=2$, but you happen to know there are really $3$ true classes (and ARI vs the truth peaks at $k=3$). Which score do you trust, and why the disagreement?`,
        steps: [
          { do: `Identify each metric's family.`, why: `Silhouette is INTERNAL (tight &amp; separated, no labels); ARI is EXTERNAL (matches the known truth).` },
          { do: `Ask what each is optimizing.`, why: `If two of the three true classes overlap, merging them into one blob looks tighter &amp; more separated — so the silhouette prefers $k=2$.` },
          { do: `Decide based on whether you trust the labels.`, why: `When ground truth exists and you trust it, "matches the truth" is the goal, so ARI wins.` }
        ],
        answer: `<p>Trust <b>ARI ($k=3$)</b> here, because you have ground truth and the question is correctness. The silhouette prefers $k=2$ because two of the three real classes overlap, so merging them yields a tighter, more-separated geometry — that is the classic "silhouette favors convex blobs" pitfall. Internal metrics answer "is it tight &amp; separated?", which is not the same as "does it match the truth?" This exact split shows up on iris below.</p>`
      }
    ]
  });

  window.CODE["met-clustering"] = {
    lib: "scikit-learn",
    runnable: true,
    packages: ["numpy", "scikit-learn"],
    explain: `<p>The real API for both families on one $k$-means fit. <b>Internal</b> (no labels): <code>silhouette_score</code>, <code>davies_bouldin_score</code>, <code>calinski_harabasz_score</code>. <b>External</b> (need true labels): <code>adjusted_rand_score</code>, <code>normalized_mutual_info_score</code>, <code>adjusted_mutual_info_score</code>, <code>homogeneity_completeness_v_measure</code>, <code>fowlkes_mallows_score</code>. All numbers printed are real outputs on the iris data.</p>`,
    code: `import numpy as np
from sklearn.datasets import load_iris
from sklearn.cluster import KMeans
from sklearn.metrics import (
    silhouette_score, davies_bouldin_score, calinski_harabasz_score,   # INTERNAL: no labels
    adjusted_rand_score, normalized_mutual_info_score,                  # EXTERNAL: need truth
    adjusted_mutual_info_score, homogeneity_completeness_v_measure,
    fowlkes_mallows_score,
)

iris = load_iris()
X, y_true = iris.data, iris.target          # y_true: the 3 real species (held out)

labels = KMeans(n_clusters=3, n_init=10, random_state=0).fit_predict(X)

# INTERNAL — is each cluster tight and well separated? (uses only X + labels)
print("silhouette        :", round(silhouette_score(X, labels), 3))        # higher better, [-1,1]
print("davies_bouldin    :", round(davies_bouldin_score(X, labels), 3))    # LOWER better, >= 0
print("calinski_harabasz :", round(calinski_harabasz_score(X, labels), 1)) # higher better

# EXTERNAL — does the clustering match the true species? (compare labels to y_true)
print("adjusted_rand     :", round(adjusted_rand_score(y_true, labels), 3))            # chance-corrected
print("NMI               :", round(normalized_mutual_info_score(y_true, labels), 3))
print("AMI               :", round(adjusted_mutual_info_score(y_true, labels), 3))     # chance-corrected
h, c, v = homogeneity_completeness_v_measure(y_true, labels)
print("homog/compl/V     :", round(h, 3), round(c, 3), round(v, 3))
print("fowlkes_mallows   :", round(fowlkes_mallows_score(y_true, labels), 3))

# Real iris output:
# silhouette 0.553 | davies_bouldin 0.662 | calinski_harabasz 561.6
# ARI 0.73 | NMI 0.758 | AMI 0.755 | homog/compl/V 0.751 0.765 0.758 | FMI 0.821`
  };

  window.CODEVIZ["met-clustering"] = {
    question: "On the real iris flowers, as we vary the number of clusters k, where does the silhouette (no labels) peak versus the ARI (vs the true species)?",
    charts: [
      {
        type: "line",
        title: "Iris: silhouette (internal, no labels) vs ARI (external, vs truth) across k",
        xlabel: "number of clusters k",
        ylabel: "score (higher = better)",
        series: [
          { name: "silhouette (internal)", color: "#4ea1ff", points: [[2, 0.681], [3, 0.553], [4, 0.498], [5, 0.489], [6, 0.365], [7, 0.357], [8, 0.36]] },
          { name: "ARI vs true species (external)", color: "#7ee787", points: [[2, 0.54], [3, 0.73], [4, 0.65], [5, 0.608], [6, 0.448], [7, 0.481], [8, 0.457]] }
        ]
      },
      {
        type: "bars",
        title: "Inertia (within-cluster sum of squares) ALWAYS drops as k grows — cannot pick k",
        labels: ["k=2", "k=3", "k=4", "k=5", "k=6", "k=7", "k=8"],
        values: [152.3, 78.9, 57.2, 46.4, 39.0, 34.4, 30.1],
        colors: ["#ffb454", "#7ee787", "#4ea1ff", "#4ea1ff", "#4ea1ff", "#4ea1ff", "#4ea1ff"]
      }
    ],
    caption: "Real load_iris + KMeans. The green ARI (compared to the 3 true species) peaks cleanly at k=3 (0.73) — the right answer. The blue silhouette, which has NO labels, instead peaks at k=2 (0.681): two of the three species overlap, so merging them looks tighter and more separated. That gap is the 'silhouette favors convex blobs' pitfall in one picture. The orange/blue bars show inertia falling monotonically (152.3 to 30.1), which is exactly why you read its elbow (the bend at k=3) and never its lowest value.",
    code: `import numpy as np
import matplotlib.pyplot as plt
from sklearn.datasets import load_iris
from sklearn.cluster import KMeans
from sklearn.metrics import silhouette_score, adjusted_rand_score

iris = load_iris()
X, y_true = iris.data, iris.target          # 150 real flowers, 3 true species

ks = list(range(2, 9))
sil, ari, inertia = [], [], []
for k in ks:
    km = KMeans(n_clusters=k, n_init=10, random_state=0).fit(X)
    labels = km.labels_
    sil.append(silhouette_score(X, labels))          # INTERNAL: no labels used
    ari.append(adjusted_rand_score(y_true, labels))  # EXTERNAL: vs the true species
    inertia.append(km.inertia_)                       # within-cluster sum of squares

for k, s, a, w in zip(ks, sil, ari, inertia):
    print(k, round(s, 3), round(a, 3), round(w, 1))

fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(11, 4))
ax1.plot(ks, sil, "o-", color="#4ea1ff", label="silhouette (internal)")
ax1.plot(ks, ari, "o-", color="#7ee787", label="ARI vs truth (external)")
ax1.set_xlabel("number of clusters k"); ax1.set_ylabel("score"); ax1.legend()
ax1.set_title("silhouette peaks at k=2, ARI peaks at the true k=3")
ax2.bar([str(k) for k in ks], inertia, color="#ffb454")
ax2.set_xlabel("k"); ax2.set_ylabel("inertia (WCSS)")
ax2.set_title("inertia always drops — read the elbow, not the min")
plt.show()`
  };
})();
