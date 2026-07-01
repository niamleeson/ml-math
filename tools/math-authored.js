/* =====================================================================
   AUTHORED MATH LESSONS (gold standard) — merged by tools/gen-math.js.
   Keyed by lesson id (math-<TT>-<LL>). Each object uses the SPEC-NATIVE
   schema that the renderMath template renders (see MATH-LESSON-STRUCTURE.md):

     { id, title, tagline, tier?, prereqs?,
       connections: { buildsOn:[], leadsTo:[], usedWith:[] },   // §1
       motivation: "html",                                       // §2
       definition: "html",                                       // §3
       worked: { problem, difficulty, skills:[], strategy,       // §4
                 hints:[], steps:[{do,result,why}],
                 verify, answer, mistakes:[], connects },
       practice: [{problem, answer}],
       applications: [{title, background, numbers}],             // §5 (>=6)
       takeaways: [],
       demo?: function(host){}                                   // optional widget
     }

   The renderer enforces the structure; the author only fills fields.
   ===================================================================== */
"use strict";

/* ---- Topic 1: Single-variable calculus ---------------------------------- */

const t1_functions = {
  id: "math-01-01",
  title: "Functions and their graphs",
  tagline: "A function is a reliable machine: one input in, exactly one output out.",
  connections: {
    buildsOn: ["variables, numbers, and the coordinate plane"],
    leadsTo: ["<i>Function transformations</i>", "limits", "the derivative"],
    usedWith: ["every model in ML — a model <i>is</i> a function from inputs to a prediction"]
  },
  motivation:
    "<p>Think of a function as a dependable machine: one input in, exactly one output out — the same output every time for the same input. A vending machine that always returns a soda for button B3 is a function; one that sometimes returns chips is not.</p>" +
    "<p>That one rule — one input, one output — is the whole idea, and it is what lets us reason about change later.</p>",
  definition:
    "<p>A <b>function</b> $f$ from a set $X$ (the <b>domain</b>) to a set $Y$ assigns to each $x \\in X$ exactly one value $f(x)$. The outputs actually reached form the <b>range</b>. We write $f: X \\to Y$.</p>" +
    "<p><b>The rule that must hold:</b> each input maps to a single output — on a graph, the vertical line test. Inputs must come from the domain (no dividing by zero, no $\\sqrt{-1}$ over the reals).</p>",
  worked: {
    problem: "Take $f(x) = x^2$.",
    difficulty: 1,
    skills: ["evaluating", "domain & range"],
    steps: [
      { do: "Evaluate", result: "$f(3)=9$, $f(-2)=4$, $f(0)=0$", why: "substitute each input" },
      { do: "Domain", result: "$\\mathbb{R}$", why: "every real number can be squared" },
      { do: "Range", result: "$[0,\\infty)$", why: "a square is never negative" }
    ],
    answer: "domain $\\mathbb{R}$, range $[0,\\infty)$"
  },
  practice: [
    { problem: "$f(x)=1/(x-1)$: find $f(3)$ and the domain", answer: "$f(3)=\\tfrac12$; domain all $x \\ne 1$" }
  ],
  applications: [
    { title: "A model is a function", background: "A linear model maps a feature to a prediction.", numbers: "$f(x)=2x+1$ gives $f(4)=9$." },
    { title: "Activations are functions", background: "ReLU is the most common one in deep nets; every layer composes functions.", numbers: "$f(x)=\\max(0,x)$: $f(-3)=0$, $f(5)=5$." }
  ],
  takeaways: [
    "A function gives each input exactly one output; $f:X\\to Y$.",
    "Domain = inputs, range = outputs reached; the vertical line test enforces the rule.",
    "In ML a model is a function from features to predictions."
  ]
};

