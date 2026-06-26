/* Apache Spark — "Lazy execution: transformations build a plan, actions run it".
   Self-contained: lesson + CODE + CODEVIZ merged by id "spark-transformations-actions". */
(function () {
  window.LESSONS.push({
    id: "spark-transformations-actions",
    title: "Spark's lazy engine: transformations vs actions",
    tagline: "Transformations only build a plan; an action triggers the whole computation — and Spark optimizes the chain before running it.",
    module: "Apache Spark",
    prereqs: ["dw-big-data", "dw-combining"],

    whenToUse:
      `<p><b>This is the one mental model that explains every Spark performance question.</b> Once data is
       genuinely too big for one machine &mdash; pandas, Polars, and a single box have all run out &mdash; you
       move to Spark, which spreads the data across many machines and runs the work in parallel. The instant you
       do, two questions decide whether your job is fast or slow:</p>
       <ul>
         <li><b>When does my code actually run?</b> In Spark it does <b>not</b> run when you write it. A line like
         <code>df.filter(...)</code> returns instantly and computes nothing &mdash; it just records what you want.
         Knowing this stops the classic "why did my code finish in 2 milliseconds?" confusion and the equally
         classic "why did one tiny line take 10 minutes?" surprise.</li>
         <li><b>How much data moves between machines?</b> Some operations stay local; others force every machine
         to send data to every other machine (a <b>shuffle</b>). Shuffles are the single biggest cost in Spark.
         Reading a job in terms of <i>which</i> steps shuffle is how you find &mdash; and fix &mdash; the slow part.</li>
       </ul>
       <p>You reach for this model the moment you debug a slow Spark job, read a query plan, or open the Spark
       web UI (user interface). It is the prerequisite for everything else: caching, partitioning, skew, joins.</p>`,

    application:
      `<p>Spark runs the heavy data work at most companies, and all of it rides on this lazy model.</p>
       <ul>
         <li><b>ETL (Extract, Transform, Load).</b> Nightly pipelines that read terabytes of raw logs, clean and
         reshape them, and write tidy tables. The whole pipeline is a chain of transformations ended by one
         <code>write</code> action.</li>
         <li><b>Big joins and aggregations.</b> Joining a billion-row events table to a user table, or summing
         revenue by region over a year of data &mdash; exactly the wide, shuffle-heavy operations this lesson is about.</li>
         <li><b>Machine learning at scale.</b> Building feature tables and training data over data that does not
         fit on one machine, feeding Spark MLlib or an external trainer.</li>
         <li><b>Streaming.</b> Structured Streaming reuses the same transformation/action engine on small batches
         of arriving data, so the same plan-then-run model applies.</li>
       </ul>
       <p>It is the natural next step after the single-machine tricks in the <code>dw-big-data</code> lesson:
       when downcasting, Parquet, and Polars are not enough, Spark spreads the same work across a cluster.</p>`,

    pitfalls:
      `<ul>
         <li><b>Expecting code to run immediately.</b> You write ten transformations, nothing errors, nothing
         takes time &mdash; and you conclude it "worked." It has not run at all yet; Spark only built a plan. The
         error (a bad column name, a type mismatch) often surfaces much later, on the first <b>action</b>. Fix:
         remember that only actions (<code>show</code>, <code>count</code>, <code>collect</code>, <code>write</code>,
         <code>take</code>) execute anything, and read the plan with <code>.explain()</code> if you are unsure.</li>
         <li><b>Calling actions in a loop without caching.</b> Each action re-runs the <i>entire</i> chain from the
         original source. A loop that calls <code>df.count()</code> on the same derived <code>df</code> ten times
         re-reads and re-computes everything ten times. Fix: <code>df.cache()</code> (or <code>persist()</code>)
         after an expensive chain, trigger it once, then reuse it.</li>
         <li><b>Triggering re-computation with multiple actions.</b> Even <code>count()</code> then
         <code>show()</code> then <code>write()</code> on the same uncached frame runs the whole plan three times.
         Fix: cache the shared frame, or fuse the work so you only act once.</li>
         <li><b>Wide transformations shuffling when you did not expect it.</b> <code>groupBy</code>,
         <code>join</code>, <code>distinct</code>, and <code>orderBy</code> all move data across the cluster. On
         big data a surprise shuffle is the difference between minutes and hours. Fix: read the plan &mdash; every
         <code>Exchange</code> is a shuffle &mdash; and minimize/broadcast where you can.</li>
         <li><b><code>collect()</code> on a big result.</b> <code>collect()</code> pulls every row back to the
         single driver machine, which then runs out of memory. Fix: <code>write</code> the result to storage, or
         <code>take(n)</code>/<code>show()</code> a small sample instead.</li>
       </ul>`,

    bigIdea:
      `<p>Spark splits the world into two kinds of operation, and the split is the whole trick.</p>
       <ul>
         <li><b>Transformations are lazy.</b> <code>select</code>, <code>filter</code>, <code>withColumn</code>,
         <code>groupBy</code>, <code>join</code> &mdash; each one returns a new DataFrame instantly and computes
         <b>nothing</b>. All it does is add a step to a recipe. That recipe is a <b>DAG (Directed Acyclic Graph)</b>:
         a graph of steps where the arrows only ever point forward (no step depends on itself, directly or
         indirectly), so there is a clear order to run them in.</li>
         <li><b>Actions are eager.</b> <code>show</code>, <code>count</code>, <code>collect</code>,
         <code>write</code>, <code>take</code> &mdash; calling one says "I actually want a result now." Only then
         does Spark look at the whole DAG you built, plan it, and run it across the cluster.</li>
       </ul>
       <p>Why bother being lazy? Because by the time you ask for a result, Spark can see the <b>entire</b> chain at
       once and optimize it as a whole &mdash; reorder filters to happen early, drop columns you never use, fuse
       steps together &mdash; instead of dumbly running each line the moment you typed it. Laziness is what buys
       Spark room to be smart.</p>`,

    buildup:
      `<p>Build the model one layer at a time.</p>
       <p><b>Layer 1 &mdash; the data is split into partitions.</b> A Spark DataFrame is not one block; it is cut
       into <b>partitions</b>, each a chunk of rows living on one machine. Work happens on partitions in parallel
       &mdash; that is the entire point of a cluster.</p>
       <p><b>Layer 2 &mdash; narrow vs wide transformations.</b> This is the most important distinction in Spark.</p>
       <ul>
         <li>A <b>narrow</b> transformation computes each output partition from <b>one</b> input partition, with no
         data crossing between machines. <code>filter</code>, <code>select</code>, <code>withColumn</code>, a
         row-wise <code>map</code> &mdash; each machine just works on the rows it already holds. Cheap and parallel.</li>
         <li>A <b>wide</b> transformation needs rows from <b>many</b> input partitions to land together. To group
         by region, every machine's "west" rows must end up on the same machine. That cross-cluster reorganization
         is a <b>shuffle</b>: data is written out, sent over the network, and read back in. <code>groupBy</code>,
         <code>join</code>, <code>distinct</code>, <code>orderBy</code> are wide. Shuffles are the expensive part
         of almost every Spark job.</li>
       </ul>
       <p><b>Layer 3 &mdash; stages split at shuffles.</b> When you call an action, Spark turns the DAG into a
       <b>job</b>. It then cuts the job into <b>stages</b> at every shuffle boundary: a run of narrow
       transformations that can stream together with no data movement becomes one stage; the shuffle ends it and
       starts the next. In a query plan a shuffle shows up as an <code>Exchange</code> node &mdash; that is your
       stage boundary, made visible.</p>
       <p><b>Layer 4 &mdash; stages are made of tasks.</b> Each stage runs as a set of <b>tasks</b>, <b>one task
       per partition</b>. A stage over 8 input partitions runs 8 tasks in parallel; the post-shuffle stage runs
       one task per shuffle partition. Tasks are the actual unit of work handed to the machines.</p>
       <p>So the full chain is: <b>your transformations build a DAG &rarr; an action submits it as a job &rarr; the
       job splits into stages at shuffles &rarr; each stage runs as one task per partition.</b> Read it with
       <code>df.explain()</code> (the text plan) or the <b>Spark UI</b> (the visual one).</p>`,

    symbols: [],

    derivation:
      `<p><b>Why laziness lets Spark beat a line-by-line engine &mdash; worked on a filter-then-group query.</b></p>
       <ul class="steps">
         <li>Say you write: read a wide table, <code>select</code> two columns, <code>filter</code> to one
         country, <code>groupBy</code> a key, and <code>agg</code> a sum &mdash; then <code>show()</code>. An eager
         engine would materialize the full table, then the projection, then the filtered copy, then the groups, one
         wasteful step at a time.</li>
         <li>Because Spark is <b>lazy</b>, at <code>show()</code> it holds the <i>whole</i> DAG and optimizes it
         first (this optimizer is called Catalyst). It pushes the <b>filter down</b> to the read so non-matching
         rows are never loaded, and <b>prunes columns</b> so only the two you used are read. Far less data enters
         the pipeline.</li>
         <li>It then identifies the one <b>wide</b> step. <code>select</code> and <code>filter</code> are narrow,
         so they fuse into <b>Stage 1</b>, run per partition with zero data movement. <code>groupBy</code> forces a
         <b>shuffle</b> (an <code>Exchange</code>), which <b>ends Stage 1</b> and begins <b>Stage 2</b>, the
         aggregate over the shuffled data.</li>
         <li>Each stage runs as one <b>task per partition</b>. With 8 input partitions, Stage 1 is 8 parallel map
         tasks. The shuffle repartitions by the group key into Spark's default 200 shuffle partitions, so Stage 2
         is up to 200 reduce tasks &mdash; though if there are only a handful of distinct keys, only that handful
         do real work and the rest are empty.</li>
         <li>The payoff: the <b>only</b> expensive move is the single shuffle between the two stages. Everything
         before it was made cheap by pushing filters and column pruning into the read &mdash; an optimization that
         is only possible <i>because</i> Spark waited to see the whole plan before running anything.
         $\\blacksquare$</li>
       </ul>`,

    example:
      `<p>Picture a 12-million-row sales table, split into <b>8 input partitions</b>. You run:
       <code>df.filter(amount &gt; 0).groupBy("region").sum("amount").show()</code>, where about 70% of rows pass
       the filter and there are 5 distinct regions.</p>
       <ul class="steps">
         <li><b>Nothing runs</b> while you write <code>filter</code> and <code>groupBy</code> &mdash; they only
         extend the DAG. The <code>show()</code> at the end is the action that fires the job.</li>
         <li><b>Stage 1 (narrow):</b> the <code>filter</code> is applied inside each partition with no data
         movement &mdash; <b>8 map tasks</b>, one per input partition, in parallel. About 8.4M rows survive.</li>
         <li><b>Shuffle (the <code>Exchange</code>):</b> to bring every region's rows together,
         the surviving rows are repartitioned by <code>region</code> across the network &mdash; roughly
         <b>200 MB shuffled</b>. This is the stage boundary.</li>
         <li><b>Stage 2 (wide):</b> Spark's default is 200 shuffle partitions, so up to <b>200 reduce tasks</b>;
         with only 5 regions, just <b>5 do real work</b> and the rest are empty. Each sums its region's rows.</li>
         <li><b>Read it back:</b> <code>df.filter(...).groupBy(...).sum(...).explain()</code> prints the plan;
         the line containing <code>Exchange hashpartitioning(region...)</code> is exactly the shuffle &mdash; the
         seam between Stage 1 and Stage 2.</li>
       </ul>`,

    practice: [
      {
        q: `You run <code>df2 = df.filter("country = 'US'").select("user_id", "amount")</code> and it returns in a few milliseconds with no error. A teammate says "great, the filter ran." Are they right? What actually happened, and when will it run?`,
        steps: [
          { do: `Identify whether <code>filter</code> and <code>select</code> are transformations or actions.`, why: `Both are <b>transformations</b> &mdash; they are lazy and compute nothing on their own.` },
          { do: `Recognize that returning instantly with no error means no data was processed.`, why: `Spark only appended two steps to the DAG (Directed Acyclic Graph); it did not read or filter any rows.` },
          { do: `Note that the work fires only on the first <b>action</b> (e.g. <code>df2.show()</code> or <code>df2.count()</code>).`, why: `Actions trigger Spark to plan and run the whole chain; that is also when a bad column name would finally error.` }
        ],
        answer: `<p>No. <code>filter</code> and <code>select</code> are <b>transformations</b>, so they are lazy &mdash; they only added two steps to the DAG and computed nothing, which is why it returned in milliseconds. The actual reading and filtering happen later, on the first <b>action</b> such as <code>df2.show()</code>, <code>df2.count()</code>, or <code>df2.write(...)</code>. A latent error (say a misspelled column) would also only surface then, not now.</p>`
      },
      {
        q: `In a loop you do <code>for c in countries: print(df.filter(df.country==c).count())</code> on the same large uncached <code>df</code>, and it is painfully slow. Why, and what one change fixes most of it?`,
        steps: [
          { do: `Note that <code>count()</code> is an action and the loop calls it once per country.`, why: `Each action re-executes the <i>entire</i> plan from the original source &mdash; the read is repeated every iteration.` },
          { do: `Realize <code>df</code> is uncached, so nothing from the previous pass is reused.`, why: `Without caching, Spark re-reads and re-computes the base DataFrame on every single action.` },
          { do: `Cache the shared frame once before the loop: <code>df.cache(); df.count()</code> to materialize it, then loop.`, why: `The first action populates the cache; later filters read from memory instead of re-scanning the source.` }
        ],
        answer: `<p>Each <code>count()</code> is an <b>action</b>, and every action re-runs the whole plan from the source &mdash; so an uncached <code>df</code> is fully re-read on every loop iteration. The fix is to <b>cache</b> the shared frame once: <code>df.cache()</code> then a single <code>df.count()</code> to materialize it, after which the per-country filters read from memory. (Better still, do it in one pass: <code>df.groupBy("country").count()</code>, a single action.)</p>`
      },
      {
        q: `Reading a query plan from <code>.explain()</code> for <code>df.filter(...).groupBy("region").agg(...)</code>, you see one <code>Exchange hashpartitioning(region, 200)</code> node. How many stages does this job have, and which transformation is narrow vs wide?`,
        steps: [
          { do: `Recall that Spark splits a job into stages at every shuffle boundary, and a shuffle appears as an <code>Exchange</code>.`, why: `One <code>Exchange</code> means exactly one shuffle, which cuts the job into two stages.` },
          { do: `Classify <code>filter</code>: each output partition comes from one input partition, no data moves.`, why: `That is the definition of a <b>narrow</b> transformation &mdash; it lives before the Exchange, in Stage 1.` },
          { do: `Classify <code>groupBy</code>: rows for the same region must be brought together across partitions.`, why: `That requires moving data across the cluster &mdash; a <b>wide</b> transformation, which is the Exchange itself.` }
        ],
        answer: `<p><b>Two stages.</b> The single <code>Exchange</code> is the one shuffle, and stages split at shuffle boundaries: Stage 1 is everything before it, Stage 2 everything after. The <code>filter</code> is <b>narrow</b> (each output partition comes from one input partition, no data movement) and lives in Stage 1; the <code>groupBy</code> is <b>wide</b> (it shuffles rows so each region lands together) and is exactly the <code>Exchange</code> that begins Stage 2.</p>`
      }
    ]
  });

  window.CODE["spark-transformations-actions"] = {
    lib: "PySpark",
    runnable: false,
    explain: `<p>This runs in <b>Google Colab</b> (local mode) after the setup cell does
      <code>!pip install pyspark</code> &mdash; it spins up a small single-machine Spark session, so there is no
      cluster needed. Watch the timing: the <b>transformations</b> (<code>filter</code>, <code>groupBy</code>,
      <code>agg</code>) return instantly and compute <b>nothing</b> &mdash; they only build the DAG (Directed
      Acyclic Graph). The first <b>action</b> (<code>show()</code>) is what triggers the whole computation.
      <code>.explain()</code> prints the plan; the <code>Exchange</code> line is the shuffle, i.e. the boundary
      between the narrow Stage 1 and the wide Stage 2. Open the Spark UI at the printed URL to see the same job
      split into stages and tasks. <code>runnable</code> is off because the in-browser engine has no JVM (Java
      Virtual Machine) / Spark.</p>`,
    code: `# Colab: !pip install pyspark   (run once in a setup cell)
import time
from pyspark.sql import SparkSession
from pyspark.sql import functions as F

spark = (SparkSession.builder
         .master("local[*]")            # local mode: one machine, all cores
         .appName("lazy-demo")
         .getOrCreate())
# Default is 200 shuffle partitions; keep it so the Exchange is easy to see.
spark.conf.set("spark.sql.shuffle.partitions", 200)

# --- Build a small DataFrame and spread it across 8 partitions -----------
rows = [(i, ["west", "east", "north", "south", "central"][i % 5], float(i % 100) - 20)
        for i in range(120_000)]
df = spark.createDataFrame(rows, ["id", "region", "amount"]).repartition(8)
print("input partitions:", df.rdd.getNumPartitions())   # -> 8

# --- TRANSFORMATIONS: all LAZY. Nothing runs here. ----------------------
t0 = time.time()
plan = (df
        .filter(F.col("amount") > 0)        # NARROW: per-partition, no shuffle
        .withColumn("amt2", F.col("amount") * 2)  # NARROW
        .groupBy("region")                  # WIDE: forces a SHUFFLE (Exchange)
        .agg(F.sum("amount").alias("total"),
             F.count("*").alias("n")))
print("built the plan in %.4fs (nothing computed yet)" % (time.time() - t0))
# -> a few milliseconds: Spark only recorded the recipe (the DAG).

# --- Read the plan: the Exchange is the shuffle = the stage boundary -----
plan.explain()
# Look for a line like:
#   *(2) HashAggregate(keys=[region], ...)
#   +- Exchange hashpartitioning(region, 200)   <-- SHUFFLE: end of Stage 1
#      +- *(1) HashAggregate(...)                <-- partial agg, Stage 1
#         +- *(1) Filter (amount > 0)            <-- NARROW, Stage 1
#            +- Scan ...                          (read)

# --- ACTION: NOW the whole DAG runs as a job -> 2 stages -> tasks --------
t0 = time.time()
plan.show()                                 # show() is an ACTION: triggers compute
print("action ran the job in %.3fs" % (time.time() - t0))
# In the Spark UI (printed URL, /jobs tab) this job shows:
#   Stage 1 = 8 map tasks   (one per input partition, narrow filter+partial agg)
#   --- shuffle / Exchange ---
#   Stage 2 = up to 200 reduce tasks (one per shuffle partition; only 5 non-empty)

# --- PITFALL: a second action re-runs the WHOLE plan from scratch --------
plan.count()        # re-reads + re-shuffles everything again, no reuse!
# Fix: cache the shared result once, materialize it, then reuse.
cached = plan.cache()
cached.count()      # first action populates the cache
cached.show()       # this one reads from memory, not a full re-compute

print(spark.sparkContext.uiWebUrl)          # open the Spark UI here
spark.stop()`
  };

  window.CODEVIZ["spark-transformations-actions"] = {
    question: "How do you READ a Spark stage/task picture? Where is the shuffle, why is one job two stages and another four, and how do you spot a skewed reducer or a job that needs no shuffle at all?",
    charts: [
      {
        type: "bars",
        title: "Healthy 2-stage job: filter (narrow) then groupBy (one shuffle)",
        labels: ["Stage 1 map tasks", "Stage 2 reduce tasks", "(of those, non-empty)"],
        values: [8, 200, 5],
        valueLabels: ["8", "200", "5"],
        colors: ["#7ee787", "#9aa7b4", "#ffb454"],
        interpret: "Each bar is a count of <b>tasks</b> (the unit of work, one task per partition). Read it left to right as the job runs. Stage 1 is the <b>narrow</b> filter: <b>8 map tasks</b>, exactly one per input partition, all in parallel, no data crossing the network. Then the <b>one shuffle</b> (the groupBy's Exchange) ends Stage 1 and opens Stage 2, which has Spark's default <b>200</b> shuffle partitions = up to 200 reduce tasks. Only <b>5</b> are orange because there are 5 regions; the other 195 are empty and finish instantly. <b>Take-away:</b> one Exchange means exactly two stages, and a wall of mostly-empty reduce tasks is normal, not a bug."
      },
      {
        type: "bars",
        title: "Data MOVED across the cluster (MB): narrow shuffles nothing, wide shuffles the survivors",
        labels: ["filter (NARROW)", "groupBy (WIDE, shuffle)"],
        values: [0.0, 201.6],
        valueLabels: ["0.0", "201.6"],
        colors: ["#7ee787", "#ff7b72"],
        interpret: "Height = megabytes sent over the network. Green <b>filter</b> moves <b>0 MB</b>: a narrow step works on the rows each machine already holds. Red <b>groupBy</b> moves <b>~201.6 MB</b> — the ~8.4M rows that survive the filter (~70% of 12M) are re-sent so every region lands on one machine. <b>How to read it:</b> the tall red bar is where your time goes. When a Spark job is slow, find the wide step (every <code>Exchange</code> in the plan) — that, not the narrow steps, is the cost. Real computed numbers."
      },
      {
        type: "bars",
        title: "SKEW: same shuffle, but one key is huge — read the per-reducer load",
        labels: ["reducer A", "reducer B", "reducer C", "reducer D (hot key)", "reducer E"],
        values: [60, 55, 48, 1300, 52],
        valueLabels: ["60", "55", "48", "1300", "52"],
        colors: ["#7ee787", "#7ee787", "#7ee787", "#ff7b72", "#7ee787"],
        interpret: "Illustrative. Each bar is the row count handled by one non-empty reduce task in Stage 2. Healthy shuffles look <b>even</b> — all bars about the same height. Here reducer D towers over the rest: one group key (say a default <code>region='unknown'</code> holding most rows) all hashed to a single task. <b>How to recognise it:</b> in the Spark UI the stage shows one task with a far larger 'Shuffle Read' and a far longer duration while 199 others finished. The whole stage waits on that one straggler. <b>Fix:</b> salt the hot key, filter the junk value, or use adaptive skew-join handling."
      },
      {
        type: "bars",
        title: "SHUFFLE-HEAVY: groupBy then join then orderBy = 3 Exchanges = 4 stages",
        labels: ["Stage 1 (read+filter)", "Stage 2 (after groupBy)", "Stage 3 (after join)", "Stage 4 (after orderBy)"],
        values: [8, 200, 200, 200],
        valueLabels: ["8", "200", "200", "200"],
        colors: ["#7ee787", "#ff7b72", "#ff7b72", "#ff7b72"],
        interpret: "Illustrative. Bars are tasks per stage; the count of bars is the count of <b>stages</b>. Three wide steps (groupBy, join, orderBy) each add an <code>Exchange</code>, so the job has <b>3 shuffles and 4 stages</b> — three red shuffle boundaries instead of one. <b>How to read a plan like this:</b> count the <code>Exchange</code> lines in <code>.explain()</code> — that many shuffles, plus one, equals the stage count. Each red boundary is a full re-shuffle of the data. <b>Fix direction:</b> broadcast the small side of the join, or reorder so you shuffle once, to collapse red bars."
      },
      {
        type: "bars",
        title: "NARROW-ONLY: filter+select+withColumn = 1 stage, ZERO shuffle",
        labels: ["Stage 1 only (8 tasks)"],
        values: [8],
        valueLabels: ["8"],
        colors: ["#7ee787"],
        interpret: "Illustrative. The ideal case: a chain of only <b>narrow</b> steps (filter, select, withColumn) has <b>no Exchange at all</b>, so it is a single stage of 8 tasks — one per input partition — and <b>0 MB</b> cross the network. <b>How to recognise it:</b> <code>.explain()</code> shows no <code>Exchange</code> line; the Spark UI shows one stage. This is what you are steering toward — push filters early and avoid needless groupBy/join/distinct/orderBy so the job stays a flat, all-green, shuffle-free pass."
      }
    ],
    caption: "How to read these: bar height is a task or row count, bar colour flags healthy (green) vs costly/problem (red/orange). The first two charts are the real worked job (12M rows, 8 partitions, filter+groupBy); the last three are illustrative variants you will meet — a skewed reducer, a 3-shuffle chain, and a clean shuffle-free job — each labelled in its own interpret.",
    code: `import numpy as np

# --- Job shape: a 12M-row table in 8 input partitions -------------------
N        = 12_000_000     # total rows
P_in     = 8              # input partitions  -> Stage 1 has one map task each
shuffle_p = 200           # spark.sql.shuffle.partitions (Spark default)
regions  = 5              # distinct group keys -> only this many non-empty reducers
pass_rate = 0.70          # fraction of rows surviving filter(amount > 0)

# --- Stage / task counts (stages split at the shuffle boundary) ----------
stage1_tasks   = P_in                 # NARROW filter: one task per input partition
stage2_tasks   = shuffle_p            # one reduce task per shuffle partition
nonempty_reduce = regions             # only the keys that exist do real work
print("Stage 1 map tasks   :", stage1_tasks)    # -> 8
print("Stage 2 reduce tasks :", stage2_tasks)   # -> 200
print("  ... non-empty      :", nonempty_reduce) # -> 5

# --- Data moved: narrow shuffles nothing, wide shuffles the survivors ----
rows_after_filter = int(N * pass_rate)           # -> 8,400,000 rows survive
bytes_per_row     = 24                            # region key + partial sum, approx
narrow_moved_mb   = 0.0                           # filter is per-partition: 0 network
wide_moved_mb     = rows_after_filter * bytes_per_row / 1e6
print("rows after filter   :", rows_after_filter)        # -> 8,400,000
print("narrow moved (MB)   :", round(narrow_moved_mb, 1)) # -> 0.0
print("wide   moved (MB)   :", round(wide_moved_mb, 1))   # -> 201.6
# Stage/task bars: [8, 200, 5]   Data-moved bars: [0.0, 201.6]`
  };
})();
