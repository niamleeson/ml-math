/* =====================================================================
   AUTHORED MATH LESSONS (gold standard) — merged by tools/gen-math.js.
   Keyed by lesson id (math-<TT>-<LL>). Any id present here is emitted in
   full instead of the scaffold. Bodies are HTML with $...$ / $$...$$ LaTeX.
   To deepen a scaffolded lesson: add its id here and re-run gen-math.js.
   ===================================================================== */
"use strict";

const laplace = {
  id: "math-03-27",
  title: "The Laplace transform",
  tagline: "Turn a differential equation into an algebra problem — solve it, then translate back.",
  prereqs: ["math-03-06", "math-01-43"],
  sections: [
    {
      h: "Connections",
      body:
        "<p>The Laplace transform sits in the middle of <b>Differential equations</b>, and it reaches outward to much of the rest of the track. Here is the map, so you know where you are before we dig in.</p>" +
        "<ul class=\"steps\">" +
        "<li><b>Builds on</b> — improper integrals ($\\int_0^\\infty$), the exponential and its self-similar derivative, complex numbers ($s = \\sigma + i\\omega$), partial fractions, and the conceptual parent: the eigen-idea from linear algebra.</li>" +
        "<li><b>Leads to</b> — the Fourier transform (Laplace on the imaginary axis, $s = i\\omega$), control theory (transfer functions, poles, stability), the $z$-transform (its discrete-time sibling), and stability of dynamical systems.</li>" +
        "<li><b>Used with</b> — <i>linear algebra</i> (a system's poles are the eigenvalues of its dynamics); <i>convolution</i> ($\\mathcal{L}\\{f * g\\} = F(s)\\,G(s)$, turning convolution into multiplication); and <i>probability</i>, where $\\mathbb{E}[e^{-sX}]$ is the Laplace transform of a density — the moment-generating function.</li>" +
        "</ul>"
    },
    {
      h: "Motivation & Intuition",
      body:
        "<p>Let's start with something you can already do. If I hand you $y' = -2y$, you can almost see the answer — it is an exponential, $e^{-2t}$. That instinct is exactly right.</p>" +
        "<p>Now let me raise the stakes, gently. Suppose I write $y'' + 3y' + 2y = \\sin t$, with $y(0) = y'(0) = 0$, and ask for $y(t)$. Sit with it a moment — the difficulty climbs. The usual calculus route asks you to guess the shape of the answer, match coefficients, and chase down constants. It works, but it is fiddly, and it is easy to lose your place. If that feels daunting, you are not missing anything — it genuinely is.</p>" +
        "<p>So here is the happy idea. What if we did not have to do the calculus at all? What if we could take this tangled differential equation, turn it into an ordinary algebra problem, solve for one thing, and translate the answer back? That is exactly what the Laplace transform gives us.</p>" +
        "<p>The one idea to hold onto: the transform re-describes a function of <i>time</i> $t$ as a function of a complex <i>frequency</i> $s$, written in a basis of exponentials $e^{st}$ — chosen because exponentials are the <b>eigenfunctions of the derivative</b> ($\\frac{d}{dt}e^{st} = s\\,e^{st}$). Taking a derivative no longer changes the shape; it just multiplies by $s$. If you like a picture: the time domain is a car's meshed <b>gears</b>; the $s$-domain is the <b>dashboard</b>, a row of separate dials. We shift up to the dashboard, where everything is decoupled, do the easy work, then shift back down. It is the same move as diagonalizing a matrix — just wearing different clothes.</p>"
    },
    {
      h: "Definition & Assumptions",
      body:
        "<p>The Laplace transform of $f(t)$ is defined by the integral</p>" +
        "$$ F(s) = \\mathcal{L}\\{f(t)\\} = \\int_0^\\infty e^{-st} f(t)\\, dt, $$" +
        "<p>valid for those $s$ where the integral converges (the region of convergence, $\\operatorname{Re}(s) > a$ for some $a$). Every symbol, in plain English:</p>" +
        "<table class=\"extable\"><thead><tr><th>symbol</th><th>meaning</th></tr></thead><tbody>" +
        "<tr><td class=\"row-h\">$f(t)$</td><td>a function of time $t \\ge 0$ — the signal we start with</td></tr>" +
        "<tr><td class=\"row-h\">$s$</td><td>a complex \"frequency\", $s = \\sigma + i\\omega$</td></tr>" +
        "<tr><td class=\"row-h\">$e^{-st}$</td><td>a probe exponential; the integral measures how much of that mode $f$ contains</td></tr>" +
        "<tr><td class=\"row-h\">$F(s)$</td><td>the transform — $f$ re-expressed in the $s$-domain</td></tr>" +
        "<tr><td class=\"row-h\">$\\int_0^\\infty$</td><td>one-sided: we care about systems that start at $t = 0$</td></tr>" +
        "</tbody></table>" +
        "<p>The single property that makes it all work turns differentiation into multiplication:</p>" +
        "$$ \\mathcal{L}\\{f'(t)\\} = sF(s) - f(0). $$" +
        "<p>Do not memorize it — derive it once with integration by parts ($u = e^{-st},\\ dv = f'\\,dt$):</p>" +
        "$$ \\int_0^\\infty e^{-st} f'(t)\\,dt = \\big[e^{-st} f(t)\\big]_0^\\infty + s\\int_0^\\infty e^{-st} f(t)\\,dt = \\big(0 - f(0)\\big) + sF(s). $$" +
        "<p>Notice exactly where $f(0)$ enters — that is how the initial condition rides along automatically.</p>" +
        "<p><b>Assumptions to respect:</b> the method is for <i>linear</i>, usually constant-coefficient systems (nonlinear systems get only a local, linearized picture); the region of convergence matters (ignore it and the inverse is ambiguous); it is one-sided, so initial conditions are already baked in — do not double-count; and inversion needs care with repeated or complex roots, which produce $t\\,e^{-at}$ terms and damped sinusoids.</p>"
    },
    {
      h: "Worked Example & Practice",
      body:
        "<p>Solve the initial-value problem $y' + 2y = 2$, with $y(0) = 0$. We move one operation at a time; each step names its reason. Let $Y = \\mathcal{L}\\{y(t)\\}$.</p>" +
        "<ol class=\"steps\">" +
        "<li><b>Apply $\\mathcal{L}$ to both sides</b> &rarr; $\\mathcal{L}\\{y'\\} + 2Y = \\mathcal{L}\\{2\\}$. <i>Linearity lets us transform each term separately.</i></li>" +
        "<li><b>Replace $\\mathcal{L}\\{y'\\}$ with $sY - y(0)$</b> &rarr; $sY - y(0) + 2Y = \\mathcal{L}\\{2\\}$. <i>This removes the derivative.</i></li>" +
        "<li><b>Replace $\\mathcal{L}\\{2\\}$ with $2/s$</b> &rarr; $sY - y(0) + 2Y = 2/s$. <i>From the table.</i></li>" +
        "<li><b>Substitute $y(0) = 0$</b> &rarr; $sY + 2Y = 2/s$. <i>Plug in the initial condition.</i></li>" +
        "<li><b>Factor $Y$ on the left</b> &rarr; $Y(s + 2) = 2/s$. <i>Prepare to isolate $Y$.</i></li>" +
        "<li><b>Divide by $(s+2)$</b> &rarr; $Y = \\dfrac{2}{s(s+2)}$. <i>$Y$ is isolated — the ODE is solved in the $s$-domain.</i></li>" +
        "<li><b>Split by partial fractions</b> &rarr; $Y = \\dfrac{1}{s} - \\dfrac{1}{s+2}$. <i>Match table entries so we can invert by sight.</i></li>" +
        "<li><b>Invert each term</b> &rarr; $y(t) = 1 - e^{-2t}$. <i>$\\mathcal{L}^{-1}\\{1/s\\} = 1$ and $\\mathcal{L}^{-1}\\{1/(s+a)\\} = e^{-at}$.</i></li>" +
        "</ol>" +
        "<p><b>Verify.</b> $y(0) = 1 - 1 = 0$ &#10003;, and $y' + 2y = 2e^{-2t} + 2(1 - e^{-2t}) = 2$ &#10003;. The solution rises from $0$ to a steady state of $1$ with time constant $1/2$. The exponent $-2$ is a <b>pole</b>; its negative sign means the solution decays — the system is stable.</p>" +
        "<p><b>Practice</b> (scaffolding fades):</p>" +
        "<ul class=\"steps\">" +
        "<li>$y' + 3y = 0,\\ y(0) = 5$. &rarr; $y = 5e^{-3t}$.</li>" +
        "<li>$y' + y = e^{-2t},\\ y(0) = 0$. &rarr; $Y = \\dfrac{1}{(s+1)(s+2)}$, so $y = e^{-t} - e^{-2t}$.</li>" +
        "<li>$y'' + 2y' + 5y = 0,\\ y(0) = 1,\\ y'(0) = 0$. Find the poles and classify. &rarr; $s = -1 \\pm 2i$: negative real part with an imaginary part means a damped oscillation (stable); $y = e^{-t}(\\cos 2t + \\tfrac{1}{2}\\sin 2t)$.</li>" +
        "</ul>"
    },
    {
      h: "Real-World Applications in CS & ML",
      body:
        "<p>You have done the mechanics — here is where this runs underneath tools you use. For each, I set the scene, then show the numbers. The recurring move: <i>compute a pole, read its real part, know the behavior.</i></p>" +
        "<p><b>1. Momentum &amp; training stability.</b> Momentum traces back to Polyak's 1964 \"heavy ball\" method and is baked into nearly every optimizer. Near a minimum with curvature $1$ it is a damped oscillator $\\ddot{x} + c\\dot{x} + x = 0$, with poles $s = \\tfrac{-c \\pm \\sqrt{c^2 - 4}}{2}$; the friction $c$ shrinks as momentum grows. $c = 0.5$: $s = -0.25 \\pm 0.97i$ &mdash; oscillates. $c = 2$ (critical): $s = -1$ &mdash; fastest, no overshoot. $c = 3$: $s = -0.38, -2.62$ &mdash; smooth but $2.6\\times$ slower.</p>" +
        "<p><b>2. EMA — Adam, BatchNorm, EMA teachers.</b> A running average that tracks a noisy quantity uses $m_t = \\beta m_{t-1} + (1-\\beta)x_t$, the discrete twin of $y = 1 - e^{-at}$. Memory $\\approx 1/(1-\\beta)$: $\\beta = 0.9 \\to \\sim 10$ steps, having caught $1 - 0.9^{10} = 65\\%$ of a shifted signal ($\\approx 1 - e^{-1}$); $\\beta = 0.99 \\to \\sim 100$; $\\beta = 0.999 \\to \\sim 1000$.</p>" +
        "<p><b>3. State-space models (S4/Mamba).</b> These process a sequence step by step, carrying a state updated by a linear rule; a mode discretizes to $x_t = r\\,x_{t-1} + \\cdots$ with $r = e^{\\text{pole}\\cdot\\Delta}$, memory $\\approx 1/(1-r)$. $r = 0.99 \\to 100$ steps; $r = 0.999 \\to 1000$; $r = 1.001 \\to$ unstable, growing $\\sim 0.1\\%$ per step.</p>" +
        "<p><b>4. Neural ODEs &amp; diffusion.</b> Both are defined by differential equations, so running them means discrete time steps capped by stability. Explicit Euler on $x' = \\lambda x$ is stable only if $|1 + h\\lambda| < 1$; a stiff mode $\\lambda = -10$ forces $h < 0.2$, and larger steps diverge.</p>" +
        "<p><b>5. Control &harr; RL.</b> Control theory tracks a target by feeding error back into the input, and RL inherits this through optimal control. A plant $1/(s+1)$ (pole $-1$, settling $\\sim 4$s) with gain $K$ moves the closed-loop pole to $-(1+K)$: $K = 9 \\to$ pole $-10 \\to$ settling $\\approx 0.4$s, a $10\\times$ speed-up.</p>" +
        "<p><b>6. Core CS — queues.</b> Queueing theory (Erlang, early 1900s) predicts waits. An M/M/1 server with $\\lambda = 8$/s, $\\mu = 10$/s has load $\\rho = 0.8$, mean jobs $L = \\rho/(1-\\rho) = 4$, and wait $W = L/\\lambda = 0.5$s. The exponential service time's transform $\\mu/(s+\\mu)$ has a pole at $-10$ — the same first-order math.</p>" +
        "<p>The thread through all six: compute a pole, read its real part, know the behavior. One idea, six uniforms.</p>"
    }
  ],
  takeaways: [
    "The Laplace transform turns differentiation into multiplication by $s$, converting a linear ODE into algebra.",
    "Definition $F(s) = \\int_0^\\infty e^{-st}f(t)\\,dt$; key property $\\mathcal{L}\\{f'\\} = sF(s) - f(0)$, which is where the initial condition enters.",
    "Worked example: $y' + 2y = 2,\\ y(0) = 0 \\Rightarrow y = 1 - e^{-2t}$ — a pole at $-2$, so it decays (stable).",
    "The poles (roots in $s$) are the system's natural modes; their real parts decide stability.",
    "The same idea powers momentum, EMA/Adam, state-space models, control/RL, and queueing."
  ]
};

