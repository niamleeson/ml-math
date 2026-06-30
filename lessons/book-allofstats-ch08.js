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
        "<p>The standard error estimate is $\\hat{\\mathrm{se}}_{\\mathrm{boot}} = \\sqrt{v_{\\mathrm{boot}}}$. For the median, the book's pseudocode is: compute the median of the data, then loop $B$ times drawing a resample and storing its median, and finally take the standard deviation of those stored medians.</p>" +
        "<pre><code class=\"language-python\"># Bootstrap for the median (Example 8.1), written in NumPy\nimport numpy as np\n\ndef bootstrap_se_median(x, B=1000, seed=0):\n    x = np.asarray(x)\n    rng = np.random.default_rng(seed)\n    Tboot = np.empty(B)\n    for b in range(B):\n        xstar = rng.choice(x, size=len(x), replace=True)\n        Tboot[b] = np.median(xstar)\n    return Tboot.std(ddof=0)  # sqrt(variance(Tboot))</code></pre>" },
      { h: "Two approximations and a worked number", body:
        "<p>The bootstrap chains two approximations: $\\mathbb{V}_F(T_n) \\approx \\mathbb{V}_{\\hat{F}_n}(T_n) \\approx v_{\\mathrm{boot}}$. The first gap (replacing $F$ by $\\hat{F}_n$) is described as 'not so small'; the second gap (replacing the exact bootstrap variance by simulation) is 'small', since $B$ is under our control.</p>" +
        "<p>Worked example — the nerve data skewness. The skewness is $\\theta = T(F) = \\int (x-\\mu)^3\\,dF(x)/\\sigma^3$, a measure of asymmetry that is $0$ for a Normal distribution. The plug-in estimate is $\\hat{\\theta} = T(\\hat{F}_n) = \\frac{n^{-1}\\sum_{i=1}^n (X_i - \\bar{X}_n)^3}{\\hat{\\sigma}^3} = 1.76$. Applying the same bootstrap procedure (compute skewness on each resample) with $B = 1{,}000$ replications yields a bootstrap standard error of $0.16$.</p><table class=\"extable\"><thead><tr><th>quantity</th><th class=\"num\">book value</th></tr></thead><tbody><tr><td class=\"row-h\">plug-in skewness $\\widehat{\\theta}$</td><td class=\"num\">1.76</td></tr><tr><td class=\"row-h\">bootstrap replications $B$</td><td class=\"num\">1,000</td></tr><tr><td class=\"row-h\">bootstrap standard error</td><td class=\"num\">0.16</td></tr></tbody></table>" }
    ],
    takeaways: [
      "The bootstrap estimates the variance of any statistic in two steps: plug in $\\hat{F}_n$ for $F$, then simulate.",
      "Sampling from $\\hat{F}_n$ means resampling $n$ points with replacement from the data.",
      "$v_{\\mathrm{boot}}$ is just the sample variance of $B$ statistic-values recomputed on $B$ resamples.",
      "Nerve data: skewness $\\hat{\\theta}=1.76$ with bootstrap standard error $0.16$ from $B=1000$."
    ]
  });
  window.CODEVIZ["aos-ch8-variance-estimation"] = {
    charts: [
      {
        type: "bars",
        title: "Nerve-data skewness bootstrap summary (Example 8.2)",
        interpret: "The plug-in skewness is 1.76; resampling the nerve data 1,000 times gives a bootstrap standard error of 0.16.",
        labels: ["skewness estimate", "bootstrap SE"],
        values: [1.76, 0.16],
        colors: ["#4ea1ff", "#ffb454"]
      }
    ],
    code: "# Bootstrap standard error for skewness (Example 8.2)\nimport numpy as np\n\ndef skewness(x):\n    x = np.asarray(x, dtype=float)\n    mu = x.mean()\n    sigma = np.sqrt(np.mean((x - mu) ** 2))\n    return np.mean((x - mu) ** 3) / sigma**3\n\ndef bootstrap_se(x, statistic, B=1000, seed=0):\n    rng = np.random.default_rng(seed)\n    vals = np.empty(B)\n    for b in range(B):\n        xstar = rng.choice(x, size=len(x), replace=True)\n        vals[b] = statistic(xstar)\n    return vals.std(ddof=0), vals\n\n# nerve = np.array([...])  # n = 799 nerve waiting times\n# theta_hat = skewness(nerve)             # 1.76 in the book\n# se_boot, Tboot = bootstrap_se(nerve, skewness, B=1000)  # 0.16 in the book"
  };

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
      ,
      { h: "Worked example — law school correlation", body:
        "<p>One of Efron's original bootstrap illustrations uses $15$ paired LSAT and GPA observations. The target functional is the correlation.</p><table class=\"extable\"><thead><tr><th class=\"num\">LSAT</th><th class=\"num\">GPA</th><th class=\"num\">LSAT</th><th class=\"num\">GPA</th></tr></thead><tbody><tr><td class=\"num\">576</td><td class=\"num\">3.39</td><td class=\"num\">651</td><td class=\"num\">3.36</td></tr><tr><td class=\"num\">635</td><td class=\"num\">3.30</td><td class=\"num\">605</td><td class=\"num\">3.13</td></tr><tr><td class=\"num\">558</td><td class=\"num\">2.81</td><td class=\"num\">653</td><td class=\"num\">3.12</td></tr><tr><td class=\"num\">578</td><td class=\"num\">3.03</td><td class=\"num\">575</td><td class=\"num\">2.74</td></tr><tr><td class=\"num\">666</td><td class=\"num\">3.44</td><td class=\"num\">545</td><td class=\"num\">2.76</td></tr><tr><td class=\"num\">580</td><td class=\"num\">3.07</td><td class=\"num\">572</td><td class=\"num\">2.88</td></tr><tr><td class=\"num\">555</td><td class=\"num\">3.00</td><td class=\"num\">594</td><td class=\"num\">2.96</td></tr><tr><td class=\"num\">661</td><td class=\"num\">3.43</td><td></td><td></td></tr></tbody></table><p>The plug-in estimate is the sample correlation, and the book reports:</p><table class=\"extable\"><thead><tr><th>quantity</th><th class=\"num\">value</th></tr></thead><tbody><tr><td class=\"row-h\">sample correlation $\\widehat{\\theta}$</td><td class=\"num\">0.776</td></tr><tr><td class=\"row-h\">bootstrap replications $B$</td><td class=\"num\">1,000</td></tr><tr><td class=\"row-h\">bootstrap standard error</td><td class=\"num\">0.137</td></tr><tr><td class=\"row-h\">Normal 95% interval</td><td class=\"num\">(0.51, 1.00)</td></tr><tr><td class=\"row-h\">Percentile 95% interval</td><td class=\"num\">(0.46, 0.96)</td></tr></tbody></table><p>Figure 8.1 shows the paired data and a histogram of the bootstrap correlations; the histogram is the simulated sampling distribution used by the intervals.</p>" },
      { h: "Worked example — patch bioequivalence", body:
        "<p>The patch example defines $Z=\\text{old}-\\text{placebo}$ and $Y=\\text{new}-\\text{old}$ for eight subjects, with target $\\theta=\\mathbb{E}_F(Y)/\\mathbb{E}_F(Z)$. The FDA bioequivalence target is $|\\theta|\\le .20$.</p><table class=\"extable\"><thead><tr><th class=\"row-h\">subject</th><th class=\"num\">placebo</th><th class=\"num\">old</th><th class=\"num\">new</th><th class=\"num\">old-placebo</th><th class=\"num\">new-old</th></tr></thead><tbody><tr><td class=\"row-h\">1</td><td class=\"num\">9243</td><td class=\"num\">17649</td><td class=\"num\">16449</td><td class=\"num\">8406</td><td class=\"num\">-1200</td></tr><tr><td class=\"row-h\">2</td><td class=\"num\">9671</td><td class=\"num\">12013</td><td class=\"num\">14614</td><td class=\"num\">2342</td><td class=\"num\">2601</td></tr><tr><td class=\"row-h\">3</td><td class=\"num\">11792</td><td class=\"num\">19979</td><td class=\"num\">17274</td><td class=\"num\">8187</td><td class=\"num\">-2705</td></tr><tr><td class=\"row-h\">4</td><td class=\"num\">13357</td><td class=\"num\">21816</td><td class=\"num\">23798</td><td class=\"num\">8459</td><td class=\"num\">1982</td></tr><tr><td class=\"row-h\">5</td><td class=\"num\">9055</td><td class=\"num\">13850</td><td class=\"num\">12560</td><td class=\"num\">4795</td><td class=\"num\">-1290</td></tr><tr><td class=\"row-h\">6</td><td class=\"num\">6290</td><td class=\"num\">9806</td><td class=\"num\">10157</td><td class=\"num\">3516</td><td class=\"num\">351</td></tr><tr><td class=\"row-h\">7</td><td class=\"num\">12412</td><td class=\"num\">17208</td><td class=\"num\">16570</td><td class=\"num\">4796</td><td class=\"num\">-638</td></tr><tr><td class=\"row-h\">8</td><td class=\"num\">18806</td><td class=\"num\">29044</td><td class=\"num\">26325</td><td class=\"num\">10238</td><td class=\"num\">-2719</td></tr></tbody></table><ul class=\"steps\"><li>The sample averages are $\\bar{Y}=-452.3$ and $\\bar{Z}=6342$.</li><li>The plug-in estimate is $\\widehat{\\theta}=\\bar{Y}/\\bar{Z}=-452.3/6342=-0.0713$.</li><li>The bootstrap standard error is $0.105$.</li><li>From $B=1{,}000$ bootstrap replications the 95% interval is $(-0.24,0.15)$.</li><li>Because $(-0.24,0.15)$ is not fully contained in $(-0.20,0.20)$, the book concludes that bioequivalence has not been demonstrated at the 95% level.</li></ul>" }
    ],
    takeaways: [
      "Normal: $T_n \\pm z_{\\alpha/2}\\,\\hat{\\mathrm{se}}_{\\mathrm{boot}}$ — accurate only if $T_n$ is near Normal.",
      "Pivotal: built from the pivot $R_n = \\hat{\\theta}_n - \\theta$, simplifies to $(2\\hat{\\theta}_n - \\theta_{1-\\alpha/2}^*,\\, 2\\hat{\\theta}_n - \\theta_{\\alpha/2}^*)$.",
      "Percentile: just the $\\alpha/2$ and $1-\\alpha/2$ quantiles of the bootstrap replications.",
      "All three are approximate with the same accuracy; they agree closely in large samples."
    ]
  });
  window.CODEVIZ["aos-ch8-confidence-intervals"] = {
    charts: [
      {
        type: "hist",
        title: "Bootstrap histogram of law-school correlations (Figure 8.1 reconstruction)",
        interpret: "Using the book's 15 LSAT/GPA pairs, most bootstrap correlations fall between 0.6 and 1.0; the book reports estimate 0.776, SE 0.137, percentile interval (0.46, 0.96).",
        labels: ["0.0–0.2", "0.2–0.4", "0.4–0.6", "0.6–0.8", "0.8–1.0"],
        values: [2, 10, 103, 428, 457],
        colors: ["#4ea1ff"]
      },
      {
        type: "hist",
        title: "Bootstrap histogram of patch ratio estimates (Figure 8.2 reconstruction)",
        interpret: "The bootstrap ratio estimates center near -0.071; the 95% interval (-0.24, 0.15) is not contained inside the bioequivalence range (-0.20, 0.20).",
        labels: ["-0.6–-0.4", "-0.4–-0.2", "-0.2–0.0", "0.0–0.2", "0.2–0.4"],
        values: [0, 82, 674, 223, 19],
        colors: ["#ffb454"]
      }
    ],
    code: "# Bootstrap confidence intervals from Chapter 8\nimport numpy as np\n\ndef boot_ci(theta_hat, Tboot, se_boot, alpha=0.05):\n    lo, hi = np.quantile(Tboot, [alpha/2, 1-alpha/2])\n    normal = (theta_hat - 2*se_boot, theta_hat + 2*se_boot)\n    pivotal = (2*theta_hat - hi, 2*theta_hat - lo)\n    percentile = (lo, hi)\n    return normal, pivotal, percentile\n\n# Law school data (Example 8.6); the book reports corr=0.776, se=0.137\nlsat = np.array([576,635,558,578,666,580,555,661,651,605,653,575,545,572,594])\ngpa = np.array([3.39,3.30,2.81,3.03,3.44,3.07,3.00,3.43,3.36,3.13,3.12,2.74,2.76,2.88,2.96])\ntheta = np.corrcoef(lsat, gpa)[0, 1]          # 0.776\nrng = np.random.default_rng(0)\nTboot = np.array([np.corrcoef(lsat[i := rng.integers(0, len(lsat), len(lsat))], gpa[i])[0, 1]\n                  for _ in range(1000)])\nprint(boot_ci(theta, Tboot, Tboot.std(ddof=0)))  # book: Normal (.51,1.00), Percentile (.46,.96)\n\n# Patch data (Example 8.7); book reports theta=-0.0713, se=0.105, CI=(-0.24,0.15)\nplacebo = np.array([9243,9671,11792,13357,9055,6290,12412,18806])\nold = np.array([17649,12013,19979,21816,13850,9806,17208,29044])\nnew = np.array([16449,14614,17274,23798,12560,10157,16570,26325])\nY, Z = new - old, old - placebo\ntheta_patch = Y.mean() / Z.mean()             # -452.3 / 6342 = -0.0713"
  };

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
        "<p>Under suitable conditions on $T$, the jackknife is consistent: $v_{\\mathrm{jack}}/\\mathrm{var}(T_n) \\to 1$. So like the bootstrap it gives a usable variance estimate for many statistics. The crucial caveat: unlike the bootstrap, the jackknife does <b>not</b> give consistent estimates of the standard error of sample quantiles (for example, the median). For quantile-type statistics, prefer the bootstrap.</p><pre><code class=\"language-python\"># Jackknife standard error from the book's formula\nimport numpy as np\n\ndef jackknife_se(x, statistic):\n    x = np.asarray(x)\n    vals = np.array([statistic(np.delete(x, i)) for i in range(len(x))])\n    vjack = (len(x) - 1) / len(x) * np.sum((vals - vals.mean()) ** 2)\n    return np.sqrt(vjack)</code></pre>" }
    ],
    takeaways: [
      "Jackknife = recompute the statistic $n$ times, each time leaving out one observation.",
      "$v_{\\mathrm{jack}} = \\frac{n-1}{n}\\sum_i (T_{(-i)} - \\bar{T}_n)^2$, with $\\hat{\\mathrm{se}}_{\\mathrm{jack}} = \\sqrt{v_{\\mathrm{jack}}}$.",
      "Cheaper than the bootstrap and consistent under suitable conditions.",
      "It fails for sample quantiles (e.g. the median) — use the bootstrap there instead."
    ]
  });
})();
