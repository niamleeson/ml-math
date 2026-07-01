module.exports = {
  "math-26-01": {
    "id": "math-26-01",
    "title": "Systems, signals, and feedback",
    "tagline": "Control begins with measuring what happened, comparing it with what you wanted, and adjusting.",
    "connections": {
      "buildsOn": [
        "functions",
        "input-output rules",
        "basic algebra"
      ],
      "leadsTo": [
        "Modeling with differential equations",
        "Block diagrams",
        "Stability"
      ],
      "usedWith": [
        "signals",
        "difference equations",
        "linear systems",
        "error functions"
      ]
    },
    "motivation": "<p>You already know feedback from steering a bike. If you drift left, you notice the error and gently steer right.</p><p>Control theory gives that instinct a precise language. A signal changes over time, a system transforms signals, and feedback uses the measured output to choose the next input.</p>",
    "definition": "<p>A <b>signal</b> is a time-varying quantity such as $u(t)$ or $y(t)$. A <b>system</b> maps input $u(t)$ to output $y(t)$. A reference $r(t)$ states the desired output, and negative-feedback error is $e(t)=r(t)-y(t)$. A proportional controller uses $u(t)=K e(t)$.</p><p>The sign is the key idea: when $y$ is too small, $e>0$ pushes the input upward; when $y$ is too large, $e<0$ backs the input off.</p><p><b>Assumptions that matter:</b> measurements are available when the controller acts; signals have compatible units; negative feedback subtracts output from reference; and large gain may destabilize a dynamic system.</p>",
    "worked": {
      "problem": "A plant has $y=2u$. With $r=10$ and $u=0.25(r-y)$, find the closed-loop output.",
      "skills": [
        "feedback error",
        "algebra",
        "equilibrium"
      ],
      "strategy": "The output appears inside its own controller, so substitute and solve the self-consistency equation.",
      "steps": [
        {
          "do": "Write the error",
          "result": "$e=10-y$",
          "why": "reference minus output"
        },
        {
          "do": "Write the controller",
          "result": "$u=0.25(10-y)$",
          "why": "gain multiplies error"
        },
        {
          "do": "Substitute into the plant",
          "result": "$y=2\\cdot0.25(10-y)$",
          "why": "plant output is twice input"
        },
        {
          "do": "Simplify",
          "result": "$y=5-0.5y$",
          "why": "multiply and distribute"
        },
        {
          "do": "Collect terms",
          "result": "$1.5y=5$",
          "why": "add $0.5y$ to both sides"
        },
        {
          "do": "Solve",
          "result": "$y=10/3\\approx3.33$",
          "why": "divide by $1.5$"
        }
      ],
      "verify": "The output is below the reference, so the remaining positive error keeps the heater on.",
      "answer": "$y=10/3\\approx3.33$.",
      "connects": "Feedback creates an equation in which output and input determine each other."
    },
    "practice": [
      {
        "problem": "For $y=3u$, compute $y$ when $u=4$, then error for $r=15$.",
        "steps": [
          {
            "do": "Apply the plant",
            "result": "$y=3\\cdot4$",
            "why": "substitute input"
          },
          {
            "do": "Multiply",
            "result": "$y=12$",
            "why": "compute output"
          },
          {
            "do": "Write error",
            "result": "$e=r-y$",
            "why": "compare target and output"
          },
          {
            "do": "Substitute",
            "result": "$e=15-12$",
            "why": "use the reference"
          },
          {
            "do": "Subtract",
            "result": "$e=3$",
            "why": "output is 3 low"
          }
        ],
        "answer": "$y=12$, $e=3$."
      },
      {
        "problem": "With $u=2e$, $r=8$, and $y=5$, find $e$ and $u$.",
        "steps": [
          {
            "do": "Compute error",
            "result": "$e=8-5$",
            "why": "reference minus measurement"
          },
          {
            "do": "Subtract",
            "result": "$e=3$",
            "why": "positive error"
          },
          {
            "do": "Use controller",
            "result": "$u=2\\cdot3$",
            "why": "gain is 2"
          },
          {
            "do": "Multiply",
            "result": "$u=6$",
            "why": "control effort"
          },
          {
            "do": "Interpret",
            "result": "positive input",
            "why": "the system is below target"
          }
        ],
        "answer": "$e=3$, $u=6$."
      },
      {
        "problem": "Plant $y=4u$, controller $u=0.1(20-y)$. Find equilibrium $y$.",
        "steps": [
          {
            "do": "Substitute",
            "result": "$y=4\\cdot0.1(20-y)$",
            "why": "close the loop"
          },
          {
            "do": "Simplify",
            "result": "$y=0.4(20-y)$",
            "why": "multiply constants"
          },
          {
            "do": "Distribute",
            "result": "$y=8-0.4y$",
            "why": "expand"
          },
          {
            "do": "Collect",
            "result": "$1.4y=8$",
            "why": "add $0.4y$"
          },
          {
            "do": "Divide",
            "result": "$y=40/7\\approx5.71$",
            "why": "solve"
          }
        ],
        "answer": "$y=40/7\\approx5.71$."
      },
      {
        "problem": "For $x_{k+1}=x_k+u_k$, $u_k=0.5(6-x_k)$, $x_0=0$, find $x_1,x_2$.",
        "steps": [
          {
            "do": "Compute $u_0$",
            "result": "$0.5(6-0)=3$",
            "why": "initial error is 6"
          },
          {
            "do": "Update",
            "result": "$x_1=0+3=3$",
            "why": "state equation"
          },
          {
            "do": "Compute $u_1$",
            "result": "$0.5(6-3)=1.5$",
            "why": "smaller error"
          },
          {
            "do": "Update",
            "result": "$x_2=3+1.5=4.5$",
            "why": "add input"
          },
          {
            "do": "Interpret",
            "result": "closer to 6",
            "why": "feedback reduces error"
          }
        ],
        "answer": "$x_1=3$, $x_2=4.5$."
      },
      {
        "problem": "An RL feedback action is $a=-0.2x$ with $x^+=x+a$. From $x_0=10$, find three states.",
        "steps": [
          {
            "do": "Substitute policy",
            "result": "$x^+=x-0.2x$",
            "why": "action depends on state"
          },
          {
            "do": "Combine",
            "result": "$x^+=0.8x$",
            "why": "closed-loop multiplier"
          },
          {
            "do": "Compute $x_1$",
            "result": "$8$",
            "why": "$0.8\\cdot10$"
          },
          {
            "do": "Compute $x_2$",
            "result": "$6.4$",
            "why": "$0.8\\cdot8$"
          },
          {
            "do": "Compute $x_3$",
            "result": "$5.12$",
            "why": "$0.8\\cdot6.4$"
          }
        ],
        "answer": "$x_1=8$, $x_2=6.4$, $x_3=5.12$."
      }
    ],
    "applications": [
      {
        "title": "Thermostats",
        "background": "Temperature control is the everyday doorway into feedback: measure, compare, and correct.",
        "numbers": "With target $22^\\circ$C and room $19^\\circ$C, error is $3^\\circ$C; gain $400$ W/degree commands $1200$ W."
      },
      {
        "title": "Cruise control",
        "background": "Cars use feedback to reject hills and wind while holding speed near a reference.",
        "numbers": "At $65$ mph target and $61$ mph measured speed, error is $4$ mph; gain $0.03$ gives throttle correction $0.12$."
      },
      {
        "title": "Robotics",
        "background": "Robot joints are controlled dynamic systems, so position and velocity errors become motor commands.",
        "numbers": "If joint error is $0.20$ rad and gain is $15$ N m/rad, commanded torque is $3$ N m."
      },
      {
        "title": "Gradient methods",
        "background": "Optimization can be read as a control law that moves parameters using slope feedback.",
        "numbers": "For $L(w)=(w-5)^2$ at $w=2$, gradient is $-6$; step size $0.1$ gives $w^+=2.6$."
      },
      {
        "title": "Reinforcement learning",
        "background": "An RL policy maps observed state to action, which is feedback when the action changes the next state.",
        "numbers": "If $a=-0.4x$ and $x=10$, then $a=-4$ and $x^+=x+a=6$ in a simple integrator."
      },
      {
        "title": "Online systems",
        "background": "Ad pacing, queues, and autoscaling all use measured error to adjust future decisions.",
        "numbers": "If planned spend is $8000$ dollars and actual spend is $7600$, error is $400$; gain $0.001$ changes a bid multiplier by $0.4$."
      }
    ],
    "applicationsClose": "Feedback is one correction story wearing many uniforms: heat, speed, gradients, queues, and policies.",
    "takeaways": [
      "A system maps input signals to output signals.",
      "Negative feedback uses $e=r-y$.",
      "Closed-loop values often require solving self-consistent equations.",
      "RL policies are feedback laws when actions depend on state."
    ]
  },
  "math-26-02": {
    "id": "math-26-02",
    "title": "Modeling with differential equations",
    "tagline": "Differential equations turn stories about rates into models we can predict and control.",
    "connections": {
      "buildsOn": [
        "derivatives",
        "Systems, signals, and feedback",
        "linear equations"
      ],
      "leadsTo": [
        "Transfer functions",
        "System response",
        "Stability"
      ],
      "usedWith": [
        "exponential functions",
        "state variables",
        "Euler steps",
        "linearization"
      ]
    },
    "motivation": "<p>You can describe many systems by saying how fast they change: a tank rises, a room warms, a robot joint slows under friction.</p><p>A differential equation writes that rate story as mathematics. Control uses these equations because controllers act on motion, not on frozen snapshots.</p>",
    "definition": "<p>A first-order controlled model is $\\dot{x}(t)=a x(t)+b u(t)$, where $x$ is state, $u$ is input, and $\\dot{x}$ is the derivative with respect to time. With constant $u_0$, equilibrium satisfies $0=a x^*+b u_0$.</p><p>If $a<0$, deviations from equilibrium decay like $e^{at}$. That is why the sign of the coefficient already tells a stability story.</p><p><b>Assumptions that matter:</b> time is continuous; coefficients are constant in this lesson; dots mean time derivatives; and linear equations may be local approximations to nonlinear systems.</p>",
    "worked": {
      "problem": "For $\\dot{x}=-0.4x+2u$ with constant $u=3$, find equilibrium and solution from $x(0)=0$.",
      "skills": [
        "ODE models",
        "equilibrium",
        "exponential response"
      ],
      "strategy": "Set the derivative to zero, then attach the decaying exponential around equilibrium.",
      "steps": [
        {
          "do": "Insert input",
          "result": "$\\dot{x}=-0.4x+6$",
          "why": "$2\\cdot3=6$"
        },
        {
          "do": "Set equilibrium",
          "result": "$0=-0.4x^*+6$",
          "why": "steady means no rate"
        },
        {
          "do": "Solve",
          "result": "$x^*=15$",
          "why": "$0.4x^*=6$"
        },
        {
          "do": "Write response",
          "result": "$x(t)=15+(0-15)e^{-0.4t}$",
          "why": "stable first-order form"
        },
        {
          "do": "Simplify",
          "result": "$x(t)=15-15e^{-0.4t}$",
          "why": "combine initial deviation"
        }
      ],
      "verify": "At $t=0$ the formula gives 0, and as $t\\to\\infty$ it approaches 15.",
      "answer": "$x^*=15$ and $x(t)=15(1-e^{-0.4t})$.",
      "connects": "A differential equation gives both the destination and the path toward it."
    },
    "practice": [
      {
        "problem": "Find equilibrium of $\\dot{x}=-2x+8$.",
        "steps": [
          {
            "do": "Set rate to zero",
            "result": "$0=-2x^*+8$",
            "why": "equilibrium"
          },
          {
            "do": "Move term",
            "result": "$2x^*=8$",
            "why": "add $2x^*$"
          },
          {
            "do": "Divide",
            "result": "$x^*=4$",
            "why": "solve"
          },
          {
            "do": "Check",
            "result": "$-2\\cdot4+8=0$",
            "why": "rate vanishes"
          },
          {
            "do": "Read sign",
            "result": "stable decay",
            "why": "coefficient is negative"
          }
        ],
        "answer": "$x^*=4$."
      },
      {
        "problem": "For $\\dot{h}=5-0.5h$, find equilibrium and initial slope at $h(0)=2$.",
        "steps": [
          {
            "do": "Set zero",
            "result": "$0=5-0.5h^*$",
            "why": "steady height"
          },
          {
            "do": "Solve",
            "result": "$h^*=10$",
            "why": "divide by $0.5$"
          },
          {
            "do": "Evaluate slope",
            "result": "$\\dot{h}(0)=5-0.5\\cdot2$",
            "why": "substitute initial height"
          },
          {
            "do": "Simplify",
            "result": "$\\dot{h}(0)=4$",
            "why": "compute"
          },
          {
            "do": "Interpret",
            "result": "height rises",
            "why": "positive slope"
          }
        ],
        "answer": "Equilibrium $10$, initial slope $4$."
      },
      {
        "problem": "For $\\dot{x}=-3x+12$, $x(0)=5$, find $x(t)$.",
        "steps": [
          {
            "do": "Set equilibrium",
            "result": "$0=-3x^*+12$",
            "why": "steady"
          },
          {
            "do": "Solve",
            "result": "$x^*=4$",
            "why": "divide by 3"
          },
          {
            "do": "Write form",
            "result": "$x(t)=4+(5-4)e^{-3t}$",
            "why": "decay rate 3"
          },
          {
            "do": "Simplify",
            "result": "$x(t)=4+e^{-3t}$",
            "why": "initial deviation 1"
          },
          {
            "do": "Check start",
            "result": "$4+1=5$",
            "why": "initial condition"
          }
        ],
        "answer": "$x(t)=4+e^{-3t}$."
      },
      {
        "problem": "Euler-discretize $\\dot{x}=-x+5$ with $\\Delta t=0.1$, $x_0=2$. Find $x_1,x_2$.",
        "steps": [
          {
            "do": "Write update",
            "result": "$x_{k+1}=x_k+0.1(-x_k+5)$",
            "why": "Euler step"
          },
          {
            "do": "Compute $x_1$",
            "result": "$2+0.1(3)=2.3$",
            "why": "first step"
          },
          {
            "do": "Compute rate at $x_1$",
            "result": "$-2.3+5=2.7$",
            "why": "new slope"
          },
          {
            "do": "Update",
            "result": "$x_2=2.3+0.27$",
            "why": "multiply by step size"
          },
          {
            "do": "Simplify",
            "result": "$x_2=2.57$",
            "why": "add"
          }
        ],
        "answer": "$x_1=2.3$, $x_2=2.57$."
      },
      {
        "problem": "For $\\dot{x}=x+u$, choose $u=-kx$ so $\\dot{x}=-2x$.",
        "steps": [
          {
            "do": "Substitute feedback",
            "result": "$\\dot{x}=x-kx$",
            "why": "replace input"
          },
          {
            "do": "Factor",
            "result": "$\\dot{x}=(1-k)x$",
            "why": "collect"
          },
          {
            "do": "Match coefficient",
            "result": "$1-k=-2$",
            "why": "desired dynamics"
          },
          {
            "do": "Solve",
            "result": "$k=3$",
            "why": "move terms"
          },
          {
            "do": "Check",
            "result": "$x-3x=-2x$",
            "why": "works"
          }
        ],
        "answer": "$k=3$."
      }
    ],
    "applications": [
      {
        "title": "Thermostats",
        "background": "Temperature control is the everyday doorway into feedback: measure, compare, and correct.",
        "numbers": "With target $22^\\circ$C and room $19^\\circ$C, error is $3^\\circ$C; gain $400$ W/degree commands $1200$ W."
      },
      {
        "title": "Cruise control",
        "background": "Cars use feedback to reject hills and wind while holding speed near a reference.",
        "numbers": "At $65$ mph target and $61$ mph measured speed, error is $4$ mph; gain $0.03$ gives throttle correction $0.12$."
      },
      {
        "title": "Robotics",
        "background": "Robot joints are controlled dynamic systems, so position and velocity errors become motor commands.",
        "numbers": "If joint error is $0.20$ rad and gain is $15$ N m/rad, commanded torque is $3$ N m."
      },
      {
        "title": "Gradient methods",
        "background": "Optimization can be read as a control law that moves parameters using slope feedback.",
        "numbers": "For $L(w)=(w-5)^2$ at $w=2$, gradient is $-6$; step size $0.1$ gives $w^+=2.6$."
      },
      {
        "title": "Reinforcement learning",
        "background": "An RL policy maps observed state to action, which is feedback when the action changes the next state.",
        "numbers": "If $a=-0.4x$ and $x=10$, then $a=-4$ and $x^+=x+a=6$ in a simple integrator."
      },
      {
        "title": "Online systems",
        "background": "Ad pacing, queues, and autoscaling all use measured error to adjust future decisions.",
        "numbers": "If planned spend is $8000$ dollars and actual spend is $7600$, error is $400$; gain $0.001$ changes a bid multiplier by $0.4$."
      }
    ],
    "applicationsClose": "Differential equations are the rate-language behind physical systems, optimization flows, and simulated environments.",
    "takeaways": [
      "A model $\\dot{x}=ax+bu$ describes state rate.",
      "Equilibrium is found by setting $\\dot{x}=0$.",
      "Negative coefficients produce exponential decay.",
      "Euler steps connect continuous models to computation."
    ]
  },
  "math-26-03": {
    "id": "math-26-03",
    "title": "Transfer functions",
    "tagline": "A transfer function is a linear system fingerprint in the Laplace domain.",
    "connections": {
      "buildsOn": [
        "previous control lesson",
        "algebra",
        "linear systems"
      ],
      "leadsTo": [
        "next control lesson",
        "controller design",
        "optimal control"
      ],
      "usedWith": [
        "transfer functions",
        "polynomial roots",
        "exponentials",
        "feedback"
      ]
    },
    "motivation": "<p>Differential equations are honest, but transfer functions make them easier to connect. After the Laplace transform, derivatives become powers of $s$.</p><p>The system then behaves like a fraction: multiply by the input transform to get the output transform.</p>",
    "definition": "<p>For a linear time-invariant system with zero initial conditions, the <b>transfer function</b> is $G(s)=Y(s)/U(s)$. For $\\dot{y}+ay=bu$, transforming gives $(s+a)Y=bU$, so $G(s)=b/(s+a)$.</p><p>Zero initial conditions matter because otherwise initial-state terms are mixed into $Y(s)$.</p><p><b>Assumptions that matter:</b> the model is linear and time-invariant; $s$ is the Laplace variable; and the ratio describes input-output behavior, not nonzero initial stored energy.</p>",
    "worked": {
      "problem": "Find $G(s)$ for $\\dot{y}+3y=6u$.",
      "skills": [
        "Laplace transform",
        "algebra"
      ],
      "strategy": "Transform, factor $Y$, and divide by $U$.",
      "steps": [
        {
          "do": "Transform",
          "result": "$sY+3Y=6U$",
          "why": "zero initial condition"
        },
        {
          "do": "Factor",
          "result": "$(s+3)Y=6U$",
          "why": "collect output"
        },
        {
          "do": "Divide by $U$",
          "result": "$(s+3)Y/U=6$",
          "why": "form ratio"
        },
        {
          "do": "Isolate",
          "result": "$Y/U=6/(s+3)$",
          "why": "divide"
        },
        {
          "do": "Name transfer",
          "result": "$G(s)=6/(s+3)$",
          "why": "definition"
        }
      ],
      "verify": "The DC gain is $G(0)=2$, matching the equilibrium gain.",
      "answer": "$G(s)=6/(s+3)$.",
      "connects": "The differential equation became an algebraic system block."
    },
    "practice": [
      {
        "problem": "Compute the basic quantity for $G(s)=4/(s+2)$.",
        "steps": [
          {
            "do": "Evaluate at zero",
            "result": "$G(0)=4/2$",
            "why": "DC value"
          },
          {
            "do": "Divide",
            "result": "$G(0)=2$",
            "why": "constant gain"
          },
          {
            "do": "Find pole",
            "result": "$s+2=0$",
            "why": "denominator root"
          },
          {
            "do": "Solve",
            "result": "$s=-2$",
            "why": "pole"
          },
          {
            "do": "Interpret",
            "result": "stable first-order mode",
            "why": "negative pole"
          }
        ],
        "answer": "DC gain $2$ and pole $-2$."
      },
      {
        "problem": "Reduce or solve the first-order equation $\\dot{x}=-x+5$.",
        "steps": [
          {
            "do": "Set derivative zero",
            "result": "$0=-x^*+5$",
            "why": "equilibrium"
          },
          {
            "do": "Solve",
            "result": "$x^*=5$",
            "why": "move terms"
          },
          {
            "do": "Use $x(0)=1$",
            "result": "$x(t)=5+(1-5)e^{-t}$",
            "why": "response form"
          },
          {
            "do": "Simplify",
            "result": "$x(t)=5-4e^{-t}$",
            "why": "initial deviation"
          },
          {
            "do": "Check final",
            "result": "$x\\to5$",
            "why": "exponential decays"
          }
        ],
        "answer": "$x^*=5$, $x(t)=5-4e^{-t}$ if $x(0)=1$."
      },
      {
        "problem": "For denominator $(s+1)(s+3)$, identify poles and stability.",
        "steps": [
          {
            "do": "Set first factor zero",
            "result": "$s+1=0$",
            "why": "pole condition"
          },
          {
            "do": "Solve first",
            "result": "$s=-1$",
            "why": "root"
          },
          {
            "do": "Set second factor zero",
            "result": "$s+3=0$",
            "why": "pole condition"
          },
          {
            "do": "Solve second",
            "result": "$s=-3$",
            "why": "root"
          },
          {
            "do": "Check signs",
            "result": "both negative",
            "why": "stable continuous-time poles"
          }
        ],
        "answer": "Poles $-1,-3$; stable."
      },
      {
        "problem": "For unity feedback with $G=K/(s+4)$, find the closed-loop pole.",
        "steps": [
          {
            "do": "Write equation",
            "result": "$1+K/(s+4)=0$",
            "why": "feedback denominator"
          },
          {
            "do": "Clear denominator",
            "result": "$s+4+K=0$",
            "why": "multiply"
          },
          {
            "do": "Solve",
            "result": "$s=-(4+K)$",
            "why": "isolate"
          },
          {
            "do": "Evaluate $K=2$",
            "result": "$s=-6$",
            "why": "example gain"
          },
          {
            "do": "Interpret",
            "result": "gain moves pole left",
            "why": "for positive $K$"
          }
        ],
        "answer": "Pole $s=-(4+K)$; for $K=2$, $s=-6$."
      },
      {
        "problem": "A discrete learning error follows $e_{k+1}=0.8e_k$ from $e_0=10$. Find $e_3$ and the limit.",
        "steps": [
          {
            "do": "Write formula",
            "result": "$e_k=10(0.8)^k$",
            "why": "repeat multiplier"
          },
          {
            "do": "Compute $e_1$",
            "result": "$8$",
            "why": "first step"
          },
          {
            "do": "Compute $e_2$",
            "result": "$6.4$",
            "why": "second step"
          },
          {
            "do": "Compute $e_3$",
            "result": "$5.12$",
            "why": "third step"
          },
          {
            "do": "Take limit",
            "result": "$0$",
            "why": "$|0.8|<1$"
          }
        ],
        "answer": "$e_3=5.12$ and the limit is $0$."
      }
    ],
    "applications": [
      {
        "title": "Step tests",
        "background": "Engineers use step inputs because they reveal gain and speed clearly.",
        "numbers": "If a unit step settles at $3$, the measured DC gain is $3$."
      },
      {
        "title": "Motor control",
        "background": "Motors are modeled by transfer functions and tuned by pole locations.",
        "numbers": "A pole at $-10$ has time constant $0.1$ s."
      },
      {
        "title": "Filters",
        "background": "Signal filters use poles and zeros to shape low and high frequencies.",
        "numbers": "$G(s)=100/(s+100)$ has DC gain $1$ and cutoff scale $100$ rad/s."
      },
      {
        "title": "Robotics",
        "background": "Robot joints need stable, well-damped response before hardware tests.",
        "numbers": "Poles $-2\\pm3j$ have envelope $e^{-2t}$ and period $2\\pi/3\\approx2.09$ s."
      },
      {
        "title": "Optimization",
        "background": "Training dynamics often behave like stable or unstable feedback loops near a point.",
        "numbers": "Error multiplier $0.9$ gives $0.9^{20}\\approx0.122$ after 20 steps."
      },
      {
        "title": "RL control",
        "background": "Learned policies change closed-loop dynamics, so control metrics help judge safety.",
        "numbers": "If $x^+=1.05x$, then 100 steps multiply state by $1.05^{100}\\approx131.5$."
      }
    ],
    "applicationsClose": "The same mathematics carries from classical control into optimization and reinforcement learning.",
    "takeaways": [
      "Linear control turns dynamics into algebra you can inspect.",
      "Poles, gains, and limits connect formulas to behavior.",
      "Stability and response metrics are design tools, not just definitions.",
      "The RL connection is closed-loop decision making over time."
    ]
  },
  "math-26-04": {
    "id": "math-26-04",
    "title": "Block diagrams",
    "tagline": "Block diagrams turn equations into connectable pieces of signal flow.",
    "connections": {
      "buildsOn": [
        "previous control lesson",
        "algebra",
        "linear systems"
      ],
      "leadsTo": [
        "next control lesson",
        "controller design",
        "optimal control"
      ],
      "usedWith": [
        "transfer functions",
        "polynomial roots",
        "exponentials",
        "feedback"
      ]
    },
    "motivation": "<p>Controllers, sensors, actuators, and plants can become hard to read as one long equation.</p><p>Block diagrams keep the structure visible. Series blocks multiply, parallel blocks add, and feedback loops reduce to a single closed-loop transfer.</p>",
    "definition": "<p>Series blocks $G_1$ and $G_2$ have equivalent $G_1G_2$. Parallel blocks have equivalent $G_1+G_2$. Negative feedback with forward path $G$ and feedback path $H$ gives $T(s)=G(s)/(1+G(s)H(s))$.</p><p>The formula follows from $Y=GE$ and $E=R-HY$, so $(1+GH)Y=GR$.</p><p><b>Assumptions that matter:</b> blocks are linear time-invariant; signals have compatible units; and the plus sign in $1+GH$ corresponds to negative feedback.</p>",
    "worked": {
      "problem": "For $C=2$, $P=5/(s+4)$, unity feedback, find $T(s)$.",
      "skills": [
        "block reduction",
        "feedback"
      ],
      "strategy": "Multiply the forward path and use $G/(1+G)$.",
      "steps": [
        {
          "do": "Multiply forward path",
          "result": "$G=10/(s+4)$",
          "why": "series blocks multiply"
        },
        {
          "do": "Use feedback formula",
          "result": "$T=G/(1+G)$",
          "why": "unity negative feedback"
        },
        {
          "do": "Substitute",
          "result": "$T=\\dfrac{10/(s+4)}{1+10/(s+4)}$",
          "why": "insert $G$"
        },
        {
          "do": "Combine denominator",
          "result": "$1+10/(s+4)=(s+14)/(s+4)$",
          "why": "common denominator"
        },
        {
          "do": "Simplify",
          "result": "$T=10/(s+14)$",
          "why": "cancel the common factor"
        }
      ],
      "verify": "The closed-loop pole is farther left than the plant pole, so the loop is faster.",
      "answer": "$T(s)=10/(s+14)$.",
      "connects": "Block diagrams reduce signal structure to one analyzable transfer."
    },
    "practice": [
      {
        "problem": "Compute the basic quantity for $G(s)=4/(s+2)$.",
        "steps": [
          {
            "do": "Evaluate at zero",
            "result": "$G(0)=4/2$",
            "why": "DC value"
          },
          {
            "do": "Divide",
            "result": "$G(0)=2$",
            "why": "constant gain"
          },
          {
            "do": "Find pole",
            "result": "$s+2=0$",
            "why": "denominator root"
          },
          {
            "do": "Solve",
            "result": "$s=-2$",
            "why": "pole"
          },
          {
            "do": "Interpret",
            "result": "stable first-order mode",
            "why": "negative pole"
          }
        ],
        "answer": "DC gain $2$ and pole $-2$."
      },
      {
        "problem": "Reduce or solve the first-order equation $\\dot{x}=-x+5$.",
        "steps": [
          {
            "do": "Set derivative zero",
            "result": "$0=-x^*+5$",
            "why": "equilibrium"
          },
          {
            "do": "Solve",
            "result": "$x^*=5$",
            "why": "move terms"
          },
          {
            "do": "Use $x(0)=1$",
            "result": "$x(t)=5+(1-5)e^{-t}$",
            "why": "response form"
          },
          {
            "do": "Simplify",
            "result": "$x(t)=5-4e^{-t}$",
            "why": "initial deviation"
          },
          {
            "do": "Check final",
            "result": "$x\\to5$",
            "why": "exponential decays"
          }
        ],
        "answer": "$x^*=5$, $x(t)=5-4e^{-t}$ if $x(0)=1$."
      },
      {
        "problem": "For denominator $(s+1)(s+3)$, identify poles and stability.",
        "steps": [
          {
            "do": "Set first factor zero",
            "result": "$s+1=0$",
            "why": "pole condition"
          },
          {
            "do": "Solve first",
            "result": "$s=-1$",
            "why": "root"
          },
          {
            "do": "Set second factor zero",
            "result": "$s+3=0$",
            "why": "pole condition"
          },
          {
            "do": "Solve second",
            "result": "$s=-3$",
            "why": "root"
          },
          {
            "do": "Check signs",
            "result": "both negative",
            "why": "stable continuous-time poles"
          }
        ],
        "answer": "Poles $-1,-3$; stable."
      },
      {
        "problem": "For unity feedback with $G=K/(s+4)$, find the closed-loop pole.",
        "steps": [
          {
            "do": "Write equation",
            "result": "$1+K/(s+4)=0$",
            "why": "feedback denominator"
          },
          {
            "do": "Clear denominator",
            "result": "$s+4+K=0$",
            "why": "multiply"
          },
          {
            "do": "Solve",
            "result": "$s=-(4+K)$",
            "why": "isolate"
          },
          {
            "do": "Evaluate $K=2$",
            "result": "$s=-6$",
            "why": "example gain"
          },
          {
            "do": "Interpret",
            "result": "gain moves pole left",
            "why": "for positive $K$"
          }
        ],
        "answer": "Pole $s=-(4+K)$; for $K=2$, $s=-6$."
      },
      {
        "problem": "A discrete learning error follows $e_{k+1}=0.8e_k$ from $e_0=10$. Find $e_3$ and the limit.",
        "steps": [
          {
            "do": "Write formula",
            "result": "$e_k=10(0.8)^k$",
            "why": "repeat multiplier"
          },
          {
            "do": "Compute $e_1$",
            "result": "$8$",
            "why": "first step"
          },
          {
            "do": "Compute $e_2$",
            "result": "$6.4$",
            "why": "second step"
          },
          {
            "do": "Compute $e_3$",
            "result": "$5.12$",
            "why": "third step"
          },
          {
            "do": "Take limit",
            "result": "$0$",
            "why": "$|0.8|<1$"
          }
        ],
        "answer": "$e_3=5.12$ and the limit is $0$."
      }
    ],
    "applications": [
      {
        "title": "Step tests",
        "background": "Engineers use step inputs because they reveal gain and speed clearly.",
        "numbers": "If a unit step settles at $3$, the measured DC gain is $3$."
      },
      {
        "title": "Motor control",
        "background": "Motors are modeled by transfer functions and tuned by pole locations.",
        "numbers": "A pole at $-10$ has time constant $0.1$ s."
      },
      {
        "title": "Filters",
        "background": "Signal filters use poles and zeros to shape low and high frequencies.",
        "numbers": "$G(s)=100/(s+100)$ has DC gain $1$ and cutoff scale $100$ rad/s."
      },
      {
        "title": "Robotics",
        "background": "Robot joints need stable, well-damped response before hardware tests.",
        "numbers": "Poles $-2\\pm3j$ have envelope $e^{-2t}$ and period $2\\pi/3\\approx2.09$ s."
      },
      {
        "title": "Optimization",
        "background": "Training dynamics often behave like stable or unstable feedback loops near a point.",
        "numbers": "Error multiplier $0.9$ gives $0.9^{20}\\approx0.122$ after 20 steps."
      },
      {
        "title": "RL control",
        "background": "Learned policies change closed-loop dynamics, so control metrics help judge safety.",
        "numbers": "If $x^+=1.05x$, then 100 steps multiply state by $1.05^{100}\\approx131.5$."
      }
    ],
    "applicationsClose": "The same mathematics carries from classical control into optimization and reinforcement learning.",
    "takeaways": [
      "Linear control turns dynamics into algebra you can inspect.",
      "Poles, gains, and limits connect formulas to behavior.",
      "Stability and response metrics are design tools, not just definitions.",
      "The RL connection is closed-loop decision making over time."
    ]
  },
  "math-26-05": {
    "id": "math-26-05",
    "title": "System response",
    "tagline": "System response is the time story after an input or initial condition.",
    "connections": {
      "buildsOn": [
        "previous control lesson",
        "algebra",
        "linear systems"
      ],
      "leadsTo": [
        "next control lesson",
        "controller design",
        "optimal control"
      ],
      "usedWith": [
        "transfer functions",
        "polynomial roots",
        "exponentials",
        "feedback"
      ]
    },
    "motivation": "<p>A model earns trust by predicting what happens after you press, command, or disturb it.</p><p>Response separates the final value from the transient memory of how the system started.</p>",
    "definition": "<p>For $\\dot{x}=-a x+b u_0$ with $a>0$, $x(t)=x^*+(x(0)-x^*)e^{-at}$ where $x^*=bu_0/a$. The exponential term is transient; $x^*$ is steady state.</p><p>Subtracting equilibrium gives $\\dot{z}=-az$, whose solution is $z(0)e^{-at}$.</p><p><b>Assumptions that matter:</b> the input is constant; the model is first-order; and higher-order systems can add several modes.</p>",
    "worked": {
      "problem": "For $\\dot{x}=-2x+6$, $x(0)=1$, find $x(t)$.",
      "skills": [
        "equilibrium",
        "response"
      ],
      "strategy": "Find the final value and add the decaying initial error.",
      "steps": [
        {
          "do": "Set equilibrium",
          "result": "$0=-2x^*+6$",
          "why": "steady state"
        },
        {
          "do": "Solve",
          "result": "$x^*=3$",
          "why": "divide by 2"
        },
        {
          "do": "Write form",
          "result": "$x(t)=3+(1-3)e^{-2t}$",
          "why": "first-order response"
        },
        {
          "do": "Simplify",
          "result": "$x(t)=3-2e^{-2t}$",
          "why": "initial error is $-2$"
        },
        {
          "do": "Evaluate limit",
          "result": "$x(t)\\to3$",
          "why": "exponential vanishes"
        }
      ],
      "verify": "At $t=0$, the expression gives $1$.",
      "answer": "$x(t)=3-2e^{-2t}$.",
      "connects": "Response is final value plus fading memory."
    },
    "practice": [
      {
        "problem": "Compute the basic quantity for $G(s)=4/(s+2)$.",
        "steps": [
          {
            "do": "Evaluate at zero",
            "result": "$G(0)=4/2$",
            "why": "DC value"
          },
          {
            "do": "Divide",
            "result": "$G(0)=2$",
            "why": "constant gain"
          },
          {
            "do": "Find pole",
            "result": "$s+2=0$",
            "why": "denominator root"
          },
          {
            "do": "Solve",
            "result": "$s=-2$",
            "why": "pole"
          },
          {
            "do": "Interpret",
            "result": "stable first-order mode",
            "why": "negative pole"
          }
        ],
        "answer": "DC gain $2$ and pole $-2$."
      },
      {
        "problem": "Reduce or solve the first-order equation $\\dot{x}=-x+5$.",
        "steps": [
          {
            "do": "Set derivative zero",
            "result": "$0=-x^*+5$",
            "why": "equilibrium"
          },
          {
            "do": "Solve",
            "result": "$x^*=5$",
            "why": "move terms"
          },
          {
            "do": "Use $x(0)=1$",
            "result": "$x(t)=5+(1-5)e^{-t}$",
            "why": "response form"
          },
          {
            "do": "Simplify",
            "result": "$x(t)=5-4e^{-t}$",
            "why": "initial deviation"
          },
          {
            "do": "Check final",
            "result": "$x\\to5$",
            "why": "exponential decays"
          }
        ],
        "answer": "$x^*=5$, $x(t)=5-4e^{-t}$ if $x(0)=1$."
      },
      {
        "problem": "For denominator $(s+1)(s+3)$, identify poles and stability.",
        "steps": [
          {
            "do": "Set first factor zero",
            "result": "$s+1=0$",
            "why": "pole condition"
          },
          {
            "do": "Solve first",
            "result": "$s=-1$",
            "why": "root"
          },
          {
            "do": "Set second factor zero",
            "result": "$s+3=0$",
            "why": "pole condition"
          },
          {
            "do": "Solve second",
            "result": "$s=-3$",
            "why": "root"
          },
          {
            "do": "Check signs",
            "result": "both negative",
            "why": "stable continuous-time poles"
          }
        ],
        "answer": "Poles $-1,-3$; stable."
      },
      {
        "problem": "For unity feedback with $G=K/(s+4)$, find the closed-loop pole.",
        "steps": [
          {
            "do": "Write equation",
            "result": "$1+K/(s+4)=0$",
            "why": "feedback denominator"
          },
          {
            "do": "Clear denominator",
            "result": "$s+4+K=0$",
            "why": "multiply"
          },
          {
            "do": "Solve",
            "result": "$s=-(4+K)$",
            "why": "isolate"
          },
          {
            "do": "Evaluate $K=2$",
            "result": "$s=-6$",
            "why": "example gain"
          },
          {
            "do": "Interpret",
            "result": "gain moves pole left",
            "why": "for positive $K$"
          }
        ],
        "answer": "Pole $s=-(4+K)$; for $K=2$, $s=-6$."
      },
      {
        "problem": "A discrete learning error follows $e_{k+1}=0.8e_k$ from $e_0=10$. Find $e_3$ and the limit.",
        "steps": [
          {
            "do": "Write formula",
            "result": "$e_k=10(0.8)^k$",
            "why": "repeat multiplier"
          },
          {
            "do": "Compute $e_1$",
            "result": "$8$",
            "why": "first step"
          },
          {
            "do": "Compute $e_2$",
            "result": "$6.4$",
            "why": "second step"
          },
          {
            "do": "Compute $e_3$",
            "result": "$5.12$",
            "why": "third step"
          },
          {
            "do": "Take limit",
            "result": "$0$",
            "why": "$|0.8|<1$"
          }
        ],
        "answer": "$e_3=5.12$ and the limit is $0$."
      }
    ],
    "applications": [
      {
        "title": "Step tests",
        "background": "Engineers use step inputs because they reveal gain and speed clearly.",
        "numbers": "If a unit step settles at $3$, the measured DC gain is $3$."
      },
      {
        "title": "Motor control",
        "background": "Motors are modeled by transfer functions and tuned by pole locations.",
        "numbers": "A pole at $-10$ has time constant $0.1$ s."
      },
      {
        "title": "Filters",
        "background": "Signal filters use poles and zeros to shape low and high frequencies.",
        "numbers": "$G(s)=100/(s+100)$ has DC gain $1$ and cutoff scale $100$ rad/s."
      },
      {
        "title": "Robotics",
        "background": "Robot joints need stable, well-damped response before hardware tests.",
        "numbers": "Poles $-2\\pm3j$ have envelope $e^{-2t}$ and period $2\\pi/3\\approx2.09$ s."
      },
      {
        "title": "Optimization",
        "background": "Training dynamics often behave like stable or unstable feedback loops near a point.",
        "numbers": "Error multiplier $0.9$ gives $0.9^{20}\\approx0.122$ after 20 steps."
      },
      {
        "title": "RL control",
        "background": "Learned policies change closed-loop dynamics, so control metrics help judge safety.",
        "numbers": "If $x^+=1.05x$, then 100 steps multiply state by $1.05^{100}\\approx131.5$."
      }
    ],
    "applicationsClose": "The same mathematics carries from classical control into optimization and reinforcement learning.",
    "takeaways": [
      "Linear control turns dynamics into algebra you can inspect.",
      "Poles, gains, and limits connect formulas to behavior.",
      "Stability and response metrics are design tools, not just definitions.",
      "The RL connection is closed-loop decision making over time."
    ]
  },
  "math-26-06": {
    "id": "math-26-06",
    "title": "Poles and zeros",
    "tagline": "Poles and zeros are the special locations that shape a transfer function.",
    "connections": {
      "buildsOn": [
        "previous control lesson",
        "algebra",
        "linear systems"
      ],
      "leadsTo": [
        "next control lesson",
        "controller design",
        "optimal control"
      ],
      "usedWith": [
        "transfer functions",
        "polynomial roots",
        "exponentials",
        "feedback"
      ]
    },
    "motivation": "<p>Once a transfer function is a fraction, the numerator and denominator roots become the map.</p><p>Poles create natural modes; zeros shape or block parts of the response.</p>",
    "definition": "<p>For $G(s)=N(s)/D(s)$, zeros solve $N(s)=0$ and poles solve $D(s)=0$ after cancellation. A pole at $p$ contributes a mode like $e^{pt}$.</p><p>This comes from $\\mathcal{L}^{-1}\\{1/(s+a)\\}=e^{-at}$.</p><p><b>Assumptions that matter:</b> simplified transfer functions show visible input-output poles; hidden cancellations can matter internally; and real systems have complex poles in conjugate pairs.</p>",
    "worked": {
      "problem": "For $G(s)=(s+2)/[(s+1)(s+4)]$, find zero, poles, and DC gain.",
      "skills": [
        "factoring",
        "pole-zero reading"
      ],
      "strategy": "Set numerator and denominator factors to zero, then evaluate $G(0)$.",
      "steps": [
        {
          "do": "Set numerator zero",
          "result": "$s+2=0$",
          "why": "zero condition"
        },
        {
          "do": "Solve zero",
          "result": "$s=-2$",
          "why": "subtract 2"
        },
        {
          "do": "Set denominator factors zero",
          "result": "$s+1=0$, $s+4=0$",
          "why": "pole conditions"
        },
        {
          "do": "Solve poles",
          "result": "$s=-1,-4$",
          "why": "roots of factors"
        },
        {
          "do": "Evaluate DC gain",
          "result": "$G(0)=2/(1\\cdot4)=1/2$",
          "why": "substitute $s=0$"
        }
      ],
      "verify": "Both poles have negative real parts, so their natural modes decay.",
      "answer": "Zero $-2$, poles $-1,-4$, DC gain $1/2$.",
      "connects": "Poles and zeros are roots with dynamic meaning."
    },
    "practice": [
      {
        "problem": "Compute the basic quantity for $G(s)=4/(s+2)$.",
        "steps": [
          {
            "do": "Evaluate at zero",
            "result": "$G(0)=4/2$",
            "why": "DC value"
          },
          {
            "do": "Divide",
            "result": "$G(0)=2$",
            "why": "constant gain"
          },
          {
            "do": "Find pole",
            "result": "$s+2=0$",
            "why": "denominator root"
          },
          {
            "do": "Solve",
            "result": "$s=-2$",
            "why": "pole"
          },
          {
            "do": "Interpret",
            "result": "stable first-order mode",
            "why": "negative pole"
          }
        ],
        "answer": "DC gain $2$ and pole $-2$."
      },
      {
        "problem": "Reduce or solve the first-order equation $\\dot{x}=-x+5$.",
        "steps": [
          {
            "do": "Set derivative zero",
            "result": "$0=-x^*+5$",
            "why": "equilibrium"
          },
          {
            "do": "Solve",
            "result": "$x^*=5$",
            "why": "move terms"
          },
          {
            "do": "Use $x(0)=1$",
            "result": "$x(t)=5+(1-5)e^{-t}$",
            "why": "response form"
          },
          {
            "do": "Simplify",
            "result": "$x(t)=5-4e^{-t}$",
            "why": "initial deviation"
          },
          {
            "do": "Check final",
            "result": "$x\\to5$",
            "why": "exponential decays"
          }
        ],
        "answer": "$x^*=5$, $x(t)=5-4e^{-t}$ if $x(0)=1$."
      },
      {
        "problem": "For denominator $(s+1)(s+3)$, identify poles and stability.",
        "steps": [
          {
            "do": "Set first factor zero",
            "result": "$s+1=0$",
            "why": "pole condition"
          },
          {
            "do": "Solve first",
            "result": "$s=-1$",
            "why": "root"
          },
          {
            "do": "Set second factor zero",
            "result": "$s+3=0$",
            "why": "pole condition"
          },
          {
            "do": "Solve second",
            "result": "$s=-3$",
            "why": "root"
          },
          {
            "do": "Check signs",
            "result": "both negative",
            "why": "stable continuous-time poles"
          }
        ],
        "answer": "Poles $-1,-3$; stable."
      },
      {
        "problem": "For unity feedback with $G=K/(s+4)$, find the closed-loop pole.",
        "steps": [
          {
            "do": "Write equation",
            "result": "$1+K/(s+4)=0$",
            "why": "feedback denominator"
          },
          {
            "do": "Clear denominator",
            "result": "$s+4+K=0$",
            "why": "multiply"
          },
          {
            "do": "Solve",
            "result": "$s=-(4+K)$",
            "why": "isolate"
          },
          {
            "do": "Evaluate $K=2$",
            "result": "$s=-6$",
            "why": "example gain"
          },
          {
            "do": "Interpret",
            "result": "gain moves pole left",
            "why": "for positive $K$"
          }
        ],
        "answer": "Pole $s=-(4+K)$; for $K=2$, $s=-6$."
      },
      {
        "problem": "A discrete learning error follows $e_{k+1}=0.8e_k$ from $e_0=10$. Find $e_3$ and the limit.",
        "steps": [
          {
            "do": "Write formula",
            "result": "$e_k=10(0.8)^k$",
            "why": "repeat multiplier"
          },
          {
            "do": "Compute $e_1$",
            "result": "$8$",
            "why": "first step"
          },
          {
            "do": "Compute $e_2$",
            "result": "$6.4$",
            "why": "second step"
          },
          {
            "do": "Compute $e_3$",
            "result": "$5.12$",
            "why": "third step"
          },
          {
            "do": "Take limit",
            "result": "$0$",
            "why": "$|0.8|<1$"
          }
        ],
        "answer": "$e_3=5.12$ and the limit is $0$."
      }
    ],
    "applications": [
      {
        "title": "Step tests",
        "background": "Engineers use step inputs because they reveal gain and speed clearly.",
        "numbers": "If a unit step settles at $3$, the measured DC gain is $3$."
      },
      {
        "title": "Motor control",
        "background": "Motors are modeled by transfer functions and tuned by pole locations.",
        "numbers": "A pole at $-10$ has time constant $0.1$ s."
      },
      {
        "title": "Filters",
        "background": "Signal filters use poles and zeros to shape low and high frequencies.",
        "numbers": "$G(s)=100/(s+100)$ has DC gain $1$ and cutoff scale $100$ rad/s."
      },
      {
        "title": "Robotics",
        "background": "Robot joints need stable, well-damped response before hardware tests.",
        "numbers": "Poles $-2\\pm3j$ have envelope $e^{-2t}$ and period $2\\pi/3\\approx2.09$ s."
      },
      {
        "title": "Optimization",
        "background": "Training dynamics often behave like stable or unstable feedback loops near a point.",
        "numbers": "Error multiplier $0.9$ gives $0.9^{20}\\approx0.122$ after 20 steps."
      },
      {
        "title": "RL control",
        "background": "Learned policies change closed-loop dynamics, so control metrics help judge safety.",
        "numbers": "If $x^+=1.05x$, then 100 steps multiply state by $1.05^{100}\\approx131.5$."
      }
    ],
    "applicationsClose": "The same mathematics carries from classical control into optimization and reinforcement learning.",
    "takeaways": [
      "Linear control turns dynamics into algebra you can inspect.",
      "Poles, gains, and limits connect formulas to behavior.",
      "Stability and response metrics are design tools, not just definitions.",
      "The RL connection is closed-loop decision making over time."
    ]
  },
  "math-26-07": {
    "id": "math-26-07",
    "title": "Stability",
    "tagline": "Stability asks whether disturbances fade, persist, or grow.",
    "connections": {
      "buildsOn": [
        "previous control lesson",
        "algebra",
        "linear systems"
      ],
      "leadsTo": [
        "next control lesson",
        "controller design",
        "optimal control"
      ],
      "usedWith": [
        "transfer functions",
        "polynomial roots",
        "exponentials",
        "feedback"
      ]
    },
    "motivation": "<p>A system can be fast and still unsafe if small errors grow. Stability is the first safety question.</p><p>For linear continuous-time systems, pole real parts answer it cleanly.</p>",
    "definition": "<p>A linear continuous-time system is <b>asymptotically stable</b> when all natural modes decay. For transfer-function poles $p_i$, this requires $\\operatorname{Re}(p_i)<0$ for every pole.</p><p>A mode $e^{pt}$ has magnitude $e^{\\operatorname{Re}(p)t}$, so negative real part shrinks.</p><p><b>Assumptions that matter:</b> the pole test is for linear time-invariant systems; cancellations may hide internal instability; and nonlinear systems require local or Lyapunov analysis.</p>",
    "worked": {
      "problem": "Decide stability of $G(s)=5/(s^2+6s+8)$.",
      "skills": [
        "factoring",
        "stability"
      ],
      "strategy": "Factor the denominator and check pole real parts.",
      "steps": [
        {
          "do": "Factor denominator",
          "result": "$s^2+6s+8=(s+2)(s+4)$",
          "why": "find roots"
        },
        {
          "do": "Set factors zero",
          "result": "$s=-2,-4$",
          "why": "pole locations"
        },
        {
          "do": "Check real parts",
          "result": "$-2<0$, $-4<0$",
          "why": "left half-plane"
        },
        {
          "do": "Connect modes",
          "result": "$e^{-2t}$ and $e^{-4t}$",
          "why": "both decay"
        },
        {
          "do": "Conclude",
          "result": "asymptotically stable",
          "why": "all poles decay"
        }
      ],
      "verify": "No pole can produce growth.",
      "answer": "The system is asymptotically stable.",
      "connects": "Stability is decay of every natural mode."
    },
    "practice": [
      {
        "problem": "Compute the basic quantity for $G(s)=4/(s+2)$.",
        "steps": [
          {
            "do": "Evaluate at zero",
            "result": "$G(0)=4/2$",
            "why": "DC value"
          },
          {
            "do": "Divide",
            "result": "$G(0)=2$",
            "why": "constant gain"
          },
          {
            "do": "Find pole",
            "result": "$s+2=0$",
            "why": "denominator root"
          },
          {
            "do": "Solve",
            "result": "$s=-2$",
            "why": "pole"
          },
          {
            "do": "Interpret",
            "result": "stable first-order mode",
            "why": "negative pole"
          }
        ],
        "answer": "DC gain $2$ and pole $-2$."
      },
      {
        "problem": "Reduce or solve the first-order equation $\\dot{x}=-x+5$.",
        "steps": [
          {
            "do": "Set derivative zero",
            "result": "$0=-x^*+5$",
            "why": "equilibrium"
          },
          {
            "do": "Solve",
            "result": "$x^*=5$",
            "why": "move terms"
          },
          {
            "do": "Use $x(0)=1$",
            "result": "$x(t)=5+(1-5)e^{-t}$",
            "why": "response form"
          },
          {
            "do": "Simplify",
            "result": "$x(t)=5-4e^{-t}$",
            "why": "initial deviation"
          },
          {
            "do": "Check final",
            "result": "$x\\to5$",
            "why": "exponential decays"
          }
        ],
        "answer": "$x^*=5$, $x(t)=5-4e^{-t}$ if $x(0)=1$."
      },
      {
        "problem": "For denominator $(s+1)(s+3)$, identify poles and stability.",
        "steps": [
          {
            "do": "Set first factor zero",
            "result": "$s+1=0$",
            "why": "pole condition"
          },
          {
            "do": "Solve first",
            "result": "$s=-1$",
            "why": "root"
          },
          {
            "do": "Set second factor zero",
            "result": "$s+3=0$",
            "why": "pole condition"
          },
          {
            "do": "Solve second",
            "result": "$s=-3$",
            "why": "root"
          },
          {
            "do": "Check signs",
            "result": "both negative",
            "why": "stable continuous-time poles"
          }
        ],
        "answer": "Poles $-1,-3$; stable."
      },
      {
        "problem": "For unity feedback with $G=K/(s+4)$, find the closed-loop pole.",
        "steps": [
          {
            "do": "Write equation",
            "result": "$1+K/(s+4)=0$",
            "why": "feedback denominator"
          },
          {
            "do": "Clear denominator",
            "result": "$s+4+K=0$",
            "why": "multiply"
          },
          {
            "do": "Solve",
            "result": "$s=-(4+K)$",
            "why": "isolate"
          },
          {
            "do": "Evaluate $K=2$",
            "result": "$s=-6$",
            "why": "example gain"
          },
          {
            "do": "Interpret",
            "result": "gain moves pole left",
            "why": "for positive $K$"
          }
        ],
        "answer": "Pole $s=-(4+K)$; for $K=2$, $s=-6$."
      },
      {
        "problem": "A discrete learning error follows $e_{k+1}=0.8e_k$ from $e_0=10$. Find $e_3$ and the limit.",
        "steps": [
          {
            "do": "Write formula",
            "result": "$e_k=10(0.8)^k$",
            "why": "repeat multiplier"
          },
          {
            "do": "Compute $e_1$",
            "result": "$8$",
            "why": "first step"
          },
          {
            "do": "Compute $e_2$",
            "result": "$6.4$",
            "why": "second step"
          },
          {
            "do": "Compute $e_3$",
            "result": "$5.12$",
            "why": "third step"
          },
          {
            "do": "Take limit",
            "result": "$0$",
            "why": "$|0.8|<1$"
          }
        ],
        "answer": "$e_3=5.12$ and the limit is $0$."
      }
    ],
    "applications": [
      {
        "title": "Step tests",
        "background": "Engineers use step inputs because they reveal gain and speed clearly.",
        "numbers": "If a unit step settles at $3$, the measured DC gain is $3$."
      },
      {
        "title": "Motor control",
        "background": "Motors are modeled by transfer functions and tuned by pole locations.",
        "numbers": "A pole at $-10$ has time constant $0.1$ s."
      },
      {
        "title": "Filters",
        "background": "Signal filters use poles and zeros to shape low and high frequencies.",
        "numbers": "$G(s)=100/(s+100)$ has DC gain $1$ and cutoff scale $100$ rad/s."
      },
      {
        "title": "Robotics",
        "background": "Robot joints need stable, well-damped response before hardware tests.",
        "numbers": "Poles $-2\\pm3j$ have envelope $e^{-2t}$ and period $2\\pi/3\\approx2.09$ s."
      },
      {
        "title": "Optimization",
        "background": "Training dynamics often behave like stable or unstable feedback loops near a point.",
        "numbers": "Error multiplier $0.9$ gives $0.9^{20}\\approx0.122$ after 20 steps."
      },
      {
        "title": "RL control",
        "background": "Learned policies change closed-loop dynamics, so control metrics help judge safety.",
        "numbers": "If $x^+=1.05x$, then 100 steps multiply state by $1.05^{100}\\approx131.5$."
      }
    ],
    "applicationsClose": "The same mathematics carries from classical control into optimization and reinforcement learning.",
    "takeaways": [
      "Linear control turns dynamics into algebra you can inspect.",
      "Poles, gains, and limits connect formulas to behavior.",
      "Stability and response metrics are design tools, not just definitions.",
      "The RL connection is closed-loop decision making over time."
    ]
  },
  "math-26-08": {
    "id": "math-26-08",
    "title": "Transient response",
    "tagline": "Transient response measures the temporary journey before settling.",
    "connections": {
      "buildsOn": [
        "previous control lesson",
        "algebra",
        "linear systems"
      ],
      "leadsTo": [
        "next control lesson",
        "controller design",
        "optimal control"
      ],
      "usedWith": [
        "transfer functions",
        "polynomial roots",
        "exponentials",
        "feedback"
      ]
    },
    "motivation": "<p>Two stable systems can end at the same value but feel very different on the way there.</p><p>Overshoot, rise, ringing, and settling time describe that journey.</p>",
    "definition": "<p>A standard second-order model is $G(s)=\\omega_n^2/(s^2+2\\zeta\\omega_n s+\\omega_n^2)$. For $0<\\zeta<1$, percent overshoot is $100e^{-\\zeta\\pi/\\sqrt{1-\\zeta^2}}$ and $T_s\\approx4/(\\zeta\\omega_n)$ for a 2 percent band.</p><p>These come from poles $-\\zeta\\omega_n\\pm j\\omega_n\\sqrt{1-\\zeta^2}$.</p><p><b>Assumptions that matter:</b> these are dominant second-order approximations; zeros can alter response; and the settling constant depends on tolerance.</p>",
    "worked": {
      "problem": "For $\\zeta=0.5$, $\\omega_n=8$, estimate overshoot and settling time.",
      "skills": [
        "second-order response"
      ],
      "strategy": "Use the standard overshoot and $4/(\\zeta\\omega_n)$ formulas.",
      "steps": [
        {
          "do": "Compute square root",
          "result": "$\\sqrt{1-0.5^2}=\\sqrt{0.75}\\approx0.866$",
          "why": "overshoot denominator"
        },
        {
          "do": "Compute exponent",
          "result": "$-0.5\\pi/0.866\\approx-1.814$",
          "why": "substitute damping"
        },
        {
          "do": "Exponentiate",
          "result": "$e^{-1.814}\\approx0.163$",
          "why": "overshoot fraction"
        },
        {
          "do": "Convert",
          "result": "$16.3\\%$",
          "why": "multiply by 100"
        },
        {
          "do": "Compute settling",
          "result": "$4/(0.5\\cdot8)=1$ s",
          "why": "2 percent rule"
        }
      ],
      "verify": "Moderate damping gives visible overshoot but quick settling.",
      "answer": "Overshoot about $16.3\\%$; settling time about $1$ s.",
      "connects": "Transient metrics translate pole geometry into time behavior."
    },
    "practice": [
      {
        "problem": "Compute the basic quantity for $G(s)=4/(s+2)$.",
        "steps": [
          {
            "do": "Evaluate at zero",
            "result": "$G(0)=4/2$",
            "why": "DC value"
          },
          {
            "do": "Divide",
            "result": "$G(0)=2$",
            "why": "constant gain"
          },
          {
            "do": "Find pole",
            "result": "$s+2=0$",
            "why": "denominator root"
          },
          {
            "do": "Solve",
            "result": "$s=-2$",
            "why": "pole"
          },
          {
            "do": "Interpret",
            "result": "stable first-order mode",
            "why": "negative pole"
          }
        ],
        "answer": "DC gain $2$ and pole $-2$."
      },
      {
        "problem": "Reduce or solve the first-order equation $\\dot{x}=-x+5$.",
        "steps": [
          {
            "do": "Set derivative zero",
            "result": "$0=-x^*+5$",
            "why": "equilibrium"
          },
          {
            "do": "Solve",
            "result": "$x^*=5$",
            "why": "move terms"
          },
          {
            "do": "Use $x(0)=1$",
            "result": "$x(t)=5+(1-5)e^{-t}$",
            "why": "response form"
          },
          {
            "do": "Simplify",
            "result": "$x(t)=5-4e^{-t}$",
            "why": "initial deviation"
          },
          {
            "do": "Check final",
            "result": "$x\\to5$",
            "why": "exponential decays"
          }
        ],
        "answer": "$x^*=5$, $x(t)=5-4e^{-t}$ if $x(0)=1$."
      },
      {
        "problem": "For denominator $(s+1)(s+3)$, identify poles and stability.",
        "steps": [
          {
            "do": "Set first factor zero",
            "result": "$s+1=0$",
            "why": "pole condition"
          },
          {
            "do": "Solve first",
            "result": "$s=-1$",
            "why": "root"
          },
          {
            "do": "Set second factor zero",
            "result": "$s+3=0$",
            "why": "pole condition"
          },
          {
            "do": "Solve second",
            "result": "$s=-3$",
            "why": "root"
          },
          {
            "do": "Check signs",
            "result": "both negative",
            "why": "stable continuous-time poles"
          }
        ],
        "answer": "Poles $-1,-3$; stable."
      },
      {
        "problem": "For unity feedback with $G=K/(s+4)$, find the closed-loop pole.",
        "steps": [
          {
            "do": "Write equation",
            "result": "$1+K/(s+4)=0$",
            "why": "feedback denominator"
          },
          {
            "do": "Clear denominator",
            "result": "$s+4+K=0$",
            "why": "multiply"
          },
          {
            "do": "Solve",
            "result": "$s=-(4+K)$",
            "why": "isolate"
          },
          {
            "do": "Evaluate $K=2$",
            "result": "$s=-6$",
            "why": "example gain"
          },
          {
            "do": "Interpret",
            "result": "gain moves pole left",
            "why": "for positive $K$"
          }
        ],
        "answer": "Pole $s=-(4+K)$; for $K=2$, $s=-6$."
      },
      {
        "problem": "A discrete learning error follows $e_{k+1}=0.8e_k$ from $e_0=10$. Find $e_3$ and the limit.",
        "steps": [
          {
            "do": "Write formula",
            "result": "$e_k=10(0.8)^k$",
            "why": "repeat multiplier"
          },
          {
            "do": "Compute $e_1$",
            "result": "$8$",
            "why": "first step"
          },
          {
            "do": "Compute $e_2$",
            "result": "$6.4$",
            "why": "second step"
          },
          {
            "do": "Compute $e_3$",
            "result": "$5.12$",
            "why": "third step"
          },
          {
            "do": "Take limit",
            "result": "$0$",
            "why": "$|0.8|<1$"
          }
        ],
        "answer": "$e_3=5.12$ and the limit is $0$."
      }
    ],
    "applications": [
      {
        "title": "Step tests",
        "background": "Engineers use step inputs because they reveal gain and speed clearly.",
        "numbers": "If a unit step settles at $3$, the measured DC gain is $3$."
      },
      {
        "title": "Motor control",
        "background": "Motors are modeled by transfer functions and tuned by pole locations.",
        "numbers": "A pole at $-10$ has time constant $0.1$ s."
      },
      {
        "title": "Filters",
        "background": "Signal filters use poles and zeros to shape low and high frequencies.",
        "numbers": "$G(s)=100/(s+100)$ has DC gain $1$ and cutoff scale $100$ rad/s."
      },
      {
        "title": "Robotics",
        "background": "Robot joints need stable, well-damped response before hardware tests.",
        "numbers": "Poles $-2\\pm3j$ have envelope $e^{-2t}$ and period $2\\pi/3\\approx2.09$ s."
      },
      {
        "title": "Optimization",
        "background": "Training dynamics often behave like stable or unstable feedback loops near a point.",
        "numbers": "Error multiplier $0.9$ gives $0.9^{20}\\approx0.122$ after 20 steps."
      },
      {
        "title": "RL control",
        "background": "Learned policies change closed-loop dynamics, so control metrics help judge safety.",
        "numbers": "If $x^+=1.05x$, then 100 steps multiply state by $1.05^{100}\\approx131.5$."
      }
    ],
    "applicationsClose": "The same mathematics carries from classical control into optimization and reinforcement learning.",
    "takeaways": [
      "Linear control turns dynamics into algebra you can inspect.",
      "Poles, gains, and limits connect formulas to behavior.",
      "Stability and response metrics are design tools, not just definitions.",
      "The RL connection is closed-loop decision making over time."
    ]
  },
  "math-26-09": {
    "id": "math-26-09",
    "title": "Steady-state response",
    "tagline": "Steady-state response asks what remains after transients disappear.",
    "connections": {
      "buildsOn": [
        "previous control lesson",
        "algebra",
        "linear systems"
      ],
      "leadsTo": [
        "next control lesson",
        "controller design",
        "optimal control"
      ],
      "usedWith": [
        "transfer functions",
        "polynomial roots",
        "exponentials",
        "feedback"
      ]
    },
    "motivation": "<p>After the shaking stops, what output or error is left? That is the steady-state question.</p><p>Stable transfer functions often let us answer with a limit instead of a full inverse transform.</p>",
    "definition": "<p>If all poles of $sY(s)$ are in the open left half-plane, the final value theorem says $\\lim_{t\\to\\infty}y(t)=\\lim_{s\\to0}sY(s)$. For stable $G$ and unit step input, $y(\\infty)=G(0)$.</p><p>For unity feedback with finite DC gain, step error is $e(\\infty)=1/(1+G(0))$.</p><p><b>Assumptions that matter:</b> the response must settle; step input has transform $1/s$; and integrators make DC gain infinite in the ideal model.</p>",
    "worked": {
      "problem": "For stable $G(s)=6/(s+3)$ with unit step input, find final output.",
      "skills": [
        "final value theorem",
        "DC gain"
      ],
      "strategy": "Use $Y=G/s$ and take $\\lim_{s\\to0}sY(s)$.",
      "steps": [
        {
          "do": "Write input",
          "result": "$U(s)=1/s$",
          "why": "unit step"
        },
        {
          "do": "Write output",
          "result": "$Y=6/[s(s+3)]$",
          "why": "multiply by $G$"
        },
        {
          "do": "Multiply by $s$",
          "result": "$sY=6/(s+3)$",
          "why": "final value theorem"
        },
        {
          "do": "Take limit",
          "result": "$6/3=2$",
          "why": "set $s=0$"
        },
        {
          "do": "Interpret",
          "result": "settles at 2",
          "why": "stable pole allows theorem"
        }
      ],
      "verify": "The pole is $-3$, so the response settles.",
      "answer": "The steady-state output is $2$.",
      "connects": "Steady state is DC gain for a stable step response."
    },
    "practice": [
      {
        "problem": "Compute the basic quantity for $G(s)=4/(s+2)$.",
        "steps": [
          {
            "do": "Evaluate at zero",
            "result": "$G(0)=4/2$",
            "why": "DC value"
          },
          {
            "do": "Divide",
            "result": "$G(0)=2$",
            "why": "constant gain"
          },
          {
            "do": "Find pole",
            "result": "$s+2=0$",
            "why": "denominator root"
          },
          {
            "do": "Solve",
            "result": "$s=-2$",
            "why": "pole"
          },
          {
            "do": "Interpret",
            "result": "stable first-order mode",
            "why": "negative pole"
          }
        ],
        "answer": "DC gain $2$ and pole $-2$."
      },
      {
        "problem": "Reduce or solve the first-order equation $\\dot{x}=-x+5$.",
        "steps": [
          {
            "do": "Set derivative zero",
            "result": "$0=-x^*+5$",
            "why": "equilibrium"
          },
          {
            "do": "Solve",
            "result": "$x^*=5$",
            "why": "move terms"
          },
          {
            "do": "Use $x(0)=1$",
            "result": "$x(t)=5+(1-5)e^{-t}$",
            "why": "response form"
          },
          {
            "do": "Simplify",
            "result": "$x(t)=5-4e^{-t}$",
            "why": "initial deviation"
          },
          {
            "do": "Check final",
            "result": "$x\\to5$",
            "why": "exponential decays"
          }
        ],
        "answer": "$x^*=5$, $x(t)=5-4e^{-t}$ if $x(0)=1$."
      },
      {
        "problem": "For denominator $(s+1)(s+3)$, identify poles and stability.",
        "steps": [
          {
            "do": "Set first factor zero",
            "result": "$s+1=0$",
            "why": "pole condition"
          },
          {
            "do": "Solve first",
            "result": "$s=-1$",
            "why": "root"
          },
          {
            "do": "Set second factor zero",
            "result": "$s+3=0$",
            "why": "pole condition"
          },
          {
            "do": "Solve second",
            "result": "$s=-3$",
            "why": "root"
          },
          {
            "do": "Check signs",
            "result": "both negative",
            "why": "stable continuous-time poles"
          }
        ],
        "answer": "Poles $-1,-3$; stable."
      },
      {
        "problem": "For unity feedback with $G=K/(s+4)$, find the closed-loop pole.",
        "steps": [
          {
            "do": "Write equation",
            "result": "$1+K/(s+4)=0$",
            "why": "feedback denominator"
          },
          {
            "do": "Clear denominator",
            "result": "$s+4+K=0$",
            "why": "multiply"
          },
          {
            "do": "Solve",
            "result": "$s=-(4+K)$",
            "why": "isolate"
          },
          {
            "do": "Evaluate $K=2$",
            "result": "$s=-6$",
            "why": "example gain"
          },
          {
            "do": "Interpret",
            "result": "gain moves pole left",
            "why": "for positive $K$"
          }
        ],
        "answer": "Pole $s=-(4+K)$; for $K=2$, $s=-6$."
      },
      {
        "problem": "A discrete learning error follows $e_{k+1}=0.8e_k$ from $e_0=10$. Find $e_3$ and the limit.",
        "steps": [
          {
            "do": "Write formula",
            "result": "$e_k=10(0.8)^k$",
            "why": "repeat multiplier"
          },
          {
            "do": "Compute $e_1$",
            "result": "$8$",
            "why": "first step"
          },
          {
            "do": "Compute $e_2$",
            "result": "$6.4$",
            "why": "second step"
          },
          {
            "do": "Compute $e_3$",
            "result": "$5.12$",
            "why": "third step"
          },
          {
            "do": "Take limit",
            "result": "$0$",
            "why": "$|0.8|<1$"
          }
        ],
        "answer": "$e_3=5.12$ and the limit is $0$."
      }
    ],
    "applications": [
      {
        "title": "Step tests",
        "background": "Engineers use step inputs because they reveal gain and speed clearly.",
        "numbers": "If a unit step settles at $3$, the measured DC gain is $3$."
      },
      {
        "title": "Motor control",
        "background": "Motors are modeled by transfer functions and tuned by pole locations.",
        "numbers": "A pole at $-10$ has time constant $0.1$ s."
      },
      {
        "title": "Filters",
        "background": "Signal filters use poles and zeros to shape low and high frequencies.",
        "numbers": "$G(s)=100/(s+100)$ has DC gain $1$ and cutoff scale $100$ rad/s."
      },
      {
        "title": "Robotics",
        "background": "Robot joints need stable, well-damped response before hardware tests.",
        "numbers": "Poles $-2\\pm3j$ have envelope $e^{-2t}$ and period $2\\pi/3\\approx2.09$ s."
      },
      {
        "title": "Optimization",
        "background": "Training dynamics often behave like stable or unstable feedback loops near a point.",
        "numbers": "Error multiplier $0.9$ gives $0.9^{20}\\approx0.122$ after 20 steps."
      },
      {
        "title": "RL control",
        "background": "Learned policies change closed-loop dynamics, so control metrics help judge safety.",
        "numbers": "If $x^+=1.05x$, then 100 steps multiply state by $1.05^{100}\\approx131.5$."
      }
    ],
    "applicationsClose": "The same mathematics carries from classical control into optimization and reinforcement learning.",
    "takeaways": [
      "Linear control turns dynamics into algebra you can inspect.",
      "Poles, gains, and limits connect formulas to behavior.",
      "Stability and response metrics are design tools, not just definitions.",
      "The RL connection is closed-loop decision making over time."
    ]
  },
  "math-26-10": {
    "id": "math-26-10",
    "title": "The Routh–Hurwitz criterion",
    "tagline": "Routh-Hurwitz tests stability from coefficients without solving every root.",
    "connections": {
      "buildsOn": [
        "previous control lesson",
        "algebra",
        "linear systems"
      ],
      "leadsTo": [
        "next control lesson",
        "controller design",
        "optimal control"
      ],
      "usedWith": [
        "transfer functions",
        "polynomial roots",
        "exponentials",
        "feedback"
      ]
    },
    "motivation": "<p>High-degree roots are messy, but designers often first need to know whether any root is in the right half-plane.</p><p>The Routh-Hurwitz criterion turns that question into a table and sign changes.</p>",
    "definition": "<p>For a real polynomial, the <b>Routh array</b> arranges coefficients so the number of sign changes in the first column equals the number of right-half-plane roots. For $s^3+a s^2+b s+c$, stability requires positive coefficients and $ab>c$.</p><p>The cubic first column is $1$, $a$, $(ab-c)/a$, $c$.</p><p><b>Assumptions that matter:</b> coefficients are real; the leading coefficient is positive; special zero rows need standard modifications; and the test counts roots but does not locate them.</p>",
    "worked": {
      "problem": "Use Routh-Hurwitz on $s^3+4s^2+5s+2$.",
      "skills": [
        "Routh array",
        "sign changes"
      ],
      "strategy": "Use the cubic first column and check signs.",
      "steps": [
        {
          "do": "Identify coefficients",
          "result": "$a=4$, $b=5$, $c=2$",
          "why": "cubic form"
        },
        {
          "do": "Compute middle entry",
          "result": "$(ab-c)/a=(20-2)/4$",
          "why": "Routh formula"
        },
        {
          "do": "Simplify",
          "result": "$18/4=4.5$",
          "why": "arithmetic"
        },
        {
          "do": "List first column",
          "result": "$1,4,4.5,2$",
          "why": "include leading and constant"
        },
        {
          "do": "Check signs",
          "result": "all positive",
          "why": "no sign changes"
        }
      ],
      "verify": "No sign changes means no right-half-plane roots.",
      "answer": "The polynomial is stable.",
      "connects": "Routh-Hurwitz turns stability into coefficient arithmetic."
    },
    "practice": [
      {
        "problem": "Compute the basic quantity for $G(s)=4/(s+2)$.",
        "steps": [
          {
            "do": "Evaluate at zero",
            "result": "$G(0)=4/2$",
            "why": "DC value"
          },
          {
            "do": "Divide",
            "result": "$G(0)=2$",
            "why": "constant gain"
          },
          {
            "do": "Find pole",
            "result": "$s+2=0$",
            "why": "denominator root"
          },
          {
            "do": "Solve",
            "result": "$s=-2$",
            "why": "pole"
          },
          {
            "do": "Interpret",
            "result": "stable first-order mode",
            "why": "negative pole"
          }
        ],
        "answer": "DC gain $2$ and pole $-2$."
      },
      {
        "problem": "Reduce or solve the first-order equation $\\dot{x}=-x+5$.",
        "steps": [
          {
            "do": "Set derivative zero",
            "result": "$0=-x^*+5$",
            "why": "equilibrium"
          },
          {
            "do": "Solve",
            "result": "$x^*=5$",
            "why": "move terms"
          },
          {
            "do": "Use $x(0)=1$",
            "result": "$x(t)=5+(1-5)e^{-t}$",
            "why": "response form"
          },
          {
            "do": "Simplify",
            "result": "$x(t)=5-4e^{-t}$",
            "why": "initial deviation"
          },
          {
            "do": "Check final",
            "result": "$x\\to5$",
            "why": "exponential decays"
          }
        ],
        "answer": "$x^*=5$, $x(t)=5-4e^{-t}$ if $x(0)=1$."
      },
      {
        "problem": "For denominator $(s+1)(s+3)$, identify poles and stability.",
        "steps": [
          {
            "do": "Set first factor zero",
            "result": "$s+1=0$",
            "why": "pole condition"
          },
          {
            "do": "Solve first",
            "result": "$s=-1$",
            "why": "root"
          },
          {
            "do": "Set second factor zero",
            "result": "$s+3=0$",
            "why": "pole condition"
          },
          {
            "do": "Solve second",
            "result": "$s=-3$",
            "why": "root"
          },
          {
            "do": "Check signs",
            "result": "both negative",
            "why": "stable continuous-time poles"
          }
        ],
        "answer": "Poles $-1,-3$; stable."
      },
      {
        "problem": "For unity feedback with $G=K/(s+4)$, find the closed-loop pole.",
        "steps": [
          {
            "do": "Write equation",
            "result": "$1+K/(s+4)=0$",
            "why": "feedback denominator"
          },
          {
            "do": "Clear denominator",
            "result": "$s+4+K=0$",
            "why": "multiply"
          },
          {
            "do": "Solve",
            "result": "$s=-(4+K)$",
            "why": "isolate"
          },
          {
            "do": "Evaluate $K=2$",
            "result": "$s=-6$",
            "why": "example gain"
          },
          {
            "do": "Interpret",
            "result": "gain moves pole left",
            "why": "for positive $K$"
          }
        ],
        "answer": "Pole $s=-(4+K)$; for $K=2$, $s=-6$."
      },
      {
        "problem": "A discrete learning error follows $e_{k+1}=0.8e_k$ from $e_0=10$. Find $e_3$ and the limit.",
        "steps": [
          {
            "do": "Write formula",
            "result": "$e_k=10(0.8)^k$",
            "why": "repeat multiplier"
          },
          {
            "do": "Compute $e_1$",
            "result": "$8$",
            "why": "first step"
          },
          {
            "do": "Compute $e_2$",
            "result": "$6.4$",
            "why": "second step"
          },
          {
            "do": "Compute $e_3$",
            "result": "$5.12$",
            "why": "third step"
          },
          {
            "do": "Take limit",
            "result": "$0$",
            "why": "$|0.8|<1$"
          }
        ],
        "answer": "$e_3=5.12$ and the limit is $0$."
      }
    ],
    "applications": [
      {
        "title": "Step tests",
        "background": "Engineers use step inputs because they reveal gain and speed clearly.",
        "numbers": "If a unit step settles at $3$, the measured DC gain is $3$."
      },
      {
        "title": "Motor control",
        "background": "Motors are modeled by transfer functions and tuned by pole locations.",
        "numbers": "A pole at $-10$ has time constant $0.1$ s."
      },
      {
        "title": "Filters",
        "background": "Signal filters use poles and zeros to shape low and high frequencies.",
        "numbers": "$G(s)=100/(s+100)$ has DC gain $1$ and cutoff scale $100$ rad/s."
      },
      {
        "title": "Robotics",
        "background": "Robot joints need stable, well-damped response before hardware tests.",
        "numbers": "Poles $-2\\pm3j$ have envelope $e^{-2t}$ and period $2\\pi/3\\approx2.09$ s."
      },
      {
        "title": "Optimization",
        "background": "Training dynamics often behave like stable or unstable feedback loops near a point.",
        "numbers": "Error multiplier $0.9$ gives $0.9^{20}\\approx0.122$ after 20 steps."
      },
      {
        "title": "RL control",
        "background": "Learned policies change closed-loop dynamics, so control metrics help judge safety.",
        "numbers": "If $x^+=1.05x$, then 100 steps multiply state by $1.05^{100}\\approx131.5$."
      }
    ],
    "applicationsClose": "The same mathematics carries from classical control into optimization and reinforcement learning.",
    "takeaways": [
      "Linear control turns dynamics into algebra you can inspect.",
      "Poles, gains, and limits connect formulas to behavior.",
      "Stability and response metrics are design tools, not just definitions.",
      "The RL connection is closed-loop decision making over time."
    ]
  },
  "math-26-11": {
    "id": "math-26-11",
    "title": "Root locus",
    "tagline": "Root locus shows how closed-loop poles move as feedback gain changes.",
    "connections": {
      "buildsOn": [
        "previous control lesson",
        "algebra",
        "linear systems"
      ],
      "leadsTo": [
        "next control lesson",
        "controller design",
        "optimal control"
      ],
      "usedWith": [
        "transfer functions",
        "polynomial roots",
        "exponentials",
        "feedback"
      ]
    },
    "motivation": "<p>Turning up gain can make a system faster, oscillatory, or unstable. Root locus draws that tradeoff before hardware is touched.</p><p>It follows the closed-loop poles as a scalar gain varies.</p>",
    "definition": "<p>For negative feedback with open-loop $L(s)=G(s)H(s)$ and gain $K\\ge0$, closed-loop poles satisfy $1+K L(s)=0$. The <b>root locus</b> is the set of solutions as $K$ changes.</p><p>It starts at open-loop poles when $K=0$ and moves toward zeros or infinity.</p><p><b>Assumptions that matter:</b> classical root locus uses linear time-invariant models and real scalar gain; nonlinear constraints and saturation still require separate checks.</p>",
    "worked": {
      "problem": "For unity feedback with $G(s)=1/[s(s+2)]$, find poles when $K=3$.",
      "skills": [
        "root locus",
        "quadratic roots"
      ],
      "strategy": "Write $1+KG=0$, clear denominators, and solve.",
      "steps": [
        {
          "do": "Write characteristic equation",
          "result": "$1+K/[s(s+2)]=0$",
          "why": "unity feedback"
        },
        {
          "do": "Clear denominator",
          "result": "$s(s+2)+K=0$",
          "why": "multiply through"
        },
        {
          "do": "Expand",
          "result": "$s^2+2s+K=0$",
          "why": "quadratic"
        },
        {
          "do": "Substitute $K=3$",
          "result": "$s^2+2s+3=0$",
          "why": "chosen gain"
        },
        {
          "do": "Solve",
          "result": "$s=-1\\pm j\\sqrt{2}$",
          "why": "quadratic formula"
        }
      ],
      "verify": "The real part is negative, so the poles are stable but oscillatory.",
      "answer": "$s=-1\\pm j\\sqrt{2}$.",
      "connects": "Root locus follows these poles as $K$ varies."
    },
    "practice": [
      {
        "problem": "Compute the basic quantity for $G(s)=4/(s+2)$.",
        "steps": [
          {
            "do": "Evaluate at zero",
            "result": "$G(0)=4/2$",
            "why": "DC value"
          },
          {
            "do": "Divide",
            "result": "$G(0)=2$",
            "why": "constant gain"
          },
          {
            "do": "Find pole",
            "result": "$s+2=0$",
            "why": "denominator root"
          },
          {
            "do": "Solve",
            "result": "$s=-2$",
            "why": "pole"
          },
          {
            "do": "Interpret",
            "result": "stable first-order mode",
            "why": "negative pole"
          }
        ],
        "answer": "DC gain $2$ and pole $-2$."
      },
      {
        "problem": "Reduce or solve the first-order equation $\\dot{x}=-x+5$.",
        "steps": [
          {
            "do": "Set derivative zero",
            "result": "$0=-x^*+5$",
            "why": "equilibrium"
          },
          {
            "do": "Solve",
            "result": "$x^*=5$",
            "why": "move terms"
          },
          {
            "do": "Use $x(0)=1$",
            "result": "$x(t)=5+(1-5)e^{-t}$",
            "why": "response form"
          },
          {
            "do": "Simplify",
            "result": "$x(t)=5-4e^{-t}$",
            "why": "initial deviation"
          },
          {
            "do": "Check final",
            "result": "$x\\to5$",
            "why": "exponential decays"
          }
        ],
        "answer": "$x^*=5$, $x(t)=5-4e^{-t}$ if $x(0)=1$."
      },
      {
        "problem": "For denominator $(s+1)(s+3)$, identify poles and stability.",
        "steps": [
          {
            "do": "Set first factor zero",
            "result": "$s+1=0$",
            "why": "pole condition"
          },
          {
            "do": "Solve first",
            "result": "$s=-1$",
            "why": "root"
          },
          {
            "do": "Set second factor zero",
            "result": "$s+3=0$",
            "why": "pole condition"
          },
          {
            "do": "Solve second",
            "result": "$s=-3$",
            "why": "root"
          },
          {
            "do": "Check signs",
            "result": "both negative",
            "why": "stable continuous-time poles"
          }
        ],
        "answer": "Poles $-1,-3$; stable."
      },
      {
        "problem": "For unity feedback with $G=K/(s+4)$, find the closed-loop pole.",
        "steps": [
          {
            "do": "Write equation",
            "result": "$1+K/(s+4)=0$",
            "why": "feedback denominator"
          },
          {
            "do": "Clear denominator",
            "result": "$s+4+K=0$",
            "why": "multiply"
          },
          {
            "do": "Solve",
            "result": "$s=-(4+K)$",
            "why": "isolate"
          },
          {
            "do": "Evaluate $K=2$",
            "result": "$s=-6$",
            "why": "example gain"
          },
          {
            "do": "Interpret",
            "result": "gain moves pole left",
            "why": "for positive $K$"
          }
        ],
        "answer": "Pole $s=-(4+K)$; for $K=2$, $s=-6$."
      },
      {
        "problem": "A discrete learning error follows $e_{k+1}=0.8e_k$ from $e_0=10$. Find $e_3$ and the limit.",
        "steps": [
          {
            "do": "Write formula",
            "result": "$e_k=10(0.8)^k$",
            "why": "repeat multiplier"
          },
          {
            "do": "Compute $e_1$",
            "result": "$8$",
            "why": "first step"
          },
          {
            "do": "Compute $e_2$",
            "result": "$6.4$",
            "why": "second step"
          },
          {
            "do": "Compute $e_3$",
            "result": "$5.12$",
            "why": "third step"
          },
          {
            "do": "Take limit",
            "result": "$0$",
            "why": "$|0.8|<1$"
          }
        ],
        "answer": "$e_3=5.12$ and the limit is $0$."
      }
    ],
    "applications": [
      {
        "title": "Step tests",
        "background": "Engineers use step inputs because they reveal gain and speed clearly.",
        "numbers": "If a unit step settles at $3$, the measured DC gain is $3$."
      },
      {
        "title": "Motor control",
        "background": "Motors are modeled by transfer functions and tuned by pole locations.",
        "numbers": "A pole at $-10$ has time constant $0.1$ s."
      },
      {
        "title": "Filters",
        "background": "Signal filters use poles and zeros to shape low and high frequencies.",
        "numbers": "$G(s)=100/(s+100)$ has DC gain $1$ and cutoff scale $100$ rad/s."
      },
      {
        "title": "Robotics",
        "background": "Robot joints need stable, well-damped response before hardware tests.",
        "numbers": "Poles $-2\\pm3j$ have envelope $e^{-2t}$ and period $2\\pi/3\\approx2.09$ s."
      },
      {
        "title": "Optimization",
        "background": "Training dynamics often behave like stable or unstable feedback loops near a point.",
        "numbers": "Error multiplier $0.9$ gives $0.9^{20}\\approx0.122$ after 20 steps."
      },
      {
        "title": "RL control",
        "background": "Learned policies change closed-loop dynamics, so control metrics help judge safety.",
        "numbers": "If $x^+=1.05x$, then 100 steps multiply state by $1.05^{100}\\approx131.5$."
      }
    ],
    "applicationsClose": "The same mathematics carries from classical control into optimization and reinforcement learning.",
    "takeaways": [
      "Linear control turns dynamics into algebra you can inspect.",
      "Poles, gains, and limits connect formulas to behavior.",
      "Stability and response metrics are design tools, not just definitions.",
      "The RL connection is closed-loop decision making over time."
    ]
  }
};
