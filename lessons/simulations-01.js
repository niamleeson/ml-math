/* Mock ML-engineering "lab" scenarios. Merged into window.SIMULATIONS by application id.
   { title, icon, goal, stages:[ { phase, icon, title, narrative(HTML), concepts:[lessonIds],
     steps:[ {type:"decide", prompt, options:[{label, feedback, best?}]} | {type:"run", label, prompt?, result:{log?, metrics?:[{k,v}], note?}} ] } ] } */
window.SIMULATIONS = Object.assign(window.SIMULATIONS || {}, {
  "fraud-anomaly": {
    title: "Fraud Detection",
    icon: "🚨",
    goal: "Catch fraudulent card transactions in real time — without blocking real customers.",
    stages: [
      {
        phase: "Frame", icon: "🎯", title: "Frame the problem",
        narrative: `<p>You work at a payments company. ~$0.3\\%$ of transactions are fraud. Blocking a good customer costs trust; missing fraud costs money. First decide what "good" even means here.</p>`,
        concepts: ["ml-classification-metrics", "ml-roc-auc", "prob-bayes"],
        steps: [{
          type: "decide", prompt: "Which objective fits a 0.3%-positive problem?",
          options: [
            { label: "Maximize accuracy", feedback: "a model that flags nothing already scores 99.7% accuracy. Accuracy is useless when classes are this imbalanced." },
            { label: "Maximize recall at a fixed precision (e.g. catch as much fraud as possible while keeping ≥90% of flags correct)", best: true, feedback: "this balances catching fraud against false alarms — the real business trade-off. You'll tune the threshold for it later." },
            { label: "Minimize mean-squared error", feedback: "that's a regression loss; this is a classification (fraud / not) problem." }
          ]
        }]
      },
      {
        phase: "Data", icon: "🗄️", title: "Gather the data",
        narrative: `<p>You need labeled history. Where do the labels come from?</p>`,
        concepts: ["ml-supervised", "prob-sample-space"],
        steps: [
          { type: "decide", prompt: "How will you label transactions as fraud?",
            options: [
              { label: "Use confirmed chargebacks + customer disputes as positives", best: true, feedback: "these are ground-truth fraud signals. Note the label lag — disputes arrive weeks later." },
              { label: "Label anything a rule flagged as fraud", feedback: "that just teaches the model to imitate your old rules, inheriting their blind spots." },
              { label: "Have analysts hand-label everything", feedback: "accurate but far too slow and expensive for millions of transactions." }
            ] },
          { type: "run", label: "▶ Pull 1,000,000 transactions", prompt: "Pull a labeled sample from the warehouse.",
            result: { log: "querying warehouse...\nloaded 1,000,000 rows x 42 columns\nfraud positives: 3,021  (0.302%)\njoined chargeback labels (label lag: 18 days avg)", metrics: [{ k: "rows", v: "1.0M" }, { k: "fraud rate", v: "0.30%" }, { k: "features", v: "42" }] } }
        ]
      },
      {
        phase: "Explore", icon: "🔍", title: "Explore & clean",
        narrative: `<p>Before modeling, look at the data. Severe imbalance and leakage are the usual traps.</p>`,
        concepts: ["prob-variance", "ml-classification-metrics", "mlx-error-analysis"],
        steps: [
          { type: "run", label: "▶ Profile the dataset", result: { log: "missing values: merchant_zip 4.1%, device_id 11.7%\nclass balance: 332:1 (neg:pos)\nfound column 'is_disputed' -> PERFECT correlation with label (LEAKAGE)\namount: heavy right tail (max $48,200)", metrics: [{ k: "imbalance", v: "332:1" }, { k: "leaky cols", v: "1" }] } },
          { type: "decide", prompt: "'is_disputed' predicts the label almost perfectly. What is it?",
            options: [
              { label: "A great feature — keep it", feedback: "it's only known AFTER fraud is reported, so it can't exist at prediction time. Using it = target leakage and a model that fails in production." },
              { label: "Target leakage — drop it", best: true, feedback: "exactly. Any feature unavailable at scoring time must go, or your offline metrics will be a fantasy." }
            ] }
        ]
      },
      {
        phase: "Features", icon: "🧬", title: "Engineer features",
        narrative: `<p>Raw columns rarely separate fraud. Build features that capture <i>unusual</i> behavior.</p>`,
        concepts: ["fnd-norm", "prob-conditional-expectation", "dl-cosine-similarity"],
        steps: [{
          type: "decide", prompt: "Which feature set will help most?",
          options: [
            { label: "Velocity (txns/hour), amount z-score vs the user's history, device-match flag", best: true, feedback: "these encode 'this is abnormal for THIS user' — exactly what anomaly detection needs. The z-score is $\\frac{x-\\mu}{\\sigma}$ per customer." },
            { label: "The raw 16-digit card number as a number", feedback: "high-cardinality and meaningless as a magnitude — pure noise (and a privacy risk)." },
            { label: "Just the transaction amount", feedback: "a $5,000 charge is normal for some users, fraud for others. Without per-user context it's weak." }
          ]
        }]
      },
      {
        phase: "Model", icon: "🧠", title: "Pick a model",
        narrative: `<p>Tabular data, mixed feature types, non-linear interactions, needs to be fast to score. What model?</p>`,
        concepts: ["cls-gradient-boosting", "ml-trees", "cls-anomaly"],
        steps: [{
          type: "decide", prompt: "Choose a first model.",
          options: [
            { label: "Gradient-boosted trees (XGBoost / LightGBM)", best: true, feedback: "the workhorse for tabular fraud: handles non-linearities and interactions, robust to scaling, fast to serve, and gives feature importances." },
            { label: "A deep neural network", feedback: "rarely beats boosting on tabular data, needs far more data/tuning, and is slower to serve. Maybe later." },
            { label: "Plain logistic regression", feedback: "a fine baseline, but it misses the non-linear interactions that distinguish fraud. Good as a sanity check." }
          ]
        }]
      },
      {
        phase: "Train", icon: "⚙️", title: "Train it",
        narrative: `<p>Fit the model with class weights (to fight imbalance) and regularization (to avoid overfitting rare fraud patterns).</p>`,
        concepts: ["ml-gradient-descent", "ml-regularization", "cls-gradient-boosting"],
        steps: [{
          type: "run", label: "▶ Train LightGBM (scale_pos_weight=332)",
          result: { log: "training gradient-boosted trees...\n[50]  train auc 0.971  valid auc 0.958\n[150] train auc 0.989  valid auc 0.971\n[300] train auc 0.997  valid auc 0.972  (early stop: valid plateaued)\nbest iteration: 214", metrics: [{ k: "valid AUC", v: "0.972" }, { k: "trees", v: "214" }] } }
        ]
      },
      {
        phase: "Evaluate", icon: "📊", title: "Evaluate honestly",
        narrative: `<p>AUC looks great, but you ship a <i>threshold</i>, not an AUC. Check precision and recall where you'd actually operate.</p>`,
        concepts: ["ml-roc-auc", "ml-classification-metrics", "prob-bayes"],
        steps: [
          { type: "run", label: "▶ Evaluate on a fresh holdout", result: { log: "holdout: 200,000 txns, 604 fraud\nAUC 0.969\n@ threshold 0.5 -> precision 0.34, recall 0.82  (too many false alarms)\n@ threshold 0.9 -> precision 0.91, recall 0.61", metrics: [{ k: "AUC", v: "0.969" }, { k: "prec@0.9", v: "0.91" }, { k: "recall@0.9", v: "0.61" }] } },
          { type: "decide", prompt: "Which operating point matches the goal (≥90% precision)?",
            options: [
              { label: "Threshold 0.9 — precision 0.91, recall 0.61", best: true, feedback: "meets the precision target and still catches 61% of fraud. Raising recall further would flood analysts with false positives." },
              { label: "Threshold 0.5 — recall 0.82", feedback: "catches more fraud but precision 0.34 means 2 of every 3 alerts are wrong — analysts will drown and customers get blocked." }
            ] }
        ]
      },
      {
        phase: "Iterate", icon: "🔁", title: "Diagnose & iterate",
        narrative: `<p>A week later, a new fraud ring slips through. Recall on the new pattern is poor. What's the right fix?</p>`,
        concepts: ["ml-bias-variance", "mlx-error-analysis", "mlx-cross-validation"],
        steps: [{
          type: "decide", prompt: "The model misses a brand-new fraud pattern. Best response?",
          options: [
            { label: "Do error analysis on the misses, add features that capture the new behavior, and retrain", best: true, feedback: "the misses share a signal the model never saw (e.g. a new device pattern). New features + fresh labels close the gap — this is the iterate loop." },
            { label: "Just lower the threshold globally", feedback: "that raises recall everywhere but tanks precision — you'd block tons of good customers to catch one ring." },
            { label: "Add more trees", feedback: "more capacity won't help if the signal isn't in the features. This is a data/feature gap, not a bias-from-underfitting gap." }
          ]
        }]
      },
      {
        phase: "Deploy", icon: "🚀", title: "Deploy to production",
        narrative: `<p>Fraud must be caught <i>before</i> the charge clears, so latency matters. How do you serve it?</p>`,
        concepts: ["ml-classification-metrics", "cls-gradient-boosting"],
        steps: [
          { type: "decide", prompt: "How should the model run?",
            options: [
              { label: "A real-time scoring service behind the checkout (sub-100ms), with a canary rollout", best: true, feedback: "fraud decisions are needed inline at authorization. Canary to 1% first so a bad model can't take down payments." },
              { label: "A nightly batch job", feedback: "by morning the fraud has already cleared. Batch is fine for reporting, not for blocking live charges." }
            ] },
          { type: "run", label: "▶ Ship (canary 1% → 100%)", result: { log: "deploying model v1 ...\ncanary 1%: p99 latency 41ms, error rate 0.0%\nshadow agreement with rules: 93%\npromoting to 100% ...\nlive.", metrics: [{ k: "p99 latency", v: "41ms" }, { k: "rollout", v: "100%" }] } }
        ]
      },
      {
        phase: "Monitor", icon: "📡", title: "Monitor & maintain (MLOps)",
        narrative: `<p>Models rot. Fraud adapts, data pipelines drift. You need eyes on it.</p>`,
        concepts: ["prob-clt", "ml-roc-auc", "mlx-error-analysis"],
        steps: [
          { type: "decide", prompt: "What should you monitor in production?",
            options: [
              { label: "Score distribution drift, live precision/recall (as labels arrive), feature-null rates, and latency — with alerts", best: true, feedback: "track inputs (drift), outputs (score shift), and outcomes (precision as chargebacks land). Alert when any moves. This is the heart of MLOps." },
              { label: "Nothing — it passed evaluation", feedback: "guaranteed silent failure. Fraud patterns and upstream data both change; an unwatched model quietly decays." }
            ] },
          { type: "run", label: "▶ Check this week's monitors", result: { log: "feature 'device_id' null-rate: 11.7% -> 38% (pipeline change upstream!)\nscore mean drifted +0.07\nprecision (last 7d): 0.91 -> 0.84  ALERT\naction: open incident, patch feature pipeline, schedule retrain on recent data", metrics: [{ k: "precision", v: "0.84 ⚠" }, { k: "drift", v: "detected" }] }, note: `The loop closes here: monitoring caught a pipeline break, which triggers a retrain — back to the <b>Data</b> stage. That's the real job.` }
        ]
      }
    ]
  }
});

