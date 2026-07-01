module.exports = {
  "math-22-01": {
    connectionsProse: "<p>This lesson starts the section by turning ordinary decision problems into optimization problems. Earlier algebra and modeling work already gave names to variables and equations; here those pieces are organized into variables, an objective, and constraints. That separation matters because every optimizer in the rest of the section assumes the problem has already been written in a form it can act on. Once the formulation is clear, methods such as gradient descent, KKT conditions, linear programming, and quadratic programming have a common language.</p>",
    motivation: "<p>Many practical problems begin as sentences: choose a model, allocate a budget, fit data, or satisfy a policy. An optimization formulation translates that sentence into mathematical parts. The decision variables are the quantities allowed to move. The objective measures what counts as better. The constraints describe what choices are allowed.</p>" +
      "<p>This separation prevents several common mistakes. A quantity that is fixed data should not be optimized, and a requirement that must always hold should not be treated as a preference unless the model really allows tradeoffs. The feasible set collects all choices that obey the constraints, and an optimum is the feasible choice with the best objective value. This lesson is explain-only because the main skill is careful construction rather than proving a single formula.</p>",
    definition: "<p><b>Statement.</b> this is a modeling concept rather than a theorem. Author the transformation from a sentence to a mathematical program as a careful construction: choose variables, write the objective, write constraints, and state the feasible set.</p>" +
      "<p><b>Assumptions that matter:</b> Use the stated variables and the regularity conditions in the plan.</p>",
    symbols: [
      { sym: "$x$", desc: "the decision variable" },
      { sym: "$f(x)$", desc: "the objective" },
      { sym: "$g_i(x)\\le0$ and $h_j(x)=0$", desc: "inequality and equality constraints" },
      { sym: "$\\mathcal F$", desc: "the feasible set" },
      { sym: "$x^*$", desc: "an optimal feasible point" },
    ],
    applications: [
      { title: "Ridge regression formulation", background: "choose $w$, minimize $\\tfrac12\\Vert Xw-y\\Vert^2+\\tfrac\\lambda2\\Vert w\\Vert^2$; with residual norm $3$ and $\\Vert w\\Vert=2$, $\\lambda=0.5$ gives objective $4.5+1=5.5$.", numbers: "choose $w$, minimize $\\tfrac12\\Vert Xw-y\\Vert^2+\\tfrac\\lambda2\\Vert w\\Vert^2$; with residual norm $3$ and $\\Vert w\\Vert=2$, $\\lambda=0.5$ gives objective $4.5+1=5.5$." },
      { title: "Budgeted ads allocation", background: "choose spends $x_1,x_2$, maximize $4x_1+5x_2$ with $x_1+x_2\\le10$; spending all on channel 2 gives value $50$.", numbers: "choose spends $x_1,x_2$, maximize $4x_1+5x_2$ with $x_1+x_2\\le10$; spending all on channel 2 gives value $50$." },
      { title: "SVM margin problem", background: "minimize $\\tfrac12\\Vert w\\Vert^2$ subject to $y_i(w^Tx_i+b)\\ge1$; if $\\Vert w\\Vert=2$, margin is $1/2$.", numbers: "minimize $\\tfrac12\\Vert w\\Vert^2$ subject to $y_i(w^Tx_i+b)\\ge1$; if $\\Vert w\\Vert=2$, margin is $1/2$." },
      { title: "Constrained calibration", background: "choose probabilities $p_i$ with $\\sum p_i=1$; $(0.2,0.3,0.5)$ is feasible and sums to $1$.", numbers: "choose probabilities $p_i$ with $\\sum p_i=1$; $(0.2,0.3,0.5)$ is feasible and sums to $1$." },
      { title: "Portfolio objective", background: "minimize risk $x^T\\Sigma x$ with expected return at least $r_0$; for $x=(0.4,0.6)$ and returns $(0.05,0.10)$, return is $0.08$.", numbers: "minimize risk $x^T\\Sigma x$ with expected return at least $r_0$; for $x=(0.4,0.6)$ and returns $(0.05,0.10)$, return is $0.08$." },
      { title: "Neural-network training", background: "choose all weights $\\theta$, minimize average loss $\\tfrac1n\\sum_i \\ell_i(\\theta)$; losses $(0.8,0.4,0.2)$ average to $0.467$.", numbers: "choose all weights $\\theta$, minimize average loss $\\tfrac1n\\sum_i \\ell_i(\\theta)$; losses $(0.8,0.4,0.2)$ average to $0.467$." },
    ]
  },
  "math-22-02": {
    connectionsProse: "<p>This lesson builds on vectors, line segments, and weighted averages. A convex set is a feasible region that does not develop holes or bends inward between feasible points. That simple geometric idea will support later results about convex functions, optimality conditions, and constrained optimization. When a feasible region is convex, averaging two allowed decisions remains safe.</p>",
    motivation: "<p>In optimization, constraints describe the choices an algorithm is allowed to make. If the feasible set is convex, moving partway from one feasible point to another cannot leave the allowed region. This matters because many algorithms take steps, averages, or mixtures of current candidate solutions.</p>" +
      "<p>Convexity is especially useful when several constraints are imposed at once. Each constraint may define its own feasible set, and the final feasible region is their intersection. The derivation below shows that if every individual set has the line-segment property, then satisfying all of them preserves that property too.</p>",
    definition: "<p><b>Statement.</b> Convexity of an intersection.</p>" +
      "<p><b>Assumptions that matter:</b> Use the stated variables and the regularity conditions in the plan.</p>",
    symbols: [
      { sym: "$C$", desc: "a set of feasible points" },
      { sym: "$x,y$", desc: "points" },
      { sym: "$t$", desc: "a mixing weight" },
      { sym: "$tx+(1-t)y$", desc: "a point on the segment" },
    ],
    derivation: [
      { do: "Let $C=\\cap_i C_i$", result: "Let $C=\\cap_i C_i$", why: "a point is in $C$ only if it is in every $C_i$." },
      { do: "Choose $x,y\\in C$", result: "Choose $x,y\\in C$", why: "both points are feasible for every set in the intersection." },
      { do: "Fix $t\\in[0,1]$", result: "Fix $t\\in[0,1]$", why: "this is the weight in a line segment." },
      { do: "Since $x,y\\in C_i$ and each $C_i$ is convex, $tx+(1-t)y\\in C_i$ for every $i$.", result: "Since $x,y\\in C_i$ and each $C_i$ is convex, $tx+(1-t)y\\in C_i$ for every $i$.", why: "" },
      { do: "Therefore $tx+(1-t)y\\in\\cap_i C_i=C$", result: "Therefore $tx+(1-t)y\\in\\cap_i C_i=C$", why: "membership in all sets gives membership in the intersection." },
    ],
    applications: [
      { title: "Box constraints", background: "$x=(0,2)$ and $y=(4,0)$ lie in $[0,4]^2$; the midpoint $(2,1)$ is feasible.", numbers: "$x=(0,2)$ and $y=(4,0)$ lie in $[0,4]^2$; the midpoint $(2,1)$ is feasible." },
      { title: "Probability simplex", background: "averaging $p=(1,0,0)$ and $q=(0,1,0)$ with $t=0.3$ gives $(0.3,0.7,0)$, still sums to $1$.", numbers: "averaging $p=(1,0,0)$ and $q=(0,1,0)$ with $t=0.3$ gives $(0.3,0.7,0)$, still sums to $1$." },
      { title: "Budget set", background: "spends $(10,0)$ and $(0,10)$ both satisfy $x_1+x_2\\le10$; their average $(5,5)$ also spends $10$.", numbers: "spends $(10,0)$ and $(0,10)$ both satisfy $x_1+x_2\\le10$; their average $(5,5)$ also spends $10$." },
      { title: "Half-space feasibility", background: "if $a^Tx\\le3$ and $a^Ty\\le3$, then $a^T(0.25x+0.75y)\\le3$; the inequality stays feasible.", numbers: "if $a^Tx\\le3$ and $a^Ty\\le3$, then $a^T(0.25x+0.75y)\\le3$; the inequality stays feasible." },
      { title: "Fairness constraint", background: "two models with violation rates $0.02$ and $0.04$ average to $0.03$, meeting a $0.05$ cap.", numbers: "two models with violation rates $0.02$ and $0.04$ average to $0.03$, meeting a $0.05$ cap." },
      { title: "Embedding interpolation", background: "two normalized mixture weights average to a valid mixture, e.g. $(0.6,0.4)$ and $(0.2,0.8)$ give $(0.4,0.6)$.", numbers: "two normalized mixture weights average to a valid mixture, e.g. $(0.6,0.4)$ and $(0.2,0.8)$ give $(0.4,0.6)$." },
    ]
  },
  "math-22-03": {
    connectionsProse: "<p>This lesson moves from convex feasible sets to convex objectives. Earlier lessons described lines and gradients; now those tools describe a function whose graph bends upward in a controlled way. Convex functions are the main reason many optimization problems can be solved reliably. They connect local slope information to global statements about the whole objective.</p>",
    motivation: "<p>A convex function lies below the chord joining any two points on its graph. For optimization, that means there are no hidden lower valleys between points that the function averages over. If a method finds a point where the slope vanishes, convexity can turn that local condition into a global optimality certificate.</p>" +
      "<p>The most useful analytic form is the first-order lower bound. At any point $x$, the tangent plane supports the function from below. The derivation restricts the function to the line from $x$ to $y$, applies the one-dimensional convex tangent inequality, and then translates the result back to the original variables.</p>",
    definition: "<p><b>Statement.</b> First-order lower bound for differentiable convex $f$.</p>" +
      "<p><b>Assumptions that matter:</b> Use the stated variables and the regularity conditions in the plan.</p>",
    symbols: [
      { sym: "$f$", desc: "the objective" },
      { sym: "$x,y$", desc: "points" },
      { sym: "$t$", desc: "a line parameter" },
      { sym: "$\\nabla f(x)$", desc: "the gradient" },
      { sym: "$\\phi$", desc: "the one-dimensional slice" },
    ],
    derivation: [
      { do: "Define $\\phi(t)=f(x+t(y-x))$ for $t\\in[0,1]$", result: "Define $\\phi(t)=f(x+t(y-x))$ for $t\\in[0,1]$", why: "restrict $f$ to the line from $x$ to $y$." },
      { do: "Convexity of $f$ makes $\\phi$ convex", result: "Convexity of $f$ makes $\\phi$ convex", why: "a convex function stays convex on a line." },
      { do: "For a one-dimensional convex differentiable function, $\\phi(1)\\ge\\phi(0)+\\phi'(0)$", result: "For a one-dimensional convex differentiable function, $\\phi(1)\\ge\\phi(0)+\\phi'(0)$", why: "the tangent is a global lower bound." },
      { do: "Compute $\\phi'(0)=\\nabla f(x)^T(y-x)$", result: "Compute $\\phi'(0)=\\nabla f(x)^T(y-x)$", why: "chain rule along the line." },
      { do: "Substitute", result: "$f(y)\\ge f(x)+\\nabla f(x)^T(y-x)$", why: "the tangent plane sits below the graph." },
    ],
    applications: [
      { title: "Quadratic lower bound", background: "for $f(w)=(w-4)^2$, at $x=1$ and $y=3$, $f(3)=1\\ge9-6(2)=-3$.", numbers: "for $f(w)=(w-4)^2$, at $x=1$ and $y=3$, $f(3)=1\\ge9-6(2)=-3$." },
      { title: "Global certificate", background: "if $\\nabla f(x)=0$ for convex $f$, then $f(y)\\ge f(x)$ for every $y$; stationarity is enough.", numbers: "if $\\nabla f(x)=0$ for convex $f$, then $f(y)\\ge f(x)$ for every $y$; stationarity is enough." },
      { title: "Jensen loss mix", background: "$f(w)=w^2$, $w_1=1,w_2=3$, $t=0.5$ gives $f(2)=4\\le(1+9)/2=5$.", numbers: "$f(w)=w^2$, $w_1=1,w_2=3$, $t=0.5$ gives $f(2)=4\\le(1+9)/2=5$." },
      { title: "Logistic-loss safety", background: "averaging two parameter vectors cannot make a convex regularized objective exceed the averaged objective.", numbers: "averaging two parameter vectors cannot make a convex regularized objective exceed the averaged objective." },
      { title: "Epigraph check", background: "$f(2)=4$ and $f(4)=16$ imply midpoint chord value $10$, while $f(3)=9\\le10$.", numbers: "$f(2)=4$ and $f(4)=16$ imply midpoint chord value $10$, while $f(3)=9\\le10$." },
      { title: "No spurious local minima", background: "if a point is locally minimal for convex $f$, the tangent lower-bound argument makes it globally minimal.", numbers: "if a point is locally minimal for convex $f$, the tangent lower-bound argument makes it globally minimal." },
    ]
  },
  "math-22-04": {
    connectionsProse: "<p>This lesson uses gradients, Hessians, and one-dimensional calculus to describe what must happen at a smooth unconstrained minimum. The key point is local: if a point is truly a minimum, then no tiny movement in any direction should reduce the objective. That condition forces the gradient to vanish. The Hessian then describes whether the surface bends upward around the stationary point.</p>",
    motivation: "<p>Gradient descent tries to reduce a loss by following a direction where the gradient points downhill. At a smooth unconstrained minimum, that downhill direction cannot exist. If the gradient were nonzero, moving a little in the negative-gradient direction would lower the objective, contradicting the claim that the point is locally minimal.</p>" +
      "<p>Vanishing gradient alone is not enough. A saddle can also have zero gradient, but it bends upward in some directions and downward in others. The second-order condition captures this by checking the Hessian along every direction. At a local minimum, every one-dimensional slice through the point must have nonnegative second derivative.</p>",
    definition: "<p><b>Statement.</b> First- and second-order conditions.</p>" +
      "<p><b>Assumptions that matter:</b> Use the stated variables and the regularity conditions in the plan.</p>",
    symbols: [
      { sym: "$x^*$", desc: "a candidate optimum" },
      { sym: "$u$", desc: "any direction" },
      { sym: "$\\nabla f$", desc: "the gradient" },
      { sym: "$\\nabla^2 f$ or $H$", desc: "the Hessian" },
    ],
    derivation: [
      { do: "Suppose $x^*$ is a local minimizer", result: "Suppose $x^*$ is a local minimizer", why: "nearby points have no smaller value." },
      { do: "For any direction $u$, define $\\phi(t)=f(x^*+tu)$", result: "For any direction $u$, define $\\phi(t)=f(x^*+tu)$", why: "inspect a line through the point." },
      { do: "Since $t=0$ minimizes $\\phi$ locally, $\\phi'(0)=0$", result: "Since $t=0$ minimizes $\\phi$ locally, $\\phi'(0)=0$", why: "one-dimensional calculus." },
      { do: "Compute $\\phi'(0)=\\nabla f(x^*)^Tu$", result: "Compute $\\phi'(0)=\\nabla f(x^*)^Tu$", why: "chain rule." },
      { do: "Because this equals $0$ for every $u$, choose $u=\\nabla f(x^*)$", result: "$\\Vert\\nabla f(x^*)\\Vert^2=0$", why: "hence $\\nabla f(x^*)=0$." },
      { do: "Also $\\phi''(0)=u^T\\nabla^2f(x^*)u\\ge0$", result: "Also $\\phi''(0)=u^T\\nabla^2f(x^*)u\\ge0$", why: "a one-dimensional local minimum has nonnegative second derivative." },
      { do: "Therefore the Hessian is positive semidefinite at a smooth local minimizer.", result: "Therefore the Hessian is positive semidefinite at a smooth local minimizer.", why: "" },
    ],
    applications: [
      { title: "Quadratic minimizer", background: "$f(w)=(w-4)^2$ has gradient $2(w-4)=0$, so $w^*=4$.", numbers: "$f(w)=(w-4)^2$ has gradient $2(w-4)=0$, so $w^*=4$." },
      { title: "Saddle diagnosis", background: "$f(x,y)=x^2-y^2$ has gradient $0$ at $(0,0)$ but Hessian diag$(2,-2)$, so it is not a minimum.", numbers: "$f(x,y)=x^2-y^2$ has gradient $0$ at $(0,0)$ but Hessian diag$(2,-2)$, so it is not a minimum." },
      { title: "Least squares normal equation", background: "$\\nabla \\tfrac12\\Vert Xw-y\\Vert^2=X^T(Xw-y)=0$.", numbers: "$\\nabla \\tfrac12\\Vert Xw-y\\Vert^2=X^T(Xw-y)=0$." },
      { title: "Ridge solution", background: "if $X^TX=3$ and $\\lambda=1$, $X^Ty=8$, then $(3+1)w=8$ gives $w=2$.", numbers: "if $X^TX=3$ and $\\lambda=1$, $X^Ty=8$, then $(3+1)w=8$ gives $w=2$." },
      { title: "Flat direction", background: "Hessian diag$(2,0)$ means no curvature in one direction, so the condition is inconclusive.", numbers: "Hessian diag$(2,0)$ means no curvature in one direction, so the condition is inconclusive." },
      { title: "Logistic optimum check", background: "if a reported model has gradient norm $10^{-5}$, it is nearly stationary.", numbers: "if a reported model has gradient norm $10^{-5}$, it is nearly stationary." },
    ]
  },
  "math-22-05": {
    connectionsProse: "<p>This lesson builds on the gradient and on the first-order Taylor approximation. The gradient tells the local direction in which a loss increases fastest. Taylor's formula tells how a small step changes the loss to first order. Put those together, and the update rule for gradient descent becomes a direct consequence rather than a rule to memorize.</p>" +
      "<p>This is also the central optimizer pattern for the rest of the section. Momentum changes how steps are accumulated, SGD changes how the gradient is estimated, adaptive methods rescale the step coordinate by coordinate, and Newton-type methods replace the first-order local model with a second-order one. The plain gradient descent step is the baseline those refinements modify.</p>",
    motivation: "<p>Training a model means choosing parameters that make a loss small. At a current parameter value $w$, the optimizer usually does not know the whole loss surface. It only has local information: the value of the loss and its gradient. Gradient descent uses that local information in the most direct way. If $\\nabla f(w)$ points uphill, then $-\\nabla f(w)$ points downhill, so a small step in that direction should reduce the loss.</p>" +
      "<p>The learning rate $\\rho$ controls how much trust the optimizer puts in this local picture. A tiny $\\rho$ is cautious and may require many steps. A very large $\\rho$ can jump past the low point and increase the loss. On the simple loss $f(w)=(w-4)^2$, starting from $w_0=0$ with $\\rho=0.25$ gives $w_1=2$, $w_2=3$, and $w_3=3.5$. The iterates move halfway from the current value to the minimizer each time, so the loss drops from $16$ to $4$ to $1$ to $0.25$.</p>",
    definition: "<p><b>Statement.</b> Gradient descent updates parameters by stepping against the current gradient.</p>" +
      "<p>$$w_{k+1}=w_k-\\rho \\nabla f(w_k).$$</p>" +
      "<p><b>Assumptions that matter:</b> Assume $f$ is differentiable near $w_k$ and $\\rho$ is small enough that the local model is useful.</p>",
    symbols: [
      { sym: "$w_k$", desc: "the parameter vector after $k$ updates" },
      { sym: "$f$", desc: "the objective or loss" },
      { sym: "$\\nabla f(w_k)$", desc: "the gradient at the current parameters" },
      { sym: "$\\rho>0$", desc: "the learning rate" },
      { sym: "$s$", desc: "the proposed step" },
      { sym: "$u$", desc: "a unit direction" },
      { sym: "$\\Vert\\nabla f(w_k)\\Vert$", desc: "the local steepness" },
    ],
    derivation: [
      { do: "Start with the first-order Taylor approximation $f(w+s)\\approx f(w)+\\nabla f(w)^\\top s$", result: "Start with the first-order Taylor approximation $f(w+s)\\approx f(w)+\\nabla f(w)^\\top s$", why: "for a small step $s$, the gradient gives the linear change in loss." },
      { do: "Restrict to steps with fixed length $\\Vert s\\Vert=\\rho$", result: "Restrict to steps with fixed length $\\Vert s\\Vert=\\rho$", why: "otherwise the linear model would prefer an infinitely long downhill step." },
      { do: "Write $s=\\rho u$ with $\\Vert u\\Vert=1$", result: "Write $s=\\rho u$ with $\\Vert u\\Vert=1$", why: "this separates step size from direction." },
      { do: "Substitute", result: "$f(w+\\rho u)\\approx f(w)+\\rho \\nabla f(w)^\\top u$", why: "only the dot product depends on direction." },
      { do: "Use Cauchy--Schwarz", result: "$\\nabla f(w)^\\top u\\ge -\\Vert\\nabla f(w)\\Vert$", why: "the smallest possible dot product occurs when $u$ points opposite the gradient." },
      { do: "The minimizing unit direction is $u=-\\nabla f(w)/\\Vert\\nabla f(w)\\Vert$", result: "The minimizing unit direction is $u=-\\nabla f(w)/\\Vert\\nabla f(w)\\Vert$", why: "this is the steepest local decrease direction." },
      { do: "Absorb the gradient length into the step coefficient by choosing $s=-\\rho\\nabla f(w)$", result: "Absorb the gradient length into the step coefficient by choosing $s=-\\rho\\nabla f(w)$", why: "practical gradient descent uses a learning rate multiplying the whole gradient." },
      { do: "Add the step to the current point", result: "$w_{k+1}=w_k+s=w_k-\\rho\\nabla f(w_k)$", why: "this is the update rule." },
      { do: "For $f(w)=(w-4)^2$, compute $\\nabla f(w)=2(w-4)$", result: "For $f(w)=(w-4)^2$, compute $\\nabla f(w)=2(w-4)$", why: "differentiate the scalar quadratic." },
      { do: "With $w_0=0$ and $\\rho=0.25$,", result: "$w_1=0-0.25(-8)=2$", why: "one explicit step verifies the rule." },
    ],
    applications: [
      { title: "Quadratic training step", background: "for $f(w)=(w-4)^2$, $w_0=0$, and $\\rho=0.25$, the gradient is $-8$, so $w_1=2$ and the loss drops from $16$ to $4$.", numbers: "for $f(w)=(w-4)^2$, $w_0=0$, and $\\rho=0.25$, the gradient is $-8$, so $w_1=2$ and the loss drops from $16$ to $4$." },
      { title: "Three-step loss check", background: "the same run gives $w_2=3$, $w_3=3.5$, and $f(w_3)=0.25$, showing the half-distance pattern.", numbers: "the same run gives $w_2=3$, $w_3=3.5$, and $f(w_3)=0.25$, showing the half-distance pattern." },
      { title: "Too-large learning rate", background: "with $\\rho=1.1$, $w_1=8.8$ and $f(w_1)=23.04$, so the loss increases from $16$; the update rule exposes overshoot.", numbers: "with $\\rho=1.1$, $w_1=8.8$ and $f(w_1)=23.04$, so the loss increases from $16$; the update rule exposes overshoot." },
      { title: "Linear-regression gradient", background: "for $L(w)=\\tfrac12(2w-6)^2$, $\\nabla L=2(2w-6)$. At $w=0$ and $\\rho=0.1$, $w^+=1.2$.", numbers: "for $L(w)=\\tfrac12(2w-6)^2$, $\\nabla L=2(2w-6)$. At $w=0$ and $\\rho=0.1$, $w^+=1.2$." },
      { title: "Vector weight update", background: "for $g=(3,-4)$ and $\\rho=0.05$, the update is $w^+=w-(0.15,-0.20)$; the step length is $0.05\\cdot5=0.25$.", numbers: "for $g=(3,-4)$ and $\\rho=0.05$, the update is $w^+=w-(0.15,-0.20)$; the step length is $0.05\\cdot5=0.25$." },
      { title: "Fine-tuning scale", background: "if an adapter gradient norm is $0.8$ and $\\rho=2\\times10^{-4}$, the parameter step norm is $1.6\\times10^{-4}$.", numbers: "if an adapter gradient norm is $0.8$ and $\\rho=2\\times10^{-4}$, the parameter step norm is $1.6\\times10^{-4}$." },
    ]
  },
  "math-22-06": {
    connectionsProse: "<p>This lesson follows directly from gradient descent. The update rule tells where the next iterate goes; a convergence rate tells how quickly the iterates approach the optimum. For smooth strongly convex losses, the distance to the optimum can shrink by a fixed factor at each step. That makes progress measurable before running an optimizer indefinitely.</p>",
    motivation: "<p>Optimization is not only about choosing a direction. It is also about understanding how much improvement to expect after many repeated updates. A convergence rate turns the repeated update into a bound on the remaining error. In the simplest quadratic case, the whole story is visible from one scalar recurrence.</p>" +
      "<p>Strong convexity supplies enough upward curvature to pull the iterate toward a unique minimum, while smoothness limits how abruptly the gradient can change. When the step size is chosen from the smoothness scale, the error is multiplied by a factor less than one. A smaller factor means faster convergence; a poor condition number makes the factor close to one and progress slow.</p>",
    definition: "<p><b>Statement.</b> Scalar strongly convex quadratic $f(w)=\\tfrac12 a(w-w^*)^2$.</p>" +
      "<p><b>Assumptions that matter:</b> Use the stated variables and the regularity conditions in the plan.</p>",
    symbols: [
      { sym: "$\\mu$", desc: "strong convexity" },
      { sym: "$L$", desc: "gradient Lipschitz smoothness" },
      { sym: "$\\kappa=L/\\mu$", desc: "condition number" },
      { sym: "$w^*$", desc: "the optimum" },
      { sym: "$k$", desc: "iteration count" },
    ],
    derivation: [
      { do: "Compute the gradient $\\nabla f(w)=a(w-w^*)$", result: "Compute the gradient $\\nabla f(w)=a(w-w^*)$", why: "differentiate the quadratic." },
      { do: "Apply gradient descent $w_{k+1}=w_k-\\rho a(w_k-w^*)$", result: "Apply gradient descent $w_{k+1}=w_k-\\rho a(w_k-w^*)$", why: "substitute the gradient." },
      { do: "Subtract $w^*$", result: "$w_{k+1}-w^*=(1-\\rho a)(w_k-w^*)$", why: "isolate the error." },
      { do: "Take absolute values", result: "$|w_{k+1}-w^*|=|1-\\rho a| |w_k-w^*|$", why: "one step multiplies error." },
      { do: "Iterate the recurrence", result: "$|w_k-w^*|=|1-\\rho a|^k |w_0-w^*|$", why: "repeated multiplication." },
      { do: "For a general $\\mu$-strongly convex, $L$-smooth objective with $\\rho=1/L$, the analogous factor is at most $1-\\mu/L$.", result: "For a general $\\mu$-strongly convex, $L$-smooth objective with $\\rho=1/L$, the analogous factor is at most $1-\\mu/L$.", why: "" },
    ],
    applications: [
      { title: "Exact scalar rate", background: "for $a=2$ and $\\rho=0.25$, the error factor is $0.5$ per step.", numbers: "for $a=2$ and $\\rho=0.25$, the error factor is $0.5$ per step." },
      { title: "Six-step bound", background: "from initial loss $16$, the factor $0.5^6$ gives loss bound $0.25$.", numbers: "from initial loss $16$, the factor $0.5^6$ gives loss bound $0.25$." },
      { title: "Condition number effect", background: "$\\mu=1,L=10$ gives factor $0.9$ with $\\rho=0.1$.", numbers: "$\\mu=1,L=10$ gives factor $0.9$ with $\\rho=0.1$." },
      { title: "Iteration planning", background: "$0.9^{44}\\approx0.0097$, so about $44$ steps reduce error below $1\\%$.", numbers: "$0.9^{44}\\approx0.0097$, so about $44$ steps reduce error below $1\\%$." },
      { title: "Better conditioning", background: "if scaling improves $L/\\mu$ from $100$ to $10$, the factor improves from $0.99$ to $0.9$.", numbers: "if scaling improves $L/\\mu$ from $100$ to $10$, the factor improves from $0.99$ to $0.9$." },
      { title: "Early-stopping readout", background: "loss ratio $0.25$ after two steps matches a per-step error factor $0.5$ and loss factor $0.25$ on the quadratic.", numbers: "loss ratio $0.25$ after two steps matches a per-step error factor $0.5$ and loss factor $0.25$ on the quadratic." },
    ]
  },
  "math-22-07": {
    connectionsProse: "<p>This lesson keeps the descent direction from gradient-based methods but changes how the step length is chosen. Instead of fixing one learning rate ahead of time, line search studies the objective along a single line. That turns a multivariable choice into a one-dimensional problem. Later damped Newton and quasi-Newton methods use the same idea to make large steps safer.</p>",
    motivation: "<p>A direction can be good while a step length is poor. Moving too little wastes progress, while moving too far can pass the valley and increase the loss. Line search separates those two decisions: first choose a direction $p$, then choose a scalar $\\alpha$ that says how far to travel along that direction.</p>" +
      "<p>For a quadratic objective, exact line search can be derived by substituting $x+\\alpha p$ into the objective and minimizing the resulting one-variable quadratic. In more general training loops, exact minimization may be too expensive, so backtracking and Armijo checks look for enough decrease rather than the perfect line minimum.</p>",
    definition: "<p><b>Statement.</b> Exact line search for a quadratic $f(x)=\\tfrac12x^TAx-b^Tx$ along direction $p$.</p>" +
      "<p><b>Assumptions that matter:</b> Use the stated variables and the regularity conditions in the plan.</p>",
    symbols: [
      { sym: "$\\alpha$", desc: "the line-search step" },
      { sym: "$p$", desc: "the search direction" },
      { sym: "$g$", desc: "the current gradient" },
      { sym: "$A$", desc: "the quadratic curvature matrix" },
    ],
    derivation: [
      { do: "Define $\\phi(\\alpha)=f(x+\\alpha p)$", result: "Define $\\phi(\\alpha)=f(x+\\alpha p)$", why: "restrict the objective to the line." },
      { do: "Expand $\\phi(\\alpha)=\\tfrac12(x+\\alpha p)^TA(x+\\alpha p)-b^T(x+\\alpha p)$", result: "Expand $\\phi(\\alpha)=\\tfrac12(x+\\alpha p)^TA(x+\\alpha p)-b^T(x+\\alpha p)$", why: "substitute the line." },
      { do: "Differentiate", result: "$\\phi'(\\alpha)=p^T(Ax-b)+\\alpha p^TAp$", why: "collect the linear terms in $\\alpha$." },
      { do: "Recognize $g=Ax-b$", result: "Recognize $g=Ax-b$", why: "this is the gradient at $x$." },
      { do: "Set $\\phi'(\\alpha)=0$ for the line minimum", result: "Set $\\phi'(\\alpha)=0$ for the line minimum", why: "one-dimensional optimality." },
      { do: "Solve $\\alpha^*=-p^Tg/(p^TAp)$", result: "Solve $\\alpha^*=-p^Tg/(p^TAp)$", why: "isolate the step length." },
    ],
    applications: [
      { title: "Steepest descent line step", background: "for $f(w)=(w-4)^2$, $w=0$, $p=8$, exact $\\alpha=0.5$ reaches $w=4$.", numbers: "for $f(w)=(w-4)^2$, $w=0$, $p=8$, exact $\\alpha=0.5$ reaches $w=4$." },
      { title: "Quadratic matrix case", background: "$g=(-2,-4)$, $p=(2,4)$, $A=I$ gives $\\alpha=20/20=1$.", numbers: "$g=(-2,-4)$, $p=(2,4)$, $A=I$ gives $\\alpha=20/20=1$." },
      { title: "Backtracking", background: "with $f(0)=16$, $g=-8$, $p=8$, $\\alpha=1$ gives $f(8)=16$ not enough decrease; $\\alpha=0.5$ gives $0$.", numbers: "with $f(0)=16$, $g=-8$, $p=8$, $\\alpha=1$ gives $f(8)=16$ not enough decrease; $\\alpha=0.5$ gives $0$." },
      { title: "Armijo threshold", background: "if $c=10^{-4}$, $\\alpha=0.25$, and $g^Tp=-64$, required decrease is at least $0.0016$.", numbers: "if $c=10^{-4}$, $\\alpha=0.25$, and $g^Tp=-64$, required decrease is at least $0.0016$." },
      { title: "Training-loop tuning", background: "a line search choosing $\\alpha=0.05$ along a gradient norm $10$ takes step norm $0.5$.", numbers: "a line search choosing $\\alpha=0.05$ along a gradient norm $10$ takes step norm $0.5$." },
      { title: "Newton line search", background: "if full Newton increases validation loss, halving $\\alpha$ changes step $(-2,1)$ into $(-1,0.5)$.", numbers: "if full Newton increases validation loss, halving $\\alpha$ changes step $(-2,1)$ into $(-1,0.5)$." },
    ]
  },
  "math-22-08": {
    connectionsProse: "<p>This lesson modifies the gradient descent baseline by adding memory. Plain gradient descent reacts only to the current gradient, while momentum also remembers recent directions. That makes the update less sensitive to one noisy or alternating slope. The idea prepares the way for Nesterov acceleration and for adaptive optimizers that also keep running averages.</p>",
    motivation: "<p>Loss surfaces often have narrow valleys. In such regions, gradients can alternate across the valley while still pointing consistently along the valley floor. Plain gradient descent may zig-zag because each step responds to the newest gradient without remembering that some directions keep reversing.</p>" +
      "<p>Momentum stores a velocity that blends past gradients with the current one. Directions that agree over several steps accumulate, while directions that flip sign partly cancel. The parameter update then moves against this accumulated velocity, so the method can be smoother than using the latest gradient alone.</p>",
    definition: "<p><b>Statement.</b> Heavy-ball update.</p>" +
      "<p><b>Assumptions that matter:</b> Use the stated variables and the regularity conditions in the plan.</p>",
    symbols: [
      { sym: "$v_k$", desc: "velocity" },
      { sym: "$\\beta\\in[0,1)$", desc: "momentum" },
      { sym: "$\\rho$", desc: "learning rate" },
      { sym: "$w_k$", desc: "the parameter vector" },
    ],
    derivation: [
      { do: "Store a velocity $v_k$", result: "Store a velocity $v_k$", why: "this variable remembers past gradient directions." },
      { do: "Blend old velocity and current gradient", result: "$v_{k+1}=\\beta v_k+\\nabla f(w_k)$", why: "$\\beta$ controls memory." },
      { do: "Move against the velocity", result: "$w_{k+1}=w_k-\\rho v_{k+1}$", why: "the accumulated direction becomes the step." },
      { do: "Unroll once", result: "$v_{k+1}=\\nabla f(w_k)+\\beta\\nabla f(w_{k-1})+\\beta^2v_{k-1}$", why: "recent gradients get geometrically decaying weights." },
      { do: "If gradients keep the same sign, the velocity magnitude grows; if they alternate, the blend cancels part of the motion.", result: "If gradients keep the same sign, the velocity magnitude grows; if they alternate, the blend cancels part of the motion.", why: "" },
    ],
    applications: [
      { title: "First momentum step", background: "for $f(w)=(w-4)^2$, $w_0=0$, $\\beta=0.9$, $\\rho=0.1$, $v_1=-8$, so $w_1=0.8$.", numbers: "for $f(w)=(w-4)^2$, $w_0=0$, $\\beta=0.9$, $\\rho=0.1$, $v_1=-8$, so $w_1=0.8$." },
      { title: "Second step", background: "gradient at $0.8$ is $-6.4$, so $v_2=-13.6$ and $w_2=2.16$.", numbers: "gradient at $0.8$ is $-6.4$, so $v_2=-13.6$ and $w_2=2.16$." },
      { title: "Third step", background: "gradient at $2.16$ is $-3.68$, so $v_3=-15.92$ and $w_3=3.752$.", numbers: "gradient at $2.16$ is $-3.68$, so $v_3=-15.92$ and $w_3=3.752$." },
      { title: "Zig-zag damping", background: "gradients $(5,-5)$ with $\\beta=0.9$ give $v_2=-0.5$, much smaller than $5$.", numbers: "gradients $(5,-5)$ with $\\beta=0.9$ give $v_2=-0.5$, much smaller than $5$." },
      { title: "Memory weight", background: "a gradient from three steps ago has weight $\\beta^3=0.729$ when $\\beta=0.9$.", numbers: "a gradient from three steps ago has weight $\\beta^3=0.729$ when $\\beta=0.9$." },
      { title: "Step norm", background: "if $\\Vert v\\Vert=12$ and $\\rho=0.01$, the update length is $0.12$.", numbers: "if $\\Vert v\\Vert=12$ and $\\rho=0.01$, the update length is $0.12$." },
    ]
  },
  "math-22-09": {
    connectionsProse: "<p>This lesson follows momentum by changing where the gradient is evaluated. Heavy-ball momentum uses the slope at the current point and then moves with accumulated velocity. Nesterov acceleration first looks ahead in the direction the velocity is already carrying the parameters. This connects naturally to the idea of correcting a step before it overshoots.</p>",
    motivation: "<p>Momentum can move quickly when gradients agree, but near a valley it may keep pushing in a direction that is about to become too large. Nesterov's method addresses this by computing the gradient at the anticipated next location rather than at the current one. The optimizer uses information from where the momentum is taking it.</p>" +
      "<p>The update still has a velocity and a learning rate, so it remains close to ordinary momentum. The important change is the lookahead point $y_k$. If the slope at that future point has already weakened or changed sign, the velocity is corrected earlier, which can reduce overshoot around curved valleys.</p>",
    definition: "<p><b>Statement.</b> Lookahead update in velocity form.</p>" +
      "<p><b>Assumptions that matter:</b> Use the stated variables and the regularity conditions in the plan.</p>",
    symbols: [
      { sym: "$w_k$", desc: "the current point" },
      { sym: "$y_k$", desc: "the lookahead point" },
      { sym: "$v_k$", desc: "velocity" },
      { sym: "$\\beta$", desc: "momentum" },
      { sym: "$\\rho$", desc: "learning rate" },
    ],
    derivation: [
      { do: "Keep a velocity $v_k$", result: "Keep a velocity $v_k$", why: "it stores the current motion." },
      { do: "Form the lookahead point $y_k=w_k-\\beta v_k$", result: "Form the lookahead point $y_k=w_k-\\beta v_k$", why: "this is where momentum alone would move next." },
      { do: "Evaluate the gradient $\\nabla f(y_k)$", result: "Evaluate the gradient $\\nabla f(y_k)$", why: "use the slope at the anticipated point." },
      { do: "Update velocity $v_{k+1}=\\beta v_k+\\rho\\nabla f(y_k)$", result: "Update velocity $v_{k+1}=\\beta v_k+\\rho\\nabla f(y_k)$", why: "combine memory and lookahead gradient." },
      { do: "Move $w_{k+1}=w_k-v_{k+1}$", result: "Move $w_{k+1}=w_k-v_{k+1}$", why: "subtract the corrected velocity." },
      { do: "Compared with heavy-ball momentum, the gradient location changes from $w_k$ to $y_k$, giving earlier correction near a valley.", result: "Compared with heavy-ball momentum, the gradient location changes from $w_k$ to $y_k$, giving earlier correction near a valley.", why: "" },
    ],
    applications: [
      { title: "First Nesterov step", background: "from $w_0=0,v_0=0$, $f(w)=(w-4)^2$, $\\beta=0.9$, $\\rho=0.1$, gradient $-8$ gives $v_1=-0.8$ and $w_1=0.8$.", numbers: "from $w_0=0,v_0=0$, $f(w)=(w-4)^2$, $\\beta=0.9$, $\\rho=0.1$, gradient $-8$ gives $v_1=-0.8$ and $w_1=0.8$." },
      { title: "Lookahead second step", background: "$y_1=0.8-0.9(-0.8)=1.52$, gradient $-4.96$, $v_2=-1.216$, and $w_2=2.016$.", numbers: "$y_1=0.8-0.9(-0.8)=1.52$, gradient $-4.96$, $v_2=-1.216$, and $w_2=2.016$." },
      { title: "Correction size", background: "heavy-ball used gradient $-6.4$ at $0.8$; Nesterov uses $-4.96$, a smaller correction by $1.44$.", numbers: "heavy-ball used gradient $-6.4$ at $0.8$; Nesterov uses $-4.96$, a smaller correction by $1.44$." },
      { title: "Lookahead distance", background: "if $\\Vert v\\Vert=0.5$ and $\\beta=0.9$, the lookahead is $0.45$ units away.", numbers: "if $\\Vert v\\Vert=0.5$ and $\\beta=0.9$, the lookahead is $0.45$ units away." },
      { title: "Learning-rate step", background: "with gradient norm $4.96$ and $\\rho=0.1$, the fresh gradient contribution has norm $0.496$.", numbers: "with gradient norm $4.96$ and $\\rho=0.1$, the fresh gradient contribution has norm $0.496$." },
      { title: "Valley braking", background: "if the lookahead gradient flips from $-3$ to $+1$, the velocity update is reduced by $0.1$ in the forward direction.", numbers: "if the lookahead gradient flips from $-3$ to $+1$, the velocity update is reduced by $0.1$ in the forward direction." },
    ]
  },
  "math-22-10": {
    connectionsProse: "<p>This lesson extends the gradient idea to convex functions with corners. Earlier optimality conditions used ordinary derivatives, but losses and penalties such as absolute value, hinge loss, and ReLU are not smooth everywhere. A subgradient keeps the first-order lower-bound idea alive at those nonsmooth points. That makes nonsmooth optimization possible without pretending every objective has a classical derivative.</p>",
    motivation: "<p>At a smooth point, the tangent line gives the local slope. At a corner, there may be many supporting lines rather than one tangent. A subgradient is any slope that stays below the convex function everywhere when anchored at the point of interest.</p>" +
      "<p>The absolute value function at zero is the cleanest example. Its left derivative is $-1$ and its right derivative is $1$, and every slope between them supports the V-shaped graph from below. This interval of valid slopes becomes the subdifferential, which can be used in optimality certificates and subgradient steps.</p>",
    definition: "<p><b>Statement.</b> Subdifferential of $f(x)=|x|$ at $0$.</p>" +
      "<p><b>Assumptions that matter:</b> Use the stated variables and the regularity conditions in the plan.</p>",
    symbols: [
      { sym: "$\\partial f(x)$", desc: "the set of subgradients" },
      { sym: "$g$", desc: "one subgradient" },
      { sym: "$y$", desc: "a comparison point" },
    ],
    derivation: [
      { do: "A number $g$ is a subgradient at $0$ if $|y|\\ge |0|+g(y-0)$ for every $y$.", result: "A number $g$ is a subgradient at $0$ if $|y|\\ge |0|+g(y-0)$ for every $y$.", why: "" },
      { do: "Simplify to $|y|\\ge gy$", result: "Simplify to $|y|\\ge gy$", why: "$|0|=0$." },
      { do: "For $y>0$, divide by $y$", result: "$1\\ge g$", why: "positive directions bound $g$ above." },
      { do: "For $y<0$, divide by the negative number $y$ and reverse the inequality", result: "$-1\\le g$.", why: "" },
      { do: "Combine the bounds", result: "$g\\in[-1,1]$.", why: "" },
      { do: "Therefore $\\partial |0|=[-1,1]$", result: "Therefore $\\partial |0|=[-1,1]$", why: "every slope between the left and right derivatives supports the corner." },
    ],
    applications: [
      { title: "L1 penalty at zero", background: "$\\partial |0|=[-1,1]$, so gradient $0.3$ from the smooth loss can be canceled by L1 with $\\lambda=0.5$ because $-0.6\\in[-1,1]$.", numbers: "$\\partial |0|=[-1,1]$, so gradient $0.3$ from the smooth loss can be canceled by L1 with $\\lambda=0.5$ because $-0.6\\in[-1,1]$." },
      { title: "L1 away from zero", background: "at $x=3$, the subgradient of $|x|$ is $1$.", numbers: "at $x=3$, the subgradient of $|x|$ is $1$." },
      { title: "Hinge loss", background: "for $\\max(0,1-yw^Tx)$ at margin $0.7$, subgradient is $-yx$; at margin $1.2$, it is $0$.", numbers: "for $\\max(0,1-yw^Tx)$ at margin $0.7$, subgradient is $-yx$; at margin $1.2$, it is $0$." },
      { title: "ReLU corner", background: "at input $0$, any slope in $[0,1]$ is a valid subgradient choice.", numbers: "at input $0$, any slope in $[0,1]$ is a valid subgradient choice." },
      { title: "Subgradient step", background: "for $|x|$ at $x=2$, step $\\rho=0.4$ gives $x^+=1.6$.", numbers: "for $|x|$ at $x=2$, step $\\rho=0.4$ gives $x^+=1.6$." },
      { title: "Optimality certificate", background: "$0\\in\\partial |0|$, so $x=0$ minimizes $|x|$.", numbers: "$0\\in\\partial |0|$, so $x=0$ minimizes $|x|$." },
    ]
  },
  "math-22-11": {
    connectionsProse: "<p>This lesson builds on subgradients and applies them to objectives made from corners, maxima, and piecewise formulas. Many machine-learning losses are smooth only in pieces. Nonsmooth optimization keeps a usable descent signal by choosing from active gradients or their convex combinations. The lesson also prepares for proximal methods, which handle some nonsmooth terms by solving a small exact subproblem.</p>",
    motivation: "<p>A max objective changes behavior depending on which piece is largest. Away from a tie, the active piece supplies the slope. At a tie, several pieces are active, and the set of valid first-order signals can include combinations of their gradients.</p>" +
      "<p>The main idea is still the convex lower-bound property. If an active component supports itself from below, and the maximum is at least that component everywhere, then the active gradient supports the maximum. This gives an optimization method a principled slope-like object even when the ordinary gradient is not unique.</p>",
    definition: "<p><b>Statement.</b> Subgradient of a maximum $f(x)=\\max_i f_i(x)$.</p>" +
      "<p><b>Assumptions that matter:</b> Use the stated variables and the regularity conditions in the plan.</p>",
    symbols: [
      { sym: "$f_i$", desc: "smooth component functions" },
      { sym: "$A(x)$", desc: "the active set" },
      { sym: "$\\partial f(x)$", desc: "the subdifferential" },
    ],
    derivation: [
      { do: "Let $A(x)=\\{i:f_i(x)=f(x)\\}$", result: "Let $A(x)=\\{i:f_i(x)=f(x)\\}$", why: "active indices attain the maximum." },
      { do: "For any active $i$, convexity", result: "$f_i(y)\\ge f_i(x)+\\nabla f_i(x)^T(y-x)$", why: "tangent lower bound for that piece." },
      { do: "Since $f(y)=\\max_j f_j(y)\\ge f_i(y)$", result: "Since $f(y)=\\max_j f_j(y)\\ge f_i(y)$", why: "the maximum is at least any piece." },
      { do: "Combine", result: "$f(y)\\ge f(x)+\\nabla f_i(x)^T(y-x)$", why: "an active gradient supports the max." },
      { do: "Therefore every active gradient is a subgradient; convex combinations of active gradients are also subgradients because the inequality is preserved by averaging.", result: "Therefore every active gradient is a subgradient; convex combinations of active gradients are also subgradients because the inequality is preserved by averaging.", why: "" },
    ],
    applications: [
      { title: "Max loss", background: "$f(x)=\\max(x,2x-1)$ at $x=1$ has both pieces active and subgradients in $[1,2]$.", numbers: "$f(x)=\\max(x,2x-1)$ at $x=1$ has both pieces active and subgradients in $[1,2]$." },
      { title: "Hinge objective", background: "if margin is $0.4$, the active hinge piece gives subgradient $-yx$.", numbers: "if margin is $0.4$, the active hinge piece gives subgradient $-yx$." },
      { title: "Worst-case robust loss", background: "losses $(0.8,1.2,0.9)$ activate the second example only.", numbers: "losses $(0.8,1.2,0.9)$ activate the second example only." },
      { title: "Minibatch max", background: "two active examples with gradients $(1,0)$ and $(0,3)$ allow average subgradient $(0.5,1.5)$.", numbers: "two active examples with gradients $(1,0)$ and $(0,3)$ allow average subgradient $(0.5,1.5)$." },
      { title: "Absolute value as max", background: "$|x|=\\max(x,-x)$; at $0$, active slopes $1$ and $-1$ give interval $[-1,1]$.", numbers: "$|x|=\\max(x,-x)$; at $0$, active slopes $1$ and $-1$ give interval $[-1,1]$." },
      { title: "Step with active gradient", background: "for $f(x)=\\max(x,2x-1)$ at $x=2$, active slope $2$ and $\\rho=0.1$ give $x^+=1.8$.", numbers: "for $f(x)=\\max(x,2x-1)$ at $x=2$, active slope $2$ and $\\rho=0.1$ give $x^+=1.8$." },
    ]
  },
  "math-22-12": {
    connectionsProse: "<p>This lesson follows nonsmooth optimization by showing a different way to handle a nonsmooth term. Instead of taking an arbitrary subgradient step, a proximal method solves a small local problem exactly. The method is especially useful for penalties such as L1 regularization. It connects optimization updates to sparsity through the soft-thresholding operator.</p>",
    motivation: "<p>In a regularized problem, the smooth loss may suggest a gradient step to a point $v$, while the nonsmooth penalty may prefer shrinking or zeroing coordinates. A proximal step balances those two forces. It stays near $v$ but pays the penalty cost exactly in the local subproblem.</p>" +
      "<p>For the L1 penalty, this balance has a simple form. Large positive values are pulled down by $\\lambda$, large negative values are pulled up by $\\lambda$, and small values are set exactly to zero. The derivation checks the positive, negative, and zero cases separately, which is why soft-thresholding naturally appears.</p>",
    definition: "<p><b>Statement.</b> Proximal operator of $\\lambda |x|$.</p>" +
      "<p><b>Assumptions that matter:</b> Use the stated variables and the regularity conditions in the plan.</p>",
    symbols: [
      { sym: "$v$", desc: "the point after the smooth gradient step" },
      { sym: "$\\lambda$", desc: "penalty strength" },
      { sym: "$\\operatorname{prox}$", desc: "the proximal operator" },
    ],
    derivation: [
      { do: "Define $\\operatorname{prox}_{\\lambda|\\cdot|}(v)=\\arg\\min_x \\tfrac12(x-v)^2+\\lambda|x|$", result: "Define $\\operatorname{prox}_{\\lambda|\\cdot|}(v)=\\arg\\min_x \\tfrac12(x-v)^2+\\lambda|x|$", why: "stay near $v$ while paying L1 cost." },
      { do: "For $x>0$, derivative is $x-v+\\lambda$", result: "For $x>0$, derivative is $x-v+\\lambda$", why: "$|x|=x$." },
      { do: "Set derivative $0$", result: "$x=v-\\lambda$", why: "valid only when $v>\\lambda$." },
      { do: "For $x<0$, derivative is $x-v-\\lambda$", result: "For $x<0$, derivative is $x-v-\\lambda$", why: "$|x|=-x$." },
      { do: "Set derivative $0$", result: "$x=v+\\lambda$", why: "valid only when $v<-\\lambda$." },
      { do: "For $x=0$, optimality requires $0\\in -v+\\lambda[-1,1]$", result: "For $x=0$, optimality requires $0\\in -v+\\lambda[-1,1]$", why: "the subgradient at the kink must contain zero." },
      { do: "This holds when $|v|\\le\\lambda$.", result: "This holds when $|v|\\le\\lambda$.", why: "" },
      { do: "Combine cases", result: "$\\operatorname{prox}_{\\lambda|\\cdot|}(v)=\\operatorname{sign}(v)\\max(|v|-\\lambda,0)$.", why: "" },
    ],
    applications: [
      { title: "Soft threshold large weight", background: "$v=3$, $\\lambda=0.4$ gives $2.6$.", numbers: "$v=3$, $\\lambda=0.4$ gives $2.6$." },
      { title: "Soft threshold small weight", background: "$v=0.2$, $\\lambda=0.4$ gives $0$.", numbers: "$v=0.2$, $\\lambda=0.4$ gives $0$." },
      { title: "Sparse vector", background: "applying $\\lambda=0.5$ to $(1.2,-0.3,0.7)$ gives $(0.7,0,0.2)$.", numbers: "applying $\\lambda=0.5$ to $(1.2,-0.3,0.7)$ gives $(0.7,0,0.2)$." },
      { title: "ISTA step", background: "if smooth gradient step gives $v=1.1$ and $\\lambda\\rho=0.2$, the L1 prox gives $0.9$.", numbers: "if smooth gradient step gives $v=1.1$ and $\\lambda\\rho=0.2$, the L1 prox gives $0.9$." },
      { title: "Denoising coefficient", background: "wavelet coefficient $-0.9$ with threshold $0.25$ becomes $-0.65$.", numbers: "wavelet coefficient $-0.9$ with threshold $0.25$ becomes $-0.65$." },
      { title: "Group shrink analogy", background: "vector norm $5$ with threshold $1$ scales by $1-1/5=0.8$.", numbers: "vector norm $5$ with threshold $1$ scales by $1-1/5=0.8$." },
    ]
  },
  "math-22-13": {
    connectionsProse: "<p>This lesson returns to gradient descent and changes how the gradient is obtained. Full-batch gradient descent uses every example before taking one step. SGD uses one example or a minibatch, making each update cheaper and noisier. That tradeoff is central to large-scale machine learning and leads naturally to variance reduction and adaptive optimizers.</p>",
    motivation: "<p>When a dataset is large, computing the full gradient can be expensive. SGD replaces that full average with a randomly sampled example or minibatch. The step may not point exactly in the full-gradient direction, but it can be computed quickly and repeated many times.</p>" +
      "<p>The key mathematical comfort is unbiasedness. If the example is sampled uniformly, the expected sampled gradient equals the full empirical gradient. The noise can make individual steps move in imperfect directions, but over repeated fair samples the update is centered on the same direction as full gradient descent.</p>",
    definition: "<p><b>Statement.</b> Unbiased minibatch gradient.</p>" +
      "<p><b>Assumptions that matter:</b> Use the stated variables and the regularity conditions in the plan.</p>",
    symbols: [
      { sym: "$F$", desc: "full empirical loss" },
      { sym: "$f_i$", desc: "one-example loss" },
      { sym: "$I$", desc: "a random index" },
      { sym: "$B$", desc: "a minibatch" },
      { sym: "$\\eta$", desc: "the SGD learning rate" },
    ],
    derivation: [
      { do: "Write the empirical loss $F(w)=\\tfrac1n\\sum_{i=1}^n f_i(w)$", result: "Write the empirical loss $F(w)=\\tfrac1n\\sum_{i=1}^n f_i(w)$", why: "average over examples." },
      { do: "Differentiate", result: "$\\nabla F(w)=\\tfrac1n\\sum_i \\nabla f_i(w)$", why: "gradient of an average is the average gradient." },
      { do: "Sample index $I$ uniformly from $\\{1,\\dots,n\\}$", result: "Sample index $I$ uniformly from $\\{1,\\dots,n\\}$", why: "each example has probability $1/n$." },
      { do: "Take expectation", result: "$\\mathbb E[\\nabla f_I(w)]=\\sum_i (1/n)\\nabla f_i(w)$", why: "definition of expectation." },
      { do: "Therefore $\\mathbb E[\\nabla f_I(w)]=\\nabla F(w)$", result: "Therefore $\\mathbb E[\\nabla f_I(w)]=\\nabla F(w)$", why: "the single-example gradient is unbiased." },
      { do: "For minibatch $B$, averaging sampled gradients keeps the same expectation and reduces variance.", result: "For minibatch $B$, averaging sampled gradients keeps the same expectation and reduces variance.", why: "" },
    ],
    applications: [
      { title: "Unbiased scalar sample", background: "gradients $-6$ and $-10$ average to $-8$, matching the full gradient.", numbers: "gradients $-6$ and $-10$ average to $-8$, matching the full gradient." },
      { title: "One SGD step", background: "from $w=0$, sample gradient $-6$ and $\\eta=0.1$ gives $w^+=0.6$.", numbers: "from $w=0$, sample gradient $-6$ and $\\eta=0.1$ gives $w^+=0.6$." },
      { title: "Minibatch average", background: "gradients $(-6,-10,-8,-4)$ average to $-7$.", numbers: "gradients $(-6,-10,-8,-4)$ average to $-7$." },
      { title: "Variance reduction by batch", background: "if single-gradient variance is $16$, batch size $4$ reduces variance to $4$.", numbers: "if single-gradient variance is $16$, batch size $4$ reduces variance to $4$." },
      { title: "Epoch accounting", background: "$1000$ examples with batch size $50$ gives $20$ updates per epoch.", numbers: "$1000$ examples with batch size $50$ gives $20$ updates per epoch." },
      { title: "Noisy direction", background: "if full gradient is $-8$ but one sample gives $+2$, the step can briefly move uphill while remaining unbiased over samples.", numbers: "if full gradient is $-8$ but one sample gives $+2$, the step can briefly move uphill while remaining unbiased over samples." },
    ]
  },
  "math-22-14": {
    connectionsProse: "<p>This lesson follows SGD by reducing one of its main costs: gradient noise. SGD is cheap because it samples, but that sampling creates variance. Variance-reduced methods keep stochastic updates while adding stored or reference information. The result is a gradient estimate that remains inexpensive but becomes more stable near the optimum.</p>",
    motivation: "<p>A stochastic gradient can be far from the full gradient for a particular sampled example. SVRG corrects this by comparing the sampled gradient at the current point with the same sampled gradient at a snapshot point. It then adds back the exact full gradient at the snapshot.</p>" +
      "<p>This construction keeps the estimator centered on the true gradient at the current point. Near the snapshot, the difference term can be small, so the variance is reduced. SAG uses stored gradients differently, but the shared goal is the same: avoid paying for a full gradient at every step while making the stochastic direction less noisy.</p>",
    definition: "<p><b>Statement.</b> SVRG estimator.</p>" +
      "<p><b>Assumptions that matter:</b> Use the stated variables and the regularity conditions in the plan.</p>",
    symbols: [
      { sym: "$\\tilde w$", desc: "the snapshot" },
      { sym: "$\\mu$", desc: "the full gradient at the snapshot" },
      { sym: "$g_i(w)$", desc: "the corrected stochastic gradient" },
    ],
    derivation: [
      { do: "Choose a snapshot point $\\tilde w$", result: "Choose a snapshot point $\\tilde w$", why: "this is where the full gradient will be computed." },
      { do: "Compute $\\mu=\\nabla F(\\tilde w)=\\tfrac1n\\sum_i \\nabla f_i(\\tilde w)$", result: "Compute $\\mu=\\nabla F(\\tilde w)=\\tfrac1n\\sum_i \\nabla f_i(\\tilde w)$", why: "exact reference gradient." },
      { do: "At current $w$, sample $i$ and form $g_i(w)=\\nabla f_i(w)-\\nabla f_i(\\tilde w)+\\mu$", result: "At current $w$, sample $i$ and form $g_i(w)=\\nabla f_i(w)-\\nabla f_i(\\tilde w)+\\mu$", why: "replace the old sample gradient with its change plus the full reference." },
      { do: "Take expectation over $i$", result: "$\\mathbb E[g_i(w)]=\\tfrac1n\\sum_i\\nabla f_i(w)-\\tfrac1n\\sum_i\\nabla f_i(\\tilde w)+\\mu$.", why: "" },
      { do: "Substitute $\\mu=\\tfrac1n\\sum_i\\nabla f_i(\\tilde w)$", result: "Substitute $\\mu=\\tfrac1n\\sum_i\\nabla f_i(\\tilde w)$", why: "reference terms cancel." },
      { do: "Therefore $\\mathbb E[g_i(w)]=\\nabla F(w)$", result: "Therefore $\\mathbb E[g_i(w)]=\\nabla F(w)$", why: "the estimator is unbiased." },
    ],
    applications: [
      { title: "SVRG scalar check", background: "at $w$, sample gradient $-5$; at snapshot, same sample gradient $-7$; full snapshot gradient $-8$ gives estimator $-6$.", numbers: "at $w$, sample gradient $-5$; at snapshot, same sample gradient $-7$; full snapshot gradient $-8$ gives estimator $-6$." },
      { title: "Unbiased average", background: "sample pairs $(-5,-7)$ and $(-11,-9)$ with $\\mu=-8$ give estimators $-6$ and $-10$, average $-8$.", numbers: "sample pairs $(-5,-7)$ and $(-11,-9)$ with $\\mu=-8$ give estimators $-6$ and $-10$, average $-8$." },
      { title: "Step from estimator", background: "with $\\eta=0.1$ and $g=-6$, $w^+=w+0.6$.", numbers: "with $\\eta=0.1$ and $g=-6$, $w^+=w+0.6$." },
      { title: "SAG memory average", background: "stored gradients $(-6,-10,-8,-4)$ average to $-7$.", numbers: "stored gradients $(-6,-10,-8,-4)$ average to $-7$." },
      { title: "Updating one memory slot", background: "replacing $-4$ by $-12$ changes the average from $-7$ to $-9$.", numbers: "replacing $-4$ by $-12$ changes the average from $-7$ to $-9$." },
      { title: "Near-snapshot variance", background: "if $\\nabla f_i(w)-\\nabla f_i(\\tilde w)=0.2$ and $\\mu=-1$, estimator is $-0.8$.", numbers: "if $\\nabla f_i(w)-\\nabla f_i(\\tilde w)=0.2$ and $\\mu=-1$, estimator is $-0.8$." },
    ]
  },
  "math-22-15": {
    connectionsProse: "<p>This lesson begins the adaptive optimizer family. Gradient descent and SGD use one learning-rate scale for all coordinates. AdaGrad changes that by tracking how much gradient each coordinate has accumulated. Coordinates with large historical gradients receive smaller future steps, while rarely active coordinates can keep larger effective steps.</p>",
    motivation: "<p>In high-dimensional models, not every parameter behaves the same way. Some coordinates receive frequent large gradients, while sparse features may be updated only occasionally. A single global learning rate can be too large for one coordinate and too small for another.</p>" +
      "<p>AdaGrad stores the coordinatewise sum of squared gradients. Dividing by the square root of that history normalizes future steps by past activity. The price is that the accumulated sum only grows, so effective learning rates can become very small after many updates.</p>",
    definition: "<p><b>Statement.</b> Coordinate update.</p>" +
      "<p><b>Assumptions that matter:</b> Use the stated variables and the regularity conditions in the plan.</p>",
    symbols: [
      { sym: "$g_k$", desc: "the current gradient" },
      { sym: "$G_k$", desc: "the coordinatewise sum of squared gradients" },
      { sym: "$\\odot$", desc: "elementwise multiplication" },
      { sym: "$\\eta$", desc: "the base learning rate" },
      { sym: "$\\epsilon$", desc: "a small stabilizer" },
    ],
    derivation: [
      { do: "Observe gradient $g_k$", result: "Observe gradient $g_k$", why: "this may have one component per parameter." },
      { do: "Accumulate squared gradients $G_k=G_{k-1}+g_k\\odot g_k$", result: "Accumulate squared gradients $G_k=G_{k-1}+g_k\\odot g_k$", why: "each coordinate stores total past squared slope." },
      { do: "Take square roots $\\sqrt{G_k+\\epsilon}$", result: "Take square roots $\\sqrt{G_k+\\epsilon}$", why: "this converts accumulated squared units back to gradient scale and avoids division by zero." },
      { do: "Rescale the gradient coordinatewise", result: "$g_k/(\\sqrt{G_k}+\\epsilon)$", why: "frequently large coordinates are damped." },
      { do: "Update $w_{k+1}=w_k-\\eta g_k/(\\sqrt{G_k}+\\epsilon)$", result: "Update $w_{k+1}=w_k-\\eta g_k/(\\sqrt{G_k}+\\epsilon)$", why: "apply the adaptive step." },
    ],
    applications: [
      { title: "First scalar step", background: "$g_1=-8$, $G_1=64$, $\\eta=1$ gives step $-1$, so $w_1=1$.", numbers: "$g_1=-8$, $G_1=64$, $\\eta=1$ gives step $-1$, so $w_1=1$." },
      { title: "Second scalar step", background: "$g_2=-4$, $G_2=80$, step $-4/\\sqrt{80}=-0.447$, so $w_2=1.447$.", numbers: "$g_2=-4$, $G_2=80$, step $-4/\\sqrt{80}=-0.447$, so $w_2=1.447$." },
      { title: "Sparse feature", background: "coordinate with $G=1$ and $g=1$ steps by $1$, while coordinate with $G=100$ steps by $0.1$.", numbers: "coordinate with $G=1$ and $g=1$ steps by $1$, while coordinate with $G=100$ steps by $0.1$." },
      { title: "Embedding update", background: "rare token gradient norm $0.5$ with history $0.25$ gets normalized step $1.0\\eta$.", numbers: "rare token gradient norm $0.5$ with history $0.25$ gets normalized step $1.0\\eta$." },
      { title: "Learning-rate decay", background: "repeated gradient $2$ for $4$ steps gives $G=16$ and effective scale $1/4$.", numbers: "repeated gradient $2$ for $4$ steps gives $G=16$ and effective scale $1/4$." },
      { title: "Zero-gradient coordinate", background: "$g=0$ gives zero parameter change no matter how small $G$ is.", numbers: "$g=0$ gives zero parameter change no matter how small $G$ is." },
    ]
  },
  "math-22-16": {
    connectionsProse: "<p>This lesson continues adaptive optimization after AdaGrad. AdaGrad's accumulated squared-gradient history never forgets, which can make learning rates shrink too much. RMSProp keeps the coordinatewise scaling idea but replaces the total history with an exponential moving average. That lets the optimizer respond to recent gradient scale.</p>",
    motivation: "<p>The useful part of AdaGrad is coordinatewise normalization: large-gradient coordinates should often take smaller steps. The difficult part is permanent accumulation. A coordinate that had large gradients early may continue to be damped long after the loss surface has changed.</p>" +
      "<p>RMSProp solves this by giving recent squared gradients more weight and older squared gradients geometrically less weight. The denominator estimates recent root-mean-square gradient size. Dividing by that estimate makes steps smaller in recently steep coordinates while allowing old history to fade.</p>",
    definition: "<p><b>Statement.</b> RMSProp update.</p>" +
      "<p><b>Assumptions that matter:</b> Use the stated variables and the regularity conditions in the plan.</p>",
    symbols: [
      { sym: "$r_k$", desc: "the moving average of squared gradients" },
      { sym: "$\\rho$", desc: "the decay rate" },
      { sym: "$\\eta$", desc: "base learning rate" },
      { sym: "$\\epsilon$ prevents division by zero", desc: "as defined in the plan" },
    ],
    derivation: [
      { do: "Observe gradient $g_k$", result: "Observe gradient $g_k$", why: "current stochastic slope." },
      { do: "Update the second-moment average $r_k=\\rho r_{k-1}+(1-\\rho)g_k\\odot g_k$", result: "Update the second-moment average $r_k=\\rho r_{k-1}+(1-\\rho)g_k\\odot g_k$", why: "blend old squared scale with current squared gradient." },
      { do: "Divide by $\\sqrt{r_k+\\epsilon}$", result: "Divide by $\\sqrt{r_k+\\epsilon}$", why: "coordinates with large recent RMS gradients get smaller steps." },
      { do: "Update $w_{k+1}=w_k-\\eta g_k/\\sqrt{r_k+\\epsilon}$", result: "Update $w_{k+1}=w_k-\\eta g_k/\\sqrt{r_k+\\epsilon}$", why: "use the rescaled gradient." },
      { do: "Since weights decay geometrically, a squared gradient from $m$ steps ago has weight $(1-\\rho)\\rho^m$.", result: "Since weights decay geometrically, a squared gradient from $m$ steps ago has weight $(1-\\rho)\\rho^m$.", why: "" },
    ],
    applications: [
      { title: "First RMSProp scale", background: "with $g_1=-8$, $\\rho=0.9$, $r_1=6.4$.", numbers: "with $g_1=-8$, $\\rho=0.9$, $r_1=6.4$." },
      { title: "First step", background: "with $\\eta=0.1$, step is $0.1(-8)/\\sqrt{6.4}=-0.316$, so subtracting it moves $w$ by $+0.316$.", numbers: "with $\\eta=0.1$, step is $0.1(-8)/\\sqrt{6.4}=-0.316$, so subtracting it moves $w$ by $+0.316$." },
      { title: "Second scale", background: "$g_2=-4$ gives $r_2=0.9(6.4)+0.1(16)=7.36$.", numbers: "$g_2=-4$ gives $r_2=0.9(6.4)+0.1(16)=7.36$." },
      { title: "Second step", background: "$0.1(-4)/\\sqrt{7.36}=-0.147$.", numbers: "$0.1(-4)/\\sqrt{7.36}=-0.147$." },
      { title: "Forgetting", background: "a squared gradient's weight after $5$ steps is $0.1(0.9)^5\\approx0.059$.", numbers: "a squared gradient's weight after $5$ steps is $0.1(0.9)^5\\approx0.059$." },
      { title: "Coordinate damping", background: "if $r_1=100$ and $r_2=1$ for equal gradients $1$, the first coordinate step is one tenth the second.", numbers: "if $r_1=100$ and $r_2=1$ for equal gradients $1$, the first coordinate step is one tenth the second." },
    ]
  },
  "math-22-17": {
    connectionsProse: "<p>This lesson combines the two running-average ideas already introduced. Momentum tracks an average of gradients, and RMSProp tracks an average of squared gradients. Adam uses both, then corrects the early-time bias caused by starting those averages at zero. It is one of the most common optimizer updates in modern neural-network training.</p>",
    motivation: "<p>The first moment in Adam behaves like momentum: it smooths the direction of travel by averaging gradients. The second moment behaves like RMSProp: it estimates the recent squared scale of each coordinate. The update divides the smoothed direction by the root of the smoothed squared scale.</p>" +
      "<p>Because both moving averages start at zero, their early values are too small in magnitude. Bias correction divides by the accumulated weight so that the first few estimates are on the right scale. Without that correction, the initial steps would not represent the intended moving averages.</p>",
    definition: "<p><b>Statement.</b> Adam update.</p>" +
      "<p><b>Assumptions that matter:</b> Use the stated variables and the regularity conditions in the plan.</p>",
    symbols: [
      { sym: "$m_t$", desc: "first moment" },
      { sym: "$v_t$", desc: "second moment" },
      { sym: "$\\beta_1,\\beta_2$", desc: "decay rates" },
      { sym: "$\\hat m_t,\\hat v_t$", desc: "bias-corrected estimates" },
      { sym: "$\\eta$", desc: "learning rate" },
    ],
    derivation: [
      { do: "Update first moment $m_t=\\beta_1m_{t-1}+(1-\\beta_1)g_t$", result: "Update first moment $m_t=\\beta_1m_{t-1}+(1-\\beta_1)g_t$", why: "exponential average of gradients." },
      { do: "Update second moment $v_t=\\beta_2v_{t-1}+(1-\\beta_2)g_t^2$", result: "Update second moment $v_t=\\beta_2v_{t-1}+(1-\\beta_2)g_t^2$", why: "exponential average of squared gradients." },
      { do: "Because $m_0=v_0=0$, early averages are biased toward zero.", result: "Because $m_0=v_0=0$, early averages are biased toward zero.", why: "" },
      { do: "Correct first moment", result: "$\\hat m_t=m_t/(1-\\beta_1^t)$", why: "divide by the total accumulated weight." },
      { do: "Correct second moment", result: "$\\hat v_t=v_t/(1-\\beta_2^t)$", why: "same correction for squared gradients." },
      { do: "Update $w_{t+1}=w_t-\\eta \\hat m_t/(\\sqrt{\\hat v_t}+\\epsilon)$", result: "Update $w_{t+1}=w_t-\\eta \\hat m_t/(\\sqrt{\\hat v_t}+\\epsilon)$", why: "momentum direction scaled by RMS magnitude." },
    ],
    applications: [
      { title: "First Adam moment", background: "with $g_1=-8$, $\\beta_1=0.9$, $m_1=-0.8$ and $\\hat m_1=-8$.", numbers: "with $g_1=-8$, $\\beta_1=0.9$, $m_1=-0.8$ and $\\hat m_1=-8$." },
      { title: "First second moment", background: "with $\\beta_2=0.999$, $v_1=0.064$ and $\\hat v_1=64$.", numbers: "with $\\beta_2=0.999$, $v_1=0.064$ and $\\hat v_1=64$." },
      { title: "First step", background: "$\\eta=0.1$ gives update $-0.1(-8)/8=+0.1$, so $w_1=0.1$.", numbers: "$\\eta=0.1$ gives update $-0.1(-8)/8=+0.1$, so $w_1=0.1$." },
      { title: "Second moment estimates", background: "with $g_2=-4$, $\\hat m_2\\approx-5.895$ and $\\hat v_2\\approx39.988$.", numbers: "with $g_2=-4$, $\\hat m_2\\approx-5.895$ and $\\hat v_2\\approx39.988$." },
      { title: "Second step", background: "Adam step is about $+0.0932$, so $w_2\\approx0.1932$.", numbers: "Adam step is about $+0.0932$, so $w_2\\approx0.1932$." },
      { title: "Coordinate scaling", background: "if $\\hat m=(1,1)$ and $\\hat v=(100,1)$, equal learning rate gives coordinate steps $(0.1\\eta,1\\eta)$.", numbers: "if $\\hat m=(1,1)$ and $\\hat v=(100,1)$, equal learning rate gives coordinate steps $(0.1\\eta,1\\eta)$." },
    ]
  },
  "math-22-18": {
    connectionsProse: "<p>This lesson changes the update unit from a full vector step to a one-coordinate step. Instead of moving all variables at once, coordinate descent optimizes one variable while holding the rest fixed. That idea uses ordinary one-dimensional calculus inside a multivariable problem. It is especially useful when each coordinate update is cheap or has a closed form.</p>",
    motivation: "<p>Some objectives are large, sparse, or structured so that updating every parameter at every step is unnecessary. Coordinate descent exploits that structure by reducing the problem to a sequence of simpler one-coordinate minimizations. Each subproblem is easier because all other variables are treated as constants.</p>" +
      "<p>A sweep through coordinates resembles Gauss-Seidel iteration for linear systems. The method can be slow if coordinates are strongly coupled, but it can be very efficient when updates are sparse or separable. The derivation below shows the basic pattern on a two-variable quadratic.</p>",
    definition: "<p><b>Statement.</b> One coordinate update for a quadratic.</p>" +
      "<p><b>Assumptions that matter:</b> Use the stated variables and the regularity conditions in the plan.</p>",
    symbols: [
      { sym: "$x_j$", desc: "the active coordinate" },
      { sym: "all other coordinates", desc: "held fixed" },
      { sym: "$f$", desc: "the objective" },
      { sym: "a sweep updates every coordinate once", desc: "as defined in the plan" },
    ],
    derivation: [
      { do: "Write $f(x,y)=(x-3)^2+2(y+1)^2+xy$", result: "Write $f(x,y)=(x-3)^2+2(y+1)^2+xy$", why: "a two-variable objective." },
      { do: "Hold $y$ fixed and differentiate with respect to $x$", result: "$\\partial f/\\partial x=2(x-3)+y$.", why: "" },
      { do: "Set this derivative to zero", result: "$2x-6+y=0$", why: "one-dimensional optimality along the $x$ coordinate." },
      { do: "Solve $x=(6-y)/2$", result: "Solve $x=(6-y)/2$", why: "coordinate minimizer." },
      { do: "Hold the new $x$ fixed and differentiate with respect to $y$", result: "$\\partial f/\\partial y=4(y+1)+x$.", why: "" },
      { do: "Set to zero and", result: "$y=(2-x)/4$", why: "the $y$ coordinate minimizer." },
    ],
    applications: [
      { title: "First $x$ update", background: "from $(0,0)$, $x=(6-0)/2=3$.", numbers: "from $(0,0)$, $x=(6-0)/2=3$." },
      { title: "First $y$ update", background: "with $x=3$, $y=(2-3)/4=-0.25$.", numbers: "with $x=3$, $y=(2-3)/4=-0.25$." },
      { title: "Lasso coordinate soft threshold", background: "if unregularized coordinate value is $1.2$ and threshold $0.5$, update is $0.7$.", numbers: "if unregularized coordinate value is $1.2$ and threshold $0.5$, update is $0.7$." },
      { title: "Gauss-Seidel linear solve", background: "equations $2x+y=6$, $x+4y=2$ from $(0,0)$ give $(3,-0.25)$ after one sweep.", numbers: "equations $2x+y=6$, $x+4y=2$ from $(0,0)$ give $(3,-0.25)$ after one sweep." },
      { title: "Sparse update savings", background: "updating $10$ active features out of $10{,}000$ touches $0.1\\%$ of coordinates.", numbers: "updating $10$ active features out of $10{,}000$ touches $0.1\\%$ of coordinates." },
      { title: "Block coordinate", background: "updating an embedding vector of dimension $64$ instead of all $1{,}000{,}000$ parameters changes $0.0064\\%$ of weights.", numbers: "updating an embedding vector of dimension $64$ instead of all $1{,}000{,}000$ parameters changes $0.0064\\%$ of weights." },
    ]
  },
  "math-22-19": {
    connectionsProse: "<p>This lesson extends the local model behind gradient descent. Gradient descent uses a first-order linear approximation and steps downhill. Newton's method uses a second-order quadratic approximation, so it also uses curvature. When that quadratic model is accurate and well behaved, the Newton step can move directly to the model's minimizer.</p>",
    motivation: "<p>The gradient tells which direction is downhill, but it does not say how quickly the slope itself is changing. Curvature information helps scale the step. In a direction with high curvature, the method should be more cautious; in a flatter direction, it can move farther.</p>" +
      "<p>Newton's method builds a quadratic model around the current point and minimizes that model exactly. The resulting linear system $Hp=-g$ balances gradient against curvature. This can be powerful, but it depends on the Hessian being useful and often needs damping or line search in non-quadratic problems.</p>",
    definition: "<p><b>Statement.</b> Multivariate Newton step.</p>" +
      "<p><b>Assumptions that matter:</b> Use the stated variables and the regularity conditions in the plan.</p>",
    symbols: [
      { sym: "$g=\\nabla f(x)$", desc: "the gradient" },
      { sym: "$H=\\nabla^2f(x)$", desc: "the Hessian" },
      { sym: "$p$", desc: "the Newton step" },
      { sym: "$x^+$", desc: "the next iterate" },
    ],
    derivation: [
      { do: "Start from the second-order Taylor model $m(p)=f(x)+g^Tp+\\tfrac12p^THp$", result: "Start from the second-order Taylor model $m(p)=f(x)+g^Tp+\\tfrac12p^THp$", why: "approximate the loss after step $p$." },
      { do: "Differentiate the model with respect to $p$", result: "$\\nabla_p m=g+Hp$", why: "gradient of a quadratic." },
      { do: "Set $\\nabla_p m=0$", result: "Set $\\nabla_p m=0$", why: "minimize the local quadratic." },
      { do: "Solve $Hp=-g$", result: "Solve $Hp=-g$", why: "isolate the Newton equation." },
      { do: "If $H$ is invertible, $p=-H^{-1}g$", result: "If $H$ is invertible, $p=-H^{-1}g$", why: "explicit step direction." },
      { do: "Update $x^+=x+p=x-H^{-1}g$", result: "Update $x^+=x+p=x-H^{-1}g$", why: "move to the quadratic model's minimizer." },
    ],
    applications: [
      { title: "Scalar quadratic", background: "for $f(w)=(w-4)^2$ at $w=1$, $g=-6$, $H=2$, so $p=3$ and $w^+=4$.", numbers: "for $f(w)=(w-4)^2$ at $w=1$, $g=-6$, $H=2$, so $p=3$ and $w^+=4$." },
      { title: "Logistic one-parameter step", background: "if $g=0.6$ and $H=3$, $p=-0.2$.", numbers: "if $g=0.6$ and $H=3$, $p=-0.2$." },
      { title: "Two-dimensional diagonal Hessian", background: "$g=(-2,8)$, $H=\\operatorname{diag}(2,4)$ gives $p=(1,-2)$.", numbers: "$g=(-2,8)$, $H=\\operatorname{diag}(2,4)$ gives $p=(1,-2)$." },
      { title: "Damped Newton", background: "with $p=(1,-2)$ and line-search $\\alpha=0.5$, the applied step is $(0.5,-1)$.", numbers: "with $p=(1,-2)$ and line-search $\\alpha=0.5$, the applied step is $(0.5,-1)$." },
      { title: "Ill-conditioning warning", background: "Hessian eigenvalues $1$ and $1000$ give condition number $1000$.", numbers: "Hessian eigenvalues $1$ and $1000$ give condition number $1000$." },
      { title: "Second-order optimum", background: "for $f=\\tfrac12x^THx-b^Tx$, Newton reaches $H^{-1}b$ in one step when $H$ is positive definite.", numbers: "for $f=\\tfrac12x^THx-b^Tx$, Newton reaches $H^{-1}b$ in one step when $H$ is positive definite." },
    ]
  },
  "math-22-20": {
    connectionsProse: "<p>This lesson follows Newton's method by keeping the benefit of curvature scaling while avoiding the full Hessian. Quasi-Newton methods infer curvature from changes in gradients across steps. BFGS maintains an approximation to the inverse Hessian, and L-BFGS stores only recent step-gradient pairs. These methods sit between first-order updates and full second-order Newton steps.</p>",
    motivation: "<p>Full Hessians can be expensive to compute, store, and invert. Still, each step of an optimization run reveals some curvature information: the parameters changed by $s_k$, and the gradient changed by $y_k$. A quadratic objective would connect those through the Hessian.</p>" +
      "<p>Quasi-Newton methods use that observed relation as a constraint on the next curvature approximation. In one dimension, the inverse curvature estimate is simply displacement divided by gradient change. In many dimensions, BFGS updates a matrix while preserving symmetry and positive definiteness when the curvature condition is satisfied.</p>",
    definition: "<p><b>Statement.</b> Secant condition and scalar BFGS intuition.</p>" +
      "<p><b>Assumptions that matter:</b> Use the stated variables and the regularity conditions in the plan.</p>",
    symbols: [
      { sym: "$s_k$", desc: "parameter displacement" },
      { sym: "$y_k$", desc: "gradient displacement" },
      { sym: "$B_k$ approximates Hessian", desc: "as defined in the plan" },
      { sym: "$H_k$ approximates inverse Hessian", desc: "as defined in the plan" },
      { sym: "L-BFGS stores only recent $(s,y)$ pairs", desc: "as defined in the plan" },
    ],
    derivation: [
      { do: "Let $s_k=x_{k+1}-x_k$", result: "Let $s_k=x_{k+1}-x_k$", why: "the step taken." },
      { do: "Let $y_k=g_{k+1}-g_k$", result: "Let $y_k=g_{k+1}-g_k$", why: "the observed gradient change." },
      { do: "For a true Hessian $B$, a quadratic has $y_k=Bs_k$", result: "For a true Hessian $B$, a quadratic has $y_k=Bs_k$", why: "gradient change equals curvature times displacement." },
      { do: "For an inverse-Hessian approximation $H_k$, require $H_{k+1}y_k=s_k$", result: "For an inverse-Hessian approximation $H_k$, require $H_{k+1}y_k=s_k$", why: "this is the inverse secant condition." },
      { do: "In one dimension,", result: "$H_{k+1}=s_k/y_k$", why: "divide the observed step by observed gradient change." },
      { do: "In many dimensions, BFGS chooses a symmetric positive-definite update satisfying the same secant condition when $s_k^Ty_k>0$.", result: "In many dimensions, BFGS chooses a symmetric positive-definite update satisfying the same secant condition when $s_k^Ty_k>0$.", why: "" },
    ],
    applications: [
      { title: "Scalar inverse curvature", background: "if $s=2$ and $y=4$, then $H=0.5$.", numbers: "if $s=2$ and $y=4$, then $H=0.5$." },
      { title: "Quasi-Newton step", background: "with approximate inverse $H=0.5$ and gradient $g=-6$, step $p=-Hg=3$.", numbers: "with approximate inverse $H=0.5$ and gradient $g=-6$, step $p=-Hg=3$." },
      { title: "Curvature condition", background: "$s^Ty=8>0$ keeps the BFGS update positive definite.", numbers: "$s^Ty=8>0$ keeps the BFGS update positive definite." },
      { title: "L-BFGS memory", background: "storing $10$ pairs for $1{,}000{,}000$ parameters stores $20{,}000{,}000$ floats, not a $10^{12}$-entry Hessian.", numbers: "storing $10$ pairs for $1{,}000{,}000$ parameters stores $20{,}000{,}000$ floats, not a $10^{12}$-entry Hessian." },
      { title: "Bad curvature skip", background: "if $s^Ty=-0.1$, skip or damp the update because curvature is not positive.", numbers: "if $s^Ty=-0.1$, skip or damp the update because curvature is not positive." },
      { title: "Line-search pair", background: "step norm $0.2$ and gradient-change norm $1.0$ imply rough inverse scale $0.2$ along that direction.", numbers: "step norm $0.2$ and gradient-change norm $1.0$ imply rough inverse scale $0.2$ along that direction." },
    ]
  },
  "math-22-21": {
    connectionsProse: "<p>This lesson begins the constrained optimization block. Earlier lessons described objectives and feasible sets; Lagrangian duality shows how constraints can be folded into an objective using multipliers. The result is not just a new formula, but a way to create lower bounds for constrained minimization problems. Those bounds lead directly to KKT conditions and the dual problem.</p>",
    motivation: "<p>A constrained minimization problem only allows feasible points. The Lagrangian attaches a multiplier to each inequality constraint, so violations and feasibility affect the objective-like expression. For feasible points and nonnegative multipliers, the constraint terms are nonpositive when written as $g_i(x)\\le0$.</p>" +
      "<p>Because of that sign, minimizing the Lagrangian over all $x$ gives a value no larger than any feasible objective value. This is weak duality: every valid multiplier vector produces a lower bound on the primal optimum. The best such lower bound becomes the dual objective.</p>",
    definition: "<p><b>Statement.</b> Weak duality for inequalities $g_i(x)\\le0$.</p>" +
      "<p><b>Assumptions that matter:</b> Use the stated variables and the regularity conditions in the plan.</p>",
    symbols: [
      { sym: "$L$", desc: "the Lagrangian" },
      { sym: "$\\lambda$", desc: "inequality multipliers" },
      { sym: "$q(\\lambda)$", desc: "the dual function" },
      { sym: "$p^*$", desc: "the primal optimum" },
      { sym: "$d^*$", desc: "the best dual lower bound" },
    ],
    derivation: [
      { do: "Start with primal problem $\\min f(x)$ subject to $g_i(x)\\le0$", result: "Start with primal problem $\\min f(x)$ subject to $g_i(x)\\le0$", why: "feasible points obey all constraints." },
      { do: "Define $L(x,\\lambda)=f(x)+\\sum_i\\lambda_i g_i(x)$ with $\\lambda_i\\ge0$", result: "Define $L(x,\\lambda)=f(x)+\\sum_i\\lambda_i g_i(x)$ with $\\lambda_i\\ge0$", why: "nonnegative multipliers penalize violations." },
      { do: "For any feasible $x$, each $g_i(x)\\le0$, so $\\lambda_i g_i(x)\\le0$", result: "For any feasible $x$, each $g_i(x)\\le0$, so $\\lambda_i g_i(x)\\le0$", why: "nonnegative times nonpositive is nonpositive." },
      { do: "Therefore $L(x,\\lambda)\\le f(x)$ for feasible $x$", result: "Therefore $L(x,\\lambda)\\le f(x)$ for feasible $x$", why: "the Lagrangian is a lower value at feasible points." },
      { do: "Define $q(\\lambda)=\\inf_x L(x,\\lambda)$", result: "Define $q(\\lambda)=\\inf_x L(x,\\lambda)$", why: "the best value of the Lagrangian over all $x$." },
      { do: "Since $q(\\lambda)\\le L(x,\\lambda)\\le f(x)$ for every feasible $x$, $q(\\lambda)$ is a lower bound on the primal optimum.", result: "Since $q(\\lambda)\\le L(x,\\lambda)\\le f(x)$ for every feasible $x$, $q(\\lambda)$ is a lower bound on the primal optimum.", why: "" },
    ],
    applications: [
      { title: "Simple constrained quadratic", background: "minimize $(x-2)^2$ subject to $x\\le1$; with $L=(x-2)^2+\\lambda(x-1)$, minimizing gives $q(\\lambda)=\\lambda-\\lambda^2/4$.", numbers: "minimize $(x-2)^2$ subject to $x\\le1$; with $L=(x-2)^2+\\lambda(x-1)$, minimizing gives $q(\\lambda)=\\lambda-\\lambda^2/4$." },
      { title: "Best bound", background: "$q(2)=1$, matching the primal value at $x=1$.", numbers: "$q(2)=1$, matching the primal value at $x=1$." },
      { title: "Weak bound", background: "$q(1)=0.75$, a valid lower bound below $1$.", numbers: "$q(1)=0.75$, a valid lower bound below $1$." },
      { title: "Multiplier sign", background: "$\\lambda=-1$ is invalid for an inequality multiplier because it would reward violation.", numbers: "$\\lambda=-1$ is invalid for an inequality multiplier because it would reward violation." },
      { title: "Regularized ERM constraint", background: "$\\Vert w\\Vert^2\\le4$ gets multiplier $\\lambda(\\Vert w\\Vert^2-4)$ with $\\lambda\\ge0$.", numbers: "$\\Vert w\\Vert^2\\le4$ gets multiplier $\\lambda(\\Vert w\\Vert^2-4)$ with $\\lambda\\ge0$." },
      { title: "Duality gap", background: "primal value $1.05$ and dual bound $1.00$ give gap $0.05$.", numbers: "primal value $1.05$ and dual bound $1.00$ give gap $0.05$." },
    ]
  },
  "math-22-22": {
    connectionsProse: "<p>This lesson builds on the Lagrangian by collecting the conditions that characterize constrained optima. The KKT conditions combine stationarity, feasibility, multiplier signs, and complementary slackness. For convex problems with standard regularity assumptions, satisfying these conditions certifies optimality. They are the constrained analogue of setting the gradient to zero.</p>",
    motivation: "<p>At an unconstrained optimum, the gradient must vanish because no direction should reduce the objective. With constraints, some directions are not allowed, so the objective gradient can be balanced by constraint gradients. The Lagrangian expresses that balance through multipliers.</p>" +
      "<p>Feasibility keeps the primal point legal. Nonnegative multipliers preserve the lower-bound logic for inequality constraints. Complementary slackness says that an inactive inequality has no price: if the constraint is loose, its multiplier must be zero. Active constraints may carry nonzero multipliers because they shape the optimum.</p>",
    definition: "<p><b>Statement.</b> KKT from Lagrangian logic.</p>" +
      "<p><b>Assumptions that matter:</b> Use the stated variables and the regularity conditions in the plan.</p>",
    symbols: [
      { sym: "$\\lambda_i$", desc: "inequality multipliers" },
      { sym: "$\\nu_j$", desc: "equality multipliers" },
      { sym: "$g_i$ and $h_j$", desc: "constraints" },
      { sym: "stationarity", desc: "gradient with respect to $x$ is zero" },
    ],
    derivation: [
      { do: "Write the constrained problem $\\min f(x)$ subject to $g_i(x)\\le0$ and $h_j(x)=0$.", result: "Write the constrained problem $\\min f(x)$ subject to $g_i(x)\\le0$ and $h_j(x)=0$.", why: "" },
      { do: "Form $L=f+\\sum_i\\lambda_i g_i+\\sum_j\\nu_jh_j$", result: "Form $L=f+\\sum_i\\lambda_i g_i+\\sum_j\\nu_jh_j$", why: "attach multipliers to constraints." },
      { do: "At an optimum, local movement in $x$ should not reduce the Lagrangian, so $\\nabla_xL(x^*,\\lambda^*,\\nu^*)=0$", result: "At an optimum, local movement in $x$ should not reduce the Lagrangian, so $\\nabla_xL(x^*,\\lambda^*,\\nu^*)=0$", why: "stationarity." },
      { do: "The primal point must satisfy $g_i(x^*)\\le0$ and $h_j(x^*)=0$", result: "The primal point must satisfy $g_i(x^*)\\le0$ and $h_j(x^*)=0$", why: "primal feasibility." },
      { do: "Inequality multipliers must satisfy $\\lambda_i^*\\ge0$", result: "Inequality multipliers must satisfy $\\lambda_i^*\\ge0$", why: "required for lower-bound logic." },
      { do: "If a constraint is inactive, $g_i(x^*)<0$, it should have zero price; write $\\lambda_i^*g_i(x^*)=0$", result: "If a constraint is inactive, $g_i(x^*)<0$, it should have zero price; write $\\lambda_i^*g_i(x^*)=0$", why: "complementary slackness." },
    ],
    applications: [
      { title: "Bounded quadratic", background: "minimize $(x-2)^2$ subject to $x\\le1$; stationarity $2(x-2)+\\lambda=0$ at $x=1$ gives $\\lambda=2$.", numbers: "minimize $(x-2)^2$ subject to $x\\le1$; stationarity $2(x-2)+\\lambda=0$ at $x=1$ gives $\\lambda=2$." },
      { title: "Complementary slackness", background: "the active constraint has $x-1=0$, so $\\lambda(x-1)=0$.", numbers: "the active constraint has $x-1=0$, so $\\lambda(x-1)=0$." },
      { title: "Inactive constraint", background: "for minimize $(x-2)^2$ subject to $x\\le3$, optimum $x=2$ has multiplier $0$.", numbers: "for minimize $(x-2)^2$ subject to $x\\le3$, optimum $x=2$ has multiplier $0$." },
      { title: "SVM support vector", background: "margin constraint active when $y_i(w^Tx_i+b)=1$, allowing $\\alpha_i>0$.", numbers: "margin constraint active when $y_i(w^Tx_i+b)=1$, allowing $\\alpha_i>0$." },
      { title: "Probability simplex", background: "equality $\\sum p_i=1$ uses multiplier $\\nu$ with no nonnegativity sign restriction.", numbers: "equality $\\sum p_i=1$ uses multiplier $\\nu$ with no nonnegativity sign restriction." },
      { title: "Certificate check", background: "primal value $1$, dual multiplier $2$, and zero gap certify the $x\\le1$ solution.", numbers: "primal value $1$, dual multiplier $2$, and zero gap certify the $x\\le1$ solution." },
    ]
  },
  "math-22-23": {
    connectionsProse: "<p>This lesson continues from Lagrangian duality and KKT conditions. Once each multiplier gives a lower bound, the dual problem asks for the best lower bound. That turns constrained optimization into a related problem over multiplier variables. The dual variables often also explain the sensitivity or price of constraints.</p>",
    motivation: "<p>The Lagrangian dual function $q(\\lambda)$ is built by minimizing over the primal variable while holding multipliers fixed. Weak duality says each value of $q$ is a lower bound on the primal optimum for a minimization problem. The dual problem maximizes that lower bound over valid multipliers.</p>" +
      "<p>In favorable convex problems, the best dual bound equals the primal optimum. Even when the primal variable is simple, working through the dual shows the logic clearly: form the Lagrangian, minimize over $x$, then choose the multiplier that makes the resulting bound as large as possible.</p>",
    definition: "<p><b>Statement.</b> Dual of the simple quadratic with $x\\le1$.</p>" +
      "<p><b>Assumptions that matter:</b> Use the stated variables and the regularity conditions in the plan.</p>",
    symbols: [
      { sym: "$q$", desc: "the dual function" },
      { sym: "$\\lambda$", desc: "the dual variable" },
      { sym: "$d^*$", desc: "the dual optimum" },
      { sym: "strong duality", desc: "$d^*=p^*$" },
    ],
    derivation: [
      { do: "Start with $\\min (x-2)^2$ subject to $x-1\\le0$", result: "Start with $\\min (x-2)^2$ subject to $x-1\\le0$", why: "the constraint forces $x$ left of $1$." },
      { do: "Form $L(x,\\lambda)=(x-2)^2+\\lambda(x-1)$ with $\\lambda\\ge0$.", result: "Form $L(x,\\lambda)=(x-2)^2+\\lambda(x-1)$ with $\\lambda\\ge0$.", why: "" },
      { do: "Minimize over $x$", result: "derivative $2(x-2)+\\lambda=0$.", why: "" },
      { do: "Solve $x=2-\\lambda/2$", result: "Solve $x=2-\\lambda/2$", why: "the Lagrangian minimizer for fixed $\\lambda$." },
      { do: "Substitute into $L$", result: "$q(\\lambda)=\\lambda-\\lambda^2/4$", why: "the dual function." },
      { do: "Maximize $q$", result: "$q'(\\lambda)=1-\\lambda/2=0$, so $\\lambda^*=2$.", why: "" },
      { do: "The dual value is $q(2)=1$", result: "The dual value is $q(2)=1$", why: "equal to the constrained primal optimum at $x=1$." },
    ],
    applications: [
      { title: "Dual optimum", background: "for the worked problem, $\\lambda^*=2$ and dual value $1$.", numbers: "for the worked problem, $\\lambda^*=2$ and dual value $1$." },
      { title: "Lower bound at $\\lambda=1$", background: "$q(1)=0.75$.", numbers: "$q(1)=0.75$." },
      { title: "Bad multiplier", background: "$\\lambda=4$ gives $q(4)=0$, still a lower bound but not best.", numbers: "$\\lambda=4$ gives $q(4)=0$, still a lower bound but not best." },
      { title: "Constraint price", background: "multiplier $2$ means tightening the boundary by $0.1$ changes optimum value by about $0.2$.", numbers: "multiplier $2$ means tightening the boundary by $0.1$ changes optimum value by about $0.2$." },
      { title: "SVM dual size", background: "$n=1000$ examples gives $1000$ dual variables $\\alpha_i$.", numbers: "$n=1000$ examples gives $1000$ dual variables $\\alpha_i$." },
      { title: "Gap stopping", background: "if primal objective is $1.02$ and dual objective is $1.00$, relative gap is about $1.96\\%$.", numbers: "if primal objective is $1.02$ and dual objective is $1.00$, relative gap is about $1.96\\%$." },
    ]
  },
  "math-22-24": {
    connectionsProse: "<p>This lesson applies constrained optimization to linear objectives and linear inequalities. A linear program has a flat objective and a feasible region made from half-spaces. The geometry is simple enough to see in two variables and powerful enough to support large practical allocation and feasibility problems. It also sets up quadratic programming, where the constraints stay linear but the objective gains curvature.</p>",
    motivation: "<p>In a linear program, objective level sets are parallel lines or hyperplanes. Improving the objective slides that level set across the feasible polyhedron. If a finite optimum is attained, the last contact happens at a face, and at least one optimum occurs at a vertex.</p>" +
      "<p>This does not mean every vertex is good; it means checking vertices is enough in the small two-dimensional example. The derivation lists the polygon's candidate corners, evaluates the objective, and selects the largest value. Higher-dimensional algorithms use the same geometry more systematically.</p>",
    definition: "<p><b>Statement.</b> Vertex check in two variables.</p>" +
      "<p><b>Assumptions that matter:</b> Use the stated variables and the regularity conditions in the plan.</p>",
    symbols: [
      { sym: "$x,y$", desc: "decision variables" },
      { sym: "$c^Tx$", desc: "the linear objective" },
      { sym: "$Ax\\le b$", desc: "linear constraints" },
      { sym: "a vertex", desc: "a corner formed by active constraints" },
    ],
    derivation: [
      { do: "Write the LP maximize $2x+3y$ subject to $x+y\\le4$, $x\\le2$, $y\\le3$, $x,y\\ge0$.", result: "Write the LP maximize $2x+3y$ subject to $x+y\\le4$, $x\\le2$, $y\\le3$, $x,y\\ge0$.", why: "" },
      { do: "The feasible set is an intersection of half-spaces", result: "The feasible set is an intersection of half-spaces", why: "each linear inequality keeps one side of a line." },
      { do: "A linear objective has level sets $2x+3y=c$", result: "A linear objective has level sets $2x+3y=c$", why: "parallel lines." },
      { do: "Sliding the level line upward until it last touches the polygon makes contact at an edge or vertex.", result: "Sliding the level line upward until it last touches the polygon makes contact at an edge or vertex.", why: "" },
      { do: "List candidate vertices", result: "$(0,0)$, $(2,0)$, $(2,2)$, $(1,3)$, $(0,3)$.", why: "" },
      { do: "Evaluate objective values", result: "$0$, $4$, $10$, $11$, $9$.", why: "" },
      { do: "Choose $(1,3)$ with value $11$", result: "Choose $(1,3)$ with value $11$", why: "the largest vertex value solves this LP." },
    ],
    applications: [
      { title: "Production mix", background: "the worked LP chooses $(1,3)$ and value $11$.", numbers: "the worked LP chooses $(1,3)$ and value $11$." },
      { title: "Active constraints", background: "at $(1,3)$, $x+y=4$ and $y=3$ are active.", numbers: "at $(1,3)$, $x+y=4$ and $y=3$ are active." },
      { title: "Slack", background: "constraint $x\\le2$ has slack $1$ at $(1,3)$.", numbers: "constraint $x\\le2$ has slack $1$ at $(1,3)$." },
      { title: "Ad allocation", background: "objective $2x+3y$ means the $y$ channel has higher value per unit, but the $y\\le3$ cap limits it.", numbers: "objective $2x+3y$ means the $y$ channel has higher value per unit, but the $y\\le3$ cap limits it." },
      { title: "Relaxed classification", background: "LP feasibility with $100$ constraints and $20$ variables still uses the same half-space geometry.", numbers: "LP feasibility with $100$ constraints and $20$ variables still uses the same half-space geometry." },
      { title: "Sensitivity", background: "increasing the $y$ cap from $3$ to $3.5$ would allow $(0.5,3.5)$ with value $11.5$ if other constraints stay the same.", numbers: "increasing the $y$ cap from $3$ to $3.5$ would allow $(0.5,3.5)$ with value $11.5$ if other constraints stay the same." },
    ]
  },
  "math-22-25": {
    connectionsProse: "<p>This lesson extends linear programming by allowing a quadratic objective while keeping linear constraints. Quadratic programming is the natural form for constrained least squares, support vector machines, portfolio variance, and trust-region models. The curvature matrix $Q$ supplies the second-order shape. The linear constraints determine which stationary point is feasible.</p>",
    motivation: "<p>A convex quadratic objective has a bowl-shaped surface. Without constraints, the minimizer is found by setting the gradient to zero, which produces a linear system. With constraints, the same stationarity idea is combined with KKT conditions for the active constraints.</p>" +
      "<p>Positive definiteness of $Q$ matters because it makes the quadratic curve upward in every direction. Then a stationary feasible point is not just locally good; it is globally minimizing for the convex QP. The derivation begins with the unconstrained case so the role of $Qx=c$ is clear before constraints are added.</p>",
    definition: "<p><b>Statement.</b> Equality-free convex QP stationarity.</p>" +
      "<p><b>Assumptions that matter:</b> Use the stated variables and the regularity conditions in the plan.</p>",
    symbols: [
      { sym: "$Q$", desc: "the curvature matrix" },
      { sym: "$c$", desc: "the linear objective vector" },
      { sym: "$x$", desc: "the decision variable" },
      { sym: "active constraints", desc: "constraints holding with equality at the solution" },
    ],
    derivation: [
      { do: "Write the unconstrained QP $\\min \\tfrac12x^TQx-c^Tx$ with $Q$ positive definite", result: "Write the unconstrained QP $\\min \\tfrac12x^TQx-c^Tx$ with $Q$ positive definite", why: "convex quadratic objective." },
      { do: "Differentiate", result: "$\\nabla f(x)=Qx-c$", why: "gradient of the quadratic term is $Qx$ when $Q$ is symmetric." },
      { do: "Set stationarity $Qx-c=0$", result: "Set stationarity $Qx-c=0$", why: "unconstrained optimum has zero gradient." },
      { do: "Solve $Qx=c$", result: "Solve $Qx=c$", why: "linear system for the minimizer." },
      { do: "If linear constraints are present, add KKT conditions with multipliers for active constraints.", result: "If linear constraints are present, add KKT conditions with multipliers for active constraints.", why: "" },
      { do: "The positive-definite $Q$ makes the stationary feasible point the global minimizer.", result: "The positive-definite $Q$ makes the stationary feasible point the global minimizer.", why: "" },
    ],
    applications: [
      { title: "Unconstrained QP", background: "$Q=\\operatorname{diag}(2,4)$ and $c=(2,8)$ give $x=(1,2)$.", numbers: "$Q=\\operatorname{diag}(2,4)$ and $c=(2,8)$ give $x=(1,2)$." },
      { title: "Objective value", background: "at $(1,2)$, $\\tfrac12(2+16)-(2+16)=-9$.", numbers: "at $(1,2)$, $\\tfrac12(2+16)-(2+16)=-9$." },
      { title: "Box-constrained coordinate", background: "if the unconstrained solution has $x_1=1.4$ but constraint $x_1\\le1$, the active value is $x_1=1$.", numbers: "if the unconstrained solution has $x_1=1.4$ but constraint $x_1\\le1$, the active value is $x_1=1$." },
      { title: "SVM primal form", background: "$\\tfrac12\\Vert w\\Vert^2+C\\sum \\xi_i$ with linear margin constraints is a QP.", numbers: "$\\tfrac12\\Vert w\\Vert^2+C\\sum \\xi_i$ with linear margin constraints is a QP." },
      { title: "Portfolio variance", background: "$Q=\\operatorname{diag}(0.04,0.09)$ and weights $(0.5,0.5)$ give variance $0.0325$.", numbers: "$Q=\\operatorname{diag}(0.04,0.09)$ and weights $(0.5,0.5)$ give variance $0.0325$." },
      { title: "Trust-region local model", background: "$g=(2,0)$, $Q=I$, unconstrained step $-g=(-2,0)$ is clipped to radius $1$ as $(-1,0)$.", numbers: "$g=(2,0)$, $Q=I$, unconstrained step $-g=(-2,0)$ is clipped to radius $1$ as $(-1,0)$." },
    ]
  },
  "math-22-26": {
    connectionsProse: "<p>This lesson closes the section by contrasting convex guarantees with the landscapes common in deep learning. Earlier convex lessons gave clean global certificates; nonconvex objectives can have saddles, flat directions, local minima, and sharp valleys. The optimizer tools still matter, but their guarantees are more limited. The focus shifts from proving a unique global optimum to finding low-loss solutions that also generalize.</p>",
    motivation: "<p>In a convex problem, stationarity and curvature conditions can often certify global optimality. In a nonconvex problem, the same local signals are harder to interpret. A zero gradient may indicate a local minimum, a saddle, or a flat region, and the Hessian may reveal mixed curvature.</p>" +
      "<p>Deep-learning models are usually overparameterized, which can create many low-loss parameter settings rather than a single isolated solution. Stochasticity from minibatches can help the optimizer move through flat or saddle-like regions. This lesson is explain-only because the main point is landscape behavior: stationary points need not be global, and low training loss must be considered together with generalization.</p>",
    definition: "<p><b>Statement.</b> this is a landscape concept, not one formula. contrasting convex guarantees with nonconvex behavior: stationary points need not be global, saddles can have zero gradient, stochasticity can help escape, and overparameterization can create many connected low-loss solutions.</p>" +
      "<p><b>Assumptions that matter:</b> Use the stated variables and the regularity conditions in the plan.</p>",
    symbols: [
      { sym: "$\\theta$", desc: "the full parameter vector" },
      { sym: "$L(\\theta)$", desc: "training loss" },
      { sym: "$\\nabla L$", desc: "the gradient" },
      { sym: "$\\nabla^2L$", desc: "the Hessian" },
      { sym: "a saddle has mixed Hessian curvature", desc: "as defined in the plan" },
      { sym: "a basin", desc: "a region whose local descent paths lead to similar low loss" },
    ],
    applications: [
      { title: "Saddle example", background: "$L(x,y)=x^2-y^2$ has $\\nabla L(0,0)=0$ but Hessian eigenvalues $2$ and $-2$, so it is not a minimum.", numbers: "$L(x,y)=x^2-y^2$ has $\\nabla L(0,0)=0$ but Hessian eigenvalues $2$ and $-2$, so it is not a minimum." },
      { title: "Local minimum example", background: "$L(x)=x^4-x^2$ has stationary points $0$ and $\\pm1/\\sqrt2$; the latter have value $-0.25$.", numbers: "$L(x)=x^4-x^2$ has stationary points $0$ and $\\pm1/\\sqrt2$; the latter have value $-0.25$." },
      { title: "Flat direction", background: "$L(x,y)=x^2$ has zero curvature in $y$, so all $(0,y)$ minimize training loss equally.", numbers: "$L(x,y)=x^2$ has zero curvature in $y$, so all $(0,y)$ minimize training loss equally." },
      { title: "Sharpness number", background: "Hessian eigenvalue $100$ means a step of $0.01$ in that eigen-direction raises the quadratic model by about $0.5\\cdot100\\cdot0.01^2=0.005$.", numbers: "Hessian eigenvalue $100$ means a step of $0.01$ in that eigen-direction raises the quadratic model by about $0.5\\cdot100\\cdot0.01^2=0.005$." },
      { title: "SGD noise scale", background: "minibatch gradient standard deviation $0.2$ with learning rate $0.01$ gives update noise scale $0.002$.", numbers: "minibatch gradient standard deviation $0.2$ with learning rate $0.01$ gives update noise scale $0.002$." },
      { title: "Generalization gap", background: "training loss $0.05$ and validation loss $0.08$ give gap $0.03$, so low training loss alone is not the full optimization story.", numbers: "training loss $0.05$ and validation loss $0.08$ give gap $0.03$, so low training loss alone is not the full optimization story." },
    ]
  }
};
