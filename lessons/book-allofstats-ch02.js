/* All of Statistics (Larry Wasserman) — Chapter 2: Random Variables. Self-registering fragment. */
(function () {
  window.LESSONS = window.LESSONS || [];
  window.CODEVIZ = window.CODEVIZ || {};
  const M = "All of Statistics";
  const BOOK = "All of Statistics";
  const B = (o) => window.LESSONS.push(Object.assign({ module: M, template: "book", book: BOOK }, o));

  // 1) Distribution functions (CDF) and probability functions (pmf/pdf)
  B({
    id: "aos-ch2-distribution-functions",
    chapter: "Chapter 2",
    title: "Distribution functions and probability functions",
    tagline: "The CDF carries all the information about a random variable; the pmf or pdf describes where its probability sits.",
    sections: [
      { h: "Random variable and CDF", body:
        "<p>A <strong>random variable</strong> is a mapping $X : \\Omega \\to \\mathbb{R}$ that attaches a real number $X(\\omega)$ to every outcome $\\omega$ in the sample space $\\Omega$. Here $\\Omega$ is the set of all possible outcomes and $\\omega$ is one such outcome. Wasserman's example: flip a coin ten times and let $X(\\omega)$ count the heads, so the outcome $HHTHHTHHTT$ gives $X(\\omega) = 6$. Example 2.3 gives a geometric sample space too: draw a point $\\omega=(x,y)$ from the unit disk $\\{(x,y):x^2+y^2\\le 1\\}$, then examples of random variables are $X(\\omega)=x$, $Y(\\omega)=y$, $Z(\\omega)=x+y$, and $W(\\omega)=x^2+y^2$.</p>" +
        "<p>The <strong>cumulative distribution function</strong> (CDF) is $F_X : \\mathbb{R} \\to [0,1]$ defined by $F_X(x) = \\mathbb{P}(X \\le x)$ — the probability that $X$ lands at or below $x$. The author stresses that the CDF \"effectively contains all the information about the random variable\": if two variables have the same CDF, they assign the same probability to every event.</p>" +
        "<p>A valid CDF must be (i) non-decreasing, (ii) normalized so $\\lim_{x\\to-\\infty}F(x)=0$ and $\\lim_{x\\to\\infty}F(x)=1$, and (iii) right-continuous.</p>" },
      { h: "Worked CDF: two coin flips", body:
        "<p>Flip a fair coin twice and let $X$ be the number of heads. The four equally-likely outcomes $TT, TH, HT, HH$ give $\\mathbb{P}(X=0)=1/4$, $\\mathbb{P}(X=1)=1/2$, $\\mathbb{P}(X=2)=1/4$.</p>" +
        "<table class='extable'><thead><tr><th>$\\omega$</th><th class='num'>$\\mathbb{P}(\\{\\omega\\})$</th><th class='num'>$X(\\omega)$</th></tr></thead><tbody>" +
        "<tr><td class='row-h'>$TT$</td><td class='num'>1/4</td><td class='num'>0</td></tr>" +
        "<tr><td class='row-h'>$TH$</td><td class='num'>1/4</td><td class='num'>1</td></tr>" +
        "<tr><td class='row-h'>$HT$</td><td class='num'>1/4</td><td class='num'>1</td></tr>" +
        "<tr><td class='row-h'>$HH$</td><td class='num'>1/4</td><td class='num'>2</td></tr>" +
        "</tbody></table>" +
        "<p>Accumulating these probabilities yields a step function:</p>" +
        "<table class='extable'><thead><tr><th>Range of $x$</th><th class='num'>$F_X(x)$</th></tr></thead><tbody>" +
        "<tr><td class='row-h'>$x \\lt 0$</td><td class='num'>0</td></tr>" +
        "<tr><td class='row-h'>$0 \\le x \\lt 1$</td><td class='num'>1/4</td></tr>" +
        "<tr><td class='row-h'>$1 \\le x \\lt 2$</td><td class='num'>3/4</td></tr>" +
        "<tr><td class='row-h'>$x \\ge 2$</td><td class='num'>1</td></tr>" +
        "</tbody></table>" +
        "<p>So $F_X(1.4) = 3/4 = .75$: even though $X$ never equals $1.4$, the CDF is defined for all real $x$, and at $1.4$ it has already accumulated the probability of $X=0$ and $X=1$.</p>" },
      { h: "Probability functions: pmf and pdf", body:
        "<p>$X$ is <strong>discrete</strong> if it takes countably many values. Its <strong>probability mass function</strong> (pmf) is $f_X(x) = \\mathbb{P}(X=x)$, with $f_X(x) \\ge 0$ and $\\sum_i f_X(x_i) = 1$. For the two-flip example $f_X$ is $1/4, 1/2, 1/4$ at $x = 0, 1, 2$ and $0$ otherwise. The CDF rebuilds from the pmf by $F_X(x) = \\sum_{x_i \\le x} f_X(x_i)$.</p>" +
        "<p>$X$ is <strong>continuous</strong> if there is a <strong>probability density function</strong> (pdf) $f_X \\ge 0$ with $\\int_{-\\infty}^{\\infty} f_X(x)\\,dx = 1$ and $\\mathbb{P}(a \\lt X \\lt b) = \\int_a^b f_X(x)\\,dx$. Then $F_X(x) = \\int_{-\\infty}^{x} f_X(t)\\,dt$ and $f_X(x) = F_X'(x)$ where $F_X$ is differentiable.</p>" +
        "<p><strong>Warning from the book.</strong> For a continuous $X$, $\\mathbb{P}(X=x)=0$ for every $x$, so a pdf is not a probability — you only get probabilities by integrating. A pdf can even exceed 1: if $f(x)=5$ on $[0, 1/5]$ and $0$ elsewhere, it is a valid density because $\\int f = 1$. The inverse CDF or <strong>quantile function</strong> is $F^{-1}(q) = \\inf\\{x : F(x) \\gt q\\}$; $F^{-1}(1/2)$ is the median.</p>" }
    ],
    takeaways: [
      "A random variable maps outcomes to numbers; the CDF $F_X(x)=\\mathbb{P}(X\\le x)$ holds all its information.",
      "A CDF is non-decreasing, normalized, and right-continuous.",
      "Discrete variables have a pmf $f_X(x)=\\mathbb{P}(X=x)$; continuous variables have a pdf you integrate to get probabilities.",
      "For continuous $X$, $\\mathbb{P}(X=x)=0$ and a density may be larger than 1."
    ]
  });
  window.CODEVIZ["aos-ch2-distribution-functions"] = {
    charts: [
      { type: "line", title: "CDF for flipping a coin twice (Figure 2.1)",
        interpret: "The CDF is right-continuous and jumps at the possible head counts 0, 1, and 2.",
        xlabel: "x", ylabel: "F_X(x)",
        series: [ { name: "F_X(x)", color: "#4ea1ff", points: [
          [-0.5, 0], [0, 0.25], [0.999, 0.25], [1, 0.75], [1.999, 0.75], [2, 1], [2.5, 1] ] } ] },
      { type: "bars", title: "Probability function for flipping a coin twice (Figure 2.2)",
        interpret: "The mass function is 1/4 at 0 heads, 1/2 at 1 head, and 1/4 at 2 heads.",
        labels: ["0", "1", "2"], values: [0.25, 0.5, 0.25],
        valueLabels: ["1/4", "1/2", "1/4"], colors: ["#4ea1ff", "#ffb454", "#4ea1ff"] },
      { type: "line", title: "CDF for Uniform(0,1) (Figure 2.3)",
        interpret: "The CDF is 0 before 0, rises linearly from 0 to 1, and stays at 1 after 1.",
        xlabel: "x", ylabel: "F_X(x)",
        series: [ { name: "F_X(x)", color: "#7ee787", points: [
          [-0.25, 0], [0, 0], [1, 1], [1.25, 1] ] } ] }
    ],
    code: "# Recreate the chapter's coin-flip pmf/CDF and Uniform(0,1) CDF figures.\nimport numpy as np\n\nx = np.array([0, 1, 2])\npmf = np.array([1/4, 1/2, 1/4])\ncdf = np.cumsum(pmf)        # [0.25, 0.75, 1.00]\nprint(dict(zip(x, pmf)))    # {0: 0.25, 1: 0.5, 2: 0.25}\nprint(dict(zip(x, cdf)))    # {0: 0.25, 1: 0.75, 2: 1.0}\n\nu = np.linspace(-0.25, 1.25, 7)\nF_uniform = np.clip(u, 0, 1)\nprint(F_uniform)            # 0 before 0, line on [0,1], 1 after 1"
  };

  // 2) Important discrete random variables
  B({
    id: "aos-ch2-discrete-distributions",
    chapter: "Chapter 2",
    title: "Important discrete random variables",
    tagline: "A small toolkit — Bernoulli, Binomial, Geometric, Poisson — covers most counting situations.",
    sections: [
      { h: "Notation warning", body:
        "<p>It is traditional to write $X \\sim F$ to mean \"$X$ has distribution $F$\". The author warns this is unfortunate, since $\\sim$ also signals approximation elsewhere, but the notation is too entrenched to abandon: read $X \\sim F$ as \"$X$ has distribution $F$\", not \"$X$ is approximately $F$\". Also keep $X$ (the random variable), $x$ (a value), and the fixed <strong>parameters</strong> like $n$ and $p$ distinct.</p>" },
      { h: "Bernoulli and Binomial", body:
        "<p><strong>Bernoulli.</strong> $X$ is a single binary coin flip with $\\mathbb{P}(X=1)=p$ and $\\mathbb{P}(X=0)=1-p$, written $X \\sim \\text{Bernoulli}(p)$. Its probability function is $f(x) = p^x(1-p)^{1-x}$ for $x \\in \\{0,1\\}$.</p>" +
        "<p><strong>Binomial.</strong> Flip a coin with heads-probability $p$ a total of $n$ independent times and let $X$ count the heads. Then $X \\sim \\text{Binomial}(n,p)$ with $f(x) = \\binom{n}{x} p^x (1-p)^{n-x}$ for $x = 0,\\dots,n$. Binomials add when they share $p$: if $X_1 \\sim \\text{Binomial}(n_1,p)$ and $X_2 \\sim \\text{Binomial}(n_2,p)$ then $X_1 + X_2 \\sim \\text{Binomial}(n_1+n_2, p)$.</p>" +
        "<p>The chart below plots the Binomial pmf for $n=10$, $p=0.5$ — the ten-flip head-count from the chapter's opening example.</p>" },
      { h: "Geometric and Poisson", body:
        "<p><strong>Geometric.</strong> $X \\sim \\text{Geom}(p)$ with $p \\in (0,1)$ has $\\mathbb{P}(X=k) = p(1-p)^{k-1}$ for $k \\ge 1$. Think of $X$ as the number of flips needed to get the first head. It is a genuine distribution because the geometric series sums to one:</p>" +
        "<ul class='steps'>" +
        "<li>$\\sum_{k=1}^{\\infty} p(1-p)^{k-1} = p \\sum_{k=1}^{\\infty}(1-p)^{k-1} = p \\cdot \\frac{1}{1-(1-p)} = \\frac{p}{p} = 1.$</li>" +
        "</ul>" +
        "<p><strong>Poisson.</strong> $X \\sim \\text{Poisson}(\\lambda)$ has $f(x) = e^{-\\lambda}\\dfrac{\\lambda^x}{x!}$ for $x \\ge 0$. It normalizes via the exponential series: $\\sum_{x=0}^{\\infty} e^{-\\lambda}\\frac{\\lambda^x}{x!} = e^{-\\lambda}e^{\\lambda} = 1$. Wasserman notes the Poisson models counts of rare events such as radioactive decay and traffic accidents, and that independent Poissons add: $X_1 \\sim \\text{Poisson}(\\lambda_1)$, $X_2 \\sim \\text{Poisson}(\\lambda_2)$ give $X_1+X_2 \\sim \\text{Poisson}(\\lambda_1+\\lambda_2)$.</p>" +
        "<p>The author also lists two simpler cases: the <strong>point mass</strong> $\\delta_a$ with $\\mathbb{P}(X=a)=1$, and the <strong>discrete uniform</strong> on $\\{1,\\dots,k\\}$ with $f(x)=1/k$.</p>" }
    ],
    takeaways: [
      "Bernoulli$(p)$: one trial; Binomial$(n,p)$: count of heads in $n$ trials.",
      "Geometric$(p)$: trials until the first success, $\\mathbb{P}(X=k)=p(1-p)^{k-1}$.",
      "Poisson$(\\lambda)$: counts of rare events; both Binomials (same $p$) and Poissons add.",
      "Keep random variables, values, and parameters separate."
    ]
  });

  // 3) Important continuous random variables
  B({
    id: "aos-ch2-continuous-distributions",
    chapter: "Chapter 2",
    title: "Important continuous random variables",
    tagline: "Uniform, Normal, Exponential, Gamma and Beta are the workhorse continuous models.",
    sections: [
      { h: "Uniform and Exponential", body:
        "<p><strong>Uniform.</strong> $X \\sim \\text{Uniform}(a,b)$ has constant density $f(x) = \\frac{1}{b-a}$ on $[a,b]$ and $0$ elsewhere. Its CDF rises linearly: $F(x)=0$ for $x \\lt a$, $F(x)=\\frac{x-a}{b-a}$ on $[a,b]$, and $F(x)=1$ for $x \\gt b$. The case $\\text{Uniform}(0,1)$ captures \"a point chosen at random between 0 and 1\".</p>" +
        "<p><strong>Exponential.</strong> $X \\sim \\text{Exp}(\\beta)$ has $f(x) = \\frac{1}{\\beta} e^{-x/\\beta}$ for $x \\gt 0$, with $\\beta \\gt 0$. It models lifetimes of electronic components and waiting times between rare events.</p>" },
      { h: "Normal (Gaussian)", body:
        "<p>$X \\sim N(\\mu, \\sigma^2)$ has density $f(x) = \\dfrac{1}{\\sigma\\sqrt{2\\pi}}\\exp\\!\\left\\{-\\dfrac{1}{2\\sigma^2}(x-\\mu)^2\\right\\}$. The parameter $\\mu$ is the center and $\\sigma$ the spread. With $\\mu=0$, $\\sigma=1$ it is the <strong>standard Normal</strong>, written $Z$, with pdf $\\phi(z)$ and CDF $\\Phi(z)$ (no closed form). Key facts: if $X \\sim N(\\mu,\\sigma^2)$ then $Z=(X-\\mu)/\\sigma \\sim N(0,1)$; and independent Normals add, $\\sum_i X_i \\sim N\\!\\left(\\sum_i \\mu_i, \\sum_i \\sigma_i^2\\right)$.</p>" +
        "<p><strong>Worked example.</strong> Let $X \\sim N(3,5)$ (so $\\mu=3$, $\\sigma=\\sqrt{5}$) and find $\\mathbb{P}(X \\gt 1)$:</p>" +
        "<ul class='steps'>" +
        "<li>$\\mathbb{P}(X \\gt 1) = 1 - \\mathbb{P}(X \\lt 1) = 1 - \\mathbb{P}\\!\\left(Z \\lt \\frac{1-3}{\\sqrt{5}}\\right).$</li>" +
        "<li>$\\frac{1-3}{\\sqrt{5}} = \\frac{-2}{\\sqrt{5}} \\approx -0.8944$, and from the Normal table $\\Phi(-0.8944) \\approx 0.19$.</li>" +
        "<li>So $\\mathbb{P}(X \\gt 1) = 1 - 0.19 = 0.81.$</li>" +
        "</ul>" +
        "<p>To find $q = \\Phi^{-1}(0.2)$ for this $X$: the table gives $\\Phi(-0.8416)=0.2$, so $-0.8416 = (q-3)/\\sqrt{5}$, hence $q = 3 - 0.8416\\sqrt{5} = 1.1181$. The Figure 2.4 standard-Normal density is charted below.</p>" },
      { h: "Gamma and Beta", body:
        "<p>The <strong>Gamma function</strong> is $\\Gamma(\\alpha) = \\int_0^{\\infty} y^{\\alpha-1}e^{-y}\\,dy$ for $\\alpha \\gt 0$. The <strong>Gamma distribution</strong> $X \\sim \\text{Gamma}(\\alpha,\\beta)$ has $f(x) = \\dfrac{1}{\\beta^\\alpha \\Gamma(\\alpha)} x^{\\alpha-1} e^{-x/\\beta}$ for $x \\gt 0$. The Exponential is the special case $\\text{Gamma}(1,\\beta)$, and independent Gammas with shared $\\beta$ add: $\\sum_i X_i \\sim \\text{Gamma}(\\sum_i \\alpha_i, \\beta)$.</p>" +
        "<p>The <strong>Beta distribution</strong> $X \\sim \\text{Beta}(\\alpha,\\beta)$, with $\\alpha,\\beta \\gt 0$, lives on $(0,1)$ with $f(x) = \\dfrac{\\Gamma(\\alpha+\\beta)}{\\Gamma(\\alpha)\\Gamma(\\beta)} x^{\\alpha-1}(1-x)^{\\beta-1}$. The chapter also introduces the $t$ and Cauchy distributions (the $t$ resembles a Normal with thicker tails; Cauchy is $t$ with $\\nu=1$) and the $\\chi^2$ distribution, where a sum of $p$ squared independent standard Normals is $\\chi^2_p$.</p>" +
        "<table class='extable'><thead><tr><th>distribution</th><th>support / density from the book</th></tr></thead><tbody>" +
        "<tr><td class='row-h'>Cauchy</td><td>$f(x)=1/(\\pi(1+x^2))$ on $\\mathbb{R}$</td></tr>" +
        "<tr><td class='row-h'>$\\chi^2_p$</td><td>$f(x)=\\dfrac{1}{\\Gamma(p/2)2^{p/2}}x^{(p/2)-1}e^{-x/2}$ for $x\\gt0$</td></tr>" +
        "<tr><td class='row-h'>sum of squares</td><td>if $Z_1,\\ldots,Z_p$ are independent standard Normals, then $\\sum_{i=1}^{p}Z_i^2\\sim\\chi^2_p$</td></tr>" +
        "</tbody></table>" +
        "<ul class='steps'><li>The book verifies the Cauchy density by integration: $\\int_{-\\infty}^{\\infty}\\frac{1}{\\pi(1+x^2)}\\,dx = \\frac{1}{\\pi}[\\tan^{-1}(x)]_{-\\infty}^{\\infty}$.</li><li>Since $\\tan^{-1}(\\infty)=\\pi/2$ and $\\tan^{-1}(-\\infty)=-\\pi/2$, the integral is $\\frac{1}{\\pi}(\\pi/2-(-\\pi/2))=1$.</li></ul>" }
    ],
    takeaways: [
      "Uniform$(a,b)$: flat density $1/(b-a)$; Exponential$(\\beta)$: lifetimes and waiting times.",
      "Normal$(\\mu,\\sigma^2)$: standardize with $Z=(X-\\mu)/\\sigma$ and read $\\Phi$ from a table.",
      "$N(3,5)$ gives $\\mathbb{P}(X\\gt 1)=0.81$ and $\\Phi^{-1}(0.2)$ maps to $q=1.1181$.",
      "Exponential is Gamma$(1,\\beta)$; Beta lives on $(0,1)$; squared standard Normals give $\\chi^2$."
    ]
  });

  // 4) Bivariate, marginal and conditional distributions
  B({
    id: "aos-ch2-bivariate-marginal-conditional",
    chapter: "Chapter 2",
    title: "Bivariate marginal and conditional distributions",
    tagline: "A joint distribution over a pair of variables collapses to marginals by summing, and to conditionals by dividing.",
    sections: [
      { h: "Joint distributions", body:
        "<p>For a pair of discrete variables, the <strong>joint mass function</strong> is $f(x,y) = \\mathbb{P}(X=x, Y=y)$. In the continuous case $f(x,y)$ is a joint pdf if $f \\ge 0$, $\\iint f = 1$, and $\\mathbb{P}((X,Y)\\in A) = \\iint_A f$. The author's discrete example for two 0/1 variables:</p>" +
        "<table class='extable'><thead><tr><th></th><th class='num'>$Y=0$</th><th class='num'>$Y=1$</th></tr></thead><tbody>" +
        "<tr><td class='row-h'>$X=0$</td><td class='num'>1/9</td><td class='num'>2/9</td></tr>" +
        "<tr><td class='row-h'>$X=1$</td><td class='num'>2/9</td><td class='num'>4/9</td></tr>" +
        "</tbody></table>" +
        "<p>so $f(1,1) = \\mathbb{P}(X=1,Y=1) = 4/9$. For $(X,Y)$ uniform on the unit square, $\\mathbb{P}(X \\lt 1/2, Y \\lt 1/2)$ is just the area $1/4$.</p>" +
        "<p>Example 2.21 checks that $f(x,y)=x+y$ on the unit square is a valid pdf:</p>" +
        "<ul class='steps'><li>$\\int_0^1\\int_0^1(x+y)\\,dx\\,dy = \\int_0^1\\left(\\int_0^1x\\,dx\\right)dy + \\int_0^1\\left(\\int_0^1y\\,dx\\right)dy$.</li><li>The two terms are $\\int_0^1(1/2)\\,dy=1/2$ and $\\int_0^1 y\\,dy=1/2$.</li><li>Total mass $=1/2+1/2=1$, so the density is normalized.</li></ul>" +
        "<p>Example 2.22 uses the non-rectangular support $x^2\\le y\\le1$ with density $c x^2y$.</p>" +
        "<ul class='steps'><li>Because $-1\\le x\\le1$, normalization gives $1=c\\int_{-1}^{1}\\int_{x^2}^{1}x^2y\\,dy\\,dx=4c/21$, hence $c=21/4$.</li><li>The event $X\\ge Y$ inside the support is $0\\le x\\le1$ and $x^2\\le y\\le x$.</li><li>$\\mathbb{P}(X\\ge Y)=\\frac{21}{4}\\int_0^1\\int_{x^2}^{x}x^2y\\,dy\\,dx=3/20$.</li></ul>" },
      { h: "Marginal distributions", body:
        "<p>The <strong>marginal</strong> of $X$ sums (or integrates) out the other variable: $f_X(x) = \\sum_y f(x,y)$ and $f_Y(y) = \\sum_x f(x,y)$; continuously, $f_X(x) = \\int f(x,y)\\,dy$. In a joint table the marginals are exactly the row and column totals.</p>" +
        "<table class='extable'><thead><tr><th></th><th class='num'>$Y=0$</th><th class='num'>$Y=1$</th><th class='num'>$f_X$</th></tr></thead><tbody>" +
        "<tr><td class='row-h'>$X=0$</td><td class='num'>1/10</td><td class='num'>2/10</td><td class='num'>3/10</td></tr>" +
        "<tr><td class='row-h'>$X=1$</td><td class='num'>3/10</td><td class='num'>4/10</td><td class='num'>7/10</td></tr>" +
        "<tr><td class='row-h'>$f_Y$</td><td class='num'>4/10</td><td class='num'>6/10</td><td class='num'>1</td></tr>" +
        "</tbody></table>" +
        "<p>Reading the row totals, $f_X(0)=3/10$ and $f_X(1)=7/10$. A continuous example: if $f(x,y)=x+y$ on the unit square, then $f_Y(y) = \\int_0^1 (x+y)\\,dx = \\frac{1}{2} + y$.</p>" +
        "<ul class='steps'><li>For the non-rectangular density from Example 2.22, $f(x,y)=\\frac{21}{4}x^2y$ on $x^2\\le y\\le1$.</li><li>The marginal of $X$ integrates over $y$: $f_X(x)=\\int_{x^2}^{1}\\frac{21}{4}x^2y\\,dy$.</li><li>This equals $\\frac{21}{8}x^2(1-x^4)$ for $-1\\le x\\le1$, and 0 otherwise.</li></ul>" },
      { h: "Conditional distributions", body:
        "<p>The <strong>conditional pmf</strong> is $f_{X|Y}(x|y) = \\dfrac{f_{X,Y}(x,y)}{f_Y(y)}$ whenever $f_Y(y) \\gt 0$; the same formula defines the continuous conditional density. For $(X,Y)$ uniform on the unit square, $f_{X|Y}(x|y) = 1$, so $X|Y=y \\sim \\text{Uniform}(0,1)$.</p>" +
        "<p><strong>Worked conditional probability.</strong> With $f(x,y)=x+y$ on the unit square and $f_Y(y)=y+\\frac{1}{2}$, find $\\mathbb{P}(X \\lt 1/4 \\mid Y = 1/3)$:</p>" +
        "<ul class='steps'>" +
        "<li>$f_{X|Y}(x|1/3) = \\dfrac{x + \\frac{1}{3}}{\\frac{1}{3}+\\frac{1}{2}}.$</li>" +
        "<li>$\\mathbb{P}(X \\lt 1/4 \\mid Y=1/3) = \\displaystyle\\int_0^{1/4} \\frac{x+\\frac{1}{3}}{\\frac{1}{3}+\\frac{1}{2}}\\,dx = \\frac{\\frac{1}{32}+\\frac{1}{12}}{\\frac{1}{3}+\\frac{1}{2}}.$</li>" +
        "<li>Numerator $= \\frac{3}{96}+\\frac{8}{96} = \\frac{11}{96}$; denominator $= \\frac{5}{6}$; ratio $= \\frac{11}{96}\\cdot\\frac{6}{5} = \\frac{11}{80}.$</li>" +
        "</ul>" +
        "<p>Two more conditional examples show the same divide-by-the-marginal rule.</p>" +
        "<ul class='steps'><li>Example 2.39: if $X\\sim\\text{Uniform}(0,1)$ and $Y\\mid X=x\\sim\\text{Uniform}(x,1)$, then $f_{X,Y}(x,y)=1/(1-x)$ for $0\\lt x\\lt y\\lt1$.</li><li>Integrating over $x$ gives $f_Y(y)=\\int_0^y\\frac{dx}{1-x}=-\\log(1-y)$ for $0\\lt y\\lt1$.</li><li>Example 2.40: for the non-rectangular density, $f_{Y|X}(y|x)=\\frac{2y}{1-x^4}$ on $x^2\\le y\\le1$.</li><li>At $x=1/2$, $f_{Y|X}(y|1/2)=32y/15$, so $\\mathbb{P}(Y\\ge3/4\\mid X=1/2)=\\int_{3/4}^{1}32y/15\\,dy=7/15$.</li></ul>" },
      { h: "Independence", body:
        "<p>$X$ and $Y$ are <strong>independent</strong> ($X \\amalg Y$) if $\\mathbb{P}(X\\in A, Y\\in B) = \\mathbb{P}(X\\in A)\\mathbb{P}(Y\\in B)$ for all $A,B$. Equivalently $f_{X,Y}(x,y) = f_X(x)f_Y(y)$ for all $x,y$. Example 2.31 contrasts independence and dependence:</p>" +
        "<table class='extable'><thead><tr><th>case</th><th class='num'>$f(0,0)$</th><th class='num'>$f(0,1)$</th><th class='num'>$f(1,0)$</th><th class='num'>$f(1,1)$</th><th>check</th></tr></thead><tbody>" +
        "<tr><td class='row-h'>independent</td><td class='num'>1/4</td><td class='num'>1/4</td><td class='num'>1/4</td><td class='num'>1/4</td><td>all marginals are 1/2, so each product is 1/4</td></tr>" +
        "<tr><td class='row-h'>dependent</td><td class='num'>1/2</td><td class='num'>0</td><td class='num'>0</td><td class='num'>1/2</td><td>$f_X(0)f_Y(1)=1/4$ but $f(0,1)=0$</td></tr>" +
        "</tbody></table>" +
        "<p>A handy check (Theorem 2.33): if the support is a rectangle and $f(x,y)=g(x)h(y)$ factors, then $X$ and $Y$ are independent.</p>" +
        "<ul class='steps'><li>Example 2.32: if independent $X,Y$ both have density $2x$ on $[0,1]$, then $f(x,y)=4xy$ on the unit square.</li><li>$\\mathbb{P}(X+Y\\le1)=4\\int_0^1\\int_0^{1-x}xy\\,dy\\,dx=1/6$.</li><li>Example 2.34: $f(x,y)=2e^{-(x+2y)}$ on $(0,\\infty)\\times(0,\\infty)$ factors as $g(x)h(y)$ with $g(x)=2e^{-x}$ and $h(y)=e^{-2y}$, so $X$ and $Y$ are independent.</li></ul>" }
    ],
    takeaways: [
      "Joint $f(x,y)=\\mathbb{P}(X=x,Y=y)$; in a table, marginals are the row and column totals.",
      "Marginalize by summing/integrating out the other variable.",
      "Conditional $f_{X|Y}(x|y)=f_{X,Y}(x,y)/f_Y(y)$; example gives $\\mathbb{P}(X\\lt 1/4\\mid Y=1/3)=11/80$.",
      "Independence means the joint factors: $f_{X,Y}=f_X f_Y$."
    ]
  });

  // 5) Multivariate distributions and iid samples
  B({
    id: "aos-ch2-multivariate-iid",
    chapter: "Chapter 2",
    title: "Multivariate distributions and iid samples",
    tagline: "Stacking variables into a vector generalizes everything; an iid sample is the foundation of statistics.",
    sections: [
      { h: "Random vectors", body:
        "<p>Let $X = (X_1, \\dots, X_n)$ be a <strong>random vector</strong> with pdf $f(x_1, \\dots, x_n)$. Marginals and conditionals are defined just as in the bivariate case. The variables are independent if, for every $A_1,\\dots,A_n$, $\\mathbb{P}(X_1 \\in A_1, \\dots, X_n \\in A_n) = \\prod_{i=1}^n \\mathbb{P}(X_i \\in A_i)$. It suffices to check that the joint density factors: $f(x_1,\\dots,x_n) = \\prod_{i=1}^n f_{X_i}(x_i)$.</p>" },
      { h: "IID samples", body:
        "<p>If $X_1, \\dots, X_n$ are independent and each has the same marginal CDF $F$, they are <strong>iid</strong> (independent and identically distributed), written $X_1, \\dots, X_n \\sim F$ (or $\\sim f$ if there is a density). Such a collection is also called a <strong>random sample of size $n$ from $F$</strong>. The author notes that much of statistical theory and practice begins with iid observations — this is the case studied in detail when the book turns to inference.</p>" }
    ],
    takeaways: [
      "A random vector bundles $X_1,\\dots,X_n$; independence means the joint pdf factors into the marginals.",
      "IID = independent and identically distributed from a common $F$.",
      "An iid collection is a random sample of size $n$ from $F$, the starting point for statistics."
    ]
  });

  // 6) Multinomial and multivariate Normal
  B({
    id: "aos-ch2-multinomial-mvnormal",
    chapter: "Chapter 2",
    title: "Multinomial and multivariate Normal",
    tagline: "The Multinomial extends the Binomial to many categories; the multivariate Normal extends the Normal to a vector.",
    sections: [
      { h: "Multinomial", body:
        "<p>The <strong>Multinomial</strong> is the multivariate Binomial. Draw balls of $k$ colors from an urn where color $j$ has probability $p_j$ (with $p_j \\ge 0$ and $\\sum_{j=1}^k p_j = 1$). Draw $n$ times independently with replacement and let $X_j$ count the balls of color $j$, so $X = (X_1, \\dots, X_k)$ and $n = \\sum_{j=1}^k X_j$. Then $X \\sim \\text{Multinomial}(n, p)$ with</p>" +
        "<p>$f(x) = \\dbinom{n}{x_1 \\dots x_k} p_1^{x_1} \\cdots p_k^{x_k}$, where $\\dbinom{n}{x_1 \\dots x_k} = \\dfrac{n!}{x_1! \\cdots x_k!}.$</p>" +
        "<p>Lemma 2.42: each component's marginal is Binomial, $X_j \\sim \\text{Binomial}(n, p_j)$.</p>" },
      { h: "Multivariate Normal", body:
        "<p>The univariate Normal has $\\mu$ and $\\sigma$; the multivariate version replaces $\\mu$ with a vector and $\\sigma$ with a matrix $\\Sigma$. Stack $Z_1, \\dots, Z_k \\sim N(0,1)$ independently into $Z$; then $Z \\sim N(0, I)$ — the <strong>standard multivariate Normal</strong> — with density $f(z) = \\dfrac{1}{(2\\pi)^{k/2}} \\exp\\!\\left\\{-\\dfrac{1}{2} z^T z\\right\\}$.</p>" +
        "<p>More generally $X \\sim N(\\mu, \\Sigma)$ has $f(x;\\mu,\\Sigma) = \\dfrac{1}{(2\\pi)^{k/2}|\\Sigma|^{1/2}} \\exp\\!\\left\\{-\\dfrac{1}{2}(x-\\mu)^T \\Sigma^{-1}(x-\\mu)\\right\\}$, where $\\Sigma$ is a $k \\times k$ symmetric positive-definite matrix and $|\\Sigma|$ its determinant. Setting $\\mu=0$, $\\Sigma=I$ recovers the standard case.</p>" },
      { h: "Properties of the multivariate Normal", body:
        "<p>Theorem 2.43: if $Z \\sim N(0,I)$ and $X = \\mu + \\Sigma^{1/2} Z$ then $X \\sim N(\\mu,\\Sigma)$; conversely $\\Sigma^{-1/2}(X-\\mu) \\sim N(0,I)$. Partitioning $X = (X_a, X_b)$, Theorem 2.44 gives:</p>" +
        "<ul class='steps'>" +
        "<li>The marginal is itself Normal: $X_a \\sim N(\\mu_a, \\Sigma_{aa})$.</li>" +
        "<li>The conditional of $X_b$ given $X_a = x_a$ is Normal with mean $\\mu_b + \\Sigma_{ba}\\Sigma_{aa}^{-1}(x_a - \\mu_a)$ and covariance $\\Sigma_{bb} - \\Sigma_{ba}\\Sigma_{aa}^{-1}\\Sigma_{ab}$.</li>" +
        "<li>For a vector $a$, the linear combination $a^T X \\sim N(a^T \\mu, a^T \\Sigma a)$.</li>" +
        "<li>$V = (X-\\mu)^T \\Sigma^{-1}(X-\\mu) \\sim \\chi^2_k$.</li>" +
        "</ul>" }
    ],
    takeaways: [
      "Multinomial$(n,p)$ counts outcomes across $k$ categories; each count is marginally Binomial$(n,p_j)$.",
      "Standard multivariate Normal $N(0,I)$ stacks independent $N(0,1)$ variables.",
      "$N(\\mu,\\Sigma)$ uses a positive-definite covariance matrix $\\Sigma$.",
      "Marginals, conditionals, and linear combinations of a multivariate Normal are again Normal."
    ]
  });

  // 7) Transformations of random variables
  B({
    id: "aos-ch2-transformations",
    chapter: "Chapter 2",
    title: "Transformations of random variables",
    tagline: "When $Y=r(X)$, the discrete case rebins probabilities; the continuous case works through the CDF.",
    sections: [
      { h: "Discrete transformations", body:
        "<p>If $Y = r(X)$, the discrete mass function follows directly: $f_Y(y) = \\mathbb{P}(r(X)=y) = \\mathbb{P}(X \\in r^{-1}(y))$, summing the probability of every $x$ that maps to $y$. Example: let $\\mathbb{P}(X=-1)=\\mathbb{P}(X=1)=1/4$ and $\\mathbb{P}(X=0)=1/2$, and let $Y = X^2$. Because $-1$ and $1$ both map to $1$:</p>" +
        "<table class='extable'><thead><tr><th class='num'>$y$</th><th class='num'>$f_Y(y)$</th></tr></thead><tbody>" +
        "<tr><td class='num'>0</td><td class='num'>1/2</td></tr>" +
        "<tr><td class='num'>1</td><td class='num'>1/2</td></tr>" +
        "</tbody></table>" +
        "<p>$Y$ takes fewer values than $X$ because the transformation is not one-to-one.</p>" },
      { h: "Three steps for the continuous case", body:
        "<p>The continuous case is harder; the book gives a three-step recipe. (1) For each $y$ form the set $A_y = \\{x : r(x) \\le y\\}$. (2) Find the CDF $F_Y(y) = \\mathbb{P}(r(X) \\le y) = \\int_{A_y} f_X(x)\\,dx$. (3) Differentiate: $f_Y(y) = F_Y'(y)$.</p>" +
        "<p>Example: let $f_X(x)=e^{-x}$ for $x \\gt 0$, so $F_X(x)=1-e^{-x}$, and set $Y = \\log X$. Then $A_y = \\{x : x \\le e^y\\}$, giving $F_Y(y) = F_X(e^y) = 1 - e^{-e^y}$, hence $f_Y(y) = e^y e^{-e^y}$ for $y \\in \\mathbb{R}$. When $r$ is strictly monotone with inverse $s = r^{-1}$, this simplifies to $f_Y(y) = f_X(s(y))\\left|\\dfrac{ds(y)}{dy}\\right|$.</p>" },
      { h: "Worked example: Y = X squared", body:
        "<p>Let $X \\sim \\text{Uniform}(-1,3)$, so $f_X(x)=1/4$ on $(-1,3)$, and find the pdf of $Y=X^2$. Here $Y$ ranges over $(0,9)$, and the shape of $A_y$ changes at $y=1$:</p>" +
        "<ul class='steps'>" +
        "<li>For $0 \\lt y \\lt 1$: $A_y = [-\\sqrt{y}, \\sqrt{y}]$, so $F_Y(y) = \\int_{-\\sqrt{y}}^{\\sqrt{y}} \\frac{1}{4}\\,dx = \\frac{1}{2}\\sqrt{y}$.</li>" +
        "<li>For $1 \\le y \\lt 9$: $A_y = [-1, \\sqrt{y}]$, so $F_Y(y) = \\int_{-1}^{\\sqrt{y}} \\frac{1}{4}\\,dx = \\frac{1}{4}(\\sqrt{y}+1)$.</li>" +
        "<li>Differentiating gives $f_Y(y) = \\frac{1}{4\\sqrt{y}}$ for $0 \\lt y \\lt 1$ and $f_Y(y) = \\frac{1}{8\\sqrt{y}}$ for $1 \\lt y \\lt 9$, and $0$ otherwise.</li>" +
        "</ul>" +
        "<p>For transformations of several variables, $Z = r(X,Y)$ (e.g. $X+Y$, $X/Y$, $\\max\\{X,Y\\}$), the same three steps apply with $A_z = \\{(x,y) : r(x,y) \\le z\\}$ and a double integral.</p>" },
      { h: "Worked example: sum of two uniforms", body:
        "<p>Example 2.48 applies the same recipe to $Y=X_1+X_2$ with independent $X_1,X_2\\sim\\text{Uniform}(0,1)$. The joint density is 1 on the unit square, and $A_y$ is the part of the square below the line $x_2=y-x_1$.</p>" +
        "<ul class='steps'>" +
        "<li>For $0\\lt y\\le1$, $A_y$ is a triangle with vertices $(0,0)$, $(y,0)$, and $(0,y)$, so $F_Y(y)=y^2/2$.</li>" +
        "<li>For $1\\lt y\\lt2$, $A_y$ is the square minus the upper-right triangle with side length $2-y$, so $F_Y(y)=1-(2-y)^2/2$.</li>" +
        "<li>Differentiating gives $f_Y(y)=y$ for $0\\le y\\le1$, $f_Y(y)=2-y$ for $1\\le y\\le2$, and 0 otherwise.</li>" +
        "</ul>" +
        "<table class='extable'><thead><tr><th>range</th><th>$F_Y(y)$</th><th>$f_Y(y)$</th></tr></thead><tbody><tr><td class='row-h'>$y\\lt0$</td><td>0</td><td>0</td></tr><tr><td class='row-h'>$0\\le y\\lt1$</td><td>$y^2/2$</td><td>$y$</td></tr><tr><td class='row-h'>$1\\le y\\lt2$</td><td>$1-(2-y)^2/2$</td><td>$2-y$</td></tr><tr><td class='row-h'>$y\\ge2$</td><td>1</td><td>0</td></tr></tbody></table>" }
    ],
    takeaways: [
      "Discrete: $f_Y(y)=\\mathbb{P}(X\\in r^{-1}(y))$; $Y=X^2$ can collapse values (here to $1/2, 1/2$).",
      "Continuous recipe: build $A_y$, integrate $f_X$ to get $F_Y$, then differentiate.",
      "Monotone $r$ shortcut: $f_Y(y)=f_X(s(y))|ds/dy|$.",
      "For $X\\sim\\text{Uniform}(-1,3)$, $Y=X^2$ has a two-piece density splitting at $y=1$.",
      "The sum of two independent Uniform(0,1) variables has triangular density: $y$ then $2-y$."
    ]
  });

  // Charts (Figure 2.4 standard Normal; Binomial pmf for the ten-flip example)
  window.CODEVIZ["aos-ch2-discrete-distributions"] = {
    charts: [
      { type: "bars", title: "Binomial(n=10, p=0.5) probability function",
        interpret: "The ten-flip head-count from the chapter peaks at 5 heads and is symmetric — the most likely outcome is half heads.",
        labels: ["0","1","2","3","4","5","6","7","8","9","10"],
        values: [0.001, 0.010, 0.044, 0.117, 0.205, 0.246, 0.205, 0.117, 0.044, 0.010, 0.001] }
    ],
    code: "# Binomial probability function for the chapter's ten-flip head count.\nfrom math import comb\n\nn, p = 10, 0.5\npmf = [comb(n, x) * p**x * (1-p)**(n-x) for x in range(n+1)]\nprint([round(v, 3) for v in pmf])\n# [0.001, 0.01, 0.044, 0.117, 0.205, 0.246, 0.205, 0.117, 0.044, 0.01, 0.001]\n\n# Geometric and Poisson normalization checks from the book:\n# sum_{k>=1} p(1-p)^{k-1} = 1;  sum_x e^{-lambda} lambda^x/x! = 1"
  };
  window.CODEVIZ["aos-ch2-continuous-distributions"] = {
    charts: [
      { type: "line", title: "Density of a standard Normal (Figure 2.4)",
        interpret: "The standard Normal pdf is a symmetric bell centered at 0; almost all of its mass sits between -3 and 3.",
        xlabel: "z", ylabel: "phi(z)",
        series: [ { name: "phi(z)", color: "#4ea1ff", points: [
          [-3, 0.004], [-2.5, 0.018], [-2, 0.054], [-1.5, 0.130], [-1, 0.242], [-0.5, 0.352],
          [0, 0.399], [0.5, 0.352], [1, 0.242], [1.5, 0.130], [2, 0.054], [2.5, 0.018], [3, 0.004] ] } ] }
    ],
    code: "# Normal-table computations in Example 2.17, plus values for Figure 2.4.\nimport math\nfrom statistics import NormalDist\n\nmu, var = 3, 5\nsigma = math.sqrt(var)\nz = (1 - mu) / sigma\nprint(z)                                      # -0.894427...\nprint(1 - NormalDist().cdf(z))                # 0.81445, book rounds to 0.81\nq_std = NormalDist().inv_cdf(0.2)             # -0.84162 from table\nprint(mu + sigma * q_std)                     # 1.118..., book: 1.1181\n\nzs = [-3,-2.5,-2,-1.5,-1,-0.5,0,0.5,1,1.5,2,2.5,3]\nprint([round(math.exp(-z*z/2)/math.sqrt(2*math.pi), 3) for z in zs])"
  };
  window.CODEVIZ["aos-ch2-bivariate-marginal-conditional"] = {
    charts: [
      { type: "scatter", title: "Non-rectangular support and event from Figure 2.5",
        interpret: "The density in Example 2.22 is positive above y=x^2; the event X >= Y is the wedge between y=x^2 and y=x for x from 0 to 1.",
        xlabel: "x", ylabel: "y",
        groups: [],
        lines: [
          { color: "#4ea1ff", points: [[-1,1],[-0.75,0.563],[-0.5,0.25],[-0.25,0.063],[0,0],[0.25,0.063],[0.5,0.25],[0.75,0.563],[1,1]] },
          { color: "#ffb454", dash: true, points: [[0,0],[0.25,0.25],[0.5,0.5],[0.75,0.75],[1,1]] }
        ] }
    ],
    code: "# Example 2.22: normalize c*x^2*y on x^2 <= y <= 1, then integrate X >= Y.\nfrom fractions import Fraction\n\nc = Fraction(21, 4)            # since 1 = c * 4/21\nprob = Fraction(3, 20)         # (21/4) * int_0^1 int_{x^2}^x x^2*y dy dx\nprint(c)                       # 21/4\nprint(float(prob), prob)        # 0.15, 3/20\n\n# Example 2.32: independent densities f(x)=2x on [0,1]\nprint(Fraction(1, 6))           # P(X+Y <= 1)"
  };
  window.CODEVIZ["aos-ch2-transformations"] = {
    charts: [
      { type: "line", title: "Density of Y = X1 + X2 for independent Uniform(0,1) variables",
        interpret: "Example 2.48 differentiates the area CDF to get a triangular pdf: it rises to 1 at y=1, then falls to 0 at y=2.",
        xlabel: "y", ylabel: "f_Y(y)",
        series: [ { name: "f_Y(y)", color: "#7ee787", points: [
          [0,0], [0.25,0.25], [0.5,0.5], [0.75,0.75], [1,1], [1.25,0.75], [1.5,0.5], [1.75,0.25], [2,0] ] } ] },
      { type: "scatter", title: "Boundary line for the set A_y in Figure 2.6",
        interpret: "For y between 0 and 1, A_y is a triangle below x2=y-x1; for y between 1 and 2, it is the unit square minus an upper-right triangle.",
        xlabel: "x1", ylabel: "x2",
        groups: [],
        lines: [
          { color: "#4ea1ff", points: [[0,0],[1,0],[1,1],[0,1],[0,0]] },
          { color: "#ffb454", dash: true, points: [[0,0.75],[0.75,0]] },
          { color: "#c89bff", dash: true, points: [[0.25,1],[1,0.25]] }
        ] }
    ],
    code: "# Example 2.48: sum of two independent Uniform(0,1) variables.\ndef F_sum(y):\n    if y < 0: return 0\n    if y < 1: return y*y/2\n    if y < 2: return 1 - (2-y)**2/2\n    return 1\n\ndef f_sum(y):\n    if 0 <= y <= 1: return y\n    if 1 <= y <= 2: return 2-y\n    return 0\n\nprint(F_sum(0.5), f_sum(0.5))   # 0.125, 0.5\nprint(F_sum(1.5), f_sum(1.5))   # 0.875, 0.5"
  };
})();
