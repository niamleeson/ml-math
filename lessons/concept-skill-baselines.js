/* =====================================================================
   "Doing ML for Real" SKILL lesson — Building simple baselines first.
   Self-contained: registers the lesson, its CODE, and its CODEVIZ.
   ===================================================================== */
(function () {
  window.LESSONS.push({
    id: "skill-baselines",
    title: "Building simple baselines first",
    tagline: "Before any fancy model, beat the dumbest one — or you don't know if you've done anything.",
    module: "Doing ML for Real — the skills that matter",
    prereqs: ["ml-classification-metrics", "ml-logistic-regression", "ml-regression-metrics"],

    whenToUse:
      `<p><b>Reach for a baseline on the very first day of every modeling project, before you train anything you'd call a "model".</b> A baseline is a deliberately trivial predictor. Its job is to set the score that any real model must beat to be worth its complexity.</p>
       <p>Without one you are flying blind. "My model gets 92% accuracy" means nothing on its own. If always guessing the majority class also gets 92%, your model has learned <i>nothing</i> — but the number looks great, so it ships, and you find out in production.</p>
       <p><b>A baseline answers three questions at once:</b></p>
       <ul>
         <li><b>Is the signal even there?</b> If a trivial predictor already does well, the problem is easy (or leaking).</li>
         <li><b>How much did my model actually add?</b> The gap over the baseline — the <b>lift</b> — is the real measure of value.</li>
         <li><b>Is my pipeline wired correctly?</b> A baseline runs the full data-loading, split, and scoring path with near-zero model risk, so any wild number points at a plumbing bug.</li>
       </ul>`,

    playbook:
      `<ol>
         <li><b>Start with a TRIVIAL baseline — predict the constant.</b> For classification, always predict the majority (most-frequent) class with <code>DummyClassifier(strategy="most_frequent")</code>; also try <code>strategy="stratified"</code> (guess at random in proportion to class rates). For regression, predict the <b>mean</b> or <b>median</b> of the target with <code>DummyRegressor(strategy="mean")</code> (or <code>"median"</code>). This is the floor.</li>
         <li><b>Add a SIMPLE domain heuristic / rule.</b> Encode the one rule a human expert would use — "flag the transaction if amount &gt; $10,000", "predict churn if days-since-login &gt; 30". A good rule often beats the trivial baseline and tells you which feature carries the signal.</li>
         <li><b>Add a simple MODEL.</b> Fit <code>LogisticRegression</code> (classification) or <code>LinearRegression</code> / <code>Ridge</code> (regression) on the raw features. This is the strongest baseline that still costs almost nothing to train, debug, and explain.</li>
         <li><b>Use the right baseline for the data shape.</b> For <b>time series</b>, the baseline is <b>persistence (last-value)</b>: predict tomorrow = today (or last season for seasonal data). For <b>recommenders</b>, the baseline is <b>most-popular</b>: recommend the globally top items to everyone. Beating these is genuinely hard.</li>
         <li><b>Measure every fancy model as LIFT over these baselines.</b> Report the model's score <i>and</i> the baseline's score side by side, on the <i>same</i> test split and the <i>same</i> metric. The headline number is the lift, not the raw score.</li>
         <li><b>Only invest in complexity that clears the baseline by a margin that matters.</b> A gradient-boosted ensemble that beats logistic regression by 0.3% accuracy is rarely worth the serving cost, the latency, and the on-call burden. Make the margin justify the maintenance.</li>
       </ol>`,

    application:
      `<p>Every Kaggle leaderboard starts with a "benchmark" submission that is exactly a baseline. Every honest experiment-tracking dashboard (MLflow, Weights &amp; Biases) has a baseline row pinned at the top. Fraud, churn, ranking, forecasting, recommendation — each has its canonical baseline (rule, persistence, popularity) that new models are reported against. When a paper or a teammate quotes a raw score with <i>no baseline</i>, that is the first thing to ask for.</p>`,

    pitfalls:
      `<ul>
         <li><b>Skipping the baseline and over-crediting a complex model.</b> The tell: a slide that says "our model: 92%" with nothing to compare against. You cannot tell skill from luck or from an easy problem. Always show the baseline row.</li>
         <li><b>Comparing to nothing instead of the no-information rate.</b> "Better than chance" is meaningless if "chance" isn't defined. The honest bar is the <b>no-information rate</b> (the majority-class proportion), not 50%.</li>
         <li><b>A baseline that already nails it.</b> If a trivial predictor scores 0.99, be suspicious: the task is too easy, or — more likely — a feature is <b>leaking</b> the label (a column computed <i>after</i> the outcome). A baseline that's "too good" is a red flag, not a victory.</li>
         <li><b>Reporting accuracy on imbalanced data where the majority baseline already looks great.</b> On a 99%/1% split, predicting "always negative" scores 99% accuracy and catches zero positives. Switch to <b>balanced accuracy</b>, precision/recall, or AUC (Area Under the Curve) so the majority baseline can't masquerade as a good model.</li>
         <li><b>Comparing on different splits or metrics.</b> Baseline scored on one fold, model on another — the lift is noise. Use the same <code>train_test_split</code> / cross-validation folds and the same scorer for both.</li>
       </ul>`,

    checklist:
      `<ul>
         <li>☐ Did I compute the <b>no-information rate</b> (majority-class proportion) and write it down before training anything?</li>
         <li>☐ Did I fit a <b>trivial baseline</b> — <code>DummyClassifier(most_frequent)</code> or <code>DummyRegressor(mean/median)</code>?</li>
         <li>☐ Did I add the <b>obvious domain rule</b> a human would use, and a <b>simple model</b> (logistic / linear regression)?</li>
         <li>☐ For time series, is my baseline <b>last-value persistence</b>? For recommenders, is it <b>most-popular</b>?</li>
         <li>☐ Is every fancy model reported as <b>lift over the baseline</b>, on the <i>same split</i> and <i>same metric</i>?</li>
         <li>☐ On imbalanced data, am I using a metric (<b>balanced accuracy</b>, AUC, F1) the majority baseline <i>cannot</i> game?</li>
         <li>☐ Is any baseline suspiciously good? If so, did I check for <b>label leakage</b> before celebrating?</li>
         <li>☐ Does the lift clear a margin that <b>justifies the added complexity</b> in serving, latency, and maintenance?</li>
       </ul>`,

    bigIdea:
      `<p>A baseline is the dumbest predictor that still respects the problem. It ignores the features (or uses one obvious rule) and just guesses.</p>
       <p>Its whole purpose is to be the <b>yardstick</b>. The number you should care about is not your model's score — it is how far your model rises <i>above</i> the baseline.</p>
       <p>That gap is called <b>lift</b>. No lift, no value, no matter how impressive the raw number looks.</p>`,

    buildup:
      `<p>The simplest classification baseline always predicts the most common class. On a dataset that is 63% class 1, that scores 63% accuracy by doing nothing.</p>
       <p>That 63% is the <b>no-information rate</b> (NIR): the accuracy you get with <i>no</i> information about the features.</p>
       <p>Any model worth keeping must beat the NIR by a margin that survives the noise in your test set.</p>`,

    symbols: [
      { sym: "$y_i$", desc: "the true label of example $i$ (e.g. 0 or 1 for a two-class problem)." },
      { sym: "$n$", desc: "the number of examples in the (test) set." },
      { sym: "$n_c$", desc: "how many examples belong to class $c$." },
      { sym: "$p_c$", desc: "the proportion of class $c$: $p_c = n_c / n$." },
      { sym: "$\\text{NIR}$", desc: "the no-information rate: the accuracy of always predicting the single most common class." },
      { sym: "$A_{\\text{model}}$", desc: "the accuracy (or other score) of the model being evaluated." },
      { sym: "$\\text{lift}$", desc: "how much the model beats the baseline — its real, comparable value." }
    ],

    formula: `$$ \\text{NIR}=\\max_{c}\\ p_c=\\max_{c}\\ \\frac{n_c}{n} \\qquad\\qquad \\text{lift}=A_{\\text{model}}-\\text{NIR} $$`,

    whatItDoes:
      `<p>The left formula is the <b>no-information rate</b>: take each class's share of the data $p_c=n_c/n$, and keep the largest. That is exactly what "always predict the majority class" scores, because it is right on every majority example and wrong on every other.</p>
       <p>The right formula is <b>lift</b>: subtract that floor from your model's accuracy. Lift is the honest, comparable measure of what the model added.</p>
       <p>Read together: a model at 64% accuracy on a dataset whose NIR is 63% has lift $\\approx 1\\%$ — it learned almost nothing, even though 64% "sounds" fine.</p>`,

    derivation:
      `<p><b>Why the majority class is the best you can do with no features.</b></p>
       <ul class="steps">
         <li>A no-information predictor must output the <i>same</i> guess for every example (it has nothing to tell them apart). Say it always guesses class $c$.</li>
         <li>Its accuracy is then the fraction of examples that actually are class $c$, which is $p_c = n_c/n$.</li>
         <li>To maximize accuracy, pick the $c$ with the largest $p_c$. That maximum is $\\text{NIR}=\\max_c p_c$. Any other constant guess scores lower. $\\blacksquare$</li>
       </ul>
       <p><b>Why baselines bound value and expose leakage.</b> A real model can only be <i>credited</i> with the lift above this floor — the floor is free. And because a no-information predictor <i>cannot</i> exceed $\\max_c p_c$, any baseline that scores far higher than the class balance can plausibly explain is getting information it shouldn't have: a leaked, post-outcome feature. So a "too-good" baseline is a leakage alarm, not a success.</p>`,

    example:
      `<p>Real numbers from the breast-cancer test split below: $n=171$ examples, with $n_0=64$ malignant and $n_1=107$ benign.</p>
       <ul class="steps">
         <li>Class shares: $p_0 = 64/171 = 0.374$, $p_1 = 107/171 = 0.626$.</li>
         <li>No-information rate: $\\text{NIR}=\\max(0.374,\\ 0.626)=0.626$. Always guessing "benign" is right 62.6% of the time.</li>
         <li>The <b>stratified</b> dummy (guess in proportion to the rates) actually scores <i>worse</i>, $\\approx 0.538$, because random proportional guessing wastes the majority advantage.</li>
         <li>Logistic regression on the scaled features scores $0.959$.</li>
         <li>Lift of logistic regression over the NIR: $0.959 - 0.626 = 0.333$ — a real, large gain. <i>That</i> is the number to report, not the bare 0.959.</li>
       </ul>`,

    practice: [
      {
        q: `A teammate is thrilled: their fraud classifier hits 98.7% accuracy. Fraud is 1.2% of all transactions. Are you impressed? What do you do next?`,
        steps: [
          { do: `Compute the no-information rate first.`, why: `Fraud is 1.2%, so "always predict not-fraud" is the majority baseline and scores 98.8% accuracy — already higher than the model's 98.7%.` },
          { do: `Switch metrics to recall / precision / AUC on the positive (fraud) class.`, why: `Accuracy is gamed by the 98.8% majority; only a metric that focuses on the rare positives shows whether any fraud is caught.` },
          { do: `Report lift over the baseline on that metric, not raw accuracy.`, why: `The honest question is how many frauds the model catches above zero, not the headline accuracy.` }
        ],
        answer: `<p>Not impressed: the model is <i>below</i> the 98.8% no-information rate, so it is worse than guessing "never fraud". Accuracy is the wrong metric on a 1.2% class. Re-evaluate with balanced accuracy / precision-recall / AUC, and report lift over the majority baseline.</p>`
      },
      {
        q: `You build the trivial and simple baselines for a churn problem. The mean/most-frequent dummy scores 0.71 accuracy; a logistic-regression baseline scores 0.995. Your real plan was a deep model. What is your next move?`,
        steps: [
          { do: `Treat the 0.995 logistic baseline as a red flag, not a win.`, why: `A linear model on raw features almost never nails a churn problem at 0.995 — that jump from 0.71 is too big to be honest signal.` },
          { do: `Audit features for label leakage.`, why: `A feature like "account_closed_date" or "final_invoice_sent" is computed after churn happens and leaks the label, inflating even a simple model.` },
          { do: `Remove leaked columns and re-baseline before touching the deep model.`, why: `If the leak inflated the baseline, it will inflate every model; the deep model's "great" score would be fiction too.` }
        ],
        answer: `<p>Stop and investigate leakage. A simple baseline at 0.995 is almost always a post-outcome feature sneaking the answer in. Find and drop the leaking columns, re-run the baselines, and only then judge whether the deep model adds real lift.</p>`
      }
    ]
  });

  window.CODE["skill-baselines"] = {
    lib: "scikit-learn",
    runnable: false,
    explain: `<p>Fit two trivial baselines (most-frequent and stratified dummies) and a logistic-regression baseline on the same split, then print each one's accuracy and balanced accuracy, plus the <b>lift</b> of logistic regression over the no-information rate. This is the report you should produce before training anything fancier.</p>`,
    code: `import numpy as np
from sklearn.datasets import load_breast_cancer
from sklearn.model_selection import train_test_split
from sklearn.dummy import DummyClassifier, DummyRegressor
from sklearn.linear_model import LogisticRegression
from sklearn.preprocessing import StandardScaler
from sklearn.pipeline import make_pipeline
from sklearn.metrics import accuracy_score, balanced_accuracy_score

X, y = load_breast_cancer(return_X_y=True)
Xtr, Xte, ytr, yte = train_test_split(
    X, y, test_size=0.3, random_state=0, stratify=y)

# 1) TRIVIAL baselines — they ignore the features entirely.
majority   = DummyClassifier(strategy="most_frequent").fit(Xtr, ytr)
stratified = DummyClassifier(strategy="stratified", random_state=0).fit(Xtr, ytr)

# (regression analogue, for reference — predict the mean / median target)
# DummyRegressor(strategy="mean").fit(Xtr, y_reg_tr)
# DummyRegressor(strategy="median").fit(Xtr, y_reg_tr)

# 2) SIMPLE-MODEL baseline — logistic regression on scaled raw features.
logreg = make_pipeline(
    StandardScaler(),
    LogisticRegression(max_iter=5000)).fit(Xtr, ytr)

# No-information rate = the majority-class proportion in the test set.
nir = max(np.mean(yte == 0), np.mean(yte == 1))

print(f"{'model':<22}{'accuracy':>10}{'bal_acc':>10}")
for name, m in [("majority dummy", majority),
                ("stratified dummy", stratified),
                ("logistic regression", logreg)]:
    p = m.predict(Xte)
    print(f"{name:<22}{accuracy_score(yte, p):>10.4f}"
          f"{balanced_accuracy_score(yte, p):>10.4f}")

print(f"\\nno-information rate (the bar to beat): {nir:.4f}")
print(f"lift of logistic regression over NIR : "
      f"{accuracy_score(yte, logreg.predict(Xte)) - nir:+.4f}")
# -> majority dummy       0.6257   0.5000
#    stratified dummy     0.5380   0.5084
#    logistic regression  0.9591   0.9579
#    NIR 0.6257  ->  lift +0.3333`
  };

  window.CODEVIZ["skill-baselines"] = {
    question: "On a real dataset, what is the accuracy each future model must beat — the floor set by the trivial and simple baselines?",
    charts: [{
      type: "bars",
      title: "Baselines on load_breast_cancer (test split): the bar every fancy model must clear",
      xlabel: "predictor",
      ylabel: "test accuracy",
      labels: ["majority dummy", "stratified dummy", "logistic regression", "no-info rate (NIR)"],
      values: [0.6257, 0.5380, 0.9591, 0.6257],
      valueLabels: ["0.626", "0.538", "0.959", "0.626"],
      colors: ["#ff7b72", "#ff7b72", "#7ee787", "#ffb454"]
    }],
    caption: "Real numbers from scikit-learn on the 569-record breast-cancer dataset (30% test split). The majority dummy scores 0.626 — exactly the no-information rate (orange line). The stratified dummy is worse (0.538). Logistic regression reaches 0.959, a lift of +0.333 over the NIR. Any future model must beat 0.626 to add anything, and must beat 0.959 to beat the cheap simple-model baseline.",
    code: `import numpy as np
from sklearn.datasets import load_breast_cancer
from sklearn.model_selection import train_test_split
from sklearn.dummy import DummyClassifier
from sklearn.linear_model import LogisticRegression
from sklearn.preprocessing import StandardScaler
from sklearn.pipeline import make_pipeline
from sklearn.metrics import accuracy_score

X, y = load_breast_cancer(return_X_y=True)      # 569 real tumor records
Xtr, Xte, ytr, yte = train_test_split(
    X, y, test_size=0.3, random_state=0, stratify=y)

majority   = DummyClassifier(strategy="most_frequent").fit(Xtr, ytr)
stratified = DummyClassifier(strategy="stratified", random_state=0).fit(Xtr, ytr)
logreg     = make_pipeline(StandardScaler(),
                           LogisticRegression(max_iter=5000)).fit(Xtr, ytr)

nir = max(np.mean(yte == 0), np.mean(yte == 1))
vals = [accuracy_score(yte, majority.predict(Xte)),    # 0.6257
        accuracy_score(yte, stratified.predict(Xte)),  # 0.5380
        accuracy_score(yte, logreg.predict(Xte)),      # 0.9591
        nir]                                           # 0.6257
print([round(v, 4) for v in vals])`
  };
})();
