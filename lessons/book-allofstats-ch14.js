/* All of Statistics (Larry Wasserman) — Chapter 14: Multivariate Models.
   Self-registering book-template lessons, one per key concept. */
(function () {
  window.LESSONS = window.LESSONS || [];
  window.CODEVIZ = window.CODEVIZ || {};
  const M = "All of Statistics";
  const B = (o) => window.LESSONS.push(Object.assign({ module: M, template: "book", book: "All of Statistics" }, o));

  // 1 — Random vectors, mean & covariance matrix, estimating the correlation
  B({
    id: "aos-ch14-random-vectors-correlation",
    chapter: "Chapter 14",
    title: "Random Vectors and Estimating the Correlation",
    tagline: "Stack several random quantities into one vector, summarize it with a mean vector and a covariance matrix, then estimate those summaries and the correlation from a sample.",
    sections: [
      { h: "What a random vector is", body:
        "<p>A multivariate model studies several random quantities at once, packed into a single column called a <strong>random vector</strong> $X = (X_1,\\dots,X_k)^T$ — a list of $k$ random numbers stacked vertically. The chapter first reviews a little linear-algebra notation: $x^T y = \\sum_j x_j y_j$ is the inner product (multiply matching entries and add), $|A|$ is the determinant, $A^T$ the transpose, $A^{-1}$ the inverse, $I$ the identity matrix, $\\text{tr}(A)$ the trace (the sum of the diagonal entries of a square matrix), and $A^{1/2}$ a square-root matrix.</p>" +
        "<p>The trace has the handy property $\\text{tr}(AB) = \\text{tr}(BA)$, and $\\text{tr}(a)=a$ when $a$ is a single number. A matrix is <strong>positive definite</strong> if $x^T \\Sigma x \\gt 0$ for every nonzero vector $x$. If a matrix $A$ is symmetric and positive definite, its square root $A^{1/2}$ exists, is symmetric, satisfies $A = A^{1/2}A^{1/2}$, and $A^{1/2}A^{-1/2} = A^{-1/2}A^{1/2} = I$ with $A^{-1/2} = (A^{1/2})^{-1}$.</p>" },
      { h: "Mean vector and covariance matrix", body:
        "<p>The <strong>mean</strong> of a random vector simply collects the means of its entries (Eq. 14.1): $\\mu = (\\mu_1,\\dots,\\mu_k)^T = (E(X_1),\\dots,E(X_k))^T$. The spread and the pairwise links are stored in the <strong>covariance matrix</strong> $\\Sigma$, also written $\\mathbb{V}(X)$ (Eq. 14.2). Its diagonal holds the variances $\\mathbb{V}(X_i)$, and the off-diagonal entry in row $i$, column $j$ is the covariance $\\text{Cov}(X_i,X_j)$ between the $i$-th and $j$-th entries.</p>" +
        "<p>$\\Sigma$ is also called the variance matrix or the variance-covariance matrix. Its inverse $\\Sigma^{-1}$ has its own name: the <strong>precision matrix</strong>.</p>" +
        "<p><strong>Theorem 14.1.</strong> Linear combinations transform the mean and variance in clean ways. If $a$ is a fixed vector of length $k$ and $X$ has mean $\\mu$ and variance $\\Sigma$, then the scalar $a^T X$ has $\\mathbb{E}(a^T X) = a^T \\mu$ and $\\mathbb{V}(a^T X) = a^T \\Sigma a$. If $A$ is a matrix with $k$ columns, then $\\mathbb{E}(AX) = A\\mu$ and $\\mathbb{V}(AX) = A \\Sigma A^T$.</p>" },
      { h: "Estimating the mean vector and variance matrix", body:
        "<p>Now take a random sample of $n$ vectors (Eq. 14.3), each of length $k$. The <strong>sample mean</strong> $\\overline{X}$ is the vector whose $i$-th entry is the ordinary average of that coordinate, $\\overline{X}_i = n^{-1}\\sum_{j=1}^n X_{ij}$. The <strong>sample variance matrix</strong> $S$ (Eq. 14.4) estimates $\\Sigma$: its $(a,b)$ entry is</p>" +
        "<p>$s_{ab} = \\dfrac{1}{n-1}\\sum_{j=1}^n (X_{aj}-\\overline{X}_a)(X_{bj}-\\overline{X}_b).$</p>" +
        "<p>These estimators are unbiased: $\\mathbb{E}(\\overline{X}) = \\mu$ and $\\mathbb{E}(S) = \\Sigma$.</p>" },
      { h: "The correlation between two coordinates", body:
        "<p>For a bivariate sample ($k=2$), recall the population <strong>correlation</strong> between $X_1$ and $X_2$ (Eq. 14.5):</p>" +
        "<p>$\\rho = \\dfrac{\\mathbb{E}((X_1-\\mu_1)(X_2-\\mu_2))}{\\sigma_1 \\sigma_2},$</p>" +
        "<p>where $\\sigma_j^2 = \\mathbb{V}(X_{ji})$. The nonparametric plug-in estimator is the <strong>sample correlation</strong> (Eq. 14.6):</p>" +
        "<p>$\\hat{\\rho} = \\dfrac{\\sum_{i=1}^n (X_{1i}-\\overline{X}_1)(X_{2i}-\\overline{X}_2)}{s_1 s_2},$</p>" +
        "<p>with $s_j^2 = \\frac{1}{n-1}\\sum_{i=1}^n (X_{ji}-\\overline{X}_j)^2$. (The strict plug-in estimator uses $n$ rather than $n-1$ in $s_j$, but the difference is tiny.)</p>" },
      { h: "Confidence interval via Fisher's transformation", body:
        "<p>One could build a confidence interval for $\\rho$ with the delta method, but a more accurate interval comes from first transforming to $\\theta = f(\\rho)$, building an interval there, and transforming back. The method is due to Fisher. Define</p>" +
        "<p>$f(r) = \\tfrac{1}{2}\\big(\\log(1+r) - \\log(1-r)\\big), \\qquad f^{-1}(z) = \\dfrac{e^{2z}-1}{e^{2z}+1}.$</p>" +
        "<ul class=\"steps\">" +
        "<li>Compute $\\hat{\\theta} = f(\\hat{\\rho}) = \\tfrac{1}{2}\\big(\\log(1+\\hat{\\rho}) - \\log(1-\\hat{\\rho})\\big)$.</li>" +
        "<li>The approximate standard error of $\\hat{\\theta}$ is $\\widehat{\\text{se}}(\\hat{\\theta}) = 1/\\sqrt{n-3}$.</li>" +
        "<li>An approximate $1-\\alpha$ interval for $\\theta$ is $(a,b) = \\big(\\hat{\\theta} - z_{\\alpha/2}/\\sqrt{n-3},\\; \\hat{\\theta} + z_{\\alpha/2}/\\sqrt{n-3}\\big)$.</li>" +
        "<li>Map the endpoints back with $f^{-1}$ to get the interval for $\\rho$: $\\big((e^{2a}-1)/(e^{2a}+1),\\; (e^{2b}-1)/(e^{2b}+1)\\big)$.</li>" +
        "</ul>" +
        "<p>Yet another route to an interval for $\\rho$ is the bootstrap.</p>" }
    ],
    takeaways: [
      "A random vector stacks k random numbers; its summaries are the mean vector and the covariance (variance) matrix, whose inverse is the precision matrix.",
      "Theorem 14.1: E(a^T X)=a^T mu, V(a^T X)=a^T Sigma a, E(AX)=A mu, V(AX)=A Sigma A^T.",
      "The sample mean and sample variance matrix S (with 1/(n-1)) are unbiased estimators of mu and Sigma.",
      "Estimate correlation by the sample correlation, and build a CI with Fisher's f, its inverse, and se = 1/sqrt(n-3)."
    ]
  });

  // 2 — The multivariate Normal distribution
  B({
    id: "aos-ch14-multivariate-normal",
    chapter: "Chapter 14",
    title: "The Multivariate Normal",
    tagline: "Generalize the bell curve to a vector: one density built from the mean vector and covariance matrix, with the same clean behavior under linear maps.",
    sections: [
      { h: "The density", body:
        "<p>A vector $X$ has a <strong>multivariate Normal</strong> distribution, written $X \\sim N(\\mu,\\Sigma)$, when its density is (Eq. 14.7)</p>" +
        "<p>$f(x;\\mu,\\Sigma) = \\dfrac{1}{(2\\pi)^{k/2}|\\Sigma|^{1/2}} \\exp\\Big\\{ -\\tfrac{1}{2}(x-\\mu)^T \\Sigma^{-1}(x-\\mu) \\Big\\}.$</p>" +
        "<p>Here $\\mu$ is a vector of length $k$ and $\\Sigma$ is a $k \\times k$ symmetric, positive-definite matrix. With this density, $\\mathbb{E}(X) = \\mu$ and $\\mathbb{V}(X) = \\Sigma$ — so the two summaries from the previous lesson are exactly the parameters of the distribution. The quadratic form $(x-\\mu)^T \\Sigma^{-1}(x-\\mu)$ in the exponent uses the precision matrix $\\Sigma^{-1}$ to measure squared distance from the mean.</p>" },
      { h: "How the multivariate Normal behaves", body:
        "<p><strong>Theorem 14.2</strong> gathers four properties:</p>" +
        "<ul class=\"steps\">" +
        "<li>Build it from standard normals: if $Z \\sim N(0,1)$ (a standard normal vector) and $X = \\mu + \\Sigma^{1/2}Z$, then $X \\sim N(\\mu,\\Sigma)$.</li>" +
        "<li>Standardize it: if $X \\sim N(\\mu,\\Sigma)$, then $\\Sigma^{-1/2}(X-\\mu) \\sim N(0,1)$ — subtracting the mean and multiplying by the inverse square root returns a standard normal vector.</li>" +
        "<li>Linear maps stay Normal: if $X \\sim N(\\mu,\\Sigma)$ and $a$ is a vector of the same length, then the scalar $a^T X \\sim N(a^T \\mu,\\; a^T \\Sigma a)$.</li>" +
        "<li>The quadratic form is chi-square: let $V = (X-\\mu)^T \\Sigma^{-1}(X-\\mu)$. Then $V \\sim \\chi^2_k$ — a chi-square distribution with $k$ degrees of freedom.</li>" +
        "</ul>" },
      { h: "Likelihood and the MLE", body:
        "<p><strong>Theorem 14.3.</strong> Given a random sample of size $n$ from a $N(\\mu,\\Sigma)$, the log-likelihood (dropping a constant that does not involve $\\mu$ or $\\Sigma$) is</p>" +
        "<p>$\\ell(\\mu,\\Sigma) = -\\dfrac{n}{2}(\\overline{X}-\\mu)^T \\Sigma^{-1}(\\overline{X}-\\mu) - \\dfrac{n}{2}\\text{tr}(\\Sigma^{-1}S) - \\dfrac{n}{2}\\log|\\Sigma|.$</p>" +
        "<p>Maximizing it gives the maximum likelihood estimators (Eq. 14.8): $\\hat{\\mu} = \\overline{X}$ and $\\hat{\\Sigma} = \\big(\\frac{n-1}{n}\\big) S$. The MLE of the mean is just the sample mean; the MLE of the covariance is the sample variance matrix $S$ scaled by $(n-1)/n$.</p>" +
        "<p>The appendix proof rewrites $\\sum_{i=1}^n (X^i-\\mu)^T \\Sigma^{-1}(X^i-\\mu)$ by adding and subtracting $\\overline{X}$ — the cross term vanishes because $\\sum_{i=1}^n (X^i-\\overline{X}) = 0$ — leaving a term in $(\\overline{X}-\\mu)$ plus a term that, using $\\text{tr}(AB)=\\text{tr}(BA)$ and the scalar-trace trick, collapses to $n\\,\\text{tr}(\\Sigma^{-1}S)$.</p>" }
    ],
    takeaways: [
      "The multivariate Normal density (Eq. 14.7) is parameterized by the mean vector mu and the symmetric positive-definite covariance Sigma, and E(X)=mu, V(X)=Sigma.",
      "Theorem 14.2: it is built as mu + Sigma^{1/2}Z, standardized by Sigma^{-1/2}, stays Normal under linear maps, and its quadratic form is chi-square_k.",
      "The log-likelihood collapses to terms in (Xbar - mu), tr(Sigma^{-1}S), and log|Sigma|.",
      "The MLEs are mu-hat = Xbar and Sigma-hat = ((n-1)/n) S."
    ]
  });

  // 3 — The Multinomial distribution and its inference
  B({
    id: "aos-ch14-multinomial",
    chapter: "Chapter 14",
    title: "The Multinomial Distribution",
    tagline: "Count how many balls of each color you draw, and the counts follow the Multinomial — with binomial margins, a negative-covariance variance matrix, and a simple MLE.",
    sections: [
      { h: "The model", body:
        "<p>The data are counts: $X = (X_1,\\dots,X_k)$, where each $X_j$ counts something. The picture is an urn with balls in $k$ colors; draw $n$ balls with replacement, and let $X_j$ be the number of balls of color $j$. Write the color probabilities as $p = (p_1,\\dots,p_k)$ with $p_j \\ge 0$ and $\\sum_{j=1}^k p_j = 1$, where $p_j$ is the chance of drawing a ball of color $j$ on a single draw. Then $X \\sim \\text{Multinomial}(n,p)$.</p>" },
      { h: "Marginals, mean, and variance", body:
        "<p><strong>Theorem 14.4.</strong> If $X \\sim \\text{Multinomial}(n,p)$, each single count is binomial: $X_j \\sim \\text{Binomial}(n,p_j)$. So the mean vector is $\\mathbb{E}(X) = (np_1,\\dots,np_k)^T$. The variance matrix has the diagonal entries $\\mathbb{V}(X_j) = np_j(1-p_j)$ and the off-diagonal entries $\\text{Cov}(X_i,X_j) = -np_i p_j$ — note the minus sign: drawing more of one color must mean drawing fewer of another, so the counts are negatively correlated.</p>" +
        "<p>The covariance is derived cleverly. Since $X_i + X_j \\sim \\text{Binomial}(n,p_i+p_j)$, its variance is $n(p_i+p_j)(1-p_i-p_j)$. But also $\\mathbb{V}(X_i+X_j) = \\mathbb{V}(X_i) + \\mathbb{V}(X_j) + 2\\text{Cov}(X_i,X_j)$. Setting the two equal and solving gives $\\text{Cov}(X_i,X_j) = -np_i p_j$.</p>" },
      { h: "The MLE of p", body:
        "<p><strong>Theorem 14.5.</strong> The maximum likelihood estimator of $p$ is the vector of observed fractions: $\\hat{p} = (X_1/n,\\dots,X_k/n)^T = X/n$.</p>" +
        "<p>The proof maximizes the log-likelihood $\\ell(p) = \\sum_{j=1}^k X_j \\log p_j$ subject to $\\sum_j p_j = 1$. Using a Lagrange multiplier, maximize $A(p) = \\sum_{j=1}^k X_j \\log p_j + \\lambda(\\sum_j p_j - 1)$. Then $\\partial A/\\partial p_j = X_j/p_j + \\lambda$; setting it to zero gives $\\hat{p}_j = -X_j/\\lambda$. The constraint $\\sum_j \\hat{p}_j = 1$ forces $\\lambda = -n$, so $\\hat{p}_j = X_j/n$.</p>" },
      { h: "Variability of the MLE", body:
        "<p>The variability of $\\hat{p}$ can be found directly (the Fisher-information route gives the same answer): $\\mathbb{V}(\\hat{p}) = \\mathbb{V}(X/n) = n^{-2}\\mathbb{V}(X)$, which works out to</p>" +
        "<p>$\\mathbb{V}(\\hat{p}) = \\dfrac{1}{n}\\Sigma,$</p>" +
        "<p>where $\\Sigma$ has diagonal entries $p_j(1-p_j)$ and off-diagonal entries $-p_i p_j$. For large $n$, $\\hat{p}$ is approximately multivariate Normal — formally (<strong>Theorem 14.6</strong>) $\\sqrt{n}(\\hat{p}-p) \\rightsquigarrow N(0,\\Sigma)$ as $n \\to \\infty$.</p>" },
      { h: "Worked variance matrix — three colors", body:
        "<p>To see the structure concretely, take $k=3$ with $p = (0.5,\\,0.3,\\,0.2)$. The covariance matrix of a single count vector $\\Sigma$ (so that $\\mathbb{V}(\\hat{p}) = \\Sigma/n$) has entries $\\Sigma_{jj} = p_j(1-p_j)$ on the diagonal and $\\Sigma_{ij} = -p_i p_j$ off the diagonal:</p>" +
        "<table class=\"extable\">" +
        "<thead><tr><th></th><th>color 1</th><th>color 2</th><th>color 3</th></tr></thead>" +
        "<tbody>" +
        "<tr><td class=\"row-h\">color 1</td><td class=\"num\">0.25</td><td class=\"num\">-0.15</td><td class=\"num\">-0.10</td></tr>" +
        "<tr><td class=\"row-h\">color 2</td><td class=\"num\">-0.15</td><td class=\"num\">0.21</td><td class=\"num\">-0.06</td></tr>" +
        "<tr><td class=\"row-h\">color 3</td><td class=\"num\">-0.10</td><td class=\"num\">-0.06</td><td class=\"num\">0.16</td></tr>" +
        "</tbody></table>" +
        "<p>Diagonal: $0.5\\cdot0.5=0.25$, $0.3\\cdot0.7=0.21$, $0.2\\cdot0.8=0.16$. Off-diagonal: $-0.5\\cdot0.3=-0.15$, $-0.5\\cdot0.2=-0.10$, $-0.3\\cdot0.2=-0.06$. Every off-diagonal entry is negative, matching the rule $\\text{Cov}(X_i,X_j) = -np_i p_j$. (These illustrative numbers use the book's formulas; the chapter itself gives no numeric table.)</p>" }
    ],
    takeaways: [
      "Multinomial(n,p) counts draws of k colors; each marginal count X_j is Binomial(n, p_j).",
      "Mean is np_j; the variance matrix has np_j(1-p_j) on the diagonal and -n p_i p_j off it (counts are negatively correlated).",
      "The MLE of p is the observed fractions p-hat = X/n, found via a Lagrange multiplier.",
      "V(p-hat) = Sigma/n, and for large n sqrt(n)(p-hat - p) converges to N(0, Sigma)."
    ]
  });
})();
