/* All of Statistics (Larry Wasserman) — Chapter 7: Estimating the CDF and Statistical Functionals */
(function () {
  window.LESSONS = window.LESSONS || [];
  window.CODEVIZ = window.CODEVIZ || {};
  const M = "All of Statistics";
  const B = (o) => window.LESSONS.push(Object.assign({ module: M, template: "book", book: "All of Statistics" }, o));

  B({
    id: "aos-ch7-empirical-distribution-function",
    chapter: "Chapter 7",
    title: "The empirical distribution function",
    tagline: "Estimate an unknown CDF by the step function that puts mass 1/n on every observed data point, and bound how far it can stray with the DKW inequality.",
    sections: [
      {
        h: "What we are estimating",
        body: "<p>Suppose we draw an IID sample $X_1,\\dots,X_n$ from some distribution $F$ on the real line. Here $F$ is the <em>cumulative distribution function</em> (CDF): for a number $x$, the value $F(x)$ is the probability that a draw falls at or below $x$. We do not assume $F$ has any particular form &mdash; this is <em>nonparametric</em> estimation. The natural estimate is the <strong>empirical distribution function</strong> $\\widehat{F}_n$.</p>"
      },
      {
        h: "Definition 7.1",
        body: "<p>$\\widehat{F}_n$ is itself a CDF: it places probability mass $1/n$ on each data point. Formally,</p><p>$$\\widehat{F}_n(x) = \\frac{\\sum_{i=1}^{n} I(X_i \\le x)}{n}$$</p><p>where the <em>indicator</em> $I(X_i \\le x)$ is the on/off switch that equals $1$ when $X_i \\le x$ and $0$ when $X_i \\gt x$. So $\\widehat{F}_n(x)$ is simply the fraction of the sample that is at or below $x$ &mdash; a staircase that jumps up by $1/n$ at every observation.</p>"
      },
      {
        h: "Example 7.2 — nerve data",
        body: "<p>Cox and Lewis (1966) reported $799$ waiting times between successive pulses along a nerve fiber. Figure 7.1 plots $\\widehat{F}_n$ as a solid staircase, with each waiting time drawn as a small vertical tick along the bottom. To estimate the fraction of waiting times falling between $.4$ and $.6$ seconds, take the difference of the empirical CDF at the two endpoints:</p><ul class=\"steps\"><li>$\\widehat{F}_n(.6) = .93$ &mdash; $93\\%$ of waiting times are at or below $.6$ seconds.</li><li>$\\widehat{F}_n(.4) = .84$ &mdash; $84\\%$ are at or below $.4$ seconds.</li><li>Estimated fraction in $(.4,.6]$ is $\\widehat{F}_n(.6) - \\widehat{F}_n(.4) = .93 - .84 = .09$.</li></ul>"
      },
      {
        h: "Why it works — Theorem 7.3",
        body: "<p>At any fixed point $x$, the empirical CDF is unbiased and consistent. Writing $\\mathbb{E}$ for expectation (long-run average), $\\mathbb{V}$ for variance (spread), and MSE for mean squared error:</p><ul class=\"steps\"><li>$\\mathbb{E}\\!\\left(\\widehat{F}_n(x)\\right) = F(x)$ &mdash; on average it hits the truth.</li><li>$\\mathbb{V}\\!\\left(\\widehat{F}_n(x)\\right) = \\dfrac{F(x)(1-F(x))}{n}$ &mdash; the spread shrinks like $1/n$.</li><li>$\\mathrm{MSE} = \\dfrac{F(x)(1-F(x))}{n} \\to 0$, so $\\widehat{F}_n(x) \\xrightarrow{\\;P\\;} F(x)$ (it converges in probability to $F(x)$).</li></ul><p>The <strong>Glivenko-Cantelli theorem</strong> (7.4) strengthens this to uniform convergence: $\\sup_x |\\widehat{F}_n(x) - F(x)| \\xrightarrow{\\;P\\;} 0$, where $\\sup_x$ means the largest gap over all $x$. So not just each point, but the worst point, gets arbitrarily close to the true curve.</p>"
      },
      {
        h: "The DKW inequality and a confidence band — Theorem 7.5, Example 7.6",
        body: "<p>The <strong>Dvoretzky-Kiefer-Wolfowitz (DKW) inequality</strong> bounds the chance that the worst-case gap exceeds any threshold $\\epsilon \\gt 0$:</p><p>$$\\mathbb{P}\\!\\left(\\sup_x |F(x) - \\widehat{F}_n(x)| \\gt \\epsilon\\right) \\le 2 e^{-2 n \\epsilon^2}.$$</p><p>This lets us draw a nonparametric $1-\\alpha$ confidence band around the whole curve. Define a lower and upper envelope, clipped to the valid range $[0,1]$:</p><ul class=\"steps\"><li>$L(x) = \\max\\{\\widehat{F}_n(x) - \\epsilon_n,\\ 0\\}$</li><li>$U(x) = \\min\\{\\widehat{F}_n(x) + \\epsilon_n,\\ 1\\}$</li><li>$\\epsilon_n = \\sqrt{\\dfrac{1}{2n}\\log\\!\\left(\\dfrac{2}{\\alpha}\\right)}$ &mdash; the half-width of the band.</li></ul><p>Then $\\mathbb{P}\\big(L(x) \\le F(x) \\le U(x)\\text{ for all }x\\big) \\ge 1-\\alpha$. For the nerve data with $n=799$ and a $95\\%$ band ($\\alpha = .05$): $\\epsilon_n = \\sqrt{\\tfrac{1}{2(799)}\\log(2/.05)} = .048$. These are the dashed lines bracketing the staircase in Figure 7.1.</p>"
      }
    ],
    takeaways: [
      "$\\widehat{F}_n$ is the staircase CDF that puts mass $1/n$ on each observation.",
      "$\\widehat{F}_n(x)$ is just the fraction of the sample at or below $x$.",
      "It is unbiased with variance $F(x)(1-F(x))/n$, and converges uniformly (Glivenko-Cantelli).",
      "DKW gives a distribution-free confidence band of half-width $\\epsilon_n = \\sqrt{\\tfrac{1}{2n}\\log(2/\\alpha)}$.",
      "Nerve data: $\\epsilon_n = .048$ for a $95\\%$ band with $n=799$."
    ]
  });
  window.CODEVIZ["aos-ch7-empirical-distribution-function"] = {
    charts: [
      {
        type: "line",
        title: "Nerve-data empirical CDF with 95% DKW band (reconstruction anchored to the book's values)",
        interpret: "The solid staircase is the empirical CDF; the book states it passes through F̂(.4)=.84 and F̂(.6)=.93. The dashed lines sit ±0.048 away (Example 7.6), forming the 95% confidence band. Intermediate points are an illustrative reconstruction, since the book tabulates only the .4 and .6 values.",
        xlabel: "waiting time (seconds)",
        ylabel: "F̂n(x)",
        series: [
          { name: "F̂n(x)", color: "#4ea1ff", points: [[0,0],[0.1,0.34],[0.2,0.58],[0.3,0.73],[0.4,0.84],[0.5,0.90],[0.6,0.93],[0.8,0.97],[1.0,0.99],[1.3,1.0]] },
          { name: "lower L(x)", color: "#ffb454", points: [[0,0],[0.1,0.292],[0.2,0.532],[0.3,0.682],[0.4,0.792],[0.5,0.852],[0.6,0.882],[0.8,0.922],[1.0,0.942],[1.3,0.952]] },
          { name: "upper U(x)", color: "#ffb454", points: [[0,0.048],[0.1,0.388],[0.2,0.628],[0.3,0.778],[0.4,0.888],[0.5,0.948],[0.6,0.978],[0.8,1.0],[1.0,1.0],[1.3,1.0]] }
        ]
      }
    ]
  };

  B({
    id: "aos-ch7-statistical-functionals-plug-in",
    chapter: "Chapter 7",
    title: "Statistical functionals and the plug-in estimator",
    tagline: "Any feature of a distribution is a function of its CDF; estimate it by feeding the empirical CDF into the same function.",
    sections: [
      {
        h: "What a statistical functional is",
        body: "<p>A <strong>statistical functional</strong> $T(F)$ is any quantity computed from the CDF $F$ &mdash; a recipe that turns a whole distribution into a single number (or a few). Familiar examples, with $\\int$ denoting integration (a continuous sum over the distribution):</p><ul class=\"steps\"><li>Mean: $\\mu = \\int x\\, dF(x)$ &mdash; the average value.</li><li>Variance: $\\sigma^2 = \\int (x-\\mu)^2\\, dF(x)$ &mdash; the average squared distance from the mean.</li><li>Median: $m = F^{-1}(1/2)$ &mdash; the value with half the mass below it.</li></ul>"
      },
      {
        h: "Definition 7.7 — the plug-in estimator",
        body: "<p>The <strong>plug-in estimator</strong> of $\\theta = T(F)$ is obtained by substituting the empirical CDF $\\widehat{F}_n$ for the unknown $F$:</p><p>$$\\widehat{\\theta}_n = T(\\widehat{F}_n).$$</p><p>In words: wherever the recipe asks for the true distribution, plug in the data-based one instead. A functional of the special form $T(F) = \\int r(x)\\, dF(x)$, for some function $r$, is called a <strong>linear functional</strong> (Definition 7.8), because $T(aF + bG) = a\\,T(F) + b\\,T(G)$.</p>"
      },
      {
        h: "Theorem 7.9 — plug-in for a linear functional",
        body: "<p>Because $\\widehat{F}_n$ is discrete, putting mass $1/n$ at each $X_i$, integrating against it just averages $r$ over the data. So for any linear functional,</p><p>$$T(\\widehat{F}_n) = \\int r(x)\\, d\\widehat{F}_n(x) = \\frac{1}{n}\\sum_{i=1}^{n} r(X_i).$$</p><p>The integral collapses into a plain sample average of $r(X_i)$.</p>"
      },
      {
        h: "Example 7.10 — the mean",
        body: "<p>Take $r(x)=x$, so $\\mu = T(F) = \\int x\\, dF(x)$. The plug-in estimate is the sample mean: $\\widehat{\\mu} = \\int x\\, d\\widehat{F}_n(x) = \\overline{X}_n$. Its standard error (typical estimation error) is $\\mathrm{se} = \\sqrt{\\mathbb{V}(\\overline{X}_n)} = \\sigma/\\sqrt{n}$; if $\\widehat{\\sigma}$ estimates $\\sigma$, the estimated standard error is $\\widehat{\\mathrm{se}} = \\widehat{\\sigma}/\\sqrt{n}$. A Normal-based $1-\\alpha$ confidence interval is $\\overline{X}_n \\pm z_{\\alpha/2}\\,\\widehat{\\mathrm{se}}$, which for $95\\%$ (with $z_{.025}\\approx 2$) is $\\overline{X}_n \\pm 2\\,\\widehat{\\mathrm{se}}$.</p>"
      },
      {
        h: "Example 7.11 — the variance",
        body: "<p>The variance is $\\sigma^2 = \\int x^2\\, dF(x) - \\left(\\int x\\, dF(x)\\right)^2$. Plugging in $\\widehat{F}_n$ gives the plug-in variance, which simplifies to the average squared deviation:</p><p>$$\\widehat{\\sigma}^2 = \\frac{1}{n}\\sum_{i=1}^{n} X_i^2 - \\left(\\frac{1}{n}\\sum_{i=1}^{n} X_i\\right)^2 = \\frac{1}{n}\\sum_{i=1}^{n} (X_i - \\overline{X}_n)^2.$$</p><p>A close cousin is the sample variance $S_n^2 = \\frac{1}{n-1}\\sum_{i=1}^{n}(X_i-\\overline{X}_n)^2$. In practice the difference between $\\widehat{\\sigma}^2$ and $S_n^2$ is tiny and either may be used; the mean's estimated standard error is then $\\widehat{\\mathrm{se}} = \\widehat{\\sigma}/\\sqrt{n}$.</p>"
      },
      {
        h: "Example 7.15 — plasma cholesterol",
        body: "<p>Scott et al. (1978) measured plasma cholesterol (mg/dl) for $371$ patients with chest pain: $51$ with no heart disease and $320$ with narrowed arteries (Figure 7.2 shows the two histograms). The plug-in mean estimates are the two sample means, with standard errors $\\widehat{\\mathrm{se}} = \\widehat{\\sigma}/\\sqrt{n}$:</p><table class=\"extable\"><thead><tr><th>group</th><th class=\"num\">n</th><th class=\"num\">plug-in mean $\\widehat{\\mu}$</th><th class=\"num\">$\\widehat{\\mathrm{se}}$</th><th class=\"num\">95% CI $\\widehat{\\mu}\\pm 2\\widehat{\\mathrm{se}}$</th></tr></thead><tbody><tr><td class=\"row-h\">no heart disease ($F_1$)</td><td class=\"num\">51</td><td class=\"num\">195.27</td><td class=\"num\">5.0</td><td class=\"num\">(185, 205)</td></tr><tr><td class=\"row-h\">narrowed arteries ($F_2$)</td><td class=\"num\">320</td><td class=\"num\">216.19</td><td class=\"num\">2.4</td><td class=\"num\">(211, 221)</td></tr></tbody></table><p>For the difference functional $\\theta = T(F_2) - T(F_1)$, the plug-in estimate is $\\widehat{\\theta} = 216.19 - 195.27 = 20.92$, with standard error $\\widehat{\\mathrm{se}} = \\sqrt{(\\widehat{\\mathrm{se}}(\\widehat{\\mu}_1))^2 + (\\widehat{\\mathrm{se}}(\\widehat{\\mu}_2))^2} = \\sqrt{5.0^2 + 2.4^2} = 5.55$. The $95\\%$ interval is $\\widehat{\\theta} \\pm 2\\,\\widehat{\\mathrm{se}} = (9.8,\\ 32.0)$, suggesting higher cholesterol among those with narrowed arteries &mdash; though, the book cautions, this is not evidence of causation.</p>"
      },
      {
        h: "More examples — skewness, correlation, quantiles",
        body: "<p>The same plug-in recipe handles features that are <em>not</em> linear functionals. Skewness, measuring lack of symmetry, is $\\kappa = \\mathbb{E}(X-\\mu)^3 / \\sigma^3$; its plug-in estimate replaces $\\mu,\\sigma$ with $\\widehat{\\mu},\\widehat{\\sigma}$ and the integrals with sample averages: $\\widehat{\\kappa} = \\frac{1}{n}\\sum_i (X_i-\\widehat{\\mu})^3 / \\widehat{\\sigma}^3$. Correlation $\\rho$ is written as a function of five linear functionals, and plugging in $\\widehat{F}_n$ yields the familiar <strong>sample correlation</strong>. The $p^{\\text{th}}$ quantile is $T(F)=F^{-1}(p)$; since $\\widehat{F}_n$ is a staircase and not strictly invertible, we define the <strong>sample quantile</strong> as $\\widehat{F}_n^{-1}(p) = \\inf\\{x : \\widehat{F}_n(x) \\ge p\\}$, the smallest $x$ whose empirical CDF reaches $p$.</p>"
      }
    ],
    takeaways: [
      "A statistical functional $T(F)$ is any number computed from the CDF (mean, variance, median, ...).",
      "Plug-in estimator: replace $F$ with $\\widehat{F}_n$, i.e. $\\widehat{\\theta}_n = T(\\widehat{F}_n)$.",
      "For a linear functional $\\int r\\,dF$, plugging in gives the sample average $\\frac{1}{n}\\sum r(X_i)$.",
      "Mean → $\\overline{X}_n$; variance → $\\frac{1}{n}\\sum(X_i-\\overline{X}_n)^2$.",
      "Cholesterol: $\\widehat{\\theta}=20.92$, $\\widehat{\\mathrm{se}}=5.55$, 95% CI $(9.8,32.0)$ for the mean difference."
    ]
  });
})();