const t1_transform = {
  id: "math-01-02",
  title: "Function transformations",
  tagline: "Shift, stretch, and flip a graph you already know — without re-deriving anything.",
  connections: {
    buildsOn: ["<i>Functions and their graphs</i>"],
    leadsTo: ["reading exponentials, logs, and trig as shifted/scaled base curves"],
    usedWith: ["feature standardization", "the bias & scale inside every neural-network layer"]
  },
  motivation:
    "<p>Once you know one graph, you get a whole family for free. Sliding, stretching, or flipping a curve does not change what <i>kind</i> of curve it is — only where it sits and how tall it stands.</p>",
  definition:
    "<p>Starting from $y=f(x)$: $f(x)+c$ shifts up by $c$; $f(x-c)$ shifts right by $c$; $a\\,f(x)$ stretches vertically by $a$; $f(-x)$ reflects across the $y$-axis. Watch the counter-intuitive one: inside the function, $x-c$ moves the graph <i>right</i>, not left.</p>",
  worked: {
    problem: "Turn $f(x)=x^2$ into $g(x)=(x-2)^2+1$.",
    difficulty: 1,
    skills: ["shifts"],
    steps: [
      { do: "Shift right by 2", result: "$(x-2)^2$", why: "the $x-2$ inside the function" },
      { do: "Shift up by 1", result: "$(x-2)^2+1$", why: "the $+1$ outside" },
      { do: "Read the vertex", result: "$(2,1)$", why: "check $g(2)=1$" }
    ],
    answer: "vertex at $(2,1)$"
  },
  practice: [
    { problem: "Where is the vertex of $-(x+3)^2$?", answer: "$(-3,0)$, opening downward" }
  ],
  applications: [
    { title: "Standardization", background: "A shift then a scale centers and rescales a feature.", numbers: "$z=(x-\\mu)/\\sigma$ with $\\mu=10,\\sigma=2,x=14$ gives $z=2$." },
    { title: "Weights & biases", background: "A neuron computes a scale then a shift before its activation.", numbers: "$a x + b$ is exactly $a\\,f(x)$ then $+b$." }
  ],
  takeaways: [
    "$+c$ up, $f(x-c)$ right, $a f(x)$ stretch, $f(-x)$ reflect.",
    "Inside-the-function shifts go the opposite way you expect.",
    "Standardization and a neuron's $ax+b$ are shift-and-scale."
  ]
};

const t1_exp = {
  id: "math-01-03",
  title: "Exponential functions",
  tagline: "Repeated multiplication: the growth that outruns every polynomial.",
  connections: {
    buildsOn: ["functions and powers"],
    leadsTo: ["logarithms (its inverse)", "the derivative of $e^x$"],
    usedWith: ["the softmax", "learning-rate decay", "anything growing by a constant factor"]
  },
  motivation:
    "<p>Adding the same amount repeatedly gives a line. <i>Multiplying</i> by the same factor repeatedly gives an exponential — and it explodes. That runaway growth, and its mirror image (decay toward zero), is why exponentials are everywhere.</p>",
  definition:
    "<p>An <b>exponential</b> is $f(x)=a^x$ with base $a>0$; the natural base $e\\approx 2.718$ gives $e^x$. Its defining property turns sums into products: $e^{x+y}=e^x e^y$. Note $a^0=1$, and $a>0$ keeps the output positive and real.</p>",
  worked: {
    problem: "Read off values of $2^x$ and $e^x$.",
    difficulty: 1,
    skills: ["powers", "decay"],
    steps: [
      { do: "Growth", result: "$2^{10}=1024$", why: "ten doublings pass a thousand" },
      { do: "Natural base", result: "$e^0=1,\\ e^1\\approx2.718,\\ e^2\\approx7.389$", why: "powers of $e$" },
      { do: "Decay", result: "$e^{-1}\\approx0.368$", why: "a negative exponent shrinks it" }
    ],
    answer: "exponentials grow (or decay) by a constant factor per step"
  },
  practice: [
    { problem: "A quantity doubles each step from 3; value after 4 steps?", answer: "$3\\cdot 2^4 = 48$" }
  ],
  applications: [
    { title: "Softmax", background: "Turns scores into probabilities with exponentials.", numbers: "Logits $[2,1,0]\\to e^2=7.39,\\ e^1=2.72,\\ e^0=1$, sum $11.11$, probs $[0.665,0.245,0.090]$." },
    { title: "Learning-rate decay", background: "Multiplies the step size by a constant each epoch.", numbers: "$\\eta_t=\\eta_0 e^{-0.1t}$ from $0.1$: $0.090$ after 1 epoch, $0.037$ after 10." }
  ],
  takeaways: [
    "$a^x$ is repeated multiplication; natural base $e\\approx2.718$.",
    "$e^{x+y}=e^x e^y$; $a^0=1$; negative exponents give decay.",
    "Exponentials power the softmax and learning-rate decay."
  ]
};

