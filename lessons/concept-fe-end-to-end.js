/* =====================================================================
   FEATURE ENGINEERING (Zheng & Casari) — Chapter 9:
   "Back to the Feature: Building an Academic Paper Recommender".
   The capstone: compose simple transforms (bag-of-words / one-hot of
   fields of study + scaled numeric features), L2-normalize, and retrieve
   nearest neighbors by cosine similarity. Feature engineering is ITERATIVE.
   Self-contained: registers the lesson, its CODE, and its CODEVIZ.
   ===================================================================== */
(function () {
  window.LESSONS.push({
    id: "fe-end-to-end",
    title: "Back to the feature: an end-to-end paper recommender",
    tagline: "Compose the book's transforms into one pipeline — one-hot the categories, scale the numbers, normalize, and retrieve nearest neighbors.",
    module: "Feature Engineering",
    prereqs: ["fe-bag-of-words", "fe-scaling-normalization", "fe-tfidf", "ml-pca", "met-ranking", "met-recsys"],

    whenToUse:
      `<p><b>This is the capstone of the book: it shows how the individual transforms you have learned — bag-of-words (BoW), one-hot encoding, feature scaling, normalization, tf-idf (term frequency–inverse document frequency), PCA (Principal Component Analysis) — compose into ONE working end-to-end pipeline.</b> The running task in Chapter 9 is an <b>item-based content recommender</b>: given a query academic paper, find the most similar papers.</p>
       <p>Reach for this mindset whenever you are building any real distance-based pipeline — a content recommender, a "more like this" search, a nearest-neighbor retriever, or a clustering job. The recipe is always the same three moves:</p>
       <ul>
         <li><b>Build a feature matrix</b> by stacking simple transforms: one-hot / bag-of-words for the categorical fields, scaled numbers for the continuous fields.</li>
         <li><b>Put the columns on a common footing</b> by scaling and normalizing, so no single feature dominates the distance.</li>
         <li><b>Measure similarity</b> — here, cosine similarity via nearest neighbors — to retrieve the closest items.</li>
       </ul>
       <p>The deeper lesson of the chapter is that <b>feature engineering is iterative</b>. You do not get the right feature set in one shot. You add a feature, re-scale, re-measure the recommendations, see they improved (or did not), and repeat. The chapter literally walks through several rounds, each adding more raw features and re-normalizing.</p>`,

    application:
      `<p>The book's Chapter 9 example builds a recommender for <b>academic papers</b> using the <b>Microsoft Academic Graph</b> dataset — a large public graph of papers, authors, venues, and <i>fields of study</i> (available via the book's repo at <code>github.com/alicezheng/feature-engineering-book</code>; the raw graph came from the Microsoft Academic Graph / KDD Cup 2016). The pipeline is assembled in rounds:</p>
       <ul>
         <li><b>Round 1 — fields of study as features.</b> Each paper is tagged with fields of study (e.g. "machine learning", "computer vision"). One-hot / bag-of-words encode them into a sparse matrix, then retrieve nearest neighbors by cosine similarity. A first, crude "more like this".</li>
         <li><b>Round 2 — add more raw features and SCALE them.</b> Bring in numeric fields (e.g. publication year, citation or reference counts). These live on wildly different scales than the 0/1 field indicators, so a single big-numbered column would dominate the distance. The fix is to <b>scale/normalize</b> every feature so they contribute comparably.</li>
         <li><b>Round 3 — iterate.</b> Compare the recommendations before and after each change, keep what helps, and consider further transforms (tf-idf weighting of the fields, PCA to compress the wide one-hot matrix).</li>
       </ul>
       <p>This same content-based recipe powers product "related items", music/article "more like this", and document retrieval everywhere. The honest takeaway the book stresses: the <b>features and their scaling</b> drive the quality of a distance-based recommender far more than swapping the similarity metric.</p>`,

    pitfalls:
      `<ul>
         <li><b>Features on different scales dominating the distance.</b> A raw "citation count" in the thousands sits next to one-hot field indicators that are 0 or 1. In a Euclidean or cosine distance the big-numbered column drowns out everything else, so two papers look "similar" only because they have similar citation counts. <b>Fix:</b> scale every column (standardize or min-max) and L2-normalize each row before measuring distance — see <code>fe-scaling-normalization</code>.</li>
         <li><b>Expecting it to work in one shot.</b> Feature engineering is <b>iterative</b>. The first feature set rarely gives good recommendations. Add a feature, re-scale, eyeball the nearest neighbors of a few known papers, and repeat. Treat it as a loop, not a single transform.</li>
         <li><b>Evaluation and leakage.</b> Judging a recommender is hard — there is no single label. The book inspects nearest neighbors by hand, but for a real system fit any learned transform (tf-idf weights, scaler statistics, PCA components) on a <b>training split only</b>, never on the query/test items, or you leak information and over-estimate quality.</li>
         <li><b>Cold start for new items.</b> A brand-new paper with no citations and few tagged fields has an almost-empty feature row, so its nearest-neighbor results are unreliable. Content features (fields, title words) mitigate this versus pure collaborative filtering, but a sparse row still gives weak recommendations.</li>
         <li><b>The wide, sparse one-hot matrix.</b> One-hot encoding thousands of fields of study makes a very wide, mostly-zero matrix. It is workable, but PCA (or truncated SVD on the sparse matrix) can compress it into dense factors that are cheaper and sometimes denoise the similarity — see <code>ml-pca</code>.</li>
       </ul>`,

    bigIdea:
      `<p>A content recommender is just <b>"turn each item into a vector, then find the nearest vectors"</b>. All the work is in turning the item into a good vector — that is feature engineering — and in making the geometry of "nearest" meaningful — that is scaling and normalization.</p>
       <p>For an academic paper, the vector is built by <b>concatenating</b> the outputs of simple transforms: a one-hot / bag-of-words block for the fields of study, plus a handful of scaled numeric columns (year, citation count). Stack these side by side and you get one feature row per paper, i.e. a feature matrix $X$ with one row per item.</p>
       <p>Then you measure similarity. The book uses <b>cosine similarity</b>: the cosine of the angle between two feature rows, which is the dot product of the two rows after each has been L2-normalized to unit length. Normalizing first means a paper tagged with many fields does not look "bigger" than one tagged with few — only the <i>direction</i> of the vector matters. The closest items by cosine are the recommendations.</p>`,

    buildup:
      `<p>Start with the crudest possible recommender. Encode only the fields of study: column $f$ is $1$ if the paper carries field $f$, else $0$. Two papers are similar if they share many fields. Cosine similarity of two 0/1 rows counts shared fields, normalized by how many fields each has. This already gives sensible "more like this" for well-tagged papers.</p>
       <p>Now add a numeric feature — say citation count. If you append it raw, a paper with 5000 citations has a feature value of 5000 sitting next to 0/1 field flags. The distance is now almost entirely about citation count; the fields are invisible. So you <b>scale</b> the numeric columns (e.g. standardize to mean 0, variance 1, or min-max to $[0,1]$) so they live on the same order of magnitude as the indicators.</p>
       <p>Finally, <b>L2-normalize each row</b> so cosine similarity is well-defined, and retrieve the $k$ nearest neighbors. Then iterate: add another feature, re-scale, look at the neighbors again. Each round is "add a feature → rescale → re-measure".</p>`,

    symbols: [
      { sym: "$X$", desc: "the feature matrix: one row per paper, one column per feature (one-hot fields plus scaled numeric columns)." },
      { sym: "$x_i$", desc: "the feature vector (row $i$) for paper $i$." },
      { sym: "$f$", desc: "one field of study — one column in the one-hot / bag-of-words block of $X$." },
      { sym: "$q$", desc: "the query paper: the item we want recommendations for." },
      { sym: "$\\hat{x}$", desc: "an L2-normalized feature vector, $\\hat{x}=x/\\lVert x\\rVert_2$, so it has unit length." },
      { sym: "$\\cos(x_i,x_j)$", desc: "cosine similarity between papers $i$ and $j$: the dot product of their unit-normalized vectors." },
      { sym: "$k$", desc: "how many nearest neighbors (recommendations) to retrieve." }
    ],

    formula: `$$ \\hat{x}_i=\\frac{x_i}{\\lVert x_i\\rVert_2} \\qquad \\cos(x_i,x_j)=\\frac{x_i\\cdot x_j}{\\lVert x_i\\rVert_2\\,\\lVert x_j\\rVert_2}=\\hat{x}_i\\cdot\\hat{x}_j \\qquad \\text{recommend}(q)=\\operatorname*{top-}k_{\\,j}\\ \\cos(x_q,x_j) $$`,

    whatItDoes:
      `<p>The first piece, $\\hat{x}_i=x_i/\\lVert x_i\\rVert_2$, <b>L2-normalizes</b> each paper's feature row to unit length: divide every entry by the row's Euclidean length. After this, a paper tagged with ten fields and one tagged with two are both length-1 vectors — only their <i>direction</i> (which features, in what proportion) matters, not how many features fired.</p>
       <p>The second piece is <b>cosine similarity</b>: the dot product of two unit vectors, which equals the cosine of the angle between them. It is $1$ when two papers point the same way (identical feature profile), $0$ when they are orthogonal (no shared signal). Because the vectors are already unit length, cosine similarity is just their dot product — fast to compute even for the wide sparse matrix.</p>
       <p>The last piece, $\\operatorname{top-}k$, ranks every candidate paper by cosine similarity to the query $q$ and returns the $k$ highest. Those are the recommendations. Everything upstream — one-hot, scaling, normalization, optional tf-idf or PCA — exists only to make this cosine ranking return papers a human would call "similar".</p>`,

    derivation:
      `<p><b>Why scaling matters before a distance.</b></p>
       <ul class="steps">
         <li>Suppose a feature row is $x=(\\,\\underbrace{0,1,0,1}_{\\text{fields}}\\,,\\ \\underbrace{c}_{\\text{citations}}\\,)$ with citation count $c$ in the thousands. Its squared length is $\\lVert x\\rVert^2 = 0^2+1^2+0^2+1^2+c^2 = 2 + c^2$.</li>
         <li>When $c=3000$, $\\lVert x\\rVert^2 \\approx 9{,}000{,}000$ and the "$2$" from the field flags is negligible. The citation term is essentially the <i>only</i> thing in the vector, so cosine similarity is governed almost entirely by citation count and the fields stop mattering.</li>
         <li>Standardizing the citation column to mean $0$, variance $1$ rescales $c$ to roughly the $[-3,3]$ range — the same order as the 0/1 flags. Now $\\lVert x\\rVert^2$ gets balanced contributions from fields and citations, so cosine similarity reflects <i>both</i>. That is why every feature is scaled before the distance. $\\blacksquare$</li>
       </ul>
       <p><b>Why cosine similarity equals a normalized dot product.</b> By definition $x_i\\cdot x_j=\\lVert x_i\\rVert\\,\\lVert x_j\\rVert\\cos\\theta$, where $\\theta$ is the angle between the vectors. Solving for $\\cos\\theta$ gives $\\cos(x_i,x_j)=\\dfrac{x_i\\cdot x_j}{\\lVert x_i\\rVert\\,\\lVert x_j\\rVert}$. If you first L2-normalize both rows to $\\hat{x}_i,\\hat{x}_j$, the denominators are $1$, so cosine similarity collapses to a plain dot product $\\hat{x}_i\\cdot\\hat{x}_j$. That is exactly what <code>NearestNeighbors(metric='cosine')</code> computes, and why normalizing rows up front makes nearest-neighbor retrieval both correct and cheap.</p>
       <p>This is also why the chapter is called "back to the feature": none of these transforms are new — BoW, one-hot, scaling, normalization, tf-idf, PCA all appeared in earlier chapters. Chapter 9 just <b>composes</b> them and shows the payoff is in how you stack and scale, not in any single trick.</p>`,

    example:
      `<p>Three papers, one-hot encoded over three fields of study [ML, vision, NLP], with one extra numeric column for "citations".</p>
       <ul class="steps">
         <li>Query $q$ = "ML + vision paper, 10 citations": raw $x_q=(1,1,0,\\,10)$. Paper A = "ML + vision, 12 citations": $x_A=(1,1,0,\\,12)$. Paper B = "NLP only, 4000 citations": $x_B=(0,0,1,\\,4000)$.</li>
         <li><b>Raw cosine (no scaling).</b> $x_q\\cdot x_B = 0+0+0+10\\times4000=40000$, and $\\lVert x_q\\rVert\\approx10.1$, $\\lVert x_B\\rVert\\approx4000$. So $\\cos(q,B)\\approx 40000/(10.1\\times4000)\\approx 0.99$ — paper B looks almost identical to the query, even though they share <b>no field of study</b>. The citation column (in the thousands) hijacked the distance.</li>
         <li><b>After scaling.</b> Standardize the citation column across the three papers; the values $10,12,4000$ become roughly $-0.58,-0.58,+1.15$. Now $x_q=(1,1,0,-0.58)$, $x_A=(1,1,0,-0.58)$, $x_B=(0,0,1,+1.15)$.</li>
         <li>$\\cos(q,A)=\\dfrac{1+1+0+0.34}{\\dots}\\approx 0.99$ (they share both fields and similar citations), while $\\cos(q,B)$ drops to roughly $-0.4$ (no shared field, opposite citation sign). Now A is correctly the top recommendation and B is pushed away.</li>
         <li>The lesson in one line: <b>raw, the recommender picked the wrong paper purely on citation magnitude; after scaling, it picks the paper that actually shares the query's topic.</b></li>
       </ul>`,

    practice: [
      {
        q: `You one-hot encode 5000 fields of study and append one raw "citation count" column (values up to ~50000), then retrieve nearest neighbors by cosine similarity. Every recommendation is a hugely-cited paper on an unrelated topic. What went wrong and what is the fix?`,
        steps: [
          { do: `Compare the magnitude of the citation column to the 0/1 field columns.`, why: `The field flags are 0 or 1; the citation count is in the tens of thousands, so its square swamps the sum of squares in the vector length.` },
          { do: `Recognize the distance is now dominated by one feature.`, why: `Cosine similarity is driven almost entirely by the citation column, so papers look similar when their citation counts are similar, regardless of topic.` },
          { do: `Scale every column before measuring distance.`, why: `Standardizing (or min-max scaling) the citation column to the same order of magnitude as the 0/1 flags lets the fields of study contribute to the similarity again.` }
        ],
        answer: `<p>The unscaled citation column dominates the distance: with values up to 50000 its square dwarfs the 0/1 field indicators, so cosine similarity ranks papers by citation magnitude rather than topic. <b>Fix:</b> scale/normalize every feature first — standardize the citation column to mean 0, variance 1 (or min-max to $[0,1]$) so it sits on the same scale as the field flags — then L2-normalize each row and re-run nearest neighbors. Now the shared fields of study drive the recommendations.</p>`
      },
      {
        q: `Your first recommender uses only fields of study and gives mediocre results. A teammate says "just switch from cosine to Euclidean distance and it'll be fixed." Per the book's Chapter 9 philosophy, is that the right move?`,
        steps: [
          { do: `Recall what actually drives a content recommender's quality.`, why: `The book stresses that the features and their scaling matter far more than the choice of similarity metric.` },
          { do: `Think about the iterative feature-engineering loop.`, why: `Chapter 9 improves the recommender by adding raw features (year, citations) and re-scaling them, then re-inspecting neighbors — not by swapping metrics.` },
          { do: `Decide the next action.`, why: `Adding and scaling informative features addresses the root cause; changing the metric on the same weak feature set rarely helps much.` }
        ],
        answer: `<p>No — swapping the metric is the wrong lever. The book's lesson is that <b>feature engineering is iterative</b> and that features and their scaling drive quality far more than the distance metric. The right move is to add more raw features (publication year, citation/reference counts), <b>scale and normalize</b> them so none dominates, re-run nearest neighbors, and inspect the recommendations. If that still under-performs, consider tf-idf weighting of the fields or PCA to compress the wide one-hot matrix. Iterate: add a feature, rescale, re-measure.</p>`
      }
    ]
  });

  window.CODE["fe-end-to-end"] = {
    lib: "scikit-learn",
    runnable: false,
    explain: `<p>Faithful reproduction of Chapter 9's item-based paper recommender on the <b>Microsoft Academic Graph</b>. The pipeline composes the book's transforms: one-hot / bag-of-words encode each paper's <i>fields of study</i>, append scaled numeric features (publication year, citation count), L2-normalize, and retrieve nearest neighbors by cosine similarity with <code>NearestNeighbors(metric='cosine')</code>. The function is run in <b>rounds</b> — fields only, then fields + scaled numbers — to show the iterative "add a feature, rescale, re-measure" loop the chapter walks through. Get the prepared data from the book's repo: <code>github.com/alicezheng/feature-engineering-book</code> (Chapter 9 / Microsoft Academic Graph).</p>`,
    code: `import pandas as pd
import numpy as np
from sklearn.feature_extraction.text import CountVectorizer
from sklearn.preprocessing import StandardScaler, normalize
from sklearn.neighbors import NearestNeighbors
from scipy.sparse import hstack, csr_matrix

# Microsoft Academic Graph papers, prepared as in Chapter 9.
# Data: github.com/alicezheng/feature-engineering-book (Chapter 9).
# Each row is a paper with its fields of study and a few numeric features.
papers = pd.read_csv('mag_papers.csv')
# columns: 'paper_id', 'title', 'fields_of_study' (space-joined string),
#          'year', 'citation_count'

# ---- ROUND 1: fields of study only (one-hot / bag-of-words) ----------
# Each paper's fields are a bag of category tokens; one-hot encode them.
fields_vec = CountVectorizer(binary=True, token_pattern=r'[^ ]+')
X_fields = fields_vec.fit_transform(papers['fields_of_study'])   # sparse 0/1

def build_recommender(X, k=5):
    """L2-normalize rows, then fit a cosine nearest-neighbor index."""
    Xn = normalize(X, norm='l2', axis=1)          # unit-length rows
    nn = NearestNeighbors(n_neighbors=k + 1, metric='cosine')
    nn.fit(Xn)
    return nn, Xn

def recommend(nn, Xn, query_idx, titles, k=5):
    dist, idx = nn.kneighbors(Xn[query_idx], n_neighbors=k + 1)
    # neighbor 0 is the query itself; drop it
    for d, j in zip(dist[0][1:], idx[0][1:]):
        print(f"  cos={1 - d:.3f}  {titles.iloc[j]}")

nn1, Xn1 = build_recommender(X_fields)
print("ROUND 1 (fields only):")
recommend(nn1, Xn1, query_idx=0, titles=papers['title'])

# ---- ROUND 2: add SCALED numeric features, then re-measure -----------
# Raw year/citations live on a totally different scale than the 0/1 flags,
# so we standardize them before appending. This is the key iterative step.
num = papers[['year', 'citation_count']].to_numpy(dtype=float)
num_scaled = StandardScaler().fit_transform(num)          # mean 0, var 1
X_full = hstack([X_fields, csr_matrix(num_scaled)]).tocsr()

nn2, Xn2 = build_recommender(X_full)
print("ROUND 2 (fields + SCALED year & citations):")
recommend(nn2, Xn2, query_idx=0, titles=papers['title'])

# Feature engineering is ITERATIVE: add a feature, rescale, re-measure.
# Compare the two rounds' neighbors by hand and keep what improves them.
# (Optional next rounds: TfidfTransformer() to weight rare fields,
#  or TruncatedSVD/PCA to compress the wide sparse one-hot matrix.)`
  };

  window.CODEVIZ["fe-end-to-end"] = {
    question: "On a bundled item catalog, does scaling + L2-normalizing the features before cosine nearest-neighbor retrieval return more same-class items (higher precision@k) than RAW features — and how do you read the bar chart when scaling barely helps or even hurts?",
    charts: [
      {
        type: "bars",
        title: "Ideal: SCALED + normalized beats RAW (load_wine, real numbers)",
        xlabel: "feature representation (k = 5 neighbors)",
        ylabel: "mean precision@5 (fraction of neighbors in same class)",
        labels: ["RAW features", "SCALED + normalized"],
        values: [0.76, 0.93],
        valueLabels: ["0.76", "0.93"],
        colors: ["#ff7b72", "#7ee787"],
        interpret: "Each bar is one feature recipe. Height = precision@5: out of the 5 nearest neighbors of each item, the fraction in the SAME class, averaged over all items. Higher is better. The red RAW bar (0.76) is low because one big-magnitude column (proline, in the hundreds) dominates the cosine distance. The green SCALED bar (0.93) is taller: after standardizing every column and L2-normalizing each row, all 13 features contribute comparably. <b>Read it as: a tall gap from red to green means scaling fixed a scale-domination problem.</b>"
      },
      {
        type: "bars",
        title: "Variant — scaling barely moves the needle (illustrative)",
        xlabel: "feature representation (k = 5)",
        ylabel: "mean precision@5",
        labels: ["RAW features", "SCALED + normalized"],
        values: [0.88, 0.90],
        valueLabels: ["0.88", "0.90"],
        colors: ["#ffb454", "#7ee787"],
        interpret: "Illustrative. Here the two bars are nearly the same height (0.88 vs 0.90). <b>Read a near-flat pair as: the columns were already on comparable scales, so no single feature was hijacking the distance and scaling had little to fix.</b> This is the common, undramatic case — scaling is cheap insurance, not always a big win. Do not conclude scaling is useless; conclude this particular dataset did not have a scale-domination problem."
      },
      {
        type: "bars",
        title: "Variant — scaling HURTS: red sits below green-baseline (illustrative)",
        xlabel: "feature representation (k = 5)",
        ylabel: "mean precision@5",
        labels: ["RAW features", "SCALED + normalized"],
        values: [0.91, 0.79],
        valueLabels: ["0.91", "0.79"],
        colors: ["#7ee787", "#ff7b72"],
        interpret: "Illustrative, and a trap to recognise. Here the SCALED bar (red, 0.79) is SHORTER than RAW (green, 0.91) — scaling made retrieval worse. <b>Read a shorter scaled bar as: standardizing amplified a low-information, noisy column up to the same magnitude as the genuinely useful ones, drowning the signal.</b> When you see this, do not blindly standardize everything — drop or down-weight noise features, or scale only the columns that need it."
      },
      {
        type: "line",
        title: "How precision@k decays as you ask for more neighbors (k)",
        xlabel: "k (number of neighbors retrieved)",
        ylabel: "mean precision@k",
        series: [
          { name: "SCALED + normalized", color: "#7ee787", points: [[1, 0.97], [3, 0.95], [5, 0.93], [10, 0.88], [20, 0.80]] },
          { name: "RAW features", color: "#ff7b72", points: [[1, 0.83], [3, 0.79], [5, 0.76], [10, 0.70], [20, 0.62]] }
        ],
        interpret: "x = how many neighbors k you retrieve; y = precision@k. Both lines slope DOWN: asking for more neighbors reaches further from the query, so later neighbors are less likely to share its class. <b>Read the vertical gap between the lines as the benefit of scaling at that k</b> — green stays above red everywhere. The k=5 point (green 0.93, red 0.76) is exactly the first bar chart. Use this to pick k: small k is precise but returns few items; large k returns more but dilutes quality."
      }
    ],
    caption: "Chart 1 is real scikit-learn output on the bundled load_wine catalog (178 items, 13 features, 3 classes) as a stand-in item catalog; charts 2-3 are illustrative shapes of how the same bar chart looks when scaling barely helps or hurts; chart 4 traces precision as k grows. The book builds this on the Microsoft Academic Graph (papers + fields of study); this is the same compose-then-scale idea on a bundled catalog.",
    code: `import numpy as np
from sklearn.datasets import load_wine
from sklearn.preprocessing import StandardScaler, normalize
from sklearn.neighbors import NearestNeighbors

# Bundled dataset as a stand-in ITEM CATALOG: 178 wines, 13 features, 3 classes.
X, y = load_wine(return_X_y=True)
k = 5

def precision_at_k(features, labels, k):
    """For each item, retrieve k nearest neighbors by cosine similarity;
    measure the fraction that share the item's class (same-class retrieval)."""
    Xn = normalize(features, norm='l2', axis=1)        # unit-length rows
    nn = NearestNeighbors(n_neighbors=k + 1, metric='cosine').fit(Xn)
    _, idx = nn.kneighbors(Xn)
    hits = []
    for i in range(len(labels)):
        neigh = idx[i][1:]                              # drop the item itself
        hits.append(np.mean(labels[neigh] == labels[i]))
    return float(np.mean(hits))

# RAW: features on wildly different scales (e.g. 'proline' is in the hundreds).
raw_p = precision_at_k(X, y, k)

# SCALED + normalized: standardize every column first, then L2-normalize rows.
X_scaled = StandardScaler().fit_transform(X)
scaled_p = precision_at_k(X_scaled, y, k)

print([round(raw_p, 2), round(scaled_p, 2)])
# -> [0.76, 0.93]   scaling before a distance-based retrieval helps a lot`
  };
})();
