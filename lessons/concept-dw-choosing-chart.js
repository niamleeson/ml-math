/* Data Wrangling — "Choosing the right chart".
   Self-contained: lesson + CODE + CODEVIZ merged by id "dw-choosing-chart". */
(function () {
  window.LESSONS.push({
    id: "dw-choosing-chart",
    title: "Choosing the right chart",
    tagline: "Pick the chart from the question you are answering and the data type — not from habit.",
    module: "Data Wrangling",
    prereqs: ["dw-data-types", "met-distribution", "met-association"],

    whenToUse:
      `<p><b>Every single time you make a figure.</b> Before you reach for the plotting function, stop and
       ask two questions:</p>
       <ol>
         <li><b>What question am I answering?</b> This is the chart's <i>intent</i>. There are five common ones:
           <b>comparison</b> (which category is bigger?), <b>distribution</b> (how is one number spread out?),
           <b>relationship</b> (do two numbers move together?), <b>composition</b> (how does a whole split into
           parts?), and <b>trend</b> (how does a number change over time?).</li>
         <li><b>What type is my data?</b> Is each variable <b>categorical</b> (a label like "red"/"blue"),
           <b>numeric</b> (a measured number), <b>time</b> (a date), or <b>geo</b> (a place)? And <b>how many
           variables</b> am I showing at once — one, two, or more?</li>
       </ol>
       <p>The intent plus the data type picks the chart for you. The table below is the whole decision.</p>
       <table>
         <tr><th>Intent (your question)</th><th>Data type</th><th>Right chart</th></tr>
         <tr><td><b>Comparison</b> — which is bigger?</td><td>1 categorical + 1 numeric</td><td>Bar chart (dot plot if many bars)</td></tr>
         <tr><td><b>Distribution</b> — how is it spread?</td><td>1 numeric</td><td>Histogram, box plot, violin, or ECDF</td></tr>
         <tr><td><b>Relationship</b> — do they move together?</td><td>2 numeric</td><td>Scatter plot (heatmap for many points)</td></tr>
         <tr><td><b>Composition</b> — parts of a whole</td><td>1 categorical + 1 numeric</td><td>Stacked bar or treemap (rarely a pie)</td></tr>
         <tr><td><b>Trend</b> — change over time</td><td>time + 1 numeric</td><td>Line chart</td></tr>
       </table>
       <p>ECDF means <b>Empirical Cumulative Distribution Function</b> — a curve that, for each value on the
       x-axis, shows the fraction of the data at or below it.</p>`,

    application:
      `<p>Choosing the chart well is the last step of data wrangling: you have cleaned and understood the
       data, and now you present it.</p>
       <ul>
         <li><b>EDA (Exploratory Data Analysis).</b> A histogram tells you a column is skewed; a scatter tells
         you two features are correlated; a box plot per group tells you which group is unusual. The chart
         <i>is</i> the analysis.</li>
         <li><b>Reports and dashboards.</b> A bar chart ranks regions by revenue; a line chart shows the metric
         over the quarter. Picking the intent-correct chart is what makes a dashboard readable at a glance.</li>
         <li><b>Model diagnostics.</b> A scatter of predicted-versus-actual checks a regression; a histogram of
         residuals checks for skew. Same rule: pick by the question and the data type.</li>
       </ul>`,

    pitfalls:
      `<ul>
         <li><b>Pie chart with many or similar slices.</b> The human eye reads <b>length</b> well and
         <b>angle/area</b> badly. With more than about three slices, or slices of similar size, a pie becomes
         unreadable. <i>Fix:</i> use a <b>bar chart</b> — sorted bars on a shared baseline are far easier to
         rank and compare. A bar chart almost always beats a pie.</li>
         <li><b>Dual-y-axis charts implying false correlation.</b> Two unrelated series drawn on two different
         y-axes can be made to "line up" by sliding the axes — suggesting a relationship that is not there.
         <i>Fix:</i> use two stacked panels with shared x, or index both series to a common baseline, or make a
         direct scatter of one against the other.</li>
         <li><b>3-D and exotic charts.</b> 3-D bars, donuts, radar/spider charts, and word clouds distort
         length and hide values behind perspective. <i>Fix:</i> a plain 2-D bar, line, or scatter shows the
         same data more accurately.</li>
         <li><b>Wrong chart for the data type.</b> A single mean <b>bar</b> for a numeric column hides its
         <b>spread</b> — the whole point of a distribution. <i>Fix:</i> show distributions with a histogram,
         box, violin, or ECDF, never a lone bar of the mean.</li>
         <li><b>Too many series.</b> A line chart with fifteen overlapping lines ("spaghetti") is noise.
         <i>Fix:</i> highlight one or two lines and grey the rest, or split into small multiples (a grid of
         small charts, one per series).</li>
         <li><b>Chart-by-default instead of by-question.</b> Reaching for whatever chart you made last time is
         the root mistake. <i>Fix:</i> always start from intent + data type, then read the table.</li>
       </ul>`,

    bigIdea:
      `<p>A chart is an answer to a <b>question</b>, drawn with <b>position and length</b> that the eye can
       read. The same dataset can answer several different questions, and each question wants a different
       chart. So you never pick a chart for a dataset — you pick a chart for a <b>(question, data type)</b>
       pair.</p>
       <p>Map your question to one of five <b>intents</b> — comparison, distribution, relationship, composition,
       trend — then look at the <b>types</b> of the variables involved (categorical, numeric, time, geo) and
       <b>how many</b> there are. That pair lands you on exactly one chart family. The skill is mechanical once
       you name the intent and the types honestly.</p>`,

    buildup:
      `<p>Walk the five intents one at a time. Notice each is defined by a question and a data shape.</p>
       <ul>
         <li><b>Comparison.</b> Question: "which category has the biggest value?" Data: one <b>categorical</b>
         axis (the labels) and one <b>numeric</b> axis (the value). Chart: a <b>bar chart</b>, sorted by value.
         If you have many categories, a <b>dot plot</b> (one dot per category on a line) is cleaner than a
         forest of bars.</li>
         <li><b>Distribution.</b> Question: "how is this one number spread out — center, width, skew,
         outliers?" Data: one <b>numeric</b> column. Charts: a <b>histogram</b> (bars over value ranges), a
         <b>box plot</b> (median + quartiles + outliers), a <b>violin</b> (a smoothed shape), or an <b>ECDF</b>
         (the cumulative curve). Box and violin shine when you compare the distribution <i>across groups</i>.</li>
         <li><b>Relationship.</b> Question: "do these two numbers move together?" Data: two <b>numeric</b>
         columns. Chart: a <b>scatter plot</b> (one point per row). Add a third variable with color (a
         <b>bubble</b> chart uses dot size). With thousands of overlapping points, a 2-D <b>heatmap</b> of
         density reads better than a black blob.</li>
         <li><b>Composition (part-to-whole).</b> Question: "how does a total break into parts?" Data: one
         <b>categorical</b> split and one <b>numeric</b> total. Charts: a <b>stacked bar</b> (parts stacked to
         the whole) or a <b>treemap</b> (nested rectangles sized by value). A <b>pie</b> is the famous default
         here, but bars beat it for all but two or three slices.</li>
         <li><b>Trend.</b> Question: "how does this number change over time?" Data: a <b>time</b> axis and a
         <b>numeric</b> value. Chart: a <b>line chart</b> — the connected line is what tells the eye "this is a
         sequence in time", which a bar chart does not.</li>
       </ul>`,

    symbols: [],

    derivation:
      `<p><b>Why position and length beat angle and area.</b></p>
       <ul class="steps">
         <li>Decades of perception studies (Cleveland and McGill, 1984) ranked how accurately people decode
         visual channels. People judge <b>position on a common scale</b> (bars on a shared baseline, points on
         an axis) most accurately, then <b>length</b>, then <b>angle</b>, then <b>area</b>, then <b>color/volume</b>
         worst.</li>
         <li>A <b>bar chart</b> encodes value as position-and-length on a common baseline — the most accurate
         channel. A <b>pie chart</b> encodes value as angle and area — two of the worst. That is the whole reason
         "bar usually beats pie": same data, but the bar uses a channel the eye reads precisely.</li>
         <li>A <b>scatter</b> encodes two numbers as position in the plane — again the most accurate channel —
         which is why it is the default for a relationship. A <b>line</b> adds one thing a scatter lacks: the
         connecting segments assert <b>order</b>, so it is reserved for an ordered axis like time.</li>
         <li>A <b>3-D</b> chart forces the eye to decode <b>volume and perspective</b>, near the bottom of the
         accuracy list, and lets near bars hide far ones. So 3-D almost always <i>lowers</i> accuracy for no
         gain. $\\blacksquare$</li>
       </ul>`,

    example:
      `<p>You have one small table: monthly sales of three products. The <i>same table</i> answers four
       different questions, each wanting a different chart.</p>
       <ul class="steps">
         <li><b>"Which product sold the most overall?"</b> — that is a <b>comparison</b> of one number across a
         categorical label. Sum each product and draw <b>three bars</b>, sorted. The tallest bar is the answer.</li>
         <li><b>"How spread out are the monthly sales values?"</b> — that is a <b>distribution</b> of one numeric
         column. Draw a <b>histogram</b> of all the monthly numbers. A single mean bar would hide whether the
         months are tightly clustered or all over the place.</li>
         <li><b>"Do high-ad-spend months have high sales?"</b> — that is a <b>relationship</b> between two numeric
         columns. Draw a <b>scatter</b> of ad-spend (x) versus sales (y). An upward cloud answers "yes".</li>
         <li><b>"How did total sales change through the year?"</b> — that is a <b>trend</b> over time. Draw a
         <b>line</b> of total sales by month. The line's slope is the answer.</li>
       </ul>
       <p>One dataset, four questions, four charts. You never asked "what chart fits this table" — you asked
       "what question, what data type", four times.</p>`,

    practice: [
      {
        q: `A teammate shows market share for 9 brands as a pie chart. The three biggest slices look nearly the same size and you cannot tell which brand leads. What is wrong, and what chart fixes it?`,
        steps: [
          { do: `Name the intent: ranking which brand is biggest is a <b>comparison</b>.`, why: `Comparison wants a chart that encodes value as length on a common baseline.` },
          { do: `Diagnose the pie: 9 slices, several similar in size, encoded as angle and area.`, why: `The eye reads angle and area poorly, so similar slices are indistinguishable — the pitfall of pies with many or similar slices.` },
          { do: `Switch to a <b>bar chart</b>, one bar per brand, sorted from largest to smallest.`, why: `Sorted bars on a shared baseline use position and length, the most accurate channel, so the ranking is obvious.` }
        ],
        answer: `<p>It is a <b>pie with too many similar slices</b>. The intent is <b>comparison</b>, which wants length on a common baseline, but a pie encodes value as angle and area — the channels the eye reads worst. Replace it with a <b>sorted bar chart</b> (or a dot plot), where the leading brand is the tallest bar.</p>`
      },
      {
        q: `You want to report a sensor's readings and you draw one bar showing the mean reading. A reviewer says the bar "hides the data". What did the bar miss, and which charts should you use instead?`,
        steps: [
          { do: `Name the intent: showing how the readings are spread is a <b>distribution</b> question over one numeric column.`, why: `A distribution is about center, width, skew, and outliers — not a single summary number.` },
          { do: `See why a mean bar fails: it collapses the whole column to one height.`, why: `Two very different spreads (tight vs wide, symmetric vs skewed) can have the identical mean, so the bar hides exactly what you wanted to show.` },
          { do: `Use a <b>histogram</b> (or box plot / violin / ECDF) of the readings.`, why: `These show the full shape — width, skew, and outliers — which is the point of a distribution.` }
        ],
        answer: `<p>A single mean <b>bar</b> shows only the center and <b>hides the spread</b> — width, skew, and outliers — which is the entire question for a <b>distribution</b>. Use a <b>histogram</b>, <b>box plot</b>, <b>violin</b>, or <b>ECDF</b> instead. This is the "wrong chart for the data type" pitfall: a bar is for comparison, not for a distribution.</p>`
      },
      {
        q: `For each question, name the intent and the right chart: (a) "Do taller players score more points?" (b) "How did daily active users change over the last 90 days?" (c) "How does our budget split across 4 departments?"`,
        steps: [
          { do: `(a) Two numeric columns, asking if they move together — that is a <b>relationship</b>.`, why: `A relationship between two numerics is a scatter plot: each player is one point.` },
          { do: `(b) A numeric value over a time axis — that is a <b>trend</b>.`, why: `A trend over time is a line chart; the connected line asserts the time order.` },
          { do: `(c) A total split into a few categorical parts — that is a <b>composition</b>.`, why: `Part-to-whole with only 4 parts is fine as a stacked bar (or even a pie), but a plain bar per department is clearest.` }
        ],
        answer: `<p>(a) <b>Relationship</b> → <b>scatter</b> of height vs points. (b) <b>Trend</b> → <b>line</b> chart of daily active users over the 90 days. (c) <b>Composition</b> → <b>stacked bar</b> or a small <b>bar chart</b> per department (only 4 parts, so a pie would also work, but bars rank them more clearly).</p>`
      }
    ]
  });

  window.CODE["dw-choosing-chart"] = {
    lib: "matplotlib + seaborn",
    runnable: false,
    explain: `<p>A small "chart chooser" on one dataset — the <b>tips</b> dataset that ships with seaborn
      (<code>sns.load_dataset('tips')</code>): each row is a restaurant bill, with the total bill, the tip, the
      day, and the party size. The same table is shown four ways, once per intent: a <b>distribution</b> as a
      histogram, a <b>comparison</b> as a bar, a <b>relationship</b> as a scatter, and a <b>trend</b> as a line.
      Run it after <code>pip install seaborn matplotlib</code>; the dataset is bundled with seaborn, so nothing
      to download.</p>`,
    code: `import seaborn as sns
import matplotlib.pyplot as plt

tips = sns.load_dataset("tips")   # bundled: one row per restaurant bill
fig, ax = plt.subplots(2, 2, figsize=(11, 8))

# --- DISTRIBUTION: how is one numeric column spread out? -> histogram ---
sns.histplot(tips, x="total_bill", bins=20, ax=ax[0, 0])
ax[0, 0].set_title("Distribution -> histogram of total_bill")

# --- COMPARISON: which category is bigger? -> bar chart (sorted) ---
by_day = tips.groupby("day", observed=True)["total_bill"].mean().sort_values()
sns.barplot(x=by_day.values, y=by_day.index, orient="h", ax=ax[0, 1])
ax[0, 1].set_title("Comparison -> bar of mean bill per day")

# --- RELATIONSHIP: do two numbers move together? -> scatter ---
sns.scatterplot(tips, x="total_bill", y="tip", ax=ax[1, 0])
ax[1, 0].set_title("Relationship -> scatter of tip vs total_bill")

# --- TREND: how does a number change along an ordered axis? -> line ---
# party size is an ordered axis here; mean tip rises with it.
by_size = tips.groupby("size", observed=True)["tip"].mean()
ax[1, 1].plot(by_size.index, by_size.values, marker="o")
ax[1, 1].set_title("Trend -> line of mean tip vs party size")
ax[1, 1].set_xlabel("size"); ax[1, 1].set_ylabel("tip")

plt.tight_layout()
plt.show()
# Same dataset, four intents, four charts -- each chart matches its question + data type.`
  };

  window.CODEVIZ["dw-choosing-chart"] = {
    question: "To show how the 'mean radius' of breast-cancer cells is spread out, do you draw the distribution (the right chart) or one of the wrong-chart traps? Learn to read each so you can spot the mismatch.",
    charts: [
      {
        type: "bars",
        title: "RIGHT — histogram answers a DISTRIBUTION question",
        xlabel: "mean radius (binned)",
        ylabel: "count of cells",
        labels: ["7.7–9.7", "9.7–11.7", "11.7–13.7", "13.7–15.7", "15.7–17.7", "17.7–19.7", "19.7–21.8"],
        values: [5, 9, 19, 12, 4, 5, 6],
        valueLabels: ["5", "9", "19", "12", "4", "5", "6"],
        colors: ["#7ee787", "#7ee787", "#7ee787", "#7ee787", "#7ee787", "#7ee787", "#7ee787"],
        interpret: "The x-axis is the value of mean radius cut into ranges; each bar's height is how many cells fall in that range. Read it left to right as a shape: most cells sit near 11.7–13.7, then the count tails off, with a small second bump of large cells out near 20. Because the bars span the whole range you can SEE the width, the skew, and the outlying tail. This is the matching chart for a distribution question (1 numeric column), and the numbers are real (60 cells from load_breast_cancer)."
      },
      {
        type: "bars",
        title: "WRONG — one mean bar: a comparison chart used for a distribution",
        xlabel: "summary",
        ylabel: "mean radius",
        labels: ["mean radius (mean = 14.1)"],
        values: [14.1],
        valueLabels: ["14.1"],
        colors: ["#ff7b72"],
        interpret: "Here a single bar shows just the mean (14.1) of the same 60 cells. A bar encodes one number as a height — that is a COMPARISON chart, fine for ranking categories, but here it collapses all 60 values into one number. You cannot see the width, the skew, or the large-radius tail that the histogram showed: the spread, which is the whole question, is gone. The giveaway that you picked the wrong chart: a lone bar for a numeric column you were asked to describe."
      },
      {
        type: "bars",
        title: "WRONG — pie-style: 9 near-equal market shares (illustrative)",
        xlabel: "brand",
        ylabel: "share (%)",
        labels: ["A", "B", "C", "D", "E", "F", "G", "H", "I"],
        values: [13, 12, 12, 11, 11, 11, 10, 10, 10],
        valueLabels: ["13", "12", "12", "11", "11", "11", "10", "10", "10"],
        colors: ["#ffb454", "#ffb454", "#ffb454", "#ffb454", "#ffb454", "#ffb454", "#ffb454", "#ffb454", "#ffb454"],
        interpret: "Illustrative numbers. This is a COMPARISON question — which brand leads? — and these nine shares are nearly equal (10–13%). Drawn as a pie, the slices would be almost identical angles and you could not tell which leads, because the eye reads angle and area badly. Even as bars the values are close, but the shared baseline lets you line their tops up and rank them. The lesson: with many or similar parts, a pie hides the very ranking it is supposed to show — use sorted bars."
      },
      {
        type: "line",
        title: "WRONG — dual-axis trap: two unrelated series made to 'line up' (illustrative)",
        xlabel: "month",
        ylabel: "rescaled value (two different axes)",
        series: [
          { name: "ice-cream sales", color: "#4ea1ff", points: [[1, 10], [2, 14], [3, 22], [4, 35], [5, 52], [6, 68]] },
          { name: "shark attacks (other axis)", color: "#ff7b72", points: [[1, 11], [2, 13], [3, 24], [4, 33], [5, 54], [6, 66]] }
        ],
        interpret: "Illustrative. Two series rise together over the months and look tightly linked — but they sit on TWO different y-axes, each stretched so the lines overlap. By sliding the axes you can make almost any two rising series 'track' each other; the apparent correlation is an artifact of the scaling, not the data (ice-cream and shark attacks share a hidden cause, summer, not a real link). When you see a dual-axis chart, distrust the overlap: redraw as a direct scatter of one against the other, or as two stacked panels on a shared x."
      }
    ],
    caption: "One right chart and three wrong-chart traps for the same kind of task. RIGHT: a histogram answers a distribution question (real numbers, load_breast_cancer 'mean radius', 60 cells). WRONG #1: a single mean bar collapses those 60 values to one height (14.1) and hides spread/skew/tail. WRONG #2: nine near-equal shares as a pie are unrankable because the eye reads angle/area poorly — sorted bars fix it. WRONG #3: a dual-y-axis line makes two unrelated series appear correlated by sliding the axes. Match the chart to the (question, data type) pair, and learn to recognise the traps when someone else hands you one.",
    code: `import numpy as np
from sklearn.datasets import load_breast_cancer

d = load_breast_cancer()                         # 569 real cell-nucleus measurements
fi = list(d.feature_names).index('mean radius')
radius = d.data[:, fi]

rng = np.random.RandomState(0)
radius = radius[rng.choice(len(radius), 60, replace=False)]   # subsample to 60

# WRONG chart: a single mean bar collapses everything to one number.
print('mean radius          :', round(radius.mean(), 1))   # -> 14.1  (hides the spread)

# RIGHT chart: a histogram keeps the full shape.
edges = np.linspace(radius.min(), radius.max(), 8)
occ = np.histogram(radius, bins=edges)[0]
print('histogram bin edges  :', np.round(edges, 1))         # -> [ 7.7  9.7 11.7 13.7 15.7 17.7 19.7 21.8]
print('histogram counts     :', occ)             # -> [ 5  9 19 12  4  5  6]
print('min / max            :', round(radius.min(), 1), '/', round(radius.max(), 1))   # -> 7.7 / 21.8`
  };
})();