const t1_log = {
  id: "math-01-04",
  title: "Logarithmic functions",
  tagline: "The inverse of exponentials — and the trick that turns products into sums.",
  connections: {
    buildsOn: ["<i>Exponential functions</i> (the log undoes them)"],
    leadsTo: ["logarithmic differentiation", "log-likelihood in statistics"],
    usedWith: ["cross-entropy loss", "numerical stability", "log-scale hyperparameter search"]
  },
  motivation:
    "<p>A logarithm answers one question: to what power must I raise the base to get this number? It is the exponential run backwards, and its superpower is turning multiplication into addition — exactly what you want when a product of many small numbers would underflow to zero.</p>",
  definition:
    "<p>$\\log_b y = x \\iff b^x = y$; the natural log is $\\ln = \\log_e$. Its defining identity is $\\log(xy)=\\log x+\\log y$. The input must be positive — $\\log$ of zero or a negative number is undefined over the reals.</p>",
  worked: {
    problem: "Evaluate a few logarithms.",
    difficulty: 1,
    skills: ["inverse of exp", "log rules"],
    steps: [
      { do: "Power of 2", result: "$\\log_2 1024 = 10$", why: "$2^{10}=1024$" },
      { do: "Undo an exponential", result: "$\\ln e^3 = 3$", why: "the log inverts the exponential" },
      { do: "Small number", result: "$\\log_{10} 0.001 = -3$", why: "$10^{-3}=0.001$" }
    ],
    answer: "logs invert exponentials and turn products into sums"
  },
  practice: [
    { problem: "Simplify $\\ln(e^2\\cdot e^5)$", answer: "$7$ (product rule: $2+5$)" }
  ],
  applications: [
    { title: "Log-likelihood beats underflow", background: "A product of many probabilities underflows; logs turn it into a sum.", numbers: "$100$ probs of $0.1$ = $10^{-100}$; but $100\\ln(0.1)=-230.3$, an ordinary number." },
    { title: "Cross-entropy", background: "Uses $-\\log p$ as the loss for the true class.", numbers: "$p=0.9$ costs $0.105$; a wrong $p=0.1$ costs $2.303$." }
  ],
  takeaways: [
    "$\\log_b y=x \\iff b^x=y$; the log inverts the exponential.",
    "$\\log(xy)=\\log x+\\log y$ turns products into sums (kills underflow).",
    "Log-likelihood and cross-entropy ($-\\log p$) are built on this."
  ]
};

const t1_trig = {
  id: "math-01-05",
  title: "Trigonometric functions",
  tagline: "The mathematics of anything that repeats: circles, waves, and oscillations.",
  connections: {
    buildsOn: ["the unit circle and angles"],
    leadsTo: ["derivatives of trig functions", "Fourier analysis"],
    usedWith: ["positional encodings in Transformers", "signal processing", "rotations"]
  },
  motivation:
    "<p>Wrap a number line around a circle and you get sine and cosine — your height and sideways position as you walk around. Because a circle closes on itself, they repeat forever, which makes them the natural language for anything periodic, from sound waves to token positions.</p>",
  definition:
    "<p>On the unit circle, $\\cos\\theta$ is the $x$-coordinate and $\\sin\\theta$ the $y$-coordinate at angle $\\theta$. Both are <b>periodic</b> with period $2\\pi$. The identity that ties them together: $\\sin^2\\theta+\\cos^2\\theta=1$. Use radians in calculus ($\\pi$ rad $=180^\\circ$).</p>",
  worked: {
    problem: "Evaluate sine and cosine at key angles.",
    difficulty: 1,
    skills: ["unit circle", "periodicity"],
    steps: [
      { do: "Sine", result: "$\\sin 0=0,\\ \\sin(\\pi/2)=1,\\ \\sin\\pi=0$", why: "the $y$-coordinate around the circle" },
      { do: "Cosine", result: "$\\cos 0=1,\\ \\cos\\pi=-1$", why: "the $x$-coordinate" },
      { do: "Check the identity", result: "at $\\pi/2$: $1^2+0^2=1$", why: "Pythagoras on the unit circle" }
    ],
    answer: "sine and cosine oscillate between $-1$ and $1$ with period $2\\pi$"
  },
  practice: [
    { problem: "$\\sin(2\\pi+\\pi/2)$?", answer: "$1$, by periodicity" }
  ],
  applications: [
    { title: "Positional encodings", background: "Transformers encode token position with sines and cosines at many frequencies.", numbers: "$\\text{PE}(pos,2i)=\\sin(pos/10000^{2i/d})$ lets the model tell position 5 from 50." },
    { title: "Signals & rotations", background: "Oscillations decompose into sines (Fourier); a 2-D rotation is built from $\\cos\\theta,\\sin\\theta$.", numbers: "Rotating by $\\theta$ uses $\\left[\\begin{smallmatrix}\\cos\\theta&-\\sin\\theta\\\\\\sin\\theta&\\cos\\theta\\end{smallmatrix}\\right]$." }
  ],
  takeaways: [
    "$\\cos\\theta,\\sin\\theta$ are unit-circle coordinates; period $2\\pi$.",
    "Core identity $\\sin^2\\theta+\\cos^2\\theta=1$; use radians in calculus.",
    "They drive positional encodings, Fourier analysis, and rotations."
  ]
};

