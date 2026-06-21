/* Data Wrangling — "Tidy data" (Hadley Wickham).
   Self-contained: lesson + CODE + CODEVIZ merged by id "dw-tidy-data". */
(function () {
  window.LESSONS.push({
    id: "dw-tidy-data",
    title: "Tidy data: one observation per row, one variable per column",
    tagline: "Reshape messy tables into the long, tidy form that grouping, plotting, and modeling all assume.",
    module: "Data Wrangling",
    prereqs: ["skill-data-audit"],

    whenToUse:
      `<p><b>Tidy the data before you group, plot, or model.</b> Almost every downstream tool &mdash;
       <code>groupby</code>, <code>seaborn</code>, <code>scikit-learn</code> &mdash; quietly assumes a
       <b>tidy</b> table. So the moment you finish loading and inspecting a dataset, and before you write a
       single <code>groupby</code> or chart, ask: is each row one observation, and each column one variable?
       If not, reshape first.</p>
       <ul>
         <li><b>Reach for it</b> when your columns are really <i>values</i> (e.g. one column per year), when a
         single column holds two facts (e.g. <code>"male_25-34"</code>), or when one cell holds a list.</li>
         <li><b>Long (tidy) vs wide.</b> <b>Long</b> form has one row per observation and is what tools want
         for analysis. <b>Wide</b> form (a small matrix, years across the top) is for <i>human reading</i> and
         final presentation tables. You reshape between them on demand.</li>
       </ul>`,

    application:
      `<p>Reshaping is the most common move in real data work.</p>
       <ul>
         <li><b>Spreadsheets &amp; reports.</b> Exported tables almost always come wide &mdash; one column per
         month, quarter, or product. You <code>melt</code> them to long before analysis.</li>
         <li><b>Plotting.</b> <code>seaborn</code> / <code>plotly</code> want long data: one column for the
         x-value, one for the y-value, one for the series. A wide table has to be melted first or it will not
         plot the way you expect.</li>
         <li><b>Modeling.</b> <code>scikit-learn</code> wants one row per training example with features in
         columns &mdash; a tidy frame is already in that shape.</li>
         <li><b>Pivot tables for humans.</b> After computing a long summary, you <code>pivot_table</code> it
         back to wide so a person can read it at a glance.</li>
       </ul>`,

    pitfalls:
      `<ul>
         <li><b>Variables hiding in column headers.</b> Columns named <code>1999</code>, <code>2009</code>,
         <code>2019</code> are not three variables &mdash; they are three <i>values</i> of one variable,
         <code>year</code>. The fix: <code>melt</code> those columns into a single <code>year</code> column.</li>
         <li><b>One cell holding multiple values.</b> A column like <code>"male_25-34"</code> packs two
         variables (sex and age band) into one string; a column holding <code>"a,b,c"</code> packs a list into
         one cell. The fix: <code>str.split</code> to separate, and <code>explode</code> to give each list item
         its own row.</li>
         <li><b>Losing the index during a reshape.</b> <code>melt</code> drops any column you do not list in
         <code>id_vars</code>, and <code>pivot</code> moves your row labels into the index. Name your id
         columns explicitly and call <code>reset_index()</code> afterward so the identifiers survive.</li>
         <li><b>Pivot duplicate-key errors.</b> Plain <code>pivot</code> fails with
         <i>"Index contains duplicate entries"</i> when more than one row maps to the same
         row&times;column cell. Use <code>pivot_table</code> with an <code>aggfunc</code> (e.g.
         <code>"mean"</code>) to collapse the duplicates on purpose.</li>
         <li><b>Wide data silently breaking groupby and plots.</b> <code>groupby</code> needs the grouping
         variable to <i>be a column</i>; if it is smeared across headers there is nothing to group by, and a
         plot of wide data puts each year on its own line instead of on the x-axis. Both bugs vanish once the
         table is tidy.</li>
       </ul>`,

    bigIdea:
      `<p>Hadley Wickham's <b>tidy data</b> is one simple rule with three parts. In a tidy table:</p>
       <ol>
         <li>every <b>row</b> is one <b>observation</b> (one measured thing at one time);</li>
         <li>every <b>column</b> is one <b>variable</b> (one kind of measurement);</li>
         <li>every <b>cell</b> is one <b>value</b>.</li>
       </ol>
       <p>That is the whole idea. The reason it matters: tidy data is a <b>standard shape</b>, and once your
       data is in it, every analysis tool just works without reshaping in your head first. Messy data, by
       contrast, is messy in endless different ways &mdash; and each way needs its own custom fix.</p>
       <p>Wickham names the three messes you keep meeting: <b>column headers are values, not variable
       names</b> (years across the top); <b>multiple variables stored in one column</b>
       (<code>"male_25-34"</code>); and <b>values strewn across both rows and columns</b>. The cure for all
       three is the same family of <b>reshape</b> operations.</p>`,

    buildup:
      `<p>Picture a table that records one number &mdash; a GDP-per-person figure &mdash; for four countries
       across three years. People naturally write it <b>wide</b>: <code>country</code> down the side, the
       three years <code>1999</code>, <code>2009</code>, <code>2019</code> across the top, and the number in
       each cell.</p>
       <p>That table is <b>untidy</b>: the column headers <code>1999/2009/2019</code> are <i>values</i> of a
       hidden variable, <code>year</code>. There are really only three variables here &mdash;
       <code>country</code>, <code>year</code>, and the measurement &mdash; but the wide table pretends
       <code>year</code> does not exist.</p>
       <p><b>Melt (wide &rarr; long).</b> <code>pd.melt</code> takes the year columns and stacks them: it keeps
       <code>country</code> as an identifier (<code>id_vars</code>), turns the old column <i>names</i> into a
       new <code>year</code> column (<code>var_name</code>), and the old cell <i>values</i> into a new
       measurement column (<code>value_name</code>). Four wide rows of three years become twelve tidy rows of
       one observation each.</p>
       <p><b>Pivot (long &rarr; wide).</b> <code>pivot</code> / <code>pivot_table</code> is the inverse: spread
       one column's values back out into headers to make a compact, human-readable matrix. Use
       <code>pivot_table</code> (not plain <code>pivot</code>) whenever a row&times;column cell could collect
       more than one value &mdash; it takes an <code>aggfunc</code> to combine them.</p>
       <p><b>Stack / unstack</b> are the same two moves expressed over the <i>index</i> instead of columns, and
       <b>split / combine</b> (<code>str.split</code>, <code>explode</code>, string concatenation) handle the
       "two facts in one cell" mess. Together these few verbs reshape almost any table into tidy form.</p>`,

    example:
      `<p>Take this tiny <b>wide</b> table (a made-up GDP-per-person figure, in thousands):</p>
       <ul>
         <li><code>Brazil</code>: 1999 &rarr; 3.1, 2009 &rarr; 8.6, 2019 &rarr; 8.8</li>
         <li><code>India</code>: 1999 &rarr; 0.45, 2009 &rarr; 1.1, 2019 &rarr; 2.1</li>
       </ul>
       <p>It has 2 rows and 4 columns (<code>country</code> plus three year columns). The headers
       <code>1999/2009/2019</code> are clearly values of <code>year</code>, so this is untidy.</p>
       <p><b>Melt it.</b> Keep <code>country</code>, stack the three years. Brazil's one wide row becomes three
       tidy rows: <code>(Brazil, 1999, 3.1)</code>, <code>(Brazil, 2009, 8.6)</code>,
       <code>(Brazil, 2019, 8.8)</code> &mdash; and likewise for India. Two wide rows &times; three years
       &rarr; <b>6 long rows</b>, each one observation with exactly three columns
       (<code>country</code>, <code>year</code>, <code>gdp_pc</code>).</p>
       <p>Now <code>groupby("year").mean()</code> just works, and a line plot of <code>gdp_pc</code> vs
       <code>year</code> colored by <code>country</code> is one call. <b>Pivot it back</b> with
       <code>index="country", columns="year"</code> and you recover the original readable matrix for a
       report.</p>`,

    practice: [
      {
        q: `A sales export has columns <code>store</code>, <code>Jan</code>, <code>Feb</code>, <code>Mar</code> with revenue in each month cell. You try <code>df.groupby("month")["revenue"].sum()</code> and get a <code>KeyError: 'month'</code>. Why, and how do you fix the shape?`,
        steps: [
          { do: `Notice the month columns <code>Jan/Feb/Mar</code> are values of a hidden <code>month</code> variable, not three separate variables.`, why: `This is the "column headers are values" mess: the table is wide and untidy.` },
          { do: `There is no <code>month</code> column and no <code>revenue</code> column for <code>groupby</code> to use, so the key lookup fails.`, why: `<code>groupby</code> needs the grouping variable to actually be a column.` },
          { do: `Melt: <code>df.melt(id_vars="store", var_name="month", value_name="revenue")</code>.`, why: `This stacks the three month columns into a <code>month</code> column and the cells into a <code>revenue</code> column &mdash; now both keys exist.` }
        ],
        answer: `<p>The table is <b>wide</b>: <code>Jan/Feb/Mar</code> are <i>values</i> of <code>month</code>, so neither a <code>month</code> nor a <code>revenue</code> column exists for <code>groupby</code> &mdash; hence the <code>KeyError</code>. Reshape to long with <code>df.melt(id_vars="store", var_name="month", value_name="revenue")</code>, then <code>groupby("month")["revenue"].sum()</code> works.</p>`
      },
      {
        q: `A column <code>group</code> contains strings like <code>"male_25-34"</code> and <code>"female_18-24"</code>, and a column <code>tags</code> contains comma-strings like <code>"sports,news"</code>. What two operations make this tidy?`,
        steps: [
          { do: `Recognize <code>"male_25-34"</code> packs two variables (sex and age band) into one cell, and <code>"sports,news"</code> packs a list into one cell.`, why: `Tidy data requires one value per cell and one variable per column.` },
          { do: `Split the combined column: <code>df[["sex","age"]] = df["group"].str.split("_", expand=True)</code>.`, why: `This separates the two facts into two proper columns.` },
          { do: `Explode the list column: <code>df.assign(tags=df["tags"].str.split(",")).explode("tags")</code>.`, why: `<code>explode</code> gives each list item its own row, so each cell holds one value.` }
        ],
        answer: `<p>Use <b><code>str.split</code></b> to break <code>"male_25-34"</code> into separate <code>sex</code> and <code>age</code> columns (<code>str.split("_", expand=True)</code>), and <b><code>explode</code></b> to turn <code>"sports,news"</code> into one row per tag (split on <code>","</code> then <code>explode</code>). Now every cell holds a single value.</p>`
      },
      {
        q: `You run <code>long.pivot(index="country", columns="year", values="gdp")</code> and get <code>ValueError: Index contains duplicate entries, cannot reshape</code>. What does this mean and what should you use instead?`,
        steps: [
          { do: `Read the error: more than one row maps to the same <code>(country, year)</code> cell.`, why: `Plain <code>pivot</code> requires every row&times;column pair to be unique; it has no way to combine two values into one cell.` },
          { do: `Decide how duplicates should be combined &mdash; e.g. averaged or summed.`, why: `You must tell pandas the aggregation; it will not guess.` },
          { do: `Switch to <code>long.pivot_table(index="country", columns="year", values="gdp", aggfunc="mean")</code>.`, why: `<code>pivot_table</code> accepts an <code>aggfunc</code> and collapses the duplicates on purpose.` }
        ],
        answer: `<p>It means several rows share the same <code>(country, year)</code> key, and plain <code>pivot</code> cannot put two values in one cell. Use <b><code>pivot_table</code></b> with an explicit <code>aggfunc</code> (e.g. <code>"mean"</code> or <code>"sum"</code>) to aggregate the duplicates into a single value per cell.</p>`
      }
    ]
  });

  window.CODE["dw-tidy-data"] = {
    lib: "pandas",
    runnable: false,
    explain: `<p>One end-to-end pass over an untidy <b>wide</b> table whose columns are <i>years</i> (a classic
      "headers are values" mess, straight out of Wickham's tidy-data paper). We <code>melt</code> it to tidy
      <b>long</b> form, run a one-line <code>groupby</code> that only works once it is tidy,
      <code>pivot_table</code> back to a readable matrix, and finish with <code>str.split</code> +
      <code>explode</code> to untangle a cell that holds multiple values. The data is inlined, so this runs as
      written.</p>`,
    code: `import pandas as pd

# --- An untidy WIDE table: columns are YEARS (values, not variable names) ---
# GDP-per-person, in thousands (illustrative numbers).
wide = pd.DataFrame({
    "country": ["Brazil", "India", "Nigeria", "Vietnam"],
    "1999":    [3.10, 0.45, 0.50, 0.36],
    "2009":    [8.60, 1.10, 1.10, 1.20],
    "2019":    [8.80, 2.10, 2.20, 3.40],
})
print(wide.shape)          # -> (4, 4): 4 rows, 4 columns (3 of them are years)

# === melt: WIDE -> LONG (tidy) =========================================
# Keep 'country' as an id; turn the year COLUMN NAMES into a 'year' column
# and the cell VALUES into a 'gdp_pc' column.
long = wide.melt(id_vars="country", var_name="year", value_name="gdp_pc")
print(long.shape)          # -> (12, 3): one observation per row now
#    country  year  gdp_pc
# 0   Brazil  1999    3.10
# 1    India  1999    0.45
# ...        (12 rows total)

# Tidy data makes downstream work trivial: this groupby is a one-liner now,
# but is impossible while 'year' is smeared across column headers.
print(long.groupby("year")["gdp_pc"].mean())

# === pivot_table: LONG -> WIDE (for humans) ============================
# Spread 'year' back into columns. pivot_table (not plain pivot) takes an
# aggfunc, so it is safe even if a (country, year) pair repeats.
back = long.pivot_table(index="country", columns="year",
                        values="gdp_pc", aggfunc="mean")
back = back.reset_index()  # lift 'country' out of the index so it stays a column
print(back)

# stack / unstack do the same reshape over the INDEX instead of columns:
# long.set_index(["country", "year"])["gdp_pc"].unstack("year")  == back's body

# === splitting / combining: many values in one cell ===================
messy = pd.DataFrame({
    "user":  ["u1", "u2"],
    "group": ["male_25-34", "female_18-24"],   # TWO variables in one column
    "tags":  ["sports,news", "music"],          # a LIST packed into one cell
})

# split a combined column into two real columns
messy[["sex", "age"]] = messy["group"].str.split("_", expand=True)

# explode a delimited cell into one row per value
tidy = (messy.drop(columns="group")
             .assign(tags=messy["tags"].str.split(","))
             .explode("tags")
             .reset_index(drop=True))
print(tidy)
#   user         tags     sex     age
# u1          sports    male   25-34
# u1            news    male   25-34
# u2           music  female   18-24`
  };

  window.CODEVIZ["dw-tidy-data"] = {
    question: "Melting a wide table (years as columns) into tidy long form: how do the row and column counts change?",
    charts: [
      {
        type: "bars",
        title: "WIDE (untidy): few rows, many columns",
        labels: ["rows", "columns"],
        values: [4, 4],
        valueLabels: ["4", "4 (1 id + 3 year cols)"],
        colors: ["#ff7b72", "#ff7b72"]
      },
      {
        type: "bars",
        title: "LONG (tidy): many rows, few columns",
        labels: ["rows", "columns"],
        values: [12, 3],
        valueLabels: ["12 (4×3)", "3 (country, year, gdp_pc)"],
        colors: ["#7ee787", "#7ee787"]
      }
    ],
    caption: "Real numbers from running the CODE on the inline 4-country × 3-year table. WIDE is 4 rows × 4 columns, where 3 of those columns (1999, 2009, 2019) are really values of one hidden 'year' variable. melt stacks them: 4 wide rows × 3 years → 12 long rows, each one observation, with just 3 columns. The table got taller and narrower — and now groupby, plotting, and modeling all work without further reshaping.",
    code: `import pandas as pd

wide = pd.DataFrame({
    "country": ["Brazil", "India", "Nigeria", "Vietnam"],
    "1999":    [3.10, 0.45, 0.50, 0.36],
    "2009":    [8.60, 1.10, 1.10, 1.20],
    "2019":    [8.80, 2.10, 2.20, 3.40],
})
long = wide.melt(id_vars="country", var_name="year", value_name="gdp_pc")

print("wide rows, cols:", wide.shape)   # -> (4, 4)
print("long rows, cols:", long.shape)   # -> (12, 3)`
  };
})();
