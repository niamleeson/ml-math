/* Data Wrangling — "Bivariate analysis" (two variables at a time).
   Self-contained: lesson + CODE + CODEVIZ merged by id "dw-bivariate". */
(function () {
  window.LESSONS.push({
    id: "dw-bivariate",
    title: "Bivariate analysis: looking at two variables together",
    tagline: "Pair up columns to find relationships, group differences, and the features that actually relate to your target.",
    module: "Data Wrangling",
    prereqs: ["dw-data-types", "met-association"],

    whenToUse:
      `<p><b>Do this right after univariate (one-variable) exploration.</b> Once you know what each column
       looks like on its own &mdash; its shape, its spread, its missingness &mdash; the next question is how
       columns <b>move together</b>. Bivariate analysis is where you find the relationships that matter:
       which features track the target, which features track each other, and which groups differ.</p>
       <ul>
         <li><b>Reach for it</b> to find <i>feature&ndash;target</i> relationships (does this column help predict
         what I care about?) and <i>feature&ndash;feature</i> relationships (are two columns saying the same
         thing?).</li>
         <li><b>Reach for it</b> to compare <i>groups</i> &mdash; is the average order value different for
         mobile vs desktop users?</li>
         <li><b>The pairing decides the plot.</b> What you draw depends entirely on the <b>two data types</b>
         you put together (see below). Get the types right first, then the chart picks itself.</li>
       </ul>`,

    application:
      `<p>Pick the view from the <b>pair of types</b>. There are three pairings, and each has its own toolkit:</p>
       <ul>
         <li><b>Numeric &times; Numeric.</b> A <b>scatter plot</b> is the workhorse &mdash; add a <b>trend line</b>
         (or a smoother like LOWESS, Locally Weighted Scatterplot Smoothing) to see the shape. When points pile
         up and hide each other, switch to a <b>2-D density</b> or <b>hexbin</b> plot.</li>
         <li><b>Numeric &times; Categorical.</b> Split the numeric <i>by</i> the category: a <b>box plot</b> or
         <b>violin plot</b> per group, a <b>strip plot</b> for small data, <b>grouped histograms</b>, or just the
         <b>group means</b>. You are comparing one number across the categories.</li>
         <li><b>Categorical &times; Categorical.</b> Count the combinations: a <b>crosstab</b> / contingency
         table (often <b>normalized</b> into proportions), drawn as <b>stacked or grouped bars</b>, or a
         <b>mosaic</b> plot.</li>
       </ul>
       <p>Reading the picture, you are hunting for: a <b>trend</b> (one goes up as the other goes up),
       <b>clusters</b> (separate clouds of points), <b>heteroscedasticity</b> (the spread fanning out as you move
       along the x-axis), <b>group differences</b> (one category sits higher), and <b>association</b> (two
       categories co-occur more than chance).</p>`,

    pitfalls:
      `<ul>
         <li><b>Reading causation off a scatter.</b> A tight upward trend means the two move together &mdash; it
         does <i>not</i> mean one causes the other. Ice-cream sales and drownings both rise in summer; neither
         causes the other. Say "associated," not "causes."</li>
         <li><b>A lurking third variable (confounder).</b> Two columns can look related only because a hidden
         third one drives both. Split or color by candidate confounders before you trust a relationship; the
         trend can reverse inside each group (Simpson's paradox).</li>
         <li><b>Overplotting hiding the density.</b> With many points, a solid blob of ink hides where the data
         actually piles up. Lower the marker opacity (<code>alpha</code>), shrink the markers, or switch to a
         <b>hexbin</b> / 2-D density so the dense core shows.</li>
         <li><b>Calling a pattern from too few points.</b> A "trend" through five points is mostly noise. Eyeball
         the count before you believe the shape, and be wary of a slope swung by one outlier.</li>
         <li><b>Comparing groups of very different size.</b> A box plot for a 5-row category next to a 5,000-row
         one looks equally confident but is not. Note the group counts (<code>n</code>) and lean on
         <i>proportions</i>, not raw counts, when groups are lopsided.</li>
       </ul>`,

    bigIdea:
      `<p>Univariate analysis answers "what does this <i>one</i> column look like?" <b>Bivariate</b> analysis
       answers the question that actually matters for modeling: "do these <i>two</i> columns relate?" That is
       the whole point of this step &mdash; it is where you discover which features carry signal about the
       target, and which features are really duplicates of each other.</p>
       <p>The key move is to stop thinking "what chart do I want?" and start thinking <b>"what two data types am
       I holding?"</b> Once you classify each of the two columns as numeric or categorical, there are only three
       combinations, and each combination has a small, settled set of right pictures. The type pair chooses the
       tool.</p>`,

    buildup:
      `<p>Walk the three pairings, because they are the entire decision:</p>
       <p><b>1. Two numbers (numeric &times; numeric).</b> Put one on the x-axis, one on the y-axis, drop a dot
       per row: a <b>scatter</b>. The cloud's shape <i>is</i> the relationship &mdash; a tilted line means a
       trend, a horizontal blob means none, a fan that widens means the spread depends on x
       (<b>heteroscedasticity</b>). Add a fitted line or smoother to make the trend explicit, and switch to
       hexbin when the dots overlap too much to see.</p>
       <p><b>2. A number and a category (numeric &times; categorical).</b> You cannot scatter a category, so you
       <i>split</i> the number into one distribution per category and compare them side by side &mdash; box or
       violin plots line up the medians and spreads, and a simple table of <b>group means</b> often tells the
       story. The question is always "does this number differ across the groups?"</p>
       <p><b>3. Two categories (categorical &times; categorical).</b> Neither has a numeric axis, so you
       <b>count</b> how often each combination occurs &mdash; a <b>crosstab</b>. Raw counts mislead when one
       category dominates, so <b>normalize</b> to row or column proportions, then draw stacked or grouped bars.
       The question is "do these two categories go together more than you'd expect by chance?" &mdash; that is
       <b>association</b>.</p>
       <p>Across all three, you read the same handful of patterns: trend, clusters, heteroscedasticity, group
       differences, association. Spotting any of them flags a column worth keeping for the model.</p>`,

    derivation:
      `<p><b>Putting a number on "do these two move together?"</b> For the numeric &times; numeric case,
       the scatter shows the trend with your eyes; the <b>Pearson correlation</b> $r$ puts a single number on
       it, between $-1$ (perfect downward line) and $+1$ (perfect upward line), with $0$ meaning no straight-line
       trend. Here is exactly how it is built, with the eight rows from the example.</p>
       <p>Every symbol first. $x_i$ is row $i$'s value of the first column (here <code>session_minutes</code>);
       $y_i$ is row $i$'s value of the second column (here <code>order_value</code>); $\\bar{x}$ ("x-bar") is the
       mean of all the $x$ values; $\\bar{y}$ is the mean of all the $y$ values. The idea: for each row, ask "is
       $x$ above or below its average, and is $y$?" If the two usually agree in sign, the columns move together.</p>
       <p>$$ r = \\frac{\\sum_i (x_i-\\bar{x})(y_i-\\bar{y})}{\\sqrt{\\sum_i (x_i-\\bar{x})^2}\\;\\sqrt{\\sum_i (y_i-\\bar{y})^2}} $$</p>
       <p>The top (numerator) adds up the products of the two deviations: it is large and positive when a row that
       is high in $x$ is also high in $y$. The bottom (denominator) just rescales by each column's own spread so
       the answer always lands in $[-1,1]$ regardless of the units (minutes vs dollars). Work it for the eight rows:</p>
       <ul class="steps">
         <li>Means: $\\bar{x} = (12+5+18+9+7+14+4+11)/8 = 80/8 = 10$; $\\bar{y} = (80+40+120+60+30+50+20+35)/8 = 435/8 = 54.375$.</li>
         <li>Deviations $x_i-\\bar{x}$: $2,-5,8,-1,-3,4,-6,1$. Deviations $y_i-\\bar{y}$: $25.625,-14.375,65.625,5.625,-24.375,-4.375,-34.375,-19.375$.</li>
         <li>Products $(x_i-\\bar{x})(y_i-\\bar{y})$, row by row: $51.25,\\,71.875,\\,525,\\,-5.625,\\,73.125,\\,-17.5,\\,206.25,\\,-19.375$. Sum $= 885$.</li>
         <li>$\\sum (x_i-\\bar{x})^2 = 4+25+64+1+9+16+36+1 = 156$.</li>
         <li>$\\sum (y_i-\\bar{y})^2 = 656.64+206.64+4306.64+31.64+594.14+19.14+1181.64+375.39 = 7371.88$.</li>
         <li>$r = 885 / (\\sqrt{156}\\,\\sqrt{7371.88}) = 885 / (12.49 \\times 85.86) = 885 / 1072.6 = 0.825$.</li>
         <li>$r \\approx 0.83$ is strongly positive: longer sessions go with bigger orders. The scatter would show a clear upward tilt &mdash; exactly the "trend" pattern that flags a feature worth keeping. $\\blacksquare$</li>
       </ul>
       <table class="extable">
         <caption>The numerator, built one row at a time (deviations from the means $\\bar{x}=10$, $\\bar{y}=54.375$)</caption>
         <thead>
           <tr><th>row</th><th class="num">$x_i$</th><th class="num">$y_i$</th><th class="num">$x_i-\\bar{x}$</th><th class="num">$y_i-\\bar{y}$</th><th class="num">product</th></tr>
         </thead>
         <tbody>
           <tr><td class="row-h">1</td><td class="num">12</td><td class="num">80</td><td class="num">2</td><td class="num">25.625</td><td class="num">51.25</td></tr>
           <tr><td class="row-h">2</td><td class="num">5</td><td class="num">40</td><td class="num">-5</td><td class="num">-14.375</td><td class="num">71.875</td></tr>
           <tr><td class="row-h">3</td><td class="num">18</td><td class="num">120</td><td class="num">8</td><td class="num">65.625</td><td class="num">525</td></tr>
           <tr><td class="row-h">4</td><td class="num">9</td><td class="num">60</td><td class="num">-1</td><td class="num">5.625</td><td class="num">-5.625</td></tr>
           <tr><td class="row-h">5</td><td class="num">7</td><td class="num">30</td><td class="num">-3</td><td class="num">-24.375</td><td class="num">73.125</td></tr>
           <tr><td class="row-h">6</td><td class="num">14</td><td class="num">50</td><td class="num">4</td><td class="num">-4.375</td><td class="num">-17.5</td></tr>
           <tr><td class="row-h">7</td><td class="num">4</td><td class="num">20</td><td class="num">-6</td><td class="num">-34.375</td><td class="num">206.25</td></tr>
           <tr><td class="row-h">8</td><td class="num">11</td><td class="num">35</td><td class="num">1</td><td class="num">-19.375</td><td class="num">-19.375</td></tr>
           <tr><td class="row-h">sum</td><td class="num">80</td><td class="num">435</td><td class="num">0</td><td class="num">0</td><td class="num">885</td></tr>
         </tbody>
       </table>`,

    example:
      `<p>Take eight rows of an online-shop table: <code>session_minutes</code> (number),
       <code>order_value</code> (number, in $), <code>device</code> (mobile/desktop), and <code>bought</code>
       (yes/no). Small enough to do the arithmetic by hand.</p>
       <table class="extable">
         <caption>Sample of 8 sessions (illustrative)</caption>
         <thead>
           <tr><th>row</th><th>device</th><th class="num">session_minutes</th><th class="num">order_value</th><th>bought</th></tr>
         </thead>
         <tbody>
           <tr><td class="row-h">1</td><td>desktop</td><td class="num">12</td><td class="num">80</td><td>yes</td></tr>
           <tr><td class="row-h">2</td><td>desktop</td><td class="num">5</td><td class="num">40</td><td>no</td></tr>
           <tr><td class="row-h">3</td><td>desktop</td><td class="num">18</td><td class="num">120</td><td>yes</td></tr>
           <tr><td class="row-h">4</td><td>desktop</td><td class="num">9</td><td class="num">60</td><td>no</td></tr>
           <tr><td class="row-h">5</td><td>mobile</td><td class="num">7</td><td class="num">30</td><td>no</td></tr>
           <tr><td class="row-h">6</td><td>mobile</td><td class="num">14</td><td class="num">50</td><td>yes</td></tr>
           <tr><td class="row-h">7</td><td>mobile</td><td class="num">4</td><td class="num">20</td><td>no</td></tr>
           <tr><td class="row-h">8</td><td>mobile</td><td class="num">11</td><td class="num">35</td><td>no</td></tr>
         </tbody>
       </table>
       <p><b>Numeric &times; Categorical &mdash; group means of <code>order_value</code> by <code>device</code>:</b></p>
       <ul class="steps">
         <li>Desktop mean: $(80 + 40 + 120 + 60) / 4 = 300 / 4 = 75$.</li>
         <li>Mobile mean: $(30 + 50 + 20 + 35) / 4 = 135 / 4 = 33.75$.</li>
         <li>Desktop sits much higher ($75$ vs $33.75$) &mdash; a group difference worth keeping.</li>
       </ul>
       <p><b>Categorical &times; Categorical &mdash; crosstab of <code>device</code> against <code>bought</code>, row-normalized to a buy <i>rate</i>:</b></p>
       <table class="extable">
         <caption>Counts, then each row's buy rate = bought-yes / row total</caption>
         <thead>
           <tr><th>device</th><th class="num">bought = no</th><th class="num">bought = yes</th><th class="num">row total</th><th class="num">buy rate</th></tr>
         </thead>
         <tbody>
           <tr><td class="row-h">desktop</td><td class="num">2</td><td class="num">2</td><td class="num">4</td><td class="num">2/4 = 0.50</td></tr>
           <tr><td class="row-h">mobile</td><td class="num">3</td><td class="num">1</td><td class="num">4</td><td class="num">1/4 = 0.25</td></tr>
         </tbody>
       </table>
       <ul class="steps">
         <li>Desktop buys at $2/4 = 0.50$, mobile at $1/4 = 0.25$ &mdash; double the rate.</li>
         <li>The buy rate differs by device, so the two categories are <b>associated</b>: device relates to the target.</li>
       </ul>
       <p>From one tiny table you've found a group difference (desktop spends more) and an association
       (desktop buys more often) &mdash; both flag <code>device</code> as a candidate feature, without fitting a
       single model. (For the Numeric &times; Numeric view you would scatter <code>order_value</code> vs
       <code>session_minutes</code> and look for the upward tilt.)</p>`,

    practice: [
      {
        q: `You scatter <code>monthly_revenue</code> against <code>ad_spend</code> and see a clean upward line. A teammate writes "ad spend drives revenue." What is wrong, and what would you check?`,
        steps: [
          { do: `Separate what the scatter shows (the two move together) from what it does not show (which causes which).`, why: `A scatter measures <b>association</b>, not causation; the arrow of cause could run either way or come from neither.` },
          { do: `Name a plausible <b>confounder</b> &mdash; e.g. seasonality: busy months get both more ad budget and more revenue.`, why: `A hidden third variable can drive both columns and manufacture the trend.` },
          { do: `Split or color the scatter by the suspected confounder (e.g. by quarter) and re-check whether the trend survives within each group.`, why: `If the within-group trend weakens or reverses, the original line was confounded (Simpson's paradox).` }
        ],
        answer: `<p>The scatter only shows <b>association</b>, not causation, so "drives" is unjustified. A confounder like <b>seasonality</b> could inflate both ad spend and revenue in busy months. Color the points by quarter (or another candidate confounder) and see whether the upward trend holds <i>inside</i> each group before claiming any causal link.</p>`
      },
      {
        q: `You have <code>age</code> (number) and <code>plan</code> (free/basic/pro, a category). Which bivariate views fit, and which would be wrong?`,
        steps: [
          { do: `Classify the pair: one numeric (<code>age</code>), one categorical (<code>plan</code>) &rarr; this is the numeric &times; categorical case.`, why: `The type pair, not taste, picks the chart family.` },
          { do: `Choose split-by-category views: a <b>box</b> or <b>violin</b> plot of <code>age</code> per plan, or a table of <b>group means</b> of age by plan.`, why: `You are comparing one number's distribution across the categories.` },
          { do: `Reject a plain scatter of age vs plan and a crosstab.`, why: `A scatter needs two numeric axes; a crosstab is for two categoricals. Neither matches this pair.` }
        ],
        answer: `<p>It is <b>numeric &times; categorical</b>, so split the number by the category: a <b>box</b> or <b>violin</b> plot of <code>age</code> per <code>plan</code>, or <code>df.groupby("plan")["age"].mean()</code>. A scatter (needs two numbers) and a crosstab (needs two categories) are the wrong tools here.</p>`
      },
      {
        q: `A crosstab of <code>region</code> &times; <code>churned</code> shows raw counts: region A has 900 churned, region B has 100. Your colleague concludes region A churns more. Why is the raw count misleading, and what fixes it?`,
        steps: [
          { do: `Ask how big each region is, not just the churn count.`, why: `Comparing groups of very different size on raw counts is a classic trap &mdash; a big group has more of everything.` },
          { do: `Normalize the crosstab to proportions: <code>pd.crosstab(region, churned, normalize="index")</code>.`, why: `Row-normalizing gives each region its own churn <i>rate</i>, which is comparable across sizes.` },
          { do: `Compare the rates: if A has 9,000 customers (10&percnt; churn) and B has 500 (20&percnt; churn), B actually churns more.`, why: `Proportions, not counts, answer the real question once group sizes differ.` }
        ],
        answer: `<p>Raw counts confound churn with region <b>size</b> &mdash; a large region racks up more churned customers even at a lower rate. Use <code>pd.crosstab(region, churned, normalize="index")</code> to get each region's churn <i>rate</i>; on the rates, the smaller region can easily be the worse one.</p>`
      }
    ]
  });

  window.CODE["dw-bivariate"] = {
    lib: "pandas + seaborn",
    runnable: false,
    explain: `<p>One pass through all three type pairings on the bundled <b>seaborn</b> <code>tips</code> dataset
      (restaurant bills). <b>Numeric &times; numeric:</b> a scatter of tip vs bill with a fitted trend line.
      <b>Numeric &times; categorical:</b> a box plot of bill by day, plus the group means. <b>Categorical
      &times; categorical:</b> a row-normalized <code>pd.crosstab</code> drawn as grouped bars. The data loads
      from seaborn, so this runs as written.</p>`,
    code: `import pandas as pd
import seaborn as sns
import matplotlib.pyplot as plt

tips = sns.load_dataset("tips")   # bundled: total_bill, tip, sex, smoker, day, time, size

# === 1. NUMERIC x NUMERIC: scatter + trend line ========================
# regplot draws the scatter AND a fitted regression line in one call.
# alpha fights overplotting; lowess=True would draw a smoother instead.
sns.regplot(data=tips, x="total_bill", y="tip",
            scatter_kws={"alpha": 0.4}, line_kws={"color": "C1"})
plt.title("tip vs total_bill (trend line)")
plt.show()
# Pearson correlation: a single number for the strength/direction of the trend.
print("corr(total_bill, tip) =", round(tips["total_bill"].corr(tips["tip"]), 3))

# === 2. NUMERIC x CATEGORICAL: box plot per group + group means ========
# Split the numeric (total_bill) into one distribution per category (day).
sns.boxplot(data=tips, x="day", y="total_bill")
plt.title("total_bill by day")
plt.show()
print(tips.groupby("day", observed=True)["total_bill"].mean().round(2))

# === 3. CATEGORICAL x CATEGORICAL: normalized crosstab + grouped bars ===
# Count combinations, then normalize each ROW to a proportion so groups of
# different size are comparable (each day's smoker mix sums to 1.0).
ct = pd.crosstab(tips["day"], tips["smoker"], normalize="index")
print(ct.round(3))
#         smoker     No    Yes
# day
# Thur            0.62   0.38
# ...
ct.plot(kind="bar")        # grouped bars: smoker vs non-smoker share per day
plt.ylabel("share of tables")
plt.title("smoker share by day (row-normalized)")
plt.show()`
  };

  window.CODEVIZ["dw-bivariate"] = {
    question: "How do you READ a bivariate scatter — and how do you tell a real trend from a no-relationship blob, a fanning spread, or a trend that reverses once you split by group?",
    charts: [
      {
        type: "scatter",
        title: "Healthy: tight trend + separated classes (real wine data, 54 of 178)",
        xlabel: "flavanoids",
        ylabel: "total_phenols",
        groups: [
          {
            name: "cultivar 0",
            color: "#4ea1ff",
            points: [[3.04,3.0],[2.94,2.85],[2.68,2.6],[3.17,3.25],[3.64,3.3],[3.39,3.1],[2.51,2.6],[3.54,2.88],[3.0,3.2],[2.91,2.85],[3.67,3.4],[3.24,2.8],[3.29,3.15],[2.19,2.4],[2.65,2.85],[3.06,2.8],[2.43,2.2],[3.25,3.0]]
          },
          {
            name: "cultivar 1",
            color: "#7ee787",
            points: [[2.27,2.5],[2.58,3.18],[3.75,3.52],[2.01,2.48],[2.24,2.13],[1.36,1.45],[3.18,2.98],[2.5,2.55],[1.85,1.9],[1.6,1.98],[2.25,2.45],[2.86,2.95],[1.69,1.78],[1.75,2.1],[1.41,2.02],[3.15,2.74],[1.69,1.95],[1.3,2.53]]
          },
          {
            name: "cultivar 2",
            color: "#c89bff",
            points: [[0.52,1.55],[0.69,1.59],[0.75,1.8],[0.48,1.62],[0.49,1.25],[0.96,1.98],[0.84,1.55],[0.63,1.74],[0.65,1.7],[0.56,1.83],[1.25,1.51],[0.83,1.8],[0.47,1.38],[1.28,2.2],[0.5,1.4],[0.58,1.9],[1.36,1.48],[0.51,1.39]]
          }
        ],
        interpret: "<b>Read the cloud's tilt and its colours separately.</b> The whole point-cloud rises left-to-right along a tight diagonal: feature x feature, flavanoids and total_phenols move together (Pearson correlation 0.865) so they carry overlapping information. Now read the colours: feature x target, the three cultivars sit in clearly separated bands — purple low/low, blue high/high, green between. <b>Both columns relate strongly to the class, so both are promising features.</b> Real 178-wine dataset, 18 points per cultivar."
      },
      {
        type: "scatter",
        title: "No relationship: a horizontal blob (illustrative)",
        xlabel: "feature x",
        ylabel: "feature y",
        groups: [
          {
            name: "rows",
            color: "#9aa7b4",
            points: [[1.0,2.6],[1.3,2.1],[1.6,2.9],[1.9,2.4],[2.2,2.7],[2.5,2.2],[2.8,2.9],[3.1,2.3],[3.4,2.6],[3.7,2.5],[4.0,2.8],[4.3,2.2],[4.6,2.7],[4.9,2.4],[1.2,2.4],[2.0,2.8],[2.9,2.5],[3.6,2.6],[4.2,2.4],[4.8,2.6]]
        }
        ],
        interpret: "<b>Illustrative.</b> The cloud is a flat horizontal smear — y stays around 2.5 no matter what x does. There's no tilt, so there's no trend: correlation near 0. This is the null result you must be able to recognise so you don't talk yourself into a line that isn't there. Conclusion: feature x tells you almost nothing about feature y; drop one, or look elsewhere for signal."
      },
      {
        type: "scatter",
        title: "Heteroscedasticity: the spread fans out (illustrative)",
        xlabel: "session_minutes",
        ylabel: "order_value",
        groups: [
          {
            name: "rows",
            color: "#ffb454",
            points: [[1,2.1],[1.5,2.4],[2,2.0],[2.5,2.6],[3,2.3],[3.5,3.0],[4,2.4],[4.5,3.6],[5,2.2],[5.5,4.1],[6,1.8],[6.5,4.8],[7,2.0],[7.5,5.3],[8,1.5],[8.5,5.9],[9,2.4],[9.5,6.4]]
        }
        ],
        lines: [{ color: "#9aa7b4", dash: true, points: [[1,2.0],[9.5,4.0]] }],
        interpret: "<b>Illustrative.</b> The dashed line still slopes up (longer sessions spend more on average), but read the VERTICAL scatter: it's a tight column on the left and a wide wedge on the right. The spread grows with x — that's <b>heteroscedasticity</b>. The trend is real but predictions get much shakier at high x, and a plain trend-line's confidence band is misleadingly narrow there. Flag it; don't just report the slope."
      },
      {
        type: "scatter",
        title: "Confounded: pooled trend up, reverses within each group (illustrative)",
        xlabel: "ad_spend",
        ylabel: "revenue",
        groups: [
          {
            name: "Q1 (small budget)",
            color: "#4ea1ff",
            points: [[1.0,5.2],[1.3,5.0],[1.6,4.8],[1.9,4.7],[2.2,4.5],[2.5,4.4]]
          },
          {
            name: "Q4 (big budget)",
            color: "#c89bff",
            points: [[5.0,7.2],[5.3,7.0],[5.6,6.9],[5.9,6.7],[6.2,6.6],[6.5,6.4]]
          }
        ],
        lines: [{ color: "#ff7b72", dash: true, points: [[1.0,4.6],[6.5,7.2]] }],
        interpret: "<b>Illustrative — the trap the lesson warns about.</b> The red dashed line through ALL points slopes up, so pooled you'd say 'ad spend raises revenue.' But colour by the confounder (quarter): WITHIN each cluster the slope is actually DOWNWARD. The pooled up-trend is just that the high-budget quarter happens to be the high-revenue one. This is <b>Simpson's paradox</b>: always split by candidate confounders before claiming a relationship — the within-group story can reverse the pooled one."
      }
    ],
    caption: "",
    code: `import numpy as np, pandas as pd
from sklearn.datasets import load_wine

df = load_wine(as_frame=True).frame
names = load_wine().target_names
x, y = "flavanoids", "total_phenols"

# Feature x feature: how tightly do the two numerics move together?
print("corr:", round(df[x].corr(df[y]), 3))          # -> 0.865

# Feature x target: group means show each cultivar's level on both features.
print(df.groupby("target")[[x, y]].mean().round(3))
#         flavanoids  total_phenols
# 0            2.982          2.840
# 1            2.081          2.259
# 2            0.781          1.679

# Subsample <=18 points per class for a readable scatter (colored by target).
rng = np.random.default_rng(7)
for cls in sorted(df["target"].unique()):
    sub = df[df["target"] == cls]
    idx = rng.choice(sub.index, size=min(18, len(sub)), replace=False)
    pts = [[round(float(df.loc[i, x]), 3), round(float(df.loc[i, y]), 3)] for i in idx]
    print(names[cls], pts)`
  };
})();
