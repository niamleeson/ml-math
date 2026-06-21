/* =====================================================================
   "Metrics & Evaluation" CONCEPT LESSON (BEGINNER) —
   Metrics for evaluating DATA: quality & drift (scoring data, not models).
   One self-contained file: a lesson object + its CODE + its CODEVIZ.
   Covers data-quality measures (missingness, duplicates, cardinality,
   class balance, outlier rate via z-score / IQR, Mahalanobis distance)
   and drift measures (PSI, CSI, KS, Anderson-Darling, Cramer-von Mises,
   chi-square, Wasserstein). Real numbers from load_wine via numpy.
   ===================================================================== */
(function () {
  window.LESSONS.push({
    id: "met-data-quality",
    title: "Metrics for evaluating data (quality & drift)",
    tagline: "Before you score a model, score the data feeding it — is it clean, and does it still look like training?",
    module: "Metrics & Evaluation — measuring models, data & statistics",
    prereqs: ["skill-data-audit", "skill-monitoring"],

    whenToUse:
      `<p><b>Reach for these metrics whenever you are judging a dataset, not a model.</b> Two questions come up again and again: (1) <i>Is this data clean enough to trust?</i> and (2) <i>Has the data changed since the model was trained?</i> Different metrics answer each.</p>
       <ul>
         <li><b>To judge cleanliness</b> use the <b>quality</b> measures: missingness rate, duplicate rate, cardinality (how many distinct values a column has), class balance, and outlier rate (via z-score or IQR for one column, Mahalanobis distance for many columns at once).</li>
         <li><b>To monitor score &amp; feature drift over time</b> reach for <b>PSI</b> (Population Stability Index) and <b>CSI</b> (Characteristic Stability Index). They are cheap, give a single number per feature, and come with famous thresholds, so they are the workhorses of production dashboards.</li>
         <li><b>For a rigorous, principled "did these two samples come from the same distribution?" test</b> use a two-sample test: <b>KS</b> (Kolmogorov&ndash;Smirnov), <b>Anderson&ndash;Darling</b>, or <b>Cram&eacute;r&ndash;von Mises</b> for numbers, and the <b>chi-square</b> test for categories.</li>
         <li><b>For a calibrated "how far did this number move" distance</b> use the <b>Wasserstein</b> distance (also called Earth Mover's distance) on numeric features.</li>
         <li><b>For multivariate outliers</b> — rows that look fine column-by-column but are weird as a combination — use <b>Mahalanobis distance</b>.</li>
       </ul>`,

    application:
      `<p>These metrics live in data-quality gates and drift dashboards. A pipeline computes missingness, duplicate, and cardinality stats on every fresh batch and <i>blocks</i> the load if they breach a rule. A monitoring service compares each live feature against the training distribution with PSI / KS and alerts when a feature drifts. Risk and credit teams track PSI on model <i>scores</i> monthly because regulators expect a stability report. Tools like <b>Evidently</b>, <b>Great Expectations</b>, <b>NannyML</b>, and <b>whylogs</b> exist to compute exactly this family for you.</p>`,

    pitfalls:
      `<ul>
         <li><b>PSI binning changes the answer.</b> PSI needs you to chop the feature into bins; using too few bins hides drift, too many makes empty bins blow up the log term. Fix the bin edges from the <i>reference</i> data (quantile bins are standard), reuse those exact edges on every current batch, and floor empty bins at a small value (e.g. $10^{-4}$) so $\\ln$ does not explode.</li>
         <li><b>The KS test is over-powered on huge samples.</b> With millions of rows, KS (and any two-sample test) reports $p \\lt  0.0001$ for a shift so tiny no one cares — statistical significance is not practical significance. On big data, lean on an <i>effect size</i> you can threshold (the KS statistic $D$ itself, PSI, or Wasserstein) instead of the p-value, or subsample before testing.</li>
         <li><b>Drift that does not hurt the model.</b> A feature can drift hard while the model's accuracy is untouched — maybe the model barely uses it, or the drift is in a region the decision boundary ignores. Do not auto-retrain on every PSI alert; confirm with a performance signal (or a label-free estimator) that the drift actually moved the metric you care about.</li>
         <li><b>The missingness <i>mechanism</i> matters, not just the rate.</b> A column 5% missing is benign if values vanish at random (MCAR / Missing Completely At Random), but dangerous if they vanish <i>because</i> of their value (MNAR / Missing Not At Random) — e.g. high incomes left blank. The rate is the same; the bias is not. Inspect <i>which</i> rows are missing, not only how many.</li>
         <li><b>Duplicate rate vs near-duplicates.</b> Exact-row duplicate counting misses rows that are the same record with a trailing space or a different timestamp. For dedup that matters, normalize / fuzzy-match keys, and remember duplicates inflate apparent sample size and leak between train and test.</li>
       </ul>`,

    bigIdea:
      `<p>Every metric here turns a property of <b>data</b> into one number you can threshold.</p>
       <p><b>Quality</b> metrics describe a single dataset: how much is missing, how much is repeated, how spread-out the categories are, how lopsided the labels are, how many rows are outliers.</p>
       <p><b>Drift</b> metrics compare <i>two</i> datasets — a fixed <b>reference</b> (what the model trained on) and a <b>current</b> sample (recent live data) — and score how far apart their distributions are.</p>
       <p>The single recurring trick is: summarize a distribution (as bin shares, or as a CDF / Cumulative Distribution Function — the curve giving the fraction of values $\\le x$), then measure a distance between two such summaries.</p>`,

    buildup:
      `<p>Start with one dataset and ask cheap questions. <b>Missingness rate</b> = fraction of cells that are empty. <b>Duplicate rate</b> = fraction of rows that repeat. <b>Cardinality</b> = number of distinct values in a column (an ID column has cardinality near the row count; a yes/no column has cardinality 2). <b>Class balance</b> = the share of each label (50/50 is balanced, 99/1 is not). <b>Outlier rate</b> = fraction of values far from the center.</p>
       <p>"Far from the center" needs a yardstick. The <b>z-score</b> measures distance in standard deviations; the <b>IQR</b> (Inter-Quartile Range) rule measures distance in quartile-widths. For one column either works. For many columns at once, a point can be normal in every column yet weird as a combination — <b>Mahalanobis distance</b> measures distance from the center while accounting for how the columns co-vary.</p>
       <p>Now bring in a second dataset and ask "did the distribution move?". <b>PSI</b> sums a per-bin gap; <b>KS</b> takes the biggest gap between the two CDFs; <b>Wasserstein</b> measures the total work to slide one distribution onto the other; the <b>chi-square</b> test does the bin comparison for categories with a known null distribution.</p>`,

    symbols: [
      { sym: "$N$", desc: "the number of rows (or cells) in the dataset." },
      { sym: "$x_i$", desc: "an individual value; $\\mu$ is the mean (average) of the values and $\\sigma$ their standard deviation (typical spread)." },
      { sym: "$z_i$", desc: "the z-score of $x_i$: how many standard deviations it sits from the mean, $z_i=(x_i-\\mu)/\\sigma$." },
      { sym: "$Q_1,\\,Q_3$", desc: "the first and third quartiles (the 25th and 75th percentiles). $\\text{IQR}=Q_3-Q_1$ is the middle-50% width." },
      { sym: "$e_i$", desc: "the expected share of data in bin $i$, taken from the reference distribution. The $e_i$ sum to 1." },
      { sym: "$a_i$", desc: "the actual share of data in bin $i$ in the current sample. The $a_i$ sum to 1." },
      { sym: "$F_{\\text{ref}}(x),\\,F_{\\text{cur}}(x)$", desc: "the reference and current CDFs (fraction of values $\\le x$)." },
      { sym: "$D$", desc: "the KS statistic: the largest vertical gap between the two CDF curves." },
      { sym: "$\\Sigma$", desc: "the covariance matrix: how the columns vary and co-vary; $\\Sigma^{-1}$ is its inverse, used by Mahalanobis distance." }
    ],

    formula: `$$ z_i=\\frac{x_i-\\mu}{\\sigma} \\qquad \\text{IQR fence}:[\\,Q_1-1.5\\,\\text{IQR},\\;Q_3+1.5\\,\\text{IQR}\\,] \\qquad d_M(\\mathbf{x})=\\sqrt{(\\mathbf{x}-\\boldsymbol{\\mu})^{\\top}\\Sigma^{-1}(\\mathbf{x}-\\boldsymbol{\\mu})} $$
$$ \\text{PSI}=\\sum_i (a_i-e_i)\\,\\ln\\frac{a_i}{e_i} \\qquad D=\\sup_x\\bigl|\\,F_{\\text{ref}}(x)-F_{\\text{cur}}(x)\\,\\bigr| \\qquad \\chi^2=\\sum_i \\frac{(O_i-E_i)^2}{E_i} $$`,

    whatItDoes:
      `<p><b>Outlier rules.</b> The <b>z-score</b> flags $x_i$ as an outlier when $|z_i|$ exceeds a cutoff (commonly 3 — beyond 3 standard deviations). The <b>IQR rule</b> flags anything outside the fence $[Q_1-1.5\\,\\text{IQR},\\,Q_3+1.5\\,\\text{IQR}]$; it uses quartiles, so it does not assume a bell curve and is robust to the very outliers it is hunting. The outlier rate is the fraction of values flagged.</p>
       <p><b>Mahalanobis distance</b> $d_M$ is "z-score for a whole row of correlated columns": it measures how far a point is from the center, but stretches each direction by how much the data naturally varies there (via $\\Sigma^{-1}$). A large $d_M$ marks a multivariate outlier even when each single column looks ordinary.</p>
       <p><b>PSI</b> compares two histograms: for each bin take the share gap $(a_i-e_i)$ and weight it by the log-ratio $\\ln(a_i/e_i)$, then sum. Both factors share a sign, so every term is positive and PSI grows with the shift. Thresholds: <b>PSI &lt; 0.1</b> = stable, <b>0.1&ndash;0.25</b> = moderate shift (watch it), <b>&gt; 0.25</b> = large shift (alarm). <b>CSI</b> (Characteristic Stability Index) is the <i>same formula applied to an input feature</i> rather than to the model's output score — PSI traditionally names the score version, CSI the feature version.</p>
       <p><b>KS</b> walks along $x$ and takes the widest vertical gap $D$ between the two CDFs; it needs no bins and comes with a p-value. <b>Anderson&ndash;Darling</b> and <b>Cram&eacute;r&ndash;von Mises</b> are cousins that integrate the gap across the whole curve instead of taking only the maximum, so they react to differences in the tails (Anderson&ndash;Darling especially weights the tails). <b>Wasserstein</b> distance is the area between the two CDFs — the average horizontal distance mass must travel — so it is in the feature's own units. The <b>chi-square</b> test compares observed category counts $O_i$ to expected counts $E_i$ and turns the gap into a p-value for categorical drift.</p>`,

    derivation:
      `<p><b>Why each measure captures what it claims (gently).</b></p>
       <ul class="steps">
         <li><b>Z-score and IQR both ask "how far from typical".</b> The z-score divides by $\\sigma$, so "far" is measured in spread units — but $\\mu$ and $\\sigma$ are themselves pulled by outliers, so one giant value can hide others. The IQR uses quartiles, which a few extreme points cannot move, so the fence stays put: that robustness is why the IQR rule is the default for skewed data.</li>
         <li><b>Mahalanobis = z-score in many dimensions.</b> If you whiten the data (rotate and rescale so every direction has variance 1 and no correlation), ordinary Euclidean distance in that whitened space is exactly $d_M$. The $\\Sigma^{-1}$ does the rotating-and-rescaling. So a point 2 units away along a high-variance direction is "near", but 2 units along a low-variance direction is "far" — which is the whole point. Under a multivariate normal, $d_M^2$ follows a chi-square distribution, giving a principled cutoff.</li>
         <li><b>PSI is a symmetrized relative entropy.</b> The KL (Kullback&ndash;Leibler) divergence from current to reference is $\\sum_i a_i\\ln(a_i/e_i)$. Add the reverse direction and simplify, and you get exactly $\\sum_i (a_i-e_i)\\ln(a_i/e_i)$. So PSI measures the information lost by pretending the data still matches the reference; it is 0 only when every $a_i=e_i$ and climbs as shares diverge.</li>
         <li><b>KS / Anderson&ndash;Darling / Cram&eacute;r&ndash;von Mises are all CDF-gap measures.</b> Two identical distributions have identical CDFs, so every gap is 0. KS takes the single largest gap; Cram&eacute;r&ndash;von Mises integrates the squared gap over the whole curve; Anderson&ndash;Darling integrates it too but divides by $F(1-F)$ so gaps in the tails count more. The Glivenko&ndash;Cantelli theorem says the empirical CDF converges to the true one, which is why each statistic has a known null distribution and yields a p-value.</li>
         <li><b>Wasserstein is the area between the CDFs.</b> For one dimension, the cost of optimally sliding one pile of probability onto the other equals $\\int|F_{\\text{ref}}(x)-F_{\\text{cur}}(x)|\\,dx$ — the area between the curves. Because it is an integral of horizontal distance, it is in the feature's units and grows smoothly with the size of the move, unlike a p-value. $\\blacksquare$</li>
       </ul>`,

    example:
      `<p><b>(a) Outlier rate, one column.</b> Values $[10,12,11,13,12,40]$. Mean $\\mu=16.3$, standard deviation $\\sigma\\approx 10.4$, so the z-score of 40 is $(40-16.3)/10.4=2.3$ — under a cutoff of 3 it is <i>not</i> flagged (the one big value inflated $\\sigma$). The IQR rule is sturdier: $Q_1=11,\\,Q_3=13,\\,\\text{IQR}=2$, upper fence $=13+1.5(2)=16$. Now 40 &gt; 16 is flagged. Outlier rate $=1/6\\approx 0.17$.</p>
       <p><b>(b) PSI, one feature.</b> Reference bin shares $e=[0.25,0.25,0.25,0.25]$; current $a=[0.10,0.20,0.30,0.40]$.</p>
       <ul class="steps">
         <li>Bin 1: $(0.10-0.25)\\ln(0.10/0.25)=(-0.15)(-0.916)=0.137$.</li>
         <li>Bin 2: $(0.20-0.25)\\ln(0.20/0.25)=(-0.05)(-0.223)=0.011$.</li>
         <li>Bin 3: $(0.30-0.25)\\ln(0.30/0.25)=(0.05)(0.182)=0.009$.</li>
         <li>Bin 4: $(0.40-0.25)\\ln(0.40/0.25)=(0.15)(0.470)=0.071$.</li>
         <li>PSI $=0.137+0.011+0.009+0.071=0.228$. That is in the $0.1$&ndash;$0.25$ band &mdash; a <b>moderate shift</b>, keep watching; nudge it a touch higher and it crosses $0.25$ into <b>large shift / alarm</b>.</li>
       </ul>
       <p><b>(c) Class balance.</b> Labels $[\\,0{:}990,\\;1{:}10\\,]$ give shares $0.99 / 0.01$. That is severe imbalance — accuracy is now meaningless (predict "0" always for 99%), and you must reach for precision/recall or resampling.</p>`,

    demo: function (host) {
      var cv = document.createElement("canvas"); cv.width = 640; cv.height = 360; cv.style.maxWidth = "100%"; host.appendChild(cv);
      var ctx = cv.getContext("2d");
      var readout = document.createElement("div"); readout.className = "out"; readout.style.marginTop = "6px";
      function theme() {
        var s = getComputedStyle(document.documentElement);
        var g = function (n, d) { return (s.getPropertyValue(n) || d).trim(); };
        return { ink: g("--ink", "#e6edf3"), dim: g("--ink-dim", "#9aa7b4"), accent: g("--accent", "#4ea1ff"), accent2: g("--accent-2", "#7ee787"), warn: g("--warn", "#ffb454"), red: g("--bad", "#ff7b72"), border: g("--border", "#2a3340") };
      }
      var BTN = "background:var(--panel);color:var(--ink);border:1px solid var(--border);border-radius:8px;padding:7px 12px;cursor:pointer;font-size:13px;margin-right:8px";

      var nBins = 6;
      var ref = [0.10, 0.18, 0.24, 0.24, 0.16, 0.08]; // reference shares, sum 1
      var shift = 0;

      function current() {
        var a = ref.slice();
        for (var i = 0; i < nBins; i++) {
          var pull = (i - (nBins - 1) / 2) / ((nBins - 1) / 2);
          a[i] = ref[i] * (1 + shift * pull);
        }
        var s = a.reduce(function (p, q) { return p + q; }, 0);
        return a.map(function (v) { return Math.max(1e-4, v / s); });
      }
      function psi(e, a) {
        var t = 0;
        for (var i = 0; i < e.length; i++) { var ei = Math.max(1e-4, e[i]), ai = Math.max(1e-4, a[i]); t += (ai - ei) * Math.log(ai / ei); }
        return t;
      }

      var W = 640, H = 360, padL = 40, padR = 16, padT = 20, padB = 40;
      function band(p, c) { return p > 0.25 ? c.red : (p > 0.1 ? c.warn : c.accent2); }
      function draw() {
        var c = theme(); ctx.clearRect(0, 0, W, H);
        var a = current(), p = psi(ref, a), col = band(p, c);
        var maxv = 0.42, plotW = W - padL - padR, plotH = H - padT - padB, bw = plotW / nBins;
        ctx.strokeStyle = c.border; ctx.lineWidth = 1;
        ctx.beginPath(); ctx.moveTo(padL, padT); ctx.lineTo(padL, H - padB); ctx.lineTo(W - padR, H - padB); ctx.stroke();
        for (var i = 0; i < nBins; i++) {
          var x0 = padL + i * bw;
          var hr = ref[i] / maxv * plotH;
          ctx.strokeStyle = c.accent; ctx.lineWidth = 2;
          ctx.strokeRect(x0 + bw * 0.12, (H - padB) - hr, bw * 0.34, hr);
          var ha = a[i] / maxv * plotH;
          ctx.fillStyle = col + "cc";
          ctx.fillRect(x0 + bw * 0.54, (H - padB) - ha, bw * 0.34, ha);
        }
        ctx.fillStyle = c.dim; ctx.font = "11px sans-serif"; ctx.textAlign = "left";
        ctx.fillText("hollow = reference (training)", padL + 4, padT + 12);
        ctx.fillText("filled = current (live sample)", padL + 4, padT + 26);
        var verdict = p > 0.25 ? "&gt; 0.25 &rarr; LARGE shift: alarm." : (p > 0.1 ? "0.1&ndash;0.25 &rarr; moderate shift, keep watching." : "&lt; 0.1 &rarr; stable, no real drift.");
        readout.innerHTML = "Injected drift = <b>" + shift.toFixed(2) + "</b>. PSI (Population Stability Index) = <b style='color:" + col + "'>" + p.toFixed(3) + "</b>. <b style='color:" + col + "'>" + verdict + "</b> Drag the slider to push current mass toward the high bins and watch PSI cross 0.1 then 0.25.";
      }

      var row = document.createElement("div"); row.style.margin = "8px 0";
      var lab = document.createElement("label"); lab.style.display = "block"; lab.textContent = "injected drift ";
      var inp = document.createElement("input"); inp.setAttribute("type", "range"); inp.min = 0; inp.max = 0.9; inp.step = 0.02; inp.value = shift;
      inp.addEventListener("input", function () { shift = parseFloat(inp.value); draw(); });
      lab.appendChild(inp);
      var reset = document.createElement("button"); reset.style.cssText = BTN; reset.textContent = "Reset"; reset.style.marginTop = "6px";
      reset.addEventListener("click", function () { shift = 0; inp.value = 0; draw(); });
      row.appendChild(lab); row.appendChild(reset);
      host.appendChild(row); host.appendChild(readout);
      draw();
    },

    practice: [
      {
        q: `A numeric feature is monitored daily. Reference bin shares $e=[0.5,0.3,0.2]$; today's sample $a=[0.3,0.3,0.4]$. Compute the PSI and classify it on the &lt;0.1 / 0.1&ndash;0.25 / &gt;0.25 scale.`,
        steps: [
          { do: `Bin 1: $(0.3-0.5)\\ln(0.3/0.5)=(-0.2)(-0.511)=0.102$.`, why: `Both factors negative &rarr; a positive contribution; this bin lost a lot of mass.` },
          { do: `Bin 2: $(0.3-0.3)\\ln(0.3/0.3)=0$.`, why: `No change in a bin contributes nothing.` },
          { do: `Bin 3: $(0.4-0.2)\\ln(0.4/0.2)=(0.2)(0.693)=0.139$.`, why: `This bin gained mass; both factors positive.` },
          { do: `Sum: $0.102+0+0.139=0.241$.`, why: `PSI adds the per-bin contributions.` }
        ],
        answer: `<p>PSI $=0.241$, which lands in the <b>0.1&ndash;0.25 moderate band</b> (just under the 0.25 alarm line). Mass clearly slid from bin 1 to bin 3, so you would flag it for watching and confirm whether it actually hurts the model before retraining.</p>`
      },
      {
        q: `Your KS test on a feature returns $D=0.004$ with $p=2\\times10^{-8}$ across 5 million rows. The dashboard screams "significant drift". Should you alert? What metric would you trust instead?`,
        steps: [
          { do: `Separate significance from size: the p-value says the shift is real, not that it is big.`, why: `Any tiny difference becomes "significant" once $N$ is huge — the test is over-powered.` },
          { do: `Read the effect size $D=0.004$: the biggest CDF gap is 0.4%.`, why: `$D$ is a 0-to-1 distance independent of sample size; 0.004 is negligible.` },
          { do: `Threshold an effect size (KS $D$, PSI, or Wasserstein), or subsample to a few thousand rows before testing.`, why: `Effect sizes measure practical drift; subsampling stops $N$ from manufacturing significance.` }
        ],
        answer: `<p><b>Do not alert.</b> The microscopic p-value is an artifact of 5 million rows — KS is over-powered at that scale. The honest signal is the <b>effect size</b>: $D=0.004$ (a 0.4% CDF gap) or a PSI well under 0.1 means the distribution barely moved. Threshold the effect size, not the p-value (or subsample first).</p>`
      },
      {
        q: `A row has a perfectly normal height (170 cm) and a perfectly normal weight (45 kg), yet it is clearly anomalous. Which quality metric catches it, and why do per-column z-scores miss it?`,
        steps: [
          { do: `Check each column alone: 170 cm and 45 kg are each within normal range, so $|z|$ is small for both.`, why: `A z-score looks at one column at a time and sees nothing wrong.` },
          { do: `Note that height and weight are strongly correlated — tall-and-very-light is the odd combination.`, why: `The anomaly lives in the relationship between columns, not in any single one.` },
          { do: `Compute the Mahalanobis distance, which uses $\\Sigma^{-1}$ to account for that correlation.`, why: `It measures distance from the center in the whitened space where correlations are removed, so the off-trend combination scores far.` }
        ],
        answer: `<p>Use <b>Mahalanobis distance</b> $d_M=\\sqrt{(\\mathbf{x}-\\boldsymbol{\\mu})^{\\top}\\Sigma^{-1}(\\mathbf{x}-\\boldsymbol{\\mu})}$. Per-column z-scores treat columns independently, so "normal height, normal weight" passes both. Mahalanobis folds in the height&ndash;weight correlation via $\\Sigma^{-1}$, so a tall-yet-very-light row sits far from the joint center and is flagged as a multivariate outlier.</p>`
      }
    ]
  });

  window.CODE["met-data-quality"] = {
    lib: "scipy + numpy",
    runnable: false,
    explain: `<p>The real functions a practitioner calls for data quality and drift: a from-scratch <b>PSI</b> so you see the formula, plus SciPy's <code>ks_2samp</code> / <code>anderson_ksamp</code> / <code>chi2_contingency</code> two-sample tests, <code>wasserstein_distance</code> for numeric drift, and <code>mahalanobis</code> for multivariate outliers. Note at the bottom: <b>evidently</b> packages all of this into a one-call drift dashboard.</p>`,
    code: `# pip install scipy numpy scikit-learn evidently
import numpy as np
from scipy.stats import ks_2samp, anderson_ksamp, chi2_contingency, wasserstein_distance
from scipy.spatial.distance import mahalanobis

# ---------------------------------------------------------------
# 0) DATA-QUALITY measures on a single dataset (numpy).
# ---------------------------------------------------------------
def missingness_rate(col):          # fraction of empty cells
    return float(np.mean(np.isnan(col)))

def duplicate_rate(rows):           # fraction of repeated rows
    uniq = np.unique(rows, axis=0)
    return 1.0 - len(uniq) / len(rows)

def cardinality(col):               # number of distinct values
    return int(len(np.unique(col[~np.isnan(col)])))

def class_balance(labels):          # share of each label
    vals, counts = np.unique(labels, return_counts=True)
    return dict(zip(vals.tolist(), (counts / counts.sum()).round(3).tolist()))

def outlier_rate_z(col, cut=3.0):   # |z-score| > cut
    z = (col - col.mean()) / col.std()
    return float(np.mean(np.abs(z) > cut))

def outlier_rate_iqr(col, k=1.5):   # outside [Q1 - k*IQR, Q3 + k*IQR]
    q1, q3 = np.percentile(col, [25, 75]); iqr = q3 - q1
    lo, hi = q1 - k * iqr, q3 + k * iqr
    return float(np.mean((col < lo) | (col > hi)))

# ---------------------------------------------------------------
# 1) PSI / CSI from scratch (same formula; CSI = PSI on a feature).
# ---------------------------------------------------------------
def psi(ref, cur, bins=10):
    q = np.quantile(ref, np.linspace(0, 1, bins + 1))   # quantile edges from REFERENCE
    q[0], q[-1] = -np.inf, np.inf
    e = np.histogram(ref, q)[0] / len(ref)              # expected share per bin
    a = np.histogram(cur, q)[0] / len(cur)              # actual share per bin
    e, a = np.clip(e, 1e-4, None), np.clip(a, 1e-4, None)
    return float(np.sum((a - e) * np.log(a / e)))       # sum (a_i - e_i) * ln(a_i / e_i)
# rule of thumb: <0.1 stable, 0.1-0.25 moderate, >0.25 large drift -> alarm

# ---------------------------------------------------------------
# 2) Two-sample tests for NUMERIC drift (reference vs current).
# ---------------------------------------------------------------
ref = np.random.RandomState(0).normal(0, 1, 2000)       # placeholder samples
cur = np.random.RandomState(1).normal(0.3, 1, 2000)

ks = ks_2samp(ref, cur)                                  # Kolmogorov-Smirnov: max CDF gap
print("KS D =", round(ks.statistic, 3), " p =", ks.pvalue)
ad = anderson_ksamp([ref, cur])                          # Anderson-Darling (tail-sensitive)
print("AD stat =", round(ad.statistic, 3))
print("Wasserstein =", round(wasserstein_distance(ref, cur), 3))  # Earth Mover's distance
# (Cramer-von Mises: scipy.stats.cramervonmises_2samp(ref, cur) -- integral of squared CDF gap)

# ---------------------------------------------------------------
# 3) CATEGORICAL drift: chi-square on a contingency table.
# ---------------------------------------------------------------
#            cat A  cat B  cat C
table = np.array([[120,  80,  40],     # reference counts
                  [ 90,  70,  90]])    # current counts
chi2, p, dof, _ = chi2_contingency(table)
print("chi-square =", round(chi2, 2), " p =", round(p, 4))

# ---------------------------------------------------------------
# 4) MULTIVARIATE outlier: Mahalanobis distance.
# ---------------------------------------------------------------
X = np.random.RandomState(2).multivariate_normal([0, 0], [[1, .8], [.8, 1]], 500)
mu = X.mean(axis=0); VI = np.linalg.inv(np.cov(X.T))     # inverse covariance
d = np.array([mahalanobis(row, mu, VI) for row in X])    # per-row distance
print("multivariate outlier rate (d > 3):", float(np.mean(d > 3)))

# ---------------------------------------------------------------
# 5) EVIDENTLY packages all of the above into one drift report.
# ---------------------------------------------------------------
# from evidently.report import Report
# from evidently.metric_preset import DataDriftPreset
# rep = Report(metrics=[DataDriftPreset()])     # PSI / KS / Wasserstein per column
# rep.run(reference_data=ref_df, current_data=cur_df)
# rep.save_html("drift_dashboard.html")`
  };

  window.CODEVIZ["met-data-quality"] = {
    question: "Splitting load_wine in half (rows are ordered by cultivar, so the halves are genuinely different wines), which features drift, and which cross the PSI 0.25 alarm line?",
    charts: [{
      type: "bars",
      title: "PSI per feature: first half vs second half of load_wine (alarm at 0.25)",
      xlabel: "feature",
      ylabel: "PSI (Population Stability Index)",
      labels: ["proline", "alcalinity_of_ash", "hue", "flavanoids", "total_phenols", "color_intensity", "ash", "alarm = 0.25"],
      values: [4.283, 3.318, 2.379, 2.361, 1.852, 0.824, 0.190, 0.25],
      valueLabels: ["4.283", "3.318", "2.379", "2.361", "1.852", "0.824", "0.190", "0.25"],
      colors: ["#ff7b72", "#ff7b72", "#ff7b72", "#ff7b72", "#ff7b72", "#ff7b72", "#7ee787", "#ffb454"]
    }],
    caption: "Real numbers from load_wine (178 wines, 13 chemical features), whose rows are ordered by cultivar. Splitting at row 89 puts cultivars {0, start of 1} in the reference half and {end of 1, 2} in the current half, so the two halves really are different wines. PSI (10 quantile bins, edges fixed from the reference half) is huge for chemistry that separates the cultivars: proline 4.28, alcalinity_of_ash 3.32, hue 2.38, flavanoids 2.36, total_phenols 1.85 — all far above the 0.25 alarm line. Only 'ash' (0.19) stays under it, the lone stable feature. This is exactly what a drift dashboard would flag.",
    code: `import numpy as np
from sklearn.datasets import load_wine

d = load_wine()                                  # 178 wines, 13 features, ordered by cultivar
X, names = d.data, list(d.feature_names)

half = len(X) // 2                               # 89
ref, cur = X[:half], X[half:]                    # halves are genuinely different cultivars

def psi(r, c, bins=10):
    q = np.quantile(r, np.linspace(0, 1, bins + 1)); q[0], q[-1] = -np.inf, np.inf
    e = np.histogram(r, q)[0] / len(r)
    a = np.histogram(c, q)[0] / len(c)
    e, a = np.clip(e, 1e-4, None), np.clip(a, 1e-4, None)
    return float(np.sum((a - e) * np.log(a / e)))

scores = {nm: round(psi(ref[:, i], cur[:, i]), 3) for i, nm in enumerate(names)}
for nm, p in sorted(scores.items(), key=lambda t: -t[1]):
    print(f"{nm:32s} {p}")
# proline 4.283, alcalinity_of_ash 3.318, hue 2.379, flavanoids 2.361,
# total_phenols 1.852, ... color_intensity 0.824, ... ash 0.190
# alarm line at 0.25: every feature except 'ash' is flagged as large drift.`
  };
})();
