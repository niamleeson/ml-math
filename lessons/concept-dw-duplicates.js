/* Data Wrangling — "Finding and removing duplicate records".
   Self-contained: lesson + CODE + CODEVIZ merged by id "dw-duplicates". */
(function () {
  window.LESSONS.push({
    id: "dw-duplicates",
    title: "Duplicates: exact, fuzzy, and the leak across the split",
    tagline: "Find rows that say the same thing twice — both perfect copies and the same entity spelled a little differently — and collapse them before you split.",
    module: "Data Wrangling",
    prereqs: ["skill-leakage"],

    whenToUse:
      `<p>Reach for a duplicate check <b>any time data was merged from more than one source, scraped
       from the web, exported and re-imported, or typed in by hand</b>. All four of those routinely
       record the same thing twice. Two systems both list the same customer; a scraper revisits the
       same page; a form lets someone submit twice.</p>
       <p>Make it a <b>fixed first step</b>, run it <b>before</b> you split into train and test. There
       are two kinds of duplicate to hunt:</p>
       <ul>
         <li><b>Exact duplicates</b> &mdash; two rows that are byte-for-byte identical (or identical on
         the columns you care about). Caught with <code>df.duplicated()</code> and removed with
         <code>df.drop_duplicates()</code>.</li>
         <li><b>Fuzzy / near-duplicates</b> &mdash; the <i>same real entity</i> recorded slightly
         differently: "Jon Smith" vs "John Smith", a trailing space, "boston" vs "Boston". These slip
         past an exact check because the bytes differ. You catch them by <b>normalizing</b> the keys
         and then comparing with <b>string similarity</b> (e.g. <code>rapidfuzz</code> / Levenshtein
         distance) or a <b>blocking + matching</b> pass (the <code>recordlinkage</code> library).</li>
       </ul>
       <p>Skip this and the same record can land in <b>both</b> train and test &mdash; the model sees a
       test row at training time and your score is a lie.</p>`,

    application:
      `<p>Duplicate-hunting is everyday plumbing in real data work:</p>
       <ul>
         <li><b>Customer / user tables stitched from many systems.</b> A CRM (Customer Relationship
         Management system) and a billing export both list "ACME Corp" / "Acme corp." &mdash; the same
         account, two spellings. Collapsing them is called <b>record linkage</b> or
         <b>entity resolution</b>.</li>
         <li><b>Scraped or crawled datasets.</b> Crawlers revisit pages and pick up the same article,
         product, or listing more than once.</li>
         <li><b>Hand-entered survey / form data.</b> Double submissions, retyped rows, inconsistent
         casing and stray spaces.</li>
         <li><b>De-duping a training set before modeling.</b> Repeated rows quietly act like
         <b>sample weights</b> &mdash; a row copied 5 times pulls the model 5 times as hard. Removing
         them keeps every distinct example counting once.</li>
       </ul>`,

    pitfalls:
      `<ul>
         <li><b>Duplicates leak across the train/test split.</b> If "John Smith" appears twice and you
         split <i>after</i>, one copy can go to train and one to test. The model has effectively seen
         the answer; your test score is inflated. <b>Fix:</b> de-duplicate <b>before</b> splitting, so
         each real entity sits entirely on one side.</li>
         <li><b>Dropping on the wrong subset.</b> Call <code>drop_duplicates()</code> with no
         <code>subset</code> and a single differing column (a timestamp, a row id) keeps obvious dupes;
         pick too few key columns and you delete <b>real, distinct rows</b> that merely share those
         keys. <b>Fix:</b> choose the <code>subset</code> that defines "the same record" deliberately,
         and inspect what gets dropped.</li>
         <li><b>Fuzzy threshold too loose &mdash; you merge distinct entities.</b> A low similarity cut
         glues "Bob Lee" and "Robert Lee" (or two different real people) into one. <b>Fix:</b> raise the
         threshold and add a <b>blocking key</b> (only compare rows that share city / date) so you only
         match plausible pairs.</li>
         <li><b>Fuzzy threshold too tight &mdash; you miss real dupes.</b> Too high a cut leaves
         "Jon&nbsp;Smith" and "John&nbsp;Smith" as separate entities. <b>Fix:</b> normalize first
         (lowercase, strip and collapse whitespace, drop punctuation) so honest variants line up, then
         tune the threshold on a few labeled pairs.</li>
         <li><b>Non-deterministic <code>keep</code>.</b> <code>keep="first"</code> / <code>"last"</code>
         depends on row order; if the order isn't fixed you keep a different copy each run, and results
         stop reproducing. <b>Fix:</b> sort by a meaningful column first (most recent, most complete),
         then keep deterministically.</li>
       </ul>`,

    bigIdea:
      `<p>A duplicate is a row that <b>repeats information already present</b> in another row. The danger
       is that duplicates are invisible to most code &mdash; the table still has clean rows and columns,
       it just secretly <b>over-counts</b> some records. That quietly corrupts everything downstream:
       counts, averages, class balance, and &mdash; worst &mdash; the honesty of your test set.</p>
       <p>There are two regimes, and they need different tools:</p>
       <ul>
         <li><b>Exact:</b> the rows match on the bytes (or on a chosen subset of columns). This is a pure
         lookup &mdash; pandas hashes each row and flags repeats. Cheap and exact.</li>
         <li><b>Fuzzy:</b> the rows refer to the same entity but the bytes differ. Now "same" is a matter
         of <b>degree</b>, measured by how few edits turn one string into the other (<b>edit /
         Levenshtein distance</b>) or by a normalized similarity score in $[0,1]$. You set a threshold
         and merge anything above it.</li>
       </ul>`,

    buildup:
      `<p><b>Exact, with a subset.</b> Decide which columns define identity &mdash; the
       <code>subset</code>. <code>df.duplicated(subset=keys)</code> returns a boolean per row: <code>True</code>
       for every appearance <i>after the first</i> of a key combination. Sum it to count dupes;
       <code>drop_duplicates(subset=keys, keep="first")</code> removes them. <code>keep</code> chooses
       which copy survives (<code>"first"</code>, <code>"last"</code>, or <code>False</code> to drop all
       copies of any repeated key).</p>
       <p><b>Fuzzy, in three moves.</b></p>
       <ol>
         <li><b>Normalize</b> the key. Lowercase, <code>strip()</code> and collapse internal whitespace,
         remove punctuation, maybe map accents. This alone fixes "John  Smith&nbsp;" vs "john smith".</li>
         <li><b>Block</b> (optional but important). Only compare rows that share a coarse key &mdash;
         same city, same signup date, same first letter. Comparing every pair is $O(n^2)$; blocking cuts
         it to within-block pairs.</li>
         <li><b>Match.</b> For each candidate pair compute a string-similarity score
         (<code>rapidfuzz.fuzz.ratio</code> $/100$, a value in $[0,1]$) and merge any pair scoring above a
         <b>threshold</b> $\\tau$. Group the merged pairs into clusters and collapse each cluster to one
         canonical record.</li>
       </ol>
       <p>The <code>recordlinkage</code> library packages exactly this block&rarr;compare&rarr;classify
       pipeline for bigger jobs.</p>`,

    symbols: [
      { sym: "$\\tau$", desc: "the similarity threshold in $[0,1]$ &mdash; merge a pair of records only if their similarity is at least $\\tau$. Higher $\\tau$ = stricter (fewer merges)." },
      { sym: "$d(a,b)$", desc: "edit (Levenshtein) distance: the smallest number of single-character inserts, deletes, or substitutions that turns string $a$ into string $b$. $d=0$ means identical." },
      { sym: "$\\text{sim}(a,b)$", desc: "a normalized similarity in $[0,1]$ built from the edit distance, e.g. $1-\\dfrac{d(a,b)}{\\max(|a|,|b|)}$ &mdash; $1$ for identical strings, near $0$ for totally different ones." },
      { sym: "$n$", desc: "number of records; comparing all pairs is $\\binom{n}{2}\\approx n^2/2$ comparisons, which is why blocking matters." }
    ],

    formula:
      `$$ \\text{sim}(a,b) \\;=\\; 1 - \\frac{d(a,b)}{\\max(|a|,|b|)}, \\qquad
         \\text{merge } a,b \\iff \\text{sim}(a,b) \\ge \\tau $$`,

    whatItDoes:
      `<p>The left piece turns a raw <b>edit distance</b> $d(a,b)$ into a 0-to-1 <b>similarity</b> by
       dividing by the longer string's length and flipping it: identical strings ($d=0$) score $1$, wildly
       different ones score near $0$. Normalizing by length makes the score comparable across short and
       long names. The right piece is the decision rule: two records are declared the same entity exactly
       when their similarity clears the threshold $\\tau$. Slide $\\tau$ up and you merge less (risk
       missing dupes); slide it down and you merge more (risk fusing distinct entities). Tools like
       <code>rapidfuzz</code> compute $\\text{sim}$ very fast; <code>recordlinkage</code> wraps the whole
       block&rarr;compare&rarr;threshold loop.</p>`,

    derivation:
      `<p><b>Why de-dup <i>before</i> the split, and why fuzzy needs a threshold.</b></p>
       <ul class="steps">
         <li>A train/test split is only honest if no test example was seen during training. A duplicated
         record breaks that: split a table that contains the same row twice and, with positive
         probability, one copy is assigned to train and the other to test.</li>
         <li>Now the model trains on a row that is identical (or near-identical) to a test row. Its test
         prediction is effectively memorized, so the test score overstates real-world performance &mdash;
         classic <b>leakage</b>.</li>
         <li>Removing exact dupes first is unambiguous: hash each (sub)row, keep one per key. There is one
         right answer.</li>
         <li>Fuzzy dupes have no single right answer &mdash; "same entity?" is graded, not binary. So we
         map each pair to a similarity $\\text{sim}(a,b)\\in[0,1]$ and pick a cutoff $\\tau$. Every cutoff
         trades two errors: <b>false merges</b> (distinct entities glued together, $\\tau$ too low) against
         <b>missed merges</b> (true dupes left apart, $\\tau$ too high).</li>
         <li>Because comparing all $\\binom{n}{2}$ pairs is quadratic, we first <b>block</b> on a coarse
         key so only plausible pairs are scored &mdash; same speed-up that powers the
         <code>recordlinkage</code> library. Pick $\\tau$ by checking a handful of labeled pairs, then
         collapse each above-threshold cluster to one canonical row. $\\blacksquare$</li>
       </ul>`,

    example:
      `<p>Fourteen customer rows merged from two systems, with planted repeats. First the <b>exact</b> pass,
       then plug each candidate name pair into the lesson's similarity formula
       $\\text{sim}(a,b)=1-\\dfrac{d(a,b)}{\\max(|a|,|b|)}$ and compare to the threshold $\\tau$.</p>
       <ul class="steps">
         <li><b>Exact pass.</b> Rows like <i>(John Smith, Boston, 2024-01-05)</i> and <i>(Mary Johnson,
         New York, 2024-02-11)</i> each appear twice byte-for-byte. <code>df.duplicated(subset=['name','city','signup'])</code>
         flags <b>4</b> repeats; dropping them takes <b>14&nbsp;&rarr;&nbsp;10</b> rows.</li>
         <li><b>Normalize.</b> Lowercase, strip, collapse spaces: "John&nbsp;&nbsp;Smith&nbsp;"&rarr;"john smith",
         "Alice Wong"&rarr;"alice wong". Now honest variants line up before scoring.</li>
       </ul>
       <table class="extable">
         <caption>Fuzzy scoring: edit distance $d$ &rarr; similarity, on the normalized keys. Merge if $\\text{sim}\\ge\\tau=0.85$.</caption>
         <thead><tr><th>pair (normalized)</th><th class="num">$d$</th><th class="num">$\\max(|a|,|b|)$</th><th class="num">$\\text{sim}=1-d/\\max$</th><th>$\\ge 0.85$?</th></tr></thead>
         <tbody>
           <tr><td class="row-h">"jon smith" vs "john smith"</td><td class="num">1</td><td class="num">10</td><td class="num">0.900</td><td>merge</td></tr>
           <tr><td class="row-h">"mary jonson" vs "mary johnson"</td><td class="num">1</td><td class="num">12</td><td class="num">0.917</td><td>merge</td></tr>
           <tr><td class="row-h">"alice wong" vs "alice wong"</td><td class="num">0</td><td class="num">10</td><td class="num">1.000</td><td>merge</td></tr>
           <tr><td class="row-h">"bob lee" vs "robert lee"</td><td class="num">4</td><td class="num">10</td><td class="num">0.600</td><td>keep apart</td></tr>
         </tbody>
       </table>
       <ul class="steps">
         <li><b>Worked numbers.</b> "jon smith"&rarr;"john smith" needs one insert ('h'), so $d=1$, longer
         string is 10 chars: $\\text{sim}=1-\\tfrac{1}{10}=0.900\\ge0.85$ &rarr; merge. "bob lee"&rarr;"robert
         lee" needs 4 edits, $d=4$ over 10: $\\text{sim}=1-\\tfrac{4}{10}=0.600\\lt0.85$ &rarr; correctly
         stays separate.</li>
         <li><b>Collapse.</b> Block on city + date, merge every above-threshold pair: the three Smith rows
         become one, the two Mary rows one, the two Alice rows one; Bob and Robert stay two. The 10 rows
         collapse to <b>6</b> distinct entities.</li>
       </ul>
       <table class="extable">
         <caption>The funnel, stage by stage.</caption>
         <thead><tr><th>stage</th><th class="num">rows</th><th class="num">removed</th></tr></thead>
         <tbody>
           <tr><td class="row-h">raw (merged)</td><td class="num">14</td><td class="num">&mdash;</td></tr>
           <tr><td class="row-h">after exact drop</td><td class="num">10</td><td class="num">4</td></tr>
           <tr><td class="row-h">after fuzzy collapse</td><td class="num">6</td><td class="num">4</td></tr>
         </tbody>
       </table>
       <p>So <b>14 &rarr; 10 &rarr; 6</b>. Threshold sensitivity (using the same scorer across cutoffs): a
       too-loose $\\tau$ glues "Bob"/"Robert" together (undercount), a too-tight $\\tau=0.95$ leaves
       "Jon"/"John" split (overcount, 7 entities); the middle band $\\tau\\approx0.80\\text{&ndash;}0.90$
       gives the correct <b>6</b>.</p>`,

    practice: [
      {
        q: `You merged two customer exports and want to remove duplicate accounts. <code>df.drop_duplicates()</code> (no arguments) removes nothing, yet you can see the same customer twice. What is happening and how do you fix it?`,
        steps: [
          { do: `Check whether the rows are truly identical across <i>all</i> columns.`, why: `<code>drop_duplicates()</code> with no <code>subset</code> only drops rows identical in every column; one differing column (a row id, an export timestamp, a source tag) makes them "distinct".` },
          { do: `Pick the columns that actually define a customer &mdash; e.g. <code>['name','email']</code>.`, why: `That is the identity key; differing bookkeeping columns should not count.` },
          { do: `Run <code>df.drop_duplicates(subset=['name','email'], keep='first')</code> and inspect what was dropped.`, why: `Restricting to the identity subset collapses the real dupes; inspecting guards against deleting genuinely distinct rows.` }
        ],
        answer: `<p>A bookkeeping column (id, timestamp, source) differs, so the rows aren't byte-identical and the no-argument call keeps them. Pass an explicit <code>subset</code> of the columns that define identity &mdash; <code>df.drop_duplicates(subset=['name','email'], keep='first')</code> &mdash; and check the dropped rows to be sure you didn't lose real records.</p>`
      },
      {
        q: `Your fuzzy de-dup with <code>rapidfuzz</code> at threshold $\\tau=0.70$ merged "Bob Lee" with "Robert Lee" and two genuinely different "Lin Chen"s in the same city. Is the threshold too loose or too tight, and what two changes help?`,
        steps: [
          { do: `Recognize that distinct entities are being fused.`, why: `Fusing distinct entities is the symptom of a threshold that is too <b>loose</b> (too low).` },
          { do: `Raise $\\tau$ (e.g. to 0.85&ndash;0.90).`, why: `A stricter cutoff stops merging pairs that are only moderately similar, like "Bob"/"Robert".` },
          { do: `Add or tighten a blocking key and add a second compared field.`, why: `Blocking on city + signup date and also comparing email/phone means two different "Lin Chen"s won't match unless several fields agree.` }
        ],
        answer: `<p>Too <b>loose</b> &mdash; a low $\\tau$ glues distinct people together. Raise the threshold (toward 0.85&ndash;0.90) and strengthen <b>blocking</b> (compare only rows sharing city/date) while matching on more than one field (name <i>and</i> email/phone). That stops false merges without losing the real "Jon"/"John" dupes.</p>`
      },
      {
        q: `A teammate splits into train/test first, then de-duplicates each split separately. Why is this the wrong order, and what is the correct order?`,
        steps: [
          { do: `Note that an exact or near-duplicate pair can be split with one copy in train and one in test.`, why: `Splitting before de-duping lets the same record land on both sides.` },
          { do: `See that the model then trains on (essentially) a test row.`, why: `That is leakage: the test score reflects memorization, not generalization, so it is inflated.` },
          { do: `De-duplicate the full table first (exact, then fuzzy), then split.`, why: `Each distinct entity exists once and lands entirely on one side, keeping the test set honest.` }
        ],
        answer: `<p>De-duping after the split can't catch a pair whose two copies already sit on opposite sides &mdash; the duplicate has already <b>leaked</b> across, inflating the test score. Always de-duplicate the whole dataset <b>before</b> splitting, so every real entity appears once and on a single side.</p>`
      }
    ]
  });

  window.CODE["dw-duplicates"] = {
    lib: "pandas + rapidfuzz",
    runnable: false,
    explain: `<p>End-to-end de-dup of a small customer table merged from two sources. First the
      <b>exact</b> pass with <code>df.duplicated(subset=...)</code> / <code>drop_duplicates</code>; then a
      <b>fuzzy</b> pass that <b>normalizes</b> the name, <b>blocks</b> on city + signup date so we only
      compare plausible pairs, and <b>merges</b> names whose <code>rapidfuzz</code> similarity clears a
      threshold &mdash; collapsing each near-duplicate group to one canonical record. Install the helper
      with <code>pip install rapidfuzz</code>; swap in your own table or a <code>recordlinkage</code>
      pipeline for larger data.</p>`,
    code: `import pandas as pd
from rapidfuzz import fuzz

# --- A customer table merged from two systems, with planted duplicates ---
df = pd.DataFrame([
    {"id": 1,  "name": "John Smith",    "city": "Boston",   "signup": "2024-01-05"},
    {"id": 2,  "name": "John Smith",    "city": "Boston",   "signup": "2024-01-05"},  # exact dup
    {"id": 3,  "name": "Jon Smith",     "city": "Boston",   "signup": "2024-01-05"},  # fuzzy
    {"id": 4,  "name": "John  Smith ",  "city": "boston",   "signup": "2024-01-05"},  # fuzzy
    {"id": 5,  "name": "Mary Johnson",  "city": "New York", "signup": "2024-02-11"},
    {"id": 6,  "name": "Mary Johnson",  "city": "New York", "signup": "2024-02-11"},  # exact dup
    {"id": 7,  "name": "Mary Jonson",   "city": "New York", "signup": "2024-02-11"},  # fuzzy
    {"id": 8,  "name": "Alice Wong",    "city": "Seattle",  "signup": "2024-03-02"},
    {"id": 9,  "name": "alice wong",    "city": "Seattle",  "signup": "2024-03-02"},  # fuzzy (case)
    {"id": 10, "name": "Bob Lee",       "city": "Chicago",  "signup": "2024-04-19"},
    {"id": 11, "name": "Bob Lee",       "city": "Chicago",  "signup": "2024-04-19"},  # exact dup
    {"id": 12, "name": "Robert Lee",    "city": "Chicago",  "signup": "2024-04-19"},  # distinct -> keep
    {"id": 13, "name": "Carla Diaz",    "city": "Miami",    "signup": "2024-05-08"},
    {"id": 14, "name": "Carla Diaz",    "city": "Miami",    "signup": "2024-05-08"},  # exact dup
])
print("raw rows:", len(df))                          # 14

# === 1) EXACT duplicates on the identity columns (ignore the bookkeeping 'id') ===
keys = ["name", "city", "signup"]
print("exact dups:", df.duplicated(subset=keys).sum())   # 4
df = df.drop_duplicates(subset=keys, keep="first")       # keep the first copy
print("after exact drop:", len(df))                      # 10

# === 2) FUZZY / near-duplicates: normalize -> block -> match -> collapse ===
def norm(s):                                # lowercase, strip, collapse internal spaces
    return " ".join(str(s).lower().split())
df["nkey"] = df["name"].map(norm)

TAU = 85                                     # rapidfuzz score is 0..100; merge if >= TAU
canon = {}                                    # row index -> canonical row index
rows = df.reset_index(drop=True)
for i in range(len(rows)):
    if i in canon:
        continue
    canon[i] = i                              # i is its own canonical record
    for j in range(i + 1, len(rows)):
        if j in canon:
            continue
        # BLOCK: only compare rows in the same city + signup date
        same_block = (rows.at[i, "city"].lower() == rows.at[j, "city"].lower()
                      and rows.at[i, "signup"] == rows.at[j, "signup"])
        if same_block and fuzz.ratio(rows.at[i, "nkey"], rows.at[j, "nkey"]) >= TAU:
            canon[j] = i                      # j is a near-dup of i

clean = rows.loc[[i for i in range(len(rows)) if canon[i] == i]].drop(columns="nkey")
print("after fuzzy collapse:", len(clean))   # 6 distinct entities

# NOTE: do all of the above BEFORE train_test_split, or duplicates leak across the split.`
  };

  window.CODEVIZ["dw-duplicates"] = {
    question: "Starting from 14 customer rows merged from two systems (with planted dupes), how many rows survive after dropping EXACT duplicates, then collapsing FUZZY near-duplicates — and how do you READ a threshold sweep to know your cutoff is right?",
    charts: [
      {
        type: "bars",
        title: "Ideal: row count shrinks exact then fuzzy (14 to 10 to 6)",
        labels: ["raw rows", "after exact drop", "after fuzzy collapse"],
        values: [14, 10, 6],
        valueLabels: ["14", "10", "6"],
        colors: ["#ff7b72", "#ffb454", "#7ee787"],
        interpret: "Each bar is the number of rows left after a stage of de-duping; read it left to right as a funnel. The first drop (14 to 10) is the <b>exact</b> pass removing 4 byte-identical repeats — unambiguous. The second drop (10 to 6) is the <b>fuzzy</b> pass merging same-entity spellings (Jon/John Smith, Alice/alice Wong). Conclude: 6 truly distinct customers were hiding in 14 rows; the green end-bar is your clean table."
      },
      {
        type: "line",
        title: "Ideal threshold sweep: a flat correct plateau in the middle",
        xlabel: "fuzzy threshold tau",
        ylabel: "distinct entities found",
        series: [
          { name: "entities", color: "#7ee787", points: [[0.70, 5], [0.80, 6], [0.85, 6], [0.90, 6], [0.95, 7]] },
          { name: "true answer (6)", color: "#9aa7b4", points: [[0.70, 6], [0.95, 6]] }
        ],
        interpret: "X is the similarity cutoff tau; Y is how many distinct entities you end up with. The healthy sign is a <b>flat plateau</b> sitting on the grey true-answer line (6) across tau = 0.80 to 0.90 — a range of cutoffs all agree, so the result is robust. The dips and rises at the ends are the failure modes (next two charts). Conclude: pick tau in the middle of the plateau, not on a slope."
      },
      {
        type: "line",
        title: "Threshold too loose: undercount that keeps falling left",
        xlabel: "fuzzy threshold tau",
        ylabel: "distinct entities found",
        series: [
          { name: "entities", color: "#ff7b72", points: [[0.55, 3], [0.65, 4], [0.70, 5], [0.80, 6]] },
          { name: "true answer (6)", color: "#9aa7b4", points: [[0.55, 6], [0.80, 6]] }
        ],
        interpret: "Illustrative shape. When the curve sits <b>below</b> the grey true line and keeps dropping as you lower tau, your cutoff is too <b>loose</b>: a low bar glues distinct people together (Bob Lee + Robert Lee become one). You recognise it by an undercount that worsens toward the left. Conclude: raise tau and add a blocking key so only plausible pairs are compared."
      },
      {
        type: "line",
        title: "Threshold too tight: overcount that climbs right",
        xlabel: "fuzzy threshold tau",
        ylabel: "distinct entities found",
        series: [
          { name: "entities", color: "#ffb454", points: [[0.90, 6], [0.95, 7], [0.98, 9], [1.00, 10]] },
          { name: "true answer (6)", color: "#9aa7b4", points: [[0.90, 6], [1.00, 6]] }
        ],
        interpret: "Illustrative shape. When the curve climbs <b>above</b> the grey true line toward the right, your cutoff is too <b>tight</b>: honest variants (Jon vs John Smith) score just under the bar and stay split, so you overcount. At tau = 1.00 nothing fuzzy merges and you fall back to the 10 exact-only rows. Conclude: lower tau toward the plateau and normalise keys first (lowercase, strip spaces) so real variants line up."
      }
    ],
    caption: "Ideal funnel + a threshold sweep read three ways. The exact pass removes 4 byte-identical repeats (14 to 10); the fuzzy pass merges same-entity spellings to 6. A good sweep shows a flat plateau on the true answer (6) across tau 0.80 to 0.90; too-loose cutoffs undercount (left), too-tight cutoffs overcount (right).",
    code: `import pandas as pd
from rapidfuzz import fuzz
from itertools import combinations

df = pd.DataFrame([
    {"name":"John Smith",   "city":"Boston",  "signup":"2024-01-05"},
    {"name":"John Smith",   "city":"Boston",  "signup":"2024-01-05"},
    {"name":"Jon Smith",    "city":"Boston",  "signup":"2024-01-05"},
    {"name":"John  Smith ", "city":"boston",  "signup":"2024-01-05"},
    {"name":"Mary Johnson", "city":"New York","signup":"2024-02-11"},
    {"name":"Mary Johnson", "city":"New York","signup":"2024-02-11"},
    {"name":"Mary Jonson",  "city":"New York","signup":"2024-02-11"},
    {"name":"Alice Wong",   "city":"Seattle", "signup":"2024-03-02"},
    {"name":"alice wong",   "city":"Seattle", "signup":"2024-03-02"},
    {"name":"Bob Lee",      "city":"Chicago", "signup":"2024-04-19"},
    {"name":"Bob Lee",      "city":"Chicago", "signup":"2024-04-19"},
    {"name":"Robert Lee",   "city":"Chicago", "signup":"2024-04-19"},
    {"name":"Carla Diaz",   "city":"Miami",   "signup":"2024-05-08"},
    {"name":"Carla Diaz",   "city":"Miami",   "signup":"2024-05-08"},
])
n_raw = len(df)                                              # 14

# Exact pass
keys = ["name","city","signup"]
df_exact = df.drop_duplicates(subset=keys, keep="first")    # 14 -> 10
n_exact = len(df_exact)

# Fuzzy pass: normalize, block on (city,date), union-find merge above threshold
norm = lambda s: " ".join(str(s).lower().split())
recs = df_exact.assign(nkey=df_exact["name"].map(norm)).reset_index(drop=True)

def n_entities(tau):
    parent = list(range(len(recs)))
    def find(x):
        while parent[x]!=x: parent[x]=parent[parent[x]]; x=parent[x]
        return x
    for i,j in combinations(range(len(recs)),2):
        block = (recs.at[i,"city"].lower()==recs.at[j,"city"].lower()
                 and recs.at[i,"signup"]==recs.at[j,"signup"])
        if block and fuzz.ratio(recs.at[i,"nkey"], recs.at[j,"nkey"]) >= tau*100:
            parent[find(i)] = find(j)
    return len({find(i) for i in range(len(recs))})

print(n_raw, n_exact, n_entities(0.85))                     # 14 10 6
print([n_entities(t) for t in (0.70,0.80,0.85,0.90,0.95)])  # [5, 6, 6, 6, 7]`
  };
})();
