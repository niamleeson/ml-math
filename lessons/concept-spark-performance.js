/* Apache Spark — "Making Spark jobs fast: caching, broadcast joins, Catalyst/Tungsten, AQE, pushdown".
   Self-contained: lesson + CODE + CODEVIZ merged by id "spark-performance". */
(function () {
  window.LESSONS.push({
    id: "spark-performance",
    title: "Spark performance: caching, broadcast joins, Catalyst, AQE, and pushdown",
    tagline: "Reuse work with cache, kill shuffles with broadcast joins, read less with pushdown, and let Catalyst, Tungsten, and AQE do the rest.",
    module: "Apache Spark",
    prereqs: ["dw-big-data"],

    whenToUse:
      `<p><b>Reach for these whenever a Spark job is slow, expensive, or run again and again</b> &mdash; nightly
       pipelines, big joins, feature builds, anything where minutes of cluster time turn into real money.</p>
       <ul>
         <li><b>You reuse the same DataFrame across several actions.</b> An <i>action</i> is a call that actually
         runs the job (<code>count</code>, <code>collect</code>, <code>write</code>, <code>show</code>). Spark is
         <b>lazy</b>: each action recomputes the whole chain from scratch. If you trigger three actions on the same
         result, <b>cache</b> it once and the next two are nearly free.</li>
         <li><b>You join a huge table to a small one.</b> A normal join <b>shuffles</b> &mdash; sends rows across the
         network so matching keys land on the same machine. If one side is small, <b>broadcast</b> it to every
         worker instead and skip the shuffle entirely.</li>
         <li><b>You read big files but need a few columns or rows.</b> With <b>Parquet</b> (a compressed columnar
         file format) Spark can read only the columns and row blocks you actually ask for &mdash; <i>pushdown</i>.</li>
         <li><b>You are productionizing a pipeline.</b> Turn on <b>AQE (Adaptive Query Execution)</b> &mdash; Spark's
         feature that re-optimizes a query <i>while it runs</i> &mdash; and learn to read the Spark UI so you can see
         where the time goes before you guess.</li>
       </ul>
       <p>This is the tuning layer on top of the "don't load what you don't need" habit from
       <code>dw-big-data</code> &mdash; same idea, now on a cluster.</p>`,

    application:
      `<p>Performance work is most of the job once a Spark pipeline is real.</p>
       <ul>
         <li><b>ETL (Extract, Transform, Load).</b> A nightly job that joins events to a dimension table, aggregates,
         and writes Parquet. Broadcast the dimension table, enable AQE, and write partitioned output.</li>
         <li><b>Feature pipelines for ML at scale.</b> One cleaned DataFrame feeds many feature computations and a
         train/validation split &mdash; a textbook case for <code>cache</code> so the cleaning runs once.</li>
         <li><b>Big joins and dedup.</b> The expensive, shuffle-heavy operations. Right-sizing partitions and letting
         AQE coalesce them is where most of the speedup lives.</li>
         <li><b>Repeated interactive analysis.</b> An analyst hitting the same filtered table all afternoon &mdash;
         cache it once, every later query is instant.</li>
       </ul>`,

    pitfalls:
      `<ul>
         <li><b>Caching everything (or things used once).</b> <code>cache</code> pins data in executor memory. Cache
         a DataFrame you read once and you spent memory for nothing; cache too much and Spark <b>spills</b> to disk
         (writes overflow blocks out of memory) and slows down. Fix: cache <i>only</i> a DataFrame reused across
         multiple actions, and <code>unpersist()</code> it when done.</li>
         <li><b>UDFs (User-Defined Functions) that break codegen.</b> A UDF is your own Python/Scala function
         registered to run on rows. Python UDFs run row-by-row outside Spark's engine and <b>kill the optimizer's
         generated code</b>, often 10x slower. Fix: prefer built-in <code>F.</code> functions
         (<code>pyspark.sql.functions</code>) &mdash; <code>F.when</code>, <code>F.regexp_replace</code>,
         <code>F.split</code> &mdash; which the engine compiles and runs natively.</li>
         <li><b>Many small shuffles.</b> Every <code>groupBy</code>, <code>join</code>, <code>distinct</code>, and
         repartition triggers a shuffle &mdash; the slowest thing Spark does. Fix: do fewer, combine them, broadcast
         the small side, and filter <i>before</i> you shuffle, not after.</li>
         <li><b>Not enabling AQE.</b> Leaving <code>spark.sql.adaptive.enabled</code> off forgoes free runtime
         wins: coalescing tiny shuffle partitions, switching a join to broadcast, and splitting skewed partitions.
         Fix: turn it on (it is on by default in Spark 3.2+, but confirm).</li>
         <li><b>Reading whole files instead of pushdown.</b> Reading a wide Parquet then selecting three columns in
         pandas-style afterward still pays to scan everything if you do it wrong. Fix: <code>select</code> the
         columns and <code>filter</code> the rows up front on Parquet so Spark prunes columns and skips row blocks.</li>
         <li><b><code>collect()</code>-ing large results.</b> <code>collect</code> pulls every row to the driver
         &mdash; the single coordinating machine &mdash; and an out-of-memory crash follows. Fix: <code>write</code>
         results to storage, or <code>take(n)</code>/<code>limit(n)</code> for a peek.</li>
         <li><b>Ignoring the Spark UI.</b> Guessing instead of looking. Fix: open the UI, find the slow stage, and
         look for one <b>straggler</b> task (a single task far slower than its peers &mdash; usually skew) or heavy
         <b>spill</b>.</li>
       </ul>`,

    bigIdea:
      `<p>Spark is fast by default because two engines do the heavy lifting under the DataFrame API
       (Application Programming Interface): the <b>Catalyst optimizer</b> and the <b>Tungsten execution engine</b>.
       But you can still write a slow job, and the four biggest levers you control are <b>caching</b>,
       <b>broadcast joins</b>, <b>pushdown</b>, and <b>AQE (Adaptive Query Execution)</b>.</p>
       <p>The unifying idea is simple: <b>do less work, and don't do the same work twice.</b></p>
       <ul>
         <li><b>Don't do it twice &rarr; cache.</b> Spark is lazy. A DataFrame is just a <i>recipe</i> until an
         action runs it; each action re-cooks the recipe from the raw ingredients. <code>df.cache()</code> says
         "after you cook this once, keep the result" so later actions reuse it instead of recomputing.</li>
         <li><b>Move less data &rarr; broadcast.</b> The slowest thing a cluster does is shuffle rows across the
         network. A <b>broadcast join</b> ships the <i>small</i> table to every worker once, so each worker joins
         locally and nothing shuffles.</li>
         <li><b>Read less &rarr; pushdown.</b> With Parquet, Spark pushes your <code>select</code> and
         <code>filter</code> down into the read itself, touching only the columns and row blocks you need.</li>
         <li><b>Re-plan at runtime &rarr; AQE.</b> Catalyst plans before it sees the data; AQE adjusts the plan
         <i>after</i> the first stages reveal the real data sizes.</li>
       </ul>`,

    buildup:
      `<p>Build the picture one engine, one lever at a time.</p>
       <p><b>Catalyst &mdash; the query optimizer.</b> When you write DataFrame code (or SQL), Spark does not run it
       literally. <b>Catalyst</b> takes your query, rewrites it into a logical plan, applies rules (push filters
       earlier, prune unused columns, fold constants, reorder joins), and produces an efficient physical plan. This
       is why the DataFrame API beats hand-written Resilient Distributed Dataset (RDD) code: the optimizer sees your
       intent and improves it. You can see its work with <code>df.explain("formatted")</code>.</p>
       <p><b>Tungsten &mdash; the execution engine.</b> Once Catalyst has a plan, <b>Tungsten</b> runs it fast.
       Two tricks matter. <b>Whole-stage code generation (codegen)</b> compiles a whole chain of operations into a
       single tight loop of generated Java bytecode instead of calling one operator at a time &mdash; far less
       overhead. And <b>off-heap memory</b>: Tungsten stores rows in a compact binary layout outside the Java
       garbage collector's reach, so there is less memory waste and no garbage-collection pauses on that data.
       <b>This is exactly what a Python UDF defeats</b> &mdash; Spark cannot generate code through a black-box
       Python function, so the stage falls back to slow row-at-a-time execution.</p>
       <p><b>Caching &mdash; reuse a materialized result.</b> <code>df.cache()</code> is shorthand for
       <code>df.persist(StorageLevel.MEMORY_AND_DISK)</code>. The first action that runs <code>df</code> computes it
       and stores the result in executor memory (spilling to disk if it does not fit). Every later action reads the
       stored blocks. Use <code>persist(StorageLevel...)</code> to choose where (memory only, memory-and-disk,
       serialized), and <b>always <code>unpersist()</code></b> when you are done so the memory is freed for the
       rest of the pipeline.</p>
       <p><b>Broadcast joins &mdash; the small side to everyone.</b> A shuffle join repartitions <i>both</i> tables
       by the join key so matching keys meet &mdash; expensive when one table is huge. If the other table is small
       (a few hundred MB or less), wrap it in <code>F.broadcast(small_df)</code>. Spark sends a full copy to every
       executor; each executor joins its slice of the big table against the in-memory small table. <b>No shuffle.</b>
       Catalyst even does this automatically when it knows a side is under
       <code>spark.sql.autoBroadcastJoinThreshold</code> (default 10 MB).</p>
       <p><b>AQE &mdash; re-optimize while running.</b> Catalyst plans <i>before</i> the job starts, using estimates.
       <b>AQE (Adaptive Query Execution)</b> watches the actual sizes after each shuffle and re-plans. It does three
       valuable things: <b>coalesce shuffle partitions</b> (merge hundreds of tiny post-shuffle partitions into a
       sensible few), <b>switch to a broadcast join</b> when a side turns out smaller than expected, and
       <b>handle skew</b> by splitting one oversized partition into several so a single straggler task stops holding
       up the stage. Enable it with <code>spark.sql.adaptive.enabled = true</code>.</p>
       <p><b>Partitions and the Spark UI.</b> Spark splits work into <b>partitions</b>; each partition is one
       <b>task</b>, and tasks run in parallel on cores. Too few partitions and you waste cores; too many tiny ones
       and scheduling overhead dominates &mdash; right-size them (a common shuffle default is 200; lower it for small
       data). The <b>Spark UI</b> shows the breakdown: a job splits into <b>stages</b> (cut at each shuffle), a stage
       splits into <b>tasks</b>. Look for the slow stage, then within it a <b>straggler</b> task (data skew) or red
       <b>spill</b> numbers (not enough memory).</p>`,

    symbols: [],

    derivation:
      `<p><b>Why caching a reused DataFrame turns three runs into roughly one.</b></p>
       <ul class="steps">
         <li>Let computing a DataFrame from its source cost $T$ (read + filter + transform + aggregate). Spark is
         lazy, so this cost is paid <i>per action</i>, not when you define the DataFrame.</li>
         <li><b>Without cache:</b> you run $k$ actions on that same DataFrame (say a <code>count</code>, then a
         <code>write</code>, then a <code>show</code>). Each one recomputes the whole chain, so the total is
         $k\\times T$. With $k=3$ that is $3T$ &mdash; you paid for the same work three times.</li>
         <li><b>With cache:</b> the first action pays $T$ to compute <i>and</i> stores the result in memory. Each of
         the remaining $k-1$ actions only reads the stored blocks, a near-zero cost $\\epsilon$. Total is
         $T + (k-1)\\,\\epsilon \\approx T$.</li>
         <li>So the speedup is roughly $\\dfrac{kT}{T + (k-1)\\epsilon} \\approx k$ for an expensive pipeline. Three
         reuses, about 3x faster &mdash; and the more times you reuse it, the bigger the win.</li>
         <li><b>The catch:</b> caching costs memory, and if the cached data does not fit it spills to disk, eroding
         $\\epsilon$. So cache pays off only when $T$ is real <i>and</i> you reuse it (<code>$k\\ge 2$</code>).
         Caching something used once ($k=1$) gains nothing and wastes memory. $\\blacksquare$</li>
       </ul>`,

    example:
      `<p>You build one cleaned DataFrame <code>orders</code> (read Parquet, filter to last 90 days, derive a few
       columns), then you need three things from it: a row count, a per-region total written to disk, and a quick
       <code>show</code> of the top rows.</p>
       <ul class="steps">
         <li><b>Naive.</b> Define <code>orders</code>, then call <code>.count()</code>, <code>.write...</code>, and
         <code>.show()</code>. Spark re-reads the Parquet and re-runs the filter and derivations <b>three times</b>
         &mdash; the source scan is the expensive part, paid thrice.</li>
         <li><b>Cached.</b> Call <code>orders.cache()</code> once. The first action (<code>count</code>) computes the
         chain and stores the result; the <code>write</code> and <code>show</code> read straight from memory. The
         scan happens <b>once</b>.</li>
         <li><b>Plus broadcast.</b> The per-region step joins <code>orders</code> to a tiny 8-row
         <code>region_names</code> lookup. Wrap it: <code>orders.join(F.broadcast(region_names), "region")</code>
         &mdash; the lookup is copied to every worker, so the giant <code>orders</code> table never shuffles.</li>
         <li><b>When done</b>, <code>orders.unpersist()</code> frees the memory for the next stage.</li>
       </ul>
       <p>On a real pipeline the three repeated scans dominate the runtime; caching collapses them to one and the
       broadcast removes a shuffle &mdash; together often a 2&ndash;3x wall-clock cut for a few lines of code.</p>`,

    practice: [
      {
        q: `You define <code>df</code> from a Parquet read plus a filter and two derived columns, then call <code>df.count()</code>, write <code>df</code> to disk, and finally <code>df.show()</code>. The job is slow and the Spark UI shows the Parquet scan running three times. What is happening and what is the one-line fix?`,
        steps: [
          { do: `Recall that Spark DataFrames are lazy: defining <code>df</code> runs nothing.`, why: `The transform chain is only a recipe until an action forces it.` },
          { do: `Count three actions: <code>count()</code>, the write, and <code>show()</code>.`, why: `Each action independently re-executes the whole chain from the source, so the expensive Parquet scan runs once per action.` },
          { do: `Insert <code>df = df.cache()</code> before the first action.`, why: `The first action materializes and stores the result; the next two read from memory instead of re-scanning.` }
        ],
        answer: `<p>Because Spark is <b>lazy</b>, each of the three actions recomputes <code>df</code> from the Parquet source &mdash; hence three scans. Add <b><code>df = df.cache()</code></b> (or <code>persist(...)</code>) before the first action: the <code>count()</code> computes it once and caches it, and the write and <code>show()</code> reuse the cached result. Roughly a 3x cut on the repeated work. Call <code>df.unpersist()</code> when finished to release the memory.</p>`
      },
      {
        q: `You join a 2-billion-row <code>events</code> table to a 5,000-row <code>country_lookup</code> table on <code>country_code</code>. The stage shuffles hundreds of GB and is by far the slowest in the job. How do you fix it, and why does it work?`,
        steps: [
          { do: `Notice one side is tiny (5,000 rows) and the other is enormous.`, why: `A default join shuffles BOTH tables by the key, dragging the 2B-row table across the network &mdash; the expensive part.` },
          { do: `Broadcast the small side: <code>events.join(F.broadcast(country_lookup), "country_code")</code>.`, why: `Spark ships a full copy of the 5,000-row table to every executor; each executor joins its local slice of <code>events</code> against it.` },
          { do: `Confirm with <code>.explain()</code> that the plan now shows <code>BroadcastHashJoin</code>, not <code>SortMergeJoin</code>.`, why: `The broadcast plan has no exchange/shuffle on the big table.` }
        ],
        answer: `<p>Wrap the small table in <b><code>F.broadcast(country_lookup)</code></b>. Spark sends a full copy of the 5,000-row lookup to every executor, so each one joins its local partition of <code>events</code> against the in-memory copy &mdash; <b>no shuffle of the 2-billion-row table</b>. The shuffle was the whole cost, so this can turn a long stage into a quick one. (With AQE on, Spark may even do this automatically once it sees the small side's true size.)</p>`
      },
      {
        q: `A colleague speeds up a string-cleaning step by writing a Python UDF (User-Defined Function) that lowercases and strips punctuation per row. After the change the stage got <i>slower</i>, and <code>explain()</code> no longer shows whole-stage codegen around it. Why, and what should they do instead?`,
        steps: [
          { do: `Recall that Tungsten compiles a chain of built-in operators into one tight generated-code loop (whole-stage codegen).`, why: `That codegen plus off-heap binary rows is what makes DataFrame operations fast.` },
          { do: `Note a Python UDF is a black box the engine cannot see into.`, why: `Spark must serialize each row to Python, run the function row-by-row, and serialize back &mdash; breaking codegen and adding per-row overhead.` },
          { do: `Replace the UDF with built-in <code>F.</code> functions: <code>F.lower(F.regexp_replace(col, "[^a-z0-9 ]", ""))</code>.`, why: `Built-ins stay inside the engine, so codegen and off-heap execution are preserved.` }
        ],
        answer: `<p>A Python <b>UDF</b> is opaque to Catalyst and Tungsten, so the engine cannot fold it into <b>whole-stage codegen</b>. Every row is serialized out to Python, processed one at a time, and serialized back &mdash; which both breaks the generated-code loop and adds heavy per-row overhead, often 10x slower. The fix is to express the same logic with built-in <code>F.</code> functions (here <code>F.lower</code> and <code>F.regexp_replace</code>), which run natively inside the engine and keep codegen intact.</p>`
      }
    ]
  });

  window.CODE["spark-performance"] = {
    lib: "PySpark",
    runnable: false,
    explain: `<p>The core performance levers, end to end, in real PySpark. It builds an "expensive" DataFrame, then
      shows <b>caching</b> turning three actions' worth of recomputation into one; a <b>broadcast join</b> that skips
      the shuffle; enabling <b>AQE (Adaptive Query Execution)</b>; a Parquet read with <code>select</code> +
      <code>filter</code> to demonstrate column/row <b>pushdown</b>; and <code>explain("formatted")</code> so you can
      read the physical plan. <code>runnable</code> is off because the in-browser engine has no Java Virtual Machine
      &mdash; this runs in <b>Google Colab</b> after <code>!pip install pyspark</code> (local mode).</p>`,
    code: `# Colab: !pip install pyspark
import time
from pyspark.sql import SparkSession, functions as F
from pyspark.storagelevel import StorageLevel

spark = (SparkSession.builder
         .master("local[*]")
         .appName("spark-performance")
         # ---- AQE: re-optimize the query at runtime (on by default in 3.2+) ----
         .config("spark.sql.adaptive.enabled", "true")
         .config("spark.sql.adaptive.coalescePartitions.enabled", "true")  # merge tiny shuffle partitions
         .config("spark.sql.adaptive.skewJoin.enabled", "true")            # split skewed partitions
         .getOrCreate())

# ---- build an 'expensive' DataFrame: read-ish + filter + derive + aggregate ----
big = spark.range(0, 4_000_000).select(
    (F.col("id") % 500_000).alias("user"),
    (F.rand(seed=0) * 8).cast("int").alias("region"),
    (F.rand(seed=1) * 200).alias("amount"),
)

expensive = (big
             .filter(F.col("amount") > 5.0)
             .withColumn("logamt", F.log1p("amount"))          # built-in F. function (codegen-friendly)
             .groupBy("region")                                # a shuffle happens here
             .agg(F.count("*").alias("n"), F.sum("logamt").alias("tot")))

# ============================================================
# 1. CACHE / PERSIST: avoid recomputing across multiple actions
# ============================================================
# cache() == persist(StorageLevel.MEMORY_AND_DISK). Pick the level explicitly if you like:
expensive = expensive.persist(StorageLevel.MEMORY_AND_DISK)

t0 = time.perf_counter(); expensive.count();        print("action 1 (computes + caches):", round(time.perf_counter()-t0, 3), "s")
t0 = time.perf_counter(); expensive.agg(F.sum("n")).collect(); print("action 2 (reads cache, fast):", round(time.perf_counter()-t0, 3), "s")
t0 = time.perf_counter(); expensive.show(3);        print("action 3 (reads cache, fast):", round(time.perf_counter()-t0, 3), "s")

expensive.unpersist()   # free the memory when done — don't leave caches pinned

# ============================================================
# 2. BROADCAST JOIN: ship the SMALL side to every executor, no shuffle
# ============================================================
region_names = spark.createDataFrame(
    [(i, f"region_{i}") for i in range(8)], ["region", "region_name"])  # tiny lookup

joined = big.join(F.broadcast(region_names), "region")   # F.broadcast => BroadcastHashJoin (no shuffle of 'big')
print("rows after broadcast join:", joined.count())

# ============================================================
# 3. PARQUET + PUSHDOWN: read only the columns and rows you need
# ============================================================
big.write.mode("overwrite").parquet("/tmp/events.parquet")

pushed = (spark.read.parquet("/tmp/events.parquet")
          .select("user", "amount")        # COLUMN pushdown: other columns are never read
          .filter(F.col("amount") > 150))  # PREDICATE pushdown: row blocks that can't match are skipped
print("pushed-down rows:", pushed.count())

# ============================================================
# 4. EXPLAIN: read the physical plan (look for BroadcastHashJoin, PushedFilters, WholeStageCodegen)
# ============================================================
pushed.explain("formatted")
joined.explain("formatted")

spark.stop()`
  };

  window.CODEVIZ["spark-performance"] = {
    question: "How do you READ a Spark performance chart — the win cache() buys, the case where it buys nothing, the broadcast-vs-shuffle gap, and a skewed stage in the UI?",
    charts: [
      {
        type: "bars",
        title: "Cache pays off: 3 reused reads, WITHOUT cache vs WITH cache (ms)",
        labels: ["no-cache 1", "no-cache 2", "no-cache 3", "cached 1 (fills cache)", "cached 2", "cached 3"],
        values: [110.0, 100.0, 98.0, 97.0, 0.07, 0.02],
        valueLabels: ["110", "100", "98", "97 compute+cache", "0.07", "0.02"],
        colors: ["#ff7b72", "#ff7b72", "#ff7b72", "#ffb454", "#7ee787", "#7ee787"],
        interpret: "<b>Each bar is one read of the same result; height is milliseconds, shorter is better.</b> Red bars (no cache) all cost ~100 ms because Spark is lazy — every action re-runs the whole pipeline from the source. The orange bar is the FIRST cached read: it still pays ~97 ms, but now it also stores the result. The two green bars are reads 2 and 3 from cache: ~0.07 and 0.02 ms, effectively free. <b>Read it as:</b> with 3 reuses, cache turns ~3x the work into ~1x — and the more reuses, the bigger the win."
      },
      {
        type: "bars",
        title: "Cache HURTS on single use: read once, never reused (illustrative)",
        labels: ["no cache (1 read)", "cached (1 read)"],
        values: [100.0, 112.0],
        valueLabels: ["100", "112 (compute + store overhead)"],
        colors: ["#7ee787", "#ff7b72"],
        interpret: "<b>Illustrative.</b> Same axes (ms, shorter is better), but now the DataFrame is read only ONCE. Without cache it costs ~100 ms. WITH cache it costs MORE (~112 ms): you pay the pipeline plus the overhead of writing blocks into executor memory, and nothing ever reads them back. <b>Recognise it</b> by a cached bar that is taller, not shorter. <b>What it means:</b> caching a DataFrame used once (k=1) wastes memory and time — only cache when it is reused across multiple actions, and unpersist() when done."
      },
      {
        type: "bars",
        title: "Broadcast vs shuffle join: huge table joined to a tiny lookup (illustrative)",
        labels: ["shuffle join (SortMergeJoin)", "broadcast join (BroadcastHashJoin)"],
        values: [240.0, 35.0],
        valueLabels: ["240", "35"],
        colors: ["#ff7b72", "#7ee787"],
        interpret: "<b>Illustrative; height is seconds of stage time, shorter is better.</b> A default join shuffles BOTH tables across the network by the key — the red bar — even though one side is tiny. F.broadcast(small) ships a full copy of the small table to every executor so each joins locally with no shuffle: the green bar. <b>Recognise the win</b> in explain() when the plan flips from SortMergeJoin (with an Exchange/shuffle) to BroadcastHashJoin (none). <b>What it means:</b> the shuffle was the whole cost, so removing it can collapse a long stage."
      },
      {
        type: "bars",
        title: "Skew in the Spark UI: per-task time within one stage (illustrative)",
        labels: ["task 1", "task 2", "task 3", "task 4", "task 5 (straggler)"],
        values: [4.0, 3.8, 4.2, 3.9, 47.0],
        valueLabels: ["4.0", "3.8", "4.2", "3.9", "47.0 straggler"],
        colors: ["#7ee787", "#7ee787", "#7ee787", "#7ee787", "#ff7b72"],
        interpret: "<b>Illustrative; each bar is one task in the same stage, height is seconds.</b> Four tasks finish in ~4 s, but task 5 takes 47 s — a <b>straggler</b>. The stage cannot finish until its slowest task does, so this one task holds up everything. <b>Recognise it</b> in the Spark UI as a single bar towering over its peers (or a max task time far above the median). <b>What it means:</b> data skew — one partition holds far more rows than the rest. Fix: enable AQE skew handling (spark.sql.adaptive.skewJoin.enabled) to split the oversized partition, or salt the join key."
      }
    ],
    caption: "Four ways a Spark performance chart shows up. Bars #1: REAL timings (pandas stand-in for a lazy 4M-row pipeline) showing cache turning 3 reused reads from ~3x work into ~1x. Bars #2: the flip side — caching a once-used DataFrame costs MORE, illustrative. Bars #3: broadcast vs shuffle join, the shuffle being the whole cost, illustrative. Bars #4: a straggler task in the Spark UI signalling data skew, illustrative. The healthy/green cases are the levers from the lesson; the red cases are how the same charts reveal a problem.",
    code: `import numpy as np, pandas as pd, time

rng = np.random.RandomState(0)
N = 4_000_000
df = pd.DataFrame({
    "user":   rng.randint(0, 500_000, size=N),
    "amount": rng.exponential(40.0, size=N).round(2),
    "region": rng.randint(0, 8, size=N),
})

# An 'expensive' lineage Spark would RECOMPUTE on every action unless cached.
def expensive_pipeline(d):
    out = d[d["amount"] > 5.0].copy()
    out["logamt"] = np.log1p(out["amount"])
    return out.groupby("region", as_index=False).agg(
        n=("amount", "size"), tot=("logamt", "sum"))

def timeit(fn, *a):
    t0 = time.perf_counter(); fn(*a); return (time.perf_counter() - t0) * 1000.0  # ms

# WITHOUT cache: three actions each re-run the full pipeline from source.
no_cache = [round(timeit(expensive_pipeline, df), 2) for _ in range(3)]

# WITH cache: pay the pipeline ONCE to materialize, then read the small result near-free.
cached = expensive_pipeline(df)                      # read 1 fills the cache
first  = round(timeit(expensive_pipeline, df), 2)    # cost to compute + cache
read   = lambda: cached["tot"].sum()                 # trivial action on the cached result
second = round(timeit(read), 3)
third  = round(timeit(read), 3)
with_cache = [first, second, third]

print("no_cache  (ms):", no_cache)    # ~ [110, 100, 98]
print("with_cache(ms):", with_cache)  # ~ [97, 0.07, 0.02]
print("speedup on a reused read:", round(no_cache[1] / max(with_cache[1], 1e-9), 0), "x")`
  };
})();
