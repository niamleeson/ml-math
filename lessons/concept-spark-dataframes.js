/* Apache Spark — "The Spark DataFrame / Spark SQL API: a distributed, lazy, optimized table".
   Self-contained: lesson + CODE + CODEVIZ merged by id "spark-dataframes". */
(function () {
  window.LESSONS.push({
    id: "spark-dataframes",
    title: "Spark DataFrames: a distributed table with a schema",
    tagline: "The modern, optimized Spark API — like a pandas DataFrame, but lazy, distributed, and rewritten into an efficient plan by the Catalyst optimizer.",
    module: "Apache Spark",
    prereqs: ["dw-big-data", "dw-tidy-data"],

    whenToUse:
      `<p><b>The DataFrame / Spark SQL API is the default Spark API for structured and semi-structured
       data &mdash; reach for it almost always over the lower-level RDD (Resilient Distributed Dataset)
       API.</b> If your data has columns with names and types &mdash; a table, a Comma-Separated Values
       (CSV) file, JavaScript Object Notation (JSON), Parquet &mdash; this is the tool.</p>
       <ul>
         <li><b>Your data has a shape (columns + types).</b> A DataFrame is a distributed table with a
         <b>schema</b>. You write <code>select</code> / <code>filter</code> / <code>groupBy</code>, not
         hand-rolled <code>map</code>/<code>reduce</code> over raw records.</li>
         <li><b>You want the optimizer to help you.</b> Every DataFrame query is run through the
         <b>Catalyst optimizer</b>, which rewrites it into an efficient physical plan. Hand-written RDD
         code gets <i>no</i> such help &mdash; so DataFrames usually beat equivalent RDD code, often by a
         lot, with less effort.</li>
         <li><b>The data is genuinely big.</b> Spark distributes the table across a cluster and runs the
         query in parallel. For data that fits on one machine, pandas, Polars, or DuckDB are simpler and
         faster &mdash; do not stand up Spark for a 100 MB file (see <code>dw-big-data</code>).</li>
       </ul>
       <p>Rule of thumb: <b>structured data on a cluster &rarr; Spark DataFrames.</b> Drop to RDDs only
       for unstructured data or custom logic the DataFrame API genuinely cannot express.</p>`,

    application:
      `<p>The DataFrame API is the workhorse of large-scale data work.</p>
       <ul>
         <li><b>ETL (Extract, Transform, Load).</b> Read raw CSV/JSON/Parquet from cloud storage, clean
         and reshape it, write tidy Parquet tables back &mdash; the bread and butter of data engineering.</li>
         <li><b>Big joins and aggregations.</b> Joining a billion-row event table to a dimension table,
         or computing per-user / per-day rollups across terabytes &mdash; work that will not fit on one box.</li>
         <li><b>ML at scale.</b> Spark MLlib pipelines consume DataFrames; feature engineering on huge
         tables (the same ideas as the <code>concept-fe-*</code> lessons, but distributed) happens here.</li>
         <li><b>SQL on a lake.</b> Register a DataFrame as a view and query it with plain SQL
         (<code>spark.sql("SELECT ...")</code>) &mdash; the DataFrame API and SQL compile to the
         <b>same</b> optimized plan, so use whichever reads better.</li>
       </ul>`,

    pitfalls:
      `<ul>
         <li><b>Treating it like pandas.</b> A Spark DataFrame is <b>immutable</b> and <b>lazy</b>. There
         is no in-place edit, no <code>df["x"] = ...</code> assignment, no <code>.iloc</code> /
         <code>.loc</code> row indexing, no row index at all. You build a <i>new</i> DataFrame with
         <code>withColumn</code>, <code>select</code>, <code>filter</code>; nothing actually runs until an
         <b>action</b> (<code>show</code>, <code>count</code>, <code>collect</code>, <code>write</code>).
         Fix: think "describe the query, then trigger it," not "mutate the table."</li>
         <li><b>Printing instead of showing.</b> <code>print(df)</code> just prints the object's
         repr, not the data. Use <code>df.show()</code> (an action) to see rows, and
         <code>df.printSchema()</code> to see column names and types.</li>
         <li><b>Slow Python UDFs (User-Defined Functions).</b> A row-at-a-time Python UDF ships every row
         out to a Python process and back, defeating the optimizer and the Java Virtual Machine (JVM)
         engine. Fix: express the logic with built-in <code>pyspark.sql.functions</code> (imported as
         <code>F</code>) whenever possible; they stay in the engine and get optimized. Reach for a
         pandas/vectorized UDF only when no built-in will do.</li>
         <li><b><code>collect()</code> on a huge DataFrame.</b> <code>collect()</code> pulls <i>every
         row</i> back to the driver's memory &mdash; an instant out-of-memory crash on big data. Fix: use
         <code>show(n)</code> / <code>take(n)</code> for a peek, aggregate down to a small result first, or
         <code>write</code> the output to storage instead of collecting it.</li>
         <li><b>Trusting schema inference.</b> <code>inferSchema=True</code> makes Spark scan the data an
         extra time to guess types &mdash; slow on big files &mdash; and it can guess <b>wrong</b> (a Zone
         Improvement Plan postal code read as an integer drops leading zeros; a mixed column becomes a
         string). Fix: pass an explicit <code>StructType</code> schema for production reads. It is faster
         and removes the guessing.</li>
       </ul>`,

    bigIdea:
      `<p>A <b>Spark DataFrame</b> is a <b>distributed table with a schema</b>: rows of typed, named
       columns, physically split into partitions spread across the machines of a cluster. On the surface
       it looks just like a pandas DataFrame &mdash; you <code>select</code> columns, <code>filter</code>
       rows, add columns &mdash; but two deep differences change how you use it.</p>
       <ul>
         <li><b>It is lazy.</b> When you write <code>df.filter(...).select(...)</code>, nothing runs. Spark
         just records what you asked for, building a <i>plan</i>. Only an <b>action</b> &mdash;
         <code>show</code>, <code>count</code>, <code>collect</code>, <code>write</code> &mdash; triggers
         actual computation. (pandas, by contrast, is <b>eager</b>: each line runs immediately.)</li>
         <li><b>It is optimized.</b> Before running, the plan is handed to the <b>Catalyst optimizer</b>,
         which rewrites it &mdash; reordering filters, pruning unused columns, pushing predicates down into
         the file read, collapsing steps &mdash; into an efficient <i>physical plan</i>. You write what you
         want; Spark figures out a good <i>how</i>.</li>
       </ul>
       <p>That is why DataFrames <b>beat hand-written RDD code</b>: the RDD API runs your functions exactly
       as written, with no optimizer. The DataFrame API knows the schema and the meaning of each operation,
       so it can be smart on your behalf. Same idea as Polars' lazy mode in <code>dw-big-data</code> &mdash;
       describe the query, let the engine plan it &mdash; but scaled out across a cluster.</p>`,

    buildup:
      `<p>Build the picture one piece at a time.</p>
       <p><b>1. The SparkSession.</b> Everything starts from a <code>SparkSession</code> &mdash; your handle
       to the cluster (or, in Colab, to a single local Java Virtual Machine running in
       <code>local[*]</code> mode, using all cores of the one machine). You create it once:
       <code>spark = SparkSession.builder.master("local[*]").getOrCreate()</code>.</p>
       <p><b>2. Getting a DataFrame.</b> Either read a file &mdash; <code>spark.read.csv(...)</code>,
       <code>.parquet(...)</code>, <code>.json(...)</code> &mdash; or build one in memory with
       <code>spark.createDataFrame(rows, schema)</code>. A schema is the list of column names and types. You
       can let Spark <b>infer</b> it (<code>inferSchema=True</code>, convenient but it scans the data twice
       and can guess wrong), or give an <b>explicit</b> <code>StructType</code> (faster, exact &mdash;
       preferred for real pipelines).</p>
       <p><b>3. Looking at it.</b> <code>df.printSchema()</code> shows the column names and types;
       <code>df.show(5)</code> prints the first rows (it is an action &mdash; this is the moment work
       runs); <code>df.describe().show()</code> gives count / mean / stddev / min / max per numeric column.
       Note <code>show()</code>, not <code>print()</code>.</p>
       <p><b>4. Transforming it.</b> The core verbs, each returning a <i>new</i> DataFrame:</p>
       <ul>
         <li><code>select("a", "b")</code> &mdash; keep / compute columns.</li>
         <li><code>filter(...)</code> or its alias <code>where(...)</code> &mdash; keep rows matching a
         condition.</li>
         <li><code>withColumn("new", expr)</code> &mdash; add or replace a column.</li>
         <li><code>drop("c")</code> &mdash; remove a column. <code>distinct()</code> &mdash; unique rows.</li>
       </ul>
       <p>Conditions and computed columns are written as <b>column expressions</b>: <code>F.col("age") &gt; 30</code>,
       <code>F.col("price") * 1.1</code>. The <code>F.col(...)</code> object names a column; the optimizer
       understands these, which is what lets it rewrite your query.</p>
       <p><b>5. Triggering it.</b> The chain of transformations does nothing until an action runs. Call
       <code>.explain()</code> at any point to <i>see the optimized plan</i> Catalyst built &mdash; the
       physical steps Spark will actually execute &mdash; without running it.</p>`,

    symbols: [
      { sym: "SparkSession", desc: "the entry point to Spark: your handle to the cluster (or a local engine). Create once with SparkSession.builder.getOrCreate(); read files and build DataFrames from it." },
      { sym: "schema / StructType", desc: "the list of column names and their types (e.g. StructField('age', IntegerType())). Either inferred (convenient, slower, can guess wrong) or given explicitly (fast, exact, preferred for production)." },
      { sym: "transformation", desc: "a lazy operation that returns a new DataFrame (select, filter, withColumn, drop, distinct). Records intent; runs nothing on its own." },
      { sym: "action", desc: "an eager operation that actually runs the query and returns/writes a result (show, count, collect, take, write). The only thing that triggers computation." },
      { sym: "F.col('name')", desc: "a column expression naming a column, from pyspark.sql.functions as F. Used to build conditions (F.col('x') > 0) and computed columns (F.col('x') * 2) the optimizer can reason about." },
      { sym: "Catalyst optimizer", desc: "the engine that rewrites your DataFrame query into an efficient physical plan (reorders filters, prunes columns, pushes predicates into the read). Why DataFrames beat hand-written RDD code." }
    ],

    derivation:
      `<p><b>Why lazy + a schema lets Catalyst make your query fast &mdash; the mechanism.</b></p>
       <ul class="steps">
         <li>Because the DataFrame API is <b>lazy</b>, by the time you call an action Spark holds the
         <i>entire</i> query as a tree of operations &mdash; the <b>logical plan</b> &mdash; not a sequence
         of already-executed steps. It can see the whole thing at once.</li>
         <li>Because every column has a known <b>type and name</b> (the schema), Spark understands what each
         operation <i>means</i> &mdash; this is a filter on an integer column, that is a projection of two
         columns. An RDD is opaque: it is just "rows" running arbitrary Python functions, so nothing can be
         inferred or rewritten.</li>
         <li><b>Catalyst</b> rewrites the logical plan with semantics-preserving rules. Three classic wins:
         <b>predicate pushdown</b> (move a <code>filter</code> down so it happens during the file read, so
         fewer rows are ever loaded &mdash; the same trick as Parquet in <code>dw-big-data</code>);
         <b>column pruning</b> (if you only <code>select</code> two of fifty columns, never read the other
         forty-eight); and <b>filter reordering / fusion</b> (apply the cheapest, most selective filter
         first; fuse adjacent maps into one pass).</li>
         <li>The optimized logical plan is turned into a <b>physical plan</b> &mdash; concrete operators,
         choosing for example a broadcast join over a shuffle join when one side is small. This is what
         <code>.explain()</code> prints.</li>
         <li>Net effect: you wrote a high-level query and got a plan that reads less data and does less work
         than a literal execution of your code &mdash; and far less than equivalent hand-written RDD code,
         which runs exactly as typed with no rewriting. <b>Same answer, less work, no extra effort from
         you.</b> $\\blacksquare$</li>
       </ul>`,

    example:
      `<p>A tiny three-column table of people, built in memory with an explicit schema
       (<code>name</code> string, <code>age</code> integer, <code>city</code> string). The query: "names and
       ages of people over 30, with age in dog-years" &mdash;
       <code>df.filter(F.col("age") &gt; 30).withColumn("dog_years", F.col("age") * 7).select("name", "age", "dog_years")</code>.</p>
       <table class="extable">
         <caption>Input rows (left) and which survive <code>age &gt; 30</code> (right). The pruned <code>city</code> column is greyed by the optimizer.</caption>
         <thead><tr><th>name</th><th class="num">age</th><th>city</th><th>kept by filter?</th><th class="num">dog_years = age &times; 7</th></tr></thead>
         <tbody>
           <tr><td class="row-h">Ada</td><td class="num">36</td><td>London</td><td>yes</td><td class="num">252</td></tr>
           <tr><td class="row-h">Linus</td><td class="num">25</td><td>Helsinki</td><td>no</td><td class="num">&mdash;</td></tr>
           <tr><td class="row-h">Grace</td><td class="num">41</td><td>New York</td><td>yes</td><td class="num">287</td></tr>
           <tr><td class="row-h">Alan</td><td class="num">29</td><td>London</td><td>no</td><td class="num">&mdash;</td></tr>
         </tbody>
       </table>
       <ul class="steps">
         <li><b>Build.</b> <code>spark.createDataFrame(rows, schema)</code> &mdash; no extra scan, exact types. At
         this point, and after the <code>filter</code>/<code>withColumn</code>/<code>select</code> chain,
         <b>nothing has run</b> &mdash; it is just a lazy plan.</li>
         <li><b>Apply the filter.</b> Keep rows where <code>age &gt; 30</code>: Ada (36 &gt; 30 &check;) and Grace
         (41 &gt; 30 &check;) stay; Linus (25) and Alan (29) drop. 4 rows &rarr; 2 rows.</li>
         <li><b>Compute the column.</b> <code>dog_years = age &times; 7</code>: Ada $\\to 36 \\times 7 = 252$;
         Grace $\\to 41 \\times 7 = 287$.</li>
         <li><b>Inspect the plan.</b> <code>.explain()</code> shows Catalyst pushed the <code>age &gt; 30</code>
         filter down and pruned <code>city</code> (never read, since the final <code>select</code> does not need it).</li>
         <li><b>Trigger.</b> <code>result.show()</code> &mdash; <i>this</i> action runs the optimized plan and
         prints the two rows. Had you written <code>print(result)</code> you would have seen only the object
         repr, not the data.</li>
       </ul>
       <table class="extable">
         <caption>What <code>result.show()</code> finally prints.</caption>
         <thead><tr><th>name</th><th class="num">age</th><th class="num">dog_years</th></tr></thead>
         <tbody>
           <tr><td class="row-h">Ada</td><td class="num">36</td><td class="num">252</td></tr>
           <tr><td class="row-h">Grace</td><td class="num">41</td><td class="num">287</td></tr>
         </tbody>
       </table>`,

    practice: [
      {
        q: `You write <code>df2 = df.filter(F.col("amount") &gt; 100).select("user", "amount")</code> and then <code>print(df2)</code>, but you see something like <code>DataFrame[user: string, amount: double]</code> instead of any rows, and it returned instantly. What happened, and how do you actually see the data and the plan?`,
        steps: [
          { do: `Recognize that <code>filter</code> and <code>select</code> are <b>transformations</b> &mdash; lazy. They built a plan; they ran nothing.`, why: `A Spark DataFrame is lazy: transformations only record intent. That is why it returned instantly.` },
          { do: `Recognize that <code>print(df2)</code> prints the DataFrame's repr (its schema), not its rows.`, why: `<code>print</code> is not a Spark action; it never triggers computation, so no rows are fetched.` },
          { do: `Call an <b>action</b> to run it: <code>df2.show()</code> for the rows. Use <code>df2.explain()</code> to see the optimized plan.`, why: `<code>show()</code> is an action &mdash; it runs the optimized query and prints rows; <code>explain()</code> reveals Catalyst's physical plan.` }
        ],
        answer: `<p>Nothing ran. <code>filter</code> and <code>select</code> are <b>lazy transformations</b> &mdash; they only built a query plan, which is why the call returned instantly. <code>print(df2)</code> shows the DataFrame's <i>schema repr</i>, not its data, because <code>print</code> is not a Spark <b>action</b>. To see the rows, call an action: <code>df2.show()</code>. To see the optimized plan Catalyst built (e.g. the <code>amount &gt; 100</code> filter pushed down), call <code>df2.explain()</code>. This is the number-one pandas-habit trap in Spark.</p>`
      },
      {
        q: `A teammate has a function <code>clean(s)</code> in Python and wraps it as a UDF (User-Defined Function) to uppercase and trim a <code>city</code> column over a billion-row DataFrame. The job is painfully slow. What is the likely cause and the fix?`,
        steps: [
          { do: `Identify that a Python UDF runs row-by-row in a separate Python process, outside the JVM engine.`, why: `Every row is serialized out to Python and back, and the Catalyst optimizer cannot see inside the UDF, so it cannot optimize it.` },
          { do: `Check whether built-in <code>pyspark.sql.functions</code> can do the same job: here <code>F.trim(F.upper(F.col("city")))</code>.`, why: `Built-in <code>F.</code> functions run inside the engine, stay vectorized, and are visible to the optimizer.` },
          { do: `Replace the UDF: <code>df.withColumn("city", F.trim(F.upper(F.col("city"))))</code>.`, why: `No per-row Python round-trip; the operation is pushed into the optimized plan and runs far faster.` }
        ],
        answer: `<p>The slowness is the <b>Python UDF</b>: it ships every one of the billion rows out to a Python process and back, and the Catalyst optimizer cannot see inside it, so it gets no optimization. The fix is to express the same logic with <b>built-in <code>pyspark.sql.functions</code></b> &mdash; here <code>df.withColumn("city", F.trim(F.upper(F.col("city"))))</code>. Built-in <code>F.</code> functions run inside the engine and are optimizable, so they are dramatically faster. Only reach for a UDF (and prefer a vectorized/pandas UDF) when no built-in can express the logic.</p>`
      },
      {
        q: `You read a big CSV of orders with <code>spark.read.csv(path, header=True, inferSchema=True)</code>. It is slow to read, and a column of order IDs like <code>"007"</code> and <code>"012"</code> comes back as integers <code>7</code> and <code>12</code>, losing the leading zeros. Diagnose both problems and give the fix.`,
        steps: [
          { do: `Recognize <code>inferSchema=True</code> makes Spark scan the file an extra time to guess column types.`, why: `That second pass over a big file is the source of the slow read.` },
          { do: `Recognize the order-ID column is really a string identifier, but inference saw all-digits and guessed integer, dropping the leading zeros.`, why: `Schema inference guesses from the data and gets identifier-like columns wrong &mdash; an integer cannot hold <code>"007"</code>.` },
          { do: `Define an explicit <code>StructType</code> with <code>order_id</code> as <code>StringType()</code> and pass <code>schema=...</code> instead of <code>inferSchema</code>.`, why: `An explicit schema reads in one pass (faster) and forces the correct types, so <code>"007"</code> stays a string.` }
        ],
        answer: `<p>Both problems come from <b>schema inference</b>. The slow read is the <i>extra data scan</i> <code>inferSchema=True</code> does to guess types. The corrupted IDs are inference <i>guessing wrong</i>: an all-digits column looked like an integer, so <code>"007"</code> became <code>7</code> and the leading zeros were lost (an integer cannot store them). The fix is an <b>explicit <code>StructType</code></b> schema with <code>order_id</code> typed as <code>StringType()</code>, passed via <code>schema=...</code>. It reads in a single pass (faster) and pins the right types &mdash; the standard practice for production reads.</p>`
      }
    ]
  });

  window.CODE["spark-dataframes"] = {
    lib: "PySpark",
    runnable: false,
    explain: `<p>The DataFrame API end to end, runnable in Google Colab (local mode) after the setup cell runs
      <code>!pip install pyspark</code>. We create a <b>SparkSession</b>, build a DataFrame from in-memory rows with an
      <b>explicit <code>StructType</code> schema</b> (no inference, exact types), then exercise the core verbs &mdash;
      <code>printSchema</code>, <code>show</code>, <code>describe</code>, <code>filter</code>/<code>where</code>,
      <code>withColumn</code>, <code>select</code>, <code>drop</code>, <code>distinct</code> &mdash; using column
      expressions from <code>pyspark.sql.functions as F</code>. Finally <code>.explain()</code> reveals the
      <b>optimized physical plan</b> Catalyst built (note the pushed-down filter and pruned column). Nothing runs until
      an action like <code>show()</code>; <code>runnable</code> is off because the in-browser engine has no Java Virtual
      Machine.</p>`,
    code: `# Colab: !pip install pyspark
from pyspark.sql import SparkSession
from pyspark.sql import functions as F
from pyspark.sql.types import StructType, StructField, StringType, IntegerType

# 1. A SparkSession: your handle to the engine. local[*] = use all cores of this one Colab VM.
spark = (SparkSession.builder
         .master("local[*]")
         .appName("dataframes-demo")
         .getOrCreate())

# 2. Build a DataFrame with an EXPLICIT schema (no inference -> fast + exact types).
schema = StructType([
    StructField("name", StringType(), nullable=False),
    StructField("age",  IntegerType(), nullable=False),
    StructField("city", StringType(), nullable=False),
])
rows = [
    ("Ada",   36, "London"),
    ("Linus", 25, "Helsinki"),
    ("Grace", 41, "New York"),
    ("Alan",  29, "London"),
    ("Ada",   36, "London"),   # a duplicate row, on purpose
]
df = spark.createDataFrame(rows, schema)

# 3. LOOK at it (printSchema + show + describe are how you inspect a DataFrame).
df.printSchema()          # column names and types -- NOT print(df)
df.show()                 # an ACTION: prints the rows. use .show(), never print(df)
df.describe().show()      # count / mean / stddev / min / max per column

# 4. TRANSFORM it. Each call returns a NEW DataFrame (immutable); nothing runs yet (lazy).
result = (
    df.distinct()                                   # drop the duplicate row
      .filter(F.col("age") > 30)                    # .where() is an exact alias of .filter()
      .withColumn("dog_years", F.col("age") * 7)    # add a computed column via a column expression
      .drop("city")                                 # remove a column we no longer need
      .select("name", "age", "dog_years")           # keep just these columns
)

# 5. INSPECT THE OPTIMIZED PLAN, then TRIGGER it.
result.explain()          # shows Catalyst's physical plan (filter pushed down, 'city' pruned)
result.show()             # the ACTION that actually runs the optimized query and prints rows
print("matching rows:", result.count())   # count() is also an action

# Bonus: the SAME query as plain SQL compiles to the SAME optimized plan.
df.createOrReplaceTempView("people")
spark.sql("SELECT name, age, age * 7 AS dog_years FROM people WHERE age > 30").show()

spark.stop()`
  };

  window.CODEVIZ["spark-dataframes"] = {
    question: "How do you READ the result of df.filter(...).groupBy('species').count() — the grey-vs-green before/after bars — and spot the cases (heavy filter, no-op filter, schema-inference corruption) where the bars look wrong?",
    charts: [
      {
        type: "bars",
        title: "Ideal: filter(petal_length > 1.5).groupBy('species').count() on real Iris (150 rows)",
        labels: ["setosa all", "setosa kept", "versicolor all", "versicolor kept", "virginica all", "virginica kept"],
        values: [50, 13, 50, 50, 50, 50],
        valueLabels: ["50", "13", "50", "50", "50", "50"],
        colors: ["#6e7681", "#7ee787", "#6e7681", "#7ee787", "#6e7681", "#7ee787"],
        interpret: "<b>The canonical filter-then-count result, real numbers.</b> Bars are grouped in pairs per species: grey is rows before the filter, green is rows that survive <code>petal_length &gt; 1.5</code>. <b>Read it:</b> compare each green bar to the grey beside it. Versicolor and virginica are untouched (50 to 50) because their petals are long; setosa drops 50 to 13 because setosa petals are famously short. This little table is exactly what <code>.show()</code> would print — except Spark builds it lazily (nothing runs until the action) and across partitions."
      },
      {
        type: "bars",
        title: "Variant — heavy filter: one group nearly collapses (illustrative)",
        labels: ["setosa all", "setosa kept", "versicolor all", "versicolor kept", "virginica all", "virginica kept"],
        values: [50, 1, 50, 47, 50, 49],
        valueLabels: ["50", "1", "50", "47", "50", "49"],
        colors: ["#6e7681", "#ffb454", "#6e7681", "#7ee787", "#6e7681", "#7ee787"],
        interpret: "<b>Illustrative: a much stricter predicate, e.g. <code>petal_length &gt; 2.5</code>.</b> Same grey-vs-coloured pairing. <b>Read it:</b> when one green/orange bar shrinks to near zero (setosa 50 to 1) while others barely move, the filter is selective <i>against that group</i> — not a bug, just biology. Watch for groups that vanish entirely: a group at 0 disappears from the count output, so a species you expected can silently go missing. Always sanity-check that the groups you need survive the filter."
      },
      {
        type: "bars",
        title: "Variant — no-op filter: predicate keeps everything (illustrative)",
        labels: ["setosa all", "setosa kept", "versicolor all", "versicolor kept", "virginica all", "virginica kept"],
        values: [50, 50, 50, 50, 50, 50],
        valueLabels: ["50", "50", "50", "50", "50", "50"],
        colors: ["#6e7681", "#9aa7b4", "#6e7681", "#9aa7b4", "#6e7681", "#9aa7b4"],
        interpret: "<b>Illustrative: a predicate that matches every row, e.g. <code>petal_length &gt; 0</code>.</b> <b>Read it:</b> every grey bar and its grey-blue partner are the same height — the filter removed nothing. If you expected the filter to cut rows and the before/after bars are identical, the predicate is wrong (too loose, wrong column, wrong units) or the data does not contain what you assumed. An unchanged count is a signal to re-read the condition, not proof the data is clean."
      },
      {
        type: "bars",
        title: "Variant — schema inference corrupts the key: distinct groups collapse (illustrative)",
        labels: ["007 (string)", "012 (string)", "042 (string)", "7,12,42 -> merged (int)"],
        values: [40, 35, 25, 100],
        valueLabels: ["40", "35", "25", "100"],
        colors: ["#7ee787", "#7ee787", "#7ee787", "#ff7b72"],
        interpret: "<b>Illustrative: <code>inferSchema=True</code> guessing the group key wrong.</b> The three green bars are the correct per-id counts when <code>order_id</code> is read as a string (<code>\"007\"</code>, <code>\"012\"</code>, <code>\"042\"</code> stay distinct). <b>Read it:</b> if inference reads that all-digit column as an integer, leading zeros drop and the values stop being distinct ids — the red bar shows the groups silently merging into one bloated count. When a groupBy returns fewer, fatter groups than you expected, suspect a mistyped key. Fix with an explicit <code>StructType</code> typing the id as <code>StringType()</code>."
      }
    ],
    caption: "Chart 1 is the real Iris result (filter petal_length > 1.5, then count per species), computed in pandas to show exactly what the Spark .show() returns. Charts 2-4 are illustrative variants: a heavy filter that nearly empties a group, a no-op filter that changes nothing (a signal the predicate is wrong), and schema-inference reading the group key as the wrong type so distinct groups silently merge. Each interpret says how to read its bars and what to conclude.",
    code: `import pandas as pd
from sklearn.datasets import load_iris

# Real 150-row Iris dataset. This pandas computation ILLUSTRATES what the
# Spark DataFrame query  df.filter(F.col("petal_length") > 1.5)
#                          .groupBy("species").count()  returns.
d = load_iris(as_frame=True)
df = d.frame.rename(columns={"petal length (cm)": "petal_length"})
df["species"] = df["target"].map({0: "setosa", 1: "versicolor", 2: "virginica"})

all_counts = df.groupby("species").size()                    # before the filter
filtered   = df[df["petal_length"] > 1.5]                     # the .filter(...) step
flt_counts = filtered.groupby("species").size()              # the .groupBy().count() step

for sp in ["setosa", "versicolor", "virginica"]:
    print(f"{sp:11s} all {all_counts[sp]:3d}  ->  filtered {flt_counts[sp]:3d}")
# setosa      all  50  ->  filtered  13
# versicolor  all  50  ->  filtered  50
# virginica   all  50  ->  filtered  50
# In Spark you'd see this with result.show(), not print -- and it would be
# built lazily and computed across partitions on a cluster.`
  };
})();