const t1_functions = {
  id: "math-01-01",
  title: "Functions and their graphs",
  tagline: "A function is a reliable machine: put one input in, get exactly one output out.",
  sections: [
    { h: "Connections", body:
      "<p>This is the first idea in <b>Single-variable calculus</b>, and everything after it leans here.</p>" +
      "<ul class=\"steps\"><li><b>Builds on</b> — variables, numbers, and the coordinate plane.</li>" +
      "<li><b>Leads to</b> — function transformations, limits, and the derivative.</li>" +
      "<li><b>Used with</b> — every model in machine learning: a model <i>is</i> a function from inputs to a prediction.</li></ul>" },
    { h: "Motivation & Intuition", body:
      "<p>Think of a function as a dependable little machine. You feed it one input, and it hands back exactly one output — the same output every time for the same input. A vending machine that always returns a soda for button B3 is a function; one that sometimes returns a soda and sometimes a bag of chips is not.</p>" +
      "<p>That single rule — one input, one output — is the whole idea, and it is what lets us reason about change later on.</p>" },
    { h: "Definition & Assumptions", body:
      "<p>A <b>function</b> $f$ from a set $X$ (the <b>domain</b>) to a set $Y$ (the <b>codomain</b>) assigns to each $x \\in X$ exactly one value $f(x) \\in Y$. The set of outputs actually reached is the <b>range</b>. We write $f: X \\to Y$ and read $f(x)$ as \"$f$ of $x$\".</p>" +
      "<p><b>The one rule that must hold:</b> each input maps to a single output. On a graph this is the <i>vertical line test</i> — no vertical line may cross the curve twice. Assume too that inputs come from the domain (e.g. you cannot divide by zero or take $\\sqrt{-1}$ over the reals).</p>" },
    { h: "Worked Example & Practice", body:
      "<p>Take $f(x) = x^2$.</p><ul class=\"steps\">" +
      "<li>Evaluate: $f(3) = 9$, $f(-2) = 4$, $f(0) = 0$.</li>" +
      "<li>Domain: every real number works, so the domain is $\\mathbb{R}$.</li>" +
      "<li>Range: squares are never negative, so the range is $[0, \\infty)$.</li></ul>" +
      "<p><b>Practice.</b> For $f(x) = 1/(x-1)$: find $f(3)$ and the domain. &rarr; $f(3) = 1/2$; domain is all $x \\ne 1$.</p>" },
    { h: "Real-World Applications in CS & ML", body:
      "<p><b>A model is a function.</b> A linear model $f(x) = 2x + 1$ maps a feature to a prediction: $f(4) = 9$.</p>" +
      "<p><b>Activations are functions.</b> The ReLU $f(x) = \\max(0, x)$ is the most common one in deep nets: $f(-3) = 0$, $f(5) = 5$. Every layer of a network is just functions composed with functions.</p>" }
  ],
  takeaways: [
    "A function assigns to each input exactly one output; $f: X \\to Y$.",
    "Domain = allowed inputs, range = outputs reached; the vertical line test enforces one output per input.",
    "In ML a model is a function from features to predictions, e.g. ReLU $\\max(0,x)$."
  ]
};

