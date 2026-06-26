/* Data Wrangling — "When a well-designed table beats a chart".
   Self-contained: lesson + CODE + CODEVIZ merged by id "dw-tables". */
(function () {
  window.LESSONS.push({
    id: "dw-tables",
    title: "Tables done right: when a table beats a chart",
    tagline: "For exact values, lookups, and small mixed-unit summaries, a styled table reads better than any plot.",
    module: "Data Wrangling",
    prereqs: [],

    bigIdea:
      `<p>A chart is for <b>seeing a shape</b> &mdash; a trend, a cluster, an outlier. A <b>table</b> is for
       <b>reading a value</b> &mdash; the exact number in a known cell. They answer different questions, and
       reaching for a chart when the reader actually wants a number (or the reverse) makes the work harder to
       use, not easier.</p>
       <p>Reach for a table when: <b>exact values matter</b> (a price, a count, a p-value), the reader will
       <b>look up</b> one row, the summary is <b>small and multi-dimensional</b> (a few groups by a few
       metrics), or the columns have <b>mixed units</b> (dollars next to percentages next to days) that no
       single axis can carry.</p>
       <p>The catch: a <b>raw</b> table dumped on the reader &mdash; thousands of rows, ragged decimals,
       left-aligned numbers, no order &mdash; is worse than no table. A <b>well-designed</b> table is a tiny
       summary, formatted so the eye lands on the answer in a second. This lesson is the design rules and the
       tools (<code>pandas</code> <code>Styler</code>, great-tables) that produce one.</p>`,

    buildup:
      `<p>A presentation-ready table follows a short, almost mechanical checklist. Each rule removes one way
       the reader can get lost.</p>
       <ul>
         <li><b>Right-align numbers.</b> Digits line up by place value, so $1{,}115$ and $519$ stack with
         their hundreds, tens, and ones in the same columns. The eye compares magnitudes at a glance. Left
         text, right numbers.</li>
         <li><b>Consistent decimals / significant figures.</b> Pick one format per column &mdash; e.g. two
         decimals &mdash; so <code>2.98</code>, <code>2.08</code>, <code>0.78</code> sit in a clean grid. A
         ragged <code>2.9817</code> next to <code>2.1</code> forces re-reading.</li>
         <li><b>Units in the header, not every cell.</b> Write <code>price ($)</code> or
         <code>latency (ms)</code> once at the top; the cells hold bare numbers. Mixed units become legible
         because each column declares its own.</li>
         <li><b>Sort meaningfully.</b> Order rows by the column the reader cares about (biggest first,
         alphabetical, chronological) &mdash; never leave them in arbitrary load order.</li>
         <li><b>Group and space rows.</b> Blank lines or subheaders between groups, and a little row padding,
         turn a dense block into scannable chunks.</li>
         <li><b>Summary row.</b> A total / mean / count row (clearly set off) gives the reader the
         bottom-line number without doing arithmetic.</li>
         <li><b>In-cell emphasis.</b> This is the table's version of a chart's ink. <b>Bold the key number</b>
         in each row. Use <b>conditional formatting</b> to guide the eye: a <b>color scale</b> (heatmap
         shading) so high values glow and low values fade, or <b>data bars</b> drawn inside the cell so the
         column doubles as a tiny bar chart. The shading <i>is</i> the chart, laid over the exact numbers.</li>
       </ul>
       <p>Do all of this and the table stops being a data dump: it becomes a small, sorted, color-guided
       summary that the reader trusts and uses.</p>`,

    whenToUse:
      `<p><b>Use a table when the reader wants a value; use a chart when they want a pattern.</b></p>
       <ul>
         <li><b>Exact values matter.</b> A price, a row count, a revenue figure, a p-value &mdash; anything
         someone will quote, copy, or audit. A chart makes them estimate off an axis; a table gives the
         number.</li>
         <li><b>Lookups.</b> "What was region <code>West</code>'s churn?" The reader scans to one row and
         reads one cell. A scatter of all regions buries that answer.</li>
         <li><b>Small multi-dimensional summaries.</b> A handful of groups crossed with a handful of metrics
         (3 wine classes by 5 chemistry features) is a perfect compact grid &mdash; small enough to read,
         structured enough that a chart would need several panels.</li>
         <li><b>Mixed units.</b> Dollars, percentages, and days side by side. One chart axis can't hold three
         units; a table gives each column its own header unit.</li>
         <li><b>Dashboards and reports, alongside charts.</b> The usual best layout is a chart for the shape
         <i>and</i> a small table for the exact numbers &mdash; not one or the other.</li>
       </ul>
       <p>Flip it the other way for: a <b>distribution</b>, a <b>trend over time</b>, a <b>correlation</b>, or
       <b>many</b> rows where the point is the overall shape. Those are chart jobs; a table of 500 rows hides
       the pattern a single plot would reveal.</p>`,

    application:
      `<p>Well-designed tables are everywhere data gets reported, not just plotted.</p>
       <ul>
         <li><b>Executive reports.</b> A KPI (Key Performance Indicator) table &mdash; this quarter vs last,
         with the change column color-scaled green/red &mdash; is the artifact leadership actually reads.</li>
         <li><b>Model evaluation.</b> A metrics-by-class or metrics-by-segment table (precision, recall, F1,
         support) is the standard way to report a classifier; the numbers must be exact and comparable.</li>
         <li><b>EDA (Exploratory Data Analysis) summaries.</b> A <code>groupby</code> aggregation styled with
         a color gradient lets you eyeball which group is high on which feature before drawing a single
         chart.</li>
         <li><b>Dashboards.</b> Tools like great-tables and <code>pandas</code> <code>Styler</code> render
         publication-quality tables with data bars and heatmap shading straight into a report or notebook.</li>
       </ul>`,

    pitfalls:
      `<ul>
         <li><b>Dumping a huge raw table.</b> Pasting a 5,000-row, 40-column frame onto the reader is the
         classic failure &mdash; nobody can read it. <b>Fix:</b> aggregate to a small summary (a
         <code>groupby</code>), show the top-N, or replace it with a chart of the shape.</li>
         <li><b>Inconsistent decimals or units.</b> <code>2.9817</code> next to <code>2.1</code>, or dollars
         and cents mixed in one column. <b>Fix:</b> one number format per column (<code>.format()</code>),
         and units declared once in the header.</li>
         <li><b>Left-aligned numbers.</b> Place values no longer line up and magnitudes are hard to compare.
         <b>Fix:</b> right-align every numeric column.</li>
         <li><b>No sorting or grouping.</b> Rows in arbitrary load order force the reader to hunt. <b>Fix:</b>
         sort by the column that matters and group related rows.</li>
         <li><b>Using a table where a chart shows the pattern better.</b> A long table of a time series hides
         the trend a line plot makes obvious. <b>Fix:</b> match the form to the question &mdash; shape &rarr;
         chart, value &rarr; table.</li>
         <li><b>Too much color.</b> Shading every cell in clashing hues, or rainbow heatmaps, kills
         readability and hides the one number that matters. <b>Fix:</b> emphasize sparingly &mdash; bold the
         key value, use one calm sequential color scale, and let most cells stay plain.</li>
       </ul>`,

    derivation:
      `<p><b>Why a table can beat a chart &mdash; an information argument.</b></p>
       <ul class="steps">
         <li>A chart encodes a number as a <b>position</b> or <b>length</b> on an axis. To recover the value
         the reader must mentally project the mark back to the axis and read off a tick &mdash; a lossy,
         approximate decode. Great for <i>comparing</i> shapes, poor for <i>exact</i> values.</li>
         <li>A table encodes the number as <b>the number itself</b>. The decode is exact and instant: the
         reader reads the digits. No axis, no estimation.</li>
         <li>So for the question "what is the value in this cell?", the table is strictly more precise. For
         "what is the overall shape across many points?", the chart wins, because reading a hundred exact
         digits is slower than seeing one curve.</li>
         <li>In-cell emphasis lets a table borrow the chart's strength without losing its own: a <b>color
         scale</b> or <b>data bar</b> overlays a positional/length encoding <i>on top of</i> the exact digits.
         The reader gets the shape (which cells are high) <i>and</i> the value (the printed number) at once.
         That is why a styled summary table is often the best of both. $\\blacksquare$</li>
       </ul>`,

    example:
      `<p>Three wine classes, mean of two chemistry features each (real <code>load_wine</code> numbers,
       rounded). First the raw dump, then the designed version.</p>
       <p><b>Bad</b> &mdash; arbitrary order, ragged decimals, left-aligned, no units, no emphasis:</p>
       <ul>
         <li>class_1, 2.0824, 519.507</li>
         <li>class_2, 0.7814, 629.896</li>
         <li>class_0, 2.9824, 1115.71</li>
       </ul>
       <p><b>Good</b> &mdash; sorted by <code>proline</code> (high&rarr;low), two decimals for
       <code>flavanoids</code> and zero for <code>proline</code>, units in the header, the per-column max
       bolded, a mean row:</p>
       <table style="border-collapse:collapse">
         <tr><th style="text-align:left;padding:2px 10px">wine class</th>
             <th style="text-align:right;padding:2px 10px">flavanoids</th>
             <th style="text-align:right;padding:2px 10px">proline (mg/L)</th></tr>
         <tr><td style="text-align:left;padding:2px 10px">class_0</td>
             <td style="text-align:right;padding:2px 10px"><b>2.98</b></td>
             <td style="text-align:right;padding:2px 10px"><b>1116</b></td></tr>
         <tr><td style="text-align:left;padding:2px 10px">class_2</td>
             <td style="text-align:right;padding:2px 10px">0.78</td>
             <td style="text-align:right;padding:2px 10px">630</td></tr>
         <tr><td style="text-align:left;padding:2px 10px">class_1</td>
             <td style="text-align:right;padding:2px 10px">2.08</td>
             <td style="text-align:right;padding:2px 10px">520</td></tr>
         <tr><td style="text-align:left;padding:2px 10px;border-top:1px solid #888"><i>mean</i></td>
             <td style="text-align:right;padding:2px 10px;border-top:1px solid #888"><i>2.03</i></td>
             <td style="text-align:right;padding:2px 10px;border-top:1px solid #888"><i>747</i></td></tr>
       </table>
       <p>Same numbers, but the good table is sorted, aligned, consistently rounded, unit-labelled, and the
       eye lands on <code>class_0</code> as the high-flavanoid, high-proline group without any chart.</p>`,

    practice: [
      {
        q: `A teammate pastes a 4,000-row dataframe of daily sales into the report "so the numbers are all there." Is a table the right call, and how would you fix it?`,
        steps: [
          { do: `Ask what the reader actually needs from those 4,000 rows.`, why: `Almost nobody reads 4,000 rows; the real question is usually a trend or a per-group total, not every cell.` },
          { do: `If the question is "how do sales trend over time," replace the table with a line chart.`, why: `A trend is a shape &mdash; a chart shows it instantly where a giant table hides it.` },
          { do: `If exact per-group numbers are needed, aggregate to a small styled summary (e.g. sales by region or month) and show that.`, why: `A small sorted, formatted summary table is readable and gives the exact values; the raw dump gives neither.` }
        ],
        answer: `<p>A 4,000-row raw dump is the classic table pitfall &mdash; it's neither readable nor useful. Decide by the <b>question</b>: if the reader wants the <b>trend</b>, that's a <b>chart</b> (line over time); if they want <b>exact per-group values</b>, aggregate with a <code>groupby</code> to a <b>small summary table</b> (sales by region/month), then sort it, fix the decimals, label the units, and color-scale the key column. Either way, the 4,000-row block does not belong in the report.</p>`
      },
      {
        q: `You have a small report comparing three regions on revenue ($), conversion rate (%), and average delivery time (days). Chart or table? Why?`,
        steps: [
          { do: `Count the dimensions: 3 groups by 3 metrics, and the metrics have different units.`, why: `A small group-by-metric grid with mixed units is the textbook case for a table, not a single chart axis.` },
          { do: `Note that exact values (a revenue figure, a percentage) will be quoted.`, why: `Quotable exact numbers favor a table; a chart would force estimation off an axis.` },
          { do: `Design it: right-align numbers, put $, %, and days in the headers, one decimal format per column, sort by revenue, color-scale each metric.`, why: `That makes the mixed-unit comparison legible and lets the eye find the strong/weak region per metric.` }
        ],
        answer: `<p>A <b>table</b>. It's a tiny multi-dimensional summary (3&times;3) with <b>mixed units</b> ($, %, days) that no single chart axis can carry, and the values are exact and quotable. Design it well: units in the headers, right-aligned numbers, one decimal format per column, sorted by revenue, with a calm color scale (or data bars) per metric so the strongest and weakest region pop without burying the numbers. If you also want the shape, add a small chart beside it &mdash; report tables and charts work together.</p>`
      },
      {
        q: `Someone styles a summary table by shading every cell in a bright rainbow gradient and bolding nothing. What's wrong, and what's the rule of thumb for in-cell emphasis?`,
        steps: [
          { do: `Notice that if every cell is loudly colored, no cell stands out.`, why: `Emphasis is relative &mdash; coloring everything is the same as coloring nothing, and it strains the eye.` },
          { do: `Notice a rainbow scale has no inherent order, so high-vs-low isn't obvious.`, why: `A sequential (single-hue, light&rarr;dark) scale maps magnitude monotonically; rainbow does not.` },
          { do: `Restyle: one calm sequential color scale per metric, and bold just the key number in each row.`, why: `Sparing, ordered emphasis guides the eye to the answer while the exact digits stay readable.` }
        ],
        answer: `<p>Over-coloring <b>kills readability</b>: if every cell shouts, nothing stands out, and a rainbow scale has no natural high&rarr;low order so it doesn't even encode magnitude. The rule of thumb is <b>emphasize sparingly</b> &mdash; <b>bold the one key number</b> per row, use a single <b>sequential</b> color scale (light&rarr;dark) per metric so big values read as "more," and leave most cells plain. The shading should guide the eye to the answer, not compete with the numbers it's printed over.</p>`
      }
    ]
  });

  window.CODE["dw-tables"] = {
    lib: "pandas",
    runnable: false,
    explain: `<p><code>pandas</code> <code>Styler</code> (the <code>.style</code> accessor) turns a plain summary
       frame into a presentation-ready table without leaving pandas. The recipe: build a small
       <code>groupby</code> aggregation, then chain styling &mdash; <code>.format()</code> to fix decimals and
       units per column, <code>.background_gradient()</code> for heatmap shading (a color scale),
       <code>.bar()</code> to draw in-cell data bars, <code>.highlight_max()</code> to flag the per-column
       winner, and <code>.hide(axis="index")</code> to drop the noisy index. The result renders as styled HTML
       in a notebook and exports cleanly to a report. For a publication-grade alternative, the
       <code>great_tables</code> package (<code>GT</code>) offers the same ideas with finer typographic
       control. <code>runnable:false</code> &mdash; run it in a notebook to see the colors.</p>`,
    code: `import pandas as pd
from sklearn.datasets import load_wine

# --- A real bundled dataset: wine chemistry, 178 rows, 13 features + class ---
wine = load_wine(as_frame=True)
df = wine.frame.copy()
df["wine_class"] = df["target"].map({0: "class_0", 1: "class_1", 2: "class_2"})

# === Step 1: a SMALL summary (groupby aggregation) — not a raw dump ===
feats = ["alcohol", "flavanoids", "color_intensity", "proline", "hue"]
summary = (
    df.groupby("wine_class")[feats]
      .mean()
      .sort_values("proline", ascending=False)   # sort meaningfully (high proline first)
      .reset_index()
)
# add a clearly-set-off summary row (the overall mean)
overall = df[feats].mean()
overall["wine_class"] = "mean (all)"
summary = pd.concat([summary, overall.to_frame().T[summary.columns]], ignore_index=True)

# === Step 2: STYLE it — decimals/units, color scale, data bars, max highlight ===
styled = (
    summary.style
      .format({                                   # consistent decimals + units per column
          "alcohol": "{:.2f}",
          "flavanoids": "{:.2f}",
          "color_intensity": "{:.2f}",
          "proline": "{:.0f}",                     # mg/L — whole numbers
          "hue": "{:.2f}",
      })
      # heatmap shading (a color scale) on the chemistry columns
      .background_gradient(cmap="Greens", subset=["flavanoids", "color_intensity"])
      # in-cell data bars: the column doubles as a tiny bar chart
      .bar(subset=["proline"], color="#9ecae1")
      # flag the per-column winner so the eye lands on it
      .highlight_max(subset=feats, color="#fff3b0")
      .set_caption("Mean wine chemistry by class — alcohol (%), proline (mg/L)")
      .hide(axis="index")                         # drop the noisy default index
)

# In a notebook this renders as a styled HTML table; export for a report with:
#   styled.to_html("wine_summary.html")
#   # or, for publication-quality output:
#   #   from great_tables import GT
#   #   GT(summary).fmt_number(columns=feats, decimals=2)
styled`
  };

  window.CODEVIZ["dw-tables"] = {
    question: "A styled summary table is a heatmap with the numbers printed on it. Here is the well-designed version, then two ways it goes wrong — over-coloured, and a raw dump where a chart would have won.",
    charts: [
      {
        type: "heatmap",
        title: "IDEAL: one calm color scale per column — shape AND exact value at once",
        rows: ["class_0 (n=59)", "class_1 (n=71)", "class_2 (n=48)"],
        cols: ["alcohol (%)", "flavanoids", "color_int", "hue", "proline (mg/L, /100)"],
        matrix: [
          [13.74, 2.98, 5.53, 1.06, 11.16],
          [12.28, 2.08, 3.09, 1.06, 5.20],
          [13.15, 0.78, 7.40, 0.68, 6.30]
        ],
        showVals: true,
        interpret: "Rows are the three wine classes, columns are five chemistry features, each cell is the real per-class mean from load_wine. Read it like a styled table: dark cells are big numbers, so your eye lands on the high values while the exact digits stay printed. <b>Conclude:</b> class_0 is the high-flavanoid, high-proline group; class_2 has the deepest color_intensity (7.40) but the palest flavanoids (0.78). This is the best-of-both a good styled table gives you. (proline is shown /100 so one shared scale spans all columns; a real Styler would shade each column on its own scale.)"
      },
      {
        type: "heatmap",
        title: "PITFALL — over-coloured: every cell loud, so nothing stands out (illustrative)",
        rows: ["class_0", "class_1", "class_2"],
        cols: ["alcohol", "flavanoids", "color_int", "hue", "proline"],
        matrix: [
          [0.95, 0.10, 0.80, 0.55, 0.98],
          [0.20, 0.90, 0.30, 0.60, 0.05],
          [0.70, 0.15, 0.95, 0.05, 0.50]
        ],
        showVals: true,
        interpret: "Illustrative shading (0–1) standing in for a clashing rainbow gradient applied to <b>every</b> cell. <b>How to recognise it:</b> there is no calm baseline — the whole grid screams, so no single number pops and your eye has nowhere to rest. A rainbow scale also has no natural low→high order, so colour no longer encodes magnitude. <b>Conclude:</b> emphasis is relative; colouring everything is the same as colouring nothing. Fix: one sequential (light→dark) scale per column, bold just the key number per row."
      },
      {
        type: "bars",
        title: "PITFALL — raw dump: 24 ragged rows where the reader only wanted the shape (illustrative)",
        xlabel: "row (one bar per raw record — unsorted, unaggregated)",
        ylabel: "daily sales ($)",
        labels: ["r1","r2","r3","r4","r5","r6","r7","r8","r9","r10","r11","r12","r13","r14","r15","r16","r17","r18","r19","r20","r21","r22","r23","r24"],
        values: [412, 388, 455, 470, 503, 498, 540, 560, 575, 610, 595, 640, 662, 655, 700, 720, 715, 760, 780, 775, 810, 845, 838, 880],
        interpret: "Illustrative: a 24-row table pasted in raw, one bar per record, nothing sorted or summarised. <b>How to recognise it:</b> many near-identical rows and no single quotable answer — you are forcing the reader to scan dozens of cells to feel a trend. <b>Conclude:</b> this is a chart job, not a table job. The numbers climb steadily, so a line over time would show that trend in one glance; a table this size only hides it. Match the form to the question — shape wants a chart, an exact value wants a small table."
      }
    ],
    code: `import numpy as np
import pandas as pd
from sklearn.datasets import load_wine

wine = load_wine(as_frame=True)
df = wine.frame.copy()
df["wine_class"] = df["target"].map({0: "class_0", 1: "class_1", 2: "class_2"})

feats = ["alcohol", "flavanoids", "color_intensity", "hue", "proline"]

# A small group-by-metric summary table: rows = wine classes, cols = features.
summary = df.groupby("wine_class")[feats].mean().round(2)
print(summary.to_string())
#            alcohol  flavanoids  color_intensity   hue  proline
# class_0      13.74        2.98             5.53  1.06  1115.71
# class_1      12.28        2.08             3.09  1.06   519.51
# class_2      13.15        0.78             7.40  0.68   629.90

print(df["wine_class"].value_counts().sort_index())   # 59 / 71 / 48

# For the heatmap (one shared color scale) divide proline by 100 so it
# shares a magnitude range with the other columns:
mat = summary.copy()
mat["proline"] = (mat["proline"] / 100).round(2)
print(mat.to_string())`
  };
})();
