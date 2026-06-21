(function () {
  window.LESSONS.push({
    id: "skill-validation",
    title: "Validating models correctly",
    tagline: "Your score is a guess about the future. Most ways of computing it lie — here is how to make it honest.",
    module: "Doing ML for Real — the skills that matter (2026)",
    prereqs: ["mlx-cross-validation", "ml-bias-variance"],
    whenToUse:
      `<p><b>Validation is how you find out whether your model will actually work on data it has never seen.</b> Every number you report — accuracy, AUC (Area Under the Curve), error — is really a <i>prediction about the future</i>. If you measure it wrong, you ship a model that looked great in the notebook and falls apart in production. This is the single most common way ML projects fail, and it almost never shows up until it is too late.</p>
       <p><b>This skill is make-or-break whenever:</b></p>
       <ul>
         <li>You are about to <i>decide</i> something from a score — pick a model, pick hyperparameters, or tell a stakeholder "this works".</li>
         <li>Your rows are <b>not independent</b> — many rows from the same patient, user, or device; or rows ordered in <b>time</b>.</li>
         <li>You <b>tune</b> anything (a threshold, a regularizer, a learning rate) — every tuning trial is a chance to fool yourself.</li>
         <li>Two models score close together and you must say which is genuinely better.</li>
       </ul>
       <p><b>Get this right and the rest of ML gets easier:</b> an honest estimate tells you when to stop tuning, which model to trust, and how surprised to be when production numbers come back.</p>`,
    playbook:
      `<p>A real validation protocol, in order. Each step names the concrete technique.</p>
       <ol>
         <li><b>Split with discipline: train / validation / test, and lock the test set away.</b> The <b>training</b> set fits the model. The <b>validation</b> set (or the inner cross-validation folds) is what you tune and compare on. The <b>test</b> set is touched <i>exactly once</i>, at the very end, to report the final number. If you peek at the test set while developing, it stops being a fair estimate of the future. Treat it like a sealed envelope.</li>
         <li><b>Use the RIGHT cross-validation for your data — not always plain random K-fold.</b>
           <ul>
             <li><b>StratifiedKFold</b> when classes are imbalanced: it keeps the class ratio the same in every fold, so a rare class is not missing from some folds.</li>
             <li><b>GroupKFold</b> when an <i>entity</i> must not straddle the split — all rows from one patient / user / device go entirely into train OR test, never both. Otherwise the model "recognizes" the entity in test and you measure memorization, not generalization.</li>
             <li><b>TimeSeriesSplit</b> / <b>walk-forward</b> for temporal data: always train on the past and test on the future, never shuffle. Shuffling lets the model peek at tomorrow to predict today.</li>
           </ul>
         </li>
         <li><b>Put all preprocessing INSIDE a <code>Pipeline</code>.</b> Scalers, encoders, imputers, and feature selectors must be <i>fit on the training fold only</i>, then applied to the validation fold. If you fit the scaler on the whole dataset before splitting, statistics from the validation rows leak into training and your score is optimistic. A <code>Pipeline</code> re-fits every step on each fold automatically, so leakage is impossible by construction.</li>
         <li><b>Use NESTED cross-validation when you also tune hyperparameters.</b> An <i>inner</i> loop (e.g. <code>GridSearchCV</code>) picks the best hyperparameters; an <i>outer</i> loop scores the whole tuning-plus-fitting procedure on data the inner loop never saw. The outer score is an honest estimate of "what my full model-building recipe achieves". Tuning and scoring on the same folds gives an optimistically biased number.</li>
         <li><b>Report a CONFIDENCE INTERVAL, not a single number.</b> A point estimate like "0.91" hides how much it could wobble on a different sample. Report a range — e.g. a <b>bootstrap</b> 95% interval over the per-fold scores — so you and your reader know the real uncertainty.</li>
         <li><b>Compare two models with a PAIRED test.</b> Score both models on the <i>same</i> folds (or the same test examples) and compare the differences, not the raw means. Use <b>McNemar's test</b> on a single held-out test set (it looks at examples where the two models disagree), or a <b>paired</b> cross-validation comparison. Comparing models on different folds confounds the model with the luck of the split.</li>
       </ol>`,
    application:
      `<p>Every place ML touches a real decision, validation is the gate that decides whether you can trust the number.</p>
       <ul>
         <li><b>Healthcare:</b> many scans per patient — <b>GroupKFold</b> by patient is mandatory, or the model "remembers" patients instead of learning the disease.</li>
         <li><b>Finance & demand forecasting:</b> data is ordered in time — <b>walk-forward / TimeSeriesSplit</b> is the only honest split; random folds let the model see the future.</li>
         <li><b>Fraud, churn, rare-disease detection:</b> heavy class imbalance — <b>StratifiedKFold</b> plus AUC / PR-AUC (Precision-Recall Area Under the Curve), never raw accuracy.</li>
         <li><b>Model selection on leaderboards:</b> the gap between a <b>nested-CV</b> estimate and a tune-on-the-test-set estimate is exactly why so many "winning" models regress in production.</li>
       </ul>
       <p>This builds directly on <a>[mlx-cross-validation]</a> (the K-fold mechanics) and <a>[ml-bias-variance]</a> (why a single split is a high-variance estimate of true error).</p>`,
    pitfalls:
      `<ul>
         <li><b>Tuning on the test set.</b> The tell: there is no separate validation set, and the same held-out data that chose the hyperparameters is also "the final number". The reported score is optimistic; production will be worse. Fix: a sealed test set or nested CV.</li>
         <li><b>Random K-fold on grouped or temporal data.</b> The tell: rows share an entity (patient, user, session) or carry a timestamp, yet the split is <code>KFold(shuffle=True)</code>. Near-duplicate twins land in both train and test and the score looks too good. Fix: GroupKFold or TimeSeriesSplit.</li>
         <li><b>Fitting the scaler (or imputer / encoder / feature selector) before splitting.</b> The tell: <code>StandardScaler().fit_transform(X)</code> appears <i>above</i> the train/test split. Validation statistics leak into training. Fix: wrap every transform in a <code>Pipeline</code>.</li>
         <li><b>A single CV number with no variance.</b> The tell: the report says "AUC = 0.91" with no &plusmn; and no interval. You cannot tell a real 2-point gain from noise. Fix: report the spread across folds or a bootstrap interval.</li>
         <li><b>Data snooping across many trials.</b> The tell: dozens of features, thresholds, or model variants were tried against the <i>same</i> validation set, and the best was kept. With enough trials something scores high by chance. Fix: a final untouched test set and correction for multiple comparisons.</li>
         <li><b>Comparing models on different folds.</b> The tell: model A's score and model B's score come from separate runs with different random seeds or splits. The difference is confounded with split luck. Fix: a <i>paired</i> comparison on identical folds, then McNemar or a paired test.</li>
       </ul>`,
    checklist:
      `<p>Run this on your own project before you trust a score.</p>
       <ul>
         <li>&#9633; Is there a <b>test set</b> I have touched zero times during development?</li>
         <li>&#9633; Are my rows <b>independent</b>? If not, am I using <b>GroupKFold</b> (by entity) or <b>TimeSeriesSplit</b> (by time)?</li>
         <li>&#9633; Are my classes balanced? If not, am I using <b>StratifiedKFold</b> and AUC / PR-AUC instead of accuracy?</li>
         <li>&#9633; Is <b>every</b> preprocessing step inside a <code>Pipeline</code>, so it is fit on training folds only?</li>
         <li>&#9633; If I tuned hyperparameters, did I use <b>nested CV</b> for the reported number?</li>
         <li>&#9633; Did I report a <b>confidence interval</b>, not just a point estimate?</li>
         <li>&#9633; When comparing models, did I use the <b>same folds</b> and a <b>paired test</b> (McNemar / paired CV)?</li>
         <li>&#9633; Did I count how many <b>trials</b> I ran against the validation set, and guard against snooping?</li>
       </ul>`,
    bigIdea:
      `<p>A model's score on its own training data is meaningless — it can memorize. We want the <b>generalization error</b>: how it does on fresh data drawn from the same world.</p>
       <p>We never have the whole future, so we <i>estimate</i> generalization error by holding data out. <b>Cross-validation</b> reuses the data efficiently by rotating which slice is held out. But the estimate is only honest if the held-out slice is <i>truly</i> independent of what trained the model.</p>
       <p>Two things can corrupt that estimate. <b>Leakage</b> makes it too high (information from the held-out slice sneaks into training). <b>Optimistic selection bias</b> makes it too high (you picked the best of many trials on the same held-out data). Correct validation is the discipline of keeping the held-out slice genuinely, provably unseen.</p>`,
    buildup:
      `<p>Think of true error as a target we cannot measure directly. Each fold gives a noisy shot at it.</p>
       <p>The <b>mean of the folds</b> is our estimate. Like any average it has a <b>bias</b> (is it centered on the true error?) and a <b>variance</b> (how much would it move on a different sample?). Good validation drives both down — bias by keeping held-out data clean, variance by averaging over folds and reporting an interval.</p>
       <p>When folds are not independent (grouped or temporal data straddling the split), the "estimate" is centered on the wrong target — it estimates how well the model recalls entities it has already seen, which is not what we will face in production.</p>`,
    symbols: [
      { sym: "$K$", desc: "the number of cross-validation folds — how many slices we split the data into." },
      { sym: "$\\hat{e}_k$", desc: "the error (or 1 minus accuracy) measured on fold $k$. The 'hat' means it is an estimate from a sample." },
      { sym: "$\\bar{e} = \\frac{1}{K}\\sum_{k=1}^{K}\\hat{e}_k$", desc: "the cross-validation estimate: the average error across all $K$ folds." },
      { sym: "$\\sigma^2$", desc: "the variance of a single fold's error (Greek 'sigma' squared): how much one fold bounces around." },
      { sym: "$\\mathbb{E}[\\cdot]$", desc: "the expected value — the long-run average if we repeated the whole experiment many times." },
      { sym: "$B$", desc: "the number of bootstrap resamples used to build a confidence interval." },
      { sym: "$b$, $c$", desc: "in McNemar's test: $b$ = examples model A got right but model B got wrong; $c$ = examples B got right but A got wrong (the disagreements)." }
    ],
    formula: `$$ \\text{Bootstrap 95\\% CI} = \\Big[\\,Q_{2.5\\%}\\{\\bar{e}^{*1},\\dots,\\bar{e}^{*B}\\},\\ \\ Q_{97.5\\%}\\{\\bar{e}^{*1},\\dots,\\bar{e}^{*B}\\}\\,\\Big] \\qquad\\qquad \\chi^2_{\\text{McNemar}} = \\frac{(|b-c|-1)^2}{b+c} $$`,
    whatItDoes:
      `<p><b>Left — the bootstrap confidence interval.</b> Resample your per-fold (or per-example) scores <i>with replacement</i> $B$ times. Each resample gives a new mean $\\bar{e}^{*j}$. The 2.5th and 97.5th <b>percentiles</b> ($Q$) of those $B$ means are the ends of a 95% interval. It says: "if I redid this experiment, the estimate would land in this range 95% of the time." No formula for the spread is needed — the data's own wobble gives it.</p>
       <p><b>Right — McNemar's test</b> compares two classifiers on one test set. It ignores examples they <i>agree</i> on and looks only at the disagreements: $b$ (A right, B wrong) and $c$ (B right, A wrong). If the models were equally good, $b$ and $c$ should be about equal. A large $\\chi^2$ (chi-squared) means one model is genuinely better; the $-1$ is a continuity correction. A p-value below 0.05 says the difference is unlikely to be split luck.</p>`,
    derivation:
      `<p><b>Why the K-fold mean has low bias but its variance is tricky.</b></p>
       <ul class="steps">
         <li>Each fold's error $\\hat{e}_k$ is an unbiased shot at the true error, so the average $\\bar{e}=\\frac1K\\sum_k\\hat{e}_k$ is roughly unbiased too. That is why CV is trusted at all.</li>
         <li><b>Variance of the mean.</b> If the folds were independent, $\\operatorname{Var}(\\bar{e})=\\sigma^2/K$ — more folds, less wobble. But the training sets of different folds <i>overlap heavily</i> (they share most of the data), so the fold errors are <b>positively correlated</b>. With correlation $\\rho$ between folds, the real variance is $\\operatorname{Var}(\\bar{e})=\\frac{\\sigma^2}{K}+\\frac{K-1}{K}\\rho\\,\\sigma^2$. The second term does not vanish as $K$ grows — this is why you cannot drive CV variance to zero just by adding folds, and why you should report an interval rather than trust the mean blindly.</li>
         <li><b>The bootstrap CI</b> sidesteps needing $\\rho$: it just resamples the observed scores and reads off percentiles, capturing the spread empirically.</li>
         <li><b>Why nested CV avoids optimistic bias.</b> Picking the best of $T$ hyperparameter settings on a validation set is like taking the max of $T$ noisy numbers — the max is biased <i>upward</i> even if all settings are equally good. The outer loop re-scores the <i>chosen</i> setting on data the inner selection never saw, so that upward bias is removed. The outer score honestly estimates the whole "tune-then-fit" procedure. $\\blacksquare$</li>
       </ul>`,
    example:
      `<p>You ran 5-fold CV and got per-fold accuracies $[0.88,\\ 0.91,\\ 0.90,\\ 0.86,\\ 0.93]$. Mean $=0.896$. Is "0.90" the whole story? No — you need its uncertainty.</p>
       <ul class="steps">
         <li><b>Bootstrap the interval.</b> Resample those 5 numbers with replacement many times (say $B=10{,}000$); each resample's mean is one $\\bar{e}^{*}$. The middle 95% of those means runs from about <b>0.876 to 0.916</b>. So report <b>0.896, 95% CI [0.876, 0.916]</b> — a band of roughly &plusmn;2 points, not a single decimal.</li>
         <li><b>Now compare two models with McNemar.</b> On one test set of 200 examples: model A right & B wrong on $b=18$; B right & A wrong on $c=7$; the rest they agree on. Then $\\chi^2=\\frac{(|18-7|-1)^2}{18+7}=\\frac{(10)^2}{25}=4.0$. Against the chi-squared table (1 degree of freedom), $\\chi^2=4.0$ gives $p\\approx0.046$ — just under 0.05, so A's edge is (barely) statistically real, not split luck.</li>
         <li><b>The lesson:</b> the point estimates ($0.896$; A "beats" B) were not enough — the interval and the paired test are what tell you how much to trust them.</li>
       </ul>`,
    demo: function (host) {
      host.innerHTML = "";
      var s = getComputedStyle(document.documentElement);
      var g = function (n, d) { return (s.getPropertyValue(n) || d).trim(); };
      var col = {
        ink: g("--ink", "#e6edf3"), dim: g("--ink-dim", "#9aa7b4"),
        accent: g("--accent", "#4ea1ff"), accent2: g("--accent-2", "#7ee787"),
        warn: g("--warn", "#ffb454"), bad: g("--bad", "#ff7b72"),
        border: g("--border", "#2a3340"), panel: g("--panel", "#161c24")
      };
      // 6 "entities", each contributing 2 near-identical rows. Drag the slider to assign rows
      // to folds either by ROW (entity straddles) or by GROUP (entity stays together).
      var rd = document.createElement("div"); rd.className = "out"; rd.style.marginBottom = "8px";
      host.appendChild(rd);
      var cv = document.createElement("canvas"); cv.width = 640; cv.height = 200; cv.style.maxWidth = "100%"; host.appendChild(cv);
      var ctx = cv.getContext("2d");
      var row = document.createElement("div"); row.style.margin = "10px 0";
      var btnRandom = document.createElement("button"); btnRandom.style.cssText = BTN; btnRandom.textContent = "Random K-fold (split by ROW)";
      var btnGroup = document.createElement("button"); btnGroup.style.cssText = BTN; btnGroup.textContent = "GroupKFold (split by ENTITY)";
      row.appendChild(btnRandom); row.appendChild(btnGroup); host.appendChild(row);

      var entities = 6;        // each entity has 2 twin rows
      var mode = "row";        // "row" = straddle leakage, "group" = clean
      function draw() {
        ctx.clearRect(0, 0, 640, 200);
        ctx.font = "13px sans-serif"; ctx.textBaseline = "middle";
        var leak = 0;
        for (var e = 0; e < entities; e++) {
          // twin A and twin B for this entity
          var foldA, foldB;
          if (mode === "row") { foldA = (e * 2) % 2; foldB = (e * 2 + 1) % 2 === 0 ? 1 : 0; foldA = (e % 2); foldB = ((e + 1) % 2); }
          else { foldA = e % 2; foldB = e % 2; }
          var same = (foldA === foldB);
          if (mode === "row" && !same) leak++;
          var y = 26 + e * 28;
          ctx.fillStyle = col.dim; ctx.fillText("entity " + (e + 1), 8, y);
          // twin A
          ctx.fillStyle = foldA === 0 ? col.accent : col.warn;
          ctx.fillRect(110, y - 9, 90, 18);
          ctx.fillStyle = "#0b0e13"; ctx.fillText(foldA === 0 ? "TRAIN" : "TEST", 130, y);
          // twin B
          ctx.fillStyle = foldB === 0 ? col.accent : col.warn;
          ctx.fillRect(220, y - 9, 90, 18);
          ctx.fillStyle = "#0b0e13"; ctx.fillText(foldB === 0 ? "TRAIN" : "TEST", 240, y);
          // straddle flag
          if (mode === "row" && !same) { ctx.fillStyle = col.bad; ctx.fillText("LEAK: twin in both!", 330, y); }
          else { ctx.fillStyle = col.accent2; ctx.fillText("clean", 330, y); }
        }
        rd.innerHTML = mode === "row"
          ? "<b>Random K-fold:</b> rows assigned independently, so <b style='color:" + col.bad + "'>" + leak + " of " + entities + "</b> entities have one twin in TRAIN and its near-identical twin in TEST. The model 'recognizes' the twin &mdash; the score is <b>optimistic</b>."
          : "<b>GroupKFold:</b> both twins of each entity go to the SAME side. No twin straddles the split, so the test fold is genuinely unseen. The score is <b>honest</b> (and lower &mdash; the gap was leakage).";
      }
      btnRandom.addEventListener("click", function () { mode = "row"; draw(); });
      btnGroup.addEventListener("click", function () { mode = "group"; draw(); });
      draw();
    },
    practice: [
      {
        q: `Your dataset has 50 patients, each with about 6 MRI scans (rows). You run KFold(shuffle=True) and report 0.97 accuracy. Your colleague says the number is not trustworthy. Why, and how do you fix it?`,
        steps: [
          { do: `Notice the rows are not independent: 6 scans from the same patient are near-duplicates.`, why: `Random shuffling scatters one patient's scans across both train and test folds.` },
          { do: `Name the leak: a scan of patient P is in test while another scan of the SAME patient P is in train.`, why: `The model recognizes the patient, not the disease, so the test score measures memorization. That is why 0.97 is inflated.` },
          { do: `Switch to GroupKFold with groups = patient id, so every scan of a patient lands entirely in train OR test.`, why: `Now the test patients are genuinely unseen, and the score honestly estimates how the model does on a NEW patient.` }
        ],
        answer: `The rows are grouped by patient, so random K-fold lets a patient's scans straddle train and test (leakage) — the model recognizes patients, inflating the score. Fix: GroupKFold with groups = patient id, so no patient appears on both sides. Expect a lower but honest number.`
      },
      {
        q: `You used GridSearchCV to pick the best regularizer, then reported that GridSearchCV's best cross-validation score as your final accuracy. What is wrong, and what is the correct protocol?`,
        steps: [
          { do: `Recognize that the reported number is the MAX over many hyperparameter trials on the same folds.`, why: `Taking the best of many noisy scores is biased upward even if every setting were equally good — optimistic selection bias.` },
          { do: `Wrap the GridSearchCV inside an OUTER cross-validation loop (nested CV).`, why: `The outer folds score the whole tune-then-fit procedure on data the inner grid search never saw.` },
          { do: `Report the outer-loop score (with an interval), not the inner best score.`, why: `The outer score honestly estimates what your full model-building recipe achieves on fresh data.` }
        ],
        answer: `Reporting GridSearchCV's own best score tunes and evaluates on the same folds, so it is optimistically biased (the max of many trials). Correct protocol: nested CV — an inner GridSearchCV to choose hyperparameters, an outer CV loop to score the chosen procedure on unseen folds. Report the outer score plus a confidence interval.`
      },
      {
        q: `Two models score 0.903 and 0.911 on your data. A teammate declares the second one "better". How do you decide whether that 0.008 gap is real?`,
        steps: [
          { do: `Refuse to compare two bare means from possibly different runs.`, why: `A 0.008 gap can easily be split luck; and if the scores came from different folds, model and split are confounded.` },
          { do: `Score both models on the SAME folds (or the same held-out test set), example by example.`, why: `A paired comparison removes the split as a variable: each fold contributes a difference, not two independent numbers.` },
          { do: `Run McNemar's test on the test-set disagreements (b = A right/B wrong, c = B right/A wrong), or a paired CV test, and check the p-value.`, why: `It tells you whether the difference is statistically real or within noise. Only then declare a winner.` }
        ],
        answer: `Do not trust the raw 0.008 gap. Evaluate both models on the same folds/test set and run a paired test — McNemar on the disagreement counts (b, c) for a single test set, or a paired CV test. If the p-value is below 0.05 the gap is real; otherwise the models are tied and you should prefer the simpler one.`
      }
    ]
  });

  window.CODE["skill-validation"] = {
    lib: "scikit-learn",
    runnable: false,
    explain: `<p>The full honest-validation toolkit in scikit-learn: every preprocessing step lives inside a <code>Pipeline</code> (so scalers are fit on training folds only), the right splitter is chosen for the data (<code>StratifiedKFold</code> / <code>GroupKFold</code> / <code>TimeSeriesSplit</code>), hyperparameters are tuned with <i>nested</i> CV, and the estimate is reported as a bootstrap confidence interval rather than a single number.</p>`,
    code: `import numpy as np
from sklearn.datasets import load_breast_cancer
from sklearn.pipeline import Pipeline
from sklearn.preprocessing import StandardScaler
from sklearn.linear_model import LogisticRegression
from sklearn.model_selection import (
    StratifiedKFold, GroupKFold, TimeSeriesSplit,
    cross_val_score, GridSearchCV,
)

X, y = load_breast_cancer(return_X_y=True)

# 1 + 3. ALL preprocessing inside a Pipeline -> the scaler is fit on the
#         TRAINING fold only, never on the held-out fold. No leakage by construction.
pipe = Pipeline([
    ("scale", StandardScaler()),
    ("clf",   LogisticRegression(max_iter=5000)),
])

# 2. The RIGHT splitter for the data:
#    - StratifiedKFold: keeps the class ratio in every fold (imbalance).
strat = StratifiedKFold(n_splits=5, shuffle=True, random_state=0)
#    - GroupKFold: an entity (patient/user) never straddles the split.
group = GroupKFold(n_splits=5)
#    - TimeSeriesSplit: train on the past, test on the future (no shuffling).
ts    = TimeSeriesSplit(n_splits=5)

scores = cross_val_score(pipe, X, y, cv=strat, scoring="roc_auc")
print("per-fold AUC:", np.round(scores, 3))

# 4. NESTED CV for honest tuning: inner GridSearchCV picks C, outer CV scores
#    the whole tune-then-fit procedure on folds the inner search never saw.
grid = {"clf__C": [0.01, 0.1, 1, 10]}
inner = StratifiedKFold(n_splits=4, shuffle=True, random_state=1)
outer = StratifiedKFold(n_splits=5, shuffle=True, random_state=0)
search = GridSearchCV(pipe, grid, cv=inner, scoring="roc_auc")
nested = cross_val_score(search, X, y, cv=outer, scoring="roc_auc")  # outer loop
print("nested-CV AUC: %.3f" % nested.mean())

# 5. Bootstrap 95% confidence interval on the estimate (not a single number).
def bootstrap_ci(fold_scores, B=10000, seed=0):
    rng = np.random.default_rng(seed)
    means = [rng.choice(fold_scores, size=len(fold_scores), replace=True).mean()
             for _ in range(B)]
    return np.percentile(means, [2.5, 97.5])

lo, hi = bootstrap_ci(nested)
print("nested-CV AUC %.3f  95%% CI [%.3f, %.3f]" % (nested.mean(), lo, hi))

# 6. Compare two models with McNemar's test on a single held-out test set.
from sklearn.model_selection import train_test_split
from statsmodels.stats.contingency_tables import mcnemar  # paired test
Xtr, Xte, ytr, yte = train_test_split(X, y, test_size=0.3, random_state=0, stratify=y)
pA = pipe.fit(Xtr, ytr).predict(Xte)
pB = Pipeline([("scale", StandardScaler()),
               ("clf", LogisticRegression(C=0.01, max_iter=5000))]).fit(Xtr, ytr).predict(Xte)
b = int(((pA == yte) & (pB != yte)).sum())   # A right, B wrong
c = int(((pB == yte) & (pA != yte)).sum())   # B right, A wrong
print("McNemar:", mcnemar([[0, b], [c, 0]], exact=False, correction=True))`
  };

  window.CODEVIZ["skill-validation"] = {
    question: "On real data with a grouped (entity) structure, how much does naive random K-fold INFLATE the score versus a group-aware split? The gap is leakage.",
    charts: [{
      type: "bars",
      title: "Naive random K-fold vs honest GroupKFold on grouped breast-cancer data",
      xlabel: "validation protocol",
      ylabel: "5-fold mean accuracy",
      labels: ["random K-fold (OPTIMISTIC)", "GroupKFold (HONEST)"],
      values: [1.0, 0.929],
      valueLabels: ["1.000", "0.929"],
      colors: ["#ff7b72", "#7ee787"]
    }],
    caption: "Real numbers from load_breast_cancer. We BUILD a group index: pick 80 real tumors as 'patients' and give each 5-8 near-identical scans (the original row + tiny noise), so rows are NOT independent. A 1-nearest-neighbour pipeline scores a perfect 1.000 under random KFold(shuffle=True) — because for almost every test row its near-duplicate twin sits in the training fold, so the model just recognizes the twin. Under GroupKFold (each patient entirely in train OR test) the honest accuracy is 0.929. That 7-point gap is pure leakage: the random-fold number is a lie about how the model handles a NEW patient.",
    code: `import numpy as np
from sklearn.datasets import load_breast_cancer
from sklearn.model_selection import cross_val_score, KFold, GroupKFold
from sklearn.pipeline import make_pipeline
from sklearn.preprocessing import StandardScaler
from sklearn.neighbors import KNeighborsClassifier

d = load_breast_cancer()
X, y = d.data, d.target
rng = np.random.default_rng(0)

# Construct a GROUP (entity) index: 80 real tumors act as "patients",
# each contributing 5-8 near-identical "scans" (original row + tiny noise).
# This makes rows NON-independent, exactly the situation that breaks random K-fold.
n_groups = 80
base = rng.choice(len(y), size=n_groups, replace=False)
Xg, yg, groups = [], [], []
for g, bi in enumerate(base):
    for _ in range(rng.integers(5, 9)):
        Xg.append(X[bi] + rng.normal(0, 0.02, X.shape[1]) * X[bi])  # noisy twin
        yg.append(y[bi]); groups.append(g)
Xg, yg, groups = np.array(Xg), np.array(yg), np.array(groups)

pipe = make_pipeline(StandardScaler(), KNeighborsClassifier(n_neighbors=1))

# OPTIMISTIC: random K-fold ignores groups -> a twin of each test row is in train.
opt = cross_val_score(pipe, Xg, yg, cv=KFold(5, shuffle=True, random_state=0))
# HONEST: GroupKFold keeps each patient entirely on one side.
hon = cross_val_score(pipe, Xg, yg, groups=groups, cv=GroupKFold(5))

print("optimistic (random KFold):", round(opt.mean(), 3))  # 1.000
print("honest (GroupKFold)      :", round(hon.mean(), 3))  # 0.929
print("leakage gap              :", round(opt.mean() - hon.mean(), 3))  # 0.071`
  };
})();