const t1_transform = {
  id: "math-01-02",
  title: "Function transformations",
  tagline: "Shift, stretch, and flip a graph you already know — without re-deriving anything.",
  sections: [
    { h: "Connections", body:
      "<p>Within <b>Single-variable calculus</b>, transformations let you reuse a handful of base shapes everywhere.</p>" +
      "<ul class=\"steps\"><li><b>Builds on</b> — <i>Functions and their graphs</i>.</li>" +
      "<li><b>Leads to</b> — reading exponentials, logs, and trig as shifted/scaled base curves.</li>" +
      "<li><b>Used with</b> — feature standardization and the bias/scale terms inside every neural network layer.</li></ul>" },
    { h: "Motivation & Intuition", body:
      "<p>Once you know one graph, you get a whole family for free. Sliding a curve, stretching it, or flipping it does not change what kind of curve it is — only where it sits and how tall it stands. So instead of memorizing hundreds of graphs, you learn a few and move them around.</p>" },
    { h: "Definition & Assumptions", body:
      "<p>Starting from $y = f(x)$, the standard moves are:</p><table class=\"extable\"><thead><tr><th>expression</th><th>effect</th></tr></thead><tbody>" +
      "<tr><td class=\"row-h\">$f(x) + c$</td><td>shift up by $c$</td></tr>" +
      "<tr><td class=\"row-h\">$f(x - c)$</td><td>shift right by $c$</td></tr>" +
      "<tr><td class=\"row-h\">$a\\,f(x)$</td><td>vertical stretch by $a$</td></tr>" +
      "<tr><td class=\"row-h\">$f(-x)$</td><td>reflect across the $y$-axis</td></tr></tbody></table>" +
      "<p>Watch the counter-intuitive one: inside the function, $x - c$ moves the graph <i>right</i>, not left.</p>" },
    { h: "Worked Example & Practice", body:
      "<p>Transform $f(x) = x^2$ into $g(x) = (x-2)^2 + 1$, one move at a time.</p><ul class=\"steps\">" +
      "<li>$x^2 \\to (x-2)^2$: shift right by $2$.</li>" +
      "<li>$(x-2)^2 \\to (x-2)^2 + 1$: shift up by $1$.</li>" +
      "<li>The vertex moves from $(0,0)$ to $(2,1)$. Check: $g(2) = 1$. &#10003;</li></ul>" +
      "<p><b>Practice.</b> Where is the vertex of $-(x+3)^2$? &rarr; at $(-3, 0)$, opening downward.</p>" },
    { h: "Real-World Applications in CS & ML", body:
      "<p><b>Standardization</b> is a shift then a scale: $z = (x - \\mu)/\\sigma$. With $\\mu = 10$, $\\sigma = 2$, a value $x = 14$ becomes $z = 2$ — centered and rescaled so features share one scale.</p>" +
      "<p><b>Weights and biases</b> are exactly a scale and a shift: a neuron computes $a\\,x + b$ before its activation, sliding and stretching the input just like these graph moves.</p>" }
  ],
  takeaways: [
    "$+c$ shifts up, $f(x-c)$ shifts right, $a f(x)$ stretches, $f(-x)$ reflects.",
    "Inside-the-function shifts go the opposite way you expect ($x-c$ moves right).",
    "Standardization $z=(x-\\mu)/\\sigma$ and a neuron's $ax+b$ are shift-and-scale transforms."
  ]
};