const t1_invtrig = {
  id: "math-01-06",
  title: "Inverse trigonometric functions",
  tagline: "Going backwards from a ratio to the angle that produced it.",
  connections: {
    buildsOn: ["<i>Trigonometric functions</i>"],
    leadsTo: ["their derivatives and integrals"],
    usedWith: ["recovering angles from dot products", "smooth squashing functions"]
  },
  motivation:
    "<p>Sine takes an angle and gives a ratio; sometimes you have the ratio and want the angle back. That is the inverse. Since sine repeats, infinitely many angles share a value, so we restrict the domain to pick one canonical answer.</p>",
  definition:
    "<p>$\\arcsin,\\arccos,\\arctan$ invert $\\sin,\\cos,\\tan$ on restricted ranges so each output is unique: $\\arcsin,\\arctan\\in[-\\tfrac\\pi2,\\tfrac\\pi2]$ and $\\arccos\\in[0,\\pi]$. So $\\arcsin(\\sin\\theta)=\\theta$ only when $\\theta$ lies in that range.</p>",
  worked: {
    problem: "Evaluate some inverse-trig values.",
    difficulty: 2,
    skills: ["restricted ranges"],
    steps: [
      { do: "Arctangent", result: "$\\arctan(1)=\\pi/4\\approx0.785$", why: "the angle whose tangent is 1" },
      { do: "Arcsine", result: "$\\arcsin(1)=\\pi/2$", why: "sine is 1 at $\\pi/2$" },
      { do: "Arccosine", result: "$\\arccos(0)=\\pi/2$", why: "cosine is 0 at $\\pi/2$" }
    ],
    answer: "each returns the unique angle in its restricted range"
  },
  practice: [
    { problem: "$\\arctan(0)$?", answer: "$0$" }
  ],
  applications: [
    { title: "Angle from similarity", background: "The angle between two unit vectors comes from their cosine similarity.", numbers: "$\\theta=\\arccos(\\text{sim})$; a similarity of $0.5$ means $60^\\circ$ apart in embedding space." },
    { title: "Orientation", background: "Robotics and graphics turn a coordinate pair into a heading with atan2.", numbers: "$\\operatorname{atan2}(1,1)=\\pi/4$." }
  ],
  takeaways: [
    "$\\arcsin,\\arccos,\\arctan$ recover an angle from a ratio, on restricted ranges.",
    "Restriction avoids multivalued inverses.",
    "Used to get angles from cosine similarity ($\\arccos$) and headings ($\\operatorname{atan2}$)."
  ]
};

