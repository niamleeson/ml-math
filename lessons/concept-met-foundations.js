/* =====================================================================
   METRICS & EVALUATION — BEGINNER intro lesson.
   "How to think about metrics." The gentle foundation the whole
   Metrics & Evaluation module builds on.
   Self-contained: registers the lesson, its CODE, and its CODEVIZ.
   ===================================================================== */
(function () {
  window.LESSONS.push({
    id: "met-foundations",
    title: "How to think about metrics",
    tagline: "A metric is one number that scores how good a prediction is. Pick it from the cost of being wrong.",
    module: "Metrics & Evaluation — measuring models, data & statistics",
    prereqs: ["ml-classification-metrics"],

    whenToUse:
      `<p><b>Read this first, before any specific metric.</b> A metric is a number that scores how good a prediction, a model, or even a dataset is. There are dozens of them, and the hard part is never the arithmetic — it is choosing the <i>right</i> one. This lesson is the decision guide for that choice.</p>
       <p><b>Match the metric family to the kind of problem:</b></p>
       <ul>
         <li><b>Classification</b> (the answer is a category — spam / not-spam, sick / healthy): start with the confusion matrix, then accuracy, precision, recall, F1, ROC-AUC (Receiver Operating Characteristic — Area Under the Curve), PR-AUC (Precision–Recall Area Under the Curve).</li>
         <li><b>Regression</b> (the answer is a number — a price, a temperature): MAE (Mean Absolute Error), MSE (Mean Squared Error), RMSE (Root Mean Squared Error), R² (R-squared).</li>
         <li><b>Ranking / recommendation</b> (the order matters — search results, a feed): precision@k, recall@k, MAP (Mean Average Precision), NDCG (Normalized Discounted Cumulative Gain).</li>
         <li><b>Clustering</b> (no labels, just groups): silhouette score, the Rand index, mutual information.</li>
         <li><b>Probabilistic / calibration</b> (you report a probability, not just a label): log loss, the Brier score, ECE (Expected Calibration Error).</li>
         <li><b>Data / drift</b> (is the input still the same world the model trained on?): PSI (Population Stability Index), the KL (Kullback–Leibler) divergence, missing-rate and range checks.</li>
         <li><b>Statistics</b> (is a difference real or just luck?): a p-value, a confidence interval, an effect size.</li>
       </ul>
       <p><b>Avoid a metric when</b> it does not line up with the real decision the model drives — a beautiful F1 score is worthless if no one can name the action the prediction triggers.</p>`,

    application:
      `<p>Every team that ships a model lives by its metrics. A search team watches NDCG; a fraud team watches precision@k and dollars saved; a forecasting team watches RMSE; a medical-screening team watches recall (do not miss a sick patient). The <i>loss</i> the model trained on is rarely the <i>metric</i> the team reports — the loss has to be smooth and easy to optimize, while the metric has to mean something to a human. Knowing the difference, and picking the metric from the cost of mistakes, is the skill this whole module teaches.</p>`,

    pitfalls:
      `<ul>
         <li><b>Reporting accuracy on imbalanced data.</b> Tell: 99% of cases are "no", and a model that always says "no" scores 99% accuracy while catching nothing. Accuracy hides the failure. Report precision, recall, PR-AUC, or a confusion matrix instead.</li>
         <li><b>Tuning on the test set.</b> Tell: you picked the threshold, or the model, by looking at the test numbers. Now the test set has leaked into your choices and the reported score is optimistic. Tune on a <i>validation</i> split; report once on a held-out test split you touched last.</li>
         <li><b>One number hiding a segment failure.</b> Tell: the overall metric looks fine, but the model is much worse for one group (a country, a device, new users). A single average can paper over a broken slice. Always break the metric down by segment.</li>
         <li><b>A metric tied to no decision.</b> Tell: the report shows F1 or AUC but no one can say what the score makes the system <i>do</i>. If the prediction triggers no action, you are polishing a number for its own sake. Find the decision first, then the metric.</li>
       </ul>`,

    bigIdea:
      `<p>A <b>metric</b> is a single number that scores how good something is — a prediction, a whole model, or a dataset. Higher (or lower) is better, depending on the metric.</p>
       <p>It is the answer to "how well did we do?", boiled down to one comparable number so you can rank models and track progress.</p>
       <p>Two ideas are easy to confuse, so pin them down now:</p>
       <ul>
         <li>A <b>loss</b> is what the model <i>trains</i> on. It must be smooth so the optimizer can follow its slope downhill (see the Loss function lesson).</li>
         <li>A <b>metric</b> is what you <i>report</i>. It must mean something to a human — even if it is jagged and impossible to optimize directly (you cannot do gradient descent on accuracy).</li>
       </ul>
       <p>Most classification metrics grow from one small table — the <b>confusion matrix</b> — and a <b>threshold</b> that turns a probability into a yes/no. Move the threshold and you trade one kind of mistake for the other. Which trade you want comes from the real-world <b>cost</b> of each mistake.</p>`,

    buildup:
      `<p><b>The split.</b> You never judge a model on the same data it learned from — it can memorize. So you cut the data into three parts:</p>
       <ul>
         <li><b>Training set</b> — the model learns its parameters here.</li>
         <li><b>Validation set</b> — you tune choices here (which model, which threshold, which settings).</li>
         <li><b>Test set</b> — touched once, at the very end, to report an honest score on data the model has never seen.</li>
       </ul>
       <p><b>The confusion matrix.</b> For a yes/no classifier, every prediction lands in one of four boxes. Call the event you care about (fraud, a tumor) the <i>positive</i> class:</p>
       <ul>
         <li><b>TP</b> (True Positive) — predicted yes, truly yes. A correct catch.</li>
         <li><b>FP</b> (False Positive) — predicted yes, truly no. A false alarm.</li>
         <li><b>FN</b> (False Negative) — predicted no, truly yes. A miss.</li>
         <li><b>TN</b> (True Negative) — predicted no, truly no. A correct all-clear.</li>
       </ul>
       <p>Accuracy, precision, recall, F1, and ROC-AUC are all just different fractions of these four counts.</p>
       <p><b>The threshold.</b> A classifier really outputs a probability, like $0.30$. A threshold $t$ turns it into a label: say "yes" when the score is $\\ge t$. Lower $t$ ⇒ more "yes" calls ⇒ more catches but more false alarms (FN down, FP up). Higher $t$ ⇒ the reverse. The threshold is the dial that moves errors from one box to the other.</p>`,

    symbols: [
      { sym: "TP", desc: "True Positive — predicted yes and it was yes. A correct catch." },
      { sym: "FP", desc: "False Positive — predicted yes but it was no. A false alarm." },
      { sym: "FN", desc: "False Negative — predicted no but it was yes. A miss." },
      { sym: "TN", desc: "True Negative — predicted no and it was no. A correct all-clear." },
      { sym: "$t$", desc: "the threshold: the probability cutoff. Predict 'yes' when the model's score is $\\ge t$." },
      { sym: "loss", desc: "the smooth number the model is trained to make small. Optimizable, not always human-readable." },
      { sym: "metric", desc: "the number you report to judge the model. Human-meaningful, often not directly optimizable." }
    ],

    formula: `$$ \\text{accuracy} = \\frac{TP + TN}{TP + FP + FN + TN}, \\qquad \\text{metric} = f(\\,\\text{confusion matrix at threshold } t\\,) $$`,

    whatItDoes:
      `<p>The left formula is the simplest metric: <b>accuracy</b> is the fraction of all predictions that were correct — the two right boxes (TP and TN) over all four boxes.</p>
       <p>The right line is the big picture: nearly every classification metric is some function $f$ of the four confusion-matrix counts, and those counts depend on the threshold $t$. Change $t$ and the counts change, so the metric changes. That is why "which metric, at which threshold?" is the real question.</p>
       <p>Accuracy is fine when classes are balanced and every mistake costs the same. The moment those assumptions break — rare positives, or a miss far worse than a false alarm — you need precision, recall, F1, or a cost-weighted metric instead.</p>`,

    derivation:
      `<p><b>Why a metric is just a fraction of the four boxes.</b></p>
       <ul class="steps">
         <li>Every single prediction is correct or wrong, and was positive or negative. That is exactly four cases: TP, FP, FN, TN. The confusion matrix is just the count of each.</li>
         <li><b>Accuracy</b> asks "what fraction did I get right?" — the correct boxes over all boxes: $\\frac{TP+TN}{TP+FP+FN+TN}$.</li>
         <li><b>Precision</b> asks "of my 'yes' calls, how many were right?" — $\\frac{TP}{TP+FP}$. It watches false alarms.</li>
         <li><b>Recall</b> asks "of the real 'yes' cases, how many did I catch?" — $\\frac{TP}{TP+FN}$. It watches misses.</li>
         <li><b>F1</b> blends precision and recall into one number (their harmonic mean): $\\frac{2\\,TP}{2\\,TP+FP+FN}$.</li>
         <li>Slide the threshold and every one of these moves, because the four counts move. Sweep the threshold across all values and you trace the ROC and precision–recall curves — whole-model summaries that do not depend on one cutoff.</li>
       </ul>
       <p><b>Why not just optimize the metric directly?</b> Accuracy and F1 are flat-then-jumpy in the model's parameters — they have no useful slope, so gradient descent cannot follow them. The loss (log loss, squared error) is a smooth stand-in the optimizer <i>can</i> follow, chosen so that pushing it down tends to push the metric up. Loss to train, metric to report. $\\blacksquare$</p>`,

    example:
      `<p>A spam filter is tested on 200 emails (positive = spam). The confusion matrix comes back as the four boxes below — rows are the truth, columns are the model's call:</p>
       <table class="extable">
         <caption>Confusion matrix: 200 emails, positive = spam.</caption>
         <thead><tr><th></th><th class="num">predicted spam</th><th class="num">predicted ham</th><th class="num">row total</th></tr></thead>
         <tbody>
           <tr><td class="row-h">actually spam</td><td class="num">TP $=80$</td><td class="num">FN $=10$</td><td class="num">90</td></tr>
           <tr><td class="row-h">actually ham</td><td class="num">FP $=20$</td><td class="num">TN $=90$</td><td class="num">110</td></tr>
         </tbody>
       </table>
       <ul class="steps">
         <li><b>Accuracy</b> $= \\dfrac{TP+TN}{\\text{all}} = \\dfrac{80+90}{200} = \\dfrac{170}{200} = 0.85$. It got 85% of emails right.</li>
         <li><b>Precision</b> $= \\dfrac{TP}{TP+FP} = \\dfrac{80}{80+20} = \\dfrac{80}{100} = 0.80$. Of mail it flagged as spam, 80% really was.</li>
         <li><b>Recall</b> $= \\dfrac{TP}{TP+FN} = \\dfrac{80}{80+10} = \\dfrac{80}{90} \\approx 0.89$. It caught 89% of the real spam.</li>
       </ul>
       <p>Now imagine the data were imbalanced — only 5 of the 200 emails are spam — and a lazy model marks <i>everything</i> "not spam". Accuracy looks great while the model catches zero spam, which is exactly when you reach past accuracy to precision and recall:</p>
       <table class="extable">
         <caption>Why accuracy alone misleads on imbalanced data.</caption>
         <thead><tr><th>model</th><th class="num">accuracy</th><th class="num">recall (spam)</th></tr></thead>
         <tbody>
           <tr><td class="row-h">real filter (90 spam)</td><td class="num">0.850</td><td class="num">0.889</td></tr>
           <tr><td class="row-h">"always ham" (5 spam)</td><td class="num">0.975</td><td class="num">0.000</td></tr>
         </tbody>
       </table>
       <p>The do-nothing model scores $\\frac{195}{200}=0.975$ accuracy yet catches nothing — its recall of $0$ gives it away.</p>`,

    demo: function (host) {
      function C() {
        var s = getComputedStyle(document.documentElement);
        var g = function (n, d) { return (s.getPropertyValue(n) || d).trim(); };
        return { ink: g("--ink", "#e6edf3"), dim: g("--ink-dim", "#9aa7b4"), accent: g("--accent", "#4ea1ff"), accent2: g("--accent-2", "#7ee787"), warn: g("--warn", "#ffb454"), border: g("--border", "#2a3340"), panel: g("--panel", "#161c24") };
      }
      // two score distributions: negatives centered low, positives centered high
      var negMu = 0.38, posMu = 0.64, sd = 0.15, N = 100, thresh = 0.5;
      function gauss(x, mu) { var z = (x - mu) / sd; return Math.exp(-0.5 * z * z); }
      var cv = document.createElement("canvas"); cv.width = 640; cv.height = 180; cv.style.maxWidth = "100%"; host.appendChild(cv);
      var ctx = cv.getContext("2d");
      var readout = document.createElement("div"); readout.className = "out"; readout.style.marginTop = "6px"; host.appendChild(readout);

      function counts() {
        var stepN = 400, sumP = 0, sumN = 0, i, x, dx = 1 / stepN;
        for (i = 0; i < stepN; i++) { x = (i + 0.5) * dx; sumP += gauss(x, posMu); sumN += gauss(x, negMu); }
        var tp = 0, fp = 0;
        for (i = 0; i < stepN; i++) { x = (i + 0.5) * dx; if (x >= thresh) { tp += gauss(x, posMu); fp += gauss(x, negMu); } }
        tp = Math.round(N * tp / sumP); var fn = N - tp;
        fp = Math.round(N * fp / sumN); var tn = N - fp;
        return { tp: tp, fn: fn, fp: fp, tn: tn };
      }
      function draw() {
        var col = C(); ctx.clearRect(0, 0, 640, 180);
        var W = 640, H = 180, padL = 12, padR = 12, y0 = 14, y1 = H - 28;
        function PX(x) { return padL + x * (W - padL - padR); }
        function PY(v) { return y1 - v * (y1 - y0); }
        ctx.strokeStyle = col.border; ctx.beginPath(); ctx.moveTo(PX(0), y1); ctx.lineTo(PX(1), y1); ctx.stroke();
        function curve(mu, color) {
          ctx.beginPath(); var first = true, i, x;
          for (i = 0; i <= 200; i++) { x = i / 200; var Y = PY(gauss(x, mu)); if (first) { ctx.moveTo(PX(x), Y); first = false; } else ctx.lineTo(PX(x), Y); }
          ctx.lineTo(PX(1), y1); ctx.lineTo(PX(0), y1); ctx.closePath(); ctx.fillStyle = color + "33"; ctx.fill();
          ctx.strokeStyle = color; ctx.lineWidth = 2; ctx.beginPath(); first = true;
          for (i = 0; i <= 200; i++) { x = i / 200; var Yy = PY(gauss(x, mu)); if (first) { ctx.moveTo(PX(x), Yy); first = false; } else ctx.lineTo(PX(x), Yy); }
          ctx.stroke();
        }
        curve(negMu, col.accent); curve(posMu, col.accent2);
        var tx = PX(thresh);
        ctx.strokeStyle = col.warn; ctx.lineWidth = 2.5; ctx.beginPath(); ctx.moveTo(tx, y0); ctx.lineTo(tx, y1); ctx.stroke();
        ctx.fillStyle = col.warn; ctx.beginPath(); ctx.arc(tx, y0 + 6, 6, 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = col.dim; ctx.font = "12px sans-serif"; ctx.textAlign = "left";
        ctx.fillText("negatives", PX(0.02), y0 + 12); ctx.textAlign = "right"; ctx.fillText("positives", PX(0.98), y0 + 12);
        ctx.textAlign = "center"; ctx.fillStyle = col.warn; ctx.fillText("threshold = " + thresh.toFixed(2) + "  (drag)", tx, y1 + 18);
      }
      function render() {
        draw(); var c = counts();
        var tot = c.tp + c.fp + c.fn + c.tn;
        var acc = tot > 0 ? (c.tp + c.tn) / tot : 0;
        var prec = (c.tp + c.fp) > 0 ? c.tp / (c.tp + c.fp) : 0;
        var rec = (c.tp + c.fn) > 0 ? c.tp / (c.tp + c.fn) : 0;
        readout.innerHTML = "Confusion matrix at this threshold: TP = <b>" + c.tp + "</b>, FP = <b>" + c.fp + "</b>, FN = <b>" + c.fn + "</b>, TN = <b>" + c.tn + "</b>.<br>Accuracy = <b>" + acc.toFixed(3) + "</b>, precision = <b>" + prec.toFixed(3) + "</b>, recall = <b>" + rec.toFixed(3) + "</b>. Drag the threshold: every metric is just a fraction of those four counts, and moving the cutoff trades misses (FN) against false alarms (FP).";
      }
      function setFromX(clientX) {
        var r = cv.getBoundingClientRect(), scale = cv.width / r.width;
        var x = (clientX - r.left) * scale, t = (x - 12) / (640 - 24);
        thresh = Math.max(0.02, Math.min(0.98, t)); render();
      }
      var dragging = false;
      cv.addEventListener("mousedown", function (e) { dragging = true; setFromX(e.clientX); });
      window.addEventListener("mousemove", function (e) { if (dragging) setFromX(e.clientX); });
      window.addEventListener("mouseup", function () { dragging = false; });
      cv.addEventListener("touchstart", function (e) { dragging = true; if (e.touches[0]) setFromX(e.touches[0].clientX); });
      cv.addEventListener("touchmove", function (e) { if (dragging && e.touches[0]) { setFromX(e.touches[0].clientX); e.preventDefault(); } });
      render();
    },

    practice: [
      {
        q: `A colleague proudly reports "our churn model is 96% accurate." Only 4% of customers actually churn. Why is this number almost meaningless, and what would you ask for instead?`,
        steps: [
          { do: `Find the base rate.`, why: `Only 4% churn, so 96% are non-churners. A model that predicts "no churn" for everyone is right 96% of the time and catches zero churners.` },
          { do: `See that accuracy is gamed by imbalance.`, why: `The 96% comes from the easy majority class, not from any real skill at finding churners — the thing you actually care about.` },
          { do: `Ask for the metric tied to the goal.`, why: `Request the confusion matrix, plus precision and recall on the churn class (or PR-AUC), so you can see how many real churners are caught.` }
        ],
        answer: `<p>The 96% is just the base rate of non-churners — a do-nothing model that always says "no churn" scores the same. Accuracy is meaningless on imbalanced data. Ask for the <b>confusion matrix</b> and the <b>precision and recall on the churn class</b> (or PR-AUC): those reveal how many actual churners the model catches versus misses.</p>`
      },
      {
        q: `What is the difference between a loss and a metric, and why can't you usually just train the model directly on the metric you care about (say, F1)?`,
        steps: [
          { do: `Define each role.`, why: `A loss is what the model trains on; a metric is what you report. They answer different questions.` },
          { do: `Recall what training needs.`, why: `Gradient descent follows the slope of the loss downhill, so the loss must be smooth and differentiable.` },
          { do: `See why F1 fails as a training target.`, why: `F1 (and accuracy) come from counting discrete correct/wrong calls — they are flat then jump, with no useful slope to descend.` }
        ],
        answer: `<p>A <b>loss</b> is the smooth, optimizable number the model is trained to minimize; a <b>metric</b> is the human-meaningful number you report. You usually cannot train on F1 directly because it is built from discrete counts and has no useful gradient — it is flat then jumps, so gradient descent has nothing to follow. Instead you train on a smooth surrogate loss (like log loss) chosen so that lowering it tends to raise the metric, then report the metric separately.</p>`
      },
      {
        q: `You are evaluating a model and you move the decision threshold from 0.5 down to 0.2. In terms of TP, FP, FN, TN, what generally happens, and which kinds of problems make a low threshold the right choice?`,
        steps: [
          { do: `Track what a lower threshold does.`, why: `A lower cutoff means the model says "yes" more often, so more cases land in the positive column.` },
          { do: `Move the counts.`, why: `More "yes" calls means more true catches (TP up) and fewer misses (FN down), but also more false alarms (FP up) and fewer correct all-clears (TN down).` },
          { do: `Tie it to cost.`, why: `Lowering the threshold is right when a miss (FN) is far costlier than a false alarm (FP) — you would rather over-alert than let a real case slip.` }
        ],
        answer: `<p>Lowering the threshold makes the model predict "yes" more readily: <b>TP rises and FN falls</b> (more catches, fewer misses), while <b>FP rises and TN falls</b> (more false alarms). That trade is the right one when a miss is much more expensive than a false alarm — cancer screening, fraud you must not let through, safety alerts — where catching the real cases matters more than the extra false positives.</p>`
      }
    ]
  });

  window.CODE["met-foundations"] = {
    lib: "scikit-learn",
    runnable: false,
    explain: `<p>The starting toolkit for any classification metric: split the data with <code>train_test_split</code>, fit a model, then read the four confusion-matrix counts with <code>confusion_matrix</code> and get accuracy, precision, recall, and F1 all at once with <code>classification_report</code>. Every other classification metric is built from these counts.</p>`,
    code: `import numpy as np
from sklearn.datasets import load_breast_cancer
from sklearn.model_selection import train_test_split
from sklearn.linear_model import LogisticRegression
from sklearn.preprocessing import StandardScaler
from sklearn.pipeline import make_pipeline
from sklearn.metrics import confusion_matrix, classification_report

# positive class = malignant tumor (the costly miss).
# sklearn's target is 0 = malignant, 1 = benign, so we flip it.
data = load_breast_cancer()
X = data.data
y = (data.target == 0).astype(int)          # 1 = malignant (positive)

# 1) THE SPLIT: never judge a model on the data it learned from.
#    stratify=y keeps the class balance the same in train and test.
X_tr, X_te, y_tr, y_te = train_test_split(
    X, y, test_size=0.4, random_state=0, stratify=y)

# 2) fit a simple logistic-regression baseline
clf = make_pipeline(StandardScaler(),
                    LogisticRegression(max_iter=5000)).fit(X_tr, y_tr)
y_pred = clf.predict(X_te)                   # uses the default 0.5 threshold

# 3) THE CONFUSION MATRIX: the root of every classification metric.
#    labels=[0,1] -> rows/cols are [negative, positive]
tn, fp, fn, tp = confusion_matrix(y_te, y_pred, labels=[0, 1]).ravel()
print(f"TP={tp}  FP={fp}  FN={fn}  TN={tn}")

# 4) accuracy / precision / recall / F1, all derived from those four counts
print(classification_report(
    y_te, y_pred, target_names=["benign", "malignant"], digits=3))

# the metrics by hand, to show they ARE just fractions of the four boxes:
accuracy  = (tp + tn) / (tp + fp + fn + tn)
precision = tp / (tp + fp)
recall    = tp / (tp + fn)
print(f"accuracy={accuracy:.3f}  precision={precision:.3f}  recall={recall:.3f}")`
  };

  window.CODEVIZ["met-foundations"] = {
    question: "Take one concrete spam test — 200 emails, TP=80, FP=20, FN=10, TN=90 — watch the four boxes turn into accuracy; then see three other confusion matrices and why accuracy alone can fool you.",
    charts: [
      {
        type: "confusion",
        title: "Healthy & balanced: confusion matrix (positive = spam)",
        labels: ["not-spam (neg)", "spam (pos)"],
        matrix: [[90, 20], [10, 80]],
        interpret: "Rows are the truth, columns are the model's call. The two diagonal boxes are correct: TN = 90 (real ham called ham) and TP = 80 (real spam caught). The off-diagonal boxes are the two mistakes: FP = 20 (good mail wrongly flagged) and FN = 10 (spam that slipped through). <b>The diagonal is heavy and both classes are well covered</b> — that is what a healthy, balanced result looks like. Every metric below is just some fraction of these four numbers."
      },
      {
        type: "bars",
        title: "accuracy = (TP + TN) / total — correct boxes over all boxes",
        labels: ["TP (correct catch)", "TN (correct all-clear)", "TP + TN (numerator)", "total (denominator)", "accuracy = ratio"],
        values: [80, 90, 170, 200, 0.85],
        valueLabels: ["80", "90", "170", "200", "0.85"],
        colors: ["#7ee787", "#7ee787", "#4ea1ff", "#9aa7b4", "#c89bff"],
        interpret: "This reads the accuracy formula left to right. The two green bars are the correct boxes (TP = 80, TN = 90); the blue bar is their sum, the numerator (170); the grey bar is the total of all four boxes, the denominator (200). The purple bar is the ratio, 170/200 = <b>0.85</b>. Accuracy is simply <b>how much of the whole is on the diagonal</b>."
      },
      {
        type: "bars",
        title: "error rate = (FP + FN) / total — accuracy and error rate sum to 1",
        labels: ["FP (false alarm)", "FN (miss)", "FP + FN (numerator)", "total (denominator)", "error rate = ratio"],
        values: [20, 10, 30, 200, 0.15],
        valueLabels: ["20", "10", "30", "200", "0.15"],
        colors: ["#ff7b72", "#ff7b72", "#ffb454", "#9aa7b4", "#c89bff"],
        interpret: "The mirror image of the accuracy chart. The two red bars are the wrong boxes (FP = 20, FN = 10); the orange bar sums them (30); over the same total of 200 the ratio is <b>0.15</b>. Because every email is either a correct box or a wrong box, <b>accuracy 0.85 + error rate 0.15 = 1</b> exactly — they are two views of the same split."
      },
      {
        type: "confusion",
        title: "Variant — majority-class collapse on imbalanced data (illustrative)",
        labels: ["not-spam (neg)", "spam (pos)"],
        matrix: [[195, 0], [5, 0]],
        interpret: "Illustrative: now only 5 of 200 emails are spam, and a lazy model labels <b>everything</b> not-spam. The whole positive column is empty — TP = 0, FP = 0 — so it catches zero spam. Yet accuracy = (TN + TP)/total = 195/200 = <b>0.975</b>, higher than the healthy model above. <b>This is the trap:</b> on imbalanced data accuracy rewards predicting the majority and hides total failure on the class you care about. Recall = 0/5 = 0 exposes it instantly."
      },
      {
        type: "confusion",
        title: "Variant — high recall, low precision (threshold too low, illustrative)",
        labels: ["not-spam (neg)", "spam (pos)"],
        matrix: [[40, 70], [2, 88]],
        interpret: "Illustrative: the threshold is dialed way down, so the model shouts \"spam\" at almost everything. It now catches nearly all real spam (TP = 88, FN = 2, recall = 0.978) but at the cost of flooding FP = 70 good emails into the junk folder (precision = 88/158 = 0.557). <b>A tall FP box with a thin FN box is the fingerprint of an over-eager classifier</b> — great recall, poor precision. Lowering the threshold always trades misses (FN down) for false alarms (FP up)."
      },
      {
        type: "bars",
        title: "Same four counts, three different stories: accuracy can agree or disagree with the metric you care about",
        xlabel: "scenario",
        ylabel: "score",
        labels: ["balanced: accuracy", "balanced: recall", "collapse: accuracy", "collapse: recall", "low-thresh: accuracy", "low-thresh: recall"],
        values: [0.85, 0.889, 0.975, 0.0, 0.64, 0.978],
        valueLabels: ["0.85", "0.889", "0.975", "0.000", "0.64", "0.978"],
        colors: ["#7ee787", "#4ea1ff", "#ff7b72", "#9aa7b4", "#ffb454", "#4ea1ff"],
        interpret: "Each pair puts accuracy (green/red/orange) next to recall (blue/grey) for one of the three matrices above. In the <b>balanced</b> case they roughly agree (0.85 vs 0.889). In the <b>collapse</b> case accuracy is the highest of all (0.975) while recall is zero — accuracy is lying. In the <b>low-threshold</b> case accuracy looks mediocre (0.64) yet recall is excellent (0.978). The lesson: <b>never read accuracy alone</b> — always check the metric tied to the cost of your specific mistake."
      }
    ],
    caption: "Start with the healthy balanced matrix (200 emails, spam = positive): rows = actual, columns = predicted; the diagonal TN = 90 and TP = 80 are correct, the off-diagonal FP = 20 and FN = 10 are the two mistakes. The accuracy bars walk the formula term by term (170/200 = 0.85); the error-rate bars are its mirror (30/200 = 0.15) and the two sum to 1. Then come the variants you will really meet: majority-class collapse (accuracy 0.975 while catching zero spam) and an over-eager low-threshold model (recall 0.978 but 70 false alarms). The final bar chart lines accuracy up against recall across all three — the whole point of the foundations lesson: one number can flatter or hide, so pick the metric from the cost of being wrong.",
    code: `import numpy as np
from sklearn.metrics import confusion_matrix

# one concrete labeled spam test: 200 emails, positive = spam.
# y_true / y_pred reconstructed to match TP=80, FP=20, FN=10, TN=90.
# label 1 = spam (positive), label 0 = not-spam (negative)
y_true = np.array([1]*90 + [0]*110)          # 90 real spam, 110 real ham
y_pred = np.array(
    [1]*80 + [0]*10 +                        # of the 90 spam: 80 caught, 10 missed
    [1]*20 + [0]*90                          # of the 110 ham: 20 false alarms, 90 clear
)

# rows = actual [neg, pos], cols = predicted [neg, pos]
cm = confusion_matrix(y_true, y_pred, labels=[0, 1])
tn, fp, fn, tp = cm.ravel()
print(cm)                                    # [[90, 20], [10, 80]]
print(f"TP={tp}  FP={fp}  FN={fn}  TN={tn}")

total = tp + fp + fn + tn                     # 200
accuracy   = (tp + tn) / total                # (80+90)/200 = 0.85
error_rate = (fp + fn) / total                # (20+10)/200 = 0.15
print(f"accuracy  = (TP+TN)/total = {tp+tn}/{total} = {accuracy:.2f}")
print(f"error rate= (FP+FN)/total = {fp+fn}/{total} = {error_rate:.2f}")
print(f"they sum to {accuracy + error_rate:.2f}")          # 1.00

# the same four boxes also give precision and recall:
print(f"precision = TP/(TP+FP) = {tp}/{tp+fp} = {tp/(tp+fp):.2f}")
print(f"recall    = TP/(TP+FN) = {tp}/{tp+fn} = {tp/(tp+fn):.3f}")`
  };
})();
