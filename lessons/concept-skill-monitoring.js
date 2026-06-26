/* =====================================================================
   "Doing ML for Real" SKILL LESSON — Monitoring model behavior after deployment.
   One self-contained file: a lesson object + its CODE + its CODEVIZ.
   Same rigor bar as the algorithm lessons: concrete playbook, the real
   math (PSI / KS / CUSUM / ADWIN), real libraries (evidently + river +
   nannyml), and a real-data chart computed with numpy + scikit-learn.
   ===================================================================== */
(function () {
  window.LESSONS.push({
    id: "skill-monitoring",
    title: "Monitoring model behavior after deployment",
    tagline: "A model is not done at deploy — it quietly rots, and only monitoring tells you.",
    module: "Doing ML for Real — the skills that matter",
    prereqs: ["ml-classification-metrics", "prob-clt", "prob-normal"],

    whenToUse:
      `<p><b>Reach for this the moment a model serves a real prediction.</b> Training accuracy is a snapshot of the past. The world keeps moving: users change, upstream pipelines change, a competitor launches, a holiday hits. The model's inputs drift away from what it learned, and its quality decays — silently, because nothing crashes. The server stays green while the predictions go wrong.</p>
       <p><b>It is make-or-break because the failure is invisible.</b> A bug throws an error. A rotting model just keeps returning confident answers that are increasingly wrong. Without monitoring you find out from a revenue dip or an angry customer weeks later. With it, you catch the drift the day it starts.</p>
       <p><b>It applies to every deployed model</b> — fraud scoring, recommendations, demand forecasting, ad ranking, medical triage. The higher the stakes and the faster the world moves, the more monitoring you need.</p>`,

    playbook:
      `<p>Post-deployment monitoring is a concrete pipeline, not a vibe. Run these in order:</p>
       <ol>
         <li><b>Log everything.</b> For every prediction, store the input features, the model's output (score / label), the model version, and a timestamp. When the true label finally arrives (a click, a chargeback, a diagnosis), join it back by an id. You cannot monitor what you did not log — this is step zero.</li>
         <li><b>Watch input drift.</b> Compare each input feature's <i>current</i> distribution against a fixed <i>reference</i> (usually the training set). Score the gap with <b>PSI</b> (Population Stability Index) for binned features, or the <b>KS</b> (Kolmogorov&ndash;Smirnov) test for continuous ones. A rising PSI means the data feeding the model no longer looks like what it trained on.</li>
         <li><b>Watch prediction drift.</b> Track the distribution of the model's own output scores over time. If a fraud model's average score suddenly doubles, either fraud spiked or the model is mis-firing. Prediction drift is cheap to compute (no labels needed) and often the earliest visible symptom.</li>
         <li><b>Track performance once labels arrive — and estimate it before they do.</b> When ground truth lands, recompute AUC (Area Under the Curve), accuracy, calibration. But labels are often slow (a loan default takes months). Use a label-free estimator like <b>NannyML</b> (CBPE / Confidence-Based Performance Estimation, and DLE / Direct Loss Estimation) to predict today's performance from the score distribution, so you are not flying blind for weeks.</li>
         <li><b>Detect concept drift on the stream.</b> Input drift is "the data changed"; concept drift is "the <i>relationship</i> between inputs and labels changed" — the same input now means a different outcome. Run an online detector: <b>ADWIN</b> (Adaptive Windowing) or <b>DDM</b> (Drift Detection Method) on the live error stream to flag the change point automatically.</li>
         <li><b>Set alert thresholds and a retraining trigger.</b> Pick concrete cutoffs (e.g. PSI &gt; 0.2, or a DDM warning level) and wire them to an alert <i>and</i> to an action: open a ticket, kick off a retrain on fresh data, or roll back. An alert nobody acts on is noise.</li>
         <li><b>De-risk new models with shadow and canary deploys.</b> Run the candidate model in <b>shadow</b> (it scores live traffic but its output is logged, not used) to compare against production with zero user risk. Then <b>canary</b> it to a small traffic slice, watch the same monitors, and ramp up only if they stay healthy.</li>
       </ol>`,

    application:
      `<p>Every serious ML team runs this. Fraud and credit teams monitor score drift hourly because attackers adapt. Recommendation and ads teams canary every model and watch engagement metrics on the slice before ramping. Forecasting teams track input drift on seasonality features. Healthcare and lending teams lean hard on label-free estimators because true outcomes (a default, a diagnosis) arrive months late. Tools like Evidently, NannyML, river, Arize, and WhyLabs exist precisely because this is a universal need.</p>`,

    pitfalls:
      `<ul>
         <li><b>Monitoring only uptime and latency, not data.</b> Your dashboards are all green — CPU, p99 latency, error rate — while the model's predictions quietly go wrong. Infra health says nothing about prediction quality. You must monitor the <i>data and the outputs</i>, not just the box.</li>
         <li><b>Waiting for labels that arrive weeks late.</b> If you only measure accuracy when ground truth lands, you learn about a problem long after it started costing money. Use input/prediction drift and a label-free estimator (NannyML) as your early-warning layer.</li>
         <li><b>Alerting on noise with no thresholds.</b> Small windows make every metric wiggle. Without principled cutoffs (PSI &gt; 0.2, a statistical test at a fixed significance) and minimum sample sizes, you either drown in false alarms and start ignoring them, or you set the bar so high you miss the real drift.</li>
         <li><b>Ignoring training/serving skew.</b> The feature pipeline at serving time computes a feature slightly differently than the training pipeline did (different default for a missing value, a different time zone, a stale join). The model sees inputs it never trained on — and no drift report on raw data will catch it unless you log the <i>exact</i> features the model consumed.</li>
         <li><b>The feedback loop where the model reshapes its own inputs.</b> A recommender only shows items it already likes, so tomorrow's training data is filtered by today's model. A fraud model blocks transactions, so you never see their true labels. The model's actions change its own future data distribution — drift you caused, not drift you observed. Log what you suppressed and use exploration / holdouts to keep an unbiased window.</li>
       </ul>`,

    checklist:
      `<p>Run this on your own deployed model:</p>
       <ul>
         <li>Am I logging input features, prediction, model version, and timestamp for <i>every</i> request?</li>
         <li>Can I join predictions back to true labels by an id once they arrive?</li>
         <li>Do I have a fixed <b>reference</b> distribution (the training set) to compare against?</li>
         <li>Is there an input-drift monitor (PSI / KS) on each important feature?</li>
         <li>Is there a prediction-drift monitor on the output score distribution?</li>
         <li>Do I estimate performance <i>before</i> labels arrive (NannyML or similar)?</li>
         <li>Is there an online concept-drift detector (ADWIN / DDM) on the error stream?</li>
         <li>Are alert thresholds set, with a defined action (ticket / retrain / rollback) per alert?</li>
         <li>Do new models go through shadow, then canary, before full rollout?</li>
         <li>Have I checked for training/serving feature skew by logging the exact served features?</li>
       </ul>`,

    bigIdea:
      `<p>A deployed model assumes tomorrow looks like the data it trained on. That assumption decays.</p>
       <p>Monitoring is the practice of <b>measuring how far today's reality has drifted from training</b>, and acting before the drift quietly wrecks your predictions.</p>
       <p>The core trick: pick a fixed <b>reference</b> distribution, then keep scoring how different the live <b>current</b> distribution is from it.</p>`,

    buildup:
      `<p>Two distributions: the <b>reference</b> (what the model trained on) and the <b>current</b> (live traffic in a recent window).</p>
       <p>We need a single number for "how far apart are these two distributions?" — that is the heart of drift detection.</p>
       <p><b>PSI</b> answers it for binned data; the <b>KS</b> statistic answers it for the raw continuous curve. Both are just distances between a reference and a current distribution.</p>`,

    symbols: [
      { sym: "$e_i$", desc: "the expected fraction of data in bin $i$, taken from the reference (training) distribution. The $e_i$ sum to 1." },
      { sym: "$a_i$", desc: "the actual fraction of data in bin $i$ in the current (live) window. The $a_i$ sum to 1." },
      { sym: "$i$", desc: "the index of a histogram bin (we chop the feature's range into bins, e.g. 10 quantile bins)." },
      { sym: "$F_{\\text{ref}}(x)$", desc: "the reference CDF (Cumulative Distribution Function): the fraction of reference values that are $\\le x$." },
      { sym: "$F_{\\text{cur}}(x)$", desc: "the current CDF: the fraction of current values that are $\\le x$." },
      { sym: "$D$", desc: "the KS statistic: the largest vertical gap between the two CDF curves, over all $x$." },
      { sym: "$\\sup_x$", desc: "the supremum over $x$ — read it as 'the maximum over every value of $x$' (the widest gap)." }
    ],

    formula: `$$ \\text{PSI}=\\sum_i (a_i-e_i)\\,\\ln\\!\\frac{a_i}{e_i} \\qquad\\qquad D=\\sup_x\\,\\bigl|\\,F_{\\text{ref}}(x)-F_{\\text{cur}}(x)\\,\\bigr| $$`,

    whatItDoes:
      `<p><b>PSI</b> (left): for each bin, take how much its share moved ($a_i-e_i$) and weight it by the log-ratio of the shares ($\\ln(a_i/e_i)$). Sum over bins. Both factors are big only when a bin gained or lost a lot of mass, so PSI grows with the size of the shift. Rule of thumb: PSI &lt; 0.1 = no real shift, 0.1&ndash;0.2 = moderate, &gt; 0.2 = a significant shift worth an alert.</p>
       <p><b>KS</b> (right): walk along $x$ and at each point measure the vertical distance between the reference CDF and the current CDF. $D$ is the single widest gap. It is 0 when the distributions match and approaches 1 when they are completely separated — and it needs no binning.</p>`,

    derivation:
      `<p><b>Why these two formulas work — and the streaming detectors behind them.</b></p>
       <ul class="steps">
         <li><b>PSI is a symmetrized relative entropy.</b> The KL (Kullback&ndash;Leibler) divergence from reference to current is $\\sum_i a_i\\ln(a_i/e_i)$. Adding the reverse direction and combining gives exactly $\\sum_i (a_i-e_i)\\ln(a_i/e_i)$. So PSI measures information lost when you pretend the current distribution still equals the reference — it is 0 only when every $a_i=e_i$, and it grows as the shares diverge.</li>
         <li><b>KS is a max-gap distance.</b> The CDF turns a distribution into a monotone curve from 0 to 1. If two distributions are identical, their CDFs coincide and $D=0$. The biggest vertical gap $D$ is large exactly when a chunk of probability mass has moved along the axis. The Glivenko&ndash;Cantelli theorem says the empirical CDF converges to the true one, so $D$ has a known null distribution — you can turn it into a p-value (probability the gap is this big by chance alone).</li>
         <li><b>CUSUM / control charts give you a streaming version.</b> A control chart watches a metric (say, the error rate) and draws limits at the reference mean $\\pm L\\sigma$ — $\\mu$ is the in-control mean, $\\sigma$ its standard deviation, $L$ a width like 3. CUSUM (Cumulative Sum) accumulates $S_t=\\max(0,\\,S_{t-1}+(x_t-\\mu-k))$, summing how far the metric runs above target; when $S_t$ crosses a threshold $h$ you declare a shift. It reacts to small persistent drifts a single-point chart would miss.</li>
         <li><b>ADWIN (Adaptive Windowing) keeps a window that auto-resizes.</b> It holds a window $W$ of recent values and asks: is there a split point where the older sub-window's mean differs from the newer sub-window's mean by more than statistical noise allows (a Hoeffding-style bound)? If yes, it drops the old half — concluding the distribution changed there — and reports drift. So the window automatically shrinks when the world changes and grows when it is stable, with no fixed window size to tune. $\\blacksquare$</li>
       </ul>`,

    example:
      `<p>One feature, 4 bins. Reference shares (from training): $e=[0.25,0.25,0.25,0.25]$. A recent live window: $a=[0.10,0.20,0.30,0.40]$ — mass has slid toward the high bins.</p>
       <ul class="steps">
         <li>Bin 1: $(0.10-0.25)\\ln(0.10/0.25)=(-0.15)(\\ln 0.4)=(-0.15)(-0.916)=0.137$.</li>
         <li>Bin 2: $(0.20-0.25)\\ln(0.20/0.25)=(-0.05)(-0.223)=0.011$.</li>
         <li>Bin 3: $(0.30-0.25)\\ln(0.30/0.25)=(0.05)(0.182)=0.009$.</li>
         <li>Bin 4: $(0.40-0.25)\\ln(0.40/0.25)=(0.15)(0.470)=0.071$.</li>
         <li>PSI $=0.137+0.011+0.009+0.071=0.228$. That is above $0.2$ &mdash; a <b>significant shift</b>, fire the alert.</li>
         <li>Notice every term is positive even when a bin lost mass: $(a_i-e_i)$ and $\\ln(a_i/e_i)$ always share the same sign, so PSI can never cancel itself out.</li>
       </ul>`,

    demo: function (host) {
      var cv = document.createElement("canvas"); cv.width = 640; cv.height = 360; cv.style.maxWidth = "100%"; host.appendChild(cv);
      var ctx = cv.getContext("2d");
      var readout = document.createElement("div"); readout.className = "out"; readout.style.marginTop = "6px";
      function theme() {
        var s = getComputedStyle(document.documentElement);
        var g = function (n, d) { return (s.getPropertyValue(n) || d).trim(); };
        return { ink: g("--ink", "#e6edf3"), dim: g("--ink-dim", "#9aa7b4"), accent: g("--accent", "#4ea1ff"), accent2: g("--accent-2", "#7ee787"), warn: g("--warn", "#ffb454"), purple: g("--purple", "#c89bff"), border: g("--border", "#2a3340") };
      }
      var BTN = "background:var(--panel);color:var(--ink);border:1px solid var(--border);border-radius:8px;padding:7px 12px;cursor:pointer;font-size:13px;margin-right:8px";

      // Fixed reference distribution: 6 bins, equal-ish reference shares.
      var nBins = 6;
      var ref = [0.10, 0.18, 0.24, 0.24, 0.16, 0.08]; // sums to 1
      var shift = 0; // 0 = no drift; slider pushes mass toward high bins

      function current() {
        // slide mass from low bins to high bins as shift grows
        var a = ref.slice();
        for (var i = 0; i < nBins; i++) {
          var pull = (i - (nBins - 1) / 2) / ((nBins - 1) / 2); // -1..+1 across bins
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
      function draw() {
        var c = theme(); ctx.clearRect(0, 0, W, H);
        var a = current(), p = psi(ref, a);
        var maxv = 0.42, plotW = W - padL - padR, plotH = H - padT - padB, bw = plotW / nBins;
        ctx.strokeStyle = c.border; ctx.lineWidth = 1;
        ctx.beginPath(); ctx.moveTo(padL, padT); ctx.lineTo(padL, H - padB); ctx.lineTo(W - padR, H - padB); ctx.stroke();
        for (var i = 0; i < nBins; i++) {
          var x0 = padL + i * bw;
          // reference bar (hollow blue outline)
          var hr = ref[i] / maxv * plotH;
          ctx.strokeStyle = c.accent; ctx.lineWidth = 2;
          ctx.strokeRect(x0 + bw * 0.12, (H - padB) - hr, bw * 0.34, hr);
          // current bar (filled green/orange depending on alert)
          var ha = a[i] / maxv * plotH;
          ctx.fillStyle = (p > 0.2 ? c.warn : c.accent2) + "cc";
          ctx.fillRect(x0 + bw * 0.54, (H - padB) - ha, bw * 0.34, ha);
        }
        ctx.fillStyle = c.dim; ctx.font = "11px sans-serif"; ctx.textAlign = "left";
        ctx.fillText("hollow = reference (training)", padL + 4, padT + 12);
        ctx.fillText("filled = current (live window)", padL + 4, padT + 26);
        readout.innerHTML = "Shift = <b>" + shift.toFixed(2) + "</b>. PSI (Population Stability Index) = <b style='color:" + (p > 0.2 ? c.warn : c.accent2) + "'>" + p.toFixed(3) + "</b>. " +
          (p > 0.2 ? "<b style='color:" + c.warn + "'>&gt; 0.2 &rarr; ALERT: significant drift.</b>" : (p > 0.1 ? "0.1&ndash;0.2 &rarr; moderate shift, keep watching." : "&lt; 0.1 &rarr; stable, no real drift.")) +
          " Drag the slider to push live mass toward the high bins and watch PSI cross the threshold.";
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
        q: `Your fraud model's input drift (PSI) is flat and low, but its accuracy has quietly dropped over the last month. The inputs look identical to training. What kind of drift is this, and which monitor would have caught it?`,
        steps: [
          { do: `Note that input drift is low — the feature distributions still match training.`, why: `PSI / KS only compare input distributions; if they are stable, input drift is ruled out.` },
          { do: `Recognize the input&rarr;label relationship changed: the same transaction pattern now means something different (fraudsters adapted).`, why: `That is concept drift, not covariate (input) drift — the mapping $P(y\\mid x)$ moved while $P(x)$ stayed put.` },
          { do: `Run an online detector on the error stream (ADWIN or DDM), not just a distribution comparison on inputs.`, why: `Concept drift is invisible to input-only monitors; it surfaces as a rising error rate that ADWIN / DDM flag automatically.` }
        ],
        answer: `<p>This is <b>concept drift</b>: $P(x)$ is stable so PSI stays low, but $P(y\\mid x)$ has shifted, so accuracy falls. An input-drift monitor can never see it. You need a detector on the <b>error stream</b> — <b>ADWIN</b> (Adaptive Windowing) or <b>DDM</b> (Drift Detection Method) — plus performance tracking once labels arrive (and NannyML to estimate performance before they do).</p>`
      },
      {
        q: `Reference bins $e=[0.5,0.3,0.2]$; current window $a=[0.3,0.3,0.4]$. Compute the PSI and decide whether to alert (threshold 0.2).`,
        steps: [
          { do: `Bin 1: $(0.3-0.5)\\ln(0.3/0.5)=(-0.2)(\\ln 0.6)=(-0.2)(-0.511)=0.102$.`, why: `Both factors are negative &rarr; positive contribution; this bin lost a lot of mass.` },
          { do: `Bin 2: $(0.3-0.3)\\ln(0.3/0.3)=0$.`, why: `No change in this bin contributes nothing.` },
          { do: `Bin 3: $(0.4-0.2)\\ln(0.4/0.2)=(0.2)(\\ln 2)=(0.2)(0.693)=0.139$.`, why: `This bin gained mass; both factors positive.` },
          { do: `Sum: $0.102+0+0.139=0.241$.`, why: `PSI adds the per-bin contributions.` }
        ],
        answer: `<p>PSI $=0.241$. That is above the $0.2$ threshold &rarr; <b>alert: significant input drift</b>. Mass has clearly moved from bin 1 to bin 3, and the metric flags it.</p>`
      },
      {
        q: `You have a new candidate model you think is better. Labels for your task take three weeks to arrive. How do you roll it out safely and measure it, given you cannot wait three weeks per step?`,
        steps: [
          { do: `Deploy the candidate in shadow mode first: it scores live traffic but its outputs are logged, not served.`, why: `Shadow gives you a real side-by-side on production traffic with zero user risk and no waiting for labels.` },
          { do: `Compare the candidate's score distribution and a label-free performance estimate (NannyML CBPE) against production.`, why: `You get an early read on quality before any ground truth exists.` },
          { do: `Promote to a small canary slice, watch input/prediction drift and the estimator on that slice, then ramp up gradually.`, why: `Canary limits blast radius; if monitors stay healthy you increase traffic, otherwise roll back instantly.` }
        ],
        answer: `<p><b>Shadow, then canary.</b> Shadow-deploy the candidate to score live traffic without serving it, compare score distributions and a <b>label-free estimate</b> (NannyML's CBPE / Confidence-Based Performance Estimation), then canary to a small slice with the same monitors and ramp up only if they stay green. You never wait three weeks to get a signal, and a bad model never touches most users.</p>`
      }
    ]
  });

  window.CODE["skill-monitoring"] = {
    lib: "evidently + river + nannyml",
    runnable: false,
    explain: `<p>Three real tools, three jobs: <b>Evidently</b> builds a batch data-drift report (PSI / KS per feature), <b>river</b> runs an online ADWIN concept-drift detector on the live stream, and <b>nannyml</b> estimates performance before labels arrive. Plus a from-scratch PSI so you see the formula behind the report.</p>`,
    code: `# pip install evidently river nannyml
import numpy as np
import pandas as pd

# ---------------------------------------------------------------
# 1) EVIDENTLY — batch input/prediction drift report (PSI + KS).
# ---------------------------------------------------------------
from evidently.report import Report
from evidently.metric_preset import DataDriftPreset

reference = pd.read_parquet("training_window.parquet")   # what the model trained on
current   = pd.read_parquet("last_24h.parquet")          # live traffic, recent window

report = Report(metrics=[DataDriftPreset()])             # PSI / KS / Wasserstein per column
report.run(reference_data=reference, current_data=current)
report.save_html("drift_report.html")
drift = report.as_dict()
print("dataset drift detected:", drift["metrics"][0]["result"]["dataset_drift"])

# ---------------------------------------------------------------
# 2) RIVER — online ADWIN concept-drift detector on the error stream.
# ---------------------------------------------------------------
from river import drift

adwin = drift.ADWIN()                  # Adaptive Windowing: auto-resizing change detector
errors = (current["prediction"] != current["label"]).astype(int)  # 1 if model was wrong
for i, err in enumerate(errors):
    adwin.update(err)                  # feed the live 0/1 error stream, one point at a time
    if adwin.drift_detected:
        print(f"ADWIN flagged concept drift at row {i}")  # window shrank -> error rate moved

# ---------------------------------------------------------------
# 3) NANNYML — estimate performance BEFORE labels arrive (CBPE).
# ---------------------------------------------------------------
import nannyml as nml

estimator = nml.CBPE(                  # Confidence-Based Performance Estimation
    y_pred="prediction", y_pred_proba="score", y_true="label",
    problem_type="classification_binary", metrics=["roc_auc"],
    chunk_size=500,
)
estimator.fit(reference)               # learns the score->performance mapping on labeled ref
estimated = estimator.estimate(current)  # predicts today's AUC with NO current labels needed
print(estimated.to_df()[["estimated_roc_auc"]])

# ---------------------------------------------------------------
# 4) PSI from scratch — the formula the report computes for you.
# ---------------------------------------------------------------
def psi(ref, cur, bins=10):
    q = np.quantile(ref, np.linspace(0, 1, bins + 1))   # quantile edges from reference
    q[0], q[-1] = -np.inf, np.inf
    e = np.histogram(ref, q)[0] / len(ref)              # expected share per bin
    a = np.histogram(cur, q)[0] / len(cur)              # actual share per bin
    e, a = np.clip(e, 1e-4, None), np.clip(a, 1e-4, None)
    return float(np.sum((a - e) * np.log(a / e)))       # sum (a_i - e_i) * ln(a_i / e_i)

print("PSI:", psi(reference["amount"].values, current["amount"].values))
# rule of thumb: <0.1 stable, 0.1-0.2 moderate, >0.2 significant drift -> alert + retrain`
  };

  window.CODEVIZ["skill-monitoring"] = {
    question: "Read a PSI-over-time chart: how do you tell stable from drifting, and a sudden break from a slow creep?",
    charts: [
      {
        type: "line",
        title: "Step drift: PSI flat, then crosses 0.2 the moment the shift starts (real data)",
        xlabel: "time window",
        ylabel: "PSI (Population Stability Index)",
        series: [
          { name: "PSI of 'mean radius'", color: "#4ea1ff", points: [[1, 0.134], [2, 0.051], [3, 0.115], [4, 0.329], [5, 1.399], [6, 2.484]] },
          { name: "alert threshold = 0.2", color: "#ffb454", points: [[1, 0.2], [2, 0.2], [3, 0.2], [4, 0.2], [5, 0.2], [6, 0.2]] }
        ],
        interpret: "<b>This is the textbook drift signal.</b> X is the time window (each a recent batch of live traffic); Y is the PSI distance between that window and the fixed training reference. The <b>orange</b> line is the 0.2 alert cutoff. PSI sits low and flat (0.13, 0.05, 0.12) while live data still looks like training, then jumps clean over the line at window 4 (0.33 -> 1.40 -> 2.48) — exactly when the injected shift starts. Read a sharp knee crossing 0.2 as: <b>something broke at that window</b> (a pipeline change, a new segment) — go look at what changed there."
      },
      {
        type: "line",
        title: "Stable: PSI wiggles below 0.1 forever (no drift)",
        xlabel: "time window",
        ylabel: "PSI (illustrative)",
        series: [
          { name: "PSI of feature", color: "#7ee787", points: [[1, 0.04], [2, 0.07], [3, 0.03], [4, 0.06], [5, 0.05], [6, 0.04], [7, 0.07], [8, 0.05]] },
          { name: "alert threshold = 0.2", color: "#ffb454", points: [[1, 0.2], [2, 0.2], [3, 0.2], [4, 0.2], [5, 0.2], [6, 0.2], [7, 0.2], [8, 0.2]] }
        ],
        interpret: "<b>Illustrative.</b> A healthy feature: PSI bounces around in the 0.03-0.07 band, well under the 0.1 'no real shift' mark, and never approaches the orange line. The small wiggle is just sampling noise from finite windows, not drift. Read this as <b>do nothing</b> — and resist the urge to lower the threshold to 'catch' these bumps, or you will alert on noise. Flat-and-low across many windows is exactly what you want to see."
      },
      {
        type: "line",
        title: "Gradual drift: slow creep that finally crosses (catch it early)",
        xlabel: "time window",
        ylabel: "PSI (illustrative)",
        series: [
          { name: "PSI of feature", color: "#c89bff", points: [[1, 0.04], [2, 0.06], [3, 0.09], [4, 0.12], [5, 0.15], [6, 0.18], [7, 0.22], [8, 0.27]] },
          { name: "moderate zone = 0.1", color: "#9aa7b4", points: [[1, 0.1], [2, 0.1], [3, 0.1], [4, 0.1], [5, 0.1], [6, 0.1], [7, 0.1], [8, 0.1]] },
          { name: "alert threshold = 0.2", color: "#ffb454", points: [[1, 0.2], [2, 0.2], [3, 0.2], [4, 0.2], [5, 0.2], [6, 0.2], [7, 0.2], [8, 0.2]] }
        ],
        interpret: "<b>Illustrative.</b> No clean knee here — PSI climbs steadily from 0.04 to 0.27 as the world shifts a little each window (seasonality, slow user-mix change). It enters the 0.1-0.2 'moderate, keep watching' band (grey) around window 4 and only trips the 0.2 alarm at window 7. Read a steady upward ramp as a <b>slow rot</b>: don't wait for the crossing — the trend itself is the warning, so investigate and plan a retrain while it is still in the grey zone."
      },
      {
        type: "line",
        title: "Transient spike: one window jumps, then returns (probably not real drift)",
        xlabel: "time window",
        ylabel: "PSI (illustrative)",
        series: [
          { name: "PSI of feature", color: "#ffb454", points: [[1, 0.05], [2, 0.06], [3, 0.04], [4, 0.41], [5, 0.07], [6, 0.05], [7, 0.06], [8, 0.05]] },
          { name: "alert threshold = 0.2", color: "#9aa7b4", points: [[1, 0.2], [2, 0.2], [3, 0.2], [4, 0.2], [5, 0.2], [6, 0.2], [7, 0.2], [8, 0.2]] }
        ],
        interpret: "<b>Illustrative.</b> PSI spikes to 0.41 at a single window then drops straight back to baseline. A real distribution shift <i>persists</i>; a one-window blip that self-heals usually means a transient — a bad data load, an outage backfill, a holiday — not lasting drift. Read it as: <b>don't trigger a retrain on a lone spike.</b> Require the alert to hold for N consecutive windows (or a minimum sample size) before acting, so you are not chasing one-off noise."
      }
    ],
    caption: "Real numbers from load_breast_cancer drive the top chart: a model trains on a 300-row reference window, the live stream is split into 6 windows of 120, and a +0.45-std-per-window shift is injected into windows 4-6 — PSI stays flat (0.13, 0.05, 0.12) then crosses 0.2 the moment the shift begins (0.33, 1.40, 2.48). The three variants below are illustrative shapes you will read in practice: stable (flat, low), gradual creep (catch the trend early), and a transient spike (don't retrain on one blip).",
    code: `import numpy as np
from sklearn.datasets import load_breast_cancer
from sklearn.linear_model import LogisticRegression

data = load_breast_cancer()                 # 569 real tumor records, 30 features
X, y = data.data, data.target
feat = list(data.feature_names).index("mean radius")

rng = np.random.RandomState(7)
order = rng.permutation(len(X)); X, y = X[order], y[order]

# Reference window: first 300 rows (also the training set).
ref_X, ref_y = X[:300], y[:300]
clf = LogisticRegression(max_iter=10000).fit(ref_X, ref_y)
ref = ref_X[:, feat]                          # reference distribution of the monitored feature

pool_X, pool_y = X[300:], y[300:]             # held-out pool for the live stream
nW, sz = 6, 120
std = ref.std()

def psi(ref, cur, bins=5):
    q = np.quantile(ref, np.linspace(0, 1, bins + 1)); q[0], q[-1] = -np.inf, np.inf
    e = np.histogram(ref, q)[0] / len(ref)
    a = np.histogram(cur, q)[0] / len(cur)
    e, a = np.clip(e, 1e-3, None), np.clip(a, 1e-3, None)
    return float(np.sum((a - e) * np.log(a / e)))

wrng = np.random.RandomState(123)
psis = []
for w in range(nW):
    idx = wrng.choice(len(pool_X), sz, replace=True)
    wX = pool_X[idx].copy()
    if w >= 3:                                # inject a growing shift into windows 4,5,6
        wX[:, feat] = wX[:, feat] + std * 0.45 * (w - 2)
    psis.append(round(psi(ref, wX[:, feat]), 3))

print("PSI per window:", psis)               # [0.134, 0.051, 0.115, 0.329, 1.399, 2.484]
# threshold line at 0.2; the alert fires at window 4 where the shift begins.`
  };
})();
