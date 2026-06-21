/* Feature Engineering — Chapter 2, "Quantization or Binning".
   BEGINNER lesson. Self-contained: lesson + CODE + CODEVIZ merged by id "fe-binning". */
(function () {
  window.LESSONS.push({
    id: "fe-binning",
    title: "Quantization (binning): turning counts into buckets",
    tagline: "Chop a heavy-tailed count into a handful of bins so the big values stop dominating.",
    module: "Feature Engineering",
    prereqs: [],

    bigIdea:
      `<p>Some raw numbers span a huge range. A business on Yelp might have <b>3</b> reviews or
       <b>3,000</b>. A song might have been played twice or two million times. When a feature like this
       feeds a model, the giant values <b>shout over</b> the small ones: a linear model treats the
       difference between 1 and 2 reviews the same as between 2,001 and 2,002, even though the first
       difference matters far more.</p>
       <p><b>Quantization</b> (also called <b>binning</b>) fixes this. You stop using the raw count and
       instead say which <b>bucket</b> it falls into: "0&ndash;9 reviews", "10&ndash;99 reviews", and so
       on. The model now sees a small ordered category instead of an unbounded number. This is the very
       first transform in Chapter 2 of Zheng &amp; Casari's <i>Feature Engineering for Machine Learning</i>,
       and their running example is the <b>Yelp business <code>review_count</code></b> &mdash; a classic
       heavy-tailed count.</p>
       <p>The book gives two ways to draw the bin edges. <b>Fixed-width</b> bins are evenly spaced (every
       bin is the same width, or every bin is the same factor of 10). <b>Quantile</b> bins are placed at
       the data's own quantiles so each bin holds the <b>same number of points</b>. The rest of this
       lesson is just those two ideas and when to pick each.</p>`,

    buildup:
      `<p>Think of a count $x$ (reviews, plays, clicks) and a desired number of bins. Binning is a
       function that maps $x$ to a small integer <b>bin index</b> $b$.</p>
       <p><b>Fixed-width, linear.</b> Pick a bin width $w$ (say 10). The bin index is just integer
       division: $b=\\lfloor x/w\\rfloor$. So $0\\text{--}9\\to 0$, $10\\text{--}19\\to 1$, and so on. Every
       bin covers the same width $w$ on the number line.</p>
       <p><b>Fixed-width, exponential.</b> When counts span many orders of magnitude, equal-width bins are
       hopeless (you'd need thousands of them). Instead make the bins grow by powers of 10: bin by the
       <b>base-10 logarithm</b>, $b=\\lfloor\\log_{10}x\\rfloor$. Now $1\\text{--}9\\to 0$,
       $10\\text{--}99\\to 1$, $100\\text{--}999\\to 2$ &mdash; each bin is ten times wider than the last,
       matching the spread of a heavy tail.</p>
       <p><b>Quantile (adaptive).</b> Both fixed schemes ignore <i>where the data actually sits</i>. If
       almost every business has under 50 reviews, a fixed scheme wastes most of its bins on the empty
       high end. Quantile binning instead puts the edges at the data's <b>quantiles</b> (its deciles, or
       quartiles) so that <b>each bin holds an equal count of points</b>. The edges bunch up where the
       data is dense and spread out where it is sparse.</p>`,

    symbols: [
      { sym: "$x$", desc: "the raw count being binned (e.g. a Yelp business's number of reviews)." },
      { sym: "$w$", desc: "the bin width for fixed-width linear binning (e.g. 10 reviews per bin)." },
      { sym: "$b$", desc: "the resulting bin index &mdash; a small ordered integer the model uses instead of $x$." },
      { sym: "$\\lfloor\\,\\cdot\\,\\rfloor$", desc: "the floor function: round down to the nearest whole number." },
      { sym: "$\\log_{10}x$", desc: "base-10 logarithm of $x$: how many digits (powers of 10) $x$ has. Used for exponential bins." },
      { sym: "$q_\\alpha$", desc: "the $\\alpha$-quantile of the data: the value below which a fraction $\\alpha$ of points fall (e.g. $q_{0.5}$ is the median, the deciles are $q_{0.1},\\dots,q_{0.9}$)." }
    ],

    formula:
      `$$ b_{\\text{linear}}=\\left\\lfloor \\frac{x}{w}\\right\\rfloor,\\qquad
         b_{\\text{exp}}=\\left\\lfloor \\log_{10}x\\right\\rfloor,\\qquad
         b_{\\text{quantile}}=\\#\\{\\alpha : q_\\alpha \\le x\\} $$`,

    whatItDoes:
      `<p><b>Linear fixed-width</b> divides by the width and floors: it is a ruler with evenly spaced tick
       marks. Cheap and interpretable, but on a heavy tail most bins past the first one or two come out
       <b>empty</b>.</p>
       <p><b>Exponential fixed-width</b> takes the log first, so each bin is a power-of-10 band. This is the
       right fixed scheme for counts that span orders of magnitude &mdash; it spaces the buckets the way the
       data actually spreads.</p>
       <p><b>Quantile</b> binning counts how many quantile edges $x$ sits above. Because the edges are the
       data's own quantiles, every bin ends up with roughly the <b>same number of points</b>. No empty
       bins, no single bin swallowing 95% of the data &mdash; ideal for skewed, gappy features.</p>`,

    derivation:
      `<p><b>Why a heavy tail needs more than equal-width bins.</b></p>
       <ul class="steps">
         <li>A heavy-tailed count (reviews, plays, followers) has most of its mass crammed at the low end and a long thin tail reaching to huge values. Zheng &amp; Casari illustrate this with the Yelp <code>review_count</code>: the median business has only a handful of reviews, but a few have thousands.</li>
         <li>Put equal-width bins of width $w$ on that and the first bin holds nearly everyone while every later bin is almost empty. The feature you hand the model is then mostly a single constant &mdash; useless. This is the <b>empty-bin</b> problem.</li>
         <li>Exponential bins ($\\lfloor\\log_{10}x\\rfloor$) fix the <i>spacing</i>: a band $10\\text{--}99$ is ten times wider than $1\\text{--}9$, so the tail gets fewer, wider bins and the head gets the resolution it deserves. The book's exact line is <code>np.floor(np.log10(large_counts))</code>.</li>
         <li>Quantile bins fix the <i>occupancy</i> directly. Sort the data, then cut at the deciles $q_{0.1},q_{0.2},\\dots,q_{0.9}$ so each of the 10 bins gets exactly one-tenth of the points. The edges automatically crowd together where data is dense and stretch apart in the tail.</li>
         <li>The book reads the deciles straight off the data with <code>biz_df['review_count'].quantile([.1,.2,...,.9])</code>; for the Yelp set those nine cut points came out at counts of <b>3, 4, 5, 6, 8, 12, 17, 28, 58</b> &mdash; tight at the low end, then jumping to 58, exactly mirroring the heavy tail. $\\blacksquare$</li>
       </ul>`,

    example:
      `<p>Take a handful of Yelp-style review counts and bin them three ways.</p>
       <p>Counts: $x = \\{5,\\ 8,\\ 12,\\ 37,\\ 95,\\ 410,\\ 2503\\}$.</p>
       <ul class="steps">
         <li><b>Linear, width $w=10$</b> &mdash; $b=\\lfloor x/10\\rfloor$: the small counts give $0,0,1,3$ and the big ones give $9, 41, 250$. The first bin already holds two points, and bins $2,4,5,\\dots,40$ are <b>empty</b>. Lopsided, as expected for a heavy tail.</li>
         <li><b>Exponential</b> &mdash; $b=\\lfloor\\log_{10}x\\rfloor$: $5,8\\to 0$ (one digit); $12,37,95\\to 1$ (tens); $410\\to 2$ (hundreds); $2503\\to 3$ (thousands). Four tidy bins, each a power-of-10 band &mdash; the spread now matches the data.</li>
         <li><b>Quantile (quartiles, 4 bins)</b> &mdash; with 7 points the cut points sit near $12$, $37$, and $95$. Each bin gets about two points: $\\{5,8\\}$, $\\{12,37\\}$, $\\{95,410\\}$, $\\{2503\\}$. Roughly <b>equal counts</b> per bin, no empties.</li>
       </ul>
       <p>Same data, three layouts: linear leaves gaping holes, exponential matches the orders of
       magnitude, and quantile evens out the counts.</p>`,

    whenToUse:
      `<p><b>The choice tracks the shape of your data.</b></p>
       <ul>
         <li><b>Fixed-width linear</b> &mdash; reach for it when the values are roughly <b>uniform or
         bounded</b> (ages 0&ndash;100, hours of the day, a rating 1&ndash;5). Bins of equal width are
         simple, interpretable, and reproducible: the edges don't depend on the sample.</li>
         <li><b>Fixed-width exponential (log binning)</b> &mdash; use when a count <b>spans several orders
         of magnitude</b> but you still want fixed, data-independent edges: views, file sizes, populations.
         Power-of-10 bands keep the bin count small without crushing the head.</li>
         <li><b>Quantile binning</b> &mdash; the book's recommendation for <b>skewed, heavy-tailed, or
         gappy</b> features like the Yelp <code>review_count</code>. Equal-count bins guarantee every bucket
         is populated and no single bin dominates.</li>
         <li><b>Why bin at all?</b> Mainly to give a <b>linear model a nonlinearity</b> &mdash; after
         binning (often followed by one-hot encoding) a linear model can fit a separate weight per bucket,
         capturing a curve it could never fit on the raw count. It also <b>robustifies</b> against extreme
         values. For tree models, which already split on thresholds, binning is <b>less necessary</b>.</li>
       </ul>`,

    application:
      `<p>Binning shows up wherever a raw count feeds a model.</p>
       <ul>
         <li><b>The book's Yelp example.</b> Zheng &amp; Casari bin the business <code>review_count</code>
         from the Yelp Dataset Challenge &mdash; a heavy-tailed count &mdash; using both fixed-width
         (linear and exponential) and quantile schemes, then feed the buckets to downstream models.</li>
         <li><b>Linear models with nonlinear features.</b> Binning a continuous feature and one-hot encoding
         the bins lets logistic / linear regression learn a step-function response (a crude spline) without
         any extra math.</li>
         <li><b>Robust pipelines &amp; privacy.</b> Bucketing ages, incomes, or counts caps the influence of
         outliers and is a common anonymization step ("age 30&ndash;39" instead of "37").</li>
       </ul>`,

    pitfalls:
      `<ul>
         <li><b>Empty fixed-width bins on skewed data.</b> Equal-width bins over a heavy tail leave most
         bins with zero points and pile everyone into the first one. The fix: switch to <b>exponential</b>
         (log) bins or <b>quantile</b> bins, which adapt to the data's spread.</li>
         <li><b>Quantile edges depend on the sample &mdash; this can leak.</b> The decile cut points are
         <i>learned from data</i>. Fit them on the <b>training set only</b> and reuse those exact edges on
         validation/test/production; recomputing quantiles on the test set leaks information and makes
         results irreproducible.</li>
         <li><b>You lose the within-bin ordering.</b> Once two businesses land in the same bucket, the model
         can't tell 12 reviews from 99. Binning trades resolution for robustness; if fine-grained ordering
         matters, keep the raw value (or also add a log-transformed copy).</li>
         <li><b>$\\log_{10}x$ needs positive inputs.</b> A count of 0 makes $\\log_{10}0=-\\infty$. Add 1
         first (bin $\\log_{10}(x+1)$) or handle the zero bucket separately.</li>
       </ul>`,

    practice: [
      {
        q: `You bin the Yelp <code>review_count</code> into 20 equal-width bins. Almost every business lands in bin 0 and bins 5 through 19 are empty. What went wrong and what are the two fixes from the chapter?`,
        steps: [
          { do: `Recognize the feature is heavy-tailed: a few businesses have thousands of reviews, but the median has a handful.`, why: `Equal-width bins of width $w$ put nearly all the mass in the first bin and leave the tail bins empty.` },
          { do: `Switch to exponential bins: $\\lfloor\\log_{10}x\\rfloor$ via <code>np.floor(np.log10(...))</code>.`, why: `Power-of-10 bands are ten times wider each step, so the long tail gets a few wide bins instead of hundreds of empty ones.` },
          { do: `Or switch to quantile bins via <code>pd.qcut</code>, cutting at the deciles.`, why: `Equal-count bins guarantee every bucket is populated, regardless of how skewed the raw counts are.` }
        ],
        answer: `<p>The <b>empty-bin problem</b>: equal-width bins over a heavy tail dump everyone into bin 0 and leave the rest empty. The chapter's two fixes are <b>exponential (log) binning</b> &mdash; <code>np.floor(np.log10(x))</code> &mdash; and <b>quantile binning</b> &mdash; <code>pd.qcut(x, n, labels=False)</code>, whose deciles for the Yelp data were 3, 4, 5, 6, 8, 12, 17, 28, 58.</p>`
      },
      {
        q: `A teammate computes quantile bin edges on the full dataset, then splits into train and test. Why is this a problem, and how should the edges be produced instead?`,
        steps: [
          { do: `Note that quantile edges are learned from data &mdash; they are parameters of the transform.`, why: `Unlike a fixed width of 10, the decile cut points come from the values themselves.` },
          { do: `Computing them on the full dataset uses test-set values to set the edges.`, why: `That is data leakage: information from the test set has bled into the feature definition, inflating measured performance.` },
          { do: `Fit the quantiles on the training set only, store the edges, and apply those same edges to validation/test/production.`, why: `This keeps the transform honest and reproducible, exactly like fitting any other preprocessor on train only.` }
        ],
        answer: `<p>Quantile edges are <b>learned parameters</b>, so computing them on all the data <b>leaks</b> test information into the feature. Fit the deciles on the <b>training set only</b>, save those edges, and reuse them everywhere. Fixed-width edges (a constant width like 10) don't have this issue because they don't depend on the sample.</p>`
      },
      {
        q: `For two different features &mdash; a 1-to-5 star rating, and a play-count that ranges from 2 to 4 million &mdash; which binning scheme fits each, and why?`,
        steps: [
          { do: `Look at the range and shape of each feature.`, why: `The star rating is small and bounded; the play-count is heavy-tailed across orders of magnitude.` },
          { do: `For the bounded, roughly-uniform rating, use fixed-width linear bins (or leave it as is).`, why: `Equal-width bins are simple and the buckets stay populated because the range is small and even.` },
          { do: `For the play-count, use exponential (log) bins or quantile bins.`, why: `Equal-width bins would be almost all empty; log bands or equal-count quantiles match the heavy tail.` }
        ],
        answer: `<p>The bounded, uniform-ish <b>star rating</b> suits <b>fixed-width linear</b> bins. The heavy-tailed <b>play-count</b> needs an adaptive scheme: <b>exponential (log) binning</b> for fixed, data-independent power-of-10 bands, or <b>quantile binning</b> for guaranteed equal-count buckets. Equal-width bins on the play-count would be mostly empty.</p>`
      }
    ]
  });

  window.CODE["fe-binning"] = {
    lib: "pandas + numpy",
    runnable: false,
    explain: `<p>The chapter's exact code on the Yelp business <code>review_count</code> (Yelp Dataset Challenge, round 6). <b>Fixed-width linear</b> binning is integer division with <code>np.floor_divide</code>; <b>fixed-width exponential</b> binning is <code>np.floor(np.log10(...))</code>; <b>quantile</b> binning is <code>pd.qcut</code>, and you can read the decile edges off with <code>.quantile([...])</code>. The dataset is on the book's GitHub (github.com/alicezheng/feature-engineering-book); set <code>runnable</code> aside &mdash; you need to download the Yelp JSON first.</p>`,
    code: `import numpy as np
import pandas as pd
import json

# --- Load the Yelp business data (Yelp Dataset Challenge, round 6) ---
# Get it from the book's repo: github.com/alicezheng/feature-engineering-book
biz_file = open('yelp_academic_dataset_business.json')
biz_df = pd.DataFrame([json.loads(x) for x in biz_file.readlines()])
biz_file.close()

# 'review_count' is a heavy-tailed count: most businesses have a few reviews,
# a handful have thousands.

# === Fixed-width binning ===
# Linear: map a count to a bin by INTEGER DIVISION (bin width = 10).
small_counts = np.array([0, 5, 13, 28, 37, 99, 100, 7000])
np.floor_divide(small_counts, 10)
# -> array([  0,   0,   1,   2,   3,   9,  10, 700])

# Exponential: group by powers of 10 (take the log10, then floor).
large_counts = np.array([296, 8286, 64011, 80, 3, 725, 867, 2215,
                         7689, 11495, 91897, 44, 28, 7971, 926, 122, 22222])
np.floor(np.log10(large_counts))
# -> array([2., 3., 4., 1., 0., 2., 2., 3., 3., 4., 4., 1., 1., 3., 2., 2., 4.])

# === Quantile binning (adaptive: equal-count bins) ===
# Cut review_count into 4 equal-count bins; labels=False -> integer bin index.
pd.qcut(large_counts, 4, labels=False)

# Read the deciles straight off the data to see where the edges fall:
deciles = biz_df['review_count'].quantile([.1, .2, .3, .4, .5, .6, .7, .8, .9])
print(deciles)
# For the Yelp review_count the deciles came out:
# 0.1 -> 3   0.2 -> 4   0.3 -> 5   0.4 -> 6   0.5 -> 8
# 0.6 -> 12  0.7 -> 17  0.8 -> 28  0.9 -> 58
# Tight at the low end, then jumping to 58 -- exactly mirroring the heavy tail.`
  };

  window.CODEVIZ["fe-binning"] = {
    question: "Take a skewed real count (the 'mean area' of cells in load_breast_cancer) and split it into 5 fixed-width bins vs 5 quantile bins. Which scheme keeps the bins evenly populated?",
    charts: [
      {
        type: "bars",
        title: "Fixed-width (equal-width) bins: occupancy is LOPSIDED on skewed data",
        labels: ["179–441", "441–704", "704–966", "966–1229", "1229–1491"],
        values: [17, 25, 7, 5, 6],
        valueLabels: ["17", "25", "7", "5", "6"],
        colors: ["#ff7b72", "#ff7b72", "#ff7b72", "#ff7b72", "#ff7b72"]
      },
      {
        type: "bars",
        title: "Quantile (equal-count) bins: every bin holds the SAME 12 points",
        labels: ["179–411", "411–518", "518–641", "641–824", "824–1491"],
        values: [12, 12, 12, 12, 12],
        valueLabels: ["12", "12", "12", "12", "12"],
        colors: ["#7ee787", "#7ee787", "#7ee787", "#7ee787", "#7ee787"]
      }
    ],
    caption: "Real numbers from load_breast_cancer (60 cells subsampled, feature 'mean area' — a right-skewed count-like value). Fixed-width bins of equal width are lopsided: 17 and 25 points crowd the low end while the three high bins hold only 7, 5, 6. Quantile bins put their edges at the data's own quintiles, so all five bins hold exactly 12 points each. The book uses the heavy-tailed Yelp review_count; this is the same idea on a bundled dataset.",
    code: `import numpy as np
from sklearn.datasets import load_breast_cancer

d = load_breast_cancer()                         # 569 real cell-nucleus measurements
fi = list(d.feature_names).index('mean area')
area = d.data[:, fi]                              # right-skewed, count-like feature

rng = np.random.RandomState(0)
area = np.sort(area[rng.choice(len(area), 60, replace=False)])   # subsample to 60

# Fixed-width: 5 equal-width bins across the range (numpy only, no pandas).
fw_edges = np.linspace(area.min(), area.max(), 6)
fw_occ = np.histogram(area, bins=fw_edges)[0]
print('fixed-width edges  :', np.round(fw_edges).astype(int))
print('fixed-width counts :', fw_occ)            # -> [17 25  7  5  6]  (lopsided)

# Quantile: edges at the 0,20,40,60,80,100 percentiles -> equal-count bins.
q_edges = np.percentile(area, [0, 20, 40, 60, 80, 100])
q_occ = np.histogram(area, bins=q_edges)[0]
print('quantile edges     :', np.round(q_edges).astype(int))
print('quantile counts    :', q_occ)             # -> [12 12 12 12 12]  (even)`
  };
})();
