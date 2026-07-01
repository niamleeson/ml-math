module.exports = {
  "math-25-01": {
    id: "math-25-01",
    title: "States and evolution",
    tagline: "A dynamical system starts with a state and a rule for how that state changes.",
    connections: {
      buildsOn: ["Functions and their graphs", "vectors", "sequences", "derivatives as rates of change"],
      leadsTo: ["One-dimensional flows", "Fixed points", "Phase portraits"],
      usedWith: ["recursion", "differential equations", "vector fields", "iteration"]
    },
    motivation:
      "<p>You already know how to update something step by step. If a bank balance earns interest, today's balance helps determine tomorrow's balance. If a ball is moving, its current position and velocity help determine what happens next.</p>" +
      "<p>A <b>dynamical system</b> gives this idea a clean language: name the current state, name the evolution rule, then follow the rule. The comfort is that even complicated motion begins with one honest question: what information do we need right now to predict the next change?</p>",
    definition:
      "<p>A <b>state</b> is a collection of variables that describes the system at one moment, often written $x_t$ in discrete time or $x(t)$ in continuous time. A discrete-time system has an update rule $x_{t+1}=F(x_t)$, where $F$ maps the current state to the next state. A continuous-time system has a differential equation $\\dot{x}=f(x)$, where $\\dot{x}=dx/dt$ is the instantaneous velocity of the state.</p>" +
      "<p>The reason this works is the Markov-style bookkeeping: if the state contains all variables needed for prediction, the future can be generated from the present rule. Starting from $x_0$, a discrete system gives $x_1=F(x_0)$, then $x_2=F(x_1)$, and so on. Starting from $x(0)$, a continuous system follows the velocity field $f$.</p>" +
      "<p><b>Assumptions that matter:</b> the state must include enough information to make the rule valid; the same rule is applied at each step or each time unless stated otherwise; discrete time counts jumps, while continuous time flows; and units matter because a state component, an update, and a rate are not interchangeable.</p>",
    worked: {
      problem: "For the discrete system $x_{t+1}=0.5x_t+3$ with $x_0=4$, compute $x_1$, $x_2$, $x_3$, and describe the direction of evolution.",
      skills: ["state updates", "iteration", "linear recurrence"],
      strategy: "The rule uses the current state — apply it once per step and keep the time index straight.",
      steps: [
        { do: "Substitute $x_0=4$", result: "$x_1=0.5(4)+3$", why: "the next state comes from the current state" },
        { do: "Compute $x_1$", result: "$x_1=5$", why: "$2+3=5$" },
        { do: "Substitute $x_1=5$", result: "$x_2=0.5(5)+3$", why: "use the new state for the next update" },
        { do: "Compute $x_2$", result: "$x_2=5.5$", why: "$2.5+3=5.5$" },
        { do: "Substitute $x_2=5.5$", result: "$x_3=0.5(5.5)+3$", why: "iterate the same rule again" },
        { do: "Compute $x_3$", result: "$x_3=5.75$", why: "$2.75+3=5.75$" },
        { do: "Compare the values", result: "$4,5,5.5,5.75$", why: "the state is increasing but by smaller amounts" }
      ],
      verify: "The increments are $1$, $0.5$, and $0.25$, so the motion is slowing as it rises toward a steady value.",
      answer: "$x_1=5$, $x_2=5.5$, $x_3=5.75$; the state moves upward with shrinking steps.",
      connects: "Evolution is repeated application of a rule to the current state."
    },
    practice: [
      { problem: "For $x_{t+1}=2x_t-1$ with $x_0=3$, compute $x_1$, $x_2$, and $x_3$.", steps: [
        { do: "Substitute $x_0=3$", result: "$x_1=2(3)-1$", why: "start from the given initial state" },
        { do: "Compute $x_1$", result: "$x_1=5$", why: "$6-1=5$" },
        { do: "Substitute $x_1=5$", result: "$x_2=2(5)-1$", why: "the second update uses $x_1$" },
        { do: "Compute $x_2$", result: "$x_2=9$", why: "$10-1=9$" },
        { do: "Substitute $x_2=9$", result: "$x_3=2(9)-1=17$", why: "apply the same evolution rule once more" }
      ], answer: "$x_1=5$, $x_2=9$, and $x_3=17$." },
      { problem: "A state is $s_t=(p_t,v_t)$ with update $p_{t+1}=p_t+v_t$ and $v_{t+1}=v_t-2$. Starting at $(10,6)$, find the next two states.", steps: [
        { do: "Update position once", result: "$p_1=10+6=16$", why: "new position uses current position plus velocity" },
        { do: "Update velocity once", result: "$v_1=6-2=4$", why: "velocity decreases by 2" },
        { do: "Write the first state", result: "$s_1=(16,4)$", why: "a state records both components" },
        { do: "Update position again", result: "$p_2=16+4=20$", why: "use the updated velocity" },
        { do: "Update velocity again", result: "$v_2=4-2=2$", why: "apply the same rule again" }
      ], answer: "$s_1=(16,4)$ and $s_2=(20,2)$." },
      { problem: "For $x_{t+1}=0.8x_t$ with $x_0=50$, compute $x_1$, $x_2$, and the percent change each step.", steps: [
        { do: "Compute the first update", result: "$x_1=0.8(50)=40$", why: "multiply the current state by 0.8" },
        { do: "Compute the second update", result: "$x_2=0.8(40)=32$", why: "apply the same multiplier again" },
        { do: "Find the first change", result: "$40-50=-10$", why: "compare new minus old" },
        { do: "Convert the first change to percent", result: "$-10/50=-0.20$", why: "divide by the old state" },
        { do: "Check the second percent", result: "$(32-40)/40=-0.20$", why: "the same multiplier gives the same percent change" }
      ], answer: "$x_1=40$, $x_2=32$, and the state decreases by $20\\%$ each step." },
      { problem: "For the continuous system $\\dot{x}=4-x$, find the velocity at $x=1$, $x=4$, and $x=6$.", steps: [
        { do: "Substitute $x=1$", result: "$\\dot{x}=4-1=3$", why: "velocity is the value of the right-hand side" },
        { do: "Interpret the sign at $1$", result: "positive velocity", why: "the state moves upward when $\\dot{x}>0$" },
        { do: "Substitute $x=4$", result: "$\\dot{x}=4-4=0$", why: "the state has no instantaneous motion there" },
        { do: "Substitute $x=6$", result: "$\\dot{x}=4-6=-2$", why: "evaluate the same rate rule" },
        { do: "Interpret the sign at $6$", result: "negative velocity", why: "the state moves downward when $\\dot{x}<0$" }
      ], answer: "The velocities are $3$, $0$, and $-2$; motion rises below $4$, stops at $4$, and falls above $4$." },
      { problem: "A training metric follows $m_{t+1}=m_t+0.1(1-m_t)$ from $m_0=0.60$. Compute $m_1$, $m_2$, and the remaining gap to $1$ after two steps.", steps: [
        { do: "Compute the first improvement", result: "$0.1(1-0.60)=0.04$", why: "the update takes 10 percent of the remaining gap" },
        { do: "Update the metric", result: "$m_1=0.60+0.04=0.64$", why: "add the improvement to the current metric" },
        { do: "Compute the second improvement", result: "$0.1(1-0.64)=0.036$", why: "the gap is now smaller" },
        { do: "Update again", result: "$m_2=0.64+0.036=0.676$", why: "apply the rule once more" },
        { do: "Find the remaining gap", result: "$1-0.676=0.324$", why: "gap means target minus current value" }
      ], answer: "$m_1=0.64$, $m_2=0.676$, and the remaining gap is $0.324$." }
    ],
    applications: [
      { title: "Gradient descent as state evolution", background: "Training a model updates parameters over many steps. The parameter vector is the state, and the optimizer is the evolution rule.", numbers: "For $w_{t+1}=w_t-0.1(2w_t-4)$ and $w_0=0$, $w_1=0.4$ and $w_2=0.72$." },
      { title: "Recurrent neural networks", background: "RNNs were built to process sequences by carrying a hidden state forward. Each token updates the state before the next token arrives.", numbers: "With $h_{t+1}=0.5h_t+x_t$, $h_0=0$, and inputs $2,4$, the states are $h_1=2$ and $h_2=5$." },
      { title: "Epidemic counts", background: "Simple epidemic models track susceptible and infected counts as a state. The rule estimates how those counts change over time.", numbers: "If infections grow by factor $1.2$ per day from $100$, then after two days $100(1.2)^2=144$." },
      { title: "Physics simulation", background: "Games and robotics simulate motion by updating position and velocity. The state must include velocity because position alone is not enough.", numbers: "With $p_{t+1}=p_t+0.1v_t$, $p_0=5$, and $v_0=3$, the next position is $5.3$." },
      { title: "Markov chains", background: "A Markov chain evolves a probability state through a transition matrix. It is discrete-time dynamics on probabilities.", numbers: "If $[0.7,0.3]$ moves by matrix rows $[0.8,0.2]$ and $[0.1,0.9]$, the first new probability is $0.7(0.8)+0.3(0.1)=0.59$." },
      { title: "Queues and servers", background: "Computer systems track queue length as a state. Arrivals and service completions update the state over time.", numbers: "A queue with $12$ jobs, $5$ arrivals, and $7$ completions updates to $12+5-7=10$ jobs." }
    ],
    applicationsClose: "States and evolution are the shared grammar behind learning loops, simulations, chains, queues, and physical motion.",
    takeaways: [
      "A state stores the variables needed to predict the system's next change.",
      "Discrete systems iterate $x_{t+1}=F(x_t)$; continuous systems follow $\\dot{x}=f(x)$.",
      "Good modeling begins by choosing a state that contains enough information.",
      "Many ML algorithms are dynamical systems in parameter or hidden-state space."
    ]
  },

  "math-25-02": {
    id: "math-25-02",
    title: "One-dimensional flows",
    tagline: "On a line, the sign of the velocity tells you which way the state flows.",
    connections: {
      buildsOn: ["States and evolution", "derivatives as rates of change", "sign charts"],
      leadsTo: ["Fixed points", "Stability of fixed points", "Bifurcations"],
      usedWith: ["differential equations", "phase lines", "roots of functions", "separation of variables"]
    },
    motivation:
      "<p>You can read a number line like a road. If the velocity is positive, the traveler moves right; if it is negative, the traveler moves left; if it is zero, the traveler pauses.</p>" +
      "<p>A one-dimensional flow turns that picture into analysis. You do not always need the exact formula for $x(t)$. Often the sign of $f(x)$ in $\\dot{x}=f(x)$ already tells the story: where motion goes, where it stops, and which places attract nearby states.</p>",
    definition:
      "<p>A <b>one-dimensional flow</b> is a continuous-time dynamical system $\\dot{x}=f(x)$ with one state variable $x$. The function $f$ assigns a velocity to each position. If $f(x)>0$, solutions move toward larger $x$; if $f(x)<0$, they move toward smaller $x$; if $f(x)=0$, the state is stationary.</p>" +
      "<p>The phase-line method comes from the differential equation itself: for a tiny time step $\\Delta t$, the change is approximately $\\Delta x\\approx f(x)\\Delta t$. With $\\Delta t>0$, the sign of $\\Delta x$ is the sign of $f(x)$. That is why arrows on the line are enough to predict direction.</p>" +
      "<p><b>Assumptions that matter:</b> time moves forward; $f$ is usually taken continuous so signs do not change except through zeros; the phase line describes direction, not exact timing; and one-dimensional solutions cannot pass through an equilibrium when uniqueness holds.</p>",
    worked: {
      problem: "Draw the phase-line information for $\\dot{x}=x(4-x)$ by testing intervals around its zeros.",
      skills: ["phase lines", "sign charts", "equilibrium candidates"],
      strategy: "Zeros split the line — test one point in each interval to determine the flow direction.",
      steps: [
        { do: "Set the velocity equal to zero", result: "$x(4-x)=0$", why: "motion stops where the right-hand side is zero" },
        { do: "Solve for zeros", result: "$x=0$ or $x=4$", why: "use the zero-product property" },
        { do: "Test $x=-1$", result: "$(-1)(5)=-5<0$", why: "this represents the interval $(-\\infty,0)$" },
        { do: "Test $x=2$", result: "$(2)(2)=4>0$", why: "this represents the interval $(0,4)$" },
        { do: "Test $x=5$", result: "$(5)(-1)=-5<0$", why: "this represents the interval $(4,\\infty)$" },
        { do: "Translate signs to arrows", result: "left, right, left", why: "negative velocity moves left and positive velocity moves right" }
      ],
      verify: "Values below $0$ decrease, values between $0$ and $4$ increase, and values above $4$ decrease, so nearby motion points toward $4$ and away from $0$.",
      answer: "Equilibria are $0$ and $4$; arrows are left on $(-\\infty,0)$, right on $(0,4)$, and left on $(4,\\infty)$.",
      connects: "A phase line compresses a whole differential equation into directions on the state line."
    },
    practice: [
      { problem: "For $\\dot{x}=x-2$, find the zero and the flow direction on each side.", steps: [
        { do: "Set the velocity to zero", result: "$x-2=0$", why: "zeros are possible stopping points" },
        { do: "Solve for the zero", result: "$x=2$", why: "add 2 to both sides" },
        { do: "Test $x=0$", result: "$0-2=-2<0$", why: "choose a point left of 2" },
        { do: "Test $x=3$", result: "$3-2=1>0$", why: "choose a point right of 2" },
        { do: "Translate signs", result: "left on $(-\\infty,2)$ and right on $(2,\\infty)$", why: "sign determines direction" }
      ], answer: "The zero is $x=2$; the flow moves left below $2$ and right above $2$." },
      { problem: "For $\\dot{x}=3-x$, find the zero and flow direction on each side.", steps: [
        { do: "Set the velocity to zero", result: "$3-x=0$", why: "stationary points have zero velocity" },
        { do: "Solve for $x$", result: "$x=3$", why: "move $x$ to the other side" },
        { do: "Test $x=1$", result: "$3-1=2>0$", why: "this point is left of 3" },
        { do: "Test $x=5$", result: "$3-5=-2<0$", why: "this point is right of 3" },
        { do: "Translate signs", result: "right below $3$ and left above $3$", why: "positive moves right and negative moves left" }
      ], answer: "The zero is $x=3$; the flow points toward $3$ from both sides." },
      { problem: "For $\\dot{x}=x^2-1$, make a sign chart across its zeros.", steps: [
        { do: "Factor the velocity", result: "$x^2-1=(x-1)(x+1)$", why: "factoring exposes zeros" },
        { do: "Find the zeros", result: "$x=-1$ and $x=1$", why: "each factor can be zero" },
        { do: "Test $x=-2$", result: "$4-1=3>0$", why: "represent the left interval" },
        { do: "Test $x=0$", result: "$0-1=-1<0$", why: "represent the middle interval" },
        { do: "Test $x=2$", result: "$4-1=3>0$", why: "represent the right interval" }
      ], answer: "The flow points right on $(-\\infty,-1)$, left on $(-1,1)$, and right on $(1,\\infty)$." },
      { problem: "For $\\dot{x}=-(x+2)(x-3)$, find the flow directions on the three intervals.", steps: [
        { do: "Find the zeros", result: "$x=-2$ and $x=3$", why: "each factor can make the velocity zero" },
        { do: "Test $x=-3$", result: "$-(-1)(-6)=-6<0$", why: "left of both zeros" },
        { do: "Test $x=0$", result: "$-(2)(-3)=6>0$", why: "between the zeros" },
        { do: "Test $x=4$", result: "$-(6)(1)=-6<0$", why: "right of both zeros" },
        { do: "Convert signs to arrows", result: "left, right, left", why: "velocity sign gives direction" }
      ], answer: "The flow moves left on $(-\\infty,-2)$, right on $(-2,3)$, and left on $(3,\\infty)$." },
      { problem: "A scalar training error follows $\\dot{e}=-0.5e$. If $e=10$, $e=2$, and $e=-1$, find the velocity and interpret the direction.", steps: [
        { do: "Substitute $e=10$", result: "$\\dot{e}=-0.5(10)=-5$", why: "evaluate the rate rule" },
        { do: "Substitute $e=2$", result: "$\\dot{e}=-0.5(2)=-1$", why: "positive errors decrease" },
        { do: "Substitute $e=-1$", result: "$\\dot{e}=-0.5(-1)=0.5$", why: "negative errors increase" },
        { do: "Find the zero", result: "$e=0$", why: "the rate vanishes only at zero" },
        { do: "Interpret the arrows", result: "motion points toward $0$", why: "positive states move down and negative states move up" }
      ], answer: "Velocities are $-5$, $-1$, and $0.5$; the flow moves toward zero error." }
    ],
    applications: [
      { title: "Error decay", background: "Many learning curves can be approximated by one scalar gap shrinking toward zero. A one-dimensional flow captures the direction before fine details are known.", numbers: "For $\\dot{e}=-0.2e$, an error $e=5$ has velocity $-1$, so it initially decreases by about $0.1$ over $0.1$ time units." },
      { title: "Population with carrying capacity", background: "The logistic model was introduced for populations that grow when small but slow near environmental limits.", numbers: "For $\\dot{x}=0.1x(100-x)$, at $x=20$ the velocity is $160$, while at $x=120$ it is $-240$." },
      { title: "Thermostat relaxation", background: "Objects often cool or warm toward ambient temperature. The temperature difference is a one-dimensional state.", numbers: "With $\\dot{T}=0.3(70-T)$, at $T=60$ the velocity is $3$ degrees per unit time; at $T=80$ it is $-3$." },
      { title: "Chemical concentration", background: "First-order reactions decrease concentration at a rate proportional to the amount present.", numbers: "If $\\dot{c}=-0.4c$ and $c=8$, then $\\dot{c}=-3.2$ concentration units per minute." },
      { title: "Regularization path intuition", background: "A tuning parameter may be adjusted continuously toward a target validation condition. A scalar flow models the direction of adjustment.", numbers: "If $\\dot{\\lambda}=0.05(1-\\lambda)$, then at $\\lambda=0.2$ the velocity is $0.04$." },
      { title: "Queue stabilization", background: "A simplified queue can be modeled by the difference between arrival rate and service response. The sign tells whether the queue grows or shrinks.", numbers: "For $\\dot{q}=6-0.5q$, a queue of $4$ grows at rate $4$, while a queue of $20$ shrinks at rate $-4$." }
    ],
    applicationsClose: "One-dimensional flows teach the essential habit of reading motion from signs before chasing exact solutions.",
    takeaways: [
      "In $\\dot{x}=f(x)$, positive $f(x)$ moves the state right and negative $f(x)$ moves it left.",
      "Zeros of $f$ split the phase line into intervals where direction can be tested.",
      "A phase line describes qualitative motion even without solving for $x(t)$.",
      "Scalar ML quantities such as errors, gaps, and tuning parameters often have useful flow models."
    ]
  },

  "math-25-03": {
    id: "math-25-03",
    title: "Fixed points",
    tagline: "A fixed point is a state that the dynamics leave exactly where it is.",
    connections: {
      buildsOn: ["States and evolution", "One-dimensional flows", "solving equations"],
      leadsTo: ["Stability of fixed points", "Saddle-node bifurcations", "Classification of equilibria"],
      usedWith: ["roots", "iteration", "equilibria", "phase lines"]
    },
    motivation:
      "<p>Some states are special because the rule stops changing them. If a room is exactly at the thermostat setting, the idealized temperature difference no longer moves. If an iteration lands on a value that maps to itself, the next value is the same.</p>" +
      "<p>These states are the landmarks of dynamics. Before asking whether motion spirals, oscillates, or becomes chaotic, we first ask where it can stand still.</p>",
    definition:
      "<p>For a discrete-time system $x_{t+1}=F(x_t)$, a <b>fixed point</b> is a value $x^\\ast$ satisfying $F(x^\\ast)=x^\\ast$. For a continuous-time system $\\dot{x}=f(x)$, an equilibrium or fixed point satisfies $f(x^\\ast)=0$. The symbol $x^\\ast$ means a special state, not multiplication.</p>" +
      "<p>The equations differ because the meanings of the rules differ. In discrete time, staying fixed means the next state equals the current state. In continuous time, staying fixed means the velocity is zero, so the state has no instantaneous reason to move.</p>" +
      "<p><b>Assumptions that matter:</b> fixed points depend on the chosen rule and domain; solving the algebraic equation finds candidates, but the domain may exclude some; continuous equilibria are zeros of velocity, not necessarily zeros of the state; and fixed points need not be stable.</p>",
    worked: {
      problem: "Find the fixed points of the discrete system $x_{t+1}=F(x_t)=0.5x_t+3$.",
      skills: ["fixed-point equations", "linear algebra", "discrete dynamics"],
      strategy: "A fixed point equals its own update — set $F(x)$ equal to $x$ and solve.",
      steps: [
        { do: "Write the fixed-point condition", result: "$F(x^\\ast)=x^\\ast$", why: "the next state must equal the current state" },
        { do: "Substitute the rule", result: "$0.5x^\\ast+3=x^\\ast$", why: "replace $F$ with its formula" },
        { do: "Subtract $0.5x^\\ast$", result: "$3=0.5x^\\ast$", why: "collect the state terms on one side" },
        { do: "Divide by $0.5$", result: "$x^\\ast=6$", why: "isolate the fixed point" },
        { do: "Check the update", result: "$F(6)=0.5(6)+3=6$", why: "the rule leaves 6 unchanged" }
      ],
      verify: "Starting at $6$ gives $6,6,6,\\ldots$, so it is genuinely fixed.",
      answer: "The unique fixed point is $x^\\ast=6$.",
      connects: "Fixed points are the still landmarks around which evolution is organized."
    },
    practice: [
      { problem: "Find the fixed point of $x_{t+1}=0.25x_t+9$.", steps: [
        { do: "Set next state equal to current state", result: "$0.25x^\\ast+9=x^\\ast$", why: "use the discrete fixed-point condition" },
        { do: "Subtract $0.25x^\\ast$", result: "$9=0.75x^\\ast$", why: "collect the variable terms" },
        { do: "Divide by $0.75$", result: "$x^\\ast=12$", why: "$9/0.75=12$" },
        { do: "Check in the rule", result: "$0.25(12)+9=12$", why: "$3+9=12$" },
        { do: "State uniqueness", result: "one fixed point", why: "a nonconstant linear equation has one solution" }
      ], answer: "$x^\\ast=12$." },
      { problem: "Find the equilibria of $\\dot{x}=x^2-4$.", steps: [
        { do: "Set velocity to zero", result: "$x^2-4=0$", why: "continuous fixed points have zero velocity" },
        { do: "Factor", result: "$(x-2)(x+2)=0$", why: "difference of squares" },
        { do: "Use zero-product property", result: "$x=2$ or $x=-2$", why: "one factor must vanish" },
        { do: "Check $x=2$", result: "$2^2-4=0$", why: "substitute into the velocity" },
        { do: "Check $x=-2$", result: "$(-2)^2-4=0$", why: "both values stop the flow" }
      ], answer: "The equilibria are $x^\\ast=-2$ and $x^\\ast=2$." },
      { problem: "Find all fixed points of the logistic map $x_{t+1}=rx_t(1-x_t)$ when $r=2$.", steps: [
        { do: "Write the fixed-point equation", result: "$2x^\\ast(1-x^\\ast)=x^\\ast$", why: "the update must equal the current state" },
        { do: "Move all terms to one side", result: "$2x^\\ast-2(x^\\ast)^2-x^\\ast=0$", why: "prepare to factor" },
        { do: "Combine like terms", result: "$x^\\ast-2(x^\\ast)^2=0$", why: "$2x^\\ast-x^\\ast=x^\\ast$" },
        { do: "Factor", result: "$x^\\ast(1-2x^\\ast)=0$", why: "common factor $x^\\ast$" },
        { do: "Solve each factor", result: "$x^\\ast=0$ or $x^\\ast=1/2$", why: "use zero-product property" }
      ], answer: "The fixed points are $0$ and $1/2$." },
      { problem: "Find the equilibrium of $\\dot{x}=5-2x$ and verify it by evaluating the velocity.", steps: [
        { do: "Set velocity to zero", result: "$5-2x^\\ast=0$", why: "equilibrium means no motion" },
        { do: "Move the variable term", result: "$5=2x^\\ast$", why: "add $2x^\\ast$ to both sides" },
        { do: "Divide by 2", result: "$x^\\ast=2.5$", why: "isolate the state" },
        { do: "Evaluate the velocity", result: "$5-2(2.5)=0$", why: "substitute the candidate" },
        { do: "Interpret", result: "the state stays at $2.5$", why: "zero velocity prevents movement" }
      ], answer: "The equilibrium is $x^\\ast=2.5$." },
      { problem: "A model-parameter update is $w_{t+1}=w_t-0.2(4w_t-8)$. Find the fixed point and interpret it as a zero-gradient condition.", steps: [
        { do: "Set update equal to current parameter", result: "$w^\\ast-0.2(4w^\\ast-8)=w^\\ast$", why: "fixed point means no update changes $w$" },
        { do: "Subtract $w^\\ast$ from both sides", result: "$-0.2(4w^\\ast-8)=0$", why: "remove the unchanged part" },
        { do: "Divide by $-0.2$", result: "$4w^\\ast-8=0$", why: "the step size is nonzero" },
        { do: "Solve for $w^\\ast$", result: "$w^\\ast=2$", why: "add 8 and divide by 4" },
        { do: "Interpret the gradient", result: "$4(2)-8=0$", why: "the update stops when the gradient term is zero" }
      ], answer: "The fixed point is $w^\\ast=2$, where the gradient term vanishes." }
    ],
    applications: [
      { title: "Optimizer convergence points", background: "Training algorithms stop changing parameters when the update rule maps parameters to themselves. Fixed points include minima, maxima, and saddles.", numbers: "For $w_{t+1}=w_t-0.1(2w_t-6)$, the fixed point solves $2w-6=0$, so $w=3$." },
      { title: "PageRank equilibrium", background: "PageRank is computed by repeatedly applying a link-transition rule until scores barely change. The final score vector is a fixed point.", numbers: "If a two-page rule sends $p$ to $0.2+0.6p$, the fixed point solves $p=0.2+0.6p$, giving $p=0.5$." },
      { title: "Economic balance", background: "Supply-demand models look for prices where the forces to raise and lower price cancel. That price is an equilibrium.", numbers: "If $\\dot{p}=20-4p$, the equilibrium is $p=5$ because $20-4(5)=0$." },
      { title: "Population carrying capacity", background: "In logistic growth, a population can settle at a carrying capacity where births and constraints balance.", numbers: "For $\\dot{x}=0.1x(100-x)$, equilibria are $x=0$ and $x=100$." },
      { title: "Batch normalization running averages", background: "Running averages update toward observed statistics. If observations stay constant, the average has a fixed point at that constant.", numbers: "For $m_{t+1}=0.9m_t+0.1(50)$, the fixed point solves $m=0.9m+5$, so $m=50$." },
      { title: "Control setpoints", background: "Controllers are designed so the desired target is an equilibrium. Deviations should move back toward it if the design is stable.", numbers: "For $\\dot{x}=2(10-x)$, the equilibrium is $x=10$ because the velocity is $0$ there." }
    ],
    applicationsClose: "Fixed points are where repeated rules, flows, averages, rankings, and controllers can settle.",
    takeaways: [
      "Discrete fixed points solve $F(x^\\ast)=x^\\ast$.",
      "Continuous equilibria solve $f(x^\\ast)=0$.",
      "Finding fixed points is algebra; understanding their behavior requires stability.",
      "Many ML training and averaging procedures can be read through their fixed points."
    ]
  },

  "math-25-04": {
    id: "math-25-04",
    title: "Stability of fixed points",
    tagline: "Stability asks whether nearby states come back, run away, or balance on a knife edge.",
    connections: {
      buildsOn: ["Fixed points", "One-dimensional flows", "derivatives", "absolute value"],
      leadsTo: ["Saddle-node bifurcations", "Classification of equilibria", "Nonlinear systems and linearization"],
      usedWith: ["linear approximation", "eigenvalues", "phase lines", "Taylor expansion"]
    },
    motivation:
      "<p>Finding a fixed point is like finding a parking spot on a hill. Stability asks what happens if the car is nudged a little. Does it roll back into the spot, roll away, or stay undecided?</p>" +
      "<p>This distinction matters everywhere in ML and simulation. A training point that attracts nearby parameters is different from a saddle that only looks stationary. Stability tells us what the neighborhood does.</p>",
    definition:
      "<p>A fixed point $x^\\ast$ is <b>stable</b> if states starting nearby remain nearby, and <b>asymptotically stable</b> if they also approach $x^\\ast$ over time. For a one-dimensional flow $\\dot{x}=f(x)$, if $f'(x^\\ast)<0$, nearby states are pulled toward $x^\\ast$; if $f'(x^\\ast)>0$, they are pushed away. For a discrete map $x_{t+1}=F(x_t)$, the local test is $|F'(x^\\ast)|<1$ for attraction and $|F'(x^\\ast)|>1$ for repulsion.</p>" +
      "<p>The derivative test comes from linearization. Near the fixed point, $f(x)\\approx f'(x^\\ast)(x-x^\\ast)$ because $f(x^\\ast)=0$. A negative coefficient makes positive deviations decrease and negative deviations increase, both back toward zero deviation.</p>" +
      "<p><b>Assumptions that matter:</b> these are local tests; derivatives must exist; zero derivative or $|F'|=1$ is inconclusive; nonlinear terms can decide borderline cases; and stability is about nearby initial conditions, not necessarily faraway ones.</p>",
    worked: {
      problem: "Classify the equilibria of $\\dot{x}=x(4-x)$ using the derivative test.",
      skills: ["equilibria", "derivative test", "local stability"],
      strategy: "Find where velocity is zero, then evaluate $f'$ at each fixed point.",
      steps: [
        { do: "Find equilibria", result: "$x^\\ast=0$ and $x^\\ast=4$", why: "$x(4-x)=0$" },
        { do: "Expand the velocity", result: "$f(x)=4x-x^2$", why: "expansion makes differentiation direct" },
        { do: "Differentiate", result: "$f'(x)=4-2x$", why: "use the power rule" },
        { do: "Evaluate at $0$", result: "$f'(0)=4>0$", why: "positive derivative means repelling for a flow" },
        { do: "Classify $0$", result: "unstable", why: "nearby deviations grow away from $0$" },
        { do: "Evaluate at $4$", result: "$f'(4)=-4<0$", why: "negative derivative means attracting for a flow" },
        { do: "Classify $4$", result: "asymptotically stable", why: "nearby states move back toward $4$" }
      ],
      verify: "The phase line also points away from $0$ and toward $4$, matching the derivative test.",
      answer: "$x^\\ast=0$ is unstable; $x^\\ast=4$ is asymptotically stable.",
      connects: "Stability is local motion read through the slope of the evolution rule."
    },
    practice: [
      { problem: "Classify the equilibrium of $\\dot{x}=3-x$.", steps: [
        { do: "Find the equilibrium", result: "$3-x^\\ast=0$", why: "set velocity to zero" },
        { do: "Solve", result: "$x^\\ast=3$", why: "move $x^\\ast$ to the other side" },
        { do: "Differentiate", result: "$f'(x)=-1$", why: "the derivative of $3-x$ is $-1$" },
        { do: "Evaluate at the equilibrium", result: "$f'(3)=-1<0$", why: "the slope is negative" },
        { do: "Classify", result: "asymptotically stable", why: "negative slope attracts in one-dimensional flows" }
      ], answer: "$x^\\ast=3$ is asymptotically stable." },
      { problem: "Classify the equilibria of $\\dot{x}=x^2-1$.", steps: [
        { do: "Find zeros", result: "$x^\\ast=-1$ and $x^\\ast=1$", why: "$x^2-1=0$" },
        { do: "Differentiate", result: "$f'(x)=2x$", why: "use the power rule" },
        { do: "Evaluate at $-1$", result: "$f'(-1)=-2<0$", why: "substitute the first equilibrium" },
        { do: "Classify $-1$", result: "stable", why: "negative derivative attracts" },
        { do: "Evaluate and classify $1$", result: "$f'(1)=2>0$, unstable", why: "positive derivative repels" }
      ], answer: "$-1$ is asymptotically stable and $1$ is unstable." },
      { problem: "For the map $F(x)=0.4x+6$, find the fixed point and classify it.", steps: [
        { do: "Set $F(x^\\ast)=x^\\ast$", result: "$0.4x^\\ast+6=x^\\ast$", why: "discrete fixed-point condition" },
        { do: "Solve", result: "$x^\\ast=10$", why: "$6=0.6x^\\ast$" },
        { do: "Differentiate the map", result: "$F'(x)=0.4$", why: "linear coefficient is the derivative" },
        { do: "Take absolute value", result: "$|F'(10)|=0.4<1$", why: "discrete attraction uses absolute slope" },
        { do: "Classify", result: "attracting", why: "nearby errors shrink by factor $0.4$ each step" }
      ], answer: "The fixed point is $10$, and it is attracting." },
      { problem: "For the map $F(x)=1.2x-2$, find the fixed point and classify it.", steps: [
        { do: "Set the fixed-point equation", result: "$1.2x^\\ast-2=x^\\ast$", why: "the update equals the state" },
        { do: "Subtract $x^\\ast$", result: "$0.2x^\\ast-2=0$", why: "collect terms" },
        { do: "Solve", result: "$x^\\ast=10$", why: "$2/0.2=10$" },
        { do: "Differentiate", result: "$F'(x)=1.2$", why: "the map is linear" },
        { do: "Classify", result: "repelling", why: "$|1.2|>1$ makes nearby errors grow" }
      ], answer: "The fixed point $10$ is repelling." },
      { problem: "A parameter follows $\\dot{w}=-(w-2)(w+1)$. Classify both equilibria by the derivative test.", steps: [
        { do: "Find equilibria", result: "$w^\\ast=2$ and $w^\\ast=-1$", why: "each factor can be zero" },
        { do: "Expand", result: "$f(w)=-w^2+w+2$", why: "multiplying helps differentiate" },
        { do: "Differentiate", result: "$f'(w)=-2w+1$", why: "use the power rule" },
        { do: "Evaluate at $2$", result: "$f'(2)=-3<0$", why: "negative slope attracts" },
        { do: "Evaluate at $-1$", result: "$f'(-1)=3>0$", why: "positive slope repels" }
      ], answer: "$w=2$ is asymptotically stable; $w=-1$ is unstable." }
    ],
    applications: [
      { title: "Training minima", background: "A local minimum of a loss can be stable under small gradient-descent steps because nearby parameters move back toward it.", numbers: "For $L(w)=(w-3)^2$, gradient flow $\\dot{w}=-2(w-3)$ has $f'(3)=-2<0$, so $w=3$ is stable." },
      { title: "Exploding and vanishing recurrences", background: "Repeated maps amplify or shrink perturbations depending on slope. This is the scalar version of recurrent-network stability.", numbers: "Errors under $e_{t+1}=0.7e_t$ shrink from $1$ to $0.49$ in two steps; under $1.2e_t$ they grow to $1.44$." },
      { title: "Thermostat targets", background: "A well-designed thermostat target attracts nearby temperatures. If feedback has the wrong sign, it repels instead.", numbers: "For $\\dot{T}=0.5(70-T)$, $f'(70)=-0.5$, so the target $70$ is stable." },
      { title: "Population extinction versus carrying capacity", background: "Ecological fixed points can represent extinction or sustainable population. Stability says which outcomes nearby populations approach.", numbers: "For $\\dot{x}=0.1x(100-x)$, $f'(0)=10>0$ and $f'(100)=-10<0$." },
      { title: "Numerical solvers", background: "Fixed-point iteration $x_{t+1}=F(x_t)$ converges locally when the slope magnitude is below one.", numbers: "If $F'(x^\\ast)=0.2$, an initial error $0.5$ is about $0.1$ after one step." },
      { title: "Control feedback gain", background: "Feedback controllers choose gains so deviations decay rather than grow. The derivative of the closed-loop rule measures that decay.", numbers: "A deviation update $d_{t+1}=-0.6d_t$ gives magnitudes $1,0.6,0.36$, so oscillations shrink." }
    ],
    applicationsClose: "Stability is the local weather around a fixed point: attracting, repelling, or too delicate for the first test.",
    takeaways: [
      "For one-dimensional flows, $f'(x^\\ast)<0$ attracts and $f'(x^\\ast)>0$ repels.",
      "For maps, $|F'(x^\\ast)|<1$ attracts and $|F'(x^\\ast)|>1$ repels.",
      "Borderline cases require more than the first derivative.",
      "Stability turns fixed points into meaningful predictions about nearby behavior."
    ]
  },

  "math-25-05": {
    id: "math-25-05",
    title: "Saddle-node bifurcations",
    tagline: "A saddle-node bifurcation is where two fixed points meet and disappear.",
    connections: {
      buildsOn: ["Fixed points", "Stability of fixed points", "quadratic equations", "parameters"],
      leadsTo: ["Transcritical and pitchfork bifurcations", "Nonlinear systems and linearization", "chaos"],
      usedWith: ["normal forms", "phase lines", "discriminants", "parameter spaces"]
    },
    motivation:
      "<p>Sometimes a system changes smoothly as a parameter changes, until suddenly its qualitative behavior changes. A tiny parameter shift can remove the resting place a state had been approaching.</p>" +
      "<p>A saddle-node bifurcation is the simplest version of that story. One stable and one unstable fixed point collide. On one side there are two landmarks; at the critical value they merge; on the other side there are none.</p>",
    definition:
      "<p>The standard saddle-node normal form is $\\dot{x}=r-x^2$, where $x$ is the state and $r$ is a parameter. Fixed points satisfy $r-x^2=0$, so $x^\\ast=\\pm\\sqrt{r}$ when $r>0$, one repeated fixed point $x^\\ast=0$ when $r=0$, and no real fixed points when $r<0$.</p>" +
      "<p>The collision is visible in the equation. As $r\\downarrow0$, the two fixed points $-\\sqrt{r}$ and $\\sqrt{r}$ move toward each other. At $r=0$ they meet at $0$. For $r<0$, the equation $x^2=r$ has no real solution, so the fixed points are gone.</p>" +
      "<p><b>Assumptions that matter:</b> the parameter changes slowly relative to the local dynamics; the normal form describes behavior near the collision, not necessarily far away; $r$ is real; and stability at the exact bifurcation can be semistable or degenerate because $f'(0)=0$.</p>",
    worked: {
      problem: "Analyze $\\dot{x}=r-x^2$ at $r=4$, $r=0$, and $r=-1$.",
      skills: ["bifurcation parameter", "fixed points", "stability"],
      strategy: "Solve $r-x^2=0$ for each parameter, then use $f'(x)=-2x$ for stability when possible.",
      steps: [
        { do: "Set the velocity to zero", result: "$r-x^2=0$", why: "fixed points have zero velocity" },
        { do: "Solve symbolically", result: "$x^\\ast=\\pm\\sqrt{r}$", why: "move $x^2$ to the other side" },
        { do: "Substitute $r=4$", result: "$x^\\ast=-2$ and $x^\\ast=2$", why: "$\\sqrt4=2$" },
        { do: "Differentiate", result: "$f'(x)=-2x$", why: "stability uses the slope at a fixed point" },
        { do: "Classify at $r=4$", result: "$-2$ unstable and $2$ stable", why: "$f'(-2)=4>0$ and $f'(2)=-4<0$" },
        { do: "Substitute $r=0$", result: "$x^\\ast=0$", why: "the two roots have collided" },
        { do: "Substitute $r=-1$", result: "no real fixed points", why: "$x^2=-1$ has no real solution" }
      ],
      verify: "For $r=4$, the phase line points away from $-2$ and toward $2$; for negative $r$, $r-x^2$ is always negative, so no stopping point exists.",
      answer: "$r=4$ has unstable $-2$ and stable $2$; $r=0$ has a degenerate fixed point at $0$; $r=-1$ has none.",
      connects: "The saddle-node pattern is creation or annihilation of a stable-unstable pair."
    },
    practice: [
      { problem: "For $\\dot{x}=r-x^2$, find fixed points at $r=9$ and classify them.", steps: [
        { do: "Set velocity to zero", result: "$9-x^2=0$", why: "use $r=9$" },
        { do: "Solve", result: "$x=\\pm3$", why: "$x^2=9$" },
        { do: "Differentiate", result: "$f'(x)=-2x$", why: "use the normal-form derivative" },
        { do: "Evaluate at $-3$", result: "$f'(-3)=6>0$", why: "positive slope repels" },
        { do: "Evaluate at $3$", result: "$f'(3)=-6<0$", why: "negative slope attracts" }
      ], answer: "$-3$ is unstable and $3$ is stable." },
      { problem: "For $\\dot{x}=r+x^2$, determine how many fixed points exist for $r=-4$, $0$, and $1$.", steps: [
        { do: "Set velocity to zero", result: "$r+x^2=0$", why: "fixed points stop the flow" },
        { do: "Solve for $x^2$", result: "$x^2=-r$", why: "move $r$ to the other side" },
        { do: "Use $r=-4$", result: "$x=\\pm2$", why: "$x^2=4$" },
        { do: "Use $r=0$", result: "$x=0$", why: "the two roots meet" },
        { do: "Use $r=1$", result: "no real roots", why: "$x^2=-1$ is impossible over the reals" }
      ], answer: "There are two fixed points for $r=-4$, one degenerate fixed point for $r=0$, and none for $r=1$." },
      { problem: "For $\\dot{x}=r-(x-2)^2$, find the saddle-node location and fixed points when $r=1$.", steps: [
        { do: "Set the velocity to zero", result: "$r-(x-2)^2=0$", why: "equilibria have zero velocity" },
        { do: "Solve for the square", result: "$(x-2)^2=r$", why: "move the square term" },
        { do: "Find the collision parameter", result: "$r=0$", why: "the two roots merge when the square equals zero" },
        { do: "Use $r=1$", result: "$x-2=\\pm1$", why: "take square roots" },
        { do: "Solve for $x$", result: "$x=1$ and $x=3$", why: "add 2 to both roots" }
      ], answer: "The saddle-node occurs at $r=0$, $x=2$; for $r=1$ the fixed points are $1$ and $3$." },
      { problem: "For $\\dot{x}=r+2x-x^2$, find the parameter value where fixed points collide.", steps: [
        { do: "Set velocity to zero", result: "$r+2x-x^2=0$", why: "fixed points solve the quadratic" },
        { do: "Rewrite as a standard quadratic", result: "$x^2-2x-r=0$", why: "multiply by $-1$" },
        { do: "Compute the discriminant", result: "$D=(-2)^2-4(1)(-r)=4+4r$", why: "collision happens when the discriminant is zero" },
        { do: "Set $D=0$", result: "$4+4r=0$", why: "a repeated root marks the saddle-node" },
        { do: "Solve for $r$", result: "$r=-1$", why: "subtract 4 and divide by 4" }
      ], answer: "The fixed points collide at $r=-1$." },
      { problem: "A scalar model has $\\dot{z}=a-z^2$. For $a=0.04$, find the stable fixed point and the recovery velocity at $z=0$.", steps: [
        { do: "Find the fixed points", result: "$z=\\pm\\sqrt{0.04}=\\pm0.2$", why: "solve $a-z^2=0$" },
        { do: "Differentiate", result: "$f'(z)=-2z$", why: "use the derivative stability test" },
        { do: "Identify the stable point", result: "$z=0.2$", why: "$f'(0.2)=-0.4<0$" },
        { do: "Evaluate velocity at $z=0$", result: "$\\dot{z}=0.04-0=0.04$", why: "substitute into the flow" },
        { do: "Interpret", result: "the state initially increases toward $0.2$", why: "positive velocity moves right" }
      ], answer: "The stable fixed point is $0.2$, and the velocity at $0$ is $0.04$." }
    ],
    applications: [
      { title: "Tipping points in feedback systems", background: "Saddle-node bifurcations model tipping points where a stable operating state disappears. Climate, ecology, and control systems all use this language.", numbers: "In $\\dot{x}=r-x^2$, reducing $r$ from $0.01$ to $-0.01$ changes fixed points from $\\pm0.1$ to none." },
      { title: "Optimizer failure modes", background: "A useful minimum can vanish as a hyperparameter changes, leaving the optimizer to move elsewhere. The local shape resembles a saddle-node.", numbers: "If local stationary points follow $w=\\pm\\sqrt{\\alpha}$, then at $\\alpha=0.04$ they are $\\pm0.2$, but at $\\alpha=-0.01$ none remain." },
      { title: "Power-grid voltage collapse", background: "Power systems can lose a stable voltage equilibrium as demand rises. Saddle-node bifurcation is a standard model of voltage collapse.", numbers: "A reduced model $\\dot{v}=r-(v-1)^2$ has equilibria $v=0.8$ and $1.2$ when $r=0.04$; both vanish when $r<0$." },
      { title: "Neural activation thresholds", background: "Some neuron models switch from resting to firing when input crosses a threshold. A saddle-node can represent the birth of repetitive activity.", numbers: "With input parameter $r=0.0025$, the normal-form roots are $\\pm0.05$; at $r=0$ they merge." },
      { title: "Recommendation market equilibria", background: "Feedback between exposure and popularity can create or destroy steady adoption levels. A simple scalar model can expose the tipping point.", numbers: "If adoption obeys $\\dot{x}=r-(x-0.5)^2$, then $r=0.01$ gives equilibria $0.4$ and $0.6$." },
      { title: "Mechanical buckling", background: "Structures under load can lose an equilibrium shape. Near a fold, the load parameter controls whether two nearby equilibria exist.", numbers: "The equation $P_c-P-y^2=0$ gives deflections $y=\\pm0.1$ when $P_c-P=0.01$ and none when $P>P_c$." }
    ],
    applicationsClose: "The saddle-node lesson is cautionary and powerful: smooth parameter change can erase the state a system relied on.",
    takeaways: [
      "The normal form $\\dot{x}=r-x^2$ has two, one, or zero fixed points depending on $r$.",
      "At the bifurcation, a stable and an unstable fixed point collide.",
      "The square-root dependence $\\pm\\sqrt{r}$ is the signature local geometry.",
      "Saddle-node bifurcations model tipping points in engineering, ecology, and learning systems."
    ]
  },

  "math-25-06": {
    id: "math-25-06",
    title: "Transcritical and pitchfork bifurcations",
    tagline: "Some bifurcations do not destroy fixed points; they exchange or split stability.",
    connections: {
      buildsOn: ["Saddle-node bifurcations", "Stability of fixed points", "factoring polynomials"],
      leadsTo: ["Two-dimensional linear systems", "Phase portraits", "Nonlinear systems and linearization"],
      usedWith: ["normal forms", "symmetry", "phase lines", "parameter diagrams"]
    },
    motivation:
      "<p>A saddle-node is dramatic: fixed points appear or vanish. But not every qualitative change is disappearance. Sometimes two branches pass through one another and trade stability. Sometimes one branch splits into three because symmetry allows two equal choices.</p>" +
      "<p>Transcritical and pitchfork bifurcations give those two stories names. They are especially helpful when a parameter controls whether a baseline state is safe, unstable, or replaced by new stable states.</p>",
    definition:
      "<p>The transcritical normal form is $\\dot{x}=rx-x^2=x(r-x)$. Its fixed points are $x=0$ and $x=r$, and they exchange stability at $r=0$. The supercritical pitchfork normal form is $\\dot{x}=rx-x^3=x(r-x^2)$. Its fixed points are $x=0$ for all $r$, plus $x=\\pm\\sqrt{r}$ when $r>0$.</p>" +
      "<p>The algebra shows the geometry. In the transcritical case, two branches $x=0$ and $x=r$ cross. In the pitchfork case, symmetry under $x\\mapsto -x$ makes the nonzero branches appear as a matched pair. Stability follows from $f'(x)$ at each branch.</p>" +
      "<p><b>Assumptions that matter:</b> these normal forms describe local behavior near $x=0$, $r=0$; the pitchfork form relies on symmetry that real systems may break; derivative tests fail exactly at the bifurcation; and the sign convention here is the common supercritical pitchfork.</p>",
    worked: {
      problem: "For the transcritical system $\\dot{x}=rx-x^2$, find and classify fixed points when $r=2$ and when $r=-2$.",
      skills: ["transcritical bifurcation", "factoring", "stability exchange"],
      strategy: "Factor the velocity, identify the two branches, then use $f'(x)=r-2x$.",
      steps: [
        { do: "Factor the velocity", result: "$f(x)=x(r-x)$", why: "factoring exposes the fixed-point branches" },
        { do: "Find fixed points", result: "$x^\\ast=0$ and $x^\\ast=r$", why: "each factor can be zero" },
        { do: "Differentiate", result: "$f'(x)=r-2x$", why: "stability comes from the local slope" },
        { do: "Use $r=2$ at $x=0$", result: "$f'(0)=2>0$", why: "the origin is repelling" },
        { do: "Use $r=2$ at $x=2$", result: "$f'(2)=-2<0$", why: "the nonzero branch is attracting" },
        { do: "Use $r=-2$ at $x=0$", result: "$f'(0)=-2<0$", why: "the origin is attracting" },
        { do: "Use $r=-2$ at $x=-2$", result: "$f'(-2)=2>0$", why: "the nonzero branch is repelling" }
      ],
      verify: "The branch $x=0$ changes from stable to unstable as $r$ crosses $0$, while $x=r$ changes the other way.",
      answer: "For $r=2$, $0$ is unstable and $2$ is stable. For $r=-2$, $0$ is stable and $-2$ is unstable.",
      connects: "A transcritical bifurcation is a stability exchange between crossing fixed-point branches."
    },
    practice: [
      { problem: "For $\\dot{x}=rx-x^2$ with $r=3$, find fixed points and classify them.", steps: [
        { do: "Factor", result: "$x(3-x)$", why: "substitute $r=3$" },
        { do: "Find fixed points", result: "$x=0$ and $x=3$", why: "each factor can vanish" },
        { do: "Differentiate", result: "$f'(x)=3-2x$", why: "use the derivative test" },
        { do: "Evaluate at $0$", result: "$f'(0)=3>0$", why: "positive slope repels" },
        { do: "Evaluate at $3$", result: "$f'(3)=-3<0$", why: "negative slope attracts" }
      ], answer: "$0$ is unstable and $3$ is stable." },
      { problem: "For $\\dot{x}=rx-x^3$ with $r=4$, find all fixed points.", steps: [
        { do: "Factor", result: "$x(4-x^2)=0$", why: "substitute $r=4$" },
        { do: "Use the first factor", result: "$x=0$", why: "the origin remains a branch" },
        { do: "Use the second factor", result: "$x^2=4$", why: "nonzero roots satisfy $4-x^2=0$" },
        { do: "Take square roots", result: "$x=\\pm2$", why: "$\\sqrt4=2$" },
        { do: "List all roots", result: "$-2,0,2$", why: "include the origin and both symmetric branches" }
      ], answer: "The fixed points are $x=-2$, $0$, and $2$." },
      { problem: "Classify the pitchfork fixed points of $\\dot{x}=rx-x^3$ when $r=1$.", steps: [
        { do: "List fixed points", result: "$x=-1,0,1$", why: "from $x(1-x^2)=0$" },
        { do: "Differentiate", result: "$f'(x)=1-3x^2$", why: "use the derivative test" },
        { do: "Evaluate at $0$", result: "$f'(0)=1>0$", why: "the origin repels" },
        { do: "Evaluate at $1$", result: "$f'(1)=-2<0$", why: "the right branch attracts" },
        { do: "Evaluate at $-1$", result: "$f'(-1)=-2<0$", why: "the left branch also attracts" }
      ], answer: "$0$ is unstable; $-1$ and $1$ are stable." },
      { problem: "For $\\dot{x}=rx-x^3$ with $r=-1$, find and classify the fixed points.", steps: [
        { do: "Set velocity to zero", result: "$x(-1-x^2)=0$", why: "substitute $r=-1$" },
        { do: "Solve the first factor", result: "$x=0$", why: "the origin is always a fixed point" },
        { do: "Check the second factor", result: "$-1-x^2=0$ has no real solution", why: "$x^2=-1$ is impossible over reals" },
        { do: "Differentiate", result: "$f'(x)=-1-3x^2$", why: "use the derivative test" },
        { do: "Evaluate at $0$", result: "$f'(0)=-1<0$", why: "negative slope attracts" }
      ], answer: "The only real fixed point is $0$, and it is stable." },
      { problem: "A symmetric model has $\\dot{a}=\\mu a-a^3$. If $\\mu=0.09$, find the stable nonzero states and classify the origin.", steps: [
        { do: "Find nonzero branches", result: "$a=\\pm\\sqrt{0.09}$", why: "solve $\\mu-a^2=0$" },
        { do: "Compute the roots", result: "$a=\\pm0.3$", why: "$0.3^2=0.09$" },
        { do: "Differentiate", result: "$f'(a)=0.09-3a^2$", why: "linearize the flow" },
        { do: "Classify the origin", result: "$f'(0)=0.09>0$", why: "positive slope repels" },
        { do: "Classify a nonzero branch", result: "$f'(0.3)=0.09-0.27=-0.18<0$", why: "both symmetric branches have the same stability" }
      ], answer: "The stable states are $a=\\pm0.3$; the origin is unstable." }
    ],
    applications: [
      { title: "Disease-free to endemic transition", background: "Epidemic models often have a disease-free equilibrium that changes stability when a reproduction parameter crosses a threshold. A transcritical bifurcation captures that exchange.", numbers: "In $\\dot{x}=rx-x^2$, $r=0.2$ gives stable endemic level $x=0.2$ and unstable disease-free level $0$." },
      { title: "Symmetry breaking", background: "Pitchfork bifurcations model systems that must choose between two symmetric states. Physics, pattern formation, and representation learning all use this idea.", numbers: "For $\\dot{x}=rx-x^3$ with $r=0.16$, the stable states are $x=\\pm0.4$." },
      { title: "Feature specialization", background: "A symmetric learning system can begin with equal representations, then split into two specialized choices when a gain parameter increases.", numbers: "If specialization amplitude follows $a=\\sqrt{g}$, then $g=0.25$ gives amplitudes $\\pm0.5$." },
      { title: "Laser threshold models", background: "Some laser models use a transcritical threshold where zero intensity loses stability and positive intensity becomes stable.", numbers: "The normal form with $r=1.5$ has intensity fixed points $0$ and $1.5$, with the positive branch stable." },
      { title: "Buckling with symmetry", background: "A straight beam under compression may buckle left or right. The two directions are symmetric, matching pitchfork geometry.", numbers: "If deflection satisfies $y=\\pm\\sqrt{P-P_c}$ and $P-P_c=0.04$, then $y=\\pm0.2$." },
      { title: "Fairness threshold dynamics", background: "A baseline operating point may exchange stability with an adjusted policy branch as a constraint strength changes. The transcritical picture helps track which branch is stable.", numbers: "For $\\dot{x}=cx-x^2$ and $c=-0.1$, $x=0$ is stable while $x=-0.1$ is unstable by the slope test." }
    ],
    applicationsClose: "Transcritical and pitchfork bifurcations show that qualitative change can be an exchange or a symmetric split, not only disappearance.",
    takeaways: [
      "Transcritical normal form $\\dot{x}=rx-x^2$ has branches $x=0$ and $x=r$ that exchange stability.",
      "Supercritical pitchfork normal form $\\dot{x}=rx-x^3$ creates stable symmetric branches for $r>0$.",
      "Stability comes from evaluating $f'(x^\\ast)$ away from the bifurcation point.",
      "Symmetry is the key assumption behind the clean pitchfork picture."
    ]
  },

  "math-25-07": {
    id: "math-25-07",
    title: "Two-dimensional linear systems",
    tagline: "A matrix can turn the plane into a flow of lines, spirals, saddles, and sinks.",
    connections: {
      buildsOn: ["vectors", "matrices", "eigenvalues and eigenvectors", "States and evolution"],
      leadsTo: ["Phase portraits", "Classification of equilibria", "Nonlinear systems and linearization"],
      usedWith: ["linear algebra", "systems of differential equations", "eigenvectors", "matrix exponentials"]
    },
    motivation:
      "<p>One-dimensional systems move on a line. Many real states need at least two coordinates: position and velocity, two competing populations, or two model parameters. Once two coordinates interact, a matrix becomes the local rule of motion.</p>" +
      "<p>Linear systems are the training ground. They are simple enough to solve, but rich enough to show the behaviors that nonlinear systems imitate near equilibria.</p>",
    definition:
      "<p>A two-dimensional linear system has the form $\\dot{\\mathbf{x}}=A\\mathbf{x}$, where $\\mathbf{x}=(x,y)^T$ is the state vector and $A$ is a $2\\times2$ matrix. The origin is always an equilibrium because $A\\mathbf{0}=\\mathbf{0}$. If $A\\mathbf{v}=\\lambda\\mathbf{v}$, then motion along the eigenvector direction satisfies $\\dot{c}=\\lambda c$, so $c(t)=c(0)e^{\\lambda t}$.</p>" +
      "<p>This eigenvector fact is the bridge from linear algebra to dynamics. Along an eigenvector, the matrix acts like multiplication by one number. Negative real $\\lambda$ decays, positive real $\\lambda$ grows, and complex eigenvalues combine rotation with growth or decay.</p>" +
      "<p><b>Assumptions that matter:</b> the system is homogeneous and linear; matrix entries are constant in time; eigenvalue behavior describes the whole system when there are enough eigenvectors, with generalized eigenvectors handling repeated cases; and units of matrix entries are rates per unit time.</p>",
    worked: {
      problem: "For $\\dot{\\mathbf{x}}=A\\mathbf{x}$ with $A=\\begin{pmatrix}-1&0\\\\0&-3\\end{pmatrix}$ and $\\mathbf{x}(0)=(4,2)$, solve for $x(t)$ and $y(t)$.",
      skills: ["diagonal systems", "exponential decay", "initial values"],
      strategy: "A diagonal matrix separates the coordinates — solve each scalar equation independently.",
      steps: [
        { do: "Write the first coordinate equation", result: "$\\dot{x}=-x$", why: "the first diagonal entry multiplies $x$" },
        { do: "Solve the first equation", result: "$x(t)=C_1e^{-t}$", why: "solutions to $\\dot{x}=\\lambda x$ are exponentials" },
        { do: "Use $x(0)=4$", result: "$C_1=4$", why: "$e^0=1$" },
        { do: "Write the second coordinate equation", result: "$\\dot{y}=-3y$", why: "the second diagonal entry multiplies $y$" },
        { do: "Solve the second equation", result: "$y(t)=C_2e^{-3t}$", why: "the rate is $-3$" },
        { do: "Use $y(0)=2$", result: "$C_2=2$", why: "match the initial condition" }
      ],
      verify: "Both coordinates decay to zero, and $y$ decays faster because $e^{-3t}$ shrinks faster than $e^{-t}$.",
      answer: "$\\mathbf{x}(t)=(4e^{-t},2e^{-3t})^T$.",
      connects: "Diagonal linear systems reveal eigenvalue behavior coordinate by coordinate."
    },
    practice: [
      { problem: "Solve $\\dot{x}=2x$, $\\dot{y}=-y$ with initial state $(1,5)$.", steps: [
        { do: "Solve the $x$ equation", result: "$x(t)=C_1e^{2t}$", why: "growth rate is 2" },
        { do: "Use $x(0)=1$", result: "$C_1=1$", why: "initial value fixes the constant" },
        { do: "Solve the $y$ equation", result: "$y(t)=C_2e^{-t}$", why: "decay rate is $-1$" },
        { do: "Use $y(0)=5$", result: "$C_2=5$", why: "match the second coordinate" },
        { do: "Combine coordinates", result: "$(e^{2t},5e^{-t})$", why: "the state vector stores both solutions" }
      ], answer: "$\\mathbf{x}(t)=(e^{2t},5e^{-t})^T$." },
      { problem: "For $A=\\begin{pmatrix}2&0\\\\0&-1\\end{pmatrix}$, identify eigenvalues, eigenvector axes, and qualitative behavior.", steps: [
        { do: "Read the first eigenvalue", result: "$\\lambda_1=2$", why: "diagonal entries are eigenvalues for a diagonal matrix" },
        { do: "Read the first eigenvector direction", result: "the $x$-axis", why: "the first coordinate evolves independently" },
        { do: "Read the second eigenvalue", result: "$\\lambda_2=-1$", why: "the second diagonal entry is the second eigenvalue" },
        { do: "Read the second eigenvector direction", result: "the $y$-axis", why: "the second coordinate evolves independently" },
        { do: "Interpret signs", result: "grow along $x$, decay along $y$", why: "positive eigenvalues repel and negative eigenvalues attract" }
      ], answer: "Eigenvalues $2$ and $-1$; the system is a saddle with unstable $x$-axis and stable $y$-axis." },
      { problem: "Find the eigenvalues of $A=\\begin{pmatrix}0&1\\\\-2&-3\\end{pmatrix}$.", steps: [
        { do: "Write the characteristic determinant", result: "$\\det(A-\\lambda I)=\\det\\begin{pmatrix}-\\lambda&1\\\\-2&-3-\\lambda\\end{pmatrix}$", why: "eigenvalues solve determinant zero" },
        { do: "Compute the determinant", result: "$\\lambda(3+\\lambda)+2$", why: "multiply diagonal terms and subtract off-diagonal product" },
        { do: "Expand", result: "$\\lambda^2+3\\lambda+2$", why: "distribute $\\lambda$" },
        { do: "Factor", result: "$(\\lambda+1)(\\lambda+2)$", why: "find two numbers multiplying to 2 and summing to 3" },
        { do: "Set factors to zero", result: "$\\lambda=-1$ and $\\lambda=-2$", why: "eigenvalues are roots" }
      ], answer: "The eigenvalues are $-1$ and $-2$." },
      { problem: "For $A=\\begin{pmatrix}0&-1\\\\1&0\\end{pmatrix}$, compute $\\dot{\\mathbf{x}}$ at $\\mathbf{x}=(1,0)$ and $(0,1)$.", steps: [
        { do: "Multiply at $(1,0)$", result: "$A(1,0)^T=(0,1)^T$", why: "use the first column of $A$" },
        { do: "Interpret the first velocity", result: "upward", why: "the velocity vector is $(0,1)$" },
        { do: "Multiply at $(0,1)$", result: "$A(0,1)^T=(-1,0)^T$", why: "use the second column of $A$" },
        { do: "Interpret the second velocity", result: "leftward", why: "the velocity vector is $(-1,0)$" },
        { do: "Infer the motion", result: "counterclockwise rotation", why: "right point moves up and top point moves left" }
      ], answer: "The velocities are $(0,1)$ and $(-1,0)$, indicating counterclockwise rotation." },
      { problem: "A two-parameter error model has $\\dot{e}_1=-4e_1$ and $\\dot{e}_2=-0.5e_2$. Starting from $(2,2)$, compare both errors at $t=2$ using $e^{-8}\\approx0.00034$ and $e^{-1}\\approx0.368$.", steps: [
        { do: "Write the first solution", result: "$e_1(t)=2e^{-4t}$", why: "initial value is 2 and rate is $-4$" },
        { do: "Evaluate at $t=2$", result: "$e_1(2)=2e^{-8}\\approx0.00068$", why: "use the given exponential" },
        { do: "Write the second solution", result: "$e_2(t)=2e^{-0.5t}$", why: "initial value is 2 and rate is $-0.5$" },
        { do: "Evaluate at $t=2$", result: "$e_2(2)=2e^{-1}\\approx0.736$", why: "use the given exponential" },
        { do: "Compare", result: "$e_2$ remains much larger", why: "the slow eigenvalue controls late decay" }
      ], answer: "At $t=2$, $e_1\\approx0.00068$ and $e_2\\approx0.736$; the second mode decays more slowly." }
    ],
    applications: [
      { title: "Local training dynamics", background: "Near a quadratic minimum, gradient flow is linear in the parameter error. Eigenvalues of the Hessian set decay rates.", numbers: "For $\\dot{e}=\\operatorname{diag}(-10,-1)e$, errors decay as $e^{-10t}$ and $e^{-t}$; at $t=1$, the factors are about $0.000045$ and $0.368$." },
      { title: "Oscillators", background: "Position-velocity systems such as springs naturally form two-dimensional linear systems. Pure imaginary eigenvalues produce rotation in phase space.", numbers: "For $\\dot{x}=v$, $\\dot{v}=-x$, the state $(1,0)$ has velocity $(0,-1)$ and moves around the origin." },
      { title: "Competing modes", background: "Linear models often decompose into independent modes. The slowest decaying mode dominates long-time behavior.", numbers: "If modes decay as $3e^{-t}$ and $2e^{-5t}$, at $t=2$ they are $0.406$ and $0.000091$, so the first dominates." },
      { title: "Control systems", background: "Linear state-space models are central in control. Stability is read from eigenvalues of the system matrix.", numbers: "Eigenvalues $-2$ and $-0.5$ imply both modes decay; the $-0.5$ mode has time constant $2$." },
      { title: "Principal directions in optimization", background: "Near a quadratic loss, eigenvectors identify directions of curvature. Gradient flow moves fastest along high-curvature directions.", numbers: "For curvature matrix $\\operatorname{diag}(8,2)$, gradient-flow rates are $-8$ and $-2$." },
      { title: "Linearized epidemic models", background: "Early epidemic dynamics can be approximated by a linear system around a disease-free state. Positive eigenvalues mean growth of infection modes.", numbers: "If one eigenvalue is $0.3$, a small infection component grows by factor $e^{0.3}\\approx1.35$ in one time unit." }
    ],
    applicationsClose: "Two-dimensional linear systems are where matrices become motion: stretching, shrinking, rotating, and mixing state directions.",
    takeaways: [
      "A linear system has form $\\dot{\\mathbf{x}}=A\\mathbf{x}$ and equilibrium at the origin.",
      "Eigenvectors give special directions where motion reduces to scalar exponential growth or decay.",
      "Negative real eigenvalues decay; positive real eigenvalues grow; complex eigenvalues rotate with growth or decay.",
      "Linear systems provide the local vocabulary for nonlinear dynamics."
    ]
  },

  "math-25-08": {
    id: "math-25-08",
    title: "Phase portraits",
    tagline: "A phase portrait is a map of motion in state space, not just a graph of one variable over time.",
    connections: {
      buildsOn: ["Two-dimensional linear systems", "vectors", "One-dimensional flows", "graphs in the plane"],
      leadsTo: ["Classification of equilibria", "Nonlinear systems and linearization", "chaos"],
      usedWith: ["vector fields", "nullclines", "trajectories", "eigenvectors"]
    },
    motivation:
      "<p>When a system has two state variables, plotting $x(t)$ alone can hide the story. The pair $(x,y)$ moves through a plane, and each point in the plane has a little velocity arrow attached to it.</p>" +
      "<p>A phase portrait lets you see the whole motion at once: where trajectories head, where they curve, which points are still, and which regions flow together. It is a weather map for dynamics.</p>",
    definition:
      "<p>For a planar system $\\dot{x}=f(x,y)$, $\\dot{y}=g(x,y)$, the <b>phase portrait</b> is the picture of the vector field $(f(x,y),g(x,y))$ together with representative trajectories. An $x$-nullcline is where $f(x,y)=0$, so motion is vertical there. A $y$-nullcline is where $g(x,y)=0$, so motion is horizontal there. Intersections of nullclines are equilibria.</p>" +
      "<p>The portrait follows directly from the state equation: at each point, the derivative vector tells the tangent direction of the trajectory. If you sketch enough arrows and respect nullclines, trajectories become readable without solving the system exactly.</p>" +
      "<p><b>Assumptions that matter:</b> trajectories follow forward time; representative arrows show direction, not exact speed unless scaled carefully; uniqueness usually prevents trajectories from crossing; and nullclines are not trajectories in general, only places where one component of velocity is zero.</p>",
    worked: {
      problem: "For $\\dot{x}=y$ and $\\dot{y}=-x$, find the nullclines and sample directions at $(1,0)$, $(0,1)$, $(-1,0)$, and $(0,-1)$.",
      skills: ["phase portraits", "nullclines", "vector fields"],
      strategy: "Set each velocity component to zero for nullclines, then evaluate the vector field at key points.",
      steps: [
        { do: "Set $\\dot{x}=0$", result: "$y=0$", why: "the $x$-nullcline has no horizontal motion" },
        { do: "Set $\\dot{y}=0$", result: "$x=0$", why: "the $y$-nullcline has no vertical motion" },
        { do: "Evaluate at $(1,0)$", result: "$(\\dot{x},\\dot{y})=(0,-1)$", why: "substitute $x=1$, $y=0$" },
        { do: "Evaluate at $(0,1)$", result: "$(\\dot{x},\\dot{y})=(1,0)$", why: "substitute $x=0$, $y=1$" },
        { do: "Evaluate at $(-1,0)$", result: "$(\\dot{x},\\dot{y})=(0,1)$", why: "substitute $x=-1$, $y=0$" },
        { do: "Evaluate at $(0,-1)$", result: "$(\\dot{x},\\dot{y})=(-1,0)$", why: "substitute $x=0$, $y=-1$" },
        { do: "Read the rotation", result: "clockwise", why: "right point moves down, bottom point moves left, left point moves up, top point moves right" }
      ],
      verify: "The vector is always perpendicular to $(x,y)$ for these sample points, so trajectories circle the origin rather than moving inward or outward.",
      answer: "Nullclines are $y=0$ and $x=0$; the sample arrows show clockwise circular motion around the origin.",
      connects: "A phase portrait converts differential equations into geometry in state space."
    },
    practice: [
      { problem: "For $\\dot{x}=x$, $\\dot{y}=-y$, find the velocity at $(1,1)$, $(-1,1)$, and $(1,-1)$.", steps: [
        { do: "Evaluate at $(1,1)$", result: "$(\\dot{x},\\dot{y})=(1,-1)$", why: "substitute into both components" },
        { do: "Interpret the first arrow", result: "right and down", why: "positive $x$ velocity and negative $y$ velocity" },
        { do: "Evaluate at $(-1,1)$", result: "$(\\dot{x},\\dot{y})=(-1,-1)$", why: "use $x=-1$, $y=1$" },
        { do: "Evaluate at $(1,-1)$", result: "$(\\dot{x},\\dot{y})=(1,1)$", why: "use $x=1$, $y=-1$" },
        { do: "Read the portrait", result: "away along $x$ and toward the $x$-axis in $y$", why: "$x$ grows away from zero while $y$ decays toward zero" }
      ], answer: "The arrows are $(1,-1)$, $(-1,-1)$, and $(1,1)$; the portrait is saddle-like." },
      { problem: "For $\\dot{x}=2-y$, $\\dot{y}=x-1$, find both nullclines and their equilibrium.", steps: [
        { do: "Set $\\dot{x}=0$", result: "$2-y=0$", why: "find the $x$-nullcline" },
        { do: "Solve for $y$", result: "$y=2$", why: "horizontal velocity vanishes there" },
        { do: "Set $\\dot{y}=0$", result: "$x-1=0$", why: "find the $y$-nullcline" },
        { do: "Solve for $x$", result: "$x=1$", why: "vertical velocity vanishes there" },
        { do: "Intersect nullclines", result: "$(1,2)$", why: "both velocity components vanish at the equilibrium" }
      ], answer: "The nullclines are $y=2$ and $x=1$; the equilibrium is $(1,2)$." },
      { problem: "For $\\dot{x}=x(1-y)$ and $\\dot{y}=y(x-1)$, find the nullclines.", steps: [
        { do: "Set $\\dot{x}=0$", result: "$x(1-y)=0$", why: "zero horizontal velocity" },
        { do: "Solve the $x$-nullclines", result: "$x=0$ or $y=1$", why: "use zero-product property" },
        { do: "Set $\\dot{y}=0$", result: "$y(x-1)=0$", why: "zero vertical velocity" },
        { do: "Solve the $y$-nullclines", result: "$y=0$ or $x=1$", why: "use zero-product property" },
        { do: "Find intersections", result: "$(0,0)$ and $(1,1)$", why: "equilibria sit where one nullcline from each family meets" }
      ], answer: "The $x$-nullclines are $x=0$, $y=1$; the $y$-nullclines are $y=0$, $x=1$; equilibria are $(0,0)$ and $(1,1)$." },
      { problem: "For $\\dot{x}=-x-y$, $\\dot{y}=x-y$, evaluate the vector field at $(1,0)$ and $(0,1)$ and infer spiral direction.", steps: [
        { do: "Evaluate at $(1,0)$", result: "$(\\dot{x},\\dot{y})=(-1,1)$", why: "substitute $x=1$, $y=0$" },
        { do: "Read the first arrow", result: "left and up", why: "both components give direction" },
        { do: "Evaluate at $(0,1)$", result: "$(\\dot{x},\\dot{y})=(-1,-1)$", why: "substitute $x=0$, $y=1$" },
        { do: "Read the second arrow", result: "left and down", why: "both components are negative there" },
        { do: "Infer rotation", result: "counterclockwise with inward drift", why: "right side moves upward and top moves left, while $-x$ and $-y$ terms damp" }
      ], answer: "The arrows suggest counterclockwise spiraling inward." },
      { problem: "A two-feature training state follows $\\dot{u}=-u$ and $\\dot{v}=-4v$. Starting at $(2,2)$, find the direction at that point and which axis is approached first.", steps: [
        { do: "Evaluate the vector field", result: "$(\\dot{u},\\dot{v})=(-2,-8)$", why: "substitute $u=2$, $v=2$" },
        { do: "Compare speed components", result: "$|\\dot{v}|=8>|\\dot{u}|=2$", why: "vertical component is larger" },
        { do: "Solve the coordinates", result: "$u(t)=2e^{-t}$ and $v(t)=2e^{-4t}$", why: "separate diagonal equations" },
        { do: "Compare decay rates", result: "$v$ decays faster", why: "$e^{-4t}$ shrinks faster than $e^{-t}$" },
        { do: "Interpret the portrait", result: "trajectories flatten toward the $u$-axis before reaching the origin", why: "the $v$ coordinate becomes small first" }
      ], answer: "The direction is $(-2,-8)$, and the trajectory approaches the $u$-axis first because $v$ decays faster." }
    ],
    applications: [
      { title: "Optimization trajectories", background: "Plotting two parameters against each other can reveal whether training heads directly to a minimum, curves through a valley, or oscillates.", numbers: "For $\\dot{w}_1=-w_1$, $\\dot{w}_2=-10w_2$, the point $(1,1)$ moves with velocity $(-1,-10)$." },
      { title: "Predator-prey cycles", background: "Ecology popularized phase portraits because prey and predator populations interact cyclically. The plane shows cycles better than separate time plots.", numbers: "For $\\dot{x}=x(1-y)$, $\\dot{y}=y(x-1)$, at $(2,1)$ the velocity is $(0,2)$, straight upward." },
      { title: "Mechanical position-velocity diagrams", background: "Phase portraits for oscillators plot position against velocity. Engineers read damping and oscillation directly from the shape.", numbers: "For $\\dot{x}=v$, $\\dot{v}=-x-0.2v$, at $(1,0)$ the velocity is $(0,-1)$." },
      { title: "Generative model dynamics", background: "Some generative samplers follow differential equations through latent space. Phase portraits help diagnose whether trajectories collapse or circulate.", numbers: "A latent flow $\\dot{z}_1=-z_2$, $\\dot{z}_2=z_1$ sends $(1,0)$ to velocity $(0,1)$." },
      { title: "Control state-space plots", background: "Controllers are often evaluated by trajectories in state space. Overshoot and damping are visible as spirals or direct approaches.", numbers: "The system $\\dot{x}=v$, $\\dot{v}=-4x-4v$ at $(1,0)$ has velocity $(0,-4)$ toward lower velocity." },
      { title: "Nullclines in neural activity models", background: "Neuroscience models often use voltage and recovery variables. Nullclines organize where each variable pauses.", numbers: "If $\\dot{v}=v-v^3/3-w$, then at $v=0.6$ the $v$-nullcline is $w=0.6-0.216/3=0.528$." }
    ],
    applicationsClose: "Phase portraits make dynamics visible by replacing isolated formulas with a map of directions and trajectories.",
    takeaways: [
      "A phase portrait shows vector-field arrows and representative trajectories in state space.",
      "Nullclines mark where one velocity component is zero.",
      "Equilibria occur where nullclines intersect.",
      "Trajectories usually cannot cross when solutions are unique."
    ]
  },

  "math-25-09": {
    id: "math-25-09",
    title: "Classification of equilibria",
    tagline: "Eigenvalues name the local personality of a planar equilibrium.",
    connections: {
      buildsOn: ["Two-dimensional linear systems", "Phase portraits", "eigenvalues", "Stability of fixed points"],
      leadsTo: ["Nonlinear systems and linearization", "chaos", "Lyapunov methods"],
      usedWith: ["trace and determinant", "characteristic polynomials", "phase portraits", "linearization"]
    },
    motivation:
      "<p>Near an equilibrium in the plane, trajectories can approach, flee, spiral, circle, or split along different directions. The picture may look complicated, but a $2\\times2$ matrix keeps a surprisingly compact summary.</p>" +
      "<p>The eigenvalues tell whether modes grow or decay, and whether rotation is present. Classification is the dictionary that translates those eigenvalues into words like sink, source, saddle, and spiral.</p>",
    definition:
      "<p>For $\\dot{\\mathbf{x}}=A\\mathbf{x}$, classify the equilibrium at the origin by the eigenvalues of $A$. Two negative real eigenvalues give a stable node or sink. Two positive real eigenvalues give an unstable node or source. Real eigenvalues with opposite signs give a saddle. Complex eigenvalues $a\\pm bi$ with $b\\ne0$ give spirals if $a\\ne0$ and a center for the linear system if $a=0$.</p>" +
      "<p>For a $2\\times2$ matrix, the trace $\\tau=\\operatorname{tr}(A)$ and determinant $\\Delta=\\det(A)$ help because the characteristic polynomial is $\\lambda^2-\\tau\\lambda+\\Delta=0$. The discriminant $\\tau^2-4\\Delta$ decides real versus complex eigenvalues, while signs of real parts decide stability.</p>" +
      "<p><b>Assumptions that matter:</b> this classification is exact for linear systems; repeated eigenvalues need extra care; centers in nonlinear systems require more analysis; and determinant $\\Delta<0$ always indicates a saddle because eigenvalues have opposite signs.</p>",
    worked: {
      problem: "Classify the origin for $A=\\begin{pmatrix}0&1\\\\-2&-3\\end{pmatrix}$.",
      skills: ["eigenvalues", "classification", "stable nodes"],
      strategy: "Find the characteristic polynomial, solve for eigenvalues, then translate their signs.",
      steps: [
        { do: "Compute the trace", result: "$\\tau=0+(-3)=-3$", why: "trace is the sum of diagonal entries" },
        { do: "Compute the determinant", result: "$\\Delta=0(-3)-1(-2)=2$", why: "use $ad-bc$" },
        { do: "Write the characteristic polynomial", result: "$\\lambda^2-\\tau\\lambda+\\Delta=\\lambda^2+3\\lambda+2$", why: "substitute trace and determinant" },
        { do: "Factor", result: "$(\\lambda+1)(\\lambda+2)$", why: "the roots are easy to read" },
        { do: "Find eigenvalues", result: "$\\lambda=-1$ and $\\lambda=-2$", why: "set each factor to zero" },
        { do: "Classify signs", result: "both real and negative", why: "both modes decay" },
        { do: "Name the equilibrium", result: "stable node", why: "two negative real eigenvalues form a sink without spiraling" }
      ],
      verify: "The determinant is positive and trace is negative, consistent with both eigenvalues having negative real parts.",
      answer: "The origin is a stable node, also called a sink.",
      connects: "Classification turns eigenvalue arithmetic into phase-portrait vocabulary."
    },
    practice: [
      { problem: "Classify $A=\\begin{pmatrix}2&0\\\\0&3\\end{pmatrix}$.", steps: [
        { do: "Read eigenvalues", result: "$\\lambda_1=2$, $\\lambda_2=3$", why: "diagonal entries are eigenvalues" },
        { do: "Check signs", result: "both positive", why: "each mode grows" },
        { do: "Check realness", result: "both real", why: "diagonal matrix has real eigenvalues" },
        { do: "Name the type", result: "unstable node", why: "two positive real eigenvalues repel" },
        { do: "Name the stability", result: "source", why: "nearby states move away from the origin" }
      ], answer: "The origin is an unstable node, or source." },
      { problem: "Classify $A=\\begin{pmatrix}1&0\\\\0&-4\\end{pmatrix}$.", steps: [
        { do: "Read eigenvalues", result: "$1$ and $-4$", why: "the matrix is diagonal" },
        { do: "Compare signs", result: "opposite signs", why: "one mode grows and one decays" },
        { do: "Identify stable direction", result: "$y$-axis", why: "the $-4$ eigenvalue decays" },
        { do: "Identify unstable direction", result: "$x$-axis", why: "the $1$ eigenvalue grows" },
        { do: "Classify", result: "saddle", why: "opposite signs always give saddle behavior" }
      ], answer: "The origin is a saddle." },
      { problem: "Classify $A=\\begin{pmatrix}0&-2\\\\2&0\\end{pmatrix}$.", steps: [
        { do: "Compute trace", result: "$\\tau=0$", why: "diagonal entries sum to zero" },
        { do: "Compute determinant", result: "$\\Delta=4$", why: "$0\\cdot0-(-2)(2)=4$" },
        { do: "Compute discriminant", result: "$\\tau^2-4\\Delta=0-16=-16$", why: "negative discriminant means complex eigenvalues" },
        { do: "Find real part", result: "$\\tau/2=0$", why: "complex eigenvalues have real part half the trace" },
        { do: "Classify", result: "center", why: "pure imaginary eigenvalues rotate without growth or decay in the linear system" }
      ], answer: "The origin is a center." },
      { problem: "Classify a system with trace $\\tau=-2$ and determinant $\\Delta=5$.", steps: [
        { do: "Compute discriminant", result: "$\\tau^2-4\\Delta=4-20=-16$", why: "decide real versus complex" },
        { do: "Identify eigenvalue type", result: "complex conjugates", why: "negative discriminant" },
        { do: "Compute real part", result: "$\\tau/2=-1$", why: "real part is half the trace" },
        { do: "Determine stability", result: "stable", why: "negative real part decays" },
        { do: "Name the portrait", result: "stable spiral", why: "complex eigenvalues rotate while decaying" }
      ], answer: "The equilibrium is a stable spiral." },
      { problem: "A linearized optimizer has eigenvalues $-0.2$ and $-5$. Classify the equilibrium and identify the slow mode.", steps: [
        { do: "Check signs", result: "both eigenvalues are negative", why: "both modes decay" },
        { do: "Check realness", result: "both eigenvalues are real", why: "no oscillatory part is listed" },
        { do: "Classify", result: "stable node", why: "negative real eigenvalues form a sink" },
        { do: "Compare magnitudes", result: "$|-0.2|<|-5|$", why: "smaller magnitude decays more slowly" },
        { do: "Identify slow mode", result: "the $-0.2$ mode", why: "$e^{-0.2t}$ shrinks slower than $e^{-5t}$" }
      ], answer: "It is a stable node, with the $-0.2$ eigenmode controlling slow convergence." }
    ],
    applications: [
      { title: "Convergence shape in optimization", background: "Near a minimum, eigenvalues of the local linearized flow explain whether parameters glide smoothly or oscillate.", numbers: "Eigenvalues $-1$ and $-10$ give a stable node; after one unit, mode factors are $0.368$ and $0.000045$." },
      { title: "Saddle points in loss landscapes", background: "High-dimensional losses often contain saddles. In two dimensions, opposite-sign eigenvalues show one direction descending and another ascending.", numbers: "Eigenvalues $3$ and $-2$ mean one perturbation grows like $e^{3t}$ while another decays like $e^{-2t}$." },
      { title: "Damped oscillations", background: "Physical and control systems spiral into equilibrium when damping is present with inertia. Complex eigenvalues encode that spiral.", numbers: "Eigenvalues $-0.5\\pm2i$ have decay factor $e^{-0.5t}$; at $t=2$, amplitude is multiplied by $e^{-1}\\approx0.368$." },
      { title: "Undamped oscillators", background: "Centers appear in ideal conservative systems with no damping. Energy stays constant in the linear model.", numbers: "Eigenvalues $\\pm3i$ rotate with angular speed $3$, giving period $2\\pi/3\\approx2.09$." },
      { title: "Control design", background: "Engineers place eigenvalues to get desired stability and response speed. More negative real parts settle faster but may require stronger control.", numbers: "A pole at $-4$ has time constant $1/4=0.25$, while a pole at $-1$ has time constant $1$." },
      { title: "Generative adversarial dynamics", background: "Minimax training can create rotational dynamics around equilibria. Complex eigenvalues are a local sign of cycling behavior.", numbers: "A local matrix with eigenvalues $-0.1\\pm1.5i$ spirals inward slowly, with amplitude factor $e^{-0.1}\\approx0.905$ per unit time." }
    ],
    applicationsClose: "Classification is a compact legend for the phase portrait: eigenvalues become motion names.",
    takeaways: [
      "Opposite-sign real eigenvalues give a saddle.",
      "Negative real parts attract; positive real parts repel.",
      "Complex eigenvalues create rotation; their real part decides spiral in or out.",
      "Trace, determinant, and discriminant quickly organize the $2\\times2$ cases."
    ]
  },

  "math-25-10": {
    id: "math-25-10",
    title: "Nonlinear systems and linearization",
    tagline: "Near an equilibrium, the Jacobian gives the best linear first look at nonlinear motion.",
    connections: {
      buildsOn: ["Phase portraits", "Classification of equilibria", "partial derivatives", "Jacobians"],
      leadsTo: ["Lyapunov stability", "limit cycles", "chaos", "continuous-time ML dynamics"],
      usedWith: ["Taylor approximation", "eigenvalues", "Jacobian matrices", "nullclines"]
    },
    motivation:
      "<p>Real dynamical systems are rarely perfectly linear. Populations multiply, activations saturate, feedback clips, and parameters interact. But close to an equilibrium, a nonlinear curve often looks almost like its tangent line.</p>" +
      "<p>Linearization is the disciplined version of that intuition. We compute the Jacobian at the equilibrium, classify the resulting linear system, and use it as the first local portrait of the nonlinear system.</p>",
    definition:
      "<p>For a nonlinear planar system $\\dot{x}=f(x,y)$, $\\dot{y}=g(x,y)$, an equilibrium $(x^\\ast,y^\\ast)$ satisfies $f(x^\\ast,y^\\ast)=0$ and $g(x^\\ast,y^\\ast)=0$. The <b>Jacobian</b> is $$J(x,y)=\\begin{pmatrix}\\partial f/\\partial x&\\partial f/\\partial y\\\\\\partial g/\\partial x&\\partial g/\\partial y\\end{pmatrix}.$$ The linearization near the equilibrium is $\\dot{\\mathbf{u}}=J(x^\\ast,y^\\ast)\\mathbf{u}$, where $\\mathbf{u}$ is the small displacement from equilibrium.</p>" +
      "<p>This is multivariable Taylor approximation: $f$ and $g$ are replaced by their first-order changes around the equilibrium. The constant terms vanish because the equilibrium has zero velocity. Eigenvalues of the Jacobian then predict local stability when no eigenvalue has zero real part.</p>" +
      "<p><b>Assumptions that matter:</b> the functions should be differentiable near the equilibrium; the conclusion is local; if an eigenvalue has zero real part, linearization may be inconclusive; and nonlinear terms can create behavior such as limit cycles that no single local linearization fully explains.</p>",
    worked: {
      problem: "For $\\dot{x}=x(1-y)$, $\\dot{y}=y(x-1)$, linearize at $(0,0)$ and classify the equilibrium.",
      skills: ["Jacobians", "linearization", "saddle classification"],
      strategy: "Compute the Jacobian, evaluate it at the equilibrium, then classify the eigenvalues.",
      steps: [
        { do: "Name $f$ and $g$", result: "$f(x,y)=x-xy$, $g(x,y)=xy-y$", why: "expand products before differentiating" },
        { do: "Compute $\\partial f/\\partial x$", result: "$1-y$", why: "differentiate $x-xy$ with respect to $x$" },
        { do: "Compute $\\partial f/\\partial y$", result: "$-x$", why: "differentiate $x-xy$ with respect to $y$" },
        { do: "Compute $\\partial g/\\partial x$", result: "$y$", why: "differentiate $xy-y$ with respect to $x$" },
        { do: "Compute $\\partial g/\\partial y$", result: "$x-1$", why: "differentiate $xy-y$ with respect to $y$" },
        { do: "Evaluate at $(0,0)$", result: "$J(0,0)=\\begin{pmatrix}1&0\\\\0&-1\\end{pmatrix}$", why: "substitute $x=0$, $y=0$" },
        { do: "Read eigenvalues", result: "$1$ and $-1$", why: "the evaluated Jacobian is diagonal" },
        { do: "Classify", result: "saddle", why: "opposite-sign eigenvalues" }
      ],
      verify: "Near $(0,0)$, the $x$ direction grows and the $y$ direction decays, exactly the saddle pattern.",
      answer: "The linearization is $\\dot{\\mathbf{u}}=\\begin{pmatrix}1&0\\\\0&-1\\end{pmatrix}\\mathbf{u}$, so $(0,0)$ is a saddle.",
      connects: "Linearization lets the local nonlinear portrait borrow the classification of a linear system."
    },
    practice: [
      { problem: "For $\\dot{x}=x-x^2$, linearize the one-dimensional system at $x=1$ and classify it.", steps: [
        { do: "Find the derivative", result: "$f'(x)=1-2x$", why: "linearization in one dimension uses the derivative" },
        { do: "Evaluate at $x=1$", result: "$f'(1)=-1$", why: "substitute the equilibrium" },
        { do: "Write the displacement", result: "$u=x-1$", why: "measure distance from equilibrium" },
        { do: "Write the linearization", result: "$\\dot{u}=-u$", why: "use $f'(1)$ as the coefficient" },
        { do: "Classify", result: "stable", why: "negative coefficient attracts" }
      ], answer: "The linearization is $\\dot{u}=-u$, so $x=1$ is stable." },
      { problem: "For $\\dot{x}=x+y^2$, $\\dot{y}=-2y$, compute the Jacobian at $(0,0)$.", steps: [
        { do: "Compute $\\partial f/\\partial x$", result: "$1$", why: "differentiate $x+y^2$ with respect to $x$" },
        { do: "Compute $\\partial f/\\partial y$", result: "$2y$", why: "differentiate with respect to $y$" },
        { do: "Compute $\\partial g/\\partial x$", result: "$0$", why: "$-2y$ has no $x$ term" },
        { do: "Compute $\\partial g/\\partial y$", result: "$-2$", why: "differentiate $-2y$" },
        { do: "Evaluate at $(0,0)$", result: "$J(0,0)=\\begin{pmatrix}1&0\\\\0&-2\\end{pmatrix}$", why: "$2y=0$ at the origin" }
      ], answer: "$J(0,0)=\\begin{pmatrix}1&0\\\\0&-2\\end{pmatrix}$, so the equilibrium is saddle-like." },
      { problem: "For $\\dot{x}=y$, $\\dot{y}=-\\sin x$, linearize at $(0,0)$.", steps: [
        { do: "Name the functions", result: "$f(x,y)=y$, $g(x,y)=-\\sin x$", why: "identify the two velocity components" },
        { do: "Compute the first row", result: "$\\partial f/\\partial x=0$, $\\partial f/\\partial y=1$", why: "$y$ changes only with $y$" },
        { do: "Compute $\\partial g/\\partial x$", result: "$-\\cos x$", why: "derivative of $-\\sin x$" },
        { do: "Compute $\\partial g/\\partial y$", result: "$0$", why: "$g$ has no $y$ term" },
        { do: "Evaluate at $(0,0)$", result: "$J(0,0)=\\begin{pmatrix}0&1\\\\-1&0\\end{pmatrix}$", why: "$\\cos0=1$" }
      ], answer: "The linearization is $\\dot{\\mathbf{u}}=\\begin{pmatrix}0&1\\\\-1&0\\end{pmatrix}\\mathbf{u}$, a linear center." },
      { problem: "For $\\dot{x}=x(2-x-y)$, $\\dot{y}=y(1-x)$, compute the Jacobian at $(1,1)$.", steps: [
        { do: "Expand $f$", result: "$f=2x-x^2-xy$", why: "expansion makes partial derivatives direct" },
        { do: "Compute $f$ derivatives", result: "$f_x=2-2x-y$, $f_y=-x$", why: "differentiate with respect to each variable" },
        { do: "Expand $g$", result: "$g=y-xy$", why: "write the product terms" },
        { do: "Compute $g$ derivatives", result: "$g_x=-y$, $g_y=1-x$", why: "differentiate with respect to each variable" },
        { do: "Evaluate at $(1,1)$", result: "$J(1,1)=\\begin{pmatrix}-1&-1\\\\-1&0\\end{pmatrix}$", why: "substitute $x=1$, $y=1$" }
      ], answer: "$J(1,1)=\\begin{pmatrix}-1&-1\\\\-1&0\\end{pmatrix}$." },
      { problem: "A two-parameter loss has gradient flow $\\dot{\\mathbf{w}}=-\\nabla L$ with $L(u,v)=u^2+4v^2+uv$. Linearize at $(0,0)$ and classify using the Hessian.", steps: [
        { do: "Compute $\\partial L/\\partial u$", result: "$2u+v$", why: "differentiate the loss with respect to $u$" },
        { do: "Compute $\\partial L/\\partial v$", result: "$8v+u$", why: "differentiate with respect to $v$" },
        { do: "Write gradient flow", result: "$\\dot{u}=-(2u+v)$, $\\dot{v}=-(u+8v)$", why: "gradient flow moves downhill" },
        { do: "Write the Jacobian", result: "$J=\\begin{pmatrix}-2&-1\\\\-1&-8\\end{pmatrix}$", why: "the system is already linear" },
        { do: "Check trace and determinant", result: "$\\tau=-10$, $\\Delta=16-1=15$", why: "negative trace and positive determinant suggest attraction" },
        { do: "Compute discriminant", result: "$\\tau^2-4\\Delta=100-60=40>0$", why: "eigenvalues are real" }
      ], answer: "The linearization has two negative real eigenvalues, so $(0,0)$ is a stable node for the gradient flow." }
    ],
    applications: [
      { title: "Local loss-landscape analysis", background: "Near a critical point, gradient flow linearizes to $\\dot{e}=-He$, where $H$ is the Hessian. This links optimization dynamics to eigenvalues.", numbers: "If Hessian eigenvalues are $2$ and $5$, gradient-flow eigenvalues are $-2$ and $-5$, so both modes decay." },
      { title: "Neural ODE stability", background: "Neural ODEs define hidden-state dynamics continuously. The Jacobian of the learned vector field controls local expansion or contraction.", numbers: "A local Jacobian with largest real eigenvalue $0.4$ expands perturbations by about $e^{0.4}\\approx1.49$ in one time unit." },
      { title: "Predator-prey equilibria", background: "Nonlinear ecology models use Jacobians at coexistence states to detect cycles or instability.", numbers: "For $\\dot{x}=x(1-y)$, $\\dot{y}=y(x-1)$, $J(1,1)=\\begin{pmatrix}0&-1\\\\1&0\\end{pmatrix}$, giving a linear center." },
      { title: "Epidemic thresholds", background: "Linearizing around a disease-free equilibrium reveals whether small infections grow. Positive eigenvalues mean invasion.", numbers: "If the infection component linearizes as $\\dot{i}=0.2i$, then $i(t)=i_0e^{0.2t}$ grows by factor $1.22$ after one unit." },
      { title: "Robotics near setpoints", background: "Robot controllers are nonlinear, but near a target pose the Jacobian predicts whether small errors decay.", numbers: "A local error matrix with eigenvalues $-3$ and $-4$ reduces mode amplitudes by factors $e^{-3}\\approx0.050$ and $e^{-4}\\approx0.018$ after one second." },
      { title: "GAN and minimax training", background: "Adversarial training often has rotational local dynamics. Linearization reveals whether those rotations damp, persist, or grow.", numbers: "Eigenvalues $0.1\\pm2i$ imply outward spiraling with amplitude factor $e^{0.1}\\approx1.105$ per unit time." }
    ],
    applicationsClose: "Linearization is not the whole nonlinear story, but it is the first reliable local translation from equations to motion.",
    takeaways: [
      "Equilibria of nonlinear systems solve all velocity components equal to zero.",
      "The Jacobian matrix contains first partial derivatives of the vector field.",
      "Evaluating the Jacobian at an equilibrium gives the local linear system.",
      "If no eigenvalue has zero real part, Jacobian eigenvalues determine local stability type."
    ]
  }
};
