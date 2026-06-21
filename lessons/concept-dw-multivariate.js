/* Data Wrangling — "Multivariate EDA: many variables and groups at once".
   Self-contained: lesson + CODE + CODEVIZ merged by id "dw-multivariate". */
(function () {
  window.LESSONS.push({
    id: "dw-multivariate",
    title: "Multivariate EDA: looking at many variables and groups at once",
    tagline: "Compare segments and high-dimensional structure — and never trust an aggregate before you check the groups.",
    module: "Data Wrangling",
    prereqs: ["skill-data-audit", "met-distribution", "met-association"],

    bigIdea:
      `<p>Looking at one column at a time tells you the shape of each variable. Looking at <b>two</b>
       columns together (a scatter, a correlation) tells you how a pair moves. <b>Multivariate</b>
       Exploratory Data Analysis (EDA) is the next step up: looking at <b>many variables</b> &mdash; and
       crucially many <b>groups or segments</b> &mdash; <b>at the same time</b>.</p>
       <p>You have a small toolbox for this. The <b>pair plot</b> (also called a scatter-matrix) draws every
       pair of features as a grid of scatter plots, so you scan all the two-way relationships in one glance.
       <b>Encodings</b> &mdash; color, marker size, and faceting (small multiples) &mdash; let you fold extra
       variables into a single chart. <b>Grouped aggregation</b> (<code>groupby().agg()</code> in pandas)
       collapses each segment to a few summary numbers so you can compare them in a table. And when there are
       too many features to plot pairwise, you <b>project</b> the data down to 2-D with
       <a href="#fe-pca">PCA (Principal Component Analysis)</a> or
       <a href="#cls-tsne">t-SNE</a> and look at the cloud.</p>
       <p>But the headline of this lesson is a <b>warning</b>. The single most dangerous mistake in
       multivariate analysis is trusting a number computed over the <b>whole</b> dataset when the data is
       really made of <b>groups</b>. A trend can hold in every subgroup and then <b>reverse</b> when you pool
       them. That reversal has a name: <b>Simpson's paradox</b>.</p>`,

    buildup:
      `<p>Here is the tool, then the trap.</p>
       <p><b>The pair plot / scatter-matrix.</b> With $k$ numeric columns, draw a $k \\times k$ grid: cell
       $(i,j)$ is a scatter of feature $i$ against feature $j$, and the diagonal shows each feature's own
       distribution (a histogram). One picture, every two-way relationship. Color the points by a category
       (e.g. species, or class label) and you have added a <i>third</i> variable for free.</p>
       <p><b>More dimensions by encoding.</b> A 2-D scatter shows two variables on the axes. Map a third to
       <b>color</b>, a fourth to <b>marker size</b>, and split into a <b>facet</b> grid (one small chart per
       category) for a fifth. Each encoding is one more dimension you can read off a flat page.</p>
       <p><b>Grouped aggregation.</b> To compare segments numerically, split the rows by a key, then
       summarize each group: <code>df.groupby("segment").agg(...)</code>. You get one row per segment with
       its mean, count, median, whatever you ask for &mdash; a compact segment-vs-segment comparison.</p>
       <p><b>The trap.</b> Now suppose you compute one overall relationship &mdash; "treatment B has a higher
       success rate than treatment A" &mdash; on the pooled data. <b>Simpson's paradox</b> is the situation
       where that pooled conclusion is the <b>opposite</b> of what holds inside every group. A treatment can
       win in the small-stone group <b>and</b> win in the large-stone group, yet lose overall, simply because
       it was given more often to the harder cases. The aggregate is not a summary of the groups &mdash; it
       is a different, and here <b>misleading</b>, number.</p>`,

    whenToUse:
      `<p><b>Reach for multivariate EDA whenever groups or many variables are in play.</b></p>
       <ul>
         <li><b>Whenever segments exist.</b> If your rows fall into groups &mdash; regions, cohorts, device
         types, A/B arms, age bands &mdash; compare the groups explicitly with
         <code>groupby().agg()</code> and faceted plots. Do not stop at a single global number.</li>
         <li><b>Before trusting any aggregate relationship.</b> Any time you report "X is associated with Y"
         over the whole dataset, <b>re-check it within the relevant groups</b>. If the within-group trend
         disagrees with the pooled one, you have a Simpson's paradox (or at least confounding) and the pooled
         number is the wrong one to act on.</li>
         <li><b>When there are many features.</b> Use a pair plot for up to roughly a dozen columns; beyond
         that, project with <a href="#fe-pca">PCA</a> or <a href="#cls-tsne">t-SNE</a> to 2-D and look at the
         overall structure (clusters, gradients, outliers) instead of an exploding grid.</li>
         <li><b>Pair plot vs. projection.</b> The pair plot keeps every axis <b>interpretable</b> (real
         features) but does not scale; PCA/t-SNE scale to high dimension but the axes are <b>abstract</b>.
         Use the first to understand variables, the second to see global shape.</li>
       </ul>`,

    application:
      `<p>Multivariate EDA is where most real analysis decisions are made.</p>
       <ul>
         <li><b>Segment comparison dashboards.</b> Revenue per region, conversion per channel, error rate per
         device &mdash; all <code>groupby().agg()</code> tables. The whole point is to compare segments, not
         to read one grand total.</li>
         <li><b>Experiment and treatment analysis.</b> Before declaring a winner from a pooled rate, analysts
         break results down by relevant covariates &mdash; exactly to avoid a Simpson's-paradox reversal from
         imbalanced group sizes.</li>
         <li><b>Feature exploration for ML.</b> A pair plot colored by the target label shows which features
         separate the classes, which are redundant, and where the outliers live &mdash; before any modeling.</li>
         <li><b>High-dimensional structure.</b> Embeddings, gene-expression panels, sensor arrays: a
         <a href="#fe-pca">PCA</a> or <a href="#cls-tsne">t-SNE</a> map is the standard first look at whether
         the data has clusters or a continuous gradient.</li>
       </ul>`,

    pitfalls:
      `<ul>
         <li><b>Simpson's paradox &mdash; the aggregate reverses the subgroups.</b> A trend present in every
         group can flip when the groups are pooled. The classic real case: a kidney-stone trial where
         treatment A beat treatment B for <b>small</b> stones and for <b>large</b> stones, yet B looked better
         <b>overall</b> &mdash; because A was given mostly to the harder large stones. The fix: always check
         whether an aggregate relationship <b>survives within the relevant groups</b>, and report the
         group-level result.</li>
         <li><b>Confounding.</b> Simpson's paradox is the dramatic face of a general problem: a lurking third
         variable (here, stone size) drives both the grouping and the outcome. If you do not condition on the
         confounder, the raw association is not the causal effect.</li>
         <li><b>Comparing groups of very unequal size.</b> A pooled average is dominated by the biggest group.
         When group sizes are imbalanced <b>and</b> the outcome differs by group, the pool can mislead &mdash;
         this imbalance is exactly the engine of Simpson's paradox.</li>
         <li><b>Pair plots that explode.</b> A pair plot of $k$ features is $k^2$ panels; at 30 features that
         is 900 tiny, unreadable scatters. Pick a handful of features first, or switch to a projection.</li>
         <li><b>t-SNE artifacts read as real clusters.</b> t-SNE can manufacture tight, well-separated blobs
         from data that has none, and its cluster sizes and between-cluster distances are <b>not</b>
         meaningful. Do not over-interpret a t-SNE map; confirm structure another way.</li>
         <li><b>Ecological fallacy.</b> A relationship that holds at the <b>group</b> level need not hold at
         the <b>individual</b> level (and vice versa). Inferring about people from group averages is a
         well-known error &mdash; the mirror image of Simpson's paradox.</li>
       </ul>`,

    derivation:
      `<p><b>Why a per-group trend can reverse when pooled &mdash; the arithmetic.</b></p>
       <ul class="steps">
         <li>An overall rate is a <b>weighted average</b> of the group rates, with weights equal to the group
         sizes. For treatment A: $\\text{rate}_A = w^A_{\\text{small}}\\, r^A_{\\text{small}} +
         w^A_{\\text{large}}\\, r^A_{\\text{large}}$, where the $w$'s are the fraction of A's cases in each
         group and sum to 1.</li>
         <li>Suppose A beats B <i>within each group</i>: $r^A_{\\text{small}} \\gt r^B_{\\text{small}}$ and
         $r^A_{\\text{large}} \\gt r^B_{\\text{large}}$. This says nothing yet about the pooled rates, because A
         and B can have <b>different weights</b> $w$.</li>
         <li>Now let the large group be the <b>harder</b> one (lower success rate for both treatments), and
         give A mostly large cases ($w^A_{\\text{large}}$ near 1) while B gets mostly small cases
         ($w^B_{\\text{small}}$ near 1). A's average is dragged toward its <i>low</i> large-stone rate; B's
         average is pulled toward its <i>high</i> small-stone rate.</li>
         <li>With the real Charig 1986 numbers &mdash; small: $r^A=93.1\\%$ vs $r^B=86.7\\%$; large: $r^A=73.0\\%$
         vs $r^B=68.8\\%$ &mdash; A wins both. But A's cases are $87$ small and $263$ large, B's are $270$ small
         and $80$ large. Plugging into the weighted average gives $\\text{rate}_A = 78.0\\%$ and
         $\\text{rate}_B = 82.6\\%$: <b>B wins the pool</b>.</li>
         <li>So the reversal is not a paradox at all &mdash; it is what unequal weights do to a weighted
         average. The aggregate answers a different question ("which treatment did better, given how cases were
         <i>assigned</i>?") than the one you care about ("which treatment is better <i>for a given patient</i>?").
         Conditioning on the group recovers the right answer. $\\blacksquare$</li>
       </ul>`,

    symbols: [
      { sym: "$r^T_g$", desc: "the success rate of treatment $T$ inside group $g$ (e.g. $r^A_{\\text{small}}$ is treatment A's success rate on small stones)." },
      { sym: "$w^T_g$", desc: "the weight of group $g$ for treatment $T$ &mdash; the fraction of $T$'s cases that fall in group $g$. For each $T$ the weights sum to 1." },
      { sym: "$\\text{rate}_T$", desc: "the pooled (overall) success rate of treatment $T$: the size-weighted average $\\sum_g w^T_g\\, r^T_g$ of its per-group rates." },
      { sym: "$k$", desc: "the number of features in a pair plot; the grid has $k^2$ panels, which is why pair plots explode for large $k$." }
    ],

    formula:
      `$$ \\text{rate}_T = \\sum_g w^T_g\\, r^T_g, \\qquad \\sum_g w^T_g = 1 $$`,

    whatItDoes:
      `<p>The pooled rate of a treatment is a <b>weighted average</b> of its per-group rates, weighted by how
       its cases are distributed across groups. Because the weights $w^T_g$ can differ between treatments, two
       treatments with the <i>same</i> ranking in every group can end up with the <i>opposite</i> ranking once
       pooled. The formula is the whole mechanism of Simpson's paradox: change the weights (the group sizes)
       and you change which treatment "wins" the aggregate, without touching a single per-group rate.</p>`,

    example:
      `<p>The real kidney-stone trial (Charig et al., 1986), as a tiny table of <b>(successes / total)</b>.</p>
       <ul class="steps">
         <li><b>Small stones</b> &mdash; A: $81/87 = 93.1\\%$; B: $234/270 = 86.7\\%$. <b>A wins.</b></li>
         <li><b>Large stones</b> &mdash; A: $192/263 = 73.0\\%$; B: $55/80 = 68.8\\%$. <b>A wins again.</b></li>
         <li><b>Pooled</b> &mdash; A: $273/350 = 78.0\\%$; B: $289/350 = 82.6\\%$. <b>B wins the overall!</b></li>
       </ul>
       <p>A is better for small stones and better for large stones, yet worse overall. The trick is the
       imbalance: A was used on $263$ of the hard large-stone cases but only $87$ easy small ones, while B got
       $270$ easy and only $80$ hard &mdash; so A's pooled rate is dragged down toward its large-stone rate.
       The right move is to compare <b>within stone size</b>, where A clearly wins; the pooled number is the
       one to distrust.</p>`,

    practice: [
      {
        q: `Treatment A beats treatment B for small stones (93% vs 87%) and for large stones (73% vs 69%), yet B has the higher overall success rate (83% vs 78%). Which treatment should a patient prefer, and what produced the reversal?`,
        steps: [
          { do: `Note that A wins inside every subgroup.`, why: `The per-group rates are the like-for-like comparison: same stone size, so the only difference is the treatment.` },
          { do: `Look at how cases were assigned to each treatment.`, why: `A was given mostly to large (harder) stones; B mostly to small (easier) ones, so the groups are not comparable in the pool.` },
          { do: `Recognize the pooled rate is a size-weighted average, dragged by A's heavy large-stone load.`, why: `Unequal weights on unequal group rates make the aggregate flip even though no per-group rate changed.` }
        ],
        answer: `<p>Prefer <b>treatment A</b>: it wins in <b>both</b> stone-size groups, which is the fair, like-for-like comparison. The overall reversal is <b>Simpson's paradox</b>, caused by <b>confounding</b> &mdash; A was disproportionately used on the harder large stones, so its pooled rate is pulled down. The per-group result is the trustworthy one; the aggregate is misleading.</p>`
      },
      {
        q: `You have 30 numeric features and want to see the multivariate structure. A teammate suggests a seaborn pairplot of all 30. Why is that a bad idea, and what are two better options?`,
        steps: [
          { do: `Count the panels a pairplot would draw.`, why: `A pairplot of $k$ features is a $k \\times k$ grid; for $k=30$ that is 900 tiny scatter plots, far too many to read.` },
          { do: `Option 1: pick a handful of the most relevant features and pairplot only those.`, why: `A 4-to-6 feature pairplot stays legible and still shows the key two-way relationships.` },
          { do: `Option 2: project all 30 features to 2-D with PCA or t-SNE and plot the single cloud.`, why: `A projection scales to high dimension and shows global structure (clusters, gradients, outliers) in one chart.` }
        ],
        answer: `<p>A 30-feature pairplot is $30^2 = 900$ panels &mdash; it <b>explodes</b> and is unreadable. Better: (1) <b>pairplot a small chosen subset</b> of features so each panel is legible, or (2) <b>project to 2-D</b> with <a href="#fe-pca">PCA</a> or <a href="#cls-tsne">t-SNE</a> and look at the overall cloud. With t-SNE, remember its cluster sizes and gaps are not literally meaningful, so confirm any apparent clusters another way.</p>`
      },
      {
        q: `A t-SNE plot of your embeddings shows five crisp, well-separated blobs, and a colleague concludes "there are exactly five natural clusters." What is the risk, and how would you check?`,
        steps: [
          { do: `Recall what t-SNE optimizes.`, why: `t-SNE preserves local neighborhoods and can pull data into tight, well-separated blobs even when the underlying structure is continuous or has no real clusters.` },
          { do: `Treat the number, size, and separation of blobs as suspect.`, why: `t-SNE cluster sizes and between-cluster distances are not meaningful, so "exactly five" is not evidence on its own.` },
          { do: `Cross-check with another method.`, why: `A PCA view, different t-SNE perplexities, or an actual clustering metric (e.g. silhouette) tell you whether the five blobs are real.` }
        ],
        answer: `<p>The risk is reading a <b>t-SNE artifact</b> as real structure: t-SNE can manufacture crisp, separated blobs from data with no genuine clusters, and its blob sizes and gaps carry no quantitative meaning. <b>Check</b> by re-running at several perplexities, comparing against a <a href="#fe-pca">PCA</a> view, and validating with a real clustering criterion (e.g. silhouette score) before claiming "exactly five clusters."</p>`
      }
    ]
  });

  window.CODE["dw-multivariate"] = {
    lib: "pandas + seaborn",
    runnable: false,
    explain: `<p>Three multivariate moves in one script. First, <b>grouped aggregation</b> with
       <code>groupby().agg()</code> compares segments of the seaborn <code>tips</code> dataset side by side.
       Second, a <b>pairplot</b> (scatter-matrix) of the numeric features, colored by a category, shows every
       two-way relationship at once. Third &mdash; the cautionary tale &mdash; a constructed
       <b>Simpson's-paradox</b> table (the real Charig 1986 kidney-stone trial) where the per-group winner and
       the pooled winner <b>disagree</b>: <code>groupby("stone_size")</code> shows treatment A winning both
       groups, while the pooled <code>groupby("treatment")</code> shows B winning. Both datasets ship with
       seaborn / are inline, so the only setup is <code>pip install pandas seaborn</code>.</p>`,
    code: `import numpy as np
import pandas as pd
import seaborn as sns
import matplotlib.pyplot as plt

# ============================================================
# 1) Grouped aggregation: compare SEGMENTS with groupby().agg()
# ============================================================
tips = sns.load_dataset("tips")          # bundled with seaborn

# One row per (day, smoker) segment, several summaries each.
seg = (tips
       .groupby(["day", "smoker"])
       .agg(n=("total_bill", "size"),
            mean_bill=("total_bill", "mean"),
            mean_tip=("tip", "mean"),
            tip_pct=("tip", lambda s: (s / tips.loc[s.index, "total_bill"]).mean()))
       .round(2))
print(seg)
# Compare segments by reading down the table -- e.g. tip % across days/smokers.

# ============================================================
# 2) Pair plot (scatter-matrix): every pair of features at once,
#    with a 3rd variable folded in via COLOR (hue).
# ============================================================
sns.pairplot(tips, vars=["total_bill", "tip", "size"], hue="time",
             diag_kind="hist", height=2.2)
plt.suptitle("tips: scatter-matrix colored by lunch/dinner", y=1.02)
plt.show()
# For HIGH-dimensional data a pairplot explodes (k^2 panels); project instead:
#   from sklearn.decomposition import PCA   # see lesson fe-pca
#   from sklearn.manifold import TSNE       # see lesson cls-tsne
#   XY = PCA(n_components=2).fit_transform(X)   # then scatter XY colored by group

# ============================================================
# 3) SIMPSON'S PARADOX: the per-group trend REVERSES when pooled.
#    Real kidney-stone trial (Charig et al., 1986). Each cell is
#    (successes, total) for a treatment x stone-size combination.
# ============================================================
cells = {("A", "small"): (81, 87),  ("A", "large"): (192, 263),
         ("B", "small"): (234, 270), ("B", "large"): (55, 80)}

rows = []
for (trt, stone), (succ, n) in cells.items():
    rows += [(trt, stone, 1)] * succ + [(trt, stone, 0)] * (n - succ)
kidney = pd.DataFrame(rows, columns=["treatment", "stone_size", "success"])

# Per-group success rate: A wins for BOTH small and large stones.
per_group = (kidney.groupby(["stone_size", "treatment"])["success"]
             .mean().mul(100).round(1).unstack())
print("\\nPer-group success rate (%):")
print(per_group)          # small: A 93.1 > B 86.7 ; large: A 73.0 > B 68.8

# Pooled success rate: B wins overall -- the trend REVERSES.
overall = kidney.groupby("treatment")["success"].mean().mul(100).round(1)
print("\\nOverall success rate (%):")
print(overall)            # A 78.0  vs  B 82.6   <-- pooled winner is B!

# Why: A was given mostly to the HARDER large stones, dragging its pooled rate.
print("\\nGroup sizes (rows per treatment x stone_size):")
print(kidney.groupby(["treatment", "stone_size"]).size().unstack())
# Lesson: always check whether an aggregate relationship survives WITHIN groups.`
  };

  window.CODEVIZ["dw-multivariate"] = {
    question: "On the real kidney-stone trial, treatment A beats B for SMALL stones and for LARGE stones — does A still win once the two groups are pooled?",
    charts: [
      {
        type: "bars",
        title: "Per-group success rate: A beats B in BOTH groups (small and large stones)",
        labels: ["small\nA", "small\nB", "large\nA", "large\nB"],
        values: [93.1, 86.7, 73.0, 68.8],
        valueLabels: ["93.1%", "86.7%", "73.0%", "68.8%"],
        colors: ["#7ee787", "#4ea1ff", "#7ee787", "#4ea1ff"]
      },
      {
        type: "bars",
        title: "Pooled success rate: the trend REVERSES — B now beats A overall",
        labels: ["overall\nA", "overall\nB"],
        values: [78.0, 82.6],
        valueLabels: ["78.0%", "82.6%"],
        colors: ["#7ee787", "#4ea1ff"]
      }
    ],
    caption: "Real numbers from the Charig et al. (1986) kidney-stone trial. Treatment A (green) wins WITHIN each stone-size group — 93.1% vs 86.7% on small stones, 73.0% vs 68.8% on large stones. Yet pooled across groups, treatment B (blue) wins, 82.6% vs 78.0%. The reversal is Simpson's paradox: A was given to 263 of the hard large-stone cases but only 87 easy small ones (B got 270 small, 80 large), so A's size-weighted pooled rate is dragged down. Moral: always check whether an aggregate relationship survives within the relevant groups.",
    code: `import pandas as pd

# Charig et al. (1986) kidney-stone trial. Each cell = (successes, total)
# for one treatment x stone-size combination. A clean, REAL Simpson table.
cells = {("A", "small"): (81, 87),  ("A", "large"): (192, 263),
         ("B", "small"): (234, 270), ("B", "large"): (55, 80)}

rows = []
for (trt, stone), (succ, n) in cells.items():
    rows += [(trt, stone, 1)] * succ + [(trt, stone, 0)] * (n - succ)
df = pd.DataFrame(rows, columns=["treatment", "stone_size", "success"])

# Per-group rates -> chart 1 (A wins both groups).
per = df.groupby(["stone_size", "treatment"])["success"].mean().mul(100)
print("small A=%.1f  B=%.1f" % (per["small", "A"], per["small", "B"]))  # 93.1 86.7
print("large A=%.1f  B=%.1f" % (per["large", "A"], per["large", "B"]))  # 73.0 68.8

# Pooled rates -> chart 2 (B wins overall: the reversal).
overall = df.groupby("treatment")["success"].mean().mul(100)
print("ALL   A=%.1f  B=%.1f" % (overall["A"], overall["B"]))           # 78.0 82.6`
  };
})();
