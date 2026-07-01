module.exports = {
  "math-25-01": {
    connectionsProse:
      "<p>This opening lesson connects ordinary sequences, differential equations, optimization updates, and recurrent models under one shared vocabulary. The state is the information the system needs at a given time, and the evolution rule tells how that state moves forward. Some systems move in separate steps, while others move continuously through time. Once those choices are clear, later ideas such as fixed points, stability, and chaos have a concrete object to describe.</p>",
    motivation:
      "<p>A dynamical system begins with a bookkeeping choice. The state must contain enough information to continue the evolution without looking further into the past. For a queue, that might be the current number of jobs; for a physical particle, it may include position and velocity; for an RNN, it is the hidden state together with the incoming input.</p>" +
      "<p>After the state is chosen, the evolution rule says how time advances. In discrete time, the rule produces $x_{t+1}$ from $x_t$. In continuous time, the rule gives a velocity $\\dot x=f(x)$, and the trajectory is the curve generated from an initial condition. This lesson is explain-only because the main mathematical skill is recognizing the right state and interpreting the resulting trajectory.</p>",
    definition:
      "<p>A <b>dynamical system</b> consists of a state, an evolution rule, an initial condition, and a time index that together generate a trajectory.</p>" +
      "<p><b>Assumptions that matter:</b> the state contains enough information to continue the evolution, the rule is applied from the initial state, and time is interpreted as either discrete steps or continuous flow.</p>",
    symbols: [
      { sym: "$x_t$", desc: "state at discrete time $t$" },
      { sym: "$x(t)$", desc: "state at continuous time $t$" },
      { sym: "$F$", desc: "update rule" },
      { sym: "$f$", desc: "velocity field" },
      { sym: "$x_0$", desc: "initial state" },
      { sym: "trajectory", desc: "the sequence or curve generated from the initial state" }
    ],
    applications: [
      { title: "Optimizer state", background: "$w_{t+1}=0.5w_t+3$ from $w_0=4$ evolves by repeated updates.", numbers: "$w_1=5$, $w_2=5.5$, $w_3=5.75$." },
      { title: "RNN hidden state", background: "$h_{t+1}=0.5h_t+x_t$ starts from $h_0=0$ with inputs $2,4$.", numbers: "$h_1=2$, $h_2=5$." },
      { title: "Epidemic count", background: "Infections multiply by $1.2$ from $100$.", numbers: "$100(1.2)^2=144$ after two days." },
      { title: "Physics state", background: "$p_{t+1}=p_t+0.1v_t$ updates position from $p_0=5$, $v_0=3$.", numbers: "$p_1=5.3$." },
      { title: "Markov probability state", background: "$[0.7,0.3]$ is updated with rows $[0.8,0.2]$, $[0.1,0.9]$.", numbers: "First new probability is $0.7(0.8)+0.3(0.1)=0.59$." },
      { title: "Queue length", background: "A queue has $12$ jobs, $5$ arrivals, and $7$ completions.", numbers: "The next state is $10$." }
    ]
  },
  "math-25-02": {
    connectionsProse:
      "<p>This lesson builds directly on the idea of a continuous-time state. In one dimension, the whole velocity field can be read on a number line, so the sign of the velocity becomes a simple guide to motion. That sign language prepares the fixed-point and stability tests that follow. It also gives a gentle first version of the phase-line reasoning used in bifurcation diagrams.</p>",
    motivation:
      "<p>In one dimension, motion has only two directions. If $\\dot x=f(x)$ is positive, the state moves to the right on the number line; if it is negative, the state moves to the left. A zero of $f$ is a point where the instantaneous motion stops.</p>" +
      "<p>This makes a sign chart surprisingly informative. The actual solution curve may require integration, but the direction of motion follows immediately from the sign of the velocity field. That is why one-dimensional flows are the natural place to learn phase-line reasoning before moving to fixed-point stability and bifurcations.</p>",
    definition:
      "<p>A <b>one-dimensional flow</b> is a continuous-time scalar system whose motion is governed by $$\\dot x=f(x).$$</p>" +
      "<p><b>Assumptions that matter:</b> the state is scalar, time moves forward with $\\Delta t>0$, and zeros of a continuous velocity field split the line into sign intervals.</p>",
    symbols: [
      { sym: "$x$", desc: "the scalar state" },
      { sym: "$t$", desc: "continuous time" },
      { sym: "$\\dot x$", desc: "velocity" },
      { sym: "$f(x)$", desc: "the velocity field" },
      { sym: "$\\Delta t$", desc: "a small positive time step" }
    ],
    derivation: [
      { do: "Start with $\\dot x=f(x)$", result: "velocity is the time derivative of state", why: "this is the definition of the flow" },
      { do: "Over a small positive time step $\\Delta t$, write $x(t+\\Delta t)-x(t)\\approx f(x(t))\\Delta t$", result: "the change is approximately velocity times time", why: "this is the first-order meaning of a derivative" },
      { do: "Use $\\Delta t>0$", result: "the sign of the change is the sign of $f(x)$", why: "multiplying by a positive time step preserves sign" },
      { do: "Check the sign of $f(x)$", result: "if $f(x)>0$, then $x$ increases; if $f(x)<0$, then $x$ decreases; if $f(x)=0$, the state is instantaneously stationary", why: "the sign tells the direction of motion" },
      { do: "Mark the zeros of $f$", result: "the zeros split the line into intervals", why: "for continuous $f$, the sign can change only by passing through a zero" }
    ],
    applications: [
      { title: "Error decay", background: "$\\dot e=-0.2e$ at $e=5$ has velocity $-1$.", numbers: "Over $0.1$ time units the first-order change is about $-0.1$." },
      { title: "Population flow", background: "$\\dot x=0.1x(100-x)$ changes sign around carrying capacity.", numbers: "Velocity is $160$ at $x=20$ and $-240$ at $x=120$." },
      { title: "Thermostat relaxation", background: "$\\dot T=0.3(70-T)$ points toward $70$.", numbers: "It gives $3$ at $T=60$ and $-3$ at $T=80$." },
      { title: "Inventory correction", background: "$\\dot q=12-q$ points toward target inventory.", numbers: "Velocity is $5$ at $q=7$ and $-3$ at $q=15$." },
      { title: "Model calibration gap", background: "$\\dot c=-0.4(c-1)$ pulls $c$ toward $1$.", numbers: "Velocity is $0.8$ at $c=-1$ and $-0.4$ at $c=2$." },
      { title: "Activation relaxation", background: "$\\dot a=a(1-a)$ has different signs inside and above the unit interval.", numbers: "Velocity is positive $0.21$ at $a=0.3$ and negative $-0.24$ at $a=1.2$." }
    ]
  },
  "math-25-03": {
    connectionsProse:
      "<p>This lesson follows naturally from states and evolution rules. Once a system has a rule for moving, it is important to identify the states where the rule produces no motion or no change. Those states are fixed points, also called equilibria in continuous time. They become the anchors for stability, bifurcation, and local linearization throughout the section.</p>",
    motivation:
      "<p>A fixed point is the first place to look when studying long-run behavior. It is a state that the dynamics leave unchanged, so it can serve as a resting state, an operating point, or a candidate limit of motion. In a map, the state returns to itself after one update; in a flow, the velocity is zero.</p>" +
      "<p>Finding fixed points is an algebraic task, but interpreting them is a dynamical task. Solving $F(x)=x$ or $f(x)=0$ only says where motion can stop. Stability is a separate question about what nearby states do, and that separation keeps the later tests clear.</p>",
    definition:
      "<p>A <b>fixed point</b> is a state left unchanged by the dynamics: $$F(x^*)=x^*\\quad\\text{for a map},\\qquad f(x^*)=0\\quad\\text{for a flow}.$$</p>" +
      "<p><b>Assumptions that matter:</b> solve the algebraic fixed-point equation inside the modeled domain, and keep existence separate from stability.</p>",
    symbols: [
      { sym: "$x^*$", desc: "a fixed point" },
      { sym: "$F$", desc: "a discrete update" },
      { sym: "$f$", desc: "a continuous velocity" },
      { sym: "domain", desc: "the allowed state set" }
    ],
    derivation: [
      { do: "For a map, fixed means no change after one update", result: "$x^*=F(x^*)$", why: "the next state equals the current state" },
      { do: "For a flow, fixed means no instantaneous motion", result: "$\\dot x=f(x^*)=0$", why: "velocity is zero at equilibrium" },
      { do: "Solve the resulting algebraic equation", result: "candidate fixed points", why: "fixed points are candidates found by ordinary algebra" },
      { do: "Check the domain", result: "invalid algebraic solutions are rejected", why: "a solution outside the modeled state space is not a valid fixed point" },
      { do: "Keep stability separate", result: "$x^*$ tells where motion can stop", why: "it does not say whether nearby motion returns" }
    ],
    applications: [
      { title: "Linear map", background: "$x=0.5x+3$ defines a fixed point equation.", numbers: "$x^*=6$." },
      { title: "Continuous logistic flow", background: "$x(4-x)=0$ gives equilibria.", numbers: "Equilibria are $0$ and $4$." },
      { title: "Training update", background: "$w^+=w-0.1(2w-4)$ is fixed when the gradient term vanishes.", numbers: "$2w-4=0$, so $w^*=2$." },
      { title: "RNN without input", background: "$h^+=0.8h$ is unchanged only at zero.", numbers: "The fixed point is $0$." },
      { title: "Affine RNN bias", background: "$h^+=0.7h+1.5$ balances update and state.", numbers: "$h^*=5$." },
      { title: "Probability smoothing", background: "$p^+=0.9p+0.05$ has a fixed probability.", numbers: "$p^*=0.5$." }
    ]
  },
  "math-25-04": {
    connectionsProse:
      "<p>This lesson builds on one-dimensional flows, fixed points, and derivatives. A fixed point tells where motion can stop; stability tells whether nearby states stay near that stopping point or drift away. The derivative is the local measuring tool, because it tells how the rule changes when the state is moved slightly off the fixed point.</p><p>This distinction appears throughout the rest of the section. Bifurcations happen when fixed points gain or lose stability. Linear systems classify equilibria by eigenvalues, which are the multidimensional version of local multipliers. Discrete maps, the logistic map, period doubling, and RNN stability all reuse the same local question: if a small error is introduced, does the next bit of dynamics shrink it or enlarge it?</p>",
    motivation:
      "<p>A fixed point is not automatically a safe resting place. For the flow $\\dot x=x(4-x)$, both $x=0$ and $x=4$ are fixed points, because the velocity is zero at both places. But they behave differently. If the state starts just above $0$, the velocity is positive and the state moves away from $0$. If the state starts just below $4$, the velocity is positive, and if it starts just above $4$, the velocity is negative; both sides move back toward $4$.</p>" +
      "<p>Stability names that local behavior. A stable fixed point holds nearby states close. An asymptotically stable fixed point does more: it pulls nearby states toward itself over time. In one-dimensional continuous time, the sign of $f'(x^*)$ gives the local answer. A negative derivative means the velocity points back toward the equilibrium on both sides. A positive derivative means the velocity points away.</p>" +
      "<p>Discrete maps use the same idea with one important change. The local error is multiplied from one step to the next. If the multiplier has absolute value below $1$, errors shrink; if it has absolute value above $1$, errors grow. That is why the continuous-time test reads $f'(x^*)<0$, while the discrete-time test reads $|F'(x^*)|<1$.</p>",
    definition:
      "<p><b>Local stability</b> studies whether small displacements from a fixed point shrink or grow under the local linear dynamics: $$\\dot x=f(x),\\qquad f(x^*)=0,\\qquad x_{n+1}=F(x_n),\\qquad F(x^*)=x^*.$$</p>" +
      "<p><b>Assumptions that matter:</b> the displacement is small enough for the first-order Taylor approximation to dominate, and the derivative is evaluated at the fixed point.</p>",
    symbols: [
      { sym: "$x$", desc: "the state" },
      { sym: "$x^*$", desc: "a fixed point or equilibrium" },
      { sym: "$f$", desc: "a continuous-time velocity field" },
      { sym: "$F$", desc: "a discrete-time update map" },
      { sym: "$f'(x^*)$", desc: "the local continuous-time slope of the velocity" },
      { sym: "$F'(x^*)$", desc: "the local discrete-time multiplier" },
      { sym: "$e$ or $e_n$", desc: "a small displacement from the fixed point" }
    ],
    derivation: [
      { do: "Let $e=x-x^*$", result: "a small displacement from the fixed point", why: "this measures local error" },
      { do: "Use first-order Taylor expansion", result: "$f(x^*+e)=f(x^*)+f'(x^*)e+O(e^2)$", why: "near the fixed point, the derivative gives the leading change" },
      { do: "Use $f(x^*)=0$", result: "$\\dot e=\\dot x\\approx f'(x^*)e$", why: "the constant velocity term vanishes at an equilibrium" },
      { do: "Solve the linear error equation", result: "$e(t)\\approx e(0)e^{f'(x^*)t}$", why: "a constant-coefficient scalar ODE has exponential solutions" },
      { do: "Check $f'(x^*)<0$", result: "the exponential decays", why: "nearby errors shrink toward zero, so the fixed point attracts locally" },
      { do: "Check $f'(x^*)>0$", result: "the exponential grows", why: "nearby errors move away, so the fixed point repels locally" },
      { do: "For a map, set $e_n=x_n-x^*$", result: "error measured at integer times", why: "discrete dynamics update by steps" },
      { do: "Taylor expand the map", result: "$F(x^*+e_n)=F(x^*)+F'(x^*)e_n+O(e_n^2)$", why: "the derivative is the local step multiplier" },
      { do: "Use $F(x^*)=x^*$", result: "$e_{n+1}\\approx F'(x^*)e_n$", why: "subtract the fixed point from both sides" },
      { do: "Iterate the error rule", result: "$e_n\\approx (F'(x^*))^n e_0$", why: "each step multiplies by the same local factor" },
      { do: "Compare $|F'(x^*)|$ with $1$", result: "$|F'(x^*)|<1$ gives attraction and $|F'(x^*)|>1$ gives repulsion", why: "powers shrink only when the multiplier's absolute value is below $1$" }
    ],
    applications: [
      { title: "Population equilibrium", background: "For $\\dot x=x(4-x)$, $f'(x)=4-2x$.", numbers: "$f'(0)=4>0$ makes $0$ repelling, while $f'(4)=-4<0$ makes $4$ attracting." },
      { title: "Learning-rate stability", background: "Gradient descent on $L(w)=3w^2$ gives $w_{k+1}=(1-6\\eta)w_k$.", numbers: "With $\\eta=0.1$, the multiplier is $0.4$, so five steps shrink error by $0.4^5=0.01024$." },
      { title: "Discrete recommender feedback", background: "$x_{n+1}=0.6x_n+2$ has fixed point $5$ and multiplier $0.6$.", numbers: "A unit error becomes $0.6^5=0.07776$ after five updates." },
      { title: "Unstable scalar policy", background: "$x_{n+1}=1.1x_n$ has fixed point $0$ but multiplier $1.1$.", numbers: "A unit perturbation grows to $1.1^5=1.61051$." },
      { title: "Logistic-map fixed point", background: "For $F(x)=2.5x(1-x)$, $x^*=1-1/2.5=0.6$.", numbers: "$F'(x^*)=-0.5$, so the fixed point attracts with alternating errors." },
      { title: "ODE error correction", background: "$\\dot e=-0.2e$ has $f'(0)=-0.2$.", numbers: "An error of $10$ decays to $10e^{-1}\\approx3.68$ after $5$ time units." }
    ]
  },
  "math-25-05": {
    connectionsProse:
      "<p>This lesson uses fixed points and one-dimensional stability to study what happens when a parameter changes. Instead of treating equilibria as permanent, a bifurcation treats them as features that can be created, destroyed, or rearranged. The saddle-node case is the basic local model for a threshold where two equilibria meet. It gives a precise language for sudden loss of an operating state.</p>",
    motivation:
      "<p>A saddle-node bifurcation describes a local threshold. For $r>0$ in the normal form, there are two equilibria; at $r=0$, they meet; for $r<0$, no real equilibria remain. The square root branches make the collision visible in the equation itself.</p>" +
      "<p>The derivative then labels the two sides before the collision. One branch attracts and the other repels, so the pair is not two copies of the same behavior. At the critical value the ordinary derivative test becomes inconclusive, which is exactly where bifurcation analysis is needed.</p>",
    definition:
      "<p>A <b>saddle-node bifurcation</b> is the local creation or destruction of a pair of equilibria, modeled by $$\\dot x=r-x^2.$$</p>" +
      "<p><b>Assumptions that matter:</b> $r$ is a real control parameter, equilibria are real solutions, and the derivative stability test applies away from the collision point.</p>",
    symbols: [
      { sym: "$r$", desc: "a real parameter" },
      { sym: "$x$", desc: "the state" },
      { sym: "$x^*$", desc: "an equilibrium" },
      { sym: "$f'(x^*)$", desc: "the local stability slope" }
    ],
    derivation: [
      { do: "Start with $\\dot x=r-x^2$", result: "$r$ is the control parameter", why: "this is the saddle-node normal form" },
      { do: "Set the velocity to zero", result: "$r-x^2=0$", why: "fixed points occur where motion stops" },
      { do: "Rearrange", result: "$x^2=r$", why: "isolate the square" },
      { do: "If $r>0$, take square roots", result: "$x^*=\\pm\\sqrt r$", why: "two real equilibria exist" },
      { do: "Set $r=0$", result: "$x^*=0$", why: "both branches meet at the coalesced root" },
      { do: "Check $r<0$", result: "no real $x$ satisfies $x^2=r$", why: "the equilibria disappear from the real phase line" },
      { do: "Compute the derivative", result: "$f'(x)=-2x$", why: "the derivative gives local stability away from the collision" },
      { do: "Evaluate on the two branches", result: "at $x=\\sqrt r$, $f'<0$; at $x=-\\sqrt r$, $f'>0$", why: "the right branch attracts and the left branch repels" }
    ],
    applications: [
      { title: "Normal-form count", background: "At $r=4$, solve $x^2=4$.", numbers: "Equilibria are $-2$ and $2$." },
      { title: "Approaching the fold", background: "At $r=0.25$, solve $x^2=0.25$.", numbers: "Equilibria are $-0.5$ and $0.5$, only $1$ apart." },
      { title: "Critical value", background: "At $r=0$, both roots meet.", numbers: "The repeated equilibrium is $0$ and $f'(0)=0$, so the usual stability test is inconclusive." },
      { title: "After disappearance", background: "At $r=-1$, the square equation has no real solution.", numbers: "There are no real fixed points." },
      { title: "Stability labels", background: "For $r=1$, the equilibria are $-1$ and $1$.", numbers: "$x=-1$ has $f'=2$ and repels, while $x=1$ has $f'=-2$ and attracts." },
      { title: "System threshold", background: "An operating point exists only when $r>0$.", numbers: "Changing $r$ from $0.09$ to $-0.01$ removes the two local equilibria $\\pm0.3$." }
    ]
  },
  "math-25-06": {
    connectionsProse:
      "<p>This lesson continues the bifurcation story after the saddle-node case. Transcritical and pitchfork bifurcations both show equilibria changing stability as a parameter crosses a critical value. The algebra is still one-dimensional, but the branch structure is richer. These examples prepare the reader to interpret stability diagrams as organized families of fixed points, not isolated calculations.</p>",
    motivation:
      "<p>Transcritical bifurcations are about exchange. Two equilibrium branches cross, and their stability signs trade places as the parameter changes. The factorization $x(r-x)$ makes both branches explicit and lets the derivative show the exchange.</p>" +
      "<p>Pitchfork bifurcations add symmetry. The origin exists for every parameter value, while a symmetric pair of nonzero equilibria appears when the square root becomes real. In the supercritical normal form used here, the center branch loses stability and the two outer branches become attracting.</p>",
    definition:
      "<p><b>Transcritical</b> and <b>pitchfork</b> bifurcations organize branch crossing and symmetric branch creation through the normal forms $$\\dot x=rx-x^2\\qquad\\text{and}\\qquad\\dot x=rx-x^3.$$</p>" +
      "<p><b>Assumptions that matter:</b> $r$ is the bifurcation parameter, stability is read from the one-dimensional slope, and the pitchfork normal form uses the symmetry $x\\mapsto -x$.</p>",
    symbols: [
      { sym: "$r$", desc: "the bifurcation parameter" },
      { sym: "$x^*$", desc: "an equilibrium branch" },
      { sym: "$f'$", desc: "the local slope" },
      { sym: "pitchfork symmetry", desc: "the invariance under $x\\mapsto -x$" }
    ],
    derivation: [
      { do: "Transcritical form: $\\dot x=rx-x^2=x(r-x)$", result: "the branches are exposed", why: "factoring reveals each possible zero" },
      { do: "Set $x(r-x)=0$", result: "$x^*=0$ and $x^*=r$", why: "each factor can vanish" },
      { do: "Compute $f'(x)=r-2x$", result: "the slope controls one-dimensional stability", why: "use the local fixed-point test" },
      { do: "Evaluate on the two branches", result: "at $x=0$, $f'=r$; at $x=r$, $f'=-r$", why: "their stability signs exchange as $r$ crosses $0$" },
      { do: "Pitchfork form: $\\dot x=rx-x^3=x(r-x^2)$", result: "paired nonzero roots are possible", why: "symmetry produces roots with opposite signs" },
      { do: "Set $x(r-x^2)=0$", result: "$x^*=0$ always and $x^*=\\pm\\sqrt r$ when $r>0$", why: "the square root must be real" },
      { do: "Compute $f'(x)=r-3x^2$", result: "a stability expression for each branch", why: "evaluate the slope locally" },
      { do: "Evaluate pitchfork stability", result: "at $x=0$, $f'=r$; at $x=\\pm\\sqrt r$, $f'=-2r<0$ for $r>0$", why: "the center branch loses stability and the two outer branches attract" }
    ],
    applications: [
      { title: "Transcritical at $r=2$", background: "The branches are $0$ and $r$.", numbers: "Equilibria are $0$ and $2$; slopes $2$ and $-2$ make $0$ repelling and $2$ attracting." },
      { title: "Transcritical at $r=-1$", background: "The branches are $0$ and $-1$.", numbers: "Equilibria are $0$ and $-1$; slopes $-1$ and $1$ swap the stability." },
      { title: "Pitchfork at $r=4$", background: "The origin and two outer roots are real.", numbers: "Equilibria are $0$, $-2$, and $2$; slopes are $4$, $-8$, and $-8$." },
      { title: "Pitchfork just after onset", background: "At $r=0.09$, the nonzero square-root branches exist.", numbers: "Outer equilibria are $\\pm0.3$." },
      { title: "Pitchfork before onset", background: "At $r=-0.25$, the nonzero square-root branches are not real.", numbers: "Only $x=0$ is real and its slope is $-0.25$, so it attracts locally." },
      { title: "Symmetric model choice", background: "A two-sided preference model uses $r=1.44$.", numbers: "The two nonzero stable states are $\\pm1.2$." }
    ]
  },
  "math-25-07": {
    connectionsProse:
      "<p>This lesson moves from scalar flows to two-dimensional linear systems. The state is now a vector, and the evolution rule is a matrix, but the main stability idea remains local growth or decay. Eigenvectors supply special directions where the vector system behaves like a scalar exponential. Eigenvalues then become the natural multidimensional version of growth rates.</p>",
    motivation:
      "<p>A matrix differential equation may mix coordinates, so the coordinate axes are not always the simplest directions to study. Eigenvectors solve that problem by identifying directions that the matrix only stretches, shrinks, or reverses. Along one of those directions, the vector equation reduces to the scalar equation $\\dot c=\\lambda c$.</p>" +
      "<p>This reduction explains why eigenvalues classify local linear behavior. Negative real parts mean exponential decay, positive real parts mean growth, and imaginary parts produce rotation or oscillation. The same idea will reappear when nonlinear systems are linearized by their Jacobian matrices.</p>",
    definition:
      "<p>A <b>two-dimensional linear system</b> evolves by a matrix rate equation, and eigenvectors reduce it to scalar exponential modes: $$\\dot{\\mathbf x}=A\\mathbf x,\\qquad A\\mathbf v=\\lambda\\mathbf v.$$</p>" +
      "<p><b>Assumptions that matter:</b> $A$ is constant, the state is a vector, and behavior along eigenvector directions is governed by the corresponding eigenvalues.</p>",
    symbols: [
      { sym: "$\\mathbf x=(x,y)^T$", desc: "the state vector" },
      { sym: "$A$", desc: "a $2\\times2$ rate matrix" },
      { sym: "$\\mathbf v$", desc: "an eigenvector" },
      { sym: "$\\lambda$", desc: "an eigenvalue" },
      { sym: "$c(t)$", desc: "the coordinate along that eigenvector" }
    ],
    derivation: [
      { do: "Start with $\\dot{\\mathbf x}=A\\mathbf x$", result: "the state is a vector and $A$ gives the velocity rule", why: "this is the linear system" },
      { do: "Suppose $A\\mathbf v=\\lambda\\mathbf v$", result: "the matrix only rescales direction", why: "this is the eigenvector relation" },
      { do: "Try $\\mathbf x(t)=c(t)\\mathbf v$", result: "motion stays on the eigenvector line", why: "the direction is fixed" },
      { do: "Differentiate", result: "$\\dot{\\mathbf x}=\\dot c(t)\\mathbf v$", why: "$\\mathbf v$ is constant" },
      { do: "Substitute into the ODE", result: "$\\dot c\\mathbf v=A(c\\mathbf v)=c\\lambda\\mathbf v$", why: "use the eigenvalue equation" },
      { do: "Cancel $\\mathbf v$", result: "$\\dot c=\\lambda c$", why: "the vector problem reduces to a scalar one" },
      { do: "Solve the scalar ODE", result: "$c(t)=c(0)e^{\\lambda t}$", why: "eigenvalues set growth, decay, or oscillation" }
    ],
    applications: [
      { title: "Diagonal decay", background: "$A=\\begin{pmatrix}-1&0\\0&-3\\end{pmatrix}$ separates the two coordinates.", numbers: "It has eigenvalues $-1,-3$, so both directions decay." },
      { title: "Second-order system", background: "$A=\\begin{pmatrix}0&1\\-2&-3\\end{pmatrix}$ has negative modes.", numbers: "Eigenvalues are $-1,-2$, so the origin is stable." },
      { title: "Pure rotation", background: "$A=\\begin{pmatrix}0&-2\\2&0\\end{pmatrix}$ has imaginary eigenvalues.", numbers: "Eigenvalues are $\\pm2i$, so the linear motion rotates with angular speed $2$." },
      { title: "Saddle matrix", background: "$A=\\begin{pmatrix}1&2\\3&1\\end{pmatrix}$ has one growing and one decaying direction.", numbers: "Eigenvalues are $3.449$ and $-1.449$." },
      { title: "Mode time scale", background: "A mode with eigenvalue $-4$ decays exponentially.", numbers: "Time constant is $1/4=0.25$." },
      { title: "Latent linear dynamics", background: "A learned 2-D latent model has eigenvalues $0.8$ and $1.2$ per step.", numbers: "The second mode grows by $1.2^5=2.488$ in five steps." }
    ]
  },
  "math-25-08": {
    connectionsProse:
      "<p>This lesson turns two-dimensional differential equations into geometric pictures. A phase portrait records how the vector field points across the plane, where motion stops, and how representative trajectories move. Nullclines make the picture easier to read because they mark where one component of velocity vanishes. The result is a bridge between formulas and visible motion.</p>",
    motivation:
      "<p>A formula for a planar vector field gives a velocity at every point, but the overall motion can be hard to see from equations alone. A phase portrait organizes that information visually. Arrows show local velocity, trajectories follow those arrows, and equilibria mark places where both velocity components vanish.</p>" +
      "<p>Nullclines are useful because they remove one component of motion at a time. On an $x$-nullcline the arrow is vertical or zero, and on a $y$-nullcline the arrow is horizontal or zero. Their intersections give equilibrium candidates, while the surrounding arrows show how nearby trajectories move.</p>",
    definition:
      "<p>A <b>phase portrait</b> is a geometric picture of a planar vector field and its trajectories: $$\\dot x=f(x,y),\\qquad \\dot y=g(x,y).$$</p>" +
      "<p><b>Assumptions that matter:</b> trajectories are tangent to the vector field, nullclines mark zero velocity components, and equilibria occur where both components vanish.</p>",
    symbols: [
      { sym: "$(x,y)$", desc: "the state" },
      { sym: "$(f,g)$", desc: "the vector field" },
      { sym: "nullcline", desc: "a curve where one velocity component is zero" },
      { sym: "trajectory", desc: "a solution curve" }
    ],
    derivation: [
      { do: "Start with $\\dot x=f(x,y)$ and $\\dot y=g(x,y)$", result: "each point has a velocity vector $(f,g)$", why: "the system assigns a direction at every state" },
      { do: "Follow a trajectory", result: "its tangent is $(\\dot x,\\dot y)$", why: "by definition, velocity is tangent to the path" },
      { do: "Set $f(x,y)=0$", result: "an $x$-nullcline", why: "the horizontal component of velocity vanishes" },
      { do: "Read arrows on an $x$-nullcline", result: "they are vertical or zero", why: "only $\\dot y$ can remain" },
      { do: "Set $g(x,y)=0$", result: "a $y$-nullcline", why: "the vertical component vanishes" },
      { do: "Read arrows on a $y$-nullcline", result: "they are horizontal or zero", why: "only $\\dot x$ can remain" },
      { do: "Intersect both nullclines", result: "$(f,g)=(0,0)$", why: "the point is an equilibrium" }
    ],
    applications: [
      { title: "Nullcline intersection", background: "For $\\dot x=y-x$, $\\dot y=1-x-y$, nullclines are $y=x$ and $y=1-x$.", numbers: "They meet at $(0.5,0.5)$." },
      { title: "Vertical arrow check", background: "At $(1,1)$ in the same system, $\\dot x=0$.", numbers: "$\\dot y=-1$, so the arrow is straight down." },
      { title: "Horizontal arrow check", background: "At $(0,1)$, $\\dot y=0$.", numbers: "$\\dot x=1$, so the arrow is rightward." },
      { title: "Predator-prey equilibrium", background: "$\\dot x=x(2-y)$, $\\dot y=y(x-1)$ has a positive nullcline intersection.", numbers: "The positive equilibrium is $(1,2)$." },
      { title: "Learning two parameters", background: "If $\\dot w_1=-2w_1$, $\\dot w_2=-w_2$, evaluate at $(3,4)$.", numbers: "The arrow is $(-6,-4)$." },
      { title: "Vector-field magnitude", background: "For $\\dot x=y$, $\\dot y=-x$ at $(3,4)$, velocity is $(4,-3)$.", numbers: "The speed is $5$." }
    ]
  },
  "math-25-09": {
    connectionsProse:
      "<p>This lesson builds on two-dimensional linear systems and eigenvalues. For a $2\\times2$ system, trace and determinant summarize the characteristic polynomial, so they carry much of the local stability information. The classification separates saddles, nodes, spirals, and centers by how eigenvalues behave. This gives a compact way to read phase portraits near equilibria.</p>",
    motivation:
      "<p>For a two-dimensional linear system, the eigenvalues determine whether nearby states decay, grow, spiral, or move along saddle directions. Computing eigenvalues directly is often simple, but trace and determinant reveal much of the answer before solving the quadratic. They are the sum and product information built into the characteristic polynomial.</p>" +
      "<p>The determinant first separates saddles from non-saddles because a negative product means eigenvalues with opposite signs. When the determinant is positive, the trace tells whether the real parts lean toward decay or growth. The discriminant then separates real nodes from complex spirals or centers.</p>",
    definition:
      "<p>For a $2\\times2$ linearization, equilibrium type is read from trace, determinant, and discriminant: $$\\lambda^2-\\tau\\lambda+\\Delta=0,\\qquad \\tau=\\operatorname{tr}(A),\\qquad \\Delta=\\det(A).$$</p>" +
      "<p><b>Assumptions that matter:</b> the system is locally linear or linearized, eigenvalues determine local behavior, and trace and determinant summarize the characteristic polynomial.</p>",
    symbols: [
      { sym: "$A$", desc: "the linearization matrix" },
      { sym: "$\\tau$", desc: "trace" },
      { sym: "$\\Delta$", desc: "determinant" },
      { sym: "$\\lambda$", desc: "eigenvalues that determine node, saddle, spiral, or center behavior" }
    ],
    derivation: [
      { do: "For $A=\\begin{pmatrix}a&b\\c&d\\end{pmatrix}$, solve $\\det(A-\\lambda I)=0$", result: "the eigenvalue equation", why: "this is the eigenvalue definition" },
      { do: "Compute the determinant", result: "$\\det\\begin{pmatrix}a-\\lambda&b\\c&d-\\lambda\\end{pmatrix}=(a-\\lambda)(d-\\lambda)-bc$", why: "expand the $2\\times2$ determinant" },
      { do: "Expand and collect", result: "$\\lambda^2-(a+d)\\lambda+(ad-bc)=0$", why: "collect powers of $\\lambda$" },
      { do: "Name the coefficients", result: "$\\tau=a+d=\\operatorname{tr}(A)$ and $\\Delta=ad-bc=\\det(A)$", why: "trace and determinant are the polynomial coefficients" },
      { do: "Check the discriminant", result: "$\\tau^2-4\\Delta$ decides real versus complex eigenvalues", why: "it is the quadratic formula discriminant" },
      { do: "If $\\Delta<0$", result: "the eigenvalues have opposite signs", why: "their product is negative, so the equilibrium is a saddle" },
      { do: "If $\\Delta>0$, inspect $\\tau$", result: "$\\tau<0$ gives negative real parts and $\\tau>0$ gives positive real parts", why: "the trace is the sum of eigenvalues" }
    ],
    applications: [
      { title: "Stable node", background: "$A=\\operatorname{diag}(-1,-3)$ has negative diagonal modes.", numbers: "$\\tau=-4$, $\\Delta=3$, eigenvalues $-1,-3$." },
      { title: "Source", background: "$A=\\operatorname{diag}(2,5)$ has positive diagonal modes.", numbers: "$\\tau=7$, $\\Delta=10$, so both eigenvalues are positive." },
      { title: "Saddle", background: "$A=\\begin{pmatrix}1&2\\3&1\\end{pmatrix}$ has negative determinant.", numbers: "$\\tau=2$, $\\Delta=-5$, eigenvalues $3.449$ and $-1.449$." },
      { title: "Center", background: "$A=\\begin{pmatrix}0&-2\\2&0\\end{pmatrix}$ is rotational.", numbers: "$\\tau=0$, $\\Delta=4$, eigenvalues $\\pm2i$." },
      { title: "Stable spiral", background: "$A=\\begin{pmatrix}-1&-3\\3&-1\\end{pmatrix}$ has negative real part and imaginary rotation.", numbers: "Eigenvalues are $-1\\pm3i$." },
      { title: "Classifier shortcut", background: "A Jacobian has $\\tau=-2$ and $\\Delta=5$.", numbers: "$\\tau^2-4\\Delta=-16<0$ and the negative trace gives a stable spiral." }
    ]
  },
  "math-25-10": {
    connectionsProse:
      "<p>This lesson connects nonlinear systems back to the linear classification just developed. Near an equilibrium, the first-order Taylor approximation often controls the local behavior. The Jacobian is the matrix that collects those first-order rates. When the equilibrium is hyperbolic, the linearized system gives the reliable local picture.</p>",
    motivation:
      "<p>Nonlinear systems can bend, saturate, or couple variables in complicated ways. Near an equilibrium, however, the constant term in the Taylor expansion vanishes, and the first-order terms often dominate. Those first-order terms form the Jacobian matrix.</p>" +
      "<p>Linearization is therefore a local approximation, not a global replacement. It tells what very small displacements do near the equilibrium when the Jacobian has no eigenvalue with zero real part. If a zero-real-part eigenvalue appears, the linear part may be too weak to decide the behavior, and higher-order terms matter.</p>",
    definition:
      "<p><b>Linearization</b> approximates a nonlinear system near an equilibrium by its Jacobian system: $$\\dot{\\mathbf u}=J(x^*,y^*)\\mathbf u,\\qquad J=\\begin{pmatrix}f_x&f_y\\g_x&g_y\\end{pmatrix}.$$</p>" +
      "<p><b>Assumptions that matter:</b> the point is an equilibrium, the displacement is small, and the Jacobian has no eigenvalue with zero real part when using linearization to classify behavior.</p>",
    symbols: [
      { sym: "$J$", desc: "the Jacobian" },
      { sym: "$f_x,f_y,g_x,g_y$", desc: "partial derivatives at the equilibrium" },
      { sym: "$\\mathbf u=(u,v)^T$", desc: "displacement" },
      { sym: "hyperbolic", desc: "no Jacobian eigenvalue has zero real part" }
    ],
    derivation: [
      { do: "Let $\\dot x=f(x,y)$ and $\\dot y=g(x,y)$, and let $(x^*,y^*)$ satisfy $f=g=0$", result: "an equilibrium", why: "both velocity components vanish" },
      { do: "Define $u=x-x^*$ and $v=y-y^*$", result: "coordinates centered at the equilibrium", why: "move the equilibrium to the origin" },
      { do: "Taylor expand $f$", result: "$f(x^*+u,y^*+v)=f(x^*,y^*)+f_xu+f_yv+O(\\|(u,v)\\|^2)$", why: "first partials give the linear part" },
      { do: "Taylor expand $g$ the same way", result: "a matching linear approximation for the second component", why: "both velocity components need local linear terms" },
      { do: "Use $f(x^*,y^*)=g(x^*,y^*)=0$", result: "constant terms vanish", why: "the point is an equilibrium" },
      { do: "Collect coefficients in the Jacobian", result: "$\\dot{\\mathbf u}=J(x^*,y^*)\\mathbf u$ with $J=\\begin{pmatrix}f_x&f_y\\g_x&g_y\\end{pmatrix}$", why: "the Jacobian collects the linear coefficients" },
      { do: "Classify by eigenvalues of $J$", result: "local linear behavior when no eigenvalue has zero real part", why: "the linear part dominates the smaller nonlinear remainder" }
    ],
    applications: [
      { title: "Predator-prey center test", background: "$\\dot x=x(1-y)$, $\\dot y=y(x-1)$ at $(1,1)$ has a rotational Jacobian.", numbers: "$J=\\begin{pmatrix}0&-1\\1&0\\end{pmatrix}$ with eigenvalues $\\pm i$." },
      { title: "Nonlinear stable node", background: "$\\dot x=-x+x^2$, $\\dot y=-2y$ at $(0,0)$ linearizes directly.", numbers: "Eigenvalues are $-1,-2$." },
      { title: "Saddle near equilibrium", background: "$\\dot x=x+y^2$, $\\dot y=-y$ at $(0,0)$ has one growing and one decaying mode.", numbers: "Eigenvalues are $1,-1$." },
      { title: "Local training dynamics", background: "Gradient flow near a minimum reverses Hessian eigenvalues.", numbers: "With Hessian eigenvalues $2,5$, the Jacobian eigenvalues are $-2,-5$." },
      { title: "Activation system", background: "$\\dot x=\\tanh x-y$, $\\dot y=x-y$ at $0$ has a degenerate Jacobian.", numbers: "$J=\\begin{pmatrix}1&-1\\1&-1\\end{pmatrix}$ with eigenvalues $0,0$, so linearization is inconclusive." },
      { title: "Operating point", background: "For $\\dot x=x(2-x-y)$, $\\dot y=y(x-1)$ at $(1,1)$, compute the Jacobian.", numbers: "$J=\\begin{pmatrix}-1&-1\\1&0\\end{pmatrix}$ has eigenvalues $-0.5\\pm0.866i$." }
    ]
  },
  "math-25-11": {
    connectionsProse:
      "<p>This lesson extends stability from fixed points to repeating motion. A limit cycle is a closed trajectory that neighboring trajectories may approach or leave. In polar examples, the radius gives a simple one-dimensional stability test for the cycle. This prepares the global planar results that explain why periodic motion is special in two dimensions.</p>",
    motivation:
      "<p>Not all stable long-run behavior settles to a fixed point. Some systems approach a repeating loop, returning to the same states over and over. A limit cycle names an isolated closed trajectory of this kind.</p>" +
      "<p>In polar coordinates, the idea becomes especially clear. The angular equation keeps the state moving around the circle, while the radial equation decides whether nearby radii move toward or away from the cycle. Stability of the periodic orbit is then just the one-dimensional stability of the radius.</p>",
    definition:
      "<p>A <b>limit cycle</b> is an isolated closed trajectory, often tested in polar form by $$\\dot r=h(r),\\qquad \\dot\\theta=\\omega.$$</p>" +
      "<p><b>Assumptions that matter:</b> an invariant circle requires zero radial velocity, angular speed must keep motion moving around the circle, and isolation distinguishes a limit cycle from a family of closed orbits.</p>",
    symbols: [
      { sym: "$r$", desc: "radius" },
      { sym: "$\\theta$", desc: "angle" },
      { sym: "$h(r)$", desc: "radial velocity" },
      { sym: "$\\omega$", desc: "angular speed" },
      { sym: "$r^*$", desc: "the cycle radius" },
      { sym: "$T$", desc: "period" }
    ],
    derivation: [
      { do: "Write a planar system in polar coordinates with $\\dot r=h(r)$ and $\\dot\\theta=\\omega$", result: "radius and angle separate", why: "this is a common test form" },
      { do: "Set $h(r^*)=0$", result: "the circle $r=r^*$ is invariant", why: "the radius does not change there" },
      { do: "Require $\\omega\\ne0$", result: "the angle keeps moving", why: "the invariant circle is traced repeatedly" },
      { do: "Linearize the radial equation with $\\rho=r-r^*$", result: "$\\dot\\rho\\approx h'(r^*)\\rho$", why: "apply the one-dimensional stability test to radius" },
      { do: "Check $h'(r^*)<0$", result: "radial errors decay", why: "nearby trajectories approach the circle" },
      { do: "Check isolation", result: "no neighboring circles are also periodic", why: "that makes the periodic orbit a limit cycle" }
    ],
    applications: [
      { title: "Stable unit cycle", background: "$\\dot r=r(1-r)$ has $r^*=1$.", numbers: "$h'(1)=-1$, so the unit circle attracts." },
      { title: "Period from angular speed", background: "With $\\dot\\theta=2$, one full turn covers $2\\pi$ radians.", numbers: "The cycle period is $2\\pi/2=\\pi$." },
      { title: "Unstable cycle", background: "$\\dot r=r(r-1)$ has radius $1$ as an invariant circle.", numbers: "$h'(1)=1$, so radius $1$ repels." },
      { title: "Amplitude oscillator", background: "$\\dot r=r(4-r^2)$ has nonzero radius $2$.", numbers: "The radius is stable because $h'(2)=4-12=-8$." },
      { title: "Neural rhythm", background: "A phase speed of $10$ rad/s determines oscillation period.", numbers: "Period is $2\\pi/10\\approx0.628$ s." },
      { title: "Convergence direction", background: "For $\\dot r=r(1-r)$, compare points below and above radius $1$.", numbers: "At $r=0.8$ radial velocity is $0.16$ and at $r=1.2$ it is $-0.24$." }
    ]
  },
  "math-25-12": {
    connectionsProse:
      "<p>This lesson uses the phase-plane vocabulary of equilibria, trajectories, and trapping regions. The Poincaré–Bendixson theorem describes a strong restriction on long-run behavior in autonomous planar systems. It explains why a trapped trajectory with no equilibrium to approach must organize into periodic motion. The theorem is conceptual here because its proof depends on planar topology, but its hypotheses are practical to check.</p>",
    motivation:
      "<p>The Poincaré–Bendixson theorem explains why planar autonomous systems are more constrained than higher-dimensional systems. If a trajectory remains in a compact trapping region, its long-run behavior cannot wander arbitrarily in the plane. If there is no equilibrium in the limiting set, the remaining possibility is periodic motion.</p>" +
      "<p>The hypotheses matter as much as the conclusion. The system must be autonomous and planar, the trajectory must remain trapped, and equilibria must be ruled out in the relevant region. When those checks hold, the theorem gives a rigorous route from geometric trapping to the existence of a periodic orbit.</p>",
    definition:
      "<p>The <b>Poincaré–Bendixson theorem</b> says that in an autonomous planar system, a trapped trajectory whose omega-limit set contains no equilibrium must have periodic-orbit behavior in its limit set.</p>" +
      "<p><b>Assumptions that matter:</b> the system is autonomous and planar, the trajectory remains in a compact trapping region, and equilibria are ruled out in the relevant limiting set.</p>",
    symbols: [
      { sym: "$R$", desc: "a compact trapping region" },
      { sym: "omega-limit set", desc: "the set approached as $t\\to\\infty$" },
      { sym: "equilibrium", desc: "a zero of the vector field" },
      { sym: "periodic orbit", desc: "a closed trajectory" }
    ],
    applications: [
      { title: "Trapped annulus", background: "Trajectories stay in $1\\le r\\le2$ and no equilibrium lies in the annulus.", numbers: "The limit set is a periodic orbit." },
      { title: "Why equilibria matter", background: "A trapped disk contains a stable equilibrium at $0$.", numbers: "The theorem's no-equilibrium conclusion does not apply." },
      { title: "Planar-only check", background: "A 3-D Lorenz system can be trapped and nonperiodic.", numbers: "Dimension $3$ breaks the theorem's setting." },
      { title: "Limit-cycle proof strategy", background: "Showing inward arrows at $r=2$ and outward arrows at $r=1$ gives a compact trapping annulus.", numbers: "The annulus has area $3\\pi$." },
      { title: "Autonomous condition", background: "A periodically forced scalar equation uses time as an extra state.", numbers: "The planar autonomous hypothesis must be checked." },
      { title: "Numerical diagnosis", background: "A simulated trajectory remains inside $0.9\\le r\\le1.1$ and no rest point is there.", numbers: "Repeated returns suggest the periodic orbit promised by the theorem." }
    ]
  },
  "math-25-13": {
    connectionsProse:
      "<p>This lesson gives a stability method that does not require solving the differential equation. Instead of tracking the full trajectory, it tracks a scalar quantity that behaves like energy or distance. If that quantity never increases, trajectories are constrained; if it decreases strictly, the equilibrium is attracting under the usual conditions. This idea is especially useful when eigenvalue calculations are hard or insufficient.</p>",
    motivation:
      "<p>Solving a nonlinear differential equation exactly is often unnecessary for stability. A Lyapunov function replaces the full solution with a scalar measure that is easy to compare along trajectories. If that measure behaves like energy and never increases, the motion is confined to lower or equal levels.</p>" +
      "<p>The derivative of $V$ along trajectories is the key computation. The chain rule converts the vector field into the scalar rate $\\dot V=\\nabla V\\cdot f$. A negative value means the system is moving downhill in the Lyapunov measure, which can prove stability or attraction without producing an explicit formula for $x(t)$.</p>",
    definition:
      "<p>A <b>Lyapunov function</b> is a positive scalar measure whose derivative along trajectories controls stability: $$\\dot V=\\nabla V(x)\\cdot f(x).$$</p>" +
      "<p><b>Assumptions that matter:</b> $V(0)=0$, $V(x)>0$ away from the equilibrium, and the sign of $\\dot V$ is checked along the system's trajectories.</p>",
    symbols: [
      { sym: "$V$", desc: "the Lyapunov function" },
      { sym: "$\\nabla V$", desc: "its gradient" },
      { sym: "$f(x)$", desc: "the vector field" },
      { sym: "$\\dot V$", desc: "derivative along trajectories" },
      { sym: "positive definite", desc: "$V(0)=0$ and $V>0$ away from $0$" }
    ],
    derivation: [
      { do: "Choose $V(x)$ with $V(0)=0$ and $V(x)>0$ for $x\\ne0$", result: "a local measure of distance from equilibrium", why: "positive definiteness makes $V$ energy-like" },
      { do: "Along a trajectory $x(t)$, compute $\\frac{d}{dt}V(x(t))$", result: "the rate of change of the measure", why: "stability depends on how this measure changes over time" },
      { do: "Apply the chain rule", result: "$\\dot V=\\nabla V(x)\\cdot\\dot x$", why: "the gradient converts state velocity into scalar rate of change" },
      { do: "Substitute $\\dot x=f(x)$", result: "$\\dot V=\\nabla V(x)\\cdot f(x)$", why: "now the decrease test depends only on the vector field" },
      { do: "If $\\dot V\\le0$", result: "$V$ never increases", why: "trajectories cannot move to larger energy levels locally" },
      { do: "If $\\dot V<0$ away from $0$", result: "the energy strictly decreases", why: "nearby trajectories are driven toward the equilibrium under the usual Lyapunov conditions" }
    ],
    applications: [
      { title: "Scalar decay", background: "$\\dot x=-2x$, $V=x^2$ gives a negative derivative.", numbers: "$\\dot V=2x(-2x)=-4x^2<0$." },
      { title: "Two-dimensional decay", background: "$\\dot x=-x$, $\\dot y=-2y$, $V=x^2+y^2$ combines both coordinates.", numbers: "$\\dot V=-2x^2-4y^2$." },
      { title: "Point check", background: "At $(3,4)$ in that system, evaluate the derivative.", numbers: "$\\dot V=-18-64=-82$." },
      { title: "Gradient flow", background: "$\\dot w=-\\nabla L$, $V=L-L^*$ uses loss as energy.", numbers: "$\\dot V=-\\|\\nabla L\\|^2\\le0$." },
      { title: "Discrete training analogy", background: "Validation loss drops from $0.50$ to $0.45$.", numbers: "The Lyapunov-like quantity decreases by $0.05$." },
      { title: "Non-strict warning", background: "For $\\dot x=0$, $V=x^2$ does not increase.", numbers: "$\\dot V=0$, proving no increase but not attraction." }
    ]
  },
  "math-25-14": {
    connectionsProse:
      "<p>This lesson returns to discrete time with the same local stability question used for fixed points. A map advances the state by iteration rather than by a continuous velocity field. Near a fixed point, the derivative acts as the one-step multiplier for small errors. That multiplier becomes the central tool for the logistic map, period doubling, and recurrent update stability.</p>",
    motivation:
      "<p>In discrete time, the dynamics happen by repeated application of the same rule. A fixed point is a state that stays unchanged after one application, and local stability asks what happens to a small error after many applications. The derivative at the fixed point gives the first-order answer.</p>" +
      "<p>The difference from continuous time is that errors are multiplied rather than exponentiated by a rate. If the multiplier has absolute value below $1$, repeated powers shrink; if it is above $1$, repeated powers grow. A negative multiplier can still be stable, but the error alternates sign as it converges.</p>",
    definition:
      "<p>A <b>discrete map</b> advances the state by iteration, and a fixed point is locally attracting when its multiplier has magnitude below one: $$x_{n+1}=F(x_n),\\qquad F(x^*)=x^*,\\qquad |F'(x^*)|<1.$$</p>" +
      "<p><b>Assumptions that matter:</b> the initial error is small, the first-order Taylor approximation dominates, and the fixed-point multiplier is evaluated at $x^*$.</p>",
    symbols: [
      { sym: "$n$", desc: "the integer time index" },
      { sym: "$F$", desc: "the map" },
      { sym: "$x^*$", desc: "a fixed point" },
      { sym: "$e_n$", desc: "error" },
      { sym: "$F'(x^*)$", desc: "the local multiplier" }
    ],
    derivation: [
      { do: "Start with $x_{n+1}=F(x_n)$ and a fixed point $F(x^*)=x^*$", result: "a map with a state left unchanged", why: "fixed-point stability is the target" },
      { do: "Define $e_n=x_n-x^*$", result: "the current error", why: "measure displacement from the fixed point" },
      { do: "Substitute $x_n=x^*+e_n$ into the map", result: "a nearby state is updated", why: "study local behavior" },
      { do: "Taylor expand", result: "$F(x^*+e_n)=F(x^*)+F'(x^*)e_n+O(e_n^2)$", why: "the derivative is the local multiplier" },
      { do: "Subtract $x^*$ and use $F(x^*)=x^*$", result: "$e_{n+1}\\approx F'(x^*)e_n$", why: "convert the map into an error update" },
      { do: "Iterate the error rule", result: "$e_n\\approx (F'(x^*))^ne_0$", why: "one multiplier is applied per step" },
      { do: "Compare $|F'(x^*)|$ with $1$", result: "errors shrink when $|F'(x^*)|<1$ and grow when $|F'(x^*)|>1$", why: "powers decide the local behavior" }
    ],
    applications: [
      { title: "Affine iteration", background: "$x_{n+1}=0.7x_n+0.3$ starts from $x_0=0.2$.", numbers: "The next values are $0.44$, $0.608$, $0.7256$." },
      { title: "Fixed point", background: "The same map satisfies $x=0.7x+0.3$ at its fixed point.", numbers: "$x^*=1$." },
      { title: "Error shrinkage", background: "A multiplier $0.8$ is applied ten times.", numbers: "It leaves $0.8^{10}=0.10737$ of an error after ten steps." },
      { title: "Alternating convergence", background: "A multiplier $-0.5$ flips the error sign while shrinking it.", numbers: "It leaves $(-0.5)^6=0.015625$ after six steps." },
      { title: "Divergent map", background: "$x_{n+1}=1.02x_n$ multiplies error by $1.02$ each step.", numbers: "After twenty steps the factor is $1.02^{20}=1.486$." },
      { title: "Digital filter", background: "$y_{n+1}=0.9y_n+0.1u$ has a steady output.", numbers: "The fixed output is $u$ and the error multiplier is $0.9$." }
    ]
  },
  "math-25-15": {
    connectionsProse:
      "<p>This lesson studies a single nonlinear map that displays much of discrete dynamics. The logistic map combines growth with crowding through the factor $x(1-x)$. Its fixed points can be found by algebra, and their stability follows from the derivative multiplier. As the parameter changes, the map moves from fixed-point attraction toward periodic and chaotic behavior.</p>",
    motivation:
      "<p>The logistic map is simple enough to compute by hand and nonlinear enough to show rich behavior. The factor $x$ represents growth from the current population fraction, while $1-x$ limits growth as the state approaches crowding. The parameter $r$ controls the strength of the update.</p>" +
      "<p>Fixed points come from solving $x=rx(1-x)$. Their stability is then determined by the derivative multiplier, just as in any one-dimensional map. The nonzero fixed point attracts for $1<r<3$, and the loss of that stability is the entry point to period doubling and chaos.</p>",
    definition:
      "<p>The <b>logistic map</b> is the nonlinear recurrence $$x_{n+1}=F(x_n)=rx_n(1-x_n),$$ whose fixed points and stability are controlled by $r$.</p>" +
      "<p><b>Assumptions that matter:</b> $x_n$ is usually interpreted as a normalized population fraction, fixed points solve $x=F(x)$, and local stability uses the derivative multiplier.</p>",
    symbols: [
      { sym: "$x_n$", desc: "often a normalized population fraction" },
      { sym: "$r$", desc: "growth strength" },
      { sym: "$F'$", desc: "the one-step multiplier" },
      { sym: "fixed-point stability", desc: "a local property" }
    ],
    derivation: [
      { do: "Start with $F(x)=rx(1-x)$", result: "$r$ is the growth parameter", why: "this is the logistic map" },
      { do: "Set fixed points by solving $x=rx(1-x)$", result: "one update returns the same value", why: "fixed means unchanged after applying the map" },
      { do: "Move all terms and factor", result: "$x[1-r(1-x)]=0$", why: "factor out $x$" },
      { do: "Split the factors", result: "$x^*=0$ or $1=r(1-x)$", why: "one of the factors must vanish" },
      { do: "For $r\\ne0$, solve the nonzero branch", result: "$x^*=1-1/r$", why: "isolate $x$" },
      { do: "Differentiate", result: "$F'(x)=r(1-2x)$", why: "this is the map multiplier" },
      { do: "Evaluate at the fixed points", result: "at $0$, $F'(0)=r$; at $1-1/r$, $F'=2-r$", why: "substitute the fixed points" },
      { do: "Apply $|2-r|<1$", result: "$1<r<3$", why: "the nonzero fixed point attracts by the discrete-map stability test" }
    ],
    applications: [
      { title: "Attracting fixed point", background: "For $r=2.5$, the nonzero fixed point exists.", numbers: "$x^*=0.6$ and $F'(x^*)=-0.5$." },
      { title: "Loss of fixed-point stability", background: "For $r=3.2$, the nonzero fixed point is beyond the stability interval.", numbers: "$x^*=0.6875$ and $F'(x^*)=-1.2$, so the fixed point repels." },
      { title: "Chaotic-parameter iterate", background: "With $r=4$ and $x_0=0.2$, iterate the map.", numbers: "The next four values are $0.64$, $0.9216$, $0.28901376$, $0.8219392261$." },
      { title: "Domain preservation", background: "$r=4$ maps a midpoint in $[0,1]$.", numbers: "$x=0.5$ maps to $1$, still in $[0,1]$." },
      { title: "Zero fixed point", background: "At $r=0.8$, the derivative at zero is below one in magnitude.", numbers: "$F'(0)=0.8$, so $0$ attracts locally." },
      { title: "Population fraction", background: "With $r=2$ and $x_n=0.3$, apply $rx(1-x)$.", numbers: "The next fraction is $2(0.3)(0.7)=0.42$." }
    ]
  },
  "math-25-16": {
    connectionsProse:
      "<p>This lesson builds on discrete maps and local multipliers. A periodic orbit repeats only after several steps, so its stability is determined by the product of the multipliers around the full cycle. Period doubling occurs when a stable orbit loses stability in a characteristic alternating way. This is one of the main routes by which simple maps develop complicated long-run behavior.</p>",
    motivation:
      "<p>A fixed point is a period-one orbit, but maps can also settle into cycles that repeat after several steps. To test such a cycle, a perturbation must be followed all the way around the orbit. Each point contributes its own local derivative, and the product is the full-cycle multiplier.</p>" +
      "<p>Period doubling is a common way for an attracting cycle to lose stability. When the multiplier crosses $-1$, errors alternate sign and no longer shrink over a full return. A new orbit with twice the period can then become the stable pattern of motion.</p>",
    definition:
      "<p>A <b>period-$k$ orbit</b> repeats after $k$ map steps, and its stability is controlled by the product of derivatives around the cycle: $$F^k(x_0)=x_0,\\qquad e_k\\approx \\left(\\prod_{i=0}^{k-1}F'(x_i)\\right)e_0.$$</p>" +
      "<p><b>Assumptions that matter:</b> no smaller positive iterate returns to the starting point, the perturbation is small, and the full-cycle multiplier is the product of local slopes.</p>",
    symbols: [
      { sym: "$F^k$", desc: "$F$ composed $k$ times" },
      { sym: "$x_0,\\dots,x_{k-1}$", desc: "orbit points" },
      { sym: "$\\prod F'(x_i)$", desc: "the multiplier" },
      { sym: "$r$", desc: "a changing parameter in families such as the logistic map" }
    ],
    derivation: [
      { do: "Define a period-$k$ orbit", result: "$F^k(x_0)=x_0$ with no smaller positive iterate returning to $x_0$", why: "this defines the repeat length" },
      { do: "Perturb the first point by a small error $e_0$", result: "a nearby start", why: "stability asks what happens to nearby starts" },
      { do: "Take one step", result: "the error is multiplied approximately by $F'(x_0)$", why: "use local linearization" },
      { do: "Continue around the orbit", result: "the second step multiplies by $F'(x_1)$, and so on", why: "each visited point contributes its local slope" },
      { do: "Multiply the $k$ local factors", result: "$e_k\\approx \\left(\\prod_{i=0}^{k-1}F'(x_i)\\right)e_0$", why: "local stretches compose over the full cycle" },
      { do: "Compare the product magnitude with $1$", result: "the period-$k$ orbit attracts when the product has absolute value below $1$", why: "the full-cycle error must shrink" },
      { do: "Track a multiplier crossing $-1$", result: "a typical period-doubling event", why: "errors alternate sign and stop shrinking, allowing a period-$2k$ orbit to take over" }
    ],
    applications: [
      { title: "Logistic fixed-point threshold", background: "The nonzero fixed point has multiplier $2-r$.", numbers: "It equals $-1$ at $r=3$." },
      { title: "Period-2 points at $r=3.2$", background: "Solving $F(F(x))=x$ excluding fixed points gives the two-cycle.", numbers: "$x\\approx0.5130445095$ and $0.7994554905$." },
      { title: "Period-2 stability", background: "The derivative product around those two points controls attraction.", numbers: "The product is about $0.16$, so the 2-cycle attracts." },
      { title: "Alternating error", background: "A multiplier $-0.9$ flips sign each period.", numbers: "A unit error becomes $-0.9$, then $0.81$, so signs alternate while size shrinks." },
      { title: "Flip instability", background: "A multiplier $-1.1$ is beyond the stability boundary.", numbers: "Size grows to $1.1^4=1.4641$ after four periods." },
      { title: "Training oscillation analogy", background: "A scalar optimizer with update multiplier $-0.8$ alternates around the optimum.", numbers: "It leaves $0.8^5=0.32768$ of the error after five steps." }
    ]
  },
  "math-25-17": {
    connectionsProse:
      "<p>This lesson gives a quantitative meaning to sensitive dependence on initial conditions. In a map, nearby starting states separate according to the local slopes they encounter along the orbit. Multiplying those slopes gives total error growth, and averaging their logarithms gives the Lyapunov exponent. A positive exponent signals sustained average stretching in a bounded deterministic system.</p>",
    motivation:
      "<p>Sensitive dependence is about the growth of small differences, not about randomness in the rule. Two initial states may begin extremely close, but if the map repeatedly stretches small separations, their future states can become practically different. The derivative along the orbit records each local stretch or contraction.</p>" +
      "<p>Products of stretches are easier to average after taking logarithms. The Lyapunov exponent is the long-run average log stretch per step. When it is positive in a bounded deterministic system, small errors typically grow exponentially until the bounded geometry of the system folds or saturates them.</p>",
    definition:
      "<p><b>Sensitive dependence</b> is quantified by average exponential separation, often through the Lyapunov exponent $$\\lambda=\\lim_{n\\to\\infty}\\frac1n\\sum_{i=0}^{n-1}\\log|F'(x_i)|.$$</p>" +
      "<p><b>Assumptions that matter:</b> the map is deterministic, separations are initially small, the limit exists for the orbit being studied, and bounded dynamics can fold or saturate large separations.</p>",
    symbols: [
      { sym: "$\\delta_n$", desc: "a small separation" },
      { sym: "$\\lambda$", desc: "the Lyapunov exponent" },
      { sym: "$F'$", desc: "local slope" },
      { sym: "positive exponent", desc: "sensitive dependence for bounded deterministic dynamics" }
    ],
    derivation: [
      { do: "For a map $x_{n+1}=F(x_n)$, let two nearby trajectories differ by $\\delta_n$", result: "local separation", why: "this measures sensitivity" },
      { do: "Linearize", result: "$\\delta_{n+1}\\approx F'(x_n)\\delta_n$", why: "the derivative is the local stretch factor" },
      { do: "Repeat for $n$ steps", result: "$|\\delta_n|\\approx |\\delta_0|\\prod_{i=0}^{n-1}|F'(x_i)|$", why: "local stretches multiply" },
      { do: "Take logs", result: "$\\log|\\delta_n/\\delta_0|\\approx\\sum_{i=0}^{n-1}\\log|F'(x_i)|$", why: "products become sums" },
      { do: "Divide by $n$", result: "$\\frac1n\\log|\\delta_n/\\delta_0|\\approx\\frac1n\\sum\\log|F'(x_i)|$", why: "this gives average growth per step" },
      { do: "Define the Lyapunov exponent", result: "$\\lambda=\\lim_{n\\to\\infty}\\frac1n\\sum\\log|F'(x_i)|$", why: "use the long-run average when the limit exists" },
      { do: "If $\\lambda>0$", result: "typical small errors grow like $e^{\\lambda n}$", why: "positive average log stretch means exponential separation" }
    ],
    applications: [
      { title: "Doubling map", background: "$F(x)=2x\\bmod1$ has constant slope magnitude $2$.", numbers: "$\\lambda=\\log2\\approx0.693$." },
      { title: "Error growth", background: "With $\\lambda=\\log2$, an initial error is doubled each step on average.", numbers: "$10^{-6}$ becomes about $0.001024$ after ten steps." },
      { title: "Contracting map", background: "$F(x)=0.5x$ has constant slope magnitude $0.5$.", numbers: "$\\lambda=\\log0.5=-0.693$, so errors shrink." },
      { title: "Moderate chaos", background: "A Lyapunov exponent $\\lambda=0.2$ grows errors exponentially.", numbers: "The growth factor is $e^{4}\\approx54.6$ after $20$ steps." },
      { title: "Logistic-map local stretch", background: "At $r=4$, $x=0.2$, compute the derivative magnitude.", numbers: "$|F'(x)|=|4(1-0.4)|=2.4$, so one-step error roughly multiplies by $2.4$." },
      { title: "Forecast horizon", background: "Tolerable error is $0.1$ and initial error is $10^{-5}$ with $\\lambda=0.5$.", numbers: "The horizon is $\\log(10^4)/0.5\\approx18.42$ steps." }
    ]
  },
  "math-25-18": {
    connectionsProse:
      "<p>This lesson connects chaos with geometry. A strange attractor is not just a set that trajectories approach; it is also invariant, folded, stretched, and geometrically complicated. The important ideas are attraction, recurrence, sensitivity, and non-integer scaling. The lesson stays explain-only because the definitions are subtle and differ across texts, while the diagnostics are the useful first tools.</p>",
    motivation:
      "<p>A strange attractor combines two tendencies that seem opposed at first. It attracts nearby trajectories, so motion is confined toward a set; at the same time, motion on or near that set can separate nearby states through stretching. Folding keeps the dynamics bounded while preserving complicated recurrence.</p>" +
      "<p>Because the precise definition varies by context, the useful first lesson is diagnostic. Invariance means the dynamics keep the set mapped into itself. Attraction means nearby points move toward it. Positive Lyapunov behavior and fractal scaling indicate the sensitive, geometrically complicated structure associated with strange attractors.</p>",
    definition:
      "<p>A <b>strange attractor</b> is an attracting invariant set associated with stretching, folding, sensitive dependence, and often fractal geometry.</p>" +
      "<p><b>Assumptions that matter:</b> precise definitions vary across texts, so the first checks are attraction, invariance, stretching, folding, fractal scaling, and positive Lyapunov diagnostics.</p>",
    symbols: [
      { sym: "attractor", desc: "the set approached by nearby trajectories" },
      { sym: "invariant", desc: "dynamics keep points on the set" },
      { sym: "basin", desc: "the set of initial conditions attracted to it" },
      { sym: "Lyapunov exponent", desc: "average stretching" },
      { sym: "fractal dimension", desc: "non-integer scaling" }
    ],
    applications: [
      { title: "Stretching count", background: "A local separation is doubled eight times.", numbers: "It grows by $2^8=256$." },
      { title: "Folding balance", background: "Each stretch is followed by a half-scale fold.", numbers: "The layer thickness is $2^{-8}=0.00390625$ after eight folds." },
      { title: "Lorenz-style sensitivity", background: "With exponent $0.9$, errors grow exponentially over time.", numbers: "An error grows by $e^{0.9\\cdot5}=e^{4.5}\\approx90.0$ after five time units." },
      { title: "Attraction diagnostic", background: "Distances to the plotted set drop from $3.0$ to $0.6$.", numbers: "The ratio is $0.2$." },
      { title: "Invariant-set check", background: "A numerical return map keeps $10{,}000$ sampled points inside a box after one step.", numbers: "The one-step escape fraction is $0/10000=0$." },
      { title: "ML latent dynamics warning", background: "A learned recurrent map has local stretch $1.4$ for ten steps.", numbers: "It can amplify hidden-state error by $1.4^{10}\\approx28.9$ before folding or saturation limits it." }
    ]
  },
  "math-25-19": {
    connectionsProse:
      "<p>This lesson gives the scaling language used to describe complicated invariant sets and basin boundaries. Ordinary lines, squares, and cubes have dimensions that match simple scale-counting rules. Fractals extend that idea to sets whose copy count grows at a non-integer rate with scale. The self-similar formula is the cleanest first model of that behavior.</p>",
    motivation:
      "<p>Dimension can be understood by how counts change with scale. A line split in half gives two half-size pieces, while a square split in half in each direction gives four half-size pieces. Fractals follow the same counting idea but produce dimensions that need not be whole numbers.</p>" +
      "<p>For an ideal self-similar set, the number of copies and the scale factor determine the similarity dimension. Taking logarithms turns the scaling relation into a simple ratio. This formula gives the standard dimensions for the Cantor set, Sierpiński triangle, and Koch curve.</p>",
    definition:
      "<p>A <b>self-similar fractal</b> has a similarity dimension determined by copy count and scale: $$D=\\frac{\\log N}{\\log(1/s)}.$$</p>" +
      "<p><b>Assumptions that matter:</b> the set is built from $N$ smaller copies, each copy has length scale $s$ with $0<s<1$, and the same logarithm base is used in numerator and denominator.</p>",
    symbols: [
      { sym: "$N$", desc: "the number of self-similar copies" },
      { sym: "$s$", desc: "the length scale of each copy" },
      { sym: "$D$", desc: "similarity dimension" },
      { sym: "logs", desc: "any base if the same base is used top and bottom" }
    ],
    derivation: [
      { do: "Suppose a set is built from $N$ smaller copies of itself, each scaled by length factor $s$ with $0<s<1$", result: "a self-similar scaling model", why: "this is the ideal setting for similarity dimension" },
      { do: "Match copy count to scale", result: "$N=(1/s)^D$", why: "this generalizes line and square scaling" },
      { do: "Take logs on both sides", result: "$\\log N=D\\log(1/s)$", why: "logarithms bring the exponent down" },
      { do: "Divide by $\\log(1/s)$", result: "$D=\\frac{\\log N}{\\log(1/s)}$", why: "isolate the dimension" },
      { do: "Check ordinary shapes", result: "$N=2,s=1/2$ gives $D=1$ for a line; $N=4,s=1/2$ gives $D=2$ for a square", why: "the formula agrees with familiar dimensions" }
    ],
    applications: [
      { title: "Cantor set", background: "The construction keeps $N=2$ copies scaled by $s=1/3$.", numbers: "$D=\\log2/\\log3\\approx0.63093$." },
      { title: "Sierpiński triangle", background: "The construction keeps $N=3$ copies scaled by $s=1/2$.", numbers: "$D=\\log3/\\log2\\approx1.58496$." },
      { title: "Koch curve", background: "The construction keeps $N=4$ copies scaled by $s=1/3$.", numbers: "$D=\\log4/\\log3\\approx1.26186$." },
      { title: "Box-count growth", background: "Cantor construction doubles interval count each stage and thirds the length scale.", numbers: "After five stages it has $2^5=32$ intervals of length $3^{-5}$." },
      { title: "Image texture", background: "Box counts grow from $64$ to $256$ when scale halves twice.", numbers: "The estimated dimension is $\\log(256/64)/\\log4=1$." },
      { title: "Chaotic basin boundary", background: "A boundary needs $3^5=243$ boxes at scale $1/3^5$.", numbers: "Its scaling is consistent with dimension near $1$." }
    ]
  },
  "math-25-20": {
    connectionsProse:
      "<p>This final lesson connects the section back to machine learning dynamics. Gradient descent is a discrete dynamical system on parameters, and an RNN is a discrete dynamical system on hidden states. The same multiplier and eigenvalue tests explain local convergence, oscillation, decay, and growth. This gives the earlier stability tools a direct role in training and sequence models.</p>",
    motivation:
      "<p>Many machine learning procedures repeatedly update a state. In gradient descent, the state is the parameter vector, and the update depends on the gradient. Near a quadratic minimum, the error follows a linear scalar map whose multiplier depends on curvature and learning rate.</p>" +
      "<p>Recurrent neural networks use the same repeated-multiplication idea for hidden states. Along an eigenvector of the recurrent matrix, the component is multiplied by the corresponding eigenvalue each step. Eigenvalues inside the unit circle produce decay, while eigenvalues outside it produce growth or instability.</p>",
    definition:
      "<p><b>Training dynamics and RNN stability</b> use the same discrete multiplier rule: $$w_{k+1}=w_k-\\eta\\nabla L(w_k),\\qquad e_{k+1}=(1-\\eta a)e_k,\\qquad h_t=W^th_0.$$</p>" +
      "<p><b>Assumptions that matter:</b> gradient descent is studied near a one-dimensional quadratic minimum, the RNN example uses zero input, and stability is controlled by multiplier magnitude or eigenvalue magnitude.</p>",
    symbols: [
      { sym: "$w_k$", desc: "the parameter vector" },
      { sym: "$\\eta$", desc: "learning rate" },
      { sym: "$L$", desc: "loss" },
      { sym: "$a$", desc: "local curvature" },
      { sym: "$e_k$", desc: "optimization error" },
      { sym: "$h_t$", desc: "hidden state" },
      { sym: "$W$", desc: "recurrent weight matrix" },
      { sym: "$\\rho(W)$", desc: "the largest eigenvalue magnitude" }
    ],
    derivation: [
      { do: "For gradient descent, write $w_{k+1}=w_k-\\eta\\nabla L(w_k)$", result: "parameters are the state", why: "training is a discrete dynamical system" },
      { do: "Near a one-dimensional quadratic minimum $L(w)=\\frac{a}{2}(w-w^*)^2$, compute $\\nabla L=a(w-w^*)$", result: "the gradient is linear in the error", why: "quadratic loss has linear derivative" },
      { do: "Let $e_k=w_k-w^*$", result: "distance from the optimum", why: "measure optimization error" },
      { do: "Substitute into the update", result: "$e_{k+1}=(1-\\eta a)e_k$", why: "the update is a discrete map on error" },
      { do: "Apply the multiplier rule", result: "$|1-\\eta a|<1$", why: "local stability requires the error multiplier to have magnitude below one" },
      { do: "Solve the inequality", result: "$0<\\eta<2/a$", why: "this is the stable learning-rate interval" },
      { do: "For an RNN with zero input, write $h_t=Wh_{t-1}$", result: "$h_t=W^th_0$", why: "repeated multiplication drives memory" },
      { do: "Use an eigenvector $Wv=\\lambda v$", result: "the hidden component becomes $\\lambda^t$ times its initial value", why: "$|\\lambda|<1$ shrinks and $|\\lambda|>1$ grows" }
    ],
    applications: [
      { title: "Safe learning rate", background: "With curvature $a=6$, apply $0<\\eta<2/a$.", numbers: "Stability requires $0<\\eta<1/3$." },
      { title: "Stable GD update", background: "With $a=6$, $\\eta=0.1$, the multiplier is below one.", numbers: "Multiplier is $0.4$ and five steps leave $0.01024$ of the error." },
      { title: "Oscillatory GD", background: "With $a=6$, $\\eta=0.3$, the multiplier is negative but stable.", numbers: "Multiplier is $-0.8$, so the sign alternates while size shrinks." },
      { title: "Unstable GD", background: "With $a=6$, $\\eta=0.4$, the multiplier is too large in magnitude.", numbers: "Multiplier is $-1.4$, so the method diverges locally." },
      { title: "RNN decay", background: "$W=\\operatorname{diag}(0.5,0.2)$ has spectral radius $0.5$.", numbers: "The slow mode leaves $0.5^{10}=0.0009765625$ after ten steps." },
      { title: "Exploding hidden state", background: "A recurrent eigenvalue $1.05$ is outside the unit circle.", numbers: "It grows by $1.05^{20}=2.653$ over twenty steps." }
    ]
  }
};
