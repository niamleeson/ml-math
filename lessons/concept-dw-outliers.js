/* Data Wrangling — "Outliers & impossible values: detect, then decide".
   Self-contained: lesson + CODE + CODEVIZ merged by id "dw-outliers". */
(function () {
  window.LESSONS.push({
    id: "dw-outliers",
    title: "Outliers and impossible values: detect, then decide",
    tagline: "Find the points that sit far from the rest, then ask: is it a data error, or a real extreme worth keeping?",
    module: "Data Wrangling",
    prereqs: ["met-distribution"],

    whenToUse:
      `<p>Run this step <b>after you have fixed types</b> (a column that should be a number is really a
       number) and <b>before you scale or model</b>. It is the moment you ask whether a few far-out points
       are quietly distorting everything downstream.</p>
       <ul>
         <li><b>Whenever a handful of extreme points could swing a result.</b> A mean, a standard deviation,
         a regression slope, a distance-based neighbor search &mdash; all of these can be dragged around by
         one or two values that are far from the crowd.</li>
         <li><b>Whenever a value is plainly impossible.</b> An age of 200, a negative price, a latitude of
         500, a heart rate of 0 in a living patient. These are not "extreme" &mdash; they are <b>wrong</b>,
         and they need a different response than a real but unusual point.</li>
         <li><b>Before scaling.</b> Min-max scaling and z-score standardization both read the column's
         spread. One giant value stretches the scale so every normal point gets squashed into a tiny range.
         Decide what to do with outliers <i>first</i>.</li>
       </ul>
       <p><b>The whole lesson is two questions in order:</b> (1) <i>detect</i> &mdash; which points are far
       out? (2) <i>decide</i> &mdash; is each one an <b>error</b> to fix or a <b>real extreme</b> to keep?</p>`,

    application:
      `<p>Outlier handling shows up everywhere raw data meets a model.</p>
       <ul>
         <li><b>Sensors and logs.</b> A stuck thermometer reports $-999$; a GPS glitch puts a delivery truck
         in the ocean. Impossible values like these are detected by <b>domain range checks</b>, not
         statistics.</li>
         <li><b>Prices, incomes, durations.</b> Heavy-tailed money and time columns have genuine extremes
         (the one huge purchase, the one very long session). Here the far-out point is often the <b>most
         important signal</b>, not noise.</li>
         <li><b>Fraud and fault detection.</b> The entire <i>goal</i> is to find the outlier. Multivariate
         detectors like <b>Isolation Forest</b> and <b>Local Outlier Factor (LOF)</b> are built for exactly
         this: flag the rare row that does not look like the rest.</li>
       </ul>`,

    bigIdea:
      `<p>An <b>outlier</b> is a value that sits far from the bulk of the data. Detecting one is easy; the
       hard part is the <b>decision</b> that follows. The same far-out point can be a typo to delete or the
       single most valuable row in the table &mdash; and you cannot tell which from the number alone. You
       have to ask what it <i>means</i>.</p>
       <p>So split the work in two. <b>First detect</b> &mdash; use a rule to flag points that are unusually
       far out. <b>Then decide</b> &mdash; look at each flagged point and classify it:</p>
       <ul>
         <li><b>Data error (impossible).</b> The value cannot exist in the real world: age $=200$, a
         negative price, a percentage of $130$. This is corruption. <b>Fix it</b> (correct the typo, treat as
         missing) or <b>remove the row</b>.</li>
         <li><b>Real extreme value.</b> The value is unusual but genuine: a billionaire's net worth, a viral
         post's view count, a record-breaking earthquake. <b>Keep it.</b> It may be the most important signal
         in the dataset &mdash; deleting it throws away exactly the thing you most wanted to learn.</li>
       </ul>
       <p>Once you have decided, you have four <b>handling options</b>: <b>leave</b> it as is,
       <b>cap / winsorize</b> it (pull it in to a sane limit), <b>transform</b> the column (e.g. a log) so the
       extreme is no longer extreme, or <b>remove</b> it. Which you pick depends on the <b>model</b>: tree
       models split on thresholds and barely care about how far out a point is, while linear and
       distance-based models (linear regression, k-Nearest-Neighbors, k-means, anything using a mean or a
       Euclidean distance) are <b>very</b> sensitive to extremes.</p>`,

    buildup:
      `<p>How do you flag "far out" with a number? There are five common detectors, from simplest to most
       general.</p>
       <p><b>1. The z-score rule.</b> Standardize each value to its z-score $z=(x-\\bar{x})/s$ &mdash; how many
       standard deviations it sits from the mean &mdash; and flag any point with $|z|\\gt 3$. Clean and fast,
       but it assumes a roughly <b>symmetric, bell-shaped</b> column, and the mean $\\bar{x}$ and standard
       deviation $s$ are themselves <i>dragged toward the outlier</i>, which can hide it.</p>
       <p><b>2. The IQR (Inter-Quartile Range) fence.</b> Let $Q_1$ and $Q_3$ be the 25th and 75th percentiles
       and $\\text{IQR}=Q_3-Q_1$ the spread of the middle half. Anything outside the fence
       $[\\,Q_1-1.5\\cdot\\text{IQR},\\ Q_3+1.5\\cdot\\text{IQR}\\,]$ is flagged. Because it uses
       <b>quartiles</b>, not the mean, it is far more robust to skew &mdash; this is the rule behind the box
       plot.</p>
       <p><b>3. Visual: the box plot.</b> The box spans $Q_1$ to $Q_3$, the line inside is the median, the
       whiskers reach to the fence, and points beyond the whiskers are drawn as individual dots &mdash; the
       same flagged points as the IQR rule, made <b>visible</b>.</p>
       <p><b>4. Robust z-score (median / MAD).</b> Replace the mean with the <b>median</b> and the standard
       deviation with the <b>MAD (Median Absolute Deviation)</b>, the median of $|x-\\text{median}|$. The
       robust score is $z_{\\text{rob}}=0.6745\\,(x-\\text{median})/\\text{MAD}$. Neither the median nor the MAD
       is pulled around by a few extremes, so this catches outliers the plain z-score misses.</p>
       <p><b>5. Multivariate.</b> Some points are normal in every single column yet bizarre in
       <i>combination</i> (height $200\\,$cm and weight $40\\,$kg are each fine; together they are odd).
       <b>Mahalanobis distance</b> measures how far a row is from the center accounting for the columns'
       correlations; <b>Isolation Forest</b> flags rows that are easy to isolate with random splits; <b>Local
       Outlier Factor (LOF)</b> flags rows whose local neighborhood is much sparser than their neighbors'.</p>`,

    symbols: [
      { sym: "$x$", desc: "a single value in the column being checked." },
      { sym: "$\\bar{x}$", desc: "the sample mean of the column." },
      { sym: "$s$", desc: "the sample standard deviation: the typical distance of a value from the mean." },
      { sym: "$z$", desc: "the z-score $(x-\\bar{x})/s$ &mdash; how many standard deviations $x$ sits from the mean." },
      { sym: "$Q_1,\\,Q_3$", desc: "the first and third quartiles: the 25th and 75th percentiles of the column." },
      { sym: "$\\text{IQR}$", desc: "the Inter-Quartile Range $Q_3-Q_1$: the spread of the middle 50% of the data." },
      { sym: "$\\text{MAD}$", desc: "the Median Absolute Deviation: the median of $|x-\\text{median}|$, a robust stand-in for $s$." }
    ],

    formula:
      `$$ |z|=\\left|\\frac{x-\\bar{x}}{s}\\right|\\gt 3
         \\qquad\\text{or}\\qquad
         x \\lt Q_1-1.5\\cdot\\text{IQR}\\ \\ \\text{or}\\ \\ x \\gt Q_3+1.5\\cdot\\text{IQR} $$`,

    whatItDoes:
      `<p>The <b>left rule</b> is the z-score test: convert $x$ to standard-deviation units and flag it when
       it is more than $3$ away from the mean. It is quick but trusts the mean and standard deviation, both of
       which the outlier itself distorts &mdash; and it assumes a symmetric column.</p>
       <p>The <b>right rule</b> is the IQR (Inter-Quartile Range) fence. It builds a box from the middle half
       of the data and extends a <b>fence</b> $1.5\\cdot\\text{IQR}$ past each quartile; anything outside is
       flagged. Because $Q_1$, $Q_3$, and the IQR come from <b>ranks</b>, not the mean, one giant value barely
       moves them &mdash; so the IQR rule keeps working on <b>skewed</b> data where the z-score breaks.</p>
       <p>Neither rule tells you what to <i>do</i>. They only point at candidates; the error-vs-extreme
       decision is still yours.</p>`,

    derivation:
      `<p><b>Why $1.5\\cdot\\text{IQR}$, and why the IQR beats the z-score on skewed data.</b></p>
       <ul class="steps">
         <li>For a perfectly bell-shaped (normal) column, the quartiles sit about $0.674\\,s$ on each side of
         the mean, so $\\text{IQR}\\approx 1.35\\,s$. The upper fence $Q_3+1.5\\cdot\\text{IQR}$ then lands near
         $\\bar{x}+2.7\\,s$ &mdash; close to the z-score's "$3$ standard deviations" line. The two rules
         <b>agree on clean, symmetric data</b>; that is the design.</li>
         <li>Tukey chose the factor $1.5$ as a practical middle ground: large enough that genuine normal
         points almost never get flagged (roughly $0.7\\%$ do under a normal column), small enough to still
         catch real outliers. The wider fence $3.0\\cdot\\text{IQR}$ marks "far outliers".</li>
         <li>Now skew the column. The mean $\\bar{x}$ and the standard deviation $s$ are <b>sums</b> over
         every value, so a single huge point <b>inflates both</b> &mdash; it raises the mean toward itself and
         enlarges $s$, which shrinks its own z-score. The outlier <b>masks itself</b>: $|z|$ can stay under
         $3$ even though the point is plainly extreme.</li>
         <li>The quartiles are <b>ranks</b>. Move the largest point to a million and $Q_1$, $Q_3$ do not budge
         &mdash; the middle half of the data is unchanged. So the IQR fence stays put and still flags the
         point. This robustness is exactly why box plots use the IQR rule. $\\blacksquare$</li>
       </ul>`,

    example:
      `<p>Take ten daily order counts, one of them a sensor glitch:</p>
       <p>$x = \\{12,\\ 14,\\ 15,\\ 15,\\ 16,\\ 18,\\ 19,\\ 21,\\ 23,\\ 900\\}$.</p>
       <ul class="steps">
         <li><b>z-score.</b> Mean $\\bar{x}=105.3$, standard deviation $s\\approx 263$. The glitch's z-score is
         $(900-105.3)/263\\approx 3.0$ &mdash; right on the edge, and the inflated $s$ nearly <b>let it slip
         through</b>. Worse, the mean of $105$ is now larger than every normal day.</li>
         <li><b>IQR fence.</b> $Q_1=15$, $Q_3=21$, so $\\text{IQR}=6$. Upper fence $=21+1.5\\cdot 6=30$. The
         $900$ sits far past $30$ and is flagged cleanly; the quartiles never noticed it. The lower fence
         $15-9=6$ flags nothing.</li>
         <li><b>Decide.</b> Daily orders of $900$ when the rest are in the teens, with a known sensor glitch?
         This is an <b>impossible / error</b> value &mdash; a domain range check (orders should be, say,
         $\\le 100$) confirms it. <b>Fix or remove</b> it. Had this instead been a Black-Friday spike, it would
         be a <b>real extreme</b> to <b>keep</b>.</li>
       </ul>
       <p>Same flag, opposite action &mdash; the number detected the point, but the <i>meaning</i> decided its
       fate.</p>`,

    pitfalls:
      `<ul>
         <li><b>Deleting real extreme values &mdash; the signal!</b> The biggest mistake. In fraud, churn,
         demand spikes, and rare-disease data, the outlier <i>is</i> the thing you care about. Removing it
         "to clean the data" throws away the answer. Always classify error-vs-extreme before deleting.</li>
         <li><b>Blindly applying the z-score to skewed data.</b> On heavy-tailed columns (income, counts,
         durations) the mean and standard deviation are inflated by the tail, so $|z|\\gt 3$ either
         over-flags one side or lets the outlier mask itself. Use the <b>IQR fence</b> or the <b>robust z
         (median / MAD)</b> instead.</li>
         <li><b>A single global rule across mixed groups.</b> One fence for adults and children, or for ten
         different products, flags normal members of the smaller group as "outliers". Detect <b>within each
         group</b> where the groups have genuinely different scales.</li>
         <li><b>Capping that hides errors.</b> Winsorizing an impossible value (age $200 \\to$ cap at $90$)
         silently converts corruption into a plausible-looking number, so the bug never gets found.
         <b>Sanity-check against domain ranges first</b>: fix or drop true errors, and only cap genuine
         extremes.</li>
         <li><b>Fitting outlier handling on the full dataset &mdash; leakage.</b> Caps, fences, MAD, and
         Isolation-Forest models all have parameters learned from data. Fit them on the <b>training set
         only</b> and apply the saved limits to validation / test / production. Recomputing on the test set
         leaks information and inflates your scores.</li>
       </ul>`,

    practice: [
      {
        q: `A column of customer ages contains a value of <code>200</code> and another of <code>104</code>. Both are flagged by an IQR fence. Should they get the same treatment? Walk through the decision.`,
        steps: [
          { do: `Detect: both sit past the upper IQR fence, so both are candidates.`, why: `The fence only flags "far out" &mdash; it cannot tell error from extreme on its own.` },
          { do: `Apply a domain range check: a human age cannot exceed about 122 (the record).`, why: `200 is <b>impossible</b> &mdash; a data error (a typo or sentinel). 104 is rare but <b>physically real</b>.` },
          { do: `Fix or remove the 200 (treat as missing, or correct it); keep the 104.`, why: `Deleting the 104 would throw away a genuine elderly customer &mdash; possibly an important segment.` }
        ],
        answer: `<p><b>No</b> &mdash; same flag, different action. The <code>200</code> is an <b>impossible value</b> (above the human limit), so it is a <b>data error</b>: fix it or remove the row. The <code>104</code> is a <b>real extreme</b>: keep it. The IQR fence detects both; only the <b>domain range check</b> separates error from genuine extreme.</p>`
      },
      {
        q: `On a right-skewed income column, the plain z-score rule ($|z|\\gt 3$) flags almost nothing, even though there are obvious extreme earners. Why does it fail, and what detectors should you use instead?`,
        steps: [
          { do: `Note that the mean and standard deviation are sums over all values.`, why: `A few huge incomes pull the mean up and inflate $s$, so every z-score shrinks.` },
          { do: `Realize the outliers mask themselves: their own size enlarges $s$, dropping their $|z|$ below 3.`, why: `The rule assumes a symmetric bell shape; income is heavy-tailed, so the assumption breaks.` },
          { do: `Switch to the IQR fence or the robust z (median / MAD), which use ranks, not the mean.`, why: `Quartiles and the median are unmoved by a few extremes, so the fence stays put and flags them.` }
        ],
        answer: `<p>The z-score assumes a <b>symmetric</b> column. On skewed income, the extreme earners <b>inflate the mean and standard deviation</b>, shrinking every z-score &mdash; the outliers <b>mask themselves</b>. Use the <b>IQR (Inter-Quartile Range) fence</b> or the <b>robust z-score (median / MAD)</b>, both built on ranks, or first <b>log-transform</b> the column so it becomes roughly symmetric.</p>`
      },
      {
        q: `You have a genuine, verified extreme value (a real record-breaking transaction). You will train two models on this data: a gradient-boosted tree and a linear regression. How should you handle the point for each?`,
        steps: [
          { do: `Confirm it is a real extreme, not an error, via a domain check.`, why: `Verified-real means "do not delete" &mdash; it carries signal.` },
          { do: `For the tree model, leave it. Trees split on thresholds, so how far out the value is barely matters.`, why: `A split at "amount &gt; t" treats 10x and 100x the same; the magnitude does not distort the fit.` },
          { do: `For the linear model, cap/winsorize or log-transform so the point does not dominate the slope.`, why: `Linear / distance models square the residual, so one far point can swing the whole fit.` }
        ],
        answer: `<p>Because the point is <b>real</b>, never delete it. For the <b>tree</b>, <b>leave it</b> &mdash; trees split on thresholds and are nearly immune to how extreme a value is. For the <b>linear regression</b>, <b>cap / winsorize</b> it or <b>log-transform</b> the column, since linear and distance-based models square residuals and let one far point dominate. The handling choice depends on the <b>model</b>.</p>`
      }
    ]
  });

  window.CODE["dw-outliers"] = {
    lib: "pandas + scikit-learn",
    runnable: false,
    explain: `<p>An end-to-end outlier pass on a tabular dataset. We <b>detect</b> with three rules &mdash; the
       z-score, the IQR (Inter-Quartile Range) fence, and the robust z (median / MAD) &mdash; then add a
       <b>multivariate</b> detector (<code>scipy.stats</code> Mahalanobis distance and
       <code>IsolationForest</code>). We <b>sanity-check</b> flags against domain ranges to split errors from
       real extremes, and finish with a <b>winsorize / cap</b> example. Swap in your own DataFrame; here we use
       sklearn's bundled <code>load_breast_cancer</code> so it runs with no download.</p>`,
    code: `import numpy as np
import pandas as pd
from scipy import stats
from sklearn.ensemble import IsolationForest
from sklearn.datasets import load_breast_cancer

# Real bundled data; treat 'mean area' as a right-skewed, count-like column.
df = load_breast_cancer(as_frame=True).frame
col = 'mean area'
x = df[col]

# === 1. z-score rule: flag |z| > 3 ===
z = (x - x.mean()) / x.std(ddof=0)
df['z_outlier'] = z.abs() > 3

# === 2. IQR (Inter-Quartile Range) fence ===
q1, q3 = x.quantile(0.25), x.quantile(0.75)
iqr = q3 - q1
lo, hi = q1 - 1.5 * iqr, q3 + 1.5 * iqr     # the fence
df['iqr_outlier'] = (x < lo) | (x > hi)
print(f'IQR fence: [{lo:.0f}, {hi:.0f}] -> {df.iqr_outlier.sum()} flagged')

# === 3. Robust z-score (median / MAD) -- good for skewed columns ===
med = x.median()
mad = (x - med).abs().median()              # Median Absolute Deviation
robust_z = 0.6745 * (x - med) / mad         # 0.6745 makes it ~comparable to z
df['robust_outlier'] = robust_z.abs() > 3.5

# === 4. Multivariate: Mahalanobis distance over a few correlated columns ===
feats = ['mean area', 'mean perimeter', 'mean radius']
M = df[feats].values
center = M.mean(axis=0)
cov_inv = np.linalg.inv(np.cov(M, rowvar=False))
d2 = np.array([stats.mahalanobis(r, center, cov_inv) ** 2 for r in M])
# chi-square cutoff (df = #features) at the 0.999 level
df['maha_outlier'] = d2 > stats.chi2.ppf(0.999, df=len(feats))

# === 4b. Multivariate: IsolationForest (and LOF is a drop-in alternative) ===
iso = IsolationForest(contamination=0.02, random_state=0)
df['iso_outlier'] = iso.fit_predict(df[feats].values) == -1   # -1 == outlier
# from sklearn.neighbors import LocalOutlierFactor
# df['lof_outlier'] = LocalOutlierFactor(n_neighbors=20).fit_predict(df[feats]) == -1

# === DECIDE: sanity-check flags against a domain range ===
# A 'mean area' cannot be negative or absurdly huge -> those would be ERRORS.
IMPOSSIBLE = (x <= 0) | (x > 5000)          # domain rule, not a statistic
errors   = df[IMPOSSIBLE]                    # fix or DROP these
extremes = df[df.iqr_outlier & ~IMPOSSIBLE] # real extremes -> usually KEEP
print(f'{len(errors)} impossible (error) rows, {len(extremes)} real extremes')

# === HANDLE option: winsorize / cap real extremes to the IQR fence ===
df[col + '_capped'] = x.clip(lower=lo, upper=hi)
# trees: leave raw. linear / distance models: use the capped (or log) column.
df[col + '_log'] = np.log1p(x)              # transform alternative to capping`
  };

  window.CODEVIZ["dw-outliers"] = {
    question: "On a real right-skewed feature ('mean area' from load_breast_cancer), which points does the IQR (Inter-Quartile Range) fence flag as outliers?",
    charts: [
      {
        type: "scatter",
        title: "'mean area' sorted: IQR-fence outliers (red) sit past the upper fence at 1237",
        xlabel: "rank of cell (sorted low to high)",
        ylabel: "mean area",
        groups: [
          { name: "inlier (inside fence)", color: "#7ee787", points: [[1,179],[2,227],[3,241],[4,244],[5,269],[6,288],[7,322],[8,325],[9,367],[10,391],[11,396],[12,403],[13,413],[14,419],[15,428],[16,429],[17,441],[18,443],[19,448],[20,459],[21,465],[22,471],[23,499],[24,509],[25,524],[26,537],[27,538],[28,543],[29,546],[30,546],[31,552],[32,557],[33,578],[34,603],[35,606],[36,633],[37,652],[38,656],[39,659],[40,663],[41,671],[42,674],[43,717],[44,720],[45,737],[46,798],[47,805],[48,810],[49,880],[50,1075],[51,1092],[52,1123],[53,1138],[54,1174]] },
          { name: "IQR outlier (past fence)", color: "#ff7b72", points: [[55,1319],[56,1326],[57,1364],[58,1386],[59,1479],[60,1491]] }
        ],
        lines: [
          { name: "upper IQR fence = 1237", color: "#ffb454", dash: true, points: [[1,1237],[60,1237]] }
        ]
      }
    ],
    caption: "Real numbers from load_breast_cancer (60 cells subsampled, feature 'mean area', a right-skewed value). Quartiles: Q1=429, Q3=752, so IQR=323 and the upper fence Q3+1.5*IQR = 1237. Six points (red) sit above the dashed fence and are flagged; the 54 green points are inside. Note the plain z-score flags NONE of these (max |z| = 2.51 < 3) because the skewed tail inflates the standard deviation and masks them -- exactly why the IQR fence is preferred on skewed data. Whether to drop, cap, or keep the six is the next decision: a 'mean area' is physically possible, so these are real extremes, not errors.",
    code: `import numpy as np
from sklearn.datasets import load_breast_cancer

d = load_breast_cancer()
fi = list(d.feature_names).index('mean area')
area = d.data[:, fi]                                  # 569 real measurements

rng = np.random.RandomState(0)
area = np.sort(area[rng.choice(len(area), 60, replace=False)])   # subsample 60

# IQR (Inter-Quartile Range) fence
q1, q3 = np.percentile(area, [25, 75])
iqr = q3 - q1
hi = q3 + 1.5 * iqr
print(f'Q1={q1:.0f} Q3={q3:.0f} IQR={iqr:.0f} upper fence={hi:.0f}')
# -> Q1=429 Q3=752 IQR=323 upper fence=1237
out = area > hi
print('IQR outliers:', out.sum(), '->', np.round(area[out]).astype(int))
# -> 6 -> [1319 1326 1364 1386 1479 1491]

# z-score flags NONE of them -- the skewed tail inflates the std and masks them
z = (area - area.mean()) / area.std()
print('max |z| =', round(np.abs(z).max(), 2), '-> |z|>3 count:', (np.abs(z) > 3).sum())
# -> max |z| = 2.51 -> |z|>3 count: 0`
  };
})();
