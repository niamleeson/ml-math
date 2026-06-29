/* All of Statistics (Larry Wasserman) — Chapter 6: "Models, Statistical Inference and Learning".
   Self-registering book lessons, one per key concept. Faithful summary, original wording. */
(function () {
  window.LESSONS = window.LESSONS || [];
  window.CODEVIZ = window.CODEVIZ || {};
  const M = "All of Statistics";
  const BOOK = "All of Statistics";
  const B = (o) => window.LESSONS.push(Object.assign({ module: M, template: "book", book: BOOK }, o));

  // 1 — Parametric and nonparametric models
  B({
    id: "aos-ch6-parametric-nonparametric",
    chapter: "Chapter 6",
    title: "Parametric and Nonparametric Models",
    tagline: "A statistical model is a set of distributions; it is parametric when a finite list of numbers pins one down.",
    sections: [
      { h: "What inference is trying to do", body:
        "<p>Statistical inference — what computer scientists call \"learning\" — is the job of using observed data to work backward to the distribution that produced it. Wasserman frames the whole chapter around one question: given a sample $X_1, \\ldots, X_n$ drawn from a distribution $F$, how do we infer $F$? (Here $X_1, \\ldots, X_n$ are the $n$ observed data values, and $F$ is the cumulative distribution function — the rule that says how likely the data are to fall below any given value.) Sometimes we do not want all of $F$, only a single feature of it, such as its mean.</p>" },
      { h: "Statistical model and parametric model", body:
        "<p>A <strong>statistical model</strong> $\\mathfrak{F}$ is simply a set of distributions (or densities, or regression functions). A <strong>parametric model</strong> is a set $\\mathfrak{F}$ that can be described by a finite number of parameters. The book's lead example is assuming the data are Normal, which gives the two-parameter family</p>" +
        "<p>$\\mathfrak{F} = \\left\\{ f(x; \\mu, \\sigma) = \\frac{1}{\\sigma\\sqrt{2\\pi}} \\exp\\left\\{ -\\frac{1}{2\\sigma^2}(x-\\mu)^2 \\right\\}, \\ \\mu \\in \\mathbb{R}, \\ \\sigma \\gt 0 \\right\\}.$</p>" +
        "<p>Here $x$ is a possible value of the random variable, while $\\mu$ (the mean) and $\\sigma$ (the standard deviation) are the two parameters. In general a parametric model is written $\\mathfrak{F} = \\{ f(x; \\theta) : \\theta \\in \\Theta \\}$, where $\\theta$ is the unknown parameter (possibly a vector) living in the <strong>parameter space</strong> $\\Theta$. If $\\theta$ is a vector but only one component interests us, the rest are called <strong>nuisance parameters</strong>.</p>" },
      { h: "Nonparametric models", body:
        "<p>A <strong>nonparametric model</strong> is a set $\\mathfrak{F}$ that <em>cannot</em> be captured by a finite number of parameters. The book's example is $\\mathfrak{F}_{\\mathrm{ALL}}$, the set of all CDFs — far too big to index with a fixed list of numbers. Wasserman notes the parametric/nonparametric distinction is actually more subtle than this, but a rigorous definition is not needed here.</p>" +
        "<p>The chapter's examples sketch the range of problems:</p>" +
        "<ul class=\"steps\">" +
        "<li>One-dimensional parametric estimation: $X_1, \\ldots, X_n \\sim \\text{Bernoulli}(p)$, estimate the single parameter $p$.</li>" +
        "<li>Two-dimensional parametric estimation: data are Normal, estimate $\\mu$ and $\\sigma$; if only $\\mu$ matters then $\\sigma$ is a nuisance parameter.</li>" +
        "<li>Nonparametric CDF estimation: estimate $F$ assuming only $F \\in \\mathfrak{F}_{\\mathrm{ALL}}$.</li>" +
        "<li>Nonparametric density estimation: estimating the density $f = F'$ needs a smoothness restriction, e.g. the <strong>Sobolev space</strong> $\\mathfrak{F}_{\\mathrm{SOB}} = \\{ f : \\int (f''(x))^2 dx \\lt \\infty \\}$ — functions that are not \"too wiggly.\"</li>" +
        "<li>Estimating a functional, such as the mean $\\mu = T(F) = \\int x \\, dF(x)$ — any number computed from $F$ is a statistical functional.</li>" +
        "</ul>" },
      { h: "Regression, prediction, classification", body:
        "<p>With paired data $(X_1, Y_1), \\ldots, (X_n, Y_n)$, $X$ is the <strong>predictor</strong> (regressor, feature, independent variable) and $Y$ is the <strong>outcome</strong> (response, dependent variable). The <strong>regression function</strong> is the conditional mean $r(x) = \\mathbb{E}(Y \\mid X = x)$. If we restrict $r$ to a finite-dimensional family (e.g. straight lines) the model is parametric; otherwise it is nonparametric. Guessing $Y$ for a new $X$ is <strong>prediction</strong>; when $Y$ is discrete it is <strong>classification</strong>; estimating $r$ itself is <strong>regression</strong> or curve estimation. Any regression can be written $Y = r(X) + \\epsilon$ with $\\mathbb{E}(\\epsilon) = 0$, simply by defining $\\epsilon = Y - r(X)$.</p>" }
    ],
    takeaways: [
      "A statistical model is a set of distributions; parametric = finite parameters, nonparametric = not.",
      "Normal family is the lead parametric example: parameters $\\mu$ and $\\sigma$.",
      "$\\mathfrak{F}_{\\mathrm{ALL}}$ (all CDFs) is the canonical nonparametric model.",
      "Regression function $r(x) = \\mathbb{E}(Y \\mid X = x)$; prediction vs. classification vs. curve estimation."
    ]
  });

  // 2 — Point estimation: bias, standard error, MSE, consistency
  B({
    id: "aos-ch6-point-estimation",
    chapter: "Chapter 6",
    title: "Point Estimation",
    tagline: "A single best guess, judged by bias, standard error, and mean squared error — with MSE = bias² + variance.",
    sections: [
      { h: "Estimators and bias", body:
        "<p><strong>Point estimation</strong> means giving one \"best guess\" of some quantity of interest — a parameter, a CDF $F$, a density $f$, a regression function $r$, or a future value $Y$. By convention a point estimate of $\\theta$ is written $\\hat{\\theta}$ or $\\hat{\\theta}_n$. The key idea: $\\theta$ is a fixed unknown number, but $\\hat{\\theta}$ depends on the data, so $\\hat{\\theta}$ is itself a random variable. Formally, for IID data $X_1, \\ldots, X_n$, a point estimator is any function of the data, $\\hat{\\theta}_n = g(X_1, \\ldots, X_n)$.</p>" +
        "<p>The <strong>bias</strong> of an estimator measures how far off it is on average:</p>" +
        "<p>$\\mathrm{bias}(\\hat{\\theta}_n) = \\mathbb{E}_\\theta(\\hat{\\theta}_n) - \\theta.$</p>" +
        "<p>An estimator is <strong>unbiased</strong> if $\\mathbb{E}(\\hat{\\theta}_n) = \\theta$. Wasserman remarks that unbiasedness once got a lot of attention but is now seen as less important — many useful estimators are biased.</p>" },
      { h: "Standard error and consistency", body:
        "<p>The distribution of $\\hat{\\theta}_n$ is its <strong>sampling distribution</strong>. The standard deviation of that distribution is the <strong>standard error</strong>:</p>" +
        "<p>$\\mathrm{se} = \\mathrm{se}(\\hat{\\theta}_n) = \\sqrt{\\mathbb{V}(\\hat{\\theta}_n)}$</p>" +
        "<p>(here $\\mathbb{V}$ is the variance — the average squared spread of the estimator around its mean). The se often depends on the unknown $F$, so it is usually itself estimated; the estimated standard error is written $\\hat{\\mathrm{se}}$. A reasonable demand on an estimator is that it home in on the truth as data accumulate. That is <strong>consistency</strong> (Definition 6.7): $\\hat{\\theta}_n$ is consistent if $\\hat{\\theta}_n \\xrightarrow{\\mathrm{P}} \\theta$ (it converges to $\\theta$ in probability).</p>" },
      { h: "Mean squared error and its decomposition", body:
        "<p>The overall quality of an estimate is often measured by the <strong>mean squared error</strong>:</p>" +
        "<p>$\\mathrm{MSE} = \\mathbb{E}_\\theta(\\hat{\\theta}_n - \\theta)^2.$</p>" +
        "<p>The expectation $\\mathbb{E}_\\theta$ is taken with respect to the data-generating distribution, <em>not</em> over a distribution for $\\theta$ ($\\theta$ is fixed). Theorem 6.9 splits the MSE into two interpretable pieces:</p>" +
        "<p>$\\mathrm{MSE} = \\mathrm{bias}^2(\\hat{\\theta}_n) + \\mathbb{V}_\\theta(\\hat{\\theta}_n).$</p>" +
        "<p>The book's proof writes $\\bar{\\theta}_n = \\mathbb{E}_\\theta(\\hat{\\theta}_n)$ and adds-and-subtracts it inside the square:</p>" +
        "<ul class=\"steps\">" +
        "<li>$\\mathbb{E}_\\theta(\\hat{\\theta}_n - \\theta)^2 = \\mathbb{E}_\\theta(\\hat{\\theta}_n - \\bar{\\theta}_n + \\bar{\\theta}_n - \\theta)^2$ — split the error into \"scatter around its mean\" plus \"mean minus truth.\"</li>" +
        "<li>Expand the square: $= \\mathbb{E}_\\theta(\\hat{\\theta}_n - \\bar{\\theta}_n)^2 + 2(\\bar{\\theta}_n - \\theta)\\,\\mathbb{E}_\\theta(\\hat{\\theta}_n - \\bar{\\theta}_n) + \\mathbb{E}_\\theta(\\bar{\\theta}_n - \\theta)^2.$</li>" +
        "<li>The cross term vanishes because $\\mathbb{E}_\\theta(\\hat{\\theta}_n - \\bar{\\theta}_n) = \\bar{\\theta}_n - \\bar{\\theta}_n = 0.$</li>" +
        "<li>What remains is $(\\bar{\\theta}_n - \\theta)^2 + \\mathbb{E}_\\theta(\\hat{\\theta}_n - \\bar{\\theta}_n)^2 = \\mathrm{bias}^2(\\hat{\\theta}_n) + \\mathbb{V}(\\hat{\\theta}_n).$</li>" +
        "</ul>" +
        "<p>Theorem 6.10 draws the payoff: if both $\\mathrm{bias} \\to 0$ and $\\mathrm{se} \\to 0$ as $n \\to \\infty$, then $\\mathrm{MSE} \\to 0$, so $\\hat{\\theta}_n \\xrightarrow{\\mathrm{P}} \\theta$ — the estimator is consistent.</p>" },
      { h: "Worked example — the Bernoulli mean", body:
        "<p>Let $X_1, \\ldots, X_n \\sim \\text{Bernoulli}(p)$ (each is 0 or 1, equal to 1 with probability $p$) and let $\\hat{p}_n = n^{-1}\\sum_i X_i$ be the sample fraction of ones (Examples 6.8 and 6.11):</p>" +
        "<ul class=\"steps\">" +
        "<li>$\\mathbb{E}(\\hat{p}_n) = n^{-1}\\sum_i \\mathbb{E}(X_i) = p$, so the bias is $p - p = 0$ — $\\hat{p}_n$ is unbiased.</li>" +
        "<li>The standard error is $\\mathrm{se} = \\sqrt{\\mathbb{V}(\\hat{p}_n)} = \\sqrt{p(1-p)/n}$.</li>" +
        "<li>Since the parameters are unknown, the estimated standard error plugs in $\\hat{p}_n$: $\\hat{\\mathrm{se}} = \\sqrt{\\hat{p}_n(1-\\hat{p}_n)/n}$.</li>" +
        "<li>As $n \\to \\infty$, $\\mathrm{se} = \\sqrt{p(1-p)/n} \\to 0$ and bias is already 0, so $\\hat{p}_n \\xrightarrow{\\mathrm{P}} p$ — it is a consistent estimator.</li>" +
        "</ul>" +
        "<p>The table shows how the standard error shrinks with sample size at $p = 0.5$ (where $p(1-p) = 0.25$ is largest):</p>" +
        "<table class=\"extable\"><thead><tr><th>Sample size $n$</th><th class=\"num\">$\\mathrm{se} = \\sqrt{0.25/n}$</th></tr></thead><tbody>" +
        "<tr><td class=\"row-h\">25</td><td class=\"num\">0.100</td></tr>" +
        "<tr><td class=\"row-h\">100</td><td class=\"num\">0.050</td></tr>" +
        "<tr><td class=\"row-h\">400</td><td class=\"num\">0.025</td></tr>" +
        "<tr><td class=\"row-h\">2500</td><td class=\"num\">0.010</td></tr>" +
        "</tbody></table>" }
    ],
    takeaways: [
      "$\\hat{\\theta}$ is random because it depends on the data; $\\theta$ is a fixed unknown.",
      "$\\mathrm{bias} = \\mathbb{E}(\\hat{\\theta}_n) - \\theta$; standard error $= \\sqrt{\\mathbb{V}(\\hat{\\theta}_n)}$.",
      "$\\mathrm{MSE} = \\mathrm{bias}^2 + \\mathrm{variance}$ (Theorem 6.9).",
      "bias $\\to 0$ and se $\\to 0$ imply consistency (Theorem 6.10).",
      "Bernoulli: $\\hat{p}_n$ is unbiased with $\\mathrm{se} = \\sqrt{p(1-p)/n}$, and consistent."
    ]
  });

  // 3 — Confidence sets
  B({
    id: "aos-ch6-confidence-sets",
    chapter: "Chapter 6",
    title: "Confidence Sets",
    tagline: "A random interval that traps the fixed parameter with stated probability — a statement about the interval, not about θ.",
    sections: [
      { h: "Definition and coverage", body:
        "<p>A <strong>$1-\\alpha$ confidence interval</strong> for $\\theta$ is an interval $C_n = (a, b)$, where the endpoints $a = a(X_1, \\ldots, X_n)$ and $b = b(X_1, \\ldots, X_n)$ are functions of the data, satisfying</p>" +
        "<p>$\\mathbb{P}_\\theta(\\theta \\in C_n) \\geq 1-\\alpha \\quad \\text{for all } \\theta \\in \\Theta.$</p>" +
        "<p>In words, the interval traps $\\theta$ with probability at least $1-\\alpha$; the quantity $1-\\alpha$ is the <strong>coverage</strong>. The common choice is 95% coverage, i.e. $\\alpha = 0.05$. When $\\theta$ is a vector, the interval is replaced by a <strong>confidence set</strong> such as a sphere or ellipse.</p>" },
      { h: "The crucial warning", body:
        "<p>The book stresses twice, in bold: $C_n$ is random and $\\theta$ is fixed. A confidence interval is therefore <em>not</em> a probability statement about $\\theta$ — since $\\theta$ is not a random variable. The textbook gloss \"repeat the experiment many times and 95% of the intervals contain $\\theta$\" is technically correct but useless, because we rarely repeat the same experiment.</p>" +
        "<p>Wasserman offers a cleaner reading: imagine that on day 1 you build a 95% interval for some parameter $\\theta_1$, on day 2 a 95% interval for an unrelated $\\theta_2$, on day 3 for an unrelated $\\theta_3$, and so on. Then about 95% of all these intervals — across entirely different problems — will trap their true parameter. No need to picture repeating one experiment.</p>" },
      { h: "Examples that sharpen the idea", body:
        "<ul class=\"steps\">" +
        "<li>Opinion polls (Example 6.13): a report like \"83% favor the policy, accurate to within 4 points 95% of the time\" means $83 \\pm 4$ is a 95% confidence interval for the true proportion $p$. Form intervals this way every day for life and 95% will contain the truth — even though each day estimates a different quantity.</li>" +
        "<li>The Berger–Wolpert example (6.14): let $\\theta$ be a fixed number and $X_1, X_2$ each equal to $+1$ or $-1$ with probability $1/2$; observe $Y_i = \\theta + X_i$. The rule $C = \\{Y_1 - 1\\}$ if $Y_1 = Y_2$, else $C = \\{(Y_1 + Y_2)/2\\}$ satisfies $\\mathbb{P}_\\theta(\\theta \\in C) = 3/4$, so it is a 75% confidence interval. Yet if we observe $Y_1 = 15, Y_2 = 17$ we are <em>certain</em> $\\theta = 16$. Calling $\\{16\\}$ a 75% confidence interval is fine, but it is not a probability statement about $\\theta$.</li>" +
        "<li>Hoeffding-based coin interval (Example 6.15): with $C_n = (\\hat{p}_n - \\epsilon_n, \\ \\hat{p}_n + \\epsilon_n)$ and $\\epsilon_n^2 = \\log(2/\\alpha)/(2n)$, Hoeffding's inequality gives $\\mathbb{P}(p \\in C_n) \\geq 1-\\alpha$ for every $p$, so it is a valid $1-\\alpha$ interval.</li>" +
        "</ul>" },
      { h: "Normal-based intervals", body:
        "<p>An estimator is <strong>asymptotically Normal</strong> (Definition 6.12) if $(\\hat{\\theta}_n - \\theta)/\\mathrm{se} \\rightsquigarrow N(0,1)$. When $\\hat{\\theta}_n \\approx N(\\theta, \\hat{\\mathrm{se}}^2)$, Theorem 6.16 gives the interval $C_n = (\\hat{\\theta}_n - z_{\\alpha/2}\\hat{\\mathrm{se}}, \\ \\hat{\\theta}_n + z_{\\alpha/2}\\hat{\\mathrm{se}})$, where $z_{\\alpha/2} = \\Phi^{-1}(1 - \\alpha/2)$. For 95% coverage, $\\alpha = 0.05$ and $z_{\\alpha/2} = 1.96 \\approx 2$, giving the handy rule $\\hat{\\theta}_n \\pm 2\\,\\hat{\\mathrm{se}}$.</p>" +
        "<p>For the Bernoulli case (Example 6.17), $\\hat{\\mathrm{se}} = \\sqrt{\\hat{p}_n(1-\\hat{p}_n)/n}$, so an approximate $1-\\alpha$ interval is $\\hat{p}_n \\pm z_{\\alpha/2}\\sqrt{\\hat{p}_n(1-\\hat{p}_n)/n}$. This Normal-based interval is shorter than the Hoeffding one but only has approximate (large-sample) coverage.</p>" }
    ],
    takeaways: [
      "$1-\\alpha$ confidence interval: $\\mathbb{P}_\\theta(\\theta \\in C_n) \\geq 1-\\alpha$ for all $\\theta$.",
      "Warning: $C_n$ is random, $\\theta$ is fixed — not a probability statement about $\\theta$.",
      "Better mental model: 95% of intervals across many unrelated problems trap their parameter.",
      "Normal-based 95% rule of thumb: $\\hat{\\theta}_n \\pm 2\\,\\hat{\\mathrm{se}}$ (since $z_{0.025} = 1.96 \\approx 2$)."
    ]
  });

  // 4 — Hypothesis testing overview
  B({
    id: "aos-ch6-hypothesis-testing",
    chapter: "Chapter 6",
    title: "Hypothesis Testing",
    tagline: "Start from a default theory and ask whether the data give enough evidence to reject it.",
    sections: [
      { h: "The basic setup", body:
        "<p>In <strong>hypothesis testing</strong> we begin with a default theory, called the <strong>null hypothesis</strong> $H_0$, and ask whether the data give enough evidence to reject it. If they do not, we <em>retain</em> the null. (Wasserman credits Chris Genovese for \"retaining the null\"; other phrasings are \"accepting the null\" or \"failing to reject the null.\") This section is only an overview — the precise machinery comes later in the book.</p>" },
      { h: "Example — testing if a coin is fair", body:
        "<p>The chapter's lone testing example (6.18) is a coin. Let $X_1, \\ldots, X_n \\sim \\text{Bernoulli}(p)$ be $n$ independent flips, and suppose we want to test whether the coin is fair. The two hypotheses are:</p>" +
        "<ul class=\"steps\">" +
        "<li>$H_0 : p = 1/2$ — the coin is fair (the <strong>null hypothesis</strong>).</li>" +
        "<li>$H_1 : p \\neq 1/2$ — the coin is not fair (the <strong>alternative hypothesis</strong>).</li>" +
        "</ul>" +
        "<p>It is natural to reject $H_0$ when the test statistic $T = |\\hat{p}_n - (1/2)|$ — how far the observed fraction of heads strays from one-half — is large. Exactly how large $T$ must be before rejecting $H_0$ is left for the detailed treatment later; here the point is just the shape of the reasoning.</p>" }
    ],
    takeaways: [
      "Hypothesis testing pits a default $H_0$ against an alternative $H_1$.",
      "Insufficient evidence means retaining (not proving) the null.",
      "Fair-coin test: $H_0 : p = 1/2$ vs. $H_1 : p \\neq 1/2$.",
      "Reject when $T = |\\hat{p}_n - 1/2|$ is large; the threshold is set later."
    ]
  });
})();
