/* Data Wrangling — "Designing effective, honest visuals".
   Self-contained: lesson + CODE + CODEVIZ merged by id "dw-effective-visuals". */
(function () {
  window.LESSONS.push({
    id: "dw-effective-visuals",
    title: "Designing effective, honest visuals",
    tagline: "Strip a chart down to the data, encode it so the eye reads it accurately, and the reader gets the message in seconds.",
    module: "Data Wrangling",
    prereqs: [],

    whenToUse:
      `<p>Reach for these principles <b>every time a chart is meant for an audience</b> &mdash; a report,
       a slide, a dashboard, a README figure. The moment someone other than you will read the chart, its
       job changes from "let me poke at the data" to "deliver one clear message fast".</p>
       <ul>
         <li><b>Use them when you present.</b> A throwaway exploratory plot can be ugly; a chart in a deck
         cannot. The reader has seconds and no chance to ask you what the axes mean.</li>
         <li><b>Reach for the encoding rules when you choose a chart type.</b> Before you draw, decide
         whether the comparison is about <i>magnitude</i> (use bar length), <i>trend</i> (use a line), or
         <i>relationship</i> (use a scatter). The pie chart and the bubble chart are the usual mistakes.</li>
         <li><b>Versus alternatives.</b> Fancy 3-D charts, gauges, and word clouds almost never beat a
         plain sorted bar chart. When in doubt, the boring option communicates better.</li>
       </ul>`,

    application:
      `<p>Effective-visual design is the last mile of data work &mdash; the step where a clean dataset
       becomes a decision.</p>
       <ul>
         <li><b>EDA (Exploratory Data Analysis) write-ups.</b> The plots you keep from exploration get
         cleaned up before they go in a notebook others will read.</li>
         <li><b>Executive slides &amp; dashboards.</b> A leadership audience reads one chart in seconds;
         clutter or a misleading encoding costs you the message (or your credibility).</li>
         <li><b>Model &amp; metric reporting.</b> Feature-importance bars, error breakdowns, and A/B-test
         results are all bar/line charts that benefit from sorting, direct labels, and units.</li>
         <li><b>Accessibility &amp; honesty reviews.</b> Public-facing or regulated figures must be
         color-blind-safe, must not rely on color alone, and must start bar axes at zero.</li>
       </ul>`,

    pitfalls:
      `<ul>
         <li><b>Chart junk / low data-ink.</b> Heavy gridlines, boxes, drop shadows, 3-D, and background
         fills add ink that carries no data. <i>Fix:</i> delete everything that is not the data or a label
         the reader needs &mdash; remove spines, drop the grid, kill the 3-D.</li>
         <li><b>Encoding by area or angle.</b> The eye reads <b>length and position</b> accurately but
         misjudges <b>area, angle, and color shade</b>. Pie slices (angle/area) and bubble sizes (area)
         get misread. <i>Fix:</i> prefer a <b>bar chart</b> (length) over a pie or bubble chart.</li>
         <li><b>Rainbow / non-color-blind-safe palettes.</b> Red&ndash;green pairings are invisible to
         the most common color blindness, and a rainbow has no natural order. <i>Fix:</i> use a
         color-blind-safe palette (e.g. Okabe&ndash;Ito, or seaborn's <code>colorblind</code>), and a
         <b>sequential</b> ramp for ordered values.</li>
         <li><b>Relying on color alone.</b> If color is the only thing separating two series, a
         color-blind reader (or a black-and-white printout) loses the distinction. <i>Fix:</i> add a
         second cue &mdash; direct labels, line dashes, or markers.</li>
         <li><b>Unsorted bars.</b> Bars left in alphabetical or load order force the reader to hunt for the
         biggest value. <i>Fix:</i> <b>sort bars by value</b> (unless the category has its own natural
         order, like months).</li>
         <li><b>Missing units / titles, legend hunting.</b> No units, a vague title, or a legend the eye
         must bounce to and from. <i>Fix:</i> a descriptive title that states the takeaway, axis labels
         with units, and <b>direct labels</b> on the lines/bars instead of a legend.</li>
         <li><b>Inconsistent scales &amp; too many colors.</b> Two panels with different y-axis ranges
         invite false comparisons; more than a handful of colors becomes noise. <i>Fix:</i> share scales
         across comparable panels, and cap categorical colors at roughly seven.</li>
       </ul>`,

    bigIdea:
      `<p>A chart is a <b>visual sentence</b>: it should say one thing, and say it fast. Edward Tufte gave
       the guiding ratio &mdash; the <b>data-ink ratio</b>. Picture all the ink (pixels) in a chart and
       split it into ink that <i>shows the data</i> and ink that does not (gridlines, borders, 3-D walls,
       background fills). Tufte's rule: <b>maximize the data-ink, erase the rest</b>. Every non-data mark
       is "chart junk" the reader's eye has to wade through.</p>
       <p>The second idea is the <b>encoding hierarchy</b>. Cleveland and McGill measured how accurately
       people read quantities from different visual channels. The ranking, best first, is roughly:
       <b>position &gt; length &gt; angle &gt; area &gt; color shade</b>. So a value drawn as a bar's
       <i>length</i> is read far more accurately than the same value drawn as a pie slice's <i>angle</i>
       or a bubble's <i>area</i>. This single ranking is why "use a bar chart, not a pie chart" is the most
       repeated advice in visualization.</p>
       <p>The third idea is <b>color with a job</b>. Color should encode something or draw the eye to the
       point &mdash; not decorate. And it must be readable by everyone: use color-blind-safe palettes and
       never let color be the <i>only</i> signal.</p>`,

    buildup:
      `<p>Putting the three ideas to work is a short checklist you run on every chart.</p>
       <ul>
         <li><b>Pick the encoding first.</b> Magnitude comparison &rarr; bar length. Trend over time
         &rarr; line position. Relationship &rarr; scatter position. Avoid angle (pie) and area (bubble,
         3-D) for anything you want read precisely.</li>
         <li><b>Cut the chart junk.</b> Remove the top and right spines, drop or lighten gridlines, delete
         legends you can replace with direct labels, and never use 3-D for 2-D data.</li>
         <li><b>Order the data.</b> Sort bars from largest to smallest so rank is read at a glance, unless
         the category is inherently ordered (Mon&hellip;Sun, age bands).</li>
         <li><b>Use color deliberately.</b> One muted base color for everything, one accent color for the
         bar/line you want the reader to notice. For ordered data use a <b>sequential</b> ramp; for a
         centered quantity (above/below zero) use a <b>diverging</b> ramp; for distinct groups use a
         <b>categorical</b> color-blind-safe palette.</li>
         <li><b>Label for seconds, not minutes.</b> Title states the <i>conclusion</i> ("Alcohol dominates
         the chemistry of class-0 wines"), axes carry <b>units</b>, and values are printed at the end of
         bars so the reader never has to measure against a grid.</li>
       </ul>`,

    symbols: [
      { sym: "data-ink ratio", desc: "$\\text{(ink used to show data)} / \\text{(total ink in the chart)}$. Tufte's target is to push this toward 1 by erasing non-data ink." },
      { sym: "encoding channel", desc: "the visual property that carries a number &mdash; position, length, angle, area, or color. The eye reads them with different accuracy." },
      { sym: "sequential palette", desc: "colors from light to dark in one hue; encodes an <b>ordered</b> quantity (0 up to a maximum)." },
      { sym: "diverging palette", desc: "two hues meeting at a neutral midpoint; encodes a quantity centered on a meaningful zero (negative vs positive)." },
      { sym: "categorical palette", desc: "a set of distinct, equally-weighted hues for <b>unordered</b> groups; keep it color-blind-safe and small." }
    ],

    derivation:
      `<p><b>Why length beats angle and area &mdash; the reasoning behind the hierarchy.</b></p>
       <ul class="steps">
         <li>To read a chart, the eye must turn a <i>visual mark</i> back into a <i>number</i>. How well it
         does that depends on the channel. Cleveland and McGill ran experiments where people estimated
         values shown as bar lengths, pie angles, and circle areas.</li>
         <li><b>Position and length</b> won: people judged "how far along an aligned axis" and "how long a
         bar" with small, unbiased error. A common axis gives the eye a ruler.</li>
         <li><b>Angle</b> (pie slices) was worse: people systematically misjudge whether a wedge is, say,
         25% or 30% of the circle, especially when two slices are close in size.</li>
         <li><b>Area</b> was worse still: doubling a bubble's <i>value</i> often means roughly
         $1.4\\times$ its <i>radius</i> (since area grows with the square of radius), and viewers tend to
         judge by radius, undercounting big bubbles. Color shade is the least accurate of all.</li>
         <li>Conclusion: to let the reader recover numbers accurately, encode the important quantity as
         <b>position or length</b> &mdash; i.e. a dot plot or a bar chart. Reserve angle, area, and color
         for rough or secondary signals. That is the whole case for "bars, not pie". $\\blacksquare$</li>
       </ul>
       <p><b>Why erasing ink helps.</b> Attention is finite. Every gridline and border the eye scans is
       attention not spent on the data. Tufte's data-ink rule is just the visual version of "signal over
       noise": raise the share of ink that is signal, and the message arrives faster.</p>`,

    example:
      `<p>Take the seven average chemical readings for class-0 wines (from the bundled wine dataset):
       alcohol $13.74$, malic acid $2.01$, ash $2.46$, total phenols $2.84$, flavanoids $2.98$, color
       intensity $5.53$, hue $1.06$.</p>
       <ul class="steps">
         <li><b>The cluttered default.</b> Plot them as bars in the order they came out of the dataframe
         (alcohol, malic acid, ash, &hellip;), each bar a different rainbow color, a heavy grid behind
         them, a title that just says "Wine features". The reader has to scan all seven bars to find the
         biggest, the rainbow implies an order that isn't there, and the grid adds ink for nothing.</li>
         <li><b>The cleaned version.</b> Sort the bars largest-to-smallest, so alcohol ($13.74$) sits on
         top and hue ($1.06$) at the bottom &mdash; rank is now instant. Color every bar one muted gray
         except alcohol, the point of the chart, in a single accent color. Delete the grid and the top/
         right spines. Print each value at the end of its bar (direct labels, no legend). Re-title it with
         the takeaway: "Alcohol dominates the average chemistry of class-0 wines".</li>
       </ul>
       <p>Same seven numbers, but the second chart is read in one second and the first takes ten. Nothing
       about the <i>data</i> changed &mdash; only the ink and the order.</p>`,

    practice: [
      {
        q: `A teammate shows market share for 8 product lines as a 3-D pie chart with a rainbow palette and a side legend. Two slices look almost the same size and you can't tell which is bigger. List the design problems and the single best fix.`,
        steps: [
          { do: `Name the encoding problem: a pie encodes value as <b>angle/area</b>, the channels the eye reads worst, and 3-D distorts the slices further.`, why: `Cleveland&ndash;McGill show angle and area give large, biased reading errors; two near-equal slices become impossible to rank.` },
          { do: `Name the color problem: a rainbow has no order and likely isn't color-blind-safe; the legend forces the eye to bounce.`, why: `Color carries no real signal here, and red&ndash;green pairs vanish for color-blind readers.` },
          { do: `Replace it with a single sorted bar chart, direct-labeled with the share values, one accent color, no 3-D.`, why: `Length on a common axis is read accurately, sorting makes rank instant, and direct labels remove the legend hunt.` }
        ],
        answer: `<p>Problems: value is encoded by <b>angle/area</b> (a pie), worsened by <b>3-D</b>, with a <b>rainbow, non-color-blind-safe</b> palette and a <b>legend</b> the eye must jump to. The single best fix is a <b>sorted, direct-labeled bar chart</b> &mdash; length on a shared axis is the most accurate encoding, sorting reveals rank instantly, and printing the values kills the legend. Drop the 3-D and the rainbow.</p>`
      },
      {
        q: `You must color a choropleth-style bar chart by a value that ranges from $-40\\%$ to $+60\\%$ change. A colleague suggests a rainbow scale. Which palette family is correct and why?`,
        steps: [
          { do: `Identify that the quantity is centered on a meaningful zero (no change), with negatives and positives.`, why: `Whether a value is above or below zero is the message, so zero should be the visual midpoint.` },
          { do: `Reject the rainbow: it has no perceptual order and isn't color-blind-safe.`, why: `A rainbow implies arbitrary jumps and breaks for color-blind readers; it can't show "centered on zero".` },
          { do: `Choose a <b>diverging</b> palette (e.g. blue&ndash;white&ndash;orange) anchored at zero.`, why: `Two hues meeting at a neutral midpoint map naturally to negative vs positive, and orange&ndash;blue is color-blind-safe.` }
        ],
        answer: `<p>Use a <b>diverging</b> palette anchored at zero (for example blue for negative, neutral at $0$, orange for positive) &mdash; the quantity is centered on a meaningful midpoint, so the colors should be too. A <b>sequential</b> ramp would be right for a $0$-to-max quantity, and a <b>categorical</b> palette for unordered groups; a rainbow is wrong on both order and accessibility.</p>`
      },
      {
        q: `Your bar chart distinguishes "treatment" from "control" only by a red bar and a green bar, with no labels. Why is this risky, and what two small changes fix it?`,
        steps: [
          { do: `Spot that color is the <b>only</b> channel separating the two groups.`, why: `If color fails, the reader cannot tell the groups apart at all.` },
          { do: `Note that red&ndash;green is the most common color-blindness pairing, and printouts may be grayscale.`, why: `Roughly 1 in 12 men can't reliably separate red from green; the chart would be meaningless to them.` },
          { do: `Add a redundant cue &mdash; direct text labels on each bar &mdash; and switch to a color-blind-safe pair.`, why: `Now the distinction survives without color, and the colors are readable for everyone.` }
        ],
        answer: `<p>It relies on <b>color alone</b>, using the <b>red&ndash;green</b> pair that is invisible to the most common color blindness (and to a grayscale printout). Two fixes: (1) add a <b>redundant non-color cue</b> &mdash; direct text labels (or different hatching/markers) on each bar &mdash; so the groups are distinguishable without color, and (2) swap red&ndash;green for a <b>color-blind-safe</b> pair such as orange and blue.</p>`
      }
    ]
  });

  window.CODE["dw-effective-visuals"] = {
    lib: "matplotlib + seaborn",
    runnable: false,
    explain:
      `<p>A <b>before &rarr; after</b> on one real chart. We take the seven average chemical readings for
       class-0 wines from <code>sklearn.datasets.load_wine</code> and draw them twice: first the
       <b>cluttered matplotlib default</b> (unsorted bars, rainbow colors, full grid, heavy spines, a vague
       title, no value labels), then the <b>cleaned</b> version &mdash; bars sorted by value, spines and
       grid removed, a single color-blind-safe accent on the bar that carries the message, direct value
       labels instead of a legend, and a title that states the takeaway. Same data, same numbers; only the
       ink and the order change. Runs as-is once <code>seaborn</code> is installed.</p>`,
    code: `import numpy as np
import matplotlib.pyplot as plt
import seaborn as sns
from sklearn.datasets import load_wine

# --- real, bundled data: mean chemistry of class-0 wines ---
wine = load_wine(as_frame=True)
df = wine.frame
feats = ['alcohol', 'malic_acid', 'ash', 'total_phenols',
         'flavanoids', 'color_intensity', 'hue']
means = df[df.target == 0][feats].mean()   # a pandas Series, label -> value

fig, (ax_bad, ax_good) = plt.subplots(1, 2, figsize=(13, 5))

# ============ BEFORE: the cluttered default ============
# Unsorted (dataframe order), a different rainbow color per bar,
# full grid, every spine, a vague title, no value labels.
rainbow = plt.cm.rainbow(np.linspace(0, 1, len(means)))
ax_bad.bar(means.index, means.values, color=rainbow)
ax_bad.grid(True)                          # chart junk: gridlines
ax_bad.set_title('Wine features')          # vague, no takeaway
plt.setp(ax_bad.get_xticklabels(), rotation=90)   # cramped labels

# ============ AFTER: decluttered, sorted, labeled ============
s = means.sort_values(ascending=False)     # sort bars by value
# one muted base color, a single color-blind-safe accent on the top bar
base = '#bdbdbd'
accent = sns.color_palette('colorblind')[1]        # safe orange
colors = [accent if i == 0 else base for i in range(len(s))]

bars = ax_good.barh(s.index[::-1], s.values[::-1], color=colors[::-1])
ax_good.set_xlabel('mean value')           # units / axis label
ax_good.set_title('Alcohol dominates the average chemistry of class-0 wines',
                  loc='left')              # title states the conclusion

# direct value labels at the end of each bar -> no legend, no grid needed
for bar, v in zip(bars, s.values[::-1]):
    ax_good.text(v + 0.1, bar.get_y() + bar.get_height() / 2,
                 f'{v:.2f}', va='center')

# remove chart junk: drop the top/right (and here all) spines and the grid
sns.despine(ax=ax_good, left=True, bottom=True)
ax_good.tick_params(left=False, bottom=False)
ax_good.set_xticks([])

plt.tight_layout()
plt.show()`
  };

  window.CODEVIZ["dw-effective-visuals"] = {
    question: "Take seven real numbers (the mean chemistry of class-0 wines) and draw them the cluttered default way vs the cleaned way. Does the cleaned chart let you read the ranking faster?",
    charts: [
      {
        type: "bars",
        title: "BEFORE — default: unsorted bars, rainbow colors (where is the biggest value?)",
        xlabel: "feature (dataframe order)",
        ylabel: "mean value",
        labels: ["alcohol", "malic_acid", "ash", "total_phenols", "flavanoids", "color_intensity", "hue"],
        values: [13.74, 2.01, 2.46, 2.84, 2.98, 5.53, 1.06],
        valueLabels: ["13.74", "2.01", "2.46", "2.84", "2.98", "5.53", "1.06"],
        colors: ["#9400d3", "#4b0082", "#0000ff", "#00ff00", "#ffff00", "#ff7f00", "#ff0000"]
      },
      {
        type: "bars",
        title: "AFTER — sorted, one accent color, direct value labels (the message lands instantly)",
        xlabel: "feature (sorted by value)",
        ylabel: "mean value",
        labels: ["alcohol", "color_intensity", "flavanoids", "total_phenols", "ash", "malic_acid", "hue"],
        values: [13.74, 5.53, 2.98, 2.84, 2.46, 2.01, 1.06],
        valueLabels: ["13.74", "5.53", "2.98", "2.84", "2.46", "2.01", "1.06"],
        colors: ["#de8f05", "#bdbdbd", "#bdbdbd", "#bdbdbd", "#bdbdbd", "#bdbdbd", "#bdbdbd"]
      }
    ],
    caption: "Real numbers from load_wine (mean of 7 chemical features for the 59 class-0 wines). LEFT is the cluttered default: bars sit in dataframe order and a rainbow palette implies an order that isn't there, so the eye must scan all seven to find the largest. RIGHT is the same data cleaned: bars sorted largest-to-smallest (alcohol 13.74 down to hue 1.06), every bar a muted gray except the accent on alcohol (the message), and values printed directly so no grid or legend is needed. Identical numbers — only the encoding and order changed.",
    code: `import numpy as np
from sklearn.datasets import load_wine

# 178 real wines, 13 chemical features; take the 59 class-0 wines
wine = load_wine(as_frame=True)
df = wine.frame
feats = ['alcohol', 'malic_acid', 'ash', 'total_phenols',
         'flavanoids', 'color_intensity', 'hue']

means = df[df.target == 0][feats].mean()
print('default (dataframe) order:')
print(means.round(2).to_dict())
# -> {'alcohol': 13.74, 'malic_acid': 2.01, 'ash': 2.46, 'total_phenols': 2.84,
#     'flavanoids': 2.98, 'color_intensity': 5.53, 'hue': 1.06}

print('sorted by value (what the cleaned chart shows):')
print(means.sort_values(ascending=False).round(2).to_dict())
# -> {'alcohol': 13.74, 'color_intensity': 5.53, 'flavanoids': 2.98,
#     'total_phenols': 2.84, 'ash': 2.46, 'malic_acid': 2.01, 'hue': 1.06}`
  };
})();
