/* M2.3 · Categorical features — encoding low- and high-cardinality.
   Exports ONE sub-lesson object. Validate in isolation with:
     node tools/afp-check-part.js tools/afp-authored/m2-parts/s3.js
   LaTeX: double every backslash in JS strings; balance $…$; money is \$.
   No <i>/<em>, no emoji. */
"use strict";

module.exports = {
  sub: "03",
  subtitle: "Categorical features — encoding low- and high-cardinality",
  tagline: "Categories are useful only after you encode their meaning without inventing order, exploding width, or leaking the label.",
  skipIf: "choose one-hot, ordinal, count, hash, target, or embedding encodings for categorical features, and explain why target encoding must be smoothed and out-of-fold.",
  mapsTo: ["all"],
  connections: {
    buildsOn: ["feature matrices", "train/validation/test splitting", "target leakage"],
    leadsTo: ["point-in-time feature stores", "recommender-system embeddings", "production-safe preprocessing pipelines"],
    usedWith: ["cross-validation", "regularization", "tree and linear models"]
  },
  motivation:
    "<p>You already know how to feed numbers to a model. Real product data, especially ads and recommendations data, rarely arrives that cleanly. It arrives as countries, device types, campaign IDs, member segments, creators, job titles, and product surfaces. The model cannot use the string `campaign_8172` directly, but that string may carry a lot of signal if we translate it carefully.</p>" +
    "<p>The careful part matters. A low-cardinality field like device type may be safe to one-hot encode. A high-cardinality field like campaign ID can create thousands of sparse columns, invite memorization, and tempt you into leakage-prone target statistics. The load-bearing idea is to preserve the real information in the category while refusing to add fake order, future label information, or unbounded dimensionality.</p>",
  definition:
    "<p><b>Definition.</b> A <b>categorical feature</b> takes values from a finite or countable set of labels. A <b>nominal</b> feature has no meaningful order, such as campaign ID or country. An <b>ordinal</b> feature has a real order, such as small, medium, large; order-preserving encodings are valid only when that order is part of the data-generating process.</p>" +
    "<p><b>Common encodings.</b> One-hot encoding maps each category to an indicator column. Ordinal or label encoding maps categories to integers; this is usually fine for tree splits but misleading for linear models because it invents distances. Count or frequency encoding maps a category to how often it appears. Feature hashing maps categories into a fixed number of buckets, trading memory for collisions. Embeddings learn dense vectors for high-cardinality IDs and are the recommender-system workhorse for member, creator, campaign, and item identifiers.</p>" +
    "<p><b>Smoothed target encoding.</b> For category $c$, with $n_c$ rows, category mean $\\bar{y}_c$, global mean $\\bar{y}$, and smoothing strength $m$, the smoothed target encoding is</p>" +
    "$$\\hat{y}_c=\\frac{n_c\\bar{y}_c+m\\bar{y}}{n_c+m}.$$" +
    "<p>This statistic is powerful and leakage-prone. It must be computed out-of-fold: the encoded value for a training row is computed from other folds only, never from that row's own label. Rare, missing, and previously unseen categories need explicit buckets, commonly `missing`, `unknown`, and top-$K$ plus `other`.</p>",
  symbols: [
    { sym: "$c$", desc: "one category value, such as a campaign ID, country, or creator ID." },
    { sym: "$n_c$", desc: "the number of training rows with category $c$ in the data used to fit the encoder." },
    { sym: "$\\bar{y}_c$", desc: "the mean label among rows with category $c$ in the encoder-fitting data." },
    { sym: "$\\bar{y}$", desc: "the global mean label in the encoder-fitting data." },
    { sym: "$m$", desc: "the smoothing strength, interpreted as $m$ pseudo-rows at the global mean." },
    { sym: "$K$", desc: "the number of most frequent categories kept before grouping the tail into `other`." }
  ],
  derivation: [
    { do: "Start from the category mean", result: "$\\bar{y}_c$", why: "the category's historical outcome rate is often predictive" },
    { do: "Add pseudo-counts", result: "$n_c\\bar{y}_c+m\\bar{y}$", why: "rare categories should shrink toward the global mean instead of memorizing noise" },
    { do: "Add the effective row count", result: "$n_c+m$", why: "the denominator counts real rows plus pseudo-rows" },
    { do: "Divide", result: "$\\hat{y}_c=\\frac{n_c\\bar{y}_c+m\\bar{y}}{n_c+m}$", why: "the encoding is a weighted average of local and global evidence" },
    { do: "Fit it out-of-fold", result: "each training row uses statistics from other folds", why: "otherwise the row's own label can leak into its encoded feature" }
  ],
  worked: {
    problem: "An ads model has a high-cardinality `campaign_id`. There are 12 training impressions in two folds. Fold 1: alpha has labels 1,1; beta has 0; rare_launch has 1; gamma has 0; delta has 0. Fold 2: alpha has 0; beta has 0,1; gamma has 1; delta has 1; paused has 0. Use smoothing $m=2$. Compute naive in-fold and out-of-fold target encodings for `rare_launch`, `paused`, and `alpha`.",
    skills: ["target encoding", "smoothing", "leakage prevention"],
    strategy: "First compute the global mean, then compare the leaky full-data statistic with the OOF statistic that excludes the row's fold.",
    steps: [
      { do: "Count positive labels", result: "6 positives out of 12 rows", why: "the global click rate is the fallback for rare and unseen categories" },
      { do: "Compute the global mean", result: "$\\bar{y}=6/12=0.50$", why: "this is the value used for smoothing and unseen categories" },
      { do: "Compute the naive full-data encoding for `rare_launch`", result: "$(1+2\\cdot0.50)/(1+2)=0.667$", why: "the only `rare_launch` row has label 1, so the feature contains part of its own answer" },
      { do: "Compute the OOF encoding for `rare_launch`", result: "0.50", why: "fold 2 contains no `rare_launch`, so the honest fallback is the training-fold global mean" },
      { do: "Compute the naive full-data encoding for `paused`", result: "$(0+2\\cdot0.50)/(1+2)=0.333$", why: "the only `paused` row has label 0, so the naive value again uses its own label" },
      { do: "Compute the OOF encoding for `paused`", result: "0.50", why: "fold 1 contains no `paused`, so the category is unknown from the row's training view" },
      { do: "Compute full-data `alpha`", result: "$(2+2\\cdot0.50)/(3+2)=0.600$", why: "alpha has three rows and two positives in the full data" },
      { do: "Compute OOF `alpha` for fold 1 rows", result: "$(0+2\\cdot0.50)/(1+2)=0.333$", why: "only fold 2 is allowed, and its one alpha row has label 0" },
      { do: "Compute OOF `alpha` for the fold 2 row", result: "$(2+2\\cdot0.50)/(2+2)=0.750$", why: "only fold 1 is allowed, and both alpha rows there clicked" }
    ],
    verify: "The singleton categories are the sanity check: naive encodings move toward their own labels (0.667 for a positive singleton and 0.333 for a negative singleton), while OOF falls back to 0.50 because the category is unseen outside the row's fold.",
    answer: "Naive target encoding leaks for rare singletons; OOF smoothed target encoding gives `rare_launch` 0.50, `paused` 0.50, fold-1 `alpha` rows 0.333, and the fold-2 `alpha` row 0.750.",
    connects: "target leakage — a category statistic is valid only if the row's own label was not used to compute it."
  },
  practice: [
    {
      problem: "A feature `device_type` has values desktop, mobile, and tablet. The model is logistic regression. Which encoding should you start with, and how many columns are added if all three categories are kept?",
      steps: [
        { do: "Classify the feature", result: "nominal", why: "desktop, mobile, and tablet have no natural numeric order" },
        { do: "Choose the encoding", result: "one-hot encoding", why: "a linear model should not see fake distances like desktop=1, mobile=2, tablet=3" },
        { do: "Count columns", result: "3 indicator columns", why: "one column is created per kept category when all categories are retained" }
      ],
      answer: "Use one-hot encoding; keeping all categories adds 3 columns. With an intercept, many pipelines drop one column and add 2."
    },
    {
      problem: "A `seniority_level` field has values entry, mid, senior, staff. When is ordinal encoding appropriate, and what mapping preserves order?",
      steps: [
        { do: "Check the semantics", result: "the values are truly ordered", why: "seniority has a real progression" },
        { do: "Assign increasing integers", result: "entry=0, mid=1, senior=2, staff=3", why: "the numeric order matches the domain order" },
        { do: "Name the caution", result: "linear models assume equal spacing", why: "the jump from senior to staff may not equal the jump from entry to mid" }
      ],
      answer: "Ordinal encoding is appropriate only because the order is real; entry=0, mid=1, senior=2, staff=3 preserves it, but equal spacing is still an assumption."
    },
    {
      problem: "A campaign table has 40,000 distinct `campaign_id` values. What happens with one-hot encoding, and name two alternatives for this high-cardinality field.",
      steps: [
        { do: "Count one-hot width", result: "40,000 columns", why: "one-hot creates one indicator per category" },
        { do: "Describe the matrix", result: "very sparse", why: "each row has only one active campaign column" },
        { do: "Choose alternatives", result: "feature hashing or embeddings", why: "both keep representation size bounded for many IDs" }
      ],
      answer: "One-hot adds 40,000 sparse columns. Feature hashing and learned embeddings are common bounded-width alternatives; smoothed OOF target encoding is another option for tabular models."
    },
    {
      problem: "For category `creator_7`, $n_c=8$, $\\bar{y}_c=0.25$, global mean $\\bar{y}=0.10$, and $m=12$. Compute the smoothed target encoding.",
      steps: [
        { do: "Compute category contribution", result: "$n_c\\bar{y}_c=8\\cdot0.25=2.0$", why: "this is the observed positive mass for the category" },
        { do: "Compute smoothing contribution", result: "$m\\bar{y}=12\\cdot0.10=1.2$", why: "pseudo-rows pull the estimate toward the global mean" },
        { do: "Add the numerator", result: "$2.0+1.2=3.2$", why: "combine observed and pseudo evidence" },
        { do: "Add the denominator", result: "$8+12=20$", why: "combine real and pseudo row counts" },
        { do: "Divide", result: "$3.2/20=0.16$", why: "the final value is the weighted average" }
      ],
      answer: "The smoothed target encoding is 0.16, between the category mean 0.25 and the global mean 0.10."
    },
    {
      problem: "A production encoder keeps the top 1,000 campaign IDs. A request arrives with `campaign_id=null`, and another arrives with a never-seen campaign ID. What buckets should they use?",
      steps: [
        { do: "Handle the null value", result: "send it to `missing`", why: "absence of a value can be informative and should not be confused with a real unseen ID" },
        { do: "Handle the never-seen value", result: "send it to `unknown` or `other`", why: "the encoder has no fitted statistic or column for this ID" },
        { do: "Keep cardinality bounded", result: "top-1,000 plus tail buckets", why: "new and rare IDs cannot create new production columns at serving time" }
      ],
      answer: "Use a separate `missing` bucket for nulls and an `unknown` or `other` bucket for unseen IDs; top-K plus tail buckets keeps serving stable."
    }
  ],
  applications: [
    { title: "Campaign pCTR with one-hot country and hashed campaign ID", background: "Ads click models often mix low-cardinality context with high-cardinality identifiers. Country is small enough to one-hot; campaign ID may be too wide and too sparse for direct one-hot features.", numbers: "If country has 25 kept values and campaign has 80,000 IDs, one-hot adds 80,025 columns. Hashing campaign into 4,096 buckets plus 25 country columns adds 4,121 columns, a 19.4x reduction from 80,025/4,121." },
    { title: "Creator Marketplace AI embeddings", background: "Creator-marketplace matching needs member, creator, brief, and campaign identities. Learned embeddings turn each ID into a dense vector that can share statistical strength across similar entities.", numbers: "A one-hot creator feature for 2,000,000 creators has 2,000,000 columns. A 64-dimensional creator embedding stores 2,000,000 x 64 = 128,000,000 weights; at 4 bytes each, that is about 512 MB, but each example reads only 64 numbers." },
    { title: "Sponsored Messaging frequency encoding", background: "Some categorical signals are mostly popularity signals. A sender or campaign seen often in the logs can be encoded by its count or frequency without using the label.", numbers: "If sender A appears 18,000 times in 1,200,000 impressions, its frequency encoding is 18,000/1,200,000 = 0.015. Sender B with 600 impressions receives 600/1,200,000 = 0.0005." },
    { title: "Rare-category management for ad formats", background: "Production encoders cannot grow a new column every time an experimental ad format appears. Top-K bucketing keeps common categories explicit and sends the long tail to a stable fallback.", numbers: "With 12,500 observed ad-format strings, keeping the top 200 covers 96 percent of 5,000,000 impressions. The remaining 4 percent is 200,000 impressions routed to `other`, and the feature width is 201 rather than 12,500." },
    { title: "OOF target encoding for campaign_id", background: "Campaign IDs can be predictive because some campaigns have unusually high or low click rates. The statistic is useful only if the training row's own click label is excluded from its encoded value.", numbers: "For a campaign with 3 clicks in 20 impressions, global CTR 0.04, and m=50, the smoothed value is (3 + 50 x 0.04)/(20 + 50) = 5/70 = 0.0714. OOF recomputes that value from other folds before the model sees the row." },
    { title: "Feature hashing for member-title text categories", background: "Job titles, skills, and interests create large categorical vocabularies. Hashing gives a fixed-width representation that works even for previously unseen strings.", numbers: "Hashing 300,000 title strings into 16,384 buckets gives an average load of 300,000/16,384 = 18.3 strings per bucket. Increasing to 65,536 buckets lowers the average load to 4.6, reducing collisions at 4x the width." },
    { title: "Ordinal encoding for campaign lifecycle stage", background: "Some ads fields really are ordered. Lifecycle stages such as draft, active, paused, ended encode progress through a process, so preserving order can be meaningful when the model can use it safely.", numbers: "Mapping draft=0, active=1, paused=2, ended=3 gives a tree model thresholds like stage <= 1.5, splitting draft/active from paused/ended. A linear model would impose a single per-step slope across all transitions, which may be too rigid." }
  ],
  applicationsClose:
    "<p>Across pCTR, Creator Marketplace matching, sponsored messaging, ad-format launches, and member-title features, the same judgment call repeats: what information does the category truly contain, and what representation lets the model use it honestly? Low-cardinality categories often want indicators; very high-cardinality IDs often want hashing, smoothing, or embeddings; target statistics always want out-of-fold discipline.</p>",
  takeaways: [
    "Nominal categories have no order; ordinal encodings are valid only when the order is real and useful to the model.",
    "One-hot encoding is simple and strong for low cardinality, but high-cardinality IDs can create huge sparse matrices.",
    "Target encoding must be smoothed and out-of-fold, or rare categories can leak their own labels into the training feature.",
    "Count, frequency, hashing, embeddings, and top-K plus `other` buckets are cardinality-management tools for production systems."
  ],
  resources: [
    { label: "scikit-learn — Encoding categorical features", note: "practical reference for one-hot, ordinal, and hashing-style preprocessing choices" },
    { label: "category_encoders documentation", note: "implementations of target, leave-one-out, count, hashing, and other categorical encoders" },
    { label: "Google — Rules of Machine Learning", note: "production guidance on feature pipelines, training-serving consistency, and leakage-aware transforms" }
  ],
  papers: [
    "Feature Hashing for Large Scale Multitask Learning (Weinberger et al., 2009)",
    "Entity Embeddings of Categorical Variables (Guo and Berkhahn, 2016)",
    "A Preprocessing Scheme for High-Cardinality Categorical Attributes in Classification and Prediction Problems (Micci-Barreca, 2001)"
  ],
  notebook: [
    { t: "md", src:
      "# M2.3 · Categorical features\n\n" +
      "_Curriculum · Domain 0 · ML Foundations · Feature engineering & leakage_\n\n" +
      "**Categories are useful only after you encode their meaning without inventing order, exploding width, or leaking the label.**\n\n" +
      "We compare one-hot encoding, naive target encoding, and out-of-fold smoothed target encoding on campaign IDs. _Save a copy to your Drive (File -> Save a copy in Drive) to keep your edits._" },
    { t: "code", src:
      "import numpy as np\n" +
      "import pandas as pd\n" +
      "import matplotlib.pyplot as plt\n" +
      "from sklearn.compose import ColumnTransformer\n" +
      "from sklearn.linear_model import LogisticRegression\n" +
      "from sklearn.metrics import roc_auc_score\n" +
      "from sklearn.model_selection import StratifiedKFold, train_test_split\n" +
      "from sklearn.preprocessing import OneHotEncoder\n\n" +
      "rng = np.random.default_rng(7)" },
    { t: "md", src:
      "## Build an ads-like categorical dataset\n\n" +
      "Each row is one impression. The label is a click, and `campaign_id` is deliberately high-cardinality: many campaigns appear only a few times." },
    { t: "code", src:
      "n = 5000\n" +
      "n_campaigns = 1200\n" +
      "campaign_id = rng.integers(0, n_campaigns, size=n)\n" +
      "device = rng.choice([\"desktop\", \"mobile\", \"tablet\"], size=n, p=[0.35, 0.55, 0.10])\n\n" +
      "campaign_effect = rng.normal(0.0, 0.9, size=n_campaigns)\n" +
      "device_effect = np.where(device == \"mobile\", 0.25, 0.0)\n" +
      "device_effect = np.where(device == \"tablet\", -0.20, device_effect)\n" +
      "logit = -2.7 + campaign_effect[campaign_id] + device_effect\n" +
      "prob = 1.0 / (1.0 + np.exp(-logit))\n" +
      "clicked = (rng.random(n) < prob).astype(int)\n\n" +
      "df = pd.DataFrame({\"campaign_id\": campaign_id.astype(str), \"device\": device, \"clicked\": clicked})\n" +
      "print(df.head())\n" +
      "print(\"click rate\", round(float(df.clicked.mean()), 4))\n" +
      "print(\"distinct campaigns\", df.campaign_id.nunique())" },
    { t: "md", src:
      "## Smoothing formula\n\n" +
      "For a category $c$, use\n\n" +
      "$$\\hat{y}_c = \\frac{n_c \\bar{y}_c + m \\bar{y}}{n_c + m}.$$\n\n" +
      "The formula is not enough by itself. For training rows, the statistic must be computed out-of-fold so a row's own label cannot enter its feature." },
    { t: "code", src:
      "def smoothed_map(frame, key, target, m):\n" +
      "    global_mean = frame[target].mean()\n" +
      "    stats = frame.groupby(key)[target].agg([\"count\", \"mean\"])\n" +
      "    values = (stats[\"count\"] * stats[\"mean\"] + m * global_mean) / (stats[\"count\"] + m)\n" +
      "    return values, global_mean\n\n" +
      "def apply_map(series, mapping, fallback):\n" +
      "    return series.map(mapping).fillna(fallback).to_numpy()" },
    { t: "md", src:
      "## Naive in-fold target encoding leaks\n\n" +
      "This version fits the category statistic on the same rows it transforms. Rare categories can therefore receive a feature value partly built from their own label." },
    { t: "code", src:
      "m = 20\n" +
      "mapping, fallback = smoothed_map(df, \"campaign_id\", \"clicked\", m)\n" +
      "in_fold_te = apply_map(df[\"campaign_id\"], mapping, fallback)\n\n" +
      "corr_in_fold = np.corrcoef(in_fold_te, df[\"clicked\"].to_numpy())[0, 1]\n" +
      "print(\"in-fold target encoding correlation with label\", round(float(corr_in_fold), 3))" },
    { t: "md", src:
      "## Out-of-fold target encoding removes the self-label path\n\n" +
      "For each fold, fit the encoder on the other folds and transform only the held-out fold. This keeps the training feature honest." },
    { t: "code", src:
      "oof_te = np.zeros(n)\n" +
      "skf = StratifiedKFold(n_splits=5, shuffle=True, random_state=7)\n\n" +
      "for train_idx, hold_idx in skf.split(df, df[\"clicked\"]):\n" +
      "    train_frame = df.iloc[train_idx]\n" +
      "    hold_frame = df.iloc[hold_idx]\n" +
      "    fold_map, fold_fallback = smoothed_map(train_frame, \"campaign_id\", \"clicked\", m)\n" +
      "    oof_te[hold_idx] = apply_map(hold_frame[\"campaign_id\"], fold_map, fold_fallback)\n\n" +
      "corr_oof = np.corrcoef(oof_te, df[\"clicked\"].to_numpy())[0, 1]\n" +
      "print(\"OOF target encoding correlation with label\", round(float(corr_oof), 3))" },
    { t: "md", src:
      "## The suspicious gap is the leakage signal\n\n" +
      "In-fold target encoding is allowed to peek at each row's label through its category mean. OOF encoding should remain predictive, but less suspiciously attached to the label." },
    { t: "code", src:
      "assert corr_in_fold > corr_oof + 0.05\n" +
      "assert corr_in_fold > 0.20\n\n" +
      "print(\"correlation gap\", round(float(corr_in_fold - corr_oof), 3))" },
    { t: "md", src:
      "## Compare one-hot and OOF target encoding in a small model\n\n" +
      "One-hot keeps categories separate and can work well, but high cardinality creates many sparse columns. OOF target encoding uses one numeric column for `campaign_id`." },
    { t: "code", src:
      "train_idx, test_idx = train_test_split(np.arange(n), test_size=0.3, random_state=7, stratify=df[\"clicked\"])\n\n" +
      "pre = ColumnTransformer([(\"cat\", OneHotEncoder(handle_unknown=\"ignore\"), [\"campaign_id\", \"device\"])])\n" +
      "X_train_oh = pre.fit_transform(df.iloc[train_idx][[\"campaign_id\", \"device\"]])\n" +
      "X_test_oh = pre.transform(df.iloc[test_idx][[\"campaign_id\", \"device\"]])\n\n" +
      "one_hot_model = LogisticRegression(max_iter=500, solver=\"liblinear\")\n" +
      "one_hot_model.fit(X_train_oh, df.iloc[train_idx][\"clicked\"])\n" +
      "auc_one_hot = roc_auc_score(df.iloc[test_idx][\"clicked\"], one_hot_model.predict_proba(X_test_oh)[:, 1])\n\n" +
      "train_map, train_fallback = smoothed_map(df.iloc[train_idx], \"campaign_id\", \"clicked\", m)\n" +
      "test_te = apply_map(df.iloc[test_idx][\"campaign_id\"], train_map, train_fallback)\n" +
      "X_train_te = pd.get_dummies(df.iloc[train_idx][\"device\"]).to_numpy()\n" +
      "X_test_te = pd.get_dummies(df.iloc[test_idx][\"device\"]).reindex(columns=pd.get_dummies(df.iloc[train_idx][\"device\"]).columns, fill_value=0).to_numpy()\n" +
      "X_train_te = np.column_stack([oof_te[train_idx], X_train_te])\n" +
      "X_test_te = np.column_stack([test_te, X_test_te])\n\n" +
      "te_model = LogisticRegression(max_iter=500, solver=\"liblinear\")\n" +
      "te_model.fit(X_train_te, df.iloc[train_idx][\"clicked\"])\n" +
      "auc_te = roc_auc_score(df.iloc[test_idx][\"clicked\"], te_model.predict_proba(X_test_te)[:, 1])\n\n" +
      "print(\"one-hot width\", X_train_oh.shape[1])\n" +
      "print(\"target-encoded width\", X_train_te.shape[1])\n" +
      "print(\"one-hot AUC\", round(float(auc_one_hot), 3))\n" +
      "print(\"OOF target-encoded AUC\", round(float(auc_te), 3))" },
    { t: "md", src:
      "## Practice\n\n" +
      "Try each in the empty cell below.\n\n" +
      "1. Change `m` from 20 to 100 and watch rare campaign encodings move toward the global mean.\n" +
      "2. Increase `n_campaigns` and compare one-hot width with the single OOF target-encoded column.\n" +
      "3. Replace `campaign_id` with a top-K plus `other` bucket before one-hot encoding." },
    { t: "code", src:
      "# Your turn:\n" }
  ]
};
