/* All of Statistics (Larry Wasserman) — Chapter 8: The Bootstrap.
   Self-registering book-template lessons, one per key concept. */
(function () {
  window.LESSONS = window.LESSONS || [];
  window.CODEVIZ = window.CODEVIZ || {};
  const M = "All of Statistics";
  const B = (o) => window.LESSONS.push(Object.assign({ module: M, template: "book", book: "All of Statistics" }, o));

  // 1 — Simulation and bootstrap variance estimation
  B({
    id: "aos-ch8-variance-estimation",
    chapter: "Chapter 8",
    title: "Simulation and Bootstrap Variance Estimation",
    tagline: "Estimate the variance of a statistic by resampling the data with replacement and simulating.",
    sections: [
      { h: "The problem the bootstrap solves", body:
        "<p>The bootstrap is a method for estimating standard errors and computing confidence intervals. Let $T_n = g(X_1,\\dots,X_n)$ be a <b>statistic</b>, meaning any function of the data. We often want to know $\\mathbb{V}_F(T_n)$, the variance of $T_n$. The subscript $F$ is a reminder that this variance usually depends on the unknown distribution function $F$ that generated the data.</p>" +
        "<p>For the sample mean $T_n = \\bar{X}_n$ the variance is $\\mathbb{V}_F(T_n) = \\sigma^2/n$, where $\\sigma^2 = \\int (x-\\mu)^2\\,dF(x)$ and $\\mu = \\int x\\,dF(x)$. So even this simple variance is a function of $F$. The bootstrap idea has two steps.</p>" +
        "<ul class=\"steps\">" +
        "<li><b>Step 1.</b> Estimate $\\mathbb{V}_F(T_n)$ by $\\mathbb{V}_{\\hat{F}_n}(T_n)$ — replace the unknown $F$ by the empirical distribution $\\hat{F}_n$ built from the data.</li>" +
        "<li><b>Step 2.</b> Approximate $\\mathbb{V}_{\\hat{F}_n}(T_n)$ using simulation.</li>" +
        "</ul>" +
        "<p>For the mean, Step 1 already gives a closed form: $\\mathbb{V}_{\\hat{F}_n}(T_n) = \\hat{\\sigma}^2/n$ with $\\hat{\\sigma}^2 = n^{-1}\\sum_{i=1}^n (X_i - \\bar{X}_n)^2$. But for complicated statistics there is no simple formula for $\\mathbb{V}_{\\hat{F}_n}(T_n)$, which is exactly why Step 2 is needed.</p>" },
      { h: "Why simulation works", body:
        "<p>Suppose we draw an i.i.d. sample $Y_1,\\dots,Y_B$ from a distribution $G$. By the law of large numbers the sample mean converges to the true mean: $\\bar{Y} = \\frac{1}{B}\\sum_{j=1}^B Y_j \\to \\int y\\,dG(y) = \\mathbb{E}(Y)$ as $B \\to \\infty$. Since we control $B$ in a simulation, we can make it as large as we like and drive the error to nothing.</p>" +
        "<p>The same holds for any function $h$ with finite mean: $\\frac{1}{B}\\sum_{j=1}^B h(Y_j) \\to \\mathbb{E}(h(Y))$. In particular the sample variance of the simulated values converges to the true variance: $\\frac{1}{B}\\sum_{j=1}^B (Y_j - \\bar{Y})^2 \\to \\mathbb{V}(Y)$. So if we can sample from a distribution, we can approximate its variance just by computing the variance of a big simulated batch.</p>" },
      { h: "Sampling from the bootstrap world", body:
        "<p>The remaining question is how to simulate from the distribution of $T_n$ when the data are assumed to come from $\\hat{F}_n$. The trick: draw a fresh dataset $X_1^*,\\dots,X_n^* \\sim \\hat{F}_n$ and recompute the statistic, $T_n^* = g(X_1^*,\\dots,X_n^*)$. That is one draw from the distribution of $T_n$ in the bootstrap world. Wasserman lays the two worlds side by side: in the real world $F$ produces $X_1,\\dots,X_n$ which give $T_n$; in the bootstrap world $\\hat{F}_n$ produces $X_1^*,\\dots,X_n^*$ which give $T_n^*$.</p>" +
        "<p>Because $\\hat{F}_n$ puts mass $1/n$ on each observed data point, drawing one observation from $\\hat{F}_n$ is the same as picking one of the original data points at random. So to draw $X_1^*,\\dots,X_n^* \\sim \\hat{F}_n$ you simply sample $n$ values with replacement from $X_1,\\dots,X_n$.</p>" },
      { h: "The algorithm", body:
        "<p>Bootstrap variance estimation, as summarized in the book:</p>" +
        "<ul class=\"steps\">" +
        "<li>Draw $X_1^*,\\dots,X_n^* \\sim \\hat{F}_n$ (i.e. sample $n$ points with replacement from the data).</li>" +
        "<li>Compute $T_n^* = g(X_1^*,\\dots,X_n^*)$.</li>" +
        "<li>Repeat the two steps $B$ times to get replications $T_{n,1}^*,\\dots,T_{n,B}^*$.</li>" +
        "<li>Estimate the variance by the sample variance of those replications: $v_{\\mathrm{boot}} = \\frac{1}{B}\\sum_{b=1}^B \\left( T_{n,b}^* - \\frac{1}{B}\\sum_{r=1}^B T_{n,r}^* \\right)^2$.</li>" +
        "</ul>" +
        "<p>The standard error estimate is $\\hat{\\mathrm{se}}_{\\mathrm{boot}} = \\sqrt{v_{\\mathrm{boot}}}$. For the median, the book's pseudocode is: compute the median of the data, then loop $B$ times drawing a resample and storing its median, and finally take the standard deviation of those stored medians.</p>" },
      { h: "Two approximations and a worked number", body:
        "<p>The bootstrap chains two approximations: $\\mathbb{V}_F(T_n) \\approx \\mathbb{V}_{\\hat{F}_n}(T_n) \\approx v_{\\mathrm{boot}}$. The first gap (replacing $F$ by $\\hat{F}_n$) is described as 'not so small'; the second gap (replacing the exact bootstrap variance by simulation) is 'small', since $B$ is under our control.</p>" +
        "<p>Worked example — the nerve data skewness. The skewness is $\\theta = T(F) = \\int (x-\\mu)^3\\,dF(x)/\\sigma^3$, a measure of asymmetry that is $0$ for a Normal distribution. The plug-in estimate is $\\hat{\\theta} = T(\\hat{F}_n) = \\frac{n^{-1}\\sum_{i=1}^n (X_i - \\bar{X}_n)^3}{\\hat{\\sigma}^3} = 1.76$. Applying the same bootstrap procedure (compute skewness on each resample) with $B = 1{,}000$ replications yields a bootstrap standard error of $0.16$.</p>" }
    ],
    takeaways: [
      "The bootstrap estimates the variance of any statistic in two steps: plug in $\\hat{F}_n$ for $F$, then simulate.",
      "Sampling from $\\hat{F}_n$ means resampling $n$ points with replacement from the data.",
      "$v_{\\mathrm{boot}}$ is just the sample variance of $B$ statistic-values recomputed on $B$ resamples.",
      "Nerve data: skewness $\\hat{\\theta}=1.76$ with bootstrap standard error $0.16$ from $B=1000$."
    ]
  });

  // 2 — Bootstrap confidence intervals
  B({
    id: "aos-ch8-confidence-intervals",
    chapter: "Chapter 8",
    title: "Bootstrap Confidence Intervals",
    tagline: "Three ways to turn bootstrap replications into a confidence interval: normal, pivotal, percentile.",
    sections: [
      { h: "Method 1 — the Normal interval", body:
        "<p>The simplest method assumes the statistic is roughly Normal and uses the bootstrap standard error. The interval is $T_n \\pm z_{\\alpha/2}\\,\\hat{\\mathrm{se}}_{\\mathrm{boot}}$, where $\\hat{\\mathrm{se}}_{\\mathrm{boot}} = \\sqrt{v_{\\mathrm{boot}}}$. Here $z_{\\alpha/2}$ is the upper $\\alpha/2$ point of a standard Normal (about $1.96$ for $95\\%$). This is only accurate when the distribution of $T_n$ is close to Normal.</p>" },
      { h: "Method 2 — the pivotal interval", body:
        "<p>Let $\\theta = T(F)$ and $\\hat{\\theta}_n = T(\\hat{F}_n)$, and define the <b>pivot</b> $R_n = \\hat{\\theta}_n - \\theta$. Let $H(r) = \\mathbb{P}_F(R_n \\le r)$ be the CDF of the pivot. If $H$ were known, an exact $1-\\alpha$ interval would be $C_n^\\star = (a,b)$ with $a = \\hat{\\theta}_n - H^{-1}(1-\\tfrac{\\alpha}{2})$ and $b = \\hat{\\theta}_n - H^{-1}(\\tfrac{\\alpha}{2})$; a short algebra chain confirms $\\mathbb{P}(a \\le \\theta \\le b) = 1-\\alpha$.</p>" +
        "<p>Since $H$ is unknown we estimate it from the bootstrap replications: $\\hat{H}(r) = \\frac{1}{B}\\sum_{b=1}^B I(R_{n,b}^* \\le r)$, where $R_{n,b}^* = \\hat{\\theta}_{n,b}^* - \\hat{\\theta}_n$. Writing $\\theta_\\beta^*$ for the $\\beta$ sample quantile of the bootstrap replications $\\hat{\\theta}_{n,1}^*,\\dots,\\hat{\\theta}_{n,B}^*$, the approximate interval simplifies neatly to $C_n = \\left( 2\\hat{\\theta}_n - \\theta_{1-\\alpha/2}^*,\\; 2\\hat{\\theta}_n - \\theta_{\\alpha/2}^* \\right)$. A theorem states that under weak conditions on $T(F)$, this interval's coverage $\\mathbb{P}_F(\\theta \\in C_n) \\to 1-\\alpha$ as $n \\to \\infty$.</p>" },
      { h: "Method 3 — the percentile interval", body:
        "<p>The bootstrap percentile interval is the most direct of all: just take the lower and upper sample quantiles of the bootstrap replications, $C_n = \\left( \\theta_{\\alpha/2}^*,\\; \\theta_{1-\\alpha/2}^* \\right)$. Its justification (an argument based on an unknown monotone normalizing transformation) is given in the chapter's appendix.</p>" +
        "<p>All three intervals are approximate — the true coverage is not exactly $1-\\alpha$ — and the book notes they all have the same level of accuracy. More accurate bootstrap intervals exist but are more complicated.</p>" },
      { h: "Worked example — nerve data skewness", body:
        "<p>For the skewness of the nerve data ($\\hat{\\theta} = 1.76$), the three $95\\%$ intervals are:</p>" +
        "<table class=\"extable\">" +
        "<thead><tr><th>Method</th><th>95% interval</th></tr></thead>" +
        "<tbody>" +
        "<tr><td class=\"row-h\">Normal</td><td class=\"num\">(1.44, 2.09)</td></tr>" +
        "<tr><td class=\"row-h\">Pivotal</td><td class=\"num\">(1.48, 2.11)</td></tr>" +
        "<tr><td class=\"row-h\">Percentile</td><td class=\"num\">(1.42, 2.03)</td></tr>" +
        "</tbody></table>" +
        "<p>The three intervals broadly agree, as the theory predicts they should.</p>" },
      { h: "Worked example — plasma cholesterol", body:
        "<p>Here the statistic is the difference of two medians, $\\hat{\\theta} = \\mathrm{median}(x_2) - \\mathrm{median}(x_1)$, and each bootstrap iteration resamples the two groups separately. With $B = 1{,}000$ the point estimate is $18.5$ and the bootstrap standard error is $7.42$, giving these $95\\%$ intervals:</p>" +
        "<table class=\"extable\">" +
        "<thead><tr><th>Method</th><th>95% interval</th></tr></thead>" +
        "<tbody>" +
        "<tr><td class=\"row-h\">Normal</td><td class=\"num\">(3.7, 33.3)</td></tr>" +
        "<tr><td class=\"row-h\">Pivotal</td><td class=\"num\">(5.0, 34.0)</td></tr>" +
        "<tr><td class=\"row-h\">Percentile</td><td class=\"num\">(5.0, 33.3)</td></tr>" +
        "</tbody></table>" +
        "<p>Since all three intervals exclude $0$, it looks as if the second group has higher cholesterol — though the wide intervals signal real uncertainty about how much higher. (Note the Normal interval here uses $\\hat{\\theta} \\pm 2\\,\\hat{\\mathrm{se}}$.)</p>" }
    ],
    takeaways: [
      "Normal: $T_n \\pm z_{\\alpha/2}\\,\\hat{\\mathrm{se}}_{\\mathrm{boot}}$ — accurate only if $T_n$ is near Normal.",
      "Pivotal: built from the pivot $R_n = \\hat{\\theta}_n - \\theta$, simplifies to $(2\\hat{\\theta}_n - \\theta_{1-\\alpha/2}^*,\\, 2\\hat{\\theta}_n - \\theta_{\\alpha/2}^*)$.",
      "Percentile: just the $\\alpha/2$ and $1-\\alpha/2$ quantiles of the bootstrap replications.",
      "All three are approximate with the same accuracy; they agree closely in large samples."
    ]
  });

  // 3 — The jackknife
  B({
    id: "aos-ch8-jackknife",
    chapter: "Chapter 8",
    title: "The Jackknife",
    tagline: "An older leave-one-out method for standard errors — cheaper than the bootstrap but less general.",
    sections: [
      { h: "Leave one out, recompute", body:
        "<p>The jackknife, due to Quenouille (1949), is another method for computing standard errors. It is less computationally expensive than the bootstrap but also less general. Let $T_n = T(X_1,\\dots,X_n)$ be a statistic, and let $T_{(-i)}$ denote the same statistic computed with the $i$-th observation removed. Define the average of these leave-one-out values, $\\bar{T}_n = n^{-1}\\sum_{i=1}^n T_{(-i)}$.</p>" },
      { h: "The jackknife variance and standard error", body:
        "<p>The jackknife estimate of $\\mathrm{var}(T_n)$ is $v_{\\mathrm{jack}} = \\frac{n-1}{n}\\sum_{i=1}^n \\left( T_{(-i)} - \\bar{T}_n \\right)^2$, and the jackknife standard error is $\\hat{\\mathrm{se}}_{\\mathrm{jack}} = \\sqrt{v_{\\mathrm{jack}}}$. Note the front factor is $(n-1)/n$, not $1/n$, which is what inflates the spread of the leave-one-out values into a variance estimate for the full statistic.</p>" +
        "<ul class=\"steps\">" +
        "<li>For each $i = 1,\\dots,n$, drop observation $i$ and compute $T_{(-i)}$.</li>" +
        "<li>Average them: $\\bar{T}_n = n^{-1}\\sum_i T_{(-i)}$.</li>" +
        "<li>Sum the squared deviations and scale by $(n-1)/n$ to get $v_{\\mathrm{jack}}$.</li>" +
        "<li>Take the square root for the standard error.</li>" +
        "</ul>" },
      { h: "When it works and when it fails", body:
        "<p>Under suitable conditions on $T$, the jackknife is consistent: $v_{\\mathrm{jack}}/\\mathrm{var}(T_n) \\to 1$. So like the bootstrap it gives a usable variance estimate for many statistics. The crucial caveat: unlike the bootstrap, the jackknife does <b>not</b> give consistent estimates of the standard error of sample quantiles (for example, the median). For quantile-type statistics, prefer the bootstrap.</p>" }
    ],
    takeaways: [
      "Jackknife = recompute the statistic $n$ times, each time leaving out one observation.",
      "$v_{\\mathrm{jack}} = \\frac{n-1}{n}\\sum_i (T_{(-i)} - \\bar{T}_n)^2$, with $\\hat{\\mathrm{se}}_{\\mathrm{jack}} = \\sqrt{v_{\\mathrm{jack}}}$.",
      "Cheaper than the bootstrap and consistent under suitable conditions.",
      "It fails for sample quantiles (e.g. the median) — use the bootstrap there instead."
    ]
  });
})();
