/* =====================================================================
   Metrics & Evaluation — BEGINNER lesson
   id: met-multilabel — "Metrics for many classes and many labels."
   Self-contained: window.LESSONS + window.CODE + window.CODEVIZ.
   CODEVIZ numbers computed on real load_digits (10 classes) with
   scikit-learn 1.6.1 (LogisticRegression, 30% held-out test).
   ===================================================================== */
(function () {
  window.LESSONS.push({
    id: "met-multilabel",
    title: "Metrics for many classes & many labels",
    tagline: "How to score a model when there are many classes — or when each example can wear several labels at once.",
    module: "Metrics & Evaluation — measuring models, data & statistics",
    prereqs: ["ml-classification-metrics"],

    whenToUse:
      `<p><b>First, know which world you are in.</b></p>
       <ul>
         <li><b>Multiclass</b> (one label per example): a digit is exactly one of $0\\ldots9$; an email is spam <i>or</i> ham. Pick the single most likely class.</li>
         <li><b>Multilabel</b> (several labels per example): a news article can be tagged <i>politics</i> AND <i>economy</i> AND <i>Europe</i> all at once; a photo can contain a dog, a person, and a ball. Each label is a separate yes/no.</li>
       </ul>
       <p><b>For many classes (multiclass), which average?</b></p>
       <ul>
         <li><b>Macro</b> — average the per-class scores with <i>equal weight</i>. Use it when every class matters the same, even tiny ones (e.g. a rare disease class must not be ignored).</li>
         <li><b>Micro</b> — pool every example's right/wrong counts into one big tally, then score once. Use it when you care about <i>overall</i> correctness and big classes should dominate. With one label per example, micro-F1 equals plain accuracy.</li>
         <li><b>Weighted</b> — like macro, but each class's score is weighted by how many examples it has (its <i>support</i>). A compromise: respects class sizes without fully ignoring small ones.</li>
         <li><b>Top-k accuracy</b> — give partial credit if the true class is among the model's top $k$ guesses. Use it when "show 3 candidates and let the user pick" is the real product (image search, autocomplete).</li>
       </ul>
       <p><b>For multilabel, reach for the multilabel-specific metrics:</b> Hamming loss (per-label error rate), subset / exact-match accuracy (strictest), example-based vs label-based F1, and the ranking metrics — LRAP (Label Ranking Average Precision), coverage error, and label ranking loss — when the model outputs a <i>ranked list</i> of likely labels.</p>
       <p>This lesson is the many-class / many-label sequel to <code>[met-classification-label]</code> (precision, recall, F1 for one class).</p>`,

    application:
      `<p>These metrics show up everywhere there are more than two answers. Handwritten-digit and species classifiers report <b>per-class F1</b> and a <b>confusion matrix</b>. Image tagging, document categorization, gene-function prediction, and music auto-tagging are <b>multilabel</b> and live on Hamming loss and example-based F1. Recommenders and retrieval ("did the right item make the top 5?") report <b>top-k accuracy</b> and the <b>ranking</b> metrics (LRAP, coverage error). Any leaderboard with dozens of classes leans on <b>macro vs micro</b> to summarize the whole table in one number.</p>`,

    pitfalls:
      `<ul>
         <li><b>Micro-average hides rare-class failure.</b> Micro pools all examples, so a few huge classes drown out a small one. A model can score 0.98 micro-F1 while completely failing the rarest class. <i>Fix:</i> always report <b>macro-F1</b> too, and read the <b>per-class</b> row — the lowest per-class F1 is the real risk.</li>
         <li><b>Exact match (subset accuracy) is brutally strict.</b> In multilabel, one wrong label on a 10-label example makes the whole example count as wrong. A model can be 90% right per label yet have near-zero subset accuracy. <i>Fix:</i> pair it with <b>Hamming loss</b> and <b>example-based F1</b>, which give partial credit.</li>
         <li><b>Class imbalance across many classes.</b> With 50 classes, "accuracy" can be high just by nailing the 3 common ones. <i>Fix:</i> use macro or weighted averaging and inspect support counts so you know which scores rest on only a handful of examples.</li>
         <li><b>Top-k flatters big k.</b> Top-5 accuracy on a 5-class problem is trivially 100%. Keep $k$ small relative to the number of classes, and report top-1 alongside it.</li>
         <li><b>Mixing up the two worlds.</b> Feeding multilabel data to multiclass metrics (or vice versa) silently mis-scores. Check: does each example have exactly one label (multiclass) or a set (multilabel)?</li>
       </ul>`,

    bigIdea:
      `<p>With two classes you had one confusion matrix and one precision/recall pair. With <b>many classes</b> you get a bigger confusion matrix and a precision/recall pair <i>per class</i> — then you must summarize them into one number (that is what macro / micro / weighted do).</p>
       <p>With <b>multilabel</b> the very notion of "correct" changes: an answer is now a <i>set</i> of labels, so we measure how much two sets overlap (Hamming loss, example-based F1) or how well the model <i>ranks</i> the true labels to the top (LRAP, coverage, ranking loss).</p>`,

    buildup:
      `<p><b>Step 1 — the multiclass confusion matrix.</b> For $C$ classes it is a $C\\times C$ table. Row = true class, column = predicted class. The diagonal counts correct predictions; off-diagonal cells show <i>which</i> class got confused for which.</p>
       <p><b>Step 2 — per-class precision and recall.</b> Treat each class as its own one-vs-rest yes/no problem. For class $c$: precision $=\\frac{TP_c}{TP_c+FP_c}$ (of everything called $c$, how much really was $c$), recall $=\\frac{TP_c}{TP_c+FN_c}$ (of all true $c$, how much we caught). Their harmonic mean is the per-class $F_1$.</p>
       <p><b>Step 3 — average them.</b> Macro = plain mean of the per-class scores; micro = recompute from the pooled $TP/FP/FN$ over all classes; weighted = mean weighted by each class's support.</p>
       <p><b>Step 4 — multilabel.</b> Each example is a 0/1 vector over labels. Now compare the predicted vector to the true vector with set-overlap or ranking metrics.</p>`,

    symbols: [
      { sym: "$C$", desc: "the number of classes (multiclass) or labels (multilabel)." },
      { sym: "$N$", desc: "the number of examples (rows of data)." },
      { sym: "$TP_c, FP_c, FN_c$", desc: "true positives, false positives, false negatives for class $c$ — True/False Positive/Negative counts, treating class $c$ as the 'yes'." },
      { sym: "$P_c, R_c$", desc: "precision and recall for class $c$ (Step 2 above)." },
      { sym: "$\\text{supp}_c$", desc: "the support of class $c$: how many true examples belong to it." },
      { sym: "$y_i$", desc: "the true label set of example $i$ (a set of labels in multilabel; one label in multiclass)." },
      { sym: "$\\hat{y}_i$", desc: "the predicted label set of example $i$ ($\\hat{y}$ is read 'y-hat', meaning a predicted value)." },
      { sym: "$Y_{ij}$", desc: "1 if example $i$ truly has label $j$, else 0 (the true 0/1 multilabel matrix)." },
      { sym: "$\\hat{Y}_{ij}$", desc: "1 if the model predicts label $j$ for example $i$, else 0." },
      { sym: "$f_{ij}$", desc: "the model's score (confidence) for label $j$ on example $i$, used to rank labels." },
      { sym: "$k$", desc: "the cutoff in top-$k$ accuracy: how many top guesses we allow." },
      { sym: "$\\mathbb{1}[\\cdot]$", desc: "the indicator: 1 if the bracketed statement is true, else 0." }
    ],

    formula:
      `$$ \\text{top-}k\\text{ acc} = \\frac{1}{N}\\sum_{i=1}^{N}\\mathbb{1}\\big[y_i \\in \\text{top-}k(f_i)\\big] $$
       $$ F_1^{\\text{macro}}=\\frac{1}{C}\\sum_{c=1}^{C} F_{1,c}, \\qquad F_1^{\\text{micro}}=\\frac{2\\sum_c TP_c}{2\\sum_c TP_c+\\sum_c FP_c+\\sum_c FN_c} $$
       $$ \\text{Hamming loss}=\\frac{1}{N\\,C}\\sum_{i=1}^{N}\\sum_{j=1}^{C}\\mathbb{1}\\big[\\hat{Y}_{ij}\\neq Y_{ij}\\big], \\qquad \\text{subset acc}=\\frac{1}{N}\\sum_{i=1}^{N}\\mathbb{1}\\big[\\hat{y}_i = y_i\\big] $$
       $$ F_1^{\\text{example}}=\\frac{1}{N}\\sum_{i=1}^{N}\\frac{2\\,|\\hat{y}_i\\cap y_i|}{|\\hat{y}_i|+|y_i|} $$`,

    whatItDoes:
      `<p><b>Top-k accuracy</b> counts an example right if its true class is anywhere in the model's $k$ highest-scoring guesses. $k=1$ is ordinary accuracy.</p>
       <p><b>Macro-F1</b> averages the per-class $F_1$ with equal weight — small classes count as much as big ones. <b>Micro-F1</b> first sums the $TP/FP/FN$ across all classes, then computes one $F_1$ — big classes dominate. <b>Weighted-F1</b> (not shown) averages the per-class $F_1$ weighted by support.</p>
       <p><b>Hamming loss</b> is just the fraction of label slots ($N\\times C$ of them) the model got wrong — the gentlest multilabel error. <b>Subset accuracy</b> (exact match) demands the <i>whole</i> predicted set equal the true set — the strictest.</p>
       <p><b>Example-based F1</b> measures, per example, the overlap between predicted and true label sets ($\\cap$ means 'in both'; $|\\cdot|$ means 'size of the set'), then averages over examples. <b>Label-based F1</b> instead is the macro/micro F1 computed down each label column — example-based asks "did this example's tags overlap?", label-based asks "how well is each tag predicted across all examples?".</p>
       <p><b>The ranking trio</b> uses the scores $f_{ij}$, not hard 0/1 predictions. <b>LRAP</b> (Label Ranking Average Precision) asks, for each true label, what fraction of labels ranked above it are also true — 1.0 means every true label sits at the top. <b>Coverage error</b> is how far down the ranked list you must go to collect all true labels (smaller is better). <b>Label ranking loss</b> is the fraction of (true-label, false-label) pairs that are mis-ordered — i.e. a wrong label outranks a right one (smaller is better).</p>`,

    derivation:
      `<p><b>Why micro-F1 equals accuracy when there is one label per example.</b></p>
       <ul class="steps">
         <li>In single-label multiclass, every example contributes exactly one prediction. If it is correct, it adds a $TP$ to its true class. If wrong, it adds an $FP$ to the predicted class <i>and</i> an $FN$ to the true class.</li>
         <li>So summed over all classes, $\\sum_c TP_c =$ (#correct), and $\\sum_c FP_c=\\sum_c FN_c=$ (#wrong) — each error is double-counted, once as an FP and once as an FN.</li>
         <li>Plug into micro-F1: $\\dfrac{2\\,(\\#\\text{correct})}{2\\,(\\#\\text{correct})+(\\#\\text{wrong})+(\\#\\text{wrong})}=\\dfrac{\\#\\text{correct}}{\\#\\text{correct}+\\#\\text{wrong}}=\\text{accuracy}.$ $\\blacksquare$</li>
       </ul>
       <p><b>Why Hamming loss is so forgiving and subset accuracy so harsh.</b> Hamming divides errors by $N\\times C$ — the total number of yes/no decisions — so one flipped label out of, say, $5\\times10=50$ slots costs only $0.02$. Subset accuracy divides by $N$ and demands a perfect row, so that <i>same</i> single flip makes the whole example count as wrong. Same mistake, wildly different penalty: that is why they should always be read together.</p>`,

    example:
      `<p><b>Tiny multilabel example, $N=5$ examples and $C=3$ labels.</b> Truth and prediction as 0/1 vectors:</p>
       <ul class="steps">
         <li>True $Y$ rows: $[1,0,1],[0,1,1],[1,1,0],[0,0,1],[1,0,0]$. Predicted $\\hat{Y}$: $[1,0,1],[0,1,0],[1,1,1],[0,0,1],[0,0,0]$.</li>
         <li><b>Hamming loss:</b> count slot mismatches. Row 2 misses label 3 (1 miss); row 3 wrongly adds label 3 (1 miss); row 5 misses label 1 (1 miss). That is $3$ wrong out of $5\\times3=15$ slots, so Hamming $=3/15=\\mathbf{0.20}$.</li>
         <li><b>Subset (exact-match) accuracy:</b> rows 1 and 4 match exactly; rows 2, 3, 5 do not. So $2/5=\\mathbf{0.40}$ — far below "80% of slots right".</li>
         <li><b>Example-based F1:</b> row 1 overlap $2/(2+2)\\!\\to\\!F_1=1$; row 4 $F_1=1$; row 2 predicts $\\{2\\}$ vs true $\\{2,3\\}\\to 2\\cdot1/(1+2)=0.667$; row 3 predicts $\\{1,2,3\\}$ vs true $\\{1,2\\}\\to 2\\cdot2/(3+2)=0.8$; row 5 predicts $\\{\\}$ vs true $\\{1\\}\\to0$. Mean $=(1+0.667+0.8+1+0)/5=\\mathbf{0.693}$.</li>
         <li><b>Ranking (using scores):</b> with imperfect scores that sometimes float a wrong label above a right one, sklearn gives LRAP $=\\mathbf{0.733}$, coverage error $=\\mathbf{2.2}$ (you must scan ~2.2 labels down to gather all true ones), and label ranking loss $=\\mathbf{0.5}$ (half the right/wrong label pairs are mis-ordered).</li>
       </ul>
       <p>Notice how the <i>same</i> predictions look "good" (Hamming 0.20) or "bad" (subset 0.40) depending on which metric you read — exactly why you report several.</p>`,

    demo: function (host) {
      // Interactive: flip predicted labels in a 4x3 multilabel grid and watch
      // Hamming loss, subset accuracy, and example-based F1 update live.
      var Ytrue = [[1,0,1],[0,1,1],[1,1,0],[0,0,1]];
      var Ypred = [[1,0,1],[0,1,0],[1,1,1],[0,0,1]];
      var N = Ytrue.length, C = Ytrue[0].length;
      var wrap = document.createElement("div");
      var readout = document.createElement("div"); readout.className = "out"; readout.style.marginTop = "8px";

      function exF1(t, p) {
        var inter = 0, st = 0, sp = 0;
        for (var j = 0; j < C; j++) { inter += (t[j] && p[j]) ? 1 : 0; st += t[j]; sp += p[j]; }
        if (st + sp === 0) return 1; // both empty = perfect match
        return (2 * inter) / (st + sp);
      }
      function render() {
        wrap.innerHTML = "";
        var note = document.createElement("div");
        note.innerHTML = "<b>Multilabel toy:</b> 4 examples, 3 labels. Click a cell in the <i>Predicted</i> grid to flip that label. The true grid is fixed.";
        note.style.marginBottom = "6px";
        wrap.appendChild(note);
        var tbl = document.createElement("div"); tbl.style.display = "flex"; tbl.style.gap = "24px"; tbl.style.flexWrap = "wrap";
        var c = (typeof theme === "function") ? theme() : { accent: "#4ea1ff", warn: "#ff7b72", dim: "#888", border: "#444" };
        ["True", "Predicted"].forEach(function (which) {
          var grid = Ytrue; if (which === "Predicted") grid = Ypred;
          var box = document.createElement("div");
          var h = document.createElement("div"); h.textContent = which + " labels"; h.style.fontWeight = "bold"; h.style.marginBottom = "4px"; box.appendChild(h);
          for (var i = 0; i < N; i++) {
            var row = document.createElement("div"); row.style.display = "flex"; row.style.gap = "4px"; row.style.marginBottom = "4px";
            for (var j = 0; j < C; j++) {
              (function (ii, jj, w) {
                var cell = document.createElement("div");
                cell.textContent = grid[ii][jj];
                cell.style.cssText = "width:30px;height:30px;display:flex;align-items:center;justify-content:center;border:1px solid " + c.border + ";border-radius:5px;font-weight:bold;";
                cell.style.background = grid[ii][jj] ? c.accent : "transparent";
                cell.style.color = grid[ii][jj] ? "#fff" : c.dim;
                if (w === "Predicted") {
                  cell.style.cursor = "pointer";
                  cell.addEventListener("click", function () { Ypred[ii][jj] = Ypred[ii][jj] ? 0 : 1; render(); });
                }
                row.appendChild(cell);
              })(i, j, which);
            }
            box.appendChild(row);
          }
          tbl.appendChild(box);
        });
        wrap.appendChild(tbl);
        // metrics
        var wrong = 0, exact = 0, f1sum = 0;
        for (var i2 = 0; i2 < N; i2++) {
          var eq = true;
          for (var j2 = 0; j2 < C; j2++) { if (Ytrue[i2][j2] !== Ypred[i2][j2]) { wrong++; eq = false; } }
          if (eq) exact++;
          f1sum += exF1(Ytrue[i2], Ypred[i2]);
        }
        var ham = wrong / (N * C), sub = exact / N, ef1 = f1sum / N;
        readout.innerHTML = "Hamming loss = <b>" + ham.toFixed(3) + "</b> (" + wrong + "/" + (N * C) +
          " slots wrong) &nbsp;|&nbsp; Subset (exact-match) accuracy = <b>" + sub.toFixed(3) + "</b> (" + exact + "/" + N +
          " rows perfect) &nbsp;|&nbsp; Example-based F1 = <b>" + ef1.toFixed(3) + "</b>.<br>" +
          "Flip one cell and watch exact-match punish it far harder than Hamming loss does.";
        wrap.appendChild(readout);
      }
      render();
      host.appendChild(wrap);
    },

    practice: [
      {
        q: `A 10-class digit model gets micro-F1 = 0.96 but its per-class F1 for the digit '8' is only 0.92. The leaderboard shows micro-F1. Why might that be hiding a problem, and what should you report?`,
        steps: [
          { do: `Recall what micro does: it pools every example's right/wrong counts across all 10 classes into one tally.`, why: `Because big and easy classes contribute most of the pooled counts, a weak class barely moves the micro number.` },
          { do: `Compute the macro-F1 (equal-weight mean of the 10 per-class F1) and read the per-class row.`, why: `Macro gives class '8' a full 1/10 vote, so its weakness shows; the per-class row pinpoints exactly where the model fails.` }
        ],
        answer: `Micro-F1 = 0.96 is dominated by the many easy digits, so the weak '8' (F1 = 0.92) is invisible in it. Report macro-F1 and the full per-class F1 table; the lowest per-class score (here '8') is the real risk to watch.`
      },
      {
        q: `In a multilabel tagging task, a model is 90% correct on each individual label, yet its subset (exact-match) accuracy is only ~40%. Is the model broken?`,
        steps: [
          { do: `Note subset accuracy needs the ENTIRE predicted set to equal the true set for an example to count.`, why: `One wrong label anywhere on an example zeroes the whole row, no partial credit.` },
          { do: `Estimate: if there are ~5 labels and each is right 90% of the time, the chance ALL five are right is about $0.9^5\\approx0.59$ — and harder cases push it lower.`, why: `Per-label accuracy and exact-match measure different things; high per-label accuracy can still give low exact-match.` }
        ],
        answer: `Not necessarily. Exact-match is brutally strict, so strong per-label accuracy still yields modest subset accuracy. Report Hamming loss (here ~0.10) and example-based F1 alongside it for a fair picture.`
      },
      {
        q: `For a label-ranking model you get LRAP = 0.73, coverage error = 2.2, and label ranking loss = 0.5. In plain words, what do these say?`,
        steps: [
          { do: `Read LRAP: average over true labels of (fraction of labels ranked at or above it that are also true). 1.0 = all true labels sit at the very top.`, why: `0.73 means true labels are usually near the top but some wrong labels slip above them.` },
          { do: `Read coverage error and ranking loss: how far down to gather all true labels, and the fraction of (true, false) label pairs that are mis-ordered.`, why: `Coverage 2.2 = scan about 2.2 labels deep; ranking loss 0.5 = half the right/wrong pairs are in the wrong order.` }
        ],
        answer: `True labels usually rank high (LRAP 0.73) but not perfectly; you must scan ~2.2 labels down to catch all true ones (coverage 2.2), and half of the true-vs-false label pairs are mis-ordered (ranking loss 0.5). Lower coverage and ranking loss, higher LRAP, are better.`
      }
    ]
  });

  window.CODE["met-multilabel"] = {
    lib: "scikit-learn",
    runnable: true,
    packages: ["numpy", "scikit-learn"],
    explain: `<p>Two halves. First, <b>multiclass</b> on real digits: <code>top_k_accuracy_score</code> (top-1 and top-3) and the full <code>classification_report</code> (per-class precision/recall/F1 plus macro/micro/weighted rows). Second, a tiny <b>multilabel</b> example showing <code>hamming_loss</code>, exact-match via <code>accuracy_score</code>, <code>f1_score</code> with each averaging mode, and the ranking metrics <code>label_ranking_average_precision_score</code>, <code>coverage_error</code>, and <code>label_ranking_loss</code>.</p>`,
    code: `import numpy as np
from sklearn.datasets import load_digits
from sklearn.model_selection import train_test_split
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import (top_k_accuracy_score, classification_report,
    hamming_loss, accuracy_score, f1_score,
    label_ranking_average_precision_score, coverage_error, label_ranking_loss)

# ---- MULTICLASS: 10-class handwritten digits ----
X, y = load_digits(return_X_y=True)
Xtr, Xte, ytr, yte = train_test_split(
    X, y, test_size=0.3, random_state=0, stratify=y)
clf = LogisticRegression(max_iter=5000, random_state=0).fit(Xtr, ytr)

pred  = clf.predict(Xte)
proba = clf.predict_proba(Xte)          # scores for top-k

print("top-1 accuracy:", round(top_k_accuracy_score(yte, proba, k=1), 4))
print("top-3 accuracy:", round(top_k_accuracy_score(yte, proba, k=3), 4))
# per-class precision/recall/F1 + macro / micro / weighted summary rows:
print(classification_report(yte, pred, digits=3))

# ---- MULTILABEL: 5 examples, 3 labels each ----
Y_true = np.array([[1,0,1],[0,1,1],[1,1,0],[0,0,1],[1,0,0]])
Y_pred = np.array([[1,0,1],[0,1,0],[1,1,1],[0,0,1],[0,0,0]])
# model scores (confidences) used by the ranking metrics:
Y_score = np.array([[0.7,0.9,0.2],[0.3,0.6,0.5],[0.6,0.5,0.7],
                    [0.1,0.2,0.7],[0.4,0.5,0.2]])

print("hamming loss       :", round(hamming_loss(Y_true, Y_pred), 4))
print("subset/exact match :", round(accuracy_score(Y_true, Y_pred), 4))
print("F1 micro           :", round(f1_score(Y_true, Y_pred, average="micro"), 4))
print("F1 macro           :", round(f1_score(Y_true, Y_pred, average="macro"), 4))
print("F1 samples (ex-based):", round(f1_score(Y_true, Y_pred, average="samples"), 4))
print("F1 weighted        :", round(f1_score(Y_true, Y_pred, average="weighted"), 4))
print("LRAP               :", round(label_ranking_average_precision_score(Y_true, Y_score), 4))
print("coverage error     :", round(coverage_error(Y_true, Y_score), 4))
print("label ranking loss :", round(label_ranking_loss(Y_true, Y_score), 4))`
  };

  window.CODEVIZ["met-multilabel"] = {
    question: "On ONE imbalanced multilabel example, why do macro-F1, micro-F1 and weighted-F1 give three different numbers — and how do Hamming loss and exact-match see the same predictions? Then: what do the WARNING shapes look like?",
    charts: [
      {
        type: "bars",
        title: "Per-label precision = TP/(TP+FP) and recall = TP/(TP+FN) — read off each label's TP/FP/FN",
        xlabel: "label (with true-support count)",
        ylabel: "score",
        labels: ["A (supp 7)", "B (supp 5)", "C rare (supp 2)"],
        series: [
          { name: "precision", color: "#4ea1ff", points: [[0, 0.875], [1, 1.0], [2, 0.0]] },
          { name: "recall", color: "#7ee787", points: [[0, 1.0], [1, 0.8], [2, 0.0]] }
        ],
        interpret: "Each label gets its OWN precision (blue, of what we called this label, how much was right) and recall (green, of all true cases, how much we caught). Read the pair per label: A and B are near the top on both bars, so the model handles the two common labels well. The rare label C has both bars flat at 0 — the model never predicts it, so it has no true positives at all. The takeaway: per-label bars expose exactly WHICH label is failing, which a single averaged number would hide."
      },
      {
        type: "bars",
        title: "Per-label F1 — rare label C scores 0; this is the gap each average treats differently",
        xlabel: "label (with true-support count)",
        ylabel: "F1 score",
        labels: ["A (supp 7)", "B (supp 5)", "C rare (supp 2)"],
        values: [0.933, 0.889, 0.0],
        valueLabels: ["0.933", "0.889", "0.000"],
        colors: ["#4ea1ff", "#4ea1ff", "#ff7b72"],
        interpret: "Each bar is one label's F1 (the single number that blends its precision and recall). Tall blue bars (A 0.933, B 0.889) mean those labels are well predicted; the red bar at 0 is the rare label C, totally missed. The height GAP between the blue bars and the red one is the disagreement that the next chart's averages each handle differently — so always look at this per-label row before trusting any one summary score."
      },
      {
        type: "bars",
        title: "Macro vs micro vs weighted F1 on the SAME data — why they disagree under imbalance",
        xlabel: "averaging scheme",
        ylabel: "F1 score",
        labels: ["macro", "weighted", "micro"],
        values: [0.607, 0.784, 0.846],
        valueLabels: ["0.607", "0.784", "0.846"],
        colors: ["#ff7b72", "#ffb454", "#7ee787"],
        interpret: "Three ways to boil the per-label F1s into ONE number, from the same predictions. Macro (red, 0.607) gives every label an equal vote, so the failed rare label C drags it down — the honest, harshest read. Micro (green, 0.846) pools all the per-example right/wrong counts, so the two big labels dominate and C nearly vanishes — the rosiest read. Weighted (orange, 0.784) sits between. The lesson: when you see micro far above macro, suspect a rare class is being hidden — go back and read the per-label row."
      },
      {
        type: "bars",
        title: "Hamming loss (gentle) vs exact-match accuracy (strict) — same predictions, very different verdict",
        xlabel: "multilabel metric",
        ylabel: "value",
        labels: ["Hamming loss = 4/24", "exact-match acc = 4/8"],
        values: [0.167, 0.5],
        valueLabels: ["0.167", "0.500"],
        colors: ["#7ee787", "#c89bff"],
        interpret: "Two multilabel metrics on the very same predictions. Hamming loss (green, 0.167, lower is better) counts wrong label-slots out of all 24 slots, so a few flipped labels look mild. Exact-match accuracy (purple, 0.5, higher is better) demands a row be PERFECT to count, so the same flips knock half the rows out. The two bars measure error on completely different scales — never compare their heights directly; read each against its own 'good' direction, and always report both so a gentle Hamming number can't hide rows that are actually wrong."
      },
      {
        type: "bars",
        title: "WHAT YOU MIGHT ALSO SEE — majority-label collapse: model predicts only the common labels (illustrative)",
        xlabel: "label (with true-support count)",
        ylabel: "F1 score",
        labels: ["A (supp 60)", "B (supp 30)", "C (supp 6)", "D rare (supp 3)"],
        values: [0.95, 0.88, 0.0, 0.0],
        valueLabels: ["0.95", "0.88", "0.000", "0.000"],
        colors: ["#4ea1ff", "#4ea1ff", "#ff7b72", "#ff7b72"],
        interpret: "Illustrative failure mode you will meet on heavily imbalanced label sets: the model only ever fires the two common labels and gives up on every rare one, so the red bars collapse to 0 while the blue bars stay tall. Micro-F1 here would still look great (the big labels carry it) but macro-F1 would be cut roughly in half. Recognise it by a per-label chart that splits into 'tall common, zero rare' — the cure is class weighting, resampling, or per-label thresholds, not a different average."
      },
      {
        type: "bars",
        title: "WHAT YOU MIGHT ALSO SEE — over-tagging: high recall, low precision (illustrative)",
        xlabel: "label",
        ylabel: "score",
        labels: ["A", "B", "C", "D"],
        series: [
          { name: "precision", color: "#4ea1ff", points: [[0, 0.45], [1, 0.40], [2, 0.50], [3, 0.42]] },
          { name: "recall", color: "#7ee787", points: [[0, 0.95], [1, 0.92], [2, 0.97], [3, 0.90]] }
        ],
        interpret: "Illustrative: a model with its threshold set too low predicts almost every label on every example. Recall (green) is sky-high — it catches nearly all true labels — but precision (blue) is poor everywhere because most of what it tags is wrong. The signature is green bars far ABOVE blue bars on every label. Hamming loss looks bad (many extra wrong slots) even though recall flatters the model. Fix by RAISING the per-label decision thresholds; the mirror image (blue far above green) means the threshold is too high and the model is under-tagging."
      },
      {
        type: "line",
        title: "WHAT YOU MIGHT ALSO SEE — ranking failure: a true label buried low in the score order (illustrative)",
        xlabel: "rank position (1 = top score)",
        ylabel: "is this label actually true? (1 = yes)",
        series: [
          { name: "healthy: true labels ranked at top", color: "#7ee787", points: [[1, 1], [2, 1], [3, 0], [4, 0], [5, 0]] },
          { name: "failure: a true label buried at rank 4", color: "#ff7b72", points: [[1, 1], [2, 0], [3, 0], [4, 1], [5, 0]] }
        ],
        interpret: "Illustrative view of the ranking metrics (LRAP, coverage error, label ranking loss), which judge the ORDER of label scores, not hard yes/no calls. X is rank by model score (1 = highest); a point at y=1 marks a label that is actually true. In the green healthy case both true labels sit at ranks 1-2, so you collect them all by scanning 2 deep: high LRAP, low coverage error. In the red failure case a true label is buried at rank 4 below two wrong ones, so coverage error and ranking loss both rise. Read it as: the further right a y=1 point sits, the worse the ranking — a true label is hiding under false ones."
      }
    ],
    caption: "Concrete example (first four charts): N=8 rows, 3 labels A/B/C with supports 7/5/2. The model nails common label A (precision 0.875, recall 1.0 -> F1 0.933) and B (F1 0.889) but never predicts the rare label C (F1 0.000). That single failure splits the averages: macro-F1 = 0.607 gives C a full 1/3 vote and crashes; micro-F1 = 0.846 pools all TP/FP/FN (11/1/3) so the easy labels dominate and C nearly vanishes; weighted-F1 = 0.784 weights by support and lands between. Hamming loss = 4/24 = 0.167 looks mild while exact-match = 4/8 = 0.500 punishes any imperfect row. The last three charts are shapes you might ALSO meet: majority-label collapse, over-tagging (recall >> precision), and a ranking failure where a true label is buried low. Main numbers computed with scikit-learn 1.6.1; variant charts are illustrative.",
    code: `import numpy as np
from sklearn.metrics import (hamming_loss, accuracy_score, f1_score,
    precision_score, recall_score)

# N=8 rows, 3 labels A/B/C; imbalanced supports 7/5/2.
Y_true = np.array([[1,1,0],[1,0,0],[1,1,1],[1,0,0],
                   [1,1,0],[1,0,1],[1,1,0],[0,1,0]])
Y_pred = np.array([[1,1,0],[1,0,0],[1,1,0],[1,0,0],
                   [1,0,0],[1,0,0],[1,1,0],[1,1,0]])

z = dict(zero_division=0)
print("support       :", Y_true.sum(axis=0))         # [7 5 2]
print("precision/lab :", np.round(precision_score(Y_true, Y_pred, average=None, **z), 3))
print("recall/lab    :", np.round(recall_score(Y_true, Y_pred, average=None, **z), 3))
print("F1/label      :", np.round(f1_score(Y_true, Y_pred, average=None, **z), 3))

print("F1 macro      :", round(f1_score(Y_true, Y_pred, average="macro", **z), 3))
print("F1 weighted   :", round(f1_score(Y_true, Y_pred, average="weighted", **z), 3))
print("F1 micro      :", round(f1_score(Y_true, Y_pred, average="micro", **z), 3))

print("Hamming loss  :", round(hamming_loss(Y_true, Y_pred), 3))   # 4/24
print("exact-match   :", round(accuracy_score(Y_true, Y_pred), 3)) # 4/8`
  };
})();
