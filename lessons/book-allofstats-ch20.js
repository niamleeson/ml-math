/* All of Statistics (Larry Wasserman) — Chapter 20: Nonparametric Curve Estimation.
   Self-registering book-template lessons, one per key concept. */
(function () {
  window.LESSONS = window.LESSONS || [];
  window.CODEVIZ = window.CODEVIZ || {};
  const M = "All of Statistics";
  const B = (o) => window.LESSONS.push(Object.assign({ module: M, template: "book", book: "All of Statistics" }, o));

  // 1 — The bias-variance tradeoff
  B({
    id: "aos-ch20-bias-variance-tradeoff",
    chapter: "Chapter 20",
    title: "The Bias-Variance Tradeoff",
    tagline: "Risk splits into squared bias plus variance; smoothing too much grows the bias while smoothing too little grows the variance.",
    sections: [
      { h: "What curve estimation is", body:
        "<p>This chapter estimates curves: a probability density function $f$ or a regression function $r(x) = \\mathbb{E}(Y|X=x)$. The book uses the word $\\mathbb{E}$ to mean the average (expected value) of a random quantity. Unlike the cumulative distribution function, which Chapter 7 showed we can estimate without any assumptions, densities and regression functions cannot be estimated well without assuming the curve is <strong>smooth</strong>. So we must perform a smoothing operation on the data, and the book calls this whole subject <strong>curve estimation</strong> or <strong>smoothing</strong>.</p>" +
        "<p>How much to smooth is set by a <strong>smoothing parameter</strong>. Smooth too much and the estimate is heavily biased; smooth too little and it is highly variable. Much of curve estimation is about balancing these two.</p>" },
      { h: "Loss and risk for a curve", body:
        "<p>Let $g$ be the unknown curve and $\\hat{g}_n$ an estimate of it built from the data. The estimate is random because it depends on the data, but the point $x$ where we evaluate it is fixed. To grade an estimate the book uses the <strong>integrated squared error</strong> (ISE), the total squared gap between the curve and its estimate added up over all points:</p>" +
        "<p>$L(g,\\hat{g}_n) = \\int (g(u) - \\hat{g}_n(u))^2\\, du.$</p>" +
        "<p>Averaging this loss over the data gives the <strong>risk</strong>, also called the <strong>mean integrated squared error</strong> (MISE): $R(f,\\hat{f}) = \\mathbb{E}(L(g,\\hat{g}))$.</p>" },
      { h: "The risk decomposition (Lemma 20.1)", body:
        "<p>The book's Lemma 20.1 splits the risk into two integrals — one from bias, one from variance:</p>" +
        "<p>$R(g,\\hat{g}_n) = \\int b^2(x)\\, dx + \\int v(x)\\, dx,$</p>" +
        "<ul class=\"steps\">" +
        "<li>The <strong>bias</strong> at a fixed point is $b(x) = \\mathbb{E}(\\hat{g}_n(x)) - g(x)$ — how far the estimate is off on average.</li>" +
        "<li>The <strong>variance</strong> at a fixed point is $v(x) = \\mathbb{V}(\\hat{g}_n(x))$ — how much the estimate wobbles from sample to sample. Here $\\mathbb{V}$ means variance, the average squared distance of a random quantity from its own mean.</li>" +
        "</ul>" +
        "<p>In words, the book boxes the summary as $\\text{RISK} = \\text{BIAS}^2 + \\text{VARIANCE}$ (Eq. 20.6).</p>" },
      { h: "The tradeoff and how to choose smoothing", body:
        "<p>The two pieces move in opposite directions as you change the amount of smoothing. Oversmoothing makes the bias term large and the variance small; undersmoothing does the reverse. This is the <strong>bias-variance tradeoff</strong>, drawn in Figure 20.2: as smoothing increases the (squared) bias rises and the variance falls, and their sum — the risk — is a U-shape whose lowest point marks the optimal amount of smoothing.</p>" +
        "<p>Because the optimal smoothing depends on the unknown curve, a practical recipe is to estimate the risk from the data and minimize it over the smoothing parameter. The standard tool for this is <strong>cross-validation</strong>, developed in the histogram and kernel sections that follow.</p>" }
    ],
    takeaways: [
      "Densities and regression functions need a smoothness assumption; we estimate them by smoothing.",
      "Risk (MISE) is the averaged integrated squared error and splits as squared bias plus variance.",
      "More smoothing raises bias and lowers variance; less smoothing does the opposite.",
      "The risk is U-shaped in the smoothing parameter; cross-validation estimates it to find the bottom."
    ]
  });
  window.CODEVIZ["aos-ch20-bias-variance-tradeoff"] = { charts: [ {
    type: "line",
    title: "Figure 20.2 — the bias-variance tradeoff",
    interpret: "As smoothing increases, squared bias rises and variance falls. Risk = bias^2 + variance is U-shaped; its minimum is the optimal amount of smoothing.",
    xlabel: "amount of smoothing", ylabel: "error",
    series: [
      { name: "bias squared", color: "#ffb454", points: [[0,0.05],[1,0.1],[2,0.2],[3,0.35],[4,0.55],[5,0.8],[6,1.1],[7,1.45],[8,1.85]] },
      { name: "variance", color: "#7ee787", points: [[0,1.85],[1,1.45],[2,1.1],[3,0.8],[4,0.55],[5,0.35],[6,0.2],[7,0.1],[8,0.05]] },
      { name: "risk = bias^2 + variance", color: "#4ea1ff", points: [[0,1.9],[1,1.55],[2,1.3],[3,1.15],[4,1.1],[5,1.15],[6,1.3],[7,1.55],[8,1.9]] }
    ]
  } ] };

  // 2 — Histograms
  B({
    id: "aos-ch20-histograms",
    chapter: "Chapter 20",
    title: "Histograms as Density Estimators",
    tagline: "Chop the line into bins and let bar heights estimate the density; the optimal bin width shrinks like n to the minus one-third.",
    sections: [
      { h: "Building the histogram estimator", body:
        "<p>Let $X_1,\\dots,X_n$ be independent draws on $[0,1]$ with density $f$ (any range can be rescaled to $[0,1]$). Pick an integer $m$ and cut $[0,1]$ into $m$ equal <strong>bins</strong> $B_1,\\dots,B_m$, each of width — the <strong>binwidth</strong> — $h = 1/m$. Let $\\nu_j$ be the count of observations falling in bin $B_j$, set $\\hat{p}_j = \\nu_j/n$ (the fraction in that bin), and let $p_j = \\int_{B_j} f(u)\\, du$ be the true probability of that bin.</p>" +
        "<p>The <strong>histogram estimator</strong> makes the density constant within each bin, at height $\\hat{p}_j/h$ for $x$ in bin $B_j$ (Eq. 20.8). The number of bins $m$ is the smoothing parameter.</p>" },
      { h: "Why the heights estimate the density", body:
        "<p>For $x$ in bin $B_j$ and a small binwidth $h$, the average height is close to $f$ itself:</p>" +
        "<p>$\\mathbb{E}(\\hat{f}_n(x)) = \\dfrac{\\mathbb{E}(\\hat{p}_j)}{h} = \\dfrac{p_j}{h} = \\dfrac{\\int_{B_j} f(u)\\,du}{h} \\approx \\dfrac{f(x)h}{h} = f(x).$</p>" +
        "<p>Theorem 20.3 gives the exact mean and variance at a fixed $x$ in bin $B_j$: $\\mathbb{E}(\\hat{f}_n(x)) = p_j/h$ and $\\mathbb{V}(\\hat{f}_n(x)) = p_j(1-p_j)/(nh^2)$.</p>" },
      { h: "Risk and the optimal binwidth (Theorem 20.4)", body:
        "<p>Working the bias and variance through the small-$h$ approximations, the book finds the integrated squared bias grows like $h^2$ and the integrated variance shrinks like $1/(nh)$, giving the risk</p>" +
        "<p>$R(\\hat{f}_n, f) \\approx \\dfrac{h^2}{12}\\int (f'(u))^2\\,du + \\dfrac{1}{nh}.$</p>" +
        "<p>Here $f'$ is the derivative (slope) of the density. Minimizing this over $h$ gives the optimal binwidth and the resulting best risk:</p>" +
        "<ul class=\"steps\">" +
        "<li>$h^{*} = \\dfrac{1}{n^{1/3}}\\left(\\dfrac{6}{\\int (f'(u))^2\\,du}\\right)^{1/3}$ — the binwidth shrinks like $n^{-1/3}$.</li>" +
        "<li>$R(\\hat{f}_n,f) \\approx \\dfrac{C}{n^{2/3}}$ with $C = (3/4)^{2/3}\\left(\\int (f'(u))^2\\,du\\right)^{1/3}$ — the best achievable risk.</li>" +
        "</ul>" +
        "<p>The histogram's risk falls to zero only at rate $n^{-2/3}$, slower than the $n^{-1}$ rate of typical parametric estimators — the price of being nonparametric. The formula for $h^{*}$ is not directly usable because it contains the unknown $f$.</p>" },
      { h: "Cross-validation for the binwidth", body:
        "<p>Since $h^{*}$ depends on $f$, the book chooses $h$ by estimating the risk and minimizing it. Dropping the term that does not depend on $h$, the quantity to minimize is the <strong>cross-validation score</strong> (Definition 20.5):</p>" +
        "<p>$\\hat{J}(h) = \\int (\\hat{f}_n(x))^2\\,dx - \\dfrac{2}{n}\\sum_{i=1}^n \\hat{f}_{(-i)}(X_i),$</p>" +
        "<p>where $\\hat{f}_{(-i)}$ is the histogram built after removing the $i$-th observation. Theorem 20.6 says this estimate is nearly unbiased, and Theorem 20.7 gives a shortcut so we do not recompute the histogram $n$ times:</p>" +
        "<p>$\\hat{J}(h) = \\dfrac{2}{(n-1)h} - \\dfrac{n+1}{n-1}\\sum_{j=1}^m \\hat{p}_j^2.$</p>" },
      { h: "Worked example — the astronomy data", body:
        "<p><strong>Example 20.2 / 20.8.</strong> Figure 20.3 shows three histograms of $n = 1{,}266$ galaxy distances measured along a \"pencil-beam\" pointing out into space; because light takes time to reach us, farther galaxies are seen further back in time. The number of bins controls the bias-variance tradeoff:</p>" +
        "<ul class=\"steps\">" +
        "<li>Too few bins (top left): oversmoothed, too much bias.</li>" +
        "<li>Too many bins (bottom left): undersmoothed, too much variance.</li>" +
        "<li>Just right (top right): built with $m = 73$ bins, chosen by cross-validation.</li>" +
        "</ul>" +
        "<p>The cross-validation curve is flat near its minimum: any $m$ from $73$ to $310$ gives nearly the same histogram. The right number of bins reveals clusters of galaxies, helping cosmologists trace how the universe evolved.</p>" }
    ],
    takeaways: [
      "A histogram estimates a density by a piecewise-constant function of height p-hat_j / h on each bin.",
      "The average bar height approximates f; bias grows like h^2 and variance like 1/(nh).",
      "Optimal binwidth shrinks like n^(-1/3) and the best risk falls like n^(-2/3), slower than parametric n^(-1).",
      "Choose the binwidth by minimizing the cross-validation score, which has a fast shortcut formula.",
      "On the n = 1,266 galaxy data, cross-validation picked m = 73 bins and exposed galaxy clusters."
    ]
  });

  // 3 — Kernel density estimation
  B({
    id: "aos-ch20-kernel-density-estimation",
    chapter: "Chapter 20",
    title: "Kernel Density Estimation",
    tagline: "Place a smooth bump on every data point and average them; the bandwidth controls smoothing and is far more important than the kernel.",
    sections: [
      { h: "The kernel", body:
        "<p>Histograms are discontinuous (they jump between bins). <strong>Kernel density estimators</strong> are smooth and converge to the true density faster. The building block is a <strong>kernel</strong>: any smooth function $K$ that is never negative, integrates to one, has mean zero ($\\int x K(x)\\,dx = 0$), and finite spread $\\sigma_K^2 = \\int x^2 K(x)\\,dx \\gt 0$. Two examples the book gives:</p>" +
        "<ul class=\"steps\">" +
        "<li>The <strong>Epanechnikov kernel</strong>: $K(x) = \\frac{3}{4}(1 - x^2/5)/\\sqrt{5}$ for $|x| \\lt \\sqrt{5}$, and $0$ otherwise.</li>" +
        "<li>The <strong>Gaussian (Normal) kernel</strong>: $K(x) = (2\\pi)^{-1/2} e^{-x^2/2}$.</li>" +
        "</ul>" },
      { h: "The estimator and the bandwidth (Definition 20.12)", body:
        "<p>Given a kernel $K$ and a positive number $h$ called the <strong>bandwidth</strong>, the <strong>kernel density estimator</strong> is</p>" +
        "<p>$\\hat{f}(x) = \\dfrac{1}{n}\\sum_{i=1}^n \\dfrac{1}{h} K\\!\\left(\\dfrac{x - X_i}{h}\\right).$</p>" +
        "<p>This effectively lays a smoothed-out lump of mass $1/n$ over each data point $X_i$ and adds them up; Figure 20.5 shows the small bumps centered on the data combining into one smooth curve. The bandwidth $h$ controls smoothing: as $h \\to 0$ the estimate becomes a set of tall spikes at the data points, and as $h \\to \\infty$ it flattens toward a uniform density.</p>" },
      { h: "Risk and the optimal bandwidth (Theorem 20.14)", body:
        "<p>Under weak assumptions the risk is</p>" +
        "<p>$R(f,\\hat{f}_n) \\approx \\dfrac{1}{4}\\sigma_K^4 h^4 \\int (f''(x))^2\\,dx + \\dfrac{\\int K^2(x)\\,dx}{nh},$</p>" +
        "<p>where $f''$ is the second derivative (curvature) of the density. The squared-bias term grows like $h^4$ and the variance term shrinks like $1/(nh)$. Minimizing over $h$ gives the optimal bandwidth</p>" +
        "<p>$h^{*} = \\dfrac{c_1^{-2/5} c_2^{1/5} c_3^{-1/5}}{n^{1/5}},$</p>" +
        "<p>with $c_1 = \\int x^2 K(x)\\,dx$, $c_2 = \\int K^2(x)\\,dx$, and $c_3 = \\int (f''(x))^2\\,dx$. The bandwidth shrinks like $n^{-1/5}$, and with it the risk falls like $c_4/n^{4/5}$.</p>" },
      { h: "Why the choices matter", body:
        "<p>Kernel estimators converge at rate $n^{-4/5}$, faster than the histogram's $n^{-2/3}$; in fact no nonparametric estimator beats $n^{-4/5}$ under weak conditions. The book stresses that the choice of kernel $K$ is not crucial (the Epanechnikov kernel is theoretically optimal but barely better than others), whereas the choice of bandwidth $h$ is very important. Since $h^{*}$ depends on the unknown $f$, in practice we again use cross-validation, minimizing the estimated risk</p>" +
        "<p>$\\hat{J}(h) = \\int \\hat{f}^2(x)\\,dx - \\dfrac{2}{n}\\sum_{i=1}^n \\hat{f}_{-i}(X_i),$</p>" +
        "<p>where $\\hat{f}_{-i}$ drops the $i$-th point (Eq. 20.24). Stone's Theorem (20.16) shows the bandwidth chosen this way is asymptotically as good as the best possible bandwidth.</p>" },
      { h: "Worked example — the astronomy data", body:
        "<p><strong>Example 20.13 / 20.17.</strong> Figure 20.6 shows Gaussian-kernel density estimates of the same galaxy data at three bandwidths: oversmoothed, just right (bandwidth picked by cross-validation), and undersmoothed. The just-right estimate shows the same cluster structure as the histogram but makes it easier to see. The book notes the galaxy distances are rounded, which pushes naive cross-validation toward $h = 0$; adding a little Normal noise fixes this and yields a smooth cross-validation curve with a clear minimum. <strong>Remark 20.18</strong> warns that a wiggly estimate does not mean cross-validation failed — the eye is a poor judge of risk.</p>" }
    ],
    takeaways: [
      "A kernel K is a smooth, non-negative function integrating to 1 with mean 0 (e.g. Epanechnikov, Gaussian).",
      "The kernel density estimate averages 1/h * K((x - X_i)/h) over all data points; bandwidth h sets the smoothing.",
      "Bias grows like h^4, variance like 1/(nh); optimal bandwidth shrinks like n^(-1/5) and risk like n^(-4/5).",
      "The kernel choice barely matters; the bandwidth choice is critical and is set by cross-validation.",
      "Kernel estimators converge faster (n^(-4/5)) than histograms (n^(-2/3))."
    ]
  });

  // 4 — Nonparametric regression
  B({
    id: "aos-ch20-nonparametric-regression",
    chapter: "Chapter 20",
    title: "Nonparametric Regression",
    tagline: "Estimate a regression curve by a locally weighted average of the responses, with weights from a kernel and a bandwidth chosen by cross-validation.",
    sections: [
      { h: "The regression problem", body:
        "<p>We have pairs $(x_1,Y_1),\\dots,(x_n,Y_n)$ related by $Y_i = r(x_i) + \\epsilon_i$, where $\\epsilon_i$ (epsilon) is random noise with mean zero, so $\\mathbb{E}(\\epsilon_i) = 0$. The $x_i$ are written in lowercase because we treat them as fixed and only care about the mean of $Y$ given $x$. The goal is to estimate the <strong>regression function</strong> $r(x) = \\mathbb{E}(Y|X=x)$ — the average response at $x$ — without assuming it has any particular shape.</p>" },
      { h: "The Nadaraya-Watson kernel estimator (Definition 20.20)", body:
        "<p>Most nonparametric regression estimators are a weighted average of the responses $Y_i$, giving more weight to points $x_i$ near $x$. The popular <strong>Nadaraya-Watson kernel estimator</strong> is</p>" +
        "<p>$\\hat{r}(x) = \\sum_{i=1}^n w_i(x)\\, Y_i,$</p>" +
        "<p>where the weights are normalized kernel values</p>" +
        "<p>$w_i(x) = \\dfrac{K\\!\\left(\\frac{x - x_i}{h}\\right)}{\\sum_{j=1}^n K\\!\\left(\\frac{x - x_j}{h}\\right)}.$</p>" +
        "<p>The weights add to one, so $\\hat{r}(x)$ is a genuine local average; nearby points get large weight and far points get little. The form arises from estimating the joint density of $(x,Y)$ by kernels and plugging it into $r(x) = \\int y f(x,y)\\,dy / \\int f(x,y)\\,dy$.</p>" },
      { h: "Risk and bandwidth (Theorem 20.21)", body:
        "<p>With noise variance $\\mathbb{V}(\\epsilon_i) = \\sigma^2$, the risk of the Nadaraya-Watson estimator has the familiar squared-bias-plus-variance form:</p>" +
        "<p>$R(\\hat{r}_n, r) \\approx \\dfrac{h^4}{4}\\left(\\int x^2 K^2(x)\\,dx\\right)\\int\\!\\left(r''(x) + 2r'(x)\\dfrac{f'(x)}{f(x)}\\right)^2 dx + \\int \\dfrac{\\sigma^2 \\int K^2(x)\\,dx}{n h f(x)}\\,dx.$</p>" +
        "<p>As with kernel density estimation, the optimal bandwidth shrinks like $n^{-1/5}$ and the resulting risk falls like $n^{-4/5}$. In practice we choose $h$ by minimizing the cross-validation score $\\hat{J}(h) = \\sum_{i=1}^n (Y_i - \\hat{r}_{-i}(x_i))^2$ (Eq. 20.34), where $\\hat{r}_{-i}$ omits the $i$-th point. Theorem 20.22 gives a shortcut that avoids refitting the curve $n$ times:</p>" +
        "<p>$\\hat{J}(h) = \\sum_{i=1}^n (Y_i - \\hat{r}(x_i))^2 \\Big/ \\left(1 - \\dfrac{K(0)}{\\sum_{j=1}^n K\\!\\left(\\frac{x_i - x_j}{h}\\right)}\\right)^2.$</p>" },
      { h: "Estimating the noise for confidence bands", body:
        "<p>To build confidence bands we first need the noise variance $\\sigma^2$. Order the $x_i$. If $r$ is smooth then neighboring values $r(x_{i+1}) - r(x_i) \\approx 0$, so the differences of responses isolate the noise: $Y_{i+1} - Y_i \\approx \\epsilon_{i+1} - \\epsilon_i$, which has variance $2\\sigma^2$. Averaging the squared differences gives the estimator</p>" +
        "<p>$\\hat{\\sigma}^2 = \\dfrac{1}{2(n-1)}\\sum_{i=1}^{n-1} (Y_{i+1} - Y_i)^2.$</p>" +
        "<p>As with density estimation the confidence band is built for the smoothed version $\\overline{r}_n(x) = \\mathbb{E}(\\hat{r}_n(x))$ of the true regression function.</p>" },
      { h: "Worked example — the CMB data", body:
        "<p><strong>Example 20.23.</strong> Figure 20.8 fits the cosmic microwave background (CMB) power spectrum from the BOOMERaNG, Maxima, and DASI experiments. Each pair $(x_i,Y_i)$ has $x_i$ a multipole moment and $Y_i$ the estimated power of temperature fluctuations — sound waves in the leftover heat from the big bang. The figure shows three fits: undersmoothed (too wiggly), oversmoothed (too flat), and just right by cross-validation. The cross-validation fit reveals three well-defined peaks, exactly as the physics of the big bang predicts. The fourth panel is the estimated risk versus bandwidth — a U-shaped curve whose minimum picks the bandwidth.</p>" }
    ],
    takeaways: [
      "Regression assumes Y_i = r(x_i) + noise; we estimate r(x) = E(Y | X = x) by a local average of the Y_i.",
      "The Nadaraya-Watson estimator weights each Y_i by a normalized kernel value, favoring x_i near x.",
      "Optimal bandwidth shrinks like n^(-1/5) and risk like n^(-4/5); choose h by minimizing the cross-validation score (with a shortcut formula).",
      "Estimate the noise variance from squared successive differences of the responses for confidence bands.",
      "On the CMB data, cross-validation recovered three peaks predicted by big-bang physics."
    ]
  });
  window.CODEVIZ["aos-ch20-nonparametric-regression"] = { charts: [ {
    type: "scatter",
    title: "Figure 20.8 — CMB power spectrum with cross-validation fit",
    interpret: "Power of temperature fluctuations versus multipole moment. The local-average (kernel) fit traces a tall first acoustic peak near multipole 200, illustrating the three peaks the just-right fit recovers.",
    xlabel: "multipole moment", ylabel: "power",
    groups: [
      { name: "CMB measurements", color: "#c89bff", points: [[100,2900],[150,3600],[200,5900],[230,6050],[300,2300],[400,2000],[500,1950],[600,2100],[700,2050],[800,2300],[850,2900],[1000,1600],[1100,500]] }
    ],
    lines: [
      { name: "cross-validation fit", color: "#4ea1ff", points: [[100,2900],[150,3700],[200,5600],[250,4200],[300,2500],[400,2000],[500,1950],[600,2050],[700,2150],[800,2400],[850,2600],[1000,1400],[1100,600]] }
    ]
  } ] };
})();