const t1_limits = {
  id: "math-01-07",
  title: "Limits: definition and computation",
  tagline: "What value does a function head toward as the input closes in — even if it never arrives?",
  connections: {
    buildsOn: ["<i>Functions and their graphs</i>", "the everyday idea of getting closer"],
    leadsTo: ["continuity", "the derivative (a limit of slopes)"],
    usedWith: ["convergence throughout ML — a loss settling toward a value, a learning rate shrinking to zero"]
  },
  motivation:
    "<p>Sometimes you cannot simply plug in. Look at $f(x)=\\dfrac{x^2-1}{x-1}$ at $x=1$: you get $\\tfrac00$, undefined. And yet the graph clearly heads somewhere as $x$ slides toward $1$.</p>" +
    "<p>A <b>limit</b> answers exactly that — not the value <i>at</i> the point, but the value the function is <i>heading toward</i>. The destination can be clear even when the road has a pothole right at the end. That shift in question is the doorway to all of calculus.</p>",
  definition:
    "<p>$\\lim_{x\\to a}f(x)=L$ means $f(x)$ can be made as close to $L$ as we like by taking $x$ close enough to $a$ (from both sides), without ever setting $x=a$. Rigorously, the $\\varepsilon$–$\\delta$ statement: for every $\\varepsilon>0$ there is a $\\delta>0$ with $0<|x-a|<\\delta \\Rightarrow |f(x)-L|<\\varepsilon$.</p>" +
    "<p><b>Assumptions that matter:</b> the value $f(a)$ is irrelevant — it may be undefined and the limit can still exist. But the left and right limits must agree, or the limit does not exist.</p>",
  worked: {
    problem: "Compute $\\displaystyle\\lim_{x\\to1}\\frac{x^2-1}{x-1}$.",
    difficulty: 2,
    skills: ["factoring", "indeterminate forms", "one-sided limits"],
    strategy: "Direct substitution gives $\\tfrac00$, an indeterminate form. Rewrite to cancel what causes the $0$, then substitute.",
    hints: [
      "Plug in $x=1$ first and name the problem you hit.",
      "The numerator $x^2-1$ is a difference of squares — factor it.",
      "Cancel the common $(x-1)$ — legal, since the limit never sets $x=1$ — then substitute."
    ],
    steps: [
      { do: "Try direct substitution", result: "$\\tfrac00$", why: "indeterminate — substitution alone fails" },
      { do: "Factor the numerator", result: "$\\dfrac{(x-1)(x+1)}{x-1}$", why: "difference of squares" },
      { do: "Cancel $(x-1)$", result: "$x+1$ (for $x\\ne1$)", why: "the limit ignores the single point $x=1$" },
      { do: "Substitute $x=1$", result: "$2$", why: "the simplified form is continuous, so plugging in is safe" }
    ],
    verify: "$x=0.99\\to1.99$ and $x=1.01\\to2.01$ — closing on $2$ from both sides &#10003; (drag the slider below to feel it).",
    answer: "$\\displaystyle\\lim_{x\\to1}\\frac{x^2-1}{x-1}=2$",
    mistakes: [
      "Declaring the limit \"does not exist\" because $f(1)$ is undefined — the value <i>at</i> the point is irrelevant.",
      "Forgetting the cancelled form $x+1$ only equals $f$ for $x\\ne1$.",
      "Checking one side only — the left and right limits must agree."
    ],
    connects: "continuity — the answer $2$ is exactly $f$'s continuous extension at $x=1$, filling the hole in the graph."
  },
  practice: [
    { problem: "$\\lim_{x\\to3}\\dfrac{x^2-x-6}{x-3}$", steps: [
      { do: "Try substitution", result: "$\\frac{9-3-6}{0}=\\frac00$", why: "indeterminate — rewrite first" },
      { do: "Factor the numerator", result: "$\\dfrac{(x-3)(x+2)}{x-3}$", why: "$x^2-x-6=(x-3)(x+2)$" },
      { do: "Cancel $(x-3)$", result: "$x+2$", why: "valid for $x\\ne3$" },
      { do: "Substitute $x=3$", result: "$5$", why: "the simplified form is continuous" }
    ], answer: "$5$" },
    { problem: "$\\lim_{x\\to0}\\dfrac{\\sqrt{x+4}-2}{x}$", steps: [
      { do: "Try substitution", result: "$\\frac{2-2}{0}=\\frac00$", why: "indeterminate" },
      { do: "Multiply by the conjugate $\\frac{\\sqrt{x+4}+2}{\\sqrt{x+4}+2}$", result: "$\\dfrac{(x+4)-4}{x(\\sqrt{x+4}+2)}$", why: "rationalize the numerator" },
      { do: "Simplify the numerator", result: "$\\dfrac{x}{x(\\sqrt{x+4}+2)}$", why: "$(x+4)-4=x$" },
      { do: "Cancel $x$", result: "$\\dfrac{1}{\\sqrt{x+4}+2}$", why: "valid for $x\\ne0$" },
      { do: "Substitute $x=0$", result: "$\\frac14$", why: "$\\sqrt4+2=4$" }
    ], answer: "$\\frac14$" },
    { problem: "$\\lim_{x\\to0}\\dfrac{\\frac{1}{x+2}-\\frac12}{x}$", steps: [
      { do: "Try substitution", result: "$\\frac00$", why: "indeterminate" },
      { do: "Combine the top over a common denominator", result: "$\\dfrac{2-(x+2)}{2(x+2)\\,x}$", why: "$\\frac{1}{x+2}-\\frac12=\\frac{2-(x+2)}{2(x+2)}$" },
      { do: "Simplify the numerator", result: "$\\dfrac{-x}{2(x+2)\\,x}$", why: "$2-(x+2)=-x$" },
      { do: "Cancel $x$", result: "$\\dfrac{-1}{2(x+2)}$", why: "valid for $x\\ne0$" },
      { do: "Substitute $x=0$", result: "$-\\frac14$", why: "$2\\cdot2=4$" }
    ], answer: "$-\\frac14$" },
    { problem: "$\\lim_{x\\to\\infty}\\left(\\sqrt{x^2+3x}-x\\right)$", steps: [
      { do: "Recognize the form", result: "$\\infty-\\infty$", why: "both terms grow" },
      { do: "Multiply by the conjugate", result: "$\\dfrac{(x^2+3x)-x^2}{\\sqrt{x^2+3x}+x}$", why: "rationalize" },
      { do: "Simplify the numerator", result: "$\\dfrac{3x}{\\sqrt{x^2+3x}+x}$", why: "$(x^2+3x)-x^2=3x$" },
      { do: "Divide top and bottom by $x$", result: "$\\dfrac{3}{\\sqrt{1+3/x}+1}$", why: "$x>0$" },
      { do: "Take $x\\to\\infty$", result: "$\\frac32$", why: "$3/x\\to0$" }
    ], answer: "$\\frac32$" },
    { problem: "$\\lim_{h\\to0}\\dfrac{(x+h)^3-x^3}{h}$ &nbsp;(the derivative of $x^3$)", steps: [
      { do: "Expand $(x+h)^3$", result: "$x^3+3x^2h+3xh^2+h^3$", why: "binomial expansion" },
      { do: "Subtract $x^3$", result: "$3x^2h+3xh^2+h^3$", why: "the $x^3$ terms cancel" },
      { do: "Divide by $h$", result: "$3x^2+3xh+h^2$", why: "factor $h$ from every term" },
      { do: "Take $h\\to0$", result: "$3x^2$", why: "the $h$ terms vanish" }
    ], answer: "$3x^2$ — the gradient of $x^3$, exactly what backprop computes." }
  ],
  applications: [
    { title: "The gradient is a limit", background: "Backprop rests on $f'(x)=\\lim_{h\\to0}\\frac{f(x+h)-f(x)}{h}$; a gradient check evaluates it at small finite $h$.", numbers: "For $f(x)=x^2$ at $x=2$, $h=0.001$ gives $\\frac{4.004001-4}{0.001}=4.001\\approx4$." },
    { title: "Numerical differentiation", background: "The central difference converges faster, but too-small $h$ triggers floating-point cancellation.", numbers: "At $x=2$, $h=0.01$: $\\frac{4.0401-3.9601}{0.02}=4.000$; the sweet spot is near $h\\approx10^{-8}$ in double precision." },
    { title: "Training convergence", background: "\"SGD converges\" means the loss has a limit; schedules send the learning rate's limit to 0.", numbers: "$\\eta_t=\\eta_0/t\\to0$ so updates settle instead of bouncing." },
    { title: "Activation saturation", background: "The sigmoid's limits are 1 and 0; deep in saturation the slope vanishes.", numbers: "At $x=6$, $\\sigma=0.9975$ with slope $\\approx0.0025$ — the vanishing-gradient problem." },
    { title: "Algorithm analysis (Big-O)", background: "Asymptotics are limits as $n\\to\\infty$.", numbers: "$\\lim_{n\\to\\infty}\\frac{3n^2+5n}{n^2}=3$, so $3n^2+5n=\\Theta(n^2)$." },
    { title: "Discounted returns in RL", background: "A discounted reward stream sums to a limit — the effective horizon.", numbers: "$\\sum_{t=0}^{\\infty}\\gamma^t=\\frac{1}{1-\\gamma}$; with $\\gamma=0.99$ that is $100$." }
  ],
  applicationsClose: "One idea — \"what value is this heading toward?\" — reused six different ways.",
  takeaways: [
    "$\\lim_{x\\to a}f(x)=L$ asks where $f$ is heading near $a$, not its value at $a$.",
    "If direct substitution gives $\\tfrac00$, rewrite (factor and cancel) then substitute.",
    "Left and right limits must agree for the limit to exist.",
    "The derivative/gradient is a limit; finite differences approximate it (e.g. $4.001\\approx4$)."
  ],
  demo: function (host) {
    var lab = document.createElement("label");
    lab.textContent = "Slide x toward 1 — watch f(x) = (x^2 - 1)/(x - 1) head for 2";
    var r = document.createElement("input");
    r.type = "range"; r.min = "0.5"; r.max = "1.5"; r.step = "0.001"; r.value = "0.6";
    var out = document.createElement("div"); out.className = "out";
    function upd() {
      var x = parseFloat(r.value);
      var f = (Math.abs(x - 1) < 1e-9) ? null : (x * x - 1) / (x - 1);
      out.textContent = "x = " + x.toFixed(3) + "     f(x) = " + (f === null ? "undefined (0/0)" : f.toFixed(3)) + "     -> heading toward 2";
    }
    r.addEventListener("input", upd);
    host.appendChild(lab); host.appendChild(r); host.appendChild(out); upd();
  }
};

