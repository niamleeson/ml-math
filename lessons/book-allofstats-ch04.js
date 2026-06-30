/* All of Statistics (Larry Wasserman) — Chapter 4 "Inequalities". Self-registering book lessons. */
(function () {
  window.LESSONS = window.LESSONS || [];
  window.CODEVIZ = window.CODEVIZ || {};
  const M = "All of Statistics";
  const BOOK = "All of Statistics";
  const B = (o) => window.LESSONS.push(Object.assign({ module: M, template: "book", book: BOOK }, o));

  // 1 — Markov's inequality
  B({
    id: "aos-ch4-markov",
    chapter: "Chapter 4",
    title: "Markov's inequality",
    tagline: "A non-negative variable rarely lands far above its mean.",
    sections: [
      {
        h: "Why inequalities",
        body:
          "<p>The chapter opens by noting that inequalities are useful for putting bounds on quantities that would " +
          "otherwise be hard to compute, and that they will reappear in the theory of convergence. The first one is " +
          "Markov's inequality.</p>"
      },
      {
        h: "The statement",
        body:
          "<p>Let $X$ be a random variable that is never negative, and suppose its expected value $\\mathbb{E}(X)$ " +
          "exists. Here $\\mathbb{E}(X)$ is the long-run average value of $X$. Then for any positive cutoff $t$,</p>" +
          "<p>$\\mathbb{P}(X \\gt t) \\le \\dfrac{\\mathbb{E}(X)}{t}.$</p>" +
          "<p>In words: the chance that $X$ exceeds $t$ is at most the mean divided by $t$. The larger the cutoff $t$, " +
          "the smaller this guaranteed bound.</p>"
      },
      {
        h: "The book's proof",
        body:
          "<p>Because $X \\gt 0$, its mean is the integral of $x f(x)$ from $0$ to infinity, where $f$ is the " +
          "density (the curve whose area gives probabilities). Wasserman splits that integral at the cutoff $t$:</p>" +
          "<ul class=\"steps\">" +
          "<li>$\\mathbb{E}(X) = \\int_0^\\infty x f(x)\\,dx = \\int_0^t x f(x)\\,dx + \\int_t^\\infty x f(x)\\,dx.$</li>" +
          "<li>Drop the first piece (it is $\\ge 0$): $\\mathbb{E}(X) \\ge \\int_t^\\infty x f(x)\\,dx.$</li>" +
          "<li>On the region $x \\ge t$ replace $x$ by the smaller value $t$: $\\int_t^\\infty x f(x)\\,dx \\ge t \\int_t^\\infty f(x)\\,dx = t\\,\\mathbb{P}(X \\gt t).$</li>" +
          "<li>So $\\mathbb{E}(X) \\ge t\\,\\mathbb{P}(X \\gt t)$, and dividing by $t$ gives the result.</li>" +
          "</ul>"
      }
    ],
    takeaways: [
      "For non-negative $X$: $\\mathbb{P}(X \\gt t) \\le \\mathbb{E}(X)/t$.",
      "Proof splits the mean integral at $t$ and bounds $x$ below by $t$ on the tail.",
      "Bigger cutoff $t$ gives a smaller tail bound."
    ]
  });

  // 2 — Chebyshev's inequality
  B({
    id: "aos-ch4-chebyshev",
    chapter: "Chapter 4",
    title: "Chebyshev's inequality",
    tagline: "Variance controls how far a variable strays from its mean.",
    sections: [
      {
        h: "The statement",
        body:
          "<p>Let $\\mu = \\mathbb{E}(X)$ be the mean and $\\sigma^2 = \\mathbb{V}(X)$ the variance (the average " +
          "squared distance of $X$ from its mean); $\\sigma$ is the standard deviation, its square root. Then for " +
          "any positive distance $t$,</p>" +
          "<p>$\\mathbb{P}(|X - \\mu| \\ge t) \\le \\dfrac{\\sigma^2}{t^2}.$</p>" +
          "<p>Writing $Z = (X - \\mu)/\\sigma$ for the number of standard deviations away from the mean, this same " +
          "fact reads $\\mathbb{P}(|Z| \\ge k) \\le 1/k^2$ for any positive $k$.</p>"
      },
      {
        h: "Two quick numbers",
        body:
          "<p>The book reads off two special cases directly from $1/k^2$:</p>" +
          "<ul class=\"steps\">" +
          "<li>$k = 2$: $\\mathbb{P}(|Z| \\gt 2) \\le 1/2^2 = 1/4.$ No more than a quarter of the probability sits beyond two standard deviations.</li>" +
          "<li>$k = 3$: $\\mathbb{P}(|Z| \\gt 3) \\le 1/3^2 = 1/9.$ No more than about $11\\%$ sits beyond three.</li>" +
          "</ul>"
      },
      {
        h: "The book's proof",
        body:
          "<p>The trick is to square the deviation and then apply Markov's inequality to the non-negative quantity " +
          "$|X - \\mu|^2$:</p>" +
          "<ul class=\"steps\">" +
          "<li>$\\mathbb{P}(|X - \\mu| \\ge t) = \\mathbb{P}(|X - \\mu|^2 \\ge t^2)$ — squaring both sides keeps the same event.</li>" +
          "<li>By Markov, $\\mathbb{P}(|X - \\mu|^2 \\ge t^2) \\le \\dfrac{\\mathbb{E}(X - \\mu)^2}{t^2} = \\dfrac{\\sigma^2}{t^2}.$</li>" +
          "<li>The $Z$ form follows by setting $t = k\\sigma$.</li>" +
          "</ul>"
      },
      {
        h: "Normal-tail add-on: Mill's inequality",
        body:
          "<p>The chapter also records Mill's inequality for the standard Normal. If $Z \\sim N(0,1)$, then for $t \\gt 0$:</p>" +
          "<p>$\\mathbb{P}(|Z| \\gt t) \\le \\sqrt{\\dfrac{2}{\\pi}}\\,\\dfrac{e^{-t^2/2}}{t}$.</p>" +
          "<p>Unlike Chebyshev's $1/t^2$ bound, this one uses the Normal shape and decays like an exponential in $t^2$.</p>"
      },
      {
        h: "Example: a predictor's error rate",
        body:
          "<p>Wasserman tests a prediction method (his example is a neural net) on $n$ fresh cases. Let $X_i = 1$ when " +
          "the predictor is wrong and $X_i = 0$ when it is right. The observed error rate is the average " +
          "$\\bar{X}_n = n^{-1}\\sum_{i=1}^n X_i$. Each $X_i$ behaves like a Bernoulli draw with unknown mean $p$, " +
          "the true error rate. How likely is $\\bar{X}_n$ to miss $p$ by more than $\\epsilon$?</p>" +
          "<ul class=\"steps\">" +
          "<li>The variance of the average is $\\mathbb{V}(\\bar{X}_n) = p(1-p)/n$.</li>" +
          "<li>Chebyshev gives $\\mathbb{P}(|\\bar{X}_n - p| \\gt \\epsilon) \\le \\dfrac{p(1-p)}{n\\epsilon^2}.$</li>" +
          "<li>Since $p(1-p) \\le 1/4$ for every $p$, this is at most $\\dfrac{1}{4n\\epsilon^2}.$</li>" +
          "<li>With $\\epsilon = 0.2$ and $n = 100$: $\\dfrac{1}{4 \\cdot 100 \\cdot 0.2^2} = \\dfrac{1}{16} = 0.0625.$</li>" +
          "</ul>"
      }
    ],
    takeaways: [
      "$\\mathbb{P}(|X - \\mu| \\ge t) \\le \\sigma^2/t^2$; in $Z$ units, $\\mathbb{P}(|Z| \\ge k) \\le 1/k^2$.",
      "Two std devs: bound $1/4$. Three std devs: bound $1/9$.",
      "Proof: square the deviation, then apply Markov.",
      "Error-rate example with $\\epsilon=0.2$, $n=100$ gives bound $0.0625$."
    ]
  });
  window.CODEVIZ["aos-ch4-chebyshev"] = {
    charts: [
      {
        type: "bars",
        title: "Chebyshev bounds read from Chapter 4",
        interpret: "The book's two standard-deviation examples give 1/4 and 1/9; the prediction-error example gives 1/(4·100·0.2²)=0.0625.",
        labels: ["|Z| > 2", "|Z| > 3", "error rate"],
        values: [0.25, 0.1111111111111111, 0.0625],
        valueLabels: ["1/4", "1/9", "0.0625"],
        colors: ["#4ea1ff", "#4ea1ff", "#ffb454"]
      }
    ],
    code: "# Chebyshev numbers from Chapter 4\nfor k in [2, 3]:\n    print(k, 1 / k**2)          # 2 -> 0.25, 3 -> 0.111111...\n\nn = 100\nepsilon = 0.2\nbound = 1 / (4 * n * epsilon**2)\nprint(bound)                    # 0.0625"
  };

  // 3 — Hoeffding's inequality
  B({
    id: "aos-ch4-hoeffding",
    chapter: "Chapter 4",
    title: "Hoeffding's inequality",
    tagline: "For bounded variables the tail shrinks exponentially, far faster than Chebyshev.",
    sections: [
      {
        h: "Same spirit, sharper bound",
        body:
          "<p>The book describes Hoeffding's inequality as similar in spirit to Markov's but much sharper, and presents " +
          "it in two parts.</p>"
      },
      {
        h: "Part one: a sum of bounded zero-mean variables",
        body:
          "<p>Let $Y_1, \\dots, Y_n$ be independent observations, each with mean zero ($\\mathbb{E}(Y_i) = 0$) and each " +
          "trapped in its own interval $a_i \\le Y_i \\le b_i$. Then for any $\\epsilon \\gt 0$ and any $t \\gt 0$,</p>" +
          "<p>$\\mathbb{P}\\!\\left(\\sum_{i=1}^n Y_i \\ge \\epsilon\\right) \\le e^{-t\\epsilon} \\prod_{i=1}^n e^{t^2 (b_i - a_i)^2 / 8}.$</p>" +
          "<p>The free knob $t$ can be tuned to make the right-hand side as small as possible.</p>"
      },
      {
        h: "Part two: the Bernoulli version",
        body:
          "<p>Specialising to coin-flip style data: if $X_1, \\dots, X_n \\sim \\text{Bernoulli}(p)$ and " +
          "$\\bar{X}_n = n^{-1}\\sum_{i=1}^n X_i$, then for any $\\epsilon \\gt 0$,</p>" +
          "<p>$\\mathbb{P}(|\\bar{X}_n - p| \\gt \\epsilon) \\le 2 e^{-2 n \\epsilon^2}.$</p>" +
          "<p>The bound falls off exponentially in $n\\epsilon^2$, so it tightens fast as the sample grows.</p>"
      },
      {
        h: "Example: the same error rate, much tighter",
        body:
          "<p>Revisit the Bernoulli case with $n = 100$ and $\\epsilon = 0.2$, where Chebyshev gave $0.0625$. " +
          "Hoeffding gives a far smaller bound:</p>" +
          "<ul class=\"steps\">" +
          "<li>$\\mathbb{P}(|\\bar{X}_n - p| \\gt 0.2) \\le 2 e^{-2 (100)(0.2)^2}.$</li>" +
          "<li>The exponent is $-2 \\cdot 100 \\cdot 0.04 = -8$, so the bound is $2 e^{-8} \\approx 0.00067.$</li>" +
          "<li>Numerically $2e^{-8}=0.0006709$, and $0.0625/0.0006709 \\approx 93.2$, so the Hoeffding bound is about $93$ times smaller.</li>" +
          "</ul>"
      },
      {
        h: "A confidence interval for p",
        body:
          "<p>Hoeffding hands us a simple confidence interval for a binomial $p$. Fix $\\alpha \\gt 0$ and set " +
          "$\\epsilon_n = \\sqrt{\\dfrac{1}{2n}\\log\\!\\left(\\dfrac{2}{\\alpha}\\right)}.$ Plugging this $\\epsilon_n$ " +
          "into the Bernoulli bound makes the right-hand side exactly $2 e^{-2 n \\epsilon_n^2} = \\alpha$. Letting " +
          "$C = (\\bar{X}_n - \\epsilon_n,\\ \\bar{X}_n + \\epsilon_n)$, the chance that $p$ falls outside $C$ is at most " +
          "$\\alpha$, so $C$ traps the true $p$ with probability at least $1 - \\alpha$ — a $1-\\alpha$ confidence " +
          "interval.</p>"
      }
    ],
    takeaways: [
      "Bounded zero-mean sum: $\\mathbb{P}(\\sum Y_i \\ge \\epsilon) \\le e^{-t\\epsilon}\\prod e^{t^2(b_i-a_i)^2/8}$.",
      "Bernoulli form: $\\mathbb{P}(|\\bar{X}_n - p| \\gt \\epsilon) \\le 2 e^{-2 n \\epsilon^2}$.",
      "Same $n=100$, $\\epsilon=0.2$: Hoeffding gives $\\approx 0.00067$ vs Chebyshev's $0.0625$.",
      "Choosing $\\epsilon_n = \\sqrt{(1/2n)\\log(2/\\alpha)}$ yields a $1-\\alpha$ confidence interval for $p$."
    ]
  });
  window.CODEVIZ["aos-ch4-hoeffding"] = {
    charts: [
      {
        type: "bars",
        title: "Same error-rate example: Chebyshev vs Hoeffding",
        interpret: "For n=100 and ε=0.2, Hoeffding's exponential bound 2e⁻⁸=0.0006709 is about 93 times smaller than Chebyshev's 0.0625.",
        labels: ["Chebyshev", "Hoeffding"],
        values: [0.0625, 0.0006709252558050237],
        valueLabels: ["0.0625", "0.0006709"],
        colors: ["#ffb454", "#7ee787"]
      }
    ],
    code: "# Bound computation in Examples 4.3 and 4.6\nimport math\n\nn = 100\nepsilon = 0.2\nchebyshev = 1 / (4 * n * epsilon**2)\nhoeffding = 2 * math.exp(-2 * n * epsilon**2)\nprint(chebyshev)                # 0.0625\nprint(hoeffding)                # 0.0006709252558050237\nprint(chebyshev / hoeffding)    # 93.155..."
  };

  // 4 — Cauchy-Schwarz inequality
  B({
    id: "aos-ch4-cauchy-schwarz",
    chapter: "Chapter 4",
    title: "Cauchy-Schwarz inequality",
    tagline: "The mean of a product is bounded by the means of the squares.",
    sections: [
      {
        h: "Inequalities for expectations",
        body:
          "<p>The section's heading is \"Inequalities For Expectations\", and it contains two results on expected " +
          "values. The first is the Cauchy-Schwarz inequality.</p>"
      },
      {
        h: "The statement",
        body:
          "<p>If $X$ and $Y$ both have finite variances, then</p>" +
          "<p>$\\mathbb{E}\\,|XY| \\le \\sqrt{\\mathbb{E}(X^2)\\,\\mathbb{E}(Y^2)}.$</p>" +
          "<p>In words: the average size of the product $XY$ can never exceed the square root of the product of the two " +
          "mean-squares. It bounds how the two variables can jointly grow.</p>"
      }
    ],
    takeaways: [
      "$\\mathbb{E}\\,|XY| \\le \\sqrt{\\mathbb{E}(X^2)\\,\\mathbb{E}(Y^2)}$, when both variances are finite.",
      "It limits the average product by the two mean-squared sizes."
    ]
  });

  // 5 — Jensen's inequality
  B({
    id: "aos-ch4-jensen",
    chapter: "Chapter 4",
    title: "Jensen's inequality",
    tagline: "A curved function and the averaging operation cannot be swapped freely.",
    sections: [
      {
        h: "Convex and concave functions",
        body:
          "<p>A function $g$ is <strong>convex</strong> (curving upward, like a bowl) if for every $x, y$ and every " +
          "$\\alpha$ between $0$ and $1$, $g(\\alpha x + (1-\\alpha) y) \\le \\alpha g(x) + (1-\\alpha) g(y)$ — the " +
          "curve sits below the straight chord joining two of its points. If $g$ is twice differentiable with " +
          "$g''(x) \\ge 0$ everywhere (the second derivative measures how fast the slope is bending), then $g$ is " +
          "convex. A convex $g$ lies above any tangent line touching it. A function is <strong>concave</strong> " +
          "(curving downward) if $-g$ is convex. The book's examples are:</p>" +
          "<table class=\"extable\"><thead><tr><th>function</th><th>shape</th><th>reason in the chapter</th></tr></thead><tbody>" +
          "<tr><td class=\"row-h\">$g(x)=x^2$</td><td>convex</td><td>$g''(x)=2 \\ge 0$</td></tr>" +
          "<tr><td class=\"row-h\">$g(x)=e^x$</td><td>convex</td><td>$g''(x)=e^x \\ge 0$</td></tr>" +
          "<tr><td class=\"row-h\">$g(x)=-x^2$</td><td>concave</td><td>$-g$ is convex</td></tr>" +
          "<tr><td class=\"row-h\">$g(x)=\\log x$</td><td>concave</td><td>$-g$ is convex on $x \\gt 0$</td></tr>" +
          "</tbody></table>"
      },
      {
        h: "The statement",
        body:
          "<p>If $g$ is convex, then averaging before applying $g$ never overshoots applying $g$ before averaging:</p>" +
          "<p>$\\mathbb{E}\\,g(X) \\ge g(\\mathbb{E}X).$</p>" +
          "<p>If $g$ is concave, the inequality flips:</p>" +
          "<p>$\\mathbb{E}\\,g(X) \\le g(\\mathbb{E}X).$</p>"
      },
      {
        h: "The book's proof",
        body:
          "<p>The argument uses the tangent line at the mean:</p>" +
          "<ul class=\"steps\">" +
          "<li>Let $L(x) = a + bx$ be the line tangent to $g$ at the point $\\mathbb{E}(X)$.</li>" +
          "<li>Convexity means $g$ lies above this line: $g(x) \\ge L(x)$ for all $x$.</li>" +
          "<li>Take expectations: $\\mathbb{E}\\,g(X) \\ge \\mathbb{E}\\,L(X) = \\mathbb{E}(a + bX) = a + b\\,\\mathbb{E}(X) = L(\\mathbb{E}(X)).$</li>" +
          "<li>Since the line touches $g$ at $\\mathbb{E}(X)$, $L(\\mathbb{E}(X)) = g(\\mathbb{E}(X))$, giving $\\mathbb{E}\\,g(X) \\ge g(\\mathbb{E}X).$</li>" +
          "</ul>"
      },
      {
        h: "Three consequences",
        body:
          "<p>The book reads off three corollaries directly:</p>" +
          "<ul>" +
          "<li>$\\mathbb{E}(X^2) \\ge (\\mathbb{E}X)^2$ — from convexity of $x^2$ (this is just variance being non-negative).</li>" +
          "<li>If $X$ is positive, $\\mathbb{E}(1/X) \\ge 1/\\mathbb{E}(X)$.</li>" +
          "<li>Since $\\log$ is concave, $\\mathbb{E}(\\log X) \\le \\log \\mathbb{E}(X).$</li>" +
          "</ul>"
      }
    ],
    takeaways: [
      "Convex $g$: $\\mathbb{E}\\,g(X) \\ge g(\\mathbb{E}X)$. Concave $g$: the reverse.",
      "Convex means below the chord and above every tangent line; $g'' \\ge 0$ implies convex.",
      "Proof bounds $g$ below by its tangent at $\\mathbb{E}(X)$, then takes expectations.",
      "Corollaries: $\\mathbb{E}(X^2) \\ge (\\mathbb{E}X)^2$, $\\mathbb{E}(1/X) \\ge 1/\\mathbb{E}(X)$, $\\mathbb{E}(\\log X) \\le \\log\\mathbb{E}(X)$."
    ]
  });
})();
