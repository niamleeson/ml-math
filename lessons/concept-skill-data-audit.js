(function () {
  window.LESSONS.push({
    id: "skill-data-audit",
    title: "Auditing data before you trust it",
    tagline: "Most model failures are data failures. Audit the data first, or your metrics are lying to you.",
    module: "Doing ML for Real — the skills that matter",
    prereqs: ["prob-normal", "prob-estimation"],
    whenToUse:
      `<p><b>Audit your data before you fit a single model — every time you touch a new dataset, a new data source, or a new serving pipeline.</b> The hardest bugs in ML are silent: a column that is 40% missing for one customer segment, a duplicated user that inflates your accuracy, a unit that switched from dollars to cents halfway through the year. None of these throw an error. They quietly poison the model and the metrics that are supposed to catch the model.</p>
       <p><b>This is make-or-break because:</b></p>
       <ul>
         <li>A model can only be as trustworthy as the data under it. "Garbage in, garbage out" is not a slogan; it is the failure mode of most real projects.</li>
         <li>The audit is the cheapest defect-catching you will ever do. A bad row found before training costs minutes; the same row found after a launch costs an incident.</li>
         <li>It turns vague unease ("the numbers look weird") into concrete, checkable claims about schema, missingness, duplicates, outliers, balance, and drift.</li>
       </ul>
       <p><b>Do it whenever:</b> you onboard a new table, a pipeline changes upstream, a model that worked starts degrading, or you are about to ship — and then keep doing it on live serving data, not just the training snapshot.</p>`,
    playbook:
      `<p>A real audit is an ordered checklist, not a glance at <code>df.describe()</code>. Run these seven steps in order; each one names the concrete technique.</p>
       <ol>
         <li><b>Write a SCHEMA CONTRACT and validate it.</b> Declare, in code, the expected type, allowed range, and allowed categories of every column — then run the data through it and let it fail loudly. Use <code>pandera</code> (a <code>DataFrameSchema</code> with <code>Column</code> checks) or <code>great_expectations</code>. The contract is the spec that all later data must satisfy.</li>
         <li><b>Profile MISSINGNESS per column and reason about the mechanism.</b> Compute the null rate of every column. Then ask <i>why</i> it is missing: is it MCAR, MAR, or MNAR (defined under the hood below)? Cross-tabulate missingness against other columns and the label — if "income is missing" correlates with the label, that missingness is itself a signal, and naive imputation will erase it.</li>
         <li><b>Find DUPLICATES and near-duplicates.</b> Exact dupes (<code>df.duplicated()</code>) inflate counts and leak between train and test. Near-dupes (same user with a typo, two rows that round to the same record) need fuzzy keys or record-linkage. Decide deliberately which repeats are <i>valid</i> (a user really did buy twice) and which are errors.</li>
         <li><b>Check OUTLIERS and impossible values.</b> Two different jobs. <i>Impossible</i> values violate the schema (a negative age, a 300% click-rate) — those are bugs, fix or drop them. <i>Outliers</i> are merely extreme but possible — flag them with the IQR (Inter-Quartile Range) rule or a z-score (both defined under the hood), then investigate rather than auto-delete.</li>
         <li><b>Check class / label balance and the target distribution.</b> For classification, count each class — a 99:1 split changes your loss, your metric, and your sampling. For regression, look at the target's shape (skew, long tail, spikes at round numbers). Imbalance you don't measure is imbalance that surprises you at evaluation.</li>
         <li><b>Check train&harr;serving PARITY and distribution drift vs a reference.</b> Pick a fixed <i>reference</i> distribution (usually the training set). Compare every later batch — validation, test, and especially live serving — against it with the PSI (Population Stability Index, formula under the hood) or a two-sample test. This catches train/serving skew and data drift before they catch you.</li>
         <li><b>Build a data dictionary and sign off.</b> Write down, per column, its meaning, unit, source, owner, valid range, and known issues. Have a human who knows the domain sign off. The dictionary is what lets the <i>next</i> person audit in minutes instead of rediscovering every gotcha.</li>
       </ol>`,
    application:
      `<p>This skill shows up everywhere real data flows.</p>
       <ul>
         <li><b>Onboarding a new table.</b> Before any feature is built, a schema contract plus a missingness and duplicate report tells you whether the table is usable at all.</li>
         <li><b>Pipeline / feature-store validation.</b> Teams gate every batch with <code>pandera</code> or <code>great_expectations</code>; a failed contract halts the pipeline instead of silently feeding bad features to the model.</li>
         <li><b>Monitoring in production.</b> PSI (Population Stability Index) per feature, computed nightly against the training reference, is the standard drift alarm. A spike means the world moved and the model may be stale.</li>
         <li><b>Debugging a regression.</b> When a working model degrades, the audit (especially parity and drift) is usually where the root cause is hiding — a renamed column, a changed unit, a new null pattern.</li>
       </ul>`,
    pitfalls:
      `<ul>
         <li><b>Trusting <code>df.describe()</code> and skipping the schema.</b> A mean and a max hide nulls, mixed types, impossible values, and category typos. The tell: nobody can state, in code, what a valid row looks like. Write the contract.</li>
         <li><b>Imputing before understanding the missingness.</b> Filling nulls with the mean <i>before</i> asking why they are missing destroys MNAR (Missing Not At Random) signal — sometimes "missing" is the most predictive value you have. The tell: a <code>fillna</code> appears before any missingness cross-tab.</li>
         <li><b>Deduping that drops valid repeats.</b> Blindly calling <code>drop_duplicates()</code> can delete real events (a customer who genuinely ordered twice). The tell: row counts fall and nobody checked whether the repeats were errors or facts.</li>
         <li><b>Auditing train but not serving.</b> The training snapshot can be pristine while live inputs are malformed. Train/serving skew is invisible if you only ever look at the training table. The tell: there is no validation running on production inputs.</li>
         <li><b>Ignoring units and encodings.</b> Dollars vs cents, kg vs lb, UTC vs local, <code>"NA"</code> the string vs <code>NaN</code> the null, label <code>1</code> meaning different things in two sources. The tell: a feature's scale or meaning is "obvious" and undocumented.</li>
         <li><b>No reference distribution to compare against.</b> You cannot measure drift without a fixed baseline. The tell: monitoring shows today's histogram but has nothing to compare it to, so "looks fine" is the only verdict available.</li>
       </ul>`,
    checklist:
      `<p>Run this before you fit anything on a new dataset — and again on live serving data:</p>
       <ul>
         <li><b>Schema:</b> every column has a declared type, range, and allowed-category set, encoded in a <code>pandera</code> / <code>great_expectations</code> contract that the data passes.</li>
         <li><b>Missingness:</b> null rate per column computed; the mechanism (MCAR / MAR / MNAR) reasoned about; missingness cross-tabbed against the label.</li>
         <li><b>Duplicates:</b> exact and near-duplicates counted; each kind of repeat classified as valid or error before any drop.</li>
         <li><b>Outliers:</b> impossible values (schema violations) separated from extreme-but-possible outliers (IQR / z-score); each investigated, not auto-deleted.</li>
         <li><b>Balance:</b> class counts (classification) or target shape (regression) measured and recorded.</li>
         <li><b>Parity / drift:</b> a reference distribution fixed; PSI (Population Stability Index) or a two-sample test run for train&harr;validation&harr;serving on every feature.</li>
         <li><b>Dictionary &amp; sign-off:</b> per-column meaning, unit, source, owner, valid range, and known issues written down, and a domain expert has signed off.</li>
       </ul>`,
    bigIdea:
      `<p>A dataset is a <b>promise</b> about the world: each column means something, in some unit, within some range. An audit is how you check the promise before you bet a model on it.</p>
       <p>The audit makes vague worry concrete. Instead of "the data looks off", you produce numbers: this column is 12% null, those 30 rows are duplicates, that feature drifted with a PSI (Population Stability Index) of 0.4.</p>
       <p>The deep tools are statistical: a <b>model of why values go missing</b>, simple <b>rules for what counts as extreme</b>, and a <b>distance between two distributions</b> to measure drift. Master those three and most data disasters become visible before they cost anything.</p>`,
    buildup:
      `<p>Three pieces of math carry the whole skill.</p>
       <p><b>Missingness mechanism.</b> Let $R$ be a flag that is 1 when a value is missing. The mechanism is about what $R$ depends on. MCAR: $R$ depends on nothing. MAR: $R$ depends only on <i>observed</i> data. MNAR: $R$ depends on the <i>missing value itself</i>. The mechanism decides whether imputation is safe.</p>
       <p><b>Outlier rules.</b> The IQR (Inter-Quartile Range) rule flags points far outside the middle 50% of the data. The z-score rule flags points many standard deviations from the mean.</p>
       <p><b>Drift distance.</b> The PSI (Population Stability Index) measures how far a current distribution has moved from a reference one, bucket by bucket.</p>`,
    symbols: [
      { sym: "$R$", desc: "the missingness indicator: $R=1$ if a value is missing, $0$ if observed." },
      { sym: "$Q_1,\\ Q_3$", desc: "the first and third quartiles: the 25th and 75th percentiles of a column (the edges of its middle half)." },
      { sym: "$\\text{IQR}$", desc: "the Inter-Quartile Range, $\\text{IQR}=Q_3-Q_1$: the width of the middle 50% of the data." },
      { sym: "$z$", desc: "the z-score of a value $x$: $z=(x-\\mu)/\\sigma$, how many standard deviations $x$ sits from the mean." },
      { sym: "$\\mu,\\ \\sigma$", desc: "the column's mean (Greek 'mu') and standard deviation (Greek 'sigma')." },
      { sym: "$e_i$", desc: "the expected fraction of data in bucket $i$ — the share the REFERENCE distribution puts in that bucket." },
      { sym: "$a_i$", desc: "the actual fraction of data in bucket $i$ — the share the CURRENT distribution puts in that bucket." },
      { sym: "$\\text{PSI}$", desc: "the Population Stability Index: a single number for how far the current distribution drifted from the reference." }
    ],
    formula: `$$ \\text{IQR}=Q_3-Q_1,\\quad \\text{outlier} \\iff x&lt;Q_1-1.5\\,\\text{IQR}\\ \\text{ or }\\ x>Q_3+1.5\\,\\text{IQR} \\qquad\\qquad \\text{PSI}=\\sum_i (a_i-e_i)\\,\\ln\\!\\frac{a_i}{e_i} $$`,
    whatItDoes:
      `<p>The left rule is the <b>IQR (Inter-Quartile Range) outlier fence</b>. Take the middle-half width $\\text{IQR}=Q_3-Q_1$, then call anything more than $1.5$ IQRs below $Q_1$ or above $Q_3$ an outlier. It needs no assumption that the data is bell-shaped, so it is robust to skew.</p>
       <p>The right formula is the <b>PSI (Population Stability Index)</b>. Bin a feature into the same buckets for both distributions. For each bucket, $e_i$ is the reference share and $a_i$ is the current share. The term $(a_i-e_i)\\ln(a_i/e_i)$ is large when a bucket's share changed a lot, and it is always $\\ge 0$. Summing over buckets gives one drift number. Rule of thumb: PSI $&lt;0.1$ = stable, $0.1$&ndash;$0.25$ = moderate shift worth watching, $>0.25$ = a big shift that likely breaks the model.</p>`,
    derivation:
      `<p><b>Why these tools work.</b></p>
       <ul class="steps">
         <li><b>Why the missingness mechanism matters.</b> If data is MCAR (Missing Completely At Random), the rows you see are a fair random sample, so dropping or mean-filling them is unbiased. If it is MAR (Missing At Random), the missingness depends only on columns you <i>can</i> see, so you can correct for it by conditioning on those columns. If it is MNAR (Missing Not At Random), the value being missing depends on the value itself — high earners refuse to state income — and no amount of imputation from the observed data can recover the truth. The fix is to model missingness explicitly (add a "was-missing" flag) or collect more data.</li>
         <li><b>Why $1.5\\times$IQR.</b> For a normal distribution, $Q_1$ and $Q_3$ sit about $\\pm 0.674\\sigma$ from the mean, so $\\text{IQR}\\approx 1.35\\sigma$. The fence $Q_3+1.5\\,\\text{IQR}$ then lands near $2.7\\sigma$, where only about $0.35\\%$ of normal data falls — extreme enough to be worth a look, not so tight that it flags ordinary points. Unlike the z-score, it uses quartiles, so a few wild values cannot move the fence itself.</li>
         <li><b>Why PSI looks the way it does.</b> PSI is a <b>symmetrized relative entropy</b>. Standard KL (Kullback&ndash;Leibler) divergence is $\\sum_i a_i\\ln(a_i/e_i)$, which measures surprise of $a$ given $e$ but is asymmetric. PSI adds the reverse direction: $\\sum_i a_i\\ln(a_i/e_i)+\\sum_i e_i\\ln(e_i/a_i)=\\sum_i (a_i-e_i)\\ln(a_i/e_i)$. The symmetry means a bucket that grew and a bucket that shrank both contribute, so PSI fairly scores movement in either direction. $\\blacksquare$</li>
       </ul>`,
    example:
      `<p><b>Worked PSI.</b> A feature is bucketed into 3 bins. Reference (training) shares $e=[0.6,\\ 0.3,\\ 0.1]$, current (serving) shares $a=[0.4,\\ 0.35,\\ 0.25]$. The table builds the per-bin term $(a_i-e_i)\\ln(a_i/e_i)$; the steps redo the arithmetic.</p>
       <table class="extable">
         <caption>PSI per bin: $\\text{PSI}=\\sum_i (a_i-e_i)\\,\\ln(a_i/e_i)$.</caption>
         <thead><tr><th>bin $i$</th><th class="num">$e_i$</th><th class="num">$a_i$</th><th class="num">$a_i-e_i$</th><th class="num">$\\ln(a_i/e_i)$</th><th class="num">term</th></tr></thead>
         <tbody>
           <tr><td class="row-h">1</td><td class="num">0.60</td><td class="num">0.40</td><td class="num">&minus;0.20</td><td class="num">&minus;0.405</td><td class="num">0.081</td></tr>
           <tr><td class="row-h">2</td><td class="num">0.30</td><td class="num">0.35</td><td class="num">+0.05</td><td class="num">0.154</td><td class="num">0.008</td></tr>
           <tr><td class="row-h">3</td><td class="num">0.10</td><td class="num">0.25</td><td class="num">+0.15</td><td class="num">0.916</td><td class="num">0.137</td></tr>
           <tr><td class="row-h">PSI</td><td class="num"></td><td class="num"></td><td class="num"></td><td class="num"></td><td class="num">0.226</td></tr>
         </tbody>
       </table>
       <ul class="steps">
         <li>Bin 1: $(0.4-0.6)\\ln(0.4/0.6)=(-0.2)\\times\\ln(0.667)=(-0.2)\\times(-0.405)=0.081$.</li>
         <li>Bin 2: $(0.35-0.3)\\ln(0.35/0.3)=(0.05)\\times\\ln(1.167)=(0.05)\\times(0.154)=0.008$.</li>
         <li>Bin 3: $(0.25-0.1)\\ln(0.25/0.1)=(0.15)\\times\\ln(2.5)=(0.15)\\times(0.916)=0.137$.</li>
         <li>Total PSI $=0.081+0.008+0.137=0.226$. That is in the $0.1$&ndash;$0.25$ band: a <b>moderate shift</b> — the model still runs, but you should watch this feature and consider a refresh.</li>
       </ul>
       <p>Notice bin 3 dominates: the rare bucket more than doubled its share, and PSI rightly weights that as the biggest move.</p>`,
    demo: function (host) {
      host.innerHTML = "";
      var s = getComputedStyle(document.documentElement);
      var g = function (n, d) { return (s.getPropertyValue(n) || d).trim(); };
      var col = {
        ink: g("--ink", "#e6edf3"), dim: g("--ink-dim", "#9aa7b4"),
        accent: g("--accent", "#4ea1ff"), accent2: g("--accent-2", "#7ee787"),
        warn: g("--warn", "#ffb454"), purple: g("--purple", "#c89bff"),
        border: g("--border", "#2a3340"), panel: g("--panel", "#161c24")
      };
      // Real PSI per feature on load_wine: first half (reference) vs second half (current).
      // Wine rows are ordered by cultivar, so the two halves are genuinely different
      // distributions -- a vivid example of drift. Numbers from the CODEVIZ code.
      var labels = ["proline", "alcalin.", "flavan.", "hue", "od280", "phenols", "nonflav.", "malic"];
      var psi = [6.667, 4.976, 2.827, 2.742, 2.45, 2.267, 1.505, 1.419];

      var cv = document.createElement("canvas"); cv.width = 640; cv.height = 320; host.appendChild(cv);
      var ctx = cv.getContext("2d");
      var L = 70, R = 620, T = 24, B = 250;
      var maxV = 7;
      function px(i) { return L + (i + 0.5) / labels.length * (R - L); }
      function py(v) { return B - (v / maxV) * (B - T); }
      function draw() {
        ctx.clearRect(0, 0, 640, 320);
        ctx.font = "12px sans-serif"; ctx.textBaseline = "alphabetic"; ctx.textAlign = "start";
        // axes
        ctx.strokeStyle = col.border; ctx.lineWidth = 1; ctx.beginPath();
        ctx.moveTo(L, T); ctx.lineTo(L, B); ctx.lineTo(R, B); ctx.stroke();
        // y gridlines
        ctx.fillStyle = col.dim;
        for (var v = 0; v <= maxV; v += 1) {
          var Y = py(v);
          ctx.strokeStyle = col.border; ctx.beginPath(); ctx.moveTo(L, Y); ctx.lineTo(R, Y); ctx.stroke();
          ctx.fillText(v.toFixed(0), 48, Y + 4);
        }
        // PSI = 0.25 alarm line
        var Ya = py(0.25);
        ctx.strokeStyle = col.warn; ctx.setLineDash([5, 4]); ctx.lineWidth = 1.5;
        ctx.beginPath(); ctx.moveTo(L, Ya); ctx.lineTo(R, Ya); ctx.stroke(); ctx.setLineDash([]);
        ctx.fillStyle = col.warn; ctx.fillText("PSI = 0.25 alarm", R - 120, Ya - 5);
        // bars
        var bw = (R - L) / labels.length * 0.6;
        for (var i = 0; i < labels.length; i++) {
          var X = px(i), Y = py(psi[i]);
          ctx.fillStyle = psi[i] > 0.25 ? col.warn : col.accent2;
          ctx.fillRect(X - bw / 2, Y, bw, B - Y);
          ctx.fillStyle = col.ink; ctx.textAlign = "center";
          ctx.fillText(psi[i].toFixed(1), X, Y - 4);
          ctx.fillStyle = col.dim;
          ctx.save(); ctx.translate(X, B + 14); ctx.rotate(-Math.PI / 6); ctx.fillText(labels[i], 0, 0); ctx.restore();
          ctx.textAlign = "start";
        }
        ctx.fillStyle = col.dim; ctx.textAlign = "center";
        ctx.save(); ctx.translate(20, (T + B) / 2); ctx.rotate(-Math.PI / 2); ctx.fillText("PSI (first half vs second half)", 0, 0); ctx.restore();
        ctx.textAlign = "start";
      }
      draw();
      var rd = document.createElement("div"); rd.className = "out"; rd.style.marginTop = "6px"; host.appendChild(rd);
      rd.innerHTML = "Real <b>load_wine</b> run. PSI (Population Stability Index) per feature, comparing the first 89 rows (reference) to the last 89 rows (current). The rows are ordered by grape cultivar, so the halves are very different worlds: <b>every</b> feature blows past the 0.25 alarm line (orange dashed). <code>proline</code> drifts most (PSI " + psi[0].toFixed(1) + "). This is exactly the alarm you want firing when train and serving data come from different slices.";
    },
    practice: [
      {
        q: `A teammate cleans a survey dataset by running df['income'] = df['income'].fillna(df['income'].mean()) as the very first step. The income column is 35% null. Why is this risky, and what should they have done first?`,
        steps: [
          { do: `Ask WHY income is missing before filling it.`, why: `High earners often decline to report income. If "missing" depends on the value itself, the missingness is MNAR (Missing Not At Random) and carries signal.` },
          { do: `Cross-tabulate the missingness flag against the label and other columns.`, why: `If income-missing correlates with the target (or with wealth proxies), the nulls are informative, not random noise.` },
          { do: `Add a "was-missing" indicator column, THEN impute.`, why: `The flag preserves the signal that a value was missing, so a mean-fill no longer erases it. Imputing blindly throws that signal away.` }
        ],
        answer: `Mean-imputing first assumes the data is MCAR/MAR. With 35% nulls that likely correlate with the value (MNAR), it erases real signal. First profile the mechanism (cross-tab missingness vs the label), add a "was-missing" flag, then impute.`
      },
      {
        q: `You ship a model that scored AUC 0.92 offline. In production it scores 0.74. The training data audit was clean. Using the data-audit playbook, where do you look first, and which tool do you use?`,
        steps: [
          { do: `Recognize this as a train/serving parity problem, not a training-data problem.`, why: `The training audit was clean, so the defect is in the gap between training and serving data — the one slice that was never audited.` },
          { do: `Fix the training set as the reference distribution and compute PSI per feature on the live serving inputs.`, why: `PSI (Population Stability Index) per feature surfaces exactly which features drifted; a value above 0.25 flags a big shift likely to break the model.` },
          { do: `For the top-PSI features, check units, encodings, and new null patterns.`, why: `Real drift is often a renamed column, a unit change (dollars to cents), or a new missingness pattern in the serving pipeline.` }
        ],
        answer: `It is a parity/drift failure. Use the training set as the reference and compute PSI per feature on the serving inputs; investigate the highest-PSI features for unit changes, encoding mismatches, or new null patterns. Audit serving data, not just training data.`
      }
    ]
  });

  window.CODE["skill-data-audit"] = {
    lib: "pandera + ydata-profiling + scipy",
    runnable: false,
    explain: `<p>A real audit in three parts: a <b>pandera</b> schema contract that fails loudly on bad rows, a missingness + duplicate report (with <b>ydata-profiling</b> for the full automated profile), and a hand-written PSI (Population Stability Index) function that scores drift of a current batch against a reference. These need a real Python runtime.</p>`,
    code: `import numpy as np
import pandas as pd
import pandera as pa
from pandera import Column, Check, DataFrameSchema
from scipy import stats

# ---------------------------------------------------------------
# 1. SCHEMA CONTRACT  -- declare type, range, allowed categories,
#    then validate. Bad rows raise instead of silently flowing on.
# ---------------------------------------------------------------
schema = DataFrameSchema({
    "age":      Column(int,   Check.in_range(0, 120)),
    "income":   Column(float, Check.ge(0), nullable=True),     # nulls allowed, negatives not
    "segment":  Column(str,   Check.isin(["free", "pro", "enterprise"])),
    "country":  Column(str,   Check.str_length(2, 2)),         # ISO-2 codes
    "label":    Column(int,   Check.isin([0, 1])),
}, strict=True)            # strict=True -> reject unexpected columns too

validated = schema.validate(df, lazy=True)   # lazy=True collects ALL failures, not just the first

# ---------------------------------------------------------------
# 2. MISSINGNESS + DUPLICATE REPORT
# ---------------------------------------------------------------
missing = df.isna().mean().sort_values(ascending=False)        # null rate per column
print("null rate per column:\\n", missing)

# is missingness tied to the label?  (a hint of MNAR / MAR, not MCAR)
for c in df.columns:
    if df[c].isna().any():
        rate_by_label = df.assign(_miss=df[c].isna()).groupby("label")["_miss"].mean()
        print(c, "missing-rate by label:\\n", rate_by_label)

exact_dupes = df.duplicated().sum()                            # full-row duplicates
key_dupes   = df.duplicated(subset=["user_id"]).sum()          # same entity repeated
print("exact dupes:", exact_dupes, " duplicate user_ids:", key_dupes)

# full automated profile (HTML) -- types, missingness, dupes, correlations, alerts
from ydata_profiling import ProfileReport
ProfileReport(df, title="Data audit", minimal=True).to_file("audit.html")

# ---------------------------------------------------------------
# 3. POPULATION STABILITY INDEX  -- drift of CURRENT vs REFERENCE
#    PSI = sum_i (a_i - e_i) * ln(a_i / e_i)
# ---------------------------------------------------------------
def psi(reference, current, bins=10):
    edges = np.quantile(reference, np.linspace(0, 1, bins + 1))  # quantile bins from reference
    edges[0], edges[-1] = -np.inf, np.inf
    e = np.histogram(reference, bins=edges)[0] / len(reference)  # expected (reference) shares
    a = np.histogram(current,   bins=edges)[0] / len(current)    # actual (current) shares
    e = np.clip(e, 1e-6, None); a = np.clip(a, 1e-6, None)       # avoid log(0)
    return float(np.sum((a - e) * np.log(a / e)))

for col in ["age", "income"]:
    score = psi(reference_df[col], current_df[col])
    flag = "STABLE" if score < 0.1 else "WATCH" if score < 0.25 else "DRIFT!"
    print(f"{col}: PSI={score:.3f}  ({flag})")

# a complementary two-sample distribution test (KS = Kolmogorov-Smirnov)
ks = stats.ks_2samp(reference_df["income"].dropna(), current_df["income"].dropna())
print("income KS statistic:", ks.statistic, "p-value:", ks.pvalue)`
  };

  window.CODEVIZ["skill-data-audit"] = {
    question: "How do you read a PSI drift chart — when is the data stable, when is it worth watching, and when has it blown up?",
    charts: [
      {
        type: "bars",
        title: "Severe drift: ordered split (load_wine), every feature past the alarm",
        xlabel: "feature",
        ylabel: "PSI (Population Stability Index)",
        labels: ["proline", "alcalin.", "flavan.", "hue", "od280", "phenols", "nonflav.", "malic"],
        values: [6.667, 4.976, 2.827, 2.742, 2.45, 2.267, 1.505, 1.419],
        valueLabels: ["6.67", "4.98", "2.83", "2.74", "2.45", "2.27", "1.51", "1.42"],
        colors: ["#ff7b72", "#ff7b72", "#ff7b72", "#ff7b72", "#ff7b72", "#ff7b72", "#ff7b72", "#ff7b72"],
        interpret: "Real load_wine run. Each bar is one feature's <b>PSI</b> — how far its <i>current</i> distribution moved from a fixed <i>reference</i>. Higher = more drift; the rule of thumb is &lt;0.1 stable, 0.1&ndash;0.25 watch, &gt;0.25 big shift. Here the rows are sorted by grape cultivar, so the reference (first half) and current (second half) are different worlds: <b>every</b> bar is far past 0.25 (all red), proline worst at 6.67. Read this shape as a five-alarm fire — train and serving data are drawn from different slices and the model is unsafe to trust."
      },
      {
        type: "bars",
        title: "Stable (healthy): nothing to worry about",
        xlabel: "feature",
        ylabel: "PSI (illustrative)",
        labels: ["age", "income", "tenure", "clicks", "region", "device"],
        values: [0.03, 0.05, 0.02, 0.07, 0.04, 0.06],
        valueLabels: ["0.03", "0.05", "0.02", "0.07", "0.04", "0.06"],
        colors: ["#7ee787", "#7ee787", "#7ee787", "#7ee787", "#7ee787", "#7ee787"],
        interpret: "Illustrative. Same axes, but every PSI bar sits well under <b>0.1</b> (all green). Read this as the world holding still: the current batch looks just like the reference, so the model's inputs are the same shape it trained on. This is the boring chart you <i>want</i> to see in nightly monitoring — no bar reaches the watch band, so no action is needed."
      },
      {
        type: "bars",
        title: "Moderate: one feature in the WATCH band, refresh soon",
        xlabel: "feature",
        ylabel: "PSI (illustrative)",
        labels: ["age", "income", "tenure", "clicks", "region", "device"],
        values: [0.04, 0.18, 0.06, 0.09, 0.05, 0.07],
        valueLabels: ["0.04", "0.18", "0.06", "0.09", "0.05", "0.07"],
        colors: ["#7ee787", "#ffb454", "#7ee787", "#7ee787", "#7ee787", "#7ee787"],
        interpret: "Illustrative. Most bars are green and stable, but <code>income</code> sits at 0.18 (orange) — inside the <b>0.1&ndash;0.25 watch band</b>. Read this as one feature starting to move while the rest hold: the model still runs, but income drifted enough to keep an eye on. The single tall bar is also a pointer for investigation — check that feature first for a unit change (dollars vs cents), an encoding mismatch, or a new null pattern before it climbs past 0.25."
      }
    ],
    caption: "Three shapes of the same PSI drift chart. Read each bar against the bands: under 0.1 (green) is stable, 0.1&ndash;0.25 (orange) is worth watching, above 0.25 (red) is a big shift likely to break the model. Chart 1 is a real all-features-blown alarm; charts 2 and 3 show the healthy and one-feature-watch cases you compare it against.",
    code: `import numpy as np
from sklearn.datasets import load_wine

wine = load_wine()
X, names = wine.data, wine.feature_names          # 178 x 13 real chemical measurements
half = X.shape[0] // 2                             # rows are ordered by cultivar
ref, cur = X[:half], X[half:]                      # reference = first half, current = second half

def psi(reference, current, bins=10):
    edges = np.quantile(reference, np.linspace(0, 1, bins + 1))  # quantile bins from reference
    edges[0], edges[-1] = -np.inf, np.inf
    e = np.histogram(reference, bins=edges)[0] / len(reference)  # expected shares
    a = np.histogram(current,   bins=edges)[0] / len(current)    # actual shares
    e = np.clip(e, 1e-6, None); a = np.clip(a, 1e-6, None)       # avoid log(0)
    return float(np.sum((a - e) * np.log(a / e)))                # PSI = sum (a-e) ln(a/e)

scores = [(names[i], round(psi(ref[:, i], cur[:, i]), 3)) for i in range(X.shape[1])]
scores.sort(key=lambda t: -t[1])
for name, s in scores[:8]:
    print(f"{name:30s} PSI={s}")
# proline    6.667 | alcalinity_of_ash 4.976 | flavanoids 2.827 | hue 2.742
# od280...   2.450 | total_phenols     2.267 | nonflavanoid_phenols 1.505 | malic_acid 1.419`
  };
})();
