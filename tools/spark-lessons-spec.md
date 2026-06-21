# Authoring an "Apache Spark" lesson

You write ONE self-contained file `lessons/concept-<id>.js` for one Apache Spark concept.
Goal: take a learner from zero to genuinely understanding distributed data processing with
Spark (PySpark). Same lesson structure as the other technique lessons. Be concrete and
practical — real PySpark code that RUNS IN GOOGLE COLAB (local mode).

Read first:
- `lessons/09-classical-a.js` → `cls-gradient-boosting` for the field schema + whenToUse/pitfalls style.
- `lessons/concept-dw-big-data.js` → the related "scaling to big data" lesson (cross-link it).
- `lessons/codeviz-02-ml.js` → CODEVIZ chart shapes: bars `{type:"bars",labels,values,valueLabels,colors}`;
  line `series:[{name,color,points:[[x,y]]}]`; scatter `groups:[{name,color,points}]`.

## File skeleton
```
(function () {
  window.LESSONS.push({
    id: "<ID>", title: "<TITLE>", tagline: "<one plain sentence>",
    module: "Apache Spark (big-data processing)",
    prereqs: [<existing ids you VERIFY by grepping window.LESSONS; e.g. dw-big-data, dw-combining, dw-dataframes-ish, met-* , sibling spark-* ids; [] if unsure>],
    whenToUse: `...`,     // when Spark earns its keep vs pandas/Polars/DuckDB/a database
    application: `...`,   // where it's used (ETL, big joins, ML at scale, streaming)
    pitfalls: `...`,      // <ul> of the classic Spark mistakes + the fix (shuffles, skew, collect(), small files...)
    bigIdea: `...`, buildup: `...`,
    symbols: [ ... ],     // usually light/empty — Spark is conceptual, not formula-heavy
    formula: `$$...$$`, whatItDoes: `...`,   // OPTIONAL — omit if no real math (most Spark lessons have none)
    derivation: `...`,    // the mechanism / why it works (the execution model, the shuffle, lazy eval...)
    example: `...`,       // a tiny concrete worked example
    demo: function (host) { ... },   // OPTIONAL theme-aware canvas/Charts demo
    practice: [ { q:`...`, steps:[{do:`...`, why:`...`}], answer:`...` }, ... ]
  });
  window.CODE["<ID>"] = {
    lib: "PySpark",
    runnable: false,        // the in-browser engine has no JVM/Spark; THIS CODE RUNS IN COLAB (local mode)
    explain: `<p>...frames the code; note it runs in Colab after \`!pip install pyspark\`...</p>`,
    code: `<real, runnable PySpark for this concept>`
  };
  window.CODEVIZ["<ID>"] = {
    question: "...",
    charts: [ { type:"bars|line|scatter", title, xlabel, ylabel, <...> } ],
    caption: "...",
    code: `<Python that COMPUTES the plotted numbers — numpy/pandas to ILLUSTRATE the Spark concept reproducibly>`
  };
})();
```

## Page render order: title/tagline → whenToUse → (where used) → CODE → CODEVIZ → pitfalls →
## "Under the hood" (bigIdea, buildup, symbols?, formula?, derivation, example) → demo → practice.

## Code rules — TWO TRACKS
- `CODE.code` = REAL PySpark for the concept, written so it RUNS IN GOOGLE COLAB local mode. Start the code
  (where a session is needed) with the standard boilerplate, e.g.:
    `# Colab: !pip install pyspark` (as a comment — the notebook's setup cell installs it)
    `from pyspark.sql import SparkSession`
    `spark = SparkSession.builder.master("local[*]").appName("demo").getOrCreate()`
  Use small inline/bundled data (e.g. `spark.createDataFrame([...])` or read a tiny CSV you write first) so it
  runs on a single Colab VM. Show the real Spark API for the concept. `runnable:false` (no JVM in the browser).
- `CODEVIZ.code` = a small REPRODUCIBLE numpy/pandas computation that ILLUSTRATES the Spark concept and produces
  the plotted numbers (it is shown as text / put in the notebook — NOT executed in the browser, so any library
  is fine, but prefer numpy/pandas so it's quick to run). RUN it to embed real numbers. Examples of good charts:
  * partitioning/skew: hash keys into N partitions → BARS of records per partition (even vs skewed);
  * lazy eval / stages: BARS of the DAG stages/tasks for a query, or rows scanned with vs without predicate pushdown;
  * shuffle cost: BARS of data shuffled (MB) or runtime for a shuffle join vs a broadcast join;
  * caching: BARS/line of runtime of repeated reads WITHOUT cache vs WITH cache (re-computation avoided);
  * scaling: line of runtime vs number of partitions/cores;
  * Spark vs pandas: BARS of where each wins by data size (conceptual, label it).
  Subsample to <= 60 points; embedded numbers must be plausible/real.

## HARD CONVENTIONS
1. Teaching fields are HTML — `<p>`, `<b>`, `<i>`, `<ul>/<ol><li>`, `<code>`. Short, plain sentences.
2. Any math in `$...$` with DOUBLED backslashes; NEVER an HTML entity inside `$...$` (use `\\lt`/`\\gt`). Most Spark lessons need no math.
3. NEVER a raw "<" before a letter/number in prose — write `&lt;`. ">" is fine.
4. Expand every abbreviation on first use — "RDD (Resilient Distributed Dataset)", "DAG (Directed Acyclic
   Graph)", "AQE (Adaptive Query Execution)", "ETL (Extract, Transform, Load)", "UDF (User-Defined Function)".
5. Run `node --check lessons/concept-<id>.js` and fix any error.

Report: lesson id, the Spark concept, what the PySpark CODE does, the CODEVIZ illustration, node --check result.
