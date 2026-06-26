/* =====================================================================
   METRICS & EVALUATION LESSON (BEGINNER) — model calibration.
   "Is your model's confidence trustworthy?"
   Self-contained: registers the lesson, its CODE, and its CODEVIZ.
   All CODEVIZ numbers are real outputs of GaussianNB/RandomForest on
   load_breast_cancer (sklearn 1.6, numpy 1.26), computed offline.
   ===================================================================== */
(function () {
  window.LESSONS.push({
    id: "met-calibration",
    title: "Is your model's confidence trustworthy? Calibration metrics",
    tagline: "A model is calibrated if, among the cases it calls \"70% likely\", about 70% actually happen.",
    module: "Metrics & Evaluation — measuring models, data & statistics",
    prereqs: ["ml-classification-metrics", "ml-roc-auc"],

    whenToUse:
      `<p><b>Reach for calibration metrics whenever the <i>number</i> a model outputs — not just its rank order — is used to make a decision.</b> Many models output a score between 0 and 1. Calibration asks one question: when the model says "0.7", does the event really happen about 70% of the time? If a downstream system multiplies that score by a dollar amount, compares it to a cost-based threshold, or shows it to a human as a risk, then the score must <i>mean</i> what it says.</p>
       <p><b>Calibration matters most when:</b></p>
       <ul>
         <li><b>You make cost-based decisions.</b> "Block the transaction if fraud probability times the loss exceeds the cost of a false alarm" only works if the probability is honest.</li>
         <li><b>The score is a risk shown to people.</b> A "15% chance of complication" on a medical chart, or a credit-default probability, must be trustworthy, not just well-ordered.</li>
         <li><b>You combine model outputs.</b> Averaging or multiplying probabilities from several models (an ensemble, a Bayesian update) needs each one to be a real probability.</li>
       </ul>
       <p><b>Skip calibration and just use AUC (Area Under the Curve) / ranking metrics when</b> you only ever sort cases and act on the top few — a recommender that shows the top 10 items, or a search ranker. There the <i>order</i> is all that matters; the exact probability value is never read. A model can rank perfectly (AUC = 1.0) yet have wildly wrong probabilities, so pick the metric that matches how the score is actually consumed.</p>`,

    application:
      `<p>Calibration is the quiet backbone of any system that acts on a probability. <b>Fraud and risk</b> engines set block thresholds from calibrated default / fraud probabilities. <b>Weather forecasting</b> invented reliability diagrams — "30% chance of rain" is graded against how often it actually rains on such days. <b>Medical prognosis</b> models (risk of readmission, of complication) are required by regulators to be calibrated, not merely accurate. <b>Insurance pricing</b> and <b>ad bidding</b> multiply a predicted probability by a payout, so a 2× miscalibration is a 2× pricing error. <b>Ensembles and Bayesian updates</b> only compose correctly if each input is a genuine probability.</p>`,

    pitfalls:
      `<ul>
         <li><b>Great AUC, terrible calibration.</b> Tell: the deck brags "0.99 AUC" and stops there. AUC (Area Under the Curve) only measures <i>ranking</i> — whether positives score above negatives. A model can rank flawlessly yet report 0.9 when the truth is 0.6. Always plot a reliability diagram <i>and</i> report ECE alongside AUC; they answer different questions.</li>
         <li><b>ECE is sensitive to the binning.</b> Expected Calibration Error depends on how many bins you choose and where their edges fall. Too few bins hide miscalibration; too many make each bin noisy. Report the bin count, try both equal-width and equal-count (adaptive) bins, and prefer a proper scoring rule (Brier, log loss) as a binning-free cross-check.</li>
         <li><b>Tiny bins are pure noise.</b> A bin with 3 cases gives an observed frequency of 0%, 33%, 67%, or 100% — never a smooth estimate. Those jumpy points dominate Maximum Calibration Error (MCE) and inflate ECE. Use adaptive (equal-count) bins so every bin has enough cases, or drop bins below a minimum count.</li>
         <li><b>Calibrating on the test set.</b> Fitting Platt scaling or isotonic regression on the same data you then evaluate leaks the answer and reports calibration that is too good. Always fit the recalibrator on a separate calibration split (or cross-validated folds, as <code>CalibratedClassifierCV</code> does) and judge it on untouched test data.</li>
         <li><b>Confusing calibration with sharpness.</b> A model that predicts the base rate (say 0.6) for <i>everyone</i> is perfectly calibrated but useless — it never commits. Good probabilities are both calibrated <i>and</i> sharp (spread toward 0 and 1). Track sharpness (the spread of the predictions) so you do not "fix" calibration by flattening the model into uselessness.</li>
       </ul>`,

    bigIdea:
      `<p><b>Calibration is about honesty, not accuracy.</b> A weather forecaster who says "70% chance of rain" is <i>calibrated</i> if, across all the days she said 70%, it actually rained on about 70% of them. She is right to be unsure — being calibrated does not mean being certain.</p>
       <p>So we group the model's predictions by the confidence it stated. Take every case where it said roughly "70% likely". Then look at reality: of those cases, what fraction actually turned out positive? If that fraction is also about 70%, the model is calibrated <i>there</i>. Do this for every confidence level and you get the whole picture.</p>
       <p>Plot stated confidence on the x-axis and the real fraction on the y-axis. A perfectly honest model sits on the diagonal line $y=x$. Curves above the line mean the model is <i>under</i>-confident; below the line means <i>over</i>-confident.</p>`,

    buildup:
      `<p>We turn that picture into numbers with a few related tools. Each is defined plainly below; here is the map first.</p>
       <ul>
         <li>A <b>reliability diagram</b> is the plot itself: predicted-probability bins vs. observed frequency, against the $y=x$ line.</li>
         <li><b>ECE</b> (Expected Calibration Error) is the average gap between the curve and the diagonal, weighted by how many cases fall in each bin — one summary number.</li>
         <li><b>MCE</b> (Maximum Calibration Error) is the single <i>worst</i> bin's gap — the largest lie the model tells.</li>
         <li><b>Adaptive ECE</b> is the same average gap, but using equal-<i>count</i> bins so each bin has the same number of cases.</li>
         <li>The <b>Brier score</b> grades each probability directly (mean squared error of the probabilities) and splits cleanly into <b>reliability + uncertainty − resolution</b>.</li>
         <li><b>Calibration slope and intercept</b> fit a line to the diagram to say <i>how</i> it is off (over- or under-confident, shifted up or down).</li>
         <li><b>Sharpness</b> measures how decisive the predictions are (their spread).</li>
         <li><b>Proper scoring rules</b> (Brier, log loss) are scores that are best exactly when you report your true belief — they reward calibration and sharpness together.</li>
         <li><b>Recalibration</b> (Platt scaling, isotonic regression) is a small post-fix that bends the scores back onto the diagonal.</li>
       </ul>`,

    symbols: [
      { sym: "$p_i$", desc: "the probability the model predicts for case $i$ (a number from 0 to 1, e.g. 0.7 = '70% likely')." },
      { sym: "$y_i$", desc: "the true outcome for case $i$: 1 if the event happened, 0 if it did not." },
      { sym: "$N$", desc: "the total number of cases being evaluated." },
      { sym: "$B_m$", desc: "the set of cases that fall in bin $m$ — those whose predicted probability lands in that bin's range." },
      { sym: "$|B_m|$", desc: "how many cases are in bin $m$ (its count)." },
      { sym: "$\\mathrm{conf}(B_m)$", desc: "the average predicted probability inside bin $m$ — what the model claimed there." },
      { sym: "$\\mathrm{acc}(B_m)$", desc: "the observed frequency inside bin $m$ — the fraction of those cases that were actually positive ($y=1$)." },
      { sym: "$\\bar{o}$", desc: "the overall base rate — the fraction of all $N$ cases that are positive (Greek-free: just the mean of the $y$ values)." }
    ],

    formula:
      `$$ \\mathrm{ECE}=\\sum_{m=1}^{M}\\frac{|B_m|}{N}\\,\\bigl|\\,\\mathrm{acc}(B_m)-\\mathrm{conf}(B_m)\\,\\bigr| \\qquad \\mathrm{MCE}=\\max_{m}\\bigl|\\,\\mathrm{acc}(B_m)-\\mathrm{conf}(B_m)\\,\\bigr| $$
       $$ \\mathrm{Brier}=\\frac{1}{N}\\sum_{i=1}^{N}(p_i-y_i)^2 \\;=\\; \\underbrace{\\tfrac{1}{N}\\textstyle\\sum_m |B_m|\\,(\\mathrm{conf}(B_m)-\\mathrm{acc}(B_m))^2}_{\\text{reliability}} \\;-\\; \\underbrace{\\tfrac{1}{N}\\textstyle\\sum_m |B_m|\\,(\\mathrm{acc}(B_m)-\\bar{o})^2}_{\\text{resolution}} \\;+\\; \\underbrace{\\bar{o}\\,(1-\\bar{o})}_{\\text{uncertainty}} $$`,

    whatItDoes:
      `<p><b>ECE</b> (Expected Calibration Error) sorts predictions into $M$ bins by stated confidence, measures the gap between claim and reality in each bin, and averages those gaps weighted by bin size. <b>0 is perfect</b>; bigger is worse. It is the single "how dishonest, on average?" number.</p>
       <p><b>MCE</b> (Maximum Calibration Error) reports only the <i>worst</i> bin's gap — useful when even one badly-wrong confidence band is unacceptable (e.g. high-stakes medicine).</p>
       <p><b>Brier score</b> grades each probability directly: it is the mean squared error between the predicted probability and the 0/1 outcome. Lower is better. Its three-part split (Murphy's decomposition) is the deep part:</p>
       <ul>
         <li><b>Reliability</b> — the calibration error (squared, bin-weighted). <i>Smaller is better.</i> This is the part recalibration fixes.</li>
         <li><b>Resolution</b> — how much the bins differ from the base rate, i.e. how well the model separates outcomes. <i>Larger is better</i>, so it is <i>subtracted</i>.</li>
         <li><b>Uncertainty</b> — $\\bar{o}(1-\\bar{o})$, the inherent difficulty of the problem. It depends only on the base rate, not on the model.</li>
       </ul>
       <p>So a low Brier score means small reliability (well calibrated) <i>and</i> high resolution (sharp, informative) — exactly the two things good probabilities need.</p>`,

    derivation:
      `<p><b>Why the reliability gap is the right thing to measure.</b></p>
       <ul class="steps">
         <li>"Calibrated" means: for every confidence level $c$, the true probability of a positive among cases the model rates $c$ is also $c$. In symbols, $P(y=1 \\mid p=c)=c$.</li>
         <li>We cannot read $P(y=1\\mid p=c)$ for every exact $c$, so we <b>bin</b> nearby predictions together. Inside bin $m$, $\\mathrm{conf}(B_m)$ estimates the claimed $c$ and $\\mathrm{acc}(B_m)$ estimates the true $P(y=1\\mid p\\approx c)$.</li>
         <li>The bin's miscalibration is the distance between those two: $|\\mathrm{acc}(B_m)-\\mathrm{conf}(B_m)|$. Averaging it over bins (weighted by $|B_m|/N$) gives ECE; taking the max gives MCE.</li>
         <li><b>Adaptive ECE</b> changes only the binning: instead of equal-width bins ($[0,0.1],[0.1,0.2],\\dots$), use equal-<i>count</i> bins so each holds the same number of cases. This stops a crowded region (say all the near-0 scores) from being summarized by one giant noisy bin.</li>
         <li><b>Brier decomposition.</b> Start from $\\frac1N\\sum(p_i-y_i)^2$. Group the sum by bin, add and subtract $\\bar{o}$ inside each term, and expand the square. The cross terms cancel because $\\mathrm{acc}(B_m)$ is the bin's own mean of $y$. What remains are exactly the three labelled pieces: reliability, minus resolution, plus uncertainty. $\\blacksquare$</li>
         <li><b>Calibration slope & intercept.</b> Fit a logistic regression of the true $y$ on the model's log-odds $\\log\\frac{p}{1-p}$. A perfectly calibrated model gives <b>slope 1, intercept 0</b>. Slope &lt; 1 means over-confident (predictions too extreme); slope &gt; 1 means under-confident; a non-zero intercept means a systematic shift up or down.</li>
       </ul>
       <p><b>Why a proper scoring rule.</b> A scoring rule is <i>proper</i> if your expected score is best exactly when you report your true belief. Brier and log loss are proper; plain accuracy is not (it ignores how confident you were). That is why calibration work is graded with proper scores — they cannot be gamed by lying about confidence, and they reward sharpness and calibration at once.</p>`,

    example:
      `<p>Tiny worked ECE. Ten cases, sorted into two confidence bins. <b>Bin "low" (claimed ~0.20):</b> 5 cases, the model averaged 0.20, and 1 of the 5 was actually positive — so observed frequency = 1/5 = 0.20. <b>Bin "high" (claimed ~0.80):</b> 5 cases, the model averaged 0.80, and 3 of the 5 were positive — observed = 3/5 = 0.60.</p>
       <ul class="steps">
         <li>Low bin gap: $|\\,0.20-0.20\\,|=0.00$. The model is honest here.</li>
         <li>High bin gap: $|\\,0.60-0.80\\,|=0.20$. When it says 80%, only 60% happen — it is over-confident.</li>
         <li>Weight each gap by bin size: both bins hold 5/10 = 0.5 of the cases.</li>
         <li>$\\mathrm{ECE}=0.5\\times0.00+0.5\\times0.20=0.10$. On average the stated confidence is off by 0.10.</li>
         <li>$\\mathrm{MCE}=\\max(0.00,\\,0.20)=0.20$ — the worst bin. To fix it, recalibration would <i>shrink</i> the 0.80 claims toward 0.60.</li>
       </ul>`,

    demo: function (host) {
      var cv = document.createElement("canvas"); cv.width = 640; cv.height = 380; cv.style.maxWidth = "100%"; host.appendChild(cv);
      var ctx = cv.getContext("2d");
      var readout = document.createElement("div"); readout.className = "out"; readout.style.marginTop = "6px";

      function theme() {
        var s = getComputedStyle(document.documentElement);
        var g = function (n, d) { return (s.getPropertyValue(n) || d).trim(); };
        return { ink: g("--ink", "#e6edf3"), dim: g("--ink-dim", "#9aa7b4"), accent: g("--accent", "#4ea1ff"), accent2: g("--accent-2", "#7ee787"), warn: g("--warn", "#ffb454"), border: g("--border", "#2a3340"), panel: g("--panel", "#161c24") };
      }

      // A toy classifier whose raw score is squashed by a temperature.
      // temp > 1 = over-confident (pushed toward 0/1); temp < 1 = under-confident.
      var seed = 7; function rnd() { seed = (seed * 1103515245 + 12345) & 0x7fffffff; return seed / 0x7fffffff; }
      var truth = [], rawp = [];
      for (var i = 0; i < 600; i++) {
        var t = rnd();                       // the TRUE probability for this case
        var y = rnd() < t ? 1 : 0;           // outcome drawn honestly from t
        truth.push(y); rawp.push(t);
      }
      var temp = 2.0; // start over-confident

      function logit(p) { p = Math.min(1 - 1e-6, Math.max(1e-6, p)); return Math.log(p / (1 - p)); }
      function sig(z) { return 1 / (1 + Math.exp(-z)); }
      function pred(p) { return sig(logit(p) * temp); }   // temperature scaling of the honest prob

      var W = 640, H = 380, padL = 52, padR = 18, padT = 18, padB = 44;
      function PX(x) { return padL + x * (W - padL - padR); }
      function PY(y) { return (H - padB) - y * (H - padT - padB); }

      function draw() {
        var c = theme(); ctx.clearRect(0, 0, W, H);
        // bins
        var M = 10, conf = new Array(M).fill(0), acc = new Array(M).fill(0), cnt = new Array(M).fill(0);
        for (var i = 0; i < truth.length; i++) {
          var p = pred(rawp[i]);
          var b = Math.min(M - 1, Math.floor(p * M));
          conf[b] += p; acc[b] += truth[i]; cnt[b]++;
        }
        var ece = 0, mce = 0, brier = 0;
        for (var i2 = 0; i2 < truth.length; i2++) { var pp = pred(rawp[i2]); brier += (pp - truth[i2]) * (pp - truth[i2]); }
        brier /= truth.length;
        var pts = [];
        for (var m = 0; m < M; m++) {
          if (cnt[m] === 0) continue;
          var cf = conf[m] / cnt[m], ac = acc[m] / cnt[m];
          pts.push({ x: cf, y: ac, n: cnt[m] });
          var gap = Math.abs(ac - cf);
          ece += (cnt[m] / truth.length) * gap;
          if (gap > mce) mce = gap;
        }
        // axes
        ctx.strokeStyle = c.border; ctx.lineWidth = 1;
        ctx.beginPath(); ctx.moveTo(PX(0), PY(0)); ctx.lineTo(PX(1), PY(0)); ctx.moveTo(PX(0), PY(0)); ctx.lineTo(PX(0), PY(1)); ctx.stroke();
        // perfect diagonal y = x
        ctx.strokeStyle = c.dim; ctx.setLineDash([5, 4]); ctx.lineWidth = 1.5;
        ctx.beginPath(); ctx.moveTo(PX(0), PY(0)); ctx.lineTo(PX(1), PY(1)); ctx.stroke(); ctx.setLineDash([]);
        // reliability curve
        ctx.strokeStyle = c.accent; ctx.lineWidth = 2.5; ctx.beginPath();
        for (var k = 0; k < pts.length; k++) { var X = PX(pts[k].x), Y = PY(pts[k].y); if (k === 0) ctx.moveTo(X, Y); else ctx.lineTo(X, Y); }
        ctx.stroke();
        for (var k2 = 0; k2 < pts.length; k2++) { ctx.fillStyle = c.warn; ctx.beginPath(); ctx.arc(PX(pts[k2].x), PY(pts[k2].y), 4, 0, Math.PI * 2); ctx.fill(); }
        // labels
        ctx.fillStyle = c.dim; ctx.font = "12px system-ui";
        ctx.fillText("predicted probability", PX(0.34), H - 14);
        ctx.save(); ctx.translate(16, PY(0.3)); ctx.rotate(-Math.PI / 2); ctx.fillText("observed frequency", 0, 0); ctx.restore();
        ctx.fillText("0", PX(0) - 4, H - padB + 16); ctx.fillText("1", PX(1) - 4, H - padB + 16);
        ctx.fillText("perfect (y = x)", PX(0.6), PY(0.66));
        var verdict = temp > 1.05 ? "over-confident (curve sags below the line)" : (temp < 0.95 ? "under-confident (curve bows above the line)" : "well calibrated (hugging the line)");
        readout.innerHTML = "Confidence multiplier (temperature) = <b>" + temp.toFixed(2) + "</b> &rarr; " + verdict + ". ECE = <b>" + ece.toFixed(3) + "</b>, MCE = <b>" + mce.toFixed(3) + "</b>, Brier = <b>" + brier.toFixed(3) + "</b>. Slide toward 1.00 to recalibrate the scores back onto the diagonal.";
      }

      var row = document.createElement("div"); row.style.margin = "10px 0";
      var lab = document.createElement("span"); lab.style.cssText = "color:var(--ink-dim);font-size:13px;margin-right:8px"; lab.textContent = "over-confident ←  temperature  → under-confident";
      var sld = document.createElement("input"); sld.type = "range"; sld.min = "0.5"; sld.max = "3"; sld.step = "0.05"; sld.value = "2"; sld.style.width = "260px"; sld.style.verticalAlign = "middle";
      sld.addEventListener("input", function () { temp = parseFloat(sld.value); draw(); });
      row.appendChild(lab); row.appendChild(document.createElement("br")); row.appendChild(sld);
      host.appendChild(row); host.appendChild(readout);
      draw();
    },

    practice: [
      {
        q: `A model's predictions, grouped into two confidence bins. Bin A: 100 cases, average predicted probability 0.30, 45 actually positive. Bin B: 100 cases, average predicted probability 0.90, 70 actually positive. Compute ECE and MCE.`,
        steps: [
          { do: `Find each bin's observed frequency: $\\mathrm{acc}(A)=45/100=0.45$, $\\mathrm{acc}(B)=70/100=0.70$.`, why: `The observed frequency is reality — the fraction of that bin that turned out positive.` },
          { do: `Find each bin's gap: $|0.45-0.30|=0.15$ for A, $|0.70-0.90|=0.20$ for B.`, why: `The gap is how far the stated confidence is from what actually happened.` },
          { do: `Weight by bin size and average for ECE: each bin holds 100/200 = 0.5 of the cases, so $\\mathrm{ECE}=0.5(0.15)+0.5(0.20)=0.175$.`, why: `ECE weights each bin's gap by how many cases it contains, so crowded bins count more.` },
          { do: `Take the worst bin for MCE: $\\mathrm{MCE}=\\max(0.15,0.20)=0.20$.`, why: `MCE reports the single largest miscalibration, here bin B at 0.20.` }
        ],
        answer: `ECE = 0.175 and MCE = 0.20. Bin A is under-confident (says 0.30, reality 0.45); bin B is over-confident (says 0.90, reality 0.70).`
      },
      {
        q: `A spam filter has AUC (Area Under the Curve) = 0.98 but its calibration curve sags far below the diagonal. A teammate says "AUC is high, so the 0.95 spam scores are trustworthy — auto-delete them." Why is that wrong, and what would you do?`,
        steps: [
          { do: `Separate what each metric measures: AUC grades only ranking — whether spam outscores ham. It says nothing about whether "0.95" means a 95% chance.`, why: `A model can rank perfectly yet attach systematically inflated probabilities.` },
          { do: `Read the reliability diagram: the curve sagging below $y=x$ means over-confidence — cases the model calls 0.95 are positive far less than 95% of the time.`, why: `Below the diagonal, observed frequency is lower than the claimed probability.` },
          { do: `Recalibrate on held-out data with Platt scaling (sigmoid) or isotonic regression, then re-check ECE and the reliability curve on the test set.`, why: `Recalibration bends the scores back toward the diagonal without disturbing the ranking, so AUC is preserved while the probabilities become honest.` }
        ],
        answer: `High AUC only proves good ranking, not honest probabilities. The auto-delete threshold relies on the <i>value</i> 0.95 meaning 95%, which the sagging curve disproves. Recalibrate (Platt / isotonic) on a separate split, confirm ECE drops and the curve hugs $y=x$, then set the threshold from the calibrated scores.`
      },
      {
        q: `A model predicts the base rate 0.60 for every single case. Is it calibrated? Is it useful? What metric exposes the problem?`,
        steps: [
          { do: `Check calibration: every prediction is 0.60, and across all those cases 60% are positive, so the gap is zero in the one occupied bin — it is perfectly calibrated.`, why: `Calibration only asks that stated confidence match observed frequency, which this trivially satisfies.` },
          { do: `Check usefulness: it never distinguishes one case from another, so it cannot drive any decision. It has zero sharpness (no spread in its predictions).`, why: `Sharpness measures how decisive predictions are; a constant output has none.` },
          { do: `Use the Brier decomposition: reliability is 0 (calibrated) but resolution is also 0 (the bins never differ from the base rate), so the Brier score is just the uncertainty $\\bar{o}(1-\\bar{o})=0.6\\times0.4=0.24$.`, why: `Resolution rewards separating outcomes; a constant model earns none, exposing the uselessness that calibration alone hides.` }
        ],
        answer: `Yes, perfectly calibrated, but useless. Calibration alone cannot see this. The Brier score's resolution term (and sharpness) is 0, revealing that the model never commits — good probabilities must be calibrated <i>and</i> sharp.`
      }
    ]
  });

  window.CODE["met-calibration"] = {
    lib: "scikit-learn",
    runnable: false,
    explain: `<p>The real calibration toolkit: <code>calibration_curve</code> builds the reliability diagram, <code>brier_score_loss</code> gives a proper score, <code>CalibratedClassifierCV</code> recalibrates with isotonic or sigmoid (Platt) scaling, and a tiny from-scratch function computes ECE / MCE so you can see exactly what they sum up.</p>`,
    code: `import numpy as np
from sklearn.datasets import load_breast_cancer
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
from sklearn.calibration import calibration_curve, CalibratedClassifierCV
from sklearn.metrics import brier_score_loss, roc_auc_score

X, y = load_breast_cancer(return_X_y=True)
Xtr, Xte, ytr, yte = train_test_split(X, y, test_size=0.4,
                                       random_state=42, stratify=y)

# A shallow random forest: a good RANKER but a poor PROBABILITY estimator.
clf = RandomForestClassifier(n_estimators=50, max_depth=4,
                             random_state=0).fit(Xtr, ytr)
p = clf.predict_proba(Xte)[:, 1]          # predicted P(class = 1)

# --- reliability diagram: stated confidence vs observed frequency ---
frac_pos, mean_pred = calibration_curve(yte, p, n_bins=10, strategy="uniform")
# strategy="quantile" gives ADAPTIVE (equal-count) bins instead.

# --- from-scratch Expected / Maximum Calibration Error ---
def ece_mce(y_true, prob, n_bins=10):
    edges = np.linspace(0.0, 1.0, n_bins + 1)
    N = len(prob); ece = 0.0; mce = 0.0
    for i in range(n_bins):
        lo, hi = edges[i], edges[i + 1]
        in_bin = (prob > lo) & (prob <= hi) if i > 0 else (prob >= lo) & (prob <= hi)
        if in_bin.sum() == 0:
            continue
        conf = prob[in_bin].mean()          # average claimed probability
        acc = y_true[in_bin].mean()         # observed positive frequency
        gap = abs(acc - conf)
        ece += (in_bin.sum() / N) * gap     # size-weighted average gap
        mce = max(mce, gap)                 # worst single bin
    return ece, mce

ece, mce = ece_mce(yte, p)
print("AUC :", round(roc_auc_score(yte, p), 4))          # ranking quality
print("ECE :", round(ece, 4), " MCE:", round(mce, 4))    # calibration
print("Brier (proper score):", round(brier_score_loss(yte, p), 4))

# --- recalibration: fit ON HELD-OUT FOLDS, judge on the test set ---
for method in ["isotonic", "sigmoid"]:   # isotonic = monotone fit; sigmoid = Platt
    cal = CalibratedClassifierCV(
        RandomForestClassifier(n_estimators=50, max_depth=4, random_state=0),
        method=method, cv=5).fit(Xtr, ytr)
    pc = cal.predict_proba(Xte)[:, 1]
    e, _ = ece_mce(yte, pc)
    print(method, "-> ECE:", round(e, 4),
          " Brier:", round(brier_score_loss(yte, pc), 4),
          " AUC:", round(roc_auc_score(yte, pc), 4))  # AUC barely moves`
  };

  window.CODEVIZ["met-calibration"] = {
    question: "Take 20 predictions binned by stated confidence (0.10, 0.30, 0.50, 0.70, 0.90). When the model says \"0.90\", do 90% actually turn out positive? The first four diagrams read off the formulas from this exact set; the last two show the OTHER reliability shapes you will meet — an under-confident model and a flat one that is calibrated yet useless.",
    charts: [
      {
        type: "line",
        title: "Reliability diagram: conf(Bm) vs acc(Bm), against the perfect y = x line",
        xlabel: "mean predicted probability in bin = conf(Bm)",
        ylabel: "observed fraction positive = acc(Bm)",
        series: [
          { name: "perfect (y = x)", color: "#9aa7b4", points: [[0.0, 0.0], [1.0, 1.0]] },
          { name: "model (20 cases, 5 bins)", color: "#4ea1ff", points: [[0.1, 0.0], [0.3, 0.5], [0.5, 0.5], [0.7, 0.75], [0.9, 0.8]] }
        ],
        interpret: "The x-axis is what the model claimed (its average predicted probability in each bin); the y-axis is what actually happened (the fraction of those cases that were positive). The grey diagonal is perfect honesty. The blue model curve <b>sits below the diagonal</b> at the high end — at claim 0.90 reality is only 0.80, at claim 0.70 reality is 0.75. Below the line means <b>over-confident</b>: it states bigger numbers than the outcomes justify. Read the vertical gap to the diagonal as the lie at each confidence level."
      },
      {
        type: "bars",
        title: "ECE = sum (|Bm|/N) |acc-conf|: per-bin weighted gaps add to ECE 0.090; MCE = tallest raw gap 0.20",
        labels: ["0.0-0.2", "0.2-0.4", "0.4-0.6", "0.6-0.8", "0.8-1.0"],
        values: [0.015, 0.040, 0.000, 0.010, 0.025],
        valueLabels: ["0.015", "0.040", "0.000", "0.010", "0.025"],
        colors: ["#4ea1ff", "#ff7b72", "#9aa7b4", "#4ea1ff", "#ffb454"],
        interpret: "Each bar is one confidence bin's contribution to ECE: its raw gap times its share of the cases. Crowded bins with big gaps dominate; the empty-gap 0.4-0.6 bin contributes nothing (grey). Add all five bars and you get <b>ECE = 0.090</b> — the average dishonesty across the whole set. This is the single number to quote, but it hides which bin is worst (next chart)."
      },
      {
        type: "bars",
        title: "Raw bin gaps |acc(Bm)-conf(Bm)|: MCE = max = 0.20 (bin 0.2-0.4, the worst lie)",
        labels: ["0.0-0.2", "0.2-0.4", "0.4-0.6", "0.6-0.8", "0.8-1.0"],
        values: [0.10, 0.20, 0.00, 0.05, 0.10],
        valueLabels: ["0.10", "0.20 (MCE)", "0.00", "0.05", "0.10"],
        colors: ["#9aa7b4", "#ff7b72", "#9aa7b4", "#9aa7b4", "#9aa7b4"],
        interpret: "Same five bins, but now the <b>unweighted</b> gap in each — how far that bin's claim was from reality, ignoring how many cases it held. <b>MCE is just the tallest bar</b> (red, the 0.2-0.4 bin at 0.20): the single worst confidence band. Use MCE when even one badly-wrong band is unacceptable (high-stakes medicine); use ECE when you care about the average."
      },
      {
        type: "bars",
        title: "Brier 0.190 = reliability - resolution + uncertainty (Murphy decomposition)",
        labels: ["reliability", "resolution", "uncertainty", "Brier total"],
        values: [0.0125, -0.070, 0.2475, 0.190],
        valueLabels: ["+0.0125", "-0.070", "+0.2475", "= 0.190"],
        colors: ["#ff7b72", "#7ee787", "#9aa7b4", "#4ea1ff"],
        interpret: "The Brier score (mean squared error of the probabilities) splits into three parts. <b>Reliability</b> (red, +0.0125) is the calibration error — small is good, and this is the part recalibration fixes. <b>Resolution</b> (green, plotted negative because it is SUBTRACTED) rewards a model for spreading cases apart from the base rate — bigger is better. <b>Uncertainty</b> (grey, +0.2475) is fixed by the base rate alone, nothing the model can change. They sum to the blue total 0.190: a good score needs small reliability AND large resolution."
      },
      {
        type: "line",
        title: "Variant — under-confident model: reliability curve bows ABOVE the diagonal (illustrative)",
        xlabel: "mean predicted probability in bin = conf(Bm)",
        ylabel: "observed fraction positive = acc(Bm)",
        series: [
          { name: "perfect (y = x)", color: "#9aa7b4", points: [[0.0, 0.0], [1.0, 1.0]] },
          { name: "under-confident model", color: "#7ee787", points: [[0.1, 0.28], [0.3, 0.45], [0.5, 0.6], [0.7, 0.78], [0.9, 0.95]] }
        ],
        interpret: "Illustrative — the mirror image of the over-confident case. The curve <b>bows above the diagonal</b>: when the model says 0.10, the event actually happens 28% of the time; when it says 0.50, reality is 0.60. It is too timid — its probabilities are squeezed toward the middle. Recognise it by a curve above y = x. Fixing it (e.g. with temperature below 1, or isotonic regression) <b>stretches</b> the scores back out toward 0 and 1."
      },
      {
        type: "line",
        title: "Variant — calibrated but useless: every prediction is the base rate 0.60 (illustrative)",
        xlabel: "mean predicted probability in bin = conf(Bm)",
        ylabel: "observed fraction positive = acc(Bm)",
        series: [
          { name: "perfect (y = x)", color: "#9aa7b4", points: [[0.0, 0.0], [1.0, 1.0]] },
          { name: "constant model (single point)", color: "#ffb454", points: [[0.6, 0.6]] }
        ],
        interpret: "Illustrative. A model that predicts the base rate 0.60 for EVERY case lands as <b>one lonely dot</b> sitting exactly on the diagonal — so ECE and the reliability gap are zero, perfectly calibrated. But there is only one point because the model never varies: it has <b>zero sharpness and zero resolution</b>, so it can drive no decision. Calibration alone cannot expose this; the Brier resolution term (and sharpness) catches it. Good probabilities must be calibrated AND spread out."
      }
    ],
    caption: "No — at conf 0.90 only 80% are positive (gap 0.10), and the 0.30 bin is the worst at 0.20. The first four charts use the exact 20-case set: the reliability curve sags below y = x (over-confident), the weighted per-bin gaps sum to ECE = 0.090, the worst raw gap gives MCE = 0.20, and the Brier 0.190 splits as reliability 0.0125 minus resolution 0.070 plus uncertainty 0.2475. The last two are the OTHER shapes to recognise: an under-confident curve that bows above the diagonal, and a flat constant model that is perfectly calibrated yet useless (no sharpness). Each chart's interpret box says how to read it and what to conclude.",
    code: `import numpy as np

# A concrete 20-case set, constant predicted prob per bin so the binned
# Murphy decomposition reproduces the direct Brier score exactly.
# (predicted prob, count, number actually positive)
bins = [(0.10, 3, 0),   # claims 0.10 -> 0/3 positive, obs 0.00
        (0.30, 4, 2),   # claims 0.30 -> 2/4 positive, obs 0.50
        (0.50, 4, 2),   # claims 0.50 -> 2/4 positive, obs 0.50
        (0.70, 4, 3),   # claims 0.70 -> 3/4 positive, obs 0.75
        (0.90, 5, 4)]   # claims 0.90 -> 4/5 positive, obs 0.80

p = np.concatenate([[b[0]] * b[1] for b in bins])
y = np.concatenate([[1] * b[2] + [0] * (b[1] - b[2]) for b in bins]).astype(float)
N = len(p)                                    # 20

conf = np.array([b[0] for b in bins])         # claimed prob per bin
cnt  = np.array([b[1] for b in bins])
acc  = np.array([b[2] / b[1] for b in bins])  # observed frequency per bin
gap  = np.abs(acc - conf)                      # |acc - conf|

ece = np.sum((cnt / N) * gap)                 # size-weighted average gap
mce = gap.max()                               # worst single bin
print("per-bin weighted gaps:", np.round((cnt / N) * gap, 4))
print("ECE:", round(ece, 4), " MCE:", round(mce, 4))   # 0.09, 0.20

brier = np.mean((p - y) ** 2)                 # direct proper score
obar  = y.mean()                              # base rate 0.55
reliability = np.sum(cnt * (conf - acc) ** 2) / N
resolution  = np.sum(cnt * (acc - obar) ** 2) / N
uncertainty = obar * (1 - obar)
print("Brier:", round(brier, 4))                       # 0.190
print("= reliability", round(reliability, 4),          # 0.0125
      "- resolution", round(resolution, 4),            # 0.070
      "+ uncertainty", round(uncertainty, 4))          # 0.2475
print("decomp:", round(reliability - resolution + uncertainty, 4))  # 0.190`
  };
})();
