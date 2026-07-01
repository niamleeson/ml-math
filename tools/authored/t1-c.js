"use strict";

module.exports = {
  "math-01-20": {
    id: "math-01-20",
    title: "Derivative of exponential functions",
    tagline: "Exponential growth keeps its own shape; the derivative only changes the scale.",
    connections: {
      buildsOn: ["Exponential functions", "Limits: definition and computation", "The chain rule"],
      leadsTo: ["Derivative of logarithmic functions", "growth models", "gradients through softmax"],
      usedWith: ["The chain rule", "Logarithmic functions", "Linear approximation"]
    },
    motivation:
      "<p>You already know that $e^x$ grows fast. The lovely surprise is that its slope grows in exactly the same way: wherever the graph is tall, it is also steep by the same amount.</p>" +
      "<p>That self-copying behavior is why exponentials are the natural language of compounding, decay, softmax probabilities, and continuous-time dynamics. Once you know the small rule, the chain rule lets you differentiate a whole family of growth curves.</p>",
    definition:
      "<p>The central rule is $$\\dfrac{d}{dx}e^x=e^x.$$ More generally, if $u=u(x)$ is differentiable, then $$\\dfrac{d}{dx}e^{u(x)}=e^{u(x)}u'(x),$$ by the chain rule. For another positive base $a$, write $a^x=e^{x\\ln a}$, so $$\\dfrac{d}{dx}a^x=a^x\\ln a.$$ This derivation is the reason $e$ is special: it is the base whose multiplier $\\ln e$ is $1$.</p>" +
      "<p><b>Assumptions that matter:</b> the base must satisfy $a>0$ for real-valued $a^x$ on all real $x$; the exponent $u(x)$ must be differentiable where you want the derivative; and the chain-rule factor $u'(x)$ is part of the derivative, not an optional decoration.</p>",
    worked: {
      problem: "Differentiate $f(x)=3e^{2x}-5e^{-x}+4^x$.",
      skills: ["exponential derivative", "chain rule", "constant multiple rule"],
      strategy: "Each term is an exponential. Keep the same exponential shape, then multiply by the exponent's derivative or by $\\ln a$.",
      steps: [
        { do: "Differentiate $3e^{2x}$", result: "$6e^{2x}$", why: "$\\dfrac{d}{dx}e^{2x}=2e^{2x}$" },
        { do: "Differentiate $-5e^{-x}$", result: "$5e^{-x}$", why: "the derivative of $-x$ is $-1$, so the two negatives multiply" },
        { do: "Differentiate $4^x$", result: "$4^x\\ln4$", why: "$\\dfrac{d}{dx}a^x=a^x\\ln a$" },
        { do: "Combine the term derivatives", result: "$f'(x)=6e^{2x}+5e^{-x}+4^x\\ln4$", why: "the derivative is linear over sums" }
      ],
      verify: "At $x=0$, the formula gives $6+5+\\ln4\\approx12.386$. A small finite difference with $h=0.001$ gives about $12.399$, close because the curve is smooth and $h$ is small.",
      answer: "$f'(x)=6e^{2x}+5e^{-x}+4^x\\ln4$",
      connects: "the exponential is its own slope shape; the exponent and the base only scale that shape."
    },
    practice: [
      { problem: "Differentiate $y=7e^x-2e^{-3x}$.", steps: [
        { do: "Differentiate $7e^x$", result: "$7e^x$", why: "$e^x$ is its own derivative" },
        { do: "Differentiate $e^{-3x}$", result: "$-3e^{-3x}$", why: "chain rule on the exponent $-3x$" },
        { do: "Multiply by $-2$", result: "$6e^{-3x}$", why: "constant multiples stay outside" },
        { do: "Add the derivatives", result: "$y'=7e^x+6e^{-3x}$", why: "differentiate term by term" }
      ], answer: "$y'=7e^x+6e^{-3x}$" },
      { problem: "Differentiate $y=e^{x^2+1}$.", steps: [
        { do: "Name the exponent", result: "$u=x^2+1$", why: "this sets up the chain rule" },
        { do: "Differentiate the exponent", result: "$u'=2x$", why: "power rule" },
        { do: "Apply the exponential chain rule", result: "$y'=e^{x^2+1}(2x)$", why: "$\\dfrac{d}{dx}e^u=e^u u'$" },
        { do: "Write neatly", result: "$y'=2xe^{x^2+1}$", why: "put the scalar factor first" }
      ], answer: "$2xe^{x^2+1}$" },
      { problem: "Differentiate $y=5^{3x-2}$.", steps: [
        { do: "Use the general base rule", result: "$\\dfrac{d}{dx}5^{3x-2}=5^{3x-2}\\ln5\\cdot\\dfrac{d}{dx}(3x-2)$", why: "$a^u=e^{u\\ln a}$" },
        { do: "Differentiate the exponent", result: "$3$", why: "the slope of $3x-2$ is $3$" },
        { do: "Multiply the factors", result: "$3\\ln5\\,5^{3x-2}$", why: "chain rule supplies the $3$" },
        { do: "Check the sign", result: "positive", why: "base $5$ and exponent slope $3$ both increase the function" }
      ], answer: "$3\\ln5\\,5^{3x-2}$" },
      { problem: "Find the slope of $g(t)=100e^{-0.2t}$ at $t=5$.", steps: [
        { do: "Differentiate the model", result: "$g'(t)=-20e^{-0.2t}$", why: "chain rule multiplies by $-0.2$" },
        { do: "Substitute $t=5$", result: "$g'(5)=-20e^{-1}$", why: "$-0.2\\cdot5=-1$" },
        { do: "Approximate $e^{-1}$", result: "$0.3679$", why: "standard exponential value" },
        { do: "Multiply", result: "$g'(5)\\approx-7.36$", why: "$-20\\cdot0.3679=-7.358$" }
      ], answer: "The slope is $-20e^{-1}\\approx-7.36$ units per time step." },
      { problem: "For softmax scores $z=[1,2]$, compute $\\dfrac{d}{dz_1}e^{z_1}$ at $z_1=1$ and use it in the denominator derivative of $S=e^{z_1}+e^{z_2}$.", steps: [
        { do: "Differentiate $e^{z_1}$ with respect to $z_1$", result: "$e^{z_1}$", why: "the exponential keeps its shape" },
        { do: "Evaluate at $z_1=1$", result: "$e\\approx2.718$", why: "substitute the score" },
        { do: "Differentiate $e^{z_2}$ with respect to $z_1$", result: "$0$", why: "$z_2$ is held constant" },
        { do: "Add the denominator derivatives", result: "$\\dfrac{dS}{dz_1}=e^{z_1}\\approx2.718$", why: "only the first score changes" }
      ], answer: "$\\dfrac{d}{dz_1}e^{z_1}=e\\approx2.718$ and $\\dfrac{dS}{dz_1}=e\\approx2.718$." }
    ],
    applications: [
      { title: "Softmax gradients", background: "Classification models turn scores into probabilities with exponentials; training needs the slope of each exponential score.", numbers: "For logits $[2,1]$, $e^2=7.389$, $e^1=2.718$, sum $10.107$, so the first probability is $0.731$ and the derivative of $e^{z_1}$ is $7.389$." },
      { title: "Continuous growth", background: "Population, interest, and viral spread models use $N(t)=N_0e^{rt}$ when the instantaneous rate is proportional to the current amount.", numbers: "$N_0=1000$, $r=0.03$ gives $N'(10)=0.03\\cdot1000e^{0.3}\\approx40.5$ people per year." },
      { title: "Exponential decay in regularization schedules", background: "A learning rate schedule may shrink by an exponential curve so early steps are large and later steps are gentle.", numbers: "$\\eta(t)=0.1e^{-0.05t}$ has $\\eta'(20)=-0.005e^{-1}\\approx-0.00184$ per epoch." },
      { title: "Neural ODE modes", background: "A linear mode $x'=\\lambda x$ has solution $x(t)=x_0e^{\\lambda t}$, so the derivative reveals whether the mode grows or decays.", numbers: "With $x_0=2$ and $\\lambda=-4$, $x'(0)=-8$ and $x(1)=2e^{-4}\\approx0.0366$." },
      { title: "Half-life models", background: "Radioactive decay and cached signal freshness often use an exponential curve with negative rate.", numbers: "For half-life $7$ days, $k=\\ln2/7\\approx0.099$, so $A'(14)=-0.099A_0e^{-1.386}\\approx-0.0248A_0$ per day." },
      { title: "Loss curvature intuition", background: "Exponential losses penalize wrong margins sharply, and the derivative shows how quickly pressure increases.", numbers: "For $L(m)=e^{-m}$, $L'(m)=-e^{-m}$; at margin $m=-2$, $L'= -e^2\\approx-7.389$, a strong push to improve the margin." }
    ],
    applicationsClose: "The same rule appears in every uniform: an exponential slope is the exponential again, scaled by the rate sitting in the exponent.",
    takeaways: [
      "$\\dfrac{d}{dx}e^x=e^x$ is the special self-copying derivative.",
      "$\\dfrac{d}{dx}e^{u(x)}=e^{u(x)}u'(x)$, so the chain-rule factor matters.",
      "$\\dfrac{d}{dx}a^x=a^x\\ln a$ for $a>0$; exponentials power growth, decay, and softmax gradients."
    ]
  },

  "math-01-21": {
    id: "math-01-21",
    title: "Derivative of logarithmic functions",
    tagline: "Logs grow slowly, and their slope is the reciprocal hiding inside them.",
    connections: {
      buildsOn: ["Logarithmic functions", "Derivative of exponential functions", "The chain rule"],
      leadsTo: ["Logarithmic differentiation", "L'Hôpital's rule", "log-likelihood gradients"],
      usedWith: ["Implicit differentiation", "Derivative of exponential functions", "The quotient rule"]
    },
    motivation:
      "<p>A logarithm asks how many powers you need. As the input gets bigger, one extra unit matters less and less, so the graph keeps rising but its slope fades.</p>" +
      "<p>The derivative makes that intuition precise: the slope of $\\ln x$ is $1/x$. That tiny formula is the backbone of log-likelihood, cross-entropy, entropy, and numerical stability tricks.</p>",
    definition:
      "<p>The basic rule is $$\\dfrac{d}{dx}\\ln x=\\dfrac1x,$$ for $x>0$. One clean derivation uses inverse functions: if $y=\\ln x$, then $x=e^y$. Differentiate both sides with respect to $x$: $1=e^y\\dfrac{dy}{dx}=x\\dfrac{dy}{dx}$, so $\\dfrac{dy}{dx}=1/x$. With a differentiable inside function $u(x)>0$, $$\\dfrac{d}{dx}\\ln(u(x))=\\dfrac{u'(x)}{u(x)}.$$ For base $a$, $$\\dfrac{d}{dx}\\log_a x=\\dfrac{1}{x\\ln a}.$$</p>" +
      "<p><b>Assumptions that matter:</b> the log input must be positive; the inside function must be differentiable; and for $\\ln|u|$ the rule $u'/u$ is valid where $u\\ne0$ because the absolute value protects the domain on each side of zero.</p>",
    worked: {
      problem: "Differentiate $f(x)=\\ln(x^2+1)-3\\log_2 x$.",
      skills: ["log derivative", "chain rule", "change of base"],
      strategy: "Natural logs give $u'/u$; other bases add the fixed scale $1/\\ln a$.",
      steps: [
        { do: "Differentiate $\\ln(x^2+1)$", result: "$\\dfrac{2x}{x^2+1}$", why: "the inside derivative is $2x$" },
        { do: "Rewrite the base-2 derivative rule", result: "$\\dfrac{d}{dx}\\log_2x=\\dfrac{1}{x\\ln2}$", why: "change of base" },
        { do: "Multiply by $-3$", result: "$-\\dfrac{3}{x\\ln2}$", why: "constant multiple rule" },
        { do: "Combine the pieces", result: "$f'(x)=\\dfrac{2x}{x^2+1}-\\dfrac{3}{x\\ln2}$", why: "differentiate the difference term by term" }
      ],
      verify: "The formula is defined for $x>0$, matching the $\\log_2x$ domain. At $x=1$, $f'(1)=1-3/\\ln2\\approx-3.328$, so the base-2 log term is pulling downward strongly.",
      answer: "$f'(x)=\\dfrac{2x}{x^2+1}-\\dfrac{3}{x\\ln2}$",
      connects: "the derivative reads a log as relative change: inside slope divided by inside size."
    },
    practice: [
      { problem: "Differentiate $y=\\ln(5x)$.", steps: [
        { do: "Name the inside", result: "$u=5x$", why: "logs use $u'/u$" },
        { do: "Differentiate the inside", result: "$u'=5$", why: "constant multiple rule" },
        { do: "Apply the log rule", result: "$y'=\\dfrac{5}{5x}$", why: "$\\dfrac{d}{dx}\\ln u=u'/u$" },
        { do: "Simplify", result: "$y'=\\dfrac1x$", why: "the constant inside the log only shifts the graph" }
      ], answer: "$y'=1/x$" },
      { problem: "Differentiate $y=\\ln(x^3-4x)$.", steps: [
        { do: "Name the inside", result: "$u=x^3-4x$", why: "prepare for $u'/u$" },
        { do: "Differentiate the inside", result: "$u'=3x^2-4$", why: "power rule" },
        { do: "Apply the log derivative", result: "$y'=\\dfrac{3x^2-4}{x^3-4x}$", why: "inside slope over inside value" },
        { do: "State the domain condition", result: "$x^3-4x>0$", why: "the original natural log needs a positive input" }
      ], answer: "$y'=\\dfrac{3x^2-4}{x^3-4x}$ where $x^3-4x>0$." },
      { problem: "Differentiate $y=\\log_{10}(x^2+9)$.", steps: [
        { do: "Use the base-10 rule", result: "$y'=\\dfrac{1}{\\ln10}\\cdot\\dfrac{d}{dx}\\ln(x^2+9)$", why: "change of base" },
        { do: "Differentiate the inside", result: "$2x$", why: "power rule" },
        { do: "Apply $u'/u$", result: "$\\dfrac{1}{\\ln10}\\cdot\\dfrac{2x}{x^2+9}$", why: "natural log derivative" },
        { do: "Combine factors", result: "$\\dfrac{2x}{(x^2+9)\\ln10}$", why: "write as one fraction" }
      ], answer: "$\\dfrac{2x}{(x^2+9)\\ln10}$" },
      { problem: "Find the slope of $L(p)=-\\ln p$ at $p=0.25$.", steps: [
        { do: "Differentiate the loss", result: "$L'(p)=-\\dfrac1p$", why: "negative log rule" },
        { do: "Substitute $p=0.25$", result: "$L'(0.25)=-\\dfrac{1}{0.25}$", why: "evaluate at the given probability" },
        { do: "Divide", result: "$-4$", why: "$1/0.25=4$" },
        { do: "Interpret the sign", result: "increasing $p$ lowers the loss", why: "the slope is negative" }
      ], answer: "$L'(0.25)=-4$." },
      { problem: "For $J(w)=\\ln(1+e^w)$, compute $J'(w)$.", steps: [
        { do: "Name the inside", result: "$u=1+e^w$", why: "the outside function is a log" },
        { do: "Differentiate the inside", result: "$u'=e^w$", why: "the derivative of $e^w$ is itself" },
        { do: "Apply $u'/u$", result: "$J'(w)=\\dfrac{e^w}{1+e^w}$", why: "log derivative" },
        { do: "Rewrite if desired", result: "$J'(w)=\\dfrac{1}{1+e^{-w}}$", why: "divide top and bottom by $e^w$" }
      ], answer: "$J'(w)=\\dfrac{e^w}{1+e^w}=\\dfrac{1}{1+e^{-w}}$, the sigmoid." }
    ],
    applications: [
      { title: "Cross-entropy", background: "For a true class probability $p$, cross-entropy uses $-\\ln p$ so confident correct predictions are cheap and bad predictions are expensive.", numbers: "At $p=0.9$, loss $0.105$ and slope $-1.111$; at $p=0.1$, loss $2.303$ and slope $-10$." },
      { title: "Maximum likelihood", background: "Products of probabilities become sums of logs, and optimization follows the derivative of the log-likelihood.", numbers: "For Bernoulli success rate $p$ with $7$ successes in $10$ trials, $\\ell(p)=7\\ln p+3\\ln(1-p)$ and $\\ell'(p)=7/p-3/(1-p)$, which is zero at $p=0.7$." },
      { title: "Log-sum-exp", background: "Numerically stable probability code uses logs to avoid overflow while preserving derivatives.", numbers: "For $x=[1000,999]$, $\\ln(e^{1000}+e^{999})=1000+\\ln(1+e^{-1})\\approx1000.313$ instead of overflowing." },
      { title: "Information gain", background: "Entropy measures surprise with logarithms; derivatives show how entropy changes as probabilities move.", numbers: "For binary $H(p)=-p\\ln p-(1-p)\\ln(1-p)$, $H'(0.8)=\\ln(0.2/0.8)=\\ln0.25\\approx-1.386$." },
      { title: "Feature scaling on log axes", background: "Heavy-tailed counts are often transformed with $\\ln(1+x)$ so large changes are compressed.", numbers: "The derivative is $1/(1+x)$; at $x=9$ the slope is $0.1$, while at $x=99$ it is $0.01$." },
      { title: "Power-law estimation", background: "Log transforms turn $y=Cx^a$ into a line, and log derivatives identify the exponent as relative growth.", numbers: "If $y=x^{1.5}$, then $\\ln y=1.5\\ln x$ and $d\\ln y/d\\ln x=1.5$." }
    ],
    applicationsClose: "A log derivative keeps asking one gentle question: how large is the change compared with the current size?",
    takeaways: [
      "$\\dfrac{d}{dx}\\ln x=1/x$ for $x>0$.",
      "$\\dfrac{d}{dx}\\ln u=u'/u$; it measures relative change.",
      "Base-$a$ logs add the scale $1/\\ln a$, and log derivatives drive likelihood and cross-entropy."
    ]
  },

  "math-01-22": {
    id: "math-01-22",
    title: "Derivatives of trigonometric functions",
    tagline: "Sine and cosine trade places as slopes, turning waves into calculus you can read.",
    connections: {
      buildsOn: ["Trigonometric functions", "Limits: definition and computation", "The chain rule"],
      leadsTo: ["Implicit differentiation", "oscillation models", "Fourier analysis"],
      usedWith: ["The chain rule", "Linear approximation", "Differential equations"]
    },
    motivation:
      "<p>Sine and cosine are the curves of repeating motion. If position follows a sine wave, its slope is not random; it is another wave, shifted in phase.</p>" +
      "<p>This is why trig derivatives feel like a small table but act like a powerful language. They let you compute velocities, optimize periodic signals, and backpropagate through rotations and positional encodings.</p>",
    definition:
      "<p>The core rules are $$\\dfrac{d}{dx}\\sin x=\\cos x,\\qquad \\dfrac{d}{dx}\\cos x=-\\sin x.$$ From these and the quotient rule, $$\\dfrac{d}{dx}\\tan x=\\sec^2x.$$ With an inside function $u(x)$, the chain rule gives $\\dfrac{d}{dx}\\sin u=\\cos(u)u'$, $\\dfrac{d}{dx}\\cos u=-\\sin(u)u'$, and $\\dfrac{d}{dx}\\tan u=\\sec^2(u)u'$. The limit behind the first rule is $\\lim_{h\\to0}\\sin h/h=1$ when angles are in radians.</p>" +
      "<p><b>Assumptions that matter:</b> angles must be measured in radians for these derivative constants to be exactly right; tangent is differentiable only where $\\cos x\\ne0$; and every scaled or shifted angle needs the chain-rule multiplier.</p>",
    worked: {
      problem: "Differentiate $f(x)=2\\sin(3x)-4\\cos x+\\tan(x^2)$.",
      skills: ["trig derivative table", "chain rule", "sum rule"],
      strategy: "Use the table one term at a time, and pay attention to the angle inside each trig function.",
      steps: [
        { do: "Differentiate $2\\sin(3x)$", result: "$6\\cos(3x)$", why: "the inside derivative is $3$" },
        { do: "Differentiate $-4\\cos x$", result: "$4\\sin x$", why: "the derivative of cosine is negative sine" },
        { do: "Differentiate $\\tan(x^2)$", result: "$2x\\sec^2(x^2)$", why: "chain rule with inside derivative $2x$" },
        { do: "Combine the terms", result: "$f'(x)=6\\cos(3x)+4\\sin x+2x\\sec^2(x^2)$", why: "the derivative of a sum is the sum of derivatives" }
      ],
      verify: "At $x=0$, the formula gives $6+0+0=6$. Near zero, $2\\sin(3x)\\approx6x$, while the cosine and tangent terms have zero first-order slope, so the check agrees.",
      answer: "$f'(x)=6\\cos(3x)+4\\sin x+2x\\sec^2(x^2)$",
      connects: "trig derivatives turn one wave into a shifted wave, with the chain rule setting the frequency scale."
    },
    practice: [
      { problem: "Differentiate $y=\\sin x+\\cos x$.", steps: [
        { do: "Differentiate $\\sin x$", result: "$\\cos x$", why: "basic sine rule" },
        { do: "Differentiate $\\cos x$", result: "$-\\sin x$", why: "basic cosine rule" },
        { do: "Add the derivatives", result: "$y'=\\cos x-\\sin x$", why: "sum rule" },
        { do: "Check at $x=0$", result: "$y'(0)=1$", why: "the graph starts increasing from $1$" }
      ], answer: "$y'=\\cos x-\\sin x$" },
      { problem: "Differentiate $y=\\sin(5x)$.", steps: [
        { do: "Name the inside", result: "$u=5x$", why: "the angle is not just $x$" },
        { do: "Differentiate the inside", result: "$u'=5$", why: "constant multiple rule" },
        { do: "Apply the sine chain rule", result: "$y'=\\cos(5x)\\cdot5$", why: "$\\dfrac{d}{dx}\\sin u=\\cos(u)u'$" },
        { do: "Write neatly", result: "$y'=5\\cos(5x)$", why: "put the frequency multiplier first" }
      ], answer: "$5\\cos(5x)$" },
      { problem: "Differentiate $y=x^2\\cos x$.", steps: [
        { do: "Choose the product rule", result: "$y'=(x^2)'\\cos x+x^2(\\cos x)'$", why: "two factors depend on $x$" },
        { do: "Differentiate $x^2$", result: "$2x$", why: "power rule" },
        { do: "Differentiate $\\cos x$", result: "$-\\sin x$", why: "trig derivative table" },
        { do: "Substitute into the product rule", result: "$y'=2x\\cos x-x^2\\sin x$", why: "combine the two product pieces" }
      ], answer: "$2x\\cos x-x^2\\sin x$" },
      { problem: "Find the slope of $s(t)=3\\cos(2t)$ at $t=\\pi/4$.", steps: [
        { do: "Differentiate the position", result: "$s'(t)=-6\\sin(2t)$", why: "cosine derivative plus chain rule" },
        { do: "Substitute $t=\\pi/4$", result: "$s'(\\pi/4)=-6\\sin(\\pi/2)$", why: "$2\\cdot\\pi/4=\\pi/2$" },
        { do: "Evaluate the sine", result: "$\\sin(\\pi/2)=1$", why: "unit circle value" },
        { do: "Multiply", result: "$-6$", why: "the object is moving downward fastest there" }
      ], answer: "The slope is $-6$." },
      { problem: "For a positional encoding component $p(x)=\\sin(x/100)$, compute $p'(50)$.", steps: [
        { do: "Differentiate the inside", result: "$\\dfrac{d}{dx}(x/100)=1/100$", why: "constant scale" },
        { do: "Apply the sine chain rule", result: "$p'(x)=\\dfrac{1}{100}\\cos(x/100)$", why: "frequency controls slope size" },
        { do: "Substitute $x=50$", result: "$p'(50)=0.01\\cos(0.5)$", why: "$50/100=0.5$" },
        { do: "Approximate", result: "$p'(50)\\approx0.00878$", why: "$\\cos(0.5)\\approx0.8776$" }
      ], answer: "$p'(50)=0.01\\cos(0.5)\\approx0.00878$." }
    ],
    applications: [
      { title: "Velocity from periodic position", background: "Physics and animation often store position as a sine or cosine wave; the derivative gives velocity.", numbers: "If $s(t)=4\\sin(3t)$, then $v(t)=12\\cos(3t)$, so the maximum speed is $12$." },
      { title: "Fourier features", background: "Fourier feature maps feed sine and cosine waves into models so high-frequency patterns become learnable.", numbers: "For $\\phi(x)=\\sin(20x)$, $\\phi'(x)=20\\cos(20x)$; the frequency $20$ makes gradients twenty times larger than $\\sin x$." },
      { title: "Transformer positional encodings", background: "Sinusoidal encodings let attention compare positions through phase differences.", numbers: "A component $\\sin(pos/10000^{2i/d})$ has derivative $\\cos(pos/c)/c$; if $c=1000$, the slope magnitude is at most $0.001$." },
      { title: "Rotations in graphics", background: "A 2-D rotation matrix uses sine and cosine, and gradients with respect to the angle support fitting and calibration.", numbers: "For $x'=x\\cos\\theta-y\\sin\\theta$, $dx'/d\\theta=-x\\sin\\theta-y\\cos\\theta$; with $(x,y)=(2,1)$ and $\\theta=0$, this is $-1$." },
      { title: "Signal phase alignment", background: "To align two waves, optimization follows derivatives of trigonometric phase errors.", numbers: "For error $E(\\phi)=(\\sin\\phi-0.5)^2$, $E'(\\phi)=2(\\sin\\phi-0.5)\\cos\\phi$; at $\\phi=0$, $E'=-1$." },
      { title: "Oscillating learning schedules", background: "Cosine decay schedules use smooth periodic pieces to reduce learning rates without sharp corners.", numbers: "$\\eta(t)=0.1(1+\\cos(\\pi t/100))/2$ has $\\eta'(50)=-0.05(\\pi/100)\\sin(\\pi/2)\\approx-0.00157$." }
    ],
    applicationsClose: "Sine and cosine keep passing the slope back and forth; the frequency tells you how fast that handoff happens.",
    takeaways: [
      "$\\dfrac{d}{dx}\\sin x=\\cos x$ and $\\dfrac{d}{dx}\\cos x=-\\sin x$ in radians.",
      "$\\dfrac{d}{dx}\\tan x=\\sec^2x$ where $\\cos x\\ne0$.",
      "For $\\sin u$, $\\cos u$, and $\\tan u$, multiply by $u'$ through the chain rule."
    ]
  },

  "math-01-23": {
    id: "math-01-23",
    title: "Implicit differentiation",
    tagline: "When $y$ will not stand alone, differentiate the relationship it already satisfies.",
    connections: {
      buildsOn: ["Derivatives of trigonometric functions", "The chain rule", "The product rule"],
      leadsTo: ["Logarithmic differentiation", "Related rates", "gradients of constrained equations"],
      usedWith: ["The chain rule", "Inverse trigonometric functions", "Related rates"]
    },
    motivation:
      "<p>Not every curve is kind enough to be written as $y=f(x)$. A circle, for example, is naturally $x^2+y^2=25$, and solving for $y$ splits it into two halves.</p>" +
      "<p>Implicit differentiation says: keep the relationship whole. Treat $y$ as a function of $x$, differentiate both sides, and every time you differentiate a $y$ expression, attach $dy/dx$ by the chain rule.</p>",
    definition:
      "<p>An equation $F(x,y)=0$ defines $y$ <b>implicitly</b> as a function of $x$ near points where the curve passes the vertical-line test locally. Differentiate both sides with respect to $x$ while remembering that $y=y(x)$. For example, $$\\dfrac{d}{dx}(y^2)=2y\\dfrac{dy}{dx}.$$ After differentiating, solve algebraically for $dy/dx$.</p>" +
      "<p><b>Assumptions that matter:</b> $y$ must be differentiable as a local function of $x$; if the coefficient of $dy/dx$ becomes zero, the tangent may be vertical or the local function description may fail; and every occurrence of $y$ needs the chain-rule factor.</p>",
    worked: {
      problem: "Find $dy/dx$ for $x^2+xy+y^2=7$.",
      skills: ["implicit differentiation", "product rule", "solving for a derivative"],
      strategy: "Differentiate the relationship as written. The mixed term $xy$ needs the product rule, and every derivative of $y$ brings a $dy/dx$.",
      steps: [
        { do: "Differentiate $x^2$", result: "$2x$", why: "power rule" },
        { do: "Differentiate $xy$", result: "$x\\dfrac{dy}{dx}+y$", why: "product rule with $y=y(x)$" },
        { do: "Differentiate $y^2$", result: "$2y\\dfrac{dy}{dx}$", why: "chain rule" },
        { do: "Differentiate the constant", result: "$0$", why: "the derivative of $7$ is zero" },
        { do: "Collect derivative terms", result: "$(x+2y)\\dfrac{dy}{dx}+2x+y=0$", why: "group the terms containing $dy/dx$" },
        { do: "Solve for $dy/dx$", result: "$\\dfrac{dy}{dx}=-\\dfrac{2x+y}{x+2y}$", why: "move the non-derivative terms and divide" }
      ],
      verify: "At $(1,2)$, the original equation gives $1+2+4=7$, and the slope is $-(2+2)/(1+4)=-4/5$. A tangent with negative slope fits the upper-right part of the oval.",
      answer: "$\\dfrac{dy}{dx}=-\\dfrac{2x+y}{x+2y}$",
      connects: "implicit differentiation turns a constraint into a slope formula without splitting the curve into branches."
    },
    practice: [
      { problem: "For $x^2+y^2=25$, find $dy/dx$.", steps: [
        { do: "Differentiate $x^2$", result: "$2x$", why: "power rule" },
        { do: "Differentiate $y^2$", result: "$2y\\dfrac{dy}{dx}$", why: "chain rule because $y$ depends on $x$" },
        { do: "Differentiate $25$", result: "$0$", why: "constant" },
        { do: "Solve $2x+2y\\dfrac{dy}{dx}=0$", result: "$\\dfrac{dy}{dx}=-\\dfrac{x}{y}$", why: "isolate the derivative" }
      ], answer: "$dy/dx=-x/y$" },
      { problem: "For $y^3+x=10$, find $dy/dx$.", steps: [
        { do: "Differentiate $y^3$", result: "$3y^2\\dfrac{dy}{dx}$", why: "chain rule" },
        { do: "Differentiate $x$", result: "$1$", why: "basic derivative" },
        { do: "Differentiate $10$", result: "$0$", why: "constant" },
        { do: "Solve $3y^2\\dfrac{dy}{dx}+1=0$", result: "$\\dfrac{dy}{dx}=-\\dfrac{1}{3y^2}$", why: "move $1$ and divide" }
      ], answer: "$dy/dx=-1/(3y^2)$" },
      { problem: "For $\\sin y+x^2=1$, find $dy/dx$.", steps: [
        { do: "Differentiate $\\sin y$", result: "$\\cos y\\dfrac{dy}{dx}$", why: "chain rule" },
        { do: "Differentiate $x^2$", result: "$2x$", why: "power rule" },
        { do: "Differentiate $1$", result: "$0$", why: "constant" },
        { do: "Solve $\\cos y\\dfrac{dy}{dx}+2x=0$", result: "$\\dfrac{dy}{dx}=-\\dfrac{2x}{\\cos y}$", why: "divide by $\\cos y$ where it is nonzero" }
      ], answer: "$dy/dx=-2x/\\cos y$" },
      { problem: "Find the slope of $x^2+xy+y^2=3$ at $(1,1)$.", steps: [
        { do: "Use the known derivative formula", result: "$\\dfrac{dy}{dx}=-\\dfrac{2x+y}{x+2y}$", why: "same pattern as the worked example" },
        { do: "Substitute $x=1$", result: "$-\\dfrac{2+y}{1+2y}$", why: "evaluate at the point" },
        { do: "Substitute $y=1$", result: "$-\\dfrac{3}{3}$", why: "finish the point substitution" },
        { do: "Simplify", result: "$-1$", why: "the numerator and denominator match" }
      ], answer: "The slope at $(1,1)$ is $-1$." },
      { problem: "For the level set $w^2+b^2=1$ in a two-parameter model, find $db/dw$.", steps: [
        { do: "Treat $b$ as a function of $w$", result: "$b=b(w)$", why: "the constraint ties the parameters together" },
        { do: "Differentiate $w^2$", result: "$2w$", why: "power rule" },
        { do: "Differentiate $b^2$", result: "$2b\\dfrac{db}{dw}$", why: "chain rule" },
        { do: "Solve $2w+2b\\dfrac{db}{dw}=0$", result: "$\\dfrac{db}{dw}=-\\dfrac{w}{b}$", why: "isolate the allowable tradeoff" }
      ], answer: "$db/dw=-w/b$ along the constraint." }
    ],
    applications: [
      { title: "Constrained optimization", background: "Many ML problems optimize while staying on a constraint surface, such as fixed norm or probability sum.", numbers: "On $w_1^2+w_2^2=1$, the implicit slope is $dw_2/dw_1=-w_1/w_2$; at $(0.6,0.8)$ it is $-0.75$." },
      { title: "Decision boundaries", background: "A classifier boundary can be stored as $F(x,y)=0$ even when it is not easy to solve for $y$.", numbers: "If $F=x^2+y^2-4=0$, then $dy/dx=-x/y$; at $(1,\\sqrt3)$ the boundary slope is $-1/\\sqrt3\\approx-0.577$." },
      { title: "Implicit layers", background: "Deep equilibrium models define hidden states by fixed-point equations instead of explicit layer stacks.", numbers: "For $z=\\tanh(az+x)$, implicit differentiation gives $dz/dx=(1-\\tanh^2(az+x))/(1-a(1-\\tanh^2(az+x)))$. If $a=0.5$ and $z=0$, this is $1/(1-0.5)=2$." },
      { title: "Calibration curves", background: "A fitted contour of equal risk may be represented implicitly by two features.", numbers: "For $x^2+4y^2=8$, $dy/dx=-x/(4y)$; at $(2,1)$ the slope is $-0.5$." },
      { title: "Robotics constraints", background: "A robot arm endpoint often obeys geometric constraints; slopes describe how one joint must move as another changes.", numbers: "For $x^2+y^2=0.25$, at $(0.3,0.4)$ the slope is $-0.75$, so a $0.01$ increase in $x$ needs about $0.0075$ decrease in $y$." },
      { title: "Iso-loss contours", background: "Near a minimum, equal-loss curves of a quadratic model are ellipses, and implicit slopes show local tradeoffs.", numbers: "For $L=w^2+9b^2=1$, $db/dw=-w/(9b)$; at $(0.6,0.2)$ the slope is $-0.333$." }
    ],
    applicationsClose: "Implicit differentiation keeps the relationship intact, then reads the local tradeoff from the differentiated constraint.",
    takeaways: [
      "Treat $y$ as $y(x)$ and differentiate both sides of the equation.",
      "Every derivative of a $y$ expression gets a $dy/dx$ factor from the chain rule.",
      "Solve the differentiated equation for $dy/dx$, while watching for vertical tangents or zero coefficients."
    ]
  },

  "math-01-24": {
    id: "math-01-24",
    title: "Logarithmic differentiation",
    tagline: "Take logs first when powers, products, and quotients are tangled together.",
    connections: {
      buildsOn: ["Implicit differentiation", "Derivative of logarithmic functions", "The product rule"],
      leadsTo: ["Related rates", "elasticity", "gradients of products"],
      usedWith: ["Derivative of logarithmic functions", "The chain rule", "Implicit differentiation"]
    },
    motivation:
      "<p>Some derivatives look unpleasant because the function is built from many multiplying pieces, or because the variable appears in both the base and the exponent. If you attack directly, the algebra can sprawl.</p>" +
      "<p>Logarithmic differentiation is a calm detour: take $\\ln$ of both sides, use log rules to unpack the expression, differentiate implicitly, then multiply back by the original function.</p>",
    definition:
      "<p>For a positive differentiable function $y=f(x)$, take logs: $\\ln y=\\ln f(x)$. Differentiate implicitly to get $$\\dfrac{y'}{y}=\\dfrac{d}{dx}\\ln f(x),$$ so $$y'=f(x)\\dfrac{d}{dx}\\ln f(x).$$ The method is especially useful for products, quotients, powers, and expressions like $x^x$.</p>" +
      "<p><b>Assumptions that matter:</b> the function should be positive on the interval where you take $\\ln y$; if signs vary, use $\\ln|y|$ where $y\\ne0$; and after differentiating the log equation, remember to multiply by $y$ or by the original $f(x)$.</p>",
    worked: {
      problem: "Differentiate $y=x^x$ for $x>0$.",
      skills: ["logarithmic differentiation", "implicit differentiation", "log derivative"],
      strategy: "The variable is both base and exponent. Take logs so the exponent comes down where ordinary derivative rules can reach it.",
      steps: [
        { do: "Take natural logs", result: "$\\ln y=x\\ln x$", why: "log rules bring the exponent down" },
        { do: "Differentiate the left side", result: "$\\dfrac{y'}{y}$", why: "implicit derivative of $\\ln y$" },
        { do: "Differentiate $x\\ln x$", result: "$\\ln x+1$", why: "product rule" },
        { do: "Set the derivatives equal", result: "$\\dfrac{y'}{y}=\\ln x+1$", why: "both sides came from the same equation" },
        { do: "Multiply by $y$", result: "$y'=y(\\ln x+1)$", why: "isolate $y'$" },
        { do: "Substitute $y=x^x$", result: "$y'=x^x(\\ln x+1)$", why: "return to the original variable" }
      ],
      verify: "At $x=1$, the formula gives $1^1(0+1)=1$. Near $x=1$, $x^x$ rises with slope about $1$, which matches the local behavior.",
      answer: "$\\dfrac{d}{dx}x^x=x^x(\\ln x+1)$",
      connects: "logs turn exponent complexity into multiplication and addition, then implicit differentiation finishes the job."
    },
    practice: [
      { problem: "Differentiate $y=(x^2+1)^5$ using logarithmic differentiation.", steps: [
        { do: "Take logs", result: "$\\ln y=5\\ln(x^2+1)$", why: "bring down the power" },
        { do: "Differentiate the left side", result: "$y'/y$", why: "implicit log derivative" },
        { do: "Differentiate the right side", result: "$5\\cdot\\dfrac{2x}{x^2+1}$", why: "chain rule inside the log" },
        { do: "Multiply by $y$", result: "$y'=y\\dfrac{10x}{x^2+1}$", why: "isolate the derivative" },
        { do: "Substitute $y$", result: "$y'=10x(x^2+1)^4$", why: "one factor cancels with the denominator" }
      ], answer: "$10x(x^2+1)^4$" },
      { problem: "Differentiate $y=x^3\\sqrt{x+1}$ for $x>0$.", steps: [
        { do: "Take logs", result: "$\\ln y=3\\ln x+\\tfrac12\\ln(x+1)$", why: "product becomes sum and square root becomes power $1/2$" },
        { do: "Differentiate", result: "$\\dfrac{y'}{y}=\\dfrac3x+\\dfrac{1}{2(x+1)}$", why: "log derivative of each term" },
        { do: "Multiply by $y$", result: "$y'=x^3\\sqrt{x+1}\\left(\\dfrac3x+\\dfrac{1}{2(x+1)}\\right)$", why: "return from relative change to ordinary change" },
        { do: "Leave factored", result: "$y'=x^3\\sqrt{x+1}\\left(\\dfrac3x+\\dfrac{1}{2(x+1)}\\right)$", why: "the factored form is readable and correct" }
      ], answer: "$x^3\\sqrt{x+1}\\left(\\dfrac3x+\\dfrac{1}{2(x+1)}\\right)$" },
      { problem: "Differentiate $y=\\dfrac{(x+2)^4}{(x^2+1)^3}$ where it is positive.", steps: [
        { do: "Take logs", result: "$\\ln y=4\\ln(x+2)-3\\ln(x^2+1)$", why: "quotient becomes subtraction" },
        { do: "Differentiate", result: "$\\dfrac{y'}{y}=\\dfrac{4}{x+2}-\\dfrac{6x}{x^2+1}$", why: "log derivative term by term" },
        { do: "Multiply by $y$", result: "$y'=\\dfrac{(x+2)^4}{(x^2+1)^3}\\left(\\dfrac{4}{x+2}-\\dfrac{6x}{x^2+1}\\right)$", why: "isolate $y'$" },
        { do: "State the interval condition", result: "$x>-2$ for the displayed positive form", why: "the fourth power is nonnegative and the log step used positivity" }
      ], answer: "$\\dfrac{(x+2)^4}{(x^2+1)^3}\\left(\\dfrac{4}{x+2}-\\dfrac{6x}{x^2+1}\\right)$" },
      { problem: "Differentiate $y=(\\sin x)^x$ for $\\sin x>0$.", steps: [
        { do: "Take logs", result: "$\\ln y=x\\ln(\\sin x)$", why: "the exponent contains $x$" },
        { do: "Differentiate the right side", result: "$\\ln(\\sin x)+x\\dfrac{\\cos x}{\\sin x}$", why: "product rule and log chain rule" },
        { do: "Write the trig ratio", result: "$\\ln(\\sin x)+x\\cot x$", why: "$\\cos x/\\sin x=\\cot x$" },
        { do: "Multiply by $y$", result: "$y'=(\\sin x)^x(\\ln(\\sin x)+x\\cot x)$", why: "return to the original function" }
      ], answer: "$(\\sin x)^x(\\ln(\\sin x)+x\\cot x)$" },
      { problem: "For a product of probabilities $P(w)=p_1(w)p_2(w)p_3(w)$, show the derivative in log form.", steps: [
        { do: "Take logs", result: "$\\ln P=\\ln p_1+\\ln p_2+\\ln p_3$", why: "products become sums" },
        { do: "Differentiate", result: "$\\dfrac{P'}{P}=\\dfrac{p_1'}{p_1}+\\dfrac{p_2'}{p_2}+\\dfrac{p_3'}{p_3}$", why: "each log derivative is relative change" },
        { do: "Multiply by $P$", result: "$P'=P\\left(\\dfrac{p_1'}{p_1}+\\dfrac{p_2'}{p_2}+\\dfrac{p_3'}{p_3}\\right)$", why: "convert back to the ordinary derivative" },
        { do: "Interpret", result: "the product's relative slope is the sum of relative slopes", why: "this is why logs stabilize likelihood calculations" }
      ], answer: "$P'=P\\left(p_1'/p_1+p_2'/p_2+p_3'/p_3\\right)$." }
    ],
    applications: [
      { title: "Likelihood products", background: "Independent data likelihoods multiply many terms; logs turn the derivative into a manageable sum.", numbers: "If $P=p_1p_2p_3$ with relative slopes $0.2,-0.1,0.4$, then $P'/P=0.5$, so when $P=0.06$, $P'=0.03$." },
      { title: "Elasticity", background: "Economics and ML monitoring often care about percent change rather than raw change; log derivatives measure that directly.", numbers: "For demand $D(p)=100p^{-2}$, $d\\ln D/d\\ln p=-2$, so a $1\\%$ price increase predicts about a $2\\%$ demand drop." },
      { title: "Gradient of geometric means", background: "Geometric means are products under a root, common when combining multiplicative scores.", numbers: "For $G=(abc)^{1/3}$, $G'/G=(1/3)(a'/a+b'/b+c'/c)$; with relative slopes $0.3,0.0,-0.6$, $G'/G=-0.1$." },
      { title: "Variable exponent models", background: "Expressions like $x^x$ and $a(x)^{b(x)}$ appear in scaling laws and adaptive penalties.", numbers: "$d(x^x)/dx=x^x(\\ln x+1)$; at $x=2$, the slope is $4(1.693)=6.772$." },
      { title: "Numerical stability", background: "Computing gradients of products directly can underflow; log differentiation keeps intermediate values ordinary.", numbers: "A product of $100$ factors of $0.9$ is $0.9^{100}=0.0000266$, but the log is $100\\ln0.9=-10.536$." },
      { title: "Multiplicative feature interactions", background: "Some models combine positive features multiplicatively, and log derivatives reveal which factor drives sensitivity.", numbers: "For score $s=x^2z^3$, $s_x/s=2/x$; at $x=4$, a one-unit increase contributes relative slope $0.5$." }
    ],
    applicationsClose: "When multiplication makes a derivative noisy, logs make the same structure quiet: add relative changes, then multiply back.",
    takeaways: [
      "Take $\\ln$ of both sides, use log rules, differentiate implicitly, then multiply by the original function.",
      "The method shines for products, quotients, powers, and variable exponents like $x^x$.",
      "Log differentiation turns product sensitivity into sums of relative sensitivities."
    ]
  },

  "math-01-25": {
    id: "math-01-25",
    title: "Related rates",
    tagline: "When quantities are tied together, their rates are tied together too.",
    connections: {
      buildsOn: ["Logarithmic differentiation", "Implicit differentiation", "The chain rule"],
      leadsTo: ["Linear approximation", "optimization", "dynamical systems"],
      usedWith: ["Implicit differentiation", "Differentials", "Linear approximation"]
    },
    motivation:
      "<p>Real systems rarely change one variable at a time. A balloon's radius grows and its volume changes; a camera's distance changes and the image size changes; a training metric moves and the alert threshold moves with it.</p>" +
      "<p>Related rates are the chain rule with units attached. Write an equation connecting the quantities, differentiate with respect to time, and use the known rate to find the unknown rate.</p>",
    definition:
      "<p>A <b>related rates</b> problem starts with a relationship such as $V=\\frac43\\pi r^3$, where each variable depends on time $t$. Differentiate both sides with respect to $t$: $$\\dfrac{dV}{dt}=4\\pi r^2\\dfrac{dr}{dt}.$$ Then substitute the values at the instant of interest. The equation connects rates, not just values.</p>" +
      "<p><b>Assumptions that matter:</b> variables must be differentiable functions of time; substitute numerical values after differentiating unless the relationship is linear; units must match; and rates can be negative when a quantity is decreasing.</p>",
    worked: {
      problem: "Air enters a spherical balloon at $100\\text{ cm}^3/\\text{s}$. How fast is the radius increasing when $r=5\\text{ cm}$?",
      skills: ["chain rule", "sphere volume", "unit interpretation"],
      strategy: "Volume and radius are linked by geometry. Differentiate the volume formula with respect to time, then plug in the instant $r=5$.",
      steps: [
        { do: "Write the relationship", result: "$V=\\dfrac43\\pi r^3$", why: "volume of a sphere" },
        { do: "Differentiate with respect to time", result: "$\\dfrac{dV}{dt}=4\\pi r^2\\dfrac{dr}{dt}$", why: "chain rule on $r^3$" },
        { do: "Substitute $dV/dt=100$", result: "$100=4\\pi r^2\\dfrac{dr}{dt}$", why: "given inflow rate" },
        { do: "Substitute $r=5$", result: "$100=100\\pi\\dfrac{dr}{dt}$", why: "$4\\pi\\cdot25=100\\pi$" },
        { do: "Solve for $dr/dt$", result: "$\\dfrac{dr}{dt}=\\dfrac1\\pi$", why: "divide by $100\\pi$" }
      ],
      verify: "The units are $(\\text{cm}^3/\\text{s})/(\\text{cm}^2)=\\text{cm}/\\text{s}$, and the rate is positive because the balloon is expanding.",
      answer: "$dr/dt=1/\\pi\\approx0.318\\text{ cm/s}$",
      connects: "the chain rule turns a geometric relationship into a relationship between rates."
    },
    practice: [
      { problem: "A square's side grows at $2$ cm/s. How fast is its area changing when the side is $6$ cm?", steps: [
        { do: "Write the area formula", result: "$A=s^2$", why: "area of a square" },
        { do: "Differentiate with respect to time", result: "$\\dfrac{dA}{dt}=2s\\dfrac{ds}{dt}$", why: "chain rule" },
        { do: "Substitute $s=6$", result: "$\\dfrac{dA}{dt}=12\\dfrac{ds}{dt}$", why: "evaluate at the instant" },
        { do: "Substitute $ds/dt=2$", result: "$\\dfrac{dA}{dt}=24$", why: "given side rate" }
      ], answer: "$24\\text{ cm}^2/\\text{s}$" },
      { problem: "A circle's radius decreases at $0.5$ m/s. How fast is area changing when $r=4$ m?", steps: [
        { do: "Write the area formula", result: "$A=\\pi r^2$", why: "area of a circle" },
        { do: "Differentiate", result: "$\\dfrac{dA}{dt}=2\\pi r\\dfrac{dr}{dt}$", why: "chain rule" },
        { do: "Substitute $r=4$", result: "$\\dfrac{dA}{dt}=8\\pi\\dfrac{dr}{dt}$", why: "instant value" },
        { do: "Substitute $dr/dt=-0.5$", result: "$\\dfrac{dA}{dt}=-4\\pi$", why: "radius is decreasing" }
      ], answer: "$-4\\pi\\text{ m}^2/\\text{s}$" },
      { problem: "A ladder $10$ ft long slides down a wall. If the bottom moves away at $3$ ft/s, how fast is the top moving when the bottom is $6$ ft from the wall?", steps: [
        { do: "Write the constraint", result: "$x^2+y^2=100$", why: "Pythagorean theorem" },
        { do: "Differentiate", result: "$2x\\dfrac{dx}{dt}+2y\\dfrac{dy}{dt}=0$", why: "both distances depend on time" },
        { do: "Find $y$ when $x=6$", result: "$y=8$", why: "$6^2+y^2=100$" },
        { do: "Substitute known values", result: "$2(6)(3)+2(8)\\dfrac{dy}{dt}=0$", why: "use the instant and given rate" },
        { do: "Solve", result: "$\\dfrac{dy}{dt}=-\\dfrac{36}{16}=-2.25$", why: "the top moves downward" }
      ], answer: "$dy/dt=-2.25$ ft/s." },
      { problem: "For $z=x^2y$, suppose $dx/dt=1$, $dy/dt=-2$, $x=3$, and $y=4$. Find $dz/dt$.", steps: [
        { do: "Differentiate $z=x^2y$", result: "$\\dfrac{dz}{dt}=2x\\dfrac{dx}{dt}y+x^2\\dfrac{dy}{dt}$", why: "product rule and chain rule" },
        { do: "Substitute $x=3$", result: "$\\dfrac{dz}{dt}=6\\dfrac{dx}{dt}y+9\\dfrac{dy}{dt}$", why: "evaluate powers of $x$" },
        { do: "Substitute $y=4$", result: "$\\dfrac{dz}{dt}=24\\dfrac{dx}{dt}+9\\dfrac{dy}{dt}$", why: "use the current value" },
        { do: "Substitute the rates", result: "$24(1)+9(-2)=6$", why: "combine the two changing effects" }
      ], answer: "$dz/dt=6$" },
      { problem: "A validation loss $L(w)=w^2$ changes because $w(t)$ changes. If $w=0.8$ and $dw/dt=-0.05$ per epoch, find $dL/dt$.", steps: [
        { do: "Write the relationship", result: "$L=w^2$", why: "loss as a function of the parameter" },
        { do: "Differentiate with respect to epoch", result: "$\\dfrac{dL}{dt}=2w\\dfrac{dw}{dt}$", why: "chain rule" },
        { do: "Substitute $w=0.8$", result: "$\\dfrac{dL}{dt}=1.6\\dfrac{dw}{dt}$", why: "current parameter value" },
        { do: "Substitute $dw/dt=-0.05$", result: "$\\dfrac{dL}{dt}=-0.08$", why: "parameter is moving downward" }
      ], answer: "$dL/dt=-0.08$ loss units per epoch." }
    ],
    applications: [
      { title: "Training dynamics", background: "A metric changes because parameters change; related rates track how parameter motion affects loss.", numbers: "If $L=w^2$ and $dw/dt=-0.01$ at $w=5$, then $dL/dt=2(5)(-0.01)=-0.1$ per step." },
      { title: "Computer vision scaling", background: "Object image area changes as camera distance changes, and the rate matters for tracking.", numbers: "If image height $h=200/d$ pixels and $dd/dt=-0.5$ m/s at $d=10$, then $dh/dt=-200d^{-2}dd/dt=1$ pixel/s." },
      { title: "Network throughput", background: "Queue delay depends on utilization, so traffic changes produce amplified delay changes near capacity.", numbers: "For $W=1/(\\mu-\\lambda)$ with $\\mu=100$ and $d\\lambda/dt=2$, at $\\lambda=90$, $dW/dt=(\\mu-\\lambda)^{-2}d\\lambda/dt=0.02$ s/s." },
      { title: "Uncertainty propagation over time", background: "Sensor error variances can depend on distance, and related rates quantify how fast uncertainty grows.", numbers: "If $\\sigma^2=0.01d^2$ and $dd/dt=3$ at $d=20$, then $d\\sigma^2/dt=0.02(20)(3)=1.2$ units per second." },
      { title: "A/B experiment monitoring", background: "A ratio metric changes because numerator and denominator both change.", numbers: "For CTR $c=C/I$, $dC/dt=30$, $dI/dt=1000$, $C=600$, $I=20000$: $dc/dt=(30I-600000)/I^2=0$, so CTR is steady." },
      { title: "Robotics geometry", background: "A robot endpoint constrained by a link length has related horizontal and vertical velocities.", numbers: "On $x^2+y^2=1$, with $x=0.6$, $y=0.8$, and $dx/dt=0.1$, $dy/dt=-(0.6/0.8)(0.1)=-0.075$." }
    ],
    applicationsClose: "Related rates are just the chain rule with a clock attached: values are connected, so their rates must be connected too.",
    takeaways: [
      "Write an equation connecting the quantities before differentiating.",
      "Differentiate with respect to time and attach a rate to each changing variable.",
      "Substitute values after differentiating, keep units, and let negative signs carry direction."
    ]
  },

  "math-01-26": {
    id: "math-01-26",
    title: "Linear approximation",
    tagline: "Zoom in far enough, and a smooth curve behaves like its tangent line.",
    connections: {
      buildsOn: ["Related rates", "The derivative — definition and meaning", "The point-slope form of a line"],
      leadsTo: ["Differentials", "Taylor series", "gradient descent intuition"],
      usedWith: ["Differentials", "The derivative", "Taylor series"]
    },
    motivation:
      "<p>Curves can be hard, but near one point a smooth curve is almost a line. That is not a trick; it is the local meaning of the derivative.</p>" +
      "<p>Linear approximation lets you make quick estimates without recomputing the whole function. It is the first-order version of the idea behind Taylor series, gradient descent steps, and local model explanations.</p>",
    definition:
      "<p>If $f$ is differentiable at $a$, the <b>linear approximation</b> near $a$ is $$L(x)=f(a)+f'(a)(x-a).$$ It is the tangent line used as a local stand-in for the curve. The derivation comes from the derivative definition: for $x$ close to $a$, $\\dfrac{f(x)-f(a)}{x-a}\\approx f'(a)$, so $f(x)\\approx f(a)+f'(a)(x-a)$.</p>" +
      "<p><b>Assumptions that matter:</b> the function must be differentiable at the base point; the estimate is local, so it gets worse as $x$ moves away; and strong curvature means the linear estimate can drift quickly.</p>",
    worked: {
      problem: "Use linear approximation at $a=4$ to estimate $\\sqrt{4.1}$.",
      skills: ["tangent line", "derivative evaluation", "approximation"],
      strategy: "Use the nearby easy point $4$, where the square root is exact, then move a small distance $0.1$ along the tangent line.",
      steps: [
        { do: "Define the function", result: "$f(x)=\\sqrt{x}$", why: "we want a square-root estimate" },
        { do: "Evaluate at the base point", result: "$f(4)=2$", why: "$4$ has an exact square root" },
        { do: "Differentiate", result: "$f'(x)=\\dfrac{1}{2\\sqrt{x}}$", why: "power rule for $x^{1/2}$" },
        { do: "Evaluate the slope", result: "$f'(4)=\\dfrac14$", why: "$2\\sqrt4=4$" },
        { do: "Build the tangent line", result: "$L(x)=2+\\dfrac14(x-4)$", why: "use $f(a)+f'(a)(x-a)$" },
        { do: "Substitute $x=4.1$", result: "$L(4.1)=2+0.025=2.025$", why: "the change from $4$ is $0.1$" }
      ],
      verify: "The true value is $\\sqrt{4.1}\\approx2.02485$, so the tangent-line estimate $2.025$ is very close because $4.1$ is near $4$.",
      answer: "$\\sqrt{4.1}\\approx2.025$",
      connects: "a derivative converts a small input change into a small output change."
    },
    practice: [
      { problem: "Estimate $\\sqrt{9.2}$ using $a=9$.", steps: [
        { do: "Choose the function", result: "$f(x)=\\sqrt{x}$", why: "we are estimating a square root" },
        { do: "Evaluate the base value", result: "$f(9)=3$", why: "exact square root" },
        { do: "Evaluate the derivative", result: "$f'(9)=\\dfrac{1}{2\\sqrt9}=\\dfrac16$", why: "square-root derivative" },
        { do: "Compute the input change", result: "$9.2-9=0.2$", why: "distance from the base point" },
        { do: "Apply the linear approximation", result: "$3+\\dfrac16(0.2)=3.0333$", why: "base value plus slope times change" }
      ], answer: "$\\sqrt{9.2}\\approx3.0333$" },
      { problem: "Estimate $e^{0.05}$ using $a=0$.", steps: [
        { do: "Choose the function", result: "$f(x)=e^x$", why: "we are estimating an exponential" },
        { do: "Evaluate the base value", result: "$f(0)=1$", why: "$e^0=1$" },
        { do: "Evaluate the slope", result: "$f'(0)=1$", why: "the derivative of $e^x$ is $e^x$" },
        { do: "Build $L(x)$", result: "$L(x)=1+x$", why: "tangent line at zero" },
        { do: "Substitute $x=0.05$", result: "$1.05$", why: "small positive input change" }
      ], answer: "$e^{0.05}\\approx1.05$" },
      { problem: "Estimate $\\ln(1.1)$ using $a=1$.", steps: [
        { do: "Choose the function", result: "$f(x)=\\ln x$", why: "we need a log estimate" },
        { do: "Evaluate at $1$", result: "$f(1)=0$", why: "$\\ln1=0$" },
        { do: "Evaluate the slope", result: "$f'(1)=1$", why: "$f'(x)=1/x$" },
        { do: "Build the line", result: "$L(x)=x-1$", why: "base value $0$ plus slope $1$" },
        { do: "Substitute $1.1$", result: "$0.1$", why: "the input is $0.1$ above the base" }
      ], answer: "$\\ln(1.1)\\approx0.1$" },
      { problem: "For $f(x)=x^3$, approximate $f(2.02)$ using $a=2$.", steps: [
        { do: "Evaluate the base value", result: "$f(2)=8$", why: "cube the base point" },
        { do: "Differentiate", result: "$f'(x)=3x^2$", why: "power rule" },
        { do: "Evaluate the slope", result: "$f'(2)=12$", why: "$3\\cdot4=12$" },
        { do: "Compute the input change", result: "$2.02-2=0.02$", why: "small movement from the base" },
        { do: "Apply the tangent line", result: "$8+12(0.02)=8.24$", why: "linear approximation" }
      ], answer: "$f(2.02)\\approx8.24$" },
      { problem: "A model score is $s(w)=\\sigma(w)$ with $\\sigma(0)=0.5$ and $\\sigma'(0)=0.25$. Approximate $s(0.08)$.", steps: [
        { do: "Identify the base point", result: "$a=0$", why: "the value and derivative are given there" },
        { do: "Write the linear approximation", result: "$L(w)=0.5+0.25(w-0)$", why: "use value plus slope times change" },
        { do: "Substitute $w=0.08$", result: "$L(0.08)=0.5+0.25(0.08)$", why: "small positive parameter move" },
        { do: "Multiply", result: "$0.25(0.08)=0.02$", why: "slope times change" },
        { do: "Add", result: "$0.52$", why: "estimated new score" }
      ], answer: "$s(0.08)\\approx0.52$." }
    ],
    applications: [
      { title: "Gradient descent intuition", background: "A small parameter step changes loss approximately by slope times step.", numbers: "If $L'(w)=3$ and $\\Delta w=-0.01$, then $\\Delta L\\approx3(-0.01)=-0.03$." },
      { title: "Model explainability", background: "Local linear explanations approximate a nonlinear model near one input.", numbers: "If a feature slope is $0.8$ and the feature is $0.5$ above baseline, the local contribution is about $0.4$ score units." },
      { title: "Fast square-root estimates", background: "Numerical code often starts with a cheap local estimate before refining.", numbers: "$\\sqrt{101}$ near $100$ is $10+(1/(20))(1)=10.05$; the true value is about $10.0499$." },
      { title: "Sensor calibration", background: "Around an operating point, a nonlinear sensor curve can be treated as linear for small changes.", numbers: "If voltage slope is $0.02$ V/C at $25$ C, a $3$ C increase gives about $0.06$ V increase." },
      { title: "Probabilities near a logit", background: "The sigmoid is nonlinear, but near zero it is almost a line.", numbers: "$\\sigma(0)=0.5$, $\\sigma'(0)=0.25$, so $\\sigma(0.2)\\approx0.55$; the true value is about $0.5498$." },
      { title: "Compiler and graphics approximations", background: "Fast math libraries use polynomial and linear local approximations where exact functions are expensive.", numbers: "For $\\sin(0.03)$, the linear approximation at $0$ gives $0.03$; the true value is $0.0299955$." }
    ],
    applicationsClose: "Linear approximation is the derivative made practical: for a small move, slope times distance is usually the first thing worth knowing.",
    takeaways: [
      "The tangent-line approximation is $L(x)=f(a)+f'(a)(x-a)$.",
      "It works locally for differentiable functions and gets less reliable far from the base point.",
      "First-order thinking powers gradient steps, quick estimates, and local explanations."
    ]
  },

  "math-01-27": {
    id: "math-01-27",
    title: "Differentials",
    tagline: "A differential packages the tiny output change predicted by the derivative.",
    connections: {
      buildsOn: ["Linear approximation", "The derivative — definition and meaning", "Related rates"],
      leadsTo: ["Indeterminate forms", "Taylor series", "error propagation"],
      usedWith: ["Linear approximation", "Related rates", "Taylor series"]
    },
    motivation:
      "<p>Linear approximation says a small input change produces an output change of about slope times input change. Differentials give that sentence a compact notation.</p>" +
      "<p>Write $dy=f'(x)dx$. The symbol $dx$ is a small input change, and $dy$ is the tangent-line prediction for the output change. This is the language of error propagation, sensitivity, and continuous approximations.</p>",
    definition:
      "<p>For a differentiable function $y=f(x)$, the <b>differential</b> is $$dy=f'(x)\\,dx.$$ It comes directly from $f(x+\\Delta x)\\approx f(x)+f'(x)\\Delta x$: the predicted change is $dy=f'(x)dx$. The actual change is $\\Delta y=f(x+\\Delta x)-f(x)$; for small $dx=\\Delta x$, $dy$ is a close approximation.</p>" +
      "<p><b>Assumptions that matter:</b> the function must be differentiable at the point; $dx$ should be small for $dy$ to approximate $\\Delta y$ well; and $dy$ is the linear prediction, not automatically the exact output change.</p>",
    worked: {
      problem: "Use differentials to approximate the change in $y=\\sqrt{x}$ when $x$ goes from $25$ to $25.4$.",
      skills: ["differentials", "square-root derivative", "error estimate"],
      strategy: "Treat the input change as $dx=0.4$ and compute the tangent-line output change $dy=f'(25)dx$.",
      steps: [
        { do: "Identify the function", result: "$y=\\sqrt{x}$", why: "we want a square-root change" },
        { do: "Differentiate", result: "$dy=\\dfrac{1}{2\\sqrt{x}}dx$", why: "differential form of the derivative" },
        { do: "Substitute $x=25$", result: "$dy=\\dfrac{1}{10}dx$", why: "$2\\sqrt{25}=10$" },
        { do: "Substitute $dx=0.4$", result: "$dy=0.04$", why: "input increased by $0.4$" },
        { do: "Estimate the new value", result: "$\\sqrt{25.4}\\approx5+0.04=5.04$", why: "base value plus predicted change" }
      ],
      verify: "The true value is $\\sqrt{25.4}\\approx5.03984$, so the differential prediction is close because the input change is small relative to $25$.",
      answer: "The predicted change is $dy=0.04$, so $\\sqrt{25.4}\\approx5.04$.",
      connects: "differentials are linear approximation written as a small-change equation."
    },
    practice: [
      { problem: "For $y=x^2$, estimate $dy$ when $x=3$ and $dx=0.05$.", steps: [
        { do: "Differentiate", result: "$dy=2x\\,dx$", why: "differential form" },
        { do: "Substitute $x=3$", result: "$dy=6dx$", why: "slope at the point" },
        { do: "Substitute $dx=0.05$", result: "$dy=0.3$", why: "multiply slope by input change" },
        { do: "Interpret", result: "the output increases by about $0.3$", why: "positive slope and positive change" }
      ], answer: "$dy=0.3$" },
      { problem: "For $y=1/x$, estimate the change when $x=10$ and $dx=-0.2$.", steps: [
        { do: "Differentiate", result: "$dy=-x^{-2}dx$", why: "power rule" },
        { do: "Substitute $x=10$", result: "$dy=-\\dfrac{1}{100}dx$", why: "$10^2=100$" },
        { do: "Substitute $dx=-0.2$", result: "$dy=0.002$", why: "a negative input change raises $1/x$" },
        { do: "Estimate the new value", result: "$0.1+0.002=0.102$", why: "base value plus differential" }
      ], answer: "The estimated change is $0.002$, giving $1/9.8\\approx0.102$." },
      { problem: "Use differentials to estimate $\\ln(1.02)$.", steps: [
        { do: "Set the base point", result: "$x=1$", why: "$\\ln1=0$ is easy" },
        { do: "Compute $dx$", result: "$dx=0.02$", why: "$1.02$ is $0.02$ above $1$" },
        { do: "Write the differential", result: "$dy=\\dfrac1x dx$", why: "derivative of $\\ln x$" },
        { do: "Substitute $x=1$", result: "$dy=0.02$", why: "slope at $1$ is $1$" },
        { do: "Add to the base value", result: "$\\ln(1.02)\\approx0+0.02$", why: "differential approximation" }
      ], answer: "$\\ln(1.02)\\approx0.02$" },
      { problem: "The radius of a sphere is measured as $10$ cm with possible error $0.1$ cm. Estimate the volume error.", steps: [
        { do: "Write the volume", result: "$V=\\dfrac43\\pi r^3$", why: "sphere formula" },
        { do: "Write the differential", result: "$dV=4\\pi r^2dr$", why: "differentiate volume" },
        { do: "Substitute $r=10$", result: "$dV=400\\pi\\,dr$", why: "surface area factor" },
        { do: "Substitute $dr=0.1$", result: "$dV=40\\pi$", why: "measurement error" },
        { do: "Approximate", result: "$40\\pi\\approx125.7$", why: "numeric error estimate" }
      ], answer: "About $40\\pi\\approx125.7\\text{ cm}^3$ of volume error." },
      { problem: "A logit changes by $dx=0.04$ near $x=0$, where $p=\\sigma(x)$. Use $dp=\\sigma(x)(1-\\sigma(x))dx$ to estimate $dp$.", steps: [
        { do: "Evaluate the sigmoid", result: "$\\sigma(0)=0.5$", why: "known center value" },
        { do: "Evaluate the derivative factor", result: "$0.5(1-0.5)=0.25$", why: "sigmoid slope formula" },
        { do: "Write the differential", result: "$dp=0.25dx$", why: "small probability change" },
        { do: "Substitute $dx=0.04$", result: "$dp=0.01$", why: "multiply slope by input change" },
        { do: "Estimate the probability", result: "$0.51$", why: "base probability plus differential" }
      ], answer: "$dp\\approx0.01$, so the probability is about $0.51$." }
    ],
    applications: [
      { title: "Error propagation", background: "Measurements carry uncertainty, and differentials estimate how input uncertainty becomes output uncertainty.", numbers: "For $A=\\pi r^2$, $dA=2\\pi r dr$; with $r=5$ and $dr=0.02$, $dA=0.2\\pi\\approx0.628$." },
      { title: "Gradient updates", background: "A tiny parameter update changes the loss by approximately the differential.", numbers: "If $dL=\\nabla L\\cdot dw$ in one dimension with slope $-4$ and $dw=0.01$, then $dL\\approx-0.04$." },
      { title: "Quantization sensitivity", background: "Rounding a feature introduces small input error; differentials estimate output impact.", numbers: "For $f(x)=x^2$ at $x=8$, a quantization error $dx=0.005$ gives $dy=16(0.005)=0.08$." },
      { title: "Probabilistic calibration", background: "Small logit changes near a probability can be translated into probability changes.", numbers: "At sigmoid logit $2$, $p=0.881$ and slope $p(1-p)=0.105$; $dx=0.1$ gives $dp\\approx0.0105$." },
      { title: "Latency models", background: "If latency depends nonlinearly on load, differentials estimate the impact of small load changes.", numbers: "For $W=1/(1-\\rho)$ at $\\rho=0.8$, $dW=(1-\\rho)^{-2}d\\rho=25d\\rho$; $d\\rho=0.01$ gives $0.25$ extra time units." },
      { title: "Scientific computing", background: "Differentials are the first term in numerical error analysis for algorithms.", numbers: "For $f(x)=e^x$ at $x=0$, an input rounding error $dx=10^{-6}$ gives $dy\\approx10^{-6}$." }
    ],
    applicationsClose: "Differentials make small-change reasoning portable: slope times input error predicts output error across many systems.",
    takeaways: [
      "For $y=f(x)$, the differential is $dy=f'(x)dx$.",
      "$dy$ is the tangent-line prediction for the actual change $\\Delta y$.",
      "Differentials are useful for estimates, uncertainty propagation, and small gradient steps."
    ]
  },

  "math-01-28": {
    id: "math-01-28",
    title: "Indeterminate forms",
    tagline: "Some substitutions say 'not enough information'; the form tells you what to try next.",
    connections: {
      buildsOn: ["Differentials", "Limits: definition and computation", "Derivative of logarithmic functions"],
      leadsTo: ["L'Hôpital's rule", "Taylor series", "asymptotic analysis"],
      usedWith: ["Limits: definition and computation", "L'Hôpital's rule", "Taylor series"]
    },
    motivation:
      "<p>When a limit gives $0/0$ or $\\infty/\\infty$, it has not failed; it has only told you that the first substitution was inconclusive. The pieces are competing, and you need a better view of their relative size.</p>" +
      "<p>Indeterminate forms are a checklist of these competitions. Recognizing the form tells you whether to factor, rationalize, combine fractions, take logs, use a known limit, or prepare for L'Hopital's rule next.</p>",
    definition:
      "<p>An <b>indeterminate form</b> is a limiting pattern that does not determine a unique answer by arithmetic alone. The main forms are $$\\frac00,\\quad \\frac{\\infty}{\\infty},\\quad 0\\cdot\\infty,\\quad \\infty-\\infty,\\quad 0^0,\\quad 1^\\infty,\\quad \\infty^0.$$ For example, $x/x$ and $x^2/x$ both look like $0/0$ as $x\\to0$, but their limits are $1$ and $0$.</p>" +
      "<p><b>Assumptions that matter:</b> the form is a diagnosis, not an answer; rewrite before concluding; one-sided behavior can matter; and exponential forms are often handled by taking logs so powers become products.</p>",
    worked: {
      problem: "Compute $\\displaystyle\\lim_{x\\to0}\\frac{e^x-1}{x}$.",
      skills: ["indeterminate form", "known exponential limit", "linear approximation"],
      strategy: "Direct substitution gives $0/0$. Use the first-order behavior $e^x\\approx1+x$ near zero.",
      steps: [
        { do: "Try direct substitution", result: "$\\frac00$", why: "both numerator and denominator go to zero" },
        { do: "Use the local expansion", result: "$e^x=1+x+\\dfrac{x^2}{2}+\\cdots$", why: "exponential is smooth near zero" },
        { do: "Subtract $1$", result: "$e^x-1=x+\\dfrac{x^2}{2}+\\cdots$", why: "constant terms cancel" },
        { do: "Divide by $x$", result: "$1+\\dfrac{x}{2}+\\cdots$", why: "the leading $x$ terms decide the limit" },
        { do: "Let $x\\to0$", result: "$1$", why: "higher-order terms vanish" }
      ],
      verify: "With $x=0.001$, $(e^{0.001}-1)/0.001\\approx1.0005$; with $x=-0.001$, it is about $0.9995$. Both sides close in on $1$.",
      answer: "$\\displaystyle\\lim_{x\\to0}\\frac{e^x-1}{x}=1$",
      connects: "an indeterminate form asks for the leading behavior, not ordinary substitution."
    },
    practice: [
      { problem: "$\\displaystyle\\lim_{x\\to2}\\dfrac{x^2-4}{x-2}$", steps: [
        { do: "Substitute $x=2$", result: "$\\frac00$", why: "indeterminate form" },
        { do: "Factor the numerator", result: "$\\dfrac{(x-2)(x+2)}{x-2}$", why: "difference of squares" },
        { do: "Cancel $x-2$", result: "$x+2$", why: "valid for $x\\ne2$ near the limit point" },
        { do: "Substitute $x=2$", result: "$4$", why: "the simplified expression is continuous" }
      ], answer: "$4$" },
      { problem: "$\\displaystyle\\lim_{x\\to0}\\dfrac{\\sin x}{x}$", steps: [
        { do: "Substitute $x=0$", result: "$\\frac00$", why: "both sine and $x$ vanish" },
        { do: "Use the standard trig limit", result: "$\\lim_{x\\to0}\\dfrac{\\sin x}{x}=1$", why: "radian measure makes sine locally match its angle" },
        { do: "Check the local approximation", result: "$\\sin x=x-\\dfrac{x^3}{6}+\\cdots$", why: "leading term is $x$" },
        { do: "Divide by $x$", result: "$1-\\dfrac{x^2}{6}+\\cdots$", why: "higher-order terms vanish" }
      ], answer: "$1$" },
      { problem: "$\\displaystyle\\lim_{x\\to\\infty}x(e^{1/x}-1)$", steps: [
        { do: "Identify the form", result: "$\\infty\\cdot0$", why: "$x\\to\\infty$ while $e^{1/x}-1\\to0$" },
        { do: "Rewrite as a quotient", result: "$\\dfrac{e^{1/x}-1}{1/x}$", why: "turn $\\infty\\cdot0$ into $0/0$" },
        { do: "Set $u=1/x$", result: "$u\\to0$", why: "as $x\\to\\infty$, the reciprocal shrinks" },
        { do: "Use the exponential limit", result: "$\\lim_{u\\to0}\\dfrac{e^u-1}{u}=1$", why: "known leading behavior" }
      ], answer: "$1$" },
      { problem: "$\\displaystyle\\lim_{x\\to\\infty}(\\sqrt{x^2+x}-x)$", steps: [
        { do: "Identify the form", result: "$\\infty-\\infty$", why: "both terms grow without bound" },
        { do: "Multiply by the conjugate", result: "$\\dfrac{(x^2+x)-x^2}{\\sqrt{x^2+x}+x}$", why: "convert subtraction into a quotient" },
        { do: "Simplify the numerator", result: "$\\dfrac{x}{\\sqrt{x^2+x}+x}$", why: "the $x^2$ terms cancel" },
        { do: "Divide top and bottom by $x$", result: "$\\dfrac{1}{\\sqrt{1+1/x}+1}$", why: "$x>0$ for large $x$" },
        { do: "Let $x\\to\\infty$", result: "$\\dfrac12$", why: "$1/x\\to0$" }
      ], answer: "$1/2$" },
      { problem: "$\\displaystyle\\lim_{n\\to\\infty}\\left(1+\\dfrac{2}{n}\\right)^n$", steps: [
        { do: "Identify the form", result: "$1^\\infty$", why: "the base goes to $1$ while the exponent grows" },
        { do: "Take logs of the limit", result: "$\\ln L=\\lim_{n\\to\\infty}n\\ln(1+2/n)$", why: "powers become products" },
        { do: "Use the log approximation", result: "$\\ln(1+2/n)\\approx2/n$", why: "near zero, $\\ln(1+u)\\approx u$" },
        { do: "Multiply by $n$", result: "$\\ln L\\to2$", why: "the leading terms cancel" },
        { do: "Exponentiate", result: "$L=e^2$", why: "undo the logarithm" }
      ], answer: "$e^2$" }
    ],
    applications: [
      { title: "Gradient definitions", background: "The derivative itself starts as the indeterminate form $0/0$ before simplification reveals the slope.", numbers: "For $f(x)=x^2$ at $x=3$, $((3+h)^2-9)/h=(6h+h^2)/h=6+h$, so the limit is $6$." },
      { title: "Numerical stability", background: "Expressions like $e^x-1$ lose precision near zero, so libraries use special rewrites such as expm1.", numbers: "For $x=10^{-8}$, $e^x-1\\approx10^{-8}$; subtracting two nearly equal floating-point numbers can erase useful digits." },
      { title: "Softmax overflow and ratios", background: "Large exponentials create $\\infty/\\infty$ patterns unless scores are shifted before exponentiating.", numbers: "Softmax of $[1000,999]$ equals softmax of $[0,-1]$: probabilities are $1/(1+e^{-1})=0.731$ and $0.269$." },
      { title: "Asymptotic algorithm analysis", background: "Comparing growth rates often produces $\\infty/\\infty$, then leading terms decide the limit.", numbers: "$\\lim_{n\\to\\infty}(3n^2+n)/(5n^2-7)=3/5$, so the two runtimes differ by about a constant factor $0.6$." },
      { title: "Continuous compounding", background: "The classic $1^\\infty$ form defines exponential growth from many tiny multiplicative steps.", numbers: "$(1+0.05/n)^n\\to e^{0.05}\\approx1.05127$, the continuously compounded one-year factor at $5\\%$." },
      { title: "Activation approximations", background: "Small-input behavior of activations often depends on resolving $0/0$ or cancellation patterns.", numbers: "For $\\tanh x/x$ as $x\\to0$, $\\tanh x=x-x^3/3+\\cdots$, so the ratio tends to $1$." }
    ],
    applicationsClose: "Indeterminate forms are not dead ends; they are signposts telling you to compare leading behavior more carefully.",
    takeaways: [
      "Forms like $0/0$, $\\infty/\\infty$, $0\\cdot\\infty$, $\\infty-\\infty$, $0^0$, $1^\\infty$, and $\\infty^0$ need rewriting.",
      "The form is not the answer; factor, rationalize, combine, substitute a new variable, or take logs.",
      "Resolving indeterminate forms is central to derivatives, numerical stability, asymptotics, and continuous compounding."
    ]
  }
};