const t1_exp = {
  id: "math-01-03",
  title: "Exponential functions",
  tagline: "Repeated multiplication: the growth that outruns every polynomial.",
  sections: [
    { h: "Connections", body:
      "<ul class=\"steps\"><li><b>Builds on</b> — functions and powers.</li>" +
      "<li><b>Leads to</b> — logarithms (its inverse), $e^x$ in calculus, and the derivative of exponentials.</li>" +
      "<li><b>Used with</b> — the softmax, learning-rate decay, and anything that grows or decays by a constant factor.</li></ul>" },
    { h: "Motivation & Intuition", body:
      "<p>Adding the same amount over and over gives a straight line. <i>Multiplying</i> by the same factor over and over gives an exponential — and it explodes. Fold a paper 42 times and it would reach the moon. That runaway behavior, and its mirror image (decay toward zero), is why exponentials are everywhere.</p>" },
    { h: "Definition & Assumptions", body:
      "<p>An <b>exponential function</b> is $f(x) = a^x$ with base $a > 0$. The special base $e \\approx 2.71828$ gives the natural exponential $e^x$. The defining property is that it turns sums into products:</p>" +
      "$$ e^{x + y} = e^x \\, e^y. $$" +
      "<p>Assume $a > 0$ so the output stays positive and real; note $a^0 = 1$ for any base.</p>" },
    { h: "Worked Example & Practice", body:
      "<p>Read off a few values of $2^x$ and $e^x$.</p><ul class=\"steps\">" +
      "<li>$2^{10} = 1024$ — ten doublings pass a thousand.</li>" +
      "<li>$e^0 = 1$, $e^1 \\approx 2.718$, $e^2 \\approx 7.389$.</li>" +
      "<li>Decay: $e^{-1} \\approx 0.368$, $e^{-2} \\approx 0.135$.</li></ul>" +
      "<p><b>Practice.</b> If a quantity doubles each step from $3$, what is it after $4$ steps? &rarr; $3 \\cdot 2^4 = 48$.</p>" },
    { h: "Real-World Applications in CS & ML", body:
      "<p><b>Softmax</b> turns scores into probabilities with exponentials. Logits $[2, 1, 0]$ give $e^2 = 7.39$, $e^1 = 2.72$, $e^0 = 1$, summing to $11.11$, so the probabilities are $[0.665, 0.245, 0.090]$.</p>" +
      "<p><b>Exponential learning-rate decay</b> multiplies the step size by a constant each epoch: $\\eta_t = \\eta_0\\, e^{-0.1 t}$ starting at $\\eta_0 = 0.1$ gives $0.090$ after one epoch, $0.037$ after ten.</p>" }
  ],
  takeaways: [
    "$f(x)=a^x$ is repeated multiplication; the natural base is $e \\approx 2.718$.",
    "Key property $e^{x+y}=e^x e^y$; $a^0 = 1$; negative exponents give decay.",
    "Exponentials power the softmax ($e^{\\text{logit}}$) and learning-rate decay."
  ]
};

