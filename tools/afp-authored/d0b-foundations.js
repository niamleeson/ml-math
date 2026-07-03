/* =====================================================================
   AFP-AI Learning Guide — Domain 0 · ML Foundations  (modules M2–M5)
   ---------------------------------------------------------------------
   Authored source for the AFP-AI track. One object per module.
   Read by tools/gen-afp.js (-> lessons/afp-ai.js) and
   tools/gen-afp-notebooks.js (-> notebooks/afp-mNN.ipynb).
   ===================================================================== */
"use strict";

const M2 = {
  m: 2, domain: 0,
  title: "Feature engineering & leakage",
  tagline: "Turn raw logged events into trustworthy model inputs without accidentally smuggling the answer into the row.",
  skipIf: "explain target leakage and build a leak-free feature/label join, and handle and normalize categorical, numerical, and float features.",
  mapsTo: ["all"],
  connections: {
    buildsOn: ["supervised learning", "train/validation/test splitting", "feature vectors"],
    leadsTo: ["Loss & optimization", "Model families", "Calibration and ranking"],
    usedWith: ["point-in-time joins", "categorical encoding", "normalization", "train/serve skew checks"]
  },
  motivation:
    `<p>You already know how to fit a supervised model once each row has features $x$ and a label $y$. The harder production question is quieter: exactly what did the model know at prediction time? In ads and recommender systems, rows are built from logs, counters, user histories, creative metadata, and delayed outcomes. A single timestamp mistake can make validation look brilliant and production look ordinary.</p>` +
    `<p>Feature engineering is the craft of making those rows useful and honest. We encode categories, tame skewed numeric signals, normalize floats, and join labels only after freezing the feature time. The load-bearing idea is simple: every feature must be reproducible at serving time using only information available before the decision.</p>`,
  definition:
    `<p><b>Definition.</b> A feature pipeline maps a raw event history $H_t$ available at time $t$ into a vector $x_t=\\phi(H_t)$, then joins it to a later label $y_{t+\\Delta}$. A pipeline has <b>target leakage</b> if any coordinate of $x_t$ depends on $y_{t+\\Delta}$ or on information observed after $t$.</p>` +
    `<p><b>Point-in-time rule.</b> For an impression at time $t_i$, a valid aggregate uses only events with timestamps strictly before $t_i$: $$c_i = \\sum_j \\mathbf{1}\{\\text{event}_j < t_i\}.$$ Categorical values may be one-hot encoded, hashed, count encoded, or target encoded, but target encodings must be computed out-of-fold. Numeric features should be scaled or transformed using statistics fit on train only. Train/serve skew appears when the offline value $\\phi_{train}(H_t)$ differs from the online value $\\phi_{serve}(H_t)$ for the same request.</p>`,
  symbols: [
    { sym: "$t_i$", desc: "the decision time for impression or candidate row $i$." },
    { sym: "$y_i$", desc: "the future label, such as clicked within 24 hours." },
    { sym: "$H_{t_i}$", desc: "all logged information available before $t_i$." },
    { sym: "$\\phi$", desc: "the feature-building function applied to raw histories." },
    { sym: "$\\mu_{train}, \\sigma_{train}$", desc: "train-set mean and standard deviation used for scaling numeric features." }
  ],
  derivation: [
    { do: "Freeze prediction time", result: "row $i$ has cutoff $t_i$", why: "the model's inputs must match the moment it would be called online" },
    { do: "Filter source events", result: "keep events with time $< t_i$", why: "future behavior contains the label or consequences of the label" },
    { do: "Fit encoders on train", result: "scaler and vocabulary come from train only", why: "validation must simulate unseen data rather than share summary statistics" },
    { do: "Encode rare categories safely", result: "use hashing, minimum-count buckets, or out-of-fold target means", why: "high-cardinality IDs are useful but can memorize labels when encoded naively" }
  ],
  worked: {
    problem: "An ads click table has one row per impression: `impression_time`, `clicked_24h`, `campaign_id`, `member_country`, `campaign_clicks_24h_after`, and `campaign_clicks_7d_before`. Spot the leakage and build a leak-free feature row.",
    skills: ["leakage detection", "point-in-time joins", "encoding choices"],
    strategy: "Ask one question for every column: could the online scorer know this value before the impression was shown?",
    steps: [
      { do: "Set the cutoff", result: "$t_i = \\text{impression_time}_i$", why: "features must be computed as of the decision moment" },
      { do: "Check `clicked_24h`", result: "label only, not a feature", why: "it is the outcome we are trying to predict" },
      { do: "Check `campaign_clicks_24h_after`", result: "remove it", why: "it counts clicks after $t_i$ and therefore contains future response" },
      { do: "Check `campaign_clicks_7d_before`", result: "keep it if computed from events before $t_i$", why: "past campaign momentum can exist online" },
      { do: "Encode `campaign_id`", result: "hash bucket or out-of-fold count/target encoding", why: "raw IDs are categorical and high-cardinality" },
      { do: "Scale numeric counts", result: "$z=\\log(1+c)$ then standardize with train statistics", why: "counts are skewed and optimization behaves better on comparable ranges" }
    ],
    verify: "If the same request is replayed online at $t_i$, the kept features can be recomputed; the removed future count cannot.",
    answer: "Use `campaign_id` encoding, `member_country` encoding, and past aggregates such as `campaign_clicks_7d_before`; never use post-impression click counts as features.",
    connects: "this is supervised learning's feature-to-label frame, with a strict clock added so offline validation stays honest."
  },
  practice: [
    {
      problem: "A creator recommendation row includes `creator_followed_by_member_before_request` and `creator_followed_by_member_after_response`. Which is valid for training a follow prediction model?",
      steps: [
        { do: "Set the prediction time", result: "the request time is the cutoff", why: "the model scores before the member responds" },
        { do: "Check the before feature", result: "valid historical feature", why: "it is known at cutoff time" },
        { do: "Check the after feature", result: "leaky", why: "it is downstream of the label window" }
      ],
      answer: "Keep the before-request feature and drop the after-response feature."
    },
    {
      problem: "You target-encode `campaign_id` using the full dataset and then split train/validation. Why is this leaky, and what is the fix?",
      steps: [
        { do: "Inspect the encoding", result: "each validation row's category mean used its own label", why: "the full-data mean contains validation outcomes" },
        { do: "Move the split earlier", result: "fit encodings inside train folds", why: "validation rows need encodings from other rows only" },
        { do: "Apply to validation", result: "use train-fold means with smoothing", why: "this mimics an unseen category estimate" }
      ],
      answer: "Use out-of-fold target encoding on train and train-only smoothed means for validation/test."
    },
    {
      problem: "A numeric feature `past_spend_30d` has values 0, 2, 10, 1000. What transform would you try before standardization, and why?",
      steps: [
        { do: "Read the scale", result: "the feature is right-skewed", why: "one value is orders of magnitude larger" },
        { do: "Transform", result: "use $\\log(1+x)$", why: "it compresses large counts while keeping zero defined" },
        { do: "Standardize", result: "$z=(\\log(1+x)-\\mu_{train})/\\sigma_{train}$", why: "train-only scaling puts the transformed feature on a stable range" }
      ],
      answer: "Use `log1p` followed by train-only standardization."
    },
    {
      problem: "A country feature has 240 possible values, including many rare countries. Name two safe encodings.",
      steps: [
        { do: "Classify the feature", result: "categorical with rare levels", why: "one-hot alone creates many sparse columns" },
        { do: "Choose encoding one", result: "hashing trick", why: "fixed width handles unseen and rare categories" },
        { do: "Choose encoding two", result: "minimum-count bucket plus one-hot", why: "rare levels share an `other` bucket instead of memorizing noise" }
      ],
      answer: "Hash buckets, or one-hot with rare levels collapsed; out-of-fold count/target encodings are also options."
    },
    {
      problem: "Offline training uses a daily batch aggregate, but serving uses a streaming aggregate delayed by 10 minutes. What problem can this cause?",
      steps: [
        { do: "Compare definitions", result: "offline and online values differ for the same event", why: "batch has fresher or different data than serving" },
        { do: "Name the failure", result: "train/serve skew", why: "the model learns from features it will not receive online" },
        { do: "Fix the contract", result: "share feature definitions and replay online computation offline", why: "training should see the same values serving will produce" }
      ],
      answer: "It causes train/serve skew; align feature definitions or train from logged serving-time feature values."
    }
  ],
  applications: [
    { title: "Palette-driven pCTR feature clocks", background: "pCTR models often use member, advertiser, and context aggregates. The useful signal is past behavior, but the label is future click behavior, so the clock boundary decides whether the feature is valid.", numbers: "For an impression at 10:00, 12 campaign clicks from 09:00-09:59 are valid. The 3 clicks from 10:00-10:05 are invalid for that row; including them can move a sparse campaign feature from 12 to 15, a 25% leak-driven lift." },
    { title: "Creator Marketplace AI high-cardinality IDs", background: "Creator and advertiser IDs carry strong memorized priors, but raw IDs can explode the feature space. Hashing keeps a bounded representation for retrieval or ranking candidates.", numbers: "Hashing 2,000,000 creator IDs into 262,144 buckets gives an average load of $2{,}000{,}000/262{,}144 \\approx 7.63$ IDs per bucket; collisions are expected, so the model must combine ID buckets with content features." },
    { title: "Instream Ads content classification", background: "Video classifiers mix categorical taxonomy labels with numeric engagement features. Engagement features must be computed from organic traffic before the ad decision, not from ad delivery outcomes.", numbers: "A video with 400 organic impressions and 36 completions has pre-decision completion rate $36/400=0.09$. Adding 20 ad completions observed after serving would report $56/420=0.133$, changing the feature by 4.3 percentage points." },
    { title: "Event Ads cold-start pacing", background: "New events have little response history, so feature engineering falls back to organizer history, category priors, and smoothed counts.", numbers: "If an event has 1 click in 5 impressions and its category prior is 4%, a smoothed rate with weight 20 is $(1+20\\cdot0.04)/(5+20)=1.8/25=0.072$ rather than the noisy raw 20%." },
    { title: "Search Ads query relevance", background: "Query-ad relevance uses text features plus historical query statistics. Target leakage can appear when post-auction clicks are joined as if they were pre-auction query features.", numbers: "For query `data science course`, 80 prior impressions and 8 prior clicks give CTR 10%. If the current row's click is included, the count becomes 9/81=11.1%, a small but systematic label echo." },
    { title: "Creative Intelligence GenAI features", background: "Creative rankers may use generated labels such as tone, call-to-action, or image category. These are safe if generated from the creative before launch and unsafe if derived from campaign performance summaries.", numbers: "A prelaunch creative-quality score of 0.72 is valid. A postlaunch `top_decile_creative` flag computed after 10,000 impressions and 140 clicks uses the observed 1.4% CTR, so it cannot be a training feature for those impressions." },
    { title: "Event Organic discovery and Feed SPR", background: "Feed ranking features are often logged online and replayed offline. Using logged online features is a practical way to reduce skew because the row stores what serving actually saw.", numbers: "If offline recomputation says author affinity is 0.61 but logged serving value is 0.54, the absolute skew is 0.07. Across 1M rows, even a mean skew of 0.01 can move calibrated probabilities enough to affect rank order." }
  ],
  applicationsClose:
    `<p>Feature work is where offline ML becomes production ML. The same rule protects every project: encode the world as it was at decision time, fit transformations on train only, and make the online scorer able to reproduce the row exactly.</p>`,
  takeaways: [
    "Leakage means a feature depends on the future label or on information unavailable at serving time.",
    "Point-in-time joins, out-of-fold encodings, and train-only scaling keep validation honest.",
    "Categorical, numeric, and float features need different treatments, but all share the same serving-time contract.",
    "Train/serve skew is a feature-definition bug, not just a modeling bug."
  ],
  resources: [
    { label: "Google — Rules of Machine Learning", note: "the field guide to features that don't leak" },
    { label: "Feature Engineering for Machine Learning (Zheng & Casari)", note: "encodings, binning, scaling in depth" }
  ],
  papers: ["Practical Lessons from Predicting Clicks on Ads at Facebook (He et al., 2014)"],
  notebook: [
    { t: "md", src:
      `# M2 · Feature engineering & leakage\n\n` +
      `_Curriculum · Domain 0 · ML Foundations_\n\n` +
      `**Build leak-free features by respecting the prediction-time clock.**\n\n` +
      `We create a tiny ads click dataset with one honest historical feature and one leaky future feature. Run each cell top to bottom. _Save a copy to your Drive (File -> Save a copy in Drive) to keep your edits._` },
    { t: "code", src:
      `import numpy as np\n` +
      `import pandas as pd\n` +
      `import matplotlib.pyplot as plt\n` +
      `from sklearn.model_selection import train_test_split\n` +
      `from sklearn.linear_model import LogisticRegression\n` +
      `from sklearn.metrics import roc_auc_score\n` +
      `from sklearn.preprocessing import StandardScaler\n\n` +
      `rng = np.random.default_rng(2)` },
    { t: "md", src:
      `## The point-in-time rule\n\n` +
      `For a row scored at time $t_i$, valid aggregates use only prior events:\n\n` +
      `$$c_i = \\sum_j \\mathbf{1}\\{\\text{event}_j < t_i\\}$$\n\n` +
      `A feature computed after $t_i$ can accidentally contain the label.` },
    { t: "code", src:
      `n = 3000\n` +
      `past_clicks = rng.poisson(2.0, size=n)\n` +
      `country = rng.choice(["US", "IN", "BR", "DE"], size=n, p=[0.55, 0.25, 0.12, 0.08])\n` +
      `country_boost = np.where(country == "US", 0.25, 0.0)\n` +
      `logit = -3.2 + 0.35 * past_clicks + country_boost\n` +
      `p = 1.0 / (1.0 + np.exp(-logit))\n` +
      `clicked = (rng.random(n) < p).astype(int)\n` +
      `future_click_signal = clicked + rng.binomial(1, 0.03, size=n)\n\n` +
      `df = pd.DataFrame({"past_clicks": past_clicks, "country": country, "future_click_signal": future_click_signal, "clicked": clicked})\n` +
      `df.head()` },
    { t: "md", src:
      `## Step 1 - Look at the suspicious feature\n\n` +
      `A future signal should look too predictive because it is measured after the outcome window begins.` },
    { t: "code", src:
      `rate_by_future = df.groupby("future_click_signal")["clicked"].mean()\n\n` +
      `print(rate_by_future)\n\n` +
      `assert rate_by_future.loc[1] > rate_by_future.loc[0] + 0.5` },
    { t: "md", src:
      `## Step 2 - Build an honest feature matrix\n\n` +
      `We keep ` + "`past_clicks`" + ` and one-hot encode country. We do not include the future signal.` },
    { t: "code", src:
      `X_honest = pd.get_dummies(df[["past_clicks", "country"]], columns=["country"], drop_first=True)\n` +
      `y = df["clicked"].to_numpy()\n\n` +
      `X_train, X_val, y_train, y_val = train_test_split(X_honest, y, test_size=0.3, random_state=2, stratify=y)\n\n` +
      `scaler = StandardScaler()\n` +
      `X_train_scaled = X_train.copy()\n` +
      `X_val_scaled = X_val.copy()\n` +
      `X_train_scaled[["past_clicks"]] = scaler.fit_transform(X_train[["past_clicks"]])\n` +
      `X_val_scaled[["past_clicks"]] = scaler.transform(X_val[["past_clicks"]])\n\n` +
      `assert abs(X_train_scaled["past_clicks"].mean()) < 1e-12` },
    { t: "md", src:
      `## Step 3 - Compare honest and leaky validation AUC\n\n` +
      `The leaky model gets an offline score that would not survive serving.` },
    { t: "code", src:
      `honest_model = LogisticRegression(max_iter=1000)\n` +
      `honest_model.fit(X_train_scaled, y_train)\n\n` +
      `p_honest = honest_model.predict_proba(X_val_scaled)[:, 1]\n` +
      `auc_honest = roc_auc_score(y_val, p_honest)\n\n` +
      `X_leaky = X_honest.copy()\n` +
      `X_leaky["future_click_signal"] = df["future_click_signal"]\n` +
      `Xl_train, Xl_val, yl_train, yl_val = train_test_split(X_leaky, y, test_size=0.3, random_state=2, stratify=y)\n` +
      `leaky_model = LogisticRegression(max_iter=1000)\n` +
      `leaky_model.fit(Xl_train, yl_train)\n` +
      `p_leaky = leaky_model.predict_proba(Xl_val)[:, 1]\n` +
      `auc_leaky = roc_auc_score(yl_val, p_leaky)\n\n` +
      `print("honest AUC", round(auc_honest, 3))\n` +
      `print("leaky AUC", round(auc_leaky, 3))\n\n` +
      `assert auc_leaky > auc_honest + 0.2` },
    { t: "md", src:
      `## Visualize the leakage jump\n\n` +
      `A giant offline improvement from one availability-violating feature is a leakage smell, not a launch plan.` },
    { t: "code", src:
      `fig, ax = plt.subplots(figsize=(4, 3))\n` +
      `ax.bar(["honest", "leaky"], [auc_honest, auc_leaky], color=["#4c78a8", "#e45756"])\n` +
      `ax.set_ylim(0.5, 1.0)\n` +
      `ax.set_ylabel("validation AUC")\n` +
      `ax.set_title("leakage inflates offline metrics")\n` +
      `plt.show()` },
    { t: "md", src:
      `## Practice\n\n` +
      `1. Replace ` + "`past_clicks`" + ` with ` + "`np.log1p(past_clicks)`" + ` and compare AUC.\n` +
      `2. Add a rare country bucket before one-hot encoding.\n` +
      `3. Write a sentence explaining why train-only scaling matters.` },
    { t: "code", src:
      `# Your turn:\n` }
  ]
};

