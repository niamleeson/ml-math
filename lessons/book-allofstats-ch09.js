/* All of Statistics (Larry Wasserman) — Chapter 9 "Parametric Inference". Self-registering fragment. */
(function () {
  window.LESSONS = window.LESSONS || [];
  window.CODEVIZ = window.CODEVIZ || {};
  const M = "All of Statistics";
  const BOOK = "All of Statistics";
  const B = (o) => window.LESSONS.push(Object.assign({ module: M, template: "book", book: BOOK }, o));

  // 1 — Parameter of interest & method of moments
  B({
    id: "aos-ch9-method-of-moments",
    chapter: "Chapter 9",
    title: "Parameter of interest and method of moments",
    tagline: "Match population moments to sample moments to get an easy-to-compute estimator.",
    sections: [
      { h: "Parametric model and parameter of interest", body: "<p>A parametric model is a family $\\mathfrak{F} = \\{ f(x;\\theta) : \\theta \\in \\Theta \\}$ of densities indexed by a finite-dimensional parameter $\\theta = (\\theta_1,\\dots,\\theta_k)$, where $\\Theta \\subset \\mathbb{R}^k$ is the parameter space. Inference reduces to estimating $\\theta$. Here $f(x;\\theta)$ is the density of one data point given the parameter value, and $\\Theta$ is the set of all allowed parameter values.</p><p>Often we care only about some function $T(\\theta)$ of the parameter. If $X \\sim N(\\mu,\\sigma^2)$ and our goal is $\\mu$, then $\\mu = T(\\theta)$ is the <strong>parameter of interest</strong> and $\\sigma$ is a <strong>nuisance parameter</strong> — something we must carry along but do not directly want. In the book's blood-test example (Example 9.1) the parameter of interest is the fraction of the population whose score exceeds 1, namely $\\tau = T(\\mu,\\sigma) = 1 - \\Phi((1-\\mu)/\\sigma)$, where $\\Phi$ is the standard Normal cumulative distribution function (the probability a standard Normal is below a given value).</p>" },
      { h: "Moments and sample moments", body: "<p>For a $k$-dimensional parameter, define the $j$-th <strong>moment</strong> as the expected value of the $j$-th power of the data, $\\alpha_j(\\theta) = \\mathbb{E}_\\theta(X^j)$ (the average value of $X^j$ if $\\theta$ were true), and the $j$-th <strong>sample moment</strong> as the data average $\\hat{\\alpha}_j = \\frac{1}{n}\\sum_{i=1}^n X_i^j$. The <strong>method of moments estimator</strong> $\\hat{\\theta}_n$ (Definition 9.3) is the value of $\\theta$ that makes the first $k$ theoretical moments equal to the first $k$ sample moments. This is a system of $k$ equations in $k$ unknowns. Wasserman notes these estimators are not optimal, but they are often easy to compute and make good starting values for iterative methods.</p>" },
      { h: "Worked example: Normal", body: "<p>For $X_1,\\dots,X_n \\sim N(\\mu,\\sigma^2)$ (Example 9.5), the first two moments are $\\alpha_1 = \\mu$ and $\\alpha_2 = \\sigma^2 + \\mu^2$ (using $\\mathbb{E}(X^2) = \\mathbb{V}(X) + (\\mathbb{E}X)^2$). Equate to sample moments and solve:</p><ul class='steps'><li>Equation 1: $\\hat{\\mu} = \\frac{1}{n}\\sum_i X_i$ — the sample mean.</li><li>Equation 2: $\\hat{\\sigma}^2 + \\hat{\\mu}^2 = \\frac{1}{n}\\sum_i X_i^2$.</li><li>Substitute $\\hat{\\mu} = \\bar{X}_n$ into equation 2.</li><li>Solve: $\\hat{\\mu} = \\bar{X}_n$ and $\\hat{\\sigma}^2 = \\frac{1}{n}\\sum_i (X_i - \\bar{X}_n)^2$.</li></ul><p>For Bernoulli$(p)$ (Example 9.4) it is simpler: $\\alpha_1 = p$, so the estimator is just $\\hat{p}_n = \\frac{1}{n}\\sum_i X_i$.</p>" },
      { h: "Properties", body: "<p>Theorem 9.6 states that, under appropriate conditions, the method-of-moments estimator (i) exists with probability tending to 1, (ii) is consistent ($\\hat{\\theta}_n \\xrightarrow{P} \\theta$, meaning it converges in probability to the true value), and (iii) is asymptotically Normal: $\\sqrt{n}(\\hat{\\theta}_n - \\theta) \\rightsquigarrow N(0,\\Sigma)$ for a specific covariance matrix $\\Sigma$. The arrow $\\rightsquigarrow$ means convergence in distribution. Standard errors can be derived from this, but the book recommends the easier route of the bootstrap.</p>" }
    ],
    takeaways: [
      "A parametric model fixes the density shape and leaves a finite parameter to estimate.",
      "The parameter of interest is what you want; nuisance parameters are along for the ride.",
      "Method of moments equates the first k population moments to the first k sample moments.",
      "Easy to compute and consistent, but not optimal."
    ]
  });

  // 2 — Maximum likelihood: definition & likelihood function
  B({
    id: "aos-ch9-maximum-likelihood",
    chapter: "Chapter 9",
    title: "Maximum likelihood",
    tagline: "The MLE is the parameter value that makes the observed data most probable.",
    sections: [
      { h: "The likelihood function", body: "<p>The likelihood function (Definition 9.7) is $\\mathcal{L}_n(\\theta) = \\prod_{i=1}^n f(X_i;\\theta)$, and the log-likelihood is $\\ell_n(\\theta) = \\log \\mathcal{L}_n(\\theta)$. It is just the joint density of the data, except that we now treat it as a function of the parameter $\\theta$ rather than of the data. Wasserman stresses the likelihood is <strong>not</strong> a density in $\\theta$: it generally does not integrate to 1 over $\\theta$.</p><p>The <strong>maximum likelihood estimator</strong> (MLE), denoted $\\hat{\\theta}_n$ (Definition 9.8), is the value of $\\theta$ that maximizes $\\mathcal{L}_n(\\theta)$. Because the logarithm is increasing, the maximum of $\\ell_n$ occurs at the same place, so maximizing the log-likelihood gives the same answer and is usually easier. Remark 9.9 adds that multiplying the likelihood by any positive constant not depending on $\\theta$ leaves the MLE unchanged, so constants may be dropped.</p>" },
      { h: "Worked example: Bernoulli", body: "<p>For $X_1,\\dots,X_n \\sim \\text{Bernoulli}(p)$ (Example 9.10) the probability function is $f(x;p) = p^x(1-p)^{1-x}$. Write $S = \\sum_i X_i$ for the number of successes. Then:</p><ul class='steps'><li>$\\mathcal{L}_n(p) = \\prod_i p^{X_i}(1-p)^{1-X_i} = p^S (1-p)^{n-S}$.</li><li>$\\ell_n(p) = S\\log p + (n-S)\\log(1-p)$.</li><li>Differentiate with respect to $p$ and set equal to 0.</li><li>Solve to get $\\hat{p}_n = S/n$ — the sample proportion of successes.</li></ul><p>Figure 9.1 plots this likelihood for $n=20$ and $S=12$; it peaks at $\\hat{p}_n = 12/20 = 0.6$.</p>" },
      { h: "Worked example: Normal", body: "<p>For $X_1,\\dots,X_n \\sim N(\\mu,\\sigma^2)$ (Example 9.11), dropping constants the log-likelihood is $\\ell(\\mu,\\sigma) = -n\\log\\sigma - \\frac{nS^2}{2\\sigma^2} - \\frac{n(\\bar{X}-\\mu)^2}{2\\sigma^2}$, where $\\bar{X}$ is the sample mean and $S^2 = \\frac{1}{n}\\sum_i (X_i - \\bar{X})^2$. Setting the partial derivatives with respect to $\\mu$ and $\\sigma$ to zero gives $\\hat{\\mu} = \\bar{X}$ and $\\hat{\\sigma} = S$, which can be checked to be global maxima.</p>" },
      { h: "Worked example: Uniform, the hard case", body: "<p>For $X_1,\\dots,X_n \\sim \\text{Unif}(0,\\theta)$ (Example 9.12, labelled a hard example), $f(x;\\theta) = 1/\\theta$ on $[0,\\theta]$ and 0 outside. Let $X_{(n)} = \\max\\{X_1,\\dots,X_n\\}$ be the largest data value. If $\\theta \\lt X_{(n)}$ then some data point lies outside $[0,\\theta]$, making its density 0 and so $\\mathcal{L}_n(\\theta) = 0$. If $\\theta \\geq X_{(n)}$ then every point is inside and $\\mathcal{L}_n(\\theta) = \\theta^{-n}$, which strictly decreases in $\\theta$. So the likelihood is maximized at the smallest allowed value, giving $\\hat{\\theta}_n = X_{(n)}$. Figure 9.2 shows the likelihood jumping up at $X_{(n)}$ then decaying.</p>" }
    ],
    takeaways: [
      "The likelihood is the joint density read as a function of the parameter.",
      "The MLE maximizes the likelihood; log-likelihood gives the same maximizer and is easier.",
      "Bernoulli MLE is S/n; Normal MLE is the sample mean and S.",
      "The Uniform(0, theta) MLE is the data maximum — a non-smooth, instructive case."
    ]
  });

  // 3 — Properties of the MLE
  B({
    id: "aos-ch9-mle-properties",
    chapter: "Chapter 9",
    title: "Properties of the MLE",
    tagline: "Under regularity conditions the MLE is consistent, equivariant, and asymptotically Normal.",
    sections: [
      { h: "The main properties", body: "<p>Under regularity conditions (smoothness conditions on $f(x;\\theta)$, assumed to hold tacitly) the MLE has several appealing properties listed in Section 9.4. Writing $\\theta_\\star$ for the true parameter value:</p><ul class='steps'><li><strong>Consistent</strong>: $\\hat{\\theta}_n \\xrightarrow{P} \\theta_\\star$ (it converges in probability to the truth).</li><li><strong>Equivariant</strong>: if $\\hat{\\theta}_n$ is the MLE of $\\theta$ then $g(\\hat{\\theta}_n)$ is the MLE of $g(\\theta)$.</li><li><strong>Asymptotically Normal</strong>: $(\\hat{\\theta} - \\theta_\\star)/\\widehat{\\text{se}} \\rightsquigarrow N(0,1)$, and the estimated standard error $\\widehat{\\text{se}}$ can often be computed analytically.</li><li><strong>Asymptotically optimal / efficient</strong>: roughly, among well-behaved estimators the MLE has the smallest variance for large samples.</li><li>It is approximately the Bayes estimator.</li></ul>" },
      { h: "Consistency", body: "<p>Consistency means the MLE converges in probability to the true value. The argument (Section 9.5) uses the <strong>Kullback-Leibler distance</strong> between two densities, $D(f,g) = \\int f(x)\\log(f(x)/g(x))\\,dx$, which satisfies $D(f,g) \\geq 0$ and $D(f,f) = 0$ (it is not a true distance because it is not symmetric). A model is <strong>identifiable</strong> if different parameter values give different distributions, i.e. $\\theta \\neq \\psi$ implies $D(\\theta,\\psi) \\gt 0$. Maximizing $\\ell_n(\\theta)$ is equivalent to maximizing $M_n(\\theta) = \\frac{1}{n}\\sum_i \\log(f(X_i;\\theta)/f(X_i;\\theta_\\star))$, which by the law of large numbers converges to $-D(\\theta_\\star,\\theta)$. That limit is maximized exactly at $\\theta_\\star$, so the maximizer tends to $\\theta_\\star$ (formalized in Theorem 9.13).</p>" },
      { h: "Equivariance", body: "<p>Theorem 9.14: if $\\tau = g(\\theta)$ and $\\hat{\\theta}_n$ is the MLE of $\\theta$, then $\\hat{\\tau}_n = g(\\hat{\\theta}_n)$ is the MLE of $\\tau$. The proof reparametrizes through the inverse $h = g^{-1}$ and shows the likelihood in terms of $\\tau$ is maximized exactly when $\\theta$ is. Example 9.15: if $X_1,\\dots,X_n \\sim N(\\theta,1)$ so the MLE of $\\theta$ is $\\bar{X}_n$, then the MLE of $\\tau = e^\\theta$ is simply $\\hat{\\tau} = e^{\\bar{X}}$.</p>" },
      { h: "Asymptotic normality in brief", body: "<p>The asymptotic-Normality property is developed in Section 9.7 via the score function and Fisher information, and gives the practical 95% confidence interval $\\hat{\\theta}_n \\pm 2\\,\\widehat{\\text{se}}$ — covered in the dedicated lessons that follow. Wasserman cautions that all these properties depend on the regularity conditions; in sufficiently complicated problems they fail and the MLE may no longer be a good estimator.</p>" }
    ],
    takeaways: [
      "MLE properties hold only under regularity (smoothness) conditions.",
      "Consistency uses the Kullback-Leibler distance and an identifiable model.",
      "Equivariance: the MLE of g(theta) is g(MLE) — e.g. MLE of e^theta is e^xbar.",
      "The MLE is also asymptotically Normal and efficient."
    ]
  });

  // 4 — Optimality & Cramér-Rao lower bound
  B({
    id: "aos-ch9-optimality",
    chapter: "Chapter 9",
    title: "Optimality and efficiency",
    tagline: "The MLE has the smallest asymptotic variance among reasonable estimators.",
    sections: [
      { h: "Comparing the MLE to the median", body: "<p>For $X_1,\\dots,X_n \\sim N(\\theta,\\sigma^2)$ the MLE is $\\hat{\\theta}_n = \\bar{X}_n$, which satisfies $\\sqrt{n}(\\hat{\\theta}_n - \\theta) \\rightsquigarrow N(0,\\sigma^2)$. Another reasonable estimator is the sample median $\\tilde{\\theta}_n$. The book proves the median satisfies $\\sqrt{n}(\\tilde{\\theta}_n - \\theta) \\rightsquigarrow N(0, \\sigma^2 \\frac{\\pi}{2})$. Both converge to the right value, but the median has the larger asymptotic variance.</p>" },
      { h: "Asymptotic relative efficiency", body: "<p>More generally, if two estimators satisfy $\\sqrt{n}(T_n - \\theta) \\rightsquigarrow N(0,t^2)$ and $\\sqrt{n}(U_n - \\theta) \\rightsquigarrow N(0,u^2)$, define the <strong>asymptotic relative efficiency</strong> $\\text{ARE}(U,T) = t^2/u^2$. For the Normal example the median-vs-mean efficiency is:</p><ul class='steps'><li>Mean asymptotic variance factor: $\\sigma^2$.</li><li>Median asymptotic variance factor: $\\sigma^2 \\pi / 2$.</li><li>$\\text{ARE}(\\tilde{\\theta}_n, \\hat{\\theta}_n) = \\sigma^2 / (\\sigma^2 \\pi/2) = 2/\\pi \\approx 0.63$.</li></ul><p>The interpretation: using the median is like throwing away about 37% of the data — you are effectively using only a fraction of it.</p>" },
      { h: "The efficiency theorem", body: "<p>Theorem 9.23 states that if $\\hat{\\theta}_n$ is the MLE and $\\tilde{\\theta}_n$ is any other estimator, then $\\text{ARE}(\\tilde{\\theta}_n, \\hat{\\theta}_n) \\leq 1$. Thus the MLE has the smallest (asymptotic) variance, and we say it is <strong>efficient</strong> or <strong>asymptotically optimal</strong>. This is the practical content of the Cramér-Rao idea here: no well-behaved competitor beats the MLE asymptotically. Wasserman flags that the result is more subtle in full generality, and that it relies on the assumed model being correct — if the model is wrong, the MLE may no longer be optimal.</p>" }
    ],
    takeaways: [
      "ARE(U, T) = t^2 / u^2 compares two estimators' asymptotic variances.",
      "For the Normal mean vs median, ARE = 2/pi ≈ 0.63.",
      "Theorem 9.23: any estimator has ARE ≤ 1 against the MLE, so the MLE is efficient.",
      "Efficiency assumes the model is correct."
    ]
  });
  window.CODEVIZ["aos-ch9-optimality"] = {
    charts: [{
      type: "bars",
      title: "Asymptotic variance factor: mean (MLE) vs median, Normal model (sigma=1)",
      interpret: "The median's asymptotic variance is pi/2 ≈ 1.57 times larger than the mean's, so ARE = 2/pi ≈ 0.63.",
      labels: ["MLE (mean)", "Median"],
      values: [1.0, 1.5708],
      valueLabels: ["1.00", "1.57"],
      colors: ["#4ea1ff", "#ffb454"]
    }]
  };

  // 5 — Score, Fisher information, asymptotic normality, delta method, multiparameter
  B({
    id: "aos-ch9-fisher-delta",
    chapter: "Chapter 9",
    title: "Fisher information and the delta method",
    tagline: "Fisher information gives the MLE's standard error; the delta method transfers it to functions of the parameter.",
    sections: [
      { h: "Score function and Fisher information", body: "<p>The <strong>score function</strong> (Definition 9.16) is the derivative of the log-density with respect to the parameter, $s(X;\\theta) = \\partial \\log f(X;\\theta)/\\partial\\theta$. The <strong>Fisher information</strong> is $I_n(\\theta) = \\mathbb{V}_\\theta(\\sum_{i=1}^n s(X_i;\\theta)) = \\sum_{i=1}^n \\mathbb{V}_\\theta(s(X_i;\\theta))$, the variance of the total score. Lemma 9.31 shows the score has mean zero, $\\mathbb{E}_\\theta[s(X;\\theta)] = 0$, so its variance equals $\\mathbb{E}_\\theta(s^2)$. Theorem 9.17 gives $I_n(\\theta) = n I(\\theta)$ and the convenient second-derivative form $I(\\theta) = -\\mathbb{E}_\\theta(\\partial^2 \\log f(X;\\theta)/\\partial\\theta^2)$.</p>" },
      { h: "Asymptotic normality and confidence interval", body: "<p>Theorem 9.18 (Asymptotic Normality of the MLE): with $\\text{se} = \\sqrt{1/I_n(\\theta)}$ we have $(\\hat{\\theta}_n - \\theta)/\\text{se} \\rightsquigarrow N(0,1)$, and this stays true if we plug in the estimated $\\widehat{\\text{se}} = \\sqrt{1/I_n(\\hat{\\theta}_n)}$. So $\\hat{\\theta}_n \\approx N(\\theta, \\widehat{\\text{se}}^2)$. Theorem 9.19 turns this into the interval $C_n = (\\hat{\\theta}_n - z_{\\alpha/2}\\widehat{\\text{se}},\\ \\hat{\\theta}_n + z_{\\alpha/2}\\widehat{\\text{se}})$ with coverage tending to $1-\\alpha$. For $\\alpha = 0.05$, $z_{\\alpha/2} = 1.96 \\approx 2$, giving the rule of thumb $\\hat{\\theta}_n \\pm 2\\,\\widehat{\\text{se}}$.</p>" },
      { h: "Worked example: Bernoulli information", body: "<p>For $X_1,\\dots,X_n \\sim \\text{Bernoulli}(p)$ (Example 9.20):</p><ul class='steps'><li>Score: $s(X;p) = X/p - (1-X)/(1-p)$.</li><li>Negative derivative: $-s'(X;p) = X/p^2 + (1-X)/(1-p)^2$.</li><li>Take the expectation (using $\\mathbb{E}X = p$): $I(p) = p/p^2 + (1-p)/(1-p)^2 = 1/(p(1-p))$.</li><li>Standard error: $\\widehat{\\text{se}} = \\sqrt{1/(nI(\\hat{p}_n))} = \\sqrt{\\hat{p}_n(1-\\hat{p}_n)/n}$.</li></ul><p>For Poisson$(\\lambda)$ (Example 9.22), $I_1(\\lambda) = 1/\\lambda$, the MLE is $\\hat{\\lambda}_n = \\bar{X}_n$, and $\\widehat{\\text{se}} = \\sqrt{\\hat{\\lambda}_n/n}$.</p>" },
      { h: "The delta method", body: "<p>If $\\tau = g(\\theta)$ for a smooth $g$, its MLE is $\\hat{\\tau} = g(\\hat{\\theta})$ by equivariance. The <strong>delta method</strong> (Theorem 9.24) gives its standard error: if $g$ is differentiable with $g'(\\theta) \\neq 0$, then $(\\hat{\\tau}_n - \\tau)/\\widehat{\\text{se}}(\\hat{\\tau}) \\rightsquigarrow N(0,1)$ where $\\widehat{\\text{se}}(\\hat{\\tau}_n) = |g'(\\hat{\\theta})|\\,\\widehat{\\text{se}}(\\hat{\\theta}_n)$. So you just multiply the parameter's standard error by the absolute slope of $g$. Example 9.25: for Bernoulli with $\\psi = \\log(p/(1-p))$, $g'(p) = 1/(p(1-p))$, giving $\\widehat{\\text{se}}(\\hat{\\psi}_n) = 1/\\sqrt{n\\hat{p}_n(1-\\hat{p}_n)}$.</p>" },
      { h: "Multiparameter models", body: "<p>For $\\theta = (\\theta_1,\\dots,\\theta_k)$ (Section 9.10), let $H_{jk} = \\partial^2 \\ell_n/\\partial\\theta_j\\partial\\theta_k$ be the second derivatives of the log-likelihood. The <strong>Fisher Information Matrix</strong> is $I_n(\\theta) = -[\\mathbb{E}_\\theta(H_{jk})]$, and its inverse is $J_n = I_n^{-1}$. Theorem 9.27: $(\\hat{\\theta} - \\theta) \\approx N(0, J_n)$; the standard error of the $j$-th component is $\\widehat{\\text{se}}_j = \\sqrt{J_n(j,j)}$, the $j$-th diagonal element, and $\\text{Cov}(\\hat{\\theta}_j,\\hat{\\theta}_k) \\approx J_n(j,k)$. The multiparameter delta method (Theorem 9.28) uses the gradient $\\nabla g$ to give $\\widehat{\\text{se}}(\\hat{\\tau}) = \\sqrt{(\\hat{\\nabla} g)^T \\hat{J}_n (\\hat{\\nabla} g)}$.</p>" }
    ],
    takeaways: [
      "Fisher information I(theta) = -E[second derivative of log f]; se = sqrt(1/(nI)).",
      "Asymptotic-Normality gives the interval theta-hat ± 2 se (95%).",
      "Bernoulli: I(p) = 1/(p(1-p)); se = sqrt(p-hat(1-p-hat)/n).",
      "Delta method: se(g(theta-hat)) = |g'| × se(theta-hat).",
      "Multiparameter: invert the Fisher information matrix to get the covariance."
    ]
  });

  // 6 — Parametric bootstrap
  B({
    id: "aos-ch9-parametric-bootstrap",
    chapter: "Chapter 9",
    title: "The parametric bootstrap",
    tagline: "Estimate standard errors by simulating data from the fitted model.",
    sections: [
      { h: "One change from the nonparametric bootstrap", body: "<p>For parametric models, standard errors and confidence intervals can also be found by the bootstrap (Section 9.11). There is exactly one change from the nonparametric version: instead of resampling from the empirical distribution $\\hat{F}_n$, the <strong>parametric bootstrap</strong> samples new data from the fitted model $f(x;\\hat{\\theta}_n)$, where $\\hat{\\theta}_n$ is the MLE or the method-of-moments estimator.</p>" },
      { h: "Worked procedure", body: "<p>Example 9.30 estimates the standard error of $\\tau = g(\\mu,\\sigma) = \\sigma/\\mu$ for the Normal model:</p><ul class='steps'><li>Simulate a new sample $X_1^*,\\dots,X_n^* \\sim N(\\hat{\\mu}, \\hat{\\sigma}^2)$ from the fitted Normal.</li><li>Compute $\\hat{\\mu}^* = \\frac{1}{n}\\sum_i X_i^*$ and $\\hat{\\sigma}^{2*} = \\frac{1}{n}\\sum_i (X_i^* - \\hat{\\mu}^*)^2$.</li><li>Form the replication $\\hat{\\tau}^* = g(\\hat{\\mu}^*, \\hat{\\sigma}^*) = \\hat{\\sigma}^*/\\hat{\\mu}^*$.</li><li>Repeat $B$ times to get replications $\\hat{\\tau}_1^*,\\dots,\\hat{\\tau}_B^*$.</li><li>Estimate the standard error as their sample standard deviation: $\\widehat{\\text{se}}_{\\text{boot}} = \\sqrt{\\frac{1}{B}\\sum_{b=1}^B (\\hat{\\tau}_b^* - \\bar{\\hat{\\tau}})^2}$.</li></ul>" },
      { h: "Bootstrap versus delta method", body: "<p>Wasserman contrasts the two approaches: the bootstrap is much easier to use than the delta method because it requires no calculus. The delta method's advantage is that it gives a closed-form expression for the standard error. For the same $\\sigma/\\mu$ example, the delta method (Example 9.29) yields the explicit formula $\\widehat{\\text{se}}(\\hat{\\tau}) = \\frac{1}{\\sqrt{n}}\\sqrt{\\frac{1}{\\hat{\\mu}^4} + \\frac{\\hat{\\sigma}^2}{2\\hat{\\mu}^2}}$, whereas the bootstrap just simulates.</p>" }
    ],
    takeaways: [
      "Parametric bootstrap: sample from f(x; theta-hat) instead of the empirical distribution.",
      "Compute the statistic on each simulated sample, repeat B times.",
      "The standard error is the standard deviation of the B replications.",
      "Easier than the delta method; the delta method gives a closed form instead."
    ]
  });

  // 7 — Sufficiency
  B({
    id: "aos-ch9-sufficiency",
    chapter: "Chapter 9",
    title: "Sufficiency",
    tagline: "A sufficient statistic keeps all the information the data carry about the parameter.",
    sections: [
      { h: "Definition", body: "<p>A <strong>statistic</strong> is any function $T(X^n)$ of the data. A sufficient statistic is one that retains all the information about the parameter (Section 9.13.2). Formally (Definition 9.32): write $x^n \\leftrightarrow y^n$ if $f(x^n;\\theta) = c\\, f(y^n;\\theta)$ for some constant $c$ that may depend on the two data sets but not on $\\theta$. A statistic $T$ is <strong>sufficient</strong> if $T(x^n) = T(y^n)$ implies $x^n \\leftrightarrow y^n$. Intuitively, two data sets with the same value of a sufficient statistic give likelihood functions of the same shape, so you can reconstruct the likelihood knowing only $T(X^n)$.</p>" },
      { h: "Examples", body: "<p>Example 9.33: for Bernoulli$(p)$, $\\mathcal{L}(p) = p^S(1-p)^{n-S}$ depends on the data only through $S = \\sum_i X_i$, so $S$ is sufficient. Example 9.34: for $N(\\mu,\\sigma)$, the joint density depends on the data only through $T = (\\bar{X}, S)$ (sample mean and sample variance), so that pair is sufficient. Sufficient statistics are far from unique — e.g. $U = (17\\bar{X}, S)$ is also sufficient, and so is the whole data set. The book lists four statistics for the Normal model:</p><table class='extable'><thead><tr><th>Statistic</th><th>What it is</th><th>Sufficient?</th></tr></thead><tbody><tr><td class='row-h'>$T_1$</td><td>the whole data set $(X_1,\\dots,X_n)$</td><td>Yes</td></tr><tr><td class='row-h'>$T_2$</td><td>$(\\bar{X}, S)$</td><td>Yes</td></tr><tr><td class='row-h'>$T_3$</td><td>$\\bar{X}$ alone</td><td>No</td></tr><tr><td class='row-h'>$T_4$</td><td>$(\\bar{X}, S, X_3)$</td><td>Yes (redundant)</td></tr></tbody></table><p>$T_3$ fails because you cannot recover the likelihood for $(\\mu,\\sigma)$ from the mean alone.</p>" },
      { h: "Minimal sufficiency", body: "<p>A statistic $T$ is <strong>minimal sufficient</strong> (Definition 9.35) if it is sufficient and is a function of every other sufficient statistic — the most concise summary. Theorem 9.36: $T$ is minimal sufficient if and only if $T(x^n) = T(y^n)$ exactly when $x^n \\leftrightarrow y^n$. A sufficient statistic induces a partition of the outcome space, and sufficiency can be viewed in terms of these partitions. Example 9.37 illustrates this with two Bernoulli$(\\theta)$ draws, comparing the statistics $V = X_1$, $T = \\sum_i X_i$, and $U = (T, X_1)$ across the four possible outcomes.</p>" }
    ],
    takeaways: [
      "A sufficient statistic preserves all the parameter information in the data.",
      "Two data sets sharing its value give same-shaped likelihoods.",
      "Bernoulli: sum is sufficient; Normal: (mean, S) is sufficient — but xbar alone is not.",
      "Minimal sufficient = sufficient and a function of every other sufficient statistic."
    ]
  });
})();
