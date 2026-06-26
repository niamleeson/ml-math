/* Data Wrangling — "Getting every column's dtype right".
   Self-contained: lesson + CODE + CODEVIZ merged by id "dw-data-types". */
(function () {
  window.LESSONS.push({
    id: "dw-data-types",
    title: "Data types: get every column's dtype right",
    tagline: "Numbers stuck as text, booleans as \"Yes\"/\"No\", dates as strings — fix the dtypes before you do anything else.",
    module: "Data Wrangling",
    prereqs: ["skill-data-audit"],

    whenToUse:
      `<p>Do this <b>right after you load and inspect</b> the data, and <b>before</b> any math, sorting,
       grouping, joining, or plotting. The dtype (data type) of a column is the single fact pandas uses to
       decide what "add", "sort", or "group" even mean. If the dtype is wrong, every later step is quietly
       wrong too.</p>
       <p>Run <code>df.dtypes</code> and <code>df.info()</code> the moment the file is in. You are checking
       one thing per column: is its type what the <i>meaning</i> of the column says it should be?</p>
       <ul>
         <li><b>Numeric</b> (a count or amount you will do math on) &rarr; an int or float dtype
         (<code>int64</code>, <code>float64</code>), not <code>object</code>.</li>
         <li><b>Categorical</b> (a label from a small fixed set: city, plan, status) &rarr; the pandas
         <code>category</code> dtype.</li>
         <li><b>Datetime</b> (a timestamp) &rarr; <code>datetime64</code>, not a string.</li>
         <li><b>Boolean</b> (a true/false flag) &rarr; <code>bool</code>, not the words "Yes"/"No".</li>
         <li><b>String</b> (free text: names, comments) &rarr; <code>object</code> (or the newer
         <code>string</code> dtype) is correct here &mdash; leave it.</li>
       </ul>`,

    application:
      `<p>This is the first thing that goes wrong with real exports.</p>
       <ul>
         <li><b>CSV (Comma-Separated Values) files</b> have no type information at all &mdash; every cell is
         text until something parses it. A spreadsheet that wrote <code>"1,234"</code> or <code>"$5"</code>
         or <code>"12%"</code> lands as a <b>string</b> column.</li>
         <li><b>Database dumps</b> often store flags as <code>"Yes"</code>/<code>"No"</code> or
         <code>"Y"</code>/<code>"N"</code> instead of booleans, and dates as ISO strings.</li>
         <li><b>JSON (JavaScript Object Notation) APIs</b> hand you everything as text or mixed types, so a
         numeric field can arrive as <code>"42"</code> in some rows and <code>42</code> in others.</li>
         <li><b>Big tables</b> with many repeated text labels (millions of rows of <code>"active"</code> /
         <code>"churned"</code>) sit as <code>object</code> columns and balloon your memory until you convert
         them to <code>category</code>.</li>
       </ul>`,

    pitfalls:
      `<ul>
         <li><b>Numbers stuck as strings.</b> A column of <code>"1,234"</code> / <code>"$5"</code> /
         <code>"12%"</code> is <code>object</code> dtype. <code>df['amount'].sum()</code> then
         <b>concatenates</b> the text (<code>"1,234" + "5" = "1,2345"</code>) instead of adding, and
         <code>.sort_values()</code> sorts <b>lexicographically</b> so <code>"100"</code> comes before
         <code>"99"</code>. The fix: strip the junk characters and run
         <code>pd.to_numeric</code>.</li>
         <li><b>Silent NaN (Not a Number) from bad coercion.</b> <code>pd.to_numeric(s,
         errors='coerce')</code> turns anything it can't parse into <code>NaN</code> instead of raising.
         Convenient, but if you forgot to strip a <code>"%"</code> the <i>whole</i> column silently becomes
         <code>NaN</code>. Always check <code>s.isna().sum()</code> before and after.</li>
         <li><b>High-memory object columns.</b> Repeated text labels stored as <code>object</code> cost one
         full Python string per row. Converting to <code>category</code> stores each label <b>once</b> plus a
         tiny integer code per row &mdash; often a 50&times; shrink (you will see this below).</li>
         <li><b>category dtype surprises in joins.</b> Merging two frames on <code>category</code> columns can
         fail or fall back to <code>object</code> if their category lists differ, and grouping a
         <code>category</code> column shows <b>all</b> categories (even empty ones) by default. Convert back
         to <code>object</code> before a tricky merge if it bites you.</li>
         <li><b>Mixed-type columns.</b> If one column holds both numbers and strings, pandas keeps it as
         <code>object</code> and you lose all numeric behavior. Coerce the whole column to one type early.</li>
         <li><b>Nullable integer vs float for missing.</b> A plain <code>int64</code> column <i>cannot</i>
         hold a missing value, so the moment one row is <code>NaN</code> pandas upcasts the whole column to
         <code>float64</code> (and your IDs like <code>1001</code> become <code>1001.0</code>). Use the
         nullable <code>Int64</code> dtype (capital "I") to keep whole numbers <i>and</i> allow missing.</li>
       </ul>`,

    bigIdea:
      `<p>A pandas DataFrame is a stack of typed columns. Each column carries a <b>dtype</b> &mdash; one label
       that says what the values are and, crucially, <b>how operations behave on them</b>. The dtype is not
       cosmetic: it decides whether <code>+</code> means "add" or "glue text together", whether
       <code>&lt;</code> compares magnitudes or alphabetical order, and how many bytes each value costs.</p>
       <p>Raw data almost never arrives with the right dtypes. A CSV has no types at all; an API mixes them;
       a database stores flags as words. So the <b>first wrangling job</b> is to walk every column and force
       its dtype to match its meaning. Get this right and math, sorting, grouping, joining, and plotting all
       "just work". Get it wrong and they fail <b>silently</b> &mdash; no error, just wrong answers.</p>
       <p>The main dtypes you steer columns toward:</p>
       <ul>
         <li><b>Integer / float</b> (<code>int64</code>, <code>float64</code>, and the nullable
         <code>Int64</code>) for things you do math on.</li>
         <li><b><code>category</code></b> for labels from a small fixed set &mdash; saves memory, speeds up
         grouping, and can carry an <b>order</b> (e.g. <code>low &lt; medium &lt; high</code>).</li>
         <li><b><code>datetime64</code></b> for timestamps, unlocking date math and resampling.</li>
         <li><b><code>bool</code></b> for true/false flags.</li>
         <li><b><code>object</code> / <code>string</code></b> for genuine free text.</li>
       </ul>`,

    buildup:
      `<p>The toolkit is small &mdash; four conversion functions cover almost everything.</p>
       <p><b><code>astype</code></b> &mdash; the blunt converter. <code>s.astype('category')</code>,
       <code>s.astype('int32')</code>, <code>s.astype(bool)</code>. It assumes the values are <i>already</i>
       clean and just relabels the dtype. It raises if a value can't convert, so use it only once the column
       is tidy.</p>
       <p><b><code>pd.to_numeric(s, errors='coerce')</code></b> &mdash; the safe number parser. It turns a
       column of numeric-looking strings into real numbers, and with <code>errors='coerce'</code> it replaces
       anything unparseable with <code>NaN</code> instead of crashing. You usually clean the strings first
       with <code>str.replace</code> (drop the <code>","</code>, <code>"$"</code>, <code>"%"</code>).</p>
       <p><b><code>pd.to_datetime(s)</code></b> &mdash; the date parser. It reads
       <code>"2026-06-21"</code>, <code>"06/21/2026"</code>, and many other formats into
       <code>datetime64</code>. Pass an explicit <code>format=</code> when you can &mdash; it is far faster
       and avoids ambiguous day/month guesses.</p>
       <p><b><code>map</code> / comparison for booleans</b> &mdash; turn <code>"Yes"</code>/<code>"No"</code>
       into <code>True</code>/<code>False</code> with
       <code>s.map({'Yes': True, 'No': False})</code>, then optionally
       <code>.astype('boolean')</code> (the nullable boolean) if some values are missing.</p>
       <p>Two dtype choices deserve their own note. <b><code>category</code></b> stores each distinct label
       once in a lookup table and keeps only a small integer <b>code</b> per row &mdash; that is the memory
       and speed win. An <b>ordered</b> category (<code>CategoricalDtype(['low','medium','high'],
       ordered=True)</code>) also lets you sort and compare with <code>&lt;</code> meaningfully.
       <b><code>Int64</code></b> (the nullable integer) lets an integer column hold <code>NaN</code> without
       being upcast to float, so identifiers stay whole.</p>`,

    symbols: [
      { sym: "<code>dtype</code>", desc: "the type label on a column (e.g. <code>int64</code>, <code>float64</code>, <code>category</code>, <code>datetime64</code>, <code>bool</code>, <code>object</code>). Decides how operations behave on the column." },
      { sym: "<code>object</code>", desc: "the catch-all dtype for arbitrary Python objects &mdash; almost always strings. Numbers stuck here behave like text." },
      { sym: "<code>NaN</code>", desc: "\"Not a Number\": pandas' missing-value marker. <code>errors='coerce'</code> produces it; a plain int column can't hold it." },
      { sym: "<code>category</code>", desc: "a dtype for a small fixed set of labels: store each label once + an integer code per row. Saves memory, speeds grouping, can be ordered." },
      { sym: "<code>Int64</code>", desc: "the nullable integer dtype (capital I) &mdash; whole numbers that can also be missing, unlike plain <code>int64</code>." }
    ],

    derivation:
      `<p><b>Why a wrong dtype breaks math silently.</b></p>
       <ul class="steps">
         <li>Pandas dispatches operators on dtype. For an <code>object</code> column of strings,
         <code>+</code> is Python string concatenation, so <code>Series(["1,234","5"]).sum()</code> returns
         the text <code>"1,2345"</code> &mdash; no error, just nonsense.</li>
         <li>Ordering follows the same rule. Strings compare <b>lexicographically</b> (character by
         character), so <code>"100" &lt; "99"</code> is <code>True</code> because <code>"1" &lt; "9"</code>.
         A "sorted" table of stringified numbers is therefore mis-ordered.</li>
         <li>Fix it by parsing: strip <code>","</code>/<code>"$"</code>/<code>"%"</code> with
         <code>str.replace</code>, then <code>pd.to_numeric(..., errors='coerce')</code>. Now
         <code>+</code> adds and <code>&lt;</code> compares magnitude.</li>
         <li><b>Why category saves memory.</b> An <code>object</code> column stores a full Python string
         object per row. With $n$ rows and $k$ distinct labels of average length $L$, that is roughly
         $n\\times(\\text{overhead}+L)$ bytes. A <code>category</code> stores the $k$ labels <b>once</b> plus
         one small integer code per row: about $k\\times L + n\\times c$ bytes, where $c$ is 1, 2, or 4
         depending on how many distinct labels there are. When $k \\ll n$ (few labels, many rows) the second
         expression is far smaller &mdash; the CODEVIZ below shows a real $\\approx$50&times; drop.</li>
         <li><b>Why a missing value upcasts an int to float.</b> The <code>int64</code> type has no bit
         pattern reserved for "missing", but <code>float64</code> does (the IEEE <code>NaN</code>). So the
         instant one value goes missing, pandas must switch the whole column to <code>float64</code> to
         represent it &mdash; turning <code>1001</code> into <code>1001.0</code>. The nullable
         <code>Int64</code> dtype carries a separate mask of which entries are missing, so it keeps whole
         numbers <i>and</i> allows gaps. $\\blacksquare$</li>
       </ul>`,

    example:
      `<p>Five tiny columns, each with the classic problem.</p>
       <ul class="steps">
         <li><b><code>revenue</code></b> = <code>["$1,234", "$5", "$78"]</code> &rarr; dtype
         <code>object</code>. <code>.sum()</code> glues text. Strip <code>"$"</code> and <code>","</code>,
         then <code>pd.to_numeric</code> &rarr; <code>[1234, 5, 78]</code>, dtype <code>int64</code>;
         <code>.sum()</code> now gives <code>1317</code>.</li>
         <li><b><code>growth</code></b> = <code>["12%", "5%", "120%"]</code> &rarr; strip <code>"%"</code>,
         <code>to_numeric</code>, divide by 100 &rarr; <code>[0.12, 0.05, 1.20]</code>, dtype
         <code>float64</code>.</li>
         <li><b><code>is_paid</code></b> = <code>["Yes", "No", "Yes"]</code> &rarr;
         <code>.map({'Yes':True,'No':False})</code> &rarr; <code>[True, False, True]</code>, dtype
         <code>bool</code>. Now <code>.sum()</code> counts the trues (<code>2</code>) and
         <code>.mean()</code> gives the rate (<code>0.67</code>).</li>
         <li><b><code>signup</code></b> = <code>["2026-01-05", "2026-03-20", "2026-06-01"]</code> &rarr;
         <code>pd.to_datetime</code> &rarr; dtype <code>datetime64</code>. Now
         <code>signup.dt.month</code> and date subtraction work.</li>
         <li><b><code>plan</code></b> = <code>["free","pro","free","free","pro", ...]</code> (many repeats)
         &rarr; <code>.astype('category')</code>. Same values, a fraction of the memory, and faster
         <code>groupby('plan')</code>.</li>
       </ul>`,

    practice: [
      {
        q: `A column <code>price</code> reads <code>["$1,200", "$950", "$3,499"]</code>. You call <code>df['price'].sum()</code> and get <code>"$1,200$950$3,499"</code>, and <code>df.sort_values('price')</code> puts the <code>$1,200</code> row above the <code>$950</code> row. Diagnose and fix.`,
        steps: [
          { do: `Check the dtype with <code>df['price'].dtype</code> &mdash; it is <code>object</code> (strings).`, why: `For an object column, <code>+</code> concatenates and <code>&lt;</code> compares text lexicographically, which is exactly what you observed.` },
          { do: `Strip the junk: <code>s = df['price'].str.replace('$','',regex=False).str.replace(',','',regex=False)</code>.`, why: `<code>pd.to_numeric</code> only parses bare digits; the <code>$</code> and <code>,</code> must go first.` },
          { do: `Parse to numbers: <code>df['price'] = pd.to_numeric(s, errors='coerce')</code>, then check <code>df['price'].isna().sum()</code> is 0.`, why: `Now the dtype is numeric, so <code>.sum()</code> adds and sorting compares magnitude. The NaN check confirms nothing failed to parse silently.` }
        ],
        answer: `<p>The column is <b><code>object</code> dtype (strings)</b>, so <code>+</code> concatenates and sorting is lexicographic (<code>"$1,200" &lt; "$950"</code> because <code>"1" &lt; "9"</code>). Fix: <code>str.replace</code> to drop <code>"$"</code> and <code>","</code>, then <code>pd.to_numeric(..., errors='coerce')</code>, then confirm <code>.isna().sum()</code> is 0. After that <code>.sum()</code> gives <code>5649</code> and the sort is correct.</p>`
      },
      {
        q: `You load a 2-million-row table. One column <code>region</code> holds 6 distinct text labels repeated millions of times and <code>df.info()</code> shows it eating hundreds of megabytes. A <code>customer_id</code> column is whole numbers but a few rows are missing, and pandas shows it as <code>float64</code> with values like <code>10042.0</code>. Fix both.`,
        steps: [
          { do: `Convert <code>region</code> with <code>df['region'] = df['region'].astype('category')</code>.`, why: `With only 6 distinct labels over millions of rows, category stores each label once plus a 1-byte code per row &mdash; a huge memory drop and faster groupby.` },
          { do: `Convert <code>customer_id</code> with <code>df['customer_id'] = df['customer_id'].astype('Int64')</code>.`, why: `The nullable <code>Int64</code> dtype keeps the IDs as whole numbers while still allowing the missing rows, so <code>10042.0</code> goes back to <code>10042</code> and <code>&lt;NA&gt;</code> marks the gaps.` },
          { do: `Re-run <code>df.info(memory_usage='deep')</code> to confirm the shrink and the new dtypes.`, why: `<code>deep</code> measures the true object-string cost so you can see the before/after honestly.` }
        ],
        answer: `<p><b><code>region</code></b> is a high-memory <code>object</code> column: convert it to <b><code>category</code></b> (<code>astype('category')</code>) &mdash; few labels, many rows, so memory collapses and grouping speeds up. <b><code>customer_id</code></b> was upcast to <code>float64</code> because plain <code>int64</code> can't hold the missing rows; convert it to the nullable <b><code>Int64</code></b> so the IDs stay whole and the gaps become <code>&lt;NA&gt;</code>.</p>`
      },
      {
        q: `A survey column <code>satisfaction</code> holds <code>"low"</code>, <code>"medium"</code>, <code>"high"</code>. You convert it with <code>astype('category')</code>, then try <code>df[df['satisfaction'] &gt; 'low']</code> and it errors or behaves alphabetically. What did you miss?`,
        steps: [
          { do: `Recognize that a plain <code>category</code> is <b>unordered</b> by default.`, why: `Without an order, <code>&gt;</code> has no defined meaning, and if compared as text it would order <code>"high" &lt; "low" &lt; "medium"</code> alphabetically &mdash; wrong.` },
          { do: `Build an ordered dtype: <code>from pandas.api.types import CategoricalDtype; cat = CategoricalDtype(['low','medium','high'], ordered=True)</code>.`, why: `This pins the real ranking <code>low &lt; medium &lt; high</code> onto the category.` },
          { do: `Apply it: <code>df['satisfaction'] = df['satisfaction'].astype(cat)</code>, then <code>df[df['satisfaction'] &gt; 'low']</code> works.`, why: `Now comparisons and sorting follow the meaningful order, not the alphabet.` }
        ],
        answer: `<p>You missed the <b>order</b>. A plain <code>category</code> is unordered, so <code>&gt;</code> is undefined (or falls back to alphabetical, which mis-ranks <code>"high"</code>). Build an <b>ordered</b> category with <code>CategoricalDtype(['low','medium','high'], ordered=True)</code> and apply it; then <code>low &lt; medium &lt; high</code> holds and comparisons/sorting are correct.</p>`
      }
    ]
  });

  window.CODE["dw-data-types"] = {
    lib: "pandas",
    runnable: false,
    explain: `<p>A small messy frame with every classic problem &mdash; numbers stored as <code>"1,234"</code> / <code>"$5"</code> / <code>"12%"</code>, a boolean as <code>"Yes"</code>/<code>"No"</code>, dates as strings, and high-memory text labels. We inspect with <code>df.dtypes</code>, then fix each column with <code>str.replace</code> + <code>pd.to_numeric</code> + <code>pd.to_datetime</code> + <code>astype('category')</code>, handle a nullable integer ID, and watch <code>.memory_usage(deep=True)</code> shrink after the <code>category</code> conversion. The data is inline so the whole script runs as-is.</p>`,
    code: `import numpy as np
import pandas as pd

# --- A messy frame, exactly as a CSV / API would hand it to you ---
df = pd.DataFrame({
    'customer_id': ['1001', '1002', '1003', None, '1005'],   # whole-number IDs, one missing
    'revenue':     ['$1,234', '$5', '$78', '$2,400', '$960'], # currency strings
    'growth':      ['12%', '5%', '120%', '0%', '8%'],         # percent strings
    'is_paid':     ['Yes', 'No', 'Yes', 'Yes', 'No'],         # boolean as words
    'signup':      ['2026-01-05','2026-03-20','2026-06-01',   # dates as strings
                    '2026-02-14','2026-05-30'],
    'plan':        ['free','pro','free','enterprise','pro'],  # small fixed set -> category
})

print(df.dtypes)        # EVERYTHING is 'object' -> math/sort/group are all broken
# customer_id    object
# revenue        object   ... etc.

# --- 1. Numbers stuck as strings: strip junk chars, then coerce to numeric ---
df['revenue'] = pd.to_numeric(
    df['revenue'].str.replace('$', '', regex=False)
                 .str.replace(',', '', regex=False),
    errors='coerce')                                   # -> int/float, NaN if unparseable
assert df['revenue'].isna().sum() == 0                 # always check the coercion!

df['growth'] = pd.to_numeric(
    df['growth'].str.replace('%', '', regex=False),
    errors='coerce') / 100.0                            # 12% -> 0.12

# --- 2. Boolean stored as 'Yes'/'No' ---
df['is_paid'] = df['is_paid'].map({'Yes': True, 'No': False}).astype(bool)

# --- 3. Date strings -> datetime64 (pass format for speed + no ambiguity) ---
df['signup'] = pd.to_datetime(df['signup'], format='%Y-%m-%d')

# --- 4. Nullable integer: keep IDs whole AND allow the missing row ---
df['customer_id'] = pd.to_numeric(df['customer_id']).astype('Int64')  # 1001, not 1001.0
# (plain int64 would upcast to float the moment a value is missing)

# --- 5. Low-cardinality text -> category (memory + faster groupby) ---
before = df['plan'].memory_usage(deep=True)
df['plan'] = df['plan'].astype('category')
after  = df['plan'].memory_usage(deep=True)
print('plan memory  before:', before, ' after:', after)   # after is much smaller

print(df.dtypes)
# customer_id            Int64
# revenue               int64
# growth              float64
# is_paid                bool
# signup       datetime64[ns]
# plan               category

# Now everything WORKS:
print(df['revenue'].sum())              # 4677 (adds, not concatenates)
print(df['is_paid'].mean())             # 0.6  (fraction paid)
print(df.groupby('plan')['revenue'].mean())   # group by the category
print(df['signup'].dt.month.tolist())   # date math unlocked`
  };

  window.CODEVIZ["dw-data-types"] = {
    question: "What does fixing dtypes actually buy you — and what do the failure modes (memory blow-up, silent NaN from bad coercion, int upcast to float) look like on a chart?",
    charts: [
      {
        type: "bars",
        title: "Ideal: memory per column (KB) — object dtype (red) vs category / int32 (green)",
        xlabel: "column",
        series: [
          { name: "object dtype (before)", color: "#ff7b72", points: [["city", 316.7], ["plan", 305.3], ["status", 307.6], ["is_paid", 290.6], ["revenue", 294.9]] },
          { name: "category / int32 (after)", color: "#7ee787", points: [["city", 5.4], ["plan", 5.3], ["status", 5.2], ["is_paid", 5.1], ["revenue", 19.5]] }
        ],
        labels: ["city", "plan", "status", "is_paid", "revenue"],
        interpret: "<b>How to read it:</b> one column per dataframe column; the <b>red</b> bar is its memory as an <code>object</code> dtype, the <b>green</b> bar after conversion. Taller = more memory. Each text column costs ~290-317 KB as object because pandas stores a full Python string per row; converting the four low-cardinality text columns to <code>category</code> drops them to ~5 KB (each label stored once + a 1-byte code per row, a ~58x shrink), and parsing revenue to int32 takes it from 295 to 19.5 KB. <b>Conclusion:</b> right dtypes shrink this frame ~37x (1515 -> 40.5 KB). Real numbers from a 5,000-row frame via <code>.memory_usage(deep=True)</code>."
      },
      {
        type: "bars",
        title: "Variant: category win shrinks as cardinality rises (k distinct labels, 5,000 rows)",
        xlabel: "distinct labels in the column",
        ylabel: "memory (KB)",
        labels: ["k=3", "k=50", "k=500", "k=5000 (all unique)"],
        values: [5.2, 9.0, 45.0, 320.0],
        valueLabels: ["5.2", "9.0", "45", "320"],
        colors: ["#7ee787", "#7ee787", "#ffb454", "#ff7b72"],
        interpret: "<b>Illustrative.</b> Same 5,000-row text column, but how many <b>distinct</b> labels it holds grows left to right. <code>category</code> wins big when there are few labels over many rows (green, k=3): each label stored once + a tiny code per row. As k climbs the lookup table itself grows, so the saving shrinks (orange), and when every value is unique (red, k=5000) <code>category</code> is no cheaper than <code>object</code> — sometimes worse. <b>Lesson:</b> reach for <code>category</code> only for low-cardinality columns, not free-text IDs."
      },
      {
        type: "bars",
        title: "Trap: silent NaN — forgot to strip '%', so coercion nukes the whole column",
        xlabel: "column after pd.to_numeric(errors='coerce')",
        ylabel: "count of NaN (out of 5000)",
        labels: ["revenue (stripped '$')", "growth (forgot '%')"],
        values: [0, 5000],
        valueLabels: ["0", "5000"],
        colors: ["#7ee787", "#ff7b72"],
        interpret: "<b>Illustrative.</b> Each bar is how many values turned into <code>NaN</code> after <code>pd.to_numeric(s, errors='coerce')</code>. Revenue (green) was stripped of its '$' first, so 0 failed — clean parse. Growth (red) still had the '%' attached, so <b>every</b> value was unparseable and silently became NaN — no error, the whole column is gone. <b>How to catch it:</b> always compare <code>s.isna().sum()</code> before and after coercing; a sudden jump to the row count means you forgot to strip a junk character."
      },
      {
        type: "bars",
        title: "Trap: one missing value upcasts int64 -> float64 (IDs gain a '.0')",
        xlabel: "customer_id dtype",
        ylabel: "memory (KB) for 5,000 IDs",
        labels: ["int64 (no missing)", "float64 (1 missing, upcast)", "Int64 nullable (fix)"],
        values: [39.1, 39.1, 44.0],
        valueLabels: ["39.1", "39.1", "44.0"],
        colors: ["#7ee787", "#ff7b72", "#4ea1ff"],
        interpret: "<b>Illustrative.</b> The danger here isn't size, it's correctness. A plain <code>int64</code> column (green) has no bit pattern for 'missing', so the instant one row is NaN pandas upcasts the whole column to <code>float64</code> (red) — and your IDs like <code>1001</code> become <code>1001.0</code>, which breaks joins and lookups. The fix is the nullable <code>Int64</code> (blue, capital I): it carries a separate mask of which entries are missing, so IDs stay whole numbers and gaps show as <code>&lt;NA&gt;</code> — costing only a few extra KB for that mask."
      }
    ],
    caption: "",
    code: `import numpy as np
import pandas as pd

rng = np.random.RandomState(0)
n = 5000
cities = ['San Francisco','New York','Austin','Seattle','Boston','Chicago']
plans  = ['free','basic','pro','enterprise']
status = ['active','churned','trial']

df = pd.DataFrame({
    'city':    rng.choice(cities, n),
    'plan':    rng.choice(plans, n),
    'status':  rng.choice(status, n),
    'is_paid': rng.choice(['Yes','No'], n),                 # bool stored as words
    'revenue': ['$' + str(int(v)) for v in rng.gamma(2, 50, n)],  # currency strings
})

cols = ['city','plan','status','is_paid','revenue']
before = df.memory_usage(deep=True)
print('BEFORE (KB):', {c: round(before[c]/1024, 1) for c in cols})
# -> {'city': 316.7, 'plan': 305.3, 'status': 307.6, 'is_paid': 290.6, 'revenue': 294.9}

after_df = df.copy()
for c in ['city','plan','status','is_paid']:
    after_df[c] = after_df[c].astype('category')            # text -> category
after_df['revenue'] = pd.to_numeric(
    after_df['revenue'].str.replace('$','',regex=False)).astype('int32')

after = after_df.memory_usage(deep=True)
print('AFTER  (KB):', {c: round(after[c]/1024, 1) for c in cols})
# -> {'city': 5.4, 'plan': 5.3, 'status': 5.2, 'is_paid': 5.1, 'revenue': 19.5}
print('total before/after (KB):',
      round(before[cols].sum()/1024,1), '/', round(after[cols].sum()/1024,1))
# -> 1515.0 / 40.5   (~37x smaller)`
  };
})();
