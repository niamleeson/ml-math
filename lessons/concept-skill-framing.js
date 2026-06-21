(function () {
  window.LESSONS.push({
    id: "skill-framing",
    title: "Framing a vague business problem into a clear ML task",
    tagline: "Turn 'reduce churn' into a precise spec: a decision, a target, a label, a metric, and proof there is signal.",
    module: "Doing ML for Real — the skills that matter (2026)",
    prereqs: ["ml-classification-metrics", "ml-logistic-regression"],
    whenToUse:
      `<p><b>Framing is the first and highest-leverage step of any ML project.</b> A model that perfectly predicts the wrong thing is worthless, and you cannot tell good from wrong until the task is written down precisely. The cost of a bad frame is paid at the very end — after months of data and modeling work — so it is the cheapest mistake to fix early and the most expensive to fix late.</p>
       <p><b>Reach for this skill the moment someone hands you a vague ask</b> — "reduce churn", "improve engagement", "catch fraud", "make the feed better". None of these is an ML task yet. Each must be turned into a concrete prediction that feeds a concrete decision someone will actually act on.</p>
       <p><b>Choose to spend a day framing when:</b></p>
       <ul>
         <li>The request names a <i>business outcome</i> (revenue, retention, risk) but no prediction.</li>
         <li>Several teams could "own" the problem and each pictures a different model.</li>
         <li>You are about to pull data — get the label and unit of analysis right <i>before</i> the expensive joins.</li>
       </ul>
       <p><b>Skip straight to a rule, not a model, when:</b> a hand-written threshold ("flag any transaction over $10,000 from a new device") already captures the decision. Framing includes deciding whether you even need ML.</p>`,
    playbook:
      `<p>Run these seven steps in order. Each turns one piece of vagueness into one line of a spec.</p>
       <ol>
         <li><b>Name the DECISION and the actor.</b> Ask "what action changes because of this prediction, and who takes it?" A churn model that no one acts on is theater. Write it as: <i>"The retention team sends a discount offer to users the model flags."</i> If you cannot name an action and an actor, stop — there is no ML task yet.</li>
         <li><b>Choose the TARGET and the unit of analysis.</b> What are you scoring, one row at a time? Per user? Per session? Per transaction? Per user-week? The unit decides how every row is built and how labels are counted. "Churn" per-user and per-subscription give different datasets and different models.</li>
         <li><b>Pick the ML FRAMING.</b> Map the decision to a task type: <b>binary classification</b> (will this user churn?), <b>multiclass</b> (which plan will they pick?), <b>regression</b> (how many days until churn?), <b>ranking</b> (order users by churn risk for a fixed-budget campaign), <b>anomaly detection</b> (flag transactions unlike any seen), or <b>reinforcement learning</b> (choose the offer that maximizes long-run value). The action shape picks the framing: a fixed contact budget means ranking, not classification.</li>
         <li><b>Define the LABEL and the prediction HORIZON precisely.</b> "Churn" must become a measurable event with a clock: <i>"no login for 30 consecutive days, measured over the 60 days after the prediction date."</i> Pin the positive class, the observation window, and the horizon. The horizon is how far into the future you predict; it must match when the action can still help.</li>
         <li><b>Decide ONLINE vs OFFLINE and the constraints.</b> Does the prediction run in a nightly batch (offline) or inside a live request (online)? Online adds a <b>latency budget</b> (e.g. under 50 ms) and limits you to features available at request time. Offline lets you use slow, rich features. Also fix <b>coverage</b>: what fraction of cases must get a score?</li>
         <li><b>FEASIBILITY probe — is there signal at all?</b> Before any modeling, estimate the <b>base rate</b> (how often the positive class occurs) and run a tiny check that the inputs carry information about the label: <code>mutual_info_classif</code> on candidate features, then a 5-line <code>LogisticRegression</code> with cross-validation to confirm it beats the majority-class baseline. No lift over base rate here means no project — kill it now, cheaply.</li>
         <li><b>Write the one-page ML SPEC.</b> Capture inputs, label, metric, baseline, and constraints on a single page everyone signs off on: decision, target, framing, label+horizon, metric, baseline, latency/coverage constraints, and the feasibility evidence from step 6. This page is the contract for the whole project.</li>
       </ol>`,
    application:
      `<p>Every real ML project starts here, whether or not anyone writes it down.</p>
       <ul>
         <li><b>"Reduce churn"</b> becomes: rank active users by P(no login for 30 days in the next 60) so the retention team's fixed weekly offer budget goes to the highest-risk users. Framing as <i>ranking under a budget</i>, not raw classification, matches the actual decision.</li>
         <li><b>"Improve the feed"</b> becomes: per-impression, predict P(meaningful interaction) to rank candidate posts online under a 30 ms budget — and the team must decide whether the <i>proxy</i> (clicks) actually tracks the <i>goal</i> (long-term satisfaction).</li>
         <li><b>"Catch fraud"</b> becomes: per-transaction, score P(chargeback within 90 days), online, under tight latency, optimized for precision at a fixed review capacity — because analysts can only review so many flags per day.</li>
       </ul>
       <p>Getting the frame right is what lets later skills work: <a>[ml-classification-metrics]</a> only makes sense once the label and positive class are pinned, and <a>[ml-logistic-regression]</a> is the natural baseline named in the spec.</p>`,
    pitfalls:
      `<ul>
         <li><b>The label leaks the future.</b> If the label is defined using information not available at prediction time — a feature recorded <i>after</i> the event you predict — offline scores look magical and production collapses. Tell: a feature that is suspiciously predictive. Fix: every feature must be knowable strictly before the horizon starts.</li>
         <li><b>Label defined after the fact.</b> Backfilling "who churned" using data the model would not have had on the prediction date silently leaks the answer. Pin the label to a clock and a prediction date.</li>
         <li><b>Wrong unit of analysis.</b> Modeling per-user when the decision is per-session (or vice versa) means every row, label, and metric is subtly wrong. Tell: the metric is hard to map back to a business number. Fix: the unit is whatever the actor acts on.</li>
         <li><b>Optimizing a proxy that diverges from the goal.</b> Clicks are not satisfaction; watch-time is not value. The model maximizes the proxy and the business metric stalls or drops. Tell: the offline metric climbs while the north-star metric is flat. Fix: name the proxy explicitly and monitor the true goal.</li>
         <li><b>Framing as ML when a rule suffices.</b> If a hand-written threshold already captures the decision, a model adds cost, latency, and failure modes for no gain. Tell: the "model" is a single obvious cutoff. Fix: ship the rule; revisit ML only if it plateaus.</li>
         <li><b>No baseline in the spec.</b> Without the majority-class rate or a simple rule written down, you cannot tell whether the model is good or just memorizing the base rate. Tell: "95% accurate!" on a 95%-negative dataset. Fix: the spec names the baseline the model must beat.</li>
         <li><b>Unmeasurable target.</b> If you cannot compute the label from logged data for past cases, you can never train or evaluate. Tell: "we want to predict customer happiness" with no logged proxy. Fix: redefine the target as something you can actually measure.</li>
       </ul>`,
    checklist:
      `<p>Copy this one-page spec template and fill every line before you pull data:</p>
       <ul>
         <li><b>Decision &amp; actor:</b> what action changes, and who takes it? (If blank, there is no ML task.)</li>
         <li><b>Target &amp; unit of analysis:</b> what is one scored row — per user / session / transaction / user-week?</li>
         <li><b>ML framing:</b> binary / multiclass / regression / ranking / anomaly / RL (Reinforcement Learning) — and why this one.</li>
         <li><b>Label &amp; horizon:</b> the positive class as a measurable event, the observation window, and how far ahead you predict.</li>
         <li><b>Metric:</b> the single number you optimize (and any guardrail metrics), chosen to match the decision.</li>
         <li><b>Baseline:</b> the majority-class rate or simple rule the model must beat.</li>
         <li><b>Constraints:</b> online vs offline, latency budget, required coverage.</li>
         <li><b>Feasibility evidence:</b> base rate, top mutual-information features, and cross-validated accuracy of a 5-line baseline vs the majority baseline.</li>
       </ul>`,
    bigIdea:
      `<p>A business ask is a wish. An ML task is a contract. Framing is the work of turning one into the other.</p>
       <p>The contract says exactly four things: <b>what you predict</b> (the label), <b>for what unit</b> (the row), <b>to drive what decision</b> (the action), and <b>measured how</b> (the metric and baseline).</p>
       <p>Two checks decide whether the contract is worth signing. First, is the decision worth automating — does the <b>expected value</b> of acting on a prediction beat the cost? Second, is there <b>signal</b> — do the inputs actually carry information about the label?</p>`,
    buildup:
      `<p>A prediction is only useful if some action depends on it, so the value of a model is the value of the decisions it improves.</p>
       <p>Write the value of acting on a flagged case as the chance the action succeeds times its benefit, minus the cost of acting. Sum that over everyone you act on and you get the expected value of deploying the model.</p>
       <p>But none of that matters if the inputs are noise. So before modeling, we measure whether a feature $X$ shares information with the label $Y$. The clean way to ask "how much does knowing $X$ tell me about $Y$?" is <b>mutual information</b> $I(X;Y)$.</p>`,
    symbols: [
      { sym: "$Y$", desc: "the label: the thing you predict, e.g. 1 = churns, 0 = stays. The positive class is the event the action targets." },
      { sym: "$X$", desc: "a candidate input feature (or set of features) you might use to predict $Y$." },
      { sym: "$p$", desc: "the base rate: the fraction of cases where $Y$ is the positive class. (For 'churn', the share of users who actually churn.)" },
      { sym: "$P(\\text{action})$", desc: "the probability the action you take actually succeeds (e.g. a discount actually retains the user)." },
      { sym: "$b$", desc: "the benefit of one successful action (the value of keeping one user)." },
      { sym: "$c$", desc: "the cost of taking the action once (the price of the discount), paid whether or not it works." },
      { sym: "$I(X;Y)$", desc: "the mutual information between $X$ and $Y$: how many bits (or nats) knowing $X$ reduces your uncertainty about $Y$. Zero means $X$ is useless." },
      { sym: "$p(x,y)$", desc: "the joint probability of seeing input value $x$ together with label $y$." },
      { sym: "$p(x),\\,p(y)$", desc: "the marginal probabilities of $x$ on its own and $y$ on its own." }
    ],
    formula: `$$ \\text{value}=P(\\text{action})\\cdot b - c \\qquad\\qquad I(X;Y)=\\sum_{x}\\sum_{y} p(x,y)\\,\\log\\frac{p(x,y)}{p(x)\\,p(y)} $$`,
    whatItDoes:
      `<p>The left formula is the <b>expected value of a decision</b>. Acting pays off $b$ only when the action works (probability $P(\\text{action})$), but you always pay the cost $c$. If this is negative, the decision is not worth automating — no model needed.</p>
       <p>The right formula is <b>mutual information</b>. It compares the joint $p(x,y)$ to what you would expect if $X$ and $Y$ were independent, $p(x)\\,p(y)$. When they are independent the ratio is 1, its log is 0, and $I(X;Y)=0$ — the feature carries no signal. The more $X$ and $Y$ move together, the larger $I$.</p>`,
    derivation:
      `<p><b>Why mutual information is the right signal check.</b></p>
       <ul class="steps">
         <li>Uncertainty about $Y$ is its <b>entropy</b> $H(Y)=-\\sum_y p(y)\\log p(y)$ — bigger when $Y$ is hard to guess.</li>
         <li>Once you know $X$, the leftover uncertainty is the <b>conditional entropy</b> $H(Y\\mid X)$.</li>
         <li>Mutual information is exactly the drop: $I(X;Y)=H(Y)-H(Y\\mid X)$. It measures how much knowing $X$ shrinks your uncertainty about $Y$.</li>
         <li>Substituting the definitions and simplifying gives the double-sum form above. It is symmetric ($I(X;Y)=I(Y;X)$) and never negative.</li>
         <li>Crucially it captures <b>any</b> dependence, not just linear correlation — a feature can have zero correlation with $Y$ yet high $I$. That makes it a strict, model-free feasibility test: if $I(X;Y)\\approx 0$ for every candidate feature, no model can do better than the base rate. $\\blacksquare$</li>
       </ul>`,
    example:
      `<p><b>Worked frame: "reduce churn".</b> Suppose 8% of users churn each month, so the base rate is $p=0.08$.</p>
       <ul class="steps">
         <li><b>Decision:</b> the retention team sends a $10 discount to flagged users. So $c=10$. A retained user is worth $b=200$. Past tests show the discount retains a would-churn user 30% of the time, so $P(\\text{action})=0.30$.</li>
         <li><b>Expected value of acting on a true would-churner:</b> $\\text{value}=0.30\\times 200 - 10 = 60 - 10 = \\$50$. Positive, so acting is worth it — <i>if</i> we can find the would-churners.</li>
         <li><b>Feasibility:</b> on logged data we compute $I(X;Y)$ for candidate features. "Logins in last 7 days" scores $I=0.12$ nats; "days since signup" scores $0.01$ nats — near zero, so drop it.</li>
         <li><b>Baseline:</b> always predict "stays" is 92% accurate (since $1-p=0.92$). So accuracy is the wrong metric; with a fixed offer budget we rank by risk and measure precision at the top.</li>
         <li><b>One-page spec:</b> per-user, binary label "no login for 30 days in the next 60", offline nightly batch, rank by P(churn), metric = precision@budget, baseline = 92% majority, evidence = $I=0.12$ from login activity. Now it is a real ML task.</li>
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
      // expected value of a decision: value = P(action)*b - c. Sliders for the levers.
      var P = 0.30, b = 200, c = 10;
      var cv = document.createElement("canvas"); cv.width = 640; cv.height = 220; cv.style.maxWidth = "100%"; host.appendChild(cv);
      var ctx = cv.getContext("2d");
      var readout = document.createElement("div"); readout.className = "out"; readout.style.marginTop = "6px";

      function draw() {
        ctx.clearRect(0, 0, 640, 220);
        ctx.font = "12px sans-serif"; ctx.textAlign = "start";
        var benefit = P * b;          // expected benefit
        var value = benefit - c;      // expected value of acting
        var maxv = Math.max(benefit, b, 1);
        var L = 150, R = 600, base = 40, barH = 34, gap = 18;
        function bar(y, w, color, label, num) {
          ctx.fillStyle = color; ctx.fillRect(L, y, Math.max(0, w), barH);
          ctx.fillStyle = col.ink; ctx.textAlign = "end"; ctx.fillText(label, L - 10, y + 22);
          ctx.textAlign = "start"; ctx.fillText("$" + num.toFixed(0), L + Math.max(0, w) + 8, y + 22);
        }
        function W(v) { return v / maxv * (R - L); }
        bar(base, W(benefit), col.accent2, "P(action)*benefit", benefit);
        bar(base + barH + gap, W(c), col.warn, "cost", c);
        var vy = base + 2 * (barH + gap);
        ctx.fillStyle = value >= 0 ? col.accent : "#ff7b72";
        ctx.fillRect(L, vy, Math.max(0, W(Math.abs(value))), barH);
        ctx.fillStyle = col.ink; ctx.textAlign = "end"; ctx.fillText("expected value", L - 10, vy + 22);
        ctx.textAlign = "start"; ctx.fillText("$" + value.toFixed(0) + (value >= 0 ? "  (act)" : "  (don't)"), L + Math.max(0, W(Math.abs(value))) + 8, vy + 22);
        readout.innerHTML = "value = P(action)&middot;benefit &minus; cost = <b>" + P.toFixed(2) + "&middot;" + b + " &minus; " + c +
          " = $" + value.toFixed(0) + "</b>. " + (value >= 0
            ? "Positive &rArr; acting on a true positive pays off, so a model that finds them is worth building."
            : "<b style='color:#ff7b72'>Negative</b> &rArr; the action costs more than it returns; no model can rescue a losing decision.");
      }
      function slider(labelTxt, min, max, step, val, cb) {
        var wrap = document.createElement("label"); wrap.style.display = "inline-block"; wrap.style.marginRight = "16px"; wrap.style.fontSize = "13px";
        var sp = document.createElement("span"); sp.className = "out"; sp.style.marginLeft = "6px"; sp.textContent = val;
        wrap.appendChild(document.createTextNode(labelTxt)); wrap.appendChild(sp);
        var inp = document.createElement("input"); inp.type = "range"; inp.min = min; inp.max = max; inp.step = step; inp.value = val; inp.style.display = "block";
        inp.addEventListener("input", function () { var v = parseFloat(inp.value); sp.textContent = v; cb(v); draw(); });
        wrap.appendChild(inp); return wrap;
      }
      var row = document.createElement("div"); row.style.margin = "8px 0";
      row.appendChild(slider("P(action succeeds) ", 0, 1, 0.01, P, function (v) { P = v; }));
      row.appendChild(slider("benefit b ", 0, 500, 10, b, function (v) { b = v; }));
      row.appendChild(slider("cost c ", 0, 200, 5, c, function (v) { c = v; }));
      host.appendChild(row); host.appendChild(readout);
      draw();
    },
    practice: [
      {
        q: `A product manager says "use ML to reduce customer churn". Turn this into a one-line ML task: name the decision, the unit, the framing, and the label with a horizon.`,
        steps: [
          { do: `Find the decision and actor.`, why: `Ask what action changes. Here: the retention team sends a discount to at-risk users. No action means no task.` },
          { do: `Set the unit of analysis to per-user (the actor acts on a user).`, why: `Each scored row is one user, because the offer goes to a user, not a session or a transaction.` },
          { do: `Pick the framing from the action shape: a fixed offer budget means ranking, not raw classification.`, why: `With limited budget you want the highest-risk users first, which is a ranking, scored by churn probability.` },
          { do: `Define the label with a clock: "no login for 30 consecutive days within the next 60 days".`, why: `A measurable event plus a horizon makes the label computable from logs and aligned with when the offer can still help.` }
        ],
        answer: `Per-user, rank users by P(no login for 30 consecutive days within the next 60), so the retention team's fixed-budget discount goes to the highest-risk users. (Ranking, not classification, because the budget is fixed.)`
      },
      {
        q: `Before modeling, how do you cheaply check there is any signal to predict churn, and why is "95% accuracy" not enough to declare success?`,
        steps: [
          { do: `Compute the base rate of the positive class.`, why: `If only 5% of users churn, predicting "stays" for everyone is already 95% accurate, so accuracy alone is meaningless.` },
          { do: `Run mutual_info_classif on candidate features against the label.`, why: `Mutual information measures any dependence between a feature and the label; near-zero for all features means no model can beat the base rate.` },
          { do: `Fit a 5-line LogisticRegression with cross-validation and compare to the majority-class baseline.`, why: `If the cross-validated metric does not beat the trivial baseline, the project is infeasible and should be killed now, cheaply.` }
        ],
        answer: `Estimate the base rate, run mutual_info_classif on candidate features to confirm non-zero signal, then check a 5-line cross-validated LogisticRegression beats the majority baseline. "95% accuracy" is worthless if 95% of users don't churn — you must beat the base rate, not match it.`
      }
    ]
  });

  window.CODE["skill-framing"] = {
    lib: "scikit-learn + pandas",
    runnable: false,
    explain: `<p>A <b>feasibility probe</b> you run <i>before</i> committing to a model: load the data, measure the base rate, score candidate features with <code>mutual_info_classif</code>, then confirm a 5-line <code>LogisticRegression</code> actually beats the majority-class baseline. If it doesn't, the frame is infeasible — kill it cheaply.</p>`,
    code: `import pandas as pd
import numpy as np
from sklearn.feature_selection import mutual_info_classif
from sklearn.linear_model import LogisticRegression
from sklearn.preprocessing import StandardScaler
from sklearn.pipeline import make_pipeline
from sklearn.model_selection import cross_val_score

# ----- load the framed dataset -----
# one row per UNIT OF ANALYSIS (e.g. one user); y is the LABEL you defined
# with a horizon, e.g. 1 = "no login for 30 days in the next 60", 0 = active.
df = pd.read_parquet("churn_features.parquet")
y = df.pop("churned").to_numpy()          # the positive class is "churned"
X = df.to_numpy()
feature_names = list(df.columns)

# ----- (1) base rate: how often is the positive class true? -----
base_rate = y.mean()
majority_baseline = max(base_rate, 1 - base_rate)   # accuracy of "always predict the majority"
print(f"base rate (P churn) = {base_rate:.3f}")
print(f"majority-class baseline accuracy = {majority_baseline:.3f}")

# ----- (2) is there SIGNAL? mutual information per candidate feature -----
mi = mutual_info_classif(X, y, random_state=0)      # >0 => the feature carries info about y
ranking = sorted(zip(feature_names, mi), key=lambda t: t[1], reverse=True)
print("\\ntop candidate features by mutual information:")
for name, score in ranking[:8]:
    print(f"  {name:<22} I(X;y) = {score:.3f}")

# ----- (3) does a 5-line baseline BEAT chance? -----
clf = make_pipeline(StandardScaler(), LogisticRegression(max_iter=5000))
acc = cross_val_score(clf, X, y, cv=5).mean()        # honest out-of-fold accuracy
print(f"\\nlogistic-regression CV accuracy = {acc:.3f}")
print("VERDICT:", "signal beats chance -> frame is feasible"
      if acc > majority_baseline + 0.02 else
      "no lift over baseline -> rethink the frame or kill it")`
  };

  window.CODEVIZ["skill-framing"] = {
    question: "Before building a churn-style model, is there any signal to frame a task around? Which candidate features actually carry information about the label?",
    charts: [{
      type: "bars",
      title: "Mutual information of top candidate features vs the label (load_breast_cancer)",
      xlabel: "candidate feature",
      ylabel: "mutual information I(X;y), nats",
      labels: ["worst perimeter", "worst area", "worst radius", "worst concave pts", "mean concave pts", "mean perimeter", "mean concavity"],
      values: [0.473, 0.463, 0.454, 0.439, 0.437, 0.403, 0.375],
      valueLabels: ["0.47", "0.46", "0.45", "0.44", "0.44", "0.40", "0.38"],
      colors: ["#7ee787", "#7ee787", "#7ee787", "#4ea1ff", "#4ea1ff", "#4ea1ff", "#4ea1ff"]
    }],
    caption: "Real feasibility probe on load_breast_cancer (569 tumor records; base rate P(benign)=0.627, so the majority baseline is 62.7% accurate). mutual_info_classif scores every feature against the label; the top seven all carry strong signal (0.38-0.47 nats), and a 5-line cross-validated LogisticRegression reaches 0.981 accuracy — far above the 0.627 baseline. Clear, measurable signal: the frame is feasible.",
    code: `import numpy as np
from sklearn.datasets import load_breast_cancer
from sklearn.feature_selection import mutual_info_classif
from sklearn.linear_model import LogisticRegression
from sklearn.preprocessing import StandardScaler
from sklearn.pipeline import make_pipeline
from sklearn.model_selection import cross_val_score

data = load_breast_cancer()           # 569 real tumor records, 30 features
X, y = data.data, data.target         # label: 1 = benign, 0 = malignant

# base rate + majority baseline (what any model must beat)
base_rate = y.mean()                                  # 0.627 (P benign)
majority = max(base_rate, 1 - base_rate)              # 0.627
print("base rate P(benign) =", round(float(base_rate), 3))
print("majority baseline   =", round(float(majority), 3))

# mutual information: which features carry signal about the label?
mi = mutual_info_classif(X, y, random_state=0)
order = np.argsort(mi)[::-1][:7]                       # top 7 candidates
for i in order:
    print(f"{data.feature_names[i]:<22} {mi[i]:.3f}")
# top 7 -> [0.473, 0.463, 0.454, 0.439, 0.437, 0.403, 0.375]

# does a 5-line baseline beat chance?
clf = make_pipeline(StandardScaler(), LogisticRegression(max_iter=5000))
print("logreg CV accuracy =", round(float(cross_val_score(clf, X, y, cv=5).mean()), 3))
# -> 0.981, well above the 0.627 majority baseline: signal is real`
  };
})();
