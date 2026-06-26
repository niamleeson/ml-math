/* Data Wrangling — "Handling missing values".
   Self-contained: lesson + CODE + CODEVIZ merged by id "dw-missing-data". */
(function () {
  window.LESSONS.push({
    id: "dw-missing-data",
    title: "Handling missing values: detect, choose, impute (without leaking)",
    tagline: "Find the holes, figure out WHY they are there, then drop or fill — fit on train only.",
    module: "Data Wrangling",
    prereqs: ["skill-data-audit", "met-data-quality", "skill-leakage"],

    whenToUse:
      `<p>Almost every real dataset has missing values. A sensor drops out. A user skips a survey
       question. A join finds no match. Before you can model anything, you have to decide what to do
       with the blanks.</p>
       <p>The decision has two inputs: <b>why</b> the values are missing (the mechanism), and <b>how
       much</b> is missing (the fraction).</p>
       <ul>
         <li><b>Tiny fraction, no clear pattern</b> &mdash; dropping the affected rows is fine.</li>
         <li><b>A column is mostly empty</b> &mdash; consider dropping the whole column.</li>
         <li><b>A meaningful fraction, and you need the rows</b> &mdash; impute (fill in) the blanks,
         and often add a flag recording that the value was missing.</li>
       </ul>
       <p>The mechanism is what tells you whether dropping is safe or biased, and whether the very fact
       that a value was missing is itself a clue worth keeping.</p>`,

    application:
      `<p>This is the first thing you do after the data audit and before feature engineering.</p>
       <ul>
         <li><b>Tabular models.</b> Linear / logistic regression and most scikit-learn estimators
         <b>cannot accept</b> a <code>NaN</code> ("Not a Number", the marker pandas uses for a missing
         cell). You must drop or fill before <code>.fit</code>. (Some tree libraries like XGBoost and
         LightGBM handle <code>NaN</code> natively &mdash; the exception, not the rule.)</li>
         <li><b>Time series.</b> A gap in a daily metric is usually filled by carrying the last known
         value forward (forward fill) or, near the start, pulling the next one backward (back fill).</li>
         <li><b>Surveys and forms.</b> A blank "income" field is often missing for a <i>reason</i>
         (people who earn a lot skip it). There the blank itself carries signal.</li>
       </ul>`,

    pitfalls:
      `<ul>
         <li><b>Mean-imputing distorts the distribution and shrinks variance.</b> Replacing every blank
         with one number stacks a tall <b>spike</b> at that number. The histogram develops a fake peak,
         the variance drops, and correlations get diluted. <b>Fix:</b> prefer the <b>median</b> for
         skewed numeric columns, and add a missingness indicator so the model can still tell the
         imputed rows apart.</li>
         <li><b>Dropping rows biases the sample unless data is MCAR.</b> If the rows that go missing
         are systematically different (high earners skip "income"), throwing them out reshapes your
         population. <b>Fix:</b> only drop freely when missingness is MCAR (defined below); otherwise
         impute and keep an indicator.</li>
         <li><b>Imputing on the full dataset leaks.</b> If you compute the mean / median / KNN
         ("K-Nearest Neighbours") neighbours over <i>all</i> rows including the test set, test
         information bleeds into training. <b>Fix:</b> <code>fit</code> the imputer on the
         <b>training set only</b>, then <code>transform</code> everything &mdash; easiest inside a
         <code>Pipeline</code>.</li>
         <li><b>Ignoring that missingness is itself a signal.</b> When a value is MNAR (defined below),
         the pattern of which cells are blank can predict the target. Dropping or silently filling
         erases that. <b>Fix:</b> add a 0/1 <b>missingness indicator</b> column.</li>
         <li><b>Imputing the target.</b> Never fill in missing <i>labels</i> with a model-based guess
         and then train on them as if real &mdash; you would be teaching the model your own
         assumptions. Drop rows with a missing target, or treat label-recovery as a separate,
         carefully-validated problem.</li>
       </ul>`,

    bigIdea:
      `<p>A blank cell is not nothing &mdash; it is a small mystery. The whole craft of handling missing
       values is: <b>(1)</b> measure how many blanks there are and where, <b>(2)</b> reason about
       <i>why</i> they are blank, and <b>(3)</b> pick drop-or-fill accordingly &mdash; while never
       letting the test set influence the fill.</p>
       <p><b>Detect.</b> The one-line summary is <code>df.isna().sum()</code> &mdash; the number of
       missing cells per column. Divide by <code>len(df)</code> for a percentage. The
       <code>missingno</code> library draws this: a matrix plot where blanks show as white streaks, so
       you can <i>see</i> whether two columns go missing together.</p>
       <p><b>Mechanism.</b> Statisticians (Rubin's classic taxonomy) name three reasons a value can be
       missing, and they change what you are allowed to do:</p>
       <ul>
         <li><b>MCAR (Missing Completely At Random)</b> &mdash; the blank has <i>nothing</i> to do with
         any value, observed or not. A lab machine randomly drops 1% of readings. Here dropping rows is
         <b>unbiased</b>: the survivors are a fair sample.</li>
         <li><b>MAR (Missing At Random)</b> &mdash; the blank depends on <i>other observed</i> columns
         but not on the missing value itself. Older patients skip a fitness question more often; once
         you know age, the blanks are random. Here imputation that <i>uses the other columns</i>
         (KNN, model-based) can recover the value well.</li>
         <li><b>MNAR (Missing Not At Random)</b> &mdash; the blank depends on the <i>missing value
         itself</i>. High earners skip "income" <i>because</i> it is high. No amount of looking at the
         other columns fully fixes this; the safest move is to keep a <b>missingness indicator</b>, so
         the model can use "this person declined to answer" as a feature.</li>
       </ul>
       <p>You can rarely <i>prove</i> the mechanism from the data alone &mdash; it is a judgement about
       the data-generating process. But naming it tells you whether dropping is safe and whether the
       indicator matters.</p>`,

    buildup:
      `<p>Once you know the mechanism and the fraction, you choose from a small menu.</p>
       <p><b>Drop.</b> <code>df.dropna()</code> removes rows with any blank; <code>dropna(axis=1)</code>
       removes columns. Drop rows when the missing fraction is small and the mechanism is MCAR. Drop a
       column when it is mostly empty (say &gt; 50% missing) and not central.</p>
       <p><b>Impute (single-value).</b> <code>SimpleImputer</code> fills every blank in a column with one
       learned constant: the <b>mean</b> or <b>median</b> for numeric columns, the <b>mode</b> (most
       frequent value) for categorical ones. Median beats mean on skewed data because one giant outlier
       cannot drag it. This is fast but it is exactly what flattens the distribution.</p>
       <p><b>Impute (time series).</b> <code>df.ffill()</code> carries the last observed value forward
       to fill a gap; <code>df.bfill()</code> pulls the next value backward. Natural for a metric
       sampled over time, where the value just before the gap is the best guess for the value during it.</p>
       <p><b>Impute (multivariate).</b> <code>KNNImputer</code> finds the $k$ rows most similar in the
       <i>other</i> columns and fills the blank with their average &mdash; great when the column is MAR.
       <code>IterativeImputer</code> goes further: it <b>models each column from all the others</b> and
       cycles until the fills stabilise (the idea behind R's MICE, "Multivariate Imputation by Chained
       Equations").</p>
       <p><b>Missingness indicator.</b> Whatever you fill with, you can add a new 0/1 column that records
       <i>was this cell originally blank?</i> &mdash; <code>add_indicator=True</code> in any
       scikit-learn imputer. For MNAR data this is often the single most valuable feature you create.</p>
       <p><b>The leakage rule, on top of all of it.</b> Mean, median, mode, KNN neighbours, the iterative
       model &mdash; all of these are <i>learned from data</i>. Learn them on the <b>training split
       only</b>, store them, and apply them to validation / test / production. A <code>Pipeline</code>
       enforces this automatically inside cross-validation.</p>`,

    symbols: [
      { sym: "$n$", desc: "number of rows; $n_{\\text{miss}}$ is how many are blank in a column. The missing fraction is $n_{\\text{miss}}/n$." },
      { sym: "$\\tilde{x}$", desc: "the <b>median</b> of a column's observed values &mdash; the middle value when sorted. What <code>SimpleImputer(strategy='median')</code> fills blanks with." },
      { sym: "$\\bar{x}$", desc: "the <b>mean</b> (average) of the observed values. Mean-imputation fills with this; it is more easily pulled around by outliers than $\\tilde{x}$." },
      { sym: "$k$", desc: "the number of nearest neighbours <code>KNNImputer</code> averages over to fill a blank." },
      { sym: "$M$", desc: "the <b>missingness indicator</b>: $M=1$ if the original cell was blank, $0$ if observed. A new feature column." }
    ],

    formula:
      `$$ \\hat{x}_{\\text{median}}=\\tilde{x}_{\\text{train}},\\qquad
         \\hat{x}_{\\text{mean}}=\\bar{x}_{\\text{train}},\\qquad
         \\hat{x}_{\\text{KNN}}=\\frac{1}{k}\\sum_{j\\in N_k(x)} x_j,\\qquad
         M=\\mathbb{1}[x\\text{ was missing}] $$`,

    whatItDoes:
      `<p><b>Median / mean imputation</b> replaces every blank in a column with one number learned from
       the <i>training</i> rows ($\\tilde{x}_{\\text{train}}$ or $\\bar{x}_{\\text{train}}$). Cheap, but it
       stacks a spike at that number.</p>
       <p><b>KNN imputation</b> fills a blank with the average of its $k$ nearest neighbours $N_k(x)$ &mdash;
       the rows that look most similar across the <i>other</i> columns. It respects relationships between
       columns, so it shines when data is MAR.</p>
       <p><b>The indicator</b> $M$ is just a flag: $1$ where the cell was blank, $0$ otherwise. It costs one
       column and lets the model learn directly from the <i>pattern</i> of missingness &mdash; the only
       real handle you have on MNAR data.</p>`,

    derivation:
      `<p><b>Why mean-imputation shrinks the variance (and why the median is gentler).</b></p>
       <ul class="steps">
         <li>Suppose a fraction $p$ of a column is missing and you fill every blank with the mean
         $\\bar{x}$ of the $1-p$ observed rows. Every filled cell now sits <i>exactly</i> at the centre,
         contributing <b>zero</b> deviation from the mean.</li>
         <li>The variance is the average squared deviation. You have kept the observed rows' deviations
         but replaced the missing rows' (unknown) deviations with $0$. So the computed variance is
         roughly $(1-p)$ times the true variance &mdash; it is <b>shrunk</b> toward zero by the missing
         fraction.</li>
         <li>Concretely, fill 30% of a column with its mean and you have erased about 30% of its spread.
         Downstream, correlations with the target get <b>diluted</b> and confidence intervals come out
         too narrow.</li>
         <li>The <b>median</b> $\\tilde{x}$ has the same spike problem but is far more <b>robust</b>: a
         single huge outlier moves the mean a lot but the median barely at all, so on skewed columns the
         filled value is more representative. That is why <code>strategy='median'</code> is the usual
         default for numeric data.</li>
         <li>The real cure for the lost variance is to stop pretending the fills are certain: add the
         indicator $M$ (so the model can down-weight imputed rows), or use multivariate imputation
         (<code>IterativeImputer</code>) which fills with a <i>varied</i> model-based estimate instead of
         one constant. $\\blacksquare$</li>
       </ul>`,

    example:
      `<p>A tiny "income" column with one blank, treated three ways.</p>
       <p>Observed values (in thousands): $40,\\ 45,\\ 50,\\ 55,\\ 900$, and one <b>blank</b>. This is
       skewed &mdash; the $900$ is a big earner.</p>
       <ul class="steps">
         <li><b>Mean fill.</b> $\\bar{x}=(40+45+50+55+900)/5 = 218$. You would fill the blank with
         <b>218</b> &mdash; a value <i>no one</i> in the column is near, dragged up by the outlier.</li>
         <li><b>Median fill.</b> Sorted, the middle value is $50$. Fill with <b>50</b> &mdash; a typical
         person, unbothered by the $900$. Much more representative.</li>
         <li><b>Indicator.</b> Whatever you fill with, also add $M=1$ for that row and $M=0$ for the
         rest. If the blank was MNAR (a high earner declining to answer), $M$ lets a model learn
         "declined &rarr; probably high income" &mdash; recovering signal the fill alone threw away.</li>
       </ul>
       <p>Same blank: mean fill puts it in an empty no-man's-land, median fill puts it with the crowd,
       and the indicator keeps the fact that it was ever missing.</p>`,

    practice: [
      {
        q: `Your training frame has a numeric column that is 35% missing and clearly right-skewed (a few huge values). A teammate proposes <code>SimpleImputer(strategy='mean')</code> applied to the whole dataset before splitting. Name the two separate problems and fix each.`,
        steps: [
          { do: `Spot the distribution problem: filling 35% of a skewed column with the mean stacks a spike at a value pulled up by the outliers.`, why: `Mean-imputation flattens the distribution and shrinks variance by roughly the missing fraction; the mean of a skewed column is not representative.` },
          { do: `Switch to <code>strategy='median'</code> and add <code>add_indicator=True</code>.`, why: `The median is robust to the big values, and the indicator keeps the "was missing" signal in case the column is MNAR.` },
          { do: `Spot the leakage problem: fitting before the split learns the fill value from test rows too.`, why: `That bleeds test information into training and inflates measured performance.` },
          { do: `Move the imputer into a <code>Pipeline</code> and split first, so it is fit on train only.`, why: `The imputer's learned median (and neighbours, for KNN) then comes only from the training split.` }
        ],
        answer: `<p>Two issues. <b>(1) Mean on a skewed column</b> stacks a spike and shrinks variance &mdash; use <code>strategy='median'</code> and add a missingness indicator. <b>(2) Fitting before the split leaks</b> &mdash; put the imputer in a <code>Pipeline</code> and split first so it is fit on the training set only.</p>`
      },
      {
        q: `Two columns: "income" on a voluntary form (high earners tend to skip it) and "temperature" from a sensor that drops about 1% of readings uniformly at random. Classify each mechanism and say whether dropping the affected rows is safe.`,
        steps: [
          { do: `For income, ask whether the blank depends on the missing value itself.`, why: `High earners skip BECAUSE income is high &mdash; the blank depends on the unobserved value, so it is MNAR (Missing Not At Random).` },
          { do: `For temperature, ask the same.`, why: `A uniform 1% sensor dropout depends on nothing &mdash; it is MCAR (Missing Completely At Random).` },
          { do: `Decide drop vs keep per mechanism.`, why: `Dropping MCAR rows is unbiased; dropping MNAR rows would systematically remove high earners and bias the sample.` }
        ],
        answer: `<p><b>Income is MNAR</b> &mdash; the blank depends on the value itself. Dropping those rows would drop the high earners and bias the sample; impute and <b>keep a missingness indicator</b>. <b>Temperature is MCAR</b> &mdash; the dropout is unrelated to anything; dropping the 1% of rows is safe (the survivors are a fair sample).</p>`
      },
      {
        q: `You have a daily revenue time series with a few isolated missing days, and a separate wide customer table where one column is MAR (its blanks are predictable from age and region). Which imputation fits each?`,
        steps: [
          { do: `For the time series, use the value adjacent in time.`, why: `<code>df.ffill()</code> carries the last known day forward (or <code>bfill</code> near the start) &mdash; the nearest day is the best guess for a one-day gap.` },
          { do: `For the MAR column, use the other columns.`, why: `<code>KNNImputer</code> (or <code>IterativeImputer</code>) fills from similar rows; since the blanks are explained by age and region, a multivariate fill recovers them well.` },
          { do: `Fit both on train only.`, why: `Forward-fill across a train/test boundary and the neighbour search both leak if computed on all the data.` }
        ],
        answer: `<p><b>Time series:</b> <code>ffill</code> / <code>bfill</code> &mdash; the temporally adjacent value is the natural fill. <b>MAR customer column:</b> <code>KNNImputer</code> or <code>IterativeImputer</code>, which exploit the other columns that explain the missingness. Both must be fit on the training data only.</p>`
      }
    ]
  });

  window.CODE["dw-missing-data"] = {
    lib: "pandas + scikit-learn",
    runnable: false,
    explain: `<p>End-to-end on the bundled Wine dataset (<code>sklearn.datasets.load_wine</code>),
      with missingness injected into two columns so the code is reproducible without an external file.
      We <b>detect</b> with <code>isna().sum()</code> (and note <code>missingno</code> for a visual),
      then demo <code>SimpleImputer(strategy='median')</code>, <code>KNNImputer</code>, and
      <code>IterativeImputer</code>. The key move: every imputer lives inside a <code>Pipeline</code> and
      is <b>fit on the training split only</b>, with <code>add_indicator=True</code> so the
      "was-missing" signal survives. Set <code>runnable</code> aside only because it needs scikit-learn
      &ge; 0.21 for <code>IterativeImputer</code>.</p>`,
    code: `import numpy as np
import pandas as pd
from sklearn.datasets import load_wine
from sklearn.model_selection import train_test_split, cross_val_score
from sklearn.experimental import enable_iterative_imputer   # noqa: needed to expose IterativeImputer
from sklearn.impute import SimpleImputer, KNNImputer, IterativeImputer
from sklearn.pipeline import Pipeline
from sklearn.ensemble import RandomForestClassifier

# --- Load a real frame and inject reproducible missingness into two columns ---
data = load_wine(as_frame=True)
X, y = data.data.copy(), data.target
rng = np.random.RandomState(42)
for col, frac in [('magnesium', 0.30), ('proline', 0.12)]:
    idx = rng.choice(len(X), int(frac * len(X)), replace=False)
    X.loc[idx, col] = np.nan

# === DETECT ===
print(X.isna().sum())                 # missing CELLS per column
print((X.isna().mean() * 100).round(1))  # missing PERCENT per column
# Visual: import missingno as msno; msno.matrix(X); msno.bar(X)
#   -> white streaks show WHERE blanks fall and whether columns go missing together.

# === Split FIRST so nothing is learned from the test rows ===
X_tr, X_te, y_tr, y_te = train_test_split(
    X, y, test_size=0.25, random_state=0, stratify=y)

# === Option A: DROP (only safe when missingness is MCAR / fraction is tiny) ===
X_tr.dropna()           # drop rows with any blank
X_tr.dropna(axis=1)     # drop columns with any blank
X.dropna(thresh=int(0.5 * len(X)), axis=1)  # drop columns >50% missing

# === Option B: IMPUTE, fit on TRAIN ONLY, with a missingness indicator ===
median_imp = SimpleImputer(strategy='median', add_indicator=True).fit(X_tr)
knn_imp    = KNNImputer(n_neighbors=5, add_indicator=True).fit(X_tr)
iter_imp   = IterativeImputer(random_state=0, add_indicator=True).fit(X_tr)
# .transform(X_te) now uses ONLY the train-learned medians / neighbours / model.

# === The right way: bundle impute + model in a Pipeline (no leakage in CV) ===
pipe = Pipeline([
    ('impute', SimpleImputer(strategy='median', add_indicator=True)),  # 13 feats + 2 indicators
    ('clf', RandomForestClassifier(random_state=0)),
])
print('CV accuracy:', cross_val_score(pipe, X, y, cv=5).mean().round(3))
pipe.fit(X_tr, y_tr)
print('test accuracy:', round(pipe.score(X_te, y_te), 3))

# === Time-series fills (separate idiom, for a time-indexed frame) ===
# ts = ts.ffill()   # carry last observed value forward across a gap
# ts = ts.bfill()   # pull the next value backward (e.g. at the start)`
  };

  window.CODEVIZ["dw-missing-data"] = {
    question: "What does filling blanks actually do to your data? See the detection step, the spike a single-value impute carves, and the gentler shapes other strategies leave.",
    charts: [
      {
        type: "bars",
        title: "DETECT (step 1) — missing % per column",
        xlabel: "column",
        ylabel: "percent of cells missing",
        labels: ["alcohol", "magnesium", "proline", "color_intensity"],
        values: [0.0, 29.8, 11.8, 0.0],
        valueLabels: ["0.0%", "29.8%", "11.8%", "0.0%"],
        colors: ["#7ee787", "#ff7b72", "#ffa657", "#7ee787"],
        interpret: "This is <code>df.isna().mean()*100</code> — the first thing to plot. Each bar is the share of cells blank in that column. <b>Read it:</b> alcohol/color_intensity are complete (green), magnesium is 29.8% missing (red — a meaningful fraction, impute don't drop), proline 11.8%. A tall bar tells you a column needs a decision; it does NOT tell you why it's missing — that's the mechanism (MCAR/MAR/MNAR), a judgement you add."
      },
      {
        type: "bars",
        title: "IDEAL/PROBLEM — median impute carves a fake SPIKE at the median",
        xlabel: "magnesium value bin",
        ylabel: "count of rows",
        labels: ["70–84", "84–97", "97–111", "111–124", "124–138", "138–151", "151–165"],
        values: [6, 53, 90, 20, 6, 2, 1],
        valueLabels: ["6", "53", "90 spike", "20", "6", "2", "1"],
        colors: ["#58a6ff", "#58a6ff", "#ff7b72", "#58a6ff", "#58a6ff", "#58a6ff", "#58a6ff"],
        interpret: "Histogram of magnesium <b>after</b> filling its 53 blanks with the observed median (98.0). The 97–111 bin held 37 real values; all 53 fills land in it too, so it jumps to <b>90</b> (red) — a spike that is not in the real data. <b>Read it:</b> any single tall bar exactly at the mean/median after imputation is the variance-shrinking artifact. The other bins are unchanged. This is why you add a missingness indicator and consider multivariate fills."
      },
      {
        type: "bars",
        title: "VARIANT — IterativeImputer fills with VARIED values, no single spike (illustrative)",
        xlabel: "magnesium value bin",
        ylabel: "count of rows",
        labels: ["70–84", "84–97", "97–111", "111–124", "124–138", "138–151", "151–165"],
        values: [8, 58, 49, 33, 14, 8, 3],
        valueLabels: ["8", "58", "49", "33", "14", "8", "3"],
        colors: ["#7ee787", "#7ee787", "#7ee787", "#7ee787", "#7ee787", "#7ee787", "#7ee787"],
        interpret: "<b>Illustrative.</b> Same column, but blanks filled by modelling magnesium from the <i>other</i> columns (IterativeImputer / KNN). The 53 fills spread across several bins matching the real shape, so <b>no single spike</b> appears and the variance is roughly preserved. <b>Read it:</b> compare to the red chart — a smooth refill (no one bin ballooning) means the imputer respected the distribution. This is the gentler choice when the column is MAR."
      },
      {
        type: "scatter",
        title: "VARIANT — MNAR: whether a value is blank depends on the value itself (illustrative)",
        xlabel: "true income (thousands)",
        ylabel: "P(this cell is blank)",
        groups: [
          { name: "observed (answered)", color: "#7ee787", points: [[40,0.05],[50,0.07],[60,0.1],[80,0.15],[120,0.25]] },
          { name: "high earners (often blank)", color: "#ff7b72", points: [[200,0.55],[350,0.7],[600,0.85],[900,0.93]] }
        ],
        interpret: "<b>Illustrative.</b> x is the true value, y is how likely that cell is left blank. The rising curve means high earners skip 'income' <b>because</b> it is high — that is MNAR. <b>Read it:</b> if missingness probability climbs with the (hidden) value, no fill from other columns fully recovers it, and dropping those rows removes the high earners and biases the sample. The fix is a 0/1 missingness indicator so the model can learn 'declined → likely high'."
      }
    ],
    caption: "Real numbers from sklearn.datasets.load_wine (n=178), NaNs injected at a fixed seed into magnesium (29.8%) and proline (11.8%). Chart 1 is the detection step. Chart 2 (the core lesson) shows median-impute stacking 53 fills into one bin (37→90) — a fake spike exactly at the median that shrinks variance. The variants contrast a multivariate fill that avoids the spike, and the MNAR mechanism where the chance of being blank rises with the value itself, which is when the missingness indicator earns its keep.",
    code: `import numpy as np, pandas as pd
from sklearn.datasets import load_wine
from sklearn.impute import SimpleImputer

df = load_wine(as_frame=True).frame[
    ['alcohol', 'magnesium', 'proline', 'color_intensity']].copy()
n = len(df)                                   # 178
rng = np.random.RandomState(42)
miss = df.copy()
miss.loc[rng.choice(n, int(0.30*n), replace=False), 'magnesium'] = np.nan
miss.loc[rng.choice(n, int(0.12*n), replace=False), 'proline']   = np.nan

# (1) missing % per column
print((miss.isna().mean()*100).round(1))      # magnesium 29.8, proline 11.8

# (2) magnesium distribution: observed (before) vs after median imputation
bins = np.linspace(70, 165, 8)                # 7 fixed bins
med  = miss['magnesium'].median()             # 98.0  (observed only)
after = SimpleImputer(strategy='median').fit_transform(miss[['magnesium']]).ravel()
before_counts = np.histogram(miss['magnesium'].dropna(), bins=bins)[0]
after_counts  = np.histogram(after, bins=bins)[0]
print('edges :', np.round(bins).astype(int))  # [ 70 84 97 111 124 138 151 165]
print('before:', before_counts)               # [ 6 53 37 20  6  2  1]
print('after :', after_counts)                # [ 6 53 90 20  6  2  1]  -> spike at 97-111`
  };
})();
