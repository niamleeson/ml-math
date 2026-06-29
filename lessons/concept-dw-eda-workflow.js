/* Data Wrangling — "Exploratory Data Analysis: the disciplined first look".
   Self-contained: lesson + CODE + CODEVIZ merged by id "dw-eda-workflow". */
(function () {
  window.LESSONS.push({
    id: "dw-eda-workflow",
    title: "EDA: the disciplined first look at your data",
    tagline: "Before you model, ask a question, look, notice, guess, check — then ask the next question.",
    module: "Data Wrangling",
    prereqs: ["dw-loading-inspecting", "skill-data-audit"],

    bigIdea:
      `<p><b>EDA (Exploratory Data Analysis)</b> is the open-ended detective work you do on a dataset
       <b>before</b> you fit any model. The name and the spirit come from the statistician
       <b>John Tukey</b>, who argued that you should <i>look</i> at data with simple summaries and pictures
       to find out what is going on &mdash; not just run a test to confirm what you already believed.</p>
       <p>The thing to copy from Tukey is the <b>attitude</b>, not a checklist. EDA is a loop:
       <b>ask a question &rarr; look (a summary or a plot) &rarr; notice something &rarr; form a hypothesis
       &rarr; check it &rarr; ask the next question.</b> You go around that loop dozens of times in the first
       hour with a new dataset. Each lap teaches you one fact and points to the next question.</p>
       <p>This lesson is the <b>map</b> of that loop. The individual moves &mdash; looking at one variable,
       looking at two, computing summary numbers, reading correlations, handling time &mdash; each get their
       own sibling lesson. Here you learn the <b>order</b> to do them in and <b>why</b> the order matters.</p>`,

    buildup:
      `<p><b>What to look at, in order.</b> A new dataset is overwhelming, so EDA has a natural progression
       from "the whole table" down to "how variables relate". Going in this order means each step's
       findings inform the next.</p>
       <ol>
         <li><b>Shape and types.</b> How many rows and columns? What is each column's data type (number,
         category, date, text)? A column you <i>thought</i> was numeric may be stored as text &mdash; you want
         to know that on minute one. (See the sibling lesson <code>dw-loading-inspecting</code>.)</li>
         <li><b>Missingness.</b> Which columns have missing values, and how many? A column that is 90% empty
         is almost a different problem than one that is 1% empty.</li>
         <li><b>One variable at a time (univariate).</b> For each column, look at its distribution: a
         histogram for numbers, a bar of value counts for categories. You are checking center, spread, shape
         (skew), and surprises (impossible values, spikes at zero, a secret "-999" code for missing).</li>
         <li><b>Two variables at a time (bivariate).</b> Now relationships: a scatter for two numbers, a box
         plot of a number split by a category, a correlation between numeric pairs.</li>
         <li><b>Many variables / groups / time (multivariate).</b> Color a scatter by a third variable, read
         a correlation heatmap of the whole table, compare distributions across groups, or plot a value over
         time if the data has a date.</li>
       </ol>
       <p>The slogan is <b>univariate &rarr; bivariate &rarr; multivariate</b>: understand each variable on its
       own before you trust any story about how they connect.</p>`,

    whatItDoes:
      `<p>EDA has four concrete <b>goals</b>. Every plot you draw should serve at least one of them.</p>
       <ul>
         <li><b>Understand the data.</b> Build a mental model of what each column means, its typical values,
         and its range. You cannot wrangle or model what you do not understand.</li>
         <li><b>Find problems.</b> Data-entry errors, impossible values, duplicate rows, outliers, a column
         that is secretly a copy of the target (a <b>leakage</b> signal &mdash; see <code>skill-leakage</code>).
         EDA is where these surface, cheaply, before they poison a model.</li>
         <li><b>Check assumptions.</b> Is the target roughly balanced or wildly skewed? Are the classes
         present at all? Is a feature you planned to use even populated? Confirm before you build on it.</li>
         <li><b>Generate hypotheses.</b> EDA is where you <i>discover</i> candidate features and relationships
         ("price seems to jump at the 3-bedroom mark") that you then test properly later. It is the front of
         the pipeline, not the verdict.</li>
       </ul>`,

    derivation:
      `<p><b>Why the loop, and why the order.</b></p>
       <ul class="steps">
         <li>Tukey's core point: <b>confirmatory</b> analysis (run one planned test, get a p-value) and
         <b>exploratory</b> analysis (look around, let the data raise questions) are different jobs. EDA is the
         exploratory half, and skipping it means you confirm tests on data you never actually looked at.</li>
         <li><b>Look before you compute.</b> A single summary number can hide a lot. Anscombe's quartet is the
         classic warning: four tiny datasets with <i>identical</i> means, variances, and correlations, yet
         wildly different shapes &mdash; one is a clean line, one is a curve, one is a line dragged by a single
         outlier. The numbers agree; the pictures do not. So plot, do not just describe.</li>
         <li><b>Univariate first because bivariate findings are untrustworthy otherwise.</b> If you jump
         straight to "feature A correlates with the target" without first noticing that A is 80% missing or has
         a giant outlier, the correlation is an artifact. Clean understanding of each variable comes first.</li>
         <li><b>The loop is iterative because each finding changes the next question.</b> You see a spike at
         zero &rarr; you ask "is zero real or a missing-value code?" &rarr; you check &rarr; that answer changes
         how you read every later plot of that column. You cannot pre-plan all the questions; you earn them.</li>
         <li><b>Write down what you find.</b> EDA's output is not the plots &mdash; it is a short list of
         <i>findings and decisions</i> ("proline is right-skewed, will log-transform"; "target is 59/71/48, mildly
         imbalanced"). Those notes drive your cleaning and feature engineering. An EDA you didn't record is an
         EDA you'll redo. $\\blacksquare$</li>
       </ul>`,

    example:
      `<p>You just loaded a housing dataset of <b>1,000</b> rows. Walk one lap of the
       <b>ask&rarr;look&rarr;notice&rarr;hypothesize&rarr;check&rarr;next</b> loop, with real counts.</p>
       <table class="extable">
         <caption>One lap of the EDA loop, as a ledger.</caption>
         <thead><tr><th>move</th><th>what happens</th></tr></thead>
         <tbody>
           <tr><td class="row-h">ask</td><td>"What does the sale <code>price</code> look like?"</td></tr>
           <tr><td class="row-h">look</td><td>histogram of <code>price</code> &mdash; heavily right-skewed, long tail of expensive homes</td></tr>
           <tr><td class="row-h">notice</td><td>a tall spike at exactly <code>0</code></td></tr>
           <tr><td class="row-h">hypothesize</td><td>"price 0 is a placeholder, not a real sale"</td></tr>
           <tr><td class="row-h">check</td><td>filter <code>price == 0</code> &rarr; 40 rows, all family transfers</td></tr>
           <tr><td class="row-h">next</td><td>"drop those 40 rows, and model <code>log(price)</code>?"</td></tr>
         </tbody>
       </table>
       <ul class="steps">
         <li><b>Look:</b> the histogram is right-skewed &mdash; most homes cluster low, a thin tail runs high.</li>
         <li><b>Check, with a real count.</b> Filter to <code>price == 0</code> and count: <b>40</b> of the
         <b>1,000</b> rows, i.e. $\\tfrac{40}{1000}=4\\%$. Inspecting them shows family transfers with no money
         changing hands &mdash; not real sales.</li>
         <li><b>Decide.</b> Drop those 40 rows: $1000-40=\\mathbf{960}$ valid sales remain. The skew is large
         enough that you will model <code>log(price)</code> next.</li>
       </ul>
       <p>And a real assumption-check on the bundled wine target, which the lesson cites &mdash; is it balanced?
       Counting the three classes gives:</p>
       <table class="extable">
         <caption>Wine target distribution (178 rows): mildly imbalanced, not pathological.</caption>
         <thead><tr><th>class</th><th class="num">count</th><th class="num">share</th></tr></thead>
         <tbody>
           <tr><td class="row-h">class 0</td><td class="num">59</td><td class="num">33.1%</td></tr>
           <tr><td class="row-h">class 1</td><td class="num">71</td><td class="num">39.9%</td></tr>
           <tr><td class="row-h">class 2</td><td class="num">48</td><td class="num">27.0%</td></tr>
           <tr><td class="row-h">total</td><td class="num">178</td><td class="num">100%</td></tr>
         </tbody>
       </table>
       <p>Check the arithmetic: $59+71+48=178$, and $59/178\\approx0.331$. One question became a finding (the
       0-spike, 40 rows), a decision (drop the transfers, keep 960), and the next question (log-transform).
       That is the whole job, repeated.</p>`,

    whenToUse:
      `<p><b>Always, and early.</b></p>
       <ul>
         <li><b>Before any modeling.</b> EDA is the first thing you do after loading a dataset and before you
         engineer a single feature or fit a single model. It is how you decide what cleaning and what features
         the project even needs.</li>
         <li><b>Whenever the data changes.</b> A new month's extract, a new data source, a schema change, a
         vendor swap &mdash; re-run the first-look template. Distributions drift and pipelines break silently;
         EDA is how you catch it.</li>
         <li><b>When a model misbehaves.</b> Surprising metrics or a too-good-to-be-true score often trace back
         to something EDA would have caught (leakage, a constant column, a target that is 99% one class).</li>
         <li><b>Pairs with the data audit.</b> EDA is the <i>looking</i>; the structured checklist version of it
         is <code>skill-data-audit</code>. Use the audit to make sure you didn't skip a step.</li>
       </ul>`,

    application:
      `<p>EDA shows up at the start of essentially every real data project.</p>
       <ul>
         <li><b>Kaggle / competition kickoff.</b> The first notebook anyone publishes for a new competition is
         an "EDA" notebook: shape, missingness, target distribution, feature histograms, a correlation heatmap.
         It is the shared first look the whole community builds on.</li>
         <li><b>Data quality gates.</b> The same first-look summaries, run automatically on every new batch,
         become monitoring (see <code>skill-monitoring</code>): alert if missingness jumps or a distribution
         shifts.</li>
         <li><b>Finding the leak.</b> A column that correlates 0.99 with the target, or a timestamp that only
         exists for positive labels, is exactly the kind of thing EDA surfaces &mdash; the difference between a
         model that works in the lab and one that works in production.</li>
       </ul>`,

    pitfalls:
      `<ul>
         <li><b>Jumping straight to modeling.</b> Fitting a model on data you have not looked at means you
         find its problems through confusing metrics instead of clear plots. The fix: spend the first 15
         minutes on the EDA template <i>before</i> any <code>.fit()</code>.</li>
         <li><b>Confirmation bias.</b> Only plotting what you expect to see, and stopping when you find it. EDA
         is supposed to <i>surprise</i> you. The fix: deliberately look at every column, including the boring
         ones, and chase the things that look wrong rather than the things that look right.</li>
         <li><b>Plotting without a question.</b> Drawing 50 charts on autopilot produces noise, not
         understanding. The fix: each plot should answer a stated question ("is the target balanced?") and
         lead to the next one.</li>
         <li><b>EDA on the test set (peeking).</b> Exploring the held-out test set &mdash; looking at its
         distributions, its target &mdash; lets test information leak into your decisions, inflating your score.
         The fix: do EDA on the <b>training set only</b>; keep the test set sealed until final evaluation.</li>
         <li><b>Not writing anything down.</b> If your EDA leaves no notes, the findings live only in your head
         and the work gets redone. The fix: keep a running list of findings and the cleaning/feature decisions
         each one implies.</li>
       </ul>`,

    practice: [
      {
        q: `You get a fresh dataset and have 15 minutes before a meeting. In what order do you look at things, and why that order?`,
        steps: [
          { do: `Start with <b>shape and dtypes</b> (<code>df.shape</code>, <code>df.info()</code>), then <b>missingness</b> per column.`, why: `These frame everything: how big the data is, what each column is, and which columns are too empty to trust.` },
          { do: `Then go <b>univariate</b>: a histogram for each number, value counts for each category, and the target's distribution.`, why: `You must understand each variable alone &mdash; skew, outliers, hidden missing codes &mdash; before any relationship between variables can be trusted.` },
          { do: `Then go <b>bivariate and multivariate</b>: scatters, a correlation heatmap, distributions split by group or over time.`, why: `Relationships only mean something once you know each variable is clean and well-understood.` }
        ],
        answer: `<p><b>Shape/types &rarr; missingness &rarr; univariate &rarr; bivariate &rarr; multivariate.</b> The order goes from the whole table down to relationships. Each step's findings (a column is 80% empty, a feature is skewed) change how you read the next step, and relationship findings are only trustworthy once each variable is understood on its own.</p>`
      },
      {
        q: `A teammate is excited: a feature correlates 0.98 with the target, so they want to use it. What does disciplined EDA tell you to do first?`,
        steps: [
          { do: `Be suspicious of a near-perfect correlation &mdash; real features rarely predict the target that well.`, why: `An almost-perfect correlation is a classic <b>leakage</b> signal: the feature may be a copy of, or computed from, the target.` },
          { do: `Look at <i>how</i> the feature is produced and whether it would be available at prediction time.`, why: `If the value is only known after the outcome (or is derived from it), using it leaks the answer and the model will collapse in production.` },
          { do: `Plot the feature against the target and inspect rows.`, why: `EDA's job here is to <b>find the problem</b>, not to confirm the exciting result.` }
        ],
        answer: `<p>Treat the 0.98 as a <b>red flag, not a win</b>. A correlation that high usually means <b>leakage</b> &mdash; the feature encodes the target or is unavailable at prediction time. EDA's goal of "find problems" says: investigate where the feature comes from and whether it exists at prediction time before trusting it (see <code>skill-leakage</code>).</p>`
      },
      {
        q: `Why is it a mistake to draw histograms and correlations on the combined train + test data, and what should you do instead?`,
        steps: [
          { do: `Recognize that looking at the test set's distributions and target is a form of <b>peeking</b>.`, why: `Decisions you make after seeing the test set (which features to keep, how to bin, what to drop) bake test information into your pipeline.` },
          { do: `Do all EDA on the <b>training set only</b>.`, why: `This keeps the test set a true held-out estimate of generalization.` },
          { do: `Open the test set only for final evaluation.`, why: `Any earlier look risks an optimistic, irreproducible score.` }
        ],
        answer: `<p>Exploring the test set lets its information leak into your modeling decisions, inflating your reported score &mdash; the <b>peeking</b> pitfall. Do EDA on the <b>training set only</b> and keep the test set sealed until the final evaluation.</p>`
      }
    ]
  });

  window.CODE["dw-eda-workflow"] = {
    lib: "pandas + matplotlib + seaborn",
    runnable: false,
    explain: `<p>The "first 15 minutes" template you run on any new dataset. It walks the EDA loop in order:
       <b>shape/types &rarr; describe &rarr; missingness &rarr; numeric histograms &rarr; categorical value counts
       &rarr; correlation heatmap &rarr; target distribution</b>. Swap in your own dataframe at the top; here it
       uses the bundled <code>load_wine</code> so it runs as-is. Treat each cell as a question to answer, not a
       box to tick &mdash; and run it on your <b>training split only</b>, never the test set.</p>`,
    code: `import numpy as np
import pandas as pd
import matplotlib.pyplot as plt
import seaborn as sns
from sklearn.datasets import load_wine

# Use your own data here; load_wine gives a clean bundled example to run as-is.
data = load_wine(as_frame=True)
df = data.frame                       # 13 numeric features + 'target'
target = 'target'

# IMPORTANT: in a real project, split first and explore the TRAIN set only.
# from sklearn.model_selection import train_test_split
# df, _ = train_test_split(df, test_size=0.2, random_state=0, stratify=df[target])

# 1) Shape and types -- the whole-table view.
print(df.shape)                       # (rows, columns)
df.info()                             # dtypes + non-null counts per column
print(df.describe().T)                # count/mean/std/min/quartiles/max for numerics

# 2) Missingness -- which columns are too empty to trust?
missing = df.isna().mean().mul(100).sort_values(ascending=False)
print(missing[missing > 0])           # percent missing, worst first

# 3) Univariate (numeric): a histogram grid of every numeric column.
num_cols = df.select_dtypes('number').columns.drop(target, errors='ignore')
df[num_cols].hist(figsize=(12, 9), bins=30)
plt.suptitle('Univariate: numeric distributions'); plt.tight_layout(); plt.show()

# 3b) Univariate (categorical): value_counts for each non-numeric column.
cat_cols = df.select_dtypes(exclude='number').columns
for c in cat_cols:
    print(c)
    print(df[c].value_counts(dropna=False).head(10), '\\n')

# 4) Multivariate: correlation heatmap of the numeric features.
corr = df[num_cols].corr()
plt.figure(figsize=(9, 7))
sns.heatmap(corr, cmap='coolwarm', center=0, square=True)
plt.title('Numeric correlation heatmap'); plt.tight_layout(); plt.show()

# 5) Check an assumption: is the target balanced?
print(df[target].value_counts())
df[target].value_counts().sort_index().plot.bar()
plt.title('Target distribution'); plt.tight_layout(); plt.show()

# Now WRITE DOWN findings: skewed columns to transform, missing columns to fix,
# class (im)balance, suspicious correlations -- these decisions drive cleaning.`
  };

  window.CODEVIZ["dw-eda-workflow"] = {
    question: "On a brand-new dataset (load_wine), the first univariate pass computes the skew of every feature to flag which are lopsided — but how do you READ the histograms those skew numbers stand for, including the shapes EDA exists to catch?",
    charts: [
      {
        type: "bars",
        title: "Ideal univariate summary: skew of each feature (|skew| > 0.5 = lopsided)",
        labels: ["magnesium", "malic_acid", "color_intensity", "proline", "proanthoc.",
                 "nonflav.phen.", "alcal_ash", "tot_phenols", "flavanoids", "hue",
                 "alcohol", "ash", "od280/od315"],
        values: [1.10, 1.04, 0.87, 0.77, 0.52, 0.45, 0.21, 0.09, 0.03, 0.02, -0.05, -0.18, -0.31],
        valueLabels: ["1.10", "1.04", "0.87", "0.77", "0.52", "0.45", "0.21", "0.09",
                      "0.03", "0.02", "-0.05", "-0.18", "-0.31"],
        colors: ["#ff7b72", "#ff7b72", "#ff7b72", "#ff7b72", "#ff7b72",
                 "#d29922", "#d29922", "#7ee787", "#7ee787", "#7ee787",
                 "#7ee787", "#7ee787", "#7ee787"],
        interpret: "Each bar is one feature's <b>skew</b> — how lopsided its distribution is (0 symmetric, positive = long right tail). Bars are sorted, so reading top-down ranks where to look first: red bars (magnesium 1.10, malic_acid 1.04, color_intensity 0.87, proline 0.77) clear the 0.5 rule-of-thumb and are transform candidates; green bars near 0 (alcohol, ash, hue) are already symmetric. Conclude: one number per column turns 13 histograms into a to-do list — this is the 'notice something' step made concrete."
      },
      {
        type: "hist",
        title: "Healthy: proline is right-skewed (skew 0.77) but well-behaved",
        labels: ["278", "500", "722", "944", "1166", "1388", "1610"],
        values: [22, 41, 38, 30, 24, 15, 8],
        colors: ["#7ee787", "#7ee787", "#7ee787", "#7ee787", "#ffb454", "#ffb454", "#ffb454"],
        interpret: "Illustrative shape behind the skew = 0.77 bar. X is the value of proline binned into ranges; Y is how many of the 178 wines fall in each bin. The bulk sits on the left with a thinning <b>right tail</b> (orange) — that long tail is exactly what a positive skew number reports. Conclude: this is normal right-skew, not an error; a log transform would pull the tail in and make the column more symmetric for modelling."
      },
      {
        type: "hist",
        title: "Problem to catch: a hidden -999 missing code spikes the left",
        labels: ["-999", "278", "500", "722", "944", "1166", "1388"],
        values: [14, 20, 39, 36, 28, 14, 7],
        colors: ["#ff7b72", "#7ee787", "#7ee787", "#7ee787", "#7ee787", "#ffb454", "#ffb454"],
        interpret: "Illustrative shape. A lone tall bar (red) sitting far from the rest of the data is the classic EDA red flag: a placeholder like -999 or 0 stuffed in for <b>missing</b> values. The skew number alone would just say 'very skewed' and hide the cause — only the picture reveals the impossible spike. Conclude: don't transform yet; find out if that bar is a real value or a missing-code, fix it, then re-look. This is why EDA says look, don't just compute."
      },
      {
        type: "hist",
        title: "Problem to catch: bimodal — two groups mixed in one column",
        labels: ["1.0", "1.6", "2.2", "2.8", "3.4", "4.0", "4.6"],
        values: [9, 34, 18, 6, 19, 31, 7],
        colors: ["#c89bff", "#c89bff", "#c89bff", "#9aa7b4", "#4ea1ff", "#4ea1ff", "#4ea1ff"],
        interpret: "Illustrative shape. <b>Two humps</b> with a valley between them mean the column is really a mix of two sub-populations (e.g. two grape varieties). A single skew or mean number is misleading here — it lands in the empty valley where almost no data sits. Conclude: a transform won't help; instead find the variable that splits the two modes and analyse each group, or colour later plots by it. Bimodality is something you can only see by plotting."
      }
    ],
    caption: "Ideal skew summary + the histogram shapes it stands for. The bars rank all 13 features (red = |skew|>0.5). A healthy right-skewed column (proline) just has a long tail; but the same skew machinery hides a -999 missing-code spike and a bimodal two-group mix — shapes only a plot reveals, which is exactly why EDA says look before you compute.",
    code: `import numpy as np
from sklearn.datasets import load_wine

df = load_wine(as_frame=True).frame          # 178 rows, 13 numeric features + target
feats = [c for c in df.columns if c != 'target']

# Skew of every numeric feature, most right-skewed first -- the first univariate pass.
skew = df[feats].skew().sort_values(ascending=False)
print(skew.round(2))
# magnesium        1.10   malic_acid       1.04   color_intensity  0.87
# proline          0.77   proanthocyanins  0.52   nonflavanoid..   0.45
# alcalinity_ash   0.21   total_phenols    0.09   flavanoids       0.03
# hue              0.02   alcohol         -0.05   ash             -0.18
# od280/od315     -0.31
# Rule of thumb: |skew| > 0.5 is noticeably lopsided -> candidate for a transform.`
  };
})();
