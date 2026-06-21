/* Data Wrangling — "Loading & inspecting a dataset".
   Self-contained: lesson + CODE + CODEVIZ merged by id "dw-loading-inspecting". */
(function () {
  window.LESSONS.push({
    id: "dw-loading-inspecting",
    title: "First contact: loading and inspecting a dataset",
    tagline: "Before you clean or model anything, look. Run the same inspection battery every single time.",
    module: "Data Wrangling",
    prereqs: ["skill-data-audit"],

    whenToUse:
      `<p><b>Always.</b> This is the very first thing you do after a dataset lands in memory, and you do it
       <i>before</i> any cleaning, joining, plotting, or modeling. No exceptions.</p>
       <ul>
         <li><b>Right after loading</b> &mdash; the moment <code>pd.read_csv(...)</code> (or any loader)
         returns, run the battery. You are forming a mental model of every column: its <b>type</b>, its
         <b>range</b>, how much is <b>missing</b>, and how many distinct values it holds (its
         <b>cardinality</b>).</li>
         <li><b>When a dataset is handed to you</b> &mdash; a teammate's export, a vendor file, a database
         dump. Never trust the column names or a data dictionary alone; the data itself is the source of
         truth, and it is often messier than advertised.</li>
         <li><b>Before re-running an old pipeline on new data</b> &mdash; schemas drift. A column that was
         numeric last month may arrive as text this month. The inspection battery catches that in seconds.</li>
       </ul>
       <p>Think of it as the EDA (Exploratory Data Analysis) warm-up: cheap, mechanical, and the cheapest
       insurance you can buy against a nasty surprise three hours into the project.</p>`,

    application:
      `<p>This habit shows up at the start of every real data task.</p>
       <ul>
         <li><b>The first cell of every notebook.</b> Load, then <code>.shape</code>, <code>.head()</code>,
         <code>.info()</code>, <code>.describe()</code>. Experienced practitioners do this on autopilot.</li>
         <li><b>Onboarding to a new data source.</b> When you inherit a table you have never seen, the
         battery <i>is</i> your documentation: it tells you the dtypes, the missingness, and the cardinality
         of every field.</li>
         <li><b>Data-validation checks in production.</b> The same questions &mdash; right shape? expected
         dtypes? no surprise nulls? &mdash; become automated assertions that guard a pipeline against silently
         corrupted input.</li>
       </ul>`,

    pitfalls:
      `<ul>
         <li><b>Skipping inspection entirely.</b> The classic failure: you dive straight into modeling, then
         hours later discover a column was all zeros, or half missing, or an ID you leaked as a feature. The
         fix is the whole point of this lesson &mdash; <b>look first, always.</b></li>
         <li><b>Trusting <code>.describe()</code> alone.</b> Plain <code>.describe()</code> only summarizes
         <i>numeric</i> columns, so it silently <b>ignores every categorical/text column</b> and tells you
         nothing about <b>missingness mechanism</b>. Always also run <code>.describe(include='object')</code>
         (or <code>include='all'</code>) and <code>.isna().sum()</code>.</li>
         <li><b>Not checking dtypes.</b> Numbers stored as strings (<code>"1,234"</code>, <code>"$5.00"</code>,
         <code>"N/A"</code>) make a whole column come in as <code>object</code>. If you don't check
         <code>.dtypes</code>, your "average" silently fails or your model never sees the feature. A column
         that should be numeric but isn't is a red flag.</li>
         <li><b>Ignoring cardinality.</b> <code>.nunique()</code> reveals structure at a glance: a column with
         exactly 2 values is a label or flag; one with as many unique values as rows is an ID (drop it, never
         a feature); a "numeric" column with only 5 values is really categorical. Miss this and you encode
         things wrong.</li>
         <li><b>Reading <code>.head()</code> as representative.</b> The top rows are often sorted or special
         (headers, totals, a block of one category). Also peek with <code>.sample()</code> and
         <code>.tail()</code> so you see the middle and end of the data, not just a tidy opening.</li>
       </ul>`,

    bigIdea:
      `<p>A dataset is a stranger. Before you do anything with it, you introduce yourself: you ask its size,
       its shape, and a handful of questions about every column. This takes about a minute and saves hours.</p>
       <p>The goal is a <b>mental model of each column</b> built from four facts:</p>
       <ul>
         <li><b>Type</b> &mdash; is it a number, a category, a date, free text? (<code>.dtypes</code>,
         <code>.info()</code>)</li>
         <li><b>Range / distribution</b> &mdash; what are the min, max, mean, and quartiles for numbers; the
         most common values for categories? (<code>.describe()</code>)</li>
         <li><b>Missingness</b> &mdash; how many values are absent, and in which columns?
         (<code>.isna().sum()</code>, the non-null counts in <code>.info()</code>)</li>
         <li><b>Cardinality</b> &mdash; how many distinct values does it take? (<code>.nunique()</code>)</li>
       </ul>
       <p>Once you can recite those four facts for every column, you know what you are working with &mdash;
       and only then do you start cleaning. (<b>EDA</b> = Exploratory Data Analysis; <b>dtype</b> = data
       type; <b>cardinality</b> = the count of distinct values.)</p>`,

    buildup:
      `<p>There is a fixed, repeatable <b>inspection battery</b>. Run it top to bottom every time. Each step
       answers one question, and each has a "what to look for".</p>
       <ol>
         <li><b><code>.shape</code></b> &mdash; rows &times; columns. Is it the size you expected? Way too few
         rows means a broken load; way too many columns means a wide, messy export.</li>
         <li><b><code>.head()</code> / <code>.tail()</code> / <code>.sample(5)</code></b> &mdash; actually
         eyeball some rows. Head shows the opening, tail shows the end (watch for footer/total rows), sample
         shows a fair middle slice. Look for obviously wrong values, shifted columns, stray text.</li>
         <li><b><code>.info()</code></b> &mdash; one line per column: its dtype and its <b>non-null count</b>.
         If a column's non-null count is below the row count, it has missing values. This is the single most
         information-dense command.</li>
         <li><b><code>.dtypes</code></b> &mdash; the type of each column on its own. Hunt for numbers that
         came in as <code>object</code> (strings) &mdash; the tell-tale sign of <code>"1,234"</code> or
         <code>"N/A"</code> hiding in the data.</li>
         <li><b><code>.describe()</code></b> &mdash; count, mean, std, min, 25/50/75% quartiles, max for the
         <i>numeric</i> columns. Then <b><code>.describe(include='object')</code></b> for the categoricals
         (count, unique, top, freq). Don't skip the second call.</li>
         <li><b><code>.nunique()</code></b> &mdash; distinct values per column. 1 = constant (drop it); 2 =
         binary flag/label; ~ n_rows = an ID; a small number on a numeric column = secretly categorical.</li>
         <li><b><code>.isna().sum()</code></b> &mdash; missing-value count per column, the clean summary of
         what <code>.info()</code> hinted at. Sort it to see the worst offenders first.</li>
         <li><b><code>.memory_usage(deep=True)</code></b> &mdash; bytes per column. Tells you if you can fit
         the data, and which <code>object</code> columns are bloating memory (candidates for
         <code>category</code> dtype later).</li>
       </ol>
       <p>Eight commands, one minute, and you have met every column.</p>`,

    derivation:
      `<p><b>Why this exact order works.</b></p>
       <ul class="steps">
         <li>You start with <code>.shape</code> because it is the cheapest sanity check: if the row or column
         count is wrong, nothing else matters &mdash; stop and fix the load.</li>
         <li>You look at raw rows next (<code>.head</code>/<code>.tail</code>/<code>.sample</code>) because
         your eyes catch things no summary does: a column shifted by one, a units mismatch, an all-caps
         "ERROR" string. Summaries can hide these; raw rows can't.</li>
         <li><code>.info()</code> then gives you <b>type and missingness together</b> in one compact table.
         A non-null count below the row count is missingness; a dtype of <code>object</code> on something that
         should be a number is a corruption flag. Two of the four facts, one command.</li>
         <li><code>.describe()</code> fills in <b>range</b> for numbers. But it only sees numbers, so the
         <code>include='object'</code> call is mandatory to cover categoricals &mdash; otherwise whole columns
         are invisible in your summary.</li>
         <li><code>.nunique()</code> supplies <b>cardinality</b>, the fact that distinguishes a label from an
         ID from a true continuous feature &mdash; structure you cannot read off a mean or a min.</li>
         <li><code>.isna().sum()</code> and <code>.memory_usage()</code> are the precise, sortable versions of
         what <code>.info()</code> summarized, for when you need exact missing counts or byte sizes. Together
         the battery covers all four facts &mdash; type, range, missingness, cardinality &mdash; for every
         column, with no gaps. $\\blacksquare$</li>
       </ul>`,

    example:
      `<p>Imagine a 5-row peek at a customer table after loading:</p>
       <p><code>shape -&gt; (1000, 4)</code> with columns <code>id, age, plan, signup_date</code>.</p>
       <ul class="steps">
         <li><b><code>.dtypes</code></b> reports <code>id:int64, age:object, plan:object,
         signup_date:object</code>. Red flag: <code>age</code> is <code>object</code>, not a number. A peek
         shows values like <code>"34"</code> and <code>"unknown"</code> &mdash; the text <code>"unknown"</code>
         poisoned the whole column to strings.</li>
         <li><b><code>.isna().sum()</code></b> reports <code>signup_date</code> has 180 missing out of 1000
         &mdash; 18% absent. You now know to handle those before any date math.</li>
         <li><b><code>.nunique()</code></b> reports <code>id:1000</code> (= n_rows, so it is an identifier,
         drop it as a feature), <code>plan:3</code> (a genuine 3-level category), <code>age:71</code> (real
         continuous, once you fix the dtype).</li>
       </ul>
       <p>In three commands you have learned: one column is a mis-typed number, one is 18% missing, one is a
       leaky ID, and one is a clean category &mdash; all <i>before</i> writing a single line of cleaning code.</p>`,

    practice: [
      {
        q: `You load a CSV and call <code>df.describe()</code>. It shows 6 numeric columns looking fine, so you start modeling. The file actually had 12 columns. What did <code>.describe()</code> hide, and what two commands should you have run instead?`,
        steps: [
          { do: `Recall that plain <code>.describe()</code> summarizes only numeric columns by default.`, why: `The other 6 columns are non-numeric (object/category) and were silently skipped &mdash; you never saw them.` },
          { do: `Run <code>df.info()</code> to list all 12 columns with their dtypes and non-null counts.`, why: `It reveals the categorical columns and any missingness in one table, so nothing is invisible.` },
          { do: `Run <code>df.describe(include='object')</code> (or <code>include='all'</code>) to summarize the categoricals.`, why: `This gives count, unique, top, and freq for the text columns that plain <code>.describe()</code> ignored.` }
        ],
        answer: `<p>Plain <code>.describe()</code> hid the <b>6 non-numeric columns entirely</b> &mdash; their existence, their missingness, and their distributions. Run <code>df.info()</code> (all columns: dtype + non-null count) and <code>df.describe(include='object')</code> (or <code>include='all'</code>) so categoricals are summarized too. Never treat numeric <code>.describe()</code> as a full picture.</p>`
      },
      {
        q: `<code>df.dtypes</code> shows a column <code>price</code> as <code>object</code> instead of a float. <code>df['price'].mean()</code> errors. What is the likely cause, and how do you confirm and fix it?`,
        steps: [
          { do: `Recognize that an <code>object</code> dtype on a "number" column means the values are stored as strings.`, why: `Pandas falls back to <code>object</code> when even one entry can't be parsed as a number.` },
          { do: `Eyeball the values with <code>df['price'].sample(10)</code> or <code>df['price'].unique()[:20]</code>.`, why: `You will likely spot culprits like <code>"$5.00"</code>, <code>"1,234"</code>, or <code>"N/A"</code> that force the whole column to text.` },
          { do: `Clean and cast: strip the symbols, then <code>pd.to_numeric(df['price'], errors='coerce')</code>.`, why: `<code>errors='coerce'</code> turns unparseable entries into <code>NaN</code> so the column becomes a true numeric dtype.` }
        ],
        answer: `<p>The column holds <b>numbers stored as strings</b> &mdash; a stray <code>"$"</code>,
        <code>","</code>, or <code>"N/A"</code> poisoned it to <code>object</code>. Confirm by sampling the
        raw values, then clean the symbols and run <code>pd.to_numeric(..., errors='coerce')</code> to cast
        it. This is exactly why you check <code>.dtypes</code> on every load.</p>`
      },
      {
        q: `<code>df.nunique()</code> returns: <code>user_id: 50000</code> (out of 50000 rows), <code>is_churned: 2</code>, <code>state: 50</code>, <code>visits: 90</code>. Classify each column from its cardinality alone.`,
        steps: [
          { do: `Compare each column's unique count to the row count (50000).`, why: `Cardinality relative to n_rows is what distinguishes IDs, flags, categories, and continuous features.` },
          { do: `<code>user_id</code> = 50000 unique = one value per row.`, why: `That is an identifier; it must be dropped as a feature or it leaks/overfits.` },
          { do: `<code>is_churned</code> = 2, <code>state</code> = 50 (moderate), <code>visits</code> = 90 (many but bounded).`, why: `2 is a binary label/flag; 50 is a clean categorical; ~90 is a genuine numeric/count feature.` }
        ],
        answer: `<p><code>user_id</code> (50000 unique = n_rows) is an <b>ID</b> &mdash; drop it.
        <code>is_churned</code> (2) is a <b>binary label/flag</b>. <code>state</code> (50) is a true
        <b>categorical</b>. <code>visits</code> (90, bounded) is a <b>numeric/count feature</b>. Cardinality
        alone tells you the role of each column &mdash; which is why <code>.nunique()</code> is in the
        battery.</p>`
      }
    ]
  });

  window.CODE["dw-loading-inspecting"] = {
    lib: "pandas",
    runnable: false,
    explain: `<p>The full inspection battery on a real-ish dataset &mdash; the classic <b>Titanic</b> CSV,
      which has mixed dtypes and genuine missingness (so it exercises every check). Load it from the seaborn
      sample data (<code>seaborn.load_dataset('titanic')</code>) or any Titanic CSV. The point isn't the
      individual commands; it's running <b>all of them, in order, every time</b>, and reading off the four
      facts (type, range, missingness, cardinality) for each column before touching the data.</p>`,
    code: `import pandas as pd

# --- Load a real-ish dataset with mixed dtypes and real missingness ---
# Titanic ships with seaborn; or use any titanic.csv.
import seaborn as sns
df = sns.load_dataset('titanic')      # 891 rows, mixed numeric / categorical / bool

# === 1. SHAPE — is it the size I expect? ===
print(df.shape)                       # -> (891, 15)   rows x columns
# Look for: wildly wrong row/column counts = a broken load.

# === 2. EYEBALL ROWS — head / tail / sample ===
print(df.head())                      # opening rows
print(df.tail())                      # end rows — watch for footer/total junk
print(df.sample(5, random_state=0))   # a fair middle slice (head is often special)
# Look for: shifted columns, stray text, obviously wrong values.

# === 3. INFO — dtype + NON-NULL count per column (the densest command) ===
df.info()
# Look for: a non-null count below 891 = missing values in that column;
#           a dtype of 'object' on something that should be numeric.

# === 4. DTYPES — types on their own ===
print(df.dtypes)
# Look for: numbers stored as strings ('object' where you expect int/float).

# === 5. DESCRIBE — numeric AND categorical (don't skip the second call!) ===
print(df.describe())                       # count/mean/std/min/quartiles/max (numeric)
print(df.describe(include='object'))       # count/unique/top/freq (categoricals)
# Plain .describe() IGNORES non-numeric columns — include='object' covers them.

# === 6. NUNIQUE — cardinality (distinct values per column) ===
print(df.nunique().sort_values(ascending=False))
# Look for: 1 = constant (drop); 2 = flag/label; ~n_rows = an ID;
#           a small number on a 'numeric' column = secretly categorical.

# === 7. ISNA — exact missing-value count per column, worst first ===
print(df.isna().sum().sort_values(ascending=False))
# Titanic: 'deck' ~688 missing, 'age' ~177 missing, 'embarked'/'embark_town' a few.

# === 8. MEMORY — bytes per column (deep=True counts object strings honestly) ===
print(df.memory_usage(deep=True).sort_values(ascending=False))
# Look for: fat 'object' columns — candidates for the lighter 'category' dtype.

# Only AFTER all eight do you start cleaning. You now know every column's
# type, range, missingness, and cardinality.`
  };

  window.CODEVIZ["dw-loading-inspecting"] = {
    question: "On first contact with load_breast_cancer, what does the cardinality (number of distinct values) of each column tell us at a glance — and which column is obviously the label?",
    charts: [
      {
        type: "bars",
        title: "Cardinality (n distinct values) per column — the at-a-glance column profile",
        xlabel: "column",
        ylabel: "number of distinct values",
        labels: ["mean radius", "mean texture", "mean perimeter", "mean area",
                 "mean smoothness", "mean concavity", "worst area", "target"],
        values: [456, 479, 522, 539, 474, 537, 544, 2],
        valueLabels: ["456", "479", "522", "539", "474", "537", "544", "2"],
        colors: ["#79c0ff", "#79c0ff", "#79c0ff", "#79c0ff",
                 "#79c0ff", "#79c0ff", "#79c0ff", "#ff7b72"]
      }
    ],
    caption: "Real numbers from sklearn's load_breast_cancer (569 rows). A single bar chart of .nunique() per column profiles the data instantly: the seven measurement columns each take hundreds of distinct values (456–544) — they are genuine continuous features — while 'target' takes exactly 2 distinct values (red bar). That lone low bar is the binary label, spotted at a glance without reading any documentation. This is the whole point of the inspection battery: structure (continuous vs label/categorical) jumps out of a one-line summary.",
    code: `import pandas as pd
from sklearn.datasets import load_breast_cancer

# Real bundled dataset: 569 cell-nucleus measurements, 30 features + target.
d = load_breast_cancer(as_frame=True)
df = d.frame
print('shape:', df.shape)                 # -> (569, 31)

# A representative subset of columns for the chart.
cols = ['mean radius', 'mean texture', 'mean perimeter', 'mean area',
        'mean smoothness', 'mean concavity', 'worst area', 'target']

# CARDINALITY = number of distinct values per column (.nunique()).
card = df[cols].nunique()
print(card)
# mean radius      456     mean concavity   537
# mean texture     479     worst area       544
# mean perimeter   522     target             2   <- only 2 values => the LABEL
# mean area        539
# mean smoothness  474
# The seven feature columns have hundreds of distinct values (continuous);
# 'target' has exactly 2 -> it is the binary class label, visible at a glance.`
  };
})();
