/* Apache Spark — "RDD: Spark's original low-level abstraction".
   Self-contained: lesson + CODE + CODEVIZ merged by id "spark-rdd". */
(function () {
  window.LESSONS.push({
    id: "spark-rdd",
    title: "RDD: the resilient distributed dataset",
    tagline: "Spark's original abstraction — an immutable, partitioned collection you transform lazily and process in parallel across a cluster.",
    module: "Apache Spark",
    prereqs: ["dw-big-data"],

    bigIdea:
      `<p>When data is too big for one machine, you spread it across many machines and process the pieces
       in parallel. Spark's first answer to "how do I hold and compute on that spread-out data" was the
       <b>RDD (Resilient Distributed Dataset)</b>. It is the foundation everything else in Spark is built on.</p>
       <p>Read the name one word at a time:</p>
       <ul>
         <li><b>Dataset</b> &mdash; it is a collection of records, like a Python list, but conceptually huge.</li>
         <li><b>Distributed</b> &mdash; the records are split into <b>partitions</b>, and each partition lives on
         a different machine (a "worker") in the cluster. The partition is the <b>unit of parallelism</b>: if you
         have 200 partitions and 50 cores, Spark works on 50 partitions at a time.</li>
         <li><b>Resilient</b> &mdash; if a machine dies and takes its partitions with it, Spark does not lose your
         data. It <b>recomputes</b> the lost partitions from a recorded recipe (the <b>lineage</b>), so it never
         had to keep extra copies around.</li>
       </ul>
       <p>An RDD is also <b>immutable</b>: you never change one in place. Every operation produces a <i>new</i> RDD.
       That immutability is exactly what makes the recompute-on-failure trick safe &mdash; the recipe always
       reproduces the same result.</p>
       <p>One more idea does most of the work: operations come in two flavors. <b>Transformations</b> (like
       <code>map</code> and <code>filter</code>) are <b>lazy</b> &mdash; they record what you want but run nothing.
       <b>Actions</b> (like <code>count</code> and <code>collect</code>) are what finally trigger the whole chain
       to execute. We will lean on this split throughout.</p>
       <p><b>One honest caveat up front.</b> Today you should usually reach for <b>DataFrames</b> instead of raw
       RDDs &mdash; they run faster because an optimizer rewrites your query (covered below). But DataFrames are
       built <i>on</i> RDDs, so understanding the RDD is understanding what Spark actually does underneath.</p>`,

    buildup:
      `<p>Build the picture from the bottom up.</p>
       <p><b>Partitions are the unit of parallelism.</b> An RDD of ten million records is not one blob; it is, say,
       200 chunks of ~50,000 records each. Spark schedules one <b>task</b> per partition. With 50 cores it runs 50
       tasks at once, finishes them, then runs the next 50. Too few partitions and most cores sit idle; too many
       tiny partitions and the per-task overhead dominates. Partition count is the main dial for parallelism.</p>
       <p><b>Transformations are lazy.</b> When you write <code>rdd.map(f).filter(g)</code>, Spark does <i>not</i>
       touch the data. It only appends two steps to a recipe. Common transformations:</p>
       <ul>
         <li><code>map(f)</code> &mdash; apply <code>f</code> to every record, one in, one out.</li>
         <li><code>filter(g)</code> &mdash; keep only records where <code>g</code> is true.</li>
         <li><code>flatMap(f)</code> &mdash; like <code>map</code>, but <code>f</code> returns a <i>list</i> per
         record and the lists are flattened into one stream. Splitting a line into its words is the classic use.</li>
         <li><code>reduceByKey(op)</code> &mdash; on an RDD of <code>(key, value)</code> pairs, combine all values
         sharing a key with <code>op</code> (e.g. add them). This is how you total counts per word.</li>
       </ul>
       <p><b>Actions trigger the work.</b> Nothing in that recipe runs until you ask for a concrete result with an
       <b>action</b>:</p>
       <ul>
         <li><code>collect()</code> &mdash; pull every record back to the driver as a Python list (careful: see pitfalls).</li>
         <li><code>count()</code> &mdash; return how many records there are.</li>
         <li><code>take(n)</code> &mdash; return just the first <code>n</code> records (cheap; stops early).</li>
         <li><code>reduce(op)</code> &mdash; fold the whole RDD down to a single value with <code>op</code>.</li>
       </ul>
       <p><b>Lineage gives fault tolerance for free.</b> Because every transformation is recorded, an RDD knows its
       full ancestry: "I am the result of <code>reduceByKey</code> applied to a <code>map</code> applied to a
       <code>flatMap</code> applied to <i>this</i> file." That recorded chain is the <b>lineage</b> (a
       <b>DAG, Directed Acyclic Graph</b> &mdash; a one-way flow of steps with no cycles). If a worker dies, Spark
       does not need a backup copy of the lost partition; it just replays the lineage <i>for that partition only</i>
       and rebuilds it. No replication, no extra storage &mdash; resilience comes from the recipe.</p>`,

    symbols: [],

    derivation:
      `<p><b>Why "recompute from lineage" beats "keep replicas," and why laziness is what makes it possible.</b></p>
       <ul class="steps">
         <li><b>The naive way to survive a failure is replication:</b> store every partition on, say, three
         machines, so if one dies two copies remain. That triples your storage and your write traffic. For a
         100 TB intermediate result, that is 200 extra TB you are shuffling around just in case.</li>
         <li><b>Spark's bet is different.</b> An RDD does not store backup copies of its partitions. It stores the
         <b>lineage</b>: the exact, deterministic sequence of transformations that produced it from durable input
         (a file on disk, in HDFS or cloud storage). The lineage is tiny &mdash; a handful of function objects and
         pointers &mdash; not a copy of the data.</li>
         <li><b>Failure recovery is local.</b> When the machine holding partition 73 dies, Spark looks at the
         lineage, finds the inputs partition 73 was computed from, and reruns <i>only those steps for that one
         partition</i> on another machine. The other 199 partitions are untouched. You pay to rebuild one
         partition, not to have stored 200 spare ones.</li>
         <li><b>This only works because transformations are deterministic and the data is immutable.</b> Replaying
         <code>map(f)</code> tomorrow on the same input gives byte-for-byte the same partition as today. If you
         could mutate an RDD in place, the recipe would no longer reproduce the current state &mdash; so
         immutability is not a stylistic choice, it is what makes lineage-based recovery correct.</li>
         <li><b>And laziness is what lets Spark see the whole recipe at once.</b> Because transformations only
         record intent, by the time you call an action Spark holds the <i>entire</i> chain. It can fuse steps that
         do not need a shuffle into one pass over each partition, schedule tasks per partition, and know exactly
         what to replay on failure. Eager, one-at-a-time execution would throw that whole-plan view away.
         $\\blacksquare$</li>
       </ul>`,

    example:
      `<p><b>Word count &mdash; the "hello world" of distributed data.</b> Count how often each word appears across
       a large body of text, expressed entirely as RDD steps.</p>
       <ul class="steps">
         <li><b>Start</b> with an RDD of text lines (one record per line), spread across partitions.</li>
         <li><code>flatMap(lambda line: line.split())</code> &mdash; turn each line into its words and flatten, so
         now every record is a single <b>word</b>.</li>
         <li><code>map(lambda w: (w, 1))</code> &mdash; turn each word into a pair <code>(word, 1)</code>, a vote of
         "I saw this word once."</li>
         <li><code>reduceByKey(lambda a, b: a + b)</code> &mdash; add up all the 1's that share the same word, giving
         <code>(word, total)</code>.</li>
         <li><b>Nothing has run yet</b> &mdash; all four steps are lazy transformations; we have only built a recipe.</li>
         <li><code>.take(5)</code> (an action) finally triggers it: Spark runs the chain and returns the first five
         <code>(word, count)</code> pairs. On the famous opening of <i>A Tale of Two Cities</i> (60 words), the top
         counts come back as <code>("it", 10)</code>, <code>("was", 10)</code>, <code>("the", 10)</code>,
         <code>("of", 10)</code> &mdash; then <code>("times", 2)</code>, <code>("age", 2)</code>, and so on. The
         CODEVIZ below plots exactly these numbers.</li>
       </ul>
       <p>Notice the shape: <code>flatMap &rarr; map &rarr; reduceByKey</code> is the canonical
       split &rarr; emit-pairs &rarr; combine-by-key pattern, and it is the same shape behind countless real
       aggregations.</p>`,

    whenToUse:
      `<p><b>Prefer DataFrames for everyday work. Drop down to raw RDDs only when you genuinely need the low-level
       control.</b></p>
       <ul>
         <li><b>Low-level control over execution.</b> When you need to operate on partitions directly
         (<code>mapPartitions</code>), control exactly how records are combined, or implement an algorithm that does
         not map cleanly onto relational operations.</li>
         <li><b>Unstructured or non-tabular data.</b> Raw text, binary blobs, log lines, nested objects, custom
         record types &mdash; data that has no clean schema of columns. DataFrames want columns; RDDs hold anything.</li>
         <li><b>Custom partitioning.</b> When you want to control how keys are distributed across partitions
         (a custom <code>partitionBy</code>) to co-locate related records and cut shuffles.</li>
         <li><b>Understanding the engine.</b> Even if you write only DataFrames, knowing RDDs explains <i>why</i>
         a job has the stages it has, where the shuffles are, and what "recompute the lost partition" means.</li>
         <li><b>But for structured, columnar data &mdash; the common case &mdash; use a DataFrame.</b> You get the
         <b>Catalyst</b> optimizer (it rewrites your query) and the Tungsten engine (compact memory layout) for free,
         and DataFrame code is usually shorter and clearer too. See the related lesson <i>dw-big-data</i> for the
         single-machine ladder (downcast, chunk, Parquet, Polars) you should climb <b>before</b> reaching for a
         cluster at all.</li>
       </ul>`,

    application:
      `<p>RDDs (and the DataFrames built on them) power the heavy-data layer of modern systems.</p>
       <ul>
         <li><b>ETL (Extract, Transform, Load) at scale.</b> Read terabytes of raw logs, clean and reshape them,
         write the result to a warehouse &mdash; the bread and butter of data engineering, where RDD-style
         <code>flatMap</code>/<code>filter</code>/<code>reduceByKey</code> on messy text still shows up.</li>
         <li><b>Large joins and aggregations.</b> Totaling events per user across billions of rows, joining a giant
         fact table to a dimension table &mdash; work that does not fit on one machine.</li>
         <li><b>Machine learning at scale.</b> Spark's MLlib was built on RDDs; distributed feature extraction and
         model training over huge corpora lean on the same partition-and-combine pattern.</li>
         <li><b>Custom text and graph processing.</b> Tokenizing and counting over a web-scale text dump, or graph
         algorithms (GraphX) where records are vertices and edges rather than tidy table rows.</li>
       </ul>`,

    pitfalls:
      `<ul>
         <li><b>Forgetting transformations are lazy.</b> You write a long chain of <code>map</code>/<code>filter</code>
         and wonder why "nothing happened" &mdash; or why an error only surfaces much later. Nothing runs until an
         <b>action</b> (<code>count</code>, <code>collect</code>, <code>take</code>, <code>reduce</code>). Fix: know
         which calls are actions; expect work (and errors) to appear there, not at the transformation.</li>
         <li><b><code>collect()</code> on a huge RDD melts the driver.</b> <code>collect()</code> pulls <i>every</i>
         record back to the single driver machine; on a billion-row RDD that is an out-of-memory crash. Fix: use
         <code>take(n)</code> to peek, <code>count()</code> for a size, or write results to storage with
         <code>saveAsTextFile</code>. Only <code>collect()</code> when you are sure the result is small.</li>
         <li><b>Wide transformations shuffle a lot &mdash; and <code>groupByKey</code> is the worst offender.</b>
         A <b>shuffle</b> moves data across the network to regroup it by key, and it is the expensive part of any
         Spark job. <code>groupByKey</code> ships every raw value across the network before combining; on skewed or
         large data it floods one machine. Fix: prefer <code>reduceByKey</code> (or <code>aggregateByKey</code>),
         which combines values <i>locally on each partition first</i> and only shuffles the small partial results.</li>
         <li><b>RDDs miss the Catalyst optimizer, so they are slower than DataFrames.</b> Spark cannot see "inside"
         your Python lambdas, so it cannot reorder filters, prune columns, or pick a better join &mdash; it runs your
         steps exactly as written. A DataFrame doing the same logic is often several times faster. Fix: use
         DataFrames for structured data; reserve RDDs for the cases above where you truly need them.</li>
         <li><b>Too few or too many partitions.</b> Too few and most of the cluster sits idle; too many tiny ones
         and scheduling overhead dominates. Fix: check <code>rdd.getNumPartitions()</code>, and
         <code>repartition</code>/<code>coalesce</code> toward a sensible count (a small multiple of total cores).</li>
       </ul>`,

    practice: [
      {
        q: `You run <code>counts = lines.flatMap(lambda l: l.split()).map(lambda w: (w, 1)).reduceByKey(lambda a, b: a + b)</code> and the cell returns instantly with no output. Did Spark count the words? What is the next line you write to actually get answers?`,
        steps: [
          { do: `List which calls are transformations and which is an action.`, why: `<code>flatMap</code>, <code>map</code>, and <code>reduceByKey</code> are all <b>transformations</b> &mdash; they are lazy and only record a recipe.` },
          { do: `Realize the chain built a new RDD but ran nothing, because no action was called.`, why: `Spark executes only when an action demands a concrete result; until then there is nothing to do.` },
          { do: `Add an action, e.g. <code>counts.take(5)</code> or <code>counts.collect()</code> (if small) or <code>counts.count()</code>.`, why: `An action triggers the whole lineage to run and materializes results.` }
        ],
        answer: `<p>No &mdash; Spark counted nothing yet. <code>flatMap</code>, <code>map</code>, and <code>reduceByKey</code> are <b>lazy transformations</b>; the cell just built a new RDD and recorded the recipe, which is why it returned instantly. To force the work, call an <b>action</b>: <code>counts.take(5)</code> to peek at a few <code>(word, count)</code> pairs, <code>counts.count()</code> for the number of distinct words, or <code>counts.collect()</code> <i>only if</i> the result is small enough for the driver. The action is where the computation (and any hidden error) actually happens.</p>`
      },
      {
        q: `A teammate's job sums values per key with <code>pairs.groupByKey().mapValues(lambda vs: sum(vs))</code> and it is painfully slow and occasionally crashes one worker. What is going wrong, and what one-line change fixes it?`,
        steps: [
          { do: `Recognize <code>groupByKey</code> is a wide transformation that shuffles every raw value across the network.`, why: `It moves all values for a key to one machine <i>before</i> combining, so a hot key floods a single worker.` },
          { do: `Note the goal is just a per-key sum, which is associative.`, why: `An associative combine can be done partially on each partition first, then merged &mdash; no need to ship raw values.` },
          { do: `Replace with <code>pairs.reduceByKey(lambda a, b: a + b)</code>.`, why: `<code>reduceByKey</code> combines values locally on each partition first, so only small partial sums cross the network.` }
        ],
        answer: `<p><code>groupByKey</code> is the problem: it is a <b>wide transformation</b> that shuffles every raw value over the network and piles all of a key's values onto one machine before combining &mdash; slow, and a recipe for an out-of-memory crash on a skewed key. Since the operation is just an associative sum, switch to <code>pairs.reduceByKey(lambda a, b: a + b)</code>. <code>reduceByKey</code> does a <b>local combine on each partition first</b> (a "map-side combine"), so only one small partial sum per key per partition is shuffled. Same answer, far less data moved.</p>`
      },
      {
        q: `Midway through a long Spark job, a worker machine dies and takes several partitions with it. The job keeps running and still produces the correct result &mdash; no data was replicated anywhere. How is that possible, and what is the one requirement that makes it safe?`,
        steps: [
          { do: `Recall that each RDD records its <b>lineage</b> &mdash; the full chain of transformations from durable input.`, why: `The lineage is a tiny recipe (function objects + pointers), not a copy of the data.` },
          { do: `On failure, Spark replays the lineage for <i>only the lost partitions</i> on other machines.`, why: `Recovery is local: rebuild the few lost partitions, leave the rest untouched &mdash; no replicas needed.` },
          { do: `Note this requires transformations to be deterministic and the RDD to be immutable.`, why: `Replaying the recipe must reproduce the exact same partition; mutation would break that guarantee.` }
        ],
        answer: `<p>Spark survives the failure through <b>lineage</b>: every RDD records the exact, deterministic chain of transformations that built it from durable input (a file in HDFS or cloud storage). When the worker dies, Spark replays that recipe <i>for the lost partitions only</i> on surviving machines and rebuilds them &mdash; so it never needed replicated copies; resilience comes from recomputation, not redundancy. The one requirement that makes it safe is <b>determinism + immutability</b>: because transformations always reproduce the same output and RDDs are never mutated in place, replaying the lineage gives byte-for-byte the same partition every time.</p>`
      }
    ]
  });

  window.CODE["spark-rdd"] = {
    lib: "PySpark",
    runnable: false,
    explain: `<p>Real PySpark, written to run in <b>Google Colab</b> (local mode) after the setup cell does
      <code>!pip install pyspark</code>. We grab the <code>SparkContext</code>, <code>parallelize</code> a small
      list of text lines into an RDD (Resilient Distributed Dataset), and build the classic
      <code>flatMap &rarr; map &rarr; reduceByKey</code> word count. The key teaching beat: after the transformation
      chain, <b>nothing has run</b> (transformations are lazy) &mdash; it is only the <b>action</b>
      (<code>take</code>/<code>collect</code>) that triggers the work. We also print
      <code>getNumPartitions()</code> (the unit of parallelism) and <code>toDebugString()</code> (the recorded
      <b>lineage</b> Spark would replay to recover a lost partition). <code>runnable</code> is off because the
      in-browser engine has no Java Virtual Machine; run it in Colab.</p>`,
    code: `# Colab: !pip install pyspark   (the notebook's setup cell installs it)
from pyspark.sql import SparkSession

# local[*] = run Spark on this one Colab VM, using all its cores as "workers".
spark = SparkSession.builder.master("local[*]").appName("rdd-demo").getOrCreate()
sc = spark.sparkContext          # the SparkContext: the entry point for RDDs

# ---- Build an RDD (Resilient Distributed Dataset) from a Python list ----
# The opening of "A Tale of Two Cities" (public domain), one line per record.
lines = sc.parallelize([
    "It was the best of times it was the worst of times",
    "it was the age of wisdom it was the age of foolishness",
    "it was the epoch of belief it was the epoch of incredulity",
    "it was the season of Light it was the season of Darkness",
    "it was the spring of hope it was the winter of despair",
], numSlices=4)                  # split into 4 partitions = the unit of parallelism

print("partitions:", lines.getNumPartitions())   # -> 4

# ---- TRANSFORMATIONS (all LAZY: nothing runs here, just a recipe) ----
counts = (
    lines
      .flatMap(lambda line: line.lower().split())   # each line -> its words (flattened)
      .map(lambda w: (w, 1))                          # each word -> (word, 1)
      .reduceByKey(lambda a, b: a + b)                # add the 1's sharing a word
)
print("nothing has run yet -- counts is just a recipe:", type(counts).__name__)

# ---- ACTIONS (trigger the whole chain to actually execute) ----
top = counts.takeOrdered(5, key=lambda kv: -kv[1])   # action: top 5 by count
print("top 5:", top)            # [('it',10),('was',10),('the',10),('of',10),('times',2)]
print("distinct words:", counts.count())             # action: 20
print("first 3 (any order):", counts.take(3))        # action: cheap peek
# print(counts.collect())       # action: ALL pairs to driver -- fine here (tiny),
                                 # but NEVER on a huge RDD: it OOMs the driver.

# ---- LINEAGE: the recorded chain Spark replays to rebuild a lost partition ----
print(counts.toDebugString().decode())  # shows ShuffledRDD <- MapPartitionsRDD <- ... <- ParallelCollectionRDD

spark.stop()

# NOTE: for STRUCTURED data, prefer a DataFrame -- it gets the Catalyst optimizer
# (RDDs do not), so the same word count runs faster:
#   from pyspark.sql.functions import explode, split, lower, col
#   df = spark.createDataFrame([(l,) for l in lines.collect()], ["line"])
#   (df.select(explode(split(lower(col("line")), " ")).alias("w"))
#      .groupBy("w").count().orderBy(col("count").desc()).show(5))`
  };

  window.CODEVIZ["spark-rdd"] = {
    question: "What does the classic RDD word count (flatMap -> map -> reduceByKey) actually return? Here are the top word counts a Spark reduceByKey would produce on a small real text, computed reproducibly with a numpy/pandas word count.",
    charts: [
      {
        type: "bars",
        title: "Word count: top words by frequency (what reduceByKey returns)",
        labels: ["it", "was", "the", "of", "times", "age", "epoch", "season"],
        values: [10, 10, 10, 10, 2, 2, 2, 2],
        valueLabels: ["10", "10", "10", "10", "2", "2", "2", "2"],
        colors: ["#7ee787", "#7ee787", "#7ee787", "#7ee787", "#58a6ff", "#58a6ff", "#58a6ff", "#58a6ff"]
      }
    ],
    caption: "The classic word-count result on the 60-word opening of 'A Tale of Two Cities' (public domain). An RDD pipeline flatMap(split) -> map(w -> (w,1)) -> reduceByKey(add) produces exactly these (word, count) pairs; here the same numbers are computed reproducibly with a pandas value_counts (no Spark needed) to show what the distributed job returns. The four most frequent words ('it', 'was', 'the', 'of') each appear 10 times — the anaphora of the famous passage — then a long tail of words appearing twice ('times', 'age', 'epoch', 'season') and once. reduceByKey is preferred over groupByKey for exactly this: it combines the per-word 1's locally on each partition first, so only small partial counts cross the network.",
    code: `import re
import pandas as pd

# The famous 60-word opening of "A Tale of Two Cities" (public domain text).
text = '''It was the best of times, it was the worst of times,
it was the age of wisdom, it was the age of foolishness,
it was the epoch of belief, it was the epoch of incredulity,
it was the season of Light, it was the season of Darkness,
it was the spring of hope, it was the winter of despair.'''

# Same logic an RDD does (flatMap split -> map (w,1) -> reduceByKey add),
# expressed as a reproducible pandas word count:
words = re.findall(r'[a-z]+', text.lower())   # flatMap: lines -> words
counts = pd.Series(words).value_counts()      # map+reduceByKey: tally per word

print('total words :', len(words))            # -> 60
print('distinct    :', counts.size)           # -> 20
print(counts.head(8))
# it       10
# was      10
# the      10
# of       10
# times     2
# age       2
# epoch     2
# season    2

top = counts.head(8)
print('labels:', list(top.index))             # ['it','was','the','of','times','age','epoch','season']
print('values:', list(top.values))            # [10, 10, 10, 10, 2, 2, 2, 2]`
  };
})();