const t1_log = {
  id: "math-01-04",
  title: "Logarithmic functions",
  tagline: "The inverse of exponentials — and the trick that turns products into sums.",
  sections: [
    { h: "Connections", body:
      "<ul class=\"steps\"><li><b>Builds on</b> — <i>Exponential functions</i> (the log undoes them).</li>" +
      "<li><b>Leads to</b> — logarithmic differentiation, and log-likelihood in statistics.</li>" +
      "<li><b>Used with</b> — cross-entropy loss, numerical stability, and log-scale hyperparameter search.</li></ul>" },
    { h: "Motivation & Intuition", body:
      "<p>A logarithm answers one question: \"to what power must I raise the base to get this number?\" It is the exponential run backwards. Its superpower is turning multiplication into addition — which is exactly what you want when a product of many small numbers would otherwise underflow to zero.</p>" },
    { h: "Definition & Assumptions", body:
      "<p>The <b>logarithm</b> base $b$ is defined by $\\log_b y = x \\iff b^x = y$. The natural log $\\ln = \\log_e$. Its defining identity:</p>" +
      "$$ \\log(xy) = \\log x + \\log y. $$" +
      "<p>Assume the input is positive: $\\log$ of zero or a negative number is undefined over the reals.</p>" },
    { h: "Worked Example & Practice", body:
      "<ul class=\"steps\">" +
      "<li>$\\log_2 1024 = 10$ (since $2^{10} = 1024$).</li>" +
      "<li>$\\ln e^3 = 3$ — the log undoes the exponential.</li>" +
      "<li>$\\log_{10} 0.001 = -3$.</li></ul>" +
      "<p><b>Practice.</b> Simplify $\\ln(e^2 \\cdot e^5)$. &rarr; $\\ln e^7 = 7$, or $2 + 5 = 7$ via the product rule.</p>" },
    { h: "Real-World Applications in CS & ML", body:
      "<p><b>Log-likelihood beats underflow.</b> Multiplying $100$ probabilities of $0.1$ each gives $10^{-100}$ — too small to store. Taking logs turns the product into a sum: $100 \\cdot \\ln(0.1) = 100 \\cdot (-2.303) = -230.3$, a perfectly ordinary number.</p>" +
      "<p><b>Cross-entropy</b> uses $-\\log p$ as the loss for the true class: a confident-correct $p = 0.9$ costs $0.105$, while a wrong $p = 0.1$ costs $2.303$ — big penalties for confident mistakes.</p>" }
  ],
  takeaways: [
    "$\\log_b y = x \\iff b^x = y$; the log is the exponential's inverse.",
    "$\\log(xy) = \\log x + \\log y$ turns products into sums (kills underflow).",
    "Log-likelihood and cross-entropy ($-\\log p$) are built on this."
  ]
};

