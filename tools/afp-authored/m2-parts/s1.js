/* M2.1 · Target leakage — GOLD STANDARD sub-lesson for the M2 section.
   Copy this shape for the other M2 parts. Exports ONE sub-lesson object
   (sub + subtitle + the full lesson fields). Assembled by
   ../d0-m2-feature-engineering.js. Validate in isolation with:
     node tools/afp-check-part.js tools/afp-authored/m2-parts/s1.js
   LaTeX: double every backslash in JS strings; balance $…$; money is \\$.
   No <i>/<em>, no emoji.

   FORMULAS ARE OPTIONAL. `symbols`, `derivation`, and any $$…$$ display formula
   are only for topics with genuine math (here: the point-in-time rule). For a
   conceptual/engineering topic, write the definition as plain prose and OMIT
   `symbols`/`derivation` rather than manufacturing notation to fill the template
   (see M2.5, which is deliberately formula-free). Only `worked` needs a concrete
   calculation; the rest may be prose when that is the honest presentation. */
"use strict";

module.exports = {
  sub: "01",
  subtitle: "Target leakage — the answer hidden in a feature",
  tagline: "A feature that secretly encodes the label makes offline scores soar and production scores collapse.",
  skipIf: "define target leakage, name its common forms, and detect it from a suspicious feature or an offline-to-online gap.",
  mapsTo: ["all"],
  connections: {
    buildsOn: ["supervised learning (features to a label)", "train/validation/test splitting", "the serving-time contract"],
    leadsTo: ["Point-in-time feature/label joins", "honest offline evaluation", "trustworthy A/B tests"],
    usedWith: ["feature pipelines", "logged data", "cross-validation"]
  },
  motivation:
    "<p>You have already seen that a supervised model is judged on held-out data. Target leakage is the quiet failure that makes even that held-out score a lie. It happens when a feature carries information about the label that the model could not possibly have at prediction time. The offline metric looks spectacular because the answer is sitting inside the inputs, and then the online model is ordinary because that information is gone.</p>" +
    "<p>The load-bearing idea is a single question you ask of every feature: could I actually compute this value at the moment I need the prediction, using only what was known then? If the honest answer is no, the feature leaks. Everything else in this section, from point-in-time joins to out-of-fold encodings, is machinery for answering that one question correctly at scale.</p>",
  definition:
    "<p><b>Definition.</b> Let a row be built at feature-freeze time $t$ from the history $H_t$ available then, giving features $x_t=\\phi(H_t)$, and let the label $y_{t+\\Delta}$ be observed later. The pipeline has <b>target leakage</b> if any coordinate of $x_t$ depends on $y_{t+\\Delta}$ or on any information observed after $t$.</p>" +
    "<p><b>Point-in-time rule.</b> A valid feature uses only events strictly before the freeze time:</p>" +
    "$$x_t=\\phi\\big(\\{e_j : \\text{timestamp}(e_j) < t\\}\\big).$$" +
    "<p><b>Common forms:</b> label leakage (a feature is a function of the outcome), look-ahead leakage (using post-$t$ data), train-test contamination (fitting a transform on all rows before splitting), group leakage (the same entity in train and validation), and aggregation leakage (a global statistic that includes the row's own future).</p>",
  symbols: [
    { sym: "$t$", desc: "the feature-freeze time — the moment the prediction must be made." },
    { sym: "$\\Delta$", desc: "the outcome window; the label is known only at $t+\\Delta$." },
    { sym: "$H_t$", desc: "the event history available strictly before $t$." },
    { sym: "$x_t=\\phi(H_t)$", desc: "the feature vector; $\\phi$ is the feature pipeline." },
    { sym: "$y_{t+\\Delta}$", desc: "the label, observed after the freeze time." }
  ],
  derivation: [
    { do: "Write the honest predictor", result: "$f$ may use only $H_t$", why: "at serving time nothing after $t$ exists yet" },
    { do: "Suppose a feature peeks", result: "$x_t$ includes a function of $y_{t+\\Delta}$", why: "this is the leak: an input built from the answer" },
    { do: "Fit and score offline", result: "training and validation loss both near 0", why: "the model just reads the label off its own input" },
    { do: "Serve online", result: "the leaked coordinate is unavailable, accuracy drops to the honest baseline", why: "the future is genuinely unknown at $t$ — the offline gain was never real" }
  ],
  worked: {
    problem: "An ads click table has one row per impression with columns `impression_time`, `clicked_24h` (the label), `campaign_id`, `member_country`, `campaign_clicks_24h_after`, and `campaign_clicks_7d_before`. Which columns leak, and why?",
    skills: ["leakage detection", "serving-time reasoning", "feature auditing"],
    strategy: "For each candidate feature, ask whether it is knowable strictly before the impression time.",
    steps: [
      { do: "Check `campaign_clicks_7d_before`", result: "valid", why: "it aggregates events before the impression, so it exists at freeze time $t$" },
      { do: "Check `campaign_clicks_24h_after`", result: "leaks", why: "it counts clicks after $t$ and is correlated with this impression's own click" },
      { do: "Check `member_country`", result: "valid (usually)", why: "a stable attribute known at request time, not derived from the outcome" },
      { do: "Decide the fix", result: "drop the after-the-fact column; keep the before-window column", why: "features must depend only on $H_t$" }
    ],
    verify: "Refit without `campaign_clicks_24h_after`: validation AUC falls from an implausible 0.99 toward a realistic 0.70, and the offline-to-online gap closes.",
    answer: "`campaign_clicks_24h_after` is target leakage (post-outcome); the rest are valid point-in-time features.",
    connects: "the point-in-time rule — a feature is valid only if it uses events strictly before $t$."
  },
  practice: [
    {
      problem: "A churn model uses `days_since_last_login` computed on the scoring date. To predict churn for next month, why can this leak, and how do you fix it?",
      steps: [
        { do: "Locate the freeze time", result: "prediction is made at the start of the month", why: "features must reflect only what is known then" },
        { do: "Inspect the feature", result: "if computed on the label date it spans the prediction window", why: "logins during the window partly reveal the churn outcome" },
        { do: "Fix", result: "freeze the feature at the prediction date", why: "use only pre-window activity" }
      ],
      answer: "It leaks if measured through the outcome window; recompute it as of the prediction date so it uses only prior activity."
    },
    {
      problem: "You standardize a numeric feature using the mean and standard deviation of the whole dataset, then split into train and test. Which leakage is this and what breaks?",
      steps: [
        { do: "Name the operation", result: "fit the scaler on all rows", why: "the statistics see test rows" },
        { do: "Name the leakage", result: "train-test contamination", why: "test information flows into the transform used on train" },
        { do: "Fix", result: "fit the scaler on train only, then apply to val/test", why: "the transform must not see held-out data" }
      ],
      answer: "Train-test contamination; fit scalers/imputers/encoders on the training fold only, then apply them to the others."
    },
    {
      problem: "A creator-recommendation model puts different impressions from the same creator in both train and validation. Why can validation look better than production?",
      steps: [
        { do: "Identify the shared entity", result: "the creator appears on both sides", why: "the model can memorize creator-specific quirks" },
        { do: "Name the leakage", result: "group leakage", why: "validation is not independent of train" },
        { do: "Fix", result: "split by creator (grouped split)", why: "no entity crosses the boundary" }
      ],
      answer: "Group leakage; use a grouped split so no creator (or member/campaign) appears in both train and validation."
    },
    {
      problem: "Name two symptoms that should make you suspect leakage before you even inspect features.",
      steps: [
        { do: "Symptom one", result: "an implausibly high offline metric (AUC near 1.0)", why: "real problems rarely separate that cleanly" },
        { do: "Symptom two", result: "one feature dominates importance and offline beats online badly", why: "a single leaky column often carries the label" }
      ],
      answer: "Near-perfect offline scores and a large offline-to-online gap (often with one dominant feature) are classic leakage signals."
    },
    {
      problem: "For the ads table above, write the point-in-time condition that any aggregate feature for an impression at time $t_i$ must satisfy.",
      steps: [
        { do: "State the constraint on events", result: "$\\text{timestamp}(e_j) < t_i$", why: "only pre-impression events are knowable" },
        { do: "Apply it to a count", result: "$c_i=\\sum_j \\mathbf{1}[\\text{timestamp}(e_j)<t_i]$", why: "the sum ranges over the valid window only" }
      ],
      answer: "Every aggregate must be restricted to events with $\\text{timestamp}(e_j) < t_i$, e.g. $c_i=\\sum_j \\mathbf{1}[\\text{timestamp}(e_j)<t_i]$."
    }
  ],
  applications: [
    { title: "Palette-driven pCTR (predicted click-through rate) audit", background: "Click models are trained on logged impressions where post-impression counters are trivially available in the warehouse; using one silently leaks.", numbers: "A leaky `clicks_after_impression` feature can push offline AUC (area under the ROC curve) to 0.98 while the honest model sits near 0.72 — a 0.26 gap that vanishes online, exactly the signature of leakage." },
    { title: "Instream Ads content classification", background: "Video topic labels are sometimes derived from the same human-review notes used to build a feature, so the feature echoes the label.", numbers: "If a feature is the reviewer's tag and the label is derived from it, accuracy looks like 0.99 offline; removing it drops to a realistic 0.80 baseline over 12 categories." },
    { title: "Event Ads pAttend", background: "Attendance is only known after the event, so any feature measured through the event window leaks the outcome.", numbers: "A `rsvp_updates_through_event` feature inflates precision@decile from 0.35 to 0.90; the honest pre-event feature set holds near 0.35, which is what production sees." },
    { title: "Creator Marketplace relevance", background: "Labeled (brief, creator) matches are often reused as features in a second model, creating circular dependence.", numbers: "With 5,000 labeled pairs, a leaked match-score feature yields offline AUC 0.97 vs an honest 0.78 — the 0.19 gap is the tell before any A/B test." },
    { title: "Search Ads query relevance", background: "Editorial relevance labels sometimes feed a feature store column, which then leaks straight back into the relevance classifier.", numbers: "Dropping the leaked column moves reported precision from 0.95 to 0.82 and, crucially, aligns offline with the online precision the filter actually delivers." },
    { title: "Guardrail: the offline-to-online gap as a leakage detector", background: "Teams that log a paired offline and online metric can catch leakage automatically, since leakage is the main cause of a large unexplained gap.", numbers: "An alert on `offline_AUC - online_AUC > 0.05` would have flagged each of the cases above (gaps of 0.26, 0.19, and more) before launch." }
  ],
  applicationsClose:
    "<p>Across pCTR, content classification, attendance, creator matching, and query relevance, the same failure recurs: a column that could only be computed after the fact. Learn to ask the freeze-time question once, and you will catch leakage in every one of these systems.</p>",
  takeaways: [
    "Target leakage means a feature depends on the label or on information unavailable at the prediction moment.",
    "Its forms: label, look-ahead, train-test contamination, group, and aggregation leakage.",
    "Detect it from an implausibly high offline metric and a large offline-to-online gap, often with one dominant feature.",
    "The freeze-time question — could I compute this at prediction time from only what was known then? — settles most cases."
  ],
  resources: [
    { label: "Google — Rules of Machine Learning", note: "Rule 6 and the training/serving-skew rules name leakage in production terms" },
    { label: "Kaggle — Data Leakage tutorial", note: "worked examples of target and train-test leakage" }
  ],
  papers: [
    "Leakage in Data Mining: Formulation, Detection, and Avoidance (Kaufman et al., 2012)"
  ],
  notebook: [
    { t: "md", src:
      "# M2.1 · Target leakage\n\n" +
      "_Curriculum · Domain 0 · ML Foundations · Feature engineering & leakage_\n\n" +
      "**A feature that secretly encodes the label makes offline scores soar and production scores collapse.**\n\n" +
      "We reproduce leakage on purpose: add a feature built from the label, watch validation AUC (area under the ROC curve) jump to near-perfect, then remove it and see the honest score. _Save a copy to your Drive (File -> Save a copy in Drive) to keep your edits._" },
    { t: "code", src:
      "# Setup - numpy / scikit-learn / matplotlib ship with Colab.\n" +
      "import numpy as np\n" +
      "import matplotlib.pyplot as plt\n" +
      "from sklearn.model_selection import train_test_split\n" +
      "from sklearn.linear_model import LogisticRegression\n" +
      "from sklearn.metrics import roc_auc_score\n\n" +
      "rng = np.random.default_rng(0)" },
    { t: "md", src:
      "## First, build an honest dataset\n\n" +
      "Each row is one impression: three real features drive a rare click (about 6 percent positive). This is the data a correct pipeline would use." },
    { t: "code", src:
      "n = 4000\n" +
      "X = rng.normal(size=(n, 3))\n\n" +
      "true_w = np.array([1.1, -0.7, 0.4])\n" +
      "logits = X @ true_w - 3.0\n" +
      "p_true = 1.0 / (1.0 + np.exp(-logits))\n\n" +
      "y = (rng.random(n) < p_true).astype(int)\n\n" +
      "print(\"positive rate:\", round(float(y.mean()), 4))" },
    { t: "md", src:
      "## The leak, in one line of math\n\n" +
      "A leaky feature is any coordinate of $x_t$ that depends on the future label $y_{t+\\Delta}$. Here we inject the worst case: a near-copy of the label,\n\n" +
      "$$x_{\\text{leak}} = y + \\varepsilon,\\qquad \\varepsilon \\sim \\mathcal{N}(0,\\, 0.01).$$" },
    { t: "code", src:
      "# A post-outcome column: essentially the label with a little noise.\n" +
      "leak = y + rng.normal(scale=0.1, size=n)\n\n" +
      "X_leaky = np.column_stack([X, leak])\n\n" +
      "print(\"leaky design matrix shape:\", X_leaky.shape)" },
    { t: "md", src:
      "### Train both models on the same split\n\n" +
      "We fit an honest model on the three real features and a leaky model that also sees `leak`, then compare validation AUC." },
    { t: "code", src:
      "Xtr, Xva, ytr, yva = train_test_split(\n" +
      "    X, y, test_size=0.3, random_state=0, stratify=y\n" +
      ")\n\n" +
      "Xtr_l, Xva_l = train_test_split(\n" +
      "    X_leaky, test_size=0.3, random_state=0, stratify=y\n" +
      ")[:2]\n\n" +
      "honest = LogisticRegression().fit(Xtr, ytr)\n" +
      "leaky = LogisticRegression().fit(Xtr_l, ytr)\n\n" +
      "auc_honest = roc_auc_score(yva, honest.predict_proba(Xva)[:, 1])\n" +
      "auc_leaky = roc_auc_score(yva, leaky.predict_proba(Xva_l)[:, 1])\n\n" +
      "print(\"honest val AUC:\", round(auc_honest, 3))\n" +
      "print(\"leaky  val AUC:\", round(auc_leaky, 3))" },
    { t: "md", src:
      "### The leak inflates the score\n\n" +
      "The leaky model looks far better offline only because it is reading the label off its own input. We assert the inflation is large - that gap is the fingerprint of leakage." },
    { t: "code", src:
      "gap = auc_leaky - auc_honest\n\n" +
      "# Leakage produces an implausible offline lift that will not survive serving.\n" +
      "assert auc_leaky > 0.95\n" +
      "assert gap > 0.15\n\n" +
      "print(\"leakage inflated AUC by:\", round(gap, 3))" },
    { t: "md", src:
      "## Visualize the inflated score\n\n" +
      "The bars make the trap obvious: the leaky model's offline AUC is near-perfect, but only the honest bar reflects what production will actually see." },
    { t: "code", src:
      "labels = [\"honest\", \"leaky\"]\n" +
      "values = [auc_honest, auc_leaky]\n\n" +
      "fig, ax = plt.subplots(figsize=(4, 3))\n" +
      "ax.bar(labels, values, color=[\"#4c78a8\", \"#e45756\"])\n" +
      "ax.set_ylim(0.5, 1.0)\n" +
      "ax.set_ylabel(\"validation AUC\")\n" +
      "ax.set_title(\"leakage inflates the offline score\")\n" +
      "plt.show()" },
    { t: "md", src:
      "## Practice\n\n" +
      "Try each in the empty cell below.\n\n" +
      "1. Reduce the leak strength (raise the noise scale on `leak`) and watch the leaky AUC fall toward the honest one - leakage is a spectrum.\n" +
      "2. Replace the label-copy leak with a post-window count (e.g. `y * rng.poisson(3, n)`) and confirm it still leaks.\n" +
      "3. Remove the leaky column and re-verify that the honest AUC matches production expectations (around 0.7 here)." },
    { t: "code", src:
      "# Your turn:\n" }
  ]
};
