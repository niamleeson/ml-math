/* Data Wrangling — "Getting data in".
   Self-contained: lesson + CODE + CODEVIZ merged by id "dw-getting-data-in". */
(function () {
  window.LESSONS.push({
    id: "dw-getting-data-in",
    title: "Getting data in: reading from every source and format",
    tagline: "Pull raw data out of CSV, JSON, Excel, SQL, web APIs, and Parquet into one clean DataFrame — without silently corrupting it.",
    module: "Data Wrangling",
    prereqs: ["skill-data-audit", "met-data-quality"],

    whenToUse:
      `<p>This is the <b>very first</b> step of any data project: before you can audit, clean, or
       engineer features, you have to <b>load the raw data into memory</b> as a DataFrame (a table with
       named, typed columns). Real data almost never arrives as one tidy file &mdash; you get a CSV export
       here, a JSON response from an API there, an Excel sheet a colleague emailed, and a few tables living
       in a SQL database. Each needs a different reader.</p>
       <p><b>Pick the format/source for the job:</b></p>
       <ul>
         <li><b>CSV (Comma-Separated Values)</b> &mdash; the universal text format. Everyone can open it,
         but it carries no type information and is full of delimiter/quoting/encoding traps. Good for small,
         human-shareable exports.</li>
         <li><b>JSON (JavaScript Object Notation)</b> &mdash; the language of <b>web APIs</b>. Naturally
         <b>nested</b> (objects inside objects). Great for hierarchical records; verbose and slow as a bulk
         storage format.</li>
         <li><b>Excel</b> &mdash; what business users actually send you. Multiple sheets, merged cells,
         header rows in odd places. Convenient for them, fiddly for you.</li>
         <li><b>SQL database</b> &mdash; where transactional / production data lives. You read it with a
         query, so you can filter and join <b>before</b> the data ever reaches Python.</li>
         <li><b>Parquet</b> &mdash; a <b>columnar</b>, compressed binary format. The right choice for
         <b>big</b> data: it stores types, compresses well, and lets you read only the columns you need.</li>
       </ul>`,

    application:
      `<p>Every pipeline starts here.</p>
       <ul>
         <li><b>Analytics export.</b> A product team hands you a <code>events.csv</code> dump; you read it,
         fix the encoding, parse the timestamps, and start auditing.</li>
         <li><b>Pulling from an API.</b> You hit a REST endpoint with <code>requests</code>, get JSON back,
         and <b>flatten</b> the nested response into rows.</li>
         <li><b>Production warehouse.</b> You run <code>pd.read_sql</code> against a Postgres or BigQuery
         connection so the database does the heavy filtering and you only pull what you need.</li>
         <li><b>Big columnar data.</b> A data-lake table of millions of rows is stored as Parquet; you read
         just the few columns your model uses, in a fraction of the time a CSV would take.</li>
       </ul>`,

    pitfalls:
      `<ul>
         <li><b>Wrong delimiter silently shifts columns.</b> A European CSV often uses <code>;</code> as the
         separator and <code>,</code> as the decimal point. Read it with the default comma delimiter and the
         whole row collapses into one mangled column &mdash; no error, just garbage. <i>Fix:</i> set
         <code>sep=';'</code> (and <code>decimal=','</code>) explicitly.</li>
         <li><b>Wrong encoding corrupts text (mojibake).</b> A file saved as <b>latin-1</b> read as
         <b>UTF-8</b> turns <code>café</code> into <code>cafÃ©</code>, or raises
         <code>UnicodeDecodeError</code>. <i>Fix:</i> pass the right <code>encoding=</code>; when unsure,
         detect it first. (<b>UTF-8</b> and <b>latin-1</b> are two ways of mapping bytes to characters.)</li>
         <li><b>Everything read as <code>object</code> (string).</b> One stray <code>"N/A"</code> in a numeric
         column forces the whole column to text, so <code>.mean()</code> fails. <i>Fix:</i> declare missing
         markers with <code>na_values=</code> and force types with <code>dtype=</code>.</li>
         <li><b>Dates left as strings.</b> <code>"2026-06-21"</code> stays text and won't sort or subtract.
         <i>Fix:</i> <code>parse_dates=[...]</code> at read time.</li>
         <li><b>Nested JSON not flattened.</b> <code>pd.read_json</code> on a nested response gives you
         columns full of dicts. <i>Fix:</i> <code>pd.json_normalize</code> to spread the nesting into flat
         columns.</li>
         <li><b>Huge CSV read whole into memory.</b> A multi-gigabyte CSV can exhaust RAM and crash. <i>Fix:</i>
         read in <code>chunksize=</code> pieces, select only needed columns with <code>usecols=</code>, or
         switch the source to <b>Parquet</b> and read just the columns you need.</li>
         <li><b>Not inspecting right after loading.</b> Always run <code>df.head()</code>,
         <code>df.shape</code>, and <code>df.dtypes</code> the instant data lands &mdash; that is how you
         catch every problem above before it propagates.</li>
       </ul>`,

    bigIdea:
      `<p>Reading data in looks trivial &mdash; "just call <code>read_csv</code>" &mdash; but it is where a
       surprising share of data bugs are born. The job is to take <b>heterogeneous, messy, real-world
       sources</b> (text files, API responses, spreadsheets, database tables, binary columnar files) and end
       up with one thing: a <b>clean, correctly-typed DataFrame</b> you trust.</p>
       <p>Two ideas do most of the work. First, <b>every reader has options that change correctness</b>, not
       just convenience: the delimiter, the character encoding, which strings count as missing, the column
       types, and which columns are dates. Getting these right at read time saves a dozen cleanup steps
       later. Second, <b>you must inspect immediately</b>. The cost of a wrong delimiter or encoding is that
       it fails <i>silently</i> &mdash; the file loads, no exception, but the columns are scrambled or the
       text is gibberish. A three-line look (<code>head</code>, <code>shape</code>, <code>dtypes</code>)
       catches it on contact.</p>`,

    buildup:
      `<p>Think of loading as a function: bytes on disk (or on the wire) go in, a typed table comes out. The
       reader has to make several decisions to do that mapping, and each one can go wrong.</p>
       <ul>
         <li><b>Bytes to characters.</b> A text file is just bytes. An <b>encoding</b> is the codebook that
         turns those bytes into letters. UTF-8 is today's default and covers every language; latin-1 (also
         called ISO-8859-1) is an older one-byte-per-character scheme common in legacy European exports. Pick
         the wrong codebook and accented characters decode wrong &mdash; that scrambled text is called
         <b>mojibake</b>.</li>
         <li><b>Characters to fields.</b> Inside a row, a <b>delimiter</b> marks where one field ends and the
         next begins (a comma, a semicolon, a tab). A <b>quote character</b> lets a field contain the
         delimiter (a comma inside <code>"Smith, John"</code>). Mis-set either and the row splits into the
         wrong number of columns.</li>
         <li><b>Fields to types.</b> A column of <code>"3"</code>, <code>"4"</code>, <code>"N/A"</code> is
         all text until you tell pandas that <code>"N/A"</code> means missing; only then can the rest become
         numbers. Dates are the same: text until you declare them dates.</li>
       </ul>
       <p>Nested formats add one more step. JSON from an API can have objects inside objects; the table can't
       hold a dict in a cell sensibly, so you <b>flatten</b> the nesting into flat columns first.</p>`,

    example:
      `<p>A European sales export <code>sales.csv</code> arrives. The raw bytes of its two lines are:</p>
       <p><code>id;name;amount;sold_on</code><br>
          <code>1;café;1.234,50;21/06/2026</code></p>
       <p>Watch the SAME row land four different ways as we set each option. The header line splits into
       <code>id</code>, <code>name</code>, <code>amount</code>, <code>sold_on</code> &mdash; that is the
       4-column shape we should end up with:</p>
       <table class="extable">
         <caption>One data row, read four ways &mdash; each fixed option changes what lands</caption>
         <thead>
           <tr><th>read options</th><th class="num">df.shape</th><th>amount cell</th><th>name cell</th><th>sold_on cell</th></tr>
         </thead>
         <tbody>
           <tr><td class="row-h">naive (default comma)</td><td class="num">(1, 1)</td><td>&mdash;</td><td>&mdash;</td><td>&mdash;</td></tr>
           <tr><td class="row-h">+ sep=';'</td><td class="num">(1, 4)</td><td>"1.234,50" (text)</td><td>café</td><td>"21/06/2026" (text)</td></tr>
           <tr><td class="row-h">+ thousands='.', decimal=','</td><td class="num">(1, 4)</td><td class="num">1234.50</td><td>café</td><td>"21/06/2026" (text)</td></tr>
           <tr><td class="row-h">+ encoding='latin-1', parse_dates</td><td class="num">(1, 4)</td><td class="num">1234.50</td><td>café</td><td>2026-06-21</td></tr>
         </tbody>
       </table>
       <ul class="steps">
         <li><b>Naive read.</b> <code>pd.read_csv('sales.csv')</code> splits on commas, but there are none, so
         all four fields stay glued together in <b>one</b> column. The count is
         <code>columns = 1</code> when you expected <code>4</code> &mdash; the row 1 of the table. No error is
         raised; <code>df.shape == (1, 1)</code> is the only tell.</li>
         <li><b>Right delimiter.</b> Add <code>sep=';'</code>. Now pandas splits the row into
         <code>4</code> fields, so <code>df.shape == (1, 4)</code> (row 2). But <code>amount</code> is still the
         <i>string</i> <code>"1.234,50"</code>.</li>
         <li><b>European number.</b> In <code>"1.234,50"</code> the dot is the thousands separator and the comma
         is the decimal point. With <code>thousands='.'</code> and <code>decimal=','</code> pandas reads it as
         the arithmetic <code>1234 + 0.50 = 1234.50</code> &mdash; a real float (row 3).</li>
         <li><b>Encoding + dates.</b> The file was saved as latin-1; read as UTF-8 the bytes for
         <code>café</code> would decode to <code>cafÃ©</code> (mojibake), so pass <code>encoding='latin-1'</code>.
         Then <code>parse_dates=['sold_on']</code> with day-first turns the text <code>"21/06/2026"</code> into
         the timestamp <code>2026-06-21</code> you can sort and subtract (row 4).</li>
       </ul>
       <p>One file, four options &mdash; and the shape went from a useless <code>(1, 1)</code> to a clean
       <code>(1, 4)</code> with a numeric <code>1234.50</code> and a real date. Get them right at read time and
       the rest of the project starts from clean ground.</p>`,

    derivation:
      `<p><b>Why the four read options each change the result &mdash; one pipeline, traced with real bytes.</b>
       A reader is a chain of four decisions; the value you end up with is whatever survives all four. Take the
       single raw row <code>1;café;1.234,50;21/06/2026</code> and walk it through, naming every option:</p>
       <ul class="steps">
         <li><b>Step 1 &mdash; bytes &rarr; characters (the <code>encoding</code>).</b> The file is a string of
         bytes. The accented <code>é</code> was written in <b>latin-1</b> as the single byte <code>0xE9</code>
         (decimal <code>233</code>). Decode that one byte as <b>UTF-8</b> and it is illegal as a stand-alone byte,
         so pandas either errors or substitutes &mdash; you get <code>cafÃ©</code> (the byte <code>0xE9</code>
         mis-read as two characters). With <code>encoding='latin-1'</code> the byte maps straight to
         <code>é</code>. <i>Outcome of step 1: the text is either right (<code>café</code>) or already
         corrupted, before any splitting happens.</i></li>
         <li><b>Step 2 &mdash; characters &rarr; fields (the <code>sep</code>).</b> Count the separators. The row
         contains <b>3</b> semicolons, so a correct split yields <code>3 + 1 = 4</code> fields. The default
         <code>sep=','</code> finds <b>0</b> commas, so it produces <code>0 + 1 = 1</code> field &mdash; the whole
         line in one cell. That is exactly why <code>df.shape</code> reads <code>(1, 1)</code> instead of
         <code>(1, 4)</code>: <i>columns = (number of delimiters found) + 1</i>.</li>
         <li><b>Step 3 &mdash; field text &rarr; number (<code>thousands</code>, <code>decimal</code>).</b> The
         amount field is the <i>string</i> <code>"1.234,50"</code>. Pandas needs to know which symbol is which.
         With <code>thousands='.'</code> it deletes the dot used for grouping, leaving <code>"1234,50"</code>;
         with <code>decimal=','</code> it reads the comma as the decimal point, giving the float
         <code>1234 + 50/100 = 1234.50</code>. Get either option wrong and the field stays text (or parses as the
         wrong number, e.g. <code>1.234</code>).</li>
         <li><b>Step 4 &mdash; field text &rarr; date (<code>parse_dates</code>).</b> <code>"21/06/2026"</code> is
         day-first. Parsed as a date it becomes the timestamp <code>2026-06-21</code>, on which
         <code>max - min</code> and sorting work. Left as text, <code>"21/06/2026" &lt; "21/07/2026"</code> only
         happens to sort right by luck of the digits; <code>"02/01/2026"</code> vs <code>"21/06/2025"</code>
         would sort wrong. <i>So the date option is about correctness, not convenience.</i></li>
       </ul>
       <p><b>Putting the steps together as a count.</b> Each option fixes exactly one decision, and a wrong
       decision is silent &mdash; no exception, just a degraded value. Starting from a useless
       <code>(1, 1)</code> with mojibake and two text fields, applying all four options in turn lands the clean
       <code>(1, 4)</code> row <code>(1, "café", 1234.50, 2026-06-21)</code>. The general rule falls out of
       step 2: for any delimiter-separated line, <b>columns parsed = delimiters found + 1</b> &mdash; so a
       table you expect to be wide showing up as one column is a guaranteed delimiter mismatch. $\\blacksquare$</p>
       <table class="extable">
         <caption>Each option repairs one stage of the pipeline (same raw row throughout)</caption>
         <thead>
           <tr><th>stage</th><th>option</th><th>value before</th><th>value after</th></tr>
         </thead>
         <tbody>
           <tr><td class="row-h">bytes &rarr; chars</td><td><code>encoding='latin-1'</code></td><td>cafÃ© (mojibake)</td><td>café</td></tr>
           <tr><td class="row-h">chars &rarr; fields</td><td><code>sep=';'</code></td><td>1 column</td><td class="num">4 columns</td></tr>
           <tr><td class="row-h">field &rarr; number</td><td><code>thousands='.', decimal=','</code></td><td>"1.234,50" (text)</td><td class="num">1234.50</td></tr>
           <tr><td class="row-h">field &rarr; date</td><td><code>parse_dates=['sold_on']</code></td><td>"21/06/2026" (text)</td><td>2026-06-21</td></tr>
         </tbody>
       </table>`,

    practice: [
      {
        q: `You read a colleague's CSV with <code>pd.read_csv('data.csv')</code>. It loads with no error, but <code>df.shape</code> shows only one column and every row's text is jammed together with semicolons. What happened and how do you fix it?`,
        steps: [
          { do: `Inspect immediately with <code>df.shape</code> and <code>df.head()</code>.`, why: `A one-column result on data that should have many columns is the tell-tale sign of a delimiter mismatch.` },
          { do: `Recognize the file uses <code>;</code> as the separator (common in European exports), but <code>read_csv</code> defaulted to a comma.`, why: `With the wrong delimiter, pandas never splits the row, so the whole line becomes a single field. It is silent &mdash; no exception is raised.` },
          { do: `Re-read with <code>pd.read_csv('data.csv', sep=';')</code> (add <code>decimal=','</code> if numbers use a comma decimal point).`, why: `Setting the actual delimiter makes pandas split each row into the correct columns.` }
        ],
        answer: `<p>The <b>delimiter was wrong</b>: the file is semicolon-separated but the default reader split on commas, so each row collapsed into one column &mdash; <b>silently</b>, with no error. The fix is to pass the real separator: <code>pd.read_csv('data.csv', sep=';')</code> (plus <code>decimal=','</code> / <code>thousands='.'</code> for European numbers). The lesson: always check <code>df.shape</code> and <code>df.head()</code> the moment data loads.</p>`
      },
      {
        q: `An API returns JSON where each user record looks like <code>{"id": 1, "name": "Ada", "address": {"city": "London", "zip": "EC1"}}</code>. You call <code>pd.read_json(...)</code> and the <code>address</code> column is full of Python dicts. How do you get flat <code>address.city</code> and <code>address.zip</code> columns?`,
        steps: [
          { do: `Notice the data is <b>nested</b>: <code>address</code> is an object inside each record, so a plain read leaves a dict in the cell.`, why: `A DataFrame cell holding a dict can't be filtered, grouped, or fed to a model &mdash; the nesting must be flattened.` },
          { do: `Use <code>pd.json_normalize(records)</code> instead of (or after) <code>read_json</code>.`, why: `<code>json_normalize</code> walks the nested structure and spreads each leaf into its own flat column.` },
          { do: `The nested keys become dotted columns: <code>address.city</code>, <code>address.zip</code>.`, why: `Now every value is a flat, addressable column you can work with directly.` }
        ],
        answer: `<p>Flatten it with <code>pd.json_normalize(records)</code>, which turns the nested <code>address</code> object into flat <code>address.city</code> and <code>address.zip</code> columns. Plain <code>pd.read_json</code> keeps the nesting and leaves dicts in cells; <code>json_normalize</code> is the tool for nested API responses (use the <code>record_path</code> / <code>meta</code> arguments for lists nested deeper inside the records).</p>`
      },
      {
        q: `You have a 12 GB CSV of event logs but your laptop has 16 GB of RAM. You only need three of its forty columns. <code>pd.read_csv(path)</code> crashes the kernel. What are two ways to load it, and what longer-term fix removes the problem?`,
        steps: [
          { do: `Understand the crash: <code>read_csv</code> with no options loads the <b>entire</b> file (all 40 columns, all rows) into memory at once.`, why: `12 GB of CSV expands further in memory, exhausting RAM.` },
          { do: `Read only the columns you need with <code>usecols=['a','b','c']</code>, and/or process in pieces with <code>chunksize=</code>.`, why: `<code>usecols</code> cuts the width to 3/40 of the data; <code>chunksize</code> streams the rows so only one chunk is in memory at a time.` },
          { do: `Longer term, store the data as <b>Parquet</b> and read just those columns.`, why: `Parquet is columnar and compressed, so reading 3 columns touches only those columns on disk and is far smaller and faster than CSV.` }
        ],
        answer: `<p>Two immediate fixes: <b>select columns</b> with <code>usecols=[...]</code> so you only load 3 of 40, and/or <b>stream</b> with <code>chunksize=</code> so only one block of rows sits in memory at once. The durable fix is to <b>convert the source to Parquet</b> &mdash; a columnar, compressed format where reading a few columns is cheap. CSV forces you to read the whole file; Parquet does not.</p>`
      }
    ]
  });

  window.CODE["dw-getting-data-in"] = {
    lib: "pandas (+ requests, sqlalchemy)",
    runnable: false,
    explain: `<p>One reader per source, with the options that actually keep the data correct. The pattern is
      always the same: <b>read with the right options</b>, then <b>inspect immediately</b>
      (<code>head</code> / <code>shape</code> / <code>dtypes</code>). The Parquet and SQL sections need extra
      packages (<code>pyarrow</code>, a database driver) and a live connection, so this is
      <code>runnable:false</code> &mdash; treat it as a recipe you adapt to your own files and endpoints.</p>`,
    code: `import pandas as pd
import requests

# ============================================================
# 1) CSV -- the trap-filled universal text format
# ============================================================
df = pd.read_csv(
    "sales.csv",
    sep=";",                 # this export is semicolon-separated, not comma
    encoding="utf-8",        # how bytes -> characters (see encoding fix below)
    na_values=["N/A", "NA", "-", "?"],   # treat these strings as missing
    dtype={"zip": "string"},             # keep ZIP codes as text (leading zeros!)
    parse_dates=["sold_on"], # turn the date column from text into real timestamps
    thousands=".", decimal=",",          # European numbers: 1.234,50 -> 1234.50
)

# INSPECT THE MOMENT IT LOADS -- this catches wrong delimiter / encoding instantly.
print(df.shape)     # (rows, cols): a (n, 1) shape screams "wrong delimiter"
print(df.head())    # eyeball a few rows
print(df.dtypes)    # every column object/string? probably a parsing problem

# --- Fixing an ENCODING error ---------------------------------
# A latin-1 file read as UTF-8 raises UnicodeDecodeError, or silently produces
# mojibake (cafe' -> caf-mojibake). When unsure, sniff the encoding first:
import chardet
with open("legacy.csv", "rb") as fh:
    guess = chardet.detect(fh.read(100_000))   # -> {'encoding': 'ISO-8859-1', ...}
df_legacy = pd.read_csv("legacy.csv", encoding=guess["encoding"])
# Or just try the usual fallback for old European files:
df_legacy = pd.read_csv("legacy.csv", encoding="latin-1")

# Big CSV that won't fit in RAM: read only needed columns, or stream in chunks.
cols = ["user_id", "event", "ts"]
df_small = pd.read_csv("huge_events.csv", usecols=cols)          # 3 of 40 columns
for chunk in pd.read_csv("huge_events.csv", chunksize=1_000_000):
    process(chunk)                                              # one block at a time

# ============================================================
# 2) JSON -- flat and nested (the language of web APIs)
# ============================================================
flat = pd.read_json("records.json")        # works when each record is already flat

# Nested JSON -> flatten with json_normalize so dicts become real columns:
records = [
    {"id": 1, "name": "Ada", "address": {"city": "London", "zip": "EC1"}},
    {"id": 2, "name": "Bo",  "address": {"city": "Paris",  "zip": "75001"}},
]
nested = pd.json_normalize(records)
# columns: id, name, address.city, address.zip   (nesting flattened to dotted cols)

# ============================================================
# 3) Excel -- pick the sheet and where the header row is
# ============================================================
xls = pd.read_excel("report.xlsx", sheet_name="Q2", header=1)

# ============================================================
# 4) SQL database -- let the DB filter/join BEFORE it reaches Python
# ============================================================
from sqlalchemy import create_engine
engine = create_engine("postgresql://user:pass@host:5432/sales")
query = "SELECT user_id, amount, sold_on FROM orders WHERE sold_on >= '2026-01-01'"
df_sql = pd.read_sql(query, engine, parse_dates=["sold_on"])

# ============================================================
# 5) Web API -- requests -> JSON -> DataFrame
# ============================================================
resp = requests.get("https://api.example.com/v1/users", params={"limit": 100})
resp.raise_for_status()                    # turn a 4xx/5xx into a clear error
df_api = pd.json_normalize(resp.json())    # flatten the JSON payload into a table

# ============================================================
# 6) Parquet -- columnar, compressed, types preserved (best for BIG data)
# ============================================================
df_pq = pd.read_parquet("events.parquet", columns=["user_id", "event", "ts"])
# Reading just 3 columns touches only those columns on disk -- far faster than CSV.`
  };

  window.CODEVIZ["dw-getting-data-in"] = {
    question: "Same 22,760-row table written four ways — and two ways a careless read silently mangles it. What does each cost, and how do you SEE the corruption?",
    charts: [
      {
        type: "bars",
        title: "IDEAL — on-disk size of the SAME data (MB): pick the cheap format",
        xlabel: "format",
        ylabel: "file size (MB)",
        labels: ["CSV", "JSON (records)", "CSV gzip", "Parquet"],
        values: [4.6, 16.7, 1.7, 1.3],
        valueLabels: ["4.6", "16.7", "1.7", "1.3"],
        colors: ["#58a6ff", "#ff7b72", "#7ee787", "#c89bff"],
        interpret: "<b>The reference picture.</b> Bar length is megabytes on disk for the identical (22760, 31) table. API-style JSON repeats every column name on every row, so it balloons to 16.7 MB — ~3.6x the 4.6 MB CSV (red = the costly choice). Gzip CSV (1.7 MB) and columnar Parquet (1.3 MB) are far smaller. <b>Conclude:</b> for bulk storage prefer Parquet/compressed; reserve verbose JSON for nested API payloads, not warehousing."
      },
      {
        type: "bars",
        title: "IDEAL — read time back into pandas (ms): JSON is ~6.6x slower than CSV",
        xlabel: "format",
        ylabel: "read time (ms, median)",
        labels: ["CSV", "JSON (records)", "CSV gzip", "Parquet"],
        values: [27, 175, 35, 12],
        valueLabels: ["27", "175", "35", "12"],
        colors: ["#58a6ff", "#ff7b72", "#7ee787", "#c89bff"],
        interpret: "<b>Same four formats, now timed.</b> Bar length is the median milliseconds to load the file. JSON's verbosity costs CPU too — 175 ms, ~6.6x the 27 ms CSV. Gzip adds a small decompress cost (35 ms); Parquet is fastest (12 ms) because it reads typed columns directly. <b>Conclude:</b> the size and speed bars tell the same story — the format you pick is a real engineering decision, not a detail."
      },
      {
        type: "bars",
        title: "VARIANT — wrong delimiter: (rows, cols) collapses to ONE column (illustrative)",
        xlabel: "df.shape after reading a ';'-file as comma-separated",
        ylabel: "number of columns parsed",
        labels: ["expected (sep=';')", "got (default sep=',')"],
        values: [31, 1],
        valueLabels: ["31", "1"],
        colors: ["#7ee787", "#ff7b72"],
        interpret: "<b>Illustrative — the silent failure.</b> A semicolon-separated export read with the default comma delimiter never splits the row, so all 31 columns jam into 1. No exception is raised — the only tell is <b>df.shape</b>: you expected ~31 columns (green) and got 1 (red). <b>Recognise it by:</b> a (n, 1) shape and rows of text glued together with semicolons. <b>Fix:</b> pass sep=';' (and decimal=',' for European numbers)."
      },
      {
        type: "bars",
        title: "VARIANT — one stray 'N/A' forces a numeric column to object/text (illustrative)",
        xlabel: "how the 'amount' column is typed",
        ylabel: "share of columns read as text (object), %",
        labels: ["clean read", "with stray 'N/A', no na_values"],
        values: [0, 100],
        valueLabels: ["0%", "100%"],
        colors: ["#7ee787", "#ffb454"],
        interpret: "<b>Illustrative — silent type corruption.</b> One <b>'N/A'</b> string in an otherwise numeric column makes pandas type the whole column as <b>object</b> (text), so <b>.mean()</b> fails or string-concatenates. Left bar: a clean read keeps it numeric (0% text). Right bar: the stray marker flips it to 100% text. <b>Recognise it by:</b> df.dtypes showing object where you expected float. <b>Fix:</b> declare na_values=['N/A', ...] (and dtype=) at read time."
      }
    ],
    caption: "First two charts (real numbers): sklearn's load_breast_cancer tiled to 22,760 x 31, written to CSV / JSON / gzip CSV / Parquet — JSON is 16.7 MB and ~6.6x slower to read, while Parquet is smallest and fastest. The last two charts are illustrative failure modes a careless read produces silently: a wrong delimiter collapsing (n,31) to (n,1), and a single stray 'N/A' coercing a numeric column to text. The recurring lesson lives in each 'interpret': inspect df.shape and df.dtypes the instant data lands.",
    code: `import pandas as pd, os, time, statistics
from sklearn.datasets import load_breast_cancer

# Bundled real data; tile to a realistic size so the comparison is meaningful.
base = load_breast_cancer(as_frame=True).frame      # 569 x 31
df = pd.concat([base] * 40, ignore_index=True)      # 22760 rows x 31 cols
print(df.shape)                                     # -> (22760, 31)

# Write the SAME data to three formats.
df.to_csv("bc.csv", index=False)
df.to_json("bc_records.json", orient="records")     # API style: list of row objects
df.to_csv("bc.csv.gz", index=False, compression="gzip")

# --- on-disk size (MB) ---
for f in ["bc.csv", "bc_records.json", "bc.csv.gz"]:
    print(f, round(os.path.getsize(f) / 1024 / 1024, 1), "MB")
# -> bc.csv 4.6 MB | bc_records.json 16.7 MB | bc.csv.gz 1.7 MB

# --- read time (median of several reads, ms) ---
def read_ms(fn, n=7):
    ts = []
    for _ in range(n):
        s = time.perf_counter(); fn(); ts.append(time.perf_counter() - s)
    return round(statistics.median(ts) * 1000, 1)

print("CSV     ", read_ms(lambda: pd.read_csv("bc.csv")))            # -> ~27 ms
print("JSON    ", read_ms(lambda: pd.read_json("bc_records.json")))  # -> ~175 ms
print("CSV gzip", read_ms(lambda: pd.read_csv("bc.csv.gz")))         # -> ~35 ms

# Sanity: all three reload to the identical table.
assert pd.read_csv("bc.csv").shape == pd.read_json("bc_records.json").shape == (22760, 31)`
  };
})();
