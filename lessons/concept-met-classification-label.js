/* =====================================================================
   METRICS & EVALUATION LESSON (BEGINNER)
   Classification metrics from hard labels.
   Self-contained: registers the lesson, its CODE, and its CODEVIZ.
   ===================================================================== */
(function () {
  window.LESSONS.push({
    id: "met-classification-label",
    title: "Classification metrics from hard labels",
    tagline: "Once a model commits to yes-or-no, four counts tell you everything.",
    module: "Metrics & Evaluation — measuring models, data & statistics",
    prereqs: ["ml-classification-metrics"],

    whenToUse:
      `<p><b>Reach for these whenever your model outputs a final hard label</b> — a definite "yes" or "no" per example — and you want to grade those decisions. "Hard label" means the model already picked a side; you are not looking at the probability behind it (that is the sibling lesson [met-classification-prob]). Every metric below is built from the same four counts in the confusion matrix, so they are cheap and you can report many at once.</p>
       <p><b>Which one to pick:</b></p>
       <ul>
         <li><b>Balanced data, equal error costs</b> &rarr; <b>accuracy</b> is fine and easy to explain.</li>
         <li><b>Imbalanced data</b> (one class rare) &rarr; avoid accuracy; use <b>balanced accuracy</b>, <b>MCC (Matthews Correlation Coefficient)</b>, or <b>F1</b>. MCC is the safest single number.</li>
         <li><b>False alarms are expensive</b> (flagging good email as spam) &rarr; watch <b>precision</b>.</li>
         <li><b>Misses are dangerous</b> (missing a tumor) &rarr; watch <b>recall</b> / <b>sensitivity</b>, and report <b>specificity</b> too.</li>
         <li><b>Asymmetric costs, misses worse than false alarms</b> &rarr; <b>F&beta; (F-beta)</b> with &beta; &gt; 1 leans toward recall.</li>
         <li><b>Multi-class</b> &rarr; pick an averaging scheme: <b>macro</b> (treat classes equally), <b>micro</b> (treat examples equally), or <b>weighted</b> (by class size).</li>
         <li><b>Comparing to a second human/rater</b> &rarr; <b>Cohen's kappa</b> measures agreement beyond chance.</li>
       </ul>`,

    application:
      `<p>These show up the moment a model's score is turned into an action. A spam filter either sends mail to the inbox or the junk folder. A medical screen either calls a patient back or clears them. A fraud system either blocks a charge or lets it through. In each case the decision is a hard label, and you grade it with the metrics here. Tools like <code>scikit-learn</code>'s <code>classification_report</code> print precision, recall, F1 and the averages for every class in one table — the standard first look at any classifier.</p>`,

    pitfalls:
      `<ul>
         <li><b>Accuracy lies under imbalance.</b> If 99% of cases are negative, a model that always says "negative" scores 99% accuracy yet catches nothing. Fix: report <b>balanced accuracy</b>, <b>MCC</b>, or per-class precision/recall instead.</li>
         <li><b>F1 ignores true negatives.</b> Its formula never uses TN (True Negatives), so it can look identical for two very different classifiers. Fix: pair it with <b>specificity</b> or <b>MCC</b>, which do use TN.</li>
         <li><b>Micro vs macro confusion.</b> Micro-average weights big classes; macro-average weights every class equally. On imbalanced data they can disagree wildly. Fix: state which you used and why — macro to surface rare-class failure, micro to match overall example accuracy.</li>
         <li><b>Threshold dependence.</b> Every metric here depends on the cutoff that turned the probability into a label. Move the cutoff and all the counts move. Fix: tune the threshold for your cost, do not blindly trust the default $0.5$; if you want a threshold-free summary use [met-classification-prob].</li>
         <li><b>Tiny test sets are noisy.</b> A few positives make recall swing wildly. Fix: report confidence intervals or use cross-validation.</li>
       </ul>`,

    bigIdea:
      `<p>Every yes/no prediction lands in one of four boxes: right-positive, right-negative, wrong-positive, wrong-negative.</p>
       <p>Count how many predictions fall in each box. That table of four counts is the <b>confusion matrix</b>.</p>
       <p><b>Every metric in this lesson is just a recipe built from those four numbers.</b> Accuracy, precision, recall, F1, MCC, kappa — all of them. Learn the four counts and the rest is arithmetic.</p>
       <p>Cross-links: foundations of what makes a metric trustworthy live in [met-foundations]; metrics that grade the probability before you threshold it live in [met-classification-prob].</p>`,

    buildup:
      `<p>Call one class <b>positive</b> (the thing you are trying to detect — a tumor, spam, fraud) and the other <b>negative</b>. For each example the model predicts positive or negative, and reality is positive or negative. That gives four outcomes:</p>
       <ul>
         <li><b>TP</b> (True Positive): predicted positive, really positive. A correct catch.</li>
         <li><b>TN</b> (True Negative): predicted negative, really negative. A correct pass.</li>
         <li><b>FP</b> (False Positive): predicted positive, really negative. A false alarm.</li>
         <li><b>FN</b> (False Negative): predicted negative, really positive. A miss.</li>
       </ul>
       <p>Lay them in a 2&times;2 grid (rows = truth, columns = prediction) and you have the confusion matrix. Two running totals help: the real positives $P = TP + FN$ and the real negatives $N = TN + FP$.</p>`,

    symbols: [
      { sym: "$TP$", desc: "True Positives: predicted positive and it really was positive (a correct catch)." },
      { sym: "$TN$", desc: "True Negatives: predicted negative and it really was negative (a correct pass)." },
      { sym: "$FP$", desc: "False Positives: predicted positive but it was negative (a false alarm)." },
      { sym: "$FN$", desc: "False Negatives: predicted negative but it was positive (a miss)." },
      { sym: "$P = TP+FN$", desc: "the total number of real positive examples." },
      { sym: "$N = TN+FP$", desc: "the total number of real negative examples." }
    ],

    formula:
      `$$ \\text{accuracy} = \\frac{TP+TN}{TP+TN+FP+FN} \\qquad \\text{precision (PPV)} = \\frac{TP}{TP+FP} $$
       $$ \\text{recall (TPR)} = \\frac{TP}{TP+FN} \\qquad \\text{specificity (TNR)} = \\frac{TN}{TN+FP} $$
       $$ F_1 = \\frac{2\\,TP}{2\\,TP+FP+FN} \\qquad F_\\beta = (1+\\beta^2)\\,\\frac{\\text{prec}\\cdot\\text{rec}}{\\beta^2\\,\\text{prec}+\\text{rec}} $$
       $$ \\text{MCC} = \\frac{TP\\cdot TN - FP\\cdot FN}{\\sqrt{(TP+FP)(TP+FN)(TN+FP)(TN+FN)}} $$`,

    whatItDoes:
      `<p>Here is the whole family, each defined in one plain sentence and built from the four counts. Read every one — together they answer every question you can ask about hard-label mistakes.</p>
       <ul>
         <li><b>Accuracy</b> $= \\dfrac{TP+TN}{\\text{all}}$ — fraction of all predictions that were correct.</li>
         <li><b>Error rate</b> $= 1 - \\text{accuracy} = \\dfrac{FP+FN}{\\text{all}}$ — fraction that were wrong.</li>
         <li><b>Precision</b>, also called <b>PPV (Positive Predictive Value)</b> $= \\dfrac{TP}{TP+FP}$ — of the things you flagged positive, how many really were. Watches false alarms.</li>
         <li><b>Recall</b>, also called <b>sensitivity</b> or <b>TPR (True Positive Rate)</b> $= \\dfrac{TP}{TP+FN}$ — of the real positives, how many you caught. Watches misses.</li>
         <li><b>Specificity</b>, also called <b>TNR (True Negative Rate)</b> $= \\dfrac{TN}{TN+FP}$ — of the real negatives, how many you correctly passed.</li>
         <li><b>FPR (False Positive Rate)</b> $= \\dfrac{FP}{TN+FP} = 1 - \\text{specificity}$ — of the real negatives, how many you falsely flagged.</li>
         <li><b>FNR (False Negative Rate)</b> $= \\dfrac{FN}{TP+FN} = 1 - \\text{recall}$ — of the real positives, how many you missed.</li>
         <li><b>F1</b> $= \\dfrac{2\\,TP}{2\\,TP+FP+FN}$ — the harmonic mean (a "punishing average") of precision and recall; high only when both are high. It ignores TN.</li>
         <li><b>F&beta;</b> — a tunable F-score. $\\beta = 1$ gives F1; $\\beta \\gt  1$ weights recall more (misses hurt more); $\\beta \\lt  1$ weights precision more (false alarms hurt more).</li>
         <li><b>Balanced accuracy</b> $= \\dfrac{\\text{recall} + \\text{specificity}}{2}$ — the average of how well you do on each class separately. Honest when classes are imbalanced.</li>
         <li><b>NPV (Negative Predictive Value)</b> $= \\dfrac{TN}{TN+FN}$ — of the things you flagged negative, how many really were. The mirror of precision.</li>
         <li><b>FDR (False Discovery Rate)</b> $= \\dfrac{FP}{TP+FP} = 1 - \\text{precision}$ — of your positive flags, the fraction that were wrong.</li>
         <li><b>FOR (False Omission Rate)</b> $= \\dfrac{FN}{TN+FN} = 1 - \\text{NPV}$ — of your negative flags, the fraction that were wrong.</li>
         <li><b>MCC (Matthews Correlation Coefficient)</b> — a single number from $-1$ to $+1$ using all four counts ($+1$ perfect, $0$ random, $-1$ totally wrong). The most trustworthy one-number summary on imbalanced data because no box is ignored.</li>
         <li><b>Cohen's kappa</b> $\\kappa = \\dfrac{p_o - p_e}{1 - p_e}$ — accuracy corrected for the agreement you would get by random guessing ($p_o$ = observed accuracy, $p_e$ = chance accuracy). $1$ perfect, $0$ no better than chance.</li>
         <li><b>Youden's J</b> $= \\text{recall} + \\text{specificity} - 1 = \\text{TPR} - \\text{FPR}$ — one number for how much better than chance the cutoff is; also called <b>informedness</b>.</li>
         <li><b>Informedness</b> $= \\text{TPR} + \\text{TNR} - 1$ (= Youden's J) and <b>markedness</b> $= \\text{PPV} + \\text{NPV} - 1$ — the two halves whose geometric mean is MCC.</li>
         <li><b>Jaccard index</b> $= \\dfrac{TP}{TP+FP+FN}$ — overlap between predicted-positive and real-positive sets; like F1 it ignores TN.</li>
       </ul>
       <p><b>Averaging for multi-class</b> (more than two classes). Compute precision/recall/F1 per class, then combine:</p>
       <ul>
         <li><b>Macro</b> — plain average across classes. Every class counts equally, so a tiny class can drag the score down. Use it to surface rare-class failure.</li>
         <li><b>Micro</b> — pool all the TP, FP, FN across classes first, then compute once. Every <i>example</i> counts equally, so big classes dominate. Micro-F1 equals overall accuracy in the single-label case.</li>
         <li><b>Weighted</b> — average the per-class scores weighted by how many true examples each class has. A compromise between macro and micro.</li>
       </ul>`,

    derivation:
      `<p>Why does precision use $TP+FP$ in the denominator while recall uses $TP+FN$? Because they ask different questions, and the denominator is the group you are asking about.</p>
       <p>Precision asks "of my positive predictions, what fraction were right?" Your positive predictions are exactly $TP + FP$ (the ones you got right plus the false alarms), so that is the denominator.</p>
       <p>Recall asks "of the real positives, what fraction did I catch?" The real positives are $TP + FN$ (the ones you caught plus the ones you missed), so that is its denominator.</p>
       <p>F1 blends them with the <b>harmonic mean</b>, $\\dfrac{2pr}{p+r}$, not the plain average. The harmonic mean is dragged toward the smaller number, so you cannot score well by being great at one and terrible at the other — both must be high. Substituting $p$ and $r$ and simplifying gives the tidy $\\dfrac{2TP}{2TP+FP+FN}$, which shows directly that TN never appears.</p>
       <p>MCC is the correlation coefficient between the predicted labels and the true labels treated as $0/1$ numbers. A correlation runs from $-1$ to $+1$ and only hits $+1$ when all four boxes line up, which is why it stays honest even when one class is rare.</p>`,

    example:
      `<p>Take the real confusion matrix from the model in the chart below (malignant = positive): $TP = 55$, $FP = 8$, $FN = 15$, $TN = 110$. Real positives $P = 55+15 = 70$, real negatives $N = 110+8 = 118$, total $= 188$.</p>
       <ul class="steps">
         <li>Accuracy $= \\dfrac{55+110}{188} = \\dfrac{165}{188} \\approx 0.878$ &nbsp; (error rate $\\approx 0.122$).</li>
         <li>Precision (PPV) $= \\dfrac{55}{55+8} = \\dfrac{55}{63} \\approx 0.873$.</li>
         <li>Recall / sensitivity / TPR $= \\dfrac{55}{55+15} = \\dfrac{55}{70} \\approx 0.786$.</li>
         <li>Specificity / TNR $= \\dfrac{110}{110+8} = \\dfrac{110}{118} \\approx 0.932$ &nbsp; (FPR $\\approx 0.068$, FNR $\\approx 0.214$).</li>
         <li>F1 $= \\dfrac{2\\times 55}{2\\times 55 + 8 + 15} = \\dfrac{110}{133} \\approx 0.827$.</li>
         <li>Balanced accuracy $= \\dfrac{0.786 + 0.932}{2} \\approx 0.859$.</li>
         <li>NPV $= \\dfrac{110}{110+15} = \\dfrac{110}{125} = 0.880$.</li>
         <li>Jaccard $= \\dfrac{55}{55+8+15} = \\dfrac{55}{78} \\approx 0.705$.</li>
         <li>Youden's J (informedness) $= 0.786 + 0.932 - 1 = 0.718$.</li>
         <li>MCC $= \\dfrac{55\\cdot110 - 8\\cdot15}{\\sqrt{63\\cdot70\\cdot118\\cdot125}} = \\dfrac{5930}{\\sqrt{65{,}047{,}500}} \\approx 0.735$.</li>
       </ul>
       <p>Notice accuracy ($0.878$) flatters the model: balanced accuracy ($0.859$) and MCC ($0.735$) are lower because the model misses more malignant cases (recall $0.786$) than its overall accuracy suggests.</p>`,

    demo: function (host) {
      function C(){var s=getComputedStyle(document.documentElement);var g=function(n,d){return (s.getPropertyValue(n)||d).trim();};
        return {ink:g("--ink","#e6edf3"),dim:g("--ink-dim","#9aa7b4"),accent:g("--accent","#4ea1ff"),accent2:g("--accent-2","#7ee787"),warn:g("--warn","#ffb454"),purple:g("--purple","#c89bff"),border:g("--border","#2a3340"),panel:g("--panel","#161c24")};}
      // fixed real confusion matrix from the breast-cancer model in the chart
      var TP = 55, FP = 8, FN = 15, TN = 110;
      var cv = document.createElement("canvas"); cv.width = 640; cv.height = 250; cv.style.maxWidth = "100%"; host.appendChild(cv);
      var ctx = cv.getContext("2d");
      var readout = document.createElement("div"); readout.className = "out"; readout.style.marginTop = "6px"; host.appendChild(readout);

      function cell(x, y, w, h, label, val, color, sub) {
        var col = C();
        ctx.fillStyle = color + "2a"; ctx.fillRect(x, y, w, h);
        ctx.strokeStyle = color; ctx.lineWidth = 2; ctx.strokeRect(x, y, w, h);
        ctx.textAlign = "center";
        ctx.fillStyle = col.dim; ctx.font = "12px sans-serif"; ctx.fillText(label, x + w / 2, y + 20);
        ctx.fillStyle = col.ink; ctx.font = "bold 30px sans-serif"; ctx.fillText(String(val), x + w / 2, y + h / 2 + 14);
        ctx.fillStyle = col.dim; ctx.font = "11px sans-serif"; ctx.fillText(sub, x + w / 2, y + h - 10);
      }
      function draw() {
        var col = C(); ctx.clearRect(0, 0, 640, 250);
        var gx = 160, gy = 34, cw = 190, ch = 88, gap = 8;
        ctx.fillStyle = col.dim; ctx.font = "12px sans-serif"; ctx.textAlign = "center";
        ctx.fillText("predicted positive", gx + cw / 2, gy - 12);
        ctx.fillText("predicted negative", gx + cw + gap + cw / 2, gy - 12);
        ctx.save(); ctx.translate(gx - 26, gy + ch / 2); ctx.rotate(-Math.PI / 2); ctx.fillText("actual +", 0, 0); ctx.restore();
        ctx.save(); ctx.translate(gx - 26, gy + ch + gap + ch / 2); ctx.rotate(-Math.PI / 2); ctx.fillText("actual −", 0, 0); ctx.restore();
        cell(gx, gy, cw, ch, "True Positive", TP, "#7ee787", "caught malignant");
        cell(gx + cw + gap, gy, cw, ch, "False Negative", FN, "#ff6b6b", "missed malignant");
        cell(gx, gy + ch + gap, cw, ch, "False Positive", FP, "#ff6b6b", "false alarm");
        cell(gx + cw + gap, gy + ch + gap, cw, ch, "True Negative", TN, "#7ee787", "correctly cleared");
      }
      function render() {
        draw();
        var acc = (TP + TN) / (TP + TN + FP + FN);
        var prec = TP / (TP + FP), rec = TP / (TP + FN), spec = TN / (TN + FP);
        var f1 = 2 * TP / (2 * TP + FP + FN);
        var bal = (rec + spec) / 2;
        var mcc = (TP * TN - FP * FN) / Math.sqrt((TP + FP) * (TP + FN) * (TN + FP) * (TN + FN));
        readout.innerHTML =
          "From these four counts: Accuracy = <b>" + acc.toFixed(3) + "</b>, Precision = <b>" + prec.toFixed(3) +
          "</b>, Recall = <b>" + rec.toFixed(3) + "</b>, Specificity = <b>" + spec.toFixed(3) + "</b>, F1 = <b>" + f1.toFixed(3) +
          "</b>, Balanced accuracy = <b>" + bal.toFixed(3) + "</b>, MCC = <b>" + mcc.toFixed(3) + "</b>." +
          "<br>Accuracy looks higher than MCC because the model misses some malignant cases (recall " + rec.toFixed(3) + ") that accuracy partly hides behind the easy negatives.";
      }
      render();
    },

    practice: [
      {
        q: `A classifier gives TP $= 40$, FP $= 10$, FN $= 20$, TN $= 130$. Find precision, recall, specificity, and accuracy.`,
        steps: [
          { do: `Precision $= TP/(TP+FP) = 40/50$.`, why: `Precision asks: of the positive flags, how many were right?` },
          { do: `Recall $= TP/(TP+FN) = 40/60$.`, why: `Recall asks: of the real positives, how many were caught?` },
          { do: `Specificity $= TN/(TN+FP) = 130/140$.`, why: `Specificity is recall for the negative class.` },
          { do: `Accuracy $= (TP+TN)/\\text{all} = 170/200$.`, why: `Accuracy is all correct over all predictions.` }
        ],
        answer: `Precision $= 0.80$, recall $\\approx 0.667$, specificity $\\approx 0.929$, accuracy $= 0.85$.`
      },
      {
        q: `A test set has 990 negatives and 10 positives. A model predicts "negative" for everything. What is its accuracy, and what is its recall?`,
        steps: [
          { do: `Count the boxes: TP $= 0$, FP $= 0$, FN $= 10$, TN $= 990$.`, why: `Predicting all-negative means zero positive flags.` },
          { do: `Accuracy $= (0+990)/1000 = 0.99$.`, why: `It gets every negative right, and negatives dominate.` },
          { do: `Recall $= 0/(0+10) = 0$.`, why: `It caught none of the 10 real positives.` }
        ],
        answer: `Accuracy $= 0.99$ but recall $= 0$. This is exactly why accuracy lies under imbalance — report MCC or balanced accuracy instead.`
      },
      {
        q: `Why can two classifiers have the same F1 but very different specificity?`,
        steps: [
          { do: `Write F1 $= 2TP/(2TP+FP+FN)$.`, why: `Notice TN never appears in the formula.` },
          { do: `Change TN while keeping TP, FP, FN fixed.`, why: `F1 stays identical, but specificity $= TN/(TN+FP)$ changes.` }
        ],
        answer: `F1 ignores true negatives entirely, so two models with the same TP/FP/FN but different TN share an F1 yet differ in specificity. Pair F1 with MCC or specificity to see the difference.`
      }
    ]
  });

  window.CODE["met-classification-label"] = {
    lib: "scikit-learn",
    runnable: false,
    explain: `<p>Train a logistic-regression classifier, then score its hard labels with the standard <code>sklearn.metrics</code> functions. <code>classification_report</code> with different <code>average=</code> values shows macro / micro / weighted averaging side by side.</p>`,
    code: `from sklearn.datasets import load_breast_cancer
from sklearn.model_selection import train_test_split
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import (
    precision_score, recall_score, f1_score, fbeta_score,
    balanced_accuracy_score, matthews_corrcoef, cohen_kappa_score,
    classification_report, confusion_matrix,
)

X, y = load_breast_cancer(return_X_y=True)
X_tr, X_te, y_tr, y_te = train_test_split(
    X, y, test_size=0.33, random_state=0, stratify=y)

clf = LogisticRegression(max_iter=10000).fit(X_tr, y_tr)
pred = clf.predict(X_te)            # hard labels (0/1), not probabilities

# In sklearn's breast-cancer data 0 = malignant. Treat malignant as the
# positive class so "recall" means "fraction of tumors we caught".
pos = 0
print("confusion matrix [rows=true, cols=pred]:")
print(confusion_matrix(y_te, pred, labels=[0, 1]))

print("precision (PPV) :", precision_score(y_te, pred, pos_label=pos))
print("recall (TPR)    :", recall_score(y_te, pred, pos_label=pos))
print("F1              :", f1_score(y_te, pred, pos_label=pos))
print("F-beta (beta=2) :", fbeta_score(y_te, pred, beta=2, pos_label=pos))
print("balanced acc    :", balanced_accuracy_score(y_te, pred))
print("MCC             :", matthews_corrcoef(y_te, pred))
print("Cohen's kappa   :", cohen_kappa_score(y_te, pred))

# averaging variants for the (here binary, but works for multi-class) report
print(classification_report(y_te, pred, digits=3))          # per-class table
print("macro F1   :", f1_score(y_te, pred, average="macro"))
print("micro F1   :", f1_score(y_te, pred, average="micro"))
print("weighted F1:", f1_score(y_te, pred, average="weighted"))`
  };

  window.CODEVIZ["met-classification-label"] = {
    question: "How do the hard-label metrics compare for a real logistic-regression tumor classifier?",
    charts: [
      {
        type: "bars",
        title: "Hard-label metrics for logistic regression on breast cancer (malignant = positive)",
        xlabel: "metric",
        ylabel: "score",
        labels: ["accuracy", "precision", "recall", "F1", "balanced acc", "MCC"],
        values: [0.878, 0.873, 0.786, 0.827, 0.859, 0.735],
        valueLabels: ["0.878", "0.873", "0.786", "0.827", "0.859", "0.735"],
        colors: ["#4ea1ff", "#7ee787", "#ffb454", "#c89bff", "#7ee787", "#ff7b72"]
      }
    ],
    caption: "All six come from one confusion matrix (TP=55, FP=8, FN=15, TN=110). Accuracy (0.878) is the rosiest; MCC (0.735) is the strictest because it uses all four counts and is not fooled by the easy negatives.",
    code: `import numpy as np
from sklearn.datasets import load_breast_cancer
from sklearn.model_selection import train_test_split
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import (
    accuracy_score, precision_score, recall_score, f1_score,
    balanced_accuracy_score, matthews_corrcoef, confusion_matrix,
)

X, y = load_breast_cancer(return_X_y=True)
# a few raw features -> a realistically imperfect model, so the metrics spread out
X = X[:, [0, 3, 7]]   # mean radius, mean area, mean concave points
X_tr, X_te, y_tr, y_te = train_test_split(
    X, y, test_size=0.33, random_state=0, stratify=y)

clf = LogisticRegression(max_iter=10000).fit(X_tr, y_tr)
pred = clf.predict(X_te)

pos = 0  # malignant is the positive class
tn, fp, fn, tp = confusion_matrix(y_te, pred, labels=[1, 0]).ravel()
print("TP,FP,FN,TN:", tp, fp, fn, tn)   # -> 55 8 15 110

print(round(accuracy_score(y_te, pred), 3))                        # 0.878
print(round(precision_score(y_te, pred, pos_label=pos), 3))        # 0.873
print(round(recall_score(y_te, pred, pos_label=pos), 3))           # 0.786
print(round(f1_score(y_te, pred, pos_label=pos), 3))               # 0.827
print(round(balanced_accuracy_score(y_te, pred), 3))               # 0.859
print(round(matthews_corrcoef(y_te, pred), 3))                     # 0.735`
  };
})();
