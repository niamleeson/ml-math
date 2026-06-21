/* Apache Spark — "Partitioning and the shuffle: Spark's biggest performance lever".
   Self-contained: lesson + CODE + CODEVIZ merged by id "spark-shuffles-partitioning". */
(function () {
  window.LESSONS.push({
    id: "spark-shuffles-partitioning",
    title: "Partitioning and the shuffle: Spark's biggest performance lever",
    tagline: "Partitions are how Spark splits work; the shuffle is when it moves data across the network by key — and it's the first place to look when a job is slow.",
    module: "Apache Spark (big-data processing)",
    prereqs: ["dw-big-data"],

    whenToUse:
      `<p><b>Look here first, every single time a Spark job is slow.</b> Before you add executors or
       ask for a bigger cluster, ask: <i>how is this work partitioned, and where does it shuffle?</i>
       Those two questions explain the large majority of slow jobs.</p>
       <ul>
         <li><b>A stage runs forever while most tasks finished.</b> One straggler task is the classic
         sign of <b>data skew</b> &mdash; one key got most of the rows. Look here.</li>
         <li><b>A <code>groupBy</code>, <code>join</code>, or <code>distinct</code> is the slow part.</b>
         These trigger a <b>shuffle</b> (data moved across the network by key). Knowing that lets you
         cut it, tune it, or avoid it.</li>
         <li><b>You're writing or reading a partitioned table.</b> Choosing the right
         <code>partitionBy</code> column lets later reads skip most of the data (partition <b>pruning</b>).</li>
         <li><b>Your output is thousands of tiny files</b>, or your job barely uses the cluster. Both are
         partition-count problems &mdash; <code>repartition</code> / <code>coalesce</code> fix them.</li>
       </ul>
       <p>This is the Spark-specific sequel to the single-machine lesson <code>dw-big-data</code>: once
       the data genuinely will not fit on one box and you move to a cluster, <b>partitioning and the
       shuffle</b> become the levers that matter.</p>`,

    application:
      `<p>Partitioning and shuffles dominate the cost of almost every real Spark workload.</p>
       <ul>
         <li><b>Big joins in ETL (Extract, Transform, Load).</b> Joining a billion-row fact table to a
         dimension table is a shuffle by the join key &mdash; usually the most expensive step in the
         pipeline, and the one most worth optimizing (broadcast the small side, watch for skew).</li>
         <li><b>Aggregations and de-duplication.</b> <code>groupBy(...).agg(...)</code> and
         <code>distinct()</code> over huge datasets redistribute every row by key. The shuffle is the job.</li>
         <li><b>Partitioned data lakes.</b> Event tables written <code>partitionBy('date')</code> so that
         a query for one day reads one day's folder, not the whole history &mdash; partition pruning.</li>
         <li><b>Machine learning (ML) at scale.</b> Feature pipelines that group and join across many
         large tables before training. Every <code>groupBy</code> and <code>join</code> is a shuffle to
         budget for.</li>
       </ul>`,

    pitfalls:
      `<ul>
         <li><b>Too few partitions &mdash; no parallelism, or out-of-memory (OOM).</b> If a 500 GB stage
         has 10 partitions, only 10 tasks run and each must hold 50 GB &mdash; most of the cluster sits
         idle and tasks blow up. Fix: <code>repartition(n)</code> up to roughly 2&ndash;4x the number of
         cores so every core stays busy and each task is a sane size.</li>
         <li><b>Too many tiny partitions &mdash; scheduling overhead.</b> 200,000 partitions of a few
         kilobytes each means the driver spends all its time scheduling tiny tasks. Fix: fewer, larger
         partitions; aim for partitions in the low hundreds of megabytes.</li>
         <li><b>Using <code>repartition</code> when <code>coalesce</code> would do.</b>
         <code>repartition(n)</code> is a <b>full shuffle</b>; if you only want <i>fewer</i> partitions
         (e.g. to write fewer output files), <code>coalesce(n)</code> merges them with <b>no shuffle</b>
         and is far cheaper.</li>
         <li><b>Needless shuffles.</b> Re-grouping or re-joining on the same key repeatedly, or
         <code>repartition</code>-ing right before an operation that would shuffle anyway. Fix: do the
         shuffle once and reuse the result (cache it); let one shuffle serve several downstream steps.</li>
         <li><b>Ignoring skew &mdash; the long-tail straggler.</b> One hot key (a <code>null</code>, a
         <code>"guest"</code> user, a default value) sends most rows to one task that then runs for hours.
         Fix: <b>salt</b> the key (split the hot key into sub-keys), enable Adaptive Query Execution (AQE)
         skew-join handling, or filter the hot key out and handle it separately.</li>
         <li><b>The small-files problem from over-partitioned writes.</b>
         <code>partitionBy('date','user_id')</code> with millions of users writes millions of tiny files
         and cripples later reads. Fix: only <code>partitionBy</code> low-cardinality columns you filter
         on; <code>coalesce</code> or <code>repartition</code> before writing to control file count.</li>
       </ul>`,

    bigIdea:
      `<p>Spark splits every DataFrame into <b>partitions</b> &mdash; independent chunks of rows. A
       partition is the <b>unit of parallelism</b>: one task processes one partition on one core. With 200
       partitions and 50 cores, Spark runs 50 tasks at a time until all 200 are done. Get the partition
       count badly wrong and everything else is moot: too few and most of the cluster sits idle (or a task
       runs out of memory); too many and the driver drowns in tiny-task overhead.</p>
       <p>Most operations are <b>narrow</b> &mdash; each output partition depends on just one input
       partition (a <code>filter</code>, a <code>select</code>, a <code>withColumn</code>). These need no
       data movement, so they're cheap and run inside a single stage.</p>
       <p>But some operations need to bring together <i>all the rows that share a key</i> &mdash; a
       <code>groupBy</code>, a <code>join</code>, a <code>distinct</code>, a <code>repartition</code>.
       Those rows start out scattered across every partition, so Spark must <b>redistribute the data
       across the network by key</b>. That redistribution is the <b>shuffle</b>, and it is the single
       most expensive thing Spark does: every executor writes its data to local disk, sorted into buckets
       by key, and every other executor reads the buckets meant for it over the network. Disk write plus
       network transfer plus a stage boundary &mdash; that is why <b>the shuffle is the first place to look
       when a job is slow.</b></p>`,

    buildup:
      `<p>Build the picture one piece at a time.</p>
       <p><b>1. Partitions are the unit of work.</b> Check how many you have with
       <code>df.rdd.getNumPartitions()</code>. A read off disk gives you a count based on file sizes; the
       default for a shuffle is set by <code>spark.sql.shuffle.partitions</code> (default <b>200</b>). The
       rule of thumb: enough partitions that every core has work (so &ge; the core count, often 2&ndash;4x
       it), but each partition still a healthy size (hundreds of megabytes, not kilobytes).</p>
       <p><b>2. Changing the partition count: <code>repartition</code> vs <code>coalesce</code>.</b>
       <code>repartition(n)</code> does a <b>full shuffle</b> to produce exactly <code>n</code> evenly-sized
       partitions &mdash; it can <i>increase</i> or decrease the count, but it pays the shuffle cost.
       <code>coalesce(n)</code> only <i>decreases</i> the count by <b>merging</b> existing partitions on
       the same executors &mdash; <b>no shuffle</b>, so it's cheap, but the result can be uneven. Use
       <code>coalesce</code> to combine partitions before a write (fewer output files);
       use <code>repartition</code> when you need more partitions or even sizes.</p>
       <p><b>3. Seeing the shuffle.</b> Call <code>df.explain()</code> on a <code>groupBy</code> or
       <code>join</code> and look for an <b>Exchange</b> node in the plan &mdash; that <i>is</i> the
       shuffle. The plan splits into <b>stages</b> at every Exchange; each stage boundary is a shuffle you
       paid for.</p>
       <p><b>4. Partitioning on write: pruning.</b> <code>df.write.partitionBy('date').parquet(path)</code>
       lays the data out as one folder per date. A later read with <code>.filter(col('date') == d)</code>
       physically reads only that one folder &mdash; <b>partition pruning</b>. This is layout-on-disk,
       distinct from the in-memory partitions above, but the same idea: don't touch data you don't need.</p>
       <p><b>5. Skew: when one partition is a monster.</b> The shuffle sends each key's rows to a partition
       chosen by <code>hash(key) % n</code>. If keys are spread out, partitions come out even. If one key
       owns most of the rows &mdash; a <code>null</code>, a default account, a viral item &mdash; its
       partition becomes huge, and the one task that owns it runs long after every other task has finished.
       That straggler sets the runtime of the whole stage. Fixes: <b>salting</b> (append a random suffix to
       the hot key so its rows spread across many partitions, then combine), or turn on AQE
       (<code>spark.sql.adaptive.enabled</code>) which can detect and split skewed join partitions
       automatically.</p>`,

    symbols: [
      { sym: "partition", desc: "an independent chunk of a DataFrame's rows; the unit of parallelism. One task processes one partition on one core." },
      { sym: "shuffle", desc: "redistributing data across the network so all rows sharing a key land in the same partition. Triggered by groupBy, join, distinct, repartition. Writes to disk and moves data between executors — the most expensive operation in Spark." },
      { sym: "Exchange", desc: "the node in df.explain()'s physical plan that represents a shuffle. Each Exchange is a stage boundary." },
      { sym: "spark.sql.shuffle.partitions", desc: "the config that sets how many partitions a shuffle produces. Default 200 — often too many for small data, too few for very large data." },
      { sym: "$h(k)\\bmod n$", desc: "the partition a key $k$ goes to: hash of the key, modulo the number of partitions $n$. Even key spread gives even partitions; one dominant key gives skew." }
    ],

    derivation:
      `<p><b>Why one hot key wrecks the whole stage &mdash; the straggler arithmetic.</b></p>
       <ul class="steps">
         <li>A shuffle routes each row to partition $h(k)\\bmod n$, where $k$ is the key, $h$ is the hash,
         and $n$ is the partition count. If keys are spread out, each of the $n$ partitions gets about
         $R/n$ of the $R$ total rows &mdash; balanced.</li>
         <li>Stage wall-clock time is set by the <b>slowest</b> task, not the average, because the stage is
         not done until its last task finishes. With balanced partitions each task does $\\approx R/n$ work,
         so the stage takes about $(R/n)\\times c$ for per-row cost $c$.</li>
         <li>Now suppose one key owns a fraction $f$ of all rows (say $f=0.7$). All $fR$ of those rows hash
         to the <b>same</b> partition. That one task does $\\approx fR$ work while every other task does
         $\\approx (1-f)R/(n-1)$.</li>
         <li>The slowdown versus the balanced case is the ratio of the biggest task to the average:
         $\\frac{fR}{R/n} = f\\cdot n$. With $f=0.7$ and $n=8$ that is $\\approx 5.6\\times$ &mdash; the
         stage takes almost six times as long as it would with no skew, and adding executors does
         <b>nothing</b>, because the bottleneck is one task that cannot be split.</li>
         <li><b>Salting</b> breaks the tie: replace the hot key $k$ with $k\\,\\|\\,r$ for a small random
         $r\\in\\{0,\\dots,s-1\\}$, so its rows spread across $s$ partitions instead of one, then aggregate
         the salted groups and combine. The monster partition is cut roughly $s$-fold. $\\blacksquare$</li>
       </ul>`,

    example:
      `<p>You join an <code>events</code> table (200 million rows) to a small <code>users</code> table
       (50,000 rows) on <code>user_id</code>, then count events per user.</p>
       <ul class="steps">
         <li><b>The naive join shuffles both sides.</b> Spark redistributes all 200M event rows
         <i>and</i> the 50K user rows by <code>user_id</code> &mdash; a big, expensive Exchange. You see it
         in <code>df.explain()</code> as two <code>Exchange hashpartitioning(user_id, 200)</code> nodes.</li>
         <li><b>Broadcast the small side instead.</b> The users table is tiny, so
         <code>events.join(broadcast(users), 'user_id')</code> ships the whole users table to every
         executor and joins locally &mdash; <b>no shuffle of the 200M rows.</b> The Exchange disappears
         from the plan.</li>
         <li><b>The <code>groupBy('user_id').count()</code> still shuffles</b> the 200M rows by user. Fine
         &mdash; that one is unavoidable. But now suppose 70% of events have <code>user_id = 0</code> (a
         logged-out sentinel). All of those land in one partition; one task runs for an hour while the
         other 199 finish in minutes.</li>
         <li><b>Salt the hot key.</b> Add <code>salt = floor(rand()*16)</code>, group by
         <code>(user_id, salt)</code>, sum, then group by <code>user_id</code> to combine the 16 partials.
         The sentinel's rows now spread across 16 partitions instead of one, and the straggler is gone.</li>
       </ul>`,

    practice: [
      {
        q: `A Spark stage shows 199 of 200 tasks finished in under a minute, but task 200 has been running for 40 minutes. What is the most likely cause, and what's the fix?`,
        steps: [
          { do: `Recognize the pattern: almost all tasks done, one task running far longer.`, why: `A long-tail straggler after a shuffle is the textbook signature of <b>data skew</b> — one partition got most of the rows.` },
          { do: `Identify the shuffle key (the <code>groupBy</code> or <code>join</code> column) and check its value distribution.`, why: `Skew comes from one dominant key — a <code>null</code>, a default id, a sentinel like a logged-out user — that hashes all its rows into one partition.` },
          { do: `Apply a fix: salt the hot key, or enable Adaptive Query Execution skew handling.`, why: `Salting spreads the hot key's rows across many partitions; AQE can detect and split a skewed join partition automatically.` }
        ],
        answer: `<p><b>Data skew.</b> The shuffle sends every row for a key to the partition <code>hash(key) % n</code>; one hot key (often <code>null</code> or a default value) owns most of the rows, so its single task runs long after the rest. Adding executors does nothing because the bottleneck is one un-splittable task. Fix by <b>salting</b> the hot key (append a small random suffix so its rows spread across many partitions, then combine the partials) or by enabling <b>AQE</b> (<code>spark.sql.adaptive.enabled</code>), which can detect and split skewed join partitions automatically. Filtering the hot key out and handling it separately also works.</p>`
      },
      {
        q: `Your job finishes correctly but writes 50,000 tiny Parquet files, one per task, and downstream reads are slow. You want about 50 files. Should you use <code>repartition(50)</code> or <code>coalesce(50)</code>, and why?`,
        steps: [
          { do: `Note you only need to <i>reduce</i> the number of partitions (from many to 50).`, why: `<code>coalesce</code> can only decrease the count, which is exactly this case.` },
          { do: `Compare cost: <code>repartition(50)</code> triggers a full shuffle; <code>coalesce(50)</code> merges existing partitions on the same executors with no shuffle.`, why: `A shuffle writes to disk and moves data across the network — needless here, since you don't need even sizes, just fewer files.` },
          { do: `Call <code>df.coalesce(50).write.parquet(path)</code>.`, why: `It merges the partitions cheaply and writes ~50 files.` }
        ],
        answer: `<p>Use <b><code>coalesce(50)</code></b>. You only need to <i>reduce</i> the partition count, and <code>coalesce</code> does that by merging existing partitions on the same executors with <b>no shuffle</b> &mdash; cheap. <code>repartition(50)</code> would give you evenly-sized partitions but pays for a <b>full shuffle</b> you don't need just to control output file count. The one caveat: <code>coalesce</code> can leave partitions uneven and reduces upstream parallelism, so if you need balanced sizes (or to <i>increase</i> the count) use <code>repartition</code> instead. This is the small-files problem; either way, control file count <i>before</i> the write.</p>`
      },
      {
        q: `You run <code>events.groupBy('country').count().explain()</code> and see an <code>Exchange hashpartitioning(country, 200)</code> node. What is that node, where did the 200 come from, and your data is only a few thousand rows — is 200 a good number?`,
        steps: [
          { do: `Read the <code>Exchange</code> node as the shuffle.`, why: `Every shuffle shows up in the physical plan as an Exchange; it marks a stage boundary and the network/disk redistribution of rows by key.` },
          { do: `Trace the 200 to <code>spark.sql.shuffle.partitions</code>, whose default is 200.`, why: `That config sets how many partitions a shuffle produces; nothing about your data picks it — it's a global default.` },
          { do: `Judge it against the data size: a few thousand rows split into 200 partitions is tens of rows each.`, why: `Hundreds of near-empty tasks add scheduling overhead with no parallelism benefit — too many partitions for tiny data.` }
        ],
        answer: `<p>The <code>Exchange hashpartitioning(country, 200)</code> node <b>is the shuffle</b>: it redistributes the rows by <code>country</code> so each country's rows land together, and it marks a stage boundary. The <b>200</b> comes from <code>spark.sql.shuffle.partitions</code> (its default), not from your data. For a few thousand rows it's <b>far too many</b> &mdash; you get ~200 near-empty tasks whose scheduling overhead dwarfs the work. Lower it with <code>spark.conf.set('spark.sql.shuffle.partitions', 8)</code> (or enable AQE, which can coalesce shuffle partitions down automatically). The default is tuned for large data; small data wants far fewer.</p>`
      }
    ]
  });

  window.CODE["spark-shuffles-partitioning"] = {
    lib: "PySpark",
    runnable: false,
    explain: `<p>The whole partitioning-and-shuffle toolkit, end to end, runnable in Google Colab local mode
      after <code>!pip install pyspark</code> (the JVM-less in-browser engine cannot run it, so
      <code>runnable</code> is off). We check the partition count with <code>getNumPartitions</code>; contrast
      <code>repartition</code> (full shuffle, can increase) with <code>coalesce</code> (no shuffle, decrease
      only); run a <code>groupBy</code> and read the <b>Exchange</b> node in <code>.explain()</code> &mdash; that
      is the shuffle; write <code>partitionBy('date')</code> and read back with a filter to show partition
      <b>pruning</b>; and tune <code>spark.sql.shuffle.partitions</code> to see the shuffle partition count change.
      Everything runs on a tiny inline dataset on one Colab virtual machine (VM).</p>`,
    code: `# Colab: !pip install pyspark
from pyspark.sql import SparkSession
from pyspark.sql import functions as F

spark = (SparkSession.builder
         .master("local[*]")              # use all local cores as "executors"
         .appName("shuffles-partitioning")
         .getOrCreate())

# Small inline dataset: events with a date and a user_id.
rows = [(i, ["2024-01-01", "2024-01-02", "2024-01-03"][i % 3],
         0 if i % 10 < 7 else i)          # user_id 0 is a HOT key (70% of rows) -> skew
        for i in range(3000)]
df = spark.createDataFrame(rows, ["event_id", "date", "user_id"])

# ============================================================
# 1. PARTITIONS are the unit of parallelism — count them
# ============================================================
print("partitions:", df.rdd.getNumPartitions())   # depends on local cores

# ============================================================
# 2. repartition (FULL SHUFFLE, can increase) vs coalesce (NO shuffle, decrease only)
# ============================================================
more = df.repartition(16)                  # shuffle to exactly 16 even partitions
print("after repartition(16):", more.rdd.getNumPartitions())   # 16

fewer = more.coalesce(4)                    # merge down to 4 — no shuffle, may be uneven
print("after coalesce(4):", fewer.rdd.getNumPartitions())      # 4
# coalesce cannot INCREASE: more.coalesce(99) would stay at 16.

# ============================================================
# 3. groupBy TRIGGERS A SHUFFLE — see the Exchange in the plan
# ============================================================
g = df.groupBy("user_id").count()
g.explain()                                # look for: Exchange hashpartitioning(user_id, 200)
# The Exchange node IS the shuffle: rows redistributed across the network by user_id.

# ============================================================
# 4. partitionBy on WRITE -> partition PRUNING on read
# ============================================================
df.write.mode("overwrite").partitionBy("date").parquet("/tmp/events_parquet")
# Layout on disk: /tmp/events_parquet/date=2024-01-01/, date=2024-01-02/, ...

one_day = spark.read.parquet("/tmp/events_parquet").filter(F.col("date") == "2024-01-02")
one_day.explain()        # plan shows PartitionFilters: [date = 2024-01-02] -> reads ONE folder
print("one-day rows:", one_day.count())    # only that date's files are touched (pruning)

# ============================================================
# 5. spark.sql.shuffle.partitions — the default-200 dial
# ============================================================
print("default:", spark.conf.get("spark.sql.shuffle.partitions"))   # 200
spark.conf.set("spark.sql.shuffle.partitions", 8)   # 200 is wasteful for tiny data
g2 = df.groupBy("user_id").count()
print("shuffle partitions now:", g2.rdd.getNumPartitions())          # 8

# ============================================================
# 6. SKEW + the SALTING fix (user_id 0 owns 70% of rows)
# ============================================================
print(df.groupBy("user_id").count().orderBy(F.desc("count")).show(3))  # user_id 0 dominates

salted = (df
    .withColumn("salt", (F.rand(seed=0) * 16).cast("int"))   # spread the hot key 16 ways
    .groupBy("user_id", "salt").agg(F.count("*").alias("c"))  # 1st pass: salted partials
    .groupBy("user_id").agg(F.sum("c").alias("count")))       # 2nd pass: combine partials
print(salted.orderBy(F.desc("count")).show(3))               # same totals, no straggler

# Adaptive Query Execution can handle skew automatically (on by default in Spark 3.2+):
# spark.conf.set("spark.sql.adaptive.enabled", True)
# spark.conf.set("spark.sql.adaptive.skewJoin.enabled", True)

spark.stop()`
  };

  window.CODEVIZ["spark-shuffles-partitioning"] = {
    question: "When 3,000 rows are shuffled into 8 partitions, what does an EVEN key distribution look like versus a SKEWED one where a single hot key owns 70% of the rows?",
    charts: [
      {
        type: "bars",
        title: "Records per partition — EVEN keys (one task each finishes fast)",
        xlabel: "partition",
        ylabel: "records",
        labels: ["p0", "p1", "p2", "p3", "p4", "p5", "p6", "p7"],
        values: [9934, 9924, 9997, 10220, 10070, 9951, 9949, 9955],
        valueLabels: ["9934", "9924", "9997", "10220", "10070", "9951", "9949", "9955"],
        colors: ["#7ee787", "#7ee787", "#7ee787", "#7ee787", "#7ee787", "#7ee787", "#7ee787", "#7ee787"]
      },
      {
        type: "bars",
        title: "Records per partition — SKEWED (one hot key → one monster task)",
        xlabel: "partition",
        ylabel: "records",
        labels: ["p0", "p1", "p2", "p3", "p4", "p5", "p6", "p7"],
        values: [58780, 3028, 2988, 3019, 3109, 3004, 3046, 3026],
        valueLabels: ["58780", "3028", "2988", "3019", "3109", "3004", "3046", "3026"],
        colors: ["#ff7b72", "#7ee787", "#7ee787", "#7ee787", "#7ee787", "#7ee787", "#7ee787", "#7ee787"]
      }
    ],
    caption: "Real counts from hashing 80,000 keys into 8 partitions. EVEN case (keys spread across ~50,000 values): every partition gets ~10,000 rows, so max/mean ≈ 1.02 — perfectly balanced, all 8 tasks finish together. SKEWED case (one hot key owns 70% of rows — think a null or logged-out-user sentinel): partition p0 gets 58,780 rows (73.5% of everything) while the rest get ~3,000 each, so max/mean ≈ 5.88. The stage's runtime is set by its slowest task, so p0's task runs ~6x longer than it should and the other 7 sit idle — the straggler. Adding executors does nothing; you must salt the key or let AQE split it. This is the skew problem made visible.",
    code: `import numpy as np

N_PART = 8                 # shuffle into 8 partitions
rng = np.random.RandomState(0)
n = 80_000                 # number of rows to route

# ---- EVEN: keys spread across ~50,000 distinct values ----
even_keys = rng.randint(0, 50_000, size=n)
even_counts = np.bincount(even_keys % N_PART, minlength=N_PART)

# ---- SKEWED: one HOT key (0) owns 70% of rows; rest random ----
skew_keys = np.where(rng.rand(n) < 0.70, 0, rng.randint(1, 50_000, size=n))
skew_counts = np.bincount(skew_keys % N_PART, minlength=N_PART)

print("EVEN :", even_counts.tolist(),
      "max/mean =", round(even_counts.max() / even_counts.mean(), 2))   # ~1.02
print("SKEW :", skew_counts.tolist(),
      "max/mean =", round(skew_counts.max() / skew_counts.mean(), 2))   # ~5.88
print("hot partition share:", round(100 * skew_counts[0] / skew_counts.sum(), 1), "%")  # 73.5
# EVEN : [9934, 9924, 9997, 10220, 10070, 9951, 9949, 9955]  max/mean = 1.02
# SKEW : [58780, 3028, 2988, 3019, 3109, 3004, 3046, 3026]   max/mean = 5.88
# A stage finishes only when its slowest task does, so the skewed p0 sets the runtime.`
  };
})();
