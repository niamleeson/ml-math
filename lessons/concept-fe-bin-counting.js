/* Feature Engineering — Chapter 5, "Bin Counting".
   BEGINNER lesson. Self-contained: lesson + CODE + CODEVIZ merged by id "fe-bin-counting". */
(function () {
  window.LESSONS.push({
    id: "fe-bin-counting",
    title: "Bin counting: encode a category by its target rate",
    tagline: "Replace a giant category (device ID, zip) with the click rate it has historically produced.",
    module: "Feature Engineering",
    // Verified against window.LESSONS: only skill-leakage and fe-binning exist as files.
    // (fe-categorical-encoding / fe-feature-hashing are planned siblings but not yet authored.)
    prereqs: ["fe-binning", "skill-leakage"],

    bigIdea:
      `<p>Some categorical columns are enormous. In click prediction (the book's running example, on
       advertising data like the <b>Avazu</b> click-through set) a single column might be the <b>device ID</b>,
       the <b>ad ID</b>, or the <b>app</b> &mdash; with <b>millions</b> of distinct values. One-hot encoding
       turns that into millions of columns, almost all zero. That is wasteful and most models choke on it.</p>
       <p><b>Bin counting</b> (also called <b>target encoding</b> or <b>response-rate encoding</b>) replaces
       the category's <b>identity</b> with <b>statistics of the target</b> for that category. Instead of a
       one-hot vector that says "this is device #8,412,067", you store one number: the historical
       <b>click-through rate</b> of that device, $P(\\text{click}\\mid \\text{device})$. A million sparse
       columns collapse into a handful of dense, highly predictive ones.</p>
       <p>This is exactly the trick behind <b>Microsoft's bin-counting</b> features and <b>Owen Zhang's</b>
       famous Kaggle "response-rate" features for click and conversion models. Chapter 5 of Zheng &amp;
       Casari presents it as the go-to encoding for <b>very-high-cardinality</b> categoricals &mdash; and
       spends most of its ink on the <b>three ways it can blow up</b>: target leakage, rare categories, and
       unseen categories. Get those right and bin counting is one of the most powerful features you can build.</p>`,

    buildup:
      `<p>Fix one category column $c$ (say <code>device_id</code>) and a binary target $y$ (clicked = 1,
       not = 0). For each category value $v$ you collect the rows where $c=v$ and summarize their labels.</p>
       <p><b>Conditional probability (the rate).</b> The most basic bin-counting feature is the
       <b>click rate</b> for that value &mdash; the fraction of its rows that clicked:
       $p_v = P(y=1\\mid c=v)$. A device whose ads get clicked 8% of the time gets the number $0.08$.</p>
       <p><b>Odds and log-odds.</b> Rates live in $[0,1]$ and bunch up near 0 for rare events like clicks.
       The book also stores the <b>odds</b> $\\frac{p_v}{1-p_v}$ (clicks per non-click) and the
       <b>log-odds</b> $\\log\\frac{p_v}{1-p_v}$. Log-odds spread the small rates out and are exactly what a
       logistic-regression model wants to see, so they often work better than the raw rate.</p>
       <p><b>Counts.</b> You can also just keep the raw counts &mdash; how many clicks $N_1$ and how many
       non-clicks $N_0$ this value produced. The counts carry the <b>confidence</b>: a rate of 1/1 is far
       less trustworthy than 80/100, even though both are 80&ndash;100%. Counts let later steps (smoothing)
       use that confidence.</p>
       <p>The whole transform is one <code>groupby</code> over the category, aggregating the target. The
       three dangers below are all about <b>which rows</b> you are allowed to aggregate.</p>`,

    symbols: [
      { sym: "$c$", desc: "the high-cardinality category column being encoded (e.g. device ID, ad ID, zip code)." },
      { sym: "$v$", desc: "one particular value of that category (one specific device, one specific zip)." },
      { sym: "$y$", desc: "the binary target, $1$ = positive event (click / fraud / conversion), $0$ = not." },
      { sym: "$p_v$", desc: "the bin-counted feature: the target rate for value $v$, i.e. $P(y=1\\mid c=v)$." },
      { sym: "$N_1,\\,N_0$", desc: "counts for value $v$: number of positive ($N_1$) and negative ($N_0$) rows. Total $N_v=N_1+N_0$." },
      { sym: "$\\log\\frac{p_v}{1-p_v}$", desc: "the log-odds of value $v$: the log of (positives per negative). A spread-out, model-friendly version of the rate." },
      { sym: "$p_0$", desc: "the global (prior) rate $P(y=1)$ across all rows &mdash; the back-off used for rare or unseen values." },
      { sym: "$\\alpha$", desc: "the smoothing strength: how many \\\"pseudo-rows\\\" of the prior you mix into each estimate." }
    ],

    formula:
      `$$ p_v = P(y=1\\mid c=v) = \\frac{N_1}{N_1+N_0},\\qquad
         \\text{log-odds}_v=\\log\\frac{p_v}{1-p_v},\\qquad
         \\hat p_v=\\frac{N_1+\\alpha\\,p_0}{N_1+N_0+\\alpha} $$`,

    whatItDoes:
      `<p>The first formula is the plain <b>target rate</b>: positives over total for value $v$. This is the
       dense number that replaces the one-hot column.</p>
       <p>The second is the <b>log-odds</b> &mdash; the same information re-expressed on a scale that runs
       from $-\\infty$ to $+\\infty$ and lines up with how a logistic model thinks. Rare-event rates that all
       look like $0.01\\text{--}0.05$ get pulled apart into clearly different numbers.</p>
       <p>The third, $\\hat p_v$, is the <b>smoothed</b> estimate (additive / Laplace smoothing, a.k.a.
       <b>back-off to the prior</b>). You add $\\alpha$ pseudo-rows that vote for the global rate $p_0$. When
       a value has lots of data ($N_v\\gg\\alpha$) the smoothing barely moves it; when a value is
       <b>rare</b> ($N_v$ tiny) the estimate is dragged toward $p_0$, so a 1-out-of-1 fluke can't masquerade
       as a 100% click rate. This single line is the book's fix for the rare-category danger.</p>`,

    derivation:
      `<p><b>Why this works, and where it bites.</b> The book builds bin counting up through its three hazards.</p>
       <ul class="steps">
         <li><b>The dense signal.</b> A one-hot of a million-value column is a million columns that a model
         must each learn a weight for &mdash; impossible from finite data. Bin counting hands the model the
         <i>answer it would have learned</i> (the value's click rate) directly, as one column. The signal is
         already there; we just precompute it.</li>
         <li><b>Danger 1 &mdash; target leakage (the headline).</b> If you compute $p_v$ using a row's
         <b>own</b> label and then use $p_v$ to predict that same row, you have leaked the answer. The model
         looks brilliant in cross-validation and collapses in production. Fix: compute each row's encoding
         from <b>other</b> rows only &mdash; <b>out-of-fold</b> (encode each fold using the other folds),
         <b>leave-one-out</b>, or a separate earlier <b>"back-fill" time window</b>. In click models the
         time-split is most honest: learn the rates from last week, apply them to this week. (See the
         leakage lesson.)</li>
         <li><b>Danger 2 &mdash; rare categories.</b> A value seen 3 times gives a rate of $0/3$ or $3/3$
         &mdash; noise, not signal. Trusting it overfits. Fix: <b>smooth / back off to the prior</b> with
         $\\hat p_v=\\frac{N_1+\\alpha p_0}{N_v+\\alpha}$, which shrinks low-count estimates toward the
         global rate $p_0$. $\\alpha$ controls how much history you demand before you trust a value.</li>
         <li><b>Danger 3 &mdash; unseen categories at test time.</b> A brand-new device never appeared in
         training, so it has <b>no</b> count. Fix: fall back to the <b>global rate</b> $p_0$ (which is just
         the $N_v=0$ limit of the smoothing formula). Never let it become a NaN that crashes the model.</li>
         <li>Put together: group by the category, count $N_1,N_0$ <b>out-of-fold</b>, smooth toward $p_0$,
         and default unseen values to $p_0$. The result is a tiny set of dense columns that, on click data,
         routinely beats one-hot and feature hashing. $\\blacksquare$</li>
       </ul>`,

    example:
      `<p>Three devices in a tiny click log. Counts are clicks $N_1$ / non-clicks $N_0$, global rate
       $p_0=0.05$ (5% click overall), smoothing $\\alpha=10$.</p>
       <ul class="steps">
         <li><b>Device A</b> &mdash; $N_1=80,\\ N_0=920$ ($N_v=1000$). Raw rate $p_A=80/1000=0.08$.
         Smoothed $\\hat p_A=\\frac{80+10\\cdot 0.05}{1000+10}=\\frac{80.5}{1010}\\approx 0.0797$. Tons of
         data, so smoothing barely moves it &mdash; this 8% rate is trustworthy. Log-odds
         $\\log\\frac{0.08}{0.92}\\approx -2.44$.</li>
         <li><b>Device B</b> &mdash; $N_1=1,\\ N_0=0$ ($N_v=1$). Raw rate $p_B=1/1=1.0$ &mdash; a "100% click"
         device, obviously a fluke. Smoothed $\\hat p_B=\\frac{1+0.5}{1+10}=\\frac{1.5}{11}\\approx 0.136$.
         Smoothing <b>back off</b> the absurd 100% toward the prior; still above average, but sane.</li>
         <li><b>Device C (unseen)</b> &mdash; never in training, $N_v=0$. Fall back to the global rate:
         $\\hat p_C=p_0=0.05$. No NaN, no crash &mdash; just "assume average until we learn otherwise".</li>
       </ul>
       <p>Same transform, three regimes: a well-populated value keeps its real rate, a rare value is pulled
       toward the prior, and an unseen value <i>becomes</i> the prior.</p>`,

    whenToUse:
      `<p><b>Reach for bin counting when the category is huge and the target statistics are stable.</b></p>
       <ul>
         <li><b>Very-high-cardinality categoricals</b> &mdash; IDs (user, device, ad, app), zip codes,
         URLs, search queries. When one-hot would mean thousands-to-millions of columns, a few target-rate
         columns are a compact, powerful replacement.</li>
         <li><b>Click / fraud / conversion (CTR) models</b> &mdash; the book's home turf. The historical
         click rate of an ad or device is one of the strongest single features you can feed a click model;
         this is precisely the Microsoft bin-counting / Owen Zhang response-rate playbook on
         Avazu-style advertising data.</li>
         <li><b>When the rate is stable over time</b> &mdash; bin counting assumes a value's past rate
         predicts its future rate. Great for things whose behavior persists (a device's general clickiness);
         risky for things that drift fast.</li>
         <li><b>vs. one-hot</b> &mdash; one-hot is fine for low cardinality and is leakage-free, but explodes
         on big columns. <b>vs. feature hashing</b> &mdash; hashing shrinks the column count without using the
         target (no leakage risk) but mixes unrelated values via collisions and isn't predictive on its own;
         bin counting <i>is</i> predictive because it uses the target, at the cost of needing the leakage
         safeguards.</li>
       </ul>`,

    application:
      `<p>Bin counting is everywhere high-cardinality IDs meet a binary target.</p>
       <ul>
         <li><b>The book's click-prediction example.</b> Zheng &amp; Casari encode advertising categoricals
         (device, app, site IDs on Avazu-style data) by their historical click rate &mdash; counts,
         conditional probability, and log-odds &mdash; and compare against one-hot and feature hashing.</li>
         <li><b>Microsoft bin-counting &amp; Owen Zhang's response-rate features.</b> The named, productionized
         versions of this idea that dominate click/CTR and Kaggle conversion competitions.</li>
         <li><b>Fraud and credit.</b> Encode merchant, IP, or zip by its historical fraud rate &mdash; same
         transform, same leakage and rare-category safeguards (and a strict time-split, since fraud drifts).</li>
       </ul>`,

    pitfalls:
      `<ul>
         <li><b>Target leakage &mdash; the headline danger.</b> Using a row's own label to build its encoding
         leaks the answer; cross-validation looks amazing and production tanks. <b>Fix:</b> compute encodings
         <b>out-of-fold</b> (or leave-one-out, or from a separate earlier <b>time window</b>). Never encode a
         row from itself. This is the single most important rule of bin counting.</li>
         <li><b>Rare-category overfitting.</b> A value seen a handful of times gives a wild, untrustworthy rate
         ($1/1=100\\%$). <b>Fix:</b> <b>smooth / back off to the prior</b> &mdash;
         $\\hat p_v=\\frac{N_1+\\alpha p_0}{N_v+\\alpha}$ &mdash; so low-count values shrink toward the global
         rate $p_0$.</li>
         <li><b>Unseen categories at test/production.</b> A value with no training history has no count.
         <b>Fix:</b> fall back to the global rate $p_0$ (the $N_v=0$ limit of the smoothing formula); don't
         emit NaN.</li>
         <li><b>Distribution shift in the rates.</b> Bin counting assumes past rate $\\approx$ future rate. If
         a value's true rate drifts (seasonality, a fraud ring goes quiet), stale encodings mislead.
         <b>Fix:</b> refresh the counts on a rolling window and prefer a time-split that mirrors production.</li>
         <li><b>Needs enough history.</b> With too few rows per value, almost everything is "rare" and you are
         really just predicting the prior. Bin counting pays off only when the high-frequency values carry
         real, repeated signal.</li>
       </ul>`,

    practice: [
      {
        q: `Your CTR model gets <b>0.95 AUC</b> in cross-validation but <b>0.62 AUC</b> in production after you add a <code>device_ctr</code> bin-counting feature. What is the most likely cause, and how do you fix it?`,
        steps: [
          { do: `Suspect target leakage: the encoding was probably computed using each row's own label.`, why: `If $p_v$ for a row was built from a set that includes that row, the feature partly encodes the answer, inflating CV.` },
          { do: `Recompute the encoding out-of-fold (or leave-one-out, or from an earlier time window).`, why: `Each row's $device\\_ctr$ must come from OTHER rows only, so no label leaks into its own prediction.` },
          { do: `For click models, prefer the time-split: learn rates from a back-fill window, apply forward.`, why: `It matches how production actually works (you only ever know the past), eliminating leakage realistically.` }
        ],
        answer: `<p><b>Target leakage.</b> The bin-counted rate was computed using each row's own label, so the feature secretly carried the target &mdash; brilliant in CV, useless live. Fix: compute the encoding <b>out-of-fold</b> / leave-one-out, or from a <b>separate earlier time window</b> ("back-fill"). For CTR models the time-split is the most honest because production only ever knows the past.</p>`
      },
      {
        q: `A device appears <b>twice</b> in training and both impressions were clicked, giving a raw rate of <b>1.0</b>. The global click rate is $p_0=0.05$. With smoothing $\\alpha=10$, what encoded value should this device get, and why is the raw $1.0$ dangerous?`,
        steps: [
          { do: `Note $N_1=2$, $N_0=0$, $N_v=2$ — a rare category, so the raw rate is noise.`, why: `Two clicks out of two is a fluke; a literal $1.0$ would tell the model this device always clicks.` },
          { do: `Apply additive smoothing: $\\hat p_v=\\frac{N_1+\\alpha p_0}{N_v+\\alpha}=\\frac{2+10\\cdot 0.05}{2+10}$.`, why: `Adding $\\alpha=10$ pseudo-rows of the prior drags the tiny-count estimate toward the global rate.` },
          { do: `Compute: $\\frac{2+0.5}{12}=\\frac{2.5}{12}\\approx 0.208$.`, why: `Above average (it did click) but nowhere near $1.0$ — the confidence is appropriately low.` }
        ],
        answer: `<p>Smoothed encoding $\\hat p_v=\\frac{2+10\\cdot 0.05}{2+10}=\\frac{2.5}{12}\\approx \\mathbf{0.21}$. The raw $1.0$ is dangerous because two-of-two is a <b>rare-category fluke</b>; trusting it overfits. Additive (Laplace) smoothing <b>backs off to the prior</b> $p_0$, shrinking low-count estimates toward the global rate so a $1/1$ can't pose as a guaranteed click.</p>`
      },
      {
        q: `At serving time a request arrives with a <code>device_id</code> that <b>never appeared in training</b>. What should the bin-counting feature return, and what must you make sure your pipeline does NOT do?`,
        steps: [
          { do: `Recognize this is the unseen-category case: $N_v=0$, no history for this value.`, why: `There is no rate to compute, but the model still needs a number for this column.` },
          { do: `Return the global rate $p_0=P(y=1)$ as the fallback.`, why: `It is the $N_v=0$ limit of the smoothing formula — "assume average until we learn otherwise."` },
          { do: `Make sure the pipeline does not emit NaN or crash, and does not silently impute 0.`, why: `NaN breaks the model; a hard 0 falsely claims this device never clicks, which is also wrong.` }
        ],
        answer: `<p>Return the <b>global rate</b> $p_0$ &mdash; the $N_v=0$ limit of $\\hat p_v=\\frac{N_1+\\alpha p_0}{N_v+\\alpha}$. The pipeline must <b>not</b> emit a NaN (it crashes the model) and must not silently fill 0 (that falsely claims the device never clicks). Falling back to the prior is the safe, calibrated default for any unseen value.</p>`
      }
    ]
  });

  window.CODE["fe-bin-counting"] = {
    lib: "pandas + numpy + scikit-learn",
    runnable: false,
    explain: `<p>The chapter's approach to encoding a very-high-cardinality categorical (an advertising ID
      on <b>Avazu</b>-style click data) by its target statistics. A single <code>groupby</code> gives the
      per-category click counts; from those you get the conditional probability $P(\\text{click}\\mid c)$ and
      the log-odds $\\log\\frac{p}{1-p}$. Two safeguards make it honest: an <b>out-of-fold</b> computation so
      no row uses its own label (target leakage), and <b>Laplace / additive smoothing</b> that backs rare
      values off to the global rate. Get the Avazu Click-Through Rate dataset from Kaggle (the book's repo:
      github.com/alicezheng/feature-engineering-book); <code>runnable</code> is off because you must download
      the data first.</p>`,
    code: `import numpy as np
import pandas as pd
from sklearn.model_selection import KFold

# --- Load Avazu-style click data (book example: advertising click-through) ---
# Get it from Kaggle 'Avazu CTR' / the book repo:
#   github.com/alicezheng/feature-engineering-book
# Columns include high-cardinality IDs like 'device_id', 'app_id', 'site_id'
# and a binary target 'click' (1 = clicked, 0 = not).
df = pd.read_csv('avazu_train.csv', usecols=['device_id', 'click'])

col, target = 'device_id', 'click'
prior = df[target].mean()          # global click rate p0  (the back-off / fallback)
alpha = 20.0                       # additive-smoothing strength

# === Plain bin counting (counts -> rate -> log-odds) on the WHOLE column ===
# (Shown for clarity; for modeling use the out-of-fold version below.)
grp = df.groupby(col)[target]
counts = grp.agg(N1='sum', N=('count'))      # clicks and total per category value
counts['N0'] = counts['N'] - counts['N1']
# Conditional probability with Laplace smoothing -> shrinks rare values to the prior:
counts['rate'] = (counts['N1'] + alpha * prior) / (counts['N'] + alpha)
# Log-odds: a spread-out, model-friendly version of the rate.
counts['log_odds'] = np.log(counts['rate'] / (1.0 - counts['rate']))

# === Out-of-fold bin counting (the leakage-safe version you actually train on) ===
# Each row is encoded using ONLY the other folds -> no row sees its own label.
def out_of_fold_target_encode(df, col, target, alpha=20.0, n_splits=5, seed=0):
    oof = pd.Series(np.nan, index=df.index)
    prior = df[target].mean()
    kf = KFold(n_splits=n_splits, shuffle=True, random_state=seed)
    for tr_idx, val_idx in kf.split(df):
        tr, val = df.iloc[tr_idx], df.iloc[val_idx]
        g = tr.groupby(col)[target].agg(N1='sum', N='count')
        rate = (g['N1'] + alpha * prior) / (g['N'] + alpha)   # smoothed rate
        # map onto the held-out fold; UNSEEN values fall back to the global rate:
        oof.iloc[val_idx] = val[col].map(rate).fillna(prior).values
    return oof

df['device_ctr'] = out_of_fold_target_encode(df, col, target, alpha=alpha)
# 'device_ctr' is now ONE dense, highly predictive column replacing a million-wide one-hot.

# For brand-new IDs at SERVING time, encode with the full-train smoothed table and
# default to the prior:
serve_rate = counts['rate']
def encode_at_serving(device_id):
    return serve_rate.get(device_id, prior)   # unseen -> global click rate p0`
  };

  window.CODEVIZ["fe-bin-counting"] = {
    question: "How do you READ a bin-counting diagram -- the smoothing curve that tames rare categories, the dense per-category signal, the leakage gap between CV and production, and the noise of low-count values?",
    charts: [
      {
        type: "line",
        title: "Ideal: smoothing pulls low-count rates toward the prior, trusts high-count ones",
        xlabel: "rows seen for this category value (Nv)",
        ylabel: "encoded rate (smoothed toward prior p0 = 0.05)",
        series: [
          { name: "raw rate = 1.0 (all clicked)", color: "#9aa7b4", points: [[1,0.05],[200,0.05],[400,0.05],[600,0.05],[800,0.05],[1000,0.05]] },
          { name: "smoothed estimate", color: "#7ee787", points: [[1,0.136],[2,0.208],[5,0.367],[10,0.525],[20,0.683],[50,0.842],[100,0.914],[300,0.969],[1000,0.990]] }
        ],
        interpret: "X axis is <b>how much history</b> a category value has; Y axis is the <b>encoded rate</b> you hand the model. The grey line is the global prior p0 = 0.05 (the fallback). The green curve is the smoothed estimate for a value whose raw rate is a perfect 1.0: with <b>few rows it sits low, near the prior</b> (a 1/1 fluke can't pose as 100%), and as rows pile up it <b>climbs toward the true 1.0</b>. Read it as: little data, trust the prior; lots of data, trust the value. The knob alpha sets how fast it climbs."
      },
      {
        type: "bars",
        title: "What you want to see: a dense, monotone per-category target rate",
        labels: ["bin 0", "bin 1", "bin 2", "bin 3", "bin 4"],
        values: [0.95, 0.86, 0.71, 0.33, 0.08],
        valueLabels: ["0.95", "0.86", "0.71", "0.33", "0.08"],
        colors: ["#7ee787", "#7ee787", "#7ee787", "#7ee787", "#7ee787"],
        interpret: "Real numbers from load_breast_cancer (a binned feature standing in for a high-cardinality category). Each bar is one category value; height is its <b>out-of-fold target rate</b> P(y=1 | value). One dense column replaces a 5-wide one-hot. The bars step cleanly from 0.95 down to 0.08 -- a <b>clear, monotone separation</b> between values, which is exactly the predictive signal you hope for. Flat bars all near the prior would mean the category carries no signal."
      },
      {
        type: "line",
        title: "Failure mode: target leakage -- great in CV, collapses in production",
        xlabel: "training epoch / evaluation point",
        ylabel: "AUC",
        series: [
          { name: "cross-validation AUC (leaky)", color: "#7ee787", points: [[1,0.80],[2,0.88],[3,0.92],[4,0.94],[5,0.95]] },
          { name: "production AUC (truth)", color: "#ff7b72", points: [[1,0.61],[2,0.62],[3,0.62],[4,0.63],[5,0.62]] }
        ],
        interpret: "Illustrative. Both lines are AUC (higher = better ranking). The green CV line soars to ~0.95 while the red production line is stuck around ~0.62 -- a <b>wide, persistent gap</b>. That gap is the fingerprint of <b>target leakage</b>: the encoding was built using each row's own label, so the feature secretly carries the answer in CV but is useless on unseen rows. If you see CV far above production, suspect leakage and recompute the encoding <b>out-of-fold</b> or from an earlier time window."
      },
      {
        type: "scatter",
        title: "What raw (unsmoothed) rates look like: rare categories are pure noise",
        xlabel: "rows seen for this category value (Nv, log-ish)",
        ylabel: "raw target rate N1 / Nv",
        groups: [
          { name: "rare: noisy, untrustworthy", color: "#ff7b72", points: [[1,0.0],[1,1.0],[2,0.0],[2,0.5],[2,1.0],[3,0.33],[3,1.0],[4,0.25],[5,0.6]] },
          { name: "well-populated: settles near truth", color: "#7ee787", points: [[200,0.07],[400,0.09],[700,0.08],[1000,0.08],[1500,0.085]] }
        ],
        lines: [
          { color: "#9aa7b4", dash: true, points: [[1,0.05],[1500,0.05]] }
        ],
        interpret: "Illustrative. Each point is a category value: X = how many rows it has, Y = its <b>raw, unsmoothed rate</b>. The red low-count values on the left are <b>scattered all over 0 to 1</b> -- a 1/1 gives 1.0, a 0/2 gives 0.0, none trustworthy. The green high-count values on the right <b>cluster tightly</b> near their true rate (~0.08). The grey dashed line is the prior p0. This funnel shape is why you smooth: it drags the wild left-hand points toward the prior while leaving the settled right-hand points alone."
      }
    ],
    caption: "How to read bin-counting diagrams: the smoothing curve (history decides how much to trust a value), the dense per-category target rate, the CV-vs-production gap that signals leakage, and the noise funnel that motivates smoothing. The book uses heavy-cardinality Avazu click IDs; these show the same ideas, computed out-of-fold to stay honest.",
    code: `import numpy as np
from sklearn.datasets import load_breast_cancer
from sklearn.linear_model import LogisticRegression
from sklearn.model_selection import StratifiedKFold, cross_val_score

d = load_breast_cancer()
ri = list(d.feature_names).index('mean radius')
x = d.data[:, ri]
y = d.target                                  # 1 = benign, 0 = malignant

# Make a 'high-cardinality category' by binning one feature into 5 buckets.
edges = np.percentile(x, [0, 20, 40, 60, 80, 100])
cat = np.clip(np.digitize(x, edges[1:-1]), 0, 4)   # category id in {0..4}

prior = y.mean()
alpha = 10.0

# --- Out-of-fold target-rate encoding (leakage-safe bin counting) ---
def oof_encode(cat, y, alpha, seed=0):
    enc = np.full(len(y), np.nan)
    skf = StratifiedKFold(5, shuffle=True, random_state=seed)
    for tr, va in skf.split(cat.reshape(-1, 1), y):
        for v in np.unique(cat[tr]):
            m = cat[tr] == v
            rate = (y[tr][m].sum() + alpha * y[tr].mean()) / (m.sum() + alpha)
            enc[va[cat[va] == v]] = rate
        enc[va] = np.where(np.isnan(enc[va]), y[tr].mean(), enc[va])  # unseen -> prior
    return enc

binc = oof_encode(cat, y, alpha)

# Per-category target rate (the dense signal):
rates = np.array([(y[cat == v].mean()) for v in range(5)])
print('per-bin target rate:', np.round(rates, 2))   # -> ~[0.95 0.86 0.71 0.33 0.08]

# Baseline: logistic regression on the raw label id vs on the bin-counted column.
acc_label = cross_val_score(LogisticRegression(max_iter=1000),
                            cat.reshape(-1, 1), y, cv=5).mean()
acc_binc  = cross_val_score(LogisticRegression(max_iter=1000),
                            binc.reshape(-1, 1), y, cv=5).mean()
print('label-encoded acc :', round(acc_label, 2))   # -> ~0.63
print('bin-counted acc   :', round(acc_binc, 2))    # -> ~0.90`
  };
})();
