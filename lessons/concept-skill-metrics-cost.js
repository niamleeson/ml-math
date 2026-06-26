/* =====================================================================
   SKILL LESSON — "Doing ML for Real — the skills that matter (2026)"
   Choosing metrics based on business cost.
   Self-contained: registers the lesson, its CODE, and its CODEVIZ.
   ===================================================================== */
(function () {
  window.LESSONS.push({
    id: "skill-metrics-cost",
    title: "Choosing metrics based on business cost",
    tagline: "Accuracy doesn't pay the bills. Pick the threshold that minimizes real dollars.",
    module: "Doing ML for Real — the skills that matter",
    prereqs: ["ml-classification-metrics", "ml-roc-auc"],

    whenToUse:
      `<p><b>Reach for cost-aware metrics whenever a wrong prediction in one direction hurts far more than a wrong prediction in the other.</b> A model is not graded by a leaderboard — it triggers a real action with a real price tag. Missing a fraudulent charge can cost thousands; a false fraud alert costs a few minutes of support time. Those are not equal, so a metric that treats them as equal (accuracy) is lying to you.</p>
       <p><b>This skill is make-or-break when:</b></p>
       <ul>
         <li>The two error types — FP (False Positive) and FN (False Negative) — have very different dollar costs.</li>
         <li>The classes are imbalanced, so a model that predicts "no" every time can score 99% accuracy and be worthless.</li>
         <li>A downstream system <i>acts</i> on the score: blocks a transaction, pages a doctor, spends ad budget, recalls a part.</li>
         <li>You only have capacity to act on the top few cases (a fraud team reviews 100 alerts a day, not 10,000).</li>
       </ul>
       <p><b>Skip the ceremony when</b> errors are roughly symmetric and you genuinely have no downstream action — then plain accuracy or AUC (Area Under the Curve) is a fine summary. But say so out loud; most real systems are not symmetric.</p>`,

    playbook:
      `<ol>
         <li><b>Write the cost / utility matrix first.</b> Before touching the model, fill in four numbers with whoever owns the decision: the dollar cost (or negative utility) of a true positive, true negative, FP, and FN. The two that matter are the off-diagonal ones — $C_{\\text{FP}}$ (charge a good customer was blocked) and $C_{\\text{FN}}$ (a fraud slipped through). If you cannot get exact dollars, get a <i>ratio</i> — "a miss is 10× worse than a false alarm" is enough.</li>
         <li><b>Compute expected cost per threshold from the confusion matrix.</b> Sweep the decision threshold $t$ over the score. At each $t$, get the confusion matrix with <code>sklearn.metrics.confusion_matrix</code>, multiply each cell count by its cost, and sum. That is the expected cost at that threshold.</li>
         <li><b>Pick the threshold that minimizes expected cost — not 0.5.</b> The default <code>0.5</code> cutoff is almost never right when costs are asymmetric. Choose the $t$ at the bottom of the cost curve. With well-estimated probabilities this lands near the Bayes-optimal threshold $t^\\*=\\frac{C_{\\text{FP}}}{C_{\\text{FP}}+C_{\\text{FN}}}$.</li>
         <li><b>For capacity-limited actions, use precision@k.</b> If the team can only act on $k$ cases, the relevant metric is not "global accuracy" but precision@k — of the top-$k$ highest-scoring cases, what fraction are true positives. Rank by score, take the top $k$, measure precision there. Recall and thresholds are secondary; the budget $k$ is the constraint.</li>
         <li><b>Calibrate the probabilities so they can drive decisions.</b> A cost-optimal threshold only makes sense if a score of 0.3 really means "30% chance". Many models (SVMs, boosted trees, naive Bayes) output mis-scaled scores. Fix them with <code>CalibratedClassifierCV</code> (Platt scaling / sigmoid, or isotonic) and check the fix with <code>calibration_curve</code>.</li>
         <li><b>Report the metric tied to the decision, not just accuracy / AUC.</b> Your headline number should be the one the business feels: expected cost per 1,000 cases, dollars saved versus the old policy, or precision@k at the team's real capacity. Quote accuracy / AUC as context, never as the verdict.</li>
       </ol>`,

    application:
      `<p>This is the difference between a demo and a deployed system. <b>Fraud and abuse</b> teams pick a block threshold from the cost of a chargeback versus a blocked good customer. <b>Medical screening</b> sets the alert threshold so a missed tumor (huge FN cost) outweighs an extra biopsy (small FP cost). <b>Predictive maintenance</b> trades the cost of an unplanned failure against a needless part swap. <b>Marketing and ads</b> use precision@k because only the top-scoring users get the (paid) treatment. In every case the model is the same; the <i>threshold and the metric</i> are where the money is made.</p>`,

    pitfalls:
      `<ul>
         <li><b>Optimizing accuracy or AUC when costs are asymmetric.</b> Tell: the deck shows "94% accuracy" or "0.97 AUC" and nobody can say what a single error costs. AUC averages over <i>all</i> thresholds with equal weight — but you ship exactly one threshold, and your costs are not equal.</li>
         <li><b>Leaving the threshold at the default 0.5.</b> Tell: <code>model.predict(X)</code> straight into production. That hard-codes a 50/50 cost assumption you never checked. Always derive $t$ from the cost matrix.</li>
         <li><b>Uncalibrated scores feeding a cost decision.</b> Tell: the model is a tree ensemble or SVM and someone is comparing its score to a probability threshold. If 0.3 doesn't mean 30%, the "cost-optimal" cutoff is garbage. Calibrate first.</li>
         <li><b>One global threshold across segments with different base rates.</b> Tell: a single cutoff applied to new users and tenured users, or to two countries with very different fraud rates. The Bayes-optimal threshold shifts with the base rate; one knob underserves every segment.</li>
         <li><b>A metric tied to no decision.</b> Tell: the eval reports F1 (or AUC) but the team can't name the action the score triggers. If no one acts on the prediction, you are tuning a number for its own sake — find the decision first, then the metric.</li>
         <li><b>Tuning the threshold on the test set.</b> Tell: the same data used to pick $t$ is used to report the savings. Choose the threshold on a validation split, report on a held-out test split, or the savings are optimistic.</li>
       </ul>`,

    checklist:
      `<ul>
         <li>☐ I wrote down the dollar cost (or a defensible ratio) of a False Positive and a False Negative, signed off by the decision owner.</li>
         <li>☐ I named the concrete action the score triggers and who/what acts on it.</li>
         <li>☐ I swept the threshold and plotted expected cost versus $t$, marking the minimum.</li>
         <li>☐ My shipped threshold is the cost-minimizer, not 0.5 — and it's near $t^\\*=C_{\\text{FP}}/(C_{\\text{FP}}+C_{\\text{FN}})$.</li>
         <li>☐ If capacity is limited, I reported precision@k at the team's real $k$.</li>
         <li>☐ I calibrated the probabilities and checked the reliability curve (Brier score / ECE).</li>
         <li>☐ I used separate splits to <i>choose</i> the threshold and to <i>report</i> the result.</li>
         <li>☐ If base rates differ across segments, I set a per-segment threshold (or justified one global cutoff).</li>
         <li>☐ My headline metric is the one the business feels (expected cost / dollars saved / precision@k), with accuracy & AUC only as context.</li>
       </ul>`,

    bigIdea:
      `<p>A classifier outputs a score; a <b>decision</b> is what you do with it. The bridge between them is a threshold $t$: act if score $\\ge t$, otherwise don't.</p>
       <p>Different thresholds trade one kind of mistake for the other. Lower $t$ ⇒ more alerts, fewer misses (fewer FN, more FP). Higher $t$ ⇒ the reverse.</p>
       <p>If the two mistakes cost the same, 0.5 is a fine place to stand. <b>They almost never cost the same.</b> So the right threshold is the one that minimizes <i>expected dollars</i>, and the right metric is that expected cost — not accuracy.</p>`,

    buildup:
      `<p>Lay out the <b>cost matrix</b> $C$: $C_{ij}$ is the cost of predicting class $i$ when the truth is class $j$. With the positive class being the costly event (fraud, malignant tumor):</p>
       <ul>
         <li>$C_{\\text{FP}}$ = cost of a False Positive: we acted, but it was a false alarm.</li>
         <li>$C_{\\text{FN}}$ = cost of a False Negative: we did nothing, but the event was real (usually the expensive one).</li>
         <li>The diagonal (correct calls) is usually 0 or a small fixed cost.</li>
       </ul>
       <p>At threshold $t$ the confusion matrix gives the <i>counts</i> of each cell. Multiply counts by costs, sum, and you have the expected cost at $t$. Sweep $t$, take the minimum.</p>`,

    symbols: [
      { sym: "$t$", desc: "the decision threshold: predict positive when the model's score is $\\ge t$." },
      { sym: "FP", desc: "False Positive — predicted positive, truth negative (a false alarm)." },
      { sym: "FN", desc: "False Negative — predicted negative, truth positive (a missed event)." },
      { sym: "$\\hat y$", desc: "the predicted label (0 or 1) at threshold $t$." },
      { sym: "$y$", desc: "the true label (0 or 1)." },
      { sym: "$C_{ij}$", desc: "the cost of predicting class $i$ when the truth is class $j$. $C_{10}=C_{\\text{FP}}$, $C_{01}=C_{\\text{FN}}$." },
      { sym: "$P(\\hat y=i, y=j\\mid t)$", desc: "the fraction of cases that fall in confusion-matrix cell $(i,j)$ at threshold $t$." },
      { sym: "$t^\\*$", desc: "the Bayes-optimal threshold — the cutoff that minimizes expected cost when probabilities are correct." },
      { sym: "$p_i$", desc: "the model's predicted probability of the positive class for case $i$." },
      { sym: "$o_i$", desc: "the actual outcome of case $i$ (1 if the positive event happened, else 0), used to score calibration." }
    ],

    formula: `$$ E[\\text{cost}](t)=\\sum_{i,j} P(\\hat y=i,\\,y=j\\mid t)\\,C_{ij}, \\qquad t^\\*=\\frac{C_{10}}{C_{10}+C_{01}}=\\frac{C_{\\text{FP}}}{C_{\\text{FP}}+C_{\\text{FN}}} $$`,

    whatItDoes:
      `<p>The left formula is the <b>expected cost</b> at threshold $t$: walk the four confusion-matrix cells, weight each cell's probability by its cost $C_{ij}$, and add them up. Sweep $t$ and this traces a cost curve — its lowest point is the threshold you ship.</p>
       <p>The right formula is the shortcut: when probabilities are well-calibrated, the cost-minimizing cutoff is $t^\\*=\\frac{C_{\\text{FP}}}{C_{\\text{FP}}+C_{\\text{FN}}}$. If a miss (FN) costs 10× a false alarm (FP), then $t^\\*=\\frac{1}{1+10}\\approx 0.09$ — you alert far more eagerly than 0.5.</p>`,

    derivation:
      `<p><b>Where $t^\\*$ comes from.</b></p>
       <ul class="steps">
         <li>For a single case with positive-class probability $p$, you either act (predict 1) or not (predict 0). Take the correct-call costs as 0 for clarity.</li>
         <li>Expected cost if you <b>act</b>: you're wrong with probability $1-p$ (the case is actually negative), paying $C_{\\text{FP}}$. So $\\text{cost}_{\\text{act}}=(1-p)\\,C_{\\text{FP}}$.</li>
         <li>Expected cost if you <b>don't act</b>: you're wrong with probability $p$ (the event really happens), paying $C_{\\text{FN}}$. So $\\text{cost}_{\\text{skip}}=p\\,C_{\\text{FN}}$.</li>
         <li>Act exactly when acting is cheaper: $(1-p)\\,C_{\\text{FP}} \\le p\\,C_{\\text{FN}}$. Solve for $p$: $C_{\\text{FP}} \\le p\\,(C_{\\text{FP}}+C_{\\text{FN}})$, i.e. $p \\ge \\frac{C_{\\text{FP}}}{C_{\\text{FP}}+C_{\\text{FN}}}$.</li>
         <li>That break-even probability <i>is</i> the threshold: $t^\\*=\\frac{C_{\\text{FP}}}{C_{\\text{FP}}+C_{\\text{FN}}}$. It depends only on the cost ratio, never on 0.5. $\\blacksquare$</li>
       </ul>
       <p><b>Why calibration matters.</b> The $t^\\*$ formula assumes $p$ is a real probability. If scores are mis-scaled, you can still pick the best <i>empirical</i> threshold by sweeping the cost curve directly — but to <i>trust</i> $t^\\*$, calibrate first. Two scores measure calibration:</p>
       <ul class="steps">
         <li><b>Brier score</b> $=\\frac1n\\sum_i (p_i-o_i)^2$: mean squared error between predicted probability and the 0/1 outcome. Lower is better; it rewards both sharp and honest probabilities.</li>
         <li><b>ECE (Expected Calibration Error)</b>: bin predictions by confidence, and for each bin compare the average predicted probability to the actual hit rate; ECE is the bin-size-weighted average of those gaps. ECE $=\\sum_b \\frac{n_b}{n}\\,\\big|\\,\\text{acc}_b-\\text{conf}_b\\,\\big|$, where $\\text{conf}_b$ is the mean predicted probability in bin $b$ and $\\text{acc}_b$ the true positive rate there. ECE near 0 means "when it says 0.7, it's right 70% of the time".</li>
       </ul>`,

    example:
      `<p>Fraud screening. A blocked good customer (FP) costs <b>$5</b> in support and churn risk. A missed fraud (FN) costs <b>$50</b> in chargebacks. So a miss is 10× a false alarm.</p>
       <ul class="steps">
         <li><b>Bayes-optimal threshold:</b> $t^\\*=\\dfrac{C_{\\text{FP}}}{C_{\\text{FP}}+C_{\\text{FN}}}=\\dfrac{5}{5+50}=\\dfrac{5}{55}\\approx 0.091$. Alert on anything scoring above ~9%, not 50%.</li>
         <li><b>Cost at $t=0.5$ on 1,000 cases:</b> say it yields 2 FP and 6 FN. Cost $=2(5)+6(50)=10+300=\\$310$.</li>
         <li><b>Cost at $t=0.09$:</b> the lower cutoff catches 5 of those 6 misses but adds false alarms — say 30 FP and 1 FN. Cost $=30(5)+1(50)=150+50=\\$200$.</li>
         <li>The lower threshold costs <b>$110 less per 1,000 cases</b>, even though it makes <i>more</i> total errors (31 vs 8). Accuracy went down; the bill went down. That is the whole point.</li>
       </ul>`,

    demo: function (host) {
      var c = (function () {
        var s = getComputedStyle(document.documentElement);
        var g = function (n, d) { return (s.getPropertyValue(n) || d).trim(); };
        return { ink: g("--ink", "#e6edf3"), dim: g("--ink-dim", "#9aa7b4"), accent: g("--accent", "#4ea1ff"), accent2: g("--accent-2", "#7ee787"), warn: g("--warn", "#ffb454"), border: g("--border", "#2a3340"), panel: g("--panel", "#161c24") };
      })();
      var cv = document.createElement("canvas"); cv.width = 640; cv.height = 360; cv.style.maxWidth = "100%"; host.appendChild(cv);
      var ctx = cv.getContext("2d");
      var readout = document.createElement("div"); readout.className = "out"; readout.style.marginTop = "6px";

      // fixed pool of 60 cases: score in [0,1], true label. Higher score => more likely positive.
      var seed = 20260621; function rnd() { seed = (seed * 1103515245 + 12345) & 0x7fffffff; return seed / 0x7fffffff; }
      var cases = [];
      for (var i = 0; i < 60; i++) {
        var pos = rnd() < 0.30 ? 1 : 0;                 // ~30% positive base rate
        var sc = pos ? 0.45 + 0.5 * rnd() : 0.55 * rnd(); // positives score higher, with overlap
        if (sc > 0.999) sc = 0.999; if (sc < 0.001) sc = 0.001;
        cases.push({ s: sc, y: pos });
      }
      var ratio = 10; // FN is 10x the cost of FP

      var W = 640, H = 360, padL = 52, padR = 16, padT = 18, padB = 36;
      function PX(t) { return padL + t * (W - padL - padR); }

      function costAt(t) {
        var FP = 0, FN = 0;
        for (var k = 0; k < cases.length; k++) {
          var yhat = cases[k].s >= t ? 1 : 0;
          if (yhat === 1 && cases[k].y === 0) FP++;
          if (yhat === 0 && cases[k].y === 1) FN++;
        }
        return { cost: FP * 1 + FN * ratio, FP: FP, FN: FN };
      }

      function draw() {
        ctx.clearRect(0, 0, W, H);
        // build curve
        var pts = [], maxC = 1, best = { cost: 1e9, t: 0.5 };
        for (var t = 0.02; t <= 0.98; t += 0.02) {
          var r = costAt(t); pts.push({ t: t, c: r.cost });
          if (r.cost > maxC) maxC = r.cost;
          if (r.cost < best.cost) { best.cost = r.cost; best.t = t; }
        }
        function PY(cost) { return (H - padB) - (cost / maxC) * (H - padT - padB); }
        // axes
        ctx.strokeStyle = c.border; ctx.lineWidth = 1;
        ctx.beginPath(); ctx.moveTo(padL, padT); ctx.lineTo(padL, H - padB); ctx.lineTo(W - padR, H - padB); ctx.stroke();
        ctx.fillStyle = c.dim; ctx.font = "12px sans-serif"; ctx.textAlign = "center";
        ctx.fillText("decision threshold t", (padL + W - padR) / 2, H - 8);
        ctx.save(); ctx.translate(14, (padT + H - padB) / 2); ctx.rotate(-Math.PI / 2); ctx.fillText("expected cost", 0, 0); ctx.restore();
        // tstar line
        var tstar = 1 / (1 + ratio);
        ctx.strokeStyle = c.accent2; ctx.setLineDash([5, 4]); ctx.lineWidth = 1.5;
        ctx.beginPath(); ctx.moveTo(PX(tstar), padT); ctx.lineTo(PX(tstar), H - padB); ctx.stroke();
        // 0.5 line
        ctx.strokeStyle = c.dim; ctx.beginPath(); ctx.moveTo(PX(0.5), padT); ctx.lineTo(PX(0.5), H - padB); ctx.stroke(); ctx.setLineDash([]);
        // cost curve
        ctx.strokeStyle = c.accent; ctx.lineWidth = 2.5; ctx.beginPath();
        for (var i2 = 0; i2 < pts.length; i2++) { var X = PX(pts[i2].t), Y = PY(pts[i2].c); if (i2 === 0) ctx.moveTo(X, Y); else ctx.lineTo(X, Y); }
        ctx.stroke();
        // mark minimum
        ctx.fillStyle = c.warn; ctx.beginPath(); ctx.arc(PX(best.t), PY(best.cost), 5, 0, Math.PI * 2); ctx.fill();
        // mark 0.5
        var c05 = costAt(0.5);
        ctx.strokeStyle = c.dim; ctx.fillStyle = c.dim; ctx.beginPath(); ctx.arc(PX(0.5), PY(c05.cost), 4, 0, Math.PI * 2); ctx.fill();
        // labels at top
        ctx.textAlign = "left"; ctx.font = "11px sans-serif";
        ctx.fillStyle = c.accent2; ctx.fillText("t* = " + tstar.toFixed(2), PX(tstar) + 4, padT + 12);
        ctx.fillStyle = c.dim; ctx.fillText("0.5", PX(0.5) + 4, padT + 26);
        readout.innerHTML = "A miss (FN) costs <b>" + ratio + "×</b> a false alarm (FP). Orange dot = cost-minimizing threshold <b>t = " + best.t.toFixed(2) + "</b> (cost " + best.cost + "). Naive <b>0.5</b> costs " + c05.cost + " — " + (c05.cost / Math.max(1, best.cost)).toFixed(1) + "× more. Green dashed line is the Bayes-optimal <b>t* = " + tstar.toFixed(2) + "</b>. Slide the cost ratio and watch the minimum march left.";
      }

      var row = document.createElement("div"); row.style.margin = "8px 0";
      var lab = document.createElement("label"); lab.style.display = "block"; lab.textContent = "cost of a miss (FN) ÷ cost of a false alarm (FP): ";
      var span = document.createElement("span"); span.className = "out"; span.style.marginLeft = "6px"; span.textContent = ratio + "×"; lab.appendChild(span);
      var inp = document.createElement("input"); inp.setAttribute("type", "range"); inp.min = 1; inp.max = 30; inp.step = 1; inp.value = ratio;
      inp.addEventListener("input", function () { ratio = parseInt(inp.value, 10); span.textContent = ratio + "×"; draw(); });
      row.appendChild(lab); row.appendChild(inp);
      host.appendChild(row); host.appendChild(readout);
      draw();
    },

    practice: [
      {
        q: `A spam filter is graded at 99.1% accuracy and ships with the default 0.5 threshold. A product manager says "great, ship it." The cost of a missed spam (FN) is one annoying email; the cost of a real message sent to spam (FP) is a lost customer reply. Is accuracy the right call, and is 0.5 the right threshold?`,
        steps: [
          { do: `Identify the two error costs.`, why: `Here a False Positive (good mail marked spam) is far more expensive than a False Negative (spam in the inbox) — the costs are very asymmetric, the opposite of the fraud case.` },
          { do: `Note the base rate.`, why: `Spam is common, so 99.1% accuracy can be reached by a model that's reckless about FPs. Accuracy hides the error that actually hurts.` },
          { do: `Set the threshold from the cost ratio.`, why: `With FP much costlier than FN, $t^\\*=\\frac{C_{\\text{FP}}}{C_{\\text{FP}}+C_{\\text{FN}}}$ is well above 0.5 — be conservative about flagging spam.` }
        ],
        answer: `<p>No on both counts. Accuracy is the wrong metric (FP and FN costs differ wildly), and 0.5 is the wrong threshold. Because a False Positive costs far more than a False Negative, $t^\\*$ should be pushed <b>above</b> 0.5 so the filter only flags mail it's very sure about. Report expected cost (or precision on the "spam" decision), not accuracy.</p>`
      },
      {
        q: `You have a fitted gradient-boosted model. The cost matrix says a miss is 8× a false alarm. You compute $t^\\*=1/(1+8)=0.111$ and ship that cutoff. The realized cost in production is much worse than predicted. What's the most likely cause, and how do you check it?`,
        steps: [
          { do: `Recall what $t^\\*$ assumes.`, why: `The $t^\\*$ formula is only valid if the model's scores are true probabilities — a 0.111 score must mean an 11.1% chance.` },
          { do: `Suspect calibration.`, why: `Gradient-boosted trees output mis-scaled scores; "0.111" may correspond to a very different real probability, so the cutoff lands in the wrong place.` },
          { do: `Calibrate and re-derive.`, why: `Wrap the model in <code>CalibratedClassifierCV</code> (isotonic or sigmoid), check <code>calibration_curve</code> / Brier / ECE, then re-pick the threshold — or skip $t^\\*$ and sweep the empirical cost curve directly.` }
        ],
        answer: `<p>The scores are <b>uncalibrated</b>, so $t^\\*=0.111$ doesn't correspond to the intended 8:1 trade-off. Fix it with <code>CalibratedClassifierCV</code> and verify with a reliability curve (Brier score / ECE). Alternatively, bypass the formula and pick the threshold that minimizes the <i>empirical</i> expected-cost curve on a validation split — that works even on raw scores, though calibration is still wise for interpretability.</p>`
      },
      {
        q: `A fraud team can manually review only 50 cases per day, but the model scores 40,000 transactions daily. The DS lead wants to "optimize the threshold for expected cost." What metric actually governs this setup, and how do you compute it?`,
        steps: [
          { do: `Spot the capacity constraint.`, why: `The action (manual review) is capped at $k=50$. Thresholds that surface 4,000 alerts are irrelevant — only the top 50 get acted on.` },
          { do: `Switch to precision@k.`, why: `Rank all 40,000 by score, take the top $k=50$, and measure precision there: what fraction of those 50 are true fraud. That is the metric the team feels.` },
          { do: `Tie it to value.`, why: `Multiply precision@50 by 50 to get expected true frauds caught per day, times the dollars saved per catch — the business headline.` }
        ],
        answer: `<p>This is a capacity-limited action, so the governing metric is <b>precision@k</b> with $k=50$ — not a global cost-minimizing threshold. Rank transactions by score, take the top 50, and report the fraction that are actually fraud (and the resulting dollars saved). A threshold sweep is the wrong frame here because the team's budget, not a cutoff, decides how many cases get acted on.</p>`
      }
    ]
  });

  window.CODE["skill-metrics-cost"] = {
    lib: "scikit-learn",
    runnable: false,
    explain: `<p>The full cost-aware workflow in <code>scikit-learn</code>: sweep thresholds with <code>precision_recall_curve</code> / <code>confusion_matrix</code>, minimize a custom expected-cost function to pick the threshold (not 0.5), then calibrate the probabilities with <code>CalibratedClassifierCV</code> and check them with <code>calibration_curve</code>.</p>`,
    code: `import numpy as np
from sklearn.datasets import load_breast_cancer
from sklearn.model_selection import train_test_split
from sklearn.linear_model import LogisticRegression
from sklearn.preprocessing import StandardScaler
from sklearn.pipeline import make_pipeline
from sklearn.metrics import confusion_matrix, precision_recall_curve, brier_score_loss
from sklearn.calibration import CalibratedClassifierCV, calibration_curve

# positive class = malignant tumor (the costly miss). sklearn target: 0=malignant, 1=benign.
data = load_breast_cancer()
X = data.data
y = (data.target == 0).astype(int)          # 1 = malignant (positive)

X_tr, X_te, y_tr, y_te = train_test_split(
    X, y, test_size=0.4, random_state=0, stratify=y)

clf = make_pipeline(StandardScaler(),
                    LogisticRegression(max_iter=5000)).fit(X_tr, y_tr)
p = clf.predict_proba(X_te)[:, 1]           # P(malignant)

# --- 1) the cost / utility matrix: a missed malignant tumor is far worse ---
C_FP = 1.0     # false alarm: benign flagged malignant (extra biopsy)
C_FN = 20.0    # MISS: malignant called benign (could be fatal)

# --- 2) expected cost at each threshold, straight from the confusion matrix ---
def expected_cost(y_true, scores, t, c_fp, c_fn):
    y_hat = (scores >= t).astype(int)
    tn, fp, fn, tp = confusion_matrix(y_true, y_hat, labels=[0, 1]).ravel()
    return c_fp * fp + c_fn * fn

# --- 3) pick the threshold that MINIMIZES expected cost (not the default 0.5) ---
# use the candidate thresholds the PR curve already evaluated
_, _, thresholds = precision_recall_curve(y_te, p)
costs = [expected_cost(y_te, p, t, C_FP, C_FN) for t in thresholds]
t_best = thresholds[int(np.argmin(costs))]

t_star = C_FP / (C_FP + C_FN)               # Bayes-optimal threshold (if calibrated)
print(f"cost-minimizing threshold: {t_best:.3f}")
print(f"Bayes-optimal t*:          {t_star:.3f}")
print(f"cost at t_best: {min(costs):.0f}   "
      f"cost at 0.5: {expected_cost(y_te, p, 0.5, C_FP, C_FN):.0f}")

# --- 4) precision@k for a capacity-limited review team (top-k highest scores) ---
k = 20
top_k = np.argsort(p)[::-1][:k]
print(f"precision@{k}: {y_te[top_k].mean():.3f}")

# --- 5) calibrate the probabilities so the threshold means what it says ---
cal = CalibratedClassifierCV(clf, method="isotonic", cv=5).fit(X_tr, y_tr)
p_cal = cal.predict_proba(X_te)[:, 1]
frac_pos, mean_pred = calibration_curve(y_te, p_cal, n_bins=10)

# --- 6) report the metrics tied to the decision, not just accuracy/AUC ---
print(f"Brier (raw):        {brier_score_loss(y_te, p):.4f}")
print(f"Brier (calibrated): {brier_score_loss(y_te, p_cal):.4f}")
print("reliability (pred vs actual):",
      list(zip(np.round(mean_pred, 2), np.round(frac_pos, 2))))`
  };

  window.CODEVIZ["skill-metrics-cost"] = {
    question: "Read the expected-cost curve: where does the bill bottom out, and what does its shape tell you about the right threshold?",
    charts: [
      {
        type: "line",
        title: "Asymmetric cost (miss = 10x a false alarm): minimum sits LEFT of 0.5",
        xlabel: "decision threshold t",
        ylabel: "expected cost on the test set",
        series: [
          {
            name: "expected cost",
            color: "#4ea1ff",
            points: [[0.05, 64], [0.10, 42], [0.13, 34], [0.18, 42], [0.24, 46], [0.30, 43], [0.36, 40], [0.42, 64], [0.50, 61], [0.58, 90], [0.66, 120], [0.74, 130], [0.82, 170], [0.90, 260]]
          },
          {
            name: "cost-minimizing t = 0.13",
            color: "#7ee787",
            points: [[0.13, 34]]
          },
          {
            name: "naive t = 0.5",
            color: "#9aa7b4",
            points: [[0.50, 61]]
          }
        ],
        interpret: "<b>This is the ideal case.</b> X is the threshold you might ship; Y is the dollar cost at that threshold on the test set. The curve is a valley: too-low t fires alarms on everyone (left climb), too-high t misses real positives (right climb, which is steep because each miss costs 10x). The <b>green</b> point is the bottom of the valley — the threshold to ship (t = 0.13, cost 34). The <b>grey</b> point is the naive 0.5, sitting on the right wall at cost 61, nearly 2x worse. Read it as: because misses cost more, the cheapest cutoff is pulled <b>left</b> of 0.5."
      },
      {
        type: "line",
        title: "Symmetric cost (miss = false alarm): minimum sits AT 0.5",
        xlabel: "decision threshold t",
        ylabel: "expected cost (illustrative)",
        series: [
          {
            name: "expected cost",
            color: "#4ea1ff",
            points: [[0.05, 95], [0.15, 62], [0.25, 44], [0.35, 34], [0.42, 30], [0.50, 28], [0.58, 30], [0.66, 35], [0.75, 46], [0.85, 66], [0.95, 98]]
          },
          {
            name: "minimum t = 0.50",
            color: "#7ee787",
            points: [[0.50, 28]]
          }
        ],
        interpret: "<b>Illustrative.</b> When a false alarm and a miss cost the same, the cost curve is roughly symmetric and its bottom lands near t = 0.5 — so the default cutoff is actually fine here. The lesson: 0.5 is not wrong because it is 0.5, it is wrong when costs are <b>unequal</b>. If you ever see a valley centered on 0.5, double-check that your two errors really do cost the same before celebrating the default."
      },
      {
        type: "line",
        title: "Extreme ratio (miss = 100x): minimum slides to the edge, near-monotone",
        xlabel: "decision threshold t",
        ylabel: "expected cost (illustrative)",
        series: [
          {
            name: "expected cost",
            color: "#ffb454",
            points: [[0.03, 22], [0.08, 18], [0.15, 30], [0.25, 70], [0.35, 150], [0.45, 280], [0.55, 430], [0.65, 600], [0.75, 800], [0.85, 1050], [0.95, 1400]]
          },
          {
            name: "minimum t = 0.08",
            color: "#7ee787",
            points: [[0.08, 18]]
          }
        ],
        interpret: "<b>Illustrative.</b> When a miss is overwhelmingly costlier (100x), the right wall dominates and the curve climbs almost monotonically from left to right — the bottom is squeezed hard against the low end (here t ~ 0.08, near t* = 1/101). Read this shape as: <b>almost always act</b>. A near-monotone cost curve is a signal that your cost ratio is extreme and the threshold belongs at the edge, not in the middle. Watch that you are not just alerting on literally everything (t -> 0)."
      },
      {
        type: "line",
        title: "Uncalibrated scores: jagged curve, untrustworthy minimum",
        xlabel: "decision threshold t",
        ylabel: "expected cost (illustrative)",
        series: [
          {
            name: "expected cost",
            color: "#ff7b72",
            points: [[0.05, 70], [0.12, 41], [0.18, 58], [0.24, 39], [0.30, 60], [0.36, 44], [0.42, 72], [0.50, 50], [0.58, 81], [0.66, 63], [0.74, 95], [0.82, 78], [0.90, 120]]
          }
        ],
        interpret: "<b>Illustrative.</b> When the model's scores are NOT real probabilities (raw trees, SVM margins), the cost curve is jagged with several local dips instead of one clean valley, and a score of 0.3 may not mean a 30% chance — so the t* = C_FP/(C_FP+C_FN) shortcut points to the wrong place. Recognise it by the bumpy shape and a minimum that jumps around between data splits. Fix it: calibrate first (CalibratedClassifierCV), or pick the threshold by sweeping the empirical curve on a validation split rather than trusting the formula."
      }
    ],
    caption: "Positive class = malignant tumor. The ideal (top) chart is real: with a miss costing 10x a false alarm, expected cost bottoms out at t = 0.13, near the Bayes-optimal t* = 0.09, and the naive 0.5 costs nearly 2x more. The three variants below are illustrative shapes you will actually meet: symmetric costs (valley at 0.5), an extreme ratio (near-monotone, push to the edge), and uncalibrated scores (jagged, untrustworthy minimum).",
    code: `import numpy as np
from sklearn.datasets import load_breast_cancer
from sklearn.model_selection import train_test_split
from sklearn.linear_model import LogisticRegression
from sklearn.preprocessing import StandardScaler
from sklearn.pipeline import make_pipeline

# positive class = malignant (sklearn target: 0=malignant, 1=benign)
data = load_breast_cancer()
X = data.data
y = (data.target == 0).astype(int)          # 1 = malignant (the costly miss)

X_tr, X_te, y_tr, y_te = train_test_split(
    X, y, test_size=0.4, random_state=0, stratify=y)

# a deliberately mild model (C=0.05) so the cost curve has a clear interior minimum
clf = make_pipeline(StandardScaler(),
                    LogisticRegression(C=0.05, max_iter=5000)).fit(X_tr, y_tr)
p = clf.predict_proba(X_te)[:, 1]

C_FP, C_FN = 1.0, 10.0                        # missing a malignancy is 10x a false alarm
thresholds = [0.05, 0.10, 0.13, 0.18, 0.24, 0.30, 0.36,
              0.42, 0.50, 0.58, 0.66, 0.74, 0.82, 0.90]
costs = []
for t in thresholds:
    y_hat = (p >= t).astype(int)
    fp = int(((y_hat == 1) & (y_te == 0)).sum())
    fn = int(((y_hat == 0) & (y_te == 1)).sum())
    costs.append(C_FP * fp + C_FN * fn)

best = thresholds[int(np.argmin(costs))]
print("threshold -> cost:", list(zip(thresholds, costs)))
print("cost-minimizing threshold:", best, " cost:", min(costs))
print("naive 0.5 cost:", costs[thresholds.index(0.50)])
print("Bayes-optimal t*:", round(C_FP / (C_FP + C_FN), 3))`
  };
})();
