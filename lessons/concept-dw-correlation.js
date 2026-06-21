/* =====================================================================
   DATA WRANGLING LESSON
   dw-correlation — Reading a correlation matrix during EDA to find
   candidate predictors and redundant features. Self-contained:
   registers the lesson, its CODE, and its CODEVIZ.
   ===================================================================== */
(function () {
  window.LESSONS.push({
    id: "dw-correlation",
    title: "Reading a correlation matrix during EDA",
    tagline: "Build one heatmap of how your columns move together — then read off the predictors and the redundant twins.",
    module: "Data Wrangling",
    prereqs: ["dw-loading-inspecting", "met-association", "fe-pca"],

    whenToUse:
      `<p><b>Run this once, early, right after you have a clean numeric table.</b> A correlation
       matrix is the cheapest map of how every column moves with every other column. You read it for
       two opposite reasons:</p>
       <ul>
         <li><b>Feature&ndash;target correlation (the bright column or row for the target).</b> Sort the
         features by the size of their correlation with what you are trying to predict. The big ones are
         your <b>candidate predictors</b> &mdash; a shortlist worth plotting and modeling first.</li>
         <li><b>Feature&ndash;feature correlation (the rest of the grid).</b> A pair of features with a
         correlation near $\\pm 1$ are <b>near-twins</b> &mdash; they carry almost the same information.
         That is <b>redundancy</b>, and for a linear model it is <b>multicollinearity</b>, which makes
         the fitted coefficients unstable. You may drop one of the pair, or collapse the group with PCA
         (Principal Component Analysis).</li>
       </ul>
       <p>This lesson is the hands-on <b>EDA (Exploratory Data Analysis)</b> angle: how to <i>build</i>
       and <i>read</i> the matrix. For the full menu of association measures &mdash; Pearson vs Spearman
       vs Cram&eacute;r's V vs Mutual Information, and which to trust for which data type &mdash; see the
       <code>met-association</code> lesson; this lesson assumes that vocabulary and focuses on the
       picture you stare at during EDA.</p>
       <p><b>Three flavors of the number</b>, picked by the data: <b>Pearson $r$</b> for a
       <b>straight-line</b> trend between two continuous columns (the default <code>df.corr()</code>);
       <b>Spearman $\\rho$</b> (rho) or <b>Kendall $\\tau$</b> (tau) for a <b>monotonic</b> (always-rising
       or always-falling) trend, ranked data, or when outliers are present; and for <b>mixed types</b>,
       reach past the matrix to <b>point-biserial</b> (binary vs continuous), <b>Cram&eacute;r's V</b>
       (categorical vs categorical), or <b>Mutual Information</b> (any shape).</p>`,

    application:
      `<p>The correlation heatmap is the single most-shown chart in an EDA notebook. <b>Predictor
       hunting:</b> sort features by absolute correlation with the target to decide what to plot and
       model first. <b>De-duplication:</b> spot the bright off-diagonal cells &mdash; "height in cm" and
       "height in inches", "total_phenols" and "flavanoids" &mdash; and drop or merge one. <b>Before a
       linear model:</b> a wall of high inter-correlations is a warning that ordinary-least-squares
       coefficients will be unstable, so you regularize (ridge), drop columns, or run PCA. <b>Feature
       selection:</b> the matrix is the first, crudest filter before fancier methods. <b>Sanity checks:</b>
       a correlation that is suspiciously high (near 1) often means a <b>leak</b> &mdash; the column is a
       near-copy of the target or was computed from it.</p>`,

    pitfalls:
      `<ul>
         <li><b>Pearson sees only straight lines.</b> A clearly curved or U-shaped relationship can give
         $r\\approx 0$. The classic warning is <b>Anscombe's quartet</b>: four tiny datasets with the
         <i>identical</i> $r=0.816$ but four completely different shapes (a clean line, a curve, a line
         dragged by one outlier, a vertical strip held up by one point). <i>Fix:</i> never read $r$ without
         the scatter; add Spearman or Mutual Information to catch curves.</li>
         <li><b>Correlation is not causation.</b> Ice-cream sales correlate with drownings (both driven by
         summer heat &mdash; a <i>confounder</i>). A bright cell means "these move together", never "one
         causes the other". <i>Fix:</i> reserve causal claims for experiments or partial-correlation
         analysis.</li>
         <li><b>One outlier can inflate (or fake) $r$.</b> A single extreme point can drag $r$ from $0$ to
         $0.9$. <i>Fix:</i> use rank-based <b>Spearman</b> (robust to outliers) and re-check $r$ with the
         suspect point removed.</li>
         <li><b>High inter-correlation breaks linear-model coefficients.</b> When two features are near-twins,
         the model can't tell which deserves the credit, so coefficients balloon, flip sign, and change on
         refit (multicollinearity). <i>Fix:</i> drop one of the pair, combine them, run PCA, or use ridge.</li>
         <li><b>Reading too much into a noisy correlation.</b> On a few dozen rows, $r=0.3$ can appear by
         chance. <i>Fix:</i> check the sample size and a confidence interval before trusting a middling value.</li>
         <li><b>Spurious correlations multiply with many features.</b> A wide table has thousands of pairs;
         some will look strongly correlated purely by chance. <i>Fix:</i> don't cherry-pick the brightest
         cell out of hundreds &mdash; correct for multiple comparisons or validate on fresh data.</li>
       </ul>`,

    bigIdea:
      `<p>A <b>correlation matrix</b> is a square grid: one row and one column per numeric feature, and the
       cell at $(i,j)$ is the correlation between feature $i$ and feature $j$. The diagonal is always $1$
       (every column correlates perfectly with itself), and the grid is symmetric (cell $(i,j)$ equals cell
       $(j,i)$), so you really only read one triangle.</p>
       <p>Paint each cell by its value &mdash; bright for strongly positive, dark for strongly negative,
       flat for near-zero &mdash; and the grid becomes a <b>heatmap</b> you can scan in seconds. Two things
       jump out: the <b>target's row</b> (which features track what you want to predict) and the <b>bright
       off-diagonal blocks</b> (groups of features that are really telling you the same thing).</p>
       <p>The one mental model to fix: a bright cell is a <i>flag to investigate</i>, not a verdict. It can
       be a real predictor, a redundant twin, a leak, or an artifact of one outlier. The matrix points your
       eyes; the scatter plot and your judgment decide.</p>`,

    buildup:
      `<p>Each cell is a <b>Pearson correlation</b> $r$ between two columns: covariance divided by both
       standard deviations, which forces the value into $[-1,1]$ and strips out the units. In pandas this is
       one call: <code>df.corr()</code> returns the whole matrix at once.</p>
       <p>To <b>find predictors</b>, pull out the target's column from the matrix, take the <i>absolute
       value</i> (a strong negative correlation is just as useful as a strong positive one), and sort
       descending. The top of that list is your candidate-feature shortlist.</p>
       <p>To <b>find redundancy</b>, look at the off-diagonal cells <i>among the features</i>. Take the
       upper triangle (to avoid counting each pair twice and to skip the all-ones diagonal), and flag any
       pair whose $|r|$ exceeds a threshold like $0.8$ or $0.9$. Each flagged pair is a candidate to drop,
       merge, or feed to PCA.</p>
       <p>If the trend looks <b>curved but always rising</b>, swap the method: <code>df.corr(method=
       'spearman')</code> computes the same matrix on the <i>ranks</i>, so monotonic curves read as strong
       and outliers stop dominating.</p>`,

    symbols: [
      { sym: "$X_i, X_j$", desc: "two columns (features) of the data table." },
      { sym: "$r_{ij}$", desc: "the Pearson correlation between columns $i$ and $j$ &mdash; the $(i,j)$ cell of the matrix, in $[-1,1]$." },
      { sym: "$\\bar X, s_X$", desc: "the sample mean and standard deviation of a column (its center and spread)." },
      { sym: "$\\operatorname{cov}(X_i,X_j)$", desc: "covariance: the average of $(X_i-\\bar X_i)(X_j-\\bar X_j)$; positive when the two columns rise together." },
      { sym: "$\\rho$", desc: "Spearman's correlation: Pearson's $r$ computed on the ranks; strength of a monotonic (always-rising or always-falling) trend, robust to curves and outliers." },
      { sym: "$y$", desc: "the target column; its row in the matrix ranks the candidate predictors." }
    ],

    formula:
      `$$ r_{ij}=\\frac{\\operatorname{cov}(X_i,X_j)}{s_{X_i}\\, s_{X_j}}
         =\\frac{\\sum_k (X_{ik}-\\bar X_i)(X_{jk}-\\bar X_j)}
                {\\sqrt{\\sum_k (X_{ik}-\\bar X_i)^2}\\,\\sqrt{\\sum_k (X_{jk}-\\bar X_j)^2}}
         \\;\\in[-1,1] $$`,

    whatItDoes:
      `<p>The formula is Pearson's $r$ applied to every pair of columns at once. The numerator is the
       <b>covariance</b> &mdash; do the two columns sit above their averages at the same time? The
       denominator divides out both spreads, so the result is unit-free and capped at $\\pm 1$: $+1$ a
       perfect up-line, $-1$ a perfect down-line, $0$ no straight-line trend. Stack one $r_{ij}$ per pair
       into a grid and you have the matrix.</p>
       <p><b>Reading it:</b> the diagonal is all ones (ignore it). In the <b>target's line</b>, the cells
       with the largest $|r|$ are your candidate predictors. In the <b>feature&ndash;feature</b> cells, a
       value near $\\pm 1$ marks a redundant twin. The <b>sign</b> tells direction, but for both jobs you
       sort and threshold on the <i>magnitude</i> $|r|$, because a strong negative correlation is just as
       informative as a strong positive one.</p>`,

    derivation:
      `<p><b>Why the matrix is symmetric with a unit diagonal.</b></p>
       <ul class="steps">
         <li>Correlation is built from covariance, and $\\operatorname{cov}(X_i,X_j)=\\operatorname{cov}
         (X_j,X_i)$ &mdash; the product $(X_i-\\bar X_i)(X_j-\\bar X_j)$ doesn't care about order. Dividing by
         the same two standard deviations either way gives $r_{ij}=r_{ji}$, so the grid mirrors across the
         diagonal. You only ever need one triangle.</li>
         <li>On the diagonal, $r_{ii}$ is the correlation of a column with itself: numerator and denominator
         are identical, so $r_{ii}=1$ exactly. That is why the diagonal carries no information &mdash; skip it.</li>
         <li><b>Why $|r|$, not $r$, for ranking.</b> A feature with $r=-0.85$ predicts the target as well as
         one with $r=+0.85$; only the direction differs. So to shortlist predictors or flag redundant pairs
         you sort and threshold on $|r|$, then read the sign afterward.</li>
         <li><b>Why a bright off-diagonal block hurts linear models.</b> If $X_i$ and $X_j$ are near-perfect
         linear copies, the regression can shift weight between them almost freely &mdash; the math has no
         unique answer. Coefficients blow up, flip sign, and wobble on refit. Dropping one, or replacing the
         block with its PCA components (which are uncorrelated by construction), restores a stable fit. $\\blacksquare$</li>
       </ul>`,

    example:
      `<p><b>A tiny matrix you can read by hand.</b> Three columns: <code>size_cm</code>,
       <code>size_in</code> (the same lengths in inches), and <code>price</code> the target. Suppose the
       correlations come out:</p>
       <ul class="steps">
         <li><b>Target line.</b> $r(\\text{size\\_cm},\\,\\text{price})=0.78$ and
         $r(\\text{size\\_in},\\,\\text{price})=0.78$. Both are strong &mdash; size is a candidate predictor.
         Sorted by $|r|$, size sits at the top of the shortlist.</li>
         <li><b>Feature line.</b> $r(\\text{size\\_cm},\\,\\text{size\\_in})=1.00$. That cell is a blazing
         off-diagonal twin: the two columns are the <i>same measurement</i> in different units. Keeping both
         would give a linear model an impossible choice &mdash; textbook multicollinearity.</li>
         <li><b>The read.</b> Drop one of the duplicate size columns, keep the other as a predictor. One
         glance at the matrix &mdash; one bright target cell, one $r=1.00$ off-diagonal &mdash; tells the
         whole EDA story.</li>
       </ul>
       <p>Real tables hide softer versions of this: a pair at $r=0.86$ is redundant-ish, a target cell at
       $|r|=0.85$ is a strong predictor. The matrix turns "which columns matter and which repeat?" into a
       picture you scan in seconds.</p>`,

    practice: [
      {
        q: `You build <code>df.corr()</code> on 13 numeric features plus the target. The target's row shows <code>flavanoids</code> at r = -0.85 and <code>total_phenols</code> at r = -0.72, and the off-diagonal cell between those two features is r = +0.86. How do you read this, and what do you do?`,
        steps: [
          { do: `Look at the target's row first and sort by absolute correlation.`, why: `Both features have large $|r|$ with the target, so both are strong candidate predictors; the negative sign just means they fall as the target class index rises.` },
          { do: `Now look at the off-diagonal cell between the two features.`, why: `$r=+0.86$ means flavanoids and total_phenols are near-twins &mdash; they carry almost the same information (redundancy / multicollinearity).` },
          { do: `Decide what to keep.`, why: `For a linear model, feeding both inflates and destabilizes the coefficients; keep the stronger predictor (flavanoids), or merge the group with PCA, or use ridge.` }
        ],
        answer: `<p>Both <code>flavanoids</code> ($|r|=0.85$) and <code>total_phenols</code> ($|r|=0.72$) are <b>strong candidate predictors</b> &mdash; the negative sign is fine, you rank on magnitude. But their mutual $r=0.86$ flags them as <b>redundant near-twins</b>. For a linear model that redundancy is <b>multicollinearity</b>, so don't keep both blindly: keep <code>flavanoids</code> (the stronger one), or collapse the correlated group with <b>PCA</b>, or switch to <b>ridge</b> regression. A tree model tolerates the redundancy better but still gains little from the duplicate.</p>`
      },
      {
        q: `A feature X plotted against the target looks like a clear smile-shaped (U) curve, yet <code>df.corr()</code> reports r ≈ 0.03 for that cell. A teammate says "near-zero correlation, drop X." Right or wrong?`,
        steps: [
          { do: `Recall what the matrix's default measure is.`, why: `<code>df.corr()</code> is Pearson by default, which measures only a <i>straight-line</i> trend.` },
          { do: `Match it to the shape you see.`, why: `A symmetric U has no net linear slope, so Pearson $r\\approx 0$ even though the relationship is strong &mdash; this is the Anscombe lesson.` },
          { do: `Reach for a measure that sees the shape.`, why: `Mutual Information (any shape) catches the U; Spearman would also be low because a U is not monotonic, which is itself the clue the link is curved, not absent.` }
        ],
        answer: `<p>Wrong. The matrix's default is <b>Pearson</b>, which only sees straight lines, so $r\\approx 0$ rules out a <i>line</i>, not a relationship. The U-curve is a real nonlinear dependence Pearson is blind to. <b>Keep X</b>: confirm with <b>Mutual Information</b> (it flags the U) and consider a squared term or a nonlinear model. This is exactly why you never read a correlation cell without the scatter &mdash; Anscombe's quartet shows four datasets with the same $r$ and four different shapes.</p>`
      },
      {
        q: `On 40 rows and 200 features you scan the correlation matrix and the brightest off-diagonal cell is r = 0.61 between two unrelated-seeming columns. Should you trust it as a real relationship?`,
        steps: [
          { do: `Count how many pairs you searched over.`, why: `200 features give about 20,000 distinct pairs; with only 40 rows, plenty will hit $|r|\\approx 0.6$ by pure chance.` },
          { do: `Recognize the multiple-comparisons trap.`, why: `Cherry-picking the single brightest cell out of thousands is selecting on noise &mdash; a spurious correlation.` },
          { do: `Validate instead of trusting.`, why: `Check the relationship on fresh data (or a held-out split), correct for multiple comparisons, and confirm with a scatter before reading anything into it.` }
        ],
        answer: `<p>Don't trust it yet. With 200 features there are roughly 20,000 pairs, and on only 40 rows a $|r|$ near $0.6$ will appear <b>by chance</b> for some pair &mdash; this is the <b>spurious-correlation / multiple-comparisons</b> trap. Picking the single brightest cell out of thousands is selecting on noise. <b>Fix:</b> verify on a fresh split or new data, apply a multiple-comparison correction, and always look at the scatter before believing a wide-table correlation.</p>`
      }
    ]
  });

  window.CODE["dw-correlation"] = {
    lib: "pandas + seaborn",
    runnable: false,
    explain: `<p>The everyday EDA loop on a real table. Build the matrix with <code>df.corr()</code>
      (Pearson by default; pass <code>method='spearman'</code> for monotonic/ranked trends), draw it as a
      <code>seaborn</code> heatmap, then read it twice: <b>sort features by absolute correlation with the
      target</b> to get a predictor shortlist, and <b>scan the upper triangle for $|r|$ above a threshold</b>
      to flag redundant feature pairs. Uses the bundled <code>load_wine</code> dataset, so it runs as-is.</p>`,
    code: `import numpy as np
import pandas as pd
import seaborn as sns
import matplotlib.pyplot as plt
from sklearn.datasets import load_wine

wine = load_wine(as_frame=True)
df = wine.frame                       # 13 continuous features + 'target' (3 classes)

# === 1) Build the correlation matrix (Pearson is the default) ===
corr = df.corr(method="pearson")      # use method="spearman" for monotonic/ranked trends

# === 2) Draw the heatmap — the chart every EDA notebook shows ===
plt.figure(figsize=(10, 8))
sns.heatmap(corr, annot=True, fmt=".2f", cmap="coolwarm", center=0,
            vmin=-1, vmax=1, square=True, cbar_kws={"label": "Pearson r"})
plt.title("Correlation matrix — load_wine")
plt.tight_layout()
# plt.show()

# === 3) Read it for PREDICTORS: sort features by |corr with the target| ===
target_corr = corr["target"].drop("target")          # the target's row, minus the diagonal
ranked = target_corr.abs().sort_values(ascending=False)
print("Features by |correlation with target|:")
print(ranked.round(3).head(6))
# flavanoids 0.847, od280/... 0.788, total_phenols 0.719, proline 0.634, hue 0.617, ...

# === 4) Read it for REDUNDANCY: flag highly inter-correlated feature pairs ===
feat_corr = corr.drop(index="target", columns="target")   # features only
upper = feat_corr.where(np.triu(np.ones(feat_corr.shape, dtype=bool), k=1))  # upper triangle
THRESH = 0.8
pairs = (upper.abs().stack()                               # (f1, f2) -> |r|
              .loc[lambda s: s > THRESH]
              .sort_values(ascending=False))
print("\\nRedundant feature pairs (|r| > %.1f):" % THRESH)
print(pairs.round(3))
# total_phenols / flavanoids 0.865 -> near-twins: drop one, merge, or PCA the group.

# === 5) Act on it: drop one column from each redundant pair before a LINEAR model ===
to_drop = {"total_phenols"}            # keep flavanoids (stronger target corr), drop its twin
df_model = df.drop(columns=list(to_drop))
print("\\nKept", df_model.shape[1] - 1, "features after dropping", to_drop)`
  };

  window.CODEVIZ["dw-correlation"] = {
    question: "On the real load_wine table, which features correlate most strongly with the wine class (candidate predictors) — and which feature pairs are redundant near-twins you'd flag in the matrix?",
    charts: [
      {
        type: "bars",
        title: "Each feature's |Pearson correlation| with the wine-class target (predictor shortlist)",
        xlabel: "feature",
        ylabel: "|correlation with target|",
        labels: ["flavanoids", "od280", "total_phenols", "proline", "hue", "alcalinity", "proantho", "nonflav_phenols"],
        values: [0.847, 0.788, 0.719, 0.634, 0.617, 0.518, 0.499, 0.489],
        valueLabels: ["0.85", "0.79", "0.72", "0.63", "0.62", "0.52", "0.50", "0.49"],
        colors: ["#7ee787", "#7ee787", "#7ee787", "#4ea1ff", "#4ea1ff", "#4ea1ff", "#4ea1ff", "#4ea1ff"]
      },
      {
        type: "heatmap",
        title: "Pearson correlation matrix of 6 load_wine features (real computed r — bright off-diagonal cells = redundancy)",
        rows: ["alcohol", "flavanoids", "color_int", "hue", "od280", "proline"],
        cols: ["alcohol", "flavanoids", "color_int", "hue", "od280", "proline"],
        matrix: [
          [1.00, 0.24, 0.55, -0.07, 0.07, 0.64],
          [0.24, 1.00, -0.17, 0.54, 0.79, 0.49],
          [0.55, -0.17, 1.00, -0.52, -0.43, 0.32],
          [-0.07, 0.54, -0.52, 1.00, 0.57, 0.24],
          [0.07, 0.79, -0.43, 0.57, 1.00, 0.31],
          [0.64, 0.49, 0.32, 0.24, 0.31, 1.00]
        ],
        showVals: true
      }
    ],
    caption: "Bars: features sorted by |Pearson r| with the 3-class wine target — flavanoids (0.85), od280 (0.79) and total_phenols (0.72) top the candidate-predictor shortlist (green = strongest). Heatmap: the feature-feature matrix; the bright cell flavanoids-vs-od280 (r=0.79) marks redundant near-twins to drop or PCA, while color_int-vs-hue move oppositely (r=-0.52) and alcohol-vs-hue (r=-0.07) only rules out a straight line. All numbers computed from the 178-row load_wine dataset.",
    code: `import numpy as np
from sklearn.datasets import load_wine

wine = load_wine()
names = list(wine.feature_names)
X, y = wine.data, wine.target

# --- bars: each feature's |Pearson r| with the target, sorted ---
Xt = np.column_stack([X, y])             # append target as last column
ft = np.corrcoef(Xt.T)[:-1, -1]          # feature-vs-target correlations
order = np.argsort(np.abs(ft))[::-1][:8]
for i in order:
    print(f"{names[i]:>30s}  |r| = {abs(ft[i]):.3f}")
# flavanoids 0.847, od280/... 0.788, total_phenols 0.719, proline 0.634, ...

# --- heatmap: Pearson correlation matrix among 6 chosen features ---
pick = ["alcohol", "flavanoids", "color_intensity", "hue",
        "od280/od315_of_diluted_wines", "proline"]
idx = [names.index(p) for p in pick]
corr = np.corrcoef(X[:, idx].T)          # 6x6, diagonal = 1.0
print(np.round(corr, 2))`
  };
})();
