module.exports = {
  "math-03-01": {
    connectionsProse: "<p>This lesson connects basic derivative notation and antiderivatives to the question of what a differential equation is. The reader can bring the familiar habit of reading a derivative as a local rate of change. Here that habit is organized around the structure that makes this particular kind of equation useful. The lesson prepares for the vocabulary used by every later ODE method, where recognizing the structure before solving is often the most important step.</p>",
    motivation: "<p>A differential equation describes a function by describing its rate of change. Instead of giving the curve directly, it gives a motion law and asks for the function whose derivative obeys that law. The concrete gap is that the curve is not supplied directly.</p>" +
                "<p>The load-bearing idea is that the rate law itself becomes the description of the unknown function. The derivation or explanation below keeps the algebra tied to that idea, so each step shows why the method applies rather than only recording a formal manipulation. After the structure is clear, the initial data, constants, or numerical values have a specific role to play.</p>",
    definition: "<p>A differential equation is an equation that describes an unknown function through one or more of its derivatives. For example, $y'=3x^2$ has the family of solutions $y=x^3+C$.</p>" +
                "<p><b>Assumptions that matter:</b> The independent variable, dependent function, derivative notation, and any initial data must be identified before solving.</p>",
    symbols: [
      { sym: "$x$ or $t$", desc: "the independent variable" },
      { sym: "$y(x)$ or $s(t)$", desc: "the unknown function" },
      { sym: "$y'$ and $dy/dx$", desc: "derivatives" },
      { sym: "$C$", desc: "an integration constant" }
    ],
    applications: [
      { title: "Velocity law", background: "$v'=4$, $v(0)=3$ gives a linear velocity model.", numbers: "$v(5)=23$" },
      { title: "Growth law", background: "$P'=0.2P$, $P(0)=100$ gives exponential growth.", numbers: "$P(10)\\approx738.91$" },
      { title: "Neural state", background: "$h'=0.5h$, $h(0)=2$ gives exponential hidden-state growth.", numbers: "$h(4)\\approx14.78$" },
      { title: "Gradient flow", background: "$w'=-w$, $w(0)=8$ gives exponential decay.", numbers: "$w(3)\\approx0.398$" },
      { title: "RC discharge", background: "$V'=-0.1V$, $V(0)=5$ gives voltage decay.", numbers: "$V(10)\\approx1.84$" },
      { title: "Queue law", background: "$Q'=20$, $Q(0)=50$ gives constant backlog growth.", numbers: "$Q(6)=170$" }
    ]
  },
  "math-03-02": {
    connectionsProse: "<p>This lesson connects the habit of inspecting formulas before solving them to classifying differential equations. The reader can bring the familiar habit of reading a derivative as a local rate of change. Here that habit is organized around the structure that makes this particular kind of equation useful. The lesson prepares for choosing separation, linear methods, systems, or numerical tools, where recognizing the structure before solving is often the most important step.</p>",
    motivation: "<p>Classification tells which solving tools are reasonable before any algebra begins. Order, ordinary versus partial, linearity, and systems are labels that prevent using a method on the wrong kind of equation. The concrete gap is that many equations look similar on the page.</p>" +
                "<p>The load-bearing idea is that order, variable type, linearity, and coupling identify the right toolbox. The derivation or explanation below keeps the algebra tied to that idea, so each step shows why the method applies rather than only recording a formal manipulation. After the structure is clear, the initial data, constants, or numerical values have a specific role to play.</p>",
    definition: "<p>Classification is a decision procedure for differential equations: check the highest derivative for order, the number of independent variables for ODE versus PDE, and whether the unknown appears linearly.</p>" +
                "<p><b>Assumptions that matter:</b> The equation must be written clearly enough to identify the unknown function, independent variables, derivative orders, and powers or products of the unknown.</p>",
    symbols: [
      { sym: "$y^{(n)}$", desc: "the $n$th derivative" },
      { sym: "$a_i(x)$", desc: "coefficient functions" },
      { sym: "$g(x)$", desc: "forcing" },
      { sym: "$u_t$ and $u_{xx}$", desc: "partial derivatives" },
      { sym: "$x$", desc: "the vector state in a system" }
    ],
    applications: [
      { title: "Second-order forced equation", background: "$y''+3y'+2y=\\sin x$ is classified by its highest derivative and linear form.", numbers: "second-order, ordinary, linear" },
      { title: "Free fall equation", background: "$x''=-9.8$ is a second-order ODE.", numbers: "order $2$ and needs two constants" },
      { title: "Heat equation", background: "$u_t=0.01u_{xx}$ has different derivative orders in time and space.", numbers: "first time order and second space order" },
      { title: "Hidden-state system", background: "A 64-coordinate hidden state becomes a coupled first-order system.", numbers: "64 first-order equations" },
      { title: "SIR nonlinearity", background: "SIR term $0.0002SI$ with $S=900,I=10$ multiplies two unknown states.", numbers: "nonlinear rate $1.8$" },
      { title: "Linear time constant", background: "$y'+5y=u$ is first-order linear with coefficient $5$.", numbers: "time constant $1/5=0.2$" }
    ]
  },
  "math-03-03": {
    connectionsProse: "<p>This lesson connects families of antiderivatives and constants of integration to solutions and initial conditions. The reader can bring the familiar habit of reading a derivative as a local rate of change. Here that habit is organized around the structure that makes this particular kind of equation useful. The lesson prepares for initial-value problems throughout the section, where recognizing the structure before solving is often the most important step.</p>",
    motivation: "<p>A differential equation usually gives a family of curves. An initial condition anchors the family at one point, turning a general solution into a specific prediction. The concrete gap is that a rate law alone leaves many possible curves.</p>" +
                "<p>The load-bearing idea is that the initial condition selects the one curve that passes through the starting point. The derivation or explanation below keeps the algebra tied to that idea, so each step shows why the method applies rather than only recording a formal manipulation. After the structure is clear, the initial data, constants, or numerical values have a specific role to play.</p>",
    definition: "<p>A solution satisfies the differential equation on an interval, and an initial condition selects one member from a family of solutions.</p>" +
                "<p>For $y'=2x$, integration gives $$y=x^2+C,$$ and the condition $y(1)=5$ selects $y=x^2+4$.</p>" +
                "<p><b>Assumptions that matter:</b> The solution formula must satisfy both the ODE and the initial condition on its interval of validity.</p>",
    symbols: [
      { sym: "$x_0$", desc: "the starting input" },
      { sym: "$y_0$", desc: "the starting value" },
      { sym: "$C$", desc: "selects one solution" },
      { sym: "interval of validity", desc: "where the formula satisfies the equation" }
    ],
    derivation: [
      { do: "Start with $y'=2x$.", result: "$y'=2x$", why: "the rate law names the derivative" },
      { do: "Integrate.", result: "$y=x^2+C$", why: "antiderivatives differ by constants" },
      { do: "Apply $y(1)=5$.", result: "$5=1+C$", why: "the chosen curve must pass through the point" },
      { do: "Solve for the constant.", result: "$C=4$", why: "subtract the known value" },
      { do: "State the selected solution.", result: "$y=x^2+4$", why: "this member of the family satisfies both the ODE and the initial condition" }
    ],
    applications: [
      { title: "Scaled starts", background: "$T'=0.1T$ with starts 10 and 20 gives two exponential solutions.", numbers: "solutions that remain in ratio $2$" },
      { title: "Decay initial value", background: "$w'=-0.5w$, $w(0)=8$ fixes the constant.", numbers: "$w(4)\\approx1.08$" },
      { title: "Capacitor curve", background: "$V=Ce^{-t/5}$, $V(0)=12$ fixes $C$.", numbers: "$V(10)\\approx1.62$" },
      { title: "Infection growth", background: "$I'=0.2I$, $I(0)=50$ fixes the trajectory.", numbers: "$I(7)\\approx202.76$" },
      { title: "Latent decay", background: "$z'=-z$, $z(0)=0.6$ gives a selected exponential.", numbers: "$z(2)\\approx0.0812$" },
      { title: "Constant motion", background: "$x'=2$, $x(0)=5$ gives a line.", numbers: "$x(3)=11$" }
    ]
  },
  "math-03-04": {
    connectionsProse: "<p>This lesson connects derivatives as slopes of tangent lines to direction fields. The reader can bring the familiar habit of reading a derivative as a local rate of change. Here that habit is organized around the structure that makes this particular kind of equation useful. The lesson prepares for equilibria, phase planes, and numerical stepping, where recognizing the structure before solving is often the most important step.</p>",
    motivation: "<p>A direction field draws the slope required by $y'=f(x,y)$ at many points. A solution curve is a path whose tangent follows those local line segments. The concrete gap is that some ODEs are easier to understand visually than symbolically.</p>" +
                "<p>The load-bearing idea is that a grid of local slopes shows the motion a solution must follow. The derivation or explanation below keeps the algebra tied to that idea, so each step shows why the method applies rather than only recording a formal manipulation. After the structure is clear, the initial data, constants, or numerical values have a specific role to play.</p>",
    definition: "<p>A direction field is built by computing the slope $f(x,y)$ at grid points for an ODE $$y'=f(x,y).$$ A short segment with that slope is drawn at each point.</p>" +
                "<p><b>Assumptions that matter:</b> Draw segments only where $f(x,y)$ is defined; horizontal segments occur where $f=0$.</p>",
    symbols: [
      { sym: "$f(x,y)$", desc: "the slope rule" },
      { sym: "$(x,y)$", desc: "a point in the plane" },
      { sym: "slope $0$", desc: "a horizontal tangent" },
      { sym: "undefined $f$", desc: "no segment is drawn there" }
    ],
    applications: [
      { title: "Sample slopes", background: "For $y'=x-y$, slopes at selected grid points organize the field.", numbers: "at $(0,0),(1,0),(1,2),(2,2)$ are $0,1,-1,0$" },
      { title: "Euler preview", background: "Euler at $(0,1)$ with $h=0.1$ for $y'=x-y$ uses the local slope.", numbers: "changes by $-0.1$" },
      { title: "Logistic field", background: "Logistic slope $0.2P(1-P/1000)$ changes sign past carrying capacity.", numbers: "$50$ at $P=500$ and $-48$ at $P=1200$" },
      { title: "Linear decay slopes", background: "$w'=-2w$ gives slopes determined by the vertical coordinate.", numbers: "$-4,0,4$ at $w=2,0,-2$" },
      { title: "Target-seeking field", background: "$y'=5-y$ points upward below the target and downward above it.", numbers: "slopes $2$ at $y=3$ and $-2$ at $y=7$" },
      { title: "Queue balance", background: "$Q'=80-0.5Q$ has a horizontal direction at balance.", numbers: "balances at $Q=160$" }
    ]
  },
  "math-03-05": {
    connectionsProse: "<p>This lesson builds on two familiar ideas: derivatives as rates of change, and antiderivatives as the way to recover a function from its rate. A separable equation is the first major ODE-solving method where those two ideas work together. The equation gives a rate law, and the special separable form lets each variable move to its own side before integration.</p><p>This method leads directly into many later lessons. Logistic growth, Newton cooling, several first-order models, Bernoulli substitutions, and homogeneous substitutions all use separation either directly or after a change of variables. Learning the method carefully also builds the habit that matters throughout ODEs: check where division is allowed, integrate both sides, and use the initial condition only after the general relationship is found.</p>",
    motivation: "<p>A differential equation such as $y'=xy$ says that the slope depends on both the input $x$ and the current value $y$. That can seem harder than a plain antiderivative because the unknown function appears on the right side too. The separable structure is what makes this example manageable: the right side is a product of one factor involving $x$ and one factor involving $y$.</p>" +
                "<p>Separation uses that product structure. We divide by the $y$ factor, place the $x$ factor with $dx$, and integrate. The result is not a shortcut around calculus; it is the chain rule in reverse. After integration, the constant of integration represents the whole family of solution curves, and the initial condition chooses the one curve that passes through the starting point.</p>",
    definition: "<p>A first-order equation is separable when the right side factors into an $x$ part and a $y$ part:</p>" +
                "<p>$$\\frac{dy}{dx}=g(x)h(y).$$</p>" +
                "<p><b>Assumptions that matter:</b> Division by $h(y)$ is only valid where $h(y)\\ne0$; constant solutions created by $h(y)=0$ should be checked separately.</p>",
    symbols: [
      { sym: "$x$", desc: "the independent variable" },
      { sym: "$y(x)$", desc: "the unknown dependent function" },
      { sym: "$g(x)$", desc: "the factor depending only on $x$" },
      { sym: "$h(y)$", desc: "the factor depending only on $y$" },
      { sym: "$C$", desc: "the integration constant" },
      { sym: "$dy$ and $dx$", desc: "mark the variables being integrated after separation" }
    ],
    derivation: [
      { do: "Start with $\\dfrac{dy}{dx}=g(x)h(y)$.", result: "$\\dfrac{dy}{dx}=g(x)h(y)$", why: "the right side factors into an $x$ part and a $y$ part" },
      { do: "Divide by $h(y)$ where $h(y)\\ne0$.", result: "$\\dfrac{1}{h(y)}\\dfrac{dy}{dx}=g(x)$", why: "this isolates the unknown-function factor" },
      { do: "Multiply by $dx$.", result: "$\\dfrac{1}{h(y)}\\,dy=g(x)\\,dx$", why: "this is shorthand for the chain-rule-backed differential relationship" },
      { do: "Integrate both sides.", result: "$\\int \\dfrac{1}{h(y)}\\,dy=\\int g(x)\\,dx+C$", why: "each side now has one variable" },
      { do: "For $y'=xy$, divide by $y$.", result: "$\\dfrac{1}{y}\\,dy=x\\,dx$", why: "this is valid away from $y=0$, and the initial value $2$ keeps this solution nonzero near $0$" },
      { do: "Integrate.", result: "$\\ln|y|=x^2/2+C$", why: "the left antiderivative is logarithmic" },
      { do: "Exponentiate.", result: "$|y|=e^C e^{x^2/2}$", why: "exponentials undo logarithms" },
      { do: "Absorb sign and $e^C$ into one nonzero constant.", result: "$y=Ce^{x^2/2}$", why: "the constant carries the branch" },
      { do: "Apply $y(0)=2$.", result: "$2=Ce^0=C$", why: "the initial value fixes the curve" },
      { do: "State and check the solution.", result: "$y=2e^{x^2/2}$", why: "differentiating gives $y'=2xe^{x^2/2}=xy$, so the equation and initial value both check" }
    ],
    applications: [
      { title: "Exponential growth", background: "$P'=0.3P$, $P(0)=100$ separates to $P=100e^{0.3t}$.", numbers: "$P(5)=100e^{1.5}\\approx448.17$" },
      { title: "Radioactive half-life", background: "$A'=-0.02A$ gives $A=A_0e^{-0.02t}$; setting $A/A_0=0.5$ solves the half-life.", numbers: "$t=\\ln2/0.02\\approx34.66$" },
      { title: "Logistic growth rate", background: "$P'=0.1P(1-P/1000)$ is separable; at $P=200$ the instantaneous rate is computed directly.", numbers: "$0.1\\cdot200\\cdot0.8=16$" },
      { title: "Gradient flow for a quadratic", background: "$w'=-0.5w$ gives $w=20e^{-0.5t}$ from $w(0)=20$.", numbers: "$w(6)=20e^{-3}\\approx0.996$" },
      { title: "Newton cooling", background: "$T'=-0.1(T-20)$ gives $T=20+50e^{-0.1t}$ from $T(0)=70$.", numbers: "$T(10)\\approx38.39^\\circ$" },
      { title: "Memory-score decay", background: "$s'=-0.7s$, $s(0)=1$ gives exponential decay.", numbers: "$s(3)=e^{-2.1}\\approx0.122$" }
    ]
  },
  "math-03-06": {
    connectionsProse: "<p>This lesson connects exponential decay and relaxation toward a target to linear first-order equations. The reader can bring the familiar habit of reading a derivative as a local rate of change. Here that habit is organized around the structure that makes this particular kind of equation useful. The lesson prepares for cooling, circuits, queues, and smoothing models, where recognizing the structure before solving is often the most important step.</p>",
    motivation: "<p>A linear first-order equation lets $y$ and $y'$ appear only to the first power. With constant coefficients, it describes relaxation toward an equilibrium set by the forcing. The concrete gap is that the forcing term hides the simple decay variable.</p>" +
                "<p>The load-bearing idea is that subtracting the equilibrium exposes exponential decay of the deviation. The derivation or explanation below keeps the algebra tied to that idea, so each step shows why the method applies rather than only recording a formal manipulation. After the structure is clear, the initial data, constants, or numerical values have a specific role to play.</p>",
    definition: "<p>A first-order linear equation has standard form $y'+p(x)y=q(x)$. For constants, $y'+ay=b$ relaxes toward $b/a$:</p>" +
                "<p>$$y=\\frac{b}{a}+Ce^{-ax}.$$</p>" +
                "<p><b>Assumptions that matter:</b> In the constant-coefficient formula, $a\\ne0$; for variable coefficients, use standard form before applying an integrating factor.</p>",
    symbols: [
      { sym: "$p(x)$", desc: "the coefficient of $y$ in standard form" },
      { sym: "$q(x)$", desc: "forcing" },
      { sym: "$a,b$", desc: "constants" },
      { sym: "$y_*$", desc: "equilibrium" },
      { sym: "$u$", desc: "deviation from equilibrium" }
    ],
    derivation: [
      { do: "Find equilibrium by setting $y'=0$.", result: "$ay_*=b$", why: "a constant solution has no rate" },
      { do: "Divide by the coefficient.", result: "$y_*=b/a$", why: "this identifies the target value" },
      { do: "Define the deviation.", result: "$u=y-y_*$", why: "measure distance from equilibrium" },
      { do: "Differentiate the deviation.", result: "$u'=y'$", why: "the equilibrium is constant" },
      { do: "Substitute into the ODE.", result: "$u'+a u=0$", why: "the forcing cancels" },
      { do: "Separate variables.", result: "$du/u=-a\\,dx$", why: "this is proportional decay" },
      { do: "Integrate.", result: "$u=Ce^{-ax}$", why: "distance decays exponentially" },
      { do: "Return to $y$ and apply the example $y'+2y=6$, $y(0)=1$.", result: "$y=3-2e^{-2x}$", why: "the equilibrium is $3$ and the initial deviation is $-2$" }
    ],
    applications: [
      { title: "Cooling", background: "$T'+0.2T=4$, $T(0)=80$ gives $T=20+60e^{-0.2t}$.", numbers: "$T(10)\\approx28.12$" },
      { title: "Exponential smoothing", background: "$m'+5m=50$ relaxes toward a constant target.", numbers: "target $10$ and time constant $0.2$" },
      { title: "RC charging", background: "$V'+2V=10$, $V(0)=0$ charges toward $5$.", numbers: "$V(1)\\approx4.32$" },
      { title: "Regularized flow", background: "$w'+3w=6$ has a constant equilibrium.", numbers: "tends to $2$" },
      { title: "Queue", background: "$Q'+0.1Q=50$ balances inflow and service.", numbers: "balances at $500$" },
      { title: "Half-life", background: "$x'+0.4x=2$ decays toward its target with rate $0.4$.", numbers: "half-life $\\ln2/0.4\\approx1.73$" }
    ]
  },
  "math-03-07": {
    connectionsProse: "<p>This lesson connects the product rule from calculus to integrating factors. The reader can bring the familiar habit of reading a derivative as a local rate of change. Here that habit is organized around the structure that makes this particular kind of equation useful. The lesson prepares for variable-coefficient first-order linear equations, where recognizing the structure before solving is often the most important step.</p>",
    motivation: "<p>An integrating factor is a multiplier chosen so the left side of a linear equation becomes one product derivative. It extends the first-order linear method to variable coefficients. The concrete gap is that the left side is almost, but not yet, one derivative.</p>" +
                "<p>The load-bearing idea is that a multiplier is chosen so the product rule matches exactly. The derivation or explanation below keeps the algebra tied to that idea, so each step shows why the method applies rather than only recording a formal manipulation. After the structure is clear, the initial data, constants, or numerical values have a specific role to play.</p>",
    definition: "<p>For a linear equation in standard form $y'+p(x)y=q(x)$, an integrating factor is</p>" +
                "<p>$$\\mu(x)=e^{\\int p(x)dx}.$$</p>" +
                "<p><b>Assumptions that matter:</b> The equation must first be in standard form; the multiplier is chosen so $(\\mu y)'=\\mu q$.</p>",
    symbols: [
      { sym: "$\\mu(x)$", desc: "the integrating factor" },
      { sym: "$p(x)$ and $q(x)$", desc: "known functions" },
      { sym: "$C$", desc: "the integration constant" },
      { sym: "$(e^{4x}y)'=8$", desc: "the worked-step result with the math delimiter closed" }
    ],
    derivation: [
      { do: "Start with standard linear form.", result: "$y'+p(x)y=q(x)$", why: "standard form identifies the coefficient that drives the multiplier" },
      { do: "Multiply by an unknown $\\mu(x)$.", result: "$\\mu y'+\\mu p y=\\mu q$", why: "seek a product-rule pattern" },
      { do: "Compare with the product rule.", result: "$(\\mu y)'=\\mu y'+\\mu' y$", why: "the first term already matches" },
      { do: "Require matching $y$ coefficients.", result: "$\\mu'=p\\mu$", why: "this makes the product rule exact" },
      { do: "Separate the multiplier equation.", result: "$d\\mu/\\mu=p(x)\\,dx$", why: "solve for the multiplier" },
      { do: "Integrate.", result: "$\\mu=e^{\\int p(x)dx}$", why: "exponentials undo the logarithm" },
      { do: "Rewrite the ODE.", result: "$(\\mu y)'=\\mu q$", why: "the ODE has become one derivative" },
      { do: "Integrate and apply the example $y'+3y=e^{-x}$.", result: "$\\mu y=\\int \\mu q\\,dx+C$ and $y=\\tfrac12(e^{-x}-e^{-3x})$", why: "the product derivative can be undone directly" }
    ],
    applications: [
      { title: "Ramp forcing", background: "$y'+y=t$ uses an integrating factor to combine the left side.", numbers: "$y=t-1+Ce^{-t}$" },
      { title: "Smoothed ramp", background: "$m'+2m=2t$ has a linear particular response.", numbers: "$m=t-0.5+Ce^{-2t}$" },
      { title: "Concentration target", background: "$C'+0.3C=6$ relaxes to its steady state.", numbers: "steady value $20$" },
      { title: "Voltage forcing", background: "$V'+5V=10e^{-t}$ has an exponential particular term.", numbers: "particular term $2.5e^{-t}$" },
      { title: "Score smoothing", background: "$h'+h=0.9$, $h(0)=0.1$ moves toward $0.9$.", numbers: "$h(2)\\approx0.792$" },
      { title: "Feature tracking", background: "$m'+10m=10g$, $g=0.4$ relaxes quickly.", numbers: "tends to $0.4$ with time constant $0.1$" }
    ]
  },
  "math-03-08": {
    connectionsProse: "<p>This lesson connects partial derivatives and level curves to exact equations. The reader can bring the familiar habit of reading a derivative as a local rate of change. Here that habit is organized around the structure that makes this particular kind of equation useful. The lesson prepares for conservative fields and energy-like implicit solutions, where recognizing the structure before solving is often the most important step.</p>",
    motivation: "<p>An exact equation is a hidden total differential. Once the potential function is recovered, solutions are level curves of that potential. The concrete gap is that the equation may not solve cleanly for y as a function of x.</p>" +
                "<p>The load-bearing idea is that a potential function turns the solution into a level curve. The derivation or explanation below keeps the algebra tied to that idea, so each step shows why the method applies rather than only recording a formal manipulation. After the structure is clear, the initial data, constants, or numerical values have a specific role to play.</p>",
    definition: "<p>An equation $M(x,y)dx+N(x,y)dy=0$ is exact when it is the differential of a potential $F(x,y)$, so $F_x=M$ and $F_y=N$.</p>" +
                "<p>$$M_y=N_x.$$</p>" +
                "<p><b>Assumptions that matter:</b> The usual exactness test applies on a region where the needed partial derivatives are continuous.</p>",
    symbols: [
      { sym: "$M,N$", desc: "coefficient functions" },
      { sym: "$F$", desc: "the potential" },
      { sym: "$F_x,F_y$", desc: "partial derivatives" },
      { sym: "$C$", desc: "labels a level curve" }
    ],
    derivation: [
      { do: "Set the coefficient functions.", result: "$M=2xy+3$, $N=x^2+4y$", why: "identify the differential coefficients" },
      { do: "Compute $M_y$.", result: "$M_y=2x$", why: "differentiate $M$ with respect to $y$" },
      { do: "Compute $N_x$.", result: "$N_x=2x$", why: "differentiate $N$ with respect to $x$" },
      { do: "Use exactness.", result: "$M_y=N_x$", why: "seek $F$ with $F_x=M$, $F_y=N$" },
      { do: "Integrate $M$ in $x$.", result: "$F=x^2y+3x+\\phi(y)$", why: "the missing part may depend on $y$" },
      { do: "Differentiate in $y$.", result: "$F_y=x^2+\\phi'(y)$", why: "match $N$" },
      { do: "Set equal to $N$.", result: "$x^2+\\phi'(y)=x^2+4y$, so $\\phi'=4y$", why: "determine the missing $y$-only term" },
      { do: "Integrate $\\phi'$.", result: "$\\phi=2y^2$", why: "recover the missing potential term" },
      { do: "State the implicit solution.", result: "$x^2y+3x+2y^2=C$", why: "solutions are level curves of the potential" }
    ],
    applications: [
      { title: "Circle level set", background: "$F=x^2+y^2=25$ is a potential level curve.", numbers: "radius $5$" },
      { title: "Weight constraint", background: "$F=w^2+b^2=1$ constrains two parameters.", numbers: "keeps $(w,b)$ on a unit circle" },
      { title: "Implicit radius", background: "$F=x^2+y^2-9=0$ defines a circle.", numbers: "radius $3$" },
      { title: "Conservative field", background: "Field $(2x,2y)$ comes from a potential.", numbers: "potential $x^2+y^2$" },
      { title: "Thermodynamic differential", background: "$dF=3T^2dT+2VdV$ integrates componentwise.", numbers: "$F=T^3+V^2+C$" },
      { title: "Potential change", background: "Potential change from $(1,2)$ to $(3,4)$ for $F=x^2+y^2$ is endpoint subtraction.", numbers: "$25-5=20$" }
    ]
  },
  "math-03-09": {
    connectionsProse: "<p>This lesson connects linear first-order equations and substitutions to bernoulli equations. The reader can bring the familiar habit of reading a derivative as a local rate of change. Here that habit is organized around the structure that makes this particular kind of equation useful. The lesson prepares for more nonlinear first-order models, where recognizing the structure before solving is often the most important step.</p>",
    motivation: "<p>A Bernoulli equation is nonlinear in $y$, but the power is organized enough that one substitution turns it into a linear first-order equation. The concrete gap is that the equation is nonlinear in y but has one organized power.</p>" +
                "<p>The load-bearing idea is that the substitution y^(1-n) converts the problem to a linear one. The derivation or explanation below keeps the algebra tied to that idea, so each step shows why the method applies rather than only recording a formal manipulation. After the structure is clear, the initial data, constants, or numerical values have a specific role to play.</p>",
    definition: "<p>A Bernoulli equation has the form</p>" +
                "<p>$$y'+p(x)y=q(x)y^n.$$</p>" +
                "<p><b>Assumptions that matter:</b> Use $n\\ne0,1$ for the nonlinear case, and check $y=0$ separately when division by powers of $y$ is used.</p>",
    symbols: [
      { sym: "$n$", desc: "the nonlinear power" },
      { sym: "$v$", desc: "the transformed dependent variable" },
      { sym: "$p,q$", desc: "known functions" },
      { sym: "$y=0$", desc: "must be checked separately when division is used" }
    ],
    derivation: [
      { do: "Start with the Bernoulli form.", result: "$y'+p(x)y=q(x)y^n$, $n\\ne0,1$", why: "the nonlinear term is a single power" },
      { do: "Divide by $y^n$.", result: "$y^{-n}y'+p y^{1-n}=q$", why: "put powers where one substitution can reach them" },
      { do: "Set the substitution.", result: "$v=y^{1-n}$", why: "this is the power already present" },
      { do: "Differentiate $v$.", result: "$v'=(1-n)y^{-n}y'$", why: "chain rule" },
      { do: "Replace the powered terms.", result: "$y^{-n}y'=v'/(1-n)$ and $y^{1-n}=v$", why: "rewrite the equation in $v$" },
      { do: "Multiply by $1-n$.", result: "$v'+(1-n)p v=(1-n)q$", why: "the transformed equation is linear in $v$" },
      { do: "Apply $y'+y=xy^2$, $y(0)=1/3$.", result: "$v=1/y$, $v'-v=-x$, and $y=1/(x+2e^x+1)$", why: "the nonlinear equation becomes a first-order linear equation" }
    ],
    applications: [
      { title: "Basic Bernoulli", background: "$y'+y=y^2$ uses $v=1/y$.", numbers: "$v'-v=-1$" },
      { title: "Transformed growth", background: "$v'+0.2v=0.01v^2$ with $u=1/v$ becomes linear.", numbers: "$u'-0.2u=-0.01$" },
      { title: "Amplitude saturation", background: "$a'+a=0.5a^2$, $a(0)=1$ solves by Bernoulli substitution.", numbers: "$a(2)=1/(0.5+0.5e^2)\\approx0.238$" },
      { title: "Time-varying coefficient", background: "$c'+2c=tc^2$ uses reciprocal substitution.", numbers: "$v'-2v=-t$" },
      { title: "Infection nonlinearity", background: "$I'-I=I^2$ becomes linear in $1/I$.", numbers: "$1/I=-1+Ce^{-t}$" },
      { title: "Initial-value Bernoulli", background: "$y'+y=y^2$, $y(0)=0.5$ fixes the constant.", numbers: "$y(1)=1/(1+e)\\approx0.269$" }
    ]
  },
  "math-03-10": {
    connectionsProse: "<p>This lesson connects ratios, scaling, and product-rule differentiation to homogeneous substitutions. The reader can bring the familiar habit of reading a derivative as a local rate of change. Here that habit is organized around the structure that makes this particular kind of equation useful. The lesson prepares for more change-of-variable methods, where recognizing the structure before solving is often the most important step.</p>",
    motivation: "<p>When the slope depends only on the ratio $y/x$, the curve's scale matters less than its shape from the origin. The substitution $v=y/x$ tracks that ratio directly. The concrete gap is that the slope depends on position only through y/x.</p>" +
                "<p>The load-bearing idea is that tracking the ratio y/x removes the scale from the equation. The derivation or explanation below keeps the algebra tied to that idea, so each step shows why the method applies rather than only recording a formal manipulation. After the structure is clear, the initial data, constants, or numerical values have a specific role to play.</p>",
    definition: "<p>A homogeneous first-order substitution applies when the slope depends only on $y/x$:</p>" +
                "<p>$$y'=F(y/x).$$</p>" +
                "<p><b>Assumptions that matter:</b> Work on an interval where $x\\ne0$, and use $v=y/x$ so $y=vx$.</p>",
    symbols: [
      { sym: "$v$", desc: "the ratio $y/x$" },
      { sym: "$x\\ne0$", desc: "required on the interval" },
      { sym: "$F(y/x)$", desc: "the ratio-only slope rule" },
      { sym: "$C$", desc: "the integration constant" }
    ],
    derivation: [
      { do: "Set the ratio variable.", result: "$v=y/x$", why: "the right side depends on this ratio" },
      { do: "Rewrite the dependent variable.", result: "$y=vx$", why: "return to the original variable" },
      { do: "Differentiate.", result: "$y'=v+xv'$", why: "product rule" },
      { do: "Substitute into $y'=1+y/x$.", result: "$v+xv'=1+v$", why: "replace the ODE" },
      { do: "Cancel $v$.", result: "$xv'=1$", why: "the equation is separable" },
      { do: "Separate variables.", result: "$dv=dx/x$", why: "put each variable on its own side" },
      { do: "Integrate.", result: "$v=\\ln|x|+C$", why: "logarithm appears" },
      { do: "Return to $y$.", result: "$y=x(\\ln|x|+C)$", why: "undo the substitution" },
      { do: "Use $y(1)=2$.", result: "$C=2$", why: "the initial condition fixes the curve" }
    ],
    applications: [
      { title: "Pure ratio slope", background: "$y'=y/x$ keeps the ratio constant along rays.", numbers: "$y=Ax$ and constant ratio $A$" },
      { title: "Point slope", background: "At $(4,2)$, $y/x=0.5$ for $y'=1+y/x$.", numbers: "$y'=1.5$" },
      { title: "Scale invariance", background: "Two points can have the same ratio despite different sizes.", numbers: "$(2,4)$ and $(10,20)$ both have ratio $2$" },
      { title: "Ray slope", background: "On ray $y=3x$, the rule $1+y/x$ is constant.", numbers: "$y'=4$" },
      { title: "Doubling", background: "Doubling a point from $(3,6)$ to $(6,12)$ preserves scale-free information.", numbers: "keeps ratio $2$" },
      { title: "Threshold", background: "Threshold $y/x>0.8$ depends only on the ratio.", numbers: "true for $(5,4.5)$ and $(50,45)$ because both ratios are $0.9$" }
    ]
  },
  "math-03-11": {
    connectionsProse: "<p>This lesson connects solved first-order equations and units for rates to modeling with first-order odes. The reader can bring the familiar habit of reading a derivative as a local rate of change. Here that habit is organized around the structure that makes this particular kind of equation useful. The lesson prepares for building usable models before solving them, where recognizing the structure before solving is often the most important step.</p>",
    motivation: "<p>Modeling means translating a story about change into a rate law with units that match. The mathematics starts only after the state variable, rate, constant, and initial condition are named. The concrete gap is that the story must be translated before algebra can begin.</p>" +
                "<p>The load-bearing idea is that naming the state, target, rate constant, and initial condition creates the ODE. The derivation or explanation below keeps the algebra tied to that idea, so each step shows why the method applies rather than only recording a formal manipulation. After the structure is clear, the initial data, constants, or numerical values have a specific role to play.</p>",
    definition: "<p>First-order modeling translates a changing quantity into a rate law, often by naming a state, a target, a rate constant, and an initial condition.</p>" +
                "<p>For Newton cooling, $$T'=-k(T-20).$$</p>" +
                "<p><b>Assumptions that matter:</b> Units must match, the target or ambient value must be stated, and the sign of the rate should match the story.</p>",
    symbols: [
      { sym: "$T$", desc: "the state" },
      { sym: "$t$", desc: "time" },
      { sym: "$k$", desc: "a rate constant with units $1/$time" },
      { sym: "ambient temperature", desc: "the target" },
      { sym: "initial condition", desc: "fixes the starting gap" }
    ],
    derivation: [
      { do: "Choose the state.", result: "$T(t)$", why: "the temperature changes over time" },
      { do: "Identify ambient temperature.", result: "$20$", why: "the gap is $T-20$" },
      { do: "State proportional cooling.", result: "$T'=-k(T-20)$", why: "hotter objects cool faster toward the room" },
      { do: "Use the data.", result: "$k=0.2$ and $T(0)=80$", why: "units are per minute" },
      { do: "Separate the gap equation.", result: "$d(T-20)/(T-20)=-0.2dt$", why: "the gap decays" },
      { do: "Integrate.", result: "$T-20=Ce^{-0.2t}$", why: "proportional decay gives an exponential gap" },
      { do: "Use the initial condition.", result: "$C=60$", why: "$T(0)=80$ starts $60$ above ambient" },
      { do: "Compute the prediction.", result: "$T(5)=20+60e^{-1}\\approx42.07$", why: "the model now gives a number" }
    ],
    applications: [
      { title: "Cooling gap", background: "Cooling gap $60$ with $k=0.2$ gives initial proportional cooling.", numbers: "cools initially at $12^\\circ$/min" },
      { title: "Tank balance", background: "Tank inflow $12$ g/min and outflow $S/25$ balance when rates match.", numbers: "$S=300$ g" },
      { title: "Queue rate", background: "$Q'=90-0.3Q$ at $Q=100$ gives net accumulation.", numbers: "$60$ jobs/min" },
      { title: "Gradient model", background: "For $J=0.2(w-5)^2$, gradient flow moves $w=1$ toward $5$.", numbers: "$w'=-0.4(w-5)$ moves $w=1$ at rate $1.6$" },
      { title: "Logistic model", background: "Logistic $0.5P(1-P/1000)$ at half carrying capacity is largest.", numbers: "at $P=500$ gives $125$" },
      { title: "Smoothing model", background: "$m'=0.2(70-50)$ measures movement toward a target.", numbers: "$4$ units/min" }
    ]
  },
  "math-03-12": {
    connectionsProse: "<p>This lesson connects slope fields and initial conditions to the existence–uniqueness theorem. The reader can bring the familiar habit of reading a derivative as a local rate of change. Here that habit is organized around the structure that makes this particular kind of equation useful. The lesson prepares for knowing when an IVP is well posed, where recognizing the structure before solving is often the most important step.</p>",
    motivation: "<p>Existence says a solution starts at the initial point. Uniqueness says there is not a second solution curve passing through the same point under the same well-behaved slope rule. The concrete gap is that a drawn slope field can suggest paths but not guarantee a single one.</p>" +
                "<p>The load-bearing idea is that continuity and controlled y-dependence give local existence and uniqueness. The derivation or explanation below keeps the algebra tied to that idea, so each step shows why the method applies rather than only recording a formal manipulation. After the structure is clear, the initial data, constants, or numerical values have a specific role to play.</p>",
    definition: "<p>The existence–uniqueness theorem says that an IVP $y'=f(x,y)$, $y(x_0)=y_0$ has a local solution, and that solution is unique, when the slope field is continuous and has controlled dependence on $y$ near the initial point.</p>" +
                "<p><b>Assumptions that matter:</b> Continuity gives slopes to follow, and controlled $y$-dependence, often checked through $f_y$, prevents two nearby curves from splitting through one initial point.</p>",
    symbols: [
      { sym: "$f(x,y)$", desc: "the slope field" },
      { sym: "$f_y$", desc: "measures slope sensitivity to $y$" },
      { sym: "$(x_0,y_0)$", desc: "the initial point" },
      { sym: "guaranteed interval", desc: "local" }
    ],
    applications: [
      { title: "Product slope", background: "For $y'=xy$, $f_y=x$ is continuous.", numbers: "the path through $(1,2)$ is unique locally" },
      { title: "Linear slope", background: "For $y'=x+y$, $f_y=1$ controls dependence on $y$.", numbers: "no crossings in the region" },
      { title: "Undefined slope", background: "$y'=1/(y-2)$ cannot start at the singular value.", numbers: "fails at $y(0)=2$ because the slope is undefined" },
      { title: "Nonunique example", background: "$y'=\\sqrt{|y|}$ has weak dependence at $y=0$.", numbers: "$y(0)=0$ has nonunique delayed-start behavior" },
      { title: "Neural ODE field", background: "A Neural ODE field with bounded state derivative is locally controlled.", numbers: "state derivative bounded by $3$" },
      { title: "Velocity decay", background: "$v'=-0.1v$, $v(0)=20$ has a unique exponential trajectory.", numbers: "one trajectory $20e^{-0.1t}$" }
    ]
  },
  "math-03-13": {
    connectionsProse: "<p>This lesson connects linear combinations and two initial data values to second-order linear ode theory. The reader can bring the familiar habit of reading a derivative as a local rate of change. Here that habit is organized around the structure that makes this particular kind of equation useful. The lesson prepares for the theory behind second-order homogeneous solutions, where recognizing the structure before solving is often the most important step.</p>",
    motivation: "<p>A second-order linear homogeneous equation has a two-dimensional solution space. Two independent solutions are enough because two initial values determine the two constants. The concrete gap is that one solution is not enough for a second-order equation.</p><p>The load-bearing idea is that two independent modes span the solution family. The derivation or explanation below keeps the algebra tied to that idea, so each step shows why the method applies rather than only recording a formal manipulation. After the structure is clear, the initial data, constants, or numerical values have a specific role to play.</p>",
    definition: "<p>A second-order linear equation has a two-dimensional homogeneous solution space when two independent solutions are available.</p><p>$$y=C_1y_1+C_2y_2.$$</p><p><b>Assumptions that matter:</b> Independence is checked by a nonzero Wronskian on the interval, and two initial data values set the constants.</p>",
    symbols: [ { sym: "$a_2,a_1,a_0$", desc: "coefficient functions" }, { sym: "$g$", desc: "forcing" }, { sym: "$W$", desc: "the Wronskian" }, { sym: "$C_1,C_2$", desc: "constants set by position and velocity" } ],
    derivation: [
      { do: "Verify $y_1=e^t$ and $y_2=e^{-2t}$ solve $y''+y'-2y=0$.", result: "$0$", why: "substitution gives zero" },
      { do: "Compute the Wronskian.", result: "$W=y_1y_2'-y_1'y_2=-3e^{-t}$", why: "nonzero means independence" },
      { do: "Write the general solution.", result: "$y=C_1e^t+C_2e^{-2t}$", why: "linearity allows combinations" },
      { do: "Apply $y(0)=3$.", result: "$C_1+C_2=3$", why: "the initial position gives one equation" },
      { do: "Differentiate.", result: "$y'=C_1e^t-2C_2e^{-2t}$", why: "velocity supplies the second equation" },
      { do: "Apply $y'(0)=0$.", result: "$C_1-2C_2=0$", why: "the initial velocity fixes the second relation" },
      { do: "Solve the constants.", result: "$C_1=2$, $C_2=1$, so $y=2e^t+e^{-2t}$", why: "two independent data values determine the solution" }
    ],
    applications: [
      { title: "Oscillator", background: "$x''+4x=0$, $x(0)=3$, $x'(0)=0$ gives $x=3\\cos2t$.", numbers: "$x(\\pi/4)=0$" },
      { title: "Mode mixture", background: "$q=2e^{-t}+e^{-3t}$ has computable initial data.", numbers: "$q(0)=3$, $q'(0)=-5$" },
      { title: "Error mode", background: "Error mode $10e^{-0.5t}$ decays exponentially.", numbers: "$1.35$ at $t=4$" },
      { title: "Angle decay", background: "$5e^{-2t}$ gives decaying angle.", numbers: "$0.677^\\circ$ at $t=1$" },
      { title: "Two decays", background: "$6e^{-t}-2e^{-2t}$ combines two modes.", numbers: "$0.775$ at $t=2$" },
      { title: "Weighted modes", background: "$0.7e^{-3}+0.3e^{-9}$ evaluates the two-mode state.", numbers: "$\\approx0.0350$ at $t=1$" }
    ]
  },
  "math-03-14": {
    connectionsProse: "<p>This lesson connects exponential solutions from first-order equations to constant-coefficient homogeneous equations. The reader can bring the familiar habit of reading a derivative as a local rate of change. Here that habit is organized around the structure that makes this particular kind of equation useful. The lesson prepares for constant-coefficient linear ODEs of higher order, where recognizing the structure before solving is often the most important step.</p>",
    motivation: "<p>Constant coefficients make exponentials natural because derivatives of $e^{rt}$ only multiply by powers of $r$. The ODE becomes a polynomial equation for the growth or decay rates. The concrete gap is that differentiation of a general function is hard to predict.</p><p>The load-bearing idea is that exponentials turn derivatives into powers of a rate r. The derivation or explanation below keeps the algebra tied to that idea, so each step shows why the method applies rather than only recording a formal manipulation. After the structure is clear, the initial data, constants, or numerical values have a specific role to play.</p>",
    definition: "<p>For a constant-coefficient homogeneous equation, trying $y=e^{rt}$ turns the ODE into the characteristic equation.</p><p>$$ar^2+br+c=0.$$</p><p><b>Assumptions that matter:</b> Coefficients are constant, $e^{rt}\\ne0$, and distinct roots give independent exponential modes.</p>",
    symbols: [ { sym: "$r$", desc: "a characteristic root" }, { sym: "$a,b,c$", desc: "constants" }, { sym: "$C_i$", desc: "mode weights" }, { sym: "$\\alpha\\pm i\\beta$", desc: "complex roots producing $e^{\\alpha t}\\cos\\beta t$ and $e^{\\alpha t}\\sin\\beta t$" } ],
    derivation: [
      { do: "Start with $ay''+by'+cy=0$.", result: "$ay''+by'+cy=0$", why: "coefficients are constants" },
      { do: "Try an exponential.", result: "$y=e^{rt}$", why: "exponentials keep their shape under differentiation" },
      { do: "Compute derivatives.", result: "$y'=re^{rt}$ and $y''=r^2e^{rt}$", why: "each derivative multiplies by $r$" },
      { do: "Substitute.", result: "$(ar^2+br+c)e^{rt}=0$", why: "all terms share the exponential" },
      { do: "Set the polynomial to zero.", result: "$ar^2+br+c=0$", why: "since $e^{rt}\\ne0$" },
      { do: "Use distinct roots.", result: "$e^{r_1t},e^{r_2t}$", why: "distinct roots give independent modes" },
      { do: "Solve $y''-3y'+2y=0$.", result: "roots $1,2$", why: "the characteristic equation factors" },
      { do: "Apply $y(0)=5$, $y'(0)=8$.", result: "$C_1=2$, $C_2=3$ and $y=2e^t+3e^{2t}$", why: "the initial data solve $C_1+C_2=5$, $C_1+2C_2=8$" }
    ],
    applications: [
      { title: "Decay modes", background: "$r^2+6r+8=0$ gives modes $e^{-2t},e^{-4t}$.", numbers: "at $t=1$ they are $0.135,0.0183$" },
      { title: "Fast pole", background: "Pole $-50$ sets the time constant.", numbers: "time constant $0.02$s and four-time-constant settling about $0.08$s" },
      { title: "Slow mode", background: "Mode $e^{-0.2t}$ decays over 10 units.", numbers: "keeps $0.135$ after $10$ units" },
      { title: "Oscillatory roots", background: "Roots $-3\\pm40i$ determine oscillation frequency.", numbers: "$40/(2\\pi)\\approx6.37$ Hz" },
      { title: "Queue recovery", background: "$100e^{-3}+20e^{-15}$ evaluates recovery at $t=3$.", numbers: "$\\approx4.98$" },
      { title: "Euler multiplier", background: "Euler multiplier $0.5$ for $y'=-10y$, $h=0.05$ repeats ten steps.", numbers: "$0.5^{10}\\approx0.00098$" }
    ]
  },
  "math-03-15": {
    connectionsProse: "<p>This lesson connects homogeneous modes and standard forcing shapes to method of undetermined coefficients. The reader can bring the familiar habit of reading a derivative as a local rate of change. Here that habit is organized around the structure that makes this particular kind of equation useful. The lesson prepares for nonhomogeneous constant-coefficient equations, where recognizing the structure before solving is often the most important step.</p>",
    motivation: "<p>When forcing has a standard shape, a matching trial form turns a nonhomogeneous constant-coefficient ODE into algebra. The concrete gap is that the natural modes do not include the forced response.</p><p>The load-bearing idea is that a matching trial form reduces the particular solution to algebra. The derivation or explanation below keeps the algebra tied to that idea, so each step shows why the method applies rather than only recording a formal manipulation. After the structure is clear, the initial data, constants, or numerical values have a specific role to play.</p>",
    definition: "<p>Undetermined coefficients solves a nonhomogeneous constant-coefficient ODE by adding one particular solution to the homogeneous solution.</p><p>$$y=y_h+y_p.$$</p><p><b>Assumptions that matter:</b> The forcing must have a standard trial shape; if the trial overlaps a homogeneous mode, multiply by enough powers of $t$.</p>",
    symbols: [ { sym: "$L$", desc: "the linear differential operator" }, { sym: "$y_h$", desc: "homogeneous solution" }, { sym: "$y_p$", desc: "one particular solution" }, { sym: "$A$", desc: "an unknown trial coefficient" } ],
    derivation: [
      { do: "Solve the homogeneous characteristic equation for $y''-3y'+2y=e^{3t}$.", result: "$r^2-3r+2=0$ has roots $1,2$", why: "these give natural modes" },
      { do: "Choose a trial particular solution.", result: "$y_p=Ae^{3t}$", why: "$e^{3t}$ is not a natural mode and matches the forcing shape" },
      { do: "Compute derivatives.", result: "$y_p'=3Ae^{3t}$ and $y_p''=9Ae^{3t}$", why: "substitution needs the trial derivatives" },
      { do: "Substitute.", result: "$(9A-9A+2A)e^{3t}=e^{3t}$", why: "collect coefficients" },
      { do: "Solve for $A$.", result: "$2A=1$, so $A=1/2$", why: "matching coefficients makes the ODE true" },
      { do: "Combine homogeneous and particular parts.", result: "$C_1e^t+C_2e^{2t}+\\tfrac12e^{3t}$", why: "the full solution is natural motion plus forced response" }
    ],
    applications: [
      { title: "Cosine forcing", background: "$x''+4x=8\\cos t$ has a nonresonant cosine trial.", numbers: "particular amplitude $8/(4-1)=8/3\\approx2.67$" },
      { title: "Constant forcing", background: "$T'+0.5T=10$ has a constant particular solution.", numbers: "constant particular value $20$" },
      { title: "Ramp forcing", background: "$y'+y=2t$ uses a linear trial.", numbers: "trial $At+B$ and $y_p=2t-2$" },
      { title: "Harmonic response", background: "$y''+9y=5\\cos2t$ has a cosine particular solution.", numbers: "amplitude $1$" },
      { title: "Exponential forcing", background: "$m'+3m=e^{-t}$ uses an exponential trial.", numbers: "$m_p=0.5e^{-t}$" },
      { title: "Queue forcing", background: "$q'+4q=12$ has a constant particular state.", numbers: "$q_p=3$" }
    ]
  },
  "math-03-16": {
    connectionsProse: "<p>This lesson connects homogeneous solution bases and the Wronskian to variation of parameters. The reader can bring the familiar habit of reading a derivative as a local rate of change. Here that habit is organized around the structure that makes this particular kind of equation useful. The lesson prepares for a systematic method for arbitrary forcing, where recognizing the structure before solving is often the most important step.</p>",
    motivation: "<p>Variation of parameters keeps the homogeneous solutions but lets their coefficients become functions. It replaces guessing a forcing shape with a systematic integral recipe. The concrete gap is that guessing a trial form only works for selected inputs.</p><p>The load-bearing idea is that letting the mode weights vary produces integral formulas. The derivation or explanation below keeps the algebra tied to that idea, so each step shows why the method applies rather than only recording a formal manipulation. After the structure is clear, the initial data, constants, or numerical values have a specific role to play.</p>",
    definition: "<p>Variation of parameters finds a particular solution by replacing constant homogeneous coefficients with functions.</p><p>$$y_p=u_1y_1+u_2y_2.$$</p><p><b>Assumptions that matter:</b> The equation is in standard form with leading coefficient $1$, and $y_1,y_2$ form a fundamental homogeneous pair with nonzero Wronskian.</p>",
    symbols: [ { sym: "$u_1,u_2$", desc: "varying coefficients" }, { sym: "$W=y_1y_2'-y_1'y_2$", desc: "the Wronskian" }, { sym: "$g(t)$", desc: "forcing" }, { sym: "standard form", desc: "has leading coefficient $1$" } ],
    derivation: [
      { do: "Start with homogeneous solutions.", result: "$y_1,y_2$", why: "they span natural motion" },
      { do: "Try varying coefficients.", result: "$y_p=u_1y_1+u_2y_2$", why: "let weights vary" },
      { do: "Impose an auxiliary condition.", result: "$u_1'y_1+u_2'y_2=0$", why: "this removes second-derivative clutter" },
      { do: "Differentiate and substitute into the ODE.", result: "homogeneous terms cancel", why: "only the forcing terms remain" },
      { do: "Record the remaining condition.", result: "$u_1'y_1'+u_2'y_2'=g$", why: "this completes a $2\\times2$ system" },
      { do: "Solve for the coefficient derivatives.", result: "$u_1'=-y_2g/W$, $u_2'=y_1g/W$", why: "the Wronskian is the determinant" },
      { do: "Integrate and apply $y''+y=e^t$.", result: "$y_1=\\cos t$, $y_2=\\sin t$, $W=1$, and a particular solution is $e^t/2$", why: "integrating $u_1',u_2'$ gives the particular response" }
    ],
    applications: [
      { title: "Scaled forcing", background: "If $g=2e^t$ in $y''+y=g$, the particular response scales linearly.", numbers: "particular solution is $e^t$" },
      { title: "Zero-state step", background: "Zero-state $y''+y=1$ responds to constant forcing.", numbers: "$y=1-\\cos t$" },
      { title: "Ramp input", background: "$y''+y=t$ has a simple particular response.", numbers: "$y_p=t$" },
      { title: "Cosine input", background: "$y''+4y=3\\cos t$ is nonresonant.", numbers: "response $\\cos t$" },
      { title: "First-order steady state", background: "$y'+5y=0.2$ has a constant target.", numbers: "steady value $0.04$" },
      { title: "Queue target", background: "$z'+0.4z=8$ balances at a target.", numbers: "steady target $20$" }
    ]
  },
  "math-03-17": {
    connectionsProse: "<p>This lesson connects second-order oscillators and sinusoidal forcing to forced oscillations and resonance. The reader can bring the familiar habit of reading a derivative as a local rate of change. Here that habit is organized around the structure that makes this particular kind of equation useful. The lesson prepares for resonance, filters, sensors, and vibration models, where recognizing the structure before solving is often the most important step.</p>",
    motivation: "<p>A sinusoidal force produces a sinusoidal response whose amplitude depends on the gap between forcing frequency and natural frequency. Resonance is the limiting case where that gap vanishes in the undamped model. The concrete gap is that forcing frequency may compete with a system natural frequency.</p><p>The load-bearing idea is that substitution shows how the frequency gap controls amplitude. The derivation or explanation below keeps the algebra tied to that idea, so each step shows why the method applies rather than only recording a formal manipulation. After the structure is clear, the initial data, constants, or numerical values have a specific role to play.</p>",
    definition: "<p>Forced oscillation studies an oscillator driven by a sinusoidal input; in the undamped nonresonant case the response amplitude is controlled by the frequency gap.</p><p>$$A=\\frac{F_0}{\\omega_0^2-\\omega^2}.$$</p><p><b>Assumptions that matter:</b> This displayed amplitude is for the undamped model with $\\omega\\ne\\omega_0$; resonance requires a different trial form.</p>",
    symbols: [ { sym: "$m,c,k$", desc: "mass, damping, stiffness" }, { sym: "$F_0$", desc: "forcing amplitude" }, { sym: "$\\omega$", desc: "forcing angular frequency" }, { sym: "$\\omega_0$", desc: "natural frequency" }, { sym: "$A$", desc: "response amplitude" } ],
    derivation: [
      { do: "Try a cosine particular solution for $x''+\\omega_0^2x=F_0\\cos\\omega t$.", result: "$x_p=A\\cos\\omega t$", why: "forcing is cosine" },
      { do: "Compute the second derivative.", result: "$x_p''=-A\\omega^2\\cos\\omega t$", why: "substitution needs acceleration" },
      { do: "Substitute.", result: "$A(\\omega_0^2-\\omega^2)\\cos\\omega t=F_0\\cos\\omega t$", why: "collect the cosine terms" },
      { do: "Match coefficients.", result: "$A=F_0/(\\omega_0^2-\\omega^2)$", why: "valid when $\\omega\\ne\\omega_0$" },
      { do: "Handle resonance.", result: "multiply by $t$", why: "if $\\omega=\\omega_0$, the trial overlaps the homogeneous mode and produces growing resonant form" },
      { do: "Apply $x''+4x=3\\cos t$.", result: "$A=3/(4-1)=1$", why: "the frequency gap is nonzero" }
    ],
    applications: [
      { title: "Bridge mode", background: "Bridge mode $2.0$ Hz and forcing $1.9$ Hz are close.", numbers: "differ by $5\\%$" },
      { title: "Bandwidth", background: "Bandwidth $0.5$ MHz around a center selects nearby frequencies.", numbers: "selects $64$ MHz and attenuates $63$ MHz if centered tightly" },
      { title: "Equalizer", background: "Equalizer with center $1000$ Hz and $Q=10$ has bandwidth center divided by $Q$.", numbers: "bandwidth $100$ Hz" },
      { title: "Damped envelope", background: "Envelope $e^{-0.1t}$ decays over time.", numbers: "leaves $0.368$ at $t=10$ and $0.0067$ at $t=50$" },
      { title: "Daily cycle", background: "Period $10$ min converts to angular frequency.", numbers: "$2\\pi/10\\approx0.628$ rad/min" },
      { title: "Sensor ratio", background: "A forcing-to-natural frequency comparison checks resonance risk.", numbers: "$20/200=0.1$ is well below natural frequency" }
    ]
  },
  "math-03-18": {
    connectionsProse: "<p>This lesson connects constant-coefficient characteristic equations to higher-order linear odes. The reader can bring the familiar habit of reading a derivative as a local rate of change. Here that habit is organized around the structure that makes this particular kind of equation useful. The lesson prepares for higher-order dynamics and repeated modes, where recognizing the structure before solving is often the most important step.</p>",
    motivation: "<p>An $n$th-order linear equation needs $n$ independent constants. Constant coefficients turn the search for those modes into an $n$th-degree characteristic polynomial. The concrete gap is that more stored derivative data requires more constants.</p><p>The load-bearing idea is that an nth-degree characteristic polynomial supplies the needed modes. The derivation or explanation below keeps the algebra tied to that idea, so each step shows why the method applies rather than only recording a formal manipulation. After the structure is clear, the initial data, constants, or numerical values have a specific role to play.</p>",
    definition: "<p>An $n$th-order linear constant-coefficient ODE uses a characteristic polynomial of degree $n$ to supply $n$ modes and constants.</p><p>$$a_nr^n+\\cdots+a_1r+a_0=0.$$</p><p><b>Assumptions that matter:</b> The leading coefficient is nonzero, and repeated roots require multiplying by powers of $t$.</p>",
    symbols: [ { sym: "$y^{(n)}$", desc: "the $n$th derivative" }, { sym: "$a_n$", desc: "the leading coefficient" }, { sym: "root multiplicity $m$", desc: "contributes $t^0e^{rt}$ through $t^{m-1}e^{rt}$" } ],
    derivation: [
      { do: "Try an exponential for $y'''-6y''+11y'-6y=0$.", result: "$y=e^{rt}$", why: "derivatives become powers of $r$" },
      { do: "Substitute.", result: "$(r^3-6r^2+11r-6)e^{rt}=0$", why: "the exponential factors out" },
      { do: "Set the characteristic polynomial.", result: "$r^3-6r^2+11r-6=0$", why: "$e^{rt}\\ne0$" },
      { do: "Factor.", result: "$(r-1)(r-2)(r-3)=0$", why: "roots are $1,2,3$" },
      { do: "Write the solution.", result: "$y=C_1e^t+C_2e^{2t}+C_3e^{3t}$", why: "each root gives a mode" },
      { do: "Use $y(0)=6$, $y'(0)=14$, $y''(0)=36$.", result: "$C_1+C_2+C_3=6$, $C_1+2C_2+3C_3=14$, $C_1+4C_2+9C_3=36$", why: "three initial data values determine three constants" },
      { do: "Solve the system.", result: "the constants are $1,2,3$", why: "the initial data select one solution" }
    ],
    applications: [
      { title: "Beam scaling", background: "Beam deflection scaling $L^4$ magnifies length changes.", numbers: "doubling length multiplies deflection by $16$" },
      { title: "Filter order", background: "Fourth-order filter rolloff compounds across stages.", numbers: "about $80$ dB per decade" },
      { title: "Repeated decay", background: "Four identical decay stages with rate $2$ create repeated-root modes.", numbers: "repeated root $-2$ and modes through $t^3e^{-2t}$" },
      { title: "Spline segment", background: "A cubic spline segment is governed by a fourth-order coefficient set.", numbers: "four coefficients" },
      { title: "Slow pole", background: "Slow pole $-0.5$ sets settling time by $4/|r|$.", numbers: "settling about $4/0.5=8$s" },
      { title: "Discrete root", background: "Discrete root $0.9$ decays over repeated steps.", numbers: "keeps $0.9^{20}\\approx0.122$" }
    ]
  },
  "math-03-19": {
    connectionsProse: "<p>This lesson connects position-velocity state descriptions to systems of first-order odes. The reader can bring the familiar habit of reading a derivative as a local rate of change. Here that habit is organized around the structure that makes this particular kind of equation useful. The lesson prepares for matrix methods and phase-plane analysis, where recognizing the structure before solving is often the most important step.</p>",
    motivation: "<p>A system tracks several changing quantities at once. Rewriting higher-order scalar equations as first-order systems puts all needed memory into one state vector. The concrete gap is that a higher-order scalar equation carries hidden memory.</p><p>The load-bearing idea is that a state vector stores all variables needed for first-order evolution. The derivation or explanation below keeps the algebra tied to that idea, so each step shows why the method applies rather than only recording a formal manipulation. After the structure is clear, the initial data, constants, or numerical values have a specific role to play.</p>",
    definition: "<p>A system of first-order ODEs tracks a vector state and its component rates.</p><p>$$x'=f(t,x).$$</p><p><b>Assumptions that matter:</b> Each state component must store enough information to make the next derivative first-order.</p>",
    symbols: [ { sym: "$\\mathbf{x}$", desc: "the state vector" }, { sym: "$\\mathbf{f}$", desc: "the vector field" }, { sym: "$A$", desc: "a system matrix" }, { sym: "$\\mathbf{b}(t)$", desc: "forcing" } ],
    derivation: [
      { do: "Set $x_1=y$ for $y''+3y'+2y=0$.", result: "$x_1=y$", why: "first state is position" },
      { do: "Set $x_2=y'$.", result: "$x_2=y'$", why: "second state stores velocity" },
      { do: "Differentiate $x_1$.", result: "$x_1'=y'=x_2$", why: "the first equation is first-order" },
      { do: "Solve the ODE for $y''$.", result: "$y''=-3y'-2y$", why: "isolate acceleration" },
      { do: "Substitute states.", result: "$x_2'=-2x_1-3x_2$", why: "write acceleration in state variables" },
      { do: "Write vector form.", result: "$x'=\\begin{bmatrix}0&1\\-2&-3\\end{bmatrix}x$", why: "the system is linear" },
      { do: "Translate initial data.", result: "$x(0)=(3,0)$", why: "$y(0)=3$, $y'(0)=0$ become state coordinates" }
    ],
    applications: [
      { title: "SIR system", background: "SIR $S'=-0.002SI$ with $S=900,I=10$ gives susceptible change.", numbers: "$-18$" },
      { title: "Predator-prey", background: "Predator-prey $x'=0.5x-0.02xy$ at $(40,10)$ gives prey growth.", numbers: "$12$" },
      { title: "Momentum state", background: "Momentum state $v'=-0.1v-2x$ at $(x,v)=(3,4)$ gives acceleration.", numbers: "$-6.4$" },
      { title: "Reaction", background: "Reaction $A\\to B$ at rate $0.3A$, $A=50$, transfers mass.", numbers: "$A'=-15$, $B'=15$" },
      { title: "Position-velocity", background: "State $(x,v)=(2,-1)$ stores velocity directly.", numbers: "$x'=-1$" },
      { title: "Interest coupling", background: "Interest $i'=0.4c-0.1i$ with $c=5,i=8$ combines signals.", numbers: "$1.2$" }
    ]
  },
  "math-03-20": {
    connectionsProse: "<p>This lesson connects the scalar exponential solution of x prime equals ax to the matrix exponential. The reader can bring the familiar habit of reading a derivative as a local rate of change. Here that habit is organized around the structure that makes this particular kind of equation useful. The lesson prepares for linear systems with constant matrices, where recognizing the structure before solving is often the most important step.</p>",
    motivation: "<p>The matrix exponential is the flow map for a constant linear system. It generalizes $x(t)=e^{at}x(0)$ from one scalar rate to a whole matrix of coupled rates. The concrete gap is that coupled coordinates cannot be advanced by a scalar factor.</p><p>The load-bearing idea is that the matrix exponential is the state-transition map. The derivation or explanation below keeps the algebra tied to that idea, so each step shows why the method applies rather than only recording a formal manipulation. After the structure is clear, the initial data, constants, or numerical values have a specific role to play.</p>",
    definition: "<p>The matrix exponential is the state-transition matrix for a constant linear system.</p><p>$$e^{At}=I+At+\\frac{(At)^2}{2!}+\\cdots.$$</p><p><b>Assumptions that matter:</b> $A$ is a constant square matrix, and the power series can be differentiated term by term for finite matrices.</p>",
    symbols: [ { sym: "$A$", desc: "a constant square matrix" }, { sym: "$I$", desc: "the identity" }, { sym: "$x_0$", desc: "the initial state" }, { sym: "$e^{At}$", desc: "the state-transition matrix" } ],
    derivation: [
      { do: "Define the matrix exponential.", result: "$e^{At}=I+At+(At)^2/2!+\\cdots$", why: "use the same power series as the scalar exponential" },
      { do: "Differentiate term by term.", result: "$A+A^2t+A^3t^2/2!+\\cdots$", why: "convergence permits this for finite matrices" },
      { do: "Factor out $A$.", result: "$Ae^{At}$", why: "the derivative has the original series after $A$" },
      { do: "Let the state be advanced by the exponential.", result: "$x(t)=e^{At}x_0$", why: "this proposes the flow map" },
      { do: "Differentiate the state.", result: "$x'=Ae^{At}x_0=Ax(t)$", why: "it satisfies the system" },
      { do: "Check the initial value.", result: "$e^{A0}=I$, so $x(0)=x_0$", why: "the flow starts at the initial state" },
      { do: "Evaluate a diagonal example.", result: "for $A=\\operatorname{diag}(2,-1)$, $e^{At}=\\operatorname{diag}(e^{2t},e^{-t})$", why: "diagonal entries exponentiate independently" }
    ],
    applications: [
      { title: "Stable mode", background: "Mode rate $-4$ over $0.5$s multiplies by an exponential factor.", numbers: "$e^{-2}\\approx0.135$" },
      { title: "Retention", background: "Leaving rate $0.2$ over $5$ units gives stay probability.", numbers: "$e^{-1}\\approx0.368$" },
      { title: "Depth damping", background: "Stable eigenvalue $-0.1$ over depth $20$ decays a mode.", numbers: "$0.135$" },
      { title: "Rotation", background: "Angular speed $\\pi/2$ for $2$s gives total angle.", numbers: "$\\pi$, or $180^\\circ$" },
      { title: "Small damping", background: "Damping $-0.5$ over $0.1$s gives a short-step factor.", numbers: "$e^{-0.05}\\approx0.951$" },
      { title: "Growth", background: "Growth rate $0.08$ for $30$ days compounds exponentially.", numbers: "$e^{2.4}\\approx11.02$" }
    ]
  },
  "math-03-21": {
    connectionsProse: "<p>This lesson connects eigenvectors and scalar exponential growth to eigenvalue methods for systems. The reader can bring the familiar habit of reading a derivative as a local rate of change. Here that habit is organized around the structure that makes this particular kind of equation useful. The lesson prepares for modal solutions for coupled systems, where recognizing the structure before solving is often the most important step.</p>",
    motivation: "<p>Eigenvectors find directions where a coupled linear system behaves like a scalar exponential. In those coordinates, each mode grows or decays by its own eigenvalue. The concrete gap is that a matrix can mix coordinates in ordinary axes.</p><p>The load-bearing idea is that eigenvector coordinates separate the system into scalar modes. The derivation or explanation below keeps the algebra tied to that idea, so each step shows why the method applies rather than only recording a formal manipulation. After the structure is clear, the initial data, constants, or numerical values have a specific role to play.</p>",
    definition: "<p>Eigenvalue methods solve $x'=Ax$ by finding directions $v$ where the matrix acts like scalar multiplication.</p><p>$$Av=\\lambda v.$$</p><p><b>Assumptions that matter:</b> If enough eigenvectors form a basis, the solution is a sum of modal exponentials.</p>",
    symbols: [ { sym: "$A$", desc: "the system matrix" }, { sym: "$v$", desc: "an eigenvector" }, { sym: "$\\lambda$", desc: "its rate" }, { sym: "$PDP^{-1}$", desc: "diagonalizes $A$ when enough eigenvectors exist" } ],
    derivation: [
      { do: "Suppose $Av=\\lambda v$.", result: "$Av=\\lambda v$", why: "$v$ is an eigenvector" },
      { do: "Try a modal solution.", result: "$x(t)=Ce^{\\lambda t}v$", why: "scalar exponential along that direction" },
      { do: "Differentiate.", result: "$x'=C\\lambda e^{\\lambda t}v$", why: "the scalar exponential contributes $\\lambda$" },
      { do: "Apply $A$ to the trial solution.", result: "$Ax=Ce^{\\lambda t}Av=C\\lambda e^{\\lambda t}v$", why: "the eigenvector relation replaces $Av$" },
      { do: "Compare both sides.", result: "$x'=Ax$", why: "the modal expression is a solution" },
      { do: "Add modes when eigenvectors form a basis.", result: "a sum of eigenvector modes", why: "linearity allows superposition" },
      { do: "Apply $A=\\begin{bmatrix}2&1\\1&2\\end{bmatrix}$ and $(4,2)=3(1,1)+1(1,-1)$.", result: "$x(t)=3e^{3t}(1,1)+e^t(1,-1)$", why: "eigenpairs are $3,(1,1)$ and $1,(1,-1)$" }
    ],
    applications: [
      { title: "Two stable eigenvalues", background: "Eigenvalues $-1,-4$ decay at different speeds.", numbers: "factors $0.135$ and $0.000335$ at $t=2$" },
      { title: "Discrete damping", background: "Damping $0.85$ repeated ten times shrinks a mode.", numbers: "$0.85^{10}\\approx0.197$" },
      { title: "PCA variance", background: "PCA variances $9,1$ compare strength along eigen-directions.", numbers: "a $9:1$ direction ratio" },
      { title: "Difference mode", background: "Difference mode $e^{-0.3t}$ decays over 10 minutes.", numbers: "$0.050$ after $10$ minutes" },
      { title: "Discrete growth", background: "Discrete eigenvalue $1.02$ compounds over 100 steps.", numbers: "$1.02^{100}\\approx7.24$" },
      { title: "Vibration mode", background: "A $12$ Hz vibration eigenmode repeats in time.", numbers: "completes $12$ cycles per second" }
    ]
  },
  "math-03-22": {
    connectionsProse: "<p>This lesson connects systems of first-order equations and vector fields to phase-plane analysis. The reader can bring the familiar habit of reading a derivative as a local rate of change. Here that habit is organized around the structure that makes this particular kind of equation useful. The lesson prepares for qualitative analysis without closed forms, where recognizing the structure before solving is often the most important step.</p>",
    motivation: "<p>The phase plane shows a two-dimensional autonomous system as arrows in state space. Nullclines and equilibria organize the picture before exact solutions are known. The concrete gap is that time graphs can hide the geometry of a two-state system.</p><p>The load-bearing idea is that arrows, nullclines, and equilibria organize motion in state space. The derivation or explanation below keeps the algebra tied to that idea, so each step shows why the method applies rather than only recording a formal manipulation. After the structure is clear, the initial data, constants, or numerical values have a specific role to play.</p>",
    definition: "<p>Phase-plane analysis studies an autonomous two-state system by drawing its vector field, nullclines, equilibria, and local linear behavior.</p><p>$$x'=f(x,y),\\qquad y'=g(x,y).$$</p><p><b>Assumptions that matter:</b> The system is autonomous and two-dimensional for the phase-plane picture.</p>",
    symbols: [ { sym: "$x,y$", desc: "state coordinates" }, { sym: "nullclines", desc: "derivative-zero curves" }, { sym: "equilibria", desc: "intersections" }, { sym: "eigenvalues", desc: "classify nearby linear behavior" } ],
    derivation: [
      { do: "Write the vector field for $x'=y$, $y'=-2x-3y$.", result: "$(f,g)=(y,-2x-3y)$", why: "arrows show instantaneous motion" },
      { do: "Find the $x$-nullcline.", result: "$y=0$", why: "here horizontal motion is zero" },
      { do: "Find the $y$-nullcline.", result: "$-2x-3y=0$", why: "here vertical motion is zero" },
      { do: "Intersect the nullclines.", result: "$(0,0)$", why: "both derivatives vanish" },
      { do: "Write matrix form.", result: "$A=\\begin{bmatrix}0&1\\-2&-3\\end{bmatrix}$", why: "the system is linear" },
      { do: "Find eigenvalues.", result: "$r^2+3r+2=0$, so $r=-1,-2$", why: "trajectories approach the equilibrium along stable directions" }
    ],
    applications: [
      { title: "Predator-prey arrow", background: "Predator-prey at $(40,10)$ gives a prey component.", numbers: "$12$" },
      { title: "Pendulum arrow", background: "Pendulum at angle $0.1$ rad and zero velocity has restoring acceleration.", numbers: "about $-0.98$" },
      { title: "Gradient arrow", background: "Gradient $(4,-2)$ with step $0.1$ gives descent update direction.", numbers: "$(-0.4,0.2)$" },
      { title: "Epidemic coefficient", background: "Epidemic coefficient $0.3S/1000-0.1$ at $S=200$ determines infection direction.", numbers: "$-0.04$" },
      { title: "Controller acceleration", background: "Controller acceleration $-4x-2v$ at $(1,-0.2)$ combines position and velocity.", numbers: "$-3.6$" },
      { title: "Queue arrow", background: "Queue arrow compares arrival and service rates.", numbers: "$120-100=20$ points toward larger backlog" }
    ]
  },
  "math-03-23": {
    connectionsProse: "<p>This lesson connects direction fields and autonomous rate laws to equilibria and stability. The reader can bring the familiar habit of reading a derivative as a local rate of change. Here that habit is organized around the structure that makes this particular kind of equation useful. The lesson prepares for stability and linearization, where recognizing the structure before solving is often the most important step.</p>",
    motivation: "<p>An equilibrium is a state where the derivative is zero. Stability asks whether small nearby disturbances stay near, return, or move away. The concrete gap is that a zero derivative marks rest but not its durability.</p><p>The load-bearing idea is that nearby arrows decide whether disturbances return or move away. The derivation or explanation below keeps the algebra tied to that idea, so each step shows why the method applies rather than only recording a formal manipulation. After the structure is clear, the initial data, constants, or numerical values have a specific role to play.</p>",
    definition: "<p>An equilibrium is a state where the derivative is zero; stability describes what nearby solution curves do after small disturbances.</p><p>$$f(y^*)=0.$$</p><p><b>Assumptions that matter:</b> For a one-dimensional autonomous equation, sign tests on either side of the equilibrium show whether arrows point toward or away.</p>",
    symbols: [ { sym: "$x^*$ or $y^*$", desc: "an equilibrium" }, { sym: "stable", desc: "nearby solutions remain nearby" }, { sym: "asymptotically stable", desc: "nearby solutions approach" }, { sym: "unstable", desc: "some perturbations move away" } ],
    derivation: [
      { do: "Set the logistic derivative to zero.", result: "$y(1-y/10)=0$", why: "equilibria make the derivative zero" },
      { do: "Solve for equilibria.", result: "$y=0$ or $y=10$", why: "these are stationary states" },
      { do: "Test inside the interval.", result: "at $y=5$, derivative $2.5$", why: "arrows point right" },
      { do: "Test above carrying capacity.", result: "at $y=12$, derivative $-2.4$", why: "arrows point left" },
      { do: "Read stability near $10$.", result: "$10$ is stable", why: "nearby arrows point toward $10$" },
      { do: "Read stability near $0$.", result: "$0$ is unstable for positive populations", why: "positive-side arrows point away" }
    ],
    applications: [
      { title: "Logistic near capacity", background: "Logistic with $K=1000$ at $P=900$ still grows.", numbers: "$18$" },
      { title: "Balance", background: "$A'=10-0.5A$ balances when inflow equals outflow.", numbers: "$A=20$" },
      { title: "Return rate", background: "$w'=-2(w-3)$ returns to equilibrium $3$.", numbers: "half-life $\\ln2/2\\approx0.347$" },
      { title: "Temperature target", background: "$T'=0.1(70-T)$ at $T=65$ moves upward.", numbers: "$0.5$ deg/min" },
      { title: "Decay factor", background: "$I'=-0.2I$ decays exponentially.", numbers: "factor $e^{-2}\\approx0.135$ after $10$ days" },
      { title: "Quadratic growth", background: "$s'=1.2s-s^2$ factors to find stationary states.", numbers: "equilibria $0$ and $1.2$" }
    ]
  },
  "math-03-24": {
    connectionsProse: "<p>This lesson connects Taylor approximation and Jacobian matrices to linearization. The reader can bring the familiar habit of reading a derivative as a local rate of change. Here that habit is organized around the structure that makes this particular kind of equation useful. The lesson prepares for local stability of nonlinear systems, where recognizing the structure before solving is often the most important step.</p>",
    motivation: "<p>Linearization replaces a nonlinear vector field near an equilibrium by its best first-order matrix approximation. The Jacobian carries the local motion. The concrete gap is that a nonlinear field can be too complicated globally.</p><p>The load-bearing idea is that near an equilibrium the first-order matrix part controls local motion. The derivation or explanation below keeps the algebra tied to that idea, so each step shows why the method applies rather than only recording a formal manipulation. After the structure is clear, the initial data, constants, or numerical values have a specific role to play.</p>",
    definition: "<p>Linearization approximates a nonlinear system near an equilibrium by its Jacobian matrix acting on perturbations.</p><p>$$u'=Ju.$$</p><p><b>Assumptions that matter:</b> The vector field is differentiable near the equilibrium, and higher-order terms are small for small perturbations.</p>",
    symbols: [ { sym: "$J$", desc: "the Jacobian" }, { sym: "$x^*$", desc: "equilibrium" }, { sym: "$u$", desc: "perturbation" }, { sym: "higher-order terms", desc: "smaller near the equilibrium" } ],
    derivation: [
      { do: "Verify equilibrium for $x'=x(2-x-y)$, $y'=y(1+x-2y)$ at $(1,1)$.", result: "both right sides are $0$", why: "linearization is taken at an equilibrium" },
      { do: "Compute the Jacobian.", result: "$J=\\begin{bmatrix}2-2x-y&-x\\y&1+x-4y\\end{bmatrix}$", why: "partial derivatives of the vector field" },
      { do: "Evaluate at $(1,1)$.", result: "$J=\\begin{bmatrix}-1&-1\\1&-2\\end{bmatrix}$", why: "local coefficients are frozen at the equilibrium" },
      { do: "Define displacement.", result: "$u=(x,y)-(1,1)$", why: "measure perturbation from equilibrium" },
      { do: "Use Taylor expansion.", result: "$f(x^*+u)=f(x^*)+Ju+O(\\|u\\|^2)$", why: "first-order approximation" },
      { do: "Use equilibrium cancellation.", result: "$u'=Ju$", why: "$f(x^*)=0$" },
      { do: "Classify eigenvalues.", result: "$\\lambda^2+3\\lambda+3=0$ with real part $-1.5$", why: "the linearized equilibrium is locally attracting with spiral behavior" }
    ],
    applications: [
      { title: "Settling", background: "Jacobian pole $-4$ sets settling by roughly four time constants.", numbers: "settling about $1$s" },
      { title: "Local growth", background: "Growth rate $0.06$/day compounds over $30$ days.", numbers: "factor $e^{1.8}\\approx6.05$" },
      { title: "Step size", background: "Curvature $20$ limits stable gradient-step size.", numbers: "below $0.1$" },
      { title: "Spiral frequency", background: "Eigenvalue $-0.2\\pm6i$ oscillates with angular frequency $6$.", numbers: "frequency $6/(2\\pi)\\approx0.955$ Hz" },
      { title: "Small-angle approximation", background: "$\\sin(0.05)$ is close to its linearization.", numbers: "$\\approx0.05$ with error about $0.00002$" },
      { title: "Daily compounding", background: "Rate $0.02$/hour over a day exponentiates.", numbers: "$e^{0.48}\\approx1.62$" }
    ]
  },
  "math-03-25": {
    connectionsProse: "<p>This lesson connects Taylor series and coefficient matching to series solutions. The reader can bring the familiar habit of reading a derivative as a local rate of change. Here that habit is organized around the structure that makes this particular kind of equation useful. The lesson prepares for special functions and local approximation methods, where recognizing the structure before solving is often the most important step.</p>",
    motivation: "<p>A power series solves an ODE locally by turning the unknown function into unknown coefficients. The ODE becomes a coefficient-matching rule. The concrete gap is that closed elementary formulas are not always available.</p><p>The load-bearing idea is that the ODE can determine the coefficients of a local power series. The derivation or explanation below keeps the algebra tied to that idea, so each step shows why the method applies rather than only recording a formal manipulation. After the structure is clear, the initial data, constants, or numerical values have a specific role to play.</p>",
    definition: "<p>A series solution assumes the unknown function has a local power series and determines its coefficients by matching powers.</p><p>$$y=\\sum_{n=0}^\\infty a_nx^n.$$</p><p><b>Assumptions that matter:</b> The series is local around an expansion point, and the radius of convergence limits where the result is valid.</p>",
    symbols: [ { sym: "$a_n$", desc: "coefficients" }, { sym: "$x_0$", desc: "expansion point" }, { sym: "recurrence", desc: "each coefficient determines later ones" }, { sym: "radius of convergence", desc: "bounds validity" } ],
    derivation: [
      { do: "Assume a power series for $y'=y$, $y(0)=1$.", result: "$y=\\sum_{n=0}^\\infty a_nx^n$", why: "local power series" },
      { do: "Differentiate.", result: "$y'=\\sum_{n=1}^\\infty n a_nx^{n-1}$", why: "differentiate term by term" },
      { do: "Reindex.", result: "$y'=\\sum_{n=0}^\\infty (n+1)a_{n+1}x^n$", why: "align powers of $x$" },
      { do: "Set $y'=y$ and match powers.", result: "$(n+1)a_{n+1}=a_n$", why: "equal power series have equal coefficients" },
      { do: "Use the initial condition.", result: "$a_0=1$", why: "$y(0)=1$" },
      { do: "Apply the recurrence.", result: "$a_n=1/n!$", why: "each coefficient determines the next" },
      { do: "State the series.", result: "$y=\\sum x^n/n!=e^x$", why: "the series is the exponential" }
    ],
    applications: [
      { title: "Airy series", background: "Airy equation $y''-xy=0$ with $a_0=1,a_1=0$ has a local series.", numbers: "begins $1+x^3/6+\\cdots$" },
      { title: "Exponential approximation", background: "$1+0.1+0.1^2/2$ approximates $e^{0.1}$.", numbers: "$1.105$ approximates $e^{0.1}\\approx1.10517$" },
      { title: "Sine approximation", background: "The cubic Taylor polynomial approximates $\\sin0.1$.", numbers: "$\\sin0.1\\approx0.1-0.001/6=0.099833$" },
      { title: "Sigmoid approximation", background: "Sigmoid approximation $0.5+x/4$ near $0$ is linear.", numbers: "gives $0.55$ at $x=0.2$" },
      { title: "Variance scale", background: "For $e^x$ near $0$, the derivative controls first-order variance scaling.", numbers: "$(f'(0))^2=1$" },
      { title: "Cosine approximation", background: "A fourth-degree cosine series approximates $\\cos0.3$.", numbers: "$\\cos0.3\\approx1-0.09/2+0.0081/24=0.9553375$" }
    ]
  },
  "math-03-26": {
    connectionsProse: "<p>This lesson connects series, integrals, and named solution families to special functions. The reader can bring the familiar habit of reading a derivative as a local rate of change. Here that habit is organized around the structure that makes this particular kind of equation useful. The lesson prepares for Bessel, Legendre, Gamma, and error functions, where recognizing the structure before solving is often the most important step.</p>",
    motivation: "<p>Special functions are named solutions that appear too often to treat as failures of elementary algebra. They are standard functions defined by ODEs, integrals, or series. The concrete gap is that important ODE solutions may not be elementary.</p><p>The load-bearing idea is that standard names and defining properties make those solutions usable. The derivation or explanation below keeps the algebra tied to that idea, so each step shows why the method applies rather than only recording a formal manipulation. After the structure is clear, the initial data, constants, or numerical values have a specific role to play.</p>",
    definition: "<p>Special functions are named functions defined by standard ODEs, integrals, recurrences, or series when elementary formulas are not enough.</p><p><b>Assumptions that matter:</b> Normalization choices and defining properties are part of the function's definition.</p>",
    symbols: [ { sym: "$J_0$", desc: "a Bessel function" }, { sym: "$P_n$", desc: "a Legendre polynomial" }, { sym: "$\\Gamma$", desc: "the Gamma function" }, { sym: "$\\operatorname{erf}$", desc: "the error function" }, { sym: "normalization choices", desc: "part of each definition" } ],
    applications: [
      { title: "Bessel approximation", background: "$J_0(1)$ can be estimated from its series.", numbers: "$J_0(1)\\approx1-1/4+1/64=0.765625$" },
      { title: "Legendre values", background: "$P_2$ has simple endpoint and midpoint values.", numbers: "$P_2(1)=1$ and $P_2(0)=-0.5$" },
      { title: "Normal mass", background: "$\\Phi(1)$ gives one-sided standard normal mass.", numbers: "$\\Phi(1)\\approx0.8413$, so central normal mass is $0.6826$" },
      { title: "Gamma recurrence", background: "$\\Gamma$ extends factorials.", numbers: "$\\Gamma(3)=2!=2$" },
      { title: "Kernel value", background: "Squared-exponential kernel at distance $2$, length $1$, decays exponentially.", numbers: "$e^{-2}\\approx0.135$" },
      { title: "Bessel prediction", background: "Prediction $J_0(0.5)=0.94$ compared with three-term series.", numbers: "three-term $0.93848$ has error $0.00152$" }
    ]
  },
  "math-03-27": {
    connectionsProse: "<p>This lesson connects integration by parts and exponential weighting to the laplace transform. The reader can bring the familiar habit of reading a derivative as a local rate of change. Here that habit is organized around the structure that makes this particular kind of equation useful. The lesson prepares for Laplace methods for initial-value problems, where recognizing the structure before solving is often the most important step.</p>",
    motivation: "<p>The Laplace transform rewrites a time function as an algebraic function of $s$. Its main value for ODEs is that differentiation becomes multiplication by $s$ plus an initial-value term. The concrete gap is that derivatives complicate time-domain equations.</p><p>The load-bearing idea is that the transform turns differentiation into algebra plus initial data. The derivation or explanation below keeps the algebra tied to that idea, so each step shows why the method applies rather than only recording a formal manipulation. After the structure is clear, the initial data, constants, or numerical values have a specific role to play.</p>",
    definition: "<p>The Laplace transform maps a time function to an $s$-domain function by exponential weighting.</p><p>$$F(s)=\\int_0^\\infty e^{-st}f(t)\\,dt.$$</p><p><b>Assumptions that matter:</b> The integral must converge in a region of $s$ values, and boundary terms must vanish when deriving derivative rules.</p>",
    symbols: [ { sym: "$s$", desc: "the transform variable" }, { sym: "$F(s)$", desc: "the transformed function" }, { sym: "$\\mathcal L$", desc: "denotes the transform" }, { sym: "region of convergence", desc: "states where the integral exists" } ],
    derivation: [
      { do: "Define the transform.", result: "$F(s)=\\int_0^\\infty e^{-st}f(t)\\,dt$", why: "exponential weighting measures time behavior" },
      { do: "To transform $f'$, integrate by parts.", result: "$\\int_0^\\infty e^{-st}f'(t)dt$", why: "move differentiation from $f$ to the exponential" },
      { do: "Choose parts.", result: "$u=e^{-st}$, $dv=f'(t)dt$", why: "the exponential differentiates simply" },
      { do: "Evaluate the boundary term.", result: "$[e^{-st}f(t)]_0^\\infty=0-f(0)$", why: "when the transform converges" },
      { do: "Record the remaining integral.", result: "$s\\int_0^\\infty e^{-st}f(t)dt=sF(s)$", why: "differentiating $e^{-st}$ brings down $-s$ and the sign changes" },
      { do: "State the derivative rule.", result: "$\\mathcal L\\{f'\\}=sF(s)-f(0)$", why: "differentiation becomes algebra plus initial data" },
      { do: "Apply $y'+2y=2$, $y(0)=0$.", result: "$(s+2)Y=2/s$, so $Y=2/(s(s+2))$ and $y=1-e^{-2t}$", why: "the transformed equation is algebraic" }
    ],
    applications: [
      { title: "Heavy-ball pole", background: "Heavy-ball pole with $c=2$ identifies critical damping.", numbers: "$-1$ critical damping" },
      { title: "EMA memory", background: "EMA memory for $\\beta=0.99$ is approximated by reciprocal leakage.", numbers: "about $1/(1-0.99)=100$ steps" },
      { title: "State-space memory", background: "State-space multiplier $r=0.999$ has long memory.", numbers: "about $1000$ steps" },
      { title: "Euler stability", background: "Euler stability for $x'=-10x$ bounds step size.", numbers: "needs $h<0.2$" },
      { title: "Pole placement", background: "Plant pole moved from $-1$ to $-10$ changes settling speed.", numbers: "from about $4$s to $0.4$s" },
      { title: "Queue transform", background: "M/M/1 with $\\rho=0.8$ gives queue formulas.", numbers: "$L=4$ and $W=0.5$s when arrivals are $8$/s" }
    ]
  },
  "math-03-28": {
    connectionsProse: "<p>This lesson connects partial fractions and transform tables to the inverse laplace transform. The reader can bring the familiar habit of reading a derivative as a local rate of change. Here that habit is organized around the structure that makes this particular kind of equation useful. The lesson prepares for returning algebraic Laplace answers to time, where recognizing the structure before solving is often the most important step.</p>",
    motivation: "<p>The inverse Laplace transform turns algebraic pieces in $s$ back into time-domain modes. Partial fractions separate those modes. The concrete gap is that an s-domain formula is not yet a time prediction.</p><p>The load-bearing idea is that simple pole pieces invert to individual time-domain modes. The derivation or explanation below keeps the algebra tied to that idea, so each step shows why the method applies rather than only recording a formal manipulation. After the structure is clear, the initial data, constants, or numerical values have a specific role to play.</p>",
    definition: "<p>The inverse Laplace transform converts an algebraic transform $F(s)$ back to a time function $f(t)$, often after partial fractions.</p><p>$$\\mathcal L^{-1}\\{1/(s+a)\\}=e^{-at}.$$</p><p><b>Assumptions that matter:</b> Table entries apply after the transform is decomposed into recognizable pieces.</p>",
    symbols: [ { sym: "$F(s)$", desc: "the algebraic transform" }, { sym: "$f(t)$", desc: "the time function" }, { sym: "poles", desc: "denominator roots" }, { sym: "residues $A,B$", desc: "mode weights" } ],
    derivation: [
      { do: "Decompose $(5s+7)/((s+1)(s+3))$.", result: "$F=A/(s+1)+B/(s+3)$", why: "simple poles correspond to exponentials" },
      { do: "Combine fractions.", result: "$A(s+3)+B(s+1)=5s+7$", why: "put over the common denominator" },
      { do: "Match coefficients.", result: "$A+B=5$ and $3A+B=7$", why: "equal polynomials have equal coefficients" },
      { do: "Subtract equations.", result: "$2A=2$, so $A=1$", why: "solve one residue" },
      { do: "Solve the other residue.", result: "$B=4$", why: "use $A+B=5$" },
      { do: "Use the inverse table.", result: "$\\mathcal L^{-1}\\{1/(s+a)\\}=e^{-at}$", why: "each simple pole gives an exponential" },
      { do: "Invert the pieces.", result: "$e^{-t}+4e^{-3t}$", why: "the time signal is the sum of modes" }
    ],
    applications: [
      { title: "Single pole", background: "$4/(s+4)$ inverts to a fast exponential.", numbers: "$4e^{-4t}$ and value $0.541$ at $t=0.5$" },
      { title: "Decay pole", background: "$5/(s+2)$ inverts directly.", numbers: "$5e^{-2t}$ and $0.677$ at $t=1$" },
      { title: "Two poles", background: "$1/(s+1)+2/(s+5)$ combines two exponentials.", numbers: "$0.381$ at $t=1$" },
      { title: "Damped sinusoid", background: "$10/((s+1)^2+100)$ gives a shifted sine response.", numbers: "$e^{-t}\\sin10t$ with envelope $0.819$ at $t=0.2$" },
      { title: "Density", background: "$6/(s+6)$ gives exponential density.", numbers: "$6e^{-6t}=3.29$ at $t=0.1$" },
      { title: "Kernel weight", background: "Pole $-0.02$ gives a long exponential kernel.", numbers: "$e^{-2}\\approx0.135$ at $t=100$" }
    ]
  },
  "math-03-29": {
    connectionsProse: "<p>This lesson connects Laplace derivative rules and initial conditions to solving ivps with laplace. The reader can bring the familiar habit of reading a derivative as a local rate of change. Here that habit is organized around the structure that makes this particular kind of equation useful. The lesson prepares for efficient solving of linear IVPs, where recognizing the structure before solving is often the most important step.</p>",
    motivation: "<p>Laplace methods carry initial conditions into the transformed equation immediately. The constants are handled during algebra rather than after solving. The concrete gap is that constants can be cumbersome when solved after the fact.</p><p>The load-bearing idea is that the transform carries initial values directly into the algebra. The derivation or explanation below keeps the algebra tied to that idea, so each step shows why the method applies rather than only recording a formal manipulation. After the structure is clear, the initial data, constants, or numerical values have a specific role to play.</p>",
    definition: "<p>Solving an IVP with Laplace transforms means transforming the ODE, using derivative rules that include initial values, solving algebraically for $Y(s)$, and inverting.</p><p>$$\\mathcal L\\{y'\\}=sY-y(0),\\qquad \\mathcal L\\{y''\\}=s^2Y-sy(0)-y'(0).$$</p><p><b>Assumptions that matter:</b> The transforms must exist and the resulting algebraic expression must be invertible by tables or decomposition.</p>",
    symbols: [ { sym: "$Y(s)$", desc: "the transform of $y(t)$" }, { sym: "initial values", desc: "enter derivative transforms" }, { sym: "partial fractions", desc: "separate modes" } ],
    derivation: [
      { do: "Let $Y=\\mathcal L\\{y\\}$ for $y''+3y'+2y=0$, $y(0)=1$, $y'(0)=0$.", result: "$Y=\\mathcal L\\{y\\}$", why: "transform the unknown" },
      { do: "Transform the first derivative.", result: "$\\mathcal L\\{y'\\}=sY-1$", why: "use $y(0)=1$" },
      { do: "Transform the second derivative.", result: "$\\mathcal L\\{y''\\}=s^2Y-s$", why: "use $y(0)=1$, $y'(0)=0$" },
      { do: "Substitute into the ODE.", result: "$(s^2Y-s)+3(sY-1)+2Y=0$", why: "the transformed equation is algebraic" },
      { do: "Collect terms.", result: "$(s^2+3s+2)Y=s+3$", why: "solve for $Y$" },
      { do: "Factor the denominator.", result: "$Y=(s+3)/((s+1)(s+2))$", why: "prepare partial fractions" },
      { do: "Decompose.", result: "$Y=2/(s+1)-1/(s+2)$", why: "separate simple modes" },
      { do: "Invert.", result: "$y=2e^{-t}-e^{-2t}$", why: "each pole becomes an exponential" }
    ],
    applications: [
      { title: "Worked IVP value", background: "The worked IVP solution is evaluated at one time.", numbers: "$y(1)\\approx0.600$" },
      { title: "Concentration", background: "$c'+0.2c=10$, $c(0)=0$ solves by transform or first-order methods.", numbers: "$c(5)\\approx31.61$" },
      { title: "Temperature", background: "$T'+0.1T=7$, $T(0)=20$ relaxes to $70$.", numbers: "$T(10)\\approx51.61$" },
      { title: "Fast settling", background: "$x'+8x=8$, $x(0)=0$ has time constant $1/8$.", numbers: "2 percent settling about $0.5$s" },
      { title: "Weight decay", background: "$w'+0.5w=0$, $w(0)=4$ decays exponentially.", numbers: "$w(6)\\approx0.199$" },
      { title: "Natural decay", background: "Natural decay $e^{-0.01t}$ over 100 steps gives a memory factor.", numbers: "keeps $0.368$ after $100$ steps" }
    ]
  },
  "math-03-30": {
    connectionsProse: "<p>This lesson connects tangent-line approximation from calculus to Euler's method. The reader can bring the familiar habit of reading a derivative as a local rate of change. Here that habit is organized around the structure that makes this particular kind of equation useful. The lesson prepares for basic numerical ODE solving, where recognizing the structure before solving is often the most important step.</p>",
    motivation: "<p>Euler's method follows the tangent line implied by the ODE for one small step, then repeats. It is the first-order Taylor approximation used as a numerical solver. The concrete gap is that exact formulas are not always available.</p><p>The load-bearing idea is that the current slope gives a short computable step. The derivation or explanation below keeps the algebra tied to that idea, so each step shows why the method applies rather than only recording a formal manipulation. After the structure is clear, the initial data, constants, or numerical values have a specific role to play.</p>",
    definition: "<p>Euler's method advances an approximate solution by taking one tangent-line step using the ODE slope at the current point.</p><p>$$y_{n+1}=y_n+h f(t_n,y_n).$$</p><p><b>Assumptions that matter:</b> The step size $h$ should be small enough for the tangent approximation and stability requirements of the problem.</p>",
    symbols: [ { sym: "$h$", desc: "step size" }, { sym: "$t_n,y_n$", desc: "numerical values" }, { sym: "$f(t_n,y_n)$", desc: "the current slope" }, { sym: "local error", desc: "comes from omitted higher terms" } ],
    derivation: [
      { do: "Taylor expand one step.", result: "$y(t+h)=y(t)+hy'(t)+O(h^2)$", why: "local linear approximation" },
      { do: "Replace the derivative by the ODE slope.", result: "$y'(t)=f(t,y)$", why: "the differential equation supplies the derivative" },
      { do: "Drop the higher-order term.", result: "first-order method", why: "this makes a computable approximation" },
      { do: "Define the next time.", result: "$t_{n+1}=t_n+h$", why: "advance the grid" },
      { do: "Define the next value.", result: "$y_{n+1}=y_n+h f(t_n,y_n)$", why: "move along the current slope" },
      { do: "Apply $y'=y-t$, $y(0)=1$, $h=0.5$.", result: "$y_1=1.5$ at $t=0.5$; $y_2=2.0$ at $t=1$", why: "the first slope is $1$ and the second slope is $1.0$" }
    ],
    applications: [
      { title: "Population step", background: "$p'=0.1p$, $p_0=1000$, $h=1$ uses Euler growth.", numbers: "$1100$ then $1210$" },
      { title: "Gradient flow", background: "$w'=-2w$, $w_0=5$, $h=0.1$ takes one descent step.", numbers: "$w_1=4$" },
      { title: "Projectile velocity", background: "Acceleration $-9.8$, $v_0=20$, $h=0.1$ updates velocity.", numbers: "$v_1=19.02$" },
      { title: "SIR step", background: "$S'= -0.0002SI$ with $S=990,I=10,h=1$ updates susceptibles.", numbers: "$S_1=988.02$" },
      { title: "Charge update", background: "Charge rate $-0.3$ for a half-step changes charge linearly.", numbers: "for $h=0.5$ changes charge by $-0.15$" },
      { title: "Hidden state", background: "Hidden state $h'=0.4h$, $h_0=2$, step $0.25$ uses one Euler step.", numbers: "$h_1=2.2$" }
    ]
  },
  "math-03-31": {
    connectionsProse: "<p>This lesson connects Euler stepping and Taylor accuracy to Runge–Kutta methods. The reader can bring the familiar habit of reading a derivative as a local rate of change. Here that habit is organized around the structure that makes this particular kind of equation useful. The lesson prepares for higher-accuracy numerical solvers, where recognizing the structure before solving is often the most important step.</p>",
    motivation: "<p>Runge–Kutta methods improve on Euler by sampling several slopes within one step. RK4 combines those slopes to match the Taylor expansion through fourth order. The concrete gap is that one endpoint slope may miss curvature across a step.</p><p>The load-bearing idea is that several sampled slopes approximate the average slope better. The derivation or explanation below keeps the algebra tied to that idea, so each step shows why the method applies rather than only recording a formal manipulation. After the structure is clear, the initial data, constants, or numerical values have a specific role to play.</p>",
    definition: "<p>Runge–Kutta methods advance an ODE solution by combining several slope samples inside one step; classical RK4 uses weights $1,2,2,1$.</p><p>$$\\Delta y=\\frac{h}{6}(k_1+2k_2+2k_3+k_4).$$</p><p><b>Assumptions that matter:</b> The function evaluations must use the prescribed intermediate states, and accuracy still depends on step size and smoothness.</p>",
    symbols: [ { sym: "$k_i$", desc: "sampled slopes" }, { sym: "$h$", desc: "step size" }, { sym: "RK4 weights", desc: "$1,2,2,1$" }, { sym: "order four", desc: "local Taylor matching through degree four" } ],
    derivation: [
      { do: "Compute $k_1$ for $y'=y$, $y(0)=1$, $h=0.5$.", result: "$k_1=f(0,1)=1$", why: "slope at the left edge" },
      { do: "Compute $k_2$.", result: "$k_2=f(0.25,1+0.25)=1.25$", why: "midpoint using $k_1$" },
      { do: "Compute $k_3$.", result: "$k_3=f(0.25,1+0.25\\cdot1.25)=1.3125$", why: "midpoint using $k_2$" },
      { do: "Compute $k_4$.", result: "$k_4=f(0.5,1+0.5\\cdot1.3125)=1.65625$", why: "right edge using $k_3$" },
      { do: "Average with RK4 weights.", result: "$\\Delta y=\\frac{0.5}{6}(1+2(1.25)+2(1.3125)+1.65625)=0.6484375$", why: "the weighted average approximates the step's average slope" },
      { do: "Update the value.", result: "$y(0.5)\\approx1.6484375$, close to $e^{0.5}\\approx1.64872$", why: "RK4 matches the curve accurately over the step" }
    ],
    applications: [
      { title: "RK4 error", background: "RK4 for $y'=y$, $h=0.5$ is compared to the exact exponential.", numbers: "error about $0.00028$" },
      { title: "Constant velocity", background: "Constant velocity $1.2$ for $h=0.1$ integrates exactly.", numbers: "changes position by $0.12$" },
      { title: "Temperature slopes", background: "Slopes $-0.3,-0.4,-0.5,-0.6$ over $h=1$ average by RK weights.", numbers: "change temperature by $-0.45$" },
      { title: "Vector-field cost", background: "32 vector-field calls at 2 ms each add computational cost.", numbers: "64 ms" },
      { title: "Frame update", background: "At 60 fps, slope $9$ over one frame updates velocity.", numbers: "changes velocity by $0.150$ per frame" },
      { title: "Concentration slopes", background: "Slopes $-2.0,-1.8,-1.7,-1.5$ over $h=0.25$ combine by RK4 weights.", numbers: "change concentration by $-0.4375$" }
    ]
  },
  "math-03-32": {
    connectionsProse: "<p>This lesson connects integration constants and endpoint conditions to boundary value problems. The reader can bring the familiar habit of reading a derivative as a local rate of change. Here that habit is organized around the structure that makes this particular kind of equation useful. The lesson prepares for finite-difference methods for boundary problems, where recognizing the structure before solving is often the most important step.</p>",
    motivation: "<p>A boundary value problem asks for a whole curve that satisfies conditions at separate points. Finite differences turn derivative constraints into algebraic equations for interior values. The concrete gap is that conditions at two endpoints cannot be handled by marching alone.</p><p>The load-bearing idea is that grid values and derivative approximations turn the problem into algebra. The derivation or explanation below keeps the algebra tied to that idea, so each step shows why the method applies rather than only recording a formal manipulation. After the structure is clear, the initial data, constants, or numerical values have a specific role to play.</p>",
    definition: "<p>A boundary value problem specifies conditions at two or more boundary points rather than all data at one initial point.</p><p>$$y''(x_i)\\approx\\frac{y_{i-1}-2y_i+y_{i+1}}{h^2}.$$</p><p><b>Assumptions that matter:</b> Boundary conditions must be compatible with a solution, and finite-difference accuracy depends on grid spacing.</p>",
    symbols: [ { sym: "$a,b$", desc: "boundary endpoints" }, { sym: "$\\alpha,\\beta$", desc: "boundary values" }, { sym: "$h$", desc: "grid spacing" }, { sym: "$y_i$", desc: "approximates $y(x_i)$" } ],
    derivation: [
      { do: "Integrate $y''=2$ once.", result: "$y'=2x+C_1$", why: "reverse the second derivative" },
      { do: "Integrate again.", result: "$y=x^2+C_1x+C_2$", why: "recover the function family" },
      { do: "Apply $y(0)=0$.", result: "$C_2=0$", why: "the left boundary fixes one constant" },
      { do: "Apply $y(1)=3$.", result: "$1+C_1=3$", why: "the right boundary fixes the other constant" },
      { do: "Solve.", result: "$C_1=2$", why: "subtract the known term" },
      { do: "State the solution.", result: "$y=x^2+2x$", why: "it satisfies both boundary values" },
      { do: "Use finite differences.", result: "$y''(x_i)\\approx(y_{i-1}-2y_i+y_{i+1})/h^2$", why: "adding forward and backward Taylor expansions cancels first derivatives" }
    ],
    applications: [
      { title: "Linear temperature", background: "$T''=0$, $T(0)=20$, $T(1)=80$ gives a straight line.", numbers: "$T(0.25)=35$" },
      { title: "Sag curve", background: "$y''=0.02$, $y(0)=y(100)=0$ gives a symmetric quadratic.", numbers: "midpoint $y(50)=-25$" },
      { title: "Voltage line", background: "$V''=0$, $V(0)=0$, $V(10)=5$ is linear.", numbers: "$V(4)=2$" },
      { title: "Linear fill", background: "Linear fill between 40 and 100 over three equal gaps gives evenly spaced values.", numbers: "60 and 80" },
      { title: "Tridiagonal matrix", background: "1000 interior 1D nodes give a tridiagonal finite-difference system.", numbers: "about $2998$ tridiagonal nonzeros" },
      { title: "Path boundary", background: "Path from $x(0)=2$ to $x(5)=12$ is linear.", numbers: "velocity $2$ and midpoint $7$" }
    ]
  },
  "math-03-33": {
    connectionsProse: "<p>This lesson connects eigenvectors, inner products, and boundary conditions to Sturm–Liouville theory. The reader can bring the familiar habit of reading a derivative as a local rate of change. Here that habit is organized around the structure that makes this particular kind of equation useful. The lesson prepares for Fourier-type mode expansions and PDE separation, where recognizing the structure before solving is often the most important step.</p>",
    motivation: "<p>Sturm–Liouville theory gives boundary-value problems an eigenvector-like structure. Under the right boundary conditions, eigenfunctions are orthogonal modes. The concrete gap is that boundary-value operators need a mode structure.</p><p>The load-bearing idea is that self-adjoint form makes distinct eigenfunctions orthogonal. The derivation or explanation below keeps the algebra tied to that idea, so each step shows why the method applies rather than only recording a formal manipulation. After the structure is clear, the initial data, constants, or numerical values have a specific role to play.</p>",
    definition: "<p>Sturm–Liouville theory studies self-adjoint boundary-value eigenproblems whose eigenfunctions form orthogonal modes.</p><p>$$-(py')'+qy=\\lambda wy.$$</p><p><b>Assumptions that matter:</b> The boundary conditions must be self-adjoint so boundary terms cancel, and the weight $w$ defines the relevant inner product.</p>",
    symbols: [ { sym: "$p,q,w$", desc: "coefficient and weight functions" }, { sym: "$\\lambda$", desc: "an eigenvalue" }, { sym: "$y_n$", desc: "an eigenfunction" }, { sym: "self-adjoint boundary conditions", desc: "cancel boundary terms" } ],
    derivation: [
      { do: "Start with two eigenfunction equations.", result: "$-(py_m')'+qy_m=\\lambda_mwy_m$ and $-(py_n')'+qy_n=\\lambda_nwy_n$", why: "compare two modes" },
      { do: "Multiply crosswise.", result: "first by $y_n$ and second by $y_m$", why: "prepare for subtraction" },
      { do: "Subtract and integrate over $[a,b]$.", result: "common $q$ terms cancel", why: "isolate the eigenvalue difference" },
      { do: "Integrate derivative terms by parts.", result: "boundary terms cancel", why: "self-adjoint boundary conditions cancel boundary terms" },
      { do: "Record the result.", result: "$(\\lambda_m-\\lambda_n)\\int_a^b w y_my_n\\,dx=0$", why: "only weighted inner product remains" },
      { do: "Use distinct eigenvalues.", result: "$\\int_a^b w y_my_n\\,dx=0$", why: "if $\\lambda_m\\ne\\lambda_n$, divide by the nonzero difference" },
      { do: "Apply the standard interval example.", result: "for $-y''=\\lambda y$ on $(0,\\pi)$ with zero endpoints, eigenfunctions are $\\sin nx$ and eigenvalues $n^2$", why: "sines satisfy the boundary conditions and eigenvalue equation" }
    ],
    applications: [
      { title: "Sine coefficient", background: "For $f(x)=x$ on $[0,\\pi]$, the first sine coefficient is computed by orthogonality.", numbers: "$2$" },
      { title: "String mode", background: "String length $1$, speed $100$, mode $3$ has frequency proportional to mode number.", numbers: "$150$ Hz" },
      { title: "Heat mode", background: "Heat mode $n=2$, $\\kappa=0.01$, $t=10$ decays exponentially.", numbers: "$e^{-3.948}\\approx0.0193$" },
      { title: "Box level", background: "If $E_1=0.5$ eV, energy scales like $n^2$.", numbers: "box level $E_3=4.5$ eV" },
      { title: "Graph heat", background: "Graph heat smoothing with $\\lambda=4$ and factor $0.2$ damps a mode.", numbers: "multiplies by $e^{-0.8}\\approx0.449$" },
      { title: "Mode storage", background: "Keeping 16 modes for 64 channels stores mode-channel coefficients.", numbers: "1024 coefficients" }
    ]
  },
  "math-03-34": {
    connectionsProse: "<p>This lesson connects residual network updates and Euler steps to neural odes. The reader can bring the familiar habit of reading a derivative as a local rate of change. Here that habit is organized around the structure that makes this particular kind of equation useful. The lesson prepares for continuous-depth machine-learning models, where recognizing the structure before solving is often the most important step.</p>",
    motivation: "<p>A Neural ODE replaces a finite stack of residual updates with a learned continuous-time vector field. The solver, not a fixed layer count, chooses the intermediate steps. The concrete gap is that a fixed layer stack is a discrete approximation.</p><p>The load-bearing idea is that a learned vector field defines continuous hidden-state motion. The derivation or explanation below keeps the algebra tied to that idea, so each step shows why the method applies rather than only recording a formal manipulation. After the structure is clear, the initial data, constants, or numerical values have a specific role to play.</p>",
    definition: "<p>A Neural ODE models hidden-state evolution with a learned continuous-time vector field.</p><p>$$\\frac{dh}{dt}=f_\\theta(t,h).$$</p><p><b>Assumptions that matter:</b> A numerical ODE solver approximates the trajectory, and solver tolerances control the accuracy-cost tradeoff.</p>",
    symbols: [ { sym: "$h(t)$", desc: "hidden state" }, { sym: "$f_\\theta$", desc: "the learned vector field" }, { sym: "$\\theta$", desc: "parameters" }, { sym: "solver tolerances", desc: "control numerical accuracy" } ],
    derivation: [
      { do: "Start with a residual block.", result: "$h_{k+1}=h_k+\\Delta t\\,F_\\theta(t_k,h_k)$", why: "update equals current state plus learned change" },
      { do: "Rearrange as a quotient.", result: "$(h_{k+1}-h_k)/\\Delta t=F_\\theta(t_k,h_k)$", why: "this is a difference quotient" },
      { do: "Let the step shrink.", result: "$\\Delta t\\to0$", why: "the quotient becomes $dh/dt$" },
      { do: "Define the Neural ODE.", result: "$dh/dt=f_\\theta(t,h)$", why: "the network supplies the vector field" },
      { do: "Define the output.", result: "$h(t_1)$ from $h(t_0)=h_0$", why: "numerical integration advances the hidden state" },
      { do: "Apply $h'=0.4h$, $h(0)=2$ with two Euler steps of size $0.5$.", result: "$2\\to2.4\\to2.88$", why: "the continuous model can be approximated by numerical steps" }
    ],
    applications: [
      { title: "ODE block cost", background: "20 vector-field calls make the ODE block more expensive than one residual call.", numbers: "about 20 times one residual-layer call" },
      { title: "Decay over hours", background: "Decay rate $0.3$ over 5 hours gives exponential retention.", numbers: "$e^{-1.5}\\approx0.223$" },
      { title: "Density change", background: "Constant divergence $0.2$ over 3 seconds changes density by an exponential factor.", numbers: "$e^{-0.6}\\approx0.549$" },
      { title: "Latent drift", background: "$z'=0.5$, $z(0)=1$ moves linearly.", numbers: "$z(2)=2$ and midpoint $1.5$" },
      { title: "State memory", background: "Saving 100 states of dimension 256 in float32 stores all solver states.", numbers: "102400 bytes" },
      { title: "Contraction", background: "Rate $-1.2$ over 4 units contracts exponentially.", numbers: "$e^{-4.8}\\approx0.0082$" }
    ]
  },
  "math-03-35": {
    connectionsProse: "<p>This lesson connects Euler stepping and random variation to stochastic differential equations & diffusion. The reader can bring the familiar habit of reading a derivative as a local rate of change. Here that habit is organized around the structure that makes this particular kind of equation useful. The lesson prepares for diffusion models and stochastic dynamics, where recognizing the structure before solving is often the most important step.</p>",
    motivation: "<p>A stochastic differential equation keeps deterministic drift and adds calibrated random motion. Diffusion models use this structure to add noise forward and guide denoising backward. The concrete gap is that deterministic drift does not capture random fluctuations.</p><p>The load-bearing idea is that Brownian increments add noise with variance proportional to time. The derivation or explanation below keeps the algebra tied to that idea, so each step shows why the method applies rather than only recording a formal manipulation. After the structure is clear, the initial data, constants, or numerical values have a specific role to play.</p>",
    definition: "<p>A stochastic differential equation combines deterministic drift with Brownian noise.</p><p>$$dX_t=f(X_t,t)dt+g(t)dW_t.$$</p><p><b>Assumptions that matter:</b> Brownian increments have mean zero and variance equal to the time step, so simulations sample random increments.</p>",
    symbols: [ { sym: "$f$", desc: "drift" }, { sym: "$g$", desc: "diffusion scale" }, { sym: "$W_t$", desc: "Brownian motion" }, { sym: "$\\Delta t$", desc: "step size" }, { sym: "$\\varepsilon_n$", desc: "a standard normal sample" } ],
    derivation: [
      { do: "Start with the SDE.", result: "$dX_t=f(X_t,t)dt+g(t)dW_t$", why: "drift plus Brownian noise" },
      { do: "Approximate drift over a small step.", result: "$f(X_n,t_n)\\Delta t$", why: "Euler's deterministic idea" },
      { do: "Use Brownian increments.", result: "$\\Delta W\\sim\\mathcal N(0,\\Delta t)$", why: "variance grows like time" },
      { do: "Represent the random increment.", result: "$\\Delta W=\\sqrt{\\Delta t}\\,\\varepsilon_n$ with $\\varepsilon_n\\sim\\mathcal N(0,1)$", why: "standardize the normal sample" },
      { do: "Combine terms.", result: "$X_{n+1}=X_n+f(X_n,t_n)\\Delta t+g(t_n)\\sqrt{\\Delta t}\\varepsilon_n$", why: "Euler-Maruyama step" },
      { do: "Apply $dX=-0.5Xdt+0.2dW$, $X_0=1$, $\\Delta t=0.04$, $\\varepsilon=1.5$.", result: "$1-0.02+0.06=1.04$", why: "drift and diffusion both contribute to the update" }
    ],
    applications: [
      { title: "Denoiser cost", background: "50 denoiser calls at 40 ms accumulate runtime.", numbers: "2000 ms" },
      { title: "DDPM noising", background: "DDPM noising with $\\alpha=0.81$, $x=0.6$, noise $-1$ combines signal and noise.", numbers: "$0.104$" },
      { title: "Langevin step", background: "Langevin step with score $-2$, step $0.005$, noise $1$ combines drift and random motion.", numbers: "changes by $0.09$" },
      { title: "Gradient noise", background: "Gradient noise standard deviation $0.3$ with learning rate $0.01$ scales update noise.", numbers: "$0.003$" },
      { title: "Daily volatility", background: "Volatility $20\\%$ yearly converts to one-day standard deviation.", numbers: "$0.20\\sqrt{1/252}\\approx0.0126$" },
      { title: "Brownian diffusion", background: "Brownian diffusion with $D=0.5,t=10$ gives RMS displacement.", numbers: "$\\sqrt{10}\\approx3.16$" }
    ]
  }
};
