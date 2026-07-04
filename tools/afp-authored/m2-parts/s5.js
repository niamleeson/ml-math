/* M2.5 · Train/serve skew & the feature contract.
   Exports ONE sub-lesson object (sub + subtitle + the full lesson fields).
   Validate in isolation with:
     node tools/afp-check-part.js tools/afp-authored/m2-parts/s5.js
   LaTeX: double every backslash in JS strings; balance $…$; money is \\$.
   No <i>/<em>, no emoji. */
"use strict";

module.exports = {
  sub: "05",
  subtitle: "Train/serve skew & the feature contract",
  tagline: "A model can only be as consistent as the feature definition it sees in training and serving.",
  skipIf: "define train/serve skew, distinguish it from drift, and design a feature contract that keeps offline and online values identical for the same request time.",
  mapsTo: ["all"],
  connections: {
    buildsOn: ["target leakage and the serving-time question", "point-in-time feature joins", "feature scaling and categorical encodings"],
    leadsTo: ["feature stores", "production model monitoring", "reproducible retraining"],
    usedWith: ["logged features", "versioned pipelines", "population-shift statistics"]
  },
  motivation:
    "<p>You now know how to build features that avoid leakage at training time. The final production problem is more subtle: the model may be trained on one feature definition and served with another. Nothing about the model weights is necessarily wrong; the input it receives at prediction time is not the same input it learned from.</p>" +
    "<p>The load-bearing idea is the <b>feature contract</b>. A feature is not just a column name like `campaign_click_rate`; it is a versioned function, a time rule, missing-value behavior, units, and freshness expectation. If training and serving both call the same contract, offline evaluation has a chance to mean something. If they use different code paths, windows, defaults, or clocks, the model is solving one problem in the notebook and a different one in production.</p>",
  definition:
    "<p><b>Definition.</b> A feature has <b>train/serve skew</b> when the value computed for training differs from the value the online serving path computes for the same logical example at the same request time. It is a feature-definition bug, not a modeling bug: the model weights are fine, but the offline and online code paths disagree about what the feature means.</p>" +
    "<p><b>Skew is not drift.</b> Skew is an offline-versus-online mismatch at a single point in time. Drift is a change in the data over time while the same feature definition keeps running, so this month's population differs from last month's. Skew is fixed by unifying the definition; drift is handled by monitoring and retraining.</p>" +
    "<p><b>Common skew sources</b> are separate offline and online code paths, time-zone or unit mismatches, different defaults for missing values, aggregation windows that do not match, and stale online features. The durable fixes are to define each feature once and serve it consistently offline and online (a feature store), to version that definition so old training sets stay reproducible, and, as the strongest test, to log the exact feature values served in production and train on those, so the model learns from precisely what it will be given at serving time.</p>",
  worked: {
    problem: "An ads pCTR model is trained with `campaign_clicks_window` equal to clicks in the last 7 days, but the online feature service returns clicks in the last 1 day. The learned one-feature score is $s=-2+0.08c$. For one campaign at request time, the 7-day count is 120 and the 1-day count is 30. What score gap does skew create, and what fixes it?",
    skills: ["train/serve skew", "feature contracts", "score-gap arithmetic"],
    strategy: "Compute the score using the offline contract, compute it again using the online contract, then repair the feature definition rather than the model.",
    steps: [
      { do: "Score the training value", result: "$s_{7d}=-2+0.08(120)=7.6$", why: "the model was fit on the 7-day feature" },
      { do: "Score the serving value", result: "$s_{1d}=-2+0.08(30)=0.4$", why: "production is feeding the model a different feature" },
      { do: "Subtract the scores", result: "$\\Delta s=7.6-0.4=7.2$", why: "the gap comes only from the mismatched window" },
      { do: "Identify the bug", result: "7-day offline window versus 1-day online window", why: "the same feature name hides two definitions" },
      { do: "Fix the contract", result: "serve the versioned 7-day definition, or retrain and serve the versioned 1-day definition", why: "training and serving must call the same feature function" },
      { do: "Log at serving", result: "store `campaign_clicks_window=120` beside the impression if 7-day is the contract", why: "future training can reuse exactly what production served" }
    ],
    verify: "After unifying on 7 days, both paths compute $-2+0.08(120)=7.6$; after unifying on 1 day and retraining, both paths use the 1-day value and the old 7.2-point mismatch disappears.",
    answer: "The skew creates a 7.2 logit-point score gap. Fix the feature definition: version one window, use it in both training and serving, and log served feature values for reproducible retraining.",
    connects: "the feature contract — a column name is not enough; the function, window, units, defaults, and freshness rule must match."
  },
  practice: [
    {
      problem: "Offline `spend_last_7d` is stored in dollars, but online serving sends cents. The model uses $s=0.5+0.02x$. For a \\$40 spend, compute the offline and online scores and name the skew.",
      steps: [
        { do: "Compute the offline score", result: "$s_{\\text{off}}=0.5+0.02(40)=1.3$", why: "offline uses dollars" },
        { do: "Convert the online value", result: "$40=4000$ cents", why: "serving uses a different unit" },
        { do: "Compute the online score", result: "$s_{\\text{on}}=0.5+0.02(4000)=80.5$", why: "the same weight is applied to a value 100 times larger" },
        { do: "Name the bug", result: "unit mismatch skew", why: "the feature definition differs even though the column name matches" }
      ],
      answer: "Offline score is 1.3 and online score is 80.5; this is a unit mismatch in the feature contract."
    },
    {
      problem: "Training imputes missing `member_seniority` as 0, while serving imputes it as -1. With $s=1+0.6m$, what score gap appears for a missing value?",
      steps: [
        { do: "Score the training default", result: "$s_{\\text{train}}=1+0.6(0)=1$", why: "the offline imputer fills 0" },
        { do: "Score the serving default", result: "$s_{\\text{serve}}=1+0.6(-1)=0.4$", why: "the online imputer fills -1" },
        { do: "Subtract", result: "$\\Delta s=1-0.4=0.6$", why: "only default handling changed" }
      ],
      answer: "A 0.6 score gap appears; the contract must version and share the same missing-value rule."
    },
    {
      problem: "A feature store says `ctr_24h` must be refreshed every 15 minutes. At serving, the value is 65 minutes old. If the stale value is 0.08, the fresh value would be 0.11, and $s=-1+12\\,ctr$, compute the score gap and classify the issue.",
      steps: [
        { do: "Score the stale value", result: "$s_{\\text{stale}}=-1+12(0.08)=-0.04$", why: "serving used the cached value" },
        { do: "Score the fresh value", result: "$s_{\\text{fresh}}=-1+12(0.11)=0.32$", why: "the contract expected a current value" },
        { do: "Subtract", result: "$\\Delta s=0.32-(-0.04)=0.36$", why: "freshness is part of the feature contract" },
        { do: "Classify", result: "serving staleness skew", why: "training may be point-in-time correct while online values are too old" }
      ],
      answer: "The stale feature lowers the score by 0.36; this is train/serve skew from a freshness violation."
    },
    {
      problem: "A daily drift monitor compares yesterday's and today's binned feature shares: yesterday $[0.50,0.30,0.20]$, today $[0.40,0.35,0.25]$. Compute PSI using $\\sum (a_i-e_i)\\log(a_i/e_i)$ and say whether this is skew or drift.",
      steps: [
        { do: "Compute bin 1", result: "$(0.40-0.50)\\log(0.40/0.50)=0.0223$", why: "actual share is lower than expected" },
        { do: "Compute bin 2", result: "$(0.35-0.30)\\log(0.35/0.30)=0.0077$", why: "actual share is higher than expected" },
        { do: "Compute bin 3", result: "$(0.25-0.20)\\log(0.25/0.20)=0.0112$", why: "actual share is higher than expected" },
        { do: "Add the bins", result: "$PSI\\approx0.0412$", why: "PSI aggregates distribution shift" },
        { do: "Classify", result: "drift signal", why: "the comparison is across dates, not offline versus online for the same request" }
      ],
      answer: "PSI is about 0.041; it is a drift signal, not train/serve skew."
    },
    {
      problem: "A KS monitor reports maximum CDF gaps of 0.03 for offline-vs-served values on the same day and 0.18 for last month-vs-this month served values. Which one points to skew, and which one points to drift?",
      steps: [
        { do: "Inspect the same-day comparison", result: "$KS=0.03$ offline versus served", why: "this checks parity at the same point in time" },
        { do: "Inspect the month comparison", result: "$KS=0.18$ last month versus this month", why: "this checks population movement over time" },
        { do: "Classify the same-day statistic", result: "skew check", why: "offline and online values should match for the same requests" },
        { do: "Classify the month statistic", result: "drift check", why: "the same serving contract can see a changed population" }
      ],
      answer: "The same-day offline-vs-served KS is the skew check; the month-over-month served KS is the drift signal."
    }
  ],
  applications: [
    { title: "AFP pCTR window parity", background: "Ads click models often rely on recent campaign engagement. If the warehouse materializes a 7-day count but the online service uses a 1-day cache because it is cheaper, the model receives a different signal at launch than it saw in validation.", numbers: "With $s=-2+0.08c$, a campaign with 120 clicks in 7 days and 30 in 1 day scores 7.6 offline and 0.4 online, a 7.2 logit-point gap caused by the feature window alone." },
    { title: "Auction pacing with unit contracts", background: "Budget and spend features feed pacing models that decide how aggressively to bid. A cents-versus-dollars mismatch is especially dangerous because all signs look reasonable until the model multiplies by its learned weight.", numbers: "For `spend_last_7d=\\$40`, dollars give $0.5+0.02(40)=1.3$ while cents give $0.5+0.02(4000)=80.5$, a 79.2-point score error from units, not learning." },
    { title: "Cold-start advertiser defaults", background: "New campaigns and new advertisers have sparse histories, so missing-value defaults fire often. If offline uses zero and serving uses -1, the launch population can be skewed exactly where the model is already uncertain.", numbers: "With $s=1+0.6m$, the missing offline score is 1.0 and the serving score is 0.4, so every missing row shifts by 0.6 before the model sees any real evidence." },
    { title: "Feature-store parity for sponsored content freshness", background: "A feature store can make freshness explicit: a value is valid only if it was computed within its service-level rule. That turns hidden staleness into a contract violation that can be measured and alerted.", numbers: "If `ctr_24h` must be under 15 minutes old but is 65 minutes old, stale 0.08 versus fresh 0.11 changes $-1+12ctr$ from -0.04 to 0.32, a 0.36-point loss." },
    { title: "Log-and-wait training for ad retrieval", background: "High-scale systems often log the actual feature vector served with each request, wait for clicks or conversions, then train on those logged vectors. This removes ambiguity about which code path produced the row.", numbers: "If 10,000 impressions are served and 9,970 have logged feature version `campaign_ctr:v3`, the parity coverage is $9970/10000=99.7\%$; the remaining 0.3\% need backfill or exclusion." },
    { title: "Drift monitoring for market mix changes", background: "Drift is not the same as skew. A perfectly consistent feature can change distribution when a holiday campaign, geography shift, or new advertiser cohort enters the traffic mix.", numbers: "For expected shares [0.50, 0.30, 0.20] and actual shares [0.40, 0.35, 0.25], PSI is $0.0223+0.0077+0.0112=0.0412$, a small population-shift signal under the same contract." },
    { title: "Offline-online audit before an A/B test", background: "Before exposing members to a new model, teams can replay the same requests through offline materialization and online serving, then compare feature values. This catches contract bugs before they become experiment noise.", numbers: "In a 50,000-row replay, 49,850 rows match exactly and 150 differ, so parity is $49850/50000=99.7\%$ and mismatch rate is 0.3\%; the mismatched rows should be inspected by feature version and source." }
  ],
  applicationsClose:
    "<p>Across pCTR, pacing, cold-start defaults, freshness, logging, drift monitors, and replay audits, the same discipline keeps appearing: make the feature function explicit, version it, and compare the value the model trained on with the value production served. The model is only one part of the system; the contract around its inputs is what makes the score trustworthy.</p>",
  takeaways: [
    "Train/serve skew means offline and online feature values differ for the same logical example at the same time; it is a feature-definition bug.",
    "The feature contract includes code, aggregation window, point-in-time rule, units, missing defaults, freshness, and version.",
    "Feature stores, versioned definitions, point-in-time joins, and serving-time feature logs make offline-online parity operational.",
    "Skew is offline versus online at one time; drift is population movement over time under the same feature contract."
  ],
  resources: [
    { label: "Google — Rules of Machine Learning", note: "rules on training-serving skew, monitoring, and launch checks" },
    { label: "TFX Data Validation", note: "schema, skew, and drift detection tools for production ML pipelines" },
    { label: "Feast feature store documentation", note: "offline-online feature retrieval, point-in-time joins, and feature versioning patterns" }
  ],
  papers: [
    "Hidden Technical Debt in Machine Learning Systems (Sculley et al., 2015)",
    "TFX: A TensorFlow-Based Production-Scale Machine Learning Platform (Baylor et al., 2017)",
    "Data Management Challenges in Production Machine Learning (Polyzotis et al., 2017)"
  ],
  notebook: [
    { t: "md", src:
      "# M2.5 · Train/serve skew & the feature contract\n\n" +
      "_Curriculum · Domain 0 · ML Foundations · Feature engineering & leakage_\n\n" +
      "_Save a copy to your Drive_\n\n" +
      "A feature contract says training and serving must compute the same feature the same way for the same request. In this notebook we intentionally break that contract with a 7-day offline window and a 1-day online window, then repair it." },
    { t: "code", src:
      "import numpy as np\n" +
      "import pandas as pd\n" +
      "import matplotlib.pyplot as plt\n\n" +
      "rng = np.random.default_rng(25)" },
    { t: "md", src:
      "## Build deterministic campaign histories\n\n" +
      "Each row is one served ad opportunity. The true click probability depends on a 7-day campaign click count, so training on the 7-day feature is coherent." },
    { t: "code", src:
      "n = 1200\n\n" +
      "campaign_quality = rng.gamma(shape=2.0, scale=12.0, size=n)\n" +
      "clicks_7d = rng.poisson(lam=campaign_quality + 8.0)\n" +
      "share_recent = rng.beta(a=2.0, b=5.0, size=n)\n" +
      "clicks_1d = rng.binomial(n=clicks_7d, p=share_recent)\n\n" +
      "logits = -3.2 + 0.055 * clicks_7d\n" +
      "prob = 1.0 / (1.0 + np.exp(-logits))\n" +
      "clicked = (rng.random(n) < prob).astype(int)\n\n" +
      "df = pd.DataFrame({\n" +
      "    \"clicks_7d\": clicks_7d,\n" +
      "    \"clicks_1d\": clicks_1d,\n" +
      "    \"clicked\": clicked\n" +
      "})\n\n" +
      "df.head()" },
    { t: "md", src:
      "## Fit a tiny logistic model on the offline contract\n\n" +
      "We use one feature and plain gradient descent so the notebook stays CPU-only and deterministic." },
    { t: "code", src:
      "x_train = df[\"clicks_7d\"].to_numpy(dtype=float)\n" +
      "y = df[\"clicked\"].to_numpy(dtype=float)\n\n" +
      "mean_7d = x_train.mean()\n" +
      "std_7d = x_train.std()\n" +
      "z_train = (x_train - mean_7d) / std_7d\n\n" +
      "X = np.column_stack([np.ones(n), z_train])\n" +
      "w = np.zeros(2)\n" +
      "learning_rate = 0.15\n\n" +
      "for step in range(800):\n" +
      "    pred = 1.0 / (1.0 + np.exp(-(X @ w)))\n" +
      "    grad = X.T @ (pred - y) / n\n" +
      "    w = w - learning_rate * grad\n\n" +
      "print(\"weights:\", np.round(w, 3))" },
    { t: "md", src:
      "## Score the same requests two ways\n\n" +
      "The model was trained on `clicks_7d`. Serving now sends `clicks_1d` under the same column name, which is train/serve skew." },
    { t: "code", src:
      "def sigmoid(a):\n" +
      "    return 1.0 / (1.0 + np.exp(-a))\n\n" +
      "z_offline = (df[\"clicks_7d\"].to_numpy(dtype=float) - mean_7d) / std_7d\n" +
      "z_online_skewed = (df[\"clicks_1d\"].to_numpy(dtype=float) - mean_7d) / std_7d\n\n" +
      "p_offline = sigmoid(w[0] + w[1] * z_offline)\n" +
      "p_online_skewed = sigmoid(w[0] + w[1] * z_online_skewed)\n\n" +
      "mean_gap = np.mean(np.abs(p_offline - p_online_skewed))\n" +
      "max_gap = np.max(np.abs(p_offline - p_online_skewed))\n\n" +
      "print(\"mean prediction gap:\", round(float(mean_gap), 4))\n" +
      "print(\"max prediction gap:\", round(float(max_gap), 4))" },
    { t: "md", src:
      "## Assert the skew is real\n\n" +
      "For the same served requests, offline and online predictions should match. They do not, because the offline path used a 7-day window and the online path used a 1-day window." },
    { t: "code", src:
      "assert mean_gap > 0.04\n" +
      "assert max_gap > 0.10\n\n" +
      "example = int(np.argmax(np.abs(p_offline - p_online_skewed)))\n\n" +
      "print(df.loc[example, [\"clicks_7d\", \"clicks_1d\"]])\n" +
      "print(\"offline prediction:\", round(float(p_offline[example]), 4))\n" +
      "print(\"skewed online prediction:\", round(float(p_online_skewed[example]), 4))" },
    { t: "md", src:
      "## Repair the contract\n\n" +
      "If the versioned contract is 7 days, the serving path must retrieve or compute the same 7-day value. Then the score gap disappears for the same model and same requests." },
    { t: "code", src:
      "z_online_fixed = (df[\"clicks_7d\"].to_numpy(dtype=float) - mean_7d) / std_7d\n" +
      "p_online_fixed = sigmoid(w[0] + w[1] * z_online_fixed)\n\n" +
      "fixed_gap = np.max(np.abs(p_offline - p_online_fixed))\n\n" +
      "assert fixed_gap == 0.0\n\n" +
      "print(\"max gap after unifying definition:\", fixed_gap)" },
    { t: "md", src:
      "## Optional drift signal: PSI\n\n" +
      "Skew compares offline and online values at the same time. Drift compares populations across time under the same contract. PSI is one compact signal: $\\sum_i (a_i-e_i)\\log(a_i/e_i)$." },
    { t: "code", src:
      "def psi(expected, actual, bins):\n" +
      "    e_counts = np.histogram(expected, bins=bins)[0].astype(float)\n" +
      "    a_counts = np.histogram(actual, bins=bins)[0].astype(float)\n" +
      "    e_share = np.clip(e_counts / e_counts.sum(), 1e-6, None)\n" +
      "    a_share = np.clip(a_counts / a_counts.sum(), 1e-6, None)\n" +
      "    return float(np.sum((a_share - e_share) * np.log(a_share / e_share)))\n\n" +
      "next_week_7d = rng.poisson(lam=campaign_quality + 11.0)\n" +
      "bins = np.quantile(clicks_7d, np.linspace(0.0, 1.0, 6))\n" +
      "bins = np.unique(bins)\n\n" +
      "psi_value = psi(clicks_7d, next_week_7d, bins)\n\n" +
      "assert psi_value >= 0.0\n\n" +
      "print(\"PSI next week versus training week:\", round(psi_value, 4))" },
    { t: "md", src:
      "## Visual check\n\n" +
      "The left distribution is what the model learned. The skewed serving distribution is much smaller because it is a 1-day count pretending to be a 7-day feature." },
    { t: "code", src:
      "fig, ax = plt.subplots(figsize=(6, 3))\n\n" +
      "ax.hist(clicks_7d, bins=30, alpha=0.65, label=\"offline 7-day\")\n" +
      "ax.hist(clicks_1d, bins=30, alpha=0.65, label=\"online 1-day\")\n" +
      "ax.set_title(\"same feature name, different feature definition\")\n" +
      "ax.set_xlabel(\"click count\")\n" +
      "ax.set_ylabel(\"rows\")\n" +
      "ax.legend()\n\n" +
      "plt.show()" }
  ]
};
