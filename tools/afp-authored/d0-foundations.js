/* =====================================================================
   AFP-AI Learning Guide — Domain 0 · ML Foundations  (modules M1–M5)
   ---------------------------------------------------------------------
   Authored source for the AFP-AI track. One object per module.
   Read by tools/gen-afp.js (-> lessons/afp-ai.js) and
   tools/gen-afp-notebooks.js (-> notebooks/afp-mNN.ipynb).

   SCHEMA (per module) — this file's M1 is the GOLD STANDARD; copy its shape.
     {
       m: 1, domain: 0,                       // module number + domain (0..6)
       title: "Supervised learning",          // gen prepends "M1 · "
       tagline: "one-line hook",
       skipIf: "the doc's 'Skip if you can already…' self-check",
       mapsTo: ["all"],                        // doc's "Maps to (approx)" projects
       connections: { buildsOn:[], leadsTo:[], usedWith:[] },   // §1
       motivation: "html",                                       // §2
       definition: "html", symbols:[{sym,desc}]?, derivation:[{do,result,why}]?, // §3
       worked: { problem, skills:[], strategy, steps:[{do,result,why}], verify, answer, connects }, // §4
       practice: [ {problem, steps:[{do,result,why}], answer} ],  // EXACTLY 5
       applications: [ {title, background, numbers} ],            // >= 6 (LinkedIn/ads/recsys flavored)
       applicationsClose: "html",
       takeaways: ["…"],                                          // >= 3
       resources: [ {label, note?} ],          // doc "Learning resources" for this module
       papers:    [ "Title (Authors, year)" ], // doc "SOTA paper reading" relevant to this module
       notebook:  [ {t:"md"|"code", src:"…"} ] // >= 10 cells, >=1 assert, >=1 $…$ md cell,
                                               // one statement per line (no ';' joins)
     }
   LaTeX: double every backslash in a JS string ("\\frac", "\\sum"); keep $…$ balanced.
   No <i>/<em> italics and no emoji anywhere (renderAFP + validators reject them).
   ===================================================================== */
"use strict";

