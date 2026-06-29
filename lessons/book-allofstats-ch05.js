/* All of Statistics (Larry Wasserman) — Chapter 5, "Convergence of Random Variables".
   One lesson per key concept. Faithful summaries in original wording; the book's own
   definitions, theorems, examples and numbers, recomputed to confirm. Self-registering IIFE. */
(function () {
  window.LESSONS = window.LESSONS || [];
  window.CODEVIZ = window.CODEVIZ || {};
  const M = "All of Statistics";
  const BOOK = "All of Statistics";
  const B = (o) => window.LESSONS.push(Object.assign({ module: M, template: "book", book: BOOK }, o));

  // ── 1. Types of convergence and their relationships ──
  B({
    id: "aos-ch5-types-of-convergence",
    chapter: "Chapter 5",
    title: "Types of convergence",
    tagline: "Three ways a sequence of random variables can settle down — and how they rank.",
    sections: [
      { h: "Why ordinary limits don't work", body:
        "<p>Large sample theory asks what happens to a sequence of random variables $X_1, X_2, \\ldots$ as we gather more data. The calculus notion of a limit does not transfer directly. If $X_1, X_2, \\ldots$ are independent and each is $N(0,1)$, we are tempted to say $X_n$ converges to some $X \\sim N(0,1)$ — but $\\mathbb{P}(X_n = X) = 0$ for every $n$, since two continuous random variables agree with probability zero. So convergence for random variables needs its own definitions.</p>" },
      { h: "Convergence in probability and in distribution", body:
        "<p>Let $F_n$ be the CDF of $X_n$ and $F$ the CDF of $X$.</p>" +
        "<p><strong>In probability</strong> ($X_n \\xrightarrow{P} X$): for every $\\epsilon \\gt 0$, $\\mathbb{P}(|X_n - X| \\gt \\epsilon) \\to 0$ as $n \\to \\infty$. The values get close with high probability.</p>" +
        "<p><strong>In distribution</strong> ($X_n \\rightsquigarrow X$): $\\lim_{n\\to\\infty} F_n(t) = F(t)$ at every $t$ where $F$ is continuous. Only the distribution needs to match, and only at continuity points.</p>" +
        "<p>When the limit is a point mass at $c$, we write $X_n \\xrightarrow{P} c$ or $X_n \\rightsquigarrow c$.</p>" },
      { h: "Convergence in quadratic mean", body:
        "<p><strong>In quadratic mean</strong> ($X_n \\xrightarrow{qm} X$, also called convergence in $L_2$): $\\mathbb{E}(X_n - X)^2 \\to 0$ as $n \\to \\infty$. The book introduces this mainly because it is a handy tool for proving convergence in probability.</p>" },
      { h: "How they rank", body:
        "<p>Theorem 5.4 gives the relationships, summarized in Figure 5.2:</p>" +
        "<ul class=\"steps\">" +
        "<li>$X_n \\xrightarrow{qm} X$ implies $X_n \\xrightarrow{P} X$.</li>" +
        "<li>$X_n \\xrightarrow{P} X$ implies $X_n \\rightsquigarrow X$.</li>" +
        "<li>If $X_n \\rightsquigarrow X$ and $\\mathbb{P}(X = c) = 1$ for a constant $c$, then $X_n \\xrightarrow{P} X$.</li>" +
        "</ul>" +
        "<p>In general none of the reverse implications hold, except that special constant-limit case. The proof of part (a) is one line of Markov's inequality: $\\mathbb{P}(|X_n - X| \\gt \\epsilon) = \\mathbb{P}(|X_n - X|^2 \\gt \\epsilon^2) \\le \\mathbb{E}|X_n - X|^2 / \\epsilon^2 \\to 0$.</p>" },
      { h: "The reverse arrows really fail", body:
        "<p><strong>Distribution does not imply probability.</strong> Let $X \\sim N(0,1)$ and set $X_n = -X$ for all $n$. By symmetry each $X_n$ is also $N(0,1)$, so $F_n = F$ and $X_n \\rightsquigarrow X$ trivially. Yet $\\mathbb{P}(|X_n - X| \\gt \\epsilon) = \\mathbb{P}(|2X| \\gt \\epsilon) = \\mathbb{P}(|X| \\gt \\epsilon/2) \\neq 0$, so $X_n$ does not converge to $X$ in probability.</p>" +
        "<p><strong>Probability does not imply quadratic mean.</strong> Let $U \\sim \\text{Unif}(0,1)$ and $X_n = \\sqrt{n}\\, I_{(0,1/n)}(U)$. Then $\\mathbb{P}(|X_n| \\gt \\epsilon) = \\mathbb{P}(0 \\le U \\lt 1/n) = 1/n \\to 0$, so $X_n \\xrightarrow{P} 0$. But $\\mathbb{E}(X_n^2) = n \\int_0^{1/n} du = 1$ for all $n$, which never goes to zero.</p>" }
    ],
    takeaways: [
      "Three modes: quadratic mean, in probability, in distribution.",
      "Quadratic mean is strongest, then probability, then distribution.",
      "Reverse implications fail, except a distributional limit that is a constant implies convergence in probability."
    ]
  });

  // ── 2. The Law of Large Numbers ──
  B({
    id: "aos-ch5-law-of-large-numbers",
    chapter: "Chapter 5",
    title: "The Law of Large Numbers",
    tagline: "The sample mean of an IID sample converges in probability to the true mean.",
    sections: [
      { h: "Statement", body:
        "<p>Let $X_1, \\ldots, X_n$ be IID with $\\mu = \\mathbb{E}(X_1)$ and $\\sigma^2 = \\mathbb{V}(X_1)$. The sample mean is $\\bar{X}_n = n^{-1}\\sum_{i=1}^n X_i$, with $\\mathbb{E}(\\bar{X}_n) = \\mu$ and $\\mathbb{V}(\\bar{X}_n) = \\sigma^2/n$. The Weak Law of Large Numbers (Theorem 5.6) says $\\bar{X}_n \\xrightarrow{P} \\mu$. The distribution of $\\bar{X}_n$ becomes more concentrated around $\\mu$ as $n$ grows.</p>" },
      { h: "One-line proof via Chebyshev", body:
        "<p>Assuming $\\sigma \\lt \\infty$ (not strictly needed, but it simplifies things), Chebyshev's inequality gives $\\mathbb{P}(|\\bar{X}_n - \\mu| \\gt \\epsilon) \\le \\mathbb{V}(\\bar{X}_n)/\\epsilon^2 = \\sigma^2/(n\\epsilon^2)$, which tends to $0$ as $n \\to \\infty$.</p>" },
      { h: "Example: coin tossing", body:
        "<p>Flip a coin with probability of heads $p$. Let $X_i$ be the outcome of toss $i$ (0 or 1), so $p = \\mathbb{E}(X_i)$, and the fraction of heads after $n$ tosses is $\\bar{X}_n$. The law says $\\bar{X}_n \\xrightarrow{P} p$ — not that $\\bar{X}_n$ exactly equals $p$, but that for large $n$ its distribution is tightly concentrated around $p$.</p>" +
        "<p>Take $p = 1/2$. How large must $n$ be so that $\\mathbb{P}(.4 \\le \\bar{X}_n \\le .6) \\ge .7$? Here $\\mathbb{E}(\\bar{X}_n) = 1/2$ and $\\mathbb{V}(\\bar{X}_n) = p(1-p)/n = 1/(4n)$.</p>" +
        "<ul class=\"steps\">" +
        "<li>The event $.4 \\le \\bar{X}_n \\le .6$ is the same as $|\\bar{X}_n - \\mu| \\le .1$.</li>" +
        "<li>So $\\mathbb{P}(.4 \\le \\bar{X}_n \\le .6) = 1 - \\mathbb{P}(|\\bar{X}_n - \\mu| \\gt .1)$.</li>" +
        "<li>Chebyshev: $\\mathbb{P}(|\\bar{X}_n - \\mu| \\gt .1) \\le \\mathbb{V}(\\bar{X}_n)/(.1)^2 = 1/(4n(.1)^2) = 25/n$.</li>" +
        "<li>Hence $\\mathbb{P}(.4 \\le \\bar{X}_n \\le .6) \\ge 1 - 25/n$.</li>" +
        "<li>Require $1 - 25/n \\ge .7$, i.e. $25/n \\le .3$, i.e. $n \\ge 83.3\\ldots$. So $n = 84$ works.</li>" +
        "</ul>" }
    ],
    takeaways: [
      "WLLN: for an IID sample, $\\bar{X}_n \\xrightarrow{P} \\mu$.",
      "It follows in one step from Chebyshev's inequality, since $\\mathbb{V}(\\bar{X}_n) = \\sigma^2/n \\to 0$.",
      "For a fair coin, n = 84 tosses guarantee at least a 70% chance the heads-fraction lands in [.4, .6]."
    ]
  });

  // ── 3. The Central Limit Theorem ──
  B({
    id: "aos-ch5-central-limit-theorem",
    chapter: "Chapter 5",
    title: "The Central Limit Theorem",
    tagline: "The standardized sample mean converges in distribution to a standard Normal.",
    sections: [
      { h: "Statement", body:
        "<p>The law of large numbers tells us $\\bar{X}_n$ piles up near $\\mu$, but that alone does not let us approximate probability statements about $\\bar{X}_n$. The Central Limit Theorem (Theorem 5.8) fills the gap. Let $X_1, \\ldots, X_n$ be IID with mean $\\mu$ and variance $\\sigma^2$. Then</p>" +
        "<p>$Z_n \\equiv \\dfrac{\\bar{X}_n - \\mu}{\\sqrt{\\mathbb{V}(\\bar{X}_n)}} = \\dfrac{\\sqrt{n}(\\bar{X}_n - \\mu)}{\\sigma} \\rightsquigarrow Z$, where $Z \\sim N(0,1)$.</p>" +
        "<p>Equivalently $\\lim_{n\\to\\infty} \\mathbb{P}(Z_n \\le z) = \\Phi(z)$. This is remarkable because nothing is assumed about the shape of the $X_i$, only that the mean and variance exist. Note that it is the probability statements about $\\bar{X}_n$ that we are approximating, not the random variable itself.</p>" },
      { h: "Equivalent ways to write it", body:
        "<p>All of these say the same thing — that the distribution of the standardized mean approaches a Normal:</p>" +
        "<ul class=\"steps\">" +
        "<li>$Z_n \\approx N(0,1)$</li>" +
        "<li>$\\bar{X}_n \\approx N(\\mu, \\sigma^2/n)$</li>" +
        "<li>$\\bar{X}_n - \\mu \\approx N(0, \\sigma^2/n)$</li>" +
        "<li>$\\sqrt{n}(\\bar{X}_n - \\mu) \\approx N(0, \\sigma^2)$</li>" +
        "<li>$\\sqrt{n}(\\bar{X}_n - \\mu)/\\sigma \\approx N(0,1)$</li>" +
        "</ul>" },
      { h: "Example: errors per program", body:
        "<p>Suppose the number of errors per computer program is Poisson with mean 5. We collect 125 programs, $X_1, \\ldots, X_{125}$, and want $\\mathbb{P}(\\bar{X}_n \\lt 5.5)$. For Poisson, $\\mu = \\lambda = 5$ and $\\sigma^2 = \\lambda = 5$.</p>" +
        "<ul class=\"steps\">" +
        "<li>Standardize: $\\mathbb{P}(\\bar{X}_n \\lt 5.5) = \\mathbb{P}\\!\\left(\\dfrac{\\sqrt{n}(\\bar{X}_n - \\mu)}{\\sigma} \\lt \\dfrac{\\sqrt{n}(5.5 - \\mu)}{\\sigma}\\right)$.</li>" +
        "<li>Plug in $n = 125$, $\\mu = 5$, $\\sigma = \\sqrt{5}$: the cutoff is $\\sqrt{125}\\,(0.5)/\\sqrt{5} = \\sqrt{25}\\,(0.5) = 5 \\times 0.5 = 2.5$.</li>" +
        "<li>So $\\mathbb{P}(\\bar{X}_n \\lt 5.5) \\approx \\mathbb{P}(Z \\lt 2.5) = .9938$.</li>" +
        "</ul>" },
      { h: "Using it when sigma is unknown — confidence intervals", body:
        "<p>The CLT needs $\\sigma$, which we rarely know. We can estimate $\\sigma^2$ from the data with the sample variance $S_n^2 = \\dfrac{1}{n-1}\\sum_{i=1}^n (X_i - \\bar{X}_n)^2$. Replacing $\\sigma$ by $S_n$ keeps the CLT valid (Theorem 5.10): $\\dfrac{\\sqrt{n}(\\bar{X}_n - \\mu)}{S_n} \\rightsquigarrow N(0,1)$. This is what lets us build large-sample confidence intervals for $\\mu$ from data alone.</p>" +
        "<p>How accurate is the Normal approximation? The Berry-Essèen inequality (Theorem 5.11) bounds the error: if $\\mathbb{E}|X_1|^3 \\lt \\infty$, then $\\sup_z |\\mathbb{P}(Z_n \\le z) - \\Phi(z)| \\le \\dfrac{33}{4}\\cdot\\dfrac{\\mathbb{E}|X_1 - \\mu|^3}{\\sqrt{n}\\,\\sigma^3}$.</p>" }
    ],
    takeaways: [
      "CLT: $\\sqrt{n}(\\bar{X}_n - \\mu)/\\sigma \\rightsquigarrow N(0,1)$, regardless of the underlying distribution's shape.",
      "For 125 Poisson(5) programs, $\\mathbb{P}(\\bar{X}_n \\lt 5.5) \\approx \\mathbb{P}(Z \\lt 2.5) = .9938$.",
      "Swapping the unknown $\\sigma$ for the sample SD $S_n$ leaves the CLT valid, enabling confidence intervals.",
      "Berry-Essèen bounds the approximation error by a constant times $\\mathbb{E}|X_1-\\mu|^3 / (\\sqrt{n}\\,\\sigma^3)$."
    ]
  });

  // ── 4. The Delta Method ──
  B({
    id: "aos-ch5-delta-method",
    chapter: "Chapter 5",
    title: "The Delta Method",
    tagline: "Pushing a Normal limit through a smooth function g.",
    sections: [
      { h: "Statement", body:
        "<p>If $Y_n$ has a limiting Normal distribution, the delta method finds the limiting distribution of $g(Y_n)$ for a smooth function $g$. Theorem 5.13: suppose $\\dfrac{\\sqrt{n}(Y_n - \\mu)}{\\sigma} \\rightsquigarrow N(0,1)$ and $g$ is differentiable with $g'(\\mu) \\neq 0$. Then</p>" +
        "<p>$\\dfrac{\\sqrt{n}(g(Y_n) - g(\\mu))}{|g'(\\mu)|\\,\\sigma} \\rightsquigarrow N(0,1)$.</p>" +
        "<p>In words: $Y_n \\approx N(\\mu, \\sigma^2/n)$ implies $g(Y_n) \\approx N\\!\\left(g(\\mu),\\, (g'(\\mu))^2\\,\\sigma^2/n\\right)$. The function $g$ shifts the center to $g(\\mu)$ and rescales the variance by the squared slope $(g'(\\mu))^2$.</p>" },
      { h: "Example: exponential of the sample mean", body:
        "<p>Let $X_1, \\ldots, X_n$ be IID with finite mean $\\mu$ and finite variance $\\sigma^2$. By the CLT, $\\sqrt{n}(\\bar{X}_n - \\mu)/\\sigma \\rightsquigarrow N(0,1)$. Define $W_n = e^{\\bar{X}_n}$, so $W_n = g(\\bar{X}_n)$ with $g(s) = e^s$.</p>" +
        "<ul class=\"steps\">" +
        "<li>Here $g(s) = e^s$, so the derivative is $g'(s) = e^s$ and at the center $g'(\\mu) = e^{\\mu}$.</li>" +
        "<li>Center of the result: $g(\\mu) = e^{\\mu}$.</li>" +
        "<li>Variance of the result: $(g'(\\mu))^2\\,\\sigma^2/n = (e^{\\mu})^2\\,\\sigma^2/n = e^{2\\mu}\\sigma^2/n$.</li>" +
        "<li>Therefore $W_n \\approx N\\!\\left(e^{\\mu},\\, e^{2\\mu}\\sigma^2/n\\right)$.</li>" +
        "</ul>" },
      { h: "Multivariate version", body:
        "<p>There is also a multivariate delta method (Theorem 5.15). If $\\sqrt{n}(Y_n - \\mu) \\rightsquigarrow N(0, \\Sigma)$ for a random vector $Y_n$, and $g:\\mathbb{R}^k \\to \\mathbb{R}$ has gradient $\\nabla g$ with $\\nabla_\\mu = \\nabla g$ evaluated at $\\mu$ having nonzero entries, then $\\sqrt{n}(g(Y_n) - g(\\mu)) \\rightsquigarrow N\\!\\left(0,\\, \\nabla_\\mu^T \\Sigma\\, \\nabla_\\mu\\right)$. The scalar slope is replaced by the gradient, and the variance becomes a quadratic form in $\\Sigma$.</p>" }
    ],
    takeaways: [
      "Delta method: $Y_n \\approx N(\\mu,\\sigma^2/n)$ gives $g(Y_n) \\approx N(g(\\mu), (g'(\\mu))^2\\sigma^2/n)$ for smooth $g$ with $g'(\\mu)\\neq0$.",
      "Example: with $g(s)=e^s$, $W_n = e^{\\bar{X}_n} \\approx N(e^\\mu, e^{2\\mu}\\sigma^2/n)$.",
      "Multivariate form replaces the squared derivative with the quadratic form $\\nabla_\\mu^T\\Sigma\\,\\nabla_\\mu$."
    ]
  });

  // Figure 5.1 (Example 5.3): F_n(t) for sqrt(n) X_n ~ N(0,1) converging to the
  // point-mass CDF F at 0, shown at n = 1, 4, 16, 100. The book's figure is schematic;
  // we reconstruct the curves from F_n(t) = Phi(sqrt(n) t), which IS the book's stated CDF.
  window.CODEVIZ["aos-ch5-types-of-convergence"] = {
    charts: [
      { type: "line",
        title: "Example 5.3 — F_n(t) sharpening toward the point mass at 0 (illustrative reconstruction)",
        interpret: "As n grows, F_n(t) = Phi(sqrt(n) t) steepens toward the step at 0: F(t)=0 for t<0 and 1 for t>0. It converges at every t except t=0, which is not a continuity point of the limit F.",
        xlabel: "t", ylabel: "F_n(t)",
        series: [
          { name: "n = 1",   color: "#4ea1ff", points: [[-1,0.159],[-0.6,0.274],[-0.3,0.382],[0,0.5],[0.3,0.618],[0.6,0.726],[1,0.841]] },
          { name: "n = 4",   color: "#7ee787", points: [[-1,0.023],[-0.6,0.115],[-0.3,0.274],[0,0.5],[0.3,0.726],[0.6,0.885],[1,0.977]] },
          { name: "n = 16",  color: "#ffb454", points: [[-1,0.00003],[-0.6,0.008],[-0.3,0.115],[0,0.5],[0.3,0.885],[0.6,0.992],[1,0.99997]] },
          { name: "n = 100", color: "#c89bff", points: [[-0.3,0.0013],[-0.15,0.067],[-0.05,0.309],[0,0.5],[0.05,0.691],[0.15,0.933],[0.3,0.9987]] }
        ]
      }
    ]
  };
})();