window.SIMULATIONS = Object.assign(window.SIMULATIONS, {
  "credit-risk": {
    title: "Credit Scoring & Risk",
    icon: "💳",
    goal: "Decide who gets a loan — approve good borrowers, deny likely defaults, and stay fair and explainable to regulators.",
    stages: [
      {
        phase: "Frame", icon: "🎯", title: "Frame the problem",
        narrative: `<p>You build the underwriting model at a lender. Each application is a repay-or-default bet, $y\\in\\{0,1\\}$. Denying a good borrower loses revenue; approving a defaulter loses principal. Decide what the model should output.</p>`,
        concepts: ["prob-bernoulli-binomial", "ml-classification-metrics", "ml-supervised"],
        steps: [{
          type: "decide", prompt: "What should the model produce?",
          options: [
            { label: "A calibrated probability of default (PD) you can turn into a price and a cutoff", best: true, feedback: "default is a Bernoulli event, so a well-calibrated $P(\\text{default})$ lets you set interest rates AND an approve/deny threshold by expected loss." },
            { label: "A hard approve/deny label only", feedback: "throwing away the probability loses the risk-based pricing and the ability to move the cutoff as the economy shifts." },
            { label: "A dollar amount of expected revenue", feedback: "that's a downstream calculation; the core uncertain quantity is the probability of default, which you'd need first anyway." }
          ]
        }]
      },
      {
        phase: "Data", icon: "🗄️", title: "Gather the data",
        narrative: `<p>You need past loans with known outcomes. But a loan's outcome isn't known until it matures — and you only see applicants you <i>approved</i>.</p>`,
        concepts: ["ml-supervised", "ml-likelihood"],
        steps: [
          { type: "decide", prompt: "How do you build labels for 'defaulted'?",
            options: [
              { label: "Use loans booked 24+ months ago, labeling 90+ days delinquent as default", best: true, feedback: "you need a full performance window so the outcome is actually observed. Recent loans are still maturing and would be mislabeled 'good'." },
              { label: "Label any loan currently 1+ day late as default", feedback: "a one-day slip is not a default; this floods you with false positives and a meaningless target." },
              { label: "Use only loans from the last 3 months for freshness", feedback: "almost none have had time to default yet — the label is censored and the model learns nothing about risk." }
            ] },
          { type: "run", label: "▶ Pull matured loan book", prompt: "Pull approved loans with a full performance window.",
            result: { log: "querying loan warehouse...\nloaded 480,000 booked loans x 96 columns\nwindow: booked 2022-2024, 24mo performance\ndefault rate (90+ dpd): 6.8%\nNOTE: only APPROVED applicants present (rejected applicants unobserved)", metrics: [{ k: "loans", v: "480K" }, { k: "default rate", v: "6.8%" }, { k: "features", v: "96" }] } }
        ]
      },
      {
        phase: "Explore", icon: "🔍", title: "Explore & clean",
        narrative: `<p>Look hard for leakage and selection bias before modeling. Credit data is full of fields that only exist <i>after</i> a decision.</p>`,
        concepts: ["ml-classification-metrics", "mlx-error-analysis"],
        steps: [
          { type: "run", label: "▶ Profile the data", result: { log: "missing: employment_length 14%, bureau_score 2.1%\nfound 'recovery_amount' -> nonzero ONLY for defaults (LEAKAGE)\nfound 'collections_calls' -> populated post-booking (LEAKAGE)\nclass balance 13.7:1 (good:default)\nreject inference gap: model only sees approved population", metrics: [{ k: "imbalance", v: "13.7:1" }, { k: "leaky cols", v: "2" }] } },
          { type: "decide", prompt: "'recovery_amount' is a strong predictor of default. Keep it?",
            options: [
              { label: "Keep it — it's highly predictive", feedback: "it only gets populated AFTER a loan defaults and goes to collections. At scoring time it's always zero, so it's pure target leakage." },
              { label: "Drop it (and other post-decision fields)", best: true, feedback: "right — only features available at application time may be used. Post-booking fields make offline AUC look magical and then collapse live." }
            ] }
        ]
      },
      {
        phase: "Features", icon: "🧬", title: "Engineer features",
        narrative: `<p>Build features that are predictive, available at application, and explainable — adverse-action notices must cite real reasons.</p>`,
        concepts: ["fnd-norm", "ml-regularization"],
        steps: [{
          type: "decide", prompt: "Which feature set is best for a regulated scorecard?",
          options: [
            { label: "Debt-to-income ratio, bureau score, utilization, delinquency count, length of credit history", best: true, feedback: "all available at application, all causally tied to repayment, and all explainable in an adverse-action notice. Normalizing them as $\\frac{x-\\mu}{\\sigma}$ keeps coefficients comparable." },
            { label: "Applicant ZIP code and a 'neighborhood quality' index", feedback: "proxies for protected attributes (race) — a fair-lending violation and a legal landmine, even if predictive." },
            { label: "Raw account numbers and the loan officer's name", feedback: "high-cardinality identifiers with no causal link to repayment; pure noise and overfitting risk." }
          ]
        }]
      },
      {
        phase: "Model", icon: "🧠", title: "Pick a model",
        narrative: `<p>You need accuracy, but regulators demand you can explain every decision. There's a real tension here.</p>`,
        concepts: ["ml-logistic-regression", "ml-glm", "cls-gradient-boosting"],
        steps: [{
          type: "decide", prompt: "Choose the modeling approach.",
          options: [
            { label: "A regularized logistic-regression scorecard as the system of record, with a boosted-tree challenger monitored alongside", best: true, feedback: "logistic regression (a GLM) is monotonic, auditable, and trivially explainable for adverse-action; the boosted-tree challenger shows how much accuracy you're leaving on the table." },
            { label: "A deep neural net, because accuracy is everything", feedback: "in lending, an unexplainable decision can be illegal. Raw AUC is worthless if you can't tell a denied applicant why." },
            { label: "A single deep decision tree, unpruned", feedback: "it overfits badly and its many splits are hard to defend; a regularized linear scorecard generalizes and explains better." }
          ]
        }]
      },
      {
        phase: "Train", icon: "⚙️", title: "Train it",
        narrative: `<p>Fit the scorecard by maximum likelihood with L2 regularization, then check the challenger.</p>`,
        concepts: ["ml-likelihood", "ml-regularization", "ml-gradient-descent"],
        steps: [{
          type: "run", label: "▶ Fit logistic scorecard + GBM challenger",
          result: { log: "fitting logistic regression (L2, MLE)...\nconverged in 38 iterations, log-loss 0.214\nvalid AUC (scorecard): 0.781\ntraining GBM challenger...\nvalid AUC (challenger): 0.823  (+4.2 pts)\nall coefficients monotonic & signed as expected", metrics: [{ k: "scorecard AUC", v: "0.781" }, { k: "challenger AUC", v: "0.823" }] } }
        ]
      },
      {
        phase: "Evaluate", icon: "📊", title: "Evaluate honestly",
        narrative: `<p>You ship a cutoff, not an AUC. Check the approve/deny trade-off at a business-realistic threshold, and check calibration since you price off the probability.</p>`,
        concepts: ["ml-roc-auc", "ml-classification-metrics", "ml-likelihood"],
        steps: [
          { type: "run", label: "▶ Evaluate on out-of-time holdout", result: { log: "out-of-time holdout: 60,000 loans (booked after training cutoff)\nAUC 0.776\ncalibration: predicted PD vs actual within 1.2% per decile (good)\n@ approve if PD &lt; 0.10 -> approval 71%, bad-rate among approved 3.1%\n@ approve if PD &lt; 0.20 -> approval 88%, bad-rate among approved 5.9%", metrics: [{ k: "AUC", v: "0.776" }, { k: "approval@0.10", v: "71%" }, { k: "bad-rate", v: "3.1%" }] } },
          { type: "decide", prompt: "Risk appetite caps the approved-book bad-rate at 4%. Which cutoff?",
            options: [
              { label: "Approve if PD &lt; 0.10 — 71% approval, 3.1% bad-rate", best: true, feedback: "it stays under the 4% loss ceiling. The looser cutoff approves more volume but blows past risk appetite at 5.9%." },
              { label: "Approve if PD &lt; 0.20 — 88% approval", feedback: "more volume, but a 5.9% bad-rate breaches the 4% cap and the portfolio loses money." }
            ] }
        ]
      },
      {
        phase: "Iterate", icon: "🔁", title: "Diagnose & iterate",
        narrative: `<p>The challenger beats the scorecard by 4 points, but a fairness audit flags it: approval rates differ sharply across a protected group at the same risk level. What now?</p>`,
        concepts: ["ml-bias-variance", "mlx-error-analysis", "mlx-cross-validation"],
        steps: [{
          type: "decide", prompt: "The high-AUC challenger shows disparate impact. Best response?",
          options: [
            { label: "Trace which features drive the disparity, remove the proxies, and re-fit — re-validate fairness with cross-validation before shipping", best: true, feedback: "do error analysis on the gap, strip the proxy variables for protected attributes, and confirm the fix holds out-of-fold. Accuracy can't come from an illegal feature." },
            { label: "Ship it anyway — it has the best AUC", feedback: "disparate impact is a regulatory violation regardless of accuracy; this exposes the lender to legal action." },
            { label: "Add an explicit per-group cutoff to equalize approvals", feedback: "using the protected attribute directly in the decision is disparate treatment — also illegal. Fix the features, not the cutoff." }
          ]
        }]
      },
      {
        phase: "Deploy", icon: "🚀", title: "Deploy to production",
        narrative: `<p>Underwriting decisions happen at application time and must be reproducible and documented for audit.</p>`,
        concepts: ["ml-logistic-regression", "ml-classification-metrics"],
        steps: [
          { type: "decide", prompt: "How should the model go live?",
            options: [
              { label: "Real-time scoring at application, with reason codes returned per decision and the model version logged for every score", best: true, feedback: "applicants need an instant decision and a legally-required adverse-action reason; version logging makes every past decision auditable and reproducible." },
              { label: "Score in a weekly batch and mail decisions later", feedback: "applicants expect a near-instant decision and competitors offer one; weekly batch loses the business." }
            ] },
          { type: "run", label: "▶ Ship scorecard v1 (shadow → live)", result: { log: "deploying scorecard v1...\nshadow run vs current policy: 94% decision agreement\nreason codes generated for 100% of denials\nmodel card + feature lineage filed for audit\npromoting to live underwriting.", metrics: [{ k: "agreement", v: "94%" }, { k: "reason codes", v: "100%" }] } }
        ]
      },
      {
        phase: "Monitor", icon: "📡", title: "Monitor & maintain (MLOps)",
        narrative: `<p>Credit models decay slowly and silently — the economy shifts, and default labels arrive 1-2 years late. You must watch leading indicators, not just outcomes.</p>`,
        concepts: ["mlx-error-analysis", "ml-roc-auc"],
        steps: [
          { type: "decide", prompt: "What do you monitor for a model whose true labels lag 18 months?",
            options: [
              { label: "Population stability of inputs/scores (PSI), early-delinquency rates as a leading proxy, approval mix, and calibration as labels mature", best: true, feedback: "you can't wait 18 months to notice decay, so track input drift (PSI) and early-payment defaults now, then confirm with full bad-rate as labels land." },
              { label: "Just wait for the final 90+ dpd outcomes before reacting", feedback: "by then 18 months of bad loans are already booked. Leading indicators let you react early." }
            ] },
          { type: "run", label: "▶ Check this quarter's monitors", result: { log: "PSI on 'utilization': 0.09 -> 0.27 (population shift: rates rose)\nscore mean drifted -0.05 toward higher risk\nearly-delinquency (3mo) on new book: 1.8% -> 2.6% ALERT\naction: open review, recalibrate cutoff, schedule refit on recent vintages", metrics: [{ k: "PSI", v: "0.27 ⚠" }, { k: "early-delinq", v: "2.6% ⚠" }] }, note: `Rising rates shifted the applicant pool. Monitoring caught it via PSI and early delinquency before the full default labels arrive — triggering a recalibration back at the <b>Data</b> stage.` }
        ]
      }
    ]
  },
  "spam-moderation": {
    title: "Spam & Content Moderation",
    icon: "🛡️",
    goal: "Block spam and abuse at scale — without silencing real users or letting adversaries route around you.",
    stages: [
      {
        phase: "Frame", icon: "🎯", title: "Frame the problem",
        narrative: `<p>You run the spam filter for a messaging platform. A false ban silences a real person; a miss lets scams through. With adversaries actively probing you, this is a moving target, not a static dataset.</p>`,
        concepts: ["ml-classification-metrics", "prob-bayes", "ml-supervised"],
        steps: [{
          type: "decide", prompt: "What objective fits content moderation?",
          options: [
            { label: "High recall on spam at a precision floor that keeps false bans rare, with a human-review queue for the gray zone", best: true, feedback: "you must catch spam aggressively but a wrongly-banned real user is a serious harm — so cap false positives and route uncertain cases to humans." },
            { label: "Maximize raw accuracy", feedback: "if spam is a small slice of traffic, a 'never spam' classifier scores high accuracy while letting everything through. Useless here." },
            { label: "Block anything that looks even slightly unusual", feedback: "that maximizes recall by destroying precision — you'd ban huge numbers of legitimate users and lose trust." }
          ]
        }]
      },
      {
        phase: "Data", icon: "🗄️", title: "Gather the data",
        narrative: `<p>You need labeled spam vs ham. Labels come from user reports, human moderators, and confirmed takedowns — each with its own bias.</p>`,
        concepts: ["ml-supervised", "prob-bayes"],
        steps: [
          { type: "decide", prompt: "How do you build a trustworthy training label?",
            options: [
              { label: "Combine confirmed moderator takedowns (high precision) with user reports as weak signals, holding out a clean human-audited test set", best: true, feedback: "moderator decisions are ground truth; user reports are noisy and gameable, so treat them as weak labels and audit the test set by hand." },
              { label: "Treat every user report as spam", feedback: "users mass-report rivals and content they dislike; this teaches the model to ban unpopular-but-legitimate speech." },
              { label: "Label spam only from messages your old keyword filter already caught", feedback: "that just clones the old filter's blind spots — the model never learns to catch what the keywords miss." }
            ] },
          { type: "run", label: "▶ Pull labeled message sample", prompt: "Pull a labeled spam/ham sample.",
            result: { log: "sampling message stream...\nloaded 2,400,000 messages\nconfirmed-takedown spam: 168,000 (7.0%)\nuser-reported (weak): 410,000\nheld out 50,000 human-audited messages as gold test set\nlanguages: 31 (en 62%)", metrics: [{ k: "messages", v: "2.4M" }, { k: "spam rate", v: "7.0%" }, { k: "languages", v: "31" }] } }
        ]
      },
      {
        phase: "Explore", icon: "🔍", title: "Explore & clean",
        narrative: `<p>Text data hides subtle leakage: timing artifacts, duplicated campaigns, and label noise from the weak signals.</p>`,
        concepts: ["mlx-error-analysis", "ml-classification-metrics"],
        steps: [
          { type: "run", label: "▶ Profile the corpus", result: { log: "duplicate spam campaigns: 22% of spam are near-identical blasts\nfeature 'was_auto_removed' present -> set by the OLD filter (LEAKAGE)\nuser-report label noise: ~9% disagree with moderator audit\nham skews longer; spam skews short + many links", metrics: [{ k: "dup spam", v: "22%" }, { k: "label noise", v: "9%" }] } },
          { type: "decide", prompt: "22% of spam rows are near-duplicate blasts from the same campaigns. What's the risk?",
            options: [
              { label: "Naively splitting train/test lets identical messages land in both — leaking and inflating your score", best: true, feedback: "near-duplicates across the split mean the model memorizes campaigns instead of generalizing. Dedupe and split by campaign/sender so test spam is truly unseen." },
              { label: "Nothing — more spam examples is always better", feedback: "duplicates don't add information and, worse, leak across the split so offline metrics overstate real performance." }
            ] }
        ]
      },
      {
        phase: "Features", icon: "🧬", title: "Engineer features",
        narrative: `<p>Turn raw text into signal. Classic spam filtering is built on word probabilities, but meaning and context matter for abuse.</p>`,
        concepts: ["ml-naive-bayes", "dl-word-embeddings"],
        steps: [{
          type: "decide", prompt: "Which representation should you start with?",
          options: [
            { label: "TF-IDF word/char n-grams (great Naive-Bayes baseline) plus embedding vectors for semantic abuse, with link/sender metadata", best: true, feedback: "n-grams give a fast, interpretable Bayes baseline scoring word probabilities; embeddings catch paraphrased abuse that swaps words; metadata catches blast patterns." },
            { label: "Only the message length and number of emojis", feedback: "trivially gamed and far too coarse — spammers just pad text to mimic ham length." },
            { label: "The raw unicode bytes fed directly to a linear model", feedback: "no useful structure; you lose the word-level statistics that make spam filtering work." }
          ]
        }]
      },
      {
        phase: "Model", icon: "🧠", title: "Pick a model",
        narrative: `<p>You need a fast first line that scores millions of messages cheaply, plus depth for cleverly-disguised abuse.</p>`,
        concepts: ["ml-naive-bayes", "ml-logistic-regression", "mod-transformer"],
        steps: [{
          type: "decide", prompt: "Choose a model stack.",
          options: [
            { label: "A cheap linear/Naive-Bayes first filter for obvious spam, escalating the uncertain middle to a transformer abuse classifier", best: true, feedback: "a tiered stack scores the easy 90% cheaply and spends expensive transformer compute only on the hard, context-dependent cases — best cost/accuracy trade-off at scale." },
            { label: "Run the largest transformer on every single message", feedback: "correct but far too expensive and slow for millions of messages a minute; you'd burn the compute budget on obvious spam." },
            { label: "Keyword blocklist only", feedback: "spammers trivially evade fixed keywords with misspellings and homoglyphs; you need a learned model." }
          ]
        }]
      },
      {
        phase: "Train", icon: "⚙️", title: "Train it",
        narrative: `<p>Train the linear filter on n-grams and fine-tune the transformer on the hard cases, using campaign-grouped splits.</p>`,
        concepts: ["ml-logistic-regression", "ml-gradient-descent", "mod-transformer"],
        steps: [{
          type: "run", label: "▶ Train tiered stack",
          result: { log: "training NB/logistic first-stage on TF-IDF...\nfirst-stage valid AUC 0.951, covers 88% of traffic confidently\nfine-tuning transformer on the uncertain 12%...\nsecond-stage valid F1 0.88 on hard abuse\ncampaign-grouped split (no leakage)", metrics: [{ k: "stage-1 AUC", v: "0.951" }, { k: "stage-2 F1", v: "0.88" }] } }
        ]
      },
      {
        phase: "Evaluate", icon: "📊", title: "Evaluate honestly",
        narrative: `<p>Evaluate on the hand-audited gold set, and pick an operating point that keeps wrongful bans rare.</p>`,
        concepts: ["ml-classification-metrics", "ml-roc-auc"],
        steps: [
          { type: "run", label: "▶ Evaluate on the gold test set", result: { log: "gold set: 50,000 human-audited messages, 7.1% spam\nAUC 0.972\n@ threshold 0.5 -> precision 0.86, recall 0.93 (false-ban rate 0.7%)\n@ threshold 0.8 -> precision 0.97, recall 0.81 (false-ban rate 0.1%)", metrics: [{ k: "AUC", v: "0.972" }, { k: "prec@0.8", v: "0.97" }, { k: "false-ban@0.8", v: "0.1%" }] } },
          { type: "decide", prompt: "Auto-ban requires a very low false-ban rate; everything else goes to human review. Pick the auto-ban threshold.",
            options: [
              { label: "Auto-ban at 0.8 (precision 0.97), send 0.5-0.8 to human review", best: true, feedback: "the 0.1% false-ban rate is safe to act on automatically; the lower-confidence band gets a human, balancing safety and coverage." },
              { label: "Auto-ban everything above 0.5", feedback: "a 0.7% false-ban rate at scale means tens of thousands of wrongly-banned real users per day — unacceptable to act on without review." }
            ] }
        ]
      },
      {
        phase: "Iterate", icon: "🔁", title: "Diagnose & iterate",
        narrative: `<p>Two weeks in, recall on a new scam wave drops: spammers now insert zero-width characters and homoglyphs (e.g. Cyrillic letters) to dodge your n-grams. Adversarial drift.</p>`,
        concepts: ["ml-bias-variance", "mlx-error-analysis", "dl-word-embeddings"],
        steps: [{
          type: "decide", prompt: "The model misses obfuscated spam. Best fix?",
          options: [
            { label: "Normalize text (strip zero-width, map homoglyphs), add char-level and embedding features robust to spelling tricks, then retrain on the new examples", best: true, feedback: "this is adversarial drift, not underfitting. Canonicalize the input and add features that survive obfuscation so the same trick can't repeat." },
            { label: "Lower the ban threshold globally", feedback: "that bans more real users to catch the new trick; precision collapses and the evasion still adapts." },
            { label: "Add more transformer layers", feedback: "extra capacity won't read characters the tokenizer never saw cleanly — the fix is input normalization and new features, not size." }
          ]
        }]
      },
      {
        phase: "Deploy", icon: "🚀", title: "Deploy to production",
        narrative: `<p>Moderation runs inline on the message path at huge volume, so latency and cost per message are hard constraints.</p>`,
        concepts: ["ml-classification-metrics", "mod-transformer"],
        steps: [
          { type: "decide", prompt: "How should the stack serve?",
            options: [
              { label: "Inline cheap first-stage on every message; async transformer + human review only for the uncertain band; canary new models in shadow first", best: true, feedback: "keep the hot path cheap and fast, spend big compute only where needed, and shadow-test new models so a regression can't silence users overnight." },
              { label: "Synchronously run the transformer on every message before delivery", feedback: "adds latency to every message and costs far too much at platform scale; users would see delivery lag." }
            ] },
          { type: "run", label: "▶ Ship (shadow → canary → live)", result: { log: "deploying moderation stack v2...\nshadow: agreement with v1 96%, catches +14% of obfuscated spam\ncanary 5%: p99 first-stage latency 8ms, false-ban rate 0.1%\npromoting to 100%.", metrics: [{ k: "p99 latency", v: "8ms" }, { k: "extra spam caught", v: "+14%" }] } }
        ]
      },
      {
        phase: "Monitor", icon: "📡", title: "Monitor & maintain (MLOps)",
        narrative: `<p>Spam is adversarial: the moment you ship, attackers start probing. Monitoring is your early-warning system for the next evasion.</p>`,
        concepts: ["mlx-error-analysis", "prob-bayes"],
        steps: [
          { type: "decide", prompt: "What do you watch in production?",
            options: [
              { label: "Appeal/reversal rate (false bans), spam-report volume and catch-rate, score-distribution drift, and per-language/segment slices — with alerts", best: true, feedback: "reversals reveal false bans, report volume reveals misses, drift and slices reveal an emerging evasion before it scales. This closes the adversarial loop." },
              { label: "Just the overall accuracy on the original gold set", feedback: "a stale frozen set can't see new evasion tactics; you'd look healthy while a fresh scam wave sails through." }
            ] },
          { type: "run", label: "▶ Check this week's monitors", result: { log: "appeal reversal rate: 0.8% -> 2.1% (rising false bans on a new slang) ALERT\nspam reports up 30% in 'crypto' topic cluster\nscore drift on short messages +0.06\naction: collect the new false-ban examples, refresh labels, retrain", metrics: [{ k: "reversal rate", v: "2.1% ⚠" }, { k: "spam reports", v: "+30% ⚠" }] }, note: `Rising reversals flagged a false-ban spike on new slang while reports flagged a fresh scam cluster — both feed new labels back into the <b>Data</b> stage. The adversarial loop never stops.` }
        ]
      }
    ]
  },
  "algorithmic-trading": {
    title: "Finance & Algorithmic Trading",
    icon: "📈",
    goal: "Turn a price signal into a strategy that actually makes money out-of-sample — not one that only looks great on the history you fit it to.",
    stages: [
      {
        phase: "Frame", icon: "🎯", title: "Frame the problem",
        narrative: `<p>You're a quant building a systematic strategy. Markets are nearly efficient and the signal-to-noise ratio is brutal. Decide what you're actually predicting and how you'll judge success.</p>`,
        concepts: ["prob-expectation", "prob-variance", "ml-linear-regression"],
        steps: [{
          type: "decide", prompt: "What is a sensible target and success metric?",
          options: [
            { label: "Predict the sign/size of next-period excess return, and judge by risk-adjusted return (Sharpe) net of costs", best: true, feedback: "raw return ignores risk and trading costs; Sharpe = $\\frac{E[r]}{\\sigma(r)}$ rewards consistent edge per unit volatility, which is what survives." },
            { label: "Predict the exact future price level and minimize MSE", feedback: "price levels are near-random-walk; tiny MSE on levels can still mean zero tradable edge on returns." },
            { label: "Maximize total backtest profit, costs ignored", feedback: "ignoring transaction costs and risk is how a 'great' backtest becomes a losing live strategy." }
          ]
        }]
      },
      {
        phase: "Data", icon: "🗄️", title: "Gather the data",
        narrative: `<p>You assemble price/volume history and fundamentals. Two silent killers here: survivorship bias and point-in-time correctness.</p>`,
        concepts: ["mod-timeseries", "prob-normal"],
        steps: [
          { type: "decide", prompt: "What's the biggest data trap to fix first?",
            options: [
              { label: "Use a survivorship-bias-free universe with point-in-time fundamentals (as known on each date), adjusted for splits/dividends", best: true, feedback: "dropping delisted/bankrupt names inflates returns, and using restated fundamentals leaks the future. Point-in-time data is the foundation of an honest backtest." },
              { label: "Just download today's index members back through history", feedback: "that's textbook survivorship bias — today's index excludes the firms that went bankrupt, so your backtest only 'trades' winners." },
              { label: "Use the latest restated earnings for every past date", feedback: "restatements weren't known then; using them is look-ahead bias and inflates the backtest." }
            ] },
          { type: "run", label: "▶ Assemble universe", prompt: "Assemble a clean point-in-time dataset.",
            result: { log: "loading survivorship-bias-free universe...\n3,100 names, 2005-2024, daily bars\nincluded 640 delisted/bankrupt names\nfundamentals: point-in-time, lagged to report date\nsplit/dividend adjusted\nNOTE: reserve 2021-2024 as untouched out-of-sample", metrics: [{ k: "names", v: "3,100" }, { k: "span", v: "19y" }, { k: "delisted incl.", v: "640" }] } }
        ]
      },
      {
        phase: "Explore", icon: "🔍", title: "Explore & clean",
        narrative: `<p>Inspect the signal and hunt for look-ahead bias — the trading equivalent of target leakage. In time series it hides in alignment and timing.</p>`,
        concepts: ["prob-covariance-correlation", "mlx-error-analysis"],
        steps: [
          { type: "run", label: "▶ Profile signals", result: { log: "return distribution: heavy tails, excess kurtosis 7.4 (not Gaussian)\nfeature 'close_today' used to predict 'close_today' direction -> LOOK-AHEAD\nsignal uses report-date value but aligned to event date, not publish date (+1-3 day leak)\nfeature correlations: 4 signals pairwise |r|>0.9 (redundant)", metrics: [{ k: "kurtosis", v: "7.4" }, { k: "look-ahead", v: "found" }] } },
          { type: "decide", prompt: "A momentum signal is aligned to the earnings event date, not the public release date. What's the problem?",
            options: [
              { label: "Look-ahead bias — you'd be trading on info before it was public", best: true, feedback: "exactly. Aligning to when data became KNOWABLE (release/publish date, with realistic lag) is the time-series version of avoiding target leakage." },
              { label: "Nothing — the dates are basically the same", feedback: "even a 1-3 day gap lets the backtest 'trade' on not-yet-public information, fabricating returns that vanish live." }
            ] }
        ]
      },
      {
        phase: "Features", icon: "🧬", title: "Engineer features",
        narrative: `<p>Build factor signals, then control their correlation — overlapping factors create a portfolio that's secretly one big bet.</p>`,
        concepts: ["prob-covariance-correlation", "ml-pca", "fnd-eigen"],
        steps: [{
          type: "decide", prompt: "Four of your signals are 0.9+ correlated. Best move?",
          options: [
            { label: "Orthogonalize them with PCA (eigen-decompose the covariance matrix) and keep the independent factor components", best: true, feedback: "PCA finds the eigenvectors of the covariance matrix, collapsing redundant signals into uncorrelated factors so risk isn't secretly concentrated in one direction." },
            { label: "Keep all four — more signals is more edge", feedback: "near-duplicate signals just quadruple-weight the same bet, concentrating risk while looking diversified." },
            { label: "Drop three at random", feedback: "you might discard the most informative one; PCA combines their shared signal instead of guessing." }
          ]
        }]
      },
      {
        phase: "Model", icon: "🧠", title: "Pick a model",
        narrative: `<p>With low signal-to-noise, model complexity is dangerous — every extra parameter is another way to fit noise in the history.</p>`,
        concepts: ["ml-linear-regression", "ml-pca", "cls-bandits"],
        steps: [{
          type: "decide", prompt: "Choose a model for a low signal-to-noise return forecast.",
          options: [
            { label: "A parsimonious regularized linear factor model, sized to the (low) signal, with capital allocation tuned over time", best: true, feedback: "in noisy markets, simple + regularized generalizes; a small number of robust factors beats a flexible model that memorizes one decade of history. Allocation across strategies can be tuned like a bandit." },
            { label: "A deep network with millions of parameters", feedback: "vastly more capacity than the signal supports — it will overfit historical noise and fail out-of-sample." },
            { label: "A 50-rule hand-tuned system fit to maximize past profit", feedback: "that's curve-fitting the history; each rule added to boost the backtest erodes real out-of-sample edge." }
          ]
        }]
      },
      {
        phase: "Train", icon: "⚙️", title: "Train & backtest",
        narrative: `<p>Fit and backtest with <i>walk-forward validation</i>: train on a past window, test on the next, roll forward. Never let the test period inform the fit.</p>`,
        concepts: ["mod-timeseries", "ml-linear-regression", "ml-pca"],
        steps: [{
          type: "run", label: "▶ Walk-forward backtest (2005-2020)",
          result: { log: "walk-forward: train 3y / test 1y, rolling...\nin-sample Sharpe (avg): 1.9\nout-of-sample (walk-forward) Sharpe: 0.94\nmax drawdown: -14%\nturnover 180%/yr, costs modeled at 8 bps/trade", metrics: [{ k: "WF Sharpe", v: "0.94" }, { k: "max DD", v: "-14%" }] } }
        ]
      },
      {
        phase: "Evaluate", icon: "📊", title: "Evaluate honestly",
        narrative: `<p>The in-sample Sharpe was 1.9 but walk-forward is 0.94. That gap is the overfitting tax. Now stress-test costs and the untouched out-of-sample block.</p>`,
        concepts: ["prob-variance", "prob-expectation", "mlx-error-analysis"],
        steps: [
          { type: "run", label: "▶ Test on untouched 2021-2024 block", result: { log: "final out-of-sample (2021-2024, never used in design):\nSharpe 0.81 net of costs\nat 8 bps cost: Sharpe 0.81 | at 15 bps cost: Sharpe 0.43\nhit rate 53.1%, avg win/avg loss 1.08\ndrawdown -16%, recovered in 5 months", metrics: [{ k: "OOS Sharpe", v: "0.81" }, { k: "Sharpe@15bps", v: "0.43" }, { k: "hit rate", v: "53.1%" }] } },
          { type: "decide", prompt: "Sharpe is 0.81 at 8 bps but 0.43 at 15 bps. What does this tell you?",
            options: [
              { label: "The edge is real but thin and cost-sensitive — size positions to control turnover and only trade where execution is cheap", best: true, feedback: "a strategy that dies when costs double is fragile. The honest read: modest edge that must be traded carefully, not levered aggressively." },
              { label: "It's a great strategy — deploy at max leverage", feedback: "the steep cost sensitivity and 53% hit rate say the edge is thin; max leverage would amplify the drawdowns and costs that erase it." },
              { label: "Costs don't matter, ignore the 15 bps case", feedback: "real fills suffer slippage and impact; assuming the cheapest cost is exactly the optimism that sinks live strategies." }
            ] }
        ]
      },
      {
        phase: "Iterate", icon: "🔁", title: "Diagnose & iterate",
        narrative: `<p>You're tempted to add 20 more signals to push the backtest Sharpe back to 1.9. Pause — what's actually happening?</p>`,
        concepts: ["ml-bias-variance", "mlx-error-analysis", "ml-pca"],
        steps: [{
          type: "decide", prompt: "Backtest Sharpe rises with each added signal but walk-forward Sharpe doesn't. Best response?",
          options: [
            { label: "Stop adding signals — the in-sample gain is overfitting. Keep the robust factors and validate any addition on untouched data", best: true, feedback: "a rising in-sample / flat out-of-sample gap is the signature of overfitting to history (high variance). Only keep a signal if it holds out-of-sample." },
            { label: "Add all 20 — the backtest looks amazing now", feedback: "you're fitting noise; the beautiful backtest won't repeat live. This is the classic quant trap." },
            { label: "Re-run the walk-forward until you find the split that gives the best Sharpe", best: false, feedback: "cherry-picking the split is just another form of look-ahead/overfitting — it launders the same bias." }
          ]
        }]
      },
      {
        phase: "Deploy", icon: "🚀", title: "Deploy to production",
        narrative: `<p>Live trading adds frictions a backtest never feels: slippage, market impact, and the risk of a runaway algo. Roll out carefully.</p>`,
        concepts: ["prob-variance", "cls-bandits"],
        steps: [
          { type: "decide", prompt: "How do you go live with a fragile-but-real edge?",
            options: [
              { label: "Paper-trade, then live with small capital, hard risk limits and a kill-switch; scale up only as live fills match the backtest", best: true, feedback: "live slippage and impact are unknown until you trade; small-and-limited proves the edge survives real execution before you risk size." },
              { label: "Deploy full capital immediately to capture the edge fast", feedback: "if live costs exceed the backtest, full size turns a thin edge into a fast loss with no circuit breaker." },
              { label: "Skip risk limits — the backtest drawdown was only -16%", feedback: "a backtest can't anticipate a flash crash or a data-feed glitch; no kill-switch means an algo bug can blow up the book." }
            ] },
          { type: "run", label: "▶ Go live (paper → small → scaled)", result: { log: "paper trading 1mo: live Sharpe 0.77 (vs 0.81 backtest, costs tracked)\nslippage 1.4 bps above model\nlive small capital: risk limits + kill-switch armed\nscaling capital 25% as fills confirm.", metrics: [{ k: "live Sharpe", v: "0.77" }, { k: "slippage", v: "+1.4 bps" }] } }
        ]
      },
      {
        phase: "Monitor", icon: "📡", title: "Monitor & maintain (MLOps)",
        narrative: `<p>Edges decay as others discover them and regimes change. A trading model needs constant supervision and a plan to pull it when the alpha fades.</p>`,
        concepts: ["mod-timeseries", "prob-covariance-correlation", "mlx-error-analysis"],
        steps: [
          { type: "decide", prompt: "What do you monitor for a live strategy?",
            options: [
              { label: "Rolling live-vs-backtest Sharpe, realized slippage vs model, factor-exposure & correlation drift, and drawdown vs limits — with auto-derisk rules", best: true, feedback: "you're watching whether the edge still pays after real costs and whether the regime/correlations have shifted, with rules to cut risk before a dead strategy bleeds." },
              { label: "Just total P&L; if it's positive, keep going", feedback: "P&L can stay positive on luck while the edge is already gone; you'd keep trading a dead signal into the next drawdown." }
            ] },
          { type: "run", label: "▶ Check this month's monitors", result: { log: "rolling 60d live Sharpe: 0.77 -> 0.21 (decaying)\nrealized slippage drifting +0.9 bps (liquidity thinner)\nfactor correlation to a crowded value trade rose 0.31 -> 0.58 ALERT\naction: de-risk to 50%, re-examine signal, research refresh", metrics: [{ k: "live Sharpe", v: "0.21 ⚠" }, { k: "crowding corr", v: "0.58 ⚠" }] }, note: `Falling live Sharpe and rising crowding correlation say the edge is decaying as others pile in — auto-derisk fires and the signal goes back to research, the trading version of <b>Data</b>/<b>Iterate</b>. Alpha is perishable.` }
        ]
      }
    ]
  }
});
