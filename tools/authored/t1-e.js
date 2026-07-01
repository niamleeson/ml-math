"use strict";

module.exports = {
  "math-01-38": {
    id: "math-01-38",
    title: "Antiderivatives",
    tagline: "Run the derivative movie backward: recover a family of functions from its rate of change.",
    connections: {
      buildsOn: ["derivatives", "power rule", "constant multiples and sums"],
      leadsTo: ["Riemann sums", "the definite integral", "the Fundamental Theorem of Calculus"],
      usedWith: ["differential equations", "area", "accumulation functions"]
    },
    motivation:
      "<p>You already know how to differentiate $F(x)=x^3$: the result is $F'(x)=3x^2$. Antiderivatives ask the reverse question: if the rate is $3x^2$, what original function could have produced it?</p>" +
      "<p>The gentle catch is that derivatives forget constants. $x^3$, $x^3+7$, and $x^3-100$ all have derivative $3x^2$. So an antiderivative is not one function but a whole family, with the missing vertical shift written as $+C$.</p>",
    definition:
      "<p>An <b>antiderivative</b> of $f$ on an interval is a function $F$ such that $F'(x)=f(x)$ for every $x$ in that interval. The <b>indefinite integral</b> records the whole family: $$\\int f(x)\\,dx=F(x)+C,$$ where $C$ is an arbitrary constant.</p>" +
      "<p><b>Assumptions that matter:</b> work on one interval at a time, because constants can differ across disconnected pieces. The rules reverse derivative rules: $\\int x^n\\,dx=\\frac{x^{n+1}}{n+1}+C$ for $n\\ne-1$, while $\\int \\frac1x\\,dx=\\ln|x|+C$.</p>",
    worked: {
      problem: "Find $\\displaystyle\\int (6x^2-4x+5)\\,dx$.",
      skills: ["linearity", "reverse power rule", "constant of integration"],
      strategy: "Integrate one term at a time, then add the constant that differentiation would erase.",
      steps: [
        { do: "Split the integral", result: "$\\int6x^2\\,dx-\\int4x\\,dx+\\int5\\,dx$", why: "linearity lets sums and constant multiples separate" },
        { do: "Antidifferentiate $6x^2$", result: "$2x^3$", why: "$\\frac{d}{dx}(2x^3)=6x^2$" },
        { do: "Antidifferentiate $-4x$", result: "$-2x^2$", why: "$\\frac{d}{dx}(-2x^2)=-4x$" },
        { do: "Antidifferentiate $5$", result: "$5x$", why: "the derivative of $5x$ is $5$" },
        { do: "Add the forgotten constant", result: "$2x^3-2x^2+5x+C$", why: "all constant shifts have the same derivative" }
      ],
      verify: "Differentiate: $6x^2-4x+5+0$, which matches the integrand exactly.",
      answer: "$\\displaystyle\\int (6x^2-4x+5)\\,dx=2x^3-2x^2+5x+C$",
      connects: "accumulation — antiderivatives are the functions whose slopes encode a changing rate."
    },
    practice: [
      { problem: "$\\displaystyle\\int (8x^3+3x^2-7)\\,dx$", steps: [
        { do: "Split the integral", result: "$\\int8x^3\\,dx+\\int3x^2\\,dx-\\int7\\,dx$", why: "linearity" },
        { do: "Integrate $8x^3$", result: "$2x^4$", why: "raise the power to $4$ and divide by $4$" },
        { do: "Integrate $3x^2$", result: "$x^3$", why: "raise the power to $3$ and divide by $3$" },
        { do: "Integrate $-7$", result: "$-7x$", why: "a constant rate accumulates linearly" },
        { do: "Add $C$", result: "$2x^4+x^3-7x+C$", why: "indefinite integrals describe a family" }
      ], answer: "$2x^4+x^3-7x+C$" },
      { problem: "$\\displaystyle\\int \\left(\\sqrt{x}+\\frac{4}{x}\\right)\\,dx$ for $x>0$", steps: [
        { do: "Rewrite the square root", result: "$\\int (x^{1/2}+4x^{-1})\\,dx$", why: "powers make the rules visible" },
        { do: "Integrate $x^{1/2}$", result: "$\\frac{2}{3}x^{3/2}$", why: "raise the exponent to $3/2$ and divide" },
        { do: "Integrate $4x^{-1}$", result: "$4\\ln x$", why: "the $n=-1$ case uses logarithms" },
        { do: "Combine terms", result: "$\\frac{2}{3}x^{3/2}+4\\ln x$", why: "linearity recombines the pieces" },
        { do: "Add $C$", result: "$\\frac{2}{3}x^{3/2}+4\\ln x+C$", why: "the original height is unknown" }
      ], answer: "$\\frac{2}{3}x^{3/2}+4\\ln x+C$" },
      { problem: "Find $F$ if $F'(x)=12x^2-6x+1$ and $F(0)=4$.", steps: [
        { do: "Antidifferentiate the derivative", result: "$F(x)=4x^3-3x^2+x+C$", why: "reverse the power rule term by term" },
        { do: "Evaluate at $x=0$", result: "$F(0)=C$", why: "all powers of $0$ vanish" },
        { do: "Use $F(0)=4$", result: "$C=4$", why: "the initial value fixes the vertical shift" },
        { do: "Substitute the constant", result: "$F(x)=4x^3-3x^2+x+4$", why: "now the family becomes one function" },
        { do: "Check the derivative", result: "$F'(x)=12x^2-6x+1$", why: "the condition is satisfied" }
      ], answer: "$F(x)=4x^3-3x^2+x+4$" },
      { problem: "$\\displaystyle\\int (2\\cos x-3\\sin x+e^x)\\,dx$", steps: [
        { do: "Split the integral", result: "$2\\int\\cos x\\,dx-3\\int\\sin x\\,dx+\\int e^x\\,dx$", why: "linearity" },
        { do: "Integrate $2\\cos x$", result: "$2\\sin x$", why: "the derivative of $\\sin x$ is $\\cos x$" },
        { do: "Integrate $-3\\sin x$", result: "$3\\cos x$", why: "the derivative of $\\cos x$ is $-\\sin x$" },
        { do: "Integrate $e^x$", result: "$e^x$", why: "the exponential is its own derivative" },
        { do: "Add $C$", result: "$2\\sin x+3\\cos x+e^x+C$", why: "constant shifts disappear under differentiation" }
      ], answer: "$2\\sin x+3\\cos x+e^x+C$" },
      { problem: "A scalar model has gradient $g(w)=0.2w-1.6$. Find a loss $L(w)$ with $L(0)=5$.", steps: [
        { do: "Write the antiderivative", result: "$L(w)=\\int(0.2w-1.6)\\,dw$", why: "the gradient is the derivative of the loss" },
        { do: "Integrate $0.2w$", result: "$0.1w^2$", why: "divide the coefficient by $2$" },
        { do: "Integrate $-1.6$", result: "$-1.6w$", why: "constant slope accumulates linearly" },
        { do: "Add the constant", result: "$L(w)=0.1w^2-1.6w+C$", why: "many losses share the same gradient" },
        { do: "Use $L(0)=5$", result: "$C=5$", why: "the baseline loss fixes the shift" }
      ], answer: "$L(w)=0.1w^2-1.6w+5$" }
    ],
    applications: [
      { title: "Recovering position from velocity", background: "Physics stores motion as rates; antiderivatives turn velocity back into position once one starting point is known.", numbers: "If $v(t)=3t^2$ meters per second and $s(0)=2$, then $s(t)=t^3+2$; at $t=4$, $s=66$ meters." },
      { title: "Loss from a one-dimensional gradient", background: "Optimization often sees derivatives first; reconstructing a loss along a line explains what the optimizer is descending.", numbers: "For $g(w)=4w-8$, $L(w)=2w^2-8w+C$ and the minimum occurs where $g=0$, at $w=2$." },
      { title: "Cumulative clicks from click rate", background: "A traffic dashboard may report clicks per hour; the antiderivative estimates total clicks.", numbers: "Rate $r(t)=20+6t$ from hour $0$ gives $C(t)=20t+3t^2$; after $5$ hours, $175$ clicks." },
      { title: "Expected utility curves", background: "Marginal utility tells the gain from one more unit; antiderivatives recover total utility up to a baseline.", numbers: "If marginal utility is $10/(x+1)$, then utility is $10\\ln(x+1)+C$; from $x=0$ to $9$ the gain is $10\\ln10\\approx23.03$." },
      { title: "Calibration from density shape", background: "A probability density is the derivative of a cumulative distribution; antiderivatives build the CDF.", numbers: "For $f(x)=2x$ on $[0,1]$, $F(x)=x^2$; $P(X\\le0.7)=0.49$." },
      { title: "Battery usage from power draw", background: "Energy is accumulated power, so an antiderivative converts watts over time into watt-hours.", numbers: "Power $P(t)=50+10t$ watts for $t$ hours gives $E(t)=50t+5t^2$ Wh; after $3$ hours, $195$ Wh." }
    ],
    applicationsClose: "Antiderivatives are the same quiet move everywhere: start with a rate, restore the accumulated quantity, and use one known value to place it correctly.",
    takeaways: [
      "An antiderivative $F$ satisfies $F'=f$ on an interval.",
      "Indefinite integrals include $+C$ because derivatives erase constants.",
      "The reverse power rule works for $x^n$ when $n\\ne-1$; $1/x$ gives a logarithm."
    ]
  },
  "math-01-39": {
    id: "math-01-39",
    title: "Riemann sums",
    tagline: "Approximate a curvy accumulation by many thin rectangles, then let the rectangles get thinner.",
    connections: {
      buildsOn: ["functions", "limits", "area of rectangles"],
      leadsTo: ["the definite integral", "numerical integration", "expectation as weighted area"],
      usedWith: ["partitions", "summation notation", "limits"]
    },
    motivation:
      "<p>If a car moves at a constant $60$ miles per hour for $2$ hours, distance is just rectangle area: $60\\cdot2=120$ miles. But real speed changes. What do we do when the top of the rectangle is a curve?</p>" +
      "<p>A <b>Riemann sum</b> says: use many narrow rectangles. Each one is simple; together they approximate the curvy total. As the rectangles get thinner, the approximation becomes the definite integral.</p>",
    definition:
      "<p>Partition $[a,b]$ into $n$ subintervals of width $\\Delta x=\\frac{b-a}{n}$. Choose a sample point $x_i^*$ in each subinterval. A Riemann sum is $$\\sum_{i=1}^n f(x_i^*)\\Delta x.$$ It means height times width, added across the interval.</p>" +
      "<p><b>Assumptions that matter:</b> for the limiting area to be well-defined, $f$ should be Riemann integrable; continuous functions are safe. Left, right, and midpoint choices can differ for finite $n$, but they converge to the same value for nice functions as $\\Delta x\\to0$.</p>",
    worked: {
      problem: "Approximate the area under $f(x)=x^2$ on $[0,2]$ using $4$ right-endpoint rectangles.",
      skills: ["partitioning", "right endpoints", "summation"],
      strategy: "Build the rectangles carefully: width first, sample points second, then add height times width.",
      steps: [
        { do: "Compute the width", result: "$\\Delta x=\\frac{2-0}{4}=\\frac12$", why: "four equal subintervals cover length $2$" },
        { do: "List right endpoints", result: "$x_i=\\frac12,1,\\frac32,2$", why: "each rectangle uses the right edge" },
        { do: "Evaluate the heights", result: "$\\frac14,1,\\frac94,4$", why: "square each endpoint" },
        { do: "Add height times width", result: "$\\left(\\frac14+1+\\frac94+4\\right)\\frac12$", why: "area of each rectangle is height times width" },
        { do: "Simplify", result: "$\\frac{15}{4}=3.75$", why: "the height sum is $\\frac{15}{2}$" }
      ],
      verify: "The exact integral is $\\int_0^2x^2\\,dx=8/3\\approx2.67$; right rectangles overestimate because $x^2$ is increasing.",
      answer: "The right Riemann sum is $3.75$.",
      connects: "definite integrals — this rectangle total becomes exact in the limit."
    },
    practice: [
      { problem: "Use $4$ left rectangles for $f(x)=x+1$ on $[0,2]$.", steps: [
        { do: "Compute the width", result: "$\\Delta x=\\frac12$", why: "length $2$ split into $4$ pieces" },
        { do: "List left endpoints", result: "$0,\\frac12,1,\\frac32$", why: "left rectangles sample the start of each subinterval" },
        { do: "Evaluate heights", result: "$1,\\frac32,2,\\frac52$", why: "use $f(x)=x+1$" },
        { do: "Add heights", result: "$7$", why: "$1+1.5+2+2.5=7$" },
        { do: "Multiply by width", result: "$\\frac72$", why: "rectangle area is total height times common width" }
      ], answer: "$\\frac72=3.5$" },
      { problem: "Use $4$ midpoint rectangles for $f(x)=x^2$ on $[0,2]$.", steps: [
        { do: "Compute the width", result: "$\\Delta x=\\frac12$", why: "four equal pieces" },
        { do: "List midpoints", result: "$\\frac14,\\frac34,\\frac54,\\frac74$", why: "each is halfway across a subinterval" },
        { do: "Evaluate heights", result: "$\\frac{1}{16},\\frac{9}{16},\\frac{25}{16},\\frac{49}{16}$", why: "square the midpoints" },
        { do: "Add heights", result: "$\\frac{84}{16}=\\frac{21}{4}$", why: "combine fractions" },
        { do: "Multiply by width", result: "$\\frac{21}{8}=2.625$", why: "sum of rectangle areas" }
      ], answer: "$\\frac{21}{8}=2.625$" },
      { problem: "Write the right Riemann sum for $f(x)=\\sqrt{x}$ on $[1,5]$ with $n$ rectangles.", steps: [
        { do: "Find the width", result: "$\\Delta x=\\frac{5-1}{n}=\\frac4n$", why: "divide the interval length by $n$" },
        { do: "Write the right endpoint", result: "$x_i=1+\\frac{4i}{n}$", why: "move $i$ widths from the left endpoint" },
        { do: "Evaluate the height", result: "$f(x_i)=\\sqrt{1+\\frac{4i}{n}}$", why: "substitute the endpoint" },
        { do: "Attach the width", result: "$\\sqrt{1+\\frac{4i}{n}}\\frac4n$", why: "one rectangle's area" },
        { do: "Sum over rectangles", result: "$\\sum_{i=1}^n \\sqrt{1+\\frac{4i}{n}}\\,\\frac4n$", why: "add all rectangle areas" }
      ], answer: "$\\displaystyle\\sum_{i=1}^n \\sqrt{1+\\frac{4i}{n}}\\,\\frac4n$" },
      { problem: "Estimate $\\int_0^1 e^x\\,dx$ with $4$ right rectangles, using $e^{0.25}\\approx1.284$, $e^{0.5}\\approx1.649$, $e^{0.75}\\approx2.117$, $e\\approx2.718$.", steps: [
        { do: "Compute the width", result: "$\\Delta x=\\frac14$", why: "the interval length is $1$" },
        { do: "List right heights", result: "$1.284,1.649,2.117,2.718$", why: "sample at $0.25,0.5,0.75,1$" },
        { do: "Add heights", result: "$7.768$", why: "combine the four sampled values" },
        { do: "Multiply by the width", result: "$1.942$", why: "$7.768\\cdot0.25$" },
        { do: "Compare to exact size", result: "$e-1\\approx1.718$", why: "right rectangles overestimate increasing $e^x$" }
      ], answer: "Approximately $1.942$" },
      { problem: "A validation loss is measured at epochs $0,1,2,3$ as $0.90,0.62,0.50,0.47$. Estimate total loss exposure over $[0,3]$ using left rectangles of width $1$.", steps: [
        { do: "Choose left samples", result: "$0.90,0.62,0.50$", why: "three intervals use epochs $0,1,2$" },
        { do: "Use the width", result: "$\\Delta t=1$ epoch", why: "measurements are one epoch apart" },
        { do: "Multiply each height by width", result: "$0.90,0.62,0.50$", why: "width is $1$" },
        { do: "Add the rectangles", result: "$2.02$", why: "sum loss exposure over intervals" },
        { do: "State units", result: "$2.02$ loss-epochs", why: "area has height times time units" }
      ], answer: "$2.02$ loss-epochs" }
    ],
    applications: [
      { title: "Numerical integration", background: "Computers rarely integrate symbolic formulas in production; they sample and add rectangles or improved rectangle-like rules.", numbers: "For $\\int_0^1x^2dx$, $10$ right rectangles give $0.385$ versus exact $0.3333$, an error of $0.0517$." },
      { title: "Expected value from sampled densities", background: "A density-weighted average is an integral; bins approximate it when only a histogram is available.", numbers: "Bins at $x=1,2,3$ with probabilities $0.2,0.5,0.3$ give $E[X]\\approx1(0.2)+2(0.5)+3(0.3)=2.1$." },
      { title: "Area under a precision-recall curve", background: "Model evaluation curves are often reported by summing sampled rectangles under a curve.", numbers: "Precisions $0.9,0.8,0.6$ over recall widths $0.2,0.3,0.5$ give area $0.18+0.24+0.30=0.72$." },
      { title: "Training compute exposure", background: "Loss over training time can be summarized as an area, not just a final value.", numbers: "Losses $1.2,0.8,0.6$ across three one-hour intervals give $2.6$ loss-hours by left rectangles." },
      { title: "Sensor energy estimation", background: "Edge devices sample power; rectangle sums estimate battery consumption between samples.", numbers: "Power readings $2.0,2.4,2.1$ W over $0.5$ h intervals give energy $(2.0+2.4+2.1)0.5=3.25$ Wh." },
      { title: "Monte Carlo as random rectangles", background: "Monte Carlo integration samples random heights instead of a fixed grid, then averages.", numbers: "If sampled values of $x^2$ on $[0,1]$ average $0.34$ over $1000$ samples, the integral estimate is $0.34\\cdot1=0.34$." }
    ],
    applicationsClose: "Riemann sums turn curves into honest arithmetic: choose widths, sample heights, add. The same habit powers numerical integration, metrics, and sampled expectations.",
    takeaways: [
      "A Riemann sum is $\\sum f(x_i^*)\\Delta x$.",
      "Left, right, and midpoint choices differ at finite $n$ but agree in the limit for continuous functions.",
      "The definite integral is the limiting value of these rectangle sums."
    ]
  },
  "math-01-40": {
    id: "math-01-40",
    title: "The definite integral",
    tagline: "A definite integral is signed accumulation: infinitely many tiny products added over an interval.",
    connections: {
      buildsOn: ["Riemann sums", "limits", "antiderivatives"],
      leadsTo: ["the Fundamental Theorem of Calculus", "probability densities", "continuous expectations"],
      usedWith: ["area", "average value", "signed accumulation"]
    },
    motivation:
      "<p>Riemann sums gave us a practical approximation: many rectangles under a curve. The definite integral is what those sums are aiming at when the rectangles become infinitely thin.</p>" +
      "<p>The word <b>area</b> is useful, but the deeper word is accumulation. Velocity accumulates into distance, density accumulates into probability, and loss over time accumulates into total training exposure.</p>",
    definition:
      "<p>The <b>definite integral</b> of $f$ from $a$ to $b$ is $$\\int_a^b f(x)\\,dx=\\lim_{n\\to\\infty}\\sum_{i=1}^n f(x_i^*)\\Delta x,$$ when this limit exists. Positive values add area above the axis; negative values subtract area below it.</p>" +
      "<p><b>Assumptions that matter:</b> continuous functions are integrable, and bounded functions with only finitely many jump discontinuities are safe in ordinary calculus. Orientation matters: $\\int_b^a f(x)\\,dx=-\\int_a^b f(x)\\,dx$, and units multiply, so height units times $x$-units become accumulated units.</p>",
    worked: {
      problem: "Compute $\\displaystyle\\int_0^2 (3x^2+1)\\,dx$ using an antiderivative.",
      skills: ["antiderivatives", "endpoint evaluation", "units of accumulation"],
      strategy: "Find a function whose derivative is the integrand, then subtract its endpoint values.",
      steps: [
        { do: "Find an antiderivative", result: "$F(x)=x^3+x$", why: "$F'(x)=3x^2+1$" },
        { do: "Evaluate at the upper endpoint", result: "$F(2)=8+2=10$", why: "accumulation up to $2$" },
        { do: "Evaluate at the lower endpoint", result: "$F(0)=0$", why: "accumulation up to $0$" },
        { do: "Subtract", result: "$F(2)-F(0)=10$", why: "only the change in the antiderivative matters" },
        { do: "State the integral", result: "$\\int_0^2(3x^2+1)\\,dx=10$", why: "definite integrals return a number" }
      ],
      verify: "The integrand is at least $1$ and rises to $13$; an area of $10$ over width $2$ is reasonable.",
      answer: "$10$",
      connects: "Fundamental Theorem — endpoint subtraction is the bridge from area limits to antiderivatives."
    },
    practice: [
      { problem: "$\\displaystyle\\int_1^3 2x\\,dx$", steps: [
        { do: "Find an antiderivative", result: "$F(x)=x^2$", why: "the derivative of $x^2$ is $2x$" },
        { do: "Evaluate at $3$", result: "$F(3)=9$", why: "upper endpoint" },
        { do: "Evaluate at $1$", result: "$F(1)=1$", why: "lower endpoint" },
        { do: "Subtract", result: "$9-1=8$", why: "definite integral is accumulated change" },
        { do: "Check geometry", result: "trapezoid area $\\frac{2+6}{2}\\cdot2=8$", why: "the line rises from $2$ to $6$" }
      ], answer: "$8$" },
      { problem: "$\\displaystyle\\int_0^{\\pi} \\sin x\\,dx$", steps: [
        { do: "Find an antiderivative", result: "$F(x)=-\\cos x$", why: "the derivative of $-\\cos x$ is $\\sin x$" },
        { do: "Evaluate at $\\pi$", result: "$F(\\pi)=1$", why: "$\\cos\\pi=-1$" },
        { do: "Evaluate at $0$", result: "$F(0)=-1$", why: "$\\cos0=1$" },
        { do: "Subtract", result: "$1-(-1)=2$", why: "area under one sine hump" },
        { do: "State sign", result: "positive", why: "$\\sin x\\ge0$ on $[0,\\pi]$" }
      ], answer: "$2$" },
      { problem: "$\\displaystyle\\int_{-1}^{1} x^3\\,dx$", steps: [
        { do: "Notice symmetry", result: "$x^3$ is odd", why: "$f(-x)=-f(x)$" },
        { do: "Pair opposite intervals", result: "left area cancels right area", why: "signed area below and above the axis match" },
        { do: "Find an antiderivative", result: "$F(x)=\\frac{x^4}{4}$", why: "verify by differentiating" },
        { do: "Evaluate endpoints", result: "$F(1)=\\frac14$, $F(-1)=\\frac14$", why: "fourth powers match" },
        { do: "Subtract", result: "$0$", why: "equal signed accumulations cancel" }
      ], answer: "$0$" },
      { problem: "$\\displaystyle\\int_0^1 (4x^3-2x)\\,dx$", steps: [
        { do: "Find an antiderivative", result: "$F(x)=x^4-x^2$", why: "reverse the power rule" },
        { do: "Evaluate at $1$", result: "$F(1)=1-1=0$", why: "upper endpoint" },
        { do: "Evaluate at $0$", result: "$F(0)=0$", why: "lower endpoint" },
        { do: "Subtract", result: "$0$", why: "positive and negative signed areas balance" },
        { do: "Locate the sign change", result: "$4x^3-2x=2x(2x^2-1)$", why: "the cancellation is plausible" }
      ], answer: "$0$" },
      { problem: "For density $f(x)=2x$ on $[0,1]$, compute $P(0.2\\le X\\le0.8)$.", steps: [
        { do: "Set up the probability integral", result: "$\\int_{0.2}^{0.8}2x\\,dx$", why: "probability is area under the density" },
        { do: "Find an antiderivative", result: "$F(x)=x^2$", why: "$F'=2x$" },
        { do: "Evaluate at $0.8$", result: "$0.64$", why: "upper cumulative probability" },
        { do: "Evaluate at $0.2$", result: "$0.04$", why: "lower cumulative probability" },
        { do: "Subtract", result: "$0.60$", why: "probability between endpoints" }
      ], answer: "$0.60$" }
    ],
    applications: [
      { title: "Probability from a density", background: "Continuous random variables assign probability by integrating a density over an interval.", numbers: "For $f(x)=2x$ on $[0,1]$, $P(X>0.5)=\\int_{0.5}^1 2x\\,dx=1-0.25=0.75$." },
      { title: "Expected value", background: "The mean of a continuous distribution is a weighted integral, the continuous version of a weighted average.", numbers: "For $f(x)=2x$ on $[0,1]$, $E[X]=\\int_0^1 x\\cdot2x\\,dx=2/3\\approx0.667$." },
      { title: "Area under ROC", background: "AUC measures ranking quality by integrating true-positive rate over false-positive rate.", numbers: "If $\\operatorname{TPR}(u)=0.6+0.4u$, then AUC $=\\int_0^1(0.6+0.4u)du=0.8$." },
      { title: "Average loss over time", background: "A final loss can hide training instability; integrated loss summarizes the whole run.", numbers: "If $L(t)=e^{-t}$ over $0\\le t\\le3$, total exposure is $1-e^{-3}\\approx0.950$, average $0.317$." },
      { title: "Work from force", background: "Mechanical work accumulates force over distance; this is the original physical intuition for integrals.", numbers: "A spring with $F(x)=10x$ N stretched to $0.3$ m uses $\\int_0^{0.3}10x\\,dx=0.45$ J." },
      { title: "Image intensity over a region", background: "Computer vision often sums brightness over pixels; the continuous model is an area integral.", numbers: "If intensity along a line is $I(x)=100x$ on $[0,1]$, total brightness is $50$ intensity-units." }
    ],
    applicationsClose: "The definite integral is signed accumulation with units. Once you see that, probability, metrics, physics, and training curves all become the same calculation.",
    takeaways: [
      "$\\int_a^b f(x)\\,dx$ is the limit of Riemann sums.",
      "It measures signed accumulation, not just geometric area.",
      "For antiderivative $F$, endpoint subtraction gives $F(b)-F(a)$."
    ]
  },
  "math-01-41": {
    id: "math-01-41",
    title: "The Fundamental Theorem of Calculus",
    tagline: "Differentiation and integration are inverse stories about the same accumulated change.",
    connections: {
      buildsOn: ["definite integrals", "antiderivatives", "derivatives"],
      leadsTo: ["substitution", "integration by parts", "continuous probability"],
      usedWith: ["accumulation functions", "chain rule", "net change"]
    },
    motivation:
      "<p>So far, derivatives measure instantaneous change, while integrals measure accumulated change. They may feel like separate tools. The Fundamental Theorem says they are two views of one machine.</p>" +
      "<p>If $A(x)$ means the area accumulated from $a$ to $x$, then increasing $x$ by a tiny amount adds a thin slice whose height is about $f(x)$. So the rate of change of accumulated area is the original function.</p>",
    definition:
      "<p>The <b>Fundamental Theorem of Calculus</b> has two parts. If $f$ is continuous, then $$A(x)=\\int_a^x f(t)\\,dt$$ is differentiable and $A'(x)=f(x)$. Also, if $F'(x)=f(x)$, then $$\\int_a^b f(x)\\,dx=F(b)-F(a).$$</p>" +
      "<p><b>Assumptions that matter:</b> continuity guarantees the clean derivative-of-accumulation statement. The variable inside the integral is a dummy variable, often $t$, so the upper endpoint $x$ can move. If the endpoint is $g(x)$, the chain rule gives $\\frac{d}{dx}\\int_a^{g(x)}f(t)\\,dt=f(g(x))g'(x)$.</p>",
    worked: {
      problem: "Let $A(x)=\\displaystyle\\int_1^{x^2}\\ln(1+t)\\,dt$. Find $A'(x)$.",
      skills: ["FTC Part 1", "chain rule", "moving upper limit"],
      strategy: "The upper limit is not just $x$; use the FTC, then multiply by the derivative of the upper limit.",
      steps: [
        { do: "Name the integrand", result: "$f(t)=\\ln(1+t)$", why: "FTC returns the integrand at the moving endpoint" },
        { do: "Name the upper limit", result: "$g(x)=x^2$", why: "the endpoint depends on $x$" },
        { do: "Apply FTC with chain rule", result: "$A'(x)=f(g(x))g'(x)$", why: "differentiate accumulated area with a moving boundary" },
        { do: "Substitute $g(x)=x^2$", result: "$A'(x)=\\ln(1+x^2)\\,g'(x)$", why: "evaluate the integrand at the upper endpoint" },
        { do: "Differentiate $g$", result: "$A'(x)=2x\\ln(1+x^2)$", why: "$g'(x)=2x$" }
      ],
      verify: "For $x>0$, increasing $x$ raises the upper limit, and the derivative is positive because both $2x$ and $\\ln(1+x^2)$ are positive.",
      answer: "$A'(x)=2x\\ln(1+x^2)$",
      connects: "substitution — moving endpoints and chain-rule factors are the same pattern seen from opposite directions."
    },
    practice: [
      { problem: "Compute $\\displaystyle\\int_2^5 (4x-3)\\,dx$ using the FTC.", steps: [
        { do: "Find an antiderivative", result: "$F(x)=2x^2-3x$", why: "$F'=4x-3$" },
        { do: "Evaluate at $5$", result: "$F(5)=50-15=35$", why: "upper endpoint" },
        { do: "Evaluate at $2$", result: "$F(2)=8-6=2$", why: "lower endpoint" },
        { do: "Subtract", result: "$35-2=33$", why: "FTC Part 2" },
        { do: "Check sign", result: "positive", why: "the function is mostly above zero on $[2,5]$" }
      ], answer: "$33$" },
      { problem: "If $B(x)=\\displaystyle\\int_0^x \\sqrt{1+t^3}\\,dt$, find $B'(x)$.", steps: [
        { do: "Identify the upper limit", result: "$x$", why: "the endpoint moves directly with $x$" },
        { do: "Identify the integrand", result: "$f(t)=\\sqrt{1+t^3}$", why: "this is the accumulated height" },
        { do: "Apply FTC Part 1", result: "$B'(x)=f(x)$", why: "derivative of accumulation returns the current height" },
        { do: "Substitute $x$ for $t$", result: "$B'(x)=\\sqrt{1+x^3}$", why: "evaluate at the moving endpoint" },
        { do: "Note no antiderivative was needed", result: "$\\sqrt{1+x^3}$", why: "FTC Part 1 avoids symbolic integration" }
      ], answer: "$\\sqrt{1+x^3}$" },
      { problem: "If $C(x)=\\displaystyle\\int_x^4 e^{t^2}\\,dt$, find $C'(x)$.", steps: [
        { do: "Rewrite the orientation", result: "$C(x)=-\\int_4^x e^{t^2}\\,dt$", why: "swap limits introduces a minus sign" },
        { do: "Apply FTC Part 1", result: "$C'(x)=-e^{x^2}$", why: "differentiate the accumulation from $4$ to $x$" },
        { do: "Check the sign", result: "negative", why: "raising the lower limit removes positive area" },
        { do: "Avoid finding an antiderivative", result: "$-e^{x^2}$", why: "$e^{t^2}$ has no elementary antiderivative" },
        { do: "State the derivative", result: "$C'(x)=-e^{x^2}$", why: "the orientation is the whole trick" }
      ], answer: "$-e^{x^2}$" },
      { problem: "If $D(x)=\\displaystyle\\int_0^{\\sin x}\\frac{1}{1+t^2}\\,dt$, find $D'(x)$.", steps: [
        { do: "Name the integrand", result: "$f(t)=\\frac{1}{1+t^2}$", why: "FTC evaluates this at the upper limit" },
        { do: "Name the upper limit", result: "$g(x)=\\sin x$", why: "the endpoint is a function of $x$" },
        { do: "Apply the chain rule form", result: "$D'(x)=f(g(x))g'(x)$", why: "moving endpoint" },
        { do: "Substitute $g(x)$", result: "$D'(x)=\\frac{1}{1+\\sin^2 x}g'(x)$", why: "replace $t$ by $\\sin x$" },
        { do: "Differentiate $g$", result: "$D'(x)=\\frac{\\cos x}{1+\\sin^2 x}$", why: "$g'(x)=\\cos x$" }
      ], answer: "$\\frac{\\cos x}{1+\\sin^2 x}$" },
      { problem: "A model's instantaneous error rate is $r(t)=0.4e^{-0.2t}$. Find total error exposure from $t=0$ to $t=5$.", steps: [
        { do: "Set up the integral", result: "$\\int_0^5 0.4e^{-0.2t}\\,dt$", why: "total exposure is accumulated rate" },
        { do: "Find an antiderivative", result: "$F(t)=-2e^{-0.2t}$", why: "$-2(-0.2)=0.4$" },
        { do: "Evaluate at $5$", result: "$F(5)=-2e^{-1}$", why: "upper endpoint" },
        { do: "Evaluate at $0$", result: "$F(0)=-2$", why: "lower endpoint" },
        { do: "Subtract", result: "$2(1-e^{-1})\\approx1.264$", why: "FTC converts rate to total" }
      ], answer: "$2(1-e^{-1})\\approx1.264$ error-time units" }
    ],
    applications: [
      { title: "CDF and PDF", background: "In probability, a cumulative distribution is accumulated density; the FTC says the density is its derivative.", numbers: "If $F(x)=x^2$ on $[0,1]$, then $f(x)=F'(x)=2x$, and $P(0.3<X<0.7)=0.49-0.09=0.40$." },
      { title: "Backprop through an integral layer", background: "Some models integrate a learned field; gradients with respect to endpoints use the FTC directly.", numbers: "For $A(z)=\\int_0^z(1+t^2)dt$, $A'(z)=1+z^2$; at $z=3$, the endpoint gradient is $10$." },
      { title: "Total distance from velocity", background: "Velocity is the derivative of position; the FTC turns a velocity integral into net position change.", numbers: "If $v(t)=6t$ m/s from $0$ to $4$, distance is $[3t^2]_0^4=48$ m." },
      { title: "AUC from an analytic ROC curve", background: "When a ROC curve has a formula, the FTC gives an exact metric instead of a sampled estimate.", numbers: "For $\\operatorname{TPR}(u)=\\sqrt{u}$, AUC $=\\int_0^1u^{1/2}du=2/3\\approx0.667$." },
      { title: "Normalizing constants", background: "A density must integrate to $1$; the FTC computes the required scale for simple families.", numbers: "For $f(x)=cx$ on $[0,2]$, $1=\\int_0^2cx\\,dx=2c$, so $c=0.5$." },
      { title: "Learning-rate budgets", background: "Continuous training analyses integrate learning-rate schedules to measure total update budget.", numbers: "For $\\eta(t)=0.1e^{-t/10}$ over $[0,20]$, budget is $[-e^{-t/10}]_0^{20}=1-e^{-2}\\approx0.865$." }
    ],
    applicationsClose: "The theorem is a bridge: accumulated quantity differentiates back to its local rate, and local rate integrates to net change. That bridge is everywhere in ML mathematics.",
    takeaways: [
      "If $A(x)=\\int_a^x f(t)\\,dt$ and $f$ is continuous, then $A'(x)=f(x)$.",
      "If $F'=f$, then $\\int_a^b f=F(b)-F(a)$.",
      "Moving endpoints add the chain rule factor."
    ]
  },
  "math-01-42": {
    id: "math-01-42",
    title: "Integration by substitution",
    tagline: "Undo the chain rule by renaming the inner expression that is causing the clutter.",
    connections: {
      buildsOn: ["the Fundamental Theorem of Calculus", "chain rule", "antiderivatives"],
      leadsTo: ["integration by parts", "trigonometric substitution", "change of variables in probability"],
      usedWith: ["chain rule", "definite integrals", "inverse functions"]
    },
    motivation:
      "<p>When you differentiate $\\sin(x^2)$, the chain rule creates $2x\\cos(x^2)$. Substitution runs that movie backward: when an integrand contains an inside function and its derivative, rename the inside function.</p>" +
      "<p>The point is not to make the problem fancy. It is to make it familiar. A messy $x$-integral can become a simple $u$-integral once the right quantity carries the change in variables.</p>",
    definition:
      "<p><b>Substitution</b> is the reverse chain rule. If $u=g(x)$ and $du=g'(x)\\,dx$, then $$\\int f(g(x))g'(x)\\,dx=\\int f(u)\\,du.$$ For definite integrals, either convert the limits to $u$-values or substitute back before evaluating.</p>" +
      "<p><b>Assumptions that matter:</b> $g$ should be differentiable on the interval, and the replacement must account for every $dx$ factor. For definite integrals, limits must match the variable currently being used; mixing $u$-limits with an $x$-integrand is a common source of wrong answers.</p>",
    worked: {
      problem: "Compute $\\displaystyle\\int 2x\\cos(x^2)\\,dx$.",
      skills: ["reverse chain rule", "differentials", "trig antiderivatives"],
      strategy: "The inside $x^2$ has derivative $2x$, which is sitting right beside it. Rename $x^2$.",
      steps: [
        { do: "Choose the substitution", result: "$u=x^2$", why: "the cosine's inside expression is the clutter" },
        { do: "Differentiate", result: "$du=2x\\,dx$", why: "this matches the remaining factor" },
        { do: "Rewrite the integral", result: "$\\int \\cos u\\,du$", why: "replace $x^2$ by $u$ and $2x\\,dx$ by $du$" },
        { do: "Integrate", result: "$\\sin u+C$", why: "the derivative of $\\sin u$ is $\\cos u$" },
        { do: "Substitute back", result: "$\\sin(x^2)+C$", why: "the original variable was $x$" }
      ],
      verify: "Differentiate $\\sin(x^2)$ to get $2x\\cos(x^2)$ by the chain rule.",
      answer: "$\\sin(x^2)+C$",
      connects: "chain rule — substitution is exactly the chain rule read backward."
    },
    practice: [
      { problem: "$\\displaystyle\\int 3(3x+1)^4\\,dx$", steps: [
        { do: "Choose $u$", result: "$u=3x+1$", why: "the power's inside expression is linear" },
        { do: "Differentiate", result: "$du=3\\,dx$", why: "this appears in the integral" },
        { do: "Rewrite", result: "$\\int u^4\\,du$", why: "$3\\,dx$ becomes $du$" },
        { do: "Integrate", result: "$\\frac{u^5}{5}+C$", why: "reverse power rule" },
        { do: "Substitute back", result: "$\\frac{(3x+1)^5}{5}+C$", why: "return to $x$" }
      ], answer: "$\\frac{(3x+1)^5}{5}+C$" },
      { problem: "$\\displaystyle\\int \\frac{4x}{1+2x^2}\\,dx$", steps: [
        { do: "Choose $u$", result: "$u=1+2x^2$", why: "the denominator's derivative is nearby" },
        { do: "Differentiate", result: "$du=4x\\,dx$", why: "exact match" },
        { do: "Rewrite", result: "$\\int \\frac{1}{u}\\,du$", why: "replace numerator times $dx$ by $du$" },
        { do: "Integrate", result: "$\\ln|u|+C$", why: "the antiderivative of $1/u$ is logarithmic" },
        { do: "Substitute back", result: "$\\ln(1+2x^2)+C$", why: "$1+2x^2$ is positive" }
      ], answer: "$\\ln(1+2x^2)+C$" },
      { problem: "$\\displaystyle\\int_0^1 6x(1+3x^2)^2\\,dx$", steps: [
        { do: "Choose $u$", result: "$u=1+3x^2$", why: "the derivative $6x$ appears" },
        { do: "Change the lower limit", result: "$u(0)=1$", why: "definite integrals need matching limits" },
        { do: "Change the upper limit", result: "$u(1)=4$", why: "substitute $x=1$" },
        { do: "Rewrite the integral", result: "$\\int_1^4 u^2\\,du$", why: "$6x\\,dx=du$" },
        { do: "Evaluate", result: "$\\left[\\frac{u^3}{3}\\right]_1^4=\\frac{63}{3}=21$", why: "FTC in the $u$ variable" }
      ], answer: "$21$" },
      { problem: "$\\displaystyle\\int e^{5x-2}\\,dx$", steps: [
        { do: "Choose $u$", result: "$u=5x-2$", why: "the exponent is the inside expression" },
        { do: "Differentiate", result: "$du=5\\,dx$", why: "solve for the missing $dx$ factor" },
        { do: "Replace $dx$", result: "$dx=\\frac15du$", why: "the integral lacks a factor $5$" },
        { do: "Rewrite and integrate", result: "$\\frac15\\int e^u\\,du=\\frac15e^u+C$", why: "constant factors can move outside" },
        { do: "Substitute back", result: "$\\frac15e^{5x-2}+C$", why: "return to $x$" }
      ], answer: "$\\frac15e^{5x-2}+C$" },
      { problem: "A model score $S$ has density $p(s)=\\frac{1}{10}e^{-s/10}$ for $s\\ge0$. Compute $P(0\\le S\\le20)$.", steps: [
        { do: "Set up the integral", result: "$\\int_0^{20}\\frac{1}{10}e^{-s/10}\\,ds$", why: "probability is integrated density" },
        { do: "Choose $u$", result: "$u=-s/10$", why: "the exponent is the inside expression" },
        { do: "Differentiate", result: "$du=-\\frac{1}{10}ds$", why: "the density has $\\frac1{10}ds$" },
        { do: "Use the antiderivative", result: "$-e^{-s/10}$", why: "substitution gives the negative exponential" },
        { do: "Evaluate", result: "$[-e^{-s/10}]_0^{20}=1-e^{-2}\\approx0.865$", why: "subtract endpoint values" }
      ], answer: "$1-e^{-2}\\approx0.865$" }
    ],
    applications: [
      { title: "Change of variables in probability", background: "Transforming random variables requires the same derivative factor that substitution teaches.", numbers: "If $u=2x$ and $x\\in[0,1]$, then $dx=du/2$ and $\\int_0^1 2x\\,dx=\\int_0^2 u/2\\,du=1$." },
      { title: "Normal CDF standardization", background: "Scores are often standardized so one table or routine handles many Gaussian distributions.", numbers: "For $X\\sim N(10,4)$, $P(X<14)=P(Z<2)\\approx0.9772$ using $z=(x-10)/2$." },
      { title: "Softplus and logistic gradients", background: "Neural-network losses use nested exponentials and logs; substitution recognizes their chain-rule structure.", numbers: "$\\int \\frac{e^x}{1+e^x}dx$ with $u=1+e^x$ gives $\\ln(1+e^x)+C$." },
      { title: "Time rescaling in dynamical systems", background: "Changing from seconds to milliseconds rescales integrals by the derivative of the time change.", numbers: "If $u=1000t$, then $dt=du/1000$; $\\int_0^1 r(1000t)dt=\\frac1{1000}\\int_0^{1000}r(u)du$." },
      { title: "Feature normalization", background: "Integrals over normalized features must carry the scale factor, just like standardized probability densities.", numbers: "For $z=(x-50)/10$, $dx=10dz$; an interval $x=40$ to $70$ becomes $z=-1$ to $2$." },
      { title: "Radial kernels", background: "Kernel methods often integrate functions of squared distance, where $u=r^2$ simplifies the expression.", numbers: "$\\int_0^1 2r e^{-r^2}dr$ with $u=r^2$ gives $1-e^{-1}\\approx0.632$." }
    ],
    applicationsClose: "Substitution is not a trick bag; it is the chain rule in reverse. Rename the inside, carry the derivative, and the clutter becomes a familiar integral.",
    takeaways: [
      "Use $u=g(x)$ when $g'(x)\\,dx$ is also present up to a constant.",
      "For definite integrals, change the limits or substitute back before evaluating.",
      "Substitution is the mathematical backbone of change of variables."
    ]
  },
  "math-01-43": {
    id: "math-01-43",
    title: "Integration by parts",
    tagline: "Undo the product rule by deciding which factor to differentiate and which to integrate.",
    connections: {
      buildsOn: ["product rule", "antiderivatives", "the definite integral"],
      leadsTo: ["Laplace transforms", "expectations by tail integrals", "Fourier analysis"],
      usedWith: ["substitution", "product rule", "improper integrals"]
    },
    motivation:
      "<p>Substitution handles reverse chain-rule patterns. But some integrals are products, like $x e^x$ or $x\\ln x$. These come from the product rule, not the chain rule.</p>" +
      "<p>Integration by parts gives a patient way to trade one product for another. Choose one factor to simplify by differentiation and the other to integrate. Good choices make the new integral easier than the old one.</p>",
    definition:
      "<p>From the product rule $(uv)'=u'v+uv'$, integrate both sides and rearrange: $$\\int u\\,dv=uv-\\int v\\,du.$$ For definite integrals, $$\\int_a^b u\\,dv=[uv]_a^b-\\int_a^b v\\,du.$$</p>" +
      "<p><b>Assumptions that matter:</b> $u$ and $v$ should be differentiable enough on the interval, and the remaining integral must be simpler. A useful instinct is to let logarithms and polynomials be $u$ because they simplify when differentiated.</p>",
    worked: {
      problem: "Compute $\\displaystyle\\int x e^x\\,dx$.",
      skills: ["product rule reversal", "choosing $u$", "exponential antiderivatives"],
      strategy: "Let the polynomial simplify by differentiation and let the exponential stay easy to integrate.",
      steps: [
        { do: "Choose $u$ and $dv$", result: "$u=x$, $dv=e^x\\,dx$", why: "$x$ becomes simpler when differentiated" },
        { do: "Differentiate $u$", result: "$du=dx$", why: "needed for the replacement integral" },
        { do: "Integrate $dv$", result: "$v=e^x$", why: "the exponential is its own antiderivative" },
        { do: "Apply the formula", result: "$\\int xe^x\\,dx=xe^x-\\int e^x\\,dx$", why: "$\\int u\\,dv=uv-\\int v\\,du$" },
        { do: "Finish the remaining integral", result: "$xe^x-e^x+C$", why: "the new integral is simpler" }
      ],
      verify: "Differentiate $xe^x-e^x$: product rule gives $e^x+xe^x-e^x=xe^x$.",
      answer: "$xe^x-e^x+C=e^x(x-1)+C$",
      connects: "product rule — integration by parts is exactly the product rule rearranged."
    },
    practice: [
      { problem: "$\\displaystyle\\int x\\cos x\\,dx$", steps: [
        { do: "Choose $u$ and $dv$", result: "$u=x$, $dv=\\cos x\\,dx$", why: "the polynomial simplifies" },
        { do: "Compute $du$", result: "$du=dx$", why: "differentiate $x$" },
        { do: "Compute $v$", result: "$v=\\sin x$", why: "integrate cosine" },
        { do: "Apply parts", result: "$x\\sin x-\\int\\sin x\\,dx$", why: "use $uv-\\int v\\,du$" },
        { do: "Integrate the remainder", result: "$x\\sin x+\\cos x+C$", why: "$\\int\\sin x\\,dx=-\\cos x$" }
      ], answer: "$x\\sin x+\\cos x+C$" },
      { problem: "$\\displaystyle\\int \\ln x\\,dx$ for $x>0$", steps: [
        { do: "Insert a hidden factor", result: "$\\int \\ln x\\cdot1\\,dx$", why: "parts needs two pieces" },
        { do: "Choose $u$ and $dv$", result: "$u=\\ln x$, $dv=dx$", why: "logarithms simplify when differentiated" },
        { do: "Compute $du$ and $v$", result: "$du=\\frac1x\\,dx$, $v=x$", why: "differentiate and integrate" },
        { do: "Apply parts", result: "$x\\ln x-\\int x\\frac1x\\,dx$", why: "$uv-\\int v\\,du$" },
        { do: "Simplify and integrate", result: "$x\\ln x-x+C$", why: "the remainder is $\\int1\\,dx$" }
      ], answer: "$x\\ln x-x+C$" },
      { problem: "$\\displaystyle\\int_0^1 x e^{2x}\\,dx$", steps: [
        { do: "Choose $u$ and $dv$", result: "$u=x$, $dv=e^{2x}\\,dx$", why: "$x$ simplifies" },
        { do: "Compute $du$", result: "$du=dx$", why: "differentiate $x$" },
        { do: "Compute $v$", result: "$v=\\frac12e^{2x}$", why: "integrate $e^{2x}$" },
        { do: "Apply definite parts", result: "$\\left[\\frac{x}{2}e^{2x}\\right]_0^1-\\int_0^1\\frac12e^{2x}\\,dx$", why: "boundary term minus simpler integral" },
        { do: "Evaluate", result: "$\\frac{e^2}{2}-\\left[\\frac14e^{2x}\\right]_0^1=\\frac{e^2+1}{4}$", why: "subtract endpoint values" }
      ], answer: "$\\frac{e^2+1}{4}$" },
      { problem: "$\\displaystyle\\int x^2\\sin x\\,dx$", steps: [
        { do: "Choose $u$ and $dv$", result: "$u=x^2$, $dv=\\sin x\\,dx$", why: "the polynomial will simplify after repeated parts" },
        { do: "Compute $du$ and $v$", result: "$du=2x\\,dx$, $v=-\\cos x$", why: "differentiate and integrate" },
        { do: "Apply parts", result: "$-x^2\\cos x+\\int2x\\cos x\\,dx$", why: "the new integral has a lower-degree polynomial" },
        { do: "Apply parts again to $\\int2x\\cos x\\,dx$", result: "$2x\\sin x-\\int2\\sin x\\,dx$", why: "differentiate $2x$ and integrate cosine" },
        { do: "Finish", result: "$-x^2\\cos x+2x\\sin x+2\\cos x+C$", why: "$\\int2\\sin x\\,dx=-2\\cos x$" }
      ], answer: "$-x^2\\cos x+2x\\sin x+2\\cos x+C$" },
      { problem: "Compute $E[X]$ for an exponential variable with survival $P(X>x)=e^{-2x}$ using $E[X]=\\int_0^\\infty P(X>x)\\,dx$.", steps: [
        { do: "Set up the tail integral", result: "$E[X]=\\int_0^\\infty e^{-2x}\\,dx$", why: "tail expectation formula" },
        { do: "Find an antiderivative", result: "$-\\frac12e^{-2x}$", why: "differentiate to recover $e^{-2x}$" },
        { do: "Evaluate the upper limit", result: "$0$", why: "$e^{-2x}\\to0$ as $x\\to\\infty$" },
        { do: "Evaluate the lower limit", result: "$-\\frac12$", why: "at $x=0$, $e^0=1$" },
        { do: "Subtract", result: "$\\frac12$", why: "mean waiting time for rate $2$" }
      ], answer: "$E[X]=\\frac12$" }
    ],
    applications: [
      { title: "Laplace transforms", background: "The derivative rule for Laplace transforms is derived by integration by parts.", numbers: "$\\mathcal{L}\\{f'\\}=\\int_0^\\infty e^{-st}f' dt=sF(s)-f(0)$ when the boundary at infinity is $0$." },
      { title: "Expectation identities", background: "Tail-integral formulas for nonnegative random variables use integration by parts on the CDF.", numbers: "For survival $e^{-3x}$, $E[X]=\\int_0^\\infty e^{-3x}dx=1/3$." },
      { title: "Entropy calculations", background: "Information theory often integrates products like $x\\ln x$ or densities times logs.", numbers: "$\\int_0^1 x\\ln x\\,dx=-1/4$, from parts with $u=\\ln x$ and $dv=x\\,dx$." },
      { title: "Fourier coefficients", background: "Integration by parts explains how smoothness makes high-frequency coefficients decay.", numbers: "A once-differentiable signal often has coefficients shrinking like $1/k$; at $k=100$, that scale is about $0.01$." },
      { title: "Work with changing force and displacement", background: "Products of position and exponential damping appear in mechanics and signal models.", numbers: "$\\int_0^1 xe^{-x}dx=1-2/e\\approx0.264$." },
      { title: "Regularization integrals", background: "Continuous penalty models can involve products of coordinates and basis functions.", numbers: "$\\int_0^1 x\\cos(\\pi x)dx=-2/\\pi^2\\approx-0.203$ by parts." }
    ],
    applicationsClose: "Parts is a trade: one factor gets simpler, the other gets integrated. The same trade appears in transforms, expectations, entropy, and signal analysis.",
    takeaways: [
      "Integration by parts comes from the product rule: $\\int u\\,dv=uv-\\int v\\,du$.",
      "Choose $u$ to become simpler when differentiated.",
      "For definite integrals, remember the boundary term $[uv]_a^b$."
    ]
  },
  "math-01-44": {
    id: "math-01-44",
    title: "Trigonometric integrals",
    tagline: "Use trig identities to turn powers of sine and cosine into integrals you already know.",
    connections: {
      buildsOn: ["trigonometric functions", "substitution", "Pythagorean identities"],
      leadsTo: ["trigonometric substitution", "Fourier analysis", "periodic signal energy"],
      usedWith: ["identities", "symmetry", "substitution"]
    },
    motivation:
      "<p>Integrals like $\\int\\sin x\\,dx$ are friendly. But $\\int\\sin^3x\\cos^2x\\,dx$ can look like a wall of symbols. The way through is not force; it is pattern recognition.</p>" +
      "<p>Trig identities let you save one factor for substitution or reduce even powers with half-angle formulas. The goal is always to reshape the expression until the basic antiderivatives come back into view.</p>",
    definition:
      "<p><b>Trigonometric integrals</b> are integrals involving powers and products of trig functions. The main identities are $$\\sin^2x+\\cos^2x=1,\\quad \\sin^2x=\\frac{1-\\cos2x}{2},\\quad \\cos^2x=\\frac{1+\\cos2x}{2}.$$ Odd powers often leave one sine or cosine for $du$; even powers often use half-angle identities.</p>" +
      "<p><b>Assumptions that matter:</b> identities hold for angles in radians, and substitutions must include the derivative factor. For definite integrals over full periods, symmetry and average values can simplify the work: the average of $\\sin^2x$ or $\\cos^2x$ over a full period is $1/2$.</p>",
    worked: {
      problem: "Compute $\\displaystyle\\int \\sin^3x\\cos^2x\\,dx$.",
      skills: ["odd sine power", "Pythagorean identity", "substitution"],
      strategy: "Save one $\\sin x\\,dx$ for substitution and rewrite the remaining $\\sin^2x$ using $1-\\cos^2x$.",
      steps: [
        { do: "Split the odd sine power", result: "$\\int \\sin^2x\\cos^2x\\sin x\\,dx$", why: "one sine factor will pair with $du$" },
        { do: "Rewrite $\\sin^2x$", result: "$\\int (1-\\cos^2x)\\cos^2x\\sin x\\,dx$", why: "express everything else in cosine" },
        { do: "Choose substitution", result: "$u=\\cos x$", why: "the saved $\\sin x\\,dx$ is related to $du$" },
        { do: "Differentiate", result: "$du=-\\sin x\\,dx$", why: "so $\\sin x\\,dx=-du$" },
        { do: "Rewrite and integrate", result: "$-\\int(1-u^2)u^2\\,du=-\\frac{u^3}{3}+\\frac{u^5}{5}+C$", why: "now it is a polynomial" },
        { do: "Substitute back", result: "$-\\frac{\\cos^3x}{3}+\\frac{\\cos^5x}{5}+C$", why: "return to the original angle" }
      ],
      verify: "Differentiating the answer gives $(\\cos^2x-\\cos^4x)\\sin x=\\sin^3x\\cos^2x$.",
      answer: "$-\\frac{\\cos^3x}{3}+\\frac{\\cos^5x}{5}+C$",
      connects: "substitution — trig identities prepare the integrand so a clean $u$ appears."
    },
    practice: [
      { problem: "$\\displaystyle\\int \\sin^2x\\,dx$", steps: [
        { do: "Use the half-angle identity", result: "$\\sin^2x=\\frac{1-\\cos2x}{2}$", why: "even powers need reduction" },
        { do: "Rewrite the integral", result: "$\\int\\frac{1-\\cos2x}{2}\\,dx$", why: "replace the squared trig function" },
        { do: "Split terms", result: "$\\frac12\\int1\\,dx-\\frac12\\int\\cos2x\\,dx$", why: "linearity" },
        { do: "Integrate", result: "$\\frac{x}{2}-\\frac{\\sin2x}{4}+C$", why: "$\\int\\cos2x\\,dx=\\frac12\\sin2x$" },
        { do: "State the result", result: "$\\frac{x}{2}-\\frac{\\sin2x}{4}+C$", why: "no substitution back is needed" }
      ], answer: "$\\frac{x}{2}-\\frac{\\sin2x}{4}+C$" },
      { problem: "$\\displaystyle\\int \\cos^3x\\,dx$", steps: [
        { do: "Split the odd power", result: "$\\int\\cos^2x\\cos x\\,dx$", why: "save one cosine for $du$" },
        { do: "Rewrite $\\cos^2x$", result: "$\\int(1-\\sin^2x)\\cos x\\,dx$", why: "prepare $u=\\sin x$" },
        { do: "Choose substitution", result: "$u=\\sin x$", why: "then $du=\\cos x\\,dx$" },
        { do: "Rewrite", result: "$\\int(1-u^2)\\,du$", why: "all trig is gone" },
        { do: "Integrate and substitute back", result: "$u-\\frac{u^3}{3}+C=\\sin x-\\frac{\\sin^3x}{3}+C$", why: "reverse power rule" }
      ], answer: "$\\sin x-\\frac{\\sin^3x}{3}+C$" },
      { problem: "$\\displaystyle\\int_0^{\\pi} \\sin^2x\\,dx$", steps: [
        { do: "Use half-angle", result: "$\\sin^2x=\\frac{1-\\cos2x}{2}$", why: "reduce the even power" },
        { do: "Find an antiderivative", result: "$F(x)=\\frac{x}{2}-\\frac{\\sin2x}{4}$", why: "integrate term by term" },
        { do: "Evaluate at $\\pi$", result: "$F(\\pi)=\\frac{\\pi}{2}$", why: "$\\sin2\\pi=0$" },
        { do: "Evaluate at $0$", result: "$F(0)=0$", why: "$\\sin0=0$" },
        { do: "Subtract", result: "$\\frac{\\pi}{2}$", why: "average value $1/2$ over length $\\pi$" }
      ], answer: "$\\frac{\\pi}{2}$" },
      { problem: "$\\displaystyle\\int \\sin^4x\\,dx$", steps: [
        { do: "Square the half-angle form", result: "$\\sin^4x=\\left(\\frac{1-\\cos2x}{2}\\right)^2$", why: "reduce the fourth power" },
        { do: "Expand", result: "$\\frac14(1-2\\cos2x+\\cos^22x)$", why: "algebra" },
        { do: "Reduce $\\cos^22x$", result: "$\\frac14\\left(1-2\\cos2x+\\frac{1+\\cos4x}{2}\\right)$", why: "half-angle again" },
        { do: "Simplify", result: "$\\frac38-\\frac12\\cos2x+\\frac18\\cos4x$", why: "combine constants" },
        { do: "Integrate", result: "$\\frac{3x}{8}-\\frac{\\sin2x}{4}+\\frac{\\sin4x}{32}+C$", why: "integrate each cosine with its frequency factor" }
      ], answer: "$\\frac{3x}{8}-\\frac{\\sin2x}{4}+\\frac{\\sin4x}{32}+C$" },
      { problem: "A signal is $s(t)=\\sin(2\\pi t)$. Compute its energy $\\int_0^1 s(t)^2\\,dt$.", steps: [
        { do: "Write the integral", result: "$\\int_0^1\\sin^2(2\\pi t)\\,dt$", why: "energy is squared amplitude over time" },
        { do: "Use half-angle", result: "$\\sin^2(2\\pi t)=\\frac{1-\\cos(4\\pi t)}{2}$", why: "reduce the square" },
        { do: "Integrate the constant part", result: "$\\int_0^1\\frac12dt=\\frac12$", why: "average baseline" },
        { do: "Integrate the cosine part", result: "$\\left[-\\frac{\\sin(4\\pi t)}{8\\pi}\\right]_0^1=0$", why: "one full oscillation cancels" },
        { do: "Add the parts", result: "$\\frac12$", why: "unit-amplitude sine has average squared value $1/2$" }
      ], answer: "$\\frac12$" }
    ],
    applications: [
      { title: "Signal energy", background: "Audio and sensor pipelines measure energy by integrating squared wave amplitude.", numbers: "A unit sine over one second has energy $\\int_0^1\\sin^2(2\\pi t)dt=0.5$." },
      { title: "Fourier orthogonality", background: "Fourier features work because sine and cosine products integrate to zero across full periods.", numbers: "$\\int_0^{2\\pi}\\sin x\\cos x\\,dx=0$, while $\\int_0^{2\\pi}\\sin^2x\\,dx=\\pi$." },
      { title: "Positional encodings", background: "Transformer positional encodings use sinusoids; inner products over windows depend on trig integrals.", numbers: "Over $[0,2\\pi]$, the average of $\\sin^2x$ is $\\pi/(2\\pi)=0.5$." },
      { title: "Seasonality models", background: "Demand and traffic curves often include seasonal sine terms whose accumulated effect over a period cancels.", numbers: "$\\int_0^{24}\\sin(2\\pi t/24)dt=0$, so a full-day seasonal deviation has zero net bias." },
      { title: "Robotics rotation costs", background: "Rotational motion involves sine and cosine components; squared components often simplify with identities.", numbers: "$\\sin^2\\theta+\\cos^2\\theta=1$, so integrated unit direction energy over $10$ seconds is $10$." },
      { title: "Random phase averages", background: "If a phase is uniformly random, trig integrals give expected squared projection.", numbers: "$E[\\cos^2\\Theta]=\\frac{1}{2\\pi}\\int_0^{2\\pi}\\cos^2\\theta d\\theta=0.5$." }
    ],
    applicationsClose: "Trig integrals reward identity work: reduce powers, use symmetry, and let substitution finish. That same pattern powers signals, Fourier features, and periodic models.",
    takeaways: [
      "Odd powers usually save one sine or cosine for substitution.",
      "Even powers usually use half-angle identities.",
      "Over full periods, symmetry and average values often do most of the work."
    ]
  },
  "math-01-45": {
    id: "math-01-45",
    title: "Trigonometric substitution",
    tagline: "Replace square-root geometry with a triangle whose identity does the simplifying for you.",
    connections: {
      buildsOn: ["substitution", "trigonometric identities", "inverse trigonometric functions"],
      leadsTo: ["partial fraction decomposition", "multivariable change of variables", "Gaussian and radial integrals"],
      usedWith: ["right triangles", "Pythagorean identity", "inverse trig"]
    },
    motivation:
      "<p>Square roots like $\\sqrt{a^2-x^2}$ and $\\sqrt{x^2+a^2}$ often resist ordinary substitution. The hidden clue is geometric: these expressions look like sides of a right triangle.</p>" +
      "<p>Trig substitution chooses an angle so a Pythagorean identity collapses the square root. The algebra gets longer for a moment, but the radical becomes simple, and the integral becomes one of the trig integrals you just practiced.</p>",
    definition:
      "<p><b>Trigonometric substitution</b> uses identities to simplify radicals: for $\\sqrt{a^2-x^2}$ use $x=a\\sin\\theta$; for $\\sqrt{a^2+x^2}$ use $x=a\\tan\\theta$; for $\\sqrt{x^2-a^2}$ use $x=a\\sec\\theta$. Then convert $dx$, simplify, integrate, and return to $x$.</p>" +
      "<p><b>Assumptions that matter:</b> choose angle ranges so the square root sign stays nonnegative, and translate back carefully with a triangle or inverse trig. For definite integrals, changing the limits to angles often avoids back-substitution errors.</p>",
    worked: {
      problem: "Compute $\\displaystyle\\int \\sqrt{9-x^2}\\,dx$.",
      skills: ["trig substitution", "half-angle identity", "back-substitution"],
      strategy: "The radical has $a^2-x^2$, so use $x=3\\sin\\theta$ and let $1-\\sin^2\\theta$ simplify it.",
      steps: [
        { do: "Choose substitution", result: "$x=3\\sin\\theta$", why: "matches $9-x^2$" },
        { do: "Differentiate", result: "$dx=3\\cos\\theta\\,d\\theta$", why: "convert the differential" },
        { do: "Simplify the radical", result: "$\\sqrt{9-9\\sin^2\\theta}=3\\cos\\theta$", why: "$1-\\sin^2\\theta=\\cos^2\\theta$ and choose $\\cos\\theta\\ge0$" },
        { do: "Rewrite the integral", result: "$\\int 9\\cos^2\\theta\\,d\\theta$", why: "multiply radical and $dx$" },
        { do: "Use half-angle and integrate", result: "$\\frac{9}{2}\\theta+\\frac{9}{4}\\sin2\\theta+C$", why: "$\\cos^2\\theta=(1+\\cos2\\theta)/2$" },
        { do: "Return to $x$", result: "$\\frac{9}{2}\\arcsin\\frac{x}{3}+\\frac{x}{2}\\sqrt{9-x^2}+C$", why: "$\\sin2\\theta=2\\sin\\theta\\cos\\theta=\\frac{2x\\sqrt{9-x^2}}{9}$" }
      ],
      verify: "The formula is the area under a semicircle of radius $3$; differentiating returns the height $\\sqrt{9-x^2}$.",
      answer: "$\\frac{x}{2}\\sqrt{9-x^2}+\\frac{9}{2}\\arcsin\\frac{x}{3}+C$",
      connects: "geometry — the substitution works because the radical is a triangle side."
    },
    practice: [
      { problem: "$\\displaystyle\\int \\frac{dx}{\\sqrt{4-x^2}}$", steps: [
        { do: "Choose substitution", result: "$x=2\\sin\\theta$", why: "matches $a^2-x^2$" },
        { do: "Differentiate", result: "$dx=2\\cos\\theta\\,d\\theta$", why: "convert $dx$" },
        { do: "Simplify the radical", result: "$\\sqrt{4-4\\sin^2\\theta}=2\\cos\\theta$", why: "Pythagorean identity" },
        { do: "Rewrite the integral", result: "$\\int\\frac{2\\cos\\theta}{2\\cos\\theta}\\,d\\theta$", why: "radical cancels the differential factor" },
        { do: "Integrate and return", result: "$\\theta+C=\\arcsin\\frac{x}{2}+C$", why: "$x=2\\sin\\theta$" }
      ], answer: "$\\arcsin\\frac{x}{2}+C$" },
      { problem: "$\\displaystyle\\int \\frac{dx}{x^2\\sqrt{x^2-1}}$ for $x>1$", steps: [
        { do: "Choose substitution", result: "$x=\\sec\\theta$", why: "matches $x^2-1$" },
        { do: "Differentiate", result: "$dx=\\sec\\theta\\tan\\theta\\,d\\theta$", why: "convert $dx$" },
        { do: "Simplify the radical", result: "$\\sqrt{\\sec^2\\theta-1}=\\tan\\theta$", why: "identity $\\sec^2\\theta-1=\\tan^2\\theta$" },
        { do: "Rewrite", result: "$\\int\\frac{\\sec\\theta\\tan\\theta}{\\sec^2\\theta\\tan\\theta}\\,d\\theta=\\int\\cos\\theta\\,d\\theta$", why: "cancel common factors" },
        { do: "Integrate and return", result: "$\\sin\\theta+C=\\frac{\\sqrt{x^2-1}}{x}+C$", why: "triangle gives opposite over hypotenuse" }
      ], answer: "$\\frac{\\sqrt{x^2-1}}{x}+C$" },
      { problem: "$\\displaystyle\\int \\frac{dx}{x^2+4}$", steps: [
        { do: "Choose substitution", result: "$x=2\\tan\\theta$", why: "matches $a^2+x^2$" },
        { do: "Differentiate", result: "$dx=2\\sec^2\\theta\\,d\\theta$", why: "convert $dx$" },
        { do: "Rewrite the denominator", result: "$x^2+4=4\\tan^2\\theta+4=4\\sec^2\\theta$", why: "$1+\\tan^2\\theta=\\sec^2\\theta$" },
        { do: "Rewrite the integral", result: "$\\int\\frac{2\\sec^2\\theta}{4\\sec^2\\theta}\\,d\\theta$", why: "substitute numerator and denominator" },
        { do: "Integrate and return", result: "$\\frac12\\theta+C=\\frac12\\arctan\\frac{x}{2}+C$", why: "$x=2\\tan\\theta$" }
      ], answer: "$\\frac12\\arctan\\frac{x}{2}+C$" },
      { problem: "$\\displaystyle\\int_0^1 \\sqrt{1-x^2}\\,dx$", steps: [
        { do: "Choose substitution", result: "$x=\\sin\\theta$", why: "matches $1-x^2$" },
        { do: "Change limits", result: "$x=0\\to\\theta=0$, $x=1\\to\\theta=\\frac{\\pi}{2}$", why: "definite integral in angle form" },
        { do: "Convert the integrand", result: "$\\sqrt{1-x^2}\\,dx=\\cos^2\\theta\\,d\\theta$", why: "radical is $\\cos\\theta$ and $dx=\\cos\\theta d\\theta$" },
        { do: "Use half-angle", result: "$\\int_0^{\\pi/2}\\frac{1+\\cos2\\theta}{2}\\,d\\theta$", why: "integrate the even power" },
        { do: "Evaluate", result: "$\\left[\\frac{\\theta}{2}+\\frac{\\sin2\\theta}{4}\\right]_0^{\\pi/2}=\\frac{\\pi}{4}$", why: "quarter of the unit circle area" }
      ], answer: "$\\frac{\\pi}{4}$" },
      { problem: "A radial kernel needs $\\int_0^1 \\frac{1}{\\sqrt{1-r^2}}\\,dr$. Compute it.", steps: [
        { do: "Choose substitution", result: "$r=\\sin\\theta$", why: "the denominator is $\\sqrt{1-r^2}$" },
        { do: "Change limits", result: "$0\\to0$, $1\\to\\frac{\\pi}{2}$", why: "convert endpoints" },
        { do: "Convert the differential", result: "$dr=\\cos\\theta\\,d\\theta$", why: "differentiate the substitution" },
        { do: "Simplify the denominator", result: "$\\sqrt{1-r^2}=\\cos\\theta$", why: "on $[0,\\pi/2]$, cosine is nonnegative" },
        { do: "Evaluate", result: "$\\int_0^{\\pi/2}1\\,d\\theta=\\frac{\\pi}{2}$", why: "the cosine factors cancel" }
      ], answer: "$\\frac{\\pi}{2}$" }
    ],
    applications: [
      { title: "Circle and disk geometry", background: "The classic semicircle integral uses trig substitution to compute areas exactly.", numbers: "$\\int_{-1}^1\\sqrt{1-x^2}dx=\\pi/2$, the area of a unit semicircle." },
      { title: "Radial probability models", background: "Radial densities often include square roots from circular or spherical geometry.", numbers: "$\\int_0^1(2/\\pi)(1-r^2)^{-1/2}dr=1$, since the unscaled integral is $\\pi/2$." },
      { title: "Computer graphics", background: "Rendering circular arcs and lenses requires integrating chord lengths across pixels.", numbers: "The area under $\\sqrt{9-x^2}$ from $-3$ to $3$ is $9\\pi/2\\approx14.14$." },
      { title: "Robotics reachability", background: "A two-dimensional reach disk creates constraints of the form $x^2+y^2\\le R^2$.", numbers: "For $R=2$, vertical reach at $x=1.2$ is $\\sqrt{4-1.44}=1.6$." },
      { title: "Cauchy distribution", background: "The Cauchy density integrates through an arctangent, the same pattern as $a^2+x^2$ substitution.", numbers: "$\\int_{-1}^1\\frac{1}{\\pi(1+x^2)}dx=\\frac{1}{\\pi}(\\pi/4-(-\\pi/4))=0.5$." },
      { title: "Normalization in bounded embeddings", background: "Some bounded-coordinate models use densities with endpoint singularities that simplify by sine substitution.", numbers: "$\\int_0^1\\frac{1}{\\pi\\sqrt{x(1-x)}}dx=1$ after $x=\\sin^2\\theta$." }
    ],
    applicationsClose: "Trig substitution is geometry wearing algebra. Pick the triangle, let the identity simplify the radical, and translate the answer back with care.",
    takeaways: [
      "Use $x=a\\sin\\theta$ for $a^2-x^2$, $x=a\\tan\\theta$ for $a^2+x^2$, and $x=a\\sec\\theta$ for $x^2-a^2$.",
      "Convert $dx$ and, for definite integrals, convert the limits.",
      "Back-substitution usually comes from a right triangle or an inverse trig function."
    ]
  },
  "math-01-46": {
    id: "math-01-46",
    title: "Partial fraction decomposition",
    tagline: "Break a rational function into simple pieces whose integrals are already familiar.",
    connections: {
      buildsOn: ["polynomials", "factoring", "antiderivatives"],
      leadsTo: ["Laplace transforms", "rational generating functions", "linear systems"],
      usedWith: ["logarithms", "arctangent integrals", "algebraic matching"]
    },
    motivation:
      "<p>Rational functions can look compact but hide several simpler behaviors. For example, $\\frac{5x+1}{x^2-x-2}$ is really a combination of two reciprocal terms once the denominator is factored.</p>" +
      "<p>Partial fractions are the algebraic version of separating a chord into notes. Each simple denominator has a known integral, often a logarithm or arctangent, so the hard-looking rational integral becomes a small matching problem.</p>",
    definition:
      "<p><b>Partial fraction decomposition</b> rewrites a proper rational function $P(x)/Q(x)$ as a sum of simpler rational terms after factoring $Q$. Linear factors get terms like $A/(x-a)$; repeated linear factors get $A_1/(x-a)+A_2/(x-a)^2+\\cdots$; irreducible quadratics get $(Ax+B)/(x^2+px+q)$.</p>" +
      "<p><b>Assumptions that matter:</b> first make the fraction proper; if $\\deg P\\ge\\deg Q$, use polynomial division. Factor over the real numbers unless told otherwise. Coefficients are found by clearing denominators and matching powers or substituting convenient roots.</p>",
    worked: {
      problem: "Compute $\\displaystyle\\int \\frac{5x+1}{x^2-x-2}\\,dx$.",
      skills: ["factoring", "partial fractions", "logarithmic integrals"],
      strategy: "Factor the denominator, solve for simple reciprocal pieces, then integrate each logarithm.",
      steps: [
        { do: "Factor the denominator", result: "$x^2-x-2=(x-2)(x+1)$", why: "partial fractions start with factors" },
        { do: "Set up the decomposition", result: "$\\frac{5x+1}{(x-2)(x+1)}=\\frac{A}{x-2}+\\frac{B}{x+1}$", why: "one constant over each linear factor" },
        { do: "Clear denominators", result: "$5x+1=A(x+1)+B(x-2)$", why: "turn the identity into polynomial algebra" },
        { do: "Use $x=2$", result: "$11=3A$, so $A=\\frac{11}{3}$", why: "the $B$ term vanishes" },
        { do: "Use $x=-1$", result: "$-4=-3B$, so $B=\\frac{4}{3}$", why: "the $A$ term vanishes" },
        { do: "Integrate the pieces", result: "$\\frac{11}{3}\\ln|x-2|+\\frac{4}{3}\\ln|x+1|+C$", why: "$\\int\\frac{1}{x-a}dx=\\ln|x-a|$" }
      ],
      verify: "Combining the two fractions gives $\\frac{(11/3)(x+1)+(4/3)(x-2)}{(x-2)(x+1)}=\\frac{5x+1}{x^2-x-2}$.",
      answer: "$\\frac{11}{3}\\ln|x-2|+\\frac{4}{3}\\ln|x+1|+C$",
      connects: "Laplace transforms — partial fractions split rational transforms into invertible modes."
    },
    practice: [
      { problem: "$\\displaystyle\\int \\frac{3}{x^2-1}\\,dx$", steps: [
        { do: "Factor the denominator", result: "$x^2-1=(x-1)(x+1)$", why: "difference of squares" },
        { do: "Set up fractions", result: "$\\frac{3}{x^2-1}=\\frac{A}{x-1}+\\frac{B}{x+1}$", why: "one term per linear factor" },
        { do: "Clear denominators", result: "$3=A(x+1)+B(x-1)$", why: "match coefficients or plug roots" },
        { do: "Solve constants", result: "$A=\\frac32$, $B=-\\frac32$", why: "use $x=1$ and $x=-1$" },
        { do: "Integrate", result: "$\\frac32\\ln|x-1|-\\frac32\\ln|x+1|+C$", why: "reciprocal linear factors integrate to logs" }
      ], answer: "$\\frac32\\ln\\left|\\frac{x-1}{x+1}\\right|+C$" },
      { problem: "$\\displaystyle\\int \\frac{x+3}{x^2+5x+6}\\,dx$", steps: [
        { do: "Factor the denominator", result: "$x^2+5x+6=(x+2)(x+3)$", why: "find linear factors" },
        { do: "Set up decomposition", result: "$\\frac{x+3}{(x+2)(x+3)}=\\frac{A}{x+2}+\\frac{B}{x+3}$", why: "proper rational function" },
        { do: "Clear denominators", result: "$x+3=A(x+3)+B(x+2)$", why: "polynomial identity" },
        { do: "Use $x=-3$", result: "$0=-B$, so $B=0$", why: "the numerator shares the factor $x+3$" },
        { do: "Use $x=-2$", result: "$1=A$, so $A=1$", why: "solve the remaining constant" },
        { do: "Integrate", result: "$\\ln|x+2|+C$", why: "the expression simplifies to $1/(x+2)$" }
      ], answer: "$\\ln|x+2|+C$" },
      { problem: "$\\displaystyle\\int \\frac{2x+1}{x^2+x}\\,dx$", steps: [
        { do: "Factor the denominator", result: "$x^2+x=x(x+1)$", why: "split into linear factors" },
        { do: "Set up fractions", result: "$\\frac{2x+1}{x(x+1)}=\\frac{A}{x}+\\frac{B}{x+1}$", why: "one constant per factor" },
        { do: "Clear denominators", result: "$2x+1=A(x+1)+Bx$", why: "remove fractions" },
        { do: "Use $x=0$", result: "$1=A$", why: "the $B$ term vanishes" },
        { do: "Use $x=-1$", result: "$-1=-B$, so $B=1$", why: "the $A$ term vanishes" },
        { do: "Integrate", result: "$\\ln|x|+\\ln|x+1|+C$", why: "sum of logarithms" }
      ], answer: "$\\ln|x|+\\ln|x+1|+C$" },
      { problem: "$\\displaystyle\\int \\frac{1}{x(x+1)^2}\\,dx$", steps: [
        { do: "Set up repeated-factor form", result: "$\\frac{1}{x(x+1)^2}=\\frac{A}{x}+\\frac{B}{x+1}+\\frac{C}{(x+1)^2}$", why: "repeated factors need every power" },
        { do: "Clear denominators", result: "$1=A(x+1)^2+Bx(x+1)+Cx$", why: "polynomial identity" },
        { do: "Use $x=0$", result: "$A=1$", why: "only the $A$ term remains" },
        { do: "Use $x=-1$", result: "$-C=1$, so $C=-1$", why: "only the $C$ term remains" },
        { do: "Match the $x^2$ coefficient", result: "$0=A+B$, so $B=-1$", why: "$A=1$" },
        { do: "Integrate", result: "$\\ln|x|-\\ln|x+1|+\\frac{1}{x+1}+C_0$", why: "$\\int-(x+1)^{-2}dx=1/(x+1)$" }
      ], answer: "$\\ln|x|-\\ln|x+1|+\\frac{1}{x+1}+C$" },
      { problem: "Invert the simple transform $Y(s)=\\frac{1}{s(s+2)}$ by partial fractions.", steps: [
        { do: "Set up the decomposition", result: "$\\frac{1}{s(s+2)}=\\frac{A}{s}+\\frac{B}{s+2}$", why: "one term per linear factor" },
        { do: "Clear denominators", result: "$1=A(s+2)+Bs$", why: "solve for constants" },
        { do: "Use $s=0$", result: "$A=\\frac12$", why: "the $B$ term vanishes" },
        { do: "Use $s=-2$", result: "$B=-\\frac12$", why: "the $A$ term vanishes" },
        { do: "Invert each term", result: "$y(t)=\\frac12-\\frac12e^{-2t}$", why: "$1/s$ maps to $1$ and $1/(s+2)$ maps to $e^{-2t}$" }
      ], answer: "$y(t)=\\frac12(1-e^{-2t})$" }
    ],
    applications: [
      { title: "Laplace-transform inversion", background: "Linear ODE solutions often become rational functions in $s$; partial fractions reveal the time-domain modes.", numbers: "$\\frac{2}{s(s+2)}=\\frac1s-\\frac1{s+2}$, so the response is $1-e^{-2t}$." },
      { title: "Control-system poles", background: "A rational transfer function decomposes into modal pieces whose denominators are poles.", numbers: "$1/((s+1)(s+4))=\\frac{1/3}{s+1}-\\frac{1/3}{s+4}$, modes $e^{-t}$ and $e^{-4t}$." },
      { title: "Generating functions", background: "Counting sequences in CS use rational generating functions; partial fractions produce closed forms.", numbers: "$\\frac{1}{(1-x)(1-2x)}=-\\frac{1}{1-x}+\\frac{2}{1-2x}$, giving coefficients $2^{n+1}-1$." },
      { title: "Markov-chain transients", background: "Small stochastic systems can produce rational transforms for state probabilities.", numbers: "A two-rate decay with poles $-1$ and $-3$ gives terms $Ae^{-t}+Be^{-3t}$ after decomposition." },
      { title: "Rational probability densities", background: "Some densities normalize or integrate through decomposed rational terms.", numbers: "$\\int_2^\\infty\\frac{1}{x(x+1)}dx=[\\ln x-\\ln(x+1)]_2^\\infty=\\ln(3/2)\\approx0.405$." },
      { title: "Filter design", background: "Digital and analog filters are often analyzed through rational transfer functions split into simple sections.", numbers: "A denominator $(s+10)(s+100)$ corresponds to time constants $0.1$ s and $0.01$ s." }
    ],
    applicationsClose: "Partial fractions turn one rational expression into separate simple stories: logs for integrals, exponentials for transforms, and poles for systems.",
    takeaways: [
      "Make the rational function proper before decomposing.",
      "Linear factors get constants; repeated factors need every power.",
      "After decomposition, integration usually reduces to logarithms or arctangents."
    ]
  }
};
