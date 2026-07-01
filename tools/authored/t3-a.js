module.exports = {
  "math-03-01": {
    "id": "math-03-01",
    "title": "What is a differential equation?",
    "tagline": "A differential equation is a rule for change, asking for the function whose motion fits the rule.",
    "connections": {
      "buildsOn": [
        "functions",
        "derivatives",
        "rates of change"
      ],
      "leadsTo": [
        "Classifying differential equations",
        "Solutions and initial conditions",
        "modeling with first-order ODEs"
      ],
      "usedWith": [
        "derivatives",
        "antiderivatives",
        "exponential functions",
        "graphs"
      ]
    },
    "motivation": "<p>You already know how to read a derivative as a rate. If $s(t)$ is position, then $s'(t)$ is velocity; if $L(w)$ is loss, then $L'(w)$ says how the loss changes when the weight moves.</p><p>A <b>differential equation</b> turns that rate information into a puzzle: find the unknown function whose derivative obeys a given rule. Instead of being handed the path, you are handed the motion law and asked to recover the path.</p>",
    "definition": "<p>A <b>differential equation</b> is an equation involving an unknown function and one or more of its derivatives. For example, $\\dfrac{dy}{dx}=3x^2$ asks for a function $y(x)$ whose derivative with respect to $x$ is $3x^2$. The independent variable is $x$, the dependent variable is $y$, and $\\dfrac{dy}{dx}$ is the rate of change of $y$ with respect to $x$.</p><p>The key fact comes from reversing differentiation: if $\\dfrac{dy}{dx}=g(x)$, then $y=\\int g(x)\\,dx+C$. The constant $C$ appears because many functions can have the same derivative; they differ by vertical shifts.</p><p><b>Assumptions that matter:</b> variables must be named clearly; a derivative such as $y'$ means derivative of the unknown function; a solution is a function, not just a number; and an interval of validity matters because formulas can break at endpoints or singularities.</p>",
    "worked": {
      "problem": "Solve the differential equation $\\dfrac{dy}{dx}=3x^2$ and then choose the solution with $y(0)=2$.",
      "skills": [
        "derivative notation",
        "antiderivatives",
        "initial values"
      ],
      "strategy": "The equation gives the derivative directly — integrate once, then use the given point to find the constant.",
      "steps": [
        {
          "do": "Write the rate equation",
          "result": "$\\dfrac{dy}{dx}=3x^2$",
          "why": "the derivative of the unknown function is given"
        },
        {
          "do": "Integrate both sides with respect to $x$",
          "result": "$y=\\int 3x^2\\,dx$",
          "why": "integration reverses differentiation"
        },
        {
          "do": "Compute the antiderivative",
          "result": "$y=x^3+C$",
          "why": "the derivative of $x^3$ is $3x^2$"
        },
        {
          "do": "Substitute the initial condition",
          "result": "$2=0^3+C$",
          "why": "$y(0)=2$ means the graph passes through $(0,2)$"
        },
        {
          "do": "Solve for the constant",
          "result": "$C=2$",
          "why": "the initial value chooses one member of the family"
        }
      ],
      "verify": "Differentiating $y=x^3+2$ gives $3x^2$, and substituting $x=0$ gives $y=2$.",
      "answer": "$y=x^3+C$ is the general solution; the solution with $y(0)=2$ is $y=x^3+2$.",
      "connects": "A differential equation describes motion through derivatives; a solution is the function that follows that motion law."
    },
    "practice": [
      {
        "problem": "Solve $\\dfrac{dy}{dx}=4x-1$.",
        "steps": [
          {
            "do": "Integrate both sides",
            "result": "$y=\\int(4x-1)\\,dx$",
            "why": "the derivative is given as a function of $x$"
          },
          {
            "do": "Integrate $4x$",
            "result": "$2x^2$",
            "why": "power rule in reverse"
          },
          {
            "do": "Integrate $-1$",
            "result": "$-x$",
            "why": "a constant integrates to constant times $x$"
          },
          {
            "do": "Add the integration constant",
            "result": "$y=2x^2-x+C$",
            "why": "all vertical shifts have the same derivative"
          },
          {
            "do": "Differentiate to check",
            "result": "$y'=4x-1$",
            "why": "the derivative matches the equation"
          }
        ],
        "answer": "$y=2x^2-x+C$."
      },
      {
        "problem": "Find the solution of $y'=2e^x$ with $y(0)=5$.",
        "steps": [
          {
            "do": "Integrate the derivative",
            "result": "$y=\\int 2e^x\\,dx$",
            "why": "recover the unknown function"
          },
          {
            "do": "Compute the antiderivative",
            "result": "$y=2e^x+C$",
            "why": "$e^x$ differentiates to itself"
          },
          {
            "do": "Apply $y(0)=5$",
            "result": "$5=2e^0+C$",
            "why": "use the point at $x=0$"
          },
          {
            "do": "Simplify",
            "result": "$5=2+C$",
            "why": "$e^0=1$"
          },
          {
            "do": "Solve for $C$",
            "result": "$C=3$",
            "why": "subtract 2"
          }
        ],
        "answer": "$y=2e^x+3$."
      },
      {
        "problem": "A position function satisfies $s'(t)=6t$ meters per second and $s(1)=10$ meters. Find $s(t)$.",
        "steps": [
          {
            "do": "Integrate velocity",
            "result": "$s(t)=\\int 6t\\,dt$",
            "why": "position is an antiderivative of velocity"
          },
          {
            "do": "Compute the antiderivative",
            "result": "$s(t)=3t^2+C$",
            "why": "reverse the power rule"
          },
          {
            "do": "Use $s(1)=10$",
            "result": "$10=3\\cdot1^2+C$",
            "why": "the position is known at one time"
          },
          {
            "do": "Simplify",
            "result": "$10=3+C$",
            "why": "evaluate the square"
          },
          {
            "do": "Solve for $C$",
            "result": "$C=7$",
            "why": "subtract 3"
          }
        ],
        "answer": "$s(t)=3t^2+7$ meters."
      },
      {
        "problem": "Show that $y=Ce^{-2x}$ solves $y'=-2y$.",
        "steps": [
          {
            "do": "Differentiate the proposed solution",
            "result": "$y'=-2Ce^{-2x}$",
            "why": "chain rule on $e^{-2x}$"
          },
          {
            "do": "Compute $-2y$",
            "result": "$-2y=-2Ce^{-2x}$",
            "why": "substitute the proposed $y$"
          },
          {
            "do": "Compare both sides",
            "result": "$y'=-2y$",
            "why": "the expressions match"
          },
          {
            "do": "Note the constant",
            "result": "$C$ can be any real number",
            "why": "the derivative law holds for every vertical scale"
          },
          {
            "do": "Check the zero case",
            "result": "$C=0$ gives $y=0$",
            "why": "the constant solution also satisfies the equation"
          }
        ],
        "answer": "Yes. Every function $y=Ce^{-2x}$ satisfies $y'=-2y$."
      },
      {
        "problem": "A loss changes with weight according to $\\dfrac{dL}{dw}=2(w-3)$ and $L(3)=1$. Find $L(w)$.",
        "steps": [
          {
            "do": "Integrate the gradient",
            "result": "$L(w)=\\int 2(w-3)\\,dw$",
            "why": "the loss is recovered from its derivative"
          },
          {
            "do": "Expand the integrand",
            "result": "$2w-6$",
            "why": "simple terms are easy to integrate"
          },
          {
            "do": "Compute the antiderivative",
            "result": "$L(w)=w^2-6w+C$",
            "why": "reverse the power rule"
          },
          {
            "do": "Apply $L(3)=1$",
            "result": "$1=9-18+C$",
            "why": "use the known loss value"
          },
          {
            "do": "Solve for $C$",
            "result": "$C=10$",
            "why": "$1=-9+C$"
          }
        ],
        "answer": "$L(w)=w^2-6w+10=(w-3)^2+1$."
      }
    ],
    "applications": [
      {
        "title": "Velocity from acceleration",
        "background": "Classical mechanics made differential equations famous because forces determine acceleration, not position directly. Integrating the rate law recovers motion.",
        "numbers": "If $v'(t)=4$ m/s$^2$ and $v(0)=3$, then $v(t)=4t+3$, so after $5$ seconds the velocity is $23$ m/s."
      },
      {
        "title": "Continuous-time population growth",
        "background": "Population models use rates because births accumulate continuously rather than in neat yearly jumps.",
        "numbers": "If $P'(t)=0.2P(t)$ and $P(0)=100$, then $P(t)=100e^{0.2t}$; at $t=10$, $P\\approx739$ individuals."
      },
      {
        "title": "Neural ODEs",
        "background": "Neural ODE models replace a finite stack of layers with a learned continuous flow. The network learns the derivative of the hidden state.",
        "numbers": "If a toy hidden state satisfies $h'(t)=0.5h(t)$ with $h(0)=2$, then $h(4)=2e^2\\approx14.78$."
      },
      {
        "title": "Gradient flow",
        "background": "Optimization can be idealized as continuous movement downhill on a loss surface.",
        "numbers": "For $L(w)=\\tfrac12w^2$, gradient flow is $w'=-w$, so $w(0)=8$ gives $w(3)=8e^{-3}\\approx0.398$."
      },
      {
        "title": "RC circuits",
        "background": "Electrical circuits with resistors and capacitors are governed by rates of voltage change.",
        "numbers": "A simple discharge $V'=-0.1V$ with $V(0)=5$ gives $V(10)=5e^{-1}\\approx1.84$ volts."
      },
      {
        "title": "Queue backlog",
        "background": "Systems engineers model backlog by arrival rate minus service rate, which is a derivative of queue length.",
        "numbers": "If $Q'(t)=120-100=20$ requests per second and $Q(0)=50$, then $Q(6)=170$ requests."
      }
    ],
    "applicationsClose": "The common thread is that a derivative law describes how a quantity moves; solving the differential equation turns that law back into a function.",
    "takeaways": [
      "A differential equation contains an unknown function and its derivatives.",
      "A solution is a function that makes the equation true on an interval.",
      "Initial conditions choose one solution from a family.",
      "Many ML and CS dynamics are rate laws in practical clothing."
    ]
  },
  "math-03-02": {
    "id": "math-03-02",
    "title": "Classifying differential equations",
    "tagline": "Classification is the label on the toolbox: it tells you what kind of equation you are facing before you try to solve it.",
    "connections": {
      "buildsOn": [
        "What is a differential equation?",
        "derivative notation",
        "functions of one variable"
      ],
      "leadsTo": [
        "Solutions and initial conditions",
        "Separable equations",
        "Linear first-order equations"
      ],
      "usedWith": [
        "order",
        "linearity",
        "systems",
        "partial derivatives"
      ]
    },
    "motivation": "<p>You already sort equations without thinking: linear equations, quadratics, exponentials. Differential equations deserve the same kindness before we solve them.</p><p>Classification asks a few calm questions. How high is the derivative? Is there one independent variable or several? Does the unknown function appear linearly? The answers point toward the right method and keep us from forcing the wrong one.</p>",
    "definition": "<p>The <b>order</b> of a differential equation is the highest derivative that appears. An <b>ordinary differential equation</b> uses derivatives with respect to one independent variable, such as $\\dfrac{dy}{dx}$; a <b>partial differential equation</b> uses partial derivatives such as $\\dfrac{\\partial u}{\\partial t}$ when the unknown depends on several variables.</p><p>A first-order ODE is <b>linear</b> when it can be written $a_1(x)y'+a_0(x)y=g(x)$, where $y$ and $y'$ appear only to the first power and are not multiplied together. Dividing by $a_1(x)$, when nonzero, gives $y'+p(x)y=q(x)$.</p><p><b>Assumptions that matter:</b> classification is about the equation before solving; coefficients such as $p(x)$ may vary with $x$; nonlinear terms include $y^2$, $yy'$, $\\sin y$, or $e^y$; and a system has more than one unknown function.</p>",
    "worked": {
      "problem": "Classify $y''+3y'+2y=\\sin x$ by order, ordinary versus partial, and linear versus nonlinear.",
      "skills": [
        "order",
        "ODE versus PDE",
        "linearity"
      ],
      "strategy": "Read the notation first — the highest derivative gives order, and the form of $y$ decides linearity.",
      "steps": [
        {
          "do": "Find the highest derivative",
          "result": "$y''$",
          "why": "second derivative is the highest derivative shown"
        },
        {
          "do": "State the order",
          "result": "second order",
          "why": "order counts the highest derivative"
        },
        {
          "do": "Identify independent variables",
          "result": "one variable $x$",
          "why": "ordinary derivatives use one independent variable"
        },
        {
          "do": "Classify as ODE or PDE",
          "result": "ordinary differential equation",
          "why": "there are no partial derivatives"
        },
        {
          "do": "Check powers and products of $y$",
          "result": "linear",
          "why": "$y'',y',$ and $y$ appear only to the first power and are not multiplied together"
        }
      ],
      "verify": "The right side $\\sin x$ is allowed in a linear equation because it depends only on the independent variable.",
      "answer": "Second-order linear ODE.",
      "connects": "Classification separates structure from solution technique."
    },
    "practice": [
      {
        "problem": "Classify $y'=x+y$.",
        "steps": [
          {
            "do": "Find the highest derivative",
            "result": "$y'$",
            "why": "only first derivative appears"
          },
          {
            "do": "State the order",
            "result": "first order",
            "why": "highest derivative is first"
          },
          {
            "do": "Check variables",
            "result": "one independent variable $x$",
            "why": "ordinary derivative notation is used"
          },
          {
            "do": "Rewrite in standard form",
            "result": "$y'-y=x$",
            "why": "linear form has $y'+p(x)y=q(x)$"
          },
          {
            "do": "Classify linearity",
            "result": "linear",
            "why": "$y$ and $y'$ appear to the first power"
          }
        ],
        "answer": "First-order linear ODE."
      },
      {
        "problem": "Classify $y'=xy^2$.",
        "steps": [
          {
            "do": "Find the highest derivative",
            "result": "$y'$",
            "why": "only first derivative appears"
          },
          {
            "do": "State ODE status",
            "result": "ordinary",
            "why": "one independent variable is implied"
          },
          {
            "do": "Look at the dependent variable",
            "result": "$y^2$",
            "why": "the unknown is squared"
          },
          {
            "do": "Compare with linear form",
            "result": "not $y'+p(x)y=q(x)$",
            "why": "linear equations cannot contain $y^2$"
          },
          {
            "do": "Classify",
            "result": "first-order nonlinear ODE",
            "why": "first derivative and nonlinear dependent variable term"
          }
        ],
        "answer": "First-order nonlinear ODE."
      },
      {
        "problem": "Classify $\\dfrac{\\partial u}{\\partial t}=4\\dfrac{\\partial^2u}{\\partial x^2}$.",
        "steps": [
          {
            "do": "Notice the derivative symbols",
            "result": "$\\partial$ derivatives",
            "why": "partial derivatives indicate multiple independent variables"
          },
          {
            "do": "List the variables",
            "result": "$t$ and $x$",
            "why": "the unknown $u$ depends on more than one variable"
          },
          {
            "do": "Find the highest derivative",
            "result": "$\\partial^2u/\\partial x^2$",
            "why": "second derivative appears"
          },
          {
            "do": "Check linearity",
            "result": "linear",
            "why": "$u$ and its derivatives are not squared or multiplied together"
          },
          {
            "do": "Classify",
            "result": "second-order linear PDE",
            "why": "partial, second order, linear"
          }
        ],
        "answer": "Second-order linear PDE."
      },
      {
        "problem": "Classify the system $x'=2x-y$, $y'=x+3y$.",
        "steps": [
          {
            "do": "Count unknown functions",
            "result": "two: $x(t)$ and $y(t)$",
            "why": "there are two dependent variables"
          },
          {
            "do": "Find the highest derivatives",
            "result": "$x'$ and $y'$",
            "why": "only first derivatives appear"
          },
          {
            "do": "State system status",
            "result": "system of ODEs",
            "why": "multiple unknown functions are coupled"
          },
          {
            "do": "Check linearity",
            "result": "linear",
            "why": "unknowns appear to the first power"
          },
          {
            "do": "Name the class",
            "result": "first-order linear system",
            "why": "the system is first order and linear"
          }
        ],
        "answer": "A first-order linear system of ODEs."
      },
      {
        "problem": "Classify $y''+y y'=0$ and explain why the product matters.",
        "steps": [
          {
            "do": "Find the highest derivative",
            "result": "$y''$",
            "why": "second derivative appears"
          },
          {
            "do": "State the order",
            "result": "second order",
            "why": "highest derivative is second"
          },
          {
            "do": "Identify equation type",
            "result": "ODE",
            "why": "ordinary derivatives are used"
          },
          {
            "do": "Locate the product",
            "result": "$y y'$",
            "why": "dependent variable and derivative are multiplied"
          },
          {
            "do": "Classify linearity",
            "result": "nonlinear",
            "why": "linear equations cannot multiply unknown functions or derivatives"
          }
        ],
        "answer": "Second-order nonlinear ODE."
      }
    ],
    "applications": [
      {
        "title": "Solver selection",
        "background": "Numerical libraries ask for classification because different algorithms fit different structures.",
        "numbers": "A first-order system with $100$ unknowns stores a state vector of length $100$; a scalar first-order ODE stores one value."
      },
      {
        "title": "Physics models",
        "background": "Newton's law usually produces second-order ODEs because acceleration is a second derivative of position.",
        "numbers": "If $x''=-9.8$, the order is $2$ and integrating twice introduces two constants."
      },
      {
        "title": "Heat diffusion",
        "background": "The heat equation is a PDE because temperature depends on both time and position.",
        "numbers": "In $u_t=0.01u_{xx}$, time derivative order is $1$ and space derivative order is $2$."
      },
      {
        "title": "Neural network dynamics",
        "background": "Continuous-depth models often use first-order systems for hidden vectors.",
        "numbers": "A hidden state with $64$ coordinates gives $64$ coupled equations $h_i'=f_i(h,t)$."
      },
      {
        "title": "Epidemic modeling",
        "background": "Many compartment models are nonlinear systems because populations multiply in contact terms.",
        "numbers": "The term $\\beta SI$ is nonlinear; with $S=900$, $I=10$, $\\beta=0.0002$, new infection rate is $1.8$ per day."
      },
      {
        "title": "Control engineering",
        "background": "Linear first-order equations are easier to stabilize and analyze than nonlinear ones.",
        "numbers": "For $y'+5y=u(t)$, the coefficient $5$ gives a time constant $1/5=0.2$ seconds."
      }
    ],
    "applicationsClose": "Classification is not bureaucracy; it is the first act of understanding what kind of change law you have.",
    "takeaways": [
      "Order is the highest derivative present.",
      "ODEs use ordinary derivatives; PDEs use partial derivatives.",
      "Linear equations keep the unknown function and derivatives to first power with no products.",
      "Systems track several unknown functions at once."
    ]
  },
  "math-03-03": {
    "id": "math-03-03",
    "title": "Solutions and initial conditions",
    "tagline": "A differential equation gives a family; an initial condition chooses the member that actually starts here.",
    "connections": {
      "buildsOn": [
        "What is a differential equation?",
        "Classifying differential equations",
        "antiderivatives"
      ],
      "leadsTo": [
        "Direction fields",
        "Separable equations",
        "existence and uniqueness"
      ],
      "usedWith": [
        "families of curves",
        "constants of integration",
        "initial value problems"
      ]
    },
    "motivation": "<p>When you integrate $y'=2x$, you get $y=x^2+C$. That little $C$ is not clutter; it says many curves share the same slope rule.</p><p>An <b>initial condition</b> gives the missing anchor point. It tells the solution where to pass, turning a family of possible paths into one specific path. This is how a model becomes a prediction instead of a cloud of possibilities.</p>",
    "definition": "<p>A <b>solution</b> of a differential equation on an interval is a function that has the required derivatives on that interval and makes the equation true at every point there. An <b>initial value problem</b> combines a differential equation with data such as $y(x_0)=y_0$, meaning the solution must pass through $(x_0,y_0)$.</p><p>The constant is found by substitution. If $y=x^2+C$ and $y(1)=5$, then $5=1+C$, so $C=4$. The derivative law gives shape; the initial condition fixes location.</p><p><b>Assumptions that matter:</b> the proposed solution must satisfy the equation on an interval, not only at one point; the initial point must lie in that interval; and formulas with denominators or logarithms may restrict where the solution is valid.</p>",
    "worked": {
      "problem": "Find the solution of $y'=-2y$ satisfying $y(0)=7$, given the general solution $y=Ce^{-2x}$.",
      "skills": [
        "solution families",
        "initial conditions",
        "exponential decay"
      ],
      "strategy": "The family already solves the derivative law — plug in the starting point to identify $C$.",
      "steps": [
        {
          "do": "Start with the solution family",
          "result": "$y=Ce^{-2x}$",
          "why": "every value of $C$ satisfies the differential equation"
        },
        {
          "do": "Apply $y(0)=7$",
          "result": "$7=Ce^0$",
          "why": "substitute $x=0$ and $y=7$"
        },
        {
          "do": "Simplify the exponential",
          "result": "$7=C$",
          "why": "$e^0=1$"
        },
        {
          "do": "Write the particular solution",
          "result": "$y=7e^{-2x}$",
          "why": "replace $C$ by the value selected by the initial condition"
        },
        {
          "do": "Evaluate one future value",
          "result": "$y(1)=7e^{-2}\\approx0.947$",
          "why": "the chosen curve now makes concrete predictions"
        }
      ],
      "verify": "Differentiating gives $y'=-14e^{-2x}$, and $-2y=-14e^{-2x}$; the initial value is $7$.",
      "answer": "$y=7e^{-2x}$.",
      "connects": "Initial conditions turn a general solution into a particular solution."
    },
    "practice": [
      {
        "problem": "For $y'=5$ and $y(2)=9$, find $y(x)$.",
        "steps": [
          {
            "do": "Integrate the derivative",
            "result": "$y=5x+C$",
            "why": "constant slope integrates to a line"
          },
          {
            "do": "Substitute $x=2$ and $y=9$",
            "result": "$9=10+C$",
            "why": "use the initial point"
          },
          {
            "do": "Solve for $C$",
            "result": "$C=-1$",
            "why": "subtract 10"
          },
          {
            "do": "Write the solution",
            "result": "$y=5x-1$",
            "why": "the constant is fixed"
          },
          {
            "do": "Check at $x=2$",
            "result": "$y(2)=9$",
            "why": "$10-1=9$"
          }
        ],
        "answer": "$y=5x-1$."
      },
      {
        "problem": "For $y'=x^2$ and $y(0)=-3$, find $y(x)$.",
        "steps": [
          {
            "do": "Integrate",
            "result": "$y=\\dfrac{x^3}{3}+C$",
            "why": "reverse the power rule"
          },
          {
            "do": "Apply the initial condition",
            "result": "$-3=0+C$",
            "why": "substitute $x=0$"
          },
          {
            "do": "Solve for the constant",
            "result": "$C=-3$",
            "why": "the initial value equals the constant here"
          },
          {
            "do": "Write the solution",
            "result": "$y=\\dfrac{x^3}{3}-3$",
            "why": "particular solution"
          },
          {
            "do": "Differentiate to check",
            "result": "$y'=x^2$",
            "why": "the equation is satisfied"
          }
        ],
        "answer": "$y=\\dfrac{x^3}{3}-3$."
      },
      {
        "problem": "Show that $y=2/(x+C)$ solves $y'=-\\tfrac12y^2$, then use $y(0)=1$.",
        "steps": [
          {
            "do": "Differentiate $y=2/(x+C)$",
            "result": "$y'=-\\dfrac{2}{(x+C)^2}$",
            "why": "power rule on $(x+C)^{-1}$"
          },
          {
            "do": "Compute $-\\tfrac12y^2$",
            "result": "$-\\tfrac12\\cdot\\dfrac{4}{(x+C)^2}=-\\dfrac{2}{(x+C)^2}$",
            "why": "substitute $y$"
          },
          {
            "do": "Apply $y(0)=1$",
            "result": "$1=2/C$",
            "why": "use the initial point"
          },
          {
            "do": "Solve for $C$",
            "result": "$C=2$",
            "why": "multiply by $C$"
          },
          {
            "do": "Write the solution",
            "result": "$y=\\dfrac{2}{x+2}$",
            "why": "the chosen curve passes through $(0,1)$"
          }
        ],
        "answer": "$y=2/(x+2)$ on intervals not crossing $x=-2$."
      },
      {
        "problem": "A temperature model has $T(t)=20+Ce^{-0.1t}$ and $T(0)=80$. Find $T(10)$.",
        "steps": [
          {
            "do": "Apply the initial value",
            "result": "$80=20+C$",
            "why": "$e^0=1$"
          },
          {
            "do": "Solve for $C$",
            "result": "$C=60$",
            "why": "subtract 20"
          },
          {
            "do": "Write the model",
            "result": "$T(t)=20+60e^{-0.1t}$",
            "why": "particular solution"
          },
          {
            "do": "Substitute $t=10$",
            "result": "$T(10)=20+60e^{-1}$",
            "why": "$0.1\\cdot10=1$"
          },
          {
            "do": "Approximate",
            "result": "$T(10)\\approx42.07$",
            "why": "$60e^{-1}\\approx22.07$"
          }
        ],
        "answer": "$T(10)\\approx42.07^\\circ$C."
      },
      {
        "problem": "For $h'=0.3h$ and $h(0)=4$, find the value at $t=5$.",
        "steps": [
          {
            "do": "Use the exponential solution form",
            "result": "$h=Ce^{0.3t}$",
            "why": "growth proportional to current value"
          },
          {
            "do": "Apply $h(0)=4$",
            "result": "$4=C$",
            "why": "$e^0=1$"
          },
          {
            "do": "Write the particular solution",
            "result": "$h=4e^{0.3t}$",
            "why": "initial condition fixes scale"
          },
          {
            "do": "Substitute $t=5$",
            "result": "$h(5)=4e^{1.5}$",
            "why": "$0.3\\cdot5=1.5$"
          },
          {
            "do": "Approximate",
            "result": "$h(5)\\approx17.93$",
            "why": "$e^{1.5}\\approx4.482$"
          }
        ],
        "answer": "$h(5)\\approx17.93$."
      }
    ],
    "applications": [
      {
        "title": "Forecast initialization",
        "background": "Weather and simulation models need starting measurements because rate laws alone do not say where the system begins.",
        "numbers": "If $T'=0.1T$, then starts $T(0)=10$ and $T(0)=20$ give $10e^{0.1t}$ and $20e^{0.1t}$, twice apart forever."
      },
      {
        "title": "Checkpointed training",
        "background": "Optimizer dynamics depend on the current weights; resuming from a checkpoint is an initial condition.",
        "numbers": "For toy $w'=-0.5w$, starting at $w(0)=8$ gives $w(4)=8e^{-2}\\approx1.08$."
      },
      {
        "title": "Battery discharge",
        "background": "A circuit law gives the rate, while the measured voltage gives the starting constant.",
        "numbers": "If $V=Ce^{-t/5}$ and $V(0)=12$, then $V(10)=12e^{-2}\\approx1.62$ volts."
      },
      {
        "title": "Epidemic projections",
        "background": "The same infection-rate equation predicts different futures from different initial case counts.",
        "numbers": "With $I'=0.2I$, $I(0)=50$ gives $I(7)=50e^{1.4}\\approx203$."
      },
      {
        "title": "Personalization state",
        "background": "Recommendation systems update user embeddings over time; the current embedding anchors the trajectory.",
        "numbers": "For one coordinate $z'=-z$, $z(0)=0.6$ gives $z(2)=0.6e^{-2}\\approx0.081$."
      },
      {
        "title": "Robotics pose",
        "background": "A velocity field needs the robot's starting pose before it can produce a path.",
        "numbers": "If $x'(t)=2$ and $x(0)=5$, then $x(3)=11$ meters, not $6$ meters."
      }
    ],
    "applicationsClose": "Initial conditions are the bridge from a general law of motion to one actual story.",
    "takeaways": [
      "A solution must satisfy the differential equation on an interval.",
      "A general solution usually contains constants.",
      "An initial condition selects a particular solution.",
      "The interval of validity matters when formulas can break."
    ]
  },
  "math-03-04": {
    "id": "math-03-04",
    "title": "Direction fields",
    "tagline": "A direction field lets you see the solution family before you can solve the equation.",
    "connections": {
      "buildsOn": [
        "Solutions and initial conditions",
        "slopes of curves",
        "graphs"
      ],
      "leadsTo": [
        "Separable equations",
        "Linear first-order equations",
        "qualitative analysis"
      ],
      "usedWith": [
        "tangent lines",
        "phase lines",
        "numerical Euler steps"
      ]
    },
    "motivation": "<p>You know that a derivative is the slope of a tangent line. A direction field simply draws that slope at many points in the plane.</p><p>For an equation like $y'=x-y$, every point $(x,y)$ receives a little line segment with slope $x-y$. A solution curve is a path that threads through those little segments, always matching the local direction.</p>",
    "definition": "<p>For a first-order ODE $y'=f(x,y)$, a <b>direction field</b> assigns to each point $(x,y)$ a short segment with slope $f(x,y)$. If a solution passes through $(x_0,y_0)$, its tangent slope there must be $f(x_0,y_0)$.</p><p>The construction is direct: choose grid points, compute $f(x,y)$ at each one, and draw a small line with that slope. Points where $f(x,y)=0$ have horizontal segments, which often reveal equilibrium or turning behavior.</p><p><b>Assumptions that matter:</b> the field shows local slope, not step size; it is qualitative unless paired with numerical values; and if $f$ is undefined at a point, the field is not defined there.</p>",
    "worked": {
      "problem": "For $y'=x-y$, compute the direction-field slopes at $(0,0)$, $(1,0)$, $(1,2)$, and $(2,2)$.",
      "skills": [
        "slope evaluation",
        "direction fields",
        "qualitative reading"
      ],
      "strategy": "Plug each point into $f(x,y)=x-y$ — each result is a tangent slope.",
      "steps": [
        {
          "do": "Evaluate at $(0,0)$",
          "result": "$0-0=0$",
          "why": "substitute $x=0$ and $y=0$"
        },
        {
          "do": "Evaluate at $(1,0)$",
          "result": "$1-0=1$",
          "why": "the segment rises one unit per unit right"
        },
        {
          "do": "Evaluate at $(1,2)$",
          "result": "$1-2=-1$",
          "why": "the segment slopes downward"
        },
        {
          "do": "Evaluate at $(2,2)$",
          "result": "$2-2=0$",
          "why": "equal $x$ and $y$ give a horizontal segment"
        },
        {
          "do": "Identify the zero-slope line",
          "result": "$y=x$",
          "why": "$x-y=0$ when $y=x$"
        }
      ],
      "verify": "The signs make sense: below the line $y=x$, slopes are positive; above it, slopes are negative.",
      "answer": "Slopes are $0,1,-1,0$, and zero slopes occur along $y=x$.",
      "connects": "Direction fields turn the right side of an ODE into visible local tangent information."
    },
    "practice": [
      {
        "problem": "For $y'=y$, find slopes at $y=-2,0,3$.",
        "steps": [
          {
            "do": "Use the slope rule",
            "result": "$f(x,y)=y$",
            "why": "slope depends only on height"
          },
          {
            "do": "Evaluate at $y=-2$",
            "result": "$-2$",
            "why": "negative height gives negative slope"
          },
          {
            "do": "Evaluate at $y=0$",
            "result": "$0$",
            "why": "the $x$-axis is horizontal"
          },
          {
            "do": "Evaluate at $y=3$",
            "result": "$3$",
            "why": "higher positive values rise faster"
          },
          {
            "do": "Read the pattern",
            "result": "slopes are constant along horizontal rows",
            "why": "$x$ does not appear"
          }
        ],
        "answer": "The slopes are $-2$, $0$, and $3$."
      },
      {
        "problem": "For $y'=1-y$, locate the horizontal segments and decide slopes above and below them.",
        "steps": [
          {
            "do": "Set the slope to zero",
            "result": "$1-y=0$",
            "why": "horizontal segments have zero slope"
          },
          {
            "do": "Solve for $y$",
            "result": "$y=1$",
            "why": "equilibrium height"
          },
          {
            "do": "Test below with $y=0$",
            "result": "$1-0=1$",
            "why": "below the line slopes upward"
          },
          {
            "do": "Test above with $y=2$",
            "result": "$1-2=-1$",
            "why": "above the line slopes downward"
          },
          {
            "do": "Interpret",
            "result": "solutions are pulled toward $y=1$",
            "why": "slopes point upward below and downward above"
          }
        ],
        "answer": "Horizontal at $y=1$; solutions move toward that line."
      },
      {
        "problem": "For $y'=x+y$, compute slopes at $(-1,1)$, $(0,1)$, and $(2,-1)$.",
        "steps": [
          {
            "do": "Evaluate at $(-1,1)$",
            "result": "$-1+1=0$",
            "why": "substitute into $x+y$"
          },
          {
            "do": "Evaluate at $(0,1)$",
            "result": "$1$",
            "why": "$0+1=1$"
          },
          {
            "do": "Evaluate at $(2,-1)$",
            "result": "$1$",
            "why": "$2-1=1$"
          },
          {
            "do": "Find a zero-slope line",
            "result": "$x+y=0$",
            "why": "solve the slope equation"
          },
          {
            "do": "Rewrite the line",
            "result": "$y=-x$",
            "why": "use graph form"
          }
        ],
        "answer": "Slopes are $0,1,1$; zero slopes occur on $y=-x$."
      },
      {
        "problem": "Use one Euler step of size $0.5$ for $y'=x-y$ from $(0,1)$.",
        "steps": [
          {
            "do": "Compute the starting slope",
            "result": "$0-1=-1$",
            "why": "direction field slope at $(0,1)$"
          },
          {
            "do": "Multiply by step size",
            "result": "$0.5(-1)=-0.5$",
            "why": "Euler change is $h\\cdot$ slope"
          },
          {
            "do": "Update $x$",
            "result": "$x_1=0.5$",
            "why": "move one step to the right"
          },
          {
            "do": "Update $y$",
            "result": "$y_1=1-0.5=0.5$",
            "why": "add the estimated change"
          },
          {
            "do": "State the new point",
            "result": "$(0.5,0.5)$",
            "why": "the path follows the local segment"
          }
        ],
        "answer": "One Euler step gives approximately $(0.5,0.5)$."
      },
      {
        "problem": "For $y'=y(2-y)$, find equilibrium heights and classify slope signs between them.",
        "steps": [
          {
            "do": "Set the slope to zero",
            "result": "$y(2-y)=0$",
            "why": "equilibria have horizontal field segments"
          },
          {
            "do": "Solve for $y$",
            "result": "$y=0$ or $y=2$",
            "why": "zero product property"
          },
          {
            "do": "Test $y=-1$",
            "result": "$(-1)(3)<0$",
            "why": "slopes are negative below $0$"
          },
          {
            "do": "Test $y=1$",
            "result": "$1(1)>0$",
            "why": "slopes are positive between $0$ and $2$"
          },
          {
            "do": "Test $y=3$",
            "result": "$3(-1)<0$",
            "why": "slopes are negative above $2$"
          }
        ],
        "answer": "Equilibria are $y=0$ and $y=2$; signs are negative, positive, negative."
      }
    ],
    "applications": [
      {
        "title": "Numerical solvers",
        "background": "Euler and Runge-Kutta methods follow the same slopes that a direction field displays.",
        "numbers": "For $y'=x-y$ at $(0,1)$ with $h=0.1$, the first Euler change is $-0.1$."
      },
      {
        "title": "Population equilibria",
        "background": "Direction fields show whether populations grow or shrink around carrying capacity.",
        "numbers": "For $P'=0.2P(1-P/1000)$, $P=500$ gives slope $50$ per time unit and $P=1200$ gives $-48$."
      },
      {
        "title": "Training dynamics",
        "background": "Gradient flow fields show where parameters move under continuous optimization.",
        "numbers": "For $w'=-2w$, slopes are $-4,0,4$ at $w=2,0,-2$, all pointing toward $0$."
      },
      {
        "title": "Control stability",
        "background": "Engineers read slope fields to see whether a system returns to a target after disturbance.",
        "numbers": "For $y'=5-y$, slopes are $2$ at $y=3$ and $-2$ at $y=7$, pointing to $5$."
      },
      {
        "title": "Epidemic thresholds",
        "background": "A direction field can reveal whether cases rise or fall at different infection levels.",
        "numbers": "With $I'=0.1I(1-I/200)$, $I=50$ gives $3.75$ and $I=250$ gives $-6.25$."
      },
      {
        "title": "Serving queues",
        "background": "Backlog dynamics can be sketched before solving exact formulas.",
        "numbers": "If $Q'=80-0.5Q$, then slope is $30$ at $Q=100$ and $-20$ at $Q=200$, so the balance is $Q=160$."
      }
    ],
    "applicationsClose": "A direction field is a map of local advice: every little segment says, if the solution passes here, it must point this way.",
    "takeaways": [
      "For $y'=f(x,y)$, compute slopes by plugging points into $f$.",
      "Horizontal segments occur where $f(x,y)=0$.",
      "Solution curves follow the local line segments.",
      "Direction fields support qualitative thinking and numerical methods."
    ]
  },
  "math-03-05": {
    "id": "math-03-05",
    "title": "Separable equations",
    "tagline": "A separable equation lets each variable return to its own side before we integrate.",
    "connections": {
      "buildsOn": [
        "Direction fields",
        "antiderivatives",
        "initial conditions"
      ],
      "leadsTo": [
        "Linear first-order equations",
        "Modeling with first-order ODEs",
        "existence and uniqueness"
      ],
      "usedWith": [
        "logarithms",
        "exponential functions",
        "partial fractions"
      ]
    },
    "motivation": "<p>Some differential equations look tangled but have a generous structure: all the $y$ pieces can move to one side, and all the $x$ pieces to the other.</p><p>That is the separable idea. We separate, integrate both sides, then use an initial condition if one is given. It is one of the friendliest first real solving methods for ODEs.</p>",
    "definition": "<p>A first-order ODE is <b>separable</b> if it can be written $\\dfrac{dy}{dx}=g(x)h(y)$. Where $h(y)\\ne0$, we rewrite it as $\\dfrac{1}{h(y)}\\,dy=g(x)\\,dx$ and integrate both sides.</p><p>The method is justified by the chain rule. Since $dy/dx$ measures how $y$ changes with $x$, multiplying by $dx$ is shorthand for arranging the differential relationship so each side has one variable before integration.</p><p><b>Assumptions that matter:</b> dividing by $h(y)$ can temporarily lose constant solutions where $h(y)=0$; logarithms require absolute values when integrating $1/y$; and the final solution may be implicit if solving for $y$ is hard.</p>",
    "worked": {
      "problem": "Solve $\\dfrac{dy}{dx}=xy$ with $y(0)=2$.",
      "skills": [
        "separation",
        "logarithms",
        "initial values"
      ],
      "strategy": "Move $y$ away from $x$, integrate, then exponentiate and use the initial value.",
      "steps": [
        {
          "do": "Separate variables",
          "result": "$\\dfrac{1}{y}\\,dy=x\\,dx$",
          "why": "put all $y$ terms on one side and $x$ terms on the other"
        },
        {
          "do": "Integrate both sides",
          "result": "$\\ln|y|=\\dfrac{x^2}{2}+C$",
          "why": "$\\int 1/y\\,dy=\\ln|y|$"
        },
        {
          "do": "Exponentiate",
          "result": "$y=Ae^{x^2/2}$",
          "why": "the signed constant is absorbed into $A$"
        },
        {
          "do": "Apply $y(0)=2$",
          "result": "$2=Ae^0$",
          "why": "the initial condition fixes the scale"
        },
        {
          "do": "Solve for $A$",
          "result": "$A=2$",
          "why": "$e^0=1$"
        }
      ],
      "verify": "Differentiating $2e^{x^2/2}$ gives $2xe^{x^2/2}=xy$, and $y(0)=2$.",
      "answer": "$y=2e^{x^2/2}$.",
      "connects": "Separation works because product structure lets each variable be integrated in its own lane."
    },
    "practice": [
      {
        "problem": "Solve $y'=3y$ with $y(0)=4$.",
        "steps": [
          {
            "do": "Separate",
            "result": "$\\dfrac{1}{y}\\,dy=3\\,dx$",
            "why": "move $y$ to the left"
          },
          {
            "do": "Integrate",
            "result": "$\\ln|y|=3x+C$",
            "why": "integrate both sides"
          },
          {
            "do": "Exponentiate",
            "result": "$y=Ae^{3x}$",
            "why": "absorb sign into $A$"
          },
          {
            "do": "Apply $y(0)=4$",
            "result": "$4=A$",
            "why": "$e^0=1$"
          },
          {
            "do": "Write solution",
            "result": "$y=4e^{3x}$",
            "why": "particular solution"
          }
        ],
        "answer": "$y=4e^{3x}$."
      },
      {
        "problem": "Solve $y'=x(1+y^2)$ with $y(0)=0$.",
        "steps": [
          {
            "do": "Separate",
            "result": "$\\dfrac{1}{1+y^2}\\,dy=x\\,dx$",
            "why": "all $y$ terms move left"
          },
          {
            "do": "Integrate",
            "result": "$\\arctan y=\\dfrac{x^2}{2}+C$",
            "why": "antiderivative of $1/(1+y^2)$"
          },
          {
            "do": "Apply $y(0)=0$",
            "result": "$0=C$",
            "why": "$\\arctan0=0$"
          },
          {
            "do": "Take tangent",
            "result": "$y=\\tan(x^2/2)$",
            "why": "undo arctangent"
          },
          {
            "do": "Name interval caution",
            "result": "valid before tangent blows up",
            "why": "solutions have interval limits"
          }
        ],
        "answer": "$y=\\tan(x^2/2)$ on an interval around $0$."
      },
      {
        "problem": "Solve $y'=2x(y+1)$ with $y(0)=3$.",
        "steps": [
          {
            "do": "Separate",
            "result": "$\\dfrac{1}{y+1}\\,dy=2x\\,dx$",
            "why": "move the dependent factor left"
          },
          {
            "do": "Integrate",
            "result": "$\\ln|y+1|=x^2+C$",
            "why": "left side is a log"
          },
          {
            "do": "Exponentiate",
            "result": "$y+1=Ae^{x^2}$",
            "why": "convert from log form"
          },
          {
            "do": "Apply $y(0)=3$",
            "result": "$4=A$",
            "why": "$3+1=4$"
          },
          {
            "do": "Solve for $y$",
            "result": "$y=4e^{x^2}-1$",
            "why": "subtract 1"
          }
        ],
        "answer": "$y=4e^{x^2}-1$."
      },
      {
        "problem": "Find the constant solution that can be missed when separating $y'=y(y-5)$.",
        "steps": [
          {
            "do": "Set the right side to zero",
            "result": "$y(y-5)=0$",
            "why": "constant solutions have $y'=0$"
          },
          {
            "do": "Solve the product",
            "result": "$y=0$ or $y=5$",
            "why": "zero product property"
          },
          {
            "do": "Notice the division risk",
            "result": "dividing by $y(y-5)$ would exclude these",
            "why": "separation may divide by zero factors"
          },
          {
            "do": "Check $y=0$",
            "result": "$0'=0( -5)=0$",
            "why": "it satisfies the equation"
          },
          {
            "do": "Check $y=5$",
            "result": "$5'=5(0)=0$",
            "why": "it also satisfies the equation"
          }
        ],
        "answer": "Constant solutions are $y=0$ and $y=5$."
      },
      {
        "problem": "A feature norm follows $r'=-0.4r$ with $r(0)=10$. Find when $r=2$.",
        "steps": [
          {
            "do": "Solve by separation",
            "result": "$r=10e^{-0.4t}$",
            "why": "proportional decay gives exponential decay"
          },
          {
            "do": "Set the target value",
            "result": "$2=10e^{-0.4t}$",
            "why": "find the hitting time"
          },
          {
            "do": "Divide by 10",
            "result": "$0.2=e^{-0.4t}$",
            "why": "isolate the exponential"
          },
          {
            "do": "Take natural logs",
            "result": "$\\ln0.2=-0.4t$",
            "why": "log undoes exponential"
          },
          {
            "do": "Solve",
            "result": "$t=\\dfrac{-\\ln0.2}{0.4}\\approx4.02$",
            "why": "$-\\ln0.2\\approx1.609$"
          }
        ],
        "answer": "The norm reaches $2$ at about $4.02$ time units."
      }
    ],
    "applications": [
      {
        "title": "Exponential growth",
        "background": "Growth proportional to current size is the classic separable model.",
        "numbers": "If $P'=0.3P$ and $P(0)=100$, then $P(5)=100e^{1.5}\\approx448$."
      },
      {
        "title": "Radioactive decay",
        "background": "Constant percentage decay separates because the rate is proportional to amount remaining.",
        "numbers": "With $A'=-0.02A$, half-life solves $0.5=e^{-0.02t}$, so $t\\approx34.66$."
      },
      {
        "title": "Logistic population",
        "background": "The logistic equation adds a carrying-capacity factor and is still separable.",
        "numbers": "For $P'=0.1P(1-P/1000)$, at $P=200$ the growth rate is $16$ per time unit."
      },
      {
        "title": "Gradient flow",
        "background": "Quadratic loss gives separable weight dynamics.",
        "numbers": "For $w'=-0.5w$, $w(6)=w(0)e^{-3}$, so $20$ shrinks to about $0.996$."
      },
      {
        "title": "Cooling toward ambient",
        "background": "Newton cooling separates after subtracting ambient temperature.",
        "numbers": "If $T'= -0.1(T-20)$ and $T(0)=70$, then $T(10)=20+50e^{-1}\\approx38.39$."
      },
      {
        "title": "Attention score decay",
        "background": "Toy continuous memory decay often uses proportional rate laws.",
        "numbers": "A score $s'= -0.7s$ with $s(0)=1$ gives $s(3)=e^{-2.1}\\approx0.122$."
      }
    ],
    "applicationsClose": "Separation is a disciplined untangling: one variable per side, one integral per side, then the initial condition brings the curve home.",
    "takeaways": [
      "Separable equations have the form $y'=g(x)h(y)$.",
      "Move $y$ terms with $dy$ and $x$ terms with $dx$, then integrate.",
      "Watch for constant solutions lost by division.",
      "Many growth, decay, and saturation models are separable."
    ]
  },
  "math-03-06": {
    "id": "math-03-06",
    "title": "Linear first-order equations",
    "tagline": "A linear first-order equation mixes the unknown and its derivative in the gentlest possible way.",
    "connections": {
      "buildsOn": [
        "Separable equations",
        "Classifying differential equations",
        "exponential functions"
      ],
      "leadsTo": [
        "Integrating factors",
        "Exact equations",
        "modeling with first-order ODEs"
      ],
      "usedWith": [
        "standard form",
        "superposition",
        "exponential decay"
      ]
    },
    "motivation": "<p>Not every equation separates. A term like $y'+2y=6$ ties the function and derivative together, but it does so linearly, which is still wonderfully structured.</p><p>Linear first-order equations describe relaxation toward a target: temperature toward a room, voltage toward a source, weights toward a regularized optimum. The equation says the rate plus a scaled amount balances an input.</p>",
    "definition": "<p>A <b>linear first-order ODE</b> can be written in standard form $y'+p(x)y=q(x)$. The coefficient $p(x)$ multiplies $y$, and $q(x)$ is a forcing term depending only on the independent variable.</p><p>For constant coefficients, $y'+ay=b$ has equilibrium $y=b/a$ when $a\\ne0$. Subtracting the equilibrium gives $u'= -a u$, so solutions relax exponentially: $y=b/a+Ce^{-ax}$.</p><p><b>Assumptions that matter:</b> the equation must be solved on intervals where $p$ and $q$ are continuous; nonlinear terms like $y^2$ do not belong; and standard form requires the coefficient of $y'$ to be $1$.</p>",
    "worked": {
      "problem": "Solve $y'+2y=6$ with $y(0)=1$.",
      "skills": [
        "standard form",
        "equilibrium",
        "initial values"
      ],
      "strategy": "Find the equilibrium first, then solve the exponential deviation from it.",
      "steps": [
        {
          "do": "Find the equilibrium",
          "result": "$2y=6$",
          "why": "at equilibrium the derivative is zero"
        },
        {
          "do": "Solve for equilibrium",
          "result": "$y=3$",
          "why": "divide by 2"
        },
        {
          "do": "Write the general form",
          "result": "$y=3+Ce^{-2x}$",
          "why": "deviations from equilibrium decay with rate 2"
        },
        {
          "do": "Apply $y(0)=1$",
          "result": "$1=3+C$",
          "why": "use the initial value"
        },
        {
          "do": "Solve for $C$",
          "result": "$C=-2$",
          "why": "subtract 3"
        }
      ],
      "verify": "Substitution gives $y'=4e^{-2x}$ and $2y=6-4e^{-2x}$, so $y'+2y=6$.",
      "answer": "$y=3-2e^{-2x}$.",
      "connects": "Linear equations often describe exponential approach to a balance value."
    },
    "practice": [
      {
        "problem": "Put $3y'+6y=12$ in standard form and solve $y(0)=5$.",
        "steps": [
          {
            "do": "Divide by 3",
            "result": "$y'+2y=4$",
            "why": "standard form has coefficient 1 on $y'$"
          },
          {
            "do": "Find equilibrium",
            "result": "$2y=4$, so $y=2$",
            "why": "set derivative to zero"
          },
          {
            "do": "Write general solution",
            "result": "$y=2+Ce^{-2x}$",
            "why": "constant-coefficient relaxation"
          },
          {
            "do": "Apply $y(0)=5$",
            "result": "$5=2+C$",
            "why": "initial value"
          },
          {
            "do": "Solve",
            "result": "$C=3$",
            "why": "subtract 2"
          }
        ],
        "answer": "$y=2+3e^{-2x}$."
      },
      {
        "problem": "Solve $y'-4y=0$ with $y(0)=2$.",
        "steps": [
          {
            "do": "Rewrite the equation",
            "result": "$y'=4y$",
            "why": "isolate the derivative"
          },
          {
            "do": "Use exponential form",
            "result": "$y=Ce^{4x}$",
            "why": "growth proportional to $y$"
          },
          {
            "do": "Apply $y(0)=2$",
            "result": "$2=C$",
            "why": "$e^0=1$"
          },
          {
            "do": "Write solution",
            "result": "$y=2e^{4x}$",
            "why": "particular solution"
          },
          {
            "do": "Check derivative",
            "result": "$y'=8e^{4x}=4y$",
            "why": "the equation holds"
          }
        ],
        "answer": "$y=2e^{4x}$."
      },
      {
        "problem": "For $y'+0.5y=10$, find the equilibrium and solution with $y(0)=0$.",
        "steps": [
          {
            "do": "Set $y'=0$",
            "result": "$0.5y=10$",
            "why": "equilibrium has no change"
          },
          {
            "do": "Solve equilibrium",
            "result": "$y=20$",
            "why": "divide by 0.5"
          },
          {
            "do": "Write solution form",
            "result": "$y=20+Ce^{-0.5x}$",
            "why": "deviation decays at rate 0.5"
          },
          {
            "do": "Apply $y(0)=0$",
            "result": "$0=20+C$",
            "why": "initial condition"
          },
          {
            "do": "Solve for $C$",
            "result": "$C=-20$",
            "why": "subtract 20"
          }
        ],
        "answer": "$y=20-20e^{-0.5x}$."
      },
      {
        "problem": "Decide whether $y'+xy=x^2$ is linear and identify $p(x),q(x)$.",
        "steps": [
          {
            "do": "Compare with standard form",
            "result": "$y'+p(x)y=q(x)$",
            "why": "definition of first-order linear"
          },
          {
            "do": "Read the coefficient of $y$",
            "result": "$p(x)=x$",
            "why": "$x$ multiplies $y$"
          },
          {
            "do": "Read the forcing term",
            "result": "$q(x)=x^2$",
            "why": "right side depends only on $x$"
          },
          {
            "do": "Check for nonlinear terms",
            "result": "none",
            "why": "no $y^2$, $yy'$, or $\\sin y$"
          },
          {
            "do": "Classify",
            "result": "linear first-order",
            "why": "it matches standard form"
          }
        ],
        "answer": "It is linear with $p(x)=x$ and $q(x)=x^2$."
      },
      {
        "problem": "A smoothed metric satisfies $m'+4m=4s$ with constant signal $s=0.8$ and $m(0)=0.2$. Find $m(t)$.",
        "steps": [
          {
            "do": "Substitute the signal",
            "result": "$m'+4m=3.2$",
            "why": "$4s=3.2$"
          },
          {
            "do": "Find equilibrium",
            "result": "$m=0.8$",
            "why": "$4m=3.2$"
          },
          {
            "do": "Write solution form",
            "result": "$m=0.8+Ce^{-4t}$",
            "why": "linear relaxation"
          },
          {
            "do": "Apply $m(0)=0.2$",
            "result": "$0.2=0.8+C$",
            "why": "starting value"
          },
          {
            "do": "Solve for $C$",
            "result": "$C=-0.6$",
            "why": "subtract 0.8"
          }
        ],
        "answer": "$m(t)=0.8-0.6e^{-4t}$."
      }
    ],
    "applications": [
      {
        "title": "Newton cooling",
        "background": "Cooling toward ambient temperature is linear after the ambient value is included.",
        "numbers": "If $T'+0.2T=4$, equilibrium is $20$ and $T(0)=80$ gives $T=20+60e^{-0.2t}$."
      },
      {
        "title": "Exponential smoothing",
        "background": "Streaming metrics often relax toward a current signal with a first-order linear law.",
        "numbers": "For $m'+5m=5x$ and $x=10$, equilibrium is $10$ and time constant is $0.2$."
      },
      {
        "title": "RC charging",
        "background": "A capacitor charging through a resistor follows a linear first-order equation.",
        "numbers": "If $V'+2V=10$, then equilibrium voltage is $5$ and $V(0)=0$ gives $V=5-5e^{-2t}$."
      },
      {
        "title": "Regularized gradient flow",
        "background": "A quadratic loss plus L2 penalty gives linear dynamics for one weight.",
        "numbers": "For $w'+3w=6$, the weight tends to $2$ as $w=2+Ce^{-3t}$."
      },
      {
        "title": "Queue relaxation",
        "background": "Service systems can be approximated by linear pull toward a target backlog.",
        "numbers": "If $Q'+0.1Q=50$, equilibrium is $500$ requests."
      },
      {
        "title": "Kalman-filter intuition",
        "background": "Many filters update states through linear dynamics plus forcing.",
        "numbers": "The scalar model $x'+0.4x=2$ has steady state $5$ and half-life $\\ln2/0.4\\approx1.73$."
      }
    ],
    "applicationsClose": "Linear first-order equations are the algebra of gentle feedback: deviation from balance changes exponentially.",
    "takeaways": [
      "Standard form is $y'+p(x)y=q(x)$.",
      "Constant-coefficient equations often relax toward an equilibrium.",
      "Linearity forbids powers or nonlinear functions of $y$.",
      "These equations model smoothing, cooling, circuits, queues, and simple optimization flow."
    ]
  },
  "math-03-07": {
    "id": "math-03-07",
    "title": "Integrating factors",
    "tagline": "An integrating factor is the multiplier that turns a linear equation into one clean product derivative.",
    "connections": {
      "buildsOn": [
        "Linear first-order equations",
        "product rule",
        "exponential functions"
      ],
      "leadsTo": [
        "Exact equations",
        "Bernoulli equations",
        "modeling with first-order ODEs"
      ],
      "usedWith": [
        "product rule",
        "standard form",
        "definite integrals"
      ]
    },
    "motivation": "<p>When $p(x)$ changes with $x$, a first-order linear equation may not have a simple equilibrium shortcut. But the product rule gives us a way in.</p><p>The integrating factor is chosen so the left side becomes $\\dfrac{d}{dx}(\\mu y)$. Then one integration solves the equation. It is a clever multiplier, not magic.</p>",
    "definition": "<p>For $y'+p(x)y=q(x)$, an <b>integrating factor</b> is $\\mu(x)=e^{\\int p(x)\\,dx}$. Multiplying the equation by $\\mu$ gives $\\mu y'+\\mu p y=\\mu q$.</p><p>Because $\\mu'=p\\mu$, the left side is exactly $\\mu y'+\\mu' y=\\dfrac{d}{dx}(\\mu y)$ by the product rule. Then $\\mu y=\\int \\mu q\\,dx+C$.</p><p><b>Assumptions that matter:</b> the equation must first be in standard linear form; $p$ and $q$ should be continuous on the interval; and the constant from $\\int p(x)\\,dx$ can be ignored because it only rescales $\\mu$.</p>",
    "worked": {
      "problem": "Solve $y'+3y=e^{-x}$ with $y(0)=0$.",
      "skills": [
        "integrating factors",
        "product rule",
        "initial values"
      ],
      "strategy": "Use $\\mu=e^{\\int3dx}$ so the left side becomes a derivative of $e^{3x}y$.",
      "steps": [
        {
          "do": "Identify $p(x)$",
          "result": "$p(x)=3$",
          "why": "coefficient of $y$ in standard form"
        },
        {
          "do": "Compute the integrating factor",
          "result": "$\\mu=e^{3x}$",
          "why": "$e^{\\int3\\,dx}=e^{3x}$"
        },
        {
          "do": "Multiply the equation",
          "result": "$e^{3x}y'+3e^{3x}y=e^{2x}$",
          "why": "$e^{3x}e^{-x}=e^{2x}$"
        },
        {
          "do": "Rewrite the left side",
          "result": "$\\dfrac{d}{dx}(e^{3x}y)=e^{2x}$",
          "why": "product rule"
        },
        {
          "do": "Integrate",
          "result": "$e^{3x}y=\\dfrac12e^{2x}+C$",
          "why": "antiderivative of $e^{2x}$"
        },
        {
          "do": "Solve for $y$",
          "result": "$y=\\dfrac12e^{-x}+Ce^{-3x}$",
          "why": "divide by $e^{3x}$"
        },
        {
          "do": "Apply $y(0)=0$",
          "result": "$0=\\dfrac12+C$",
          "why": "initial value"
        }
      ],
      "verify": "With $C=-1/2$, substitution into the ODE gives $y'+3y=e^{-x}$ and $y(0)=0$.",
      "answer": "$y=\\dfrac12e^{-x}-\\dfrac12e^{-3x}$.",
      "connects": "The integrating factor is engineered so the product rule does the hard work."
    },
    "practice": [
      {
        "problem": "Find the integrating factor for $y'+2xy=x$.",
        "steps": [
          {
            "do": "Identify $p(x)$",
            "result": "$2x$",
            "why": "coefficient of $y$"
          },
          {
            "do": "Integrate $p(x)$",
            "result": "$\\int2x\\,dx=x^2$",
            "why": "power rule"
          },
          {
            "do": "Exponentiate",
            "result": "$\\mu=e^{x^2}$",
            "why": "definition of integrating factor"
          },
          {
            "do": "Check derivative",
            "result": "$\\mu'=2xe^{x^2}$",
            "why": "chain rule"
          },
          {
            "do": "Compare with $p\\mu$",
            "result": "$p\\mu=2xe^{x^2}$",
            "why": "the product rule condition holds"
          }
        ],
        "answer": "$\\mu(x)=e^{x^2}$."
      },
      {
        "problem": "Solve $y'+y=2$ with $y(0)=5$ using an integrating factor.",
        "steps": [
          {
            "do": "Compute $\\mu$",
            "result": "$e^x$",
            "why": "$p=1$"
          },
          {
            "do": "Multiply through",
            "result": "$e^xy'+e^xy=2e^x$",
            "why": "prepare product derivative"
          },
          {
            "do": "Rewrite",
            "result": "$(e^xy)'=2e^x$",
            "why": "product rule"
          },
          {
            "do": "Integrate",
            "result": "$e^xy=2e^x+C$",
            "why": "integrate both sides"
          },
          {
            "do": "Solve and apply initial value",
            "result": "$y=2+Ce^{-x}$, $5=2+C$",
            "why": "divide by $e^x$ then use $y(0)$"
          }
        ],
        "answer": "$y=2+3e^{-x}$."
      },
      {
        "problem": "Solve $y'-\\dfrac{1}{x}y=x^2$ for $x>0$.",
        "steps": [
          {
            "do": "Identify $p(x)$",
            "result": "$-1/x$",
            "why": "standard form coefficient"
          },
          {
            "do": "Compute $\\mu$",
            "result": "$e^{\\int -1/x\\,dx}=e^{-\\ln x}=1/x$",
            "why": "$x>0$ removes absolute value complication"
          },
          {
            "do": "Multiply through",
            "result": "$\\dfrac{1}{x}y'-\\dfrac{1}{x^2}y=x$",
            "why": "apply the integrating factor"
          },
          {
            "do": "Rewrite",
            "result": "$(y/x)'=x$",
            "why": "product rule for $y\\cdot x^{-1}$"
          },
          {
            "do": "Integrate",
            "result": "$y/x=x^2/2+C$",
            "why": "antiderivative of $x$"
          }
        ],
        "answer": "$y=x^3/2+Cx$ for $x>0$."
      },
      {
        "problem": "For $y'+4y=8e^{-4x}$, find the general solution.",
        "steps": [
          {
            "do": "Compute $\\mu$",
            "result": "$e^{4x}$",
            "why": "$p=4$"
          },
          {
            "do": "Multiply",
            "result": "$(e^{4x}y)'=8",
            "why": "$e^{4x}8e^{-4x}=8$"
          },
          {
            "do": "Integrate",
            "result": "$e^{4x}y=8x+C$",
            "why": "constant integrates to $8x$"
          },
          {
            "do": "Divide by $e^{4x}$",
            "result": "$y=(8x+C)e^{-4x}$",
            "why": "solve for $y$"
          },
          {
            "do": "Separate terms",
            "result": "$y=8xe^{-4x}+Ce^{-4x}$",
            "why": "show forced plus homogeneous parts"
          }
        ],
        "answer": "$y=(8x+C)e^{-4x}$."
      },
      {
        "problem": "A score satisfies $s'+2s=6t$ and $s(0)=1$. Find $s(1)$.",
        "steps": [
          {
            "do": "Compute $\\mu$",
            "result": "$e^{2t}$",
            "why": "$p=2$"
          },
          {
            "do": "Rewrite after multiplying",
            "result": "$(e^{2t}s)'=6te^{2t}$",
            "why": "product rule"
          },
          {
            "do": "Integrate",
            "result": "$e^{2t}s=3te^{2t}-\\dfrac32e^{2t}+C$",
            "why": "integration by parts"
          },
          {
            "do": "Solve for $s$",
            "result": "$s=3t-\\dfrac32+Ce^{-2t}$",
            "why": "divide by $e^{2t}$"
          },
          {
            "do": "Apply $s(0)=1$ and evaluate",
            "result": "$C=\\dfrac52$, so $s(1)=\\dfrac32+\\dfrac52e^{-2}\\approx1.838$",
            "why": "use the initial value then substitute $t=1$"
          }
        ],
        "answer": "$s(1)\\approx1.838$."
      }
    ],
    "applications": [
      {
        "title": "Time-varying forcing",
        "background": "Integrating factors handle inputs that change over time.",
        "numbers": "For $y'+y=t$, the solution is $y=t-1+Ce^{-t}$."
      },
      {
        "title": "Learning-rate schedules",
        "background": "A training statistic may relax while the target itself changes.",
        "numbers": "If $m'+2m=2t$, then $m=t-0.5+Ce^{-2t}$."
      },
      {
        "title": "Drug concentration",
        "background": "Infusion rates and elimination combine into linear equations.",
        "numbers": "For $C'+0.3C=6$, steady concentration is $20$ mg/L."
      },
      {
        "title": "RC circuits with input",
        "background": "Changing voltage sources produce forced linear equations.",
        "numbers": "If $V'+5V=10e^{-t}$, an integrating factor $e^{5t}$ gives a response term $2.5e^{-t}$."
      },
      {
        "title": "Cache warmup",
        "background": "A cache hit rate can approach a moving demand level.",
        "numbers": "For $h'+h=0.9$, $h(0)=0.1$ gives $h(2)=0.9-0.8e^{-2}\\approx0.792$."
      },
      {
        "title": "Momentum averages",
        "background": "Continuous analogues of exponential moving averages are linear forced equations.",
        "numbers": "If $m'+10m=10g$ and $g=0.4$, then $m(t)$ tends to $0.4$ with time constant $0.1$."
      }
    ],
    "applicationsClose": "The integrating factor is product-rule engineering: choose the multiplier that makes one side integrable in a single stroke.",
    "takeaways": [
      "First put the equation in $y'+p(x)y=q(x)$ form.",
      "$\\mu=e^{\\int p(x)\\,dx}$ makes $(\\mu y)'=\\mu q$.",
      "Continuity of $p$ and $q$ sets the interval where the method is valid.",
      "Forced linear systems in ML, circuits, and filtering use this structure."
    ]
  },
  "math-03-08": {
    "id": "math-03-08",
    "title": "Exact equations",
    "tagline": "An exact equation hides a potential function whose total differential is already sitting in front of you.",
    "connections": {
      "buildsOn": [
        "Integrating factors",
        "partial derivatives",
        "multivariable functions"
      ],
      "leadsTo": [
        "Bernoulli equations",
        "Homogeneous substitutions",
        "conservation laws"
      ],
      "usedWith": [
        "gradients",
        "potential functions",
        "implicit curves"
      ]
    },
    "motivation": "<p>Some differential equations arrive as $M(x,y)\\,dx+N(x,y)\\,dy=0$. At first that can feel less familiar than $y'=f(x,y)$.</p><p>The gift is that the left side may be the total differential of one function $F(x,y)$. Then the solutions are simply level curves $F(x,y)=C$.</p>",
    "definition": "<p>An equation $M(x,y)\\,dx+N(x,y)\\,dy=0$ is <b>exact</b> on a region when there is a function $F(x,y)$ such that $F_x=M$ and $F_y=N$. Then $dF=F_x\\,dx+F_y\\,dy=M\\,dx+N\\,dy$, so solutions satisfy $F(x,y)=C$.</p><p>On a simply connected region, a practical test is $M_y=N_x$. This is the equality of mixed partial derivatives: if $F_x=M$, then $M_y=F_{xy}$; if $F_y=N$, then $N_x=F_{yx}$.</p><p><b>Assumptions that matter:</b> $M$ and $N$ need continuous partial derivatives on the region; the region should have no holes for the simple test to guarantee exactness; and the answer is often implicit.</p>",
    "worked": {
      "problem": "Solve $(2xy+3)\\,dx+(x^2+4y)\\,dy=0$.",
      "skills": [
        "exactness test",
        "potential functions",
        "implicit solutions"
      ],
      "strategy": "Check $M_y=N_x$, then build $F$ by integrating $M$ and matching $F_y$.",
      "steps": [
        {
          "do": "Identify $M$ and $N$",
          "result": "$M=2xy+3$, $N=x^2+4y$",
          "why": "read coefficients of $dx$ and $dy$"
        },
        {
          "do": "Compute $M_y$",
          "result": "$2x$",
          "why": "differentiate $M$ with respect to $y$"
        },
        {
          "do": "Compute $N_x$",
          "result": "$2x$",
          "why": "differentiate $N$ with respect to $x$"
        },
        {
          "do": "Integrate $M$ with respect to $x$",
          "result": "$F=x^2y+3x+g(y)$",
          "why": "$y$ is constant during this integration"
        },
        {
          "do": "Differentiate $F$ with respect to $y$",
          "result": "$F_y=x^2+g'(y)$",
          "why": "match it to $N$"
        },
        {
          "do": "Set equal to $N$",
          "result": "$g'(y)=4y$",
          "why": "$x^2+g'(y)=x^2+4y$"
        },
        {
          "do": "Integrate $g'(y)$",
          "result": "$g(y)=2y^2$",
          "why": "complete the potential"
        }
      ],
      "verify": "Differentiating $F=x^2y+3x+2y^2$ gives the original $M$ and $N$.",
      "answer": "$x^2y+3x+2y^2=C$.",
      "connects": "Exact equations turn an ODE into level curves of a hidden potential."
    },
    "practice": [
      {
        "problem": "Test whether $(2x+y)\\,dx+(x+3y^2)\\,dy=0$ is exact.",
        "steps": [
          {
            "do": "Set $M$",
            "result": "$M=2x+y$",
            "why": "coefficient of $dx$"
          },
          {
            "do": "Set $N$",
            "result": "$N=x+3y^2$",
            "why": "coefficient of $dy$"
          },
          {
            "do": "Compute $M_y$",
            "result": "$1$",
            "why": "differentiate with respect to $y$"
          },
          {
            "do": "Compute $N_x$",
            "result": "$1$",
            "why": "differentiate with respect to $x$"
          },
          {
            "do": "Compare",
            "result": "exact",
            "why": "the partial derivatives agree"
          }
        ],
        "answer": "It is exact."
      },
      {
        "problem": "Find the potential for $(2x+y)\\,dx+(x+3y^2)\\,dy=0$.",
        "steps": [
          {
            "do": "Integrate $M$ in $x$",
            "result": "$F=x^2+xy+g(y)$",
            "why": "treat $y$ as constant"
          },
          {
            "do": "Differentiate in $y$",
            "result": "$F_y=x+g'(y)$",
            "why": "match coefficient of $dy$"
          },
          {
            "do": "Set equal to $N$",
            "result": "$x+g'(y)=x+3y^2$",
            "why": "use $F_y=N$"
          },
          {
            "do": "Solve for $g'(y)$",
            "result": "$g'(y)=3y^2$",
            "why": "subtract $x$"
          },
          {
            "do": "Integrate $g'(y)$",
            "result": "$g(y)=y^3$",
            "why": "power rule"
          }
        ],
        "answer": "$F=x^2+xy+y^3$, so $x^2+xy+y^3=C$."
      },
      {
        "problem": "Show that $(y)\\,dx+(2y-x)\\,dy=0$ is not exact.",
        "steps": [
          {
            "do": "Identify $M$",
            "result": "$M=y$",
            "why": "coefficient of $dx$"
          },
          {
            "do": "Identify $N$",
            "result": "$N=2y-x$",
            "why": "coefficient of $dy$"
          },
          {
            "do": "Compute $M_y$",
            "result": "$1$",
            "why": "differentiate with respect to $y$"
          },
          {
            "do": "Compute $N_x$",
            "result": "$-1$",
            "why": "differentiate with respect to $x$"
          },
          {
            "do": "Compare",
            "result": "$1\\ne-1$",
            "why": "exactness test fails"
          }
        ],
        "answer": "It is not exact on ordinary regions."
      },
      {
        "problem": "For exact equation $(e^x+y)\\,dx+(x+2y)\\,dy=0$, find $F$.",
        "steps": [
          {
            "do": "Check exactness",
            "result": "$M_y=1=N_x$",
            "why": "partial derivatives agree"
          },
          {
            "do": "Integrate $M$ in $x$",
            "result": "$F=e^x+xy+g(y)$",
            "why": "antiderivative of $e^x+y$ with respect to $x$"
          },
          {
            "do": "Differentiate in $y$",
            "result": "$F_y=x+g'(y)$",
            "why": "match $N$"
          },
          {
            "do": "Set equal to $x+2y$",
            "result": "$g'(y)=2y$",
            "why": "subtract $x$"
          },
          {
            "do": "Integrate",
            "result": "$g(y)=y^2$",
            "why": "complete $F$"
          }
        ],
        "answer": "$e^x+xy+y^2=C$."
      },
      {
        "problem": "Use $F=x^2+y^2$ to write the exact equation for its level curves.",
        "steps": [
          {
            "do": "Compute $F_x$",
            "result": "$2x$",
            "why": "coefficient of $dx$"
          },
          {
            "do": "Compute $F_y$",
            "result": "$2y$",
            "why": "coefficient of $dy$"
          },
          {
            "do": "Write $dF=0$",
            "result": "$2x\\,dx+2y\\,dy=0$",
            "why": "level curves keep $F$ constant"
          },
          {
            "do": "Convert to slope form",
            "result": "$2x+2y y'=0$",
            "why": "divide by $dx$"
          },
          {
            "do": "Solve for $y'$",
            "result": "$y'=-x/y$",
            "why": "isolate derivative"
          }
        ],
        "answer": "The exact equation is $2x\\,dx+2y\\,dy=0$, or $y'=-x/y$."
      }
    ],
    "applications": [
      {
        "title": "Conservation laws",
        "background": "Exact equations describe motion along level sets of conserved quantities.",
        "numbers": "If $F=x^2+y^2$, the level $F=25$ is a circle of radius $5$."
      },
      {
        "title": "Energy landscapes",
        "background": "Potential functions in physics and ML assign an energy to states; gradients describe change.",
        "numbers": "For $F=w^2+b^2$, moving on $F=1$ keeps $w^2+b^2=1$."
      },
      {
        "title": "Implicit curves",
        "background": "Computer graphics often represents shapes by level sets $F(x,y)=C$.",
        "numbers": "The function $F=x^2+y^2-9$ has zero level set a circle of radius $3$."
      },
      {
        "title": "Gradient checks",
        "background": "Exactness is related to whether a vector field can be a gradient of a scalar loss.",
        "numbers": "For field $(2x,2y)$, the potential is $x^2+y^2$ because partials match."
      },
      {
        "title": "Thermodynamics",
        "background": "State functions have exact differentials, meaning their changes do not depend on path.",
        "numbers": "If $dF=3T^2\\,dT+2V\\,dV$, then $F=T^3+V^2+C$."
      },
      {
        "title": "Path independence",
        "background": "In optimization, conservative vector fields have line integrals determined only by endpoints.",
        "numbers": "For $F=x^2+y^2$, change from $(1,2)$ to $(3,4)$ is $25-5=20$."
      }
    ],
    "applicationsClose": "Exactness says the differential pieces belong to one hidden whole; solving means finding that whole.",
    "takeaways": [
      "Exact equations have $M\\,dx+N\\,dy=0$ with $M=F_x$ and $N=F_y$.",
      "The practical test is $M_y=N_x$ on a suitable region.",
      "Solutions are implicit level curves $F(x,y)=C$.",
      "Potential functions connect ODEs to gradients, energy, and conservation."
    ]
  },
  "math-03-09": {
    "id": "math-03-09",
    "title": "Bernoulli equations",
    "tagline": "A Bernoulli equation looks nonlinear until the right power of $y$ makes it linear.",
    "connections": {
      "buildsOn": [
        "Linear first-order equations",
        "Integrating factors",
        "substitution"
      ],
      "leadsTo": [
        "Homogeneous substitutions",
        "Modeling with first-order ODEs",
        "existence and uniqueness"
      ],
      "usedWith": [
        "power rules",
        "linear equations",
        "change of variables"
      ]
    },
    "motivation": "<p>Some nonlinear equations are kinder than they look. Bernoulli equations contain a power $y^n$, but that power is organized enough to be removed by a substitution.</p><p>The pattern is encouraging: instead of inventing a new method from scratch, we change variables until an old method reappears.</p>",
    "definition": "<p>A <b>Bernoulli equation</b> has the form $y'+p(x)y=q(x)y^n$, where $n\\ne0$ and $n\\ne1$. Divide by $y^n$ where $y\\ne0$ and set $v=y^{1-n}$.</p><p>Differentiating gives $v'=(1-n)y^{-n}y'$. This turns the Bernoulli equation into the linear equation $v'+(1-n)p(x)v=(1-n)q(x)$.</p><p><b>Assumptions that matter:</b> the substitution usually works where $y\\ne0$; constant zero solutions should be checked separately when allowed; and $n=0$ or $n=1$ is already linear rather than Bernoulli in the special sense.</p>",
    "worked": {
      "problem": "Solve $y'+y=xy^2$ with $y(0)=1/3$.",
      "skills": [
        "Bernoulli substitution",
        "linear equations",
        "initial values"
      ],
      "strategy": "Here $n=2$, so use $v=y^{-1}$ to convert the equation into a linear equation.",
      "steps": [
        {
          "do": "Identify $n$",
          "result": "$n=2$",
          "why": "the nonlinear term is $y^2$"
        },
        {
          "do": "Set the substitution",
          "result": "$v=y^{-1}$",
          "why": "$1-n=-1$"
        },
        {
          "do": "Use the transformed equation",
          "result": "$v'-v=-x$",
          "why": "Bernoulli formula with $p=1$ and $q=x$"
        },
        {
          "do": "Compute integrating factor",
          "result": "$e^{-x}$",
          "why": "coefficient of $v$ is $-1$"
        },
        {
          "do": "Rewrite as a product derivative",
          "result": "$(e^{-x}v)'=-xe^{-x}$",
          "why": "product rule"
        },
        {
          "do": "Integrate",
          "result": "$e^{-x}v=(x+1)e^{-x}+C$",
          "why": "$\\int -xe^{-x}\\,dx=(x+1)e^{-x}$"
        },
        {
          "do": "Solve for $v$",
          "result": "$v=x+1+Ce^x$",
          "why": "multiply by $e^x$"
        },
        {
          "do": "Apply $y(0)=1/3$",
          "result": "$v(0)=3=1+C$",
          "why": "$v=1/y$"
        }
      ],
      "verify": "With $C=2$, $y=1/(x+1+2e^x)$; substituting follows from the derived linear equation.",
      "answer": "$y=\\dfrac{1}{x+1+2e^x}$.",
      "connects": "Bernoulli equations reward the right substitution by becoming linear."
    },
    "practice": [
      {
        "problem": "Identify $p(x)$, $q(x)$, and $n$ in $y'+3y=2xy^4$.",
        "steps": [
          {
            "do": "Compare with the form",
            "result": "$y'+p(x)y=q(x)y^n$",
            "why": "Bernoulli template"
          },
          {
            "do": "Read $p(x)$",
            "result": "$3$",
            "why": "coefficient of $y$"
          },
          {
            "do": "Read $q(x)$",
            "result": "$2x$",
            "why": "coefficient multiplying $y^4$"
          },
          {
            "do": "Read $n$",
            "result": "$4$",
            "why": "power on $y$"
          },
          {
            "do": "State substitution",
            "result": "$v=y^{-3}$",
            "why": "$1-n=-3$"
          }
        ],
        "answer": "$p=3$, $q=2x$, $n=4$, and $v=y^{-3}$."
      },
      {
        "problem": "Transform $y'+2y=xy^3$ into a linear equation for $v$.",
        "steps": [
          {
            "do": "Identify $n$",
            "result": "$3$",
            "why": "nonlinear power"
          },
          {
            "do": "Set $v$",
            "result": "$v=y^{-2}$",
            "why": "$1-n=-2$"
          },
          {
            "do": "Use transformed coefficient",
            "result": "$(1-n)p=-2\\cdot2=-4$",
            "why": "Bernoulli formula"
          },
          {
            "do": "Use transformed right side",
            "result": "$(1-n)q=-2x$",
            "why": "multiply $q=x$ by $-2$"
          },
          {
            "do": "Write linear equation",
            "result": "$v'-4v=-2x$",
            "why": "substitution removes the power"
          }
        ],
        "answer": "$v'-4v=-2x$."
      },
      {
        "problem": "Solve $y'-y=y^2$ in general form for nonzero $y$.",
        "steps": [
          {
            "do": "Set $v=y^{-1}$",
            "result": "$v=1/y$",
            "why": "$n=2$"
          },
          {
            "do": "Transform",
            "result": "$v'+v=-1$",
            "why": "Bernoulli formula with $p=-1$, $q=1$"
          },
          {
            "do": "Solve the linear equation",
            "result": "$v=-1+Ce^{-x}$",
            "why": "equilibrium $-1$ plus decay"
          },
          {
            "do": "Return to $y$",
            "result": "$y=\\dfrac{1}{-1+Ce^{-x}}$",
            "why": "$y=1/v$"
          },
          {
            "do": "Note constant solution",
            "result": "$y=0$ also solves",
            "why": "division by $y^2$ can lose it"
          }
        ],
        "answer": "$y=1/(-1+Ce^{-x})$, plus $y=0$."
      },
      {
        "problem": "For $y'+y=y^2$ and $y(0)=2$, solve using $v=1/y$.",
        "steps": [
          {
            "do": "Transform",
            "result": "$v'-v=-1$",
            "why": "$p=1$, $q=1$, $n=2$"
          },
          {
            "do": "Solve for $v$",
            "result": "$v=1+Ce^x$",
            "why": "linear solution"
          },
          {
            "do": "Apply $y(0)=2$",
            "result": "$v(0)=1/2=1+C$",
            "why": "$v=1/y$"
          },
          {
            "do": "Solve for $C$",
            "result": "$C=-1/2$",
            "why": "subtract 1"
          },
          {
            "do": "Invert",
            "result": "$y=\\dfrac{1}{1-\\tfrac12e^x}$",
            "why": "return to original variable"
          }
        ],
        "answer": "$y=1/(1-\\tfrac12e^x)$ on its interval of validity."
      },
      {
        "problem": "A nonlinear gain obeys $a'+a=0.5a^2$, $a(0)=1$. Find $a(t)$.",
        "steps": [
          {
            "do": "Set $v=1/a$",
            "result": "$v=a^{-1}$",
            "why": "Bernoulli power $n=2$"
          },
          {
            "do": "Transform",
            "result": "$v'-v=-0.5$",
            "why": "formula with $p=1$, $q=0.5$"
          },
          {
            "do": "Solve the linear equation",
            "result": "$v=0.5+Ce^t$",
            "why": "equilibrium $0.5$"
          },
          {
            "do": "Apply $a(0)=1$",
            "result": "$1=0.5+C$",
            "why": "$v(0)=1/a(0)$"
          },
          {
            "do": "Invert",
            "result": "$a=\\dfrac{1}{0.5+0.5e^t}$",
            "why": "return to $a$"
          }
        ],
        "answer": "$a(t)=1/(0.5+0.5e^t)$."
      }
    ],
    "applications": [
      {
        "title": "Saturating growth variants",
        "background": "Bernoulli forms appear when growth includes both linear and power-law feedback.",
        "numbers": "For $y'+y=y^2$, the substitution $v=1/y$ makes $v'-v=-1$."
      },
      {
        "title": "Nonlinear damping",
        "background": "Physical damping can include powers of velocity while retaining transformable structure.",
        "numbers": "If $v'+0.2v=0.01v^2$, then $u=1/v$ gives $u'-0.2u=-0.01$."
      },
      {
        "title": "Adaptive gain control",
        "background": "Some signal systems reduce gain according to its square.",
        "numbers": "For $a'+a=0.5a^2$, starting at $1$ gives $a(2)=1/(0.5+0.5e^2)\\approx0.238$."
      },
      {
        "title": "Model confidence dynamics",
        "background": "A toy confidence variable can have nonlinear reinforcement but linear decay.",
        "numbers": "For $c'+2c=tc^2$, $v=1/c$ gives $v'-2v=-t$."
      },
      {
        "title": "Epidemic simplifications",
        "background": "Certain reciprocal substitutions convert nonlinear rate equations into linear ones.",
        "numbers": "If $I'-I=I^2$, then $1/I=-1+Ce^{-t}$."
      },
      {
        "title": "Numerical validation",
        "background": "Solvers can be checked against Bernoulli equations with known closed forms.",
        "numbers": "For $y'+y=y^2$, $y(0)=0.5$ gives $y=1/(1+e^x)$ and $y(1)\\approx0.269$."
      }
    ],
    "applicationsClose": "Bernoulli equations teach a durable lesson: the right variable can reveal linear structure inside nonlinear clothing.",
    "takeaways": [
      "Bernoulli form is $y'+p(x)y=q(x)y^n$ with $n\\ne0,1$.",
      "Use $v=y^{1-n}$ to get a linear first-order equation.",
      "Check separately for constant solutions lost by division.",
      "Substitution is a central ODE skill, not a trick to memorize once."
    ]
  },
  "math-03-10": {
    "id": "math-03-10",
    "title": "Homogeneous substitutions",
    "tagline": "When an equation depends only on the ratio $y/x$, the substitution $v=y/x$ turns scale into shape.",
    "connections": {
      "buildsOn": [
        "Separable equations",
        "substitution",
        "first-order ODEs"
      ],
      "leadsTo": [
        "Modeling with first-order ODEs",
        "existence and uniqueness",
        "systems and phase portraits"
      ],
      "usedWith": [
        "ratios",
        "separable equations",
        "implicit solutions"
      ]
    },
    "motivation": "<p>Some equations do not care about the absolute size of $x$ and $y$ separately. They care about their ratio, the slope from the origin.</p><p>For these equations, $v=y/x$ is the natural new variable. It says, let us track the shape ratio first; then $y=vx$ translates that ratio back into the original curve.</p>",
    "definition": "<p>A first-order equation is <b>homogeneous</b> in this sense when it can be written $\\dfrac{dy}{dx}=F\\\left(\\dfrac{y}{x}\\right)$, or when $M(x,y)$ and $N(x,y)$ are homogeneous functions of the same degree in $M\\,dx+N\\,dy=0$.</p><p>Use $v=y/x$, so $y=vx$. Differentiating by the product rule gives $\\dfrac{dy}{dx}=v+x\\dfrac{dv}{dx}$. Substitution often turns the equation into a separable equation in $v$ and $x$.</p><p><b>Assumptions that matter:</b> the substitution requires $x\\ne0$ on the interval; this is different from linear homogeneous equations; and after solving for $v$, return to $y$ using $y=vx$.</p>",
    "worked": {
      "problem": "Solve $\\dfrac{dy}{dx}=1+\\dfrac{y}{x}$ with $y(1)=2$.",
      "skills": [
        "homogeneous substitution",
        "separation",
        "initial values"
      ],
      "strategy": "The right side depends on $y/x$ — set $v=y/x$ and use $y=vx$.",
      "steps": [
        {
          "do": "Set the substitution",
          "result": "$v=y/x$, so $y=vx$",
          "why": "the equation contains $y/x$"
        },
        {
          "do": "Differentiate $y=vx$",
          "result": "$y'=v+xv'$",
          "why": "product rule"
        },
        {
          "do": "Substitute into the ODE",
          "result": "$v+xv'=1+v$",
          "why": "replace $y'$ and $y/x$"
        },
        {
          "do": "Subtract $v$",
          "result": "$xv'=1$",
          "why": "isolate the derivative term"
        },
        {
          "do": "Separate and integrate",
          "result": "$dv=\\dfrac{1}{x}\\,dx$, so $v=\\ln|x|+C$",
          "why": "integrate both sides"
        },
        {
          "do": "Return to $y$",
          "result": "$y=x(\\ln|x|+C)$",
          "why": "$y=vx$"
        },
        {
          "do": "Apply $y(1)=2$",
          "result": "$2=1(0+C)$",
          "why": "$\\ln1=0$"
        }
      ],
      "verify": "With $C=2$, differentiating $y=x(\\ln x+2)$ on $x>0$ gives $1+y/x$.",
      "answer": "$y=x(\\ln x+2)$ for $x>0$.",
      "connects": "The ratio substitution changes a scale-invariant equation into a separable one."
    },
    "practice": [
      {
        "problem": "Show that $y'=y/x$ is homogeneous and solve it.",
        "steps": [
          {
            "do": "Identify the ratio",
            "result": "$y/x$",
            "why": "right side depends only on $y/x$"
          },
          {
            "do": "Separate directly",
            "result": "$\\dfrac{1}{y}\\,dy=\\dfrac{1}{x}\\,dx$",
            "why": "this one also separates"
          },
          {
            "do": "Integrate",
            "result": "$\\ln|y|=\\ln|x|+C$",
            "why": "log antiderivatives"
          },
          {
            "do": "Exponentiate",
            "result": "$y=Ax$",
            "why": "combine constants"
          },
          {
            "do": "Interpret",
            "result": "straight lines through the origin",
            "why": "constant ratio $y/x=A$"
          }
        ],
        "answer": "$y=Ax$."
      },
      {
        "problem": "Use $v=y/x$ to transform $y'=2+y/x$.",
        "steps": [
          {
            "do": "Set $y=vx$",
            "result": "$y'=v+xv'$",
            "why": "product rule"
          },
          {
            "do": "Substitute",
            "result": "$v+xv'=2+v$",
            "why": "replace $y/x$ by $v$"
          },
          {
            "do": "Cancel $v$",
            "result": "$xv'=2$",
            "why": "subtract $v$"
          },
          {
            "do": "Separate",
            "result": "$dv=2\\,dx/x$",
            "why": "divide by $x$"
          },
          {
            "do": "Integrate",
            "result": "$v=2\\ln|x|+C$",
            "why": "log antiderivative"
          }
        ],
        "answer": "$y=x(2\\ln|x|+C)$."
      },
      {
        "problem": "Solve $y'=\\dfrac{x+y}{x-y}$ using $v=y/x$ up to an implicit formula.",
        "steps": [
          {
            "do": "Rewrite right side",
            "result": "$\\dfrac{1+v}{1-v}$",
            "why": "divide numerator and denominator by $x$"
          },
          {
            "do": "Substitute derivative",
            "result": "$v+xv'=\\dfrac{1+v}{1-v}$",
            "why": "$y'=v+xv'$"
          },
          {
            "do": "Isolate $xv'$",
            "result": "$xv'=\\dfrac{1+v}{1-v}-v$",
            "why": "subtract $v$"
          },
          {
            "do": "Simplify",
            "result": "$xv'=\\dfrac{1+v^2}{1-v}$",
            "why": "common denominator"
          },
          {
            "do": "Separate",
            "result": "$\\dfrac{1-v}{1+v^2}\\,dv=\\dfrac{dx}{x}$",
            "why": "variables separate"
          }
        ],
        "answer": "$\\arctan v-\\tfrac12\\ln(1+v^2)=\\ln|x|+C$, with $v=y/x$."
      },
      {
        "problem": "Check whether $y'=x+y$ is homogeneous in the ratio sense.",
        "steps": [
          {
            "do": "Look for ratio form",
            "result": "$x+y$",
            "why": "not a function of $y/x$ alone"
          },
          {
            "do": "Scale both variables",
            "result": "$kx+ky=k(x+y)$",
            "why": "the value changes by factor $k$"
          },
          {
            "do": "Compare with ratio-only behavior",
            "result": "$y/x$ unchanged under scaling",
            "why": "ratio-only functions would not scale"
          },
          {
            "do": "Classify",
            "result": "not homogeneous in this ODE sense",
            "why": "depends on absolute scale"
          },
          {
            "do": "Choose another method",
            "result": "linear equation $y'-y=x$",
            "why": "it is first-order linear instead"
          }
        ],
        "answer": "It is not homogeneous by ratio; it is linear."
      },
      {
        "problem": "A ray model satisfies $r'=1+r/t$, $r(1)=3$. Find $r(t)$ for $t>0$.",
        "steps": [
          {
            "do": "Set $v=r/t$",
            "result": "$r=vt$",
            "why": "right side uses $r/t$"
          },
          {
            "do": "Differentiate",
            "result": "$r'=v+tv'$",
            "why": "product rule"
          },
          {
            "do": "Substitute",
            "result": "$v+tv'=1+v$",
            "why": "replace $r/t$"
          },
          {
            "do": "Simplify and integrate",
            "result": "$v=\\ln t+C$",
            "why": "$tv'=1$"
          },
          {
            "do": "Apply $r(1)=3$",
            "result": "$C=3$",
            "why": "$v(1)=3$ and $\\ln1=0$"
          }
        ],
        "answer": "$r=t(\\ln t+3)$."
      }
    ],
    "applications": [
      {
        "title": "Scale-invariant geometry",
        "background": "Homogeneous equations often describe curves whose slopes depend on direction from the origin.",
        "numbers": "For $y'=y/x$, solutions $y=Ax$ keep ratio $A$ constant."
      },
      {
        "title": "Ray tracing",
        "background": "Some geometric paths depend on angle or ratio more than absolute distance.",
        "numbers": "At point $(4,2)$, $y/x=0.5$; an equation $y'=1+y/x$ gives slope $1.5$."
      },
      {
        "title": "Feature normalization",
        "background": "Ratios remove scale, much like homogeneous substitutions remove absolute magnitude.",
        "numbers": "Vectors $(2,4)$ and $(10,20)$ both have ratio $y/x=2$."
      },
      {
        "title": "Phase-plane sketches",
        "background": "Direction fields with ratio-only slopes look similar along rays from the origin.",
        "numbers": "On the ray $y=3x$, every point has $y/x=3$, so $y'=1+3=4$ for $y'=1+y/x$."
      },
      {
        "title": "Dimensional analysis",
        "background": "Engineering models often reduce variables to dimensionless ratios.",
        "numbers": "If height and width double from $(3,6)$ to $(6,12)$, the ratio stays $2$."
      },
      {
        "title": "Algorithm scaling",
        "background": "Scale-free rules behave the same after multiplying all measurements.",
        "numbers": "A decision based on $y/x>0.8$ gives the same result for $(5,4.5)$ and $(50,45)$."
      }
    ],
    "applicationsClose": "Homogeneous substitution is ratio thinking: when scale is not the story, let $v=y/x$ tell the story.",
    "takeaways": [
      "Use $v=y/x$ and $y=vx$ when $y'$ depends on $y/x$.",
      "The derivative becomes $y'=v+xv'$.",
      "The transformed equation is usually separable.",
      "This homogeneous idea is different from a linear homogeneous equation."
    ]
  },
  "math-03-11": {
    "id": "math-03-11",
    "title": "Modeling with first-order ODEs",
    "tagline": "Modeling means translating a story about change into an equation whose solution keeps the units honest.",
    "connections": {
      "buildsOn": [
        "Separable equations",
        "Linear first-order equations",
        "initial conditions"
      ],
      "leadsTo": [
        "The existence–uniqueness theorem",
        "systems of ODEs",
        "continuous-time ML models"
      ],
      "usedWith": [
        "proportionality",
        "equilibria",
        "dimensional analysis"
      ]
    },
    "motivation": "<p>The hardest part of many ODE problems is not integration. It is listening to the story carefully enough to write the rate law.</p><p>First-order models usually say one of three things: change is proportional to the amount, change is proportional to the gap from a target, or change equals input minus output. Once the equation is honest, the solution follows.</p>",
    "definition": "<p>A first-order ODE model chooses a state variable, an independent variable, a rate law, and an initial condition. The state might be temperature $T(t)$, population $P(t)$, concentration $C(t)$, or a parameter $w(t)$.</p><p>Units are the built-in error check. If $T'=-k(T-20)$, then $T'$ has units degrees per minute, $(T-20)$ has degrees, so $k$ must have units $1/$minute. This keeps constants meaningful.</p><p><b>Assumptions that matter:</b> simple models freeze many real factors; proportionality constants must have units; solutions are trusted only where assumptions remain reasonable; and initial data anchors the prediction.</p>",
    "worked": {
      "problem": "A drink at $80^\\circ$C cools in a $20^\\circ$C room according to $T'=-0.2(T-20)$, with $t$ in minutes. Find $T(5)$.",
      "skills": [
        "Newton cooling",
        "linear ODEs",
        "initial values"
      ],
      "strategy": "Subtract the ambient temperature so the gap decays exponentially.",
      "steps": [
        {
          "do": "Define the gap",
          "result": "$u=T-20$",
          "why": "cooling depends on distance from room temperature"
        },
        {
          "do": "Write the gap equation",
          "result": "$u'=-0.2u$",
          "why": "the ambient constant has derivative zero"
        },
        {
          "do": "Solve the gap equation",
          "result": "$u=Ce^{-0.2t}$",
          "why": "proportional decay"
        },
        {
          "do": "Use $T(0)=80$",
          "result": "$u(0)=60$",
          "why": "initial gap is $80-20$"
        },
        {
          "do": "Write $T(t)$",
          "result": "$T=20+60e^{-0.2t}$",
          "why": "add ambient temperature back"
        },
        {
          "do": "Evaluate at $t=5$",
          "result": "$T(5)=20+60e^{-1}\\approx42.07$",
          "why": "$0.2\\cdot5=1$"
        }
      ],
      "verify": "The answer is between $20$ and $80$, closer to room temperature after five minutes, which matches the cooling story.",
      "answer": "$T(5)\\approx42.07^\\circ$C.",
      "connects": "A good model preserves the meaning of the quantities while the ODE solves the prediction."
    },
    "practice": [
      {
        "problem": "A population grows at $12\\%$ per year with $P(0)=500$. Model and find $P(3)$.",
        "steps": [
          {
            "do": "Translate percent growth",
            "result": "$P'=0.12P$",
            "why": "rate proportional to population"
          },
          {
            "do": "Solve the ODE",
            "result": "$P=Ce^{0.12t}$",
            "why": "exponential growth"
          },
          {
            "do": "Apply $P(0)=500$",
            "result": "$C=500$",
            "why": "initial population"
          },
          {
            "do": "Substitute $t=3$",
            "result": "$P(3)=500e^{0.36}$",
            "why": "three years"
          },
          {
            "do": "Approximate",
            "result": "$P(3)\\approx716.7$",
            "why": "$e^{0.36}\\approx1.433$"
          }
        ],
        "answer": "About $717$ individuals."
      },
      {
        "problem": "A tank has $100$ L, inflow concentration $3$ g/L at $4$ L/min, and outflow $4$ L/min. Write the salt ODE for amount $S$.",
        "steps": [
          {
            "do": "Compute salt inflow",
            "result": "$3\\cdot4=12$ g/min",
            "why": "concentration times flow"
          },
          {
            "do": "Compute tank concentration",
            "result": "$S/100$ g/L",
            "why": "well-mixed tank"
          },
          {
            "do": "Compute salt outflow",
            "result": "$4(S/100)=S/25$ g/min",
            "why": "flow times concentration"
          },
          {
            "do": "Write rate law",
            "result": "$S'=12-S/25$",
            "why": "input minus output"
          },
          {
            "do": "Find equilibrium",
            "result": "$S=300$ g",
            "why": "set $S'=0$"
          }
        ],
        "answer": "$S'=12-S/25$."
      },
      {
        "problem": "A queue receives $90$ jobs/min and serves $0.3Q$ jobs/min. Write and solve for $Q(0)=100$.",
        "steps": [
          {
            "do": "Write input minus output",
            "result": "$Q'=90-0.3Q$",
            "why": "arrivals add and service removes"
          },
          {
            "do": "Find equilibrium",
            "result": "$Q=300$",
            "why": "$90=0.3Q$"
          },
          {
            "do": "Write solution form",
            "result": "$Q=300+Ce^{-0.3t}$",
            "why": "linear relaxation"
          },
          {
            "do": "Apply initial value",
            "result": "$100=300+C$",
            "why": "starting backlog"
          },
          {
            "do": "Solve",
            "result": "$Q=300-200e^{-0.3t}$",
            "why": "$C=-200$"
          }
        ],
        "answer": "$Q(t)=300-200e^{-0.3t}$."
      },
      {
        "problem": "A model weight follows gradient flow $w'=-0.4(w-5)$ with $w(0)=1$. Find $w(10)$.",
        "steps": [
          {
            "do": "Identify target",
            "result": "$5$",
            "why": "rate depends on gap from 5"
          },
          {
            "do": "Write solution form",
            "result": "$w=5+Ce^{-0.4t}$",
            "why": "gap decays"
          },
          {
            "do": "Apply initial value",
            "result": "$1=5+C$",
            "why": "starting weight"
          },
          {
            "do": "Solve for $C$",
            "result": "$C=-4$",
            "why": "subtract 5"
          },
          {
            "do": "Evaluate",
            "result": "$w(10)=5-4e^{-4}\\approx4.927$",
            "why": "$e^{-4}\\approx0.0183$"
          }
        ],
        "answer": "$w(10)\\approx4.927$."
      },
      {
        "problem": "A rumor spreads logistically: $P'=0.5P(1-P/1000)$ and $P=100$. Find the current growth rate.",
        "steps": [
          {
            "do": "Substitute $P=100$",
            "result": "$P'=0.5\\cdot100(1-100/1000)$",
            "why": "evaluate the model at current state"
          },
          {
            "do": "Simplify the fraction",
            "result": "$1-0.1=0.9$",
            "why": "population is 10 percent of capacity"
          },
          {
            "do": "Multiply first factors",
            "result": "$50\\cdot0.9$",
            "why": "$0.5\\cdot100=50$"
          },
          {
            "do": "Compute rate",
            "result": "$45$",
            "why": "$50\\cdot0.9=45$"
          },
          {
            "do": "Attach units",
            "result": "$45$ people per time unit",
            "why": "$P'$ is a rate"
          }
        ],
        "answer": "Current growth rate is $45$ people per time unit."
      }
    ],
    "applications": [
      {
        "title": "Newton cooling",
        "background": "Heat exchange is often proportional to temperature gap from surroundings.",
        "numbers": "A $60^\\circ$ gap with $k=0.2$ cools initially at $12^\\circ$C per minute."
      },
      {
        "title": "Tank mixing",
        "background": "Chemical engineering tracks amount by input minus output.",
        "numbers": "Inflow $12$ g/min and outflow $S/25$ gives equilibrium $S=300$ g."
      },
      {
        "title": "Queueing systems",
        "background": "Backlog changes by arrivals minus completions.",
        "numbers": "At $Q=100$, $Q'=90-0.3(100)=60$ jobs/min."
      },
      {
        "title": "Gradient flow",
        "background": "Continuous optimization models weights moving opposite gradients.",
        "numbers": "For $J=0.2(w-5)^2$, $w'=-0.4(w-5)$ moves $w=1$ upward at rate $1.6$."
      },
      {
        "title": "Epidemic saturation",
        "background": "Logistic terms model limited susceptible population or attention.",
        "numbers": "At $P=500$ with $K=1000$, $P'=0.5\\cdot500\\cdot0.5=125$."
      },
      {
        "title": "Online metric smoothing",
        "background": "Dashboards often smooth noisy measurements with first-order dynamics.",
        "numbers": "If $m'=0.2(x-m)$, signal $x=70$ and current $m=50$ gives $m'=4$ units/min."
      }
    ],
    "applicationsClose": "Modeling is translation with accountability: every term must say what changes, why, and in what units.",
    "takeaways": [
      "Choose the state variable and independent variable before writing equations.",
      "Common first-order patterns are proportional growth, gap decay, and input minus output.",
      "Units are a powerful check on constants and terms.",
      "Initial conditions turn a model into a prediction."
    ]
  },
  "math-03-12": {
    "id": "math-03-12",
    "title": "The existence–uniqueness theorem",
    "tagline": "Existence says a solution starts here; uniqueness says no second curve can sneak through the same point.",
    "connections": {
      "buildsOn": [
        "Modeling with first-order ODEs",
        "direction fields",
        "initial value problems"
      ],
      "leadsTo": [
        "systems of ODEs",
        "numerical methods",
        "dynamical systems"
      ],
      "usedWith": [
        "continuity",
        "partial derivatives",
        "intervals of validity"
      ]
    },
    "motivation": "<p>After solving several equations, it is natural to ask a deeper question: when are we guaranteed that a solution exists at all, and when is it the only one through a starting point?</p><p>The existence–uniqueness theorem is the reassurance behind many models and numerical solvers. It says that if the slope field is continuous and not too wild in $y$, then one and only one solution curve passes through the initial point.</p>",
    "definition": "<p>For the initial value problem $y'=f(x,y)$, $y(x_0)=y_0$, if $f$ and $\\dfrac{\\partial f}{\\partial y}$ are continuous in a rectangle around $(x_0,y_0)$, then there is some interval around $x_0$ on which a unique solution exists.</p><p>The continuity of $f$ gives local slopes to follow. The continuity of $f_y$ controls how sharply slopes change as $y$ changes, preventing two nearby solution curves from crossing through the same point.</p><p><b>Assumptions that matter:</b> the theorem is local, not necessarily global; it gives a guarantee, not a formula; failure of the hypotheses does not always mean failure of uniqueness; and the rectangle must surround the initial point.</p>",
    "worked": {
      "problem": "Use the theorem for $y'=x+y^2$, $y(0)=1$.",
      "skills": [
        "continuity",
        "partial derivatives",
        "initial value problems"
      ],
      "strategy": "Check $f(x,y)$ and $f_y(x,y)$ near the initial point.",
      "steps": [
        {
          "do": "Identify $f(x,y)$",
          "result": "$f(x,y)=x+y^2$",
          "why": "right side of the ODE"
        },
        {
          "do": "Check continuity of $f$",
          "result": "continuous everywhere",
          "why": "polynomials in $x$ and $y$ are continuous"
        },
        {
          "do": "Compute $f_y$",
          "result": "$2y$",
          "why": "differentiate with respect to $y$"
        },
        {
          "do": "Check continuity of $f_y$",
          "result": "continuous everywhere",
          "why": "$2y$ is a polynomial"
        },
        {
          "do": "Apply the theorem at $(0,1)$",
          "result": "a unique local solution exists",
          "why": "both hypotheses hold in any rectangle around the point"
        },
        {
          "do": "Clarify the scope",
          "result": "local guarantee near $x=0$",
          "why": "the theorem does not promise a solution for all $x$"
        }
      ],
      "verify": "The theorem gives existence and uniqueness even before solving the nonlinear equation explicitly.",
      "answer": "There is a unique solution on some interval around $x=0$.",
      "connects": "The theorem explains why a well-behaved direction field has exactly one curve through the initial point."
    },
    "practice": [
      {
        "problem": "Check existence and uniqueness for $y'=\\sqrt{y}$, $y(0)=1$.",
        "steps": [
          {
            "do": "Identify $f$",
            "result": "$f(y)=\\sqrt y$",
            "why": "right side"
          },
          {
            "do": "Check continuity near $y=1$",
            "result": "continuous",
            "why": "square root is continuous for positive $y$"
          },
          {
            "do": "Compute $f_y$",
            "result": "$1/(2\\sqrt y)$",
            "why": "derivative of square root"
          },
          {
            "do": "Check continuity near $y=1$",
            "result": "continuous",
            "why": "denominator is not zero near $1$"
          },
          {
            "do": "Apply theorem",
            "result": "unique local solution",
            "why": "hypotheses hold around $(0,1)$"
          }
        ],
        "answer": "A unique local solution exists."
      },
      {
        "problem": "Check the theorem for $y'=\\sqrt{y}$, $y(0)=0$.",
        "steps": [
          {
            "do": "Identify $f$",
            "result": "$\\sqrt y$",
            "why": "right side"
          },
          {
            "do": "Check continuity of $f$",
            "result": "continuous for $y\\ge0$",
            "why": "square root itself is continuous"
          },
          {
            "do": "Compute $f_y$",
            "result": "$1/(2\\sqrt y)$",
            "why": "differentiate with respect to $y$"
          },
          {
            "do": "Evaluate at $y=0$",
            "result": "undefined",
            "why": "division by zero"
          },
          {
            "do": "State theorem result",
            "result": "uniqueness not guaranteed",
            "why": "a hypothesis fails"
          }
        ],
        "answer": "The theorem does not guarantee uniqueness at $(0,0)$."
      },
      {
        "problem": "For $y'=1/x+y$, $y(0)=2$, explain the problem.",
        "steps": [
          {
            "do": "Identify $f$",
            "result": "$f(x,y)=1/x+y$",
            "why": "right side"
          },
          {
            "do": "Check the initial $x$",
            "result": "$x_0=0$",
            "why": "from $y(0)=2$"
          },
          {
            "do": "Evaluate $1/x$ at zero",
            "result": "undefined",
            "why": "division by zero"
          },
          {
            "do": "Assess continuity",
            "result": "not continuous around $(0,2)$",
            "why": "no rectangle around $x=0$ avoids the singularity"
          },
          {
            "do": "State conclusion",
            "result": "the theorem does not apply",
            "why": "existence is not guaranteed by this theorem"
          }
        ],
        "answer": "The theorem does not apply because $f$ is undefined at the initial point."
      },
      {
        "problem": "For $y'=xy$, $y(2)=3$, verify uniqueness conditions.",
        "steps": [
          {
            "do": "Identify $f$",
            "result": "$xy$",
            "why": "right side"
          },
          {
            "do": "Check $f$",
            "result": "continuous everywhere",
            "why": "product of variables"
          },
          {
            "do": "Compute $f_y$",
            "result": "$x$",
            "why": "partial derivative with respect to $y$"
          },
          {
            "do": "Check $f_y$",
            "result": "continuous everywhere",
            "why": "linear function"
          },
          {
            "do": "Apply theorem",
            "result": "unique local solution through $(2,3)$",
            "why": "hypotheses hold"
          }
        ],
        "answer": "A unique local solution exists."
      },
      {
        "problem": "A model uses $h'=\\tanh(h)+t$, $h(0)=0.5$. Check uniqueness.",
        "steps": [
          {
            "do": "Identify $f$",
            "result": "$\\tanh(h)+t$",
            "why": "right side"
          },
          {
            "do": "Check continuity",
            "result": "continuous everywhere",
            "why": "$\\tanh$ and $t$ are continuous"
          },
          {
            "do": "Compute $f_h$",
            "result": "$\\operatorname{sech}^2(h)$",
            "why": "derivative of $\\tanh h$"
          },
          {
            "do": "Check derivative continuity",
            "result": "continuous everywhere",
            "why": "$\\operatorname{sech}^2$ is smooth"
          },
          {
            "do": "Apply theorem",
            "result": "unique local trajectory",
            "why": "conditions hold around $(0,0.5)$"
          }
        ],
        "answer": "The hidden-state trajectory is locally unique."
      }
    ],
    "applications": [
      {
        "title": "Numerical solver trust",
        "background": "ODE solvers approximate a solution curve; uniqueness says there is one curve to approximate near the start.",
        "numbers": "For $y'=xy$, $f_y=x$ is continuous, so the path through $(1,2)$ is unique locally."
      },
      {
        "title": "Direction-field crossings",
        "background": "In a uniqueness region, two solution curves cannot cross at the same point.",
        "numbers": "For $y'=x+y$, both $f$ and $f_y=1$ are continuous, so one point means one curve."
      },
      {
        "title": "Model debugging",
        "background": "If a right side is undefined at initial data, the model may be ill-posed.",
        "numbers": "The equation $y'=1/(y-2)$ with $y(0)=2$ fails because the slope is undefined."
      },
      {
        "title": "Nonunique edge cases",
        "background": "Failed hypotheses warn us to be careful, and sometimes real nonuniqueness appears.",
        "numbers": "For $y'=\\sqrt{|y|}$, $y(0)=0$, both $y=0$ and delayed-growth curves can satisfy the same start."
      },
      {
        "title": "Neural ODE flows",
        "background": "Continuous normalizing flows rely on well-behaved vector fields so trajectories are deterministic.",
        "numbers": "If a learned field has derivative with respect to state bounded by $3$, nearby states separate at a controlled local rate."
      },
      {
        "title": "Physical determinism",
        "background": "Classical models often assume one future from one state; uniqueness is the mathematical version of that assumption.",
        "numbers": "For $v'=-0.1v$, $v(0)=20$ gives one trajectory $20e^{-0.1t}$, not several."
      }
    ],
    "applicationsClose": "Existence–uniqueness is the quiet contract behind deterministic modeling: start here, follow this well-behaved slope field, and one local path is determined.",
    "takeaways": [
      "Check continuity of $f(x,y)$ for existence in the theorem.",
      "Check continuity of $f_y$ for uniqueness in the theorem.",
      "The guarantee is local and may not provide a formula.",
      "When hypotheses fail, investigate rather than assume the model is safe."
    ]
  }
};