const t1_trig = {
  id: "math-01-05",
  title: "Trigonometric functions",
  tagline: "The mathematics of anything that repeats: circles, waves, and oscillations.",
  sections: [
    { h: "Connections", body:
      "<ul class=\"steps\"><li><b>Builds on</b> — the unit circle and angles.</li>" +
      "<li><b>Leads to</b> — derivatives of trig functions, and Fourier analysis.</li>" +
      "<li><b>Used with</b> — positional encodings in Transformers, signal processing, and rotations.</li></ul>" },
    { h: "Motivation & Intuition", body:
      "<p>Wrap a number line around a circle and you get sine and cosine: they track your height and your sideways position as you walk around. Because a circle closes on itself, these functions repeat forever — which makes them the natural language for anything periodic, from sound waves to the position of a token in a sentence.</p>" },
    { h: "Definition & Assumptions", body:
      "<p>On the unit circle, $\\cos\\theta$ is the $x$-coordinate and $\\sin\\theta$ is the $y$-coordinate at angle $\\theta$. Both are <b>periodic</b> with period $2\\pi$: $\\sin(\\theta + 2\\pi) = \\sin\\theta$. The identity that ties them together:</p>" +
      "$$ \\sin^2\\theta + \\cos^2\\theta = 1. $$" +
      "<p>Angles are assumed in radians for calculus, where $\\pi$ radians $= 180^\\circ$.</p>" },
    { h: "Worked Example & Practice", body:
      "<ul class=\"steps\">" +
      "<li>$\\sin 0 = 0$, $\\sin(\\pi/2) = 1$, $\\sin\\pi = 0$.</li>" +
      "<li>$\\cos 0 = 1$, $\\cos\\pi = -1$.</li>" +
      "<li>Check the identity at $\\theta = \\pi/2$: $1^2 + 0^2 = 1$. &#10003;</li></ul>" +
      "<p><b>Practice.</b> What is $\\sin(2\\pi + \\pi/2)$? &rarr; $1$, by periodicity.</p>" },
    { h: "Real-World Applications in CS & ML", body:
      "<p><b>Positional encodings</b> in Transformers give each token position a vector of sines and cosines at different frequencies, $\\text{PE}(pos, 2i) = \\sin\\!\\big(pos / 10000^{2i/d}\\big)$, so the model can tell position 5 from position 50.</p>" +
      "<p><b>Signals and rotations.</b> Audio, vibration, and any oscillation decompose into sines (Fourier analysis), and a 2-D rotation by angle $\\theta$ is built from $\\cos\\theta$ and $\\sin\\theta$.</p>" }
  ],
  takeaways: [
    "$\\cos\\theta, \\sin\\theta$ are the $x, y$ coordinates on the unit circle; period $2\\pi$.",
    "Core identity $\\sin^2\\theta + \\cos^2\\theta = 1$; use radians in calculus.",
    "Sines/cosines drive positional encodings, Fourier analysis, and rotations."
  ]
};

