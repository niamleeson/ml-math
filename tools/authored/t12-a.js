module.exports = {
  "math-12-01": {
    "id": "math-12-01",
    "title": "Parametrized curves",
    "tagline": "A parametrized curve lets a point move through space, so geometry becomes a story with time.",
    "connections": {
      "buildsOn": [
        "vectors",
        "functions of one variable",
        "coordinate geometry"
      ],
      "leadsTo": [
        "Arc length",
        "Curvature",
        "The Frenet frame"
      ],
      "usedWith": [
        "vector-valued functions",
        "velocity",
        "trigonometric functions",
        "linear algebra"
      ]
    },
    "motivation": "<p>You already know how to plot a point such as $(x,y)$. A parametrized curve adds motion: at each parameter value $t$, a rule tells us where the point is.</p><p>This makes circles, spirals, robot paths, and interpolation paths feel alike. The parameter may be time, angle, or just a label, but once the curve is $\\gamma(t)$, we can differentiate it and follow its direction.</p>",
    "definition": "<p>A <b>parametrized curve</b> in $\\mathbb{R}^n$ is a function $\\gamma:I\\to\\mathbb{R}^n$, written $\\gamma(t)=(x_1(t),\\ldots,x_n(t))$. Its derivative $\\gamma'(t)$ is the <b>velocity vector</b>.</p><p>The curve is <b>regular</b> at $t$ if $\\gamma'(t)\\ne\\mathbf{0}$. Regularity matters because a zero velocity gives no clear tangent direction. The image is the traced set of points; the parametrization also records order and speed.</p><p><b>Assumptions that matter:</b> coordinate functions are differentiable when we discuss velocity; $t$ is a parameter, not necessarily clock time; and two parametrizations can trace the same geometric path at different speeds.</p>",
    "worked": {
      "problem": "For $\\gamma(t)=(2t+1,t^2)$, find $\\gamma(2)$, $\\gamma'(t)$, and the tangent line at $t=2$.",
      "skills": [
        "vector-valued functions",
        "derivatives",
        "tangent lines"
      ],
      "strategy": "Evaluate position, differentiate coordinate by coordinate, then use point plus direction.",
      "steps": [
        {
          "do": "Substitute $t=2$ in the first coordinate",
          "result": "$2\\cdot2+1=5$",
          "why": "evaluate the x-coordinate"
        },
        {
          "do": "Substitute $t=2$ in the second coordinate",
          "result": "$2^2=4$",
          "why": "evaluate the y-coordinate"
        },
        {
          "do": "Write the position",
          "result": "$\\gamma(2)=(5,4)$",
          "why": "combine coordinates"
        },
        {
          "do": "Differentiate the curve",
          "result": "$\\gamma'(t)=(2,2t)$",
          "why": "differentiate coordinate by coordinate"
        },
        {
          "do": "Evaluate velocity at $t=2$",
          "result": "$\\gamma'(2)=(2,4)$",
          "why": "this is the tangent direction"
        },
        {
          "do": "Write the tangent line",
          "result": "$(x,y)=(5,4)+u(2,4)$",
          "why": "a line is point plus scalar times direction"
        }
      ],
      "verify": "The velocity $(2,4)$ is nonzero, so the tangent direction is valid.",
      "answer": "$\\gamma(2)=(5,4)$, $\\gamma'(t)=(2,2t)$, and the tangent line is $(x,y)=(5,4)+u(2,4)$.",
      "connects": "A parametrized curve turns tangent geometry into position plus velocity."
    },
    "practice": [
      {
        "problem": "For $\\gamma(t)=(t,3t-1)$, find $\\gamma(2)$ and $\\gamma'(t)$.",
        "steps": [
          {
            "do": "Evaluate the first coordinate at $2$",
            "result": "$2$",
            "why": "the first coordinate is t"
          },
          {
            "do": "Evaluate the second coordinate at $2$",
            "result": "$3\\cdot2-1=5$",
            "why": "substitute into the linear coordinate"
          },
          {
            "do": "Write the position",
            "result": "$\\gamma(2)=(2,5)$",
            "why": "combine coordinates"
          },
          {
            "do": "Differentiate the first coordinate",
            "result": "$1$",
            "why": "the derivative of t is 1"
          },
          {
            "do": "Differentiate the second coordinate",
            "result": "$3$",
            "why": "the derivative of $3t-1$ is 3"
          }
        ],
        "answer": "$\\gamma(2)=(2,5)$ and $\\gamma'(t)=(1,3)$."
      },
      {
        "problem": "For $\\gamma(t)=(\\cos t,\\sin t)$, compute $\\gamma(0)$ and $\\gamma'(0)$.",
        "steps": [
          {
            "do": "Evaluate the position",
            "result": "$\\gamma(0)=(1,0)$",
            "why": "$\\cos0=1$ and $\\sin0=0$"
          },
          {
            "do": "Differentiate $\\cos t$",
            "result": "$-\\sin t$",
            "why": "coordinatewise derivative"
          },
          {
            "do": "Differentiate $\\sin t$",
            "result": "$\\cos t$",
            "why": "coordinatewise derivative"
          },
          {
            "do": "Write velocity",
            "result": "$\\gamma'(t)=(-\\sin t,\\cos t)$",
            "why": "combine derivatives"
          },
          {
            "do": "Evaluate at zero",
            "result": "$\\gamma'(0)=(0,1)$",
            "why": "substitute trig values"
          }
        ],
        "answer": "$\\gamma(0)=(1,0)$ and $\\gamma'(0)=(0,1)$."
      },
      {
        "problem": "Show that $\\gamma(t)=(t^2,t^3)$ is not regular at $t=0$.",
        "steps": [
          {
            "do": "Differentiate first coordinate",
            "result": "$2t$",
            "why": "power rule"
          },
          {
            "do": "Differentiate second coordinate",
            "result": "$3t^2$",
            "why": "power rule"
          },
          {
            "do": "Write velocity",
            "result": "$\\gamma'(t)=(2t,3t^2)$",
            "why": "regularity depends on this vector"
          },
          {
            "do": "Evaluate at $t=0$",
            "result": "$\\gamma'(0)=(0,0)$",
            "why": "both components vanish"
          },
          {
            "do": "Apply regularity definition",
            "result": "not regular at 0",
            "why": "regular means nonzero velocity"
          }
        ],
        "answer": "It is not regular at $t=0$ because $\\gamma'(0)=\\mathbf{0}$."
      },
      {
        "problem": "Find the tangent line to $\\gamma(t)=(t^2,2t+1)$ at $t=3$.",
        "steps": [
          {
            "do": "Evaluate position",
            "result": "$\\gamma(3)=(9,7)$",
            "why": "$3^2=9$ and $2\\cdot3+1=7$"
          },
          {
            "do": "Differentiate",
            "result": "$\\gamma'(t)=(2t,2)$",
            "why": "coordinate derivatives"
          },
          {
            "do": "Evaluate velocity",
            "result": "$\\gamma'(3)=(6,2)$",
            "why": "substitute 3"
          },
          {
            "do": "Check direction",
            "result": "$(6,2)\\ne(0,0)$",
            "why": "the curve is regular there"
          },
          {
            "do": "Write line",
            "result": "$(x,y)=(9,7)+u(6,2)$",
            "why": "point plus direction"
          }
        ],
        "answer": "The tangent line is $(x,y)=(9,7)+u(6,2)$."
      },
      {
        "problem": "A robot path is $\\gamma(t)=(1+4t,2+3t)$ meters. Find position and velocity at $t=2$, then predict position at $t=2.5$.",
        "steps": [
          {
            "do": "Evaluate position",
            "result": "$\\gamma(2)=(9,8)$",
            "why": "compute both coordinates"
          },
          {
            "do": "Differentiate path",
            "result": "$\\gamma'(t)=(4,3)$",
            "why": "constant coordinate rates"
          },
          {
            "do": "Read velocity",
            "result": "$(4,3)$ meters per second",
            "why": "the derivative is constant"
          },
          {
            "do": "Compute time change",
            "result": "$2.5-2=0.5$",
            "why": "prediction uses half a second"
          },
          {
            "do": "Add velocity times time",
            "result": "$(9,8)+0.5(4,3)=(11,9.5)$",
            "why": "linear motion has constant velocity"
          }
        ],
        "answer": "At $t=2$ the robot is at $(9,8)$ with velocity $(4,3)$ m/s; at $t=2.5$ it is at $(11,9.5)$."
      }
    ],
    "applications": [
      {
        "title": "Robot trajectories",
        "background": "Robotics describes a moving body by position as a function of time, so controllers can use velocity.",
        "numbers": "For $\\gamma(t)=(2t,1+t)$ meters, $\\gamma(4)=(8,5)$ and $\\gamma'(t)=(2,1)$."
      },
      {
        "title": "Animation paths",
        "background": "Computer animation moves cameras and characters along parametrized curves between keyframes.",
        "numbers": "The path $\\gamma(t)=(10\\cos t,10\\sin t,2)$ has radius $10$ and starts at $(10,0,2)$."
      },
      {
        "title": "Feature interpolation",
        "background": "ML systems often inspect straight paths between embeddings to see how representations change.",
        "numbers": "Between $a=(1,2)$ and $b=(5,4)$, $\\gamma(0.25)=0.75a+0.25b=(2,2.5)$."
      },
      {
        "title": "Projectile motion",
        "background": "Classical mechanics models position by a parametrized curve and velocity by its derivative.",
        "numbers": "With $\\gamma(t)=(20t,30t-4.9t^2)$, at $t=2$ the point is $(40,40.4)$."
      },
      {
        "title": "Bezier design curves",
        "background": "Fonts and vector graphics use polynomial parametrized curves because control points shape the trace.",
        "numbers": "A linear Bezier curve from $(0,0)$ to $(6,3)$ gives $\\gamma(0.5)=(3,1.5)$."
      },
      {
        "title": "Optimization paths",
        "background": "Gradient descent creates a path through parameter space, even when we only sample it at steps.",
        "numbers": "If $w(t)=5-0.2t$, then $w(10)=3$ and $w'(t)=-0.2$."
      }
    ],
    "applicationsClose": "Across robots, graphics, physics, embeddings, and optimization, a curve is geometry with a parameter attached.",
    "takeaways": [
      "A parametrized curve is a map $\\gamma:I\\to\\mathbb{R}^n$.",
      "Velocity is $\\gamma'(t)$, computed coordinate by coordinate.",
      "Regularity means $\\gamma'(t)\\ne\\mathbf{0}$.",
      "Different parametrizations can trace the same image at different speeds."
    ]
  },
  "math-12-02": {
    "id": "math-12-02",
    "title": "Arc length",
    "tagline": "Arc length measures how far a curve actually travels, not just how far its endpoints sit apart.",
    "connections": {
      "buildsOn": [
        "Parametrized curves",
        "vector norms",
        "definite integrals"
      ],
      "leadsTo": [
        "Curvature",
        "The Frenet frame",
        "The first fundamental form"
      ],
      "usedWith": [
        "speed",
        "integrals",
        "reparametrization",
        "Euclidean distance"
      ]
    },
    "motivation": "<p>You already know straight-line distance. But a winding trail, a circle, or a robot path can travel much farther than the distance between start and finish.</p><p>Arc length adds up tiny straight pieces along the curve. In the limit, each tiny piece has length speed times $dt$, so total distance is the integral of speed.</p>",
    "definition": "<p>If $\\gamma:[a,b]\\to\\mathbb{R}^n$ is continuously differentiable, its <b>arc length</b> is $$L=\\int_a^b\\|\\gamma'(t)\\|\\,dt.$$ For $\\gamma(t)=(x(t),y(t))$, speed is $\\sqrt{(x'(t))^2+(y'(t))^2}$.</p><p>The formula comes from approximating a short displacement by $\\gamma'(t)\\Delta t$. Its length is approximately $\\|\\gamma'(t)\\|\\Delta t$, and adding these pieces becomes an integral.</p><p><b>Assumptions that matter:</b> the velocity should exist and be integrable; length counts repeated tracing; and constant speed makes length equal speed times parameter time.</p>",
    "worked": {
      "problem": "Find the length of $\\gamma(t)=(3t,4t)$ for $0\\le t\\le2$.",
      "skills": [
        "velocity",
        "norms",
        "arc length integrals"
      ],
      "strategy": "Compute speed first; total length is the integral of speed.",
      "steps": [
        {
          "do": "Differentiate the curve",
          "result": "$\\gamma'(t)=(3,4)$",
          "why": "velocity is coordinatewise derivative"
        },
        {
          "do": "Compute speed",
          "result": "$\\|\\gamma'(t)\\|=\\sqrt{3^2+4^2}$",
          "why": "use the Euclidean norm"
        },
        {
          "do": "Simplify speed",
          "result": "$5$",
          "why": "$9+16=25$"
        },
        {
          "do": "Set up length",
          "result": "$L=\\int_0^2 5\\,dt$",
          "why": "integrate speed"
        },
        {
          "do": "Evaluate",
          "result": "$L=10$",
          "why": "constant speed 5 over interval length 2"
        }
      ],
      "verify": "The endpoint distance from $(0,0)$ to $(6,8)$ is $10$, so the straight path check agrees.",
      "answer": "The arc length is $10$.",
      "connects": "Arc length turns velocity into total distance traveled."
    },
    "practice": [
      {
        "problem": "Find the length of $\\gamma(t)=(t,0)$ for $0\\le t\\le7$.",
        "steps": [
          {
            "do": "Differentiate",
            "result": "$\\gamma'(t)=(1,0)$",
            "why": "velocity along the x-axis"
          },
          {
            "do": "Compute speed",
            "result": "$1$",
            "why": "norm of $(1,0)$"
          },
          {
            "do": "Set up length",
            "result": "$L=\\int_0^7 1\\,dt$",
            "why": "integrate speed"
          },
          {
            "do": "Evaluate",
            "result": "$L=7$",
            "why": "interval length is 7"
          },
          {
            "do": "Compare endpoints",
            "result": "$(0,0)$ to $(7,0)$",
            "why": "straight distance is also 7"
          }
        ],
        "answer": "The length is $7$."
      },
      {
        "problem": "Find the length of $\\gamma(t)=(2t,t)$ for $0\\le t\\le3$.",
        "steps": [
          {
            "do": "Differentiate",
            "result": "$\\gamma'(t)=(2,1)$",
            "why": "coordinate derivatives"
          },
          {
            "do": "Compute speed",
            "result": "$\\sqrt{2^2+1^2}=\\sqrt5$",
            "why": "norm of velocity"
          },
          {
            "do": "Set up integral",
            "result": "$L=\\int_0^3\\sqrt5\\,dt$",
            "why": "speed is constant"
          },
          {
            "do": "Evaluate",
            "result": "$3\\sqrt5$",
            "why": "multiply by interval length"
          },
          {
            "do": "Approximate",
            "result": "$3\\sqrt5\\approx6.708$",
            "why": "$\\sqrt5\\approx2.236$"
          }
        ],
        "answer": "The length is $3\\sqrt5\\approx6.708$."
      },
      {
        "problem": "Find the circumference traced by $\\gamma(t)=(2\\cos t,2\\sin t)$ for $0\\le t\\le2\\pi$.",
        "steps": [
          {
            "do": "Differentiate",
            "result": "$\\gamma'(t)=(-2\\sin t,2\\cos t)$",
            "why": "coordinate derivatives"
          },
          {
            "do": "Compute speed",
            "result": "$\\sqrt{4\\sin^2t+4\\cos^2t}$",
            "why": "norm of velocity"
          },
          {
            "do": "Use the identity",
            "result": "$2$",
            "why": "$\\sin^2t+\\cos^2t=1$"
          },
          {
            "do": "Integrate",
            "result": "$L=\\int_0^{2\\pi}2\\,dt$",
            "why": "one full turn"
          },
          {
            "do": "Evaluate",
            "result": "$4\\pi$",
            "why": "$2(2\\pi)=4\\pi$"
          }
        ],
        "answer": "The length is $4\\pi$."
      },
      {
        "problem": "Find the length of $\\gamma(t)=(t,t^2)$ for $0\\le t\\le1$ as an integral, then use $\\int_0^1\\sqrt{1+4t^2}\\,dt\\approx1.479$.",
        "steps": [
          {
            "do": "Differentiate",
            "result": "$\\gamma'(t)=(1,2t)$",
            "why": "coordinate derivatives"
          },
          {
            "do": "Compute speed",
            "result": "$\\sqrt{1+4t^2}$",
            "why": "norm of velocity"
          },
          {
            "do": "Set up length",
            "result": "$L=\\int_0^1\\sqrt{1+4t^2}\\,dt$",
            "why": "integrate speed"
          },
          {
            "do": "Use the approximation",
            "result": "$L\\approx1.479$",
            "why": "numerical integration"
          },
          {
            "do": "Compare to chord",
            "result": "$\\sqrt2\\approx1.414$",
            "why": "the curved path is longer"
          }
        ],
        "answer": "$L=\\int_0^1\\sqrt{1+4t^2}\\,dt\\approx1.479$."
      },
      {
        "problem": "An embedding interpolation is $\\gamma(t)=(1+6t,2+8t)$ for $0\\le t\\le1$. Find its path length.",
        "steps": [
          {
            "do": "Differentiate",
            "result": "$\\gamma'(t)=(6,8)$",
            "why": "feature velocity"
          },
          {
            "do": "Compute speed",
            "result": "$\\sqrt{6^2+8^2}$",
            "why": "Euclidean norm"
          },
          {
            "do": "Simplify speed",
            "result": "$10$",
            "why": "$36+64=100$"
          },
          {
            "do": "Integrate",
            "result": "$L=\\int_0^1 10\\,dt$",
            "why": "length is speed integral"
          },
          {
            "do": "Evaluate",
            "result": "$10$",
            "why": "one unit of parameter time"
          }
        ],
        "answer": "The interpolation path length is $10$ feature units."
      }
    ],
    "applications": [
      {
        "title": "Robot path distance",
        "background": "Robots need travel distance for energy and timing, not merely endpoint displacement.",
        "numbers": "Speed $1.5$ m/s for $8$ seconds gives length $\\int_0^8 1.5\\,dt=12$ m."
      },
      {
        "title": "Road mapping",
        "background": "Map software sums many short route pieces, a discrete version of arc length.",
        "numbers": "Segments $0.8$, $1.1$, and $0.6$ km total $2.5$ km."
      },
      {
        "title": "Animation timing",
        "background": "A camera moving at constant perceived speed needs arc length to allocate time.",
        "numbers": "A path of length $24$ m at $3$ m/s takes $8$ seconds."
      },
      {
        "title": "Signal trajectories",
        "background": "A multifeature signal traces a curve, and length measures total joint variation.",
        "numbers": "For $\\gamma(t)=(3t,4t)$ on $[0,1]$, total length is $5$."
      },
      {
        "title": "Embedding walks",
        "background": "Latent-space walks are judged by distance traveled in representation space.",
        "numbers": "From $(1,1)$ to $(4,5)$, a straight interpolation has length $\\sqrt{3^2+4^2}=5$."
      },
      {
        "title": "Manufacturing toolpaths",
        "background": "CNC machines and 3-D printers estimate material and runtime from path length.",
        "numbers": "At $50$ mm/s, a $350$ mm toolpath takes $350/50=7$ seconds."
      }
    ],
    "applicationsClose": "Arc length is the shared distance ledger for motion, maps, models, and machines.",
    "takeaways": [
      "Arc length is $\\int_a^b\\|\\gamma'(t)\\|\\,dt$.",
      "Speed is the norm of the velocity vector.",
      "Straight paths match endpoint distance; curved paths can be longer.",
      "Constant speed makes length equal speed times parameter interval."
    ]
  },
  "math-12-03": {
    "id": "math-12-03",
    "title": "Curvature",
    "tagline": "Curvature measures how quickly a curve changes direction, not how quickly it moves.",
    "connections": {
      "buildsOn": [
        "Arc length",
        "unit tangent vectors",
        "derivatives"
      ],
      "leadsTo": [
        "The Frenet frame",
        "The second fundamental form",
        "Gaussian curvature"
      ],
      "usedWith": [
        "normal vectors",
        "circles",
        "acceleration",
        "arc-length parametrization"
      ]
    },
    "motivation": "<p>You can feel curvature when a car turns. Speed changes the force you feel, but the road's sharpness is about how quickly the direction of the road turns per meter traveled.</p><p>Curvature removes speed and watches the unit tangent vector rotate along arc length. A line has curvature $0$; a small circle curves more sharply than a large circle.</p>",
    "definition": "<p>For a regular curve with arc length $s$ and unit tangent $\\mathbf{T}$, the <b>curvature</b> is $$\\kappa=\\left\\|\\dfrac{d\\mathbf{T}}{ds}\\right\\|.$$ For a plane curve $\\gamma(t)=(x(t),y(t))$, $$\\kappa(t)=\\dfrac{|x'y''-y'x''|}{((x')^2+(y')^2)^{3/2}}.$$</p><p>The definition says: first normalize direction, then measure how fast that direction changes per unit length. For a circle of radius $R$, the tangent turns one radian after distance $R$, so $\\kappa=1/R$.</p><p><b>Assumptions that matter:</b> the curve is regular; required derivatives exist; curvature here is nonnegative; and changing speed alone does not change geometric curvature.</p>",
    "worked": {
      "problem": "Find the curvature of $\\gamma(t)=(3\\cos t,3\\sin t)$.",
      "skills": [
        "derivatives",
        "speed",
        "curvature formula"
      ],
      "strategy": "Use the plane formula and expect the reciprocal radius to appear.",
      "steps": [
        {
          "do": "Differentiate once",
          "result": "$x'=-3\\sin t,\\ y'=3\\cos t$",
          "why": "velocity components"
        },
        {
          "do": "Differentiate twice",
          "result": "$x''=-3\\cos t,\\ y''=-3\\sin t$",
          "why": "acceleration components"
        },
        {
          "do": "Compute numerator",
          "result": "$|x'y''-y'x''|=9$",
          "why": "$9\\sin^2t+9\\cos^2t=9$"
        },
        {
          "do": "Compute speed squared",
          "result": "$(x')^2+(y')^2=9$",
          "why": "use the trig identity"
        },
        {
          "do": "Raise to $3/2$",
          "result": "$9^{3/2}=27$",
          "why": "the square root is 3"
        },
        {
          "do": "Divide",
          "result": "$\\kappa=9/27=1/3$",
          "why": "apply the formula"
        }
      ],
      "verify": "A radius $3$ circle should have curvature $1/3$, so the result matches geometry.",
      "answer": "The curvature is $\\kappa=\\dfrac13$.",
      "connects": "Curvature reads circular bending as reciprocal radius."
    },
    "practice": [
      {
        "problem": "Find the curvature of the line $\\gamma(t)=(2t,5t)$.",
        "steps": [
          {
            "do": "Differentiate once",
            "result": "$x'=2,\\ y'=5$",
            "why": "velocity is constant"
          },
          {
            "do": "Differentiate twice",
            "result": "$x''=0,\\ y''=0$",
            "why": "a line has no acceleration"
          },
          {
            "do": "Compute numerator",
            "result": "$|2\\cdot0-5\\cdot0|=0$",
            "why": "no direction change"
          },
          {
            "do": "Compute denominator",
            "result": "$(2^2+5^2)^{3/2}=29^{3/2}$",
            "why": "speed is nonzero"
          },
          {
            "do": "Divide",
            "result": "$\\kappa=0$",
            "why": "zero numerator gives zero curvature"
          }
        ],
        "answer": "The curvature is $0$."
      },
      {
        "problem": "Find the curvature of the unit circle $\\gamma(t)=(\\cos t,\\sin t)$.",
        "steps": [
          {
            "do": "Differentiate once",
            "result": "$x'=-\\sin t,\\ y'=\\cos t$",
            "why": "velocity"
          },
          {
            "do": "Differentiate twice",
            "result": "$x''=-\\cos t,\\ y''=-\\sin t$",
            "why": "acceleration"
          },
          {
            "do": "Compute numerator",
            "result": "$1$",
            "why": "the trig squares add to 1"
          },
          {
            "do": "Compute denominator",
            "result": "$1$",
            "why": "speed is 1"
          },
          {
            "do": "Divide",
            "result": "$\\kappa=1$",
            "why": "unit circle has radius 1"
          }
        ],
        "answer": "The curvature is $1$."
      },
      {
        "problem": "Find the curvature of a circle of radius $2$.",
        "steps": [
          {
            "do": "Read the radius",
            "result": "$R=2$",
            "why": "circle geometry is enough"
          },
          {
            "do": "Write the rule",
            "result": "$\\kappa=1/R$",
            "why": "curvature of a circle"
          },
          {
            "do": "Substitute",
            "result": "$\\kappa=1/2$",
            "why": "use R equals 2"
          },
          {
            "do": "Attach units",
            "result": "inverse length",
            "why": "curvature is per unit distance"
          },
          {
            "do": "State constancy",
            "result": "same at every point",
            "why": "circles bend equally everywhere"
          }
        ],
        "answer": "The curvature is $1/2$."
      },
      {
        "problem": "Compute the curvature of $\\gamma(t)=(t,t^2)$ at $t=1$.",
        "steps": [
          {
            "do": "Differentiate once",
            "result": "$x'=1,\\ y'=2t$",
            "why": "velocity components"
          },
          {
            "do": "Differentiate twice",
            "result": "$x''=0,\\ y''=2$",
            "why": "acceleration components"
          },
          {
            "do": "Compute numerator at 1",
            "result": "$|1\\cdot2-2\\cdot0|=2$",
            "why": "substitute t equals 1"
          },
          {
            "do": "Compute denominator at 1",
            "result": "$(1^2+2^2)^{3/2}=5\\sqrt5$",
            "why": "speed squared is 5"
          },
          {
            "do": "Divide",
            "result": "$\\kappa=2/(5\\sqrt5)$",
            "why": "apply the formula"
          }
        ],
        "answer": "At $t=1$, $\\kappa=\\dfrac{2}{5\\sqrt5}$."
      },
      {
        "problem": "A vehicle follows circular lanes of radius $25$ m and $5$ m. Compare their curvatures.",
        "steps": [
          {
            "do": "Use radius $25$",
            "result": "$\\kappa=1/25=0.04$",
            "why": "reciprocal radius"
          },
          {
            "do": "Use radius $5$",
            "result": "$\\kappa=1/5=0.20$",
            "why": "reciprocal radius"
          },
          {
            "do": "Compare",
            "result": "$0.20/0.04=5$",
            "why": "ratio of curvatures"
          },
          {
            "do": "Attach units",
            "result": "$\\text{m}^{-1}$",
            "why": "curvature is inverse length"
          },
          {
            "do": "Interpret",
            "result": "the 5 m lane is five times sharper",
            "why": "larger curvature means faster direction change"
          }
        ],
        "answer": "The $25$ m lane has curvature $0.04\\,\\text{m}^{-1}$; the $5$ m lane has $0.20\\,\\text{m}^{-1}$."
      }
    ],
    "applications": [
      {
        "title": "Road design",
        "background": "Engineers limit curvature so vehicles can turn safely and comfortably.",
        "numbers": "Radius $200$ m gives $\\kappa=0.005\\,\\text{m}^{-1}$; radius $50$ m gives $0.02\\,\\text{m}^{-1}$."
      },
      {
        "title": "Robot steering",
        "background": "Mobile robots can command curvature directly to specify how sharply to turn.",
        "numbers": "A turn of radius $4$ m has curvature $1/4=0.25\\,\\text{m}^{-1}."
      },
      {
        "title": "Graphics smoothness",
        "background": "Design software detects sharp curve segments by estimating curvature.",
        "numbers": "An arc of radius $10$ px has curvature $0.1$ per pixel; radius $100$ px has $0.01$."
      },
      {
        "title": "Passenger comfort",
        "background": "Autonomous driving penalizes high curvature because lateral acceleration grows with it.",
        "numbers": "At speed $10$ m/s on radius $50$ m, acceleration is $v^2/R=2$ m/s$^2$."
      },
      {
        "title": "Optimization paths",
        "background": "A zig-zagging parameter path has high turning rate in weight space.",
        "numbers": "Turning $0.5$ radians over length $2$ gives average curvature about $0.25$."
      },
      {
        "title": "Shape analysis",
        "background": "Vision systems use contour curvature to detect corners and object parts.",
        "numbers": "A contour with estimated radius $8$ pixels has curvature $1/8=0.125$ per pixel."
      }
    ],
    "applicationsClose": "Curvature is the clean geometry of turning, whether the curve is a road, robot path, drawing, contour, or optimization trajectory.",
    "takeaways": [
      "Curvature is $\\|d\\mathbf{T}/ds\\|$.",
      "Lines have curvature 0; circles of radius R have curvature 1/R.",
      "The plane formula uses first and second derivatives.",
      "Changing speed alone does not change geometric curvature."
    ]
  },
  "math-12-04": {
    "id": "math-12-04",
    "title": "The Frenet frame",
    "tagline": "The Frenet frame carries a moving set of axes along a space curve: forward, turning, and sideways.",
    "connections": {
      "buildsOn": [
        "Curvature",
        "unit vectors",
        "cross products"
      ],
      "leadsTo": [
        "Regular surfaces",
        "normal curvature",
        "geodesics"
      ],
      "usedWith": [
        "orthonormal bases",
        "arc length",
        "acceleration",
        "3-D geometry"
      ]
    },
    "motivation": "<p>You already use coordinate axes to describe space. Along a moving curve, it is often better to carry axes that travel with the point.</p><p>The Frenet frame gives a local compass: $\\mathbf{T}$ points forward, $\\mathbf{N}$ points toward the turn, and $\\mathbf{B}$ completes the sideways direction.</p>",
    "definition": "<p>For a unit-speed space curve $\\gamma(s)$ with curvature $\\kappa(s)>0$, the <b>Frenet frame</b> is $\\mathbf{T}=\\gamma'(s)$, $\\mathbf{N}=\\mathbf{T}'(s)/\\|\\mathbf{T}'(s)\\|$, and $\\mathbf{B}=\\mathbf{T}\\times\\mathbf{N}$.</p><p>Because $\\|\\mathbf{T}\\|=1$, differentiating $\\mathbf{T}\\cdot\\mathbf{T}=1$ gives $\\mathbf{T}\\cdot\\mathbf{T}'=0$. So the tangent's change is perpendicular to the tangent, exactly where the normal direction should live.</p><p><b>Assumptions that matter:</b> the clean formulas use arc length $s$; $\\kappa>0$ is needed to define $\\mathbf{N}$; and the frame is undefined where the curve has no preferred turning direction.</p>",
    "worked": {
      "problem": "For $\\gamma(s)=(\\cos s,\\sin s,0)$, find $\\mathbf{T}$, $\\mathbf{N}$, and $\\mathbf{B}$.",
      "skills": [
        "unit-speed curves",
        "normalization",
        "cross products"
      ],
      "strategy": "The circle is unit speed, so differentiate to get forward and turning directions.",
      "steps": [
        {
          "do": "Differentiate the curve",
          "result": "$\\mathbf{T}=(-\\sin s,\\cos s,0)$",
          "why": "unit-speed tangent is position derivative"
        },
        {
          "do": "Differentiate the tangent",
          "result": "$\\mathbf{T}'=(-\\cos s,-\\sin s,0)$",
          "why": "turning direction"
        },
        {
          "do": "Compute its norm",
          "result": "$\\|\\mathbf{T}'\\|=1$",
          "why": "unit circle curvature is 1"
        },
        {
          "do": "Normalize",
          "result": "$\\mathbf{N}=(-\\cos s,-\\sin s,0)$",
          "why": "divide by norm 1"
        },
        {
          "do": "Cross tangent and normal",
          "result": "$\\mathbf{B}=(0,0,1)$",
          "why": "complete the right-handed frame"
        }
      ],
      "verify": "The three vectors are unit length and pairwise perpendicular.",
      "answer": "$\\mathbf{T}=(-\\sin s,\\cos s,0)$, $\\mathbf{N}=(-\\cos s,-\\sin s,0)$, and $\\mathbf{B}=(0,0,1)$.",
      "connects": "The frame separates forward motion, inward turning, and out-of-plane orientation."
    },
    "practice": [
      {
        "problem": "For $\\gamma(s)=(s,0,0)$, find $\\mathbf{T}$ and explain why $\\mathbf{N}$ is not defined.",
        "steps": [
          {
            "do": "Differentiate",
            "result": "$\\mathbf{T}=(1,0,0)$",
            "why": "line is unit speed"
          },
          {
            "do": "Differentiate tangent",
            "result": "$\\mathbf{T}'=(0,0,0)$",
            "why": "direction does not change"
          },
          {
            "do": "Compute curvature",
            "result": "$\\kappa=0$",
            "why": "norm of tangent derivative"
          },
          {
            "do": "Check normal formula",
            "result": "$\\mathbf{T}'/\\|\\mathbf{T}'\\|$ is undefined",
            "why": "division by zero"
          },
          {
            "do": "Interpret",
            "result": "a line has no preferred turning side",
            "why": "all normal directions are equally possible"
          }
        ],
        "answer": "$\\mathbf{T}=(1,0,0)$; $\\mathbf{N}$ is not defined because $\\kappa=0$."
      },
      {
        "problem": "For $\\gamma(s)=(0,\\cos s,\\sin s)$, find the frame.",
        "steps": [
          {
            "do": "Differentiate",
            "result": "$\\mathbf{T}=(0,-\\sin s,\\cos s)$",
            "why": "unit tangent"
          },
          {
            "do": "Differentiate tangent",
            "result": "$\\mathbf{T}'=(0,-\\cos s,-\\sin s)$",
            "why": "turning direction"
          },
          {
            "do": "Normalize",
            "result": "$\\mathbf{N}=(0,-\\cos s,-\\sin s)$",
            "why": "norm is 1"
          },
          {
            "do": "Cross vectors",
            "result": "$\\mathbf{B}=(1,0,0)$",
            "why": "right-handed orientation"
          },
          {
            "do": "Check lengths",
            "result": "all are 1",
            "why": "orthonormal frame"
          }
        ],
        "answer": "$\\mathbf{T}=(0,-\\sin s,\\cos s)$, $\\mathbf{N}=(0,-\\cos s,-\\sin s)$, $\\mathbf{B}=(1,0,0)$."
      },
      {
        "problem": "At $s=0$ on the unit circle, compute the frame numerically.",
        "steps": [
          {
            "do": "Evaluate tangent",
            "result": "$\\mathbf{T}(0)=(0,1,0)$",
            "why": "substitute sine and cosine"
          },
          {
            "do": "Evaluate normal",
            "result": "$\\mathbf{N}(0)=(-1,0,0)$",
            "why": "points inward"
          },
          {
            "do": "Evaluate binormal",
            "result": "$\\mathbf{B}(0)=(0,0,1)$",
            "why": "from cross product"
          },
          {
            "do": "Check dot product",
            "result": "$\\mathbf{T}\\cdot\\mathbf{N}=0$",
            "why": "perpendicular"
          },
          {
            "do": "Check cross product",
            "result": "$\\mathbf{T}\\times\\mathbf{N}=\\mathbf{B}$",
            "why": "orientation is consistent"
          }
        ],
        "answer": "At $s=0$, the frame is $(0,1,0)$, $(-1,0,0)$, $(0,0,1)$."
      },
      {
        "problem": "For a unit-speed curve with $\\mathbf{T}'=(0,3,4)$, find $\\kappa$ and $\\mathbf{N}$.",
        "steps": [
          {
            "do": "Compute norm",
            "result": "$\\sqrt{0^2+3^2+4^2}=5$",
            "why": "curvature is this norm"
          },
          {
            "do": "State curvature",
            "result": "$\\kappa=5$",
            "why": "unit-speed formula"
          },
          {
            "do": "Normalize",
            "result": "$\\mathbf{N}=(0,3/5,4/5)$",
            "why": "divide by 5"
          },
          {
            "do": "Check length",
            "result": "$1$",
            "why": "normal must be unit"
          },
          {
            "do": "Interpret",
            "result": "the curve turns sharply",
            "why": "curvature 5 is large"
          }
        ],
        "answer": "$\\kappa=5$ and $\\mathbf{N}=(0,3/5,4/5)$."
      },
      {
        "problem": "A camera has $\\mathbf{T}=(1,0,0)$ and inward $\\mathbf{N}=(0,1,0)$. Find $\\mathbf{B}$.",
        "steps": [
          {
            "do": "Write definition",
            "result": "$\\mathbf{B}=\\mathbf{T}\\times\\mathbf{N}$",
            "why": "Frenet orientation"
          },
          {
            "do": "Substitute",
            "result": "$(1,0,0)\\times(0,1,0)$",
            "why": "given vectors"
          },
          {
            "do": "Compute",
            "result": "$(0,0,1)$",
            "why": "standard basis cross product"
          },
          {
            "do": "Check length",
            "result": "$1$",
            "why": "unit binormal"
          },
          {
            "do": "Interpret",
            "result": "the binormal points upward",
            "why": "curve lies in the horizontal plane"
          }
        ],
        "answer": "$\\mathbf{B}=(0,0,1)$."
      }
    ],
    "applications": [
      {
        "title": "Camera rigs",
        "background": "Virtual cameras need forward and side directions along a path.",
        "numbers": "On the unit circle at $s=0$, forward is $(0,1,0)$ and inward is $(-1,0,0)$."
      },
      {
        "title": "Robotics orientation",
        "background": "Robots following 3-D paths need a local frame, not only positions.",
        "numbers": "If $\\mathbf{T}=(1,0,0)$ and $\\mathbf{N}=(0,0,1)$, then $\\mathbf{B}=(0,-1,0)$."
      },
      {
        "title": "Tube meshes",
        "background": "Graphics draws tubes by placing circles in the normal-binormal plane.",
        "numbers": "A tube of radius $0.2$ uses offsets $0.2\\mathbf{N}$ and $0.2\\mathbf{B}$."
      },
      {
        "title": "Motion comfort",
        "background": "The normal direction points toward centripetal acceleration.",
        "numbers": "At speed $6$ m/s on radius $12$ m, normal acceleration is $36/12=3$ m/s$^2$."
      },
      {
        "title": "Trajectory analysis",
        "background": "Learned policy paths can be decomposed into progress and correction directions.",
        "numbers": "If $\\kappa=0.5$ and speed is $2$, direction changes at about $1$ rad/s."
      },
      {
        "title": "Medical centerlines",
        "background": "Vessel centerlines use frames to define cross-sectional planes.",
        "numbers": "A vessel radius may be $1.5$ mm along $\\mathbf{N}$ and $1.2$ mm along $\\mathbf{B}$."
      }
    ],
    "applicationsClose": "The Frenet frame is a moving compass: forward, inward, and sideways directions follow the curve.",
    "takeaways": [
      "For unit speed, $\\mathbf{T}=\\gamma'(s)$.",
      "When $\\kappa>0$, $\\mathbf{N}=\\mathbf{T}'/\\|\\mathbf{T}'\\|$.",
      "The binormal is $\\mathbf{B}=\\mathbf{T}\\times\\mathbf{N}$.",
      "The frame is useful whenever a curve needs local orientation."
    ]
  },
  "math-12-05": {
    "id": "math-12-05",
    "title": "Regular surfaces",
    "tagline": "A regular surface is a two-parameter patch that locally looks like a clean, nonfolded sheet.",
    "connections": {
      "buildsOn": [
        "Parametrized curves",
        "partial derivatives",
        "cross products"
      ],
      "leadsTo": [
        "Tangent planes",
        "The first fundamental form",
        "The second fundamental form"
      ],
      "usedWith": [
        "coordinate patches",
        "normal vectors",
        "Jacobian rank",
        "manifolds"
      ]
    },
    "motivation": "<p>You already know that one parameter traces a curve. A surface needs two parameters, one for each independent way to move across a sheet.</p><p>The word regular protects us from collapsed coordinates. A regular patch has two genuine surface directions, so tangent planes and normals make sense.</p>",
    "definition": "<p>A surface patch is a map $\\mathbf{x}(u,v):U\\subset\\mathbb{R}^2\\to\\mathbb{R}^3$. It is <b>regular</b> if $\\mathbf{x}_u$ and $\\mathbf{x}_v$ are linearly independent, equivalently $\\mathbf{x}_u\\times\\mathbf{x}_v\\ne\\mathbf{0}$.</p><p>The reason is geometric: $\\mathbf{x}_u$ and $\\mathbf{x}_v$ are the two coordinate directions on the surface. If they are independent, they span a tangent plane; if not, the patch has locally collapsed.</p><p><b>Assumptions that matter:</b> the patch is differentiable; regularity is local; one surface may need several patches; and parameter names are coordinates, not necessarily physical axes.</p>",
    "worked": {
      "problem": "Show that $\\mathbf{x}(u,v)=(u,v,u+v)$ is regular.",
      "skills": [
        "partial derivatives",
        "cross products",
        "regularity"
      ],
      "strategy": "Compute the two coordinate directions and test whether their cross product vanishes.",
      "steps": [
        {
          "do": "Compute $\\mathbf{x}_u$",
          "result": "$(1,0,1)$",
          "why": "differentiate with respect to u"
        },
        {
          "do": "Compute $\\mathbf{x}_v$",
          "result": "$(0,1,1)$",
          "why": "differentiate with respect to v"
        },
        {
          "do": "Form the cross product",
          "result": "$\\mathbf{x}_u\\times\\mathbf{x}_v=(-1,-1,1)$",
          "why": "normal direction"
        },
        {
          "do": "Check nonzero",
          "result": "$(-1,-1,1)\\ne(0,0,0)$",
          "why": "directions are independent"
        },
        {
          "do": "State regularity",
          "result": "regular for all $(u,v)$",
          "why": "the cross product is constant and nonzero"
        }
      ],
      "verify": "The two partial directions are not multiples, so they span a plane everywhere.",
      "answer": "The patch is regular everywhere.",
      "connects": "Regularity is the surface analogue of nonzero velocity for a curve."
    },
    "practice": [
      {
        "problem": "Show that $\\mathbf{x}(u,v)=(u,v,0)$ is regular.",
        "steps": [
          {
            "do": "Compute $\\mathbf{x}_u$",
            "result": "$(1,0,0)$",
            "why": "u direction"
          },
          {
            "do": "Compute $\\mathbf{x}_v$",
            "result": "$(0,1,0)$",
            "why": "v direction"
          },
          {
            "do": "Cross them",
            "result": "$(0,0,1)$",
            "why": "standard basis cross product"
          },
          {
            "do": "Check nonzero",
            "result": "$(0,0,1)\\ne\\mathbf{0}$",
            "why": "independent directions"
          },
          {
            "do": "Conclude",
            "result": "regular everywhere",
            "why": "cross product never vanishes"
          }
        ],
        "answer": "The plane patch is regular everywhere."
      },
      {
        "problem": "Show that $\\mathbf{x}(u,v)=(u,v,u^2+v^2)$ is regular.",
        "steps": [
          {
            "do": "Compute $\\mathbf{x}_u$",
            "result": "$(1,0,2u)$",
            "why": "partial in u"
          },
          {
            "do": "Compute $\\mathbf{x}_v$",
            "result": "$(0,1,2v)$",
            "why": "partial in v"
          },
          {
            "do": "Cross them",
            "result": "$(-2u,-2v,1)$",
            "why": "determinant calculation"
          },
          {
            "do": "Inspect third component",
            "result": "$1$",
            "why": "the vector cannot be zero"
          },
          {
            "do": "Conclude",
            "result": "regular for all $(u,v)$",
            "why": "cross product never vanishes"
          }
        ],
        "answer": "The paraboloid patch is regular everywhere."
      },
      {
        "problem": "Check regularity of $\\mathbf{x}(u,v)=(u+v,2u+2v,0)$.",
        "steps": [
          {
            "do": "Compute $\\mathbf{x}_u$",
            "result": "$(1,2,0)$",
            "why": "partial in u"
          },
          {
            "do": "Compute $\\mathbf{x}_v$",
            "result": "$(1,2,0)$",
            "why": "partial in v"
          },
          {
            "do": "Compare vectors",
            "result": "$\\mathbf{x}_u=\\mathbf{x}_v$",
            "why": "they are dependent"
          },
          {
            "do": "Cross product",
            "result": "$\\mathbf{0}$",
            "why": "equal vectors cross to zero"
          },
          {
            "do": "Conclude",
            "result": "not regular",
            "why": "the patch collapses to a line"
          }
        ],
        "answer": "It is not regular because the parameter directions are dependent."
      },
      {
        "problem": "For the sphere patch $\\mathbf{x}(u,v)=(\\cos u\\sin v,\\sin u\\sin v,\\cos v)$, explain why $v=0$ is not regular.",
        "steps": [
          {
            "do": "Evaluate at v equals zero",
            "result": "$\\mathbf{x}(u,0)=(0,0,1)$",
            "why": "all u values map to the north pole"
          },
          {
            "do": "Notice collapse",
            "result": "the u direction changes no point",
            "why": "many parameters give one point"
          },
          {
            "do": "Compute $\\mathbf{x}_u$ at $v=0$",
            "result": "$(0,0,0)$",
            "why": "terms contain sine of zero"
          },
          {
            "do": "Cross with zero",
            "result": "$\\mathbf{0}$",
            "why": "one direction vanished"
          },
          {
            "do": "Conclude",
            "result": "not regular at the pole",
            "why": "spherical coordinates collapse there"
          }
        ],
        "answer": "The patch is not regular at $v=0$ because $\\mathbf{x}_u=\\mathbf{0}$ there."
      },
      {
        "problem": "A height field is $\\mathbf{x}(u,v)=(u,v,0.1u+0.2v)$. Verify regularity and find a normal direction.",
        "steps": [
          {
            "do": "Compute $\\mathbf{x}_u$",
            "result": "$(1,0,0.1)$",
            "why": "partial in u"
          },
          {
            "do": "Compute $\\mathbf{x}_v$",
            "result": "$(0,1,0.2)$",
            "why": "partial in v"
          },
          {
            "do": "Cross them",
            "result": "$(-0.1,-0.2,1)$",
            "why": "normal direction"
          },
          {
            "do": "Check nonzero",
            "result": "$(-0.1,-0.2,1)\\ne\\mathbf{0}$",
            "why": "regularity holds"
          },
          {
            "do": "State normal",
            "result": "$(-0.1,-0.2,1)$",
            "why": "any nonzero multiple works"
          }
        ],
        "answer": "The patch is regular, with normal direction $(-0.1,-0.2,1)$."
      }
    ],
    "applications": [
      {
        "title": "Mesh parameterization",
        "background": "Graphics builds surfaces from two-dimensional parameter domains, and regularity prevents degeneration.",
        "numbers": "For $\\mathbf{x}(u,v)=(u,v,0)$, area scale is $\\|\\mathbf{x}_u\\times\\mathbf{x}_v\\|=1$."
      },
      {
        "title": "Terrain height fields",
        "background": "Maps use $z=f(u,v)$ surfaces; these are regular because the first two coordinates are $u$ and $v$.",
        "numbers": "For $z=0.3u-0.4v$, a normal direction is $(-0.3,0.4,1)$."
      },
      {
        "title": "Texture coordinates",
        "background": "Texture mapping fails when parameter patches collapse or stretch too much.",
        "numbers": "If area scale is $0.01$, a parameter square covers one hundredth the expected surface area."
      },
      {
        "title": "Surface reconstruction",
        "background": "Scans fit local surface patches to point clouds, and regular patches give stable normals.",
        "numbers": "Directions $(1,0,0)$ and $(0,2,0)$ have cross product magnitude $2$."
      },
      {
        "title": "Robotics contact",
        "background": "A gripper needs a surface normal to plan contact forces.",
        "numbers": "Patch directions $(1,0,0)$ and $(0,1,1)$ give normal $(0,-1,1)$."
      },
      {
        "title": "Manifold learning",
        "background": "Data manifolds are locally sheet-like in high-dimensional spaces, and regularity is the smooth idealization.",
        "numbers": "Independent tangent vectors of lengths $3$ and $4$ at right angles give local area scale $12$."
      }
    ],
    "applicationsClose": "Regularity guarantees that a two-parameter description behaves like a surface patch rather than a collapsed coordinate trick.",
    "takeaways": [
      "A surface patch is a map $\\mathbf{x}(u,v)$ into $\\mathbb{R}^3$.",
      "Regularity means $\\mathbf{x}_u$ and $\\mathbf{x}_v$ are independent.",
      "Equivalently, $\\mathbf{x}_u\\times\\mathbf{x}_v\\ne\\mathbf{0}$.",
      "Regular patches have tangent planes and normal directions."
    ]
  },
  "math-12-06": {
    "id": "math-12-06",
    "title": "Tangent planes",
    "tagline": "A tangent plane is the best flat approximation to a surface at one point.",
    "connections": {
      "buildsOn": [
        "Regular surfaces",
        "partial derivatives",
        "planes in 3-D"
      ],
      "leadsTo": [
        "The differential of a map",
        "The first fundamental form",
        "The second fundamental form"
      ],
      "usedWith": [
        "normal vectors",
        "linearization",
        "gradients",
        "local coordinates"
      ]
    },
    "motivation": "<p>You already know a tangent line as the best straight-line view of a curve near a point. A surface needs the same idea with one more dimension.</p><p>The tangent plane is built from the two parameter directions. Close to the point, the surface behaves like the plane spanned by those directions.</p>",
    "definition": "<p>For a regular patch $\\mathbf{x}(u,v)$, the <b>tangent plane</b> at $(u_0,v_0)$ is the plane through $\\mathbf{x}(u_0,v_0)$ spanned by $\\mathbf{x}_u(u_0,v_0)$ and $\\mathbf{x}_v(u_0,v_0)$.</p><p>Equivalently, with normal $\\mathbf{n}=\\mathbf{x}_u\\times\\mathbf{x}_v$, the plane is $\\mathbf{n}\\cdot(\\mathbf{X}-\\mathbf{x}(u_0,v_0))=0$. This works because a normal is perpendicular to every direction in the plane.</p><p><b>Assumptions that matter:</b> the patch is regular at the point; tangent planes are local approximations; and different regular coordinates for the same surface give the same tangent plane.</p>",
    "worked": {
      "problem": "Find the tangent plane to $\\mathbf{x}(u,v)=(u,v,u^2+v^2)$ at $(u,v)=(1,2)$.",
      "skills": [
        "partial derivatives",
        "normal vectors",
        "plane equations"
      ],
      "strategy": "Compute the point, compute two tangent directions, cross them for a normal, then write the plane.",
      "steps": [
        {
          "do": "Evaluate the point",
          "result": "$\\mathbf{x}(1,2)=(1,2,5)$",
          "why": "$1^2+2^2=5$"
        },
        {
          "do": "Compute $\\mathbf{x}_u(1,2)$",
          "result": "$(1,0,2)$",
          "why": "$\\mathbf{x}_u=(1,0,2u)$"
        },
        {
          "do": "Compute $\\mathbf{x}_v(1,2)$",
          "result": "$(0,1,4)$",
          "why": "$\\mathbf{x}_v=(0,1,2v)$"
        },
        {
          "do": "Cross directions",
          "result": "$\\mathbf{n}=(-2,-4,1)$",
          "why": "normal vector"
        },
        {
          "do": "Write plane",
          "result": "$-2(x-1)-4(y-2)+(z-5)=0$",
          "why": "normal dot displacement is zero"
        },
        {
          "do": "Simplify",
          "result": "$z=2x+4y-5$",
          "why": "solve for z"
        }
      ],
      "verify": "The height function linearization gives $5+2(x-1)+4(y-2)$, the same plane.",
      "answer": "The tangent plane is $z=2x+4y-5$.",
      "connects": "A tangent plane is the surface's first-order local model."
    },
    "practice": [
      {
        "problem": "Find the tangent plane to $z=3x+2y$ at $(1,1,5)$.",
        "steps": [
          {
            "do": "Recognize surface",
            "result": "already a plane",
            "why": "the height is linear"
          },
          {
            "do": "Compute slopes",
            "result": "$z_x=3,\\ z_y=2$",
            "why": "partial derivatives"
          },
          {
            "do": "Write linearization",
            "result": "$z-5=3(x-1)+2(y-1)$",
            "why": "point-slope plane form"
          },
          {
            "do": "Simplify",
            "result": "$z=3x+2y$",
            "why": "the original plane returns"
          },
          {
            "do": "Interpret",
            "result": "flat surfaces equal their tangent planes",
            "why": "no curvature is present"
          }
        ],
        "answer": "The tangent plane is $z=3x+2y$."
      },
      {
        "problem": "Find the tangent plane to $z=x^2+y^2$ at $(0,0,0)$.",
        "steps": [
          {
            "do": "Compute $z_x$",
            "result": "$2x$",
            "why": "partial derivative"
          },
          {
            "do": "Compute $z_y$",
            "result": "$2y$",
            "why": "partial derivative"
          },
          {
            "do": "Evaluate slopes",
            "result": "$0$ and $0$",
            "why": "at the origin"
          },
          {
            "do": "Write plane",
            "result": "$z=0$",
            "why": "linearization has no slope terms"
          },
          {
            "do": "Interpret",
            "result": "horizontal tangent plane",
            "why": "the bowl bottom is flat to first order"
          }
        ],
        "answer": "The tangent plane is $z=0$."
      },
      {
        "problem": "For $\\mathbf{x}(u,v)=(u,v,u+2v)$ at $(2,1)$, find a normal vector and tangent plane.",
        "steps": [
          {
            "do": "Evaluate point",
            "result": "$(2,1,4)$",
            "why": "substitute parameters"
          },
          {
            "do": "Compute $\\mathbf{x}_u$",
            "result": "$(1,0,1)$",
            "why": "partial in u"
          },
          {
            "do": "Compute $\\mathbf{x}_v$",
            "result": "$(0,1,2)$",
            "why": "partial in v"
          },
          {
            "do": "Cross directions",
            "result": "$(-1,-2,1)$",
            "why": "normal vector"
          },
          {
            "do": "Write plane",
            "result": "$-(x-2)-2(y-1)+(z-4)=0$",
            "why": "normal dot displacement"
          }
        ],
        "answer": "A normal is $(-1,-2,1)$, and the plane is $z=x+2y$."
      },
      {
        "problem": "Use the tangent plane to $z=x^2+y^2$ at $(1,2)$ to approximate $z$ at $(1.1,1.9)$.",
        "steps": [
          {
            "do": "Use the plane",
            "result": "$z=2x+4y-5$",
            "why": "from the worked example"
          },
          {
            "do": "Substitute x",
            "result": "$2(1.1)=2.2$",
            "why": "first term"
          },
          {
            "do": "Substitute y",
            "result": "$4(1.9)=7.6$",
            "why": "second term"
          },
          {
            "do": "Combine",
            "result": "$2.2+7.6-5=4.8$",
            "why": "evaluate plane"
          },
          {
            "do": "Compare exact",
            "result": "$1.1^2+1.9^2=4.82$",
            "why": "close to approximation"
          }
        ],
        "answer": "The tangent-plane approximation is $4.8$; the exact value is $4.82$."
      },
      {
        "problem": "A loss surface has $L=10$, $L_{w_1}=4$, and $L_{w_2}=-1$ at $(2,3)$. Estimate $L(2.1,2.8)$.",
        "steps": [
          {
            "do": "Write linear model",
            "result": "$L\\approx10+4(w_1-2)-1(w_2-3)$",
            "why": "tangent plane in parameter space"
          },
          {
            "do": "Compute first change",
            "result": "$0.1$",
            "why": "w1 moved from 2 to 2.1"
          },
          {
            "do": "Compute second change",
            "result": "$-0.2$",
            "why": "w2 moved from 3 to 2.8"
          },
          {
            "do": "Substitute",
            "result": "$10+4(0.1)-1(-0.2)$",
            "why": "plug into plane"
          },
          {
            "do": "Evaluate",
            "result": "$10.6$",
            "why": "$10+0.4+0.2=10.6$"
          }
        ],
        "answer": "The estimated loss is $10.6$."
      }
    ],
    "applications": [
      {
        "title": "Linearization in ML",
        "background": "Training uses local linear information about loss surfaces to predict changes.",
        "numbers": "If gradient is $(2,-3)$ and step is $(0.1,0.2)$, predicted change is $0.2-0.6=-0.4$."
      },
      {
        "title": "Surface normals in graphics",
        "background": "Lighting calculations need tangent-plane normals to compute brightness.",
        "numbers": "Normal $(0,0,1)$ dotted with light $(0,0,1)$ gives brightness factor $1$."
      },
      {
        "title": "Terrain approximation",
        "background": "Robots approximate small patches of ground by planes for footing.",
        "numbers": "Plane $z=0.1x+0.2y+3$ predicts height $3.5$ at $(1,2)$."
      },
      {
        "title": "Collision detection",
        "background": "Physics engines use local tangent planes to model contact response.",
        "numbers": "A vertical velocity $-4$ m/s reflects to $4$ m/s against horizontal normal $(0,0,1)$."
      },
      {
        "title": "Differentiable rendering",
        "background": "Pixel changes can be approximated by tangent-plane changes in geometry.",
        "numbers": "A $0.01$ geometry change with slope $7$ changes a value by about $0.07$."
      },
      {
        "title": "Trust regions",
        "background": "Optimizers compare local tangent models with actual loss after a step.",
        "numbers": "Predicted loss $12+(-5)(0.2)=11$ can be checked against observed loss."
      }
    ],
    "applicationsClose": "Tangent planes are the local flat language shared by geometry, rendering, terrain, contact, and loss approximation.",
    "takeaways": [
      "A tangent plane is spanned by $\\mathbf{x}_u$ and $\\mathbf{x}_v$.",
      "A normal vector is $\\mathbf{x}_u\\times\\mathbf{x}_v$.",
      "For a height field, the tangent plane is ordinary linearization.",
      "Tangent planes are local approximations, not global replacements."
    ]
  },
  "math-12-07": {
    "id": "math-12-07",
    "title": "The differential of a map",
    "tagline": "The differential is the best linear description of how a map moves tiny tangent vectors.",
    "connections": {
      "buildsOn": [
        "Tangent planes",
        "linear maps",
        "Jacobians"
      ],
      "leadsTo": [
        "The first fundamental form",
        "change of coordinates",
        "backpropagation geometry"
      ],
      "usedWith": [
        "matrix multiplication",
        "chain rule",
        "linearization",
        "tangent vectors"
      ]
    },
    "motivation": "<p>You already know a derivative for one-variable functions: near a point, it predicts how a small input change changes the output. For maps with several inputs and outputs, small changes have directions.</p><p>The differential is the linear map that sends tiny tangent vectors at the input to tiny tangent vectors at the output. In coordinates, it is the Jacobian doing its honest local work.</p>",
    "definition": "<p>For a differentiable map $F:\\mathbb{R}^m\\to\\mathbb{R}^n$, the <b>differential</b> at $p$ is the linear map $dF_p$ satisfying $F(p+h)\\approx F(p)+dF_p(h)$ for small $h$. In standard coordinates, $dF_p$ is multiplication by the Jacobian $J_F(p)$.</p><p>The chain rule says $d(G\\circ F)_p=dG_{F(p)}\\circ dF_p$. First $F$ moves the small displacement; then $G$ linearizes the moved displacement.</p><p><b>Assumptions that matter:</b> $F$ is differentiable at the point; the differential acts on tangent vectors; and matrix entries depend on coordinate choices even when the geometric linear action is the same.</p>",
    "worked": {
      "problem": "For $F(u,v)=(u^2+v,uv)$, compute $dF_{(2,3)}$ and apply it to $h=(0.1,-0.2)$.",
      "skills": [
        "Jacobians",
        "linear maps",
        "local approximation"
      ],
      "strategy": "Compute partial derivatives, evaluate the Jacobian, then multiply by the small vector.",
      "steps": [
        {
          "do": "Compute first row partials",
          "result": "$(2u,1)$",
          "why": "derivatives of $u^2+v$"
        },
        {
          "do": "Compute second row partials",
          "result": "$(v,u)$",
          "why": "derivatives of $uv$"
        },
        {
          "do": "Evaluate Jacobian",
          "result": "$J_F(2,3)=\\begin{pmatrix}4&1\\\\3&2\\end{pmatrix}$",
          "why": "substitute u and v"
        },
        {
          "do": "Multiply by h",
          "result": "$\\begin{pmatrix}4&1\\\\3&2\\end{pmatrix}\\begin{pmatrix}0.1\\\\-0.2\\end{pmatrix}$",
          "why": "apply the linear map"
        },
        {
          "do": "Compute first component",
          "result": "$0.2$",
          "why": "$4(0.1)-0.2=0.2$"
        },
        {
          "do": "Compute second component",
          "result": "$-0.1$",
          "why": "$3(0.1)+2(-0.2)=-0.1$"
        }
      ],
      "verify": "The exact change is close to $(0.21,-0.12)$, so the linear prediction is sensible.",
      "answer": "$dF_{(2,3)}$ has matrix $\\begin{pmatrix}4&1\\\\3&2\\end{pmatrix}$, and $dF_{(2,3)}(h)=(0.2,-0.1)$.",
      "connects": "The differential is tangent-vector local prediction."
    },
    "practice": [
      {
        "problem": "For $F(x,y)=(x+y,x-y)$, find $dF_{(1,2)}(3,4)$.",
        "steps": [
          {
            "do": "Compute Jacobian",
            "result": "$\\begin{pmatrix}1&1\\\\1&-1\\end{pmatrix}$",
            "why": "partials are constant"
          },
          {
            "do": "Note point independence",
            "result": "same at $(1,2)$",
            "why": "the map is linear"
          },
          {
            "do": "Multiply",
            "result": "$\\begin{pmatrix}1&1\\\\1&-1\\end{pmatrix}\\begin{pmatrix}3\\\\4\\end{pmatrix}$",
            "why": "apply differential"
          },
          {
            "do": "First component",
            "result": "$7$",
            "why": "3 plus 4"
          },
          {
            "do": "Second component",
            "result": "$-1$",
            "why": "3 minus 4"
          }
        ],
        "answer": "$dF_{(1,2)}(3,4)=(7,-1)$."
      },
      {
        "problem": "For $F(x,y)=(x^2,y^2)$, compute $dF_{(3,4)}(0.5,-0.25)$.",
        "steps": [
          {
            "do": "Compute Jacobian",
            "result": "$\\begin{pmatrix}2x&0\\\\0&2y\\end{pmatrix}$",
            "why": "partials of squared coordinates"
          },
          {
            "do": "Evaluate",
            "result": "$\\begin{pmatrix}6&0\\\\0&8\\end{pmatrix}$",
            "why": "at (3,4)"
          },
          {
            "do": "Multiply",
            "result": "$(6\\cdot0.5,8\\cdot(-0.25))$",
            "why": "diagonal scaling"
          },
          {
            "do": "Simplify",
            "result": "$(3,-2)$",
            "why": "compute products"
          },
          {
            "do": "Interpret",
            "result": "different directions stretch differently",
            "why": "local linear scaling"
          }
        ],
        "answer": "$dF_{(3,4)}(0.5,-0.25)=(3,-2)$."
      },
      {
        "problem": "For $F(x,y,z)=x+2y-z$, find $dF_{(0,0,0)}(1,3,5)$.",
        "steps": [
          {
            "do": "Compute Jacobian row",
            "result": "$(1,2,-1)$",
            "why": "gradient of scalar map"
          },
          {
            "do": "Apply to vector",
            "result": "$1\\cdot1+2\\cdot3-1\\cdot5$",
            "why": "row dot product"
          },
          {
            "do": "Simplify",
            "result": "$2$",
            "why": "1 plus 6 minus 5"
          },
          {
            "do": "State output type",
            "result": "scalar tangent change",
            "why": "target is one-dimensional"
          },
          {
            "do": "Check linearity",
            "result": "same at every point",
            "why": "the map is linear"
          }
        ],
        "answer": "$dF_{(0,0,0)}(1,3,5)=2$."
      },
      {
        "problem": "Check the chain rule for $F(x)=x^2$ and $G(y)=3y+1$ at $x=2$.",
        "steps": [
          {
            "do": "Compute $dF_2$",
            "result": "$4$",
            "why": "derivative of x squared at 2"
          },
          {
            "do": "Compute $dG_{F(2)}$",
            "result": "$3$",
            "why": "derivative of 3y plus 1"
          },
          {
            "do": "Compose differentials",
            "result": "$3\\cdot4=12$",
            "why": "chain rule product"
          },
          {
            "do": "Compose functions",
            "result": "$(G\\circ F)(x)=3x^2+1$",
            "why": "substitute F into G"
          },
          {
            "do": "Differentiate directly",
            "result": "$6x|_{x=2}=12$",
            "why": "same result"
          }
        ],
        "answer": "Both methods give $d(G\\circ F)_2=12$."
      },
      {
        "problem": "A preprocessing map is $F(x,y)=((x-10)/5,(y-100)/20)$. Apply its differential to change $(1,4)$.",
        "steps": [
          {
            "do": "Compute Jacobian",
            "result": "$\\begin{pmatrix}0.2&0\\\\0&0.05\\end{pmatrix}$",
            "why": "constant scaling derivatives"
          },
          {
            "do": "Multiply first component",
            "result": "$0.2\\cdot1=0.2$",
            "why": "x normalization"
          },
          {
            "do": "Multiply second component",
            "result": "$0.05\\cdot4=0.2$",
            "why": "y normalization"
          },
          {
            "do": "Write result",
            "result": "$(0.2,0.2)$",
            "why": "combine components"
          },
          {
            "do": "Interpret",
            "result": "different raw units become comparable",
            "why": "both normalized changes match"
          }
        ],
        "answer": "The differential sends $(1,4)$ to $(0.2,0.2)$."
      }
    ],
    "applications": [
      {
        "title": "Backpropagation",
        "background": "Neural networks repeatedly apply differentials through composed maps.",
        "numbers": "Layer derivatives $0.5$ and $3$ compose to $1.5$."
      },
      {
        "title": "Feature normalization",
        "background": "Preprocessing maps raw feature changes to normalized changes.",
        "numbers": "For $z=(x-50)/10$, raw change $2$ becomes $0.2$."
      },
      {
        "title": "Graphics transforms",
        "background": "Transformations move points and tangent directions through Jacobians.",
        "numbers": "Scaling $(x,y)$ by $(2,3)$ sends tangent $(1,1)$ to $(2,3)$."
      },
      {
        "title": "Robot kinematics",
        "background": "A robot arm Jacobian maps joint velocity to end-effector velocity.",
        "numbers": "If $J=\\begin{pmatrix}2&0\\\\0&1\\end{pmatrix}$ and velocity is $(0.1,0.3)$, output is $(0.2,0.3)$."
      },
      {
        "title": "Sensitivity analysis",
        "background": "Local Jacobians estimate output changes caused by small input perturbations.",
        "numbers": "Jacobian norm $4$ means perturbation length $0.01$ can cause change about $0.04$."
      },
      {
        "title": "Coordinate changes",
        "background": "Geometry often changes coordinates while preserving tangent-vector information.",
        "numbers": "At radius $2$, a polar angle change $d\\theta=0.2$ contributes arc length about $0.4$."
      }
    ],
    "applicationsClose": "The differential is the shared linear language behind backprop, kinematics, graphics, preprocessing, and sensitivity.",
    "takeaways": [
      "The differential $dF_p$ is the best linear approximation to $F$ at $p$.",
      "In coordinates, it is the Jacobian matrix.",
      "It acts on tangent vectors or small displacements.",
      "The chain rule composes differentials in map order."
    ]
  },
  "math-12-08": {
    "id": "math-12-08",
    "title": "The first fundamental form",
    "tagline": "The first fundamental form tells a surface how to measure lengths, angles, and areas from its coordinates.",
    "connections": {
      "buildsOn": [
        "Tangent planes",
        "dot products",
        "differentials"
      ],
      "leadsTo": [
        "The second fundamental form",
        "Gaussian curvature",
        "geodesics"
      ],
      "usedWith": [
        "metrics",
        "arc length",
        "surface area",
        "angle measurement"
      ]
    },
    "motivation": "<p>A surface patch may use coordinates that stretch, skew, or compress the actual surface. A small coordinate move is not automatically the true physical distance.</p><p>The first fundamental form is the surface's measuring rule. It records dot products of coordinate tangent vectors, so coordinates can measure real lengths and angles.</p>",
    "definition": "<p>For a regular patch $\\mathbf{x}(u,v)$, define $E=\\mathbf{x}_u\\cdot\\mathbf{x}_u$, $F=\\mathbf{x}_u\\cdot\\mathbf{x}_v$, and $G=\\mathbf{x}_v\\cdot\\mathbf{x}_v$. The <b>first fundamental form</b> is $$I=E\\,du^2+2F\\,du\\,dv+G\\,dv^2.$$</p><p>For a tangent vector $a\\mathbf{x}_u+b\\mathbf{x}_v$, expanding its dot product with itself gives squared length $Ea^2+2Fab+Gb^2$. That expansion is the whole idea.</p><p><b>Assumptions that matter:</b> the patch is regular; $F$ measures coordinate skew; and the form measures intrinsic lengths on the surface, not just drawings in the parameter plane.</p>",
    "worked": {
      "problem": "For $\\mathbf{x}(u,v)=(u,v,u+v)$, compute $E,F,G$ and the squared length of coordinate vector $(2,-1)$.",
      "skills": [
        "dot products",
        "metric coefficients",
        "tangent-vector length"
      ],
      "strategy": "Find coordinate tangent vectors, dot them, then use the quadratic length formula.",
      "steps": [
        {
          "do": "Compute $\\mathbf{x}_u$",
          "result": "$(1,0,1)$",
          "why": "partial in u"
        },
        {
          "do": "Compute $\\mathbf{x}_v$",
          "result": "$(0,1,1)$",
          "why": "partial in v"
        },
        {
          "do": "Compute $E$",
          "result": "$2$",
          "why": "dot xu with itself"
        },
        {
          "do": "Compute $F$",
          "result": "$1$",
          "why": "dot xu with xv"
        },
        {
          "do": "Compute $G$",
          "result": "$2$",
          "why": "dot xv with itself"
        },
        {
          "do": "Apply the form",
          "result": "$2(2)^2+2(1)(2)(-1)+2(-1)^2$",
          "why": "use a equals 2 and b equals -1"
        },
        {
          "do": "Simplify",
          "result": "$6$",
          "why": "$8-4+2=6$"
        }
      ],
      "verify": "The actual tangent vector is $(2,-1,1)$, whose squared norm is also $6$.",
      "answer": "$E=2$, $F=1$, $G=2$, and the squared length is $6$.",
      "connects": "The first fundamental form lets coordinates measure real tangent lengths."
    },
    "practice": [
      {
        "problem": "For $\\mathbf{x}(u,v)=(u,v,0)$, compute $E,F,G$.",
        "steps": [
          {
            "do": "Compute $\\mathbf{x}_u$",
            "result": "$(1,0,0)$",
            "why": "u direction"
          },
          {
            "do": "Compute $\\mathbf{x}_v$",
            "result": "$(0,1,0)$",
            "why": "v direction"
          },
          {
            "do": "Compute $E$",
            "result": "$1$",
            "why": "unit u direction"
          },
          {
            "do": "Compute $F$",
            "result": "$0$",
            "why": "directions are perpendicular"
          },
          {
            "do": "Compute $G$",
            "result": "$1$",
            "why": "unit v direction"
          }
        ],
        "answer": "$E=1$, $F=0$, $G=1$."
      },
      {
        "problem": "For $\\mathbf{x}(u,v)=(2u,3v,0)$, compute the squared length of coordinate vector $(1,1)$.",
        "steps": [
          {
            "do": "Compute $\\mathbf{x}_u$",
            "result": "$(2,0,0)$",
            "why": "partial in u"
          },
          {
            "do": "Compute $\\mathbf{x}_v$",
            "result": "$(0,3,0)$",
            "why": "partial in v"
          },
          {
            "do": "Find coefficients",
            "result": "$E=4,\\ F=0,\\ G=9$",
            "why": "dot products"
          },
          {
            "do": "Apply to vector",
            "result": "$4(1)^2+0+9(1)^2$",
            "why": "quadratic form"
          },
          {
            "do": "Simplify",
            "result": "$13$",
            "why": "squared length"
          }
        ],
        "answer": "The squared length is $13$."
      },
      {
        "problem": "For $\\mathbf{x}(u,v)=(u,v,u^2+v^2)$, find $E,F,G$ at $(0,0)$.",
        "steps": [
          {
            "do": "Compute $\\mathbf{x}_u$",
            "result": "$(1,0,2u)$",
            "why": "partial in u"
          },
          {
            "do": "Compute $\\mathbf{x}_v$",
            "result": "$(0,1,2v)$",
            "why": "partial in v"
          },
          {
            "do": "Evaluate at origin",
            "result": "$(1,0,0)$ and $(0,1,0)$",
            "why": "substitute"
          },
          {
            "do": "Compute dot products",
            "result": "$E=1,\\ F=0,\\ G=1$",
            "why": "standard perpendicular unit directions"
          },
          {
            "do": "Interpret",
            "result": "locally flat to first order",
            "why": "the tangent plane is horizontal"
          }
        ],
        "answer": "At $(0,0)$, $E=1$, $F=0$, $G=1$."
      },
      {
        "problem": "If $E=4$, $F=1$, $G=3$, find the squared length of coordinate vector $(1,2)$.",
        "steps": [
          {
            "do": "Write formula",
            "result": "$Ea^2+2Fab+Gb^2$",
            "why": "first fundamental form"
          },
          {
            "do": "Substitute",
            "result": "$4(1)^2+2(1)(1)(2)+3(2)^2$",
            "why": "plug in values"
          },
          {
            "do": "Compute first term",
            "result": "$4$",
            "why": "four times one"
          },
          {
            "do": "Compute remaining terms",
            "result": "$4$ and $12$",
            "why": "cross term and last term"
          },
          {
            "do": "Add",
            "result": "$20$",
            "why": "total squared length"
          }
        ],
        "answer": "The squared length is $20$."
      },
      {
        "problem": "A learned surface has $E=9$, $F=0$, $G=4$. Compare coordinate steps $(0.1,0)$ and $(0,0.1)$.",
        "steps": [
          {
            "do": "Compute u-step squared length",
            "result": "$9(0.1)^2=0.09$",
            "why": "only u changes"
          },
          {
            "do": "Take square root",
            "result": "$0.3$",
            "why": "actual length"
          },
          {
            "do": "Compute v-step squared length",
            "result": "$4(0.1)^2=0.04$",
            "why": "only v changes"
          },
          {
            "do": "Take square root",
            "result": "$0.2$",
            "why": "actual length"
          },
          {
            "do": "Compare",
            "result": "$0.3/0.2=1.5$",
            "why": "u step is longer"
          }
        ],
        "answer": "The u step has length $0.3$ and the v step has length $0.2$."
      }
    ],
    "applications": [
      {
        "title": "Texture distortion",
        "background": "Graphics uses metric coefficients to see how texture coordinates stretch.",
        "numbers": "If $E=4$ and $G=1$, $du=0.1$ has length $0.2$, while $dv=0.1$ has length $0.1$."
      },
      {
        "title": "Surface area",
        "background": "The area scale of a patch is $sqrt{EG-F^2}$.",
        "numbers": "With $E=2$, $F=1$, $G=2$, area scale is $\\sqrt3\\approx1.732$."
      },
      {
        "title": "Geodesic computation",
        "background": "Shortest paths on surfaces need the metric because coordinate distance can mislead.",
        "numbers": "If u length costs $3$ per unit, moving $0.2$ in u costs $0.6$."
      },
      {
        "title": "Latent-space geometry",
        "background": "Generative models can pull output-space distances back to latent coordinates.",
        "numbers": "Metric $E=25$ means latent step $du=0.04$ has output length about $0.2$."
      },
      {
        "title": "Robotics on terrain",
        "background": "Ground robots need true surface distance rather than map-coordinate distance.",
        "numbers": "On slope $z=0.3x$, a horizontal $10$ m step has length $10\\sqrt{1.09}\\approx10.44$ m."
      },
      {
        "title": "Medical surfaces",
        "background": "Measurements on organs should use surface area and distance, not flat image coordinates.",
        "numbers": "A parameter square of area $2$ mm$^2$ with area scale $1.5$ represents $3$ mm$^2$."
      }
    ],
    "applicationsClose": "The first fundamental form is the surface's ruler, protractor, and area scale written in coordinate language.",
    "takeaways": [
      "$E=\\mathbf{x}_u\\cdot\\mathbf{x}_u$, $F=\\mathbf{x}_u\\cdot\\mathbf{x}_v$, and $G=\\mathbf{x}_v\\cdot\\mathbf{x}_v$.",
      "A tangent vector $(a,b)$ has squared length $Ea^2+2Fab+Gb^2$.",
      "$F$ records skew between coordinate directions.",
      "The area scale is $\\sqrt{EG-F^2}$."
    ]
  },
  "math-12-09": {
    "id": "math-12-09",
    "title": "The second fundamental form",
    "tagline": "The second fundamental form measures how a surface bends away from its tangent plane.",
    "connections": {
      "buildsOn": [
        "Tangent planes",
        "The first fundamental form",
        "surface normals"
      ],
      "leadsTo": [
        "Gaussian curvature",
        "principal curvatures",
        "shape operators"
      ],
      "usedWith": [
        "normal curvature",
        "quadratic forms",
        "surface approximation",
        "curvature directions"
      ]
    },
    "motivation": "<p>The tangent plane tells the first-order story: the surface is locally flat. But two surfaces can share the same tangent plane and bend very differently just beyond the point.</p><p>The second fundamental form records that next layer. It measures the normal part of second derivatives, the part that shows how the surface peels away from its tangent plane.</p>",
    "definition": "<p>For a regular oriented patch with unit normal $\\mathbf{n}$, define $e=\\mathbf{x}_{uu}\\cdot\\mathbf{n}$, $f=\\mathbf{x}_{uv}\\cdot\\mathbf{n}$, and $g=\\mathbf{x}_{vv}\\cdot\\mathbf{n}$. The <b>second fundamental form</b> is $$II=e\\,du^2+2f\\,du\\,dv+g\\,dv^2.$$</p><p>Second derivatives may have tangential and normal pieces. The tangential pieces can come from coordinates; the normal pieces describe actual bending of the surface in space.</p><p><b>Assumptions that matter:</b> a unit normal must be chosen; reversing it changes signs of $e,f,g$; and the surface needs second derivatives.</p>",
    "worked": {
      "problem": "For $\\mathbf{x}(u,v)=(u,v,u^2+v^2)$ at $(0,0)$ with upward normal, compute $e,f,g$.",
      "skills": [
        "second derivatives",
        "unit normals",
        "bending coefficients"
      ],
      "strategy": "At the origin the tangent plane is horizontal, so dot second derivatives with the upward normal.",
      "steps": [
        {
          "do": "Use upward normal",
          "result": "$\\mathbf{n}=(0,0,1)$",
          "why": "the tangent plane is horizontal at the origin"
        },
        {
          "do": "Compute $\\mathbf{x}_{uu}$",
          "result": "$(0,0,2)$",
          "why": "differentiate twice in u"
        },
        {
          "do": "Compute $\\mathbf{x}_{uv}$",
          "result": "$(0,0,0)$",
          "why": "no mixed term"
        },
        {
          "do": "Compute $\\mathbf{x}_{vv}$",
          "result": "$(0,0,2)$",
          "why": "differentiate twice in v"
        },
        {
          "do": "Dot for e",
          "result": "$e=2$",
          "why": "vertical component is 2"
        },
        {
          "do": "Dot for f and g",
          "result": "$f=0,\\ g=2$",
          "why": "dot remaining second derivatives with n"
        }
      ],
      "verify": "The paraboloid bends upward equally in the two coordinate directions, so matching positive coefficients make sense.",
      "answer": "At $(0,0)$, $II=2\\,du^2+2\\,dv^2$.",
      "connects": "The second fundamental form captures normal bending beyond the tangent plane."
    },
    "practice": [
      {
        "problem": "For the plane $\\mathbf{x}(u,v)=(u,v,0)$, compute $e,f,g$.",
        "steps": [
          {
            "do": "Compute second derivatives",
            "result": "$\\mathbf{0},\\mathbf{0},\\mathbf{0}$",
            "why": "the patch is linear"
          },
          {
            "do": "Choose unit normal",
            "result": "$(0,0,1)$",
            "why": "standard plane normal"
          },
          {
            "do": "Compute e",
            "result": "$0$",
            "why": "zero vector dot normal"
          },
          {
            "do": "Compute f and g",
            "result": "$0$ and $0$",
            "why": "all second derivatives vanish"
          },
          {
            "do": "Interpret",
            "result": "no bending",
            "why": "a plane stays in its tangent plane"
          }
        ],
        "answer": "$e=f=g=0$."
      },
      {
        "problem": "For $\\mathbf{x}(u,v)=(u,v,3u^2)$ at $(0,0)$ with upward normal, compute $e,f,g$.",
        "steps": [
          {
            "do": "Use normal",
            "result": "$(0,0,1)$",
            "why": "tangent plane is horizontal"
          },
          {
            "do": "Compute $\\mathbf{x}_{uu}$",
            "result": "$(0,0,6)$",
            "why": "second derivative of 3u squared"
          },
          {
            "do": "Compute $\\mathbf{x}_{uv}$",
            "result": "$(0,0,0)$",
            "why": "no mixed term"
          },
          {
            "do": "Compute $\\mathbf{x}_{vv}$",
            "result": "$(0,0,0)$",
            "why": "no v squared term"
          },
          {
            "do": "Dot with normal",
            "result": "$e=6,\\ f=0,\\ g=0$",
            "why": "only u direction bends"
          }
        ],
        "answer": "$e=6$, $f=0$, $g=0$."
      },
      {
        "problem": "For $z=uv$ at the origin with upward normal, compute $e,f,g$.",
        "steps": [
          {
            "do": "Write patch",
            "result": "$\\mathbf{x}(u,v)=(u,v,uv)$",
            "why": "height field"
          },
          {
            "do": "Use normal",
            "result": "$(0,0,1)$",
            "why": "first derivatives vanish at origin"
          },
          {
            "do": "Compute $\\mathbf{x}_{uu}$",
            "result": "$(0,0,0)$",
            "why": "no u squared term"
          },
          {
            "do": "Compute $\\mathbf{x}_{uv}$",
            "result": "$(0,0,1)$",
            "why": "mixed derivative of uv"
          },
          {
            "do": "Compute $\\mathbf{x}_{vv}$",
            "result": "$(0,0,0)$",
            "why": "no v squared term"
          },
          {
            "do": "Dot with normal",
            "result": "$e=0,\\ f=1,\\ g=0$",
            "why": "mixed bending only"
          }
        ],
        "answer": "At the origin, $II=2\\,du\\,dv$."
      },
      {
        "problem": "If $e=2$, $f=1$, $g=3$, compute $II$ on direction $(1,-1)$.",
        "steps": [
          {
            "do": "Write form",
            "result": "$e\\,du^2+2f\\,du\\,dv+g\\,dv^2$",
            "why": "second fundamental form"
          },
          {
            "do": "Substitute",
            "result": "$2(1)^2+2(1)(1)(-1)+3(-1)^2$",
            "why": "plug in values"
          },
          {
            "do": "Compute terms",
            "result": "$2-2+3$",
            "why": "evaluate products"
          },
          {
            "do": "Add",
            "result": "$3$",
            "why": "normal bending value"
          },
          {
            "do": "Interpret sign",
            "result": "positive in chosen normal direction",
            "why": "orientation affects sign"
          }
        ],
        "answer": "$II(1,-1)=3$."
      },
      {
        "problem": "A local loss surface is $z=0.5u^2+2v^2$ at the origin. With upward normal, compute $e,f,g$.",
        "steps": [
          {
            "do": "Use normal",
            "result": "$(0,0,1)$",
            "why": "first derivatives vanish at origin"
          },
          {
            "do": "Compute $z_{uu}$",
            "result": "$1$",
            "why": "second derivative of 0.5u squared"
          },
          {
            "do": "Compute $z_{uv}$",
            "result": "$0$",
            "why": "no mixed term"
          },
          {
            "do": "Compute $z_{vv}$",
            "result": "$4$",
            "why": "second derivative of 2v squared"
          },
          {
            "do": "State coefficients",
            "result": "$e=1,\\ f=0,\\ g=4$",
            "why": "dot with upward normal"
          }
        ],
        "answer": "$e=1$, $f=0$, $g=4$, so the surface bends four times as strongly in the v direction."
      }
    ],
    "applications": [
      {
        "title": "Surface shading",
        "background": "Curvature rotates normals, which changes highlights in rendering.",
        "numbers": "A sphere of radius $2$ has bending magnitude about $1/2=0.5$ in every direction."
      },
      {
        "title": "Shape analysis",
        "background": "Vision systems classify domes, saddles, and ridges using local bending.",
        "numbers": "For $z=u^2-v^2$ at the origin, $e=2$, $f=0$, $g=-2$."
      },
      {
        "title": "Loss landscape curvature",
        "background": "Quadratic loss surfaces reveal which parameter directions are stiff.",
        "numbers": "For $L=0.5u^2+2v^2$, second values are $1$ and $4$."
      },
      {
        "title": "Manufacturing quality",
        "background": "Machining and material constraints limit how sharply surfaces may bend.",
        "numbers": "Allowed curvature $0.2$ mm$^{-1}$ rejects radius $3$ mm because $1/3\\approx0.333$."
      },
      {
        "title": "Robotics contact",
        "background": "Grippers use local bending to understand contact stability.",
        "numbers": "A cylinder radius $5$ cm bends with curvature $0.2$ cm$^{-1}$ around and $0$ along its axis."
      },
      {
        "title": "Medical morphology",
        "background": "Anatomical surface comparisons use convexity and saddle behavior.",
        "numbers": "Principal curvatures $0.4$ and $-0.1$ mm$^{-1}$ indicate saddle-like bending."
      }
    ],
    "applicationsClose": "The second fundamental form is the surface's bending ledger beyond first-order flatness.",
    "takeaways": [
      "$e=\\mathbf{x}_{uu}\\cdot\\mathbf{n}$, $f=\\mathbf{x}_{uv}\\cdot\\mathbf{n}$, and $g=\\mathbf{x}_{vv}\\cdot\\mathbf{n}$.",
      "It measures normal, second-order bending.",
      "Changing the chosen normal reverses the signs.",
      "Curvature quantities combine first and second fundamental forms."
    ]
  },
  "math-12-10": {
    "id": "math-12-10",
    "title": "Gaussian curvature",
    "tagline": "Gaussian curvature multiplies the two principal bendings, revealing whether a surface is dome-like, saddle-like, or flat-like.",
    "connections": {
      "buildsOn": [
        "The first fundamental form",
        "The second fundamental form",
        "determinants"
      ],
      "leadsTo": [
        "intrinsic geometry",
        "geodesics",
        "manifold learning"
      ],
      "usedWith": [
        "principal curvatures",
        "surface classification",
        "metrics",
        "local shape"
      ]
    },
    "motivation": "<p>You can recognize three local surface personalities by touch: a sphere-like dome, a saddle, and a flat sheet or cylinder. Gaussian curvature gives that distinction a number.</p><p>It multiplies the two principal curvatures. Same-sign bending gives positive curvature, opposite-sign bending gives negative curvature, and one zero direction gives zero Gaussian curvature.</p>",
    "definition": "<p>For first fundamental coefficients $E,F,G$ and second fundamental coefficients $e,f,g$, the <b>Gaussian curvature</b> is $$K=\\dfrac{eg-f^2}{EG-F^2}.$$ Equivalently, $K=k_1k_2$, the product of principal curvatures.</p><p>The numerator is the determinant of the bending form, and the denominator is the determinant of the metric form. Dividing by $EG-F^2$ corrects for coordinate stretching.</p><p><b>Assumptions that matter:</b> the patch is regular so $EG-F^2>0$; enough derivatives exist; reversing the normal does not change $K$; and $K$ is intrinsic, determined by surface distances.</p>",
    "worked": {
      "problem": "Suppose $E=1$, $F=0$, $G=1$, $e=2$, $f=0$, and $g=2$. Compute $K$ and classify the point.",
      "skills": [
        "fundamental forms",
        "determinants",
        "surface classification"
      ],
      "strategy": "Compute the bending determinant, compute the metric determinant, then divide.",
      "steps": [
        {
          "do": "Compute numerator",
          "result": "$eg-f^2=2\\cdot2-0^2$",
          "why": "bending determinant"
        },
        {
          "do": "Simplify numerator",
          "result": "$4$",
          "why": "multiply coefficients"
        },
        {
          "do": "Compute denominator",
          "result": "$EG-F^2=1\\cdot1-0^2$",
          "why": "metric determinant"
        },
        {
          "do": "Simplify denominator",
          "result": "$1$",
          "why": "orthonormal coordinates"
        },
        {
          "do": "Divide",
          "result": "$K=4$",
          "why": "apply formula"
        },
        {
          "do": "Classify sign",
          "result": "positive curvature",
          "why": "both bendings have same sign"
        }
      ],
      "verify": "If the principal curvatures are both $2$, their product is $4$, matching the formula.",
      "answer": "$K=4$, so the point is locally dome-like or elliptic.",
      "connects": "Gaussian curvature compresses two-direction bending into one intrinsic sign and scale."
    },
    "practice": [
      {
        "problem": "Compute $K$ for a plane with $e=f=g=0$ and $E=G=1$, $F=0$.",
        "steps": [
          {
            "do": "Compute numerator",
            "result": "$0\\cdot0-0^2=0$",
            "why": "no bending"
          },
          {
            "do": "Compute denominator",
            "result": "$1\\cdot1-0=1$",
            "why": "regular metric"
          },
          {
            "do": "Divide",
            "result": "$K=0$",
            "why": "zero over one"
          },
          {
            "do": "Classify",
            "result": "flat",
            "why": "zero Gaussian curvature"
          },
          {
            "do": "Interpret",
            "result": "no bending in any direction",
            "why": "all normal curvature vanishes"
          }
        ],
        "answer": "$K=0$."
      },
      {
        "problem": "A sphere of radius $3$ has principal curvatures $1/3$ and $1/3$. Find $K$.",
        "steps": [
          {
            "do": "Write product",
            "result": "$K=k_1k_2$",
            "why": "principal curvature formula"
          },
          {
            "do": "Substitute",
            "result": "$(1/3)(1/3)$",
            "why": "sphere bends equally"
          },
          {
            "do": "Multiply",
            "result": "$1/9$",
            "why": "product of reciprocals"
          },
          {
            "do": "Attach units",
            "result": "inverse length squared",
            "why": "curvature product has squared units"
          },
          {
            "do": "Classify",
            "result": "positive",
            "why": "sphere is dome-like"
          }
        ],
        "answer": "$K=1/9$."
      },
      {
        "problem": "A cylinder of radius $4$ has principal curvatures $1/4$ and $0$. Find $K$.",
        "steps": [
          {
            "do": "Write curvatures",
            "result": "$k_1=1/4,\\ k_2=0$",
            "why": "one direction bends and one is straight"
          },
          {
            "do": "Multiply",
            "result": "$(1/4)\\cdot0$",
            "why": "product formula"
          },
          {
            "do": "Simplify",
            "result": "$K=0$",
            "why": "one zero factor"
          },
          {
            "do": "Classify",
            "result": "zero Gaussian curvature",
            "why": "developable behavior"
          },
          {
            "do": "Interpret",
            "result": "a cylinder unrolls without stretching",
            "why": "intrinsic curvature is zero"
          }
        ],
        "answer": "$K=0$."
      },
      {
        "problem": "At a point $E=2$, $F=0$, $G=2$, $e=1$, $f=0$, $g=-1$. Compute $K$.",
        "steps": [
          {
            "do": "Compute numerator",
            "result": "$1(-1)-0=-1$",
            "why": "opposite bending signs"
          },
          {
            "do": "Compute denominator",
            "result": "$2\\cdot2-0=4$",
            "why": "metric determinant"
          },
          {
            "do": "Divide",
            "result": "$K=-1/4$",
            "why": "curvature value"
          },
          {
            "do": "Classify sign",
            "result": "negative",
            "why": "saddle-like"
          },
          {
            "do": "Interpret",
            "result": "one way curves up and one curves down",
            "why": "opposite signs create a saddle"
          }
        ],
        "answer": "$K=-1/4$, so the point is saddle-like."
      },
      {
        "problem": "A learned 2-D manifold has estimated principal curvatures $0.8$ and $-0.3$. Compute $K$ and interpret.",
        "steps": [
          {
            "do": "Use product",
            "result": "$K=k_1k_2$",
            "why": "principal curvatures are given"
          },
          {
            "do": "Substitute",
            "result": "$0.8(-0.3)$",
            "why": "multiply bendings"
          },
          {
            "do": "Compute",
            "result": "$-0.24$",
            "why": "negative product"
          },
          {
            "do": "Classify",
            "result": "saddle-like local geometry",
            "why": "signs are opposite"
          },
          {
            "do": "Interpret",
            "result": "nearby distances spread differently across directions",
            "why": "negative curvature suggests hyperbolic flavor"
          }
        ],
        "answer": "$K=-0.24$, indicating saddle-like local geometry."
      }
    ],
    "applications": [
      {
        "title": "Shape classification",
        "background": "Gaussian curvature separates domes, saddles, and flat-like regions in geometry processing.",
        "numbers": "Curvatures $0.2$ and $0.2$ give $K=0.04$; $0.2$ and $-0.2$ give $K=-0.04$."
      },
      {
        "title": "3-D scanning",
        "background": "Scanned meshes estimate curvature to find ridges, dents, and saddle points.",
        "numbers": "Principal curvatures $0.5$ and $0.1$ mm$^{-1}$ give $K=0.05$ mm$^{-2}$."
      },
      {
        "title": "Flattening surfaces",
        "background": "Zero Gaussian curvature surfaces can be flattened locally without stretching.",
        "numbers": "A cylinder of radius $10$ cm has $K=(0.1)(0)=0$."
      },
      {
        "title": "Robotics footholds",
        "background": "Legged robots prefer contact patches with predictable local shape.",
        "numbers": "Curvatures $0.2$ and $0.15$ give $K=0.03$; $0.2$ and $-0.15$ give $K=-0.03$."
      },
      {
        "title": "Manifold learning diagnostics",
        "background": "Estimated curvature summarizes local geometry of learned manifolds.",
        "numbers": "Curvatures $0.05$ and $0.04$ produce $K=0.002$, mild positive curvature."
      },
      {
        "title": "Loss landscape intuition",
        "background": "Two-parameter losses can be bowl-like or saddle-like near critical points.",
        "numbers": "For $L=u^2-v^2$, one direction bends up and one down, so $K$ is negative."
      }
    ],
    "applicationsClose": "Gaussian curvature is a compact shape signature: dome-like, saddle-like, or flat-like.",
    "takeaways": [
      "Gaussian curvature is $K=(eg-f^2)/(EG-F^2)$.",
      "It also equals $k_1k_2$.",
      "Positive, negative, and zero signs describe dome-like, saddle-like, and flat-like behavior.",
      "The denominator $EG-F^2$ corrects for coordinate stretching."
    ]
  }
};
