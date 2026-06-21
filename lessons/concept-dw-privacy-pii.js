/* Data Wrangling — "Handling sensitive data: PII, anonymization, and k-anonymity".
   Self-contained: lesson + CODE + CODEVIZ merged by id "dw-privacy-pii". */
(function () {
  window.LESSONS.push({
    id: "dw-privacy-pii",
    title: "Privacy & PII: wrangling data about people responsibly",
    tagline: "Strip the obvious identifiers, then realize that ZIP + birthdate + gender still names you — and fix that too.",
    module: "Data Wrangling",
    prereqs: ["skill-data-audit"],

    bigIdea:
      `<p>Most real datasets are about <b>people</b>: users, patients, customers, employees. The moment a
       row can be traced back to a human, you have a duty &mdash; legal and ethical &mdash; to handle it
       with care. <b>PII (Personally Identifiable Information)</b> is any data that identifies a specific
       person, on its own or combined with other data.</p>
       <p>PII comes in two flavors, and the second is the one people forget. <b>Direct identifiers</b>
       point straight at someone: full name, email, Social Security Number, phone number, account ID.
       <b>Quasi-identifiers</b> look harmless one at a time but <b>re-identify</b> a person when combined.
       The classic result: a person's <b>5-digit ZIP code, birthdate, and gender together uniquely
       identify about 87% of the U.S. population</b> (Latanya Sweeney's study). None of those three is a
       name &mdash; yet together they are as good as one.</p>
       <p>So "we deleted the names, it's anonymous now" is usually <b>false</b>. This lesson is the
       wrangling craft of actually making people-data safe to share, log, or train on: drop and redact
       direct identifiers, hash or pseudonymize IDs, <b>generalize</b> the quasi-identifiers, and then
       <b>check</b> that the result is anonymous using <b>k-anonymity</b>.</p>`,

    buildup:
      `<p>Walk a row of people-data through the toolbox, weakest protection to strongest.</p>
       <p><b>1. Remove / redact direct identifiers.</b> Drop the <code>name</code>, <code>email</code>,
       <code>ssn</code>, <code>phone</code> columns outright, or replace their values with a mask like
       <code>"[REDACTED]"</code>. This is necessary but never sufficient.</p>
       <p><b>2. Hash or tokenize IDs you still need.</b> Sometimes you must keep a stable per-person key so
       rows can be linked (e.g. counting visits per user) without storing the real ID. Replace the ID with
       a one-way <b>hash</b>. Crucially, <b>add a secret salt</b> first: hashing a phone number or email
       <i>without</i> salt is reversible, because an attacker can hash every possible phone number and
       match &mdash; a <b>dictionary attack</b>. A salt (a long secret string mixed in before hashing)
       defeats that.</p>
       <p><b>3. Pseudonymization.</b> Swap each real identifier for a fake but consistent token
       (<code>user_4f2a&hellip;</code>). Same person, same token, so analysis still works &mdash; but the
       mapping from token back to person is kept in a separate, locked-down table. This is reversible by
       design (by whoever holds the key), so under <b>GDPR (General Data Protection Regulation)</b>
       pseudonymized data is still personal data.</p>
       <p><b>4. Generalize / bin the quasi-identifiers.</b> Make each quasi-identifier <i>coarser</i> so many
       people share the same value: turn an exact birthdate into an <b>age band</b> (30&ndash;39), a full
       5-digit ZIP into its first 3 digits, an exact salary into a range. Now individuals blur into groups.</p>
       <p><b>5. Aggregate.</b> The safest move of all: don't release rows, release <b>counts and averages</b>
       per group. "1,240 users in region X, mean age 41" reveals no individual &mdash; as long as the groups
       aren't tiny.</p>`,

    symbols: [
      { sym: "$k$", desc: "the k-anonymity threshold: every record must share its quasi-identifier values with at least $k-1$ others, so it sits in a group of $\\ge k$ indistinguishable people." },
      { sym: "$Q$", desc: "the set of quasi-identifier columns (e.g. {age-band, ZIP-3, gender}) used to check re-identification." },
      { sym: "$g$", desc: "an equivalence class: all records that share the exact same combination of quasi-identifier values. Its size is $|g|$." }
    ],

    formula:
      `$$ \\text{$k$-anonymous} \\iff \\min_{g}\\, |g| \\;\\ge\\; k,
         \\qquad |g| = \\#\\{\\text{records sharing one combination of } Q\\}. $$`,

    whatItDoes:
      `<p>Group every record by its quasi-identifier columns $Q$. Each distinct combination forms an
       <b>equivalence class</b> $g$; its size $|g|$ is how many people are indistinguishable on $Q$. The
       dataset is <b>$k$-anonymous</b> when the <i>smallest</i> such group has at least $k$ members &mdash;
       so no record can be narrowed down to fewer than $k$ people. A group of size 1 is a unique,
       <b>re-identifiable</b> person; the whole job of generalization is to merge those singletons into
       bigger groups until $\\min_g |g| \\ge k$.</p>`,

    derivation:
      `<p><b>Why "no names" is not anonymity, and how $k$ fixes it.</b></p>
       <ul class="steps">
         <li>Strip the name and email and you still have rows like <code>(birthdate=1983-07-14, ZIP=02139, gender=F)</code>. Each value is innocuous; the <b>combination</b> is rare. In a city, maybe one woman fits exactly &mdash; so the row is a unique fingerprint. That is a quasi-identifier at work.</li>
         <li>An attacker re-identifies by <b>linking</b> this fingerprint to a second dataset that <i>does</i> have names &mdash; a voter roll, a public profile, a leaked list &mdash; on the shared quasi-identifiers. Sweeney famously re-identified a governor's hospital record this way using only ZIP, birthdate, and gender.</li>
         <li>So the risk isn't the presence of names; it's the <b>uniqueness of the quasi-identifier combination</b>. Measure it: group the data by $Q$ and look at group sizes. Any group of size 1 is a person waiting to be re-identified.</li>
         <li><b>Generalize</b> to shrink the number of distinct combinations. Birthdate $\\to$ age-band collapses 365 values into ~8; ZIP-5 $\\to$ ZIP-3 collapses ~40,000 into ~900. Rare fingerprints merge into common ones, so group sizes grow.</li>
         <li>Keep generalizing until the smallest group has $\\ge k$ members. Then every record is hidden among at least $k-1$ look-alikes &mdash; that's <b>$k$-anonymity</b>. Higher $k$ is safer but coarser; you trade <b>utility</b> for privacy. $\\blacksquare$</li>
       </ul>`,

    example:
      `<p>Five people, names already dropped. Quasi-identifiers $Q$ = (exact birthdate, 5-digit ZIP, gender):</p>
       <ul class="steps">
         <li>Raw rows: (1983-07-14, 02139, F), (1991-02-03, 02141, M), (1983-11-30, 02139, F), (1991-08-22, 02141, M), (1955-01-09, 30301, F).</li>
         <li>Group by exact $Q$: every combination is <b>unique</b> &mdash; five groups of size 1. So $\\min_g|g| = 1$: this is only <b>1-anonymous</b>, i.e. fully re-identifiable.</li>
         <li>Now <b>generalize</b>: birthdate $\\to$ age-band, ZIP-5 $\\to$ ZIP-3. Rows become (40s, 021, F), (30s, 021, M), (40s, 021, F), (30s, 021, M), (70s, 303, F).</li>
         <li>Re-group: <b>(40s, 021, F)</b> now has 2 members, <b>(30s, 021, M)</b> has 2, and <b>(70s, 303, F)</b> still has 1.</li>
         <li>The smallest group is still 1, so we're 1-anonymous &mdash; the lone 70s person is exposed. To reach $k=2$ you'd suppress that row, or generalize gender / coarsen further until even she shares a group. The check is mechanical: <b>group, count, find the min</b>.</li>
       </ul>`,

    whenToUse:
      `<p><b>Reach for this any time the data has people in it</b> &mdash; and especially at these moments:</p>
       <ul>
         <li><b>Before sharing or exporting.</b> Sending a CSV to a partner, a vendor, another team, or a
         public release: redact direct identifiers and confirm $k$-anonymity on the quasi-identifiers first.</li>
         <li><b>Before logging.</b> Do not write raw emails, tokens, or full request bodies to logs &mdash;
         logs get shipped, indexed, and retained far longer than you think. Hash or drop PII at the log boundary.</li>
         <li><b>Before training a model.</b> A model can <b>memorize</b> and later regurgitate training PII.
         Strip and generalize first; aggregate where the model doesn't need row-level detail.</li>
         <li><b>Choosing the technique.</b> Need to link rows per person but not know who they are?
         <b>Salted hash / pseudonymize</b>. Need to publish row-level data safely? <b>Generalize + check
         $k$-anonymity</b>. Need only group-level facts? <b>Aggregate</b> &mdash; the strongest and simplest.</li>
       </ul>`,

    application:
      `<p>Where this shows up in real data work:</p>
       <ul>
         <li><b>Healthcare (HIPAA).</b> The U.S. <b>HIPAA (Health Insurance Portability and Accountability
         Act)</b> "Safe Harbor" rule literally lists 18 identifiers to remove and requires generalizing ages
         over 89 and ZIPs to 3 digits &mdash; generalization by law.</li>
         <li><b>EU data (GDPR).</b> The <b>GDPR (General Data Protection Regulation)</b> distinguishes
         truly <i>anonymous</i> data (out of scope) from merely <i>pseudonymized</i> data (still regulated,
         because it's reversible). Getting this wrong carries real fines.</li>
         <li><b>Analytics &amp; A/B logs.</b> User IDs are salted-hashed before landing in the warehouse so
         analysts can count per-user behavior without holding raw identifiers.</li>
         <li><b>Differential privacy at scale.</b> The U.S. Census, Apple, and Google add calibrated random
         <b>noise</b> to aggregates so that no single person's presence changes the published number much
         &mdash; a formal, tunable privacy guarantee that goes beyond $k$-anonymity.</li>
       </ul>`,

    pitfalls:
      `<ul>
         <li><b>"No names, so it's anonymous."</b> The biggest mistake. Quasi-identifiers (ZIP + birthdate +
         gender, device + timestamp, rare job title + employer) re-identify people with no name in sight.
         The fix: list your quasi-identifiers, generalize them, and <b>verify $k$-anonymity</b> &mdash; don't
         assume it.</li>
         <li><b>Unsalted hashes are reversible.</b> The space of phone numbers, SSNs, or common emails is
         small enough to hash exhaustively (a <b>dictionary / rainbow-table attack</b>). Always mix in a
         secret <b>salt</b> (and prefer a slow hash) before hashing an identifier.</li>
         <li><b>Free-text fields leak PII.</b> A "notes" or "feedback" column happily contains names, phone
         numbers, and addresses that your column-drop never touched. Scan and scrub free text, don't just
         drop obvious columns.</li>
         <li><b>PII hiding in logs, backups, caches, and URLs.</b> You scrubbed the table but the raw data
         still lives in last night's backup, the request log, and a query string. Privacy is a pipeline
         property, not a one-table fix.</li>
         <li><b>Over-generalizing destroys utility.</b> Push $k$ too high or bin too coarsely and every
         column becomes "USA / adult / human" &mdash; private but useless. Tune the privacy/utility trade-off;
         generalize only as much as $k$ requires.</li>
         <li><b>Legal exposure is real.</b> Mishandled PII means GDPR/HIPAA fines, breach disclosure, and lost
         trust. When unsure, default to <b>less</b> data and <b>more</b> aggregation.</li>
       </ul>`,

    practice: [
      {
        q: `A colleague hands you a "fully anonymized" customer table: they deleted <code>name</code> and <code>email</code>, but kept exact <code>birthdate</code>, full 5-digit <code>zip</code>, and <code>gender</code>. Is it safe to publish? Justify with the concept and give the fix.`,
        steps: [
          { do: `Identify the surviving fields as quasi-identifiers, not harmless columns.`, why: `Birthdate, ZIP, and gender together re-identify ~87% of people even with no name present.` },
          { do: `Group the table by (birthdate, zip, gender) and inspect group sizes.`, why: `Most combinations will be unique (size 1), meaning the data is only 1-anonymous &mdash; fully re-identifiable by linkage.` },
          { do: `Generalize: birthdate &rarr; age-band, zip-5 &rarr; zip-3, then re-group and confirm every group has &ge; k members; suppress or coarsen the stragglers.`, why: `Merging rare fingerprints into groups of size &ge; k is exactly what makes the data k-anonymous.` }
        ],
        answer: `<p><b>No.</b> Deleting names removed only the <i>direct</i> identifiers; birthdate + ZIP + gender are <b>quasi-identifiers</b> that re-identify people by linking to outside data. Grouped on those three, almost every row is unique (1-anonymous). Fix: <b>generalize</b> &mdash; age-band instead of birthdate, ZIP-3 instead of ZIP-5 &mdash; then verify <b>$k$-anonymity</b> (smallest group $\\ge k$), suppressing or further coarsening any leftover singletons.</p>`
      },
      {
        q: `You need to keep a per-user key so you can count sessions per person, but you must not store real user emails. A teammate proposes <code>sha256(email)</code>. Why is that still unsafe, and what do you change?`,
        steps: [
          { do: `Note the email space is enumerable / guessable.`, why: `An attacker can hash a huge dictionary of known or common emails and match the digests &mdash; an unsalted hash is effectively reversible.` },
          { do: `Add a long secret salt kept out of the dataset: hash(salt + email).`, why: `The salt is unknown to the attacker, so a precomputed dictionary or rainbow table no longer matches.` },
          { do: `Prefer a slow/keyed hash and rotate or vault the salt.`, why: `Slows brute force and limits blast radius if a salt leaks; consistent salt still gives a stable per-user token for counting.` }
        ],
        answer: `<p>Plain <code>sha256(email)</code> is reversible by a <b>dictionary attack</b>: emails are guessable, so an attacker hashes them all and matches. Mix in a <b>secret salt</b> first &mdash; <code>sha256(salt + email)</code> &mdash; keep the salt out of the shared data, and prefer a slow/keyed hash. You still get a stable token to count sessions, but it can't be reversed.</p>`
      },
      {
        q: `Your stakeholder only needs "average order value by region and age-band", not row-level data. How does that change your privacy strategy, and what is the one remaining trap?`,
        steps: [
          { do: `Recognize that the question is answerable from aggregates, not individual rows.`, why: `Releasing counts/means per group reveals no single person, the strongest and simplest protection.` },
          { do: `Aggregate to (region, age-band) &rarr; mean order value, and drop the row-level table from the export.`, why: `No quasi-identifier fingerprints leave the building, so there is nothing to re-identify.` },
          { do: `Check that each group is large enough (and consider adding noise) before publishing.`, why: `A group of one person makes the "average" that person's exact value &mdash; an aggregate can still leak; differential privacy adds calibrated noise to close this gap.` }
        ],
        answer: `<p><b>Aggregate.</b> Since only group-level facts are needed, publish counts and means per (region, age-band) and never export the rows &mdash; the safest option. The remaining trap: <b>tiny groups</b>. An average over one person <i>is</i> that person's value, so enforce a minimum group size and, for strong guarantees, add <b>differential-privacy</b> noise to the aggregates.</p>`
      }
    ]
  });

  window.CODE["dw-privacy-pii"] = {
    lib: "pandas",
    runnable: false,
    explain: `<p>An end-to-end "make this people-table safe" pass on a small synthetic customer frame
      (swap in your own). Step 1 drops/redacts the <b>direct identifiers</b>. Step 2 replaces a kept user ID
      with a <b>salted</b> one-way hash (<code>hashlib</code>) so rows still link per person but the real ID
      is gone &mdash; the salt is a secret, never shipped with the data. Step 3 <b>generalizes</b> the
      quasi-identifiers: exact birthdate &rarr; age-band, ZIP-5 &rarr; ZIP-3. Step 4 <b>checks
      $k$-anonymity</b> by grouping on the quasi-identifiers and flagging any group smaller than $k$.</p>`,
    code: `import hashlib
import pandas as pd

# --- A small synthetic customer table (replace with your real frame) ---
df = pd.DataFrame({
    "user_id":  ["u-1001", "u-1002", "u-1003", "u-1004", "u-1005"],
    "name":     ["Ada Lovelace", "Alan Turing", "Grace Hopper", "Ada Byron", "Edsger D."],
    "email":    ["ada@x.com", "alan@x.com", "grace@x.com", "ada2@x.com", "ed@x.com"],
    "ssn":      ["111-22-3333", "222-33-4444", "333-44-5555", "444-55-6666", "555-66-7777"],
    "birthdate":["1983-07-14", "1991-02-03", "1983-11-30", "1991-08-22", "1955-01-09"],
    "zip":      ["02139", "02141", "02139", "02141", "30301"],
    "gender":   ["F", "M", "F", "M", "F"],
    "spend":    [120, 80, 200, 50, 300],
})

# === Step 1: remove / redact DIRECT identifiers ===
DIRECT_PII = ["name", "email", "ssn"]
df = df.drop(columns=DIRECT_PII)        # or: df[DIRECT_PII] = "[REDACTED]"

# === Step 2: salted hash of the ID we must keep (links rows, hides the real id) ===
SALT = "k7$rotate-me-and-keep-me-secret"   # NEVER ship the salt with the data
def salted_hash(value, salt=SALT):
    return hashlib.sha256((salt + str(value)).encode()).hexdigest()[:16]
df["user_id"] = df["user_id"].map(salted_hash)   # -> stable pseudonymous token

# === Step 3: generalize the QUASI-identifiers ===
birth_year = pd.to_datetime(df["birthdate"]).dt.year
age = 2026 - birth_year
df["age_band"] = (age // 10 * 10).astype(str) + "s"   # 41 -> "40s"
df["zip3"]     = df["zip"].str[:3]                     # "02139" -> "021"
df = df.drop(columns=["birthdate", "zip"])

# === Step 4: CHECK k-anonymity on the quasi-identifiers ===
QUASI = ["age_band", "zip3", "gender"]
K = 2
group_sizes = df.groupby(QUASI).transform("size")    # size of each row's group
df["group_size"] = group_sizes
violations = df[df["group_size"] < K]                # rows in too-small groups

print("min group size:", int(df["group_size"].min()),
      "| k-anonymous for k =", K, ":", df["group_size"].min() >= K)
print("re-identifiable rows (group <", K, "):", len(violations))
# Fix violations by suppressing those rows or generalizing further (e.g. drop gender).`
  };

  window.CODEVIZ["dw-privacy-pii"] = {
    question: "How many people are uniquely identifiable (group size 1) before vs after we generalize the quasi-identifiers? Group the synthetic table on Q = (birthdate/age, ZIP, gender) and count the group sizes.",
    charts: [
      {
        type: "bars",
        title: "BEFORE generalizing: quasi-identifier group sizes (exact birthdate + ZIP-5 + gender)",
        labels: ["g1", "g2", "g3", "g4", "g5", "g6", "g7", "g8"],
        values: [1, 1, 1, 1, 1, 1, 1, 1],
        valueLabels: ["1", "1", "1", "1", "1", "1", "1", "1"],
        colors: ["#ff7b72", "#ff7b72", "#ff7b72", "#ff7b72", "#ff7b72", "#ff7b72", "#ff7b72", "#ff7b72"]
      },
      {
        type: "bars",
        title: "AFTER generalizing: group sizes (age-band + ZIP-3 + gender) — singletons collapse",
        labels: ["30s/021/M", "40s/021/F", "30s/021/F", "70s/303/F"],
        values: [3, 3, 1, 1],
        valueLabels: ["3", "3", "1", "1"],
        colors: ["#7ee787", "#7ee787", "#f0883e", "#f0883e"]
      }
    ],
    caption: "Real counts from an 8-person synthetic table. BEFORE: grouping on exact birthdate + 5-digit ZIP + gender gives 8 groups of size 1 — every single person is uniquely re-identifiable (1-anonymous). AFTER generalizing birthdate to an age-band and ZIP-5 to ZIP-3, the 8 unique fingerprints collapse into just 4 groups; two reach size 3 (green) but two stragglers (orange) are still size 1, so the data is NOT yet 2-anonymous. To reach k = 2 you would suppress or further coarsen those two rows. Generalization shrinks re-identifiability; checking group sizes tells you when you've actually reached k.",
    code: `import pandas as pd

# 8-person synthetic table (exact quasi-identifiers).
df = pd.DataFrame({
    "birthdate": ["1983-07-14","1991-02-03","1983-11-30","1991-08-22",
                  "1955-01-09","1988-05-05","1992-09-19","1986-12-01"],
    "zip":       ["02139","02141","02140","02142","30301","02143","02144","02145"],
    "gender":    ["F","M","F","M","F","F","M","F"],
})

# BEFORE: group on exact birthdate + 5-digit ZIP + gender.
before = df.groupby(["birthdate","zip","gender"]).size()
print("BEFORE group sizes:", sorted(before.values, reverse=True))
# -> [1, 1, 1, 1, 1, 1, 1, 1]   (8 unique fingerprints -> 1-anonymous)

# Generalize: birthdate -> age-band, ZIP-5 -> ZIP-3.
age = 2026 - pd.to_datetime(df["birthdate"]).dt.year
df["age_band"] = (age // 10 * 10).astype(str) + "s"
df["zip3"]     = df["zip"].str[:3]

# AFTER: group on the generalized quasi-identifiers.
after = df.groupby(["age_band","zip3","gender"]).size()
print("AFTER group sizes :", sorted(after.values, reverse=True))
# -> [3, 3, 1, 1]   (singletons collapse; min group = 1, so not yet 2-anonymous)`
  };
})();
