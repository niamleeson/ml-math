/* Apache Spark — "Spark SQL: run real SQL on DataFrames at scale".
   Self-contained: lesson + CODE + CODEVIZ merged by id "spark-sql".
   CODE is real PySpark that RUNS IN GOOGLE COLAB (local mode); runnable:false (no JVM in the browser). */
(function () {
  window.LESSONS.push({
    id: "spark-sql",
    title: "Spark SQL: query DataFrames with real SQL at scale",
    tagline: "Register a DataFrame as a view, then SELECT from it — SQL and the DataFrame API compile to the same plan, so they run identically fast.",
    module: "Apache Spark (big-data processing)",
    prereqs: ["dw-big-data", "dw-combining"],

    bigIdea:
      `<p>You already know how to read and group a table of data. The question this lesson answers is:
       what if the table is a <b>terabyte</b>, sitting across a cluster of machines, and the people who
       need to query it are SQL-fluent analysts, not Python programmers? <b>Spark SQL</b> is the answer.
       It lets you run plain structured query language (SQL) &mdash; the same
       <code>SELECT ... WHERE ... GROUP BY ... ORDER BY</code> you'd type against a database &mdash;
       directly on a Spark DataFrame, with Spark splitting the work across the whole cluster.</p>
       <p>The move is two steps. First you <b>register</b> a DataFrame as a named temporary view with
       <code>df.createOrReplaceTempView("sales")</code>. That just gives the DataFrame a name SQL can
       refer to &mdash; it copies nothing. Then you call <code>spark.sql("SELECT ... FROM sales ...")</code>
       and get back another DataFrame.</p>
       <p>The single most important idea here: <b>SQL and the DataFrame application programming interface
       (API) are interchangeable.</b> They are two front doors to the same engine. Whether you write
       <code>spark.sql("SELECT category, SUM(amount) ...")</code> or
       <code>df.groupBy("category").sum("amount")</code>, Spark turns <i>both</i> into the same internal
       plan (a Catalyst plan &mdash; Catalyst is Spark's query optimizer) and runs <i>identical</i> work.
       Same plan, same speed. Neither is "the fast way." This frees you to pick whichever reads better for
       the task and even mix the two in one pipeline.</p>`,

    buildup:
      `<p>Let's build it up one piece at a time.</p>
       <p><b>1. A DataFrame is a table.</b> A Spark DataFrame is just a distributed table: named, typed
       columns and a lot of rows spread across the cluster. SQL operates on tables. So a DataFrame is
       already the right shape for SQL &mdash; it only needs a name.</p>
       <p><b>2. A temporary view gives it that name.</b>
       <code>df.createOrReplaceTempView("sales")</code> registers the DataFrame in the session's catalog
       under the name <code>sales</code>. No data is copied or moved; the view is a label pointing at the
       same DataFrame. "Or replace" means re-running the line just re-points the name, which is handy in a
       notebook. The view is <b>session-scoped</b>: it lives only as long as your Spark session and
       disappears when the session restarts.</p>
       <p><b>3. <code>spark.sql(...)</code> runs the query.</b> You pass a SQL string;
       <code>spark.sql</code> parses it, plans it, and returns a new DataFrame (lazily &mdash; nothing
       actually runs until you call an action like <code>.show()</code> or <code>.collect()</code>). From
       there it is an ordinary DataFrame you can chain more operations onto.</p>
       <p><b>4. SQL and the API meet in the middle.</b> Both your SQL string and the equivalent DataFrame
       calls are translated into the same logical plan, which Catalyst then optimizes into the same
       physical plan. You can prove it: call <code>.explain()</code> on each and compare &mdash; the plans
       match. That is why their performance is identical.</p>
       <p><b>5. External tables.</b> Beyond views you registered yourself, Spark SQL can read tables that
       already exist in a <b>catalog</b> &mdash; classically a Hive metastore, a service that records where
       each table's files live and what its schema is. <code>spark.sql("SELECT * FROM warehouse.orders")</code>
       or <code>spark.table("warehouse.orders")</code> reads a table an analyst never had to define in
       Python. This is what lets a whole team query shared terabyte-scale tables with familiar SQL.</p>`,

    symbols: [],

    derivation:
      `<p><b>Why SQL and the DataFrame API have exactly the same performance.</b> This is the claim that
       surprises people, so here is the mechanism.</p>
       <ul class="steps">
         <li>Spark does not execute your query the way you wrote it. Every query &mdash; whether it arrives
         as a SQL string through <code>spark.sql</code> or as method calls like <code>.filter().groupBy()</code>
         &mdash; is first turned into an <b>unresolved logical plan</b>: a tree of operations (scan, filter,
         aggregate) with no decisions yet about <i>how</i> to run them.</li>
         <li>That tree is the <b>same tree</b> for the SQL form and the API form, because they describe the
         same operations. A <code>WHERE region = 'west'</code> clause and a
         <code>.filter(col("region") == "west")</code> call become the identical filter node.</li>
         <li><b>Catalyst</b>, Spark's optimizer, then rewrites the tree the same way regardless of how it
         arrived: it resolves column names against the schema, pushes filters down toward the scan so less
         data is read, prunes unused columns, folds constants, and reorders operations. Adaptive Query
         Execution (AQE) can further adjust the plan at runtime using real partition sizes.</li>
         <li>The optimized logical plan is compiled to a <b>physical plan</b> &mdash; the actual stages and
         tasks &mdash; and code-generated. By this stage the original syntax is long gone.</li>
         <li>So two queries that mean the same thing produce <b>byte-for-byte the same physical plan</b>, run
         the same stages, shuffle the same data, and finish in the same time. <code>.explain()</code> on each
         prints matching plans. SQL is not slower or faster than the API; it is the same engine wearing a
         different hat. $\\blacksquare$</li>
       </ul>`,

    example:
      `<p>A tiny <code>sales</code> table &mdash; four rows, columns <code>category</code> and
       <code>amount</code>:</p>
       <ul class="steps">
         <li><code>("books", 30)</code>, <code>("books", 20)</code>, <code>("toys", 50)</code>,
         <code>("toys", 5)</code>.</li>
         <li><b>Register it:</b> <code>df.createOrReplaceTempView("sales")</code>.</li>
         <li><b>SQL form:</b> <code>spark.sql("SELECT category, SUM(amount) AS total FROM sales WHERE amount &gt;= 10 GROUP BY category ORDER BY total DESC")</code>.
         The <code>WHERE amount &gt;= 10</code> drops the <code>("toys", 5)</code> row before aggregating.</li>
         <li><b>DataFrame-API form:</b>
         <code>df.filter(df.amount &gt;= 10).groupBy("category").agg(sum("amount").alias("total")).orderBy("total", ascending=False)</code>.</li>
         <li><b>Both return the same result:</b> <code>toys&nbsp;50</code>, then <code>books&nbsp;50</code>.
         And <code>.explain()</code> on each prints the same physical plan &mdash; same filter pushdown, same
         <code>HashAggregate</code>, same sort. Identical work, your choice of syntax.</li>
       </ul>`,

    whenToUse:
      `<p><b>Reach for Spark SQL when the data is genuinely cluster-scale and the people querying it think
       in SQL.</b> (For data that fits on one machine, the cheap pandas/Polars moves in the
       <code>dw-big-data</code> lesson are usually the better first stop &mdash; Spark earns its keep at the
       terabyte scale that strains a single box.)</p>
       <ul>
         <li><b>SQL-fluent teams.</b> Analysts, data scientists, and business users who already write SQL
         can query terabyte tables without learning the DataFrame API. The familiar
         <code>SELECT/WHERE/GROUP BY/JOIN</code> just works, distributed.</li>
         <li><b>Ad-hoc analytics on big tables.</b> Exploratory "what's the revenue by region this quarter"
         questions against a shared warehouse table in the catalog &mdash; one <code>spark.sql</code> call,
         no Python plumbing.</li>
         <li><b>Mixing SQL with programmatic logic.</b> Use a SQL string for the readable filter-and-aggregate
         core, then keep chaining DataFrame methods (or a User-Defined Function) for steps that are awkward to
         express in SQL. Because both compile to the same plan, mixing costs nothing.</li>
         <li><b>Reading shared catalog tables.</b> When tables are defined once in a Hive metastore or
         catalog, anyone can <code>SELECT * FROM db.table</code> without redefining the schema or file paths.</li>
       </ul>
       <p><b>SQL string vs the DataFrame API:</b> prefer the <b>SQL string</b> when the query is a static,
       readable report &mdash; SQL is often the clearest way to state a join-and-aggregate. Prefer the
       <b>DataFrame API</b> when you build the query <i>programmatically</i> &mdash; adding columns or filters
       in a loop, reusing pieces, or composing from typed variables &mdash; because composing method calls is
       safer and cleaner than gluing strings together. The performance is the same; choose for readability and
       safety.</p>`,

    application:
      `<p>Spark SQL is the everyday interface to big data in production.</p>
       <ul>
         <li><b>The data warehouse / lakehouse.</b> Terabyte-to-petabyte fact and dimension tables in a
         catalog, queried with SQL by analysts through Spark or engines built on it. Most "run this report
         over all of history" jobs are Spark SQL.</li>
         <li><b>Extract, Transform, Load (ETL) pipelines.</b> Nightly jobs that read raw tables, join and
         aggregate them with SQL, and write curated tables back &mdash; the SQL is readable and reviewable by
         the whole team.</li>
         <li><b>Big joins.</b> Joining a billion-row events table to a dimension table is a one-line SQL
         <code>JOIN</code>; Spark handles the distributed shuffle (or broadcasts the small side).</li>
         <li><b>Feeding machine learning at scale.</b> Build training tables with SQL aggregations over huge
         logs, then hand the resulting DataFrame to Spark MLlib or export it for training.</li>
       </ul>`,

    pitfalls:
      `<ul>
         <li><b>Building query strings from user input (SQL injection).</b> Pasting raw input into a
         <code>spark.sql(f"... WHERE name = '{user_input}'")</code> string lets a crafted value rewrite your
         query &mdash; the same injection risk as any database. Fix: prefer the DataFrame API
         (<code>df.filter(col("name") == user_value)</code>, which never parses the value as SQL) for
         anything driven by input, or strictly validate/whitelist values before interpolating.</li>
         <li><b>Thinking SQL is faster or slower than the DataFrame API.</b> They are <b>identical</b> &mdash;
         both compile through Catalyst to the same physical plan. Fix: stop optimizing by switching syntax;
         choose for readability, and use <code>.explain()</code> to confirm the plan if you doubt it.</li>
         <li><b>Temp views vanishing after a restart.</b> <code>createOrReplaceTempView</code> registers a
         <b>session-scoped</b> view &mdash; it is gone when the session ends, so a later job that does
         <code>SELECT * FROM sales</code> fails with "table not found." Fix: re-register the view in each
         session, or persist the data as a real catalog table
         (<code>df.write.saveAsTable("db.sales")</code>) if it must outlive the session.</li>
         <li><b>Returning a huge result to the driver.</b> A <code>SELECT *</code> over a terabyte table
         followed by <code>.collect()</code> (or <code>toPandas()</code>) tries to pull the whole thing into
         the single driver machine's memory and crashes it. Fix: aggregate or
         <code>LIMIT</code> in the SQL so only a small result comes back; keep big intermediate results
         distributed and <code>.write</code> them out instead of collecting.</li>
         <li><b>Forgetting SQL is lazy.</b> <code>spark.sql(...)</code> returns a DataFrame but runs nothing
         until an action. A query that "did nothing" usually just never hit a <code>.show()</code>/
         <code>.write</code>. Fix: trigger it with an action when you actually want the result.</li>
       </ul>`,

    practice: [
      {
        q: `A colleague insists you rewrite a slow report from <code>spark.sql("SELECT region, SUM(amount) FROM sales GROUP BY region")</code> into the DataFrame API "because the API is faster in Spark." Is that true? How would you settle it?`,
        steps: [
          { do: `Recall how Spark executes any query.`, why: `Both SQL strings and DataFrame method calls are turned into the same logical plan, then optimized by Catalyst into the same physical plan.` },
          { do: `Write the API equivalent and call <code>.explain()</code> on both versions.`, why: `<code>.explain()</code> prints the physical plan; if the plans match, the work — and therefore the runtime — is the same.` },
          { do: `Look for the real bottleneck instead (a wide shuffle, data skew, or a giant <code>collect()</code>).`, why: `Performance comes from the plan and data movement, not from which front-end syntax produced the plan.` }
        ],
        answer: `<p><b>No, it's not true.</b> SQL and the DataFrame API compile through Catalyst to the <b>same physical plan</b>, so they run identically fast. Prove it by calling <code>.explain()</code> on both forms and comparing the printed plans &mdash; they'll match. The report's slowness lives in the plan (a shuffle, skew, or a result being collected to the driver), not in the choice of SQL vs API. Rewriting the syntax changes nothing; investigate the plan and data movement instead. Keep whichever form reads better &mdash; here the SQL string is perfectly clear.</p>`
      },
      {
        q: `You expose a search box that filters a Spark table by category, and you implement it as <code>spark.sql(f"SELECT * FROM products WHERE category = '{user_text}'")</code>. Why is this risky, and what's the safer pattern?`,
        steps: [
          { do: `Notice that <code>user_text</code> is pasted directly into the SQL string.`, why: `A value like <code>x' OR '1'='1</code> would rewrite the query's logic — classic SQL injection.` },
          { do: `Switch to the DataFrame API: <code>spark.table("products").filter(col("category") == user_text)</code>.`, why: `The value is passed as data, never parsed as SQL, so it cannot change the query structure.` },
          { do: `If you must use SQL, validate or whitelist the input first.`, why: `Restricting input to known-safe values removes the injection surface before interpolation.` }
        ],
        answer: `<p>Interpolating <code>user_text</code> into the SQL string is <b>SQL injection</b>: a crafted value (e.g. <code>x' OR '1'='1</code>) can rewrite the query and leak or alter data. The safer pattern is the <b>DataFrame API</b> &mdash; <code>spark.table("products").filter(col("category") == user_text)</code> &mdash; because the value is treated as data and never parsed as SQL, so it cannot change the query's structure. If a SQL string is unavoidable, strictly validate or whitelist the input before building the string. (This is exactly where the API's programmatic composition beats raw SQL strings.)</p>`
      },
      {
        q: `A scheduled job runs <code>spark.sql("SELECT * FROM sales WHERE region='west'")</code> and fails with "Table or view 'sales' not found", even though the same query worked in your notebook yesterday. What likely happened, and how do you fix it?`,
        steps: [
          { do: `Recall how <code>sales</code> was created — almost certainly <code>df.createOrReplaceTempView("sales")</code>.`, why: `A temporary view is session-scoped: it exists only inside the Spark session that created it.` },
          { do: `Note that the scheduled job runs in a fresh session.`, why: `When the previous session ended, the temp view disappeared, so the new session has no <code>sales</code> to query.` },
          { do: `Either re-register the view at the start of the job, or persist it as a catalog table.`, why: `Re-registering recreates the name each run; <code>saveAsTable</code> stores a real table that survives across sessions.` }
        ],
        answer: `<p>The <code>sales</code> view was registered with <code>createOrReplaceTempView</code>, which is <b>session-scoped</b> &mdash; it vanished when the notebook's session ended, so the scheduled job's fresh session has no such view. Fix it by <b>re-registering the view inside the job</b> (re-read the DataFrame and call <code>createOrReplaceTempView("sales")</code> before the query), or, if the table should outlive sessions, <b>persist it as a real catalog table</b> with <code>df.write.saveAsTable("db.sales")</code> and query that instead. Temp views are convenient but ephemeral by design.</p>`
      }
    ]
  });

  window.CODE["spark-sql"] = {
    lib: "PySpark",
    runnable: false,
    explain: `<p>Real PySpark for Spark SQL. It runs in <b>Google Colab</b> after the setup cell does
      <code>!pip install pyspark</code> (Spark runs in local mode &mdash; one Java Virtual Machine on the Colab
      VM). It builds a small <code>sales</code> DataFrame, registers it as a temporary view with
      <code>createOrReplaceTempView</code>, runs a <code>spark.sql</code> query with
      <code>WHERE</code>/<code>GROUP BY</code>/<code>ORDER BY</code>, writes the <b>identical</b> query with the
      DataFrame API, shows the two results match, and calls <code>.explain()</code> on both to prove they
      compile to the <b>same physical plan</b>. <code>runnable</code> is off because the in-browser engine has
      no Java Virtual Machine &mdash; paste it into Colab to run it.</p>`,
    code: `# Colab: !pip install pyspark   (the notebook's setup cell installs it)
from pyspark.sql import SparkSession
from pyspark.sql.functions import sum as Fsum   # alias: 'sum' is also a Python builtin

spark = (SparkSession.builder
         .master("local[*]")          # local mode: use all Colab cores, one JVM
         .appName("spark-sql-demo")
         .getOrCreate())

# ---- a small DataFrame (in real life: terabytes read from the catalog) ----
df = spark.createDataFrame(
    [("books", "west", 30), ("books", "east", 20),
     ("toys",  "west", 50), ("toys",  "east",  5),
     ("games", "west", 40), ("games", "east", 15)],
    schema=["category", "region", "amount"])

# ============================================================
# 1. REGISTER the DataFrame as a session-scoped temporary view
# ============================================================
df.createOrReplaceTempView("sales")     # gives SQL a name to refer to; copies no data

# ============================================================
# 2. Query it with REAL SQL  (WHERE / GROUP BY / ORDER BY)
# ============================================================
sql_df = spark.sql('''
    SELECT category, SUM(amount) AS total
    FROM sales
    WHERE amount >= 10                 -- drops the ('toys','east',5) row
    GROUP BY category
    ORDER BY total DESC
''')
print("SQL result:")
sql_df.show()
# +--------+-----+
# |category|total|
# +--------+-----+
# |   games|   55|   (ORDER BY total DESC)
# |   books|   50|
# |    toys|   50|
# +--------+-----+

# ============================================================
# 3. The IDENTICAL query in the DataFrame API
# ============================================================
api_df = (df.filter(df.amount >= 10)
            .groupBy("category")
            .agg(Fsum("amount").alias("total"))
            .orderBy("total", ascending=False))
print("DataFrame-API result:")
api_df.show()

# same rows? collect both as sets and compare
assert {tuple(r) for r in sql_df.collect()} == {tuple(r) for r in api_df.collect()}
print("SQL and DataFrame API returned identical rows.")

# ============================================================
# 4. PROVE they compile to the SAME physical plan
# ============================================================
print("---- SQL plan ----")
sql_df.explain()      # prints the physical plan
print("---- API plan ----")
api_df.explain()      # ...identical: same filter pushdown, HashAggregate, Sort

# ============================================================
# 5. READING AN EXTERNAL CATALOG TABLE (Hive metastore)
#    On a real cluster the catalog already knows these tables:
# ============================================================
# spark.sql("SHOW TABLES").show()                 # list catalog tables
# orders = spark.sql("SELECT * FROM warehouse.orders")   # query a shared table
# orders2 = spark.table("warehouse.orders")              # same thing via the API
# To outlive the session, persist instead of a temp view:
# df.write.mode("overwrite").saveAsTable("warehouse.sales")

spark.stop()`
  };

  window.CODEVIZ["spark-sql"] = {
    question: "What does a Spark SQL 'SELECT region, SUM(amount) ... WHERE MedInc>3 GROUP BY region ORDER BY total DESC' query return — total sales by region — on a real dataset?",
    charts: [
      {
        type: "bars",
        title: "Total sales amount by region (GROUP BY result, $ millions)",
        xlabel: "region",
        ylabel: "total amount ($ millions)",
        labels: ["far_south", "central", "south", "north", "far_north"],
        values: [1064.09, 1055.20, 898.78, 250.35, 10.32],
        valueLabels: ["1064.09", "1055.20", "898.78", "250.35", "10.32"],
        colors: ["#7ee787", "#7ee787", "#7ee787", "#7ee787", "#7ee787"]
      }
    ],
    caption: "Real numbers from fetch_california_housing (20,640 rows). We turn it into a 'sales' table (region from Latitude bands, amount = median house value in dollars), then compute exactly what the Spark SQL query SELECT region, SUM(amount) AS total FROM sales WHERE MedInc > 3 GROUP BY region ORDER BY total DESC returns — using pandas so the bars are reproducible. The filter keeps higher-income blocks (MedInc > 3); the GROUP BY collapses ~13k surviving rows into one total per region; ORDER BY sorts them. far_south and central lead at ~1.06 and ~1.06 billion dollars, far_north trails at ~10M. In Spark this same query runs distributed over a terabyte the identical way — and the DataFrame-API form df.filter(...).groupBy('region').agg(sum('amount')) compiles to the same plan and returns the same numbers.",
    code: `import numpy as np
import pandas as pd
from sklearn.datasets import fetch_california_housing

# Real bundled dataset: 20,640 rows of California housing.
d = fetch_california_housing(as_frame=True)
df = d.frame.copy()

# Shape it into a 'sales'-like table: a categorical 'region' and a dollar 'amount'.
df['region'] = pd.cut(df['Latitude'], bins=[32, 34, 36, 38, 40, 42],
                      labels=['far_south', 'south', 'central', 'north', 'far_north']).astype(object)
df['amount'] = (df['MedHouseVal'] * 100000).round(0)   # median house value in dollars

# This pandas computation mirrors the Spark SQL query EXACTLY:
#   SELECT region, SUM(amount) AS total
#   FROM sales WHERE MedInc > 3
#   GROUP BY region ORDER BY total DESC
result = (df[df['MedInc'] > 3]                 # WHERE MedInc > 3
            .groupby('region')['amount'].sum() # GROUP BY region, SUM(amount)
            .sort_values(ascending=False))     # ORDER BY total DESC

for region, total in result.items():
    print(f'{region:10s} {total/1e6:8.2f}  ($M)')
# far_south   1064.09  ($M)
# central     1055.20  ($M)
# south        898.78  ($M)
# north        250.35  ($M)
# far_north     10.32  ($M)`
  };
})();
