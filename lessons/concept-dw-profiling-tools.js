/* Data Wrangling — "Automated EDA / data-profiling tools".
   Self-contained: lesson + CODE + CODEVIZ merged by id "dw-profiling-tools". */
(function () {
  window.LESSONS.push({
    id: "dw-profiling-tools",
    title: "Automated profiling: a full EDA report in one line",
    tagline: "Point a profiler at a fresh dataset and get types, missingness, correlations, and alerts in seconds — then dig in by hand.",
    module: "Data Wrangling",
    prereqs: ["dw-loading-inspecting", "skill-data-audit"],

    whenToUse:
      `<p>Reach for an automated profiler in the <b>first five minutes</b> with a dataset you have never
       seen, or whenever you need a quick <b>health report</b> to hand to someone else.</p>
       <ul>
         <li><b>First contact, fast.</b> The manual inspection battery (<code>.info()</code>,
         <code>.describe()</code>, <code>.nunique()</code>, <code>.isna().sum()</code>) is the right reflex,
         but a profiler runs all of it &mdash; plus distributions, correlations, duplicate-row detection, and
         automatic <b>alerts</b> &mdash; in a single call. It is the fastest possible <b>first pass</b>.</li>
         <li><b>A report to share.</b> <code>ydata-profiling</code> writes a self-contained HTML page you can
         send to a teammate or attach to a ticket: "here is what this table looks like." It is documentation
         you did not have to write.</li>
         <li><b>Catching problems early.</b> The profiler's alerts surface the usual suspects &mdash; a
         constant column, an ID-like column, a pair of near-duplicate columns, a badly imbalanced flag,
         heavy missingness &mdash; so you find them in seconds instead of three hours into modeling.</li>
       </ul>
       <p>EDA = Exploratory Data Analysis: the open-ended looking-around you do before cleaning or modeling.
       A profiler does the <i>mechanical</i> part of that for you. It is a <b>first pass, not the whole
       analysis</b>: it tells you <i>where</i> to look, not <i>what it means</i>.</p>`,

    application:
      `<p>The popular tools all do the same job &mdash; one call, one report &mdash; with different flavors.</p>
       <ul>
         <li><b><code>ydata-profiling</code></b> (formerly <code>pandas-profiling</code>) &mdash; the
         heavyweight. <code>ProfileReport(df).to_file('report.html')</code> gives per-column
         type/stats/distribution, missingness, cardinality, duplicate rows, a correlation matrix,
         interactions, and a list of <b>alerts</b> at the top.</li>
         <li><b><code>sweetviz</code></b> &mdash; pretty HTML, and its specialty is <b>comparing two frames</b>
         (train vs test, this month vs last) or a feature against a target, side by side.</li>
         <li><b><code>dtale</code></b> &mdash; an interactive grid in the browser: sort, filter, chart, and
         run column stats live. Good for poking at the data by hand after the static report.</li>
         <li><b><code>missingno</code></b> &mdash; tiny and focused: it <b>visualizes missingness patterns</b>.
         <code>msno.matrix(df)</code> shows where the holes are; <code>msno.heatmap(df)</code> shows whether
         two columns tend to be missing <i>together</i> (a clue to the missingness mechanism).</li>
       </ul>`,

    pitfalls:
      `<ul>
         <li><b>Profiling a huge dataset un-sampled.</b> A full report computes pairwise correlations and
         per-column histograms for every column &mdash; that is slow and memory-hungry, and on millions of
         rows it can crawl or crash. The fix: <b>sample first</b> (<code>df.sample(50_000)</code>) or pass
         <code>minimal=True</code> to skip the expensive correlation/interaction sections.</li>
         <li><b>Treating the auto-report as the whole analysis.</b> The report finds <i>structure and
         problems</i>; it does not answer your actual question. Use it as the <b>first pass</b>, then do the
         question-driven EDA (the plots and groupbys specific to your goal) by hand. A profiler is a smoke
         detector, not the investigation.</li>
         <li><b>Reading a correlation alert as causation.</b> "High correlation" means two columns move
         together &mdash; nothing more. It can flag a redundant duplicate column (drop one), a leak (a feature
         that secretly encodes the target), or pure coincidence. The alert tells you to <i>look</i>, not what
         is true.</li>
         <li><b>Report overload.</b> Thirty columns produce a wall of charts and dozens of alerts. Read the
         <b>alerts section first</b> and triage; do not try to absorb every histogram. The alerts are the
         profiler's own ranked shortlist of what is worth your attention.</li>
         <li><b>PII (Personally Identifiable Information) leaking into a shared report.</b> The HTML embeds
         sample rows and most-frequent values &mdash; so names, emails, and IDs can end up in a file you email
         around. <b>Drop or mask sensitive columns before profiling</b>, and treat the report as you would the
         raw data.</li>
       </ul>`,

    bigIdea:
      `<p>You already know the manual inspection battery: load the frame, then call <code>.info()</code>,
       <code>.describe()</code>, <code>.nunique()</code>, <code>.isna().sum()</code> and build a mental model
       of every column. A <b>profiler automates that whole battery</b> and adds the parts that are tedious to
       do by hand &mdash; full distributions, a correlation matrix, duplicate-row counts &mdash; then it
       <b>flags the problems for you</b>.</p>
       <p>What you get back, per column and for the frame as a whole:</p>
       <ul>
         <li><b>Type, stats, and distribution</b> for each column (a histogram or bar chart, min/max/mean,
         quantiles).</li>
         <li><b>Missingness</b> &mdash; how much is absent, per column and in patterns.</li>
         <li><b>Cardinality</b> &mdash; the count of distinct values, which separates IDs, flags, categories,
         and continuous features.</li>
         <li><b>Duplicate rows</b> &mdash; exact repeats you may need to drop.</li>
         <li><b>Correlations and interactions</b> &mdash; which columns move together.</li>
         <li><b>Alerts</b> &mdash; an automatic, ranked list: high correlation, high cardinality (an
         ID-like column), constant columns, heavy missingness, imbalance. (Cardinality = the number of
         distinct values a column takes.)</li>
       </ul>
       <p>The alerts are the payoff: instead of eyeballing 30 columns, you read a short list of <i>"here is
       what looks off"</i> and start your real investigation there.</p>`,

    buildup:
      `<p>A profiler is just the manual battery, run for you and summarized. Think of it in three layers.</p>
       <ol>
         <li><b>Per-column summary.</b> For every column it computes the same facts you would by hand &mdash;
         dtype, missing count, distinct count, and the numeric summary (min/quartiles/max) or the
         top categories &mdash; and draws the distribution. This is <code>.describe()</code> plus a histogram,
         times every column, automatically.</li>
         <li><b>Whole-frame relationships.</b> It then computes things that are awkward to do one column at a
         time: the full pairwise <b>correlation matrix</b>, feature <b>interactions</b>, and the count of
         <b>duplicate rows</b>. This layer is what makes the report slow on big data &mdash; correlations are
         pairwise &mdash; and why <code>minimal=True</code> exists to skip it.</li>
         <li><b>Alerts.</b> Finally it applies simple rules to the summaries and emits an <b>alert</b> for each
         hit: a column with one distinct value &rarr; <i>Constant</i>; distinct count equal to the row count
         &rarr; <i>Unique</i> (an ID); a column pair above a correlation threshold &rarr; <i>High
         correlation</i>; a high fraction of nulls &rarr; <i>Missing</i>; one category dominating &rarr;
         <i>Imbalance</i>. These rules are exactly the checks you would run mentally &mdash; the profiler just
         runs them on every column and hands you the failures.</li>
       </ol>
       <p>For missingness specifically, <code>missingno</code> is the focused tool: <code>msno.matrix(df)</code>
       draws one vertical strip per column with gaps where values are absent, so a pattern (e.g. two columns
       missing on the same rows) is visible at a glance.</p>`,

    derivation:
      `<p><b>Why a full profile gets slow, in numbers.</b> The cheap part of a profile is the per-column
       summary: with $c$ columns it does $c$ passes, one per column &mdash; cost grows <i>linearly</i>, so
       doubling the columns roughly doubles the work. The expensive part is the <b>correlation matrix</b>,
       which must look at every <i>pair</i> of columns. The number of unordered pairs of $c$ columns is
       $\\binom{c}{2} = \\frac{c(c-1)}{2}$ &mdash; that grows like $c^2$ (quadratic), so doubling the columns
       roughly <i>quadruples</i> the pair work. (Here $\\binom{c}{2}$, read "c choose 2", is just the count of
       ways to pick 2 distinct columns out of $c$.)</p>
       <ul class="steps">
         <li><b>10 columns:</b> per-column work $=10$ passes; pairs $=\\frac{10\\cdot 9}{2}=45$. The pair work is already ~4.5&times; the column work.</li>
         <li><b>30 columns:</b> per-column work $=30$; pairs $=\\frac{30\\cdot 29}{2}=435$. Tripling columns (10&rarr;30) made the pair count jump ~9.7&times; ($45\\to435$) &mdash; that is the quadratic blow-up.</li>
         <li><b>60 columns:</b> per-column work $=60$; pairs $=\\frac{60\\cdot 59}{2}=1770$. Each of those 1770 pairs also <i>scans every row</i>, so on a 20-million-row frame that is $1770\\times 20{,}000{,}000 \\approx 3.5\\times 10^{10}$ cell reads just for correlations.</li>
         <li><b>The two fixes attack the two factors.</b> <code>minimal=True</code> deletes the pair term entirely (drop the $\\binom{c}{2}$ correlation/interaction work, keep the $c$ cheap summaries). Sampling to 50,000 rows cuts the per-pair row scan by $20{,}000{,}000 / 50{,}000 = 400\\times$. Either one turns a crawl back into seconds. $\\blacksquare$</li>
       </ul>`,

    example:
      `<p>Point <code>ProfileReport</code> at the real 569-row <code>load_breast_cancer</code> frame, roughed
       up like a raw export: add one constant column (<code>const_col = 1.0</code>), one ID column
       (<code>record_id = 0..568</code>), and inject nulls into three measurement columns at 30%, 12%, and 5%.
       The profiler applies one rule per alert type and counts the hits:</p>
       <table class="extable">
         <caption>Alert rule &rarr; trigger &rarr; how many columns/pairs fire (real counts)</caption>
         <thead><tr><th>alert</th><th>rule (per column / pair)</th><th class="num">count</th></tr></thead>
         <tbody>
           <tr><td class="row-h">Constant</td><td>distinct count $=1$</td><td class="num">1</td></tr>
           <tr><td class="row-h">Unique (ID)</td><td>distinct count $=$ row count (569)</td><td class="num">1</td></tr>
           <tr><td class="row-h">Missing</td><td>column has any nulls</td><td class="num">3</td></tr>
           <tr><td class="row-h">High correlation</td><td>$|\\text{corr}| \\gt 0.9$ for a column pair</td><td class="num">14</td></tr>
           <tr><td class="row-h">Imbalance</td><td>top category $\\gt 80\\%$ of rows</td><td class="num">1</td></tr>
         </tbody>
       </table>
       <ul class="steps">
         <li><b>Constant</b> fires once &mdash; <code>const_col</code> has a single distinct value (drop it; no information).</li>
         <li><b>Unique</b> fires once &mdash; <code>record_id</code> has 569 distinct values for 569 rows, i.e. an identifier (drop it as a feature; it would leak or overfit).</li>
         <li><b>Missing</b> fires three times &mdash; once per injected column ($0.30, 0.12, 0.05 \\times 569 \\approx 171, 68, 28$ nulls).</li>
         <li><b>High correlation</b> fires for the <b>14</b> measurement columns tangled in $|\\text{corr}|\\gt0.9$ pairs &mdash; radius, perimeter, and area variants are near-duplicates of one another.</li>
         <li><b>Imbalance</b> fires once for the one flag whose top value clears 80% of rows.</li>
       </ul>
       <p>You read five short alert lines &mdash; total $1+1+3+14+1 = 20$ flags &mdash; and know what to fix
       <i>before</i> opening a single histogram. That is the whole value of automated profiling: it converts
       30 columns of raw data into a ranked to-do list.</p>`,

    practice: [
      {
        q: `Your <code>ProfileReport(df)</code> call has been running for fifteen minutes on a 20-million-row table and the kernel is thrashing. What is happening, and what are the two standard fixes?`,
        steps: [
          { do: `Recall that a full report computes the pairwise correlation matrix and a per-column histogram for every column.`, why: `Pairwise correlations grow with the number of column pairs and scan all rows, so on tens of millions of rows the work explodes in time and memory.` },
          { do: `Sample the rows before profiling: <code>ProfileReport(df.sample(50_000, random_state=0))</code>.`, why: `A profiler is a first-pass smoke test; 50k rows show the same types, missingness, and broad correlations as 20M without the cost.` },
          { do: `Or pass <code>minimal=True</code> to skip the expensive sections.`, why: `<code>minimal=True</code> drops correlations/interactions and keeps the cheap per-column summaries, which is often all you need for first contact.` }
        ],
        answer: `<p>The <b>correlation/interaction and per-column histogram</b> work is quadratic-ish in columns
        and scans every row, so an un-sampled 20M-row frame is slow or crashes. The two fixes:
        <b>sample first</b> (<code>df.sample(50_000)</code>) and/or pass <b><code>minimal=True</code></b> to
        skip the expensive correlation section. Never profile a huge dataset un-sampled.</p>`
      },
      {
        q: `A profiler raises a "High correlation" alert between <code>monthly_charge</code> and <code>total_billed</code> in a churn dataset. A teammate wants to drop one column immediately. What should you check first, and what are the three things this alert can mean?`,
        steps: [
          { do: `Remember that "high correlation" only means the two columns move together — it is not a verdict.`, why: `The alert is a pointer to look, not a conclusion; correlation is not causation and not always redundancy.` },
          { do: `Inspect the pair: are they near-duplicates, is one derived from the target, or is it coincidence?`, why: `<code>total_billed</code> may be <code>monthly_charge</code> times tenure (redundant), or it may encode information about churn timing (a leak), or be unrelated chance.` },
          { do: `Decide based on what you find: drop a true duplicate, remove a leaky feature, or keep both if it is coincidental and both are legitimately predictive.`, why: `Acting on the alert blindly can either throw away signal or leave a leak in place.` }
        ],
        answer: `<p>First <b>look at the pair</b> &mdash; the alert is a prompt, not a decision. A high-correlation
        alert can mean (1) a <b>redundant duplicate</b> column (drop one), (2) a <b>leak</b>, where one feature
        secretly encodes the target or its timing (remove it), or (3) <b>coincidence</b> between two genuinely
        useful features (keep both). Correlation is not causation; investigate before dropping.</p>`
      },
      {
        q: `You profile a customer table and the report looks great, so you email the HTML file to a partner team. Why might this be a serious mistake, and how should you have prepared the frame first?`,
        steps: [
          { do: `Recall that the report embeds sample rows and the most-frequent values for each column.`, why: `Those samples and top-value lists can contain names, emails, phone numbers, or account IDs verbatim.` },
          { do: `Recognize that the HTML is therefore a copy of sensitive raw data, now in an emailable file.`, why: `PII (Personally Identifiable Information) leaving its controlled system is a privacy and compliance violation.` },
          { do: `Drop or mask sensitive columns before profiling: <code>ProfileReport(df.drop(columns=pii_cols))</code>.`, why: `Profiling only the non-sensitive columns produces a shareable report with no personal data embedded.` }
        ],
        answer: `<p>The report <b>embeds raw sample rows and top values</b>, so a shared HTML can leak <b>PII
        (Personally Identifiable Information)</b> &mdash; names, emails, IDs &mdash; into an emailable file.
        Before profiling, <b>drop or mask the sensitive columns</b> and treat the report with the same care as
        the underlying data.</p>`
      }
    ]
  });

  window.CODE["dw-profiling-tools"] = {
    lib: "ydata-profiling + missingno + sweetviz",
    runnable: false,
    explain: `<p>The one-line profiling workflow on the <b>Titanic</b> dataset (ships with seaborn; mixed
      dtypes and real missingness, so it exercises every alert). <code>ydata-profiling</code> writes a full
      HTML report; <code>minimal=True</code> skips the expensive correlation/interaction sections for speed.
      <code>missingno</code> draws the missingness pattern, and <code>sweetviz</code> compares two frames
      (e.g. survivors vs non-survivors). Install with
      <code>pip install ydata-profiling missingno sweetviz</code>; <code>runnable</code> is off because these
      write/inspect HTML and figures, not console output.</p>`,
    code: `import seaborn as sns
from ydata_profiling import ProfileReport   # formerly: pandas-profiling
import missingno as msno
import sweetviz as sv

# --- A real-ish frame with mixed dtypes and genuine missingness ---
df = sns.load_dataset('titanic')             # 891 rows; 'age' and 'deck' are missing-heavy

# === ydata-profiling: the whole inspection battery + alerts in ONE call ===
# Full report (per-column stats/distributions, missingness, duplicates,
# correlations, interactions, and an ALERTS section at the top):
ProfileReport(df, title='Titanic profile').to_file('report.html')

# On a BIG dataset, sample first and/or pass minimal=True to skip the
# expensive correlation/interaction sections:
ProfileReport(df.sample(500, random_state=0), minimal=True).to_file('report_fast.html')

# Read the alerts programmatically instead of opening the HTML:
report = ProfileReport(df, minimal=True)
for alert in report.get_description().alerts:
    print(alert)                             # e.g. [HIGH_CARDINALITY] deck, [MISSING] age ...

# === missingno: SEE the missingness pattern (the focused tool) ===
msno.matrix(df)        # one strip per column; gaps mark missing values
msno.heatmap(df)       # do two columns tend to be missing on the SAME rows?

# === sweetviz: COMPARE two frames side by side (its specialty) ===
survived    = df[df['survived'] == 1]
not_survived = df[df['survived'] == 0]
sv.compare([survived, 'Survived'], [not_survived, 'Did not survive']).show_html('compare.html')

# A profiler is the FAST FIRST PASS: it tells you WHERE to look.
# You then do the question-driven EDA (targeted plots/groupbys) by hand.`
  };

  window.CODEVIZ["dw-profiling-tools"] = {
    question: "Read the profiler's alerts section as a bar chart: how do you tell a messy raw export, a clean frame, and an overwhelming alert-storm apart at a glance?",
    charts: [
      {
        type: "bars",
        title: "Messy raw export: a short, readable alert list (the useful case)",
        xlabel: "alert type",
        ylabel: "number of columns / pairs flagged",
        labels: ["High correlation", "Missing", "Unique (ID)", "Constant", "Imbalance"],
        values: [14, 3, 1, 1, 1],
        valueLabels: ["14", "3", "1", "1", "1"],
        colors: ["#ff7b72", "#d29922", "#79c0ff", "#a371f7", "#7ee787"],
        interpret: "Each bar is one ALERT TYPE; its height is how many columns (or column-pairs) tripped that rule. These are REAL counts from load_breast_cancer (569 rows) roughed up like a raw export. Read it as a ranked to-do list: <b>High correlation (14)</b> dominates because radius/perimeter/area variants are near-duplicates — look there first; <b>Missing (3)</b> is the three columns you have nulls in; the single <b>Unique</b> bar is a planted ID column, <b>Constant</b> a one-value column, <b>Imbalance</b> a lopsided flag. This one chart replaces eyeballing 33 columns: it tells you WHERE to look, not what it means."
      },
      {
        type: "bars",
        title: "Clean frame: almost nothing fires — the all-clear",
        xlabel: "alert type",
        ylabel: "number of columns / pairs flagged",
        labels: ["High correlation", "Missing", "Unique (ID)", "Constant", "Imbalance"],
        values: [1, 0, 0, 0, 0],
        valueLabels: ["1", "0", "0", "0", "0"],
        colors: ["#7ee787", "#9aa7b4", "#9aa7b4", "#9aa7b4", "#9aa7b4"],
        interpret: "Illustrative. Same axes, but on a tidy already-cleaned frame nearly every bar is zero — only one mild High-correlation pair survives. <b>An empty alerts section is the GOOD outcome:</b> no constant junk, no missingness, no ID leak. Do not read 'few alerts' as 'profiler failed' — it means this table is in good shape, so move straight to your question-driven EDA instead of cleanup."
      },
      {
        type: "bars",
        title: "Alert storm: a wall of alerts you must triage, not read top-to-bottom",
        xlabel: "alert type",
        ylabel: "number of columns / pairs flagged",
        labels: ["High correlation", "Missing", "Unique (ID)", "High cardinality", "Imbalance"],
        values: [120, 18, 6, 9, 11],
        valueLabels: ["120", "18", "6", "9", "11"],
        colors: ["#ff7b72", "#ff7b72", "#ffb454", "#ffb454", "#ffb454"],
        interpret: "Illustrative, for a wide ~60-column frame. Now the bars are huge — 120 high-correlation pairs alone. This is 'report overload': the alerts section is itself too big to read line by line. <b>Triage by height:</b> the tall High-correlation/Missing bars mean systemic problems (redundant column families, a broken join dropping values), so fix the structure first rather than chasing individual histograms. A storm like this is also the cue to sample rows or pass minimal=True before re-profiling."
      }
    ],
    caption: "Three shapes of the SAME alerts-by-type bar chart. Bar = one alert rule (distinct==1 → Constant, distinct==n_rows → Unique/ID, |corr|>0.9 → High correlation, any nulls → Missing, top category>80% → Imbalance); height = how many columns/pairs tripped it. The MAIN chart uses real counts from a roughed-up load_breast_cancer (569 rows). The clean and storm variants are illustrative but qualitatively honest: a tidy frame fires almost nothing (the all-clear), while a wide messy frame produces a wall you must triage by bar height instead of reading line by line.",
    code: `import numpy as np
import pandas as pd
from sklearn.datasets import load_breast_cancer

# Real bundled dataset: 569 cell-nucleus measurements.
df = load_breast_cancer(as_frame=True).frame.copy()
n = len(df)
rng = np.random.RandomState(0)

# --- Rough it up to look like a raw export ---
df['const_col'] = 1.0                       # a column with ONE value
df['record_id'] = np.arange(n)              # a unique ID column
for col, frac in [('mean radius', 0.30), ('mean texture', 0.12), ('mean area', 0.05)]:
    idx = rng.choice(n, int(frac * n), replace=False)
    df.loc[idx, col] = np.nan                # inject missingness

# --- Apply ydata-profiling-style alert RULES and count each kind ---
alerts = {'High correlation': 0, 'Missing': 0, 'Unique (ID)': 0,
          'Constant': 0, 'Imbalance': 0}

corr = df.select_dtypes('number').corr().abs()
high = set()
for i, a in enumerate(corr.columns):
    for b in corr.columns[i + 1:]:
        if corr.loc[a, b] > 0.9:            # near-duplicate columns
            high.add(a); high.add(b)
alerts['High correlation'] = len(high)

for c in df.columns:
    nu = df[c].nunique(dropna=True)
    if nu == 1:            alerts['Constant']   += 1     # one distinct value
    if nu == n:            alerts['Unique (ID)'] += 1    # distinct == n_rows
    if df[c].isna().any(): alerts['Missing']    += 1     # any nulls
    if 0 < nu <= 20 and df[c].value_counts(normalize=True).iloc[0] > 0.8:
        alerts['Imbalance'] += 1                          # one category dominates

print(alerts)
# -> {'High correlation': 14, 'Missing': 3, 'Unique (ID)': 1,
#     'Constant': 1, 'Imbalance': 1}`
  };
})();
