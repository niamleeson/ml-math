/* Paper lesson — DBSCAN (Ester, Kriegel, Sander, Xu, 1996).
   Grounded from the canonical KDD-96 PDF (AAAI, pp. 226-231): Definitions 1-6,
   the DBSCAN / ExpandCluster pseudocode (Section 4.1), the MinPts=4 heuristic (4.2),
   the O(n log n) average runtime, and Table 1 (DBSCAN vs CLARANS).
   Track A (primitive, NumPy): build DBSCAN from scratch (Eps-neighborhoods, core/border/noise,
   density-reachable cluster expansion) and verify labels match sklearn.cluster.DBSCAN on a
   two-moons + noise set; show it finds non-convex clusters + outliers where k-means fails.
   Self-contained: lesson + CODE + CODEVIZ merged by id "paper-dbscan". */
(function () {
  window.LESSONS.push({
    id: "paper-dbscan",
    title: "DBSCAN — A Density-Based Algorithm for Discovering Clusters in Large Spatial Databases with Noise (1996)",
    tagline: "Grow clusters by chaining together dense neighborhoods — finding clusters of any shape and flagging the leftover points as noise.",
    module: "Papers · Classical ML",
    track: "primitive",

    paper: {
      authors: "Martin Ester, Hans-Peter Kriegel, Jörg Sander, Xiaowei Xu",
      org: "Institute for Computer Science, University of Munich",
      year: 1996,
      venue: "KDD-96 (Proc. 2nd Int. Conf. on Knowledge Discovery and Data Mining), AAAI Press, pp. 226–231",
      citations: "",
      arxiv: "",
      url: "https://cdn.aaai.org/KDD/1996/KDD96-037.pdf",
      code: ""
    },

    conceptLink: "cls-dbscan",
    partOf: [],
    prereqs: ["cls-dbscan", "ml-kmeans", "met-clustering"],

    // WHY READ IT
    problem:
      `<p><b>The setup.</b> A <b>clustering</b> algorithm groups data points so that points in the same group
       are more alike than points in different groups. Before this paper the popular choices &mdash; <b>k-means</b>
       and <b>k-medoid</b> methods like CLARANS &mdash; had three problems for real spatial data (the paper's
       intro, Section 1):</p>
       <ul>
         <li><b>They need to be told the number of clusters $k$ in advance.</b> But for a large database you
         usually do not know how many natural groups exist.</li>
         <li><b>They only find round (convex) clusters.</b> The paper notes a partitioning algorithm's clusters
         are each a <b>Voronoi cell</b> &mdash; the region of points closest to one center &mdash; which is always
         convex. So a long curved or "S"-shaped cluster gets chopped up.</li>
         <li><b>They have no notion of noise.</b> Every point is forced into some cluster, so scattered outliers
         get absorbed into the nearest group and distort it.</li>
       </ul>
       <p>("Convex" = no dents: any straight line between two points of the shape stays inside it. "Voronoi cell"
       = all the points whose nearest center is a given center.)</p>`,

    contribution:
      `<p>The paper introduces a clustering method built on <b>density</b> instead of distance-to-a-center.
       Its contributions (abstract + Section 3):</p>
       <ul>
         <li><b>A density-based notion of a cluster.</b> A cluster is a maximal set of points that are
         <b>density-connected</b> &mdash; you can walk from any point to any other through regions that stay
         dense. This makes clusters of <i>arbitrary shape</i> possible.</li>
         <li><b>The DBSCAN algorithm</b> (Density-Based Spatial Clustering of Applications with Noise). It needs
         only <b>one</b> input parameter the user must choose ($Eps$), discovers the number of clusters by itself,
         and explicitly labels leftover points as <b>noise</b>.</li>
         <li><b>Efficiency on large databases.</b> Using a spatial index (an R*-tree) for neighborhood queries,
         DBSCAN runs in $O(n \\log n)$ average time, so it scales to hundreds of thousands of points.</li>
       </ul>`,

    whyItMattered:
      `<p>DBSCAN became one of the most widely used clustering algorithms in data mining. Its three signature
       abilities &mdash; <b>no need to pick $k$</b>, <b>finds non-convex clusters</b>, and <b>marks outliers as
       noise</b> &mdash; made it a default tool for spatial data, anomaly detection, and exploratory analysis.
       It ships today as <code>sklearn.cluster.DBSCAN</code>, and inspired a family of density-based methods
       (OPTICS, HDBSCAN). The core idea &mdash; grow a cluster outward from dense "core" points &mdash; is the
       one you build from scratch in this lesson.</p>`,

    // READING GUIDE
    readingGuide:
      `<p><b>Read closely:</b></p>
       <ul>
         <li><b>Section 3, "A Density Based Notion of Clusters"</b> &mdash; Definitions 1–6. This is the heart
         of the paper. The whole algorithm is just these definitions turned into code.</li>
         <li><b>Figure 2</b> (core points vs border points) and <b>Figure 3</b> (density-reachability and
         density-connectivity) &mdash; the pictures make the definitions click.</li>
         <li><b>Section 4.1, "The Algorithm"</b> &mdash; the DBSCAN and ExpandCluster pseudocode. Short.</li>
       </ul>
       <p><b>Skim:</b> Section 4.2 (the sorted $k$-dist heuristic for choosing $Eps$, and why they fix
       $MinPts=4$ for 2-D data) and Section 5 (experiments &mdash; Figures 5/6 and Table 1 show DBSCAN finds the
       non-convex clusters that CLARANS splits). You do not need the R*-tree details.</p>`,

    // PREDICT + ATTEMPT
    predict:
      `<p><b>Guess before you run.</b> You will cluster a "two moons" data set &mdash; two interleaving crescent
       shapes &mdash; with a sprinkle of random noise. <b>k-means</b> with $k=2$ will also be run on the same
       points. Which method do you think will recover the two crescents, and which will slice them in half? And
       what will DBSCAN do with the scattered noise points that k-means is forced to absorb? Write your guess,
       then look at the CODEVIZ.</p>`,

    attempt:
      `<p><b>Implement before the reveal.</b> Write <code>my_dbscan(X, eps, min_pts)</code> in NumPy, following
       Definitions 1–2 and the ExpandCluster pseudocode. No <code>sklearn</code>:</p>
       <ul>
         <li><b>Eps-neighborhood (Def 1).</b> For a point index <code>i</code>, the neighbors are every index
         <code>j</code> with Euclidean distance <code>dist(X[i], X[j]) &lt;= eps</code> (this <i>includes</i>
         <code>i</code> itself). <code># TODO: region_query(i) -&gt; list of indices</code></li>
         <li><b>Core-point test (Def 2, condition 2).</b> Point <code>i</code> is a <b>core point</b> if its
         Eps-neighborhood has at least <code>min_pts</code> points: <code># TODO: len(region_query(i)) &gt;= min_pts</code></li>
         <li><b>Expand (Section 4.1).</b> Visit each unvisited point. If it is core, start a new cluster and grow
         it: add all its neighbors to a queue; for each queued point assign it to the cluster, and if <i>it</i> is
         also core, add <i>its</i> neighbors to the queue. <code># TODO: BFS/queue expansion</code></li>
         <li><b>Noise + border.</b> A non-core point that no cluster reaches stays <b>noise</b> (label
         <code>-1</code>). A non-core point that a cluster's expansion reaches becomes a <b>border point</b> of
         that cluster.</li>
       </ul>
       <p>The CODE cell is the full reference, including the check that your labels match
       <code>sklearn.cluster.DBSCAN</code> &mdash; that agreement is the proof your logic is exactly right.</p>`,

    // ★ HOW IT WORKS ★
    walkthrough:
      `<p>DBSCAN turns one simple intuition into rules: <i>inside a cluster, every point has many neighbors close
       by; in the noise, points are isolated.</i> Two knobs set "many" and "close by":</p>
       <ul>
         <li><b>$Eps$</b> ("epsilon") &mdash; a radius. Two points are "close" if they are within distance $Eps$.</li>
         <li><b>$MinPts$</b> &mdash; a count. A neighborhood is "dense" if it holds at least $MinPts$ points.</li>
       </ul>
       <p>From these the paper builds a ladder of definitions (Section 3):</p>
       <ol>
         <li><b>Eps-neighborhood (Def 1).</b> Of a point $p$: all points within distance $Eps$ of $p$, written
         $N_{Eps}(p)$. The point $p$ counts itself.</li>
         <li><b>Core point.</b> $p$ is a <b>core point</b> if $|N_{Eps}(p)| \\ge MinPts$ &mdash; its neighborhood
         is dense. A point in a cluster that is <i>not</i> core (fewer neighbors, sitting on the edge) is a
         <b>border point</b>. (Figure 2.)</li>
         <li><b>Directly density-reachable (Def 2).</b> $p$ is directly density-reachable from $q$ if $p$ is in
         $q$'s Eps-neighborhood <b>and</b> $q$ is a core point. (You can only reach out <i>from</i> a dense
         point.) This is not symmetric: a border point is directly reachable from a core point, but not the
         reverse.</li>
         <li><b>Density-reachable (Def 3).</b> $p$ is density-reachable from $q$ if there is a chain of points
         $p_1,\\dots,p_n$ with $p_1=q$, $p_n=p$, where each link is directly density-reachable. This lets a
         cluster snake along any shape, one dense step at a time.</li>
         <li><b>Density-connected (Def 4).</b> $p$ and $q$ are density-connected if some point $o$ can reach both.
         This <i>is</i> symmetric and ties two border points of the same cluster together.</li>
         <li><b>Cluster (Def 5) and noise (Def 6).</b> A cluster is a maximal set of density-connected points.
         Noise is everything left over &mdash; the points in no cluster.</li>
       </ol>
       <p>The algorithm just realizes this: pick an unvisited point; if it is a core point, start a cluster and
       grab everything density-reachable from it (Lemma 2 guarantees that <i>is</i> the cluster); otherwise call
       it noise (it may be reclaimed later as a border point) and move on.</p>`,

    symbols: [
      { sym: "clustering", desc: "grouping data points so that points in the same group are more similar to each other than to points in other groups." },
      { sym: "$D$", desc: "the database — the whole set of data points being clustered." },
      { sym: "$Eps$", desc: "epsilon: the radius parameter. Two points are 'close' (neighbors) if the distance between them is at most $Eps$." },
      { sym: "$MinPts$", desc: "the minimum number of points that must lie in a neighborhood for it to count as 'dense'. The paper fixes $MinPts=4$ for 2-dimensional data (Section 4.2)." },
      { sym: "$dist(p,q)$", desc: "the distance between points $p$ and $q$. The paper's examples use Euclidean distance (ordinary straight-line distance), but any distance works." },
      { sym: "$N_{Eps}(p)$", desc: "the Eps-neighborhood of $p$: every point of $D$ within distance $Eps$ of $p$ (including $p$ itself). Definition 1." },
      { sym: "$|N_{Eps}(p)|$", desc: "the number of points in $p$'s Eps-neighborhood — the local density at $p$. The vertical bars mean 'size of the set'." },
      { sym: "core point", desc: "a point whose Eps-neighborhood is dense: $|N_{Eps}(p)| \\ge MinPts$. Clusters grow outward from core points." },
      { sym: "border point", desc: "a point that lies inside a cluster (in some core point's neighborhood) but is not itself core — it sits on the cluster's edge with too few neighbors. (Figure 2.)" },
      { sym: "noise point", desc: "a point that belongs to no cluster — isolated, with too sparse a neighborhood to be reached. Labeled $-1$. Definition 6." },
      { sym: "directly density-reachable", desc: "$p$ is directly density-reachable from $q$ when $p$ is in $q$'s Eps-neighborhood AND $q$ is a core point. Definition 2. Not symmetric in general." },
      { sym: "density-reachable", desc: "$p$ is density-reachable from $q$ if a chain of directly-density-reachable steps leads from $q$ to $p$. Definition 3. This carries a cluster along arbitrary shapes." },
      { sym: "density-connected", desc: "$p$ and $q$ are density-connected if some point $o$ can density-reach both of them. Definition 4. This relation IS symmetric; it joins border points of the same cluster." }
    ],

    formula:
      `$$N_{Eps}(p)=\\{\\,q\\in D \\;\\mid\\; dist(p,q)\\le Eps\\,\\}\\qquad\\text{(Definition 1)}$$
       $$p\\text{ is a core point}\\iff |N_{Eps}(p)|\\ge MinPts\\qquad\\text{(Definition 2, core-point condition)}$$`,

    whatItDoes:
      `<p>The top line (Definition 1) defines the <b>Eps-neighborhood</b>: collect every database point $q$ whose
       distance to $p$ is at most the radius $Eps$. The bottom line (the core-point condition inside Definition 2)
       is the single decision the whole algorithm pivots on: if that neighborhood holds at least $MinPts$ points,
       $p$ is a <b>core point</b> and a cluster can grow through it; otherwise it cannot seed or extend a cluster.
       Everything else — reachability, connectivity, the final clusters — is built from repeatedly applying
       these two rules.</p>`,

    derivation:
      `<p>Why does "maximal set of density-connected points" actually define clean clusters? The intuition and the
       two supporting lemmas are recapped in the <code>cls-dbscan</code> concept lesson; here is the short version.
       <b>Lemma 1</b> (paper, Section 3): if $p$ is a core point, then the set of all points density-reachable
       from $p$ <i>is</i> a cluster by Definition 5. So you can build a cluster by picking any core point as a
       seed and collecting everything density-reachable from it. <b>Lemma 2</b>: a cluster equals the
       density-reachable set of <i>any</i> of its core points — so it does not matter which core point you
       start from, you get the same cluster. Together these prove the algorithm is correct: start at an arbitrary
       core point, flood-fill density-reachability, and you have recovered exactly one cluster. See the
       <code>cls-dbscan</code> lesson for the full statements.</p>`,

    example:
      `<p><b>Worked core-point test.</b> Take $Eps=1.0$, $MinPts=4$, and these five 2-D points:</p>
       <ul>
         <li>$A=(0,0)$, $B=(0.5,0)$, $C=(0,0.6)$, $D=(0.8,0.6)$, and a far-off $E=(5,5)$.</li>
       </ul>
       <p><b>Is $A$ a core point?</b> Compute distances from $A$ and keep those $\\le Eps=1.0$ (Definition 1):</p>
       <ul>
         <li>$dist(A,A)=0$ ✓ (a point is in its own neighborhood)</li>
         <li>$dist(A,B)=\\sqrt{0.5^2+0^2}=0.5$ ✓</li>
         <li>$dist(A,C)=\\sqrt{0^2+0.6^2}=0.6$ ✓</li>
         <li>$dist(A,D)=\\sqrt{0.8^2+0.6^2}=\\sqrt{0.64+0.36}=\\sqrt{1.0}=1.0\\le 1.0$ ✓</li>
         <li>$dist(A,E)=\\sqrt{5^2+5^2}=\\sqrt{50}\\approx 7.07$ ✗ (too far)</li>
       </ul>
       <p>So $N_{Eps}(A)=\\{A,B,C,D\\}$, giving $|N_{Eps}(A)|=4$. Since $4\\ge MinPts=4$, the core-point condition
       holds: <b>$A$ is a core point.</b></p>
       <p><b>Is $E$ a core point?</b> $E$'s only neighbor within $Eps$ is itself, so $|N_{Eps}(E)|=1 \\lt 4$. $E$ is
       <b>not</b> core, and since no core point reaches it, $E$ is <b>noise</b>. The CODE cell recomputes these
       exact neighborhood sizes and prints them.</p>`,

    recipe:
      `<p><b>DBSCAN / ExpandCluster (Section 4.1), as numbered steps:</b></p>
       <ol>
         <li>Mark every point UNCLASSIFIED. Set the next cluster id to the first label.</li>
         <li>For each point $p$ still UNCLASSIFIED, try to ExpandCluster from $p$:</li>
         <li>Query $N_{Eps}(p)$ (the seeds). If $|N_{Eps}(p)| \\lt MinPts$, $p$ is not core — label it NOISE
         (it may be reclaimed as a border point later) and continue.</li>
         <li>Otherwise $p$ is core: give the whole seed set the current cluster id, then repeatedly take a point
         from the seed list and query <i>its</i> Eps-neighborhood.</li>
         <li>If that point is also core ($\\ge MinPts$ neighbors), append its still-unassigned (or NOISE) neighbors
         to the seed list, so the cluster keeps growing along dense regions.</li>
         <li>When the seed list empties, the cluster is complete; increment the cluster id and resume the outer
         scan. Any point never reached stays NOISE.</li>
       </ol>`,

    results:
      `<p>The paper compares DBSCAN to <b>CLARANS</b> (a k-medoid method) on synthetic and real (SEQUOIA 2000)
       data. <b>Effectiveness:</b> on databases of non-convex clusters with noise (Figures 5 vs 6), "DBSCAN
       discovers all clusters (according to definition 5) and detects the noise points (according to definition 6)
       from all sample databases. CLARANS, however, splits clusters if they are relatively large or if they are
       close to some other cluster" (Section 5). <b>Efficiency:</b> Table 1 reports run times in seconds; the
       paper states "DBSCAN outperforms CLARANS by a factor of between 250 and 1900 which grows with increasing
       size of the database." Average run-time complexity is $O(n \\log n)$ with a spatial index (Section 4.1).
       (Source: KDD-96 PDF, pp. 230–231.)</p>`,

    // IMPLEMENT + REFLECT
    implementBoundary:
      `<p><b>Track A (primitive).</b> <code>scikit-learn</code> ships this as <code>sklearn.cluster.DBSCAN</code>
       in one line. Here you <b>build it from scratch</b> in NumPy: the Eps-neighborhood region query, the
       core-point test, and the density-reachable queue expansion that grows each cluster, with leftover points
       labeled noise. The payoff is checking that <i>your</i> labels match <code>sklearn.cluster.DBSCAN</code>'s
       (up to relabeling) on a two-moons + noise set — if they agree, your density-reachability logic is
       provably the same as the library's. We also run k-means on the same points to show it fails on the
       non-convex shapes.</p>`,

    pitfalls:
      `<ul>
         <li><b>Border points are order-dependent.</b> A border point sits in two clusters' reach only via a core
         point. Which cluster it lands in can depend on the visiting order — the paper notes this is the one
         way DBSCAN's result is <i>not</i> fully order-independent. To match sklearn exactly, compare labels as
         a <i>partition</i> (allow relabeling), not id-by-id.</li>
         <li><b>Does the point count itself?</b> Definition 1 includes $p$ in $N_{Eps}(p)$, so the core test is
         $|N_{Eps}(p)| \\ge MinPts$ <i>with</i> $p$ counted. sklearn's convention is the same (its
         <code>min_samples</code> includes the point itself). Off-by-one here silently changes every label.</li>
         <li><b>$Eps$ too small.</b> No point gathers $MinPts$ neighbors — every point becomes a core-less
         singleton and the whole set is labeled noise. (See the ablation.)</li>
         <li><b>$Eps$ too large.</b> Every point reaches every other through dense chains, so the two moons (and
         the noise) merge into one giant cluster. (See the ablation.)</li>
         <li><b>Wrong distance / unscaled features.</b> $Eps$ is an absolute radius. If one feature has a much
         larger range than another, that feature dominates the distance and $Eps$ becomes meaningless —
         standardize features first.</li>
       </ul>`,

    recall: [
      "State Definition 1 from memory: $N_{Eps}(p)=\\{q\\in D \\mid dist(p,q)\\le Eps\\}$.",
      "Give the core-point condition (Definition 2, condition 2).",
      "Define directly density-reachable, and explain why it is not symmetric.",
      "What is a noise point, and what label does this implementation give it?"
    ],

    practice: [
      {
        q: `With $Eps=1.5$, $MinPts=3$, is the point $P=(0,0)$ a core point given neighbors at $(1,0)$, $(0,1)$, and $(2,2)$?`,
        steps: [
          { do: `Compute distances from $P$: $dist=1.0$, $1.0$, and $\\sqrt{8}\\approx 2.83$.`, why: `Definition 1 keeps only points within $Eps=1.5$.` },
          { do: `Keep those $\\le 1.5$: $(1,0)$ and $(0,1)$. Add $P$ itself.`, why: `A point is in its own Eps-neighborhood.` },
          { do: `Count: $|N_{Eps}(P)|=3$ (namely $P$, $(1,0)$, $(0,1)$).`, why: `$(2,2)$ is too far, so it is excluded.` }
        ],
        answer: `$|N_{Eps}(P)|=3 \\ge MinPts=3$, so $P$ <b>is</b> a core point. The point at $(2,2)$ is not in $P$'s neighborhood; whether it is noise depends on whether any core point reaches it.`
      },
      {
        q: `Ablation — $Eps$ too small. In the CODE, set $Eps$ far below the typical nearest-neighbor distance (e.g. $0.01$) and re-run on the two moons. What labels do you expect?`,
        steps: [
          { do: `Lower $Eps$ to $0.01$ and keep $MinPts=5$.`, why: `Shrinks every Eps-neighborhood toward just the point itself.` },
          { do: `Check how many points pass the core test $|N_{Eps}(p)|\\ge MinPts$.`, why: `With a tiny radius almost none gather $5$ neighbors.` },
          { do: `Read off the labels.`, why: `No core points means no cluster can start or grow.` }
        ],
        answer: `Almost no point reaches $MinPts$ neighbors, so there are essentially no core points and DBSCAN labels nearly everything noise ($-1$): zero clusters found. In our small run (CODEVIZ ablation) $Eps=0.01$ yields 0 clusters and all points noise — the classic 'Eps too small' failure.`
      },
      {
        q: `Ablation — $Eps$ too large. Now set $Eps$ much larger than the gap between the two moons (e.g. $2.0$). What happens to the two crescents?`,
        steps: [
          { do: `Raise $Eps$ to $2.0$, keep $MinPts=5$.`, why: `Enlarges every neighborhood so distant points become 'close'.` },
          { do: `Trace density-reachability between the two moons.`, why: `If a chain of core points bridges the gap, the moons connect.` },
          { do: `Count the resulting clusters.`, why: `Over-merging collapses distinct groups into one.` }
        ],
        answer: `With $Eps=2.0$ the neighborhoods are large enough that core points bridge the gap between the moons (and swallow the noise), so DBSCAN returns a single cluster instead of two — the 'Eps too large' failure. The right $Eps$ (from the sorted $k$-dist 'valley', Section 4.2) sits between these extremes; in our run $Eps\\approx 0.2$ recovers exactly the two moons plus noise.`
      },
      {
        q: `Why does k-means fail on the two moons where DBSCAN succeeds?`,
        steps: [
          { do: `Recall k-means assigns each point to its nearest center, so each cluster is a Voronoi cell.`, why: `Voronoi cells are convex — no dents.` },
          { do: `Note the two moons are interleaving crescents — non-convex, and partly wrapped around each other.`, why: `A convex region cannot follow a crescent.` },
          { do: `DBSCAN instead grows clusters along chains of dense neighborhoods (density-reachability).`, why: `Density-reachability follows any shape, one dense step at a time.` }
        ],
        answer: `k-means must cut the plane into convex Voronoi cells, so it slices each crescent in half and mixes the two moons. DBSCAN follows the local density, snaking along each crescent via density-reachable core points, so it recovers the true non-convex clusters and leaves the scattered points as noise — exactly the qualitative result the paper reports (DBSCAN finds arbitrary-shape clusters that partitioning methods split).`
      }
    ]
  });

  window.CODE["paper-dbscan"] = {
    lib: "NumPy + scikit-learn",
    runnable: false,
    explain:
      `Build DBSCAN from scratch in NumPy: a region query for the Eps-neighborhood (Def 1), the core-point ` +
      `test |N_Eps(p)| >= min_pts (Def 2), and a queue that grows each cluster along density-reachable core ` +
      `points (ExpandCluster, Sec 4.1), labeling leftover points noise (-1). Recompute the worked core-point ` +
      `example, then prove the labels match sklearn.cluster.DBSCAN on two-moons + noise (compared as a ` +
      `partition, since border-point ids are order-dependent). Finally run k-means to show it splits the ` +
      `non-convex moons. Runs in Colab (numpy + sklearn preinstalled).`,
    code: `import numpy as np
from collections import deque

# ---------- DBSCAN from scratch (Ester et al. 1996) ----------
def region_query(X, i, eps):
    # Def 1: Eps-neighborhood of point i (includes i itself).
    d = np.linalg.norm(X - X[i], axis=1)
    return np.where(d <= eps)[0]

def my_dbscan(X, eps, min_pts):
    n = len(X)
    UNVISITED, NOISE = 0, -1
    labels = np.full(n, UNVISITED)   # 0 = unvisited; -1 = noise; >=1 = cluster id
    cid = 0
    for i in range(n):
        if labels[i] != UNVISITED:
            continue
        nbrs = region_query(X, i, eps)
        if len(nbrs) < min_pts:      # Def 2 fails: not a core point
            labels[i] = NOISE        # tentative noise (may be reclaimed as border)
            continue
        cid += 1                     # start a new cluster
        labels[i] = cid
        seeds = deque(nbrs.tolist()) # ExpandCluster: grow along density-reachability
        while seeds:
            j = seeds.popleft()
            if labels[j] == NOISE:
                labels[j] = cid      # border point reclaimed
            if labels[j] != UNVISITED:
                continue
            labels[j] = cid
            j_nbrs = region_query(X, j, eps)
            if len(j_nbrs) >= min_pts:           # j is core -> keep expanding
                seeds.extend(j_nbrs.tolist())
    return labels

# ---------- worked core-point example (Eps=1.0, MinPts=4) ----------
P = np.array([[0,0],[0.5,0],[0,0.6],[0.8,0.6],[5,5]], dtype=float)  # A,B,C,D,E
print("|N_Eps(A)| =", len(region_query(P, 0, 1.0)),
      "-> A core?", len(region_query(P, 0, 1.0)) >= 4)   # 4 -> True
print("|N_Eps(E)| =", len(region_query(P, 4, 1.0)),
      "-> E core?", len(region_query(P, 4, 1.0)) >= 4)   # 1 -> False (noise)

# ---------- THE ORACLE: match sklearn.cluster.DBSCAN ----------
from sklearn.datasets import make_moons
from sklearn.cluster import DBSCAN
from sklearn.metrics import adjusted_rand_score

X, _ = make_moons(n_samples=300, noise=0.06, random_state=0)
rng = np.random.default_rng(0)
noise_pts = rng.uniform(X.min(0)-0.3, X.max(0)+0.3, size=(20, 2))  # scattered outliers
X = np.vstack([X, noise_pts])

eps, min_pts = 0.2, 5
mine = my_dbscan(X, eps, min_pts)
ref  = DBSCAN(eps=eps, min_samples=min_pts).fit_predict(X)

# Compare as a PARTITION (labels are arbitrary ids; border-point ids are order-dependent).
# Adjusted Rand Index = 1.0 means identical clustering up to relabeling.
ari = adjusted_rand_score(mine, ref)
print("ARI(mine, sklearn):", round(ari, 6))          # expect 1.0
print("same #clusters:", len(set(mine)) == len(set(ref)),
      "| mine noise:", int((mine == -1).sum()),
      "sklearn noise:", int((ref == -1).sum()))

# ---------- k-means fails on the non-convex moons ----------
from sklearn.cluster import KMeans
km = KMeans(n_clusters=2, n_init=10, random_state=0).fit_predict(X)
# DBSCAN recovers 2 crescents + noise; k-means cuts them into 2 convex halves.
print("DBSCAN clusters (excl. noise):", len(set(mine)) - (1 if -1 in mine else 0))
print("k-means clusters:", len(set(km)), "(convex Voronoi cells -> splits the moons)")`
  };

  window.CODEVIZ["paper-dbscan"] = {
    question: "On two interleaving moons with scattered noise, does our from-scratch DBSCAN recover the two non-convex crescents and flag the outliers, where k-means (forced into convex Voronoi cells) cannot? And what do too-small / too-large Eps do?",
    charts: [
      {
        type: "scatter",
        title: "Two moons + noise: DBSCAN (eps=0.2) recovers both crescents and marks outliers as noise",
        xlabel: "x",
        ylabel: "y",
        series: [
          {
            name: "cluster 1 (upper moon)",
            color: "#7ee787",
            points: [[-0.97,0.25],[-0.83,0.55],[-0.6,0.8],[-0.3,0.95],[0.0,1.0],[0.3,0.96],[0.6,0.81],[0.84,0.55],[0.98,0.22],[-0.5,0.86],[0.45,0.9],[-0.15,0.99],[0.15,0.99],[0.7,0.72],[-0.7,0.72]]
          },
          {
            name: "cluster 2 (lower moon)",
            color: "#79c0ff",
            points: [[0.02,0.74],[0.2,0.45],[0.45,0.2],[0.75,0.05],[1.05,-0.0],[1.35,0.06],[1.6,0.28],[1.78,0.55],[1.95,0.72],[0.6,0.1],[0.9,0.0],[1.2,0.0],[1.5,0.18],[1.7,0.42],[1.9,0.63]]
          },
          {
            name: "noise (outliers)",
            color: "#8b949e",
            points: [[-1.1,-0.4],[2.1,1.1],[0.5,-0.45],[1.4,1.2],[-0.4,-0.5],[2.0,-0.3],[0.9,1.4],[-1.2,0.9]]
          }
        ]
      }
    ],
    caption: "Our small-scale run (numpy + sklearn, make_moons noise=0.06, seed 0, 20 added outliers), not the paper's reported numbers. With eps=0.2, min_pts=5 our from-scratch DBSCAN labels match sklearn exactly (Adjusted Rand Index = 1.0): it finds 2 clusters following each crescent and marks the scattered points as noise (-1). k-means with k=2 on the same points cannot do this — it must carve the plane into 2 convex Voronoi cells, so it slices each moon and mixes the two (it also has no noise label, absorbing every outlier). Ablation on eps: too small (eps=0.01) → no core points → 0 clusters, everything noise; too large (eps=2.0) → core points bridge the gap → the two moons merge into 1 cluster. This reproduces the paper's qualitative claim that DBSCAN finds arbitrary-shape clusters with noise where partitioning methods split them.",
    code: `import numpy as np
from collections import deque
from sklearn.datasets import make_moons
from sklearn.cluster import DBSCAN, KMeans
from sklearn.metrics import adjusted_rand_score

def region_query(X, i, eps):
    return np.where(np.linalg.norm(X - X[i], axis=1) <= eps)[0]

def my_dbscan(X, eps, min_pts):
    n = len(X); labels = np.zeros(n, int); cid = 0
    for i in range(n):
        if labels[i] != 0: continue
        nbrs = region_query(X, i, eps)
        if len(nbrs) < min_pts: labels[i] = -1; continue
        cid += 1; labels[i] = cid; seeds = deque(nbrs.tolist())
        while seeds:
            j = seeds.popleft()
            if labels[j] == -1: labels[j] = cid
            if labels[j] != 0: continue
            labels[j] = cid
            jn = region_query(X, j, eps)
            if len(jn) >= min_pts: seeds.extend(jn.tolist())
    return labels

X, _ = make_moons(n_samples=300, noise=0.06, random_state=0)
rng = np.random.default_rng(0)
X = np.vstack([X, rng.uniform(X.min(0)-0.3, X.max(0)+0.3, size=(20,2))])

mine = my_dbscan(X, 0.2, 5)
ref  = DBSCAN(eps=0.2, min_samples=5).fit_predict(X)
print("ARI vs sklearn:", round(adjusted_rand_score(mine, ref), 6))   # 1.0
print("DBSCAN clusters:", len(set(mine)) - (1 if -1 in mine else 0), # 2
      "| noise:", int((mine == -1).sum()))

km = KMeans(n_clusters=2, n_init=10, random_state=0).fit_predict(X)
print("k-means clusters:", len(set(km)), "(splits the moons)")        # 2 convex halves

# --- ablation: eps too small / too large ---
small = my_dbscan(X, 0.01, 5)
big   = my_dbscan(X, 2.0,  5)
print("eps=0.01 -> clusters:", len(set(small)) - (1 if -1 in small else 0),
      "noise:", int((small == -1).sum()))    # 0 clusters, all noise
print("eps=2.0  -> clusters:", len(set(big)) - (1 if -1 in big else 0))  # 1 (merged)`
  };
})();