const t1_invtrig = {
  id: "math-01-06",
  title: "Inverse trigonometric functions",
  tagline: "Going backwards from a ratio to the angle that produced it.",
  sections: [
    { h: "Connections", body:
      "<ul class=\"steps\"><li><b>Builds on</b> — <i>Trigonometric functions</i>.</li>" +
      "<li><b>Leads to</b> — their derivatives and integrals (they appear as antiderivatives).</li>" +
      "<li><b>Used with</b> — recovering angles from dot products, and smooth squashing functions.</li></ul>" },
    { h: "Motivation & Intuition", body:
      "<p>Sine takes an angle and gives a ratio; sometimes you have the ratio and want the angle back. That is the inverse. There is a catch: since sine repeats, infinitely many angles share the same value, so we restrict the domain to pick one canonical answer.</p>" },
    { h: "Definition & Assumptions", body:
      "<p>$\\arcsin$, $\\arccos$, and $\\arctan$ invert $\\sin$, $\\cos$, $\\tan$ on restricted ranges so each output is unique: $\\arcsin, \\arctan \\in [-\\tfrac{\\pi}{2}, \\tfrac{\\pi}{2}]$ and $\\arccos \\in [0, \\pi]$. So $\\arcsin(\\sin\\theta) = \\theta$ only when $\\theta$ lies in that range.</p>" },
    { h: "Worked Example & Practice", body:
      "<ul class=\"steps\">" +
      "<li>$\\arctan(1) = \\pi/4 \\approx 0.785$ (the angle whose tangent is $1$).</li>" +
      "<li>$\\arcsin(1) = \\pi/2$.</li>" +
      "<li>$\\arccos(0) = \\pi/2$.</li></ul>" +
      "<p><b>Practice.</b> What is $\\arctan(0)$? &rarr; $0$.</p>" },
    { h: "Real-World Applications in CS & ML", body:
      "<p><b>Angle from similarity.</b> The cosine similarity of two unit vectors is their dot product; the angle between them is $\\theta = \\arccos(\\text{sim})$. A similarity of $0.5$ means $\\theta = 60^\\circ$ apart in embedding space.</p>" +
      "<p><b>Orientation.</b> Robotics and graphics use $\\operatorname{atan2}(y, x)$ to turn a coordinate pair into a heading angle, e.g. $\\operatorname{atan2}(1, 1) = \\pi/4$.</p>" }
  ],
  takeaways: [
    "$\\arcsin, \\arccos, \\arctan$ recover an angle from a ratio, on restricted ranges.",
    "Restriction is needed because trig functions repeat, so inverses would be multivalued.",
    "Used to get angles from cosine similarity ($\\arccos$) and headings ($\\operatorname{atan2}$)."
  ]
};

