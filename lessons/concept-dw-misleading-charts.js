/* Data Wrangling — "How charts lie".
   Self-contained: lesson + CODE + CODEVIZ merged by id "dw-misleading-charts". */
(function () {
  window.LESSONS.push({
    id: "dw-misleading-charts",
    title: "How charts lie (and how not to get fooled)",
    tagline: "A chart can tell the truth about the numbers and still mislead the eye — here are the classic tricks and the honest fix for each.",
    module: "Data Wrangling",
    prereqs: ["dw-eda-workflow", "met-distribution", "met-association"],

    whenToUse:
      `<p>Reach for this checklist <b>every time you look at a chart</b> &mdash; one you are about
       to publish, and one someone hands you in a deck or a paper.</p>
       <ul>
         <li><b>Before you ship a figure.</b> The same numbers can be drawn honestly or
         deceptively. Run the checklist on your own plot so you do not <i>accidentally</i> mislead.</li>
         <li><b>When you are reading someone else's chart.</b> A dramatic-looking bar, a "tight
         correlation", a shrinking pie slice &mdash; ask what axis choice or framing produced the
         drama before you believe it.</li>
         <li><b>When you communicate a result to a decision-maker.</b> Responsible communication
         means the visual impression matches the actual size of the effect, with the uncertainty
         shown.</li>
       </ul>
       <p>This is the partner skill to making <i>good</i> visuals: knowing the failure modes is how
       you avoid them.</p>`,

    application:
      `<p>Chart distortion shows up everywhere data is presented.</p>
       <ul>
         <li><b>Dashboards and metric reviews.</b> A truncated y-axis (the vertical scale) turns a
         1% week-over-week move into a cliff &mdash; great for looking busy, bad for honest
         reporting.</li>
         <li><b>Executive decks and marketing.</b> Dual y-axes and 3-D pie charts are the house
         style of "make it look like a big deal". Strip them back to honest panels before you
         trust the story.</li>
         <li><b>Papers and benchmarks.</b> Cherry-picked time windows and bar charts without error
         bars routinely make a tiny, noisy improvement look decisive.</li>
       </ul>`,

    pitfalls:
      `<p>These nine tricks <b>are</b> the content of this lesson. For each: what it does to the
       eye, and the honest fix.</p>
       <ul>
         <li><b>Truncated y-axis.</b> Starting the value axis above zero (say at 12 instead of 0)
         chops off the shared base of every bar, so only the small differences remain &mdash; and
         they fill the whole frame, looking enormous. <i>Fix:</i> for a <b>bar chart, always start
         the axis at zero</b>, because a bar encodes a quantity by its <i>length</i>. (Line charts
         of an index that never goes near zero are the one defensible exception &mdash; but label
         the scale loudly.)</li>
         <li><b>Dual y-axes.</b> Plotting two series on two different vertical scales lets you slide
         and stretch one until it appears to track the other. The "correlation" is then an artifact
         of your arbitrary scaling, not the data. <i>Fix:</i> use <b>two stacked panels with a
         shared x-axis</b>, or plot one against the other as a scatter and report the actual
         correlation number.</li>
         <li><b>Inverted or non-linear axes.</b> Flipping an axis (top = small) or using a log /
         square-root scale without saying so reverses or compresses the visual story. <i>Fix:</i>
         default to a <b>linear axis oriented the natural way</b>; if a log scale is genuinely
         needed (orders of magnitude), <b>label it as log</b> and keep gridlines.</li>
         <li><b>Area and 3-D distortion.</b> When a value is encoded by a circle's
         <b>radius</b> or a cube's side, doubling the number <i>quadruples</i> the area (and
         octuples the volume), so the eye massively over-reads it &mdash; the classic "double the
         radius" trick. 3-D pies tilt slices so the front ones look bigger. <i>Fix:</i> encode by
         <b>area, not radius</b> (or just use a bar); <b>never</b> use 3-D for 2-D data.</li>
         <li><b>Cherry-picked ranges and time windows.</b> Choosing the start and end dates to
         flatter a trend (begin at a dip, end at a peak) manufactures whatever slope you want.
         <i>Fix:</i> show the <b>full available history</b>, or pre-register the window; mark where
         you cut and why.</li>
         <li><b>Improper binning.</b> In a histogram, bin width and bin edges are choices. Too-wide
         bins hide a second peak; shifting the edges can make a bump appear or vanish. <i>Fix:</i>
         try <b>several bin widths</b>, prefer a principled rule, and overlay a density curve so the
         shape does not hinge on one arbitrary grid.</li>
         <li><b>Aggregation hiding variation.</b> A single bar of group means says nothing about the
         <b>spread</b> within each group. Two groups with identical means can have wildly different
         distributions (one tight, one bimodal). <i>Fix:</i> <b>show the distribution</b> &mdash;
         box plot, violin, or jittered points &mdash; not just the mean.</li>
         <li><b>Correlation framed as causation.</b> Two lines that rise together (or a tidy
         scatter) get captioned as "X drives Y". The chart cannot show causation; a lurking
         third variable or reverse direction is just as consistent with it. <i>Fix:</i> <b>caption
         it as association</b>, and reserve causal language for an experiment or an explicit causal
         analysis.</li>
         <li><b>Missing baseline / missing uncertainty.</b> No zero reference, no comparison group,
         and no error bars means the reader cannot tell a real move from noise. <i>Fix:</i> include
         the <b>baseline / control</b> and draw <b>error bars or confidence bands</b>; if the bars
         overlap, say so. (Bonus trap: a <b>misleading colour scale</b> &mdash; a rainbow or a
         centre that is not at zero &mdash; invents structure in a heatmap; use a perceptually
         uniform scale and centre diverging maps at zero.)</li>
       </ul>`,

    bigIdea:
      `<p>A chart is a <b>visual encoding</b>: it maps numbers to lengths, positions, angles, areas,
       and colours so your eye can compare them fast. The encoding can be <i>faithful</i> &mdash;
       the visual size of a thing matches its real size &mdash; or it can be <b>broken</b> so the
       visual impression no longer matches the numbers.</p>
       <p>The slippery part is that a misleading chart usually contains <b>no false numbers</b>.
       Every value is correct. What is wrong is the <b>mapping</b>: a truncated axis, an arbitrary
       second scale, a radius standing in for an area. The lie lives in the geometry, not the data,
       which is exactly why it is so easy to do by accident and so easy to miss.</p>
       <p>The single deepest example is the <b>truncated bar axis</b>. A bar says "this quantity is
       <i>this long</i>". Length only means something measured <b>from zero</b>. Move the baseline
       up and the bar's length stops being the quantity and starts being "the quantity minus an
       arbitrary number" &mdash; and the eye has no way to know.</p>`,

    buildup:
      `<p>Let four groups have means that are genuinely close: $12.6,\\ 13.4,\\ 14.7,\\ 15.8$. The
       biggest is only about a quarter larger than the smallest.</p>
       <p><b>Honest bars (baseline at $0$).</b> Each bar has length equal to its value. The bars are
       $12.6,\\ 13.4,\\ 14.7,\\ 15.8$ units tall. The ratio of tallest to shortest is
       $15.8/12.6 \\approx 1.26$ &mdash; the bars look <i>nearly the same height</i>, which is the
       truth.</p>
       <p><b>Truncated bars (baseline moved up to $12$).</b> Now each bar's drawn height is
       value $-\\,12$: that is $0.6,\\ 1.4,\\ 2.7,\\ 3.8$. The ratio of tallest to shortest drawn bar
       is $3.8/0.6 \\approx 6.5$. The eye reads a <b>6.5&times;</b> difference where the real
       difference is <b>1.26&times;</b>.</p>
       <p>Same four correct numbers, two pictures, two completely different stories. Nothing was
       falsified &mdash; only the baseline moved. That gap between $1.26$ and $6.5$ is the whole
       lesson.</p>`,

    symbols: [
      { sym: "$x_i$", desc: "the true value of group $i$ (e.g. a group mean)." },
      { sym: "$b$", desc: "the baseline the value axis starts at. For an honest bar chart, $b=0$." },
      { sym: "$h_i = x_i - b$", desc: "the drawn height of bar $i$ &mdash; what the eye actually compares. Only equals $x_i$ when $b=0$." },
      { sym: "$r$", desc: "a radius used to encode a value in a bubble chart." },
      { sym: "$A$", desc: "the area of a bubble: $A=\\pi r^2$. The eye reads area, so encoding a value as $r$ over-states it." }
    ],

    formula:
      `$$ \\underbrace{\\frac{\\max_i h_i}{\\min_i h_i}}_{\\text{ratio the eye sees}}
         \\;=\\; \\frac{\\max_i (x_i-b)}{\\min_i (x_i-b)}
         \\;\\xrightarrow[\\;b\\,\\to\\,\\min_i x_i\\;]{}\\; \\infty,
         \\qquad\\text{honest only when } b=0. $$`,

    whatItDoes:
      `<p>The formula compares the ratio the <b>eye</b> reads (tallest drawn bar over shortest drawn
       bar) for a given baseline $b$. With $b=0$ the drawn heights are the true values, so the ratio
       is the true ratio. As you slide the baseline $b$ up toward the smallest value, the
       denominator $\\min_i(x_i-b)$ shrinks toward zero and the ratio <b>blows up without bound</b>.
       That is the truncated-axis exaggeration, written as one fraction: the closer the baseline
       creeps to your data, the more violently the picture lies.</p>
       <p>The area note is the same idea for bubbles: doubling the encoded value but holding "value
       $=r$" means $A=\\pi r^2$ <i>quadruples</i>, so the eye &mdash; which judges area &mdash;
       sees a $4\\times$ change for a $2\\times$ number.</p>`,

    derivation:
      `<p><b>Why a bar must start at zero, in three steps.</b></p>
       <ul class="steps">
         <li>A bar encodes a quantity by <b>length</b>. The visual claim is "this length
         <i>is</i> this much". A length is only meaningful relative to a starting point, and the
         only starting point that makes "twice as long = twice as much" true is <b>zero</b>.</li>
         <li>Move the baseline to $b\\gt 0$. The drawn length of bar $i$ becomes $h_i=x_i-b$. Compare
         two bars: their drawn-length ratio is $\\dfrac{x_1-b}{x_2-b}$, which is <b>not</b> equal to
         the true ratio $\\dfrac{x_1}{x_2}$ unless $b=0$. So the eye's "this bar is $k$ times that
         one" is simply false.</li>
         <li>Worse, the distortion is unbounded: as $b\\to\\min_i x_i$ the shortest bar's length
         $\\to 0$ and the ratio $\\to\\infty$. By picking $b$ you can make two nearly-equal values
         look <b>arbitrarily</b> far apart. The fix is the only baseline that is not a free
         parameter: $b=0$. $\\blacksquare$</li>
       </ul>
       <p><b>The bubble (area) version.</b> If you set radius $r\\propto x$, then area
       $A=\\pi r^2\\propto x^2$. Doubling $x$ multiplies the perceived area by $4$. The honest
       encoding sets <b>area</b> proportional to the value, i.e. $r\\propto\\sqrt{x}$, so that a
       doubling of the value doubles the area the eye reads.</p>`,

    example:
      `<p>Two product variants have conversion rates $x_A = 3.1\\%$ and $x_B = 3.4\\%$ &mdash; a real but small
       $0.3$ percentage-point gap. We plug these into the ratio formula
       $\\frac{\\max_i h_i}{\\min_i h_i}$ where $h_i = x_i - b$, for two baselines $b$:</p>
       <table class="extable">
         <caption>Same two numbers ($3.1$, $3.4$), two baselines $b$ &mdash; what the eye reads</caption>
         <thead>
           <tr><th>baseline $b$</th><th class="num">$h_A=x_A-b$</th><th class="num">$h_B=x_B-b$</th><th class="num">ratio $h_B/h_A$</th></tr>
         </thead>
         <tbody>
           <tr><td class="row-h">honest, $b=0$</td><td class="num">3.1</td><td class="num">3.4</td><td class="num">1.10&times;</td></tr>
           <tr><td class="row-h">truncated, $b=3.0$</td><td class="num">0.1</td><td class="num">0.4</td><td class="num">4.00&times;</td></tr>
         </tbody>
       </table>
       <ul class="steps">
         <li><b>Honest bars ($b=0$).</b> Drawn heights are $h_A = 3.1 - 0 = 3.1$ and
         $h_B = 3.4 - 0 = 3.4$. The ratio the eye sees is $3.4 / 3.1 \\approx 1.10$, so $B$ is about
         $10\\%$ taller &mdash; the bars look <i>almost identical</i>, which is correct.</li>
         <li><b>Truncated bars ($b=3.0$).</b> Drawn heights become $h_A = 3.1 - 3.0 = 0.1$ and
         $h_B = 3.4 - 3.0 = 0.4$. Now the ratio is $0.4 / 0.1 = 4.00$ &mdash; the "winner" towers at
         <b>four times</b> the "loser". The same $0.3$-point gap is rendered as a landslide; the only thing that
         changed is $b$.</li>
         <li><b>The honest add-on.</b> Put $95\\%$ error bars on the $b=0$ version. With a margin of
         $\\pm 0.4$ points, $A$ spans $3.1 \\pm 0.4 = [2.7,\\ 3.5]$ and $B$ spans
         $3.4 \\pm 0.4 = [3.0,\\ 3.8]$. Those intervals <b>overlap</b> on $[3.0,\\ 3.5]$ &mdash; the
         "difference" may be noise, a fact the truncated chart actively hides.</li>
       </ul>
       <p>Two correct numbers, two baselines: the eye's ratio jumps from $1.10\\times$ to $4.00\\times$ with
       nothing falsified &mdash; the lie lives entirely in the choice of $b$.</p>`,

    practice: [
      {
        q: `A teammate's slide shows two bars for last-quarter revenue: one looks roughly three times taller than the other, suggesting a huge gap. You notice the y-axis starts at $9.0\\text{M}$ and the values are $\\$9.2\\text{M}$ and $\\$9.8\\text{M}$. What is going on, and how do you redraw it honestly?`,
        steps: [
          { do: `Compute the true ratio of the values: $9.8/9.2 \\approx 1.07$.`, why: `The real difference is about $7\\%$ — small.` },
          { do: `Compute the drawn-height ratio with baseline $b=9.0$: heights are $0.2$ and $0.8$, ratio $0.8/0.2 = 4$.`, why: `The truncated baseline makes a $7\\%$ gap look like a $4\\times$ gap — that is the exaggeration.` },
          { do: `Redraw the bar chart with the y-axis starting at $0$.`, why: `A bar encodes a quantity by length, which is only meaningful from zero; the two bars will then look nearly equal, as they truly are.` }
        ],
        answer: `<p>The chart uses a <b>truncated y-axis</b> (baseline at $9.0\\text{M}$), so the drawn bar lengths are $0.2$ and $0.8$ &mdash; a $4\\times$ visual ratio &mdash; while the true values $9.2$ and $9.8$ differ by only about $7\\%$. <b>Fix:</b> start the bar axis at $0$. The bars then look nearly identical, matching reality. (If you want to emphasise the small change, show it as a labelled percentage, not by chopping the axis.)</p>`
      },
      {
        q: `A figure overlays "ad spend" and "sales" as two lines on a chart with two y-axes, and they track each other beautifully. The caption says "advertising drives sales." Name the two separate problems and the honest redraw.`,
        steps: [
          { do: `Spot the dual y-axes: each line has its own vertical scale, chosen by the author.`, why: `By sliding and stretching one scale you can make almost any two upward series appear to coincide — the visual "match" is an artifact of arbitrary scaling.` },
          { do: `Spot the causal claim attached to a co-movement.`, why: `Even a real correlation cannot show causation from a chart; a lurking variable (e.g. holiday season lifting both) or reverse causation fits equally well.` },
          { do: `Redraw as two stacked panels sharing the x-axis, or as a scatter of sales vs spend, and report the actual correlation; reword the caption to "associated with".`, why: `Honest panels remove the scaling trick, and "associated" reserves causal language for an experiment.` }
        ],
        answer: `<p>Two problems: (1) <b>dual y-axes</b> &mdash; two arbitrary scales were tuned until the lines visually coincide, so the "match" is manufactured, not measured; (2) <b>correlation framed as causation</b> &mdash; a chart of co-movement cannot establish that spend <i>drives</i> sales. <b>Fix:</b> plot the two series in <b>two stacked panels</b> with a shared x-axis (or a scatter with the reported correlation), and caption it as an <b>association</b>, not a cause.</p>`
      },
      {
        q: `A report compares two regions with a single bar of the <b>mean</b> response time for each: both are about $200\\text{ms}$, so the report concludes "the regions perform identically." Why might this be misleading, and what should be plotted instead?`,
        steps: [
          { do: `Recognise that a bar of means discards all information about spread.`, why: `Two groups can share a mean while one is tight around $200\\text{ms}$ and the other swings from $50$ to $600\\text{ms}$.` },
          { do: `Ask what the decision actually cares about — often the tail (the slow requests), not the average.`, why: `A heavy upper tail means a bad experience for many users even when the mean looks fine.` },
          { do: `Plot the full distribution: a box plot, violin, or jittered points (or at least the median and the 95th percentile) per region.`, why: `Showing spread reveals whether the regions truly behave the same, which the mean alone cannot.` }
        ],
        answer: `<p>It is misleading because <b>aggregation hides variation</b>: equal means can sit on top of very different spreads, and for latency the <b>tail</b> usually matters more than the average. <b>Fix:</b> show the <b>distribution</b> &mdash; box plot / violin / jittered points, or at minimum the median and the 95th percentile per region &mdash; instead of a single mean bar.</p>`
      }
    ]
  });

  window.CODE["dw-misleading-charts"] = {
    lib: "matplotlib",
    runnable: false,
    explain: `<p>Two side-by-side demonstrations on the <b>same numbers</b>. First, a bar chart drawn
      with a <b>truncated y-axis</b> (exaggerated) next to the honest <b>zero-baseline</b> version.
      Second, a <b>dual-axis "fake correlation"</b> next to the honest fix of <b>two separate
      panels</b> sharing an x-axis. Run it to see how the geometry &mdash; not the data &mdash;
      changes the story. Needs only <code>matplotlib</code> and <code>numpy</code>.</p>`,
    code: `import numpy as np
import matplotlib.pyplot as plt

# ============================================================
# 1) TRUNCATED Y-AXIS (lie) vs ZERO BASELINE (honest)
#    Four groups whose means are genuinely CLOSE.
# ============================================================
groups = ['Q1', 'Q2', 'Q3', 'Q4']
means  = [12.59, 13.39, 14.72, 15.82]   # max/min ratio = 1.26  -> nearly equal

fig, (ax_lie, ax_ok) = plt.subplots(1, 2, figsize=(10, 4))

# --- MISLEADING: baseline chopped up to 12, differences fill the frame ---
ax_lie.bar(groups, means, color='#ff7b72')
ax_lie.set_ylim(12, 16)                  # <-- the trick: axis does NOT start at 0
ax_lie.set_title('MISLEADING: y-axis truncated at 12\\n(bars look ~6x apart)')

# --- HONEST: a bar encodes length, so the axis must start at 0 ---
ax_ok.bar(groups, means, color='#7ee787')
ax_ok.set_ylim(0, 16)                     # <-- honest baseline
ax_ok.set_title('HONEST: y-axis starts at 0\\n(bars are nearly equal -- the truth)')

plt.tight_layout()
plt.savefig('truncated_vs_zero.png', dpi=120)

# ============================================================
# 2) DUAL Y-AXES (fake correlation) vs TWO HONEST PANELS
# ============================================================
t       = np.arange(12)
ad_spend = np.array([10, 11, 9, 12, 14, 13, 15, 16, 14, 17, 19, 18.])
sales    = np.array([200, 150, 260, 170, 210, 240, 190, 230, 280, 220, 250, 300.])
# sales is basically noise; the dual axis will MAKE it look like it tracks spend.

fig2, (ax_bad, ax_g1) = plt.subplots(1, 2, figsize=(11, 4))

# --- MISLEADING: two arbitrary scales tuned until the lines "coincide" ---
ax_bad.plot(t, ad_spend, color='#4ea1ff', label='ad spend')
ax_bad.set_ylabel('ad spend', color='#4ea1ff')
ax_twin = ax_bad.twinx()                  # <-- second y-axis = the trick
ax_twin.plot(t, sales, color='#ff7b72', label='sales')
ax_twin.set_ylabel('sales', color='#ff7b72')
ax_bad.set_title('MISLEADING: dual y-axes\\n"sales tracks spend!" (it does not)')

# --- HONEST: two stacked panels, each on its own zeroed scale ---
gs = ax_g1.get_gridspec()
ax_g1.remove()
sub = fig2.add_gridspec(2, 1, left=0.55, right=0.98, hspace=0.5)
p1 = fig2.add_subplot(sub[0]); p1.plot(t, ad_spend, color='#4ea1ff'); p1.set_ylim(0, 20); p1.set_title('ad spend')
p2 = fig2.add_subplot(sub[1]); p2.plot(t, sales, color='#ff7b72');    p2.set_ylim(0, 320); p2.set_title('sales')
# The real correlation, reported as a number instead of implied by overlay:
r = np.corrcoef(ad_spend, sales)[0, 1]
print(f'actual correlation(ad_spend, sales) = {r:.2f}')   # weak -- no real tracking

plt.savefig('dual_axis_vs_panels.png', dpi=120)
print('saved truncated_vs_zero.png and dual_axis_vs_panels.png')`
  };

  window.CODEVIZ["dw-misleading-charts"] = {
    question: "Same four real group means, drawn four ways. Which chart geometry tells the truth, and how do you recognise each lie on sight?",
    charts: [
      {
        type: "bars",
        title: "HONEST (ideal) — y-axis starts at 0, bar height = the real mean",
        xlabel: "mean-texture quartile",
        ylabel: "mean radius (axis starts at 0)",
        labels: ["Q1", "Q2", "Q3", "Q4"],
        values: [12.59, 13.39, 14.72, 15.82],
        valueLabels: ["12.59", "13.39", "14.72", "15.82"],
        colors: ["#7ee787", "#7ee787", "#7ee787", "#7ee787"],
        interpret: "Each bar's <b>length from zero</b> is the group mean (real load_breast_cancer numbers). Read the heights: 12.6, 13.4, 14.7, 15.8 — tallest over shortest is 15.8/12.6 ≈ <b>1.26x</b>, so the four bars look <b>nearly equal</b>. That near-equal picture is the truth. This is the only baseline (zero) that makes 'twice as tall = twice as much' honest for bars."
      },
      {
        type: "bars",
        title: "LIE 1 — same data, y-axis truncated at 12 (drawn height = mean − 12)",
        xlabel: "mean-texture quartile",
        ylabel: "drawn bar height (axis starts at 12)",
        labels: ["Q1", "Q2", "Q3", "Q4"],
        values: [0.59, 1.39, 2.72, 3.82],
        valueLabels: ["0.59", "1.39", "2.72", "3.82"],
        colors: ["#ff7b72", "#ff7b72", "#ff7b72", "#ff7b72"],
        interpret: "Identical numbers to the green chart, but the axis starts at 12 instead of 0, so each bar draws only mean−12: 0.59, 1.39, 2.72, 3.82. Tallest over shortest is now 3.82/0.59 ≈ <b>6.5x</b> — the eye reads a cliff where reality is 1.26x. <b>How to spot it:</b> check where the y-axis starts; if a bar chart's baseline is not 0, the lengths are lying. Fix: start at 0."
      },
      {
        type: "line",
        title: "LIE 2 — dual y-axes make two unrelated series 'track' (illustrative)",
        xlabel: "month",
        ylabel: "two arbitrary scales overlaid",
        series: [
          { name: "ad spend (left scale)", color: "#4ea1ff", points: [[0,1.0],[1,1.4],[2,1.1],[3,1.8],[4,2.2],[5,2.6],[6,3.0],[7,3.4]] },
          { name: "sales (right scale, rescaled)", color: "#ff7b72", points: [[0,1.1],[1,1.3],[2,1.2],[3,1.9],[4,2.0],[5,2.7],[6,2.9],[7,3.5]] }
        ],
        interpret: "<b>Illustrative.</b> Two series are plotted on two different vertical scales, each stretched until the lines overlap — so they look locked together even when their real correlation is near zero. <b>How to spot it:</b> two y-axes with different units/ranges. The 'tracking' is an artifact of the scaling you chose, not the data. Fix: two stacked panels with a shared x-axis, or a scatter with the actual correlation reported."
      },
      {
        type: "scatter",
        title: "LIE 3 — bubble area: radius ∝ value over-states big values 4x (illustrative)",
        xlabel: "encoded value (1x vs 2x)",
        ylabel: "bubble radius (eye reads AREA)",
        groups: [
          { name: "value = 1 (radius 1, area π)", color: "#7ee787", points: [[1,1]] },
          { name: "value = 2 drawn radius∝value (area 4π!)", color: "#ff7b72", points: [[2,2]] }
        ],
        interpret: "<b>Illustrative.</b> When a value sets a bubble's <b>radius</b>, doubling the value doubles the radius but <b>quadruples the area</b> (A = πr², so 2x → 4x), and the eye judges area. A '2x' number looks like a 4x blob. <b>How to spot it:</b> a bubble/area chart with no note that area (not radius) encodes the value. Fix: set radius ∝ √value so area is proportional, or just use a bar."
      },
      {
        type: "bars",
        title: "LIE 4 — one bar of the MEAN hides the spread (illustrative)",
        xlabel: "region (mean response time, both ≈ 200 ms)",
        ylabel: "mean only — spread invisible",
        labels: ["Region A mean", "Region B mean"],
        values: [200, 200],
        valueLabels: ["200 ms", "200 ms"],
        colors: ["#9aa7b4", "#9aa7b4"],
        interpret: "<b>Illustrative.</b> Both bars are the same height because both means are 200 ms — so the chart concludes 'identical'. But a mean bar throws away spread: A could be tight at 200 while B swings 50–600 ms. <b>How to spot it:</b> a single bar per group with no error bars, box, or points. Fix: show the distribution (box/violin/jittered points) or at least the median and 95th percentile — the tail is usually what the decision cares about."
      }
    ],
    caption: "Real numbers from sklearn's load_breast_cancer: the mean 'mean radius' within each quartile of 'mean texture' is 12.59, 13.39, 14.72, 15.82 — a true spread of only 1.26x. Chart 1 (green, ideal) is the honest zero-baseline view. The rest are lies you will actually meet: a truncated axis turning 1.26x into 6.5x, dual y-axes manufacturing correlation, radius-encoded bubbles over-reading area 4x, and a mean bar hiding within-group spread. Same kinds of correct numbers, very different stories — the lie lives in the geometry.",
    code: `import numpy as np
import pandas as pd
from sklearn.datasets import load_breast_cancer

d = load_breast_cancer(as_frame=True)
df = d.frame                                   # 569 real tumor measurements

# Split rows into 4 equal-count groups by 'mean texture', then take the
# mean of 'mean radius' in each group -> four genuinely CLOSE numbers.
df['tq'] = pd.qcut(df['mean texture'], 4, labels=['Q1', 'Q2', 'Q3', 'Q4'])
means = df.groupby('tq', observed=True)['mean radius'].mean()
print(means.round(2).tolist())                 # -> [12.59, 13.39, 14.72, 15.82]

# True spread: tallest / shortest as the eye SHOULD read it from zero.
print('honest ratio max/min =', round(means.max() / means.min(), 2))   # 1.26

# Now truncate the axis at 12: the eye reads (value - 12) instead.
base = 12.0
drawn = (means - base)
print(drawn.round(2).tolist())                 # -> [0.59, 1.39, 2.72, 3.82]
print('truncated ratio max/min =', round(drawn.max() / drawn.min(), 2))  # 6.47
# 1.26x of real difference rendered as a 6.5x cliff -- pure axis trick.`
  };
})();