/* ---- Topic 3: Differential equations — the Laplace transform ------------- */

const laplace = {
  id: "math-03-27",
  title: "The Laplace transform",
  tagline: "Turn a differential equation into an algebra problem — solve it, then translate back.",
  prereqs: ["math-03-06", "math-01-43"],
  connections: {
    buildsOn: ["improper integrals ($\\int_0^\\infty$)", "the exponential and its self-similar derivative", "complex numbers ($s=\\sigma+i\\omega$)", "partial fractions", "the eigen-idea from linear algebra"],
    leadsTo: ["the Fourier transform (Laplace on the imaginary axis, $s=i\\omega$)", "control theory (transfer functions, poles, stability)", "the $z$-transform", "stability of dynamical systems"],
    usedWith: ["linear algebra — a system's poles are the eigenvalues of its dynamics", "convolution — $\\mathcal{L}\\{f*g\\}=F(s)G(s)$", "probability — $\\mathbb{E}[e^{-sX}]$ is the moment-generating function"]
  },
  motivation:
    "<p>Let's start with something you can already do. If I hand you $y'=-2y$, you can almost see the answer — it is an exponential, $e^{-2t}$. That instinct is exactly right.</p>" +
    "<p>Now let me raise the stakes, gently. Solve $y''+3y'+2y=\\sin t$ with $y(0)=y'(0)=0$. The usual calculus route asks you to guess the shape of the answer, match coefficients, and chase down constants — it works, but it is fiddly, and it is easy to lose your place. If that feels daunting, you are not missing anything.</p>" +
    "<p>So here is the happy idea: what if we could take this tangled differential equation, turn it into an ordinary algebra problem, solve for one thing, and translate back? That is the Laplace transform. The key: it rewrites a function of time $t$ in a basis of exponentials $e^{st}$ — chosen because exponentials are the <b>eigenfunctions of the derivative</b> ($\\frac{d}{dt}e^{st}=s\\,e^{st}$), so differentiation becomes multiplication by $s$. Like shifting from a car's meshed gears (time) to a dashboard of separate dials ($s$-domain), where the problem is decoupled.</p>",
  definition:
    "<p>The Laplace transform of $f(t)$ is $$ F(s)=\\mathcal{L}\\{f(t)\\}=\\int_0^\\infty e^{-st}f(t)\\,dt, $$ valid where the integral converges ($\\operatorname{Re}(s)>a$). Here $e^{-st}$ is a probe exponential, $F(s)$ is $f$ re-expressed in the $s$-domain, and the one-sided $\\int_0^\\infty$ means we care about systems starting at $t=0$.</p>" +
    "<p>The property that does all the work turns differentiation into multiplication: $$ \\mathcal{L}\\{f'(t)\\}=sF(s)-f(0). $$ Derive it once by integration by parts ($u=e^{-st},dv=f'dt$): $\\int_0^\\infty e^{-st}f'\\,dt=[e^{-st}f]_0^\\infty+s\\int_0^\\infty e^{-st}f\\,dt=(0-f(0))+sF(s)$. Notice where $f(0)$ enters — that is how the initial condition rides along.</p>" +
    "<p><b>Assumptions:</b> linear, usually constant-coefficient systems (nonlinear gets only a local picture); the region of convergence matters; it is one-sided, so initial conditions are already baked in; inversion needs care with repeated or complex roots.</p>",
  worked: {
    problem: "Solve the initial-value problem $y'+2y=2$, with $y(0)=0$. Let $Y=\\mathcal{L}\\{y(t)\\}$.",
    difficulty: 4,
    skills: ["derivative property", "partial fractions", "table inversion"],
    strategy: "The derivative is the obstacle — transform to turn it into algebra; the initial condition rides along.",
    hints: [
      "Apply $\\mathcal{L}$; use $\\mathcal{L}\\{y'\\}=sY-y(0)$ and $\\mathcal{L}\\{2\\}=2/s$.",
      "Get every $Y$ term on the left, then isolate $Y$.",
      "Split with partial fractions, then invert each term by sight."
    ],
    steps: [
      { do: "Apply $\\mathcal{L}$ to both sides", result: "$\\mathcal{L}\\{y'\\}+2Y=\\mathcal{L}\\{2\\}$", why: "linearity transforms each term separately" },
      { do: "Replace $\\mathcal{L}\\{y'\\}$ with $sY-y(0)$", result: "$sY-y(0)+2Y=\\mathcal{L}\\{2\\}$", why: "this removes the derivative" },
      { do: "Replace $\\mathcal{L}\\{2\\}$ with $2/s$", result: "$sY-y(0)+2Y=2/s$", why: "from the table" },
      { do: "Substitute $y(0)=0$", result: "$sY+2Y=2/s$", why: "plug in the initial condition" },
      { do: "Factor $Y$", result: "$Y(s+2)=2/s$", why: "prepare to isolate $Y$" },
      { do: "Divide by $(s+2)$", result: "$Y=\\dfrac{2}{s(s+2)}$", why: "solved in the $s$-domain" },
      { do: "Partial fractions", result: "$Y=\\dfrac{1}{s}-\\dfrac{1}{s+2}$", why: "match table entries" },
      { do: "Invert each term", result: "$y(t)=1-e^{-2t}$", why: "$\\mathcal{L}^{-1}\\{1/(s+a)\\}=e^{-at}$" }
    ],
    verify: "$y(0)=1-1=0$ &#10003; and $y'+2y=2e^{-2t}+2(1-e^{-2t})=2$ &#10003;. The exponent $-2$ is a <b>pole</b>; negative means it decays — stable.",
    answer: "$y(t)=1-e^{-2t}$ (rises to steady state $1$ with time constant $1/2$)",
    mistakes: [
      "Dropping the $-y(0)$ term (the #1 error).",
      "Ignoring the region of convergence when inverting.",
      "Double-counting the initial condition."
    ],
    connects: "poles &amp; stability — the roots in $s$ are the system's natural modes, and their real parts decide whether it decays, blows up, or oscillates."
  },
  practice: [
    { problem: "$y'+3y=0,\\ y(0)=5$", answer: "$y=5e^{-3t}$" },
    { problem: "$y'+y=e^{-2t},\\ y(0)=0$", answer: "$Y=\\dfrac{1}{(s+1)(s+2)}$, so $y=e^{-t}-e^{-2t}$" },
    { problem: "$y''+2y'+5y=0,\\ y(0)=1,\\ y'(0)=0$: find the poles and classify", answer: "$s=-1\\pm2i$ → damped oscillation (stable)" }
  ],
  applications: [
    { title: "Momentum & training stability", background: "Polyak's 1964 heavy-ball method; near a minimum it is a damped oscillator $\\ddot x+c\\dot x+x=0$ with poles $s=\\tfrac{-c\\pm\\sqrt{c^2-4}}{2}$.", numbers: "$c=0.5$: $-0.25\\pm0.97i$ (oscillates); $c=2$: $-1$ (critical, fastest); $c=3$: $-0.38,-2.62$ ($2.6\\times$ slower)." },
    { title: "EMA — Adam, BatchNorm, EMA teachers", background: "A running average $m_t=\\beta m_{t-1}+(1-\\beta)x_t$ is the discrete twin of $y=1-e^{-at}$.", numbers: "Memory $\\approx1/(1-\\beta)$: $\\beta=0.9\\to\\sim10$ steps ($1-0.9^{10}=65\\%$); $0.99\\to100$; $0.999\\to1000$." },
    { title: "State-space models (S4/Mamba)", background: "A mode discretizes to $x_t=r\\,x_{t-1}+\\cdots$ with $r=e^{\\text{pole}\\cdot\\Delta}$; memory $\\approx1/(1-r)$.", numbers: "$r=0.99\\to100$ steps; $r=0.999\\to1000$; $r=1.001\\to$ unstable ($\\sim0.1\\%$/step growth)." },
    { title: "Neural ODEs & diffusion", background: "Both are defined by differential equations, so step size is capped by stability.", numbers: "Explicit Euler on $x'=\\lambda x$ needs $|1+h\\lambda|<1$; a stiff $\\lambda=-10$ forces $h<0.2$." },
    { title: "Control ↔ RL", background: "Feedback moves a plant's poles; RL inherits this through optimal control.", numbers: "Plant $1/(s+1)$ (pole $-1$, settling $\\sim4$s); gain $K=9\\to$ pole $-10\\to$ settling $\\approx0.4$s, a $10\\times$ speed-up." },
    { title: "Core CS — queues", background: "Queueing theory (Erlang, early 1900s) uses the transform of the service-time distribution.", numbers: "M/M/1 with $\\lambda=8,\\mu=10$: $\\rho=0.8$, $L=\\rho/(1-\\rho)=4$, $W=L/\\lambda=0.5$s; service transform $\\mu/(s+\\mu)$ has a pole at $-10$." }
  ],
  applicationsClose: "The thread through all six: compute a pole, read its real part, know the behavior. One idea, six uniforms.",
  takeaways: [
    "The Laplace transform turns differentiation into multiplication by $s$, converting a linear ODE into algebra.",
    "$F(s)=\\int_0^\\infty e^{-st}f(t)\\,dt$; key property $\\mathcal{L}\\{f'\\}=sF(s)-f(0)$, where the initial condition enters.",
    "Worked example: $y'+2y=2,\\ y(0)=0\\Rightarrow y=1-e^{-2t}$ — a pole at $-2$, so it decays (stable).",
    "The poles are the system's modes; their real parts decide stability.",
    "The same idea powers momentum, EMA/Adam, state-space models, control/RL, and queueing."
  ]
};

module.exports = {
  "math-01-01": t1_functions,
  "math-01-02": t1_transform,
  "math-01-03": t1_exp,
  "math-01-04": t1_log,
  "math-01-05": t1_trig,
  "math-01-06": t1_invtrig,
  "math-01-07": t1_limits,
  "math-03-27": laplace
};