const t1_limits = {
  id: "math-01-07",
  title: "Limits: definition and computation",
  tagline: "What value does a function head toward as the input closes in — even if it never arrives?",
  sections: [
    { h: "Connections", body:
      "<ul class=\"steps\">" +
      "<li><b>Builds on</b> — <i>Functions and their graphs</i>, and the everyday idea of \"getting closer\".</li>" +
      "<li><b>Leads to</b> — continuity, and then the derivative (which is itself a limit of slopes).</li>" +
      "<li><b>Used with</b> — convergence throughout ML: a training loss settling toward a value, a learning rate shrinking toward zero.</li></ul>" },
    { h: "Motivation & Intuition", body:
      "<p>Sometimes you cannot simply plug in. Look at $f(x) = \\dfrac{x^2 - 1}{x - 1}$ at $x = 1$: you get $\\tfrac{0}{0}$, which is undefined. And yet the graph clearly heads somewhere as $x$ slides toward $1$.</p>" +
      "<p>A <b>limit</b> answers exactly that question — not \"what is the value <i>at</i> the point?\" but \"what value is the function <i>heading toward</i> as we approach the point?\" The destination can be perfectly clear even when the road has a pothole right at the end. That shift in question is the doorway to all of calculus.</p>" },
    { h: "Definition & Assumptions", body:
      "<p>We write</p>" +
      "$$ \\lim_{x \\to a} f(x) = L $$" +
      "<p>to mean: $f(x)$ can be made as close to $L$ as we like by taking $x$ close enough to $a$ (from both sides), <i>without</i> ever setting $x = a$. The rigorous version is the $\\varepsilon$–$\\delta$ statement: for every tolerance $\\varepsilon > 0$ there is a closeness $\\delta > 0$ such that $0 < |x - a| < \\delta$ forces $|f(x) - L| < \\varepsilon$.</p>" +
      "<p><b>Assumptions that matter:</b> the value $f(a)$ is irrelevant — it may be undefined and the limit can still exist. But the two <i>one-sided</i> limits (approaching from the left and from the right) must agree, or the limit does not exist.</p>" },
    { h: "Worked Example & Practice", body:
      "<p class=\"lesson-meta\"><span class=\"difficulty\">●●○○○</span><span class=\"skills\">factoring · indeterminate forms · one-sided limits</span></p>" +
      "<p>Compute $\\displaystyle\\lim_{x \\to 1} \\frac{x^2 - 1}{x - 1}$.</p>" +
      "<p class=\"strategy\"><b>Strategy.</b> Direct substitution gives $\\tfrac{0}{0}$, an indeterminate form. Rewrite to cancel what causes the $0$, then substitute.</p>" +
      "<details class=\"hint\"><summary>Hint 1</summary><p>Plug in $x = 1$ first and name the problem you hit.</p></details>" +
      "<details class=\"hint\"><summary>Hint 2</summary><p>The numerator $x^2 - 1$ is a difference of squares — factor it.</p></details>" +
      "<details class=\"hint\"><summary>Hint 3</summary><p>Cancel the common $(x-1)$ — legal, since the limit never sets $x = 1$ — then substitute.</p></details>" +
      "<p>Now, one operation at a time:</p><ol class=\"steps\">" +
      "<li><b>Try direct substitution</b> &rarr; $\\tfrac{0}{0}$. <i>Indeterminate — substitution alone fails.</i></li>" +
      "<li><b>Factor the numerator</b> &rarr; $\\dfrac{(x-1)(x+1)}{x-1}$. <i>Difference of squares.</i></li>" +
      "<li><b>Cancel $(x-1)$</b> &rarr; $x + 1$ (for $x \\ne 1$). <i>The limit ignores the single point $x = 1$.</i></li>" +
      "<li><b>Substitute $x = 1$</b> &rarr; $2$. <i>The simplified form is continuous, so plugging in is safe.</i></li></ol>" +
      "<p><b>Verify.</b> $x = 0.99 \\to 1.99$ and $x = 1.01 \\to 2.01$ — closing on $2$ from both sides &#10003; (drag the slider below to feel it).</p>" +
      "<p><b>Answer:</b> $\\displaystyle\\lim_{x \\to 1}\\frac{x^2 - 1}{x - 1} = 2$.</p>" +
      "<p><b>Common mistakes.</b></p><ul class=\"steps\">" +
      "<li>❌ Declaring the limit \"does not exist\" because $f(1)$ is undefined — the value <i>at</i> the point is irrelevant.</li>" +
      "<li>❌ Forgetting the cancelled form $x + 1$ only equals $f$ for $x \\ne 1$.</li>" +
      "<li>❌ Checking one side only — the left and right limits must agree.</li></ul>" +
      "<p class=\"connects\"><b>Connects to:</b> continuity — the answer $2$ is exactly $f$'s continuous extension at $x = 1$, filling the hole in the graph.</p>" +
      "<p><b>Practice</b> (hints fade):</p><ul class=\"steps\">" +
      "<li>$\\displaystyle\\lim_{x \\to 2}\\frac{x^2 - 4}{x - 2}$. &rarr; factor to $x + 2$, limit $= 4$.</li>" +
      "<li>$\\displaystyle\\lim_{x \\to 0}\\frac{\\sin x}{x}$. &rarr; $1$ (at $x = 0.01$, ratio $= 0.99998$).</li>" +
      "<li>$\\displaystyle\\lim_{x \\to 3}\\frac{x^2 - 9}{x - 3}$. &rarr; $6$.</li></ul>" },
    { h: "Real-World Applications in CS & ML", body:
      "<p>Limits are the quiet machinery under a lot of computing. Six places, each with numbers.</p>" +
      "<p><b>1. The gradient is a limit.</b> Backprop rests on $f'(x) = \\lim_{h \\to 0}\\frac{f(x+h) - f(x)}{h}$. A \"gradient check\" evaluates that ratio at small finite $h$: for $f(x) = x^2$ at $x = 2$, $h = 0.001$ gives $\\frac{4.004001 - 4}{0.001} = 4.001 \\approx 4$.</p>" +
      "<p><b>2. Numerical differentiation.</b> The central difference $\\frac{f(x+h) - f(x-h)}{2h}$ converges faster: at $x = 2$, $h = 0.01$ gives $\\frac{4.0401 - 3.9601}{0.02} = 4.000$ exactly. But push $h$ too small and floating-point cancellation ruins it — the sweet spot is near $h \\approx 10^{-8}$ in double precision.</p>" +
      "<p><b>3. Training convergence.</b> \"SGD converges\" means the loss $L_t$ has a limit as $t \\to \\infty$; schedules like $\\eta_t = \\eta_0 / t$ send the learning rate's limit to $0$ so updates settle instead of bouncing.</p>" +
      "<p><b>4. Activation saturation.</b> The sigmoid $\\sigma(x) = 1/(1 + e^{-x})$ has limits $1$ and $0$ as $x \\to \\pm\\infty$. At $x = 6$, $\\sigma = 0.9975$ and its slope is only $0.0025$ — the vanishing-gradient problem is a saturating limit.</p>" +
      "<p><b>5. Algorithm analysis (Big-O).</b> Asymptotics are limits as $n \\to \\infty$: $\\lim_{n \\to \\infty}\\frac{3n^2 + 5n}{n^2} = 3$, so a $3n^2 + 5n$ step count is $\\Theta(n^2)$ — the linear term stops mattering.</p>" +
      "<p><b>6. Discounted returns in RL.</b> A reward stream discounted by $\\gamma$ sums to the limit $\\sum_{t=0}^{\\infty}\\gamma^t = \\frac{1}{1 - \\gamma}$; with $\\gamma = 0.99$ that is $100$ — the agent's effective planning horizon.</p>" +
      "<p>One idea — \"what value is this heading toward?\" — reused six ways.</p>" }
  ],
  takeaways: [
    "$\\lim_{x\\to a} f(x) = L$ asks where $f$ is heading near $a$, not its value at $a$.",
    "If direct substitution gives $\\tfrac{0}{0}$, rewrite (factor and cancel) then substitute.",
    "Left and right limits must agree for the limit to exist.",
    "The derivative/gradient is a limit; finite-difference gradient checks approximate it (e.g. $4.001 \\approx 4$)."
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
