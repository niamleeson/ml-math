module.exports = {
  "math-01-11": {
    id: "math-01-11",
    title: "Limits at infinity",
    tagline: "When the input grows without bound, a limit asks what long-run value the function settles toward.",
    connections: {
      buildsOn: ["Limits: definition and computation", "rational functions", "dominant terms"],
      leadsTo: ["asymptotes", "end behavior", "improper integrals"],
      usedWith: ["polynomial growth", "rational simplification", "sequences and convergence"]
    },
    motivation:
      "<p>You already know how to ask what happens near one input, like $x\\to2$. Now stretch the question: what happens when $x$ keeps going, past $10$, past $10^6$, with no final stopping point?</p>" +
      "<p>A <b>limit at infinity</b> gives language for long-run behavior. It is the math behind saying a curve levels off, a ratio settles, or one term eventually overwhelms another. The mental picture is a road that never ends, but whose elevation may approach a steady height.</p>",
    definition:
      "<p>$\\lim_{x\\to\\infty} f(x)=L$ means $f(x)$ can be made as close to $L$ as we like by taking $x$ sufficiently large. The negative-infinity version, $\\lim_{x\\to-\\infty}f(x)=L$, looks far to the left. For rational functions, divide numerator and denominator by the highest power of $x$ that appears in the denominator, then use terms like $1/x\\to0$.</p>" +
      "<p><b>Assumptions that matter:</b> $x\\to\\infty$ is not a number to substitute. We study eventual behavior. If the numerator degree is smaller than the denominator degree, the limit is $0$; equal degrees give the ratio of leading coefficients; larger numerator degree usually grows without bound or has no finite limit.</p>",
    worked: {
      problem: "Compute $\\displaystyle\\lim_{x\\to\\infty}\\frac{3x^2-5x+1}{2x^2+7}$.",
      skills: ["dominant terms", "rational limits", "division by powers of $x$"],
      strategy: "Both top and bottom grow like $x^2$. Divide by $x^2$ so the lower-order terms vanish.",
      steps: [
        { do: "Identify the highest denominator power", result: "$x^2$", why: "the denominator's leading term is $2x^2$" },
        { do: "Divide every term by $x^2$", result: "$\\dfrac{3-5/x+1/x^2}{2+7/x^2}$", why: "this exposes the long-run constants" },
        { do: "Take $x\\to\\infty$ in $5/x$", result: "$0$", why: "a fixed number divided by a huge number shrinks to zero" },
        { do: "Take $x\\to\\infty$ in $1/x^2$ and $7/x^2$", result: "$0$ and $0$", why: "higher powers in the denominator shrink even faster" },
        { do: "Evaluate the remaining fraction", result: "$\\dfrac32$", why: "only the leading coefficients remain" }
      ],
      verify: "At $x=100$, the fraction is $29401/20007\\approx1.4695$; at $x=1000$, it is $2995001/2000007\\approx1.4975$, moving toward $1.5$.",
      answer: "$\\displaystyle\\lim_{x\\to\\infty}\\frac{3x^2-5x+1}{2x^2+7}=\\frac32$",
      connects: "asymptotes — a finite limit at infinity becomes a horizontal line the graph approaches."
    },
    practice: [
      { problem: "$\\lim_{x\\to\\infty}\\dfrac{5x+2}{2x-7}$", steps: [
        { do: "Identify the highest denominator power", result: "$x$", why: "the denominator is linear" },
        { do: "Divide every term by $x$", result: "$\\dfrac{5+2/x}{2-7/x}$", why: "this isolates the leading coefficients" },
        { do: "Take $x\\to\\infty$", result: "$\\dfrac{5+0}{2-0}$", why: "$2/x\\to0$ and $7/x\\to0$" },
        { do: "Simplify", result: "$\\dfrac52$", why: "the long-run ratio is the leading coefficient ratio" }
      ], answer: "$\\frac52$" },
      { problem: "$\\lim_{x\\to\\infty}\\dfrac{4x-9}{x^2+1}$", steps: [
        { do: "Identify the highest denominator power", result: "$x^2$", why: "the denominator is quadratic" },
        { do: "Divide every term by $x^2$", result: "$\\dfrac{4/x-9/x^2}{1+1/x^2}$", why: "compare all terms to $x^2$" },
        { do: "Take the limit of the numerator", result: "$0-0=0$", why: "linear and constant terms are small compared with $x^2$" },
        { do: "Take the limit of the denominator", result: "$1+0=1$", why: "the leading denominator term remains" },
        { do: "Divide", result: "$0$", why: "$0/1=0$" }
      ], answer: "$0$" },
      { problem: "$\\lim_{x\\to\\infty}\\dfrac{2x^3+x}{5x^2-1}$", steps: [
        { do: "Identify dominant terms", result: "$2x^3$ over $5x^2$", why: "highest powers control end behavior" },
        { do: "Form the dominant ratio", result: "$\\dfrac{2x^3}{5x^2}=\\dfrac25x$", why: "lower-order terms do not change unbounded growth" },
        { do: "Let $x\\to\\infty$", result: "$\\dfrac25x\\to\\infty$", why: "a positive linear term grows without bound" },
        { do: "State the behavior", result: "$\\infty$", why: "there is no finite settling value" }
      ], answer: "The expression grows to $\\infty$; no finite limit." },
      { problem: "$\\lim_{x\\to-\\infty}\\dfrac{3x^3-x}{x^3+4}$", steps: [
        { do: "Identify the highest denominator power", result: "$x^3$", why: "both numerator and denominator are cubic" },
        { do: "Divide every term by $x^3$", result: "$\\dfrac{3-1/x^2}{1+4/x^3}$", why: "this works for negative large $x$ too" },
        { do: "Take $x\\to-\\infty$", result: "$\\dfrac{3-0}{1+0}$", why: "$1/x^2\\to0$ and $4/x^3\\to0$" },
        { do: "Simplify", result: "$3$", why: "leading coefficients dominate" }
      ], answer: "$3$" },
      { problem: "$\\lim_{n\\to\\infty}\\dfrac{100n\\log n}{n^2}$ for $n>1$", steps: [
        { do: "Cancel one factor of $n$", result: "$\\dfrac{100\\log n}{n}$", why: "this compares logarithmic growth to linear growth" },
        { do: "Recall the growth fact", result: "$\\dfrac{\\log n}{n}\\to0$", why: "linear growth eventually beats logarithmic growth" },
        { do: "Multiply by $100$", result: "$100\\cdot0=0$", why: "constant factors do not change a zero limit" },
        { do: "Interpret the result", result: "$0$", why: "the $n^2$ algorithm eventually dominates the $n\\log n$ term" }
      ], answer: "$0$ — useful when comparing long-run algorithm terms." }
    ],
    applications: [
      { title: "Algorithm growth", background: "Asymptotic analysis was built to compare programs when inputs become large, not just at one benchmark size.", numbers: "For costs $3n^2+20n$ and $n^2$, $\\lim_{n\\to\\infty}\\frac{3n^2+20n}{n^2}=3$, so the first is about $3$ times the second for huge $n$." },
      { title: "Learning-rate schedules", background: "Optimization often uses a step size that fades so training can settle instead of bouncing forever.", numbers: "If $\\eta_t=0.1/(1+0.01t)$, then $\\eta_{100}=0.05$, $\\eta_{900}=0.01$, and $\\lim_{t\\to\\infty}\\eta_t=0$." },
      { title: "Sigmoid saturation", background: "The logistic function became common because it smoothly maps scores to probabilities.", numbers: "$\\sigma(8)=1/(1+e^{-8})\\approx0.9997$ and $\\lim_{x\\to\\infty}\\sigma(x)=1$." },
      { title: "Regularization strength over data size", background: "Some estimators reduce penalty weight as the sample size grows so data can speak more loudly.", numbers: "With $\\lambda_n=10/\\sqrt n$, $\\lambda_{100}=1$, $\\lambda_{10000}=0.1$, and $\\lambda_n\\to0$." },
      { title: "Average of a long stream", background: "Running averages stabilize because the effect of one fixed early value fades.", numbers: "The contribution of the first example to the mean after $n$ points is $1/n$; at $n=1000$ it is $0.001$, and the limit is $0$." },
      { title: "Cache hit-rate ceilings", background: "Systems curves often level off: adding memory helps, but only up to a workload's reuse limit.", numbers: "A model $h(m)=0.95-10/(m+20)$ gives $h(80)=0.85$, $h(980)\\approx0.94$, and $\\lim_{m\\to\\infty}h(m)=0.95$." }
    ],
    applicationsClose: "Across these examples, the same question keeps returning: after the early details fade, what value or growth pattern remains?",
    takeaways: [
      "A limit at infinity studies long-run behavior, not substitution at a special number.",
      "For rational functions, compare highest powers and leading coefficients.",
      "Finite limits at infinity become horizontal asymptotes; infinite behavior means no finite settling value."
    ]
  },

  "math-01-12": {
    id: "math-01-12",
    title: "Asymptotes",
    tagline: "An asymptote is a simple line that tells the truth about a curve near an edge or far away.",
    connections: {
      buildsOn: ["Limits", "limits at infinity", "rational functions"],
      leadsTo: ["derivative-based graphing", "optimization", "model behavior near constraints"],
      usedWith: ["continuity", "domain restrictions", "polynomial division"]
    },
    motivation:
      "<p>Some graphs are busy up close but simple from far away. Others shoot upward near a forbidden input, like a wall the curve cannot cross. Asymptotes let you mark those big features before worrying about small details.</p>" +
      "<p>Think of an asymptote as a guide rail. A horizontal one says where the curve settles, a vertical one says where the function blows up, and a slant one says which tilted line the curve eventually shadows.</p>",
    definition:
      "<p>A <b>horizontal asymptote</b> $y=L$ occurs when $\\lim_{x\\to\\infty}f(x)=L$ or $\\lim_{x\\to-\\infty}f(x)=L$. A <b>vertical asymptote</b> $x=a$ occurs when $f(x)\\to\\infty$ or $f(x)\\to-\\infty$ as $x\\to a$ from at least one side. A <b>slant asymptote</b> $y=mx+b$ occurs when $f(x)-(mx+b)\\to0$ as $x\\to\\infty$ or $x\\to-\\infty$.</p>" +
      "<p><b>Assumptions that matter:</b> a zero denominator only gives a vertical asymptote if the factor does not cancel. A graph may cross a horizontal or slant asymptote at finite $x$; asymptotes describe approach behavior, not an uncrossable fence.</p>",
    worked: {
      problem: "Find the vertical and slant asymptotes of $f(x)=\\dfrac{x^2+1}{x-2}$.",
      skills: ["domain restrictions", "polynomial division", "end behavior"],
      strategy: "The denominator gives the possible vertical asymptote. Division gives the line followed far away.",
      steps: [
        { do: "Set the denominator equal to zero", result: "$x-2=0$", why: "vertical asymptotes can occur where the denominator vanishes" },
        { do: "Solve for $x$", result: "$x=2$", why: "that input is not in the domain" },
        { do: "Check for cancellation", result: "no factor $x-2$ cancels", why: "$x^2+1$ is not zero at $x=2$" },
        { do: "Divide $x^2+1$ by $x-2$", result: "$x+2+\\dfrac{5}{x-2}$", why: "polynomial division separates line plus leftover" },
        { do: "Take the leftover limit", result: "$\\dfrac{5}{x-2}\\to0$", why: "the leftover vanishes far from the origin" }
      ],
      verify: "At $x=102$, $f(x)=104.09$ while the line $y=x+2$ gives $104$; near $x=2$, the denominator is tiny and the function becomes huge.",
      answer: "Vertical asymptote $x=2$; slant asymptote $y=x+2$.",
      connects: "limits at infinity explain the slant line, while one-sided limits explain the vertical wall."
    },
    practice: [
      { problem: "Find the horizontal and vertical asymptotes of $f(x)=\\dfrac{2x+1}{x-3}$.", steps: [
        { do: "Set the denominator to zero", result: "$x=3$", why: "possible vertical asymptote" },
        { do: "Check cancellation", result: "none", why: "$2x+1$ does not contain $x-3$" },
        { do: "Compare degrees", result: "degree $1$ over degree $1$", why: "equal degrees give a horizontal asymptote" },
        { do: "Take the leading coefficient ratio", result: "$2/1=2$", why: "dominant terms are $2x$ and $x$" }
      ], answer: "$x=3$ and $y=2$" },
      { problem: "Find the asymptotes of $g(x)=\\dfrac{x^2-1}{x-1}$.", steps: [
        { do: "Factor the numerator", result: "$\\dfrac{(x-1)(x+1)}{x-1}$", why: "difference of squares" },
        { do: "Cancel the common factor", result: "$x+1$ for $x\\ne1$", why: "the factor creates a hole, not a vertical wall" },
        { do: "Identify vertical asymptotes", result: "none", why: "the only zero denominator factor canceled" },
        { do: "Read the line followed", result: "$y=x+1$", why: "the function equals that line except at the hole" }
      ], answer: "No vertical asymptote; slant line $y=x+1$ with a hole at $x=1$." },
      { problem: "Find the horizontal and vertical asymptotes of $h(x)=\\dfrac{3x^2}{x^2-4}$.", steps: [
        { do: "Factor the denominator", result: "$(x-2)(x+2)$", why: "zeros locate possible vertical asymptotes" },
        { do: "Set each factor to zero", result: "$x=2$ and $x=-2$", why: "the denominator vanishes there" },
        { do: "Check cancellation", result: "none", why: "the numerator $3x^2$ has no $(x-2)$ or $(x+2)$ factor" },
        { do: "Compare degrees", result: "degree $2$ over degree $2$", why: "equal degrees give a horizontal asymptote" },
        { do: "Take leading coefficient ratio", result: "$3/1=3$", why: "dominant terms are $3x^2$ and $x^2$" }
      ], answer: "Vertical asymptotes $x=2,-2$; horizontal asymptote $y=3$." },
      { problem: "Find the slant asymptote of $p(x)=\\dfrac{x^2+3x+2}{x+1}$.", steps: [
        { do: "Factor the numerator", result: "$\\dfrac{(x+1)(x+2)}{x+1}$", why: "this checks for cancellation first" },
        { do: "Cancel $x+1$", result: "$x+2$ for $x\\ne-1$", why: "the denominator factor cancels" },
        { do: "Identify vertical asymptotes", result: "none", why: "the zero denominator became a hole" },
        { do: "Read the slant line", result: "$y=x+2$", why: "the function follows this line exactly away from the hole" }
      ], answer: "Slant line $y=x+2$; no vertical asymptote; hole at $x=-1$." },
      { problem: "A loss model is $L(t)=0.2+\\dfrac{5}{t+10}$ for epochs $t\\ge0$. Find its asymptote and estimate $L(90)$.", steps: [
        { do: "Take $t\\to\\infty$", result: "$\\dfrac{5}{t+10}\\to0$", why: "the denominator grows without bound" },
        { do: "Find the horizontal asymptote", result: "$L=0.2$", why: "only the constant remains" },
        { do: "Substitute $t=90$", result: "$0.2+\\dfrac{5}{100}$", why: "the denominator is $90+10$" },
        { do: "Simplify", result: "$0.25$", why: "$5/100=0.05$" }
      ], answer: "Horizontal asymptote $L=0.2$; $L(90)=0.25$." }
    ],
    applications: [
      { title: "Training-loss floors", background: "Empirical learning curves often flatten because noise, model capacity, or irreducible error prevents zero loss.", numbers: "For $L(t)=0.12+3/(t+20)$, $L(80)=0.15$ and the horizontal asymptote is $0.12$." },
      { title: "Numerical singularities", background: "Division by a nearly zero quantity can create huge values, so software libraries guard denominators.", numbers: "$1/(x-2)$ at $x=2.001$ is $1000$; at $x=1.999$ it is $-1000$, showing the vertical asymptote $x=2$." },
      { title: "Throughput saturation", background: "Queueing systems slow dramatically as utilization approaches one, a classic operations result.", numbers: "For delay $W=1/(10-\\lambda)$, $\\lambda=9.5$ gives $W=2$, while $\\lambda=9.9$ gives $W=10$; vertical asymptote at $\\lambda=10$." },
      { title: "Model-size scaling laws", background: "Scaling-law curves often use simple asymptotic forms to estimate a performance floor.", numbers: "If error $E(N)=0.08+2/N^{0.5}$, then $E(10000)=0.10$ and the asymptote is $0.08$." },
      { title: "Memory overhead", background: "Amortized data-structure costs separate a steady per-item cost from fixed overhead.", numbers: "Cost per item $C(n)=4+128/n$ gives $C(32)=8$ bytes and approaches $4$ bytes as $n\\to\\infty$." },
      { title: "Feature transforms", background: "Functions like $\\log(1+x)$ grow forever but more slowly than any line, shaping plots with no horizontal asymptote.", numbers: "$\\log(101)\\approx4.62$ and $\\log(10001)\\approx9.21$; it keeps rising, though slowly." }
    ],
    applicationsClose: "Asymptotes are a graph's big promises: where it settles, where it blows up, and which simple line it eventually imitates.",
    takeaways: [
      "Horizontal asymptotes come from limits at infinity.",
      "Vertical asymptotes require non-canceled denominator zeros and one-sided blow-up.",
      "Slant asymptotes appear when a function approaches a line rather than a constant."
    ]
  },

  "math-01-13": {
    id: "math-01-13",
    title: "The derivative — definition and meaning",
    tagline: "A derivative is the exact instantaneous rate you get by zooming a secant slope all the way in.",
    connections: {
      buildsOn: ["Limits", "average rate of change", "function notation"],
      leadsTo: ["differentiability", "derivative rules", "gradients and optimization"],
      usedWith: ["tangent lines", "linear approximation", "continuity"]
    },
    motivation:
      "<p>You can already find an average speed: distance divided by time. But if a car's position is $s(t)=t^2$, what is its speed at exactly $t=3$? A zero-length time interval gives $0/0$, so we need a sharper idea.</p>" +
      "<p>The <b>derivative</b> is that idea. It starts with slopes over small intervals and asks for the limit as the interval shrinks to zero. In ML language, it is the local signal that says which way a loss changes if a parameter moves a tiny bit.</p>",
    definition:
      "<p>The derivative of $f$ at $a$ is $$ f'(a)=\\lim_{h\\to0}\\frac{f(a+h)-f(a)}{h}, $$ when this limit exists. The numerator is the output change, $h$ is the input change, the fraction is a secant slope, and the limit is the tangent slope. For a derivative function, $$ f'(x)=\\lim_{h\\to0}\\frac{f(x+h)-f(x)}{h}. $$</p>" +
      "<p><b>Assumptions that matter:</b> the two-sided limit must exist and be finite. A corner, cusp, vertical tangent, or jump can stop differentiability. Units matter: if $f$ is loss and $x$ is weight, $f'(x)$ is loss change per unit weight.</p>",
    worked: {
      problem: "Use the definition to find the derivative of $f(x)=x^2$.",
      skills: ["difference quotient", "expansion", "limits"],
      strategy: "Write the difference quotient, simplify until the $h$ cancels, then let $h\\to0$.",
      steps: [
        { do: "Write the definition", result: "$f'(x)=\\lim_{h\\to0}\\dfrac{(x+h)^2-x^2}{h}$", why: "replace $f(x+h)$ and $f(x)$" },
        { do: "Expand $(x+h)^2$", result: "$x^2+2xh+h^2$", why: "make cancellation visible" },
        { do: "Subtract $x^2$", result: "$\\lim_{h\\to0}\\dfrac{2xh+h^2}{h}$", why: "the original $x^2$ terms cancel" },
        { do: "Factor $h$ in the numerator", result: "$\\lim_{h\\to0}\\dfrac{h(2x+h)}{h}$", why: "the quotient is indeterminate before cancellation" },
        { do: "Cancel $h$", result: "$\\lim_{h\\to0}(2x+h)$", why: "limits allow $h\\ne0$ while approaching $0$" },
        { do: "Let $h\\to0$", result: "$2x$", why: "the remaining expression is continuous" }
      ],
      verify: "At $x=3$, a finite difference with $h=0.001$ gives $((3.001)^2-9)/0.001=6.001$, close to $6$.",
      answer: "$\\dfrac{d}{dx}x^2=2x$",
      connects: "gradients — backprop computes derivatives like this efficiently across many connected functions."
    },
    practice: [
      { problem: "Use the definition to find $f'(x)$ for $f(x)=3x+4$.", steps: [
        { do: "Write the difference quotient", result: "$\\lim_{h\\to0}\\dfrac{3(x+h)+4-(3x+4)}{h}$", why: "substitute into the definition" },
        { do: "Distribute $3$", result: "$\\lim_{h\\to0}\\dfrac{3x+3h+4-3x-4}{h}$", why: "prepare to combine like terms" },
        { do: "Cancel constant terms", result: "$\\lim_{h\\to0}\\dfrac{3h}{h}$", why: "$3x$ cancels and $4$ cancels" },
        { do: "Cancel $h$", result: "$\\lim_{h\\to0}3$", why: "valid for $h\\ne0$" },
        { do: "Take the limit", result: "$3$", why: "a constant stays itself" }
      ], answer: "$f'(x)=3$" },
      { problem: "Use the definition to find $f'(x)$ for $f(x)=x^2+1$.", steps: [
        { do: "Write the difference quotient", result: "$\\lim_{h\\to0}\\dfrac{(x+h)^2+1-(x^2+1)}{h}$", why: "substitute $f(x+h)$ and $f(x)$" },
        { do: "Expand", result: "$\\lim_{h\\to0}\\dfrac{x^2+2xh+h^2+1-x^2-1}{h}$", why: "make cancellation visible" },
        { do: "Cancel matching terms", result: "$\\lim_{h\\to0}\\dfrac{2xh+h^2}{h}$", why: "$x^2$ and $1$ cancel" },
        { do: "Factor and cancel $h$", result: "$\\lim_{h\\to0}(2x+h)$", why: "remove the indeterminate factor" },
        { do: "Take the limit", result: "$2x$", why: "$h\\to0$" }
      ], answer: "$f'(x)=2x$" },
      { problem: "Find the instantaneous velocity for $s(t)=t^2+2t$ at $t=4$.", steps: [
        { do: "Write the derivative from the pattern", result: "$s'(t)=2t+2$", why: "$t^2$ contributes $2t$ and $2t$ contributes $2$" },
        { do: "Substitute $t=4$", result: "$s'(4)=2(4)+2$", why: "instantaneous velocity is derivative at that time" },
        { do: "Multiply", result: "$8+2$", why: "$2\\cdot4=8$" },
        { do: "Add", result: "$10$", why: "combine the terms" }
      ], answer: "$10$ units per time" },
      { problem: "Estimate $f'(2)$ for $f(x)=x^3$ using $h=0.01$, then compare to the exact value.", steps: [
        { do: "Compute $f(2.01)$", result: "$2.01^3=8.120601$", why: "this is $f(2+h)$" },
        { do: "Compute $f(2)$", result: "$8$", why: "this is the base value" },
        { do: "Form the finite difference", result: "$\\dfrac{8.120601-8}{0.01}=12.0601$", why: "average slope over a small interval" },
        { do: "Use the exact derivative", result: "$3x^2$", why: "the derivative of $x^3$ is $3x^2$" },
        { do: "Evaluate at $x=2$", result: "$12$", why: "$3\\cdot4=12$" }
      ], answer: "Finite difference $12.0601$; exact derivative $12$." },
      { problem: "For loss $L(w)=(w-3)^2$, find $L'(1)$ and the direction that decreases loss.", steps: [
        { do: "Differentiate the square", result: "$L'(w)=2(w-3)$", why: "the slope of a shifted square is twice the shift" },
        { do: "Substitute $w=1$", result: "$L'(1)=2(1-3)$", why: "we need the local slope at the current weight" },
        { do: "Simplify", result: "$-4$", why: "$1-3=-2$" },
        { do: "Choose the descent direction", result: "increase $w$", why: "gradient descent moves opposite the derivative, so $-L'(1)=4$" },
        { do: "Check with a small step $0.1$", result: "$L(1.1)=3.61<L(1)=4$", why: "moving right lowers the loss" }
      ], answer: "$L'(1)=-4$; increasing $w$ decreases the loss." }
    ],
    applications: [
      { title: "Gradient descent", background: "Modern ML training updates parameters using derivatives of a loss, a direct descendant of steepest-descent methods from numerical analysis.", numbers: "For $L(w)=(w-3)^2$ at $w=1$, $L'=-4$; with learning rate $0.1$, $w_{new}=1-0.1(-4)=1.4$." },
      { title: "Backpropagation", background: "Backprop computes many derivatives efficiently by reusing local slope information through a computation graph.", numbers: "If $z=wx$, $L=z^2$, with $w=2,x=3$, then $z=6$ and $\\partial L/\\partial w=2z\\cdot x=36$." },
      { title: "Gradient checking", background: "Before trusting a custom layer, engineers compare analytic derivatives to finite differences.", numbers: "For $f(x)=x^2$ at $x=2$, $h=0.001$ gives $4.001$, while the derivative is $4$; error is $0.001$." },
      { title: "Sensitivity analysis", background: "Derivatives quantify how much an output changes when one input is nudged, useful in science and product metrics.", numbers: "If revenue $R(p)=100p-2p^2$, then $R'(20)=100-80=20$, about $20$ extra units per price dollar near $p=20$." },
      { title: "Tangent-line approximation", background: "Calculus turns a curved function into a local line for quick estimates.", numbers: "For $\\sqrt{x}$ near $x=4$, derivative $1/4$ gives $\\sqrt{4.4}\\approx2+0.25(0.4)=2.1$; actual is about $2.098$." },
      { title: "Physics engines", background: "Velocity is the derivative of position, so simulation systems update motion by local rates.", numbers: "If $s(t)=5t^2$, then $s'(3)=30$ meters per second." }
    ],
    applicationsClose: "The derivative is one local question with many uniforms: slope, speed, sensitivity, and gradient are all the same idea in context.",
    takeaways: [
      "A derivative is the limit of a difference quotient.",
      "It measures instantaneous rate of change and tangent slope.",
      "In ML, derivatives are the local signals used to update parameters."
    ]
  },

  "math-01-14": {
    id: "math-01-14",
    title: "Differentiability vs continuity",
    tagline: "Continuity means no break; differentiability means the curve also has a well-defined local slope.",
    connections: {
      buildsOn: ["Continuity", "limits", "the derivative definition"],
      leadsTo: ["derivative rules", "nondifferentiable optimization", "piecewise modeling"],
      usedWith: ["one-sided limits", "absolute value", "piecewise functions"]
    },
    motivation:
      "<p>A graph can be connected and still have a sharp corner. You can trace $|x|$ without lifting your pencil, but at $0$ the left slope is $-1$ and the right slope is $1$.</p>" +
      "<p>This distinction matters because calculus needs more than connectedness when it asks for a slope. Continuity says the point is attached to the curve; differentiability says the curve looks like one line when you zoom in.</p>",
    definition:
      "<p>A function is <b>continuous</b> at $a$ when $\\lim_{x\\to a}f(x)=f(a)$. It is <b>differentiable</b> at $a$ when $f'(a)=\\lim_{h\\to0}\\frac{f(a+h)-f(a)}{h}$ exists as a finite two-sided limit. Differentiability implies continuity: if $f'(a)$ exists, then $f(a+h)-f(a)=h\\cdot\\frac{f(a+h)-f(a)}{h}\\to0\\cdot f'(a)=0$, so $f(a+h)\\to f(a)$.</p>" +
      "<p><b>Assumptions that matter:</b> the converse is false. Corners, cusps, vertical tangents, jumps, and holes can break differentiability; jumps and holes also break continuity. Piecewise functions must pass both a value test and a slope test at the join.</p>",
    worked: {
      problem: "Decide whether $f(x)=|x|$ is continuous and differentiable at $x=0$.",
      skills: ["one-sided limits", "difference quotients", "corners"],
      strategy: "Check the value first for continuity, then compare left and right slopes for differentiability.",
      steps: [
        { do: "Compute the function value", result: "$f(0)=0$", why: "absolute value of zero is zero" },
        { do: "Take the left limit", result: "$\\lim_{x\\to0^-}|x|=0$", why: "negative inputs approach zero in magnitude" },
        { do: "Take the right limit", result: "$\\lim_{x\\to0^+}|x|=0$", why: "positive inputs approach zero" },
        { do: "Compare with $f(0)$", result: "continuous", why: "both one-sided limits equal the function value" },
        { do: "Compute the right derivative", result: "$\\lim_{h\\to0^+}\\dfrac{|h|-0}{h}=1$", why: "for $h>0$, $|h|=h$" },
        { do: "Compute the left derivative", result: "$\\lim_{h\\to0^-}\\dfrac{|h|-0}{h}=-1$", why: "for $h<0$, $|h|=-h$" }
      ],
      verify: "Near zero, secant slopes from the right are $1$ and from the left are $-1$, so no single tangent slope exists.",
      answer: "$|x|$ is continuous at $0$ but not differentiable at $0$.",
      connects: "nondifferentiable points can still be usable, but derivative-based methods need special care there."
    },
    practice: [
      { problem: "Is $f(x)=x^2$ continuous and differentiable at $x=1$?", steps: [
        { do: "Evaluate the function", result: "$f(1)=1$", why: "substitute $1$" },
        { do: "Take the limit", result: "$\\lim_{x\\to1}x^2=1$", why: "polynomials are continuous" },
        { do: "Conclude continuity", result: "continuous", why: "limit equals value" },
        { do: "Differentiate", result: "$f'(x)=2x$", why: "a polynomial has a derivative everywhere" },
        { do: "Evaluate the derivative", result: "$f'(1)=2$", why: "finite slope exists" }
      ], answer: "Continuous and differentiable at $1$." },
      { problem: "Is $g(x)=\\sqrt{x}$ differentiable at $x=0$ on its domain $x\\ge0$?", steps: [
        { do: "Evaluate the value", result: "$g(0)=0$", why: "square root of zero is zero" },
        { do: "Take the right limit", result: "$\\lim_{x\\to0^+}\\sqrt{x}=0$", why: "domain approaches from the right" },
        { do: "Conclude continuity on the domain", result: "continuous from the right", why: "the domain has no left side at $0$" },
        { do: "Form the right difference quotient", result: "$\\dfrac{\\sqrt{h}-0}{h}=\\dfrac{1}{\\sqrt h}$", why: "simplify $\\sqrt h/h$" },
        { do: "Let $h\\to0^+$", result: "$\\infty$", why: "the slope becomes unbounded" }
      ], answer: "Continuous on its domain at $0$, but not differentiable there as a finite slope." },
      { problem: "For $f(x)=\\begin{cases}x+1,&x<1\\3,&x=1\\x^2+1,&x>1\\end{cases}$, is $f$ continuous at $1$?", steps: [
        { do: "Find the left limit", result: "$\\lim_{x\\to1^-}(x+1)=2$", why: "use the left branch" },
        { do: "Find the right limit", result: "$\\lim_{x\\to1^+}(x^2+1)=2$", why: "use the right branch" },
        { do: "Find the two-sided limit", result: "$2$", why: "left and right limits agree" },
        { do: "Evaluate the function", result: "$f(1)=3$", why: "the middle definition gives the value" },
        { do: "Compare limit and value", result: "not continuous", why: "$2\\ne3$" }
      ], answer: "Not continuous at $1$, so not differentiable there." },
      { problem: "For $f(x)=\\begin{cases}x^2,&x\\le1\\2x-1,&x>1\\end{cases}$, test differentiability at $1$.", steps: [
        { do: "Check the left value", result: "$1^2=1$", why: "use the first branch" },
        { do: "Check the right limit", result: "$2(1)-1=1$", why: "use the second branch" },
        { do: "Conclude continuity", result: "continuous", why: "both sides meet at $1$" },
        { do: "Compute left slope", result: "$2x\\to2$", why: "derivative of $x^2$ at $1$" },
        { do: "Compute right slope", result: "$2$", why: "derivative of $2x-1$" }
      ], answer: "Differentiable at $1$ with derivative $2$." },
      { problem: "The ReLU $r(x)=\\max(0,x)$ is used in neural nets. Is it differentiable at $0$?", steps: [
        { do: "Find the value", result: "$r(0)=0$", why: "both pieces meet at zero" },
        { do: "Take the left limit", result: "$0$", why: "for $x<0$, ReLU outputs $0$" },
        { do: "Take the right limit", result: "$0$", why: "for $x>0$, ReLU outputs $x\\to0$" },
        { do: "Compute left slope", result: "$0$", why: "the left branch is flat" },
        { do: "Compute right slope", result: "$1$", why: "the right branch is $x$" }
      ], answer: "Continuous at $0$, not differentiable at $0$; implementations choose a subgradient such as $0$." }
    ],
    applications: [
      { title: "ReLU activations", background: "ReLU became popular because it is simple and avoids some sigmoid saturation, even with a corner at zero.", numbers: "At $x=-0.1$, slope is $0$; at $x=0.1$, slope is $1$; the derivative at $0$ is not unique." },
      { title: "L1 regularization", background: "The absolute value penalty encourages sparsity, which is useful for feature selection.", numbers: "For $\\lambda|w|$ with $\\lambda=0.2$, slopes are $-0.2$ for $w<0$ and $0.2$ for $w>0$, with a corner at $0$." },
      { title: "Hinge loss", background: "Support vector machines use a piecewise linear loss with a kink at the margin.", numbers: "$\\max(0,1-yz)$ has slope $-y$ when $yz<1$ and $0$ when $yz>1$; at $yz=1$ it is nondifferentiable." },
      { title: "Clipping in systems", background: "Clipping protects values from exceeding a safe range but creates corners at the thresholds.", numbers: "For $c(x)=\\min(1,\\max(0,x))$, slopes are $0$ below $0$, $1$ between $0$ and $1$, and $0$ above $1$." },
      { title: "Piecewise pricing", background: "Tiered pricing can be continuous while marginal price jumps at tier boundaries.", numbers: "If cost is $0.10q$ up to $1000$ and $100+0.06(q-1000)$ after, cost is continuous at $1000$ but slope changes from $0.10$ to $0.06$." },
      { title: "Numerical optimizers", background: "Smooth optimizers expect reliable local slopes; nonsmooth points may require subgradients or smoothing.", numbers: "Replacing $|x|$ with $\\sqrt{x^2+0.01}$ gives derivative $x/\\sqrt{x^2+0.01}$, so at $x=0$ the slope is $0$ instead of undefined." }
    ],
    applicationsClose: "Continuity keeps the curve attached; differentiability gives it one clear local direction. Both are useful, and they are not the same promise.",
    takeaways: [
      "Differentiability implies continuity, but continuity does not imply differentiability.",
      "Corners, cusps, vertical tangents, jumps, and holes are the usual suspects.",
      "Many ML losses are intentionally continuous but nonsmooth, so optimizers use subgradients or conventions."
    ]
  },

  "math-01-15": {
    id: "math-01-15",
    title: "The power rule",
    tagline: "The power rule turns powers into slopes with one beautifully reusable pattern.",
    connections: {
      buildsOn: ["The derivative definition", "exponents", "polynomials"],
      leadsTo: ["sum and difference rule", "polynomial optimization", "gradient descent"],
      usedWith: ["constant multiples", "tangent lines", "linear approximation"]
    },
    motivation:
      "<p>Using the derivative definition for $x^2$ was worth doing once. But doing that expansion for every power would become tiring fast, and calculus is kind enough to give us a pattern.</p>" +
      "<p>The <b>power rule</b> says a power's exponent drops down as a coefficient, then decreases by one. This is one of the main workhorses behind gradients for polynomial losses and simple model terms.</p>",
    definition:
      "<p>For any real exponent $n$ where the expression is defined, $$\\frac{d}{dx}x^n=nx^{n-1}.$$ For positive integers, the reason comes from expanding $(x+h)^n$: after subtracting $x^n$, the first surviving term is $nx^{n-1}h$, and every remaining term contains higher powers of $h$ that vanish after dividing by $h$ and taking $h\\to0$.</p>" +
      "<p><b>Assumptions that matter:</b> the derivative must be taken where $x^n$ is defined and differentiable. Negative powers exclude $x=0$. Fractional powers may have domain restrictions or fail to have finite derivative at endpoints such as $\\sqrt{x}$ at $0$.</p>",
    worked: {
      problem: "Differentiate $f(x)=7x^5$.",
      skills: ["power rule", "constant multiple", "exponent arithmetic"],
      strategy: "Keep the constant, bring down the exponent, and reduce the exponent by one.",
      steps: [
        { do: "Identify the power", result: "$x^5$", why: "the exponent is $5$" },
        { do: "Bring down the exponent", result: "$5x^{5-1}$", why: "the power rule says $x^n\\mapsto nx^{n-1}$" },
        { do: "Simplify the exponent", result: "$5x^4$", why: "$5-1=4$" },
        { do: "Multiply by the constant $7$", result: "$35x^4$", why: "constant multiples pass through differentiation" }
      ],
      verify: "At $x=2$, the derivative predicts $35\\cdot16=560$; the finite difference with $h=0.001$ is about $560.56$, close because $h$ is small.",
      answer: "$f'(x)=35x^4$",
      connects: "gradients — polynomial terms in losses differentiate by this same pattern before an optimizer takes a step."
    },
    practice: [
      { problem: "Differentiate $f(x)=x^8$.", steps: [
        { do: "Identify the exponent", result: "$8$", why: "the function is a pure power" },
        { do: "Bring down the exponent", result: "$8x^{8-1}$", why: "apply the power rule" },
        { do: "Simplify the exponent", result: "$8x^7$", why: "$8-1=7$" },
        { do: "State the derivative", result: "$f'(x)=8x^7$", why: "no other terms are present" }
      ], answer: "$8x^7$" },
      { problem: "Differentiate $g(x)=4x^3$.", steps: [
        { do: "Keep the constant", result: "$4\\dfrac{d}{dx}x^3$", why: "constant multiples pass through" },
        { do: "Apply the power rule", result: "$4(3x^2)$", why: "$x^3\\mapsto3x^2$" },
        { do: "Multiply constants", result: "$12x^2$", why: "$4\\cdot3=12$" },
        { do: "State the derivative", result: "$g'(x)=12x^2$", why: "the expression is simplified" }
      ], answer: "$12x^2$" },
      { problem: "Differentiate $h(x)=\\dfrac{5}{x^2}$.", steps: [
        { do: "Rewrite with a negative exponent", result: "$5x^{-2}$", why: "$1/x^2=x^{-2}$" },
        { do: "Apply the power rule", result: "$5(-2)x^{-3}$", why: "bring down $-2$ and subtract $1$" },
        { do: "Multiply constants", result: "$-10x^{-3}$", why: "$5\\cdot(-2)=-10$" },
        { do: "Rewrite if desired", result: "$-\\dfrac{10}{x^3}$", why: "$x^{-3}=1/x^3$" }
      ], answer: "$-10/x^3$ for $x\\ne0$" },
      { problem: "Differentiate $p(x)=\\sqrt{x}$ for $x>0$.", steps: [
        { do: "Rewrite the root", result: "$x^{1/2}$", why: "square root is a fractional power" },
        { do: "Apply the power rule", result: "$\\dfrac12x^{-1/2}$", why: "bring down $1/2$ and subtract $1$" },
        { do: "Rewrite the negative exponent", result: "$\\dfrac{1}{2\\sqrt{x}}$", why: "$x^{-1/2}=1/\\sqrt{x}$" },
        { do: "Name the domain", result: "$x>0$", why: "the derivative is finite only away from $0$" }
      ], answer: "$1/(2\\sqrt{x})$ for $x>0$" },
      { problem: "For loss $L(w)=0.5w^2$, find $L'(w)$ and the update from $w=4$ with learning rate $0.1$.", steps: [
        { do: "Differentiate $w^2$", result: "$2w$", why: "power rule" },
        { do: "Multiply by $0.5$", result: "$L'(w)=w$", why: "$0.5\\cdot2=1$" },
        { do: "Evaluate at $w=4$", result: "$L'(4)=4$", why: "substitute the current weight" },
        { do: "Apply gradient descent", result: "$w_{new}=4-0.1(4)$", why: "move opposite the gradient" },
        { do: "Simplify", result: "$3.6$", why: "$4-0.4=3.6$" }
      ], answer: "$L'(w)=w$ and the updated weight is $3.6$." }
    ],
    applications: [
      { title: "Squared-error gradients", background: "Least squares became central because squaring errors gives smooth derivatives and strong geometric structure.", numbers: "For $L(w)=(w-5)^2$, $L'(2)=2(2-5)=-6$, so a $0.1$ step sends $w$ to $2.6$." },
      { title: "Weight decay", background: "L2 regularization penalizes large weights with a square, making the gradient proportional to the weight.", numbers: "For penalty $0.01w^2$, derivative is $0.02w$; at $w=10$, the penalty gradient is $0.2$." },
      { title: "Polynomial regression", background: "Polynomial features let linear models bend, and training needs derivatives of powers.", numbers: "If prediction includes $a x^3$ and loss gradient with respect to prediction is $2$, then contribution to $\\partial L/\\partial a$ at $x=4$ is $2\\cdot4^3=128$." },
      { title: "Backprop through powers", background: "Neural-network libraries store local derivative rules for operations such as square and cube.", numbers: "For $y=x^4$ at $x=2$, local derivative is $4x^3=32$; an upstream gradient $0.5$ becomes $16$." },
      { title: "Physics-inspired losses", background: "Many models include energy terms like $kx^2/2$, inherited from springs and quadratic approximations.", numbers: "If $E=3x^2/2$, then $E'=3x$; at $x=0.4$, force magnitude is $1.2$." },
      { title: "Feature scaling effects", background: "High powers magnify large inputs, so derivatives can become large quickly.", numbers: "For $x^6$, derivative at $x=2$ is $6\\cdot32=192$, but at $x=0.5$ it is $6/32=0.1875$." }
    ],
    applicationsClose: "The power rule is small, but it is everywhere: every square penalty, polynomial feature, and local backprop rule leans on it.",
    takeaways: [
      "$\\frac{d}{dx}x^n=nx^{n-1}$ where the derivative is defined.",
      "Constants stay in front of derivatives.",
      "Power-rule gradients drive many polynomial and squared-loss calculations in ML."
    ]
  },

  "math-01-16": {
    id: "math-01-16",
    title: "The sum and difference rule",
    tagline: "Differentiate a sum by differentiating each piece, then putting the pieces back together.",
    connections: {
      buildsOn: ["The derivative", "the power rule", "linearity"],
      leadsTo: ["product rule", "polynomial derivatives", "optimization"],
      usedWith: ["constant multiple rule", "polynomials", "linear combinations"]
    },
    motivation:
      "<p>Real functions are rarely a single term. They are built from pieces: $3x^4$, $-2x$, $7$, and so on. The friendly news is that derivatives respect addition and subtraction.</p>" +
      "<p>The sum and difference rule is the first big modularity rule. It says you can handle one term at a time, which is exactly how larger models are built from smaller components.</p>",
    definition:
      "<p>If $f$ and $g$ are differentiable at $x$, then $$\\frac{d}{dx}[f(x)+g(x)]=f'(x)+g'(x),\\qquad \\frac{d}{dx}[f(x)-g(x)]=f'(x)-g'(x).$$ This follows directly from the difference quotient because $[f(x+h)+g(x+h)]-[f(x)+g(x)]$ splits into the change in $f$ plus the change in $g$.</p>" +
      "<p><b>Assumptions that matter:</b> each piece must be differentiable at the point. If one term has a corner or discontinuity there, the whole sum may fail to be differentiable even if the other terms are smooth.</p>",
    worked: {
      problem: "Differentiate $p(x)=4x^5-3x^2+7x-9$.",
      skills: ["sum rule", "difference rule", "power rule"],
      strategy: "Work term by term. Constants differentiate to zero.",
      steps: [
        { do: "Differentiate $4x^5$", result: "$20x^4$", why: "power rule with constant multiple" },
        { do: "Differentiate $-3x^2$", result: "$-6x$", why: "keep the minus sign" },
        { do: "Differentiate $7x$", result: "$7$", why: "a line $7x$ has slope $7$" },
        { do: "Differentiate $-9$", result: "$0$", why: "constants do not change" },
        { do: "Combine the pieces", result: "$20x^4-6x+7$", why: "sum and difference rules preserve signs" }
      ],
      verify: "At $x=1$, the derivative is $20-6+7=21$; a small finite difference gives about $21$.",
      answer: "$p'(x)=20x^4-6x+7$",
      connects: "polynomial optimization starts by turning a whole polynomial into a sum of term-wise slopes."
    },
    practice: [
      { problem: "Differentiate $f(x)=x^4+x^3+x^2$.", steps: [
        { do: "Differentiate $x^4$", result: "$4x^3$", why: "power rule" },
        { do: "Differentiate $x^3$", result: "$3x^2$", why: "power rule" },
        { do: "Differentiate $x^2$", result: "$2x$", why: "power rule" },
        { do: "Add the derivatives", result: "$4x^3+3x^2+2x$", why: "sum rule" }
      ], answer: "$4x^3+3x^2+2x$" },
      { problem: "Differentiate $g(x)=6x^2-5x+8$.", steps: [
        { do: "Differentiate $6x^2$", result: "$12x$", why: "power rule and constant multiple" },
        { do: "Differentiate $-5x$", result: "$-5$", why: "the slope of $-5x$ is $-5$" },
        { do: "Differentiate $8$", result: "$0$", why: "constant term" },
        { do: "Combine", result: "$12x-5$", why: "preserve the subtraction sign" }
      ], answer: "$12x-5$" },
      { problem: "Differentiate $h(x)=\\sqrt{x}+\\dfrac{3}{x}$ for $x>0$.", steps: [
        { do: "Rewrite powers", result: "$x^{1/2}+3x^{-1}$", why: "prepare for the power rule" },
        { do: "Differentiate $x^{1/2}$", result: "$\\dfrac12x^{-1/2}$", why: "power rule" },
        { do: "Differentiate $3x^{-1}$", result: "$-3x^{-2}$", why: "bring down $-1$" },
        { do: "Combine", result: "$\\dfrac{1}{2\\sqrt{x}}-\\dfrac{3}{x^2}$", why: "rewrite negative exponents" }
      ], answer: "$1/(2\\sqrt{x})-3/x^2$" },
      { problem: "Find $p'(2)$ for $p(x)=2x^3-4x^2+x-1$.", steps: [
        { do: "Differentiate $2x^3$", result: "$6x^2$", why: "power rule" },
        { do: "Differentiate $-4x^2$", result: "$-8x$", why: "keep the minus sign" },
        { do: "Differentiate $x$", result: "$1$", why: "slope of $x$" },
        { do: "Form $p'(x)$", result: "$6x^2-8x+1$", why: "constant derivative is zero" },
        { do: "Substitute $x=2$", result: "$24-16+1=9$", why: "evaluate the slope at the point" }
      ], answer: "$p'(2)=9$" },
      { problem: "For $L(w)=0.1w^4+0.5w^2-3w$, compute $L'(2)$.", steps: [
        { do: "Differentiate $0.1w^4$", result: "$0.4w^3$", why: "power rule" },
        { do: "Differentiate $0.5w^2$", result: "$w$", why: "$0.5\\cdot2=1$" },
        { do: "Differentiate $-3w$", result: "$-3$", why: "linear term" },
        { do: "Form $L'(w)$", result: "$0.4w^3+w-3$", why: "sum and difference rules" },
        { do: "Substitute $w=2$", result: "$0.4(8)+2-3=2.2$", why: "$3.2+2-3=2.2$" }
      ], answer: "$L'(2)=2.2$" }
    ],
    applications: [
      { title: "Polynomial models", background: "Polynomial regression combines feature powers, and each coefficient contributes its own derivative term.", numbers: "For $y=2x^3-5x+1$, $dy/dx=6x^2-5$; at $x=2$, slope is $19$." },
      { title: "Additive losses", background: "Training objectives often add data loss and regularization, so their gradients add too.", numbers: "If data gradient is $-6$ and L2 gradient is $0.4$, total gradient is $-5.6$." },
      { title: "Ensembles", background: "Averaged model outputs have derivatives that average the model derivatives.", numbers: "If two predictors have local slopes $3$ and $5$, their average has slope $(3+5)/2=4$." },
      { title: "Taylor approximations", background: "Local polynomial approximations rely on differentiating sums of powers term by term.", numbers: "For $1+x+x^2/2$, derivative is $1+x$; at $x=0.2$, the local slope is $1.2$." },
      { title: "Cost functions in operations", background: "Total cost often combines fixed, linear, and quadratic terms.", numbers: "If $C(q)=100+4q+0.02q^2$, then $C'(50)=4+2=6$ dollars per unit." },
      { title: "Feature attribution for linear scores", background: "Linear scoring models add feature contributions, making sensitivity easy to read.", numbers: "For $s=2x_1-3x_2+5$, $\\partial s/\\partial x_1=2$ and $\\partial s/\\partial x_2=-3$." }
    ],
    applicationsClose: "The rule's message is modular: if a function is assembled by adding pieces, its derivative is assembled the same way.",
    takeaways: [
      "Derivatives distribute over sums and differences.",
      "Differentiate polynomials term by term, preserving signs.",
      "Additive objectives have additive gradients."
    ]
  },

  "math-01-17": {
    id: "math-01-17",
    title: "The product rule",
    tagline: "When two changing factors multiply, the derivative must count both ways the product can change.",
    connections: {
      buildsOn: ["The derivative", "sum rule", "limits"],
      leadsTo: ["quotient rule", "chain rule", "logarithmic differentiation"],
      usedWith: ["polynomials", "exponential functions", "trigonometric functions"]
    },
    motivation:
      "<p>It is tempting to think the derivative of $f(x)g(x)$ is just $f'(x)g'(x)$. But if width and height both change, area changes because width changes while height is present, and because height changes while width is present.</p>" +
      "<p>The product rule keeps both contributions. It is one of those rules that feels fussy at first, then becomes a trusted rhythm.</p>",
    definition:
      "<p>If $f$ and $g$ are differentiable, then $$\\frac{d}{dx}[f(x)g(x)]=f'(x)g(x)+f(x)g'(x).$$ From the difference quotient, add and subtract $f(x+h)g(x)$ in the numerator. The change splits into $f(x+h)[g(x+h)-g(x)]$ plus $g(x)[f(x+h)-f(x)]$, which tends to $f(x)g'(x)+g(x)f'(x)$.</p>" +
      "<p><b>Assumptions that matter:</b> both factors must be differentiable at the point. The rule is symmetric; either order gives the same result. Do not multiply the derivatives only — that misses the product's two change channels.</p>",
    worked: {
      problem: "Differentiate $y=(x^2+1)(3x-4)$.",
      skills: ["product rule", "sum rule", "simplification"],
      strategy: "Name the two factors, differentiate each, then assemble $f'g+fg'$.",
      steps: [
        { do: "Set $f=x^2+1$", result: "$f'=2x$", why: "differentiate the first factor" },
        { do: "Set $g=3x-4$", result: "$g'=3$", why: "differentiate the second factor" },
        { do: "Apply the product rule", result: "$y'=2x(3x-4)+(x^2+1)3$", why: "use $f'g+fg'$" },
        { do: "Expand the first product", result: "$6x^2-8x+3(x^2+1)$", why: "multiply $2x$ through" },
        { do: "Expand the second product", result: "$6x^2-8x+3x^2+3$", why: "multiply by $3$" },
        { do: "Combine like terms", result: "$9x^2-8x+3$", why: "collect powers of $x$" }
      ],
      verify: "Expanding first gives $3x^3-4x^2+3x-4$, whose derivative is $9x^2-8x+3$, the same result.",
      answer: "$y'=9x^2-8x+3$",
      connects: "the product rule is the local version of tracking two interacting factors at once."
    },
    practice: [
      { problem: "Differentiate $y=x^2(x+5)$ using the product rule.", steps: [
        { do: "Set $f=x^2$", result: "$f'=2x$", why: "first factor derivative" },
        { do: "Set $g=x+5$", result: "$g'=1$", why: "second factor derivative" },
        { do: "Apply the rule", result: "$y'=2x(x+5)+x^2(1)$", why: "use $f'g+fg'$" },
        { do: "Expand", result: "$2x^2+10x+x^2$", why: "multiply out" },
        { do: "Combine", result: "$3x^2+10x$", why: "like terms add" }
      ], answer: "$3x^2+10x$" },
      { problem: "Differentiate $y=(2x-1)(x^2+4)$.", steps: [
        { do: "Differentiate the first factor", result: "$2$", why: "slope of $2x-1$" },
        { do: "Differentiate the second factor", result: "$2x$", why: "power rule" },
        { do: "Apply the product rule", result: "$2(x^2+4)+(2x-1)(2x)$", why: "use both change channels" },
        { do: "Expand", result: "$2x^2+8+4x^2-2x$", why: "multiply terms" },
        { do: "Combine", result: "$6x^2-2x+8$", why: "collect like terms" }
      ], answer: "$6x^2-2x+8$" },
      { problem: "Differentiate $y=x^3\\sqrt{x}$ for $x>0$.", steps: [
        { do: "Rewrite the root", result: "$y=x^3x^{1/2}$", why: "use powers" },
        { do: "Set $f=x^3$ and $g=x^{1/2}$", result: "$f'=3x^2$, $g'=\\frac12x^{-1/2}$", why: "differentiate both factors" },
        { do: "Apply the product rule", result: "$3x^2x^{1/2}+x^3\\left(\\frac12x^{-1/2}\\right)$", why: "use $f'g+fg'$" },
        { do: "Combine exponents", result: "$3x^{5/2}+\\frac12x^{5/2}$", why: "$x^2x^{1/2}=x^{5/2}$ and $x^3x^{-1/2}=x^{5/2}$" },
        { do: "Add coefficients", result: "$\\frac72x^{5/2}$", why: "$3+1/2=7/2$" }
      ], answer: "$\\frac72x^{5/2}$" },
      { problem: "Differentiate $y=(x^2+1)(x^2-1)$ and simplify.", steps: [
        { do: "Differentiate each factor", result: "$2x$ and $2x$", why: "both are quadratic plus or minus a constant" },
        { do: "Apply the product rule", result: "$2x(x^2-1)+(x^2+1)2x$", why: "use $f'g+fg'$" },
        { do: "Factor $2x$", result: "$2x[(x^2-1)+(x^2+1)]$", why: "common factor makes simplification clearer" },
        { do: "Simplify inside brackets", result: "$2x(2x^2)$", why: "the constants cancel" },
        { do: "Multiply", result: "$4x^3$", why: "$2x\\cdot2x^2=4x^3$" }
      ], answer: "$4x^3$" },
      { problem: "A model output is $s(w)=w^2(w+1)$. Find $s'(2)$ for a local gradient.", steps: [
        { do: "Set $f=w^2$", result: "$f'=2w$", why: "first factor" },
        { do: "Set $g=w+1$", result: "$g'=1$", why: "second factor" },
        { do: "Apply the product rule", result: "$s'(w)=2w(w+1)+w^2$", why: "use both terms" },
        { do: "Substitute $w=2$", result: "$2(2)(3)+4$", why: "evaluate the gradient at the current weight" },
        { do: "Simplify", result: "$16$", why: "$12+4=16$" }
      ], answer: "$s'(2)=16$" }
    ],
    applications: [
      { title: "Gated neural units", background: "Gates multiply an activation by a learned value, so gradients must flow through both the gate and the activation.", numbers: "If output $y=ga$, upstream gradient is $5$, $g=0.2$, $a=3$, then $\\partial L/\\partial g=15$ and $\\partial L/\\partial a=1$." },
      { title: "Attention weights times values", background: "Attention forms weighted sums, and each term is a product of a weight and a value vector component.", numbers: "For one scalar term $av$, with upstream gradient $2$, $a=0.25$, $v=8$, gradients are $16$ for $a$ and $0.5$ for $v$." },
      { title: "Revenue models", background: "Revenue is price times quantity, both of which may vary with price.", numbers: "If $R(p)=p(100-2p)$, then $R'=1(100-2p)+p(-2)=100-4p$; at $p=20$, slope is $20$." },
      { title: "Area growth", background: "The product rule was historically tied to geometry: changing area has width and height contributions.", numbers: "If width $w=t^2$ and height $h=3t$, area rate is $2t(3t)+t^2(3)=9t^2$; at $t=2$, rate is $36$." },
      { title: "Probability factorizations", background: "Likelihoods often multiply factors; derivatives of products motivate log-likelihoods.", numbers: "For $p(\\theta)=\\theta(1-\\theta)$, $p'=1(1-\\theta)+\\theta(-1)=1-2\\theta$; at $0.3$, slope is $0.4$." },
      { title: "Feature interactions", background: "Models sometimes include interaction terms where two features multiply.", numbers: "For score $s=x_1x_2$, if $x_1=4,x_2=7$, then $\\partial s/\\partial x_1=7$ and $\\partial s/\\partial x_2=4$." }
    ],
    applicationsClose: "Whenever a quantity is built by multiplying changing parts, the product rule reminds us to credit each part's change while the other part is present.",
    takeaways: [
      "$\\frac{d}{dx}[fg]=f'g+fg'$.",
      "Do not multiply derivatives only; that misses two separate contributions.",
      "Products appear in gates, attention, probabilities, revenue, and feature interactions."
    ]
  },

  "math-01-18": {
    id: "math-01-18",
    title: "The quotient rule",
    tagline: "A quotient changes because the numerator moves and because the denominator rescales everything.",
    connections: {
      buildsOn: ["Product rule", "power rule", "rational functions"],
      leadsTo: ["chain rule", "log derivatives", "optimization with ratios"],
      usedWith: ["asymptotes", "rates", "normalization"]
    },
    motivation:
      "<p>Ratios are everywhere: error per example, revenue per user, signal-to-noise. When the top and bottom both change, the slope of the ratio is not just top slope divided by bottom slope.</p>" +
      "<p>The <b>quotient rule</b> is the careful bookkeeping rule for ratios. It rewards a steady order: bottom times derivative of top, minus top times derivative of bottom, all over bottom squared.</p>",
    definition:
      "<p>If $f$ and $g$ are differentiable and $g(x)\\ne0$, then $$\\frac{d}{dx}\\left[\\frac{f(x)}{g(x)}\\right]=\\frac{g(x)f'(x)-f(x)g'(x)}{[g(x)]^2}.$$ One way to derive it is to write $f/g=f\\cdot g^{-1}$, use the product rule, and differentiate $g^{-1}$ as $-g'/g^2$.</p>" +
      "<p><b>Assumptions that matter:</b> the denominator cannot be zero at the point. Order matters in the numerator: denominator times top derivative minus numerator times bottom derivative. The squared denominator is always nonnegative, but the numerator controls the sign.</p>",
    worked: {
      problem: "Differentiate $y=\\dfrac{x^2+1}{x-3}$.",
      skills: ["quotient rule", "power rule", "simplification"],
      strategy: "Name numerator and denominator, compute their derivatives, then use $gf'-fg'$ over $g^2$.",
      steps: [
        { do: "Set $f=x^2+1$", result: "$f'=2x$", why: "differentiate the numerator" },
        { do: "Set $g=x-3$", result: "$g'=1$", why: "differentiate the denominator" },
        { do: "Apply the quotient rule", result: "$y'=\\dfrac{(x-3)(2x)-(x^2+1)(1)}{(x-3)^2}$", why: "use $gf'-fg'$ over $g^2$" },
        { do: "Expand the first product", result: "$\\dfrac{2x^2-6x-(x^2+1)}{(x-3)^2}$", why: "multiply $2x$ by $x-3$" },
        { do: "Distribute the minus sign", result: "$\\dfrac{2x^2-6x-x^2-1}{(x-3)^2}$", why: "subtract the whole numerator" },
        { do: "Combine like terms", result: "$\\dfrac{x^2-6x-1}{(x-3)^2}$", why: "simplify the numerator" }
      ],
      verify: "At $x=4$, the derivative is $(16-24-1)/1=-9$; nearby values $f(4)=17$ and $f(4.01)\\approx16.911$ show a steep negative slope.",
      answer: "$y'=\\dfrac{x^2-6x-1}{(x-3)^2}$ for $x\\ne3$",
      connects: "ratios often combine growth in the numerator with normalization from the denominator."
    },
    practice: [
      { problem: "Differentiate $y=\\dfrac{x+1}{x-1}$.", steps: [
        { do: "Set $f=x+1$", result: "$f'=1$", why: "numerator derivative" },
        { do: "Set $g=x-1$", result: "$g'=1$", why: "denominator derivative" },
        { do: "Apply the quotient rule", result: "$\\dfrac{(x-1)(1)-(x+1)(1)}{(x-1)^2}$", why: "use $gf'-fg'$" },
        { do: "Simplify the numerator", result: "$x-1-x-1=-2$", why: "combine terms carefully" },
        { do: "Write the derivative", result: "$-\\dfrac{2}{(x-1)^2}$", why: "keep the squared denominator" }
      ], answer: "$-2/(x-1)^2$" },
      { problem: "Differentiate $y=\\dfrac{x^2}{x+2}$.", steps: [
        { do: "Set $f=x^2$", result: "$f'=2x$", why: "numerator derivative" },
        { do: "Set $g=x+2$", result: "$g'=1$", why: "denominator derivative" },
        { do: "Apply the rule", result: "$\\dfrac{(x+2)(2x)-x^2}{(x+2)^2}$", why: "use $gf'-fg'$" },
        { do: "Expand", result: "$\\dfrac{2x^2+4x-x^2}{(x+2)^2}$", why: "multiply the first term" },
        { do: "Combine", result: "$\\dfrac{x^2+4x}{(x+2)^2}$", why: "simplify numerator" }
      ], answer: "$\\dfrac{x^2+4x}{(x+2)^2}$" },
      { problem: "Differentiate $y=\\dfrac{3x-5}{x^2+1}$.", steps: [
        { do: "Set $f=3x-5$", result: "$f'=3$", why: "numerator derivative" },
        { do: "Set $g=x^2+1$", result: "$g'=2x$", why: "denominator derivative" },
        { do: "Apply the quotient rule", result: "$\\dfrac{(x^2+1)3-(3x-5)2x}{(x^2+1)^2}$", why: "use the correct order" },
        { do: "Expand the numerator", result: "$3x^2+3-(6x^2-10x)$", why: "multiply each part" },
        { do: "Simplify", result: "$\\dfrac{-3x^2+10x+3}{(x^2+1)^2}$", why: "distribute the minus and combine" }
      ], answer: "$\\dfrac{-3x^2+10x+3}{(x^2+1)^2}$" },
      { problem: "Differentiate $y=\\dfrac{1}{x^2+4}$.", steps: [
        { do: "Set $f=1$", result: "$f'=0$", why: "constant numerator" },
        { do: "Set $g=x^2+4$", result: "$g'=2x$", why: "denominator derivative" },
        { do: "Apply the quotient rule", result: "$\\dfrac{(x^2+4)0-1(2x)}{(x^2+4)^2}$", why: "use $gf'-fg'$" },
        { do: "Simplify the numerator", result: "$-2x$", why: "the first term is zero" },
        { do: "Write the derivative", result: "$-\\dfrac{2x}{(x^2+4)^2}$", why: "denominator is squared" }
      ], answer: "$-2x/(x^2+4)^2$" },
      { problem: "For metric $A(t)=\\dfrac{80t}{t+20}$, find $A'(20)$.", steps: [
        { do: "Set $f=80t$", result: "$f'=80$", why: "numerator derivative" },
        { do: "Set $g=t+20$", result: "$g'=1$", why: "denominator derivative" },
        { do: "Apply the quotient rule", result: "$A'(t)=\\dfrac{(t+20)80-80t}{(t+20)^2}$", why: "use $gf'-fg'$" },
        { do: "Simplify", result: "$\\dfrac{1600}{(t+20)^2}$", why: "$80t$ cancels" },
        { do: "Substitute $t=20$", result: "$\\dfrac{1600}{40^2}=1$", why: "$40^2=1600$" }
      ], answer: "$A'(20)=1$" }
    ],
    applications: [
      { title: "Rates per user", background: "Product metrics often divide an aggregate by active users, so both numerator and denominator can move.", numbers: "If clicks $C=10t$ and users $U=t+100$, then $(C/U)'=1000/(t+100)^2$; at $t=100$, slope is $0.025$." },
      { title: "Signal-to-noise ratios", background: "Engineering systems compare signal power to noise power, and tuning can change both.", numbers: "For $S(x)=x^2/(x+1)$, $S'(2)=(4+4)/9=8/9$." },
      { title: "Precision metrics", background: "Precision is true positives divided by predicted positives, a ratio that changes with thresholds.", numbers: "If $TP=80-2t$ and $P=100-t$, then precision derivative is $[(100-t)(-2)-(80-2t)(-1)]/(100-t)^2$; at $t=20$, it is $-60/6400=-0.009375$." },
      { title: "Normalized features", background: "Normalization divides by a scale term to make features comparable.", numbers: "For $z=x/(x+10)$, $z'=10/(x+10)^2$; at $x=10$, slope is $0.025$." },
      { title: "A/B test lift", background: "Lift is often a ratio of treatment to control, so uncertainty and sensitivity follow quotient structure.", numbers: "If lift $r=a/b$ with $a=0.12,b=0.10$, then changing $a$ by $0.001$ changes $r$ by about $0.001/0.10=0.01$." },
      { title: "Average cost", background: "Average cost divides total cost by units, and its derivative shows whether scale is helping.", numbers: "For $C(q)=100+5q$, average $A=100/q+5$, so $A'=-100/q^2$; at $q=50$, slope is $-0.04$." }
    ],
    applicationsClose: "Ratios are careful objects: the top's change helps, the bottom's change can dilute, and the quotient rule keeps the signs straight.",
    takeaways: [
      "$\\frac{d}{dx}(f/g)=\\frac{gf'-fg'}{g^2}$ when $g\\ne0$.",
      "The order $gf'-fg'$ matters.",
      "Quotient derivatives appear in normalized metrics, rates, ratios, and average costs."
    ]
  },

  "math-01-19": {
    id: "math-01-19",
    title: "The chain rule",
    tagline: "The chain rule follows change through layers, multiplying local rates into one total rate.",
    connections: {
      buildsOn: ["The derivative", "power rule", "product and quotient rules"],
      leadsTo: ["implicit differentiation", "optimization", "backpropagation"],
      usedWith: ["composite functions", "linear approximation", "partial derivatives"]
    },
    motivation:
      "<p>Many functions are nested: $\\sqrt{1+x^2}$, $(3x-1)^5$, or a neural network layer inside a loss. The outside changes when the inside changes, and the inside changes when $x$ changes.</p>" +
      "<p>The <b>chain rule</b> is the language for that relay. It says total change equals outside sensitivity times inside sensitivity. If you understand this lesson, backprop becomes much less mysterious.</p>",
    definition:
      "<p>If $y=f(u)$ and $u=g(x)$ are differentiable, then $$\\frac{dy}{dx}=\\frac{dy}{du}\\cdot\\frac{du}{dx},$$ or equivalently $$(f\\circ g)'(x)=f'(g(x))g'(x).$$ The reason is that a small change $\\Delta x$ causes $\\Delta u\\approx g'(x)\\Delta x$, and that causes $\\Delta y\\approx f'(u)\\Delta u$, so $\\Delta y\\approx f'(g(x))g'(x)\\Delta x$.</p>" +
      "<p><b>Assumptions that matter:</b> the inner function must be differentiable at $x$, and the outer function must be differentiable at the inner value $g(x)$. Always identify the inner function before differentiating; missing the inner derivative is the classic error.</p>",
    worked: {
      problem: "Differentiate $y=(3x^2-1)^4$.",
      skills: ["chain rule", "power rule", "inner derivative"],
      strategy: "Treat the outside as a fourth power and the inside as $3x^2-1$.",
      steps: [
        { do: "Name the inner function", result: "$u=3x^2-1$", why: "the fourth power is applied to this whole expression" },
        { do: "Differentiate the outside", result: "$\\dfrac{d}{du}u^4=4u^3$", why: "power rule in the variable $u$" },
        { do: "Differentiate the inside", result: "$\\dfrac{du}{dx}=6x$", why: "power rule for $3x^2-1$" },
        { do: "Multiply outside by inside derivative", result: "$4u^3\\cdot6x$", why: "chain rule" },
        { do: "Substitute back $u=3x^2-1$", result: "$24x(3x^2-1)^3$", why: "write the derivative in terms of $x$" }
      ],
      verify: "At $x=1$, the derivative is $24(1)(2)^3=192$; a small finite difference gives a value close to $192$.",
      answer: "$y'=24x(3x^2-1)^3$",
      connects: "backpropagation is the chain rule repeated through many layers, multiplying local derivatives from output back to parameters."
    },
    practice: [
      { problem: "Differentiate $y=(5x-2)^3$.", steps: [
        { do: "Name the inner function", result: "$u=5x-2$", why: "the cube is outside" },
        { do: "Differentiate the outside", result: "$3u^2$", why: "power rule" },
        { do: "Differentiate the inside", result: "$5$", why: "slope of $5x-2$" },
        { do: "Multiply", result: "$15u^2$", why: "chain rule" },
        { do: "Substitute back", result: "$15(5x-2)^2$", why: "return to $x$" }
      ], answer: "$15(5x-2)^2$" },
      { problem: "Differentiate $y=\\sqrt{x^2+9}$ for all $x$.", steps: [
        { do: "Rewrite the root", result: "$(x^2+9)^{1/2}$", why: "use a power outside" },
        { do: "Name the inner function", result: "$u=x^2+9$", why: "the root acts on this expression" },
        { do: "Differentiate the outside", result: "$\\frac12u^{-1/2}$", why: "power rule" },
        { do: "Differentiate the inside", result: "$2x$", why: "derivative of $x^2+9$" },
        { do: "Multiply and simplify", result: "$\\dfrac{x}{\\sqrt{x^2+9}}$", why: "$\\frac12\\cdot2x=x$ and $u^{-1/2}=1/\\sqrt u$" }
      ], answer: "$x/\\sqrt{x^2+9}$" },
      { problem: "Differentiate $y=(x^3-4x)^2$.", steps: [
        { do: "Name the inner function", result: "$u=x^3-4x$", why: "the square wraps the polynomial" },
        { do: "Differentiate the outside", result: "$2u$", why: "power rule" },
        { do: "Differentiate the inside", result: "$3x^2-4$", why: "sum and difference rules" },
        { do: "Multiply", result: "$2u(3x^2-4)$", why: "chain rule" },
        { do: "Substitute back", result: "$2(x^3-4x)(3x^2-4)$", why: "write in terms of $x$" }
      ], answer: "$2(x^3-4x)(3x^2-4)$" },
      { problem: "Differentiate $y=\\dfrac{1}{(2x+1)^2}$.", steps: [
        { do: "Rewrite with a negative power", result: "$(2x+1)^{-2}$", why: "quotient becomes a power" },
        { do: "Name the inner function", result: "$u=2x+1$", why: "the negative power acts on $u$" },
        { do: "Differentiate the outside", result: "$-2u^{-3}$", why: "power rule" },
        { do: "Differentiate the inside", result: "$2$", why: "slope of $2x+1$" },
        { do: "Multiply and rewrite", result: "$-4(2x+1)^{-3}=-\\dfrac{4}{(2x+1)^3}$", why: "chain rule and negative exponent notation" }
      ], answer: "$-4/(2x+1)^3$" },
      { problem: "For a one-neuron loss $L(w)=(2w-6)^2$, compute $dL/dw$ at $w=1$ and one update with learning rate $0.05$.", steps: [
        { do: "Name the inner function", result: "$u=2w-6$", why: "the square wraps the prediction error" },
        { do: "Differentiate the outside", result: "$2u$", why: "power rule for squared loss" },
        { do: "Differentiate the inside", result: "$2$", why: "prediction changes twice as fast as $w$" },
        { do: "Multiply", result: "$dL/dw=4(2w-6)$", why: "chain rule" },
        { do: "Evaluate at $w=1$", result: "$4(-4)=-16$", why: "$2(1)-6=-4$" },
        { do: "Apply the update", result: "$w_{new}=1-0.05(-16)=1.8$", why: "gradient descent moves opposite the gradient" }
      ], answer: "$dL/dw=-16$ at $w=1$; the updated weight is $1.8$." }
    ],
    applications: [
      { title: "Backpropagation", background: "Backprop is the chain rule organized so each layer passes an upstream gradient to the layer before it.", numbers: "If $z=wx$, $a=z^2$, $L=3a$, with $w=2,x=4$, then $z=8$ and $dL/dw=3\\cdot2z\\cdot x=192$." },
      { title: "Squared loss with a linear model", background: "Least-squares training composes prediction, error, and square, so the chain rule gives the parameter gradient.", numbers: "For $L=(wx-y)^2$, $w=1,x=3,y=5$, error $=-2$, so $dL/dw=2(-2)\\cdot3=-12$." },
      { title: "Activation derivatives", background: "A neuron's activation is an outer nonlinear function applied to an inner affine score.", numbers: "For $a=(2x+1)^3$ at $x=1$, derivative is $3(3)^2\\cdot2=54$." },
      { title: "Feature standardization", background: "Preprocessing maps raw values into standardized values before a model uses them.", numbers: "If $z=(x-10)/2$ and loss $L=z^2$, then $dL/dx=2z\\cdot(1/2)=z$; at $x=14$, $z=2$, gradient is $2$." },
      { title: "Learning-rate schedules inside objectives", background: "Nested schedules occur when a parameter controls another quantity used by the loss.", numbers: "If $L(\\eta)=(1-5\\eta)^2$, then $L'=2(1-5\\eta)(-5)$; at $\\eta=0.1$, $L'=-5$." },
      { title: "Computer graphics transforms", background: "Composed transformations change coordinates layer by layer, and sensitivities multiply backward.", numbers: "If screen coordinate $s=3(2x+1)$, then $ds/dx=3\\cdot2=6$; a $0.1$ move in $x$ moves screen position by $0.6$." }
    ],
    applicationsClose: "The chain rule is the bridge from one local derivative to a whole pipeline: each layer tells how it changes, and multiplication carries the message through.",
    takeaways: [
      "For $y=f(g(x))$, the derivative is $f'(g(x))g'(x)$.",
      "Always multiply by the inner derivative.",
      "Backpropagation is the chain rule applied repeatedly through a computation graph."
    ]
  }
};
