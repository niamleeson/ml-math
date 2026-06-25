/* Apache Spark — "What Spark is and why it exists: distributed in-memory computing".
   Self-contained: lesson + CODE + CODEVIZ merged by id "spark-intro". */
(function () {
  window.LESSONS.push({
    id: "spark-intro",
    title: "Apache Spark: distributed computing for data too big for one machine",
    tagline: "A driver hands work to executors across a cluster, which crunch data partitions in parallel — lazily, with fault tolerance.",
    module: "Apache Spark",
    prereqs: ["dw-big-data"],

    whenToUse:
      `<p><b>Spark earns its keep when the data is genuinely too big for one machine</b> &mdash; and only then.
       The whole point of Spark is to spread one job across many computers so they work on it at the same time.
       That power comes with overhead, so it is a bad default for small data.</p>
       <ul>
         <li><b>Reach for Spark when:</b> the data is far larger than the random-access memory (RAM) of one box
         (hundreds of gigabytes to petabytes); you run huge <b>ETL (Extract, Transform, Load)</b> jobs or join
         two giant tables; you train or score machine learning (ML) models over data that no single machine can
         hold; or the data already lives in a distributed store and you want to compute next to it.</li>
         <li><b>Do NOT reach for Spark when:</b> the data fits in RAM. If it fits, <b>pandas</b>, <b>Polars</b>,
         <b>DuckDB</b>, or a plain database will be <i>faster</i> and far simpler. Spark has to start a cluster,
         ship code to workers, and shuffle data over the network &mdash; all pure overhead that a single-machine
         tool never pays. Below roughly a few gigabytes, that overhead loses every time.</li>
       </ul>
       <p>Rule of thumb: <b>try the cheap single-machine tools first</b> (see the <code>dw-big-data</code> lesson).
       Graduate to Spark only when one machine truly cannot do the job.</p>`,

    application:
      `<p>Spark is the workhorse of large-scale data work. You meet it most often as <b>PySpark</b>, its Python
       interface.</p>
       <ul>
         <li><b>Big ETL.</b> Nightly pipelines that read terabytes of raw logs, clean and reshape them, and write
         tidy tables &mdash; the bread-and-butter use.</li>
         <li><b>Giant joins and aggregations.</b> Joining a billion-row event table to a dimension table, or
         computing per-user rollups across all of history.</li>
         <li><b>ML at scale.</b> <b>Spark MLlib</b> trains models (and Spark prepares features) over datasets too
         large to fit on one node.</li>
         <li><b>Streaming.</b> <b>Structured Streaming</b> applies the same DataFrame code to data arriving
         continuously, not just to files at rest.</li>
       </ul>
       <p><b>Sibling Spark lessons map.</b> This lesson is the front door. From here the family branches into:
       the <b>DataFrame API</b> (the everyday table interface), <b>transformations vs. actions</b> (the lazy plan
       and what triggers it), the <b>shuffle</b> (the expensive data reshuffling behind joins and group-bys),
       <b>partitioning and skew</b> (how data splits across the cluster and what goes wrong when it splits
       unevenly), <b>caching</b> (keeping reused data in memory), <b>broadcast joins</b> (a cheap join when one
       side is small), and <b>Spark MLlib</b> (machine learning at scale). Start here, then follow whichever
       branch your problem needs.</p>`,

    pitfalls:
      `<ul>
         <li><b>Using Spark for small data.</b> The single most common mistake. If the data fits in RAM, Spark's
         startup, code-shipping, and network-shuffle overhead makes it <i>slower</i> than pandas or Polars. Fix:
         measure your data size honestly; below a few gigabytes, stay single-machine.</li>
         <li><b>Treating Spark like pandas.</b> Spark is <b>lazy</b> and <b>distributed</b> &mdash; the data is not
         all in one place, and nothing runs until you trigger it. Code that loops row-by-row, or assumes a global
         row order, fights the engine. Fix: express work as whole-DataFrame transformations and let Spark plan it.</li>
         <li><b>Calling <code>collect()</code> on a big result.</b> <code>df.collect()</code> (and friends like
         <code>toPandas()</code>) pulls <i>every</i> row back to the single <b>driver</b> program, which then runs
         out of memory and crashes. Fix: aggregate first and only collect a small result, or use
         <code>df.show()</code> / <code>df.take(n)</code> to peek, or <code>write</code> the full output to storage.</li>
         <li><b>Forgetting to stop the session.</b> Leaving <code>SparkSession</code> objects open ties up cluster
         resources. Fix: call <code>spark.stop()</code> when done (or use the context that stops it for you).</li>
       </ul>`,

    bigIdea:
      `<p><b>One machine has a ceiling.</b> A single computer has a fixed amount of memory and a fixed number of
       processor cores. When the data outgrows that ceiling, you cannot just keep asking for a bigger box &mdash;
       eventually the biggest box is still too small. <b>Apache Spark's idea is to use many machines together</b>,
       splitting one job across a whole <b>cluster</b> so they all work on a slice of the data at the same time.</p>
       <p>Three roles make this work:</p>
       <ul>
         <li><b>The driver.</b> One program that holds your code and the plan. It does not crunch the bulk of the
         data itself; it coordinates &mdash; it decides what work to do and hands pieces out.</li>
         <li><b>The executors.</b> Worker processes running on the cluster's machines (the <i>worker nodes</i>).
         Each executor does the actual number-crunching on its slice of the data and holds that slice in memory.</li>
         <li><b>The partitions.</b> Spark chops the data into many chunks called <b>partitions</b>. Each partition
         is processed independently, in parallel, by the executors. More partitions than cores means the work
         streams through; this is where the speed comes from.</li>
       </ul>
       <p>Two more ideas make Spark practical: it is <b>in-memory</b> (it keeps working data in RAM across the
       cluster instead of writing to disk between every step, which is why it is far faster than the older
       disk-based MapReduce), it is <b>lazy</b> (it builds up a plan and only runs it when you actually ask for a
       result), and it is <b>fault-tolerant</b> (if a machine dies mid-job, Spark recomputes just that machine's
       lost partitions from the recorded plan, so the whole job does not fail).</p>`,

    buildup:
      `<p>Follow one job through the system.</p>
       <p><b>1. You write a plan, not a loop.</b> In PySpark you describe <i>what</i> you want &mdash; read this
       data, filter it, group it, count it &mdash; using DataFrame operations. You are not telling each machine
       what to do step by step; you are handing the driver a recipe.</p>
       <p><b>2. The driver splits the data into partitions.</b> Say the input is split into 200 partitions. Each
       partition is a manageable chunk that one executor can hold and process on its own.</p>
       <p><b>3. Executors process partitions in parallel.</b> If you have 50 executor cores, roughly 50 partitions
       are being worked on at any instant; as each finishes, the next begins. Fifty machines doing a fiftieth of
       the work each finish far sooner than one machine doing all of it &mdash; <i>when</i> the data is big enough
       that the per-machine work dwarfs the coordination cost.</p>
       <p><b>4. Lazy evaluation builds a plan first.</b> Operations like <code>filter</code> and <code>groupBy</code>
       are <b>transformations</b>: they do not run, they just extend the plan (recorded as a <b>DAG (Directed
       Acyclic Graph)</b> of steps). Only an <b>action</b> &mdash; <code>count()</code>, <code>show()</code>,
       <code>write</code> &mdash; triggers execution. Spark then optimizes the whole plan at once (reordering
       filters, pruning columns) before any data moves. This is why Spark feels like it does nothing until the
       last line.</p>
       <p><b>5. Fault tolerance comes for free from the plan.</b> Because Spark recorded how every partition was
       derived, a lost executor's partitions can be <b>recomputed</b> from their inputs. The job survives machine
       failures &mdash; essential when you are running across hundreds of machines where something is always
       breaking.</p>`,

    symbols: [],

    derivation:
      `<p><b>Why "in-memory across a cluster" is the whole trick.</b></p>
       <ul class="steps">
         <li>Spark's predecessor, <b>MapReduce</b>, wrote intermediate results to disk between every stage. Disk
         is orders of magnitude slower than memory, so a multi-step job paid that disk tax over and over.</li>
         <li>Spark instead keeps working data <b>in the executors' memory</b> across steps. A pipeline of ten
         transformations can flow through RAM without round-tripping to disk, which is the headline reason Spark
         is often 10&ndash;100x faster than MapReduce on iterative work.</li>
         <li>But memory on one machine is small. So Spark spreads the data across <i>many</i> machines' memory at
         once &mdash; the cluster's combined RAM can be enormous. Each executor holds and computes only its
         partitions.</li>
         <li>The cost of distributing is the <b>shuffle</b>: operations like a join or a group-by sometimes need
         records from different partitions to meet, which means moving data across the network between executors.
         Shuffles are the expensive part of Spark, and a separate lesson is devoted to them.</li>
         <li>Net effect: for <b>big</b> data, parallel in-memory work across many machines wins decisively. For
         <b>small</b> data, the fixed costs &mdash; launching the cluster, shipping code, the first shuffle &mdash;
         dominate, and a single-machine tool with zero coordination cost wins. That crossover is the practical
         heart of "when to use Spark." $\\blacksquare$</li>
       </ul>`,

    example:
      `<p>A tiny concrete run, the same shape you would scale to billions of rows.</p>
       <ul class="steps">
         <li><b>Start a session in local mode.</b> On a laptop or in Google Colab,
         <code>SparkSession.builder.master("local[*]")</code> starts Spark using all of your machine's cores as
         pretend "executors." <code>local[*]</code> means "use every core here." Same code, real cluster later.</li>
         <li><b>Make a small DataFrame.</b> <code>spark.createDataFrame([("a", 1), ("b", 2), ("a", 3)],
         ["key", "val"])</code> builds a distributed table &mdash; trivially small here, but Spark treats it the
         same way it would a huge one.</li>
         <li><b>Build a lazy plan.</b> <code>df.groupBy("key").sum("val")</code> records "group by key, sum val"
         in the DAG. Nothing has run yet.</li>
         <li><b>Trigger it with an action.</b> <code>.show()</code> runs the plan and prints the result:
         <code>a &rarr; 4</code>, <code>b &rarr; 2</code>. <code>df.count()</code> is another action; it returns
         <code>3</code>.</li>
         <li><b>Clean up.</b> <code>spark.stop()</code> releases the session. On a real cluster that frees the
         executors for the next job.</li>
       </ul>
       <p>The leap to production is conceptual, not syntactic: swap <code>master("local[*]")</code> for a real
       cluster manager and point at terabytes &mdash; the DataFrame code is identical.</p>`,

    practice: [
      {
        q: `A colleague has a 400 MB CSV and proudly spins up a Spark cluster to <code>groupBy</code>-sum it, but it runs slower than your pandas one-liner. Why, and what should they do?`,
        steps: [
          { do: `Note the data size: 400 MB fits comfortably in the RAM of a single machine.`, why: `Spark's whole advantage is spreading data that does not fit on one box; here it fits easily, so there is nothing to spread.` },
          { do: `Account for Spark's fixed overhead: starting the cluster, shipping code to executors, and the network shuffle a group-by triggers.`, why: `On small data those fixed costs dominate the actual computation, so Spark loses to a tool with zero coordination cost.` },
          { do: `Recommend a single-machine tool: pandas, Polars, or DuckDB.`, why: `They do the group-by-sum entirely in local memory with no cluster overhead, finishing far faster.` }
        ],
        answer: `<p>The data fits in RAM, so Spark's distribution machinery is pure overhead: it must start a cluster, ship the code to executors, and shuffle data over the network for the group-by &mdash; costs a single-machine tool never pays. Below a few gigabytes, <b>pandas / Polars / DuckDB</b> win. Spark only pays off when the data is genuinely too big for one machine.</p>`
      },
      {
        q: `In PySpark you run a chain of <code>filter</code> and <code>select</code> calls and notice nothing seems to happen &mdash; no time passes &mdash; until you call <code>.count()</code>, which suddenly takes a while. Explain.`,
        steps: [
          { do: `Recognize filter and select as transformations.`, why: `Transformations are lazy: they only extend the plan (the DAG), they do not move or compute any data.` },
          { do: `Recognize count() as an action.`, why: `An action is what triggers Spark to actually execute the whole accumulated plan.` },
          { do: `Conclude that all the work happens at the action.`, why: `Spark optimizes and runs the entire chain at once when the action fires, which is why that single call takes the time.` }
        ],
        answer: `<p>Spark uses <b>lazy evaluation</b>. The <code>filter</code> and <code>select</code> calls are <b>transformations</b> &mdash; they only build up the plan and run nothing. The first <b>action</b>, <code>.count()</code>, triggers Spark to execute the whole optimized plan, so all the real work (and time) lands there. This lets Spark optimize the entire query before any data moves.</p>`
      },
      {
        q: `A job filters a billion-row DataFrame down to a few hundred rows, then crashes the driver with an out-of-memory error on the line <code>rows = df.collect()</code> &mdash; even though the final result is tiny. What is the trap, and how would you guard against it generally?`,
        steps: [
          { do: `Check what collect() does.`, why: `<code>collect()</code> pulls every row of the DataFrame it is called on back to the single driver program.` },
          { do: `Check whether the filter actually shrank what collect sees.`, why: `If collect() is called before the filter materializes — or on the wrong DataFrame — it can still try to drag the full billion rows to the driver.` },
          { do: `Make sure you only collect after aggregating to a small result, or avoid collect entirely.`, why: `Pulling a small result is safe; use show()/take(n) to peek, or write() the full output to storage instead.` }
        ],
        answer: `<p><code>collect()</code> pulls <i>all</i> its rows to the single <b>driver</b>, which has only one machine's memory. If it runs against the big DataFrame (rather than the tiny filtered/aggregated one), the driver tries to hold a billion rows and dies. The general guard: <b>only <code>collect()</code> a result you know is small</b> &mdash; aggregate first, use <code>show()</code>/<code>take(n)</code> to inspect, or <code>write()</code> large output straight to storage. Never collect a big DataFrame to the driver.</p>`
      }
    ]
  });

  window.CODE["spark-intro"] = {
    lib: "PySpark",
    runnable: false,
    explain: `<p>The standard PySpark "hello cluster" &mdash; written to run in <b>Google Colab in local mode</b>.
      First the setup cell installs Spark (<code>!pip install pyspark</code>); then we create a
      <code>SparkSession</code> with <code>master("local[*]")</code>, which uses every core on the Colab virtual
      machine as pretend executors. We build a tiny DataFrame, run two <b>actions</b> (<code>show()</code> and
      <code>count()</code>), print the Spark version and how many <b>partitions</b> the data was split into, and
      &mdash; importantly &mdash; <code>spark.stop()</code> to release the session. <code>runnable</code> is off
      because the in-browser engine has no Java Virtual Machine (JVM); paste this into Colab to run it.</p>`,
    code: `# Colab: !pip install pyspark   (run this in the notebook's setup cell first)
from pyspark.sql import SparkSession

# ============================================================
# 1. CREATE A SPARK SESSION IN LOCAL MODE
#    master("local[*]") = use every core on this machine as an "executor".
#    Same code points at a real cluster later by changing only this string.
# ============================================================
spark = (
    SparkSession.builder
        .master("local[*]")          # run locally, all cores (great for Colab)
        .appName("spark-intro")
        .getOrCreate()
)
print("Spark version:", spark.version)        # e.g. 3.5.x

# ============================================================
# 2. CREATE A SMALL DISTRIBUTED DataFrame (a tiny inline table)
#    Spark treats this the same way it would treat billions of rows.
# ============================================================
data = [("alice", "us", 3),
        ("bob",   "us", 1),
        ("carol", "uk", 4),
        ("dan",   "uk", 2),
        ("erin",  "de", 5)]
df = spark.createDataFrame(data, ["user", "country", "score"])

# ============================================================
# 3. ACTIONS: nothing above ran the engine; these trigger it.
# ============================================================
df.show()                                      # prints the table (an action)
print("row count:", df.count())                # -> 5  (an action)

# A lazy TRANSFORMATION (builds plan, runs nothing yet)...
by_country = df.groupBy("country").sum("score")
by_country.show()                              # ...the show() action runs the plan

# How many PARTITIONS was the data split into? (parallel work units)
print("partitions:", df.rdd.getNumPartitions())   # e.g. 5 in local mode

# ============================================================
# 4. ALWAYS STOP THE SESSION to release resources.
# ============================================================
spark.stop()`
  };

  window.CODEVIZ["spark-intro"] = {
    question: "Where does each tool win as the data grows? Illustrative runtimes for pandas vs Spark across small / medium / huge data, showing Spark's fixed overhead loses on small data and only pays off at large scale.",
    charts: [
      {
        type: "bars",
        title: "ILLUSTRATIVE runtime (seconds) — pandas vs Spark by data size",
        labels: ["pandas\n0.1 GB", "Spark\n0.1 GB", "pandas\n5 GB", "Spark\n5 GB", "pandas\n200 GB", "Spark\n200 GB"],
        values: [0.5, 20.5, 25.0, 33.0, 1000.0, 90.0],
        valueLabels: ["0.5", "20.5", "25", "33", "OOM/1000", "90"],
        colors: ["#7ee787", "#ff7b72", "#7ee787", "#ff7b72", "#ff7b72", "#7ee787"]
      }
    ],
    caption: "ILLUSTRATIVE, not benchmarked — plausible numbers to show the shape. Model: pandas runtime ≈ a fixed 0.001 s/MB of in-memory work but it cannot exceed one machine's RAM (≈16 GB), so the 200 GB case fails / thrashes (shown as a 1000 s wall). Spark pays a fixed ≈20 s overhead (start cluster, ship code, first shuffle) PLUS ≈0.45 ms/MB spread across ~64 parallel cores. On 0.1 GB, pandas (0.5 s) crushes Spark (20.5 s) — the overhead dominates. At 5 GB they are close. At 200 GB pandas can't even hold the data while Spark finishes in ~90 s. The lesson: Spark's overhead is a fixed tax that only pays off once the data is too big for one machine.",
    code: `import numpy as np

# ---- A simple, transparent cost MODEL (illustrative, not a benchmark) ----
# pandas: pure in-memory, no coordination overhead, single machine.
#   time = per-MB cost * size, but it BREAKS past one machine's RAM.
# Spark: a fixed startup/shuffle overhead, then per-MB work spread over many cores.
RAM_GB        = 16        # one machine's usable RAM
PANDAS_S_PER_MB = 0.001   # pandas in-memory cost per megabyte
SPARK_FIXED_S = 20.0      # start cluster + ship code + first shuffle
SPARK_S_PER_MB = 0.00045  # raw per-MB work...
SPARK_CORES   = 64        # ...spread across this many parallel cores

def pandas_time(gb):
    mb = gb * 1024
    if gb > RAM_GB:                       # too big for one machine
        return 1000.0                     # OOM / disk-thrash wall (cap for the chart)
    return round(PANDAS_S_PER_MB * mb, 2)

def spark_time(gb):
    mb = gb * 1024
    return round(SPARK_FIXED_S + SPARK_S_PER_MB * mb / SPARK_CORES, 2)

sizes = [0.1, 5, 200]                     # GB: small, medium, huge
rows = []
for gb in sizes:
    p, s = pandas_time(gb), spark_time(gb)
    winner = "pandas" if p < s else "Spark"
    rows.append((gb, p, s, winner))
    print(f"{gb:6} GB   pandas {p:8}s   spark {s:8}s   -> {winner}")
# 0.1 GB   pandas     0.5 s   spark    20.5 s   -> pandas
#   5 GB   pandas    25.0 s   spark    33.0 s   -> pandas
# 200 GB   pandas  1000.0 s   spark    90.0 s   -> Spark   (pandas OOMs)

# Bars in the order plotted: pandas/Spark interleaved per size.
labels = [f"{w}\\n{gb} GB" for gb in sizes for w in ("pandas", "Spark")]
values = [v for (_, p, s, _) in rows for v in (p, s)]
print(labels)
print(values)   # [0.5, 20.5, 25.0, 33.0, 1000.0, 90.0]`
  };
})();
