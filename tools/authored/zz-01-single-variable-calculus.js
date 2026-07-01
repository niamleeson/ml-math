module.exports = {
  "math-01-01": {
    connectionsProse: "<p>This lesson begins with the basic language of functions, which is already present whenever one quantity is determined by another. Tables, formulas, and graphs are different ways to describe that same assignment from inputs to outputs. This foundation makes later calculus approachable because limits, derivatives, and integrals all act on functions.</p>",
    motivation: "<p>A function is a rule with a strict input-output agreement: each allowed input has exactly one output. The graph gives a picture of that agreement by placing every pair $(x,f(x))$ in the coordinate plane. Reading the graph is therefore another way of reading the rule.</p>" +
                "<p>The main habit is to keep track of domain and range. The domain tells which inputs are allowed before any calculation begins, and the range records the outputs that actually occur. The vertical-line test is a graphical version of the same rule: if one input line hits two outputs, the relation is not a function.</p>",
    definition: "<p>This is an explain-only lesson: this is a definition lesson about inputs, outputs, domain, range, and graph reading. Teach the vertical-line test and evaluate concrete rules rather than forcing a proof.</p>" +
                "<p><b>Assumptions that matter:</b> Use the stated domain, graph, interval, or modeling conditions before applying the classification.</p>",
    symbols: [
      { sym: "$x$", desc: "is an input" },
      { sym: "$f(x)$", desc: "is the output" },
      { sym: "the domain", desc: "is the allowed input set" },
      { sym: "the range", desc: "is the set of outputs produced" }
    ],
    applications: [
      { title: "Parking rule $f(h)=5+2h$", background: "Parking rule $f(h)=5+2h$ gives $f(3)=11$", numbers: "Parking rule $f(h)=5+2h$ gives $f(3)=11$" },
      { title: "Temperature conversion $C(F)=\\frac59(F-32)$", background: "Temperature conversion $C(F)=\\frac59(F-32)$ gives $C(68)=20$", numbers: "Temperature conversion $C(F)=\\frac59(F-32)$ gives $C(68)=20$" },
      { title: "Feature map $f(x)=3x-1$", background: "Feature map $f(x)=3x-1$ sends $4$ to $11$", numbers: "Feature map $f(x)=3x-1$ sends $4$ to $11$" },
      { title: "Domain of $\\sqrt{x-2}$", background: "Domain of $\\sqrt{x-2}$ starts at $x=2$; $f(6)=2$", numbers: "Domain of $\\sqrt{x-2}$ starts at $x=2$; $f(6)=2$" },
      { title: "Application 5", background: "Table inputs $1,2,3$ with outputs $2,4,6$ fit $f(x)=2x$", numbers: "Table inputs $1,2,3$ with outputs $2,4,6$ fit $f(x)=2x$" },
      { title: "The relation $(1,2),(1,3)$", background: "The relation $(1,2),(1,3)$ fails to be a function because input $1$ has two outputs", numbers: "The relation $(1,2),(1,3)$ fails to be a function because input $1$ has two outputs" }
    ]
  },
  "math-01-02": {
    connectionsProse: "<p>This lesson builds on familiar parent graphs such as lines, parabolas, and absolute value graphs. Instead of plotting a new graph from scratch, transformations let you carry a known shape to a new location or scale. These ideas prepare the reader for recognizing families of functions quickly throughout calculus.</p>",
    motivation: "<p>A transformation changes how inputs or outputs are recorded while preserving the underlying shape in a predictable way. Adding outside the function moves outputs up or down, multiplying outside stretches or reflects vertical distances, and changing the input inside the function moves or rescales the graph horizontally.</p>" +
                "<p>The important distinction is outside versus inside. Outside changes act directly on the output, so their visual effect follows the sign and scale you see. Inside changes act on the input needed to reach an old point, so horizontal shifts and scales often feel reversed until you track which old input is being used.</p>",
    definition: "<p>Central statement: $g(x)=f(bx)$ — the old input is reached when the new input is $x/b$, so horizontal lengths scale by $1/b$.</p>" +
                "<p><b>Assumptions that matter:</b> Follow the conditions stated in the derivation, including required domains, nonzero denominators, continuity or differentiability hypotheses, interval restrictions, and convergence conditions.</p>",
    symbols: [
      { sym: "$h$", desc: "is horizontal shift" },
      { sym: "$k$", desc: "is vertical shift" },
      { sym: "$a$", desc: "is vertical scale" },
      { sym: "$b$", desc: "is horizontal reciprocal scale" }
    ],
    derivation: [
      { do: "Start with a point $(x,f(x))$ on the graph", result: "Start with a point $(x,f(x))$ on the graph", why: "this records the old input and output." },
      { do: "Add $k$ outside the function", result: "$g(x)=f(x)+k$", why: "every output increases by $k$, so the graph shifts vertically." },
      { do: "Replace $x$ by $x-h$", result: "$g(x)=f(x-h)$", why: "the old input $x-h$ equals the new coordinate $x$, so the graph shifts right by $h$." },
      { do: "Multiply outside", result: "$g(x)=a f(x)$", why: "every output is scaled by $a$." },
      { do: "Multiply inside", result: "$g(x)=f(bx)$", why: "the old input is reached when the new input is $x/b$, so horizontal lengths scale by $1/b$." }
    ],
    applications: [
      { title: "$f(x)=x^2$ shifted right $3$", background: "$f(x)=x^2$ shifted right $3$ gives $g(5)=(5-3)^2=4$", numbers: "$f(x)=x^2$ shifted right $3$ gives $g(5)=(5-3)^2=4$" },
      { title: "Vertical shift $x^2+2$", background: "Vertical shift $x^2+2$ gives value $11$ at $x=3$", numbers: "Vertical shift $x^2+2$ gives value $11$ at $x=3$" },
      { title: "Reflection $-x^2$", background: "Reflection $-x^2$ gives $-9$ at $x=3$", numbers: "Reflection $-x^2$ gives $-9$ at $x=3$" },
      { title: "Vertical stretch $2x^2$", background: "Vertical stretch $2x^2$ gives $18$ at $x=3$", numbers: "Vertical stretch $2x^2$ gives $18$ at $x=3$" },
      { title: "Horizontal compression $f(2x)=4x^2$", background: "Horizontal compression $f(2x)=4x^2$ gives $16$ at $x=2$", numbers: "Horizontal compression $f(2x)=4x^2$ gives $16$ at $x=2$" },
      { title: "Combined $2(x-1)^2+3$", background: "Combined $2(x-1)^2+3$ gives $11$ at $x=3$", numbers: "Combined $2(x-1)^2+3$ gives $11$ at $x=3$" }
    ]
  },
  "math-01-03": {
    connectionsProse: "<p>This lesson builds on repeated multiplication and on the idea of a function as a changing quantity. Exponentials describe situations where equal steps multiply by equal factors. That pattern leads naturally to compounding, decay, and continuous growth models.</p>",
    motivation: "<p>Linear growth adds the same amount over equal steps, but exponential growth multiplies by the same factor. That makes the current amount part of the future change: a larger current amount produces a larger next increase under the same relative rate.</p>" +
                "<p>Continuous exponentials arise by making the compounding steps very small. The base $e$ records the limiting factor produced by infinitely fine compounding, so $Ce^{rt}$ is the natural form when growth happens continuously at rate $r$.</p>",
    definition: "<p>Central statement: Therefore $y=C e^{rt}$.</p>" +
                "<p><b>Assumptions that matter:</b> Follow the conditions stated in the derivation, including required domains, nonzero denominators, continuity or differentiability hypotheses, interval restrictions, and convergence conditions.</p>",
    symbols: [
      { sym: "$C$", desc: "is initial amount" },
      { sym: "$a$", desc: "is per-step factor" },
      { sym: "$r$", desc: "is continuous growth rate" },
      { sym: "$e$", desc: "is the base from continuous compounding" }
    ],
    derivation: [
      { do: "Require equal steps to multiply by the same factor", result: "Require equal steps to multiply by the same factor", why: "this is constant relative growth." },
      { do: "Let one unit step multiply by $a$", result: "Let one unit step multiply by $a$", why: "after $n$ integer steps the output is $C a^n$." },
      { do: "For continuous growth at rate $r$, split one time unit into $n$ pieces with factor $1+r/n$.", result: "For continuous growth at rate $r$, split one time unit into $n$ pieces with factor $1+r/n$.", why: "" },
      { do: "After one unit the factor is $(1+r/n)^n$", result: "After one unit the factor is $(1+r/n)^n$", why: "all small factors multiply." },
      { do: "Let $n\\to\\infty$ to define $e^r$", result: "Let $n\\to\\infty$ to define $e^r$", why: "continuous compounding is the limiting factor." },
      { do: "Therefore $y=C e^{rt}$.", result: "Therefore $y=C e^{rt}$.", why: "" }
    ],
    applications: [
      { title: "Application 1", background: "$100e^{0.05\\cdot2}\\approx110.517$ after two years", numbers: "$100e^{0.05\\cdot2}\\approx110.517$ after two years" },
      { title: "Half-life factor after $3$ half-lives", background: "Half-life factor after $3$ half-lives is $2^{-3}=0.125$", numbers: "Half-life factor after $3$ half-lives is $2^{-3}=0.125$" },
      { title: "Application 3", background: "Population $50e^{0.1\\cdot4}\\approx74.591$", numbers: "Population $50e^{0.1\\cdot4}\\approx74.591$" },
      { title: "Application 4", background: "Neural activation $e^2\\approx7.389$", numbers: "Neural activation $e^2\\approx7.389$" },
      { title: "Application 5", background: "Discount $200e^{-0.03\\cdot5}\\approx172.142$", numbers: "Discount $200e^{-0.03\\cdot5}\\approx172.142$" },
      { title: "Application 6", background: "Doubling model $10\\cdot2^4=160$", numbers: "Doubling model $10\\cdot2^4=160$" }
    ]
  },
  "math-01-04": {
    connectionsProse: "<p>This lesson builds on exponential notation. If exponentials answer what value a base produces, logarithms answer which exponent was used. This inverse viewpoint is essential for solving growth equations and for measuring relative scale.</p>",
    motivation: "<p>A logarithm turns the question around. Instead of asking for $a^y$, it starts from a positive value $x$ and finds the exponent $y$ that makes $a^y=x$. That is why logarithms undo exponential functions.</p>" +
                "<p>Because exponents add when powers are multiplied, logarithms convert products into sums. This makes them useful whenever multiplicative structure is easier to analyze additively, including likelihoods, odds, and scale measurements.</p>",
    definition: "<p>Central statement: Take $\\log_a$ to get $\\log_a(xz)=m+n=\\log_a x+\\log_a z$.</p>" +
                "<p><b>Assumptions that matter:</b> Follow the conditions stated in the derivation, including required domains, nonzero denominators, continuity or differentiability hypotheses, interval restrictions, and convergence conditions.</p>",
    symbols: [
      { sym: "$a>0$, $a\\ne1$", desc: "is the base" },
      { sym: "$x>0$", desc: "is the input" },
      { sym: "$\\log_a x$", desc: "is the exponent needed to get $x$ from base $a$" }
    ],
    derivation: [
      { do: "Start with $a^y=x$", result: "Start with $a^y=x$", why: "exponentiation sends exponent $y$ to value $x$." },
      { do: "Define $y=\\log_a x$", result: "Define $y=\\log_a x$", why: "the logarithm names the exponent that produced $x$." },
      { do: "For a product, write $x=a^m$ and $z=a^n$", result: "For a product, write $x=a^m$ and $z=a^n$", why: "logs of the factors are $m$ and $n$." },
      { do: "Multiply", result: "$xz=a^{m+n}$", why: "exponents add under multiplication." },
      { do: "Take $\\log_a$ to get $\\log_a(xz)=m+n=\\log_a x+\\log_a z$.", result: "Take $\\log_a$ to get $\\log_a(xz)=m+n=\\log_a x+\\log_a z$.", why: "" }
    ],
    applications: [
      { title: "Application 1", background: "$\\log_2 8=3$", numbers: "$\\log_2 8=3$" },
      { title: "Application 2", background: "$\\ln(e^5)=5$", numbers: "$\\ln(e^5)=5$" },
      { title: "Application 3", background: "$\\log_{10}(1000)=3$", numbers: "$\\log_{10}(1000)=3$" },
      { title: "Product rule", background: "Product rule gives $\\ln(2e^3)=\\ln2+3\\approx3.693$", numbers: "Product rule gives $\\ln(2e^3)=\\ln2+3\\approx3.693$" },
      { title: "Odds logit for $p=0.8$", background: "Odds logit for $p=0.8$ is $\\ln(4)\\approx1.386$", numbers: "Odds logit for $p=0.8$ is $\\ln(4)\\approx1.386$" },
      { title: "Solving $3e^{2t}=12$", background: "Solving $3e^{2t}=12$ gives $t=\\ln4/2\\approx0.693$", numbers: "Solving $3e^{2t}=12$ gives $t=\\ln4/2\\approx0.693$" }
    ]
  },
  "math-01-05": {
    connectionsProse: "<p>This lesson builds on coordinates, angles, and the unit circle. Trigonometric functions turn rotation into ordinary functions of one variable. They will later supply the standard language for oscillation, waves, and circular motion.</p>",
    motivation: "<p>The unit circle gives sine and cosine a geometric meaning. At angle $\\theta$, cosine is the horizontal coordinate and sine is the vertical coordinate of the point on the circle. The identity $\\sin^2\\theta+\\cos^2\\theta=1$ is just the radius-one Pythagorean theorem.</p>" +
                "<p>Tangent compares the vertical coordinate to the horizontal coordinate, so it behaves like a slope. Periodicity comes from returning to the same point after a full turn, which is why sine and cosine repeat every $2\\pi$ radians.</p>",
    definition: "<p>Central statement: A full turn returns to the same point, so sine and cosine have period $2\\pi$.</p>" +
                "<p><b>Assumptions that matter:</b> Follow the conditions stated in the derivation, including required domains, nonzero denominators, continuity or differentiability hypotheses, interval restrictions, and convergence conditions.</p>",
    symbols: [
      { sym: "$\\theta$", desc: "is angle in radians" },
      { sym: "$\\sin\\theta$", desc: "is vertical coordinate" },
      { sym: "$\\cos\\theta$", desc: "is horizontal coordinate" },
      { sym: "$\\tan\\theta$", desc: "is their ratio" }
    ],
    derivation: [
      { do: "Put a point on the unit circle at angle $\\theta$ from the positive $x$-axis.", result: "Put a point on the unit circle at angle $\\theta$ from the positive $x$-axis.", why: "" },
      { do: "Define its coordinates as $(\\cos\\theta,\\sin\\theta)$", result: "Define its coordinates as $(\\cos\\theta,\\sin\\theta)$", why: "cosine is horizontal position and sine is vertical position." },
      { do: "The radius is $1$, so Pythagoras gives $\\cos^2\\theta+\\sin^2\\theta=1$.", result: "The radius is $1$, so Pythagoras gives $\\cos^2\\theta+\\sin^2\\theta=1$.", why: "" },
      { do: "Define $\\tan\\theta=\\sin\\theta/\\cos\\theta$ when $\\cos\\theta\\ne0$", result: "Define $\\tan\\theta=\\sin\\theta/\\cos\\theta$ when $\\cos\\theta\\ne0$", why: "slope is vertical change over horizontal change." },
      { do: "A full turn returns to the same point, so sine and cosine have period $2\\pi$.", result: "A full turn returns to the same point, so sine and cosine have period $2\\pi$.", why: "" }
    ],
    applications: [
      { title: "Application 1", background: "$\\sin(\\pi/6)=0.5$", numbers: "$\\sin(\\pi/6)=0.5$" },
      { title: "Application 2", background: "$\\cos(\\pi/3)=0.5$", numbers: "$\\cos(\\pi/3)=0.5$" },
      { title: "Application 3", background: "$\\tan(\\pi/4)=1$", numbers: "$\\tan(\\pi/4)=1$" },
      { title: "Unit-circle point at $\\pi/4$", background: "Unit-circle point at $\\pi/4$ is $(\\sqrt2/2,\\sqrt2/2)$", numbers: "Unit-circle point at $\\pi/4$ is $(\\sqrt2/2,\\sqrt2/2)$" },
      { title: "Oscillation $3\\sin(2t)$", background: "Oscillation $3\\sin(2t)$ has amplitude $3$ and period $\\pi$", numbers: "Oscillation $3\\sin(2t)$ has amplitude $3$ and period $\\pi$" },
      { title: "Application 6", background: "For $\\theta=\\pi/3$, $\\sin^2\\theta+\\cos^2\\theta=0.75+0.25=1$", numbers: "For $\\theta=\\pi/3$, $\\sin^2\\theta+\\cos^2\\theta=0.75+0.25=1$" }
    ]
  },
  "math-01-06": {
    connectionsProse: "<p>This lesson builds on trigonometric functions and inverse functions. Since trigonometric values repeat, inverse trigonometric functions need carefully chosen output intervals. These restricted inverses let calculus recover angles from ratios in a consistent way.</p>",
    motivation: "<p>Sine, cosine, and tangent are not one-to-one on their full domains because many angles can produce the same value. An inverse function needs one output for each input, so the original trigonometric function is restricted to a principal interval before it is inverted.</p>" +
                "<p>The result is not every possible angle, but a standard angle. $\\arcsin x$, $\\arccos x$, and $\\arctan x$ return principal values that make equations and geometric interpretations unambiguous.</p>",
    definition: "<p>Central statement: The same restriction idea gives $\\arccos x\\in[0,\\pi]$ and $\\arctan x\\in(-\\pi/2,\\pi/2)$.</p>" +
                "<p><b>Assumptions that matter:</b> Follow the conditions stated in the derivation, including required domains, nonzero denominators, continuity or differentiability hypotheses, interval restrictions, and convergence conditions.</p>",
    symbols: [
      { sym: "$\\arcsin x$, $\\arccos x$, and $\\arctan x$", desc: "are principal angles" },
      { sym: "$x$", desc: "is a ratio or coordinate, not an angle" }
    ],
    derivation: [
      { do: "Sine is not one-to-one on all real numbers", result: "Sine is not one-to-one on all real numbers", why: "many angles share a sine value." },
      { do: "Restrict sine to $[-\\pi/2,\\pi/2]$", result: "Restrict sine to $[-\\pi/2,\\pi/2]$", why: "on that interval it increases without repeating values." },
      { do: "Define $\\arcsin x$ as the angle in that interval whose sine is $x$.", result: "Define $\\arcsin x$ as the angle in that interval whose sine is $x$.", why: "" },
      { do: "If $y=\\arcsin x$, then $\\sin y=x$.", result: "If $y=\\arcsin x$, then $\\sin y=x$.", why: "" },
      { do: "The same restriction idea gives $\\arccos x\\in[0,\\pi]$ and $\\arctan x\\in(-\\pi/2,\\pi/2)$.", result: "The same restriction idea gives $\\arccos x\\in[0,\\pi]$ and $\\arctan x\\in(-\\pi/2,\\pi/2)$.", why: "" }
    ],
    applications: [
      { title: "Application 1", background: "$\\arcsin(1/2)=\\pi/6$", numbers: "$\\arcsin(1/2)=\\pi/6$" },
      { title: "Application 2", background: "$\\arccos(1/2)=\\pi/3$", numbers: "$\\arccos(1/2)=\\pi/3$" },
      { title: "Application 3", background: "$\\arctan(1)=\\pi/4$", numbers: "$\\arctan(1)=\\pi/4$" },
      { title: "A slope $3/4$", background: "A slope $3/4$ has angle $\\arctan(0.75)\\approx0.644$ radians", numbers: "A slope $3/4$ has angle $\\arctan(0.75)\\approx0.644$ radians" },
      { title: "Correlation $0.8$", background: "Correlation $0.8$ has angle $\\arccos(0.8)\\approx0.644$", numbers: "Correlation $0.8$ has angle $\\arccos(0.8)\\approx0.644$" },
      { title: "Height ratio $0.6$", background: "Height ratio $0.6$ gives launch angle $\\arcsin(0.6)\\approx0.644$", numbers: "Height ratio $0.6$ gives launch angle $\\arcsin(0.6)\\approx0.644$" }
    ]
  },
  "math-01-07": {
    connectionsProse: "<p>This lesson builds on evaluating functions near a point. Limits formalize the value a function approaches, even when the function may not be defined at the point itself. This idea supports the derivative, the definite integral, and continuity.</p>",
    motivation: "<p>Substitution is often the first way to look for a limit, but it is not always enough. If substitution gives an expression like $0/0$, the nearby behavior is hidden by algebraic cancellation or another structure.</p>" +
                "<p>The key is that a limit uses nearby inputs rather than the target input alone. By rewriting the expression so the nearby values are visible, the limiting value can often be found even when the original formula has a hole at the point.</p>",
    definition: "<p>For $\\lim_{x\\to2}\\frac{x^2-4}{x-2}$</p>" +
                "<p><b>Assumptions that matter:</b> Follow the conditions stated in the derivation, including required domains, nonzero denominators, continuity or differentiability hypotheses, interval restrictions, and convergence conditions.</p>",
    symbols: [
      { sym: "$\\lim_{x\\to a}f(x)=L$", desc: "means $f(x)$ approaches $L$ as $x$ approaches $a$" },
      { sym: "$a$", desc: "is the input approached" },
      { sym: "$L$", desc: "is the limiting value" }
    ],
    derivation: [
      { do: "Direct substitution gives $0/0$", result: "Direct substitution gives $0/0$", why: "the expression is not defined at $x=2$." },
      { do: "Factor the numerator", result: "$x^2-4=(x-2)(x+2)$", why: "expose the removable factor." },
      { do: "Cancel $x-2$ for $x\\ne2$", result: "Cancel $x-2$ for $x\\ne2$", why: "limits use nearby inputs, not the point itself." },
      { do: "The simplified expression is $x+2$.", result: "The simplified expression is $x+2$.", why: "" },
      { do: "Let $x\\to2$ to get $4$", result: "Let $x\\to2$ to get $4$", why: "the nearby values approach $4$." }
    ],
    applications: [
      { title: "Application 1", background: "Removable limit above equals $4$", numbers: "Removable limit above equals $4$" },
      { title: "Application 2", background: "$\\lim_{x\\to0}\\frac{\\sin x}{x}=1$", numbers: "$\\lim_{x\\to0}\\frac{\\sin x}{x}=1$" },
      { title: "Application 3", background: "$\\lim_{x\\to3}(2x+1)=7$", numbers: "$\\lim_{x\\to3}(2x+1)=7$" },
      { title: "Application 4", background: "$\\lim_{x\\to1}\\frac{x^3-1}{x-1}=3$", numbers: "$\\lim_{x\\to1}\\frac{x^3-1}{x-1}=3$" },
      { title: "Average velocity for $s=t^2$ near $3$", background: "Average velocity for $s=t^2$ near $3$ tends to $6$", numbers: "Average velocity for $s=t^2$ near $3$ tends to $6$" },
      { title: "Application 6", background: "$\\lim_{x\\to0}\\frac{e^x-1}{x}=1$", numbers: "$\\lim_{x\\to0}\\frac{e^x-1}{x}=1$" }
    ]
  },
  "math-01-08": {
    connectionsProse: "<p>This lesson builds on ordinary limits by paying attention to direction. Some functions behave differently when an input approaches from the left than from the right. One-sided limits give the language needed for jumps, boundaries, and piecewise definitions.</p>",
    motivation: "<p>A two-sided limit requires the same approached value from both directions. At a jump or endpoint, the left-hand and right-hand stories may not match, so treating them separately prevents us from hiding important behavior.</p>" +
                "<p>One-sided limits are especially useful for piecewise rules. The formula that applies to inputs below the point may differ from the formula above it, and the two-sided limit exists only when those two approaching values agree.</p>",
    definition: "<p>For $f(x)=0$ if $x<1$ and $f(x)=2$ if $x\\ge1$</p>" +
                "<p><b>Assumptions that matter:</b> Follow the conditions stated in the derivation, including required domains, nonzero denominators, continuity or differentiability hypotheses, interval restrictions, and convergence conditions.</p>",
    symbols: [
      { sym: "$x\\to a^-$", desc: "means from below" },
      { sym: "$x\\to a^+$", desc: "means from above" },
      { sym: "a two-sided limit exists only when both one-sided limits agree", desc: "a two-sided limit exists only when both one-sided limits agree" }
    ],
    derivation: [
      { do: "Approach $1$ using $x<1$", result: "Approach $1$ using $x<1$", why: "the formula is $0$." },
      { do: "The left-hand limit is therefore $\\lim_{x\\to1^-}f(x)=0$.", result: "The left-hand limit is therefore $\\lim_{x\\to1^-}f(x)=0$.", why: "" },
      { do: "Approach $1$ using $x>1$", result: "Approach $1$ using $x>1$", why: "the formula is $2$." },
      { do: "The right-hand limit is $\\lim_{x\\to1^+}f(x)=2$.", result: "The right-hand limit is $\\lim_{x\\to1^+}f(x)=2$.", why: "" },
      { do: "Since the one-sided limits differ, the two-sided limit does not exist.", result: "Since the one-sided limits differ, the two-sided limit does not exist.", why: "" }
    ],
    applications: [
      { title: "Step function above", background: "Step function above has left limit $0$ and right limit $2$", numbers: "Step function above has left limit $0$ and right limit $2$" },
      { title: "ReLU $\\max(0,x)$", background: "ReLU $\\max(0,x)$ has both one-sided limits $0$ at $0$", numbers: "ReLU $\\max(0,x)$ has both one-sided limits $0$ at $0$" },
      { title: "$1/x$", background: "$1/x$ has left limit $-\\infty$ and right limit $+\\infty$ at $0$", numbers: "$1/x$ has left limit $-\\infty$ and right limit $+\\infty$ at $0$" },
      { title: "Price threshold $f(x)=10$ below $100$ and $15$ above", background: "Price threshold $f(x)=10$ below $100$ and $15$ above has a jump of $5$", numbers: "Price threshold $f(x)=10$ below $100$ and $15$ above has a jump of $5$" },
      { title: "Floor function at $3$", background: "Floor function at $3$ has left limit $2$ and right limit $3$", numbers: "Floor function at $3$ has left limit $2$ and right limit $3$" },
      { title: "Domain boundary $\\sqrt{x}$", background: "Domain boundary $\\sqrt{x}$ has right limit $0$ at $0$", numbers: "Domain boundary $\\sqrt{x}$ has right limit $0$ at $0$" }
    ]
  },
  "math-01-09": {
    connectionsProse: "<p>This lesson builds on limits and function values. Continuity says that the approached value and the actual value are the same. It is the condition that lets graphs be read without holes or jumps at a point.</p>",
    motivation: "<p>A function can fail to be continuous in several ways: the value may be missing, the nearby values may not approach one number, or the approached value may not equal the assigned value. Continuity requires all three parts to line up.</p>" +
                "<p>This matters because many calculus theorems rely on functions having no sudden breaks. When a function is continuous, small changes in input produce controlled changes in output near that point.</p>",
    definition: "<p>Central statement: Since $f(3)=9$, $x^2$ is continuous at $3$.</p>" +
                "<p><b>Assumptions that matter:</b> Follow the conditions stated in the derivation, including required domains, nonzero denominators, continuity or differentiability hypotheses, interval restrictions, and convergence conditions.</p>",
    symbols: [
      { sym: "$a$", desc: "is the point tested" },
      { sym: "$f(a)$", desc: "is the actual value" },
      { sym: "the limit", desc: "is the approached value" }
    ],
    derivation: [
      { do: "To be continuous at $a$, $f(a)$ must be defined", result: "To be continuous at $a$, $f(a)$ must be defined", why: "the point has an output." },
      { do: "The limit $\\lim_{x\\to a}f(x)$ must exist", result: "The limit $\\lim_{x\\to a}f(x)$ must exist", why: "nearby values agree from both sides." },
      { do: "The two must match", result: "$\\lim_{x\\to a}f(x)=f(a)$", why: "no hole or jump remains." },
      { do: "For $f(x)=x^2$, $\\lim_{x\\to3}x^2=9$ by substitution.", result: "For $f(x)=x^2$, $\\lim_{x\\to3}x^2=9$ by substitution.", why: "" },
      { do: "Since $f(3)=9$, $x^2$ is continuous at $3$.", result: "Since $f(3)=9$, $x^2$ is continuous at $3$.", why: "" }
    ],
    applications: [
      { title: "$x^2$", background: "$x^2$ is continuous at $3$ with value $9$", numbers: "$x^2$ is continuous at $3$ with value $9$" },
      { title: "$1/x$", background: "$1/x$ is continuous at $2$ with value $0.5$", numbers: "$1/x$ is continuous at $2$ with value $0.5$" },
      { title: "$\\sqrt{x}$", background: "$\\sqrt{x}$ is continuous at $4$ with value $2$", numbers: "$\\sqrt{x}$ is continuous at $4$ with value $2$" },
      { title: "ReLU", background: "ReLU is continuous at $0$ since both sides give $0$", numbers: "ReLU is continuous at $0$ since both sides give $0$" },
      { title: "A removable hole with limit $4$ but value $5$", background: "A removable hole with limit $4$ but value $5$ is not continuous", numbers: "A removable hole with limit $4$ but value $5$ is not continuous" },
      { title: "Piecewise jump from $1$ to $3$ at $0$", background: "Piecewise jump from $1$ to $3$ at $0$ is discontinuous by gap $2$", numbers: "Piecewise jump from $1$ to $3$ at $0$ is discontinuous by gap $2$" }
    ]
  },
  "math-01-10": {
    connectionsProse: "<p>This lesson builds on continuity over an interval. The Intermediate Value Theorem turns the visual idea of an unbroken graph into a precise guarantee. It prepares the reader for existence arguments, root-finding, and threshold crossing.</p>",
    motivation: "<p>If a continuous function starts below a target value and ends above it, it cannot skip over the target. The graph may curve or wiggle, but without a jump it must pass through every intermediate height.</p>" +
                "<p>The theorem is an existence statement. It may not tell where the input is or whether it is unique, but it guarantees that at least one such input exists between the endpoints.</p>",
    definition: "<p>Central statement: Therefore some $c\\in(a,b)$ satisfies $f(c)=N$.</p>" +
                "<p><b>Assumptions that matter:</b> Follow the conditions stated in the derivation, including required domains, nonzero denominators, continuity or differentiability hypotheses, interval restrictions, and convergence conditions.</p>",
    symbols: [
      { sym: "$[a,b]$", desc: "is the closed interval" },
      { sym: "$N$", desc: "is the target output" },
      { sym: "$c$", desc: "is the input guaranteed by the theorem" }
    ],
    derivation: [
      { do: "Let $f$ be continuous on $[a,b]$", result: "Let $f$ be continuous on $[a,b]$", why: "there are no jumps or gaps on the interval." },
      { do: "Suppose $f(a)<N<f(b)$", result: "Suppose $f(a)<N<f(b)$", why: "the target lies between endpoint values." },
      { do: "Consider $g(x)=f(x)-N$", result: "Consider $g(x)=f(x)-N$", why: "hitting $N$ means finding a zero of $g$." },
      { do: "Then $g(a)<0$ and $g(b)>0$", result: "Then $g(a)<0$ and $g(b)>0$", why: "the sign changes." },
      { do: "Continuity prevents a sign change without passing through $0$.", result: "Continuity prevents a sign change without passing through $0$.", why: "" },
      { do: "Therefore some $c\\in(a,b)$ satisfies $f(c)=N$.", result: "Therefore some $c\\in(a,b)$ satisfies $f(c)=N$.", why: "" }
    ],
    applications: [
      { title: "Application 1", background: "$f(x)=x^2$ on $[1,3]$ hits $4$ at $x=2$", numbers: "$f(x)=x^2$ on $[1,3]$ hits $4$ at $x=2$" },
      { title: "$x^3-x-1$", background: "$x^3-x-1$ changes from $-1$ at $1$ to $5$ at $2$, so it has a root in $(1,2)$", numbers: "$x^3-x-1$ changes from $-1$ at $1$ to $5$ at $2$, so it has a root in $(1,2)$" },
      { title: "Application 3", background: "Temperature from $60$ to $75$ hits $70$ at least once", numbers: "Temperature from $60$ to $75$ hits $70$ at least once" },
      { title: "Model score from $-0.2$ to $0.3$", background: "Model score from $-0.2$ to $0.3$ crosses decision threshold $0$", numbers: "Model score from $-0.2$ to $0.3$ crosses decision threshold $0$" },
      { title: "Application 5", background: "Continuous cost from $90$ to $110$ hits budget $100$", numbers: "Continuous cost from $90$ to $110$ hits budget $100$" },
      { title: "Application 6", background: "$\\sin x$ on $[0,\\pi/2]$ hits $0.5$ at $\\pi/6$", numbers: "$\\sin x$ on $[0,\\pi/2]$ hits $0.5$ at $\\pi/6$" }
    ]
  },
  "math-01-11": {
    connectionsProse: "<p>This lesson builds on ordinary limits and long-run comparisons. Limits at infinity describe what remains important as the input grows without bound. They are the basis for horizontal asymptotes and end behavior.</p>",
    motivation: "<p>For large inputs, not every term matters equally. In a polynomial or rational expression, the highest powers dominate because lower powers become small by comparison after dividing by the largest scale.</p>" +
                "<p>A limit at infinity captures that dominant behavior. It tells whether the function settles toward a number, grows without bound, or approaches another long-run pattern.</p>",
    definition: "<p>For $\\lim_{x\\to\\infty}\\frac{3x^2+1}{x^2-4}$</p>" +
                "<p><b>Assumptions that matter:</b> Follow the conditions stated in the derivation, including required domains, nonzero denominators, continuity or differentiability hypotheses, interval restrictions, and convergence conditions.</p>",
    symbols: [
      { sym: "$x\\to\\infty$", desc: "means input grows without bound" },
      { sym: "dominant term", desc: "means highest power controlling long-run size" }
    ],
    derivation: [
      { do: "Identify the highest power $x^2$", result: "Identify the highest power $x^2$", why: "it dominates numerator and denominator." },
      { do: "Divide every term by $x^2$", result: "Divide every term by $x^2$", why: "compare terms on the same scale." },
      { do: "Get $\\frac{3+1/x^2}{1-4/x^2}$.", result: "Get $\\frac{3+1/x^2}{1-4/x^2}$.", why: "" },
      { do: "Let $x\\to\\infty$ so $1/x^2\\to0$ and $4/x^2\\to0$.", result: "Let $x\\to\\infty$ so $1/x^2\\to0$ and $4/x^2\\to0$.", why: "" },
      { do: "The limit is $3/1=3$.", result: "The limit is $3/1=3$.", why: "" }
    ],
    applications: [
      { title: "The worked rational limit", background: "The worked rational limit is $3$", numbers: "The worked rational limit is $3$" },
      { title: "Application 2", background: "$\\lim_{x\\to\\infty}1/x=0$", numbers: "$\\lim_{x\\to\\infty}1/x=0$" },
      { title: "Application 3", background: "$\\lim_{x\\to\\infty}\\frac{2x+5}{x}=2$", numbers: "$\\lim_{x\\to\\infty}\\frac{2x+5}{x}=2$" },
      { title: "Logistic curve $1/(1+e^{-x})$", background: "Logistic curve $1/(1+e^{-x})$ tends to $1$", numbers: "Logistic curve $1/(1+e^{-x})$ tends to $1$" },
      { title: "$e^{-0.2t}$", background: "$e^{-0.2t}$ tends to $0$ as $t\\to\\infty$", numbers: "$e^{-0.2t}$ tends to $0$ as $t\\to\\infty$" },
      { title: "$\\frac{x}{x+10}$", background: "$\\frac{x}{x+10}$ tends to $1$", numbers: "$\\frac{x}{x+10}$ tends to $1$" }
    ]
  },
  "math-01-12": {
    connectionsProse: "<p>This lesson builds on limits near a point and at infinity. Asymptotes summarize how a graph behaves when it approaches a line without necessarily reaching it. They make end behavior and blow-up visible in a compact way.</p>",
    motivation: "<p>Vertical asymptotes come from nearby inputs making function values grow without bound. Horizontal asymptotes describe long-run output levels as inputs go far left or right, while slant asymptotes describe long-run linear behavior.</p>" +
                "<p>This is a classification lesson because different formulas reveal asymptotes in different ways. Limits, factoring, and polynomial division all contribute to deciding which line the graph approaches.</p>",
    definition: "<p>This is an explain-only lesson: this is a classification lesson. Teach vertical, horizontal, and slant asymptotes from limits and polynomial division instead of presenting one theorem.</p>" +
                "<p><b>Assumptions that matter:</b> Use the stated domain, graph, interval, or modeling conditions before applying the classification.</p>",
    symbols: [
      { sym: "$x=a$", desc: "is a vertical asymptote" },
      { sym: "$y=L$", desc: "is a horizontal asymptote" },
      { sym: "$y=mx+b$", desc: "is a slant asymptote" }
    ],
    applications: [
      { title: "$1/(x-2)$", background: "$1/(x-2)$ has vertical asymptote $x=2$", numbers: "$1/(x-2)$ has vertical asymptote $x=2$" },
      { title: "$\\frac{3x+1}{x+2}$", background: "$\\frac{3x+1}{x+2}$ has horizontal asymptote $y=3$", numbers: "$\\frac{3x+1}{x+2}$ has horizontal asymptote $y=3$" },
      { title: "$\\frac{x^2+1}{x}=x+1/x$", background: "$\\frac{x^2+1}{x}=x+1/x$ has slant asymptote $y=x$", numbers: "$\\frac{x^2+1}{x}=x+1/x$ has slant asymptote $y=x$" },
      { title: "$e^{-x}$", background: "$e^{-x}$ has horizontal asymptote $y=0$", numbers: "$e^{-x}$ has horizontal asymptote $y=0$" },
      { title: "$\\ln x$", background: "$\\ln x$ has vertical asymptote $x=0$", numbers: "$\\ln x$ has vertical asymptote $x=0$" },
      { title: "$\\frac{2x^2+1}{x^2+5}$", background: "$\\frac{2x^2+1}{x^2+5}$ has horizontal asymptote $y=2$", numbers: "$\\frac{2x^2+1}{x^2+5}$ has horizontal asymptote $y=2$" }
    ]
  },
  "math-01-13": {
    connectionsProse: "<p>This lesson builds on limits and on the slope of a line. A secant line measures average change between two nearby input values. The derivative is what remains when the second point moves all the way into the first point by a limit. This one definition supports nearly everything that follows in the section. The power, product, quotient, chain, exponential, logarithmic, and trigonometric derivative rules are all efficient ways to evaluate the same limit. Linear approximation, optimization, related rates, Taylor series, numerical differentiation, and backpropagation all use the derivative as a local rate of change.</p>",
    motivation: "<p>Average speed is easy to compute over a time interval. If a car moves from position $s(3)$ to $s(3.1)$, its average speed is the change in position divided by $0.1$. Instantaneous speed asks for the same kind of rate at one time, where the interval has no visible width.</p>" +
                "<p>The derivative answers that by using nearby intervals and then taking a limit. For a function $f$, the quotient $$ \\frac{f(x+h)-f(x)}{h} $$ is the slope of the secant line through $x$ and $x+h$. As $h$ approaches $0$, those secant slopes approach the slope of the tangent line, if the limit exists. That limiting slope is $f'(x)$.</p>" +
                "<p>The important point is local linear behavior. Near a differentiable input, the function behaves almost like a line. The derivative is the slope of that line, so it tells how many output units change per one input unit at that exact location.</p>",
    definition: "<p>The derivative — definition and meaning is defined by the limiting formula</p>" +
                "<p>$$f'(x)=\\lim_{h\\to0}\\frac{f(x+h)-f(x)}{h}.$$</p>" +
                "<p><b>Assumptions that matter:</b> Follow the conditions stated in the derivation, including required domains, nonzero denominators, continuity or differentiability hypotheses, interval restrictions, and convergence conditions.</p>",
    symbols: [
      { sym: "$f'(x)$", desc: "is the derivative of $f$ at input $x$" },
      { sym: "$h$", desc: "is the small input change" },
      { sym: "$f(x+h)-f(x)$", desc: "is the output change" },
      { sym: "the quotient", desc: "is average rate of change" },
      { sym: "the limit turns the average rate into the instantaneous rate when it exists", desc: "the limit turns the average rate into the instantaneous rate when it exists" }
    ],
    derivation: [
      { do: "Start from the definition", result: "$f'(x)=\\lim_{h\\to0}\\frac{f(x+h)-f(x)}{h}$", why: "the derivative is the limiting secant slope." },
      { do: "Substitute $f(t)=t^2$", result: "$f'(x)=\\lim_{h\\to0}\\frac{(x+h)^2-x^2}{h}$", why: "the rule is applied to the chosen function." },
      { do: "Expand the square", result: "$(x+h)^2=x^2+2xh+h^2$", why: "this separates the change caused by $h$." },
      { do: "Subtract $x^2$", result: "$(x^2+2xh+h^2)-x^2=2xh+h^2$", why: "unchanged parts cancel." },
      { do: "Factor $h$", result: "$2xh+h^2=h(2x+h)$", why: "this exposes the common interval length." },
      { do: "Divide by $h$", result: "$\\frac{h(2x+h)}{h}=2x+h$ for $h\\ne0$", why: "the quotient is only evaluated for nearby nonzero intervals." },
      { do: "Take the limit", result: "$\\lim_{h\\to0}(2x+h)=2x$", why: "the remaining $h$ term vanishes." },
      { do: "Conclude $\\frac{d}{dx}x^2=2x$", result: "Conclude $\\frac{d}{dx}x^2=2x$", why: "the tangent slope at input $x$ is twice that input." }
    ],
    applications: [
      { title: "Instantaneous velocity", background: "$s(t)=t^2$ gives $s'(3)=6$, so position changes at $6$ units per time at $t=3$", numbers: "$s(t)=t^2$ gives $s'(3)=6$, so position changes at $6$ units per time at $t=3$" },
      { title: "Marginal cost", background: "$C(q)=q^2+10$ gives $C'(5)=10$, so the next unit near $q=5$ costs about $10$ units", numbers: "$C(q)=q^2+10$ gives $C'(5)=10$, so the next unit near $q=5$ costs about $10$ units" },
      { title: "Loss sensitivity", background: "$L(w)=(w-2)^2$ gives $L'(3)=2$, so increasing $w$ locally raises loss at rate $2$", numbers: "$L(w)=(w-2)^2$ gives $L'(3)=2$, so increasing $w$ locally raises loss at rate $2$" },
      { title: "Tangent line", background: "for $f(x)=x^2$ at $x=4$, slope $8$ and point $(4,16)$ give $y=16+8(x-4)$", numbers: "for $f(x)=x^2$ at $x=4$, slope $8$ and point $(4,16)$ give $y=16+8(x-4)$" },
      { title: "Linear prediction", background: "near $x=10$, $x^2$ changes by about $20(0.1)=2$ when $x$ increases by $0.1$", numbers: "near $x=10$, $x^2$ changes by about $20(0.1)=2$ when $x$ increases by $0.1$" },
      { title: "Gradient check in one variable", background: "$\\frac{(3.001)^2-3^2}{0.001}=6.001$, close to $f'(3)=6$", numbers: "$\\frac{(3.001)^2-3^2}{0.001}=6.001$, close to $f'(3)=6$" }
    ]
  },
  "math-01-14": {
    connectionsProse: "<p>This lesson builds on continuity and the derivative definition. Differentiability adds the stronger requirement that the local slope settle to one value. This connection explains why every differentiable function is continuous, while some continuous functions still have corners or vertical tangents.</p>",
    motivation: "<p>Continuity only asks whether nearby outputs approach the function value. Differentiability asks more: the ratio of output change to input change must approach a finite limiting slope.</p>" +
                "<p>When that slope exists, the output change can be written as slope times input change in the limit, and the input change goes to zero. A corner such as $|x|$ shows why the reverse implication fails: the graph can meet without a single tangent slope.</p>",
    definition: "<p>Central statement: $|x|$ is continuous at $0$ but left slope $-1$ and right slope $1$ differ.</p>" +
                "<p><b>Assumptions that matter:</b> Follow the conditions stated in the derivation, including required domains, nonzero denominators, continuity or differentiability hypotheses, interval restrictions, and convergence conditions.</p>",
    symbols: [
      { sym: "Differentiable", desc: "means derivative exists" },
      { sym: "continuous", desc: "means limit equals value" },
      { sym: "one-sided slopes test corners", desc: "one-sided slopes test corners" }
    ],
    derivation: [
      { do: "Suppose $f'(a)$ exists", result: "Suppose $f'(a)$ exists", why: "the difference quotient has a finite limit." },
      { do: "Rewrite $f(x)-f(a)=\\frac{f(x)-f(a)}{x-a}(x-a)$ for $x\\ne a$", result: "Rewrite $f(x)-f(a)=\\frac{f(x)-f(a)}{x-a}(x-a)$ for $x\\ne a$", why: "factor change into slope times input change." },
      { do: "Let $x\\to a$", result: "Let $x\\to a$", why: "the quotient tends to $f'(a)$ and $x-a\\to0$." },
      { do: "The product tends to $f'(a)\\cdot0=0$.", result: "The product tends to $f'(a)\\cdot0=0$.", why: "" },
      { do: "Therefore $f(x)\\to f(a)$, so $f$ is continuous at $a$.", result: "Therefore $f(x)\\to f(a)$, so $f$ is continuous at $a$.", why: "" },
      { do: "The converse fails", result: "$|x|$ is continuous at $0$ but left slope $-1$ and right slope $1$ differ.", why: "" }
    ],
    applications: [
      { title: "$x^2$", background: "$x^2$ is differentiable at $2$ and continuous with value $4$", numbers: "$x^2$ is differentiable at $2$ and continuous with value $4$" },
      { title: "$|x|$", background: "$|x|$ is continuous at $0$ but not differentiable", numbers: "$|x|$ is continuous at $0$ but not differentiable" },
      { title: "ReLU", background: "ReLU is continuous at $0$ but slopes $0$ and $1$ differ", numbers: "ReLU is continuous at $0$ but slopes $0$ and $1$ differ" },
      { title: "Step function", background: "Step function has jump $1$, so not continuous or differentiable", numbers: "Step function has jump $1$, so not continuous or differentiable" },
      { title: "$\\sqrt{x}$", background: "$\\sqrt{x}$ is continuous at $0$ but derivative blows up", numbers: "$\\sqrt{x}$ is continuous at $0$ but derivative blows up" },
      { title: "$x^{2/3}$", background: "$x^{2/3}$ is continuous at $0$ with vertical tangent", numbers: "$x^{2/3}$ is continuous at $0$ with vertical tangent" }
    ]
  },
  "math-01-15": {
    connectionsProse: "<p>This lesson builds on the derivative definition and polynomial powers. The power rule is the first major shortcut for evaluating derivatives. It turns repeated limit work into a simple rule that will be used throughout the rest of calculus.</p>",
    motivation: "<p>The derivative of $x^n$ measures how a power changes under a small input increase. Expanding $(x+h)^n$ shows that the first-order change is $n x^{n-1}h$, while higher powers of $h$ become negligible in the limit.</p>" +
                "<p>That first-order term is the slope. After dividing by $h$ and letting $h$ go to zero, only $n x^{n-1}$ remains, which is why powers can be differentiated so efficiently.</p>",
    definition: "<p>Central statement: The derivative is $n x^{n-1}$.</p>" +
                "<p><b>Assumptions that matter:</b> Follow the conditions stated in the derivation, including required domains, nonzero denominators, continuity or differentiability hypotheses, interval restrictions, and convergence conditions.</p>",
    symbols: [
      { sym: "$n$", desc: "is the power" },
      { sym: "$x$", desc: "is the input" },
      { sym: "$\\binom nk$ counts binomial terms", desc: "$\\binom nk$ counts binomial terms" }
    ],
    derivation: [
      { do: "Start with $\\frac{d}{dx}x^n=\\lim_{h\\to0}\\frac{(x+h)^n-x^n}{h}$.", result: "Start with $\\frac{d}{dx}x^n=\\lim_{h\\to0}\\frac{(x+h)^n-x^n}{h}$.", why: "" },
      { do: "Expand by the binomial theorem", result: "$(x+h)^n=x^n+n x^{n-1}h+\\binom n2x^{n-2}h^2+\\cdots+h^n$.", why: "" },
      { do: "Subtract $x^n$", result: "Subtract $x^n$", why: "the constant term cancels." },
      { do: "Factor $h$ from every remaining term.", result: "Factor $h$ from every remaining term.", why: "" },
      { do: "Divide by $h$ to get $n x^{n-1}+\\binom n2x^{n-2}h+\\cdots$.", result: "Divide by $h$ to get $n x^{n-1}+\\binom n2x^{n-2}h+\\cdots$.", why: "" },
      { do: "Let $h\\to0$", result: "Let $h\\to0$", why: "all terms with $h$ vanish." },
      { do: "The derivative is $n x^{n-1}$.", result: "The derivative is $n x^{n-1}$.", why: "" }
    ],
    applications: [
      { title: "$\\frac{d}{dx}x^3=3x^2$, so at $2$ the slope", background: "$\\frac{d}{dx}x^3=3x^2$, so at $2$ the slope is $12$", numbers: "$\\frac{d}{dx}x^3=3x^2$, so at $2$ the slope is $12$" },
      { title: "$\\frac{d}{dx}x^5=5x^4$, so at $1$ the slope", background: "$\\frac{d}{dx}x^5=5x^4$, so at $1$ the slope is $5$", numbers: "$\\frac{d}{dx}x^5=5x^4$, so at $1$ the slope is $5$" },
      { title: "$\\frac{d}{dx}\\sqrt{x}=1/(2\\sqrt{x})$, so at $4$ the slope", background: "$\\frac{d}{dx}\\sqrt{x}=1/(2\\sqrt{x})$, so at $4$ the slope is $0.25$", numbers: "$\\frac{d}{dx}\\sqrt{x}=1/(2\\sqrt{x})$, so at $4$ the slope is $0.25$" },
      { title: "$\\frac{d}{dx}x^{-1}=-x^{-2}$, so at $2$ the slope", background: "$\\frac{d}{dx}x^{-1}=-x^{-2}$, so at $2$ the slope is $-0.25$", numbers: "$\\frac{d}{dx}x^{-1}=-x^{-2}$, so at $2$ the slope is $-0.25$" },
      { title: "Cost $q^4$", background: "Cost $q^4$ has marginal cost $108$ at $q=3$", numbers: "Cost $q^4$ has marginal cost $108$ at $q=3$" },
      { title: "Regularizer $w^2$", background: "Regularizer $w^2$ has gradient $2w$, so at $w=-3$ it is $-6$", numbers: "Regularizer $w^2$ has gradient $2w$, so at $w=-3$ it is $-6$" }
    ]
  },
  "math-01-16": {
    connectionsProse: "<p>This lesson builds on the derivative as a limit of output change. When functions are added or subtracted, their output changes add or subtract too. This rule lets larger formulas be handled one term at a time.</p>",
    motivation: "<p>A sum changes by the change in the first function plus the change in the second function. The difference quotient for $f+g$ can therefore be separated into the quotient for $f$ and the quotient for $g$.</p>" +
                "<p>Taking the limit preserves that separation when both derivatives exist. This is why polynomial differentiation becomes straightforward after the power rule: each term contributes its own derivative.</p>",
    definition: "<p>Central statement: Replacing $g$ by $-g$ gives $(f-g)'=f'-g'$.</p>" +
                "<p><b>Assumptions that matter:</b> Follow the conditions stated in the derivation, including required domains, nonzero denominators, continuity or differentiability hypotheses, interval restrictions, and convergence conditions.</p>",
    symbols: [
      { sym: "$f,g$", desc: "are differentiable functions" },
      { sym: "$h$", desc: "is the input change" },
      { sym: "prime", desc: "means derivative with respect to $x$" }
    ],
    derivation: [
      { do: "Start with $\\frac{d}{dx}(f+g)=\\lim_{h\\to0}\\frac{f(x+h)+g(x+h)-f(x)-g(x)}{h}$.", result: "Start with $\\frac{d}{dx}(f+g)=\\lim_{h\\to0}\\frac{f(x+h)+g(x+h)-f(x)-g(x)}{h}$.", why: "" },
      { do: "Regroup the numerator as $[f(x+h)-f(x)]+[g(x+h)-g(x)]$", result: "Regroup the numerator as $[f(x+h)-f(x)]+[g(x+h)-g(x)]$", why: "separate the two changes." },
      { do: "Split the fraction into two quotients.", result: "Split the fraction into two quotients.", why: "" },
      { do: "Take limits term by term when both derivatives exist.", result: "Take limits term by term when both derivatives exist.", why: "" },
      { do: "Get $(f+g)'=f'+g'$.", result: "Get $(f+g)'=f'+g'$.", why: "" },
      { do: "Replacing $g$ by $-g$ gives $(f-g)'=f'-g'$.", result: "Replacing $g$ by $-g$ gives $(f-g)'=f'-g'$.", why: "" }
    ],
    applications: [
      { title: "$(x^2+x^3)'=2x+3x^2$, at $2$", background: "$(x^2+x^3)'=2x+3x^2$, at $2$ gives $16$", numbers: "$(x^2+x^3)'=2x+3x^2$, at $2$ gives $16$" },
      { title: "$(x^3-x)'=3x^2-1$, at $1$", background: "$(x^3-x)'=3x^2-1$, at $1$ gives $2$", numbers: "$(x^3-x)'=3x^2-1$, at $1$ gives $2$" },
      { title: "$C(q)=q^2+5q+10$", background: "$C(q)=q^2+5q+10$ has $C'(4)=13$", numbers: "$C(q)=q^2+5q+10$ has $C'(4)=13$" },
      { title: "$L(w)=w^2+(w-1)^2$", background: "$L(w)=w^2+(w-1)^2$ has $L'(2)=6$", numbers: "$L(w)=w^2+(w-1)^2$ has $L'(2)=6$" },
      { title: "Position $t^2+3t$", background: "Position $t^2+3t$ has velocity $9$ at $t=3$", numbers: "Position $t^2+3t$ has velocity $9$ at $t=3$" },
      { title: "Polynomial $4x^4-2x$", background: "Polynomial $4x^4-2x$ has slope $30$ at $x=1.5$", numbers: "Polynomial $4x^4-2x$ has slope $30$ at $x=1.5$" }
    ]
  },
  "math-01-17": {
    connectionsProse: "<p>This lesson builds on derivatives of single functions and on products of quantities. Products are common in models where two changing factors interact. The product rule explains how each factor contributes to the local rate of the whole product.</p>",
    motivation: "<p>When $f(x)g(x)$ changes, part of the change comes from $f$, part comes from $g$, and a very small overlap comes from both changing at once. In the limit, the overlap is too small to contribute to the derivative.</p>" +
                "<p>The resulting rule has two terms. One term changes $f$ while holding $g$ locally fixed, and the other changes $g$ while holding $f$ locally fixed.</p>",
    definition: "<p>Central statement: Therefore $(fg)'=f'g+fg'$.</p>" +
                "<p><b>Assumptions that matter:</b> Follow the conditions stated in the derivation, including required domains, nonzero denominators, continuity or differentiability hypotheses, interval restrictions, and convergence conditions.</p>",
    symbols: [
      { sym: "$f,g$", desc: "are factors" },
      { sym: "$f',g'$", desc: "are their local rates" },
      { sym: "the two terms measure changing one factor while holding the other locally fixed", desc: "the two terms measure changing one factor while holding the other locally fixed" }
    ],
    derivation: [
      { do: "Start with $\\frac{f(x+h)g(x+h)-f(x)g(x)}{h}$.", result: "Start with $\\frac{f(x+h)g(x+h)-f(x)g(x)}{h}$.", why: "" },
      { do: "Add and subtract $f(x+h)g(x)$", result: "Add and subtract $f(x+h)g(x)$", why: "this creates two single-factor changes." },
      { do: "Regroup as $\\frac{f(x+h)[g(x+h)-g(x)]}{h}+\\frac{g(x)[f(x+h)-f(x)]}{h}$.", result: "Regroup as $\\frac{f(x+h)[g(x+h)-g(x)]}{h}+\\frac{g(x)[f(x+h)-f(x)]}{h}$.", why: "" },
      { do: "Let $h\\to0$", result: "Let $h\\to0$", why: "continuity from differentiability gives $f(x+h)\\to f(x)$." },
      { do: "The first term tends to $f(x)g'(x)$ and the second to $g(x)f'(x)$.", result: "The first term tends to $f(x)g'(x)$ and the second to $g(x)f'(x)$.", why: "" },
      { do: "Therefore $(fg)'=f'g+fg'$.", result: "Therefore $(fg)'=f'g+fg'$.", why: "" }
    ],
    applications: [
      { title: "$(x^2\\sin x)'=2x\\sin x+x^2\\cos x$, at $x=\\pi/2$", background: "$(x^2\\sin x)'=2x\\sin x+x^2\\cos x$, at $x=\\pi/2$ gives $\\pi$", numbers: "$(x^2\\sin x)'=2x\\sin x+x^2\\cos x$, at $x=\\pi/2$ gives $\\pi$" },
      { title: "$(xe^x)'=e^x+xe^x$, at $1$", background: "$(xe^x)'=e^x+xe^x$, at $1$ gives $2e\\approx5.437$", numbers: "$(xe^x)'=e^x+xe^x$, at $1$ gives $2e\\approx5.437$" },
      { title: "Revenue $p(q)q=(10-q)q$", background: "Revenue $p(q)q=(10-q)q$ has derivative $10-2q$, at $3$ gives $4$", numbers: "Revenue $p(q)q=(10-q)q$ has derivative $10-2q$, at $3$ gives $4$" },
      { title: "$x^2\\ln x$", background: "$x^2\\ln x$ has slope $2x\\ln x+x$, at $e$ gives $3e\\approx8.155$", numbers: "$x^2\\ln x$ has slope $2x\\ln x+x$, at $e$ gives $3e\\approx8.155$" },
      { title: "$\\sqrt{x}(x+1)$", background: "$\\sqrt{x}(x+1)$ has slope $3.25$ at $4$", numbers: "$\\sqrt{x}(x+1)$ has slope $3.25$ at $4$" },
      { title: "$w\\sigma(w)$ with $\\sigma(0)=0.5$, $\\sigma'(0)=0.25$", background: "$w\\sigma(w)$ with $\\sigma(0)=0.5$, $\\sigma'(0)=0.25$ has derivative $0.5$ at $0$", numbers: "$w\\sigma(w)$ with $\\sigma(0)=0.5$, $\\sigma'(0)=0.25$ has derivative $0.5$ at $0$" }
    ]
  },
  "math-01-18": {
    connectionsProse: "<p>This lesson builds on the product rule and reciprocal powers. Quotients appear whenever one changing quantity is measured relative to another. The quotient rule keeps track of how numerator and denominator changes push the ratio in opposite directions.</p>",
    motivation: "<p>A quotient can be rewritten as a product with a reciprocal. That means the product rule and chain rule are enough to derive the quotient rule, provided the denominator is not zero.</p>" +
                "<p>The numerator's change raises or lowers the ratio directly. The denominator's change works in the opposite direction because increasing the denominator makes the same numerator count for less.</p>",
    definition: "<p>Central statement: $(f'g-fg')/g^2$.</p>" +
                "<p><b>Assumptions that matter:</b> Follow the conditions stated in the derivation, including required domains, nonzero denominators, continuity or differentiability hypotheses, interval restrictions, and convergence conditions.</p>",
    symbols: [
      { sym: "$g(x)\\ne0$", desc: "is required" },
      { sym: "$f'g$", desc: "is numerator-change contribution" },
      { sym: "$fg'$", desc: "is denominator-change contribution" }
    ],
    derivation: [
      { do: "Write $f/g=f\\cdot g^{-1}$ with $g\\ne0$", result: "Write $f/g=f\\cdot g^{-1}$ with $g\\ne0$", why: "turn the quotient into a product." },
      { do: "Differentiate using the product rule", result: "$(f/g)'=f'g^{-1}+f(g^{-1})'$.", why: "" },
      { do: "Differentiate $g^{-1}$ by the chain rule", result: "$(g^{-1})'=-g^{-2}g'$.", why: "" },
      { do: "Substitute", result: "$(f/g)'=f'/g-fg'/g^2$.", why: "" },
      { do: "Put over a common denominator", result: "$(f'g-fg')/g^2$.", why: "" }
    ],
    applications: [
      { title: "$\\left(\\frac{x^2+1}{x}\\right)'=1-1/x^2$, at $2$", background: "$\\left(\\frac{x^2+1}{x}\\right)'=1-1/x^2$, at $2$ gives $0.75$", numbers: "$\\left(\\frac{x^2+1}{x}\\right)'=1-1/x^2$, at $2$ gives $0.75$" },
      { title: "$\\left(\\frac{x}{x+1}\\right)'=1/(x+1)^2$, at $3$", background: "$\\left(\\frac{x}{x+1}\\right)'=1/(x+1)^2$, at $3$ gives $0.0625$", numbers: "$\\left(\\frac{x}{x+1}\\right)'=1/(x+1)^2$, at $3$ gives $0.0625$" },
      { title: "$\\left(\\frac{\\sin x}{x}\\right)'$ at $\\pi/2$", background: "$\\left(\\frac{\\sin x}{x}\\right)'$ at $\\pi/2$ is $-4/\\pi^2\\approx-0.405$", numbers: "$\\left(\\frac{\\sin x}{x}\\right)'$ at $\\pi/2$ is $-4/\\pi^2\\approx-0.405$" },
      { title: "Average cost $(q^2+10)/q$", background: "Average cost $(q^2+10)/q$ has derivative $1-10/q^2$, at $5$ gives $0.6$", numbers: "Average cost $(q^2+10)/q$ has derivative $1-10/q^2$, at $5$ gives $0.6$" },
      { title: "Ratio $e^x/(1+x)$", background: "Ratio $e^x/(1+x)$ has slope $e/4\\approx0.680$ at $1$", numbers: "Ratio $e^x/(1+x)$ has slope $e/4\\approx0.680$ at $1$" },
      { title: "Odds $p/(1-p)$", background: "Odds $p/(1-p)$ has derivative $1/(1-p)^2$, at $p=0.8$ gives $25$", numbers: "Odds $p/(1-p)$ has derivative $1/(1-p)^2$, at $p=0.8$ gives $25$" }
    ]
  },
  "math-01-19": {
    connectionsProse: "<p>This lesson builds on composition of functions. Many useful formulas have an inside process followed by an outside process. The chain rule is the derivative rule that follows that path of dependence.</p>",
    motivation: "<p>A composed function changes in stages. A small change in $x$ first changes the inner value $g(x)$, and that changed inner value then changes the outer output $f(g(x))$.</p>" +
                "<p>The total local rate is the product of those local rates. The outside derivative is evaluated at the current inside value, then multiplied by the derivative of the inside function.</p>",
    definition: "<p>Central statement: Get $(f\\circ g)'(x)=f'(g(x))g'(x)$.</p>" +
                "<p><b>Assumptions that matter:</b> Follow the conditions stated in the derivation, including required domains, nonzero denominators, continuity or differentiability hypotheses, interval restrictions, and convergence conditions.</p>",
    symbols: [
      { sym: "$g$", desc: "is the inner function" },
      { sym: "$f$", desc: "is the outer function" },
      { sym: "$u$", desc: "is the intermediate value" }
    ],
    derivation: [
      { do: "Let $y=f(u)$ and $u=g(x)$", result: "Let $y=f(u)$ and $u=g(x)$", why: "the output changes through an intermediate variable." },
      { do: "For a small $\\Delta x$, the inner change is $\\Delta u\\approx g'(x)\\Delta x$.", result: "For a small $\\Delta x$, the inner change is $\\Delta u\\approx g'(x)\\Delta x$.", why: "" },
      { do: "The outer change is $\\Delta y\\approx f'(u)\\Delta u$", result: "The outer change is $\\Delta y\\approx f'(u)\\Delta u$", why: "use the local slope of $f$ at $u$." },
      { do: "Substitute the inner change", result: "$\\Delta y\\approx f'(g(x))g'(x)\\Delta x$.", why: "" },
      { do: "Divide by $\\Delta x$ and take the limit.", result: "Divide by $\\Delta x$ and take the limit.", why: "" },
      { do: "Get $(f\\circ g)'(x)=f'(g(x))g'(x)$.", result: "Get $(f\\circ g)'(x)=f'(g(x))g'(x)$.", why: "" }
    ],
    applications: [
      { title: "$(3x+1)^2$", background: "$(3x+1)^2$ has derivative $6(3x+1)$, at $2$ gives $42$", numbers: "$(3x+1)^2$ has derivative $6(3x+1)$, at $2$ gives $42$" },
      { title: "$e^{2x}$", background: "$e^{2x}$ has derivative $2e^{2x}$, at $0$ gives $2$", numbers: "$e^{2x}$ has derivative $2e^{2x}$, at $0$ gives $2$" },
      { title: "$\\sin(x^2)$", background: "$\\sin(x^2)$ has derivative $2x\\cos(x^2)$, at $0$ gives $0$", numbers: "$\\sin(x^2)$ has derivative $2x\\cos(x^2)$, at $0$ gives $0$" },
      { title: "$\\ln(1+x^2)$", background: "$\\ln(1+x^2)$ has derivative $2x/(1+x^2)$, at $1$ gives $1$", numbers: "$\\ln(1+x^2)$ has derivative $2x/(1+x^2)$, at $1$ gives $1$" },
      { title: "Loss $(wx-y)^2$ with $x=3,w=2,y=5$", background: "Loss $(wx-y)^2$ with $x=3,w=2,y=5$ has derivative $6$ with respect to $w$", numbers: "Loss $(wx-y)^2$ with $x=3,w=2,y=5$ has derivative $6$ with respect to $w$" },
      { title: "$\\sqrt{1+x}$", background: "$\\sqrt{1+x}$ has slope $1/(2\\sqrt{1+x})$, at $3$ gives $0.25$", numbers: "$\\sqrt{1+x}$ has slope $1/(2\\sqrt{1+x})$, at $3$ gives $0.25$" }
    ]
  },
  "math-01-20": {
    connectionsProse: "<p>This lesson builds on exponential functions and the derivative definition. Exponentials are central because their rate is tied to their current size. The natural exponential $e^x$ is the base where that rate matches the function itself.</p>",
    motivation: "<p>For $e^x$, a small input change factors out as the current value times a small growth factor. The remaining limit is the defining rate property of the base $e$.</p>" +
                "<p>Other exponential bases are converted through $a^x=e^{x\\ln a}$. The chain rule then shows that $\\ln a$ is the scale factor translating base-$a$ growth into natural exponential growth.</p>",
    definition: "<p>Central statement: For $a^x=e^{x\\ln a}$, apply the chain rule to get $(a^x)'=a^x\\ln a$.</p>" +
                "<p><b>Assumptions that matter:</b> Follow the conditions stated in the derivation, including required domains, nonzero denominators, continuity or differentiability hypotheses, interval restrictions, and convergence conditions.</p>",
    symbols: [
      { sym: "$e^x$", desc: "is the natural exponential" },
      { sym: "$a>0$", desc: "is any base" },
      { sym: "$\\ln a$ converts base $a$ growth to natural growth", desc: "$\\ln a$ converts base $a$ growth to natural growth" }
    ],
    derivation: [
      { do: "Use the definition", result: "$\\frac{d}{dx}e^x=\\lim_{h\\to0}\\frac{e^{x+h}-e^x}{h}$.", why: "" },
      { do: "Factor $e^x$", result: "$e^x\\lim_{h\\to0}\\frac{e^h-1}{h}$.", why: "" },
      { do: "The defining limit of $e$ gives $\\lim_{h\\to0}\\frac{e^h-1}{h}=1$.", result: "The defining limit of $e$ gives $\\lim_{h\\to0}\\frac{e^h-1}{h}=1$.", why: "" },
      { do: "Therefore $(e^x)'=e^x$.", result: "Therefore $(e^x)'=e^x$.", why: "" },
      { do: "For $a^x=e^{x\\ln a}$, apply the chain rule to get $(a^x)'=a^x\\ln a$.", result: "For $a^x=e^{x\\ln a}$, apply the chain rule to get $(a^x)'=a^x\\ln a$.", why: "" }
    ],
    applications: [
      { title: "$\\frac{d}{dx}e^x$ at $2$", background: "$\\frac{d}{dx}e^x$ at $2$ is $e^2\\approx7.389$", numbers: "$\\frac{d}{dx}e^x$ at $2$ is $e^2\\approx7.389$" },
      { title: "$\\frac{d}{dx}2^x$ at $3$", background: "$\\frac{d}{dx}2^x$ at $3$ is $8\\ln2\\approx5.545$", numbers: "$\\frac{d}{dx}2^x$ at $3$ is $8\\ln2\\approx5.545$" },
      { title: "$e^{-0.5t}$", background: "$e^{-0.5t}$ has derivative $-0.5e^{-0.5t}$, at $0$ gives $-0.5$", numbers: "$e^{-0.5t}$ has derivative $-0.5e^{-0.5t}$, at $0$ gives $-0.5$" },
      { title: "$5e^{0.2t}$", background: "$5e^{0.2t}$ has rate $1$ at $t=0$", numbers: "$5e^{0.2t}$ has rate $1$ at $t=0$" },
      { title: "Softplus derivative of $\\ln(1+e^x)$ at $0$", background: "Softplus derivative of $\\ln(1+e^x)$ at $0$ is $0.5$", numbers: "Softplus derivative of $\\ln(1+e^x)$ at $0$ is $0.5$" },
      { title: "Continuous growth $100e^{0.03t}$", background: "Continuous growth $100e^{0.03t}$ has initial rate $3$", numbers: "Continuous growth $100e^{0.03t}$ has initial rate $3$" }
    ]
  },
  "math-01-21": {
    connectionsProse: "<p>This lesson builds on logarithms as inverse exponentials. Since $\\ln x$ undoes $e^x$, its derivative can be found by differentiating the inverse relation. The result makes relative change a central calculus idea.</p>",
    motivation: "<p>The logarithm grows slowly because multiplying the input by a fixed factor only adds a fixed amount to the output. That slow growth appears in the derivative $1/x$, which gets smaller as $x$ gets larger.</p>" +
                "<p>Implicit differentiation makes the derivation clean. Writing $y=\\ln x$ as $e^y=x$ lets the exponential derivative and the chain rule solve for $dy/dx$.</p>",
    definition: "<p>Central statement: For $\\log_a x=\\ln x/\\ln a$, derivative is $1/(x\\ln a)$.</p>" +
                "<p><b>Assumptions that matter:</b> Follow the conditions stated in the derivation, including required domains, nonzero denominators, continuity or differentiability hypotheses, interval restrictions, and convergence conditions.</p>",
    symbols: [
      { sym: "$x>0$", desc: "$x>0$" },
      { sym: "$y$", desc: "is the logarithm" },
      { sym: "$a$", desc: "is a positive base not equal to $1$" }
    ],
    derivation: [
      { do: "Let $y=\\ln x$", result: "Let $y=\\ln x$", why: "this means $e^y=x$." },
      { do: "Differentiate both sides with respect to $x$.", result: "Differentiate both sides with respect to $x$.", why: "" },
      { do: "The left side gives $e^y\\frac{dy}{dx}$ by the chain rule.", result: "The left side gives $e^y\\frac{dy}{dx}$ by the chain rule.", why: "" },
      { do: "The right side gives $1$.", result: "The right side gives $1$.", why: "" },
      { do: "Solve $\\frac{dy}{dx}=1/e^y$.", result: "Solve $\\frac{dy}{dx}=1/e^y$.", why: "" },
      { do: "Since $e^y=x$, $\\frac{d}{dx}\\ln x=1/x$.", result: "Since $e^y=x$, $\\frac{d}{dx}\\ln x=1/x$.", why: "" },
      { do: "For $\\log_a x=\\ln x/\\ln a$, derivative is $1/(x\\ln a)$.", result: "For $\\log_a x=\\ln x/\\ln a$, derivative is $1/(x\\ln a)$.", why: "" }
    ],
    applications: [
      { title: "$\\frac{d}{dx}\\ln x$ at $4$", background: "$\\frac{d}{dx}\\ln x$ at $4$ is $0.25$", numbers: "$\\frac{d}{dx}\\ln x$ at $4$ is $0.25$" },
      { title: "$\\frac{d}{dx}\\log_{10}x$ at $100$", background: "$\\frac{d}{dx}\\log_{10}x$ at $100$ is $1/(100\\ln10)\\approx0.00434$", numbers: "$\\frac{d}{dx}\\log_{10}x$ at $100$ is $1/(100\\ln10)\\approx0.00434$" },
      { title: "$\\ln(1+x)$", background: "$\\ln(1+x)$ has slope $1/(1+x)$, at $3$ gives $0.25$", numbers: "$\\ln(1+x)$ has slope $1/(1+x)$, at $3$ gives $0.25$" },
      { title: "Log loss $-\\ln p$", background: "Log loss $-\\ln p$ has derivative $-1/p$, at $p=0.8$ gives $-1.25$", numbers: "Log loss $-\\ln p$ has derivative $-1/p$, at $p=0.8$ gives $-1.25$" },
      { title: "$x\\ln x$", background: "$x\\ln x$ has derivative $\\ln x+1$, at $e^2$ gives $3$", numbers: "$x\\ln x$ has derivative $\\ln x+1$, at $e^2$ gives $3$" },
      { title: "Elasticity derivative $d\\ln y/dy$ at $y=20$", background: "Elasticity derivative $d\\ln y/dy$ at $y=20$ is $0.05$", numbers: "Elasticity derivative $d\\ln y/dy$ at $y=20$ is $0.05$" }
    ]
  },
  "math-01-22": {
    connectionsProse: "<p>This lesson builds on trigonometric functions, limits, and angle measure in radians. Trigonometric derivatives describe how coordinates change during rotation. They are used throughout oscillation, waves, circular motion, and periodic modeling.</p>",
    motivation: "<p>Sine and cosine are linked because they are the vertical and horizontal coordinates of the same rotating point. As the point moves around the circle, the rate of change of one coordinate is controlled by the other coordinate.</p>" +
                "<p>The derivation depends on angle-addition identities and the basic trigonometric limits. Radian measure is essential because those limits have the simple values used in the derivative formulas.</p>",
    definition: "<p>Central statement: The same identity method gives $(\\cos x)'=-\\sin x$, and quotient rule gives $(\\tan x)'=\\sec^2x$.</p>" +
                "<p><b>Assumptions that matter:</b> Follow the conditions stated in the derivation, including required domains, nonzero denominators, continuity or differentiability hypotheses, interval restrictions, and convergence conditions.</p>",
    symbols: [
      { sym: "$x$", desc: "is in radians" },
      { sym: "$h$", desc: "is angle change" },
      { sym: "$\\sec x=1/\\cos x$", desc: "$\\sec x=1/\\cos x$" }
    ],
    derivation: [
      { do: "Start with $\\frac{d}{dx}\\sin x=\\lim_{h\\to0}\\frac{\\sin(x+h)-\\sin x}{h}$.", result: "Start with $\\frac{d}{dx}\\sin x=\\lim_{h\\to0}\\frac{\\sin(x+h)-\\sin x}{h}$.", why: "" },
      { do: "Use $\\sin(x+h)=\\sin x\\cos h+\\cos x\\sin h$.", result: "Use $\\sin(x+h)=\\sin x\\cos h+\\cos x\\sin h$.", why: "" },
      { do: "Regroup as $\\sin x\\frac{\\cos h-1}{h}+\\cos x\\frac{\\sin h}{h}$.", result: "Regroup as $\\sin x\\frac{\\cos h-1}{h}+\\cos x\\frac{\\sin h}{h}$.", why: "" },
      { do: "Use limits $\\lim_{h\\to0}\\frac{\\sin h}{h}=1$ and $\\lim_{h\\to0}\\frac{\\cos h-1}{h}=0$.", result: "Use limits $\\lim_{h\\to0}\\frac{\\sin h}{h}=1$ and $\\lim_{h\\to0}\\frac{\\cos h-1}{h}=0$.", why: "" },
      { do: "Get $(\\sin x)'=\\cos x$.", result: "Get $(\\sin x)'=\\cos x$.", why: "" },
      { do: "The same identity method gives $(\\cos x)'=-\\sin x$, and quotient rule gives $(\\tan x)'=\\sec^2x$.", result: "The same identity method gives $(\\cos x)'=-\\sin x$, and quotient rule gives $(\\tan x)'=\\sec^2x$.", why: "" }
    ],
    applications: [
      { title: "$\\sin x$ slope at $\\pi/3$", background: "$\\sin x$ slope at $\\pi/3$ is $0.5$", numbers: "$\\sin x$ slope at $\\pi/3$ is $0.5$" },
      { title: "$\\cos x$ slope at $\\pi/6$", background: "$\\cos x$ slope at $\\pi/6$ is $-0.5$", numbers: "$\\cos x$ slope at $\\pi/6$ is $-0.5$" },
      { title: "$\\tan x$ slope at $0$", background: "$\\tan x$ slope at $0$ is $1$", numbers: "$\\tan x$ slope at $0$ is $1$" },
      { title: "$3\\sin(2t)$", background: "$3\\sin(2t)$ has derivative $6\\cos(2t)$, at $0$ gives $6$", numbers: "$3\\sin(2t)$ has derivative $6\\cos(2t)$, at $0$ gives $6$" },
      { title: "Harmonic position $\\cos t$", background: "Harmonic position $\\cos t$ has velocity $-1$ at $\\pi/2$", numbers: "Harmonic position $\\cos t$ has velocity $-1$ at $\\pi/2$" },
      { title: "Application 6", background: "$\\sec^2(\\pi/4)=2$", numbers: "$\\sec^2(\\pi/4)=2$" }
    ]
  },
  "math-01-23": {
    connectionsProse: "<p>This lesson builds on the chain rule and equations for curves. Some curves are easier to describe by a relation between $x$ and $y$ than by solving for $y$. Implicit differentiation keeps that relation intact while finding slope.</p>",
    motivation: "<p>When $y$ depends on $x$ but is not isolated, differentiating terms involving $y$ requires the chain rule. Each derivative of a $y$ expression carries a factor of $dy/dx$.</p>" +
                "<p>After differentiating the whole equation, the slope can be solved algebraically. This is especially useful for circles, level curves, and constraints where solving for one branch would be awkward.</p>",
    definition: "<p>For $x^2+y^2=25$</p>" +
                "<p><b>Assumptions that matter:</b> Follow the conditions stated in the derivation, including required domains, nonzero denominators, continuity or differentiability hypotheses, interval restrictions, and convergence conditions.</p>",
    symbols: [
      { sym: "$dy/dx$", desc: "is the slope of the curve" },
      { sym: "$x,y$", desc: "are coordinates constrained by the equation" }
    ],
    derivation: [
      { do: "Treat $y$ as a function of $x$", result: "Treat $y$ as a function of $x$", why: "the curve may have changing vertical coordinate." },
      { do: "Differentiate $x^2$ to get $2x$.", result: "Differentiate $x^2$ to get $2x$.", why: "" },
      { do: "Differentiate $y^2$ by the chain rule to get $2y\\,dy/dx$.", result: "Differentiate $y^2$ by the chain rule to get $2y\\,dy/dx$.", why: "" },
      { do: "Differentiate $25$ to get $0$.", result: "Differentiate $25$ to get $0$.", why: "" },
      { do: "Solve $2x+2y\\,dy/dx=0$ for $dy/dx=-x/y$.", result: "Solve $2x+2y\\,dy/dx=0$ for $dy/dx=-x/y$.", why: "" },
      { do: "At $(3,4)$ the slope is $-3/4$.", result: "At $(3,4)$ the slope is $-3/4$.", why: "" }
    ],
    applications: [
      { title: "Circle slope at $(3,4)$", background: "Circle slope at $(3,4)$ is $-0.75$", numbers: "Circle slope at $(3,4)$ is $-0.75$" },
      { title: "$xy=6$", background: "$xy=6$ gives $y'=-y/x$, at $(2,3)$ gives $-1.5$", numbers: "$xy=6$ gives $y'=-y/x$, at $(2,3)$ gives $-1.5$" },
      { title: "$x^2+xy+y^2=7$", background: "$x^2+xy+y^2=7$ gives $y'=-(2x+y)/(x+2y)$, at $(1,2)$ gives $-0.8$", numbers: "$x^2+xy+y^2=7$ gives $y'=-(2x+y)/(x+2y)$, at $(1,2)$ gives $-0.8$" },
      { title: "Level curve $x^2+y^2=1$ at $(\\sqrt3/2,1/2)$", background: "Level curve $x^2+y^2=1$ at $(\\sqrt3/2,1/2)$ has slope $-\\sqrt3\\approx-1.732$", numbers: "Level curve $x^2+y^2=1$ at $(\\sqrt3/2,1/2)$ has slope $-\\sqrt3\\approx-1.732$" },
      { title: "Demand relation $pq=100$", background: "Demand relation $pq=100$ has $dq/dp=-q/p$, at $(10,10)$ gives $-1$", numbers: "Demand relation $pq=100$ has $dq/dp=-q/p$, at $(10,10)$ gives $-1$" },
      { title: "Unit circle at $(0,1)$", background: "Unit circle at $(0,1)$ has slope $0$", numbers: "Unit circle at $(0,1)$ has slope $0$" }
    ]
  },
  "math-01-24": {
    connectionsProse: "<p>This lesson builds on logarithm rules, implicit differentiation, and the product rule. Logarithmic differentiation is useful when a formula has products, quotients, powers, or variable exponents. It turns a complicated derivative into simpler additive pieces.</p>",
    motivation: "<p>Taking a logarithm can simplify structure before differentiating. Products become sums, quotients become differences, and exponents move down as factors, so the derivative is often easier on the log scale.</p>" +
                "<p>Because the logarithm is applied to the dependent variable, implicit differentiation is used. After finding $y'/y$, multiplying by $y$ returns the derivative of the original function.</p>",
    definition: "<p>For $y=x^x$</p>" +
                "<p><b>Assumptions that matter:</b> Follow the conditions stated in the derivation, including required domains, nonzero denominators, continuity or differentiability hypotheses, interval restrictions, and convergence conditions.</p>",
    symbols: [
      { sym: "$y$", desc: "is the original function" },
      { sym: "$\\ln y$", desc: "is differentiated implicitly" },
      { sym: "$x>0$ for real logarithms", desc: "$x>0$ for real logarithms" }
    ],
    derivation: [
      { do: "Take logs", result: "$\\ln y=x\\ln x$", why: "the exponent moves down." },
      { do: "Differentiate both sides", result: "$\\frac{y'}{y}=\\ln x+1$", why: "use implicit differentiation on $\\ln y$." },
      { do: "Multiply by $y$", result: "$y'=y(\\ln x+1)$.", why: "" },
      { do: "Substitute $y=x^x$.", result: "Substitute $y=x^x$.", why: "" },
      { do: "Get $\\frac{d}{dx}x^x=x^x(\\ln x+1)$.", result: "Get $\\frac{d}{dx}x^x=x^x(\\ln x+1)$.", why: "" }
    ],
    applications: [
      { title: "$x^x$ derivative at $1$", background: "$x^x$ derivative at $1$ is $1$", numbers: "$x^x$ derivative at $1$ is $1$" },
      { title: "$x^x$ derivative at $e$", background: "$x^x$ derivative at $e$ is $2e^e\\approx30.309$", numbers: "$x^x$ derivative at $e$ is $2e^e\\approx30.309$" },
      { title: "$y=x^2\\sqrt{x+1}$", background: "$y=x^2\\sqrt{x+1}$ has $y'/y=2/x+1/[2(x+1)]$, at $3$ with $y=18$ gives $13.5$", numbers: "$y=x^2\\sqrt{x+1}$ has $y'/y=2/x+1/[2(x+1)]$, at $3$ with $y=18$ gives $13.5$" },
      { title: "$y=(x^2+1)^3$ at $1$", background: "$y=(x^2+1)^3$ at $1$ has derivative $24$", numbers: "$y=(x^2+1)^3$ at $1$ has derivative $24$" },
      { title: "$y=\\frac{x^3}{x+1}$", background: "$y=\\frac{x^3}{x+1}$ has log derivative $3/x-1/(x+1)$, at $2$ gives $1.167$ and $y'=3.111$", numbers: "$y=\\frac{x^3}{x+1}$ has log derivative $3/x-1/(x+1)$, at $2$ gives $1.167$ and $y'=3.111$" },
      { title: "Elasticity of $x^x$", background: "Elasticity of $x^x$ is $x(\\ln x+1)$, at $1$ gives $1$", numbers: "Elasticity of $x^x$ is $x(\\ln x+1)$, at $1$ gives $1$" }
    ]
  },
  "math-01-25": {
    connectionsProse: "<p>This lesson builds on implicit differentiation and rates of change. Related rates problems describe several quantities changing at the same time. An equation connecting the quantities lets one measured rate determine another.</p>",
    motivation: "<p>The central move is to write the geometric or physical relation before differentiating. Since the variables depend on time, differentiating with respect to time produces rates such as $dA/dt$ and $dr/dt$.</p>" +
                "<p>Current numerical values are substituted after the derivative relation is found. This order matters because differentiating first preserves how the rates are connected at any moment.</p>",
    definition: "<p>For a circle with area $A=\\pi r^2$</p>" +
                "<p><b>Assumptions that matter:</b> Follow the conditions stated in the derivation, including required domains, nonzero denominators, continuity or differentiability hypotheses, interval restrictions, and convergence conditions.</p>",
    symbols: [
      { sym: "$t$", desc: "is time" },
      { sym: "$dA/dt$ and $dr/dt$", desc: "are rates" },
      { sym: "current values", desc: "are substituted after differentiating" }
    ],
    derivation: [
      { do: "Identify the relation $A=\\pi r^2$", result: "Identify the relation $A=\\pi r^2$", why: "area depends on radius." },
      { do: "Treat $A$ and $r$ as functions of time.", result: "Treat $A$ and $r$ as functions of time.", why: "" },
      { do: "Differentiate both sides with respect to $t$", result: "$dA/dt=2\\pi r\\,dr/dt$.", why: "" },
      { do: "Substitute $r=3$ and $dr/dt=0.5$.", result: "Substitute $r=3$ and $dr/dt=0.5$.", why: "" },
      { do: "Compute $dA/dt=3\\pi\\approx9.425$.", result: "Compute $dA/dt=3\\pi\\approx9.425$.", why: "" }
    ],
    applications: [
      { title: "Circle area rate above", background: "Circle area rate above is $3\\pi\\approx9.425$", numbers: "Circle area rate above is $3\\pi\\approx9.425$" },
      { title: "Sphere volume $V=4\\pi r^3/3$ with $r=2$, $dr/dt=0.1$", background: "Sphere volume $V=4\\pi r^3/3$ with $r=2$, $dr/dt=0.1$ gives $dV/dt=1.6\\pi\\approx5.027$", numbers: "Sphere volume $V=4\\pi r^3/3$ with $r=2$, $dr/dt=0.1$ gives $dV/dt=1.6\\pi\\approx5.027$" },
      { title: "Ladder $x^2+y^2=25$, $x=3$, $dx/dt=1$", background: "Ladder $x^2+y^2=25$, $x=3$, $dx/dt=1$ gives $dy/dt=-0.75$", numbers: "Ladder $x^2+y^2=25$, $x=3$, $dx/dt=1$ gives $dy/dt=-0.75$" },
      { title: "Rectangle $A=lw$ with $l=4,w=5,l'=2,w'=1$", background: "Rectangle $A=lw$ with $l=4,w=5,l'=2,w'=1$ gives $A'=14$", numbers: "Rectangle $A=lw$ with $l=4,w=5,l'=2,w'=1$ gives $A'=14$" },
      { title: "Distance $s=\\sqrt{x^2+y^2}$ at $(3,4)$ with velocity $(1,2)$", background: "Distance $s=\\sqrt{x^2+y^2}$ at $(3,4)$ with velocity $(1,2)$ gives $s'=2.2$", numbers: "Distance $s=\\sqrt{x^2+y^2}$ at $(3,4)$ with velocity $(1,2)$ gives $s'=2.2$" },
      { title: "Cone volume $V=\\pi r^2h/3$ with $r=2,h=6,r'=0.1,h'=0.2$", background: "Cone volume $V=\\pi r^2h/3$ with $r=2,h=6,r'=0.1,h'=0.2$ gives $V'\\approx2.094$", numbers: "Cone volume $V=\\pi r^2h/3$ with $r=2,h=6,r'=0.1,h'=0.2$ gives $V'\\approx2.094$" }
    ]
  },
  "math-01-26": {
    connectionsProse: "<p>This lesson builds on differentiability and tangent lines. A differentiable function looks nearly linear when viewed very close to a point. Linear approximation uses that local line as a practical estimate.</p>",
    motivation: "<p>The derivative gives the slope of the tangent line at a base input. If the input moves a small amount, the tangent line predicts the output change by slope times displacement.</p>" +
                "<p>Curvature creates error, so the approximation is best for nearby inputs. This local linear viewpoint is also the starting point for differentials, error estimates, Newton's method, and Taylor polynomials.</p>",
    definition: "<p>Central statement: The approximation improves as $\\Delta x\\to0$.</p>" +
                "<p><b>Assumptions that matter:</b> Follow the conditions stated in the derivation, including required domains, nonzero denominators, continuity or differentiability hypotheses, interval restrictions, and convergence conditions.</p>",
    symbols: [
      { sym: "$a$", desc: "is the base point" },
      { sym: "$L(x)$", desc: "is the tangent-line approximation" },
      { sym: "$\\Delta x$", desc: "is the small input change" }
    ],
    derivation: [
      { do: "The derivative gives local slope $f'(a)$.", result: "The derivative gives local slope $f'(a)$.", why: "" },
      { do: "The tangent line through $(a,f(a))$ with that slope is $L(x)=f(a)+f'(a)(x-a)$.", result: "The tangent line through $(a,f(a))$ with that slope is $L(x)=f(a)+f'(a)(x-a)$.", why: "" },
      { do: "Let $\\Delta x=x-a$", result: "Let $\\Delta x=x-a$", why: "the input moves a small amount." },
      { do: "Then $f(a+\\Delta x)\\approx f(a)+f'(a)\\Delta x$", result: "Then $f(a+\\Delta x)\\approx f(a)+f'(a)\\Delta x$", why: "ignore higher-order curvature terms." },
      { do: "The approximation improves as $\\Delta x\\to0$.", result: "The approximation improves as $\\Delta x\\to0$.", why: "" }
    ],
    applications: [
      { title: "Application 1", background: "$\\sqrt{4.1}\\approx2+(1/4)(0.1)=2.025$", numbers: "$\\sqrt{4.1}\\approx2+(1/4)(0.1)=2.025$" },
      { title: "Application 2", background: "True $\\sqrt{4.1}\\approx2.025$", numbers: "True $\\sqrt{4.1}\\approx2.025$" },
      { title: "Application 3", background: "$e^{0.05}\\approx1+0.05=1.05$", numbers: "$e^{0.05}\\approx1+0.05=1.05$" },
      { title: "Application 4", background: "$\\ln(1.02)\\approx0.02$", numbers: "$\\ln(1.02)\\approx0.02$" },
      { title: "Application 5", background: "$\\sin(0.1)\\approx0.1$", numbers: "$\\sin(0.1)\\approx0.1$" },
      { title: "Application 6", background: "For $x^2$ near $10$, $10.1^2\\approx100+20(0.1)=102$", numbers: "For $x^2$ near $10$, $10.1^2\\approx100+20(0.1)=102$" }
    ]
  },
  "math-01-27": {
    connectionsProse: "<p>This lesson builds on linear approximation. Differentials give names to small input changes and their corresponding tangent-line output changes. They make local change calculations easier to track with units.</p>",
    motivation: "<p>The actual output change $\\Delta y$ can be difficult to compute exactly, but the tangent-line change $dy$ is simple. It is the derivative at the point multiplied by the chosen input change $dx$.</p>" +
                "<p>This notation is especially helpful in applications. It separates the measured input uncertainty from the function's sensitivity, so approximate error propagation becomes a direct multiplication.</p>",
    definition: "<p>Central statement: For small $dx$, $\\Delta y\\approx dy$.</p>" +
                "<p><b>Assumptions that matter:</b> Follow the conditions stated in the derivation, including required domains, nonzero denominators, continuity or differentiability hypotheses, interval restrictions, and convergence conditions.</p>",
    symbols: [
      { sym: "$dx$", desc: "is a small input change" },
      { sym: "$dy$", desc: "is the linearized output change" },
      { sym: "$f'(x)$ converts units of input to units of output", desc: "$f'(x)$ converts units of input to units of output" }
    ],
    derivation: [
      { do: "Start from linear approximation $f(x+\\Delta x)\\approx f(x)+f'(x)\\Delta x$.", result: "Start from linear approximation $f(x+\\Delta x)\\approx f(x)+f'(x)\\Delta x$.", why: "" },
      { do: "Define $dx=\\Delta x$", result: "Define $dx=\\Delta x$", why: "name the small input change." },
      { do: "Define $dy=f'(x)dx$", result: "Define $dy=f'(x)dx$", why: "the tangent-line output change." },
      { do: "The actual change is $\\Delta y=f(x+\\Delta x)-f(x)$.", result: "The actual change is $\\Delta y=f(x+\\Delta x)-f(x)$.", why: "" },
      { do: "For small $dx$, $\\Delta y\\approx dy$.", result: "For small $dx$, $\\Delta y\\approx dy$.", why: "" }
    ],
    applications: [
      { title: "$y=x^2$ at $x=3$, $dx=0.01$", background: "$y=x^2$ at $x=3$, $dx=0.01$ gives $dy=0.06$", numbers: "$y=x^2$ at $x=3$, $dx=0.01$ gives $dy=0.06$" },
      { title: "$A=\\pi r^2$ at $r=10$, $dr=0.1$", background: "$A=\\pi r^2$ at $r=10$, $dr=0.1$ gives $dA=2\\pi\\approx6.283$", numbers: "$A=\\pi r^2$ at $r=10$, $dr=0.1$ gives $dA=2\\pi\\approx6.283$" },
      { title: "$\\ln x$ at $x=100$, $dx=1$", background: "$\\ln x$ at $x=100$, $dx=1$ gives $dy=0.01$", numbers: "$\\ln x$ at $x=100$, $dx=1$ gives $dy=0.01$" },
      { title: "$e^x$ at $0$, $dx=0.02$", background: "$e^x$ at $0$, $dx=0.02$ gives $dy=0.02$", numbers: "$e^x$ at $0$, $dx=0.02$ gives $dy=0.02$" },
      { title: "$\\sqrt{x}$ at $25$, $dx=0.5$", background: "$\\sqrt{x}$ at $25$, $dx=0.5$ gives $dy=0.05$", numbers: "$\\sqrt{x}$ at $25$, $dx=0.5$ gives $dy=0.05$" },
      { title: "Sensor scale $y=5x$, $dx=0.2$", background: "Sensor scale $y=5x$, $dx=0.2$ gives $dy=1$", numbers: "Sensor scale $y=5x$, $dx=0.2$ gives $dy=1$" }
    ]
  },
  "math-01-28": {
    connectionsProse: "<p>This lesson builds on limits and algebraic rewriting. An indeterminate form signals that substitution has not revealed the limiting behavior. The expression needs to be transformed before the limit can be read.</p>",
    motivation: "<p>Forms such as $0/0$ are not values. They mean that two competing effects are happening at once, and the first substitution does not say which effect dominates.</p>" +
                "<p>Algebra, identities, logarithms, or later L'Hôpital's rule can expose the deciding structure. The goal is to rewrite the expression so known basic limits can be applied.</p>",
    definition: "<p>For $\\lim_{x\\to0}\\frac{1-\\cos x}{x^2}$</p>" +
                "<p><b>Assumptions that matter:</b> Follow the conditions stated in the derivation, including required domains, nonzero denominators, continuity or differentiability hypotheses, interval restrictions, and convergence conditions.</p>",
    symbols: [
      { sym: "$0/0$, $\\infty/\\infty$, $0\\cdot\\infty$, and $1^\\infty$", desc: "describe forms, not values" }
    ],
    derivation: [
      { do: "Direct substitution gives $0/0$", result: "Direct substitution gives $0/0$", why: "more work is needed." },
      { do: "Multiply by the conjugate", result: "$\\frac{1-\\cos x}{x^2}\\cdot\\frac{1+\\cos x}{1+\\cos x}$.", why: "" },
      { do: "Use $1-\\cos^2x=\\sin^2x$.", result: "Use $1-\\cos^2x=\\sin^2x$.", why: "" },
      { do: "Rewrite as $\\left(\\frac{\\sin x}{x}\\right)^2\\frac{1}{1+\\cos x}$.", result: "Rewrite as $\\left(\\frac{\\sin x}{x}\\right)^2\\frac{1}{1+\\cos x}$.", why: "" },
      { do: "Let $x\\to0$ using $\\sin x/x\\to1$ and $\\cos x\\to1$.", result: "Let $x\\to0$ using $\\sin x/x\\to1$ and $\\cos x\\to1$.", why: "" },
      { do: "The limit is $1/2$.", result: "The limit is $1/2$.", why: "" }
    ],
    applications: [
      { title: "Worked limit", background: "Worked limit is $0.5$", numbers: "Worked limit is $0.5$" },
      { title: "Application 2", background: "$\\lim_{x\\to0}\\frac{e^x-1}{x}=1$", numbers: "$\\lim_{x\\to0}\\frac{e^x-1}{x}=1$" },
      { title: "Application 3", background: "$\\lim_{x\\to0}x\\ln x=0$ from the right", numbers: "$\\lim_{x\\to0}x\\ln x=0$ from the right" },
      { title: "Application 4", background: "$\\lim_{x\\to\\infty}\\frac{x}{e^x}=0$", numbers: "$\\lim_{x\\to\\infty}\\frac{x}{e^x}=0$" },
      { title: "Application 5", background: "$\\lim_{x\\to0}(1+x)^{1/x}=e\\approx2.718$", numbers: "$\\lim_{x\\to0}(1+x)^{1/x}=e\\approx2.718$" },
      { title: "Application 6", background: "$\\lim_{x\\to0}\\frac{\\ln(1+x)}{x}=1$", numbers: "$\\lim_{x\\to0}\\frac{\\ln(1+x)}{x}=1$" }
    ]
  },
  "math-01-29": {
    connectionsProse: "<p>This lesson builds on indeterminate forms and derivatives. L'Hôpital's rule uses rates to compare two quantities whose values alone do not decide a limit. It is a theorem for specific forms, not a general simplification trick.</p>",
    motivation: "<p>When numerator and denominator both approach zero, their leading local behavior often comes from their tangent lines. Comparing those tangent-line slopes explains why derivative ratios can determine the original limit.</p>" +
                "<p>The rule also applies to suitable $\\infty/\\infty$ forms under its hypotheses. The important habit is to check the form first, then differentiate numerator and denominator separately.</p>",
    definition: "<p>Central statement: Thus $\\lim f/g=\\lim f'/g'$ when the derivative limit exists.</p>" +
                "<p><b>Assumptions that matter:</b> Follow the conditions stated in the derivation, including required domains, nonzero denominators, continuity or differentiability hypotheses, interval restrictions, and convergence conditions.</p>",
    symbols: [
      { sym: "$f,g$", desc: "are numerator and denominator" },
      { sym: "$a$", desc: "is the limiting point" },
      { sym: "the rule applies to $0/0$ or $\\infty/\\infty$ forms", desc: "the rule applies to $0/0$ or $\\infty/\\infty$ forms" }
    ],
    derivation: [
      { do: "Suppose $f(a)=g(a)=0$ and $g'(a)\\ne0$", result: "Suppose $f(a)=g(a)=0$ and $g'(a)\\ne0$", why: "this is a $0/0$ form with a nonzero denominator slope." },
      { do: "Near $a$, use linear approximations $f(x)\\approx f'(a)(x-a)$ and $g(x)\\approx g'(a)(x-a)$.", result: "Near $a$, use linear approximations $f(x)\\approx f'(a)(x-a)$ and $g(x)\\approx g'(a)(x-a)$.", why: "" },
      { do: "Divide the approximations", result: "$f(x)/g(x)\\approx f'(a)/g'(a)$.", why: "" },
      { do: "A full theorem justifies replacing the functions by derivative ratios under its hypotheses.", result: "A full theorem justifies replacing the functions by derivative ratios under its hypotheses.", why: "" },
      { do: "Thus $\\lim f/g=\\lim f'/g'$ when the derivative limit exists.", result: "Thus $\\lim f/g=\\lim f'/g'$ when the derivative limit exists.", why: "" }
    ],
    applications: [
      { title: "Application 1", background: "$\\lim_{x\\to0}\\frac{\\sin x}{x}=\\lim\\frac{\\cos x}{1}=1$", numbers: "$\\lim_{x\\to0}\\frac{\\sin x}{x}=\\lim\\frac{\\cos x}{1}=1$" },
      { title: "Application 2", background: "$\\lim_{x\\to0}\\frac{e^x-1}{x}=1$", numbers: "$\\lim_{x\\to0}\\frac{e^x-1}{x}=1$" },
      { title: "Application 3", background: "$\\lim_{x\\to\\infty}\\frac{x}{e^x}=0$", numbers: "$\\lim_{x\\to\\infty}\\frac{x}{e^x}=0$" },
      { title: "Application 4", background: "$\\lim_{x\\to0}\\frac{1-\\cos x}{x^2}=\\lim\\frac{\\sin x}{2x}=0.5$", numbers: "$\\lim_{x\\to0}\\frac{1-\\cos x}{x^2}=\\lim\\frac{\\sin x}{2x}=0.5$" },
      { title: "Application 5", background: "$\\lim_{x\\to1}\\frac{\\ln x}{x-1}=1$", numbers: "$\\lim_{x\\to1}\\frac{\\ln x}{x-1}=1$" },
      { title: "Application 6", background: "$\\lim_{x\\to\\infty}\\frac{\\ln x}{x}=0$", numbers: "$\\lim_{x\\to\\infty}\\frac{\\ln x}{x}=0$" }
    ]
  },
  "math-01-30": {
    connectionsProse: "<p>This lesson builds on the derivative as a sign and slope detector. Critical points identify interior locations where extrema may occur. They narrow optimization and graphing problems to a manageable candidate list.</p>",
    motivation: "<p>At a smooth local maximum or minimum, the graph cannot be rising through the point with a nonzero slope. The derivative must flatten to zero if it exists.</p>" +
                "<p>A point is also critical when the derivative is missing, because corners and cusps can still create local extrema. Critical points are candidates, not automatic maxima or minima; later tests classify them.</p>",
    definition: "<p>Central statement: If the derivative does not exist, $c$ is still critical because the slope test cannot be applied.</p>" +
                "<p><b>Assumptions that matter:</b> Follow the conditions stated in the derivation, including required domains, nonzero denominators, continuity or differentiability hypotheses, interval restrictions, and convergence conditions.</p>",
    symbols: [
      { sym: "$c$", desc: "is a critical point" },
      { sym: "interior", desc: "means not an endpoint" },
      { sym: "local extremum", desc: "means nearby values are all no larger or no smaller" }
    ],
    derivation: [
      { do: "At an interior local maximum or minimum, values on both sides are no better than $f(c)$.", result: "At an interior local maximum or minimum, values on both sides are no better than $f(c)$.", why: "" },
      { do: "For $h>0$, the quotient $[f(c+h)-f(c)]/h$ has one sign constraint.", result: "For $h>0$, the quotient $[f(c+h)-f(c)]/h$ has one sign constraint.", why: "" },
      { do: "For $h<0$, the quotient has the opposite sign constraint.", result: "For $h<0$, the quotient has the opposite sign constraint.", why: "" },
      { do: "If the derivative exists, the two-sided limit must be both nonnegative and nonpositive.", result: "If the derivative exists, the two-sided limit must be both nonnegative and nonpositive.", why: "" },
      { do: "Therefore $f'(c)=0$.", result: "Therefore $f'(c)=0$.", why: "" },
      { do: "If the derivative does not exist, $c$ is still critical because the slope test cannot be applied.", result: "If the derivative does not exist, $c$ is still critical because the slope test cannot be applied.", why: "" }
    ],
    applications: [
      { title: "$f=x^2-4x$", background: "$f=x^2-4x$ has $f'=2x-4$, critical point $x=2$", numbers: "$f=x^2-4x$ has $f'=2x-4$, critical point $x=2$" },
      { title: "$x^3-3x$", background: "$x^3-3x$ has critical points $x=\\pm1$", numbers: "$x^3-3x$ has critical points $x=\\pm1$" },
      { title: "$|x|$", background: "$|x|$ has critical point $0$ because derivative is missing", numbers: "$|x|$ has critical point $0$ because derivative is missing" },
      { title: "$e^x$", background: "$e^x$ has no critical point because derivative is always positive", numbers: "$e^x$ has no critical point because derivative is always positive" },
      { title: "Loss $(w-5)^2$", background: "Loss $(w-5)^2$ has critical point $w=5$", numbers: "Loss $(w-5)^2$ has critical point $w=5$" },
      { title: "Revenue $-q^2+10q$", background: "Revenue $-q^2+10q$ has critical point $q=5$", numbers: "Revenue $-q^2+10q$ has critical point $q=5$" }
    ]
  },
  "math-01-31": {
    connectionsProse: "<p>This lesson builds on critical points and derivative signs. The first derivative test uses increasing and decreasing intervals to classify local behavior. It is a practical decision procedure for graphs and optimization.</p>",
    motivation: "<p>A positive derivative means the function is increasing locally, and a negative derivative means it is decreasing locally. Around a critical point, those signs show whether the graph climbs into the point or falls away from it.</p>" +
                "<p>A change from positive to negative gives a local maximum, while a change from negative to positive gives a local minimum. If the sign does not change, the critical point may be flat without being an extremum.</p>",
    definition: "<p>This is an explain-only lesson: this lesson is a decision procedure built from the meaning of derivative sign. Explain intervals, sign charts, and classification rather than forcing a separate formula.</p>" +
                "<p><b>Assumptions that matter:</b> Use the stated domain, graph, interval, or modeling conditions before applying the classification.</p>",
    symbols: [
      { sym: "$f'>0$", desc: "means increasing" },
      { sym: "$f'<0$", desc: "means decreasing" },
      { sym: "sign change determines local behavior", desc: "sign change determines local behavior" }
    ],
    applications: [
      { title: "$f=x^2-4x$", background: "$f=x^2-4x$ has $f'<0$ before $2$ and $>0$ after, so $x=2$ is a minimum", numbers: "$f=x^2-4x$ has $f'<0$ before $2$ and $>0$ after, so $x=2$ is a minimum" },
      { title: "$-x^2+4x$", background: "$-x^2+4x$ has maximum at $2$ with value $4$", numbers: "$-x^2+4x$ has maximum at $2$ with value $4$" },
      { title: "$x^3$", background: "$x^3$ has $f'=3x^2\\ge0$ and no max/min at $0$", numbers: "$x^3$ has $f'=3x^2\\ge0$ and no max/min at $0$" },
      { title: "$x^3-3x$", background: "$x^3-3x$ has max at $-1$ and min at $1$", numbers: "$x^3-3x$ has max at $-1$ and min at $1$" },
      { title: "Revenue $-q^2+10q$", background: "Revenue $-q^2+10q$ increases before $5$ and decreases after", numbers: "Revenue $-q^2+10q$ increases before $5$ and decreases after" },
      { title: "Loss $(w-5)^2$", background: "Loss $(w-5)^2$ decreases before $5$ and increases after", numbers: "Loss $(w-5)^2$ decreases before $5$ and increases after" }
    ]
  },
  "math-01-32": {
    connectionsProse: "<p>This lesson builds on first derivatives and slope behavior. Concavity describes how the slope itself changes. It gives a precise way to talk about bending upward or bending downward.</p>",
    motivation: "<p>If slopes are increasing, tangent lines rotate upward as $x$ increases, and the graph is concave up. If slopes are decreasing, tangent lines rotate downward, and the graph is concave down.</p>" +
                "<p>The second derivative measures this change in slope. Its sign is therefore the main computational test for concavity wherever the second derivative exists.</p>",
    definition: "<p>Central statement: For $f=x^3$, $f''=6x$, so it is concave down for $x<0$ and up for $x>0$.</p>" +
                "<p><b>Assumptions that matter:</b> Follow the conditions stated in the derivation, including required domains, nonzero denominators, continuity or differentiability hypotheses, interval restrictions, and convergence conditions.</p>",
    symbols: [
      { sym: "$f''$", desc: "is the derivative of $f'$" },
      { sym: "concave up", desc: "means slopes increase" },
      { sym: "concave down", desc: "means slopes decrease" }
    ],
    derivation: [
      { do: "Concavity is about the derivative $f'$", result: "Concavity is about the derivative $f'$", why: "slopes are themselves a function." },
      { do: "If $f'$ is increasing, then $f''>0$ where the second derivative exists.", result: "If $f'$ is increasing, then $f''>0$ where the second derivative exists.", why: "" },
      { do: "Increasing slopes make tangent lines rotate upward, so the graph is concave up.", result: "Increasing slopes make tangent lines rotate upward, so the graph is concave up.", why: "" },
      { do: "If $f'$ is decreasing, then $f''<0$.", result: "If $f'$ is decreasing, then $f''<0$.", why: "" },
      { do: "Decreasing slopes make the graph concave down.", result: "Decreasing slopes make the graph concave down.", why: "" },
      { do: "For $f=x^3$, $f''=6x$, so it is concave down for $x<0$ and up for $x>0$.", result: "For $f=x^3$, $f''=6x$, so it is concave down for $x<0$ and up for $x>0$.", why: "" }
    ],
    applications: [
      { title: "$x^2$", background: "$x^2$ has $f''=2>0$, concave up", numbers: "$x^2$ has $f''=2>0$, concave up" },
      { title: "$-x^2$", background: "$-x^2$ has $f''=-2<0$, concave down", numbers: "$-x^2$ has $f''=-2<0$, concave down" },
      { title: "$x^3$", background: "$x^3$ changes concavity at $0$", numbers: "$x^3$ changes concavity at $0$" },
      { title: "$\\ln x$", background: "$\\ln x$ has $f''=-1/x^2$, so at $2$ it is $-0.25$", numbers: "$\\ln x$ has $f''=-1/x^2$, so at $2$ it is $-0.25$" },
      { title: "$e^x$", background: "$e^x$ has $f''=e^x$, so at $0$ it is $1$", numbers: "$e^x$ has $f''=e^x$, so at $0$ it is $1$" },
      { title: "Cost $q^3$", background: "Cost $q^3$ has marginal cost increasing at rate $6q$, so at $q=2$ the rate is $12$", numbers: "Cost $q^3$ has marginal cost increasing at rate $6q$, so at $q=2$ the rate is $12$" }
    ]
  },
  "math-01-33": {
    connectionsProse: "<p>This lesson builds on critical points and concavity. The second derivative test classifies a flat critical point by the local bending of the graph. It gives a quick alternative to a full sign chart when the curvature is decisive.</p>",
    motivation: "<p>At a critical point with $f'(c)=0$, the linear term in the local approximation disappears. The first nonzero shape information often comes from the quadratic term involving $f''(c)$.</p>" +
                "<p>Positive second derivative bends the graph like a bowl, making nearby values larger than the center. Negative second derivative bends it like a cap, making nearby values smaller than the center.</p>",
    definition: "<p>Central statement: If $f''(c)=0$, the test gives no decision.</p>" +
                "<p><b>Assumptions that matter:</b> Follow the conditions stated in the derivation, including required domains, nonzero denominators, continuity or differentiability hypotheses, interval restrictions, and convergence conditions.</p>",
    symbols: [
      { sym: "$c$", desc: "is critical" },
      { sym: "$h$", desc: "is a small displacement" },
      { sym: "$f''(c)$", desc: "is local curvature" }
    ],
    derivation: [
      { do: "Let $f'(c)=0$", result: "Let $f'(c)=0$", why: "the tangent is flat." },
      { do: "Use the second-order Taylor approximation $f(c+h)\\approx f(c)+\\frac12 f''(c)h^2$.", result: "Use the second-order Taylor approximation $f(c+h)\\approx f(c)+\\frac12 f''(c)h^2$.", why: "" },
      { do: "Since $h^2>0$ for $h\\ne0$, the sign of the change is the sign of $f''(c)$.", result: "Since $h^2>0$ for $h\\ne0$, the sign of the change is the sign of $f''(c)$.", why: "" },
      { do: "If $f''(c)>0$, nearby values are larger, so $c$ is a local minimum.", result: "If $f''(c)>0$, nearby values are larger, so $c$ is a local minimum.", why: "" },
      { do: "If $f''(c)<0$, nearby values are smaller, so $c$ is a local maximum.", result: "If $f''(c)<0$, nearby values are smaller, so $c$ is a local maximum.", why: "" },
      { do: "If $f''(c)=0$, the test gives no decision.", result: "If $f''(c)=0$, the test gives no decision.", why: "" }
    ],
    applications: [
      { title: "$x^2$ at $0$", background: "$x^2$ at $0$ has $f''=2$, minimum", numbers: "$x^2$ at $0$ has $f''=2$, minimum" },
      { title: "$-x^2$ at $0$", background: "$-x^2$ at $0$ has $f''=-2$, maximum", numbers: "$-x^2$ at $0$ has $f''=-2$, maximum" },
      { title: "$x^4$", background: "$x^4$ has $f''(0)=0$, inconclusive but minimum", numbers: "$x^4$ has $f''(0)=0$, inconclusive but minimum" },
      { title: "$x^3$", background: "$x^3$ has $f''(0)=0$, inconclusive and no extremum", numbers: "$x^3$ has $f''(0)=0$, inconclusive and no extremum" },
      { title: "$x^3-3x$", background: "$x^3-3x$ has $f''(-1)=-6$ max and $f''(1)=6$ min", numbers: "$x^3-3x$ has $f''(-1)=-6$ max and $f''(1)=6$ min" },
      { title: "Loss $(w-5)^2$", background: "Loss $(w-5)^2$ has $f''=2$, so $w=5$ is a minimum", numbers: "Loss $(w-5)^2$ has $f''=2$, so $w=5$ is a minimum" }
    ]
  },
  "math-01-34": {
    connectionsProse: "<p>This lesson builds on concavity and the second derivative. Inflection points mark where the bending pattern changes. They help complete a graph's shape beyond just maxima and minima.</p>",
    motivation: "<p>A zero of the second derivative is only a candidate for an inflection point. The graph must actually switch concavity from up to down or from down to up.</p>" +
                "<p>Checking signs on both sides keeps the test honest. If the sign of $f''$ changes, slopes switch from increasing to decreasing or the reverse, and the point is an inflection point.</p>",
    definition: "<p>Central statement: For $f=x^3$, $f''=6x$ changes from negative to positive at $0$.</p>" +
                "<p><b>Assumptions that matter:</b> Follow the conditions stated in the derivation, including required domains, nonzero denominators, continuity or differentiability hypotheses, interval restrictions, and convergence conditions.</p>",
    symbols: [
      { sym: "$f''$", desc: "is curvature" },
      { sym: "sign change", desc: "means crossing from concave up to concave down or back" }
    ],
    derivation: [
      { do: "Concavity is controlled by the sign of $f''$.", result: "Concavity is controlled by the sign of $f''$.", why: "" },
      { do: "A possible inflection point occurs where $f''=0$ or $f''$ is undefined.", result: "A possible inflection point occurs where $f''=0$ or $f''$ is undefined.", why: "" },
      { do: "Check signs on both sides", result: "Check signs on both sides", why: "a zero alone is not enough." },
      { do: "If $f''$ changes sign, slopes switch from increasing to decreasing or vice versa.", result: "If $f''$ changes sign, slopes switch from increasing to decreasing or vice versa.", why: "" },
      { do: "That sign change is an inflection point.", result: "That sign change is an inflection point.", why: "" },
      { do: "For $f=x^3$, $f''=6x$ changes from negative to positive at $0$.", result: "For $f=x^3$, $f''=6x$ changes from negative to positive at $0$.", why: "" }
    ],
    applications: [
      { title: "$x^3$", background: "$x^3$ has inflection at $0$", numbers: "$x^3$ has inflection at $0$" },
      { title: "$x^4$", background: "$x^4$ has $f''(0)=0$ but no inflection", numbers: "$x^4$ has $f''(0)=0$ but no inflection" },
      { title: "Logistic $1/(1+e^{-x})$", background: "Logistic $1/(1+e^{-x})$ has inflection at $0$ with value $0.5$", numbers: "Logistic $1/(1+e^{-x})$ has inflection at $0$ with value $0.5$" },
      { title: "$\\sin x$", background: "$\\sin x$ has inflections at $0$ and $\\pi$ in $[0,\\pi]$", numbers: "$\\sin x$ has inflections at $0$ and $\\pi$ in $[0,\\pi]$" },
      { title: "$x^3-3x$", background: "$x^3-3x$ has inflection at $0$", numbers: "$x^3-3x$ has inflection at $0$" },
      { title: "$\\ln x$", background: "$\\ln x$ has no inflection on $x>0$ because $f''<0$", numbers: "$\\ln x$ has no inflection on $x>0$ because $f''<0$" }
    ]
  },
  "math-01-35": {
    connectionsProse: "<p>This lesson builds on continuity, differentiability, and average rate of change. The Mean Value Theorem connects a secant slope across an interval to a tangent slope inside it. It is one of the main bridges between global change and local derivative information.</p>",
    motivation: "<p>The theorem says that a smooth enough function cannot complete a net change without matching its average rate somewhere along the way. The graph may speed up and slow down, but at some interior point its instantaneous slope equals the secant slope.</p>" +
                "<p>Subtracting the secant line turns the statement into a function with equal endpoint values. Rolle's theorem then supplies a point where the adjusted function has horizontal tangent, which gives the desired slope equality.</p>",
    definition: "<p>Central statement: Since $g'(x)=f'(x)-m$, $f'(c)=m$.</p>" +
                "<p><b>Assumptions that matter:</b> Follow the conditions stated in the derivation, including required domains, nonzero denominators, continuity or differentiability hypotheses, interval restrictions, and convergence conditions.</p>",
    symbols: [
      { sym: "$m$", desc: "is average rate" },
      { sym: "$c$", desc: "is the guaranteed interior point" },
      { sym: "continuity and differentiability", desc: "are the hypotheses" }
    ],
    derivation: [
      { do: "Assume $f$ is continuous on $[a,b]$ and differentiable on $(a,b)$.", result: "Assume $f$ is continuous on $[a,b]$ and differentiable on $(a,b)$.", why: "" },
      { do: "Compute the secant slope $m=\\frac{f(b)-f(a)}{b-a}$.", result: "Compute the secant slope $m=\\frac{f(b)-f(a)}{b-a}$.", why: "" },
      { do: "Build $g(x)=f(x)-[f(a)+m(x-a)]$", result: "Build $g(x)=f(x)-[f(a)+m(x-a)]$", why: "subtract the secant line." },
      { do: "Then $g(a)=0$ and $g(b)=0$.", result: "Then $g(a)=0$ and $g(b)=0$.", why: "" },
      { do: "Rolle's theorem gives some $c$ with $g'(c)=0$.", result: "Rolle's theorem gives some $c$ with $g'(c)=0$.", why: "" },
      { do: "Since $g'(x)=f'(x)-m$, $f'(c)=m$.", result: "Since $g'(x)=f'(x)-m$, $f'(c)=m$.", why: "" }
    ],
    applications: [
      { title: "$f=x^2$ on $[1,3]$", background: "$f=x^2$ on $[1,3]$ has average slope $4$, so $c=2$", numbers: "$f=x^2$ on $[1,3]$ has average slope $4$, so $c=2$" },
      { title: "Application 2", background: "Distance $100$ miles in $2$ hours means some instant speed was $50$ mph", numbers: "Distance $100$ miles in $2$ hours means some instant speed was $50$ mph" },
      { title: "$\\sin x$ on $[0,\\pi]$", background: "$\\sin x$ on $[0,\\pi]$ has average slope $0$, so some $c$ has $\\cos c=0$", numbers: "$\\sin x$ on $[0,\\pi]$ has average slope $0$, so some $c$ has $\\cos c=0$" },
      { title: "$e^x$ on $[0,1]$", background: "$e^x$ on $[0,1]$ has average slope $e-1\\approx1.718$, so $c=\\ln(e-1)\\approx0.541$", numbers: "$e^x$ on $[0,1]$ has average slope $e-1\\approx1.718$, so $c=\\ln(e-1)\\approx0.541$" },
      { title: "If $|f'|\\le3$ over length $4$, output", background: "If $|f'|\\le3$ over length $4$, output changes by at most $12$", numbers: "If $|f'|\\le3$ over length $4$, output changes by at most $12$" },
      { title: "$x^3$ on $[0,2]$", background: "$x^3$ on $[0,2]$ has average slope $4$, so $c=2/\\sqrt3\\approx1.155$", numbers: "$x^3$ on $[0,2]$ has average slope $4$, so $c=2/\\sqrt3\\approx1.155$" }
    ]
  },
  "math-01-36": {
    connectionsProse: "<p>This lesson builds on limits, derivative tests, concavity, and asymptotes. Curve sketching brings those tools together into one organized picture. It is a synthesis skill rather than a new theorem.</p>",
    motivation: "<p>A graph can be understood by collecting reliable clues. Intercepts locate crossings, limits describe end behavior, $f'$ shows increasing and decreasing intervals, and $f''$ shows bending.</p>" +
                "<p>The purpose is to assemble these clues in a fixed order. A careful checklist prevents one feature, such as an intercept or asymptote, from being mistaken for the whole graph.</p>",
    definition: "<p>This is an explain-only lesson: this lesson organizes previous tests. Show a fixed checklist and a worked graph summary rather than forcing a proof.</p>" +
                "<p><b>Assumptions that matter:</b> Use the stated domain, graph, interval, or modeling conditions before applying the classification.</p>",
    symbols: [
      { sym: "Intercepts locate crossings", desc: "Intercepts locate crossings" },
      { sym: "critical points locate flat or sharp candidates", desc: "critical points locate flat or sharp candidates" },
      { sym: "$f'$", desc: "gives increasing/decreasing" },
      { sym: "$f''$", desc: "gives concavity" },
      { sym: "limits", desc: "give end behavior" }
    ],
    applications: [
      { title: "$f=x^3-3x$", background: "$f=x^3-3x$ has critical points $-1,1$ and values $2,-2$", numbers: "$f=x^3-3x$ has critical points $-1,1$ and values $2,-2$" },
      { title: "It", background: "It increases on $(-\\infty,-1)$ and $(1,\\infty)$", numbers: "It increases on $(-\\infty,-1)$ and $(1,\\infty)$" },
      { title: "It", background: "It decreases on $(-1,1)$", numbers: "It decreases on $(-1,1)$" },
      { title: "It", background: "It has inflection at $0$", numbers: "It has inflection at $0$" },
      { title: "$x/(x+1)$", background: "$x/(x+1)$ has vertical asymptote $x=-1$ and horizontal asymptote $y=1$", numbers: "$x/(x+1)$ has vertical asymptote $x=-1$ and horizontal asymptote $y=1$" },
      { title: "$x^2-4$", background: "$x^2-4$ crosses at $x=\\pm2$", numbers: "$x^2-4$ crosses at $x=\\pm2$" }
    ]
  },
  "math-01-37": {
    connectionsProse: "<p>This lesson builds on critical points, endpoints, and derivative tests. Applied optimization translates a real constraint into a one-variable calculus problem. It connects the symbolic tools of the section to decision-making.</p>",
    motivation: "<p>The hardest part is usually modeling. The objective names what should be maximized or minimized, while the constraints describe which values are allowed.</p>" +
                "<p>Once the problem is reduced to one variable on a feasible domain, calculus supplies candidates from critical points and endpoints. Comparing objective values then identifies the best feasible choice.</p>",
    definition: "<p>This is an explain-only lesson: the method is a modeling workflow. Define variables, write the objective, use constraints to reduce to one variable, find candidates, and compare values.</p>" +
                "<p><b>Assumptions that matter:</b> Use the stated domain, graph, interval, or modeling conditions before applying the classification.</p>",
    symbols: [
      { sym: "The objective", desc: "is the quantity optimized" },
      { sym: "constraints restrict allowed values", desc: "constraints restrict allowed values" },
      { sym: "feasible interval", desc: "is the domain that makes sense in context" }
    ],
    applications: [
      { title: "Max area with perimeter $20$: $A=x(10-x)$", background: "Max area with perimeter $20$: $A=x(10-x)$ gives $x=5$, area $25$", numbers: "Max area with perimeter $20$: $A=x(10-x)$ gives $x=5$, area $25$" },
      { title: "Min $x^2+(10-x)^2$", background: "Min $x^2+(10-x)^2$ gives $x=5$, value $50$", numbers: "Min $x^2+(10-x)^2$ gives $x=5$, value $50$" },
      { title: "Revenue $q(100-q)$", background: "Revenue $q(100-q)$ maximizes at $q=50$, revenue $2500$", numbers: "Revenue $q(100-q)$ maximizes at $q=50$, revenue $2500$" },
      { title: "Box volume $x^2(12-4x)$", background: "Box volume $x^2(12-4x)$ maximizes at $x=2$, volume $16$", numbers: "Box volume $x^2(12-4x)$ maximizes at $x=2$, volume $16$" },
      { title: "Closest point on $y=x$ to $(3,0)$", background: "Closest point on $y=x$ to $(3,0)$ is $(1.5,1.5)$ with distance $\\sqrt{4.5}\\approx2.121$", numbers: "Closest point on $y=x$ to $(3,0)$ is $(1.5,1.5)$ with distance $\\sqrt{4.5}\\approx2.121$" },
      { title: "Fence three sides with $60$ feet", background: "Fence three sides with $60$ feet gives dimensions $15$ by $30$, area $450$", numbers: "Fence three sides with $60$ feet gives dimensions $15$ by $30$, area $450$" }
    ]
  },
  "math-01-38": {
    connectionsProse: "<p>This lesson builds on derivative rules, especially the power rule. Antiderivatives reverse differentiation by asking which function has a given derivative. They are the entry point to indefinite integrals and accumulated change.</p>",
    motivation: "<p>Differentiation loses constants because every constant has derivative zero. That is why an antiderivative represents a whole family of functions rather than one function.</p>" +
                "<p>For powers, the reverse power rule is found by undoing the exponent drop and coefficient multiplication. The exception $n=-1$ leads to the logarithm, which becomes its own important antiderivative case.</p>",
    definition: "<p>Central statement: Thus $\\int x^n dx=x^{n+1}/(n+1)+C$.</p>" +
                "<p><b>Assumptions that matter:</b> Follow the conditions stated in the derivation, including required domains, nonzero denominators, continuity or differentiability hypotheses, interval restrictions, and convergence conditions.</p>",
    symbols: [
      { sym: "$F$", desc: "is an antiderivative" },
      { sym: "$C$", desc: "is an arbitrary constant" },
      { sym: "$\\int f(x)dx$", desc: "denotes the family of antiderivatives" }
    ],
    derivation: [
      { do: "Seek $F$ with $F'(x)=x^n$.", result: "Seek $F$ with $F'(x)=x^n$.", why: "" },
      { do: "Use the power rule in reverse", result: "derivative of $x^{n+1}$ is $(n+1)x^n$.", why: "" },
      { do: "Divide by $n+1$ to make the coefficient $1$.", result: "Divide by $n+1$ to make the coefficient $1$.", why: "" },
      { do: "Therefore $F=x^{n+1}/(n+1)$ for $n\\ne-1$.", result: "Therefore $F=x^{n+1}/(n+1)$ for $n\\ne-1$.", why: "" },
      { do: "Add $C$ because constants differentiate to $0$.", result: "Add $C$ because constants differentiate to $0$.", why: "" },
      { do: "Thus $\\int x^n dx=x^{n+1}/(n+1)+C$.", result: "Thus $\\int x^n dx=x^{n+1}/(n+1)+C$.", why: "" }
    ],
    applications: [
      { title: "$\\int x^2dx=x^3/3+C$, from $0$ to $3$", background: "$\\int x^2dx=x^3/3+C$, from $0$ to $3$ gives $9$", numbers: "$\\int x^2dx=x^3/3+C$, from $0$ to $3$ gives $9$" },
      { title: "Application 2", background: "$\\int 2x dx=x^2+C$", numbers: "$\\int 2x dx=x^2+C$" },
      { title: "Application 3", background: "$\\int 1/x dx=\\ln|x|+C$", numbers: "$\\int 1/x dx=\\ln|x|+C$" },
      { title: "Velocity $v=3t^2$", background: "Velocity $v=3t^2$ gives position $t^3+C$", numbers: "Velocity $v=3t^2$ gives position $t^3+C$" },
      { title: "Marginal cost $2q$", background: "Marginal cost $2q$ gives cost $q^2+C$", numbers: "Marginal cost $2q$ gives cost $q^2+C$" },
      { title: "$\\int e^x dx=e^x+C$, increase from $0$ to $1$", background: "$\\int e^x dx=e^x+C$, increase from $0$ to $1$ is $e-1\\approx1.718$", numbers: "$\\int e^x dx=e^x+C$, increase from $0$ to $1$ is $e-1\\approx1.718$" }
    ]
  },
  "math-01-39": {
    connectionsProse: "<p>This lesson builds on area formulas and finite sums. Riemann sums approximate curved area by adding many rectangle areas. They make the definite integral a limit of ordinary arithmetic.</p>",
    motivation: "<p>On each small subinterval, a rectangle uses one sample height to represent the function. Multiplying that height by the width gives a small area contribution.</p>" +
                "<p>As the partition is refined, the rectangles better track the curve. When the sums approach a single value independent of sample choices, that value is the definite integral.</p>",
    definition: "<p>Central statement: The limit is $\\int_a^b f(x)dx$.</p>" +
                "<p><b>Assumptions that matter:</b> Follow the conditions stated in the derivation, including required domains, nonzero denominators, continuity or differentiability hypotheses, interval restrictions, and convergence conditions.</p>",
    symbols: [
      { sym: "$\\Delta x$", desc: "is rectangle width" },
      { sym: "$x_i^*$", desc: "is sample point" },
      { sym: "the summation totals rectangle areas", desc: "the summation totals rectangle areas" }
    ],
    derivation: [
      { do: "Split $[a,b]$ into $n$ pieces of width $\\Delta x=(b-a)/n$.", result: "Split $[a,b]$ into $n$ pieces of width $\\Delta x=(b-a)/n$.", why: "" },
      { do: "Choose a sample point $x_i^*$ in each piece.", result: "Choose a sample point $x_i^*$ in each piece.", why: "" },
      { do: "Rectangle $i$ has area $f(x_i^*)\\Delta x$.", result: "Rectangle $i$ has area $f(x_i^*)\\Delta x$.", why: "" },
      { do: "Add all rectangles", result: "$\\sum_{i=1}^n f(x_i^*)\\Delta x$.", why: "" },
      { do: "Let the largest width go to $0$.", result: "Let the largest width go to $0$.", why: "" },
      { do: "The limit is $\\int_a^b f(x)dx$.", result: "The limit is $\\int_a^b f(x)dx$.", why: "" }
    ],
    applications: [
      { title: "Right sum for $f=x$ on $[0,1]$ with $n=4$", background: "Right sum for $f=x$ on $[0,1]$ with $n=4$ is $(0.25+0.5+0.75+1)0.25=0.625$", numbers: "Right sum for $f=x$ on $[0,1]$ with $n=4$ is $(0.25+0.5+0.75+1)0.25=0.625$" },
      { title: "Left sum", background: "Left sum is $(0+0.25+0.5+0.75)0.25=0.375$", numbers: "Left sum is $(0+0.25+0.5+0.75)0.25=0.375$" },
      { title: "Midpoint sum", background: "Midpoint sum is $0.5$ exactly for $f=x$", numbers: "Midpoint sum is $0.5$ exactly for $f=x$" },
      { title: "Right sum for $x^2$ with $n=2$", background: "Right sum for $x^2$ with $n=2$ is $(0.25+1)0.5=0.625$", numbers: "Right sum for $x^2$ with $n=2$ is $(0.25+1)0.5=0.625$" },
      { title: "Left sum for $x^2$ with $n=2$", background: "Left sum for $x^2$ with $n=2$ is $0.125$", numbers: "Left sum for $x^2$ with $n=2$ is $0.125$" },
      { title: "Exact area under $x$ on $[0,1]$", background: "Exact area under $x$ on $[0,1]$ is $0.5$", numbers: "Exact area under $x$ on $[0,1]$ is $0.5$" }
    ]
  },
  "math-01-40": {
    connectionsProse: "<p>This lesson builds on Riemann sums. The definite integral records signed accumulation over an interval. It turns many small local heights into one total net amount.</p>",
    motivation: "<p>Positive function values contribute positive signed area, while negative values contribute negative signed area. This is why a definite integral can represent net displacement as well as geometric area.</p>" +
                "<p>The definition comes from refining Riemann sums until the accumulated total stabilizes. Constant functions anchor the meaning because height times total width gives the expected rectangle area.</p>",
    definition: "<p>Central statement: This anchors the integral as accumulated height times width.</p>" +
                "<p><b>Assumptions that matter:</b> Follow the conditions stated in the derivation, including required domains, nonzero denominators, continuity or differentiability hypotheses, interval restrictions, and convergence conditions.</p>",
    symbols: [
      { sym: "$a,b$", desc: "are bounds" },
      { sym: "$dx$", desc: "marks the variable and limiting width" },
      { sym: "signed area can be positive, negative, or zero", desc: "signed area can be positive, negative, or zero" }
    ],
    derivation: [
      { do: "Begin with Riemann sums $\\sum f(x_i^*)\\Delta x$", result: "Begin with Riemann sums $\\sum f(x_i^*)\\Delta x$", why: "each term is a small signed rectangle." },
      { do: "Refine the partition so widths shrink.", result: "Refine the partition so widths shrink.", why: "" },
      { do: "If the sums approach one value independent of sample choices, call it $\\int_a^b f(x)dx$.", result: "If the sums approach one value independent of sample choices, call it $\\int_a^b f(x)dx$.", why: "" },
      { do: "For constant $c$, each rectangle has height $c$.", result: "For constant $c$, each rectangle has height $c$.", why: "" },
      { do: "The total is $c\\sum\\Delta x=c(b-a)$.", result: "The total is $c\\sum\\Delta x=c(b-a)$.", why: "" },
      { do: "This anchors the integral as accumulated height times width.", result: "This anchors the integral as accumulated height times width.", why: "" }
    ],
    applications: [
      { title: "Application 1", background: "$\\int_0^3 2dx=6$", numbers: "$\\int_0^3 2dx=6$" },
      { title: "Application 2", background: "$\\int_0^1 xdx=0.5$", numbers: "$\\int_0^1 xdx=0.5$" },
      { title: "Application 3", background: "$\\int_0^2 x^2dx=8/3\\approx2.667$", numbers: "$\\int_0^2 x^2dx=8/3\\approx2.667$" },
      { title: "Application 4", background: "$\\int_0^\\pi\\sin xdx=2$", numbers: "$\\int_0^\\pi\\sin xdx=2$" },
      { title: "Net displacement from $v=t-1$ on $[0,3]$", background: "Net displacement from $v=t-1$ on $[0,3]$ is $1.5$", numbers: "Net displacement from $v=t-1$ on $[0,3]$ is $1.5$" },
      { title: "Average value of $x^2$ on $[0,3]$", background: "Average value of $x^2$ on $[0,3]$ is $3$", numbers: "Average value of $x^2$ on $[0,3]$ is $3$" }
    ]
  },
  "math-01-41": {
    connectionsProse: "<p>This lesson builds on derivatives, antiderivatives, and definite integrals. The Fundamental Theorem of Calculus shows that rate and accumulation are inverse ideas. It is the central connection between differential and integral calculus.</p>",
    motivation: "<p>An accumulation function adds area from a fixed starting point up to a moving endpoint. If the endpoint moves a tiny amount, the new area is a thin strip whose height is approximately the function value at that endpoint.</p>" +
                "<p>This explains why differentiating accumulated area returns the original function. The second part says that definite integrals can be evaluated by any antiderivative, turning accumulation into endpoint subtraction.</p>",
    definition: "<p>Central statement: If $F'=f$, then $\\int_a^b f(x)dx=F(b)-F(a)$.</p>" +
                "<p><b>Assumptions that matter:</b> Follow the conditions stated in the derivation, including required domains, nonzero denominators, continuity or differentiability hypotheses, interval restrictions, and convergence conditions.</p>",
    symbols: [
      { sym: "$A(x)$", desc: "is an accumulation function" },
      { sym: "$F$", desc: "is any antiderivative" },
      { sym: "$a,b$", desc: "are bounds" }
    ],
    derivation: [
      { do: "Define $A(x)=\\int_a^x f(t)dt$", result: "Define $A(x)=\\int_a^x f(t)dt$", why: "accumulated area up to $x$." },
      { do: "The change $A(x+h)-A(x)=\\int_x^{x+h}f(t)dt$", result: "The change $A(x+h)-A(x)=\\int_x^{x+h}f(t)dt$", why: "only the new thin strip remains." },
      { do: "Divide by $h$ to get the average value of $f$ on $[x,x+h]$.", result: "Divide by $h$ to get the average value of $f$ on $[x,x+h]$.", why: "" },
      { do: "Let $h\\to0$", result: "Let $h\\to0$", why: "continuity makes the average value approach $f(x)$." },
      { do: "Thus $A'(x)=f(x)$.", result: "Thus $A'(x)=f(x)$.", why: "" },
      { do: "If $F'=f$, then $\\int_a^b f(x)dx=F(b)-F(a)$.", result: "If $F'=f$, then $\\int_a^b f(x)dx=F(b)-F(a)$.", why: "" }
    ],
    applications: [
      { title: "Application 1", background: "$\\int_0^3 x^2dx=3^3/3=9$", numbers: "$\\int_0^3 x^2dx=3^3/3=9$" },
      { title: "Application 2", background: "$\\frac{d}{dx}\\int_0^x\\cos tdt=\\cos x$", numbers: "$\\frac{d}{dx}\\int_0^x\\cos tdt=\\cos x$" },
      { title: "Application 3", background: "$\\int_1^e 1/x dx=1$", numbers: "$\\int_1^e 1/x dx=1$" },
      { title: "Position change from velocity $2t$ over $[0,4]$", background: "Position change from velocity $2t$ over $[0,4]$ is $16$", numbers: "Position change from velocity $2t$ over $[0,4]$ is $16$" },
      { title: "Accumulated probability density $2x$ on $[0,1]$", background: "Accumulated probability density $2x$ on $[0,1]$ totals $1$", numbers: "Accumulated probability density $2x$ on $[0,1]$ totals $1$" },
      { title: "Application 6", background: "$\\int_0^\\pi\\sin xdx=2$", numbers: "$\\int_0^\\pi\\sin xdx=2$" }
    ]
  },
  "math-01-42": {
    connectionsProse: "<p>This lesson builds on the chain rule and antiderivatives. Substitution is the integration method that recognizes a composition and its derivative. It is the reverse direction of differentiating an outside function of an inside function.</p>",
    motivation: "<p>When an integrand contains an inside expression and a matching derivative factor, the integral is often simpler in a new variable. Naming the inside expression $u$ packages the chain rule structure.</p>" +
                "<p>The differential $du$ carries the derivative factor needed to change variables. After integrating in $u$, substituting back returns the answer in the original variable.</p>",
    definition: "<p>Central statement: Substitute back after integrating.</p>" +
                "<p><b>Assumptions that matter:</b> Follow the conditions stated in the derivation, including required domains, nonzero denominators, continuity or differentiability hypotheses, interval restrictions, and convergence conditions.</p>",
    symbols: [
      { sym: "$u$", desc: "is the new variable" },
      { sym: "$du$ carries the derivative factor", desc: "$du$ carries the derivative factor" },
      { sym: "$C$", desc: "is the constant of integration" }
    ],
    derivation: [
      { do: "Start with the chain rule", result: "$\\frac{d}{dx}F(g(x))=F'(g(x))g'(x)$.", why: "" },
      { do: "Let $f=F'$.", result: "Let $f=F'$.", why: "" },
      { do: "Then $\\int f(g(x))g'(x)dx=F(g(x))+C$.", result: "Then $\\int f(g(x))g'(x)dx=F(g(x))+C$.", why: "" },
      { do: "Name $u=g(x)$ and $du=g'(x)dx$.", result: "Name $u=g(x)$ and $du=g'(x)dx$.", why: "" },
      { do: "The integral becomes $\\int f(u)du$.", result: "The integral becomes $\\int f(u)du$.", why: "" },
      { do: "Substitute back after integrating.", result: "Substitute back after integrating.", why: "" }
    ],
    applications: [
      { title: "Application 1", background: "$\\int 2x\\cos(x^2)dx=\\sin(x^2)+C$", numbers: "$\\int 2x\\cos(x^2)dx=\\sin(x^2)+C$" },
      { title: "From $0$ to $1$, this", background: "From $0$ to $1$, this gives $\\sin1\\approx0.841$", numbers: "From $0$ to $1$, this gives $\\sin1\\approx0.841$" },
      { title: "Application 3", background: "$\\int_0^1 3(3x+1)^2dx=21$", numbers: "$\\int_0^1 3(3x+1)^2dx=21$" },
      { title: "Application 4", background: "$\\int x e^{x^2}dx=\\frac12e^{x^2}+C$", numbers: "$\\int x e^{x^2}dx=\\frac12e^{x^2}+C$" },
      { title: "Application 5", background: "$\\int_0^1 x/(1+x^2)dx=\\frac12\\ln2\\approx0.347$", numbers: "$\\int_0^1 x/(1+x^2)dx=\\frac12\\ln2\\approx0.347$" },
      { title: "Application 6", background: "$\\int_0^2 2x\\sqrt{1+x^2}dx=\\frac23(5^{3/2}-1)\\approx6.787$", numbers: "$\\int_0^2 2x\\sqrt{1+x^2}dx=\\frac23(5^{3/2}-1)\\approx6.787$" }
    ]
  },
  "math-01-43": {
    connectionsProse: "<p>This lesson builds on the product rule and antiderivatives. Integration by parts is used when an integrand is a product but substitution does not remove the difficulty. It transfers differentiation from one factor to another.</p>",
    motivation: "<p>The product rule says the derivative of a product has two terms. Integrating that identity and rearranging gives a way to replace one product integral with another.</p>" +
                "<p>The method depends on choosing $u$ and $dv$ well. A good choice makes $u$ simpler after differentiation and keeps $dv$ easy to integrate.</p>",
    definition: "<p>Central statement: For $\\int x e^x dx$, set $u=x$, $dv=e^x dx$, giving $xe^x-e^x+C$.</p>" +
                "<p><b>Assumptions that matter:</b> Follow the conditions stated in the derivation, including required domains, nonzero denominators, continuity or differentiability hypotheses, interval restrictions, and convergence conditions.</p>",
    symbols: [
      { sym: "$u$", desc: "is the factor differentiated" },
      { sym: "$dv$", desc: "is the factor integrated" },
      { sym: "$du$ and $v$", desc: "are the transformed pieces" }
    ],
    derivation: [
      { do: "Start with the product rule $(uv)'=u'v+uv'$.", result: "Start with the product rule $(uv)'=u'v+uv'$.", why: "" },
      { do: "Integrate both sides", result: "$uv=\\int u'v\\,dx+\\int uv'\\,dx$.", why: "" },
      { do: "Rearrange to isolate one integral.", result: "Rearrange to isolate one integral.", why: "" },
      { do: "Get $\\int u\\,dv=uv-\\int v\\,du$.", result: "Get $\\int u\\,dv=uv-\\int v\\,du$.", why: "" },
      { do: "Choose $u$ to become simpler after differentiating and $dv$ to be easy to integrate.", result: "Choose $u$ to become simpler after differentiating and $dv$ to be easy to integrate.", why: "" },
      { do: "For $\\int x e^x dx$, set $u=x$, $dv=e^x dx$, giving $xe^x-e^x+C$.", result: "For $\\int x e^x dx$, set $u=x$, $dv=e^x dx$, giving $xe^x-e^x+C$.", why: "" }
    ],
    applications: [
      { title: "Application 1", background: "$\\int x e^x dx=e^x(x-1)+C$", numbers: "$\\int x e^x dx=e^x(x-1)+C$" },
      { title: "Application 2", background: "From $0$ to $1$, $\\int_0^1 xe^x dx=1$", numbers: "From $0$ to $1$, $\\int_0^1 xe^x dx=1$" },
      { title: "Application 3", background: "$\\int \\ln x dx=x\\ln x-x+C$", numbers: "$\\int \\ln x dx=x\\ln x-x+C$" },
      { title: "Application 4", background: "$\\int_1^e\\ln x dx=1$", numbers: "$\\int_1^e\\ln x dx=1$" },
      { title: "Application 5", background: "$\\int x\\cos xdx=x\\sin x+\\cos x+C$", numbers: "$\\int x\\cos xdx=x\\sin x+\\cos x+C$" },
      { title: "Application 6", background: "$\\int_0^\\pi x\\sin xdx=\\pi$", numbers: "$\\int_0^\\pi x\\sin xdx=\\pi$" }
    ]
  },
  "math-01-44": {
    connectionsProse: "<p>This lesson builds on trigonometric identities and substitution. Trigonometric integrals often become manageable after powers and products are rewritten. The identities turn oscillating expressions into pieces with known antiderivatives.</p>",
    motivation: "<p>Odd powers allow one factor to be saved for $du$ while the remaining even power is converted with $\\sin^2x+\\cos^2x=1$. Even powers often use half-angle identities to lower the power.</p>" +
                "<p>The goal is not to memorize every integral separately. It is to choose an identity that exposes either a substitution pattern or a simpler standard trigonometric integral.</p>",
    definition: "<p>For $\\int\\sin^3x\\,dx$</p>" +
                "<p><b>Assumptions that matter:</b> Follow the conditions stated in the derivation, including required domains, nonzero denominators, continuity or differentiability hypotheses, interval restrictions, and convergence conditions.</p>",
    symbols: [
      { sym: "Identities such as $\\sin^2x+\\cos^2x=1$ convert powers", desc: "Identities such as $\\sin^2x+\\cos^2x=1$ convert powers" },
      { sym: "$u$", desc: "is the substitution variable" }
    ],
    derivation: [
      { do: "Split $\\sin^3x=\\sin x(1-\\cos^2x)$", result: "Split $\\sin^3x=\\sin x(1-\\cos^2x)$", why: "keep one sine for substitution." },
      { do: "Let $u=\\cos x$, so $du=-\\sin xdx$.", result: "Let $u=\\cos x$, so $du=-\\sin xdx$.", why: "" },
      { do: "Rewrite the integral as $-\\int(1-u^2)du$.", result: "Rewrite the integral as $-\\int(1-u^2)du$.", why: "" },
      { do: "Integrate", result: "$-u+u^3/3+C$.", why: "" },
      { do: "Substitute back", result: "$-\\cos x+\\cos^3x/3+C$.", why: "" }
    ],
    applications: [
      { title: "Application 1", background: "$\\int_0^{\\pi/2}\\sin^3x dx=2/3$", numbers: "$\\int_0^{\\pi/2}\\sin^3x dx=2/3$" },
      { title: "Application 2", background: "$\\int_0^{\\pi/2}\\cos^2x dx=\\pi/4$", numbers: "$\\int_0^{\\pi/2}\\cos^2x dx=\\pi/4$" },
      { title: "Application 3", background: "$\\int_0^{\\pi}\\sin^2x dx=\\pi/2$", numbers: "$\\int_0^{\\pi}\\sin^2x dx=\\pi/2$" },
      { title: "Application 4", background: "$\\int\\sin x\\cos x dx=\\frac12\\sin^2x+C$", numbers: "$\\int\\sin x\\cos x dx=\\frac12\\sin^2x+C$" },
      { title: "Application 5", background: "$\\int_0^{\\pi/2}\\sin x\\cos xdx=0.5$", numbers: "$\\int_0^{\\pi/2}\\sin x\\cos xdx=0.5$" },
      { title: "Average of $\\sin^2x$ over $[0,2\\pi]$", background: "Average of $\\sin^2x$ over $[0,2\\pi]$ is $0.5$", numbers: "Average of $\\sin^2x$ over $[0,2\\pi]$ is $0.5$" }
    ]
  },
  "math-01-45": {
    connectionsProse: "<p>This lesson builds on substitution, trigonometric identities, and right-triangle geometry. Trigonometric substitution handles square roots that resemble Pythagorean forms. It changes an algebraic root into a trigonometric identity.</p>",
    motivation: "<p>Expressions such as $\\sqrt{a^2-x^2}$ match identities like $1-\\sin^2\\thetaheta=\\cos^2\\thetaheta$. Choosing $x=a\\sin\\thetaheta$ makes the square root simplify in the new variable.</p>" +
                "<p>After the integral is evaluated in $\\theta$, a triangle or inverse substitution returns the answer to $x$. The method works because the substitution builds the right triangle into the algebra.</p>",
    definition: "<p>For $\\int\\sqrt{a^2-x^2}dx$</p>" +
                "<p><b>Assumptions that matter:</b> Follow the conditions stated in the derivation, including required domains, nonzero denominators, continuity or differentiability hypotheses, interval restrictions, and convergence conditions.</p>",
    symbols: [
      { sym: "$a$", desc: "is a positive constant" },
      { sym: "$\\theta$", desc: "is the trig angle" },
      { sym: "the triangle relates $x$, $a$, and the remaining root", desc: "the triangle relates $x$, $a$, and the remaining root" }
    ],
    derivation: [
      { do: "Set $x=a\\sin\\theta$", result: "Set $x=a\\sin\\theta$", why: "this matches $1-\\sin^2\\theta$." },
      { do: "Then $dx=a\\cos\\theta d\\theta$.", result: "Then $dx=a\\cos\\theta d\\theta$.", why: "" },
      { do: "The root becomes $\\sqrt{a^2-a^2\\sin^2\\theta}=a\\cos\\theta$ on the chosen interval.", result: "The root becomes $\\sqrt{a^2-a^2\\sin^2\\theta}=a\\cos\\theta$ on the chosen interval.", why: "" },
      { do: "The integral becomes $a^2\\int\\cos^2\\theta d\\theta$.", result: "The integral becomes $a^2\\int\\cos^2\\theta d\\theta$.", why: "" },
      { do: "Use $\\cos^2\\theta=(1+\\cos2\\theta)/2$.", result: "Use $\\cos^2\\theta=(1+\\cos2\\theta)/2$.", why: "" },
      { do: "Integrate and substitute back when needed.", result: "Integrate and substitute back when needed.", why: "" }
    ],
    applications: [
      { title: "Application 1", background: "$\\int_0^1\\sqrt{1-x^2}dx=\\pi/4$", numbers: "$\\int_0^1\\sqrt{1-x^2}dx=\\pi/4$" },
      { title: "Area of unit circle from four quadrants", background: "Area of unit circle from four quadrants is $\\pi$", numbers: "Area of unit circle from four quadrants is $\\pi$" },
      { title: "$\\sqrt{4-x^2}$", background: "$\\sqrt{4-x^2}$ uses $x=2\\sin\\theta$", numbers: "$\\sqrt{4-x^2}$ uses $x=2\\sin\\theta$" },
      { title: "Application 4", background: "At $x=1$ with $a=2$, $\\theta=\\pi/6$", numbers: "At $x=1$ with $a=2$, $\\theta=\\pi/6$" },
      { title: "$\\sqrt{x^2+9}$", background: "$\\sqrt{x^2+9}$ uses $x=3\\tan\\theta$", numbers: "$\\sqrt{x^2+9}$ uses $x=3\\tan\\theta$" },
      { title: "Application 6", background: "$\\int_0^1\\frac{dx}{\\sqrt{1-x^2}}=\\pi/2$", numbers: "$\\int_0^1\\frac{dx}{\\sqrt{1-x^2}}=\\pi/2$" }
    ]
  },
  "math-01-46": {
    connectionsProse: "<p>This lesson builds on rational functions and logarithmic antiderivatives. Partial fractions decompose a complicated rational expression into simpler terms. It is especially useful before integrating rational functions.</p>",
    motivation: "<p>A denominator that factors into simpler pieces suggests writing the fraction as a sum over those pieces. Clearing denominators turns the decomposition into an algebra problem for constants.</p>" +
                "<p>Once those constants are found, each simple fraction can be integrated or analyzed separately. Linear factors usually lead to logarithms, while repeated or irreducible factors have their own standard forms.</p>",
    definition: "<p>For $\\frac{3x+5}{(x+1)(x+2)}$</p>" +
                "<p><b>Assumptions that matter:</b> Follow the conditions stated in the derivation, including required domains, nonzero denominators, continuity or differentiability hypotheses, interval restrictions, and convergence conditions.</p>",
    symbols: [
      { sym: "$A,B$", desc: "are constants to solve" },
      { sym: "factors in the denominator determine the simpler fractions", desc: "factors in the denominator determine the simpler fractions" }
    ],
    derivation: [
      { do: "Assume $\\frac{3x+5}{(x+1)(x+2)}=\\frac{A}{x+1}+\\frac{B}{x+2}$", result: "Assume $\\frac{3x+5}{(x+1)(x+2)}=\\frac{A}{x+1}+\\frac{B}{x+2}$", why: "denominators are linear factors." },
      { do: "Multiply by $(x+1)(x+2)$ to clear denominators.", result: "Multiply by $(x+1)(x+2)$ to clear denominators.", why: "" },
      { do: "Get $3x+5=A(x+2)+B(x+1)$.", result: "Get $3x+5=A(x+2)+B(x+1)$.", why: "" },
      { do: "Substitute $x=-1$ to get $2=A$, because the $B$ term vanishes.", result: "Substitute $x=-1$ to get $2=A$, because the $B$ term vanishes.", why: "" },
      { do: "Substitute $x=-2$ to get $-1=-B$, so $B=1$.", result: "Substitute $x=-2$ to get $-1=-B$, so $B=1$.", why: "" },
      { do: "The decomposition is $2/(x+1)+1/(x+2)$.", result: "The decomposition is $2/(x+1)+1/(x+2)$.", why: "" }
    ],
    applications: [
      { title: "Worked decomposition", background: "Worked decomposition has $A=2,B=1$", numbers: "Worked decomposition has $A=2,B=1$" },
      { title: "Application 2", background: "$\\int \\frac{3x+5}{(x+1)(x+2)}dx=2\\ln|x+1|+\\ln|x+2|+C$", numbers: "$\\int \\frac{3x+5}{(x+1)(x+2)}dx=2\\ln|x+1|+\\ln|x+2|+C$" },
      { title: "Application 3", background: "$1/[x(x+1)]=1/x-1/(x+1)$", numbers: "$1/[x(x+1)]=1/x-1/(x+1)$" },
      { title: "Application 4", background: "$\\int_1^2 1/[x(x+1)]dx=\\ln(4/3)\\approx0.288$", numbers: "$\\int_1^2 1/[x(x+1)]dx=\\ln(4/3)\\approx0.288$" },
      { title: "Application 5", background: "$\\frac{5}{(x-1)(x+4)}=1/(x-1)-1/(x+4)$", numbers: "$\\frac{5}{(x-1)(x+4)}=1/(x-1)-1/(x+4)$" },
      { title: "Application 6", background: "$\\frac{1}{x^2-1}=\\frac12/(x-1)-\\frac12/(x+1)$", numbers: "$\\frac{1}{x^2-1}=\\frac12/(x-1)-\\frac12/(x+1)$" }
    ]
  },
  "math-01-47": {
    connectionsProse: "<p>This lesson builds on definite integrals and limits. Improper integrals extend integration to infinite intervals or unbounded functions. The integral is accepted only if the limiting area is finite.</p>",
    motivation: "<p>An infinite endpoint is handled by replacing it with a finite cutoff. The ordinary definite integral is computed first, and then the cutoff is sent toward infinity.</p>" +
                "<p>Convergence means this limiting process settles to a finite value. Tail behavior controls the outcome, which is why powers like $x^{-p}$ produce a sharp threshold at $p=1$.</p>",
    definition: "<p>For $\\int_1^\\infty x^{-p}dx$</p>" +
                "<p><b>Assumptions that matter:</b> Follow the conditions stated in the derivation, including required domains, nonzero denominators, continuity or differentiability hypotheses, interval restrictions, and convergence conditions.</p>",
    symbols: [
      { sym: "$B$", desc: "is a finite cutoff" },
      { sym: "convergence", desc: "means the cutoff limit exists and is finite" },
      { sym: "$p$ controls tail decay", desc: "$p$ controls tail decay" }
    ],
    derivation: [
      { do: "Replace the infinite upper bound by $B$.", result: "Replace the infinite upper bound by $B$.", why: "" },
      { do: "Integrate $\\int_1^B x^{-p}dx=\\frac{B^{1-p}-1}{1-p}$ for $p\\ne1$.", result: "Integrate $\\int_1^B x^{-p}dx=\\frac{B^{1-p}-1}{1-p}$ for $p\\ne1$.", why: "" },
      { do: "Let $B\\to\\infty$.", result: "Let $B\\to\\infty$.", why: "" },
      { do: "If $p>1$, then $B^{1-p}\\to0$, so the value is $1/(p-1)$.", result: "If $p>1$, then $B^{1-p}\\to0$, so the value is $1/(p-1)$.", why: "" },
      { do: "If $p<1$, the term grows without bound, so the integral diverges.", result: "If $p<1$, the term grows without bound, so the integral diverges.", why: "" },
      { do: "For $p=1$, $\\int_1^B dx/x=\\ln B$ diverges.", result: "For $p=1$, $\\int_1^B dx/x=\\ln B$ diverges.", why: "" }
    ],
    applications: [
      { title: "Application 1", background: "$\\int_1^\\infty x^{-2}dx=1$", numbers: "$\\int_1^\\infty x^{-2}dx=1$" },
      { title: "Application 2", background: "$\\int_1^\\infty x^{-3}dx=0.5$", numbers: "$\\int_1^\\infty x^{-3}dx=0.5$" },
      { title: "Application 3", background: "$\\int_1^\\infty 1/x\\,dx$ diverges", numbers: "$\\int_1^\\infty 1/x\\,dx$ diverges" },
      { title: "Application 4", background: "$\\int_0^1 x^{-1/2}dx=2$", numbers: "$\\int_0^1 x^{-1/2}dx=2$" },
      { title: "Application 5", background: "$\\int_0^1 x^{-2}dx$ diverges", numbers: "$\\int_0^1 x^{-2}dx$ diverges" },
      { title: "Application 6", background: "$\\int_0^\\infty e^{-x}dx=1$", numbers: "$\\int_0^\\infty e^{-x}dx=1$" }
    ]
  },
  "math-01-48": {
    connectionsProse: "<p>This lesson builds on definite integrals as accumulation. Area between curves accumulates the vertical distance between an upper and a lower graph. It turns a geometric region into an integral of height.</p>",
    motivation: "<p>For a thin vertical slice, the width is $dx$ and the height is top minus bottom. Multiplying gives a small rectangle whose area approximates the slice of the region.</p>" +
                "<p>If the curves cross, the identity of top and bottom changes. Splitting at intersection points keeps each integral's height nonnegative and correctly represents the total area.</p>",
    definition: "<p>Central statement: If curves cross, split at intersection points so top and bottom are fixed on each piece.</p>" +
                "<p><b>Assumptions that matter:</b> Follow the conditions stated in the derivation, including required domains, nonzero denominators, continuity or differentiability hypotheses, interval restrictions, and convergence conditions.</p>",
    symbols: [
      { sym: "$f$", desc: "is the upper curve" },
      { sym: "$g$", desc: "is the lower curve" },
      { sym: "$a,b$ bound the region", desc: "$a,b$ bound the region" },
      { sym: "area", desc: "is nonnegative" }
    ],
    derivation: [
      { do: "On a small interval of width $dx$, the vertical height is $f(x)-g(x)$ when $f\\ge g$.", result: "On a small interval of width $dx$, the vertical height is $f(x)-g(x)$ when $f\\ge g$.", why: "" },
      { do: "Small area is approximately $[f(x)-g(x)]dx$.", result: "Small area is approximately $[f(x)-g(x)]dx$.", why: "" },
      { do: "Add across the interval with an integral.", result: "Add across the interval with an integral.", why: "" },
      { do: "Area is $\\int_a^b [f(x)-g(x)]dx$.", result: "Area is $\\int_a^b [f(x)-g(x)]dx$.", why: "" },
      { do: "If curves cross, split at intersection points so top and bottom are fixed on each piece.", result: "If curves cross, split at intersection points so top and bottom are fixed on each piece.", why: "" }
    ],
    applications: [
      { title: "Between $x$ and $x^2$ on $[0,1]$", background: "Between $x$ and $x^2$ on $[0,1]$ is $1/6\\approx0.167$", numbers: "Between $x$ and $x^2$ on $[0,1]$ is $1/6\\approx0.167$" },
      { title: "Between $4$ and $x^2$ on $[-2,2]$", background: "Between $4$ and $x^2$ on $[-2,2]$ is $32/3\\approx10.667$", numbers: "Between $4$ and $x^2$ on $[-2,2]$ is $32/3\\approx10.667$" },
      { title: "Between $2x$ and $x$ on $[0,3]$", background: "Between $2x$ and $x$ on $[0,3]$ is $4.5$", numbers: "Between $2x$ and $x$ on $[0,3]$ is $4.5$" },
      { title: "Between $\\sqrt{x}$ and $x$ on $[0,1]$", background: "Between $\\sqrt{x}$ and $x$ on $[0,1]$ is $1/6$", numbers: "Between $\\sqrt{x}$ and $x$ on $[0,1]$ is $1/6$" },
      { title: "Demand surplus between $10-q$ and $5$ on $[0,5]$", background: "Demand surplus between $10-q$ and $5$ on $[0,5]$ is $12.5$", numbers: "Demand surplus between $10-q$ and $5$ on $[0,5]$ is $12.5$" },
      { title: "Absolute area between $x^2$ and $x$ on $[-1,1]$", background: "Absolute area between $x^2$ and $x$ on $[-1,1]$ is $5/6\\approx0.833$", numbers: "Absolute area between $x^2$ and $x$ on $[-1,1]$ is $5/6\\approx0.833$" }
    ]
  },
  "math-01-49": {
    connectionsProse: "<p>This lesson builds on definite integrals and cross-sectional area. Volumes of revolution come from rotating a region and adding the volumes of thin slices. Disks, washers, and shells are different ways to choose those slices.</p>",
    motivation: "<p>When a vertical slice is rotated about the $x$-axis, it forms a disk if there is no hole and a washer if there is an inner radius. The area of that circular cross-section is then multiplied by the slice thickness.</p>" +
                "<p>The integral adds all slice volumes across the interval. Choosing the slicing direction to match the axis of rotation usually determines whether disks, washers, or shells are simplest.</p>",
    definition: "<p>Central statement: $\\pi\\int(R^2-r^2)dx$.</p>" +
                "<p><b>Assumptions that matter:</b> Follow the conditions stated in the derivation, including required domains, nonzero denominators, continuity or differentiability hypotheses, interval restrictions, and convergence conditions.</p>",
    symbols: [
      { sym: "$R$", desc: "is outer radius" },
      { sym: "$r$", desc: "is inner radius" },
      { sym: "$dx$", desc: "is slice thickness" }
    ],
    derivation: [
      { do: "Rotate $y=f(x)\\ge0$ around the $x$-axis.", result: "Rotate $y=f(x)\\ge0$ around the $x$-axis.", why: "" },
      { do: "A thin slice of width $dx$ becomes a disk.", result: "A thin slice of width $dx$ becomes a disk.", why: "" },
      { do: "Its radius is $f(x)$, so area is $\\pi[f(x)]^2$.", result: "Its radius is $f(x)$, so area is $\\pi[f(x)]^2$.", why: "" },
      { do: "Slice volume is $\\pi[f(x)]^2dx$.", result: "Slice volume is $\\pi[f(x)]^2dx$.", why: "" },
      { do: "Add slices to get $V=\\pi\\int_a^b[f(x)]^2dx$.", result: "Add slices to get $V=\\pi\\int_a^b[f(x)]^2dx$.", why: "" },
      { do: "With an inner radius $g(x)$, subtract to get washers", result: "$\\pi\\int(R^2-r^2)dx$.", why: "" }
    ],
    applications: [
      { title: "Application 1", background: "Rotate $y=x$ on $[0,1]$: $V=\\pi/3\\approx1.047$", numbers: "Rotate $y=x$ on $[0,1]$: $V=\\pi/3\\approx1.047$" },
      { title: "Application 2", background: "Rotate $y=2$ on $[0,3]$: cylinder volume $12\\pi\\approx37.699$", numbers: "Rotate $y=2$ on $[0,3]$: cylinder volume $12\\pi\\approx37.699$" },
      { title: "Washer with $R=3,r=1,h=2$", background: "Washer with $R=3,r=1,h=2$ gives $16\\pi\\approx50.265$", numbers: "Washer with $R=3,r=1,h=2$ gives $16\\pi\\approx50.265$" },
      { title: "Application 4", background: "Rotate $y=\\sqrt{x}$ on $[0,4]$: $8\\pi\\approx25.133$", numbers: "Rotate $y=\\sqrt{x}$ on $[0,4]$: $8\\pi\\approx25.133$" },
      { title: "Cone radius $2$, height $3$", background: "Cone radius $2$, height $3$ has volume $4\\pi\\approx12.566$", numbers: "Cone radius $2$, height $3$ has volume $4\\pi\\approx12.566$" },
      { title: "Shell method for $y=x$ on $[0,1]$ about $y$-axis", background: "Shell method for $y=x$ on $[0,1]$ about $y$-axis gives $2\\pi/3\\approx2.094$", numbers: "Shell method for $y=x$ on $[0,1]$ about $y$-axis gives $2\\pi/3\\approx2.094$" }
    ]
  },
  "math-01-50": {
    connectionsProse: "<p>This lesson builds on derivatives and the Pythagorean theorem. Arc length measures distance along a curve by adding many tiny straight segments. The derivative supplies the local rise for each tiny run.</p>",
    motivation: "<p>A small piece of graph has horizontal change $dx$ and vertical change approximately $f'(x)dx$. Those two changes form the legs of a tiny right triangle.</p>" +
                "<p>Pythagoras gives the segment length, and integration adds those lengths along the interval. The formula reduces to ordinary horizontal length when the slope is zero.</p>",
    definition: "<p>Central statement: Add and refine to get $L=\\int_a^b\\sqrt{1+[f'(x)]^2}dx$.</p>" +
                "<p><b>Assumptions that matter:</b> Follow the conditions stated in the derivation, including required domains, nonzero denominators, continuity or differentiability hypotheses, interval restrictions, and convergence conditions.</p>",
    symbols: [
      { sym: "$ds$", desc: "is a small arc length" },
      { sym: "$f'(x)$", desc: "is local slope" },
      { sym: "$L$", desc: "is total length" }
    ],
    derivation: [
      { do: "Split the curve $y=f(x)$ into short pieces.", result: "Split the curve $y=f(x)$ into short pieces.", why: "" },
      { do: "A small piece has horizontal change $dx$ and vertical change $dy\\approx f'(x)dx$.", result: "A small piece has horizontal change $dx$ and vertical change $dy\\approx f'(x)dx$.", why: "" },
      { do: "Pythagoras gives segment length $ds\\approx\\sqrt{dx^2+dy^2}$.", result: "Pythagoras gives segment length $ds\\approx\\sqrt{dx^2+dy^2}$.", why: "" },
      { do: "Factor $dx$", result: "$ds\\approx\\sqrt{1+[f'(x)]^2}dx$.", why: "" },
      { do: "Add and refine to get $L=\\int_a^b\\sqrt{1+[f'(x)]^2}dx$.", result: "Add and refine to get $L=\\int_a^b\\sqrt{1+[f'(x)]^2}dx$.", why: "" }
    ],
    applications: [
      { title: "Line $y=3x$ on $[0,4]$", background: "Line $y=3x$ on $[0,4]$ has length $4\\sqrt{10}\\approx12.649$", numbers: "Line $y=3x$ on $[0,4]$ has length $4\\sqrt{10}\\approx12.649$" },
      { title: "Horizontal line on length $5$", background: "Horizontal line on length $5$ has arc length $5$", numbers: "Horizontal line on length $5$ has arc length $5$" },
      { title: "$y=x$ on $[0,1]$", background: "$y=x$ on $[0,1]$ has length $\\sqrt2\\approx1.414$", numbers: "$y=x$ on $[0,1]$ has length $\\sqrt2\\approx1.414$" },
      { title: "$y=x^2$ on $[0,1]$", background: "$y=x^2$ on $[0,1]$ has length about $1.479$", numbers: "$y=x^2$ on $[0,1]$ has length about $1.479$" },
      { title: "Parametric unit circle length", background: "Parametric unit circle length is $2\\pi\\approx6.283$", numbers: "Parametric unit circle length is $2\\pi\\approx6.283$" },
      { title: "Training curve with constant speed $0.2$ for $10$ units", background: "Training curve with constant speed $0.2$ for $10$ units has length $2$", numbers: "Training curve with constant speed $0.2$ for $10$ units has length $2$" }
    ]
  },
  "math-01-51": {
    connectionsProse: "<p>This lesson builds on functions, derivatives, and motion. Parametric equations describe coordinates as functions of a third variable, often time. They allow calculus to follow curves that may not be functions of $x$ alone.</p>",
    motivation: "<p>Instead of eliminating the parameter, calculus can compare the component changes directly. The slope $dy/dx$ is the vertical rate divided by the horizontal rate when the horizontal rate is not zero.</p>" +
                "<p>The same viewpoint gives speed, acceleration, second derivatives, and arc length. Parametric form is especially natural for motion, circles, and paths traced over time.</p>",
    definition: "<p>Central statement: $ds=\\sqrt{(x')^2+(y')^2}dt$.</p>" +
                "<p><b>Assumptions that matter:</b> Follow the conditions stated in the derivation, including required domains, nonzero denominators, continuity or differentiability hypotheses, interval restrictions, and convergence conditions.</p>",
    symbols: [
      { sym: "$t$", desc: "is the parameter" },
      { sym: "$x'(t),y'(t)$", desc: "are component velocities" },
      { sym: "$dy/dx$", desc: "is geometric slope" }
    ],
    derivation: [
      { do: "Let $x=x(t)$ and $y=y(t)$.", result: "Let $x=x(t)$ and $y=y(t)$.", why: "" },
      { do: "Small changes satisfy $dx=x'(t)dt$ and $dy=y'(t)dt$.", result: "Small changes satisfy $dx=x'(t)dt$ and $dy=y'(t)dt$.", why: "" },
      { do: "The slope is $dy/dx=(dy/dt)/(dx/dt)$ when $dx/dt\\ne0$.", result: "The slope is $dy/dx=(dy/dt)/(dx/dt)$ when $dx/dt\\ne0$.", why: "" },
      { do: "The second derivative differentiates $dy/dx$ with respect to $t$ and divides by $dx/dt$.", result: "The second derivative differentiates $dy/dx$ with respect to $t$ and divides by $dx/dt$.", why: "" },
      { do: "Arc length follows from Pythagoras", result: "$ds=\\sqrt{(x')^2+(y')^2}dt$.", why: "" }
    ],
    applications: [
      { title: "$x=t^2,y=t^3$", background: "$x=t^2,y=t^3$ gives $dy/dx=3t/2$, at $t=2$ gives $3$", numbers: "$x=t^2,y=t^3$ gives $dy/dx=3t/2$, at $t=2$ gives $3$" },
      { title: "Unit circle $x=\\cos t,y=\\sin t$", background: "Unit circle $x=\\cos t,y=\\sin t$ has slope $-\\cot t$, at $\\pi/4$ gives $-1$", numbers: "Unit circle $x=\\cos t,y=\\sin t$ has slope $-\\cot t$, at $\\pi/4$ gives $-1$" },
      { title: "Speed of $(t,t^2)$ at $1$", background: "Speed of $(t,t^2)$ at $1$ is $\\sqrt5\\approx2.236$", numbers: "Speed of $(t,t^2)$ at $1$ is $\\sqrt5\\approx2.236$" },
      { title: "Circle speed", background: "Circle speed is $1$", numbers: "Circle speed is $1$" },
      { title: "Area for unit circle by parametric formula", background: "Area for unit circle by parametric formula is $\\pi$", numbers: "Area for unit circle by parametric formula is $\\pi$" },
      { title: "Projectile $x=10t,y=20t-5t^2$", background: "Projectile $x=10t,y=20t-5t^2$ has slope $1$ at $t=1$", numbers: "Projectile $x=10t,y=20t-5t^2$ has slope $1$ at $t=1$" }
    ]
  },
  "math-01-52": {
    connectionsProse: "<p>This lesson builds on coordinates and trigonometric geometry. Polar coordinates describe position by distance from the origin and angle. They fit circular, radial, and spiral shapes more directly than rectangular coordinates.</p>",
    motivation: "<p>The conversion formulas $x=r\\cos\\thetaheta$ and $y=r\\sin\\thetaheta$ connect polar coordinates to the usual plane. A polar curve changes radius as the angle changes.</p>" +
                "<p>Area is built from small sectors rather than rectangles. Each sector has area approximately $\\frac12 r^2d\\thetaheta$, and integrating those sector areas gives the polar area formula.</p>",
    definition: "<p>Central statement: $dy/dx=(dy/d\\theta)/(dx/d\\theta)$.</p>" +
                "<p><b>Assumptions that matter:</b> Follow the conditions stated in the derivation, including required domains, nonzero denominators, continuity or differentiability hypotheses, interval restrictions, and convergence conditions.</p>",
    symbols: [
      { sym: "$r$", desc: "is distance from origin" },
      { sym: "$\\theta$", desc: "is angle" },
      { sym: "$d\\theta$", desc: "is small angular width" }
    ],
    derivation: [
      { do: "Coordinates are $x=r\\cos\\theta$ and $y=r\\sin\\theta$.", result: "Coordinates are $x=r\\cos\\theta$ and $y=r\\sin\\theta$.", why: "" },
      { do: "A small sector of radius $r$ and angle $d\\theta$ has area about $\\frac12 r^2d\\theta$.", result: "A small sector of radius $r$ and angle $d\\theta$ has area about $\\frac12 r^2d\\theta$.", why: "" },
      { do: "For a curve $r=f(\\theta)$, add sectors from $\\alpha$ to $\\beta$.", result: "For a curve $r=f(\\theta)$, add sectors from $\\alpha$ to $\\beta$.", why: "" },
      { do: "Area is $A=\\frac12\\int_\\alpha^\\beta r^2d\\theta$.", result: "Area is $A=\\frac12\\int_\\alpha^\\beta r^2d\\theta$.", why: "" },
      { do: "Slope follows from parametric form", result: "$dy/dx=(dy/d\\theta)/(dx/d\\theta)$.", why: "" }
    ],
    applications: [
      { title: "Circle $r=2$ over $[0,2\\pi]$", background: "Circle $r=2$ over $[0,2\\pi]$ has area $4\\pi\\approx12.566$", numbers: "Circle $r=2$ over $[0,2\\pi]$ has area $4\\pi\\approx12.566$" },
      { title: "Unit circle area", background: "Unit circle area is $\\pi$", numbers: "Unit circle area is $\\pi$" },
      { title: "Spiral $r=\\theta$ from $0$ to $1$", background: "Spiral $r=\\theta$ from $0$ to $1$ has area $1/6\\approx0.167$", numbers: "Spiral $r=\\theta$ from $0$ to $1$ has area $1/6\\approx0.167$" },
      { title: "Point $(r,\\theta)=(2,\\pi/3)$", background: "Point $(r,\\theta)=(2,\\pi/3)$ has Cartesian $(1,\\sqrt3)$", numbers: "Point $(r,\\theta)=(2,\\pi/3)$ has Cartesian $(1,\\sqrt3)$" },
      { title: "$r=3\\cos\\theta$", background: "$r=3\\cos\\theta$ is a circle of area $9\\pi/4\\approx7.069$", numbers: "$r=3\\cos\\theta$ is a circle of area $9\\pi/4\\approx7.069$" },
      { title: "Sector radius $5$, angle $0.2$", background: "Sector radius $5$, angle $0.2$ has area $2.5$", numbers: "Sector radius $5$, angle $0.2$ has area $2.5$" }
    ]
  },
  "math-01-53": {
    connectionsProse: "<p>This lesson builds on functions and limits. A sequence is a function whose inputs are positive integers. It provides the language for long-run term behavior before moving to infinite series.</p>",
    motivation: "<p>A sequence limit asks what happens to individual terms as the index grows. This is different from adding the terms; it only tracks where the list entries themselves settle.</p>" +
                "<p>The formal idea of closeness uses a cutoff index. After some sufficiently large $N$, every later term must stay within any chosen tolerance of the proposed limit.</p>",
    definition: "<p>Central statement: Therefore $1/n\\to0$.</p>" +
                "<p><b>Assumptions that matter:</b> Follow the conditions stated in the derivation, including required domains, nonzero denominators, continuity or differentiability hypotheses, interval restrictions, and convergence conditions.</p>",
    symbols: [
      { sym: "$n$", desc: "is the index" },
      { sym: "$a_n$", desc: "is term $n$" },
      { sym: "$L$", desc: "is the sequence limit" },
      { sym: "$N$", desc: "is a cutoff after which terms stay close" }
    ],
    derivation: [
      { do: "A sequence is a function $a_n$ whose input is an integer $n$.", result: "A sequence is a function $a_n$ whose input is an integer $n$.", why: "" },
      { do: "To test $a_n\\to L$, examine $|a_n-L|$ as $n$ grows.", result: "To test $a_n\\to L$, examine $|a_n-L|$ as $n$ grows.", why: "" },
      { do: "For $a_n=1/n$, compute $|1/n-0|=1/n$.", result: "For $a_n=1/n$, compute $|1/n-0|=1/n$.", why: "" },
      { do: "Given any tolerance $\\varepsilon>0$, choose $N>1/\\varepsilon$.", result: "Given any tolerance $\\varepsilon>0$, choose $N>1/\\varepsilon$.", why: "" },
      { do: "Then for $n>N$, $1/n<\\varepsilon$.", result: "Then for $n>N$, $1/n<\\varepsilon$.", why: "" },
      { do: "Therefore $1/n\\to0$.", result: "Therefore $1/n\\to0$.", why: "" }
    ],
    applications: [
      { title: "Application 1", background: "$a_{10}=0.1$ for $a_n=1/n$", numbers: "$a_{10}=0.1$ for $a_n=1/n$" },
      { title: "$2^n$", background: "$2^n$ has $a_5=32$", numbers: "$2^n$ has $a_5=32$" },
      { title: "Geometric $0.5^n$", background: "Geometric $0.5^n$ has $a_4=0.0625$", numbers: "Geometric $0.5^n$ has $a_4=0.0625$" },
      { title: "Arithmetic $3+2n$", background: "Arithmetic $3+2n$ has $a_{10}=23$", numbers: "Arithmetic $3+2n$ has $a_{10}=23$" },
      { title: "Running error $0.9^n$ after $20$ steps", background: "Running error $0.9^n$ after $20$ steps is $0.122$", numbers: "Running error $0.9^n$ after $20$ steps is $0.122$" },
      { title: "Sequence $(n+1)/n$", background: "Sequence $(n+1)/n$ tends to $1$ and has term $1.1$ at $n=10$", numbers: "Sequence $(n+1)/n$ tends to $1$ and has term $1.1$ at $n=10$" }
    ]
  },
  "math-01-54": {
    connectionsProse: "<p>This lesson builds on sequences and finite sums. A series adds sequence terms and studies the behavior of the running totals. It asks whether infinitely many additions can approach a finite value.</p>",
    motivation: "<p>Partial sums are the bridge from finite arithmetic to infinite series. Each partial sum is ordinary addition, and convergence means those partial sums settle toward one number.</p>" +
                "<p>For convergence, the terms must at least approach zero; otherwise each new addition remains too large for the totals to settle. That condition is necessary but not sufficient, as the harmonic series shows.</p>",
    definition: "<p>Central statement: harmonic terms $1/n$ approach $0$ but the series diverges.</p>" +
                "<p><b>Assumptions that matter:</b> Follow the conditions stated in the derivation, including required domains, nonzero denominators, continuity or differentiability hypotheses, interval restrictions, and convergence conditions.</p>",
    symbols: [
      { sym: "$a_n$", desc: "is the term" },
      { sym: "$s_n$", desc: "is the partial sum" },
      { sym: "$\\sum$", desc: "denotes repeated addition" }
    ],
    derivation: [
      { do: "Start with terms $a_1,a_2,\\dots$.", result: "Start with terms $a_1,a_2,\\dots$.", why: "" },
      { do: "Define partial sums $s_n=a_1+\\cdots+a_n$", result: "Define partial sums $s_n=a_1+\\cdots+a_n$", why: "these are finite totals." },
      { do: "The infinite series $\\sum a_n$ converges if $s_n$ has a finite limit.", result: "The infinite series $\\sum a_n$ converges if $s_n$ has a finite limit.", why: "" },
      { do: "If $a_n$ does not approach $0$, then partial sums cannot settle.", result: "If $a_n$ does not approach $0$, then partial sums cannot settle.", why: "" },
      { do: "Therefore $a_n\\to0$ is necessary for convergence.", result: "Therefore $a_n\\to0$ is necessary for convergence.", why: "" },
      { do: "It is not sufficient", result: "harmonic terms $1/n$ approach $0$ but the series diverges.", why: "" }
    ],
    applications: [
      { title: "Application 1", background: "$\\sum_{n=1}^3 n=6$", numbers: "$\\sum_{n=1}^3 n=6$" },
      { title: "Application 2", background: "$\\sum_{n=1}^{10}1=10$", numbers: "$\\sum_{n=1}^{10}1=10$" },
      { title: "Partial sum of $1/2^n$ through $n=4$", background: "Partial sum of $1/2^n$ through $n=4$ is $0.9375$", numbers: "Partial sum of $1/2^n$ through $n=4$ is $0.9375$" },
      { title: "Harmonic partial sum through $4$", background: "Harmonic partial sum through $4$ is $25/12\\approx2.083$", numbers: "Harmonic partial sum through $4$ is $25/12\\approx2.083$" },
      { title: "Alternating $1-1+1-1$", background: "Alternating $1-1+1-1$ has partial sums $1,0,1,0$ and no ordinary limit", numbers: "Alternating $1-1+1-1$ has partial sums $1,0,1,0$ and no ordinary limit" },
      { title: "Application 6", background: "$\\sum_{n=1}^\\infty 1/n^2=\\pi^2/6\\approx1.645$", numbers: "$\\sum_{n=1}^\\infty 1/n^2=\\pi^2/6\\approx1.645$" }
    ]
  },
  "math-01-55": {
    connectionsProse: "<p>This lesson builds on series and repeated multiplication. A geometric series adds powers of a fixed ratio. It is the basic model for shrinking tails, discounts, repeated errors, and many convergence comparisons.</p>",
    motivation: "<p>The partial sum has a special cancellation pattern. Multiplying the sum by the common ratio lines up nearly all terms, and subtracting removes the middle powers.</p>" +
                "<p>The infinite sum exists exactly when the powers of the ratio shrink to zero. If $|r|<1$, the tail disappears in the limit; if not, the partial sums do not settle in the same way.</p>",
    definition: "<p>Central statement: If $|r|<1$, then $r^{n+1}\\to0$, so $\\sum_{n=0}^\\infty r^n=1/(1-r)$.</p>" +
                "<p><b>Assumptions that matter:</b> Follow the conditions stated in the derivation, including required domains, nonzero denominators, continuity or differentiability hypotheses, interval restrictions, and convergence conditions.</p>",
    symbols: [
      { sym: "$r$", desc: "is common ratio" },
      { sym: "$S_n$", desc: "is partial sum" },
      { sym: "convergence requires $|r|<1$", desc: "convergence requires $|r|<1$" }
    ],
    derivation: [
      { do: "Let $S_n=1+r+r^2+\\cdots+r^n$.", result: "Let $S_n=1+r+r^2+\\cdots+r^n$.", why: "" },
      { do: "Multiply by $r$", result: "$rS_n=r+r^2+\\cdots+r^{n+1}$.", why: "" },
      { do: "Subtract", result: "$S_n-rS_n=1-r^{n+1}$", why: "all middle terms cancel." },
      { do: "Factor", result: "$S_n(1-r)=1-r^{n+1}$.", why: "" },
      { do: "Divide", result: "$S_n=(1-r^{n+1})/(1-r)$.", why: "" },
      { do: "If $|r|<1$, then $r^{n+1}\\to0$, so $\\sum_{n=0}^\\infty r^n=1/(1-r)$.", result: "If $|r|<1$, then $r^{n+1}\\to0$, so $\\sum_{n=0}^\\infty r^n=1/(1-r)$.", why: "" }
    ],
    applications: [
      { title: "Application 1", background: "$1+1/2+1/4+\\cdots=2$", numbers: "$1+1/2+1/4+\\cdots=2$" },
      { title: "Application 2", background: "$\\sum_{n=0}^\\infty 0.9^n=10$", numbers: "$\\sum_{n=0}^\\infty 0.9^n=10$" },
      { title: "Discounted reward with reward $5$ and $\\gamma=0.8$", background: "Discounted reward with reward $5$ and $\\gamma=0.8$ totals $25$", numbers: "Discounted reward with reward $5$ and $\\gamma=0.8$ totals $25$" },
      { title: "Application 4", background: "Repeated error $0.5^n$ sums to $2$", numbers: "Repeated error $0.5^n$ sums to $2$" },
      { title: "Partial sum for $r=0.5,n=3$", background: "Partial sum for $r=0.5,n=3$ is $1.875$", numbers: "Partial sum for $r=0.5,n=3$ is $1.875$" },
      { title: "$1+2+4+\\cdots$", background: "$1+2+4+\\cdots$ diverges because $|r|=2$", numbers: "$1+2+4+\\cdots$ diverges because $|r|=2$" }
    ]
  },
  "math-01-56": {
    connectionsProse: "<p>This lesson builds on series, geometric behavior, and improper integrals. Convergence tests compare an unfamiliar series to behavior that is already understood. Different tests match different term patterns.</p>",
    motivation: "<p>The ratio test looks at how consecutive terms compare. If the terms eventually shrink like a geometric series with ratio below one, the series converges absolutely.</p>" +
                "<p>No single test solves every series. Positive-term comparisons, $p$-series, alternating signs, ratios, roots, and integral-like tails each provide a different lens for deciding convergence.</p>",
    definition: "<p>Ratio test</p>" +
                "<p><b>Assumptions that matter:</b> Follow the conditions stated in the derivation, including required domains, nonzero denominators, continuity or differentiability hypotheses, interval restrictions, and convergence conditions.</p>",
    symbols: [
      { sym: "$a_n$", desc: "is the term" },
      { sym: "$L$", desc: "is the limiting ratio or root" },
      { sym: "absolute convergence", desc: "means $\\sum|a_n|$ converges" }
    ],
    derivation: [
      { do: "Suppose $\\lim_{n\\to\\infty}|a_{n+1}/a_n|=L$.", result: "Suppose $\\lim_{n\\to\\infty}|a_{n+1}/a_n|=L$.", why: "" },
      { do: "For large $n$, terms behave roughly like repeated multiplication by $L$.", result: "For large $n$, terms behave roughly like repeated multiplication by $L$.", why: "" },
      { do: "If $L<1$, compare to a geometric series with ratio below $1$, so the series converges absolutely.", result: "If $L<1$, compare to a geometric series with ratio below $1$, so the series converges absolutely.", why: "" },
      { do: "If $L>1$, terms do not shrink fast enough and the series diverges.", result: "If $L>1$, terms do not shrink fast enough and the series diverges.", why: "" },
      { do: "If $L=1$, the test gives no decision.", result: "If $L=1$, the test gives no decision.", why: "" },
      { do: "For $a_n=1/n!$, the ratio is $1/(n+1)\\to0$, so it converges.", result: "For $a_n=1/n!$, the ratio is $1/(n+1)\\to0$, so it converges.", why: "" }
    ],
    applications: [
      { title: "$\\sum1/n!$", background: "$\\sum1/n!$ converges by ratio limit $0$", numbers: "$\\sum1/n!$ converges by ratio limit $0$" },
      { title: "$\\sum2^n/n!$", background: "$\\sum2^n/n!$ converges by ratio limit $0$", numbers: "$\\sum2^n/n!$ converges by ratio limit $0$" },
      { title: "$\\sum1/n^2$", background: "$\\sum1/n^2$ converges by $p=2>1$", numbers: "$\\sum1/n^2$ converges by $p=2>1$" },
      { title: "$\\sum1/n$", background: "$\\sum1/n$ diverges by $p=1$", numbers: "$\\sum1/n$ diverges by $p=1$" },
      { title: "$\\sum(-1)^{n+1}/n$", background: "$\\sum(-1)^{n+1}/n$ converges conditionally by alternating test", numbers: "$\\sum(-1)^{n+1}/n$ converges conditionally by alternating test" },
      { title: "$\\sum n/2^n$", background: "$\\sum n/2^n$ converges by ratio limit $1/2$", numbers: "$\\sum n/2^n$ converges by ratio limit $1/2$" }
    ]
  },
  "math-01-57": {
    connectionsProse: "<p>This lesson builds on series and functions of a variable. A power series is an infinite polynomial centered at a point. Inside its interval of convergence, it behaves like an ordinary function that can often be differentiated or integrated term by term.</p>",
    motivation: "<p>The powers $(x-a)^n$ measure distance from the center. Coefficients determine how strongly each power contributes, but convergence depends on how those coefficients balance the growing powers.</p>" +
                "<p>The ratio test usually reveals a radius around the center where the series converges. Endpoints require separate checks because the ratio test often becomes inconclusive there.</p>",
    definition: "<p>Central statement: Endpoints $x=a\\pm R$ must be tested separately.</p>" +
                "<p><b>Assumptions that matter:</b> Follow the conditions stated in the derivation, including required domains, nonzero denominators, continuity or differentiability hypotheses, interval restrictions, and convergence conditions.</p>",
    symbols: [
      { sym: "$c_n$", desc: "are coefficients" },
      { sym: "$a$", desc: "is center" },
      { sym: "$R$", desc: "is radius of convergence" }
    ],
    derivation: [
      { do: "Write $\\sum c_n(x-a)^n$", result: "Write $\\sum c_n(x-a)^n$", why: "powers are centered at $a$." },
      { do: "Apply the ratio test to terms $c_n(x-a)^n$.", result: "Apply the ratio test to terms $c_n(x-a)^n$.", why: "" },
      { do: "The limiting ratio often has the form $L|x-a|$.", result: "The limiting ratio often has the form $L|x-a|$.", why: "" },
      { do: "Convergence occurs when $L|x-a|<1$.", result: "Convergence occurs when $L|x-a|<1$.", why: "" },
      { do: "This gives a radius $R=1/L$.", result: "This gives a radius $R=1/L$.", why: "" },
      { do: "Endpoints $x=a\\pm R$ must be tested separately.", result: "Endpoints $x=a\\pm R$ must be tested separately.", why: "" }
    ],
    applications: [
      { title: "$\\sum x^n$", background: "$\\sum x^n$ has radius $1$", numbers: "$\\sum x^n$ has radius $1$" },
      { title: "At $x=0.5$, sum", background: "At $x=0.5$, sum is $2$", numbers: "At $x=0.5$, sum is $2$" },
      { title: "Application 3", background: "At $x=1$, $\\sum1$ diverges", numbers: "At $x=1$, $\\sum1$ diverges" },
      { title: "$\\sum x^n/n!$", background: "$\\sum x^n/n!$ has infinite radius", numbers: "$\\sum x^n/n!$ has infinite radius" },
      { title: "$\\sum n x^n$", background: "$\\sum n x^n$ has radius $1$", numbers: "$\\sum n x^n$ has radius $1$" },
      { title: "$\\sum (x-2)^n/3^n$", background: "$\\sum (x-2)^n/3^n$ has radius $3$", numbers: "$\\sum (x-2)^n/3^n$ has radius $3$" }
    ]
  },
  "math-01-58": {
    connectionsProse: "<p>This lesson builds on power series and derivatives. Taylor series choose coefficients so an infinite polynomial matches a function's derivatives at one point. They turn local derivative data into an approximating function.</p>",
    motivation: "<p>The constant term must match the function value at the center. The linear coefficient must match the slope, the quadratic coefficient must match curvature after accounting for $2!$, and the pattern continues for higher derivatives.</p>" +
                "<p>Taylor series explain why local polynomial approximations work. Each added term matches one more derivative at the center, improving the local description when the series converges to the function.</p>",
    definition: "<p>Central statement: Therefore $c_n=f^{(n)}(a)/n!$.</p>" +
                "<p><b>Assumptions that matter:</b> Follow the conditions stated in the derivation, including required domains, nonzero denominators, continuity or differentiability hypotheses, interval restrictions, and convergence conditions.</p>",
    symbols: [
      { sym: "$a$", desc: "is center" },
      { sym: "$f^{(n)}(a)$", desc: "is the $n$th derivative at $a$" },
      { sym: "$n!$ counts the repeated differentiation factor", desc: "$n!$ counts the repeated differentiation factor" }
    ],
    derivation: [
      { do: "Seek $f(x)=\\sum_{n=0}^\\infty c_n(x-a)^n$.", result: "Seek $f(x)=\\sum_{n=0}^\\infty c_n(x-a)^n$.", why: "" },
      { do: "Set $x=a$ to get $c_0=f(a)$.", result: "Set $x=a$ to get $c_0=f(a)$.", why: "" },
      { do: "Differentiate once and set $x=a$ to get $c_1=f'(a)$.", result: "Differentiate once and set $x=a$ to get $c_1=f'(a)$.", why: "" },
      { do: "Differentiate twice and set $x=a$ to get $2!c_2=f''(a)$.", result: "Differentiate twice and set $x=a$ to get $2!c_2=f''(a)$.", why: "" },
      { do: "After $n$ derivatives, $n!c_n=f^{(n)}(a)$.", result: "After $n$ derivatives, $n!c_n=f^{(n)}(a)$.", why: "" },
      { do: "Therefore $c_n=f^{(n)}(a)/n!$.", result: "Therefore $c_n=f^{(n)}(a)/n!$.", why: "" }
    ],
    applications: [
      { title: "Application 1", background: "$e^x=1+x+x^2/2+x^3/6+\\cdots$", numbers: "$e^x=1+x+x^2/2+x^3/6+\\cdots$" },
      { title: "At $x=1$, cubic Taylor", background: "At $x=1$, cubic Taylor gives $2.667$ versus $e\\approx2.718$", numbers: "At $x=1$, cubic Taylor gives $2.667$ versus $e\\approx2.718$" },
      { title: "$\\ln x$ about $1$", background: "$\\ln x$ about $1$ has first terms $(x-1)-(x-1)^2/2$", numbers: "$\\ln x$ about $1$ has first terms $(x-1)-(x-1)^2/2$" },
      { title: "For $\\sqrt{x}$ about $4$, linear term", background: "For $\\sqrt{x}$ about $4$, linear term is $2+(x-4)/4$", numbers: "For $\\sqrt{x}$ about $4$, linear term is $2+(x-4)/4$" },
      { title: "$\\cos x$ quadratic near $0$", background: "$\\cos x$ quadratic near $0$ is $1-x^2/2$", numbers: "$\\cos x$ quadratic near $0$ is $1-x^2/2$" },
      { title: "$\\sin(0.1)$ cubic", background: "$\\sin(0.1)$ cubic gives $0.099833$", numbers: "$\\sin(0.1)$ cubic gives $0.099833$" }
    ]
  },
  "math-01-59": {
    connectionsProse: "<p>This lesson builds on Taylor series. A Maclaurin series is simply a Taylor series centered at zero. This center is especially convenient for common functions near the origin.</p>",
    motivation: "<p>Setting the center to zero simplifies the powers to $x^n$. For functions such as sine, cosine, and the exponential, derivatives at zero create recognizable coefficient patterns.</p>" +
                "<p>Maclaurin series are useful both for approximation and for understanding function behavior near zero. Keeping only the first few terms gives practical numerical estimates with controlled local meaning.</p>",
    definition: "<p>Central statement: Therefore $\\sin x=x-x^3/3!+x^5/5!-\\cdots$.</p>" +
                "<p><b>Assumptions that matter:</b> Follow the conditions stated in the derivation, including required domains, nonzero denominators, continuity or differentiability hypotheses, interval restrictions, and convergence conditions.</p>",
    symbols: [
      { sym: "Maclaurin", desc: "means centered at $0$" },
      { sym: "factorials scale derivative coefficients", desc: "factorials scale derivative coefficients" },
      { sym: "powers of $x$ measure distance from $0$", desc: "powers of $x$ measure distance from $0$" }
    ],
    derivation: [
      { do: "Start from Taylor coefficients $f^{(n)}(a)/n!$.", result: "Start from Taylor coefficients $f^{(n)}(a)/n!$.", why: "" },
      { do: "Set $a=0$", result: "Set $a=0$", why: "the center is the origin." },
      { do: "Get $f(x)=\\sum_{n=0}^\\infty f^{(n)}(0)x^n/n!$.", result: "Get $f(x)=\\sum_{n=0}^\\infty f^{(n)}(0)x^n/n!$.", why: "" },
      { do: "For $\\sin x$, derivatives cycle through $\\sin,\\cos,-\\sin,-\\cos$.", result: "For $\\sin x$, derivatives cycle through $\\sin,\\cos,-\\sin,-\\cos$.", why: "" },
      { do: "At $0$, the nonzero coefficients occur at odd powers with alternating signs.", result: "At $0$, the nonzero coefficients occur at odd powers with alternating signs.", why: "" },
      { do: "Therefore $\\sin x=x-x^3/3!+x^5/5!-\\cdots$.", result: "Therefore $\\sin x=x-x^3/3!+x^5/5!-\\cdots$.", why: "" }
    ],
    applications: [
      { title: "$e^1$ with terms through $x^4$", background: "$e^1$ with terms through $x^4$ gives $2.708$", numbers: "$e^1$ with terms through $x^4$ gives $2.708$" },
      { title: "$\\sin(0.5)$ through $x^5$", background: "$\\sin(0.5)$ through $x^5$ gives $0.479427$", numbers: "$\\sin(0.5)$ through $x^5$ gives $0.479427$" },
      { title: "$\\cos(0.5)$ through $x^4$", background: "$\\cos(0.5)$ through $x^4$ gives $0.877604$", numbers: "$\\cos(0.5)$ through $x^4$ gives $0.877604$" },
      { title: "$\\ln(1+0.5)$ through cubic", background: "$\\ln(1+0.5)$ through cubic gives $0.416667$", numbers: "$\\ln(1+0.5)$ through cubic gives $0.416667$" },
      { title: "Application 5", background: "$1/(1-x)$ at $x=0.25$ sums to $1.333$", numbers: "$1/(1-x)$ at $x=0.25$ sums to $1.333$" },
      { title: "$e^{-0.1}$ quadratic", background: "$e^{-0.1}$ quadratic gives $0.905$", numbers: "$e^{-0.1}$ quadratic gives $0.905$" }
    ]
  },
  "math-01-60": {
    connectionsProse: "<p>This lesson builds on derivatives and Taylor expansions. Numerical differentiation estimates slopes when a formula derivative is unavailable or when function values come from data. The method turns sampled values into approximate rates.</p>",
    motivation: "<p>A forward difference uses the slope of a small secant line. Taylor expansion shows that it equals the true derivative plus an error term proportional to the step size.</p>" +
                "<p>A central difference samples symmetrically on both sides, which cancels more of the error. Very small steps can still suffer from rounding, so practical numerical differentiation balances two kinds of error.</p>",
    definition: "<p>Central statement: Divide by $2h$ to get central difference $[f(x+h)-f(x-h)]/(2h)=f'(x)+O(h^2)$.</p>" +
                "<p><b>Assumptions that matter:</b> Follow the conditions stated in the derivation, including required domains, nonzero denominators, continuity or differentiability hypotheses, interval restrictions, and convergence conditions.</p>",
    symbols: [
      { sym: "$h$", desc: "is step size" },
      { sym: "truncation error comes from omitted Taylor terms", desc: "truncation error comes from omitted Taylor terms" },
      { sym: "central difference uses symmetric samples", desc: "central difference uses symmetric samples" }
    ],
    derivation: [
      { do: "Taylor expand $f(x+h)=f(x)+hf'(x)+h^2f''(x)/2+O(h^3)$.", result: "Taylor expand $f(x+h)=f(x)+hf'(x)+h^2f''(x)/2+O(h^3)$.", why: "" },
      { do: "Subtract $f(x)$ and divide by $h$.", result: "Subtract $f(x)$ and divide by $h$.", why: "" },
      { do: "Get forward difference $[f(x+h)-f(x)]/h=f'(x)+h f''(x)/2+O(h^2)$.", result: "Get forward difference $[f(x+h)-f(x)]/h=f'(x)+h f''(x)/2+O(h^2)$.", why: "" },
      { do: "Expand $f(x-h)=f(x)-hf'(x)+h^2f''(x)/2+O(h^3)$.", result: "Expand $f(x-h)=f(x)-hf'(x)+h^2f''(x)/2+O(h^3)$.", why: "" },
      { do: "Subtract the backward expansion from the forward expansion.", result: "Subtract the backward expansion from the forward expansion.", why: "" },
      { do: "Divide by $2h$ to get central difference $[f(x+h)-f(x-h)]/(2h)=f'(x)+O(h^2)$.", result: "Divide by $2h$ to get central difference $[f(x+h)-f(x-h)]/(2h)=f'(x)+O(h^2)$.", why: "" }
    ],
    applications: [
      { title: "Forward difference for $x^2$ at $3$, $h=0.01$,", background: "Forward difference for $x^2$ at $3$, $h=0.01$, gives $6.01$", numbers: "Forward difference for $x^2$ at $3$, $h=0.01$, gives $6.01$" },
      { title: "Central difference", background: "Central difference gives exactly $6$ for $x^2$", numbers: "Central difference gives exactly $6$ for $x^2$" },
      { title: "Forward difference for $\\sin x$ at $0$, $h=0.01$,", background: "Forward difference for $\\sin x$ at $0$, $h=0.01$, gives $0.999983$", numbers: "Forward difference for $\\sin x$ at $0$, $h=0.01$, gives $0.999983$" },
      { title: "Central difference for $\\sin x$ at $0$, $h=0.01$,", background: "Central difference for $\\sin x$ at $0$, $h=0.01$, gives $0.999983$", numbers: "Central difference for $\\sin x$ at $0$, $h=0.01$, gives $0.999983$" },
      { title: "Gradient check for $(w-2)^2$ at $3$, $h=0.001$,", background: "Gradient check for $(w-2)^2$ at $3$, $h=0.001$, gives $2.001$ forward", numbers: "Gradient check for $(w-2)^2$ at $3$, $h=0.001$, gives $2.001$ forward" },
      { title: "Central check for the same", background: "Central check for the same gives $2$", numbers: "Central check for the same gives $2$" }
    ]
  },
  "math-01-61": {
    connectionsProse: "<p>This lesson builds on definite integrals and polynomial approximation. Numerical integration estimates accumulated area from finitely many sampled values. It is used when exact antiderivatives are unavailable or unnecessary.</p>",
    motivation: "<p>Rectangle rules use simple constant approximations, while the trapezoid rule replaces the curve by line segments between endpoints. Simpson's rule goes further by fitting a quadratic over pairs of subintervals.</p>" +
                "<p>Better local shape matching usually improves accuracy for smooth functions. The integral is still an accumulation idea: each rule assigns an approximate area to small pieces and then adds them.</p>",
    definition: "<p>Central statement: For one pair, the area is $h[f(x_0)+4f(x_1)+f(x_2)]/3$.</p>" +
                "<p><b>Assumptions that matter:</b> Follow the conditions stated in the derivation, including required domains, nonzero denominators, continuity or differentiability hypotheses, interval restrictions, and convergence conditions.</p>",
    symbols: [
      { sym: "$h$", desc: "is subinterval width" },
      { sym: "trapezoid rule uses endpoints", desc: "trapezoid rule uses endpoints" },
      { sym: "Simpson's rule uses endpoint-midpoint-endpoint weights $1,4,1$", desc: "Simpson's rule uses endpoint-midpoint-endpoint weights $1,4,1$" }
    ],
    derivation: [
      { do: "Split $[a,b]$ into subintervals of width $h$.", result: "Split $[a,b]$ into subintervals of width $h$.", why: "" },
      { do: "On one subinterval, approximate the curve by the line through endpoint values.", result: "On one subinterval, approximate the curve by the line through endpoint values.", why: "" },
      { do: "The trapezoid area is $h[f(x_i)+f(x_{i+1})]/2$.", result: "The trapezoid area is $h[f(x_i)+f(x_{i+1})]/2$.", why: "" },
      { do: "Add trapezoids over all subintervals.", result: "Add trapezoids over all subintervals.", why: "" },
      { do: "Simpson's rule fits a quadratic through two subintervals.", result: "Simpson's rule fits a quadratic through two subintervals.", why: "" },
      { do: "For one pair, the area is $h[f(x_0)+4f(x_1)+f(x_2)]/3$.", result: "For one pair, the area is $h[f(x_0)+4f(x_1)+f(x_2)]/3$.", why: "" }
    ],
    applications: [
      { title: "Trapezoid for $x^2$ on $[0,1]$ with one panel", background: "Trapezoid for $x^2$ on $[0,1]$ with one panel gives $0.5$", numbers: "Trapezoid for $x^2$ on $[0,1]$ with one panel gives $0.5$" },
      { title: "Simpson for $x^2$ on $[0,1]$", background: "Simpson for $x^2$ on $[0,1]$ gives $1/3$", numbers: "Simpson for $x^2$ on $[0,1]$ gives $1/3$" },
      { title: "Trapezoid with two panels for $x^2$", background: "Trapezoid with two panels for $x^2$ gives $0.375$", numbers: "Trapezoid with two panels for $x^2$ gives $0.375$" },
      { title: "Midpoint rule one panel", background: "Midpoint rule one panel gives $0.25$", numbers: "Midpoint rule one panel gives $0.25$" },
      { title: "Simpson for $\\sin x$ on $[0,\\pi]$", background: "Simpson for $\\sin x$ on $[0,\\pi]$ gives $2.094$", numbers: "Simpson for $\\sin x$ on $[0,\\pi]$ gives $2.094$" },
      { title: "Application 6", background: "Exact $\\int_0^1 x^2dx=0.333$", numbers: "Exact $\\int_0^1 x^2dx=0.333$" }
    ]
  },
  "math-01-62": {
    connectionsProse: "<p>This lesson builds on the chain rule and derivatives of composed functions. Backpropagation is the chain rule arranged for a computation graph. It connects single-variable calculus to the way machine learning models compute gradients.</p>",
    motivation: "<p>A loss often depends on a weight through several intermediate quantities. Backpropagation records the local derivative at each step and passes sensitivity backward from the final loss.</p>" +
                "<p>Multiplying local derivatives along a path gives the derivative with respect to an earlier variable. In the scalar example, this produces the gradient used to update the weight by a small step in the direction that reduces loss.</p>",
    definition: "<p>For $L=(wx-y)^2$</p>" +
                "<p><b>Assumptions that matter:</b> Follow the conditions stated in the derivation, including required domains, nonzero denominators, continuity or differentiability hypotheses, interval restrictions, and convergence conditions.</p>",
    symbols: [
      { sym: "$w$", desc: "is a weight" },
      { sym: "$x$", desc: "is an input feature" },
      { sym: "$\\hat y$", desc: "is prediction" },
      { sym: "$y$", desc: "is target" },
      { sym: "$e$", desc: "is error" },
      { sym: "upstream sensitivity", desc: "means derivative of the final loss with respect to an intermediate value" }
    ],
    derivation: [
      { do: "Define prediction $\\hat y=wx$", result: "Define prediction $\\hat y=wx$", why: "the weight affects loss through the prediction." },
      { do: "Define error $e=\\hat y-y$", result: "Define error $e=\\hat y-y$", why: "the loss depends on error." },
      { do: "Define $L=e^2$", result: "Define $L=e^2$", why: "this is the final scalar output." },
      { do: "Compute local derivatives", result: "$dL/de=2e$, $de/d\\hat y=1$, and $d\\hat y/dw=x$.", why: "" },
      { do: "Multiply along the path", result: "$dL/dw=(dL/de)(de/d\\hat y)(d\\hat y/dw)$.", why: "" },
      { do: "Substitute to get $dL/dw=2(wx-y)x$.", result: "Substitute to get $dL/dw=2(wx-y)x$.", why: "" },
      { do: "With $w=2,x=3,y=5$, prediction is $6$, error is $1$, and gradient is $6$.", result: "With $w=2,x=3,y=5$, prediction is $6$, error is $1$, and gradient is $6$.", why: "" },
      { do: "A gradient step with learning rate $0.1$ gives $w_{new}=2-0.1\\cdot6=1.4$.", result: "A gradient step with learning rate $0.1$ gives $w_{new}=2-0.1\\cdot6=1.4$.", why: "" }
    ],
    applications: [
      { title: "Worked scalar example", background: "Worked scalar example gives $dL/dw=6$ and update $1.4$", numbers: "Worked scalar example gives $dL/dw=6$ and update $1.4$" },
      { title: "For $w=1,x=4,y=6$, gradient", background: "For $w=1,x=4,y=6$, gradient is $2(4-6)4=-16$", numbers: "For $w=1,x=4,y=6$, gradient is $2(4-6)4=-16$" },
      { title: "Bias model $L=(wx+b-y)^2$", background: "Bias model $L=(wx+b-y)^2$ has $dL/db=2e$; with $e=1$ gives $2$", numbers: "Bias model $L=(wx+b-y)^2$ has $dL/db=2e$; with $e=1$ gives $2$" },
      { title: "Chain $z=3w$, $a=z^2$, $L=a$", background: "Chain $z=3w$, $a=z^2$, $L=a$ gives $dL/dw=18w$; at $w=2$ gives $36$", numbers: "Chain $z=3w$, $a=z^2$, $L=a$ gives $dL/dw=18w$; at $w=2$ gives $36$" },
      { title: "Sigmoid unit with upstream $0.5$ and activation $0.8$", background: "Sigmoid unit with upstream $0.5$ and activation $0.8$ sends local gradient $0.5\\cdot0.8(0.2)=0.08$", numbers: "Sigmoid unit with upstream $0.5$ and activation $0.8$ sends local gradient $0.5\\cdot0.8(0.2)=0.08$" },
      { title: "Two-layer scalar $L=(v(wx)-y)^2$ with $v=2,w=1,x=3,y=5$", background: "Two-layer scalar $L=(v(wx)-y)^2$ with $v=2,w=1,x=3,y=5$ has error $1$, $dL/dw=12$, and $dL/dv=6$", numbers: "Two-layer scalar $L=(v(wx)-y)^2$ with $v=2,w=1,x=3,y=5$ has error $1$, $dL/dw=12$, and $dL/dv=6$" }
    ]
  }
};
