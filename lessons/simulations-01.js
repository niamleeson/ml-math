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
        narrative: `<p>You work at a payments company processing millions of card swipes a day, and only ~$0.3\\%$ of them are fraud. Blocking a good customer costs trust and lifetime revenue; missing fraud costs the chargeback plus the goods. Before touching a model you must decide what "good" even means — because the wrong objective will quietly optimize for the wrong thing on this extreme class imbalance.</p>`,
        concepts: ["ml-classification-metrics", "ml-roc-auc", "prob-bayes"],
        insight: `<b>Imbalance breaks your intuition.</b> At a $0.3\\%$ fraud rate, the "always say legit" model is right $99.7\\%$ of the time yet catches <b>zero</b> fraud. With ~$3{,}000$ frauds hiding in $1{,}000{,}000$ transactions, the prior $P(\\text{fraud})\\approx 0.003$ is so low that a single useless flag can outnumber true catches. The metric you pick has to reward finding the rare positive, not agreeing with the overwhelming negative.`,
        symbols: [
          { sym: "$P(\\text{fraud})$", desc: "the prior probability a random transaction is fraud — here $\\approx 0.003$ (0.3%)." },
          { sym: "precision", desc: "of the transactions you flag, the fraction that really are fraud — penalizes false alarms." },
          { sym: "recall", desc: "of all real frauds, the fraction you actually flag — penalizes misses." }
        ],
        steps: [{
          type: "decide", prompt: "Which objective fits a 0.3%-positive problem?",
          options: [
            { label: "Maximize accuracy", feedback: "trap: a model that flags nothing already scores 99.7% accuracy by predicting the majority class every time. Accuracy averages over a sea of easy negatives, so it's dominated by the 99.7% and blind to whether you caught any of the 0.3% that matters. It rewards doing nothing." },
            { label: "Maximize recall at a fixed precision (e.g. catch as much fraud as possible while keeping ≥90% of flags correct)", best: true, feedback: "right. The business has two distinct costs — a false negative (missed fraud, lost money) and a false positive (blocked good customer, lost trust). Pinning precision at a floor (≥90% of flags correct) caps the customer-harm cost, then maximizing recall under that constraint catches as much fraud as possible without crossing the harm line. This separates the model's ranking quality from the operating threshold you'll tune later." },
            { label: "Minimize mean-squared error", feedback: "trap: MSE is a regression loss for predicting a continuous number, but fraud is a yes/no event. Squared error on a 0/1 label doesn't map to the precision–recall trade-off you actually care about, and it has no notion of the asymmetric costs of a miss vs a false alarm." }
          ]
        }]
      },
      {
        phase: "Data", icon: "🗄️", title: "Gather the data",
        narrative: `<p>A supervised model is only as honest as its labels, so the first real decision is where "this was fraud" comes from. Each label source carries a different bias: rules teach the past, analysts can't scale, and ground-truth disputes arrive weeks late. You pull a labeled sample and immediately confront the label lag that will shape every later choice.</p>`,
        concepts: ["ml-supervised", "prob-sample-space"],
        insight: `<b>Labels arrive from the future.</b> Confirmed fraud is defined by chargebacks and disputes that land ~$18$ days after the swipe, so today's transactions are still <i>unlabeled</i>. In a $1{,}000{,}000$-row pull only $3{,}021$ ($0.302\\%$) carry a positive label — and the most recent weeks are systematically under-labeled because their disputes haven't been filed yet. Any "fresh" evaluation must account for this maturation lag.`,
        data: {
          caption: "A few raw rows as pulled from the warehouse (42 columns, abbreviated)",
          columns: ["txn_id", "amount", "merchant_zip", "device_id", "ts", "label"],
          rows: [
            ["t_0001", "$42.10", "94107", "d_8821", "10:02:14", "0"],
            ["t_0002", "$5,400.00", "—", "—", "10:02:15", "1"],
            ["t_0003", "$12.99", "10001", "d_1190", "10:02:15", "0"],
            ["t_0004", "$890.00", "60611", "d_8821", "10:02:16", "0"],
            ["… 1.0M rows", "…", "…", "…", "…", "…"]
          ],
          note: `A dash (—) marks a missing field; the <b>label</b> arrives ~18 days later from chargebacks, so recent rows are still un-disputed. Only ~3 in every 1,000 rows are label <code>1</code>.`
        },
        symbols: [
          { sym: "label $\\in\\{0,1\\}$", desc: "the supervised target: 1 = confirmed fraud, 0 = legitimate (or not-yet-disputed)." },
          { sym: "$0.302\\%$", desc: "the observed positive rate — 3,021 frauds in 1,000,000 sampled transactions." }
        ],
        steps: [
          { type: "decide", prompt: "How will you label transactions as fraud?",
            options: [
              { label: "Use confirmed chargebacks + customer disputes as positives", best: true, feedback: "right. Chargebacks and disputes are settled, money-backed verdicts — the closest thing to ground truth you have, so the model learns what fraud actually is rather than what someone guessed. The cost is label lag (~18 days), which you handle by holding out a fully-matured window for evaluation, not by abandoning the truest signal." },
              { label: "Label anything a rule flagged as fraud", feedback: "trap: rule-flags are your OLD system's opinion, not ground truth. Training on them makes the model a clone of the rules — it can only re-learn the blind spots the rules already have, and it will confidently miss every novel fraud pattern the rules never encoded." },
              { label: "Have analysts hand-label everything", feedback: "trap: human labels are accurate but don't scale — at millions of transactions a day, analysts can cover a vanishing fraction, and the 0.3% base rate means they'd hand-review thousands of legit txns per real fraud. Reserve scarce human labeling for spot-auditing the dispute labels, not for the whole stream." }
            ] },
          { type: "run", label: "▶ Pull 1,000,000 transactions", prompt: "Pull a labeled sample from the warehouse.",
            result: { log: "querying warehouse...\nloaded 1,000,000 rows x 42 columns\nfraud positives: 3,021  (0.302%)\njoined chargeback labels (label lag: 18 days avg)", metrics: [{ k: "rows", v: "1.0M" }, { k: "fraud rate", v: "0.30%" }, { k: "features", v: "42" }] } }
        ]
      },
      {
        phase: "Explore", icon: "🔍", title: "Explore & clean",
        narrative: `<p>Before modeling you profile the columns to find what will sabotage the model later. Two traps dominate fraud data: the brutal $332{:}1$ class imbalance (which distorts every naive average) and target leakage (a column secretly built from the answer). A column that "predicts" fraud almost perfectly is a red flag, not a gift — it usually means information from the future has leaked backward into your features.</p>`,
        concepts: ["prob-variance", "ml-classification-metrics", "mlx-error-analysis"],
        insight: `<b>A perfect predictor is almost always a leak.</b> The profiler finds <code>is_disputed</code> correlates near-perfectly with the label — but a dispute is filed <i>after</i> fraud is discovered, so it literally cannot exist at swipe time. Meanwhile <code>device_id</code> is missing $11.7\\%$ of the time and the amount has a heavy right tail (max $\\$48{,}200$ vs a typical ~$\\$40$), so a raw mean is dominated by a few outliers. With imbalance at $332{:}1$, the negative class swamps any unweighted statistic.`,
        data: {
          caption: "Profiling output: missingness, leakage, and balance",
          columns: ["column", "missing %", "corr. w/ label", "verdict"],
          rows: [
            ["is_disputed", "0%", "≈ 0.99", "LEAK — drop"],
            ["device_id", "11.7%", "0.21", "keep, impute"],
            ["merchant_zip", "4.1%", "0.08", "keep"],
            ["amount", "0%", "0.14", "keep, heavy tail"],
            ["class balance", "—", "—", "332:1 (neg:pos)"]
          ],
          note: `A near-$1.0$ correlation with the label is the signature of leakage — the column was populated <i>after</i> the outcome was known. Genuine fraud signals correlate weakly because fraud is hard.`
        },
        chart: { type: "bars", title: "Class balance: legit vs fraud (332 to 1)", labels: ["legit", "fraud"], values: [996979, 3021], valueLabels: ["99.70%", "0.30%"], colors: ["#4ea1ff", "#ff7b72"] },
        symbols: [
          { sym: "$332{:}1$", desc: "the class-balance ratio — 332 legit transactions for every 1 fraud." },
          { sym: "corr. w/ label", desc: "correlation between a column and the 0/1 fraud label; values near 1 signal leakage, not skill." }
        ],
        steps: [
          { type: "run", label: "▶ Profile the dataset", result: { log: "missing values: merchant_zip 4.1%, device_id 11.7%\nclass balance: 332:1 (neg:pos)\nfound column 'is_disputed' -> PERFECT correlation with label (LEAKAGE)\namount: heavy right tail (max $48,200)", metrics: [{ k: "imbalance", v: "332:1" }, { k: "leaky cols", v: "1" }] } },
          { type: "decide", prompt: "'is_disputed' predicts the label almost perfectly. What is it?",
            options: [
              { label: "A great feature — keep it", feedback: "trap: it's only known AFTER fraud is reported and the customer files a dispute, so it does not exist at the moment you must score the swipe. Keeping it makes offline AUC look near-perfect and then the model collapses in production, because at serving time the column is always empty. A predictor that's too good to be true is leakage." },
              { label: "Target leakage — drop it", best: true, feedback: "exactly. The test for every feature is causal-in-time: could you compute it at the instant of authorization? <code>is_disputed</code> is derived from the outcome itself, so it leaks the label backward. Drop it (and audit for siblings like 'recovery_amount'). Honest features correlate weakly because real fraud detection is hard — and that weak-but-real signal is what survives deployment." }
            ] }
        ]
      },
      {
        phase: "Features", icon: "🧬", title: "Engineer features",
        narrative: `<p>Raw columns rarely separate fraud because a value that's normal for one customer is alarming for another. The trick is to engineer <i>relative</i> features that measure how abnormal a transaction is <b>for this specific user</b> — velocity, an amount z-score against their own history, a device-match flag. The amount z-score $\\frac{x-\\mu}{\\sigma}$ turns a raw dollar figure into "how many standard deviations from this customer's normal," which is what an anomaly model can actually learn from.</p>`,
        concepts: ["fnd-norm", "prob-conditional-expectation", "dl-cosine-similarity"],
        insight: `<b>Personalize the baseline.</b> A flat \\$5{,}000 charge is routine for a frequent traveler and a screaming alarm for someone whose history averages \\$40. Computing $z=\\frac{x-\\mu}{\\sigma}$ <i>per customer</i> means the same \\$5{,}000 might be $z\\approx 0.3$ for one user and $z\\approx 9$ for another — and it's that per-user $z$, not the dollar amount, that carries the fraud signal. Velocity (txns/hour) catches the rapid-fire testing pattern that a single-transaction view can't see.`,
        data: {
          caption: "Engineered feature rows: each is relative to the user's own history ($\\mu,\\sigma$ per customer)",
          columns: ["user", "amount", "amt z-score", "txns/hr", "device_match", "label"],
          rows: [
            ["u_77", "$48.00", "+0.2", "1", "yes", "0"],
            ["u_77", "$5,400.00", "+9.1", "6", "no", "1"],
            ["u_12", "$5,400.00", "+0.3", "1", "yes", "0"],
            ["u_31", "$220.00", "+4.7", "11", "no", "1"],
            ["…", "…", "…", "…", "…", "…"]
          ],
          note: `Notice rows 2 and 3: the <i>same</i> \\$5,400 is fraud for u_77 ($z=+9.1$, new device) but normal for u_12 ($z=+0.3$). The raw amount is identical — only the per-user z-score and device flag separate them.`
        },
        chart: { type: "scatter", title: "Per-user amount z-score vs velocity separates fraud", xlabel: "amount z-score", ylabel: "txns per hour", groups: [ { name: "normal", color: "#4ea1ff", points: [[0.2, 1], [0.3, 1], [-0.4, 1], [0.8, 2], [-0.1, 1], [1.1, 2], [0.5, 1]] }, { name: "fraud", color: "#ff7b72", points: [[9.1, 6], [4.7, 11], [6.2, 8], [7.8, 5], [5.1, 9], [8.4, 7]] } ] },
        symbols: [
          { sym: "$x$", desc: "the raw transaction amount for this swipe." },
          { sym: "$\\mu$", desc: "the mean transaction amount in THIS customer's own history." },
          { sym: "$\\sigma$", desc: "the standard deviation of THIS customer's amounts — their normal spread." },
          { sym: "$z=\\frac{x-\\mu}{\\sigma}$", desc: "the amount z-score: how many standard deviations this charge sits from the customer's personal baseline." },
          { sym: "velocity (txns/hr)", desc: "the count of this user/card's transactions in a rolling 1-hour window ending at the current swipe — recomputed per transaction to expose rapid card-testing bursts." }
        ],
        steps: [{
          type: "decide", prompt: "Which feature set will help most?",
          options: [
            { label: "Velocity (txns/hour), amount z-score vs the user's history, device-match flag", best: true, feedback: "right. Fraud is defined by deviation from a person's own pattern, so the model needs features that encode 'abnormal for THIS user.' The z-score $\\frac{x-\\mu}{\\sigma}$ normalizes each amount against that customer's own mean and spread; velocity exposes rapid card-testing; device-match flags an unrecognized device. Together they give the model the relative context that a raw column lacks." },
            { label: "The raw 16-digit card number as a number", feedback: "trap: a card number is an identifier, not a magnitude — its numeric value (e.g. 4,000…1234) carries no ordering or meaning, so the model fits noise on a near-unique-per-row column and overfits. It's also sensitive PAN data, a privacy and compliance liability you should never feed raw into a model." },
            { label: "Just the transaction amount", feedback: "trap: the raw amount alone has no baseline to compare against. A \\$5,000 charge is mundane for a high spender and fraud for a low spender, so without the per-user $\\mu$ and $\\sigma$ the same number points both ways and the feature is weak. Context — not the absolute amount — is the signal." }
          ]
        }]
      },
      {
        phase: "Model", icon: "🧠", title: "Pick a model",
        narrative: `<p>The data is tabular with mixed feature types, the fraud signal lives in non-linear interactions (high velocity AND a new device AND a high z-score), and you must score inline in milliseconds. Model choice should fit those constraints, not chase novelty. Gradient-boosted trees are the default workhorse here precisely because they capture interactions, ignore feature scaling, and serve fast — while a linear baseline and a deep net each fail one constraint.</p>`,
        concepts: ["cls-gradient-boosting", "ml-trees", "cls-anomaly"],
        insight: `<b>Match the model to the data's shape.</b> Tabular fraud signal is conjunctive — it's the <i>combination</i> of "$z>5$ AND new device AND 6 txns/hr" that's damning, not any single feature. Trees split on exactly these conjunctions for free, which is why gradient boosting tops nearly every tabular benchmark and why it'll hit ~$0.97$ AUC here while a single linear boundary can't. It also serves in well under the sub-$100$ms budget and hands you feature importances for free.`,
        symbols: [
          { sym: "AUC", desc: "area under the ROC curve — probability the model ranks a random fraud above a random legit txn (0.5 = chance, 1.0 = perfect)." },
          { sym: "interaction", desc: "a fraud signal that only appears when several features are extreme together, not from any one alone." }
        ],
        steps: [{
          type: "decide", prompt: "Choose a first model.",
          options: [
            { label: "Gradient-boosted trees (XGBoost / LightGBM)", best: true, feedback: "right. Boosting builds a sequence of small trees that each correct the last's errors, and because trees split on feature combinations it natively captures the conjunctive fraud signal. It's invariant to feature scaling (no need to normalize), serves in microseconds per tree, and yields feature importances for analyst trust. That combination of accuracy, speed, and interpretability is why it's the tabular default." },
            { label: "A deep neural network", feedback: "trap: deep nets shine on raw perceptual data (images, text) but rarely beat boosting on structured tabular features, while demanding far more data, tuning, and careful normalization. They're also slower and harder to explain — a poor trade when a tree ensemble already hits ~0.97 AUC. Revisit only after boosting plateaus and you have rich side-data." },
            { label: "Plain logistic regression", feedback: "trap-ish: it's a legitimate baseline and sanity check, but a single linear boundary can't represent 'high z-score AND new device AND high velocity' interactions without you hand-crafting every cross-term. It will systematically underfit the conjunctive structure that distinguishes fraud, leaving recall on the table." }
          ]
        }]
      },
      {
        phase: "Train", icon: "⚙️", title: "Train it",
        narrative: `<p>You fit the boosted trees with two safeguards aimed at this dataset. <code>scale_pos_weight=332</code> up-weights each rare fraud to roughly match the $332{:}1$ imbalance, so the loss doesn't ignore the positives; regularization plus early stopping prevent the ensemble from memorizing the handful of fraud examples. Watch the train–valid AUC gap: when valid stops improving (epoch ~214) you stop, because every tree after that is fitting noise.</p>`,
        concepts: ["ml-gradient-descent", "ml-regularization", "cls-gradient-boosting"],
        insight: `<b>Early stopping is the regularizer.</b> Train AUC keeps climbing ($0.971 \\to 0.989 \\to 0.997$) but valid AUC plateaus at $0.972$ — the widening gap is overfitting in real time. Adding trees past iteration $214$ buys train accuracy you can't ship. The <code>scale_pos_weight</code> term is what keeps the loss from collapsing to "predict legit always". You set it directly from the imbalance: $\\text{scale\\_pos\\_weight}=\\frac{\\#\\,\\text{negatives}}{\\#\\,\\text{positives}}=\\frac{996{,}979}{3{,}021}\\approx 332$. Mechanically, each boosting round computes a gradient (and hessian) per row from the log-loss; this weight <i>multiplies</i> the gradient of every positive (fraud) row by $332$, so a single missed fraud pushes the trees as hard as $332$ missed legit rows would. That is what stops the optimum from sitting at "predict legit always".`,
        data: {
          caption: "Train vs valid AUC over boosting rounds (the overfitting gap opens up)",
          columns: ["round", "train AUC", "valid AUC", "gap"],
          rows: [
            ["50", "0.971", "0.958", "0.013"],
            ["150", "0.989", "0.971", "0.018"],
            ["214", "0.994", "0.972", "0.022"],
            ["300", "0.997", "0.972", "0.025"]
          ],
          note: `Valid AUC flatlines at $0.972$ after ~214 rounds while train keeps rising — early stopping picks round 214 as the best iteration and discards the rest.`
        },
        symbols: [
          { sym: "scale_pos_weight", desc: "the factor $\\frac{\\#\\,\\text{neg}}{\\#\\,\\text{pos}}=\\frac{996{,}979}{3{,}021}\\approx 332$ that multiplies the gradient of each fraud row, up-weighting it $332\\times$ in the loss to offset the imbalance." },
          { sym: "train / valid AUC", desc: "ranking quality on data the model fit vs held-out data; their gap measures overfitting." }
        ],
        steps: [{
          type: "run", label: "▶ Train LightGBM (scale_pos_weight=332)",
          result: { log: "computing class weight: negatives 996,979 / positives 3,021 = 331.99 -> scale_pos_weight=332\ntraining gradient-boosted trees (each fraud row's gradient x332)...\n[50]  train auc 0.971  valid auc 0.958\n[150] train auc 0.989  valid auc 0.971\n[300] train auc 0.997  valid auc 0.972  (early stop: valid plateaued)\nbest iteration: 214", metrics: [{ k: "valid AUC", v: "0.972" }, { k: "trees", v: "214" }], chart: { type: "line", title: "Train vs valid AUC over boosting rounds", xlabel: "round", ylabel: "AUC", series: [ { name: "train", color: "#4ea1ff", points: [[50, 0.971], [150, 0.989], [214, 0.994], [300, 0.997]] }, { name: "valid", color: "#ffb454", points: [[50, 0.958], [150, 0.971], [214, 0.972], [300, 0.972]] } ] } } }
        ]
      },
      {
        phase: "Evaluate", icon: "📊", title: "Evaluate honestly",
        narrative: `<p>An AUC of $0.969$ is a single number summarizing every threshold at once — but you don't ship an AUC, you ship one <i>decision threshold</i>. The honest evaluation reads precision and recall at the exact cutoff you'd operate, because the same model behaves completely differently at $0.5$ vs $0.9$. With only $604$ frauds in the $200{,}000$-row holdout, even a small false-positive rate produces a flood of bad alerts.</p>`,
        concepts: ["ml-roc-auc", "ml-classification-metrics", "prob-bayes"],
        insight: `<b>The threshold is the product.</b> The same model at threshold $0.5$ gives precision $0.34$ (two of every three alerts are wrong) but at $0.9$ gives precision $0.91$ — a $2.7\\times$ swing from one knob. Why so steep? Base rate: with $604$ frauds among $\\sim 200{,}000$ txns, a $1\\%$ false-positive rate alone adds ~$2{,}000$ false alerts, swamping the true ones. Raising the threshold trades recall ($0.82 \\to 0.61$) for the precision the business requires.`,
        data: {
          caption: "Operating points on the holdout (200,000 txns, 604 fraud)",
          columns: ["threshold", "precision", "recall", "fraud caught", "false alarms"],
          rows: [
            ["0.5", "0.34", "0.82", "~495", "~960"],
            ["0.7", "0.71", "0.74", "~447", "~183"],
            ["0.9", "0.91", "0.61", "~368", "~36"],
            ["0.95", "0.96", "0.48", "~290", "~12"]
          ],
          note: `Read across one row: at $0.9$ you catch 61% of fraud with 91% of alerts correct. Pushing recall up to 82% (threshold 0.5) crashes precision to 0.34 — analysts drown.`
        },
        chart: { type: "confusion", title: "Confusion matrix at threshold 0.9 (200,000 holdout)", labels: ["legit", "fraud"], matrix: [[199360, 36], [236, 368]] },
        symbols: [
          { sym: "threshold", desc: "the score cutoff above which a transaction is flagged fraud; moving it trades precision against recall." },
          { sym: "precision", desc: "fraction of flagged transactions that are truly fraud (1 − false-alarm rate among alerts)." },
          { sym: "recall", desc: "fraction of all true frauds that the threshold catches." }
        ],
        steps: [
          { type: "run", label: "▶ Evaluate on a fresh holdout", result: { log: "holdout: 200,000 txns, 604 fraud\nAUC 0.969\n@ threshold 0.5 -> precision 0.34, recall 0.82  (too many false alarms)\n@ threshold 0.9 -> precision 0.91, recall 0.61", metrics: [{ k: "AUC", v: "0.969" }, { k: "prec@0.9", v: "0.91" }, { k: "recall@0.9", v: "0.61" }], chart: { type: "roc", title: "ROC curve (holdout)", auc: 0.969, points: [[0, 0], [0.0002, 0.61], [0.005, 0.74], [0.03, 0.82], [0.15, 0.95], [1, 1]] } } },
          { type: "decide", prompt: "Which operating point matches the goal (≥90% precision)?",
            options: [
              { label: "Threshold 0.9 — precision 0.91, recall 0.61", best: true, feedback: "right. The Frame stage fixed the constraint at ≥90% precision, and $0.91$ clears it while still catching $61\\%$ of fraud. Because precision rises steeply near the top of the score distribution, this is the highest-recall point that still respects the false-alarm ceiling — exactly the constrained optimization you set up. Pushing recall higher would breach the precision floor and harm customers." },
              { label: "Threshold 0.5 — recall 0.82", feedback: "trap: it catches more fraud (82%) but precision $0.34$ means two of every three alerts are wrong. At the holdout's base rate that's ~960 false alarms vs ~495 catches — analysts can't triage that volume, good customers get blocked, and you've violated the precision constraint the business set. More recall isn't free; here it's bought with unacceptable customer harm." }
            ] }
        ]
      },
      {
        phase: "Iterate", icon: "🔁", title: "Diagnose & iterate",
        narrative: `<p>A week later a new fraud ring slips through and recall on that specific pattern is poor, even though overall metrics still look fine. Before reaching for a fix, diagnose: is this underfitting (too little model capacity) or a <i>missing-signal</i> problem (the feature the new ring exploits simply isn't in your data)? Error analysis on the misses tells you which — and here the misses cluster around a behavior the model was never shown.</p>`,
        concepts: ["ml-bias-variance", "mlx-error-analysis", "mlx-cross-validation"],
        insight: `<b>You can't model a signal you never measured.</b> Slice the new ring's missed transactions and they share a trait the current features can't express — say, a burst of small charges from one new device across many cards. Their scores cluster <i>below</i> the threshold not because the trees are too shallow, but because no input encodes "shared-device-across-cards." This is a data/feature gap (the signal is absent), not a bias-variance gap (the model isn't underfitting what it can see) — so capacity won't help, but a new feature will.`,
        data: {
          caption: "Error analysis: where the misses cluster",
          columns: ["slice", "share of misses", "model score", "shared trait"],
          rows: [
            ["new ring", "61%", "0.10–0.30", "1 device, 40+ cards"],
            ["known patterns", "18%", "0.40–0.50", "near threshold"],
            ["random misses", "21%", "varied", "none"],
            ["…", "…", "…", "…"]
          ],
          note: `61% of misses share one trait the features don't capture — a strong hint to engineer a 'cards-per-device' feature rather than to add model capacity.`
        },
        symbols: [
          { sym: "bias (underfit)", desc: "error from a model too simple to capture signal it CAN see — fixed by more capacity." },
          { sym: "missing signal", desc: "error from a predictive pattern absent from the features entirely — fixed by new data/features, not capacity." }
        ],
        steps: [{
          type: "decide", prompt: "The model misses a brand-new fraud pattern. Best response?",
          options: [
            { label: "Do error analysis on the misses, add features that capture the new behavior, and retrain", best: true, feedback: "right. The misses cluster on a shared trait (e.g. one device fanning out across many cards) that no current feature encodes — so the model is blind, not weak. Engineering a feature that measures the new behavior, plus fresh labels for the ring, gives the model something to learn from. This is the iterate loop: error analysis → targeted feature → retrain, closing the specific gap rather than perturbing everything." },
            { label: "Just lower the threshold globally", feedback: "trap: a global threshold drop raises recall everywhere, including on the millions of legit txns, so precision collapses and you block crowds of good customers to catch one ring. It treats a localized blind spot with a blunt, system-wide instrument — the worst kind of fix because it trades a tiny recall gain for huge customer harm." },
            { label: "Add more trees", feedback: "trap: more capacity reduces bias only when the signal is present but underfit. Here the signal is absent from the features entirely, so extra trees just carve the same blind inputs more finely and memorize noise. You can't boost your way to information the data doesn't contain — this is a feature gap, not an underfitting gap." }
          ]
        }]
      },
      {
        phase: "Deploy", icon: "🚀", title: "Deploy to production",
        narrative: `<p>A fraud decision is only useful <i>before</i> the charge is authorized, which makes this an inline, latency-bound problem — the model has a sub-$100$ms budget on the live payment path. Serving therefore must be a real-time scoring service, not a batch job that runs after the money has moved. And because that service can block real payments, you roll it out behind a canary so a bad model can't take down checkout for everyone at once.</p>`,
        concepts: ["ml-classification-metrics", "cls-gradient-boosting"],
        insight: `<b>Inline means latency is a hard constraint.</b> The score must return within the authorization round-trip — the canary measures p99 latency at $41$ms, comfortably under the $100$ms ceiling. A canary at $1\\%$ also caps blast radius: if the new model misbehaves it only touches one in a hundred transactions, and shadow-comparing it against the existing rules ($93\\%$ agreement) catches gross regressions before they reach $100\\%$ of traffic.`,
        symbols: [
          { sym: "p99 latency", desc: "the 99th-percentile scoring time — 99% of requests finish faster; must stay under the ~100ms auth budget." },
          { sym: "canary 1%", desc: "routing 1% of live traffic to the new model first, so a bad deploy harms at most 1% before rollback." }
        ],
        steps: [
          { type: "decide", prompt: "How should the model run?",
            options: [
              { label: "A real-time scoring service behind the checkout (sub-100ms), with a canary rollout", best: true, feedback: "right. The decision must happen inside the authorization handshake, so the model has to score synchronously within the latency budget (p99 41ms here). The canary ramp (1% → 100%) bounds the damage of a bad model and lets you compare against the incumbent rules in shadow before trusting it with all payments — operational safety on a system that can block real money." },
              { label: "A nightly batch job", feedback: "trap: a batch job scores transactions hours after they've already cleared, so the fraud is paid out before the model ever sees it. Batch is the right tool for reporting, dashboards, and label backfill, but it structurally cannot block a live charge — it answers the question too late to act on." }
            ] },
          { type: "run", label: "▶ Ship (canary 1% → 100%)", result: { log: "deploying model v1 ...\ncanary 1%: p99 latency 41ms, error rate 0.0%\nshadow agreement with rules: 93%\npromoting to 100% ...\nlive.", metrics: [{ k: "p99 latency", v: "41ms" }, { k: "rollout", v: "100%" }] } }
        ]
      },
      {
        phase: "Monitor", icon: "📡", title: "Monitor & maintain (MLOps)",
        narrative: `<p>A deployed fraud model decays for two reasons: adversaries adapt their tactics, and upstream data pipelines silently change shape. Good monitoring watches all three layers — inputs (feature drift and null rates), outputs (score distribution), and outcomes (precision/recall as chargeback labels arrive). Because labels lag ~$18$ days, you can't wait for the final outcome to notice trouble; input and score drift are your early warning.</p>`,
        concepts: ["prob-clt", "ml-roc-auc", "mlx-error-analysis"],
        insight: `<b>Watch inputs to predict output decay.</b> This week <code>device_id</code>'s null-rate jumped $11.7\\% \\to 38\\%$ from an upstream pipeline change — an <i>input</i> signal that arrives immediately, long before the chargeback labels that confirm the damage. Sure enough, live precision fell $0.91 \\to 0.84$ as labels matured. Monitoring the input drift gave you a $\\sim 18$-day head start over waiting for the outcome metric to crash.`,
        data: {
          caption: "This week's monitors: input drift leads, outcome decay follows",
          columns: ["signal", "layer", "baseline", "now", "status"],
          rows: [
            ["device_id null-rate", "input", "11.7%", "38%", "⚠ pipeline"],
            ["score mean", "output", "0.00", "+0.07", "drifting"],
            ["precision (7d)", "outcome", "0.91", "0.84", "⚠ alert"],
            ["p99 latency", "system", "41ms", "43ms", "ok"]
          ],
          note: `The input layer (null-rate spike) moves first and is observable today; the outcome layer (precision) confirms the harm ~18 days later as labels land. Alert on the leading signal.`
        },
        symbols: [
          { sym: "null-rate", desc: "fraction of a feature's values that are missing; a sudden jump signals an upstream pipeline break." },
          { sym: "score drift", desc: "a shift in the distribution of the model's output scores, often the first sign of changing inputs." },
          { sym: "label lag", desc: "the ~18-day delay before chargebacks confirm true precision/recall — why input drift is the early warning." }
        ],
        steps: [
          { type: "decide", prompt: "What should you monitor in production?",
            options: [
              { label: "Score distribution drift, live precision/recall (as labels arrive), feature-null rates, and latency — with alerts", best: true, feedback: "right. A fraud model has three failure surfaces and you need a sensor on each: inputs (null-rates, feature drift) catch broken pipelines the instant they happen; output (score distribution) catches shifts before labels confirm them; outcomes (precision/recall) verify real performance as chargebacks land 18 days late. Alerting on the leading input/output signals buys you weeks over waiting for the lagging outcome — that early-warning chain is the core of MLOps." },
              { label: "Nothing — it passed evaluation", feedback: "trap: passing an offline eval certifies the model on one frozen snapshot, but production is non-stationary — fraudsters adapt and upstream data drifts. An unwatched model decays silently, and with an 18-day label lag you wouldn't even see the precision drop until weeks of fraud had already cleared. 'It passed once' guarantees a future silent failure." }
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
        narrative: `<p>You build the underwriting model at a lender. Each application is a single repay-or-default bet, $y\\in\\{0,1\\}$, with roughly a $6.8\\%$ base rate of default in the booked population. Denying a good borrower forfeits years of interest; approving a defaulter can lose the entire principal — so the two error types are wildly asymmetric in dollars. The first decision is what the model should even output, because that choice constrains pricing, the approve/deny cutoff, and what you can defend to a regulator.</p>`,
        concepts: ["prob-bernoulli-binomial", "ml-classification-metrics", "ml-supervised"],
        insight: `<b>The output shape decides the business.</b> A loan defaults or it doesn't, so $y$ is a Bernoulli trial and the natural target is $P(\\text{default})$ — one number in $[0,1]$. That single calibrated probability does triple duty: it sets a risk-based <i>price</i> (charge more where $P(\\text{default})$ is higher), it sets the <i>cutoff</i> (deny above some threshold), and it lets you re-tune that cutoff as the economy moves without retraining. Collapse it to a hard yes/no too early and you throw all of that away.`,
        symbols: [
          { sym: "$y$", desc: "the outcome label for one loan: $1$ if it defaulted (90+ days delinquent), $0$ if it repaid." },
          { sym: "$y\\in\\{0,1\\}$", desc: "reads '$y$ is in the set {0, 1}' — i.e. $y$ takes only the values 0 or 1, a binary (Bernoulli) outcome, not a number on a scale." },
          { sym: "$P(\\text{default})$", desc: "the probability the model assigns to this borrower defaulting; also written PD." }
        ],
        steps: [{
          type: "decide", prompt: "What should the model produce?",
          options: [
            { label: "A calibrated probability of default (PD) you can turn into a price and a cutoff", best: true, feedback: "default is a Bernoulli event ($y\\in\\{0,1\\}$), so the right target is a well-calibrated $P(\\text{default})$. Calibrated means that among loans scored at PD $0.05$, almost exactly $5\\%$ truly default — that property is what lets you compute expected loss, set a risk-based interest rate, AND pick an approve/deny threshold. One probability powers pricing, the cutoff, and re-tuning the cutoff as conditions shift." },
            { label: "A hard approve/deny label only", feedback: "a bare yes/no discards the magnitude of risk: you can no longer price a 4%-risk borrower differently from a 25%-risk one, and you can't nudge the cutoff when the economy turns without refitting. The probability is the real asset; a label is just one threshold already baked into it — and one you can't un-bake later." },
            { label: "A dollar amount of expected revenue", feedback: "expected revenue is a downstream calculation that already contains $P(\\text{default})$ inside it (roughly interest × repay-probability − principal × default-probability). You can't get the dollars without first estimating the probability, so predicting dollars directly just hides the real uncertain quantity and makes calibration impossible to check." }
          ]
        }]
      },
      {
        phase: "Data", icon: "🗄️", title: "Gather the data",
        narrative: `<p>You need past loans with <i>known</i> outcomes, but a loan's outcome isn't decided until it has had time to default — usually a full 18–24 months. Worse, you only ever observe the applicants you already <i>approved</i>; everyone you rejected is invisible, so the data is a biased slice of all applicants (this is the reject-inference gap). Getting the label window right is the whole game here: too short and almost no loan has had a chance to go bad, so 'good' is a lie.</p>`,
        concepts: ["ml-supervised", "ml-likelihood"],
        insight: `<b>Labels are censored by time.</b> Default is observed only after a long performance window — a loan booked last month simply hasn't had the chance to miss 90 days of payments yet. So you train on <b>480K</b> loans booked 24+ months ago, where the $6.8\\%$ that defaulted are truly labeled. Pull recent loans for 'freshness' and you'd mark a maturing book as nearly all 'good' — the model would learn that almost nobody defaults, which is catastrophically wrong.`,
        data: {
          caption: "A few rows of the booked loan book (96 columns total)",
          columns: ["loan_id", "dti", "bureau_score", "utilization", "booked", "y (default)"],
          rows: [
            ["L-4471", "0.18", "742", "0.22", "2022-03", "0"],
            ["L-4472", "0.41", "611", "0.88", "2022-05", "1"],
            ["L-4473", "0.29", "688", "0.55", "2023-01", "0"],
            ["L-4474", "0.52", "—", "0.91", "2022-08", "1"],
            ["… 480K rows", "…", "…", "…", "…", "…"]
          ],
          note: `Only <b>approved</b> applicants appear (the rejected are unobserved). $y$ is known only because every row matured 24+ months. A dash (—) is a missing value, e.g. bureau_score is missing on $2.1\\%$ of rows.`
        },
        symbols: [
          { sym: "$y$", desc: "default label: $1$ if the loan reached 90+ days past due within the window, else $0$." },
          { sym: "dti", desc: "debt-to-income ratio — monthly debt payments divided by monthly income; higher means more stretched." },
          { sym: "90+ dpd", desc: "'90 or more days past due' — the industry definition of default used to set $y$." }
        ],
        steps: [
          { type: "decide", prompt: "How do you build labels for 'defaulted'?",
            options: [
              { label: "Use loans booked 24+ months ago, labeling 90+ days delinquent as default", best: true, feedback: "default is a time-censored event: you can only call a loan 'good' once it has survived a full performance window without going 90+ dpd. Booking-vintages that are 24+ months old have actually had that chance, so both labels are real. This is why the $6.8\\%$ default rate is trustworthy — every row had time to go bad." },
              { label: "Label any loan currently 1+ day late as default", feedback: "a one-day slip — a forgotten autopay, a bank holiday — is not a default; most such borrowers are current again within a week. Defining the target this loosely floods $y=1$ with noise, so the model learns to predict harmless lateness instead of real loss, and your bad-rate numbers become meaningless." },
              { label: "Use only loans from the last 3 months for freshness", feedback: "this is the censoring trap: almost no 3-month-old loan has had time to reach 90+ dpd, so nearly every row gets labeled $y=0$. The model learns that default essentially never happens and approves everyone — the freshest data is the most useless when the label needs time to appear." }
            ] },
          { type: "run", label: "▶ Pull matured loan book", prompt: "Pull approved loans with a full performance window.",
            result: { log: "querying loan warehouse...\nloaded 480,000 booked loans x 96 columns\nwindow: booked 2022-2024, 24mo performance\ndefault rate (90+ dpd): 6.8%\nNOTE: only APPROVED applicants present (rejected applicants unobserved)", metrics: [{ k: "loans", v: "480K" }, { k: "default rate", v: "6.8%" }, { k: "features", v: "96" }] } }
        ]
      },
      {
        phase: "Explore", icon: "🔍", title: "Explore & clean",
        narrative: `<p>Before modeling, hunt for the two things that quietly destroy a credit model: <b>target leakage</b> (a feature that only exists <i>after</i> the outcome) and <b>selection bias</b> (you only see approved applicants). Credit warehouses are stuffed with post-decision fields — recoveries, collections activity, restructurings — that correlate almost perfectly with default but are blank at scoring time. The skew matters too: at $13.7{:}1$ good-to-bad, naive accuracy is a useless mirror.</p>`,
        concepts: ["ml-classification-metrics", "mlx-error-analysis"],
        insight: `<b>The 'too good to be true' feature is the tell.</b> A column that predicts default almost perfectly is usually leakage, not insight. Here <code>recovery_amount</code> is nonzero <b>only</b> on the $6.8\\%$ that defaulted — because recoveries happen <i>after</i> a charge-off — and <code>collections_calls</code> is populated post-booking. At application time both are exactly $0$, so a model leaning on them learns a fact it can never see live, and the magical offline AUC collapses the day it ships.`,
        data: {
          caption: "Leakage / quality profile (per column)",
          columns: ["column", "missing %", "nonzero when y=0", "nonzero when y=1", "verdict"],
          rows: [
            ["recovery_amount", "0%", "0%", "100%", "LEAK — post-default"],
            ["collections_calls", "0%", "0%", "≈100%", "LEAK — post-booking"],
            ["bureau_score", "2.1%", "yes", "yes", "keep"],
            ["employment_length", "14%", "yes", "yes", "keep, impute"]
          ],
          note: `A feature that is nonzero <i>only</i> for $y=1$ rows is leaking the label. The class balance is $13.7{:}1$ good-to-bad, so a 'predict good' model is $93\\%$ accurate while catching zero defaults — accuracy is the wrong metric here.`
        },
        chart: { type: "bars", title: "Class balance: repaid vs default (13.7 to 1)", labels: ["repaid", "default"], values: [447360, 32640], valueLabels: ["93.2%", "6.8%"], colors: ["#7ee787", "#ff7b72"] },
        symbols: [
          { sym: "$y$", desc: "the default label ($1$=default, $0$=repaid) being predicted." },
          { sym: "$13.7{:}1$", desc: "the class ratio — about 13.7 repaid loans for every 1 default; a heavily imbalanced problem." }
        ],
        steps: [
          { type: "run", label: "▶ Profile the data", result: { log: "missing: employment_length 14%, bureau_score 2.1%\nfound 'recovery_amount' -> nonzero ONLY for defaults (LEAKAGE)\nfound 'collections_calls' -> populated post-booking (LEAKAGE)\nclass balance 13.7:1 (good:default)\nreject inference gap: model only sees approved population", metrics: [{ k: "imbalance", v: "13.7:1" }, { k: "leaky cols", v: "2" }] } },
          { type: "decide", prompt: "'recovery_amount' is a strong predictor of default. Keep it?",
            options: [
              { label: "Keep it — it's highly predictive", feedback: "its predictive power is the symptom, not the cure. Recoveries are collected only AFTER a loan charges off, so the field is nonzero exclusively on $y=1$ rows and is exactly $0$ for every live application. Training on it teaches the model a value it can never observe at decision time — the AUC looks spectacular offline and falls apart in production." },
              { label: "Drop it (and other post-decision fields)", best: true, feedback: "correct — the iron rule is that only information available at application time may be used. <code>recovery_amount</code> and <code>collections_calls</code> are populated post-decision, so they encode the answer. Dropping them (and auditing the other 94 columns for the same pattern) keeps offline AUC honest instead of a fantasy that evaporates live." }
            ] }
        ]
      },
      {
        phase: "Features", icon: "🧬", title: "Engineer features",
        narrative: `<p>In a regulated scorecard a feature must clear three bars at once: it has to be <i>predictive</i>, <i>available at application time</i>, and <i>explainable</i> — because the law requires you to hand a denied applicant an adverse-action notice citing the real reasons. You standardize each feature to a z-score, $\\frac{x-\\mu}{\\sigma}$, so a $0.5$ debt-to-income and a $720$ bureau score live on the same scale and their coefficients are directly comparable. And you must avoid any variable that secretly proxies a protected attribute, no matter how predictive it looks.</p>`,
        concepts: ["fnd-norm", "ml-regularization"],
        insight: `<b>Predictive is not enough — it must be lawful and explainable.</b> A ZIP-code or 'neighborhood quality' feature can lift AUC, but it acts as a stand-in for race, and a decision driven by it is a fair-lending violation even if you never typed 'race' anywhere. The winning set — debt-to-income, bureau score, utilization, delinquency count, credit-history length — is causally tied to repayment and produces a clean reason code like 'high credit utilization'. Standardizing each as $\\frac{x-\\mu}{\\sigma}$ (mean $\\mu$, std $\\sigma$) makes the fitted weights comparable across features.`,
        data: {
          caption: "Scorecard features after standardizing to $z=\\frac{x-\\mu}{\\sigma}$",
          columns: ["feature", "raw $x$", "$\\mu$", "$\\sigma$", "z-score", "weight sign"],
          rows: [
            ["debt_to_income", "0.41", "0.28", "0.11", "+1.18", "+ (riskier)"],
            ["bureau_score", "640", "705", "60", "−1.08", "− (safer)"],
            ["utilization", "0.88", "0.45", "0.22", "+1.95", "+ (riskier)"],
            ["credit_hist_yrs", "3", "9", "5", "−1.20", "− (safer)"]
          ],
          note: `Each raw value $x$ becomes $z=\\frac{x-\\mu}{\\sigma}$ so all features are unit-free and coefficients are comparable. A '+' weight means higher values raise $P(\\text{default})$. Every column here is knowable at application and yields a defensible adverse-action reason.`
        },
        chart: { type: "bars", title: "Standardized z-scores for one applicant (+ raises risk)", labels: ["debt_to_income", "bureau_score", "utilization", "credit_hist_yrs"], values: [1.18, -1.08, 1.95, -1.20], valueLabels: ["+1.18", "-1.08", "+1.95", "-1.20"], colors: ["#ff7b72", "#7ee787", "#ff7b72", "#7ee787"] },
        symbols: [
          { sym: "$x$", desc: "the raw value of a feature for one applicant (e.g. utilization $=0.88$)." },
          { sym: "$\\mu$", desc: "the mean of that feature across the training population." },
          { sym: "$\\sigma$", desc: "the standard deviation of that feature — its typical spread around the mean." },
          { sym: "$\\frac{x-\\mu}{\\sigma}$", desc: "the z-score: how many standard deviations above ($+$) or below ($-$) average this applicant sits; puts all features on one scale." }
        ],
        steps: [{
          type: "decide", prompt: "Which feature set is best for a regulated scorecard?",
          options: [
            { label: "Debt-to-income ratio, bureau score, utilization, delinquency count, length of credit history", best: true, feedback: "every one is available at application, causally linked to repayment, and maps to a plain-English adverse-action reason ('too much existing debt', 'thin credit history'). Standardizing each as $\\frac{x-\\mu}{\\sigma}$ puts them on a common scale so the regularized coefficients are comparable and the resulting reason codes are honest. This is the set that is simultaneously accurate, legal, and explainable." },
            { label: "Applicant ZIP code and a 'neighborhood quality' index", feedback: "geography is a notorious proxy for race and national origin, so a model that leans on it produces disparate impact — illegal under fair-lending law regardless of how much AUC it adds. You also couldn't write a lawful reason code ('denied because of your neighborhood'). Predictive power earned through a proxy is a liability, not an asset." },
            { label: "Raw account numbers and the loan officer's name", feedback: "these are high-cardinality identifiers with no causal tie to whether a borrower repays; the model can only memorize them, which overfits the training book and generalizes to nothing. They also can't appear in an adverse-action notice. Pure noise plus overfitting risk." }
          ]
        }]
      },
      {
        phase: "Model", icon: "🧠", title: "Pick a model",
        narrative: `<p>Here is the central tension of regulated ML: you want the most accurate model, but lending law says you must be able to explain <i>every single decision</i> to the applicant and to an auditor. A logistic-regression scorecard — a generalized linear model — gives each feature one signed, monotonic weight, so the reason for any score is literally readable off the coefficients. The trick is to run that explainable model as the system of record while keeping a more flexible challenger alongside to measure exactly how much accuracy explainability is costing you.</p>`,
        concepts: ["ml-logistic-regression", "ml-glm", "cls-gradient-boosting"],
        insight: `<b>Choose the explainable model as the decision-maker, not the most accurate one.</b> A logistic GLM scores via $\\sigma(\\mathbf{w}^\\top\\mathbf{x})$ — each weight $w_j$ is the fixed, signed pull of feature $j$, so you can always say 'denied mainly for high utilization'. A boosted-tree challenger here reaches AUC $0.823$ versus the scorecard's $0.781$, a $+4.2$-point gap; you keep it running not to ship it, but to quantify the price of auditability and to flag when that gap grows worth a fight. In a regulated domain, an unexplainable $+4$ points can be illegal to use.`,
        symbols: [
          { sym: "$\\mathbf{x}$", desc: "the vector of standardized features for one applicant." },
          { sym: "$\\mathbf{w}$", desc: "the learned weight vector; $w_j$ is the signed influence of feature $j$ on the score." },
          { sym: "$\\mathbf{w}^\\top\\mathbf{x}$", desc: "the dot product — a weighted sum of the features, the linear score before squashing." },
          { sym: "$\\sigma(\\cdot)$", desc: "the logistic (sigmoid) function $\\frac{1}{1+e^{-z}}$ that maps the linear score to a probability $P(\\text{default})$ in $[0,1]$." }
        ],
        steps: [{
          type: "decide", prompt: "Choose the modeling approach.",
          options: [
            { label: "A regularized logistic-regression scorecard as the system of record, with a boosted-tree challenger monitored alongside", best: true, feedback: "the GLM scores as $\\sigma(\\mathbf{w}^\\top\\mathbf{x})$, so every decision decomposes into signed per-feature contributions — exactly what an adverse-action notice and a model audit require. Regularization keeps it from overfitting the sparse default class. Running the boosted-tree challenger in parallel tells you the accuracy you're trading away ($0.781$ vs $0.823$) without ever putting an unexplainable model in front of an applicant. Best of both worlds." },
            { label: "A deep neural net, because accuracy is everything", feedback: "in lending, accuracy you can't explain is worse than useless — it can be illegal. You're legally required to give a denied applicant the principal reasons, and a deep net's decision can't be reduced to honest reason codes. Chasing raw AUC into an unauditable model is how lenders end up in front of a regulator." },
            { label: "A single deep decision tree, unpruned", feedback: "an unpruned tree memorizes the training book (high variance) so it generalizes poorly, and its dozens of nested splits are nearly impossible to defend as a coherent, monotonic decision rule. A regularized linear scorecard both generalizes better on this $13.7{:}1$ data and explains in one sentence per feature." }
          ]
        }]
      },
      {
        phase: "Train", icon: "⚙️", title: "Train it",
        narrative: `<p>You fit the scorecard by <i>maximum likelihood</i> — choosing the weights $\\mathbf{w}$ that make the observed defaults and repayments most probable, which for logistic regression means minimizing log-loss. You add an L2 penalty $\\lambda\\lVert\\mathbf{w}\\rVert^2$ so no single coefficient blows up on the rare default class and the weights stay stable and monotonic. A crucial regulatory check rides along: every coefficient must end up signed the way domain sense demands (more utilization $\\Rightarrow$ more risk), or the scorecard is rejected no matter its AUC.</p>`,
        concepts: ["ml-likelihood", "ml-regularization", "ml-gradient-descent"],
        insight: `<b>Maximum likelihood, kept honest by a penalty.</b> Training minimizes log-loss ($0.214$ here after 38 iterations) — the negative log-likelihood of the data under the model. The L2 term $\\lambda\\lVert\\mathbf{w}\\rVert^2$ shrinks the weights toward zero, trading a little fit for a lot of stability on the $6.8\\%$ minority class, and it's what guarantees the coefficients stay monotonic and signed as expected. The result: scorecard AUC $0.781$, with the unconstrained GBM challenger at $0.823$ ($+4.2$ pts) marking the ceiling.`,
        symbols: [
          { sym: "$\\mathbf{w}$", desc: "the weight vector being fit; one signed coefficient per feature." },
          { sym: "$\\lambda$", desc: "the regularization strength — how hard the L2 penalty pulls the weights toward zero (bigger $\\lambda$ = simpler, more stable model)." },
          { sym: "$\\lVert\\mathbf{w}\\rVert^2$", desc: "the squared L2 norm of the weights, $\\sum_j w_j^2$ — the size of the coefficients the penalty shrinks." },
          { sym: "log-loss", desc: "the negative log-likelihood per loan; the quantity maximum-likelihood training drives down ($0.214$ at convergence)." },
          { sym: "AUC", desc: "area under the ROC curve — the chance the model ranks a random defaulter above a random repayer; $0.5$ is coin-flip, $1.0$ is perfect." }
        ],
        steps: [{
          type: "run", label: "▶ Fit logistic scorecard + GBM challenger",
          result: { log: "fitting logistic regression (L2, MLE)...\nconverged in 38 iterations, log-loss 0.214\nvalid AUC (scorecard): 0.781\ntraining GBM challenger...\nvalid AUC (challenger): 0.823  (+4.2 pts)\nall coefficients monotonic & signed as expected", metrics: [{ k: "scorecard AUC", v: "0.781" }, { k: "challenger AUC", v: "0.823" }], chart: { type: "bars", title: "Valid AUC: explainable scorecard vs GBM challenger", labels: ["scorecard", "challenger"], values: [0.781, 0.823], valueLabels: ["0.781", "0.823 (+4.2 pts)"], colors: ["#4ea1ff", "#ffb454"] } } }
        ]
      },
      {
        phase: "Evaluate", icon: "📊", title: "Evaluate honestly",
        narrative: `<p>You ship a <i>cutoff</i>, not an AUC, so you evaluate at the threshold where the business actually operates — and on an <b>out-of-time</b> holdout (loans booked after the training cutoff) so the test mimics the future, not a random shuffle of the past. Two things must hold: the approve/deny trade-off must respect your risk appetite, and the probabilities must be <b>calibrated</b>, because you price loans directly off $P(\\text{default})$. Here predicted PD matches actual within $1.2\\%$ per decile — close enough to trust the numbers you'll price on.</p>`,
        concepts: ["ml-roc-auc", "ml-classification-metrics", "ml-likelihood"],
        insight: `<b>A cutoff turns one probability into a portfolio.</b> Tightening the approval threshold trades volume for safety: approve if $\\text{PD} &lt; 0.10$ books $71\\%$ of applicants at a $3.1\\%$ bad-rate, while loosening to $\\text{PD} &lt; 0.20$ books $88\\%$ but lets the bad-rate climb to $5.9\\%$. With a risk-appetite ceiling of $4\\%$, only the tighter cutoff is even legal to run. Calibration ($1.2\\%$/decile) is what makes these projected bad-rates believable. You <i>check</i> it by binning: sort the holdout by predicted PD, cut into $10$ equal deciles, and in each bin compare the mean predicted PD against the observed default fraction — a calibrated model has the two within $1.2\\%$ in every bin (this is a reliability plot). If they diverge, you <i>fix</i> it with a monotonic remap learned on a calibration slice — Platt scaling fits $P_{\\text{cal}}=\\sigma(a\\cdot s+b)$ (a $1$-D logistic on the raw score $s$), or isotonic regression fits a free step-wise non-decreasing curve — so an uncalibrated $3.1\\%$ quote is bent back onto the true frequency before you price on it.`,
        data: {
          caption: "Cutoff $\\to$ approval rate $\\to$ bad-rate (out-of-time holdout, 60K loans)",
          columns: ["approve if PD &lt;", "approval rate", "bad-rate (approved)", "vs 4% cap"],
          rows: [
            ["0.05", "54%", "1.8%", "well under ✓"],
            ["0.10", "71%", "3.1%", "under ✓"],
            ["0.15", "81%", "4.4%", "over ✗"],
            ["0.20", "88%", "5.9%", "over ✗"]
          ],
          note: `Each row is one operating point. Looser cutoffs (higher PD allowed) approve more volume but admit riskier loans, so the bad-rate rises. The risk appetite caps approved-book bad-rate at $4\\%$, which rules out the $0.15$ and $0.20$ rows.`
        },
        chart: { type: "line", title: "Approval rate vs approved-book bad-rate (4% risk cap)", xlabel: "approval rate (%)", ylabel: "bad-rate (%)", series: [ { name: "bad-rate", color: "#4ea1ff", points: [[54, 1.8], [71, 3.1], [81, 4.4], [88, 5.9]] }, { name: "4% cap", color: "#ff7b72", points: [[54, 4], [88, 4]] } ] },
        symbols: [
          { sym: "$P(\\text{default})$ / PD", desc: "the model's predicted probability that a given applicant defaults." },
          { sym: "PD &lt; 0.10", desc: "the cutoff rule: approve only applicants whose predicted default probability is below 0.10." },
          { sym: "bad-rate", desc: "the share of <i>approved</i> loans that actually default — the realized loss rate of the book." },
          { sym: "calibration", desc: "agreement between predicted PD and observed default frequency; checked by binning into PD deciles and comparing mean-predicted vs actual-default in each bin (here within $1.2\\%$)." },
          { sym: "Platt / isotonic", desc: "two ways to fix miscalibration: Platt fits $\\sigma(a\\,s+b)$, a 1-D logistic on the score $s$; isotonic fits a free non-decreasing step curve. Both map raw scores onto true frequencies." }
        ],
        steps: [
          { type: "run", label: "▶ Evaluate on out-of-time holdout", result: { log: "out-of-time holdout: 60,000 loans (booked after training cutoff)\nAUC 0.776\ncalibration check: bin by PD into 10 deciles, compare mean-predicted vs observed-default per bin\n  decile 1: pred 0.9% vs actual 1.1%  | decile 5: pred 5.4% vs actual 6.2%  | decile 10: pred 31.0% vs actual 29.9%\n  max gap 1.2% per decile -> well calibrated, no Platt/isotonic remap needed\n@ approve if PD &lt; 0.10 -> approval 71%, bad-rate among approved 3.1%\n@ approve if PD &lt; 0.20 -> approval 88%, bad-rate among approved 5.9%", metrics: [{ k: "AUC", v: "0.776" }, { k: "approval@0.10", v: "71%" }, { k: "bad-rate", v: "3.1%" }], chart: { type: "roc", title: "ROC curve (out-of-time holdout)", auc: 0.776, points: [[0, 0], [0.1, 0.42], [0.3, 0.68], [0.5, 0.82], [0.7, 0.91], [1, 1]] } } },
          { type: "decide", prompt: "Risk appetite caps the approved-book bad-rate at 4%. Which cutoff?",
            options: [
              { label: "Approve if PD &lt; 0.10 — 71% approval, 3.1% bad-rate", best: true, feedback: "the only choice that respects the hard $4\\%$ loss ceiling, with comfortable headroom at $3.1\\%$. It still books $71\\%$ of applicants, so you're not leaving much volume on the table. The right way to read this stage: pick the loosest cutoff that stays under the risk cap — that maximizes approved volume subject to the loss constraint." },
              { label: "Approve if PD &lt; 0.20 — 88% approval", feedback: "the extra $17$ points of approval are tempting, but at $5.9\\%$ the approved book breaches the $4\\%$ ceiling and the portfolio loses money on the marginal loans. Volume that violates risk appetite isn't growth — it's a future write-off. The constraint, not the approval rate, sets the cutoff." }
            ] }
        ]
      },
      {
        phase: "Iterate", icon: "🔁", title: "Diagnose & iterate",
        narrative: `<p>The boosted-tree challenger beats the scorecard by $4.2$ AUC points, and someone wants to ship it — until a fairness audit flags <b>disparate impact</b>: at the <i>same</i> predicted risk, a protected group is approved far less often. That gap means the model's extra accuracy is partly riding on features that proxy a protected attribute. There are two legally distinct concepts in play, and only one fix is lawful: you must remove the cause (the proxy features), not paper over the symptom (the approval gap).</p>`,
        concepts: ["ml-bias-variance", "mlx-error-analysis", "mlx-cross-validation"],
        insight: `<b>Disparate impact vs disparate treatment — fix the features, never the cutoff.</b> Disparate <i>impact</i> is an outcome gap with no intent; disparate <i>treatment</i> is using the protected attribute in the decision itself. The trap is that 'just equalize approvals with a per-group threshold' looks fair but <i>is</i> disparate treatment — explicitly illegal. The lawful path: do error analysis to find which features drive the gap, strip those proxies, re-fit, and re-validate with cross-validation so you know the fix generalizes out-of-fold. A $+4.2$-point gain sourced from an illegal feature is worth exactly zero.`,
        symbols: [
          { sym: "AUC", desc: "the ranking-quality score; the challenger's $0.823$ beats the scorecard's $0.781$ by $4.2$ points." },
          { sym: "disparate impact", desc: "different approval rates across a protected group at equal true risk, regardless of intent." },
          { sym: "disparate treatment", desc: "using a protected attribute (e.g. via a per-group cutoff) directly in the decision — illegal even when 'well-intentioned'." }
        ],
        steps: [{
          type: "decide", prompt: "The high-AUC challenger shows disparate impact. Best response?",
          options: [
            { label: "Trace which features drive the disparity, remove the proxies, and re-fit — re-validate fairness with cross-validation before shipping", best: true, feedback: "this attacks the root cause. Error analysis on the gap reveals which inputs act as proxies for the protected attribute; removing them and re-fitting kills the disparate impact at its source, and cross-validation confirms the fix isn't a fluke of one split. Accuracy that came from an illegal feature was never accuracy you could keep." },
            { label: "Ship it anyway — it has the best AUC", feedback: "disparate impact is a regulatory violation independent of how accurate the model is; a high AUC is no defense in an enforcement action. Shipping it trades a $4$-point metric for legal and reputational exposure that dwarfs any modeling gain." },
            { label: "Add an explicit per-group cutoff to equalize approvals", feedback: "this is the seductive trap: setting different thresholds by group uses the protected attribute in the decision, which is disparate <i>treatment</i> — also illegal, and arguably worse because the discrimination is now explicit. You must remove the features that cause the gap, not bolt a group-aware rule onto the cutoff." }
          ]
        }]
      },
      {
        phase: "Deploy", icon: "🚀", title: "Deploy to production",
        narrative: `<p>An underwriting decision happens the instant someone hits 'apply', and the law and your auditors impose two extra constraints a normal model deploy doesn't: every denial must return a human-readable <i>reason code</i>, and every score must be reproducible months later. So you deploy real-time scoring that emits reason codes inline and logs the exact model version against each decision — that way a regulator can replay any past score and you can defend it. A shadow run first confirms the new scorecard agrees with current policy ($94\\%$) before it touches a real applicant.</p>`,
        concepts: ["ml-logistic-regression", "ml-classification-metrics"],
        insight: `<b>Reproducibility and reason codes are deploy requirements, not nice-to-haves.</b> Reason codes are generated for $100\\%$ of denials here because an adverse-action notice is legally mandatory; logging the model version per score means any of millions of past decisions can be replayed exactly. The shadow run's $94\\%$ agreement with the existing policy is the safety gate — high enough to trust, but the $6\\%$ of disagreements are precisely where you inspect whether the new model is smarter or broken before going live.`,
        symbols: [
          { sym: "reason code", desc: "the legally-required plain-English factor behind a denial (e.g. 'high utilization'), read off the scorecard's top contributing features." },
          { sym: "shadow run", desc: "running the new model silently alongside the live policy to compare decisions without affecting anyone; $94\\%$ agreement here." }
        ],
        steps: [
          { type: "decide", prompt: "How should the model go live?",
            options: [
              { label: "Real-time scoring at application, with reason codes returned per decision and the model version logged for every score", best: true, feedback: "underwriting must be instant (applicants and competitors expect a decision in seconds), legally explainable (every denial needs an adverse-action reason), and reproducible (a logged model version lets you replay any past score for audit). Real-time scoring with inline reason codes and version logging satisfies all three at once — it's the only design that's both competitive and defensible." },
              { label: "Score in a weekly batch and mail decisions later", feedback: "a weekly batch fails the basic product requirement: applicants get an instant 'yes' from a competitor while yours is still queued, so you lose the business outright. Batch scoring is fine for portfolio reporting, but a credit <i>decision</i> has to be synchronous at application time." }
            ] },
          { type: "run", label: "▶ Ship scorecard v1 (shadow → live)", result: { log: "deploying scorecard v1...\nshadow run vs current policy: 94% decision agreement\nreason codes generated for 100% of denials\nmodel card + feature lineage filed for audit\npromoting to live underwriting.", metrics: [{ k: "agreement", v: "94%" }, { k: "reason codes", v: "100%" }] } }
        ]
      },
      {
        phase: "Monitor", icon: "📡", title: "Monitor & maintain (MLOps)",
        narrative: `<p>Credit models decay slowly and silently: the economy shifts the applicant pool, but the ground-truth default label arrives 18+ months late, so by the time AUC visibly drops you've already booked a year and a half of bad loans. The escape is to watch <b>leading indicators</b> that move now — input drift via the Population Stability Index (PSI), and early-payment delinquency as a fast proxy for eventual default — and only confirm with the slow bad-rate once labels mature. Monitoring here is an early-warning system, not a post-mortem.</p>`,
        concepts: ["mlx-error-analysis", "ml-roc-auc"],
        insight: `<b>When the label lags 18 months, monitor the leading indicators.</b> You can't wait for final 90+ dpd outcomes, so you watch what shifts immediately: PSI on <code>utilization</code> jumped $0.09 \\to 0.27$ (a value above $0.25$ signals a major population shift — here, rising interest rates), and early 3-month delinquency on the new book rose $1.8\\% \\to 2.6\\%$. PSI itself is computed in three steps: (1) freeze the training distribution into $B$ bins (usually $10$ deciles), recording the fraction of training rows in each bin, $e_i$ (expected); (2) drop the current population into those same fixed bin edges to get $a_i$ (actual); (3) sum $\\text{PSI}=\\sum_{i=1}^{B}(a_i-e_i)\\ln\\frac{a_i}{e_i}$ — each bin contributes more the further its share moved and the larger the log-ratio, so a few bins filling up while others empty drives PSI past $0.25$. Both signals fired before a single full default label landed, which is exactly the point — they buy you the lead time to recalibrate the cutoff before the losses are locked in.`,
        data: {
          caption: "This quarter's monitor panel (alert if PSI $&gt; 0.25$ or early-delinq rises)",
          columns: ["signal", "baseline", "now", "status"],
          rows: [
            ["PSI (utilization)", "0.09", "0.27", "⚠ major shift"],
            ["score mean", "0.00", "−0.05", "drifting riskier"],
            ["early-delinq (3mo)", "1.8%", "2.6%", "⚠ rising"],
            ["full bad-rate (24mo)", "—", "pending", "labels not matured"]
          ],
          note: `PSI measures how far the input distribution has moved from the training population: $&lt;0.1$ stable, $0.1$–$0.25$ moderate, $&gt;0.25$ a major shift needing action. The full bad-rate is still '—' because those loans haven't matured — which is why the leading signals matter.`
        },
        symbols: [
          { sym: "PSI", desc: "Population Stability Index $=\\sum_i (a_i-e_i)\\ln\\frac{a_i}{e_i}$ over fixed training bins, where $e_i$/$a_i$ are the expected/actual share of rows in bin $i$; $&lt;0.1$ stable, $0.1$–$0.25$ moderate, $&gt;0.25$ a major shift." },
          { sym: "$e_i$ / $a_i$", desc: "the fraction of rows in bin $i$ in the training (expected) vs current (actual) population — the two distributions PSI compares bin by bin." },
          { sym: "90+ dpd", desc: "'90 or more days past due' — the slow, definitive default label that arrives 18+ months after booking." },
          { sym: "early-delinquency", desc: "the share of new loans already late within 3 months — a fast, leading proxy for eventual default." },
          { sym: "AUC", desc: "the model's ranking quality; here it only drops <i>after</i> labels mature, which is why you can't rely on it alone to catch decay early." }
        ],
        steps: [
          { type: "decide", prompt: "What do you monitor for a model whose true labels lag 18 months?",
            options: [
              { label: "Population stability of inputs/scores (PSI), early-delinquency rates as a leading proxy, approval mix, and calibration as labels mature", best: true, feedback: "the label is censored by time, so outcome metrics are blind for 18 months — you instead watch what moves now. PSI catches a shifting applicant pool ($0.09\\to0.27$ = rates rose), early-delinquency is a fast proxy for default ($1.8\\%\\to2.6\\%$), and calibration gets re-checked as labels trickle in. Together they let you recalibrate the cutoff before the slow bad-rate confirms the damage — that's the whole value of leading indicators." },
              { label: "Just wait for the final 90+ dpd outcomes before reacting", feedback: "by the time the definitive 90+ dpd labels arrive, 18 months of bad loans are already on the books and the losses are locked in. Waiting for the lagging metric turns monitoring into an autopsy; the leading indicators (PSI, early-delinquency) exist precisely so you can act while it still matters." }
            ] },
          { type: "run", label: "▶ Check this quarter's monitors", result: { log: "PSI on 'utilization' (10 fixed training bins): sum (actual-expected)*ln(actual/expected)\n  e.g. high-util bin expected 10% but now 17%: (0.17-0.10)*ln(0.17/0.10)=+0.037; summing all 10 bins -> 0.27\nPSI 0.09 -> 0.27 (>0.25 = major population shift: rates rose)\nscore mean drifted -0.05 toward higher risk\nearly-delinquency (3mo) on new book: 1.8% -> 2.6% ALERT\naction: open review, recalibrate cutoff, schedule refit on recent vintages", metrics: [{ k: "PSI", v: "0.27 ⚠" }, { k: "early-delinq", v: "2.6% ⚠" }] }, note: `Rising rates shifted the applicant pool. Monitoring caught it via PSI and early delinquency before the full default labels arrive — triggering a recalibration back at the <b>Data</b> stage.` }
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
        narrative: `<p>You run the spam filter for a messaging platform. About $7\\%$ of traffic is spam, but the two errors are wildly asymmetric: a false ban silences a real person and burns trust, while a miss lets a scam reach an inbox. Because adversaries actively probe and adapt to whatever you ship, this is a moving target, not a fixed dataset — you're designing a control loop, not a one-off classifier.</p>`,
        concepts: ["ml-classification-metrics", "prob-bayes", "ml-supervised"],
        insight: `<b>The asymmetry is the whole problem.</b> Spam is only $\\approx 7\\%$ of messages, so a model that flags nothing is already $93\\%$ accurate and totally useless. What actually matters is the cost ratio: one wrongful ban (a silenced real user filing an appeal) is far costlier to the platform than one missed spam, so you optimize <b>recall under a hard precision floor</b> — never raw accuracy.`,
        symbols: [
          { sym: "$P(\\text{spam}\\mid x)$", desc: "the model's probability that message $x$ is spam — the score you threshold to ban, allow, or route to review." },
          { sym: "precision", desc: "of everything flagged as spam, the fraction that truly is spam; low precision means wrongful bans." },
          { sym: "recall", desc: "of all true spam, the fraction the model actually catches; low recall means scams slip through." }
        ],
        steps: [{
          type: "decide", prompt: "What objective fits content moderation?",
          options: [
            { label: "High recall on spam at a precision floor that keeps false bans rare, with a human-review queue for the gray zone", best: true, feedback: "right, and here's the mechanism: you hold precision above a floor (say $0.97$) so wrongful bans stay rare, then push recall as high as that floor allows. The uncertain middle band — where $P(\\text{spam}\\mid x)$ is neither high nor low — goes to humans instead of an automatic ban, so the model never gambles on a real user's account. This directly encodes the asymmetric cost of the two errors." },
            { label: "Maximize raw accuracy", feedback: "the trap is the $7\\%$ base rate: a classifier that labels everything 'ham' scores $93\\%$ accuracy while catching zero spam. Accuracy rewards the majority class, so it actively pushes you toward doing nothing. Imbalanced problems need precision/recall, not accuracy." },
            { label: "Block anything that looks even slightly unusual", feedback: "this maximizes recall by torching precision. At platform scale a few percent of false bans is tens of thousands of silenced real users per day — the single worst outcome for the product. You'd 'catch all spam' and lose your user base doing it." }
          ]
        }]
      },
      {
        phase: "Data", icon: "🗄️", title: "Gather the data",
        narrative: `<p>You need a corpus labeled spam vs ham. Labels come from three sources — confirmed moderator takedowns, user reports, and the gold human audit — and each carries its own bias: takedowns are precise but sparse, reports are abundant but gameable. How you combine them decides whether the model learns real abuse or just your old filter's habits. You also hold out a clean hand-audited set so your final numbers aren't measured against noisy labels.</p>`,
        concepts: ["ml-supervised", "prob-bayes"],
        insight: `<b>Three label sources, three biases.</b> Of $2.4$M messages, only $168$K ($7.0\\%$) are confirmed-takedown spam — your highest-precision positives. User reports add $410$K weak signals, but $\\approx 9\\%$ of them disagree with a moderator audit, so trusting them blindly injects label noise. The fix is a label hierarchy: takedowns as strong labels, reports as weak ones, and $50$K human-audited messages frozen as the gold test set so evaluation is never contaminated.`,
        data: {
          caption: "A few rows of the labeled sample (text snippets, label source, link count)",
          columns: ["message snippet", "label", "source", "n_links", "lang"],
          rows: [
            ["\"hey are we still on for lunch?\"", "ham", "audit", "0", "en"],
            ["\"CLAIM your $500 reward now bit.ly/…\"", "spam", "takedown", "3", "en"],
            ["\"check out my page, free followers\"", "spam", "report", "1", "en"],
            ["\"reunión mañana a las 10\"", "ham", "audit", "0", "es"],
            ["… 2.4M rows", "…", "…", "…", "…"]
          ],
          note: `Confirmed-takedown rows are trustworthy positives; report-sourced rows are weak labels ($\\approx 9\\%$ wrong). Spam skews toward short text with many links; ham skews longer with few. $62\\%$ of messages are English, but $31$ languages appear.`
        },
        chart: { type: "bars", title: "Label sources by volume (messages)", labels: ["takedown (strong)", "report (weak)", "gold audit (test)"], values: [168000, 410000, 50000], valueLabels: ["168K", "410K", "50K"], colors: ["#7ee787", "#ffb454", "#4ea1ff"] },
        symbols: [
          { sym: "$P(\\text{spam}\\mid x)$", desc: "probability message $x$ is spam — what the model learns from these labels." },
          { sym: "n_links", desc: "count of URLs in a message; a strong blast/scam signal, near $0$ for normal chat." }
        ],
        steps: [
          { type: "decide", prompt: "How do you build a trustworthy training label?",
            options: [
              { label: "Combine confirmed moderator takedowns (high precision) with user reports as weak signals, holding out a clean human-audited test set", best: true, feedback: "the mechanism is a label hierarchy: moderator takedowns are ground truth, so they anchor the positive class; user reports are abundant but $\\approx 9\\%$ wrong, so you down-weight them as weak labels rather than discarding their volume. Crucially you freeze a hand-audited gold set for evaluation, so noisy training labels can never inflate your reported numbers. You get scale and an honest yardstick." },
              { label: "Treat every user report as spam", feedback: "the trap is that reports are an adversarial, gameable signal — users mass-report rivals, dissenting opinions, and content they merely dislike. Train on raw reports and the model learns to ban unpopular-but-legitimate speech, manufacturing false bans at scale. Reports are a hint, not a label." },
              { label: "Label spam only from messages your old keyword filter already caught", feedback: "this caps the model at the old filter's ceiling: every label is something keywords already flagged, so the model just clones their blind spots and never sees the obfuscated or novel spam keywords miss. You'd ship an expensive copy of the system you're trying to replace." }
            ] },
          { type: "run", label: "▶ Pull labeled message sample", prompt: "Pull a labeled spam/ham sample.",
            result: { log: "sampling message stream...\nloaded 2,400,000 messages\nconfirmed-takedown spam: 168,000 (7.0%)\nuser-reported (weak): 410,000\nheld out 50,000 human-audited messages as gold test set\nlanguages: 31 (en 62%)", metrics: [{ k: "messages", v: "2.4M" }, { k: "spam rate", v: "7.0%" }, { k: "languages", v: "31" }] } }
        ]
      },
      {
        phase: "Explore", icon: "🔍", title: "Explore & clean",
        narrative: `<p>Before modeling, profile the corpus and hunt for the three traps text data hides: duplicated campaigns, leaky columns, and label noise. The biggest here is that $22\\%$ of spam are near-identical blasts — if you split train/test randomly, copies of the same message land on both sides and your score is fiction. You also find a column written by the old filter (leakage) and confirm $\\approx 9\\%$ of weak labels disagree with the audit.</p>`,
        concepts: ["mlx-error-analysis", "ml-classification-metrics"],
        insight: `<b>Duplicates leak across the split.</b> $22\\%$ of spam rows are near-duplicate campaign blasts, so a naive random split puts identical messages in both train and test — the model memorizes the blast and reports an inflated score that collapses on truly new spam. Two more traps: <b>was_auto_removed</b> is set by the OLD filter, so it's only known after a decision (target leakage), and $\\approx 9\\%$ of user-report labels disagree with the moderator audit. The cure is to dedupe, split by campaign/sender, and drop post-decision columns.`,
        data: {
          caption: "Corpus profile — what to fix before splitting",
          columns: ["issue", "found", "why it hurts", "fix"],
          rows: [
            ["dup campaigns", "22% of spam", "leaks across split", "dedupe + group split"],
            ["was_auto_removed", "leaky column", "set post-decision", "drop it"],
            ["report label noise", "≈9% wrong", "mislabels training", "weak-label down-weight"],
            ["length/links skew", "spam short, many links", "—", "keep as features"]
          ],
          note: `Splitting <i>by campaign/sender</i> (not by row) keeps every variant of a blast on one side, so test spam is genuinely unseen. A leaky column makes offline AUC look magical and then vanishes live.`
        },
        symbols: [
          { sym: "$\\approx$", desc: "\"approximately equal to\" — the $9\\%$ noise figure is an estimate from the audit sample." }
        ],
        steps: [
          { type: "run", label: "▶ Profile the corpus", result: { log: "duplicate spam campaigns: 22% of spam are near-identical blasts\nfeature 'was_auto_removed' present -> set by the OLD filter (LEAKAGE)\nuser-report label noise: ~9% disagree with moderator audit\nham skews longer; spam skews short + many links", metrics: [{ k: "dup spam", v: "22%" }, { k: "label noise", v: "9%" }] } },
          { type: "decide", prompt: "22% of spam rows are near-duplicate blasts from the same campaigns. What's the risk?",
            options: [
              { label: "Naively splitting train/test lets identical messages land in both — leaking and inflating your score", best: true, feedback: "the mechanism: with $22\\%$ duplicates, a random row-level split scatters copies of the same blast into train AND test, so the model can memorize a campaign in training and 'recognize' it in test. That isn't generalization — it's a leak that inflates offline recall and evaporates the moment a genuinely new campaign appears. Dedupe, then split by campaign/sender so no variant of a test blast was ever trained on." },
              { label: "Nothing — more spam examples is always better", feedback: "the trap is that duplicates add almost no information — the model already saw that exact blast — yet they actively harm you by leaking across the split. So you pay twice: no learning gain, and an overstated metric that lies about live performance. Quantity of near-identical rows is not signal." }
            ] }
        ]
      },
      {
        phase: "Features", icon: "🧬", title: "Engineer features",
        narrative: `<p>Turn raw text into numbers a model can score. The classic spam representation is TF-IDF over word and character n-grams: each message becomes a sparse vector of weighted term counts, which a Naive-Bayes or linear model reads as word-level evidence. But word counts miss paraphrased abuse, so you add embedding vectors for meaning and link/sender metadata to catch blast patterns the text alone hides.</p>`,
        concepts: ["ml-naive-bayes", "dl-word-embeddings"],
        insight: `<b>TF-IDF turns a message into a sparse weighted bag of terms.</b> A term's weight is $\\text{tf}\\times\\text{idf}$: $\\text{tf}$ is how often the term appears in this message, and $\\text{idf}=\\ln\\frac{N}{1+df}$ where $N$ is the total number of messages and $df$ is how many of them contain the term — so a term in every message ($df\\approx N$) gets $\\text{idf}\\approx 0$ and is crushed, while a rare term ($df$ small) gets a large idf and is amplified. So 'free', 'bit.ly', and 'reward' light up on spam while 'the' and 'and' fall to near-zero. The Naive-Bayes baseline then scores a message by treating each term independently: it sums per-term log-odds, $\\text{score}=\\ln\\frac{P(\\text{spam})}{P(\\text{ham})}+\\sum_{w\\in\\text{msg}}\\ln\\frac{P(w\\mid\\text{spam})}{P(w\\mid\\text{ham})}$, where each $P(w\\mid\\text{class})$ is just (smoothed) word counts in that class. Each message is a vector over tens of thousands of terms but only a handful are non-zero — that sparsity is exactly what makes this sum fast enough for millions of messages.`,
        data: {
          caption: "A TF-IDF doc-term corner — rows are messages, cells are $\\text{tf}\\times\\text{idf}$ weights (mostly $0$)",
          columns: ["msg / term →", "free", "reward", "bit.ly", "lunch", "n_links"],
          rows: [
            ["msg 1 (ham)", "0.0", "0.0", "0.0", "0.71", "0"],
            ["msg 2 (spam)", "0.44", "0.52", "0.61", "0.0", "3"],
            ["msg 3 (spam)", "0.39", "0.0", "0.58", "0.0", "1"],
            ["… 2.4M msgs", "…", "…", "…", "…", "…"]
          ],
          note: `Most of the $\\approx 40$K-term vocabulary is $0$ for any single message. <b>n_links</b> is appended metadata, not a word — it catches blasts even when the text looks clean. Embedding vectors (not shown) sit alongside to catch paraphrases that swap these exact words.`
        },
        symbols: [
          { sym: "$\\text{tf}\\times\\text{idf}$", desc: "term-frequency times inverse-document-frequency: a term's count in this message, up-weighted if it's rare across the corpus." },
          { sym: "$\\text{idf}=\\ln\\frac{N}{1+df}$", desc: "inverse-document-frequency: $N$ = total messages, $df$ = messages containing the term; common terms get $\\approx 0$, rare terms get a large weight." },
          { sym: "$\\sum_w \\ln\\frac{P(w\\mid\\text{spam})}{P(w\\mid\\text{ham})}$", desc: "the Naive-Bayes score: a sum of per-word log-odds (plus the prior log-odds), treating each word as independent evidence." },
          { sym: "n_links", desc: "number of URLs in the message, used as metadata alongside the text vector." }
        ],
        steps: [{
          type: "decide", prompt: "Which representation should you start with?",
          options: [
            { label: "TF-IDF word/char n-grams (great Naive-Bayes baseline) plus embedding vectors for semantic abuse, with link/sender metadata", best: true, feedback: "this layers three complementary signals. TF-IDF n-grams give a fast, interpretable baseline — Naive-Bayes scores word probabilities $P(\\text{spam}\\mid w)$ directly, and char n-grams survive the misspellings spammers use. Embeddings add meaning, catching paraphrased abuse that swaps the exact words. Metadata (links, sender age) catches blast patterns the text hides. Each layer covers a different evasion, so the stack is hard to route around." },
            { label: "Only the message length and number of emojis", feedback: "the trap is that these are trivially gamed and far too coarse: a spammer pads text to mimic ham length and drops the emojis in seconds. Two scalar features can't separate spam from ham across $31$ languages — you've thrown away the word-level statistics that make filtering work." },
            { label: "The raw unicode bytes fed directly to a linear model", feedback: "raw bytes give a linear model no usable structure — there's no notion of a 'word' or a term probability, so you lose exactly the word-level statistics ($P(\\text{spam}\\mid w)$) that spam filtering is built on. You'd need a deep sequence model just to recover what TF-IDF hands you for free." }
          ]
        }]
      },
      {
        phase: "Model", icon: "🧠", title: "Pick a model",
        narrative: `<p>You need a fast first line that scores millions of messages per minute cheaply, plus depth for cleverly-disguised abuse that word counts miss. The resolution is a tiered cascade: a cheap linear/Naive-Bayes filter handles the easy, obvious cases, and only the uncertain middle escalates to an expensive transformer. This spends compute where it actually changes the decision, which is the only way the economics work at platform scale.</p>`,
        concepts: ["ml-naive-bayes", "ml-logistic-regression", "mod-transformer"],
        insight: `<b>A cascade pays for itself.</b> The cheap first stage confidently resolves $\\approx 88\\%$ of traffic (clear spam or clear ham), so only the hard $\\approx 12\\%$ reaches the transformer. If the transformer is, say, $100\\times$ more expensive per message than the linear filter, running it on everything costs roughly $8\\times$ more than running it on just the uncertain $12\\%$ — same accuracy on the hard cases, a fraction of the bill. The first stage isn't a weaker model; it's a router.`,
        symbols: [
          { sym: "$P(\\text{spam}\\mid w)$", desc: "Naive-Bayes' per-word spam probability; the first stage combines these across a message's words." },
          { sym: "$\\approx$", desc: "\"approximately\" — coverage and cost figures are rough operating estimates." },
          { sym: "$\\times$", desc: "\"times\" — used here for the cost multiple of the transformer over the linear filter." }
        ],
        steps: [{
          type: "decide", prompt: "Choose a model stack.",
          options: [
            { label: "A cheap linear/Naive-Bayes first filter for obvious spam, escalating the uncertain middle to a transformer abuse classifier", best: true, feedback: "the design insight is that most messages are easy — clearly spam or clearly ham — and a cheap linear model resolves them confidently. So you route only the uncertain $\\approx 12\\%$ to the transformer, spending its high per-message cost exactly where it changes the decision. You get transformer-level accuracy on hard, context-dependent abuse at a fraction of the compute, which is the only trade-off that survives millions of messages a minute." },
            { label: "Run the largest transformer on every single message", feedback: "the trap is cost: it's accurate but you'd burn the bulk of your compute budget re-confirming spam the cheap filter already nailed. At platform volume that's slow and ruinously expensive — you pay transformer prices for the easy $88\\%$ that never needed it." },
            { label: "Keyword blocklist only", feedback: "fixed keywords are trivially evaded — spammers swap in misspellings, homoglyphs, and zero-width characters, and your static list can't adapt. You need a learned model whose features generalize beyond exact strings; a blocklist is a starting heuristic, not the system." }
          ]
        }]
      },
      {
        phase: "Train", icon: "⚙️", title: "Train it",
        narrative: `<p>Fit the two stages on their respective jobs. The linear/Naive-Bayes first stage trains on the full TF-IDF corpus to separate the easy $88\\%$, then the transformer is fine-tuned only on the uncertain $12\\%$ where context matters. Throughout you use campaign-grouped splits so no variant of a test blast was trained on — otherwise the $22\\%$ duplicates would leak and the AUC would be a fantasy.</p>`,
        concepts: ["ml-logistic-regression", "ml-gradient-descent", "mod-transformer"],
        insight: `<b>Each stage is measured on its own job.</b> The first stage hits valid AUC $0.951$ and confidently covers $88\\%$ of traffic — that's its real role, a high-precision router, not the final word. The transformer is then judged by F1 ($0.88$) on the hard abuse it actually sees, because on that uncertain $12\\%$ the classes are closer to balanced and you care about precision and recall jointly. The campaign-grouped split is what makes both numbers trustworthy.`,
        symbols: [
          { sym: "AUC", desc: "area under the ROC curve: probability the model ranks a random spam above a random ham; $1.0$ is perfect, $0.5$ is chance." },
          { sym: "F1", desc: "harmonic mean of precision and recall; rewards a model that is good at both at once, used here on the harder, more balanced second stage." }
        ],
        steps: [{
          type: "run", label: "▶ Train tiered stack",
          result: { log: "training NB/logistic first-stage on TF-IDF...\nfirst-stage valid AUC 0.951, covers 88% of traffic confidently\nfine-tuning transformer on the uncertain 12%...\nsecond-stage valid F1 0.88 on hard abuse\ncampaign-grouped split (no leakage)", metrics: [{ k: "stage-1 AUC", v: "0.951" }, { k: "stage-2 F1", v: "0.88" }], chart: { type: "bars", title: "Two-stage scores: cheap router AUC and transformer F1", labels: ["stage-1 AUC (covers 88%)", "stage-2 F1 (hard 12%)"], values: [0.951, 0.88], valueLabels: ["0.951", "0.88"], colors: ["#4ea1ff", "#c89bff"] } } }
        ]
      },
      {
        phase: "Evaluate", icon: "📊", title: "Evaluate honestly",
        narrative: `<p>You ship a <i>threshold</i>, not an AUC, so the real question is where to set the auto-ban cutoff on the hand-audited gold set. As you raise the threshold, precision climbs and the false-ban rate falls, but recall drops — the classic trade-off. The product answer is a two-band policy: auto-ban only where precision is high enough to act blindly, and route the uncertain middle to humans.</p>`,
        concepts: ["ml-classification-metrics", "ml-roc-auc"],
        insight: `<b>Read the threshold table, not the AUC.</b> AUC is a strong $0.972$, but it doesn't pick an operating point. At threshold $0.5$ you get recall $0.93$ but a $0.7\\%$ false-ban rate — at this scale that's tens of thousands of silenced real users a day. Push to threshold $0.8$ and precision rises to $0.97$ with a false-ban rate of just $0.1\\%$ — $7\\times$ safer — at the cost of recall dropping to $0.81$. That recall you 'lose' isn't lost: it falls into the $0.5$–$0.8$ band that goes to human review.`,
        data: {
          caption: "Operating points on the gold set ($50$K audited messages, $7.1\\%$ spam)",
          columns: ["threshold", "precision", "recall", "false-ban rate", "action"],
          rows: [
            ["0.5", "0.86", "0.93", "0.7%", "too risky to auto-ban"],
            ["0.8", "0.97", "0.81", "0.1%", "auto-ban (safe)"],
            ["0.5–0.8 band", "—", "—", "—", "→ human review"]
          ],
          note: `Higher threshold trades recall for precision. The $0.1\\%$ false-ban rate at $0.8$ is low enough to act on without a human; the band below it isn't, so it's reviewed instead of banned.`
        },
        chart: { type: "confusion", title: "Confusion matrix at auto-ban threshold 0.8 (50K gold)", labels: ["ham", "spam"], matrix: [[46361, 89], [674, 2876]] },
        symbols: [
          { sym: "false-ban rate", desc: "fraction of real (ham) users wrongly banned; the cost you must keep tiny before any auto-action." },
          { sym: "$\\times$", desc: "\"times\" — here, $0.1\\%$ vs $0.7\\%$ is roughly a $7\\times$ reduction in false bans." }
        ],
        steps: [
          { type: "run", label: "▶ Evaluate on the gold test set", result: { log: "gold set: 50,000 human-audited messages, 7.1% spam\nAUC 0.972\n@ threshold 0.5 -> precision 0.86, recall 0.93 (false-ban rate 0.7%)\n@ threshold 0.8 -> precision 0.97, recall 0.81 (false-ban rate 0.1%)", metrics: [{ k: "AUC", v: "0.972" }, { k: "prec@0.8", v: "0.97" }, { k: "false-ban@0.8", v: "0.1%" }], chart: { type: "roc", title: "ROC curve (gold test set)", auc: 0.972, points: [[0, 0], [0.001, 0.81], [0.007, 0.93], [0.05, 0.98], [0.2, 0.99], [1, 1]] } } },
          { type: "decide", prompt: "Auto-ban requires a very low false-ban rate; everything else goes to human review. Pick the auto-ban threshold.",
            options: [
              { label: "Auto-ban at 0.8 (precision 0.97), send 0.5-0.8 to human review", best: true, feedback: "the mechanism: at $0.8$, precision $0.97$ means a $0.1\\%$ false-ban rate — low enough that acting automatically silences almost no real users. The recall you give up ($0.93\\to0.81$) doesn't vanish; that middle band routes to human review, so borderline messages still get caught, just by a person. You keep auto-action safe and coverage high at the same time." },
              { label: "Auto-ban everything above 0.5", feedback: "the trap is the $0.7\\%$ false-ban rate. It looks tiny, but applied to millions of messages it's tens of thousands of wrongly-banned real users every day — exactly the asymmetric harm you framed the problem to avoid. The extra recall isn't worth acting on blindly; that's what the review queue is for." }
            ] }
        ]
      },
      {
        phase: "Iterate", icon: "🔁", title: "Diagnose & iterate",
        narrative: `<p>Two weeks in, recall on a new scam wave drops. Error analysis shows why: spammers now insert zero-width characters and swap Latin letters for identical-looking Cyrillic homoglyphs, so 'free' becomes a string your n-grams have never seen. This is adversarial drift — the data distribution moved on purpose to dodge you — not a model that's underfitting. The fix targets the input, not the model size.</p>`,
        concepts: ["ml-bias-variance", "mlx-error-analysis", "dl-word-embeddings"],
        insight: `<b>The tokenizer is being attacked, not the model.</b> A homoglyph swap (Latin 'a' → Cyrillic 'а') or a zero-width space inside a word produces a token your TF-IDF vocabulary never learned, so the spam term silently scores $0$ and recall on the new wave collapses. No amount of extra model capacity helps, because the signal never reaches the model intact. Canonicalize first — strip zero-width characters, map homoglyphs to a base alphabet — and add char-level features that survive spelling tricks, then retrain on the fresh examples.`,
        symbols: [
          { sym: "recall", desc: "fraction of true spam caught; it's recall on the new obfuscated wave that dropped, while overall metrics still looked fine." }
        ],
        steps: [{
          type: "decide", prompt: "The model misses obfuscated spam. Best fix?",
          options: [
            { label: "Normalize text (strip zero-width, map homoglyphs), add char-level and embedding features robust to spelling tricks, then retrain on the new examples", best: true, feedback: "you correctly diagnosed adversarial drift, not underfitting: the obfuscation produces tokens the vocabulary never saw, so the spam evidence is destroyed before scoring. Canonicalizing the input (strip zero-width, fold homoglyphs to a base alphabet) restores the signal, char-level and embedding features make the representation robust to the next spelling trick, and retraining on the new examples closes the specific gap. You fix the pipeline so the same evasion can't simply repeat." },
            { label: "Lower the ban threshold globally", feedback: "the trap: a global threshold drop bans more of everyone to catch one new trick, so precision collapses and false bans spike across all traffic — while the obfuscation just keeps adapting. You've harmed every real user to chase one campaign, and you haven't actually fixed the blind spot." },
            { label: "Add more transformer layers", feedback: "extra capacity is the wrong lever. The model isn't failing for lack of expressiveness — it's failing because the homoglyph/zero-width tokens never reached it cleanly. More layers can't read characters the tokenizer mangled; the cure is input normalization and new features, not a bigger model." }
          ]
        }]
      },
      {
        phase: "Deploy", icon: "🚀", title: "Deploy to production",
        narrative: `<p>Moderation runs inline on the message path at huge volume, so per-message latency and cost are hard constraints — a slow filter delays every message users send. The serving design mirrors the model design: the cheap first stage runs synchronously on the hot path (p99 $\\approx 8$ms), while the expensive transformer and human review run asynchronously only on the uncertain band. New models ship through shadow → canary so a regression can't silence users overnight.</p>`,
        concepts: ["ml-classification-metrics", "mod-transformer"],
        insight: `<b>The hot path must stay cheap.</b> The first stage adds only p99 $\\approx 8$ms inline, so it can run on every message without users noticing delivery lag; the transformer and human queue are pushed off the synchronous path entirely. The rollout is staged for safety: shadow shows $96\\%$ agreement with v1 while catching $+14\\%$ more obfuscated spam, then a $5\\%$ canary confirms the $0.1\\%$ false-ban rate holds live before promoting to $100\\%$ — so a bad model is caught at $5\\%$ of traffic, not all of it.`,
        symbols: [
          { sym: "p99", desc: "the 99th-percentile latency: $99\\%$ of messages are scored at least this fast, so it bounds the worst typical delay." },
          { sym: "$\\approx$", desc: "\"approximately\" — $8$ms is a representative p99, not an exact constant." }
        ],
        steps: [
          { type: "decide", prompt: "How should the stack serve?",
            options: [
              { label: "Inline cheap first-stage on every message; async transformer + human review only for the uncertain band; canary new models in shadow first", best: true, feedback: "this keeps the synchronous hot path at p99 $\\approx 8$ms so no message is delayed, while the costly transformer and human review run off-path only for the uncertain band — spending compute exactly where it changes the decision. Shadowing then canarying new models means a regression shows up against live traffic at $5\\%$ first, so it can't silence users at full scale before you catch it. Fast, cheap, and safe to update." },
              { label: "Synchronously run the transformer on every message before delivery", feedback: "the trap is that you'd add the transformer's latency and cost to every single message before it's delivered. At platform scale that's visible delivery lag for users and a ruinous compute bill — paying premium inference for the easy $88\\%$ that the $8$ms filter already resolved." }
            ] },
          { type: "run", label: "▶ Ship (shadow → canary → live)", result: { log: "deploying moderation stack v2...\nshadow: agreement with v1 96%, catches +14% of obfuscated spam\ncanary 5%: p99 first-stage latency 8ms, false-ban rate 0.1%\npromoting to 100%.", metrics: [{ k: "p99 latency", v: "8ms" }, { k: "extra spam caught", v: "+14%" }] } }
        ]
      },
      {
        phase: "Monitor", icon: "📡", title: "Monitor & maintain (MLOps)",
        narrative: `<p>Spam is adversarial: the moment you ship, attackers start probing for the next evasion, so monitoring is your early-warning system, not a formality. You watch three families of signal — reversals/appeals (false bans), report volume and catch-rate (misses), and score/slice drift (an emerging tactic) — because each surfaces a different failure before it scales. A frozen gold set alone can't see any of this.</p>`,
        concepts: ["mlx-error-analysis", "prob-bayes"],
        insight: `<b>Each monitor catches a different failure.</b> This week the appeal reversal rate jumped $0.8\\%\\to2.1\\%$ — a false-ban spike on new slang the model misreads as spam (a precision problem). At the same time spam reports rose $+30\\%$ in the 'crypto' topic cluster — a miss problem — and the score distribution on short messages drifted $+0.06$. None of these would show on the original gold set, because that set predates the new slang and the new scam. The reversals feed new ham labels and the reports feed new spam labels straight back into the Data stage.`,
        data: {
          caption: "This week's monitor panel — three signal families, three failure modes",
          columns: ["signal", "this week", "means", "feeds back as"],
          rows: [
            ["appeal reversal rate", "0.8% → 2.1% ⚠", "false bans (precision↓)", "new ham labels"],
            ["spam reports (crypto)", "+30% ⚠", "misses (recall↓)", "new spam labels"],
            ["score drift, short msgs", "+0.06", "tactic shift", "retrain trigger"],
            ["per-language slices", "watch", "localized evasion", "targeted labels"]
          ],
          note: `Reversals reveal where you over-banned; reports reveal where you under-banned. Together they close the adversarial loop back to <b>Data</b> — the loop never stops because the attacker never does.`
        },
        symbols: [
          { sym: "reversal rate", desc: "fraction of bans later overturned on appeal; a rising reversal rate is a direct read on false bans (precision dropping)." }
        ],
        steps: [
          { type: "decide", prompt: "What do you watch in production?",
            options: [
              { label: "Appeal/reversal rate (false bans), spam-report volume and catch-rate, score-distribution drift, and per-language/segment slices — with alerts", best: true, feedback: "each metric is a sensor for a distinct failure: reversals reveal false bans (precision dropping), report volume reveals misses (recall dropping), and score/slice drift reveals an emerging evasion before it scales across all traffic. Watching all three with alerts closes the adversarial loop — a spike in any one routes fresh labels back to Data and triggers a retrain, which is the only way to keep pace with attackers who adapt every week." },
              { label: "Just the overall accuracy on the original gold set", feedback: "the trap is that the gold set is frozen in the past, before today's slang and today's scam cluster existed. So it can't see a new evasion at all — you'd watch a healthy-looking number while a fresh wave sails through and reversals quietly climb. Static evaluation is blind to adversarial drift by construction." }
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
        narrative: `<p>You're a quant building a systematic strategy. Markets are nearly efficient, so the signal-to-noise ratio is brutal — a real edge might tilt the odds from 50% to just 53%. Before touching data you must decide <i>what</i> you predict and <i>how</i> you judge it, because the wrong objective makes a losing strategy look like a winner. The honest target is risk-adjusted return after costs, not raw profit on paper.</p>`,
        concepts: ["prob-expectation", "prob-variance", "ml-linear-regression"],
        insight: `<b>The thin-edge reality.</b> A good systematic strategy is right barely more than half the time — a <b>53% hit rate</b> is already a strong signal in liquid markets. The Sharpe ratio $\\frac{E[r]}{\\sigma(r)}$ measures return <i>per unit of risk</i>: a Sharpe of $1.0$ roughly means a year of ~$+10\\%$ return earned with ~$10\\%$ volatility. Raw backtest profit hides both risk and costs, so two strategies with identical total profit can have wildly different Sharpe — and only the steadier one survives live.`,
        symbols: [
          { sym: "$r$", desc: "the strategy's excess return over a period — profit beyond the risk-free rate, as a fraction (e.g. $0.01$ means $+1\\%$)." },
          { sym: "$E[r]$", desc: "the expected (average) excess return per period — the numerator of Sharpe, i.e. how much edge you earn on average." },
          { sym: "$\\sigma(r)$", desc: "the standard deviation (volatility) of returns — how much $r$ bounces around; the denominator that penalizes risk." },
          { sym: "$\\frac{E[r]}{\\sigma(r)}$", desc: "the Sharpe ratio: average return divided by its volatility, i.e. reward per unit of risk taken." }
        ],
        steps: [{
          type: "decide", prompt: "What is a sensible target and success metric?",
          options: [
            { label: "Predict the sign/size of next-period excess return, and judge by risk-adjusted return (Sharpe) net of costs", best: true, feedback: "right. The product is a P&L stream, and what survives is consistency, not occasional big wins — so you judge by Sharpe $\\frac{E[r]}{\\sigma(r)}$, reward per unit of volatility, measured AFTER trading costs. Predicting the sign/size of the excess RETURN (not the price level) targets the quantity you can actually trade. Folding costs into the metric stops a strategy from 'winning' on paper by churning." },
            { label: "Predict the exact future price level and minimize MSE", feedback: "trap: price levels are near a random walk, so a tiny MSE on the level can still leave the period-to-period return essentially unpredictable. The model nails the level by echoing yesterday's price — an accurate-looking number with zero tradable edge once you difference it into returns." },
            { label: "Maximize total backtest profit, costs ignored", feedback: "trap: ignoring transaction costs and risk is exactly how a 'great' backtest becomes a live loser. A high-turnover strategy piles up paper profit that 8-15 bps of cost per trade quietly erases, and total profit tells you nothing about the drawdowns you'd have to endure to earn it." }
          ]
        }]
      },
      {
        phase: "Data", icon: "🗄️", title: "Gather the data",
        narrative: `<p>You assemble ~19 years of daily price/volume history plus fundamentals across 3,100 names. Two silent killers live in this data: survivorship bias (quietly dropping the firms that went bankrupt) and point-in-time errors (using numbers that weren't actually known on the trade date). Get either wrong and your backtest invents returns that never existed. So you build a survivorship-free universe and lag every fundamental to its real publish date — and you fence off 2021-2024 as an untouched out-of-sample block you will not look at until the very end.</p>`,
        concepts: ["mod-timeseries", "prob-normal"],
        insight: `<b>Why the dead companies matter.</b> The universe spans <b>3,100 names over 2005-2024</b> and deliberately <b>includes 640 delisted or bankrupt names</b>. Those 640 are exactly the firms a naive "today's index members" pull would erase — and they are disproportionately the big losers. Drop them and your backtest only ever trades the survivors, silently adding a few percent of fake annual return. The untouched 2021-2024 slice (~$20\\%$ of the history) is held back so the final test is on data the strategy has truly never seen.`,
        data: {
          caption: "Point-in-time daily panel (one row per name per day, fundamentals as known THAT day)",
          columns: ["date", "ticker", "close (adj)", "ret_1d", "P/E (pit)", "status"],
          rows: [
            ["2018-03-14", "AAA", "142.10", "+0.6%", "18.4", "active"],
            ["2018-03-14", "BBB", "9.07", "-2.1%", "\u2014", "active"],
            ["2019-11-02", "CCC", "0.41", "-31%", "\u2014", "delisted \u2192"],
            ["\u2026", "\u2026 3,100 names", "\u2026", "\u2026", "\u2026", "\u2026"]
          ],
          note: `Prices are split/dividend adjusted; <i>ret_1d</i> is the one-day return. The P/E column is <b>point-in-time</b> — a dash (\u2014) means the ratio wasn't yet published (or earnings were negative), NOT today's restated value. The delisted row for CCC is kept on purpose; deleting it would be survivorship bias.`
        },
        symbols: [
          { sym: "ret_1d", desc: "a name's one-day excess return — the daily change in adjusted price, the raw $r$ the strategy stacks up over time." },
          { sym: "P/E (pit)", desc: "price-to-earnings ratio as it was KNOWN on that date (point-in-time), not the later restated figure." },
          { sym: "split/dividend adj", desc: "prices rescaled so a stock split or dividend doesn't look like a fake jump in return." }
        ],
        steps: [
          { type: "decide", prompt: "What's the biggest data trap to fix first?",
            options: [
              { label: "Use a survivorship-bias-free universe with point-in-time fundamentals (as known on each date), adjusted for splits/dividends", best: true, feedback: "right, and these are two separate fixes that both protect the same thing — an honest record of what you could have known. Keeping the 640 delisted names stops you from only 'trading' winners; lagging fundamentals to their publish date stops you from trading on numbers nobody had yet; split/dividend adjustment stops a corporate action from masquerading as a return. Get these wrong and EVERY downstream metric is fiction." },
              { label: "Just download today's index members back through history", feedback: "trap: this is textbook survivorship bias. Today's index excludes the firms that went bankrupt or got delisted — precisely the losers — so your backtest retroactively only holds the companies that made it, inflating returns by a few percent a year you can never earn live." },
              { label: "Use the latest restated earnings for every past date", feedback: "trap: restated figures weren't known on the trade date, so feeding them in is pure look-ahead bias. The model 'trades' on the corrected number months before the correction existed, fabricating an edge that evaporates the moment you go live with only same-day information." }
            ] },
          { type: "run", label: "▶ Assemble universe", prompt: "Assemble a clean point-in-time dataset.",
            result: { log: "loading survivorship-bias-free universe...\n3,100 names, 2005-2024, daily bars\nincluded 640 delisted/bankrupt names\nfundamentals: point-in-time, lagged to report date\nsplit/dividend adjusted\nNOTE: reserve 2021-2024 as untouched out-of-sample", metrics: [{ k: "names", v: "3,100" }, { k: "span", v: "19y" }, { k: "delisted incl.", v: "640" }] } }
        ]
      },
      {
        phase: "Explore", icon: "🔍", title: "Explore & clean",
        narrative: `<p>Inspect the signal and hunt for look-ahead bias — the trading equivalent of target leakage, where information from the future sneaks into a past prediction. In time series it hides in subtle alignment and timing errors rather than obvious columns. Two things jump out here: returns have fat tails (excess kurtosis $7.4$, far from Gaussian, so big moves are common), and several signals are nearly identical copies of each other ($|r|&gt;0.9$). Both shape what you can safely model next.</p>`,
        concepts: ["prob-covariance-correlation", "mlx-error-analysis"],
        insight: `<b>The 1-3 day leak that fabricates alpha.</b> The data profile shows returns with <b>excess kurtosis $7.4$</b> — fat tails mean rare 5-sigma moves happen far more than a normal curve predicts, so risk sizing can't assume Gaussian. More dangerous: a momentum signal is aligned to the earnings <i>event</i> date instead of the <i>publish</i> date, leaking 1-3 days of not-yet-public info. And <b>4 signals are pairwise $|r|&gt;0.9$</b> — secretly the same bet wearing four hats. A leak this small still fabricates returns that vanish the instant you trade live.`,
        data: {
          caption: "Look-ahead audit — when was each feature actually KNOWABLE? (using $|r|$ as the correlation magnitude)",
          columns: ["feature", "aligned to", "should be", "leak", "verdict"],
          rows: [
            ["momentum_12m", "event date", "publish date", "+1-3 days", "LOOK-AHEAD"],
            ["close_today\u2192dir", "same bar", "prior bar", "instant", "LOOK-AHEAD"],
            ["value_pb (pit)", "publish date", "publish date", "0", "ok"],
            ["sig_a..sig_d", "\u2014", "\u2014", "$|r|&gt;0.9$", "redundant \u00d74"]
          ],
          note: `A feature is only legal if it was KNOWABLE before the bar you trade on. The first two rows leak the future; the last row is four signals so correlated ($|r|&gt;0.9$) they are effectively one factor — a risk concentration to fix in <i>Features</i>.`
        },
        chart: { type: "bars", title: "Daily return distribution: fat tails (excess kurtosis 7.4)", labels: ["<-3sigma", "-3..-1", "-1..0", "0..+1", "+1..+3", ">+3sigma"], values: [380, 5200, 38000, 38400, 5100, 360], valueLabels: ["0.4%", "5.9%", "43%", "43%", "5.8%", "0.4%"], colors: ["#ff7b72", "#ffb454", "#4ea1ff", "#4ea1ff", "#ffb454", "#ff7b72"] },
        symbols: [
          { sym: "kurtosis", desc: "a measure of tail-heaviness; excess kurtosis $7.4$ (a Gaussian has $0$) means extreme returns are far more frequent than a bell curve predicts." },
          { sym: "$|r|$", desc: "the absolute value of the correlation between two signals — here $r$ means CORRELATION (not return); $|r|&gt;0.9$ flags near-duplicate signals." }
        ],
        steps: [
          { type: "run", label: "▶ Profile signals", result: { log: "return distribution: heavy tails, excess kurtosis 7.4 (not Gaussian)\nfeature 'close_today' used to predict 'close_today' direction -> LOOK-AHEAD\nsignal uses report-date value but aligned to event date, not publish date (+1-3 day leak)\nfeature correlations: 4 signals pairwise |r|>0.9 (redundant)", metrics: [{ k: "kurtosis", v: "7.4" }, { k: "look-ahead", v: "found" }] } },
          { type: "decide", prompt: "A momentum signal is aligned to the earnings event date, not the public release date. What's the problem?",
            options: [
              { label: "Look-ahead bias — you'd be trading on info before it was public", best: true, feedback: "exactly, and the mechanism is the key lesson: a backtest can only be honest if it trades on information that was KNOWABLE at decision time. Earnings are reported on the event date but become public 1-3 days later, so aligning to the event date lets the strategy act on numbers nobody had yet. Fix it by stamping every feature with its publish date plus a realistic lag — the time-series analogue of dropping a leaky column." },
              { label: "Nothing — the dates are basically the same", feedback: "trap: even a 1-3 day gap is enough to 'trade' on not-yet-public information, and that tiny edge compounds into a beautiful backtest that simply cannot be reproduced live, because in production you genuinely don't have the number until it's published." }
            ] }
        ]
      },
      {
        phase: "Features", icon: "🧬", title: "Engineer features",
        narrative: `<p>Build factor signals — momentum, value, quality — then control their correlation, because overlapping factors create a portfolio that is secretly one big bet wearing a diversified mask. You found 4 signals with pairwise $|r|&gt;0.9$; left alone they quadruple-weight a single direction. The fix is PCA: eigen-decompose the covariance matrix to rotate the correlated signals into a handful of uncorrelated factor components, so your true risk exposures are explicit, not hidden.</p>`,
        concepts: ["prob-covariance-correlation", "ml-pca", "fnd-eigen"],
        insight: `<b>Four signals, one bet.</b> The <b>4 highly-correlated signals ($|r|&gt;0.9$)</b> look like diversification but aren't — stack them and you've put roughly $4\\times$ the weight on the same underlying move, so a single regime shift hits all four at once. PCA fixes this in four concrete steps: (1) <i>standardize</i> each raw signal to mean $0$, std $1$ so no signal dominates by scale; (2) build the covariance matrix $\\Sigma=\\frac{1}{n-1}X^\\top X$ of the standardized signals; (3) <i>eigen-decompose</i> $\\Sigma=Q\\Lambda Q^\\top$, where each eigenvector (column of $Q$) is a principal direction and its eigenvalue $\\lambda$ is the variance along it — sort them by $\\lambda$ descending; (4) <i>project</i> the signals onto the top eigenvectors to get new component scores. PC1 (largest $\\lambda$) soaks up the shared variance — here roughly $90\\%$, since all four signals point the same way — and PC2, PC3 carry whatever independent signal remains. You trade the orthogonal components, not the redundant raw signals.`,
        data: {
          caption: "Signal correlation corner + PCA loadings ($\\Sigma$ = covariance matrix, $r$ = correlation)",
          columns: ["", "sig_a", "sig_b", "sig_c", "PC1 load", "PC2 load"],
          rows: [
            ["sig_a", "1.00", "0.94", "0.91", "0.52", "+0.10"],
            ["sig_b", "0.94", "1.00", "0.93", "0.51", "-0.31"],
            ["sig_c", "0.91", "0.93", "1.00", "0.49", "+0.62"],
            ["\u2026 sig_d", "0.92", "0.90", "0.95", "0.48", "\u2026"]
          ],
          note: `Off-diagonal correlations near $0.9$ confirm the signals move together. PC1's near-equal loadings ($\\approx 0.5$ each) show it IS the shared bet; PC2 captures the small slice where the signals disagree. Keep the orthogonal PCs, drop the raw redundancy.`
        },
        symbols: [
          { sym: "$|r|$", desc: "the magnitude of correlation between two signals (here $r$ is CORRELATION, not return); $|r|&gt;0.9$ means near-duplicate." },
          { sym: "$\\Sigma$", desc: "the covariance matrix of the standardized signals, $\\Sigma=\\frac{1}{n-1}X^\\top X$ — entry $(i,j)$ is how signal $i$ co-moves with signal $j$; PCA eigen-decomposes it." },
          { sym: "$\\Sigma=Q\\Lambda Q^\\top$", desc: "the eigen-decomposition: columns of $Q$ are the eigenvectors (principal directions / loadings) and the diagonal of $\\Lambda$ holds their eigenvalues $\\lambda$ (variance captured), sorted descending." },
          { sym: "PC1 / PC2", desc: "the first/second principal components — the top eigenvectors of $\\Sigma$ (largest $\\lambda$), the new uncorrelated factor directions; the loadings are their weights on each raw signal." }
        ],
        steps: [{
          type: "decide", prompt: "Four of your signals are 0.9+ correlated. Best move?",
          options: [
            { label: "Orthogonalize them with PCA (eigen-decompose the covariance matrix) and keep the independent factor components", best: true, feedback: "right. PCA eigen-decomposes the covariance matrix $\\Sigma$ and returns orthogonal directions ranked by variance; the redundant signals collapse into PC1 (the shared bet) while PC2, PC3 carry whatever genuinely independent information is left. Trading the components instead of the raw signals makes your real risk concentration visible and stops you from accidentally $4\\times$-sizing one factor." },
            { label: "Keep all four — more signals is more edge", feedback: "trap: with $|r|&gt;0.9$ these aren't four edges, they're one edge counted four times. Summing them quadruple-weights a single direction, so the portfolio LOOKS diversified while concentrating risk — and a regime change that breaks that one factor breaks all four simultaneously." },
            { label: "Drop three at random", feedback: "trap: a random drop might throw away the cleanest of the four and keep a noisier copy, and it still treats the kept signal as if it were independent. PCA is strictly better — it COMBINES their shared information into one component rather than gambling on which raw signal to keep." }
          ]
        }]
      },
      {
        phase: "Model", icon: "🧠", title: "Pick a model",
        narrative: `<p>With a $\\approx 53\\%$ hit rate, the signal-to-noise ratio is tiny, which flips the usual instinct: here model complexity is dangerous, not helpful. Every extra parameter is one more knob the optimizer can use to fit noise in the single history you have. The right move is a parsimonious, regularized linear factor model sized to the (low) signal — a few robust factors that generalize beat a flexible model that memorizes one decade. Capital allocation across strategies can then be tuned over time like a bandit, exploring and exploiting.</p>`,
        concepts: ["ml-linear-regression", "ml-pca", "cls-bandits"],
        insight: `<b>Capacity must match signal.</b> With only ~$53\\%$ of trades going the right way, there is almost no reliable structure to learn — so a model with millions of parameters has vastly more capacity than the data can justify and will fit historical noise as if it were signal. The discipline is to size capacity to the signal: a handful of orthogonal factors (from the PCA step) fed to a regularized linear model. You have essentially ONE realization of history, so anything that can memorize it will, and the memorized pattern won't repeat.`,
        symbols: [
          { sym: "$\\approx 53\\%$", desc: "the approximate hit rate — fraction of trades that move the predicted way; barely above the $50\\%$ coin flip, which is why signal-to-noise is low." },
          { sym: "regularized", desc: "an added penalty on large coefficients that shrinks the model toward simplicity, trading a little fit for much better out-of-sample generalization." }
        ],
        steps: [{
          type: "decide", prompt: "Choose a model for a low signal-to-noise return forecast.",
          options: [
            { label: "A parsimonious regularized linear factor model, sized to the (low) signal, with capital allocation tuned over time", best: true, feedback: "right, and the reasoning is bias-variance: when the true signal is faint, a simple regularized model accepts a little bias to slash variance, so it generalizes out-of-sample. A few robust orthogonal factors can't memorize a single decade the way a flexible model can. Allocating capital across strategies over time is an explore/exploit problem — exactly the bandit framing." },
            { label: "A deep network with millions of parameters", feedback: "trap: capacity vastly exceeds what a ~$53\\%$-edge signal can support, so the network has more than enough freedom to fit the noise of your one history perfectly — and that fitted noise is precisely what won't recur live. High variance, low robustness; the worst trade in low-signal regimes." },
            { label: "A 50-rule hand-tuned system fit to maximize past profit", feedback: "trap: hand-tuning 50 rules to maximize past profit is curve-fitting by another name. Each rule you add nudges the backtest up by carving out a quirk of history, but every quirk is sample-specific noise, so real out-of-sample edge erodes with each addition — the in-sample/out-of-sample gap you'll see explode in Evaluate." }
          ]
        }]
      },
      {
        phase: "Train", icon: "⚙️", title: "Train & backtest",
        narrative: `<p>Fit and backtest with <i>walk-forward validation</i>: train on a past window (3 years), test on the next (1 year), then roll the whole window forward and repeat. This respects the arrow of time — the test period is always strictly in the future of the fit, so the model can never peek ahead. The gap between in-sample Sharpe ($1.9$) and walk-forward Sharpe ($0.94$) is your first honest read on how much of the edge is real versus overfit. Costs of 8 bps/trade and $180\\%$ annual turnover are baked in.</p>`,
        concepts: ["mod-timeseries", "ml-linear-regression", "ml-pca"],
        insight: `<b>The overfitting tax, measured.</b> In-sample Sharpe averages <b>$1.9$</b> but the walk-forward (out-of-sample) Sharpe is only <b>$0.94$</b> — roughly half the apparent edge was fitted noise that didn't survive into the next year. That gap is the overfitting tax, and walk-forward is what exposes it. Two construction details keep it honest. <b>Purging</b>: because a feature like momentum_12m looks back $12$ months, the last training bars overlap (in time) with the first test bars' look-back window — so you <i>drop</i> (purge) any training rows whose feature or label window touches the test period, removing that information bleed across the boundary. <b>Embargo</b>: you then insert a small gap (here a few days) right after each test fold before the next train window starts, so serial autocorrelation can't leak the test outcome backward into the next fit. Build a fold as: train $3$y $\\to$ purge boundary rows $\\to$ embargo gap $\\to$ test next $1$y $\\to$ roll $+1$y. The strategy also turns over <b>$180\\%$ of capital a year at 8 bps/trade</b>, so cost is a first-class drag, and the worst peak-to-trough drawdown is <b>$-14\\%$</b> — the pain you must be willing to sit through.`,
        data: {
          caption: "Walk-forward folds: each test year is strictly after its train window",
          columns: ["fold", "train window", "test year", "IS Sharpe", "OOS Sharpe"],
          rows: [
            ["1", "2005-2007", "2008", "1.92", "0.61"],
            ["2", "2006-2008", "2009", "1.88", "1.07"],
            ["3", "2007-2009", "2010", "1.95", "0.98"],
            ["\u2026", "roll +1y \u2192", "\u2026", "avg 1.9", "avg 0.94"]
          ],
          note: `Each row trains on 3 years and tests on the <i>following</i> year, then rolls forward — the test set is never in the model's past. In-sample Sharpe (IS) is consistently ~$1.9$; out-of-sample (OOS) averages only $0.94$. The fold-to-fold OOS swing also shows regime sensitivity.`
        },
        symbols: [
          { sym: "Sharpe", desc: "$\\frac{E[r]}{\\sigma(r)}$ — average return per unit of volatility; higher is better, and $\\sim 1$ is a solid real strategy." },
          { sym: "IS / OOS", desc: "in-sample (measured on the data the model was fit to) vs out-of-sample (measured on later, unseen data); the gap is the overfitting tax." },
          { sym: "purge", desc: "dropping training rows whose feature look-back or label window overlaps the test period in time, so no future-touching information bleeds across the train/test boundary." },
          { sym: "embargo", desc: "a small time gap inserted right after each test fold before the next train window, blocking autocorrelation from leaking the test outcome into the next fit." },
          { sym: "bps", desc: "basis points; 1 bp = $0.01\\%$. 8 bps/trade is the modeled transaction cost charged on each trade." },
          { sym: "turnover", desc: "how much of the portfolio is bought/sold per year; $180\\%$ means the book is replaced ~1.8 times annually, multiplying cost." }
        ],
        steps: [{
          type: "run", label: "▶ Walk-forward backtest (2005-2020)",
          result: { log: "walk-forward: train 3y -> purge boundary rows (12mo feature overlap) -> embargo 5d -> test 1y, rolling +1y...\nin-sample Sharpe (avg): 1.9\nout-of-sample (walk-forward) Sharpe: 0.94\nmax drawdown: -14%\nturnover 180%/yr, costs modeled at 8 bps/trade", metrics: [{ k: "WF Sharpe", v: "0.94" }, { k: "max DD", v: "-14%" }], chart: { type: "line", title: "Walk-forward Sharpe: in-sample vs out-of-sample by test year", xlabel: "test year", ylabel: "Sharpe", series: [ { name: "in-sample", color: "#4ea1ff", points: [[2008, 1.92], [2009, 1.88], [2010, 1.95]] }, { name: "out-of-sample", color: "#ffb454", points: [[2008, 0.61], [2009, 1.07], [2010, 0.98]] } ] } } }
        ]
      },
      {
        phase: "Evaluate", icon: "📊", title: "Evaluate honestly",
        narrative: `<p>The in-sample Sharpe was $1.9$ but walk-forward was $0.94$ — that gap already paid the overfitting tax. Now the real test: run the strategy once on the untouched 2021-2024 block you fenced off in Data, and stress it against higher costs. It earns Sharpe $0.81$ at 8 bps but only $0.43$ at 15 bps, with a $53.1\\%$ hit rate. That steep sensitivity to cost is the headline: the edge is real but thin, so HOW you trade it matters as much as whether it exists.</p>`,
        concepts: ["prob-variance", "prob-expectation", "mlx-error-analysis"],
        insight: `<b>Cost is the make-or-break variable.</b> On the truly-untouched 2021-2024 block the strategy posts <b>Sharpe $0.81$ at 8 bps</b> but collapses to <b>$0.43$ at 15 bps</b> — nearly halving when costs merely double. With a <b>$53.1\\%$ hit rate</b> and avg-win/avg-loss of $1.08$, the per-trade margin is razor thin, so it lives or dies on execution. The $-16\\%$ drawdown (recovered in 5 months) is survivable, but a strategy this cost-sensitive must be sized to keep turnover low and traded only where fills are cheap.`,
        data: {
          caption: "Out-of-sample Sharpe vs assumed cost (2021-2024 block, never used in design)",
          columns: ["cost/trade", "OOS Sharpe", "net edge", "verdict"],
          rows: [
            ["5 bps", "1.02", "comfortable", "tradeable"],
            ["8 bps (base)", "0.81", "solid", "tradeable"],
            ["15 bps", "0.43", "marginal", "fragile"],
            ["25 bps", "\u22480", "gone", "untradeable"]
          ],
          note: `The same signal, only the cost assumption changes. Doubling cost from 8\u219215 bps nearly halves Sharpe ($0.81\\to0.43$); at ~25 bps the edge is fully eaten. <i>This curve, not the headline number, is the honest verdict.</i>`
        },
        symbols: [
          { sym: "Sharpe", desc: "$\\frac{E[r]}{\\sigma(r)}$, return per unit of risk; reported here net of the stated cost." },
          { sym: "hit rate", desc: "fraction of trades that are profitable; $53.1\\%$ is a thin but real edge over the $50\\%$ coin flip." },
          { sym: "avg win/avg loss", desc: "the ratio of the average winning trade to the average losing trade; $1.08$ means winners are only slightly bigger than losers." },
          { sym: "bps", desc: "basis points (1 bp = $0.01\\%$); the per-trade cost assumption the Sharpe is stress-tested against." }
        ],
        steps: [
          { type: "run", label: "▶ Test on untouched 2021-2024 block", result: { log: "final out-of-sample (2021-2024, never used in design):\nSharpe 0.81 net of costs\nat 8 bps cost: Sharpe 0.81 | at 15 bps cost: Sharpe 0.43\nhit rate 53.1%, avg win/avg loss 1.08\ndrawdown -16%, recovered in 5 months", metrics: [{ k: "OOS Sharpe", v: "0.81" }, { k: "Sharpe@15bps", v: "0.43" }, { k: "hit rate", v: "53.1%" }], chart: { type: "line", title: "Out-of-sample Sharpe vs assumed cost per trade", xlabel: "cost per trade (bps)", ylabel: "OOS Sharpe", series: [ { name: "OOS Sharpe", color: "#4ea1ff", points: [[5, 1.02], [8, 0.81], [15, 0.43], [25, 0.02]] } ] } } },
          { type: "decide", prompt: "Sharpe is 0.81 at 8 bps but 0.43 at 15 bps. What does this tell you?",
            options: [
              { label: "The edge is real but thin and cost-sensitive — size positions to control turnover and only trade where execution is cheap", best: true, feedback: "right. The mechanism: every trade pays the cost, so when the gross edge per trade is small, doubling cost (8\u219215 bps) eats half the net Sharpe ($0.81\\to0.43$). The design response is to trade LESS and SMARTER — cut turnover, route to cheap venues, skip marginal signals — so more of the thin gross edge survives as net return. Fragile-but-real means traded carefully, not levered." },
              { label: "It's a great strategy — deploy at max leverage", feedback: "trap: the steep cost sensitivity and $53.1\\%$ hit rate say the edge is thin, and leverage scales the gross AND the costs AND the drawdowns. Max leverage on a strategy that halves when costs double is how a modest edge turns into a fast blow-up the first time fills get expensive or a $-16\\%$ drawdown arrives levered." },
              { label: "Costs don't matter, ignore the 15 bps case", feedback: "trap: real fills suffer slippage and market impact, so live costs routinely come in ABOVE your cheapest model. Assuming 8 bps when 15 is plausible is exactly the optimism that sinks live strategies — the 15 bps column is the realistic-pessimistic case you must be able to survive, not ignore." }
            ] }
        ]
      },
      {
        phase: "Iterate", icon: "🔁", title: "Diagnose & iterate",
        narrative: `<p>You're tempted to add 20 more signals to push the backtest Sharpe back up toward $1.9$. Pause and diagnose what's actually happening: each added signal lifts the IN-sample Sharpe but the walk-forward (out-of-sample) Sharpe stays flat near $0.94$. That divergence is the textbook signature of overfitting — high variance, where extra capacity fits noise the future won't reproduce. The disciplined response is to STOP adding, keep the robust factors, and let only additions that survive untouched data into the strategy.</p>`,
        concepts: ["ml-bias-variance", "mlx-error-analysis", "ml-pca"],
        insight: `<b>The rising-IS, flat-OOS signature.</b> As you bolt on signals, in-sample Sharpe climbs toward <b>$1.9$</b> while walk-forward Sharpe sits stuck around <b>$0.94$</b>. A widening gap with no out-of-sample payoff is overfitting in its purest form: you're carving out sample-specific quirks, not capturing real structure. The trap is seductive because the backtest curve gets prettier with every signal — but prettiness that lives only in-sample is variance, and variance is exactly what evaporates live.`,
        data: {
          caption: "Signals added vs IS / OOS Sharpe — the overfitting fingerprint",
          columns: ["# signals", "IS Sharpe", "OOS Sharpe", "gap"],
          rows: [
            ["6 (robust)", "1.42", "0.93", "0.49"],
            ["12", "1.71", "0.95", "0.76"],
            ["20", "1.90", "0.94", "0.96"],
            ["30", "2.18", "0.90", "1.28"]
          ],
          note: `IS Sharpe rises monotonically with signal count; OOS Sharpe plateaus near $0.94$ and even DROPS at 30. The growing gap is the overfitting tax — keep the ~6 robust factors, reject the rest unless they lift OOS.`
        },
        chart: { type: "line", title: "Adding signals: in-sample Sharpe climbs, out-of-sample stays flat", xlabel: "number of signals", ylabel: "Sharpe", series: [ { name: "in-sample", color: "#4ea1ff", points: [[6, 1.42], [12, 1.71], [20, 1.90], [30, 2.18]] }, { name: "out-of-sample", color: "#ffb454", points: [[6, 0.93], [12, 0.95], [20, 0.94], [30, 0.90]] } ] },
        symbols: [
          { sym: "IS / OOS", desc: "in-sample vs out-of-sample Sharpe; a rising IS with flat OOS is the high-variance overfitting signature." },
          { sym: "variance", desc: "the bias-variance sense — model sensitivity to the particular training sample; high variance means it memorizes noise that won't repeat." }
        ],
        steps: [{
          type: "decide", prompt: "Backtest Sharpe rises with each added signal but walk-forward Sharpe doesn't. Best response?",
          options: [
            { label: "Stop adding signals — the in-sample gain is overfitting. Keep the robust factors and validate any addition on untouched data", best: true, feedback: "right, and the diagnosis is bias-variance: rising in-sample with flat out-of-sample means the new signals add variance (fitting this history's noise) without adding real signal. The rule that protects you is a gate — a candidate signal earns its place ONLY if it lifts the walk-forward / untouched-block Sharpe, not the backtest. Robustness over backtest beauty." },
            { label: "Add all 20 — the backtest looks amazing now", feedback: "trap: a backtest that looks amazing precisely because you fit 20 signals to one decade is fitting noise. The OOS Sharpe didn't move, so none of that extra beauty is real edge — it's the classic quant trap of confusing a curve-fit history with a repeatable strategy, and it will mean-revert the moment you trade it." },
            { label: "Re-run the walk-forward until you find the split that gives the best Sharpe", best: false, feedback: "trap: hunting for the split that maximizes Sharpe is just look-ahead bias in disguise — you're using knowledge of which split looks best, which is information you wouldn't have had in real time. It launders the same overfitting bias through the validation procedure itself, so the 'win' is fictional." }
          ]
        }]
      },
      {
        phase: "Deploy", icon: "🚀", title: "Deploy to production",
        narrative: `<p>Live trading adds frictions a backtest never feels: slippage (your order moves the price before it fills), market impact, and the risk of a runaway algo. With a fragile-but-real edge, the rollout itself is risk management. You paper-trade first to compare modeled vs realized fills, then go live with small capital behind hard risk limits and a kill-switch, scaling up only as live fills confirm the backtest. The 1mo paper run shows live Sharpe $0.77$ vs $0.81$ backtest — close, with slippage just $+1.4$ bps above model.</p>`,
        concepts: ["prob-variance", "cls-bandits"],
        insight: `<b>Prove it survives real fills before you size up.</b> Paper trading for a month gives <b>live Sharpe $0.77$ vs $0.81$ backtest</b> — a small, encouraging gap — with <b>slippage $+1.4$ bps above the model</b>. That 1.4 bps matters: on a strategy that nearly halves between 8 and 15 bps, a couple of bps of unexpected slippage is a real bite, so you arm risk limits and a kill-switch and scale capital only ~$25\\%$ at a time as live fills keep matching. Small-and-limited turns an unknown (real execution) into a measured one.`,
        data: {
          caption: "Backtest vs paper vs scaling — does the edge survive contact with the market?",
          columns: ["stage", "capital", "Sharpe", "slippage vs model"],
          rows: [
            ["backtest", "\u2014", "0.81", "0 (modeled)"],
            ["paper (1mo)", "0", "0.77", "+1.4 bps"],
            ["live small", "5%", "armed", "tracking\u2026"],
            ["scaling", "25% \u2192", "confirm", "watch limits"]
          ],
          note: `Sharpe degrades only slightly backtest\u2192paper ($0.81\\to0.77$), and the $+1.4$ bps slippage is within tolerance — so you step capital up gradually. Risk limits + kill-switch are armed BEFORE any size goes on.`
        },
        symbols: [
          { sym: "slippage", desc: "the gap between the price you expected and the price you actually filled at; $+1.4$ bps means fills cost 1.4 bps more than modeled." },
          { sym: "Sharpe", desc: "$\\frac{E[r]}{\\sigma(r)}$, return per unit of risk; compared backtest ($0.81$) vs live paper ($0.77$) to test execution realism." },
          { sym: "bps", desc: "basis points; 1 bp = $0.01\\%$ — the unit for slippage and trading cost." }
        ],
        steps: [
          { type: "decide", prompt: "How do you go live with a fragile-but-real edge?",
            options: [
              { label: "Paper-trade, then live with small capital, hard risk limits and a kill-switch; scale up only as live fills match the backtest", best: true, feedback: "right. Live slippage and market impact are genuinely unknown until you trade real size, so you reduce that uncertainty in stages: paper-trade to measure realized vs modeled fills, then small live capital to confirm the edge survives execution, scaling only as the live Sharpe keeps tracking the backtest. The kill-switch caps the damage from a bug or a regime break you didn't foresee." },
              { label: "Deploy full capital immediately to capture the edge fast", feedback: "trap: if live costs run even a few bps above the backtest — and slippage usually does — full size turns this thin, cost-sensitive edge into a fast loss, with no circuit breaker to stop it. You'd be betting the whole book on the optimistic-cost assumption you already saw is fragile in Evaluate." },
              { label: "Skip risk limits — the backtest drawdown was only -16%", feedback: "trap: a backtest can only show drawdowns that happened in the sample; it cannot anticipate a flash crash, a data-feed glitch, or an order-routing bug. With no kill-switch, a single runaway-algo event can blow through the historical $-16\\%$ and take the book with it — risk limits exist for the losses the history never contained." }
            ] },
          { type: "run", label: "▶ Go live (paper → small → scaled)", result: { log: "paper trading 1mo: live Sharpe 0.77 (vs 0.81 backtest, costs tracked)\nslippage 1.4 bps above model\nlive small capital: risk limits + kill-switch armed\nscaling capital 25% as fills confirm.", metrics: [{ k: "live Sharpe", v: "0.77" }, { k: "slippage", v: "+1.4 bps" }] } }
        ]
      },
      {
        phase: "Monitor", icon: "📡", title: "Monitor & maintain (MLOps)",
        narrative: `<p>Edges decay — as others discover the same signal, crowding raises correlation and erodes returns, and regimes shift underneath you. So a live trading model needs constant supervision and a pre-committed plan to pull it when the alpha fades. You watch the rolling live-vs-backtest Sharpe, realized slippage versus model, and factor-correlation drift, with auto-derisk rules that fire before a dead strategy bleeds. This month the monitors caught it: rolling 60d Sharpe fell $0.77\\to0.21$ while correlation to a crowded value trade rose $0.31\\to0.58$.</p>`,
        concepts: ["mod-timeseries", "prob-covariance-correlation", "mlx-error-analysis"],
        insight: `<b>Crowding is how alpha dies.</b> The rolling 60-day live Sharpe decayed from <b>$0.77$ to $0.21$</b> while the strategy's <b>correlation to a crowded value trade jumped $0.31\\to0.58$</b> — the two move together because as others pile into the same signal, your edge becomes the consensus and stops paying. Realized slippage also drifted $+0.9$ bps as liquidity thinned. None of this shows up in raw P&L until it's too late, which is why you monitor leading indicators (Sharpe trend, correlation drift) and auto-derisk to $50\\%$ the moment they breach.`,
        data: {
          caption: "Live monitors this month — leading indicators of a decaying edge ($r$ = correlation)",
          columns: ["monitor", "baseline", "now", "status"],
          rows: [
            ["rolling 60d Sharpe", "0.77", "0.21", "decaying \u26a0"],
            ["crowding corr ($r$)", "0.31", "0.58", "ALERT \u26a0"],
            ["realized slippage", "+1.4 bps", "+2.3 bps", "drifting"],
            ["drawdown vs limit", "-9%", "within", "ok"]
          ],
          note: `Falling Sharpe and rising crowding correlation ($r:0.31\\to0.58$) together say others have found the signal — auto-derisk to $50\\%$ fires and the signal returns to research. <i>P&L alone would still look fine here; the leading indicators are what saved you.</i>`
        },
        symbols: [
          { sym: "Sharpe", desc: "$\\frac{E[r]}{\\sigma(r)}$, return per unit of risk; the rolling 60-day value is the headline health metric." },
          { sym: "$r$ (crowding corr)", desc: "correlation between this strategy and a crowded value trade; rising $r$ ($0.31\\to0.58$) means others are trading the same signal, eroding the edge." },
          { sym: "slippage", desc: "realized fill cost above model, in bps; drifting up signals thinning liquidity." }
        ],
        steps: [
          { type: "decide", prompt: "What do you monitor for a live strategy?",
            options: [
              { label: "Rolling live-vs-backtest Sharpe, realized slippage vs model, factor-exposure & correlation drift, and drawdown vs limits — with auto-derisk rules", best: true, feedback: "right, and the reason is that alpha decays in ways P&L hides: you watch whether the edge still pays AFTER real costs (live Sharpe), whether execution is getting worse (slippage drift), and whether the regime/crowd has shifted (correlation drift). Pre-committed auto-derisk rules cut size the moment these breach, so you stop feeding a dead strategy before it bleeds — discipline beats hope." },
              { label: "Just total P&L; if it's positive, keep going", feedback: "trap: P&L is a lagging, noisy outcome that can stay positive on luck long after the edge is gone — the rolling Sharpe ($0.77\\to0.21$) and crowding correlation ($0.31\\to0.58$) had already turned while cumulative P&L still looked fine. Waiting for P&L to go negative means you only react once you're already trading a dead signal into the next drawdown." }
            ] },
          { type: "run", label: "▶ Check this month's monitors", result: { log: "rolling 60d live Sharpe: 0.77 -> 0.21 (decaying)\nrealized slippage drifting +0.9 bps (liquidity thinner)\nfactor correlation to a crowded value trade rose 0.31 -> 0.58 ALERT\naction: de-risk to 50%, re-examine signal, research refresh", metrics: [{ k: "live Sharpe", v: "0.21 ⚠" }, { k: "crowding corr", v: "0.58 ⚠" }] }, note: `Falling live Sharpe and rising crowding correlation say the edge is decaying as others pile in — auto-derisk fires and the signal goes back to research, the trading version of <b>Data</b>/<b>Iterate</b>. Alpha is perishable.` }
        ]
      }
    ]
  }
});
