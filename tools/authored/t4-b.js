module.exports = {
  "math-04-12": {
    id: "math-04-12",
    title: "Convergence tests for series",
    tagline: "Convergence tests let you decide whether infinitely many small terms add to a finite total.",
    connections: { buildsOn: ["Infinite series", "limits of sequences", "positive sequences"], leadsTo: ["Absolute and conditional convergence", "power series", "Taylor's theorem with remainder"], usedWith: ["comparison", "$p$-series", "geometric series", "ratio and root limits"] },
    motivation: `<p>You already know how to add a long finite list. A series asks for more: if the list never ends, do the partial sums settle down? The geometric series $1+\\dfrac12+\\dfrac14+\\cdots=2$ says yes, while $1+\\dfrac12+\\dfrac13+\\cdots$ says no.</p><p><b>Convergence tests</b> are careful shortcuts. They replace the impossible task of adding forever with a finite diagnosis: compare the tail to a series whose behavior you already trust, or measure how fast the terms shrink.</p>`,
    definition: `<p>A series $\\sum_{n=1}^{\\infty}a_n$ converges when its partial sums $s_N=\\sum_{n=1}^{N}a_n$ converge to a finite limit. The first necessary test is $a_n\\to0$; if not, the series diverges. For nonnegative terms, comparison says $0\\le a_n\\le b_n$ and $\\sum b_n$ convergent implies $\\sum a_n$ convergent, while $0\\le b_n\\le a_n$ and $\\sum b_n$ divergent implies $\\sum a_n$ divergent.</p><p>The ratio test follows from comparison with a geometric series. If $\\lim |a_{n+1}/a_n|=L<1$, then eventually the terms shrink like $r^n$ for some $L<r<1$, so the tail is bounded by a convergent geometric tail. If $L>1$, the terms do not tend to zero.</p><p><b>Assumptions that matter:</b> comparison tests require eventual nonnegative terms; the term test proves only divergence; ratio and root tests are inconclusive when the limit is $1$; endpoint or borderline cases often need a different test.</p>`,
    worked: {
      problem: "Determine whether $\\displaystyle\\sum_{n=1}^{\\infty}\\frac{4n+3}{n^3+1}$ converges.",
      skills: ["limit comparison", "$p$-series", "tail behavior"],
      strategy: "The leading terms look like $4n/n^3=4/n^2$, so compare with the convergent $p$-series $\\sum 1/n^2$.",
      steps: [
        { do: "Choose a comparison", result: "$b_n=1/n^2$", why: "the largest powers control the tail" },
        { do: "Form the ratio", result: "$\\dfrac{a_n}{b_n}=\\dfrac{4n+3}{n^3+1}\\cdot n^2$", why: "limit comparison checks long-run proportionality" },
        { do: "Multiply", result: "$\\dfrac{4n^3+3n^2}{n^3+1}$", why: "write one rational expression" },
        { do: "Divide by $n^3$", result: "$\\dfrac{4+3/n}{1+1/n^3}$", why: "vanishing terms become visible" },
        { do: "Take the limit", result: "$4$", why: "$3/n\\to0$ and $1/n^3\\to0$" },
        { do: "Classify the comparison series", result: "$\\sum 1/n^2$ converges", why: "it is a $p$-series with $p=2>1$" }
      ],
      verify: "The comparison limit is finite and positive, so the two positive series share behavior; the known one converges.",
      answer: "The series converges by limit comparison with $\\sum 1/n^2$.",
      connects: "A convergence test reads the tail shape instead of trying to add infinitely many terms."
    },
    practice: [
      { problem: "Test $\\displaystyle\\sum_{n=1}^{\\infty}\\frac{7}{3^n}$.", steps: [
        { do: "Rewrite the terms", result: "$7(1/3)^n$", why: "this is geometric" },
        { do: "Identify the ratio", result: "$r=1/3$", why: "successive terms multiply by $1/3$" },
        { do: "Check the condition", result: "$|r|<1$", why: "geometric series converge exactly then" },
        { do: "Find the first term", result: "$7/3$", why: "the sum starts at $n=1$" },
        { do: "Compute the sum", result: "$\\dfrac{7/3}{1-1/3}=\\dfrac72$", why: "geometric sum formula" }
      ], answer: "Converges, with sum $7/2$." },
      { problem: "Test $\\displaystyle\\sum_{n=2}^{\\infty}\\frac{1}{n(\\ln n)^2}$.", steps: [
        { do: "Choose the integral test", result: "$f(x)=1/[x(\\ln x)^2]$", why: "the terms are positive and eventually decreasing" },
        { do: "Set up the integral", result: "$\\int_2^{\\infty}\\dfrac{dx}{x(\\ln x)^2}$", why: "series and integral share tail behavior" },
        { do: "Substitute", result: "$u=\\ln x$, $du=dx/x$", why: "this matches the denominator" },
        { do: "Integrate", result: "$\\int_{\\ln2}^{\\infty}u^{-2}\\,du$", why: "the integral becomes a $p$-type integral" },
        { do: "Evaluate the improper integral", result: "$[-1/u]_{\\ln2}^{\\infty}=1/\\ln2$", why: "the upper endpoint contributes $0$" }
      ], answer: "Converges by the integral test." },
      { problem: "Test $\\displaystyle\\sum_{n=1}^{\\infty}\\frac{n}{n^2+5}$.", steps: [
        { do: "Choose a comparison", result: "$1/n$", why: "the term has leading size $n/n^2$" },
        { do: "Form the limit comparison", result: "$\\dfrac{n/(n^2+5)}{1/n}=\\dfrac{n^2}{n^2+5}$", why: "compare long-run scale" },
        { do: "Divide by $n^2$", result: "$\\dfrac{1}{1+5/n^2}$", why: "prepare the limit" },
        { do: "Take the limit", result: "$1$", why: "$5/n^2\\to0$" },
        { do: "Use the known behavior", result: "$\\sum 1/n$ diverges", why: "the harmonic series diverges" }
      ], answer: "Diverges by limit comparison with the harmonic series." },
      { problem: "Test $\\displaystyle\\sum_{n=1}^{\\infty}\\frac{n!}{10^n}$.", steps: [
        { do: "Choose the ratio test", result: "$a_n=n!/10^n$", why: "factorials simplify in ratios" },
        { do: "Form the ratio", result: "$\\dfrac{a_{n+1}}{a_n}=\\dfrac{(n+1)!}{10^{n+1}}\\cdot\\dfrac{10^n}{n!}$", why: "compare consecutive terms" },
        { do: "Cancel factors", result: "$\\dfrac{n+1}{10}$", why: "$n!$ and $10^n$ cancel" },
        { do: "Take the limit", result: "$\\infty$", why: "the numerator grows without bound" },
        { do: "Apply the ratio test", result: "diverges", why: "ratio eventually exceeds $1$" }
      ], answer: "Diverges by the ratio test." },
      { problem: "A gradient-noise proof uses $\\displaystyle\\sum_{t=1}^{\\infty}\\eta_t^2$ with $\\eta_t=0.1/t$. Test it.", steps: [
        { do: "Square the schedule", result: "$\\eta_t^2=0.01/t^2$", why: "variance terms use squared learning rates" },
        { do: "Factor the constant", result: "$0.01\\sum_{t=1}^{\\infty}1/t^2$", why: "constants do not affect convergence" },
        { do: "Identify the $p$-series", result: "$p=2$", why: "the denominator is $t^2$" },
        { do: "Check the condition", result: "$2>1$", why: "$p$-series converge for $p>1$" },
        { do: "State the implication", result: "the squared schedule is summable", why: "the noise contribution has finite total bound" }
      ], answer: "$\\sum \\eta_t^2$ converges." }
    ],
    applications: [
      { title: "Learning-rate schedules", background: "Classical stochastic approximation separates total movement from total noise using two series tests.", numbers: "For $\\eta_t=1/t$, $\\sum\\eta_t$ diverges but $\\sum\\eta_t^2=\\sum1/t^2$ converges, matching the standard condition." },
      { title: "Taylor tail control", background: "Numerical libraries approximate smooth functions by truncating infinite series and bounding the tail.", numbers: "For $e^{0.5}$, the fifth term is $0.5^5/5!=0.0002604$, already below $3\\times10^{-4}$." },
      { title: "Discounted reinforcement learning", background: "Discounted returns are geometric series when rewards are bounded.", numbers: "If $|r_t|\\le3$ and $\\gamma=0.9$, then total magnitude is at most $3/(1-0.9)=30$." },
      { title: "Iterative solver errors", background: "Many linear solvers reduce error by a fixed factor each iteration.", numbers: "Starting error $5$ with ratio $0.2$ has tail after step $4$ bounded by $5(0.2)^4/(1-0.2)=0.01$." },
      { title: "Feature expansions", background: "Kernel and basis methods may add infinitely many features in theory, then keep a finite prefix in practice.", numbers: "A tail $\\sum_{n=8}^{\\infty}0.1^n=0.1^8/0.9\\approx1.11\\times10^{-8}$ is negligible." },
      { title: "Runtime expectations", background: "Expected costs can be infinite or finite depending on tail probabilities.", numbers: "If a retry takes $n$ ms with probability $2^{-n}$, comparison with $\\sum n/2^n=2$ shows finite expected time." }
    ],
    applicationsClose: "The same question keeps returning: does the long tail have finite total weight?",
    takeaways: ["A series converges when partial sums approach a finite limit.", "Comparison tests transfer known behavior from simpler positive series.", "Ratio and root tests detect geometric-rate decay, but limit $1$ is inconclusive.", "Series tests are tail tools: finite early terms never decide convergence."]
  },

  "math-04-13": {
    id: "math-04-13",
    title: "Absolute and conditional convergence",
    tagline: "Absolute convergence is robust convergence; conditional convergence is real but delicate.",
    connections: { buildsOn: ["Convergence tests for series", "alternating series", "absolute values"], leadsTo: ["Limits of functions (ε–δ)", "rearrangements", "power series"], usedWith: ["comparison", "alternating series test", "Cauchy criterion", "rearrangement"] },
    motivation: `<p>You have seen that signs can help a series settle. The alternating harmonic series $1-\\dfrac12+\\dfrac13-\\dfrac14+\\cdots$ converges, even though the positive harmonic series diverges.</p><p>That raises a careful question: is the series converging because the magnitudes are genuinely small enough, or because positive and negative terms cancel in just the right order? Absolute and conditional convergence separate those two stories.</p>`,
    definition: `<p>A series $\\sum a_n$ is <b>absolutely convergent</b> if $\\sum |a_n|$ converges. It is <b>conditionally convergent</b> if $\\sum a_n$ converges but $\\sum |a_n|$ diverges. Absolute convergence implies convergence because the positive and negative parts are each bounded by the absolute-value sum.</p><p>For alternating series $\\sum (-1)^n b_n$ with $b_n\\ge0$, if $b_n$ decreases to $0$, then the partial sums converge. The proof traps even and odd partial sums around the same limit: one monotone sequence descends, the other ascends, and the gap is $b_{N+1}\\to0$.</p><p><b>Assumptions that matter:</b> absolute convergence survives rearrangement; conditional convergence can change value under rearrangement; the alternating test needs eventual decrease and $b_n\\to0$; convergence of $\\sum a_n$ alone does not imply convergence of $\\sum |a_n|$.</p>`,
    worked: {
      problem: "Classify $\\displaystyle\\sum_{n=1}^{\\infty}\\frac{(-1)^{n+1}}{n}$ as absolutely convergent, conditionally convergent, or divergent.",
      skills: ["alternating series", "absolute convergence", "harmonic series"],
      strategy: "Test the signed series with alternating behavior, then test absolute values separately.",
      steps: [
        { do: "Name the magnitudes", result: "$b_n=1/n$", why: "the signs alternate outside the positive size" },
        { do: "Check the limit", result: "$b_n\\to0$", why: "terms must shrink to zero" },
        { do: "Check monotonicity", result: "$b_{n+1}<b_n$", why: "reciprocals decrease" },
        { do: "Apply the alternating test", result: "$\\sum (-1)^{n+1}/n$ converges", why: "decreasing magnitudes tend to zero" },
        { do: "Take absolute values", result: "$\\sum |(-1)^{n+1}/n|=\\sum1/n$", why: "absolute values remove signs" },
        { do: "Classify the absolute series", result: "diverges", why: "the harmonic series diverges" }
      ],
      verify: "The signed series converges but its magnitude-only version diverges, so cancellation is essential.",
      answer: "The alternating harmonic series converges conditionally.",
      connects: "Conditional convergence means the order and signs are doing real work."
    },
    practice: [
      { problem: "Classify $\\displaystyle\\sum_{n=1}^{\\infty}\\frac{(-1)^n}{n^2}$.", steps: [
        { do: "Take absolute values", result: "$\\sum 1/n^2$", why: "absolute convergence is tested first" },
        { do: "Identify the series", result: "$p=2$", why: "this is a $p$-series" },
        { do: "Check convergence", result: "converges", why: "$p=2>1$" },
        { do: "Transfer to the signed series", result: "$\\sum (-1)^n/n^2$ converges", why: "absolute convergence implies convergence" },
        { do: "Classify", result: "absolutely convergent", why: "the absolute-value series converges" }
      ], answer: "Absolutely convergent." },
      { problem: "Classify $\\displaystyle\\sum_{n=2}^{\\infty}\\frac{(-1)^n}{\\sqrt n}$.", steps: [
        { do: "Set magnitudes", result: "$b_n=1/\\sqrt n$", why: "ignore signs for the alternating test" },
        { do: "Check the limit", result: "$b_n\\to0$", why: "square roots grow" },
        { do: "Check decrease", result: "$b_{n+1}<b_n$", why: "reciprocal square roots decrease" },
        { do: "Apply alternating convergence", result: "the signed series converges", why: "the alternating test applies" },
        { do: "Test absolute convergence", result: "$\\sum 1/n^{1/2}$ diverges", why: "$p=1/2\\le1$" }
      ], answer: "Conditionally convergent." },
      { problem: "Classify $\\displaystyle\\sum_{n=1}^{\\infty}(-1)^n\\frac{n}{n+1}$.", steps: [
        { do: "Find term magnitudes", result: "$b_n=n/(n+1)$", why: "alternating signs alone are not enough" },
        { do: "Take the limit", result: "$b_n\\to1$", why: "divide top and bottom by $n$" },
        { do: "Check the term test", result: "$a_n$ does not tend to $0$", why: "the signed terms oscillate near $\\pm1$" },
        { do: "Apply divergence", result: "diverges", why: "a necessary condition fails" },
        { do: "Skip absolute classification", result: "not convergent", why: "conditional or absolute labels require convergence first" }
      ], answer: "Divergent by the term test." },
      { problem: "Classify $\\displaystyle\\sum_{n=1}^{\\infty}\\frac{\\sin n}{n^2}$.", steps: [
        { do: "Bound the absolute value", result: "$|\\sin n/n^2|\\le1/n^2$", why: "$|\\sin n|\\le1$" },
        { do: "Use a known series", result: "$\\sum1/n^2$ converges", why: "$p=2>1$" },
        { do: "Apply comparison", result: "$\\sum |\\sin n|/n^2$ converges", why: "bounded above by a convergent positive series" },
        { do: "Conclude signed convergence", result: "$\\sum \\sin n/n^2$ converges", why: "absolute convergence implies convergence" },
        { do: "Classify", result: "absolutely convergent", why: "the absolute-value series converges" }
      ], answer: "Absolutely convergent." },
      { problem: "A stochastic update has corrections $(-1)^{t+1}/t$ in a fixed order. What kind of convergence describes the total correction?", steps: [
        { do: "Write the series", result: "$\\sum_{t=1}^{\\infty}(-1)^{t+1}/t$", why: "the correction signs alternate" },
        { do: "Check alternating conditions", result: "$1/t\\downarrow0$", why: "magnitudes decrease to zero" },
        { do: "Conclude signed convergence", result: "converges", why: "alternating series test" },
        { do: "Take absolute values", result: "$\\sum1/t$", why: "remove cancellation" },
        { do: "Classify absolute behavior", result: "diverges", why: "harmonic series" }
      ], answer: "The correction sum is conditionally convergent." }
    ],
    applications: [
      { title: "Numerical summation order", background: "Floating-point arithmetic already depends on order; conditional series add a mathematical version of that fragility.", numbers: "Summing $1-1/2+1/3-1/4$ gives $0.5833$, while grouping $(1-1/2)+(-1/4+1/3)$ gives $0.5833$ here, but infinite rearrangements can change conditionally convergent limits." },
      { title: "Fourier series", background: "Signals are often represented by signed sine and cosine coefficients whose absolute summability controls robustness.", numbers: "Coefficients $1/n^2$ are absolutely summable; coefficients $(-1)^n/n$ are only conditionally summable." },
      { title: "Gradient noise cancellation", background: "Alternating errors may cancel in a fixed schedule, but absolute bounds are safer for proofs.", numbers: "Errors $0.1(-1)^t/t$ have conditional total, while $0.1/t^2$ has absolute total $0.1\\pi^2/6\\approx0.1645$." },
      { title: "Perturbation expansions", background: "Physics and approximation theory often distinguish convergent magnitude from lucky sign cancellation.", numbers: "Terms $(-0.2)^n$ converge absolutely because $\\sum0.2^n=0.25$ from $n=1$." },
      { title: "Regularization penalties", background: "Absolute summability of coefficients makes infinite linear models stable under reordering and implementation details.", numbers: "Weights $w_n=1/2^n$ satisfy $\\sum|w_n|=1$, so feature contributions stay bounded if $|x_n|\\le1$." },
      { title: "Monte Carlo control variates", background: "Signed corrections reduce variance by cancellation, but absolute bounds give reliable worst-case guarantees.", numbers: "Corrections $0.05(-1)^n/n$ cancel conditionally; replacing by $0.05/n^2$ gives absolute total about $0.0822$." }
    ],
    applicationsClose: "Absolute convergence is convergence with a safety margin; conditional convergence is useful but order-sensitive.",
    takeaways: ["Absolute convergence means $\\sum |a_n|$ converges.", "Absolute convergence implies ordinary convergence.", "Conditional convergence means the signed series converges but the absolute series diverges.", "Alternating cancellation can prove convergence, but it may depend on order."]
  },

  "math-04-14": {
    id: "math-04-14",
    title: "Limits of functions (ε–δ)",
    tagline: "The epsilon-delta definition turns the phrase 'as close as we like' into a precise promise.",
    connections: { buildsOn: ["Absolute and conditional convergence", "limits of sequences", "inequalities"], leadsTo: ["Continuity (ε–δ)", "the derivative, rigorously", "uniform continuity"], usedWith: ["neighborhoods", "proof by inequalities", "squeeze theorem", "sequential limits"] },
    motivation: `<p>You already compute limits by simplifying, graphing, or substituting after removing a hole. Real analysis asks one more honest question: what does it mean to say the outputs get close?</p><p>The $\\varepsilon$-$\\delta$ definition answers with a game. Someone names an output tolerance $\\varepsilon>0$. You respond with an input tolerance $\\delta>0$ that forces every nearby input to produce an output within $\\varepsilon$ of the target.</p>`,
    definition: `<p>We write $\\lim_{x\\to a}f(x)=L$ if for every $\\varepsilon>0$ there exists $\\delta>0$ such that whenever $0<|x-a|<\\delta$, we have $|f(x)-L|<\\varepsilon$. Here $\\varepsilon$ is the allowed output error, $\\delta$ is the input radius, $a$ is the approach point, and $L$ is the proposed limit.</p><p>For a proof, start from $|f(x)-L|$ and bound it by something involving $|x-a|$. If $|f(x)-L|\\le C|x-a|$, choose $\\delta=\\varepsilon/C$. The puncture $0<|x-a|$ means the value at $a$ itself is irrelevant.</p><p><b>Assumptions that matter:</b> $\\delta$ may depend on $\\varepsilon$ and on the point $a$; it must not depend on the particular $x$ chosen after the fact; both sides of $a$ are included unless the domain restricts the approach; the definition proves a claimed limit, not just a computed value.</p>`,
    worked: {
      problem: "Prove $\\displaystyle\\lim_{x\\to3}(2x+1)=7$ using $\\varepsilon$-$\\delta$.",
      skills: ["epsilon-delta proof", "linear bounds", "choosing $\\delta$"],
      strategy: "Rewrite the output error as a constant times the input error, then choose $\\delta$ to make it less than $\\varepsilon$.",
      steps: [
        { do: "Compute the output error", result: "$|(2x+1)-7|$", why: "compare $f(x)$ to the proposed limit" },
        { do: "Simplify", result: "$|2x-6|$", why: "combine constants" },
        { do: "Factor", result: "$2|x-3|$", why: "separate the input error" },
        { do: "Set a sufficient condition", result: "$2|x-3|<\\varepsilon$", why: "this guarantees the desired output error" },
        { do: "Solve for input error", result: "$|x-3|<\\varepsilon/2$", why: "divide by $2$" },
        { do: "Choose delta", result: "$\\delta=\\varepsilon/2$", why: "then $0<|x-3|<\\delta$ forces the bound" }
      ],
      verify: "If $0<|x-3|<\\varepsilon/2$, then $|(2x+1)-7|=2|x-3|<\\varepsilon$.",
      answer: "For every $\\varepsilon>0$, choose $\\delta=\\varepsilon/2$; this proves the limit is $7$.",
      connects: "The whole proof is a controlled translation from input closeness to output closeness."
    },
    practice: [
      { problem: "Prove $\\lim_{x\\to2}(5x-4)=6$.", steps: [
        { do: "Write the output error", result: "$|(5x-4)-6|$", why: "compare to the claimed limit" },
        { do: "Simplify", result: "$|5x-10|$", why: "combine constants" },
        { do: "Factor", result: "$5|x-2|$", why: "isolate the input error" },
        { do: "Require this below $\\varepsilon$", result: "$5|x-2|<\\varepsilon$", why: "this is enough" },
        { do: "Choose", result: "$\\delta=\\varepsilon/5$", why: "then $|x-2|<\\delta$ gives the desired bound" }
      ], answer: "Choose $\\delta=\\varepsilon/5$." },
      { problem: "Prove $\\lim_{x\\to1}x^2=1$.", steps: [
        { do: "Factor the error", result: "$|x^2-1|=|x-1||x+1|$", why: "one factor is the input error" },
        { do: "Add a local restriction", result: "$|x-1|<1$", why: "this keeps $x$ near $1$" },
        { do: "Bound $x$", result: "$0<x<2$", why: "within distance $1$ of $1$" },
        { do: "Bound the extra factor", result: "$|x+1|<3$", why: "$x<2$ gives $x+1<3$" },
        { do: "Force the product", result: "$|x^2-1|<3|x-1|$", why: "use the bound" },
        { do: "Choose delta", result: "$\\delta=\\min(1,\\varepsilon/3)$", why: "satisfy both the local bound and the error bound" }
      ], answer: "Choose $\\delta=\\min(1,\\varepsilon/3)$." },
      { problem: "Prove $\\lim_{x\\to0}3x^2=0$.", steps: [
        { do: "Write the output error", result: "$|3x^2-0|=3|x|^2$", why: "target limit is zero" },
        { do: "Set the desired inequality", result: "$3|x|^2<\\varepsilon$", why: "this is exactly what we need" },
        { do: "Solve for $|x|$", result: "$|x|<\\sqrt{\\varepsilon/3}$", why: "take square roots" },
        { do: "Choose delta", result: "$\\delta=\\sqrt{\\varepsilon/3}$", why: "positive for every $\\varepsilon>0$" },
        { do: "Check implication", result: "$0<|x|<\\delta\\Rightarrow3x^2<\\varepsilon$", why: "square the chosen bound" }
      ], answer: "Choose $\\delta=\\sqrt{\\varepsilon/3}$." },
      { problem: "Prove $\\lim_{x\\to4}\\sqrt{x}=2$ using the conjugate idea.", steps: [
        { do: "Write the error", result: "$|\\sqrt{x}-2|$", why: "compare outputs" },
        { do: "Multiply by a conjugate form", result: "$\\dfrac{|x-4|}{\\sqrt{x}+2}$", why: "rationalize the difference" },
        { do: "Bound the denominator", result: "$\\sqrt{x}+2\\ge2$", why: "square roots are nonnegative near the domain" },
        { do: "Bound the error", result: "$|\\sqrt{x}-2|\\le |x-4|/2$", why: "larger denominator means smaller fraction" },
        { do: "Choose delta", result: "$\\delta=2\\varepsilon$", why: "then $|x-4|/2<\\varepsilon$" }
      ], answer: "Choose $\\delta=2\\varepsilon$ for domain points $x\\ge0$." },
      { problem: "A scalar model score is $s(w)=4w+0.2$. Prove that as $w\\to1$, $s(w)\\to4.2$ and find $\\delta$ for $\\varepsilon=0.01$.", steps: [
        { do: "Write the error", result: "$|(4w+0.2)-4.2|$", why: "compare score to target" },
        { do: "Simplify", result: "$4|w-1|$", why: "factor the input error" },
        { do: "Choose symbolic delta", result: "$\\delta=\\varepsilon/4$", why: "make $4|w-1|<\\varepsilon$" },
        { do: "Substitute $\\varepsilon=0.01$", result: "$\\delta=0.01/4$", why: "use the requested tolerance" },
        { do: "Compute", result: "$\\delta=0.0025$", why: "divide by $4$" }
      ], answer: "Choose $\\delta=\\varepsilon/4$; for $\\varepsilon=0.01$, use $\\delta=0.0025$." }
    ],
    applications: [
      { title: "Numerical tolerance design", background: "Engineering code often translates an output tolerance into an input tolerance, exactly the epsilon-delta pattern.", numbers: "For $f(x)=2x$, output error below $0.001$ requires input error below $0.0005$." },
      { title: "Gradient checking", background: "Finite-difference checks rely on limiting statements becoming true below small step sizes.", numbers: "If error is bounded by $5h$, then target error $10^{-4}$ is guaranteed when $h<2\\times10^{-5}$." },
      { title: "Sensor calibration", background: "A sensor specification turns physical input closeness into voltage output closeness.", numbers: "If voltage is $0.02T+0.5$, keeping voltage within $0.01$ V requires temperature within $0.5^\\circ$C." },
      { title: "Robust thresholds", background: "A classifier score near a threshold needs input margins so small perturbations do not flip decisions.", numbers: "If score changes at most $3\\|\\Delta x\\|$ and margin is $0.06$, perturbations below $0.02$ keep the sign." },
      { title: "Floating-point APIs", background: "Libraries document tolerances because exact equality is rarely the right promise.", numbers: "If a routine has output error at most $10h$, choosing $h=10^{-8}$ gives error at most $10^{-7}$." },
      { title: "Continuity proofs in optimization", background: "Existence theorems for minimizers start with rigorous control of objective changes.", numbers: "For $L(w)=w^2$ near $2$, $|w-2|<0.001$ gives $|L(w)-4|<5(0.001)=0.005$ using a local bound." }
    ],
    applicationsClose: "Epsilon-delta rigor is the language of guaranteed tolerance transfer.",
    takeaways: ["$\\varepsilon$ controls output error; $\\delta$ controls input error.", "A proof works by bounding $|f(x)-L|$ in terms of $|x-a|$.", "The value $f(a)$ is irrelevant to the limit because $0<|x-a|$ punctures the point.", "Delta may depend on epsilon and the approach point, but not on the later choice of $x$." ]
  },

  "math-04-15": {
    id: "math-04-15",
    title: "Continuity (ε–δ)",
    tagline: "Continuity says nearby inputs force nearby outputs, with the function value as the destination.",
    connections: { buildsOn: ["Limits of functions (ε–δ)", "functions", "absolute value inequalities"], leadsTo: ["Properties of continuous functions", "Uniform continuity", "the derivative, rigorously"], usedWith: ["composition", "local bounds", "intermediate values", "compact intervals"] },
    motivation: `<p>You already recognize a continuous graph as one without a jump or hole. The $\\varepsilon$-$\\delta$ definition gives that picture a precise test at a point.</p><p>Continuity is a promise from the function: if you demand the output stay within $\\varepsilon$ of $f(a)$, I can tell you how close $x$ must stay to $a$. No surprise at the point.</p>`,
    definition: `<p>A function $f$ is continuous at $a$ if for every $\\varepsilon>0$ there exists $\\delta>0$ such that $|x-a|<\\delta$ and $x$ in the domain imply $|f(x)-f(a)|<\\varepsilon$. Equivalently, $\\lim_{x\\to a}f(x)=f(a)$.</p><p>This is the limit definition with the target $L$ replaced by the actual value $f(a)$. The proof pattern is the same: start with $|f(x)-f(a)|$, bound it using $|x-a|$, and choose $\\delta$ small enough.</p><p><b>Assumptions that matter:</b> continuity is relative to the domain; endpoints use one-sided neighborhoods within the domain; $\\delta$ may depend on the point $a$; sums, products, quotients with nonzero denominator, and compositions preserve continuity when their parts are continuous.</p>`,
    worked: {
      problem: "Prove that $f(x)=x^2$ is continuous at $a=3$.",
      skills: ["epsilon-delta continuity", "local bounding", "factoring"],
      strategy: "Factor the output change and locally bound the harmless factor $|x+3|$.",
      steps: [
        { do: "Write the output change", result: "$|x^2-3^2|$", why: "compare $f(x)$ to $f(3)$" },
        { do: "Factor", result: "$|x-3||x+3|$", why: "difference of squares" },
        { do: "Impose a local restriction", result: "$|x-3|<1$", why: "keep $x$ near $3$" },
        { do: "Bound $x$", result: "$2<x<4$", why: "distance less than $1$ from $3$" },
        { do: "Bound the second factor", result: "$|x+3|<7$", why: "$x<4$ gives $x+3<7$" },
        { do: "Choose delta", result: "$\\delta=\\min(1,\\varepsilon/7)$", why: "control both the local bound and the output error" }
      ],
      verify: "If $|x-3|<\\delta$, then $|x^2-9|<7|x-3|\\le7\\delta\\le\\varepsilon$.",
      answer: "$x^2$ is continuous at $3$.",
      connects: "Continuity is a limit proof where the target is the actual function value."
    },
    practice: [
      { problem: "Prove $f(x)=4x-1$ is continuous at $a=2$.", steps: [
        { do: "Evaluate the point", result: "$f(2)=7$", why: "this is the target value" },
        { do: "Write the error", result: "$|(4x-1)-7|$", why: "compare output values" },
        { do: "Simplify", result: "$4|x-2|$", why: "factor the input error" },
        { do: "Require the error below $\\varepsilon$", result: "$4|x-2|<\\varepsilon$", why: "this is enough" },
        { do: "Choose delta", result: "$\\delta=\\varepsilon/4$", why: "then $|x-2|<\\delta$ works" }
      ], answer: "Choose $\\delta=\\varepsilon/4$; the function is continuous at $2$." },
      { problem: "Prove $f(x)=1/x$ is continuous at $a=2$.", steps: [
        { do: "Write the error", result: "$\\left|\\dfrac1x-\\dfrac12\\right|$", why: "compare $f(x)$ with $f(2)$" },
        { do: "Combine fractions", result: "$\\dfrac{|x-2|}{2|x|}$", why: "use a common denominator" },
        { do: "Restrict locally", result: "$|x-2|<1$", why: "keep $x$ away from zero" },
        { do: "Bound the denominator", result: "$|x|>1$", why: "$x$ stays between $1$ and $3$" },
        { do: "Bound the error", result: "$\\dfrac{|x-2|}{2}$", why: "$2|x|>2$" },
        { do: "Choose delta", result: "$\\delta=\\min(1,2\\varepsilon)$", why: "then $|x-2|/2<\\varepsilon$" }
      ], answer: "Choose $\\delta=\\min(1,2\\varepsilon)$." },
      { problem: "Show $f(x)=|x|$ is continuous at $a=-3$.", steps: [
        { do: "Use reverse triangle inequality", result: "$||x|-|-3||\\le|x-(-3)|$", why: "absolute value is distance from zero" },
        { do: "Simplify the point", result: "$||x|-3|\\le|x+3|$", why: "$|-3|=3$" },
        { do: "Set the desired condition", result: "$|x+3|<\\varepsilon$", why: "this bounds the output error" },
        { do: "Choose delta", result: "$\\delta=\\varepsilon$", why: "the inequality has constant $1$" },
        { do: "Check", result: "$|x+3|<\\delta\\Rightarrow||x|-3|<\\varepsilon$", why: "substitute the choice" }
      ], answer: "$|x|$ is continuous at $-3$ with $\\delta=\\varepsilon$." },
      { problem: "For $g(x)=\\begin{cases}x^2,&x\\ne1\\\\c,&x=1\\end{cases}$, choose $c$ so $g$ is continuous at $1$.", steps: [
        { do: "Compute the limit expression", result: "$\\lim_{x\\to1}x^2$", why: "nearby values use $x^2$" },
        { do: "Use polynomial continuity", result: "$\\lim_{x\\to1}x^2=1$", why: "or prove by epsilon-delta" },
        { do: "Evaluate the assigned value", result: "$g(1)=c$", why: "the point value is chosen separately" },
        { do: "Set value equal to limit", result: "$c=1$", why: "continuity requires agreement" },
        { do: "State the result", result: "continuous at $1$", why: "the hole has been filled" }
      ], answer: "Choose $c=1$." },
      { problem: "A calibration map $v(T)=0.02T+0.5$ is continuous at $T=25$. Find a $\\delta$ that guarantees voltage error below $0.004$ V.", steps: [
        { do: "Write the output error", result: "$|(0.02T+0.5)-(0.02\\cdot25+0.5)|$", why: "compare nearby temperature to base temperature" },
        { do: "Simplify", result: "$0.02|T-25|$", why: "linear terms cancel" },
        { do: "Set the tolerance", result: "$0.02|T-25|<0.004$", why: "requested voltage error" },
        { do: "Solve", result: "$|T-25|<0.2$", why: "$0.004/0.02=0.2$" },
        { do: "Choose delta", result: "$\\delta=0.2$", why: "temperature within $0.2^\\circ$C is enough" }
      ], answer: "$\\delta=0.2^\\circ$C." }
    ],
    applications: [
      { title: "Stable preprocessing", background: "Feature transformations should not make tiny measurement noise produce huge output jumps unless intended.", numbers: "Standardization $z=(x-50)/10$ turns input error $0.2$ into output error $0.02$." },
      { title: "Sensor calibration", background: "Continuity is a minimum expectation for many physical sensors.", numbers: "For $v(T)=0.01T+1$, changing $T$ by $0.5$ changes voltage by $0.005$ V." },
      { title: "ReLU networks", background: "ReLU is continuous, so a network built from affine maps and ReLUs is continuous even though slopes can jump.", numbers: "$r(-0.001)=0$, $r(0)=0$, and $r(0.001)=0.001$ near the kink." },
      { title: "Loss curves", background: "Gradient methods rely on objectives that change predictably under small parameter moves.", numbers: "For $L(w)=(w-3)^2$, moving from $3$ to $3.01$ changes loss from $0$ to $0.0001$." },
      { title: "Interpolation", background: "Graphics and data pipelines use continuous interpolation to avoid visual or statistical jumps.", numbers: "Linear interpolation from $10$ to $18$ over $4$ seconds gives $14$ at $2$ seconds." },
      { title: "Probability calibration", background: "Calibration curves model observed frequency as a continuous function of predicted probability.", numbers: "If $c(p)=0.8p+0.1$, then $p=0.70$ gives $0.66$ and $p=0.71$ gives $0.668$." }
    ],
    applicationsClose: "Continuity is the first reliability promise: small enough input changes make output changes small enough too.",
    takeaways: ["Continuity at $a$ means $\\lim_{x\\to a}f(x)=f(a)$ in epsilon-delta form.", "Proofs bound $|f(x)-f(a)|$ using $|x-a|$.", "Continuity is checked relative to the domain, especially at endpoints.", "Sums, products, quotients away from zero, and compositions preserve continuity." ]
  },

  "math-04-16": {
    id: "math-04-16",
    title: "Properties of continuous functions",
    tagline: "Continuity is powerful because it survives algebra and guarantees values on closed intervals.",
    connections: { buildsOn: ["Continuity (ε–δ)", "closed intervals", "suprema and infima"], leadsTo: ["Uniform continuity", "the Mean Value Theorem", "the Riemann integral"], usedWith: ["Intermediate Value Theorem", "Extreme Value Theorem", "composition", "compactness"] },
    motivation: `<p>Once you can prove one function is continuous, you do not want to restart every proof from scratch. Real analysis gives you closure rules: continuous functions can be added, multiplied, divided safely away from zero, and composed.</p><p>On closed bounded intervals, continuity gives even stronger promises: no skipped heights and actual maximum and minimum values. These are existence theorems, and they are the quiet engine behind many algorithms.</p>`,
    definition: `<p>If $f$ and $g$ are continuous at $a$, then $f+g$, $fg$, and $cf$ are continuous at $a$; $f/g$ is continuous at $a$ when $g(a)\\ne0$; and $g\\circ f$ is continuous at $a$ when $f$ is continuous at $a$ and $g$ is continuous at $f(a)$. These follow by translating epsilon tolerances through sums, products, and compositions.</p><p>Two major interval properties are the <b>Intermediate Value Theorem</b> and the <b>Extreme Value Theorem</b>. If $f$ is continuous on $[a,b]$, it takes every value between $f(a)$ and $f(b)$, and it attains both a maximum and a minimum on $[a,b]$.</p><p><b>Assumptions that matter:</b> the interval must be closed and bounded for the Extreme Value Theorem; IVT needs continuity on the whole interval; quotient continuity requires a nonzero denominator; a function may be continuous on an open interval and still fail to attain a maximum.</p>`,
    worked: {
      problem: "Show that $f(x)=\\dfrac{x^2+1}{x-2}$ is continuous on $[0,1]$ and attains a maximum and minimum there.",
      skills: ["continuity rules", "quotients", "Extreme Value Theorem"],
      strategy: "Build continuity from polynomial and quotient rules, then use the closed-interval theorem.",
      steps: [
        { do: "Classify the numerator", result: "$x^2+1$ is continuous", why: "polynomials are continuous" },
        { do: "Classify the denominator", result: "$x-2$ is continuous", why: "linear functions are continuous" },
        { do: "Check zeros on the interval", result: "$x-2\\ne0$ for $0\\le x\\le1$", why: "the zero is at $x=2$" },
        { do: "Apply quotient continuity", result: "$f$ is continuous on $[0,1]$", why: "denominator never vanishes there" },
        { do: "Apply EVT", result: "$f$ attains a maximum and a minimum", why: "continuous on a closed bounded interval" }
      ],
      verify: "The theorem promises existence even before we compute the actual points.",
      answer: "$f$ is continuous on $[0,1]$ and has both an absolute maximum and an absolute minimum there.",
      connects: "Continuity rules build functions; interval theorems extract guarantees from them."
    },
    practice: [
      { problem: "Prove $h(x)=\\sqrt{x^2+4}$ is continuous for all real $x$.", steps: [
        { do: "Start with $x^2+4$", result: "continuous on $\\mathbb{R}$", why: "polynomials are continuous" },
        { do: "Check its range", result: "$x^2+4\\ge4$", why: "the square root input is always positive" },
        { do: "Use square-root continuity", result: "$\\sqrt{u}$ is continuous for $u\\ge0$", why: "standard continuous function" },
        { do: "Apply composition", result: "$\\sqrt{x^2+4}$ is continuous", why: "continuous after continuous" },
        { do: "State the domain", result: "$\\mathbb{R}$", why: "no input is excluded" }
      ], answer: "$h$ is continuous on $\\mathbb{R}$." },
      { problem: "Explain why $f(x)=1/x$ does not necessarily attain a maximum on $(0,1)$.", steps: [
        { do: "Check continuity", result: "$1/x$ is continuous on $(0,1)$", why: "the denominator is nonzero" },
        { do: "Inspect near zero", result: "$f(x)\\to\\infty$ as $x\\to0^+$", why: "the reciprocal blows up" },
        { do: "Check the interval", result: "$(0,1)$ is not closed", why: "the endpoint $0$ is missing" },
        { do: "Compare with EVT", result: "EVT assumptions fail", why: "closed bounded interval is required" },
        { do: "Conclude", result: "no maximum is attained", why: "values grow without bound" }
      ], answer: "Continuity on an open interval is not enough; no maximum is attained." },
      { problem: "Use IVT to show $x^3+x-1=0$ has a solution in $(0,1)$.", steps: [
        { do: "Name the function", result: "$f(x)=x^3+x-1$", why: "put the equation into $f(x)=0$ form" },
        { do: "State continuity", result: "$f$ is continuous on $[0,1]$", why: "polynomial" },
        { do: "Evaluate left endpoint", result: "$f(0)=-1$", why: "substitute $0$" },
        { do: "Evaluate right endpoint", result: "$f(1)=1$", why: "$1+1-1=1$" },
        { do: "Apply IVT", result: "some $c\\in(0,1)$ has $f(c)=0$", why: "zero lies between $-1$ and $1$" }
      ], answer: "A solution exists in $(0,1)$." },
      { problem: "Find where $q(x)=\\dfrac{\\sin x}{x^2+1}$ is continuous.", steps: [
        { do: "Classify the numerator", result: "$\\sin x$ is continuous", why: "standard trig function" },
        { do: "Classify the denominator", result: "$x^2+1$ is continuous", why: "polynomial" },
        { do: "Check denominator zeros", result: "$x^2+1\\ge1$", why: "never zero over the reals" },
        { do: "Apply quotient rule", result: "continuous everywhere", why: "quotient by a nonzero continuous function" },
        { do: "State the set", result: "$\\mathbb{R}$", why: "all real inputs are allowed" }
      ], answer: "$q$ is continuous on $\\mathbb{R}$." },
      { problem: "A validation curve $M(\\lambda)$ is continuous on $[0,1]$, with $M(0)=0.62$ and $M(1)=0.78$. What theorem guarantees a setting with $M=0.70$?", steps: [
        { do: "Check the interval", result: "$[0,1]$", why: "closed interval where continuity is given" },
        { do: "Check endpoint values", result: "$0.62$ and $0.78$", why: "known metric values" },
        { do: "Locate the target", result: "$0.62<0.70<0.78$", why: "target lies between endpoints" },
        { do: "Apply the theorem", result: "Intermediate Value Theorem", why: "continuous functions hit intermediate values" },
        { do: "State the guarantee", result: "some $\\lambda\\in[0,1]$ has $M(\\lambda)=0.70$", why: "existence, not exact location" }
      ], answer: "The Intermediate Value Theorem guarantees such a setting." }
    ],
    applications: [
      { title: "Root finding by bisection", background: "Bisection relies on IVT: a continuous sign change traps a root.", numbers: "If $f(1)=-2$ and $f(2)=3$, the first midpoint is $1.5$; the sign at $1.5$ chooses the next half interval." },
      { title: "Hyperparameter targets", background: "Smooth validation curves can guarantee an operating point between two tested settings.", numbers: "Metric $0.70$ at $\\lambda=0.01$ and $0.82$ at $\\lambda=1$ guarantees some setting with $0.75$." },
      { title: "Existence of best settings", background: "EVT says a continuous objective on a compact search interval has an optimizer.", numbers: "A continuous loss on $[0,10]$ has a minimum; on $(0,10)$ the minimum might sit at missing endpoint $0$." },
      { title: "Safe composition in pipelines", background: "ML preprocessing chains rely on continuity rules through scaling, activation, and normalization.", numbers: "If $z=(x-5)/2$ and $r=\\max(0,z)$, then $x=7.2$ gives $z=1.1$ and $r=1.1$ continuously." },
      { title: "Calibration thresholds", background: "A continuous score-to-rate curve lets teams solve for desired rates.", numbers: "If positive rate drops from $0.9$ to $0.2$, IVT gives a threshold with rate $0.5$." },
      { title: "Graphics intersections", background: "Signed distance fields use continuity to detect surface crossings between samples.", numbers: "Values $-0.3$ and $0.1$ at neighboring points imply a zero crossing between them if the field is continuous." }
    ],
    applicationsClose: "Continuity is not only local smoothness; it is an engine for building functions and proving solutions exist.",
    takeaways: ["Continuous functions are closed under sums, products, safe quotients, and composition.", "IVT guarantees intermediate values on continuous intervals.", "EVT guarantees maxima and minima on closed bounded intervals.", "Closed and bounded assumptions matter; open intervals can lose extrema." ]
  },

  "math-04-17": {
    id: "math-04-17",
    title: "Uniform continuity",
    tagline: "Uniform continuity uses one delta that works everywhere in the domain.",
    connections: { buildsOn: ["Properties of continuous functions", "epsilon-delta continuity", "compact intervals"], leadsTo: ["The derivative, rigorously", "Riemann integration", "uniform convergence"], usedWith: ["Lipschitz bounds", "compactness", "Heine-Cantor theorem", "Cauchy sequences"] },
    motivation: `<p>Ordinary continuity lets $\\delta$ depend on the point. Near a steep part of a graph, you may need a smaller input window than elsewhere.</p><p><b>Uniform continuity</b> asks for one input window that works across the whole domain. It is a stronger global promise: if two inputs are close enough, their outputs are close enough, no matter where the inputs live.</p>`,
    definition: `<p>A function $f$ is uniformly continuous on a set $D$ if for every $\\varepsilon>0$ there exists $\\delta>0$ such that for all $x,y\\in D$, $|x-y|<\\delta$ implies $|f(x)-f(y)|<\\varepsilon$. The same $\\delta$ must work for every pair of points in $D$.</p><p>If $|f(x)-f(y)|\\le K|x-y|$ on $D$, then $f$ is uniformly continuous by choosing $\\delta=\\varepsilon/K$. Also, every continuous function on a closed bounded interval is uniformly continuous; this is the Heine-Cantor theorem.</p><p><b>Assumptions that matter:</b> uniform continuity is a property on a specified domain; the same formula can be uniformly continuous on one domain and not another; compactness often supplies uniform continuity; unbounded slopes near a missing point can make uniform continuity fail.</p>`,
    worked: {
      problem: "Prove $f(x)=3x+2$ is uniformly continuous on $\\mathbb{R}$.",
      skills: ["uniform epsilon-delta", "Lipschitz bound", "global delta"],
      strategy: "Bound output differences directly by a constant times input differences.",
      steps: [
        { do: "Take two inputs", result: "$x,y\\in\\mathbb{R}$", why: "uniform continuity compares arbitrary pairs" },
        { do: "Compute output difference", result: "$|f(x)-f(y)|=|(3x+2)-(3y+2)|$", why: "start from the target" },
        { do: "Simplify", result: "$3|x-y|$", why: "constants cancel" },
        { do: "Set a sufficient condition", result: "$3|x-y|<\\varepsilon$", why: "this gives the desired output closeness" },
        { do: "Choose delta", result: "$\\delta=\\varepsilon/3$", why: "works for every $x,y$" }
      ],
      verify: "The chosen $\\delta$ does not mention a base point, so it is global across $\\mathbb{R}$.",
      answer: "$f(x)=3x+2$ is uniformly continuous on $\\mathbb{R}$.",
      connects: "A Lipschitz bound is the friendliest path to uniform continuity."
    },
    practice: [
      { problem: "Prove $f(x)=x^2$ is uniformly continuous on $[0,2]$.", steps: [
        { do: "Write the difference", result: "$|x^2-y^2|=|x-y||x+y|$", why: "factor the square difference" },
        { do: "Use the domain", result: "$0\\le x,y\\le2$", why: "both points lie in $[0,2]$" },
        { do: "Bound the extra factor", result: "$|x+y|\\le4$", why: "largest sum is $4$" },
        { do: "Bound the output difference", result: "$|x^2-y^2|\\le4|x-y|$", why: "combine the bounds" },
        { do: "Choose delta", result: "$\\delta=\\varepsilon/4$", why: "one choice works on the whole interval" }
      ], answer: "Uniformly continuous on $[0,2]$ with $\\delta=\\varepsilon/4$." },
      { problem: "Show $f(x)=1/x$ is uniformly continuous on $[1,\\infty)$.", steps: [
        { do: "Write the difference", result: "$\\left|\\dfrac1x-\\dfrac1y\\right|=\\dfrac{|x-y|}{|xy|}$", why: "combine fractions" },
        { do: "Use the domain", result: "$x\\ge1$ and $y\\ge1$", why: "both inputs are in $[1,\\infty)$" },
        { do: "Bound the denominator", result: "$|xy|\\ge1$", why: "product of two numbers at least $1$" },
        { do: "Bound the output difference", result: "$\\left|1/x-1/y\\right|\\le|x-y|$", why: "divide by at least $1$" },
        { do: "Choose delta", result: "$\\delta=\\varepsilon$", why: "global bound has constant $1$" }
      ], answer: "Uniformly continuous on $[1,\\infty)$." },
      { problem: "Show $f(x)=1/x$ is not uniformly continuous on $(0,1)$.", steps: [
        { do: "Choose paired inputs", result: "$x_n=1/n$, $y_n=1/(n+1)$", why: "both approach the missing point $0$" },
        { do: "Compute input distance", result: "$|x_n-y_n|=1/[n(n+1)]$", why: "subtract the fractions" },
        { do: "Take the input limit", result: "$|x_n-y_n|\\to0$", why: "denominator grows" },
        { do: "Compute output values", result: "$f(x_n)=n$, $f(y_n)=n+1$", why: "reciprocals" },
        { do: "Compute output distance", result: "$|f(x_n)-f(y_n)|=1$", why: "never becomes small" }
      ], answer: "Not uniformly continuous on $(0,1)$." },
      { problem: "Use Heine-Cantor to justify that $\\sqrt{x}$ is uniformly continuous on $[0,9]$.", steps: [
        { do: "Identify the domain", result: "$[0,9]$", why: "closed and bounded interval" },
        { do: "Check continuity", result: "$\\sqrt{x}$ is continuous on $[0,9]$", why: "square root is continuous on nonnegative inputs" },
        { do: "Name the theorem", result: "Heine-Cantor", why: "continuous on compact implies uniformly continuous" },
        { do: "Apply it", result: "$\\sqrt{x}$ is uniformly continuous", why: "all assumptions hold" },
        { do: "Interpret", result: "one $\\delta$ works for every $x,y\\in[0,9]$", why: "that is the uniform conclusion" }
      ], answer: "$\\sqrt{x}$ is uniformly continuous on $[0,9]$." },
      { problem: "A model score satisfies $|s(x)-s(y)|\\le8\\|x-y\\|$. What input distance guarantees score change below $0.04$?", steps: [
        { do: "Use the Lipschitz bound", result: "$|s(x)-s(y)|\\le8\\|x-y\\|$", why: "given global control" },
        { do: "Set the desired tolerance", result: "$8\\|x-y\\|<0.04$", why: "score change should be below $0.04$" },
        { do: "Solve", result: "$\\|x-y\\|<0.005$", why: "$0.04/8=0.005$" },
        { do: "Choose delta", result: "$\\delta=0.005$", why: "works for all pairs" },
        { do: "Interpret", result: "the guarantee is uniform", why: "the bound has no base point" }
      ], answer: "Input distance below $0.005$ is enough." }
    ],
    applications: [
      { title: "Robust model guarantees", background: "Lipschitz certificates are uniform-continuity statements used in adversarial robustness.", numbers: "If $K=5$, perturbation norm $0.01$ changes score by at most $0.05$." },
      { title: "Interpolation grids", background: "Uniform continuity says one grid spacing can control approximation error over a whole interval.", numbers: "If $|f'|\\le4$, grid spacing $0.0025$ keeps linear sample-to-sample change below $0.01$." },
      { title: "Compact domains", background: "Closed bounded feature ranges turn pointwise continuity into uniform control.", numbers: "Any continuous feature map on $[0,1]^{10}$ is uniformly continuous; the theorem supplies a global $\\delta$." },
      { title: "Numerical integration", background: "Riemann integration proofs use uniform continuity to make oscillation small on every subinterval.", numbers: "If oscillation per subinterval is below $0.001$ over length $2$, upper-lower sum gap is below $0.002$." },
      { title: "Simulation stability", background: "A uniform time-step guarantee is stronger than a guarantee that changes from state to state.", numbers: "If position update is $2$-Lipschitz in time, a step $h=0.01$ changes position by at most $0.02$." },
      { title: "Embedding drift", background: "Uniform bounds help monitor whether small input edits can move embeddings too far.", numbers: "With bound $\\|e(x)-e(y)\\|\\le12\\|x-y\\|$, an edit of size $0.003$ moves embedding at most $0.036$." }
    ],
    applicationsClose: "Uniform continuity is global reliability: one closeness rule works everywhere in the chosen domain.",
    takeaways: ["Uniform continuity compares all pairs $x,y$ with one $\\delta$.", "Lipschitz bounds imply uniform continuity immediately.", "Continuous functions on closed bounded intervals are uniformly continuous.", "The domain matters: $1/x$ behaves differently on $[1,\\infty)$ and $(0,1)$." ]
  },

  "math-04-18": {
    id: "math-04-18",
    title: "The derivative, rigorously",
    tagline: "The derivative is the limit of slopes, made precise enough to prove what it can and cannot do.",
    connections: { buildsOn: ["Uniform continuity", "limits of functions (ε–δ)", "difference quotients"], leadsTo: ["The Mean Value Theorem", "Taylor's theorem with remainder", "the Riemann integral"], usedWith: ["linear approximation", "chain rule", "local extrema", "Lipschitz bounds"] },
    motivation: `<p>You already use derivatives as slopes and rates of change. The rigorous definition asks exactly which slope: not a secant over a visible interval, but the limiting slope as the interval shrinks to zero.</p><p>This matters because corners, cusps, and vertical tangents can look almost slope-like from one side but fail to have one two-sided linear rate. The definition keeps us honest.</p>`,
    definition: `<p>A function $f$ is differentiable at $a$ if the limit $$f'(a)=\\lim_{h\\to0}\\frac{f(a+h)-f(a)}{h}$$ exists as a finite real number. Equivalently, $$f(a+h)=f(a)+f'(a)h+r(h)h,$$ where $r(h)\\to0$ as $h\\to0$; this says the function has a linear approximation whose error is small compared with $h$.</p><p>Differentiability implies continuity: if the difference quotient tends to $f'(a)$, then $f(a+h)-f(a)=h\\cdot\\frac{f(a+h)-f(a)}{h}\\to0$, so $f(a+h)\\to f(a)$.</p><p><b>Assumptions that matter:</b> the two-sided limit must exist and be finite; differentiability is pointwise unless an interval is stated; a function can be continuous without being differentiable; derivative rules require the relevant derivatives to exist.</p>`,
    worked: {
      problem: "Use the definition to compute the derivative of $f(x)=x^2$ at $a=3$.",
      skills: ["difference quotient", "limits", "algebraic cancellation"],
      strategy: "Expand $f(3+h)$, cancel the constant term, divide by $h$, then let $h\\to0$.",
      steps: [
        { do: "Write the quotient", result: "$\\dfrac{(3+h)^2-3^2}{h}$", why: "use the derivative definition" },
        { do: "Expand", result: "$\\dfrac{9+6h+h^2-9}{h}$", why: "square the binomial" },
        { do: "Cancel constants", result: "$\\dfrac{6h+h^2}{h}$", why: "$9-9=0$" },
        { do: "Factor the numerator", result: "$\\dfrac{h(6+h)}{h}$", why: "prepare to cancel $h$" },
        { do: "Cancel $h$", result: "$6+h$", why: "the quotient considers $h\\ne0$" },
        { do: "Take the limit", result: "$6$", why: "$h\\to0$" }
      ],
      verify: "The power rule predicts $2x$, and at $x=3$ that gives $6$.",
      answer: "$f'(3)=6$.",
      connects: "The derivative is the limiting slope after the secant's width disappears."
    },
    practice: [
      { problem: "Use the definition to find $f'(a)$ for $f(x)=5x+1$.", steps: [
        { do: "Write the quotient", result: "$\\dfrac{[5(a+h)+1]-(5a+1)}{h}$", why: "definition at $a$" },
        { do: "Distribute", result: "$\\dfrac{5a+5h+1-5a-1}{h}$", why: "expand the numerator" },
        { do: "Cancel", result: "$\\dfrac{5h}{h}$", why: "constant terms vanish" },
        { do: "Simplify", result: "$5$", why: "cancel $h\\ne0$" },
        { do: "Take the limit", result: "$5$", why: "constant limit" }
      ], answer: "$f'(a)=5$." },
      { problem: "Use the definition to find $f'(a)$ for $f(x)=x^3$.", steps: [
        { do: "Write the quotient", result: "$\\dfrac{(a+h)^3-a^3}{h}$", why: "definition" },
        { do: "Expand", result: "$\\dfrac{a^3+3a^2h+3ah^2+h^3-a^3}{h}$", why: "binomial theorem" },
        { do: "Cancel", result: "$\\dfrac{3a^2h+3ah^2+h^3}{h}$", why: "$a^3$ terms cancel" },
        { do: "Divide by $h$", result: "$3a^2+3ah+h^2$", why: "factor one $h$ from each term" },
        { do: "Let $h\\to0$", result: "$3a^2$", why: "terms with $h$ vanish" }
      ], answer: "$f'(a)=3a^2$." },
      { problem: "Show $f(x)=|x|$ is not differentiable at $0$.", steps: [
        { do: "Write the quotient", result: "$\\dfrac{|0+h|-0}{h}=\\dfrac{|h|}{h}$", why: "definition at zero" },
        { do: "Approach from the right", result: "$h>0\\Rightarrow |h|/h=1$", why: "positive $h$ stays positive" },
        { do: "Approach from the left", result: "$h<0\\Rightarrow |h|/h=-1$", why: "negative $h$ changes sign" },
        { do: "Compare one-sided limits", result: "$1\\ne-1$", why: "two-sided derivative limit must agree" },
        { do: "Conclude", result: "not differentiable at $0$", why: "the derivative limit does not exist" }
      ], answer: "$|x|$ is not differentiable at $0$." },
      { problem: "Prove differentiability implies continuity using $h\\to0$ notation.", steps: [
        { do: "Assume differentiability", result: "$\\dfrac{f(a+h)-f(a)}{h}\\to f'(a)$", why: "definition" },
        { do: "Rewrite the output change", result: "$f(a+h)-f(a)=h\\cdot\\dfrac{f(a+h)-f(a)}{h}$", why: "multiply and divide by $h$" },
        { do: "Take the first factor limit", result: "$h\\to0$", why: "by approach" },
        { do: "Take the second factor limit", result: "$f'(a)$", why: "differentiability" },
        { do: "Multiply limits", result: "$f(a+h)-f(a)\\to0$", why: "zero times a finite limit is zero" }
      ], answer: "$f(a+h)\\to f(a)$, so $f$ is continuous at $a$." },
      { problem: "For $L(w)=w^2$ at $w=2$, compute the central-difference gradient estimate with $h=0.01$ and compare to the derivative.", steps: [
        { do: "Compute right value", result: "$L(2.01)=4.0401$", why: "square $2.01$" },
        { do: "Compute left value", result: "$L(1.99)=3.9601$", why: "square $1.99$" },
        { do: "Subtract", result: "$4.0401-3.9601=0.08$", why: "symmetric output change" },
        { do: "Divide by $2h$", result: "$0.08/0.02=4$", why: "central difference formula" },
        { do: "Compare", result: "$L'(2)=2\\cdot2=4$", why: "exact derivative" }
      ], answer: "The estimate is $4$, matching the exact derivative." }
    ],
    applications: [
      { title: "Backpropagation", background: "Neural-network training computes derivatives of loss with respect to parameters by chaining local derivatives.", numbers: "For $L(w)=(w-3)^2$, $L'(1)=2(1-3)=-4$, so a step with rate $0.1$ moves to $1.4$." },
      { title: "Gradient checking", background: "Finite differences test whether an implemented derivative matches the limiting slope.", numbers: "If analytic gradient is $6.000$ and finite difference is $6.002$, absolute error is $0.002$." },
      { title: "Sensitivity analysis", background: "A derivative turns small input changes into first-order output estimates.", numbers: "If $f'(5)=12$, then an input change $0.01$ predicts output change about $0.12$." },
      { title: "Nondifferentiable activations", background: "ReLU has a corner at zero, so frameworks choose a convention for the derivative there.", numbers: "For $r(x)=\\max(0,x)$, left slope $0$ and right slope $1$ disagree at $0$." },
      { title: "Optimization stopping", background: "Small derivative magnitude near a point suggests locally flat loss, though not always a minimum.", numbers: "For $L(w)=w^4$, $L'(0.1)=4(0.001)=0.004$, already small." },
      { title: "Physics rates", background: "Velocity is the derivative of position, made rigorous as a limiting average velocity.", numbers: "For $s(t)=t^2$, average velocity from $2$ to $2.01$ is $(4.0401-4)/0.01=4.01$, tending to $4$." }
    ],
    applicationsClose: "The derivative is a limit with a job: it turns local change into a precise linear rate.",
    takeaways: ["$f'(a)=\\lim_{h\\to0}[f(a+h)-f(a)]/h$ when the finite two-sided limit exists.", "Differentiability implies continuity, but continuity need not imply differentiability.", "Corners fail because one-sided slope limits disagree.", "Derivatives justify linear approximations and gradient-based algorithms." ]
  },

  "math-04-19": {
    id: "math-04-19",
    title: "The Mean Value Theorem",
    tagline: "Somewhere on a smooth trip, the instantaneous speed matches the average speed.",
    connections: { buildsOn: ["The derivative, rigorously", "continuity", "closed intervals"], leadsTo: ["Taylor's theorem with remainder", "monotonicity tests", "inverse function ideas"], usedWith: ["Rolle's theorem", "Lipschitz bounds", "error estimates", "optimization"] },
    motivation: `<p>If a car travels $100$ km in $2$ hours, its average speed is $50$ km/h. If its position was continuous and differentiable during the trip, then at some instant the speedometer had to read exactly $50$ km/h.</p><p>The Mean Value Theorem is that everyday idea in calculus form. It turns endpoint information into a guaranteed derivative value somewhere inside.</p>`,
    definition: `<p>If $f$ is continuous on $[a,b]$ and differentiable on $(a,b)$, then there exists $c\\in(a,b)$ such that $$f'(c)=\\frac{f(b)-f(a)}{b-a}.$$ The right side is the secant slope; the theorem says a tangent slope matches it somewhere.</p><p>It follows from Rolle's theorem. Subtract the secant line from $f$ to make a new function $g$ with $g(a)=g(b)$. Rolle's theorem gives $g'(c)=0$, and unpacking $g'$ gives $f'(c)$ equal to the secant slope.</p><p><b>Assumptions that matter:</b> continuity on the closed interval and differentiability on the open interval are both required; corners or jumps can break the conclusion; MVT guarantees existence of at least one $c$, not a unique one.</p>`,
    worked: {
      problem: "Apply the Mean Value Theorem to $f(x)=x^2$ on $[1,3]$ and find $c$.",
      skills: ["MVT hypotheses", "secant slope", "derivative equation"],
      strategy: "Verify the hypotheses, compute the average slope, then solve $f'(c)$ equals that slope.",
      steps: [
        { do: "Check continuity", result: "$x^2$ is continuous on $[1,3]$", why: "polynomial" },
        { do: "Check differentiability", result: "$x^2$ is differentiable on $(1,3)$", why: "polynomial" },
        { do: "Compute endpoint values", result: "$f(3)=9$, $f(1)=1$", why: "needed for the secant slope" },
        { do: "Compute average slope", result: "$\\dfrac{9-1}{3-1}=4$", why: "change in output over change in input" },
        { do: "Compute derivative", result: "$f'(x)=2x$", why: "power rule" },
        { do: "Solve $f'(c)=4$", result: "$2c=4$, so $c=2$", why: "MVT tangent slope equals secant slope" }
      ],
      verify: "$c=2$ lies inside $(1,3)$, exactly where the tangent slope is $4$.",
      answer: "The MVT point is $c=2$.",
      connects: "MVT bridges global change across an interval to local derivative information inside it."
    },
    practice: [
      { problem: "Apply MVT to $f(x)=x^3$ on $[0,2]$ and find a point $c$.", steps: [
        { do: "Check hypotheses", result: "$x^3$ is continuous and differentiable", why: "polynomial" },
        { do: "Compute endpoint values", result: "$f(2)=8$, $f(0)=0$", why: "secant slope data" },
        { do: "Compute secant slope", result: "$(8-0)/(2-0)=4$", why: "average rate of change" },
        { do: "Compute derivative", result: "$f'(x)=3x^2$", why: "power rule" },
        { do: "Solve", result: "$3c^2=4$, so $c=2/\\sqrt3$", why: "positive solution in $(0,2)$" }
      ], answer: "$c=2/\\sqrt3\\approx1.155$." },
      { problem: "Use MVT to prove $|\\sin b-\\sin a|\\le|b-a|$.", steps: [
        { do: "Set the function", result: "$f(x)=\\sin x$", why: "difference of sine values" },
        { do: "Apply MVT", result: "$\\sin b-\\sin a=\\cos(c)(b-a)$", why: "for some $c$ between $a$ and $b$" },
        { do: "Take absolute values", result: "$|\\sin b-\\sin a|=|\\cos c|\\,|b-a|$", why: "absolute product" },
        { do: "Use cosine bound", result: "$|\\cos c|\\le1$", why: "cosine ranges between $-1$ and $1$" },
        { do: "Conclude", result: "$|\\sin b-\\sin a|\\le|b-a|$", why: "multiply by the bound" }
      ], answer: "$\\sin x$ is $1$-Lipschitz." },
      { problem: "If $f'(x)=0$ for all $x\\in(a,b)$, prove $f$ is constant on $(a,b)$.", steps: [
        { do: "Choose two points", result: "$u<v$ in $(a,b)$", why: "show any two values match" },
        { do: "Apply MVT on $[u,v]$", result: "$f(v)-f(u)=f'(c)(v-u)$", why: "for some $c\\in(u,v)$" },
        { do: "Use the derivative condition", result: "$f'(c)=0$", why: "given for every interior point" },
        { do: "Simplify", result: "$f(v)-f(u)=0$", why: "zero times the interval length" },
        { do: "Conclude", result: "$f(v)=f(u)$", why: "arbitrary points have equal values" }
      ], answer: "$f$ is constant." },
      { problem: "Does MVT apply to $f(x)=|x|$ on $[-1,1]$?", steps: [
        { do: "Check continuity", result: "$|x|$ is continuous on $[-1,1]$", why: "absolute value is continuous" },
        { do: "Check differentiability", result: "not differentiable at $0$", why: "left and right slopes differ" },
        { do: "Compare with interval", result: "$0\\in(-1,1)$", why: "the corner is in the open interval" },
        { do: "Assess hypotheses", result: "MVT does not apply", why: "differentiability fails" },
        { do: "Note the secant slope", result: "$(1-1)/2=0$", why: "no theorem guarantees a matching derivative" }
      ], answer: "No. The function is not differentiable at $0$." },
      { problem: "A loss has derivative bounded by $|L'(w)|\\le6$ on $[1,1.2]$. Bound $|L(1.2)-L(1)|$.", steps: [
        { do: "Apply MVT", result: "$L(1.2)-L(1)=L'(c)(0.2)$", why: "for some $c\\in(1,1.2)$" },
        { do: "Take absolute values", result: "$|L(1.2)-L(1)|=|L'(c)|0.2$", why: "distance is positive" },
        { do: "Use the derivative bound", result: "$|L'(c)|\\le6$", why: "given on the interval" },
        { do: "Multiply", result: "$|L(1.2)-L(1)|\\le6(0.2)$", why: "MVT bound" },
        { do: "Compute", result: "$1.2$", why: "six times two tenths" }
      ], answer: "The loss change is at most $1.2$." }
    ],
    applications: [
      { title: "Lipschitz guarantees", background: "Derivative bounds become global change bounds through MVT.", numbers: "If $|f'|\\le4$ on an interval, moving $0.03$ changes $f$ by at most $0.12$." },
      { title: "Gradient clipping intuition", background: "Bounding gradients bounds how much loss can change over a parameter step.", numbers: "Gradient norm bound $10$ and step norm $0.001$ give loss change at most about $0.01$." },
      { title: "Speed checks", background: "Average-speed arguments are direct MVT applications.", numbers: "Traveling $150$ km in $3$ hours guarantees an instant at $50$ km/h if position is smooth." },
      { title: "Root uniqueness", background: "If a derivative is always positive, a function is strictly increasing and cannot cross zero twice.", numbers: "If $f'\\ge2$ and $f(1)=-1$, then $f(2)\\ge1$, so at most one root in a monotone interval." },
      { title: "Error bounds", background: "Taylor's theorem uses MVT-style reasoning to control the remainder.", numbers: "If $|f''|\\le3$, linearization error over $h=0.1$ is at most $3h^2/2=0.015$." },
      { title: "Robust scores", background: "A score derivative bound controls sensitivity to feature changes.", numbers: "If $|s'(x)|\\le0.8$, changing a scalar feature by $0.5$ changes score by at most $0.4$." }
    ],
    applicationsClose: "The Mean Value Theorem is the bridge from local derivative bounds to interval-wide guarantees.",
    takeaways: ["MVT requires continuity on $[a,b]$ and differentiability on $(a,b)$.", "It guarantees $f'(c)=[f(b)-f(a)]/(b-a)$ for some interior $c$.", "Derivative bounds imply function-change bounds.", "Missing differentiability or continuity can break the theorem." ]
  },

  "math-04-20": {
    id: "math-04-20",
    title: "Taylor's theorem with remainder",
    tagline: "Taylor's theorem tells you not only the polynomial approximation, but how much error remains.",
    connections: { buildsOn: ["The Mean Value Theorem", "higher derivatives", "Taylor polynomials"], leadsTo: ["The Riemann integral", "power series and analyticity", "optimization approximations"], usedWith: ["remainder bounds", "local approximation", "Newton's method", "error analysis"] },
    motivation: `<p>Taylor polynomials are wonderfully practical: replace a hard function by a polynomial near a point. But approximation without an error statement is only a hope.</p><p>Taylor's theorem adds the missing honesty. It says exactly how the neglected part depends on a higher derivative and the distance from the center.</p>`,
    definition: `<p>If $f$ has $n+1$ derivatives on an interval containing $a$ and $x$, then $$f(x)=\\sum_{k=0}^{n}\\frac{f^{(k)}(a)}{k!}(x-a)^k+R_n(x),$$ where the Lagrange remainder is $$R_n(x)=\\frac{f^{(n+1)}(c)}{(n+1)!}(x-a)^{n+1}$$ for some $c$ between $a$ and $x$.</p><p>The proof is an iterated Mean Value Theorem idea: build the polynomial matching derivatives through order $n$ at $a$, then use a Rolle-type argument to force the remaining error to be controlled by the $(n+1)$st derivative at an intermediate point.</p><p><b>Assumptions that matter:</b> the needed derivatives must exist on the interval; the unknown point $c$ lies between $a$ and $x$; practical error bounds replace $|f^{(n+1)}(c)|$ by a known maximum $M$; a Taylor polynomial is local unless the remainder is controlled.</p>`,
    worked: {
      problem: "Approximate $e^{0.2}$ with the degree $2$ Taylor polynomial at $0$ and bound the error.",
      skills: ["Taylor polynomial", "Lagrange remainder", "numerical bound"],
      strategy: "Use $e^x=1+x+x^2/2$ through degree $2$, then bound the third derivative on $[0,0.2]$.",
      steps: [
        { do: "Write the polynomial", result: "$T_2(x)=1+x+x^2/2$", why: "all derivatives of $e^x$ at $0$ equal $1$" },
        { do: "Substitute $x=0.2$", result: "$T_2(0.2)=1+0.2+0.2^2/2$", why: "evaluate the approximation" },
        { do: "Compute", result: "$1.22$", why: "$0.2^2/2=0.02$" },
        { do: "Identify the remainder", result: "$R_2(0.2)=e^c(0.2)^3/3!$", why: "third derivative of $e^x$ is $e^x$" },
        { do: "Bound the derivative", result: "$e^c\\le e^{0.2}<1.23$", why: "$c\\in(0,0.2)$" },
        { do: "Bound the error", result: "$|R_2|<1.23(0.008)/6=0.00164$", why: "apply the Lagrange bound" }
      ],
      verify: "The true value is about $1.22140$, which is within $0.00164$ of $1.22$.",
      answer: "$e^{0.2}\\approx1.22$ with error less than $0.00164$.",
      connects: "Taylor's theorem turns an approximation into a certified approximation."
    },
    practice: [
      { problem: "Use degree $1$ Taylor at $0$ to approximate $\\sin(0.1)$ and bound the error.", steps: [
        { do: "Write the polynomial", result: "$T_1(x)=x$", why: "$\\sin0=0$ and $\\cos0=1$" },
        { do: "Evaluate", result: "$T_1(0.1)=0.1$", why: "substitute" },
        { do: "Use a second-degree remainder form", result: "$|R_1|\\le M(0.1)^2/2$", why: "degree $1$ uses second derivative" },
        { do: "Bound the second derivative", result: "$|f''(x)|=|-sin x|\\le1$", why: "sine magnitude is at most $1$" },
        { do: "Compute the bound", result: "$0.01/2=0.005$", why: "substitute $M=1$" }
      ], answer: "$\\sin(0.1)\\approx0.1$ with error at most $0.005$." },
      { problem: "Use $1+x$ to approximate $\\sqrt{1+x}$ at $x=0.04$? First find the correct linear Taylor approximation at $0$.", steps: [
        { do: "Define the function", result: "$f(x)=\\sqrt{1+x}$", why: "center at $x=0$" },
        { do: "Evaluate", result: "$f(0)=1$", why: "constant term" },
        { do: "Differentiate", result: "$f'(x)=\\dfrac{1}{2\\sqrt{1+x}}$", why: "chain rule" },
        { do: "Evaluate derivative", result: "$f'(0)=1/2$", why: "substitute $0$" },
        { do: "Write the linear polynomial", result: "$T_1(x)=1+x/2$", why: "not $1+x$" },
        { do: "Approximate", result: "$T_1(0.04)=1.02$", why: "half of $0.04$ is $0.02$" }
      ], answer: "$\\sqrt{1.04}\\approx1.02$." },
      { problem: "Bound the error of approximating $\\cos(0.3)$ by $1-0.3^2/2$.", steps: [
        { do: "Use degree $2$ polynomial", result: "$T_2(x)=1-x^2/2$", why: "Maclaurin cosine through degree $2$" },
        { do: "Identify next derivative order", result: "$n+1=3$", why: "degree $2$ remainder" },
        { do: "Use a derivative bound", result: "$|f^{(3)}(x)|=|\\sin x|\\le1$", why: "global bound" },
        { do: "Apply the bound", result: "$|R_2|\\le(0.3)^3/3!$", why: "Lagrange remainder" },
        { do: "Compute", result: "$0.027/6=0.0045$", why: "arithmetic" }
      ], answer: "Error at most $0.0045$; a sharper degree $3$ term is zero at the center but this bound is valid." },
      { problem: "For $f(x)=\\ln(1+x)$, approximate $\\ln(1.1)$ by $x-x^2/2$ and estimate using the next term magnitude.", steps: [
        { do: "Set $x=0.1$", result: "$\\ln(1.1)$", why: "match $\\ln(1+x)$" },
        { do: "Evaluate polynomial", result: "$0.1-0.1^2/2$", why: "degree $2$ Maclaurin" },
        { do: "Compute", result: "$0.095$", why: "$0.1-0.005$" },
        { do: "Estimate next term", result: "$0.1^3/3=0.000333\\ldots$", why: "alternating log series next magnitude" },
        { do: "State interval", result: "$0.094667$ to $0.095333$", why: "true value lies within about one next term" }
      ], answer: "$\\ln(1.1)\\approx0.095$ with error about at most $0.000333$." },
      { problem: "A loss has $|L'''(w)|\\le12$ near $w=0$. If you use a quadratic Taylor model at $0$, bound the error at $w=0.05$.", steps: [
        { do: "Identify degree", result: "$n=2$", why: "quadratic model" },
        { do: "Write the remainder bound", result: "$|R_2(w)|\\le M|w|^3/3!$", why: "Lagrange remainder" },
        { do: "Substitute $M=12$", result: "$12(0.05)^3/6$", why: "third derivative bound" },
        { do: "Compute the cube", result: "$0.05^3=0.000125$", why: "small displacement" },
        { do: "Compute the bound", result: "$12(0.000125)/6=0.00025$", why: "arithmetic" }
      ], answer: "The quadratic-model error is at most $0.00025$." }
    ],
    applications: [
      { title: "Fast math libraries", background: "Implementations of exp, log, and trig use polynomial approximations with certified remainders on small intervals.", numbers: "$e^{0.1}\\approx1+0.1+0.005+0.0001667=1.1051667$, within about $4.2\\times10^{-6}$ after the next term." },
      { title: "Newton's method", background: "Newton steps come from a local Taylor model of a function or objective.", numbers: "For $f(x)=x^2-2$ at $x=1.5$, Newton gives $1.5-0.25/3=1.4167$." },
      { title: "Loss curvature", background: "Second-order optimization reads the quadratic Taylor term as local curvature.", numbers: "If $L(w)\\approx2+0.5(w-4)^2$, moving $0.2$ raises loss by $0.5(0.04)=0.02$." },
      { title: "Quantization error", background: "Taylor bounds estimate how much nonlinear transforms amplify small rounding errors.", numbers: "If $|f''|\\le10$ and rounding $h=0.001$, second-order error is at most $10h^2/2=5\\times10^{-6}$." },
      { title: "Activation approximations", background: "Inference kernels approximate activations by low-degree polynomials on bounded ranges.", numbers: "For $\\tanh(0.2)$, $x-x^3/3=0.19733$, close to $0.19738$." },
      { title: "Uncertainty propagation", background: "The delta method is Taylor's theorem applied to random perturbations.", numbers: "For $g(x)=x^2$ near $3$ with standard deviation $0.1$, first-order output standard deviation is $|g'(3)|0.1=0.6$." }
    ],
    applicationsClose: "Taylor's theorem is local approximation with accountability: every polynomial comes with a remainder to bound.",
    takeaways: ["Taylor's theorem writes a function as a degree $n$ polynomial plus a remainder.", "The Lagrange remainder uses an $(n+1)$st derivative at some intermediate point.", "Bounding that derivative gives practical numerical error bounds.", "Approximation quality depends on distance from the center and derivative size." ]
  },

  "math-04-21": {
    id: "math-04-21",
    title: "The Riemann integral",
    tagline: "The Riemann integral defines area by trapping a function between upper and lower sums.",
    connections: { buildsOn: ["Taylor's theorem with remainder", "suprema and infima", "partitions"], leadsTo: ["The Fundamental Theorem of Calculus", "numerical integration", "measure and probability"], usedWith: ["upper and lower sums", "uniform continuity", "step functions", "accumulation"] },
    motivation: `<p>You already think of $\\int_a^b f(x)\\,dx$ as area or accumulated change. Riemann's definition asks how to make that idea precise using only rectangles.</p><p>Take a partition of the interval, use the largest function value on each small piece for an upper rectangle and the smallest for a lower rectangle. If those two totals can be forced together, the area is well-defined.</p>`,
    definition: `<p>A partition $P$ of $[a,b]$ is a finite list $a=x_0<x_1<\\cdots<x_n=b$. On each subinterval $[x_{i-1},x_i]$, let $M_i=\\sup f$ and $m_i=\\inf f$. The upper and lower sums are $$U(f,P)=\\sum_{i=1}^{n}M_i\\Delta x_i,\\qquad L(f,P)=\\sum_{i=1}^{n}m_i\\Delta x_i,$$ where $\\Delta x_i=x_i-x_{i-1}$.</p><p>A bounded function is Riemann integrable if for every $\\varepsilon>0$ there is a partition $P$ such that $U(f,P)-L(f,P)<\\varepsilon$. Continuous functions on $[a,b]$ are integrable because uniform continuity makes the oscillation on sufficiently small subintervals uniformly small.</p><p><b>Assumptions that matter:</b> the function must be bounded for the usual Riemann definition; partitions are finite; discontinuities are allowed if they are not too wild; upper and lower sums use suprema and infima, not just sampled endpoints.</p>`,
    worked: {
      problem: "Compute the Riemann integral of $f(x)=x$ on $[0,1]$ using equal partitions and lower and upper sums.",
      skills: ["partitions", "upper sums", "lower sums", "limit of sums"],
      strategy: "For an increasing function, left endpoints give lower sums and right endpoints give upper sums.",
      steps: [
        { do: "Choose equal partition", result: "$x_i=i/n$", why: "split $[0,1]$ into $n$ equal pieces" },
        { do: "Set the width", result: "$\\Delta x=1/n$", why: "each subinterval has equal length" },
        { do: "Write the lower sum", result: "$L_n=\\sum_{i=1}^{n}\\frac{i-1}{n}\\cdot\\frac1n$", why: "left endpoint is the infimum on each piece" },
        { do: "Evaluate the lower sum", result: "$L_n=\\dfrac{1}{n^2}\\sum_{i=1}^{n}(i-1)=\\dfrac{n-1}{2n}$", why: "sum $0+1+\\cdots+(n-1)$" },
        { do: "Write the upper sum", result: "$U_n=\\sum_{i=1}^{n}\\frac{i}{n}\\cdot\\frac1n$", why: "right endpoint is the supremum" },
        { do: "Evaluate the upper sum", result: "$U_n=\\dfrac{1}{n^2}\\sum_{i=1}^{n}i=\\dfrac{n+1}{2n}$", why: "sum $1+\\cdots+n$" },
        { do: "Take limits", result: "$L_n\\to\\frac12$ and $U_n\\to\\frac12$", why: "the bounds squeeze together" }
      ],
      verify: "The upper-lower gap is $U_n-L_n=1/n$, which can be made smaller than any $\\varepsilon>0$.",
      answer: "$\\displaystyle\\int_0^1 x\\,dx=\\frac12$.",
      connects: "Riemann integration is the moment when all fine enough rectangle traps agree on one number."
    },
    practice: [
      { problem: "For $f(x)=2$ on $[1,4]$, compute upper and lower sums for any partition.", steps: [
        { do: "Find each infimum", result: "$m_i=2$", why: "the function is constant" },
        { do: "Find each supremum", result: "$M_i=2$", why: "same constant value" },
        { do: "Write the lower sum", result: "$L(f,P)=\\sum 2\\Delta x_i$", why: "rectangle height is $2$" },
        { do: "Sum widths", result: "$\\sum\\Delta x_i=4-1=3$", why: "subinterval lengths fill the interval" },
        { do: "Compute both sums", result: "$L(f,P)=U(f,P)=6$", why: "upper and lower sums match" }
      ], answer: "$\\int_1^4 2\\,dx=6$." },
      { problem: "For $f(x)=x^2$ on $[0,1]$, write the right-endpoint Riemann sum with $n$ equal parts.", steps: [
        { do: "Set nodes", result: "$x_i=i/n$", why: "equal partition" },
        { do: "Set width", result: "$\\Delta x=1/n$", why: "unit interval split into $n$ pieces" },
        { do: "Evaluate right endpoints", result: "$f(x_i)=(i/n)^2$", why: "square each right endpoint" },
        { do: "Write the sum", result: "$R_n=\\sum_{i=1}^{n}(i/n)^2(1/n)$", why: "height times width" },
        { do: "Simplify", result: "$R_n=\\dfrac{1}{n^3}\\sum_{i=1}^{n}i^2$", why: "factor out powers of $n$" }
      ], answer: "$R_n=\\dfrac{1}{n^3}\\sum_{i=1}^{n}i^2$, which tends to $1/3$." },
      { problem: "Show a bounded function with one jump, $f(x)=0$ for $x<1/2$ and $f(x)=1$ for $x\\ge1/2$, is Riemann integrable on $[0,1]$.", steps: [
        { do: "Choose a small interval around the jump", result: "length $\\eta$", why: "only near the jump can upper and lower sums differ" },
        { do: "Partition at its endpoints", result: "$[1/2-\\eta/2,1/2+\\eta/2]$", why: "isolate the discontinuity" },
        { do: "Compare outside intervals", result: "upper sum equals lower sum", why: "the function is constant on each outside piece" },
        { do: "Bound the jump contribution", result: "$1\\cdot\\eta$", why: "oscillation at most $1$ over length $\\eta$" },
        { do: "Choose $\\eta$", result: "$\\eta<\\varepsilon$", why: "then upper-lower gap is below $\\varepsilon$" }
      ], answer: "It is Riemann integrable; its integral is $1/2$." },
      { problem: "Use the trapezoidal rule as a Riemann-sum approximation for $\\int_0^2 x\\,dx$ with one interval.", steps: [
        { do: "Evaluate endpoints", result: "$f(0)=0$, $f(2)=2$", why: "trapezoid uses endpoint heights" },
        { do: "Average heights", result: "$(0+2)/2=1$", why: "trapezoid average height" },
        { do: "Compute width", result: "$2-0=2$", why: "interval length" },
        { do: "Multiply", result: "$1\\cdot2=2$", why: "area of trapezoid" },
        { do: "Compare exact", result: "$\\int_0^2x\\,dx=2$", why: "a line is integrated exactly by one trapezoid" }
      ], answer: "The approximation and exact integral are both $2$." },
      { problem: "A loss curve has values $1.0,0.8,0.7$ at epochs $0,1,2$. Approximate accumulated loss by rectangles using left endpoints.", steps: [
        { do: "Set interval widths", result: "$\\Delta t=1$", why: "samples are one epoch apart" },
        { do: "Choose left heights", result: "$1.0$ and $0.8$", why: "left endpoints for intervals $[0,1]$ and $[1,2]$" },
        { do: "Compute first rectangle", result: "$1.0\\cdot1=1.0$", why: "height times width" },
        { do: "Compute second rectangle", result: "$0.8\\cdot1=0.8$", why: "height times width" },
        { do: "Add", result: "$1.8$", why: "total accumulated loss estimate" }
      ], answer: "Left-rectangle accumulated loss is $1.8$ loss-epochs." }
    ],
    applications: [
      { title: "Area under ROC curves", background: "AUC is an integral of true positive rate over false positive rate, usually approximated from sampled thresholds.", numbers: "Trapezoids with widths $0.2$ and average heights $0.6,0.8,0.9,0.95,1.0$ give AUC $0.2(4.25)=0.85$." },
      { title: "Expected values", background: "Continuous expectations are integrals, and Riemann sums are the first finite approximation.", numbers: "Values $1,4,9$ with equal weight $1/3$ give expected value estimate $(1+4+9)/3=4.667$." },
      { title: "Training diagnostics", background: "Area under a loss curve measures cumulative training cost, not just final loss.", numbers: "Losses $1.0,0.8,0.7$ over two epochs give trapezoid area $[(1.0+0.7)/2+0.8]=1.65$." },
      { title: "Sensor accumulation", background: "Distance from velocity samples is a physical Riemann-sum idea.", numbers: "Velocities $0,3,5$ m/s over two one-second intervals give left estimate $0+3=3$ m." },
      { title: "Histogram probabilities", background: "Density curves integrate to probability; histograms approximate the integral by rectangles.", numbers: "Three bins of width $0.5$ with heights $0.2,0.6,0.4$ have mass $0.5(1.2)=0.6$." },
      { title: "Numerical quadrature", background: "Scientific computing refines partitions until rectangle or trapezoid estimates stabilize.", numbers: "If upper and lower sums differ by $0.0008$, the integral is known within that gap." }
    ],
    applicationsClose: "Riemann integration is accumulation made rigorous by squeezing all sufficiently fine rectangle sums together.",
    takeaways: ["Upper sums use suprema; lower sums use infima over partition intervals.", "A bounded function is Riemann integrable when upper-lower gaps can be made arbitrarily small.", "Continuous functions on closed intervals are Riemann integrable.", "Riemann sums are the foundation behind numerical area and accumulation estimates." ]
  },

  "math-04-22": {
    id: "math-04-22",
    title: "The Fundamental Theorem of Calculus",
    tagline: "The Fundamental Theorem shows that differentiation and integration undo each other under the right hypotheses.",
    connections: { buildsOn: ["The Riemann integral", "continuity", "the derivative, rigorously"], leadsTo: ["Sequences of functions", "differential equations", "probability densities"], usedWith: ["antiderivatives", "accumulation functions", "area", "change of variables"] },
    motivation: `<p>Differentiation measures instantaneous change; integration measures accumulated change. The Fundamental Theorem of Calculus explains why these two ideas are not separate subjects.</p><p>If you accumulate a continuous function and then ask for the rate of accumulation, you recover the original function. If you know an antiderivative, you can compute a definite integral by endpoint subtraction.</p>`,
    definition: `<p><b>FTC Part 1:</b> If $f$ is continuous on $[a,b]$ and $F(x)=\\int_a^x f(t)\\,dt$, then $F$ is differentiable on $(a,b)$ and $F'(x)=f(x)$. The proof compares $$\\frac{F(x+h)-F(x)}{h}=\\frac{1}{h}\\int_x^{x+h}f(t)\\,dt,$$ the average value of $f$ over a short interval; continuity makes that average tend to $f(x)$.</p><p><b>FTC Part 2:</b> If $G'(x)=f(x)$ on $[a,b]$, then $$\\int_a^b f(x)\\,dx=G(b)-G(a).$$ This follows because the accumulation function and $G$ have the same derivative, so they differ by a constant.</p><p><b>Assumptions that matter:</b> continuity of $f$ gives the clean Part 1 statement; antiderivatives must be valid on the whole interval for Part 2; endpoints matter; signed area can be negative when $f$ is below the axis.</p>`,
    worked: {
      problem: "Use the Fundamental Theorem to compute $\\displaystyle\\int_1^3 2x\\,dx$.",
      skills: ["antiderivatives", "endpoint evaluation", "definite integrals"],
      strategy: "Find an antiderivative of $2x$, then subtract its endpoint values.",
      steps: [
        { do: "Find an antiderivative", result: "$G(x)=x^2$", why: "$G'(x)=2x$" },
        { do: "Write the FTC formula", result: "$\\int_1^3 2x\\,dx=G(3)-G(1)$", why: "definite integral from antiderivative" },
        { do: "Evaluate the right endpoint", result: "$G(3)=9$", why: "square $3$" },
        { do: "Evaluate the left endpoint", result: "$G(1)=1$", why: "square $1$" },
        { do: "Subtract", result: "$9-1=8$", why: "net accumulation over the interval" }
      ],
      verify: "The graph $2x$ is positive and increasing from $2$ to $6$ over width $2$, so area $8$ is plausible: average height $4$ times width $2$.",
      answer: "$\\displaystyle\\int_1^3 2x\\,dx=8$.",
      connects: "FTC turns an accumulation problem into endpoint arithmetic once an antiderivative is known."
    },
    practice: [
      { problem: "Let $F(x)=\\int_0^x \\cos t\\,dt$. Find $F'(x)$ and $F(\\pi/2)$.", steps: [
        { do: "Apply FTC Part 1", result: "$F'(x)=\\cos x$", why: "the integrand is continuous" },
        { do: "Find an antiderivative", result: "$G(t)=\\sin t$", why: "derivative of sine is cosine" },
        { do: "Use FTC Part 2", result: "$F(\\pi/2)=\\sin(\\pi/2)-\\sin0$", why: "evaluate endpoints" },
        { do: "Evaluate sine values", result: "$1-0$", why: "unit circle values" },
        { do: "Compute", result: "$1$", why: "subtract" }
      ], answer: "$F'(x)=\\cos x$ and $F(\\pi/2)=1$." },
      { problem: "Compute $\\displaystyle\\int_0^2 (3x^2+1)\\,dx$.", steps: [
        { do: "Find an antiderivative", result: "$G(x)=x^3+x$", why: "differentiate to get $3x^2+1$" },
        { do: "Evaluate at $2$", result: "$G(2)=8+2=10$", why: "right endpoint" },
        { do: "Evaluate at $0$", result: "$G(0)=0$", why: "left endpoint" },
        { do: "Subtract", result: "$10-0=10$", why: "FTC" },
        { do: "Check positivity", result: "integrand is positive", why: "area should be positive" }
      ], answer: "$10$." },
      { problem: "If $A(x)=\\int_2^x \\sqrt{1+t^2}\\,dt$, find $A'(3)$.", steps: [
        { do: "Identify the integrand", result: "$f(t)=\\sqrt{1+t^2}$", why: "the accumulated function" },
        { do: "Check continuity", result: "continuous for all $t$", why: "$1+t^2>0$" },
        { do: "Apply FTC Part 1", result: "$A'(x)=\\sqrt{1+x^2}$", why: "differentiate the upper-limit accumulation" },
        { do: "Substitute $x=3$", result: "$A'(3)=\\sqrt{10}$", why: "replace $x$ by $3$" },
        { do: "Approximate", result: "$\\sqrt{10}\\approx3.162$", why: "numeric rate of accumulation" }
      ], answer: "$A'(3)=\\sqrt{10}\\approx3.162$." },
      { problem: "Compute $\\displaystyle\\int_1^e \\frac{1}{x}\\,dx$.", steps: [
        { do: "Find an antiderivative", result: "$G(x)=\\ln x$", why: "on positive $x$, derivative of $\\ln x$ is $1/x$" },
        { do: "Evaluate right endpoint", result: "$G(e)=1$", why: "$\\ln e=1$" },
        { do: "Evaluate left endpoint", result: "$G(1)=0$", why: "$\\ln1=0$" },
        { do: "Subtract", result: "$1-0=1$", why: "FTC" },
        { do: "Check domain", result: "$[1,e]$ is positive", why: "the antiderivative is valid throughout" }
      ], answer: "$1$." },
      { problem: "A training loss rate is modeled by $r(t)=0.6e^{-0.3t}$. Compute accumulated loss decrease from $t=0$ to $t=5$.", steps: [
        { do: "Find an antiderivative", result: "$G(t)=-2e^{-0.3t}$", why: "derivative is $0.6e^{-0.3t}$" },
        { do: "Apply FTC", result: "$\\int_0^5 r(t)\\,dt=G(5)-G(0)$", why: "accumulated rate" },
        { do: "Evaluate", result: "$-2e^{-1.5}-(-2)$", why: "$0.3\\cdot5=1.5$" },
        { do: "Approximate", result: "$2(1-e^{-1.5})$", why: "factor positive form" },
        { do: "Compute", result: "$2(1-0.2231)=1.5538$", why: "use $e^{-1.5}\\approx0.2231$" }
      ], answer: "Accumulated decrease is about $1.554$ loss units." }
    ],
    applications: [
      { title: "Accumulated gradients", background: "Continuous-time optimization views parameter change as the integral of velocity or negative gradient flow.", numbers: "If $dw/dt=-0.2$ for $5$ seconds, total change is $\\int_0^5-0.2\\,dt=-1$." },
      { title: "Probability from density", background: "A probability density accumulates to a cumulative distribution function, and FTC says the derivative of the CDF is the density.", numbers: "For density $f(x)=2x$ on $[0,1]$, $P(0.2\\le X\\le0.5)=0.5^2-0.2^2=0.21$." },
      { title: "Area under learning curves", background: "Training diagnostics integrate loss or accuracy over time to compare whole runs.", numbers: "If loss rate curve is $L(t)=1-t/10$ from $0$ to $5$, area is $[t-t^2/20]_0^5=3.75$." },
      { title: "Physics simulation", background: "Position is accumulated velocity; velocity is the derivative of position.", numbers: "Velocity $v(t)=3t^2$ from $0$ to $2$ gives displacement $t^3|_0^2=8$ meters." },
      { title: "Calibration curves", background: "A density over scores can be integrated to count mass in a score band.", numbers: "Uniform density $0.5$ on a length-$2$ interval gives mass $0.5(2)=1$." },
      { title: "Numerical checks", background: "FTC lets numerical integration and differentiation validate each other.", numbers: "If $F(x)=x^3$, then $F'(x)=3x^2$ and $\\int_1^2 3x^2\\,dx=8-1=7$." }
    ],
    applicationsClose: "The Fundamental Theorem is the great unifier: rates accumulate, and accumulated continuous rates differentiate back to themselves.",
    takeaways: ["If $F(x)=\\int_a^x f(t)\\,dt$ and $f$ is continuous, then $F'(x)=f(x)$.", "If $G'=f$, then $\\int_a^b f=G(b)-G(a)$.", "Continuity and a valid antiderivative on the interval are the key hypotheses.", "FTC turns area, probability, motion, and training diagnostics into endpoint calculations when antiderivatives are known." ]
  }
};
