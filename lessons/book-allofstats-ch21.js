/* All of Statistics (Larry Wasserman) — Chapter 21: Smoothing Using Orthogonal Functions.
   Self-registering book-template lessons, one per key concept. */
(function () {
  window.LESSONS = window.LESSONS || [];
  window.CODEVIZ = window.CODEVIZ || {};
  const M = "All of Statistics";
  const B = (o) => window.LESSONS.push(Object.assign({ module: M, template: "book", book: "All of Statistics" }, o));

  // 1 — Orthogonal functions and L^2 spaces
  B({
    id: "aos-ch21-orthogonal-functions-l2",
    chapter: "Chapter 21",
    title: "Orthogonal Functions and L2 Spaces",
    tagline: "Treat functions like vectors: an orthonormal basis lets you write any function as a sum of coefficients, and Parseval ties its size to those coefficients.",
    sections: [
      { h: "From vectors to functions", body:
        "<p>The chapter builds curve estimation on the idea of an orthonormal basis, and it starts in familiar territory: ordinary vectors. Write a three-dimensional vector as $v = (v_1,v_2,v_3)$, a list of three real numbers. The <strong>inner product</strong> of two vectors is $\\langle v,w \\rangle = \\sum_{i=1}^3 v_i w_i$ — multiply matching entries and add them up. The <strong>norm</strong> (length) of $v$ is $||v|| = \\sqrt{\\langle v,v \\rangle} = \\sqrt{\\sum_{i=1}^3 v_i^2}$.</p>" +
        "<p>Two vectors are <strong>orthogonal</strong> (perpendicular) when $\\langle v,w \\rangle = 0$. A vector is <strong>normal</strong> when its length is $1$, i.e. $||v|| = 1$.</p>" },
      { h: "Orthonormal basis", body:
        "<p>The standard vectors $\\phi_1=(1,0,0)$, $\\phi_2=(0,1,0)$, $\\phi_3=(0,0,1)$ form an <strong>orthonormal basis</strong>: they are (i) orthogonal to each other, (ii) each of length $1$, and (iii) a basis, meaning every vector $v$ can be written as a combination $v = \\sum_{j=1}^3 \\beta_j \\phi_j$, where the coefficient $\\beta_j = \\langle \\phi_j,v \\rangle$ is the inner product of $v$ with the $j$-th basis vector.</p>" +
        "<p>The book's example: for $v = (12,3,4)$ this basis gives $v = 12\\phi_1 + 3\\phi_2 + 4\\phi_3$ — the coefficients are just the entries. A basis is not unique. A second orthonormal basis is $\\psi_1 = (1/\\sqrt{3}, 1/\\sqrt{3}, 1/\\sqrt{3})$, $\\psi_2 = (1/\\sqrt{2}, -1/\\sqrt{2}, 0)$, $\\psi_3 = (1/\\sqrt{6}, 1/\\sqrt{6}, -2/\\sqrt{6})$. In this rotated basis the same vector becomes $v = 10.97\\psi_1 + 6.36\\psi_2 + 2.86\\psi_3$.</p>" +
        "<ul class=\"steps\">" +
        "<li>$\\beta_1 = \\langle \\psi_1,v \\rangle = (12+3+4)/\\sqrt{3} = 19/\\sqrt{3} \\approx 10.97$.</li>" +
        "<li>$\\beta_2 = \\langle \\psi_2,v \\rangle = (12-3)/\\sqrt{2} = 9/\\sqrt{2} \\approx 6.36$.</li>" +
        "<li>$\\beta_3 = \\langle \\psi_3,v \\rangle = (12+3-8)/\\sqrt{6} = 7/\\sqrt{6} \\approx 2.86$.</li>" +
        "</ul>" },
      { h: "The leap to functions: L2 spaces", body:
        "<p>Now replace vectors with functions and sums with integrals. The space $L_2(a,b)$ is the set of functions on the interval $[a,b]$ that are square-integrable, $\\int_a^b f(x)^2\\,dx \\lt \\infty$. The inner product of two functions $f,g$ is $\\int f(x)g(x)\\,dx$, and the norm is $||f|| = \\sqrt{\\int f(x)^2\\,dx}$. By analogy, two functions are orthogonal when $\\int f(x)g(x)\\,dx = 0$, and a function is normal when $||f||=1$.</p>" +
        "<p>A sequence $\\phi_1,\\phi_2,\\dots$ is <strong>orthonormal</strong> when $\\int \\phi_j^2(x)\\,dx = 1$ for each $j$ and $\\int \\phi_i(x)\\phi_j(x)\\,dx = 0$ for $i \\ne j$. The sequence is <strong>complete</strong> when the only function orthogonal to every $\\phi_j$ is the zero function — i.e. nothing is left over.</p>" },
      { h: "Fourier coefficients and Parseval", body:
        "<p>For a complete orthonormal basis, every $f \\in L_2$ can be expanded as $f(x) = \\sum_{j=1}^{\\infty} \\beta_j \\phi_j(x)$, where the coefficients $\\beta_j = \\int_a^b f(x)\\phi_j(x)\\,dx$ are found exactly as in the vector case — by taking the inner product of $f$ with each basis function. The equality means $\\int (f(x) - f_n(x))^2\\,dx \\to 0$ for the partial sums $f_n = \\sum_{j=1}^n \\beta_j \\phi_j$.</p>" +
        "<p><strong>Parseval's relation</strong> says the squared norm of the function equals the sum of squared coefficients:</p>" +
        "<p>$||f||^2 \\equiv \\int f^2(x)\\,dx = \\sum_{j=1}^{\\infty} \\beta_j^2 \\equiv ||\\beta||^2,$</p>" +
        "<p>where $\\beta = (\\beta_1,\\beta_2,\\dots)$. The size of a function in function-space equals the size of its coefficient vector — exactly the analogue of length being preserved under a change of orthonormal basis.</p>" },
      { h: "Three example bases", body:
        "<p>The chapter gives three concrete orthonormal bases on real intervals:</p>" +
        "<ul class=\"steps\">" +
        "<li><strong>Cosine basis</strong> for $L_2(0,1)$: $\\phi_0(x)=1$ and for $j \\ge 1$, $\\phi_j(x) = \\sqrt{2}\\cos(j\\pi x)$. The first six functions are plotted in Figure 21.1. This is the default basis for the rest of the chapter.</li>" +
        "<li><strong>Legendre polynomials</strong> on $[-1,1]$: $P_j(x) = \\frac{1}{2^j j!}\\frac{d^j}{dx^j}(x^2-1)^j$. They are complete and orthogonal with $\\int_{-1}^1 P_j^2(x)\\,dx = 2/(2j+1)$, so $\\phi_j(x) = \\sqrt{(2j+1)/2}\\,P_j(x)$ is the orthonormal version. First few: $P_0=1$, $P_1=x$, $P_2=\\frac{1}{2}(3x^2-1)$, $P_3=\\frac{1}{2}(5x^3-3x)$, with recursion $P_{j+1}(x) = \\frac{(2j+1)xP_j(x) - jP_{j-1}(x)}{j+1}$.</li>" +
        "<li>A smoothness link: for the cosine basis, $\\int_0^1 (f^{(k)}(x))^2\\,dx = 2\\sum_{j=1}^{\\infty} \\beta_j^2(\\pi j)^{2k}$. This sum is finite only if the $\\beta_j$ shrink as $j$ grows — so <em>if $f$ is smooth, its coefficients $\\beta_j$ are small for large $j$</em>.</li>" +
        "</ul>" +
        "<p><strong>Example 21.2 (doppler function).</strong> The function $f(x) = \\sqrt{x(1-x)}\\sin(2.1\\pi/(x+0.05))$ can be approximated by the partial sum $f_J(x) = \\sum_{j=1}^J \\beta_j \\phi_j(x)$ in the cosine basis. Figure 21.2 shows that as $J$ grows from $5$ to $20$ to $200$, the approximation $f_J$ gets steadily closer to $f$.</p>" }
    ],
    takeaways: [
      "Functions in L2 behave like vectors: there is an inner product, a norm, orthogonality, and orthonormal bases.",
      "A complete orthonormal basis expands any f as a sum of coefficients beta_j = integral of f times phi_j.",
      "Parseval's relation: the function's squared norm equals the sum of squared coefficients.",
      "Smooth functions have rapidly shrinking coefficients; the cosine basis is the chapter's default."
    ]
  });

  // 2 — Density estimation using orthogonal functions
  B({
    id: "aos-ch21-density-estimation",
    chapter: "Chapter 21",
    title: "Density Estimation Using Orthogonal Bases",
    tagline: "Estimate each Fourier coefficient by a sample average, keep the first J terms, and pick J by minimizing an estimate of the risk.",
    sections: [
      { h: "The estimator", body:
        "<p>Let $X_1,\\dots,X_n$ be IID observations from a density $f$ on $[0,1]$, and assume $f \\in L_2$ so we can write $f(x) = \\sum_{j=0}^{\\infty} \\beta_j \\phi_j(x)$ in an orthonormal basis. Each coefficient is an expectation, $\\beta_j = \\int \\phi_j(x)f(x)\\,dx = \\mathbb{E}(\\phi_j(X))$, so the natural estimate is the sample average</p>" +
        "<p>$\\hat{\\beta}_j = \\dfrac{1}{n}\\sum_{i=1}^n \\phi_j(X_i).$</p>" +
        "<p><strong>Theorem 21.4.</strong> $\\hat{\\beta}_j$ is unbiased with $\\mathbb{E}(\\hat{\\beta}_j)=\\beta_j$ and variance $\\mathbb{V}(\\hat{\\beta}_j) = \\sigma_j^2/n$, where $\\sigma_j^2 = \\mathbb{V}(\\phi_j(X_i)) = \\int(\\phi_j(x)-\\beta_j)^2 f(x)\\,dx$. The mean follows because the average of $\\phi_j(X_i)$ has expectation $\\mathbb{E}(\\phi_j(X_1)) = \\int \\phi_j(x)f(x)\\,dx = \\beta_j$.</p>" },
      { h: "Truncate, don't use them all", body:
        "<p>Although $\\hat{\\beta}_j$ is unbiased, the infinite sum $\\sum_j \\hat{\\beta}_j \\phi_j$ has very high variance. Instead, truncate to the first $J$ terms:</p>" +
        "<p>$\\hat{f}(x) = \\sum_{j=1}^J \\hat{\\beta}_j \\phi_j(x).$</p>" +
        "<p>The number of terms $J$ is the <strong>smoothing parameter</strong>: increasing $J$ lowers bias but raises variance. For technical reasons $J$ is restricted to $1 \\le J \\le p$ with $p = p(n) = \\sqrt{n}$. The risk is written $R(J)$ to stress the dependence on $J$.</p>" },
      { h: "Risk and its estimate", body:
        "<p><strong>Theorem 21.5.</strong> The risk of $\\hat{f}$ splits into a variance part over the kept terms and a squared-bias part over the dropped terms:</p>" +
        "<p>$R(J) = \\sum_{j=1}^J \\dfrac{\\sigma_j^2}{n} + \\sum_{j=J+1}^{\\infty} \\beta_j^2.$</p>" +
        "<p>Since $R(J)$ depends on unknown quantities, we estimate it. With $\\hat{\\sigma}_j^2 = \\frac{1}{n-1}\\sum_{i=1}^n(\\phi_j(X_i)-\\hat{\\beta}_j)^2$ an unbiased estimate of $\\sigma_j^2$, and $\\hat{\\beta}_j^2 - \\hat{\\sigma}_j^2/n$ an unbiased estimate of $\\beta_j^2$ (taking the positive part since $\\beta_j^2 \\ge 0$),</p>" +
        "<p>$\\hat{R}(J) = \\sum_{j=1}^J \\dfrac{\\hat{\\sigma}_j^2}{n} + \\sum_{j=J+1}^p \\left(\\hat{\\beta}_j^2 - \\dfrac{\\hat{\\sigma}_j^2}{n}\\right)_{+},$</p>" +
        "<p>where $a_{+} = \\max\\{a,0\\}$. Choose $\\hat{J}$ between $1$ and $p$ to minimize $\\hat{R}(J)$.</p>" },
      { h: "The complete recipe", body:
        "<p>The book summarizes the method in three steps:</p>" +
        "<ul class=\"steps\">" +
        "<li><strong>Step 1.</strong> Compute the coefficient estimates $\\hat{\\beta}_j = \\frac{1}{n}\\sum_{i=1}^n \\phi_j(X_i)$.</li>" +
        "<li><strong>Step 2.</strong> Choose $\\hat{J}$ to minimize $\\hat{R}(J)$ over $1 \\le J \\le p = \\sqrt{n}$.</li>" +
        "<li><strong>Step 3.</strong> Set $\\hat{f}(x) = \\sum_{j=1}^{\\hat{J}} \\hat{\\beta}_j \\phi_j(x)$.</li>" +
        "</ul>" +
        "<p>The estimate $\\hat{f}_n$ can come out negative, which is fine for exploring shape. To force a genuine probability density, truncate at zero and renormalize: $\\hat{f}^{*} = \\max\\{\\hat{f}_n(x),0\\} / \\int_0^1 \\max\\{\\hat{f}_n(u),0\\}\\,du$.</p>" },
      { h: "Confidence band and the Bart Simpson example", body:
        "<p>A confidence band is built for the smoothed target $f_J = \\sum_{j=1}^J \\beta_j \\phi_j$, not the true $f$. <strong>Theorem 21.6.</strong> An approximate $1-\\alpha$ band is $\\ell(x) = \\hat{f}_n(x) - c$ and $u(x) = \\hat{f}_n(x) + c$, with $c = K^2\\sqrt{J\\chi^2_{J,\\alpha}/n}$ and $K = \\max_{1 \\le j \\le J}\\max_x |\\phi_j(x)|$. For the cosine basis $K = \\sqrt{2}$.</p>" +
        "<p><strong>Example 21.7.</strong> The 'Bart Simpson' (or 'the claw') density is $f(x) = \\frac{5}{6}\\phi(x;0,1) + \\frac{1}{6}\\sum_{j=1}^5 \\phi(x;\\mu_j,0.1)$, where $\\phi(x;\\mu,\\sigma)$ is a Normal density and $(\\mu_1,\\dots,\\mu_5) = (-1,-1/2,0,1/2,1)$. Figure 21.3 shows the true density and the estimate from $n=5{,}000$ observations with a $95\\%$ band, after rescaling onto $[0,1]$ via $y = (x+3)/6$.</p>" }
    ],
    takeaways: [
      "Estimate each coefficient by a sample average: beta-hat_j = mean of phi_j(X_i), which is unbiased.",
      "Keep only the first J terms; J is the smoothing parameter trading bias against variance.",
      "Risk R(J) = (variance of kept terms) + (squared bias of dropped terms); pick J to minimize an estimate of it.",
      "Confidence bands target the smoothed f_J, not the true f; the cosine basis uses K = sqrt(2)."
    ]
  });
  window.CODEVIZ["aos-ch21-density-estimation"] = { charts: [ {
    type: "line",
    title: "Bart Simpson density (Example 21.7) — true f on [0,1]",
    interpret: "The 'claw': a broad bump plus five sharp spikes at the rescaled centers of (-1,-0.5,0,0.5,1). The five narrow peaks are what makes it hard to estimate.",
    xlabel: "x (rescaled to [0,1])", ylabel: "density",
    series: [
      { name: "f(x)", color: "#4ea1ff", points: [[0,0.2],[0.1,0.4],[0.2,0.7],[0.3,1.6],[0.333,3.6],[0.367,1.3],[0.417,3.6],[0.45,1.3],[0.5,3.6],[0.55,1.3],[0.583,3.6],[0.633,1.3],[0.667,3.6],[0.7,1.6],[0.8,0.7],[0.9,0.4],[1,0.2]] }
    ]
  } ] };

  // 3 — Regression using orthogonal functions
  B({
    id: "aos-ch21-regression",
    chapter: "Chapter 21",
    title: "Regression Using Orthogonal Functions",
    tagline: "Expand the regression function in a basis, estimate each coefficient as an average of the responses, and again pick how many terms to keep by minimizing estimated risk.",
    sections: [
      { h: "The model and coefficients", body:
        "<p>Consider the regression model $Y_i = r(x_i) + \\epsilon_i$ for $i=1,\\dots,n$, where the errors $\\epsilon_i$ are independent with mean $0$ and variance $\\sigma^2$. Focus first on equally spaced inputs $x_i = i/n$. Assuming $r \\in L_2(0,1)$, expand $r(x) = \\sum_{j=1}^{\\infty} \\beta_j \\phi_j(x)$ with $\\beta_j = \\int_0^1 r(x)\\phi_j(x)\\,dx$ in an orthonormal basis for $[0,1]$.</p>" +
        "<p>Estimate each coefficient as an average of the responses weighted by the basis function:</p>" +
        "<p>$\\hat{\\beta}_j = \\dfrac{1}{n}\\sum_{i=1}^n Y_i\\,\\phi_j(x_i), \\quad j = 1,2,\\dots$</p>" },
      { h: "Why it works", body:
        "<p>Since $\\hat{\\beta}_j$ is an average, the central limit theorem makes it approximately Normal. <strong>Theorem 21.8:</strong> $\\hat{\\beta}_j \\approx N(\\beta_j, \\sigma^2/n)$.</p>" +
        "<ul class=\"steps\">" +
        "<li>Mean: $\\mathbb{E}(\\hat{\\beta}_j) = \\frac{1}{n}\\sum_i \\mathbb{E}(Y_i)\\phi_j(x_i) = \\frac{1}{n}\\sum_i r(x_i)\\phi_j(x_i) \\approx \\int r(x)\\phi_j(x)\\,dx = \\beta_j$, using the Riemann-sum approximation $\\sum_i \\Delta_n h(x_i) \\to \\int_0^1 h(x)\\,dx$ with $\\Delta_n = 1/n$.</li>" +
        "<li>Variance: $\\mathbb{V}(\\hat{\\beta}_j) = \\frac{1}{n^2}\\sum_i \\sigma^2 \\phi_j^2(x_i) = \\frac{\\sigma^2}{n}\\cdot\\frac{1}{n}\\sum_i \\phi_j^2(x_i) \\approx \\frac{\\sigma^2}{n}\\int \\phi_j^2(x)\\,dx = \\frac{\\sigma^2}{n}$, since $\\int \\phi_j^2(x)\\,dx = 1$.</li>" +
        "</ul>" },
      { h: "Estimating the noise and the risk", body:
        "<p>The fitted curve is $\\hat{r}(x) = \\sum_{j=1}^J \\hat{\\beta}_j \\phi_j(x)$ with risk $R(J) = \\mathbb{E}\\int (r(x)-\\hat{r}(x))^2\\,dx$. <strong>Theorem 21.9:</strong> $R(J) = \\frac{J\\sigma^2}{n} + \\sum_{j=J+1}^{\\infty}\\beta_j^2$ — again variance from the kept terms plus bias from the dropped ones.</p>" +
        "<p>To use this we need $\\sigma^2 = \\mathbb{V}(\\epsilon_i)$. Estimate it from the high-frequency coefficients, which are nearly pure noise when $r$ is smooth: $\\hat{\\sigma}^2 = \\frac{n}{k}\\sum_{i=n-k+1}^{n} \\hat{\\beta}_i^2$ with $k = n/4$. The reasoning: for large $j$, $\\hat{\\beta}_j \\approx N(0,\\sigma^2/n)$, so $\\frac{n}{k}\\sum \\hat{\\beta}_j^2 \\approx \\frac{\\sigma^2}{k}\\chi^2_k$, whose mean is $\\sigma^2$. There is nothing special about $k = n/4$; any $k$ growing with $n$ at a suitable rate works.</p>" +
        "<p>The estimated risk is $\\hat{R}(J) = \\frac{J\\hat{\\sigma}^2}{n} + \\sum_{j=J+1}^n (\\hat{\\beta}_j^2 - \\hat{\\sigma}^2/n)_{+}$.</p>" },
      { h: "The Orthogonal Series Regression Estimator", body:
        "<p>The complete method in five steps:</p>" +
        "<ul class=\"steps\">" +
        "<li><strong>1.</strong> $\\hat{\\beta}_j = \\frac{1}{n}\\sum_{i=1}^n Y_i \\phi_j(x_i)$ for $j=1,\\dots,n$.</li>" +
        "<li><strong>2.</strong> $\\hat{\\sigma}^2 = \\frac{n}{k}\\sum_{i=n-k+1}^{n}\\hat{\\beta}_i^2$ with $k \\approx n/4$.</li>" +
        "<li><strong>3.</strong> Compute $\\hat{R}(J) = \\frac{J\\hat{\\sigma}^2}{n} + \\sum_{j=J+1}^n (\\hat{\\beta}_j^2 - \\hat{\\sigma}^2/n)_{+}$ for $1 \\le J \\le n$.</li>" +
        "<li><strong>4.</strong> Choose $\\hat{J} \\in \\{1,\\dots,n\\}$ to minimize $\\hat{R}(J)$.</li>" +
        "<li><strong>5.</strong> Set $\\hat{r}(x) = \\sum_{j=1}^{\\hat{J}} \\hat{\\beta}_j \\phi_j(x)$.</li>" +
        "</ul>" +
        "<p>A confidence band for the smoothed $r_J$ (Theorem 21.11) is $\\hat{r}_n(x) \\pm c$ with $c = a(x)\\hat{\\sigma}\\chi_{J,\\alpha}/\\sqrt{n}$ and $a(x) = \\sqrt{\\sum_{j=1}^J \\phi_j^2(x)}$, valid when $J \\lt n-k+1$.</p>" },
      { h: "Doppler examples and the unequal-spacing note", body:
        "<p><strong>Example 21.10.</strong> Figure 21.4 shows the doppler function with $n = 2{,}048$ observations from $Y_i = r(x_i)+\\epsilon_i$, $x_i = i/n$, $\\epsilon_i \\sim N(0,(0.1)^2)$. The risk-minimizing fit used $\\hat{J} = 234$ terms. <strong>Example 21.12.</strong> Figure 21.5 contrasts $J = 234$ (high resolution, wide bands) against $J = 45 \\approx \\sqrt{n}$ (lower resolution, tighter bands). Larger $J$ buys detail at the cost of wider confidence bands.</p>" +
        "<p>If the inputs lie on a general interval $[a,b]$, rescale them into $[0,1]$. The methods still apply when the $x_i$ are unequally spaced, as long as they 'fill out' $[0,1]$ without clumping. Treating the $x_i$ as random rather than fixed requires significant modifications not covered here.</p>" }
    ],
    takeaways: [
      "Regression: expand r in a basis and estimate beta_j = mean of Y_i times phi_j(x_i), approximately Normal.",
      "Risk R(J) = J*sigma^2/n + bias from dropped terms; estimate sigma^2 from the high-frequency coefficients.",
      "Pick J to minimize the estimated risk, then fit r-hat with the first J terms.",
      "Doppler fit used J = 234 terms (n = 2048); larger J means more detail but wider bands."
    ]
  });
  window.CODEVIZ["aos-ch21-regression"] = { charts: [ {
    type: "bars",
    title: "Example 21.12 — resolution vs band width for the doppler fit",
    interpret: "J=234 minimizes estimated risk and resolves the high-frequency wiggle, but its confidence bands are wider; J~=45 (sqrt of n=2048) gives a coarser fit with tighter bands.",
    labels: ["J = 234 (min risk)", "J = 45 (~sqrt n)"],
    values: [234, 45],
    colors: ["#4ea1ff", "#ffb454"]
  } ] };

  // 4 — Wavelets
  B({
    id: "aos-ch21-wavelets",
    chapter: "Chapter 21",
    title: "Wavelets and Thresholding",
    tagline: "For functions with sharp local features, a localized wavelet basis plus coefficient thresholding fixes a peak in one place without wiggling the rest.",
    sections: [
      { h: "Why a new basis", body:
        "<p>Suppose $f$ has a sharp jump at one point but is otherwise very smooth — the book calls such $f$ <strong>spatially inhomogeneous</strong>; the doppler function is an example, smooth for large $x$ and unsmooth for small $x$. A cosine basis handles this badly: keep few low-order terms and you miss the peak; add high-order terms and you find the peak but make the smooth part wiggly. Kernel regression has the same dilemma between large and small bandwidth.</p>" +
        "<p><strong>Wavelets</strong> fix this with a basis whose functions are localized, so you can add a 'blip' in a small region without adding wiggles elsewhere.</p>" },
      { h: "Haar wavelets", body:
        "<p>The <strong>Haar father wavelet</strong> (scaling function) is $\\phi(x) = 1$ for $0 \\le x \\lt 1$ and $0$ otherwise. The <strong>mother Haar wavelet</strong> is $\\psi(x) = -1$ for $0 \\le x \\le 1/2$ and $+1$ for $1/2 \\lt x \\le 1$. For integers $j,k$ define the rescaled, shifted version</p>" +
        "<p>$\\psi_{j,k}(x) = 2^{j/2}\\psi(2^j x - k).$</p>" +
        "<p>The factor $2^j$ rescales (squeezes) and $k$ shifts. For large $j$, $\\psi_{j,k}$ is very localized, letting you add detail in one spot — like a microscope at increasing resolution. This is called a <strong>multiresolution analysis</strong> of $L_2(0,1)$. Collecting the level-$j$ wavelets, $W_j = \\{\\psi_{jk}: k = 0,1,\\dots,2^j-1\\}$.</p>" +
        "<p><strong>Theorem 21.13:</strong> the set $\\{\\phi, W_0, W_1, W_2, \\dots\\}$ is an orthonormal basis for $L_2(0,1)$.</p>" },
      { h: "Scaling and detail coefficients", body:
        "<p>Any $f \\in L_2(0,1)$ expands as a double sum over levels $j$ and shifts $k$:</p>" +
        "<p>$f(x) = \\alpha\\,\\phi(x) + \\sum_{j=0}^{\\infty}\\sum_{k=0}^{2^j-1}\\beta_{j,k}\\,\\psi_{j,k}(x),$</p>" +
        "<p>with $\\alpha = \\int_0^1 f(x)\\phi(x)\\,dx$ the <strong>scaling coefficient</strong> and $\\beta_{j,k} = \\int_0^1 f(x)\\psi_{j,k}(x)\\,dx$ the <strong>detail coefficients</strong>. The <strong>resolution $J$ approximation</strong> truncates levels at $J-1$: $f_J(x) = \\alpha\\phi(x) + \\sum_{j=0}^{J-1}\\sum_{k=0}^{2^j-1}\\beta_{j,k}\\psi_{j,k}(x)$. Its term count is $1 + \\sum_{j=0}^{J-1}2^j = 1 + 2^J - 1 = 2^J$.</p>" +
        "<p>Haar wavelets are localized but not smooth. Daubechies (1988) showed smooth localized orthonormal wavelets exist, but they have no closed form, so the chapter sticks with Haar.</p>" },
      { h: "Thresholding instead of truncation", body:
        "<p>For the model $Y_i = r(x_i)+\\sigma\\epsilon_i$, $\\epsilon_i \\sim N(0,1)$, $x_i = i/n$, assume $n = 2^J$. The key difference from the cosine basis: there, the term count $J$ was the smoothing knob. With wavelets, smoothing is done by <strong>thresholding</strong> — keep a term if its coefficient is large, throw it out otherwise. With $J = \\log_2(n)$ define empirical coefficients $\\hat{\\alpha} = \\frac{1}{n}\\sum_i \\phi_k(x_i)Y_i$ and $D_{j,k} = \\frac{1}{n}\\sum_i \\psi_{j,k}(x_i)Y_i$ for $0 \\le j \\le J-1$.</p>" +
        "<p>The simplest scheme, <strong>hard universal thresholding</strong>, keeps each detail coefficient only if it exceeds a universal threshold:</p>" +
        "<p>$\\hat{\\beta}_{j,k} = D_{j,k}$ if $|D_{j,k}| \\gt \\hat{\\sigma}\\sqrt{2\\log n / n}$, and $0$ otherwise,</p>" +
        "<p>then $\\hat{f}(x) = \\hat{\\alpha}\\phi(x) + \\sum_{j=j_0}^{J-1}\\sum_{k=0}^{2^j-1}\\hat{\\beta}_{j,k}\\psi_{j,k}(x)$. The noise level is estimated robustly to be insensitive to sharp peaks: $\\hat{\\sigma} = \\sqrt{n}\\times \\text{median}(|D_{J-1,k}|: k=0,\\dots,2^{J-1}-1)/0.6745$. In practice the coefficients come from the fast <strong>discrete wavelet transform (DWT)</strong>.</p>" },
      { h: "Why universal thresholding works", body:
        "<p>The intuition: when there is no signal ($\\beta_{j,k}=0$ for all $j,k$), thresholding should zero everything out. <strong>Theorem 21.15:</strong> if $\\beta_{j,k}=0$ for all $j,k$, the universal-threshold estimator satisfies $\\mathbb{P}(\\hat{\\beta}_{j,k}=0 \\text{ for all } j,k) \\to 1$ as $n \\to \\infty$.</p>" +
        "<p>The proof bounds $\\mathbb{P}(\\max|D_{j,k}| \\gt \\lambda)$ using Mill's inequality and shows it is at most $c/\\sqrt{2\\log n} \\to 0$, so with probability tending to one every coefficient is thresholded away — exactly the desired behavior under no signal.</p>" +
        "<p><strong>Example 21.16.</strong> For the doppler signal with $\\sigma = 0.1$ and $n = 2{,}048$, Figure 21.8 shows the data and the universal-threshold Haar estimate. It is not smooth (Haar wavelets aren't), yet it is quite accurate, including the high-frequency region near the left edge.</p>" }
    ],
    takeaways: [
      "Wavelets give a localized basis: you can add a blip in one region without wiggling the rest, unlike the cosine basis.",
      "Haar wavelets phi_{j,k} = 2^{j/2} psi(2^j x - k) give a multiresolution orthonormal basis (Theorem 21.13).",
      "An f expands as scaling coefficient alpha plus detail coefficients beta_{j,k}; the resolution-J fit has 2^J terms.",
      "Smoothing is done by thresholding (keep large coefficients), not by a term count; under no signal everything is zeroed (Theorem 21.15)."
    ]
  });
})();
