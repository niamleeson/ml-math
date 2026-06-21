/* Data Wrangling — "Data validation: turning assumptions into a data contract".
   Self-contained: lesson + CODE + CODEVIZ merged by id "dw-validation". */
(function () {
  window.LESSONS.push({
    id: "dw-validation",
    title: "Data validation: a contract your data must pass",
    tagline: "Write your assumptions down as automated checks, so bad data is caught loud and early.",
    module: "Data Wrangling",
    prereqs: ["skill-data-audit"],

    bigIdea:
      `<p>You always have <b>assumptions</b> about your data. "Age is between 0 and 120." "Price is never
       negative." "Category is one of <code>books</code>, <code>music</code>, <code>games</code>." "The
       order id is unique." Most of the time these live only in your head.</p>
       <p>A <b>data contract</b> writes those assumptions down as <b>automated checks</b> that run on every
       batch of data. If a new file shows up with an age of 200, a price of -5, or a category nobody has
       seen before, the contract <b>fails loudly</b> right at the door &mdash; instead of letting the bad
       row slip through and silently poison every average, model, and dashboard downstream.</p>
       <p>The whole idea is simple: <b>turn "I assume X" into "assert X, and shout if it is false."</b>
       Cheap to write, and it converts silent corruption into a noisy, fixable alert.</p>`,

    buildup:
      `<p>A contract is just a list of checks. They come in a few families:</p>
       <ul>
         <li><b>Schema checks</b> &mdash; the right <b>columns</b> are present, with the right
         <b>dtypes</b> (data types). Is <code>age</code> an integer? Is <code>price</code> a float? Did a
         column quietly disappear or get renamed?</li>
         <li><b>Value constraints</b> &mdash; each column stays in its allowed set of values:
         <ul>
           <li><b>Range:</b> <code>age</code> in $[0, 120]$, <code>price</code> $\\ge 0$.</li>
           <li><b>Allowed set:</b> <code>category</code> is one of a fixed list.</li>
           <li><b>Not-null:</b> a required column has no missing values.</li>
           <li><b>Uniqueness:</b> a key column (like <code>order_id</code>) has no duplicates.</li>
         </ul></li>
         <li><b>Cross-field rules</b> &mdash; relationships <i>between</i> columns hold, row by row. The
         classic one is <code>end_date &ge; start_date</code> (an order can't end before it starts).</li>
       </ul>
       <p>Run that list at every <b>pipeline boundary</b> &mdash; right after you ingest raw data, again
       after cleaning, and once more before serving &mdash; and on <b>every new batch</b> in production.</p>`,

    whenToUse:
      `<p><b>Validate at every boundary, on every batch.</b></p>
       <ul>
         <li><b>At ingest.</b> The moment raw data lands &mdash; a new CSV, an API pull, a database dump
         &mdash; check it before anything else touches it. This is the cheapest place to catch a broken
         upstream feed.</li>
         <li><b>After cleaning.</b> Re-validate after your wrangling code runs, to prove your own transforms
         didn't introduce new violations (a bad fill value, a botched join creating duplicates).</li>
         <li><b>Before serving.</b> Right before the data feeds a model, a report, or a customer-facing
         surface &mdash; the last gate.</li>
         <li><b>On every new batch in production.</b> The check that mattered yesterday matters today. A
         contract you run once and forget catches nothing when next month's file drifts.</li>
       </ul>
       <p><b>Plain asserts vs. a library.</b> A handful of <code>assert</code> statements is the right
       starting point and costs nothing. Reach for <code>pandera</code> when you want a <b>typed schema</b>
       declared in one place and reused, and for <code>great_expectations</code> when you also want
       <b>validation reports, a data catalog, and documentation</b> generated for stakeholders.</p>`,

    application:
      `<p>Data contracts show up everywhere data moves from one owner to another.</p>
       <ul>
         <li><b>Ingest pipelines.</b> An ETL (Extract, Transform, Load) job runs a <code>pandera</code>
         schema on each new file; a failure stops the pipeline and pages the on-call, instead of writing
         garbage to the warehouse.</li>
         <li><b>Feature pipelines for ML.</b> Validate feature tables before training and before scoring, so
         a silently corrupted feature (all-null after an upstream change) is caught rather than learned.</li>
         <li><b>Team handoffs.</b> When team A produces a table that team B consumes, a shared contract is
         the literal agreement: A promises the data passes these checks, B can rely on it.</li>
       </ul>`,

    pitfalls:
      `<ul>
         <li><b>Trusting data with no checks at all.</b> The default failure mode: one malformed row flows
         all the way to a dashboard and nobody notices for weeks. The fix is this whole lesson &mdash;
         write the contract.</li>
         <li><b>Checks too loose to catch real errors.</b> Allowing <code>age</code> in $[0, 999]$ won't
         catch the 200-year-old customer. Set bounds tight enough to mean something.</li>
         <li><b>Checks too tight &mdash; false alarms.</b> If a legitimate value occasionally exceeds your
         bound, the alert cries wolf and people start ignoring it. Base bounds on real domain knowledge and
         observed data, and revisit them.</li>
         <li><b>Validating once but not on new batches.</b> A one-time check during development protects
         nothing in production. Wire the contract into the recurring pipeline so it runs on every batch.</li>
         <li><b>No alert when a check fails.</b> A check that fails into a log nobody reads is the same as no
         check. Make failures <b>loud</b>: stop the pipeline, raise, page someone.</li>
         <li><b>Schema drift over time.</b> Upstream renames a column, changes a dtype, adds a new category.
         A static contract goes stale. Treat the contract as living code: update it (deliberately) when the
         data legitimately changes, and let it fail when the change was a mistake.</li>
       </ul>`,

    derivation:
      `<p><b>Why "fail loud and early" beats "discover it later".</b></p>
       <ul class="steps">
         <li>A pipeline is a chain: ingest &rarr; clean &rarr; feature-build &rarr; model &rarr; serve. A bad
         value entering at the start flows through every stage.</li>
         <li>Without a check, the corruption is <b>silent</b>: an average is slightly off, a model is
         slightly worse, a report shows a number that is wrong but plausible. By the time someone notices,
         the bad data has been mixed into many downstream artifacts and the trail is cold.</li>
         <li>A check at the boundary turns that silent failure into an <b>explicit, located</b> one: "Batch
         2024-06-21 failed the <code>age</code> range check on 6 rows." You know <i>what</i> broke,
         <i>where</i>, and <i>when</i> &mdash; before it spread.</li>
         <li>The cost is asymmetric. Writing the check is minutes. Debugging a wrong dashboard three weeks
         later, then re-running everything downstream, is days. The contract trades a tiny up-front cost for
         a huge avoided one. $\\blacksquare$</li>
       </ul>`,

    example:
      `<p>Here is a tiny contract in words for an orders table.</p>
       <ul class="steps">
         <li><b>Schema:</b> columns <code>order_id, age, price, category, start_date, end_date</code> must
         all be present; <code>price</code> must be a float, the dates must be datetimes.</li>
         <li><b>Range:</b> <code>age</code> in $[0, 120]$; <code>price</code> $\\ge 0$.</li>
         <li><b>Allowed set:</b> <code>category</code> in $\\{$<code>books, music, games</code>$\\}$.</li>
         <li><b>Not-null:</b> <code>age</code> and <code>price</code> have no missing values.</li>
         <li><b>Unique:</b> <code>order_id</code> has no duplicates.</li>
         <li><b>Cross-field:</b> <code>end_date &ge; start_date</code> on every row.</li>
       </ul>
       <p>Feed a clean batch and it passes silently. Feed a batch where one row has <code>age = 200</code>,
       another has <code>price = -5</code>, two share an <code>order_id</code>, and one ends before it
       starts &mdash; and the contract raises, naming the exact rule and rows that failed. That is the whole
       payoff: the bad batch never reaches the model.</p>`,

    practice: [
      {
        q: `A teammate says "the data looks fine, I eyeballed the first 20 rows." Why is that not a data contract, and what would make it one?`,
        steps: [
          { do: `Note that eyeballing is manual, one-time, and only sees a sample.`, why: `It can't run on every new batch, and it misses problems past the rows you looked at.` },
          { do: `Write the assumptions down as code: schema, ranges, allowed sets, not-null, uniqueness, cross-field rules.`, why: `Executable checks run the same way every time and cover all rows, not just a glanced-at sample.` },
          { do: `Wire those checks into the pipeline so they run automatically on every batch and raise on failure.`, why: `Automation + a loud failure is what turns a good intention into a contract that actually protects you.` }
        ],
        answer: `<p>Eyeballing is a manual, one-time spot-check &mdash; it sees only a sample and never runs again. A <b>contract</b> is the same intent made into <b>automated checks</b> (schema, ranges, allowed sets, not-null, uniqueness, cross-field) that run on <b>every batch</b> and <b>fail loudly</b>. Tools like <code>pandera</code> or <code>great_expectations</code>, or even plain <code>assert</code> statements, turn the eyeballing into something repeatable and enforceable.</p>`
      },
      {
        q: `Your <code>age</code> check allows $[0, 999]$ and has never fired. A colleague's allows $[0, 120]$ and fires once a month on a single bad row. Which is the better contract, and what's the risk on each side?`,
        steps: [
          { do: `Ask what each bound actually catches.`, why: `$[0, 999]$ admits a 200-year-old customer as "valid", so it catches essentially nothing real.` },
          { do: `Consider the cost of a check that's too tight.`, why: `If $[0, 120]$ fired on legitimate values, it would be a false alarm and people would learn to ignore it.` },
          { do: `Pick the tightest bound that still reflects real, valid data.`, why: `$[0, 120]$ matches actual human ages, so its monthly fire is a real catch, not noise.` }
        ],
        answer: `<p>The $[0, 120]$ check is far better: it reflects real ages and its monthly fire is a <b>genuine catch</b>. The $[0, 999]$ check is <b>too loose</b> &mdash; it never fires because it never can, so it protects nothing. The risk on the other side is a bound so <b>tight</b> it flags valid data and trains people to ignore the alert. Aim for the tightest bound that still admits all legitimate values.</p>`
      },
      {
        q: `An upstream team renames <code>category</code> to <code>cat</code> and adds a new value <code>podcasts</code>. Which parts of the contract should fire, and is firing a bug or a feature here?`,
        steps: [
          { do: `Check the schema rule.`, why: `The expected column <code>category</code> is now missing, so the schema/column check fails immediately.` },
          { do: `Check the allowed-set rule.`, why: `Even if you map the new name, <code>podcasts</code> is not in $\\{$books, music, games$\\}$, so the category check fails on those rows.` },
          { do: `Decide whether the change was intended.`, why: `If it was an upstream mistake, the contract just saved you; if it was a real, agreed change, you update the contract deliberately.` }
        ],
        answer: `<p>The <b>schema check</b> fires (the <code>category</code> column is gone) and, once mapped, the <b>allowed-set check</b> fires on the <code>podcasts</code> rows. This is the contract <b>working</b>, not a bug &mdash; it caught <b>schema drift</b>. If the change was a mistake, you've avoided silent corruption; if it was a legitimate, agreed change, you update the contract on purpose to add the new column name and value.</p>`
      }
    ]
  });

  window.CODE["dw-validation"] = {
    lib: "pandas + pandera",
    runnable: false,
    explain: `<p>A typed <code>pandera.DataFrameSchema</code> is the cleanest way to state a data contract once
       and reuse it. Each <code>Column</code> declares its dtype plus a list of <code>Check</code>s &mdash;
       <code>Check.in_range</code> for ranges, <code>Check.isin</code> for an allowed set, <code>nullable=False</code>
       for not-null, and <code>unique=True</code> for keys. A frame-level <code>Check</code> expresses the
       cross-field rule <code>end_date &ge; start_date</code>. Calling <code>schema.validate(df, lazy=True)</code>
       collects <b>all</b> failures and raises a <code>SchemaErrors</code> if anything is wrong. The bottom of
       the file shows the equivalent plain <code>assert</code> checks and a note on <code>great_expectations</code>.
       Install with <code>pip install pandera</code>.</p>`,
    code: `import pandas as pd
import pandera as pa
from pandera import Column, Check, DataFrameSchema

# --- A small messy batch (deliberately corrupted to trip the contract) ---
df = pd.DataFrame({
    "order_id":   [1, 2, 3, 4, 12, 12],            # 12 is DUPLICATED
    "age":        [34, 200, 29, -3, 41, 55],       # 200 and -3 are out of range
    "price":      [19.99, 5.00, -2.50, 12.0, 9.9, 9.9],  # -2.50 is negative
    "category":   ["books", "music", "podcasts", "games", "books", "books"],  # 'podcasts' not allowed
    "start_date": pd.to_datetime(["2024-01-01"] * 6),
    "end_date":   pd.to_datetime(["2024-01-05", "2024-01-03", "2023-12-30",   # row 3 ends before it starts
                                  "2024-01-10", "2024-01-07", "2024-01-07"]),
})

ALLOWED = ["books", "music", "games"]

# === The data contract, as a typed schema ===
schema = DataFrameSchema(
    {
        "order_id":   Column(int,   unique=True, nullable=False),            # key: no duplicates
        "age":        Column(float, Check.in_range(0, 120), nullable=False), # range + not-null
        "price":      Column(float, Check.ge(0),            nullable=False), # non-negative + not-null
        "category":   Column(str,   Check.isin(ALLOWED),    nullable=False), # allowed set
        "start_date": Column("datetime64[ns]", nullable=False),
        "end_date":   Column("datetime64[ns]", nullable=False),
    },
    checks=Check(lambda d: d["end_date"] >= d["start_date"],  # cross-field rule
                 error="end_date must be >= start_date"),
    coerce=True,   # try to coerce dtypes; mismatches still surface as errors
)

# lazy=True collects EVERY failure instead of stopping at the first one.
try:
    schema.validate(df, lazy=True)
    print("contract PASSED")
except pa.errors.SchemaErrors as err:
    # err.failure_cases is a tidy DataFrame: column, check, failing value, row index.
    print("contract FAILED:")
    print(err.failure_cases[["column", "check", "failure_case", "index"]])

# === Plain assert checks (no library) — the same intent, minimal ===
assert set(["order_id", "age", "price", "category"]).issubset(df.columns), "missing columns"
assert df["order_id"].is_unique, "order_id has duplicates"
assert df["age"].between(0, 120).all(), "age out of [0, 120]"
assert (df["price"] >= 0).all(), "price is negative"
assert df["category"].isin(ALLOWED).all(), "unexpected category"
assert (df["end_date"] >= df["start_date"]).all(), "end_date before start_date"

# === great_expectations note ===
# For a richer setup, great_expectations expresses the same contract as an
# "Expectation Suite" and auto-generates a validation report + Data Docs:
#   import great_expectations as gx
#   ctx = gx.get_context()
#   batch = ctx.sources.pandas_default.read_dataframe(df)
#   batch.expect_column_values_to_be_between("age", 0, 120)
#   batch.expect_column_values_to_be_in_set("category", ALLOWED)
#   batch.expect_column_values_to_not_be_null("price")
#   batch.expect_column_values_to_be_unique("order_id")
# Run the suite on every new batch in your pipeline; a failed expectation alerts.`
  };

  window.CODEVIZ["dw-validation"] = {
    question: "Run a five-rule data contract on a small messy orders table. How many rows fail each rule? The bars are the contract catching problems.",
    charts: [
      {
        type: "bars",
        title: "Rows FAILING each validation rule (20-row messy batch)",
        labels: ["range\n(age/price)", "category\n(allowed set)", "null\n(age/price)", "uniqueness\n(order_id)", "cross-field\n(dates)"],
        values: [6, 2, 4, 2, 2],
        valueLabels: ["6", "2", "4", "2", "2"],
        colors: ["#ff7b72", "#ff7b72", "#ff7b72", "#ff7b72", "#ff7b72"]
      }
    ],
    caption: "Real counts from a 20-row inline orders table with deliberate corruptions. The contract's five rules catch: 6 range violations (ages of -3, 140, 200 and three negative prices), 2 disallowed categories ('TOYS', 'unknown'), 4 nulls (2 missing ages, 2 missing prices), 2 duplicated-key rows (order_id 12 appears twice), and 2 cross-field violations (end_date before start_date). Without the contract, all 16 affected rows would flow downstream silently; with it, the batch fails loudly at the boundary.",
    code: `import pandas as pd
import numpy as np

# A small messy real-ish orders batch (inline). Corruptions are deliberate.
df = pd.DataFrame({
    "order_id":   [1,2,3,4,5,6,7,8,9,10,11,12,12,14,15,16,17,18,19,20],  # 12 duplicated
    "age":        [34,29,np.nan,52,140,41,23,-3,67,38,45,np.nan,55,200,33,28,49,61,30,22],
    "price":      [19.99,5.00,-2.50,12.0,8.75,np.nan,3.20,15.0,-1.0,7.5,
                   22.0,9.9,9.9,40.0,-5.0,11.1,6.6,np.nan,13.3,2.2],
    "category":   ["books","music","books","TOYS","music","books","games","music",
                   "books","games","music","books","books","unknown","games","music",
                   "books","games","music","books"],
    "start_date": pd.to_datetime(["2024-01-01"]*20),
    "end_date":   pd.to_datetime(["2024-01-05","2024-01-03","2023-12-30","2024-01-10","2024-01-02",
                                  "2024-01-06","2024-01-04","2024-01-01","2023-12-25","2024-01-08",
                                  "2024-01-09","2024-01-07","2024-01-07","2024-01-11","2024-01-03",
                                  "2024-01-05","2024-01-06","2024-01-02","2024-01-04","2024-01-09"]),
})

ALLOWED = {"books", "music", "games"}

# Count rows failing each rule.
n_range = ((df["age"] < 0) | (df["age"] > 120) | (df["price"] < 0)).fillna(False).sum()
n_cat   = (~df["category"].str.lower().isin(ALLOWED)).sum()
n_null  = (df["age"].isna() | df["price"].isna()).sum()
n_dup   = df["order_id"].duplicated(keep=False).sum()
n_cross = (df["end_date"] < df["start_date"]).sum()

print("range     :", int(n_range))  # -> 6
print("category  :", int(n_cat))    # -> 2
print("null      :", int(n_null))   # -> 4
print("uniqueness:", int(n_dup))    # -> 2
print("cross     :", int(n_cross))  # -> 2`
  };
})();