const M3 = {
  m: 3, domain: 0,
  title: "Loss & optimization (gradient descent, regularization)",
  tagline: "See training as a sequence of small parameter moves that reduce a chosen notion of wrongness.",
  skipIf: "derive and explain log loss + L1/L2 regularization and what the optimizer actually does.",
  mapsTo: ["all"],
  connections: {
    buildsOn: ["supervised learning", "probability", "derivatives and gradients"],
    leadsTo: ["Model families", "Calibration", "Neural network training"],
    usedWith: ["log loss", "SGD", "learning rate schedules", "L1 and L2 penalties"]
  },
  motivation:
    `<p>Once the features are honest, training still needs a target to chase. For click prediction, the model does not merely say yes or no; it outputs a probability. A prediction of 0.51 and a prediction of 0.99 are both positive at a 0.5 threshold, but they should not be punished the same when the click fails to happen.</p>` +
    `<p>Loss functions turn that judgment into a number, and optimizers turn the number into parameter updates. Regularization adds a second preference: among models that explain the data, prefer the one that is simpler, smaller, or sparser. This is the bridge from a model definition to a trained production artifact.</p>`,
  definition:
    `<p><b>Definition.</b> For binary labels $y\\in\{0,1\}$ and predicted probability $p=\\sigma(w^\\top x+b)$, <b>log loss</b> is $$\\ell(p,y)=-\\left[y\\log p+(1-y)\\log(1-p)\\right].$$ The regularized training objective is $$J(w,b)=\\frac{1}{n}\\sum_{i=1}^n \\ell(p_i,y_i)+\\lambda_1\|w\|_1+\\lambda_2\|w\|_2^2.$$ Gradient descent updates parameters by moving opposite the gradient: $$w \\leftarrow w-\\eta\\nabla_w J(w).$$</p>` +
    `<p><b>Assumptions that matter:</b> the loss is the behavior you actually want to improve; the learning rate $\\eta$ is small enough not to jump over good regions; and regularization strength is tuned on validation data. L2 shrinks weights smoothly. L1 can drive some weights exactly to zero, which is useful for sparse features.</p>`,
  symbols: [
    { sym: "$p_i$", desc: "model probability for example $i$." },
    { sym: "$w,b$", desc: "weights and intercept of the scorer." },
    { sym: "$\\eta$", desc: "learning rate, the step size for each update." },
    { sym: "$\\lambda_1,\\lambda_2$", desc: "regularization strengths for L1 and L2 penalties." },
    { sym: "$\\nabla_w J$", desc: "gradient of the objective with respect to the weights." }
  ],
  derivation: [
    { do: "Write the probability", result: "$p=\\sigma(z)$ with $z=w^\\top x+b$", why: "logistic models convert any score into a probability" },
    { do: "Differentiate the loss with respect to score", result: "$\\frac{\\partial \\ell}{\\partial z}=p-y$", why: "the sigmoid and cross-entropy simplify to prediction minus label" },
    { do: "Apply the chain rule to one weight", result: "$\\frac{\\partial \\ell}{\\partial w_j}=(p-y)x_j$", why: "the score changes by $x_j$ when weight $w_j$ changes" },
    { do: "Add L2 regularization", result: "$\\frac{\\partial}{\\partial w_j}\\lambda_2\|w\|_2^2=2\\lambda_2 w_j$", why: "large weights receive a pull back toward zero" },
    { do: "Update the weight", result: "$w_j \\leftarrow w_j-\\eta[(p-y)x_j+2\\lambda_2w_j]$", why: "moving opposite the gradient lowers the local objective" }
  ],
  worked: {
    problem: "For one impression, let $x=2$, $y=1$, current weight $w=0.3$, bias $b=-1.0$, learning rate $\\eta=0.1$, and no regularization. Do one gradient-descent step on logistic log loss.",
    skills: ["sigmoid", "log-loss gradient", "SGD update"],
    strategy: "Compute the probability first; for logistic loss the gradient is simply $(p-y)x$.",
    steps: [
      { do: "Compute the score", result: "$z=wx+b=0.3\\cdot2-1.0=-0.4$", why: "the sigmoid operates on the linear score" },
      { do: "Apply sigmoid", result: "$p=1/(1+e^{0.4})\\approx0.401$", why: "this is the model's current click probability" },
      { do: "Compute prediction error", result: "$p-y=0.401-1=-0.599$", why: "the positive example is underpredicted" },
      { do: "Compute the weight gradient", result: "$g_w=(p-y)x=-0.599\\cdot2=-1.198$", why: "larger feature values amplify the weight's effect" },
      { do: "Update the weight", result: "$w_{new}=0.3-0.1(-1.198)=0.4198$", why: "negative gradient means increasing the weight lowers loss" },
      { do: "Update the bias", result: "$b_{new}=-1.0-0.1(-0.599)=-0.9401$", why: "the bias gradient is $p-y$" }
    ],
    verify: "The new score is $0.4198\\cdot2-0.9401\\approx-0.1005$, so the probability rises from 0.401 to about 0.475, closer to the positive label.",
    answer: "$w\\approx0.420$ and $b\\approx-0.940$ after one SGD step.",
    connects: "optimization is not magic; it is repeated local moves that make the chosen loss smaller."
  },
  practice: [
    {
      problem: "For $y=0$ and $p=0.8$, compute the log loss.",
      steps: [
        { do: "Use the negative-label case", result: "$\\ell=-\\log(1-p)$", why: "$y=0$ removes the positive term" },
        { do: "Substitute $p=0.8$", result: "$\\ell=-\\log(0.2)$", why: "the model assigned high click probability to a non-click" },
        { do: "Evaluate", result: "$\\ell\\approx1.609$", why: "confident wrong predictions are expensive" }
      ],
      answer: "About 1.609 nats."
    },
    {
      problem: "For one feature with $x=3$, $y=0$, and $p=0.25$, compute the unregularized logistic gradient for the weight.",
      steps: [
        { do: "Compute error", result: "$p-y=0.25$", why: "the model overpredicts the negative example" },
        { do: "Multiply by feature", result: "$g=(p-y)x=0.25\\cdot3=0.75$", why: "the chain rule scales by the feature value" }
      ],
      answer: "The gradient is 0.75, so gradient descent will decrease the weight."
    },
    {
      problem: "A weight is $w=4$, $\\lambda_2=0.05$, and the data gradient is 0.3. What gradient does L2 add?",
      steps: [
        { do: "Differentiate L2", result: "$2\\lambda_2w$", why: "the penalty is $\\lambda_2w^2$ for one weight" },
        { do: "Substitute", result: "$2\\cdot0.05\\cdot4=0.4$", why: "large weights get a larger shrinkage force" },
        { do: "Combine", result: "$0.3+0.4=0.7$", why: "the optimizer sees data gradient plus penalty gradient" }
      ],
      answer: "L2 adds 0.4; total gradient is 0.7."
    },
    {
      problem: "Why can L1 produce sparse models while L2 usually does not?",
      steps: [
        { do: "Compare penalties", result: "L1 uses $\\lambda|w|$, L2 uses $\\lambda w^2$", why: "their geometry near zero differs" },
        { do: "Read the zero behavior", result: "L1 has a sharp corner at zero", why: "the subgradient can hold a coefficient exactly at zero" },
        { do: "Interpret", result: "some features are removed", why: "zero weights no longer affect predictions" }
      ],
      answer: "L1's corner at zero encourages exact zeros; L2 smoothly shrinks weights but rarely makes them exactly zero."
    },
    {
      problem: "If validation loss jumps up and down wildly across SGD steps, name one likely cause and one fix.",
      steps: [
        { do: "Read the symptom", result: "updates overshoot good regions", why: "large steps can bounce across the minimum" },
        { do: "Name the cause", result: "learning rate too high", why: "$\\eta$ controls update size" },
        { do: "Apply a fix", result: "reduce $\\eta$ or use a schedule/Adam", why: "smaller adaptive steps stabilize descent" }
      ],
      answer: "The learning rate is likely too high; reduce it or use a stable schedule/adaptive optimizer."
    }
  ],
  applications: [
    { title: "Palette-driven pCTR log loss", background: "Ads ranking needs calibrated probabilities, not just class labels. Log loss rewards probabilities that match observed click frequencies and punishes confident misses.", numbers: "For a clicked ad, predicting $p=0.02$ gives loss $-\\log0.02\\approx3.912$. Predicting $p=0.20$ gives $-\\log0.20\\approx1.609$, a reduction of 2.303 nats for the same positive label." },
    { title: "L2 shrinkage for Search Ads query features", background: "Sparse query-ad features can get huge weights from a few lucky clicks. L2 pulls those weights back unless there is enough repeated evidence.", numbers: "With weight 5 and $\\lambda_2=0.01$, L2 adds gradient $2\\cdot0.01\\cdot5=0.10$ toward zero on every batch, even before the data gradient is considered." },
    { title: "L1 sparsity in Creative Intelligence", background: "Creative rankers may start with thousands of generated attributes. L1 helps identify a smaller useful subset for interpretation and serving cost.", numbers: "If 8,000 candidate attributes train with L1 and 6,200 weights become zero, only 1,800 remain active; that is a 77.5% reduction in active feature count." },
    { title: "Adam for neural creator matching", background: "Embedding-heavy models have parameters with very different gradient scales. Adam adapts per-parameter step sizes, which is why it is a common default for neural recommenders.", numbers: "With learning rate 0.001, a raw gradient of 0.2 and second-moment estimate 0.04 gives normalized step about $0.001\\cdot0.2/\\sqrt{0.04}=0.001$, not 0.0002." },
    { title: "Event Ads cold-start regularization", background: "Cold-start slices have few labels, so an unregularized model can learn extreme coefficients for organizer or category IDs.", numbers: "A category with 2 clicks in 5 impressions has raw CTR 40%, while the global CTR is 5%. L2/priors stop a tiny slice from acting like it has the confidence of 10,000 impressions." },
    { title: "Instream Ads content classifier training", background: "Multiclass classifiers use cross-entropy, the multiclass version of log loss. The same idea punishes low probability on the true class.", numbers: "If the true class is `sports`, assigning probability 0.70 gives loss $-\\log0.70\\approx0.357$; assigning 0.10 gives $-\\log0.10\\approx2.303$." },
    { title: "Learning-rate gates before A/B tests", background: "Training instability can masquerade as modeling progress. Teams watch loss curves before trusting offline metrics.", numbers: "If validation log loss moves 0.231, 0.245, 0.229, 0.251 while train loss falls monotonically, reducing $\\eta$ from 0.1 to 0.03 is a targeted first experiment." }
  ],
  applicationsClose:
    `<p>Loss, gradients, and regularization are the small mechanics behind every large model. Once you can read a probability, a loss, and an update step, training curves become diagnostic instruments rather than mysterious lines.</p>`,
  takeaways: [
    "Log loss is the natural binary probability loss: confident wrong predictions are punished heavily.",
    "For logistic loss, the core gradient is $(p-y)x$, which makes SGD updates easy to interpret.",
    "L2 shrinks weights; L1 can make weights exactly zero; both should be tuned on validation data.",
    "The learning rate controls how aggressively the optimizer moves opposite the gradient."
  ],
  resources: [
    { label: "3Blue1Brown — Neural Networks", note: "visual gradient descent" },
    { label: "d2l.ai — Optimization", note: "SGD, momentum, Adam with code" }
  ],
  papers: ["Adam: A Method for Stochastic Optimization (Kingma & Ba, 2015)"],
  notebook: [
    { t: "md", src:
      `# M3 · Loss & optimization\n\n` +
      `_Curriculum · Domain 0 · ML Foundations_\n\n` +
      `**Watch one logistic model learn by moving opposite the gradient.**\n\n` +
      `This notebook computes log loss and gradient-descent updates directly. _Save a copy to your Drive (File -> Save a copy in Drive) to keep your edits._` },
    { t: "code", src:
      `import numpy as np\n` +
      `import matplotlib.pyplot as plt\n\n` +
      `rng = np.random.default_rng(3)` },
    { t: "md", src:
      `## The key formula\n\n` +
      `For binary logistic regression, $p=\\sigma(wx+b)$ and\n\n` +
      `$$\\ell(p,y)=-[y\\log p+(1-y)\\log(1-p)]$$\n\n` +
      `The one-example weight gradient is $(p-y)x$.` },
    { t: "code", src:
      `x = np.array([2.0])\n` +
      `y = np.array([1.0])\n` +
      `w = 0.3\n` +
      `b = -1.0\n` +
      `eta = 0.1\n\n` +
      `z = w * x + b\n` +
      `p = 1.0 / (1.0 + np.exp(-z))\n` +
      `loss = -(y * np.log(p) + (1.0 - y) * np.log(1.0 - p))\n\n` +
      `print("p", round(float(p[0]), 3))\n` +
      `print("loss", round(float(loss[0]), 3))` },
    { t: "md", src:
      `## Step 1 - Compute one gradient by hand in code\n\n` +
      `The positive label is underpredicted, so the gradient should increase the weight.` },
    { t: "code", src:
      `grad_w = float((p - y) * x)\n` +
      `grad_b = float(p - y)\n\n` +
      `print("grad_w", round(grad_w, 3))\n` +
      `print("grad_b", round(grad_b, 3))\n\n` +
      `assert grad_w < 0` },
    { t: "md", src:
      `## Step 2 - Take one SGD step\n\n` +
      `The update $w \\leftarrow w - \\eta g$ moves opposite the gradient.` },
    { t: "code", src:
      `w_new = w - eta * grad_w\n` +
      `b_new = b - eta * grad_b\n\n` +
      `p_old = float(p[0])\n` +
      `p_new = float(1.0 / (1.0 + np.exp(-(w_new * x[0] + b_new))))\n\n` +
      `print("old p", round(p_old, 3))\n` +
      `print("new p", round(p_new, 3))\n\n` +
      `assert p_new > p_old` },
    { t: "md", src:
      `## Step 3 - Train on a small synthetic dataset\n\n` +
      `Now repeat the same update many times and store the loss curve.` },
    { t: "code", src:
      `n = 600\n` +
      `X = rng.normal(size=n)\n` +
      `true_p = 1.0 / (1.0 + np.exp(-(1.4 * X - 0.8)))\n` +
      `Y = (rng.random(n) < true_p).astype(float)\n\n` +
      `w_fit = 0.0\n` +
      `b_fit = 0.0\n` +
      `eta_fit = 0.3\n` +
      `losses = []\n\n` +
      `for step in range(80):\n` +
      `    pred = 1.0 / (1.0 + np.exp(-(w_fit * X + b_fit)))\n` +
      `    loss_value = -np.mean(Y * np.log(pred + 1e-12) + (1.0 - Y) * np.log(1.0 - pred + 1e-12))\n` +
      `    grad_w_fit = np.mean((pred - Y) * X)\n` +
      `    grad_b_fit = np.mean(pred - Y)\n` +
      `    w_fit = w_fit - eta_fit * grad_w_fit\n` +
      `    b_fit = b_fit - eta_fit * grad_b_fit\n` +
      `    losses.append(loss_value)\n\n` +
      `print("first loss", round(losses[0], 3))\n` +
      `print("last loss", round(losses[-1], 3))\n\n` +
      `assert losses[-1] < losses[0]` },
    { t: "md", src:
      `## Visualize optimization\n\n` +
      `A healthy loss curve trends downward even if individual stochastic updates may wiggle.` },
    { t: "code", src:
      `fig, ax = plt.subplots(figsize=(5, 3))\n` +
      `ax.plot(losses)\n` +
      `ax.set_xlabel("gradient step")\n` +
      `ax.set_ylabel("log loss")\n` +
      `ax.set_title("loss decreases under gradient descent")\n` +
      `plt.show()` },
    { t: "md", src:
      `## Practice\n\n` +
      `1. Change ` + "`eta_fit`" + ` to 1.5 and inspect the curve.\n` +
      `2. Add L2 by adding ` + "`0.01 * w_fit`" + ` to the weight gradient.\n` +
      `3. Start from ` + "`w_fit = 5.0`" + ` and watch regularization shrink it.` },
    { t: "code", src:
      `# Your turn:\n` }
  ]
};

