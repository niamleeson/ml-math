/* Data Wrangling — "Summary statistics: the numbers that describe a distribution".
   Self-contained: lesson + CODE + CODEVIZ merged by id "dw-summary-stats". */
(function () {
  window.LESSONS.push({
    id: "dw-summary-stats",
    title: "Summary statistics: center, spread, shape, position",
    tagline: "A few numbers that stand in for a whole column — and which ones to trust when the data is skewed.",
    module: "Data Wrangling",
    prereqs: ["dw-data-types", "met-distribution"],

    whenToUse:
      `<p>Reach for summary statistics the moment you want to <b>characterize a single numeric column</b> —
       right after the dtypes are clean and before you plot, compare groups, or build features. One call,
       <code>df.describe()</code>, hands you a compact picture: where the values sit, how spread out they
       are, and where the extremes are.</p>
       <p>The real skill is not computing them — pandas does that — but <b>choosing which ones to report</b>.
       Every column gets summarized in four ways:</p>
       <ul>
         <li><b>Center</b> — one typical value: the <b>mean</b> (the average), the <b>median</b> (the middle
         value), or the <b>mode</b> (the most common value).</li>
         <li><b>Spread</b> — how wide the values range: the <b>range</b>, the <b>variance</b>, the <b>standard
         deviation</b> (often "std"), the <b>IQR (Inter-Quartile Range)</b>, and the <b>MAD (Median Absolute
         Deviation)</b>.</li>
         <li><b>Shape</b> — how the distribution leans and how heavy its tails are: <b>skewness</b> and
         <b>kurtosis</b>.</li>
         <li><b>Position</b> — specific cut points: <b>quantiles / percentiles</b> and the
         <b>five-number summary</b> (minimum, lower quartile, median, upper quartile, maximum).</li>
       </ul>
       <p>The decision that matters most: <b>robust</b> summaries (median, IQR, MAD) when the data is skewed
       or has outliers, versus <b>classical</b> ones (mean, std) when it is roughly symmetric and clean.</p>`,

    application:
      `<p>Summary statistics are the first paragraph of every data report.</p>
       <ul>
         <li><b>The describe() reflex.</b> Analysts run <code>df.describe()</code> on a fresh frame to read
         count, mean, std, min, the three quartiles, and max for every numeric column at a glance — a quick
         sanity check and a sniff test for bad values.</li>
         <li><b>Reporting "the typical user".</b> Income, session length, basket size, and time-on-page are
         almost always right-skewed, so the <b>median</b> ("half of users spent under \\$40") is the honest
         headline and the <b>mean</b> is misleadingly high.</li>
         <li><b>Outlier-robust monitoring.</b> Dashboards track the median and IQR of latency or spend so a
         single freak value does not jerk the line around the way a mean would.</li>
         <li><b>Effect sizes and standardization.</b> The mean and std feed z-scores, standardized features,
         and effect-size measures; the median and IQR feed robust scaling.</li>
       </ul>`,

    pitfalls:
      `<ul>
         <li><b>Reporting the mean for skewed or outlier-laden data.</b> One billionaire in a room of clerks
         drags the <b>mean</b> income to a number nobody actually earns; the <b>median</b> barely moves. For
         skewed columns (income, counts, durations) the median is the honest center. Always check the skew
         before you quote a mean.</li>
         <li><b>Confusing std with IQR.</b> The <b>standard deviation</b> measures spread around the
         <i>mean</i> and is inflated by the same outliers that inflate the mean; the <b>IQR</b> is the spread
         of the middle 50% and ignores the tails. They answer different questions — quote the IQR alongside
         the median, and the std alongside the mean, never mismatched.</li>
         <li><b>Comparing means across very different distributions.</b> Two columns can share a mean while one
         is tight and symmetric and the other is bimodal or heavy-tailed. A mean alone hides this; always pair
         center with spread <i>and</i> shape before you compare.</li>
         <li><b>Ignoring shape entirely.</b> Skewness and kurtosis tell you whether the mean/std picture is
         even trustworthy. High <b>skewness</b> says "the mean lies"; high <b>kurtosis</b> says "expect fat-tail
         outliers". Skipping them means you do not know which summary to believe.</li>
         <li><b>Simpson-style aggregation hiding subgroups.</b> A single overall summary can reverse or erase
         a pattern that is clear within each subgroup (a treatment that helps every age group can look harmful
         in the pooled mean). When groups differ, summarize <i>per group</i>, not just overall.</li>
       </ul>`,

    bigIdea:
      `<p>A column can have thousands of values, but a person can only hold a few numbers in their head. A
       <b>summary statistic</b> is a single number that stands in for the whole column along one axis. The
       craft is knowing which axis you are summarizing and which statistic tells the truth for <i>this</i>
       column's shape.</p>
       <p>There are four axes:</p>
       <ul>
         <li><b>Center</b> — "what is a typical value?" The <b>mean</b> balances the values like a seesaw;
         the <b>median</b> splits them into a lower and an upper half; the <b>mode</b> is the value that
         appears most.</li>
         <li><b>Spread</b> — "how much do values vary?" The <b>variance</b> and its square root the <b>std</b>
         average the squared distance from the mean; the <b>IQR</b> is the width of the middle half; the
         <b>MAD</b> is the typical distance from the median.</li>
         <li><b>Shape</b> — "is it lopsided, and are its tails heavy?" <b>Skewness</b> measures the lean,
         <b>kurtosis</b> the tail weight.</li>
         <li><b>Position</b> — "what value sits at the 90th percentile?" <b>Quantiles</b> answer that, and the
         <b>five-number summary</b> (min, $Q_1$, median, $Q_3$, max) is the skeleton of a box plot.</li>
       </ul>
       <p>Cutting across all four is one distinction. <b>Robust</b> statistics (median, IQR, MAD) are built
       from ranks and middles, so a few extreme values barely move them. <b>Non-robust</b> statistics (mean,
       std) sum every value, so a single outlier can drag them anywhere. On clean, symmetric data the two
       agree; on skewed or dirty data they diverge — and the gap between them is itself a diagnostic.</p>`,

    buildup:
      `<p>Build the four axes from the raw values $x_1,\\dots,x_n$.</p>
       <p><b>Center.</b> The <b>mean</b> adds everything and divides by the count,
       $\\bar{x}=\\frac{1}{n}\\sum_i x_i$. The <b>median</b> is the middle value after sorting (the average
       of the two middles if $n$ is even). The <b>mode</b> is whichever value occurs most often. The mean
       uses the actual magnitudes, so it feels every outlier; the median uses only the ordering, so it does
       not.</p>
       <p><b>Spread.</b> The <b>variance</b> averages squared distances from the mean,
       $s^2=\\frac{1}{n-1}\\sum_i (x_i-\\bar{x})^2$, and the <b>std</b> is its square root $s$ (back in the
       original units). Squaring means a single far-off point dominates the sum — that is why std is not
       robust. The <b>IQR</b> is $Q_3-Q_1$, the gap between the 75th and 25th percentiles: the width of the
       middle 50%, blind to the tails. The <b>MAD</b> is the median of the absolute distances from the
       median, $\\text{median}_i\\,|x_i-\\text{median}(x)|$ — a fully robust analogue of the std.</p>
       <p><b>Shape.</b> <b>Skewness</b> is the average <i>cubed</i> standardized distance; the cube keeps the
       sign, so a long right tail gives positive skew and a long left tail gives negative skew. <b>Kurtosis</b>
       is the average <i>fourth-power</i> standardized distance, measuring how much of the variance comes from
       rare extreme values (heavy tails). Both are dimensionless.</p>
       <p><b>Position.</b> The <b>$\\alpha$-quantile</b> $q_\\alpha$ is the value below which a fraction
       $\\alpha$ of the data falls; a <b>percentile</b> is the same idea on a 0&ndash;100 scale. The
       quartiles are $Q_1=q_{0.25}$, $Q_2=q_{0.5}$ (the median), $Q_3=q_{0.75}$. Stack the min, the three
       quartiles, and the max and you have the <b>five-number summary</b>.</p>`,

    symbols: [
      { sym: "$x_i$", desc: "the $i$-th value in the column; there are $n$ of them." },
      { sym: "$\\bar{x}$", desc: "the mean (average): $\\frac{1}{n}\\sum_i x_i$. Non-robust — every value pulls on it." },
      { sym: "$\\text{median}(x)$", desc: "the middle value after sorting. Robust — only the ordering matters." },
      { sym: "$s^2,\\ s$", desc: "the (sample) variance and its square root the standard deviation (std). Spread around the mean; non-robust." },
      { sym: "$Q_1,Q_2,Q_3$", desc: "the lower quartile, median, and upper quartile — the 25th, 50th, and 75th percentiles." },
      { sym: "$\\text{IQR}$", desc: "the Inter-Quartile Range $Q_3-Q_1$: the width of the middle 50%. Robust." },
      { sym: "$\\text{MAD}$", desc: "the Median Absolute Deviation: $\\text{median}_i\\,|x_i-\\text{median}(x)|$. A robust analogue of the std." },
      { sym: "$q_\\alpha$", desc: "the $\\alpha$-quantile: the value below which a fraction $\\alpha$ of the data falls ($q_{0.5}$ is the median)." }
    ],

    formula:
      `$$ \\bar{x}=\\frac{1}{n}\\sum_{i=1}^{n} x_i,\\qquad
         s=\\sqrt{\\frac{1}{n-1}\\sum_{i=1}^{n}(x_i-\\bar{x})^2},\\qquad
         \\text{IQR}=Q_3-Q_1 $$
       $$ \\text{MAD}=\\operatorname*{median}_{i}\\,\\bigl|x_i-\\operatorname{median}(x)\\bigr|,\\qquad
         \\text{skew}=\\frac{1}{n}\\sum_{i=1}^{n}\\!\\left(\\frac{x_i-\\bar{x}}{s}\\right)^{3} $$`,

    whatItDoes:
      `<p>The <b>mean</b> $\\bar{x}$ is the balance point; the <b>std</b> $s$ is the typical distance from it
       (in the original units). Both square or sum every value, so a single huge $x_i$ moves them a lot — they
       are <b>non-robust</b>.</p>
       <p>The <b>IQR</b> is the width of the central half of the data and the <b>MAD</b> is the typical
       distance from the median. Both are built from middles, so the tails cannot move them — they are
       <b>robust</b> stand-ins for std.</p>
       <p><b>Skewness</b> reads the lean: positive means a long right tail (and $\\bar{x}\\gt\\text{median}$),
       negative means a long left tail. The cube preserves sign and amplifies far-out points, so skewness is
       exactly the quantity that warns you the mean is about to lie.</p>`,

    derivation:
      `<p><b>Why one outlier moves the mean but not the median.</b></p>
       <ul class="steps">
         <li>Take ten tight values, all near 12: their mean and median are both about 12.</li>
         <li>Append one outlier of 1000. The mean is $\\frac{1}{n}\\sum_i x_i$, so adding 1000 raises the sum
         by 1000 and the mean by $1000/n$ — with $n=11$ the mean jumps from about 12 to about <b>102</b>.
         Every value shares in the pull, but the lone giant dominates the sum.</li>
         <li>The median is the middle value after sorting. Adding one point on the far right shifts the middle
         by at most one position, so the median stays at <b>12</b>. Rank-based statistics only care
         <i>whether</i> a value is large, not <i>how</i> large.</li>
         <li>The same logic separates std from IQR and MAD. The std squares $(x_i-\\bar{x})$, so the outlier's
         distance is squared and dominates — std inflates. The IQR ($Q_3-Q_1$) and the MAD are read from the
         middle of the sorted data, so a far-out tail point never enters the calculation.</li>
         <li><b>Skew connects center to spread.</b> For a right-skewed column the long upper tail pulls the
         mean above the median, so $\\bar{x}\\gt\\text{median}$ and skewness is positive. That single
         inequality is your cue to switch from (mean, std) to (median, IQR). The CODEVIZ below shows it on a
         real right-skewed feature. $\\blacksquare$</li>
       </ul>`,

    example:
      `<p>Ten clean readings of a sensor, all clustered near 12:</p>
       <p>$x = \\{10,\\,12,\\,11,\\,13,\\,12,\\,10,\\,14,\\,11,\\,12,\\,13\\}$.</p>
       <ul class="steps">
         <li><b>Center.</b> The mean is $11.8$ and the median is $12$ — they agree, because the data is
         symmetric and clean.</li>
         <li><b>Spread.</b> The std is about $1.3$ and the IQR is $2$ — both small, both telling the same
         story of a tight cluster.</li>
         <li><b>Now corrupt it.</b> One sensor glitches and records $1000$. The mean leaps to about $101.6$,
         and the std balloons past $300$. But the median is still $12$ and the IQR is still about $2$ — the
         <b>robust</b> summaries shrugged off the glitch.</li>
         <li><b>The gap is the alarm.</b> Mean $101.6$ versus median $12$ is a screaming signal that an
         outlier (or heavy skew) is present. Report the median and IQR here; quoting the mean would invent a
         "typical reading" of 102 that no real sensor ever produced.</li>
       </ul>`,

    practice: [
      {
        q: `Your <code>df.describe()</code> for a <code>session_minutes</code> column shows mean 42, std 95, min 0, 25% 3, 50% 9, 75% 31, max 1440. A teammate writes "users spend about 42 minutes per session." What is wrong, and what should the report say?`,
        steps: [
          { do: `Compare the mean (42) to the median (the 50% row, 9).`, why: `The mean is more than four times the median, the signature of a strong right skew or outliers.` },
          { do: `Look at the std (95) versus the IQR ($Q_3-Q_1 = 31-3 = 28$) and the max (1440).`, why: `The std is larger than the IQR and the max dwarfs $Q_3$ — a few enormous sessions are inflating the mean and the std together.` },
          { do: `Report the median and IQR instead: "half of sessions are under 9 minutes; the middle 50% span 3 to 31 minutes."`, why: `Robust summaries describe the typical user honestly; the mean describes a user pulled up by rare marathon sessions.` }
        ],
        answer: `<p>The column is heavily right-skewed (mean 42 versus median 9, max 1440), so the <b>mean overstates</b> the typical session. Report the <b>median</b> (9 minutes) and the <b>IQR (Inter-Quartile Range)</b> of $31-3 = 28$ minutes (the middle 50% from 3 to 31). The std of 95 is inflated by the same long tail and should not be paired with this skewed mean.</p>`
      },
      {
        q: `You add a single fat-fingered data-entry error of 9999 to a clean column of prices that range 5 to 80. Which of mean, median, std, IQR, and MAD change a lot, and which barely move? Why?`,
        steps: [
          { do: `Classify each statistic as robust or non-robust.`, why: `Mean and std sum/square every value (non-robust); median, IQR, and MAD are built from middles and ranks (robust).` },
          { do: `Trace the outlier through the mean and std.`, why: `The mean rises by $9999/n$ and the std, which squares the huge distance $(9999-\\bar{x})$, explodes — both move a lot.` },
          { do: `Trace it through the median, IQR, and MAD.`, why: `One point added on the far right shifts the middle of the sorted data by at most one position, so the median, the quartiles ($Q_1,Q_3$), and the MAD barely budge.` }
        ],
        answer: `<p>The <b>mean</b> and <b>std</b> change a lot — the mean climbs by $9999/n$ and the std blows up because it squares the outlier's distance. The <b>median</b>, <b>IQR</b>, and <b>MAD (Median Absolute Deviation)</b> barely move, because they are computed from ranks and the middle of the data, where one far-out point has no leverage. This is exactly why you reach for the robust trio on dirty data.</p>`
      },
      {
        q: `Two columns, A and B, both have mean 50 and std 10. Can you conclude they have the same distribution? What two summaries would you add to tell them apart?`,
        steps: [
          { do: `Recall that mean and std fix only the center and the spread, not the shape.`, why: `Many different distributions share a mean and a std — symmetric, skewed, bimodal, heavy-tailed.` },
          { do: `Add skewness to each column.`, why: `Skewness reveals whether one column leans (a long tail on one side) while the other is symmetric.` },
          { do: `Add kurtosis (and ideally the five-number summary or a box plot).`, why: `Kurtosis reveals heavy tails / outlier-proneness; the five-number summary shows where the mass actually sits.` }
        ],
        answer: `<p>No — a shared mean and std fix only <b>center</b> and <b>spread</b>, not <b>shape</b>. One column could be symmetric and the other strongly skewed or bimodal. Add <b>skewness</b> (the lean) and <b>kurtosis</b> (the tail weight), and ideally the <b>five-number summary</b> or a box plot, before declaring the two columns alike.</p>`
      }
    ]
  });

  window.CODE["dw-summary-stats"] = {
    lib: "pandas + scipy",
    runnable: false,
    explain: `<p>The end-to-end summary workflow on a real bundled dataset (scikit-learn's breast-cancer set, whose <code>mean area</code> feature is strongly right-skewed). We read <code>df.describe()</code>, pull the robust statistics that <code>describe()</code> omits with <code>.median()</code> / <code>.skew()</code> / <code>.kurt()</code> / <code>.quantile([...])</code> and scipy's MAD, then run the classic demonstration that <b>one outlier moves the mean but not the median</b>. Everything here runs as-is.</p>`,
    code: `import numpy as np
import pandas as pd
from scipy.stats import median_abs_deviation
from sklearn.datasets import load_breast_cancer

# --- A real, right-skewed feature: cell-nucleus 'mean area' ---
df = load_breast_cancer(as_frame=True).frame
s = df['mean area']                      # 569 values, strongly right-skewed

# === 1. The describe() reflex: count, mean, std, min, quartiles, max ===
print(s.describe())
# count    569.00
# mean     654.89   <- the average
# std      351.91   <- spread around the mean (non-robust)
# min      143.50
# 25%      420.30   <- Q1
# 50%      551.10   <- median  (mean 654.89 > median 551.10  => right skew)
# 75%      782.70   <- Q3
# max     2501.00

# === 2. The robust + shape stats describe() leaves out ===
median = s.median()                                  # 551.10  robust center
iqr    = s.quantile(0.75) - s.quantile(0.25)         # 362.40  robust spread
mad    = median_abs_deviation(s)                     # 153.30  robust spread (scipy)
print('median:', round(median, 2), ' IQR:', round(iqr, 2), ' MAD:', round(mad, 2))
print('skew:', round(s.skew(), 3), ' kurtosis:', round(s.kurt(), 3))
# skew 1.646 (long right tail), kurtosis 3.652 (heavier-than-normal tails)

# Five-number summary + any percentiles you like:
print(s.quantile([0, 0.25, 0.5, 0.75, 1.0]).round(1).tolist())   # min, Q1, med, Q3, max
print(s.quantile([0.10, 0.90]).round(1).tolist())                # 10th / 90th pctile

# === 3. One outlier moves the MEAN but not the MEDIAN ===
clean = pd.Series([10, 12, 11, 13, 12, 10, 14, 11, 12, 13.])
print('clean  -> mean %.2f  median %.2f' % (clean.mean(), clean.median()))
# clean  -> mean 11.80  median 12.00
dirty = pd.concat([clean, pd.Series([1000.])], ignore_index=True)
print('dirty  -> mean %.2f  median %.2f' % (dirty.mean(), dirty.median()))
# dirty  -> mean 101.64 median 12.00   <- mean ruined, median unmoved

# Rule of thumb: when mean and median disagree (skew is large), report the
# median + IQR (robust); reserve mean + std for symmetric, clean columns.`
  };

  window.CODEVIZ["dw-summary-stats"] = {
    question: "Read the gap between robust (median/IQR/MAD) and non-robust (mean/std) summaries as a diagnostic: when do they agree, and when does the gap scream 'don't trust the mean'?",
    charts: [
      {
        type: "bars",
        title: "Right-skewed feature: center — mean pulled ABOVE the median",
        xlabel: "statistic",
        ylabel: "value (mean area)",
        labels: ["median (robust)", "mean (non-robust)"],
        values: [551.1, 654.89],
        valueLabels: ["551.1", "654.9"],
        colors: ["#7ee787", "#ff7b72"],
        interpret: "Two bars, same quantity (a 'typical' value) computed two ways. Real numbers from load_breast_cancer 'mean area' (569 values, skew 1.65). The green <b>median (551)</b> is the middle value; the red <b>mean (655)</b> is the balance point and the long right tail drags it up and to the right. <b>Mean &gt; median is the textbook fingerprint of right skew</b> — the bigger that gap, the more the mean overstates the typical case. Here, report the median."
      },
      {
        type: "bars",
        title: "Right-skewed feature: spread — std inflated, MAD/IQR grounded",
        xlabel: "statistic",
        ylabel: "value (mean area)",
        labels: ["MAD (robust)", "IQR (robust)", "std (non-robust)"],
        values: [153.3, 362.4, 351.91],
        valueLabels: ["153.3", "362.4", "351.9"],
        colors: ["#7ee787", "#7ee787", "#ff7b72"],
        interpret: "Same feature, now spread three ways. The red <b>std (352)</b> measures wobble around that pulled-up mean and the squared tail distances inflate it; it dwarfs the robust <b>MAD (153)</b>. (The IQR runs level here only because skew is moderate.) The lesson: pair spread with the matching center — quote <b>IQR/MAD with the median</b>, never std with a skewed mean. The std&gt;MAD gap is the same alarm as mean&gt;median."
      },
      {
        type: "bars",
        title: "Symmetric clean column: every summary AGREES (illustrative)",
        xlabel: "statistic",
        ylabel: "value",
        labels: ["median", "mean", "MAD", "IQR/1.35", "std"],
        values: [50.0, 50.1, 9.8, 10.1, 10.0],
        valueLabels: ["50.0", "50.1", "9.8", "10.1", "10.0"],
        colors: ["#7ee787", "#4ea1ff", "#7ee787", "#7ee787", "#4ea1ff"],
        interpret: "Illustrative, for a roughly symmetric clean column (e.g. heights). Now the robust (green) and non-robust (blue) bars sit at the SAME height: median ≈ mean, and MAD ≈ IQR-scaled ≈ std. <b>When the two families agree, the mean/std picture is trustworthy</b> — there is no skew or outlier to hide. This 'no gap' is your green light to use the classical mean and std (for z-scores, effect sizes, etc.)."
      },
      {
        type: "bars",
        title: "One fat-fingered outlier: mean & std explode, robust trio shrug",
        xlabel: "statistic",
        ylabel: "value (log-ish scale, illustrative)",
        labels: ["median", "mean", "MAD", "IQR", "std"],
        values: [12.0, 101.6, 1.5, 2.0, 314.0],
        valueLabels: ["12.0", "101.6", "1.5", "2.0", "314.0"],
        colors: ["#7ee787", "#ff7b72", "#7ee787", "#7ee787", "#ff7b72"],
        interpret: "Illustrative: ten values near 12 plus one glitch reading of 1000 (the lesson's own example). The red <b>mean (102)</b> and <b>std (314)</b> blow up because they sum/square every value, so one giant dominates. The green <b>median (12)</b>, <b>IQR (2)</b>, <b>MAD (1.5)</b> barely move — ranks ignore HOW large a tail point is. A huge red-vs-green gap like this means 'a single outlier or heavy skew is present': report the robust trio and go hunt the bad value."
      }
    ],
    caption: "Read these as paired robust (green) vs non-robust (red/blue) summaries. The first two charts use REAL numbers from load_breast_cancer 'mean area' (skew 1.65): mean&gt;median and std&gt;MAD both flag the right tail. The last two are illustrative but honest variants — a symmetric clean column where every summary agrees (use mean/std), and a single fat-fingered outlier where mean and std explode while median/IQR/MAD shrug (use the robust trio). The size of the red-vs-green gap IS the diagnostic for which summary to trust.",
    code: `import numpy as np
from scipy.stats import median_abs_deviation
from sklearn.datasets import load_breast_cancer

df = load_breast_cancer(as_frame=True).frame
s = df['mean area']                       # 569 real values, strongly right-skewed

mean   = s.mean()                         # 654.89
median = s.median()                       # 551.10
std    = s.std()                          # 351.91
iqr    = s.quantile(0.75) - s.quantile(0.25)   # 362.40
mad    = median_abs_deviation(s)          # 153.30
print('skewness :', round(s.skew(), 3))   # 1.646  (long right tail)
print('center   -> median %.2f  mean %.2f' % (median, mean))
print('spread   -> MAD %.2f  IQR %.2f  std %.2f' % (mad, iqr, std))
# center  -> median 551.10  mean 654.89   (mean pulled above median)
# spread  -> MAD 153.30  IQR 362.40  std 351.91   (std inflated by the tail)`
  };
})();
