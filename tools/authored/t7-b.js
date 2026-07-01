module.exports = {
  "math-07-11": {
    id: "math-07-11",
    title: "The dominated convergence theorem",
    tagline: "Dominated convergence lets limits pass through integrals when one trustworthy bound keeps the sequence under control.",
    connections: {
      buildsOn: ["Lebesgue integration", "almost everywhere convergence", "measurable functions"],
      leadsTo: ["$L^p$ spaces", "expectation as an integral", "interchanging limits and expectations"],
      usedWith: ["Fatou's lemma", "monotone convergence", "absolute integrability", "almost everywhere convergence"]
    },
    motivation:
      "<p>You already know that finite sums are friendly: if $a_{n,k}\\to a_k$ for $k=1,2,3$, then $\\sum_k a_{n,k}\\to\\sum_k a_k$. Integrals feel like infinite sums, so it is tempting to do the same thing.</p>" +
      "<p>The catch is that mass can escape or spike. The <b>dominated convergence theorem</b> says the tempting move is safe when every function in the sequence stays below one integrable guardrail. The guardrail is the teacher in the room: it prevents wild behavior while the pointwise limit settles down.</p>",
    definition:
      "<p>Let $(X,\\mathcal F,\\mu)$ be a measure space. Suppose $f_n:X\\to\\mathbb R$ are measurable, $f_n(x)\\to f(x)$ for almost every $x$, and there is an integrable function $g$ with $|f_n(x)|\\le g(x)$ for every $n$ and almost every $x$. Then $f$ is integrable and $$\\lim_{n\\to\\infty}\\int_X f_n\\,d\\mu=\\int_X f\\,d\\mu.$$</p>" +
      "<p>The reason the conclusion is believable is that $|f_n-f|\\le |f_n|+|f|\\le2g$ almost everywhere, and the region where $|f_n-f|$ is large shrinks pointwise. Integrability of $g$ turns that shrinking into small total area.</p>" +
      "<p><b>Assumptions that matter:</b> convergence is almost everywhere, not necessarily everywhere; the same dominating function $g$ must work for all $n$; $g$ must have finite integral; and measurability is required so the integrals are defined.</p>",
    worked: {
      problem: "Let $f_n(x)=x^n$ on $[0,1]$ with Lebesgue measure. Use dominated convergence to find $\\lim_{n\\to\\infty}\\int_0^1 x^n\\,dx$.",
      skills: ["pointwise limits", "dominating functions", "Lebesgue integrals"],
      strategy: "Find the pointwise limit first, then exhibit one integrable bound that covers every $x^n$.",
      steps: [
        { do: "Evaluate the pointwise limit for $0\\le x<1$", result: "$x^n\\to0$", why: "powers of a number less than 1 shrink to zero" },
        { do: "Evaluate the endpoint", result: "$1^n=1$", why: "the endpoint does not shrink" },
        { do: "Name the almost everywhere limit", result: "$f(x)=0$ almost everywhere on $[0,1]$", why: "the single point $x=1$ has Lebesgue measure zero" },
        { do: "Choose a dominating function", result: "$g(x)=1$", why: "$0\\le x^n\\le1$ for all $x\\in[0,1]$" },
        { do: "Check integrability of the bound", result: "$\\int_0^1 1\\,dx=1$", why: "the interval has finite length" },
        { do: "Apply dominated convergence", result: "$\\lim_{n\\to\\infty}\\int_0^1 x^n\\,dx=\\int_0^1 0\\,dx$", why: "the hypotheses are satisfied" },
        { do: "Compute the limiting integral", result: "$0$", why: "the integral of the zero function is zero" }
      ],
      verify: "Direct computation gives $\\int_0^1x^n\\,dx=1/(n+1)$, which also tends to $0$.",
      answer: "The limit is $0$.",
      connects: "Dominated convergence turns pointwise convergence plus one integrable ceiling into convergence of integrals."
    },
    practice: [
      { problem: "Use dominated convergence to compute $\\lim_{n\\to\\infty}\\int_0^2 \\dfrac{x}{n+x}\\,dx$.", steps: [
        { do: "Find the pointwise limit", result: "$\\dfrac{x}{n+x}\\to0$", why: "the denominator grows with $n$ while $x$ is fixed" },
        { do: "Bound the integrand", result: "$0\\le\\dfrac{x}{n+x}\\le1$", why: "$x\\le n+x$ for $x\\ge0$" },
        { do: "Choose the dominator", result: "$g(x)=1$ on $[0,2]$", why: "one bound works for every $n$" },
        { do: "Check integrability", result: "$\\int_0^2 1\\,dx=2$", why: "finite interval" },
        { do: "Pass the limit through the integral", result: "$\\int_0^2 0\\,dx=0$", why: "dominated convergence applies" }
      ], answer: "The limit is $0$." },
      { problem: "For $f_n(x)=\\dfrac{\\sin(nx)}{n}$ on $[0,\\pi]$, show $\\int_0^\\pi f_n\\,dx\\to0$.", steps: [
        { do: "Find the pointwise limit", result: "$\\dfrac{\\sin(nx)}{n}\\to0$", why: "$|\\sin(nx)|\\le1$ and $1/n\\to0$" },
        { do: "Bound the absolute value", result: "$|f_n(x)|\\le\\dfrac1n\\le1$", why: "the largest possible sine magnitude is 1" },
        { do: "Choose a common dominator", result: "$g(x)=1$", why: "it dominates all $n\\ge1$" },
        { do: "Check the area of the dominator", result: "$\\int_0^\\pi1\\,dx=\\pi$", why: "finite measure interval" },
        { do: "Apply the theorem", result: "$\\lim\\int_0^\\pi f_n\\,dx=\\int_0^\\pi0\\,dx=0$", why: "all hypotheses hold" }
      ], answer: "The integrals converge to $0$." },
      { problem: "Let $f_n(x)=e^{-x}\\mathbf1_{[0,n]}(x)$ on $[0,\\infty)$. Find $\\lim_n\\int_0^\\infty f_n(x)\\,dx$.", steps: [
        { do: "Find the pointwise limit", result: "$f_n(x)\\to e^{-x}$", why: "every fixed $x$ eventually lies in $[0,n]$" },
        { do: "Bound the sequence", result: "$0\\le f_n(x)\\le e^{-x}$", why: "the indicator is at most 1" },
        { do: "Check integrability", result: "$\\int_0^\\infty e^{-x}\\,dx=1$", why: "the exponential tail has finite area" },
        { do: "Apply dominated convergence", result: "$\\lim_n\\int f_n\\,dx=\\int_0^\\infty e^{-x}\\,dx$", why: "the bound is integrable" },
        { do: "Compute the integral", result: "$1$", why: "antiderivative is $-e^{-x}$" }
      ], answer: "The limit is $1$." },
      { problem: "Explain why dominated convergence does not apply to $f_n(x)=n\\mathbf1_{(0,1/n)}(x)$ on $[0,1]$, and compute the integrals.", steps: [
        { do: "Find the pointwise limit for $x>0$", result: "$f_n(x)\\to0$", why: "eventually $x>1/n$" },
        { do: "Check the point $x=0$", result: "$f_n(0)=0$", why: "the interval is open at 0" },
        { do: "Compute each integral", result: "$\\int_0^1 n\\mathbf1_{(0,1/n)}\\,dx=n\\cdot(1/n)=1$", why: "height times width" },
        { do: "Compare with the limit integral", result: "$\\int_0^1 0\\,dx=0$", why: "pointwise limit is zero" },
        { do: "Identify the failure", result: "no integrable common bound can exist", why: "DCT would force the integrals to converge to 0" }
      ], answer: "The theorem does not apply; every integral equals $1$ even though the pointwise limit is $0$." },
      { problem: "If $|\\ell_n(z)|\\le 2e^{-z}$ for losses on $[0,\\infty)$ and $\\ell_n(z)\\to\\ell(z)$ pointwise, justify $\\int \\ell_n\\,dz\\to\\int\\ell\\,dz$ and give the bound's total mass.", steps: [
        { do: "Name the dominator", result: "$g(z)=2e^{-z}$", why: "the problem gives $|\\ell_n|\\le g$" },
        { do: "Check integrability", result: "$\\int_0^\\infty2e^{-z}\\,dz=2$", why: "twice the unit exponential integral" },
        { do: "Use the pointwise convergence", result: "$\\ell_n(z)\\to\\ell(z)$", why: "this is the convergence hypothesis" },
        { do: "Apply dominated convergence", result: "$\\lim_n\\int_0^\\infty\\ell_n(z)\\,dz=\\int_0^\\infty\\ell(z)\\,dz$", why: "one integrable envelope controls all losses" },
        { do: "State the numerical envelope mass", result: "$2$", why: "the total allowed absolute area is finite" }
      ], answer: "The integral limit is justified by DCT, and the dominator has integral $2$." }
    ],
    applications: [
      { title: "Interchanging validation averages and model limits", background: "When models are trained longer, their loss functions may settle pointwise. DCT tells you when the averaged validation loss also settles.", numbers: "If $|L_n(x)|\\le0.2$ on $1000$ equally weighted cases and $L_n(x_i)\\to L(x_i)$, the average limit is safe; the dominating average is at most $0.2$." },
      { title: "Monte Carlo with bounded payoffs", background: "Financial simulations often approximate a payoff by smoother versions. A fixed cap prevents rare simulated paths from dominating the limit.", numbers: "A payoff clipped between $0$ and $50$ dollars has $g=50$ on a probability space, so $\\mathbb E[g]=50<\\infty$." },
      { title: "Truncated exponential tails", background: "Data pipelines often truncate continuous features for computation, then let the cutoff grow. DCT proves the truncated integral returns to the full one.", numbers: "$\\int_0^{10}e^{-x}\\,dx=1-e^{-10}\\approx0.999955$, already within $0.000045$ of $1$." },
      { title: "Numerical quadrature refinement", background: "Approximating an integrand by bounded step functions is common in scientific computing. A common envelope lets the refined areas converge to the true area.", numbers: "If approximations to $\\sin x$ on $[0,\\pi]$ are bounded by $1$, the envelope area is $\\pi\\approx3.142$." },
      { title: "Safe limit of expected gradients", background: "Optimization sometimes studies gradients as batch size or smoothing changes. DCT justifies moving the limit inside an expectation when gradients are uniformly bounded.", numbers: "If $|g_n(Z)|\\le4$ always, then $\\mathbb E|4|=4$, so the expected-gradient limit is valid under pointwise convergence." },
      { title: "A warning about spikes", background: "The classic spike example shows why the bound matters. Pointwise convergence alone can hide fixed area in thinner and taller regions.", numbers: "$n\\mathbf1_{(0,1/n)}$ has area $1$ for every $n$, although it is $0$ at each fixed positive $x$ eventually." }
    ],
    applicationsClose: "The shared pattern is safe exchange: a pointwise limit may enter an integral only when an integrable envelope keeps every approximation honest.",
    takeaways: [
      "Dominated convergence needs pointwise almost everywhere convergence and one integrable common bound.",
      "The theorem concludes both integrability of the limit and convergence of the integrals.",
      "Finite intervals with uniformly bounded functions are friendly DCT settings.",
      "Tall moving spikes show why domination cannot be skipped."
    ]
  },

  "math-07-12": {
    id: "math-07-12",
    title: "Lᵖ spaces",
    tagline: "$L^p$ spaces measure functions by the size of their $p$th-power average, turning functions into geometric objects.",
    connections: {
      buildsOn: ["Lebesgue integration", "absolute value", "equivalence almost everywhere"],
      leadsTo: ["Hilbert spaces", "convergence in norm", "probability moments"],
      usedWith: ["norms", "inner products", "Hölder's inequality", "Minkowski's inequality"]
    },
    motivation:
      "<p>You already know how to measure a vector such as $(3,4)$: its Euclidean length is $5$. A function can also have a size, but its coordinates are spread across a continuum.</p>" +
      "<p>An <b>$L^p$ space</b> gives a careful answer: raise the function's magnitude to the $p$th power, integrate, then take a $p$th root. This is how analysis turns functions into points you can compare, approximate, and optimize.</p>",
    definition:
      "<p>For $1\\le p<\\infty$, the space $L^p(X,\\mathcal F,\\mu)$ consists of measurable functions $f$ with $$\\|f\\|_p=\\left(\\int_X |f|^p\\,d\\mu\\right)^{1/p}<\\infty,$$ where functions equal almost everywhere are treated as the same element. For $p=\\infty$, $\\|f\\|_\\infty$ is the essential supremum, the smallest almost-everywhere bound.</p>" +
      "<p>The formula is a genuine norm for $p\\ge1$: nonnegative size is clear, scaling follows from $|cf|^p=|c|^p|f|^p$, and the triangle inequality is Minkowski's inequality. For $p=2$, the norm comes from the inner product $\\langle f,h\\rangle=\\int f h\\,d\\mu$ in real spaces.</p>" +
      "<p><b>Assumptions that matter:</b> functions are measurable; equality is almost everywhere equality; $p\\ge1$ is needed for the norm triangle inequality; and the measure space determines which functions have finite $L^p$ size.</p>",
    worked: {
      problem: "On $[0,1]$, compute $\\|f\\|_1$, $\\|f\\|_2$, and $\\|f\\|_\\infty$ for $f(x)=2x$.",
      skills: ["norm definitions", "power integrals", "essential supremum"],
      strategy: "Use the definition for each norm and remember that $L^\\infty$ asks for the largest almost-everywhere size.",
      steps: [
        { do: "Set up the $L^1$ norm", result: "$\\|f\\|_1=\\int_0^1 2x\\,dx$", why: "$2x\\ge0$ on $[0,1]$" },
        { do: "Integrate for $L^1$", result: "$\\|f\\|_1=1$", why: "$\\int_0^1 2x\\,dx=x^2\\big|_0^1$" },
        { do: "Set up the $L^2$ norm", result: "$\\|f\\|_2=\\left(\\int_0^1 (2x)^2\\,dx\\right)^{1/2}$", why: "square, integrate, then take a square root" },
        { do: "Integrate the square", result: "$\\int_0^1 4x^2\\,dx=\\dfrac43$", why: "$\\int_0^1x^2\\,dx=1/3$" },
        { do: "Take the square root", result: "$\\|f\\|_2=\\dfrac{2}{\\sqrt3}$", why: "the norm is the root of the integral" },
        { do: "Find the essential supremum", result: "$\\|f\\|_\\infty=2$", why: "$2x$ reaches 2 at the endpoint and is bounded by 2 almost everywhere" }
      ],
      verify: "$\\|f\\|_1=1<\\|f\\|_2\\approx1.155<\\|f\\|_\\infty=2$ is reasonable because larger $p$ emphasizes the high end of the function.",
      answer: "$\\|f\\|_1=1$, $\\|f\\|_2=2/\\sqrt3$, and $\\|f\\|_\\infty=2$.",
      connects: "$L^p$ norms turn a whole function into one size number, with $p$ controlling how strongly peaks matter."
    },
    practice: [
      { problem: "On $[0,2]$, compute $\\|3\\|_1$ and $\\|3\\|_2$ for the constant function $f(x)=3$.", steps: [
        { do: "Set up $L^1$", result: "$\\|3\\|_1=\\int_0^2 3\\,dx$", why: "absolute value of 3 is 3" },
        { do: "Compute $L^1$", result: "$6$", why: "height 3 times length 2" },
        { do: "Set up $L^2$", result: "$\\|3\\|_2=\\left(\\int_0^2 9\\,dx\\right)^{1/2}$", why: "square the function" },
        { do: "Compute the squared integral", result: "$18$", why: "$9\\cdot2=18$" },
        { do: "Take the square root", result: "$3\\sqrt2$", why: "$\\sqrt{18}=3\\sqrt2$" }
      ], answer: "$\\|3\\|_1=6$ and $\\|3\\|_2=3\\sqrt2$." },
      { problem: "On $[0,1]$, compute $\\|x^2\\|_3$.", steps: [
        { do: "Apply the definition", result: "$\\|x^2\\|_3=\\left(\\int_0^1 |x^2|^3\\,dx\\right)^{1/3}$", why: "use $p=3$" },
        { do: "Simplify the power", result: "$|x^2|^3=x^6$", why: "$x^2\\ge0$" },
        { do: "Integrate", result: "$\\int_0^1x^6\\,dx=\\dfrac17$", why: "power rule" },
        { do: "Take the cube root", result: "$\\|x^2\\|_3=(1/7)^{1/3}$", why: "the $L^3$ norm uses a third root" },
        { do: "Approximate", result: "$\\|x^2\\|_3\\approx0.523$", why: "$7^{-1/3}\\approx0.523$" }
      ], answer: "$\\|x^2\\|_3=7^{-1/3}\\approx0.523$." },
      { problem: "For $f=\\mathbf1_{[0,0.25]}$ on $[0,1]$, compute $\\|f\\|_p$ for finite $p\\ge1$ and $\\|f\\|_\\infty$.", steps: [
        { do: "Raise the indicator to the $p$th power", result: "$|f|^p=\\mathbf1_{[0,0.25]}$", why: "0 and 1 are unchanged by powers" },
        { do: "Integrate", result: "$\\int_0^1 |f|^p\\,dx=0.25$", why: "the interval length is one quarter" },
        { do: "Take the $p$th root", result: "$\\|f\\|_p=(0.25)^{1/p}$", why: "definition of the finite $L^p$ norm" },
        { do: "Find the essential supremum", result: "$\\|f\\|_\\infty=1$", why: "the largest nonzero value is 1" },
        { do: "Check one example", result: "$\\|f\\|_2=0.5$", why: "$\\sqrt{0.25}=0.5$" }
      ], answer: "$\\|f\\|_p=0.25^{1/p}$ for finite $p$, and $\\|f\\|_\\infty=1$." },
      { problem: "On $[1,\\infty)$, decide whether $f(x)=1/x$ belongs to $L^1$ and $L^2$.", steps: [
        { do: "Test $L^1$", result: "$\\int_1^\\infty x^{-1}\\,dx$", why: "integrate the absolute value" },
        { do: "Evaluate the $L^1$ integral", result: "$\\infty$", why: "the harmonic tail diverges" },
        { do: "Test $L^2$", result: "$\\int_1^\\infty x^{-2}\\,dx$", why: "square $1/x$" },
        { do: "Evaluate the $L^2$ integral", result: "$1$", why: "$\\int_1^\\infty x^{-2}\\,dx=1$" },
        { do: "Take the square root", result: "$\\|f\\|_2=1$", why: "the squared integral is 1" }
      ], answer: "$1/x$ is not in $L^1([1,\\infty))$ but is in $L^2([1,\\infty))$ with norm $1$." },
      { problem: "For errors $e=[1,-2,2,-1]$ with uniform weight $1/4$, compute the empirical $L^1$ and $L^2$ sizes.", steps: [
        { do: "Average absolute errors", result: "$(1+2+2+1)/4=1.5$", why: "empirical $L^1$ is mean absolute error" },
        { do: "Square the errors", result: "$[1,4,4,1]$", why: "empirical $L^2$ uses squared magnitudes" },
        { do: "Average the squares", result: "$(1+4+4+1)/4=2.5$", why: "uniform weights sum to one" },
        { do: "Take the square root", result: "$\\sqrt{2.5}\\approx1.581$", why: "root mean squared error" },
        { do: "Compare the sizes", result: "$1.581>1.5$", why: "$L^2$ emphasizes the larger errors" }
      ], answer: "Empirical $L^1=1.5$ and empirical $L^2\\approx1.581$." }
    ],
    applications: [
      { title: "Mean absolute error", background: "$L^1$ loss is popular when robustness matters because it grows linearly with error instead of squaring outliers.", numbers: "Errors $2,-1,3$ have mean absolute error $(2+1+3)/3=2$." },
      { title: "Root mean squared error", background: "$L^2$ loss is central in least squares and Gaussian noise models. Squaring makes large errors more expensive.", numbers: "Errors $2,-1,3$ have RMSE $\\sqrt{(4+1+9)/3}=\\sqrt{14/3}\\approx2.160$." },
      { title: "Signal energy", background: "Engineering often treats $L^2$ norm squared as energy. A short pulse with larger amplitude can have the same energy as a longer smaller pulse.", numbers: "A signal equal to $4$ for $0.5$ seconds has energy $\\int 16\\,dt=8$." },
      { title: "Image difference norms", background: "Computer vision compares images by treating pixel differences as a finite function. Different $p$ values highlight different visual errors.", numbers: "Pixel errors $[0,10,0,0]$ have $L^1$ average $2.5$ and max norm $10$." },
      { title: "Regularization", background: "Model training adds penalties to control parameter size. The finite-dimensional version mirrors $L^p$ geometry.", numbers: "Weights $[3,4]$ have $L^2$ norm $5$ and $L^1$ norm $7$." },
      { title: "Probability moments", background: "A random variable belongs to $L^p$ exactly when its $p$th absolute moment is finite. This separates finite mean from finite variance.", numbers: "If $X$ is $0$ with probability $0.5$ and $4$ with probability $0.5$, then $\\|X\\|_2=\\sqrt{8}\\approx2.828$." }
    ],
    applicationsClose: "$L^p$ spaces give one vocabulary for errors, signals, images, weights, and random variables: choose the power that matches what size should mean.",
    takeaways: [
      "$\\|f\\|_p=(\\int|f|^p)^{1/p}$ for $1\\le p<\\infty$.",
      "Functions equal almost everywhere represent the same $L^p$ element.",
      "$L^2$ has inner-product geometry; larger $p$ values emphasize peaks more strongly.",
      "Finite measure spaces and infinite measure spaces can have very different membership behavior."
    ]
  },

  "math-07-13": {
    id: "math-07-13",
    title: "Product measures",
    tagline: "Product measures are how one-dimensional size becomes area, volume, and joint probability.",
    connections: {
      buildsOn: ["measure spaces", "sigma-algebras", "measurable rectangles"],
      leadsTo: ["Fubini's theorem", "joint distributions", "independence"],
      usedWith: ["Cartesian products", "measurable rectangles", "sections", "Lebesgue measure"]
    },
    motivation:
      "<p>You already know that a rectangle with width $3$ and height $4$ has area $12$. Product measure is the measure-theoretic version of that familiar multiplication.</p>" +
      "<p>The deeper gift is that it works beyond rectangles. Once we define size on $X$ and size on $Y$, product measure builds size on pairs $(x,y)$. That is the doorway to double integrals and joint probability models.</p>",
    definition:
      "<p>Given measure spaces $(X,\\mathcal A,\\mu)$ and $(Y,\\mathcal B,\\nu)$, the product sigma-algebra $\\mathcal A\\otimes\\mathcal B$ is generated by measurable rectangles $A\\times B$. The <b>product measure</b> $\\mu\\times\\nu$ is the measure satisfying $$(\\mu\\times\\nu)(A\\times B)=\\mu(A)\\nu(B)$$ for measurable $A$ and $B$, with standard existence and uniqueness for sigma-finite measures.</p>" +
      "<p>The rectangle rule determines more complicated sets by countable approximation: build the product sigma-algebra from rectangles, then extend the rectangle sizes consistently. This is the same idea that area is forced once you know all rectangle areas.</p>" +
      "<p><b>Assumptions that matter:</b> rectangles must use measurable sides; sigma-finiteness gives the clean uniqueness theorem; the product sigma-algebra is the measurable universe for pairs; and product measure is not automatically the same as every possible joint measure unless independence or construction says so.</p>",
    worked: {
      problem: "Let $\\mu$ be length on $[0,2]$ and $\\nu$ be counting measure on $\\{a,b,c\\}$. Find $(\\mu\\times\\nu)([0.5,1.5]\\times\\{a,c\\})$.",
      skills: ["rectangle rule", "counting measure", "product spaces"],
      strategy: "This set is a measurable rectangle, so multiply the two side measures.",
      steps: [
        { do: "Measure the interval side", result: "$\\mu([0.5,1.5])=1$", why: "length is $1.5-0.5$" },
        { do: "Measure the finite side", result: "$\\nu(\\{a,c\\})=2$", why: "counting measure counts two elements" },
        { do: "Apply the product rule", result: "$(\\mu\\times\\nu)([0.5,1.5]\\times\\{a,c\\})=1\\cdot2$", why: "product measure multiplies rectangle side measures" },
        { do: "Multiply", result: "$2$", why: "one unit of length for each of two labels" },
        { do: "Interpret the value", result: "total product size $2$", why: "it is like two copies of a length-one interval" }
      ],
      verify: "The set is exactly two horizontal copies of $[0.5,1.5]$, so total size $1+1=2$ agrees.",
      answer: "The product measure is $2$.",
      connects: "Product measure turns side sizes into sizes of paired outcomes."
    },
    practice: [
      { problem: "With length measure on both axes, compute $m_2([1,4]\\times[2,7])$.", steps: [
        { do: "Find the first side length", result: "$4-1=3$", why: "length of $[1,4]$" },
        { do: "Find the second side length", result: "$7-2=5$", why: "length of $[2,7]$" },
        { do: "Use the rectangle rule", result: "$m_2=3\\cdot5$", why: "Lebesgue area is product length on rectangles" },
        { do: "Multiply", result: "$15$", why: "area of the rectangle" },
        { do: "Attach units", result: "$15$ square units", why: "two length dimensions produce area" }
      ], answer: "The product measure is $15$." },
      { problem: "Let $P(A)=0.3$ and $Q(B)=0.8$. Under product probability, find $(P\\times Q)(A\\times B)$ and its complement in $X\\times Y$.", steps: [
        { do: "Apply the product rule", result: "$(P\\times Q)(A\\times B)=0.3\\cdot0.8$", why: "rectangle probabilities multiply under product measure" },
        { do: "Multiply", result: "$0.24$", why: "three tenths times eight tenths" },
        { do: "Write the total mass", result: "$(P\\times Q)(X\\times Y)=1$", why: "product of probability spaces is a probability space" },
        { do: "Compute the complement mass", result: "$1-0.24=0.76$", why: "complement inside the full product space" },
        { do: "Check the range", result: "$0.24$ and $0.76$ lie between $0$ and $1$", why: "probabilities must be valid" }
      ], answer: "The rectangle has probability $0.24$ and its complement has probability $0.76$." },
      { problem: "On $\\{0,1\\}\\times\\{0,1,2\\}$ with counting measure on both factors, find the product measure of the whole space.", steps: [
        { do: "Count the first factor", result: "$2$", why: "the set $\\{0,1\\}$ has two elements" },
        { do: "Count the second factor", result: "$3$", why: "the set $\\{0,1,2\\}$ has three elements" },
        { do: "Apply product measure", result: "$2\\cdot3$", why: "counting product counts ordered pairs" },
        { do: "Multiply", result: "$6$", why: "there are six pairs" },
        { do: "List the interpretation", result: "six grid points", why: "each first coordinate pairs with each second coordinate" }
      ], answer: "The product measure is $6$." },
      { problem: "For the triangle $T=\\{(x,y):0\\le y\\le x\\le1\\}$ in the unit square, compute its product Lebesgue measure using geometry.", steps: [
        { do: "Identify the containing square", result: "$[0,1]\\times[0,1]$", why: "both coordinates lie between 0 and 1" },
        { do: "Find the square area", result: "$1\\cdot1=1$", why: "rectangle rule" },
        { do: "Recognize the diagonal split", result: "the line $y=x$ divides the square into two congruent triangles", why: "symmetry swaps $x$ and $y$" },
        { do: "Take half the square area", result: "$1/2$", why: "one of two equal triangles" },
        { do: "State the measure", result: "$(m\\times m)(T)=1/2$", why: "product Lebesgue measure is area" }
      ], answer: "The triangle has product measure $1/2$." },
      { problem: "A dataset has $4$ users and $5$ ads. With counting measure, how many user-ad pairs are in the product space, and how many remain after removing $3$ invalid pairs?", steps: [
        { do: "Count users", result: "$4$", why: "first factor size" },
        { do: "Count ads", result: "$5$", why: "second factor size" },
        { do: "Compute product count", result: "$4\\cdot5=20$", why: "each user can pair with each ad" },
        { do: "Remove invalid pairs", result: "$20-3=17$", why: "subtract excluded measurable points" },
        { do: "Interpret", result: "$17$ valid pairs", why: "counting measure counts remaining pairs" }
      ], answer: "There are $20$ total pairs and $17$ valid pairs after exclusions." }
    ],
    applications: [
      { title: "Joint feature grids", background: "Feature engineering often crosses two categorical variables. Product counting measure explains the size of the grid.", numbers: "With $6$ regions and $4$ device types, the product grid has $6\\cdot4=24$ cells." },
      { title: "Area in image coordinates", background: "Digital and continuous images both live on product spaces: horizontal coordinate times vertical coordinate.", numbers: "A crop from $x=10$ to $50$ and $y=20$ to $70$ has area $40\\cdot50=2000$ square pixels." },
      { title: "Independent random choices", background: "Product probability models two independent experiments. Rectangle probabilities multiply because neither choice changes the other.", numbers: "If click probability is $0.2$ and conversion probability is $0.05$, the independent joint probability is $0.01$." },
      { title: "Batch and time axes", background: "Training logs often combine examples and time steps. Product measure counts total observations.", numbers: "A batch of $32$ sequences with $128$ tokens has $32\\cdot128=4096$ token positions." },
      { title: "Simulation design", background: "Parameter sweeps form product spaces of settings. Counting the product prevents underestimating computational cost.", numbers: "$5$ learning rates times $3$ batch sizes times $4$ seeds gives $60$ runs." },
      { title: "Continuous-discrete mixtures", background: "Many datasets pair a continuous time with a discrete label. Product measure combines length and count naturally.", numbers: "Three labels over a $10$ second interval have product size $3\\cdot10=30$ label-seconds." }
    ],
    applicationsClose: "Product measure is the quiet multiplication behind area, pair counts, joint probabilities, and crossed experimental designs.",
    takeaways: [
      "Product sigma-algebras are generated by measurable rectangles.",
      "Product measure satisfies $(\\mu\\times\\nu)(A\\times B)=\\mu(A)\\nu(B)$ on rectangles.",
      "Lebesgue area, finite pair counts, and independent joint probabilities are product measures in familiar clothing.",
      "A product measure is a construction; not every joint measure is automatically a product measure."
    ]
  },

  "math-07-14": {
    id: "math-07-14",
    title: "Fubini's theorem",
    tagline: "Fubini's theorem lets you compute a double integral one slice at a time.",
    connections: {
      buildsOn: ["Product measures", "Lebesgue integration", "measurable functions"],
      leadsTo: ["joint expectations", "marginalization", "conditional probability"],
      usedWith: ["Tonelli's theorem", "iterated integrals", "absolute integrability", "sections"]
    },
    motivation:
      "<p>You already know how to add a rectangular grid by rows or by columns and get the same total. Double integrals are the continuous version of that idea.</p>" +
      "<p><b>Fubini's theorem</b> says that, under the right integrability condition, a function on pairs can be integrated by first integrating over $y$ for each $x$, then over $x$, or the other way around. It turns a two-dimensional problem into two one-dimensional ones.</p>",
    definition:
      "<p>Let $(X,\\mathcal A,\\mu)$ and $(Y,\\mathcal B,\\nu)$ be sigma-finite measure spaces. If $f$ is integrable on the product space, meaning $\\int_{X\\times Y}|f|\\,d(\\mu\\times\\nu)<\\infty$, then $$\\int_{X\\times Y}f\\,d(\\mu\\times\\nu)=\\int_X\\left(\\int_Y f(x,y)\\,d\\nu(y)\\right)d\\mu(x)=\\int_Y\\left(\\int_X f(x,y)\\,d\\mu(x)\\right)d\\nu(y).$$</p>" +
      "<p>Tonelli's theorem is the nonnegative companion: if $f\\ge0$, the iterated integrals agree with the product integral even if the value is infinite. Fubini adds signed functions by requiring absolute integrability so positive and negative parts cannot cancel misleadingly.</p>" +
      "<p><b>Assumptions that matter:</b> the product spaces are sigma-finite; the function is measurable; signed functions need absolute integrability; and changing order without these conditions can give wrong or undefined results.</p>",
    worked: {
      problem: "Compute $\\int_0^2\\int_0^3 (x+2y)\\,dy\\,dx$ and interpret it as an integral over a rectangle.",
      skills: ["iterated integrals", "linearity", "product rectangles"],
      strategy: "Integrate the inner variable first, treating the outer variable as constant.",
      steps: [
        { do: "Integrate $x$ with respect to $y$", result: "$\\int_0^3 x\\,dy=3x$", why: "$x$ is constant during the inner integral" },
        { do: "Integrate $2y$ with respect to $y$", result: "$\\int_0^3 2y\\,dy=9$", why: "$y^2\\big|_0^3=9$" },
        { do: "Write the outer integral", result: "$\\int_0^2(3x+9)\\,dx$", why: "combine the inner results" },
        { do: "Integrate $3x$", result: "$\\int_0^2 3x\\,dx=6$", why: "$3x^2/2\\big|_0^2=6$" },
        { do: "Integrate $9$", result: "$\\int_0^2 9\\,dx=18$", why: "constant height times length" },
        { do: "Add the pieces", result: "$24$", why: "linearity of integration" }
      ],
      verify: "Reversing the order gives $\\int_0^3\\int_0^2(x+2y)\\,dx\\,dy=\\int_0^3(2+4y)\\,dy=24$.",
      answer: "The double integral is $24$.",
      connects: "Fubini lets the same total be computed by horizontal or vertical slices."
    },
    practice: [
      { problem: "Compute $\\int_0^1\\int_0^1 xy\\,dy\\,dx$.", steps: [
        { do: "Treat $x$ as constant", result: "$\\int_0^1 xy\\,dy=x\\int_0^1y\\,dy$", why: "inner integration is in $y$" },
        { do: "Integrate $y$", result: "$\\int_0^1y\\,dy=1/2$", why: "power rule" },
        { do: "Write the outer integral", result: "$\\int_0^1 x/2\\,dx$", why: "substitute the inner value" },
        { do: "Integrate $x/2$", result: "$1/4$", why: "$\\int_0^1x\\,dx=1/2$" },
        { do: "State the total", result: "$1/4$", why: "the product separates into two halves" }
      ], answer: "The integral is $1/4$." },
      { problem: "Compute the area of $T=\\{(x,y):0\\le y\\le x\\le1\\}$ by an iterated integral.", steps: [
        { do: "Write the area integral", result: "$\\int_0^1\\int_0^x1\\,dy\\,dx$", why: "for each $x$, $y$ runs from 0 to $x$" },
        { do: "Compute the inner integral", result: "$\\int_0^x1\\,dy=x$", why: "slice length is $x$" },
        { do: "Write the outer integral", result: "$\\int_0^1x\\,dx$", why: "sum the slice lengths" },
        { do: "Integrate", result: "$1/2$", why: "$x^2/2$ from 0 to 1" },
        { do: "Compare with geometry", result: "$1/2$", why: "the triangle is half the unit square" }
      ], answer: "The area is $1/2$." },
      { problem: "For $f(x,y)=6xy$ on $[0,1]^2$, verify that the total integral is $3/2$.", steps: [
        { do: "Set up the integral", result: "$\\int_0^1\\int_0^1 6xy\\,dy\\,dx$", why: "unit square" },
        { do: "Integrate in $y$", result: "$\\int_0^1 6xy\\,dy=3x$", why: "$6x\\cdot1/2=3x$" },
        { do: "Integrate in $x$", result: "$\\int_0^1 3x\\,dx=3/2$", why: "power rule" },
        { do: "Reverse mentally", result: "$\\int_0^1 3y\\,dy=3/2$", why: "symmetry gives the same result" },
        { do: "Confirm positivity", result: "$3/2>0$", why: "the integrand is nonnegative" }
      ], answer: "The total integral is $3/2$." },
      { problem: "Compute $\\int_0^1\\int_0^2 (4-x)\\,dy\\,dx$.", steps: [
        { do: "Integrate over $y$", result: "$\\int_0^2(4-x)\\,dy=2(4-x)$", why: "the integrand does not depend on $y$" },
        { do: "Simplify the slice", result: "$8-2x$", why: "distribute 2" },
        { do: "Integrate over $x$", result: "$\\int_0^1(8-2x)\\,dx$", why: "sum all slices" },
        { do: "Find the antiderivative", result: "$8x-x^2$", why: "integrate term by term" },
        { do: "Evaluate from 0 to 1", result: "$7$", why: "$8-1=7$" }
      ], answer: "The integral is $7$." },
      { problem: "A joint density is uniform on $[0,2]\\times[0,5]$. Find the probability of $X\\le1$ and $Y\\le2$.", steps: [
        { do: "Find the rectangle area", result: "$2\\cdot5=10$", why: "the full support has area 10" },
        { do: "Write the density", result: "$f(x,y)=1/10$", why: "uniform density integrates to 1" },
        { do: "Find the event area", result: "$1\\cdot2=2$", why: "$X\\le1$ and $Y\\le2$ form a smaller rectangle" },
        { do: "Multiply density by area", result: "$(1/10)\\cdot2=0.2$", why: "constant density over the event" },
        { do: "Check by iterated integral", result: "$\\int_0^1\\int_0^2 0.1\\,dy\\,dx=0.2$", why: "Fubini sums the rectangle slices" }
      ], answer: "The probability is $0.2$." }
    ],
    applications: [
      { title: "Marginalizing joint densities", background: "Probability models often start with a joint density and need a marginal density. Fubini is the theorem behind integrating out variables.", numbers: "If $f(x,y)=2$ on $0<y<x<1$, then $f_X(x)=\\int_0^x2\\,dy=2x$." },
      { title: "Expected loss over data and randomness", background: "Training may average over examples and augmentation noise. Fubini lets those averages be computed in either order when integrability holds.", numbers: "If loss is $x+z$ with $x,z\\sim U[0,1]$, the mean is $0.5+0.5=1$." },
      { title: "Image total brightness", background: "An image intensity function is integrated over horizontal and vertical coordinates. Row sums and column sums agree in total.", numbers: "A $10\\times20$ constant image with brightness $0.3$ has total brightness $10\\cdot20\\cdot0.3=60$." },
      { title: "Database aggregation order", background: "Grouped sums over two dimensions can be computed by users first or days first. Finite Fubini says the total is unchanged.", numbers: "Three users over four days with average count $5$ give total $3\\cdot4\\cdot5=60$." },
      { title: "Attention score summaries", background: "Attention matrices are functions on query-key pairs. Summing by rows or columns is an iterated sum on a finite product space.", numbers: "A $2\\times3$ matrix with all entries $1/6$ has total mass $6\\cdot1/6=1$." },
      { title: "Simulation averages", background: "Monte Carlo experiments may average over seeds and parameter settings. Fubini supports rearranging loops for efficiency.", numbers: "$4$ seeds times $5$ settings with average metric $0.7$ produce total metric sum $14$." }
    ],
    applicationsClose: "Fubini is the principled version of changing loop order: rows first or columns first, the integrable total is the same.",
    takeaways: [
      "Fubini applies to integrable functions on product measure spaces.",
      "It equates the product integral with either order of iterated integration.",
      "Tonelli covers nonnegative functions, even when the value may be infinite.",
      "Changing order without nonnegativity or absolute integrability can fail."
    ]
  },

  "math-07-15": {
    id: "math-07-15",
    title: "Probability spaces as measure spaces",
    tagline: "Probability is measure theory with total mass one, so events become measurable sets and probabilities become their sizes.",
    connections: {
      buildsOn: ["measure spaces", "sigma-algebras", "countable additivity"],
      leadsTo: ["random variables", "expectation", "independence"],
      usedWith: ["events", "complements", "unions", "conditional probability"]
    },
    motivation:
      "<p>You already know that probabilities add for disjoint outcomes: if a fair die lands in $\\{1,2\\}$ or in $\\{5\\}$, the probability is $2/6+1/6=3/6$.</p>" +
      "<p>A <b>probability space</b> says that this is not a special trick for dice. It is a measure space whose total size is $1$. The sample space is the universe, events are measurable sets, and probability is the measure assigned to those sets.</p>",
    definition:
      "<p>A probability space is a triple $(\\Omega,\\mathcal F,P)$ where $\\Omega$ is the sample space, $\\mathcal F$ is a sigma-algebra of events, and $P:\\mathcal F\\to[0,1]$ is a measure with $P(\\Omega)=1$. Countable additivity means that for disjoint events $A_1,A_2,\\ldots$, $$P\\left(\\bigcup_i A_i\\right)=\\sum_i P(A_i).$$</p>" +
      "<p>Basic probability rules are measure rules. Since $\\Omega=A\\cup A^c$ disjointly, $1=P(\\Omega)=P(A)+P(A^c)$, so $P(A^c)=1-P(A)$. Since $A\\cup B$ counts the overlap once, $P(A\\cup B)=P(A)+P(B)-P(A\\cap B)$.</p>" +
      "<p><b>Assumptions that matter:</b> only events in $\\mathcal F$ receive probabilities; total mass is exactly $1$; countable additivity is stronger than finite additivity; and probability zero does not always mean impossible in continuous spaces.</p>",
    worked: {
      problem: "A biased coin has $P(H)=0.7$ and $P(T)=0.3$. For two independent tosses, build the product probability and find $P(\\text{at least one head})$.",
      skills: ["sample spaces", "product probabilities", "complements"],
      strategy: "List the paired outcomes, use product probabilities, then use the complement for at least one head.",
      steps: [
        { do: "Write the two-toss sample space", result: "$\\{HH,HT,TH,TT\\}$", why: "each toss has two outcomes" },
        { do: "Compute $P(TT)$", result: "$0.3\\cdot0.3=0.09$", why: "independent toss probabilities multiply" },
        { do: "Identify the complement", result: "at least one head is $(TT)^c$", why: "the only way to have no heads is two tails" },
        { do: "Use the complement rule", result: "$1-P(TT)=1-0.09$", why: "probability space has total mass 1" },
        { do: "Subtract", result: "$0.91$", why: "the remaining outcomes have at least one head" }
      ],
      verify: "Direct addition gives $P(HH)+P(HT)+P(TH)=0.49+0.21+0.21=0.91$.",
      answer: "The probability of at least one head is $0.91$.",
      connects: "A probability calculation is a measure calculation on a sample space of events."
    },
    practice: [
      { problem: "On a fair die, let $A=\\{2,4,6\\}$ and $B=\\{5,6\\}$. Compute $P(A\\cup B)$.", steps: [
        { do: "Count $A$", result: "$|A|=3$", why: "three even faces" },
        { do: "Count $B$", result: "$|B|=2$", why: "two listed faces" },
        { do: "Find the overlap", result: "$A\\cap B=\\{6\\}$", why: "6 is the only common face" },
        { do: "Use inclusion-exclusion", result: "$P(A\\cup B)=3/6+2/6-1/6$", why: "subtract the overlap counted twice" },
        { do: "Simplify", result: "$4/6=2/3$", why: "four faces are in the union" }
      ], answer: "$P(A\\cup B)=2/3$." },
      { problem: "If $P(A)=0.35$, find $P(A^c)$ and explain the measure rule used.", steps: [
        { do: "Write the disjoint union", result: "$\\Omega=A\\cup A^c$", why: "every outcome is either in $A$ or not" },
        { do: "Use total mass", result: "$P(\\Omega)=1$", why: "probability spaces have total measure one" },
        { do: "Apply additivity", result: "$P(A)+P(A^c)=1$", why: "$A$ and $A^c$ are disjoint" },
        { do: "Substitute", result: "$0.35+P(A^c)=1$", why: "use the given probability" },
        { do: "Solve", result: "$P(A^c)=0.65$", why: "subtract 0.35" }
      ], answer: "$P(A^c)=0.65$." },
      { problem: "A uniform point is chosen from $[0,10]$. Find $P(2\\le X\\le5)$ and $P(X=4)$.", steps: [
        { do: "Find the event length", result: "$5-2=3$", why: "interval length gives favorable measure" },
        { do: "Find the total length", result: "$10$", why: "the full sample space is length 10" },
        { do: "Compute interval probability", result: "$3/10=0.3$", why: "uniform probability is length ratio" },
        { do: "Measure the single point", result: "$P(X=4)=0$", why: "a point has Lebesgue length zero" },
        { do: "Interpret", result: "zero probability but possible value", why: "continuous models can assign zero to individual outcomes" }
      ], answer: "$P(2\\le X\\le5)=0.3$ and $P(X=4)=0$." },
      { problem: "If disjoint events $A_1,A_2,A_3$ have probabilities $0.1,0.25,0.4$, find the probability of their union and of its complement.", steps: [
        { do: "Use disjoint additivity", result: "$P(A_1\\cup A_2\\cup A_3)=0.1+0.25+0.4$", why: "disjoint event probabilities add" },
        { do: "Add the probabilities", result: "$0.75$", why: "sum the three masses" },
        { do: "Use complement rule", result: "$1-0.75$", why: "total probability is one" },
        { do: "Subtract", result: "$0.25$", why: "remaining mass outside the union" },
        { do: "Check validity", result: "both values lie in $[0,1]$", why: "probabilities must be between zero and one" }
      ], answer: "The union has probability $0.75$ and its complement has probability $0.25$." },
      { problem: "In a classifier evaluation set, $P(\\text{positive})=0.2$ and $P(\\text{flagged}\\mid\\text{positive})=0.9$. If positives make up the conditioning event, what is $P(\\text{positive and flagged})$?", steps: [
        { do: "Write the conditional formula", result: "$P(F\\mid Pos)=P(F\\cap Pos)/P(Pos)$", why: "conditional probability rescales the measure" },
        { do: "Substitute known values", result: "$0.9=P(F\\cap Pos)/0.2$", why: "use the given probabilities" },
        { do: "Multiply by $0.2$", result: "$P(F\\cap Pos)=0.18$", why: "solve for the joint event" },
        { do: "Interpret the event", result: "positive and flagged", why: "intersection means both properties occur" },
        { do: "Check scale", result: "$0.18\\le0.2$", why: "the joint event cannot exceed the positive event" }
      ], answer: "$P(\\text{positive and flagged})=0.18$." }
    ],
    applications: [
      { title: "Dataset proportions", background: "Empirical distributions are probability measures on finite sample spaces. Each example receives mass $1/n$.", numbers: "In $200$ examples, $50$ positives have empirical probability $50/200=0.25$." },
      { title: "Continuous feature models", background: "Uniform and density-based models use length or area normalized to total mass one.", numbers: "Uniform on $[0,4]$ gives $P(1\\le X\\le3)=2/4=0.5$." },
      { title: "A/B testing", background: "Experiment outcomes are events in a probability space. Complements and intersections keep the bookkeeping exact.", numbers: "If conversion is $0.08$, non-conversion is $0.92$ by the complement rule." },
      { title: "Confusion matrices", background: "Classifier metrics are probabilities of intersections between predicted and true-label events.", numbers: "If $P(Y=1)=0.3$ and recall is $0.8$, then true-positive mass is $0.24$." },
      { title: "Reliability of independent services", background: "System reliability often models component failures as events. Independence uses product probability.", numbers: "If two services fail with probabilities $0.02$ and $0.03$ independently, both fail with probability $0.0006$." },
      { title: "Rare events with zero-looking mass", background: "Continuous probability reminds us that individual exact values can have probability zero while intervals matter.", numbers: "For a uniform arrival time over $60$ seconds, exactly $10.000$ seconds has probability $0$, but $10$ to $11$ seconds has probability $1/60$." }
    ],
    applicationsClose: "Probability spaces make every rule of probability a rule about measuring sets with total mass one.",
    takeaways: [
      "A probability space is a measure space $(\\Omega,\\mathcal F,P)$ with $P(\\Omega)=1$.",
      "Events are measurable sets; probabilities are their measures.",
      "Complement and union formulas follow from countable additivity.",
      "Continuous spaces can assign probability zero to individual possible outcomes."
    ]
  },

  "math-07-16": {
    id: "math-07-16",
    title: "Random variables, measure-theoretically",
    tagline: "A random variable is a measurable function, carrying probability from outcomes to numbers.",
    connections: {
      buildsOn: ["Probability spaces as measure spaces", "measurable functions", "preimages"],
      leadsTo: ["expectation as a Lebesgue integral", "distributions", "densities"],
      usedWith: ["pushforward measures", "Borel sets", "indicator functions", "distribution functions"]
    },
    motivation:
      "<p>You already use random variables as numbers produced by chance: die roll, click count, waiting time. Measure theory asks one careful question: what must be true so events like $X\\le3$ have probabilities?</p>" +
      "<p>The answer is simple and powerful. A random variable is a measurable function from outcomes to values. Measurability means numerical questions about the function pull back to legitimate events in the original probability space.</p>",
    definition:
      "<p>Given a probability space $(\\Omega,\\mathcal F,P)$, a real-valued <b>random variable</b> is a measurable function $X:\\Omega\\to\\mathbb R$, meaning $X^{-1}(B)=\\{\\omega:X(\\omega)\\in B\\}\\in\\mathcal F$ for every Borel set $B\\subseteq\\mathbb R$.</p>" +
      "<p>The distribution of $X$ is the pushforward measure $P_X$ on $\\mathbb R$ defined by $P_X(B)=P(X\\in B)$. This rule is forced by preimages: to measure a set of values, look at the outcomes that land there and use the original probability measure.</p>" +
      "<p><b>Assumptions that matter:</b> the codomain uses the Borel sigma-algebra unless stated otherwise; measurability is what makes $P(X\\in B)$ meaningful; two random variables equal almost surely have the same distribution; and a random variable need not be random as a function, only its input outcome is uncertain.</p>",
    worked: {
      problem: "A fair die has $\\Omega=\\{1,2,3,4,5,6\\}$ and $X(\\omega)=\\omega^2$. Find $P_X(\\{1,4,9\\})$ and $P(X>20)$.",
      skills: ["preimages", "pushforward distributions", "finite probability"],
      strategy: "Translate each value event back into die outcomes, then count those outcomes.",
      steps: [
        { do: "Find the preimage of $\\{1,4,9\\}$", result: "$X^{-1}(\\{1,4,9\\})=\\{1,2,3\\}$", why: "squaring gives values $1,4,9$ for die faces 1, 2, 3" },
        { do: "Count the preimage", result: "$3$ outcomes", why: "the die is finite and fair" },
        { do: "Compute the pushforward probability", result: "$P_X(\\{1,4,9\\})=3/6=1/2$", why: "measure the preimage in $\\Omega$" },
        { do: "Find outcomes with $X>20$", result: "$\\{5,6\\}$", why: "$5^2=25$ and $6^2=36$" },
        { do: "Compute the probability", result: "$P(X>20)=2/6=1/3$", why: "two favorable die faces" }
      ],
      verify: "The possible values are $1,4,9,16,25,36$, each with probability $1/6$, so the counted probabilities agree.",
      answer: "$P_X(\\{1,4,9\\})=1/2$ and $P(X>20)=1/3$.",
      connects: "Random-variable probabilities are ordinary event probabilities after taking preimages."
    },
    practice: [
      { problem: "A coin is tossed twice. Let $X$ be the number of heads. Find $P(X=1)$ and $P(X\\ge1)$.", steps: [
        { do: "List the sample space", result: "$\\{HH,HT,TH,TT\\}$", why: "two tosses produce four equally likely outcomes" },
        { do: "Find the preimage of $X=1$", result: "$\\{HT,TH\\}$", why: "exactly one head" },
        { do: "Compute $P(X=1)$", result: "$2/4=1/2$", why: "two favorable outcomes" },
        { do: "Find the preimage of $X\\ge1$", result: "$\\{HH,HT,TH\\}$", why: "all outcomes except $TT$" },
        { do: "Compute $P(X\\ge1)$", result: "$3/4$", why: "three favorable outcomes" }
      ], answer: "$P(X=1)=1/2$ and $P(X\\ge1)=3/4$." },
      { problem: "Let $X$ be uniform on $[0,10]$ and define $Y=\\mathbf1_{\\{X\\ge7\\}}$. Find $P(Y=1)$ and $P(Y=0)$.", steps: [
        { do: "Find the event $Y=1$", result: "$\\{X\\ge7\\}$", why: "the indicator equals 1 on its set" },
        { do: "Compute its length", result: "$10-7=3$", why: "uniform interval length" },
        { do: "Compute $P(Y=1)$", result: "$3/10=0.3$", why: "divide by total length 10" },
        { do: "Use the complement", result: "$P(Y=0)=1-0.3$", why: "indicator has only values 0 and 1" },
        { do: "Subtract", result: "$0.7$", why: "remaining probability mass" }
      ], answer: "$P(Y=1)=0.3$ and $P(Y=0)=0.7$." },
      { problem: "If $X$ has distribution $P(X=0)=0.2$, $P(X=2)=0.5$, $P(X=5)=0.3$, find $P(X\\in[1,4])$.", steps: [
        { do: "List values in the interval", result: "$2$", why: "only 2 lies between 1 and 4" },
        { do: "Take the preimage event", result: "$\\{\\omega:X(\\omega)=2\\}$", why: "value event pulls back to outcomes with value 2" },
        { do: "Use the distribution mass", result: "$P(X=2)=0.5$", why: "given directly" },
        { do: "Exclude other atoms", result: "$0$ and $5$ do not contribute", why: "they lie outside $[1,4]$" },
        { do: "State the probability", result: "$0.5$", why: "sum masses of included values" }
      ], answer: "$P(X\\in[1,4])=0.5$." },
      { problem: "For $X$ uniform on $[-1,1]$, let $Y=X^2$. Find $P(Y\\le1/4)$.", steps: [
        { do: "Translate the event", result: "$Y\\le1/4$ means $X^2\\le1/4$", why: "substitute $Y=X^2$" },
        { do: "Solve the inequality", result: "$-1/2\\le X\\le1/2$", why: "take square-root bounds" },
        { do: "Find favorable length", result: "$1$", why: "from $-0.5$ to $0.5$" },
        { do: "Find total length", result: "$2$", why: "from $-1$ to $1$" },
        { do: "Compute probability", result: "$1/2$", why: "uniform length ratio" }
      ], answer: "$P(Y\\le1/4)=1/2$." },
      { problem: "A score random variable $S$ is uniform on $[0,1]$, and a classifier outputs $C=\\mathbf1_{\\{S\\ge0.8\\}}$. Find the distribution of $C$.", steps: [
        { do: "Find $P(C=1)$", result: "$P(S\\ge0.8)$", why: "classification output is 1 above threshold" },
        { do: "Compute the upper interval length", result: "$1-0.8=0.2$", why: "uniform on $[0,1]$" },
        { do: "Assign mass to 1", result: "$P(C=1)=0.2$", why: "length equals probability" },
        { do: "Use complement for 0", result: "$P(C=0)=0.8$", why: "only two output values" },
        { do: "Write the pushforward distribution", result: "$P_C(0)=0.8,\\ P_C(1)=0.2$", why: "the output measure lives on $\\{0,1\\}$" }
      ], answer: "The distribution is $C=0$ with probability $0.8$ and $C=1$ with probability $0.2$." }
    ],
    applications: [
      { title: "Model scores as random variables", background: "A model score depends on a randomly drawn example. Measurability lets threshold events receive probabilities.", numbers: "If $S\\sim U[0,1]$, then $P(S\\ge0.9)=0.1$." },
      { title: "Labels as indicator variables", background: "Binary labels are random variables taking values 0 and 1. Their distribution is the class balance.", numbers: "A dataset with positive rate $0.12$ has $P(Y=1)=0.12$ and $P(Y=0)=0.88$." },
      { title: "Feature transformations", background: "Preprocessing maps raw outcomes into numeric features. The transformed feature is another random variable when the map is measurable.", numbers: "If age $A$ is uniform from $20$ to $60$, then $P(A/10\\le3)=P(A\\le30)=10/40=0.25$." },
      { title: "Pushforward distributions in simulation", background: "Simulators generate base randomness, then map it to outputs. The output distribution is a pushforward measure.", numbers: "If $U\\sim U[0,1]$ and $X=10U$, then $P(X\\le3)=P(U\\le0.3)=0.3$." },
      { title: "Ranking buckets", background: "A continuous score can be mapped to discrete buckets for monitoring. Bucket counts are probabilities of preimages.", numbers: "If scores are uniform and bucket high is $[0.8,1]$, high-bucket mass is $0.2$." },
      { title: "Loss as a random variable", background: "When the data point is random, the loss is random too. Expected risk begins by treating loss as a measurable function.", numbers: "If loss is $0$ on $70\\%$ of examples and $2$ on $30\\%$, then its distribution has masses $0.7$ at 0 and $0.3$ at 2." }
    ],
    applicationsClose: "A random variable is the bridge from uncertain outcomes to numerical events you can measure, model, and optimize.",
    takeaways: [
      "A real random variable is a measurable function $X:\\Omega\\to\\mathbb R$.",
      "Events about values, such as $X\\in B$, are preimages in the original sample space.",
      "The distribution of $X$ is the pushforward measure $P_X(B)=P(X\\in B)$.",
      "Indicators, scores, labels, losses, and transformed features are all random variables when measurable."
    ]
  },

  "math-07-17": {
    id: "math-07-17",
    title: "Expectation as a Lebesgue integral",
    tagline: "Expectation is the average value of a random variable, defined as an integral over the probability space.",
    connections: {
      buildsOn: ["Random variables, measure-theoretically", "Lebesgue integration", "probability spaces"],
      leadsTo: ["conditional expectation", "risk minimization", "Radon–Nikodym theorem"],
      usedWith: ["indicator functions", "linearity", "moments", "change of variables"]
    },
    motivation:
      "<p>You already compute averages: add values and divide by how many there are. If values have unequal probabilities, you weight them. If outcomes are continuous, the same idea needs an integral.</p>" +
      "<p>Measure theory gives the clean version: expectation is the Lebesgue integral of a random variable with respect to probability. This one definition covers finite tables, densities, indicators, and losses in machine learning.</p>",
    definition:
      "<p>For a random variable $X$ on $(\\Omega,\\mathcal F,P)$, the <b>expectation</b> is $$\\mathbb E[X]=\\int_\\Omega X\\,dP$$ when the integral is defined. For nonnegative $X$, the expectation may be infinite. For signed $X$, we require $\\mathbb E[X^+]<\\infty$ and $\\mathbb E[X^-]<\\infty$ for a finite expectation.</p>" +
      "<p>For an indicator, $\\mathbb E[\\mathbf1_A]=\\int \\mathbf1_A\\,dP=P(A)$ because the function is 1 on $A$ and 0 outside. Linearity follows from linearity of the Lebesgue integral: $\\mathbb E[aX+bY]=a\\mathbb E[X]+b\\mathbb E[Y]$ when the expectations exist.</p>" +
      "<p><b>Assumptions that matter:</b> $X$ must be measurable; finite expectation requires integrability of the positive and negative parts; probability supplies total mass one; and expectation is not the same as a typical value when tails are heavy.</p>",
    worked: {
      problem: "A random variable has $P(X=0)=0.2$, $P(X=3)=0.5$, and $P(X=10)=0.3$. Compute $\\mathbb E[X]$ and $\\mathbb E[X^2]$.",
      skills: ["discrete expectation", "moments", "weighted sums"],
      strategy: "Treat the integral as a weighted sum over the atoms of the distribution.",
      steps: [
        { do: "Write the expectation sum", result: "$\\mathbb E[X]=0\\cdot0.2+3\\cdot0.5+10\\cdot0.3$", why: "each value is weighted by its probability" },
        { do: "Multiply the terms", result: "$0+1.5+3$", why: "compute each contribution" },
        { do: "Add the contributions", result: "$\\mathbb E[X]=4.5$", why: "linearity of finite sums" },
        { do: "Write the second moment sum", result: "$\\mathbb E[X^2]=0^2\\cdot0.2+3^2\\cdot0.5+10^2\\cdot0.3$", why: "apply the function $x^2$ before averaging" },
        { do: "Compute the squared contributions", result: "$0+4.5+30$", why: "$9\\cdot0.5=4.5$ and $100\\cdot0.3=30$" },
        { do: "Add them", result: "$\\mathbb E[X^2]=34.5$", why: "sum all weighted squared values" }
      ],
      verify: "The mean $4.5$ lies between $0$ and $10$, and the second moment is larger because large values are squared.",
      answer: "$\\mathbb E[X]=4.5$ and $\\mathbb E[X^2]=34.5$.",
      connects: "Expectation is integration with probability weights."
    },
    practice: [
      { problem: "For a fair die roll $X$, compute $\\mathbb E[X]$.", steps: [
        { do: "Write the weighted sum", result: "$\\mathbb E[X]=\\sum_{k=1}^6 k\\cdot(1/6)$", why: "each face has probability $1/6$" },
        { do: "Factor out $1/6$", result: "$(1/6)(1+2+3+4+5+6)$", why: "common probability" },
        { do: "Add the faces", result: "$21$", why: "sum of integers from 1 to 6" },
        { do: "Divide by 6", result: "$21/6=3.5$", why: "average of the six faces" },
        { do: "Check location", result: "$3.5$", why: "it lies halfway between 1 and 6" }
      ], answer: "$\\mathbb E[X]=3.5$." },
      { problem: "If $X$ is uniform on $[0,4]$, compute $\\mathbb E[X]$ by integration.", steps: [
        { do: "Write the density", result: "$f(x)=1/4$ on $[0,4]$", why: "uniform total area is one" },
        { do: "Set up the integral", result: "$\\mathbb E[X]=\\int_0^4 x\\cdot\\dfrac14\\,dx$", why: "average value weighted by density" },
        { do: "Factor the constant", result: "$\\dfrac14\\int_0^4x\\,dx$", why: "linearity" },
        { do: "Integrate", result: "$\\dfrac14\\cdot8$", why: "$x^2/2$ from 0 to 4 is 8" },
        { do: "Simplify", result: "$2$", why: "the midpoint of the interval" }
      ], answer: "$\\mathbb E[X]=2$." },
      { problem: "For event $A$ with $P(A)=0.37$, compute $\\mathbb E[\\mathbf1_A]$.", steps: [
        { do: "Write the integral", result: "$\\mathbb E[\\mathbf1_A]=\\int\\mathbf1_A\\,dP$", why: "expectation is a Lebesgue integral" },
        { do: "Split by the event", result: "$1\\cdot P(A)+0\\cdot P(A^c)$", why: "the indicator is 1 on $A$ and 0 outside" },
        { do: "Substitute the probability", result: "$1\\cdot0.37+0$", why: "use $P(A)=0.37$" },
        { do: "Simplify", result: "$0.37$", why: "the zero term vanishes" },
        { do: "State the rule", result: "$\\mathbb E[\\mathbf1_A]=P(A)$", why: "indicators turn probabilities into expectations" }
      ], answer: "$\\mathbb E[\\mathbf1_A]=0.37$." },
      { problem: "If $X$ has mean $5$ and $Y$ has mean $-2$, compute $\\mathbb E[3X-4Y+7]$.", steps: [
        { do: "Use linearity", result: "$\\mathbb E[3X-4Y+7]=3\\mathbb E[X]-4\\mathbb E[Y]+7$", why: "expectation is linear" },
        { do: "Substitute means", result: "$3\\cdot5-4(-2)+7$", why: "use the given expectations" },
        { do: "Multiply", result: "$15+8+7$", why: "negative times negative is positive" },
        { do: "Add", result: "$30$", why: "sum the terms" },
        { do: "Note independence", result: "not needed", why: "linearity does not require independence" }
      ], answer: "$\\mathbb E[3X-4Y+7]=30$." },
      { problem: "A model loss is $0.1$ on $70\\%$ of examples, $0.6$ on $20\\%$, and $2.0$ on $10\\%$. Compute expected loss.", steps: [
        { do: "Write the weighted sum", result: "$0.1\\cdot0.7+0.6\\cdot0.2+2.0\\cdot0.1$", why: "expected loss averages by probability" },
        { do: "Compute the first contribution", result: "$0.07$", why: "$0.1\\cdot0.7=0.07$" },
        { do: "Compute the second contribution", result: "$0.12$", why: "$0.6\\cdot0.2=0.12$" },
        { do: "Compute the third contribution", result: "$0.20$", why: "$2.0\\cdot0.1=0.20$" },
        { do: "Add contributions", result: "$0.39$", why: "sum all probability-weighted losses" }
      ], answer: "The expected loss is $0.39$." }
    ],
    applications: [
      { title: "Risk minimization", background: "Supervised learning chooses parameters to minimize expected loss over the data distribution. Empirical risk is a finite approximation to this integral.", numbers: "Losses $0.2,0.4,0.9$ on three equally weighted examples have empirical risk $1.5/3=0.5$." },
      { title: "Click-through value", background: "Expected value combines possible revenue with probabilities. Ranking systems often optimize expected utility rather than raw score.", numbers: "A click worth $4$ dollars with click probability $0.03$ has expected value $0.12$ dollars." },
      { title: "Indicator metrics", background: "Accuracy is the expectation of an indicator for correct prediction. This makes metrics into integrals.", numbers: "If $87$ of $100$ predictions are correct, empirical $\\mathbb E[\\mathbf1_{correct}]=0.87$." },
      { title: "Mean squared error", background: "MSE is the expectation of squared prediction error, a second moment of the error random variable.", numbers: "Errors $1,-1,3$ have MSE $(1+1+9)/3=11/3\\approx3.667$." },
      { title: "Queue waiting time", background: "Operations teams use expected waiting time to summarize random service delays.", numbers: "Waiting times $1$ min with prob $0.5$ and $5$ min with prob $0.5$ have expectation $3$ min." },
      { title: "A/B experiment lift", background: "Expected outcome per user turns random conversions into a comparable metric across variants.", numbers: "If variant A converts at $0.10$ for $20$ dollars and B at $0.12$ for $18$ dollars, expected revenues are $2.00$ and $2.16$." }
    ],
    applicationsClose: "Expectation is the same averaging idea in every setting: integrate the value of interest against the probability measure that says how often it occurs.",
    takeaways: [
      "$\\mathbb E[X]=\\int_\\Omega X\\,dP$ is a Lebesgue integral.",
      "For discrete variables, expectation becomes a probability-weighted sum.",
      "Indicators satisfy $\\mathbb E[\\mathbf1_A]=P(A)$.",
      "Linearity of expectation comes from linearity of the integral and does not require independence."
    ]
  },

  "math-07-18": {
    id: "math-07-18",
    title: "The Radon–Nikodym theorem",
    tagline: "Radon–Nikodym says one measure can have a density with respect to another exactly when it never sees mass where the reference measure sees none.",
    connections: {
      buildsOn: ["measures", "absolute continuity", "Lebesgue integration"],
      leadsTo: ["densities", "conditional expectation", "change of measure"],
      usedWith: ["absolute continuity", "signed measures", "likelihood ratios", "Lebesgue decomposition"]
    },
    motivation:
      "<p>You already know a density idea from calculus: if mass along a line has density $3$ kilograms per meter over $2$ meters, total mass is $6$ kilograms. The density converts length into another measure.</p>" +
      "<p>The <b>Radon–Nikodym theorem</b> gives the general version. If a measure $\\nu$ is absolutely continuous with respect to a reference measure $\\mu$, then $\\nu$ can be recovered by integrating a measurable derivative $d\\nu/d\\mu$ against $\\mu$.</p>",
    definition:
      "<p>Let $(X,\\mathcal F)$ be a measurable space, and let $\\mu$ and $\\nu$ be sigma-finite measures. If $\\nu$ is absolutely continuous with respect to $\\mu$, written $\\nu\\ll\\mu$, meaning $\\mu(A)=0$ implies $\\nu(A)=0$, then there exists a measurable function $h\\ge0$ such that $$\\nu(A)=\\int_A h\\,d\\mu\\quad\\text{for every }A\\in\\mathcal F.$$ The function $h$ is unique up to $\\mu$-almost everywhere equality and is written $h=\\dfrac{d\\nu}{d\\mu}$.</p>" +
      "<p>The condition is necessary: if $\\nu(A)=\\int_A h\\,d\\mu$ and $\\mu(A)=0$, then the integral over $A$ is $0$, so $\\nu(A)=0$. The theorem says this necessary condition is also sufficient under sigma-finiteness.</p>" +
      "<p><b>Assumptions that matter:</b> sigma-finiteness keeps the theorem in its standard form; absolute continuity is required; the derivative is a function defined only up to $\\mu$-null sets; and atoms or singular mass can prevent a density with respect to the chosen reference measure.</p>",
    worked: {
      problem: "On $[0,2]$, let $\\mu$ be Lebesgue measure and define $\\nu(A)=\\int_A 3x\\,dx$. Find $d\\nu/d\\mu$ and compute $\\nu([0.5,1.5])$.",
      skills: ["Radon–Nikodym derivative", "absolute continuity", "density integration"],
      strategy: "Read the density from the defining integral, then integrate it over the requested set.",
      steps: [
        { do: "Compare with the theorem form", result: "$\\nu(A)=\\int_A h\\,d\\mu$", why: "Radon–Nikodym represents one measure by a density" },
        { do: "Identify the density", result: "$h(x)=3x$", why: "the integrand multiplying Lebesgue measure is $3x$" },
        { do: "Write the derivative", result: "$\\dfrac{d\\nu}{d\\mu}=3x$", why: "the derivative is the representing density" },
        { do: "Set up the interval measure", result: "$\\nu([0.5,1.5])=\\int_{0.5}^{1.5}3x\\,dx$", why: "measure the set by integrating the density" },
        { do: "Find the antiderivative", result: "$\\dfrac32x^2$", why: "integrate $3x$" },
        { do: "Evaluate the endpoints", result: "$\\dfrac32(1.5^2-0.5^2)=3$", why: "$2.25-0.25=2$ and $1.5\\cdot2=3$" }
      ],
      verify: "The density is nonnegative on $[0,2]$, so the measure of the interval should be positive; $3$ is plausible.",
      answer: "$d\\nu/d\\mu=3x$, and $\\nu([0.5,1.5])=3$.",
      connects: "Radon–Nikodym derivatives are generalized densities that convert a reference measure into a new measure."
    },
    practice: [
      { problem: "Let $\\nu(A)=\\int_A 2\\,dx$ on $[0,5]$ with respect to Lebesgue measure $\\mu$. Find $d\\nu/d\\mu$ and $\\nu([1,4])$.", steps: [
        { do: "Match the representation", result: "$\\nu(A)=\\int_A h\\,d\\mu$", why: "use the Radon–Nikodym form" },
        { do: "Identify $h$", result: "$h=2$", why: "the integrand is constant 2" },
        { do: "Write the derivative", result: "$d\\nu/d\\mu=2$", why: "density with respect to length" },
        { do: "Compute interval length", result: "$4-1=3$", why: "length of $[1,4]$" },
        { do: "Multiply by density", result: "$\\nu([1,4])=2\\cdot3=6$", why: "constant density over length 3" }
      ], answer: "$d\\nu/d\\mu=2$ and $\\nu([1,4])=6$." },
      { problem: "On $\\{a,b,c\\}$, let $\\mu(a)=1$, $\\mu(b)=2$, $\\mu(c)=1$ and $\\nu(a)=3$, $\\nu(b)=4$, $\\nu(c)=0$. Find $d\\nu/d\\mu$.", steps: [
        { do: "Use the finite-space formula", result: "$h(x)=\\nu(\\{x\\})/\\mu(\\{x\\})$", why: "integrals are weighted sums" },
        { do: "Compute at $a$", result: "$h(a)=3/1=3$", why: "ratio of point masses" },
        { do: "Compute at $b$", result: "$h(b)=4/2=2$", why: "ratio of point masses" },
        { do: "Compute at $c$", result: "$h(c)=0/1=0$", why: "zero target mass" },
        { do: "State the derivative", result: "$h=(3,2,0)$ on $(a,b,c)$", why: "these ratios reproduce $\\nu$ from $\\mu$" }
      ], answer: "$d\\nu/d\\mu(a)=3$, $d\\nu/d\\mu(b)=2$, and $d\\nu/d\\mu(c)=0$." },
      { problem: "Let $P$ and $Q$ on $\\{0,1\\}$ satisfy $P(0)=0.25$, $P(1)=0.75$, $Q(0)=0.5$, $Q(1)=0.5$. Find $dP/dQ$.", steps: [
        { do: "Check absolute continuity", result: "$Q$ gives positive mass to both points", why: "no $Q$-null point has positive $P$ mass" },
        { do: "Compute the ratio at 0", result: "$0.25/0.5=0.5$", why: "finite Radon–Nikodym derivative is a mass ratio" },
        { do: "Compute the ratio at 1", result: "$0.75/0.5=1.5$", why: "same formula" },
        { do: "Verify normalization", result: "$0.5\\cdot0.5+1.5\\cdot0.5=1$", why: "integrating $dP/dQ$ against $Q$ gives $P(\\Omega)$" },
        { do: "State the derivative", result: "$dP/dQ(0)=0.5,\\ dP/dQ(1)=1.5$", why: "these weights convert $Q$ into $P$" }
      ], answer: "$dP/dQ$ is $0.5$ at $0$ and $1.5$ at $1$." },
      { problem: "Explain why a point mass $\\delta_0$ on $[0,1]$ has no Radon–Nikodym derivative with respect to Lebesgue measure.", steps: [
        { do: "Find a Lebesgue-null set", result: "$A=\\{0\\}$", why: "single points have length zero" },
        { do: "Measure it under $\\delta_0$", result: "$\\delta_0(A)=1$", why: "the point mass is concentrated at 0" },
        { do: "Test absolute continuity", result: "$\\mu(A)=0$ but $\\delta_0(A)>0$", why: "absolute continuity requires null sets stay null" },
        { do: "Conclude failure", result: "$\\delta_0\\not\\ll\\mu$", why: "the necessary condition fails" },
        { do: "State the theorem consequence", result: "no $d\\delta_0/d\\mu$ exists", why: "Radon–Nikodym requires absolute continuity" }
      ], answer: "No derivative exists with respect to Lebesgue measure because the point mass is singular." },
      { problem: "If a reweighted data distribution has $dQ/dP=w$ with $w(x)=2$ on a group of $P$-probability $0.3$ and $w(x)=4/7$ elsewhere, verify $Q(\\Omega)=1$.", steps: [
        { do: "Find the complement probability", result: "$1-0.3=0.7$", why: "total $P$-mass is one" },
        { do: "Integrate $w$ on the group", result: "$2\\cdot0.3=0.6$", why: "constant weight over group mass" },
        { do: "Integrate $w$ outside", result: "$(4/7)\\cdot0.7=0.4$", why: "$0.7=7/10$ gives $4/10$" },
        { do: "Add the masses", result: "$0.6+0.4=1$", why: "total $Q$ mass" },
        { do: "Interpret", result: "$Q$ is a probability measure", why: "the density integrates to one" }
      ], answer: "The reweighted measure has total mass $1$." }
    ],
    applications: [
      { title: "Likelihood ratios", background: "Statistics compares two probability models by the density of one with respect to the other. This is exactly a Radon–Nikodym derivative.", numbers: "If $P(1)=0.75$ and $Q(1)=0.5$, the likelihood ratio at $1$ is $1.5$." },
      { title: "Importance sampling", background: "Monte Carlo estimates under one distribution can be computed using samples from another by weighting with $dP/dQ$.", numbers: "If $g(x)=10$ and weight $dP/dQ=0.2$ on a sample, its weighted contribution is $2$." },
      { title: "Dataset reweighting", background: "Fairness and domain adaptation often change the measure over examples while keeping the same support.", numbers: "A group with original mass $0.2$ weighted by $3$ contributes new unnormalized mass $0.6$." },
      { title: "Continuous densities", background: "A probability density is a Radon–Nikodym derivative with respect to Lebesgue measure.", numbers: "Density $f(x)=2x$ on $[0,1]$ gives $P([0.5,1])=\\int_{0.5}^1 2x\\,dx=0.75$." },
      { title: "Change of measure in risk", background: "Robust evaluation may ask how expected loss changes under a shifted population measure.", numbers: "Loss $4$ with weight $1.25$ contributes $5$ to the reweighted expectation integrand." },
      { title: "Detecting singular behavior", background: "If a new distribution places mass where the old one has none, density ratios cannot fix it. The support mismatch is structural.", numbers: "If training probability for a segment is $0$ but deployment probability is $0.05$, no finite $dP_{deploy}/dP_{train}$ exists there." }
    ],
    applicationsClose: "Radon–Nikodym derivatives are the rigorous form of density, likelihood ratio, and reweighting: one measure expressed through another.",
    takeaways: [
      "$\\nu\\ll\\mu$ means every $\\mu$-null set is also $\\nu$-null.",
      "Under sigma-finiteness, $\\nu\\ll\\mu$ gives a derivative $d\\nu/d\\mu$ with $\\nu(A)=\\int_A d\\nu/d\\mu\\,d\\mu$.",
      "The derivative is unique up to $\\mu$-almost everywhere equality.",
      "Point masses are not absolutely continuous with respect to Lebesgue measure."
    ]
  },

  "math-07-19": {
    id: "math-07-19",
    title: "Densities",
    tagline: "A density is local probability per unit measure, and integration turns it into actual probability.",
    connections: {
      buildsOn: ["Radon–Nikodym theorem", "Lebesgue integration", "probability spaces"],
      leadsTo: ["joint densities", "Bayes' rule", "continuous expectation"],
      usedWith: ["cumulative distribution functions", "change of variables", "normalization", "likelihood"]
    },
    motivation:
      "<p>You already know that a histogram bar with height $0.2$ over width $3$ has area $0.6$. Continuous probability works the same way: the height is not probability by itself; area is probability.</p>" +
      "<p>A <b>density</b> is the function that converts reference measure, usually length or area, into probability. It tells you where mass is concentrated, but you integrate it over a set to get probability.</p>",
    definition:
      "<p>A probability measure $P$ on $\\mathbb R$ has density $f$ with respect to Lebesgue measure $m$ if $$P(A)=\\int_A f(x)\\,dx$$ for every Borel set $A$. Equivalently, $f=dP/dm$. A valid density satisfies $f(x)\\ge0$ almost everywhere and $\\int_{\\mathbb R}f(x)\\,dx=1$.</p>" +
      "<p>The cumulative distribution function is recovered by integration: $F(t)=P(X\\le t)=\\int_{-\\infty}^t f(x)\\,dx$. When $F$ is differentiable at $t$, $F'(t)=f(t)$, so density is the local rate at which cumulative probability grows.</p>" +
      "<p><b>Assumptions that matter:</b> densities depend on the reference measure; density values can exceed $1$; probabilities are integrals over sets, not point heights; and individual points have probability zero for Lebesgue densities.</p>",
    worked: {
      problem: "Let $f(x)=2x$ on $0\\le x\\le1$ and $0$ otherwise. Verify it is a density and compute $P(0.5\\le X\\le1)$.",
      skills: ["normalization", "density integration", "continuous probability"],
      strategy: "Check nonnegativity and total area first, then integrate over the requested interval.",
      steps: [
        { do: "Check nonnegativity", result: "$2x\\ge0$ on $[0,1]$", why: "density cannot be negative" },
        { do: "Compute total integral", result: "$\\int_0^1 2x\\,dx=1$", why: "$x^2\\big|_0^1=1$" },
        { do: "Set up the event probability", result: "$P(0.5\\le X\\le1)=\\int_{0.5}^1 2x\\,dx$", why: "probability is area under density" },
        { do: "Use the antiderivative", result: "$x^2\\big|_{0.5}^1$", why: "integral of $2x$ is $x^2$" },
        { do: "Evaluate", result: "$1-0.25=0.75$", why: "square the endpoints" }
      ],
      verify: "The interval $[0.5,1]$ is half the length but has $75\\%$ of the probability because the density is higher near 1.",
      answer: "It is a valid density, and $P(0.5\\le X\\le1)=0.75$.",
      connects: "Density height becomes probability only after integration over a set."
    },
    practice: [
      { problem: "Find $c$ so $f(x)=c$ on $[2,6]$ is a density.", steps: [
        { do: "Require total area one", result: "$\\int_2^6 c\\,dx=1$", why: "valid densities integrate to 1" },
        { do: "Compute the interval length", result: "$6-2=4$", why: "support length" },
        { do: "Evaluate the integral", result: "$4c=1$", why: "constant height times width" },
        { do: "Solve for $c$", result: "$c=1/4$", why: "divide by 4" },
        { do: "Check nonnegativity", result: "$1/4\\ge0$", why: "density must be nonnegative" }
      ], answer: "$c=1/4$." },
      { problem: "For the density $f(x)=1/4$ on $[2,6]$, compute $P(3\\le X\\le5)$.", steps: [
        { do: "Find the event length", result: "$5-3=2$", why: "interval width" },
        { do: "Set up the integral", result: "$\\int_3^5 \\dfrac14\\,dx$", why: "area under constant density" },
        { do: "Compute the area", result: "$2\\cdot\\dfrac14=\\dfrac12$", why: "height times width" },
        { do: "Check against total support", result: "$2/4=1/2$", why: "event covers half the support length" },
        { do: "State probability", result: "$0.5$", why: "probability is area" }
      ], answer: "$P(3\\le X\\le5)=1/2$." },
      { problem: "Let $f(x)=3x^2$ on $[0,1]$. Compute the CDF $F(t)$ for $0\\le t\\le1$ and $P(X\\le0.5)$.", steps: [
        { do: "Set up the CDF", result: "$F(t)=\\int_0^t3x^2\\,dx$", why: "integrate density up to $t$" },
        { do: "Integrate", result: "$F(t)=t^3$", why: "antiderivative of $3x^2$ is $x^3$" },
        { do: "Substitute $t=0.5$", result: "$F(0.5)=0.5^3$", why: "CDF gives $P(X\\le0.5)$" },
        { do: "Compute the cube", result: "$0.125$", why: "$1/8=0.125$" },
        { do: "Interpret", result: "$12.5\\%$", why: "mass is concentrated near 1" }
      ], answer: "$F(t)=t^3$ on $[0,1]$, and $P(X\\le0.5)=0.125$." },
      { problem: "A density is $f(x)=0.5e^{-0.5x}$ for $x\\ge0$. Compute $P(X>4)$.", steps: [
        { do: "Use the exponential tail", result: "$P(X>4)=\\int_4^\\infty0.5e^{-0.5x}\\,dx$", why: "tail probability integrates the density" },
        { do: "Find the antiderivative", result: "$-e^{-0.5x}$", why: "derivative gives $0.5e^{-0.5x}$ after the negative sign" },
        { do: "Evaluate at infinity", result: "$0$", why: "$e^{-0.5x}\\to0$" },
        { do: "Evaluate at 4", result: "$e^{-2}$", why: "subtract the lower antiderivative value" },
        { do: "Approximate", result: "$e^{-2}\\approx0.135$", why: "standard exponential value" }
      ], answer: "$P(X>4)=e^{-2}\\approx0.135$." },
      { problem: "A model score density is $f(s)=2s$ on $[0,1]$. What threshold $t$ gives top-rate $P(S\\ge t)=0.36$?", steps: [
        { do: "Write the tail probability", result: "$P(S\\ge t)=\\int_t^1 2s\\,ds$", why: "top-rate is upper-tail mass" },
        { do: "Integrate", result: "$1-t^2$", why: "antiderivative is $s^2$" },
        { do: "Set equal to target", result: "$1-t^2=0.36$", why: "desired top-rate" },
        { do: "Solve for $t^2$", result: "$t^2=0.64$", why: "subtract from 1" },
        { do: "Take the positive root", result: "$t=0.8$", why: "score thresholds lie in $[0,1]$" }
      ], answer: "Threshold $t=0.8$ gives top-rate $0.36$." }
    ],
    applications: [
      { title: "Score calibration", background: "A score distribution density shows where model outputs concentrate. Threshold probabilities are tail integrals.", numbers: "For $f(s)=2s$, $P(S\\ge0.9)=1-0.81=0.19$." },
      { title: "Likelihood in continuous models", background: "Continuous observations have density values used in likelihoods. The value is not a probability of the exact point.", numbers: "Normal density can be about $0.399$ at its mean, while $P(X=0)=0$ for a continuous normal." },
      { title: "Arrival-time modeling", background: "Exponential densities model waiting times when events arrive at a constant average rate.", numbers: "With rate $2$, $P(T>1)=e^{-2}\\approx0.135$." },
      { title: "Histogram normalization", background: "Histograms estimate densities by making total bar area one, not total bar height one.", numbers: "A bin of width $0.5$ with density height $1.2$ has probability mass $0.6$." },
      { title: "Generative models", background: "Density models assign likelihood to data points and integrate to probabilities over regions.", numbers: "If a model density is roughly $0.04$ across a region of volume $10$, that region has probability about $0.4$." },
      { title: "Anomaly thresholds", background: "Tail probabilities from densities help flag rare measurements rather than relying only on raw values.", numbers: "If $P(X>8)=0.01$, then among $10,000$ independent cases you expect about $100$ exceedances." }
    ],
    applicationsClose: "Densities are local rates of probability; integration over the region is what turns those rates into masses you can act on.",
    takeaways: [
      "A density $f=dP/dm$ represents probability by $P(A)=\\int_A f\\,dm$.",
      "Densities must be nonnegative almost everywhere and integrate to one.",
      "Density values may exceed one; probabilities of intervals are areas.",
      "CDFs, likelihoods, thresholds, and tail probabilities are all density calculations."
    ]
  },

  "math-07-20": {
    id: "math-07-20",
    title: "Measure-theoretic foundations of probability",
    tagline: "The whole probability toolkit becomes one coherent system when events are sets, random variables are functions, and expectation is integration.",
    connections: {
      buildsOn: ["Probability spaces as measure spaces", "random variables", "expectation", "densities"],
      leadsTo: ["conditional expectation", "stochastic processes", "statistical learning theory"],
      usedWith: ["product measures", "Fubini's theorem", "Radon–Nikodym derivatives", "$L^p$ spaces"]
    },
    motivation:
      "<p>You have now seen the pieces: measure spaces assign sizes, probability spaces have total size one, random variables are measurable functions, and expectation is an integral. This capstone puts them into one working machine.</p>" +
      "<p>The payoff is practical. Modern ML constantly averages losses over data, pushes distributions through models, changes measures for reweighting, and integrates over joint spaces. Measure theory is the quiet grammar that keeps all of those operations honest.</p>",
    definition:
      "<p>The measure-theoretic foundation of probability starts with $(\\Omega,\\mathcal F,P)$, a measure space with $P(\\Omega)=1$. Events are sets in $\\mathcal F$. Random variables are measurable maps $X:\\Omega\\to S$ into another measurable space. Their distributions are pushforward measures $P_X(B)=P(X\\in B)$. Expectations are Lebesgue integrals $\\mathbb E[g(X)]=\\int_\\Omega g(X(\\omega))\\,dP(\\omega)=\\int_S g(x)\\,dP_X(x)$ when integrable.</p>" +
      "<p>Product measures build joint spaces, Fubini justifies iterated averaging, densities are Radon–Nikodym derivatives, and $L^p$ spaces describe finite moments and loss sizes. The identities fit together because each one is a statement about measurable functions and measures.</p>" +
      "<p><b>Assumptions that matter:</b> events must be measurable; functions must be measurable to define distributions and expectations; integrability conditions justify finite expectations and changing order of integration; and the choice of reference measure determines whether a density exists.</p>",
    worked: {
      problem: "A user is drawn uniformly from two groups: $G=A$ with probability $0.4$ and $G=B$ with probability $0.6$. Conditional on group, a click $Y\\in\\{0,1\\}$ has $P(Y=1\\mid A)=0.10$ and $P(Y=1\\mid B)=0.25$. A model predicts $p(A)=0.20$ and $p(B)=0.30$. Compute the joint probabilities, the overall click rate, and the expected squared error $(Y-p(G))^2$.",
      skills: ["joint probability", "expectation", "conditioning", "loss as random variable"],
      strategy: "Build the product-like joint table from group mass and conditional label probabilities, then integrate the click variable and loss over the four outcomes.",
      steps: [
        { do: "Compute $P(A,Y=1)$", result: "$0.4\\cdot0.10=0.04$", why: "joint mass is group mass times conditional click probability" },
        { do: "Compute $P(A,Y=0)$", result: "$0.4\\cdot0.90=0.36$", why: "non-click probability in group A is $0.90$" },
        { do: "Compute $P(B,Y=1)$", result: "$0.6\\cdot0.25=0.15$", why: "group B mass times its click probability" },
        { do: "Compute $P(B,Y=0)$", result: "$0.6\\cdot0.75=0.45$", why: "non-click probability in group B is $0.75$" },
        { do: "Check total mass", result: "$0.04+0.36+0.15+0.45=1$", why: "the four atoms form the whole probability space" },
        { do: "Compute overall click rate", result: "$\\mathbb E[Y]=0.04+0.15=0.19$", why: "the indicator $Y$ contributes only on click atoms" },
        { do: "Compute A-group loss contribution", result: "$0.04(1-0.20)^2+0.36(0-0.20)^2=0.0400$", why: "square the error on A click and non-click outcomes" },
        { do: "Compute B-group loss contribution", result: "$0.15(1-0.30)^2+0.45(0-0.30)^2=0.1140$", why: "square the error on B click and non-click outcomes" },
        { do: "Add expected losses", result: "$0.0400+0.1140=0.1540$", why: "expectation integrates loss over all atoms" }
      ],
      verify: "The click rate $0.19$ lies between the group rates $0.10$ and $0.25$, closer to $0.25$ because group B has more mass. The four joint probabilities sum to one.",
      answer: "The joint masses are $0.04,0.36,0.15,0.45$; the overall click rate is $0.19$; the expected squared error is $0.154$.",
      connects: "This single table uses events, random variables, pushforward distributions, and expectation as integration."
    },
    practice: [
      { problem: "A sample space has atoms $\\omega_1,\\omega_2,\\omega_3$ with probabilities $0.2,0.5,0.3$. A random variable $X$ has values $1,4,4$. Find the distribution of $X$ and $\\mathbb E[X]$.", steps: [
        { do: "Find mass at value 1", result: "$P_X(1)=0.2$", why: "only $\\omega_1$ maps to 1" },
        { do: "Find mass at value 4", result: "$P_X(4)=0.5+0.3=0.8$", why: "two atoms map to 4" },
        { do: "Check distribution mass", result: "$0.2+0.8=1$", why: "pushforward preserves total probability" },
        { do: "Compute expectation", result: "$1\\cdot0.2+4\\cdot0.8$", why: "integrate values against their distribution" },
        { do: "Add", result: "$3.4$", why: "$0.2+3.2=3.4$" }
      ], answer: "$P_X(1)=0.2$, $P_X(4)=0.8$, and $\\mathbb E[X]=3.4$." },
      { problem: "Let $X$ have density $f(x)=2x$ on $[0,1]$. Compute $P(X>0.6)$ and $\\mathbb E[X]$.", steps: [
        { do: "Set up the tail", result: "$P(X>0.6)=\\int_{0.6}^1 2x\\,dx$", why: "probability is density area" },
        { do: "Evaluate the tail", result: "$1-0.36=0.64$", why: "antiderivative is $x^2$" },
        { do: "Set up the expectation", result: "$\\mathbb E[X]=\\int_0^1 x\\cdot2x\\,dx$", why: "integrate value times density" },
        { do: "Simplify the integrand", result: "$\\int_0^1 2x^2\\,dx$", why: "multiply $x$ by $2x$" },
        { do: "Integrate", result: "$2/3$", why: "$2x^3/3$ from 0 to 1" }
      ], answer: "$P(X>0.6)=0.64$ and $\\mathbb E[X]=2/3$." },
      { problem: "Two independent Bernoulli variables have $P(X=1)=0.3$ and $P(Z=1)=0.4$. Find $P(X=1,Z=0)$ and $\\mathbb E[X+Z]$.", steps: [
        { do: "Find $P(Z=0)$", result: "$1-0.4=0.6$", why: "complement rule" },
        { do: "Use product probability", result: "$P(X=1,Z=0)=0.3\\cdot0.6$", why: "independence gives product measure" },
        { do: "Multiply", result: "$0.18$", why: "joint atom mass" },
        { do: "Use linearity of expectation", result: "$\\mathbb E[X+Z]=\\mathbb E[X]+\\mathbb E[Z]$", why: "expectation is linear" },
        { do: "Add Bernoulli means", result: "$0.3+0.4=0.7$", why: "a Bernoulli mean equals its success probability" }
      ], answer: "$P(X=1,Z=0)=0.18$ and $\\mathbb E[X+Z]=0.7$." },
      { problem: "A deployment distribution $Q$ reweights training distribution $P$ by $w=dQ/dP$. On two segments, $P(S_1)=0.75$, $P(S_2)=0.25$, and $w=0.8$ on $S_1$, $w=1.6$ on $S_2$. Verify $Q$ is a probability and compute $Q(S_2)$.", steps: [
        { do: "Compute $Q(S_1)$", result: "$0.8\\cdot0.75=0.60$", why: "integrate the density over $S_1$" },
        { do: "Compute $Q(S_2)$", result: "$1.6\\cdot0.25=0.40$", why: "integrate the density over $S_2$" },
        { do: "Check total mass", result: "$0.60+0.40=1$", why: "probability measures have total mass one" },
        { do: "Identify the requested mass", result: "$Q(S_2)=0.40$", why: "the second segment's reweighted mass" },
        { do: "Compare shift", result: "$0.40>0.25$", why: "weight $1.6$ increases segment $S_2$" }
      ], answer: "$Q$ is a probability measure and $Q(S_2)=0.40$." },
      { problem: "A binary classifier outputs score $S\\sim U[0,1]$ and predicts positive when $S\\ge0.7$. Let $C=\\mathbf1_{\\{S\\ge0.7\\}}$. Compute the distribution and expectation of $C$.", steps: [
        { do: "Translate $C=1$", result: "$\\{S\\ge0.7\\}$", why: "indicator preimage" },
        { do: "Compute its probability", result: "$1-0.7=0.3$", why: "uniform length on $[0,1]$" },
        { do: "Compute $C=0$ probability", result: "$0.7$", why: "complement mass" },
        { do: "Write the expectation", result: "$\\mathbb E[C]=1\\cdot0.3+0\\cdot0.7$", why: "integrate the indicator" },
        { do: "Simplify", result: "$0.3$", why: "indicator expectation equals event probability" }
      ], answer: "$P(C=1)=0.3$, $P(C=0)=0.7$, and $\\mathbb E[C]=0.3$." }
    ],
    applications: [
      { title: "Empirical risk as an integral", background: "Training loss is a random variable on the data-generating probability space. The empirical average is the finite measure version of expected risk.", numbers: "Five losses $0.2,0.1,0.5,0.4,0.3$ have empirical expectation $1.5/5=0.3$." },
      { title: "Distribution shift by density ratios", background: "When deployment differs from training but is absolutely continuous, Radon–Nikodym weights adjust expectations.", numbers: "A sample loss $0.8$ with weight $1.25$ contributes $1.0$ to an importance-weighted average." },
      { title: "Joint modeling of features and labels", background: "A supervised dataset samples pairs $(X,Y)$ from a joint probability measure. Marginals and conditionals come from measuring slices and projections.", numbers: "If $P(Y=1)=0.19$ in the worked table, then among $10,000$ users the expected clicks are $1900$." },
      { title: "Threshold metrics as indicator expectations", background: "Precision, recall, and selection rates are expectations of indicator functions or ratios of such expectations.", numbers: "If $P(S\\ge0.8)=0.12$, then the expected selected count in $5000$ cases is $600$." },
      { title: "Continuous score densities", background: "Score distributions are pushforward measures from examples through the model. Densities allow threshold and calibration calculations.", numbers: "For $f(s)=2s$, top $10\\%$ threshold solves $1-t^2=0.10$, so $t=\\sqrt{0.90}\\approx0.949$." },
      { title: "Fubini for nested averages", background: "ML systems often average over users, items, and random augmentations. Fubini explains when loop order can change without changing the target.", numbers: "A mean loss of $0.4$ over $100$ users and $20$ augmentations corresponds to total summed loss $0.4\\cdot2000=800$." },
      { title: "Moment control with $L^p$", background: "Generalization and stability arguments often require losses or gradients to have finite moments. $L^p$ spaces name those requirements.", numbers: "Gradient magnitudes $[1,2,5]$ have empirical $L^2$ size $\\sqrt{(1+4+25)/3}=\\sqrt{10}\\approx3.162$." }
    ],
    applicationsClose: "Measure-theoretic probability gives one durable language for ML: measurable data, distributions as measures, predictions as functions, and objectives as integrals.",
    takeaways: [
      "Probability is measure with total mass one; events are measurable sets.",
      "Random variables are measurable functions, and their distributions are pushforward measures.",
      "Expectation, risk, moments, and metrics are Lebesgue integrals.",
      "Product measures, Fubini, densities, and Radon–Nikodym derivatives make joint models and reweighting precise.",
      "The foundations matter because they state exactly when common ML operations are valid."
    ]
  }
};