const M4 = {
  m: 4, domain: 0,
  title: "Model families (linear → GBDT → intro to neural nets)",
  tagline: "Choose the model whose built-in assumptions match the data shape, serving constraints, and signal you actually have.",
  skipIf: "say when you'd pick a GBDT vs a neural net and why.",
  mapsTo: ["all"],
  connections: {
    buildsOn: ["supervised learning", "feature engineering", "loss and optimization"],
    leadsTo: ["Offline metrics", "Embeddings", "Ranking architectures"],
    usedWith: ["bias-variance tradeoff", "sparse categorical features", "ensembles", "multilayer perceptrons"]
  },
  motivation:
    `<p>After you can build clean features and optimize a loss, the next question is which family should carry the signal. A linear model is fast and stable but can miss interactions. A tree ensemble finds thresholds and interactions in tabular data with little feature scaling. A neural network can learn dense representations, but it usually asks for more data, more tuning, and more care.</p>` +
    `<p>Good model choice is not about fashion. It is about inductive bias: the assumptions a model makes easy. Ads systems often use all three families in different layers: linear baselines for reliability, GBDTs for tabular response models, and neural nets for embeddings, text, images, and sequence-heavy ranking.</p>`,
  definition:
    `<p><b>Definition.</b> A model family is a set of functions $\\mathcal{F}=\{f_\\theta\}$ with a shared structure. Linear/logistic models use $f(x)=w^\\top x+b$. Decision trees partition feature space into regions. A GBDT adds many small trees stage by stage, $$F_M(x)=\\sum_{m=1}^M \\eta h_m(x),$$ where each tree $h_m$ fits the current residual or negative gradient. A multilayer perceptron composes affine maps and nonlinearities, $$f(x)=W_L\\sigma(W_{L-1}\\sigma(\\cdots\\sigma(W_1x))).$$</p>` +
    `<p><b>Assumptions that matter:</b> linear models assume mostly additive effects; GBDTs assume useful tabular splits and low-to-medium dimensional dense features; neural nets shine when representation learning from high-cardinality sparse IDs, text, images, or sequences matters. Capacity reduces bias but can raise variance and serving cost.</p>`,
  symbols: [
    { sym: "$\\mathcal{F}$", desc: "the set of functions a model family can represent." },
    { sym: "$h_m$", desc: "the $m$th tree added by a boosting model." },
    { sym: "$\\eta$", desc: "boosting learning rate, shrinking each tree's contribution." },
    { sym: "$\\sigma$", desc: "a nonlinear activation in a neural network." },
    { sym: "$W_l$", desc: "the weight matrix at neural network layer $l$." }
  ],
  derivation: [
    { do: "Start with linear", result: "$f(x)=w^\\top x+b$", why: "additive effects are simple, stable, and easy to debug" },
    { do: "Add tree splits", result: "partition rows by thresholds", why: "tabular interactions like age bucket times device type become easy" },
    { do: "Boost trees", result: "$F_m=F_{m-1}+\\eta h_m$", why: "each new tree corrects remaining errors" },
    { do: "Compose neural layers", result: "learn features before predicting", why: "embeddings, text, and sequences need representation learning, not just hand-built columns" },
    { do: "Trade bias and variance", result: "capacity rises from linear to GBDT to deep nets", why: "more flexible families can fit richer patterns but need more data and controls" }
  ],
  worked: {
    problem: "You own an ads-tabular pCTR problem with 20 numeric aggregates, 15 categorical fields after encoding, 2M rows, strict latency, and no text/image inputs. Pick a starting model family and justify it.",
    skills: ["model selection", "inductive bias", "bias-variance reasoning"],
    strategy: "Match data shape first, then check whether representation learning is required.",
    steps: [
      { do: "Identify the data shape", result: "mostly tabular features", why: "the inputs are engineered counts, rates, and categorical encodings" },
      { do: "Check data volume", result: "2M rows", why: "enough for GBDT and linear baselines; not automatically enough to justify a deep architecture" },
      { do: "Check representation need", result: "no raw text, image, or sequence inputs", why: "neural representation learning is not the main missing capability" },
      { do: "Check interactions", result: "likely nonlinear feature thresholds and crosses", why: "GBDTs naturally capture tabular interactions without manual crosses" },
      { do: "Choose the baseline", result: "start with logistic regression", why: "it gives calibration, debugging, and a latency floor" },
      { do: "Choose the main candidate", result: "train a GBDT", why: "it matches tabular data and often dominates engineered-feature response models" }
    ],
    verify: "If a later version adds creative text embeddings or member sequence embeddings, the neural option becomes more attractive because the input shape changes.",
    answer: "Use logistic regression as the baseline and GBDT as the first strong model; reserve neural nets for representation-heavy extensions.",
    connects: "model families differ by inductive bias, not just leaderboard reputation."
  },
  practice: [
    {
      problem: "A content classifier uses video title text and thumbnail embeddings. Which family is more natural: GBDT on raw tokens or a neural network?",
      steps: [
        { do: "Inspect inputs", result: "text and image-derived embeddings", why: "the data are representation-heavy" },
        { do: "Match family", result: "neural network", why: "nets can learn or combine dense semantic representations" },
        { do: "Add baseline", result: "linear model on frozen embeddings", why: "a simple baseline still anchors evaluation" }
      ],
      answer: "A neural network is natural, with a linear-on-embedding baseline for comparison."
    },
    {
      problem: "A model must score in under 1 ms on CPU with 200 sparse binary features. What family would you try first?",
      steps: [
        { do: "Read the constraint", result: "very tight latency", why: "serving cost is part of model choice" },
        { do: "Read the feature type", result: "sparse binary columns", why: "linear scoring is a dot product over active features" },
        { do: "Choose", result: "regularized linear/logistic model", why: "it is fast, stable, and easy to deploy" }
      ],
      answer: "Start with a regularized linear/logistic model."
    },
    {
      problem: "A GBDT improves train AUC by 0.08 over linear but validation AUC by only 0.005. What concern does this raise?",
      steps: [
        { do: "Compare gains", result: "train gain is much larger than validation gain", why: "capacity may be fitting sample-specific patterns" },
        { do: "Name the concern", result: "overfitting or high variance", why: "the flexible model does not generalize proportionally" },
        { do: "Respond", result: "regularize trees or simplify", why: "shallower trees, fewer trees, or lower learning rate can reduce variance" }
      ],
      answer: "The GBDT may be overfitting; tune tree depth, number of trees, learning rate, and regularization."
    },
    {
      problem: "Why can GBDTs handle unscaled numeric features better than gradient-trained neural nets?",
      steps: [
        { do: "Read tree operation", result: "trees compare thresholds", why: "a split such as $x<10$ does not require standardized scale" },
        { do: "Read neural optimization", result: "gradient steps depend on feature scale", why: "large-scale features can dominate updates" },
        { do: "Conclude", result: "scaling matters more for neural/linear gradient training", why: "optimization geometry changes with scale" }
      ],
      answer: "Trees split by order/thresholds; neural and linear optimizers are sensitive to feature magnitudes."
    },
    {
      problem: "A recommender uses member ID, item ID, and long interaction sequences. Why might a neural model beat a GBDT?",
      steps: [
        { do: "Inspect cardinality", result: "IDs are high-cardinality", why: "one-hot tabular treatment is sparse and hard to share" },
        { do: "Inspect sequence signal", result: "history order matters", why: "recent actions and patterns carry meaning" },
        { do: "Match family", result: "embeddings plus sequence network", why: "neural nets learn dense shared representations" }
      ],
      answer: "Neural models can learn embeddings and sequence representations that GBDTs on hand-built features may miss."
    }
  ],
  applications: [
    { title: "GBDT for Palette-driven pCTR tabular signals", background: "Classic ads response models often start with engineered tabular signals: past CTRs, budgets, frequencies, advertiser quality, and context features. GBDTs naturally find threshold interactions among them.", numbers: "If a linear baseline has validation AUC 0.742 and a GBDT reaches 0.764, the absolute gain is 0.022. On 10M impression pairs, that means many more positive-negative pairs are correctly ordered." },
    { title: "Linear baselines for Search Ads filters", background: "Query relevance filters often need predictable latency and debuggable weights. Linear models remain strong when features are sparse lexical matches and calibrated priors.", numbers: "With 40 active sparse features, a linear scorer needs about 40 multiply-adds. A 500-tree GBDT at depth 6 needs up to 3,000 branch decisions, which may be unnecessary for a first-stage filter." },
    { title: "Neural nets for Creator Marketplace matching", background: "Matching a brand brief to creators depends on language, audience embeddings, and creator histories. Neural two-tower or cross-encoder models can learn shared semantic spaces.", numbers: "A 128-dimensional brief embedding and 128-dimensional creator embedding compare with 128 dot-product terms; retrieving top candidates from 1M creators becomes feasible with approximate nearest neighbor search." },
    { title: "Instream Ads content understanding", background: "Organic-video relevance and safety classification often use text, audio, frame, and metadata representations. Neural nets dominate when raw modalities matter.", numbers: "A thumbnail embedding of 512 floats plus a title embedding of 384 floats gives 896 dense inputs before metadata. A small MLP with 896 by 128 first-layer weights has 114,688 weights, manageable with enough labels." },
    { title: "Event Ads cold-start hybrid", background: "Cold-start event pacing may combine a GBDT over event metadata with neural embeddings for organizer and topic similarity. Hybrid systems use each family where its bias fits.", numbers: "If the tabular GBDT predicts pAttend 0.030 and an embedding similarity feature adds a calibrated lift of 1.4, the combined prior-style estimate is about $0.030\\cdot1.4=0.042$ before clipping/calibration." },
    { title: "Creative Intelligence ranker selection", background: "Creative rankers may begin as GBDTs over generated attributes, then move to neural models when generated text/image embeddings become central.", numbers: "A GBDT using 120 generated attributes may score in 4 ms. A neural model using 768-dimensional creative embeddings may improve NDCG@10 by 0.015 but cost 12 ms, making latency part of the decision." },
    { title: "Wide & Deep style ads ranking", background: "Wide linear terms memorize important sparse crosses while deep components generalize through embeddings. This is why hybrid recommender architectures became common.", numbers: "A wide feature `query=data_science AND advertiser=learning` can carry one memorized weight, while a 64-dimensional advertiser embedding shares signal across thousands of related advertisers." }
  ],
  applicationsClose:
    `<p>Model families are tools with personalities. Linear models are fast and transparent, GBDTs are strong tabular pattern finders, and neural nets learn representations. The production choice is the one whose strengths line up with the data and constraints in front of you.</p>`,
  takeaways: [
    "Choose model families by data shape, inductive bias, latency, and debugging needs.",
    "GBDTs are often excellent for engineered tabular features because they capture nonlinear thresholds and interactions.",
    "Neural nets are strongest when embeddings, raw modalities, high-cardinality IDs, or sequences must be learned.",
    "A simple linear baseline is still valuable for calibration, latency, and sanity checks."
  ],
  resources: [
    { label: "StatQuest — Gradient Boost", note: "boosting from scratch, visually" },
    { label: "XGBoost documentation", note: "the production GBDT" },
    { label: "d2l.ai", note: "from linear models to MLPs" }
  ],
  papers: [
    "Wide & Deep Learning for Recommender Systems (Cheng et al., 2016)",
    "DeepFM (Guo et al., 2017)"
  ],
  notebook: [
    { t: "md", src:
      `# M4 · Model families\n\n` +
      `_Curriculum · Domain 0 · ML Foundations_\n\n` +
      `**Compare a linear model with a tree ensemble on tabular ads-style data.**\n\n` +
      `We create nonlinear tabular signal, then compare logistic regression and a gradient boosting model. _Save a copy to your Drive (File -> Save a copy in Drive) to keep your edits._` },
    { t: "code", src:
      `import numpy as np\n` +
      `import matplotlib.pyplot as plt\n` +
      `from sklearn.model_selection import train_test_split\n` +
      `from sklearn.linear_model import LogisticRegression\n` +
      `from sklearn.ensemble import GradientBoostingClassifier\n` +
      `from sklearn.metrics import roc_auc_score\n\n` +
      `rng = np.random.default_rng(4)` },
    { t: "md", src:
      `## Three families in formulas\n\n` +
      `Linear models use $f(x)=w^\\top x+b$. Boosted trees add small trees, $F_M(x)=\\sum_{m=1}^M \\eta h_m(x)$. Neural nets compose layers, $f(x)=W_L\\sigma(\\cdots\\sigma(W_1x))$.` },
    { t: "code", src:
      `n = 4000\n` +
      `x1 = rng.normal(size=n)\n` +
      `x2 = rng.normal(size=n)\n` +
      `x3 = rng.normal(size=n)\n` +
      `interaction = (x1 > 0.4) & (x2 < -0.2)\n` +
      `logit = -2.2 + 0.4 * x3 + 2.2 * interaction.astype(float)\n` +
      `p = 1.0 / (1.0 + np.exp(-logit))\n` +
      `y = (rng.random(n) < p).astype(int)\n` +
      `X = np.column_stack([x1, x2, x3])\n\n` +
      `print("positive rate", round(y.mean(), 3))` },
    { t: "md", src:
      `## Step 1 - Split once\n\n` +
      `Both families get the same train/validation split so the comparison is fair.` },
    { t: "code", src:
      `X_train, X_val, y_train, y_val = train_test_split(X, y, test_size=0.3, random_state=4, stratify=y)\n\n` +
      `assert abs(y_train.mean() - y_val.mean()) < 0.02` },
    { t: "md", src:
      `## Step 2 - Fit a linear baseline\n\n` +
      `The signal contains a threshold interaction, which a plain linear model cannot express directly.` },
    { t: "code", src:
      `linear = LogisticRegression(max_iter=1000)\n` +
      `linear.fit(X_train, y_train)\n` +
      `p_linear = linear.predict_proba(X_val)[:, 1]\n` +
      `auc_linear = roc_auc_score(y_val, p_linear)\n\n` +
      `print("linear AUC", round(auc_linear, 3))` },
    { t: "md", src:
      `## Step 3 - Fit a boosted-tree model\n\n` +
      `The tree ensemble can split on $x_1>0.4$ and $x_2<-0.2$, then combine those regions.` },
    { t: "code", src:
      `gbdt = GradientBoostingClassifier(random_state=4, n_estimators=80, max_depth=2, learning_rate=0.08)\n` +
      `gbdt.fit(X_train, y_train)\n` +
      `p_gbdt = gbdt.predict_proba(X_val)[:, 1]\n` +
      `auc_gbdt = roc_auc_score(y_val, p_gbdt)\n\n` +
      `print("GBDT AUC", round(auc_gbdt, 3))\n\n` +
      `assert auc_gbdt > auc_linear + 0.03` },
    { t: "md", src:
      `## Visualize the family comparison\n\n` +
      `This is not a universal law; it is a demonstration of matching family bias to tabular interactions.` },
    { t: "code", src:
      `fig, ax = plt.subplots(figsize=(4, 3))\n` +
      `ax.bar(["linear", "GBDT"], [auc_linear, auc_gbdt], color=["#4c78a8", "#54a24b"])\n` +
      `ax.set_ylim(0.5, 1.0)\n` +
      `ax.set_ylabel("validation AUC")\n` +
      `ax.set_title("model family matters")\n` +
      `plt.show()` },
    { t: "md", src:
      `## Practice\n\n` +
      `1. Add an explicit interaction feature ` + "`(x1 > 0.4) * (x2 < -0.2)`" + ` to the linear model.\n` +
      `2. Reduce ` + "`max_depth`" + ` to 1 and compare AUC.\n` +
      `3. Increase ` + "`n_estimators`" + ` and watch for overfitting.` },
    { t: "code", src:
      `# Your turn:\n` }
  ]
};

