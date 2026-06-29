/* Apache Spark — "The Spark ecosystem: where Spark runs, Delta Lake, and when to use it".
   Self-contained: lesson + CODE + CODEVIZ merged by id "spark-ecosystem". */
(function () {
  window.LESSONS.push({
    id: "spark-ecosystem",
    title: "The Spark ecosystem: where Spark runs, Delta Lake, and when to actually use it",
    tagline: "How Spark runs in the real world — local, Databricks, EMR, Dataproc — plus Delta Lake for a reliable data lake, and the judgment of when a simpler tool wins.",
    module: "Apache Spark",
    prereqs: ["dw-big-data"],

    whenToUse:
      `<p><b>This lesson is the map, not the engine.</b> It is about three real-world questions: <i>where</i> does
       Spark run, <i>how</i> do you give a data lake the reliability of a database (Delta Lake), and the most
       important one &mdash; <i>should you use Spark at all</i>, or would a simpler tool be faster and cheaper?</p>
       <ul>
         <li><b>Pick where Spark runs.</b> <b>Local mode</b> (your laptop or a Google Colab virtual machine) for
         learning and small jobs; a <b>managed platform</b> &mdash; Databricks, Amazon Web Services Elastic
         MapReduce (AWS EMR), or Google Cloud Dataproc &mdash; for real clusters; and underneath, a <b>cluster
         manager</b> (YARN, Kubernetes, or Spark Standalone) that hands out the machines.</li>
         <li><b>Make a data lake reliable.</b> Reach for <b>Delta Lake</b> when a pile of Parquet files in cloud
         storage has turned into a "data swamp" &mdash; half-written files, no schema enforcement, no way to undo
         a bad load. Delta adds database-style transactions on top of those same files.</li>
         <li><b>Choose the right tool at all.</b> Reach for Spark only when the data genuinely will not fit one
         big machine, or you need its ecosystem. Below ~100 GB, single-node tools like <b>DuckDB</b> or
         <b>Polars</b> are usually <i>faster</i> and far simpler. This judgment is the whole point.</li>
       </ul>
       <p>Cross-link: <code>dw-big-data</code> covers the cheap single-machine moves (dtypes, chunking, Parquet,
       Polars) you should exhaust <i>before</i> any of this.</p>`,

    application:
      `<p>Where these choices show up in practice:</p>
       <ul>
         <li><b>A team standing up its first data platform.</b> The decision is rarely "Spark yes/no" in a vacuum
         &mdash; it is "we already pay for Databricks / we are an AWS shop / we live in BigQuery," and the existing
         platform usually decides for you.</li>
         <li><b>Productionizing a notebook.</b> Code that ran in Colab local mode now has to run nightly on a real
         cluster. The same PySpark runs; what changes is the launch command and the cluster manager (YARN on EMR,
         Kubernetes on a modern stack).</li>
         <li><b>Fixing a data swamp.</b> A lake of raw Parquet that nobody trusts &mdash; partial writes, drifting
         schemas, no history. Converting it to <b>Delta</b> buys atomic writes, schema enforcement, time travel,
         and upserts (the <code>MERGE</code> statement).</li>
         <li><b>The "do we even need Spark?" review.</b> A 30 GB nightly aggregation running on a 10-node cluster
         that a single DuckDB query on one fat machine would finish faster, for a fraction of the cost.</li>
       </ul>`,

    pitfalls:
      `<ul>
         <li><b>Reaching for Spark when one big machine would win.</b> The classic over-engineering: a cluster for
         data that <b>DuckDB</b> or <b>Polars</b> on a single large box would chew through faster, with no cluster
         to babysit. Up to roughly 100 GB, single-node is usually the right answer. Fix: size the data honestly,
         try the simple tool first, and only graduate to Spark when it genuinely cannot fit or finish on one node.</li>
         <li><b>A data "swamp" with no transactions.</b> Dumping raw Parquet into cloud storage with no schema
         enforcement and no atomicity leads to half-written files, columns that silently change type, and no way
         to undo a bad load. Fix: write a <b>Delta Lake</b> table instead of bare Parquet &mdash; you get atomic,
         all-or-nothing writes (ACID: Atomicity, Consistency, Isolation, Durability), schema enforcement, and time
         travel to roll back.</li>
         <li><b>Vendor lock-in.</b> Leaning on one platform's proprietary features (a closed table format, a
         bespoke notebook runtime) can strand your data. Fix: prefer open formats &mdash; Parquet, and open-source
         Delta Lake or Apache Iceberg &mdash; so the data stays portable across Databricks, EMR, and Dataproc.</li>
         <li><b>Leaving the cluster running.</b> A cloud cluster bills by the minute whether or not it is doing
         work. An idle cluster left up overnight is pure waste. Fix: enable auto-termination / auto-scaling, or use
         job clusters that spin up for one run and shut down after.</li>
         <li><b>Tiny-cluster overhead.</b> On small data, Spark is often <i>slower</i> than pandas: starting a
         Java Virtual Machine (JVM), planning the job, and shuffling across the network cost more than the work
         itself. Fix: do not pay distributed overhead for data that fits in memory.</li>
         <li><b>Ignoring the data-warehouse option.</b> If the data already lives in BigQuery or Snowflake, a plain
         SQL query there may beat spinning up Spark entirely. Fix: check whether a warehouse query answers the
         question before reaching for a cluster.</li>
       </ul>`,

    bigIdea:
      `<p>Spark is an <b>engine</b>, but in the real world it always runs <i>inside</i> something, reads from
       <i>somewhere</i>, and competes with <i>other tools</i>. Understanding the ecosystem is three layers.</p>
       <p><b>Layer 1 &mdash; where the engine runs.</b> At the bottom is a <b>cluster manager</b> that owns the
       machines and hands Spark workers their share:</p>
       <ul>
         <li><b>Local mode</b> (<code>master("local[*]")</code>) &mdash; one machine, one JVM pretending to be a
         cluster, using all its cores. This is what Colab and your laptop run. Perfect for learning; no real
         distribution.</li>
         <li><b>Standalone</b> &mdash; Spark's own built-in manager for a small dedicated cluster.</li>
         <li><b>YARN (Yet Another Resource Negotiator)</b> &mdash; the classic Hadoop cluster manager, still common
         on AWS EMR and on-prem Hadoop.</li>
         <li><b>Kubernetes</b> &mdash; the modern container orchestrator; increasingly the default for new Spark
         deployments.</li>
       </ul>
       <p>On top of those sit <b>managed platforms</b> so you do not operate the cluster yourself:
       <b>Databricks</b> (the company founded by Spark's creators; its free <b>Community Edition</b> is a great
       place to learn), <b>AWS EMR</b>, and <b>Google Cloud Dataproc</b>. You write the same PySpark; the platform
       provisions the machines.</p>
       <p><b>Layer 2 &mdash; where the data lives, and the Lakehouse.</b> Spark reads columnar files &mdash;
       <b>Parquet</b> or <b>ORC (Optimized Row Columnar)</b> &mdash; from a <b>data lake</b> (cheap cloud object
       storage). A <b>catalog / metastore</b> (the Hive metastore, AWS Glue, or Databricks Unity Catalog) records
       which files make up which table, so you can write <code>SELECT * FROM sales</code> instead of naming file
       paths. The problem: a raw pile of Parquet has <i>no transactions</i>. <b>Delta Lake</b> (and its cousin
       Apache Iceberg) fixes this by adding a transaction log on top of the same Parquet files, giving a data lake
       the reliability of a warehouse &mdash; the "<b>Lakehouse</b>."</p>
       <p><b>Layer 3 &mdash; whether to use Spark at all.</b> Spark earns its keep when data does not fit one
       machine, when you need streaming, or when your platform is already Spark. It loses to <b>DuckDB / Polars</b>
       on data up to ~100 GB (single-node, often faster, far simpler), to a <b>data warehouse</b> when the data
       already lives there, and to <b>Apache Flink</b> for true low-latency streaming.</p>`,

    buildup:
      `<p>Build the picture from the storage up.</p>
       <p><b>Files and the catalog.</b> A data lake is just files in object storage (Amazon Simple Storage Service,
       S3; or Google Cloud Storage). <b>Parquet</b> and <b>ORC</b> are columnar, compressed formats &mdash; great
       for analytics because a query can read just the columns it needs (column pruning) and skip row blocks that
       cannot match a filter (predicate pushdown). A <b>metastore</b> maps a friendly table name to those files
       plus their schema, so SQL works.</p>
       <p><b>What a raw lake lacks &mdash; the swamp.</b> Bare Parquet has no concept of a transaction. If a write
       job dies halfway, readers see a half-written table. Two writers can clobber each other. A column's type can
       drift load-to-load with nothing to stop it. There is no history, so a bad load cannot be undone. This is the
       "data swamp."</p>
       <p><b>Delta Lake &mdash; a transaction log on top of Parquet.</b> Delta keeps the data as ordinary Parquet
       but adds a <code>_delta_log/</code> directory of <b>ordered JSON commits</b>. Each commit lists exactly which
       Parquet files are part of the table <i>as of that version</i>. From that one idea you get:</p>
       <ul>
         <li><b>ACID transactions.</b> A write is one atomic commit &mdash; readers see the old version or the new
         one, never a half-written mess.</li>
         <li><b>Schema enforcement.</b> A write whose columns do not match the table schema is <i>rejected</i>, not
         silently absorbed.</li>
         <li><b>Time travel.</b> Because every version is recorded, you can read the table <i>as of</i> an older
         version (<code>option("versionAsOf", 0)</code>) to audit or roll back.</li>
         <li><b>Upserts with <code>MERGE</code>.</b> "Update the row if its key exists, otherwise insert it" in one
         atomic statement &mdash; the operation a raw Parquet lake simply cannot do safely.</li>
       </ul>
       <p><b>The launch story.</b> The exact same PySpark runs everywhere; only how you start the session differs.
       Local: <code>master("local[*]")</code> after <code>pip install pyspark</code>. Databricks / EMR / Dataproc:
       the platform creates the cluster and the <code>spark</code> session for you, and submits jobs with a console,
       a <code>spark-submit</code> command, or a scheduler.</p>
       <p><b>The decision.</b> Four factors decide Spark vs an alternative: <b>data size</b> (does it fit one
       machine?), <b>team skills</b> (do you already run Spark?), <b>batch vs streaming</b> (Flink wins true
       streaming), and <b>existing platform</b> (already in BigQuery? already on Databricks?). When in doubt and the
       data is under ~100 GB, start with DuckDB or Polars.</p>`,

    symbols: [],

    derivation:
      `<p><b>Why one ordered log of commits gives a file lake database-grade reliability.</b></p>
       <ul class="steps">
         <li>A Delta table is two things: a set of Parquet data files, and a <code>_delta_log/</code> folder of
         numbered commit files <code>00000.json</code>, <code>00001.json</code>, &hellip; Each commit records
         which files were <b>added</b> and which were <b>removed</b> at that version.</li>
         <li><b>Atomicity</b> falls out for free. A writer stages new Parquet files, then makes its changes visible
         by writing <b>one</b> new commit file. Until that single small file lands, readers see the previous
         version; the instant it lands, they see the new one. There is no in-between &mdash; so a job that crashes
         mid-write leaves the table untouched.</li>
         <li><b>Isolation</b> comes from the log being append-only and ordered. If two writers both try to create
         commit <code>00007.json</code>, only one wins; the loser must re-read the latest version and retry. That
         is optimistic concurrency control &mdash; the same trick a database uses.</li>
         <li><b>Time travel</b> is just "replay the log up to version $v$." Reading <code>versionAsOf 0</code> means
         "apply only commit <code>00000</code>," reconstructing exactly the file set that existed then. Nothing was
         deleted, so older versions remain readable until you explicitly vacuum them.</li>
         <li><b>Schema enforcement and <code>MERGE</code></b> ride on the same commit mechanism: the engine reads
         the current schema and file list from the log, validates or computes the change, and commits the result
         atomically &mdash; or rejects it. One log, and a file lake behaves like a transactional table.
         $\\blacksquare$</li>
       </ul>`,

    example:
      `<p>A tiny <code>customers</code> table to show the whole arc on one screen. We follow the
       <code>_delta_log/</code> commit by commit and watch the row count change.</p>
       <ul class="steps">
         <li><b>Write v0.</b> Start with two rows &mdash; <code>(1, "Ada", "NY")</code> and
         <code>(2, "Lin", "CA")</code> &mdash; with <code>df.write.format("delta").save(path)</code>. Commit
         <code>00000.json</code> lists the Parquet files for these 2 rows. Row count $=2$.</li>
         <li><b>Upsert with <code>MERGE</code>.</b> A daily feed of 2 rows arrives: <code>(2, "Lin", "WA")</code>
         (Lin moved) and <code>(3, "Ravi", "TX")</code> (new). Matching on <code>id</code>: id 2 already exists
         &rarr; <b>1 update</b> in place; id 3 is new &rarr; <b>1 insert</b>. Lands as commit
         <code>00001.json</code>. Row count $=2 - 0 \\text{ (no deletes)} + 1 \\text{ (insert)} = 3$.</li>
         <li><b>Time travel.</b> Read <code>option("versionAsOf", 0)</code> &rarr; replay only commit
         <code>00000</code> &rarr; the <i>original</i> 2 rows (Lin still in CA, no Ravi). The current read replays
         <code>00000</code>+<code>00001</code> &rarr; the merged 3 rows. Same path, two points in history, both
         queryable.</li>
       </ul>
       <table class="extable">
         <caption>The table at each Delta version. Same path; the commit log decides what you see.</caption>
         <thead><tr><th>version (commit)</th><th>id 1</th><th>id 2</th><th>id 3</th><th class="num">rows</th></tr></thead>
         <tbody>
           <tr><td class="row-h">v0 (00000.json)</td><td>Ada, NY</td><td>Lin, CA</td><td>&mdash;</td><td class="num">2</td></tr>
           <tr><td class="row-h">v1 (00001.json)</td><td>Ada, NY</td><td>Lin, WA</td><td>Ravi, TX</td><td class="num">3</td></tr>
           <tr><td class="row-h">read versionAsOf 0</td><td>Ada, NY</td><td>Lin, CA</td><td>&mdash;</td><td class="num">2</td></tr>
         </tbody>
       </table>
       <p>That single <code>MERGE</code> &mdash; 1 update + 1 insert, safe, atomic, undoable &mdash; is the thing a
       bare Parquet lake cannot give you, and it is why teams convert swamps to Delta.</p>`,

    practice: [
      {
        q: `A teammate wants to spin up a 12-node Spark cluster to run a nightly <code>GROUP BY</code> aggregation over a 40 GB Parquet dataset. The result is a small summary table. Is Spark the right call, and what would you suggest checking first?`,
        steps: [
          { do: `Size the data honestly: 40 GB of Parquet, and the job is a single group-by aggregation producing a small output.`, why: `40 GB comfortably fits the memory or fast local disk of one large cloud machine, so it does not <i>require</i> distribution.` },
          { do: `Try a single-node engine first: <code>DuckDB</code> (<code>SELECT region, SUM(amount) ... GROUP BY region</code> straight over the Parquet) or <code>Polars</code> lazy scan.`, why: `Below ~100 GB these are usually <i>faster</i> than Spark because they skip JVM startup, job planning, and network shuffles.` },
          { do: `Reserve Spark for when one machine genuinely cannot fit or finish the job, or when the team already runs everything on a Spark platform.`, why: `A cluster adds latency, cost, and operational overhead that small-to-mid data does not repay.` }
        ],
        answer: `<p>Probably not. 40 GB is squarely in <b>single-node territory</b>: a <b>DuckDB</b> or <b>Polars</b> query on one fat machine will likely run the aggregation <i>faster</i> than a 12-node Spark cluster, with no cluster to provision, pay for, or babysit. Spark's per-job overhead (JVM startup, planning, shuffle) only pays off when data truly exceeds one machine (roughly &gt;100 GB&ndash;TB scale) or when the team's whole platform is already Spark. Check the single-node path first; reach for the cluster only if it genuinely cannot fit or finish.</p>`
      },
      {
        q: `Your data lake is a directory of raw Parquet files. A nightly load occasionally fails halfway, leaving readers seeing a half-written table, and last week a column's type silently changed and corrupted a downstream report. Name the technology that fixes this and the two specific guarantees that solve these exact problems.`,
        steps: [
          { do: `Recognize the symptoms: partial writes visible to readers, and an unnoticed schema change. These are the hallmarks of a "data swamp" — raw Parquet with no transactions.`, why: `Bare Parquet has no atomic commit and no schema check, so a crashed write and a drifting type both slip through.` },
          { do: `Convert the table to <b>Delta Lake</b> (write <code>format("delta")</code> instead of bare Parquet).`, why: `Delta adds an ordered transaction log on top of the same Parquet files.` },
          { do: `Map each symptom to a guarantee: atomic commits for the half-write, schema enforcement for the type drift.`, why: `One transaction log gives both — a write is all-or-nothing, and a mismatched schema is rejected.` }
        ],
        answer: `<p>Use <b>Delta Lake</b>. The two guarantees: <b>ACID transactions / atomic commits</b> &mdash; a write becomes visible only as a single all-or-nothing commit, so a job that dies halfway leaves the previous version intact and readers never see a half-written table; and <b>schema enforcement</b> &mdash; a write whose column types do not match the table is <i>rejected</i> rather than silently absorbed, so the corrupting type change would have been blocked. As a bonus, Delta's <b>time travel</b> would have let you read the pre-corruption version to recover.</p>`
      },
      {
        q: `You loaded a Delta table yesterday (version 3). This morning a bad daily feed overwrote good rows (now version 4). The data is gone from the current table. How do you recover it, and what feature makes this possible?`,
        steps: [
          { do: `Read the table as of the known-good version: <code>spark.read.format("delta").option("versionAsOf", 3).load(path)</code>.`, why: `Delta's <b>time travel</b> reconstructs the exact file set described by version 3's commit — nothing was physically deleted.` },
          { do: `Write that older snapshot back as a new commit (or use <code>RESTORE TO VERSION AS OF 3</code>), creating version 5 with the good data.`, why: `Restoring is itself just another atomic commit, so it is safe and also undoable.` },
          { do: `Going forward, add schema enforcement / validation so a bad feed is rejected rather than committed.`, why: `Prevention beats recovery; Delta's schema enforcement can stop the next bad load.` }
        ],
        answer: `<p>Use <b>time travel</b>: read the table <code>option("versionAsOf", 3)</code> to get yesterday's good snapshot, then write it back (or <code>RESTORE TO VERSION AS OF 3</code>), which lands as a new version with the recovered rows. This works because Delta records <i>every</i> version in its transaction log and does not physically delete old data files until you explicitly vacuum &mdash; so any past version stays queryable and restorable. A raw Parquet lake, with no history, would have lost the rows for good.</p>`
      }
    ]
  });

  window.CODE["spark-ecosystem"] = {
    lib: "PySpark + delta",
    runnable: false,
    explain: `<p>The full Delta Lake arc on one tiny table: <b>write</b> a DataFrame as Delta, <b>read</b> it back,
      do an <b>upsert</b> (<code>MERGE</code>) through <code>DeltaTable</code>, and a <b>time-travel</b> read of the
      original version. This runs in Google Colab in <b>local mode</b>, but Delta needs the extra delta-spark package
      and a couple of Spark configs, so the session must be built with <code>configure_spark_with_delta_pip</code>
      &mdash; that is why <code>runnable</code> is off here (the in-browser engine has no JVM, and Delta needs config).
      The comments show the platform launch commands (Databricks / EMR / Dataproc), where the same code runs with no
      changes because the platform already wires Delta in.</p>`,
    code: `# Colab: !pip install pyspark delta-spark
from pyspark.sql import SparkSession
from delta import configure_spark_with_delta_pip, DeltaTable

# --- Build a LOCAL-MODE Spark session WITH Delta wired in -----------------
# (On Databricks/EMR/Dataproc you skip this — 'spark' is created for you with
#  Delta already configured. See the platform launch notes at the bottom.)
builder = (
    SparkSession.builder
    .master("local[*]")
    .appName("delta-demo")
    .config("spark.sql.extensions", "io.delta.sql.DeltaSparkSessionExtension")
    .config("spark.sql.catalog.spark_catalog",
            "org.apache.spark.sql.delta.catalog.DeltaCatalog")
)
spark = configure_spark_with_delta_pip(builder).getOrCreate()

path = "/tmp/customers_delta"

# --- 1. WRITE a DataFrame as a Delta table (version 0) --------------------
df0 = spark.createDataFrame(
    [(1, "Ada", "NY"), (2, "Lin", "CA")],
    ["id", "name", "state"],
)
df0.write.format("delta").mode("overwrite").save(path)   # bare Parquet + _delta_log/

# --- 2. READ it back ------------------------------------------------------
spark.read.format("delta").load(path).show()
# id | name | state
#  1 | Ada  | NY
#  2 | Lin  | CA

# --- 3. UPSERT via MERGE: update Lin (moved to WA), insert new Ravi -------
updates = spark.createDataFrame(
    [(2, "Lin", "WA"), (3, "Ravi", "TX")],
    ["id", "name", "state"],
)
delta_tbl = DeltaTable.forPath(spark, path)
(
    delta_tbl.alias("t")
    .merge(updates.alias("u"), "t.id = u.id")
    .whenMatchedUpdateAll()        # id 2 exists -> UPDATE in place
    .whenNotMatchedInsertAll()     # id 3 is new -> INSERT
    .execute()                     # one atomic commit -> version 1
)
spark.read.format("delta").load(path).orderBy("id").show()
# id | name | state
#  1 | Ada  | NY
#  2 | Lin  | WA   <- updated
#  3 | Ravi | TX   <- inserted

# --- 4. TIME TRAVEL: read the table AS OF version 0 -----------------------
old = spark.read.format("delta").option("versionAsOf", 0).load(path)
old.orderBy("id").show()
# id | name | state   (the ORIGINAL two rows — Lin still in CA, no Ravi)
#  1 | Ada  | NY
#  2 | Lin  | CA

# --- PLATFORM LAUNCH NOTES (same code, different "where it runs") ---------
# Local / Colab : pip install pyspark delta-spark  (the session built above)
# Databricks    : Delta is the DEFAULT format; 'spark' already exists.
#                 Free to learn on Databricks Community Edition.
# AWS EMR       : aws emr create-cluster --applications Name=Spark ;
#                 spark-submit --packages io.delta:delta-spark_2.12:<ver> job.py
# GCP Dataproc  : gcloud dataproc clusters create my-cl --region=us-central1 ;
#                 gcloud dataproc jobs submit pyspark job.py --cluster=my-cl
# Cluster manager underneath: YARN (EMR/Hadoop), Kubernetes (modern), or Standalone.`
  };

  window.CODEVIZ["spark-ecosystem"] = {
    question: "For one group-by aggregation, which tool wins — and does the answer flip as the data grows from 1 GB to 2 TB?",
    charts: [
      {
        type: "bars",
        title: "MID data (~50 GB): runtime in seconds by tool",
        labels: ["pandas", "DuckDB", "Polars", "Spark (10-node)", "warehouse"],
        values: [999, 35, 28, 22, 9],
        valueLabels: ["OOM/crash", "35", "28", "22", "9"],
        colors: ["#ff7b72", "#7ee787", "#7ee787", "#4ea1ff", "#c89bff"],
        interpret: "<b>The ideal/decision chart.</b> Each bar is one tool's wall-clock time for the SAME 50 GB group-by; shorter is better. <b>pandas</b> is red because 50 GB will not fit one machine's RAM — it crashes (the tall 'OOM' bar is a stand-in, not a real time). The single-node engines <b>DuckDB (35 s)</b> and <b>Polars (28 s)</b> rival or beat a 10-node <b>Spark</b> cluster (22 s), and a <b>warehouse</b> you already pay for (9 s) wins outright. Read it as: at this size you do NOT need a cluster — a single fat box, or a warehouse, is faster and far simpler."
      },
      {
        type: "bars",
        title: "SMALL data (~1 GB): Spark's overhead makes it the SLOWEST",
        labels: ["Polars", "DuckDB", "warehouse", "pandas", "Spark (10-node)"],
        values: [0.9, 1.0, 2.1, 3.2, 12.2],
        valueLabels: ["0.9", "1.0", "2.1", "3.2", "12.2"],
        colors: ["#7ee787", "#7ee787", "#c89bff", "#7ee787", "#ff7b72"],
        interpret: "<b>Variant: small data flips the answer (illustrative).</b> Same chart, 1 GB instead of 50 GB. Now everything single-node finishes in about a second, and <b>Spark is the slowest bar</b> (red) — its ~12 s is almost all fixed cost (start a JVM, plan the job, do a network shuffle) that it pays before any useful work. Recognise this shape — a cluster losing to a laptop — as the signature of using Spark on data that was never big enough to need it."
      },
      {
        type: "bars",
        title: "LARGE data (~2 TB): single-node tools fall over, Spark pays off",
        labels: ["warehouse", "Spark (10-node)", "DuckDB", "Polars", "pandas"],
        values: [282, 412, 999, 999, 999],
        valueLabels: ["282", "412", "OOM", "OOM", "OOM"],
        colors: ["#c89bff", "#7ee787", "#ff7b72", "#ff7b72", "#ff7b72"],
        interpret: "<b>Variant: large data flips it back (illustrative).</b> At 2 TB the three single-node tools (<b>pandas, DuckDB, Polars</b>) all run out of memory — red 'OOM' bars, no time at all. Only the scale-out options finish: the <b>warehouse</b> (282 s) and <b>Spark</b> (412 s) are now the green/healthy choices. This is the regime Spark was built for: its fixed overhead is a flat tax that finally disappears next to the size of the job."
      },
      {
        type: "line",
        title: "Crossover: runtime vs data size (log-log, illustrative)",
        xlabel: "data size (GB, log scale)",
        ylabel: "runtime (seconds, log scale)",
        series: [
          { name: "DuckDB/Polars (single-node)", color: "#7ee787", points: [[1, 1], [10, 7], [50, 31], [120, 84]] },
          { name: "Spark (10-node)", color: "#4ea1ff", points: [[1, 12], [10, 14], [50, 22], [500, 112], [2000, 412]] }
        ],
        interpret: "<b>Variant: why there's a crossover at all.</b> The x-axis is data size, the y-axis is runtime — both growing left-to-right. The <b>green single-node line starts low</b> (near-zero overhead) but climbs steeply and then STOPS at ~120 GB, where the tool runs out of RAM. The <b>blue Spark line starts high</b> (its fixed overhead) but stays nearly flat, so the two lines cross: below the crossing, single-node wins; above it (and past where green ends), only Spark keeps going. The whole 'when to use Spark' rule is just: pick the lower line for your data size."
      }
    ],
    caption: "Same group-by, four views. The first three bars show how the WINNER flips with data size (single-node at 1 GB, single-node/warehouse at 50 GB, scale-out at 2 TB); the line shows WHY — single-node has low overhead but a RAM ceiling, Spark has high fixed overhead but no ceiling. Rule of thumb: under ~100 GB prefer DuckDB/Polars on one big machine; reach for Spark or a warehouse only when the data truly exceeds one node. Numbers are a reproducible cost model, not a benchmark.",
    code: `import numpy as np
import pandas as pd

# A reproducible COST MODEL (not a real benchmark) that ILLUSTRATES where each
# tool wins for a group-by aggregation, by data size. Numbers are plausible.

# --- per-tool cost model: runtime(seconds) = fixed_overhead + per_GB * size ---
# fixed_overhead = startup/planning/shuffle; per_gb = throughput;
# ram_cap = data size (GB) above which a single-node tool runs out of memory.
tools = {
    #                fixed   per_gb   ram_cap(GB)
    "pandas":              (0.2,  3.00,   8),    # in-memory only, smallest cap
    "DuckDB":              (0.3,  0.70, 120),    # single-node, vectorized, fast
    "Polars":              (0.3,  0.55, 120),    # single-node, lazy, fast
    "Spark (10-node)":     (12.0, 0.20, 1e9),    # heavy startup, scales out
    "warehouse (BigQuery)":(2.0,  0.14, 1e9),    # managed, columnar, scales out
}

def runtime(name, size_gb):
    fixed, per_gb, cap = tools[name]
    if size_gb > cap:
        return np.inf                 # out-of-memory: cannot finish
    return fixed + per_gb * size_gb

sizes = {"small": 1, "mid": 50, "large": 2000}   # GB

# Print the full size x tool grid so the "who wins where" story is explicit.
print(f'{"tool":22s} {"small(1GB)":>11s} {"mid(50GB)":>11s} {"large(2TB)":>12s}')
for name in tools:
    row = []
    for s in sizes.values():
        t = runtime(name, s)
        row.append("OOM" if np.isinf(t) else f"{t:8.1f}s")
    print(f'{name:22s} {row[0]:>11s} {row[1]:>11s} {row[2]:>12s}')

# The plotted bars = the MID (50 GB) column (pandas OOM shown as a tall bar).
mid = {n: runtime(n, sizes["mid"]) for n in tools}
plotted = {n: (999 if np.isinf(t) else round(t)) for n, t in mid.items()}
print("\\nplotted (50 GB, OOM->999):", plotted)
# tool                    small(1GB)   mid(50GB)   large(2TB)
# pandas                       3.2s        OOM          OOM
# DuckDB                       1.0s       35.3s          OOM
# Polars                       0.9s       27.8s          OOM
# Spark (10-node)             12.2s       22.0s        412.0s
# warehouse (BigQuery)         2.1s        9.0s        282.0s
# plotted (50 GB, OOM->999): {'pandas': 999, 'DuckDB': 35, 'Polars': 28,
#                             'Spark (10-node)': 22, 'warehouse (BigQuery)': 9}`
  };
})();
