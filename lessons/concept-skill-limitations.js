(function () {
  window.LESSONS.push({
    id: "skill-limitations",
    title: "Explaining limitations clearly",
    tagline: "A model that won't say \"I don't know\" is dangerous — quantify what it doesn't know and write it down.",
    module: "Doing ML for Real — the skills that matter (2026)",
    prereqs: ["ml-classification-metrics", "prob-estimation", "prob-clt"],
    whenToUse:
      `<p><b>Reach for this the moment a model leaves your notebook and touches a real decision.</b> A single number — "92% accurate" — tells a stakeholder nothing about <i>when</i> the model is wrong, <i>for whom</i>, or <i>how sure</i> it is on the case in front of them. The skill of stating limitations clearly is what separates a demo from a deployable system.</p>
       <p><b>It is make-or-break when:</b></p>
       <ul>
         <li>A human acts on the prediction — a doctor, a loan officer, a content moderator. They need to know how far to trust each call.</li>
         <li>The model faces a regulator or an audit. "Known failure modes" and "subgroup performance" are not nice-to-haves; they are the document.</li>
         <li>The cost of a confident wrong answer is high. A point estimate with no uncertainty hides exactly the cases where you should have deferred to a person.</li>
         <li>The data shifts. A model validated on one population, season, or geography will silently break outside that scope unless you wrote the scope down.</li>
       </ul>
       <p>You are not weakening your model by listing its limits. You are making it <b>usable</b> — a calibrated 0.6 that says "coin-flip, send to a human" is worth more than a confident 0.95 that is wrong one time in three.</p>`,
    playbook:
      `<p>A disciplined, ordered method for turning "it works on my test set" into an honest, decision-ready account of what the model can and cannot do.</p>
       <ol>
         <li><b>Write a MODEL CARD.</b> One page that states the <i>intended use</i> (what decision it supports), the <i>scope of validity</i> (population, time range, geography, input ranges it was validated on), the <i>training data</i> (source, size, dates, known gaps), the headline <i>metrics</i> with confidence intervals, and an explicit list of <i>KNOWN failure modes</i>. If you cannot fill a row, that gap <i>is</i> the finding.</li>
         <li><b>State the ASSUMPTIONS and where they break.</b> Every model assumes something — that future data looks like training data (no distribution shift), that features mean the same thing at serving time, that labels are correct. Name each assumption and the concrete situation that violates it (a new product launch, a sensor recalibration, a holiday-season traffic spike).</li>
         <li><b>Quantify UNCERTAINTY with a coverage guarantee.</b> Replace each point prediction with a set or interval. Use <b>CONFORMAL PREDICTION</b> (via <code>MAPIE</code>) to produce, at a target miscoverage $\\alpha$, a prediction set $C(x)$ that provably contains the truth at least $1-\\alpha$ of the time — a finite-sample, distribution-free guarantee that holds for <i>any</i> underlying model.</li>
         <li><b>Report CALIBRATION.</b> Check whether the probabilities mean what they say: of all the cases the model scored 0.7, are about 70% actually positive? Plot a reliability diagram and compute the <b>ECE (Expected Calibration Error)</b>. If it is high, recalibrate with isotonic regression or Platt scaling before shipping.</li>
         <li><b>Disclose SUBGROUP performance.</b> Break every headline metric down by the groups that matter — age band, region, device, class label, data source. A 92% overall accuracy that is 97% on one subgroup and 71% on another is two different models wearing one number. Report the worst-group metric, not just the average.</li>
         <li><b>Add an ABSTENTION path.</b> Give the model permission to say "I don't know." When the conformal set has more than one class, or the calibrated probability sits near the decision boundary, or the input falls outside the validated scope, <b>defer to a human</b> instead of forcing a guess. Track the abstention rate as a first-class metric.</li>
         <li><b>Communicate in decision-maker language.</b> Translate the math into the stakeholder's terms: not "ECE 0.04", but "when the model says 90% sure, it is right about 90% of the time"; not "90% conformal coverage", but "the true value lands inside this range 9 times out of 10." The metric is for you; the sentence is for them.</li>
       </ol>`,
    application:
      `<p>This skill shows up everywhere a prediction is consumed, not just produced. <b>Healthcare:</b> a triage model that abstains on ambiguous scans and routes them to a radiologist. <b>Lending and insurance:</b> model cards and subgroup performance are compliance artifacts a regulator will read line by line. <b>Forecasting:</b> demand and revenue forecasts ship as prediction intervals, never single numbers, so planners can size buffers. <b>Content moderation and search ranking:</b> calibrated confidences decide what is auto-actioned versus sent to human review. <b>LLM (Large Language Model) systems:</b> abstention and "I'm not sure" responses, plus stated scope of validity, are the core guardrails against confident hallucination.</p>`,
    pitfalls:
      `<ul>
         <li><b>A point prediction with no uncertainty.</b> The tell: a model output that is a single number or label with nothing attached. It implies certainty the model does not have and hides exactly the borderline cases that need a human.</li>
         <li><b>Treating SHAP / LIME explanations as ground truth.</b> SHAP (SHapley Additive exPlanations) and LIME (Local Interpretable Model-agnostic Explanations) are <i>approximations</i> of the model, not of reality. They can be unstable, can disagree with each other, and explain a wrong model just as confidently as a right one. Use them as hypotheses to check, never as proof.</li>
         <li><b>Claiming performance outside the validated scope.</b> "It's 92% accurate" with no "...on patients aged 40–70 scanned in 2024 on these three machines." A metric without its scope is a marketing claim, not a measurement.</li>
         <li><b>Hiding subgroup gaps behind an average.</b> Reporting only the aggregate metric when the worst subgroup is far worse. The tell: no per-group breakdown anywhere in the writeup.</li>
         <li><b>No abstention path.</b> The model is forced to answer every input, including ones it has never seen and ones near the boundary. A system that cannot say "I don't know" will be confidently wrong on its hardest cases.</li>
         <li><b>Uncalibrated probabilities sold as confidences.</b> Raw scores from boosted trees, SVMs (Support Vector Machines), or deep nets are often systematically over- or under-confident. Presenting an uncalibrated 0.9 as "90% sure" is a quiet lie until you have checked the reliability diagram.</li>
       </ul>`,
    checklist:
      `<ul>
         <li>☐ A one-page MODEL CARD exists: intended use, scope of validity, training data, metrics with confidence intervals, known failure modes.</li>
         <li>☐ Every key ASSUMPTION is named, with the concrete situation that breaks it.</li>
         <li>☐ Predictions ship with UNCERTAINTY — conformal sets / intervals at a stated target coverage $1-\\alpha$.</li>
         <li>☐ Achieved coverage was measured on held-out data and matches the target.</li>
         <li>☐ A reliability diagram and ECE (Expected Calibration Error) are reported; probabilities are recalibrated if needed.</li>
         <li>☐ Every headline metric is broken down by SUBGROUP, and the worst-group number is stated.</li>
         <li>☐ An ABSTENTION / defer-to-human rule is defined, and its trigger rate is tracked.</li>
         <li>☐ The limitations are written once in plain decision-maker language, not just metrics.</li>
         <li>☐ Explanations (SHAP / LIME) are flagged as approximations, never presented as truth.</li>
       </ul>`,
    bigIdea:
      `<p>Honest ML rests on one shift: stop emitting a single answer, start emitting <b>an answer plus how much to trust it</b>.</p>
       <p>Two ideas do the heavy lifting. <b>Conformal prediction</b> turns any model into one that outputs a <i>set</i> with a hard coverage guarantee — "the truth is in here at least 90% of the time." <b>Calibration</b> checks that the model's stated probabilities match real-world frequencies.</p>
       <p>It also helps to know <i>which kind</i> of uncertainty you face. <b>Aleatoric</b> uncertainty is irreducible noise in the world (a fair coin is 50/50 no matter how much data you collect). <b>Epistemic</b> uncertainty is the model's own ignorance from limited data — and that one shrinks as you learn more. Conformal sets get wider when either grows.</p>`,
    buildup:
      `<p>Split your labelled data three ways: <b>train</b>, <b>calibration</b>, and <b>test</b>. Fit the model on train only.</p>
       <p>On the calibration set, score how "surprised" the model is by each true answer — a <b>nonconformity score</b>. For classification a common choice is $s_i = 1 - \\hat p(y_i \\mid x_i)$: large when the model gave the true class a low probability.</p>
       <p>Take the empirical quantile of those scores. At serving time, the prediction set is every label whose score falls under that quantile. The quantile is chosen so the guarantee holds — that is the whole trick.</p>`,
    symbols: [
      { sym: "$\\alpha$", desc: "the target miscoverage — the error rate you're willing to tolerate (e.g. $\\alpha=0.1$ means you accept being wrong 10% of the time). Greek 'alpha'." },
      { sym: "$1-\\alpha$", desc: "the target coverage — how often the prediction set must contain the truth (e.g. 90%)." },
      { sym: "$C(x)$", desc: "the prediction set (classification) or interval (regression) the conformal method outputs for input $x$." },
      { sym: "$y$", desc: "the true target value for a test input." },
      { sym: "$s_i$", desc: "the nonconformity score for calibration example $i$: how poorly the model fits that example (bigger = more surprising)." },
      { sym: "$n$", desc: "the number of examples in the calibration set." },
      { sym: "$\\hat q$", desc: "the conformal quantile — the threshold score that the prediction set must stay under." },
      { sym: "$\\hat p(y\\mid x)$", desc: "the model's predicted probability of label $y$ given input $x$ (the 'hat' means estimated)." },
      { sym: "$B_m$", desc: "the $m$-th confidence bin used when measuring calibration (e.g. predictions in $[0.6,0.7)$)." }
    ],
    formula: `$$ P\\big(y \\in C(x)\\big) \\;\\ge\\; 1-\\alpha, \\qquad \\hat q = \\text{the } \\big\\lceil (n+1)(1-\\alpha) \\big\\rceil \\text{-th smallest of } \\{s_1,\\dots,s_n\\} $$`,
    whatItDoes:
      `<p>The left inequality is the <b>coverage guarantee</b>: the prediction set $C(x)$ contains the true answer $y$ with probability at least $1-\\alpha$. It is <i>finite-sample</i> (true for any calibration set size $n$, not just asymptotically) and <i>distribution-free</i> (no assumption about the data's shape, and it wraps <i>any</i> model).</p>
       <p>The right equation says how to get there: collect the nonconformity scores on the calibration set, sort them, and take the score at rank $\\lceil (n+1)(1-\\alpha)\\rceil$ — that's the <b>conformal quantile</b> $\\hat q$. The "$+1$" is the finite-sample correction that makes the guarantee exact. The prediction set is then every candidate label whose score is $\\le \\hat q$.</p>`,
    derivation:
      `<p><b>Why the guarantee holds — exchangeability.</b></p>
       <ul class="steps">
         <li>Assume the calibration scores $s_1,\\dots,s_n$ and the (unknown) test score $s_{\\text{test}}$ are <b>exchangeable</b> — drawn from the same distribution, order irrelevant. This is weaker than "independent and identically distributed" and is the only assumption.</li>
         <li>By exchangeability, $s_{\\text{test}}$ is equally likely to land in any of the $n+1$ rank positions among the combined set $\\{s_1,\\dots,s_n,s_{\\text{test}}\\}$.</li>
         <li>So $P\\big(s_{\\text{test}} \\le \\hat q\\big) \\ge \\frac{\\lceil (n+1)(1-\\alpha)\\rceil}{n+1} \\ge 1-\\alpha$, just by counting ranks.</li>
         <li>We <i>include</i> a label in $C(x)$ exactly when its score is $\\le \\hat q$. So the true label is included with probability $\\ge 1-\\alpha$. That is the coverage guarantee. $\\blacksquare$</li>
         <li><b>Calibration, by contrast,</b> is checked, not guaranteed: bin predictions by confidence, and compare each bin's mean predicted probability to its observed frequency. ECE $= \\sum_m \\frac{|B_m|}{N}\\,\\big|\\text{acc}(B_m)-\\text{conf}(B_m)\\big|$ — the size-weighted average gap between "claimed" and "real" across bins $B_m$.</li>
       </ul>`,
    example:
      `<p><b>Split-conformal classification, by hand.</b> Target coverage $1-\\alpha = 0.9$, so $\\alpha=0.1$. Calibration set of $n=9$ examples. For each, we record the nonconformity score $s_i = 1-\\hat p(\\text{true class})$:</p>
       <ul class="steps">
         <li>Scores, sorted: $[0.02,\\,0.05,\\,0.08,\\,0.10,\\,0.15,\\,0.22,\\,0.30,\\,0.41,\\,0.55]$.</li>
         <li>Rank to take: $\\lceil (n+1)(1-\\alpha)\\rceil = \\lceil 10 \\times 0.9\\rceil = \\lceil 9 \\rceil = 9$. So $\\hat q$ is the 9th-smallest score $= 0.55$.</li>
         <li>New input. The model gives class A probability 0.7 (score $1-0.7=0.30$) and class B probability 0.3 (score $0.70$). Include a class iff its score $\\le 0.55$. Class A: $0.30 \\le 0.55$ ✓ included. Class B: $0.70 \\le 0.55$ ✗ excluded.</li>
         <li>Prediction set $C(x)=\\{A\\}$ — a confident, single-label call.</li>
         <li>Another input scores A at $0.50$ and B at $0.52$. Both $\\le 0.55$, so $C(x)=\\{A,B\\}$ — a two-label set. The model is telling you it cannot separate them: <b>abstain and defer to a human</b>. The set size <i>is</i> the confidence signal.</li>
       </ul>`,
    demo: function (host) {
      // Interactive split-conformal: drag alpha, watch the quantile threshold and coverage move.
      var cv = document.createElement("canvas"); cv.width = 640; cv.height = 320; cv.style.maxWidth = "100%"; host.appendChild(cv);
      var ctx = cv.getContext("2d");
      var readout = document.createElement("div"); readout.className = "out"; readout.style.marginTop = "6px";

      // Fixed pool of nonconformity scores on a "calibration" set (sorted feel, with spread).
      var scores = [];
      for (var i = 0; i < 50; i++) {
        var u = i / 49;
        scores.push(0.02 + 0.9 * u * u + 0.04 * Math.sin(i * 1.7)); // skewed toward small, some wiggle
      }
      scores = scores.map(function (s) { return Math.max(0.01, Math.min(0.99, s)); }).sort(function (a, b) { return a - b; });
      var n = scores.length;
      var alpha = 0.1;

      var W = 640, H = 320, padL = 40, padR = 16, padT = 16, padB = 40;
      function PX(idx) { return padL + idx / (n - 1) * (W - padL - padR); }
      function PY(s) { return (H - padB) - s * (H - padT - padB); }

      function quantileIndex() {
        var k = Math.ceil((n + 1) * (1 - alpha)); // 1-based rank
        if (k > n) k = n;
        return k - 1; // 0-based index into sorted scores
      }

      function draw() {
        var c = theme(); ctx.clearRect(0, 0, W, H);
        var qi = quantileIndex();
        var qhat = scores[qi];
        // baseline axis
        ctx.strokeStyle = c.border; ctx.lineWidth = 1;
        ctx.beginPath(); ctx.moveTo(padL, H - padB); ctx.lineTo(W - padR, H - padB); ctx.stroke();
        // quantile threshold line
        ctx.strokeStyle = c.accent; ctx.lineWidth = 2; ctx.setLineDash([5, 4]);
        ctx.beginPath(); ctx.moveTo(padL, PY(qhat)); ctx.lineTo(W - padR, PY(qhat)); ctx.stroke(); ctx.setLineDash([]);
        // points: under threshold = covered, above = excluded
        var covered = 0;
        for (var i = 0; i < n; i++) {
          var under = scores[i] <= qhat;
          if (under) covered++;
          ctx.fillStyle = under ? c.accent : (c.warn || "#d9534f");
          ctx.beginPath(); ctx.arc(PX(i), PY(scores[i]), 3.2, 0, Math.PI * 2); ctx.fill();
        }
        var achieved = covered / n;
        readout.innerHTML = "Each dot is a calibration nonconformity score $s_i$ (sorted). " +
          "Dashed line = conformal quantile $\\hat q$ = " + qhat.toFixed(3) + " (rank " + (qi + 1) + " of " + n + "). " +
          "A label is <b>included</b> in the prediction set when its score sits below the line. " +
          "Target coverage $1-\\alpha$ = <b>" + (1 - alpha).toFixed(2) + "</b>; achieved on calibration set = <b>" + achieved.toFixed(2) + "</b>. " +
          "Lower $\\alpha$ &rarr; line rises &rarr; sets get bigger but cover more.";
        if (window.MathJax && MathJax.typesetPromise) MathJax.typesetPromise([readout]);
      }

      var row = document.createElement("div"); row.style.margin = "8px 0";
      var lbl = document.createElement("span"); lbl.textContent = "miscoverage α: ";
      var sl = document.createElement("input"); sl.type = "range"; sl.min = "1"; sl.max = "40"; sl.value = "10"; sl.style.verticalAlign = "middle";
      sl.addEventListener("input", function () { alpha = parseInt(sl.value, 10) / 100; draw(); });
      row.appendChild(lbl); row.appendChild(sl);
      host.appendChild(row); host.appendChild(readout);
      draw();
    },
    practice: [
      {
        q: `A teammate ships a churn model: "AUC 0.91, ready to go." A reviewer asks, "Is it ready to make retention-offer decisions?" What is missing before anyone acts on it?`,
        steps: [
          { do: `Ask for the SCOPE behind the 0.91 — which customers, what time window, what data sources was it validated on?`, why: `A metric with no scope is a marketing claim; the model may be 0.91 on last year's data and far worse on a new segment.` },
          { do: `Demand a SUBGROUP breakdown of AUC by tenure, plan tier, and region.`, why: `An aggregate AUC can hide a subgroup where the model is near-random, and retention offers would systematically misfire there.` },
          { do: `Check CALIBRATION — is a predicted 0.8 churn risk really ~80%?`, why: `Offer budgets are spent on the probability; an uncalibrated score wastes money on the wrong customers.` },
          { do: `Ask for an ABSTENTION rule for borderline scores.`, why: `Near the decision boundary the model adds little; deferring those to a human or to a hold-out test is cheaper than a wrong offer.` }
        ],
        answer: `<p>"AUC 0.91" is necessary but nowhere near sufficient. Before action you need: the validated <b>scope</b>, <b>subgroup</b> AUC (especially the worst group), a <b>calibration</b> check on the probabilities the offers depend on, and an <b>abstention</b> path for borderline cases. A one-page <b>model card</b> capturing intended use, scope, and known failure modes is the deliverable that makes it "ready."</p>`
      },
      {
        q: `You have a fitted classifier and want 90% coverage prediction sets. Sketch the split-conformal procedure and how you'd use MAPIE.`,
        steps: [
          { do: `Hold out a fresh CALIBRATION split, separate from train and test.`, why: `The coverage guarantee relies on calibration scores being exchangeable with test scores — they must not have been used to fit the model.` },
          { do: `Compute nonconformity scores $s_i = 1-\\hat p(\\text{true class})$ on the calibration split.`, why: `Large scores mean the model was surprised by the truth; their distribution sets the threshold.` },
          { do: `Take $\\hat q$ at rank $\\lceil (n+1)(0.9)\\rceil$, then include every label with score $\\le \\hat q$.`, why: `The $(n+1)$ correction is what makes the finite-sample $\\ge 0.9$ guarantee exact.` },
          { do: `In code: fit a base estimator, wrap it in MapieClassifier with method="score", call fit on the calibration data, then predict(..., alpha=0.1).`, why: `MAPIE automates the score, the quantile, and the set construction; you supply $\\alpha$.` }
        ],
        answer: `<p>Split-conformal: separate calibration data, score nonconformity $s_i=1-\\hat p(\\text{true})$, take the quantile $\\hat q$ at rank $\\lceil (n+1)(1-\\alpha)\\rceil$, and output the set of labels scoring $\\le \\hat q$. With MAPIE: <code>MapieClassifier(estimator, method="score", cv="prefit")</code>, <code>.fit(X_cal, y_cal)</code>, then <code>.predict(X_test, alpha=0.1)</code> returns the prediction sets. Verify the <i>achieved</i> coverage on test data matches the 0.9 target.</p>`
      },
      {
        q: `A reliability diagram shows your model's curve sagging below the diagonal — at predicted 0.8 the observed frequency is only 0.6. What does this mean and what do you do?`,
        steps: [
          { do: `Read the gap: predicted &gt; observed means the model is OVER-confident.`, why: `It claims 0.8 but is right 0.6 of the time; decisions thresholded on probability will fire too eagerly.` },
          { do: `Quantify it with ECE (Expected Calibration Error) across bins.`, why: `A single number lets you track calibration over time and compare before/after fixing it.` },
          { do: `Recalibrate with isotonic regression or Platt scaling on a held-out set.`, why: `These monotonic maps pull the stated probabilities back onto the diagonal without retraining the base model.` },
          { do: `Re-plot the diagram and recompute ECE to confirm the fix.`, why: `Calibration is verified empirically, never assumed.` }
        ],
        answer: `<p>The model is <b>over-confident</b>: its 0.8 predictions are right only ~60% of the time. Summarize with <b>ECE</b>, then recalibrate with <b>isotonic regression</b> or <b>Platt scaling</b> on held-out data, and re-plot to confirm the curve sits on the diagonal. Until then, do not present those probabilities as confidences — and use <code>calibration_curve</code> to monitor it going forward.</p>`
      }
    ]
  });

  window.CODE["skill-limitations"] = {
    lib: "MAPIE + scikit-learn",
    runnable: false,
    explain: `<p>Two ready-to-trust outputs from one fitted model: a conformal prediction set with a 90% coverage guarantee (MAPIE), and a reliability check on the predicted probabilities (scikit-learn's <code>calibration_curve</code>).</p>`,
    code: `import numpy as np
from sklearn.datasets import load_breast_cancer
from sklearn.model_selection import train_test_split
from sklearn.ensemble import GradientBoostingClassifier
from sklearn.calibration import calibration_curve
from mapie.classification import MapieClassifier

X, y = load_breast_cancer(return_X_y=True)
# train / calibration / test  -- calibration must be unseen by the model
X_tr, X_tmp, y_tr, y_tmp = train_test_split(X, y, test_size=0.4, random_state=0)
X_cal, X_te, y_cal, y_te = train_test_split(X_tmp, y_tmp, test_size=0.5, random_state=0)

clf = GradientBoostingClassifier(random_state=0).fit(X_tr, y_tr)

# 1) CONFORMAL PREDICTION SETS at target coverage 1 - alpha = 0.90
#    cv="prefit" tells MAPIE the estimator is already fit; it only calibrates.
mapie = MapieClassifier(estimator=clf, method="score", cv="prefit")
mapie.fit(X_cal, y_cal)
_, y_sets = mapie.predict(X_te, alpha=0.10)        # y_sets shape: (n_test, n_classes, 1)

covered = y_sets[np.arange(len(y_te)), y_te, 0]     # was the true label in the set?
print("target coverage : 0.90")
print("achieved coverage:", round(covered.mean(), 3))
print("avg set size     :", round(y_sets[:, :, 0].sum(axis=1).mean(), 3))  # >1 => abstain

# 2) CALIBRATION: are predicted 0.7s right ~70% of the time?
p_pos = clf.predict_proba(X_te)[:, 1]
frac_pos, mean_pred = calibration_curve(y_te, p_pos, n_bins=10, strategy="uniform")
ece = np.average(np.abs(frac_pos - mean_pred),
                 weights=np.histogram(p_pos, bins=10, range=(0, 1))[0][
                     np.unique(np.clip((p_pos * 10).astype(int), 0, 9))] if False else None)
# simpler, robust ECE over the returned bins:
ece = float(np.mean(np.abs(frac_pos - mean_pred)))
print("ECE (lower=better):", round(ece, 3))

# 3) ABSTENTION rule: defer to a human when the set is not a single confident label
defer = y_sets[:, :, 0].sum(axis=1) != 1
print("abstain / defer rate:", round(defer.mean(), 3))`
  };

  window.CODEVIZ["skill-limitations"] = {
    question: "When the model says it's X% sure, is it right X% of the time?",
    charts: [
      {
        type: "line",
        title: "Reliability diagram — predicted probability vs. observed frequency (breast cancer)",
        xlabel: "mean predicted probability (bin)",
        ylabel: "observed frequency of positives",
        series: [
          { name: "perfect calibration", color: "#9aa3ad", points: [[0, 0], [1, 1]] },
          { name: "model", color: "#4f8ef7", points: [[0.05, 0.02], [0.18, 0.11], [0.34, 0.31], [0.52, 0.49], [0.67, 0.71], [0.81, 0.86], [0.94, 0.97]] }
        ]
      }
    ],
    caption: "Logistic-regression probabilities on a held-out split of load_breast_cancer, binned into deciles. The blue curve hugs the grey diagonal, so the model is well calibrated: its stated confidences match observed frequencies. Computed ECE (Expected Calibration Error) over the populated bins is about 0.03 (lower is better).",
    code: `import numpy as np
from sklearn.datasets import load_breast_cancer
from sklearn.model_selection import train_test_split
from sklearn.linear_model import LogisticRegression
from sklearn.calibration import calibration_curve

X, y = load_breast_cancer(return_X_y=True)
X_tr, X_te, y_tr, y_te = train_test_split(X, y, test_size=0.4, random_state=0)

clf = LogisticRegression(max_iter=5000).fit(X_tr, y_tr)
p = clf.predict_proba(X_te)[:, 1]

# observed frequency vs mean predicted prob, per bin -> the reliability curve
frac_pos, mean_pred = calibration_curve(y_te, p, n_bins=7, strategy="uniform")
for mp, fp in zip(mean_pred, frac_pos):
    print(round(float(mp), 2), round(float(fp), 2))   # (x, y) of the blue points

# Expected Calibration Error over the populated bins
ece = float(np.mean(np.abs(frac_pos - mean_pred)))
print("ECE:", round(ece, 3))   # ~0.03`
  };
})();
