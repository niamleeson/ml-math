module.exports = {
  "math-08-01": {
    connectionsProse: "<p>This lesson begins the numerical analysis section with the way real numbers are stored on actual machines. Earlier algebra and calculus treated numbers as exact objects, but programs must encode them using finitely many bits. Floating point is the standard compromise: it keeps a fixed number of significant binary digits while allowing the exponent to move the scale. That representation prepares the ground for rounding error, machine epsilon, conditioning, and stability in the next lessons.</p>",
    motivation: "<p>Floating point is best understood as scientific notation in base two. A number is stored with a sign, a significand carrying the leading binary digits, and an exponent that shifts those digits left or right. This gives a very large range of magnitudes without storing every real number, which would be impossible.</p>" +
      "<p>The price is that representable numbers form a grid, not a continuum. Near one scale the grid is fine; at larger scales the grid spacing grows. That is why a decimal such as $0.15625$ can be exact while $128/255$ is generally not exact in binary. The representation is systematic and predictable, but it means every later numerical method must account for finite spacing.</p>",
    definition: "<p>IEEE 754 is a storage convention, not a theorem. A normalized floating-point value stores a sign bit, a binary significand, and an unbiased exponent, with value $$(-1)^s(1.f)_2 2^e$$.</p>" +
      "<p><b>Assumptions that matter:</b> The format has $p$ significant binary bits, so spacing near $2^k$ is $2^{k-(p-1)}$ because the significand grid has $p-1$ stored fractional bits.</p>",
    symbols: [
      { sym: "$s$", desc: "sign bit" },
      { sym: "$(1.f)_2$", desc: "normalized binary significand" },
      { sym: "$e$", desc: "unbiased exponent" },
      { sym: "$p$", desc: "significant binary bits" },
      { sym: "spacing", desc: "gap between adjacent representable values" }
    ],
    applications: [
      { title: "Exact binary weights", background: "Some decimal-looking fractions are exact because their denominator is a power of two.", numbers: "$0.15625=5/32=(1.01)_2 2^{-3}$ is stored exactly." },
      { title: "Float32 grid near 1", background: "Single precision has 24 significant binary bits, so adjacent values near one are separated by one last-bit step.", numbers: "spacing is $2^{-23}\\approx1.19\\times10^{-7}$." },
      { title: "Double range", background: "Exponent bits let floating point cover very small and very large ordinary magnitudes.", numbers: "exponent bits allow ordinary magnitudes roughly $10^{-308}$ to $10^{308}$." },
      { title: "Matrix kernels", background: "Dense matrix multiplication quickly turns representation details into billions of rounded operations.", numbers: "a $1024\\times1024$ matrix product performs about $2\\cdot1024^3=2.147$ billion floating operations." },
      { title: "Pixel normalization", background: "Dividing image channels by 255 usually creates binary fractions that are not exactly representable.", numbers: "$128/255\\approx0.502$ is not generally exact in binary." },
      { title: "Ties-to-even", background: "Round-to-nearest-even resolves exact halfway cases predictably.", numbers: "$1+2^{-53}$ lies halfway between double values and rounds to $1$." }
    ]
  },
  "math-08-02": {
    connectionsProse: "<p>Floating-point representation explains where the grid of machine numbers comes from. This lesson measures the size of that grid near $1$, where the spacing has a special name: machine epsilon. Once that spacing is known, rounding can be described with a small relative-error model. That model becomes the basic unit for later estimates of cancellation, stability, and finite-difference step size.</p>",
    motivation: "<p>Machine epsilon is the distance from $1$ to the next representable floating-point number. It is not a vague statement that computers are approximate; it is a precise spacing determined by the number of stored significant bits. In base two, each extra precision bit halves the spacing.</p>" +
      "<p>Rounding to nearest usually lands within half a spacing of the exact value. That half-spacing, called unit roundoff, is the scale used to model one rounded operation. Writing a rounded value as the exact value times $(1+\\delta)$ gives a compact way to carry rounding through formulas, as long as $|\\delta|$ is bounded by the unit roundoff.</p>",
    definition: "<p>In a base-2 format with precision $p$, the spacing from $1$ to the next representable value is $$\\epsilon_{\\text{mach}}=2^{1-p}$$ and round-to-nearest has unit roundoff $$u=\\epsilon_{\\text{mach}}/2$$.</p>" +
      "<p><b>Assumptions that matter:</b> The model uses normalized base-2 numbers near $1$ and one rounded operation written as $\\operatorname{fl}(x)=x(1+\\delta)$ with $|\\delta|\\le u$.</p>",
    symbols: [
      { sym: "$p$", desc: "precision in significant bits" },
      { sym: "$\\epsilon_{\\text{mach}}$", desc: "next-after-one spacing" },
      { sym: "$u$", desc: "unit roundoff" },
      { sym: "$\\operatorname{fl}(x)$", desc: "rounded value" },
      { sym: "$\\delta$", desc: "relative rounding error" }
    ],
    derivation: [
      { do: "In a base-2 format with precision $p$, write numbers in $[1,2)$ with significands $1.b_2\\dots b_p$.", result: "the last stored bit has place value $2^{-(p-1)}$", why: "the leading $1$ is followed by $p-1$ fractional bits" },
      { do: "Change only the last stored bit.", result: "the next representable spacing near $1$ is $2^{-(p-1)}$", why: "adjacent grid points differ by one last-bit unit" },
      { do: "Name that spacing machine epsilon.", result: "$\\epsilon_{\\text{mach}}=2^{1-p}$", why: "this is the distance from $1$ to the next representable number" },
      { do: "Round to the nearest grid point.", result: "$u=\\epsilon_{\\text{mach}}/2$", why: "nearest rounding moves at most half a gap" },
      { do: "Write one rounded result as exact value times a small factor.", result: "$\\operatorname{fl}(x)=x(1+\\delta)$ with $|\\delta|\\le u$", why: "relative error is bounded by unit roundoff for one rounded operation" }
    ],
    applications: [
      { title: "fp32 tolerance", background: "Float32 spacing near one is set by 24 significant binary bits.", numbers: "$\\epsilon=2^{-23}\\approx1.19\\times10^{-7}$." },
      { title: "double tolerance", background: "Double precision has a much finer spacing and half-spacing unit roundoff.", numbers: "$\\epsilon=2^{-52}\\approx2.22\\times10^{-16}$ and $u=2^{-53}\\approx1.11\\times10^{-16}$." },
      { title: "Loss scale", background: "The same relative roundoff corresponds to a larger absolute amount at larger values.", numbers: "a value near $100$ has one-rounding scale $100u\\approx1.11\\times10^{-14}$." },
      { title: "Feature scale", background: "Large feature magnitudes turn tiny relative roundoff into a visible absolute scale.", numbers: "a feature near $10^6$ has roundoff scale $10^6u\\approx1.11\\times10^{-10}$." },
      { title: "Finite-difference step", background: "Derivative checks often balance truncation error against roundoff.", numbers: "balancing truncation and roundoff often gives $h\\approx\\sqrt{u}\\approx1.05\\times10^{-8}$ for first-order checks." },
      { title: "Tiny increment", background: "Numbers smaller than the spacing near one disappear when added to one.", numbers: "$1+10^{-18}$ rounds to $1$ in double because $10^{-18}<2^{-52}$." }
    ]
  },
  "math-08-03": {
    connectionsProse: "<p>After seeing that machine numbers are spaced apart and rounded, the next task is to describe the error that results. Absolute error gives the direct distance between an exact value and an approximation. Relative error compares that distance with the size of the exact value, so it is often more meaningful across different scales. These two measures are the language used by conditioning, residual tests, and numerical stopping rules.</p>",
    motivation: "<p>Absolute error is the simplest measure: it says how far the approximation missed the exact value. A miss of $0.001$ may be tiny for a quantity near one million, but large for a probability near zero. That is why absolute error alone does not always describe the practical severity of a numerical error.</p>" +
      "<p>Relative error divides the miss by the size of the exact value. This makes the error dimensionless and allows fair comparisons across scales. The same idea also explains its weakness: when the exact value is zero or very close to zero, the denominator becomes fragile, so absolute error or a problem-specific tolerance may be safer.</p>",
    definition: "<p>For exact value $x$ and approximation $\\hat x$, absolute error is $$|\\hat x-x|$$ and, when $x\\ne0$, relative error is $$\\frac{|\\hat x-x|}{|x|}$$.</p>" +
      "<p><b>Assumptions that matter:</b> Relative error needs a nonzero reference value; near zero, absolute or problem-specific tolerances may be safer.</p>",
    symbols: [
      { sym: "$x$", desc: "exact value" },
      { sym: "$\\hat x$", desc: "approximation" },
      { sym: "$|\\cdot|$", desc: "absolute value" },
      { sym: "relative error", desc: "dimensionless error compared with the exact value's scale" },
      { sym: "vector versions", desc: "replace absolute value by a norm" }
    ],
    derivation: [
      { do: "Let $x$ be exact and $\\hat x$ approximate.", result: "$\\hat x-x$", why: "the signed error records direction" },
      { do: "Measure only distance from the exact value.", result: "$|\\hat x-x|$", why: "distance should be nonnegative" },
      { do: "Assume $x\\ne0$ and compare with the exact scale.", result: "$|\\hat x-x|/|x|$", why: "division by $|x|$ makes the error scale-aware" },
      { do: "Report the dimensionless ratio as a percentage.", result: "$100|\\hat x-x|/|x|\\%$", why: "percent form is often easier to interpret" }
    ],
    applications: [
      { title: "AUC lift", background: "Model metrics are often interpreted by relative improvement over a baseline.", numbers: "$0.804-0.800=0.004$, relative lift $0.004/0.800=0.5\\%$." },
      { title: "Small probability", background: "A small absolute miss can be a large proportional miss near zero.", numbers: "predicting $0.003$ instead of $0.002$ has relative error $50\\%$." },
      { title: "GPS scale", background: "A meter of error has different meaning depending on the distance scale.", numbers: "$1$ m error over $1000$ m is $0.1\\%$." },
      { title: "Linear residual", background: "Residual norms are commonly normalized by the right-hand side norm.", numbers: "if $\\lVert b\\rVert=200$ and $\\lVert r\\rVert=0.02$, relative residual is $10^{-4}$." },
      { title: "Tolerance conversion", background: "Relative tolerances become absolute thresholds after choosing a scale.", numbers: "relative tolerance $10^{-9}$ at scale $10^6$ allows absolute error $0.001$." },
      { title: "Pixel changes", background: "The same absolute pixel change can be visually or numerically different at different intensities.", numbers: "$5\\to7$ is $40\\%$, while $200\\to202$ is $1\\%$." }
    ]
  },
  "math-08-04": {
    connectionsProse: "<p>Absolute and relative error describe how large an error is after it appears. Error propagation explains how an input error moves through a formula. The derivative gives the local multiplier in one variable, and partial derivatives give the corresponding pieces in several variables. This lesson connects calculus directly to practical numerical uncertainty.</p>",
    motivation: "<p>A small input error does not usually pass through a computation unchanged. If the formula is steep at the input, the output error grows; if the formula is flat, the output error shrinks. Taylor's linear approximation is the natural tool for making this precise because it replaces the formula locally by its best linear model.</p>" +
      "<p>In several variables, each input can push the output up or down according to its own partial derivative. Signed errors can cancel, while worst-case bounds avoid relying on cancellation by summing absolute contributions. This gives a practical way to estimate how measurement noise, rounding, or preprocessing error affects a computed quantity.</p>",
    definition: "<p>For a smooth scalar function, a small input error propagates by the first-order rule $$\\Delta y\\approx f'(x)\\Delta x$$ and in several variables by $$\\Delta f\\approx\\sum_i \\frac{\\partial f}{\\partial x_i}\\Delta x_i$$.</p>" +
      "<p><b>Assumptions that matter:</b> The errors are small enough that second-order Taylor terms are negligible; worst-case bounds take absolute values before summing.</p>",
    symbols: [
      { sym: "$\\Delta x$", desc: "input error" },
      { sym: "$\\Delta y$", desc: "output error" },
      { sym: "$f'(x)$", desc: "local multiplier" },
      { sym: "$\\partial f/\\partial x_i$", desc: "sensitivity to input $i$" },
      { sym: "$O(\\Delta x^2)$", desc: "smaller second-order remainder" }
    ],
    derivation: [
      { do: "Start with Taylor's formula.", result: "$f(x+\\Delta x)=f(x)+f'(x)\\Delta x+O(\\Delta x^2)$", why: "Taylor expansion gives the local linear model plus a smaller remainder" },
      { do: "Subtract the original output.", result: "$\\Delta y=f(x+\\Delta x)-f(x)$", why: "this isolates the output change" },
      { do: "Drop second-order terms for small $\\Delta x$.", result: "$\\Delta y\\approx f'(x)\\Delta x$", why: "the linear term dominates for small perturbations" },
      { do: "Apply multivariable Taylor expansion.", result: "$\\Delta f\\approx\\sum_i (\\partial f/\\partial x_i)\\Delta x_i$", why: "each partial derivative contributes one local linear sensitivity" },
      { do: "Take absolute values before summing for a worst-case bound.", result: "$|\\Delta f|\\lesssim\\sum_i |\\partial f/\\partial x_i|\\,|\\Delta x_i|$", why: "the bound does not rely on signed cancellation" }
    ],
    applications: [
      { title: "Squared feature", background: "A derivative estimates how a small feature perturbation changes a transformed feature.", numbers: "$y=x^2$ at $x=3$ with $\\Delta x=0.01$ gives $\\Delta y\\approx6(0.01)=0.06$." },
      { title: "Exact check", background: "The actual finite change confirms the first-order estimate is close for a small perturbation.", numbers: "$3.01^2-3^2=0.0601$, close to the estimate." },
      { title: "Log transform", background: "Logarithms reduce absolute scale errors by a factor of the input size.", numbers: "$y=\\log x$ at $x=100$ with $\\Delta x=0.5$ gives $\\Delta y\\approx0.005$." },
      { title: "Product feature", background: "Each input contributes through its own partial derivative.", numbers: "$f=ab$ at $(4,5)$ with errors $(0.01,-0.02)$ gives $\\Delta f\\approx5(0.01)+4(-0.02)=-0.03$." },
      { title: "Normed worst case", background: "Summing absolute sensitivity contributions gives a safe no-cancellation bound.", numbers: "sensitivities $(3,4)$ and input-error bound $0.01$ give at most $0.07$." },
      { title: "Sensor standardization", background: "Affine standardization scales input error by the reciprocal standard deviation.", numbers: "$z=(x-100)/15$, so a $0.3$ input error gives $0.02$ output error." }
    ]
  },
  "math-08-05": {
    connectionsProse: "<p>Rounding error is often small when viewed as an absolute error, but subtraction can make it large in relative terms. This lesson uses the error ideas from the previous lessons to explain catastrophic cancellation. It also introduces an important habit in numerical analysis: keep the mathematics the same, but rewrite the computation to avoid exposing fragile operations. The stable forms used later for cosine, quadratic roots, logarithms, and softmax follow the same pattern.</p>",
    motivation: "<p>When two nearly equal rounded numbers are subtracted, their leading matching digits disappear. Those leading digits were the reliable part of the numbers, so the small remaining difference may be made mostly from the earlier rounding errors. The absolute error may not have grown much, but the target difference is small, making the relative error large.</p>" +
      "<p>Cancellation is not a statement that subtraction is always bad. It is dangerous when the difference itself is the important answer and the inputs already carry error. Algebraic rewrites, such as rationalizing a square-root difference or using <code>log1p</code>, preserve the exact mathematical value while computing it in a way that keeps significant information.</p>",
    definition: "<p>Catastrophic cancellation occurs when subtracting nearly equal rounded quantities makes a small target difference inherit earlier input errors with large relative size: $$\\frac{|e_a-e_b|}{|a-b|}$$.</p>" +
      "<p><b>Assumptions that matter:</b> The inputs already contain errors $e_a,e_b$, and the target difference $a-b$ is small compared with the input magnitudes.</p>",
    symbols: [
      { sym: "$a,b$", desc: "nearly equal quantities" },
      { sym: "$e_a,e_b$", desc: "prior rounding errors" },
      { sym: "$a-b$", desc: "small target difference" },
      { sym: "relative error", desc: "error compared with $|a-b|$" }
    ],
    derivation: [
      { do: "Suppose the computed inputs are perturbed.", result: "$a+e_a$ and $b+e_b$", why: "rounding or measurement has already introduced small errors" },
      { do: "Subtract the perturbed inputs.", result: "$(a+e_a)-(b+e_b)=(a-b)+(e_a-e_b)$", why: "the computed difference contains the true difference plus previous errors" },
      { do: "Measure absolute error in the difference.", result: "$|e_a-e_b|\\le |e_a|+|e_b|$", why: "the triangle inequality bounds the inherited error" },
      { do: "Compare inherited error with the small target difference.", result: "$|e_a-e_b|/|a-b|$", why: "relative error grows when $|a-b|$ is small" },
      { do: "Rationalize a fragile square-root difference.", result: "$\\sqrt{x+1}-\\sqrt{x}=1/(\\sqrt{x+1}+\\sqrt{x})$", why: "multiplying by the conjugate preserves the value while avoiding direct subtraction of nearly equal roots" }
    ],
    applications: [
      { title: "Square-root difference", background: "Rationalizing avoids subtracting two close square roots directly.", numbers: "$\\sqrt{101}-10=1/(\\sqrt{101}+10)\\approx0.0498756$." },
      { title: "Tiny cosine loss", background: "A stable trigonometric identity preserves a small positive value without direct cancellation.", numbers: "$1-\\cos(10^{-4})\\approx5.0\\times10^{-9}$; $2\\sin^2(5\\times10^{-5})$ computes the same scale stably." },
      { title: "Quadratic formula", background: "The small root can be computed with an algebraically equivalent form that avoids subtracting close large numbers.", numbers: "for $x^2+10^8x+1=0$, the small root is better as $2c/(-b-\\sqrt{b^2-4ac})\\approx-10^{-8}$." },
      { title: "Variance formula", background: "Computing variance as a difference of large second moments can destroy the small spread.", numbers: "data $10^8\\pm1$ should have variance about $1$, but $E[X^2]-E[X]^2$ subtracts two numbers near $10^{16}$." },
      { title: "Residual loss", background: "A tiny prediction residual is sensitive to tiny absolute input errors.", numbers: "subtracting predictions $1.000001-1.000000$ leaves $10^{-6}$, so one $10^{-12}$ absolute input error becomes about $10^{-6}$ relative." },
      { title: "Log probability", background: "Special functions like <code>log1p</code> preserve small increments near one.", numbers: "use <code>log1p(x)</code>; for $x=10^{-8}$, $\\log(1+x)\\approx9.99999995\\times10^{-9}$." }
    ]
  },
  "math-08-06": {
    connectionsProse: "<p>This lesson builds directly on absolute error, relative error, and first-order error propagation. Relative error gives a scale-aware way to describe a small input change, and the derivative tells how a smooth function carries that change into the output. Conditioning puts those two ideas together: it asks whether the problem itself magnifies small changes before any algorithm is chosen.</p>" +
      "<p>This distinction matters throughout numerical analysis. Stability is about the algorithm; conditioning is about the mathematical problem being solved. A stable algorithm can still return a poor answer for an ill-conditioned problem, because the exact answer may genuinely change a lot when the input changes a little. Matrix solves, least squares, loss curvature, normal equations, and softmax/log-sum-exp all use this same sensitivity lens.</p>",
    motivation: "<p>Numerical error is not always caused by bad code. Sometimes the data describe a delicate problem: a small measurement error, rounding error, or perturbation changes the exact answer substantially. Conditioning is the number that measures this built-in sensitivity.</p>" +
      "<p>For a scalar function, the local question is simple. If the input $x$ changes by a small amount $\\Delta x$, the output $f(x)$ changes by about $f'(x)\\Delta x$. To compare different scales fairly, divide the output change by the output size and the input change by the input size. The condition number is the ratio of those two relative changes. A condition number near $1$ means relative errors stay about the same size; a condition number of $1000$ means a $0.1\\%$ input error can become about a $100\\%$ output error.</p>" +
      "<p>This is why the condition number belongs before the algorithm. It tells whether the problem is sensitive in exact arithmetic. After that, stability tells whether the chosen algorithm adds unnecessary numerical error.</p>",
    definition: "<p>The scalar relative condition number measures local relative error amplification: $$\\kappa_f(x)=\\left|\\frac{x f'(x)}{f(x)}\\right|$$. For an invertible matrix, a normwise condition number is $$\\kappa(A)=\\lVert A\\rVert\\,\\lVert A^{-1}\\rVert$$.</p>" +
      "<p><b>Assumptions that matter:</b> The scalar formula needs $x\\ne0$ and $f(x)\\ne0$ locally; the matrix formula needs an invertible matrix, and for SPD matrices the $2$-norm version is $\\lambda_{\\max}/\\lambda_{\\min}$.</p>",
    symbols: [
      { sym: "$f$", desc: "exact scalar function" },
      { sym: "$x$", desc: "input point" },
      { sym: "$f'(x)$", desc: "local derivative" },
      { sym: "$\\Delta x,\\Delta y$", desc: "small input and output changes" },
      { sym: "$\\kappa_f(x)$", desc: "scalar condition number" },
      { sym: "$A$", desc: "invertible matrix" },
      { sym: "$A^{-1}$", desc: "inverse map" },
      { sym: "$\\lVert\\cdot\\rVert$", desc: "chosen norm" },
      { sym: "$\\kappa(A)$", desc: "worst-case relative amplification for the matrix problem" }
    ],
    derivation: [
      { do: "Start with the first-order change.", result: "$\\Delta y\\approx f'(x)\\Delta x$", why: "Taylor's linear approximation describes the local output change" },
      { do: "Divide by the output size.", result: "$\\dfrac{|\\Delta y|}{|f(x)|}\\approx \\dfrac{|f'(x)|\\,|\\Delta x|}{|f(x)|}$", why: "this turns output error into relative output error" },
      { do: "Write the relative input error.", result: "$\\dfrac{|\\Delta x|}{|x|}$", why: "this measures the input change on the input's own scale" },
      { do: "Divide relative output error by relative input error.", result: "$\\dfrac{|f'(x)|\\,|\\Delta x|/|f(x)|}{|\\Delta x|/|x|}$", why: "this is the amplification factor" },
      { do: "Cancel the perturbation size.", result: "$\\left|\\dfrac{x f'(x)}{f(x)}\\right|$", why: "the small perturbation size drops out, leaving local sensitivity" },
      { do: "Evaluate $f(x)=x^2$ at $x=3$.", result: "$f'(3)=6$, $f(3)=9$, so $\\kappa_f(3)=|3\\cdot6/9|=2$", why: "a $1\\%$ input error gives about a $2\\%$ output error" }
    ],
    applications: [
      { title: "Ill-conditioned solve", background: "A diagonal matrix can stretch one direction much more than another.", numbers: "for $A=\\operatorname{diag}(1000,1)$, $\\kappa_2(A)=1000$, so a $0.1\\%$ right-side error can produce a worst-case $100\\%$ solution error." },
      { title: "Loss curvature sets gradient-descent speed", background: "Optimization curvature ratios act like condition numbers for first-order methods.", numbers: "for $f(x,y)=x^2+100y^2$, the Hessian eigenvalues are $2$ and $200$, so $\\kappa=100$." },
      { title: "Normal equations square conditioning", background: "Least-squares normal equations can greatly worsen numerical sensitivity.", numbers: "if $\\kappa_2(X)=100$, then $\\kappa_2(X^TX)=10{,}000$, which is why QR is preferred for least squares." },
      { title: "Catastrophic cancellation as sensitivity", background: "The exact problem and the chosen algorithm can have different numerical behavior.", numbers: "$f(x)=1-\\cos x$ near $x=10^{-4}$ gives $f(x)\\approx5.0\\times10^{-9}$ and $\\kappa\\approx2$ for the exact problem, but the direct floating-point subtraction is algorithmically unstable; the rewrite $2\\sin^2(x/2)$ preserves the small value." },
      { title: "Softmax reconditioning", background: "Shifting logits changes the computational scale without changing the probabilities.", numbers: "logits $[1000,1001,1002]$ are shifted by $1002$ to $[-2,-1,0]$; the probabilities are unchanged, and the largest is $0.6652$." },
      { title: "Scalar sensitivity check", background: "A simple power function shows the local relative amplification directly.", numbers: "$\\kappa_f(3)=2$ for $f(x)=x^2$, so a $0.5\\%$ input error gives about a $1\\%$ output error." }
    ]
  },
  "math-08-07": {
    connectionsProse: "<p>Conditioning separated the sensitivity of the problem from the behavior of the algorithm. Stability studies the algorithmic side of that split. It asks whether the computed answer can be interpreted as the exact answer to a nearby problem. This viewpoint connects rounding error to useful forward-error estimates through the condition number.</p>",
    motivation: "<p>A numerical algorithm does not need to reproduce exact arithmetic step by step to be trustworthy. A stable algorithm may make tiny rounding choices internally, but its final answer behaves as if the input data had been changed only slightly. That is the backward-error idea.</p>" +
      "<p>Forward error then depends on both pieces. If the problem is well-conditioned, a small backward error usually produces a small answer error. If the problem is ill-conditioned, even a backward-stable algorithm can have a large forward error because the exact mathematical problem is sensitive. This is why stability and conditioning are normally discussed together.</p>",
    definition: "<p>Forward error compares the computed answer with the exact answer, while backward error asks for the smallest nearby input that would make the computed answer exact. A typical stability estimate is $$\\text{forward error}\\lesssim \\kappa\\cdot\\text{backward error}$$.</p>" +
      "<p><b>Assumptions that matter:</b> Backward stability means the backward error is $O(u)$, and the condition number controls how that nearby-input error becomes answer error.</p>",
    symbols: [
      { sym: "$x$", desc: "input" },
      { sym: "$y$", desc: "exact output" },
      { sym: "$\\hat y$", desc: "computed output" },
      { sym: "$\\Delta x$", desc: "nearby-input perturbation" },
      { sym: "$u$", desc: "unit roundoff" },
      { sym: "$\\kappa$", desc: "condition number" }
    ],
    derivation: [
      { do: "Let $y=f(x)$ be exact and $\\hat y$ computed.", result: "$\\lVert\\hat y-y\\rVert/\\lVert y\\rVert$", why: "this is the relative forward error" },
      { do: "Search for a nearby input that makes the computed answer exact.", result: "$\\hat y=f(x+\\Delta x)$", why: "this is the backward-error viewpoint" },
      { do: "Measure the smallest such perturbation relatively.", result: "$\\lVert\\Delta x\\rVert/\\lVert x\\rVert$", why: "it asks how much the input had to change" },
      { do: "Call an algorithm backward stable when this perturbation is tiny.", result: "backward error $=O(u)$", why: "the algorithm behaves like exact arithmetic on a slightly rounded input" },
      { do: "Use conditioning to translate input perturbation to output perturbation.", result: "forward error $\\lesssim\\kappa\\cdot$ backward error", why: "the problem's sensitivity controls the amplification" }
    ],
    applications: [
      { title: "Forward estimate", background: "Conditioning converts a backward-error diagnostic into a forward-error warning.", numbers: "$\\kappa=20$ and backward error $3\\times10^{-8}$ give forward error $6\\times10^{-7}$." },
      { title: "Stable summation check", background: "Pairwise summation reduces the longest chain of rounded additions.", numbers: "pairwise summing $1024$ terms has depth $10$, not $1023$ sequential additions." },
      { title: "Unstable recurrence", background: "Error growth above one compounds over repeated steps.", numbers: "error multiplied by $1.1$ for $50$ steps grows by $1.1^{50}\\approx117.4$." },
      { title: "Stable recurrence", background: "Error multipliers below one damp perturbations.", numbers: "multiplier $0.9$ for $50$ steps shrinks error to $0.9^{50}\\approx0.00515$." },
      { title: "Backward-stable solve", background: "A stable factorization can still show forward error when the matrix is conditioned poorly.", numbers: "if LU has backward error $10^{-15}$ and $\\kappa=10^6$, forward error may be $10^{-9}$." },
      { title: "Ill-conditioned limit", background: "The same stable algorithm can look inaccurate on a far more sensitive problem.", numbers: "the same backward error $10^{-15}$ with $\\kappa=10^{12}$ can become $10^{-3}$ forward error." }
    ]
  },
  "math-08-08": {
    connectionsProse: "<p>Bisection brings numerical analysis back to a basic calculus fact: a continuous function that changes sign must cross zero. Instead of using slopes or high-order models, it protects a bracket known to contain a root. This makes it slower than Newton-type methods but much easier to trust. The lesson also introduces iteration counts based on interval width.</p>",
    motivation: "<p>The method keeps two endpoints with opposite signs. The root may not be known exactly, but continuity guarantees that at least one root lies between them. By testing the midpoint, the method discards the half of the interval that no longer needs to be kept.</p>" +
      "<p>Each step halves the uncertainty. That simple geometric shrinkage gives a direct plan for how many steps are needed to reach a target width. Bisection is therefore a reliable baseline: it may not use much information about the function's shape, but it preserves the root-containing guarantee at every step.</p>",
    definition: "<p>If $f$ is continuous and $f(a)f(b)<0$, bisection repeatedly keeps the half-interval that still changes sign. After $n$ steps, the bracket width is $$(b-a)/2^n$$.</p>" +
      "<p><b>Assumptions that matter:</b> Continuity and opposite signs give the root-containing guarantee; the midpoint error is at most half the final width.</p>",
    symbols: [
      { sym: "$a,b$", desc: "bracket endpoints" },
      { sym: "$m$", desc: "midpoint" },
      { sym: "$n$", desc: "number of bisection steps" },
      { sym: "width", desc: "interval length" },
      { sym: "$f(a)f(b)<0$", desc: "opposite signs" }
    ],
    derivation: [
      { do: "Assume $f$ is continuous and $f(a)f(b)<0$.", result: "at least one root lies in $[a,b]$", why: "the Intermediate Value Theorem applies" },
      { do: "Choose the midpoint.", result: "$m=(a+b)/2$", why: "it splits the current bracket into equal halves" },
      { do: "Test the left half.", result: "if $f(a)f(m)\\le0$, keep $[a,m]$", why: "that half still contains a sign change or midpoint root" },
      { do: "Otherwise keep the right half.", result: "keep $[m,b]$", why: "the sign change must be there" },
      { do: "Repeat the halving.", result: "width after $n$ steps is $(b-a)/2^n$", why: "each step divides interval length by two" },
      { do: "Return the midpoint of the final bracket.", result: "error is at most half the final width", why: "the true root is somewhere inside the bracket" }
    ],
    applications: [
      { title: "Root of $x^2-2$", background: "Bisection safely narrows the bracket for $\\sqrt2$.", numbers: "after two steps from $[1,2]$, bracket is $[1.25,1.5]$." },
      { title: "Tolerance planning", background: "The width formula directly predicts the number of iterations needed.", numbers: "starting width $1$, ten steps give width $1/1024\\approx0.0009766$." },
      { title: "Safe learning-rate search", background: "A monotone validation condition can be bracketed and halved.", numbers: "halving $[0,1]$ until width $10^{-3}$ needs $10$ steps." },
      { title: "Quantile inversion", background: "CDF inversion can use bisection when the CDF is continuous and bracketed.", numbers: "a CDF bracket of width $0.5$ after $12$ steps has width $0.000122$." },
      { title: "Calibration threshold", background: "Threshold tuning often needs only a guaranteed bracket width.", numbers: "bracket $[0,100]$ to width $0.1$ needs $\\lceil\\log_2(1000)\\rceil=10$ steps." },
      { title: "Residual check", background: "The midpoint sign tells which half of the bracket survives.", numbers: "$f(1.375)=-0.109375$ picks the right half of $[1.25,1.5]$ for $x^2-2$." }
    ]
  },
  "math-08-09": {
    connectionsProse: "<p>Newton's method builds on Taylor linearization, the same local idea used for error propagation. Instead of estimating an output error, it uses the tangent line to choose the next root estimate. This makes the method fast near a simple root, but also dependent on a useful derivative and a good local starting point. It is the standard reference point for faster root-finding and optimization updates.</p>",
    motivation: "<p>Near a current guess, a smooth curve can be approximated by its tangent line. The tangent line is easy to solve, so Newton's method uses the zero of that line as the next guess for the zero of the original function. When the tangent model is accurate, the new guess can be much closer than the old one.</p>" +
      "<p>The same strength creates the main caution. If the derivative is tiny, the tangent crosses the axis far away, producing a large correction. If the root is multiple or the starting point is poor, the fast local behavior can disappear. Newton's method is therefore powerful, but it is not as globally protective as bisection.</p>",
    definition: "<p>Newton's method solves the tangent-line approximation to get the update $$x_{n+1}=x_n-\\frac{f(x_n)}{f'(x_n)}$$.</p>" +
      "<p><b>Assumptions that matter:</b> The derivative at the current iterate must be nonzero, and fast convergence requires a good local start near a simple root.</p>",
    symbols: [
      { sym: "$x_n$", desc: "current iterate" },
      { sym: "$x_{n+1}$", desc: "next iterate" },
      { sym: "$f'(x_n)$", desc: "tangent slope" },
      { sym: "$f(x_n)$", desc: "residual" },
      { sym: "simple root", desc: "root where the derivative is nonzero" }
    ],
    derivation: [
      { do: "Start at $x_n$.", result: "current residual is $f(x_n)$", why: "the update is based on the current guess" },
      { do: "Linearize near $x_n$.", result: "$f(x)\\approx f(x_n)+f'(x_n)(x-x_n)$", why: "Taylor's first-order model is the tangent line" },
      { do: "Set the linear model equal to zero.", result: "$0=f(x_n)+f'(x_n)(x-x_n)$", why: "we want the tangent line's root" },
      { do: "Solve for $x$.", result: "$x=x_n-f(x_n)/f'(x_n)$", why: "isolating $x$ gives the next root estimate" },
      { do: "Name the next iterate.", result: "$x_{n+1}=x_n-f(x_n)/f'(x_n)$", why: "this is Newton's update formula" },
      { do: "State the local requirements.", result: "$f'(x_n)\\ne0$ and a good local start", why: "zero or tiny slopes and poor starts can make the tangent step unreliable" }
    ],
    applications: [
      { title: "Square root", background: "Newton's method quickly refines an estimate of $\\sqrt2$.", numbers: "for $x^2-2$ from $1.5$, iterates are $1.4166667$ then $1.4142157$." },
      { title: "Error drop", background: "Near a simple root, Newton errors can shrink very rapidly.", numbers: "second iterate is about $2.12\\times10^{-6}$ from $\\sqrt2$." },
      { title: "Reciprocal computation", background: "Newton updates can be algebraically specialized to avoid division in repeated reciprocal refinement.", numbers: "solving $1/x-a=0$ gives $x_{n+1}=2x_n-a x_n^2$." },
      { title: "Logistic intercept", background: "Optimization Newton steps divide gradient by curvature.", numbers: "one Newton update uses $\\Delta=-g/H$; with $g=0.8,H=4$, step is $-0.2$." },
      { title: "Multiple-root slowdown", background: "A repeated root loses the usual fast local behavior.", numbers: "$f=(x-1)^2$ gives $x_{n+1}=(x_n+1)/2$, so error halves." },
      { title: "Bad derivative warning", background: "Tiny slopes create very large tangent corrections.", numbers: "if $f'(x_n)=0.001$ and $f(x_n)=0.1$, Newton correction is $100$." }
    ]
  },
  "math-08-10": {
    connectionsProse: "<p>The secant method sits between bisection and Newton's method. It keeps Newton's idea of replacing the curve by a line, but it estimates the slope from two function values instead of using an explicit derivative. This makes it useful when derivatives are expensive, unavailable, or inconvenient. It also shows how derivative-free methods can still use local geometry.</p>",
    motivation: "<p>Newton's method asks for the tangent slope at the current point. The secant method replaces that tangent slope with the slope of the line through the two most recent points. The next iterate is where this secant line crosses zero.</p>" +
      "<p>This saves derivative evaluations and usually uses only one new function value per step after the first two points. The tradeoff is that the slope estimate can fail if the two function values are equal or nearly equal. Locally, the method is faster than simple linear convergence but usually not as fast as Newton's quadratic convergence.</p>",
    definition: "<p>The secant method replaces Newton's derivative by the slope through two recent function values, giving $$x_{n+1}=x_n-\\frac{f(x_n)(x_n-x_{n-1})}{f(x_n)-f(x_{n-1})}$$.</p>" +
      "<p><b>Assumptions that matter:</b> The denominator must be nonzero and not too small; the method uses local geometry but has less protection than bracketing.</p>",
    symbols: [
      { sym: "$x_{n-1},x_n$", desc: "two most recent iterates" },
      { sym: "$s$", desc: "secant slope" },
      { sym: "denominator", desc: "change in function values" },
      { sym: "$x_{n+1}$", desc: "secant intercept" }
    ],
    derivation: [
      { do: "Use points $(x_{n-1},f(x_{n-1}))$ and $(x_n,f(x_n))$.", result: "two recent samples define a line", why: "the method estimates slope without an explicit derivative" },
      { do: "Compute the secant slope.", result: "$s=[f(x_n)-f(x_{n-1})]/[x_n-x_{n-1}]$", why: "slope is change in value divided by change in input" },
      { do: "Write the line through $x_n$.", result: "$f(x_n)+s(x-x_n)$", why: "point-slope form uses the newest iterate" },
      { do: "Set the line equal to zero.", result: "$0=f(x_n)+s(x-x_n)$", why: "the next estimate is the line's root" },
      { do: "Solve for the intercept.", result: "$x_{n+1}=x_n-f(x_n)(x_n-x_{n-1})/[f(x_n)-f(x_{n-1})]$", why: "substituting $s$ gives the secant update" }
    ],
    applications: [
      { title: "Root of $x^2-2$", background: "The first secant line through two coarse guesses gives a derivative-free root estimate.", numbers: "from $1,2$, one step gives $4/3\\approx1.3333$." },
      { title: "Second secant step", background: "Reusing the newest two points improves the estimate.", numbers: "using $2$ and $4/3$ gives $1.4$." },
      { title: "Derivative-free calibration", background: "When only losses are available, a secant line can estimate the zero crossing.", numbers: "if losses are $0.2$ at $0.1$ and $-0.1$ at $0.4$, the secant root estimate is $0.3$." },
      { title: "Function-call budget", background: "Secant iterations avoid derivative calls after startup.", numbers: "after startup, each secant step needs one new function evaluation, while Newton also needs a derivative." },
      { title: "Zero denominator guard", background: "Equal residuals make the secant slope unusable.", numbers: "if two residuals are both $0.01$, the secant denominator is $0$ and the step is invalid." },
      { title: "Superlinear rate note", background: "The secant method has a local convergence order between bisection and Newton.", numbers: "the local order is about $1.618$, between bisection's linear rate and Newton's quadratic rate." }
    ]
  },
  "math-08-11": {
    connectionsProse: "<p>Fixed-point iteration presents many numerical methods in a common form: repeat a map until it stops changing. Root finding, nonlinear solves, expectation-maximization style updates, and some linear solvers can all be viewed this way. The key issue is not just whether $x=g(x)$ has a solution, but whether the chosen map pulls nearby guesses toward it. This lesson uses the derivative as a local contraction factor.</p>",
    motivation: "<p>Rewriting a problem as $x=g(x)$ turns solving into iteration. Starting from a guess, the algorithm feeds the current value back into $g$ to get the next value. If the map brings nearby points closer to the fixed point, the errors shrink.</p>" +
      "<p>The derivative of $g$ at the fixed point gives the local shrink-or-grow factor. A magnitude below $1$ means errors contract locally, while a magnitude above $1$ usually means they expand. This is why different algebraic rearrangements of the same equation can behave very differently as numerical algorithms.</p>",
    definition: "<p>A fixed-point iteration repeatedly applies $x_{n+1}=g(x_n)$ to solve $x=g(x)$. Near a fixed point $x^*$, the error follows $$e_{n+1}\\approx g'(x^*)e_n$$.</p>" +
      "<p><b>Assumptions that matter:</b> The local contraction test uses differentiability near $x^*$; $|g'(x^*)|<1$ suggests local convergence, while $|g'(x^*)|>1$ usually suggests growth.</p>",
    symbols: [
      { sym: "$g$", desc: "iteration map" },
      { sym: "$x^*$", desc: "fixed point" },
      { sym: "$x_n$", desc: "iterate" },
      { sym: "$e_n=x_n-x^*$", desc: "error" },
      { sym: "$g'(x^*)$", desc: "local contraction factor" }
    ],
    derivation: [
      { do: "Let $x^*$ satisfy the fixed-point equation.", result: "$g(x^*)=x^*$", why: "this is the value the iteration should approach" },
      { do: "Subtract fixed-point equations.", result: "$x_{n+1}-x^*=g(x_n)-g(x^*)$", why: "this expresses the new error through the map" },
      { do: "Linearize $g(x_n)$ near $x^*$.", result: "$g(x_n)-g(x^*)\\approx g'(x^*)(x_n-x^*)$", why: "the derivative gives the local multiplier" },
      { do: "Write the error recurrence.", result: "$e_{n+1}\\approx g'(x^*)e_n$", why: "the next error is approximately the old error times the contraction factor" },
      { do: "Check the factor magnitude.", result: "$|g'(x^*)|<1$ contracts and $|g'(x^*)|>1$ usually grows", why: "multipliers below one shrink local errors" }
    ],
    applications: [
      { title: "Cosine iteration", background: "The iteration $x_{n+1}=\\cos x_n$ moves toward its fixed point with oscillation.", numbers: "from $0.5$, $x_1=0.8776$, $x_2=0.6390$, $x_3=0.8027$." },
      { title: "Contraction check", background: "The derivative at the fixed point predicts local convergence.", numbers: "at the fixed point $0.7391$, $|g'|=|-\\sin(0.7391)|\\approx0.674<1$." },
      { title: "Divergent rearrangement", background: "A map with derivative magnitude above one expands errors.", numbers: "$g(x)=2x$ has $|g'|=2$, so error doubles each step." },
      { title: "Convergence budget", background: "A constant contraction factor gives a direct error-reduction estimate.", numbers: "factor $0.5$ needs $10$ steps to reduce error by about $1/1024$." },
      { title: "EM-style iteration", background: "Many iterative statistical updates behave approximately linearly near convergence.", numbers: "if likelihood change contracts by $0.8$, after $20$ iterations the remaining linear error factor is $0.8^{20}\\approx0.0115$." },
      { title: "Stopping rule", background: "Successive changes can estimate the observed contraction factor.", numbers: "changes $0.1,0.04,0.016$ suggest contraction factor $0.4$." }
    ]
  },
  "math-08-12": {
    connectionsProse: "<p>Many numerical problems reduce to solving linear systems, and LU factorization is one of the central tools for doing that efficiently. It records Gaussian elimination as matrix factors. Once the factorization is built, new right-hand sides can be solved without repeating the full elimination. This lesson prepares for pivoting, condition numbers, and iterative alternatives.</p>",
    motivation: "<p>Gaussian elimination turns a matrix into an upper triangular form by subtracting multiples of earlier rows from later rows. LU factorization stores exactly those multipliers in a lower triangular matrix. The result is a decomposition $A=LU$ when row swaps are not needed.</p>" +
      "<p>Triangular systems are much easier to solve than general systems. Solving $Ax=b$ becomes two simpler stages: first solve $Ly=b$ by forward substitution, then solve $Ux=y$ by backward substitution. This is especially valuable when the same matrix appears with many different right-hand sides.</p>",
    definition: "<p>LU factorization writes a matrix as $$A=LU$$ where $L$ is lower triangular and stores elimination multipliers, while $U$ is upper triangular.</p>" +
      "<p><b>Assumptions that matter:</b> The simple $A=LU$ form assumes no row swaps are needed; with pivoting, row swaps are recorded separately.</p>",
    symbols: [
      { sym: "$A$", desc: "original matrix" },
      { sym: "$L$", desc: "lower triangular multiplier matrix" },
      { sym: "$U$", desc: "upper triangular matrix" },
      { sym: "$m$", desc: "elimination multiplier" },
      { sym: "$P$", desc: "permutation matrix when row swaps are used" }
    ],
    derivation: [
      { do: "Start with $A=\\begin{bmatrix}2&1\\4&3\\end{bmatrix}$.", result: "pivot is $2$", why: "the first diagonal entry is used to eliminate below it" },
      { do: "Compute the elimination multiplier.", result: "$m=4/2=2$", why: "the lower-left entry divided by the pivot gives the row multiple" },
      { do: "Eliminate the lower-left entry.", result: "$[4,3]-2[2,1]=[0,1]$", why: "subtracting the multiplier times row one creates an upper triangular row" },
      { do: "Record the upper triangular factor.", result: "$U=\\begin{bmatrix}2&1\\0&1\\end{bmatrix}$", why: "this is the matrix after elimination" },
      { do: "Store the multiplier in the lower factor.", result: "$L=\\begin{bmatrix}1&0\\2&1\\end{bmatrix}$", why: "unit diagonal $L$ records the elimination multiplier" },
      { do: "Multiply the factors.", result: "$LU=A$", why: "the stored multiplier reconstructs the original eliminated row" }
    ],
    applications: [
      { title: "Repeated solves", background: "Factoring once is expensive, but each later right-hand side is much cheaper.", numbers: "factoring one $1000\\times1000$ matrix costs about $2n^3/3\\approx6.67\\times10^8$ flops; each triangular solve pair costs about $2n^2=2.0\\times10^6$ flops." },
      { title: "Worked factor", background: "The two-by-two example stores one multiplier in $L$ and the eliminated matrix in $U$.", numbers: "$L=\\begin{bmatrix}1&0\\2&1\\end{bmatrix}$ and $U=\\begin{bmatrix}2&1\\0&1\\end{bmatrix}$." },
      { title: "Determinant from $U$", background: "For unit-diagonal $L$, the determinant comes from the product of pivots in $U$.", numbers: "$\\det A=2\\cdot1=2$." },
      { title: "Solve with factor", background: "Forward and backward substitution solve the system after factorization.", numbers: "for $b=(3,7)$, forward/back substitution gives $x=(1,1)$." },
      { title: "Memory scale", background: "Dense direct methods need storage for all matrix entries.", numbers: "dense $1000\\times1000$ double matrix stores $10^6$ entries, about $8$ MB." },
      { title: "Pivoting connection", background: "A tiny pivot creates a huge multiplier and motivates row swaps.", numbers: "if the first pivot were $10^{-6}$ with lower entry $1$, the multiplier would be $10^6$." }
    ]
  },
  "math-08-13": {
    connectionsProse: "<p>LU factorization works for broad classes of square matrices, but many important matrices have extra structure. Symmetric positive-definite matrices appear in covariance models, kernel methods, least squares, and optimization. Cholesky factorization uses that structure to produce a lower triangular factor that acts like a matrix square root. It is faster and cleaner than general LU when its assumptions hold.</p>",
    motivation: "<p>A positive number can be written as a square of its positive square root. Cholesky extends that idea to a symmetric positive-definite matrix by writing it as $LL^T$. The lower triangular form keeps the computation organized and gives positive diagonal entries.</p>" +
      "<p>The factor is useful because it turns covariance transformations, Mahalanobis distances, and linear solves into triangular operations. The assumptions matter: without symmetry and positive definiteness, the square-root interpretation and the clean triangular construction can fail.</p>",
    definition: "<p>Cholesky factorization writes a symmetric positive-definite matrix as $$A=LL^T$$ where $L$ is lower triangular with positive diagonal entries.</p>" +
      "<p><b>Assumptions that matter:</b> The matrix must be symmetric positive definite; without those conditions, the square-root construction can fail.</p>",
    symbols: [
      { sym: "$A$", desc: "SPD matrix" },
      { sym: "$L$", desc: "lower triangular factor" },
      { sym: "$L^T$", desc: "transpose" },
      { sym: "positive definite", desc: "$x^TAx>0$ for nonzero $x$" }
    ],
    derivation: [
      { do: "Let $L=\\begin{bmatrix}a&0\\b&c\\end{bmatrix}$.", result: "a general lower triangular two-by-two factor", why: "Cholesky uses lower triangular factors" },
      { do: "Multiply $LL^T$.", result: "$LL^T=\\begin{bmatrix}a^2&ab\\ab&b^2+c^2\\end{bmatrix}$", why: "matching entries determines the unknowns" },
      { do: "Match $A=\\begin{bmatrix}4&2\\2&3\\end{bmatrix}$.", result: "$a^2=4$, $ab=2$, and $b^2+c^2=3$", why: "equal matrices have equal corresponding entries" },
      { do: "Use the positive diagonal convention.", result: "$a=2$", why: "Cholesky chooses positive diagonal entries" },
      { do: "Solve the off-diagonal equation.", result: "$b=1$", why: "$ab=2$ with $a=2$" },
      { do: "Solve the lower-right equation.", result: "$c=\\sqrt2$", why: "$b^2+c^2=3$ and $b=1$" },
      { do: "Write the factor.", result: "$L=\\begin{bmatrix}2&0\\1&\\sqrt2\\end{bmatrix}$", why: "these entries satisfy $LL^T=A$" }
    ],
    applications: [
      { title: "Gaussian sampling", background: "Multiplying a standard normal vector by $L$ creates the target covariance structure.", numbers: "with $L=\\begin{bmatrix}2&0\\1&\\sqrt2\\end{bmatrix}$ and $z=(1,-1)$, $Lz=(2,-0.414)$." },
      { title: "Ridge solve", background: "SPD systems from regularized least squares are natural Cholesky targets.", numbers: "$A=\\begin{bmatrix}4&2\\2&3\\end{bmatrix}$ and $b=(6,5)$ gives $x=(1,1)$." },
      { title: "Covariance check", background: "A candidate factor can be verified by multiplying it by its transpose.", numbers: "$\\begin{bmatrix}9&3\\3&2\\end{bmatrix}$ has factor $\\begin{bmatrix}3&0\\1&1\\end{bmatrix}$." },
      { title: "Kernel factor", background: "Small positive-definite kernel matrices reveal the square-root step directly.", numbers: "$K=\\begin{bmatrix}1&0.5\\0.5&1\\end{bmatrix}$ has lower-right factor $\\sqrt{0.75}\\approx0.866$." },
      { title: "Mahalanobis distance", background: "Triangular solves turn covariance-scaled distance into an ordinary norm.", numbers: "solving $Ly=(2,1)$ gives $y=(1,0)$, so distance squared is $1$." },
      { title: "Cost saving", background: "Cholesky exploits symmetry and positive definiteness to do less work than general LU.", numbers: "Cholesky costs about $n^3/3$, half of LU's $2n^3/3$ for dense matrices." }
    ]
  },
  "math-08-14": {
    connectionsProse: "<p>LU factorization depends on dividing by pivot entries during elimination. If a pivot is zero, the next elimination step cannot proceed; if it is tiny, the multipliers can become very large. Pivoting is the practical safeguard that chooses safer rows before division. It links factorization to stability by controlling how rounding errors can be amplified.</p>",
    motivation: "<p>Elimination removes entries below a pivot by subtracting a multiple of the pivot row. The multiplier is the entry being eliminated divided by the pivot. A small pivot therefore creates a large multiplier, and large multipliers can carry rounding error into later rows.</p>" +
      "<p>Partial pivoting reduces this danger by swapping the largest available entry in the current column into the pivot position. Then the entries below the pivot are no larger in magnitude than the pivot itself, so the immediate multipliers are bounded by $1$. The row swaps are recorded in a permutation matrix, giving $PA=LU$.</p>",
    definition: "<p>Pivoting swaps rows before elimination so the pivot is safer. With partial pivoting, row swaps are recorded in $$PA=LU$$.</p>" +
      "<p><b>Assumptions that matter:</b> Partial pivoting searches only the current column; complete pivoting may also swap columns.</p>",
    symbols: [
      { sym: "$a_{kk}$", desc: "pivot" },
      { sym: "$m$", desc: "multiplier" },
      { sym: "$P$", desc: "permutation matrix" },
      { sym: "partial pivoting", desc: "searches rows in one column" },
      { sym: "complete pivoting", desc: "may also swap columns" }
    ],
    derivation: [
      { do: "In column $k$, compute the elimination multiplier.", result: "$m=a_{ik}/a_{kk}$", why: "the entry below the pivot is divided by the pivot" },
      { do: "Consider a tiny pivot.", result: "$|m|$ becomes large", why: "a small denominator amplifies the multiplier" },
      { do: "Track what large multipliers do.", result: "rounding error in the pivot row is multiplied", why: "the row update subtracts $m$ times the pivot row" },
      { do: "Use partial pivoting.", result: "swap in the row with largest $|a_{ik}|$ in that column", why: "the largest available column entry makes the pivot safer" },
      { do: "Bound the immediate multipliers.", result: "$|m|\\le1$", why: "entries below the chosen pivot are no larger in magnitude" },
      { do: "Record row swaps.", result: "$PA=LU$", why: "the permutation matrix stores the row exchanges" }
    ],
    applications: [
      { title: "Worked system", background: "Swapping a tiny pivot with a larger lower entry reverses the multiplier size.", numbers: "without swapping, $0.001$ as pivot gives multiplier $1000$; after swapping, multiplier is $0.001$." },
      { title: "Solve result", background: "Pivoting makes the small example solve stably despite the tiny leading entry.", numbers: "pivoted solve for $[[0.001,1],[1,1]]x=(1,2)$ gives $x\\approx(1.001001,0.998999)$." },
      { title: "Permutation", background: "A two-row swap is represented by a simple permutation matrix.", numbers: "$P=\\begin{bmatrix}0&1\\1&0\\end{bmatrix}$ swaps two rows." },
      { title: "Feature-scale danger", background: "A small pivot relative to a lower entry creates a huge multiplier.", numbers: "pivot $10^{-6}$ with lower entry $1$ gives multiplier $10^6$." },
      { title: "Newton system", background: "Linear systems inside Newton methods can face the same multiplier issue.", numbers: "pivot $0.02$ and lower entry $1$ give multiplier $50$." },
      { title: "Safe column", background: "If the pivot already dominates the column, immediate multipliers stay modest.", numbers: "entries $8,3,-4$ need no swap because multipliers are $0.375$ and $-0.5$." }
    ]
  },
  "math-08-15": {
    connectionsProse: "<p>The scalar condition number measured local sensitivity for a function. Matrix condition numbers apply the same idea to linear systems and linear transformations. They describe how much solving with a matrix can amplify relative perturbations in the data. This lesson is central for understanding least squares, normal equations, covariance matrices, and numerical diagnostics.</p>",
    motivation: "<p>A matrix can stretch space by different amounts in different directions. When solving $Ax=b$, directions that the matrix barely stretches become dangerous because the inverse must stretch them back strongly. The condition number compares the largest stretch with the smallest stretch.</p>" +
      "<p>In the $2$-norm, this comparison is the ratio of largest to smallest singular value. A large ratio means that some right-side errors can be greatly magnified in the solution. The condition number is a worst-case warning, not a guarantee that every perturbation will be amplified that much.</p>",
    definition: "<p>For an invertible matrix, the normwise condition number is $$\\kappa(A)=\\lVert A\\rVert\\,\\lVert A^{-1}\\rVert$$ and in the $2$-norm it is $$\\kappa_2(A)=\\frac{\\sigma_{\\max}}{\\sigma_{\\min}}$$.</p>" +
      "<p><b>Assumptions that matter:</b> The matrix must be invertible; the bound is worst-case and depends on the chosen norm.</p>",
    symbols: [
      { sym: "$A$", desc: "invertible matrix" },
      { sym: "$x$", desc: "solution" },
      { sym: "$b$", desc: "right side" },
      { sym: "$\\Delta b,\\Delta x$", desc: "perturbations" },
      { sym: "$\\lVert\\cdot\\rVert$", desc: "norm" },
      { sym: "$\\sigma_{\\max},\\sigma_{\\min}$", desc: "singular values" },
      { sym: "$\\kappa_2(A)=\\sigma_{\\max}/\\sigma_{\\min}$", desc: "2-norm condition number" }
    ],
    derivation: [
      { do: "For $Ax=b$, perturb the right side.", result: "$A(x+\\Delta x)=b+\\Delta b$", why: "this models data error in a linear solve" },
      { do: "Subtract the exact system $Ax=b$.", result: "$A\\Delta x=\\Delta b$", why: "the remaining equation relates solution error to data error" },
      { do: "Apply the inverse.", result: "$\\Delta x=A^{-1}\\Delta b$", why: "the inverse maps right-side perturbations to solution perturbations" },
      { do: "Bound the solution perturbation.", result: "$\\lVert\\Delta x\\rVert\\le\\lVert A^{-1}\\rVert\\lVert\\Delta b\\rVert$", why: "the matrix norm bounds amplification" },
      { do: "Bound the exact right side.", result: "$\\lVert b\\rVert=\\lVert Ax\\rVert\\le\\lVert A\\rVert\\lVert x\\rVert$", why: "this rewrites the solution scale in terms of the data scale" },
      { do: "Combine the two inequalities.", result: "$\\lVert\\Delta x\\rVert/\\lVert x\\rVert\\le\\kappa(A)\\,\\lVert\\Delta b\\rVert/\\lVert b\\rVert$", why: "relative solution error is bounded by condition number times relative data error" }
    ],
    applications: [
      { title: "Diagonal matrix", background: "A diagonal map stretches coordinate axes by its diagonal entries.", numbers: "$\\operatorname{diag}(4,1)$ has $\\kappa_2=4$." },
      { title: "Ill-conditioned diagonal", background: "A tiny stretch in one direction makes the inverse stretch strongly.", numbers: "$\\operatorname{diag}(1,0.001)$ has $\\kappa_2=1000$." },
      { title: "Worst-case error", background: "The condition number bounds possible relative solution amplification.", numbers: "$\\kappa=200$ and data error $0.001$ can give $20\\%$ solution error." },
      { title: "Covariance spread", background: "For SPD covariance matrices, eigenvalue spread is a condition-number diagnostic.", numbers: "eigenvalues $100,25,1$ give condition number $100$." },
      { title: "Kernel near-duplicate", background: "Near-duplicate features or examples can create very small singular values.", numbers: "singular values $2$ and $10^{-6}$ give $\\kappa=2{,}000{,}000$." },
      { title: "Reciprocal diagnostic", background: "Some software reports reciprocal condition estimates instead of condition numbers.", numbers: "$1/\\kappa=10^{-12}$ means $\\kappa=10^{12}$." }
    ]
  },
  "math-08-16": {
    connectionsProse: "<p>Direct factorizations such as LU and Cholesky can be expensive or memory-heavy for very large sparse systems. Jacobi and Gauss-Seidel take an iterative approach instead. They repeatedly update an approximate solution using the structure of the matrix. These methods also illustrate fixed-point iteration in a linear-system setting.</p>",
    motivation: "<p>The idea is to split the matrix into parts that are easy to use. Jacobi isolates the diagonal and computes all new components from the old iterate. Gauss-Seidel goes one step further by using newly computed components immediately within the same sweep.</p>" +
      "<p>Convergence depends on the matrix and on the resulting iteration map. Diagonal dominance is a common sufficient condition because the diagonal terms control the update strongly enough. When the matrix is very sparse and large, even simple iterations can be valuable because each sweep touches only the nonzero entries.</p>",
    definition: "<p>Splitting $A=D+L+U$, Jacobi uses $$x^{(k+1)}=D^{-1}(b-(L+U)x^{(k)})$$ and Gauss-Seidel uses $$(D+L)x^{(k+1)}=b-Ux^{(k)}$$.</p>" +
      "<p><b>Assumptions that matter:</b> Convergence depends on the matrix and iteration map; diagonal dominance is a common sufficient condition.</p>",
    symbols: [
      { sym: "$D$", desc: "diagonal of $A$" },
      { sym: "$L$", desc: "strictly lower part" },
      { sym: "$U$", desc: "strictly upper part" },
      { sym: "$x^{(k)}$", desc: "current iterate" },
      { sym: "$r=b-Ax$", desc: "residual" },
      { sym: "diagonal dominance", desc: "common convergence condition" }
    ],
    derivation: [
      { do: "Split the matrix.", result: "$A=D+L+U$", why: "the diagonal, lower, and upper parts can be used differently in updates" },
      { do: "Rearrange $Ax=b$ for Jacobi.", result: "$Dx=b-(L+U)x$", why: "the diagonal part is easy to invert componentwise" },
      { do: "Use the old iterate on the right side.", result: "$x^{(k+1)}=D^{-1}(b-(L+U)x^{(k)})$", why: "Jacobi computes all new components from old values" },
      { do: "Rearrange for Gauss-Seidel.", result: "$(D+L)x=b-Ux$", why: "the lower part lets newly computed entries be used immediately" },
      { do: "Use the old iterate only for the upper part.", result: "$(D+L)x^{(k+1)}=b-Ux^{(k)}$", why: "Gauss-Seidel sweeps through the variables using fresh values" },
      { do: "Check the fixed point if the iteration converges.", result: "$Ax=b$", why: "substituting the limit into the fixed-point equation recovers the original system" }
    ],
    applications: [
      { title: "Jacobi worked system", background: "Jacobi updates both variables from the previous iterate.", numbers: "from $(0,0)$, two steps for $4x+y=9$, $x+3y=7$ give $(1.667,1.583)$." },
      { title: "Gauss-Seidel first step", background: "Gauss-Seidel immediately reuses the new first component in the second update.", numbers: "same system gives $(2.25,1.583)$ after one sweep." },
      { title: "Residual", background: "Residuals measure how far a current iterate is from satisfying the linear system.", numbers: "at $(1,1)$, residual is $(4,3)$ with norm $5$." },
      { title: "Diagonal dominance", background: "A dominant diagonal is a simple convergence-friendly structure.", numbers: "$[[5,1],[2,6]]$ passes because $5>1$ and $6>2$." },
      { title: "Convergence factor", background: "Residual ratios can reveal an observed linear convergence rate.", numbers: "residuals $10,4,1.6,0.64$ give factor $0.4$ and next residual $0.256$." },
      { title: "Sparse scale", background: "Very large sparse systems often cannot afford dense direct factorizations.", numbers: "a graph with $10^8$ nodes and $20$ links per node has about $2\\times10^9$ nonzeros, favoring iterative methods." }
    ]
  },
  "math-08-17": {
    connectionsProse: "<p>Interpolation turns sampled data into a function that matches the samples exactly. Polynomial interpolation uses one polynomial of low enough degree to pass through all the given distinct nodes. It connects algebra, function approximation, and numerical data tables. The lesson also sets up why splines can be preferable when many nodes or noisy data are involved.</p>",
    motivation: "<p>The Lagrange form builds the interpolating polynomial from basis polynomials that act like switches at the nodes. Each basis polynomial is $1$ at its own node and $0$ at all the other nodes. Multiplying each basis by the corresponding data value then forces the sum to match every data point.</p>" +
      "<p>Exact matching is useful when the samples are trusted values from a smooth function. It is risky when the data are noisy, because the polynomial is required to chase every point. The uniqueness argument explains why there is only one polynomial of degree at most $n$ through $n+1$ distinct points.</p>",
    definition: "<p>For distinct nodes $x_i$ and values $y_i$, the Lagrange interpolant is $$p(x)=\\sum_i y_i\\ell_i(x),\\qquad \\ell_i(x)=\\prod_{j\\ne i}\\frac{x-x_j}{x_i-x_j}$$.</p>" +
      "<p><b>Assumptions that matter:</b> The nodes must be distinct; with $n+1$ nodes, the interpolating polynomial has degree at most $n$ and is unique.</p>",
    symbols: [
      { sym: "$x_i$", desc: "distinct nodes" },
      { sym: "$y_i$", desc: "data values" },
      { sym: "$p$", desc: "interpolating polynomial" },
      { sym: "$\\ell_i$", desc: "Lagrange basis polynomial" },
      { sym: "degree at most $n$", desc: "degree bound for $n+1$ nodes" }
    ],
    derivation: [
      { do: "Define the Lagrange basis.", result: "$\\ell_i(x)=\\prod_{j\\ne i}(x-x_j)/(x_i-x_j)$", why: "each factor compares $x$ with another node" },
      { do: "Evaluate at its own node.", result: "$\\ell_i(x_i)=1$", why: "every factor becomes $(x_i-x_j)/(x_i-x_j)$" },
      { do: "Evaluate at another node $x_k$.", result: "$\\ell_i(x_k)=0$", why: "one numerator factor is zero" },
      { do: "Form the interpolant.", result: "$p(x)=\\sum_i y_i\\ell_i(x)$", why: "only the matching basis survives at each node" },
      { do: "Check the data values.", result: "$p(x_k)=y_k$", why: "the basis polynomials act like switches" },
      { do: "Prove uniqueness by contradiction.", result: "two degree-$n$ interpolants have zero difference", why: "their difference would have $n+1$ roots, but a nonzero degree-$n$ polynomial has at most $n$ roots" }
    ],
    applications: [
      { title: "Line through two points", background: "Two points determine a unique linear interpolant.", numbers: "$(1,3),(4,9)$ gives $p(x)=2x+1$ and $p(2)=5$." },
      { title: "Quadratic fit", background: "Three distinct points determine a degree-at-most-two polynomial.", numbers: "$(0,1),(1,3),(2,7)$ gives $p(x)=x^2+x+1$, so $p(1.5)=4.75$." },
      { title: "Basis value", background: "A Lagrange basis can be evaluated directly from its product formula.", numbers: "for nodes $0,1,3$, $\\ell_0(2)=(1)(-1)/3=-1/3$." },
      { title: "Calibration table", background: "Linear interpolation estimates between trusted calibration samples.", numbers: "2.0 V at 20 C and 2.5 V at 30 C gives 2.2 V at 24 C by linear interpolation." },
      { title: "Learning curve", background: "A line between two measured epochs gives a simple intermediate estimate.", numbers: "loss $0.8$ at epoch 1 and $0.5$ at epoch 3 gives $0.65$ at epoch 2." },
      { title: "Vandermonde caution", background: "Polynomial interpolation can also be posed as a linear system, which may have numerical conditioning issues.", numbers: "nodes $0,1,2$ produce a $3\\times3$ interpolation system for a quadratic." }
    ]
  },
  "math-08-18": {
    connectionsProse: "<p>Polynomial interpolation gives one global polynomial through all nodes. Splines take a more local approach by using low-degree polynomials on separate intervals. The pieces are tied together by smoothness conditions at the knots. This keeps interpolation flexible while avoiding some instability that can come from one high-degree global polynomial.</p>",
    motivation: "<p>A spline treats each interval between neighboring knots as its own small approximation problem. Low-degree pieces are easier to control than one large polynomial over the whole domain. Matching values makes the curve continuous, and matching derivatives makes the pieces join smoothly.</p>" +
      "<p>There is not one universal spline formula because the construction depends on degree, smoothness, and boundary conditions. Natural and clamped cubic splines make different endpoint choices, and smoothing splines add a tradeoff between fit and roughness. The common principle is local polynomial structure plus linear conditions that determine the pieces.</p>",
    definition: "<p>A spline is a piecewise polynomial function whose pieces are selected on intervals between knots and tied together by value, slope, and possibly curvature matching conditions.</p>" +
      "<p><b>Assumptions that matter:</b> The construction depends on the chosen degree, smoothness, and boundary conditions; there is not one universal spline formula.</p>",
    symbols: [
      { sym: "knots", desc: "input breakpoints" },
      { sym: "$s_i(x)$", desc: "polynomial on interval $i$" },
      { sym: "cubic", desc: "degree at most $3$ per piece" },
      { sym: "natural boundary", desc: "endpoint second derivatives are zero" },
      { sym: "clamped boundary", desc: "endpoint slopes are fixed" }
    ],
    applications: [
      { title: "Local linear piece", background: "A spline interval can use a simple line between neighboring knots.", numbers: "through $(1,2)$ and $(3,3)$, the slope is $0.5$ and $s(2)=2.5$." },
      { title: "First interval", background: "Piecewise construction evaluates each interval from its own local data.", numbers: "through $(0,0)$ and $(1,2)$, $s(0.5)=1$." },
      { title: "Natural boundary", background: "Natural cubic splines set endpoint curvature to zero.", numbers: "for endpoints $0$ and $3$, natural conditions set $s''(0)=0$ and $s''(3)=0$." },
      { title: "Clamped boundary", background: "Clamped splines use known endpoint slopes as constraints.", numbers: "endpoint slopes $4$ and $1$ impose $s'(0)=4$, $s'(3)=1$." },
      { title: "Smoothing spline objective", background: "Smoothing splines trade fit against roughness.", numbers: "fit error $6$ plus $0.5\\cdot2$ roughness gives $7$." },
      { title: "Bezier spline check", background: "Bezier control points define a smooth polynomial segment.", numbers: "endpoints $0,10$ with controls $3,7$ have midpoint value $(0+3\\cdot3+3\\cdot7+10)/8=5$." }
    ]
  },
  "math-08-19": {
    connectionsProse: "<p>Interpolation asks for exact agreement at the data points. Least squares is used when exact agreement is impossible, undesirable, or too sensitive to noise. It chooses coefficients that make the residual vector as small as possible in squared length. This lesson connects approximation, linear algebra, optimization, and the condition-number concerns introduced earlier.</p>",
    motivation: "<p>In an overdetermined system, there may be no vector $x$ with $Ax=b$ exactly. Least squares replaces exact solving with the best compromise under squared residual error. Squaring gives a smooth objective and penalizes larger residuals more strongly.</p>" +
      "<p>The minimum occurs when the residual is orthogonal to every column direction available in $A$. Algebraically, that orthogonality becomes the normal equations. When the columns of $A$ are independent, those equations determine a unique least-squares solution, though the conditioning of $A^TA$ must be treated carefully.</p>",
    definition: "<p>Least squares chooses coefficients that minimize $$\\phi(x)=\\lVert Ax-b\\rVert^2$$, leading to the normal equations $$A^TAx=A^Tb$$.</p>" +
      "<p><b>Assumptions that matter:</b> A unique normal-equation solution requires full column rank; forming $A^TA$ squares the condition number.</p>",
    symbols: [
      { sym: "$A$", desc: "design matrix" },
      { sym: "$x$", desc: "coefficients" },
      { sym: "$b$", desc: "observations" },
      { sym: "$r$", desc: "residual vector" },
      { sym: "$A^T$", desc: "transpose" },
      { sym: "$A^TAx=A^Tb$", desc: "normal equations" }
    ],
    derivation: [
      { do: "For $Ax\\approx b$, define the residual.", result: "$r=Ax-b$", why: "the residual measures mismatch" },
      { do: "Minimize squared residual length.", result: "$\\phi(x)=\\lVert Ax-b\\rVert^2=(Ax-b)^T(Ax-b)$", why: "squared length is smooth and scalar" },
      { do: "Differentiate the quadratic objective.", result: "$\\nabla\\phi(x)=2A^T(Ax-b)$", why: "the derivative points in the direction of residual reduction" },
      { do: "Set the gradient to zero at the minimizer.", result: "$2A^T(Ax-b)=0$", why: "a differentiable minimum has zero gradient" },
      { do: "Rearrange the stationarity condition.", result: "$A^TAx=A^Tb$", why: "these are the normal equations" },
      { do: "Assume $A$ has full column rank.", result: "$A^TA$ is invertible and the solution is unique", why: "independent columns make the quadratic strictly convex" }
    ],
    applications: [
      { title: "Best constant", background: "The least-squares constant is the sample mean.", numbers: "for data $2,4,7$, the constant fit is $13/3\\approx4.333$ and SSE is $12.667$." },
      { title: "One-parameter fit", background: "A one-column least-squares problem has a scalar normal equation.", numbers: "$A=(1,2)$, $b=(3,5)$ gives $x=13/5=2.6$." },
      { title: "Squared errors", background: "SSE and MSE summarize residual size in regression tasks.", numbers: "predictions $2,5,6$ vs labels $3,4,10$ give SSE $18$ and MSE $6$." },
      { title: "Ridge objective", background: "Regularization adds a penalty to squared error.", numbers: "squared error $8$, $\\lambda=0.1$, $\\lVert w\\rVert=5$ gives total $10.5$." },
      { title: "Normal-equation conditioning", background: "Normal equations can magnify existing conditioning problems.", numbers: "if $\\kappa(A)=100$, then $\\kappa(A^TA)=10{,}000$." },
      { title: "Residual orthogonality", background: "At the least-squares solution, the residual is orthogonal to every column direction.", numbers: "at a least-squares solution, $A^Tr=0$; for residual $(1,-1)$ and column $(1,1)$, dot product is $0$." }
    ]
  },
  "math-08-20": {
    connectionsProse: "<p>Calculus defines integrals as exact accumulated quantities, but applications often provide only finitely many function values. Quadrature turns those samples into an approximate integral. Different rules correspond to simple local shapes fitted to the curve. This lesson connects geometric area, sampled data, and approximation error.</p>",
    motivation: "<p>The trapezoid rule replaces the curve over an interval by a straight line through the endpoints. The area under that line is easy to compute, and adding panels gives an estimate over a longer interval. Shared interior points are counted once after the panel areas are combined.</p>" +
      "<p>Other quadrature rules use different local shapes. The midpoint rule uses a rectangle based on the center value, while Simpson's rule uses a quadratic through two endpoints and a midpoint. The common idea is to trade an integral that may be hard to evaluate exactly for a weighted sum of sampled function values.</p>",
    definition: "<p>The trapezoid rule approximates area on one panel by $$\\frac{h}{2}(f(a)+f(b))$$ and on equal panels by $$h(\\tfrac12 f_0+f_1+\\cdots+f_{n-1}+\\tfrac12 f_n)$$.</p>" +
      "<p><b>Assumptions that matter:</b> The composite formula uses equal panel width $h$ and sampled values $f_i=f(a+ih)$; Simpson's rule instead fits a quadratic through endpoints and midpoint.</p>",
    symbols: [
      { sym: "$a,b$", desc: "endpoints" },
      { sym: "$h$", desc: "step size" },
      { sym: "$f_i=f(a+ih)$", desc: "sampled value" },
      { sym: "quadrature", desc: "weighted sum approximating an integral" }
    ],
    derivation: [
      { do: "On one panel $[a,b]$, set the width.", result: "$h=b-a$", why: "the panel width scales the area" },
      { do: "Approximate $f$ by the straight line through endpoint values.", result: "a trapezoid with bases $f(a)$ and $f(b)$", why: "linear interpolation is the simplest local shape using endpoints" },
      { do: "Compute trapezoid area.", result: "$h(f(a)+f(b))/2$", why: "trapezoid area is width times average height" },
      { do: "Add equal-width panels.", result: "shared interior values appear in two neighboring trapezoids", why: "each interior sample is an endpoint of two panels" },
      { do: "Combine weights.", result: "$h(\\tfrac12 f_0+f_1+\\cdots+f_{n-1}+\\tfrac12 f_n)$", why: "endpoints have half weight and interior samples have full weight" },
      { do: "Compare Simpson's rule.", result: "a quadratic replaces the line", why: "a higher-order local shape can improve accuracy for smooth functions" }
    ],
    applications: [
      { title: "One trapezoid", background: "A single trapezoid overestimates this convex quadratic on $[0,2]$.", numbers: "$\\int_0^2 x^2dx$ estimates as $2(0+4)/2=4$; exact is $8/3\\approx2.667$." },
      { title: "Midpoint rule", background: "The midpoint rule uses the center value as a rectangle height.", numbers: "midpoint $1$ gives estimate $2\\cdot1=2$." },
      { title: "Simpson rule", background: "A quadratic rule is exact for this quadratic example.", numbers: "values $0,1,4$ give $2(0+4\\cdot1+4)/6=8/3$." },
      { title: "Composite trapezoid", background: "Multiple panels combine endpoint half-weights and interior full weights.", numbers: "values $1,3,5$ at $h=2$ give $12$." },
      { title: "AUC", background: "ROC area is a trapezoidal integral over sampled FPR and TPR points.", numbers: "TPR $0,0.7,1$ at FPR $0,0.5,1$ gives AUC $0.6$." },
      { title: "Work estimate", background: "Work from a varying force can be approximated by average force times distance.", numbers: "forces $10$ N and $14$ N over $3$ m give trapezoid work $36$ J." }
    ]
  },
  "math-08-21": {
    connectionsProse: "<p>Numerical differentiation is the counterpart of quadrature: instead of estimating accumulated area from samples, it estimates a local rate of change from nearby values. Taylor expansion gives the formulas and their truncation errors. Floating-point rounding adds another source of error because nearby values may be close enough to subtract poorly. This lesson ties calculus, cancellation, and step-size choice together.</p>",
    motivation: "<p>A derivative is the limit of a difference quotient, but a computer cannot take a literal limit. It must choose a finite step size $h$. If $h$ is too large, the difference quotient is a rough approximation; if $h$ is too small, subtracting nearly equal function values can amplify rounding error.</p>" +
      "<p>Forward differences use one nearby point and have first-order truncation error. Central differences use symmetric points, which cancels the leading error term and gives a more accurate formula for smooth functions. The practical step size balances the Taylor truncation error against roundoff from finite precision.</p>",
    definition: "<p>Forward and central finite differences estimate derivatives by $$\\frac{f(x+h)-f(x)}{h}=f'(x)+\\tfrac12hf''(x)+O(h^2)$$ and $$\\frac{f(x+h)-f(x-h)}{2h}=f'(x)+O(h^2)$$.</p>" +
      "<p><b>Assumptions that matter:</b> Taylor expansions require smoothness near $x$; too-small $h$ can make cancellation and roundoff dominate.</p>",
    symbols: [
      { sym: "$h$", desc: "step size" },
      { sym: "$f'(x)$", desc: "true derivative" },
      { sym: "forward difference", desc: "one-sided values" },
      { sym: "central difference", desc: "symmetric values" },
      { sym: "truncation error", desc: "error from omitted Taylor terms" }
    ],
    derivation: [
      { do: "Taylor expand forward.", result: "$f(x+h)=f(x)+hf'(x)+\\tfrac12h^2f''(x)+O(h^3)$", why: "this expresses the nearby value in derivatives at $x$" },
      { do: "Subtract $f(x)$ and divide by $h$.", result: "$(f(x+h)-f(x))/h=f'(x)+\\tfrac12hf''(x)+O(h^2)$", why: "this gives the forward-difference formula and its leading error" },
      { do: "Taylor expand backward.", result: "$f(x-h)=f(x)-hf'(x)+\\tfrac12h^2f''(x)+O(h^3)$", why: "the odd derivative term changes sign" },
      { do: "Subtract the backward expansion from the forward expansion.", result: "$f(x+h)-f(x-h)=2hf'(x)+O(h^3)$", why: "the even second-derivative terms cancel" },
      { do: "Divide by $2h$.", result: "$(f(x+h)-f(x-h))/(2h)=f'(x)+O(h^2)$", why: "central difference has second-order truncation error" }
    ],
    applications: [
      { title: "Forward difference", background: "A one-sided difference estimates the slope from one nearby point.", numbers: "for $x^2$ at $2$ with $h=0.1$, estimate is $4.1$." },
      { title: "Central difference", background: "Symmetric values cancel the leading error for this quadratic.", numbers: "same function and step gives exactly $4$ in this quadratic case." },
      { title: "Cubic central difference", background: "For a cubic, the central-difference error is visible but smaller order.", numbers: "for $x^3$ at $1$ with $h=0.1$, estimate is $3.01$." },
      { title: "Gradient check", background: "Finite differences compare loss changes to analytic gradients.", numbers: "loss $1.00025-1.000$ over $h=0.001$ gives slope $0.25$." },
      { title: "Relative gradient difference", background: "Gradient-check tolerances often use relative discrepancy.", numbers: "analytic $0.250$ vs numerical $0.251$ gives $0.4\\%$." },
      { title: "Roundoff balance", background: "A practical step must avoid both truncation error and cancellation-driven roundoff.", numbers: "a common first-order choice is $h\\approx\\sqrt{u}\\approx1.05\\times10^{-8}$ in double precision." }
    ]
  },
  "math-08-22": {
    connectionsProse: "<p>Eigenvalues describe directions that a matrix stretches without turning. Numerical methods rarely compute all eigen-information by symbolic formulas, especially for large matrices. Power iteration shows the basic computational idea: repeated multiplication reveals the dominant direction. This connects linear algebra to stability, PCA, spectral radius, and iterative algorithms.</p>",
    motivation: "<p>If a starting vector contains some component in the dominant eigenvector direction, multiplying by the matrix repeatedly scales that component by the dominant eigenvalue again and again. Components in weaker eigenvalue directions grow more slowly or shrink relative to it. Normalization keeps the vector size controlled while preserving the direction information.</p>" +
      "<p>The convergence rate depends on the ratio between the next-largest eigenvalue and the dominant eigenvalue. A large spectral gap makes the unwanted components fade quickly; a small gap makes them fade slowly. The Rayleigh quotient then provides a way to estimate the eigenvalue from an approximate eigenvector.</p>",
    definition: "<p>Power iteration repeatedly multiplies by $A$ and normalizes. If $|\\lambda_1|>|\\lambda_2|\\ge\\cdots$ and the start has a component in $v_1$, then $$A^kx_0=c_1\\lambda_1^kv_1+c_2\\lambda_2^kv_2+\\cdots$$ reveals the dominant eigenvector direction.</p>" +
      "<p><b>Assumptions that matter:</b> There must be a unique dominant eigenvalue in magnitude and the starting vector must have nonzero component in the dominant eigenvector direction.</p>",
    symbols: [
      { sym: "$A$", desc: "matrix" },
      { sym: "$v_i$", desc: "eigenvectors" },
      { sym: "$\\lambda_i$", desc: "eigenvalues" },
      { sym: "dominant eigenvalue", desc: "eigenvalue with largest magnitude" },
      { sym: "$x_k$", desc: "power-iteration vector" },
      { sym: "Rayleigh quotient", desc: "eigenvalue estimate from an approximate eigenvector" }
    ],
    derivation: [
      { do: "Assume an eigenbasis with ordered magnitudes.", result: "$|\\lambda_1|>|\\lambda_2|\\ge\\cdots$", why: "a unique dominant eigenvalue gives one direction that eventually wins" },
      { do: "Write the starting vector in eigenvector components.", result: "$x_0=c_1v_1+c_2v_2+\\cdots$ with $c_1\\ne0$", why: "the start must contain some dominant-direction component" },
      { do: "Multiply by $A^k$.", result: "$A^kx_0=c_1\\lambda_1^kv_1+c_2\\lambda_2^kv_2+\\cdots$", why: "each eigenvector component is scaled by its eigenvalue each time" },
      { do: "Factor out the dominant scale.", result: "$\\lambda_1^k(c_1v_1+c_2(\\lambda_2/\\lambda_1)^kv_2+\\cdots)$", why: "this exposes relative decay of non-dominant components" },
      { do: "Use the eigenvalue ratios.", result: "$(\\lambda_i/\\lambda_1)^k$ shrinks for $i>1$", why: "the ratios are below one in magnitude" },
      { do: "Normalize each step.", result: "scale stays controlled while direction approaches $v_1$", why: "normalization prevents overflow and keeps the vector usable" }
    ],
    applications: [
      { title: "Power iteration", background: "Repeated multiplication by a diagonal matrix reveals the larger eigenvalue direction.", numbers: "for $A=\\operatorname{diag}(2,1)$ from $(1,1)$, two normalized steps give $(1,0.25)$." },
      { title: "Rayleigh quotient", background: "An approximate eigenvector gives an eigenvalue estimate from a scalar ratio.", numbers: "for $v=(1,0.5)$, quotient is $2.25/1.25=1.8$." },
      { title: "Convergence ratio", background: "A small spectral gap slows decay of the unwanted component.", numbers: "eigenvalues $10$ and $9$ leave unwanted component factor $0.9^{20}\\approx0.122$." },
      { title: "PCA variance", background: "Principal components use eigenvalues to measure variance captured by directions.", numbers: "eigenvalues $9$ and $1$ mean first PC has $9$ times the variance." },
      { title: "Stability of updates", background: "Spectral radius below one damps repeated linearized errors.", numbers: "spectral radius $0.8$ shrinks errors by $0.8^{10}\\approx0.107$ after ten steps." },
      { title: "Normalization need", background: "Without normalization, dominant eigenvalues can make vector norms grow rapidly.", numbers: "eigenvalue $5$ grows length by $5^4=625$ after four unnormalized steps." }
    ]
  },
  "math-08-23": {
    connectionsProse: "<p>The section's earlier ideas all appear in deep learning systems. Floating-point formats limit range and spacing, conditioning affects optimization, and stable algebraic rewrites prevent overflow or underflow. Deep models scale these issues across many layers, large tensors, and repeated updates. This lesson gathers the numerical habits that make the same mathematical model compute reliably.</p>",
    motivation: "<p>Deep learning computations often involve exponentials, long chains of multiplications, and gradients that vary widely in size. Logits can overflow when exponentiated directly, small gradients can underflow in low precision, and large gradient norms can destabilize updates. These are numerical issues, not changes in the intended model.</p>" +
      "<p>Stable formulas keep the exact mathematics but change the way the computation is performed. Shifting logits before softmax multiplies numerator and denominator by the same positive factor, so probabilities do not change. Loss scaling, clipping, normalization, and log-sum-exp use the same practical principle: respect finite precision while preserving the intended calculation.</p>",
    definition: "<p>Softmax can be computed stably by shifting logits by their maximum: $$p_i=\\frac{e^{z_i-m}}{\\sum_j e^{z_j-m}},\\qquad m=\\max_j z_j$$.</p>" +
      "<p><b>Assumptions that matter:</b> The same positive factor is applied to every numerator and the denominator, so probabilities are unchanged while the largest exponent becomes $e^0=1$.</p>",
    symbols: [
      { sym: "$z_i$", desc: "logits" },
      { sym: "$p_i$", desc: "softmax probabilities" },
      { sym: "$m$", desc: "maximum logit" },
      { sym: "fp32/fp16/bfloat16", desc: "floating formats" },
      { sym: "loss scaling", desc: "temporarily multiplies small gradients" },
      { sym: "clipping", desc: "rescales large gradient norms" }
    ],
    derivation: [
      { do: "Start with softmax.", result: "$p_i=e^{z_i}/\\sum_j e^{z_j}$", why: "probabilities are exponentials normalized by their sum" },
      { do: "Let the shift be the maximum logit.", result: "$m=\\max_j z_j$", why: "subtracting the maximum makes the largest shifted logit zero" },
      { do: "Multiply numerator and denominator by $e^{-m}$.", result: "$p_i=e^{z_i}e^{-m}/\\sum_j e^{z_j}e^{-m}$", why: "multiplying top and bottom by the same positive factor does not change the ratio" },
      { do: "Combine exponents.", result: "$p_i=e^{z_i-m}/\\sum_j e^{z_j-m}$", why: "this is the shifted softmax formula" },
      { do: "Check invariance.", result: "probabilities are unchanged", why: "the same factor was applied to every term" },
      { do: "Bound the largest exponent.", result: "$e^{m-m}=e^0=1$", why: "no shifted exponent exceeds one, preventing overflow from large logits" }
    ],
    applications: [
      { title: "Stable softmax", background: "Subtracting the maximum logit avoids overflow without changing probabilities.", numbers: "logits $[1000,1001,1002]$ shift to $[-2,-1,0]$ and largest probability is $0.6652$." },
      { title: "Log-sum-exp", background: "The same max-shift idea stabilizes sums inside a logarithm.", numbers: "for $[10,12]$, stable value is $12+\\log(1+e^{-2})\\approx12.1269$." },
      { title: "Loss scaling", background: "Multiplying small gradients can keep them representable in low precision before unscaling.", numbers: "gradient $2\\times10^{-8}$ scaled by $1024$ becomes $2.048\\times10^{-5}$." },
      { title: "Gradient clipping", background: "Clipping limits a large update direction by rescaling all gradient components.", numbers: "norm $12$ clipped to threshold $3$ scales all components by $0.25$." },
      { title: "Layer normalization", background: "Normalization controls activation scale before subsequent operations.", numbers: "values $[2,4,6]$ have mean $4$ and standard deviation $1.633$, giving normalized values about $[-1.225,0,1.225]$." },
      { title: "Attention scores", background: "Attention softmax uses the same shift to handle large score differences safely.", numbers: "scores $[30,35]$ shift to $[-5,0]$, giving probabilities about $[0.0067,0.9933]$." }
    ]
  }
};
