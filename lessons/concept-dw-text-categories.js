/* Data Wrangling — "Cleaning text & categorical values".
   Self-contained: lesson + CODE + CODEVIZ merged by id "dw-text-categories". */
(function () {
  window.LESSONS.push({
    id: "dw-text-categories",
    title: "Cleaning text & categorical values: one thing, one label",
    tagline: "Squash the many spellings of the same category down to one, before anyone counts or joins on it.",
    module: "Data Wrangling",
    prereqs: ["skill-data-audit", "fe-categorical-encoding"],

    bigIdea:
      `<p>A free-text or categorical column is a column of <b>names</b>:
       a country, a city, a product type, a status. The trouble is that humans (and the systems
       that log them) write the <b>same thing many ways</b>. The United States shows up as
       <code>USA</code>, <code>usa</code>, <code>U.S.A.</code>, <code> US </code>, and
       <code>United States of America</code> &mdash; all the same country, all different strings.</p>
       <p>To a computer those are <b>different values</b>. So a count of countries reports five tiny
       groups instead of one big one. A join on country silently drops the rows whose spelling does
       not match. A model sees five rare categories where there is really one common one. The signal
       gets <b>split and watered down</b>.</p>
       <p>This lesson is about <b>cleaning the values themselves</b>: trimming and lower/upper-casing,
       stripping punctuation and accents, fixing typos, and <b>mapping every spelling of a thing to one
       canonical label</b>. That is different from <b>encoding</b> the cleaned categories into numbers
       for a model &mdash; that comes later (see the <code>fe-categorical-encoding</code> lesson). Clean
       first, encode second.</p>`,

    buildup:
      `<p>Think of a categorical column as a list of strings. Two strings that <i>mean</i> the same
       category can differ in ways that are pure noise:</p>
       <ul>
         <li><b>Whitespace</b> &mdash; a leading or trailing space: <code>"USA "</code> vs
         <code>"USA"</code>. Fix with <code>str.strip()</code>; collapse doubled inner spaces with a
         regular expression.</li>
         <li><b>Case</b> &mdash; <code>"usa"</code> vs <code>"USA"</code>. Fold to one case with
         <code>str.lower()</code> or <code>str.upper()</code> so case-only differences disappear.</li>
         <li><b>Punctuation &amp; accents</b> &mdash; <code>"U.S.A."</code> vs <code>"USA"</code>, or
         <code>"México"</code> vs <code>"Mexico"</code>. Drop punctuation with
         <code>str.replace</code>/regex; strip accents by normalizing the Unicode text.</li>
         <li><b>Different words for one thing</b> &mdash; <code>"United States"</code>,
         <code>"US"</code>, <code>"America"</code>. No amount of casing fixes this. You need an explicit
         <b>mapping</b> from each variant to one chosen <b>canonical label</b>.</li>
         <li><b>Typos</b> &mdash; <code>"Unted States"</code>, <code>"Fance"</code>. Catch these with
         <b>fuzzy matching</b> against your known good labels.</li>
       </ul>
       <p>The recipe is: <b>normalize</b> (strip, case, punctuation, accents) to kill the easy noise,
       then <b>standardize</b> (a mapping) to merge the real synonyms, then <b>collapse rare</b>
       categories that are still left over into a single <code>"Other"</code> bucket so the long tail
       does not flood your model.</p>`,

    whenToUse:
      `<p><b>Reach for this on any free-text or categorical field that a human or an upstream system
       typed.</b></p>
       <ul>
         <li><b>Form fields.</b> Country, city, job title, company name &mdash; anything entered by hand
         arrives with every casing, spacing, and abbreviation a person can produce.</li>
         <li><b>Logs &amp; event data.</b> Status strings, device names, error codes, and tags drift over
         time as different services write them slightly differently.</li>
         <li><b>Merged sources.</b> The moment you concatenate two datasets, their categorical vocabularies
         collide: one file says <code>"NY"</code>, the other says <code>"New York"</code>. Cleaning is what
         lets the join and the <code>groupby</code> line up.</li>
         <li><b>Before any count, join, or encoding.</b> Do this <i>before</i> you
         <code>value_counts()</code>, <code>groupby</code>, join, or one-hot encode &mdash; otherwise every
         downstream number inherits the split-label error.</li>
       </ul>`,

    application:
      `<p>Value cleaning is the unglamorous step that makes every later number trustworthy.</p>
       <ul>
         <li><b>Reporting.</b> "Sales by country" is only correct once
         <code>USA</code>/<code>U.S.A.</code>/<code>United States</code> are one row, not three.</li>
         <li><b>Entity resolution.</b> Standardizing company or person names is the first pass of matching
         records that refer to the same real-world entity.</li>
         <li><b>Modeling.</b> Collapsing the long tail of rare categories into <code>"Other"</code> keeps a
         one-hot encoding from exploding into thousands of mostly-empty columns (the high-cardinality
         blow-up the <code>fe-categorical-encoding</code> lesson warns about).</li>
       </ul>`,

    pitfalls:
      `<ul>
         <li><b>One entity wearing many labels.</b> Left uncleaned, the same category appears as several
         distinct values. This <b>inflates cardinality</b> and <b>splits the signal</b>: each spelling
         gets a tiny count and a weak, noisy model weight. The fix is normalization plus an explicit
         canonical mapping.</li>
         <li><b>Over-aggressive normalization merging distinct things.</b> Lower-casing and stripping
         punctuation can fuse genuinely different categories &mdash; e.g. the company <code>"IT"</code>
         (Italy) and the department <code>"it"</code> (information technology), or
         <code>"US"</code> the country versus a product code <code>"U.S."</code>. Check what your
         cleaning collapses; don't flatten meaning.</li>
         <li><b>Locale, accents, and encoding.</b> <code>"São Paulo"</code> may arrive as
         <code>"S&atilde;o Paulo"</code>, <code>"Sao Paulo"</code>, or mojibake from a bad encoding. Decide
         deliberately whether to strip accents (and do it with proper Unicode normalization, not a hand-made
         character list) so the same city does not fragment.</li>
         <li><b>Case-sensitive joins failing silently.</b> A join on <code>country</code> where one side is
         <code>"usa"</code> and the other is <code>"USA"</code> drops every mismatched row with <i>no
         error</i>. Normalize both keys to the same case/whitespace <b>before</b> joining.</li>
         <li><b>"Other" hiding a real category.</b> Collapsing rare levels is useful, but a frequency
         threshold can sweep a small-but-important class (a high-value segment, a rare fraud type) into
         <code>"Other"</code>. Inspect what lands in the bucket before you trust it.</li>
         <li><b>Fuzzy matching's false merges.</b> Auto-correcting typos by nearest string can match
         <code>"Austria"</code> to <code>"Australia"</code>. Use a similarity threshold and review the
         proposed merges rather than applying them blindly.</li>
       </ul>`,

    derivation:
      `<p><b>Why splitting one category across many labels hurts &mdash; concretely.</b></p>
       <ul class="steps">
         <li>Suppose the United States truly accounts for 12 of your rows, but those 12 are written as 10
         different strings (<code>USA</code>, <code>usa</code>, <code>U.S.A.</code>, <code>US</code>, &hellip;).
         A <code>value_counts()</code> then reports ten categories with counts like 2, 2, 1, 1, &hellip;
         instead of one category with count 12.</li>
         <li>A "top countries" report now <b>misranks</b>: the real number-one country looks like ten small
         also-rans, and some genuinely smaller country with a single consistent spelling floats to the top.</li>
         <li>For a model, each of those ten spellings becomes its own one-hot column. Each column is almost
         always zero, so the model can learn almost nothing from any of them &mdash; the <b>signal that "this
         row is the US"</b> is shattered across ten weak features instead of concentrated in one strong one.</li>
         <li>A join on the raw column keeps only the rows whose spelling matches the other table exactly. If
         the other table uses <code>United States</code>, the nine rows written <code>USA</code>/<code>US</code>/&hellip;
         simply <b>vanish</b> from the result &mdash; silent data loss.</li>
         <li>Normalizing (strip + case + punctuation) collapses the spelling noise; a canonical mapping merges
         the remaining synonyms; the count becomes a single honest 12, the join keeps all rows, and the model
         gets one clean feature. $\\blacksquare$</li>
       </ul>`,

    example:
      `<p>Concretely: just the 12 rows that all mean <b>United States</b>. Watch the distinct-label
       count fall as each cleaning step runs. The raw spellings and their counts are:</p>
       <table class="extable">
         <caption>12 US rows scattered across 10 raw labels (a value_counts())</caption>
         <thead><tr><th>raw label</th><th class="num">count</th></tr></thead>
         <tbody>
           <tr><td class="row-h"><code>USA</code></td><td class="num">2</td></tr>
           <tr><td class="row-h"><code>usa</code></td><td class="num">2</td></tr>
           <tr><td class="row-h"><code>U.S.A.</code></td><td class="num">1</td></tr>
           <tr><td class="row-h"><code>United States</code></td><td class="num">1</td></tr>
           <tr><td class="row-h"><code>US</code></td><td class="num">1</td></tr>
           <tr><td class="row-h"><code>U.S.</code></td><td class="num">1</td></tr>
           <tr><td class="row-h"><code>United States of America</code></td><td class="num">1</td></tr>
           <tr><td class="row-h"><code> us </code></td><td class="num">1</td></tr>
           <tr><td class="row-h"><code>U.S</code></td><td class="num">1</td></tr>
           <tr><td class="row-h"><code>Unted States</code> (typo)</td><td class="num">1</td></tr>
           <tr><td class="row-h"><b>total rows</b></td><td class="num"><b>12</b></td></tr>
         </tbody>
       </table>
       <p>Now run the recipe step by step, tracking the <b>distinct-label count</b> over all 39 rows in the
       full column (9 real countries):</p>
       <ul class="steps">
         <li><b>Audit.</b> <code>value_counts()</code> on the raw column &rarr; <b>38</b> distinct labels.
         For the US alone, that is <b>10</b> labels with counts 2+2+1+1+1+1+1+1+1+1 = <b>12</b>.</li>
         <li><b>Normalize.</b> <code>.str.strip().str.upper()</code> then drop dots. Now
         <code>" USA "</code>, <code>"usa"</code>, <code>"USA"</code>, <code>" us "</code>,
         <code>"US"</code>, <code>"U.S.A."</code>, <code>"U.S."</code>, <code>"U.S"</code> all collapse:
         the 10 US labels fall to just <b>3</b> (<code>USA</code> with 2+2+1+1 = 6, <code>US</code> with
         1+1 = 2, <code>U.S.A.</code>+<code>U.S.</code>+<code>U.S</code> = 3, and <code>UNTED STATES</code> = 1).
         Across the whole column the distinct count drops 38 &rarr; <b>23</b>.</li>
         <li><b>Standardize.</b> The mapping <code>{"USA":"United States","US":"United States",
         "UNTED STATES":"United States", &hellip;}</code> merges synonyms and the typo. All US variants
         become one label; the column-wide distinct count falls 23 &rarr; <b>9</b> &mdash; the true number
         of countries.</li>
         <li><b>Collapse rare tail.</b> Two countries appear once each (count <code>&lt; 2</code>). Map them
         to <code>"Other"</code>: 9 categories &rarr; 8 real + 1 catch-all.</li>
       </ul>
       <p>The US count, summed back: <b>2+2+1+1+1+1+1+1+1+1 = 12</b> &mdash; one honest row instead of ten
       fragments. The whole column went from <b>38 noisy labels to 9 clean ones</b>.</p>`,

    practice: [
      {
        q: `A "sales by country" report lists <code>USA</code>, <code>usa</code>, <code>U.S.A.</code>, and <code>United States</code> as four separate rows, so the US never appears in the top 3. Walk through the cleaning steps that fix it.`,
        steps: [
          { do: `Audit with <code>df['country'].value_counts()</code> to see the near-duplicate labels.`, why: `You can't fix what you haven't seen; the audit reveals that one country is split across several strings.` },
          { do: `Normalize: <code>.str.strip().str.upper().str.replace('.', '', regex=False)</code>.`, why: `Trimming spaces, folding case, and dropping dots collapses <code>" USA "</code>, <code>"usa"</code>, and <code>"U.S.A."</code> into one <code>"USA"</code>.` },
          { do: `Standardize: <code>.replace({"USA":"United States","US":"United States", ...})</code>.`, why: `Casing alone can't merge <code>"USA"</code> with <code>"United States"</code>; an explicit mapping to a canonical label does.` },
          { do: `Re-run <code>value_counts()</code> to confirm one US row with the summed count.`, why: `The report now ranks countries by their true totals instead of by spelling fragments.` }
        ],
        answer: `<p><b>Audit</b> to see the variants, <b>normalize</b> (<code>strip</code> + <code>upper</code> + drop punctuation) to kill spacing/case/dot noise, then <b>standardize</b> with a <code>replace</code> mapping to a single canonical <code>"United States"</code>. After that the four fragments become one row whose count is their sum, and the US lands in its rightful rank.</p>`
      },
      {
        q: `You inner-join an orders table on <code>country</code> with a reference table, and ~40% of orders silently disappear from the result. The orders use values like <code>"usa"</code> and <code>" UK "</code>; the reference table uses <code>"USA"</code> and <code>"UK"</code>. What is happening and how do you fix it?`,
        steps: [
          { do: `Recognize that joins match keys <b>exactly</b>, including case and whitespace.`, why: `<code>"usa"</code> and <code>"USA"</code> are different strings, so those rows find no match and are dropped by an inner join with no error.` },
          { do: `Normalize the join key on <b>both</b> tables the same way: <code>.str.strip().str.upper()</code>.`, why: `Making both keys identical in case and whitespace lets the matching rows actually meet.` },
          { do: `Then join on the normalized key.`, why: `With consistent keys the previously-dropped rows are retained, recovering the missing 40%.` }
        ],
        answer: `<p>The join is <b>case- and whitespace-sensitive</b>, so <code>"usa"</code> never matches <code>"USA"</code> and those rows are dropped <i>silently</i>. Fix it by <b>normalizing the join key on both sides</b> (<code>.str.strip().str.upper()</code>, and ideally the same canonical mapping) <b>before</b> joining. This is the "case-sensitive joins failing silently" pitfall.</p>`
      },
      {
        q: `Your <code>city</code> column has 4,000 distinct values, most appearing only once or twice, and one-hot encoding it produces 4,000 columns. You decide to collapse rare cities into <code>"Other"</code> using a frequency threshold. What is the benefit, and what must you check before trusting the result?`,
        steps: [
          { do: `Compute frequencies with <code>value_counts()</code> and pick a threshold (e.g. keep cities with count &ge; 20).`, why: `Cities below the threshold are too rare to give a reliable model weight; bucketing them bounds the cardinality.` },
          { do: `Map sub-threshold cities to <code>"Other"</code>.`, why: `This shrinks 4,000 mostly-empty one-hot columns down to the common cities plus a single catch-all column.` },
          { do: `Inspect what landed in <code>"Other"</code> before trusting it.`, why: `A rare-but-important city (a high-value market) could be hidden in the bucket; the "Other hiding a real category" pitfall.` }
        ],
        answer: `<p><b>Benefit:</b> collapsing the rare tail into <code>"Other"</code> caps the cardinality, so one-hot encoding produces a handful of populated columns instead of 4,000 mostly-zero ones &mdash; less memory, faster training, more reliable weights. <b>Check:</b> look at what fell into <code>"Other"</code>, because a frequency threshold can sweep a small-but-important category into the bucket and hide it.</p>`
      }
    ]
  });

  window.CODE["dw-text-categories"] = {
    lib: "pandas",
    runnable: false,
    explain: `<p>End-to-end cleaning of one messy <code>country</code> column. We <b>audit</b> with
       <code>value_counts()</code>, <b>normalize</b> with the <code>.str</code> accessor
       (<code>strip</code>, <code>upper</code>, a regex to squeeze inner whitespace, and
       <code>replace</code> to drop punctuation), strip <b>accents</b> via Unicode normalization,
       <b>standardize</b> synonyms and typos with a canonical <code>replace</code> mapping, and finally
       <b>collapse rare</b> categories into <code>"Other"</code> with a frequency threshold. The column
       here is inline and self-contained, so this runs as-is. Cleaning the <i>values</i> is a separate
       step from <i>encoding</i> them for a model &mdash; see the <code>fe-categorical-encoding</code>
       lesson for what comes next.</p>`,
    code: `import pandas as pd
import unicodedata

# --- A messy categorical column straight out of a form / merged sources ---
df = pd.DataFrame({'country': [
    ' USA ', 'usa', 'U.S.A.', 'United States', 'US', 'U.S.',
    'United States of America', 'usa', 'USA', ' us ', 'U.S', 'Unted States',
    'UK', 'U.K.', 'United Kingdom', 'uk', 'Great Britain', 'U.K', 'United  Kingdom',
    'Germany', 'germany', 'DE', 'Deutschland', ' Germany',
    'France', 'france', 'FR', 'Fance',
    'Canada', 'CA', 'canada',
    'Brazil', 'Brasil', 'BR',
    'Japan', 'JP', 'japan',
    'India', 'Australia',
]})

# === 1. AUDIT: how many ways is the same thing written? ===
print(df['country'].value_counts())
print('distinct labels BEFORE:', df['country'].nunique())   # -> 38

# === 2. NORMALIZE: strip, upper-case, squeeze whitespace, drop punctuation ===
s = (df['country']
     .str.strip()                          # kill leading/trailing spaces
     .str.upper()                          # fold case: 'usa' -> 'USA'
     .str.replace(r'\\s+', ' ', regex=True) # collapse 'UNITED  KINGDOM' -> 'UNITED KINGDOM'
     .str.replace(r'[.\\-]', '', regex=True))# drop dots/hyphens: 'U.S.A.' -> 'USA'

# strip accents (e.g. 'MÉXICO' -> 'MEXICO') via Unicode normalization
def strip_accents(x):
    return ''.join(c for c in unicodedata.normalize('NFKD', x)
                   if not unicodedata.combining(c))
s = s.map(strip_accents)
print('distinct AFTER normalize:', s.nunique())              # -> 23

# === 3. STANDARDIZE: map every variant (incl. typos) to one canonical label ===
canon = {
    'USA': 'United States', 'US': 'United States', 'UNITED STATES': 'United States',
    'UNITED STATES OF AMERICA': 'United States', 'UNTED STATES': 'United States',
    'UK': 'United Kingdom', 'UNITED KINGDOM': 'United Kingdom', 'GREAT BRITAIN': 'United Kingdom',
    'GERMANY': 'Germany', 'DE': 'Germany', 'DEUTSCHLAND': 'Germany',
    'FRANCE': 'France', 'FR': 'France', 'FANCE': 'France',          # 'FANCE' is a typo
    'CANADA': 'Canada', 'CA': 'Canada',
    'BRAZIL': 'Brazil', 'BRASIL': 'Brazil', 'BR': 'Brazil',
    'JAPAN': 'Japan', 'JP': 'Japan',
    'INDIA': 'India', 'AUSTRALIA': 'Australia',
}
df['country_clean'] = s.replace(canon)
print('distinct AFTER standardize:', df['country_clean'].nunique())  # -> 9
print(df['country_clean'].value_counts())
# United States 12 | United Kingdom 7 | Germany 5 | France 4 | ...

# (optional) fuzzy-match leftover typos against the known good labels:
# from rapidfuzz import process, fuzz
# known = ['United States', 'United Kingdom', 'Germany', 'France', ...]
# process.extractOne('Unted States', known, scorer=fuzz.ratio)  # -> ('United States', 92, ...)

# === 4. COLLAPSE RARE categories into 'Other' (frequency threshold) ===
freq = df['country_clean'].value_counts()
rare = freq[freq < 2].index                  # appears fewer than 2 times
df['country_final'] = df['country_clean'].where(~df['country_clean'].isin(rare), 'Other')
print(df['country_final'].value_counts())     # rare singletons folded into 'Other'

# NOTE: cleaning the VALUES is done. ENCODING them for a model
# (one-hot / dummy / effect) is the separate next step -> fe-categorical-encoding.`
  };

  window.CODEVIZ["dw-text-categories"] = {
    question: "One country, ten spellings. Here is the count split BEFORE cleaning and merged AFTER — then two ways cleaning itself goes wrong: over-merging distinct things, and 'Other' swallowing a real category.",
    charts: [
      {
        type: "bars",
        title: "BEFORE: the United States alone is split across 10 near-duplicate labels (12 rows)",
        xlabel: "raw label (all mean 'United States')",
        ylabel: "row count",
        labels: ["USA", "usa", "U.S.A.", "United States", "US", "U.S.", "U.S of A", "us", "U.S", "Unted States"],
        values: [2, 2, 1, 1, 1, 1, 1, 1, 1, 1],
        valueLabels: ["2", "2", "1", "1", "1", "1", "1", "1", "1", "1"],
        colors: ["#ff7b72", "#ff7b72", "#ff7b72", "#ff7b72", "#ff7b72", "#ff7b72", "#ff7b72", "#ff7b72", "#ff7b72", "#ff7b72"],
        interpret: "Real counts. The x-axis lists ten raw strings that <b>all mean the United States</b>; the y-axis is how many rows carry each. <b>How to read it:</b> every bar is tiny (height 1 or 2) because the 12 US rows are shattered across spellings — case, spacing, dots, abbreviations, and the typo 'Unted States'. <b>Conclude:</b> a value_counts() here misranks the true top country as ten also-rans, and a join would drop the non-matching spellings. This is the disease cleaning cures."
      },
      {
        type: "bars",
        title: "AFTER: normalize + canonical mapping → 9 true categories (US is one bar of 12)",
        xlabel: "cleaned canonical label",
        ylabel: "row count",
        labels: ["United States", "United Kingdom", "Germany", "France", "Canada", "Brazil", "Japan", "India", "Australia"],
        values: [12, 7, 5, 4, 3, 3, 3, 1, 1],
        valueLabels: ["12", "7", "5", "4", "3", "3", "3", "1", "1"],
        colors: ["#7ee787", "#7ee787", "#7ee787", "#7ee787", "#7ee787", "#7ee787", "#7ee787", "#58a6ff", "#58a6ff"],
        interpret: "The healthy result. Same data after .str.strip().str.upper(), punctuation removal, and a canonical replace() mapping. <b>How to read it:</b> one bar per real country, sorted high→low; the scattered US fragments are now a single honest bar of 12. <b>Conclude:</b> counts, ranks, joins and one-hot columns are all correct now. The two blue bars (India, Australia, count 1) are the rare tail — exactly what a frequency threshold would fold into 'Other'."
      },
      {
        type: "bars",
        title: "PITFALL — over-merging: cleaning fused two genuinely different categories (illustrative)",
        xlabel: "over-normalized label",
        ylabel: "row count",
        labels: ["IT (Italy + 'it' dept)", "US (country + product code)", "Germany", "France"],
        values: [9, 14, 5, 4],
        valueLabels: ["9", "14", "5", "4"],
        colors: ["#ffb454", "#ffb454", "#9aa7b4", "#9aa7b4"],
        interpret: "Illustrative. The orange bars are <b>too tall</b> because lower-casing and stripping punctuation collapsed things that should stay apart: country 'IT' (Italy) merged with department 'it' (IT/tech), and country 'US' merged with a product code 'U.S.'. <b>How to recognise it:</b> a category's count jumps after cleaning beyond what the synonyms can explain, or a label now spans two meanings. <b>Conclude:</b> normalization can flatten real meaning — always inspect what your cleaning collapses, and exclude codes/ambiguous tokens from blanket case-folding."
      },
      {
        type: "bars",
        title: "PITFALL — 'Other' swallowed a real category (illustrative)",
        xlabel: "label after rare-collapse (threshold count < 5)",
        ylabel: "row count",
        labels: ["United States", "United Kingdom", "Germany", "Other"],
        values: [12, 7, 5, 9],
        valueLabels: ["12", "7", "5", "9 (hides a fraud segment)"],
        colors: ["#7ee787", "#7ee787", "#7ee787", "#ff7b72"],
        interpret: "Illustrative. Collapsing every label with count below the threshold into 'Other' is usually good, but here the red 'Other' bar (9 rows) hides a small-but-important class — e.g. a high-value market or a rare fraud type — that simply fell under the cutoff. <b>How to recognise it:</b> an 'Other' bucket that is large or that you cannot fully account for. <b>Conclude:</b> a frequency threshold is blind to importance; always list what landed in 'Other' before trusting it, and whitelist categories that matter regardless of count."
      }
    ],
    code: `import pandas as pd

raw = [
    ' USA ', 'usa', 'U.S.A.', 'United States', 'US', 'U.S.',
    'United States of America', 'usa', 'USA', ' us ', 'U.S', 'Unted States',
    'UK', 'U.K.', 'United Kingdom', 'uk', 'Great Britain', 'U.K', 'United  Kingdom',
    'Germany', 'germany', 'DE', 'Deutschland', ' Germany',
    'France', 'france', 'FR', 'Fance',
    'Canada', 'CA', 'canada',
    'Brazil', 'Brasil', 'BR',
    'Japan', 'JP', 'japan',
    'India', 'Australia',
]
s = pd.Series(raw)
print('distinct BEFORE:', s.nunique())          # -> 38

# --- BEFORE chart: the US family of labels, lightly stripped for display ---
us_family = [x.strip() for x in raw
             if x.strip().upper().replace('.', '').replace(' ', '')
             in {'USA', 'US', 'UNITEDSTATES', 'UNITEDSTATESOFAMERICA', 'UNTEDSTATES'}]
print(pd.Series(us_family).value_counts())
# USA 2 | usa 2 | U.S.A. 1 | United States 1 | US 1 | U.S. 1 | ... 12 rows, 10 labels

# --- Clean: normalize then map to canonical labels ---
norm = (s.str.strip().str.upper()
         .str.replace(r'\\s+', ' ', regex=True)
         .str.replace('.', '', regex=False))
canon = {
    'USA': 'United States', 'US': 'United States', 'UNITED STATES': 'United States',
    'UNITED STATES OF AMERICA': 'United States', 'UNTED STATES': 'United States',
    'UK': 'United Kingdom', 'UNITED KINGDOM': 'United Kingdom', 'GREAT BRITAIN': 'United Kingdom',
    'GERMANY': 'Germany', 'DE': 'Germany', 'DEUTSCHLAND': 'Germany',
    'FRANCE': 'France', 'FR': 'France', 'FANCE': 'France',
    'CANADA': 'Canada', 'CA': 'Canada',
    'BRAZIL': 'Brazil', 'BRASIL': 'Brazil', 'BR': 'Brazil',
    'JAPAN': 'Japan', 'JP': 'Japan', 'INDIA': 'India', 'AUSTRALIA': 'Australia',
}
clean = norm.replace(canon)
print('distinct AFTER:', clean.nunique())        # -> 9
print(clean.value_counts())
# United States 12 | United Kingdom 7 | Germany 5 | France 4 |
# Canada 3 | Brazil 3 | Japan 3 | India 1 | Australia 1`
  };
})();
