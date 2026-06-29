/* =====================================================================
   METRICS & EVALUATION — BEGINNER lesson.
   "Metrics for time-to-event (survival) & anomaly detection."
   Two families: survival analysis with censoring (C-index, time-dependent
   AUC, IPCW Brier score + IBS) and rare-event / anomaly detection
   (PR-AUC, precision/recall at a budget, ROC-AUC, detection delay).
   Self-contained: registers the lesson, its CODE, and its CODEVIZ.
   ===================================================================== */
(function () {
  window.LESSONS.push({
    id: "met-survival",
    title: "Survival & anomaly-detection metrics",
    tagline: "Two hard cases: scoring WHEN an event happens when some events have not happened yet, and finding rare events without being fooled by accuracy.",
    module: "Metrics & Evaluation — measuring models, data & statistics",
    prereqs: ["met-foundations", "ml-classification-metrics", "ml-roc-auc"],

    whenToUse:
      `<p>This lesson covers two problems where the usual metrics quietly break, and the special metrics built to fix them.</p>
       <p><b>Survival analysis</b> — you predict <i>when</i> an event will happen (a machine fails, a patient relapses, a customer cancels), and for some rows the event <i>has not happened yet</i>. That "not yet" is called <b>censoring</b>, and ignoring it biases every naive metric. Reach for:</p>
       <ul>
         <li><b>Harrell's C-index</b> (Concordance index) or <b>Uno's C</b> — when you only care about <i>ranking</i> risk: did the model put the person who failed sooner at higher risk? This is the survival analog of ROC-AUC (Receiver Operating Characteristic — Area Under the Curve).</li>
         <li><b>Time-dependent AUC</b> — when you want that ranking quality <i>at a specific horizon</i> (e.g. "who is high-risk within 1 year?").</li>
         <li><b>IPCW Brier score</b> (Inverse-Probability-of-Censoring Weighting) and the <b>IBS</b> (Integrated Brier Score) — when you need the predicted survival <i>probabilities</i> to be calibrated, not just ranked.</li>
       </ul>
       <p><b>Anomaly / rare-event detection</b> — the positive class (fraud, an intrusion, a defect) is a tiny fraction of the data. Here <b>accuracy is useless</b> (a model that flags nothing scores 99.9%). Reach for:</p>
       <ul>
         <li><b>PR-AUC</b> (Precision–Recall Area Under the Curve, also called Average Precision) — the headline metric for rare positives.</li>
         <li><b>Precision / recall at a fixed alarm budget</b> — "if we can investigate 100 alerts a day, how many are real?"</li>
         <li><b>ROC-AUC</b> — a ranking summary, but read it with care on very rare events.</li>
         <li><b>Detection delay</b> — for streams: once the anomaly starts, how long until we raise the alarm?</li>
       </ul>
       <p><b>Avoid:</b> plain accuracy on rare events; any naive survival metric that drops censored rows; and picking an alarm threshold with no budget in mind.</p>`,

    application:
      `<p><b>Survival metrics</b> run reliability and medicine: predicting time-to-failure for jet engines and hard drives, time-to-relapse for cancer patients, time-to-churn for subscribers. The data is always censored — the study ends, the customer is still active, the engine has not failed yet — so the field built metrics that use the censored rows instead of throwing them away.</p>
       <p><b>Anomaly metrics</b> run fraud, security, and quality control: a payments team watches PR-AUC and precision at its daily review budget; an intrusion-detection team watches detection delay (every minute an attacker is undetected costs money); a factory watches recall at a fixed false-alarm rate. In all of them the positives are rare, so the team reports precision–recall numbers, never accuracy.</p>`,

    pitfalls:
      `<ul>
         <li><b>Ignoring censoring.</b> Tell: you computed a survival metric after deleting every row whose event "has not happened yet," or you treated censored times as if the event occurred then. Both bias the result — you systematically drop the longest survivors or invent fake events. Fix: use censoring-aware metrics (C-index, IPCW Brier / IBS) that keep those rows and weight them correctly.</li>
         <li><b>A C-index near 0.5.</b> Tell: your concordance is about $0.50$. That is the coin-flip value — the model ranks risk no better than random. Anything at or below $0.5$ means no useful ranking signal (and below $0.5$ means the ranking is reversed). Aim well above $0.5$; only $1.0$ is a perfect ranking.</li>
         <li><b>Accuracy on imbalanced anomaly data.</b> Tell: "our detector is 99.9% accurate" on data that is 99.9% normal. A do-nothing model that never alarms scores exactly the same. Fix: report PR-AUC and precision/recall at your alarm budget instead — they measure skill at finding the rare positives.</li>
         <li><b>Choosing a threshold without a budget.</b> Tell: you set the alarm cutoff at $0.5$ "because it is the default," with no link to how many alerts the team can actually handle. Fix: pick the threshold from the operating budget — the top-$k$ alerts per day, or a fixed false-alarm rate — and report precision and recall <i>at that point</i>.</li>
       </ul>`,

    bigIdea:
      `<p>Both families exist because a normal metric would either throw away information or be gamed by the majority class.</p>
       <p><b>Survival.</b> Suppose you study 100 patients for 5 years and ask "when does each relapse?". By year 5, many have <i>not</i> relapsed. You do not know their true relapse time — only that it is <i>longer than 5 years</i>. That is <b>right-censoring</b>: you know a lower bound on the event time, not the event time itself. A censored row is real data ("survived at least this long"), and the right metrics use it.</p>
       <p>For ranking, the key idea is <b>concordance</b>: take two patients you <i>can</i> compare (you know which one had the event first), and ask whether the model gave the earlier one the higher risk. The fraction of comparable pairs the model orders correctly is the <b>C-index</b> — the survival twin of ROC-AUC.</p>
       <p><b>Anomaly detection.</b> When positives are 0.1% of the data, accuracy is dominated by the trivial 99.9% of negatives. The fix is to stop counting correct-vs-wrong overall and instead measure, among the alarms you raise, how many are real (<b>precision</b>) and, among the real events, how many you catch (<b>recall</b>). Summarizing precision and recall across all thresholds gives <b>PR-AUC</b>.</p>`,

    buildup:
      `<p><b>Censoring, concretely.</b> Each row has an observed time $t_i$ and an indicator $\\delta_i$. If $\\delta_i = 1$, the event happened at $t_i$ (a relapse, a failure). If $\\delta_i = 0$, the row is <b>censored</b>: at $t_i$ the patient was still event-free, so the true event time is unknown but $> t_i$. You must keep these rows — dropping them throws away the long survivors and biases the answer.</p>
       <p><b>Comparable pairs.</b> Two rows $i, j$ are <i>comparable</i> if you can tell who had the event first. If $i$ had the event at $t_i$ and $j$'s observed time is later ($t_j > t_i$), the pair is comparable: $i$ definitely failed first. A pair where the earlier time is censored is <i>not</i> comparable (you cannot tell who fails first). The C-index only scores comparable pairs.</p>
       <p><b>Harrell's C-index.</b> For each comparable pair, the model gives a <b>risk score</b> $\\hat r$ (higher = expected to fail sooner). The pair is <b>concordant</b> if the one who failed first got the higher risk. The C-index is the fraction of comparable pairs that are concordant (ties count as half). $C = 1$ is perfect ranking; $C = 0.5$ is random.</p>
       <p><b>Uno's C.</b> Harrell's C can be slightly biased when censoring is heavy, because the mix of comparable pairs depends on the censoring pattern. <b>Uno's C</b> reweights each pair by the inverse probability of being uncensored (IPCW), giving an estimate that does not drift with the amount of censoring. Same idea — concordant pairs — just censoring-corrected.</p>
       <p><b>Time-dependent AUC.</b> Fix a horizon $\\tau$ (say 1 year). Label everyone who had the event by $\\tau$ as "positive at $\\tau$." The <b>time-dependent AUC</b> is the ordinary ROC-AUC for separating those positives from the still-event-free at $\\tau$, again with IPCW to handle rows censored before $\\tau$. It answers "how well does the score rank risk <i>at this horizon</i>?"</p>
       <p><b>Brier score with IPCW, and the IBS.</b> The plain <b>Brier score</b> at time $\\tau$ measures calibration: take the predicted survival probability $\\hat S(\\tau \\mid x_i)$ (chance of surviving past $\\tau$) and compare it to what actually happened (survived past $\\tau$ = 1, else 0); square the gap; average. Lower is better. Censored rows break the "what actually happened" label, so we weight each row by the inverse probability that it was still uncensored — that is the <b>IPCW Brier score</b>. Averaging (integrating) it over a range of horizons gives the <b>IBS</b> (Integrated Brier Score), a single calibration number across time.</p>
       <p><b>The anomaly side.</b> A detector outputs an anomaly score per item; a threshold turns it into alarm / no-alarm. Sweep the threshold and you trace two curves: the <b>ROC</b> (recall vs false-alarm rate) and the <b>precision–recall</b> curve. <b>PR-AUC</b> is the area under the precision–recall curve — it focuses entirely on the rare positive class, so it does not get flattered by the huge negative class the way accuracy and (to a lesser degree) ROC-AUC do. <b>Precision@budget</b> reads one point off these curves: keep only the top-$k$ scores (your daily capacity) and report precision and recall there. <b>Detection delay</b> applies to streams: it is the time between when the anomaly truly begins and when the score first crosses the alarm threshold.</p>`,

    symbols: [
      { sym: "$t_i$", desc: "the observed time for row $i$ — either the event time, or the censoring time if the event has not happened yet." },
      { sym: "$\\delta_i$", desc: "the event indicator: $1$ if the event was observed at $t_i$, $0$ if the row is censored (event time unknown, only known to be $> t_i$)." },
      { sym: "$\\hat r_i$", desc: "the model's risk score for row $i$ — higher means expected to have the event sooner." },
      { sym: "$\\hat S(\\tau \\mid x_i)$", desc: "predicted survival probability: the model's chance that row $i$ is still event-free past time $\\tau$." },
      { sym: "$\\tau$", desc: "a fixed time horizon you evaluate at (e.g. 1 year)." },
      { sym: "$C$", desc: "the concordance index: fraction of comparable pairs the model ranks correctly. $1$ = perfect, $0.5$ = random." },
      { sym: "$k$", desc: "the alarm budget: how many of the top-scored items you can actually review (top-$k$)." },
      { sym: "IPCW", desc: "Inverse-Probability-of-Censoring Weighting — reweighting each row by $1/(\\text{prob. still uncensored})$ so censoring does not bias the metric." }
    ],

    formula: `$$ C \\;=\\; \\frac{\\#\\{\\text{comparable pairs ranked correctly}\\}}{\\#\\{\\text{comparable pairs}\\}}, \\qquad \\mathrm{IBS} \\;=\\; \\frac{1}{\\tau_{\\max}}\\!\\int_{0}^{\\tau_{\\max}}\\! \\mathrm{BS}^{\\mathrm{IPCW}}(\\tau)\\, d\\tau $$`,

    whatItDoes:
      `<p>The left formula is the <b>C-index</b> (concordance). Look only at <i>comparable</i> pairs — pairs where you know who had the event first. A pair is "ranked correctly" (concordant) when the one who had the event sooner was given the higher risk score $\\hat r$. Ties in the score count as half a correct pair. Divide concordant pairs by all comparable pairs. $C = 1$ means the risk ranking is always right; $C = 0.5$ means it is no better than a coin flip. This is exactly the ROC-AUC idea, adapted so censored rows can still contribute through the pairs they <i>can</i> be compared in.</p>
       <p>The right formula is the <b>IBS</b> (Integrated Brier Score). $\\mathrm{BS}^{\\mathrm{IPCW}}(\\tau)$ is the IPCW Brier score at one horizon $\\tau$ — the average squared gap between the predicted survival probability and what actually happened, with censoring-correcting weights. Averaging it across all horizons up to $\\tau_{\\max}$ gives one number that summarizes how well-calibrated the survival probabilities are <i>across time</i>. Lower IBS is better; a model that always predicts the overall survival curve scores around $0.25$, and a perfect model scores $0$.</p>`,

    derivation:
      `<p><b>Why concordance is AUC for censored data.</b></p>
       <ul class="steps">
         <li>Ordinary ROC-AUC equals the probability that a randomly chosen positive is scored higher than a randomly chosen negative — a pairwise ranking statistic.</li>
         <li>In survival there is no clean positive/negative; instead the natural pair is "who had the event first?". For two rows where you <i>know</i> the order (one had the event before the other's observed time), the model should give the earlier one the higher risk.</li>
         <li>Censoring is the only wrinkle: if the earlier observed time is censored, you cannot tell who truly fails first, so that pair is excluded. Everything else stays.</li>
         <li>Counting the fraction of these comparable pairs the model orders correctly gives Harrell's C — the same "probability the ranking is right" that AUC measures, restricted to pairs censoring lets you judge.</li>
         <li>Uno's C fixes a subtle bias: because censoring decides which pairs are comparable, heavy censoring can skew the pair mix. Weighting each pair by the inverse probability of being uncensored (IPCW) removes that dependence, so the estimate is stable as censoring changes.</li>
       </ul>
       <p><b>Why IPCW rescues the Brier score.</b> The Brier score needs to know, for each row at horizon $\\tau$, whether it had survived past $\\tau$. For a row censored before $\\tau$ that label is missing. IPCW says: a row that <i>was</i> still uncensored at $\\tau$ stands in for the censored rows like it, so up-weight it by $1/G(\\tau)$, where $G$ is the probability of remaining uncensored that long. This makes the weighted average an unbiased estimate of the Brier score you would get with no censoring. Integrating over $\\tau$ averages calibration across the whole follow-up. $\\blacksquare$</p>
       <p><b>Why PR-AUC over accuracy on rare events.</b> Accuracy and ROC's false-alarm rate both have the giant negative count in their denominator, so the rare positives barely move them. Precision puts the alarms in the denominator instead — so a flood of false alarms drops it immediately — which is exactly the failure mode you care about when positives are rare.</p>`,

    example:
      `<p><b>C-index by hand.</b> Three machines, each with an observed time $t$, an event indicator $\\delta$ ($1$ = failed, $0$ = still running / censored), and the model's risk score $\\hat r$ (higher = expected to fail sooner).</p>
       <table class="extable">
         <caption>The three machines</caption>
         <thead><tr><th>machine</th><th class="num">$t$ (months)</th><th class="num">$\\delta$</th><th>status</th><th class="num">$\\hat r$</th></tr></thead>
         <tbody>
           <tr><td class="row-h">A</td><td class="num">2</td><td class="num">1</td><td>failed</td><td class="num">0.9</td></tr>
           <tr><td class="row-h">B</td><td class="num">5</td><td class="num">1</td><td>failed</td><td class="num">0.3</td></tr>
           <tr><td class="row-h">C</td><td class="num">4</td><td class="num">0</td><td>censored</td><td class="num">0.6</td></tr>
         </tbody>
       </table>
       <p>Check each of the three possible pairs: is it <i>comparable</i> (do we know who failed first?), and if so is it <i>concordant</i> (did the earlier-failing machine get the higher risk?).</p>
       <table class="extable">
         <caption>Every pair, classified</caption>
         <thead><tr><th>pair</th><th>comparable?</th><th>why</th><th>concordant?</th></tr></thead>
         <tbody>
           <tr><td class="row-h">A &amp; B</td><td>yes</td><td>A failed at $2 \\lt 5$, so A failed first</td><td>yes — A's risk $0.9 \\gt 0.3$</td></tr>
           <tr><td class="row-h">A &amp; C</td><td>yes</td><td>A failed at $2 \\lt 4$ (before C's censoring time)</td><td>yes — A's risk $0.9 \\gt 0.6$</td></tr>
           <tr><td class="row-h">B &amp; C</td><td>no</td><td>C censored at $4$, B's event at $5 \\gt 4$: cannot tell who fails first</td><td>—</td></tr>
         </tbody>
       </table>
       <ul class="steps">
         <li><b>Count comparable pairs.</b> {A,B} and {A,C} are comparable; {B,C} is not. So $\\#\\{\\text{comparable}\\} = 2$.</li>
         <li><b>Count those ranked correctly.</b> Both comparable pairs are concordant, so $\\#\\{\\text{ranked correctly}\\} = 2$.</li>
         <li><b>Plug into the formula.</b> $C = \\dfrac{\\#\\{\\text{ranked correctly}\\}}{\\#\\{\\text{comparable}\\}} = \\dfrac{2}{2} = 1.0$ — the model ranked risk perfectly on every pair it could be judged on.</li>
       </ul>
       <p><b>Why accuracy fails on anomalies.</b> A fraud detector sees $10{,}000$ transactions, of which $10$ are fraud. Compare a do-nothing model (flags nothing) against the metrics that matter:</p>
       <table class="extable">
         <caption>Do-nothing detector on 10,000 transactions (10 fraud)</caption>
         <thead><tr><th>metric</th><th>arithmetic</th><th class="num">value</th><th>verdict</th></tr></thead>
         <tbody>
           <tr><td class="row-h">accuracy</td><td>$9990 / 10000$</td><td class="num">0.999</td><td>looks excellent</td></tr>
           <tr><td class="row-h">recall</td><td>$0 / 10$</td><td class="num">0.000</td><td>catches zero fraud</td></tr>
           <tr><td class="row-h">PR-AUC</td><td>$\\approx$ base rate $10/10000$</td><td class="num">0.001</td><td>worthless</td></tr>
         </tbody>
       </table>
       <p>Accuracy is flattered by the $9{,}990$ easy negatives; the precision–recall numbers correctly call the detector worthless.</p>`,

    demo: function (host) {
      function C() {
        var s = getComputedStyle(document.documentElement);
        var g = function (n, d) { return (s.getPropertyValue(n) || d).trim(); };
        return { ink: g("--ink", "#e6edf3"), dim: g("--ink-dim", "#9aa7b4"), accent: g("--accent", "#4ea1ff"), accent2: g("--accent-2", "#7ee787"), warn: g("--warn", "#ffb454"), bad: g("--bad", "#ff7b72"), border: g("--border", "#2a3340"), panel: g("--panel", "#161c24") };
      }
      // Concordance demo: 6 rows with observed time, event/censored, draggable risk score.
      // Reader drags risk scores; we recompute the C-index over comparable pairs live.
      var rows = [
        { name: "A", t: 2, ev: true, r: 0.85 },
        { name: "B", t: 4, ev: false, r: 0.55 },  // censored
        { name: "C", t: 6, ev: true, r: 0.70 },
        { name: "D", t: 8, ev: true, r: 0.40 },
        { name: "E", t: 11, ev: false, r: 0.30 }, // censored
        { name: "F", t: 13, ev: true, r: 0.15 }
      ];
      var info = document.createElement("p"); info.className = "muted";
      info.innerHTML = "Each bar is one machine: <b>length = observed time</b>, dot = its <b>risk score</b> (drag a dot up/down). Solid bars had the event; striped bars are <b>censored</b> (still running). The C-index below counts, over every <i>comparable</i> pair, how often the machine that failed first got the higher risk.";
      host.appendChild(info);
      var cv = document.createElement("canvas"); cv.width = 640; cv.height = 230; cv.style.maxWidth = "100%"; host.appendChild(cv);
      var ctx = cv.getContext("2d");
      var readout = document.createElement("div"); readout.className = "out"; readout.style.marginTop = "6px"; host.appendChild(readout);

      var W = 640, H = 230, padL = 40, padR = 16, padT = 14, padB = 26;
      var maxT = 14, rowH = (H - padT - padB) / rows.length;
      function bx(t) { return padL + (t / maxT) * (W - padL - padR); }
      function rowY(i) { return padT + i * rowH + rowH / 2; }
      // risk score maps to a vertical offset WITHIN the row band for the draggable dot
      function dotX(r) { return padL + r * (W - padL - padR); }

      function cindex() {
        var num = 0, den = 0, i, j;
        for (i = 0; i < rows.length; i++) for (j = 0; j < rows.length; j++) {
          if (i === j) continue;
          // i comparable-before j if i had the event and i.t < j.t
          if (rows[i].ev && rows[i].t < rows[j].t) {
            den++;
            if (rows[i].r > rows[j].r) num++;
            else if (rows[i].r === rows[j].r) num += 0.5;
          }
        }
        return { c: den > 0 ? num / den : 0, num: num, den: den };
      }

      function draw() {
        var col = C(); ctx.clearRect(0, 0, W, H);
        ctx.fillStyle = col.panel; ctx.fillRect(0, 0, W, H);
        // x axis (time) and a risk axis label
        ctx.strokeStyle = col.border; ctx.lineWidth = 1;
        ctx.beginPath(); ctx.moveTo(padL, H - padB); ctx.lineTo(W - padR, H - padB); ctx.stroke();
        ctx.fillStyle = col.dim; ctx.font = "11px sans-serif"; ctx.textAlign = "center";
        ctx.fillText("time / risk-score axis  (left = 0, right = max)", (padL + W - padR) / 2, H - 8);
        var i;
        for (i = 0; i < rows.length; i++) {
          var y = rowY(i), row = rows[i];
          // the observed-time bar
          var color = row.ev ? col.accent : col.dim;
          ctx.fillStyle = color + "55";
          ctx.fillRect(padL, y - rowH * 0.32, bx(row.t) - padL, rowH * 0.64);
          ctx.strokeStyle = color; ctx.lineWidth = 1.5;
          ctx.strokeRect(padL, y - rowH * 0.32, bx(row.t) - padL, rowH * 0.64);
          if (!row.ev) { // striped to mark censored
            ctx.save(); ctx.beginPath(); ctx.rect(padL, y - rowH * 0.32, bx(row.t) - padL, rowH * 0.64); ctx.clip();
            ctx.strokeStyle = col.dim; ctx.lineWidth = 1;
            for (var s = padL - rowH; s < bx(row.t); s += 7) { ctx.beginPath(); ctx.moveTo(s, y - rowH); ctx.lineTo(s + rowH, y + rowH); ctx.stroke(); }
            ctx.restore();
          }
          // label
          ctx.fillStyle = col.ink; ctx.textAlign = "right"; ctx.font = "12px sans-serif";
          ctx.fillText(row.name, padL - 6, y + 4);
          // event end marker
          if (row.ev) { ctx.fillStyle = col.accent2; ctx.beginPath(); ctx.arc(bx(row.t), y, 3.5, 0, Math.PI * 2); ctx.fill(); }
          // draggable risk dot
          var dx = dotX(row.r);
          ctx.fillStyle = col.warn; ctx.beginPath(); ctx.arc(dx, y, 7, 0, Math.PI * 2); ctx.fill();
          ctx.fillStyle = col.panel; ctx.font = "9px sans-serif"; ctx.textAlign = "center";
          ctx.fillText(row.r.toFixed(2), dx, y + 3);
        }
      }
      function render() {
        draw(); var r = cindex(); var col = C();
        var verdict = r.c > 0.8 ? "strong ranking" : (r.c > 0.6 ? "decent ranking" : (r.c >= 0.45 && r.c <= 0.55 ? "≈ random (coin flip)" : "weak / reversed"));
        readout.innerHTML = "Comparable pairs (one failed before the other's observed time): <b>" + r.den + "</b>. Ranked correctly: <b>" + r.num + "</b>. <b>C-index = " + r.c.toFixed(3) + "</b> — " + verdict + ". Drag the orange risk dots: push the machines that fail <i>earliest</i> to the highest risk to climb toward C = 1; flatten or reverse them to fall toward 0.5.";
      }
      var drag = -1;
      function pick(clientX, clientY) {
        var rct = cv.getBoundingClientRect(), sx = cv.width / rct.width, sy = cv.height / rct.height;
        var x = (clientX - rct.left) * sx, y = (clientY - rct.top) * sy, i;
        for (i = 0; i < rows.length; i++) {
          var dx = dotX(rows[i].r), dy = rowY(i);
          if ((x - dx) * (x - dx) + (y - dy) * (y - dy) < 200) return i;
        }
        return -1;
      }
      function moveTo(clientX) {
        if (drag < 0) return;
        var rct = cv.getBoundingClientRect(), sx = cv.width / rct.width;
        var x = (clientX - rct.left) * sx;
        var rr = (x - padL) / (W - padL - padR);
        rows[drag].r = Math.max(0, Math.min(1, rr)); render();
      }
      cv.addEventListener("mousedown", function (e) { drag = pick(e.clientX, e.clientY); });
      window.addEventListener("mousemove", function (e) { if (drag >= 0) moveTo(e.clientX); });
      window.addEventListener("mouseup", function () { drag = -1; });
      cv.addEventListener("touchstart", function (e) { if (e.touches[0]) { drag = pick(e.touches[0].clientX, e.touches[0].clientY); } });
      cv.addEventListener("touchmove", function (e) { if (drag >= 0 && e.touches[0]) { moveTo(e.touches[0].clientX); e.preventDefault(); } });
      window.addEventListener("touchend", function () { drag = -1; });
      render();
    },

    practice: [
      {
        q: `In a 3-year cancer study, patient P relapsed at 14 months and patient Q is still relapse-free when the study ends at 36 months. The model gave P a risk score of 0.7 and Q a risk score of 0.4. Is this pair comparable for the C-index, and is it concordant?`,
        steps: [
          { do: `Classify each row's censoring.`, why: `P had the event (relapse at 14 months), so P is uncensored. Q reached the end with no event, so Q is right-censored at 36 months: we only know Q's relapse time is > 36 months.` },
          { do: `Check comparability.`, why: `P had the event at 14 months, which is before Q's observed time of 36 months, so we definitely know P relapsed first. The pair is comparable.` },
          { do: `Check concordance.`, why: `The one who had the event first (P) should have the higher risk. P's risk 0.7 > Q's risk 0.4, so the model ranked them correctly.` }
        ],
        answer: `<p>Yes on both counts. Q is right-censored at 36 months (relapse time known only to be > 36 months), but because P relapsed at 14 months — before Q's 36-month observed time — we know P had the event first, so the pair is <b>comparable</b>. The model gave the earlier-failing patient (P) the higher risk (0.7 > 0.4), so the pair is <b>concordant</b> and counts as a correctly ranked pair in the C-index.</p>`
      },
      {
        q: `A spam-call detector is "99.5% accurate" on a stream where 0.5% of calls are scams. The security team is unimpressed. What is wrong with accuracy here, and which metrics should they ask for?`,
        steps: [
          { do: `Find the base rate.`, why: `Only 0.5% of calls are scams, so 99.5% are legitimate. A model that flags nothing is correct on all 99.5% and scores 99.5% accuracy while catching zero scams.` },
          { do: `See that accuracy is gamed by imbalance.`, why: `The 99.5% comes entirely from the easy majority class, not from any skill at finding the rare scam calls — the thing the team cares about.` },
          { do: `Pick metrics tied to the rare class.`, why: `PR-AUC, and precision/recall at the team's alarm budget, measure how well the rare scams are actually caught; detection delay measures how fast.` }
        ],
        answer: `<p>The 99.5% is just the base rate of legitimate calls — a do-nothing detector that never alarms scores the same. <b>Accuracy is meaningless on rare-event data.</b> The team should ask for <b>PR-AUC</b> (Precision–Recall Area Under the Curve), and <b>precision and recall at their alarm budget</b> (how many of the top-$k$ flagged calls per day are real scams, and what fraction of scams that catches). For a live stream, also <b>detection delay</b>: once a scam campaign starts, how long until the first alarm.</p>`
      },
      {
        q: `Your survival model reports a Harrell's C-index of 0.52 and an IBS (Integrated Brier Score) of 0.24. A teammate says "C is fine, ship it." How do you read these two numbers?`,
        steps: [
          { do: `Interpret the C-index scale.`, why: `C = 1.0 is perfect risk ranking, C = 0.5 is random (a coin flip). 0.52 is barely above random — the model has essentially no useful ranking signal.` },
          { do: `Interpret the IBS scale.`, why: `Lower IBS is better; 0 is perfect. A naive model that just predicts the overall survival curve lands around 0.25, so 0.24 is barely better than that baseline.` },
          { do: `Combine the verdict.`, why: `Both the ranking metric and the calibration metric say the model is essentially at the no-skill baseline; nothing here justifies shipping.` }
        ],
        answer: `<p>Both numbers say the model has almost no skill. A <b>C-index of 0.52</b> is barely above the random value of 0.50 — the risk ranking is essentially a coin flip. An <b>IBS of 0.24</b> is right at the ~0.25 you get from a naive model that just predicts the population's average survival curve, so the predicted probabilities are no better calibrated than that baseline. The C is <i>not</i> fine; do not ship. Investigate features, censoring handling, and model fit before reporting again.</p>`
      }
    ]
  });

  window.CODE["met-survival"] = {
    lib: "scikit-survival / lifelines",
    runnable: false,
    explain: `<p>The real APIs practitioners call. <code>scikit-survival</code> gives the censoring-aware ranking and calibration metrics — <code>concordance_index_censored</code> (Harrell's C), <code>concordance_index_ipcw</code> (Uno's C), <code>cumulative_dynamic_auc</code> (time-dependent AUC), and <code>integrated_brier_score</code> (IBS). <code>lifelines</code> gives the classic <code>concordance_index</code> and the Kaplan–Meier survival curve. For the anomaly side, plain scikit-learn's <code>average_precision_score</code> is PR-AUC.</p>`,
    code: `import numpy as np

# ---- SURVIVAL: scikit-survival (the censoring-aware metrics) ----
from sksurv.datasets import load_gbsg2
from sksurv.preprocessing import OneHotEncoder
from sksurv.linear_model import CoxPHSurvivalAnalysis
from sksurv.metrics import (
    concordance_index_censored,   # Harrell's C
    concordance_index_ipcw,       # Uno's C (IPCW-corrected)
    cumulative_dynamic_auc,       # time-dependent AUC
    integrated_brier_score,       # IBS
)

X, y = load_gbsg2()                       # y is a structured array: (event_bool, time)
X = OneHotEncoder().fit_transform(X)
model = CoxPHSurvivalAnalysis().fit(X, y)

# risk scores: higher = expected to fail sooner
risk = model.predict(X)
event = y["cens"].astype(bool)            # True = event observed, False = censored
time = y["time"]

# Harrell's C-index (returns C, then concordant/discordant/tied counts)
c_harrell = concordance_index_censored(event, time, risk)[0]

# Uno's C-index needs a training survival array to fit the censoring weights
c_uno = concordance_index_ipcw(y, y, risk)[0]

# time-dependent AUC + IBS need predicted SURVIVAL FUNCTIONS over a time grid
times = np.percentile(time[event], np.linspace(10, 80, 8))
surv_fns = model.predict_survival_function(X)
surv_prob = np.row_stack([fn(times) for fn in surv_fns])   # S(t|x) per row
auc_t, auc_mean = cumulative_dynamic_auc(y, y, risk, times)
ibs = integrated_brier_score(y, y, surv_prob, times)
print("Harrell C:", round(c_harrell, 3), " Uno C:", round(c_uno, 3))
print("time-dependent AUC (mean):", round(auc_mean, 3), " IBS:", round(ibs, 3))

# ---- SURVIVAL: lifelines (classic C-index + Kaplan-Meier curve) ----
from lifelines.utils import concordance_index
from lifelines import KaplanMeierFitter
# lifelines wants a PREDICTED TIME; for a risk score, pass -risk so high risk = short time
c_ll = concordance_index(time, -risk, event_observed=event)
km = KaplanMeierFitter().fit(time, event_observed=event)   # population survival curve

# ---- ANOMALY: PR-AUC is just sklearn average_precision_score ----
from sklearn.metrics import average_precision_score, precision_recall_curve
# y_true: 1 = anomaly (rare), scores: higher = more anomalous
y_true = np.array([0, 0, 0, 1, 0, 0, 1, 0])
scores = np.array([.1, .2, .3, .9, .15, .25, .7, .05])
pr_auc = average_precision_score(y_true, scores)           # PR-AUC / Average Precision
prec, rec, thr = precision_recall_curve(y_true, scores)
print("PR-AUC:", round(pr_auc, 3))`
  };

  window.CODEVIZ["met-survival"] = {
    question: "From one censored dataset of 8 machines: what does the Kaplan-Meier curve S(t) look like, what is the per-step hazard, and what C-index does a risk score earn? Below: the IDEAL diagrams PLUS the failure-mode variants (a flat/near-random ranking, ROC that flatters a rare-event detector) you will actually meet.",
    charts: [
      {
        type: "line",
        title: "IDEAL — Kaplan-Meier survival curve S(t) = product of (1 - d_i/n_i) over time",
        xlabel: "time t (months)",
        ylabel: "S(t) = P(survive past t)",
        series: [
          {
            name: "S(t) step curve",
            color: "#4ea1ff",
            points: [[0, 1.0], [2, 1.0], [2, 0.875], [3, 0.875], [3, 0.75], [6, 0.75], [6, 0.6], [7, 0.6], [7, 0.45], [9, 0.45], [9, 0.225], [12, 0.225], [12, 0.0]]
          }
        ],
        interpret: "<b>Read the height as the fraction still surviving past each time t.</b> The curve only steps DOWN at a time when a real event (death/failure) happens; it stays flat through censored periods. Each drop is the survival fraction times (1 - deaths/at-risk) at that moment, so later steps are bigger when fewer subjects remain at risk. A curve that stays high and flat means most subjects survive the window; a steep early drop means high near-term risk."
      },
      {
        type: "bars",
        title: "IDEAL — Per-step survival factor (1 - d_i/n_i): the terms multiplied to build S(t)",
        xlabel: "event time t (n_i at risk, d_i events)",
        ylabel: "factor 1 - d_i/n_i (closer to 1 = gentler drop)",
        labels: ["t=2 (8,1)", "t=3 (7,1)", "t=6 (5,1)", "t=7 (4,1)", "t=9 (2,1)", "t=12 (1,1)"],
        values: [0.875, 0.857, 0.800, 0.750, 0.500, 0.000],
        valueLabels: ["0.875", "0.857", "0.800", "0.750", "0.500", "0.000"],
        colors: ["#7ee787", "#7ee787", "#7ee787", "#ffb454", "#ffb454", "#ff7b72"],
        interpret: "Each bar is one multiplied term of S(t): the fraction of the still-at-risk machines that survive that step. Early on many machines are at risk so one failure barely dents the factor (0.875); late, with few left, a single failure is a big fraction (0.500), and the final t=12 bar is exactly 0 because the last machine fails (1 - 1/1). <b>Read it as:</b> bars near 1 = gentle drops, bars near 0 = steep drops; multiply them left to right and you get the survival curve above."
      },
      {
        type: "bars",
        title: "IDEAL — Discrete hazard h_i = d_i/n_i: the conditional event rate at each step",
        xlabel: "event time t (n_i at risk, d_i events)",
        ylabel: "hazard d_i/n_i (chance of failing at t given alive)",
        labels: ["t=2 (8,1)", "t=3 (7,1)", "t=6 (5,1)", "t=7 (4,1)", "t=9 (2,1)", "t=12 (1,1)"],
        values: [0.125, 0.143, 0.200, 0.250, 0.500, 1.000],
        valueLabels: ["0.125", "0.143", "0.200", "0.250", "0.500", "1.000"],
        colors: ["#c89bff", "#c89bff", "#c89bff", "#c89bff", "#ffb454", "#ff7b72"],
        interpret: "The hazard is the mirror image of the factor above: h_i = d_i/n_i = 1 - factor. It is the chance of failing AT this step given you survived until it. It climbs from 0.125 to 1.0 purely because the at-risk pool n_i shrinks — one failure is a bigger share of a smaller group. <b>Read it as:</b> rising hazard here is a small-sample artefact of the thinning risk set, not necessarily worsening machines; with real data a hump or late spike flags a genuine wear-out period."
      },
      {
        type: "bars",
        title: "IDEAL — C-index = (concordant + 0.5*tied) / comparable = 19/21 = 0.905",
        xlabel: "comparable-pair outcome",
        ylabel: "number of comparable pairs",
        labels: ["concordant (ranked right)", "discordant (ranked wrong)", "tied"],
        values: [19, 2, 0],
        valueLabels: ["19", "2", "0"],
        colors: ["#7ee787", "#ff7b72", "#9aa7b4"],
        interpret: "Only pairs where one machine had its event before the other's observed time are 'comparable' and counted. Of 21 such pairs, 19 are concordant (the earlier-failing machine got the higher risk) and 2 discordant, so C = 19/21 = 0.905. <b>Read it as:</b> a tall green bar versus a tiny red one means strong risk ranking, well above the 0.5 coin-flip line. The C-index is just this green-vs-red ratio (ties count half)."
      },
      {
        type: "line",
        title: "WHAT YOU MIGHT ALSO SEE — Heavy censoring: KM curve barely drops and never reaches 0",
        xlabel: "time t (months)",
        ylabel: "S(t) = P(survive past t)",
        series: [
          {
            name: "S(t) with few events, lots of censoring",
            color: "#ffb454",
            points: [[0, 1.0], [3, 1.0], [3, 0.917], [8, 0.917], [8, 0.833], [14, 0.833], [14, 0.75], [20, 0.75]]
          }
        ],
        interpret: "Illustrative. Most machines were still running when the study ended, so only a few events ever drop the curve and it flattens out high (here at 0.75) instead of reaching 0. <b>Recognise it by:</b> a curve that ends well above 0 with long flat plateaus — the right tail is dominated by censored rows, so the median survival is undefined and any metric that ignores censoring would massively overstate failures. This is exactly why you keep censored rows and use IPCW-corrected metrics."
      },
      {
        type: "bars",
        title: "WHAT YOU MIGHT ALSO SEE — Near-random ranking: C-index 11/21 = 0.52, a coin flip",
        xlabel: "comparable-pair outcome",
        ylabel: "number of comparable pairs",
        labels: ["concordant (ranked right)", "discordant (ranked wrong)", "tied"],
        values: [11, 10, 0],
        valueLabels: ["11", "10", "0"],
        colors: ["#9aa7b4", "#ff7b72", "#9aa7b4"],
        interpret: "Illustrative. Now the green concordant bar (11) barely beats the red discordant bar (10), so C = 11/21 = 0.52 — essentially 0.50, a coin flip. <b>Recognise it by:</b> the two bars being almost equal height. The risk score has no useful ordering signal; do NOT ship on this. If green were SHORTER than red (C below 0.5) the ranking is reversed — often a sign you fed the risk score with the wrong sign."
      },
      {
        type: "roc",
        auc: 0.93,
        title: "WHAT YOU MIGHT ALSO SEE — ROC flatters a rare-event detector (AUC 0.93 looks great)",
        points: [[0, 0], [0.02, 0.55], [0.05, 0.78], [0.1, 0.88], [0.3, 0.96], [0.6, 0.99], [1, 1]],
        interpret: "Illustrative, on data that is 99.9% normal. ROC plots recall (TPR) against false-alarm rate (FPR). Because the huge negative class sits in the FPR denominator, even thousands of false alarms barely move FPR, so the curve bows hard to the top-left and AUC looks excellent (0.93). <b>Recognise the trap:</b> a beautiful ROC on a very rare positive can hide terrible precision — at the alarm budget you may still be drowning in false positives. On rare events trust the PR view below, not this one."
      },
      {
        type: "line",
        title: "WHAT YOU MIGHT ALSO SEE — Precision-Recall curve tells the truth on the SAME rare-event detector",
        xlabel: "recall (fraction of true anomalies caught)",
        ylabel: "precision (fraction of alarms that are real)",
        series: [
          { name: "PR curve (rare positives, base rate ~0.001)", color: "#ff7b72", points: [[0, 0.5], [0.2, 0.35], [0.4, 0.22], [0.6, 0.12], [0.8, 0.05], [1.0, 0.001]] },
          { name: "no-skill baseline (= base rate)", color: "#9aa7b4", points: [[0, 0.001], [1.0, 0.001]] }
        ],
        interpret: "Illustrative, same detector as the ROC above. PR plots precision (of the alarms you raise, how many are real) against recall. Here precision collapses as you chase more recall, and the grey no-skill line sits at the ~0.001 base rate. <b>Read it as:</b> the area under this red curve (PR-AUC / average precision) is far below the rosy ROC-AUC, honestly showing most alarms are false. <b>The lesson:</b> when positives are rare, judge by PR-AUC and precision/recall at your alarm budget, never by ROC-AUC or accuracy alone."
      }
    ],
    caption: "Read each chart by its IDEAL vs WHAT-YOU-MIGHT-ALSO-SEE tag. Survival ideal: 8 machines (times 2,3,4,6,7,9,12 months; t=4 and t=8 censored) give a KM curve that steps down only at events, per-step factors and hazards that move because the at-risk set thins, and a C-index of 19/21 = 0.905. The variants are the failures you must spot: a heavy-censoring KM curve that flattens high and never hits 0; a near-random C-index (11 vs 10 -> 0.52) you must NOT ship; and the rare-event pair where ROC-AUC looks great (0.93) but the PR curve on the SAME detector reveals precision collapsing toward the 0.001 base rate. Main-chart numbers are computed with numpy from the dataset in the code; variants marked 'illustrative' are qualitatively honest shapes.",
    code: `import numpy as np

# 8 machines: observed time t, event indicator delta (1=failed, 0=censored)
t     = np.array([ 2,  3,  4,  6,  7,  8,  9, 12])
delta = np.array([ 1,  1,  0,  1,  1,  0,  1,  1])   # t=4, t=8 are censored

# ---- Kaplan-Meier: S(t) = product over event times of (1 - d_i/n_i) ----
event_times = sorted(set(t[delta == 1]))   # [2, 3, 6, 7, 9, 12]
S = 1.0
factors, hazards, surv = [], [], [(0, 1.0)]
for et in event_times:
    n_i = np.sum(t >= et)                   # at risk just before et
    d_i = np.sum((t == et) & (delta == 1))  # events exactly at et
    factor = 1 - d_i / n_i                   # survival factor for this step
    S *= factor
    factors.append(round(factor, 3))         # chart 2
    hazards.append(round(d_i / n_i, 3))      # chart 3: hazard = 1 - factor
    surv.append((et, round(S, 3)))           # chart 1
print("factors :", factors)   # -> [0.875, 0.857, 0.8, 0.75, 0.5, 0.0]
print("hazards :", hazards)   # -> [0.125, 0.143, 0.2, 0.25, 0.5, 1.0]
print("S(t)    :", surv)      # -> 1.0 .875 .75 .6 .45 .225 .0

# ---- C-index over comparable pairs for an imperfect risk score ----
risk = np.array([0.90, 0.62, 0.55, 0.70, 0.45, 0.40, 0.50, 0.30])  # high = sooner
conc = disc = tie = 0
for i in range(len(t)):
    for j in range(len(t)):
        if delta[i] == 1 and t[i] < t[j]:    # i's event precedes j's observed time
            if   risk[i] > risk[j]: conc += 1
            elif risk[i] == risk[j]: tie += 1
            else:                    disc += 1
C = (conc + 0.5 * tie) / (conc + disc + tie)
print("C-index :", conc, disc, tie, round(C, 3))  # -> 19 2 0 0.905`
  };
})();
