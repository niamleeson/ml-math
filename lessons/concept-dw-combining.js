/* Data Wrangling — "Combining tables: concatenation vs joins/merges".
   Self-contained: lesson + CODE + CODEVIZ merged by id "dw-combining". */
(function () {
  window.LESSONS.push({
    id: "dw-combining",
    title: "Combining tables: concatenation vs joins",
    tagline: "Stack rows with concat, line up rows on a key with merge — then check the count before and after.",
    module: "Data Wrangling",
    prereqs: ["skill-data-audit", "met-distribution"],

    whenToUse:
      `<p>Real features almost never live in one table. The label sits in one file, the customer
       attributes in another, the transactions in a third. <b>Combining</b> is how you bring them
       together into a single analysis base table before you do anything else.</p>
       <p>There are two very different operations, and picking the wrong one quietly corrupts your data:</p>
       <ul>
         <li><b>Concatenation</b> (<code>pd.concat</code>) &mdash; glue tables <i>end to end</i>. Use it
         to <b>stack rows</b> (January orders on top of February orders, same columns) or to <b>paste
         columns side by side</b> when the rows already line up in the same order.</li>
         <li><b>Join / merge</b> (<code>pd.merge</code>, <code>df.join</code>) &mdash; line up rows by
         <b>matching a key</b>. Use it whenever you want to attach the <i>customer's city</i> to each
         <i>order</i> by <code>customer_id</code>. This is a database-style join, not a stack.</li>
       </ul>
       <p>Rule of thumb: same columns, more rows &rarr; <b>concat</b>. Same rows, more columns pulled in
       by a shared key &rarr; <b>merge</b>.</p>`,

    application:
      `<p>Combining shows up at the very start of almost every project:</p>
       <ul>
         <li><b>Building the analysis base table.</b> Start from the transactions, then merge on customer
         attributes, product attributes, and the label, one key at a time.</li>
         <li><b>Appending new data.</b> Each day's export is the same schema; <code>pd.concat</code> stacks
         them into one long history.</li>
         <li><b>Enriching events with entities.</b> Web clicks (one row per click) merged to a user table
         (one row per user) to attach demographics &mdash; a classic <b>many-to-one</b> join.</li>
       </ul>`,

    pitfalls:
      `<ul>
         <li><b>Key type / whitespace / case mismatch &rarr; silent zero matches.</b> If
         <code>cust_id</code> is an integer in one table and a string (<code>"3"</code>) in the other, or
         one side has a trailing space (<code>"NYC "</code>) or different case (<code>"nyc"</code> vs
         <code>"NYC"</code>), the keys never match. A left join then fills every attribute with
         <code>NaN</code> and <b>no error is raised</b>. Fix: normalize keys first &mdash;
         <code>.astype(str).str.strip().str.lower()</code> &mdash; and confirm the dtypes line up.</li>
         <li><b>Many-to-many join &rarr; row explosion.</b> If the key is duplicated on <i>both</i> sides,
         every left match pairs with every right match. Two left rows and three right rows for one key give
         $2\\times 3 = 6$ output rows. Tables can balloon and silently double-count. Fix: pass
         <code>validate="1:m"</code> (or <code>"1:1"</code>, <code>"m:1"</code>) so pandas raises if the
         cardinality is wrong.</li>
         <li><b>Left join introduces NaNs you forget to handle.</b> A left join keeps every left row even
         when there is no match, filling the new columns with <code>NaN</code>. Downstream code that assumes
         the column is fully populated then breaks. Fix: count the unmatched rows (with
         <code>indicator=True</code>) and decide explicitly how to fill or drop them.</li>
         <li><b>Inner join silently loses rows.</b> An inner join keeps <i>only</i> keys present in both
         tables. If a chunk of orders has no matching customer, those orders vanish &mdash; and your row
         count quietly drops. Fix: compare <code>len(df)</code> before and after, every single time.</li>
         <li><b>Duplicated keys you did not expect.</b> A key you believed was unique (one row per customer)
         turns out to have duplicates, turning a tidy <b>1:1</b> join into a many-to-many explosion. Check
         <code>df["key"].is_unique</code> before joining.</li>
         <li><b>Not checking counts before and after.</b> The single habit that catches all of the above:
         print the row count of each input and of the result, and reason about whether the change makes
         sense.</li>
       </ul>`,

    bigIdea:
      `<p>Think of two spreadsheets. <b>Concatenation</b> physically stacks them &mdash; either rows on
       top of rows (you need the <i>same columns</i>) or columns beside columns (you need the rows in the
       <i>same order</i>). It does no matching; it just glues.</p>
       <p>A <b>join</b> is smarter. You name a <b>key</b> column &mdash; say <code>cust_id</code> &mdash;
       and the join walks one table's keys, finds the matching key in the other table, and pastes the two
       rows together. The whole behavior of a join is decided by one question: <b>what do you do with keys
       that appear in one table but not the other?</b> That single question gives the four join types.</p>`,

    buildup:
      `<p>Let $L$ be the left table and $R$ the right table, joined on a key $k$. Call the set of keys in
       the left table $K_L$ and in the right table $K_R$.</p>
       <ul>
         <li><b>Inner join</b> &mdash; keep only keys in <b>both</b>: $K_L \\cap K_R$. Rows whose key is
         missing from either side are dropped. This is the default for <code>pd.merge</code>.</li>
         <li><b>Left join</b> &mdash; keep <b>every</b> left row ($K_L$), whether or not it matched. Right
         columns are <code>NaN</code> where there was no match.</li>
         <li><b>Right join</b> &mdash; the mirror image: keep every right row ($K_R$); unmatched left
         columns become <code>NaN</code>.</li>
         <li><b>Outer (full) join</b> &mdash; keep <b>everything</b>: $K_L \\cup K_R$. Both sides get
         <code>NaN</code> wherever they did not match.</li>
       </ul>
       <p>The <b>key</b> can be a single column or several columns together (a <b>composite key</b>, e.g.
       join on <code>["store_id", "date"]</code> at once). A row matches only if <i>all</i> the key columns
       agree.</p>`,

    symbols: [
      { sym: "$L,\\ R$", desc: "the left and right tables being joined." },
      { sym: "$k$", desc: "the join key &mdash; a single column, or a list of columns for a composite key." },
      { sym: "$K_L,\\ K_R$", desc: "the set of distinct key values present in the left and right tables." },
      { sym: "$K_L\\cap K_R$", desc: "keys in BOTH tables &mdash; the rows an inner join keeps." },
      { sym: "$K_L\\cup K_R$", desc: "keys in EITHER table &mdash; the rows an outer join keeps." }
    ],

    derivation:
      `<p><b>Why row counts move the way they do.</b> Take a small example: orders with keys
       $\\{1,1,2,3,6,6,7\\}$ (7 rows) on the left, customers with keys $\\{1,2,3,4,5\\}$ (5 rows) on the
       right, each customer key unique.</p>
       <ul class="steps">
         <li><b>Matched keys.</b> Keys $1,2,3$ appear in both. On the left those cover rows $1,1,2,3$
         &mdash; <b>4 rows</b>. That is exactly the <b>inner</b> join size: keys $6,6,7$ (no customer) and
         keys $4,5$ (no order) all drop.</li>
         <li><b>Left join</b> keeps every left row &mdash; all <b>7</b>. The 4 matched rows get a city; the
         3 rows with keys $6,6,7$ get <code>NaN</code> for city.</li>
         <li><b>Right join</b> keeps every right row &mdash; <b>6</b>. Keys $1,2,3$ matched orders (4 rows),
         and keys $4,5$ appear with <code>NaN</code> amount (2 rows): $4+2=6$.</li>
         <li><b>Outer join</b> keeps the union: the 4 matched rows, plus the 3 order-only rows
         ($6,6,7$), plus the 2 customer-only rows ($4,5$): $4+3+2 = \\mathbf{9}$.</li>
       </ul>
       <p>Notice <b>left</b> $\\ge$ <b>inner</b> and <b>outer</b> $\\ge$ every other type, always. If your
       inner join returns <i>more</i> rows than the left table, you have a <b>many-to-many</b> explosion:
       some key is duplicated on both sides. $\\blacksquare$</p>`,

    example:
      `<p>Two tiny tables, joined on <code>cust_id</code>. <b>Orders</b> (left) has keys
       $\\{1,1,2,3,6,6,7\\}$ &mdash; 7 rows. <b>Customers</b> (right) has keys $\\{1,2,3,4,5\\}$ &mdash;
       5 rows, each unique. So $K_L=\\{1,2,3,6,7\\}$ and $K_R=\\{1,2,3,4,5\\}$.</p>
       <table class="extable">
         <caption>The same two tables, joined four ways &mdash; count the rows each keeps.</caption>
         <thead>
           <tr><th>join (<code>how=</code>)</th><th>keeps keys</th><th class="num">left-side rows kept</th><th class="num">right-only rows</th><th class="num">result rows</th></tr>
         </thead>
         <tbody>
           <tr><td class="row-h">inner</td><td>$K_L\\cap K_R=\\{1,2,3\\}$</td><td class="num">4</td><td class="num">0</td><td class="num">4</td></tr>
           <tr><td class="row-h">left</td><td>$K_L$ (all orders)</td><td class="num">7</td><td class="num">0</td><td class="num">7</td></tr>
           <tr><td class="row-h">right</td><td>$K_R$ (all customers)</td><td class="num">4</td><td class="num">2</td><td class="num">6</td></tr>
           <tr><td class="row-h">outer</td><td>$K_L\\cup K_R$</td><td class="num">7</td><td class="num">2</td><td class="num">9</td></tr>
         </tbody>
       </table>
       <ul class="steps">
         <li><b>Inner.</b> Only keys in both, $\\{1,2,3\\}$. On the left those cover order rows
         $1,1,2,3$, so $4$ rows. Keys $6,6,7$ (no customer) and $4,5$ (no order) drop.</li>
         <li><b>Left.</b> Every order row: $7$. The $4$ matched get a city; rows $6,6,7$ get
         <code>NaN</code> city.</li>
         <li><b>Right.</b> Every customer: matched orders ($4$ rows) plus customers $4,5$ with
         <code>NaN</code> amount ($2$ rows): $4+2=6$.</li>
         <li><b>Outer.</b> The union: $4$ matched $+\\ 3$ order-only ($6,6,7$) $+\\ 2$ customer-only
         ($4,5$) $=4+3+2=\\mathbf{9}$.</li>
       </ul>
       <p>Sanity check: inner $4\\le$ left $7$, inner $4\\le$ right $6$, and outer $9\\ge$ all of them &mdash;
       exactly as the theory says. Now break the key on purpose: store <code>cust_id</code> as a
       <i>string with a space</i> (<code>"1 "</code>) on one side and an <i>integer</i> (<code>1</code>)
       on the other. Every key mismatches, so a left join still returns $7$ rows but with <b>every</b>
       city column <code>NaN</code> &mdash; no error, just silent emptiness.</p>`,

    practice: [
      {
        q: `You left-join 50,000 orders to a customer table on <code>cust_id</code>. The result has 50,000 rows (good), but <code>city</code> is <code>NaN</code> for all of them. The join raised no error. What is the most likely cause and how do you confirm it?`,
        steps: [
          { do: `Check the dtype of <code>cust_id</code> on both sides with <code>.dtype</code>.`, why: `An int-vs-string mismatch (e.g. 3 vs "3") makes every key fail to match while the join still "succeeds".` },
          { do: `Strip whitespace and normalize case/type: <code>.astype(str).str.strip()</code> on both keys.`, why: `Hidden trailing spaces (<code>"NYC "</code>) or case (<code>"nyc"</code>) are invisible but block matches.` },
          { do: `Re-run with <code>indicator=True</code> and inspect <code>_merge.value_counts()</code>.`, why: `If everything is <code>left_only</code>, the keys are not matching at all &mdash; confirming the mismatch.` }
        ],
        answer: `<p>A <b>key-type or whitespace/case mismatch</b>: the keys silently fail to match, so the left join keeps all 50,000 rows but fills every right column with <code>NaN</code>, and raises no error. Confirm by comparing the two <code>dtype</code>s and by checking <code>indicator=True</code> &mdash; an all-<code>left_only</code> result is the giveaway. Fix by normalizing both keys (<code>.astype(str).str.strip().str.lower()</code>) before merging.</p>`
      },
      {
        q: `You merge a 1,000-row orders table to a 1,000-row promotions table on <code>promo_code</code> and the result has 7,400 rows. The count went UP after a join. What happened, and what one argument would have caught it?`,
        steps: [
          { do: `Recognize that an inner/left result larger than the left table means duplicated keys on both sides.`, why: `If one promo_code maps to several promotions AND several orders, every pairing is emitted.` },
          { do: `Check uniqueness: <code>orders["promo_code"].is_unique</code> and <code>promos["promo_code"].is_unique</code>.`, why: `A many-to-many join multiplies matching rows ($n\\times m$ per key), exploding the row count.` },
          { do: `Add <code>validate="m:1"</code> (or <code>"1:1"</code>) to the merge.`, why: `pandas then raises a <code>MergeError</code> the moment the right side is not unique on the key, instead of silently exploding.` }
        ],
        answer: `<p>A <b>many-to-many join (row explosion)</b>: <code>promo_code</code> is duplicated on both sides, so each key emits $n\\times m$ rows and the total balloons past 1,000. Pass <code>validate="m:1"</code> (you expect each order to match exactly one promotion) and pandas raises a <code>MergeError</code> instead of quietly multiplying rows. Always compare row counts before and after a join.</p>`
      },
      {
        q: `Decide for each task: concatenate or merge? (a) You have 12 monthly CSVs with identical columns and want one full-year table. (b) You have an orders table and a customers table and want each order labeled with the customer's city.`,
        steps: [
          { do: `Ask whether the columns are the same (stack rows) or you are pulling in new columns via a shared key.`, why: `Same schema, more rows is concatenation; same rows, more columns by key is a merge.` },
          { do: `For (a), the 12 files share columns and you want them end-to-end.`, why: `<code>pd.concat([jan, feb, ...])</code> stacks rows; no key matching is needed.` },
          { do: `For (b), you attach the city column by matching <code>cust_id</code>.`, why: `<code>pd.merge(orders, customers, on="cust_id", how="left")</code> looks up each order's customer.` }
        ],
        answer: `<p>(a) <b>Concatenate</b>: identical columns, stacking rows &mdash; <code>pd.concat([jan, feb, ...], ignore_index=True)</code>. (b) <b>Merge</b>: pulling a new column in by a shared key &mdash; <code>pd.merge(orders, customers, on="cust_id", how="left")</code>. Same columns, more rows &rarr; concat; same rows, more columns by key &rarr; merge.</p>`
      }
    ]
  });

  window.CODE["dw-combining"] = {
    lib: "pandas",
    runnable: false,
    explain: `<p>Two small tables &mdash; <code>orders</code> (left) and <code>customers</code> (right) &mdash; combined every way. First <code>pd.concat</code> stacks rows; then <code>pd.merge</code> does inner / left / right / outer joins, printing the row count each one yields. Then we deliberately break the key (string-with-space vs integer) to show the <b>silent</b> all-<code>NaN</code> result, use <code>validate="1:m"</code> to assert the cardinality, and <code>indicator=True</code> to audit which rows matched. The habit to copy: print <code>len()</code> before and after every join.</p>`,
    code: `import pandas as pd

# === Two small tables ===
# Right table: one row per customer (cust_id is unique).
customers = pd.DataFrame({
    "cust_id": [1, 2, 3, 4, 5],
    "city":    ["NYC", "SF", "LA", "SEA", "BOS"],
})
# Left table: one row per order; some customers have several orders,
# and cust_id 6, 7 have NO matching customer.
orders = pd.DataFrame({
    "cust_id": [1, 1, 2, 3, 6, 6, 7],
    "amount":  [50, 20, 99, 15, 5, 8, 40],
})
print("orders rows   :", len(orders))      # 7
print("customers rows:", len(customers))   # 5

# === CONCATENATION: stack rows (same columns) ===
more_orders = pd.DataFrame({"cust_id": [2, 8], "amount": [12, 70]})
stacked = pd.concat([orders, more_orders], ignore_index=True)
print("after concat  :", len(stacked))     # 9  (7 + 2 stacked end-to-end)

# === JOINS / MERGES: line up rows on a key ===
for how in ["inner", "left", "right", "outer"]:
    m = pd.merge(orders, customers, on="cust_id", how=how)
    print(f"{how:>5} join rows:", len(m))
# inner join rows: 4   (only keys 1,1,2,3 match a customer)
# left  join rows: 7   (all orders; cust 6,6,7 get NaN city)
# right join rows: 6   (4 matched + customers 4,5 with NaN amount)
# outer join rows: 9   (4 matched + 3 order-only + 2 customer-only)

# === KEY MISMATCH -> silent zero matches (NO error raised) ===
bad = orders.copy()
bad["cust_id"] = bad["cust_id"].astype(str) + " "   # "1 ", "1 ", ...  string + space
oops = pd.merge(bad, customers, on="cust_id", how="left")
print("city all NaN? :", oops["city"].isna().all())  # True -- nothing matched!
# Fix: normalize BOTH keys before joining.
# bad["cust_id"] = bad["cust_id"].str.strip().astype(int)

# === validate=: assert the cardinality (raises if violated) ===
# We expect each customer (right) to map to MANY orders (left): a 1:m join.
m = pd.merge(orders, customers, on="cust_id", how="left", validate="1:m")
# If 'customers' had a duplicate cust_id, pandas would raise MergeError here.

# === indicator=True: audit which rows matched ===
audit = pd.merge(orders, customers, on="cust_id", how="outer", indicator=True)
print(audit["_merge"].value_counts().to_dict())
# {'both': 4, 'left_only': 3, 'right_only': 2}
#  both       = orders that found a customer
#  left_only  = orders with NO customer (cust 6,6,7)
#  right_only = customers with NO order  (cust 4,5)`
  };

  window.CODEVIZ["dw-combining"] = {
    question: "After a join, the row count is your smoke alarm. Read these four bar charts to tell a healthy join from a silent explosion or a silent all-NaN.",
    charts: [
      {
        type: "bars",
        title: "HEALTHY — row count by join type (7 orders ⋈ 5 customers on cust_id)",
        xlabel: "join type",
        ylabel: "rows in result",
        labels: ["inner", "left", "right", "outer"],
        values: [4, 7, 6, 9],
        valueLabels: ["4", "7", "6", "9"],
        colors: ["#ff7b72", "#79c0ff", "#d2a8ff", "#7ee787"],
        interpret: "Each bar is one join type; its height is the rows the join returns from the same two tables (orders=7, customers=5, key cust_id). Read the ORDER of the bars: inner (4, only matched keys) is the smallest, left (7) keeps all orders, right (6) keeps all customers, outer (9) keeps the union and is the tallest. The rule to memorise from the shape: inner is never bigger than left or right, and outer is never smaller than any of them. Real numbers from pd.merge."
      },
      {
        type: "bars",
        title: "HEALTHY audited — outer join split by indicator=True",
        xlabel: "match status",
        ylabel: "rows",
        labels: ["both", "left_only", "right_only"],
        values: [4, 3, 2],
        valueLabels: ["4", "3", "2"],
        colors: ["#7ee787", "#79c0ff", "#d2a8ff"],
        interpret: "indicator=True tags every outer-join row by where it came from. 'both' (4) are orders that found a customer — that is exactly the inner-join count. 'left_only' (3) are orders with no customer (keys 6,6,7); 'right_only' (2) are customers with no order (keys 4,5). The bars add up to the outer total: 4 + 3 + 2 = 9. Use this audit to see WHICH rows fell through, not just how many."
      },
      {
        type: "bars",
        title: "DANGER — many-to-many explosion: result bigger than either input (illustrative)",
        xlabel: "table",
        ylabel: "rows",
        labels: ["orders (left)", "promos (right)", "merged"],
        values: [1000, 1000, 7400],
        valueLabels: ["1000", "1000", "7400"],
        colors: ["#9aa7b4", "#9aa7b4", "#ff7b72"],
        interpret: "Illustrative. The merged bar (7400) towers over BOTH inputs (1000 each). That can only happen when the key is duplicated on both sides: each shared key emits n×m rows, so the total balloons and silently double-counts. The tell is purely visual — a join result taller than the larger input table is impossible for a clean 1:1 or m:1 join. Catch it by passing validate=\"m:1\" (or \"1:1\") so pandas raises instead of exploding."
      },
      {
        type: "bars",
        title: "DANGER — key mismatch: rows look fine, but city is all NaN (illustrative)",
        xlabel: "merged column",
        ylabel: "rows",
        labels: ["rows kept", "city populated", "city NaN"],
        values: [50000, 0, 50000],
        valueLabels: ["50000", "0", "50000"],
        colors: ["#79c0ff", "#9aa7b4", "#ff7b72"],
        interpret: "Illustrative. A left join keeps all 50000 rows (blue bar looks healthy), so the row-count alarm stays quiet — but the 'city populated' bar is zero and every value is NaN (red). This is the silent trap: an int-vs-string or whitespace/case mismatch (3 vs \"3\", \"NYC \" vs \"NYC\") makes every key fail to match, yet a left join raises no error. Row count alone won't catch it; also check that the pulled-in columns aren't entirely NaN, and run indicator=True (all left_only confirms it). Fix by normalising both keys with .astype(str).str.strip().str.lower() before merging."
      }
    ],
    caption: "Four bar charts that teach you to read a join by its row count. HEALTHY: real pd.merge numbers — inner 4, left 7, right 6, outer 9 from orders [1,1,2,3,6,6,7] joined to customers [1,2,3,4,5]; the indicator audit splits the outer 9 into both 4 / left_only 3 / right_only 2 (and 4+3+2=9, inner=both). DANGER #1 (illustrative): a result (7400) taller than either input (1000) is a many-to-many explosion — use validate=. DANGER #2 (illustrative): full row count but an all-NaN pulled-in column is a silent key mismatch — normalise keys and check with indicator=True. Always compare len() before and after.",
    code: `import pandas as pd

customers = pd.DataFrame({"cust_id": [1, 2, 3, 4, 5],
                          "city": ["NYC", "SF", "LA", "SEA", "BOS"]})
orders = pd.DataFrame({"cust_id": [1, 1, 2, 3, 6, 6, 7],
                       "amount": [50, 20, 99, 15, 5, 8, 40]})

# Row count per join type.
for how in ["inner", "left", "right", "outer"]:
    print(how, len(pd.merge(orders, customers, on="cust_id", how=how)))
# inner 4 | left 7 | right 6 | outer 9

# Matched / unmatched split via indicator=True (on the outer join).
audit = pd.merge(orders, customers, on="cust_id", how="outer", indicator=True)
print(dict(audit["_merge"].value_counts()))
# {'both': 4, 'left_only': 3, 'right_only': 2}`
  };
})();
