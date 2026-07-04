/* M2.4 · Numeric & float features — scaling, transforms, missing values.
   Exports ONE sub-lesson object. Validate with:
     node tools/afp-check-part.js tools/afp-authored/m2-parts/s4.js
   LaTeX: double every backslash in JS strings; balance $...$; money is \\$.
   No <i>/<em>, no emoji. */
"use strict";

module.exports = {
  sub: "04",
  subtitle: "Numeric & float features — scaling, transforms, missing values",
  tagline: "Make continuous signals numerically well-behaved without letting validation or future rows set the ruler.",
  skipIf: "standardize, min-max scale, robust-scale, transform skewed values, impute missing values with indicators, and explain why every fitted statistic must come from train only.",
  mapsTo: ["all"],
  connections: {
    buildsOn: ["target leakage", "train/validation/test splitting", "the serving-time contract", "basic summary statistics"],
    leadsTo: ["stable linear and neural-network training", "honest preprocessing pipelines", "feature crosses and calibrated numeric inputs"],
    usedWith: ["imputation", "regularization", "quantile binning", "cross-validation"]
  },
  motivation:
    "<p>You can already look at a numeric column and compute a mean, a median, or a maximum. The production difficulty is that raw business signals rarely arrive in the tidy scale a model wants. Ad spend, impressions, clicks, dwell time, and bid values are often heavy-tailed; one campaign may spend \\$5 while another spends \\$50,000. Missing values and outliers are not side cases — they are part of the data-generating process.</p>" +
    "<p>The load-bearing idea is to separate two acts: <b>fit the ruler</b> on the training fold only, then <b>use that frozen ruler</b> everywhere else. Scaling, log transforms, clipping thresholds, quantile bins, and imputation values can make numeric features much easier to learn from, but the fitted statistics are themselves learned from data. If validation rows help choose those statistics, the pipeline has quietly leaked.</p>",
  definition:
    "<p><b>Definition.</b> A numeric preprocessing transform takes a raw scalar feature $x$ and maps it to a model input $g(x)$ using parameters fitted on the training fold. The standard z-score uses the training mean $\\mu_{\\text{train}}$ and training standard deviation $\\sigma_{\\text{train}}$:</p>" +
    "$$z=\\frac{x-\\mu_{\\text{train}}}{\\sigma_{\\text{train}}}.$$" +
    "<p>Min-max scaling uses $m_{\\text{train}}$ and $M_{\\text{train}}$ to compute $(x-m_{\\text{train}})/(M_{\\text{train}}-m_{\\text{train}})$. Robust scaling uses the training median and interquartile range, $(x-\\text{median}_{\\text{train}})/\\text{IQR}_{\\text{train}}$, so one giant outlier moves the ruler less. These scalers matter for distance-based models, linear models with regularization, gradient methods, and neural networks because coefficient sizes and gradient steps depend on feature scale. Trees split by ordering thresholds, so monotone rescaling usually changes little, though missing-value handling and binning choices still matter.</p>" +
    "<p>Skew transforms reshape heavy-tailed positive signals with $\\log(x)$ or $\\log(1+x)$; Box-Cox learns a power transform for positive values; Yeo-Johnson is the safer cousin when zeros or negatives can appear. Binning turns a float into interval or quantile buckets. Clipping or winsorizing caps extreme values. Missing values are usually imputed with a train-fitted mean, median, or model, and paired with an indicator column so the model can learn that missingness itself may carry signal.</p>",
  symbols: [
    { sym: "$x$", desc: "a raw numeric feature value for one row." },
    { sym: "$g(x)$", desc: "the transformed numeric feature passed to the model." },
    { sym: "$\\mu_{\\text{train}}$", desc: "the mean of the feature computed on the training fold only." },
    { sym: "$\\sigma_{\\text{train}}$", desc: "the standard deviation of the feature computed on the training fold only." },
    { sym: "$m_{\\text{train}}, M_{\\text{train}}$", desc: "the training minimum and maximum used by min-max scaling." },
    { sym: "$\\text{IQR}_{\\text{train}}$", desc: "the training 75th percentile minus the training 25th percentile, used in robust scaling." },
    { sym: "$r$", desc: "a missingness indicator: $r=1$ when the original value was missing and $r=0$ otherwise." }
  ],
  derivation: [
    { do: "Fit the mean on train", result: "$\\mu_{\\text{train}}=\\frac{1}{n}\\sum_{i\\in\\text{train}} x_i$", why: "the ruler must be learned only from rows allowed to influence training" },
    { do: "Fit the spread on train", result: "$\\sigma_{\\text{train}}=\\sqrt{\\frac{1}{n}\\sum_{i\\in\\text{train}}(x_i-\\mu_{\\text{train}})^2}$", why: "standardization needs a scale as well as a center" },
    { do: "Transform any row", result: "$z=(x-\\mu_{\\text{train}})/\\sigma_{\\text{train}}$", why: "validation, test, and serving rows use the same frozen training statistics" },
    { do: "Transform a skewed count", result: "$u=\\log(1+x)$", why: "a multiplicative jump becomes an additive difference, and zero remains defined" },
    { do: "Impute a missing value", result: "$x^{*}=\\text{median}_{\\text{train}}$ and $r=1$", why: "the filled value keeps the matrix numeric while the indicator preserves the fact that it was missing" }
  ],
  worked: {
    problem: "A pCTR model uses `campaign_spend_7d` for four training campaigns: 0, 9, 99, and 999 dollars. One validation campaign has 9999 dollars. Compute a log1p transform, fit a standard scaler on train only, apply it to the validation row, then show how fitting on all rows leaks validation information.",
    skills: ["log transform", "standardization", "leakage detection", "serving-time preprocessing"],
    strategy: "First reduce skew with $\\log(1+x)$, then compute $\\mu$ and $\\sigma$ from train only before touching validation.",
    steps: [
      { do: "Apply $\\log(1+x)$ to train", result: "$[0,\\;\\log(10),\\;\\log(100),\\;\\log(1000)]\\approx[0,2.303,4.605,6.908]$", why: "log1p is defined at zero and compresses the 0-to-999 range" },
      { do: "Compute the train mean", result: "$\\mu_{\\text{train}}=(0+2.303+4.605+6.908)/4=3.454$", why: "only the four training rows are allowed to set the center" },
      { do: "Compute the train standard deviation", result: "$\\sigma_{\\text{train}}=\\sqrt{7.952}=2.820$", why: "the average squared distance from the train mean sets the training ruler" },
      { do: "Transform the validation row", result: "$z_{\\text{val}}=(\\log(10000)-3.454)/2.820=(9.210-3.454)/2.820=2.041$", why: "validation is measured by the frozen train ruler" },
      { do: "Fit the scaler on all five rows", result: "$\\mu_{\\text{all}}=4.605$ and $\\sigma_{\\text{all}}=3.257$", why: "the validation value has now changed the center and spread" },
      { do: "Transform validation with the leaked ruler", result: "$z_{\\text{leaked}}=(9.210-4.605)/3.257=1.414$", why: "the held-out row made itself look less extreme" }
    ],
    verify: "The train-only z-score is 2.041, while the leaked z-score is 1.414. The raw validation value did not change; only the forbidden use of validation statistics changed the feature.",
    answer: "Use $\\log(1+x)$, fit $\\mu=3.454$ and $\\sigma=2.820$ on train only, and serve the validation row as $z=2.041$. Fitting on all rows leaks and incorrectly gives $z=1.414$.",
    connects: "the serving-time contract — preprocessing statistics are learned from training history, then frozen for validation, test, and serving."
  },
  practice: [
    {
      problem: "Train click counts are 2, 4, and 8. A validation count is 16. Compute the train-only z-score using the population standard deviation.",
      steps: [
        { do: "Compute the train mean", result: "$\\mu=(2+4+8)/3=14/3=4.667$", why: "the center is fitted on train only" },
        { do: "Compute the train variance", result: "$[(2-4.667)^2+(4-4.667)^2+(8-4.667)^2]/3=6.222$", why: "one spread value must summarize the training column" },
        { do: "Take the square root", result: "$\\sigma=\\sqrt{6.222}=2.494$", why: "standard deviation is in click-count units" },
        { do: "Transform validation", result: "$z=(16-4.667)/2.494=4.545$", why: "the validation row is measured against the train ruler" }
      ],
      answer: "The validation z-score is about $4.545$ using train-only statistics."
    },
    {
      problem: "Train bids are 1, 2, 3, and 100. Compute a robust-scaled value for a validation bid of 10 using median 2.5 and IQR 50.5.",
      steps: [
        { do: "Subtract the train median", result: "$10-2.5=7.5$", why: "robust scaling centers by a statistic less sensitive to the 100 outlier" },
        { do: "Divide by the train IQR", result: "$7.5/50.5=0.149$", why: "the interquartile range sets a robust scale" }
      ],
      answer: "The robust-scaled validation bid is about $0.149$."
    },
    {
      problem: "A spend feature has values 0, 9, and 99. Compute $\\log(1+x)$ for each value and explain why it is safer than $\\log(x)$ here.",
      steps: [
        { do: "Transform 0", result: "$\\log(1+0)=\\log(1)=0$", why: "log1p remains defined at zero" },
        { do: "Transform 9", result: "$\\log(1+9)=\\log(10)=2.303$", why: "a ten-dollar scale becomes a small additive value" },
        { do: "Transform 99", result: "$\\log(1+99)=\\log(100)=4.605$", why: "the 11x raw jump from 9 to 99 becomes a 2.302 increase" }
      ],
      answer: "$[0,9,99]$ becomes approximately $[0,2.303,4.605]$; $\\log(x)$ would be undefined at 0."
    },
    {
      problem: "A feature `member_age_days` is missing for one row. The train median is 1200. Build the imputed value and missingness indicator for a missing row and for an observed row with value 300.",
      steps: [
        { do: "Impute the missing row", result: "$x^{*}=1200$", why: "the median came from the training fold" },
        { do: "Mark the missing row", result: "$r=1$", why: "the model should know this value was filled" },
        { do: "Keep the observed row", result: "$x^{*}=300$", why: "observed values do not need replacement" },
        { do: "Mark the observed row", result: "$r=0$", why: "the indicator separates real values from imputed ones" }
      ],
      answer: "The missing row becomes $(1200,1)$ and the observed row becomes $(300,0)$."
    },
    {
      problem: "A train fold has scores 1, 2, 3, 4, and 100. Clip at the train 80th percentile, which is 23.2 under linear interpolation. What values are produced for validation scores 10 and 200?",
      steps: [
        { do: "Freeze the clipping cap", result: "$c=23.2$", why: "the cap is a train-fitted statistic" },
        { do: "Clip 10", result: "$\\min(10,23.2)=10$", why: "values below the cap pass through" },
        { do: "Clip 200", result: "$\\min(200,23.2)=23.2$", why: "a serving outlier cannot dominate the feature scale" }
      ],
      answer: "The validation scores become 10 and 23.2."
    }
  ],
  applications: [
    { title: "Ads spend normalization for pCTR", background: "Campaign spend is a classic heavy-tailed signal: most campaigns are small, while a few enterprise campaigns are enormous. A linear pCTR model benefits when spend is log-transformed and standardized before regularization compares it to other features.", numbers: "Raw train spend values of \\$0, \\$9, \\$99, and \\$999 become log1p values 0, 2.303, 4.605, and 6.908; their train mean is 3.454 and standard deviation is 2.820, so a \\$99 campaign maps to $(4.605-3.454)/2.820=0.408$." },
    { title: "Bids in an auction ranker", background: "Bid values can vary by advertiser and objective. Min-max scaling is easy to inspect when a downstream linear component expects inputs in a bounded range, though the min and max must come from train only.", numbers: "If train bids are \\$2, \\$5, \\$8, and \\$12, then $m=2$ and $M=12$; a \\$7 validation bid becomes $(7-2)/(12-2)=0.5$, while a \\$15 serving bid becomes 1.3 before optional clipping." },
    { title: "Robust scaling for noisy engagement counts", background: "A creator or campaign can have one viral spike that makes the ordinary standard deviation a poor ruler. Robust scaling lets the middle of the distribution keep useful resolution.", numbers: "For train reactions 1, 2, 3, 4, and 100, the median is 3 and the IQR is $4-2=2$; a validation value of 5 maps to $(5-3)/2=1$, while the outlier 100 maps to 48.5 instead of dragging every ordinary row near zero." },
    { title: "Quantile buckets for frequency features", background: "Some ad systems prefer a small set of stable buckets for serving speed, monitoring, or compatibility with sparse crosses. Quantile bucketing gives each training bucket similar mass.", numbers: "With 1,000 training rows and decile buckets, each bucket holds about 100 rows. If the train 80th percentile of impressions is 42, then any validation row above 42 lands in the top 20 percent bucket without recomputing the percentile." },
    { title: "Missing value indicators in conversion models", background: "Missingness can be informative: a new member may lack a historical dwell-time feature because the member is genuinely new, not because the data pipeline failed. Imputation plus an indicator preserves both stories.", numbers: "If 8 percent of 50,000 training rows are missing, 4,000 indicator values are 1. With train median dwell time 6.5 seconds, a missing validation row becomes dwell=6.5 and missing=1; an observed 4.0-second row becomes dwell=4.0 and missing=0." },
    { title: "Winsorizing extreme cost signals", background: "Cost and revenue features can have rare extreme values that dominate gradients in linear or neural models. Winsorizing caps the numeric damage while keeping row count unchanged.", numbers: "If the train 99th percentile cost is \\$80, then validation costs \\$12, \\$80, and \\$500 become \\$12, \\$80, and \\$80. The largest gradient contribution from this feature is capped at 80 instead of 500, a 6.25x reduction." },
    { title: "Interactions and polynomial numeric features", background: "A single numeric feature may not express the real mechanism. Crosses such as bid times predicted CTR or polynomial terms such as age squared let simple models represent curvature and multiplicative effects.", numbers: "If bid=\\$4 and predicted CTR=0.03, the value proxy is $4\\times0.03=0.12$. Adding a squared standardized frequency term with $z=1.5$ gives $z^2=2.25$, so the model can learn that very high frequency behaves differently from moderate frequency." },
    { title: "Float precision in serving pipelines", background: "Feature stores and online services often move values between decimal strings, 32-bit floats, and model tensors. Stable preprocessing avoids needless overflow, underflow, and tiny train-serving mismatches.", numbers: "A raw count of 10,000,000 and a count of 10,000,001 differ by 1, but after log1p they differ by about $\\log(10000002)-\\log(10000001)=0.0000001$; the compressed feature is easier to store and less likely to dominate a dot product." }
  ],
  applicationsClose:
    "<p>Numeric feature work looks like housekeeping, but it is part of the model. The same frozen-ruler rule governs spend transforms, bid scaling, engagement buckets, missingness indicators, outlier caps, and feature crosses: learn every statistic from train, record it in the pipeline, and reuse it unchanged at validation, test, and serving time.</p>",
  takeaways: [
    "Standardization, min-max scaling, and robust scaling change the ruler; fit that ruler on train only and reuse it everywhere else.",
    "Log1p, Box-Cox, and Yeo-Johnson transforms tame skewed ad and engagement signals; Yeo-Johnson is the option that can handle zeros and negatives.",
    "Missing values need both an imputed numeric value and, often, a missingness indicator so the model can learn the difference between filled and observed values.",
    "Trees usually care less about monotone scaling than linear models and neural networks, but clipping, missingness policy, and leakage-free fitted statistics still matter."
  ],
  resources: [
    { label: "scikit-learn — Preprocessing data", note: "reference implementations for StandardScaler, MinMaxScaler, RobustScaler, PowerTransformer, discretizers, imputers, and pipelines" },
    { label: "Google — Rules of Machine Learning", note: "production-focused guidance on keeping training and serving transformations consistent" },
    { label: "scikit-learn — Common pitfalls", note: "examples of inconsistent preprocessing and data leakage from fitting transforms before splitting" }
  ],
  papers: [
    "The Elements of Statistical Learning (Hastie, Tibshirani, and Friedman, 2009), preprocessing and basis expansion chapters",
    "Box and Cox, An Analysis of Transformations (1964)",
    "Yeo and Johnson, A New Family of Power Transformations to Improve Normality or Symmetry (2000)"
  ],
  notebook: [
    { t: "md", src:
      "# M2.4 · Numeric & float features\n\n" +
      "_Curriculum · Domain 0 · ML Foundations · Feature engineering & leakage_\n\n" +
      "_Save a copy to your Drive_\n\n" +
      "**Make continuous signals numerically well-behaved without letting validation rows set the ruler.**\n\n" +
      "We will build a tiny ads-style dataset, apply $\\log(1+x)$ to a skewed spend column, and compare a correct train-only scaler with a leaked scaler fitted on all rows." },
    { t: "code", src:
      "import numpy as np\n" +
      "import pandas as pd\n" +
      "import matplotlib.pyplot as plt\n" +
      "from sklearn.preprocessing import StandardScaler\n\n" +
      "rng = np.random.default_rng(7)" },
    { t: "md", src:
      "## Build a skewed numeric feature\n\n" +
      "Ad spend is nonnegative and heavy-tailed, so a few campaigns can be much larger than the rest. We create train rows first, then validation rows from a shifted distribution to make leakage visible." },
    { t: "code", src:
      "n_train = 120\n" +
      "n_val = 40\n\n" +
      "train_spend = rng.lognormal(mean=3.0, sigma=1.0, size=n_train)\n" +
      "val_spend = rng.lognormal(mean=4.0, sigma=1.0, size=n_val)\n\n" +
      "train_clicks = rng.poisson(lam=4.0, size=n_train)\n" +
      "val_clicks = rng.poisson(lam=6.0, size=n_val)\n\n" +
      "train = pd.DataFrame({\"split\": \"train\", \"spend\": train_spend, \"clicks\": train_clicks})\n" +
      "val = pd.DataFrame({\"split\": \"val\", \"spend\": val_spend, \"clicks\": val_clicks})\n" +
      "df = pd.concat([train, val], ignore_index=True)\n\n" +
      "print(df.groupby(\"split\")[\"spend\"].mean().round(2))" },
    { t: "md", src:
      "## Compress the heavy tail with log1p\n\n" +
      "The transform $u=\\log(1+x)$ keeps zero valid and turns multiplicative gaps into additive gaps." },
    { t: "code", src:
      "df[\"log_spend\"] = np.log1p(df[\"spend\"])\n\n" +
      "raw_ratio = df[\"spend\"].quantile(0.95) / df[\"spend\"].quantile(0.50)\n" +
      "log_ratio = df[\"log_spend\"].quantile(0.95) / df[\"log_spend\"].quantile(0.50)\n\n" +
      "print(\"raw 95/50 ratio:\", round(float(raw_ratio), 2))\n" +
      "print(\"log 95/50 ratio:\", round(float(log_ratio), 2))" },
    { t: "md", src:
      "## Fit the scaler on train only\n\n" +
      "The correct standardization is $z=(x-\\mu_{\\text{train}})/\\sigma_{\\text{train}}$. Validation rows may be transformed, but they may not help estimate $\\mu$ or $\\sigma$." },
    { t: "code", src:
      "train_mask = df[\"split\"] == \"train\"\n" +
      "val_mask = df[\"split\"] == \"val\"\n\n" +
      "train_only_scaler = StandardScaler()\n" +
      "train_values = df.loc[train_mask, [\"log_spend\"]]\n" +
      "train_only_scaler.fit(train_values)\n\n" +
      "df[\"z_train_only\"] = train_only_scaler.transform(df[[\"log_spend\"]])\n\n" +
      "print(\"train mean used:\", round(float(train_only_scaler.mean_[0]), 4))\n" +
      "print(\"train scale used:\", round(float(train_only_scaler.scale_[0]), 4))" },
    { t: "md", src:
      "## Now fit the leaked scaler\n\n" +
      "This is the subtle bug: fitting on all rows lets validation distribution information move the center and spread." },
    { t: "code", src:
      "leaked_scaler = StandardScaler()\n" +
      "leaked_scaler.fit(df[[\"log_spend\"]])\n\n" +
      "df[\"z_leaked\"] = leaked_scaler.transform(df[[\"log_spend\"]])\n\n" +
      "val_mean_train_only = df.loc[val_mask, \"z_train_only\"].mean()\n" +
      "val_mean_leaked = df.loc[val_mask, \"z_leaked\"].mean()\n\n" +
      "print(\"val mean with train-only scaler:\", round(float(val_mean_train_only), 4))\n" +
      "print(\"val mean with leaked scaler:\", round(float(val_mean_leaked), 4))" },
    { t: "md", src:
      "## Assert the contract\n\n" +
      "The train-only scaler's mean must equal the training mean, not the all-row mean. The leaked scaler shifts validation values because it uses validation statistics." },
    { t: "code", src:
      "train_log_mean = df.loc[train_mask, \"log_spend\"].mean()\n" +
      "all_log_mean = df[\"log_spend\"].mean()\n" +
      "mean_shift = abs(train_log_mean - all_log_mean)\n" +
      "val_shift = abs(val_mean_train_only - val_mean_leaked)\n\n" +
      "assert np.isclose(train_only_scaler.mean_[0], train_log_mean)\n" +
      "assert not np.isclose(train_only_scaler.mean_[0], all_log_mean)\n" +
      "assert val_shift > 0.05\n" +
      "assert mean_shift > 0.05\n\n" +
      "print(\"mean shift from using validation rows:\", round(float(mean_shift), 4))\n" +
      "print(\"validation z-mean shift:\", round(float(val_shift), 4))" },
    { t: "md", src:
      "## Visualize the difference\n\n" +
      "Both curves come from the same validation rows. The only difference is whether validation was allowed to help fit the preprocessing ruler." },
    { t: "code", src:
      "fig, ax = plt.subplots(figsize=(6, 3))\n\n" +
      "ax.hist(df.loc[val_mask, \"z_train_only\"], bins=12, alpha=0.65, label=\"train-only scaler\")\n" +
      "ax.hist(df.loc[val_mask, \"z_leaked\"], bins=12, alpha=0.65, label=\"leaked scaler\")\n" +
      "ax.axvline(0, color=\"black\", linewidth=1)\n" +
      "ax.set_title(\"validation distribution shifts when the scaler leaks\")\n" +
      "ax.set_xlabel(\"standardized log spend\")\n" +
      "ax.set_ylabel(\"campaigns\")\n" +
      "ax.legend()\n" +
      "plt.show()" },
    { t: "md", src:
      "## Practice\n\n" +
      "Try each change in the empty cell below.\n\n" +
      "1. Replace `StandardScaler` with `RobustScaler` and compare validation shifts.\n" +
      "2. Add a missing `spend` value, impute the train median, and create a missingness indicator.\n" +
      "3. Clip `log_spend` at the train 99th percentile before scaling and re-run the assertions." },
    { t: "code", src:
      "# Your turn:\n" }
  ]
};
