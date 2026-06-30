/* "All of Statistics" (Larry Wasserman) — Chapter 13: Linear and Logistic Regression
   Self-registering IIFE fragment. One lesson per key point. */
(function () {
  window.LESSONS = window.LESSONS || [];
  window.CODEVIZ = window.CODEVIZ || {};
  const M = "All of Statistics";
  const B = (o) => window.LESSONS.push(Object.assign({ module: M, template: "book", book: "All of Statistics" }, o));

  // 1) Simple linear regression
  B({
    id: "aos-ch13-simple-linear-regression",
    chapter: "Chapter 13",
    title: "Simple Linear Regression",
    tagline: "Regression studies how a response Y depends on a covariate X; the simple version assumes the relationship is a straight line.",
    sections: [
      {
        h: "What regression is",
        body: "<p>The author opens by saying regression is a way of studying the relationship between a $\\textbf{response variable}$ $Y$ (the outcome we care about) and a $\\textbf{covariate}$ $X$ (also called a predictor variable or a feature). One way to summarize the relationship is the $\\textbf{regression function}$ $r(x) = \\mathbb{E}(Y \\mid X = x) = \\int y\\, f(y \\mid x)\\, dy$ — the average value of $Y$ among all subjects whose covariate equals $x$. Here $\\mathbb{E}$ is the expected value (the mean) and $f(y \\mid x)$ is the density of $Y$ given $X = x$. The goal is to estimate $r(x)$ from data $(Y_1, X_1), \\ldots, (Y_n, X_n)$. This chapter takes a $\\textbf{parametric}$ approach, assuming $r$ is linear.</p><p>The author notes in a footnote that the word \"regression\" goes back to Francis Galton (1822-1911), who saw that tall and short fathers tend to have sons whose heights are closer to the mean, calling it \"regression towards the mean\".</p>"
      },
      {
        h: "The simple linear regression model",
        body: "<p>The simplest case is when $X_i$ is one-dimensional and $r(x)$ is assumed linear: $r(x) = \\beta_0 + \\beta_1 x$. The author adds the simplifying assumption that the conditional variance $\\mathbb{V}(\\epsilon_i \\mid X = x) = \\sigma^2$ does not depend on $x$ (constant spread). The model (Definition 13.1) is then written</p><ul class=\"steps\"><li>$Y_i = \\beta_0 + \\beta_1 X_i + \\epsilon_i$, where $\\mathbb{E}(\\epsilon_i \\mid X_i) = 0$ and $\\mathbb{V}(\\epsilon_i \\mid X_i) = \\sigma^2$.</li></ul><p>Here $\\beta_0$ is the $\\textbf{intercept}$, $\\beta_1$ is the $\\textbf{slope}$, $\\sigma^2$ is the error variance, and $\\epsilon_i$ is the random noise on the $i$-th point. These three quantities $\\beta_0$, $\\beta_1$, $\\sigma^2$ are the unknown parameters.</p>"
      },
      {
        h: "Fitted line, predictions, and residuals",
        body: "<p>Let $\\widehat\\beta_0$ and $\\widehat\\beta_1$ denote estimates of $\\beta_0$ and $\\beta_1$ (the hat means \"estimated from the data\"). The $\\textbf{fitted line}$ is $\\widehat r(x) = \\widehat\\beta_0 + \\widehat\\beta_1 x$. The $\\textbf{predicted (fitted) values}$ are $\\widehat Y_i = \\widehat r(X_i)$, and the $\\textbf{residuals}$ are the leftover gaps between observed and predicted:</p><ul class=\"steps\"><li>$\\widehat\\epsilon_i = Y_i - \\widehat Y_i = Y_i - (\\widehat\\beta_0 + \\widehat\\beta_1 X_i)$.</li></ul><p>The author's running example (Example 13.2, Figure 13.1) plots log surface temperature $Y$ against log light intensity $X$ for some nearby stars. Example 13.5 gives the book's fitted line:</p><ul class=\"steps\"><li>$\\widehat\\beta_0 = 3.58$ and $\\widehat\\beta_1 = 0.166$.</li><li>$\\widehat r(x) = 3.58 + 0.166x$.</li><li>At $x=4.0$, $\\widehat r(4.0)=3.58+0.166(4.0)=4.244$; at $x=5.5$, $\\widehat r(5.5)=4.493$.</li></ul>"
      }
    ],
    takeaways: [
      "Regression function: $r(x) = \\mathbb{E}(Y \\mid X = x)$, the mean of $Y$ at covariate value $x$.",
      "Simple linear model: $Y_i = \\beta_0 + \\beta_1 X_i + \\epsilon_i$, with $\\mathbb{E}(\\epsilon_i \\mid X_i) = 0$, $\\mathbb{V}(\\epsilon_i \\mid X_i) = \\sigma^2$.",
      "Fitted line $\\widehat r(x) = \\widehat\\beta_0 + \\widehat\\beta_1 x$; residual $\\widehat\\epsilon_i = Y_i - \\widehat Y_i$.",
      "Three unknowns: intercept $\\beta_0$, slope $\\beta_1$, error variance $\\sigma^2$."
    ]
  });
  window.CODEVIZ["aos-ch13-simple-linear-regression"] = {
    charts: [
      {
        type: "scatter",
        title: "Figure 13.1: star data with the least squares line",
        interpret: "Log surface temperature rises gently with log light intensity. The book gives the least-squares line $\\widehat r(x) = 3.58 + 0.166\\,x$; the plotted star coordinates are a visual reconstruction because the chapter prints the graph but not the raw data table.",
        xlabel: "log light intensity (X)",
        ylabel: "log surface temperature (Y)",
        groups: [
          { name: "stars", color: "#4ea1ff", points: [[4.0,4.01],[4.1,4.28],[4.2,4.23],[4.25,4.42],[4.4,4.41],[4.45,4.41],[4.5,4.42],[4.6,4.30],[4.8,4.42],[4.9,4.50],[5.0,4.45],[5.1,4.55],[5.15,4.48],[5.2,4.45],[5.25,4.62],[5.3,4.50],[5.4,4.43],[5.5,4.26],[5.6,4.50]] }
        ],
        lines: [ { name: "least squares line", color: "#ff6b6b", points: [[3.9,4.227],[5.7,4.526]] } ]
      }
    ],
    code: "# Least-squares computation for the book's star example.\n# The chapter prints the fitted values, not the raw star table.\nimport numpy as np\n\n# If x and y hold the log-light and log-temperature data from Figure 13.1:\n# beta1 = ((x - x.mean()) * (y - y.mean())).sum() / ((x - x.mean())**2).sum()\n# beta0 = y.mean() - beta1 * x.mean()\n# sigma2_unbiased = ((y - (beta0 + beta1*x))**2).sum() / (len(x) - 2)\n\nbeta0, beta1 = 3.58, 0.166              # Example 13.5\nfor x0 in [4.0, 5.5]:\n    print(x0, beta0 + beta1*x0)         # 4.244, 4.493"
  };

  // 2) Least squares and maximum likelihood
  B({
    id: "aos-ch13-least-squares-mle",
    chapter: "Chapter 13",
    title: "Least Squares and Maximum Likelihood",
    tagline: "The least squares line minimizes the residual sum of squares; under Normal errors it is also the maximum likelihood estimator.",
    sections: [
      {
        h: "Least squares estimates",
        body: "<p>The $\\textbf{residual sum of squares}$ (RSS) measures how badly the line fits: $\\text{RSS} = \\sum_{i=1}^n \\widehat\\epsilon_i^2$, the total of the squared residuals. The $\\textbf{least squares estimates}$ (Definition 13.3) are the values $\\widehat\\beta_0$ and $\\widehat\\beta_1$ that make RSS as small as possible. Theorem 13.4 gives them in closed form:</p><ul class=\"steps\"><li>$\\widehat\\beta_1 = \\dfrac{\\sum_{i=1}^n (X_i - \\overline X_n)(Y_i - \\overline Y_n)}{\\sum_{i=1}^n (X_i - \\overline X_n)^2}$ — the slope.</li><li>$\\widehat\\beta_0 = \\overline Y_n - \\widehat\\beta_1 \\overline X_n$ — the intercept, forcing the line through the point of averages.</li><li>$\\widehat\\sigma^2 = \\left(\\dfrac{1}{n-2}\\right) \\sum_{i=1}^n \\widehat\\epsilon_i^2$ — an unbiased estimate of $\\sigma^2$.</li></ul><p>Here $\\overline X_n$ and $\\overline Y_n$ are the sample means of the $X$ and $Y$ values.</p>"
      },
      {
        h: "Connection to maximum likelihood",
        body: "<p>Now add the extra assumption that the errors are Normal: $\\epsilon_i \\mid X_i \\sim N(0, \\sigma^2)$, equivalently $Y_i \\mid X_i \\sim N(\\mu_i, \\sigma^2)$ with $\\mu_i = \\beta_0 + \\beta_1 X_i$. The joint likelihood factors into one piece $\\mathcal L_1 = \\prod_i f_X(X_i)$ that does not involve $\\beta_0, \\beta_1$, and a $\\textbf{conditional likelihood}$ $\\mathcal L_2 = \\prod_i f_{Y\\mid X}(Y_i \\mid X_i)$. The conditional log-likelihood (equation 13.9) is</p><ul class=\"steps\"><li>$\\ell(\\beta_0, \\beta_1, \\sigma) = -n \\log \\sigma - \\dfrac{1}{2\\sigma^2} \\sum_{i=1}^n \\big(Y_i - (\\beta_0 + \\beta_1 X_i)\\big)^2$.</li></ul><p>Maximizing $\\ell$ over $\\beta_0, \\beta_1$ is exactly the same as minimizing $\\sum_i (Y_i - (\\beta_0 + \\beta_1 X_i))^2$, which is the RSS. Hence Theorem 13.7: under Normality, the least squares estimator is also the maximum likelihood estimator (MLE).</p>"
      },
      {
        h: "The MLE for the variance",
        body: "<p>Maximizing $\\ell$ over $\\sigma$ as well gives the MLE of the variance, $\\widehat\\sigma^2 = \\frac{1}{n}\\sum_i \\widehat\\epsilon_i^2$ (equation 13.10). This divides by $n$ rather than $n-2$, so it is close to but not identical to the unbiased estimate in Theorem 13.4. The author notes that common practice is to use the unbiased $n-2$ version.</p><pre><code class=\"language-python\"># Equations 13.5--13.10 in NumPy: least squares = Normal-error MLE\nimport numpy as np\n\nx = np.asarray(x, dtype=float)          # covariate X_i\ny = np.asarray(y, dtype=float)          # response Y_i\nb1 = ((x - x.mean()) * (y - y.mean())).sum() / ((x - x.mean())**2).sum()\nb0 = y.mean() - b1 * x.mean()\nresid = y - (b0 + b1*x)\nsigma2_unbiased = (resid @ resid) / (len(x) - 2)   # Eq. 13.7\nsigma2_mle = (resid @ resid) / len(x)              # Eq. 13.10\n# Star example printed in the book: b0 = 3.58, b1 = 0.166</code></pre>"
      }
    ],
    takeaways: [
      "Least squares minimizes $\\text{RSS} = \\sum_i \\widehat\\epsilon_i^2$.",
      "Slope $\\widehat\\beta_1 = \\sum (X_i - \\overline X)(Y_i - \\overline Y) / \\sum (X_i - \\overline X)^2$; intercept $\\widehat\\beta_0 = \\overline Y - \\widehat\\beta_1 \\overline X$.",
      "Under Normal errors the least squares estimator equals the MLE (Theorem 13.7).",
      "Unbiased variance uses $1/(n-2)$; the MLE uses $1/n$."
    ]
  });

  // 3) Properties of the least-squares estimators and prediction
  B({
    id: "aos-ch13-properties-and-prediction",
    chapter: "Chapter 13",
    title: "Properties and Prediction",
    tagline: "The least squares estimators are consistent and asymptotically Normal, giving confidence intervals; predicting a new outcome needs a wider prediction interval.",
    sections: [
      {
        h: "Standard errors and limiting distribution",
        body: "<p>The author records the conditional means and variances of the least squares estimators (Theorem 13.8), treating them as conditional on $X^n = (X_1, \\ldots, X_n)$. The estimators are unbiased, $\\mathbb{E}(\\widehat\\beta \\mid X^n) = (\\beta_0, \\beta_1)^T$, and the estimated standard errors (equations 13.12-13.13) are</p><ul class=\"steps\"><li>$\\widehat{\\text{se}}(\\widehat\\beta_1) = \\dfrac{\\widehat\\sigma}{s_X \\sqrt n}$, where $s_X^2 = n^{-1}\\sum_i (X_i - \\overline X_n)^2$ is the spread of the covariate.</li><li>$\\widehat{\\text{se}}(\\widehat\\beta_0) = \\dfrac{\\widehat\\sigma}{s_X \\sqrt n} \\sqrt{\\dfrac{\\sum_i X_i^2}{n}}$.</li></ul><p>Theorem 13.9: under appropriate conditions the estimators are consistent ($\\widehat\\beta_0 \\xrightarrow{P} \\beta_0$, $\\widehat\\beta_1 \\xrightarrow{P} \\beta_1$) and asymptotically Normal, so an approximate $1-\\alpha$ confidence interval is $\\widehat\\beta_1 \\pm z_{\\alpha/2}\\,\\widehat{\\text{se}}(\\widehat\\beta_1)$. The Wald test rejects $H_0: \\beta_1 = 0$ when $|W| > z_{\\alpha/2}$, with $W = \\widehat\\beta_1 / \\widehat{\\text{se}}(\\widehat\\beta_1)$.</p>"
      },
      {
        h: "Election example — testing the slope",
        body: "<p>In Example 13.6 / 13.10 the author fits votes for Buchanan against votes for Bush in Florida counties. On the log scale the fit (omitting Palm Beach) is $\\log(\\text{Buchanan}) = -2.3298 + 0.7303\\,\\log(\\text{Bush})$, with $\\widehat{\\text{se}}(\\widehat\\beta_1) = 0.0358$. The 95% confidence interval and Wald test:</p><ul class=\"steps\"><li>CI: $0.7303 \\pm 2(0.0358) = (0.66, 0.80)$.</li><li>Wald statistic: $|W| = |0.7303 - 0|/0.0358 = 20.40$.</li><li>$p$-value: $\\mathbb{P}(|Z| > 20.40) \\approx 0$ — strong evidence the slope is not zero.</li></ul>"
      },
      {
        h: "Prediction of a new outcome",
        body: "<p>For a new subject with covariate $X = x_*$, the point estimate of the outcome is $\\widehat Y_* = \\widehat\\beta_0 + \\widehat\\beta_1 x_*$. The author warns that a confidence interval for $Y_*$ is $\\textbf{not}$ the usual $\\widehat Y_* \\pm z_{\\alpha/2}\\,\\widehat{\\text{se}}$. The correct $\\textbf{prediction interval}$ (Theorem 13.11) uses</p><ul class=\"steps\"><li>$\\widehat\\xi_n^2 = \\widehat\\sigma^2 \\left( \\dfrac{\\sum_i (X_i - X_*)^2}{n \\sum_i (X_i - \\overline X)^2} + 1 \\right)$ — note the extra $+1$, which accounts for the new point's own noise.</li><li>Interval: $\\widehat Y_* \\pm z_{\\alpha/2}\\,\\widehat\\xi_n$.</li></ul><p>Example 13.12 revisits the election. In Palm Beach, Bush had 152,954 votes and Buchanan had 3,467; on the log scale these are 11.93789 and 8.151045. The prediction for log Buchanan votes is</p><ul class=\"steps\"><li>$-2.3298 + 0.7303(11.93789) = 6.388441$.</li><li>$\\widehat\\xi_n = 0.093775$, giving a 95% prediction interval $(6.200, 6.578)$.</li><li>The observed log count 8.151 is about 20 standard errors above the prediction.</li><li>On the original vote scale the interval is $(493, 717)$, versus the actual 3,467 votes.</li></ul>"
      }
    ],
    takeaways: [
      "$\\widehat{\\text{se}}(\\widehat\\beta_1) = \\widehat\\sigma / (s_X \\sqrt n)$; estimators are consistent and asymptotically Normal.",
      "Election: $\\log(\\text{Buchanan}) = -2.3298 + 0.7303\\,\\log(\\text{Bush})$; Wald $|W| = 20.40$, $p \\approx 0$.",
      "Prediction interval has an extra $+1$ inside $\\widehat\\xi_n^2$ for the new point's own noise.",
      "Palm Beach predicted $(493, 717)$ votes but actually got 3,467 — far above the interval."
    ]
  });
  window.CODEVIZ["aos-ch13-properties-and-prediction"] = {
    charts: [
      {
        type: "scatter",
        title: "Figure 13.2 summary: log election fit and Palm Beach",
        interpret: "The fitted line is $\\log(\\text{Buchanan})=-2.3298+0.7303\\log(\\text{Bush})$. Palm Beach's observed log count 8.151 is far above the fitted value 6.388.",
        xlabel: "log Bush votes",
        ylabel: "log Buchanan votes",
        groups: [
          { name: "Palm Beach", color: "#ffb454", points: [[11.93789, 8.151045]] }
        ],
        lines: [ { name: "least squares line", color: "#4ea1ff", points: [[7, 2.7823], [13, 7.1641]] } ]
      },
      {
        type: "scatter",
        title: "Figure 13.2 residual summary: Palm Beach on the log scale",
        interpret: "For Palm Beach, the residual is $8.151045-6.388441=1.762604$, nearly 20 prediction standard errors above the fitted value.",
        xlabel: "log Bush votes",
        ylabel: "residual",
        groups: [
          { name: "Palm Beach residual", color: "#ff6b6b", points: [[11.93789, 1.762604]] }
        ],
        lines: [ { name: "zero residual", color: "#7ee787", points: [[7, 0], [13, 0]] } ]
      }
    ],
    code: "# Book's election calculations (Examples 13.10 and 13.12)\nimport math\n\nb0, b1, se_b1 = -2.3298, 0.7303, 0.0358\nci_slope = (b1 - 2*se_b1, b1 + 2*se_b1)\nwald = abs(b1) / se_b1\nprint(ci_slope)                         # (0.6587, 0.8019) ~= (0.66, 0.80)\nprint(wald)                             # 20.40\n\nlog_bush, log_buchanan = 11.93789, 8.151045\nyhat = b0 + b1 * log_bush\nxi = 0.093775\npi_log = (yhat - 2*xi, yhat + 2*xi)\nprint(yhat, pi_log)                     # 6.388441, (6.200891, 6.575991)\nprint(tuple(round(math.exp(v)) for v in pi_log))  # (493, 717); actual = 3467"
  };

  // 4) Multiple regression
  B({
    id: "aos-ch13-multiple-regression",
    chapter: "Chapter 13",
    title: "Multiple Regression",
    tagline: "With several covariates the model is written in matrix form and the least squares estimate has the closed form (XᵀX)⁻¹XᵀY.",
    sections: [
      {
        h: "The model in matrix form",
        body: "<p>Now the covariate is a vector of length $k$: each observation is $(Y_i, X_i)$ with $X_i = (X_{i1}, \\ldots, X_{ik})$. The model is $Y_i = \\sum_{j=1}^k \\beta_j X_{ij} + \\epsilon_i$ with $\\mathbb{E}(\\epsilon_i \\mid X_{i1}, \\ldots, X_{ik}) = 0$. An intercept is included by setting $X_{i1} = 1$ for all $i$. Stacking the data, with $Y$ the $n$-vector of outcomes, $X$ the $n \\times k$ design matrix (one row per observation, one column per covariate), $\\beta$ the $k$-vector of coefficients and $\\epsilon$ the noise vector, the model becomes simply $Y = X\\beta + \\epsilon$ (equation 13.19).</p>"
      },
      {
        h: "Least squares estimate",
        body: "<p>Theorem 13.13: assuming the $k \\times k$ matrix $X^T X$ is invertible,</p><ul class=\"steps\"><li>$\\widehat\\beta = (X^T X)^{-1} X^T Y$.</li><li>$\\mathbb{V}(\\widehat\\beta \\mid X^n) = \\sigma^2 (X^T X)^{-1}$.</li><li>$\\widehat\\beta \\approx N(\\beta, \\sigma^2 (X^T X)^{-1})$ — approximately Normal.</li></ul><p>The estimated regression function is $\\widehat r(x) = \\sum_{j=1}^k \\widehat\\beta_j x_j$, and an unbiased estimate of the variance is $\\widehat\\sigma^2 = \\frac{1}{n-k} \\sum_i \\widehat\\epsilon_i^2$ (note the divisor $n-k$). An approximate $1-\\alpha$ confidence interval for $\\beta_j$ is $\\widehat\\beta_j \\pm z_{\\alpha/2}\\,\\widehat{\\text{se}}(\\widehat\\beta_j)$, where $\\widehat{\\text{se}}^2(\\widehat\\beta_j)$ is the $j$-th diagonal element of $\\widehat\\sigma^2 (X^T X)^{-1}$.</p>"
      },
      {
        h: "Crime data example",
        body: "<p>Example 13.14 fits a regression of crime rate on 10 covariates for 47 US states in 1960. The \"$t$-value\" column is the Wald statistic for $H_0: \\beta_j = 0$; asterisks flag smaller $p$-values. The author's table:</p><table class=\"extable\"><thead><tr><th>covariate</th><th>$\\widehat\\beta_j$</th><th>$\\widehat{\\text{se}}(\\widehat\\beta_j)$</th><th>$t$ value</th><th>$p$-value</th></tr></thead><tbody><tr><td class=\"row-h\">(Intercept)</td><td class=\"num\">-589.39</td><td class=\"num\">167.59</td><td class=\"num\">-3.51</td><td class=\"num\">0.001</td></tr><tr><td class=\"row-h\">Age</td><td class=\"num\">1.04</td><td class=\"num\">0.45</td><td class=\"num\">2.33</td><td class=\"num\">0.025</td></tr><tr><td class=\"row-h\">Southern State</td><td class=\"num\">11.29</td><td class=\"num\">13.24</td><td class=\"num\">0.85</td><td class=\"num\">0.399</td></tr><tr><td class=\"row-h\">Education</td><td class=\"num\">1.18</td><td class=\"num\">0.68</td><td class=\"num\">1.70</td><td class=\"num\">0.093</td></tr><tr><td class=\"row-h\">Expenditures</td><td class=\"num\">0.96</td><td class=\"num\">0.25</td><td class=\"num\">3.86</td><td class=\"num\">0.000</td></tr><tr><td class=\"row-h\">Labor</td><td class=\"num\">0.11</td><td class=\"num\">0.15</td><td class=\"num\">0.69</td><td class=\"num\">0.493</td></tr><tr><td class=\"row-h\">Number of Males</td><td class=\"num\">0.30</td><td class=\"num\">0.22</td><td class=\"num\">1.36</td><td class=\"num\">0.181</td></tr><tr><td class=\"row-h\">Population</td><td class=\"num\">0.09</td><td class=\"num\">0.14</td><td class=\"num\">0.65</td><td class=\"num\">0.518</td></tr><tr><td class=\"row-h\">Unemployment (14-24)</td><td class=\"num\">-0.68</td><td class=\"num\">0.48</td><td class=\"num\">-1.40</td><td class=\"num\">0.165</td></tr><tr><td class=\"row-h\">Unemployment (25-39)</td><td class=\"num\">2.15</td><td class=\"num\">0.95</td><td class=\"num\">2.26</td><td class=\"num\">0.030</td></tr><tr><td class=\"row-h\">Wealth</td><td class=\"num\">-0.08</td><td class=\"num\">0.09</td><td class=\"num\">-0.91</td><td class=\"num\">0.367</td></tr></tbody></table><pre><code class=\"language-python\"># Matrix least squares for Example 13.14\nimport numpy as np\n\nX = np.asarray(X, dtype=float)          # columns: intercept plus 10 covariates\ny = np.asarray(y, dtype=float)          # crime rate\nbeta_hat = np.linalg.solve(X.T @ X, X.T @ y)\nresid = y - X @ beta_hat\nsigma2 = resid @ resid / (len(y) - X.shape[1])\nse = np.sqrt(np.diag(sigma2 * np.linalg.inv(X.T @ X)))\nt = beta_hat / se\n# Book table highlights: intercept -589.39 (se 167.59), Age 1.04 (se 0.45),\n# Expenditures 0.96 (se 0.25), U2 2.15 (se 0.95).</code></pre><p>This raises two questions the author flags: (1) should we drop some variables (model selection, next section)? and (2) should we read these as causal (deferred to Chapter 16)?</p>"
      }
    ],
    takeaways: [
      "Matrix model: $Y = X\\beta + \\epsilon$, with $X$ an $n \\times k$ design matrix.",
      "Least squares: $\\widehat\\beta = (X^T X)^{-1} X^T Y$, with $\\mathbb{V}(\\widehat\\beta \\mid X^n) = \\sigma^2 (X^T X)^{-1}$.",
      "Unbiased variance divides by $n-k$; $\\widehat{\\text{se}}^2(\\widehat\\beta_j)$ is the $j$-th diagonal of $\\widehat\\sigma^2 (X^T X)^{-1}$.",
      "Crime example: Expenditures ($p \\approx 0$) and Age ($p = 0.025$) are significant; many covariates are not."
    ]
  });

  // 5) Model selection
  B({
    id: "aos-ch13-model-selection",
    chapter: "Chapter 13",
    title: "Model Selection",
    tagline: "Choosing which covariates to keep trades off fit against complexity; scores like Mallows Cp, AIC, and BIC penalize models that use more terms.",
    sections: [
      {
        h: "Underfitting, overfitting, and the bias of training error",
        body: "<p>A smaller model with fewer covariates can predict better and is simpler. As you add variables, prediction bias falls but variance rises: too few covariates gives high bias ($\\textbf{underfitting}$), too many gives high variance ($\\textbf{overfitting}$). The $\\textbf{prediction risk}$ of model $S$ is $R(S) = \\sum_i \\mathbb{E}(\\widehat Y_i(S) - Y_i^*)^2$, where $Y_i^*$ is a future observation at covariate $X_i$. We want $S$ that makes $R(S)$ small.</p><p>The obvious estimate, the $\\textbf{training error}$ $\\widehat R_{\\text{tr}}(S) = \\sum_i (\\widehat Y_i(S) - Y_i)^2$, is badly biased. Theorem 13.15 shows it is downward-biased: $\\mathbb{E}(\\widehat R_{\\text{tr}}(S)) < R(S)$, with $\\text{bias} = -2 \\sum_i \\text{Cov}(\\widehat Y_i, Y_i)$. The reason is that the data are used twice — to fit and to score — so a complex model makes $\\text{Cov}(\\widehat Y_i, Y_i)$ large and the bias worse.</p>"
      },
      {
        h: "Scores: Mallows Cp, AIC, BIC",
        body: "<p>Several scores correct this bias. Each balances fit against complexity ($|S|$ = number of terms in $S$):</p><table class=\"extable\"><thead><tr><th>score</th><th>definition</th><th>rule</th></tr></thead><tbody><tr><td class=\"row-h\">Mallows $C_p$</td><td>$\\widehat R(S) = \\widehat R_{\\text{tr}}(S) + 2|S|\\,\\widehat\\sigma^2$</td><td>minimize</td></tr><tr><td class=\"row-h\">AIC</td><td>$\\ell_S - |S|$</td><td>maximize</td></tr><tr><td class=\"row-h\">BIC</td><td>$\\ell_S - \\dfrac{|S|}{2}\\log n$</td><td>maximize</td></tr></tbody></table><p>Mallows $C_p$ is \"lack of fit + complexity penalty\", where $\\widehat\\sigma^2$ comes from the full model. AIC uses the log-likelihood $\\ell_S$ at the MLE; for Normal-error linear regression, maximizing AIC is equivalent to minimizing Mallows $C_p$. BIC is identical to $C_p$ in form but its penalty $\\frac{|S|}{2}\\log n$ is heavier, so it picks smaller models; it also has a Bayesian reading, $\\mathbb{P}(S_j \\mid \\text{data}) \\approx e^{\\text{BIC}(S_j)} / \\sum_r e^{\\text{BIC}(S_r)}$, so the highest-BIC model is the most probable. Leave-one-out and $k$-fold cross-validation are alternatives; for linear regression they often agree closely with $C_p$.</p>"
      },
      {
        h: "Searching models and the crime example",
        body: "<p>With $k$ covariates there are $2^k$ possible models. If $k$ is small you can score them all; otherwise use $\\textbf{forward}$ stepwise (start empty, add the best variable each step) or $\\textbf{backward}$ stepwise (start full, drop one variable each step). Both are greedy and not guaranteed to find the best model. Example 13.16 applies backward stepwise with AIC (R's smaller-is-better convention, equivalent to minimizing $C_p$) to the crime data. The full model has AIC = 310.37. The AIC after deleting one variable, in ascending order:</p><table class=\"extable\"><thead><tr><th>drop</th><th>Pop</th><th>Labor</th><th>South</th><th>Wealth</th><th>Males</th><th>U1</th><th>Educ.</th><th>U2</th><th>Age</th><th>Expend</th></tr></thead><tbody><tr><td class=\"row-h\">AIC</td><td class=\"num\">308</td><td class=\"num\">309</td><td class=\"num\">309</td><td class=\"num\">309</td><td class=\"num\">310</td><td class=\"num\">310</td><td class=\"num\">312</td><td class=\"num\">314</td><td class=\"num\">315</td><td class=\"num\">324</td></tr></tbody></table><p>Dropping Pop gives the lowest AIC (308), so Pop is removed; the process repeats. The next deletion table in the book is:</p><table class=\"extable\"><thead><tr><th>drop after Pop</th><th>South</th><th>Labor</th><th>Wealth</th><th>Males</th><th>U1</th><th>Education</th><th>U2</th><th>Age</th><th>Expend</th></tr></thead><tbody><tr><td class=\"row-h\">AIC</td><td class=\"num\">308</td><td class=\"num\">308</td><td class=\"num\">308</td><td class=\"num\">309</td><td class=\"num\">309</td><td class=\"num\">310</td><td class=\"num\">313</td><td class=\"num\">313</td><td class=\"num\">329</td></tr></tbody></table><p>The author then drops \"Southern\". Continuing until no drop helps leaves the final model</p><ul class=\"steps\"><li>Start with all covariates: AIC $=310.37$.</li><li>First step: dropping Pop gives AIC $=308$, the smallest one-variable deletion score.</li><li>Second step: after Pop is gone, South, Labor, and Wealth tie at AIC $=308$; the book drops Southern.</li><li>Final selected equation: Crime $= 1.2\\,$Age $+ .75\\,$Education $+ .87\\,$Expenditure $+ .34\\,$Males $- .86\\,$U1 $+ 2.31\\,$U2.</li></ul><p>The author warns this does not say which variables $\\textbf{cause}$ crime. He also mentions the Zheng-Loh (1995) method, which instead seeks the smallest true model: order the Wald statistics $|W_{(1)}| \\geq \\cdots \\geq |W_{(k)}|$, then pick the $\\widehat j$ minimizing $\\text{RSS}(j) + j\\,\\widehat\\sigma^2 \\log n$ and keep those $\\widehat j$ largest-Wald terms.</p>"
      }
    ],
    takeaways: [
      "Too few covariates underfits (high bias); too many overfits (high variance).",
      "Training error is downward-biased for prediction risk (Theorem 13.15).",
      "Mallows $C_p = \\widehat R_{\\text{tr}} + 2|S|\\widehat\\sigma^2$; AIC $= \\ell_S - |S|$; BIC $= \\ell_S - \\frac{|S|}{2}\\log n$ (heavier penalty).",
      "Crime data, backward AIC: drop Pop first (AIC 308) down from the full model's 310.37."
    ]
  });
  window.CODEVIZ["aos-ch13-model-selection"] = {
    charts: [
      {
        type: "bars",
        title: "Example 13.16: AIC after deleting one variable from the full crime model",
        interpret: "The full model's AIC is 310.37. Dropping Pop lowers AIC most (to 308), so it is removed first; dropping Expend raises AIC to 324, so Expend is the most useful covariate. Smaller AIC is better in R's convention.",
        labels: ["Pop","Labor","South","Wealth","Males","U1","Educ.","U2","Age","Expend"],
        values: [308,309,309,309,310,310,312,314,315,324]
      }
    ],
    code: "# Backward stepwise AIC from Example 13.16\n# The book reports these values from R's stepwise regression output.\nimport pandas as pd\n\nfirst_drop = pd.Series({\n    'Pop': 308, 'Labor': 309, 'South': 309, 'Wealth': 309, 'Males': 310,\n    'U1': 310, 'Educ.': 312, 'U2': 314, 'Age': 315, 'Expend': 324\n})\nsecond_drop = pd.Series({\n    'South': 308, 'Labor': 308, 'Wealth': 308, 'Males': 309, 'U1': 309,\n    'Education': 310, 'U2': 313, 'Age': 313, 'Expend': 329\n})\nprint(first_drop.idxmin(), first_drop.min())      # Pop, 308 (full model AIC = 310.37)\nprint(second_drop.idxmin(), second_drop.min())    # South, 308 (book drops Southern)\n# Final: Crime = 1.2 Age + .75 Education + .87 Expenditure + .34 Males - .86 U1 + 2.31 U2"
  };

  // 6) Logistic regression
  B({
    id: "aos-ch13-logistic-regression",
    chapter: "Chapter 13",
    title: "Logistic Regression",
    tagline: "When the response is binary, logistic regression models the probability of a 1 through the logistic function and is fit by maximum likelihood.",
    sections: [
      {
        h: "The logistic model",
        body: "<p>So far $Y$ was real-valued. $\\textbf{Logistic regression}$ handles a binary response $Y_i \\in \\{0, 1\\}$. For a $k$-dimensional covariate the model writes the probability of a 1 as</p><ul class=\"steps\"><li>$p_i \\equiv \\mathbb{P}(Y_i = 1 \\mid X = x) = \\dfrac{e^{\\beta_0 + \\sum_{j=1}^k \\beta_j x_{ij}}}{1 + e^{\\beta_0 + \\sum_{j=1}^k \\beta_j x_{ij}}}$.</li><li>Equivalently $\\text{logit}(p_i) = \\beta_0 + \\sum_{j=1}^k \\beta_j x_{ij}$, where $\\text{logit}(p) = \\log\\!\\big(p/(1-p)\\big)$.</li></ul><p>The name comes from the $\\textbf{logistic function}$ $p = e^x / (1 + e^x)$, an S-shaped curve (Figure 13.3) running from 0 to 1. The logit (log-odds) link makes the right-hand side a plain linear function of the covariates.</p>"
      },
      {
        h: "Likelihood and fitting",
        body: "<p>Because the $Y_i$ are binary, the data are Bernoulli: $Y_i \\mid X_i = x_i \\sim \\text{Bernoulli}(p_i)$. The conditional likelihood (equation 13.35) is $\\mathcal L(\\beta) = \\prod_{i=1}^n p_i(\\beta)^{Y_i}\\,(1 - p_i(\\beta))^{1 - Y_i}$. There is no closed form, so the MLE $\\widehat\\beta$ is found numerically. The author gives the $\\textbf{reweighted least squares}$ algorithm: from current $p_i^s$, form the working response $Z_i = \\text{logit}(p_i^s) + \\frac{Y_i - p_i^s}{p_i^s(1 - p_i^s)}$, build a diagonal weight matrix $W$ with entries $p_i^s(1 - p_i^s)$, and update $\\widehat\\beta^s = (X^T W X)^{-1} X^T W Z$ — a weighted linear regression of $Z$ on the covariates — iterating until convergence. Standard errors come from the inverse Fisher information $J = I^{-1}$, and model selection again uses the AIC score $\\ell_S - |S|$.</p>"
      },
      {
        h: "Heart disease example",
        body: "<p>Example 13.17 uses the Coronary Risk-Factor Study (CORIS) data: 462 South African males aged 15-64, outcome $Y$ = presence (1) or absence (0) of coronary heart disease, with 9 covariates. The logistic fit gives estimates and Wald statistics $W_j$:</p><table class=\"extable\"><thead><tr><th>covariate</th><th>$\\widehat\\beta_j$</th><th>$\\widehat{\\text{se}}$</th><th>$W_j$</th><th>$p$-value</th></tr></thead><tbody><tr><td class=\"row-h\">Intercept</td><td class=\"num\">-6.145</td><td class=\"num\">1.300</td><td class=\"num\">-4.738</td><td class=\"num\">0.000</td></tr><tr><td class=\"row-h\">sbp</td><td class=\"num\">0.007</td><td class=\"num\">0.006</td><td class=\"num\">1.138</td><td class=\"num\">0.255</td></tr><tr><td class=\"row-h\">tobacco</td><td class=\"num\">0.079</td><td class=\"num\">0.027</td><td class=\"num\">2.991</td><td class=\"num\">0.003</td></tr><tr><td class=\"row-h\">ldl</td><td class=\"num\">0.174</td><td class=\"num\">0.059</td><td class=\"num\">2.925</td><td class=\"num\">0.003</td></tr><tr><td class=\"row-h\">adiposity</td><td class=\"num\">0.019</td><td class=\"num\">0.029</td><td class=\"num\">0.637</td><td class=\"num\">0.524</td></tr><tr><td class=\"row-h\">famhist</td><td class=\"num\">0.925</td><td class=\"num\">0.227</td><td class=\"num\">4.078</td><td class=\"num\">0.000</td></tr><tr><td class=\"row-h\">typea</td><td class=\"num\">0.040</td><td class=\"num\">0.012</td><td class=\"num\">3.233</td><td class=\"num\">0.001</td></tr><tr><td class=\"row-h\">obesity</td><td class=\"num\">-0.063</td><td class=\"num\">0.044</td><td class=\"num\">-1.427</td><td class=\"num\">0.153</td></tr><tr><td class=\"row-h\">alcohol</td><td class=\"num\">0.000</td><td class=\"num\">0.004</td><td class=\"num\">0.027</td><td class=\"num\">0.979</td></tr><tr><td class=\"row-h\">age</td><td class=\"num\">0.045</td><td class=\"num\">0.012</td><td class=\"num\">3.754</td><td class=\"num\">0.000</td></tr></tbody></table><p>The author asks whether it is surprising that systolic blood pressure (sbp) is not significant, or that the obesity coefficient is negative. His point: a variable can fail to be a significant $\\textbf{predictor}$ relative to the others without ceasing to be an important $\\textbf{cause}$ — association is not causation (Chapter 16).</p>"
      }
    ],
    takeaways: [
      "Logistic regression: $\\mathbb{P}(Y=1\\mid x) = e^{\\eta}/(1 + e^{\\eta})$ with $\\eta = \\beta_0 + \\sum_j \\beta_j x_{ij}$; $\\text{logit}(p_i) = \\eta$.",
      "Binary $Y$ is Bernoulli; the MLE has no closed form and is fit by reweighted least squares.",
      "CORIS heart-disease example: tobacco, ldl, famhist, typea, age are significant; sbp and obesity are not.",
      "A weak predictor is not necessarily a weak cause — association is not causation."
    ]
  });
  window.CODEVIZ["aos-ch13-logistic-regression"] = {
    charts: [
      {
        type: "line",
        title: "Figure 13.3: the logistic function",
        interpret: "The logistic curve maps any linear predictor $x$ to a probability between 0 and 1, using $p=e^x/(1+e^x)$.",
        xlabel: "x",
        ylabel: "p",
        series: [
          { name: "logistic", color: "#4ea1ff", points: [[-6,0.0025],[-5,0.0067],[-4,0.0180],[-3,0.0474],[-2,0.1192],[-1,0.2689],[0,0.5],[1,0.7311],[2,0.8808],[3,0.9526],[4,0.9820],[5,0.9933],[6,0.9975]] }
        ]
      },
      {
        type: "bars",
        title: "Example 13.17: CORIS logistic Wald statistics",
        interpret: "The largest absolute Wald statistics are for family history, age, type-A behavior, tobacco, and LDL; systolic blood pressure is weak after the other covariates are included.",
        labels: ["sbp","tobacco","ldl","adiposity","famhist","typea","obesity","alcohol","age"],
        values: [1.138,2.991,2.925,0.637,4.078,3.233,1.427,0.027,3.754],
        colors: ["#4ea1ff","#7ee787","#7ee787","#4ea1ff","#ffb454","#7ee787","#4ea1ff","#4ea1ff","#7ee787"]
      }
    ],
    code: "# Logistic regression computations from Section 13.7\nimport numpy as np\n\nlogistic = lambda x: np.exp(x) / (1 + np.exp(x))\nprint(logistic(0.0))                    # 0.5, midpoint of Figure 13.3\n\n# Reweighted least squares skeleton for the book's algorithm.\n# X includes an intercept column; y is 0/1.\nbeta = np.zeros(X.shape[1])\nfor _ in range(25):\n    eta = X @ beta\n    p = logistic(eta)\n    w = p * (1 - p)\n    z = eta + (y - p) / w\n    beta_new = np.linalg.solve(X.T @ (w[:, None] * X), X.T @ (w * z))\n    if np.max(np.abs(beta_new - beta)) < 1e-8:\n        break\n    beta = beta_new\n# CORIS table highlights: intercept -6.145; tobacco 0.079; ldl 0.174;\n# famhist 0.925; typea 0.040; age 0.045."
  };
})();
