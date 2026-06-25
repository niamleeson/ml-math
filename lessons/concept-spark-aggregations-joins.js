/* Apache Spark — "Aggregating and joining at scale".
   Self-contained: lesson + CODE + CODEVIZ merged by id "spark-aggregations-joins".
   CODE runs in Google Colab (local mode) after `!pip install pyspark`. */
(function () {
  window.LESSONS.push({
    id: "spark-aggregations-joins",
    title: "Aggregating and joining at scale",
    tagline: "Group-and-aggregate, window functions, and the broadcast-vs-shuffle join choice that makes big joins fast or slow.",
    module: "Apache Spark",
    prereqs: ["dw-combining", "dw-big-data"],

    whenToUse:
      `<p><b>Reach for Spark aggregations and joins whenever you are summarizing or combining tables that are
       too big for one machine.</b> Almost every reporting or feature-building job is some mix of "group these
       billions of rows and total them up" and "stitch this big table to that other table."</p>
       <ul>
         <li><b>Aggregating.</b> A daily revenue-by-region report, a per-user click count, a 7-day rolling
         average &mdash; all of these are <code>groupBy().agg(...)</code> or window functions over a huge table.</li>
         <li><b>Joining.</b> Attaching a small lookup table (product names, user attributes, a country map) to a
         giant fact table (every transaction, every event). This is the daily bread of feature engineering.</li>
         <li><b>Why Spark and not pandas.</b> When the table fits in memory, pandas/Polars/DuckDB are simpler and
         faster &mdash; use them (see <code>dw-big-data</code>). Spark earns its keep only once the data genuinely
         exceeds one machine and must be spread across a cluster. The cost of that is the <b>shuffle</b>: moving
         data across the network between machines. Aggregations and joins are exactly where shuffles happen, so
         this is where you win or lose the most performance.</li>
       </ul>`,

    application:
      `<p>This is the core of nearly all batch data work.</p>
       <ul>
         <li><b>Analytics and reporting (ETL).</b> Extract, Transform, Load (ETL) pipelines that roll raw events
         up into daily/weekly summary tables: <code>groupBy("day","region").agg(F.sum("revenue"))</code>.</li>
         <li><b>Feature engineering for machine learning.</b> Building a feature table by joining a big behavior
         log to user and item dimension tables, plus windowed features like "purchases in the last 30 days."</li>
         <li><b>Enrichment joins.</b> Decorating a massive fact table with small reference tables &mdash; the
         textbook case for a <b>broadcast join</b>.</li>
         <li><b>Ranking and running totals.</b> "Top 3 products per category," "cumulative spend per user,"
         "change since the previous row" &mdash; all <b>window functions</b>.</li>
       </ul>`,

    pitfalls:
      `<ul>
         <li><b>A shuffle (sort-merge) join when one side is small.</b> If Spark shuffles <i>both</i> tables across
         the network to join a 4 GB fact table to a 5 KB lookup, you pay a huge, pointless network bill. Fix: force
         a <b>broadcast join</b> with <code>F.broadcast(small_df)</code>, or raise
         <code>spark.sql.autoBroadcastJoinThreshold</code> so Spark auto-broadcasts it.</li>
         <li><b>Join-key skew.</b> If one key value is wildly more common than the rest (a <code>null</code>
         user, a "default" category), all its rows land in one partition and one task does almost all the work
         while the rest sit idle &mdash; the whole stage waits on that straggler. Fix: <b>salt</b> the hot key
         (append a small random number to split it across partitions, then aggregate back), or turn on
         <b>AQE (Adaptive Query Execution)</b> with skew-join handling
         (<code>spark.sql.adaptive.enabled</code> + <code>skewJoin.enabled</code>).</li>
         <li><b>Exploding many-to-many joins.</b> Joining two tables that both have duplicate keys multiplies
         rows: 1,000 matching rows on each side becomes 1,000,000 output rows. Fix: de-duplicate or pre-aggregate
         the keys first, and check the output row count.</li>
         <li><b>Broadcasting a table that is actually too big.</b> Broadcast copies the small table to every
         executor's memory <i>and</i> through the driver. Force-broadcasting a 2 GB table OOMs (runs Out Of
         Memory) the driver or executors. Fix: only broadcast tables comfortably under the threshold (tens to a
         few hundred MB); let big-vs-big joins shuffle.</li>
         <li><b><code>groupByKey</code> on RDDs.</b> On the old RDD (Resilient Distributed Dataset) API,
         <code>groupByKey</code> ships every value across the network before reducing &mdash; massive shuffle.
         Fix: use the DataFrame <code>groupBy().agg(...)</code> (or <code>reduceByKey</code>), which combines
         partially on each machine first, so far less data crosses the wire.</li>
       </ul>`,

    bigIdea:
      `<p>Two operations dominate big-data work: <b>aggregating</b> (collapse many rows into a summary) and
       <b>joining</b> (line up rows from two tables by a shared key). Both force Spark to bring related rows
       together &mdash; and on a cluster, "bringing rows together" means moving them across the network. That move
       is the <b>shuffle</b>, and it is the single most expensive thing Spark does. Understanding aggregations and
       joins is mostly understanding how to avoid or shrink shuffles.</p>
       <p><b>Aggregations.</b> <code>df.groupBy("region").agg(F.sum("revenue"), F.avg("revenue"), F.count("*"))</code>
       splits rows by key, then reduces each group. Spark computes partial sums on each machine first (a
       <i>map-side combine</i>) and only shuffles those small partials, so a group-and-sum is cheap relative to its
       output size.</p>
       <p><b>Window functions</b> are aggregation's cousin: instead of collapsing each group to one row, they
       compute a value <i>per row</i> relative to its group &mdash; a rank, a running total, the previous row's
       value. You define a <code>Window.partitionBy("user").orderBy("day")</code> and apply
       <code>F.rank()</code>, <code>F.sum(...).over(w)</code>, or <code>F.lag("amount")</code>.</p>
       <p><b>Joins.</b> The logical join (inner, left, etc.) is one question; the <i>physical strategy</i> is the
       performance question. Spark picks between a <b>sort-merge (shuffle) join</b> &mdash; shuffle and sort both
       sides by key, expensive &mdash; and a <b>broadcast join</b> &mdash; copy a small table to every machine so
       no shuffle is needed, dramatically faster. Knowing which one is running, and forcing the right one, is the
       core skill.</p>`,

    buildup:
      `<p><b>Step 1 &mdash; the shuffle, in one picture.</b> Your data is split into partitions scattered across
       machines. To sum revenue by region, every "West" row must end up on the same machine. Spark hashes the key
       and sends each row to the machine that owns that hash bucket. That cross-network move is the shuffle: it
       writes data to disk, sends it over the wire, and reads it back. It is correct but slow, so the whole game
       is doing less of it.</p>
       <p><b>Step 2 &mdash; aggregations shrink the shuffle.</b> A <code>groupBy().agg()</code> does not ship every
       raw row. Each machine first computes a <i>partial</i> aggregate over the rows it already holds (its own
       partial sum and count per region), and only those tiny partials get shuffled and merged. So summing a
       billion rows into 50 regions shuffles roughly 50 partials per machine, not a billion rows. This is why you
       prefer <code>agg</code> over the old RDD <code>groupByKey</code>, which skips this combine and shuffles
       everything.</p>
       <p><b>Step 3 &mdash; window functions.</b> Sometimes you want a per-row answer that depends on the group:
       "rank each product within its category," "running total of spend per user," "how much did this differ from
       the previous day." You declare a window &mdash; <code>Window.partitionBy("category").orderBy("sales")</code>
       &mdash; and Spark shuffles rows into their partitions, sorts within each, then sweeps through computing the
       ranks or running totals. The cost is the partition-and-sort shuffle, just like an aggregation.</p>
       <p><b>Step 4 &mdash; the two join strategies.</b> To join table A to table B on a key, related rows must
       meet. Two ways:</p>
       <ul>
         <li><b>Sort-merge (shuffle) join.</b> Shuffle <i>both</i> A and B by the join key so matching keys land
         together, sort each side, then merge. Both tables cross the network. This is the default for big-vs-big
         joins and it is the expensive case.</li>
         <li><b>Broadcast (hash) join.</b> If one side is small, skip all that: copy the <i>whole</i> small table
         to every machine and build a hash table from it. Then each machine joins its slice of the big table
         locally &mdash; the big table never moves. No shuffle of the big side at all. For a giant-to-tiny join
         this is the difference between minutes and seconds.</li>
       </ul>
       <p><b>Step 5 &mdash; choosing and forcing.</b> Spark auto-broadcasts a side if it estimates the side is
       under <code>spark.sql.autoBroadcastJoinThreshold</code> (10 MB by default). Estimates can be wrong, so you
       can force it: <code>big.join(F.broadcast(small), "key")</code>. Confirm with <code>.explain()</code>: you
       want to see <code>BroadcastHashJoin</code>, not <code>SortMergeJoin</code>. Two traps: don't broadcast a
       table that is actually large (it OOMs the driver/executors), and watch for <b>skew</b> &mdash; one hot key
       overloading one task &mdash; which you fix by salting the key or enabling AQE skew handling.</p>`,

    symbols: [],

    derivation:
      `<p><b>Why a broadcast join can be orders of magnitude cheaper than a shuffle join.</b></p>
       <ul class="steps">
         <li>Let the big fact table have $N$ rows of $b$ bytes each, and the small dimension table have $K$ rows.
         Take a realistic case: $N = 5\\times10^7$ rows at $b = 80$ bytes, so the fact table is about $4$ GB; the
         dimension is $K = 200$ rows, about $24$ KB.</li>
         <li><b>Sort-merge (shuffle) join.</b> Both sides are repartitioned across the network by key. The bytes
         that cross the wire are dominated by the fact table: roughly all $4$ GB get written to shuffle files,
         sent, sorted, and read back. Network and sort cost scale with that $4$ GB.</li>
         <li><b>Broadcast join.</b> Only the tiny dimension moves: its $24$ KB is copied to each of the
         $E$ executors (say $E = 8$), so about $24\\text{ KB}\\times 8 \\approx 0.19$ MB crosses the network
         &mdash; total. The $4$ GB fact table never moves; each machine joins its local slice against the
         in-memory hash table.</li>
         <li><b>The ratio.</b> Data shuffled drops from $\\approx 4000$ MB to $\\approx 0.19$ MB &mdash; about
         four orders of magnitude. There is no global sort either. In the runtime model below, a job that takes
         about $50$ s as a shuffle join finishes in about $3$ s as a broadcast join &mdash; a $\\approx 17\\times$
         speedup &mdash; purely from choosing the right physical strategy. $\\blacksquare$</li>
         <li><b>The catch.</b> This only works while the small side actually fits in each executor's memory. If
         the "small" table is really $2$ GB, broadcasting it copies $2$ GB to every machine and through the
         driver, and the job OOMs. Broadcast wins <i>because</i> the side is genuinely small.</li>
       </ul>`,

    example:
      `<p>A retail pipeline: <code>sales</code> is a 50-million-row fact table (one row per line item, with a
       <code>product_id</code>); <code>products</code> is a 200-row lookup of <code>product_id &rarr; name,
       category</code>.</p>
       <ul class="steps">
         <li><b>Aggregate.</b> <code>sales.groupBy("region").agg(F.sum("revenue").alias("rev"),
         F.countDistinct("user_id").alias("buyers"))</code> collapses 50M rows to one row per region. Spark
         combines partial sums per machine, then shuffles only those small partials.</li>
         <li><b>Window.</b> To rank products within each category by revenue:
         <code>w = Window.partitionBy("category").orderBy(F.col("rev").desc())</code>, then
         <code>F.rank().over(w)</code> gives each product its rank inside its category &mdash; one value per row,
         no collapsing.</li>
         <li><b>Join &mdash; the wrong way.</b> <code>sales.join(products, "product_id")</code> may trigger a
         <b>SortMergeJoin</b>: both the 4 GB <code>sales</code> and the tiny <code>products</code> get shuffled
         and sorted by <code>product_id</code>. The 4 GB move dominates &mdash; about 50 s.</li>
         <li><b>Join &mdash; the right way.</b> <code>sales.join(F.broadcast(products), "product_id")</code> sends
         the 24 KB <code>products</code> to every machine; <code>sales</code> never moves. <code>.explain()</code>
         now shows <b>BroadcastHashJoin</b>, and the job finishes in about 3 s &mdash; roughly 17&times; faster
         for the same answer.</li>
       </ul>`,

    practice: [
      {
        q: `You join a 6 GB <code>events</code> table to a 12 KB <code>country_lookup</code> table on <code>country_code</code>, and the job is slow. <code>.explain()</code> shows a <code>SortMergeJoin</code>. What is happening, and what is the one-line fix?`,
        steps: [
          { do: `Read the physical plan: <code>SortMergeJoin</code> means Spark is shuffling and sorting <i>both</i> sides by <code>country_code</code>.`, why: `Sort-merge moves both tables across the network, so the 6 GB <code>events</code> table is being shuffled in full &mdash; the expensive part.` },
          { do: `Notice <code>country_lookup</code> is only 12 KB &mdash; trivially small.`, why: `A 12 KB table fits easily in every executor's memory, so there is no reason to shuffle the 6 GB side at all.` },
          { do: `Wrap the small side in a broadcast hint: <code>events.join(F.broadcast(country_lookup), "country_code")</code>.`, why: `Broadcasting copies the tiny lookup to each machine and joins the big table locally, so <code>events</code> never moves.` },
          { do: `Re-run <code>.explain()</code> and confirm it now reads <code>BroadcastHashJoin</code>.`, why: `That verifies Spark picked the no-shuffle strategy; the job should drop from a shuffle of 6 GB to a broadcast of 12 KB.` }
        ],
        answer: `<p>Spark chose a <b>sort-merge join</b>, which shuffles and sorts <i>both</i> tables by key &mdash; so the entire 6 GB <code>events</code> table is crossing the network for no reason, since the lookup is only 12 KB. Force a <b>broadcast join</b>: <code>events.join(F.broadcast(country_lookup), "country_code")</code>. Now only the 12 KB lookup is copied to each machine and the 6 GB table stays put. Confirm with <code>.explain()</code> that the plan reads <b>BroadcastHashJoin</b> instead of <b>SortMergeJoin</b>. (You could also raise <code>spark.sql.autoBroadcastJoinThreshold</code> so Spark broadcasts it automatically.)</p>`
      },
      {
        q: `A broadcast join you set up runs fine in testing but OOMs (runs out of memory) in production. The "small" dimension table grew from 8 MB to 1.5 GB over a year. Why did the same code start failing, and what should you do?`,
        steps: [
          { do: `Recall what broadcast does: it copies the <i>entire</i> small table to every executor's memory and routes it through the driver.`, why: `That is only safe while the table is genuinely small; the whole thing must fit in memory many times over.` },
          { do: `Note the table is now 1.5 GB, not 8 MB.`, why: `Copying 1.5 GB to every executor (and through the driver) blows past available memory &mdash; hence the OOM.` },
          { do: `Remove the <code>F.broadcast(...)</code> hint so Spark falls back to a sort-merge join, or only broadcast genuinely small tables.`, why: `A 1.5 GB-vs-big join should shuffle; broadcast is the wrong strategy once the "small" side is large.` }
        ],
        answer: `<p>Broadcast copies the whole small table into <b>every</b> executor's memory and through the driver. That is a huge win when the table is 8 MB, but the same <code>F.broadcast(...)</code> hint on a table that has grown to 1.5 GB tries to replicate 1.5 GB everywhere and runs <b>Out Of Memory</b>. The fix: drop the broadcast hint for that join and let Spark use a sort-merge (shuffle) join, which is the correct strategy for a large-vs-large join. Only broadcast tables comfortably under the threshold (tens to a few hundred MB), and re-check assumptions as tables grow.</p>`
      },
      {
        q: `A join on <code>user_id</code> finishes 199 of 200 tasks in seconds, then one task runs for 20 minutes. Most rows have a <code>null</code> <code>user_id</code>. Name the problem and two fixes.`,
        steps: [
          { do: `Identify the symptom: one task running far longer than the rest is a classic <b>straggler</b> caused by uneven partition sizes.`, why: `Spark hashes the join key to assign partitions, so all rows with the same key land in one task.` },
          { do: `Notice the <code>null</code> <code>user_id</code> dominates.`, why: `Every <code>null</code> row hashes to the same partition, so one task gets almost all the data &mdash; that is join-key <b>skew</b>.` },
          { do: `Fix A &mdash; <b>salt</b> the hot key: append a small random integer to the key on both sides (replicating the small side across the salts), join on the salted key, then drop the salt.`, why: `Splitting the hot key across many partitions spreads its rows over many tasks instead of one.` },
          { do: `Fix B &mdash; enable <b>AQE</b> skew handling (<code>spark.sql.adaptive.enabled=true</code> and <code>spark.sql.adaptive.skewJoin.enabled=true</code>).`, why: `Adaptive Query Execution detects oversized partitions at runtime and automatically splits them.` }
        ],
        answer: `<p>This is <b>join-key skew</b>: one value (here <code>null</code> <code>user_id</code>) is far more common than the rest, so it all hashes to a single partition and one task does nearly all the work while the other 199 sit idle &mdash; the stage waits on that straggler. Two fixes: (1) <b>salt</b> the hot key &mdash; append a small random number to <code>user_id</code> so its rows spread across many partitions, join on the salted key, then remove the salt; or (2) turn on <b>AQE (Adaptive Query Execution)</b> skew-join handling, which detects the oversized partition at runtime and splits it automatically. Filtering or special-casing the <code>null</code> rows separately also works.</p>`
      }
    ]
  });

  window.CODE["spark-aggregations-joins"] = {
    lib: "PySpark",
    runnable: false,
    explain: `<p>Runs in Google Colab (local mode) after the setup cell does <code>!pip install pyspark</code>. It
      builds a small <b>fact</b> table (<code>sales</code>) and a tiny <b>dimension</b> table (<code>products</code>),
      then shows the three moves: (1) a <code>groupBy().agg(...)</code> with several aggregates at once; (2) a
      <b>window function</b> &mdash; rank within category plus a running total via
      <code>Window.partitionBy().orderBy()</code>; and (3) a <b>broadcast join</b> with
      <code>F.broadcast(products)</code> whose <code>.explain()</code> shows <b>BroadcastHashJoin</b> instead of the
      <b>SortMergeJoin</b> you would get without the hint. <code>runnable</code> is off because the in-browser engine
      has no Java Virtual Machine (JVM) / Spark &mdash; paste it into Colab to run.</p>`,
    code: `# Colab: !pip install pyspark   (the notebook's setup cell installs it)
from pyspark.sql import SparkSession, Window
from pyspark.sql import functions as F

spark = (SparkSession.builder
         .master("local[*]").appName("agg-join-demo")
         .getOrCreate())

# --- tiny fact table (sales line items) ---
sales = spark.createDataFrame(
    [  # (region, category, product_id, user_id, revenue)
        ("West",  "books", 10, "u1", 12.0),
        ("West",  "books", 11, "u2", 30.0),
        ("West",  "toys",  20, "u1", 18.0),
        ("East",  "books", 10, "u3", 12.0),
        ("East",  "toys",  21, "u4", 25.0),
        ("East",  "toys",  20, "u2",  9.0),
        ("West",  "books", 10, "u5", 12.0),
    ],
    ["region", "category", "product_id", "user_id", "revenue"],
)

# --- tiny DIMENSION table (small lookup) -> ideal broadcast target ---
products = spark.createDataFrame(
    [(10, "Atlas"), (11, "Novel"), (20, "Blocks"), (21, "Puzzle")],
    ["product_id", "name"],
)

# ============================================================
# 1. groupBy().agg(): several aggregates in one pass
# ============================================================
by_region = sales.groupBy("region").agg(
    F.sum("revenue").alias("total_rev"),
    F.avg("revenue").alias("avg_rev"),
    F.count("*").alias("n_lines"),
    F.countDistinct("user_id").alias("buyers"),
)
by_region.show()
# Spark combines partial sums/counts on each machine FIRST,
# then shuffles only the small partials (cheap vs shipping raw rows).

# ============================================================
# 2. WINDOW functions: rank + running total within a group
#    (one value PER ROW, relative to its partition)
# ============================================================
prod_rev = sales.groupBy("category", "product_id").agg(
    F.sum("revenue").alias("rev"))

w_rank = Window.partitionBy("category").orderBy(F.col("rev").desc())
w_run  = (Window.partitionBy("category")
          .orderBy(F.col("rev").desc())
          .rowsBetween(Window.unboundedPreceding, Window.currentRow))

ranked = (prod_rev
          .withColumn("rank_in_cat", F.rank().over(w_rank))
          .withColumn("running_rev", F.sum("rev").over(w_run))
          .withColumn("prev_rev",    F.lag("rev").over(w_rank)))
ranked.orderBy("category", "rank_in_cat").show()

# ============================================================
# 3. JOIN: force a BROADCAST join (small dim -> every executor)
#    and inspect the physical plan with .explain()
# ============================================================
joined = sales.join(F.broadcast(products), on="product_id", how="left")
joined.show()

print("=== WITH broadcast hint -> BroadcastHashJoin (no shuffle of sales) ===")
joined.explain()           # look for 'BroadcastHashJoin' in the plan

print("=== WITHOUT the hint -> SortMergeJoin (both sides shuffled) ===")
# disable auto-broadcast so the contrast is visible even on tiny data
spark.conf.set("spark.sql.autoBroadcastJoinThreshold", -1)
sales.join(products, on="product_id", how="left").explain()
# Real rule of thumb: broadcast only tables under
# spark.sql.autoBroadcastJoinThreshold (10MB default) to avoid driver OOM.

spark.stop()`
  };

  window.CODEVIZ["spark-aggregations-joins"] = {
    question: "Joining a 4 GB fact table to a 200-row lookup: how much do runtime and data-shuffled drop when Spark uses a BROADCAST join instead of a SHUFFLE (sort-merge) join?",
    charts: [
      {
        type: "bars",
        title: "Runtime: shuffle (sort-merge) join vs broadcast join (seconds)",
        xlabel: "join strategy",
        ylabel: "runtime (s)",
        labels: ["shuffle (sort-merge) join", "broadcast join"],
        values: [50.0, 3.0],
        valueLabels: ["50.0 s", "3.0 s"],
        colors: ["#ff7b72", "#7ee787"]
      },
      {
        type: "bars",
        title: "Data shuffled across the network (MB, log-ish scale in the numbers)",
        xlabel: "join strategy",
        ylabel: "data shuffled (MB)",
        labels: ["shuffle (sort-merge) join", "broadcast join"],
        values: [4000.0, 0.19],
        valueLabels: ["4000 MB", "0.19 MB"],
        colors: ["#ff7b72", "#7ee787"]
      }
    ],
    caption: "Joining a 4 GB fact table (50,000,000 rows x 80 bytes) to a 200-row, 24 KB lookup. The sort-merge join shuffles BOTH sides by key, so ~4000 MB (essentially the whole fact table) crosses the network and is sorted — modeled at ~50 s. The broadcast join copies only the 24 KB lookup to each of 8 executors (~0.19 MB total) and joins the fact table locally with no shuffle of the big side — modeled at ~3 s. That is ~21,000x less data moved and a ~17x speedup for the exact same result. The catch: broadcast only works while the small side genuinely fits in each executor's memory; broadcasting a table that is actually large OOMs the driver/executors.",
    code: `import numpy as np

# Reproducible model of the two physical join strategies.
# Big FACT table joined to a small DIMENSION (lookup) table.
N = 50_000_000          # fact-table rows
b_fact = 80             # bytes per fact row
K = 200                 # dimension rows (one per join key)
b_dim = 120             # bytes per dimension row
E = 8                   # executors in the cluster

fact_bytes = N * b_fact          # ~4.0 GB fact table
dim_bytes  = K * b_dim           # ~24 KB dimension

# --- SHUFFLE (sort-merge) join: BOTH sides repartitioned by key over the network ---
shuffle_bytes = fact_bytes + dim_bytes        # dominated by the 4 GB fact table

# --- BROADCAST join: only the tiny dim is copied to each executor; fact never moves ---
broadcast_bytes = dim_bytes * E               # ~0.19 MB total

# Simple runtime model: fixed scan cost + per-GB network/sort cost.
scan_s          = N / 25_000_000              # 25M rows/s scan  -> 2.0 s
net_s_per_gb    = 9.0                          # ~9 s to move a GB over the shuffle
sort_s_per_gb   = 3.0                          # extra sort cost on the shuffled bytes
shuffle_s   = scan_s + (shuffle_bytes/1e9)*(net_s_per_gb + sort_s_per_gb)
broadcast_s = scan_s + (broadcast_bytes/1e9)*net_s_per_gb*0.4 + 1.0   # tiny bcast, no sort

print(f"fact table : {fact_bytes/1e6:8.1f} MB   dim table: {dim_bytes/1e3:6.1f} KB")
print(f"SHUFFLE  : shuffled {shuffle_bytes/1e6:8.1f} MB   runtime {shuffle_s:5.1f} s")
print(f"BROADCAST: shuffled {broadcast_bytes/1e6:8.4f} MB   runtime {broadcast_s:5.1f} s")
print(f"data moved ratio : {shuffle_bytes/broadcast_bytes:,.0f}x less")
print(f"speedup          : {shuffle_s/broadcast_s:.1f}x faster")
# fact table :   4000.0 MB   dim table:   24.0 KB
# SHUFFLE  : shuffled   4000.0 MB   runtime  50.0 s
# BROADCAST: shuffled   0.1920 MB   runtime   3.0 s
# data moved ratio : 20,833x less
# speedup          : 16.7x faster`
  };
})();
