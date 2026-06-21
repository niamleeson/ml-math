(function () {
  window.LESSONS.push({
    id: "skill-leakage",
    title: "Detecting leakage and bad labels",
    tagline: "If your offline score looks amazing, suspect a leak or a lie in the labels before you celebrate.",
    module: "Doing ML for Real — the skills that matter (2026)",
    prereqs: ["mlx-cross-validation", "mlx-error-analysis"],
    whenToUse:
      `<p><b>Reach for a leakage-and-label audit the moment a model looks too good</b> — a jump in AUC (Area Under the Curve) you cannot explain, a validation score far above what the business thought was possible, or a model that wins offline and dies in production. Leakage means information the model could not actually have at prediction time sneaked into training. Bad labels mean your "ground truth" is partly wrong, so the model learns the noise.</p>
       <p><b>Always run it when:</b></p>
       <ul>
         <li>You inherited features or a dataset you did not build yourself — you cannot trust what you did not assemble.</li>
         <li>The data is time-based, or rows share an entity (same user, device, patient appearing many times).</li>
         <li>The labels came from humans, heuristics, or a weak upstream model rather than a hard fact.</li>
         <li>One feature dominates importance — that single feature is the prime suspect.</li>
       </ul>
       <p>This skill is make-or-break because leakage and bad labels are <i>silent</i>: nothing errors out, the metric just lies to you. The cost lands in production, where it is most expensive to discover.</p>`,
    playbook:
      `<p>Two audits run side by side: hunt for <b>leakage</b>, then hunt for <b>bad labels</b>.</p>
       <p><b>LEAKAGE</b></p>
       <ol>
         <li><b>Adversarial validation.</b> Stack your train and test (or holdout) rows, label them <code>0</code> = train and <code>1</code> = test, and train a classifier to tell the two apart. If its AUC (Area Under the Curve) is near <b>1.0</b>, train and test are easy to separate — a distribution leak or shift. An AUC near <b>0.5</b> means they look identical, which is what you want. The features with high importance in <i>that</i> classifier are the ones drifting.</li>
         <li><b>Suspiciously high single-feature AUC.</b> Score each feature alone against the target. A lone feature with AUC near 1.0 is almost always leakage — a target-derived column, an ID that encodes the answer, or a value recorded after the outcome.</li>
         <li><b>Null / permutation importance.</b> Shuffle the target column, refit, and record each feature's importance under that <i>broken</i> relationship (the "null"). Repeat many times to build a null distribution. Keep only features whose real importance <b>beats the null</b>; the rest are fitting noise. A feature whose importance is huge even pre-shuffle and collapses post-shuffle is fine; one that scores high under a shuffled target is leaking through some artifact.</li>
         <li><b>Time-audit.</b> For every feature, ask: <i>was this value knowable at the prediction moment?</i> Anything computed from events after that timestamp — a "total_purchases" that includes the very purchase you are predicting — is leakage. Trace each feature back to its source query and its <i>as-of</i> time.</li>
         <li><b>Duplicate rows straddling the split.</b> Look for identical or near-identical rows where one copy is in train and another in test. The model memorizes the train copy and "predicts" its twin. De-duplicate before splitting, and split by entity so the same user or device never lands on both sides.</li>
       </ol>
       <p><b>BAD LABELS</b></p>
       <ol start="6">
         <li><b>Confident learning</b> (the <code>cleanlab</code> library). Fit a model with cross-validation, get out-of-fold predicted probabilities, and let <code>find_label_issues</code> rank the rows most likely mislabeled by comparing each row's given label to the model's confident belief.</li>
         <li><b>Out-of-fold disagreement.</b> Use <code>cross_val_predict</code> to get a held-out prediction for every row, then list the rows where the model — never having seen that row in training — confidently disagrees with the stored label. Hand-review the worst offenders.</li>
         <li><b>Inter-annotator agreement.</b> If humans labeled the data, have two or more label a shared sample and compute <b>Cohen's kappa</b>. Low kappa means even your humans cannot agree, so the label itself is ambiguous and no model can do better than the noise.</li>
       </ol>`,
    application:
      `<p>This audit shows up everywhere a model is graded on data someone else assembled.</p>
       <ul>
         <li><b>Credit and fraud:</b> a "days_since_default" or a post-decision status field leaks the outcome — caught by single-feature AUC and the time-audit.</li>
         <li><b>Click and conversion models:</b> features built from a join that includes future events; the same user appears in train and test, so the model memorizes them — caught by adversarial validation and entity-based splits.</li>
         <li><b>Medical and content moderation:</b> labels come from rushed human annotators; confident learning and Cohen's kappa surface the systematically mislabeled rows.</li>
         <li><b>Any handed-down dataset:</b> before trusting a benchmark, adversarial validation tells you whether the train and test halves even came from the same distribution.</li>
       </ul>`,
    pitfalls:
      `<ul>
         <li><b>A metric that's too good to be true.</b> The single loudest red flag. 0.99 AUC on a hard problem is a leak until proven otherwise — investigate the win, do not bank it.</li>
         <li><b>Scaler or encoder fit on the full data before the split.</b> Calling <code>StandardScaler().fit(X)</code> or a target encoder on all rows lets test statistics bleed into training. Fit every transform inside the CV (Cross-Validation) fold, on train only — use a <code>Pipeline</code>.</li>
         <li><b>Target-derived features.</b> Any column computed from the label (or from something that is only known once the label is known) hands the model the answer. Trace each feature's lineage back to a timestamp before the prediction.</li>
         <li><b>Group leakage.</b> The same entity — user, patient, device, session — in both train and test. The model memorizes the entity, not the pattern. Split by group (<code>GroupKFold</code>), never by row.</li>
         <li><b>Accepting labels as ground truth.</b> Treating a human-, heuristic-, or upstream-model-generated label as infallible. Measure label noise (confident learning, kappa) before blaming the model for its errors.</li>
       </ul>`,
    checklist:
      `<p>Run this on your own project before trusting any score:</p>
       <ul>
         <li>☐ Ran <b>adversarial validation</b> (train-vs-test classifier); AUC is near 0.5, not 1.0.</li>
         <li>☐ Scored each feature alone; no single feature has a suspiciously near-perfect AUC.</li>
         <li>☐ Ran <b>permutation / null importance</b>; every kept feature beats the shuffled-target null.</li>
         <li>☐ <b>Time-audited</b> every feature: each value was knowable at the prediction moment.</li>
         <li>☐ De-duplicated rows and confirmed no entity straddles the train/test split (group split).</li>
         <li>☐ Every scaler / encoder / imputer is fit <i>inside</i> the CV fold via a <code>Pipeline</code>.</li>
         <li>☐ Ran <b>confident learning</b> (<code>cleanlab.find_label_issues</code>) on out-of-fold probabilities and reviewed the top suspects.</li>
         <li>☐ Listed <b>out-of-fold disagreements</b> and hand-checked the most confident ones.</li>
         <li>☐ For human labels, measured <b>Cohen's kappa</b>; agreement is acceptable for the task.</li>
       </ul>`,
    bigIdea:
      `<p><b>Leakage</b> is when the model gets to peek at information it would never have in real life — most often the answer, or something only knowable after the answer. <b>Bad labels</b> are when the "truth" you train against is itself partly wrong.</p>
       <p>Both produce the same trap: a beautiful offline score that does not survive contact with reality. The fix is not a fancier model — it is a set of cheap, mechanical checks that you run <i>before</i> you believe any number.</p>
       <p>The unifying tool is a classifier used as a <i>detector</i>: separate train from test (adversarial validation), or separate a feature's real signal from the noise of a shuffled target (null importance), or separate likely-correct from likely-wrong labels (confident learning).</p>`,
    buildup:
      `<p>Two pieces of math carry most of the weight here.</p>
       <p><b>AUC as a separability score.</b> Pick one positive row and one negative row at random. The AUC (Area Under the Curve) is the probability the model scores the positive higher. AUC = 0.5 is coin-flip (the two groups are indistinguishable); AUC = 1.0 means a perfect wall between them. So a high AUC <i>between train and test</i> means they are different distributions — a leak.</p>
       <p><b>The permutation test.</b> Break the real link between features and target by shuffling the target. Any importance that survives the shuffle came from chance, not signal. Comparing real importance to this shuffled "null" tells you which features are genuinely informative.</p>
       <p><b>Confident learning</b> estimates a joint table of (given noisy label, latent true label), so it can rank which rows are probably mislabeled. <b>Cohen's kappa</b> measures how much two annotators agree <i>beyond</i> what random agreement would give.</p>`,
    symbols: [
      { sym: "$\\text{AUC}$", desc: "Area Under the ROC Curve: the probability a random positive example is scored higher than a random negative one. 0.5 = indistinguishable, 1.0 = perfectly separable." },
      { sym: "$p_o$", desc: "observed agreement: the fraction of items two annotators happened to label the same." },
      { sym: "$p_e$", desc: "expected agreement by chance: the agreement you'd get if each annotator labeled at random using their own label frequencies." },
      { sym: "$\\kappa$", desc: "Cohen's kappa (Greek 'kappa'): agreement corrected for chance. 1 = perfect, 0 = no better than chance, negative = worse than chance." },
      { sym: "$Q_{\\tilde y, y^*}$", desc: "the joint distribution of the noisy (given) label $\\tilde y$ versus the latent true label $y^*$ that confident learning estimates." },
      { sym: "$I_j$", desc: "the importance of feature $j$ measured on the real data." },
      { sym: "$I_j^{(\\pi)}$", desc: "the importance of feature $j$ after the target is shuffled (permuted) — its value under the null." }
    ],
    formula: `$$ \\kappa=\\frac{p_o-p_e}{1-p_e}, \\qquad \\text{AUC}=\\Pr\\big(s(x^{+})>s(x^{-})\\big), \\qquad \\text{keep feature } j \\iff I_j > \\text{quantile}_{0.95}\\big(I_j^{(\\pi)}\\big) $$`,
    whatItDoes:
      `<p>The <b>kappa</b> formula takes the raw agreement $p_o$ and subtracts off the agreement you'd expect by luck $p_e$, then rescales so that perfect agreement is 1. Two annotators who agree 90% of the time but on a label that is 90% one class get $\\kappa\\approx 0$ — their agreement was free.</p>
       <p>The <b>AUC</b> identity says it equals the chance a positive ($x^{+}$) outscores a negative ($x^{-}$) under the model's score $s$. Used as a detector, a high AUC between train and test rows is the alarm bell for a distribution leak.</p>
       <p>The <b>permutation rule</b> says: keep feature $j$ only if its real importance $I_j$ beats (say) the 95th percentile of its importances under a shuffled target. Anything below that bar is indistinguishable from noise.</p>`,
    derivation:
      `<p><b>Why Cohen's kappa subtracts chance.</b></p>
       <ul class="steps">
         <li>If a label is 95% class A, two annotators who just always guess A agree 90.25% of the time ($0.95^2 + 0.05^2$) while knowing nothing. Raw agreement $p_o$ overstates skill.</li>
         <li>Chance agreement $p_e=\\sum_c \\hat p_c^{(1)}\\hat p_c^{(2)}$ sums, over classes $c$, the product of each annotator's marginal rate for $c$ — the agreement expected if they labeled independently at random.</li>
         <li>$p_o-p_e$ is the agreement <i>above</i> chance; dividing by the maximum possible above-chance agreement $1-p_e$ normalizes it to $[-1,1]$. So $\\kappa$ answers "how much of the achievable beyond-luck agreement did they actually reach?" $\\blacksquare$</li>
       </ul>
       <p><b>Why permutation importance works.</b> Shuffling the target destroys any real feature-target relationship but keeps each feature's marginal distribution intact. So any importance a feature still earns under the shuffle is pure overfitting headroom. A feature whose real importance does not clear that bar is, statistically, just noise the model latched onto.</p>
       <p><b>Why confident learning finds mislabels.</b> Out-of-fold, the model never trained on the row it scores, so its confident prediction is an independent second opinion. Counting (given label, confidently-predicted label) pairs estimates the joint $Q_{\\tilde y, y^*}$; off-diagonal mass flags the rows whose stored label disagrees with the model's confident belief — the likely mislabels.</p>`,
    example:
      `<p><b>Worked kappa.</b> Two doctors each label 100 scans as "tumor" (positive) or "clear". They agree on 90 of them, so $p_o=0.90$. Doctor 1 called 20 positive ($\\hat p^{(1)}=0.20$), Doctor 2 called 25 positive ($\\hat p^{(2)}=0.25$).</p>
       <ul class="steps">
         <li>Chance agreement on "positive": $0.20\\times0.25=0.05$. Chance agreement on "clear": $0.80\\times0.75=0.60$. So $p_e=0.05+0.60=0.65$.</li>
         <li>$\\kappa=\\dfrac{p_o-p_e}{1-p_e}=\\dfrac{0.90-0.65}{1-0.65}=\\dfrac{0.25}{0.35}\\approx 0.71$.</li>
         <li>Reading: 90% raw agreement sounds great, but once you remove the huge agreement they'd get just by both usually saying "clear", only $\\kappa\\approx0.71$ of the achievable beyond-chance agreement is real — "substantial" but not airtight. If $\\kappa$ had come out near 0, the labels would be too noisy to trust as ground truth.</li>
       </ul>
       <p><b>Worked leak detector.</b> You inject a column equal to the label plus a touch of noise, then score it alone: single-feature AUC = 1.00 versus 0.97 for the best real feature. That near-perfect lone feature is the unmistakable signature of a target-derived leak — exactly the pattern the chart below highlights.</p>`,
    demo: function (host) {
      host.innerHTML = "";
      var s = getComputedStyle(document.documentElement);
      var g = function (n, d) { return (s.getPropertyValue(n) || d).trim(); };
      var col = {
        ink: g("--ink", "#e6edf3"), dim: g("--ink-dim", "#9aa7b4"),
        accent: g("--accent", "#4ea1ff"), warn: g("--warn", "#ffb454"),
        border: g("--border", "#2a3340")
      };
      // Adversarial validation: as train and test drift apart, the detector's AUC climbs from 0.5 to 1.0.
      var cv = document.createElement("canvas"); cv.width = 640; cv.height = 300; cv.style.maxWidth = "100%"; host.appendChild(cv);
      var ctx = cv.getContext("2d");
      var L = 56, R = 612, T = 22, B = 240;
      var readout = document.createElement("div"); readout.className = "out"; readout.style.marginTop = "6px";

      function detectorAUC(shift) {
        // Two 1-D gaussians (train mean 0, test mean = shift, sd 1). AUC of the optimal
        // threshold detector telling them apart = Phi(shift / sqrt(2)).
        var z = shift / Math.SQRT2;
        // standard normal CDF via erf approximation
        var t = 1 / (1 + 0.2316419 * Math.abs(z));
        var d = 0.3989423 * Math.exp(-z * z / 2);
        var p = d * t * (0.3193815 + t * (-0.3565638 + t * (1.781478 + t * (-1.821256 + t * 1.330274))));
        var cdf = z >= 0 ? 1 - p : p;
        return cdf;
      }
      function px(sh) { return L + (sh / 3.0) * (R - L); }
      function py(a) { return B - ((a - 0.5) / 0.5) * (B - T); }   // 0.5..1.0
      var shift = 0.6;
      function draw() {
        ctx.clearRect(0, 0, 640, 300);
        ctx.font = "12px sans-serif"; ctx.textBaseline = "alphabetic"; ctx.textAlign = "start";
        ctx.strokeStyle = col.border; ctx.lineWidth = 1; ctx.beginPath();
        ctx.moveTo(L, T); ctx.lineTo(L, B); ctx.lineTo(R, B); ctx.stroke();
        ctx.fillStyle = col.dim;
        for (var a = 0.5; a <= 1.001; a += 0.1) {
          var Y = py(a); ctx.strokeStyle = col.border; ctx.beginPath(); ctx.moveTo(L, Y); ctx.lineTo(R, Y); ctx.stroke();
          ctx.fillText(a.toFixed(1), 26, Y + 4);
        }
        // the AUC(shift) curve
        ctx.strokeStyle = col.accent; ctx.lineWidth = 2.5; ctx.beginPath();
        var first = true;
        for (var sh = 0; sh <= 3.0; sh += 0.03) { var X = px(sh), Y2 = py(detectorAUC(sh)); if (first) { ctx.moveTo(X, Y2); first = false; } else ctx.lineTo(X, Y2); }
        ctx.stroke();
        // current point
        var auc = detectorAUC(shift);
        ctx.fillStyle = col.warn; ctx.beginPath(); ctx.arc(px(shift), py(auc), 5, 0, 7); ctx.fill();
        ctx.textAlign = "center";
        ctx.fillStyle = col.dim;
        ctx.fillText("distribution gap between train and test (mean shift, in standard deviations)", (L + R) / 2, B + 28);
        ctx.save(); ctx.translate(16, (T + B) / 2); ctx.rotate(-Math.PI / 2); ctx.fillStyle = col.dim; ctx.fillText("adversarial-validation AUC", 0, 0); ctx.restore();
        ctx.textAlign = "start";
        readout.innerHTML = "Drag the slider to widen the gap between train and test. The detector's AUC = <b style='color:" + col.warn + "'>" + auc.toFixed(3) + "</b>. Near <b>0.5</b> the two sets look identical (healthy). As the gap grows, AUC climbs toward <b>1.0</b> — the classifier can tell train from test, the alarm bell for a <b>distribution leak or shift</b>.";
      }
      var row = document.createElement("div"); row.style.margin = "8px 0";
      var sl = document.createElement("input"); sl.type = "range"; sl.min = "0"; sl.max = "3"; sl.step = "0.05"; sl.value = "0.6"; sl.style.width = "60%";
      sl.addEventListener("input", function () { shift = parseFloat(sl.value); draw(); });
      var lab = document.createElement("span"); lab.style.marginLeft = "10px"; lab.textContent = "train↔test gap";
      row.appendChild(sl); row.appendChild(lab);
      host.appendChild(row); host.appendChild(readout);
      draw();
    },
    practice: [
      {
        q: `A teammate's churn model hits 0.992 AUC (Area Under the Curve) offline but barely beats random in production. You have the training table. What do you check, in order?`,
        steps: [
          { do: `Score each feature alone against the target (single-feature AUC).`, why: `A lone feature near 1.0 AUC is almost certainly target-derived or recorded after the outcome — the classic leak signature.` },
          { do: `Run a time-audit on the top suspects: trace each back to its source query and its as-of timestamp.`, why: `If the value is computed from events after the prediction moment (e.g. a cancellation flag), it is leakage no model could have in real life.` },
          { do: `Run adversarial validation and check for entity duplicates across the split.`, why: `Confirms whether train and test even share a distribution, and whether the same customer is memorized on both sides.` }
        ],
        answer: `Start with single-feature AUC to find the too-good feature, then time-audit it back to a timestamp after the prediction moment (the leak), then confirm with adversarial validation and an entity-based split. The production collapse is the tell that the offline score was leaking.`
      },
      {
        q: `Your labels were crowd-sourced. Before blaming the model for a 12% error rate, how do you check whether the labels themselves are trustworthy, and how do you find the worst rows?`,
        steps: [
          { do: `Have two annotators re-label a shared sample and compute Cohen's kappa $\\kappa=(p_o-p_e)/(1-p_e)$.`, why: `If $\\kappa$ is low, even humans disagree, so the label is ambiguous and the model's "errors" may be label noise, not model fault.` },
          { do: `Run confident learning: cross_val_predict for out-of-fold probabilities, then cleanlab.find_label_issues.`, why: `It ranks the rows most likely mislabeled by comparing each given label to the model's confident out-of-fold belief.` },
          { do: `Hand-review the top-ranked suspects and the most confident out-of-fold disagreements.`, why: `Confirms whether the flagged rows are genuinely mislabeled before you re-label or relabel-and-retrain.` }
        ],
        answer: `Measure inter-annotator agreement with Cohen's kappa to see if the labels are even self-consistent, then use confident learning (cleanlab.find_label_issues on out-of-fold probabilities) plus out-of-fold disagreement to rank and hand-check the likely mislabels.`
      }
    ]
  });

  window.CODE["skill-leakage"] = {
    lib: "cleanlab + scikit-learn",
    runnable: false,
    explain: `<p>Two real audits. First, <b>confident learning</b>: get out-of-fold predicted probabilities with scikit-learn, then let cleanlab's <code>find_label_issues</code> rank the rows most likely mislabeled. Second, an <b>adversarial-validation</b> snippet that trains a classifier to tell train rows from test rows — an AUC (Area Under the Curve) near 1.0 means a distribution leak. Needs a real Python runtime.</p>`,
    code: `import numpy as np
from sklearn.linear_model import LogisticRegression
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import cross_val_predict, cross_val_score
from sklearn.metrics import roc_auc_score
from cleanlab.filter import find_label_issues

# ---------- 1. BAD LABELS: confident learning with cleanlab ----------
# X, y are your features and (possibly noisy) labels.
# Get OUT-OF-FOLD predicted probabilities: every row is scored by a model
# that never trained on it -> an honest second opinion.
pred_probs = cross_val_predict(
    LogisticRegression(max_iter=2000),
    X, y, cv=5, method="predict_proba",
)

# cleanlab estimates the joint distribution of (noisy label, true label)
# and ranks rows whose given label disagrees with the model's confident belief.
issue_idx = find_label_issues(
    labels=y,
    pred_probs=pred_probs,
    return_indices_ranked_by="self_confidence",  # worst suspects first
)
print(f"{len(issue_idx)} likely-mislabeled rows; top 10: {issue_idx[:10]}")
# Hand-review issue_idx[:50] before relabeling or dropping.

# ---------- 2. LEAKAGE: adversarial validation ----------
# Stack train and holdout rows; label train=0, holdout=1; can a model tell them apart?
X_av = np.vstack([X_train, X_holdout])
is_holdout = np.r_[np.zeros(len(X_train)), np.ones(len(X_holdout))]

av_auc = cross_val_score(
    RandomForestClassifier(n_estimators=300, random_state=0),
    X_av, is_holdout, cv=5, scoring="roc_auc",
).mean()
print(f"adversarial-validation AUC = {av_auc:.3f}")
# ~0.5  -> train and holdout look identical (healthy)
# ~1.0  -> a distribution leak/shift: the splits differ; inspect the
#          features the detector relied on (its feature_importances_).

# Bonus -- single-feature leak scan: a lone feature near 1.0 AUC is a red flag.
for j in range(X.shape[1]):
    a = roc_auc_score(y, X[:, j])
    a = max(a, 1 - a)                # direction-agnostic
    if a > 0.95:
        print(f"feature {j}: single-feature AUC {a:.3f} -- suspiciously high, audit it")`
  };

  window.CODEVIZ["skill-leakage"] = {
    question: "Can a single feature's standalone AUC expose a leak? We inject one deliberately leaky feature (label + small noise) into the real breast-cancer data and compare its standalone AUC to genuine features.",
    charts: [{
      type: "bars",
      title: "Single-feature AUC on load_breast_cancer (one feature is a planted leak)",
      xlabel: "feature",
      ylabel: "standalone AUC",
      labels: ["leaky_feature", "worst perimeter", "worst concave pts", "mean texture", "mean smoothness", "symmetry error"],
      values: [1.000, 0.975, 0.967, 0.776, 0.722, 0.555],
      valueLabels: ["1.000", "0.975", "0.967", "0.776", "0.722", "0.555"],
      colors: ["#ffb454", "#4ea1ff", "#4ea1ff", "#4ea1ff", "#4ea1ff", "#4ea1ff"]
    }],
    caption: "Real run on load_breast_cancer (569 samples, 30 real features). We DELIBERATELY injected one leaky feature equal to the label plus small Gaussian noise to demonstrate the signature — it is the orange bar. Its standalone AUC (Area Under the Curve) is a perfect 1.000, standing clearly above even the strongest genuine feature (worst perimeter, 0.975). A lone feature that separates the classes almost perfectly is the classic fingerprint of target-derived leakage: in a real audit you would trace that column back to its source and remove it.",
    code: `import numpy as np
from sklearn.datasets import load_breast_cancer
from sklearn.metrics import roc_auc_score

d = load_breast_cancer()                 # 569 real samples, 30 real features
X, y = d.data, d.target
names = list(d.feature_names)

# DELIBERATELY inject a leaky feature: the label plus a little noise.
# In real data this is what a target-derived column looks like.
rng = np.random.default_rng(0)
leak = y + rng.normal(0, 0.10, size=y.shape)

def single_auc(col):                     # direction-agnostic standalone AUC
    a = roc_auc_score(y, col)
    return round(max(a, 1 - a), 3)

bars = [("leaky_feature", single_auc(leak))]
for nm in ["worst perimeter", "worst concave points", "mean texture",
           "mean smoothness", "symmetry error"]:
    bars.append((nm, single_auc(X[:, names.index(nm)])))

for nm, a in bars:
    print(f"{nm:22s} {a:.3f}")
# leaky_feature          1.000   <- planted leak, stands out
# worst perimeter        0.975
# worst concave points   0.967
# mean texture           0.776
# mean smoothness        0.722
# symmetry error         0.555`
  };
})();
