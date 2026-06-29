/* All of Statistics (Wasserman) — Chapter 3, "Expectation". Self-registering book lessons. */
(function () {
  window.LESSONS = window.LESSONS || [];
  window.CODEVIZ = window.CODEVIZ || {};
  const M = "All of Statistics";
  const B = (o) => window.LESSONS.push(Object.assign({ module: M, template: "book", book: "All of Statistics" }, o));

  B({
    id: "aos-ch3-expectation",
    chapter: "Chapter 3",
    title: "Expectation of a random variable",
    tagline: "The expectation is the one-number average value of a random variable.",
    sections: [
      {
        h: "Definition",
        body:
          "<p>The expected value, also called the mean or first moment, of a random variable $X$ is its average value. Wasserman writes it with a single unifying notation $\\mathbb{E}(X) = \\int x\\, dF(x)$, which stands for a sum when $X$ is discrete and an integral when $X$ is continuous:</p>" +
          "<p>$\\mathbb{E}(X) = \\sum_x x f(x)$ in the discrete case, and $\\mathbb{E}(X) = \\int x f(x)\\, dx$ in the continuous case.</p>" +
          "<p>Here $f(x)$ is the probability function (discrete) or density (continuous), and $x$ ranges over the possible values. Common symbols for the mean are $\\mathbb{E}(X)$, $\\mathbb{E} X$, $\\mu$, and $\\mu_X$. The mean is a one-number summary of the whole distribution: think of $\\mathbb{E}(X)$ as the long-run average $\\sum_{i=1}^{n} X_i / n$ of many independent draws (the law of large numbers makes this precise).</p>"
      },
      {
        h: "When the mean exists",
        body:
          "<p>The expectation exists only if $\\int |x|\\, dF_X(x) \\lt \\infty$. If that quantity is infinite, the mean is not defined.</p>" +
          "<p>The Cauchy distribution, with density $f_X(x) = 1 / (\\pi(1+x^2))$, is the book's cautionary example. Integrating $|x|$ against this density diverges to $\\infty$, so the Cauchy mean does not exist. The intuition: the Cauchy has thick tails, so extreme observations are common and a running average never settles down.</p>"
      },
      {
        h: "Worked examples",
        body:
          "<p>The chapter computes several means directly from the definition:</p>" +
          "<ul class=\"steps\">" +
          "<li>$X \\sim \\text{Bernoulli}(p)$: $\\mathbb{E}(X) = (0)(1-p) + (1)(p) = p$.</li>" +
          "<li>Two fair coin flips, $X$ = number of heads with $f(0)=f(2)=1/4$ and $f(1)=1/2$: $\\mathbb{E}(X) = 0(1/4) + 1(1/2) + 2(1/4) = 1$.</li>" +
          "<li>$X \\sim \\text{Uniform}(-1,3)$: $\\mathbb{E}(X) = \\tfrac{1}{4}\\int_{-1}^{3} x\\, dx = 1$.</li>" +
          "</ul>"
      },
      {
        h: "The rule of the lazy statistician",
        body:
          "<p>To find the mean of $Y = r(X)$ you do not need the density of $Y$. Theorem 3.6 says you can integrate $r$ directly against the distribution of $X$:</p>" +
          "<p>$\\mathbb{E}(Y) = \\mathbb{E}(r(X)) = \\int r(x)\\, dF_X(x)$.</p>" +
          "<p>This makes intuitive sense: the payout $r(x)$ is weighted by the chance that $X=x$ and summed over all $x$. A special case shows probability is itself an expectation: if $r$ is the indicator $I_A$ of an event $A$, then $\\mathbb{E}(I_A(X)) = \\mathbb{P}(X \\in A)$.</p>" +
          "<p>Worked uses of the rule:</p>" +
          "<ul class=\"steps\">" +
          "<li>$X \\sim \\text{Unif}(0,1)$, $Y = e^X$: $\\mathbb{E}(Y) = \\int_0^1 e^x\\, dx = e - 1$.</li>" +
          "<li>Break a unit stick at random; $Y$ = longer piece $= \\max\\{X, 1-X\\}$ with $X \\sim \\text{Unif}(0,1)$: $\\mathbb{E}(Y) = \\int_0^{1/2}(1-x)\\,dx + \\int_{1/2}^{1} x\\,dx = 3/4$.</li>" +
          "<li>$(X,Y)$ uniform on the unit square, $Z = X^2 + Y^2$: $\\mathbb{E}(Z) = \\int_0^1 x^2\\,dx + \\int_0^1 y^2\\,dy = 1/3 + 1/3 = 2/3$.</li>" +
          "</ul>" +
          "<p>The $k$th moment of $X$ is $\\mathbb{E}(X^k)$, defined when $\\mathbb{E}(|X|^k) \\lt \\infty$. Theorem 3.10 notes that if the $k$th moment exists and $j \\lt k$, then the $j$th moment exists too.</p>"
      }
    ],
    takeaways: [
      "The mean is $\\mathbb{E}(X)=\\int x\\,dF(x)$ — a sum for discrete, an integral for continuous.",
      "A mean exists only when $\\int|x|\\,dF \\lt \\infty$; the Cauchy has no mean.",
      "The lazy-statistician rule: $\\mathbb{E}(r(X))=\\int r(x)\\,dF_X(x)$, no need for the density of $r(X)$.",
      "Probability is a special case of expectation via indicator functions."
    ]
  });

  B({
    id: "aos-ch3-variance-covariance",
    chapter: "Chapter 3",
    title: "Variance and covariance",
    tagline: "Variance measures the spread of one variable; covariance measures the linear link between two.",
    sections: [
      {
        h: "Linearity of expectation",
        body:
          "<p>Before variance, the chapter records two key properties of the mean. Theorem 3.11: for any random variables $X_1, \\dots, X_n$ and constants $a_1, \\dots, a_n$,</p>" +
          "<p>$\\mathbb{E}\\left(\\sum_i a_i X_i\\right) = \\sum_i a_i \\mathbb{E}(X_i)$.</p>" +
          "<p>This holds whether or not the variables are independent. Theorem 3.13 adds a multiplication rule that does require independence: if $X_1, \\dots, X_n$ are independent, then $\\mathbb{E}\\left(\\prod_i X_i\\right) = \\prod_i \\mathbb{E}(X_i)$.</p>" +
          "<p>Linearity makes the Binomial mean easy. For $X \\sim \\text{Binomial}(n,p)$, write $X = \\sum_i X_i$ where $X_i = 1$ if toss $i$ is heads. Each $\\mathbb{E}(X_i) = p$, so $\\mathbb{E}(X) = np$ — far simpler than summing $\\sum_x x \\binom{n}{x} p^x (1-p)^{n-x}$ directly.</p>"
      },
      {
        h: "Variance",
        body:
          "<p>Definition 3.14: for $X$ with mean $\\mu$, the variance is</p>" +
          "<p>$\\sigma^2 = \\mathbb{V}(X) = \\mathbb{E}(X - \\mu)^2 = \\int (x - \\mu)^2\\, dF(x)$,</p>" +
          "<p>and the standard deviation is $\\text{sd}(X) = \\sqrt{\\mathbb{V}(X)}$, also written $\\sigma$ or $\\sigma_X$. We do not use $\\mathbb{E}(X - \\mu)$ as a measure of spread because it is always $0$.</p>" +
          "<p>Theorem 3.15 lists the working properties:</p>" +
          "<ul class=\"steps\">" +
          "<li>$\\mathbb{V}(X) = \\mathbb{E}(X^2) - \\mu^2$ — the usual computing formula.</li>" +
          "<li>$\\mathbb{V}(aX + b) = a^2 \\mathbb{V}(X)$ for constants $a,b$.</li>" +
          "<li>If $X_1, \\dots, X_n$ are independent, $\\mathbb{V}\\left(\\sum_i a_i X_i\\right) = \\sum_i a_i^2 \\mathbb{V}(X_i)$.</li>" +
          "</ul>" +
          "<p>Binomial variance (Example 3.16): for $X_i$ a single toss, $\\mathbb{E}(X_i) = p$ and $\\mathbb{E}(X_i^2) = p$, so $\\mathbb{V}(X_i) = p - p^2 = p(1-p)$. By independence $\\mathbb{V}(X) = np(1-p)$. This is $0$ when $p=0$ or $p=1$ — there is no spread when the outcome is certain.</p>"
      },
      {
        h: "Sample mean and sample variance",
        body:
          "<p>For random variables $X_1, \\dots, X_n$ the sample mean is $\\overline{X}_n = \\tfrac{1}{n}\\sum_{i=1}^n X_i$ and the sample variance is $S_n^2 = \\tfrac{1}{n-1}\\sum_{i=1}^n (X_i - \\overline{X}_n)^2$.</p>" +
          "<p>Theorem 3.17: if the $X_i$ are IID with mean $\\mu$ and variance $\\sigma^2$, then $\\mathbb{E}(\\overline{X}_n) = \\mu$, $\\mathbb{V}(\\overline{X}_n) = \\sigma^2 / n$, and $\\mathbb{E}(S_n^2) = \\sigma^2$. The averaging shrinks the variance by a factor of $n$.</p>"
      },
      {
        h: "Covariance and correlation",
        body:
          "<p>Definition 3.18: the covariance of $X$ and $Y$ (with means $\\mu_X, \\mu_Y$ and standard deviations $\\sigma_X, \\sigma_Y$) is</p>" +
          "<p>$\\text{Cov}(X,Y) = \\mathbb{E}\\left((X - \\mu_X)(Y - \\mu_Y)\\right)$,</p>" +
          "<p>and the correlation is $\\rho = \\rho(X,Y) = \\text{Cov}(X,Y) / (\\sigma_X \\sigma_Y)$.</p>" +
          "<p>Theorem 3.19 gives the working facts: $\\text{Cov}(X,Y) = \\mathbb{E}(XY) - \\mathbb{E}(X)\\mathbb{E}(Y)$, and $-1 \\le \\rho(X,Y) \\le 1$. If $Y = aX + b$ then $\\rho = 1$ when $a \\gt 0$ and $\\rho = -1$ when $a \\lt 0$. If $X$ and $Y$ are independent then $\\text{Cov}(X,Y) = \\rho = 0$; the converse is not true in general.</p>" +
          "<p>Theorem 3.20 extends the variance rule to dependent sums: $\\mathbb{V}(X + Y) = \\mathbb{V}(X) + \\mathbb{V}(Y) + 2\\,\\text{Cov}(X,Y)$, and $\\mathbb{V}(X - Y) = \\mathbb{V}(X) + \\mathbb{V}(Y) - 2\\,\\text{Cov}(X,Y)$. More generally $\\mathbb{V}\\left(\\sum_i a_i X_i\\right) = \\sum_i a_i^2 \\mathbb{V}(X_i) + 2 \\sum_{i \\lt j} a_i a_j \\,\\text{Cov}(X_i, X_j)$.</p>"
      },
      {
        h: "Means and variances of common distributions",
        body:
          "<p>Section 3.4 collects the mean and variance of standard distributions. A selection from the book's table:</p>" +
          "<table class=\"extable\">" +
          "<thead><tr><th>Distribution</th><th>Mean</th><th>Variance</th></tr></thead>" +
          "<tbody>" +
          "<tr><td class=\"row-h\">Bernoulli$(p)$</td><td class=\"num\">$p$</td><td class=\"num\">$p(1-p)$</td></tr>" +
          "<tr><td class=\"row-h\">Binomial$(n,p)$</td><td class=\"num\">$np$</td><td class=\"num\">$np(1-p)$</td></tr>" +
          "<tr><td class=\"row-h\">Geometric$(p)$</td><td class=\"num\">$1/p$</td><td class=\"num\">$(1-p)/p^2$</td></tr>" +
          "<tr><td class=\"row-h\">Poisson$(\\lambda)$</td><td class=\"num\">$\\lambda$</td><td class=\"num\">$\\lambda$</td></tr>" +
          "<tr><td class=\"row-h\">Uniform$(a,b)$</td><td class=\"num\">$(a+b)/2$</td><td class=\"num\">$(b-a)^2/12$</td></tr>" +
          "<tr><td class=\"row-h\">Normal$(\\mu,\\sigma^2)$</td><td class=\"num\">$\\mu$</td><td class=\"num\">$\\sigma^2$</td></tr>" +
          "<tr><td class=\"row-h\">Exponential$(\\beta)$</td><td class=\"num\">$\\beta$</td><td class=\"num\">$\\beta^2$</td></tr>" +
          "<tr><td class=\"row-h\">Gamma$(\\alpha,\\beta)$</td><td class=\"num\">$\\alpha\\beta$</td><td class=\"num\">$\\alpha\\beta^2$</td></tr>" +
          "</tbody></table>" +
          "<p>For a random vector $X = (X_1, \\dots, X_k)$ the mean is the vector of component means and the spread is captured by the variance-covariance matrix $\\mathbb{V}(X)$, whose diagonal holds the variances $\\mathbb{V}(X_i)$ and whose off-diagonal entries are the covariances $\\text{Cov}(X_i, X_j)$.</p>"
      }
    ],
    takeaways: [
      "Expectation is linear always; the product rule needs independence.",
      "$\\mathbb{V}(X)=\\mathbb{E}(X^2)-\\mu^2$ and $\\mathbb{V}(aX+b)=a^2\\mathbb{V}(X)$.",
      "Binomial: mean $np$, variance $np(1-p)$, derived via indicator tosses.",
      "$\\text{Cov}(X,Y)=\\mathbb{E}(XY)-\\mathbb{E}(X)\\mathbb{E}(Y)$; independence implies zero covariance but not conversely.",
      "Variance of a sum carries a covariance cross-term: $\\mathbb{V}(X+Y)=\\mathbb{V}(X)+\\mathbb{V}(Y)+2\\,\\text{Cov}(X,Y)$."
    ]
  });

  B({
    id: "aos-ch3-conditional-expectation",
    chapter: "Chapter 3",
    title: "Conditional and iterated expectation",
    tagline: "E[X|Y] is itself a random variable, and averaging it recovers E[X].",
    sections: [
      {
        h: "Conditional expectation",
        body:
          "<p>Definition 3.22: the conditional expectation of $X$ given $Y = y$ uses the conditional density $f_{X|Y}(x|y)$ in place of $f_X(x)$:</p>" +
          "<p>$\\mathbb{E}(X \\mid Y = y) = \\sum_x x\\, f_{X|Y}(x|y)$ (discrete) or $\\int x\\, f_{X|Y}(x|y)\\, dx$ (continuous).</p>" +
          "<p>More generally, $\\mathbb{E}(r(X,Y) \\mid Y = y)$ integrates $r(x,y)$ against $f_{X|Y}(x|y)$.</p>"
      },
      {
        h: "A subtle but crucial point",
        body:
          "<p>Wasserman flags a confusing distinction. Whereas $\\mathbb{E}(X)$ is a single number, $\\mathbb{E}(X \\mid Y = y)$ is a function of $y$. Before we observe $Y$, we do not know which value it takes, so $\\mathbb{E}(X \\mid Y)$ is itself a random variable — the one whose value equals $\\mathbb{E}(X \\mid Y = y)$ when $Y = y$.</p>" +
          "<p>Example 3.23 makes this concrete. Draw $X \\sim \\text{Unif}(0,1)$, then draw $Y \\mid X = x \\sim \\text{Unif}(x, 1)$. Since $f_{Y|X}(y|x) = 1/(1-x)$ for $x \\lt y \\lt 1$,</p>" +
          "<p>$\\mathbb{E}(Y \\mid X = x) = \\dfrac{1}{1-x}\\int_x^1 y\\, dy = \\dfrac{1+x}{2}$.</p>" +
          "<p>So $\\mathbb{E}(Y \\mid X) = (1+X)/2$ is a random variable; once $X = x$ is observed its value is the number $(1+x)/2$.</p>"
      },
      {
        h: "The rule of iterated expectations",
        body:
          "<p>Theorem 3.24: assuming the expectations exist,</p>" +
          "<p>$\\mathbb{E}\\left[\\mathbb{E}(Y \\mid X)\\right] = \\mathbb{E}(Y)$ and $\\mathbb{E}\\left[\\mathbb{E}(X \\mid Y)\\right] = \\mathbb{E}(X)$,</p>" +
          "<p>and more generally $\\mathbb{E}\\left[\\mathbb{E}(r(X,Y) \\mid X)\\right] = \\mathbb{E}(r(X,Y))$.</p>" +
          "<p>The proof of the first identity uses $f(x,y) = f(x) f(y|x)$:</p>" +
          "<ul class=\"steps\">" +
          "<li>$\\mathbb{E}[\\mathbb{E}(Y \\mid X)] = \\int \\mathbb{E}(Y \\mid X = x)\\, f_X(x)\\, dx = \\int\\!\\!\\int y\\, f(y|x)\\, f(x)\\, dy\\, dx$.</li>" +
          "<li>$= \\int\\!\\!\\int y\\, f(x,y)\\, dx\\, dy = \\mathbb{E}(Y)$.</li>" +
          "</ul>" +
          "<p>Example 3.25 reuses Example 3.23 to find $\\mathbb{E}(Y)$ in two easy steps instead of integrating the joint density: since $\\mathbb{E}(Y \\mid X) = (1+X)/2$,</p>" +
          "<p>$\\mathbb{E}(Y) = \\mathbb{E}\\!\\left(\\dfrac{1+X}{2}\\right) = \\dfrac{1 + \\mathbb{E}(X)}{2} = \\dfrac{1 + 1/2}{2} = 3/4$.</p>"
      },
      {
        h: "Conditional variance and the variance decomposition",
        body:
          "<p>Definition 3.26: the conditional variance is $\\mathbb{V}(Y \\mid X = x) = \\int (y - \\mu(x))^2 f(y|x)\\, dy$, where $\\mu(x) = \\mathbb{E}(Y \\mid X = x)$.</p>" +
          "<p>Theorem 3.27 decomposes total variance: $\\mathbb{V}(Y) = \\mathbb{E}\\,\\mathbb{V}(Y \\mid X) + \\mathbb{V}\\,\\mathbb{E}(Y \\mid X)$.</p>" +
          "<p>The book's hierarchical-model example (Example 3.28): draw a county, then draw $n$ people; $X$ = number with a disease. With $Q \\sim \\text{Uniform}(0,1)$ the disease proportion and $X \\mid Q = q \\sim \\text{Binomial}(n,q)$:</p>" +
          "<ul class=\"steps\">" +
          "<li>$\\mathbb{E}(X) = \\mathbb{E}\\,\\mathbb{E}(X \\mid Q) = \\mathbb{E}(nQ) = n\\,\\mathbb{E}(Q) = n/2$.</li>" +
          "<li>$\\mathbb{E}\\,\\mathbb{V}(X \\mid Q) = \\mathbb{E}[nQ(1-Q)] = n\\int_0^1 q(1-q)\\,dq = n/6$.</li>" +
          "<li>$\\mathbb{V}\\,\\mathbb{E}(X \\mid Q) = \\mathbb{V}(nQ) = n^2 \\mathbb{V}(Q) = n^2 \\int_0^1 (q - 1/2)^2\\,dq = n^2/12$.</li>" +
          "<li>Hence $\\mathbb{V}(X) = n/6 + n^2/12$.</li>" +
          "</ul>"
      }
    ],
    takeaways: [
      "$\\mathbb{E}(X|Y=y)$ is a function of $y$; $\\mathbb{E}(X|Y)$ is a random variable.",
      "Rule of iterated expectations: $\\mathbb{E}[\\mathbb{E}(Y|X)] = \\mathbb{E}(Y)$.",
      "It turns hard joint integrals into a two-step average — e.g. $\\mathbb{E}(Y)=3/4$ in Example 3.25.",
      "Total variance splits: $\\mathbb{V}(Y) = \\mathbb{E}\\,\\mathbb{V}(Y|X) + \\mathbb{V}\\,\\mathbb{E}(Y|X)$."
    ]
  });

  B({
    id: "aos-ch3-moment-generating-functions",
    chapter: "Chapter 3",
    title: "Moment generating functions",
    tagline: "The MGF encodes all moments and pins down the distribution.",
    sections: [
      {
        h: "Definition",
        body:
          "<p>Definition 3.29: the moment generating function (MGF), also called the Laplace transform, of $X$ is</p>" +
          "<p>$\\psi_X(t) = \\mathbb{E}(e^{tX}) = \\int e^{tx}\\, dF(x)$,</p>" +
          "<p>where $t$ ranges over the real numbers. The discussion assumes the MGF is well defined for all $t$ in some open interval around $t = 0$.</p>"
      },
      {
        h: "Why it generates moments",
        body:
          "<p>When the MGF is well defined, differentiation and expectation can be interchanged. Differentiating once and setting $t = 0$:</p>" +
          "<p>$\\psi'(0) = \\left[\\dfrac{d}{dt}\\mathbb{E} e^{tX}\\right]_{t=0} = \\mathbb{E}\\!\\left[\\dfrac{d}{dt} e^{tX}\\right]_{t=0} = \\mathbb{E}[X e^{tX}]_{t=0} = \\mathbb{E}(X)$.</p>" +
          "<p>Taking $k$ derivatives gives $\\psi^{(k)}(0) = \\mathbb{E}(X^k)$ — a recipe for reading off every moment.</p>" +
          "<p>Example 3.30: for $X \\sim \\text{Exp}(1)$ and any $t \\lt 1$,</p>" +
          "<ul class=\"steps\">" +
          "<li>$\\psi_X(t) = \\int_0^\\infty e^{tx} e^{-x}\\, dx = \\int_0^\\infty e^{(t-1)x}\\, dx = \\dfrac{1}{1-t}$ (divergent if $t \\ge 1$).</li>" +
          "<li>$\\psi'(0) = 1$, so $\\mathbb{E}(X) = 1$.</li>" +
          "<li>$\\psi''(0) = 2$, so $\\mathbb{E}(X^2) = 2$ and $\\mathbb{V}(X) = \\mathbb{E}(X^2) - \\mu^2 = 2 - 1 = 1$.</li>" +
          "</ul>"
      },
      {
        h: "Properties and the uniqueness theorem",
        body:
          "<p>Lemma 3.31 lists two properties. (1) If $Y = aX + b$ then $\\psi_Y(t) = e^{bt}\\psi_X(at)$. (2) If $X_1, \\dots, X_n$ are independent and $Y = \\sum_i X_i$, then $\\psi_Y(t) = \\prod_i \\psi_i(t)$ — the MGF of a sum of independents is the product of their MGFs.</p>" +
          "<p>Example 3.32: for $X \\sim \\text{Binomial}(n,p)$, write $X = \\sum_i X_i$ with each $X_i$ Bernoulli. Each $\\psi_i(t) = p e^t + q$ (with $q = 1-p$), so $\\psi_X(t) = (p e^t + q)^n$.</p>" +
          "<p>Theorem 3.33 (uniqueness): if $\\psi_X(t) = \\psi_Y(t)$ for all $t$ in an open interval around $0$, then $X$ and $Y$ have the same distribution. The MGF characterizes the distribution — no two different distributions share one.</p>"
      },
      {
        h: "Using the MGF to find distributions of sums",
        body:
          "<p>Example 3.34: let $X_1 \\sim \\text{Binomial}(n_1, p)$ and $X_2 \\sim \\text{Binomial}(n_2, p)$ be independent, and $Y = X_1 + X_2$. By the product property,</p>" +
          "<p>$\\psi_Y(t) = (p e^t + q)^{n_1} (p e^t + q)^{n_2} = (p e^t + q)^{n_1 + n_2}$,</p>" +
          "<p>which is the MGF of a $\\text{Binomial}(n_1 + n_2, p)$. By uniqueness, $Y \\sim \\text{Binomial}(n_1 + n_2, p)$.</p>" +
          "<p>Example 3.35 does the same for Poissons: if $Y_1 \\sim \\text{Poisson}(\\lambda_1)$ and $Y_2 \\sim \\text{Poisson}(\\lambda_2)$ are independent, the MGF of $Y_1 + Y_2$ multiplies to $e^{(\\lambda_1 + \\lambda_2)(e^t - 1)}$, the MGF of a $\\text{Poisson}(\\lambda_1 + \\lambda_2)$ — so the sum of independent Poissons is Poisson.</p>" +
          "<p>The chapter's MGF table for common distributions:</p>" +
          "<table class=\"extable\">" +
          "<thead><tr><th>Distribution</th><th>MGF $\\psi(t)$</th></tr></thead>" +
          "<tbody>" +
          "<tr><td class=\"row-h\">Bernoulli$(p)$</td><td class=\"num\">$p e^t + (1-p)$</td></tr>" +
          "<tr><td class=\"row-h\">Binomial$(n,p)$</td><td class=\"num\">$(p e^t + (1-p))^n$</td></tr>" +
          "<tr><td class=\"row-h\">Poisson$(\\lambda)$</td><td class=\"num\">$e^{\\lambda(e^t - 1)}$</td></tr>" +
          "<tr><td class=\"row-h\">Normal$(\\mu,\\sigma)$</td><td class=\"num\">$\\exp\\{\\mu t + \\sigma^2 t^2 / 2\\}$</td></tr>" +
          "<tr><td class=\"row-h\">Gamma$(\\alpha,\\beta)$</td><td class=\"num\">$(1/(1-\\beta t))^\\alpha$ for $t \\lt 1/\\beta$</td></tr>" +
          "</tbody></table>"
      }
    ],
    takeaways: [
      "$\\psi_X(t)=\\mathbb{E}(e^{tX})$; the $k$th derivative at $0$ gives the $k$th moment.",
      "Exp(1): $\\psi(t)=1/(1-t)$, giving mean $1$ and variance $1$.",
      "MGF of a sum of independents = product of MGFs.",
      "Uniqueness (Theorem 3.33): matching MGFs imply equal distributions — used to show sums of Binomials/Poissons stay in-family."
    ]
  });
})();
