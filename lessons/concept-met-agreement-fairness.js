/* =====================================================================
   METRICS & EVALUATION — BEGINNER lesson.
   "Agreement between raters & fairness across groups."
   Two related families: inter-rater agreement (kappa, alpha, ICC,
   Bland-Altman, CCC) and fairness across groups (parity, equal
   opportunity, equalized odds, predictive parity, calibration,
   disparate-impact / 80% rule, Theil index).
   Self-contained: registers the lesson, its CODE, and its CODEVIZ.
   ===================================================================== */
(function () {
  window.LESSONS.push({
    id: "met-agreement-fairness",
    title: "Agreement between raters & fairness across groups",
    tagline: "Two questions, one idea — do two judges agree more than chance, and does the model treat each group the same?",
    module: "Metrics & Evaluation — measuring models, data & statistics",
    prereqs: ["ml-classification-metrics", "skill-error-segments"],

    whenToUse:
      `<p>This lesson covers <b>two families of metrics that look different but share one trick</b>: measure a gap, then judge whether the gap is bigger than it should be.</p>
       <p><b>Family 1 — inter-rater agreement.</b> Reach for these when two or more <i>raters</i> (people or instruments) label or measure the same items and you want to know if they agree. A <i>rater</i> is just whoever assigns the score — a doctor reading an X-ray, a crowd worker tagging text, a second thermometer.</p>
       <ul>
         <li><b>Cohen's kappa</b> — two raters, categories. The everyday choice for "do my two annotators agree on the labels?"</li>
         <li><b>Weighted kappa</b> — two raters, <i>ordered</i> categories (mild / moderate / severe), where being off by one is less bad than being off by three.</li>
         <li><b>Fleiss' kappa</b> — three or more raters on categories.</li>
         <li><b>Scott's pi</b> — like Cohen's kappa but assumes both raters share one common rate of each category; close cousin.</li>
         <li><b>Krippendorff's alpha</b> — the most general: any number of raters, any data type (nominal, ordinal, numeric), and it tolerates missing ratings. The safe default for messy annotation projects.</li>
         <li><b>Intraclass Correlation Coefficient (ICC)</b> — agreement on <i>numeric</i> ratings (a 1–10 quality score), accounting for which raters are used.</li>
         <li><b>Bland–Altman limits of agreement</b> — for two numeric measurement methods: plots the difference between them against their average to show the typical gap.</li>
         <li><b>Concordance Correlation Coefficient (CCC)</b> — numeric agreement that rewards landing on the perfect <code>y = x</code> line, not just being correlated.</li>
       </ul>
       <p><b>Family 2 — fairness across groups.</b> Reach for these when a model's predictions might land harder on one group than another. A <i>group</i> (also called a <i>protected group</i>) is a slice of people — by sex, age band, region, device. Pick the fairness metric that matches the <i>harm</i>:</p>
       <ul>
         <li><b>Demographic / statistical parity</b> — do groups get picked ("yes") at the same rate? Use it when the concern is <i>representation</i> (who gets shown the loan ad at all).</li>
         <li><b>Equal opportunity</b> — equal <i>true-positive rate</i> (TPR) across groups. Use it when a <i>miss</i> is the harm (a sick patient not flagged, a qualified applicant rejected).</li>
         <li><b>Equalized odds</b> — equal TPR <i>and</i> equal false-positive rate (FPR). Stricter: fair both to those who deserve "yes" and to those who deserve "no".</li>
         <li><b>Predictive parity</b> — equal <i>precision</i> across groups: when the model says "yes", it is right equally often for each group.</li>
         <li><b>Calibration within groups</b> — when the model says "70% risk", it is truly 70% for each group.</li>
         <li><b>Disparate-impact ratio / the 80% rule</b> — the legal test: the lower group's selection rate divided by the higher group's should be at least 0.8.</li>
         <li><b>Theil index</b> — one number for how unequally a benefit is spread across <i>all</i> individuals, borrowed from economics.</li>
       </ul>
       <p><b>Avoid</b> chasing every fairness metric at once: several of them are mathematically <i>impossible</i> to satisfy together (more on that in the pitfalls). Pick the one that matches your harm.</p>`,

    application:
      `<p><b>Agreement</b> metrics gate data quality. Before a labeled dataset is trusted, teams check that annotators agree — a Cohen's kappa below about 0.4 means the labels are too noisy to train on, so the labeling guidelines get rewritten. Medical and lab teams use ICC and Bland–Altman to certify that a new device or a new doctor measures the same as the gold standard.</p>
       <p><b>Fairness</b> metrics gate model launches. Lending, hiring, healthcare, ads, and content-moderation teams report a fairness dashboard — selection rate, TPR gap, and the disparate-impact ratio per group — before a model ships, because a model that is accurate on average can still quietly fail one group. The 80% rule in particular is a long-standing legal benchmark in US hiring.</p>`,

    pitfalls:
      `<ul>
         <li><b>Raw % agreement that ignores chance.</b> Tell: you report "the raters agreed 90% of the time" and stop there. If one label is rare, two raters who guess could agree 85% by luck. The fix is a <i>chance-corrected</i> score — kappa, alpha, ICC — built so random agreement scores about 0 and perfect agreement scores 1.</li>
         <li><b>Kappa's prevalence paradox.</b> Tell: agreement on the raw counts is high, yet kappa is near 0 (or even negative). When almost every item is the same category, the "expected by chance" agreement is already huge, so kappa subtracts almost everything away. The fix is to report raw agreement <i>alongside</i> kappa and the category balance, and to prefer weighted kappa or alpha for skewed, ordered scales.</li>
         <li><b>Trying to satisfy every fairness criterion at once.</b> Tell: a reviewer demands demographic parity <i>and</i> equalized odds <i>and</i> predictive parity all hold. Unless the base rates are identical or the model is perfect, that is provably impossible — the famous <i>impossibility result</i>. The fix is to choose the single definition matching the real harm and document the trade-off.</li>
         <li><b>Tiny groups giving noisy gaps.</b> Tell: a group has 12 people, its TPR is 0.50, and you raise an alarm. With so few cases one flipped prediction swings the rate wildly. The fix is to attach a confidence interval (or bootstrap) to every gap and not act on small-sample noise.</li>
         <li><b>Auditing fairness on a proxy group label.</b> Tell: you do not have true membership, so you guess the group from name or ZIP code. The proxy is wrong for many people, so the "fairness" number is measuring your guesser, not the model. The fix is to use real, consented group labels — or state loudly that the audit rests on a proxy.</li>
       </ul>`,

    bigIdea:
      `<p>Both families ask the same shaped question: <b>here is a gap; is it bigger than it ought to be?</b></p>
       <p><b>Agreement</b> compares two <i>raters</i> on the same items. The naive score is plain agreement — the fraction of items they labeled the same. But some agreement happens by pure luck, so we subtract off the luck. That gives a <b>chance-corrected</b> score: 1 = perfect agreement, 0 = no better than coin-flips, negative = worse than chance.</p>
       <p><b>Fairness</b> compares the model's behavior across <i>groups</i>. We pick a rate — how often it says "yes", or how often it catches the real positives — and measure it inside each group. If the rates match, the model is fair on that definition; the size of the gap is the unfairness.</p>
       <p>The deep catch on the fairness side: there are several reasonable definitions of "fair", and a clean theorem says you generally <b>cannot satisfy all of them at once</b>. Fairness is a choice about which kind of error you most want to equalize, not a box you simply tick.</p>`,

    buildup:
      `<p><b>Why chance correction matters.</b> Suppose two raters each label items "yes" 90% of the time at random. They will still agree on about $0.9 \\times 0.9 + 0.1 \\times 0.1 = 0.82$ of items — 82% — with zero skill. Reporting "82% agreement!" is meaningless. Kappa fixes this by comparing the <i>observed</i> agreement to that <i>expected-by-chance</i> agreement.</p>
       <p><b>The agreement ladder, from simplest to most general:</b></p>
       <ul>
         <li>Two raters, plain categories ⇒ <b>Cohen's kappa</b>.</li>
         <li>Two raters, <i>ordered</i> categories ⇒ <b>weighted kappa</b> (penalize big disagreements more than small ones).</li>
         <li>Many raters, categories ⇒ <b>Fleiss' kappa</b>; or the most flexible, any data type with gaps ⇒ <b>Krippendorff's alpha</b>.</li>
         <li>Numeric ratings ⇒ <b>ICC</b> (Intraclass Correlation Coefficient) or <b>CCC</b> (Concordance Correlation Coefficient); for two measurement devices, also draw a <b>Bland–Altman</b> plot of difference-vs-average.</li>
       </ul>
       <p><b>The fairness rates.</b> Reuse the confusion-matrix counts (TP, FP, FN, TN) from the metrics foundation, but compute them <i>inside each group</i>:</p>
       <ul>
         <li><b>Selection rate</b> $= \\frac{\\text{predicted yes}}{\\text{group size}}$ — drives demographic parity.</li>
         <li><b>TPR</b> (True-Positive Rate, = recall) $= \\frac{TP}{TP+FN}$ — drives equal opportunity.</li>
         <li><b>FPR</b> (False-Positive Rate) $= \\frac{FP}{FP+TN}$ — added by equalized odds.</li>
         <li><b>Precision</b> $= \\frac{TP}{TP+FP}$ — drives predictive parity.</li>
       </ul>
       <p>A fairness metric is then just the largest gap (or smallest ratio) of one of these rates across the groups.</p>`,

    symbols: [
      { sym: "$p_o$", desc: "observed agreement — the fraction of items two raters labeled the same." },
      { sym: "$p_e$", desc: "expected agreement by chance — how often they would match if each rated at random with their own rates." },
      { sym: "$\\kappa$", desc: "Cohen's kappa — chance-corrected agreement. 1 = perfect, 0 = chance, negative = worse than chance." },
      { sym: "$\\alpha$", desc: "Krippendorff's alpha — general agreement: $1 - D_o/D_e$, observed disagreement over expected disagreement." },
      { sym: "$D_o,\\,D_e$", desc: "observed and expected disagreement (the alpha analog of agreement)." },
      { sym: "$\\rho_c$", desc: "Concordance Correlation Coefficient (CCC) — numeric agreement that rewards sitting on the y = x line." },
      { sym: "$\\text{SR}_g$", desc: "selection rate in group $g$ — fraction of that group predicted 'yes'." },
      { sym: "$\\text{TPR}_g$", desc: "true-positive rate (recall) in group $g$ — of the real positives in $g$, the fraction caught." },
      { sym: "$g, g'$", desc: "two groups being compared (e.g. two age bands, two regions)." }
    ],

    formula: `$$ \\kappa = \\frac{p_o - p_e}{1 - p_e}, \\qquad \\alpha = 1 - \\frac{D_o}{D_e}, \\qquad \\Delta_{\\text{DP}} = \\bigl|\\,\\text{SR}_g - \\text{SR}_{g'}\\,\\bigr|, \\qquad \\Delta_{\\text{EO}} = \\bigl|\\,\\text{TPR}_g - \\text{TPR}_{g'}\\,\\bigr| $$`,

    whatItDoes:
      `<p><b>Kappa</b> ($\\kappa$) takes the observed agreement $p_o$, subtracts the agreement you would get by chance $p_e$, and rescales so the most you could beat chance by ($1 - p_e$) maps to 1. Beat chance fully and $\\kappa = 1$; only match chance and $\\kappa = 0$.</p>
       <p><b>Krippendorff's alpha</b> ($\\alpha$) does the same idea with <i>disagreement</i> instead of agreement: it is 1 minus the ratio of observed disagreement $D_o$ to the disagreement you would expect by chance $D_e$. Because $D_o$ can be measured for numbers, ranks, or categories, alpha works for any data type and even with missing ratings.</p>
       <p><b>Demographic-parity difference</b> $\\Delta_{\\text{DP}}$ is the gap in selection rate between two groups — 0 means each group is picked equally often. <b>Equal-opportunity difference</b> $\\Delta_{\\text{EO}}$ is the gap in true-positive rate — 0 means the model catches the real positives equally well in each group. The <b>disparate-impact ratio</b> uses the same selection rates as a ratio, $\\text{SR}_{\\text{low}} / \\text{SR}_{\\text{high}}$, and the 80% rule asks that this be at least 0.8.</p>`,

    derivation:
      `<p><b>Why kappa is the right correction.</b></p>
       <ul class="steps">
         <li>Two raters label $N$ items. Count the fraction they agree on: that is $p_o$, the observed agreement.</li>
         <li>Now ask: if each rater kept their own habit (say rater A says "yes" 30% of the time, rater B 40%) but otherwise labeled at random, how often would they agree by luck? They both say "yes" with probability $0.3 \\times 0.4$ and both say "no" with $0.7 \\times 0.6$; add them: $p_e = 0.12 + 0.42 = 0.54$.</li>
         <li>Real skill is the agreement <i>above</i> chance, $p_o - p_e$. The most skill possible is $1 - p_e$ (you cannot beat chance by more than the room that is left). Dividing gives $\\kappa = \\frac{p_o - p_e}{1 - p_e}$ — a clean 0-to-1 scale where 0 = chance and 1 = perfect.</li>
         <li><b>Weighted kappa</b> replaces "agree / disagree" with a penalty that grows with how far apart the two labels are on an ordered scale, so "mild vs moderate" hurts less than "mild vs severe". <b>Alpha</b> and <b>ICC</b> generalize the same subtract-the-chance idea to many raters and numeric scores.</li>
       </ul>
       <p><b>Why you cannot have all fairness at once.</b> Suppose two groups truly contain positives at different base rates (say 8% vs 30% genuinely sick). A short algebra argument (the <i>impossibility theorem</i> of Kleinberg, Chouldechova, and others) shows that, except when the model is perfect, you cannot simultaneously have equal precision (predictive parity), equal TPR and FPR (equalized odds), and calibration in every group. Equalizing one gap necessarily opens another. So fairness work begins by choosing the gap that matches the harm. $\\blacksquare$</p>`,

    example:
      `<p><b>Agreement.</b> Two doctors each read 100 X-rays as "tumor" or "clear". They agree on 85 of them, so $p_o = 0.85$. Doctor A called "tumor" 30% of the time, Doctor B 40%. Chance agreement: $p_e = (0.30)(0.40) + (0.70)(0.60) = 0.12 + 0.42 = 0.54$. Then</p>
       <p>$\\kappa = \\dfrac{p_o - p_e}{1 - p_e} = \\dfrac{0.85 - 0.54}{1 - 0.54} = \\dfrac{0.31}{0.46} \\approx 0.67.$</p>
       <p>Raw agreement looked like 85%, but chance already bought 54%, so the <i>real</i> agreement is a moderate-to-good 0.67 — not 0.85.</p>
       <p><b>Fairness.</b> A loan model is checked on two regions. In region A it approves 60 of 100 applicants (selection rate 0.60); in region B it approves 30 of 100 (0.30). The demographic-parity difference is $|0.60 - 0.30| = 0.30$. The disparate-impact ratio is $0.30 / 0.60 = 0.50$, which is below 0.8 — it <b>fails the 80% rule</b>, flagging that region B is approved far less often.</p>`,

    demo: function (host) {
      function C() {
        var s = getComputedStyle(document.documentElement);
        var g = function (n, d) { return (s.getPropertyValue(n) || d).trim(); };
        return { ink: g("--ink", "#e6edf3"), dim: g("--ink-dim", "#9aa7b4"), accent: g("--accent", "#4ea1ff"), accent2: g("--accent-2", "#7ee787"), warn: g("--warn", "#ffb454"), border: g("--border", "#2a3340") };
      }
      // Cohen's kappa demo: two raters each label "yes" at their own rate;
      // user drags observed agreement; we show kappa vs raw agreement.
      var po = 0.85, pa = 0.30, pb = 0.40;
      var cv = document.createElement("canvas"); cv.width = 640; cv.height = 150; cv.style.maxWidth = "100%"; host.appendChild(cv);
      var ctx = cv.getContext("2d");
      var readout = document.createElement("div"); readout.className = "out"; readout.style.marginTop = "6px"; host.appendChild(readout);

      function pe() { return pa * pb + (1 - pa) * (1 - pb); }
      function kappa() { var e = pe(); return e >= 1 ? 0 : (po - e) / (1 - e); }
      function draw() {
        var col = C(); ctx.clearRect(0, 0, 640, 150);
        var W = 640, padL = 14, padR = 14, y = 60, h = 26;
        function PX(v) { return padL + v * (W - padL - padR); }
        // chance bar (background) and observed bar (foreground)
        var e = pe();
        ctx.fillStyle = col.border; ctx.fillRect(PX(0), y, PX(1) - PX(0), h);
        ctx.fillStyle = col.warn + "66"; ctx.fillRect(PX(0), y, PX(e) - PX(0), h);
        ctx.fillStyle = col.accent; ctx.fillRect(PX(0), y, PX(po) - PX(0), h);
        // chance marker
        ctx.strokeStyle = col.warn; ctx.lineWidth = 2.5; ctx.beginPath(); ctx.moveTo(PX(e), y - 8); ctx.lineTo(PX(e), y + h + 8); ctx.stroke();
        ctx.fillStyle = col.ink; ctx.font = "12px sans-serif"; ctx.textAlign = "left";
        ctx.fillText("observed agreement p_o (drag)", PX(0), y - 14);
        ctx.textAlign = "center"; ctx.fillStyle = col.warn;
        ctx.fillText("chance p_e", PX(e), y + h + 22);
      }
      function render() {
        draw();
        readout.innerHTML = "Observed agreement p_o = <b>" + po.toFixed(2) + "</b>, chance agreement p_e = <b>" + pe().toFixed(2) + "</b> &rarr; Cohen's kappa = <b>" + kappa().toFixed(3) + "</b>. The blue bar is what the raters actually agreed on; the orange line is what pure luck already buys. Kappa only counts the blue beyond the orange &mdash; drag p_o down toward chance and kappa collapses to 0 even while raw agreement still looks high.";
      }
      function setFromX(clientX) {
        var r = cv.getBoundingClientRect(), scale = cv.width / r.width;
        var x = (clientX - r.left) * scale, v = (x - 14) / (640 - 28);
        po = Math.max(pe(), Math.min(1, v)); render();
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
        q: `Two annotators label 100 comments as "toxic" or "fine" and agree on 92 of them. You report "92% agreement." Your lead asks for Cohen's kappa instead. Toxic is rare: annotator A calls "toxic" 8% of the time, B 10%. Roughly what is kappa, and why is it so different from 92%?`,
        steps: [
          { do: `Write the observed agreement.`, why: `They matched on 92 of 100, so p_o = 0.92.` },
          { do: `Compute chance agreement p_e.`, why: `Both say "toxic" with prob 0.08 x 0.10 = 0.008, both say "fine" with 0.92 x 0.90 = 0.828; p_e = 0.836.` },
          { do: `Plug into kappa.`, why: `kappa = (0.92 - 0.836)/(1 - 0.836) = 0.084/0.164 ≈ 0.51.` }
        ],
        answer: `<p>$p_o = 0.92$, but because "toxic" is rare, chance agreement is already $p_e = (0.08)(0.10) + (0.92)(0.90) = 0.836$. So $\\kappa = \\frac{0.92 - 0.836}{1 - 0.836} \\approx 0.51$ — only "moderate" agreement, not the 92% the raw number suggested. This is the <b>prevalence effect</b>: when one category dominates, most agreement is luck, and kappa strips that away. Report kappa <i>with</i> the raw agreement and the rare-class rate so the picture is honest.</p>`
      },
      {
        q: `A hiring model approves 48% of group A and 36% of group B. (a) What is the demographic-parity difference? (b) What is the disparate-impact ratio, and does it pass the 80% rule? (c) The model also misses qualified people more often in group B. Which fairness metric should you report for that harm, and why?`,
        steps: [
          { do: `Take the selection-rate gap.`, why: `Demographic-parity difference = |0.48 - 0.36| = 0.12.` },
          { do: `Take the ratio of the lower to higher rate.`, why: `Disparate impact = 0.36 / 0.48 = 0.75, which is below the 0.8 threshold.` },
          { do: `Match the metric to the "miss" harm.`, why: `Missing qualified people is a false negative; equal opportunity equalizes the true-positive rate (recall) across groups.` }
        ],
        answer: `<p>(a) Demographic-parity difference $= |0.48 - 0.36| = 0.12$. (b) Disparate-impact ratio $= 0.36/0.48 = 0.75$, which is <b>below 0.8 — it fails the 80% rule</b>, flagging that group B is selected materially less often. (c) Since the harm is <i>missing qualified people</i> (false negatives), report <b>equal opportunity</b> — the gap in true-positive rate (recall) between the groups — because that metric directly measures whether the model catches the deserving "yes" cases equally in each group.</p>`
      },
      {
        q: `A reviewer insists your risk model must simultaneously satisfy demographic parity, equalized odds, AND predictive parity across two groups whose true base rates differ (12% positive vs 30% positive). Is this achievable, and what should you tell them?`,
        steps: [
          { do: `Note the base rates differ.`, why: `The two groups genuinely contain positives at different rates, which is the trigger condition for the impossibility result.` },
          { do: `Recall the impossibility theorem.`, why: `With unequal base rates and an imperfect model, equalizing precision and equalizing TPR/FPR cannot both hold — fixing one gap opens another.` },
          { do: `Convert it to a choice.`, why: `Fairness becomes a decision about which harm to equalize, not a checklist you satisfy in full.` }
        ],
        answer: `<p>No — it is provably impossible. When the groups have different true base rates (12% vs 30%) and the model is not perfect, the <b>impossibility theorem</b> says predictive parity (equal precision) and equalized odds (equal TPR and FPR) cannot both hold; calibration adds a third conflicting demand. Tell the reviewer that fairness here is a <b>trade-off, not a checkbox</b>: pick the single definition matching the real-world harm (equal opportunity if misses hurt most, predictive parity if false "yes" calls hurt most), report the others as context, and document the choice.</p>`
      }
    ]
  });

  window.CODE["met-agreement-fairness"] = {
    lib: "scikit-learn",
    runnable: false,
    explain: `<p>Two short toolkits. <b>Agreement:</b> <code>sklearn.metrics.cohen_kappa_score</code> for two raters (pass <code>weights="quadratic"</code> for ordered scales); <code>fairlearn</code>'s <code>MetricFrame</code> and the gap helpers for fairness. ICC lives in <code>pingouin</code>/<code>statsmodels</code>, and Krippendorff's alpha is a short from-scratch computation when you have missing ratings.</p>`,
    code: `import numpy as np
from sklearn.datasets import load_breast_cancer
from sklearn.model_selection import train_test_split
from sklearn.linear_model import LogisticRegression
from sklearn.preprocessing import StandardScaler
from sklearn.pipeline import make_pipeline
from sklearn.metrics import cohen_kappa_score

# ---------- FAMILY 1: inter-rater agreement ----------
# two raters labeling the same 8 items (1 = tumor, 0 = clear)
rater_a = [1, 1, 0, 0, 1, 0, 1, 0]
rater_b = [1, 0, 0, 0, 1, 0, 1, 1]
print("Cohen's kappa        :", round(cohen_kappa_score(rater_a, rater_b), 3))
# weighted kappa for ORDERED categories (0 < 1 < 2): off-by-one hurts less
sev_a = [0, 1, 2, 2, 1, 0, 1, 2]
sev_b = [0, 2, 2, 1, 1, 0, 0, 2]
print("Quadratic-weighted k :",
      round(cohen_kappa_score(sev_a, sev_b, weights="quadratic"), 3))

# ICC (Intraclass Correlation Coefficient) for NUMERIC ratings:
#   import pingouin as pg
#   pg.intraclass_corr(data=long_df, targets="item", raters="judge", ratings="score")
# Krippendorff's alpha (any data type, tolerates missing) -- from scratch sketch:
#   alpha = 1 - Do / De   with Do = observed disagreement, De = expected disagreement.

# ---------- FAMILY 2: fairness across groups ----------
from fairlearn.metrics import (MetricFrame, selection_rate,
    demographic_parity_difference, equalized_odds_difference)
from sklearn.metrics import recall_score, precision_score

data = load_breast_cancer()
X = data.data
y = (data.target == 0).astype(int)            # 1 = malignant (positive)
mean_radius = X[:, 0]                          # the feature we bin into groups

Xtr, Xte, ytr, yte, rtr, rte = train_test_split(
    X, y, mean_radius, test_size=0.4, random_state=0, stratify=y)
clf = make_pipeline(StandardScaler(),
                    LogisticRegression(max_iter=5000)).fit(Xtr, ytr)
y_pred = clf.predict(Xte)

# protected GROUP = mean-radius tertiles (small / medium / large tumors)
q1, q2 = np.quantile(rte, [1/3, 2/3])
group = np.where(rte <= q1, "small",
        np.where(rte <= q2, "medium", "large"))

# per-group rates in one table
mf = MetricFrame(
    metrics={"selection_rate": selection_rate,
             "TPR (recall)":  recall_score,
             "precision":     precision_score},
    y_true=yte, y_pred=y_pred, sensitive_features=group)
print(mf.by_group)                            # selection / TPR / precision per group
print("demographic parity diff:",
      round(demographic_parity_difference(yte, y_pred, sensitive_features=group), 3))
print("equalized odds diff    :",
      round(equalized_odds_difference(yte, y_pred, sensitive_features=group), 3))`
  };

  window.CODEVIZ["met-agreement-fairness"] = {
    question: "Two questions, one shape. (1) Two raters agree on most items — but how much is luck? (2) A model treats two groups differently — is the gap fair? Below: the healthy/ideal diagrams PLUS the failure-mode variants you will actually meet.",
    charts: [
      {
        type: "bars",
        title: "IDEAL — Cohen's kappa = (p_o - p_e)/(1 - p_e): chance already buys most of the 85% agreement",
        xlabel: "term",
        ylabel: "agreement (fraction of items)",
        labels: ["observed p_o", "chance p_e", "skill above chance (p_o - p_e)", "room above chance (1 - p_e)", "kappa = ratio"],
        values: [0.85, 0.54, 0.31, 0.46, 0.674],
        valueLabels: ["0.85", "0.54", "0.31", "0.46", "0.674"],
        colors: ["#4ea1ff", "#ffb454", "#7ee787", "#9aa7b4", "#c89bff"],
        interpret: "Each bar is one term of the kappa formula. Blue is what the raters actually agreed on (0.85); orange is what pure luck already buys when A calls 'tumor' 30% and B 40% (0.54). Kappa keeps only the green slice of skill ABOVE chance (0.31) as a fraction of the grey room that was left to win (0.46), giving the purple 0.674. <b>Read it as:</b> a healthy moderate-to-good result — the raw 85% overstated the real agreement, but plenty of genuine skill remains."
      },
      {
        type: "bars",
        title: "WHAT YOU MIGHT ALSO SEE — Prevalence paradox: 92% raw agreement but kappa only 0.51",
        xlabel: "term",
        ylabel: "agreement (fraction of items)",
        labels: ["observed p_o", "chance p_e", "skill above chance", "room above chance", "kappa = ratio"],
        values: [0.92, 0.836, 0.084, 0.164, 0.512],
        valueLabels: ["0.92", "0.836", "0.084", "0.164", "0.512"],
        colors: ["#4ea1ff", "#ff7b72", "#7ee787", "#9aa7b4", "#c89bff"],
        interpret: "Same chart, rare class ('toxic' at ~9%). The orange chance bar swells to 0.836 because when one label dominates, two random raters agree almost all the time. That leaves only a sliver of room (0.164) and a tiny skill slice (0.084), so kappa drops to 0.51 even though raw agreement LOOKS better (0.92) than the ideal case. <b>Recognise it by:</b> a huge orange bar nearly touching the blue one — high raw %, low kappa. Always report kappa next to the raw % and class balance."
      },
      {
        type: "bars",
        title: "WHAT YOU MIGHT ALSO SEE — Worse than chance: raters disagree systematically, kappa goes NEGATIVE",
        xlabel: "term",
        ylabel: "agreement (fraction of items)",
        labels: ["observed p_o", "chance p_e", "skill above chance (p_o - p_e)", "room above chance (1 - p_e)", "kappa = ratio"],
        values: [0.40, 0.54, -0.14, 0.46, -0.304],
        valueLabels: ["0.40", "0.54", "-0.14", "0.46", "-0.304"],
        colors: ["#4ea1ff", "#ffb454", "#ff7b72", "#9aa7b4", "#ff7b72"],
        interpret: "Illustrative. Here observed agreement (0.40) sits BELOW chance (0.54), so the skill slice is negative (-0.14) and kappa falls below zero to -0.30. <b>Read it as:</b> the raters agree LESS than coin-flips would — usually a sign of flipped category definitions, a coding error, or one rater systematically inverting the scale. A negative kappa is never 'just low' — go fix the labeling guideline or the data pipeline."
      },
      {
        type: "heatmap",
        title: "IDEAL — Agreement table for the two doctors (N=100): kappa reads off diagonal vs off-diagonal",
        rows: ["Doctor A: tumor", "Doctor A: clear"],
        cols: ["Doctor B: tumor", "Doctor B: clear"],
        matrix: [[28, 2], [12, 58]],
        showVals: true,
        interpret: "Rows are Doctor A's calls, columns Doctor B's. The diagonal (28 both-tumor, 58 both-clear) is where they AGREE; the off-diagonal (2 + 12) is where they disagree. The row/column totals are the marginals kappa uses: A's tumor row sums to 30, B's tumor column to 40. <b>Read it as:</b> mass concentrated on the diagonal means good agreement; the off-diagonal cells are the cases your labeling guide needs to disambiguate."
      },
      {
        type: "bars",
        title: "IDEAL — Demographic parity: selection rate per region; disparate-impact 0.30/0.60 = 0.50 FAILS the 80% rule",
        xlabel: "region",
        ylabel: "selection rate (fraction approved)",
        labels: ["region A", "region B", "0.8 x A (80%-rule floor)"],
        values: [0.60, 0.30, 0.48],
        valueLabels: ["0.60", "0.30", "0.48 floor"],
        colors: ["#4ea1ff", "#ff7b72", "#9aa7b4"],
        interpret: "Each bar is the fraction of a region approved. Region B (red, 0.30) is far below region A (blue, 0.60). The grey bar is the 80%-rule floor — 0.8 times A's rate = 0.48 — and B sits below it. <b>Read it as:</b> when the lower group's bar falls under the grey floor, the disparate-impact ratio (here 0.30/0.60 = 0.50) is under 0.8 and the model FAILS the legal screen. The size of the drop below grey is how far it fails by."
      },
      {
        type: "bars",
        title: "WHAT YOU MIGHT ALSO SEE — Parity PASSES: 0.55 vs 0.48 gives ratio 0.87, above the 0.8 floor",
        xlabel: "region",
        ylabel: "selection rate (fraction approved)",
        labels: ["region A", "region B", "0.8 x A (80%-rule floor)"],
        values: [0.55, 0.48, 0.44],
        valueLabels: ["0.55", "0.48", "0.44 floor"],
        colors: ["#4ea1ff", "#7ee787", "#9aa7b4"],
        interpret: "Illustrative healthy case. Both regions are approved at close rates (0.55 vs 0.48), and the lower group (green) sits ABOVE the grey 0.44 floor (0.8 x 0.55). The ratio 0.48/0.55 = 0.87 clears 0.8. <b>Recognise it by:</b> the lower bar landing above the grey line — the 80% rule passes. Note this only checks selection rate; pair it with the TPR/FPR view below before declaring the model fair on every harm."
      },
      {
        type: "bars",
        title: "IDEAL — Equalized odds: TPR (equal opportunity) and FPR per region; both gaps measure unfairness",
        xlabel: "region",
        labels: ["region A", "region B"],
        series: [
          { name: "TPR (catch rate, recall)", color: "#7ee787", points: [[0, 0.857], [1, 0.583]] },
          { name: "FPR (false-alarm rate)", color: "#ffb454", points: [[0, 0.353], [1, 0.141]] }
        ],
        interpret: "Two grouped bars per region: green is TPR (of those who truly repay, the fraction approved) and orange is FPR (of those who truly default, the fraction wrongly approved). Equalized odds wants BOTH colours level across regions. Here the green gap (0.857 vs 0.583 = a 0.274 equal-opportunity gap) and the orange gap (0.353 vs 0.141) are both large. <b>Read it as:</b> region B's qualified applicants are missed far more often — a real harm even though earlier parity charts only showed selection-rate skew."
      },
      {
        type: "bars",
        title: "WHAT YOU MIGHT ALSO SEE — Impossibility: forcing equal TPR opens a precision gap (different base rates)",
        xlabel: "fairness criterion (gap between the two groups)",
        ylabel: "gap (0 = perfectly equal across groups)",
        labels: ["TPR gap (after equalizing)", "FPR gap (after equalizing)", "precision gap (forced open)"],
        values: [0.00, 0.00, 0.31],
        valueLabels: ["0.00", "0.00", "0.31"],
        colors: ["#7ee787", "#7ee787", "#ff7b72"],
        interpret: "Illustrative. The two groups have different true base rates (e.g. 12% vs 30% positive). Suppose you tune the model to equalize odds — the green TPR and FPR gaps go to zero. The impossibility theorem then forces the red precision (predictive-parity) gap to open up (0.31). <b>Read it as:</b> you cannot flatten every fairness bar at once when base rates differ — pushing two gaps to zero pops a third. Fairness is choosing WHICH bar to flatten, not flattening them all."
      }
    ],
    caption: "Read each chart by its IDEAL vs WHAT-YOU-MIGHT-ALSO-SEE tag. Kappa: the ideal (0.674) shows real skill above chance; the prevalence-paradox variant (high raw %, kappa 0.51) and the negative-kappa variant (worse than chance) are the two failure modes to spot. Fairness: the ideal demographic-parity chart FAILS the 80% rule (ratio 0.50), the passing variant clears it (0.87), and the impossibility variant shows why equalizing one gap (TPR/FPR) forces another (precision) open when base rates differ. Main-chart numbers are computed from the concrete per-region confusion counts in the code; variants marked 'illustrative' are qualitatively honest shapes.",
    code: `import numpy as np

# ---------- Cohen's kappa (two doctors, 100 X-rays) ----------
p_o = 0.85                      # they agreed on 85 of 100
p_a, p_b = 0.30, 0.40           # A called 'tumor' 30%, B 40%
p_e = p_a*p_b + (1-p_a)*(1-p_b) # chance agreement = 0.54
kappa = (p_o - p_e) / (1 - p_e) # 0.31 / 0.46 = 0.674
print("p_e=%.2f  kappa=%.3f" % (p_e, kappa))

# agreement table (rows = Doctor A, cols = Doctor B): diagonal = agree
table = np.array([[28, 2],      # A tumor: B tumor 28, B clear 2  -> A tumor row = 30
                  [12, 58]])    # A clear: B tumor 12, B clear 58 -> B tumor col = 40
print("on-diagonal agreements:", table[0,0] + table[1,1])  # 86

# ---------- fairness: per-region confusion counts ----------
# region A: 100 applicants, region B: 100 applicants. positive = 'truly repays'.
# concrete counts chosen to give the lesson's selection rates (0.60 and 0.30):
A = dict(TP=42, FN=7,  FP=18, TN=33)   # approved = TP+FP = 60 -> SR_A = 0.60
B = dict(TP=21, FN=15, FP=9,  TN=55)   # approved = TP+FP = 30 -> SR_B = 0.30
def rates(c):
    sr  = (c["TP"]+c["FP"]) / sum(c.values())
    tpr = c["TP"] / (c["TP"]+c["FN"])
    fpr = c["FP"] / (c["FP"]+c["TN"])
    return sr, tpr, fpr
srA, tprA, fprA = rates(A)
srB, tprB, fprB = rates(B)
print("SR :", round(srA,3), round(srB,3))    # 0.60 0.30
print("TPR:", round(tprA,3), round(tprB,3))  # 0.857 0.583
print("FPR:", round(fprA,3), round(fprB,3))  # 0.353 0.141
print("demographic-parity diff:", round(abs(srA-srB), 3))   # 0.30
print("disparate-impact ratio :", round(srB/srA, 3))        # 0.50 (fails 80% rule)
print("equal-opportunity diff :", round(abs(tprA-tprB), 3)) # 0.274`
  };
})();
