/* Apache Spark — "Structured Streaming: unbounded data, batch API".
   Self-contained: lesson + CODE + CODEVIZ merged by id "spark-streaming". */
(function () {
  window.LESSONS.push({
    id: "spark-streaming",
    title: "Structured Streaming: process never-ending data with the batch API",
    tagline: "Treat a live stream as a table that keeps growing, run it in tiny micro-batches, and write almost the same code you'd write for batch.",
    module: "Apache Spark",
    prereqs: ["dw-timeseries-eda", "skill-monitoring"],

    bigIdea:
      `<p>Most data work assumes the data <b>sits still</b>: a file, a table, a frame you read once and crunch.
       <b>Streaming</b> data does not sit still &mdash; it <b>keeps arriving</b>, forever: clicks, payments,
       sensor readings, log lines, one after another with no end. The data is <b>unbounded</b> (it has no last
       row). You cannot wait for "all of it" before you start, because "all of it" never happens.</p>
       <p>Spark's <b>Structured Streaming</b> has one beautiful idea that makes this easy: <b>treat the stream as
       a table that never stops growing.</b> Every new event is a new row appended to the bottom of an
       <i>unbounded</i> table. Your job is just a query over that table &mdash; the same <code>select</code>,
       <code>filter</code>, <code>groupBy</code> you would write for a normal Spark DataFrame. Spark re-runs that
       query, again and again, on the newly-arrived rows.</p>
       <p>It does this in <b>micro-batches</b>: tiny batch jobs. Every short interval (say every second) Spark
       grabs the events that arrived since last time, runs your query on them, updates the running result, and
       repeats. So a "stream" is really a fast loop of small batch jobs &mdash; which is why the code looks like
       batch code. The headline: <b>write streaming logic almost identically to batch logic.</b> Swap
       <code>spark.read</code> for <code>spark.readStream</code> and <code>df.write</code> for
       <code>df.writeStream.start()</code>, and the transformations in the middle barely change.</p>
       <p>Three new things you must decide that batch never asks: an <b>output mode</b> (how much of the result to
       emit each batch), a <b>watermark</b> (how long to wait for late events before you finalize a time window),
       and a <b>checkpoint</b> (where to save progress so a crash does not lose or double-count data).</p>`,

    buildup:
      `<p>Build the mental model one piece at a time.</p>
       <p><b>1. Source &rarr; query &rarr; sink.</b> A streaming job reads from a <b>source</b> (where events come
       from), runs a query, and writes to a <b>sink</b> (where results go). Common sources: <b>Kafka</b> (a
       distributed message log &mdash; the usual one in production), a <b>directory of files</b> (new files = new
       data), a <b>socket</b> or a built-in <b>rate</b> source (handy for testing). Common sinks: the
       <b>console</b> (for demos), files, Kafka, or a database via <code>foreachBatch</code>.</p>
       <p><b>2. The unbounded table.</b> Picture the source as a table that grows downward as events land. Each
       micro-batch, Spark sees the new rows and incrementally updates the answer to your query &mdash; it does
       <b>not</b> recompute from scratch over all history (that would be impossible on an unbounded table). It
       keeps just enough <b>state</b> (running counts, partial sums per group) to extend the result.</p>
       <p><b>3. Output mode &mdash; how much to emit.</b> Because the result table changes every batch, you tell
       Spark what to write out each time:</p>
       <ul>
         <li><b>append</b> &mdash; only brand-new rows that will never change again. Good for a plain transform
         or a windowed aggregation once its window is <i>closed</i>. Cannot be used when existing result rows can
         still change.</li>
         <li><b>update</b> &mdash; only the rows whose values changed this batch. Great for running aggregations
         (a live count per key) &mdash; you see the rows that just moved.</li>
         <li><b>complete</b> &mdash; the entire result table, every batch. Simple, but the state must stay small
         (it re-emits everything), so it is only for aggregations with few groups.</li>
       </ul>
       <p><b>4. Event-time windows.</b> For time-based questions ("events per minute") you group by a window of
       <b>event time</b> &mdash; the timestamp <i>on the event</i>, when it actually happened &mdash; not
       <b>processing time</b>, when Spark happened to see it. <code>window(col, "1 minute")</code> makes a
       <b>tumbling</b> window: fixed, non-overlapping minute buckets. Give it a slide
       (<code>window(col, "1 minute", "30 seconds")</code>) and you get a <b>sliding</b> window: overlapping
       buckets that advance by the slide. Events get bucketed by their own timestamp, so out-of-order arrival is
       fine.</p>
       <p><b>5. Watermarks &mdash; how long to wait for stragglers.</b> Real events arrive <b>late</b> and
       <b>out of order</b> (a phone was offline; a packet was delayed). So when can Spark declare the
       <code>10:00&ndash;10:01</code> window <i>done</i> and stop holding state for it? A <b>watermark</b> answers
       that: <code>withWatermark("event_time", "5 minutes")</code> says "wait up to 5 minutes past a window's end
       for late events; after that, finalize the window and drop anything later." Without a watermark, Spark must
       keep <b>every</b> window's state forever in case a straggler shows up &mdash; <b>unbounded state growth</b>,
       and eventually the job runs out of memory.</p>
       <p><b>6. Checkpoints &mdash; not losing or double-counting.</b> A long-running streaming job <i>will</i>
       restart (deploys, crashes, machine loss). The <b>checkpoint</b> is a directory where Spark saves how far
       it has read from the source and the current aggregation state. On restart it resumes exactly where it left
       off &mdash; this is what gives <b>exactly-once</b> processing: no dropped events, no duplicates. No
       checkpoint, no fault tolerance.</p>`,

    symbols: [],

    derivation:
      `<p><b>Why "a stream is an unbounded table" actually works &mdash; the micro-batch loop.</b></p>
       <ul class="steps">
         <li>Define the input as a table $T$ that only ever <b>grows</b>: new events append rows, nothing is
         deleted or reordered in place. At wall-clock tick $i$ it holds all rows that arrived up to that tick.</li>
         <li>Your query $Q$ is a function from a table to a result table: $R = Q(T)$. For batch you'd evaluate it
         once. The trick: define a <b>result table</b> $R_i = Q(T_i)$ at every tick $i$, where $T_i$ is the input
         so far. The stream is just the sequence $R_0, R_1, R_2, \\dots$.</li>
         <li>Computing each $R_i$ from scratch over all of $T_i$ would be hopeless (history never stops growing).
         Instead Spark computes <b>incrementally</b>: it keeps a small <b>state</b> $S_{i-1}$ (e.g. the running
         count per group) and, given only the <b>new</b> rows $\\Delta_i = T_i \\setminus T_{i-1}$, produces
         $S_i$ and the changed output rows. Work per batch scales with the <i>new</i> data, not all history.</li>
         <li>The <b>output mode</b> chooses what slice of $R_i$ to emit: <i>complete</i> emits all of $R_i$;
         <i>update</i> emits the rows of $R_i$ that differ from $R_{i-1}$; <i>append</i> emits only rows that are
         now final and will never change again.</li>
         <li>For time windows, the state is "one running aggregate per open window." The <b>watermark</b> $w_i$
         (the max event time seen, minus the allowed lateness) lets Spark <b>retire</b> windows whose end is
         below $w_i$: emit their final value and free their state. That bounds the state to roughly the windows
         within the lateness horizon &mdash; finite memory on an infinite stream. $\\blacksquare$</li>
       </ul>`,

    example:
      `<p>Count events per 1-minute window with a 2-minute watermark. Two events for the
       <code>10:00&ndash;10:01</code> window:</p>
       <ul class="steps">
         <li>At processing time 10:00:30 an event with <b>event time 10:00:10</b> arrives. Spark opens the
         <code>10:00&ndash;10:01</code> window with count 1. Watermark so far &asymp; 10:00:10 &minus; 2 min, so the
         window is still open.</li>
         <li>At processing time 10:01:40 an event with <b>event time 10:00:50</b> arrives &mdash; <i>late</i> (it
         happened in the first window but showed up after it ended). Because the watermark
         (&asymp; 10:01:40 &minus; 2 min = 9:59:40) has not yet passed the window's end (10:01), the window is still
         alive: Spark bumps its count to 2. Late but accepted.</li>
         <li>Once the watermark crosses 10:01 (around processing time 10:03), Spark <b>finalizes</b> the window,
         emits its final count, and drops its state. A straggler arriving after that is ignored &mdash; the
         deliberate trade for bounded memory.</li>
         <li>Same query in batch would be <code>df.groupBy(window("event_time","1 minute")).count()</code> &mdash;
         streaming adds exactly two words: <code>withWatermark(...)</code> and <code>readStream</code>.</li>
       </ul>`,

    whenToUse:
      `<p><b>Use Structured Streaming when answers must be <i>continuous</i> &mdash; computed as data arrives, not
       in a once-a-day batch run.</b></p>
       <ul>
         <li><b>Real-time dashboards.</b> Live counts, rolling sums, top-N per minute feeding an operations or
         business screen that must stay current to the last few seconds.</li>
         <li><b>Fraud / anomaly alerting.</b> Score transactions or events the moment they land and fire an alert
         &mdash; minutes-late detection is often worthless.</li>
         <li><b>Continuous ETL (Extract, Transform, Load).</b> Clean, enrich, and land events from Kafka into a
         lake or warehouse continuously, instead of a nightly bulk job.</li>
         <li><b>Near-real-time features.</b> Keep streaming feature aggregates (a user's clicks in the last 5
         minutes) fresh for an online model.</li>
       </ul>
       <p><b>When NOT to:</b> if a scheduled batch job (hourly, nightly) meets the freshness need, batch is
       simpler, cheaper, and easier to test &mdash; don't pay the operational cost of a 24/7 streaming job for data
       nobody reads in real time. And for small, slow streams a single-machine consumer may beat a Spark cluster.</p>`,

    application:
      `<p>The same <code>readStream &rarr; transform &rarr; writeStream</code> shape covers a lot of ground:</p>
       <ul>
         <li><b>Kafka in, Kafka out.</b> The production default: read a Kafka topic, transform, write a derived
         topic &mdash; a continuous pipeline of services reacting to events.</li>
         <li><b>File-drop ingestion.</b> A directory where uploads land; each new file is picked up automatically
         and processed, no cron needed.</li>
         <li><b>Windowed metrics.</b> Per-minute or per-5-minute counts, sums, and distinct-user estimates for
         monitoring and dashboards (this connects directly to the <i>monitoring</i> lesson &mdash; streaming is
         how those live metrics get computed).</li>
         <li><b>Stream enrichment.</b> Join a stream against a slowly-changing reference table (user profiles,
         product catalog) to enrich each event before landing it.</li>
       </ul>
       <p>This is the streaming companion to the batch <b>big-data</b> lesson: same DataFrame engine, same cluster,
       same API &mdash; one reads bounded data once, the other reads unbounded data forever.</p>`,

    pitfalls:
      `<ul>
         <li><b>No watermark on a windowed aggregation &rarr; unbounded state.</b> Without
         <code>withWatermark</code>, Spark must keep every window's state forever in case a late event arrives, so
         memory grows without bound and the job eventually dies. Fix: always add a watermark sized to your real
         lateness (e.g. <code>withWatermark("event_time","10 minutes")</code>) on any event-time aggregation.</li>
         <li><b>Wrong output mode for the query.</b> Using <code>append</code> on a running aggregation throws
         (those result rows keep changing, so nothing is ever "final"); using <code>complete</code> on a
         high-cardinality aggregation re-emits a huge table every batch and blows up. Fix: <code>update</code> for
         live running aggregates, <code>append</code> only for transforms or <i>closed</i> windows,
         <code>complete</code> only for small aggregations.</li>
         <li><b>Event-time vs processing-time confusion.</b> Windowing on "now" (when Spark saw the event) instead
         of the event's own timestamp gives wrong, non-reproducible buckets &mdash; a delayed batch lumps old
         events into the wrong window. Fix: carry a real <code>event_time</code> column from the source and window
         on <i>that</i>; use processing time only when you genuinely mean it.</li>
         <li><b>Micro-batches too small.</b> A trigger interval far below the per-batch overhead (scheduling,
         planning, checkpoint write) means Spark spends more time on bookkeeping than on data. Fix: pick a trigger
         interval matched to your latency need (a few seconds is usually plenty); don't chase millisecond batches
         unless you must.</li>
         <li><b>No checkpoint &rarr; no fault tolerance / duplicates.</b> Skipping
         <code>checkpointLocation</code> means a restart re-reads or loses data &mdash; no exactly-once. Fix: always
         set a durable, per-query <code>checkpointLocation</code> (on reliable storage), and never share one
         checkpoint dir between two queries.</li>
         <li><b>Testing streaming logic by running the stream.</b> Hard to make deterministic. Fix: factor the
         transformation into a plain function on a DataFrame and unit-test it on a <b>static</b> DataFrame (the
         batch API is identical), or use the <code>memory</code>/<code>console</code> sink with a controlled rate
         source for end-to-end checks.</li>
       </ul>`,

    practice: [
      {
        q: `You run <code>events.groupBy(window("event_time","1 minute")).count()</code> as a streaming query with no <code>withWatermark</code>. It works for an hour, then the driver dies with an out-of-memory error. What happened, and what's the fix?`,
        steps: [
          { do: `Note that each 1-minute window keeps a running count in Spark's state store.`, why: `An aggregation needs to remember the current count per group (here, per window) to update it as new rows arrive.` },
          { do: `Realize that without a watermark, Spark cannot know a window is "done", so it never drops any window's state.`, why: `A late event could in principle still belong to any past window, so all windows must be kept open forever.` },
          { do: `Add <code>events.withWatermark("event_time","10 minutes").groupBy(window("event_time","1 minute")).count()</code>.`, why: `The watermark lets Spark retire windows older than the lateness horizon, freeing their state and bounding memory.` }
        ],
        answer: `<p><b>Unbounded state growth.</b> Every 1-minute window holds aggregation state, and with no watermark Spark must keep <i>every</i> window's state indefinitely (a late event might belong to any of them), so state &mdash; and memory &mdash; grows without bound until the driver dies. The fix is a <b>watermark</b>: <code>withWatermark("event_time","10 minutes")</code> tells Spark to finalize and drop windows once the watermark passes their end, keeping only the windows within the lateness horizon. Size the lateness to how late your events realistically arrive.</p>`
      },
      {
        q: `You want a live count of clicks per user, updated continuously, written to the console. You try <code>...groupBy("user").count().writeStream.outputMode("append").format("console").start()</code> and Spark refuses to start the query. Why, and which output mode should you use?`,
        steps: [
          { do: `Identify the query as a running aggregation: each user's count changes whenever a new click for that user arrives.`, why: `The result row for a user is not final after one batch — later batches keep updating it.` },
          { do: `Recall that <code>append</code> only emits rows that will never change again.`, why: `Spark cannot emit a row in append mode while that row can still be updated, so an unbounded running aggregation has no append-able rows — Spark rejects it.` },
          { do: `Switch to <code>outputMode("update")</code> (or <code>complete</code> if the number of users is small).`, why: `Update emits exactly the user rows whose counts changed this batch — the natural fit for a live running aggregate.` }
        ],
        answer: `<p><code>append</code> is the wrong mode. Append only outputs rows that are <b>final</b>, but a running per-user count keeps changing as new clicks arrive, so there are never any final rows to append &mdash; Spark rejects the query. Use <b><code>update</code></b>, which emits just the rows whose counts changed each micro-batch (ideal for a live dashboard). <code>complete</code> also works but re-emits the entire table every batch, so only use it when the number of distinct users (groups) stays small.</p>`
      },
      {
        q: `A teammate asks why your streaming feature pipeline sets a <code>checkpointLocation</code>, since "it ran fine in testing without one." What do you tell them?`,
        steps: [
          { do: `Point out that a streaming job runs 24/7 and will eventually restart — deploys, crashes, machine loss.`, why: `Unlike a batch job that finishes, a stream's lifetime is effectively forever, so a restart is a certainty, not an edge case.` },
          { do: `Explain that the checkpoint stores read progress (offsets) and aggregation state durably.`, why: `On restart Spark reads the checkpoint to resume exactly where it stopped instead of re-reading from the start or skipping ahead.` },
          { do: `Conclude that the checkpoint is what gives exactly-once processing — no lost events, no duplicates.`, why: `Without it, a restart re-processes already-handled events (duplicates) or skips unread ones (loss), corrupting downstream features.` }
        ],
        answer: `<p>It "ran fine" only because it never restarted. A streaming job runs continuously and <b>will</b> restart eventually (deploy, crash, node loss). The <b>checkpoint</b> durably records how far it has read from the source plus the current aggregation state, so on restart Spark resumes <i>exactly</i> where it left off &mdash; this is what delivers <b>exactly-once</b> processing. Without a checkpoint a restart re-reads already-processed data (duplicates) or skips unread data (loss), quietly corrupting the features downstream. Always set a durable, per-query <code>checkpointLocation</code>.</p>`
      }
    ]
  });

  window.CODE["spark-streaming"] = {
    lib: "PySpark (Structured Streaming)",
    runnable: false,
    explain: `<p>A minimal Structured Streaming job, end to end. It reads from the built-in <code>rate</code> source
      (a steady stream of timestamped rows &mdash; perfect for Colab, no Kafka needed), adds a watermark, computes a
      <b>tumbling 10-second windowed count</b> with <code>groupBy(window(...))</code>, and writes to the
      <b>console</b> in <code>update</code> mode with a <b>checkpoint</b> directory. Notice how the middle &mdash; the
      <code>withWatermark</code> + <code>groupBy</code> + <code>count</code> &mdash; is <b>identical</b> to what you'd
      write on a static batch DataFrame; only <code>readStream</code> / <code>writeStream.start()</code> differ.
      <code>runnable</code> is off (no Java Virtual Machine in the browser), but it runs in Google Colab after
      <code>!pip install pyspark</code>; let it print a few batches, then call <code>query.stop()</code>.</p>`,
    code: `# Colab: !pip install pyspark
from pyspark.sql import SparkSession
from pyspark.sql.functions import window, col

spark = (SparkSession.builder
         .master("local[*]").appName("streaming-demo")
         .getOrCreate())
spark.sparkContext.setLogLevel("WARN")

# ----- SOURCE: the built-in 'rate' stream (timestamp + value, N rows/sec) -----
# In production this line is the only thing that changes, e.g.:
#   spark.readStream.format("kafka").option("subscribe","clicks").load()
events = (spark.readStream
          .format("rate")
          .option("rowsPerSecond", 20)   # 20 events per second
          .load())                       # columns: timestamp (event time), value

# ----- TRANSFORM: windowed count by EVENT TIME, with a watermark -----
# >>> This block is byte-for-byte the same as the BATCH API <<<
windowed = (events
            .withWatermark("timestamp", "30 seconds")    # wait up to 30s for late events
            .groupBy(window(col("timestamp"), "10 seconds"))  # tumbling 10s windows
            .count())

# ----- SINK: console, UPDATE mode (emit windows whose count changed), checkpointed -----
query = (windowed.writeStream
         .outputMode("update")                 # running counts change -> 'update', not 'append'
         .format("console")
         .option("truncate", False)
         .option("checkpointLocation", "/tmp/ckpt_stream")  # exactly-once on restart
         .trigger(processingTime="5 seconds")  # one micro-batch every 5s
         .start())

# query.awaitTermination(30)   # let it run ~30s in Colab...
# query.stop()                 # ...then stop it.

# ----- The batch twin (same logic, bounded data): -----
#   static = spark.read.format("rate")...   # or spark.read.parquet(path)
#   static.groupBy(window(col("timestamp"), "10 seconds")).count().show()
# Same groupBy/window/count -> that is the whole point of Structured Streaming.`
  };

  window.CODEVIZ["spark-streaming"] = {
    question: "What does a windowed streaming aggregation output per tumbling window — and how do you read the chart for a healthy watermark vs a too-tight one vs no watermark at all?",
    charts: [
      {
        type: "bars",
        title: "Healthy: windowed COUNT per 10-second tumbling window (real shape)",
        xlabel: "tumbling window (event-time start)",
        ylabel: "event count",
        labels: ["10:00:00", "10:00:10", "10:00:20", "10:00:30", "10:00:40", "10:00:50"],
        values: [23, 50, 87, 81, 59, 20],
        valueLabels: ["23", "50", "87", "81", "59", "20"],
        colors: ["#4ea1ff", "#4ea1ff", "#4ea1ff", "#4ea1ff", "#4ea1ff", "#4ea1ff"],
        interpret: "<b>This is the actual output of groupBy(window(...)).count().</b> Each bar is one tumbling 10-second window, labelled by its event-time start; height is how many events fell in it. Events are bucketed by their <b>own timestamp</b>, not arrival time, so the smooth rise-then-fall (23→87→20) reflects real traffic, not processing hiccups. Conclusion: this is what a correct windowed count looks like — one bar per closed window, counts that track the data's actual rhythm."
      },
      {
        type: "bars",
        title: "Healthy watermark (5s): most events on-time, a thin tail dropped late",
        xlabel: "tumbling window (event-time start)",
        ylabel: "event count",
        labels: ["00 on-time", "00 late", "10 on-time", "10 late", "20 on-time", "20 late", "30 on-time", "30 late", "40 on-time", "40 late", "50 on-time", "50 late"],
        values: [20, 3, 42, 8, 76, 11, 70, 11, 50, 9, 19, 1],
        valueLabels: ["20", "3", "42", "8", "76", "11", "70", "11", "50", "9", "19", "1"],
        colors: ["#7ee787", "#ff7b72", "#7ee787", "#ff7b72", "#7ee787", "#ff7b72", "#7ee787", "#ff7b72", "#7ee787", "#ff7b72", "#7ee787", "#ff7b72"],
        interpret: "<b>Each window is split into kept (green) vs dropped-late (red).</b> A 5-second watermark accepts events delayed up to 5s and discards stragglers beyond that once the window finalizes. Read it as a ratio: green towers over red in every window (277 kept vs 43 dropped overall, ~13%). Conclusion: this watermark is <b>well-sized</b> — you lose only a thin late tail while keeping state bounded. The 43 red events are exactly the memory Spark would otherwise hold forever."
      },
      {
        type: "bars",
        title: "Too-tight watermark (0.5s): most events arrive 'late' and are dropped",
        xlabel: "tumbling window (event-time start)",
        ylabel: "event count",
        labels: ["00 on-time", "00 late", "10 on-time", "10 late", "20 on-time", "20 late", "30 on-time", "30 late", "40 on-time", "40 late", "50 on-time", "50 late"],
        values: [5, 18, 12, 38, 22, 65, 19, 62, 14, 45, 5, 15],
        valueLabels: ["5", "18", "12", "38", "22", "65", "19", "62", "14", "45", "5", "15"],
        colors: ["#7ee787", "#ff7b72", "#7ee787", "#ff7b72", "#7ee787", "#ff7b72", "#7ee787", "#ff7b72", "#7ee787", "#ff7b72", "#7ee787", "#ff7b72"],
        interpret: "<b>Illustrative.</b> Same data, but the watermark is shrunk to half a second, so almost any normal network delay counts as 'late'. Now <b>red dominates green</b> — the bulk of every window is discarded and your counts are badly undercounted. Recognise it by red bars taller than green across the board. Conclusion: the watermark is too tight; the fix is to <b>size lateness to how late events realistically arrive</b> (seconds-to-minutes), not to chase the smallest number."
      },
      {
        type: "line",
        title: "No watermark: state never retires → unbounded memory growth → OOM crash",
        xlabel: "minutes the job has been running",
        ylabel: "state held (open windows kept in memory)",
        series: [
          { name: "no watermark (grows forever)", color: "#ff7b72", points: [[0, 0], [10, 60], [20, 120], [30, 180], [40, 240], [50, 300], [55, 330]] },
          { name: "with 5s watermark (bounded)", color: "#7ee787", points: [[0, 0], [10, 6], [20, 6], [30, 6], [40, 6], [50, 6], [55, 6]] }
        ],
        interpret: "<b>Illustrative — this is a resource chart, not a result chart.</b> X is wall-clock minutes; Y is how many windows' state Spark is holding. Without a watermark (red) Spark can never declare a window 'done' — a late event might belong to any past window — so state climbs linearly until the driver hits out-of-memory and dies. With a watermark (green) old windows retire once it passes their end, so state stays flat. Conclusion: a forever-rising memory line on a windowed stream means a <b>missing watermark</b>, not a data spike."
      }
    ],
    caption: "Reading a windowed streaming aggregation. Charts 1–2 use real numbers: a synthetic 60-second stream of 320 events bucketed into 10s tumbling windows by EVENT TIME with pandas floor — exactly the shape Spark's groupBy(window(...)).count() emits, then split by a 5s watermark (277 on-time, 43 late). Charts 3–4 are illustrative failure modes: a too-tight watermark that drops most events, and the unbounded state growth you get with NO watermark (the OOM in the lesson's pitfalls). Green = healthy/kept, red/orange = problem.",
    code: `import numpy as np
import pandas as pd

# ---- synthetic 60s event stream: 320 events, rate peaks mid-window ----
rng = np.random.RandomState(7)
start = pd.Timestamp("2026-06-21 10:00:00")
w = np.exp(-((np.arange(60) - 30) ** 2) / (2 * 14 ** 2)); w = w / w.sum()
secs  = np.sort(rng.choice(np.arange(60), size=320, p=w))   # event-time second
delay = np.abs(rng.normal(2.0, 3.0, size=320))              # arrival delay (s)

ev = pd.DataFrame({"event_time": start + pd.to_timedelta(secs, unit="s"),
                   "delay": delay})

# ---- tumbling 10s windows by EVENT TIME (what groupBy(window(...)) does) ----
ev["win"] = ev["event_time"].dt.floor("10s")
counts = ev.groupby("win").size()
print("per-window counts:", counts.tolist())     # [23, 50, 87, 81, 59, 20]
print("total events:", int(counts.sum()))        # 320

# ---- 5s watermark: events delayed > 5s are 'late' (dropped after finalize) ----
ev["late"] = ev["delay"] > 5.0
ontime = (~ev["late"]).groupby(ev["win"]).sum().astype(int)
late   = ev["late"].groupby(ev["win"]).sum().astype(int)
print("on-time per window:", ontime.tolist())     # [20, 42, 76, 70, 50, 19]
print("late per window   :", late.tolist())       # [3, 8, 11, 11, 9, 1]
print("total on-time", int(ontime.sum()),         # 277
      " total late", int(late.sum()))             # 43`
  };
})();