const M1 = {
  m: 1, domain: 0,
  title: "Supervised learning",
  tagline: "Learn a function from labeled examples, then judge it on data it has never seen.",
  skipIf: "frame a problem as features to a label, split train/val/test, reason about over/underfitting, and pick classification vs regression.",
  mapsTo: ["all"],
  connections: {
    buildsOn: ["functions (input to output)", "vectors and features", "basic probability"],
    leadsTo: ["Feature engineering & leakage", "Loss & optimization", "Ranking & CTR models"],
    usedWith: ["train/validation/test splitting", "offline metrics", "regularization"]
  },
  motivation:
    "<p>Almost every model the AFP-AI team ships is supervised: you have historical examples where the answer is known, and you want a function that predicts the answer for new cases. Did a member click this ad? Is this video about cooking? Will this event get attendance? Each is a row of features paired with a known label, and the job is to learn the mapping.</p>" +
    "<p>The one idea that makes this trustworthy is the split between fitting and judging. A model that merely memorizes the training rows is worthless in production. So we hold out data the model never sees during training, and score it there. Everything else in ML foundations, from loss functions to calibration, exists to make that held-out score both high and honest.</p>",
  definition:
    "<p><b>Definition.</b> Supervised learning fits a function $f_\\theta: \\mathcal{X} \\to \\mathcal{Y}$ from a training set $\\{(x_i, y_i)\\}_{i=1}^n$ by choosing parameters $\\theta$ that minimize the average loss $\\frac{1}{n}\\sum_i \\ell(f_\\theta(x_i), y_i)$. When $\\mathcal{Y}$ is a finite set of classes it is <b>classification</b>; when $\\mathcal{Y}=\\mathbb{R}$ it is <b>regression</b>.</p>" +
    "<p><b>Assumptions that matter:</b> training and serving data are drawn from (roughly) the same distribution; the examples are informative about the label; and you evaluate on a split the fitting never touched. Break any of these and a strong offline number will not survive an A/B test.</p>",
  symbols: [
    { sym: "$x_i \\in \\mathcal{X}$", desc: "the feature vector of example $i$ (member, item, and context signals)." },
    { sym: "$y_i \\in \\mathcal{Y}$", desc: "its known label — a class for classification, a number for regression." },
    { sym: "$f_\\theta$", desc: "the model, a function with tunable parameters $\\theta$." },
    { sym: "$\\ell$", desc: "the per-example loss measuring how wrong a prediction is." },
    { sym: "$R(\\theta)=\\frac1n\\sum_i \\ell(f_\\theta(x_i),y_i)$", desc: "the empirical risk — average training loss we minimize." }
  ],
  derivation: [
    { do: "State the goal", result: "minimize true risk $\\mathbb{E}_{(x,y)}[\\ell(f_\\theta(x),y)]$", why: "we want low error on unseen data, not just the sample we have" },
    { do: "Replace the unknown expectation by its sample average", result: "empirical risk $\\frac1n\\sum_i \\ell(f_\\theta(x_i),y_i)$", why: "the true distribution is unknown; the training set is our best estimate of it" },
    { do: "Note the gap", result: "generalization gap = true risk − empirical risk", why: "a flexible model can drive training loss to 0 while true risk stays high — overfitting" },
    { do: "Control the gap", result: "hold out val/test data and/or add regularization", why: "the held-out score estimates true risk honestly, so we tune against it" }
  ],
  worked: {
    problem: "You have 1,000 labeled ad impressions (clicked / not clicked). Set up a supervised pipeline and decide whether it is classification or regression.",
    skills: ["problem framing", "train/val/test split", "loss choice"],
    strategy: "Name the target first — its type decides everything downstream (task, loss, metric).",
    steps: [
      { do: "Identify the label", result: "$y \\in \\{0,1\\}$ (clicked?)", why: "a two-value categorical target means binary classification, not regression" },
      { do: "Assemble features", result: "$x$ = member, ad, and context signals as of impression time", why: "features must be knowable before the click, or the model cheats" },
      { do: "Split the data", result: "700 train / 150 val / 150 test", why: "fit on train, tune on val, report once on test that nothing touched" },
      { do: "Pick the loss", result: "log loss $\\ell=-[y\\log p+(1-y)\\log(1-p)]$", why: "it scores a probability $p$, which is what ranking and pacing need downstream" }
    ],
    verify: "Train accuracy 0.95 but val accuracy 0.70 would flag overfitting — the gap, not the train number, is the signal.",
    answer: "Binary classification with log loss; report on the untouched test split.",
    connects: "the empirical-risk view above — we minimize log loss on train and judge the gap on val/test."
  },
  practice: [
    {
      problem: "A dataset predicts minutes-watched per video (a non-negative real number). Classification or regression, and one reasonable loss?",
      steps: [
        { do: "Check the target type", result: "continuous, $y \\ge 0$", why: "a real-valued target is regression" },
        { do: "Choose a loss", result: "squared error, or Poisson/gamma for skew", why: "watch-time is right-skewed, so a count/positive loss often fits better than plain MSE" }
      ],
      answer: "Regression; squared error as a baseline, Poisson/Tweedie if heavily skewed."
    },
    {
      problem: "Your model scores 0.99 AUC on train and 0.71 on validation. What is happening and what is one fix?",
      steps: [
        { do: "Read the gap", result: "large train−val gap", why: "the model fits noise it cannot reproduce on new data" },
        { do: "Name it", result: "overfitting", why: "high variance, low bias" },
        { do: "Fix", result: "regularize / simplify / add data", why: "each shrinks the generalization gap" }
      ],
      answer: "Overfitting; add regularization (or more data / a simpler model) and re-check the val gap."
    },
    {
      problem: "Why must the test set be scored only once, at the very end?",
      steps: [
        { do: "See what tuning does", result: "each peek adapts choices to that set", why: "repeated decisions leak information from test into the model" },
        { do: "Conclude", result: "test stops estimating true risk", why: "an optimized-against set behaves like a second training set" }
      ],
      answer: "Repeated use turns test into training; a single final read keeps it an honest estimate of true risk."
    },
    {
      problem: "You have 50,000 rows but only 200 positives (clicks). Name two consequences for how you split and evaluate.",
      steps: [
        { do: "Splitting", result: "stratify by label", why: "random splits can leave a fold with almost no positives" },
        { do: "Evaluation", result: "accuracy is misleading; use AUC / PR-AUC", why: "predicting 'never click' scores 99.6% accuracy yet is useless" }
      ],
      answer: "Stratify the split; judge with AUC or PR-AUC, not raw accuracy."
    },
    {
      problem: "Give a concrete example of a feature that would cause target leakage in the click model, and why.",
      steps: [
        { do: "Pick a suspicious feature", result: "'number of clicks this impression received'", why: "it is a function of the label itself" },
        { do: "Check availability at serving time", result: "unknown before the click happens", why: "a feature computed after the outcome cannot exist at prediction time" }
      ],
      answer: "Any post-outcome signal (e.g. the click count) leaks; features must be knowable strictly before the label."
    }
  ],
  applications: [
    { title: "pCTR for ads (Palette-driven pCTR)", background: "The click model behind ad ranking is textbook supervised binary classification; LinkedIn and every ads platform train it on logged impressions.", numbers: "From 1M impressions with a 0.6% base rate, a model outputting $p=0.02$ on a slice that truly clicks at 2% is well-calibrated; log loss at the base rate alone is $-0.006\\log0.006-0.994\\log0.994\\approx0.037$ nats — the floor any model must beat." },
    { title: "Organic video content classification (Instream Ads)", background: "Labeling a video's topic from its signals is multiclass supervised learning; open-ended categories are added as new label columns over time.", numbers: "With 12 categories and 30k labeled videos, a stratified 70/15/15 split gives 21k/4.5k/4.5k; a baseline that always predicts the majority class (say 25% of data) sets the accuracy floor at 0.25 to beat." },
    { title: "Event attendance prediction (Event Ads pAttend)", background: "Predicting whether a member attends an event is supervised classification feeding response models and pacing.", numbers: "If 8% of invited members attend, a lift chart's top decile capturing 40% of attenders means $0.40/0.10=4\\times$ lift over random targeting." },
    { title: "Feed SPR for Event posts (Event Organic discovery)", background: "Session/engagement prediction for ranking Feed posts is a supervised model scored offline before any online test.", numbers: "A candidate model improving validation AUC from 0.720 to 0.735 (+0.015) is the kind of offline delta teams gate an A/B test on." },
    { title: "Creator recommendation relevance (Creator Marketplace AI)", background: "Whether a creator is relevant to a brief is learned from labeled matches — supervised learning underneath the retrieval and ranking stack.", numbers: "With 5,000 labeled (brief, creator) pairs at 20% positive, stratifying keeps ~200 positives per 1,000-row fold instead of a fold accidentally getting 50." },
    { title: "Query relevance filtering (Search Ads)", background: "Judging whether an ad is relevant to a query is a supervised classifier used as a pre-ranking filter.", numbers: "A threshold set where precision=0.90 might yield recall=0.65; moving it to precision=0.80 could lift recall to 0.82 — the precision/recall trade every filter tunes." },
    { title: "Guardrail: honest offline evaluation", background: "Every project relies on a held-out test read matching the online result; the split discipline is what makes offline numbers actionable.", numbers: "A 0.02 AUC gain that vanishes when test is scored twice was never real — the single-read rule is the cheapest insurance in the stack." }
  ],
  applicationsClose:
    "<p>One frame — features to a label, fit on train, judged on held-out data — underlies pCTR, content classification, attendance, Feed ranking, creator matching, and query relevance. Master this split discipline once and every later module (calibration, ranking, retrieval) is a refinement of it.</p>",
  takeaways: [
    "Supervised learning fits $f_\\theta$ to labeled data by minimizing average loss; classification for categorical labels, regression for real ones.",
    "The generalization gap (not the training score) is what matters — hold out val/test and read test exactly once.",
    "Features must be knowable strictly before the label, or you leak the answer.",
    "For rare events, stratify the split and evaluate with AUC/PR-AUC rather than accuracy."
  ],
  resources: [
    { label: "Andrew Ng — Machine Learning (Coursera)", note: "the classic first pass over supervised learning" },
    { label: "Google Machine Learning Crash Course", note: "framing, splits, generalization with runnable exercises" },
    { label: "StatQuest — supervised learning playlist", note: "short, visual explanations of each idea" }
  ],
  papers: [
    "Practical Lessons from Predicting Clicks on Ads at Facebook (He et al., 2014)",
    "Deep Neural Networks for YouTube Recommendations (Covington et al., 2016)"
  ],
  notebook: [
    { t: "md", src:
      "# M1 · Supervised learning\n\n" +
      "_AFP-AI · Domain 0 · ML Foundations_\n\n" +
      "**Learn a function from labeled examples, then judge it on data it has never seen.**\n\n" +
      "We build a binary click-style classifier end to end: split the data honestly, fit a model, and read the **generalization gap** between train and validation. Run each cell top to bottom. _Save a copy to your Drive (File -> Save a copy in Drive) to keep your edits._" },
    { t: "code", src:
      "# Setup - numpy / pandas / scikit-learn / matplotlib ship with Colab.\n" +
      "import numpy as np\n" +
      "import matplotlib.pyplot as plt\n" +
      "from sklearn.model_selection import train_test_split\n" +
      "from sklearn.linear_model import LogisticRegression\n" +
      "from sklearn.metrics import roc_auc_score, log_loss\n\n" +
      "rng = np.random.default_rng(0)" },
    { t: "md", src:
      "## First, look at the data\n\n" +
      "Each row is one impression: a few numeric features and a binary label `clicked`. We make the positive rate low (about 6%) so it behaves like a real ads dataset." },
    { t: "code", src:
      "# Synthetic impressions: features drive a true click probability, then we sample labels.\n" +
      "n = 4000\n" +
      "X = rng.normal(size=(n, 3))\n\n" +
      "# True log-odds is linear in the features (with an offset that makes clicks rare).\n" +
      "true_w = np.array([1.2, -0.8, 0.5])\n" +
      "logits = X @ true_w - 3.0\n" +
      "p_true = 1.0 / (1.0 + np.exp(-logits))\n\n" +
      "y = (rng.random(n) < p_true).astype(int)\n\n" +
      "print(\"rows:\", n, \" positive rate:\", round(y.mean(), 4))" },
    { t: "md", src:
      "## The model, in one formula\n\n" +
      "Logistic regression predicts a probability by squashing a linear score through the sigmoid:\n\n" +
      "$$p = \\sigma(w^\\top x + b) = \\frac{1}{1 + e^{-(w^\\top x + b)}}$$\n\n" +
      "and it is fit by minimizing **log loss** $\\ell = -[y\\log p + (1-y)\\log(1-p)]$." },
    { t: "md", src:
      "### Step 1 - Split the data honestly\n\n" +
      "We hold out a validation set the fitting never sees. `stratify=y` keeps the same rare-positive rate in both folds, so a split does not accidentally starve one side of positives." },
    { t: "code", src:
      "X_train, X_val, y_train, y_val = train_test_split(\n" +
      "    X, y, test_size=0.3, random_state=0, stratify=y\n" +
      ")\n\n" +
      "print(\"train positives:\", y_train.mean().round(4))\n" +
      "print(\"val   positives:\", y_val.mean().round(4))\n\n" +
      "# Stratification keeps the two rates close.\n" +
      "assert abs(y_train.mean() - y_val.mean()) < 0.02" },
    { t: "md", src:
      "### Step 2 - Fit and score on both splits\n\n" +
      "We fit on train only, then measure AUC and log loss on each split. The number that matters is the **gap** between train and validation." },
    { t: "code", src:
      "model = LogisticRegression()\n" +
      "model.fit(X_train, y_train)\n\n" +
      "p_train = model.predict_proba(X_train)[:, 1]\n" +
      "p_val = model.predict_proba(X_val)[:, 1]\n\n" +
      "auc_train = roc_auc_score(y_train, p_train)\n" +
      "auc_val = roc_auc_score(y_val, p_val)\n\n" +
      "print(\"train AUC:\", round(auc_train, 3))\n" +
      "print(\"val   AUC:\", round(auc_val, 3))\n" +
      "print(\"gap     :\", round(auc_train - auc_val, 3))" },
    { t: "md", src:
      "### Step 3 - A well-specified linear model barely overfits\n\n" +
      "Because the true relationship is linear, train and validation AUC should land close together - a small gap. We assert the gap is modest as a sanity check." },
    { t: "code", src:
      "gap = auc_train - auc_val\n\n" +
      "# A correctly-specified model on enough data generalizes: the gap stays small.\n" +
      "assert gap < 0.05\n\n" +
      "print(\"generalization gap is small:\", round(gap, 3))" },
    { t: "md", src:
      "## Visualize the generalization gap\n\n" +
      "The bars compare train vs validation AUC. When you deliberately overfit (few rows, huge capacity), the two bars pull apart - that spreading gap is the thing supervised learning is always fighting." },
    { t: "code", src:
      "labels = [\"train\", \"val\"]\n" +
      "values = [auc_train, auc_val]\n\n" +
      "fig, ax = plt.subplots(figsize=(4, 3))\n" +
      "ax.bar(labels, values, color=[\"#4c78a8\", \"#f58518\"])\n" +
      "ax.set_ylim(0.5, 1.0)\n" +
      "ax.set_ylabel(\"AUC\")\n" +
      "ax.set_title(\"train vs validation AUC\")\n" +
      "plt.show()" },
    { t: "md", src:
      "## Practice\n\n" +
      "Try each in the empty cell below it.\n\n" +
      "1. Shrink the training set to 60 rows and add 20 noise features. Re-fit and watch the gap grow - reproduce overfitting.\n" +
      "2. Add class-weighting (`LogisticRegression(class_weight=\"balanced\")`) and compare val AUC.\n" +
      "3. Replace AUC with `log_loss` and compare the train/val gap under that metric instead." },
    { t: "code", src:
      "# Your turn:\n" }
  ]
};

module.exports = [M1];
