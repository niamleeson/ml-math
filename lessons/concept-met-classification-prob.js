/* =====================================================================
   Metrics & Evaluation (BEGINNER) — Classification metrics from
   scores / probabilities. ROC-AUC, PR-AUC / Average Precision, partial
   AUC, Gini, KS, lift & gain, log loss, Brier score, threshold choice.
   Self-contained: registers the lesson, its CODE, and its CODEVIZ.
   ===================================================================== */
(function () {
  window.LESSONS.push({
    id: "met-classification-prob",
    title: "Classification metrics from scores & probabilities",
    tagline: "Your model outputs a number per example. These metrics grade how good that number is — before you pick any yes/no cutoff.",
    module: "Metrics & Evaluation — measuring models, data & statistics",
    // prereqs verified against window.LESSONS: ml-roc-auc and ml-classification-metrics exist.
    // met-foundations is a sibling lesson loaded earlier in this same wave (index.html).
    prereqs: ["met-foundations", "ml-roc-auc", "ml-classification-metrics"],

    whenToUse:
      `<p>Use these metrics whenever your classifier outputs a <b>score</b> (any number where bigger means "more likely positive") or a <b>probability</b> (a score that lives between 0 and 1), and you have <i>not</i> yet committed to a single yes/no cutoff. They grade the score itself, so they let you compare models before the threshold decision.</p>
       <p>Pick the metric by the question you are actually asking:</p>
       <ul>
         <li><b>"Does my model rank positives above negatives?"</b> → <b>ROC-AUC</b> (Area Under the ROC Curve) or its twin the <b>Gini</b> coefficient. This is a pure <i>ranking</i> score. Best when the two classes are roughly balanced.</li>
         <li><b>"Among the cases I flag, how many are real, and do I catch the rare positives?"</b> → <b>PR-AUC</b> (Area Under the Precision–Recall Curve), also called <b>Average Precision</b>. This is the one to trust when positives are <b>rare</b> (heavy class imbalance).</li>
         <li><b>"Are my probabilities themselves trustworthy numbers, not just well-ordered?"</b> → <b>log loss</b> (cross-entropy) or the <b>Brier score</b>. These punish a model that is confidently wrong, so they reward honest probabilities — which matters when a downstream step multiplies your probability by a dollar amount or a risk.</li>
         <li><b>"How big a gap does my model open between good and bad cases?"</b> → the <b>KS</b> (Kolmogorov–Smirnov) statistic, popular in credit scoring.</li>
         <li><b>"If I only act on my top-scoring cases, how much better than random am I?"</b> → <b>lift &amp; gain</b> charts, popular in marketing and fraud.</li>
       </ul>
       <p>Two of these (ROC-AUC and PR-AUC) are <b>threshold-free</b>: they average over every possible cutoff. The last step on this page — choosing a threshold — is where you finally commit to one.</p>`,

    application:
      `<p>Score-based metrics are everywhere a model produces a probability that something will happen. Fraud detection ranks transactions by risk and reviews the top ones (lift &amp; gain). Credit scoring quotes a <b>KS</b> statistic and a <b>Gini</b> by regulation. Ad click-through and medical-risk models live or die on <b>log loss</b>, because the probability is multiplied by a payout or a treatment decision. Ranking and retrieval systems report <b>PR-AUC</b> because the relevant items are rare. Every scikit-learn model exposes <code>predict_proba</code> or <code>decision_function</code>, and these are the metrics you feed those outputs into.</p>`,

    pitfalls:
      `<ul>
         <li><b>ROC-AUC looking great under imbalance.</b> The false-positive rate (the ROC x-axis) divides by the <i>huge</i> count of negatives, so a flood of false alarms barely moves it. On a 1%-positive problem a model can show ROC-AUC 0.95 yet have terrible precision — most of your "positive" flags are wrong. <b>Fix:</b> report <b>PR-AUC / Average Precision</b> instead, and compare it to the positive rate, not to 0.5.</li>
         <li><b>Treating a threshold-free score as if it judged your operating point.</b> ROC-AUC and PR-AUC average over <i>all</i> thresholds. A high AUC says nothing about the precision or recall at the <i>one</i> cutoff you actually ship. <b>Fix:</b> after picking a threshold, also report the confusion-matrix metrics (precision, recall, F1) <i>at that threshold</i>.</li>
         <li><b>Log loss exploding on one overconfident wrong prediction.</b> Log loss is $-\\log(\\text{probability assigned to the true class})$. If the model says 0.999 "negative" and the truth is positive, that single example contributes $-\\log(0.001) \\approx 6.9$ — it can dominate the whole average. <b>Fix:</b> clip probabilities away from 0 and 1, inspect the worst-loss examples, and consider the Brier score (bounded between 0 and 1) as a gentler companion.</li>
         <li><b>Reading AUC below 0.5 as "bad model".</b> An AUC of 0.2 means the ranking is <i>inverted</i> — flip the sign of the score and you have a 0.8 model. A genuinely useless model sits at 0.5.</li>
         <li><b>Comparing log loss / Brier across different positive rates.</b> Their scale depends on the base rate, so a number is only meaningful next to a baseline (predict the class proportion for everyone) on the <i>same</i> data.</li>
       </ul>`,

    bigIdea:
      `<p>A classifier rarely says a flat "yes" or "no". Under the hood it produces a <b>score</b> per example — a number where higher means "more likely to be a positive". A <b>probability</b> is a score that has been squeezed into the 0–1 range so it can be read as "an X% chance".</p>
       <p>There are really <b>two different questions</b> you can ask about such scores, and they need different metrics:</p>
       <ul>
         <li><b>Ranking quality:</b> do positives tend to get higher scores than negatives? You can answer this without trusting the exact numbers — only their <i>order</i> matters. (ROC-AUC, PR-AUC, Gini, KS, lift all live here.)</li>
         <li><b>Probability quality (calibration):</b> when the model says "0.7", does the event really happen about 70% of the time? Here the actual numbers matter. (Log loss and the Brier score live here.)</li>
       </ul>
       <p>A model can be a great <i>ranker</i> and still a liar about probabilities, or vice-versa. This page covers both halves; the deep dive on the second half is [met-calibration].</p>`,

    buildup:
      `<p>Start from a single cutoff, called a <b>threshold</b>: say "positive" when the score is at least the threshold, "negative" otherwise. At any one threshold you can count four things — true positives (TP), false positives (FP), true negatives (TN), false negatives (FN) — and from them two rates:</p>
       <ul>
         <li><b>TPR</b> (true positive rate) $= \\dfrac{TP}{TP+FN}$ — the fraction of real positives you catch. Same thing as <b>recall</b>.</li>
         <li><b>FPR</b> (false positive rate) $= \\dfrac{FP}{FP+TN}$ — the fraction of real negatives you wrongly flag (the false-alarm rate).</li>
         <li><b>Precision</b> $= \\dfrac{TP}{TP+FP}$ — among everything you flagged positive, the fraction that really is.</li>
       </ul>
       <p>Now slide the threshold from very strict (flag almost nothing) to very loose (flag almost everything). Each setting gives a different (FPR, TPR) point and a different (recall, precision) point. Trace those points and you get the two key <b>curves</b>:</p>
       <ul>
         <li>The <b>ROC (Receiver Operating Characteristic) curve</b> plots TPR (up) against FPR (right). The name is historical — it comes from World War II radar operators tuning a detector's "operating characteristic".</li>
         <li>The <b>Precision–Recall (PR) curve</b> plots precision (up) against recall (right).</li>
       </ul>
       <p>A single curve is hard to compare, so we summarize each by the <b>area underneath it</b> — that is where AUC (Area Under the Curve) comes from. The rest of this page is variations on "summarize the curve" plus two metrics that grade the probabilities directly.</p>`,

    symbols: [
      { sym: "score $s$", desc: "the model's output for one example; higher means 'more likely positive'. A probability is a score forced into $[0,1]$." },
      { sym: "threshold $t$", desc: "the cutoff: predict 'positive' when $s \\ge t$. Lower it to catch more positives at the cost of more false alarms." },
      { sym: "TPR / recall", desc: "true positive rate $= \\dfrac{TP}{TP+FN}$, the fraction of real positives you catch (ROC y-axis, PR x-axis)." },
      { sym: "FPR", desc: "false positive rate $= \\dfrac{FP}{FP+TN}$, the fraction of real negatives wrongly flagged (ROC x-axis)." },
      { sym: "precision", desc: "$\\dfrac{TP}{TP+FP}$, the fraction of your positive flags that are correct (PR y-axis)." },
      { sym: "AUC", desc: "Area Under a Curve, between 0 and 1. For ROC, $0.5$ = random, $1.0$ = perfect. Higher is better." },
      { sym: "$\\hat p_i$", desc: "the model's predicted probability that example $i$ is positive (used by log loss and Brier)." },
      { sym: "$y_i$", desc: "the true label of example $i$: $1$ if positive, $0$ if negative." }
    ],

    formula:
      `$$ \\text{ROC-AUC} = \\Pr\\big(s_{+} > s_{-}\\big), \\qquad \\text{Gini} = 2\\,\\text{AUC} - 1, \\qquad \\text{KS} = \\max_{t}\\big(\\text{TPR}(t) - \\text{FPR}(t)\\big) $$
       $$ \\text{Average Precision} = \\sum_{k}\\big(R_k - R_{k-1}\\big)\\,P_k \\quad(\\text{area under the PR curve}) $$
       $$ \\text{Log loss} = -\\frac{1}{n}\\sum_{i=1}^{n}\\Big[y_i\\log \\hat p_i + (1-y_i)\\log(1-\\hat p_i)\\Big], \\qquad \\text{Brier} = \\frac{1}{n}\\sum_{i=1}^{n}\\big(\\hat p_i - y_i\\big)^2 $$`,

    whatItDoes:
      `<p>Here is every metric in the family, defined in plain words. Read the formula block above alongside it.</p>
       <ul>
         <li><b>ROC-AUC (Area Under the ROC Curve).</b> The area under the TPR-vs-FPR curve. It has a beautiful plain meaning: it is exactly the <b>probability that a randomly chosen positive scores higher than a randomly chosen negative</b> ($\\Pr(s_+ > s_-)$ above). $1.0$ = the model always ranks positives above negatives; $0.5$ = no better than a coin flip; below $0.5$ = the ranking is upside-down.</li>
         <li><b>PR-AUC / Average Precision (AP).</b> The area under the precision-vs-recall curve. <code>average_precision_score</code> computes it as a weighted sum of precisions, each weighted by how much recall increased at that step (the AP formula above). The baseline here is <i>not</i> 0.5 — it is the <b>positive rate</b> of the data (a random model's precision is just the fraction of positives). On a 5%-positive problem, AP = 0.05 is "no skill", and AP = 0.4 is a real signal.</li>
         <li><b>Partial AUC.</b> Sometimes you only care about one corner of the ROC curve — for example the region where the false-positive rate is below 10%, because beyond that you'd alarm too often to be usable. <b>Partial AUC</b> is the area under <i>just that slice</i> of the curve (often rescaled back to a 0–1 range). It answers "how good is the model in the operating region I can actually live in?"</li>
         <li><b>Gini coefficient.</b> A simple rescaling of ROC-AUC: $\\text{Gini} = 2\\,\\text{AUC} - 1$. It maps $[0.5, 1.0]$ onto $[0, 1]$, so a random model is $0$ and a perfect one is $1$. Credit scoring quotes Gini because that "random = 0" scale is easier to read. (It is the same idea as — but not numerically identical to — the income-inequality Gini.)</li>
         <li><b>KS (Kolmogorov–Smirnov) statistic.</b> The <b>biggest vertical gap</b> between the score distribution of positives and that of negatives — equivalently $\\max_t(\\text{TPR}(t)-\\text{FPR}(t))$, the widest the ROC curve ever gets above the diagonal. A KS of $0.4$ means that at the best cutoff, the model separates 40 percentage points more positives than negatives. Higher = the two classes' scores pull apart more cleanly.</li>
         <li><b>Lift &amp; gain charts.</b> Sort everyone by score, highest first. The <b>gain</b> curve plots "what fraction of all the real positives have I captured" against "what fraction of the population have I looked at". <b>Lift</b> at a depth is how many times more positives you find there than random selection would — lift = (positives in your top $k$%) ÷ (positives a random $k$% would have). A lift of 5 in the top 10% means your model is 5× better than random at concentrating the positives. Marketers and fraud teams use these to decide how deep to act.</li>
         <li><b>Log loss (cross-entropy).</b> Grades the <i>probabilities</i>, not the ranking. For each example it takes the negative logarithm of the probability the model assigned to the <i>true</i> class, then averages. Being right and confident is cheap; being wrong and confident is brutally expensive (because $-\\log$ of a tiny number is huge). Lower is better; $0$ is perfect.</li>
         <li><b>Brier score.</b> The plain <b>mean squared error of the probabilities</b>: average of $(\\hat p_i - y_i)^2$. Like log loss it wants honest probabilities, but it stays bounded between 0 and 1 and punishes overconfidence far less harshly, so a single disaster can't blow it up. Lower is better; $0$ is perfect, and predicting the base rate for everyone gives the "no-skill" Brier to beat.</li>
       </ul>
       <p><b>Choosing a threshold from these.</b> AUC-style metrics deliberately ignore the cutoff, but eventually you must pick one. Three common recipes: (1) <b>cost-based</b> — pick the threshold that minimizes your real cost, e.g. "a missed fraud costs 10× a false alarm", which slides you along the ROC curve to the cheapest point; (2) <b>Youden's J</b> — the threshold that maximizes $\\text{TPR}-\\text{FPR}$, which is exactly the <b>KS</b> point on the ROC curve; (3) <b>fix one rate</b> — pick the threshold that gives the precision (or recall, or top-$k$ budget) the business requires, then read off the rest. The point: the threshold is a <i>separate</i> decision the AUC never made for you.</p>`,

    derivation:
      `<p><b>Why ROC-AUC equals "$\\Pr$(a positive outranks a negative)".</b> Sweep the threshold from $+\\infty$ down to $-\\infty$. Each time the threshold passes a real <i>positive</i>'s score, the curve steps <b>up</b> (one more true positive caught); each time it passes a <i>negative</i>'s score, the curve steps <b>right</b> (one more false alarm). The area to the left of each "up" step counts how many negatives that positive has already beaten. Add it all up and the area equals (number of positive-over-negative pairs ranked correctly) ÷ (total pairs) — exactly the probability that a random positive outscores a random negative. That is why AUC cares only about <i>order</i>, never the raw score values, and why it is threshold-free.</p>
       <p><b>Why PR-AUC reacts to imbalance but ROC-AUC doesn't.</b> Look at the x-axes. ROC's FPR divides by the total negatives: $\\frac{FP}{FP+TN}$. When negatives vastly outnumber positives, $TN$ is enormous, so even thousands of false positives barely raise FPR — the curve looks great. Precision, on the PR curve, divides by the flags you actually made: $\\frac{TP}{TP+FP}$. Those same thousands of false positives sit right next to the few true positives in the denominator and crush precision. So the PR curve <i>feels</i> the false alarms that ROC hides. That is the core reason <b>PR-AUC beats ROC-AUC under heavy imbalance</b>: it is denominated in the thing you care about (your flags), not in the ocean of easy negatives.</p>
       <p><b>Why log loss punishes confident mistakes so hard.</b> The cost of an example is $-\\log(\\text{prob it gave the true class})$. As that probability heads toward $0$, $-\\log$ heads toward $+\\infty$. So a model that says "99.9% negative" about an actual positive pays about $-\\log(0.001)\\approx 6.9$, while a humble "60% negative" wrong guess pays only $-\\log(0.4)\\approx 0.92$. Log loss therefore rewards models that hedge appropriately and express genuine uncertainty.</p>`,

    example:
      `<p><b>A tiny ranking example for ROC-AUC.</b> Four cases. Two real positives score $0.90$ and $0.60$; two real negatives score $0.70$ and $0.30$. There are $2\\times 2 = 4$ positive–negative pairs:</p>
       <ul class="steps">
         <li>$0.90$ vs $0.70$ → positive wins ✓</li>
         <li>$0.90$ vs $0.30$ → positive wins ✓</li>
         <li>$0.60$ vs $0.70$ → positive loses ✗ (the negative outscored it)</li>
         <li>$0.60$ vs $0.30$ → positive wins ✓</li>
       </ul>
       <p>Three of four pairs are ranked correctly, so <b>ROC-AUC $= 3/4 = 0.75$</b>. The matching <b>Gini $= 2(0.75) - 1 = 0.5$</b>. Notice we never used the exact score values — only who outscored whom.</p>
       <p><b>A tiny probability example for log loss &amp; Brier.</b> Suppose a true positive ($y=1$) gets probability $\\hat p = 0.8$, and a true negative ($y=0$) gets $\\hat p = 0.3$.</p>
       <ul class="steps">
         <li>Log loss $= -\\tfrac{1}{2}\\big[\\log(0.8) + \\log(1-0.3)\\big] = -\\tfrac{1}{2}\\big[\\log 0.8 + \\log 0.7\\big] \\approx -\\tfrac{1}{2}(-0.223 - 0.357) = 0.290$.</li>
         <li>Brier $= \\tfrac{1}{2}\\big[(0.8-1)^2 + (0.3-0)^2\\big] = \\tfrac{1}{2}(0.04 + 0.09) = 0.065$.</li>
       </ul>
       <p>Now make the negative <i>overconfidently wrong</i>: $\\hat p = 0.99$ while $y=0$. Its log-loss term jumps to $-\\log(0.01) \\approx 4.6$, dragging the average from $0.29$ to about $2.4$ — one bad call dominating. Its Brier term only moves to $(0.99)^2 \\approx 0.98$. That contrast is exactly the "log loss explodes, Brier stays bounded" behavior from the pitfalls.</p>`,

    demo: function (host) {
      function C() {
        var s = getComputedStyle(document.documentElement);
        var g = function (n, d) { return (s.getPropertyValue(n) || d).trim(); };
        return { ink: g("--ink", "#e6edf3"), dim: g("--ink-dim", "#9aa7b4"), accent: g("--accent", "#4ea1ff"), accent2: g("--accent-2", "#7ee787"), warn: g("--warn", "#ffb454"), purple: g("--purple", "#c89bff"), border: g("--border", "#2a3340") };
      }
      // Real-ish breast-cancer-style separable scores. Two gaussians; positives are rare on the SLIDER.
      var negMu = 0.35, posMu = 0.68, sd = 0.13;
      function gauss(x, mu) { var z = (x - mu) / sd; return Math.exp(-0.5 * z * z); }
      var prevalence = 0.5; // fraction positive in the slider scenario
      function counts(t) {
        var stepN = 400, lo = -0.2, hi = 1.2, dx = (hi - lo) / stepN;
        var sumP = 0, sumN = 0, tp = 0, fp = 0, i, x, gp, gn;
        for (i = 0; i < stepN; i++) { x = lo + (i + 0.5) * dx; sumP += gauss(x, posMu); sumN += gauss(x, negMu); }
        for (i = 0; i < stepN; i++) { x = lo + (i + 0.5) * dx; gp = gauss(x, posMu); gn = gauss(x, negMu); if (x >= t) { tp += gp; fp += gn; } }
        var Ppos = prevalence, Pneg = 1 - prevalence;
        var TP = (tp / sumP) * Ppos, FP = (fp / sumN) * Pneg;
        var FN = Ppos - TP, TN = Pneg - FP;
        var tpr = (TP + FN) > 0 ? TP / (TP + FN) : 0;
        var fpr = (FP + TN) > 0 ? FP / (FP + TN) : 0;
        var prec = (TP + FP) > 0 ? TP / (TP + FP) : 1;
        return { tpr: tpr, fpr: fpr, prec: prec };
      }
      var thresh = 0.5;
      var cv = document.createElement("canvas"); cv.width = 640; cv.height = 150; cv.style.maxWidth = "100%"; host.appendChild(cv);
      var ctx = cv.getContext("2d");
      var readout = document.createElement("div"); readout.className = "out"; readout.style.marginTop = "6px"; host.appendChild(readout);
      var ctrl = document.createElement("div"); ctrl.style.marginTop = "6px"; ctrl.style.fontSize = "13px";
      ctrl.innerHTML = "Positive rate (prevalence): <input id='prev' type='range' min='2' max='50' value='50' style='vertical-align:middle'> <span id='prevv'></span>";
      host.appendChild(ctrl);

      function drawDist() {
        var col = C(); ctx.clearRect(0, 0, 640, 150);
        var W = 640, padL = 12, padR = 12, y0 = 12, y1 = 124;
        function PX(x) { return padL + x * (W - padL - padR); }
        function PY(v) { return y1 - v * (y1 - y0); }
        ctx.strokeStyle = col.border; ctx.beginPath(); ctx.moveTo(PX(0), y1); ctx.lineTo(PX(1), y1); ctx.stroke();
        function curve(mu, color, scale) {
          ctx.beginPath(); var first = true, i, x;
          for (i = 0; i <= 200; i++) { x = i / 200; var Y = PY(gauss(x, mu) * scale); if (first) { ctx.moveTo(PX(x), Y); first = false; } else ctx.lineTo(PX(x), Y); }
          ctx.lineTo(PX(1), y1); ctx.lineTo(PX(0), y1); ctx.closePath(); ctx.fillStyle = color + "33"; ctx.fill();
          ctx.strokeStyle = color; ctx.lineWidth = 2; ctx.beginPath(); first = true;
          for (i = 0; i <= 200; i++) { x = i / 200; var Yy = PY(gauss(x, mu) * scale); if (first) { ctx.moveTo(PX(x), Yy); first = false; } else ctx.lineTo(PX(x), Yy); }
          ctx.stroke();
        }
        curve(negMu, col.accent, 1 - prevalence);
        curve(posMu, col.accent2, prevalence);
        var tx = PX(thresh);
        ctx.strokeStyle = col.warn; ctx.lineWidth = 2.5; ctx.beginPath(); ctx.moveTo(tx, y0); ctx.lineTo(tx, y1); ctx.stroke();
        ctx.fillStyle = col.warn; ctx.beginPath(); ctx.arc(tx, y0 + 6, 6, 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = col.dim; ctx.font = "12px sans-serif"; ctx.textAlign = "left";
        ctx.fillText("negatives (scaled by their share)", PX(0.02), y0 + 12);
        ctx.textAlign = "right"; ctx.fillText("positives", PX(0.98), y0 + 12);
        ctx.textAlign = "center"; ctx.fillStyle = col.warn; ctx.fillText("threshold (drag the bar)", tx, y1 + 18);
      }
      function render() {
        drawDist(); var c = counts(thresh);
        readout.innerHTML = "At this threshold: <b>recall (TPR)</b> = " + c.tpr.toFixed(3) + ", <b>FPR</b> = " + c.fpr.toFixed(3) + ", <b>precision</b> = " + c.prec.toFixed(3) + ". Lower the positive rate and watch <b>precision collapse</b> even though recall and FPR barely move — that is exactly why ROC-AUC (which uses FPR) can look fine while PR-AUC (which uses precision) tanks under imbalance.";
        document.getElementById("prevv").textContent = Math.round(prevalence * 100) + "%";
      }
      function setFromX(clientX) {
        var r = cv.getBoundingClientRect(); var scale = cv.width / r.width;
        var x = (clientX - r.left) * scale; var t = (x - 12) / (640 - 24);
        thresh = Math.max(0.0, Math.min(1.0, t)); render();
      }
      var dragging = false;
      cv.addEventListener("mousedown", function (e) { dragging = true; setFromX(e.clientX); });
      window.addEventListener("mousemove", function (e) { if (dragging) setFromX(e.clientX); });
      window.addEventListener("mouseup", function () { dragging = false; });
      cv.addEventListener("touchstart", function (e) { dragging = true; if (e.touches[0]) setFromX(e.touches[0].clientX); });
      cv.addEventListener("touchmove", function (e) { if (dragging && e.touches[0]) { setFromX(e.touches[0].clientX); e.preventDefault(); } });
      ctrl.querySelector("#prev").addEventListener("input", function (e) { prevalence = (+e.target.value) / 100; render(); });
      render();
    },

    practice: [
      {
        q: `A fraud model on data that is 1% fraud reports ROC-AUC = 0.96 but Average Precision (PR-AUC) = 0.22. Is this a good model, and which number do you trust?`,
        steps: [
          { do: `Recall what each metric is denominated in.`, why: `ROC-AUC uses FPR = FP/(FP+TN); with 99% negatives, TN is huge, so false alarms barely register and ROC-AUC stays high.` },
          { do: `Compare AP to the right baseline.`, why: `A no-skill model's AP equals the positive rate, here 0.01. So AP = 0.22 is 22× better than random — real signal, but far from the "0.96" ROC implies.` },
          { do: `Decide what matters operationally.`, why: `If you act on flagged cases, precision (PR-AUC's currency) is what you live with. The 0.96 is hiding a wall of false positives.` }
        ],
        answer: `The model has genuine signal but is mediocre at the precision you'll actually experience. Under 1% imbalance, <b>trust the PR-AUC (0.22 vs a 0.01 baseline)</b>; the ROC-AUC of 0.96 is the classic "looks great under imbalance" mirage.`
      },
      {
        q: `Two models have the same ROC-AUC = 0.90. Model A has log loss 0.35; Model B has log loss 0.80. You need to multiply each predicted probability by a dollar amount. Which model do you ship?`,
        steps: [
          { do: `Separate ranking from probability quality.`, why: `Equal ROC-AUC means equal ranking ability — both order positives above negatives equally well.` },
          { do: `Read the log loss as a calibration signal.`, why: `Log loss grades the actual probabilities. B's higher loss means its probabilities are less honest (likely overconfident).` },
          { do: `Match the metric to the use case.`, why: `Multiplying a probability by dollars needs the number to mean what it says, so probability quality is decisive here.` }
        ],
        answer: `Ship <b>Model A</b>. Identical ROC-AUC says they rank equally, but A's much lower log loss means its probabilities are better calibrated — and since you multiply probabilities by money, probability quality (log loss / Brier), not ranking, is what counts. See [met-calibration].`
      },
      {
        q: `Your model gives ROC-AUC = 0.88 but a stakeholder asks "what's the precision and recall of the system we're actually deploying?" Why can't you answer from the AUC, and what do you do?`,
        steps: [
          { do: `State what AUC summarizes.`, why: `ROC-AUC averages over every possible threshold; it deliberately does not commit to one.` },
          { do: `Identify the missing decision.`, why: `Precision and recall are properties of a single chosen threshold, which the AUC never picked.` },
          { do: `Choose a threshold deliberately.`, why: `Use a cost-based cutoff, Youden's J (the KS point), or fix a required precision/recall — then read off the confusion-matrix numbers there.` }
        ],
        answer: `AUC is <b>threshold-free</b>, so it says nothing about any single operating point. To answer, you must <b>pick a threshold</b> (by cost, by Youden's J / KS, or by a required precision) and then report precision and recall computed <i>at that threshold</i>.`
      }
    ]
  });

  window.CODE["met-classification-prob"] = {
    lib: "scikit-learn",
    runnable: true,
    packages: ["numpy", "scikit-learn"],
    explain: `<p>All the score-based classification metrics come straight from <code>sklearn.metrics</code>. From one set of predicted probabilities you get the ROC and PR curves, their AUCs, and the two probability-quality scores (log loss, Brier).</p>`,
    code: `import numpy as np
from sklearn.datasets import load_breast_cancer
from sklearn.linear_model import LogisticRegression
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler
from sklearn.metrics import (roc_curve, roc_auc_score,
                             precision_recall_curve, average_precision_score,
                             log_loss, brier_score_loss)

X, y = load_breast_cancer(return_X_y=True)          # y: 1 = benign (positive), 0 = malignant
Xtr, Xte, ytr, yte = train_test_split(
    X, y, test_size=0.3, random_state=0, stratify=y)

clf = LogisticRegression(max_iter=5000)
clf.fit(StandardScaler().fit_transform(Xtr), ytr)   # scale for a stable fit
p = clf.predict_proba(StandardScaler().fit(Xtr).transform(Xte))[:, 1]

# --- ranking metrics (threshold-free) ---
auc  = roc_auc_score(yte, p)                        # P(random positive outranks random negative)
ap   = average_precision_score(yte, p)              # PR-AUC; baseline = positive rate
gini = 2 * auc - 1                                  # rescale: random = 0, perfect = 1
fpr, tpr, roc_t = roc_curve(yte, p)
ks   = np.max(tpr - fpr)                            # Kolmogorov-Smirnov statistic
prec, rec, pr_t = precision_recall_curve(yte, p)

# --- probability-quality metrics ---
ll   = log_loss(yte, p)                             # cross-entropy; punishes confident mistakes
brier = brier_score_loss(yte, p)                    # mean squared error of the probabilities

print(f"ROC-AUC {auc:.4f}  PR-AUC/AP {ap:.4f}  Gini {gini:.4f}  KS {ks:.4f}")
print(f"log loss {ll:.4f}  Brier {brier:.4f}")

# --- choose a threshold: Youden's J (the KS point on the ROC curve) ---
best = roc_t[np.argmax(tpr - fpr)]
print(f"threshold maximizing TPR - FPR: {best:.3f}")`
  };

  window.CODEVIZ["met-classification-prob"] = {
    question: "Take 50 scored examples (25 positive, 25 negative, with overlapping scores) and sweep the threshold. What do ROC-AUC, the precision–recall curve, and the two probability-quality losses (log loss, Brier) actually look like — and why does one loss explode while the other stays calm?",
    charts: [
      {
        type: "roc",
        title: "ROC curve: true positive rate vs false positive rate as the threshold sweeps high to low (AUC = 0.859)",
        auc: 0.859,
        points: [[0,0],[0,0.04],[0,0.08],[0,0.12],[0,0.16],[0,0.2],[0,0.24],[0,0.28],[0.04,0.28],[0.04,0.32],[0.04,0.36],[0.04,0.4],[0.04,0.44],[0.04,0.48],[0.08,0.48],[0.08,0.52],[0.08,0.56],[0.08,0.6],[0.12,0.6],[0.12,0.64],[0.12,0.68],[0.16,0.68],[0.16,0.72],[0.2,0.72],[0.2,0.76],[0.24,0.76],[0.24,0.8],[0.28,0.8],[0.28,0.84],[0.32,0.84],[0.32,0.88],[0.36,0.88],[0.4,0.88],[0.4,0.92],[0.44,0.92],[0.48,0.92],[0.52,0.92],[0.52,0.96],[0.56,0.96],[0.6,0.96],[0.64,0.96],[0.68,0.96],[0.72,0.96],[0.72,1],[0.76,1],[0.8,1],[0.84,1],[0.88,1],[0.92,1],[0.96,1],[1,1]]
      },
      {
        type: "line",
        title: "Precision-Recall curve — Average Precision (PR-AUC) = 0.866, no-skill baseline = 0.5",
        xlabel: "recall = TP/(TP+FN)",
        ylabel: "precision = TP/(TP+FP)",
        series: [
          { name: "PR curve (AP = 0.866)", color: "#7ee787", points: [[0.04,1],[0.08,1],[0.12,1],[0.16,1],[0.2,1],[0.24,1],[0.28,1],[0.28,0.875],[0.32,0.889],[0.36,0.9],[0.4,0.909],[0.44,0.917],[0.48,0.923],[0.48,0.857],[0.52,0.867],[0.56,0.875],[0.6,0.882],[0.6,0.833],[0.64,0.842],[0.68,0.85],[0.68,0.81],[0.72,0.818],[0.72,0.783],[0.76,0.792],[0.76,0.76],[0.8,0.769],[0.8,0.741],[0.84,0.75],[0.84,0.724],[0.88,0.733],[0.88,0.71],[0.88,0.688],[0.92,0.697],[0.92,0.676],[0.92,0.657],[0.92,0.639],[0.96,0.649],[0.96,0.632],[0.96,0.615],[0.96,0.6],[0.96,0.585],[0.96,0.571],[1,0.581],[1,0.568],[1,0.556],[1,0.543],[1,0.532],[1,0.521],[1,0.51],[1,0.5]] },
          { name: "no-skill (positive rate 0.5)", color: "#9aa7b4", points: [[0.0, 0.5], [1.0, 0.5]] }
        ]
      },
      {
        type: "line",
        title: "Log loss vs Brier: per-example loss as the predicted probability moves, for a TRUE positive (y=1)",
        xlabel: "predicted probability p (truth is positive)",
        ylabel: "loss contributed by this example",
        series: [
          { name: "log loss term = -ln(p)", color: "#ff7b72", points: [[0.05, 2.996], [0.1, 2.303], [0.2, 1.609], [0.3, 1.204], [0.4, 0.916], [0.5, 0.693], [0.6, 0.511], [0.7, 0.357], [0.8, 0.223], [0.9, 0.105], [0.95, 0.051], [0.99, 0.01]] },
          { name: "Brier term = (p-1)^2", color: "#4ea1ff", points: [[0.05, 0.902], [0.1, 0.81], [0.2, 0.64], [0.3, 0.49], [0.4, 0.36], [0.5, 0.25], [0.6, 0.16], [0.7, 0.09], [0.8, 0.04], [0.9, 0.01], [0.95, 0.003], [0.99, 0.0]] }
        ]
      }
    ],
    caption: "All numbers come from one concrete set of 50 scored examples: 25 positives and 25 negatives whose scores overlap (positives score higher on average, but not perfectly). The ROC curve plots true positive rate (y) against false positive rate (x) as the threshold sweeps from high to low — it bows up toward the top-left corner; the dashed diagonal is a coin-flip model (AUC 0.5) and the green curve's area is ROC-AUC = 0.859 = P(a random positive outscores a random negative). The precision–recall curve traces Average Precision = 0.866 (a no-skill model would sit flat at the 0.5 positive rate). The third chart fixes one true positive (y=1) and slides its predicted probability: the red log-loss term −ln(p) shoots toward infinity as p→0 (a confident wrong call dominates the average), while the blue Brier term (p−1)^2 can never exceed 1. That is the 'log loss explodes, Brier stays bounded' contrast from the pitfalls, drawn out.",
    code: `import numpy as np
from scipy.stats import norm

# 50 concrete scored examples, NO randomness (deterministic quantiles).
# Negatives ~ N(-0.75, 1) and positives ~ N(+0.75, 1), each squashed through a
# sigmoid into a score in (0, 1). The two clouds overlap -> a realistic ROC.
def cloud(n, mean):
    q = (np.arange(n) + 0.5) / n            # evenly spaced quantiles
    return np.round(1 / (1 + np.exp(-(mean + norm.ppf(q)))), 3)

neg = cloud(25, -0.75)                       # 25 negatives, lower scores
pos = cloud(25, 0.75)                        # 25 positives, higher scores
s = np.concatenate([pos, neg])
y = np.concatenate([np.ones(25), np.zeros(25)]).astype(int)
P, N = 25, 25

# --- ROC-AUC: pairwise = P(random positive outscores random negative) ---
auc = np.mean([1.0 if a > b else 0.5 if a == b else 0.0
               for a in pos for b in neg])
print("ROC-AUC:", round(auc, 4))            # 0.8592

# --- threshold sweep -> ROC (FPR, TPR) and PR (recall, precision) points ---
roc, pr = [(0.0, 0.0)], []
for t in sorted(set(s), reverse=True):
    pred = s >= t
    tp = np.sum(pred & (y == 1)); fp = np.sum(pred & (y == 0))
    roc.append((round(fp / N, 3), round(tp / P, 3)))
    prec = tp / (tp + fp) if tp + fp else 1.0
    pr.append((round(tp / P, 3), round(prec, 3)))
roc.append((1.0, 1.0))
ap, prev = 0.0, 0.0
for r, prc in pr:
    ap += (r - prev) * prc; prev = r
print("Average Precision:", round(ap, 4))   # 0.8657

# --- log loss vs Brier as a function of predicted prob, for a true positive ---
grid = [0.05,0.1,0.2,0.3,0.4,0.5,0.6,0.7,0.8,0.9,0.95,0.99]
for p in grid:
    print(f"p={p:<4} -ln(p)={-np.log(p):.3f}  (p-1)^2={(p-1)**2:.3f}")`
  };
})();
