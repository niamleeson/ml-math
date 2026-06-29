/* Data Wrangling — "Distribution & relationship plots: the workhorse charts and how to read each".
   Self-contained: lesson + CODE + CODEVIZ merged by id "dw-distribution-relationship-plots". */
(function () {
  window.LESSONS.push({
    id: "dw-distribution-relationship-plots",
    title: "Distribution & relationship plots: reading the workhorse charts",
    tagline: "A tour of the everyday EDA plots — what each one shows, and the trap hiding in each.",
    module: "Data Wrangling",
    prereqs: ["dw-loading-inspecting", "met-distribution", "met-association", "dw-outliers"],

    bigIdea:
      `<p>Once your data is loaded and roughly clean, you <b>look at it</b>. EDA (Exploratory Data
       Analysis) is mostly plotting, and you keep reaching for the same dozen charts. This lesson is a
       field guide to them. We split the workhorses into two families by the question they answer.</p>
       <p><b>Distribution plots</b> answer "what does <i>one</i> variable look like?" &mdash; where its
       values pile up, how spread out they are, whether there is one hump or several, where the
       outliers sit. The cast: <b>histogram</b>, <b>KDE (Kernel Density Estimate)</b>, <b>box plot</b>,
       <b>violin plot</b>, and the <b>ECDF (Empirical Cumulative Distribution Function)</b>.</p>
       <p><b>Relationship plots</b> answer "how do <i>two or more</i> variables move together?" The cast:
       <b>scatter</b>, <b>line</b>, <b>heatmap</b>, and the <b>pair plot</b>.</p>
       <p>Every one of these plots is also a small lie waiting to happen: each has a knob (bin count,
       bandwidth, color scale, axis limits) that can hide real structure or invent fake structure. The
       point of this lesson is to read each plot <b>and</b> know its trap.</p>`,

    buildup:
      `<p><b>The distribution family, one by one.</b></p>
       <ul>
         <li><b>Histogram.</b> Chop the value range into bins, count how many points land in each, draw a
         bar per bin. The single knob is the <b>bin count</b>. Too few bins and you smear two humps into
         one; too many and random noise sprouts fake spikes. There is no universally right number &mdash;
         always try a few.</li>
         <li><b>KDE (Kernel Density Estimate).</b> A smooth curve standing in for the histogram. Drop a
         tiny bump (a "kernel") on every data point and add them up. The knob is the <b>bandwidth</b>: wide
         bumps over-smooth (one blurry hill, real peaks gone), narrow bumps under-smooth (a wiggly mess).
         A KDE also <b>spills past the data's real bounds</b> &mdash; smooth a strictly-positive quantity
         and the curve leaks below zero, suggesting values that cannot exist.</li>
         <li><b>Box plot.</b> A five-number summary drawn as a box: the median line, the box edges at the
         first and third quartiles (the IQR, Inter-Quartile Range), whiskers reaching to the last
         non-outlier points, and dots for outliers. Compact and great for comparing many groups side by
         side &mdash; but it <b>hides the shape</b>. A box plot of a two-humped (bimodal) variable looks
         identical to a box plot of a single smooth hump with the same quartiles.</li>
         <li><b>Violin plot.</b> A box plot with a KDE wrapped around it: you get the quartiles <i>and</i>
         the shape, so the two humps a box plot would hide become visible. It inherits the KDE's bandwidth
         knob, so the same over/under-smoothing caveat applies.</li>
         <li><b>ECDF (Empirical Cumulative Distribution Function).</b> For each value on the x-axis, plot
         the <b>fraction of data at or below it</b> &mdash; a staircase rising from 0 to 1. It uses
         <b>no bins and no bandwidth</b>, so it has no tuning knob to mislead you: it shows the data
         exactly. The price is that humps are harder to eyeball (they show up as steeper stretches), so it
         reads less intuitively than a histogram.</li>
       </ul>
       <p><b>The relationship family, one by one.</b></p>
       <ul>
         <li><b>Scatter.</b> One dot per row, $x$ vs $y$. The default view of how two numeric variables
         relate. Its enemy is <b>overplotting</b>: with thousands of rows the dots stack into a solid blob
         and you cannot see density. Fixes &mdash; lower the dot opacity (<code>alpha</code>), add a little
         random <b>jitter</b> to separate identical values, or switch to a <b>hexbin</b> (a 2-D histogram
         that colors hexagonal tiles by how many points fall in them).</li>
         <li><b>Line.</b> A scatter with the dots connected in order &mdash; only meaningful when the
         x-axis has a natural order, usually <b>time</b>. Reads as a trend. The trap: connecting points
         that are <i>not</i> ordered (or that have gaps) draws a trend that is not there.</li>
         <li><b>Heatmap.</b> A grid of colored tiles for a matrix &mdash; most often a
         <b>correlation matrix</b>, every feature against every other. Patterns of strong/weak relations
         jump out at a glance. The trap is the <b>color scale</b>: a badly chosen or auto-scaled palette
         can exaggerate tiny differences or wash out big ones.</li>
         <li><b>Pair plot.</b> A whole grid of scatter plots &mdash; every numeric feature against every
         other &mdash; with a distribution plot down the diagonal. One picture of all pairwise
         relationships, perfect for a first look. It explodes quadratically: with 20 features it is a
         400-panel wall, so use it on a handful of columns.</li>
       </ul>`,

    symbols: [
      { sym: "$n$", desc: "the number of data points (rows) being plotted." },
      { sym: "$h$", desc: "the KDE <b>bandwidth</b>: the width of the bump placed on each point. Small $h$ = wiggly/under-smoothed; large $h$ = blurry/over-smoothed." },
      { sym: "$K$", desc: "the <b>kernel</b>: the little bump shape (usually a Gaussian) centered on each data point and summed to form the KDE curve." },
      { sym: "$\\hat f(x)$", desc: "the estimated density at value $x$ &mdash; how tall the KDE curve is there." },
      { sym: "$F_n(x)$", desc: "the ECDF: the fraction of the $n$ points whose value is $\\le x$. Rises from 0 to 1." },
      { sym: "$Q_1,\\,Q_2,\\,Q_3$", desc: "the first quartile, median, and third quartile &mdash; the box edges and center line in a box plot." }
    ],

    formula:
      `$$ \\hat f(x)=\\frac{1}{n\\,h}\\sum_{i=1}^{n} K\\!\\left(\\frac{x-x_i}{h}\\right),
         \\qquad F_n(x)=\\frac{1}{n}\\sum_{i=1}^{n}\\mathbf{1}[\\,x_i\\le x\\,] $$`,

    whatItDoes:
      `<p>The <b>left formula is the KDE</b>. Read it right to left: for each data point $x_i$ you place a
       kernel bump $K$ centered there with width $h$; you add up all $n$ bumps and divide by $n\\,h$ so the
       total area is 1. The bandwidth $h$ is the only real choice &mdash; it sets how wide each bump is, and
       therefore how smooth the final curve is.</p>
       <p>The <b>right formula is the ECDF</b>. The notation $\\mathbf{1}[\\,x_i\\le x\\,]$ is an
       <b>indicator</b>: it equals 1 when the condition holds and 0 otherwise. So the sum just counts how
       many points are at or below $x$, and dividing by $n$ turns that count into a fraction. No bins, no
       bandwidth &mdash; nothing to tune, nothing to fudge.</p>`,

    derivation:
      `<p><b>Why the box plot hides the most.</b></p>
       <ul class="steps">
         <li>A box plot keeps exactly five numbers: the minimum non-outlier, $Q_1$, the median $Q_2$, $Q_3$,
         and the maximum non-outlier (plus dots for points outside the whiskers).</li>
         <li>Those five numbers are <b>order statistics</b> &mdash; they depend only on the sorted values,
         not on how the points cluster <i>between</i> the quartiles.</li>
         <li>So take a single smooth hump and a clearly two-humped (bimodal) variable that happen to share
         the same five numbers. Their box plots are <b>pixel-for-pixel identical</b>, even though one has a
         gap in the middle and the other does not.</li>
         <li>The fix is to show the points or the shape: overlay a strip/swarm of the raw dots, or use a
         <b>violin plot</b>, whose KDE side reveals the two humps the box collapsed. $\\blacksquare$</li>
       </ul>`,

    example:
      `<p>Take eight exam scores, $n=8$: $\\{52,\\ 55,\\ 58,\\ 60,\\ 88,\\ 90,\\ 92,\\ 95\\}$ &mdash; clearly
       <b>two clusters</b>, a low group and a high group, nothing in the middle. Let us plug them into the
       <b>ECDF</b> formula $F_n(x)=\\frac{1}{n}\\sum_{i=1}^{n}\\mathbf{1}[x_i\\le x]$ &mdash; just "count the
       points at or below $x$, divide by 8".</p>
       <table class="extable">
         <caption>ECDF: at each score, count how many of the 8 points are $\\le x$, then divide by 8.</caption>
         <thead><tr><th>$x$</th><th class="num">count $\\le x$</th><th class="num">$F_8(x)=\\text{count}/8$</th></tr></thead>
         <tbody>
           <tr><td class="row-h">52</td><td class="num">1</td><td class="num">0.125</td></tr>
           <tr><td class="row-h">55</td><td class="num">2</td><td class="num">0.250</td></tr>
           <tr><td class="row-h">58</td><td class="num">3</td><td class="num">0.375</td></tr>
           <tr><td class="row-h">60</td><td class="num">4</td><td class="num">0.500</td></tr>
           <tr><td class="row-h">88</td><td class="num">5</td><td class="num">0.625</td></tr>
           <tr><td class="row-h">90</td><td class="num">6</td><td class="num">0.750</td></tr>
           <tr><td class="row-h">92</td><td class="num">7</td><td class="num">0.875</td></tr>
           <tr><td class="row-h">95</td><td class="num">8</td><td class="num">1.000</td></tr>
         </tbody>
       </table>
       <ul class="steps">
         <li><b>ECDF, the calculation.</b> At $x=60$: four scores ($52,55,58,60$) are $\\le 60$, so
         $F_8(60)=\\tfrac{4}{8}=0.5$. At $x=87$ (in the empty middle): still only those four are $\\le 87$, so
         $F_8(87)=\\tfrac{4}{8}=0.5$ &mdash; <b>unchanged</b>. The curve runs <b>flat from 60 to 88</b>: that
         flat shelf <i>is</i> the gap, shown exactly with no tuning.</li>
         <li><b>Box plot, the five numbers.</b> Median $Q_2=\\tfrac{60+88}{2}=74$; lower quartile
         $Q_1=\\tfrac{55+58}{2}=56.5$; upper quartile $Q_3=\\tfrac{90+92}{2}=91$; whiskers at $52$ and $95$.
         A box from $56.5$ to $91$ with a line at $74$ &mdash; <b>identical</b> to a box plot of eight scores
         spread <i>evenly</i> from 52 to 95. The middle gap is <b>invisible</b>.</li>
         <li><b>Histogram, 2 bins</b> &mdash; bin 50&ndash;75 holds the 4 low scores, bin 75&ndash;100 holds
         the 4 high scores. Two bars, nothing between: the gap shows. Good.</li>
         <li><b>Histogram, 1 bin</b> &mdash; a single bar "50&ndash;100: 8 points". The two clusters have
         <b>vanished</b>. Too few bins smeared the structure away &mdash; the classic bin-count trap.</li>
       </ul>
       <table class="extable">
         <caption>Same 8 numbers, four plots: does each one show the middle gap?</caption>
         <thead><tr><th>plot</th><th>tuning knob</th><th>shows the gap?</th></tr></thead>
         <tbody>
           <tr><td class="row-h">histogram, 2 bins</td><td>bin count</td><td>yes</td></tr>
           <tr><td class="row-h">histogram, 1 bin</td><td>bin count</td><td>no (too few bins)</td></tr>
           <tr><td class="row-h">box plot</td><td>none</td><td>no (only 5 numbers)</td></tr>
           <tr><td class="row-h">ECDF</td><td>none</td><td>yes (flat 60&rarr;88)</td></tr>
         </tbody>
       </table>
       <p>Same eight numbers: the histogram shows the gap only if you pick enough bins, the ECDF always
       shows it (the flat $0.5$ shelf), and the box plot never does.</p>`,

    whenToUse:
      `<p><b>Pick the family by how many variables you are asking about.</b></p>
       <ul>
         <li><b>Understanding one variable</b> &mdash; reach for a <b>distribution</b> plot. Start with a
         <b>histogram</b> (try a few bin counts). Add a <b>KDE</b> or <b>violin</b> when you want a smooth
         read or to compare a couple of groups. Use a <b>box plot</b> to compare <i>many</i> groups
         compactly &mdash; but pair it with the points or a violin so you do not miss multimodality. Use an
         <b>ECDF</b> when you need the exact distribution with no binning, or to compare two distributions
         honestly (percentiles read straight off the y-axis).</li>
         <li><b>Two or more variables</b> &mdash; reach for a <b>relationship</b> plot. <b>Scatter</b> for
         two numerics; <b>line</b> when $x$ is time/ordered; <b>heatmap</b> for a correlation matrix or any
         grid of numbers; <b>pair plot</b> for a quick all-pairs overview of a handful of features.</li>
         <li><b>Which exact chart?</b> Match the chart to the variable types and the question &mdash; the
         same logic the metrics lessons on the <b>distribution</b> and <b>association</b> of variables use.
         When in doubt, plot two or three of these and see which makes the structure obvious.</li>
       </ul>`,

    application:
      `<p>These charts are the daily bread of EDA and reporting.</p>
       <ul>
         <li><b>First look at a new dataset.</b> A histogram or violin per numeric column and a correlation
         heatmap across them tells you, in seconds, which features are skewed, bimodal, or strongly
         related &mdash; before you write a single model.</li>
         <li><b>Spotting data problems.</b> A spike at exactly 0 or 999 in a histogram is often a hidden
         missing-value code; a single dot far out in a scatter is an outlier or a typo; a flat shelf in an
         ECDF is a pile-up at one value.</li>
         <li><b>Comparing groups.</b> Side-by-side box or violin plots of a metric across segments
         (regions, cohorts, model versions) are the standard way to show "this group differs from that
         one" in a slide.</li>
       </ul>`,

    pitfalls:
      `<ul>
         <li><b>Histogram bin count hides or invents structure.</b> Too few bins merge separate humps into
         one; too many turn sampling noise into fake spikes. <b>Fix:</b> never trust a single bin count
         &mdash; sweep a few, and back it up with a KDE or an ECDF.</li>
         <li><b>KDE bandwidth over- or under-smooths, and spills past real bounds.</b> A wide bandwidth
         erases genuine peaks; a narrow one is all wiggles. And because the kernel is smooth, the curve
         leaks past the data's limits &mdash; smoothing a strictly-positive quantity draws density below 0.
         <b>Fix:</b> try more than one bandwidth, and clip or note the support (e.g. <code>cut=0</code>) for
         bounded variables.</li>
         <li><b>Box plots hide multimodality.</b> A box plot of a two-humped variable is identical to one of
         a single hump with the same quartiles. <b>Fix:</b> overlay the points (strip/swarm) or use a
         <b>violin</b> plot, which shows the shape.</li>
         <li><b>Scatter overplotting.</b> Thousands of dots stack into an opaque blob and density is lost.
         <b>Fix:</b> lower opacity (<code>alpha</code>), add jitter to discrete values, or switch to a
         <b>hexbin</b> / 2-D density.</li>
         <li><b>Heatmap color scale distorts.</b> An auto-scaled or rainbow palette can blow up trivial
         differences or flatten big ones. <b>Fix:</b> for correlations use a diverging palette centered at
         0 with fixed limits ($-1$ to $1$); annotate the cells with the numbers.</li>
         <li><b>Truncated axes.</b> Starting a bar or line axis above 0 (or zooming a scatter) exaggerates
         differences and can flip the visual story. <b>Fix:</b> start magnitude axes at 0 and state any
         zoom explicitly.</li>
       </ul>`,

    practice: [
      {
        q: `A histogram of a "session length" column shows one smooth hump. A colleague insists there are really two kinds of users. How would you check, and which plots could have hidden the split?`,
        steps: [
          { do: `Re-draw the histogram with several bin counts (e.g. 10, 30, 80).`, why: `A single bin count can smear two nearby humps into one; sweeping bins reveals whether a gap appears.` },
          { do: `Overlay a KDE at a couple of bandwidths, and draw a violin or strip plot of the raw points.`, why: `An over-smoothed KDE or a box plot would also collapse two humps into one shape; the violin/points show the true shape.` },
          { do: `Draw an ECDF and look for a flat shelf in the middle.`, why: `A flat stretch in the ECDF means a region with no data — a gap between two clusters — shown exactly, with no tuning.` }
        ],
        answer: `<p>The smooth hump may be an artifact of <b>too few bins</b> or an <b>over-smoothed KDE</b>; a <b>box plot</b> would hide a split entirely. Check with several bin counts, a violin or strip plot of the points, and an <b>ECDF</b> (a flat shelf = a gap between two clusters). If a gap shows up, your colleague is right.</p>`
      },
      {
        q: `You scatter-plot 50,000 rows of (price, area) and see a solid black rectangle — no structure at all. List three ways to recover the density.`,
        steps: [
          { do: `Lower the dot opacity with alpha (e.g. alpha=0.05).`, why: `Where many points overlap the color builds up, so dense regions look darker and sparse ones lighter.` },
          { do: `Add small random jitter to any discrete/rounded coordinate.`, why: `Identical values that would stack on one pixel get nudged apart, exposing how many there are.` },
          { do: `Switch to a hexbin or 2-D density plot.`, why: `A hexbin is a 2-D histogram: it tiles the plane and colors each hexagon by its count, so density is encoded directly instead of by overlap.` }
        ],
        answer: `<p>This is <b>overplotting</b>. Recover the density by (1) lowering opacity (<code>alpha</code>), (2) adding <b>jitter</b> to discrete values, and (3) switching to a <b>hexbin</b> or 2-D density plot, which bins the plane and colors by count.</p>`
      },
      {
        q: `Why does an ECDF have no "knob" to mislead you, while a histogram and a KDE both do? Name the knob for each.`,
        steps: [
          { do: `Recall how each plot is built.`, why: `A histogram bins the range; a KDE sums kernel bumps; an ECDF just counts the fraction of points at or below each value.` },
          { do: `Identify the tuning parameter of each.`, why: `The histogram's knob is the bin count/width; the KDE's is the bandwidth $h$; the ECDF has none — it plots $F_n(x)$ directly.` },
          { do: `Connect each knob to a way it can mislead.`, why: `Bad bins hide or invent humps; bad bandwidth over/under-smooths and spills past bounds; the ECDF, having no knob, cannot do either.` }
        ],
        answer: `<p>The <b>histogram</b> has a <b>bin count/width</b> and the <b>KDE</b> has a <b>bandwidth $h$</b>; either can hide real structure or invent fake structure. The <b>ECDF</b> is just $F_n(x)=$ the fraction of points $\\le x$ — it has <b>no bins and no bandwidth</b>, so it shows the data exactly with nothing to tune.</p>`
      }
    ]
  });

  window.CODE["dw-distribution-relationship-plots"] = {
    lib: "matplotlib + seaborn",
    runnable: false,
    explain: `<p>One pass through every workhorse plot on a real dataset. We use seaborn's bundled
      <code>tips</code> table (restaurant bills) for the distribution and scatter examples, and the
      <code>load_wine</code> features for the correlation heatmap and pair plot. Each call is the idiomatic
      one-liner: <code>histplot</code>, <code>kdeplot</code>, <code>boxplot</code>, <code>violinplot</code>,
      <code>ecdfplot</code> for distributions; <code>scatterplot</code> (with <code>alpha</code>),
      <code>heatmap</code>, and <code>pairplot</code> for relationships. Run it cell-by-cell and watch how
      each chart answers a different question about the same data. <code>runnable</code> is off because it
      needs matplotlib/seaborn installed.</p>`,
    code: `import numpy as np
import pandas as pd
import matplotlib.pyplot as plt
import seaborn as sns
from sklearn.datasets import load_wine

sns.set_theme()

# Bundled real data: restaurant bills (one row per table).
tips = sns.load_dataset("tips")      # columns: total_bill, tip, day, time, size, ...

# ============================================================
# DISTRIBUTION PLOTS — "what does ONE variable look like?"
# ============================================================

# Histogram: bin the range and count. The bin count is the knob — try a few.
fig, axes = plt.subplots(1, 3, figsize=(12, 3))
for ax, bins in zip(axes, [5, 20, 80]):
    sns.histplot(tips, x="total_bill", bins=bins, ax=ax)
    ax.set_title(f"histogram, {bins} bins")   # too few hides humps, too many invents spikes
plt.show()

# KDE: a smooth density. The bandwidth (bw_adjust) over/under-smooths.
sns.kdeplot(tips, x="total_bill", bw_adjust=0.3, label="narrow (wiggly)")
sns.kdeplot(tips, x="total_bill", bw_adjust=2.0, label="wide (over-smoothed)")
# cut=0 stops the curve spilling past the data's real min/max (bills can't be < 0).
sns.kdeplot(tips, x="total_bill", bw_adjust=1.0, cut=0, label="default, clipped")
plt.legend(); plt.show()

# Box plot: five-number summary per group — compact, but HIDES the shape.
sns.boxplot(tips, x="day", y="total_bill")
# overlay the raw points so a hidden second hump can't sneak past:
sns.stripplot(tips, x="day", y="total_bill", color="k", alpha=0.4, size=3)
plt.show()

# Violin: box + KDE, so the shape (e.g. bimodality) is visible.
sns.violinplot(tips, x="day", y="total_bill")
plt.show()

# ECDF: fraction of points <= x. No bins, no bandwidth — exact.
sns.ecdfplot(tips, x="total_bill")
plt.show()

# ============================================================
# RELATIONSHIP PLOTS — "how do TWO+ variables move together?"
# ============================================================

# Scatter: the default two-numeric view. alpha tames overplotting.
sns.scatterplot(tips, x="total_bill", y="tip", hue="time", alpha=0.5)
plt.show()
# For very large data, swap in a hexbin (a 2-D histogram):
# plt.hexbin(tips["total_bill"], tips["tip"], gridsize=25, cmap="Blues")

# Line: only when x is ordered (here, mean tip by party size — an ordered count).
order = tips.groupby("size")["tip"].mean().reset_index()
sns.lineplot(order, x="size", y="tip", marker="o")
plt.show()

# Heatmap: a correlation matrix of the wine features.
wine = load_wine(as_frame=True).frame
corr = wine.corr(numeric_only=True)
# diverging palette centered at 0, fixed -1..1 limits, annotated — an honest scale.
sns.heatmap(corr, vmin=-1, vmax=1, center=0, cmap="coolwarm")
plt.show()

# Pair plot: every feature vs every other (use only a handful of columns).
cols = ["alcohol", "flavanoids", "color_intensity", "proline", "target"]
sns.pairplot(wine[cols], hue="target", corner=True)
plt.show()`
  };

  window.CODEVIZ["dw-distribution-relationship-plots"] = {
    question: "Same data, different plots: which charts show the structure honestly, and which ones hide it?",
    charts: [
      {
        type: "hist",
        title: "Ideal: histogram of 'proline' (178 wines, 8 bins) — right-skewed, one peak",
        xlabel: "proline",
        ylabel: "count of wines",
        labels: ["278", "453", "628", "804", "979", "1154", "1330", "1505"],
        values: [31, 47, 38, 16, 23, 16, 3, 4],
        valueLabels: ["31", "47", "38", "16", "23", "16", "3", "4"],
        colors: ["#4ea1ff", "#4ea1ff", "#4ea1ff", "#4ea1ff", "#4ea1ff", "#4ea1ff", "#4ea1ff", "#4ea1ff"],
        interpret: "X is the proline value (split into 8 equal-width bins), Y is how many wines land in each bin. The tallest bar sits near 450 and the bars shrink toward the right, with a long thin tail — this shape is <b>right-skewed</b>: most wines have low-to-medium proline, a few have a lot. One clear peak means one main group. With a good bin count, the histogram reads the distribution honestly."
      },
      {
        type: "bars",
        title: "Trap — too few bins: 2 bins hide a real two-cluster gap (illustrative)",
        xlabel: "value range",
        ylabel: "count",
        labels: ["50–75", "75–100"],
        values: [4, 4],
        valueLabels: ["4", "4"],
        colors: ["#ffb454", "#ffb454"],
        interpret: "Illustrative — the eight exam scores {52,55,58,60,88,90,92,95}, which are really two clusters with an empty middle. With only <b>2 bins</b> you see two equal bars and nothing else; the gap between the low group and the high group has vanished. Too few bins smear separate humps into a featureless block. The fix is to sweep several bin counts — with more bins the empty middle would reappear as a gap."
      },
      {
        type: "line",
        title: "Trap — box plot vs ECDF on the same bimodal data (illustrative)",
        xlabel: "value",
        ylabel: "fraction of points at or below x",
        series: [
          { name: "ECDF (staircase shows the gap)", color: "#7ee787", points: [[52,0.125],[55,0.25],[58,0.375],[60,0.5],[88,0.5],[88,0.625],[90,0.75],[92,0.875],[95,1.0]] },
          { name: "box plot would draw one solid box here", color: "#ff7b72", points: [[57,0.5],[91,0.5]] }
        ],
        interpret: "Illustrative, same eight bimodal scores. The green <b>ECDF</b> plots the fraction of points at or below each x: it climbs over the low cluster, runs <b>flat</b> across the empty 60→88 middle (no points, so no rise), then climbs again — that flat shelf <i>is</i> the gap, shown exactly with no tuning. The red line marks the span a <b>box plot</b> would draw: a single box from about 57 to 91 with a median around 74, which looks identical to evenly-spread data. The box plot hides the two clusters; the ECDF cannot."
      },
      {
        type: "scatter",
        title: "Relationship: flavanoids vs color intensity, colored by grape class",
        xlabel: "flavanoids",
        ylabel: "color intensity",
        groups: [
          { name: "class_0", color: "#7ee787", points: [[3.24, 5.68], [2.69, 4.32], [2.51, 5.05], [3.32, 5.75], [2.43, 5.0], [2.88, 3.8], [2.94, 4.8], [2.97, 4.5], [3.25, 5.7], [2.74, 5.4], [2.53, 4.2], [2.98, 5.1], [3.29, 6.13], [2.68, 4.28], [3.56, 5.43], [2.63, 4.36], [3.17, 4.9], [2.92, 6.2]] },
          { name: "class_1", color: "#4ea1ff", points: [[3.18, 5.3], [2.0, 4.68], [1.28, 2.85], [1.85, 3.4], [2.53, 3.9], [2.21, 3.05], [1.94, 2.62], [1.69, 2.8], [1.59, 1.74], [1.25, 3.6], [1.46, 3.05], [2.25, 2.15], [0.99, 2.5], [1.64, 2.06], [1.76, 3.3], [1.25, 3.4], [2.13, 2.08], [2.45, 2.12]] },
          { name: "class_2", color: "#ff7b72", points: [[0.58, 5.45], [0.66, 7.1], [0.6, 5.0], [0.6, 4.92], [0.52, 4.35], [0.55, 4.0], [1.36, 10.8], [0.83, 10.52], [0.58, 7.6], [0.83, 9.01], [1.31, 13.0], [0.7, 5.28], [0.66, 10.26], [0.96, 8.5], [0.49, 5.5], [0.51, 9.9], [0.61, 7.7], [0.69, 10.2]] }
        ],
        interpret: "A relationship plot: X is flavanoids, Y is color intensity, one dot per wine, colored by grape class. Each color forms its own cloud — green (class_0) sits high on flavanoids, blue (class_1) low on color intensity, red (class_2) far left with very low flavanoids. The clean separation says these two features together tell the classes apart, something no single-variable distribution plot could reveal. Watch for <b>overplotting</b> though: with thousands of rows these dots would stack into a blob — then lower opacity or switch to a hexbin."
      }
    ],
    caption: "Ideal distribution plot plus traps, then a relationship plot. Histogram and scatter use real numbers from sklearn's load_wine (178 wines): proline counts 31, 47, 38, 16, 23, 16, 3, 4 (right-skewed); 18 wines per grape class for flavanoids vs color intensity. The two-bin bars and the ECDF/box comparison are illustrative, built from the eight bimodal exam scores {52,55,58,60,88,90,92,95} to show how bin count and a box plot can hide a real gap that an ECDF shows exactly.",
    code: `import numpy as np
from sklearn.datasets import load_wine

d = load_wine()
names = list(d.feature_names)
X, y = d.data, d.target

# --- DISTRIBUTION: histogram of one feature ('proline') ---
x = X[:, names.index('proline')]
edges = np.linspace(x.min(), x.max(), 9)          # 8 equal-width bins
counts = np.histogram(x, bins=edges)[0]
print('bin edges :', np.round(edges).astype(int)) # [278 453 628 804 979 1154 1330 1505 1680]
print('counts    :', counts)                      # [31 47 38 16 23 16  3  4]  (right-skewed)

# --- RELATIONSHIP: scatter of two features, colored by class ---
fx, fy = names.index('flavanoids'), names.index('color_intensity')
rng = np.random.RandomState(0)
for cls in [0, 1, 2]:
    idx = np.where(y == cls)[0]
    take = sorted(rng.choice(idx, 18, replace=False))      # 18 points per class
    pts = [[round(float(X[i, fx]), 2), round(float(X[i, fy]), 2)] for i in take]
    print(d.target_names[cls], pts)                        # classes separate cleanly`
  };
})();