const M5 = {
  m: 5, domain: 0,
  title: "Offline metrics (AUC, Precision, Recall, F1, MRR, NDCG)",
  tagline: "Translate model scores into the exact offline questions that ranking, filtering, and launch decisions need answered.",
  skipIf: "interpret an ROC + NDCG and design a per-slice evaluation.",
  mapsTo: ["all"],
  connections: {
    buildsOn: ["supervised learning", "feature engineering", "model families"],
    leadsTo: ["Calibration", "Ranking losses", "Experiment design"],
    usedWith: ["confusion matrices", "ROC curves", "precision-recall curves", "MRR", "NDCG", "slice analysis"]
  },
  motivation:
    `<p>A trained model gives scores, but the team still has to decide whether those scores are good enough for a launch, a retrain, or another week of feature work. Accuracy may be fine for a balanced toy problem and useless for rare clicks. A ranking model can have no single threshold at all, because its job is to order candidates.</p>` +
    `<p>Offline metrics are the language of those decisions. Precision and recall describe thresholded filters. AUC asks whether positives outrank negatives. MRR rewards putting the first relevant result early. NDCG handles graded relevance and top-heavy ranking. Per-slice evaluation keeps a global win from hiding a failure on a business-critical segment.</p>`,
  definition:
    `<p><b>Definition.</b> For a binary classifier at a threshold, precision is $\\frac{TP}{TP+FP}$, recall is $\\frac{TP}{TP+FN}$, and $F1=\\frac{2PR}{P+R}$. ROC-AUC is the probability that a randomly chosen positive receives a higher score than a randomly chosen negative, with ties counted as half. For ranked lists, reciprocal rank is $1/r$ for the first relevant item at rank $r$, and $$DCG@k=\\sum_{i=1}^k \\frac{rel_i}{\\log_2(i+1)},\\qquad NDCG@k=\\frac{DCG@k}{IDCG@k}.$$</p>` +
    `<p><b>Assumptions that matter:</b> the metric must match product behavior, labels must mean the same thing across slices, and the evaluation window must match the prediction window. For imbalanced click tasks, PR-AUC can be more sensitive than ROC-AUC. For ranking tasks with graded labels, NDCG is often more informative than binary precision.</p>`,
  symbols: [
    { sym: "$TP,FP,TN,FN$", desc: "confusion-matrix counts after choosing a threshold." },
    { sym: "$P,R$", desc: "precision and recall." },
    { sym: "$rel_i$", desc: "relevance grade of the item shown at rank $i$." },
    { sym: "$DCG@k$", desc: "discounted cumulative gain through rank $k$." },
    { sym: "$IDCG@k$", desc: "the best possible DCG@k for the same labels." }
  ],
  derivation: [
    { do: "Choose a threshold", result: "scores become predicted positives or negatives", why: "precision and recall require decisions, not just scores" },
    { do: "Count outcomes", result: "$TP,FP,FN,TN$", why: "each prediction-label pair falls into one confusion-matrix cell" },
    { do: "Compute precision", result: "$TP/(TP+FP)$", why: "it asks how many selected items were truly relevant" },
    { do: "Compute recall", result: "$TP/(TP+FN)$", why: "it asks how many relevant items were found" },
    { do: "Rank by score", result: "AUC and NDCG use order", why: "many ads and recommender systems care about ranking more than a fixed threshold" }
  ],
  worked: {
    problem: "A ranked list has labels and scores: A $(y=1,s=0.9)$, B $(y=0,s=0.8)$, C $(y=1,s=0.4)$, D $(y=0,s=0.3)$. Compute AUC. Then compute NDCG@3 for graded relevances [3, 0, 1] in that displayed order.",
    skills: ["pairwise AUC", "DCG", "NDCG"],
    strategy: "For AUC, compare every positive-negative pair. For NDCG, compute displayed DCG and divide by ideal DCG.",
    steps: [
      { do: "List positive scores", result: "0.9 and 0.4", why: "AUC compares positives against negatives" },
      { do: "List negative scores", result: "0.8 and 0.3", why: "there are two negatives" },
      { do: "Count pair wins", result: "0.9 beats 0.8 and 0.3; 0.4 loses to 0.8 and beats 0.3", why: "each positive-negative pair contributes one win or loss" },
      { do: "Compute AUC", result: "$3/4=0.75$", why: "three wins out of four positive-negative pairs" },
      { do: "Compute DCG@3", result: "$3/\\log_2 2+0/\\log_2 3+1/\\log_2 4=3.5$", why: "rank 1 is undiscounted and rank 3 is divided by 2" },
      { do: "Compute IDCG@3", result: "$3/\\log_2 2+1/\\log_2 3+0/\\log_2 4\\approx3.631$", why: "the ideal order puts relevance 3 before relevance 1" },
      { do: "Normalize", result: "$NDCG@3=3.5/3.631\\approx0.964$", why: "normalization compares against the best possible ordering" }
    ],
    verify: "The AUC is below 1 because one negative outranks one positive; the NDCG is high because the most relevant item is already first.",
    answer: "AUC = 0.75 and NDCG@3 ≈ 0.964.",
    connects: "classification and ranking metrics answer different offline questions from the same scored examples."
  },
  practice: [
    {
      problem: "At a threshold, a classifier has TP=30, FP=10, FN=20. Compute precision, recall, and F1.",
      steps: [
        { do: "Compute precision", result: "$30/(30+10)=0.75$", why: "40 items were predicted positive" },
        { do: "Compute recall", result: "$30/(30+20)=0.60$", why: "50 true positives existed" },
        { do: "Compute F1", result: "$2\\cdot0.75\\cdot0.60/(0.75+0.60)=0.667$", why: "F1 is the harmonic mean" }
      ],
      answer: "Precision 0.75, recall 0.60, F1 about 0.667."
    },
    {
      problem: "AUC compares positive scores [0.9, 0.2] to negative scores [0.8, 0.1]. Compute AUC.",
      steps: [
        { do: "Count pairs", result: "$2\\cdot2=4$ pairs", why: "each positive is compared with each negative" },
        { do: "Count wins", result: "0.9 wins twice; 0.2 beats 0.1 and loses to 0.8", why: "three positive-negative orderings are correct" },
        { do: "Divide", result: "$3/4=0.75$", why: "AUC is the fraction of pairwise wins" }
      ],
      answer: "AUC is 0.75."
    },
    {
      problem: "A ranked result has first relevant item at rank 4. What is reciprocal rank?",
      steps: [
        { do: "Identify rank", result: "$r=4$", why: "MRR uses only the first relevant item" },
        { do: "Invert", result: "$1/r=1/4=0.25$", why: "earlier first hits get larger reciprocal rank" }
      ],
      answer: "The reciprocal rank is 0.25."
    },
    {
      problem: "Compute DCG@3 for relevance grades [2, 1, 0].",
      steps: [
        { do: "Write the formula", result: "$DCG@3=2/\\log_2 2+1/\\log_2 3+0/\\log_2 4$", why: "each rank is discounted by $\\log_2(i+1)$" },
        { do: "Evaluate terms", result: "$2+0.631+0$", why: "$\\log_2 3\\approx1.585$" },
        { do: "Add", result: "$2.631$", why: "DCG sums discounted gains" }
      ],
      answer: "DCG@3 is about 2.631."
    },
    {
      problem: "A global AUC improves from 0.760 to 0.770, but the new-campaign slice drops from 0.710 to 0.680. What should you report?",
      steps: [
        { do: "Read global metric", result: "+0.010 AUC", why: "the overall model improved on average" },
        { do: "Read slice metric", result: "-0.030 AUC for new campaigns", why: "a critical segment regressed" },
        { do: "Decide", result: "do not summarize as a clean win", why: "launch decisions need guardrails and slice ownership" }
      ],
      answer: "Report the global win and the new-campaign regression; investigate or gate launch on the slice guardrail."
    }
  ],
  applications: [
    { title: "Palette-driven pCTR ROC-AUC", background: "pCTR models rank ads by expected response. ROC-AUC is useful because ranking quality matters even before a threshold is chosen.", numbers: "If 760 out of 1,000 sampled positive-negative pairs put the clicked impression above the non-clicked impression, AUC is $760/1000=0.760$." },
    { title: "Search Ads relevance precision", background: "A query relevance filter may require high precision so irrelevant ads are blocked even if recall is not perfect.", numbers: "At one threshold, 900 ads pass and 810 are judged relevant, so precision is $810/900=0.90$. If total relevant ads are 1,200, recall is $810/1200=0.675$." },
    { title: "Creator Marketplace AI MRR", background: "For creator search, the first strong match matters because users inspect the top of the list. MRR captures how early the first relevant creator appears.", numbers: "For three searches with first relevant ranks 1, 2, and 5, MRR is $(1+1/2+1/5)/3=1.7/3\\approx0.567$." },
    { title: "Event Organic discovery NDCG", background: "Feed ranking for event posts has graded labels: skip, click, RSVP, attend. NDCG rewards putting the highest-gain events near the top.", numbers: "For gains [3,1,0] at ranks 1-3, DCG is $3+1/\\log_2 3+0=3.631$. If ideal is the same, NDCG@3 is 1.0." },
    { title: "Instream Ads PR-AUC for rare unsafe content", background: "When positives are rare, ROC-AUC can look healthy while precision at useful recall is poor. PR curves focus attention on the positive class.", numbers: "With 100 unsafe videos among 100,000, a detector returning 200 videos with 80 true unsafe has precision $80/200=0.40$ and recall $80/100=0.80$, far more informative than accuracy." },
    { title: "Creative Intelligence per-slice eval", background: "A creative ranker can improve globally while hurting small advertisers or new formats. Slice metrics expose those regressions before launch.", numbers: "If global NDCG@10 rises 0.012 but new-video creatives fall from 0.431 to 0.402, the slice delta is -0.029 and should be a launch discussion, not a footnote." },
    { title: "Event Ads cold-start guardrail", background: "Cold-start pacing models need separate evaluation because old-event history can dominate the global average.", numbers: "Suppose mature events are 90% of rows with AUC 0.780 and new events are 10% with AUC 0.680. The weighted average is $0.9\\cdot0.780+0.1\\cdot0.680=0.770$, hiding the cold-start weakness." }
  ],
  applicationsClose:
    `<p>Metrics are product questions written as math. Once you know whether the system filters, ranks, retrieves, or calibrates, the right metric and the right slices become much easier to defend.</p>`,
  takeaways: [
    "Precision, recall, and F1 require a threshold; AUC, MRR, and NDCG evaluate ranked scores.",
    "AUC is the probability that a random positive outranks a random negative.",
    "NDCG discounts lower ranks and normalizes by the best possible ordering, making it useful for graded relevance.",
    "Always evaluate important slices; a global win can hide a product-critical regression."
  ],
  resources: [
    { label: "scikit-learn — model evaluation", note: "every metric with formulas + code" },
    { label: "Google MLCC — Classification: ROC & AUC", note: "threshold-free ranking quality" },
    { label: "NDCG (Wikipedia)", note: "graded ranking gain with discount" }
  ],
  papers: [],
  notebook: [
    { t: "md", src:
      `# M5 · Offline metrics\n\n` +
      `_Curriculum · Domain 0 · ML Foundations_\n\n` +
      `**Compute classification and ranking metrics from scored examples.**\n\n` +
      `We calculate AUC and NDCG directly, then compare against scikit-learn. _Save a copy to your Drive (File -> Save a copy in Drive) to keep your edits._` },
    { t: "code", src:
      `import numpy as np\n` +
      `import pandas as pd\n` +
      `import matplotlib.pyplot as plt\n` +
      `from sklearn.metrics import roc_auc_score, precision_recall_fscore_support\n\n` +
      `rng = np.random.default_rng(5)` },
    { t: "md", src:
      `## Key formulas\n\n` +
      `Precision is $\\frac{TP}{TP+FP}$, recall is $\\frac{TP}{TP+FN}$, and\n\n` +
      `$$NDCG@k=\\frac{\\sum_{i=1}^k rel_i / \\log_2(i+1)}{IDCG@k}$$` },
    { t: "code", src:
      `scores = np.array([0.92, 0.81, 0.55, 0.44, 0.20, 0.10])\n` +
      `labels = np.array([1, 0, 1, 0, 1, 0])\n` +
      `df = pd.DataFrame({"score": scores, "label": labels})\n\n` +
      `df` },
    { t: "md", src:
      `## Step 1 - Compute AUC by pair counting\n\n` +
      `AUC counts how often a positive score beats a negative score.` },
    { t: "code", src:
      `positive_scores = scores[labels == 1]\n` +
      `negative_scores = scores[labels == 0]\n` +
      `wins = 0.0\n` +
      `pairs = 0\n\n` +
      `for ps in positive_scores:\n` +
      `    for ns in negative_scores:\n` +
      `        wins = wins + float(ps > ns)\n` +
      `        wins = wins + 0.5 * float(ps == ns)\n` +
      `        pairs = pairs + 1\n\n` +
      `auc_manual = wins / pairs\n` +
      `auc_sklearn = roc_auc_score(labels, scores)\n\n` +
      `print("manual AUC", auc_manual)\n` +
      `print("sklearn AUC", auc_sklearn)\n\n` +
      `assert abs(auc_manual - auc_sklearn) < 1e-12` },
    { t: "md", src:
      `## Step 2 - Compute threshold metrics\n\n` +
      `Precision and recall require converting scores to decisions.` },
    { t: "code", src:
      `threshold = 0.5\n` +
      `pred = (scores >= threshold).astype(int)\n` +
      `precision, recall, f1, support = precision_recall_fscore_support(labels, pred, average="binary", zero_division=0)\n\n` +
      `print("precision", round(precision, 3))\n` +
      `print("recall", round(recall, 3))\n` +
      `print("f1", round(f1, 3))\n\n` +
      `assert round(precision, 3) == 0.667` },
    { t: "md", src:
      `## Step 3 - Compute NDCG@5\n\n` +
      `Now use graded relevance in displayed rank order.` },
    { t: "code", src:
      `relevance = np.array([3.0, 0.0, 2.0, 1.0, 0.0])\n` +
      `discounts = np.log2(np.arange(2, len(relevance) + 2))\n` +
      `dcg = np.sum(relevance / discounts)\n` +
      `ideal = np.sort(relevance)[::-1]\n` +
      `idcg = np.sum(ideal / discounts)\n` +
      `ndcg = dcg / idcg\n\n` +
      `print("DCG", round(dcg, 3))\n` +
      `print("IDCG", round(idcg, 3))\n` +
      `print("NDCG", round(ndcg, 3))\n\n` +
      `assert 0.0 <= ndcg <= 1.0` },
    { t: "md", src:
      `## Visualize scores and labels\n\n` +
      `Metrics summarize this ranked list; the plot lets you inspect the ordering directly.` },
    { t: "code", src:
      `colors = np.where(labels == 1, "#54a24b", "#e45756")\n` +
      `fig, ax = plt.subplots(figsize=(5, 3))\n` +
      `ax.bar(np.arange(len(scores)), scores, color=colors)\n` +
      `ax.axhline(threshold, color="black", linestyle="--", linewidth=1)\n` +
      `ax.set_xlabel("ranked item")\n` +
      `ax.set_ylabel("score")\n` +
      `ax.set_title("scores, labels, and a threshold")\n` +
      `plt.show()` },
    { t: "md", src:
      `## Practice\n\n` +
      `1. Change the threshold to 0.8 and recompute precision and recall.\n` +
      `2. Swap the top two relevance values and recompute NDCG.\n` +
      `3. Create a slice with the first three rows and compute its AUC.` },
    { t: "code", src:
      `# Your turn:\n` }
  ]
};

module.exports = [M2, M3, M4, M5];
