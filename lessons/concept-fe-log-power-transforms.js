/* =====================================================================
   FEATURE ENGINEERING (Zheng & Casari) — Chapter 2:
   "Log Transformation" + "Power Transforms / Box-Cox".
   One self-contained concept lesson, faithful to the book.
   ===================================================================== */
(function () {
  window.LESSONS.push({
    id: "fe-log-power-transforms",
    title: "Log & Power Transforms (Box-Cox)",
    tagline: "Squash a long-tailed positive feature so it looks more like a bell curve.",
    module: "Feature Engineering",
    prereqs: ["met-regression", "met-distribution"],

    whenToUse:
      `<p><b>Reach for a log or power transform when a positive feature is heavy-tailed</b> — a few huge values and a big pile of small ones. Counts do this all the time: review counts, word counts, page views, friends, dollars.</p>
       <p>The log <b>compresses the high end and stretches the low end</b>. A handful of giants stop dominating, and the bulk of small values spreads out. The reshaped feature is closer to a bell curve (Gaussian), which linear models and distance-based methods like better.</p>
       <p><b>Choose it over:</b></p>
       <ul>
         <li><b>Leaving the feature raw</b> — when the tail is so long that a few points drive the whole fit. Logging tames them without throwing them away.</li>
         <li><b>Plain $\\sqrt{x}$</b> — when the data is roughly count-like (Poisson). The square root is the natural <i>variance-stabilizing</i> move for counts; the log is a stronger squash for an even heavier tail.</li>
         <li><b>Box-Cox</b> — when you don't want to guess between log, square root, or something in between. Box-Cox <i>fits</i> the best power for you.</li>
       </ul>
       <p><b>Which library:</b> <code>numpy.log10</code> / <code>numpy.log1p</code> for the log; <code>scipy.stats.boxcox</code> to auto-pick the power.</p>`,

    application:
      `<p>Straight from Chapter 2 of the book. Two real datasets:</p>
       <ul>
         <li><b>Yelp business review counts.</b> Most businesses have a handful of reviews; a few have thousands. The raw <code>review_count</code> histogram is a sharp spike near zero with a long thin tail. After <code>log10(review_count + 1)</code> the histogram spreads into a much more symmetric, bell-like shape.</li>
         <li><b>UCI Online News Popularity.</b> The book log-transforms the <code>n_tokens_content</code> (word-count) feature. The logged feature looks far more Gaussian, and a simple linear regression predicting article shares gets a small bump in $R^2$ (the book's 10-fold cross-validated $R^2$ improved from $-0.00242$ to $-0.00114$).</li>
       </ul>
       <p>The honest lesson the book draws: a transform can reshape a feature beautifully and still barely move a weak model. Both are worth knowing — the reshape is real, the downstream payoff depends on the task.</p>`,

    pitfalls:
      `<ul>
         <li><b>$\\log(0)$ is $-\\infty$.</b> Counts hit zero. The book's fix is to add 1 before logging: $\\log_{10}(x+1)$ (NumPy's <code>log1p</code> does exactly this), so a count of 0 maps to 0, not to negative infinity.</li>
         <li><b>Logs and Box-Cox need <i>positive</i> data.</b> If a feature has zeros or negatives, shift it first (add a constant so the smallest value is positive) before transforming. Box-Cox in particular requires strictly positive inputs.</li>
         <li><b>Over-transforming.</b> If a feature is already roughly symmetric, logging it can <i>create</i> a left skew. Look at the before/after histogram; don't transform on autopilot.</li>
         <li><b>Feature vs target.</b> You can transform a feature, the target, or both — but they are different decisions. Logging the target changes what "error" means and what you must un-log at prediction time. Keep them straight.</li>
         <li><b>Box-Cox $\\lambda$ must be fit on the training set only.</b> Estimating $\\lambda$ from all the data leaks test information. Fit $\\lambda$ on train, then apply that same $\\lambda$ to the validation and test sets (just like a scaler).</li>
       </ul>`,

    bigIdea:
      `<p>A heavy-tailed positive feature is lopsided: a tall pile of small values and a long thin tail of giants.</p>
       <p>The <b>logarithm</b> is a ruler that gets coarser as numbers grow. Going from 1 to 10 and from 1000 to 10000 are the <i>same</i> step in log-land (both multiply by 10).</p>
       <p>So the log <b>pulls the giant values inward</b> and <b>spreads the crowded small values apart</b>. The lopsided pile relaxes into something close to a symmetric bell.</p>
       <p><b>Power transforms</b> generalize this. The log is one extreme; the square root is a gentler version. <b>Box-Cox</b> is the whole family with one dial, and it can read your data to set the dial automatically.</p>`,

    buildup:
      `<p>Why do counts want a square root specifically? Many counts behave like a <b>Poisson</b> variable — counting independent events in a fixed window. A Poisson has a peculiar property: its <b>variance equals its mean</b>. So big-count regions are also noisy-count regions; the spread grows with the level.</p>
       <p>That uneven spread breaks methods that assume constant noise. A <b>variance-stabilizing transform</b> reshapes the feature so the spread is roughly constant everywhere. For a Poisson, $\\sqrt{X}$ does this. For an even heavier tail, the log does a stronger version of the same job.</p>
       <p>Box-Cox is the bridge: a single parameter $\\lambda$ that slides smoothly from "no change" through "square root" all the way to "log", and you let the data pick where to land.</p>`,

    symbols: [
      { sym: "$x$", desc: "one raw value of a positive feature (e.g. a review count of 137)." },
      { sym: "$\\log_{10}(x+1)$", desc: "the base-10 log after adding 1 so a value of 0 maps safely to 0 instead of $-\\infty$." },
      { sym: "$\\ln(x)$", desc: "the natural log (base $e\\approx 2.718$); the special $\\lambda=0$ case of Box-Cox." },
      { sym: "$\\sqrt{x}$", desc: "the square root: the variance-stabilizing transform for count-like (Poisson) data." },
      { sym: "$\\lambda$", desc: "the Box-Cox power dial (Greek 'lambda'). $\\lambda=1$ leaves the data essentially unchanged, $\\lambda=0.5$ is a square root, $\\lambda=0$ is the log." },
      { sym: "$\\tilde{x}$", desc: "the Box-Cox transformed value of $x$ (read 'x-tilde')." }
    ],

    formula: `$$ \\tilde{x}=\\begin{cases}\\dfrac{x^{\\lambda}-1}{\\lambda} & \\lambda\\ne 0\\\\[2mm]\\ln(x) & \\lambda=0\\end{cases}\\qquad\\qquad \\text{log transform: } \\log_{10}(x+1) $$`,

    whatItDoes:
      `<p>The right-hand piece is the everyday <b>log transform</b>: add 1 (to dodge $\\log 0$), then take $\\log_{10}$.</p>
       <p>The left-hand piece is the <b>Box-Cox</b> family. The dial $\\lambda$ chooses the strength:</p>
       <ul>
         <li>$\\lambda=1$: $\\tilde{x}=x-1$ — basically the raw feature (just shifted), no reshaping.</li>
         <li>$\\lambda=0.5$: a square-root-like squash, good for Poisson counts.</li>
         <li>$\\lambda\\to 0$: the formula smoothly becomes $\\ln(x)$ — the strongest squash, for the heaviest tails.</li>
       </ul>
       <p>You don't pick $\\lambda$ by hand. <b>Maximum likelihood</b> picks the $\\lambda$ that makes the transformed feature look as Gaussian as possible.</p>`,

    derivation:
      `<p><b>Why the log reshapes a tail.</b></p>
       <ul class="steps">
         <li>A heavy tail means the feature spans orders of magnitude: 1, 10, 100, 1000, 10000. On a linear axis the big values sit far out alone, leaving everything else crushed near zero.</li>
         <li>The log measures <i>ratios</i>, not differences: $\\log 10-\\log 1=\\log 100-\\log 10=1$. Equal multiplicative gaps become equal additive gaps. The 1-to-10000 span shrinks to a 0-to-4 span on the $\\log_{10}$ axis.</li>
         <li>So the lonely giants get pulled in and the crushed small values get spread out — the histogram relaxes toward symmetry.</li>
       </ul>
       <p><b>Why $\\sqrt{X}$ stabilizes a Poisson.</b></p>
       <ul class="steps">
         <li>A Poisson with mean $\\mu$ has variance $\\mu$ too, so the standard deviation is $\\sqrt{\\mu}$ — it grows with the level.</li>
         <li>The delta method says transforming by $g$ scales the standard deviation by $|g'|$. For $g(x)=\\sqrt{x}$, $g'(x)=\\tfrac{1}{2\\sqrt{x}}$, so the transformed standard deviation is about $\\tfrac{1}{2\\sqrt{\\mu}}\\cdot\\sqrt{\\mu}=\\tfrac{1}{2}$ — a constant, independent of $\\mu$. The spread is now level everywhere. $\\blacksquare$</li>
       </ul>
       <p><b>Why Box-Cox unifies them.</b> As $\\lambda\\to 0$, $\\dfrac{x^{\\lambda}-1}{\\lambda}\\to\\ln(x)$ (that's the limit definition of the log), and $\\lambda=0.5$ is a shifted-and-scaled $\\sqrt{x}$. One formula, a continuum of squashes, with $\\lambda$ chosen by maximum likelihood.</p>`,

    example:
      `<p>Take four Yelp-style review counts: $x=0, 9, 99, 9999$. They span four orders of magnitude — a textbook heavy tail. The table runs each value through the two transforms the lesson teaches: the log transform $\\log_{10}(x+1)$ and a Box-Cox squash. For Box-Cox use $\\lambda=0.5$ (a square root), whose formula is $\\tilde{x}=\\dfrac{x^{0.5}-1}{0.5}=2\\big(\\sqrt{x}-1\\big)$; Box-Cox needs positive input, so feed it $x+1$.</p>
       <table class="extable">
         <caption>Raw counts vs the log transform vs Box-Cox ($\\lambda=0.5$, on $x+1$).</caption>
         <thead>
           <tr><th>raw $x$</th><th class="num">$x+1$</th><th class="num">$\\log_{10}(x+1)$</th><th class="num">$\\sqrt{x+1}$</th><th class="num">Box-Cox $\\tilde{x}=2(\\sqrt{x+1}-1)$</th></tr>
         </thead>
         <tbody>
           <tr><td class="num">0</td><td class="num">1</td><td class="num">0</td><td class="num">1</td><td class="num">0</td></tr>
           <tr><td class="num">9</td><td class="num">10</td><td class="num">1</td><td class="num">3.162</td><td class="num">4.325</td></tr>
           <tr><td class="num">99</td><td class="num">100</td><td class="num">2</td><td class="num">10</td><td class="num">18</td></tr>
           <tr><td class="num">9999</td><td class="num">10000</td><td class="num">4</td><td class="num">100</td><td class="num">198</td></tr>
         </tbody>
       </table>
       <ul class="steps">
         <li><b>Log transform.</b> Add 1, then $\\log_{10}$: $\\log_{10}(0+1)=0$, $\\log_{10}(10)=1$, $\\log_{10}(100)=2$, $\\log_{10}(10000)=4$. The raw jumps $0\\to 9\\to 99\\to 9999$ become the near-even steps $0\\to 1\\to 2\\to 4$. Note $0$ mapped to $0$, not $-\\infty$, because we added 1 first.</li>
         <li><b>Box-Cox at $\\lambda=0.5$.</b> Plug $x+1$ into $\\tilde{x}=2(\\sqrt{x+1}-1)$. For $x=9$: $\\sqrt{10}=3.162$, so $\\tilde{x}=2(3.162-1)=4.325$. For $x=99$: $\\sqrt{100}=10$, so $\\tilde{x}=2(10-1)=18$. For $x=9999$: $\\sqrt{10000}=100$, so $\\tilde{x}=2(100-1)=198$.</li>
         <li><b>Compare the squash strength.</b> The giant $9999$ versus the small $9$: the raw ratio is $9999/9\\approx 1111\\times$. After the square-root Box-Cox it is $198/4.325\\approx 46\\times$; after the log it is $4/1=4\\times$. The log is the <i>stronger</i> squash — it pulls the lonely giant in the hardest, which is why it tames the heaviest tails.</li>
         <li>That re-spacing is exactly what makes the histogram look more Gaussian — and the choice of $\\lambda$ (log vs square root vs in between) is the dial Box-Cox sets for you by maximum likelihood.</li>
       </ul>`,

    practice: [
      {
        q: `A feature <code>page_views</code> is a count that ranges from 0 to about 4,000,000, with most pages under 100 views. You want to feed it to a linear regression. Your colleague writes <code>np.log10(df['page_views'])</code> and the pipeline crashes on some rows. What broke, what is the one-character-idea fix, and why does logging help this feature at all?</p>`,
        steps: [
          { do: `Find what crashed.`, why: `Some pages have 0 views, and $\\log_{10}(0)=-\\infty$ (NumPy emits $-\\infty$ / a warning, and downstream math on $-\\infty$ blows up). Any zero-containing count feature hits this.` },
          { do: `Apply the book's fix.`, why: `Add 1 before logging: <code>np.log10(df['page_views'] + 1)</code> (or <code>np.log1p</code>). Now a count of 0 maps to $\\log_{10}(1)=0$, finite and sensible. The "+1" is the whole trick.` },
          { do: `Explain why logging is worth it here.`, why: `Page views span six orders of magnitude with a giant tail. The log compresses the millions-of-views giants and spreads the under-100 crowd, turning a spike-plus-tail into a more symmetric, more Gaussian feature that a linear model handles better.` }
        ],
        answer: `<p>The crash is <b>$\\log_{10}(0)=-\\infty$</b> — the count feature has zeros. The fix is the book's <b>$\\log_{10}(x+1)$</b>: <code>np.log10(df['page_views'] + 1)</code>, which sends 0 to 0 instead of $-\\infty$. Logging helps because <code>page_views</code> is heavy-tailed over many orders of magnitude; the log squashes the giants and stretches the small bulk, producing a more symmetric, more Gaussian feature that linear regression prefers.</p>`
      },
      {
        q: `You run <code>scipy.stats.boxcox</code> on a strictly-positive feature and it returns $\\lambda \\approx 0.02$. (a) What transform is Box-Cox essentially applying? (b) What would $\\lambda \\approx 0.5$ have meant instead? (c) A teammate fits $\\lambda$ on the full dataset (train + test together). Why is that a mistake?`,
        steps: [
          { do: `Read $\\lambda \\approx 0$.`, why: `Box-Cox at $\\lambda=0$ is exactly $\\ln(x)$. A fitted $\\lambda\\approx 0.02$ means maximum likelihood decided the feature is heavy-tailed enough that an essentially-log transform makes it most Gaussian.` },
          { do: `Contrast $\\lambda \\approx 0.5$.`, why: `$\\lambda=0.5$ is a (shifted, scaled) square root — a gentler squash, the natural variance-stabilizer for milder, Poisson-like count data.` },
          { do: `Spot the leak.`, why: `$\\lambda$ is a parameter estimated from data. Fitting it on test rows lets test information bleed into the transform, so your reported test score is optimistic. Fit $\\lambda$ on train only, then apply that fixed $\\lambda$ to validation/test — like any scaler.` }
        ],
        answer: `<p><b>(a)</b> $\\lambda\\approx 0$ is the <b>log</b>: Box-Cox at $\\lambda=0$ is $\\ln(x)$, so it's applying essentially a natural-log transform. <b>(b)</b> $\\lambda\\approx 0.5$ would be a <b>square-root-like</b> squash — gentler, the variance-stabilizing choice for milder Poisson-like counts. <b>(c)</b> Fitting $\\lambda$ on train+test <b>leaks</b> test information into a learned parameter, inflating the test score. Estimate $\\lambda$ on the training set only and reuse that same $\\lambda$ on validation and test.</p>`
      }
    ]
  });

  window.CODE["fe-log-power-transforms"] = {
    lib: "pandas / numpy / scikit-learn / scipy",
    runnable: false,
    explain:
      `<p>The book's Chapter 2 examples, reproduced faithfully. First the <b>Yelp</b> review-count log transform and a 10-fold cross-validated linear-regression $R^2$ comparing the raw vs logged feature (the book gets about $-0.037$ either way — the reshape is real but this weak single-feature model barely moves). Then the same log transform on the <b>UCI Online News Popularity</b> word-count feature, where the book's 10-fold $R^2$ improves from $-0.00242$ to $-0.00114$. Finally the <b>Box-Cox</b> fit on the Yelp review counts via <code>scipy.stats.boxcox</code>, which returns both the transformed values and the maximum-likelihood $\\lambda$.</p>
       <p>Datasets: Yelp Dataset Challenge business JSON, and the UCI Online News Popularity dataset. Code and data pointers: <code>github.com/alicezheng/feature-engineering-book</code>. <code>runnable:false</code> because the datasets must be downloaded first.</p>`,
    code: `import pandas as pd
import numpy as np
import json
from scipy import stats
from sklearn.linear_model import LinearRegression
from sklearn.model_selection import cross_val_score

# ---------------------------------------------------------------
# Example 1: Yelp business review counts (Yelp Dataset Challenge)
#   data: github.com/alicezheng/feature-engineering-book
# ---------------------------------------------------------------
biz_file = open('yelp_academic_dataset_business.json')
biz_df = pd.DataFrame([json.loads(x) for x in biz_file.readlines()])
biz_file.close()

# Log transform: add 1 first so review_count == 0 -> log10(1) == 0
biz_df['log_review_count'] = np.log10(biz_df['review_count'] + 1)

# Does the log feature predict star rating better than the raw count?
# 10-fold cross-validated R^2 of a one-feature linear regression.
m_orig = LinearRegression()
scores_orig = cross_val_score(m_orig, biz_df[['review_count']],
                              biz_df['stars'], cv=10)

m_log = LinearRegression()
scores_log = cross_val_score(m_log, biz_df[['log_review_count']],
                             biz_df['stars'], cv=10)

print("R^2 raw review_count : %0.5f (+/- %0.5f)"
      % (scores_orig.mean(), scores_orig.std() * 2))
print("R^2 log_review_count : %0.5f (+/- %0.5f)"
      % (scores_log.mean(), scores_log.std() * 2))
# Book result: both about -0.037 -- the histogram is reshaped a lot,
# but this weak single-feature model barely changes.

# ---------------------------------------------------------------
# Example 2: UCI Online News Popularity word-count feature
#   archive.ics.uci.edu/ml/datasets/Online+News+Popularity
# ---------------------------------------------------------------
news_df = pd.read_csv('OnlineNewsPopularity.csv', delimiter=', ')

news_df['log_n_tokens_content'] = np.log10(news_df['n_tokens_content'] + 1)

m_orig = LinearRegression()
scores_orig = cross_val_score(m_orig, news_df[['n_tokens_content']],
                              news_df['shares'], cv=10)
m_log = LinearRegression()
scores_log = cross_val_score(m_log, news_df[['log_n_tokens_content']],
                             news_df['shares'], cv=10)

print("R^2 raw n_tokens_content : %0.5f" % scores_orig.mean())
print("R^2 log n_tokens_content : %0.5f" % scores_log.mean())
# Book result: improves from -0.00242 (raw) to -0.00114 (logged):
# the log made the word-count feature much more Gaussian and slightly
# improved the linear regression's R^2.

# ---------------------------------------------------------------
# Example 3: Box-Cox on the Yelp review counts (needs positive data,
#   so feed review_count + 1). boxcox picks lambda by max likelihood.
# ---------------------------------------------------------------
rc_log = np.log10(biz_df['review_count'] + 1)
rc_bc, bc_params = stats.boxcox(biz_df['review_count'] + 1)
print("Box-Cox lambda = %0.4f" % bc_params)   # ~0 means ~ a log transform`
  };

  window.CODEVIZ["fe-log-power-transforms"] = {
    question: "How do you READ a before/after histogram to tell if a log or power transform actually helped? Here is the ideal reshape plus three things you might really see.",
    charts: [
      {
        type: "bars",
        title: "BEFORE: raw 'mean area' is right-skewed (skew +1.05, long right tail)",
        xlabel: "mean area bin",
        ylabel: "count of tumors",
        labels: ["179-366", "366-554", "554-741", "741-929", "929-1116", "1116-1304", "1304-1491"],
        values: [8, 23, 14, 4, 2, 3, 6],
        colors: ["#ff7b72", "#ff7b72", "#ff7b72", "#ff7b72", "#ff7b72", "#ff7b72", "#ff7b72"],
        interpret: "<b>Read this as the problem.</b> The x-axis is the raw feature split into equal-width bins; the y-axis is how many tumors land in each bin. The tall bar sits on the LEFT and a thin tail trails off to the RIGHT — that lopsided pile-plus-tail shape (skew about +1.05, positive = right tail) is exactly the heavy-tailed positive feature a log/power transform is built to fix."
      },
      {
        type: "bars",
        title: "IDEAL AFTER: log10(area) is far more symmetric (skew +0.04, bell-shaped)",
        xlabel: "log10(mean area) bin",
        ylabel: "count of tumors",
        labels: ["2.25-2.38", "2.38-2.52", "2.52-2.65", "2.65-2.78", "2.78-2.91", "2.91-3.04", "3.04-3.17"],
        values: [3, 5, 10, 15, 15, 3, 9],
        colors: ["#7ee787", "#7ee787", "#7ee787", "#7ee787", "#7ee787", "#7ee787", "#7ee787"],
        interpret: "<b>This is the win.</b> Same axes, but x is now log10 of the feature. The bars rise to a peak in the MIDDLE and fall off on both sides, and the skew has collapsed from +1.05 to about +0.04 (near zero = symmetric). When you see the peak move inward and the tail disappear like this, the transform did its job — the feature is now roughly bell-shaped (Gaussian)."
      },
      {
        type: "bars",
        title: "OVER-TRANSFORMED: log applied to already-symmetric data (skew -0.7, illustrative)",
        xlabel: "log10(value) bin",
        ylabel: "count",
        labels: ["lo", "", "", "mid", "", "", "hi"],
        values: [10, 8, 7, 6, 4, 2, 1],
        colors: ["#ffb454", "#ffb454", "#ffb454", "#ffb454", "#ffb454", "#ffb454", "#ffb454"],
        interpret: "<b>Recognise over-transforming.</b> (Illustrative shape.) The starting feature was already roughly symmetric, so logging it did not fix a right tail — it MANUFACTURED a left one: now the tall bars sit on the LEFT and trail down to the right (skew about -0.7, negative = left tail). The tell is that the skew flipped sign instead of shrinking toward zero. Lesson: don't transform on autopilot; check that the feature was actually right-skewed first."
      },
      {
        type: "bars",
        title: "TOO WEAK: sqrt on a very heavy tail — still right-skewed (skew +0.6, illustrative)",
        xlabel: "sqrt(value) bin",
        ylabel: "count",
        labels: ["lo", "", "", "mid", "", "", "hi"],
        values: [20, 14, 8, 4, 2, 1, 1],
        colors: ["#ff7b72", "#ff7b72", "#ff7b72", "#ff7b72", "#ff7b72", "#ff7b72", "#ff7b72"],
        interpret: "<b>Recognise an under-squash.</b> (Illustrative shape.) A square root is a gentler transform than a log. On a very heavy tail it pulls the giants in only partway, so the histogram is LESS skewed than the raw feature but still leans right (skew about +0.6, still clearly positive). The tell: the shape improved but the peak is still glued to the left edge. Reach for a stronger squash — the log, or let Box-Cox pick a smaller lambda."
      }
    ],
    caption: "Read the FOUR cases. Top two are the real before/after on a bundled scikit-learn dataset (60 sampled tumors): raw 'mean area' skew +1.05 collapses to +0.04 after log10 — the ideal. The bottom two are illustrative failure modes you must be able to spot: logging an already-symmetric feature creates a left skew (over-transform), and a square root on a very heavy tail leaves it still right-skewed (too weak). Always compare the before and after skew/shape before trusting a transform.",
    code: `import numpy as np
from sklearn.datasets import load_breast_cancer

# A heavy-tailed positive feature: tumor 'mean area' (column 3).
bc = load_breast_cancer()
area = bc.data[:, 3]                      # strictly positive, right-skewed

# Subsample to 60 points for a clean in-browser histogram.
rng = np.random.RandomState(0)
area = rng.choice(area, size=60, replace=False)

# BEFORE: histogram of the raw feature (7 equal-width bins).
raw_counts, raw_edges = np.histogram(area, bins=7)

# AFTER: histogram of log10(area). All values > 0, so no +1 needed here;
# for count features with zeros you would use np.log10(x + 1).
log_area = np.log10(area)
log_counts, log_edges = np.histogram(log_area, bins=7)

print("raw skew (right tail):", round(float(((area - area.mean())**3).mean()
      / area.std()**3), 3))
print("log skew (more symmetric):", round(float(((log_area - log_area.mean())**3).mean()
      / log_area.std()**3), 3))
print("raw  bin counts:", raw_counts.tolist())
print("log  bin counts:", log_counts.tolist())
# Raw distribution is right-skewed; log10 pulls the tail in and the
# histogram becomes far more symmetric / Gaussian -- exactly the book's point.`
  };
})();
