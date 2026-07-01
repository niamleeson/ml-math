module.exports = {
  "math-01-29": {
    id: "math-01-29",
    title: "L'Hôpital's rule",
    tagline: "When a limit says $0/0$ or $\\infty/\\infty$, compare the rates instead of the raw values.",
    connections: {
      buildsOn: ["limits", "derivatives", "quotient notation"],
      leadsTo: ["Taylor approximation", "asymptotic comparison", "optimization tests"],
      usedWith: ["continuity", "the chain rule", "exponential and logarithmic functions"]
    },
    motivation:
      "<p>You already know that some limits are honest after a rewrite. But a limit like $\\lim_{x\\to0}\\frac{e^x-1-x}{x^2}$ keeps saying $\\tfrac00$ even after the easy algebra is gone.</p>" +
      "<p><b>L'Hôpital's rule</b> gives a calm next move: if numerator and denominator both vanish or both grow without bound, compare their derivatives. It is like asking which runner is moving faster at the finish line, not where they happened to stand before the race got close.</p>",
    definition:
      "<p>Suppose $f$ and $g$ are differentiable near $a$ (except possibly at $a$), $g'(x)\\ne0$ near $a$, and direct substitution gives $\\frac00$ or $\\frac{\\infty}{\\infty}$. If $\\lim_{x\\to a}\\frac{f'(x)}{g'(x)}=L$ exists, then $$\\lim_{x\\to a}\\frac{f(x)}{g(x)}=L.$$ The same idea works for one-sided limits and many infinite limits when the same hypotheses hold.</p>" +
      "<p><b>Assumptions that matter:</b> the original quotient must first be an indeterminate form of type $0/0$ or $\\infty/\\infty$; the denominator derivative must not be zero near the point; and if one round still gives $0/0$ or $\\infty/\\infty$, you may repeat the rule only after checking the form again.</p>",
    worked: {
      problem: "Compute $\\displaystyle\\lim_{x\\to0}\\frac{e^x-1-x}{x^2}$.",
      skills: ["indeterminate forms", "derivatives", "repeated L'Hôpital"],
      strategy: "Direct substitution gives $\\tfrac00$. Differentiate top and bottom, then check the form before deciding whether to repeat.",
      steps: [
        { do: "Substitute $x=0$", result: "$\\frac{1-1-0}{0}=\\frac00$", why: "the form is indeterminate" },
        { do: "Differentiate numerator and denominator", result: "$\\dfrac{e^x-1}{2x}$", why: "L'Hôpital compares rates" },
        { do: "Substitute $x=0$ again", result: "$\\frac00$", why: "one round did not remove the indeterminate form" },
        { do: "Differentiate numerator and denominator again", result: "$\\dfrac{e^x}{2}$", why: "the hypotheses still match $0/0$" },
        { do: "Substitute $x=0$", result: "$\\frac12$", why: "the new quotient is continuous at $0$" }
      ],
      verify: "Using $e^x=1+x+\\frac{x^2}{2}+\\cdots$, the numerator behaves like $\\frac{x^2}{2}$, so the quotient should approach $\\frac12$.",
      answer: "$\\displaystyle\\lim_{x\\to0}\\frac{e^x-1-x}{x^2}=\\frac12$",
      connects: "Taylor approximation - repeated derivatives reveal the first nonzero term controlling the limit."
    },
    practice: [
      { problem: "$\\displaystyle\\lim_{x\\to0}\\frac{\\sin x}{x}$", steps: [
        { do: "Substitute $x=0$", result: "$\\frac00$", why: "the quotient is indeterminate" },
        { do: "Differentiate numerator and denominator", result: "$\\dfrac{\\cos x}{1}$", why: "L'Hôpital applies to $0/0$" },
        { do: "Substitute $x=0$", result: "$1$", why: "$\\cos0=1$" }
      ], answer: "$1$" },
      { problem: "$\\displaystyle\\lim_{x\\to1}\\frac{\\ln x}{x-1}$", steps: [
        { do: "Substitute $x=1$", result: "$\\frac00$", why: "$\\ln1=0$" },
        { do: "Differentiate numerator and denominator", result: "$\\dfrac{1/x}{1}$", why: "compare local rates" },
        { do: "Substitute $x=1$", result: "$1$", why: "$1/x$ is continuous at $1$" }
      ], answer: "$1$" },
      { problem: "$\\displaystyle\\lim_{x\\to0}\\frac{x-\\sin x}{x^3}$", steps: [
        { do: "Substitute $x=0$", result: "$\\frac00$", why: "the form is indeterminate" },
        { do: "Differentiate once", result: "$\\dfrac{1-\\cos x}{3x^2}$", why: "L'Hôpital applies" },
        { do: "Substitute $x=0$", result: "$\\frac00$", why: "the form remains indeterminate" },
        { do: "Differentiate twice", result: "$\\dfrac{\\sin x}{6x}$", why: "apply the rule again" },
        { do: "Substitute $x=0$", result: "$\\frac00$", why: "one more rate comparison is needed" },
        { do: "Differentiate three times", result: "$\\dfrac{\\cos x}{6}$", why: "the quotient is now continuous" },
        { do: "Substitute $x=0$", result: "$\\frac16$", why: "$\\cos0=1$" }
      ], answer: "$\\frac16$" },
      { problem: "$\\displaystyle\\lim_{x\\to0^+}x\\ln x$", steps: [
        { do: "Rewrite the product", result: "$\\dfrac{\\ln x}{1/x}$", why: "L'Hôpital needs a quotient" },
        { do: "Read the form as $x\\to0^+$", result: "$\\dfrac{-\\infty}{\\infty}$", why: "this is an $\\infty/\\infty$ type after signs are allowed" },
        { do: "Differentiate numerator and denominator", result: "$\\dfrac{1/x}{-1/x^2}$", why: "compare growth rates" },
        { do: "Simplify the quotient", result: "$-x$", why: "multiply by $x^2$" },
        { do: "Take $x\\to0^+$", result: "$0$", why: "$-x$ approaches $0$" }
      ], answer: "$0$" },
      { problem: "$\\displaystyle\\lim_{t\\to\\infty}\\frac{\\ln(1+e^{-t})}{e^{-t}}$", steps: [
        { do: "Read the form", result: "$\\frac00$", why: "both numerator and denominator approach $0$" },
        { do: "Differentiate the numerator", result: "$\\dfrac{-e^{-t}}{1+e^{-t}}$", why: "chain rule on $\\ln(1+e^{-t})$" },
        { do: "Differentiate the denominator", result: "$-e^{-t}$", why: "derivative of $e^{-t}$" },
        { do: "Form the derivative quotient", result: "$\\dfrac{-e^{-t}/(1+e^{-t})}{-e^{-t}}$", why: "L'Hôpital applies at infinity" },
        { do: "Simplify", result: "$\\dfrac{1}{1+e^{-t}}$", why: "the common factor cancels" },
        { do: "Take $t\\to\\infty$", result: "$1$", why: "$e^{-t}\\to0$" }
      ], answer: "$1$ - for very negative logits, softplus behaves like its tiny exponential input." }
    ],
    applications: [
      { title: "Gradient checks", background: "Numerical gradient checks compare a tiny finite difference with the derivative used by backprop. L'Hôpital explains why the ratio has a stable limit.", numbers: "For $f(w)=e^w$ at $w=0$, $\\frac{e^h-1}{h}\\to1$; with $h=0.001$ the value is $1.000500\\approx1$." },
      { title: "Softmax stability", background: "Log-sum-exp and softplus appear in classifiers, and their tails often reduce to small-over-small limits.", numbers: "$\\ln(1+e^{-10})/e^{-10}=0.999977\\approx1$, matching the limit from the practice problem." },
      { title: "Asymptotic feature scaling", background: "When comparing transformations, derivative ratios reveal which grows faster.", numbers: "$\\lim_{x\\to\\infty}\\frac{\\ln x}{x}=\\lim\\frac{1/x}{1}=0$, so at $x=1000$, $\\ln x/x\\approx0.0069$." },
      { title: "Vanishing activations", background: "Saturation questions ask whether a numerator shrinks faster than a denominator near an extreme value.", numbers: "For sigmoid slope $\\sigma(x)(1-\\sigma(x))$, at $x=8$ it is about $0.000335$, essentially matching $e^{-8}=0.000335$." },
      { title: "Algorithmic approximations", background: "Many running-time comparisons are limits of quotients, and L'Hôpital can simplify logarithms against powers.", numbers: "$\\lim_{n\\to\\infty}\\frac{\\ln n}{\\sqrt n}=\\lim\\frac{1/n}{1/(2\\sqrt n)}=\\lim\\frac{2}{\\sqrt n}=0$." },
      { title: "Probability near zero", background: "Densities and cumulative probabilities often create $0/0$ ratios near a boundary.", numbers: "For $P(X\\le x)=1-e^{-2x}$, $\\lim_{x\\to0^+}\\frac{1-e^{-2x}}{x}=\\lim\\frac{2e^{-2x}}{1}=2$." }
    ],
    applicationsClose: "The shared thread is rate comparison: when values hide the answer, derivatives reveal who is shrinking or growing faster.",
    takeaways: [
      "Use L'Hôpital only after confirming $0/0$ or $\\infty/\\infty$.",
      "Differentiate numerator and denominator separately; do not use the quotient rule.",
      "If the new quotient is still indeterminate, check the hypotheses and repeat."
    ]
  },

  "math-01-30": {
    id: "math-01-30",
    title: "Critical points",
    tagline: "The places where a function can turn, flatten, cusp, or hide an optimum.",
    connections: {
      buildsOn: ["derivatives", "domains of functions", "solving equations"],
      leadsTo: ["the first derivative test", "the second derivative test", "applied optimization"],
      usedWith: ["continuity", "absolute value functions", "polynomial factoring"]
    },
    motivation:
      "<p>If you are looking for the highest or lowest point on a smooth hill, you naturally look where the slope becomes flat. That instinct is excellent, but calculus asks us to be a little more inclusive.</p>" +
      "<p>A <b>critical point</b> is any input in the domain where the derivative is zero or where the derivative does not exist. Flat tops count, sharp corners count, and vertical tangents count. This list becomes the candidate list for optimization.</p>",
    definition:
      "<p>A number $c$ is a <b>critical number</b> of $f$ if $c$ is in the domain of $f$ and either $f'(c)=0$ or $f'(c)$ does not exist. The point $(c,f(c))$ is then a critical point on the graph. The derivative condition comes from the tangent slope: local maxima and minima inside an interval must occur where the tangent is horizontal or where no tangent slope exists.</p>" +
      "<p><b>Assumptions that matter:</b> $c$ must belong to the function's domain; endpoints are candidates for absolute extrema but are not usually called critical numbers; and a critical point is only a candidate, not automatically a maximum or minimum.</p>",
    worked: {
      problem: "Find the critical points of $f(x)=x^3-3x$.",
      skills: ["derivatives", "factoring", "candidate lists"],
      strategy: "Differentiate, solve $f'(x)=0$, then report the points using the original function.",
      steps: [
        { do: "Differentiate $f$", result: "$f'(x)=3x^2-3$", why: "critical numbers come from the derivative" },
        { do: "Set the derivative equal to zero", result: "$3x^2-3=0$", why: "horizontal tangents have slope $0$" },
        { do: "Divide by $3$", result: "$x^2-1=0$", why: "simplify before factoring" },
        { do: "Factor", result: "$(x-1)(x+1)=0$", why: "zero product property" },
        { do: "Solve for $x$", result: "$x=-1,1$", why: "these are the critical numbers" },
        { do: "Evaluate $f(-1)$ and $f(1)$", result: "$f(-1)=2,\\ f(1)=-2$", why: "critical points include coordinates" }
      ],
      verify: "$f'$ is a polynomial, so it exists everywhere; no nondifferentiable points were missed.",
      answer: "Critical points: $(-1,2)$ and $(1,-2)$.",
      connects: "The next lesson asks what happens on each side of these candidates."
    },
    practice: [
      { problem: "Find the critical points of $f(x)=x^2-4x+1$.", steps: [
        { do: "Differentiate", result: "$f'(x)=2x-4$", why: "critical numbers start with $f'$" },
        { do: "Set $f'(x)=0$", result: "$2x-4=0$", why: "look for horizontal tangents" },
        { do: "Add $4$", result: "$2x=4$", why: "isolate the variable" },
        { do: "Divide by $2$", result: "$x=2$", why: "solve the equation" },
        { do: "Evaluate $f(2)$", result: "$4-8+1=-3$", why: "turn the number into a point" }
      ], answer: "Critical point: $(2,-3)$." },
      { problem: "Find the critical numbers of $f(x)=x^4-8x^2$.", steps: [
        { do: "Differentiate", result: "$f'(x)=4x^3-16x$", why: "power rule" },
        { do: "Factor the derivative", result: "$4x(x^2-4)$", why: "common factor first" },
        { do: "Factor again", result: "$4x(x-2)(x+2)$", why: "difference of squares" },
        { do: "Set each factor to zero", result: "$x=0,2,-2$", why: "zero product property" },
        { do: "Check differentiability", result: "$f'$ exists for all $x$", why: "polynomials have no derivative gaps" }
      ], answer: "Critical numbers: $x=-2,0,2$." },
      { problem: "Find the critical numbers of $f(x)=|x-3|$.", steps: [
        { do: "Write the derivative away from the corner", result: "$f'(x)=-1$ for $x<3$ and $f'(x)=1$ for $x>3$", why: "absolute value is linear on each side" },
        { do: "Check where $f'(x)=0$", result: "No solutions", why: "the side slopes are $-1$ and $1$" },
        { do: "Check the corner", result: "$x=3$", why: "the left and right slopes disagree" },
        { do: "Check the domain", result: "$3$ is in the domain", why: "critical numbers must be valid inputs" },
        { do: "Evaluate $f(3)$", result: "$0$", why: "optional coordinate" }
      ], answer: "Critical point: $(3,0)$; the derivative is undefined there." },
      { problem: "Find the critical numbers of $f(x)=x^{2/3}$.", steps: [
        { do: "Differentiate for $x\\ne0$", result: "$f'(x)=\\frac{2}{3}x^{-1/3}$", why: "power rule" },
        { do: "Check where $f'(x)=0$", result: "No solutions", why: "$\\frac{2}{3}x^{-1/3}$ is never $0$" },
        { do: "Find where $f'$ is undefined", result: "$x=0$", why: "$x^{-1/3}$ divides by $\\sqrt[3]{x}$" },
        { do: "Check the original domain", result: "$0$ is in the domain of $x^{2/3}$", why: "the function value exists" },
        { do: "Evaluate $f(0)$", result: "$0$", why: "coordinate of the cusp" }
      ], answer: "Critical point: $(0,0)$." },
      { problem: "A one-parameter loss is $J(w)=(w-3)^2+2$. Find its critical point.", steps: [
        { do: "Differentiate the loss", result: "$J'(w)=2(w-3)$", why: "chain rule for the square" },
        { do: "Set the derivative to zero", result: "$2(w-3)=0$", why: "training stops at zero gradient candidates" },
        { do: "Divide by $2$", result: "$w-3=0$", why: "simplify" },
        { do: "Solve for $w$", result: "$w=3$", why: "the candidate weight" },
        { do: "Evaluate $J(3)$", result: "$2$", why: "the minimum loss value" }
      ], answer: "Critical point: $(3,2)$ in the $(w,J)$ plane." }
    ],
    applications: [
      { title: "Loss minimization", background: "Training searches for weights where the gradient is zero or numerically tiny.", numbers: "For $J(w)=(w-3)^2+2$, $J'(w)=2w-6$, so $w=3$ gives loss $2$." },
      { title: "Regularized regression", background: "L2 regularization adds a smooth penalty, shifting the critical point toward zero.", numbers: "If $J(w)=(w-5)^2+w^2$, then $J'(w)=4w-10$, so $w=2.5$ instead of $5$." },
      { title: "Robust losses", background: "Absolute value losses have corners, so nondifferentiable critical points matter.", numbers: "For $L(w)=|w-4|$, the critical point is $w=4$ even though $L'$ is undefined there." },
      { title: "Learning-rate schedules", background: "A schedule can have turning points that mark warmup peaks.", numbers: "For $\\eta(t)=0.1t e^{-t}$, $\\eta'(t)=0.1e^{-t}(1-t)$, so the peak is at $t=1$." },
      { title: "Signal processing", background: "Peaks in a smoothed signal occur among derivative-zero candidates.", numbers: "For $s(t)=t^3-3t$, candidates $t=-1,1$ have values $2$ and $-2$." },
      { title: "Database cost tuning", background: "A simplified query cost can have a best buffer size inside the allowed range.", numbers: "If $C(b)=b+100/b$, then $C'(b)=1-100/b^2$, so $b=10$ is the interior candidate." }
    ],
    applicationsClose: "Critical points are not the answer by themselves; they are the honest shortlist where important behavior can happen.",
    takeaways: [
      "Critical numbers occur where $f'=0$ or where $f'$ does not exist, but only inside the domain of $f$.",
      "Always check nondifferentiable points such as corners and cusps.",
      "Critical points are candidates that later tests classify."
    ]
  },

  "math-01-31": {
    id: "math-01-31",
    title: "The first derivative test",
    tagline: "Use the sign of $f'$ to decide whether a critical point is a peak, a valley, or neither.",
    connections: {
      buildsOn: ["critical points", "derivatives as slopes", "sign charts"],
      leadsTo: ["curve sketching", "optimization", "the second derivative test"],
      usedWith: ["interval notation", "factoring", "continuity"]
    },
    motivation:
      "<p>A critical point tells you where to look, but not what you found. A flat tangent can be the top of a hill, the bottom of a bowl, or just a pause on the way upward.</p>" +
      "<p>The <b>first derivative test</b> reads the motion around the point. If $f'$ changes from positive to negative, the graph rises then falls. If it changes from negative to positive, the graph falls then rises. The sign change tells the story.</p>",
    definition:
      "<p>Let $c$ be a critical number and suppose $f$ is continuous near $c$. Check the sign of $f'$ on intervals just to the left and right of $c$. If $f'$ changes from $+$ to $-$, $f(c)$ is a local maximum. If $f'$ changes from $-$ to $+$, $f(c)$ is a local minimum. If there is no sign change, $c$ is not a local extremum.</p>" +
      "<p><b>Assumptions that matter:</b> the sign chart must use intervals where $f'$ exists; continuity of $f$ at the candidate keeps the graph from jumping; and endpoints require separate absolute-extreme checks rather than the two-sided test.</p>",
    worked: {
      problem: "Classify the critical points of $f(x)=x^3-3x$ using the first derivative test.",
      skills: ["critical points", "sign charts", "classification"],
      strategy: "Find $f'$, split the number line at the critical numbers, and test the sign on each interval.",
      steps: [
        { do: "Differentiate", result: "$f'(x)=3x^2-3$", why: "the sign of $f'$ controls increase and decrease" },
        { do: "Factor", result: "$f'(x)=3(x-1)(x+1)$", why: "factored form makes signs visible" },
        { do: "Find critical numbers", result: "$x=-1,1$", why: "set the factors equal to zero" },
        { do: "Test $x=-2$", result: "$f'(-2)>0$", why: "the function increases on $(-\\infty,-1)$" },
        { do: "Test $x=0$", result: "$f'(0)<0$", why: "the function decreases on $(-1,1)$" },
        { do: "Test $x=2$", result: "$f'(2)>0$", why: "the function increases on $(1,\\infty)$" },
        { do: "Classify $x=-1$", result: "local maximum", why: "$f'$ changes from positive to negative" },
        { do: "Classify $x=1$", result: "local minimum", why: "$f'$ changes from negative to positive" }
      ],
      verify: "$f(-1)=2$ and nearby values are lower; $f(1)=-2$ and nearby values are higher.",
      answer: "Local maximum at $(-1,2)$; local minimum at $(1,-2)$.",
      connects: "This is the same candidate list from critical points, now classified by direction of motion."
    },
    practice: [
      { problem: "Classify the critical point of $f(x)=x^2-6x+5$.", steps: [
        { do: "Differentiate", result: "$f'(x)=2x-6$", why: "build the sign chart" },
        { do: "Set $f'=0$", result: "$x=3$", why: "critical number" },
        { do: "Test $x=2$", result: "$f'(2)=-2$", why: "negative means decreasing left of $3$" },
        { do: "Test $x=4$", result: "$f'(4)=2$", why: "positive means increasing right of $3$" },
        { do: "Classify", result: "local minimum", why: "$f'$ changes from negative to positive" },
        { do: "Evaluate $f(3)$", result: "$-4$", why: "give the point" }
      ], answer: "Local minimum at $(3,-4)$." },
      { problem: "Classify the critical points of $f(x)=x^4-4x^2$.", steps: [
        { do: "Differentiate", result: "$f'(x)=4x^3-8x$", why: "power rule" },
        { do: "Factor", result: "$4x(x^2-2)$", why: "find zeros" },
        { do: "Find critical numbers", result: "$x=-\\sqrt2,0,\\sqrt2$", why: "solve each factor" },
        { do: "Test the intervals", result: "$-,+,-,+$", why: "use sample points $-2,-1,1,2$" },
        { do: "Classify $-\\sqrt2$", result: "local minimum", why: "$f'$ changes from negative to positive" },
        { do: "Classify $0$", result: "local maximum", why: "$f'$ changes from positive to negative" },
        { do: "Classify $\\sqrt2$", result: "local minimum", why: "$f'$ changes from negative to positive" }
      ], answer: "Local minima at $x=\\pm\\sqrt2$ and a local maximum at $x=0$." },
      { problem: "Classify $x=0$ for $f(x)=x^3$.", steps: [
        { do: "Differentiate", result: "$f'(x)=3x^2$", why: "find the sign of the slope" },
        { do: "Set $f'=0$", result: "$x=0$", why: "critical number" },
        { do: "Test $x=-1$", result: "$f'(-1)=3>0$", why: "increasing on the left" },
        { do: "Test $x=1$", result: "$f'(1)=3>0$", why: "increasing on the right" },
        { do: "Compare signs", result: "no sign change", why: "positive to positive is neither max nor min" }
      ], answer: "$x=0$ is neither a local maximum nor a local minimum." },
      { problem: "Classify the critical point of $f(x)=|x|$.", steps: [
        { do: "Find side slopes", result: "$f'(x)=-1$ for $x<0$, $f'(x)=1$ for $x>0$", why: "absolute value is piecewise linear" },
        { do: "Identify the critical number", result: "$x=0$", why: "the derivative is undefined at the corner" },
        { do: "Read the left sign", result: "negative", why: "the graph decreases toward $0$" },
        { do: "Read the right sign", result: "positive", why: "the graph increases after $0$" },
        { do: "Classify", result: "local minimum", why: "$f'$ changes from negative to positive" }
      ], answer: "Local minimum at $(0,0)$." },
      { problem: "For $J(w)=w^4-2w^2$, classify the stationary points relevant to a toy loss surface.", steps: [
        { do: "Differentiate", result: "$J'(w)=4w^3-4w$", why: "stationary points have zero gradient" },
        { do: "Factor", result: "$4w(w-1)(w+1)$", why: "solve the critical equation" },
        { do: "List critical numbers", result: "$w=-1,0,1$", why: "each factor can be zero" },
        { do: "Test signs", result: "$-,+,-,+$", why: "sample $-2,-0.5,0.5,2$" },
        { do: "Classify", result: "$-1$ and $1$ are minima; $0$ is a maximum", why: "read sign changes" }
      ], answer: "Local minima at $w=\\pm1$ with $J=-1$; local maximum at $w=0$ with $J=0$." }
    ],
    applications: [
      { title: "Training loss landscapes", background: "A zero gradient is ambiguous until the sign or direction changes around it are checked.", numbers: "For $J(w)=w^4-2w^2$, $w=0$ has zero gradient but is a local maximum, while $w=\\pm1$ are minima." },
      { title: "Learning-rate warmup", background: "Schedulers often increase first and decrease later, so the peak is a first-derivative-test moment.", numbers: "If $\\eta(t)=t e^{-t}$, $\\eta'(t)=e^{-t}(1-t)$ changes $+$ to $-$ at $t=1$." },
      { title: "Throughput tuning", background: "Systems teams tune batch size by locating where throughput stops rising.", numbers: "For $T(b)=100b/(b+20)-0.2b$, the derivative changes sign near $b=80$, marking a peak." },
      { title: "Robust regression", background: "Nonsmooth losses can still be classified by side slopes.", numbers: "$L(w)=|w-7|$ has slope $-1$ left of $7$ and $+1$ right of $7$, so $w=7$ is the minimum." },
      { title: "Cache sizing", background: "A cost can fall as cache grows, then rise when memory overhead dominates.", numbers: "For $C(c)=500/c+2c$, $C'(c)=-500/c^2+2$ changes from negative to positive at $c=\\sqrt{250}\\approx15.8$." },
      { title: "Model selection curves", background: "Validation error often decreases, bottoms out, and then rises from overfitting.", numbers: "A toy curve $E(d)=0.02(d-6)^2+0.1$ has $E'(d)=0.04(d-6)$, changing $-$ to $+$ at degree $6$." }
    ],
    applicationsClose: "The first derivative test turns a candidate into a behavior story: rising, falling, and what changes at the candidate.",
    takeaways: [
      "Positive $f'$ means increasing; negative $f'$ means decreasing.",
      "$+$ to $-$ gives a local maximum; $-$ to $+$ gives a local minimum.",
      "No sign change means the critical point is not a local extremum."
    ]
  },

  "math-01-32": {
    id: "math-01-32",
    title: "Concavity",
    tagline: "Concavity tells whether slopes are getting larger or smaller.",
    connections: {
      buildsOn: ["first derivatives", "increasing and decreasing", "second derivatives"],
      leadsTo: ["inflection points", "the second derivative test", "curve sketching"],
      usedWith: ["tangent lines", "quadratic approximation", "sign charts"]
    },
    motivation:
      "<p>The first derivative tells whether a graph is rising or falling. But two graphs can both rise while feeling very different: one bends upward like a bowl, the other bends downward as it levels off.</p>" +
      "<p><b>Concavity</b> describes that bending. It is the derivative of the derivative story: are slopes increasing, or are slopes decreasing? This is why concavity becomes the doorway to curvature, acceleration, and optimization confidence.</p>",
    definition:
      "<p>A function is <b>concave up</b> on an interval when $f'$ is increasing there, usually detected by $f''(x)>0$. It is <b>concave down</b> when $f'$ is decreasing, usually detected by $f''(x)<0$. A tangent line tends to lie below a concave-up graph and above a concave-down graph locally.</p>" +
      "<p><b>Assumptions that matter:</b> the second derivative test for concavity works on intervals where $f''$ exists; $f''=0$ at one point does not by itself prove a change in concavity; and concavity is an interval property, not just a point label.</p>",
    worked: {
      problem: "Determine the concavity of $f(x)=\\ln x$ on its domain.",
      skills: ["second derivatives", "domains", "sign analysis"],
      strategy: "Find $f''$ and read its sign on the whole domain $x>0$.",
      steps: [
        { do: "State the domain", result: "$x>0$", why: "$\\ln x$ is defined only for positive $x$" },
        { do: "Differentiate once", result: "$f'(x)=1/x$", why: "slope of the log curve" },
        { do: "Differentiate again", result: "$f''(x)=-1/x^2$", why: "concavity comes from the change in slope" },
        { do: "Check the sign for $x>0$", result: "$f''(x)<0$", why: "$x^2$ is positive and the numerator is negative" },
        { do: "Name the concavity", result: "concave down on $(0,\\infty)$", why: "negative second derivative means slopes decrease" }
      ],
      verify: "At $x=1$, the slope is $1$; at $x=2$, the slope is $1/2$; at $x=4$, the slope is $1/4$. The slopes are decreasing.",
      answer: "$\\ln x$ is concave down on $(0,\\infty)$.",
      connects: "In optimization, concave down means a stationary point behaves like a local maximum for a one-dimensional objective."
    },
    practice: [
      { problem: "Determine the concavity of $f(x)=x^2+3x$.", steps: [
        { do: "Differentiate once", result: "$f'(x)=2x+3$", why: "prepare for the second derivative" },
        { do: "Differentiate again", result: "$f''(x)=2$", why: "constant curvature" },
        { do: "Check the sign", result: "$2>0$", why: "positive everywhere" },
        { do: "Name the interval", result: "$(-\\infty,\\infty)$", why: "the polynomial is defined everywhere" },
        { do: "State concavity", result: "concave up everywhere", why: "slopes are increasing" }
      ], answer: "Concave up on $(-\\infty,\\infty)$." },
      { problem: "Determine where $f(x)=x^3-6x^2$ is concave up or down.", steps: [
        { do: "Differentiate once", result: "$f'(x)=3x^2-12x$", why: "first derivative" },
        { do: "Differentiate again", result: "$f''(x)=6x-12$", why: "second derivative" },
        { do: "Set $f''=0$", result: "$x=2$", why: "possible split point" },
        { do: "Test $x=0$", result: "$f''(0)=-12$", why: "negative on the left" },
        { do: "Test $x=3$", result: "$f''(3)=6$", why: "positive on the right" }
      ], answer: "Concave down on $(-\\infty,2)$ and concave up on $(2,\\infty)$." },
      { problem: "Determine the concavity of $f(x)=e^{-x}$.", steps: [
        { do: "Differentiate once", result: "$f'(x)=-e^{-x}$", why: "chain rule" },
        { do: "Differentiate again", result: "$f''(x)=e^{-x}$", why: "the negative sign cancels" },
        { do: "Check the sign", result: "$e^{-x}>0$", why: "exponentials are always positive" },
        { do: "Name the domain", result: "$(-\\infty,\\infty)$", why: "the exponential is defined everywhere" },
        { do: "State concavity", result: "concave up everywhere", why: "positive second derivative" }
      ], answer: "Concave up on all real numbers." },
      { problem: "Determine where $f(x)=x^4-2x^2$ is concave up or down.", steps: [
        { do: "Differentiate once", result: "$f'(x)=4x^3-4x$", why: "power rule" },
        { do: "Differentiate again", result: "$f''(x)=12x^2-4$", why: "curvature expression" },
        { do: "Set $f''=0$", result: "$12x^2-4=0$", why: "possible concavity changes" },
        { do: "Solve for $x$", result: "$x=\\pm\\frac{1}{\\sqrt3}$", why: "$x^2=1/3$" },
        { do: "Test intervals", result: "$+,-,+$", why: "large $|x|$ makes $12x^2-4$ positive; $x=0$ gives negative" }
      ], answer: "Concave up on $(-\\infty,-1/\\sqrt3)$ and $(1/\\sqrt3,\\infty)$; concave down on $(-1/\\sqrt3,1/\\sqrt3)$." },
      { problem: "For logistic loss curvature $\\ell''(z)=\\sigma(z)(1-\\sigma(z))$, where is it positive?", steps: [
        { do: "Recall the sigmoid range", result: "$0<\\sigma(z)<1$", why: "sigmoid outputs probabilities strictly between $0$ and $1$" },
        { do: "Check the first factor", result: "$\\sigma(z)>0$", why: "positive probability" },
        { do: "Check the second factor", result: "$1-\\sigma(z)>0$", why: "the probability is less than $1$" },
        { do: "Multiply the signs", result: "$\\ell''(z)>0$", why: "positive times positive" },
        { do: "Name the concavity", result: "concave up as a loss in $z$", why: "positive curvature means bowl-shaped" }
      ], answer: "The logistic loss is concave up in the score variable for every finite $z$." }
    ],
    applications: [
      { title: "Convex losses", background: "Many optimization guarantees rely on bowl-shaped losses, which in one dimension means concave up.", numbers: "For $J(w)=(w-4)^2$, $J''(w)=2>0$, so every stationary point is globally safe." },
      { title: "Diminishing returns", background: "Logarithms model gains that continue but slow down.", numbers: "$\\ln x$ has slopes $1,0.5,0.25$ at $x=1,2,4$, so it bends downward." },
      { title: "Newton's method", background: "Curvature controls the Newton step size.", numbers: "For $f(w)=w^2$, $f'(3)=6$ and $f''(3)=2$, so Newton moves by $6/2=3$ straight to $0$." },
      { title: "Uncertainty penalties", background: "Entropy-style terms are concave, which rewards mixing rather than extremes.", numbers: "For $H(p)=-p\\ln p-(1-p)\\ln(1-p)$, $H''(p)=-1/p-1/(1-p)<0$; at $p=0.5$, $H''=-4$." },
      { title: "Queueing delay", background: "Delay often curves upward as utilization approaches capacity.", numbers: "$D(\\rho)=1/(1-\\rho)$ has $D''(\\rho)=2/(1-\\rho)^3$; at $\\rho=0.8$, $D''=250$." },
      { title: "Calibration curves", background: "Probability transforms can flatten at the ends and curve differently across ranges.", numbers: "Sigmoid slope drops from $0.25$ at $0$ to about $0.105$ at $2$, showing decreasing slope on the positive side." }
    ],
    applicationsClose: "Concavity is the shape behind the slope: not just whether things move, but whether that motion is speeding up or slowing down.",
    takeaways: [
      "$f''>0$ means concave up; $f''<0$ means concave down.",
      "Concavity describes intervals, not isolated points.",
      "A zero second derivative is only a candidate for a change in concavity."
    ]
  },

  "math-01-33": {
    id: "math-01-33",
    title: "The second derivative test",
    tagline: "Classify a stationary point by the sign of the curvature there.",
    connections: {
      buildsOn: ["critical points", "concavity", "second derivatives"],
      leadsTo: ["inflection points", "curve sketching", "optimization"],
      usedWith: ["quadratic approximation", "Taylor polynomials", "sign charts"]
    },
    motivation:
      "<p>The first derivative test is dependable, but it asks you to make a sign chart. Sometimes the second derivative gives a faster reading: at a flat point, is the graph shaped like a bowl or like a cap?</p>" +
      "<p>The <b>second derivative test</b> says positive curvature at a stationary point means a local minimum, negative curvature means a local maximum, and zero curvature means we need more information. It is a local microscope.</p>",
    definition:
      "<p>If $f'(c)=0$ and $f''$ exists near $c$, then $f''(c)>0$ implies a local minimum at $c$, while $f''(c)<0$ implies a local maximum at $c$. If $f''(c)=0$, the test is inconclusive. The reason is the quadratic approximation $$f(c+h)\\approx f(c)+\\frac12 f''(c)h^2,$$ since the linear term vanishes when $f'(c)=0$.</p>" +
      "<p><b>Assumptions that matter:</b> the test applies only at stationary points with $f'(c)=0$; it does not classify corners where $f'$ is undefined; and $f''(c)=0$ does not mean neither, only that this test has gone silent.</p>",
    worked: {
      problem: "Use the second derivative test to classify the critical points of $f(x)=x^4-4x^2$.",
      skills: ["critical points", "second derivatives", "classification"],
      strategy: "Find stationary points from $f'$, then plug each one into $f''$.",
      steps: [
        { do: "Differentiate once", result: "$f'(x)=4x^3-8x$", why: "stationary points satisfy $f'=0$" },
        { do: "Factor $f'$", result: "$4x(x^2-2)$", why: "solve the critical equation" },
        { do: "Solve $f'=0$", result: "$x=0,\\ \\pm\\sqrt2$", why: "these are stationary points" },
        { do: "Differentiate again", result: "$f''(x)=12x^2-8$", why: "curvature classifies them" },
        { do: "Evaluate at $x=0$", result: "$f''(0)=-8$", why: "negative curvature means local maximum" },
        { do: "Evaluate at $x=\\pm\\sqrt2$", result: "$f''(\\pm\\sqrt2)=16$", why: "positive curvature means local minima" },
        { do: "Evaluate function values", result: "$f(0)=0,\\ f(\\pm\\sqrt2)=-4$", why: "give the classified points" }
      ],
      verify: "The graph rises into $x=0$ then falls away, while near $\\pm\\sqrt2$ it bends upward like two bowls.",
      answer: "Local maximum at $(0,0)$; local minima at $(\\pm\\sqrt2,-4)$.",
      connects: "The sign of curvature gives the same classification as the first derivative test when the test is decisive."
    },
    practice: [
      { problem: "Classify the critical point of $f(x)=x^2+2x+5$.", steps: [
        { do: "Differentiate once", result: "$f'(x)=2x+2$", why: "find stationary points" },
        { do: "Set $f'=0$", result: "$x=-1$", why: "solve $2x+2=0$" },
        { do: "Differentiate again", result: "$f''(x)=2$", why: "curvature" },
        { do: "Evaluate $f''(-1)$", result: "$2>0$", why: "positive curvature" },
        { do: "Evaluate $f(-1)$", result: "$4$", why: "give the point" }
      ], answer: "Local minimum at $(-1,4)$." },
      { problem: "Classify the critical point of $f(x)=-3x^2+12x$.", steps: [
        { do: "Differentiate", result: "$f'(x)=-6x+12$", why: "critical equation" },
        { do: "Set $f'=0$", result: "$x=2$", why: "stationary point" },
        { do: "Differentiate again", result: "$f''(x)=-6$", why: "curvature" },
        { do: "Evaluate at $2$", result: "$-6<0$", why: "negative curvature" },
        { do: "Evaluate $f(2)$", result: "$12$", why: "height of the maximum" }
      ], answer: "Local maximum at $(2,12)$." },
      { problem: "Use the test on $f(x)=x^3$ at its critical point.", steps: [
        { do: "Differentiate once", result: "$f'(x)=3x^2$", why: "find critical points" },
        { do: "Set $f'=0$", result: "$x=0$", why: "stationary point" },
        { do: "Differentiate again", result: "$f''(x)=6x$", why: "curvature" },
        { do: "Evaluate $f''(0)$", result: "$0$", why: "the test is inconclusive" },
        { do: "Use a sign check", result: "$f'(x)>0$ on both sides", why: "the function keeps increasing" }
      ], answer: "The second derivative test is inconclusive; $x=0$ is not a local extremum." },
      { problem: "Classify the stationary points of $f(x)=x^3-6x^2+9x$.", steps: [
        { do: "Differentiate", result: "$f'(x)=3x^2-12x+9$", why: "stationary equation" },
        { do: "Factor", result: "$3(x-1)(x-3)$", why: "solve quickly" },
        { do: "List stationary points", result: "$x=1,3$", why: "zeros of $f'$" },
        { do: "Differentiate again", result: "$f''(x)=6x-12$", why: "curvature" },
        { do: "Evaluate $f''(1)$", result: "$-6$", why: "local maximum" },
        { do: "Evaluate $f''(3)$", result: "$6$", why: "local minimum" }
      ], answer: "Local maximum at $x=1$ and local minimum at $x=3$." },
      { problem: "For $J(w)=\\frac12(w-4)^2$, classify the critical point of the loss.", steps: [
        { do: "Differentiate", result: "$J'(w)=w-4$", why: "gradient of the loss" },
        { do: "Set $J'=0$", result: "$w=4$", why: "stationary weight" },
        { do: "Differentiate again", result: "$J''(w)=1$", why: "curvature of the loss" },
        { do: "Evaluate at $w=4$", result: "$1>0$", why: "positive curvature means local minimum" },
        { do: "Evaluate $J(4)$", result: "$0$", why: "best achievable loss" }
      ], answer: "Local minimum at $w=4$ with loss $0$." }
    ],
    applications: [
      { title: "Newton optimization", background: "Newton's method divides gradient by curvature, so the sign of $f''$ matters.", numbers: "For $J(w)=(w-4)^2$, at $w=1$ the step is $J'/J''=-6/2=-3$, so $w$ jumps to $4$." },
      { title: "Checking minima in ML", background: "A positive second derivative in one dimension means a stationary loss is locally bowl-shaped.", numbers: "$J(w)=0.5(w-2)^2+1$ has $J''=1>0$, so $w=2$ is a local minimum with loss $1$." },
      { title: "Rejecting maxima", background: "Gradient zero alone can fool an optimizer if the point is a peak.", numbers: "$J(w)=-w^2$ has $J'(0)=0$ and $J''(0)=-2$, so $w=0$ is a maximum, not a minimum." },
      { title: "Saddle warnings", background: "In higher dimensions, a zero or mixed curvature test warns that classification needs the Hessian.", numbers: "For $f(x)=x^3$, $f''(0)=0$; nearby values $-0.001$ and $0.001$ show no max or min." },
      { title: "Hyperparameter curves", background: "A validation curve's local best can be confirmed by upward curvature.", numbers: "If $E(\\lambda)=10(\\lambda-0.1)^2+0.2$, then $E''=20>0$ and the best is $\\lambda=0.1$." },
      { title: "Economics of compute", background: "Cost curves often have stationary points that should be minima, not maxima.", numbers: "For $C(b)=b+64/b$, $C'(b)=1-64/b^2$ gives $b=8$, and $C''(8)=128/512=0.25>0$." }
    ],
    applicationsClose: "Curvature is a local verdict: bowl, cap, or not enough information yet.",
    takeaways: [
      "At $f'(c)=0$, $f''(c)>0$ means local minimum and $f''(c)<0$ means local maximum.",
      "$f''(c)=0$ is inconclusive, not a classification.",
      "The test is the quadratic approximation made practical."
    ]
  },

  "math-01-34": {
    id: "math-01-34",
    title: "Inflection points",
    tagline: "An inflection point is where the graph truly changes the way it bends.",
    connections: {
      buildsOn: ["concavity", "second derivatives", "sign charts"],
      leadsTo: ["curve sketching", "Taylor approximation", "optimization geometry"],
      usedWith: ["critical points", "the second derivative test", "continuity"]
    },
    motivation:
      "<p>Concavity tells whether a graph bends like a bowl or like a cap. Sometimes the graph switches from one kind of bending to the other, and that switch can mark a change in acceleration, confidence, or saturation.</p>" +
      "<p>An <b>inflection point</b> is not just where $f''=0$. It is where concavity actually changes. That small distinction saves a lot of mistakes.</p>",
    definition:
      "<p>A point $(c,f(c))$ is an <b>inflection point</b> if $f$ is continuous at $c$ and the concavity changes at $c$: from up to down or from down to up. Candidates occur where $f''(c)=0$ or where $f''$ is undefined, but the sign of $f''$ on both sides decides.</p>" +
      "<p><b>Assumptions that matter:</b> the function must be continuous at the point; $f''=0$ is only a candidate; and concavity must change across the point, not merely touch zero and keep the same sign.</p>",
    worked: {
      problem: "Find the inflection point of $f(x)=x^3-3x$.",
      skills: ["second derivatives", "sign charts", "concavity change"],
      strategy: "Find where $f''$ is zero, then test concavity on both sides.",
      steps: [
        { do: "Differentiate once", result: "$f'(x)=3x^2-3$", why: "prepare for the second derivative" },
        { do: "Differentiate again", result: "$f''(x)=6x$", why: "concavity comes from $f''$" },
        { do: "Set $f''=0$", result: "$x=0$", why: "candidate for an inflection point" },
        { do: "Test $x=-1$", result: "$f''(-1)=-6$", why: "concave down on the left" },
        { do: "Test $x=1$", result: "$f''(1)=6$", why: "concave up on the right" },
        { do: "Evaluate $f(0)$", result: "$0$", why: "give the point" }
      ],
      verify: "The sign of $f''$ changes from negative to positive, so this is a real concavity change, not just a zero.",
      answer: "Inflection point: $(0,0)$.",
      connects: "Inflection points become landmarks when sketching the full curve."
    },
    practice: [
      { problem: "Find the inflection point of $f(x)=x^3$.", steps: [
        { do: "Differentiate once", result: "$f'(x)=3x^2$", why: "first derivative" },
        { do: "Differentiate again", result: "$f''(x)=6x$", why: "concavity" },
        { do: "Set $f''=0$", result: "$x=0$", why: "candidate" },
        { do: "Test left and right", result: "$f''(-1)<0,\\ f''(1)>0$", why: "the sign changes" },
        { do: "Evaluate $f(0)$", result: "$0$", why: "point coordinate" }
      ], answer: "Inflection point: $(0,0)$." },
      { problem: "Does $f(x)=x^4$ have an inflection point at $0$?", steps: [
        { do: "Differentiate once", result: "$f'(x)=4x^3$", why: "prepare" },
        { do: "Differentiate again", result: "$f''(x)=12x^2$", why: "concavity" },
        { do: "Set $f''=0$", result: "$x=0$", why: "candidate" },
        { do: "Test $x=-1$", result: "$f''(-1)=12>0$", why: "concave up on the left" },
        { do: "Test $x=1$", result: "$f''(1)=12>0$", why: "concave up on the right" }
      ], answer: "No. $f''(0)=0$, but concavity does not change." },
      { problem: "Find the inflection points of $f(x)=x^4-6x^2$.", steps: [
        { do: "Differentiate once", result: "$f'(x)=4x^3-12x$", why: "first derivative" },
        { do: "Differentiate again", result: "$f''(x)=12x^2-12$", why: "second derivative" },
        { do: "Set $f''=0$", result: "$x^2=1$", why: "solve $12x^2-12=0$" },
        { do: "List candidates", result: "$x=-1,1$", why: "possible sign changes" },
        { do: "Test intervals", result: "$+,-,+$", why: "sample $-2,0,2$" },
        { do: "Evaluate function values", result: "$f(\\pm1)=-5$", why: "coordinates" }
      ], answer: "Inflection points: $(-1,-5)$ and $(1,-5)$." },
      { problem: "Find the inflection point of $f(x)=\\ln(1+x^2)$.", steps: [
        { do: "Differentiate once", result: "$f'(x)=\\dfrac{2x}{1+x^2}$", why: "chain rule" },
        { do: "Differentiate again", result: "$f''(x)=\\dfrac{2(1-x^2)}{(1+x^2)^2}$", why: "quotient rule" },
        { do: "Set the numerator to zero", result: "$1-x^2=0$", why: "the denominator is always positive" },
        { do: "Solve", result: "$x=\\pm1$", why: "candidate points" },
        { do: "Test signs", result: "$-,+,-$", why: "$1-x^2$ controls the sign" },
        { do: "Evaluate $f(\\pm1)$", result: "$\\ln2$", why: "coordinates" }
      ], answer: "Inflection points: $(-1,\\ln2)$ and $(1,\\ln2)$." },
      { problem: "For sigmoid $\\sigma(x)=1/(1+e^{-x})$, use $\\sigma''(x)=\\sigma(x)(1-\\sigma(x))(1-2\\sigma(x))$ to find the inflection point.", steps: [
        { do: "Set $\\sigma''(x)=0$", result: "$\\sigma(x)(1-\\sigma(x))(1-2\\sigma(x))=0$", why: "inflection candidates" },
        { do: "Use $0<\\sigma(x)<1$", result: "$\\sigma(x)\\ne0$ and $1-\\sigma(x)\\ne0$", why: "finite sigmoid outputs are strictly inside $(0,1)$" },
        { do: "Solve the remaining factor", result: "$1-2\\sigma(x)=0$", why: "only possible zero" },
        { do: "Find $\\sigma(x)$", result: "$\\sigma(x)=1/2$", why: "halfway probability" },
        { do: "Solve for $x$", result: "$x=0$", why: "sigmoid equals $1/2$ at zero logit" }
      ], answer: "Inflection point: $(0,1/2)$, where sigmoid changes from bending up to bending down." }
    ],
    applications: [
      { title: "Sigmoid classifiers", background: "The sigmoid changes from accelerating to saturating at probability $0.5$.", numbers: "$\\sigma(0)=0.5$ and $\\sigma'(0)=0.25$, the largest slope on the curve." },
      { title: "Training curves", background: "Loss often falls slowly, then rapidly, then slowly again; inflection marks the speed transition.", numbers: "A logistic decay midpoint at epoch $20$ has the steepest drop there, such as loss moving about $0.05$ per epoch." },
      { title: "Epidemic and diffusion models", background: "S-shaped adoption curves use inflection points to mark peak growth rate.", numbers: "For $N(t)=1000/(1+e^{-0.3(t-10)})$, the inflection is at $t=10$ with $N=500$." },
      { title: "Activation saturation", background: "Inflection separates the nearly linear central region from saturation behavior.", numbers: "For sigmoid, at $x=0$ slope is $0.25$; at $x=4$ slope is about $0.0177$." },
      { title: "Rendering and splines", background: "Computer graphics uses curvature changes to shape smooth curves.", numbers: "For $y=x^3-3x$, the bend changes at $x=0$, where $y=0$." },
      { title: "Model calibration", background: "Calibration curves can reveal where confidence starts becoming over- or under-responsive.", numbers: "A fitted curve $p(s)=1/(1+e^{-2(s-0.7)})$ has inflection at score $s=0.7$ and probability $0.5$." }
    ],
    applicationsClose: "Inflection points are bend-change landmarks: they say where the graph's local geometry changes its mind.",
    takeaways: [
      "Inflection requires a change in concavity, not just $f''=0$.",
      "Candidates come from $f''=0$ or $f''$ undefined, then a sign chart decides.",
      "The function must be continuous at the inflection point."
    ]
  },

  "math-01-35": {
    id: "math-01-35",
    title: "The Mean Value Theorem",
    tagline: "Some instant has the same slope as the whole trip's average slope.",
    connections: {
      buildsOn: ["continuity", "derivatives", "secant and tangent slopes"],
      leadsTo: ["Taylor's theorem", "error bounds", "optimization guarantees"],
      usedWith: ["Rolle's theorem", "increasing functions", "linear approximation"]
    },
    motivation:
      "<p>If you drive $120$ miles in $2$ hours, your average speed is $60$ mph. Even if your speed changed the whole time, there must have been at least one instant when the speedometer read $60$.</p>" +
      "<p>The <b>Mean Value Theorem</b> is that everyday fact for functions. It connects a whole-interval change to an instantaneous derivative somewhere inside the interval.</p>",
    definition:
      "<p>If $f$ is continuous on $[a,b]$ and differentiable on $(a,b)$, then there is at least one $c\\in(a,b)$ such that $$f'(c)=\\frac{f(b)-f(a)}{b-a}.$$ The right side is the secant slope across the interval; the theorem guarantees a tangent slope that matches it.</p>" +
      "<p><b>Assumptions that matter:</b> continuity on the closed interval prevents jumps; differentiability on the open interval prevents corners or cusps; and the theorem guarantees existence of at least one $c$, not necessarily a unique one.</p>",
    worked: {
      problem: "For $f(x)=x^2$ on $[1,3]$, find a point $c$ guaranteed by the Mean Value Theorem.",
      skills: ["average rate of change", "derivatives", "solving equations"],
      strategy: "Compute the secant slope, compute $f'$, then set them equal.",
      steps: [
        { do: "Check continuity and differentiability", result: "$x^2$ is continuous and differentiable", why: "polynomials satisfy the hypotheses" },
        { do: "Compute $f(3)$", result: "$9$", why: "right endpoint value" },
        { do: "Compute $f(1)$", result: "$1$", why: "left endpoint value" },
        { do: "Compute the secant slope", result: "$\\dfrac{9-1}{3-1}=4$", why: "average rate of change" },
        { do: "Differentiate", result: "$f'(x)=2x$", why: "instantaneous rate" },
        { do: "Set $f'(c)=4$", result: "$2c=4$", why: "MVT conclusion" },
        { do: "Solve", result: "$c=2$", why: "the point lies inside $(1,3)$" }
      ],
      verify: "The tangent slope at $x=2$ is $4$, exactly matching the secant slope from $(1,1)$ to $(3,9)$.",
      answer: "$c=2$.",
      connects: "MVT is the bridge from an interval guarantee to a derivative statement."
    },
    practice: [
      { problem: "Find the MVT point for $f(x)=x^2+1$ on $[0,2]$.", steps: [
        { do: "Check hypotheses", result: "polynomial", why: "continuous and differentiable" },
        { do: "Compute endpoint values", result: "$f(2)=5,\\ f(0)=1$", why: "needed for average slope" },
        { do: "Compute secant slope", result: "$\\frac{5-1}{2-0}=2$", why: "average rate" },
        { do: "Differentiate", result: "$f'(x)=2x$", why: "instantaneous slope" },
        { do: "Set equal", result: "$2c=2$", why: "MVT" },
        { do: "Solve", result: "$c=1$", why: "inside $(0,2)$" }
      ], answer: "$c=1$." },
      { problem: "Find the MVT point for $f(x)=\\sqrt{x}$ on $[1,4]$.", steps: [
        { do: "Check hypotheses", result: "$\\sqrt{x}$ is continuous on $[1,4]$ and differentiable on $(1,4)$", why: "the interval stays positive" },
        { do: "Compute endpoint values", result: "$f(4)=2,\\ f(1)=1$", why: "secant slope" },
        { do: "Compute secant slope", result: "$\\frac{1}{3}$", why: "$(2-1)/(4-1)$" },
        { do: "Differentiate", result: "$f'(x)=\\frac{1}{2\\sqrt{x}}$", why: "power rule" },
        { do: "Set equal", result: "$\\frac{1}{2\\sqrt{c}}=\\frac13$", why: "MVT" },
        { do: "Solve", result: "$c=\\frac94$", why: "$2\\sqrt c=3$" }
      ], answer: "$c=9/4$." },
      { problem: "Find a point guaranteed by MVT for $f(x)=\\ln x$ on $[1,e]$.", steps: [
        { do: "Check hypotheses", result: "$\\ln x$ is continuous and differentiable for $x>0$", why: "the interval is positive" },
        { do: "Compute endpoint values", result: "$f(e)=1,\\ f(1)=0$", why: "log facts" },
        { do: "Compute secant slope", result: "$\\frac{1}{e-1}$", why: "average rate" },
        { do: "Differentiate", result: "$f'(x)=1/x$", why: "instantaneous slope" },
        { do: "Set equal", result: "$1/c=1/(e-1)$", why: "MVT" },
        { do: "Solve", result: "$c=e-1$", why: "inside $(1,e)$" }
      ], answer: "$c=e-1$." },
      { problem: "Show why MVT does not apply to $f(x)=|x|$ on $[-1,1]$.", steps: [
        { do: "Check continuity", result: "$|x|$ is continuous on $[-1,1]$", why: "no jumps" },
        { do: "Check differentiability", result: "not differentiable at $x=0$", why: "there is a corner" },
        { do: "Compute secant slope anyway", result: "$\\frac{1-1}{2}=0$", why: "average change is zero" },
        { do: "Check side derivatives", result: "$-1$ on the left and $1$ on the right", why: "no derivative at $0$" },
        { do: "State the failure", result: "MVT hypotheses fail", why: "differentiability on the open interval is required" }
      ], answer: "MVT does not apply because $|x|$ is not differentiable at $0$." },
      { problem: "A training loss drops from $1.2$ to $0.6$ over $10$ epochs and is smooth. What derivative value is guaranteed at some epoch?", steps: [
        { do: "Let $L(t)$ be the loss", result: "$L(0)=1.2,\\ L(10)=0.6$", why: "translate the story" },
        { do: "Assume hypotheses", result: "continuous on $[0,10]$ and differentiable on $(0,10)$", why: "the problem says smooth" },
        { do: "Compute average slope", result: "$\\frac{0.6-1.2}{10-0}$", why: "secant slope" },
        { do: "Simplify", result: "$-0.06$", why: "loss decreased by $0.6$ over $10$ epochs" },
        { do: "Apply MVT", result: "$L'(c)=-0.06$", why: "some instant matches the average rate" }
      ], answer: "At some epoch $c\\in(0,10)$, $L'(c)=-0.06$ loss units per epoch." }
    ],
    applications: [
      { title: "Speed monitoring", background: "The classic interpretation says average speed forces an instant with that speed.", numbers: "A car covering $120$ miles in $2$ hours has average speed $60$ mph, so some instant was $60$ mph." },
      { title: "Training diagnostics", background: "A smooth loss curve with known endpoints must have an instantaneous slope matching the average drop.", numbers: "Loss $1.2$ to $0.6$ over $10$ epochs guarantees $L'(c)=-0.06$ somewhere." },
      { title: "Lipschitz bounds", background: "If derivatives are bounded, MVT bounds output changes.", numbers: "If $|f'|\\le3$ and inputs differ by $0.2$, outputs differ by at most $0.6$." },
      { title: "Gradient clipping intuition", background: "Bounding gradients bounds how fast model scores can change along a line.", numbers: "With gradient norm at most $5$, a parameter move of length $0.01$ changes loss by at most about $0.05$." },
      { title: "Numerical error", background: "MVT helps turn a derivative maximum into an approximation error bound.", numbers: "For $\\sin x$, $|\\cos x|\\le1$, so changing $x$ by $0.001$ changes $\\sin x$ by at most $0.001$." },
      { title: "Database latency trends", background: "If latency changes smoothly over load, an average increase reflects some instantaneous sensitivity.", numbers: "Latency from $80$ ms to $140$ ms as QPS goes $1000$ to $2000$ gives slope $0.06$ ms per QPS somewhere." }
    ],
    applicationsClose: "MVT is the guarantee behind many estimates: a whole-interval change has an instantaneous witness.",
    takeaways: [
      "Continuity on $[a,b]$ and differentiability on $(a,b)$ are required.",
      "The theorem guarantees $f'(c)=\\frac{f(b)-f(a)}{b-a}$ for some interior $c$.",
      "It proves existence, not necessarily uniqueness."
    ]
  },

  "math-01-36": {
    id: "math-01-36",
    title: "Curve sketching",
    tagline: "Turn derivatives into a readable map of a graph.",
    connections: {
      buildsOn: ["critical points", "first derivative test", "concavity", "inflection points"],
      leadsTo: ["applied optimization", "Taylor approximation", "multivariable calculus"],
      usedWith: ["asymptotes", "intercepts", "domain analysis"]
    },
    motivation:
      "<p>Graphing is not guessing. Once you can read derivatives, you can build a trustworthy sketch from a small set of landmarks: intercepts, increasing intervals, extrema, concavity, and inflection points.</p>" +
      "<p><b>Curve sketching</b> is the organized version of that process. It turns local calculus facts into a global picture, the same way a few map features can orient you in a whole city.</p>",
    definition:
      "<p>To sketch a differentiable function, identify the domain, intercepts, asymptotic behavior, critical points from $f'$, increasing and decreasing intervals from the sign of $f'$, concavity from $f''$, and inflection points where concavity changes. Then plot the landmarks and connect them consistently.</p>" +
      "<p><b>Assumptions that matter:</b> the sketch is only as good as the domain and sign charts; endpoints and asymptotes need separate attention; and a clean sketch should honor every derivative sign and concavity interval you found.</p>",
    worked: {
      problem: "Sketch the key features of $f(x)=x^3-3x^2$.",
      skills: ["critical points", "first derivative test", "concavity", "inflection points"],
      strategy: "Build the graph from derivative landmarks rather than plotting random points.",
      steps: [
        { do: "State the domain", result: "$(-\\infty,\\infty)$", why: "polynomial" },
        { do: "Find intercepts", result: "$x^2(x-3)=0$, so $x=0,3$; $y=0$", why: "factor the function" },
        { do: "Differentiate once", result: "$f'(x)=3x^2-6x$", why: "increasing and decreasing" },
        { do: "Factor $f'$", result: "$3x(x-2)$", why: "critical numbers" },
        { do: "Build the $f'$ sign chart", result: "$+,-,+$ across $0$ and $2$", why: "test $-1,1,3$" },
        { do: "Classify extrema", result: "local max at $(0,0)$, local min at $(2,-4)$", why: "first derivative changes $+$ to $-$, then $-$ to $+$" },
        { do: "Differentiate twice", result: "$f''(x)=6x-6$", why: "concavity" },
        { do: "Find the inflection point", result: "$x=1$, $f(1)=-2$", why: "$f''$ changes sign there" }
      ],
      verify: "The graph rises to $(0,0)$, falls through the inflection point $(1,-2)$ to $(2,-4)$, then rises and crosses again at $x=3$.",
      answer: "Key sketch: increasing on $(-\\infty,0)$ and $(2,\\infty)$, decreasing on $(0,2)$, concave down before $1$, concave up after $1$.",
      connects: "Curve sketching gathers the previous lessons into one coherent graph story."
    },
    practice: [
      { problem: "Sketch the key features of $f(x)=x^2-4$.", steps: [
        { do: "State the domain", result: "$(-\\infty,\\infty)$", why: "polynomial" },
        { do: "Find intercepts", result: "$x=\\pm2$, $y=-4$", why: "solve $x^2-4=0$ and evaluate $f(0)$" },
        { do: "Differentiate", result: "$f'(x)=2x$", why: "increasing and decreasing" },
        { do: "Find critical number", result: "$x=0$", why: "set $2x=0$" },
        { do: "Use signs of $f'$", result: "$-$ then $+$", why: "decreasing then increasing" },
        { do: "Compute $f''$", result: "$2>0$", why: "concave up everywhere" }
      ], answer: "Upward parabola with vertex $(0,-4)$ and intercepts $(-2,0)$ and $(2,0)$." },
      { problem: "Sketch the key features of $f(x)=x^3-3x$.", steps: [
        { do: "Find intercepts", result: "$x(x^2-3)=0$, so $x=0,\\pm\\sqrt3$", why: "factor" },
        { do: "Differentiate", result: "$f'(x)=3x^2-3$", why: "critical points" },
        { do: "Find critical numbers", result: "$x=\\pm1$", why: "solve $x^2=1$" },
        { do: "Read $f'$ signs", result: "$+,-,+$", why: "increasing, decreasing, increasing" },
        { do: "Differentiate twice", result: "$f''(x)=6x$", why: "concavity" },
        { do: "Find inflection", result: "$(0,0)$", why: "$f''$ changes sign at $0$" }
      ], answer: "Local max at $(-1,2)$, local min at $(1,-2)$, inflection at $(0,0)$." },
      { problem: "Sketch the key features of $f(x)=\\frac{1}{x}$.", steps: [
        { do: "State the domain", result: "$x\\ne0$", why: "division by zero is not allowed" },
        { do: "Identify asymptotes", result: "$x=0$ and $y=0$", why: "vertical blow-up and horizontal limit" },
        { do: "Differentiate", result: "$f'(x)=-1/x^2$", why: "monotonicity" },
        { do: "Read the sign of $f'$", result: "negative on both intervals", why: "$x^2>0$" },
        { do: "Differentiate twice", result: "$f''(x)=2/x^3$", why: "concavity" },
        { do: "Read concavity", result: "down on $(-\\infty,0)$, up on $(0,\\infty)$", why: "the sign of $x^3$ changes" }
      ], answer: "Two decreasing branches with asymptotes $x=0$ and $y=0$; left branch concave down, right branch concave up." },
      { problem: "Sketch the key features of $f(x)=x e^{-x}$ for $x\\ge0$.", steps: [
        { do: "State the domain", result: "$[0,\\infty)$", why: "given restriction" },
        { do: "Find intercept", result: "$f(0)=0$", why: "endpoint value" },
        { do: "Differentiate", result: "$f'(x)=e^{-x}(1-x)$", why: "product rule" },
        { do: "Find critical number", result: "$x=1$", why: "$e^{-x}$ is never zero" },
        { do: "Read signs", result: "$+$ then $-$", why: "increases before $1$, decreases after" },
        { do: "Differentiate twice", result: "$f''(x)=e^{-x}(x-2)$", why: "concavity" },
        { do: "Find inflection", result: "$x=2$", why: "concavity changes there" }
      ], answer: "Starts at $0$, peaks at $(1,1/e)$, inflects at $(2,2/e^2)$, then decays toward $0$." },
      { problem: "Sketch the one-dimensional loss $J(w)=w^4-2w^2$.", steps: [
        { do: "Find intercepts", result: "$w=0,\\ \\pm\\sqrt2$", why: "$w^2(w^2-2)=0$" },
        { do: "Differentiate", result: "$J'(w)=4w(w-1)(w+1)$", why: "critical points" },
        { do: "Read $J'$ signs", result: "$-,+,-,+$", why: "test intervals around $-1,0,1$" },
        { do: "Classify extrema", result: "minima at $\\pm1$, maximum at $0$", why: "first derivative sign changes" },
        { do: "Differentiate twice", result: "$J''(w)=12w^2-4$", why: "concavity" },
        { do: "Find inflection points", result: "$w=\\pm1/\\sqrt3$", why: "solve $12w^2-4=0$" }
      ], answer: "A double-well loss: minima at $(-1,-1)$ and $(1,-1)$, central maximum at $(0,0)$, inflections at $\\pm1/\\sqrt3$." }
    ],
    applications: [
      { title: "Loss landscape slices", background: "Plotting a one-dimensional slice through parameter space helps diagnose minima and saddles.", numbers: "$J(w)=w^4-2w^2$ has minima $J=-1$ at $w=\\pm1$ and a maximum $J=0$ at $w=0$." },
      { title: "Activation functions", background: "Sketching activations reveals saturation, linear regions, and curvature changes.", numbers: "Sigmoid passes through $(0,0.5)$ with slope $0.25$ and has horizontal limits $0$ and $1$." },
      { title: "Throughput curves", background: "Systems performance often rises, peaks, and falls as overhead dominates.", numbers: "$T(b)=b e^{-b/100}$ peaks at $b=100$ with value about $36.8$." },
      { title: "Regularization paths", background: "A curve of validation error against penalty strength can show the best region visually.", numbers: "$E(\\lambda)=5(\\lambda-0.2)^2+0.1$ has a minimum $0.1$ at $\\lambda=0.2$." },
      { title: "Probability densities", background: "Sketching a density checks modes, tails, and symmetry.", numbers: "For $p(x)=e^{-x^2/2}$, the maximum is at $x=0$ and $p(2)/p(0)=e^{-2}\\approx0.135$." },
      { title: "Latency under load", background: "Asymptotes warn where a service approaches capacity.", numbers: "$D(\\rho)=1/(1-\\rho)$ is $5$ at $\\rho=0.8$ and $10$ at $\\rho=0.9$, rising sharply near $1$." }
    ],
    applicationsClose: "A good sketch is compressed understanding: signs, bends, landmarks, and limits all in one picture.",
    takeaways: [
      "Start with domain, intercepts, and asymptotic behavior.",
      "Use $f'$ for increasing intervals and extrema; use $f''$ for concavity and inflection.",
      "Connect landmarks in a way that respects every sign chart."
    ]
  },

  "math-01-37": {
    id: "math-01-37",
    title: "Applied optimization",
    tagline: "Translate a real constraint into a function, then use calculus to choose the best value.",
    connections: {
      buildsOn: ["critical points", "first derivative test", "second derivative test", "curve sketching"],
      leadsTo: ["gradient descent", "constrained optimization", "multivariable optimization"],
      usedWith: ["algebraic modeling", "domain constraints", "convexity"]
    },
    motivation:
      "<p>Optimization is where derivatives start making decisions. We are not just describing a graph; we are choosing the least cost, greatest area, fastest runtime, or smallest loss.</p>" +
      "<p><b>Applied optimization</b> has a rhythm: define variables, write the quantity to optimize, use constraints to get one variable, differentiate, test candidates, and interpret the answer in the original units. That rhythm is also the heartbeat of machine learning.</p>",
    definition:
      "<p>An applied optimization problem asks for the maximum or minimum of an objective function on a domain. After modeling the objective as $F(x)$, candidates come from critical points inside the domain and endpoints on the boundary. Derivatives classify interior candidates; endpoint values must be compared directly.</p>" +
      "<p><b>Assumptions that matter:</b> the objective must match the real quantity being optimized; the domain and units matter; constraints must be substituted correctly; and a local optimum is not automatically the absolute optimum unless the domain, endpoints, or convexity justify it.</p>",
    worked: {
      problem: "A rectangle has perimeter $40$ meters. What dimensions maximize its area?",
      skills: ["modeling", "constraints", "critical points", "second derivative test"],
      strategy: "Use the perimeter constraint to write area as a one-variable function, then maximize it.",
      steps: [
        { do: "Define variables", result: "$x$ and $y$ are side lengths", why: "optimization starts with named quantities" },
        { do: "Write the constraint", result: "$2x+2y=40$", why: "perimeter is fixed" },
        { do: "Solve for $y$", result: "$y=20-x$", why: "one-variable objective" },
        { do: "Write the area", result: "$A=x(20-x)$", why: "area is length times width" },
        { do: "Expand", result: "$A(x)=20x-x^2$", why: "easier to differentiate" },
        { do: "Differentiate", result: "$A'(x)=20-2x$", why: "critical points locate interior optima" },
        { do: "Set $A'=0$", result: "$x=10$", why: "solve $20-2x=0$" },
        { do: "Find $y$", result: "$y=10$", why: "use the constraint" },
        { do: "Check curvature", result: "$A''(x)=-2$", why: "negative means a maximum" }
      ],
      verify: "The domain is $0<x<20$. At the edges area approaches $0$, while $10\\times10=100$, so the interior maximum is sensible.",
      answer: "The maximum-area rectangle is $10$ m by $10$ m, with area $100$ m$^2$.",
      connects: "The same modeling pattern becomes loss minimization when the objective is prediction error."
    },
    practice: [
      { problem: "Find two positive numbers with sum $20$ whose product is as large as possible.", steps: [
        { do: "Define one number", result: "$x$", why: "choose a variable" },
        { do: "Use the constraint", result: "the other number is $20-x$", why: "the sum is fixed" },
        { do: "Write the product", result: "$P(x)=x(20-x)$", why: "objective function" },
        { do: "Differentiate", result: "$P'(x)=20-2x$", why: "find critical points" },
        { do: "Set $P'=0$", result: "$x=10$", why: "interior candidate" },
        { do: "Find the other number", result: "$10$", why: "$20-10=10$" },
        { do: "Check $P''$", result: "$-2<0$", why: "maximum" }
      ], answer: "The numbers are $10$ and $10$; the maximum product is $100$." },
      { problem: "A closed box with square base has volume $32$ cm$^3$. Minimize its surface area.", steps: [
        { do: "Let base side be $x$ and height be $h$", result: "$x^2h=32$", why: "volume constraint" },
        { do: "Solve for $h$", result: "$h=32/x^2$", why: "one variable" },
        { do: "Write surface area", result: "$S=2x^2+4xh$", why: "top and bottom plus four sides" },
        { do: "Substitute $h$", result: "$S(x)=2x^2+128/x$", why: "objective in $x$" },
        { do: "Differentiate", result: "$S'(x)=4x-128/x^2$", why: "critical point" },
        { do: "Set $S'=0$", result: "$4x^3=128$", why: "multiply by $x^2$" },
        { do: "Solve for $x$", result: "$x=\\sqrt[3]{32}$", why: "$x^3=32$" },
        { do: "Find $h$", result: "$h=32/x^2=x$", why: "a cube minimizes area" }
      ], answer: "The box is a cube with side $\\sqrt[3]{32}\\approx3.17$ cm." },
      { problem: "Minimize the cost $C(q)=q+100/q$ for $q>0$.", steps: [
        { do: "State the domain", result: "$q>0$", why: "quantity must be positive" },
        { do: "Differentiate", result: "$C'(q)=1-100/q^2$", why: "find candidates" },
        { do: "Set $C'=0$", result: "$1=100/q^2$", why: "stationary cost" },
        { do: "Solve", result: "$q=10$", why: "positive root only" },
        { do: "Differentiate again", result: "$C''(q)=200/q^3$", why: "classification" },
        { do: "Evaluate curvature", result: "$C''(10)=0.2>0$", why: "local minimum" },
        { do: "Evaluate cost", result: "$C(10)=20$", why: "minimum value" }
      ], answer: "Minimum cost is $20$ at $q=10$." },
      { problem: "A model score is $s(w)=4w-w^2$. Choose $w$ to maximize the score.", steps: [
        { do: "State the objective", result: "$s(w)=4w-w^2$", why: "maximize score" },
        { do: "Differentiate", result: "$s'(w)=4-2w$", why: "stationary point" },
        { do: "Set $s'=0$", result: "$w=2$", why: "solve $4-2w=0$" },
        { do: "Differentiate again", result: "$s''(w)=-2$", why: "classification" },
        { do: "Classify", result: "maximum", why: "negative curvature" },
        { do: "Evaluate score", result: "$s(2)=4$", why: "best score value" }
      ], answer: "Choose $w=2$ for maximum score $4$." },
      { problem: "Minimize the one-weight ML loss $J(w)=(w-5)^2+0.1w^2$.", steps: [
        { do: "Expand only the derivative mentally", result: "$J'(w)=2(w-5)+0.2w$", why: "differentiate data loss plus L2 penalty" },
        { do: "Collect terms", result: "$J'(w)=2.2w-10$", why: "combine the gradient pieces" },
        { do: "Set $J'=0$", result: "$2.2w=10$", why: "stationary point" },
        { do: "Solve for $w$", result: "$w=\\frac{50}{11}\\approx4.545$", why: "regularization pulls toward zero" },
        { do: "Differentiate again", result: "$J''(w)=2.2$", why: "curvature" },
        { do: "Classify", result: "minimum", why: "positive curvature" }
      ], answer: "The minimizing weight is $w=50/11\\approx4.545$." }
    ],
    applications: [
      { title: "Machine learning loss", background: "Training is applied optimization: choose parameters that minimize prediction error plus penalties.", numbers: "For $J(w)=(w-5)^2+0.1w^2$, the minimizer is $w=50/11\\approx4.545$, not $5$, because the penalty pulls down." },
      { title: "Ridge regression intuition", background: "L2 regularization trades fit for smaller weights.", numbers: "If data wants $w=10$ and penalty is $\\lambda w^2$ with $\\lambda=1$, minimizing $(w-10)^2+w^2$ gives $w=5$." },
      { title: "Batch size tuning", background: "Throughput can improve with batch size until memory or latency costs dominate.", numbers: "For cost $C(b)=b/100+64/b$, $C'(b)=0.01-64/b^2$, so $b=80$ minimizes the toy cost." },
      { title: "Ad budget allocation", background: "A concave response curve models diminishing returns from spend.", numbers: "Revenue $R(x)=100\\ln(1+x)$ and cost $2x$ gives $R'(x)=100/(1+x)-2$, so optimal spend is $x=49$." },
      { title: "Serving latency tradeoff", background: "Caching reduces lookup time but costs memory; the best cache size balances both.", numbers: "If $C(c)=500/c+2c$, then $c=\\sqrt{250}\\approx15.8$ minimizes cost." },
      { title: "Model threshold selection", background: "A decision threshold can maximize a simplified utility from true positives minus false positives.", numbers: "If $U(t)=3t(1-t)-0.2t$, then $U'(t)=2.8-6t$, so $t\\approx0.467$ is optimal in the toy model." },
      { title: "Experiment duration", background: "Longer experiments reduce noise but cost time, so there is often a sweet spot.", numbers: "For $C(d)=d+36/d$, $C'(d)=1-36/d^2$, giving $d=6$ days as the minimum." }
    ],
    applicationsClose: "Applied optimization is one pattern in many uniforms: model the quantity, respect the constraint, differentiate, test, and translate back to the real decision.",
    takeaways: [
      "Define variables and constraints before differentiating.",
      "Interior candidates come from critical points; endpoints and boundaries must also be checked.",
      "ML training is applied optimization with loss as the objective and model parameters as the variables."
    ]
  }
};
