/* All of Statistics (Larry Wasserman) — Chapter 22: Classification.
   Self-registering book-template lessons, one per key concept. */
(function () {
  window.LESSONS = window.LESSONS || [];
  window.CODEVIZ = window.CODEVIZ || {};
  const M = "All of Statistics";
  const B = (o) => window.LESSONS.push(Object.assign({ module: M, template: "book", book: "All of Statistics" }, o));

  // 1 — Error Rates and the Bayes Classifier
  B({
    id: "aos-ch22-error-rates-bayes",
    chapter: "Chapter 22",
    title: "Error Rates and the Bayes Classifier",
    tagline: "Grade a classifier by how often it is wrong, then write down the rule that is provably wrong least often.",
    sections: [
      { h: "The classification problem", body:
        "<p>Classification means predicting a discrete outcome $Y$ from an input $X$. The book also calls this supervised learning, discrimination, or pattern recognition. We have data $(X_1,Y_1),\\dots,(X_n,Y_n)$ where each $X_i = (X_{i1},\\dots,X_{id})$ is a $d$-dimensional vector (so $d$ is the number of measured features) and each $Y_i$ takes values in a finite set $\\mathcal{Y}$. A <strong>classification rule</strong> is a function $h$ that maps an input to a predicted label; when a new $X$ arrives we predict $Y$ to be $h(X)$.</p>" +
        "<p>The book pairs the statistics vocabulary with the computer-science vocabulary: classification = supervised learning, covariates = features, the classifier $h$ = a hypothesis, and estimation = learning. The plain meaning is the same throughout.</p>" },
      { h: "True error rate and training error rate", body:
        "<p><strong>Definition 22.3.</strong> The <strong>true error rate</strong> of a classifier $h$ is the probability that it labels a fresh observation incorrectly:</p>" +
        "<p>$L(h) = \\mathbb{P}(h(X) \\neq Y).$</p>" +
        "<p>We cannot compute this because we do not know the true distribution, so we estimate it with the <strong>empirical error rate</strong> (also called the <strong>training error rate</strong>) — the fraction of the training data the rule gets wrong:</p>" +
        "<p>$\\widehat{L}_n(h) = \\dfrac{1}{n}\\sum_{i=1}^n I(h(X_i) \\neq Y_i),$</p>" +
        "<p>where $I(\\cdot)$ is the indicator function: it equals $1$ when the statement inside is true and $0$ otherwise. For simplicity the book uses the error rate itself as the loss function throughout the chapter.</p>" },
      { h: "The regression function and Bayes' theorem", body:
        "<p>Specialize to two classes, $\\mathcal{Y}=\\{0,1\\}$. Define the <strong>regression function</strong> $r(x) = \\mathbb{E}(Y|X=x) = \\mathbb{P}(Y=1|X=x)$ — the chance the label is $1$ given the input. Bayes' theorem rewrites it in terms of the class densities (Eq. 22.3):</p>" +
        "<p>$r(x) = \\dfrac{\\pi f_1(x)}{\\pi f_1(x) + (1-\\pi) f_0(x)},$</p>" +
        "<p>where $f_0(x) = f(x|Y=0)$ is the density of the inputs in class $0$, $f_1(x) = f(x|Y=1)$ is the density in class $1$, and $\\pi = \\mathbb{P}(Y=1)$ is the overall fraction of class-$1$ cases (the prior).</p>" },
      { h: "The Bayes classification rule", body:
        "<p><strong>Definition 22.4.</strong> The <strong>Bayes classification rule</strong> $h^*$ predicts the label with the larger posterior probability:</p>" +
        "<p>$h^*(x) = 1$ if $r(x) \\gt \\tfrac{1}{2}$, and $0$ otherwise.</p>" +
        "<p>The set of inputs where the two classes are exactly tied, $\\mathcal{D}(h) = \\{x : \\mathbb{P}(Y=1|X=x) = \\mathbb{P}(Y=0|X=x)\\}$, is the <strong>decision boundary</strong>. The book warns that the Bayes rule has nothing to do with Bayesian inference — it can be estimated by frequentist or Bayesian methods alike. Two equivalent forms are useful: $h^*(x)=1$ when $\\mathbb{P}(Y=1|X=x) \\gt \\mathbb{P}(Y=0|X=x)$ (Eq. 22.5), and $h^*(x)=1$ when $\\pi f_1(x) \\gt (1-\\pi)f_0(x)$ (Eq. 22.6).</p>" +
        "<p><strong>Theorem 22.5.</strong> The Bayes rule is optimal: for any other classification rule $h$, $L(h^*) \\le L(h)$. No rule has a smaller true error rate.</p>" },
      { h: "Three ways to approximate the Bayes rule", body:
        "<p>The Bayes rule depends on unknown quantities, so we approximate it from data. The book lists three approaches:</p>" +
        "<ul class=\"steps\">" +
        "<li><strong>Empirical risk minimization:</strong> fix a set of classifiers $\\mathcal{H}$ and pick the $\\widehat{h}\\in\\mathcal{H}$ that minimizes an estimate of $L(h)$.</li>" +
        "<li><strong>Regression:</strong> estimate $r$ by $\\widehat{r}$, then set $\\widehat{h}(x)=1$ if $\\widehat{r}(x)\\gt\\tfrac12$ and $0$ otherwise.</li>" +
        "<li><strong>Density estimation:</strong> estimate $f_0$ from the $Y=0$ cases, $f_1$ from the $Y=1$ cases, and $\\widehat{\\pi}=n^{-1}\\sum_i Y_i$; plug into Eq. 22.3 to get $\\widehat{r}$ and threshold at $\\tfrac12$.</li>" +
        "</ul>" +
        "<p><strong>Theorem 22.6</strong> generalizes to $K$ classes, $\\mathcal{Y}=\\{1,\\dots,K\\}$: the optimal rule is $h(x) = \\operatorname{argmax}_k \\mathbb{P}(Y=k|X=x) = \\operatorname{argmax}_k \\pi_k f_k(x)$, where $\\operatorname{argmax}_k$ means \"the value of $k$ that makes the expression largest.\"</p>" }
    ],
    takeaways: [
      "True error rate L(h) = P(h(X) != Y); we estimate it by the training error rate, the fraction misclassified on the data.",
      "For two classes the regression function r(x) = P(Y=1|X=x) drives everything.",
      "The Bayes rule predicts 1 when r(x) > 1/2 and is optimal: no rule has lower true error (Theorem 22.5).",
      "We approximate the Bayes rule by empirical risk minimization, regression, or density estimation."
    ]
  });

  window.CODEVIZ["aos-ch22-error-rates-bayes"] = { charts: [ {
    type: "scatter",
    title: "Figure 22.1 — linear decision boundary schematic",
    interpret: "The book's fake-data figure has 100 points and a line that perfectly separates the two classes: above the line is classified 0, below it classified 1.",
    xlabel: "x1", ylabel: "x2",
    groups: [
      { name: "Y = 0 (squares)", color: "#4ea1ff", points: [[0.6,1.5],[1.0,1.8],[1.6,2.3],[2.4,2.9],[3.2,3.3],[3.8,3.8]] },
      { name: "Y = 1 (triangles)", color: "#ffb454", points: [[0.5,0.2],[1.1,0.5],[1.7,0.9],[2.3,1.2],[3.0,1.6],[3.6,2.0]] }
    ],
    lines: [ { color: "#7ee787", dash: true, points: [[0.3,0.9],[4.0,3.1]] } ]
  } ],
    code: "import numpy as np\n\n# Bayes classifier for two classes: predict 1 iff pi*f1(x) > (1-pi)*f0(x).\ndef bayes_predict(f0, f1, pi, x):\n    post1 = pi * f1(x) / (pi * f1(x) + (1-pi) * f0(x))\n    return (post1 > 0.5).astype(int), post1\n\n# Training error: Lhat_n(h) = n^-1 sum I(h(X_i) != Y_i).\ndef error_rate(y_true, y_pred):\n    return np.mean(np.asarray(y_true) != np.asarray(y_pred))\n\n# Heart-data linear boundary in Example 22.2/22.8 misclassifies 141 of 462.\nprint(141/462)  # 0.3052, reported as .31"
  };

  // 2 — Gaussian and Linear Classifiers (LDA and QDA)
  B({
    id: "aos-ch22-gaussian-lda-qda",
    chapter: "Chapter 22",
    title: "Gaussian Classifiers LDA and QDA",
    tagline: "Assume each class is a Gaussian bump, plug into the Bayes rule, and the decision boundary comes out quadratic or, with equal variances, linear.",
    sections: [
      { h: "Model each class as a Gaussian", body:
        "<p>The simplest density-estimation strategy assumes a parametric model for the class densities. With $\\mathcal{Y}=\\{0,1\\}$, assume both $f_0$ and $f_1$ are multivariate Gaussians:</p>" +
        "<p>$f_k(x) = \\dfrac{1}{(2\\pi)^{d/2}|\\Sigma_k|^{1/2}} \\exp\\left\\{ -\\tfrac{1}{2}(x-\\mu_k)^T \\Sigma_k^{-1}(x-\\mu_k) \\right\\}, \\quad k=0,1,$</p>" +
        "<p>so $X|Y=0 \\sim N(\\mu_0,\\Sigma_0)$ and $X|Y=1 \\sim N(\\mu_1,\\Sigma_1)$. Here $\\mu_k$ is the mean vector of class $k$, $\\Sigma_k$ is its covariance matrix, and $|\\Sigma_k|$ is that matrix's determinant.</p>" },
      { h: "QDA — quadratic discriminant analysis", body:
        "<p><strong>Theorem 22.7.</strong> Under these two Gaussians the Bayes rule predicts $1$ when</p>" +
        "<p>$r_1^2 \\lt r_0^2 + 2\\log\\left(\\dfrac{\\pi_1}{\\pi_0}\\right) + \\log\\left(\\dfrac{|\\Sigma_0|}{|\\Sigma_1|}\\right),$</p>" +
        "<p>where $r_i^2 = (x-\\mu_i)^T \\Sigma_i^{-1}(x-\\mu_i)$ is the <strong>Mahalanobis distance</strong> from $x$ to class $i$ (Eq. 22.11). An equivalent form is $h^*(x) = \\operatorname{argmax}_k \\delta_k(x)$ with the discriminant</p>" +
        "<p>$\\delta_k(x) = -\\tfrac{1}{2}\\log|\\Sigma_k| - \\tfrac{1}{2}(x-\\mu_k)^T \\Sigma_k^{-1}(x-\\mu_k) + \\log\\pi_k.$</p>" +
        "<p>Because the boundary is quadratic in $x$, this is called <strong>quadratic discriminant analysis (QDA)</strong>. In practice we plug in sample estimates: $\\widehat{\\pi}_k$ (class fractions), $\\widehat{\\mu}_k$ (class means), and $S_k$ (class sample covariances).</p>" },
      { h: "LDA — linear discriminant analysis", body:
        "<p>If we assume the two classes share one covariance, $\\Sigma_0 = \\Sigma_1 = \\Sigma$, the quadratic term cancels and the boundary becomes linear. The discriminant simplifies (Eq. 22.14) to</p>" +
        "<p>$\\delta_k(x) = x^T \\Sigma^{-1}\\mu_k - \\tfrac{1}{2}\\mu_k^T \\Sigma^{-1}\\mu_k + \\log\\pi_k,$</p>" +
        "<p>and we predict $1$ when $\\delta_1(x) \\gt \\delta_0(x)$. The shared covariance is estimated by pooling the two class estimates, $S = (n_0 S_0 + n_1 S_1)/(n_0+n_1)$, where $n_0$ and $n_1$ count the cases in each class. Since the boundary $\\{x : \\delta_0(x)=\\delta_1(x)\\}$ is linear, this method is <strong>linear discrimination analysis (LDA)</strong>.</p>" },
      { h: "Worked example — South African heart disease", body:
        "<p><strong>Example 22.8.</strong> The Coronary Risk-Factor Study (CORIS) has $462$ South African males; $Y=1$ marks coronary heart disease. Using two covariates (systolic blood pressure and cumulative tobacco), LDA produced this table:</p>" +
        "<table class=\"extable\"><thead><tr><th></th><th>classified 0</th><th>classified 1</th></tr></thead>" +
        "<tbody>" +
        "<tr><td class=\"row-h\">y = 0</td><td class=\"num\">277</td><td class=\"num\">25</td></tr>" +
        "<tr><td class=\"row-h\">y = 1</td><td class=\"num\">116</td><td class=\"num\">44</td></tr>" +
        "</tbody></table>" +
        "<ul class=\"steps\">" +
        "<li>Misclassified = the off-diagonal cells = $25 + 116 = 141$.</li>" +
        "<li>Observed misclassification rate $= 141/462 = .31$.</li>" +
        "<li>Using all nine covariates instead of two reduces the error rate to $.27$.</li>" +
        "</ul>" +
        "<p>QDA on the same two covariates gives $30$ false positives and $113$ false negatives, so $143/462 \\approx .31$ — about the same. With all covariates QDA reaches $.26$. The book concludes there is little advantage to QDA over LDA here.</p>" +
        "<table class=\"extable\"><thead><tr><th></th><th>classified 0</th><th>classified 1</th></tr></thead><tbody><tr><td class=\"row-h\">y = 0</td><td class=\"num\">272</td><td class=\"num\">30</td></tr><tr><td class=\"row-h\">y = 1</td><td class=\"num\">113</td><td class=\"num\">47</td></tr></tbody></table>" },
      { h: "Many classes", body:
        "<p><strong>Theorem 22.9</strong> generalizes to $K$ classes: if each $f_k$ is Gaussian, $h(x) = \\operatorname{argmax}_k \\delta_k(x)$ with the same quadratic discriminant $\\delta_k(x) = -\\tfrac12\\log|\\Sigma_k| - \\tfrac12(x-\\mu_k)^T\\Sigma_k^{-1}(x-\\mu_k) + \\log\\pi_k$ (Eq. 22.16). If all covariances are equal it reduces to the linear discriminant $\\delta_k(x) = x^T\\Sigma^{-1}\\mu_k - \\tfrac12\\mu_k^T\\Sigma^{-1}\\mu_k + \\log\\pi_k$ (Eq. 22.17).</p>" }
    ],
    takeaways: [
      "Model each class as a multivariate Gaussian, then plug into the Bayes rule.",
      "Separate covariances give a quadratic boundary (QDA); a shared covariance gives a linear boundary (LDA).",
      "On the heart data with two covariates, LDA misclassifies 141/462 = .31; QDA gives 143/462 = .31 — nearly identical.",
      "Classify by argmax of a discriminant delta_k(x) built from the class mean, covariance, and prior."
    ]
  });
  window.CODEVIZ["aos-ch22-gaussian-lda-qda"] = { charts: [ {
    type: "confusion",
    title: "Example 22.8 — LDA confusion table (heart data, 2 covariates)",
    interpret: "The 141 off-diagonal cases (25 false positives + 116 false negatives) give the .31 error rate; most errors are class-1 cases called 0.",
    labels: ["0", "1"],
    matrix: [[277, 25], [116, 44]]
  }, {
    type: "confusion",
    title: "Example 22.8 — QDA confusion table (heart data, 2 covariates)",
    interpret: "QDA has 143 off-diagonal cases (30 + 113), also about .31, so the extra quadratic boundary gives little gain here.",
    labels: ["0", "1"],
    matrix: [[272, 30], [113, 47]]
  } ],
    code: "import numpy as np\nfrom sklearn.discriminant_analysis import LinearDiscriminantAnalysis, QuadraticDiscriminantAnalysis\nfrom sklearn.metrics import confusion_matrix\n\n# X2 contains systolic blood pressure and cumulative tobacco; y is 0/1 CHD.\nlda = LinearDiscriminantAnalysis().fit(X2, y)\nqda = QuadraticDiscriminantAnalysis().fit(X2, y)\nprint(confusion_matrix(y, lda.predict(X2)))\n# [[277, 25], [116, 44]]; (25+116)/462 = .31\nprint(confusion_matrix(y, qda.predict(X2)))\n# [[272, 30], [113, 47]]; (30+113)/462 = .31\n\n# With all 9 covariates: LDA error .27; QDA error .26 (book)."
  };

  // 3 — Linear and Logistic Regression for Classification
  B({
    id: "aos-ch22-linear-logistic-regression",
    chapter: "Chapter 22",
    title: "Linear and Logistic Regression for Classification",
    tagline: "Estimate the chance of class 1 directly with a regression instead of modeling the inputs, then threshold at one half.",
    sections: [
      { h: "Classify by estimating the regression function", body:
        "<p>A more direct approach skips the class densities $f_k$ and estimates the regression function $r(x) = \\mathbb{E}(Y|X=x)$ instead. With $\\mathcal{Y}=\\{0,1\\}$, $r(x) = \\mathbb{P}(Y=1|X=x)$. Once we have an estimate $\\widehat{r}$, the rule is (Eq. 22.22) $\\widehat{h}(x) = 1$ if $\\widehat{r}(x)\\gt\\tfrac12$ and $0$ otherwise.</p>" },
      { h: "Linear regression as a classifier", body:
        "<p>The simplest model is plain linear regression, $Y = r(x)+\\epsilon = \\beta_0 + \\sum_{j=1}^d \\beta_j X_j + \\epsilon$ with $\\mathbb{E}(\\epsilon)=0$ (Eq. 22.23). The book is candid that this model cannot literally be correct, since a linear fit does not force the prediction to land at $0$ or $1$ — yet it can still produce a decent classifier. Stacking the data into the matrix $\\mathbf{X}$ (with a leading column of ones) and vector $\\mathbf{Y}$, the least squares estimate is $\\widehat{\\beta} = (\\mathbf{X}^T\\mathbf{X})^{-1}\\mathbf{X}^T Y$, and we classify with $\\widehat{r}(x) = \\widehat{\\beta}_0 + \\sum_j \\widehat{\\beta}_j x_j$ thresholded at $\\tfrac12$.</p>" },
      { h: "Logistic regression", body:
        "<p>A better-behaved alternative is logistic regression, which keeps the estimated probability between $0$ and $1$ (Eq. 22.24):</p>" +
        "<p>$r(x) = \\mathbb{P}(Y=1|X=x) = \\dfrac{e^{\\beta_0 + \\sum_j \\beta_j x_j}}{1 + e^{\\beta_0 + \\sum_j \\beta_j x_j}}.$</p>" +
        "<p>The coefficients $\\beta$ are estimated by maximum likelihood, obtained numerically (there is no closed form). The same threshold-at-$\\tfrac12$ rule then classifies.</p>" },
      { h: "Worked numbers and richer models", body:
        "<p><strong>Example 22.11.</strong> On the heart disease data, logistic regression gives an error rate of $.27$, while linear regression gives $.26$. We can do better with a richer model, for instance adding interaction terms (Eq. 22.25): $\\operatorname{logit}\\,\\mathbb{P}(Y=1|X=x) = \\beta_0 + \\sum_j \\beta_j x_j + \\sum_{j,k}\\beta_{jk}x_j x_k$. More generally we add terms up to some order $r$; larger $r$ fits better but invites a bias-variance tradeoff. <strong>Example 22.12:</strong> using the order-$2$ model on the heart data drops the error rate to $.22$.</p>" +
        "<table class=\"extable\"><thead><tr><th>model</th><th>error rate</th></tr></thead>" +
        "<tbody>" +
        "<tr><td class=\"row-h\">linear regression</td><td class=\"num\">.26</td></tr>" +
        "<tr><td class=\"row-h\">logistic regression</td><td class=\"num\">.27</td></tr>" +
        "<tr><td class=\"row-h\">logistic with order-2 terms</td><td class=\"num\">.22</td></tr>" +
        "</tbody></table>" }
    ],
    takeaways: [
      "Estimate r(x) = P(Y=1|X=x) directly, then predict 1 when r-hat(x) > 1/2.",
      "Linear regression can't really fit a 0/1 outcome but often classifies acceptably.",
      "Logistic regression keeps probabilities in [0,1] and is fit by numerical maximum likelihood.",
      "On the heart data: linear .26, logistic .27, logistic with order-2 interaction terms .22."
    ]
  });
  window.CODEVIZ["aos-ch22-linear-logistic-regression"] = { charts: [ {
    type: "bars",
    title: "Examples 22.11-22.12 — heart-data error rates by model",
    interpret: "Adding second-order interaction terms to logistic regression cuts the error from .27 to .22 — the richer model fits the data better.",
    labels: ["linear", "logistic", "logistic order-2"],
    values: [0.26, 0.27, 0.22]
  } ],
    code: "import numpy as np\nfrom sklearn.linear_model import LinearRegression, LogisticRegression\nfrom sklearn.preprocessing import PolynomialFeatures\nfrom sklearn.pipeline import make_pipeline\n\n# Classify by estimating r(x)=P(Y=1|X=x), then thresholding at 1/2.\nlin = LinearRegression().fit(X, y)\ny_lin = (lin.predict(X) > 0.5).astype(int)\nprint(np.mean(y_lin != y))        # book: .26 on the heart data\n\nlogit = LogisticRegression(max_iter=1000).fit(X, y)\nprint(np.mean(logit.predict(X) != y))  # book: .27\n\norder2 = make_pipeline(PolynomialFeatures(2, include_bias=False),\n                       LogisticRegression(max_iter=2000)).fit(X, y)\nprint(np.mean(order2.predict(X) != y)) # book: .22 for model (22.25), r=2"
  };

  // 4 — Relationship Between Logistic Regression and LDA
  B({
    id: "aos-ch22-logistic-vs-lda",
    chapter: "Chapter 22",
    title: "Logistic Regression Versus LDA",
    tagline: "Both produce a linear boundary; they differ only in whether they bother to model the distribution of the inputs.",
    sections: [
      { h: "Both give a linear log-odds", body:
        "<p>LDA and logistic regression are almost the same thing. If each class is Gaussian with the same covariance $\\Sigma$, the earlier LDA algebra gives a log-odds that is linear in $x$:</p>" +
        "<p>$\\log\\left(\\dfrac{\\mathbb{P}(Y=1|X=x)}{\\mathbb{P}(Y=0|X=x)}\\right) = \\alpha_0 + \\alpha^T x.$</p>" +
        "<p>Logistic regression assumes, directly, that $\\log\\left(\\dfrac{\\mathbb{P}(Y=1|X=x)}{\\mathbb{P}(Y=0|X=x)}\\right) = \\beta_0 + \\beta^T x$. These are the same model: both lead to a decision boundary that is linear in $x$. The difference is only in how the parameters are estimated.</p>" },
      { h: "Joint likelihood versus conditional likelihood", body:
        "<p>Write a single observation's joint density as $f(x,y) = f(x|y)f(y) = f(y|x)f(x)$. LDA estimates the <em>whole</em> joint distribution by maximizing (Eq. 22.26)</p>" +
        "<p>$\\prod_i f(x_i,y_i) = \\underbrace{\\prod_i f(x_i|y_i)}_{\\text{Gaussian}} \\; \\underbrace{\\prod_i f(y_i)}_{\\text{Bernoulli}}.$</p>" +
        "<p>Logistic regression instead maximizes only the <em>conditional</em> likelihood $\\prod_i f(y_i|x_i)$ and ignores the second factor (Eq. 22.27):</p>" +
        "<p>$\\prod_i f(x_i,y_i) = \\underbrace{\\prod_i f(y_i|x_i)}_{\\text{logistic}} \\; \\underbrace{\\prod_i f(x_i)}_{\\text{ignored}}.$</p>" },
      { h: "Why logistic is more nonparametric", body:
        "<p>Classification only needs $f(y|x)$, so we do not really need to estimate the whole joint distribution. By leaving the marginal distribution $f(x)$ unspecified, logistic regression is more nonparametric than LDA — an advantage, because it does not commit to the Gaussian assumption on the inputs. In summary: both methods give a linear classifier; LDA estimates the entire joint $f(x,y) = f(x|y)f(y)$, while logistic regression estimates only $f(y|x)$ and does not bother with $f(x)$.</p>" }
    ],
    takeaways: [
      "Under equal-covariance Gaussians, LDA's log-odds is linear in x — exactly logistic regression's assumed form.",
      "They are the same model; they differ only in estimation.",
      "LDA maximizes the full joint likelihood (Gaussian times Bernoulli); logistic maximizes only the conditional likelihood.",
      "Logistic leaves f(x) unspecified, so it is more nonparametric and makes fewer assumptions."
    ]
  });

  // 5 — Density Estimation and Naive Bayes
  B({
    id: "aos-ch22-naive-bayes",
    chapter: "Chapter 22",
    title: "Density Estimation and Naive Bayes",
    tagline: "High-dimensional density estimation is hopeless, so pretend the features are independent and estimate one density per feature.",
    sections: [
      { h: "The density-estimation route and its problem", body:
        "<p>The Bayes rule is $h(x) = \\operatorname{argmax}_k \\pi_k f_k(x)$, so if we can estimate each class prior $\\pi_k$ and each class density $f_k$ we can estimate the rule. Estimating $\\pi_k$ is easy. Estimating $f_k$ is the hard part. We could use a nonparametric density estimator $\\widehat{f}_k$ such as a kernel estimator — but when $x = (x_1,\\dots,x_d)$ is high-dimensional, nonparametric density estimation is unreliable.</p>" },
      { h: "The naive Bayes assumption", body:
        "<p>The fix is to assume the features $X_1,\\dots,X_d$ are independent within each class. Then the joint density factors into a product of one-dimensional densities, $f_k(x_1,\\dots,x_d) = \\prod_{j=1}^d f_{kj}(x_j)$. This turns one hard $d$-dimensional density estimation problem into $d$ easy one-dimensional ones, within each of the $k$ groups. The resulting classifier is the <strong>naive Bayes classifier</strong>. The independence assumption is usually wrong, yet the resulting classifier can still be accurate.</p>" },
      { h: "The naive Bayes algorithm", body:
        "<p>The book summarizes the procedure:</p>" +
        "<ul class=\"steps\">" +
        "<li>For each group $k$, estimate the one-dimensional density $\\widehat{f}_{kj}$ for feature $X_j$, using only the data with $Y_i = k$.</li>" +
        "<li>Form the class density as a product: $\\widehat{f}_k(x) = \\prod_{j=1}^d \\widehat{f}_{kj}(x_j)$.</li>" +
        "<li>Estimate each prior by its frequency: $\\widehat{\\pi}_k = \\dfrac{1}{n}\\sum_{i=1}^n I(Y_i=k)$.</li>" +
        "<li>Classify by $h(x) = \\operatorname{argmax}_k \\widehat{\\pi}_k \\widehat{f}_k(x)$.</li>" +
        "</ul>" +
        "<p>Naive Bayes is especially popular when $x$ is high-dimensional and discrete, because then each $\\widehat{f}_{kj}(x_j)$ is just a simple table of frequencies.</p>" }
    ],
    takeaways: [
      "The Bayes rule needs the class densities f_k, but estimating them in high dimensions is unreliable.",
      "Naive Bayes assumes the features are independent within a class, so f_k factors into a product of 1-D densities.",
      "This replaces one d-dimensional estimation problem with d one-dimensional ones per class.",
      "The independence assumption is usually false yet the classifier often works, and it shines for high-dimensional discrete inputs."
    ]
  });

  // 6 — Trees
  B({
    id: "aos-ch22-trees",
    chapter: "Chapter 22",
    title: "Classification Trees",
    tagline: "Carve the input space into boxes with a sequence of yes-no splits, choosing each split to make the boxes as pure as possible.",
    sections: [
      { h: "What a tree is", body:
        "<p>Trees partition the input space $\\mathcal{X}$ into disjoint pieces and classify each observation by which piece it falls in. The classifier can be drawn as a tree. For illustration take two covariates, $X_1 = $ age and $X_2 = $ blood pressure. Reading the book's tree: if Age $\\ge 50$, classify $Y=1$; if Age $\\lt 50$, look at blood pressure — if systolic blood pressure is $\\lt 100$, classify $Y=1$, otherwise classify $Y=0$. The same rule can be drawn as a partition of the plane into rectangular boxes.</p>" },
      { h: "Splits and impurity", body:
        "<p>Here is how a tree is built. With $\\mathcal{Y}=\\{0,1\\}$ and a single covariate $X$, choose a split point $t$ that divides the real line into $A_1 = (-\\infty,t]$ and $A_2 = (t,\\infty)$. Let $\\widehat{p}_s(j)$ be the proportion of class-$j$ points among those in piece $A_s$ (Eq. 22.28):</p>" +
        "<p>$\\widehat{p}_s(j) = \\dfrac{\\sum_{i=1}^n I(Y_i = j,\\, X_i \\in A_s)}{\\sum_{i=1}^n I(X_i \\in A_s)}.$</p>" +
        "<p>The <strong>impurity</strong> of split $t$ is $I(t) = \\sum_{s=1}^2 \\gamma_s$, where the per-piece impurity is the <strong>Gini index</strong> (Eq. 22.30):</p>" +
        "<p>$\\gamma_s = 1 - \\sum_{j=0}^1 \\widehat{p}_s(j)^2.$</p>" +
        "<p>If a piece $A_s$ contains all $0$'s or all $1$'s then $\\gamma_s = 0$ (perfectly pure); otherwise $\\gamma_s \\gt 0$. We choose the split point $t$ that minimizes the impurity. For $K$ classes the impurity generalizes to $\\gamma_s = 1 - \\sum_{j=1}^k \\widehat{p}_s(j)^2$ (Eq. 22.31).</p>" },
      { h: "Growing, leaves, and overfitting", body:
        "<p>With several covariates, we pick whichever covariate and split give the lowest impurity, and repeat until a stopping rule is met — for example, stop when every piece has fewer than $n_0$ points. The bottom nodes are the <strong>leaves</strong>; each leaf is labeled $0$ or $1$ depending on whether it holds more $Y=0$ or $Y=1$ points. If we keep splitting until each leaf has very few cases we are likely to overfit, so the tree's complexity should be chosen to keep the estimated true error rate low — which is exactly what cross-validation is for.</p>" +
        "<p><strong>Example 22.13.</strong> A classification tree on the heart disease data has a misclassification rate of $.21$. Restricting the tree to use only tobacco and age raises the rate to $.29$. Figure 22.4's two-covariate tree uses these printed split points:</p>" +
        "<table class=\"extable\"><thead><tr><th>node</th><th>split</th><th>left label</th><th>right branch</th></tr></thead><tbody><tr><td class=\"row-h\">root</td><td>age &lt; 31.5</td><td>0</td><td>age ≥ 31.5</td></tr><tr><td class=\"row-h\">left branch</td><td>tobacco &lt; 0.51</td><td>0</td><td>age split</td></tr><tr><td class=\"row-h\">age branch</td><td>age &lt; 50.5</td><td>0</td><td>tobacco split</td></tr><tr><td class=\"row-h\">final branch</td><td>tobacco &lt; 7.47</td><td>0</td><td>1</td></tr></tbody></table>" +
        "<table class=\"extable\"><thead><tr><th>tree</th><th>error rate</th></tr></thead>" +
        "<tbody>" +
        "<tr><td class=\"row-h\">all covariates</td><td class=\"num\">.21</td></tr>" +
        "<tr><td class=\"row-h\">tobacco and age only</td><td class=\"num\">.29</td></tr>" +
        "</tbody></table>" }
    ],
    takeaways: [
      "A tree partitions the input space into boxes via a sequence of single-feature splits.",
      "Each split is scored by impurity; the Gini index gamma = 1 - sum p(j)^2 is zero for a pure piece.",
      "Grow by always taking the lowest-impurity split, stop by a rule, then label each leaf by its majority class.",
      "On the heart data a full tree errs at .21; restricting to tobacco and age raises it to .29."
    ]
  });
  window.CODEVIZ["aos-ch22-trees"] = { charts: [ {
    type: "bars",
    title: "Example 22.13 — tree error rate by covariate set",
    interpret: "The full tree (.21) beats the two-covariate tree (.29): dropping covariates throws away information.",
    labels: ["all covariates", "tobacco + age"],
    values: [0.21, 0.29]
  } ],
    code: "import numpy as np\nfrom sklearn.tree import DecisionTreeClassifier\nfrom sklearn.model_selection import cross_val_score\n\n# Classification tree: split to reduce Gini impurity, then label leaves by majority class.\ntree = DecisionTreeClassifier(criterion='gini', random_state=1).fit(X, y)\nprint(np.mean(tree.predict(X) != y))       # book: .21 with all covariates\n\ntwo = DecisionTreeClassifier(criterion='gini', random_state=1).fit(X[:, [tobacco, age]], y)\nprint(np.mean(two.predict(X[:, [tobacco, age]]) != y))  # book: .29\n# Figure 22.4 two-covariate splits: age 31.5, tobacco .51, age 50.5, tobacco 7.47."
  };

  // 7 — Assessing Error Rates and Choosing a Good Classifier
  B({
    id: "aos-ch22-assessing-error-rates",
    chapter: "Chapter 22",
    title: "Assessing Error Rates and Choosing a Classifier",
    tagline: "Training error fools you because it falls forever as you add complexity; cross-validation and probability bounds estimate the honest error.",
    sections: [
      { h: "Why training error is not enough", body:
        "<p>We want a classifier with a low true error rate $L(h)$. We usually cannot use the training error rate $\\widehat{L}_n(h)$ as an estimate of $L(h)$ because it is biased downward — it understates the true error. <strong>Example 22.14.</strong> Fit a sequence of logistic models of increasing complexity to the heart data (one covariate, then two, up to all nine, then add squared terms). The observed (training) error steadily decreases as the model grows; push far enough and you can drive the training error to zero. But the $10$-fold cross-validation estimate first decreases and then increases — the bias-variance tradeoff in action.</p>" },
      { h: "Cross-validation", body:
        "<p>The idea of <strong>cross-validation</strong> is to hold out some data while fitting. The simplest version splits the data into a <strong>training set</strong> $\\mathcal{T}$ and a <strong>validation set</strong> $\\mathcal{V}$ (often about $10\\%$ held out). Fit $h$ on $\\mathcal{T}$, then estimate the error on the untouched validation set (Eq. 22.32):</p>" +
        "<p>$\\widehat{L}(h) = \\dfrac{1}{m}\\sum_{X_i\\in\\mathcal{V}} I(h(X_i)\\neq Y_i),$</p>" +
        "<p>where $m$ is the size of the validation set.</p>" },
      { h: "K-fold cross-validation", body:
        "<p><strong>K-fold cross-validation</strong> uses the data more efficiently:</p>" +
        "<ul class=\"steps\">" +
        "<li>Randomly split the data into $K$ chunks of roughly equal size (a common choice is $K=10$).</li>" +
        "<li>For each $k$: delete chunk $k$, fit the classifier $\\widehat{h}_{(k)}$ on the rest, then predict the held-out chunk $k$ and record its error $\\widehat{L}_{(k)}$.</li>" +
        "<li>Average the chunk errors (Eq. 22.33): $\\widehat{L}(h) = \\dfrac{1}{K}\\sum_{k=1}^K \\widehat{L}_{(k)}.$</li>" +
        "</ul>" +
        "<p><strong>Example 22.15.</strong> Applying $10$-fold cross-validation to the heart data, the minimum cross-validation error as a function of the number of leaves occurred at six leaves.</p>" +
        "<table class=\"extable\"><thead><tr><th>classifier or fit</th><th class=\"num\">book error</th></tr></thead><tbody><tr><td class=\"row-h\">LDA, 2 covariates</td><td class=\"num\">.31</td></tr><tr><td class=\"row-h\">LDA, 9 covariates</td><td class=\"num\">.27</td></tr><tr><td class=\"row-h\">QDA, 2 covariates</td><td class=\"num\">.31</td></tr><tr><td class=\"row-h\">QDA, 9 covariates</td><td class=\"num\">.26</td></tr><tr><td class=\"row-h\">linear regression classifier</td><td class=\"num\">.26</td></tr><tr><td class=\"row-h\">logistic regression</td><td class=\"num\">.27</td></tr><tr><td class=\"row-h\">logistic, order 2</td><td class=\"num\">.22</td></tr><tr><td class=\"row-h\">classification tree</td><td class=\"num\">.21</td></tr><tr><td class=\"row-h\">tree, tobacco and age</td><td class=\"num\">.29</td></tr></tbody></table>" },
      { h: "Probability inequalities and VC dimension", body:
        "<p>A second route to error estimation uses <strong>probability inequalities</strong>, useful for empirical risk minimization where $\\widehat{h} = \\operatorname{argmin}_{h\\in\\mathcal{H}} \\widehat{L}_n(h)$. Hoeffding's inequality gives $\\mathbb{P}(|\\widehat{p}-p|\\gt\\epsilon) \\le 2e^{-2n\\epsilon^2}$. <strong>Theorem 22.16</strong> (uniform convergence) extends this over a finite $\\mathcal{H}$ with $m$ classifiers: $\\mathbb{P}(\\max_{h\\in\\mathcal{H}}|\\widehat{L}_n(h)-L(h)|\\gt\\epsilon) \\le 2m e^{-2n\\epsilon^2}$, proved by Hoeffding plus the union bound. <strong>Theorem 22.17</strong> turns this into a confidence interval $\\widehat{L}_n(\\widehat{h})\\pm\\epsilon$ with $\\epsilon = \\sqrt{(2/n)\\log(2m/\\alpha)}$ — wider when $\\mathcal{H}$ is bigger, the price of overfitting.</p>" +
        "<p>For infinite $\\mathcal{H}$ (e.g. all linear classifiers) we use <strong>VC dimension</strong>. <strong>Definition 22.20:</strong> the VC dimension of a class of sets is the size of the largest set it can <em>shatter</em> (pick out every subset of). The Vapnik-Chervonenkis theorem (Theorem 22.18) bounds the gap between empirical and true probabilities. <strong>Theorem 22.26:</strong> linear classifiers in $d$ dimensions have VC dimension $d+1$, giving the confidence interval $\\widehat{L}_n(\\widehat{h})\\pm\\epsilon$ with $\\epsilon_n^2 = \\dfrac{32}{n}\\log\\left(\\dfrac{8(n^{d+1}+1)}{\\alpha}\\right)$. The book's examples: half-lines have VC dimension $1$, intervals $2$, half-planes $3$, axis-aligned rectangles $4$.</p>" }
    ],
    takeaways: [
      "Training error is biased downward and falls forever as complexity grows, so it cannot pick a model.",
      "Cross-validation holds out data to estimate true error; K-fold averages the error over K held-out chunks.",
      "On the heart data, 10-fold CV chose a tree with six leaves.",
      "Probability inequalities (Hoeffding, uniform convergence, VC dimension) give confidence intervals for the true error rate."
    ]
  });
  window.CODEVIZ["aos-ch22-assessing-error-rates"] = { charts: [ {
    type: "line",
    title: "Figure 22.5 — training error keeps falling, CV error turns up",
    interpret: "The solid training-error line falls monotonically as terms are added; the dashed cross-validation line dips then rises sharply — the bias-variance tradeoff. (Shape reconstructed from the book's figure.)",
    xlabel: "number of terms in model", ylabel: "error rate",
    series: [
      { name: "observed (training) error", color: "#4ea1ff", points: [[1,0.35],[3,0.31],[5,0.31],[7,0.30],[9,0.28],[11,0.25],[13,0.245],[15,0.245],[17,0.25]] },
      { name: "10-fold cross-validation", color: "#ffb454", points: [[1,0.35],[3,0.30],[5,0.31],[7,0.30],[9,0.28],[11,0.27],[13,0.27],[15,0.345],[17,0.345]] }
    ]
  } ],
    code: "import numpy as np\nfrom sklearn.model_selection import KFold, cross_val_score\nfrom sklearn.linear_model import LogisticRegression\nfrom sklearn.tree import DecisionTreeClassifier\n\n# K-fold CV estimate: average the held-out error over K chunks; book uses K=10.\ncv = KFold(n_splits=10, shuffle=True, random_state=1)\nmodel = LogisticRegression(max_iter=1000)\nerr = 1 - cross_val_score(model, X, y, cv=cv, scoring='accuracy')\nprint(err.mean())  # Figure 22.5: CV error falls, then rises with complexity\n\n# Example 22.15: choose tree size by 10-fold CV; minimum occurred at six leaves.\nfor leaves in range(2, 12):\n    clf = DecisionTreeClassifier(max_leaf_nodes=leaves, random_state=1)\n    cv_err = 1 - cross_val_score(clf, X, y, cv=cv, scoring='accuracy').mean()\n    print(leaves, cv_err)  # best in book: 6 leaves"
  };

  // 8 — Support Vector Machines
  B({
    id: "aos-ch22-svm",
    chapter: "Chapter 22",
    title: "Support Vector Machines",
    tagline: "Among all hyperplanes that separate the two classes, pick the one that sits as far as possible from the nearest points.",
    sections: [
      { h: "Setup and linear separability", body:
        "<p>A support vector machine is a class of linear classifiers. Here it is convenient to relabel the two classes as $-1$ and $+1$ instead of $0$ and $1$. A linear classifier is $h(x) = \\operatorname{sign}(H(x))$ where $H(x) = a_0 + \\sum_{i=1}^d a_i x_i$ and $\\operatorname{sign}(z)$ is $-1$, $0$, or $+1$ as $z$ is negative, zero, or positive. The data are <strong>linearly separable</strong> if some hyperplane perfectly splits the two classes.</p>" +
        "<p><strong>Lemma 22.27.</strong> The data can be separated by a hyperplane if and only if there is an $H(x) = a_0 + \\sum_i a_i x_i$ with $Y_i H(x_i) \\ge 1$ for all $i$ (Eq. 22.39) — each point is on the correct side with a margin of at least one.</p>" },
      { h: "The maximum margin hyperplane", body:
        "<p>When the data are separable there are many separating hyperplanes. Which to choose? Intuitively, the one furthest from the data — the one that maximizes the distance to the closest point. This is the <strong>maximum margin hyperplane</strong>; the margin is the distance from the hyperplane to the nearest point, and the points lying on the boundary of the margin are the <strong>support vectors</strong>.</p>" +
        "<p><strong>Theorem 22.28.</strong> The separating hyperplane $\\widehat{H}(x) = \\widehat{a}_0 + \\sum_i \\widehat{a}_i x_i$ that maximizes the margin is found by minimizing $\\tfrac{1}{2}\\sum_{j=1}^d a_j^2$ subject to $Y_i H(x_i)\\ge 1$ for all $i$. This is a quadratic programming problem.</p>" },
      { h: "The dual form and support vectors", body:
        "<p>Writing $\\langle X_i,X_k\\rangle = X_i^T X_k$ for the inner product of two inputs, <strong>Theorem 22.29</strong> gives the optimal coefficients as $\\widehat{a}_j = \\sum_{i=1}^n \\widehat{\\alpha}_i Y_i X_j(i)$, where the vector $\\widehat{\\alpha}$ maximizes (Eq. 22.40)</p>" +
        "<p>$\\sum_{i=1}^n \\alpha_i - \\tfrac{1}{2}\\sum_{i=1}^n\\sum_{k=1}^n \\alpha_i\\alpha_k Y_i Y_k \\langle X_i,X_k\\rangle$</p>" +
        "<p>subject to $\\alpha_i \\ge 0$ and $\\sum_i \\alpha_i Y_i = 0$. The points $X_i$ with $\\widehat{\\alpha}_i \\neq 0$ are the support vectors, and $\\widehat{H}$ can be written purely in terms of inner products: $\\widehat{H}(x) = \\widehat{a}_0 + \\sum_{i=1}^n \\widehat{\\alpha}_i Y_i \\langle x,X_i\\rangle$. This inner-product form is exactly what makes kernelization possible.</p>" },
      { h: "Allowing overlap with slack variables", body:
        "<p>If no perfect linear separator exists, we allow some points to violate the margin by replacing the condition $Y_i H(x_i)\\ge 1$ with $Y_i H(x_i)\\ge 1-\\xi_i$, $\\xi_i\\ge 0$ (Eq. 22.41). The $\\xi_i$ are <strong>slack variables</strong>. We maximize the same objective subject to $0\\le\\xi_i\\le c$ and $\\sum_i\\alpha_i Y_i = 0$, where the constant $c$ is a tuning parameter that controls how much overlap is allowed.</p>" }
    ],
    takeaways: [
      "SVMs relabel classes as -1/+1 and use a linear rule h(x) = sign(H(x)).",
      "Among separating hyperplanes, the SVM picks the one with the largest margin to the nearest points (the support vectors).",
      "The maximum-margin hyperplane is a quadratic program; its dual depends on the data only through inner products <X_i, X_k>.",
      "Slack variables xi_i (with tuning constant c) let the SVM tolerate overlap when no perfect separator exists."
    ]
  });

  // 9 — Kernelization
  B({
    id: "aos-ch22-kernelization",
    chapter: "Chapter 22",
    title: "Kernelization",
    tagline: "Map the inputs into a higher-dimensional space where a straight boundary suffices, but compute only inner products via a kernel.",
    sections: [
      { h: "The trick", body:
        "<p><strong>Kernelization</strong> improves a simple classifier by mapping the input $X$ from its space $\\mathcal{X}$ into a higher-dimensional space $\\mathcal{Z}$ and applying the classifier there. A linear classifier in the bigger space corresponds to a nonlinear classifier in the original space, so we get a richer set of classifiers while keeping linear-classifier convenience. This is akin to making linear regression flexible with polynomials.</p>" },
      { h: "The standard example", body:
        "<p>The book's example: $x = (x_1,x_2)$ with the two classes separable only by an ellipse. Define the mapping $z = (z_1,z_2,z_3) = \\phi(x) = (x_1^2, \\sqrt{2}\\,x_1 x_2, x_2^2)$, sending $\\mathcal{X}=\\mathbb{R}^2$ into $\\mathcal{Z}=\\mathbb{R}^3$. In $\\mathcal{Z}$ the classes become separable by a linear boundary. The drawback: expanding the dimension can blow up the computation — with $d=256$ and all fourth-order terms, $\\phi(x)$ would have $183{,}181{,}376$ components.</p>" },
      { h: "Computing inner products without the mapping", body:
        "<p>Two facts spare us this cost. First, many classifiers (like the SVM) need only the inner products between points, not the points themselves. Second, in the example the inner product in $\\mathcal{Z}$ collapses to a function of the original inner product:</p>" +
        "<p>$\\langle z,\\tilde{z}\\rangle = \\langle \\phi(x),\\phi(\\tilde{x})\\rangle = (\\langle x,\\tilde{x}\\rangle)^2 \\equiv K(x,\\tilde{x}).$</p>" +
        "<p>So we can compute $\\langle z,\\tilde{z}\\rangle$ without ever forming $Z = \\phi(X)$. We never need to construct $\\phi$ at all — we only specify a <strong>kernel</strong> $K(x,\\tilde{x})$ that corresponds to $\\langle\\phi(x),\\phi(\\tilde{x})\\rangle$ for some $\\phi$.</p>" },
      { h: "Mercer's theorem and common kernels", body:
        "<p>When does a function $K$ correspond to some $\\phi$? <strong>Mercer's theorem</strong> says, roughly, that if $K$ is positive definite — meaning $\\iint K(x,y)f(x)f(y)\\,dx\\,dy \\ge 0$ for square-integrable $f$ — then such a $\\phi$ exists. Common kernels are:</p>" +
        "<ul class=\"steps\">" +
        "<li>Polynomial: $K(x,\\tilde{x}) = (\\langle x,\\tilde{x}\\rangle + a)^r$.</li>" +
        "<li>Sigmoid: $K(x,\\tilde{x}) = \\tanh(a\\langle x,\\tilde{x}\\rangle + b)$.</li>" +
        "<li>Gaussian: $K(x,\\tilde{x}) = \\exp(-||x-\\tilde{x}||^2/(2\\sigma^2))$.</li>" +
        "</ul>" +
        "<p>The recipe: wherever the algorithm uses an inner product $\\langle x,\\tilde{x}\\rangle$, replace it with $K(x,\\tilde{x})$.</p>" },
      { h: "Kernelizing SVM and LDA", body:
        "<p>For the SVM we simply replace $\\langle X_i,X_j\\rangle$ with $K(X_i,X_j)$ in the dual objective (Eq. 22.43), $\\sum_i \\alpha_i - \\tfrac12\\sum_i\\sum_k \\alpha_i\\alpha_k Y_i Y_k K(X_i,X_j)$, and the hyperplane becomes $\\widehat{H}(x) = \\widehat{a}_0 + \\sum_i \\widehat{\\alpha}_i Y_i K(X,X_i)$. Fisher's LDA can be kernelized the same way: replacing $X_i$ with $\\phi(X_i)$ and re-expressing the Rayleigh-coefficient objective in inner products, everything reduces to kernel evaluations and we maximize $J(\\alpha) = (\\alpha^T M\\alpha)/(\\alpha^T N\\alpha)$, with the projection $U = \\sum_i \\alpha_i K(x_i,x)$.</p>" }
    ],
    takeaways: [
      "Map inputs to a higher-dimensional space so a linear boundary there is a nonlinear boundary in the original space.",
      "The example phi(x) = (x1^2, sqrt(2) x1 x2, x2^2) turns an elliptical boundary into a straight one.",
      "We never build phi: a kernel K(x, x~) computes the inner product directly; Mercer's theorem says positive-definite K's are valid.",
      "Common kernels: polynomial, sigmoid, Gaussian. Kernelize by swapping every inner product for K."
    ]
  });

  // 10 — Other Classifiers
  B({
    id: "aos-ch22-other-classifiers",
    chapter: "Chapter 22",
    title: "Other Classifiers",
    tagline: "A quick tour of nearest neighbors, bagging, boosting, and neural networks.",
    sections: [
      { h: "k-nearest-neighbors", body:
        "<p>The <strong>k-nearest-neighbors</strong> classifier is very simple. Given a point $x$, find the $k$ data points closest to $x$, and classify $x$ by the majority vote of those $k$ neighbors. Ties can be broken randomly. The parameter $k$ can be chosen by cross-validation.</p>" },
      { h: "Bagging", body:
        "<p><strong>Bagging</strong> reduces the variability of a classifier; it helps most for highly nonlinear classifiers such as trees. Draw $B$ bootstrap samples from the data; the $b$-th sample yields a classifier $h_b$. The final classifier averages their votes:</p>" +
        "<p>$\\widehat{h}(x) = 1$ if $\\dfrac{1}{B}\\sum_{b=1}^B h_b(x) \\ge \\tfrac{1}{2}$, and $0$ otherwise.</p>" },
      { h: "Boosting and AdaBoost", body:
        "<p><strong>Boosting</strong> starts with a simple classifier and gradually improves it by refitting the data with higher weight given to the misclassified points. With $Y_i\\in\\{-1,1\\}$ and each $h(x)\\in\\{-1,1\\}$, the original version, <strong>AdaBoost</strong>, runs:</p>" +
        "<ul class=\"steps\">" +
        "<li>Set the weights $w_i = 1/n$ for all $i$.</li>" +
        "<li>For $j=1,\\dots,J$: fit a classifier $h_j$ using weights $w_1,\\dots,w_n$.</li>" +
        "<li>Compute the weighted error $\\widehat{L}_j = \\dfrac{\\sum_i w_i I(Y_i\\neq h_j(X_i))}{\\sum_i w_i}$.</li>" +
        "<li>Set $\\alpha_j = \\log((1-\\widehat{L}_j)/\\widehat{L}_j)$.</li>" +
        "<li>Update the weights: $w_i \\leftarrow w_i\\, e^{\\alpha_j I(Y_i\\neq h_j(X_i))}$ (misclassified points get heavier).</li>" +
        "</ul>" +
        "<p>The final classifier is $\\widehat{h}(x) = \\operatorname{sign}\\left(\\sum_{j=1}^J \\alpha_j h_j(x)\\right)$. Whereas bagging reduces variance, boosting reduces bias — it begins with a simple, highly biased classifier and gradually shrinks the bias. Its drawback is that the final classifier is quite complicated.</p>" },
      { h: "Neural networks", body:
        "<p><strong>Neural networks</strong> are regression models of the form $Y = \\beta_0 + \\sum_{j=1}^p \\beta_j \\sigma(\\alpha_0 + \\alpha^T X)$, where $\\sigma$ is a smooth function, often $\\sigma(v) = e^v/(1+e^v)$. This is really just a nonlinear regression model. Neural nets were fashionable for a time but pose computational difficulties: the least squares fit often has multiple minima, and the number of terms $p$ acts as a smoothing parameter with the usual bias-variance balancing problem.</p>" }
    ],
    takeaways: [
      "k-nearest-neighbors classifies x by the majority vote of its k closest points; choose k by cross-validation.",
      "Bagging averages classifiers fit to bootstrap samples to cut variance, helping unstable methods like trees.",
      "Boosting (AdaBoost) reweights misclassified points each round and reduces bias; the final rule is a weighted sign vote.",
      "Neural networks are nonlinear regressions with a smooth sigmoid; flexible but plagued by multiple minima and tuning p."
    ]
  });
  window.CODEVIZ["aos-ch22-other-classifiers"] = { charts: [ {
    type: "scatter",
    title: "k-nearest-neighbors majority vote schematic",
    interpret: "For a new point x, the classifier looks at the k closest training points and predicts the majority class; the book says k is chosen by cross-validation.",
    xlabel: "x1", ylabel: "x2",
    groups: [
      { name: "class 0", color: "#4ea1ff", points: [[0.7,1.1],[1.0,1.4],[1.2,0.9],[1.5,1.3],[1.8,1.0]] },
      { name: "class 1", color: "#ffb454", points: [[2.2,2.0],[2.5,2.4],[2.8,2.1],[3.0,2.7],[3.3,2.3]] },
      { name: "new x", color: "#7ee787", points: [[2.05,1.75]] }
    ]
  } ],
    code: "import numpy as np\nfrom sklearn.neighbors import KNeighborsClassifier\nfrom sklearn.ensemble import BaggingClassifier, AdaBoostClassifier\nfrom sklearn.model_selection import cross_val_score\n\n# k-nearest neighbors: classify by majority vote among the k closest training points.\nfor k in [1, 3, 5, 9, 15]:\n    clf = KNeighborsClassifier(n_neighbors=k)\n    cv_error = 1 - cross_val_score(clf, X, y, cv=10, scoring='accuracy').mean()\n    print(k, cv_error)  # choose k by cross-validation (book's recommendation)\n\n# Bagging averages bootstrap classifiers; boosting reweights errors.\nbag = BaggingClassifier(n_estimators=100, random_state=1).fit(X, y)\nboost = AdaBoostClassifier(n_estimators=100, random_state=1).fit(X, y)"
  };

})();
