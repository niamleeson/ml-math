/* Data Wrangling — "Wrangling big data: when the dataset strains or exceeds RAM".
   Self-contained: lesson + CODE + CODEVIZ merged by id "dw-big-data". */
(function () {
  window.LESSONS.push({
    id: "dw-big-data",
    title: "Wrangling big data: when the data won't fit in memory",
    tagline: "Shrink dtypes, read in chunks, use Parquet, and reach for Polars or Dask before a bigger machine.",
    module: "Data Wrangling",
    prereqs: ["dw-tidy-data", "skill-data-audit"],

    bigIdea:
      `<p>Sooner or later a dataset gets big enough that loading it the naive way &mdash;
       <code>pd.read_csv("everything.csv")</code> &mdash; either crawls or crashes with a memory error.
       The instinct is to ask for a bigger machine. Usually you do not need one. The single most useful
       habit is: <b>don't load what you don't need.</b></p>
       <p>This lesson is four cheap moves that buy you a lot of room before you reach for heavy machinery:</p>
       <ul>
         <li><b>Memory-efficient dtypes.</b> pandas defaults to <code>int64</code>, <code>float64</code>, and
         <code>object</code> (Python strings) for everything. Downcasting numbers to <code>int8</code>/<code>int32</code>
         or <code>float32</code>, and converting low-cardinality text columns to the <code>category</code> dtype,
         often shrinks a frame by a <b>multiple</b> &mdash; 3x, 4x, sometimes much more.</li>
         <li><b>Read in chunks.</b> <code>pd.read_csv(..., chunksize=N)</code> hands you the file one block of
         <code>N</code> rows at a time, so you process a 50 GB file with 500 MB of RAM.</li>
         <li><b>Read only what you need.</b> Select the columns and rows you actually use <i>at read time</i>,
         not after the whole thing is already in memory.</li>
         <li><b>Use a columnar file format.</b> <b>Parquet</b> stores data column-by-column with compression,
         so you can read just three of fifty columns and skip the rest of the file entirely.</li>
       </ul>
       <p>When even those are not enough, you <b>graduate</b> to out-of-core and parallel tools &mdash;
       <b>Polars</b>, <b>Dask</b>, or pushing the work into a database. But you try the cheap moves first.</p>`,

    buildup:
      `<p>Walk up the ladder one rung at a time. Each rung only matters if the rung below it ran out.</p>
       <p><b>Rung 1 &mdash; smaller dtypes.</b> A column of integers from 0 to 57 does not need 8 bytes per
       value; one byte (<code>int8</code>) holds anything from -128 to 127. A column of measured floats rarely
       needs the full 15-digit precision of <code>float64</code>; <code>float32</code> (about 7 digits) halves
       it. A text column with only a handful of distinct values &mdash; <code>"low"</code>, <code>"mid"</code>,
       <code>"high"</code> &mdash; stored as <code>object</code> keeps a full Python string per row; the
       <code>category</code> dtype stores each distinct value <b>once</b> and keeps a tiny integer code per row.
       That last one is where the big wins usually hide.</p>
       <p><b>Rung 2 &mdash; chunking.</b> If the frame still will not fit, you never hold all of it at once.
       <code>read_csv(chunksize=N)</code> gives you an iterator of frames. You loop, compute a partial result
       per chunk (a running sum, a per-group count), and combine the partials at the end. Memory stays flat at
       roughly one chunk regardless of file size.</p>
       <p><b>Rung 3 &mdash; read less.</b> Pass <code>usecols=[...]</code> to load only the columns you need, and
       filter rows early. With <b>Parquet</b> this gets even better: because it is <b>columnar</b>, the reader
       physically skips the bytes of columns you did not ask for (<i>column pruning</i>), and it can skip whole
       row blocks whose values cannot match your filter (<i>predicate pushdown</i>). A comma-separated values
       (CSV) file is row-by-row text, so it has to scan the whole thing no matter what.</p>
       <p><b>Rung 4 &mdash; bigger tools.</b> <b>Polars</b> is a fast DataFrame library with a <b>lazy</b> mode:
       you describe the whole query (scan, filter, group) and it plans the work &mdash; pushing your filters and
       column choices down into the scan &mdash; before reading a single row it does not need. <b>Dask</b> mimics
       the pandas application programming interface (API) but splits the frame into partitions and runs them in
       parallel, on one machine or a cluster, spilling to disk when needed. Or push the heavy aggregation into a
       database with structured query language (SQL) and pull back only the small result.</p>`,

    symbols: [
      { sym: "int8 / int16 / int32 / int64", desc: "signed integer dtypes using 1, 2, 4, or 8 bytes per value. int8 holds -128 to 127; int64 holds the full $\\pm 9.2\\times10^{18}$ range. Pick the smallest that fits your values." },
      { sym: "float32 / float64", desc: "floating-point dtypes using 4 or 8 bytes. float32 keeps about 7 significant digits; float64 keeps about 15. Measured data rarely needs more than float32." },
      { sym: "object", desc: "pandas' default dtype for text: a full Python string object per row. Memory-hungry, especially with many repeated values." },
      { sym: "category", desc: "a dtype that stores each distinct value once in a dictionary and keeps only a small integer code per row. Ideal for low-cardinality text (few distinct values, many rows)." },
      { sym: "$N$", desc: "the chunk size: how many rows pd.read_csv(chunksize=N) hands you per iteration. Memory use scales with $N$, not with the file size." }
    ],

    derivation:
      `<p><b>Why a <code>category</code> column can shrink by 50x while a number column only halves.</b></p>
       <ul class="steps">
         <li>Take a text column with $R$ rows but only $k$ distinct values (think a <code>price_band</code>
         column: $R=20{,}640$ rows, $k=5$ labels). As <code>object</code>, pandas stores a full Python string
         object for every one of the $R$ rows &mdash; tens of bytes each, times $R$.</li>
         <li>As <code>category</code>, pandas stores the $k$ distinct strings <b>once</b> in a small dictionary,
         then keeps one integer code per row. With $k\\le 128$ that code is a single byte. So the per-row cost
         drops from "a whole string" to "one byte," and the $k$ stored strings are negligible.</li>
         <li>When $k\\ll R$ the saving is enormous: in the worked dataset below the <code>price_band</code>
         column falls from <b>1.27 MB to 0.02 MB</b> &mdash; roughly a 60x cut &mdash; purely from this change.
         The win grows as the column gets more repetitive.</li>
         <li>A number column cannot do this trick &mdash; its values are not repetitive, so the only lever is
         <b>width</b>. <code>float64</code> to <code>float32</code> halves it (2x); <code>int64</code> to
         <code>int8</code> is an 8x cut on that one column. Real but bounded by the bytes-per-value ratio.</li>
         <li>Add up a typical mixed frame &mdash; floats halved, one integer column cut 8x, one text column cut
         60x &mdash; and the whole frame lands around a <b>3&ndash;4x</b> reduction, which is exactly what the
         chart below shows on real data. $\\blacksquare$</li>
       </ul>`,

    example:
      `<p>A frame of 20,640 California-housing rows: nine measured float columns, one small integer
       <code>county_code</code> (values 0&ndash;57), and one text <code>price_band</code> with five labels.</p>
       <ul class="steps">
         <li><b>As loaded</b> (all <code>float64</code> / <code>int64</code> / <code>object</code>):
         <code>df.memory_usage(deep=True).sum()</code> reports <b>2.92 MB</b>. The nine floats are 1.49 MB, the
         one integer column is 0.17 MB, and the single <code>object</code> text column alone is <b>1.27 MB</b>
         &mdash; nearly half the frame for one column.</li>
         <li><b>Downcast the floats</b> to <code>float32</code>: 1.49 MB &rarr; 0.74 MB. Clean 2x.</li>
         <li><b>Downcast the integer</b> to <code>int8</code> (0&ndash;57 fits easily): 0.17 MB &rarr; 0.02 MB.</li>
         <li><b>Convert <code>price_band</code> to <code>category</code></b>: 1.27 MB &rarr; 0.02 MB. The big one.</li>
         <li><b>Total: 2.92 MB &rarr; 0.78 MB</b>, a <b>3.7x</b> reduction &mdash; same numbers, same rows, zero
         information lost, just honest dtypes. On a 30 GB frame that is the difference between fitting in RAM and
         not.</li>
       </ul>`,

    whenToUse:
      `<p><b>Reach for these the moment a dataset is large, slow, or refuses to load &mdash; before asking for a
       bigger machine.</b></p>
       <ul>
         <li><b>Always profile first.</b> Run <code>df.info(memory_usage="deep")</code> or
         <code>df.memory_usage(deep=True)</code> to see where the bytes actually go. Often one
         <code>object</code> column is most of the frame.</li>
         <li><b>Downcast + <code>category</code></b> &mdash; the cheapest win, do it routinely. Free 3&ndash;4x
         (or more) with no change to your analysis.</li>
         <li><b>Chunk</b> when the file is bigger than RAM but the <i>operation</i> is chunk-friendly &mdash; a
         sum, a count, a per-group aggregation that combines across blocks.</li>
         <li><b>Switch to Parquet</b> when you read the same data repeatedly or only need some columns. The
         columnar layout plus compression and column pruning makes reads dramatically cheaper than CSV.</li>
         <li><b>Graduate to Polars or Dask</b> when smart pandas still is not enough: Polars (lazy, fast,
         single-machine, great for "bigger than RAM but fits on disk"); Dask (pandas-like, distributed, for
         genuinely cluster-scale data). Or push the aggregation into a database with SQL and pull back only the
         small result.</li>
       </ul>`,

    application:
      `<p>This shows up constantly once data leaves the toy-dataset stage.</p>
       <ul>
         <li><b>Log and event data.</b> Clickstream, server logs, telemetry &mdash; tens of millions of rows of
         mostly repetitive categorical fields (URLs, status codes, country). <code>category</code> dtype and
         Parquet are made for exactly this.</li>
         <li><b>Wide feature tables.</b> A modeling table with hundreds of columns where any one job needs ten of
         them. <code>usecols</code> on CSV, or column pruning on Parquet, turns a slow full read into a fast
         partial one.</li>
         <li><b>ETL that won't fit.</b> A nightly job that aggregates a file larger than the box's RAM &mdash;
         chunked <code>read_csv</code> with a running accumulator, or a Polars lazy scan, keeps memory flat.</li>
         <li><b>Local exploration of "big" data.</b> Polars' <code>scan_parquet().filter().group_by().collect()</code>
         lets you interrogate a multi-gigabyte file on a laptop because only the needed columns and rows are ever
         materialized.</li>
       </ul>`,

    pitfalls:
      `<ul>
         <li><b>Loading the whole CSV when you need a few columns.</b> The classic waste:
         <code>pd.read_csv(path)</code> on a 50-column file to use 3 of them. Fix: pass
         <code>usecols=[...]</code>, or store the data as Parquet and read <code>columns=[...]</code> so the
         unused columns are never touched.</li>
         <li><b><code>float64</code> and <code>object</code> everywhere.</b> Accepting pandas' defaults leaves
         huge memory on the table. Fix: profile with <code>memory_usage(deep=True)</code>, downcast numerics, and
         convert low-cardinality text to <code>category</code>.</li>
         <li><b>Downcasting that overflows or loses precision.</b> Cramming values into <code>int8</code> when
         some exceed 127 silently <b>wraps around</b> to wrong numbers; forcing <code>float32</code> on data that
         needs more digits quietly loses precision. Fix: check the column's actual min/max and required precision
         first; <code>pd.to_numeric(..., downcast=...)</code> picks the smallest <i>safe</i> width for you.</li>
         <li><b>Chunking that breaks global operations.</b> Some operations cannot be done one chunk at a time
         &mdash; a global sort, a median, a deduplication across the whole file, or a join &mdash; because they
         need to see all the data at once. Fix: use a tool that handles out-of-core globally (Polars, Dask, or a
         database), or do a two-pass algorithm. Do not fake a global sort by sorting each chunk.</li>
         <li><b>Jumping straight to Spark or Dask.</b> Standing up a cluster for data that a downcast-plus-Parquet
         read or a single Polars query would have handled adds latency, cost, and operational pain. Fix: exhaust
         the cheap pandas/Polars moves first; reach for distributed tools only when the data is genuinely too big
         for one machine.</li>
       </ul>`,

    practice: [
      {
        q: `Your <code>df.info(memory_usage="deep")</code> shows a 4 GB frame, and one <code>object</code> column named <code>country</code> (only ~200 distinct values across 50 million rows) accounts for most of it. What single change helps most, and roughly why?`,
        steps: [
          { do: `Notice the column is low-cardinality text: about 200 distinct values, but 50 million rows.`, why: `As <code>object</code>, pandas stores a full Python string per row, so 50M near-duplicate strings dominate the memory.` },
          { do: `Convert it with <code>df["country"] = df["country"].astype("category")</code>.`, why: `<code>category</code> stores each of the ~200 distinct strings once and keeps a tiny integer code per row.` },
          { do: `Re-check <code>memory_usage(deep=True)</code> to confirm the drop.`, why: `With 200 codes the per-row cost falls from a string to about one byte, cutting that column dramatically.` }
        ],
        answer: `<p>Convert <code>country</code> to the <b><code>category</code></b> dtype. Because there are only ~200 distinct values over 50M rows, pandas stores each label once plus a one- or two-byte code per row instead of a whole Python string per row &mdash; a many-x cut on the column that dominates the frame. Downcasting numerics helps too, but the repetitive text column is where the biggest single win is.</p>`
      },
      {
        q: `A teammate needs the total <code>amount</code> summed by <code>region</code> from a 60 GB CSV on a 16 GB-RAM laptop. <code>pd.read_csv(path)</code> crashes. Outline a chunked approach, and name one operation this approach would <i>not</i> support.`,
        steps: [
          { do: `Iterate with <code>for chunk in pd.read_csv(path, usecols=["region","amount"], chunksize=1_000_000):</code>.`, why: `Only two columns and one million rows are in memory at a time, so RAM stays flat regardless of file size.` },
          { do: `Per chunk, compute <code>chunk.groupby("region")["amount"].sum()</code> and add it into a running total Series.`, why: `A grouped sum is associative: partial sums per chunk combine correctly into the global sum.` },
          { do: `After the loop, the accumulated Series is the answer.`, why: `Summing is order-independent, so combining partials gives the exact global result.` }
        ],
        answer: `<p>Read in chunks with <code>chunksize</code> and <code>usecols=["region","amount"]</code>, do a per-chunk <code>groupby(...).sum()</code>, and accumulate the partial sums into a running total. Memory stays at roughly one chunk. What this would <b>not</b> support is any operation that needs all the data at once &mdash; a <b>global sort</b>, an exact median, or a cross-file dedup &mdash; because those cannot be combined from independent per-chunk results. For those, reach for Polars, Dask, or a database.</p>`
      },
      {
        q: `You repeatedly read 3 of 80 columns from a dataset for different analyses, and each read is slow. The data is currently a single big CSV. What format change helps, and what two mechanisms make it faster?`,
        steps: [
          { do: `Convert the CSV to <b>Parquet</b> once: <code>pd.read_csv(path).to_parquet("data.parquet")</code> (chunked if it does not fit).`, why: `Parquet is a compressed columnar format, so it is smaller on disk and laid out by column.` },
          { do: `Read only what you need: <code>pd.read_parquet("data.parquet", columns=["a","b","c"])</code>.`, why: `Columnar storage lets the reader physically skip the bytes of the other 77 columns (column pruning).` },
          { do: `Add a filter and let the engine skip non-matching row blocks (predicate pushdown), especially via Polars' <code>scan_parquet().filter()</code>.`, why: `Parquet stores per-block statistics, so blocks that cannot match the filter are never read.` }
        ],
        answer: `<p>Store the data as <b>Parquet</b> instead of CSV. Two mechanisms make repeated partial reads fast: <b>column pruning</b> &mdash; because Parquet is columnar, reading <code>columns=["a","b","c"]</code> physically skips the other 77 columns &mdash; and <b>predicate pushdown</b> &mdash; per-block statistics let the reader skip whole row groups that cannot match a filter. Compression also shrinks the file. A CSV, being row-major text, must scan the whole file every time.</p>`
      }
    ]
  });

  window.CODE["dw-big-data"] = {
    lib: "pandas + polars",
    runnable: false,
    explain: `<p>The four cheap moves, end to end. First <b>profile</b> with <code>memory_usage(deep=True)</code>,
      then <b>downcast</b> numerics and convert low-cardinality text to <code>category</code> (typically a 3&ndash;4x
      cut). Then a <b>chunked</b> <code>read_csv</code> aggregation loop that keeps memory flat on a file bigger than
      RAM. Then <b>Parquet</b> with <code>columns=[...]</code> for column pruning. Finally a <b>Polars lazy scan</b>
      that pushes the filter and column choice down into the read. <code>runnable</code> is off because the file paths
      are placeholders &mdash; point them at your own CSV/Parquet (the dtype section runs as-is on California housing).</p>`,
    code: `import numpy as np
import pandas as pd
import polars as pl
from sklearn.datasets import fetch_california_housing

# ============================================================
# 0. PROFILE: where do the bytes actually go?
# ============================================================
d = fetch_california_housing(as_frame=True)
df = d.frame.copy()
df['price_band'] = pd.cut(df['MedHouseVal'], bins=[0, 1, 2, 3, 4, 6],
                          labels=['very_low', 'low', 'mid', 'high', 'very_high']).astype(object)
rng = np.random.RandomState(0)
df['county_code'] = rng.randint(0, 58, size=len(df)).astype('int64')

df.info(memory_usage='deep')                 # see dtypes + per-column memory
print(df.memory_usage(deep=True))            # bytes per column (deep = real string size)
print('before:', df.memory_usage(deep=True).sum())   # -> 2,920,574 bytes (~2.92 MB)

# ============================================================
# 1. MEMORY-EFFICIENT DTYPES: downcast numerics + category text
# ============================================================
for c in df.select_dtypes('float64').columns:
    df[c] = pd.to_numeric(df[c], downcast='float')     # float64 -> float32 (2x)
for c in df.select_dtypes('integer').columns:
    df[c] = pd.to_numeric(df[c], downcast='integer')   # int64 -> int8 here (8x)
df['price_band'] = df['price_band'].astype('category') # object -> category (~60x)

print('after :', df.memory_usage(deep=True).sum())     # -> 784,932 bytes (~0.78 MB) => 3.7x

# ============================================================
# 2. READ IN CHUNKS: aggregate a file bigger than RAM, flat memory
# ============================================================
totals = None
for chunk in pd.read_csv('huge_sales.csv',
                         usecols=['region', 'amount'],   # read only needed columns
                         chunksize=1_000_000):           # 1M rows at a time
    part = chunk.groupby('region')['amount'].sum()
    totals = part if totals is None else totals.add(part, fill_value=0)
print(totals)   # exact global sum-by-region, never holding the whole file

# ============================================================
# 3. PARQUET: columnar format, read only the columns you need
# ============================================================
df.to_parquet('housing.parquet')                          # compressed, columnar
sub = pd.read_parquet('housing.parquet',
                      columns=['MedInc', 'price_band'])    # other columns never read

# ============================================================
# 4. GRADUATE: Polars lazy scan (filter + column choice pushed into the read)
# ============================================================
result = (
    pl.scan_parquet('housing.parquet')      # lazy: nothing read yet
      .filter(pl.col('MedInc') > 5.0)        # predicate pushed down
      .group_by('price_band')
      .agg(pl.col('MedInc').mean().alias('avg_medinc'))
      .collect()                             # only now does it read the needed data
)
print(result)
# For genuinely cluster-scale data, the Dask analog is:
#   import dask.dataframe as dd
#   dd.read_parquet('housing.parquet')[['MedInc','price_band']].groupby('price_band').mean().compute()`
  };

  window.CODEVIZ["dw-big-data"] = {
    question: "How do you READ a before/after memory chart — and what do the different shapes tell you about WHERE the savings come from (or whether a downcast just corrupted your data)?",
    charts: [
      {
        type: "bars",
        title: "Mixed frame: real before/after by dtype group (MB) — the healthy case",
        labels: ["floats before", "floats after", "int before", "int after", "text before", "text after", "TOTAL before", "TOTAL after"],
        values: [1.49, 0.74, 0.17, 0.02, 1.27, 0.02, 2.92, 0.78],
        valueLabels: ["1.49", "0.74", "0.17", "0.02", "1.27", "0.02", "2.92", "0.78"],
        colors: ["#ff7b72", "#7ee787", "#ff7b72", "#7ee787", "#ff7b72", "#7ee787", "#ff7b72", "#7ee787"],
        interpret: "<b>Read it left to right in pairs:</b> each red bar is a dtype group BEFORE, the green bar right of it is the same group AFTER. The height drop within a pair is that group's saving. Floats only halve (1.49&rarr;0.74, the float64&rarr;float32 2x ceiling); the integer drops ~8x; the <b>text column collapses ~60x</b> (1.27&rarr;0.02) because category stores each label once. The final pair is the whole frame: 2.92&rarr;0.78 MB, a <b>3.7x cut</b> with zero information lost. Real numbers from fetch_california_housing (20,640 rows)."
      },
      {
        type: "bars",
        title: "Text-dominated frame: category is almost the WHOLE win (illustrative)",
        labels: ["floats before", "floats after", "text before", "text after", "TOTAL before", "TOTAL after"],
        values: [0.40, 0.20, 8.0, 0.10, 8.40, 0.30],
        valueLabels: ["0.40", "0.20", "8.00", "0.10", "8.40", "0.30"],
        colors: ["#ff7b72", "#7ee787", "#ff7b72", "#7ee787", "#ff7b72", "#7ee787"],
        interpret: "<b>Illustrative, but the common real shape</b> for log/event data: one low-cardinality text column (country, status code, URL) towers over everything else. The float pair barely moves; the text pair collapses from 8.0 to 0.1 MB. When you see one giant red bar shrink to almost nothing, the lesson is: <b>profile first with memory_usage(deep=True)</b> and chase the dominant object column — downcasting the small numeric columns would have been a rounding error here."
      },
      {
        type: "bars",
        title: "All-numeric frame: modest 2x, no dramatic collapse (illustrative)",
        labels: ["floats before", "floats after", "int before", "int after", "TOTAL before", "TOTAL after"],
        values: [4.0, 2.0, 1.0, 0.5, 5.0, 2.5],
        valueLabels: ["4.00", "2.00", "1.00", "0.50", "5.00", "2.50"],
        colors: ["#ff7b72", "#ffb454", "#ff7b72", "#ffb454", "#ff7b72", "#ffb454"],
        interpret: "<b>Illustrative.</b> No repetitive text column means no category trick — every bar only halves, because the sole lever left is byte WIDTH (float64&rarr;float32, a wider int&rarr;a narrower int). The total caps near 2x. The orange (not green) AFTER bars are a reminder this is a real-but-bounded win: if you were hoping for 10x here, you were hoping for the category collapse that this frame can't give you."
      },
      {
        type: "bars",
        title: "Overflow: int8 downcast that CORRUPTED the column (illustrative)",
        labels: ["int memory before", "int memory after", "max value before", "max value after"],
        values: [4.0, 0.5, 300, 44],
        valueLabels: ["4.0 MB", "0.5 MB", "300 (true)", "44 (WRONG)"],
        colors: ["#9aa7b4", "#9aa7b4", "#7ee787", "#ff7b72"],
        interpret: "<b>Illustrative warning case.</b> The two grey bars on the left show the memory DID shrink 8x — the win you wanted. But the two bars on the right show the catch: a true max of 300 doesn't fit in int8 (range -128..127), so it silently <b>wrapped around to 44</b>. The green&rarr;red flip is the tell: smaller memory, corrupted values. Always check the column's actual min/max first, or let pd.to_numeric(downcast=...) pick the smallest SAFE width."
      }
    ],
    caption: "",
    code: `import numpy as np
import pandas as pd
from sklearn.datasets import fetch_california_housing

# Real bundled dataset: 20,640 rows of California housing.
d = fetch_california_housing(as_frame=True)
df = d.frame.copy()

# Add a low-cardinality TEXT column (5 labels) and a small-range INTEGER column,
# both stored with pandas' memory-hungry defaults (object / int64).
df['price_band'] = pd.cut(df['MedHouseVal'], bins=[0, 1, 2, 3, 4, 6],
                          labels=['very_low', 'low', 'mid', 'high', 'very_high']).astype(object)
rng = np.random.RandomState(0)
df['county_code'] = rng.randint(0, 58, size=len(df)).astype('int64')

# ---- BEFORE: group memory by dtype (deep=True counts real string size) ----
mb = df.memory_usage(deep=True)
floats_b = sum(mb[c] for c in df.select_dtypes('float64').columns)
int_b    = mb['county_code']
text_b   = mb['price_band']
total_b  = mb.sum()

# ---- Downcast numerics + convert text to category ----
df2 = df.copy()
for c in df2.select_dtypes('float64').columns:
    df2[c] = pd.to_numeric(df2[c], downcast='float')      # float64 -> float32
df2['county_code'] = pd.to_numeric(df2['county_code'], downcast='integer')  # -> int8
df2['price_band']  = df2['price_band'].astype('category') # object -> category

# ---- AFTER ----
mb2 = df2.memory_usage(deep=True)
floats_a = sum(mb2[c] for c in df2.select_dtypes('float32').columns)
int_a    = mb2['county_code']
text_a   = mb2['price_band']
total_a  = mb2.sum()

for name, b, a in [('floats', floats_b, floats_a), ('int', int_b, int_a),
                   ('text', text_b, text_a), ('TOTAL', total_b, total_a)]:
    print(f'{name:7s} before {b/1e6:6.2f} MB  after {a/1e6:6.2f} MB')
# floats  before   1.49 MB  after   0.74 MB
# int     before   0.17 MB  after   0.02 MB
# text    before   1.27 MB  after   0.02 MB
# TOTAL   before   2.92 MB  after   0.78 MB   (3.7x smaller)
print('reduction:', round(total_b / total_a, 2), 'x')   # -> 3.72 x`
  };
})();
