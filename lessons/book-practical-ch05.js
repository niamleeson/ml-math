/* Practical Statistics for Data Scientists — Chapter 5 (Classification).
   Self-registering book lessons. One lesson per named concept. */
(function () {
  window.LESSONS = window.LESSONS || [];
  window.CODEVIZ = window.CODEVIZ || {};
  var M = "Practical Statistics";
  var BOOK = "Practical Statistics for Data Scientists";
  var CH = "Chapter 5";
  var B = function (o) {
    window.LESSONS.push(Object.assign({ module: M, template: "book", book: BOOK }, o));
  };

  /* ---------------------------------------------------------------- Naive Bayes */
  B({
    id: "ps-ch5-naive-bayes",
    chapter: CH,
    title: "Naive Bayes",
    tagline: "Flip the question: ask which predictor values are likely within each outcome class, then invert.",
    sections: [
      {
        h: "What naive Bayes does",
        body: "Naive Bayes uses the probability of seeing predictor values, given an outcome, to estimate the probability of an outcome $Y = i$ given a set of predictor values. The standard algorithm needs categorical (factor) predictors and a categorical outcome. The key building block is the <em>conditional probability</em> $P(X_i \\mid Y_i)$ — the chance of observing one event given another — and the goal is the <em>posterior probability</em>: the probability of an outcome after the predictor information has been folded in, as opposed to the <em>prior probability</em> that ignores the predictors."
      },
      {
        h: "Why exact Bayesian classification is impractical",
        body: "<p>The exact (\"non-naive\") version would, for each record to classify, (1) find all other records with the identical predictor profile, (2) see which class is most common among them, and (3) assign that class. That means finding records that match the new one on <em>every</em> predictor value.</p>" +
          "<p>This breaks down fast. Imagine predicting a vote from demographics: even a large sample may hold no exact match for, say, a male Hispanic with high income from the US Midwest who voted last time but not before, has three daughters and one son, and is divorced. That is only eight variables — small for most problems. The book's rule of thumb: adding one more predictor with five equally frequent categories cuts the chance of a match by a factor of about 5.</p>"
      },
      {
        h: "The naive solution",
        body: "<p>The naive fix stops restricting the calculation to matching records and uses the whole data set instead:</p>" +
          "<ul class=\"steps\">" +
          "<li>For a binary response $Y = i$, estimate each individual conditional probability $P(X_j \\mid Y = i)$ — the proportion of records with that predictor value among the $Y = i$ records in training.</li>" +
          "<li>Multiply those probabilities together, then multiply by the proportion of records in class $Y = i$.</li>" +
          "<li>Repeat for every class.</li>" +
          "<li>The probability for outcome $i$ is its step-2 value divided by the sum of those values across all classes.</li>" +
          "<li>Assign the record to the class with the highest probability.</li>" +
          "</ul>" +
          "<p>The word \"naive\" comes from the simplifying assumption that the joint conditional probability $P(X_1, X_2, ..., X_p \\mid Y = i)$ is well approximated by the product of the single-predictor probabilities $P(X_j \\mid Y = i)$ — i.e., each predictor $X_j$ is treated as independent of the others. Despite the name, the book stresses naive Bayes is <em>not</em> a method of Bayesian statistics: it is a data-driven empirical method; the name only reflects the Bayes-rule-like calculation.</p>"
      },
      {
        h: "Worked example: a loan",
        body: "<p>Fitting a model on the loan data (predictors: purpose, home ownership, employment length) gives conditional probabilities $P(X_j \\mid Y = i)$ for the \"paid off\" and \"default\" classes. Scoring a new loan that is a small-business loan, with a mortgage, and employment over one year:</p>" +
          "<table class=\"extable\"><thead><tr><th>Predictor category</th><th>paid off</th><th>default</th></tr></thead><tbody>" +
          "<tr><td class=\"row-h\">purpose: credit_card</td><td class=\"num\">0.1857711</td><td class=\"num\">0.1517548</td></tr>" +
          "<tr><td class=\"row-h\">purpose: debt_consolidation</td><td class=\"num\">0.5523427</td><td class=\"num\">0.5777144</td></tr>" +
          "<tr><td class=\"row-h\">purpose: home_improvement</td><td class=\"num\">0.0715335</td><td class=\"num\">0.0595609</td></tr>" +
          "<tr><td class=\"row-h\">purpose: major_purchase</td><td class=\"num\">0.0554115</td><td class=\"num\">0.0370851</td></tr>" +
          "<tr><td class=\"row-h\">purpose: medical</td><td class=\"num\">0.0123617</td><td class=\"num\">0.0143499</td></tr>" +
          "<tr><td class=\"row-h\">purpose: other</td><td class=\"num\">0.0995851</td><td class=\"num\">0.1141511</td></tr>" +
          "<tr><td class=\"row-h\">purpose: small_business</td><td class=\"num\">0.0229945</td><td class=\"num\">0.0453838</td></tr>" +
          "<tr><td class=\"row-h\">home: MORTGAGE</td><td class=\"num\">0.4966286</td><td class=\"num\">0.4327455</td></tr>" +
          "<tr><td class=\"row-h\">home: OWN</td><td class=\"num\">0.0804374</td><td class=\"num\">0.0836359</td></tr>" +
          "<tr><td class=\"row-h\">home: RENT</td><td class=\"num\">0.4229340</td><td class=\"num\">0.4836186</td></tr>" +
          "<tr><td class=\"row-h\">emp_len: &gt; 1 Year</td><td class=\"num\">0.9690526</td><td class=\"num\">0.9523686</td></tr>" +
          "<tr><td class=\"row-h\">emp_len: &lt; 1 Year</td><td class=\"num\">0.0309474</td><td class=\"num\">0.0476314</td></tr>" +
          "</tbody></table>" +
          "<table class=\"extable\"><thead><tr><th>Outcome</th><th>Posterior probability</th></tr></thead><tbody>" +
          "<tr><td class=\"row-h\">paid off</td><td class=\"num\">0.3717</td></tr>" +
          "<tr><td class=\"row-h\">default</td><td class=\"num\">0.6283</td></tr>" +
          "</tbody></table>" +
          "<p>The model predicts <strong>default</strong>. The book notes naive Bayes gives <em>biased</em> probability estimates, but when the goal is to <em>rank</em> records by the chance that $Y = 1$, unbiased probabilities are not needed and it performs well.</p>"
      },
      {
        h: "Numeric predictors",
        body: "Because the classifier works only with categorical predictors, there are two ways to handle numeric ones: <strong>bin</strong> the numeric predictor into categories and use the standard algorithm, or use a probability model (e.g., the normal distribution) to estimate $P(X_j \\mid Y = i)$. A caution: if a predictor category never appears in training, the algorithm assigns it <em>zero</em> probability in new data rather than ignoring it — worth watching when binning continuous variables."
      }
    ],
    takeaways: [
      "Naive Bayes works with categorical predictors and outcomes.",
      "It asks: within each outcome class, which predictor categories are most probable?",
      "That information is then inverted to estimate outcome probabilities given the predictors.",
      "It assumes predictors are independent within a class — the source of the word \"naive\"."
    ]
  });
  window.CODEVIZ["ps-ch5-naive-bayes"] = {
    charts: [{
      type: "bars",
      title: "Predicted posterior for the new loan",
      interpret: "The default probability (0.63) exceeds paid-off (0.37), so the record is classified as a default.",
      labels: ["paid off", "default"],
      values: [0.3717, 0.6283],
      colors: ["#7ee787", "#ffb454"]
    }],
    code: "# --- R (Practical Statistics, 1st ed.) ---\n# library(klaR)\n# naive_model <- NaiveBayes(outcome ~ purpose_ + home_ + emp_len_,\n#                           data = na.omit(loan_data))\n# naive_model$table\n# # purpose small_business: paid off 0.02299447, default 0.04538382\n# # home MORTGAGE: paid off 0.4966286, default 0.4327455\n# # emp_len > 1 Year: paid off 0.9690526, default 0.9523686\n# predict(naive_model, new_loan)\n# # class: default; posterior: paid off 0.3717206, default 0.6282794\n\n# --- Python equivalent ---\nfrom sklearn.compose import ColumnTransformer\nfrom sklearn.naive_bayes import CategoricalNB\nfrom sklearn.pipeline import make_pipeline\nfrom sklearn.preprocessing import OrdinalEncoder\n\nfeatures = ['purpose_', 'home_', 'emp_len_']\nnb = make_pipeline(OrdinalEncoder(handle_unknown='use_encoded_value', unknown_value=-1),\n                   CategoricalNB())\nnb.fit(loan_data[features].dropna(), loan_data.dropna()['outcome'])\nnb.predict(new_loan[features])       # ['default']\nnb.predict_proba(new_loan[features]) # paid off 0.3717206, default 0.6282794"
  };

  /* -------------------------------------------------------- Discriminant Analysis */
  B({
    id: "ps-ch5-discriminant-analysis",
    chapter: CH,
    title: "Discriminant Analysis",
    tagline: "The earliest statistical classifier: separate classes by maximizing between-group spread over within-group spread.",
    sections: [
      {
        h: "Origins and scope",
        body: "Discriminant analysis is the earliest statistical classifier, introduced by R. A. Fisher in 1936. Its most common form is <em>linear discriminant analysis</em> (LDA). It is now less widely used than tree models or logistic regression, but it still appears, links to principal components analysis, and gives a measure of predictor importance — making it a computationally efficient feature-selection tool. (The book warns: LDA here is <em>not</em> Latent Dirichlet Allocation, an unrelated text-analysis method that shares the acronym.)"
      },
      {
        h: "Covariance matrix",
        body: "<p><em>Covariance</em> measures how two variables vary together — similar magnitude and direction. For variables $x$ and $z$ with means $\\bar{x}$ and $\\bar{z}$:</p>" +
          "<p>$s_{x,z} = \\frac{\\sum_{i=1}^{n}(x_i - \\bar{x})(z_i - \\bar{z})}{n - 1}$</p>" +
          "<p>where $n$ is the number of records (we divide by $n - 1$). Like correlation, positive values mean a positive relationship; but unlike correlation (bounded between $-1$ and $1$), covariance is on the same scale as the variables. The <em>covariance matrix</em> $\\Sigma$ holds the individual variances $s_x^2$ and $s_z^2$ on the diagonal and the covariances $s_{x,z}$ off the diagonal:</p>" +
          "<p>$\\Sigma = \\begin{bmatrix} s_x^2 &amp; s_{x,z} \\\\ s_{x,z} &amp; s_z^2 \\end{bmatrix}$</p>" +
          "<p>The covariance matrix generalizes the standard-deviation-to-z-score normalization to many variables — the multivariate version is the Mahalanobis distance, which is related to the LDA function.</p>"
      },
      {
        h: "Fisher's linear discriminant",
        body: "<p>Consider predicting a binary outcome $y$ from two continuous variables $(x, z)$. Fisher's linear discriminant separates variation <em>between</em> groups from variation <em>within</em> groups. To split the records into two groups, LDA maximizes the \"between\" sum of squares (variation between the two groups) relative to the \"within\" sum of squares (within-group variation):</p>" +
          "<p>$\\frac{SS_{between}}{SS_{within}}$</p>" +
          "<p>The between sum of squares is the squared distance between the two group means; the within sum of squares is the spread around each group's mean, weighted by the covariance matrix. The method finds the linear combination $w_x x + w_z z$ that maximizes this ratio, yielding the greatest separation between the two groups.</p>"
      },
      {
        h: "A simple example",
        body: "<p>Running LDA on loan data with predictors <code>borrower_score</code> and <code>payment_inc_ratio</code> gives the linear discriminator weights:</p>" +
          "<table class=\"extable\"><thead><tr><th>Predictor</th><th>LD1 weight</th></tr></thead><tbody>" +
          "<tr><td class=\"row-h\">borrower_score</td><td class=\"num\">-6.2963</td></tr>" +
          "<tr><td class=\"row-h\">payment_inc_ratio</td><td class=\"num\">0.1288</td></tr>" +
          "</tbody></table>" +
          "<p>The first six posterior probabilities printed by <code>predict(loan_lda)</code> show how close many loans sit to the boundary:</p>" +
          "<table class=\"extable\"><thead><tr><th>row</th><th>paid off</th><th>default</th></tr></thead><tbody>" +
          "<tr><td class=\"row-h\">25333</td><td class=\"num\">0.5554293</td><td class=\"num\">0.4445707</td></tr>" +
          "<tr><td class=\"row-h\">27041</td><td class=\"num\">0.6274352</td><td class=\"num\">0.3725648</td></tr>" +
          "<tr><td class=\"row-h\">7398</td><td class=\"num\">0.4014055</td><td class=\"num\">0.5985945</td></tr>" +
          "<tr><td class=\"row-h\">35625</td><td class=\"num\">0.3411242</td><td class=\"num\">0.6588758</td></tr>" +
          "<tr><td class=\"row-h\">17058</td><td class=\"num\">0.6081592</td><td class=\"num\">0.3918408</td></tr>" +
          "<tr><td class=\"row-h\">2986</td><td class=\"num\">0.6733245</td><td class=\"num\">0.3266755</td></tr>" +
          "</tbody></table>" +
          "<p>Predicting the probability of default versus paid off and plotting it over the two predictors, LDA splits the predictor space into two regions with a straight line; predictions farther from the line carry higher confidence (probability further from 0.5). If predictors are normalized before LDA, the discriminator weights themselves measure variable importance — an efficient feature-selection method.</p>"
      },
      {
        h: "Extensions",
        body: "LDA extends to more than two predictors (the practical limit is having enough records to estimate the covariance matrix). The best-known variant is <em>quadratic discriminant analysis</em> (QDA), which despite the name still produces a linear discriminant function; the difference is that LDA assumes the same covariance matrix for both classes, while QDA allows different covariance matrices — a distinction that rarely matters much in practice."
      }
    ],
    takeaways: [
      "Discriminant analysis works with continuous or categorical predictors and categorical outcomes.",
      "Using the covariance matrix it builds a linear discriminant function to distinguish classes.",
      "Applied to records, the function yields weights (scores) that determine the predicted class."
    ]
  });
  window.CODEVIZ["ps-ch5-discriminant-analysis"] = {
    charts: [{
      type: "bars",
      title: "LDA linear discriminator weights",
      interpret: "The fitted LD1 direction weights borrower_score strongly negative (-6.2963) and payment_inc_ratio weakly positive (0.1288), matching the book's loan-data output.",
      labels: ["borrower_score", "payment_inc_ratio"],
      values: [-6.2963, 0.1288],
      colors: ["#4ea1ff", "#ffb454"]
    }],
    code: "# --- R (Practical Statistics, 1st ed.) ---\n# library(MASS)\n# loan_lda <- lda(outcome ~ borrower_score + payment_inc_ratio, data=loan3000)\n# loan_lda$scaling\n# #                    LD1\n# # borrower_score     -6.2962811\n# # payment_inc_ratio   0.1288243\n# pred <- predict(loan_lda)\n# head(pred$posterior)\n# # 25333: paid off 0.5554293, default 0.4445707\n# # 7398:  paid off 0.4014055, default 0.5985945\n# lda_df <- cbind(loan3000, prob_default=pred$posterior[, 'default'])\n\n# --- Python equivalent ---\nfrom sklearn.discriminant_analysis import LinearDiscriminantAnalysis\n\nX = loan3000[['borrower_score', 'payment_inc_ratio']]\ny = loan3000['outcome']\nlda = LinearDiscriminantAnalysis().fit(X, y)\nproba = lda.predict_proba(X.head())\n# first rows correspond to default probabilities near 0.4446, 0.3726, 0.5986"
  };

  /* ------------------------------------------------------------ Logistic Regression */
  B({
    id: "ps-ch5-logistic-regression",
    chapter: CH,
    title: "Logistic Regression",
    tagline: "Linear regression for a binary outcome, fit on the log-odds scale and mapped back to a probability.",
    sections: [
      {
        h: "The idea",
        body: "Logistic regression is like multiple linear regression except the outcome is binary. A series of transformations recast the problem into one a linear model can fit. Like discriminant analysis — and unlike K-Nearest Neighbors or naive Bayes — it is a structured model approach rather than a data-centric one. It is popular because it is fast and produces a model that scores new data quickly."
      },
      {
        h: "Logistic response function and logit",
        body: "<p>Think of the outcome not as a 0/1 label but as the probability $p$ that the label is a 1. Modeling $p$ directly as a linear function $p = \\beta_0 + \\beta_1 x_1 + ... + \\beta_q x_q$ would let $p$ stray outside $[0, 1]$. Instead, apply the <em>logistic response</em> (inverse logit) function:</p>" +
          "<p>$p = \\frac{1}{1 + e^{-(\\beta_0 + \\beta_1 x_1 + ... + \\beta_q x_q)}}$</p>" +
          "<p>which keeps $p$ between 0 and 1. To remove the exponential, work with <em>odds</em> — the ratio of successes (1) to non-successes (0). If a horse's win probability is 0.5, the won't-win probability is 0.5 and the odds are 1.0:</p>" +
          "<p>$\\text{Odds}(Y = 1) = \\frac{p}{1 - p}, \\qquad p = \\frac{\\text{Odds}}{1 + \\text{Odds}}$</p>" +
          "<p>Combining gives $\\text{Odds}(Y = 1) = e^{\\beta_0 + \\beta_1 x_1 + ... + \\beta_q x_q}$, and taking logs yields a linear model for the <em>log-odds</em>, also called the <em>logit</em>: $\\log(\\text{Odds}(Y = 1)) = \\beta_0 + \\beta_1 x_1 + ... + \\beta_q x_q$. The logit maps $p$ from $(0, 1)$ to all of $(-\\infty, +\\infty)$ — see the chart. The circle is complete: a linear model predicts a probability, which a cutoff rule turns into a class label."
      },
      {
        h: "Logistic regression and the GLM",
        body: "Because we observe only the binary outcome, not the log-odds, logistic regression is fit as a <em>generalized linear model</em> (GLM). A GLM has two parts: a probability family (binomial, for logistic regression) and a link function mapping the response to the predictors (the logit, here). Logistic regression is by far the most common GLM. Other families exist — a log link, the Poisson for count data, or negative binomial and gamma for elapsed-time data — but the book advises caution with these."
      },
      {
        h: "Predicted values",
        body: "<p>The predicted value is on the log-odds scale, $\\hat{Y} = \\log(\\text{Odds}(Y = 1))$, and the predicted probability comes from the logistic response function $\\hat{p} = \\frac{1}{1 + e^{-\\hat{Y}}}$. On the loan model, raw predictions ($\\hat{Y}$, log-odds) range from about $-2.73$ to $3.66$ with a median near $-0.005$. Converting to probabilities:</p>" +
          "<table class=\"extable\"><thead><tr><th>Statistic</th><th>log-odds $\\hat{Y}$</th><th>probability $\\hat{p}$</th></tr></thead><tbody>" +
          "<tr><td class=\"row-h\">Min</td><td class=\"num\">-2.728</td><td class=\"num\">0.0613</td></tr>" +
          "<tr><td class=\"row-h\">Median</td><td class=\"num\">-0.005</td><td class=\"num\">0.4987</td></tr>" +
          "<tr><td class=\"row-h\">Mean</td><td class=\"num\">0.003</td><td class=\"num\">0.5000</td></tr>" +
          "<tr><td class=\"row-h\">Max</td><td class=\"num\">3.658</td><td class=\"num\">0.9749</td></tr>" +
          "</tbody></table>" +
          "<p>These probabilities are on a 0-to-1 scale and do not yet declare a class. Declaring everything above 0.5 a default is analogous to the KNN classifier, but a lower cutoff is often appropriate when the goal is to find a rare class.</p>"
      },
      {
        h: "Interpreting coefficients and odds ratios",
        body: "<p>A strength of logistic regression is interpretability through the <em>odds ratio</em>. For a binary factor $X$:</p>" +
          "<p>$\\text{odds ratio} = \\frac{\\text{Odds}(Y = 1 \\mid X = 1)}{\\text{Odds}(Y = 1 \\mid X = 0)}$</p>" +
          "<p>If the odds ratio is 2, the odds that $Y = 1$ are twice as high when $X = 1$ as when $X = 0$. We work with odds because the coefficient $\\beta_j$ is the <em>log of the odds ratio</em> for $X_j$ — so $e^{\\beta_j}$ gives the odds ratio. Worked examples from the loan model:</p>" +
          "<table class=\"extable\"><thead><tr><th>Coefficient</th><th>$\\beta_j$</th><th>Odds ratio $e^{\\beta_j}$</th></tr></thead><tbody>" +
          "<tr><td class=\"row-h\">purpose_small_business</td><td class=\"num\">1.21226</td><td class=\"num\">3.4</td></tr>" +
          "<tr><td class=\"row-h\">a unit increase</td><td class=\"num\">1.0</td><td class=\"num\">2.72</td></tr>" +
          "<tr><td class=\"row-h\">payment_inc_ratio (5 to 6)</td><td class=\"num\">0.08244</td><td class=\"num\">1.09</td></tr>" +
          "<tr><td class=\"row-h\">borrower_score</td><td class=\"num\">-4.63890</td><td class=\"num\">0.01</td></tr>" +
          "</tbody></table>" +
          "<p>So a small-business loan multiplies the odds of default by about 3.4 versus a credit-card-payoff loan. Because coefficients are on the log scale, each $+1$ in the coefficient multiplies the odds ratio by $e^1 \\approx 2.72$. For numeric predictors, the odds ratio is read per unit change: raising payment-to-income from 5 to 6 raises default odds by a factor of about 1.09. And $e^{-4.63890} \\approx 0.01$ means the worst-creditworthiness borrowers have roughly 100 times the default risk of the best."
      },
      {
        h: "Linear vs logistic regression",
        body: "Linear and logistic regression share much: both assume a parametric linear form, and exploration and model-building are similar (spline transforms apply to both). They differ in two fundamental ways. First, <strong>fitting</strong>: least squares does not apply to logistic regression — there is no closed-form solution, so it is fit by <em>maximum likelihood estimation</em> (MLE), which finds the parameters most likely to have produced the observed data. MLE uses a quasi-Newton optimization (Fisher's scoring) and judges fit by <em>deviance</em> (lower is better). Second, the <strong>nature of the residuals</strong>: a logistic model has no RMSE or R-squared, and partial residuals fall into two clouds (one per outcome) because the output is binary — still useful for spotting nonlinearity and influential records."
      },
      {
        h: "Assessing the model",
        body: "Logistic regression is assessed mainly by how accurately it classifies new data, using the general classification metrics. Alongside the coefficients, software reports a standard error, a z-value, and a p-value — but as in regression, the p-value is best read as a relative indicator of variable importance rather than a formal significance test. Many linear-regression ideas carry over: stepwise selection, interaction terms, spline terms, and the same concerns about confounding and correlated variables. Some summary output (the dispersion parameter, residual deviance, number of scoring iterations) relates to GLM/MLE mechanics and can largely be ignored for plain logistic regression."
      }
    ],
    takeaways: [
      "Logistic regression is like linear regression but for a binary outcome.",
      "Several transforms recast it as a linear model with the log-odds (logit) as the response.",
      "After the linear model is fit iteratively, the log-odds maps back to a probability.",
      "Coefficients are log odds ratios; exponentiate them to read effects as odds ratios.",
      "It is popular because it is fast and scores new data without recomputation."
    ]
  });
  window.CODEVIZ["ps-ch5-logistic-regression"] = {
    charts: [{
      type: "line",
      title: "The logit maps probability to a linear scale",
      interpret: "logit(p) = log(p/(1-p)) stretches p in (0,1) out to (-inf, +inf), so a linear model can predict it; it crosses 0 at p = 0.5.",
      xlabel: "p",
      ylabel: "logit(p)",
      series: [{
        name: "logit(p)",
        color: "#4ea1ff",
        points: [
          [0.01, -4.60], [0.05, -2.94], [0.10, -2.20], [0.20, -1.39],
          [0.30, -0.85], [0.40, -0.41], [0.50, 0.0], [0.60, 0.41],
          [0.70, 0.85], [0.80, 1.39], [0.90, 2.20], [0.95, 2.94], [0.99, 4.60]
        ]
      }]
    }],
    code: "# --- R (Practical Statistics, 1st ed.) ---\n# logistic_model <- glm(outcome ~ payment_inc_ratio + purpose_ + home_ +\n#                         emp_len_ + borrower_score,\n#                       data=loan_data, family='binomial')\n# logistic_model\n# # (Intercept) 1.26982; payment_inc_ratio 0.08244\n# # purpose_small_business 1.21226; borrower_score -4.63890\n# pred <- predict(logistic_model)\n# summary(pred)\n# # Min -2.728000; Median -0.005235; Mean 0.002599; Max 3.658000\n# prob <- 1/(1 + exp(-pred))\n# summary(prob)\n# # Min 0.06132; Median 0.49870; Mean 0.50000; Max 0.97490\n# exp(1.212264)   # 3.361086; small_business odds multiplier\n# exp(0.082443)   # 1.085937; payment_inc_ratio +1\n# exp(-4.638902)  # 0.009668; best vs worst borrower_score\n\n# --- Python equivalent ---\nimport numpy as np\nfrom sklearn.compose import ColumnTransformer\nfrom sklearn.linear_model import LogisticRegression\nfrom sklearn.pipeline import make_pipeline\nfrom sklearn.preprocessing import OneHotEncoder\n\ncat = ['purpose_', 'home_', 'emp_len_']\nnum = ['payment_inc_ratio', 'borrower_score']\nprep = ColumnTransformer([('cat', OneHotEncoder(drop='first'), cat), ('num', 'passthrough', num)])\nlogit = make_pipeline(prep, LogisticRegression(max_iter=1000)).fit(loan_data[cat + num], loan_data['outcome'])\nlog_odds = logit.decision_function(loan_data[cat + num])\nprob = 1 / (1 + np.exp(-log_odds))"
  };

  /* ------------------------------------------------- Evaluating Classification Models */
  B({
    id: "ps-ch5-evaluating-classification",
    chapter: CH,
    title: "Evaluating Classification Models",
    tagline: "Accuracy is just the start: the confusion matrix, precision/recall/specificity, ROC, AUC, and lift tell the real story.",
    sections: [
      {
        h: "Accuracy and the confusion matrix",
        body: "<p>The simplest measure is <em>accuracy</em> — the proportion of predictions that are correct: $\\text{accuracy} = \\frac{\\sum \\text{TruePositive} + \\sum \\text{TrueNegative}}{\\text{SampleSize}}$. The default cutoff for declaring a 1 is usually 0.50. At the heart of evaluation is the <em>confusion matrix</em>, a 2&times;2 table (in the binary case) of record counts by predicted versus actual class. Following the book's convention $Y = 1$ is the event of interest (e.g., default) and $Y = 0$ is the usual case. For the logistic GAM model applied to the full training set (actual = rows, predicted = columns):</p>" +
          "<table class=\"extable\"><thead><tr><th></th><th>Yhat = 1</th><th>Yhat = 0</th></tr></thead><tbody>" +
          "<tr><td class=\"row-h\">Y = 1</td><td class=\"num\">14635</td><td class=\"num\">8501</td></tr>" +
          "<tr><td class=\"row-h\">Y = 0</td><td class=\"num\">8236</td><td class=\"num\">14900</td></tr>" +
          "</tbody></table>" +
          "<p>The diagonal holds correct predictions; the off-diagonal holds errors (top-right = false negatives, bottom-left = false positives). One metric not explicitly shown is the false positive <em>rate</em> (the mirror of precision): when 1s are rare, false positives can swamp predicted positives, so a predicted 1 may most likely be a 0 — the trap behind mammogram-style screening confusion.</p>"
      },
      {
        h: "The rare class problem",
        body: "Classes are often imbalanced — one far more common than the other (legitimate vs fraudulent insurance claims, browsers vs purchasers). The rare class (the fraud, the purchase) is usually the one of interest and is designated 1, because misclassifying a 1 as a 0 is costlier than the reverse. The danger: unless classes are easily separable, the <em>most accurate</em> model may simply call everything 0. If only 0.1% of web-store browsers buy, predicting \"no purchase\" for everyone is 99.9% accurate — and useless. We would rather have a less-accurate model that is good at picking out the purchasers, even at the cost of some false alarms."
      },
      {
        h: "Precision, recall, and specificity",
        body: "<p>More nuanced metrics, many borrowed from biostatistics:</p>" +
          "<ul class=\"steps\">" +
          "<li><strong>Precision</strong> — accuracy of a predicted positive: $\\frac{\\sum \\text{TruePositive}}{\\sum \\text{TruePositive} + \\sum \\text{FalsePositive}}$.</li>" +
          "<li><strong>Recall</strong> (a.k.a. <em>sensitivity</em>) — the strength to find positives, the proportion of 1s correctly identified: $\\frac{\\sum \\text{TruePositive}}{\\sum \\text{TruePositive} + \\sum \\text{FalseNegative}}$. \"Sensitivity\" is the biostatistics/medical term; \"recall\" the machine-learning one.</li>" +
          "<li><strong>Specificity</strong> — the ability to find negatives: $\\frac{\\sum \\text{TrueNegative}}{\\sum \\text{TrueNegative} + \\sum \\text{FalsePositive}}$.</li>" +
          "</ul>" +
          "<table class=\"extable\"><thead><tr><th>Metric</th><th>Arithmetic</th><th>Value</th></tr></thead><tbody>" +
          "<tr><td class=\"row-h\">accuracy</td><td>(14635 + 14900) / 46272</td><td class=\"num\">0.6383</td></tr>" +
          "<tr><td class=\"row-h\">precision</td><td>14635 / (14635 + 8236)</td><td class=\"num\">0.6399</td></tr>" +
          "<tr><td class=\"row-h\">recall</td><td>14635 / (14635 + 8501)</td><td class=\"num\">0.6326</td></tr>" +
          "<tr><td class=\"row-h\">specificity</td><td>14900 / (14900 + 8236)</td><td class=\"num\">0.6440</td></tr>" +
          "</tbody></table>" +
          "<ul class=\"steps\"><li>Total records: $14635 + 8501 + 8236 + 14900 = 46272$.</li><li>Precision asks whether predicted defaults were truly defaults: $14635 / 22871 = 0.6399$.</li><li>Recall asks how many actual defaults were caught: $14635 / 23136 = 0.6326$.</li><li>Specificity asks how many actual paid-off loans were kept negative: $14900 / 23136 = 0.6440$.</li></ul>"
      },
      {
        h: "ROC curve",
        body: "<p>There is a tradeoff between recall and specificity: catching more 1s usually means mislabeling more 0s as 1s. The ROC (\"Receiver Operating Characteristics\") curve captures this tradeoff, plotting recall (sensitivity) on the y-axis against specificity on the x-axis as the cutoff varies. To build it:</p>" +
          "<ul class=\"steps\">" +
          "<li>Sort records by predicted probability of being a 1, most probable first.</li>" +
          "<li>Compute cumulative specificity and recall as you go down the sorted list.</li>" +
          "</ul>" +
          "<p>A dotted diagonal marks a classifier no better than chance; a great classifier hugs the upper-left corner. For the loan model, requiring specificity of at least 50% yields a recall of about 75%. (The ROC curve was first used in World War II to rate radar stations.)</p>"
      },
      {
        h: "AUC",
        body: "The ROC curve is graphical, not a single number — but the area underneath it, the <em>AUC</em>, is. AUC is simply the total area under the ROC curve; larger is better. AUC = 1 is a perfect classifier (all 1s caught, no 0s misclassified) and AUC = 0.5 is the useless diagonal. Computed by numerical integration, the loan model's AUC is about <strong>0.59</strong> (0.5924) — a relatively weak classifier."
      },
      {
        h: "Lift",
        body: "AUC improves on accuracy but does not fully solve the rare-class problem, where the cutoff must drop below 0.5 to avoid labeling everything 0. <em>Lift</em> sidesteps the question of the optimal cutoff. Consider records in order of their predicted probability of being a 1: of the top 10% flagged, how much better did the model do than picking blindly? If the top decile gives a 0.3% response versus 0.1% picking randomly, the lift (or <em>gains</em>) is 3 in the top decile. A lift chart (gains chart) quantifies this over the data — built from a cumulative gains chart (recall on the y-axis, record count on the x-axis), with the lift curve being the ratio of cumulative gains to the random-selection diagonal. Decile gains charts are an old direct-mail technique; a tax authority with a fixed audit budget would use one to decide which returns to audit."
      }
    ],
    takeaways: [
      "Accuracy (percent of predictions correct) is only a first step.",
      "Recall, specificity, and precision focus on specific performance characteristics.",
      "AUC (area under the ROC curve) measures the ability to distinguish 1s from 0s.",
      "Lift measures how effective a model is at identifying 1s, often decile by decile."
    ]
  });
  window.CODEVIZ["ps-ch5-evaluating-classification"] = {
    charts: [
      {
        type: "confusion",
        title: "Confusion matrix — logistic GAM on full training set",
        interpret: "Rows are actual (Y), columns are predicted (Yhat). Diagonal counts (14635, 14900) are correct; off-diagonal (8501 false negatives, 8236 false positives) are errors.",
        labels: ["1", "0"],
        matrix: [[14635, 8501], [8236, 14900]]
      },
      {
        type: "roc",
        title: "ROC curve for the loan data",
        interpret: "Recall vs specificity as the cutoff varies; the curve sits modestly above the chance diagonal (AUC about 0.59). At specificity 50% the recall is about 75%.",
        auc: 0.59,
        points: [
          [0.0, 0.0], [0.1, 0.30], [0.2, 0.46], [0.3, 0.57],
          [0.4, 0.66], [0.5, 0.75], [0.6, 0.82], [0.7, 0.88],
          [0.8, 0.93], [0.9, 0.97], [1.0, 1.0]
        ]
      }
    ],
    code: "# --- R (Practical Statistics, 1st ed.) ---\n# pred <- predict(logistic_gam, newdata=train_set)\n# pred_y <- as.numeric(pred > 0)\n# true_y <- as.numeric(train_set$outcome == 'default')\n# true_pos <- (true_y==1) & (pred_y==1)\n# true_neg <- (true_y==0) & (pred_y==0)\n# false_pos <- (true_y==0) & (pred_y==1)\n# false_neg <- (true_y==1) & (pred_y==0)\n# conf_mat <- matrix(c(sum(true_pos), sum(false_pos),\n#                      sum(false_neg), sum(true_neg)), 2, 2)\n# #      Yhat=1 Yhat=0\n# # Y=1   14635   8501\n# # Y=0    8236  14900\n# conf_mat[1,1]/sum(conf_mat[,1])  # precision 0.6399\n# conf_mat[1,1]/sum(conf_mat[1,])  # recall 0.6326\n# conf_mat[2,2]/sum(conf_mat[2,])  # specificity 0.6440\n# idx <- order(-pred)\n# recall <- cumsum(true_y[idx]==1)/sum(true_y==1)\n# specificity <- (sum(true_y==0)-cumsum(true_y[idx]==0))/sum(true_y==0)\n# roc_df <- data.frame(recall=recall, specificity=specificity)\n# sum(roc_df$recall[-1] * diff(1-roc_df$specificity)) # 0.5924072\n\n# --- Python equivalent ---\nfrom sklearn.metrics import confusion_matrix, precision_score, recall_score, roc_auc_score, roc_curve\n\npred_y = (pred > 0).astype(int)\ntrue_y = (train_set['outcome'] == 'default').astype(int)\nconfusion_matrix(true_y, pred_y, labels=[1, 0])  # [[14635, 8501], [8236, 14900]]\nprecision_score(true_y, pred_y)  # 0.6399\nrecall_score(true_y, pred_y)     # 0.6326\nfpr, tpr, thresholds = roc_curve(true_y, pred)\nroc_auc_score(true_y, pred)      # 0.5924072"
  };

  /* ----------------------------------------------- Strategies for Imbalanced Data */
  B({
    id: "ps-ch5-imbalanced-data",
    chapter: CH,
    title: "Strategies for Imbalanced Data",
    tagline: "When the interesting 1s are rare, rebalance the training data or build the cost asymmetry into the decision.",
    sections: [
      {
        h: "The problem",
        body: "<p>When the outcome of interest (a purchase, a fraud) is rare, classifiers struggle. The book illustrates with loan data: in the full set only about <strong>5.02%</strong> of loans defaulted. Earlier work used a <em>balanced</em> training set (half paid off, half default), where about 50% of predictions came out as default. But training the model on the full, unbalanced data and predicting default gives:</p>" +
          "<table class=\"extable\"><thead><tr><th>Training data</th><th>Share predicted as default</th></tr></thead><tbody>" +
          "<tr><td class=\"row-h\">balanced (half/half)</td><td class=\"num\">~50%</td></tr>" +
          "<tr><td class=\"row-h\">full / unbalanced</td><td class=\"num\">0.39%</td></tr>" +
          "</tbody></table>" +
          "<p>Only 0.39% are predicted to default — less than 1/12 of the expected 5%. The many non-defaulting loans, plus inevitable predictor variability, mean that even a defaulting loan resembles some paid-off loan by chance, so the model rarely commits to a default.</p>"
      },
      {
        h: "Undersampling",
        body: "When there is enough data — as with the loan data — <em>undersampling</em> (downsampling) uses fewer of the prevalent-class records so the data is more balanced between 0s and 1s. The idea is that the dominant class has many redundant records; a smaller, balanced set improves performance and makes the data easier to prepare and explore. How much is enough? It depends, but generally tens of thousands of records for the less-common class suffices, and the more separable the 1s are, the less data is needed."
      },
      {
        h: "Oversampling and up/down weighting",
        body: "<p>A criticism of undersampling is that it throws away data. With a small data set whose rare class has only a few hundred or thousand records, downsampling risks discarding useful information. Instead, <em>oversample</em> (upsample) the rare class by drawing extra rows with replacement (bootstrapping). A similar effect comes from <strong>weighting</strong>: many algorithms accept a weight argument. On the loan data, setting the weight for defaulting loans to $\\frac{1}{p}$ (where $p$ is the probability of default) and a weight of 1 for non-defaulting loans makes the two weight totals roughly equal. The share predicted as default then rises from 0.39% to about <strong>43%</strong>. Weighting is an easy way to adapt the model's loss function — discounting errors on low-weight records in favor of high-weight ones — since directly modifying a complex classifier's loss function is hard.</p>"
      },
      {
        h: "Data generation",
        body: "A variation of bootstrap upsampling is <em>data generation</em>: perturb existing records to create new ones. With only a limited set of observed instances, the algorithm lacks a rich basis for rules; new records that are similar but not identical to existing ones let it learn a more robust rule set (in the spirit of boosting and bagging). The well-known method is <em>SMOTE</em> (Synthetic Minority Oversampling Technique): it finds a record similar to the one being upsampled and creates a synthetic record that is a randomly weighted average of the original and its neighbor, with the weight drawn separately for each predictor. The number of synthetic records depends on the oversampling ratio needed to bring the classes into approximate balance."
      },
      {
        h: "Cost-based classification",
        body: "<p>Accuracy and AUC are, in the book's words, a poor person's way to choose a classification rule. Often a cost can be assigned to false positives versus false negatives, and it is better to fold those costs into the cutoff. If the expected cost of a new loan's default is $C$ and the expected return from a paid-off loan is $R$, the expected return for the loan is:</p>" +
          "<p>$\\text{expected return} = P(Y = 0) \\times R + P(Y = 1) \\times C$</p>" +
          "<p>Rather than just labeling a loan default/paid-off or reporting its default probability, decide whether the loan has a positive expected return. Predicted default probability is an intermediate step; combined with the loan's total value it gives expected profit — the real planning metric. A smaller-value loan might be passed over for a larger one even if the larger one has a slightly higher predicted default probability.</p>"
      },
      {
        h: "Exploring the predictions",
        body: "No single metric like AUC captures a model's full appropriateness. Comparing decision rules for four models fit to the loan data on two predictors (LDA, logistic linear regression, logistic GAM, and a tree model): LDA and logistic linear regression give nearly identical straight-line rules; the tree model gives the least regular rule (it can even flip a prediction the \"wrong\" way as the borrower score rises); and the GAM fit is a compromise between the tree and the linear models. Visualizing rules is hard in higher dimensions, but exploratory analysis of predicted values is always warranted."
      }
    ],
    takeaways: [
      "Highly imbalanced data, where the interesting 1s are rare, is problematic for classifiers.",
      "One strategy is to balance training data by undersampling the abundant class or oversampling the rare one.",
      "If using all the 1s still leaves too few, bootstrap the rare cases or use SMOTE to synthesize similar ones.",
      "Imbalance usually means one class is worth more, and that value ratio belongs in the assessment metric."
    ]
  });
  window.CODEVIZ["ps-ch5-imbalanced-data"] = {
    charts: [{
      type: "bars",
      title: "Share of loans predicted as default by training scheme",
      interpret: "Trained on the full unbalanced data the model predicts only 0.39% defaults (vs a 5% base rate); rebalancing via weights lifts this to about 43%, near the balanced-data 50%.",
      labels: ["full / unbalanced", "weighted", "balanced"],
      values: [0.39, 43, 50],
      valueLabels: ["0.39%", "43%", "~50%"],
      colors: ["#ffb454", "#4ea1ff", "#7ee787"]
    }],
    code: "# --- R (Practical Statistics, 1st ed.) ---\n# mean(loan_all_data$outcome == 'default')\n# # [1] 0.05024048\n# full_model <- glm(outcome ~ payment_inc_ratio + purpose_ +\n#                     home_ + emp_len_ + dti + revol_bal + revol_util,\n#                   data=train_set, family='binomial')\n# pred <- predict(full_model)\n# mean(pred > 0)\n# # [1] 0.00386009\n# wt <- ifelse(loan_all_data$outcome == 'default',\n#              1/mean(loan_all_data$outcome == 'default'), 1)\n# full_model <- glm(outcome ~ payment_inc_ratio + purpose_ +\n#                     home_ + emp_len_ + dti + revol_bal + revol_util,\n#                   data=loan_all_data, weight=wt, family='binomial')\n# pred <- predict(full_model)\n# mean(pred > 0)\n# # [1] 0.4344177\n\n# --- Python equivalent ---\nimport numpy as np\nfrom sklearn.linear_model import LogisticRegression\n\np_default = (loan_all_data['outcome'] == 'default').mean()  # 0.05024048\nweights = np.where(loan_all_data['outcome'] == 'default', 1 / p_default, 1)\n# Fit the same features with sample_weight=weights; predicted-default share rises to about 0.4344."
  };
})();
