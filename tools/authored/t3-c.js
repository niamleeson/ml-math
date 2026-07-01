module.exports = {
  "math-03-28": {
    id: "math-03-28",
    title: "The inverse Laplace transform",
    tagline: "The inverse transform brings an algebraic expression in $s$ back into a time signal you can read.",
    connections: {
      buildsOn: ["The Laplace transform", "partial fractions", "exponential and trigonometric functions"],
      leadsTo: ["Solving IVPs with Laplace", "transfer functions", "convolution methods"],
      usedWith: ["linear ODEs", "complex roots", "tables of transforms", "convolution"]
    },
    motivation:
      `<p>You have just learned how the Laplace transform turns a time function into an $s$-domain expression. That is useful only if we can come home again.</p>` +
      `<p>The <b>inverse Laplace transform</b> is the return trip. It asks: which time function has this algebraic shadow? The friendly surprise is that many expressions break into a few table entries, just like decomposing a chord into notes.</p>`,
    definition:
      `<p>If $F(s)=\\mathcal{L}\\{f(t)\\}$ on a region where the transform converges, then the <b>inverse Laplace transform</b> is written $f(t)=\\mathcal{L}^{-1}\\{F(s)\\}$. In practice we rewrite $F(s)$ into known forms such as $1/(s+a)$, $a/(s^2+a^2)$, or $s/(s^2+a^2)$.</p>` +
      `<p>The reason partial fractions work is linearity: if $F(s)=A/(s+1)+B/(s+3)$, then $\\mathcal{L}^{-1}\\{F\\}=Ae^{-t}+Be^{-3t}$. Algebra separates the modes, and the table turns each mode back into time.</p>` +
      `<p><b>Assumptions that matter:</b> $F(s)$ must be a transform on a valid region of convergence; one-sided Laplace inverses describe $t\\ge0$ signals; repeated roots produce powers of $t$; complex roots produce sines, cosines, and decaying oscillations.</p>`,
    worked: {
      problem: "Find $\\mathcal{L}^{-1}\\left\\{\\dfrac{5s+7}{(s+1)(s+3)}\\right\\}$.",
      skills: ["partial fractions", "table inversion", "linearity"],
      strategy: "The denominator has two simple factors — split into table-sized pieces.",
      steps: [
        { do: "Set up partial fractions", result: "$\\dfrac{5s+7}{(s+1)(s+3)}=\\dfrac{A}{s+1}+\\dfrac{B}{s+3}$", why: "each simple linear factor gets one constant numerator" },
        { do: "Clear denominators", result: "$5s+7=A(s+3)+B(s+1)$", why: "multiply by $(s+1)(s+3)$" },
        { do: "Substitute $s=-1$", result: "$2=2A$", why: "the $B$ term vanishes" },
        { do: "Solve for $A$", result: "$A=1$", why: "divide by 2" },
        { do: "Substitute $s=-3$", result: "$-8=-2B$", why: "the $A$ term vanishes" },
        { do: "Solve for $B$", result: "$B=4$", why: "divide by $-2$" },
        { do: "Invert each term", result: "$f(t)=e^{-t}+4e^{-3t}$", why: "$\\mathcal{L}^{-1}\\{1/(s+a)\\}=e^{-at}$" }
      ],
      verify: "Transforming back gives $1/(s+1)+4/(s+3)=((s+3)+4(s+1))/((s+1)(s+3))=(5s+7)/((s+1)(s+3))$.",
      answer: "$\\mathcal{L}^{-1}\\left\\{\\dfrac{5s+7}{(s+1)(s+3)}\\right\\}=e^{-t}+4e^{-3t}$.",
      connects: "Inverse transforms turn algebraic poles into time-domain modes."
    },
    practice: [
      { problem: "Find $\\mathcal{L}^{-1}\\{\\dfrac{6}{s+4}\\}$.", steps: [
        { do: "Match the denominator", result: "$s+4=s+a$ with $a=4$", why: "this is a basic exponential table form" },
        { do: "Match the numerator", result: "$6\\cdot\\dfrac{1}{s+4}$", why: "constant multiples pass through the inverse transform" },
        { do: "Apply the table", result: "$\\mathcal{L}^{-1}\\{1/(s+4)\\}=e^{-4t}$", why: "the shift $+4$ gives decay rate 4" },
        { do: "Multiply by 6", result: "$6e^{-4t}$", why: "linearity preserves the constant" }
      ], answer: "$6e^{-4t}$" },
      { problem: "Find $\\mathcal{L}^{-1}\\{\\dfrac{s}{s^2+9}\\}$.", steps: [
        { do: "Recognize the cosine form", result: "$\\dfrac{s}{s^2+a^2}$", why: "cosine keeps $s$ in the numerator" },
        { do: "Identify $a^2$", result: "$a^2=9$", why: "compare denominators" },
        { do: "Solve for $a$", result: "$a=3$", why: "frequency is positive" },
        { do: "Apply the table", result: "$\\cos(3t)$", why: "$\\mathcal{L}\\{\\cos at\\}=s/(s^2+a^2)$" }
      ], answer: "$\\cos(3t)$" },
      { problem: "Find $\\mathcal{L}^{-1}\\{\\dfrac{10}{s^2+25}\\}$.", steps: [
        { do: "Recognize the sine form", result: "$\\dfrac{a}{s^2+a^2}$", why: "sine has the frequency in the numerator" },
        { do: "Identify $a$ from the denominator", result: "$a=5$", why: "$25=5^2$" },
        { do: "Rewrite the numerator", result: "$\\dfrac{10}{s^2+25}=2\\dfrac{5}{s^2+25}$", why: "make the table numerator exactly 5" },
        { do: "Apply the table", result: "$2\\sin(5t)$", why: "linearity carries the factor 2" }
      ], answer: "$2\\sin(5t)$" },
      { problem: "Find $\\mathcal{L}^{-1}\\{\\dfrac{3}{(s+2)^2}\\}$.", steps: [
        { do: "Recall the shifted repeated-root form", result: "$\\mathcal{L}\\{te^{-at}\\}=\\dfrac{1}{(s+a)^2}$", why: "a repeated pole creates a factor of $t$" },
        { do: "Identify $a$", result: "$a=2$", why: "the denominator is $(s+2)^2$" },
        { do: "Apply the inverse table", result: "$te^{-2t}$", why: "remove the transform" },
        { do: "Multiply by the constant", result: "$3te^{-2t}$", why: "the numerator is 3" }
      ], answer: "$3te^{-2t}$" },
      { problem: "Find $\\mathcal{L}^{-1}\\{\\dfrac{2s+5}{s^2+4s+13}\\}$.", steps: [
        { do: "Complete the square", result: "$s^2+4s+13=(s+2)^2+9$", why: "shifted sine and cosine need this form" },
        { do: "Rewrite the numerator around $s+2$", result: "$2s+5=2(s+2)+1$", why: "cosine uses $s+2$ in the numerator" },
        { do: "Split the fraction", result: "$2\\dfrac{s+2}{(s+2)^2+9}+\\dfrac{1}{(s+2)^2+9}$", why: "linearity separates cosine and sine pieces" },
        { do: "Rewrite the sine numerator", result: "$\\dfrac{1}{(s+2)^2+9}=\\dfrac13\\dfrac{3}{(s+2)^2+9}$", why: "the sine table numerator must be 3" },
        { do: "Invert both shifted terms", result: "$2e^{-2t}\\cos(3t)+\\dfrac13 e^{-2t}\\sin(3t)$", why: "the shift $s+2$ multiplies by $e^{-2t}$" }
      ], answer: "$2e^{-2t}\\cos(3t)+\\dfrac13 e^{-2t}\\sin(3t)$" }
    ],
    applications: [
      { title: "Control-system impulse response", background: "Engineers identify a system by its transfer function, then invert it to see the actual time response after a short impulse.", numbers: "For $H(s)=4/(s+4)$, the impulse response is $h(t)=4e^{-4t}$. At $t=0.5$, $h(0.5)=4e^{-2}\\approx0.541$." },
      { title: "RC circuit discharge", background: "Circuit theory used Laplace tables long before digital simulation because capacitors naturally create first-order poles.", numbers: "With $F(s)=5/(s+2)$ volts, $v(t)=5e^{-2t}$. After $1$ second, $v(1)\\approx0.677$ volts." },
      { title: "Damped vibration modes", background: "Mechanical systems often reveal several decaying modes after partial fractions.", numbers: "If $X(s)=1/(s+1)+2/(s+5)$, then $x(t)=e^{-t}+2e^{-5t}$. At $t=1$, $x(1)\\approx0.368+0.013=0.381$." },
      { title: "Audio filter ringing", background: "Second-order filters produce sinusoids multiplied by exponentials, which is why filters can ring after a click.", numbers: "$F(s)=10/((s+1)^2+100)$ gives $f(t)=e^{-t}\\sin(10t)$. The envelope at $t=0.2$ is $e^{-0.2}\\approx0.819$." },
      { title: "Queue service times", background: "Laplace transforms of waiting-time distributions are inverted to recover probabilities in queueing theory.", numbers: "For exponential service transform $6/(s+6)$, the density is $6e^{-6t}$. At $t=0.1$, density is $6e^{-0.6}\\approx3.29$." },
      { title: "ML state-space layers", background: "Modern sequence models use continuous-time modes whose inverse transforms describe memory kernels.", numbers: "A pole at $-0.02$ gives kernel $e^{-0.02t}$. At $t=100$, the weight is $e^{-2}\\approx0.135$, so old tokens still contribute." }
    ],
    applicationsClose: "In every setting, inversion turns a pole or algebraic factor into a concrete signal over time.",
    takeaways: [
      "Inverse Laplace transforms translate $s$-domain expressions back to $t\\ge0$ functions.",
      "Partial fractions expose simple poles, repeated poles, and oscillatory pairs.",
      "Linearity lets you invert each table-sized term separately.",
      "Poles become time-domain modes such as decays, ramps times decays, and damped oscillations."
    ]
  },

  "math-03-29": {
    id: "math-03-29",
    title: "Solving IVPs with Laplace",
    tagline: "Laplace methods carry the initial conditions into algebra, so the constants are settled from the start.",
    connections: {
      buildsOn: ["The Laplace transform", "The inverse Laplace transform", "linear constant-coefficient ODEs"],
      leadsTo: ["transfer functions", "convolution forcing", "control and signal models"],
      usedWith: ["partial fractions", "initial conditions", "poles", "linear systems"]
    },
    motivation:
      `<p>You can solve many initial-value problems by guessing a homogeneous solution plus a particular solution. That is a good skill, but the constants can feel like bookkeeping.</p>` +
      `<p>Laplace methods make the bookkeeping automatic. Derivatives become algebraic expressions involving $Y(s)$ and the initial values, so the problem is solved in one lane: transform, solve for $Y$, invert.</p>`,
    definition:
      `<p>For a one-sided IVP, write $Y(s)=\\mathcal{L}\\{y(t)\\}$. The derivative rules are $\\mathcal{L}\\{y'\\}=sY-y(0)$ and $\\mathcal{L}\\{y''\\}=s^2Y-sy(0)-y'(0)$. Applying these rules to a linear constant-coefficient ODE turns the IVP into an equation for $Y(s)$.</p>` +
      `<p>The method is not magic: integration by parts moves differentiation from $y$ onto $e^{-st}$, and the boundary term at $t=0$ is exactly the initial condition. That is why the initial data appear during algebra rather than at the end.</p>` +
      `<p><b>Assumptions that matter:</b> the ODE is linear with coefficients that do not depend on $t$ for the clean table method; the input and solution should have Laplace transforms; discontinuous forcing is allowed when modeled with step or impulse transforms.</p>`,
    worked: {
      problem: "Solve $y''+3y'+2y=0$ with $y(0)=1$ and $y'(0)=0$.",
      skills: ["second-derivative transform", "solving for $Y$", "partial fractions"],
      strategy: "Transform the IVP so both initial conditions enter before inversion.",
      steps: [
        { do: "Apply the Laplace transform", result: "$\\mathcal{L}\\{y''\\}+3\\mathcal{L}\\{y'\\}+2Y=0$", why: "linearity transforms each term" },
        { do: "Replace $\\mathcal{L}\\{y''\\}$", result: "$s^2Y-sy(0)-y'(0)+3\\mathcal{L}\\{y'\\}+2Y=0$", why: "use the second-derivative rule" },
        { do: "Replace $\\mathcal{L}\\{y'\\}$", result: "$s^2Y-sy(0)-y'(0)+3(sY-y(0))+2Y=0$", why: "use the first-derivative rule" },
        { do: "Substitute the initial values", result: "$s^2Y-s+3sY-3+2Y=0$", why: "$y(0)=1$ and $y'(0)=0$" },
        { do: "Collect terms with $Y$", result: "$(s^2+3s+2)Y=s+3$", why: "move non-$Y$ terms to the other side" },
        { do: "Factor the denominator", result: "$Y=\\dfrac{s+3}{(s+1)(s+2)}$", why: "$s^2+3s+2=(s+1)(s+2)$" },
        { do: "Split into partial fractions", result: "$Y=\\dfrac{2}{s+1}-\\dfrac{1}{s+2}$", why: "cover-up or coefficient matching gives the constants" },
        { do: "Invert", result: "$y(t)=2e^{-t}-e^{-2t}$", why: "each simple pole becomes a decaying exponential" }
      ],
      verify: "$y(0)=2-1=1$ and $y'(0)=-2+2=0$; both initial conditions are satisfied.",
      answer: "$y(t)=2e^{-t}-e^{-2t}$.",
      connects: "Laplace solving turns initial-value dynamics into pole algebra."
    },
    practice: [
      { problem: "Solve $y'+4y=0$, $y(0)=3$.", steps: [
        { do: "Transform the equation", result: "$sY-y(0)+4Y=0$", why: "replace $y'$ by $sY-y(0)$" },
        { do: "Substitute $y(0)=3$", result: "$sY-3+4Y=0$", why: "include the initial value" },
        { do: "Collect $Y$ terms", result: "$(s+4)Y=3$", why: "move 3 to the right" },
        { do: "Solve for $Y$", result: "$Y=\\dfrac{3}{s+4}$", why: "divide by $s+4$" },
        { do: "Invert", result: "$y=3e^{-4t}$", why: "use the exponential table" }
      ], answer: "$y(t)=3e^{-4t}$" },
      { problem: "Solve $y'+2y=6$, $y(0)=1$.", steps: [
        { do: "Transform the equation", result: "$sY-y(0)+2Y=6/s$", why: "$\\mathcal{L}\\{6\\}=6/s$" },
        { do: "Substitute $y(0)=1$", result: "$sY-1+2Y=6/s$", why: "use the initial value" },
        { do: "Collect $Y$ terms", result: "$(s+2)Y=6/s+1$", why: "move $-1$ to the right" },
        { do: "Combine the right side", result: "$(s+2)Y=\\dfrac{s+6}{s}$", why: "use a common denominator" },
        { do: "Solve for $Y$", result: "$Y=\\dfrac{s+6}{s(s+2)}$", why: "divide by $s+2$" },
        { do: "Split fractions", result: "$Y=\\dfrac{3}{s}-\\dfrac{2}{s+2}$", why: "match inverse table entries" },
        { do: "Invert", result: "$y=3-2e^{-2t}$", why: "constant plus decaying transient" }
      ], answer: "$y(t)=3-2e^{-2t}$" },
      { problem: "Solve $y''+y=0$, $y(0)=0$, $y'(0)=2$.", steps: [
        { do: "Transform the ODE", result: "$s^2Y-sy(0)-y'(0)+Y=0$", why: "use the second-derivative rule" },
        { do: "Substitute initial values", result: "$s^2Y-2+Y=0$", why: "$y(0)=0$ and $y'(0)=2$" },
        { do: "Collect terms", result: "$(s^2+1)Y=2$", why: "move 2 to the right" },
        { do: "Solve for $Y$", result: "$Y=\\dfrac{2}{s^2+1}$", why: "divide by $s^2+1$" },
        { do: "Invert", result: "$y=2\\sin t$", why: "$\\mathcal{L}\\{\\sin t\\}=1/(s^2+1)$" }
      ], answer: "$y(t)=2\\sin t$" },
      { problem: "Solve $y''+4y=0$, $y(0)=3$, $y'(0)=0$.", steps: [
        { do: "Transform the ODE", result: "$s^2Y-3s+4Y=0$", why: "initial velocity is zero" },
        { do: "Collect $Y$ terms", result: "$(s^2+4)Y=3s$", why: "move $-3s$ to the right" },
        { do: "Solve for $Y$", result: "$Y=\\dfrac{3s}{s^2+4}$", why: "divide by $s^2+4$" },
        { do: "Identify the frequency", result: "$a=2$", why: "$s^2+4=s^2+2^2$" },
        { do: "Invert", result: "$y=3\\cos(2t)$", why: "cosine has numerator $s$" }
      ], answer: "$y(t)=3\\cos(2t)$" },
      { problem: "A model satisfies $x'+5x=10u(t)$, $x(0)=0$, where $u(t)=1$ for $t\\ge0$. Find $x(t)$.", steps: [
        { do: "Transform the equation", result: "$sX-x(0)+5X=10/s$", why: "the step input has transform $1/s$" },
        { do: "Substitute $x(0)=0$", result: "$(s+5)X=10/s$", why: "the initial state is zero" },
        { do: "Solve for $X$", result: "$X=\\dfrac{10}{s(s+5)}$", why: "divide by $s+5$" },
        { do: "Split fractions", result: "$X=\\dfrac{2}{s}-\\dfrac{2}{s+5}$", why: "prepare for inversion" },
        { do: "Invert", result: "$x(t)=2-2e^{-5t}$", why: "the state rises toward the steady value 2" }
      ], answer: "$x(t)=2(1-e^{-5t})$" }
    ],
    applications: [
      { title: "Mass-spring-damper response", background: "Mechanical vibration analysis uses IVPs because the starting position and velocity matter.", numbers: "For $y''+3y'+2y=0$, $y(0)=1$, $y'(0)=0$, the response is $2e^{-t}-e^{-2t}$; at $t=1$, $y\\approx0.600$." },
      { title: "Drug concentration with infusion", background: "Compartment models describe how medication accumulates and clears from blood.", numbers: "$c'+0.2c=10$, $c(0)=0$ gives $c=50(1-e^{-0.2t})$. At $t=5$ hours, $c\\approx31.6$." },
      { title: "Thermal warm-up", background: "Newton cooling models sensors and chips moving toward ambient temperature.", numbers: "$T'+0.1T=7$, $T(0)=20$ gives $T=70-50e^{-0.1t}$. At $t=10$, $T\\approx51.6$." },
      { title: "Control step response", background: "Control engineers measure how fast feedback drives a plant toward a command.", numbers: "$x'+8x=8$, $x(0)=0$ gives $x=1-e^{-8t}$. The 2 percent settling time is about $4/8=0.5$ seconds." },
      { title: "Training dynamics near a quadratic minimum", background: "Gradient flow near a one-dimensional quadratic is a linear IVP.", numbers: "$w'+0.5w=0$, $w(0)=4$ gives $w=4e^{-0.5t}$. At $t=6$, $w\\approx0.199$." },
      { title: "State-space memory kernel", background: "Continuous-time sequence layers solve linear IVPs to mix current input with decaying memory.", numbers: "$h'+0.01h=x(t)$ has a natural decay $e^{-0.01t}$; after $100$ steps the old state weight is $e^{-1}\\approx0.368$." }
    ],
    applicationsClose: "Laplace IVP solving gives one repeatable route from initial state and forcing to a time response.",
    takeaways: [
      "Derivative transform rules place initial conditions directly into the algebra.",
      "Solve for $Y(s)$, decompose it, then invert term by term.",
      "The denominator of $Y(s)$ reveals the poles and natural modes.",
      "Step responses, circuits, mechanics, and training dynamics all use the same IVP pattern."
    ]
  },

  "math-03-30": {
    id: "math-03-30",
    title: "Euler's method",
    tagline: "Euler's method follows a differential equation by repeatedly taking the slope it sees right now.",
    connections: {
      buildsOn: ["derivatives as slopes", "initial value problems", "linear approximation"],
      leadsTo: ["Runge–Kutta methods", "numerical stability", "simulation of dynamical systems"],
      usedWith: ["Taylor approximation", "error analysis", "finite differences", "stability regions"]
    },
    motivation:
      `<p>Some differential equations do not hand us a neat formula. But if we know the current point and the current slope, we can still take a small step.</p>` +
      `<p><b>Euler's method</b> is that humble step repeated. It is not fancy, and that is its gift: it makes numerical solution feel like walking along tangent lines.</p>`,
    definition:
      `<p>For an IVP $y'=f(t,y)$ with $y(t_0)=y_0$, choose a step size $h$. Euler's method updates $$t_{n+1}=t_n+h,\\qquad y_{n+1}=y_n+h f(t_n,y_n).$$ Here $f(t_n,y_n)$ is the slope at the current point, and $h f(t_n,y_n)$ is the tangent-line change.</p>` +
      `<p>The formula comes from the first-order Taylor approximation $y(t+h)\\approx y(t)+h y'(t)$. Euler replaces $y'(t)$ with the ODE's slope rule $f(t,y)$.</p>` +
      `<p><b>Assumptions that matter:</b> $f$ should be reasonably smooth near the path; smaller $h$ usually reduces error but costs more steps; explicit Euler can become unstable when slopes decay very fast, especially for stiff equations.</p>`,
    worked: {
      problem: "Use Euler's method with $h=0.5$ for $y'=y-t$, $y(0)=1$, to estimate $y(1)$.",
      skills: ["slope evaluation", "step updates", "IVP approximation"],
      strategy: "Take two tangent-line steps because $1/0.5=2$.",
      steps: [
        { do: "Record the starting point", result: "$t_0=0,\\ y_0=1$", why: "the IVP gives the initial state" },
        { do: "Compute the first slope", result: "$f(0,1)=1-0=1$", why: "substitute into $y-t$" },
        { do: "Update $y$ once", result: "$y_1=1+0.5\\cdot1=1.5$", why: "Euler adds $h$ times the slope" },
        { do: "Update time once", result: "$t_1=0.5$", why: "add the step size" },
        { do: "Compute the second slope", result: "$f(0.5,1.5)=1.5-0.5=1$", why: "use the new point" },
        { do: "Update $y$ again", result: "$y_2=1.5+0.5\\cdot1=2.0$", why: "take the second Euler step" },
        { do: "Update time again", result: "$t_2=1.0$", why: "two half-steps reach 1" }
      ],
      verify: "The slope stayed positive, so the estimate increasing from $1$ to $2$ is sensible.",
      answer: "Euler's method gives $y(1)\\approx2.0$.",
      connects: "Euler's method is tangent-line approximation repeated along an IVP."
    },
    practice: [
      { problem: "Use Euler with $h=0.25$ for $y'=2t$, $y(0)=1$, to estimate $y(0.5)$.", steps: [
        { do: "Set the start", result: "$t_0=0,\\ y_0=1$", why: "read the IVP" },
        { do: "Compute first slope", result: "$f(0,y_0)=0$", why: "$2t=0$ at $t=0$" },
        { do: "Update first step", result: "$y_1=1+0.25\\cdot0=1$", why: "Euler update" },
        { do: "Update time", result: "$t_1=0.25$", why: "add $h$" },
        { do: "Compute second slope", result: "$f(0.25,y_1)=0.5$", why: "$2\\cdot0.25=0.5$" },
        { do: "Update second step", result: "$y_2=1+0.25\\cdot0.5=1.125$", why: "reach $t=0.5$" }
      ], answer: "$y(0.5)\\approx1.125$" },
      { problem: "Use Euler with $h=0.1$ for $y'=-2y$, $y(0)=5$, to estimate $y(0.2)$.", steps: [
        { do: "Compute first slope", result: "$f(0,5)=-10$", why: "substitute $y=5$" },
        { do: "Update $y$", result: "$y_1=5+0.1(-10)=4$", why: "first Euler step" },
        { do: "Update time", result: "$t_1=0.1$", why: "add the step size" },
        { do: "Compute second slope", result: "$f(0.1,4)=-8$", why: "use the new $y$" },
        { do: "Update $y$ again", result: "$y_2=4+0.1(-8)=3.2$", why: "second Euler step" }
      ], answer: "$y(0.2)\\approx3.2$" },
      { problem: "Use Euler with $h=1$ for $y'=t+y$, $y(0)=0$, to estimate $y(2)$.", steps: [
        { do: "Start the method", result: "$t_0=0,\\ y_0=0$", why: "initial condition" },
        { do: "Compute first slope", result: "$f(0,0)=0$", why: "$t+y=0$" },
        { do: "Update first step", result: "$y_1=0+1\\cdot0=0$", why: "Euler update" },
        { do: "Update time", result: "$t_1=1$", why: "step size is 1" },
        { do: "Compute second slope", result: "$f(1,0)=1$", why: "use the point $(1,0)$" },
        { do: "Update second step", result: "$y_2=0+1\\cdot1=1$", why: "reach $t=2$" }
      ], answer: "$y(2)\\approx1$" },
      { problem: "For $y'=1-y$, $y(0)=0$, take three Euler steps with $h=0.5$.", steps: [
        { do: "Compute first slope", result: "$1-0=1$", why: "start at $y_0=0$" },
        { do: "Update to $y_1$", result: "$y_1=0+0.5\\cdot1=0.5$", why: "first step" },
        { do: "Compute second slope", result: "$1-0.5=0.5$", why: "use $y_1$" },
        { do: "Update to $y_2$", result: "$y_2=0.5+0.5\\cdot0.5=0.75$", why: "second step" },
        { do: "Compute third slope", result: "$1-0.75=0.25$", why: "use $y_2$" },
        { do: "Update to $y_3$", result: "$y_3=0.75+0.5\\cdot0.25=0.875$", why: "third step" }
      ], answer: "After three steps, $y(1.5)\\approx0.875$." },
      { problem: "A gradient flow has $w'=-3w$, $w(0)=2$. Use Euler with $h=0.2$ for two steps.", steps: [
        { do: "Compute first slope", result: "$-3\\cdot2=-6$", why: "the parameter starts at 2" },
        { do: "Update $w$", result: "$w_1=2+0.2(-6)=0.8$", why: "one explicit Euler step" },
        { do: "Compute second slope", result: "$-3\\cdot0.8=-2.4$", why: "use the updated parameter" },
        { do: "Update $w$ again", result: "$w_2=0.8+0.2(-2.4)=0.32$", why: "second step" },
        { do: "Read the time", result: "$t=0.4$", why: "two steps of size 0.2" }
      ], answer: "$w(0.4)\\approx0.32$" }
    ],
    applications: [
      { title: "Simulating population growth", background: "Numerical ODE methods let ecologists simulate models before closed forms are available.", numbers: "For $p'=0.1p$, $p_0=1000$, $h=1$, Euler gives $p_1=1100$ and $p_2=1210$." },
      { title: "Gradient descent as Euler", background: "Gradient descent is explicit Euler applied to gradient flow $w'=-\\nabla L(w)$.", numbers: "For $L(w)=w^2$, $w'=-2w$. With $w_0=5$ and $h=0.1$, $w_1=5+0.1(-10)=4$." },
      { title: "Physics game motion", background: "Games often update velocity and position in small time steps for speed.", numbers: "With acceleration $a=-9.8$, $v_0=20$, $h=0.1$, Euler gives $v_1=20-0.98=19.02$ m/s." },
      { title: "Epidemic SIR prototype", background: "Early outbreak models are often tested with simple time stepping before fitting data.", numbers: "If $S'= -0.0002SI$, $S=990$, $I=10$, and $h=1$, then $S_1=990-1.98=988.02$." },
      { title: "Battery-state estimation", background: "Embedded systems integrate current over time to estimate charge.", numbers: "If charge rate is $q'=-0.3$ amp-hours per hour and $h=0.5$, then $q$ changes by $-0.15$ amp-hours in one step." },
      { title: "Neural ODE baseline solver", background: "Before adaptive solvers, explicit Euler is the simplest way to test a neural ODE vector field.", numbers: "For hidden state $h'=0.4h$, $h_0=2$, step $0.25$ gives $h_1=2+0.25(0.8)=2.2$." }
    ],
    applicationsClose: "Euler's method is a small tangent-line idea that appears anywhere a changing state is simulated in steps.",
    takeaways: [
      "Euler updates by $y_{n+1}=y_n+h f(t_n,y_n)$.",
      "It comes from the first-order Taylor approximation.",
      "Smaller steps usually help accuracy but increase computation.",
      "Stiff or fast-decaying systems can make explicit Euler unstable."
    ]
  },

  "math-03-31": {
    id: "math-03-31",
    title: "Runge–Kutta methods",
    tagline: "Runge–Kutta methods improve on Euler by sampling several slopes before committing to a step.",
    connections: {
      buildsOn: ["Euler's method", "Taylor approximation", "initial value problems"],
      leadsTo: ["adaptive ODE solvers", "Neural ODEs", "stability analysis"],
      usedWith: ["local truncation error", "weighted averages", "numerical integration", "stability regions"]
    },
    motivation:
      `<p>Euler's method is brave but impatient: it looks at the slope at the left edge and trusts it for the whole step. Curves rarely behave that politely.</p>` +
      `<p><b>Runge–Kutta methods</b> slow down just enough to ask for more slope information. They combine slopes inside the interval, so one step can be much more accurate without solving the ODE exactly.</p>`,
    definition:
      `<p>For $y'=f(t,y)$, a Runge–Kutta method computes several trial slopes $k_i$ and uses a weighted average. The classical fourth-order method is $$k_1=f(t_n,y_n),$$ $$k_2=f(t_n+h/2,y_n+hk_1/2),$$ $$k_3=f(t_n+h/2,y_n+hk_2/2),$$ $$k_4=f(t_n+h,y_n+hk_3),$$ and $$y_{n+1}=y_n+\\dfrac{h}{6}(k_1+2k_2+2k_3+k_4).$$</p>` +
      `<p>The weights are chosen so the Taylor expansion matches the true solution through fourth order. Midpoint and Heun methods are simpler second-order relatives that use two slopes.</p>` +
      `<p><b>Assumptions that matter:</b> the vector field should be smooth enough for the order claim; larger steps still can be unstable; adaptive solvers estimate error by comparing two Runge–Kutta formulas of different orders.</p>`,
    worked: {
      problem: "Use classical RK4 with $h=0.5$ for $y'=y$, $y(0)=1$, to estimate $y(0.5)$.",
      skills: ["RK4 slopes", "weighted averages", "exponential growth"],
      strategy: "Sample slopes at the start, two midpoints, and the end, then take the RK4 weighted average.",
      steps: [
        { do: "Compute $k_1$", result: "$k_1=f(0,1)=1$", why: "use the starting point" },
        { do: "Compute the first midpoint state", result: "$1+0.5\\cdot1/2=1.25$", why: "use $hk_1/2$" },
        { do: "Compute $k_2$", result: "$k_2=f(0.25,1.25)=1.25$", why: "the ODE is $y'=y$" },
        { do: "Compute the second midpoint state", result: "$1+0.5\\cdot1.25/2=1.3125$", why: "use $hk_2/2$" },
        { do: "Compute $k_3$", result: "$k_3=1.3125$", why: "evaluate at the second midpoint" },
        { do: "Compute the endpoint trial state", result: "$1+0.5\\cdot1.3125=1.65625$", why: "use $hk_3$" },
        { do: "Compute $k_4$", result: "$k_4=1.65625$", why: "evaluate at the endpoint trial state" },
        { do: "Apply the RK4 update", result: "$y_1=1+\\dfrac{0.5}{6}(1+2(1.25)+2(1.3125)+1.65625)=1.6484375$", why: "weighted average of four slopes" }
      ],
      verify: "The exact value is $e^{0.5}\\approx1.64872$, so the one-step RK4 estimate is very close.",
      answer: "$y(0.5)\\approx1.6484375$.",
      connects: "Runge–Kutta accuracy comes from better slope averaging, not from knowing the exact solution."
    },
    practice: [
      { problem: "Use the midpoint method with $h=1$ for $y'=t+y$, $y(0)=1$, one step.", steps: [
        { do: "Compute the starting slope", result: "$k_1=f(0,1)=1$", why: "substitute into $t+y$" },
        { do: "Compute midpoint time", result: "$0+1/2=0.5$", why: "midpoint method samples halfway" },
        { do: "Compute midpoint state", result: "$1+1\\cdot1/2=1.5$", why: "take half a step using $k_1$" },
        { do: "Compute midpoint slope", result: "$k_2=f(0.5,1.5)=2.0$", why: "evaluate at the midpoint" },
        { do: "Update", result: "$y_1=1+1\\cdot2=3$", why: "midpoint uses $k_2$ for the full step" }
      ], answer: "$y(1)\\approx3$" },
      { problem: "Use Heun's method with $h=0.5$ for $y'=-y$, $y(0)=2$, one step.", steps: [
        { do: "Compute the starting slope", result: "$k_1=-2$", why: "use $y_0=2$" },
        { do: "Predict an Euler endpoint", result: "$y_E=2+0.5(-2)=1$", why: "Heun first predicts" },
        { do: "Compute endpoint slope", result: "$k_2=-1$", why: "evaluate at $y_E=1$" },
        { do: "Average the slopes", result: "$(k_1+k_2)/2=-1.5$", why: "Heun uses trapezoid averaging" },
        { do: "Update", result: "$y_1=2+0.5(-1.5)=1.25$", why: "apply the averaged slope" }
      ], answer: "$y(0.5)\\approx1.25$" },
      { problem: "Use RK4 with $h=1$ for $y'=t$, $y(0)=0$, one step.", steps: [
        { do: "Compute $k_1$", result: "$k_1=0$", why: "at $t=0$" },
        { do: "Compute $k_2$", result: "$k_2=0.5$", why: "midpoint time is $0.5$" },
        { do: "Compute $k_3$", result: "$k_3=0.5$", why: "same midpoint time" },
        { do: "Compute $k_4$", result: "$k_4=1$", why: "endpoint time is $1$" },
        { do: "Update", result: "$y_1=0+\\dfrac16(0+2(0.5)+2(0.5)+1)=0.5$", why: "weighted average integrates a line exactly" }
      ], answer: "$y(1)\\approx0.5$" },
      { problem: "For $y'=2y$, $y(0)=1$, use RK4 with $h=0.25$ for one step.", steps: [
        { do: "Compute $k_1$", result: "$2$", why: "$2y$ at $y=1$" },
        { do: "Compute $k_2$ state", result: "$1+0.25\\cdot2/2=1.25$", why: "first midpoint" },
        { do: "Compute $k_2$", result: "$2.5$", why: "$2\\cdot1.25=2.5$" },
        { do: "Compute $k_3$ state", result: "$1+0.25\\cdot2.5/2=1.3125$", why: "second midpoint" },
        { do: "Compute $k_3$", result: "$2.625$", why: "$2\\cdot1.3125=2.625$" },
        { do: "Compute $k_4$ state", result: "$1+0.25\\cdot2.625=1.65625$", why: "endpoint trial" },
        { do: "Compute $k_4$", result: "$3.3125$", why: "$2\\cdot1.65625=3.3125$" },
        { do: "Update", result: "$y_1=1+\\dfrac{0.25}{6}(2+2(2.5)+2(2.625)+3.3125)=1.6484375$", why: "apply RK4 weights" }
      ], answer: "$y(0.25)\\approx1.6484375$" },
      { problem: "An adaptive solver compares one RK4 step estimate $1.64844$ with two half-step estimate $1.64870$. Estimate the local error.", steps: [
        { do: "Write the two estimates", result: "$a=1.64844,\\ b=1.64870$", why: "adaptive methods compare paired estimates" },
        { do: "Subtract", result: "$b-a=0.00026$", why: "difference estimates numerical error" },
        { do: "Take absolute value", result: "$0.00026$", why: "error size is nonnegative" },
        { do: "Compare with tolerance $0.001$", result: "$0.00026<0.001$", why: "the step is accurate enough for that tolerance" }
      ], answer: "Estimated error is about $2.6\\cdot10^{-4}$, below $0.001$." }
    ],
    applications: [
      { title: "Scientific simulation", background: "Runge and Kutta developed these methods around 1900 to compute trajectories without closed forms.", numbers: "For $y'=y$, one RK4 step with $h=0.5$ gives $1.64844$ versus exact $1.64872$, error about $0.00028$." },
      { title: "Robot motion planning", background: "Robots integrate velocity commands to predict future positions.", numbers: "If $x'=v=1.2$ m/s for $h=0.1$, every RK method gives $x$ change $0.12$ m for that constant velocity." },
      { title: "Weather-model time stepping", background: "Atmospheric models use multi-stage solvers because one slope over a large grid cell is not enough.", numbers: "A temperature tendency of $-0.3$, $-0.4$, $-0.5$, $-0.6$ K/hour in RK4 over $h=1$ changes temperature by $(1/6)(-0.3-0.8-1.0-0.6)=-0.45$ K." },
      { title: "Neural ODE training", background: "Neural ODEs rely on black-box ODE solvers, many of which are adaptive Runge–Kutta methods.", numbers: "If an adaptive solver takes 32 function evaluations and each vector-field call costs 2 ms, the forward solve costs about 64 ms." },
      { title: "Computer graphics particles", background: "Particle systems integrate forces frame by frame; RK methods reduce drift compared with Euler.", numbers: "At 60 frames per second, $h=1/60\\approx0.0167$. A velocity slope of $9$ units/s changes velocity by about $0.150$ per frame." },
      { title: "Pharmacokinetic simulation", background: "Drug models with several compartments are often solved numerically rather than by hand.", numbers: "If concentration slopes sampled by RK4 are $-2.0,-1.8,-1.7,-1.5$ mg/L/hour and $h=0.25$, the change is $0.25(-10.5/6)=-0.4375$ mg/L." }
    ],
    applicationsClose: "Runge–Kutta methods reuse the same idea everywhere: spend extra slope evaluations to buy a more trustworthy step.",
    takeaways: [
      "Runge–Kutta methods combine multiple slope samples in one step.",
      "RK4 uses weights $1,2,2,1$ and has fourth-order local accuracy under smoothness assumptions.",
      "Second-order methods such as midpoint and Heun already improve on Euler.",
      "Adaptive ODE solvers estimate error by comparing formulas or step sizes."
    ]
  },

  "math-03-32": {
    id: "math-03-32",
    title: "Boundary value problems",
    tagline: "A boundary value problem asks for a whole curve that satisfies conditions at more than one place.",
    connections: {
      buildsOn: ["second-order ODEs", "linear systems", "numerical methods"],
      leadsTo: ["Sturm–Liouville theory", "finite element methods", "eigenvalue problems"],
      usedWith: ["finite differences", "shooting methods", "linear algebra", "Green's functions"]
    },
    motivation:
      `<p>An initial-value problem starts at one time and marches forward. But many physical shapes are pinned at two ends: a heated rod has temperatures at both ends, and a string is fixed at both endpoints.</p>` +
      `<p>A <b>boundary value problem</b> asks for the curve that fits conditions at separate locations. Instead of marching with known initial data, we must satisfy a global constraint.</p>`,
    definition:
      `<p>A typical second-order boundary value problem is $y''=f(x,y,y')$ on $a\\le x\\le b$ with boundary conditions such as $y(a)=\\alpha$ and $y(b)=\\beta$. The unknown is the entire function $y(x)$, not just a final value.</p>` +
      `<p>Finite differences replace derivatives with grid formulas. For equally spaced grid points, $y''(x_i)\\approx(y_{i-1}-2y_i+y_{i+1})/h^2$. This turns a differential equation plus boundary values into algebraic equations for interior unknowns.</p>` +
      `<p><b>Assumptions that matter:</b> boundary conditions must be enough and compatible; nonlinear BVPs may have multiple solutions or none; finite-difference accuracy depends on smoothness and grid spacing.</p>`,
    worked: {
      problem: "Solve $y''=2$ on $0\\le x\\le1$ with $y(0)=0$ and $y(1)=3$.",
      skills: ["integrating twice", "boundary conditions", "constants"],
      strategy: "Integrate the differential equation, then use the two boundary values to determine both constants.",
      steps: [
        { do: "Integrate $y''=2$ once", result: "$y'=2x+C_1$", why: "antiderivative with respect to $x$" },
        { do: "Integrate again", result: "$y=x^2+C_1x+C_2$", why: "a second-order equation needs two constants" },
        { do: "Apply $y(0)=0$", result: "$C_2=0$", why: "substitute $x=0$" },
        { do: "Apply $y(1)=3$", result: "$1+C_1+0=3$", why: "substitute $x=1$" },
        { do: "Solve for $C_1$", result: "$C_1=2$", why: "subtract 1" },
        { do: "Write the solution", result: "$y=x^2+2x$", why: "insert both constants" }
      ],
      verify: "$y''=2$, $y(0)=0$, and $y(1)=1+2=3$, so the curve satisfies the equation and both boundaries.",
      answer: "$y(x)=x^2+2x$.",
      connects: "Boundary conditions determine the constants from two places, not from one starting point."
    },
    practice: [
      { problem: "Solve $y''=0$, $y(0)=2$, $y(4)=10$.", steps: [
        { do: "Integrate once", result: "$y'=C_1$", why: "zero acceleration means constant slope" },
        { do: "Integrate again", result: "$y=C_1x+C_2$", why: "the solution is linear" },
        { do: "Apply $y(0)=2$", result: "$C_2=2$", why: "substitute the left boundary" },
        { do: "Apply $y(4)=10$", result: "$4C_1+2=10$", why: "substitute the right boundary" },
        { do: "Solve for $C_1$", result: "$C_1=2$", why: "subtract 2 and divide by 4" }
      ], answer: "$y=2x+2$" },
      { problem: "Solve $y''=-4$, $y(0)=0$, $y(2)=0$.", steps: [
        { do: "Integrate once", result: "$y'=-4x+C_1$", why: "antiderivative of $-4$" },
        { do: "Integrate again", result: "$y=-2x^2+C_1x+C_2$", why: "integrate term by term" },
        { do: "Apply $y(0)=0$", result: "$C_2=0$", why: "left boundary" },
        { do: "Apply $y(2)=0$", result: "$-8+2C_1=0$", why: "right boundary" },
        { do: "Solve for $C_1$", result: "$C_1=4$", why: "move 8 and divide by 2" }
      ], answer: "$y=-2x^2+4x$" },
      { problem: "Use one interior grid point at $x=0.5$ to approximate $y''=-2$, $y(0)=0$, $y(1)=0$.", steps: [
        { do: "Set the grid spacing", result: "$h=0.5$", why: "the interior point is halfway" },
        { do: "Write the finite-difference equation", result: "$\\dfrac{y_0-2y_1+y_2}{h^2}=-2$", why: "approximate the second derivative" },
        { do: "Substitute boundary values", result: "$\\dfrac{0-2y_1+0}{0.25}=-2$", why: "$y_0=y_2=0$" },
        { do: "Multiply by $0.25$", result: "$-2y_1=-0.5$", why: "clear the denominator" },
        { do: "Solve", result: "$y_1=0.25$", why: "divide by $-2$" }
      ], answer: "$y(0.5)\\approx0.25$" },
      { problem: "For $y''=y$, $y(0)=1$, $y(1)=e$, check that $y=e^x$ solves the BVP.", steps: [
        { do: "Differentiate once", result: "$y'=e^x$", why: "derivative of $e^x$ is itself" },
        { do: "Differentiate twice", result: "$y''=e^x$", why: "differentiate again" },
        { do: "Compare with $y$", result: "$y''=y$", why: "both equal $e^x$" },
        { do: "Check the left boundary", result: "$y(0)=e^0=1$", why: "substitute 0" },
        { do: "Check the right boundary", result: "$y(1)=e$", why: "substitute 1" }
      ], answer: "$y=e^x$ satisfies the BVP." },
      { problem: "A finite-difference ML smoother minimizes curvature with $y(0)=1$ and $y(2)=5$. With $y''=0$, find $y(1)$.", steps: [
        { do: "Recognize the equation", result: "$y''=0$", why: "minimum curvature gives a straight line" },
        { do: "Write the linear form", result: "$y=ax+b$", why: "solutions of $y''=0$ are linear" },
        { do: "Apply $y(0)=1$", result: "$b=1$", why: "left boundary" },
        { do: "Apply $y(2)=5$", result: "$2a+1=5$", why: "right boundary" },
        { do: "Solve for $a$", result: "$a=2$", why: "subtract 1 and divide by 2" },
        { do: "Evaluate at $x=1$", result: "$y(1)=2\\cdot1+1=3$", why: "middle value on the straight line" }
      ], answer: "$y(1)=3$" }
    ],
    applications: [
      { title: "Heat in a rod", background: "Fourier's heat theory led to boundary problems because endpoint temperatures constrain the whole rod.", numbers: "If $T''=0$, $T(0)=20$, $T(1)=80$, then $T(x)=20+60x$ and $T(0.25)=35$ degrees." },
      { title: "Bridge cable sag", background: "A hanging cable shape is determined by supports at both ends and load along the span.", numbers: "For simplified $y''=0.02$, $y(0)=0$, $y(100)=0$, the midpoint solution is $y(50)=-25$ after solving constants." },
      { title: "Electrostatic potential", background: "Voltage in a charge-free region satisfies a boundary problem; electrodes set boundary values.", numbers: "In one dimension with $V''=0$, $V(0)=0$, $V(10)=5$, the potential at $x=4$ is $2$ volts." },
      { title: "Image inpainting", background: "Classical image repair fills missing pixels by solving equations constrained by known boundary pixels.", numbers: "If missing values lie between boundary intensities $40$ and $100$ over 3 equal gaps, the linear fill gives $60$ and $80$." },
      { title: "Finite element simulation", background: "Engineering meshes convert boundary-value physics into large sparse linear systems.", numbers: "With 1000 interior nodes in a 1D mesh, the second-derivative matrix has about $3\\cdot1000-2=2998$ nonzero entries." },
      { title: "Constrained trajectory planning", background: "Robotics plans paths that begin and end at prescribed states.", numbers: "A straight path from $x(0)=2$ to $x(5)=12$ has constant velocity $(12-2)/5=2$ units/s and midpoint $x(2.5)=7$." }
    ],
    applicationsClose: "Boundary value thinking turns local differential laws plus endpoint facts into a whole compatible shape.",
    takeaways: [
      "BVPs impose conditions at two or more locations rather than only at an initial point.",
      "Second-order BVPs often use two boundary conditions to determine two constants.",
      "Finite differences turn BVPs into algebraic systems for grid values.",
      "Heat, structures, fields, images, and paths all use boundary constraints."
    ]
  },

  "math-03-33": {
    id: "math-03-33",
    title: "Sturm–Liouville theory",
    tagline: "Sturm–Liouville theory explains why many boundary-value problems have natural orthogonal modes.",
    connections: {
      buildsOn: ["Boundary value problems", "eigenvalues and eigenvectors", "inner products"],
      leadsTo: ["Fourier series", "PDE separation of variables", "spectral methods"],
      usedWith: ["orthogonality", "self-adjoint operators", "weighted inner products", "eigenfunction expansions"]
    },
    motivation:
      `<p>Linear algebra taught you to decompose vectors into eigenvectors. Boundary-value problems have a similar gift: many functions decompose into eigenfunctions.</p>` +
      `<p><b>Sturm–Liouville theory</b> is the framework that makes those modes trustworthy. It tells us when eigenvalues are real, modes are orthogonal, and complicated signals can be built from simple shapes.</p>`,
    definition:
      `<p>A regular Sturm–Liouville problem has the form $$-(p(x)y')'+q(x)y=\\lambda w(x)y$$ on $a\\le x\\le b$, with boundary conditions that make the operator self-adjoint. Here $p(x)>0$ controls derivative energy, $q(x)$ is a potential term, $w(x)>0$ is a weight, and $\\lambda$ is an eigenvalue.</p>` +
      `<p>The key orthogonality comes from self-adjointness. If $y_m$ and $y_n$ solve the problem with different eigenvalues, subtracting the two integrated equations gives $(\\lambda_m-\\lambda_n)\\int_a^b w(x)y_m(x)y_n(x)\\,dx=0$, so the weighted inner product must be zero.</p>` +
      `<p><b>Assumptions that matter:</b> coefficients must be regular enough, $p$ and $w$ stay positive, and the boundary conditions must cancel boundary terms. Singular endpoints need extra care.</p>`,
    worked: {
      problem: "Find eigenvalues and eigenfunctions for $-y''=\\lambda y$ on $0<x<\\pi$, with $y(0)=0$ and $y(\\pi)=0$.",
      skills: ["eigenvalue cases", "boundary conditions", "sine modes"],
      strategy: "Positive eigenvalues give sine and cosine; the boundaries choose the allowed frequencies.",
      steps: [
        { do: "Assume $\\lambda=\\mu^2>0$", result: "$-y''=\\mu^2y$", why: "nonzero fixed-end modes are oscillatory" },
        { do: "Write the general solution", result: "$y=A\\cos(\\mu x)+B\\sin(\\mu x)$", why: "solutions of $y''+\\mu^2y=0$" },
        { do: "Apply $y(0)=0$", result: "$A=0$", why: "$\\cos0=1$ and $\\sin0=0$" },
        { do: "Apply $y(\\pi)=0$", result: "$B\\sin(\\mu\\pi)=0$", why: "the right endpoint must vanish" },
        { do: "Require a nonzero mode", result: "$\\sin(\\mu\\pi)=0$", why: "$B=0$ would give the trivial solution" },
        { do: "Solve for allowed frequencies", result: "$\\mu=n$ for $n=1,2,3,\\ldots$", why: "sine is zero at integer multiples of $\\pi$" },
        { do: "Convert to eigenvalues", result: "$\\lambda_n=n^2$", why: "$\\lambda=\\mu^2$" },
        { do: "Write eigenfunctions", result: "$y_n(x)=\\sin(nx)$", why: "$B$ only sets scale" }
      ],
      verify: "$-\\dfrac{d^2}{dx^2}\\sin(nx)=n^2\\sin(nx)$ and the sine modes vanish at $0$ and $\\pi$.",
      answer: "$\\lambda_n=n^2$ with eigenfunctions $y_n(x)=\\sin(nx)$ for $n=1,2,3,\\ldots$.",
      connects: "The boundary conditions quantize the allowable frequencies."
    },
    practice: [
      { problem: "For $-y''=\\lambda y$ on $0<x<1$, $y(0)=y(1)=0$, find $\\lambda_n$.", steps: [
        { do: "Set $\\lambda=\\mu^2$", result: "$y=A\\cos(\\mu x)+B\\sin(\\mu x)$", why: "positive eigenvalues give oscillations" },
        { do: "Apply $y(0)=0$", result: "$A=0$", why: "left boundary" },
        { do: "Apply $y(1)=0$", result: "$B\\sin\\mu=0$", why: "right boundary" },
        { do: "Keep nontrivial modes", result: "$\\sin\\mu=0$", why: "$B$ cannot be zero" },
        { do: "Solve frequencies", result: "$\\mu=n\\pi$", why: "zeros of sine" },
        { do: "Square frequencies", result: "$\\lambda_n=n^2\\pi^2$", why: "$\\lambda=\\mu^2$" }
      ], answer: "$\\lambda_n=n^2\\pi^2$, $y_n=\\sin(n\\pi x)$." },
      { problem: "Show $\\sin x$ and $\\sin 2x$ are orthogonal on $[0,\\pi]$.", steps: [
        { do: "Write the inner product", result: "$\\int_0^\\pi \\sin x\\sin 2x\\,dx$", why: "orthogonality means this equals zero" },
        { do: "Use product-to-sum", result: "$\\sin x\\sin2x=\\dfrac12(\\cos x-\\cos3x)$", why: "convert the product to integrable terms" },
        { do: "Integrate", result: "$\\dfrac12[\\sin x-\\dfrac13\\sin3x]_0^\\pi$", why: "antiderivatives of cosines" },
        { do: "Evaluate endpoints", result: "$0$", why: "all sine endpoint values are zero" }
      ], answer: "The inner product is $0$, so the functions are orthogonal." },
      { problem: "Normalize $\\sin x$ on $[0,\\pi]$ with weight $w=1$.", steps: [
        { do: "Compute the squared norm", result: "$\\int_0^\\pi \\sin^2 x\\,dx$", why: "normalization divides by the norm" },
        { do: "Use the identity", result: "$\\sin^2x=(1-\\cos2x)/2$", why: "easier to integrate" },
        { do: "Integrate", result: "$[x/2-\\sin2x/4]_0^\\pi$", why: "antiderivative term by term" },
        { do: "Evaluate", result: "$\\pi/2$", why: "the sine terms vanish" },
        { do: "Divide by the norm", result: "$\\sqrt{2/\\pi}\\sin x$", why: "norm is $\\sqrt{\\pi/2}$" }
      ], answer: "The normalized function is $\\sqrt{2/\\pi}\\sin x$." },
      { problem: "For $-y''=\\lambda y$, $y'(0)=0$, $y'(\\pi)=0$, find the first three eigenfunctions.", steps: [
        { do: "Write the oscillatory solution", result: "$y=A\\cos(\\mu x)+B\\sin(\\mu x)$", why: "use $\\lambda=\\mu^2$" },
        { do: "Differentiate", result: "$y'=-A\\mu\\sin(\\mu x)+B\\mu\\cos(\\mu x)$", why: "boundary conditions use derivatives" },
        { do: "Apply $y'(0)=0$", result: "$B\\mu=0$", why: "cosine at 0 is 1" },
        { do: "Set $B=0$", result: "$y=A\\cos(\\mu x)$", why: "for nonzero frequencies" },
        { do: "Apply $y'(\\pi)=0$", result: "$-A\\mu\\sin(\\mu\\pi)=0$", why: "right derivative boundary" },
        { do: "Choose allowed frequencies", result: "$\\mu=0,1,2,\\ldots$", why: "Neumann conditions include the constant mode" }
      ], answer: "The first three eigenfunctions are $1$, $\\cos x$, and $\\cos 2x$." },
      { problem: "Project $f(x)=x$ onto $\\sin x$ on $[0,\\pi]$ using coefficient $b_1=\\dfrac{2}{\\pi}\\int_0^\\pi x\\sin x\\,dx$.", steps: [
        { do: "Set up integration by parts", result: "$u=x,\\ dv=\\sin x\\,dx$", why: "the integrand is a product" },
        { do: "Find $du$ and $v$", result: "$du=dx,\\ v=-\\cos x$", why: "differentiate $x$ and integrate sine" },
        { do: "Apply integration by parts", result: "$[-x\\cos x]_0^\\pi+\\int_0^\\pi \\cos x\\,dx$", why: "$\\int u\\,dv=uv-\\int v\\,du$" },
        { do: "Evaluate the boundary term", result: "$\\pi$", why: "$-\\pi\\cos\\pi=\\pi$" },
        { do: "Evaluate the remaining integral", result: "$0$", why: "$\\sin\\pi-\\sin0=0$" },
        { do: "Multiply by $2/\\pi$", result: "$b_1=2$", why: "use the coefficient formula" }
      ], answer: "The first sine coefficient is $b_1=2$." }
    ],
    applications: [
      { title: "Fourier sine series", background: "Fourier used heat flow to discover that functions can be expanded in boundary-compatible modes.", numbers: "For $f(x)=x$ on $[0,\\pi]$, the first sine coefficient is $2$, so the first approximation is $2\\sin x$." },
      { title: "Vibrating string", background: "A fixed string vibrates in modes whose frequencies are set by boundary conditions.", numbers: "For length $L=1$ and wave speed $c=100$ m/s, mode $n=3$ has frequency $3c/(2L)=150$ Hz." },
      { title: "Heat equation decay", background: "Separation of variables turns heat diffusion into decaying Sturm–Liouville modes.", numbers: "On $[0,1]$, mode $n=2$ decays like $e^{-4\\pi^2\\kappa t}$. With $\\kappa=0.01$, at $t=10$ the factor is $e^{-3.948}\\approx0.019$." },
      { title: "Quantum particle in a box", background: "The Schrödinger equation in a box has exactly the sine eigenfunctions of a fixed-end BVP.", numbers: "Energy levels scale like $n^2$; if $E_1=0.5$ eV, then $E_3=9E_1=4.5$ eV." },
      { title: "Spectral graph learning", background: "Graph Laplacian eigenvectors are the discrete relatives of Sturm–Liouville modes and support smoothing on networks.", numbers: "A graph signal coefficient along eigenvalue $\\lambda=4$ under heat smoothing $e^{-0.2\\lambda}$ is multiplied by $e^{-0.8}\\approx0.449$." },
      { title: "PDE neural operators", background: "Neural operators often learn mappings between functions represented in spectral bases.", numbers: "Keeping 16 Fourier modes for each of 64 channels stores $16\\cdot64=1024$ spectral coefficients per layer." }
    ],
    applicationsClose: "Sturm–Liouville theory is the bridge from boundary constraints to orthogonal coordinates for functions.",
    takeaways: [
      "Sturm–Liouville problems are self-adjoint eigenvalue problems for differential operators.",
      "Different eigenvalues produce weighted-orthogonal eigenfunctions.",
      "Boundary conditions quantize the allowed modes.",
      "Fourier series, heat flow, quantum boxes, and spectral ML all rely on modal decompositions."
    ]
  },

  "math-03-34": {
    id: "math-03-34",
    title: "Neural ODEs",
    tagline: "A Neural ODE replaces a stack of discrete layers with a learned continuous-time flow.",
    connections: {
      buildsOn: ["Runge–Kutta methods", "initial value problems", "gradients and chain rule"],
      leadsTo: ["continuous normalizing flows", "diffusion models", "adjoint sensitivity methods"],
      usedWith: ["ODE solvers", "Jacobian matrices", "stability", "optimization"]
    },
    motivation:
      `<p>A residual network updates a hidden state by adding a learned change: $h_{k+1}=h_k+F(h_k)$. That already looks like Euler's method.</p>` +
      `<p>A <b>Neural ODE</b> takes the limit seriously. It learns the vector field $f_\\theta(t,h)$ and lets an ODE solver move the hidden state continuously from input time to output time.</p>`,
    definition:
      `<p>A Neural ODE defines hidden states by $$\\dfrac{dh(t)}{dt}=f_\\theta(t,h(t)),\\qquad h(t_0)=h_0,$$ and outputs $h(t_1)$ after numerical integration. The function $f_\\theta$ is a neural network with parameters $\\theta$; the solver decides intermediate times and step sizes.</p>` +
      `<p>The connection to ResNets comes from Euler: $h(t+h)\\approx h(t)+h f_\\theta(t,h(t))$. A residual block is one explicit step; a Neural ODE asks an adaptive solver to choose many such steps more flexibly.</p>` +
      `<p><b>Assumptions that matter:</b> the vector field should be regular enough for a unique solution; solver tolerances affect speed and accuracy; training through the solve needs gradients, often by backpropagating through solver operations or using an adjoint equation.</p>`,
    worked: {
      problem: "A one-dimensional Neural ODE has $h'=\\theta h$ with $\\theta=0.4$ and $h(0)=2$. Use two Euler steps of size $0.5$ to estimate $h(1)$.",
      skills: ["Neural ODE vector fields", "Euler stepping", "learned parameter interpretation"],
      strategy: "Treat the learned vector field like any ODE slope rule and step it forward.",
      steps: [
        { do: "Evaluate the first slope", result: "$f_\\theta(0,2)=0.4\\cdot2=0.8$", why: "the parameter scales the hidden state" },
        { do: "Take the first Euler step", result: "$h_1=2+0.5\\cdot0.8=2.4$", why: "advance from $t=0$ to $t=0.5$" },
        { do: "Evaluate the second slope", result: "$f_\\theta(0.5,2.4)=0.4\\cdot2.4=0.96$", why: "use the updated hidden state" },
        { do: "Take the second Euler step", result: "$h_2=2.4+0.5\\cdot0.96=2.88$", why: "advance from $t=0.5$ to $t=1$" },
        { do: "Compare with the exact flow", result: "$2e^{0.4}\\approx2.984$", why: "the exact scalar ODE gives a sanity check" }
      ],
      verify: "The estimate is below the exact exponential because Euler with a growing slope uses the left endpoint on each interval.",
      answer: "The two-step Euler Neural ODE estimate is $h(1)\\approx2.88$.",
      connects: "Neural ODE layers are learned IVPs solved numerically."
    },
    practice: [
      { problem: "For $h'=-0.5h$, $h(0)=4$, take one Euler step with $h_{step}=0.2$.", steps: [
        { do: "Compute the slope", result: "$-0.5\\cdot4=-2$", why: "evaluate the learned linear field" },
        { do: "Multiply by the step size", result: "$0.2(-2)=-0.4$", why: "Euler uses step times slope" },
        { do: "Update the state", result: "$4-0.4=3.6$", why: "add the change" },
        { do: "Read the new time", result: "$t=0.2$", why: "one step was taken" }
      ], answer: "$h(0.2)\\approx3.6$" },
      { problem: "A residual block is $h_{k+1}=h_k+0.1Ah_k$ with scalar $A=3$ and $h_0=2$. Compute one block and identify the ODE step.", steps: [
        { do: "Compute $Ah_0$", result: "$3\\cdot2=6$", why: "apply the scalar linear layer" },
        { do: "Multiply by step size", result: "$0.1\\cdot6=0.6$", why: "residual weight acts like $h$ in Euler" },
        { do: "Add the residual", result: "$h_1=2+0.6=2.6$", why: "residual update" },
        { do: "Name the ODE", result: "$h'=3h$ with step $0.1$", why: "Euler has the same form" }
      ], answer: "One block gives $h_1=2.6$; it matches Euler for $h'=3h$ with step $0.1$." },
      { problem: "An adaptive solver uses 12 function evaluations for one data point. If each $f_\\theta$ call costs $0.8$ ms, estimate forward time for a batch of 32.", steps: [
        { do: "Compute time per data point", result: "$12\\cdot0.8=9.6$ ms", why: "each solve calls the vector field 12 times" },
        { do: "Multiply by batch size", result: "$9.6\\cdot32=307.2$ ms", why: "assuming no parallel speedup" },
        { do: "Convert to seconds", result: "$0.3072$ s", why: "1000 ms equals 1 second" },
        { do: "Interpret", result: "about $0.31$ s", why: "round to a useful engineering estimate" }
      ], answer: "About $307$ ms, or $0.31$ seconds." },
      { problem: "For $h'=Wh$ with $W=-2$, compute the exact flow multiplier over time $0.3$.", steps: [
        { do: "Write the scalar solution", result: "$h(t)=e^{Wt}h(0)$", why: "linear scalar ODE" },
        { do: "Substitute $W=-2$ and $t=0.3$", result: "$e^{-0.6}$", why: "the exponent is $Wt$" },
        { do: "Approximate", result: "$e^{-0.6}\\approx0.549$", why: "numerical multiplier" },
        { do: "Apply to $h(0)=10$", result: "$h(0.3)\\approx5.49$", why: "multiply by the initial state" }
      ], answer: "The flow multiplier is about $0.549$; $10$ maps to about $5.49$." },
      { problem: "A continuous normalizing flow has trace $\\operatorname{tr}(\\partial f/\\partial z)=-0.7$ for $2$ seconds. Compute the log-density change $-\\int \\operatorname{tr}\\,dt$.", steps: [
        { do: "Write the trace integral", result: "$\\int_0^2 -0.7\\,dt$", why: "the trace is constant" },
        { do: "Evaluate the integral", result: "$-1.4$", why: "$-0.7\\cdot2=-1.4$" },
        { do: "Apply the negative sign", result: "$-(-1.4)=1.4$", why: "log density changes by negative trace integral" },
        { do: "Convert to density factor", result: "$e^{1.4}\\approx4.05$", why: "log-density increase exponentiates" }
      ], answer: "The log density increases by $1.4$, a density factor of about $4.05$." }
    ],
    applications: [
      { title: "Continuous-depth classification", background: "Neural ODEs were introduced to treat depth as continuous rather than a fixed number of layers.", numbers: "If a solver takes 20 vector-field calls and the classifier head takes 1 call, the ODE block uses about 20 times the core network evaluations of one residual layer." },
      { title: "Irregular time-series modeling", background: "Medical and sensor data often arrive at uneven times, making continuous-time hidden states natural.", numbers: "A hidden state with decay rate $0.3$ over a gap of $5$ hours keeps factor $e^{-1.5}\\approx0.223$ of its old value." },
      { title: "Continuous normalizing flows", background: "CNFs use ODEs to transform samples while tracking density through the divergence of the vector field.", numbers: "With constant divergence $0.2$ over $3$ seconds, log density changes by $-0.6$, so density is multiplied by $e^{-0.6}\\approx0.549$." },
      { title: "Latent trajectory interpolation", background: "A learned ODE can move latent codes smoothly between observations instead of jumping between discrete states.", numbers: "If $z'=0.5$ and $z(0)=1$, then after $2$ time units $z=2$, so a midpoint at $t=1$ is $1.5$." },
      { title: "Memory and compute tradeoff", background: "Adjoint methods were popularized because storing every solver state can be costly.", numbers: "Saving 100 states of dimension 256 in float32 costs $100\\cdot256\\cdot4=102400$ bytes, about 100 KB per example." },
      { title: "Stability in learned dynamics", background: "A Neural ODE with negative eigenvalues contracts hidden states, while positive eigenvalues can amplify them.", numbers: "A scalar rate $-1.2$ over $t=4$ multiplies perturbations by $e^{-4.8}\\approx0.0082$, a strong contraction." },
      { title: "Diffusion-model probability flow ODE", background: "Score-based diffusion samplers can use an ODE version that transports noise back to data deterministically.", numbers: "If a one-dimensional probability-flow drift is $-0.4x$ for one unit and $x=3$, the exact multiplier is $e^{-0.4}\\approx0.670$, giving $x\\approx2.01$." }
    ],
    applicationsClose: "Neural ODEs turn numerical differential equations into trainable layers, so solver accuracy, stability, and cost become ML design choices.",
    takeaways: [
      "A Neural ODE learns the vector field $f_\\theta(t,h)$ and solves an IVP to produce features.",
      "Residual networks resemble Euler discretizations of continuous dynamics.",
      "ODE solver tolerances trade speed for accuracy during training and inference.",
      "Continuous flows support irregular time series, density models, and diffusion-related samplers."
    ]
  },

  "math-03-35": {
    id: "math-03-35",
    title: "Stochastic differential equations & diffusion",
    tagline: "SDEs add calibrated noise to dynamics, giving the mathematical backbone of modern diffusion models.",
    connections: {
      buildsOn: ["ordinary differential equations", "probability distributions", "Euler's method"],
      leadsTo: ["diffusion models", "score-based generation", "stochastic optimization"],
      usedWith: ["Brownian motion", "Fokker–Planck equations", "Itô calculus", "numerical simulation"]
    },
    motivation:
      `<p>Ordinary differential equations describe motion when the slope is determined. Many systems are not that quiet: molecules jitter, markets jump, and generative models deliberately inject noise.</p>` +
      `<p>A <b>stochastic differential equation</b> keeps the drift of an ODE and adds a noise term. Diffusion models use this idea twice: corrupt data into noise, then learn how to reverse the corruption.</p>`,
    definition:
      `<p>A common Itô SDE is $$dX_t=f(X_t,t)\\,dt+g(t)\\,dW_t,$$ where $f$ is the drift, $g$ is the diffusion scale, and $W_t$ is Brownian motion. Over a small step $\\Delta t$, Euler–Maruyama uses $$X_{n+1}=X_n+f(X_n,t_n)\\Delta t+g(t_n)\\sqrt{\\Delta t}\\,\\varepsilon_n,$$ with $\\varepsilon_n\\sim\\mathcal{N}(0,1)$.</p>` +
      `<p>The $\\sqrt{\\Delta t}$ appears because Brownian increments satisfy $W_{t+\\Delta t}-W_t\\sim\\mathcal{N}(0,\\Delta t)$. Diffusion models choose a forward noising SDE or discrete schedule, then learn a score $\\nabla_x\\log p_t(x)$ to guide denoising.</p>` +
      `<p><b>Assumptions that matter:</b> stochastic simulations approximate distributions, not single deterministic paths; random seeds change sample paths; score-based reverse dynamics require a trained score estimate and careful step sizes.</p>`,
    worked: {
      problem: "Use one Euler–Maruyama step for $dX_t=-0.5X_t\\,dt+0.2\\,dW_t$ with $X_0=1$, $\\Delta t=0.04$, and sampled $\\varepsilon=1.5$.",
      skills: ["Euler–Maruyama", "Brownian scaling", "drift and diffusion"],
      strategy: "Compute the deterministic drift change and the random noise change separately.",
      steps: [
        { do: "Compute the drift", result: "$f(X_0,0)=-0.5\\cdot1=-0.5$", why: "substitute the current state" },
        { do: "Multiply by $\\Delta t$", result: "$-0.5\\cdot0.04=-0.02$", why: "drift scales linearly with time" },
        { do: "Compute $\\sqrt{\\Delta t}$", result: "$\\sqrt{0.04}=0.2$", why: "Brownian noise scales with square-root time" },
        { do: "Compute the noise change", result: "$0.2\\cdot0.2\\cdot1.5=0.06$", why: "use diffusion scale times Brownian increment" },
        { do: "Update the state", result: "$X_1=1-0.02+0.06=1.04$", why: "add drift and noise changes" }
      ],
      verify: "The drift pulls downward by $0.02$, but the sampled noise pushes upward by $0.06$, so the net increase to $1.04$ is reasonable.",
      answer: "$X_1=1.04$ for this sampled noise value.",
      connects: "An SDE step is an ODE step plus a Brownian increment scaled by $\\sqrt{\\Delta t}$."
    },
    practice: [
      { problem: "For $dX=0.3\\,dt+0.5\\,dW$, $X_0=2$, $\\Delta t=0.01$, $\\varepsilon=-1$, take one step.", steps: [
        { do: "Compute drift change", result: "$0.3\\cdot0.01=0.003$", why: "drift scales with $\\Delta t$" },
        { do: "Compute square-root time", result: "$\\sqrt{0.01}=0.1$", why: "Brownian increment scale" },
        { do: "Compute noise change", result: "$0.5\\cdot0.1\\cdot(-1)=-0.05$", why: "diffusion times sampled normal" },
        { do: "Update", result: "$X_1=2+0.003-0.05=1.953$", why: "add both changes" }
      ], answer: "$X_1=1.953$" },
      { problem: "A variance-preserving diffusion uses $x_t=\\sqrt{\\alpha}x_0+\\sqrt{1-\\alpha}\\,\\varepsilon$ with $\\alpha=0.64$, $x_0=3$, $\\varepsilon=-0.5$. Compute $x_t$.", steps: [
        { do: "Compute signal scale", result: "$\\sqrt{0.64}=0.8$", why: "coefficient on data" },
        { do: "Compute noise scale", result: "$\\sqrt{1-0.64}=\\sqrt{0.36}=0.6$", why: "remaining variance goes to noise" },
        { do: "Compute signal contribution", result: "$0.8\\cdot3=2.4$", why: "scaled clean data" },
        { do: "Compute noise contribution", result: "$0.6\\cdot(-0.5)=-0.3$", why: "scaled Gaussian noise" },
        { do: "Add contributions", result: "$x_t=2.4-0.3=2.1$", why: "forward noising formula" }
      ], answer: "$x_t=2.1$" },
      { problem: "If a score model predicts $s_\\theta(x,t)=-0.8$ and a Langevin step uses $x_{new}=x+\\eta s_\\theta+\\sqrt{2\\eta}\\varepsilon$ with $x=1$, $\\eta=0.02$, $\\varepsilon=0.5$, compute $x_{new}$.", steps: [
        { do: "Compute score drift", result: "$0.02(-0.8)=-0.016$", why: "move in the score direction" },
        { do: "Compute noise scale", result: "$\\sqrt{2\\cdot0.02}=\\sqrt{0.04}=0.2$", why: "Langevin noise scale" },
        { do: "Compute noise change", result: "$0.2\\cdot0.5=0.1$", why: "multiply by sampled normal" },
        { do: "Update", result: "$x_{new}=1-0.016+0.1=1.084$", why: "combine denoising drift and noise" }
      ], answer: "$x_{new}=1.084$" },
      { problem: "For Brownian motion with variance $t$, what is the standard deviation after $t=9$ seconds, and what is a two-standard-deviation interval around 0?", steps: [
        { do: "Use Brownian variance", result: "$\\operatorname{Var}(W_9)=9$", why: "variance equals elapsed time" },
        { do: "Take the square root", result: "$\\operatorname{sd}(W_9)=3$", why: "standard deviation is square root of variance" },
        { do: "Compute two standard deviations", result: "$2\\cdot3=6$", why: "rough 95 percent scale" },
        { do: "Write the interval", result: "$[-6,6]$", why: "centered at zero" }
      ], answer: "Standard deviation is $3$; a two-standard-deviation interval is approximately $[-6,6]$." },
      { problem: "A DDPM schedule has $\\beta=0.02$ for one step. If $x=4$ and noise prediction is $\\hat\\varepsilon=1.5$, compute the simple denoised estimate $(x-\\sqrt{\\beta}\\hat\\varepsilon)/\\sqrt{1-\\beta}$.", steps: [
        { do: "Compute $\\sqrt{\\beta}$", result: "$\\sqrt{0.02}\\approx0.1414$", why: "noise coefficient" },
        { do: "Compute predicted noise part", result: "$0.1414\\cdot1.5\\approx0.2121$", why: "scale the model's noise prediction" },
        { do: "Subtract noise", result: "$4-0.2121=3.7879$", why: "estimate cleaner signal numerator" },
        { do: "Compute denominator", result: "$\\sqrt{0.98}\\approx0.9899$", why: "signal scale" },
        { do: "Divide", result: "$3.7879/0.9899\\approx3.826$", why: "undo the signal scaling" }
      ], answer: "The denoised estimate is about $3.826$." }
    ],
    applications: [
      { title: "Score-based image generation", background: "Modern diffusion generators learn the score of noisy data distributions and follow reverse stochastic dynamics toward images.", numbers: "If a sampler uses 50 steps and each denoiser call costs 40 ms, one image takes about $50\\cdot40=2000$ ms, or 2 seconds." },
      { title: "DDPM forward noising", background: "Denoising diffusion probabilistic models gradually mix data with Gaussian noise according to a variance schedule.", numbers: "With $\\alpha=0.81$, clean pixel value $0.6$, and noise $-1.0$, the noisy value is $0.9\\cdot0.6+\\sqrt{0.19}(-1)\\approx0.104$." },
      { title: "Langevin sampling", background: "Langevin dynamics combines score ascent with random kicks to sample from a target density.", numbers: "For score $-2$, step $0.005$, and noise sample $1$, the update change is $0.005(-2)+\\sqrt{0.01}(1)=-0.01+0.1=0.09$." },
      { title: "Stochastic gradient noise", background: "Mini-batch training behaves partly like an SDE because batch gradients fluctuate around the full gradient.", numbers: "If gradient noise standard deviation is $0.3$ and learning rate is $0.01$, the parameter noise scale per step is about $0.003$." },
      { title: "Black-Scholes option model", background: "Financial mathematics modeled stock prices with geometric Brownian motion decades before ML diffusion models.", numbers: "With volatility $20\\%$ yearly, a one-day standard deviation is $0.20\\sqrt{1/252}\\approx0.0126$, about $1.26\\%$." },
      { title: "Molecular diffusion", background: "Einstein's Brownian-motion work connects microscopic random motion to macroscopic diffusion.", numbers: "In one dimension, mean squared displacement is $2Dt$. With $D=0.5$ and $t=10$, it equals $10$, so root mean square displacement is $\\sqrt{10}\\approx3.16$." },
      { title: "Probability-flow ODE alternative", background: "Score-based models can sometimes replace the reverse SDE with a deterministic ODE for faster or repeatable sampling.", numbers: "If deterministic drift is $-0.1x$ for 10 units from $x=5$, the exact output is $5e^{-1}\\approx1.84$." }
    ],
    applicationsClose: "SDEs give one language for random physical motion, noisy optimization, and the forward and reverse processes in diffusion generation.",
    takeaways: [
      "An SDE combines drift $f\\,dt$ with diffusion $g\\,dW_t$.",
      "Euler–Maruyama adds a noise term scaled by $\\sqrt{\\Delta t}$.",
      "Diffusion models corrupt data with noise and learn scores or noise predictions to reverse the process.",
      "Sample paths are random, so simulations describe distributions as much as individual trajectories."
    ]
  }
};
