(function () {
  window.LESSONS.push({
    id: "skill-error-segments",
    title: "Analyzing errors by segment",
    tagline: "The average hides the failure. Slice the metric and the broken group jumps out.",
    module: "Doing ML for Real — the skills that matter",
    prereqs: ["mlx-error-analysis", "ml-classification-metrics"],
    whenToUse:
      `<p><b>Reach for segmented error analysis the moment you have one headline number and a decision riding on it.</b> A single accuracy or AUC (Area Under the Curve) is an average over everyone. Averages lie by mixing a group the model nails with a group it wrecks. The mix looks fine; the broken group is invisible.</p>
       <p><b>It is make-or-break when:</b></p>
       <ul>
         <li><b>The model ships to many kinds of users.</b> Different regions, devices, languages, or customer tiers. One global score cannot tell you the model is great for 90% and useless for the other 10%.</li>
         <li><b>A subgroup carries the business or the risk.</b> Big spenders, rare-but-costly fraud, a regulated demographic. A small slice can be the whole point even when it barely moves the average.</li>
         <li><b>You are about to retrain.</b> Before a global retrain, you want to know <i>which</i> slice is failing and <i>why</i>. A targeted fix usually beats throwing more data at the whole model.</li>
       </ul>
       <p>If you only ever look at the aggregate, you are flying blind over exactly the part of the input space where the model breaks.</p>`,
    playbook:
      `<ol>
         <li><b>Never trust the aggregate metric alone — commit to slicing.</b> Treat the headline accuracy or AUC (Area Under the Curve) as a starting point, not an answer. Write down the slicing dimensions <i>before</i> you look: feature buckets, subgroups, intent, time.</li>
         <li><b>Compute the metric per segment.</b> Group rows by a feature value (or a binned numeric feature), a known subgroup, the user intent, or a time window, and recompute the same metric inside each group. A <code>pandas</code> <code>groupby</code> or <code>fairlearn</code>'s <code>MetricFrame</code> does this in one call.</li>
         <li><b>Mine the worst slice and prove it is real.</b> Sort segments by the metric and take the bottom one. Then run a <b>two-proportion z-test</b> comparing that slice to the rest. A big gap on 8 rows is noise; a modest gap on 800 rows is real. Do not act until the gap clears significance.</li>
         <li><b>Check intersectional slices.</b> The model may be fine on "new users" and fine on "mobile" yet broken on "new users on mobile". Cross the top one or two dimensions and re-measure. Single-axis slicing misses these combination failures.</li>
         <li><b>Watch for Simpson's paradox.</b> A model (or a change) can look better overall yet be worse on <i>every</i> subgroup, because the groups got reweighted. Always confirm a global win survives at the per-group level before you celebrate.</li>
         <li><b>Check calibration per group, not just accuracy.</b> A model can be equally accurate on two groups while being over-confident on one. Compare predicted probability to observed frequency <i>inside</i> each segment (a per-group reliability curve), because a miscalibrated group makes thresholds and downstream decisions wrong.</li>
         <li><b>Turn the worst slice into a targeted fix.</b> Once you have a real, significant, well-understood bad slice, fix <i>that</i>: add a feature that separates it, collect or up-weight data for it, or set a per-segment threshold. Prefer a surgical fix over a global retrain that may regress the slices that already work.</li>
       </ol>`,
    application:
      `<p>Segmented error analysis is the daily bread of applied ML, not an academic nicety.</p>
       <ul>
         <li><b>Fairness audits:</b> regulators and review boards ask for accuracy, false-positive, and false-negative rates <i>per protected group</i> — exactly a per-segment metric table.</li>
         <li><b>Ranking and recommendations:</b> slice click or conversion metrics by query intent, content type, and new-vs-returning user; a model that wins on head queries often loses on the long tail.</li>
         <li><b>Fraud and risk:</b> overall AUC (Area Under the Curve) hides that the model misses a specific fraud pattern or a specific merchant category — the slice that actually costs money.</li>
         <li><b>Medical and safety models:</b> performance by patient subgroup, scanner type, or disease severity, because a model that is 96% accurate overall can still systematically miss the largest, most dangerous tumors.</li>
         <li><b>Pre-launch model comparison:</b> before swapping model B for model A, confirm B does not regress any important slice — the classic Simpson's-paradox trap where B wins on the blended set but loses on each cohort.</li>
       </ul>`,
    pitfalls:
      `<ul>
         <li><b>Reporting only the average.</b> A single 0.96 accuracy is the most common way a serious failure ships. Tell: the only chart in the review is one bar. Fix: always show the per-segment breakdown next to the headline.</li>
         <li><b>Tiny noisy slices read as real gaps.</b> A slice with 11 rows swinging 20 points is mostly sampling noise. Tell: dramatic gaps on slices with single-digit counts and no significance test. Fix: attach a count and a confidence interval (or a z-test) to every slice; ignore gaps that don't clear it.</li>
         <li><b>Ignoring intersections.</b> Each axis looks fine alone, so you stop. Tell: you only ever sliced one feature at a time. Fix: cross the top two dimensions and re-check the combined cells.</li>
         <li><b>Simpson's paradox.</b> The global metric improved, so the change is "good". Tell: nobody checked the per-group numbers after a reweight or a population shift. Fix: require that any global win also hold (or at least not regress) on each subgroup.</li>
         <li><b>A global metric hiding a regressed group.</b> A retrain bumps overall AUC (Area Under the Curve) but quietly tanks one cohort. Tell: you compared only headline numbers between model versions. Fix: diff the per-segment table across versions, not just the aggregate.</li>
         <li><b>No per-group calibration.</b> Equal accuracy is taken as equal trustworthiness. Tell: one shared threshold applied to groups with very different score distributions. Fix: plot a reliability curve per group and recalibrate (or set per-group thresholds) where it drifts.</li>
       </ul>`,
    checklist:
      `<p>Run this on your own project before you call a model "good":</p>
       <ul>
         <li>I listed the slicing dimensions (feature buckets, subgroups, intent, time) <b>before</b> looking at results.</li>
         <li>I computed the same metric <b>per segment</b>, not just overall.</li>
         <li>Every slice has a <b>row count</b> next to its metric.</li>
         <li>I ran a <b>two-proportion z-test</b> (or a confidence interval) on the worst slice vs the rest, and the gap is significant.</li>
         <li>I checked at least one <b>intersectional</b> slice (a cross of two dimensions).</li>
         <li>I confirmed any <b>global win also holds per subgroup</b> (no Simpson's paradox).</li>
         <li>I checked <b>calibration per group</b>, not only accuracy.</li>
         <li>My fix is <b>targeted at the bad slice</b> (feature, data, threshold) and I verified it did not regress the good slices.</li>
       </ul>`,
    bigIdea:
      `<p>One number summarizes a whole test set. Summaries average away detail — including the detail that the model is broken on a specific group.</p>
       <p><b>Segmented error analysis</b> is simple: split the test set into meaningful groups (segments) and recompute the metric inside each one. The aggregate is a weighted average of those per-segment numbers, so a high average can sit on top of one terrible slice.</p>
       <p>The skill is knowing <i>how</i> to slice, how to tell a real gap from noise, and how to act on the worst slice without breaking the rest.</p>`,
    buildup:
      `<p>Say the metric is accuracy. Overall accuracy is the fraction correct across all $N$ test rows.</p>
       <p>Split the rows into segments $g=1,\\dots,G$. Segment $g$ has $n_g$ rows and its own accuracy $a_g$.</p>
       <p>The overall accuracy is just the size-weighted average $a=\\sum_g \\tfrac{n_g}{N}\\,a_g$. A small, broken segment barely moves $a$, so it hides — that is precisely why we slice.</p>
       <p>To decide whether the worst slice's gap is real, compare two rates (the slice vs the rest) with a <b>two-proportion z-test</b>.</p>`,
    symbols: [
      { sym: "$N$", desc: "the total number of test rows." },
      { sym: "$G$", desc: "the number of segments (slices) we split the data into." },
      { sym: "$n_g$", desc: "the number of rows in segment $g$." },
      { sym: "$a_g$", desc: "the metric (e.g. accuracy or recall) measured inside segment $g$." },
      { sym: "$\\hat p_1,\\hat p_2$", desc: "the two observed rates being compared — the worst slice's rate and the rest's rate (the hat means 'estimated from data')." },
      { sym: "$n_1,n_2$", desc: "the sample sizes behind $\\hat p_1$ and $\\hat p_2$ (rows in the slice, and rows in the rest)." },
      { sym: "$\\hat p$", desc: "the pooled rate: both groups' successes added up and divided by $n_1+n_2$ (used only as the noise estimate under 'no difference')." },
      { sym: "$z$", desc: "the test statistic: how many standard errors apart the two rates are. $|z|>1.96$ means the gap is significant at the 5% level." }
    ],
    formula: `$$ a=\\sum_{g=1}^{G}\\frac{n_g}{N}\\,a_g \\qquad\\qquad z=\\frac{\\hat p_1-\\hat p_2}{\\sqrt{\\,\\hat p\\,(1-\\hat p)\\left(\\tfrac{1}{n_1}+\\tfrac{1}{n_2}\\right)}},\\quad \\hat p=\\frac{n_1\\hat p_1+n_2\\hat p_2}{n_1+n_2} $$`,
    whatItDoes:
      `<p>The left formula says the aggregate metric $a$ is nothing more than a size-weighted average of the per-segment metrics $a_g$. Read backwards: a great $a$ can hide a tiny segment with an awful $a_g$.</p>
       <p>The right formula is the <b>two-proportion z-test</b>. The top, $\\hat p_1-\\hat p_2$, is the raw gap between the worst slice and the rest. The bottom is the standard error of that gap <i>if there were truly no difference</i> (so we use the pooled rate $\\hat p$). Dividing turns the gap into a unit-free number of standard errors. Large $|z|$ (above 1.96) means the gap is unlikely to be luck.</p>`,
    derivation:
      `<p><b>Why the z-test works.</b></p>
       <ul class="steps">
         <li>Each slice's rate is an average of 0/1 outcomes, so it is a binomial proportion. By the Central Limit Theorem, $\\hat p_g$ is approximately Normal with mean the true rate and variance $\\tfrac{p_g(1-p_g)}{n_g}$.</li>
         <li>The difference of two independent approximately-Normal quantities is itself approximately Normal, with variance equal to the sum: $\\operatorname{Var}(\\hat p_1-\\hat p_2)=\\tfrac{p_1(1-p_1)}{n_1}+\\tfrac{p_2(1-p_2)}{n_2}$.</li>
         <li>Under the null hypothesis "the slice and the rest have the <i>same</i> true rate", that common rate is best estimated by the <b>pooled</b> rate $\\hat p$ (all successes over all rows). Substituting $\\hat p$ for both $p_1$ and $p_2$ gives the denominator above.</li>
         <li>Standardize: subtract the null mean (zero gap) and divide by that standard error. The result $z$ is approximately standard Normal, so $|z|>1.96$ corresponds to a two-sided $p$-value below $0.05$. $\\blacksquare$</li>
       </ul>
       <p><b>Fairness, in the same language.</b> The slicing machinery names specific gaps. <b>Demographic parity</b> asks that the <i>positive-prediction rate</i> be equal across groups: $P(\\hat y{=}1\\mid g)$ the same for all $g$. <b>Equalized odds</b> is stricter — it asks the true-positive rate <i>and</i> the false-positive rate to match across groups. Both are just per-segment rates plugged into the same z-test to see whether a measured gap is real. <b>Per-slice confidence intervals</b> ($\\hat p_g \\pm 1.96\\sqrt{\\hat p_g(1-\\hat p_g)/n_g}$) are the visual version: when two slices' intervals overlap heavily, the gap is probably noise.</p>`,
    example:
      `<p>A breast-cancer classifier scores <b>0.965 accuracy overall</b> — looks done. We slice the test set into three groups by tumor <b>mean radius</b> (small / medium / large tertiles) and recompute <b>recall on the benign class</b> (fraction of true benign cases caught).</p>
       <ul class="steps">
         <li><b>small</b> tumors: recall $=1.00$ (55 of 55 benign caught).</li>
         <li><b>medium</b> tumors: recall $=0.974$ (74 of 76).</li>
         <li><b>large</b> tumors: recall $=0.75$ (9 of 12). The model misses a quarter of the benign cases here.</li>
         <li><b>Is the large-slice gap real?</b> Compare the large slice ($\\hat p_1=0.75,\\ n_1=12$) to the rest ($\\hat p_2=129/131=0.985,\\ n_2=131$). Pooled $\\hat p=138/143=0.965$. Then $z=\\dfrac{0.985-0.75}{\\sqrt{0.965\\cdot0.035\\,(\\tfrac{1}{12}+\\tfrac{1}{131})}}\\approx 4.2$.</li>
         <li>$|z|=4.2 > 1.96$, so the gap clears the 5% bar — it is <b>not</b> noise. The 0.965 headline hid a genuinely weak slice on the largest tumors. That is the slice to fix.</li>
       </ul>`,
    demo: function (host) {
      host.innerHTML = "";
      var s = getComputedStyle(document.documentElement);
      var g = function (n, d) { return (s.getPropertyValue(n) || d).trim(); };
      var col = {
        ink: g("--ink", "#e6edf3"), dim: g("--ink-dim", "#9aa7b4"),
        accent: g("--accent", "#4ea1ff"), accent2: g("--accent-2", "#7ee787"),
        warn: g("--warn", "#ffb454"), purple: g("--purple", "#c89bff"),
        border: g("--border", "#2a3340"), panel: g("--panel", "#161c24")
      };
      // REAL numbers from load_breast_cancer (see CODEVIZ): benign recall per mean-radius tertile
      var labels = ["small", "medium", "large"];
      var recall = [1.00, 0.974, 0.75];
      var counts = [55, 76, 12];
      var overall = 0.965;
      var worst = 2; // index of worst slice

      var cv = document.createElement("canvas"); cv.width = 640; cv.height = 320; host.appendChild(cv);
      var ctx = cv.getContext("2d");
      var L = 70, R = 610, T = 24, B = 250;
      function py(v) { return B - ((v - 0.6) / (1.0 - 0.6)) * (B - T); } // y-axis 0.6..1.0
      function draw() {
        ctx.clearRect(0, 0, 640, 320);
        ctx.font = "12px sans-serif"; ctx.textBaseline = "alphabetic"; ctx.textAlign = "start";
        // axes
        ctx.strokeStyle = col.border; ctx.lineWidth = 1; ctx.beginPath();
        ctx.moveTo(L, T); ctx.lineTo(L, B); ctx.lineTo(R, B); ctx.stroke();
        // y gridlines 0.6..1.0
        ctx.fillStyle = col.dim;
        for (var v = 0.6; v <= 1.001; v += 0.1) {
          var Y = py(v);
          ctx.strokeStyle = col.border; ctx.beginPath(); ctx.moveTo(L, Y); ctx.lineTo(R, Y); ctx.stroke();
          ctx.fillStyle = col.dim; ctx.fillText(v.toFixed(1), 40, Y + 4);
        }
        // overall dashed reference line
        ctx.strokeStyle = col.purple; ctx.lineWidth = 1.5; ctx.setLineDash([6, 4]);
        ctx.beginPath(); ctx.moveTo(L, py(overall)); ctx.lineTo(R, py(overall)); ctx.stroke(); ctx.setLineDash([]);
        ctx.fillStyle = col.purple; ctx.textAlign = "start"; ctx.fillText("overall " + overall.toFixed(3), L + 6, py(overall) - 5);
        // bars
        var n = labels.length, slot = (R - L) / n, bw = slot * 0.5;
        for (var i = 0; i < n; i++) {
          var cx = L + slot * (i + 0.5);
          var Y = py(recall[i]);
          ctx.fillStyle = (i === worst) ? col.warn : col.accent;
          ctx.fillRect(cx - bw / 2, Y, bw, B - Y);
          ctx.fillStyle = col.ink; ctx.textAlign = "center";
          ctx.fillText(recall[i].toFixed(3), cx, Y - 6);
          ctx.fillStyle = col.dim; ctx.fillText("n=" + counts[i], cx, B + 18);
          ctx.fillStyle = col.ink; ctx.fillText(labels[i], cx, B + 34);
        }
        // labels
        ctx.fillStyle = col.dim; ctx.textAlign = "center";
        ctx.fillText("tumor mean-radius tertile", (L + R) / 2, B + 52);
        ctx.save(); ctx.translate(20, (T + B) / 2); ctx.rotate(-Math.PI / 2); ctx.fillText("benign recall", 0, 0); ctx.restore();
        ctx.textAlign = "start";
      }
      draw();
      var rd = document.createElement("div"); rd.className = "out"; rd.style.marginTop = "6px"; host.appendChild(rd);
      rd.innerHTML = "Real load_breast_cancer run. Overall accuracy is a healthy <b style='color:" + col.purple + "'>0.965</b> (dashed line), but benign recall on the <b style='color:" + col.warn + "'>large</b> tumors is only <b style='color:" + col.warn + "'>0.75</b> — the model misses a quarter of benign large tumors. A two-proportion z-test of that slice vs the rest gives z &approx; 4.2, so the gap is real, not noise. The headline number hid the broken slice.";
    },
    practice: [
      {
        q: `Your churn model reports 0.92 accuracy and the team wants to ship. The product owner asks "is it good for our enterprise customers?" — who are 6% of users. What do you do before answering?`,
        steps: [
          { do: `Refuse to answer from the aggregate. Define segments first: customer tier (enterprise vs SMB), and maybe tenure and region.`, why: `0.92 is an average over all users. Enterprise is only 6%, so it can be terrible while the headline stays high.` },
          { do: `Compute accuracy (and recall on the churn class) per tier with a groupby, attaching a row count to each slice.`, why: `Per-segment metrics reveal whether the enterprise slice tracks the average or lags it. The count tells you how much to trust each slice.` },
          { do: `If enterprise looks worse, run a two-proportion z-test of enterprise vs the rest before raising an alarm.`, why: `On 6% of users the slice may be small; a gap on few rows could be noise. The z-test separates a real gap from sampling wobble.` }
        ],
        answer: `Slice by customer tier and recompute the metric per segment with counts; if enterprise lags, confirm the gap is significant with a two-proportion z-test before trusting it. The 0.92 aggregate cannot answer the question.`
      },
      {
        q: `You swap in model B. Overall AUC rises from 0.81 to 0.83, so it looks like a clear win. A reviewer warns about Simpson's paradox. How do you check, and what would change your decision?`,
        steps: [
          { do: `Break the test set into the cohorts that matter (e.g. new vs returning users) and compute each model's AUC within each cohort.`, why: `Simpson's paradox is when an aggregate improves while every subgroup regresses, usually because the cohort mix shifted between the two evaluations.` },
          { do: `Compare model A vs model B per cohort, not just overall.`, why: `If B's per-cohort AUC is lower in every cohort despite a higher blended AUC, the global gain is an artifact of reweighting, not real improvement.` },
          { do: `Only ship B if its global win also holds (or at least does not regress) within each important cohort.`, why: `A genuine improvement should survive at the subgroup level; a paradoxical one would quietly hurt real users.` }
        ],
        answer: `Recompute each model's AUC per cohort. If B is worse on every cohort despite a higher overall AUC, that is Simpson's paradox — do not ship. Require the win to hold per subgroup.`
      }
    ]
  });

  window.CODE["skill-error-segments"] = {
    lib: "fairlearn + pandas",
    runnable: false,
    explain: `<p>Slice a trained classifier's predictions by a segment column and read accuracy and recall <i>per group</i>, then pull out the single worst group. <code>fairlearn.metrics.MetricFrame</code> does this in one object; a <code>pandas</code> <code>groupby</code> is the dependency-free fallback. Both turn one headline number into a per-segment table.</p>`,
    code: `import numpy as np
import pandas as pd
from sklearn.metrics import accuracy_score, recall_score
from fairlearn.metrics import MetricFrame, count

# y_true, y_pred : arrays from your held-out test set
# segment        : a categorical/ binned column, one label per row
#                  (e.g. customer tier, region, or binned mean-radius tertile)

# ---- 1) fairlearn: per-segment metrics + the worst slice, in one object ----
mf = MetricFrame(
    metrics={"accuracy": accuracy_score,
             "recall": recall_score,
             "n": count},                 # row count per group (always report it!)
    y_true=y_true,
    y_pred=y_pred,
    sensitive_features=segment,           # the slicing column
)
print(mf.overall)                         # the headline numbers
print(mf.by_group)                        # the per-segment table
print("worst recall slice:", mf.recall.idxmin())   # which group is worst
print("recall gap (max-min):", mf.difference(method="between_groups")["recall"])

# ---- 2) pandas groupby fallback (no fairlearn needed) ----
df = pd.DataFrame({"y": y_true, "pred": y_pred, "seg": segment})
per_seg = (df.groupby("seg")
             .apply(lambda g: pd.Series({
                 "n": len(g),
                 "accuracy": accuracy_score(g.y, g.pred),
                 "recall": recall_score(g.y, g.pred),
             }))
             .sort_values("recall"))
print(per_seg)                            # bottom row = worst slice to investigate

# ---- 3) is the worst slice's gap real? two-proportion z-test (slice vs rest) ----
from statsmodels.stats.proportion import proportions_ztest
worst = per_seg.index[0]
m = (segment == worst) & (y_true == 1)            # benign cases inside worst slice
r = (segment != worst) & (y_true == 1)            # benign cases everywhere else
succ = np.array([(y_pred[m] == 1).sum(), (y_pred[r] == 1).sum()])
nobs = np.array([m.sum(), r.sum()])
z, p = proportions_ztest(succ, nobs)              # |z|>1.96  => gap is significant
print(f"worst slice={worst}  z={z:.2f}  p={p:.4f}")`
  };

  window.CODEVIZ["skill-error-segments"] = {
    question: "A model with 0.965 overall accuracy — how do you read a per-segment bar chart to tell a REAL broken slice from one that is just noise or a mirage?",
    charts: [
      {
        type: "bars",
        title: "Real gap: benign recall collapses on the large-radius slice",
        xlabel: "tumor mean-radius tertile",
        ylabel: "benign recall",
        labels: ["small", "medium", "large"],
        values: [1.000, 0.974, 0.750],
        valueLabels: ["1.000 (n=55)", "0.974 (n=76)", "0.750 (n=12)"],
        colors: ["#7ee787", "#7ee787", "#ff7b72"],
        interpret: "<b>How to read it:</b> each bar is the SAME metric (benign recall) recomputed inside one segment; the dotted mental line is the 0.965 overall average. The bars are NOT uniform — the <b>large</b> slice (red) sits far below the others. <b>What to conclude:</b> the headline average hid a broken group. Because the gap (0.75 vs ~0.98) is large AND a two-proportion z-test of this slice vs the rest gives z ~ 4.2 (well past 1.96), the gap is real — this is the slice to fix, even though it barely dented the average."
      },
      {
        type: "bars",
        title: "Healthy: all slices track the average (no slice to chase)",
        xlabel: "tumor mean-radius tertile",
        ylabel: "benign recall",
        labels: ["small", "medium", "large"],
        values: [0.97, 0.96, 0.95],
        valueLabels: ["0.97 (n=55)", "0.96 (n=76)", "0.95 (n=78)"],
        colors: ["#7ee787", "#7ee787", "#7ee787"],
        interpret: "<b>Illustrative.</b> Every bar hugs the same height and sits near the overall average — the spread is a couple of points on healthy sample sizes. <b>What to conclude:</b> the model behaves the same across segments, so there is no broken slice to fix here. This is what you HOPE to see; it is also the case that lets you trust the headline number. Don't invent a problem from a 1-2 point wobble on big slices."
      },
      {
        type: "bars",
        title: "Noise trap: a huge gap on a tiny slice (not significant)",
        xlabel: "customer segment",
        ylabel: "accuracy",
        labels: ["mobile", "web", "kiosk"],
        values: [0.93, 0.91, 0.64],
        valueLabels: ["0.93 (n=1200)", "0.91 (n=980)", "0.64 (n=11)"],
        colors: ["#7ee787", "#7ee787", "#ffb454"],
        interpret: "<b>Illustrative.</b> The <b>kiosk</b> bar craters to 0.64 — visually alarming. But read the count first: <b>n=11</b>. A single-digit-ish slice swinging 30 points is mostly sampling noise; one or two flipped rows move it wildly. <b>What to conclude:</b> do NOT act yet. A z-test (or a confidence interval) of this tiny slice vs the rest would NOT clear 1.96. The lesson: always read the bar's height NEXT TO its n — a big gap on few rows is a mirage, a modest gap on many rows is real."
      },
      {
        type: "bars",
        title: "Simpson's paradox: model B wins overall but loses every cohort",
        xlabel: "cohort",
        ylabel: "AUC",
        series: [
          { name: "model A", color: "#4ea1ff", points: [[0, 0.88], [1, 0.72], [2, 0.83]] },
          { name: "model B (overall AUC higher)", color: "#ff7b72", points: [[0, 0.86], [1, 0.70], [2, 0.81]] }
        ],
        labels: ["new users", "returning", "overall"],
        interpret: "<b>Illustrative.</b> Look at the per-cohort pairs: in <b>new users</b> and <b>returning</b>, blue (model A) is taller than red (model B) — A is better in BOTH real groups. Yet the <b>overall</b> pair shows red taller. <b>What to conclude:</b> B's higher blended AUC is an artifact of how the cohorts were reweighted, not a genuine improvement — this is Simpson's paradox. The rule: a real win must hold (or at least not regress) inside each cohort, so here you would NOT ship B despite the better headline."
      }
    ],
    caption: "Reading the per-segment chart: compare each bar to the overall average, but always read its row COUNT too. A large gap on a big slice (chart 1) is a real broken segment; a flat spread (chart 2) means trust the headline; a huge gap on a tiny slice (chart 3) is noise; and a per-cohort view (chart 4) can expose a 'win' that reverses inside every group (Simpson's paradox).",
    code: `import numpy as np
from sklearn.datasets import load_breast_cancer
from sklearn.linear_model import LogisticRegression
from sklearn.preprocessing import StandardScaler
from sklearn.pipeline import make_pipeline
from sklearn.model_selection import train_test_split
from sklearn.metrics import recall_score

d = load_breast_cancer()                       # 569 real tumor scans, 30 features
X, y = d.data, d.target                         # y=1 benign, y=0 malignant
mean_radius = X[:, 0]                            # feature 0 = mean radius

# split, carrying the mean-radius column so we can derive the segment on the test set
Xtr, Xte, ytr, yte, mr_tr, mr_te = train_test_split(
    X, y, mean_radius, test_size=0.4, random_state=0, stratify=y)

clf = make_pipeline(StandardScaler(),
                    LogisticRegression(max_iter=5000)).fit(Xtr, ytr)
pred = clf.predict(Xte)
print("overall accuracy:", round((pred == yte).mean(), 3))   # 0.965

# derive the SEGMENT: tertiles of mean radius (cut points fixed on TRAIN)
q1, q2 = np.quantile(mr_tr, [1/3, 2/3])         # ~ 12.01, 14.73
seg = np.where(mr_te <= q1, "small",
       np.where(mr_te <= q2, "medium", "large"))

# benign recall PER segment
for name in ["small", "medium", "large"]:
    m = seg == name
    rec = recall_score(yte[m], pred[m], pos_label=1)
    print(f"{name:7s} n={m.sum():3d}  benign recall={rec:.3f}")
# small   n= 57  benign recall=1.000
# medium  n= 93  benign recall=0.974
# large   n= 78  benign recall=0.750   <- worst slice (12 benign cases, 9 caught)`
  };
})();
