/* Data Wrangling — "Univariate analysis: one variable at a time".
   Self-contained: lesson + CODE + CODEVIZ merged by id "dw-univariate". */
(function () {
  window.LESSONS.push({
    id: "dw-univariate",
    title: "Univariate analysis: look at one variable at a time",
    tagline: "Before you relate two columns, know what each single column looks like — its shape, its spread, and its balance.",
    module: "Data Wrangling",
    prereqs: ["dw-loading-inspecting", "met-distribution"],

    whenToUse:
      `<p><b>The first real analysis step after cleaning, and before anything bivariate or multivariate.</b>
       Once the data is loaded, typed, and tidy, you stop and look at each column <i>on its own</i> &mdash;
       one variable at a time &mdash; before you ever correlate two columns or fit a model.</p>
       <ul>
         <li><b>Right after the inspection battery.</b> Loading and inspecting told you each column's type,
         range, missingness, and cardinality. Univariate analysis goes one level deeper: it shows you the
         full <b>distribution</b> &mdash; the shape, not just the summary numbers.</li>
         <li><b>Before bivariate / multivariate work.</b> A scatter plot or a correlation only makes sense
         once you know whether each variable is skewed, multi-peaked, or full of outliers. Looking at pairs
         first, while still blind to the singles, hides what is really driving the relationship.</li>
         <li><b>On the target (label) especially.</b> Always plot the thing you are predicting. Its shape
         drives your whole plan: a lopsided class balance changes your <b>metric</b>; a skewed regression
         target suggests a transform. (A <b>univariate</b> analysis is one of a single variable; <b>bivariate</b>
         is of a pair; <b>multivariate</b> is of three or more at once.)</li>
       </ul>`,

    application:
      `<p>Univariate plots are the workhorse of every EDA (Exploratory Data Analysis) notebook.</p>
       <ul>
         <li><b>Numeric features.</b> A <b>histogram</b> or <b>KDE (Kernel Density Estimate, a smoothed
         curve of the distribution)</b> shows the shape; a <b>box plot</b> flags outliers and the spread;
         an <b>ECDF (Empirical Cumulative Distribution Function, the running fraction of points at or below
         each value)</b> reads off any percentile exactly.</li>
         <li><b>Categorical features.</b> <code>value_counts()</code> plus a <b>bar chart</b> shows which
         levels are common and which are rare &mdash; and whether any one level dominates.</li>
         <li><b>The target.</b> For classification, a bar of the class counts is your <b>class-balance</b>
         check. For regression, a histogram of the target shows skew and outliers, telling you whether to
         log-transform it before modeling.</li>
         <li><b>Deciding the next move.</b> What you see here picks your downstream steps: skew &rarr;
         transform, outliers &rarr; clip or investigate, imbalance &rarr; choose a robust metric and maybe
         resample.</li>
       </ul>`,

    pitfalls:
      `<ul>
         <li><b>Wrong histogram bin count.</b> Too <i>few</i> bins smear two peaks into one smooth blob and
         hide structure; too <i>many</i> bins turn the shape into spiky noise. The fix: try several bin
         counts (and a KDE), and never trust a single binning &mdash; the shape should be stable across a
         few sensible choices.</li>
         <li><b>Ignoring skew.</b> A long right tail (mean pulled above the median) is the single most common
         distribution you will meet &mdash; income, counts, durations. Skew breaks models that assume
         symmetry and is exactly the signal that you should apply a log or power transform. Spot it and act
         on it.</li>
         <li><b>Not checking class imbalance &mdash; the accuracy trap.</b> If 99% of rows are one class, a
         model that always predicts that class scores 99% accuracy while being useless. You only catch this
         by plotting the target's class balance first, then choosing a metric (precision/recall, F1, AUC)
         that survives imbalance.</li>
         <li><b>Trusting summary statistics alone.</b> Mean and standard deviation cannot see <b>modality</b>
         &mdash; a perfectly symmetric-looking mean can sit in the empty valley <i>between</i> two peaks
         (a bimodal distribution), where no actual data lives. Summary numbers also smooth over outliers.
         Always plot; do not just print <code>.describe()</code>.</li>
         <li><b>Reporting the mean for skewed data.</b> For a long-tailed variable the mean is dragged toward
         the tail and is <i>not</i> a typical value &mdash; report the <b>median</b> instead. "Average salary
         $90k" can mislead when the median is $55k.</li>
       </ul>`,

    bigIdea:
      `<p>Before you ask how two variables <i>relate</i>, you must know what each one <i>is</i>. Univariate
       analysis answers four questions about a single column's distribution:</p>
       <ul>
         <li><b>Shape</b> &mdash; symmetric, or skewed (a long tail to one side)?</li>
         <li><b>Modality</b> &mdash; one peak (unimodal), two peaks (bimodal), or more? Two peaks often means
         two hidden subgroups mixed together.</li>
         <li><b>Spread</b> &mdash; tight around the center, or wide? (range, standard deviation, IQR
         (Inter-Quartile Range, the width of the middle 50% of the data)).</li>
         <li><b>Outliers</b> &mdash; a few points far from the rest? Are they errors, or rare-but-real?</li>
       </ul>
       <p>For a <b>numeric</b> variable you read these off a histogram, a KDE, a box plot, or an ECDF. For a
       <b>categorical</b> variable the "distribution" is just the count of each level &mdash;
       <code>value_counts()</code> and a bar chart &mdash; and the key thing to read is whether the levels are
       balanced or whether one dominates.</p>
       <p>The most important single column is the <b>target</b> (the label you predict). Its distribution
       drives everything downstream: a 1:99 class split tells you accuracy is a trap and you need a different
       metric; a right-skewed regression target tells you to model <code>log(y)</code> instead of <code>y</code>.</p>`,

    buildup:
      `<p>There is a small toolkit, one tool per question. Run the matching ones for every column.</p>
       <p><b>For numeric variables, four views of one distribution:</b></p>
       <ol>
         <li><b>Histogram.</b> Bin the values and count how many fall in each bin. The bar heights trace the
         shape. The one knob is the <b>bin count</b> &mdash; vary it; the true shape is the part that stays
         put as you change it.</li>
         <li><b>KDE.</b> A smoothed version of the histogram &mdash; a continuous curve instead of bars. Good
         for seeing whether a bump is real or a binning artifact, and for overlaying several distributions.</li>
         <li><b>Box plot.</b> Draws the median, the quartiles (the box = the middle 50%), and the
         <b>whiskers</b> (usually 1.5&times;IQR); points beyond the whiskers are flagged as outliers. The
         fastest way to see spread and outliers at once.</li>
         <li><b>ECDF.</b> For each value, the fraction of data at or below it &mdash; a curve from 0 to 1.
         It needs no bins and lets you read any percentile straight off the y-axis.</li>
       </ol>
       <p><b>For categorical variables, one move:</b> <code>value_counts()</code> for the raw counts (or
       <code>value_counts(normalize=True)</code> for proportions), drawn as a <b>bar chart</b>. You are
       reading off which levels are common, which are rare (rare levels may need merging into an "other"
       bucket), and whether the split is balanced.</p>
       <p><b>For the target,</b> apply the matching tool: a class-balance <b>bar</b> for a classification
       label, a <b>histogram</b> for a regression target. This is not optional &mdash; it is the plot that
       picks your metric and your transforms.</p>`,

    whatItDoes:
      `<p>Each tool answers one of the four questions, and the trick is knowing which number to read off which
       plot. Walk a numeric column through them:</p>
       <ul>
         <li><b>Shape</b> &mdash; read it from the <b>histogram</b> or <b>KDE</b>: a long tail on one side is
         skew, two humps is bimodal. The one-number summary is the gap $\\bar{x}-\\tilde{x}$ (mean minus
         median): positive means a right tail, negative a left tail, near zero means symmetric.</li>
         <li><b>Spread</b> &mdash; read it from the <b>box</b> width, which is the $\\mathrm{IQR}=Q_3-Q_1$ (the
         range covering the middle 50% of points). A wide box means the values are scattered; a narrow box
         means they cluster tightly around the median $\\tilde{x}$.</li>
         <li><b>Outliers</b> &mdash; read them off the box plot's whiskers: any point beyond
         $Q_3+1.5\\cdot\\mathrm{IQR}$ (or below $Q_1-1.5\\cdot\\mathrm{IQR}$) is flagged. That $1.5\\times$ fence
         is just a convention for "suspiciously far from the middle 50%".</li>
         <li><b>Any percentile</b> &mdash; read it straight off the <b>ECDF</b>: find $0.5$ on the y-axis and
         the x-value beneath it is the median; $0.9$ gives the 90th percentile, and so on, with no bins to
         tune.</li>
       </ul>
       <p>For a <b>categorical</b> column there is no shape to read &mdash; the four numbers collapse to one
       table of counts (<code>value_counts()</code>), and the only question is balance: does one level dominate?
       For the <b>target</b>, that balance number is what picks your metric, which is why it is the single most
       important plot in the whole pass.</p>`,

    symbols: [
      { sym: "$\\bar{x}$", desc: "the mean (arithmetic average) of a numeric variable — pulled toward the long tail when the data is skewed." },
      { sym: "$\\tilde{x}$", desc: "the median — the middle value; robust to skew and outliers, so it is the honest 'typical value' for long-tailed data." },
      { sym: "$\\mathrm{IQR}=Q_3-Q_1$", desc: "the Inter-Quartile Range — the width of the middle 50% of the data, used as the box-plot box and to flag outliers." },
      { sym: "$g_1$", desc: "skewness — a single number for the shape's lopsidedness: $g_1\\gt 0$ means a long right tail, $g_1\\lt 0$ a long left tail, $g_1\\approx 0$ roughly symmetric." }
    ],

    derivation:
      `<p><b>Why the mean lies on skewed data, and the median does not.</b></p>
       <ul class="steps">
         <li>The mean $\\bar{x}=\\frac{1}{n}\\sum_i x_i$ is a balance point: every value pulls on it in
         proportion to <i>how far</i> it sits from the center. A few very large values in a long right tail
         therefore drag $\\bar{x}$ upward, away from where most of the data actually is.</li>
         <li>The median $\\tilde{x}$ is the middle value by rank: it cares only about <i>order</i>, not
         distance. Stretching the tail to infinity does not move it, because the same number of points still
         sit above and below. So $\\tilde{x}$ stays put near the bulk of the data.</li>
         <li>Hence for a right-skewed variable $\\bar{x}\\gt\\tilde{x}$, and the gap between them is itself a
         skew signal. Reporting $\\bar{x}$ as "typical" overstates it; report $\\tilde{x}$ instead.</li>
         <li>The cure for the model (not just the report) is a transform. Taking $\\log x$ compresses large
         values much more than small ones, pulling the tail in and making the distribution roughly symmetric
         &mdash; which is why a skewed target is usually modeled as $\\log y$. $\\blacksquare$</li>
       </ul>`,

    example:
      `<p>Take a tiny <code>session_length</code> column (minutes) with $n=9$ rows, sorted:
       $\\{2,\\ 4,\\ 5,\\ 7,\\ 8,\\ 9,\\ 11,\\ 14,\\ 200\\}$ &mdash; eight ordinary sessions and one marathon
       outlier. Compute each summary statistic from the lesson on these real numbers.</p>
       <ul class="steps">
         <li><b>Mean</b> $\\bar{x}=\\frac{1}{n}\\sum_i x_i=\\frac{2+4+5+7+8+9+11+14+200}{9}=\\frac{260}{9}=28.9$.</li>
         <li><b>Median</b> $\\tilde{x}=$ the middle (5th of 9) value $=8$. The one 200 cannot move it &mdash; rank, not distance.</li>
         <li><b>Mean vs median:</b> $\\bar{x}=28.9\\gt\\tilde{x}=8$, so $\\bar{x}\\gt\\tilde{x}$ &mdash; the signature of a <b>right skew</b>. Reporting "average session = 28.9 min" overstates the typical user; the honest figure is the median, 8.</li>
         <li><b>Quartiles &amp; IQR:</b> with 9 points, $Q_1$ = median of the lower four $\\{2,4,5,7\\}=\\frac{4+5}{2}=4.5$; $Q_3$ = median of the upper four $\\{9,11,14,200\\}=\\frac{11+14}{2}=12.5$. So $\\mathrm{IQR}=Q_3-Q_1=12.5-4.5=8.0$.</li>
         <li><b>Outlier rule:</b> the box-plot upper fence is $Q_3+1.5\\cdot\\mathrm{IQR}=12.5+1.5\\cdot 8.0=12.5+12=24.5$. The value $200\\gt 24.5$, so 200 is flagged as an outlier &mdash; investigate (power user? logging bug?).</li>
         <li><b>Skewness sign:</b> the long tail is on the right, so $g_1\\gt 0$ &mdash; positive skew confirmed.</li>
         <li><b>Decision:</b> right skew + outlier &rarr; model <code>log(session_length)</code>, and report the median (8), not the mean (28.9).</li>
       </ul>
       <p>Now the <b>target</b>. Predicting <code>churned</code> on 1000 rows, the class-balance counts are:</p>
       <table class="extable">
         <caption>Target class balance (1000 rows) &mdash; share decides the metric</caption>
         <thead><tr><th>class</th><th class="num">count</th><th class="num">share</th></tr></thead>
         <tbody>
           <tr><td class="row-h">no</td><td class="num">970</td><td class="num">97.0%</td></tr>
           <tr><td class="row-h">yes</td><td class="num">30</td><td class="num">3.0%</td></tr>
           <tr><td class="row-h">total</td><td class="num">1000</td><td class="num">100%</td></tr>
         </tbody>
       </table>
       <p>An always-"no" model already scores $970/1000=97\\%$ accuracy while catching zero churners, so accuracy
       is a trap here. Switch to recall / F1 and consider resampling &mdash; all decided <i>before</i> any modeling.</p>`,

    practice: [
      {
        q: `You plot a histogram of a <code>price</code> column with 5 bins and it looks like one smooth hill. A colleague plots the same data with 40 bins and clearly sees TWO separate peaks. Who is right, and what is the lesson?`,
        steps: [
          { do: `Recognize that bin count is a tunable knob, and too few bins can merge two peaks into one.`, why: `5 wide bins average over the valley between the peaks, smearing a bimodal shape into one blob.` },
          { do: `Check whether the two peaks persist across several bin counts (and a KDE).`, why: `Real structure is stable across sensible binnings; a binning artifact appears or vanishes as you change the count.` },
          { do: `If two peaks are stable, treat the variable as <b>bimodal</b> — likely two hidden subgroups mixed together.`, why: `Two peaks often mean two populations (e.g. two product tiers), which matters for both analysis and modeling.` }
        ],
        answer: `<p>The colleague is closer to the truth: <b>5 bins were too coarse</b> and hid a real bimodal
        structure. The lesson is never to trust a single bin count &mdash; vary it (and add a KDE). The shape
        that stays put across several sensible binnings is the real one. Two stable peaks usually mean two
        hidden subgroups, which changes how you model the variable.</p>`
      },
      {
        q: `A teammate trains a fraud classifier, reports <b>99.2% accuracy</b>, and calls it done. You ask to see the target's class balance first. Why, and what likely went wrong?`,
        steps: [
          { do: `Plot the target with <code>value_counts(normalize=True)</code> / a class-balance bar.`, why: `Fraud is rare, so the label is almost certainly heavily imbalanced — say 99% legit, 1% fraud.` },
          { do: `Compare the 99.2% accuracy to the majority-class rate (~99%).`, why: `A model that predicts "legit" for everyone already scores ~99% — beating it by 0.2% is essentially no skill at all.` },
          { do: `Switch to imbalance-robust metrics: precision, recall, F1, or AUC, and look at the confusion matrix.`, why: `These measure whether the rare fraud class is actually being caught, which accuracy completely hides.` }
        ],
        answer: `<p>Because the target is almost surely <b>severely imbalanced</b> (fraud is rare), and on
        imbalanced data <b>accuracy is a trap</b>: always predicting the majority class already scores ~99%,
        so 99.2% may mean the model catches almost no fraud. Checking the class balance first reveals this;
        the fix is to judge the model with recall / precision / F1 / AUC and the confusion matrix, not
        accuracy.</p>`
      },
      {
        q: `For a numeric column you print <code>.describe()</code>: mean 52, median 31, max 4100. You report "average value about 52". What does the mean–median gap tell you, and how should you change the report and the modeling?`,
        steps: [
          { do: `Compare mean (52) to median (31): the mean is well above the median.`, why: `Mean above median is the signature of a long right tail — the data is right-skewed.` },
          { do: `Note the huge max (4100) relative to the median.`, why: `A few very large values are dragging the mean up; the mean is not a typical value here.` },
          { do: `Report the median, and consider a log transform before modeling.`, why: `The median (31) is the honest typical value; a log transform pulls in the tail so models that assume symmetry behave.` }
        ],
        answer: `<p>Mean (52) far above median (31), with a max of 4100, says the variable is <b>strongly
        right-skewed</b> &mdash; a few large values drag the mean up, so 52 is <i>not</i> a typical value.
        Report the <b>median (31)</b> as the typical figure, and for modeling apply a <b>log/power
        transform</b> to pull in the tail. This is exactly why you plot and compare mean vs median instead of
        quoting the mean blindly.</p>`
      }
    ]
  });

  window.CODE["dw-univariate"] = {
    lib: "pandas + matplotlib + seaborn",
    runnable: false,
    explain: `<p>A complete univariate pass over a real dataset &mdash; sklearn's bundled <b>wine</b> set
      (<code>load_wine</code>), 178 rows, 13 numeric features and a 3-class target. We profile a numeric
      feature four ways (histogram, KDE, box plot, ECDF), summarize a categorical-style column with
      <code>value_counts(normalize=True)</code> and a bar chart, and &mdash; most importantly &mdash; run a
      <b>class-balance check on the target</b>, the plot that decides your metric. Everything loads from
      scikit-learn, so it runs as written.</p>`,
    code: `import pandas as pd
import matplotlib.pyplot as plt
import seaborn as sns
from sklearn.datasets import load_wine

# --- Real bundled dataset: 178 wines, 13 numeric features + a 3-class target ---
d = load_wine(as_frame=True)
df = d.frame
print(df.shape)                      # -> (178, 14)

# =====================================================================
# 1) NUMERIC variable: look at ONE column four different ways.
#    'color_intensity' is right-skewed — a good column to study.
# =====================================================================
col = "color_intensity"
s = df[col]

# Summary stats first — but NEVER trust these alone; always plot too.
print(s.describe())
print("mean:", round(s.mean(), 2), " median:", round(s.median(), 2),
      " skew:", round(s.skew(), 2))   # mean > median, skew > 0  => right tail

fig, ax = plt.subplots(2, 2, figsize=(10, 7))

# (a) Histogram — vary the bin count; the real shape is stable across choices.
ax[0, 0].hist(s, bins=8, color="#79c0ff", edgecolor="white")
ax[0, 0].set_title("Histogram (8 bins) — right-skewed")

# (b) KDE — a smoothed density curve; good for spotting modality.
sns.kdeplot(s, ax=ax[0, 1], fill=True, color="#79c0ff")
ax[0, 1].set_title("KDE (smoothed distribution)")

# (c) Box plot — median, quartiles, and outliers beyond the whiskers.
ax[1, 0].boxplot(s, vert=False)
ax[1, 0].set_title("Box plot — spread + outliers")

# (d) ECDF — fraction of data at or below each value; read any percentile off it.
sns.ecdfplot(s, ax=ax[1, 1], color="#79c0ff")
ax[1, 1].set_title("ECDF — read percentiles directly")
plt.tight_layout(); plt.show()

# =====================================================================
# 2) CATEGORICAL summary: value_counts(normalize=True) + bar chart.
#    (We bucket a numeric column into bands to demo the categorical move;
#     for a real categorical column you would skip the cut.)
# =====================================================================
bands = pd.cut(df["alcohol"], bins=[0, 12, 13, 14, 99],
               labels=["<12", "12-13", "13-14", "14+"])
prop = bands.value_counts(normalize=True).sort_index()   # proportions, not raw counts
print(prop.round(3))
prop.plot.bar(color="#7ee787"); plt.title("alcohol band share"); plt.show()

# =====================================================================
# 3) THE TARGET: class-balance check (the plot that drives your metric).
#    For a CLASSIFICATION label, look at the share of each class.
# =====================================================================
target_share = df["target"].value_counts(normalize=True).sort_index()
print((target_share * 100).round(1))      # class_0 33%, class_1 40%, class_2 27%
df["target"].value_counts().sort_index().plot.bar(color="#ffa657")
plt.title("Target class balance — is any class rare?"); plt.xlabel("class"); plt.show()
# Read it: classes are fairly balanced here (~27-40%), so accuracy is a fair
# metric. If one class were <5%, accuracy would be a trap and you'd switch to
# recall / F1 / AUC. For a REGRESSION target, you'd histogram it and check skew.`
  };

  window.CODEVIZ["dw-univariate"] = {
    question: "Same plot type, four different stories: how do you read SHAPE off a histogram (skewed? bimodal?) and BALANCE off a target bar (fair? a trap?)?",
    charts: [
      {
        type: "bars",
        title: "Real load_wine 'color_intensity': histogram (8 bins) — right-skewed",
        xlabel: "color_intensity range",
        ylabel: "count of wines",
        labels: ["1.3-2.7", "2.7-4.2", "4.2-5.7", "5.7-7.1", "7.1-8.6", "8.6-10.1", "10.1-11.5", "11.5-13.0"],
        values: [28, 45, 47, 25, 16, 10, 5, 2],
        valueLabels: ["28", "45", "47", "25", "16", "10", "5", "2"],
        colors: ["#4ea1ff", "#4ea1ff", "#4ea1ff", "#4ea1ff", "#4ea1ff", "#4ea1ff", "#4ea1ff", "#4ea1ff"],
        interpret: "x-axis = value bins of the feature, bar height = how many wines fall in each bin. The bars <b>pile up on the left and trail off to the right</b> — the textbook right skew. Real numbers: mean 5.06 sits above median 4.69 and skewness is +0.87 (positive = long right tail). The read: report the median, not the mean, and consider a log transform before modeling."
      },
      {
        type: "bars",
        title: "Variant — bimodal: two separate peaks (two hidden subgroups)",
        xlabel: "value bin",
        ylabel: "count",
        labels: ["b1", "b2", "b3", "b4", "b5", "b6", "b7", "b8"],
        values: [8, 30, 42, 18, 16, 40, 33, 9],
        valueLabels: ["8", "30", "42", "18", "16", "40", "33", "9"],
        colors: ["#c89bff", "#c89bff", "#c89bff", "#c89bff", "#c89bff", "#c89bff", "#c89bff", "#c89bff"],
        interpret: "Illustrative. <b>Two humps</b> with a valley between them, not one hill. The mean lands in the empty valley where almost no data lives, so summary stats lie here. Two peaks usually mean two subgroups mixed together (e.g. two product tiers). Watch out: too few bins would smear these into one blob — vary the bin count and confirm the peaks are stable before trusting them."
      },
      {
        type: "bars",
        title: "Target class balance — fairly balanced, accuracy is fair",
        xlabel: "target class",
        ylabel: "count of wines",
        labels: ["class_0", "class_1", "class_2"],
        values: [59, 71, 48],
        valueLabels: ["59 (33%)", "71 (40%)", "48 (27%)"],
        colors: ["#7ee787", "#7ee787", "#7ee787"],
        interpret: "Real load_wine target: bar height = number of wines per class. The three classes are <b>roughly equal</b> (33% / 40% / 27%), so no class is rare — plain accuracy is a fair metric here. This is the plot you run on the label before modeling; a balanced target like this one means you can keep accuracy and move on."
      },
      {
        type: "bars",
        title: "Variant — imbalanced target: majority-class trap (accuracy lies)",
        xlabel: "target class",
        ylabel: "count of rows",
        labels: ["legit", "fraud"],
        values: [9900, 100],
        valueLabels: ["9900 (99%)", "100 (1%)"],
        colors: ["#9aa7b4", "#ff7b72"],
        interpret: "Illustrative (a fraud label). One class (grey, 99%) <b>dwarfs</b> the other (red, 1%). Here accuracy is a trap: a model that always predicts 'legit' already scores 99% while catching zero fraud. Spotting this sliver class first is the whole point of the plot — the fix is to judge the model with recall / precision / F1 / AUC and the confusion matrix, not accuracy."
      }
    ],
    caption: "Two diagnostics, two variants each. Histograms read SHAPE: chart 1 is real load_wine 'color_intensity' (right-skewed, mean>median, skew +0.87 → log-transform, report median); chart 2 is a bimodal variant (two peaks = two subgroups, mean lands in the empty valley). Target bars read BALANCE: chart 3 is the real balanced wine target (accuracy is fair); chart 4 is an imbalanced 99/1 variant (the majority-class trap → switch to recall/F1/AUC). Every one of these reads is made before any model is fit.",
    code: `import numpy as np
from sklearn.datasets import load_wine

d = load_wine(as_frame=True)
df = d.frame
print("shape:", df.shape)                 # -> (178, 14)

# --- LEFT chart: histogram (shape) of one numeric feature -------------
s = df["color_intensity"]
counts, edges = np.histogram(s, bins=8)
print("hist counts:", counts.tolist())    # -> [28, 45, 47, 25, 16, 10, 5, 2]
print("bin edges:", [round(e, 2) for e in edges])
print("mean:", round(s.mean(), 2),         # -> 5.06
      "median:", round(s.median(), 2),     # -> 4.69  (mean > median: right-skew)
      "skew:", round(s.skew(), 2))         # -> 0.87  (> 0: long right tail)

# --- RIGHT chart: class balance of the target -------------------------
counts = df["target"].value_counts().sort_index()
print("class counts:", counts.tolist())            # -> [59, 71, 48]
print("class share %:",
      (df["target"].value_counts(normalize=True).sort_index() * 100).round(1).tolist())
# -> [33.1, 39.9, 27.0]  -> fairly balanced, so accuracy is a fair metric here.`
  };
})();
