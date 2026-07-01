module.exports = {
  "math-03-13": {
    "id": "math-03-13",
    "title": "Second-order linear ODE theory",
    "tagline": "Second-order theory tells you when two independent solutions are enough to describe every motion.",
    "connections": {
      "buildsOn": [
        "first-order ODEs",
        "derivatives",
        "linear combinations"
      ],
      "leadsTo": [
        "Constant-coefficient homogeneous equations",
        "Method of undetermined coefficients",
        "Variation of parameters"
      ],
      "usedWith": [
        "Wronskians",
        "initial-value problems",
        "superposition",
        "linear operators"
      ]
    },
    "motivation": "<p>You already know that a first-order equation needs one initial value. A second-order equation tracks both a quantity and its velocity, so it needs two pieces of starting information.</p><p>The comforting news is that linearity keeps the world organized. If two independent solutions are known, every solution is a weighted blend of them, and the initial conditions simply choose the weights.</p>",
    "definition": "<p>A <b>second-order linear ODE</b> has the form $a_2(t)y''+a_1(t)y'+a_0(t)y=g(t)$, where $y$ is the unknown function of $t$, primes mean derivatives, and the coefficients $a_2,a_1,a_0$ are given functions. If $g(t)=0$, the equation is homogeneous; otherwise it is forced.</p><p>For the homogeneous equation, the solution set is a two-dimensional vector space on any interval where $a_2(t)\\ne0$ and the coefficients are continuous. Two solutions $y_1,y_2$ form a fundamental set when their Wronskian $W=y_1y_2'-y_1'y_2$ is not zero at one point, and then $y=C_1y_1+C_2y_2$ gives every homogeneous solution.</p><p><b>Assumptions that matter:</b> the equation is linear in $y,y',y''$; coefficients are continuous on the interval; $a_2(t)$ does not vanish there; and initial data $y(t_0),y'(t_0)$ are specified at a point inside the interval.</p>",
    "worked": {
      "problem": "For $y''+y'-2y=0$, use $y_1=e^t$ and $y_2=e^{-2t}$ to solve $y(0)=3$, $y'(0)=0$.",
      "skills": [
        "fundamental solutions",
        "Wronskian",
        "initial conditions"
      ],
      "strategy": "The theory says a linear combination is enough — check independence, then let the initial data choose the constants.",
      "steps": [
        {
          "do": "Compute the Wronskian",
          "result": "$W=e^t(-2e^{-2t})-e^t e^{-2t}$",
          "why": "use $y_1y_2'-y_1'y_2$"
        },
        {
          "do": "Simplify the Wronskian",
          "result": "$W=-3e^{-t}$",
          "why": "this is never zero"
        },
        {
          "do": "Write the general solution",
          "result": "$y=C_1e^t+C_2e^{-2t}$",
          "why": "independent solutions span the homogeneous solution space"
        },
        {
          "do": "Apply $y(0)=3$",
          "result": "$C_1+C_2=3$",
          "why": "both exponentials equal $1$ at $t=0$"
        },
        {
          "do": "Differentiate the solution",
          "result": "$y'=C_1e^t-2C_2e^{-2t}$",
          "why": "needed for the velocity condition"
        },
        {
          "do": "Apply $y'(0)=0$",
          "result": "$C_1-2C_2=0$",
          "why": "substitute $t=0$"
        },
        {
          "do": "Solve the two equations",
          "result": "$C_1=2,\\ C_2=1$",
          "why": "the initial conditions fix one point in the solution space"
        }
      ],
      "verify": "Substituting $2e^t+e^{-2t}$ gives $y(0)=3$ and $y'(0)=2-2=0$, so the constants match the data.",
      "answer": "$y(t)=2e^t+e^{-2t}$.",
      "connects": "The Wronskian is the independence test that makes the two-constant formula trustworthy."
    },
    "practice": [
      {
        "problem": "Classify $t^2y''+3ty'+y=\\sin t$ on $t>0$.",
        "steps": [
          {
            "do": "Identify the highest derivative",
            "result": "$y''$",
            "why": "second derivative is present"
          },
          {
            "do": "Check linearity in $y,y',y''$",
            "result": "linear",
            "why": "no powers or products of the unknown appear"
          },
          {
            "do": "Read the forcing term",
            "result": "$\\sin t$",
            "why": "the right side is not zero"
          },
          {
            "do": "Check the leading coefficient on $t>0$",
            "result": "$t^2\\ne0$",
            "why": "the interval avoids the singular point"
          }
        ],
        "answer": "It is a second-order linear nonhomogeneous ODE on $t>0$."
      },
      {
        "problem": "Find the Wronskian of $y_1=e^t$ and $y_2=e^{2t}$.",
        "steps": [
          {
            "do": "Differentiate $y_1$",
            "result": "$y_1'=e^t$",
            "why": "exponential derivative"
          },
          {
            "do": "Differentiate $y_2$",
            "result": "$y_2'=2e^{2t}$",
            "why": "chain rule"
          },
          {
            "do": "Form $W$",
            "result": "$W=e^t(2e^{2t})-e^t(e^{2t})$",
            "why": "use $y_1y_2'-y_1'y_2$"
          },
          {
            "do": "Simplify",
            "result": "$W=e^{3t}$",
            "why": "combine like exponential terms"
          }
        ],
        "answer": "$W=e^{3t}$, so the two solutions are independent on every interval."
      },
      {
        "problem": "If $y=C_1\\cos t+C_2\\sin t$, impose $y(0)=2$ and $y'(0)=-3$.",
        "steps": [
          {
            "do": "Apply $y(0)=2$",
            "result": "$C_1=2$",
            "why": "$\\cos0=1$ and $\\sin0=0$"
          },
          {
            "do": "Differentiate",
            "result": "$y'=-C_1\\sin t+C_2\\cos t$",
            "why": "needed for the second initial value"
          },
          {
            "do": "Apply $y'(0)=-3$",
            "result": "$C_2=-3$",
            "why": "$\\sin0=0$ and $\\cos0=1$"
          },
          {
            "do": "Write the solution",
            "result": "$y=2\\cos t-3\\sin t$",
            "why": "substitute the constants"
          }
        ],
        "answer": "$y(t)=2\\cos t-3\\sin t$."
      },
      {
        "problem": "Suppose $L[y]=y''+4y$ and $L[u]=0$, $L[v]=0$. Compute $L[5u-2v]$.",
        "steps": [
          {
            "do": "Use linearity",
            "result": "$L[5u-2v]=5L[u]-2L[v]$",
            "why": "linear operators distribute over combinations"
          },
          {
            "do": "Substitute $L[u]=0$",
            "result": "$5\\cdot0-2L[v]$",
            "why": "first solution is homogeneous"
          },
          {
            "do": "Substitute $L[v]=0$",
            "result": "$5\\cdot0-2\\cdot0$",
            "why": "second solution is homogeneous"
          },
          {
            "do": "Simplify",
            "result": "$0$",
            "why": "zero combinations remain zero"
          }
        ],
        "answer": "$L[5u-2v]=0$, so $5u-2v$ is also a homogeneous solution."
      },
      {
        "problem": "A model has two modes $e^{-t}$ and $e^{-4t}$. Fit $y(0)=10$, $y'(0)=-16$.",
        "steps": [
          {
            "do": "Write the general form",
            "result": "$y=C_1e^{-t}+C_2e^{-4t}$",
            "why": "two independent modes span the solution"
          },
          {
            "do": "Apply $y(0)=10$",
            "result": "$C_1+C_2=10$",
            "why": "both modes equal $1$ initially"
          },
          {
            "do": "Differentiate",
            "result": "$y'=-C_1e^{-t}-4C_2e^{-4t}$",
            "why": "velocity selects the constants"
          },
          {
            "do": "Apply $y'(0)=-16$",
            "result": "$-C_1-4C_2=-16$",
            "why": "substitute $t=0$"
          },
          {
            "do": "Solve",
            "result": "$C_1=8,\\ C_2=2$",
            "why": "the two equations determine the weights"
          }
        ],
        "answer": "$y(t)=8e^{-t}+2e^{-4t}$."
      }
    ],
    "applications": [
      {
        "title": "Mechanical position and velocity",
        "background": "Newtonian mechanics naturally gives second-order equations because force controls acceleration. That is why a spring needs position and velocity to predict its future.",
        "numbers": "For $x''+4x=0$ with $x(0)=3$ and $x'(0)=0$, the solution is $x=3\\cos2t$; at $t=\\pi/4$, $x=0$."
      },
      {
        "title": "Circuit charge and current",
        "background": "RLC circuits use charge $q$ and current $q'$ in the same second-order pattern. The mathematics predates digital electronics but still guides filters.",
        "numbers": "If $q=2e^{-t}+e^{-3t}$ coulombs, then $q(0)=3$ and current $q'(0)=-2-3=-5$ amperes."
      },
      {
        "title": "Optimizer momentum",
        "background": "Heavy-ball optimization behaves like a damped second-order system near a quadratic minimum, which is why velocity is stored in the algorithm.",
        "numbers": "For mode $e^{-0.5t}$, after $t=4$ the factor is $e^{-2}\\u0007pprox0.135$, so an error of $10$ falls to about $1.35$."
      },
      {
        "title": "Camera stabilization",
        "background": "A stabilizer has to infer position and angular velocity, not just a static angle. Second-order models make overshoot visible.",
        "numbers": "A response $\\theta=5e^{-2t}$ degrees has $\\theta(1)\\u0007pprox0.68$ degrees and angular speed $\\theta'(1)\\u0007pprox-1.35$ degrees per second."
      },
      {
        "title": "Population with inertia",
        "background": "Some ecological models include delayed or inertial adjustment rather than first-order growth. The second state can represent adjustment speed.",
        "numbers": "If a disturbance has modes $6e^{-t}-2e^{-2t}$, its initial size is $4$ and by $t=2$ it is $6e^{-2}-2e^{-4}\\u0007pprox0.775$."
      },
      {
        "title": "Signal smoothing",
        "background": "Second-order low-pass filters smooth signals while controlling ringing. The theory separates natural modes from forcing.",
        "numbers": "Two decay modes $0.7e^{-3t}+0.3e^{-9t}$ have value $1$ at $0$ and about $0.7e^{-3}+0.3e^{-9}\\u0007pprox0.035$ at $t=1$."
      }
    ],
    "applicationsClose": "Across mechanics, circuits, filters, and optimization, the same two-dimensional solution space carries the state forward.",
    "takeaways": [
      "A second-order linear homogeneous solution space has dimension two under standard continuity assumptions.",
      "A nonzero Wronskian means two solutions are independent and form a fundamental set.",
      "Initial position and velocity choose the constants in the general solution.",
      "Linearity makes superposition reliable."
    ]
  },
  "math-03-14": {
    "id": "math-03-14",
    "title": "Constant-coefficient homogeneous equations",
    "tagline": "Constant coefficients turn the search for functions into the search for roots of a polynomial.",
    "connections": {
      "buildsOn": [
        "Second-order linear ODE theory",
        "exponential functions",
        "quadratic equations"
      ],
      "leadsTo": [
        "Method of undetermined coefficients",
        "Forced oscillations and resonance",
        "Higher-order linear ODEs"
      ],
      "usedWith": [
        "characteristic equations",
        "complex numbers",
        "initial-value problems",
        "stability"
      ]
    },
    "motivation": "<p>You already know that $e^{rt}$ is special because differentiating it only multiplies by $r$. Constant-coefficient ODEs are built to reward that fact.</p><p>Instead of guessing many shapes, we try one exponential, turn derivatives into powers of $r$, and solve an algebraic equation. The roots become the natural modes of the system.</p>",
    "definition": "<p>For $ay''+by'+cy=0$ with constants $a\\ne0,b,c$, try $y=e^{rt}$. Substitution gives $(ar^2+br+c)e^{rt}=0$, so the <b>characteristic equation</b> is $ar^2+br+c=0$.</p><p>Distinct real roots $r_1,r_2$ give $C_1e^{r_1t}+C_2e^{r_2t}$. A repeated root $r$ gives $(C_1+C_2t)e^{rt}$. Complex roots $\\u0007lpha\\pm i\\beta$ give $e^{\\u0007lpha t}(C_1\\cos\\beta t+C_2\\sin\\beta t)$.</p><p><b>Assumptions that matter:</b> coefficients are constant, the equation is homogeneous, and roots are counted with multiplicity. Complex roots appear in conjugate pairs when the coefficients are real.</p>",
    "worked": {
      "problem": "Solve $y''-3y'+2y=0$ with $y(0)=5$, $y'(0)=8$.",
      "skills": [
        "characteristic equation",
        "real roots",
        "initial data"
      ],
      "strategy": "The exponential trial turns the ODE into a quadratic; the initial data choose the mode weights.",
      "steps": [
        {
          "do": "Write the characteristic equation",
          "result": "$r^2-3r+2=0$",
          "why": "replace $y'',y'$ by $r^2,r$"
        },
        {
          "do": "Factor the polynomial",
          "result": "$(r-1)(r-2)=0$",
          "why": "find the roots"
        },
        {
          "do": "Read the roots",
          "result": "$r=1,2$",
          "why": "each root gives an exponential mode"
        },
        {
          "do": "Write the general solution",
          "result": "$y=C_1e^t+C_2e^{2t}$",
          "why": "distinct real roots"
        },
        {
          "do": "Apply $y(0)=5$",
          "result": "$C_1+C_2=5$",
          "why": "both exponentials equal $1$"
        },
        {
          "do": "Differentiate",
          "result": "$y'=C_1e^t+2C_2e^{2t}$",
          "why": "needed for $y'(0)$"
        },
        {
          "do": "Apply $y'(0)=8$",
          "result": "$C_1+2C_2=8$",
          "why": "substitute $t=0$"
        },
        {
          "do": "Solve",
          "result": "$C_1=2,\\ C_2=3$",
          "why": "subtract the equations"
        }
      ],
      "verify": "At $t=0$, $2+3=5$ and $2+6=8$, so both initial conditions are satisfied.",
      "answer": "$y(t)=2e^t+3e^{2t}$.",
      "connects": "The roots $1$ and $2$ are the system's natural exponential modes."
    },
    "practice": [
      {
        "problem": "Solve $y''+5y'+6y=0$.",
        "steps": [
          {
            "do": "Write the characteristic equation",
            "result": "$r^2+5r+6=0$",
            "why": "constant coefficients invite an exponential trial"
          },
          {
            "do": "Factor",
            "result": "$(r+2)(r+3)=0$",
            "why": "find two real roots"
          },
          {
            "do": "Read roots",
            "result": "$r=-2,-3$",
            "why": "set each factor to zero"
          },
          {
            "do": "Write the solution",
            "result": "$y=C_1e^{-2t}+C_2e^{-3t}$",
            "why": "distinct roots give distinct exponentials"
          }
        ],
        "answer": "$y=C_1e^{-2t}+C_2e^{-3t}$."
      },
      {
        "problem": "Solve $y''-4y'+4y=0$.",
        "steps": [
          {
            "do": "Write the characteristic equation",
            "result": "$r^2-4r+4=0$",
            "why": "replace derivatives by powers of $r$"
          },
          {
            "do": "Factor",
            "result": "$(r-2)^2=0$",
            "why": "the root repeats"
          },
          {
            "do": "Read the repeated root",
            "result": "$r=2$",
            "why": "multiplicity two"
          },
          {
            "do": "Write the repeated-root form",
            "result": "$y=(C_1+C_2t)e^{2t}$",
            "why": "the extra $t$ supplies independence"
          }
        ],
        "answer": "$y=(C_1+C_2t)e^{2t}$."
      },
      {
        "problem": "Solve $y''+9y=0$ with $y(0)=1$, $y'(0)=6$.",
        "steps": [
          {
            "do": "Write the characteristic equation",
            "result": "$r^2+9=0$",
            "why": "constant-coefficient homogeneous form"
          },
          {
            "do": "Solve for roots",
            "result": "$r=\\pm3i$",
            "why": "complex roots with zero real part"
          },
          {
            "do": "Write the real solution",
            "result": "$y=C_1\\cos3t+C_2\\sin3t$",
            "why": "Euler's formula gives sine and cosine"
          },
          {
            "do": "Apply $y(0)=1$",
            "result": "$C_1=1$",
            "why": "cosine is $1$, sine is $0$"
          },
          {
            "do": "Differentiate",
            "result": "$y'=-3C_1\\sin3t+3C_2\\cos3t$",
            "why": "needed for velocity"
          },
          {
            "do": "Apply $y'(0)=6$",
            "result": "$3C_2=6$",
            "why": "cosine is $1$ at zero"
          },
          {
            "do": "Solve",
            "result": "$C_2=2$",
            "why": "divide by $3$"
          }
        ],
        "answer": "$y=\\cos3t+2\\sin3t$."
      },
      {
        "problem": "Classify the roots of $2y''+2y'+5y=0$ and write the solution form.",
        "steps": [
          {
            "do": "Write the characteristic equation",
            "result": "$2r^2+2r+5=0$",
            "why": "use the coefficients"
          },
          {
            "do": "Compute the discriminant",
            "result": "$2^2-4\\cdot2\\cdot5=-36$",
            "why": "negative means complex roots"
          },
          {
            "do": "Apply the quadratic formula",
            "result": "$r=\\dfrac{-2\\pm6i}{4}$",
            "why": "use $\\sqrt{-36}=6i$"
          },
          {
            "do": "Simplify",
            "result": "$r=-\\dfrac12\\pm\\dfrac32i$",
            "why": "divide numerator and denominator"
          },
          {
            "do": "Write the solution form",
            "result": "$e^{-t/2}(C_1\\cos\\tfrac32t+C_2\\sin\\tfrac32t)$",
            "why": "real part controls decay, imaginary part controls oscillation"
          }
        ],
        "answer": "$y=e^{-t/2}(C_1\\cos\\tfrac32t+C_2\\sin\\tfrac32t)$."
      },
      {
        "problem": "For a training error mode $e^{-4t}$, find when it drops below $1\\%$ of its initial value.",
        "steps": [
          {
            "do": "Write the inequality",
            "result": "$e^{-4t}<0.01$",
            "why": "one percent means factor $0.01$"
          },
          {
            "do": "Take natural logs",
            "result": "$-4t<\\ln(0.01)$",
            "why": "log is increasing"
          },
          {
            "do": "Use $\\ln(0.01)=-4.605\\ldots$",
            "result": "$-4t<-4.605\\ldots$",
            "why": "numerical value"
          },
          {
            "do": "Divide by $-4$",
            "result": "$t>1.151\\ldots$",
            "why": "reverse the inequality when dividing by a negative"
          }
        ],
        "answer": "After about $1.16$ time units, the mode is below $1\\%$."
      }
    ],
    "applications": [
      {
        "title": "Damped mechanical modes",
        "background": "A mass-spring-damper with constant mass, damping, and stiffness has constant coefficients. Its roots tell whether it returns smoothly or rings.",
        "numbers": "For $r^2+6r+8=0$, roots $-2,-4$ give modes $e^{-2t},e^{-4t}$; at $t=1$, they are $0.135$ and $0.018$."
      },
      {
        "title": "Electrical transients",
        "background": "RLC circuits respond with exponentials after a switch. Engineers read roots to estimate settling.",
        "numbers": "A pole at $-50$ has time constant $1/50=0.02$s; about $4$ time constants gives $0.08$s to settle near $2\\%$."
      },
      {
        "title": "Gradient descent near a quadratic",
        "background": "Linearized optimization error often evolves by constant modes, so root signs become convergence rates.",
        "numbers": "Mode $e^{-0.2t}$ keeps $e^{-2}=0.135$ after $10$ units; mode $e^{-1.0t}$ keeps only $e^{-10}\\u0007pprox0.000045$."
      },
      {
        "title": "Audio resonators",
        "background": "A simple resonator is modeled by constant-coefficient equations. Complex roots encode frequency and decay.",
        "numbers": "Roots $-3\\pm40i$ decay with factor $e^{-3t}$ and oscillate at angular frequency $40$ rad/s, about $6.37$ cycles/s."
      },
      {
        "title": "Server recovery models",
        "background": "After a sudden load drop, queue length can be approximated by decaying modes. The slowest root dominates user-visible recovery.",
        "numbers": "If $q(t)=100e^{-t}+20e^{-5t}$, then $q(3)\\u0007pprox4.98+0.000006$, so the $e^{-t}$ mode controls the tail."
      },
      {
        "title": "Numerical stability tests",
        "background": "Before simulating an ODE, roots give a baseline behavior the numerical method should respect.",
        "numbers": "For $y'=-10y$, Euler with step $h=0.05$ multiplies by $1-0.5=0.5$ per step; $10$ steps give $0.5^{10}\\u0007pprox0.00098$."
      }
    ],
    "applicationsClose": "Roots are small algebraic objects, but they carry decay, growth, oscillation, and numerical stability across many systems.",
    "takeaways": [
      "Trying $e^{rt}$ converts constant-coefficient homogeneous ODEs into characteristic polynomials.",
      "Distinct, repeated, and complex roots each have a specific solution form.",
      "The real part of a root controls growth or decay; the imaginary part controls oscillation.",
      "Initial conditions choose the constants after the modes are known."
    ]
  },
  "math-03-15": {
    "id": "math-03-15",
    "title": "Method of undetermined coefficients",
    "tagline": "When the forcing has a familiar shape, guess that shape and let algebra determine the coefficients.",
    "connections": {
      "buildsOn": [
        "Constant-coefficient homogeneous equations",
        "polynomial algebra",
        "sine and cosine derivatives"
      ],
      "leadsTo": [
        "Variation of parameters",
        "Forced oscillations and resonance",
        "linear systems"
      ],
      "usedWith": [
        "superposition",
        "annihilators",
        "resonance",
        "particular solutions"
      ]
    },
    "motivation": "<p>You can already solve the natural motion of a constant-coefficient ODE. Real systems also get pushed: a motor supplies a sinusoid, a heater supplies a constant input, or a data pipeline receives a trend.</p><p>Undetermined coefficients says: if the input is made of exponentials, polynomials, sines, or cosines, guess a matching shape. The ODE turns that guess into algebra.</p>",
    "definition": "<p>For $L[y]=g(t)$, where $L$ is a constant-coefficient linear operator, the full solution is $y=y_h+y_p$. The homogeneous part $y_h$ solves $L[y_h]=0$; the particular part $y_p$ is one function with $L[y_p]=g(t)$.</p><p>The method chooses a trial form for $y_p$ from the shape of $g(t)$. If the trial overlaps a homogeneous mode, multiply by enough powers of $t$ to make it independent. Then substitute and solve for the unknown coefficients.</p><p><b>Assumptions that matter:</b> coefficients are constant; the forcing is a finite combination of the standard trial families; and resonance is handled by multiplying the trial by $t$ once for each overlap.</p>",
    "worked": {
      "problem": "Find a particular solution of $y''-3y'+2y=e^{3t}$.",
      "skills": [
        "trial functions",
        "substitution",
        "coefficient matching"
      ],
      "strategy": "The forcing is exponential and not a homogeneous mode, so try the same exponential.",
      "steps": [
        {
          "do": "Write the characteristic roots",
          "result": "$r=1,2$",
          "why": "they come from $r^2-3r+2=0$"
        },
        {
          "do": "Choose a trial",
          "result": "$y_p=Ae^{3t}$",
          "why": "$e^{3t}$ is not a homogeneous mode"
        },
        {
          "do": "Differentiate once",
          "result": "$y_p'=3Ae^{3t}$",
          "why": "needed for the ODE"
        },
        {
          "do": "Differentiate twice",
          "result": "$y_p''=9Ae^{3t}$",
          "why": "needed for the ODE"
        },
        {
          "do": "Substitute",
          "result": "$(9A-9A+2A)e^{3t}=e^{3t}$",
          "why": "combine the three terms"
        },
        {
          "do": "Match coefficients",
          "result": "$2A=1$",
          "why": "the exponential factor is common"
        },
        {
          "do": "Solve",
          "result": "$A=\\dfrac12$",
          "why": "divide by $2$"
        }
      ],
      "verify": "Substituting $\\frac12e^{3t}$ gives $(9/2-9/2+1)e^{3t}=e^{3t}$.",
      "answer": "$y_p=\\dfrac12e^{3t}$.",
      "connects": "The operator tests the guessed shape and leaves only coefficient algebra."
    },
    "practice": [
      {
        "problem": "Find a particular solution of $y''+y'=4$.",
        "steps": [
          {
            "do": "Choose a trial",
            "result": "$y_p=At$",
            "why": "a constant forcing overlaps the constant homogeneous mode, so multiply by $t$"
          },
          {
            "do": "Differentiate",
            "result": "$y_p'=A$",
            "why": "first derivative appears"
          },
          {
            "do": "Differentiate again",
            "result": "$y_p''=0$",
            "why": "second derivative appears"
          },
          {
            "do": "Substitute",
            "result": "$0+A=4$",
            "why": "use the ODE"
          },
          {
            "do": "Solve",
            "result": "$A=4$",
            "why": "match constants"
          }
        ],
        "answer": "$y_p=4t$."
      },
      {
        "problem": "Find a particular solution of $y''-y=t$.",
        "steps": [
          {
            "do": "Choose a polynomial trial",
            "result": "$y_p=At+B$",
            "why": "the forcing is degree one"
          },
          {
            "do": "Compute derivatives",
            "result": "$y_p'=A,\\ y_p''=0$",
            "why": "the second derivative vanishes"
          },
          {
            "do": "Substitute",
            "result": "$0-(At+B)=t$",
            "why": "apply $y''-y$"
          },
          {
            "do": "Match the $t$ coefficient",
            "result": "$-A=1$",
            "why": "compare linear terms"
          },
          {
            "do": "Match the constant coefficient",
            "result": "$-B=0$",
            "why": "compare constants"
          },
          {
            "do": "Solve",
            "result": "$A=-1,\\ B=0$",
            "why": "both coefficients are determined"
          }
        ],
        "answer": "$y_p=-t$."
      },
      {
        "problem": "Find a particular solution of $y''+4y=8\\cos t$.",
        "steps": [
          {
            "do": "Choose a sinusoidal trial",
            "result": "$y_p=A\\cos t+B\\sin t$",
            "why": "sine and cosine trade derivatives"
          },
          {
            "do": "Differentiate twice",
            "result": "$y_p''=-A\\cos t-B\\sin t$",
            "why": "second derivatives negate the trial"
          },
          {
            "do": "Substitute",
            "result": "$3A\\cos t+3B\\sin t=8\\cos t$",
            "why": "combine $y''+4y$"
          },
          {
            "do": "Match cosine coefficients",
            "result": "$3A=8$",
            "why": "right side has cosine only"
          },
          {
            "do": "Match sine coefficients",
            "result": "$3B=0$",
            "why": "no sine on the right"
          },
          {
            "do": "Solve",
            "result": "$A=\\dfrac83,\\ B=0$",
            "why": "divide by $3$"
          }
        ],
        "answer": "$y_p=\\dfrac83\\cos t$."
      },
      {
        "problem": "Find a particular solution of $y''-2y'+y=e^t$.",
        "steps": [
          {
            "do": "Find the homogeneous root",
            "result": "$(r-1)^2=0$",
            "why": "the characteristic equation has repeated root $1$"
          },
          {
            "do": "Notice overlap",
            "result": "$e^t$ is already a double homogeneous mode",
            "why": "the trial must be multiplied by $t^2$"
          },
          {
            "do": "Choose the trial",
            "result": "$y_p=At^2e^t$",
            "why": "two powers of $t$ remove resonance"
          },
          {
            "do": "Use the shifted operator",
            "result": "$(D-1)^2[At^2e^t]=e^tD^2[At^2]$",
            "why": "the repeated root simplifies the calculation"
          },
          {
            "do": "Differentiate twice",
            "result": "$D^2[At^2]=2A$",
            "why": "two derivatives of $At^2$"
          },
          {
            "do": "Match",
            "result": "$2Ae^t=e^t$",
            "why": "compare coefficients"
          },
          {
            "do": "Solve",
            "result": "$A=\\dfrac12$",
            "why": "divide by $2$"
          }
        ],
        "answer": "$y_p=\\dfrac12t^2e^t$."
      },
      {
        "problem": "A loss is forced by $3e^{-t}$ in $y'+2y=3e^{-t}$. Find $y_p$.",
        "steps": [
          {
            "do": "Choose a trial",
            "result": "$y_p=Ae^{-t}$",
            "why": "the forcing is exponential"
          },
          {
            "do": "Differentiate",
            "result": "$y_p'=-Ae^{-t}$",
            "why": "needed for the left side"
          },
          {
            "do": "Substitute",
            "result": "$-Ae^{-t}+2Ae^{-t}=3e^{-t}$",
            "why": "apply $y'+2y$"
          },
          {
            "do": "Combine terms",
            "result": "$Ae^{-t}=3e^{-t}$",
            "why": "like exponentials combine"
          },
          {
            "do": "Solve",
            "result": "$A=3$",
            "why": "match coefficients"
          }
        ],
        "answer": "$y_p=3e^{-t}$."
      }
    ],
    "applications": [
      {
        "title": "Servo tracking",
        "background": "Control engineers use sinusoidal and step inputs to test whether a device follows commands. Undetermined coefficients gives the steady response.",
        "numbers": "For $x''+4x=8\\cos t$, the particular amplitude is $8/(4-1)=8/3\\u0007pprox2.67$."
      },
      {
        "title": "Thermal forcing",
        "background": "A building heated by a nearly constant source can be approximated by a constant forcing term.",
        "numbers": "For $T'+0.5T=10$, the steady particular value is $T_p=20$ because $0.5\\cdot20=10$."
      },
      {
        "title": "Trend removal",
        "background": "Polynomial forcing represents ramps in demand or baseline drift in data streams.",
        "numbers": "For $y'+y=2t$, a trial $At+B$ gives $A=2$, $A+B=0$, so $y_p=2t-2$."
      },
      {
        "title": "Signal processing",
        "background": "Sinusoidal tests measure frequency response, a practice that goes back to analog filters.",
        "numbers": "For $y''+9y=5\\cos2t$, amplitude is $5/(9-4)=1$, so $y_p=\\cos2t$."
      },
      {
        "title": "Optimizer bias correction",
        "background": "Exponential inputs model decaying bias or scheduled learning-rate effects.",
        "numbers": "For $m'+3m=e^{-t}$, $m_p=\\frac12e^{-t}$ because $(-1+3)/2=1$."
      },
      {
        "title": "Queue warm starts",
        "background": "A sudden constant arrival surplus can be modeled as forcing toward a new equilibrium.",
        "numbers": "If $q'+4q=12$, the particular queue level is $q_p=3$ since $4\\cdot3=12$."
      }
    ],
    "applicationsClose": "The same move appears everywhere: match the input's shape, substitute, and let coefficients reveal the steady response.",
    "takeaways": [
      "The full solution is homogeneous plus particular.",
      "Undetermined coefficients works for standard forcing families with constant coefficients.",
      "Resonance means the trial overlaps the homogeneous solution, so multiply by powers of $t$.",
      "Coefficient matching is the algebraic heart of the method."
    ]
  },
  "math-03-16": {
    "id": "math-03-16",
    "title": "Variation of parameters",
    "tagline": "Variation of parameters replaces clever guessing with a systematic integral recipe.",
    "connections": {
      "buildsOn": [
        "Second-order linear ODE theory",
        "Wronskians",
        "integration"
      ],
      "leadsTo": [
        "Forced oscillations and resonance",
        "Green's functions",
        "Laplace transforms"
      ],
      "usedWith": [
        "fundamental solutions",
        "particular solutions",
        "linear systems",
        "integrating factors"
      ]
    },
    "motivation": "<p>Undetermined coefficients is lovely when the forcing has a familiar shape. But life does not always hand us polynomials or clean sinusoids.</p><p>Variation of parameters keeps the two homogeneous solutions and lets their coefficients become functions. The price is integration; the reward is a method that works far more broadly.</p>",
    "definition": "<p>For the standard equation $y''+p(t)y'+q(t)y=g(t)$ with fundamental solutions $y_1,y_2$, seek $y_p=u_1(t)y_1(t)+u_2(t)y_2(t)$. Imposing $u_1'y_1+u_2'y_2=0$ prevents extra second-derivative clutter, and the ODE gives $u_1'y_1'+u_2'y_2'=g$.</p><p>Solving this $2\\times2$ system gives $u_1'=-y_2g/W$ and $u_2'=y_1g/W$, where $W=y_1y_2'-y_1'y_2$. Integrate $u_1',u_2'$ and build $y_p$.</p><p><b>Assumptions that matter:</b> the equation is in standard form with leading coefficient $1$; $p,q,g$ are continuous on the interval; and $W\\ne0$ there so the two homogeneous solutions stay independent.</p>",
    "worked": {
      "problem": "Use variation of parameters to find a particular solution of $y''+y=e^t$.",
      "skills": [
        "fundamental set",
        "Wronskian",
        "integrals"
      ],
      "strategy": "The forcing is easy, but we will use the general recipe to show how the machinery works.",
      "steps": [
        {
          "do": "Choose homogeneous solutions",
          "result": "$y_1=\\cos t,\\ y_2=\\sin t$",
          "why": "they solve $y''+y=0$"
        },
        {
          "do": "Compute the Wronskian",
          "result": "$W=\\cos^2t+\\sin^2t=1$",
          "why": "use $y_1y_2'-y_1'y_2$"
        },
        {
          "do": "Compute $u_1'$",
          "result": "$u_1'=-e^t\\sin t$",
          "why": "use $-y_2g/W$"
        },
        {
          "do": "Compute $u_2'$",
          "result": "$u_2'=e^t\\cos t$",
          "why": "use $y_1g/W$"
        },
        {
          "do": "Integrate $u_1'$",
          "result": "$u_1=\\dfrac{e^t(\\cos t-\\sin t)}{2}$",
          "why": "standard integral of $e^t\\sin t$"
        },
        {
          "do": "Integrate $u_2'$",
          "result": "$u_2=\\dfrac{e^t(\\sin t+\\cos t)}{2}$",
          "why": "standard integral of $e^t\\cos t$"
        },
        {
          "do": "Form $y_p$",
          "result": "$y_p=u_1\\cos t+u_2\\sin t=\\dfrac12e^t$",
          "why": "trigonometric terms simplify"
        }
      ],
      "verify": "Substitution gives $y_p''+y_p=\\frac12e^t+\\frac12e^t=e^t$.",
      "answer": "$y_p=\\dfrac12e^t$.",
      "connects": "The Wronskian converts the search for a function into two first-order coefficient equations."
    },
    "practice": [
      {
        "problem": "For $y''+y=\\sec t$, write $u_1'$ and $u_2'$ using $y_1=\\cos t$, $y_2=\\sin t$.",
        "steps": [
          {
            "do": "Compute $W$",
            "result": "$1$",
            "why": "same sine-cosine fundamental set"
          },
          {
            "do": "Use $u_1'=-y_2g/W$",
            "result": "$u_1'=-\\sin t\\sec t$",
            "why": "substitute $g=\\sec t$"
          },
          {
            "do": "Simplify",
            "result": "$u_1'=-\\tan t$",
            "why": "$\\sin t/\\cos t=\\tan t$"
          },
          {
            "do": "Use $u_2'=y_1g/W$",
            "result": "$u_2'=\\cos t\\sec t=1$",
            "why": "cosine cancels secant"
          }
        ],
        "answer": "$u_1'=-\\tan t$, $u_2'=1$."
      },
      {
        "problem": "For $y''-y=e^{2t}$ with $y_1=e^t$, $y_2=e^{-t}$, compute $u_1'$ and $u_2'$.",
        "steps": [
          {
            "do": "Compute $W$",
            "result": "$e^t(-e^{-t})-e^t e^{-t}=-2$",
            "why": "differentiate the two modes"
          },
          {
            "do": "Compute $u_1'$",
            "result": "$-e^{-t}e^{2t}/(-2)=\\dfrac12e^t$",
            "why": "use $-y_2g/W$"
          },
          {
            "do": "Compute $u_2'$",
            "result": "$e^t e^{2t}/(-2)=-\\dfrac12e^{3t}$",
            "why": "use $y_1g/W$"
          },
          {
            "do": "Integrate $u_1'$",
            "result": "$u_1=\\dfrac12e^t$",
            "why": "integral of $e^t$"
          },
          {
            "do": "Integrate $u_2'$",
            "result": "$u_2=-\\dfrac16e^{3t}$",
            "why": "divide by $3$"
          }
        ],
        "answer": "One particular solution is $u_1e^t+u_2e^{-t}=\\frac13e^{2t}$."
      },
      {
        "problem": "For standard form $y''+p(t)y'+q(t)y=g(t)$, explain why $W\\ne0$ matters.",
        "steps": [
          {
            "do": "Write the parameter system",
            "result": "$u_1'y_1+u_2'y_2=0$ and $u_1'y_1'+u_2'y_2'=g$",
            "why": "these equations determine $u_1',u_2'$"
          },
          {
            "do": "Identify its determinant",
            "result": "$W=y_1y_2'-y_1'y_2$",
            "why": "the coefficient matrix uses $y_1,y_2$ and derivatives"
          },
          {
            "do": "Require solvability",
            "result": "$W\\ne0$",
            "why": "a nonzero determinant gives a unique solution"
          },
          {
            "do": "Interpret",
            "result": "$y_1,y_2$ are independent",
            "why": "otherwise the recipe cannot span all responses"
          }
        ],
        "answer": "$W\\ne0$ makes the $2\\times2$ system for $u_1',u_2'$ solvable."
      },
      {
        "problem": "Find $y_p$ for $y''+4y=\\sin t$ by variation of parameters using $\\cos2t,\\sin2t$.",
        "steps": [
          {
            "do": "Compute $W$",
            "result": "$2$",
            "why": "Wronskian of $\\cos2t$ and $\\sin2t$"
          },
          {
            "do": "Write $u_1'$",
            "result": "$-\\dfrac12\\sin2t\\sin t$",
            "why": "use $-y_2g/W$"
          },
          {
            "do": "Write $u_2'$",
            "result": "$\\dfrac12\\cos2t\\sin t$",
            "why": "use $y_1g/W$"
          },
          {
            "do": "Use an easier equivalent trial check",
            "result": "$y_p=A\\sin t$",
            "why": "the same particular solution may be simplified"
          },
          {
            "do": "Substitute the trial",
            "result": "$(-A+4A)\\sin t=\\sin t$",
            "why": "compute $y''+4y$"
          },
          {
            "do": "Solve",
            "result": "$A=\\dfrac13$",
            "why": "match coefficients"
          }
        ],
        "answer": "$y_p=\\dfrac13\\sin t$."
      },
      {
        "problem": "A model has $y''+y=h(t)$ with unknown measured input $h$. Write the formal $y_p$.",
        "steps": [
          {
            "do": "Choose $y_1,y_2$",
            "result": "$\\cos t,\\sin t$",
            "why": "homogeneous solutions"
          },
          {
            "do": "Compute $W$",
            "result": "$1$",
            "why": "sine-cosine Wronskian"
          },
          {
            "do": "Write $u_1$",
            "result": "$u_1(t)=-\\int \\sin t\\,h(t)\\,dt$",
            "why": "integrate $u_1'$"
          },
          {
            "do": "Write $u_2$",
            "result": "$u_2(t)=\\int \\cos t\\,h(t)\\,dt$",
            "why": "integrate $u_2'$"
          },
          {
            "do": "Build the particular solution",
            "result": "$y_p=u_1\\cos t+u_2\\sin t$",
            "why": "combine variable coefficients"
          }
        ],
        "answer": "$y_p=-\\cos t\\int\\sin t\\,h(t)\\,dt+\\sin t\\int\\cos t\\,h(t)\\,dt$."
      }
    ],
    "applications": [
      {
        "title": "Arbitrary force records",
        "background": "Experimental mechanics often measures a force that is not a clean sine wave. Variation of parameters can use that measured input directly.",
        "numbers": "If $g(t)=2e^t$ in $y''+y=g$, the worked result doubles to $y_p=e^t$."
      },
      {
        "title": "Green's functions",
        "background": "Physics packages the same idea into an impulse response, then integrates against the forcing.",
        "numbers": "For $y''+y=g(t)$ with zero initial data, $y(t)=\\int_0^t\\sin(t-s)g(s)\\,ds$; if $g(s)=1$, then $y=1-\\cos t$."
      },
      {
        "title": "Adaptive control",
        "background": "Controllers sometimes see time-varying loads where a fixed trial function is unrealistic.",
        "numbers": "A load $g(t)=t$ in $y''+y=g$ has particular $y_p=t$, since $0+t=t$."
      },
      {
        "title": "Signal reconstruction",
        "background": "A linear filter's response to any input is built by integrating weighted sine and cosine modes.",
        "numbers": "For input $g(t)=3\\cos t$ in $y''+4y=g$, the amplitude is $3/(4-1)=1$, so the particular response is $\\cos t$."
      },
      {
        "title": "Neural differential equations",
        "background": "When a learned forcing term is inserted into a linearized ODE, numerical variation-of-parameters formulas describe the response.",
        "numbers": "If a learned input is constant $0.2$ in $y'+5y=0.2$, the steady particular value is $0.04$."
      },
      {
        "title": "Epidemic response models",
        "background": "Time-varying interventions act like forcing terms in linearized compartment models.",
        "numbers": "If perturbation mode solves $z'+0.4z=u(t)$ and $u=8$ for a short window, the steady target during that window is $8/0.4=20$."
      }
    ],
    "applicationsClose": "Whenever guessing becomes brittle, variation of parameters keeps the linear structure and lets integration carry the input.",
    "takeaways": [
      "Variation of parameters uses known homogeneous solutions and variable coefficients.",
      "The Wronskian is the determinant that solves for $u_1'$ and $u_2'$.",
      "The equation must be in standard form before applying the formula.",
      "The method works for many forcings that undetermined coefficients cannot guess."
    ]
  },
  "math-03-17": {
    "id": "math-03-17",
    "title": "Forced oscillations and resonance",
    "tagline": "A periodic push can be harmless, amplified, or resonant depending on how it matches the natural frequency.",
    "connections": {
      "buildsOn": [
        "Constant-coefficient homogeneous equations",
        "Method of undetermined coefficients",
        "sine and cosine"
      ],
      "leadsTo": [
        "Higher-order linear ODEs",
        "Systems of first-order ODEs",
        "Phase-plane analysis"
      ],
      "usedWith": [
        "frequency response",
        "damping",
        "particular solutions",
        "stability"
      ]
    },
    "motivation": "<p>You have probably pushed a swing. Push at random times and little happens; push in rhythm and the motion grows. That everyday feeling is resonance.</p><p>The math separates natural motion from forced motion. The denominator that looks like algebra is really a frequency comparison: far from the natural frequency, response is small; close to it, response can become large.</p>",
    "definition": "<p>A basic forced oscillator is $mx''+cx'+kx=F_0\\cos(\\omega t)$, where $m$ is mass, $c$ is damping, $k$ is stiffness, and $\\omega$ is forcing angular frequency. With no damping, the natural frequency is $\\omega_0=\\sqrt{k/m}$.</p><p>For $x''+\\omega_0^2x=F_0\\cos(\\omega t)$ and $\\omega\\ne\\omega_0$, a particular solution has amplitude $A=F_0/(\\omega_0^2-\\omega^2)$. If $\\omega=\\omega_0$ and damping is zero, the resonant particular solution grows like $t\\sin(\\omega_0t)$.</p><p><b>Assumptions that matter:</b> the model is linear; the forcing is sinusoidal; damping changes infinite resonance into a finite peak; and units of $\\omega$ are radians per unit time.</p>",
    "worked": {
      "problem": "Solve $x''+4x=3\\cos t$ with $x(0)=0$, $x'(0)=0$.",
      "skills": [
        "forced oscillator",
        "undetermined coefficients",
        "initial conditions"
      ],
      "strategy": "The forcing frequency $1$ is not the natural frequency $2$, so use a cosine particular solution.",
      "steps": [
        {
          "do": "Write the homogeneous solution",
          "result": "$x_h=C_1\\cos2t+C_2\\sin2t$",
          "why": "natural frequency is $2$"
        },
        {
          "do": "Choose a particular trial",
          "result": "$x_p=A\\cos t$",
          "why": "the forcing is $3\\cos t$"
        },
        {
          "do": "Compute $x_p''+4x_p$",
          "result": "$(-A+4A)\\cos t=3A\\cos t$",
          "why": "second derivative of cosine is negative cosine"
        },
        {
          "do": "Match forcing",
          "result": "$3A=3$",
          "why": "compare cosine coefficients"
        },
        {
          "do": "Solve",
          "result": "$A=1$",
          "why": "divide by $3$"
        },
        {
          "do": "Apply $x(0)=0$",
          "result": "$C_1+1=0$",
          "why": "cosines equal $1$ at zero"
        },
        {
          "do": "Apply $x'(0)=0$",
          "result": "$2C_2=0$",
          "why": "derivative of the particular term is zero at zero"
        },
        {
          "do": "Write the solution",
          "result": "$x=\\cos t-\\cos2t$",
          "why": "use $C_1=-1,C_2=0$"
        }
      ],
      "verify": "At $t=0$, $x=1-1=0$ and $x'=0$; substituting gives $x''+4x=3\\cos t$.",
      "answer": "$x(t)=\\cos t-\\cos2t$.",
      "connects": "The response contains the input frequency plus the natural frequency required by the initial rest condition."
    },
    "practice": [
      {
        "problem": "Find the steady amplitude for $x''+9x=5\\cos t$.",
        "steps": [
          {
            "do": "Identify $\\omega_0^2$",
            "result": "$9$",
            "why": "natural frequency squared"
          },
          {
            "do": "Identify $\\omega^2$",
            "result": "$1$",
            "why": "forcing frequency is $1$"
          },
          {
            "do": "Use the amplitude formula",
            "result": "$A=5/(9-1)$",
            "why": "nonresonant undamped oscillator"
          },
          {
            "do": "Simplify",
            "result": "$A=\\dfrac58$",
            "why": "divide by $8$"
          }
        ],
        "answer": "The steady particular solution is $x_p=\\frac58\\cos t$."
      },
      {
        "problem": "Find a resonant particular solution for $x''+4x=\\cos2t$.",
        "steps": [
          {
            "do": "Identify the natural frequency",
            "result": "$\\omega_0=2$",
            "why": "because $4=2^2$"
          },
          {
            "do": "Compare with forcing",
            "result": "$\\omega=2$",
            "why": "the forcing matches the natural frequency"
          },
          {
            "do": "Use the resonant form",
            "result": "$x_p=Bt\\sin2t$",
            "why": "multiply by $t$ to avoid overlap"
          },
          {
            "do": "Apply the known coefficient",
            "result": "$B=\\dfrac{1}{2\\omega_0}=\\dfrac14$",
            "why": "for unit forcing in $x''+\\omega_0^2x$"
          },
          {
            "do": "Write $x_p$",
            "result": "$x_p=\\dfrac14t\\sin2t$",
            "why": "resonant amplitude grows linearly"
          }
        ],
        "answer": "$x_p=\\frac14t\\sin2t$."
      },
      {
        "problem": "For $x''+0.4x'+4x=0$, estimate whether the natural motion decays.",
        "steps": [
          {
            "do": "Write the characteristic equation",
            "result": "$r^2+0.4r+4=0$",
            "why": "homogeneous oscillator"
          },
          {
            "do": "Read the real part",
            "result": "$-0.4/2=-0.2$",
            "why": "complex roots have real part $-c/2$"
          },
          {
            "do": "Interpret sign",
            "result": "negative",
            "why": "negative real part means decay"
          },
          {
            "do": "Estimate envelope at $t=10$",
            "result": "$e^{-0.2\\cdot10}=e^{-2}\\u0007pprox0.135$",
            "why": "the envelope follows the real part"
          }
        ],
        "answer": "It decays, with envelope about $13.5\\%$ of its initial size by $t=10$."
      },
      {
        "problem": "A forcing frequency changes from $1$ to $1.9$ in $x''+4x=\\cos(\\omega t)$. Compare amplitudes.",
        "steps": [
          {
            "do": "Compute amplitude at $\\omega=1$",
            "result": "$A_1=1/(4-1)=1/3$",
            "why": "use $A=1/(4-\\omega^2)$"
          },
          {
            "do": "Compute $\\omega^2$ for $1.9$",
            "result": "$1.9^2=3.61$",
            "why": "square the forcing frequency"
          },
          {
            "do": "Compute amplitude at $1.9$",
            "result": "$A_2=1/(4-3.61)=1/0.39$",
            "why": "closer to resonance"
          },
          {
            "do": "Simplify",
            "result": "$A_2\\u0007pprox2.56$",
            "why": "divide"
          },
          {
            "do": "Compare",
            "result": "$2.56/(1/3)\\u0007pprox7.7$",
            "why": "near-resonant response is much larger"
          }
        ],
        "answer": "The amplitude grows from $0.333$ to about $2.56$, roughly $7.7$ times larger."
      },
      {
        "problem": "A batch system has error response $e''+2e'+5e=\\cos2t$. Is the forced response bounded?",
        "steps": [
          {
            "do": "Check damping",
            "result": "$2e'$ term",
            "why": "positive damping is present"
          },
          {
            "do": "Find homogeneous real part",
            "result": "$-2/2=-1$",
            "why": "natural transients decay"
          },
          {
            "do": "Compare forcing",
            "result": "$\\cos2t$ is bounded",
            "why": "input stays between $-1$ and $1$"
          },
          {
            "do": "Use linear damped response",
            "result": "bounded steady sinusoid",
            "why": "damping prevents unbounded resonance"
          }
        ],
        "answer": "Yes. The transient decays like $e^{-t}$ and the steady response is bounded."
      }
    ],
    "applications": [
      {
        "title": "Bridge and building safety",
        "background": "Resonance became a central engineering concern after visible failures and oscillations in structures. Designers keep forcing frequencies away from natural frequencies.",
        "numbers": "If a bridge mode is $2.0$ Hz and pedestrian forcing is $1.9$ Hz, the gap is only $5\\%$, so damping must be checked carefully."
      },
      {
        "title": "MRI and spectroscopy",
        "background": "Resonance is useful when controlled: systems absorb strongly at characteristic frequencies.",
        "numbers": "A signal at $64$ MHz is selected while one at $63$ MHz is attenuated if the bandwidth is $0.5$ MHz."
      },
      {
        "title": "Audio equalizers",
        "background": "Filters boost or cut frequencies by exploiting oscillator-like frequency response.",
        "numbers": "A bandpass centered at $1000$ Hz with quality factor $Q=10$ has bandwidth $100$ Hz."
      },
      {
        "title": "Optimization momentum",
        "background": "Momentum can oscillate around minima like a forced damped system when gradients have periodic components.",
        "numbers": "An envelope $e^{-0.1t}$ leaves $e^{-1}=0.368$ after $10$ steps but $e^{-5}=0.0067$ after $50$ steps."
      },
      {
        "title": "Server autoscaling",
        "background": "Periodic traffic can excite delayed controllers. Damping corresponds to conservative gain or smoothing.",
        "numbers": "If demand oscillates every $10$ minutes, its angular frequency is $2\\pi/10\\u0007pprox0.628$ rad/min."
      },
      {
        "title": "Sensor vibration",
        "background": "Accelerometers are modeled as damped oscillators, and resonance determines usable bandwidth.",
        "numbers": "A sensor natural frequency of $200$ Hz should measure a $20$ Hz signal safely because the ratio is $0.1$."
      }
    ],
    "applicationsClose": "Forced oscillation teaches one reusable question: how close is the input frequency to the system's own modes, and how much damping protects it?",
    "takeaways": [
      "A forced oscillator is the sum of transient natural motion and steady forced motion.",
      "Without damping, matching the forcing frequency to the natural frequency causes resonance.",
      "Damping makes resonance finite and transients decay.",
      "Frequency response is algebraic evidence of physical amplification."
    ]
  },
  "math-03-18": {
    "id": "math-03-18",
    "title": "Higher-order linear ODEs",
    "tagline": "Higher-order equations use the same mode idea, just with more roots and more initial data.",
    "connections": {
      "buildsOn": [
        "Constant-coefficient homogeneous equations",
        "polynomials",
        "linear independence"
      ],
      "leadsTo": [
        "Systems of first-order ODEs",
        "The matrix exponential",
        "Laplace transforms"
      ],
      "usedWith": [
        "characteristic polynomials",
        "Wronskians",
        "companion systems",
        "superposition"
      ]
    },
    "motivation": "<p>Second-order equations already showed the pattern: each independent mode gets one constant. A third-order equation simply needs three constants; an $n$th-order equation needs $n$.</p><p>The bookkeeping grows, but the idea stays friendly. A constant-coefficient equation becomes a characteristic polynomial whose roots list the modes.</p>",
    "definition": "<p>An $n$th-order linear ODE has the form $a_n(t)y^{(n)}+\\cdots+a_1(t)y'+a_0(t)y=g(t)$. On an interval where $a_n\\ne0$ and coefficients are continuous, $n$ initial values determine a unique solution.</p><p>For constant-coefficient homogeneous equations, trying $e^{rt}$ gives the characteristic polynomial. A root $r$ of multiplicity $m$ contributes $e^{rt},te^{rt},\\ldots,t^{m-1}e^{rt}$. Complex conjugate roots are rewritten as real sine-cosine modes.</p><p><b>Assumptions that matter:</b> the leading coefficient must not vanish on the interval; roots are counted with multiplicity; and $n$ independent initial conditions are needed for an $n$th-order equation.</p>",
    "worked": {
      "problem": "Solve $y'''-6y''+11y'-6y=0$ with $y(0)=6$, $y'(0)=14$, $y''(0)=36$.",
      "skills": [
        "third-order characteristic equation",
        "initial conditions",
        "mode weights"
      ],
      "strategy": "Factor the cubic to get three modes, then solve three linear equations for the weights.",
      "steps": [
        {
          "do": "Write the characteristic equation",
          "result": "$r^3-6r^2+11r-6=0$",
          "why": "replace derivatives by powers of $r$"
        },
        {
          "do": "Factor the polynomial",
          "result": "$(r-1)(r-2)(r-3)=0$",
          "why": "these are the cubic roots"
        },
        {
          "do": "Write the general solution",
          "result": "$y=C_1e^t+C_2e^{2t}+C_3e^{3t}$",
          "why": "one exponential per distinct root"
        },
        {
          "do": "Apply $y(0)=6$",
          "result": "$C_1+C_2+C_3=6$",
          "why": "all exponentials equal $1$"
        },
        {
          "do": "Differentiate",
          "result": "$y'=C_1e^t+2C_2e^{2t}+3C_3e^{3t}$",
          "why": "first derivative condition"
        },
        {
          "do": "Apply $y'(0)=14$",
          "result": "$C_1+2C_2+3C_3=14$",
          "why": "substitute zero"
        },
        {
          "do": "Differentiate again",
          "result": "$y''=C_1e^t+4C_2e^{2t}+9C_3e^{3t}$",
          "why": "second derivative condition"
        },
        {
          "do": "Apply $y''(0)=36$",
          "result": "$C_1+4C_2+9C_3=36$",
          "why": "substitute zero"
        },
        {
          "do": "Solve the linear system",
          "result": "$C_1=1,\\ C_2=2,\\ C_3=3$",
          "why": "elimination determines the weights"
        }
      ],
      "verify": "The initial values become $1+2+3=6$, $1+4+9=14$, and $1+8+27=36$.",
      "answer": "$y=e^t+2e^{2t}+3e^{3t}$.",
      "connects": "A third-order equation has a three-dimensional space of homogeneous solutions."
    },
    "practice": [
      {
        "problem": "Solve $y'''-y''=0$.",
        "steps": [
          {
            "do": "Write the characteristic equation",
            "result": "$r^3-r^2=0$",
            "why": "constant coefficients"
          },
          {
            "do": "Factor",
            "result": "$r^2(r-1)=0$",
            "why": "extract common factor"
          },
          {
            "do": "Read roots",
            "result": "$0,0,1$",
            "why": "zero has multiplicity two"
          },
          {
            "do": "Write modes",
            "result": "$1,t,e^t$",
            "why": "repeated zero root gives $1$ and $t$"
          },
          {
            "do": "Combine",
            "result": "$y=C_1+C_2t+C_3e^t$",
            "why": "linear combination of modes"
          }
        ],
        "answer": "$y=C_1+C_2t+C_3e^t$."
      },
      {
        "problem": "Write the real solution form for roots $-1,-1,2i,-2i$.",
        "steps": [
          {
            "do": "Handle repeated real root",
            "result": "$(C_1+C_2t)e^{-t}$",
            "why": "multiplicity two at $-1$"
          },
          {
            "do": "Handle complex pair",
            "result": "$C_3\\cos2t+C_4\\sin2t$",
            "why": "real part is zero, imaginary part is $2$"
          },
          {
            "do": "Combine modes",
            "result": "$(C_1+C_2t)e^{-t}+C_3\\cos2t+C_4\\sin2t$",
            "why": "superposition for homogeneous equations"
          }
        ],
        "answer": "$y=(C_1+C_2t)e^{-t}+C_3\\cos2t+C_4\\sin2t$."
      },
      {
        "problem": "How many initial conditions are needed for $y^{(5)}+y'=0$?",
        "steps": [
          {
            "do": "Identify order",
            "result": "$5$",
            "why": "highest derivative is fifth"
          },
          {
            "do": "Use the existence-uniqueness rule",
            "result": "$5$ initial values",
            "why": "an $n$th-order linear ODE needs $n$ conditions"
          },
          {
            "do": "List a typical set",
            "result": "$y(0),y'(0),y''(0),y'''(0),y^{(4)}(0)$",
            "why": "values through order four"
          },
          {
            "do": "Interpret",
            "result": "one unique solution",
            "why": "the five constants are fixed"
          }
        ],
        "answer": "Five initial conditions are needed."
      },
      {
        "problem": "Find a particular trial for $y'''-y'=t^2$.",
        "steps": [
          {
            "do": "Inspect the forcing",
            "result": "$t^2$",
            "why": "polynomial of degree two"
          },
          {
            "do": "Notice homogeneous zero root",
            "result": "$r^3-r=r(r-1)(r+1)$",
            "why": "constant mode overlaps polynomial constants"
          },
          {
            "do": "Choose polynomial one degree higher",
            "result": "$y_p=t(At^2+Bt+C)$",
            "why": "multiply by $t$ for the zero-root overlap"
          },
          {
            "do": "Expand if desired",
            "result": "$y_p=At^3+Bt^2+Ct$",
            "why": "coefficients can now be matched"
          }
        ],
        "answer": "Use $y_p=At^3+Bt^2+Ct$."
      },
      {
        "problem": "A fourth-order filter has roots $-1,-3,-5,-7$. Which mode dominates late time?",
        "steps": [
          {
            "do": "List decay rates",
            "result": "$e^{-t},e^{-3t},e^{-5t},e^{-7t}$",
            "why": "one mode per root"
          },
          {
            "do": "Compare real parts",
            "result": "$-1$ is closest to zero",
            "why": "it decays slowest"
          },
          {
            "do": "Estimate at $t=2$",
            "result": "$e^{-2}=0.135$ and $e^{-6}=0.00248$",
            "why": "the faster modes are already tiny"
          },
          {
            "do": "Identify the dominant mode",
            "result": "$e^{-t}$",
            "why": "late behavior follows the slowest decay"
          }
        ],
        "answer": "The $e^{-t}$ mode dominates late time."
      }
    ],
    "applications": [
      {
        "title": "Beam bending",
        "background": "Euler-Bernoulli beam theory uses fourth-order ODEs because curvature and load are linked through multiple derivatives.",
        "numbers": "A cantilever deflection often scales like $L^4$; doubling length from $2$m to $4$m multiplies deflection by $16$."
      },
      {
        "title": "High-order filters",
        "background": "Analog filter design uses polynomials whose roots are poles. More order means sharper frequency separation.",
        "numbers": "A fourth-order rolloff drops about $80$ dB per decade, compared with $20$ dB for first order."
      },
      {
        "title": "Compartment chains",
        "background": "Biological or queueing chains with several stages can collapse to higher-order equations.",
        "numbers": "Four identical decay stages with rate $2$ have repeated root $-2$ and modes up to $t^3e^{-2t}$."
      },
      {
        "title": "Spline theory",
        "background": "Cubic splines minimize bending energy and are connected to fourth derivatives.",
        "numbers": "A cubic segment has four coefficients, so four boundary constraints determine it."
      },
      {
        "title": "Control plants",
        "background": "Aircraft and robotics models often have fourth or higher order because position, velocity, actuator, and sensor dynamics interact.",
        "numbers": "Roots $-0.5,-2,-10,-20$ imply the $-0.5$ pole sets a settling time around $4/0.5=8$s."
      },
      {
        "title": "Sequence models",
        "background": "Linear recurrence filters are discrete cousins of higher-order ODEs.",
        "numbers": "A recurrence with roots $0.9$ and $0.5$ keeps $0.9^{20}=0.122$ but $0.5^{20}\\u0007pprox0.000001$ after $20$ steps."
      }
    ],
    "applicationsClose": "Higher order adds more modes, but the slowest and most resonant modes still tell the practical story.",
    "takeaways": [
      "An $n$th-order linear ODE needs $n$ independent initial conditions.",
      "Constant coefficients lead to characteristic polynomials of degree $n$.",
      "Repeated roots add powers of $t$ multiplying the exponential.",
      "Late-time behavior is often controlled by the root with largest real part."
    ]
  },
  "math-03-19": {
    "id": "math-03-19",
    "title": "Systems of first-order ODEs",
    "tagline": "A system tracks several changing quantities at once by letting each derivative depend on the whole state.",
    "connections": {
      "buildsOn": [
        "vectors",
        "first-order ODEs",
        "linear algebra"
      ],
      "leadsTo": [
        "The matrix exponential",
        "Eigenvalue methods for systems",
        "Phase-plane analysis"
      ],
      "usedWith": [
        "state variables",
        "matrices",
        "equilibria",
        "linearization"
      ]
    },
    "motivation": "<p>Many processes cannot be described by one number. A pendulum needs angle and angular velocity; an epidemic needs susceptible and infected groups; an optimizer may store parameters and momentum.</p><p>A first-order system puts all those quantities into a state vector. The derivative vector tells how the entire state moves next.</p>",
    "definition": "<p>A first-order system has the form $\\mathbf{x}'=\\mathbf{f}(t,\\mathbf{x})$, where $\\mathbf{x}(t)$ is a vector of state variables. A linear time-invariant system is $\\mathbf{x}'=A\\mathbf{x}+\\mathbf{b}(t)$, where $A$ is a constant matrix.</p><p>A higher-order scalar ODE can be rewritten as a first-order system by naming derivatives as new variables. For example, if $y''+3y'+2y=0$, set $x_1=y$ and $x_2=y'$, so $x_1'=x_2$ and $x_2'=-2x_1-3x_2$.</p><p><b>Assumptions that matter:</b> the state variables must contain enough information to predict the next derivative; linear systems use matrix multiplication; and initial data specify the whole vector $\\mathbf{x}(t_0)$.</p>",
    "worked": {
      "problem": "Rewrite $y''+3y'+2y=0$ as a first-order system and solve for $y(0)=3$, $y'(0)=0$.",
      "skills": [
        "state variables",
        "systems",
        "mode solution"
      ],
      "strategy": "Turn position and velocity into a vector, then use the known scalar solution.",
      "steps": [
        {
          "do": "Define the state",
          "result": "$x_1=y,\\ x_2=y'$",
          "why": "store position and velocity"
        },
        {
          "do": "Differentiate $x_1$",
          "result": "$x_1'=x_2$",
          "why": "because $x_2$ is $y'$"
        },
        {
          "do": "Solve the ODE for $y''$",
          "result": "$y''=-3y'-2y$",
          "why": "isolate the highest derivative"
        },
        {
          "do": "Write $x_2'$",
          "result": "$x_2'=-2x_1-3x_2$",
          "why": "substitute state variables"
        },
        {
          "do": "Write matrix form",
          "result": "$\\mathbf{x}'=\\begin{bmatrix}0&1\\-2&-3\\end{bmatrix}\\mathbf{x}$",
          "why": "collect coefficients"
        },
        {
          "do": "Use scalar roots",
          "result": "$r=-1,-2$",
          "why": "from $r^2+3r+2=0$"
        },
        {
          "do": "Fit initial data",
          "result": "$y=3e^{-t}-0e^{-2t}$ is not enough",
          "why": "check velocity"
        },
        {
          "do": "Solve constants",
          "result": "$y=6e^{-t}-3e^{-2t}$",
          "why": "$C_1+C_2=3$, $-C_1-2C_2=0$"
        }
      ],
      "verify": "At $t=0$, $6-3=3$ and $-6+6=0$.",
      "answer": "System: $x_1'=x_2$, $x_2'=-2x_1-3x_2$; $y(t)=6e^{-t}-3e^{-2t}$.",
      "connects": "The system form turns one second-order rule into two coupled first-order rules."
    },
    "practice": [
      {
        "problem": "Rewrite $y''+4y=0$ as a first-order system.",
        "steps": [
          {
            "do": "Define variables",
            "result": "$x_1=y,\\ x_2=y'$",
            "why": "state contains position and velocity"
          },
          {
            "do": "Write $x_1'$",
            "result": "$x_1'=x_2$",
            "why": "definition of $x_2$"
          },
          {
            "do": "Isolate $y''$",
            "result": "$y''=-4y$",
            "why": "from the ODE"
          },
          {
            "do": "Write $x_2'$",
            "result": "$x_2'=-4x_1$",
            "why": "substitute state variables"
          },
          {
            "do": "Write matrix form",
            "result": "$\\mathbf{x}'=\\begin{bmatrix}0&1\\-4&0\\end{bmatrix}\\mathbf{x}$",
            "why": "collect coefficients"
          }
        ],
        "answer": "$x_1'=x_2$, $x_2'=-4x_1$."
      },
      {
        "problem": "For $\\mathbf{x}'=\\begin{bmatrix}1&2\\0&-1\\end{bmatrix}\\mathbf{x}$ and $\\mathbf{x}(0)=(3,4)$, compute $\\mathbf{x}'(0)$.",
        "steps": [
          {
            "do": "Write the multiplication",
            "result": "$\\mathbf{x}'(0)=A\\begin{bmatrix}3\\4\\end{bmatrix}$",
            "why": "derivative equals matrix times state"
          },
          {
            "do": "Compute first component",
            "result": "$1\\cdot3+2\\cdot4=11$",
            "why": "first row dot state"
          },
          {
            "do": "Compute second component",
            "result": "$0\\cdot3-1\\cdot4=-4$",
            "why": "second row dot state"
          },
          {
            "do": "Assemble vector",
            "result": "$\\begin{bmatrix}11\\-4\\end{bmatrix}$",
            "why": "combine components"
          }
        ],
        "answer": "$\\mathbf{x}'(0)=(11,-4)$."
      },
      {
        "problem": "Find the equilibrium of $x'=2x-y$, $y'=x+3y-10$.",
        "steps": [
          {
            "do": "Set derivatives to zero",
            "result": "$2x-y=0$, $x+3y-10=0$",
            "why": "equilibrium means no motion"
          },
          {
            "do": "Solve the first equation",
            "result": "$y=2x$",
            "why": "isolate $y$"
          },
          {
            "do": "Substitute into the second",
            "result": "$x+6x-10=0$",
            "why": "replace $y$"
          },
          {
            "do": "Solve for $x$",
            "result": "$x=10/7$",
            "why": "divide by $7$"
          },
          {
            "do": "Find $y$",
            "result": "$y=20/7$",
            "why": "use $y=2x$"
          }
        ],
        "answer": "Equilibrium $(10/7,20/7)$."
      },
      {
        "problem": "Convert $y''=u(t)-5y'-6y$ into state-space form.",
        "steps": [
          {
            "do": "Define state variables",
            "result": "$x_1=y,\\ x_2=y'$",
            "why": "standard conversion"
          },
          {
            "do": "Write first equation",
            "result": "$x_1'=x_2$",
            "why": "definition"
          },
          {
            "do": "Write second equation",
            "result": "$x_2'=u(t)-6x_1-5x_2$",
            "why": "substitute $y,x_2$"
          },
          {
            "do": "Separate matrix and input",
            "result": "$\\mathbf{x}'=\\begin{bmatrix}0&1\\-6&-5\\end{bmatrix}\\mathbf{x}+\\begin{bmatrix}0\\1\\end{bmatrix}u(t)$",
            "why": "linear state-space form"
          }
        ],
        "answer": "$\\mathbf{x}'=A\\mathbf{x}+Bu$ with $A=\\begin{bmatrix}0&1\\-6&-5\\end{bmatrix}$ and $B=\\begin{bmatrix}0\\1\\end{bmatrix}$."
      },
      {
        "problem": "A two-state model has $p'=-0.2p+0.1q$, $q'=0.2p-0.1q$. Show total mass is conserved.",
        "steps": [
          {
            "do": "Define total mass",
            "result": "$s=p+q$",
            "why": "sum the two states"
          },
          {
            "do": "Differentiate",
            "result": "$s'=p'+q'$",
            "why": "derivative of a sum"
          },
          {
            "do": "Substitute equations",
            "result": "$s'=(-0.2p+0.1q)+(0.2p-0.1q)$",
            "why": "use the system"
          },
          {
            "do": "Combine terms",
            "result": "$s'=0$",
            "why": "all transfers cancel"
          },
          {
            "do": "Interpret",
            "result": "$s$ is constant",
            "why": "zero derivative means conserved total"
          }
        ],
        "answer": "$p+q$ stays constant."
      }
    ],
    "applications": [
      {
        "title": "Epidemic compartments",
        "background": "SIR models track susceptible, infected, and recovered populations as a coupled state.",
        "numbers": "If $S'= -0.002SI$ with $S=900$, $I=10$, then $S'=-18$ people per day."
      },
      {
        "title": "Predator-prey dynamics",
        "background": "Lotka-Volterra systems were early examples of nonlinear coupled ODEs in ecology.",
        "numbers": "For $x'=0.5x-0.02xy$ with $x=40,y=10$, prey growth is $20-8=12$ per month."
      },
      {
        "title": "Momentum optimization",
        "background": "Algorithms with momentum keep both parameter and velocity, making them first-order systems in a larger state.",
        "numbers": "If $v'= -0.1v-2x$ with $x=3,v=4$, then $v'=-0.4-6=-6.4$."
      },
      {
        "title": "Chemical reactions",
        "background": "Mass-action kinetics turns reaction networks into systems of ODEs.",
        "numbers": "For $A\\to B$ at rate $0.3A$ and $A=50$, $A'=-15$, $B'=15$ molecules per second."
      },
      {
        "title": "Robotics state space",
        "background": "Controllers represent position, velocity, and sometimes actuator states as one vector.",
        "numbers": "A state $(x,v)=(2,-1)$ with $x'=v$ has immediate position derivative $-1$ m/s."
      },
      {
        "title": "Recommendation dynamics",
        "background": "User interest and item exposure can be modeled as coupled states in simplified simulations.",
        "numbers": "If interest $i'=0.4c-0.1i$ and clicks $c=5,i=8$, then $i'=2-0.8=1.2$ units/day."
      }
    ],
    "applicationsClose": "Systems are the natural language of interacting quantities: collect the state, compute the derivative, and follow the vector field.",
    "takeaways": [
      "A first-order system evolves a state vector, not just one scalar.",
      "Higher-order ODEs can be rewritten as first-order systems by adding derivative variables.",
      "Equilibria occur where every component derivative is zero.",
      "Matrix form makes linear systems ready for linear algebra tools."
    ]
  },
  "math-03-20": {
    "id": "math-03-20",
    "title": "The matrix exponential",
    "tagline": "The matrix exponential is the flow map that advances a linear system through time.",
    "connections": {
      "buildsOn": [
        "Systems of first-order ODEs",
        "matrix multiplication",
        "power series"
      ],
      "leadsTo": [
        "Eigenvalue methods for systems",
        "Phase-plane analysis",
        "linear stability"
      ],
      "usedWith": [
        "eigenvectors",
        "diagonalization",
        "state transition matrices",
        "linear systems"
      ]
    },
    "motivation": "<p>For the scalar equation $x'=ax$, the solution is $x(t)=e^{at}x(0)$. A linear system $\\mathbf{x}'=A\\mathbf{x}$ asks for the same idea when $a$ is a matrix.</p><p>The answer is $e^{At}$: a matrix that moves every initial state to its state at time $t$.</p>",
    "definition": "<p>The <b>matrix exponential</b> is defined by the power series $$e^{At}=I+At+\\dfrac{(At)^2}{2!}+\\dfrac{(At)^3}{3!}+\\cdots.$$ For $\\mathbf{x}'=A\\mathbf{x}$, the solution is $\\mathbf{x}(t)=e^{At}\\mathbf{x}(0)$.</p><p>The derivative works term by term: differentiating the series gives $Ae^{At}$, so $\\frac{d}{dt}(e^{At}\\mathbf{x}_0)=Ae^{At}\\mathbf{x}_0=A\\mathbf{x}(t)$. If $A$ is diagonal, exponentiate each diagonal entry.</p><p><b>Assumptions that matter:</b> $A$ is a constant square matrix; the series converges for all finite matrices; and $e^{(A+B)t}=e^{At}e^{Bt}$ only when $A$ and $B$ commute.</p>",
    "worked": {
      "problem": "Solve $\\mathbf{x}'=\\begin{bmatrix}2&0\\0&-1\\end{bmatrix}\\mathbf{x}$ with $\\mathbf{x}(0)=(3,4)$.",
      "skills": [
        "diagonal matrices",
        "state transition",
        "matrix exponential"
      ],
      "strategy": "A diagonal matrix decouples the system, so exponentiate each diagonal entry.",
      "steps": [
        {
          "do": "Name the matrix",
          "result": "$A=\\begin{bmatrix}2&0\\0&-1\\end{bmatrix}$",
          "why": "constant linear system"
        },
        {
          "do": "Exponentiate the diagonal",
          "result": "$e^{At}=\\begin{bmatrix}e^{2t}&0\\0&e^{-t}\\end{bmatrix}$",
          "why": "diagonal entries act like scalar rates"
        },
        {
          "do": "Multiply by the initial state",
          "result": "$\\mathbf{x}(t)=\\begin{bmatrix}e^{2t}&0\\0&e^{-t}\\end{bmatrix}\\begin{bmatrix}3\\4\\end{bmatrix}$",
          "why": "solution formula"
        },
        {
          "do": "Compute components",
          "result": "$\\mathbf{x}(t)=\\begin{bmatrix}3e^{2t}\\4e^{-t}\\end{bmatrix}$",
          "why": "matrix-vector multiplication"
        },
        {
          "do": "Check at $t=0$",
          "result": "$\\mathbf{x}(0)=\\begin{bmatrix}3\\4\\end{bmatrix}$",
          "why": "exponentials equal $1$"
        }
      ],
      "verify": "The derivative is $(6e^{2t},-4e^{-t})$, which equals $A(3e^{2t},4e^{-t})$.",
      "answer": "$\\mathbf{x}(t)=(3e^{2t},4e^{-t})$.",
      "connects": "The matrix exponential is the system's time-advance operator."
    },
    "practice": [
      {
        "problem": "Compute $e^{At}$ for $A=\\begin{bmatrix}-3&0\\0&5\\end{bmatrix}$.",
        "steps": [
          {
            "do": "Check the form",
            "result": "diagonal",
            "why": "off-diagonal entries are zero"
          },
          {
            "do": "Exponentiate first diagonal entry",
            "result": "$e^{-3t}$",
            "why": "scalar exponential"
          },
          {
            "do": "Exponentiate second diagonal entry",
            "result": "$e^{5t}$",
            "why": "scalar exponential"
          },
          {
            "do": "Assemble",
            "result": "$\\begin{bmatrix}e^{-3t}&0\\0&e^{5t}\\end{bmatrix}$",
            "why": "keep zeros off diagonal"
          }
        ],
        "answer": "$e^{At}=\\begin{bmatrix}e^{-3t}&0\\0&e^{5t}\\end{bmatrix}$."
      },
      {
        "problem": "For $A=\\begin{bmatrix}0&0\\0&0\\end{bmatrix}$, compute $e^{At}$.",
        "steps": [
          {
            "do": "Use the series",
            "result": "$e^{At}=I+At+\\cdots$",
            "why": "definition"
          },
          {
            "do": "Notice $A=0$",
            "result": "$At=0$",
            "why": "all powers after the first vanish"
          },
          {
            "do": "Keep the identity term",
            "result": "$I$",
            "why": "the zeroth power remains"
          },
          {
            "do": "Write the matrix",
            "result": "$\\begin{bmatrix}1&0\\0&1\\end{bmatrix}$",
            "why": "two-dimensional identity"
          }
        ],
        "answer": "$e^{At}=I$."
      },
      {
        "problem": "If $A^2=0$, simplify $e^{At}$.",
        "steps": [
          {
            "do": "Write the series",
            "result": "$I+At+\\dfrac{A^2t^2}{2!}+\\cdots$",
            "why": "definition"
          },
          {
            "do": "Use $A^2=0$",
            "result": "$A^2,A^3,\\ldots$ vanish",
            "why": "nilpotent matrix"
          },
          {
            "do": "Keep remaining terms",
            "result": "$I+At$",
            "why": "only first two terms survive"
          },
          {
            "do": "Interpret",
            "result": "linear-in-time flow",
            "why": "nilpotent coupling creates polynomial growth"
          }
        ],
        "answer": "$e^{At}=I+At$."
      },
      {
        "problem": "Solve $x'=x+y$, $y'=y$ with $x(0)=0,y(0)=2$.",
        "steps": [
          {
            "do": "Solve the second equation",
            "result": "$y=2e^t$",
            "why": "it is decoupled"
          },
          {
            "do": "Substitute into the first",
            "result": "$x'=x+2e^t$",
            "why": "now one scalar equation"
          },
          {
            "do": "Try resonant form",
            "result": "$x_p=2te^t$",
            "why": "forcing matches homogeneous $e^t$"
          },
          {
            "do": "Apply $x(0)=0$",
            "result": "$C+0=0$",
            "why": "homogeneous part is $Ce^t$"
          },
          {
            "do": "Write solution",
            "result": "$x=2te^t,\\ y=2e^t$",
            "why": "combine components"
          }
        ],
        "answer": "$(x,y)=(2te^t,2e^t)$."
      },
      {
        "problem": "A hidden state follows $h'= -0.7h$. Express the state-transition factor over $\\Delta t=3$.",
        "steps": [
          {
            "do": "Use scalar matrix exponential",
            "result": "$e^{-0.7\\Delta t}$",
            "why": "one-dimensional case"
          },
          {
            "do": "Substitute $\\Delta t=3$",
            "result": "$e^{-2.1}$",
            "why": "multiply rate by time"
          },
          {
            "do": "Approximate",
            "result": "$0.122$",
            "why": "evaluate the exponential"
          },
          {
            "do": "Interpret",
            "result": "about $12.2\\%$ remains",
            "why": "decay over the time step"
          }
        ],
        "answer": "The transition factor is $e^{-2.1}\\u0007pprox0.122$."
      }
    ],
    "applications": [
      {
        "title": "State-space control",
        "background": "Control theory uses $e^{At}$ to predict a plant between measurements.",
        "numbers": "If a mode has rate $-4$, then over $0.5$s it multiplies by $e^{-2}\\u0007pprox0.135$."
      },
      {
        "title": "Continuous-time Markov chains",
        "background": "Transition probabilities for finite Markov jump processes are matrix exponentials of rate matrices.",
        "numbers": "A two-state leaving rate $0.2$ over $5$ units gives stay factor $e^{-1}\\u0007pprox0.368$."
      },
      {
        "title": "Neural ODE solvers",
        "background": "Linear layers inside continuous-depth models use matrix flows as local building blocks.",
        "numbers": "A stable eigenvalue $-0.1$ over depth $20$ gives factor $e^{-2}\\u0007pprox0.135$."
      },
      {
        "title": "Computer graphics",
        "background": "Rotations can be generated by exponentiating skew-symmetric matrices.",
        "numbers": "Angular speed $\\pi/2$ rad/s for $2$s gives angle $\\pi$, a $180$ degree rotation."
      },
      {
        "title": "Kalman filters",
        "background": "Continuous dynamics are discretized with a state-transition matrix before sensor updates.",
        "numbers": "For velocity damping $-0.5$, a $0.1$s step uses factor $e^{-0.05}\\u0007pprox0.951$."
      },
      {
        "title": "Epidemic linearization",
        "background": "Early outbreak growth is often approximated by a matrix exponential around a disease-free state.",
        "numbers": "Growth rate $0.08$/day over $30$ days multiplies infections by $e^{2.4}\\u0007pprox11.0$."
      }
    ],
    "applicationsClose": "The matrix exponential is the bridge from a differential law now to a state transition later.",
    "takeaways": [
      "For $\\mathbf{x}'=A\\mathbf{x}$, the solution is $e^{At}\\mathbf{x}(0)$.",
      "The power series definition works for every square matrix.",
      "Diagonal matrices exponentiate entry by entry.",
      "Matrix exponentials are central state-transition operators."
    ]
  },
  "math-03-21": {
    "id": "math-03-21",
    "title": "Eigenvalue methods for systems",
    "tagline": "Eigenvectors find directions where a coupled system becomes a scalar exponential.",
    "connections": {
      "buildsOn": [
        "The matrix exponential",
        "eigenvalues and eigenvectors",
        "linear systems"
      ],
      "leadsTo": [
        "Phase-plane analysis",
        "Equilibria and stability",
        "Linearization"
      ],
      "usedWith": [
        "diagonalization",
        "modes",
        "stability",
        "matrix exponential"
      ]
    },
    "motivation": "<p>A coupled system can feel tangled because each variable affects the others. Eigenvectors reveal special directions where the tangle disappears.</p><p>Along an eigenvector, the matrix only stretches by an eigenvalue. That turns a vector ODE into the familiar scalar equation $z'=\\lambda z$.</p>",
    "definition": "<p>For $\\mathbf{x}'=A\\mathbf{x}$, if $A\\mathbf{v}=\\lambda\\mathbf{v}$, then $\\mathbf{x}(t)=Ce^{\\lambda t}\\mathbf{v}$ is a solution. A basis of eigenvectors gives the general solution as a sum of modes.</p><p>If $A=PDP^{-1}$ with diagonal $D$, then $e^{At}=Pe^{Dt}P^{-1}$. Complex eigenvalues give spiraling sine-cosine behavior, and repeated eigenvalues may require generalized eigenvectors.</p><p><b>Assumptions that matter:</b> the matrix is constant; enough independent eigenvectors make the clean diagonal formula possible; and real systems with complex eigenvalues are rewritten as real-valued combinations.</p>",
    "worked": {
      "problem": "Solve $\\mathbf{x}'=\\begin{bmatrix}2&1\\1&2\\end{bmatrix}\\mathbf{x}$ with $\\mathbf{x}(0)=(4,2)$.",
      "skills": [
        "eigenvalues",
        "eigenvectors",
        "mode expansion"
      ],
      "strategy": "Find the eigen-directions, decompose the initial vector, and attach exponentials.",
      "steps": [
        {
          "do": "Find one eigenvector",
          "result": "$\\mathbf{v}_1=(1,1)$",
          "why": "both components add the same way"
        },
        {
          "do": "Compute its eigenvalue",
          "result": "$A\\mathbf{v}_1=3\\mathbf{v}_1$",
          "why": "row sums are $3$"
        },
        {
          "do": "Find another eigenvector",
          "result": "$\\mathbf{v}_2=(1,-1)$",
          "why": "opposite components cancel"
        },
        {
          "do": "Compute its eigenvalue",
          "result": "$A\\mathbf{v}_2=\\mathbf{v}_2$",
          "why": "stretch factor is $1$"
        },
        {
          "do": "Write the general solution",
          "result": "$\\mathbf{x}=C_1e^{3t}\\mathbf{v}_1+C_2e^t\\mathbf{v}_2$",
          "why": "one mode per eigenpair"
        },
        {
          "do": "Decompose the initial state",
          "result": "$C_1(1,1)+C_2(1,-1)=(4,2)$",
          "why": "match $t=0$"
        },
        {
          "do": "Solve constants",
          "result": "$C_1=3,\\ C_2=1$",
          "why": "add and subtract component equations"
        }
      ],
      "verify": "At $t=0$, $3(1,1)+1(1,-1)=(4,2)$.",
      "answer": "$\\mathbf{x}(t)=3e^{3t}(1,1)+e^t(1,-1)$.",
      "connects": "Eigenvectors are coordinate axes chosen by the dynamics themselves."
    },
    "practice": [
      {
        "problem": "For $A=\\begin{bmatrix}4&0\\0&-2\\end{bmatrix}$, solve with $\\mathbf{x}(0)=(1,5)$.",
        "steps": [
          {
            "do": "Read eigenvalues",
            "result": "$4,-2$",
            "why": "diagonal entries"
          },
          {
            "do": "Read eigenvectors",
            "result": "$(1,0),(0,1)$",
            "why": "coordinate axes"
          },
          {
            "do": "Attach exponentials",
            "result": "$x_1=e^{4t}$, $x_2=5e^{-2t}$",
            "why": "scale each component"
          },
          {
            "do": "Write vector",
            "result": "$(e^{4t},5e^{-2t})$",
            "why": "combine components"
          }
        ],
        "answer": "$\\mathbf{x}(t)=(e^{4t},5e^{-2t})$."
      },
      {
        "problem": "Find eigenvalues of $A=\\begin{bmatrix}0&1\\-2&-3\\end{bmatrix}$.",
        "steps": [
          {
            "do": "Form $\\det(A-\\lambda I)$",
            "result": "$\\det\\begin{bmatrix}-\\lambda&1\\-2&-3-\\lambda\\end{bmatrix}$",
            "why": "characteristic determinant"
          },
          {
            "do": "Compute determinant",
            "result": "$\\lambda(3+\\lambda)+2$",
            "why": "multiply diagonal terms and subtract"
          },
          {
            "do": "Simplify",
            "result": "$\\lambda^2+3\\lambda+2$",
            "why": "collect terms"
          },
          {
            "do": "Factor",
            "result": "$(\\lambda+1)(\\lambda+2)$",
            "why": "find roots"
          },
          {
            "do": "Read eigenvalues",
            "result": "$-1,-2$",
            "why": "set factors to zero"
          }
        ],
        "answer": "Eigenvalues are $-1$ and $-2$."
      },
      {
        "problem": "Classify behavior for eigenvalues $-0.5\\pm3i$.",
        "steps": [
          {
            "do": "Read real part",
            "result": "$-0.5$",
            "why": "controls envelope"
          },
          {
            "do": "Read imaginary part",
            "result": "$3$",
            "why": "controls angular frequency"
          },
          {
            "do": "Interpret real part",
            "result": "decay",
            "why": "negative means stable amplitude"
          },
          {
            "do": "Interpret imaginary part",
            "result": "oscillation",
            "why": "nonzero imaginary part rotates"
          },
          {
            "do": "Combine",
            "result": "stable spiral",
            "why": "decaying oscillation"
          }
        ],
        "answer": "A stable spiral with angular frequency $3$ and envelope $e^{-0.5t}$."
      },
      {
        "problem": "Decompose $(6,0)$ in the basis $(1,1),(1,-1)$.",
        "steps": [
          {
            "do": "Set up",
            "result": "$C_1(1,1)+C_2(1,-1)=(6,0)$",
            "why": "linear combination"
          },
          {
            "do": "Write component equations",
            "result": "$C_1+C_2=6$, $C_1-C_2=0$",
            "why": "match coordinates"
          },
          {
            "do": "Add equations",
            "result": "$2C_1=6$",
            "why": "eliminate $C_2$"
          },
          {
            "do": "Solve $C_1$",
            "result": "$C_1=3$",
            "why": "divide by $2$"
          },
          {
            "do": "Find $C_2$",
            "result": "$C_2=3$",
            "why": "use $C_1+C_2=6$"
          }
        ],
        "answer": "$(6,0)=3(1,1)+3(1,-1)$."
      },
      {
        "problem": "A two-mode representation has eigenvalues $0.2$ and $-1.5$. Which mode dominates at large $t$?",
        "steps": [
          {
            "do": "Compare real parts",
            "result": "$0.2>-1.5$",
            "why": "larger real part grows or decays slowest"
          },
          {
            "do": "Evaluate growth mode at $t=10$",
            "result": "$e^{2}\\u0007pprox7.39$",
            "why": "positive eigenvalue grows"
          },
          {
            "do": "Evaluate decay mode at $t=10$",
            "result": "$e^{-15}\\u0007pprox0.00000031$",
            "why": "negative eigenvalue vanishes"
          },
          {
            "do": "Identify dominant mode",
            "result": "$\\lambda=0.2$",
            "why": "it overwhelms the decaying mode"
          }
        ],
        "answer": "The $0.2$ eigenvalue mode dominates and makes the system unstable."
      }
    ],
    "applications": [
      {
        "title": "Principal axes of dynamics",
        "background": "Eigenvectors are dynamic coordinates, not just algebraic objects. They reveal independent modes in coupled systems.",
        "numbers": "For eigenvalues $-1$ and $-4$, after $t=2$ the factors are $0.135$ and $0.000335$."
      },
      {
        "title": "Google PageRank intuition",
        "background": "Eigenvector centrality uses a vector unchanged in direction by a link matrix. The steady vector is an eigenvector.",
        "numbers": "A damping factor $0.85$ shrinks nonleading modes roughly by $0.85^{10}\\u0007pprox0.197$ after $10$ iterations."
      },
      {
        "title": "PCA and linear flows",
        "background": "PCA finds data directions; ODE eigenvectors find motion directions. Both choose useful coordinates.",
        "numbers": "Variance eigenvalues $9$ and $1$ mean the first principal direction has $9$ times the variance."
      },
      {
        "title": "Coupled thermal zones",
        "background": "Two rooms exchanging heat have common and difference modes.",
        "numbers": "A difference mode $e^{-0.3t}$ drops to $e^{-3}\\u0007pprox0.050$ after $10$ minutes."
      },
      {
        "title": "Recurrent neural networks",
        "background": "Linearized RNN behavior is governed by eigenvalues of the recurrence or continuous generator.",
        "numbers": "A discrete eigenvalue $1.02$ grows by $1.02^{100}\\u0007pprox7.24$, a gradient explosion warning."
      },
      {
        "title": "Vibration modes",
        "background": "Structures decompose into eigenmodes that vibrate independently for small motion.",
        "numbers": "A mode at $12$ Hz completes $12$ cycles per second, while a $3$ Hz mode completes $3$."
      }
    ],
    "applicationsClose": "Eigenvalue methods turn coupled motion into modal stories: each direction has its own exponential clock.",
    "takeaways": [
      "An eigenpair gives a system solution $e^{\\lambda t}\\mathbf{v}$.",
      "A basis of eigenvectors lets you decompose any initial state into modes.",
      "Eigenvalue real parts determine growth or decay; imaginary parts determine rotation.",
      "Diagonalization is the matrix exponential made transparent."
    ]
  },
  "math-03-22": {
    "id": "math-03-22",
    "title": "Phase-plane analysis",
    "tagline": "The phase plane lets you see a two-dimensional system as a field of arrows and trajectories.",
    "connections": {
      "buildsOn": [
        "Systems of first-order ODEs",
        "eigenvalue methods",
        "vector fields"
      ],
      "leadsTo": [
        "Equilibria and stability",
        "Linearization",
        "nonlinear dynamics"
      ],
      "usedWith": [
        "nullclines",
        "trajectories",
        "equilibria",
        "stability classification"
      ]
    },
    "motivation": "<p>A formula for $x(t)$ and $y(t)$ is wonderful, but sometimes a picture tells the story first. The phase plane puts the state $(x,y)$ on the axes and draws the velocity vector at each point.</p><p>Instead of asking where the object is in physical space, we ask where the system is in state space and where it will move next.</p>",
    "definition": "<p>For a two-dimensional autonomous system $x'=f(x,y)$, $y'=g(x,y)$, the <b>phase plane</b> is the $(x,y)$-plane equipped with arrows $(f(x,y),g(x,y))$. A trajectory is a curve tangent to those arrows.</p><p>The $x$-nullcline is where $x'=0$; the $y$-nullcline is where $y'=0$. Intersections of nullclines are equilibria. For linear systems, eigenvalues classify nearby trajectory shapes.</p><p><b>Assumptions that matter:</b> autonomous systems have no explicit time dependence; arrows describe direction, not fixed step length; and uniqueness means trajectories cannot cross where the vector field is well behaved.</p>",
    "worked": {
      "problem": "Analyze the phase-plane ingredients of $x'=y$, $y'=-2x-3y$.",
      "skills": [
        "nullclines",
        "equilibrium",
        "linear classification"
      ],
      "strategy": "Find where motion components vanish, then use eigenvalues to classify the origin.",
      "steps": [
        {
          "do": "Find the $x$-nullcline",
          "result": "$y=0$",
          "why": "set $x'=y$ equal to zero"
        },
        {
          "do": "Find the $y$-nullcline",
          "result": "$-2x-3y=0$",
          "why": "set $y'$ equal to zero"
        },
        {
          "do": "Simplify the second nullcline",
          "result": "$y=-\\dfrac23x$",
          "why": "solve for $y$"
        },
        {
          "do": "Find their intersection",
          "result": "$(0,0)$",
          "why": "both nullclines meet at the equilibrium"
        },
        {
          "do": "Write the matrix",
          "result": "$A=\\begin{bmatrix}0&1\\-2&-3\\end{bmatrix}$",
          "why": "linear system"
        },
        {
          "do": "Find eigenvalues",
          "result": "$\\lambda=-1,-2$",
          "why": "characteristic polynomial $\\lambda^2+3\\lambda+2$"
        },
        {
          "do": "Classify",
          "result": "stable node",
          "why": "two negative real eigenvalues"
        }
      ],
      "verify": "At $(1,0)$ the arrow is $(0,-2)$, pointing downward toward the stable node, consistent with attraction.",
      "answer": "Nullclines $y=0$ and $y=-2x/3$ meet at a stable node $(0,0)$.",
      "connects": "The phase plane turns algebraic signs and eigenvalues into visible motion."
    },
    "practice": [
      {
        "problem": "Find nullclines for $x'=x-y$, $y'=x+y$.",
        "steps": [
          {
            "do": "Set $x'=0$",
            "result": "$x-y=0$",
            "why": "x-nullcline"
          },
          {
            "do": "Solve",
            "result": "$y=x$",
            "why": "line where horizontal velocity vanishes"
          },
          {
            "do": "Set $y'=0$",
            "result": "$x+y=0$",
            "why": "y-nullcline"
          },
          {
            "do": "Solve",
            "result": "$y=-x$",
            "why": "line where vertical velocity vanishes"
          },
          {
            "do": "Intersect",
            "result": "$(0,0)$",
            "why": "both equations hold only at the origin"
          }
        ],
        "answer": "Nullclines are $y=x$ and $y=-x$; equilibrium is $(0,0)$."
      },
      {
        "problem": "At point $(2,1)$ for $x'=y$, $y'=-x$, find the arrow direction.",
        "steps": [
          {
            "do": "Compute $x'$",
            "result": "$x'=1$",
            "why": "use $y=1$"
          },
          {
            "do": "Compute $y'$",
            "result": "$y'=-2$",
            "why": "use $x=2$"
          },
          {
            "do": "Write vector",
            "result": "$(1,-2)$",
            "why": "combine components"
          },
          {
            "do": "Interpret",
            "result": "right and downward",
            "why": "positive first component, negative second component"
          }
        ],
        "answer": "The arrow is $(1,-2)$, pointing right and downward."
      },
      {
        "problem": "Classify a linear origin with eigenvalues $2$ and $-3$.",
        "steps": [
          {
            "do": "Read signs",
            "result": "one positive and one negative",
            "why": "compare eigenvalues"
          },
          {
            "do": "Identify stable direction",
            "result": "$\\lambda=-3$",
            "why": "decays toward origin"
          },
          {
            "do": "Identify unstable direction",
            "result": "$\\lambda=2$",
            "why": "grows away from origin"
          },
          {
            "do": "Classify",
            "result": "saddle",
            "why": "mixed signs create approach in one direction and escape in another"
          }
        ],
        "answer": "The origin is a saddle."
      },
      {
        "problem": "For $x'=x(1-x)$, $y'=-2y$, describe arrows on the line $x=1$.",
        "steps": [
          {
            "do": "Compute $x'$ on $x=1$",
            "result": "$1(1-1)=0$",
            "why": "horizontal component vanishes"
          },
          {
            "do": "Compute $y'$",
            "result": "$-2y$",
            "why": "vertical component remains"
          },
          {
            "do": "If $y>0$",
            "result": "$y'<0$",
            "why": "arrow points downward"
          },
          {
            "do": "If $y<0$",
            "result": "$y'>0$",
            "why": "arrow points upward"
          },
          {
            "do": "Interpret",
            "result": "motion along the line toward $y=0$",
            "why": "vertical decay"
          }
        ],
        "answer": "On $x=1$, arrows are vertical and point toward $(1,0)$."
      },
      {
        "problem": "A phase portrait has arrows $(0.5,-0.2)$ at a model state. Estimate the next state after $\\Delta t=0.1$ by Euler's method.",
        "steps": [
          {
            "do": "Scale the derivative",
            "result": "$0.1(0.5,-0.2)$",
            "why": "Euler increment is step size times velocity"
          },
          {
            "do": "Compute increment",
            "result": "$(0.05,-0.02)$",
            "why": "multiply each component"
          },
          {
            "do": "Add to current state $(3,4)$",
            "result": "$(3.05,3.98)$",
            "why": "advance one small step"
          },
          {
            "do": "Interpret",
            "result": "slightly right and slightly down",
            "why": "matches the arrow signs"
          }
        ],
        "answer": "From $(3,4)$ the Euler estimate is $(3.05,3.98)$."
      }
    ],
    "applications": [
      {
        "title": "Predator-prey portraits",
        "background": "Ecologists use phase planes to see cycles without solving formulas exactly.",
        "numbers": "At prey $40$, predator $10$ with $x'=0.5x-0.02xy$, $x'=20-8=12$ prey/month."
      },
      {
        "title": "Pendulum state space",
        "background": "A pendulum is clearer in angle-velocity space than in time plots alone.",
        "numbers": "At angle $0.1$ rad and velocity $0$, the small-angle acceleration is about $-9.8\\cdot0.1=-0.98$ rad/s$^2$ for unit length."
      },
      {
        "title": "Optimization trajectories",
        "background": "Two-parameter gradient descent traces a path in a parameter phase plane.",
        "numbers": "For loss gradient $(4,-2)$ and learning rate $0.1$, the update direction is $(-0.4,0.2)$."
      },
      {
        "title": "Epidemic thresholds",
        "background": "Nullclines show whether infections rise or fall at different susceptible levels.",
        "numbers": "If $I'=0.3SI/1000-0.1I$ and $S=200$, then coefficient is $0.06-0.1=-0.04$, so infections decline."
      },
      {
        "title": "Robotics controllers",
        "background": "Phase portraits reveal overshoot and convergence for position-velocity controllers.",
        "numbers": "At $(x,v)=(1,-0.2)$ with $v'=-4x-2v$, acceleration is $-4+0.4=-3.6$."
      },
      {
        "title": "Queue-control systems",
        "background": "Backlog and service rate form a two-state picture for autoscaling policies.",
        "numbers": "If backlog derivative is arrivals minus service $120-100=20$ jobs/min, arrows point toward larger backlog."
      }
    ],
    "applicationsClose": "The phase plane turns a system into a map of possible futures, one arrow and one trajectory at a time.",
    "takeaways": [
      "A phase plane plots state variables, not time against one variable.",
      "Nullclines show where one component of motion is zero.",
      "Equilibria are intersections of nullclines.",
      "Eigenvalues classify linear phase portraits near equilibria."
    ]
  },
  "math-03-23": {
    "id": "math-03-23",
    "title": "Equilibria and stability",
    "tagline": "Equilibria are states that do not move; stability asks what nearby states do next.",
    "connections": {
      "buildsOn": [
        "Systems of first-order ODEs",
        "Phase-plane analysis",
        "derivatives"
      ],
      "leadsTo": [
        "Linearization",
        "Lyapunov methods",
        "bifurcations"
      ],
      "usedWith": [
        "fixed points",
        "nullclines",
        "eigenvalues",
        "phase portraits"
      ]
    },
    "motivation": "<p>A ball resting in a bowl and a pencil balanced on its tip are both still, but only one is forgiving. Equilibrium alone is not enough; we need stability.</p><p>Stability asks whether small perturbations fade, persist, or grow. That question is central in models, algorithms, and controlled systems.</p>",
    "definition": "<p>An <b>equilibrium</b> of $\\mathbf{x}'=\\mathbf{f}(\\mathbf{x})$ is a state $\\mathbf{x}^*$ where $\\mathbf{f}(\\mathbf{x}^*)=\\mathbf{0}$. It is stable if nearby solutions remain nearby, asymptotically stable if they also approach it, and unstable if some nearby solutions move away.</p><p>For one-dimensional $x'=f(x)$, signs of $f$ on either side often decide stability. If arrows point toward the equilibrium from both sides, it is stable; if they point away, it is unstable.</p><p><b>Assumptions that matter:</b> the system is autonomous; the vector field is regular enough for uniqueness; and local stability describes nearby behavior, not necessarily the whole state space.</p>",
    "worked": {
      "problem": "Find and classify equilibria of $y'=y(1-y/10)$.",
      "skills": [
        "equilibria",
        "sign analysis",
        "stability"
      ],
      "strategy": "Set the derivative to zero, then read arrow directions on each interval.",
      "steps": [
        {
          "do": "Set the right side to zero",
          "result": "$y(1-y/10)=0$",
          "why": "equilibrium means $y'=0$"
        },
        {
          "do": "Solve first factor",
          "result": "$y=0$",
          "why": "zero population equilibrium"
        },
        {
          "do": "Solve second factor",
          "result": "$1-y/10=0$",
          "why": "carrying-capacity factor"
        },
        {
          "do": "Find second equilibrium",
          "result": "$y=10$",
          "why": "multiply by $10$"
        },
        {
          "do": "Test between equilibria",
          "result": "at $y=5$, $y'=5(0.5)>0$",
          "why": "arrows point right/upward"
        },
        {
          "do": "Test above $10$",
          "result": "at $y=12$, $y'=12(-0.2)<0$",
          "why": "arrows point downward"
        },
        {
          "do": "Classify",
          "result": "$0$ unstable, $10$ stable",
          "why": "arrows move away from $0$ and toward $10$"
        }
      ],
      "verify": "Starting at $y=9$ increases, and starting at $y=11$ decreases, both moving toward $10$.",
      "answer": "Equilibria are $0$ unstable and $10$ asymptotically stable.",
      "connects": "Equilibrium classification is a story about nearby arrows."
    },
    "practice": [
      {
        "problem": "Classify equilibria of $x'=x(x-2)$.",
        "steps": [
          {
            "do": "Set $x'=0$",
            "result": "$x(x-2)=0$",
            "why": "equilibria"
          },
          {
            "do": "Solve",
            "result": "$x=0,2$",
            "why": "factor roots"
          },
          {
            "do": "Test $x=-1$",
            "result": "$(-1)(-3)>0$",
            "why": "arrows point right left of $0$"
          },
          {
            "do": "Test $x=1$",
            "result": "$1(-1)<0$",
            "why": "arrows point left between roots"
          },
          {
            "do": "Test $x=3$",
            "result": "$3(1)>0$",
            "why": "arrows point right above $2$"
          },
          {
            "do": "Classify",
            "result": "$0$ stable, $2$ unstable",
            "why": "arrows point toward $0$ and away from $2$"
          }
        ],
        "answer": "$0$ is stable; $2$ is unstable."
      },
      {
        "problem": "Find equilibria of $x'=3-x$.",
        "steps": [
          {
            "do": "Set derivative to zero",
            "result": "$3-x=0$",
            "why": "equilibrium condition"
          },
          {
            "do": "Solve",
            "result": "$x=3$",
            "why": "add $x$ to both sides"
          },
          {
            "do": "Test below",
            "result": "at $x=2$, $x'=1>0$",
            "why": "moves upward"
          },
          {
            "do": "Test above",
            "result": "at $x=4$, $x'=-1<0$",
            "why": "moves downward"
          },
          {
            "do": "Classify",
            "result": "stable",
            "why": "arrows point toward $3$"
          }
        ],
        "answer": "$x=3$ is asymptotically stable."
      },
      {
        "problem": "For $\\mathbf{x}'=A\\mathbf{x}$ with eigenvalues $-2$ and $-5$, classify the origin.",
        "steps": [
          {
            "do": "Read real parts",
            "result": "$-2,-5$",
            "why": "both are negative"
          },
          {
            "do": "Infer decay",
            "result": "$e^{-2t}$ and $e^{-5t}$",
            "why": "both modes vanish"
          },
          {
            "do": "Classify shape",
            "result": "stable node",
            "why": "real negative eigenvalues"
          },
          {
            "do": "State stability",
            "result": "asymptotically stable",
            "why": "all nearby states approach the origin"
          }
        ],
        "answer": "The origin is an asymptotically stable node."
      },
      {
        "problem": "For eigenvalues $0$ and $-1$, why is linear stability inconclusive?",
        "steps": [
          {
            "do": "Read one mode",
            "result": "$e^{-t}$",
            "why": "decays"
          },
          {
            "do": "Read zero mode",
            "result": "$e^{0t}=1$",
            "why": "does not decay in the linear model"
          },
          {
            "do": "Notice missing sign",
            "result": "no attraction or repulsion along zero mode",
            "why": "linear term is neutral"
          },
          {
            "do": "Conclude",
            "result": "need nonlinear terms",
            "why": "higher-order behavior decides"
          }
        ],
        "answer": "A zero eigenvalue makes the linear test inconclusive in that direction."
      },
      {
        "problem": "A recommender feedback score follows $s'=s(0.4-s)$. Find the stable score.",
        "steps": [
          {
            "do": "Set derivative to zero",
            "result": "$s(0.4-s)=0$",
            "why": "equilibria"
          },
          {
            "do": "Solve",
            "result": "$s=0,0.4$",
            "why": "factor roots"
          },
          {
            "do": "Test $s=0.2$",
            "result": "$0.2(0.2)>0$",
            "why": "score increases"
          },
          {
            "do": "Test $s=0.5$",
            "result": "$0.5(-0.1)<0$",
            "why": "score decreases"
          },
          {
            "do": "Classify",
            "result": "$0.4$ stable",
            "why": "arrows point toward $0.4$"
          }
        ],
        "answer": "The stable equilibrium is $s=0.4$."
      }
    ],
    "applications": [
      {
        "title": "Population carrying capacity",
        "background": "Logistic growth models limited resources through a stable equilibrium.",
        "numbers": "With $K=1000$, $P=900$ grows if $P'=0.2P(1-P/1000)=18$ per year."
      },
      {
        "title": "Chemical equilibrium",
        "background": "Reaction rates balance at equilibrium, and stability tells whether perturbations are corrected.",
        "numbers": "If $A'=10-0.5A$, equilibrium is $A=20$ because production equals removal."
      },
      {
        "title": "Training fixed points",
        "background": "An optimizer stops at a point where the gradient is zero; stability decides whether iterates stay there.",
        "numbers": "For $w'=-2(w-3)$, $w=3$ is stable and error halves roughly every $\\ln2/2\\u0007pprox0.347$ time units."
      },
      {
        "title": "Control setpoints",
        "background": "Thermostats and cruise control create stable equilibria around desired values.",
        "numbers": "If $T'=0.1(70-T)$, at $T=65$ the temperature rises at $0.5$ degrees/min."
      },
      {
        "title": "Epidemic thresholds",
        "background": "Disease-free equilibria are stable only when transmission is weak enough.",
        "numbers": "If early $I'=(0.8-1.0)I=-0.2I$, infections decay by $e^{-2}\\u0007pprox0.135$ after $10$ days."
      },
      {
        "title": "Recommendation feedback loops",
        "background": "Platform dynamics can have stable or unstable engagement equilibria depending on feedback strength.",
        "numbers": "If $s'=1.2s-s^2$, equilibria are $0$ and $1.2$; the positive one attracts scores below and above it."
      }
    ],
    "applicationsClose": "Equilibrium is stillness; stability is the promise, or warning, about what happens after a small nudge.",
    "takeaways": [
      "Equilibria satisfy $\\mathbf{f}(\\mathbf{x}^*)=0$.",
      "Stable means nearby states remain nearby; asymptotically stable means they approach.",
      "One-dimensional arrow signs often classify equilibria.",
      "For linear systems, eigenvalue real parts classify local stability."
    ]
  },
  "math-03-24": {
    "id": "math-03-24",
    "title": "Linearization",
    "tagline": "Linearization replaces a nonlinear system near an equilibrium by its best linear approximation.",
    "connections": {
      "buildsOn": [
        "Equilibria and stability",
        "Jacobians",
        "multivariable derivatives"
      ],
      "leadsTo": [
        "nonlinear stability",
        "bifurcations",
        "control design"
      ],
      "usedWith": [
        "Taylor approximation",
        "Jacobian matrices",
        "eigenvalue methods",
        "phase planes"
      ]
    },
    "motivation": "<p>Nonlinear systems can be hard, but near one equilibrium they often have a local personality. Linearization listens to the first derivative information and builds the closest linear system.</p><p>This is like zooming in on a curve until it looks like a line, except now the line is a matrix and the curve is a vector field.</p>",
    "definition": "<p>For $\\mathbf{x}'=\\mathbf{f}(\\mathbf{x})$ with equilibrium $\\mathbf{x}^*$, write $\\mathbf{u}=\\mathbf{x}-\\mathbf{x}^*$. The linearization is $\\mathbf{u}'=J(\\mathbf{x}^*)\\mathbf{u}$, where $J$ is the Jacobian matrix of first partial derivatives.</p><p>This comes from the first-order Taylor expansion $\\mathbf{f}(\\mathbf{x}^*+\\mathbf{u})=\\mathbf{f}(\\mathbf{x}^*)+J(\\mathbf{x}^*)\\mathbf{u}+\\text{higher-order terms}$. Since $\\mathbf{f}(\\mathbf{x}^*)=0$, the Jacobian gives the leading local motion.</p><p><b>Assumptions that matter:</b> the vector field is differentiable near the equilibrium; nonzero real-part eigenvalues give reliable local classification; and zero or purely imaginary eigenvalues require more care.</p>",
    "worked": {
      "problem": "Linearize $x'=x(2-x-y)$, $y'=y(1+x-2y)$ at $(1,1)$.",
      "skills": [
        "Jacobian",
        "equilibrium",
        "eigenvalue classification"
      ],
      "strategy": "Compute the Jacobian, evaluate it at the equilibrium, then classify the local linear system.",
      "steps": [
        {
          "do": "Compute $f_x$",
          "result": "$2-2x-y$",
          "why": "differentiate $x(2-x-y)$ with respect to $x$"
        },
        {
          "do": "Compute $f_y$",
          "result": "$-x$",
          "why": "differentiate with respect to $y$"
        },
        {
          "do": "Compute $g_x$",
          "result": "$y$",
          "why": "differentiate $y(1+x-2y)$ with respect to $x$"
        },
        {
          "do": "Compute $g_y$",
          "result": "$1+x-4y$",
          "why": "differentiate with respect to $y$"
        },
        {
          "do": "Evaluate at $(1,1)$",
          "result": "$J=\\begin{bmatrix}-1&-1\\1&-2\\end{bmatrix}$",
          "why": "substitute $x=1,y=1$"
        },
        {
          "do": "Compute trace and determinant",
          "result": "$\\tau=-3,\\ \\Delta=3$",
          "why": "trace is sum diagonal, determinant is $2+1$"
        },
        {
          "do": "Compute discriminant",
          "result": "$\\tau^2-4\\Delta=9-12=-3$",
          "why": "negative gives complex eigenvalues"
        },
        {
          "do": "Classify",
          "result": "stable spiral",
          "why": "negative trace gives negative real part"
        }
      ],
      "verify": "At $(1,1)$ both right sides are zero, and the Jacobian eigenvalues have real part $-3/2$, so nearby motion spirals inward.",
      "answer": "Linearization: $\\mathbf{u}'=\\begin{bmatrix}-1&-1\\1&-2\\end{bmatrix}\\mathbf{u}$; local stable spiral.",
      "connects": "The Jacobian is the local linear system hidden inside the nonlinear one."
    },
    "practice": [
      {
        "problem": "Find the Jacobian of $f=x^2+y$, $g=xy$.",
        "steps": [
          {
            "do": "Compute $f_x$",
            "result": "$2x$",
            "why": "partial derivative with respect to $x$"
          },
          {
            "do": "Compute $f_y$",
            "result": "$1$",
            "why": "partial derivative with respect to $y$"
          },
          {
            "do": "Compute $g_x$",
            "result": "$y$",
            "why": "treat $y$ as constant"
          },
          {
            "do": "Compute $g_y$",
            "result": "$x$",
            "why": "treat $x$ as constant"
          },
          {
            "do": "Assemble",
            "result": "$J=\\begin{bmatrix}2x&1\\y&x\\end{bmatrix}$",
            "why": "place partials by rows"
          }
        ],
        "answer": "$J=\\begin{bmatrix}2x&1\\y&x\\end{bmatrix}$."
      },
      {
        "problem": "Linearize $x'=x-x^2$ at $x^*=1$.",
        "steps": [
          {
            "do": "Check equilibrium",
            "result": "$1-1^2=0$",
            "why": "right side vanishes"
          },
          {
            "do": "Differentiate",
            "result": "$f'(x)=1-2x$",
            "why": "one-dimensional Jacobian"
          },
          {
            "do": "Evaluate",
            "result": "$f'(1)=-1$",
            "why": "substitute equilibrium"
          },
          {
            "do": "Write perturbation equation",
            "result": "$u'=-u$",
            "why": "linearization in $u=x-1$"
          },
          {
            "do": "Classify",
            "result": "stable",
            "why": "negative coefficient decays"
          }
        ],
        "answer": "$u'=-u$, so $x=1$ is locally stable."
      },
      {
        "problem": "For $J=\\begin{bmatrix}0&1\\-5&-2\\end{bmatrix}$, classify by trace and determinant.",
        "steps": [
          {
            "do": "Compute trace",
            "result": "$\\tau=-2$",
            "why": "sum diagonal"
          },
          {
            "do": "Compute determinant",
            "result": "$\\Delta=5$",
            "why": "product diagonal minus off diagonal product"
          },
          {
            "do": "Compute discriminant",
            "result": "$\\tau^2-4\\Delta=4-20=-16$",
            "why": "negative"
          },
          {
            "do": "Read real part",
            "result": "$\\tau/2=-1$",
            "why": "complex pair real part"
          },
          {
            "do": "Classify",
            "result": "stable spiral",
            "why": "negative real part and complex eigenvalues"
          }
        ],
        "answer": "Stable spiral."
      },
      {
        "problem": "Why does $x'=x^2$ at $x^*=0$ need nonlinear analysis?",
        "steps": [
          {
            "do": "Check equilibrium",
            "result": "$0^2=0$",
            "why": "right side vanishes"
          },
          {
            "do": "Differentiate",
            "result": "$f'(x)=2x$",
            "why": "linear coefficient"
          },
          {
            "do": "Evaluate",
            "result": "$f'(0)=0$",
            "why": "linearization is zero"
          },
          {
            "do": "Look at nonlinear sign",
            "result": "$x^2>0$ for $x\\ne0$",
            "why": "motion points right on both sides"
          },
          {
            "do": "Conclude",
            "result": "semistable, not decided by linearization",
            "why": "higher-order term matters"
          }
        ],
        "answer": "The linearization is inconclusive because the Jacobian eigenvalue is zero."
      },
      {
        "problem": "A neural ODE near a fixed point has Jacobian eigenvalues $-0.3$ and $0.1$. What happens locally?",
        "steps": [
          {
            "do": "Read signs",
            "result": "one negative, one positive",
            "why": "compare real parts"
          },
          {
            "do": "Identify stable direction",
            "result": "$-0.3$",
            "why": "decays"
          },
          {
            "do": "Identify unstable direction",
            "result": "$0.1$",
            "why": "grows"
          },
          {
            "do": "Classify",
            "result": "saddle",
            "why": "mixed signs"
          },
          {
            "do": "Estimate growth after $20$",
            "result": "$e^{0.1\\cdot20}=e^2\\u0007pprox7.39$",
            "why": "unstable mode amplifies"
          }
        ],
        "answer": "The fixed point is locally unstable, with a saddle direction that grows by about $7.39$ over $20$ units."
      }
    ],
    "applications": [
      {
        "title": "Nonlinear control",
        "background": "Controllers are often designed from a linearized plant around an operating point.",
        "numbers": "If a Jacobian pole is $-4$, local settling time is about $4/4=1$s."
      },
      {
        "title": "Epidemic thresholds",
        "background": "Linearizing disease dynamics around the disease-free state gives early growth or decay.",
        "numbers": "If the Jacobian growth rate is $0.06$/day, cases multiply by $e^{1.8}\\u0007pprox6.05$ in $30$ days."
      },
      {
        "title": "Neural network training",
        "background": "Loss surfaces are nonlinear, but local Hessian or Jacobian information predicts small-step behavior.",
        "numbers": "A curvature $20$ suggests gradient descent step size below about $2/20=0.1$ for a simple quadratic."
      },
      {
        "title": "Power grids",
        "background": "Grid stability is checked by linearizing around a synchronized operating point.",
        "numbers": "An oscillatory eigenvalue $-0.2\\pm6i$ has decay time $1/0.2=5$s and frequency $6/(2\\pi)\\u0007pprox0.955$ Hz."
      },
      {
        "title": "Robotics balance",
        "background": "Balancing robots are nonlinear, yet small-angle linearization makes feedback design possible.",
        "numbers": "For small $\\theta=0.05$, $\\sin\\theta\\u0007pprox0.05$ with error below $0.00003$."
      },
      {
        "title": "Recommendation feedback",
        "background": "Local linearization can reveal whether engagement feedback damps or amplifies perturbations.",
        "numbers": "A local multiplier rate $0.02$/hour grows by $e^{0.48}\\u0007pprox1.62$ over a day."
      }
    ],
    "applicationsClose": "Linearization is not the whole nonlinear story, but it is often the first honest local map.",
    "takeaways": [
      "Linearization uses the Jacobian at an equilibrium.",
      "It comes from the first-order Taylor expansion of the vector field.",
      "Eigenvalues of the Jacobian classify many local equilibria.",
      "Zero or purely imaginary eigenvalues require nonlinear follow-up."
    ]
  },
  "math-03-25": {
    "id": "math-03-25",
    "title": "Series solutions",
    "tagline": "Series solutions build an unknown function one coefficient at a time.",
    "connections": {
      "buildsOn": [
        "power series",
        "derivatives",
        "recurrence relations"
      ],
      "leadsTo": [
        "Special functions",
        "Laplace transforms",
        "numerical methods"
      ],
      "usedWith": [
        "Taylor series",
        "ordinary points",
        "recurrences",
        "initial values"
      ]
    },
    "motivation": "<p>Some differential equations refuse to give elementary closed forms. A power series lets us still solve locally by writing the function as a long polynomial with unknown coefficients.</p><p>The ODE then becomes a coefficient-matching machine. Each coefficient teaches the next one.</p>",
    "definition": "<p>A <b>series solution</b> assumes $y=\\sum_{n=0}^{\\infty}a_n(x-x_0)^n$ near a point $x_0$. Differentiate term by term, substitute into the ODE, align powers, and match coefficients.</p><p>At an ordinary point, where the coefficient of the highest derivative is nonzero and analytic after standardizing the equation, this process produces a convergent power series solution. Initial conditions usually set the first coefficients.</p><p><b>Assumptions that matter:</b> term-by-term differentiation is justified within the radius of convergence; the expansion point should be ordinary unless using Frobenius methods; and recurrence relations must be indexed carefully.</p>",
    "worked": {
      "problem": "Use a power series to solve $y'=y$, $y(0)=1$.",
      "skills": [
        "power series",
        "coefficient matching",
        "recurrence"
      ],
      "strategy": "Assume a series, differentiate it, and make matching powers equal.",
      "steps": [
        {
          "do": "Assume a series",
          "result": "$y=\\sum_{n=0}^{\\infty}a_nx^n$",
          "why": "expand about $0$"
        },
        {
          "do": "Differentiate",
          "result": "$y'=\\sum_{n=1}^{\\infty}na_nx^{n-1}$",
          "why": "term-by-term derivative"
        },
        {
          "do": "Reindex derivative",
          "result": "$y'=\\sum_{n=0}^{\\infty}(n+1)a_{n+1}x^n$",
          "why": "align powers with $y$"
        },
        {
          "do": "Match coefficients",
          "result": "$(n+1)a_{n+1}=a_n$",
          "why": "because $y'=y$"
        },
        {
          "do": "Solve recurrence",
          "result": "$a_{n+1}=\\dfrac{a_n}{n+1}$",
          "why": "divide by $n+1$"
        },
        {
          "do": "Use $y(0)=1$",
          "result": "$a_0=1$",
          "why": "constant term equals initial value"
        },
        {
          "do": "List coefficients",
          "result": "$a_n=\\dfrac1{n!}$",
          "why": "repeat the recurrence"
        }
      ],
      "verify": "The series $1+x+x^2/2!+\\cdots$ differentiates to itself and equals $1$ at $x=0$.",
      "answer": "$y=e^x=\\sum_{n=0}^{\\infty}\\dfrac{x^n}{n!}$.",
      "connects": "A familiar function emerges from the coefficient recurrence."
    },
    "practice": [
      {
        "problem": "Find the first four nonzero terms for $y'=2y$, $y(0)=3$.",
        "steps": [
          {
            "do": "Use recurrence",
            "result": "$(n+1)a_{n+1}=2a_n$",
            "why": "from $y'=2y$"
          },
          {
            "do": "Set initial coefficient",
            "result": "$a_0=3$",
            "why": "from $y(0)=3$"
          },
          {
            "do": "Compute $a_1$",
            "result": "$a_1=2a_0=6$",
            "why": "use $n=0$"
          },
          {
            "do": "Compute $a_2$",
            "result": "$a_2=2a_1/2=6$",
            "why": "use $n=1$"
          },
          {
            "do": "Compute $a_3$",
            "result": "$a_3=2a_2/3=4$",
            "why": "use $n=2$"
          }
        ],
        "answer": "$y=3+6x+6x^2+4x^3+\\cdots$."
      },
      {
        "problem": "For $y''+y=0$, $y(0)=1$, $y'(0)=0$, find terms through $x^4$.",
        "steps": [
          {
            "do": "Write recurrence",
            "result": "$(n+2)(n+1)a_{n+2}+a_n=0$",
            "why": "match $x^n$ coefficients"
          },
          {
            "do": "Set initials",
            "result": "$a_0=1,\\ a_1=0$",
            "why": "from $y(0)$ and $y'(0)$"
          },
          {
            "do": "Compute $a_2$",
            "result": "$2a_2+a_0=0$, so $a_2=-1/2$",
            "why": "use $n=0$"
          },
          {
            "do": "Compute $a_3$",
            "result": "$6a_3+a_1=0$, so $a_3=0$",
            "why": "use $n=1$"
          },
          {
            "do": "Compute $a_4$",
            "result": "$12a_4+a_2=0$, so $a_4=1/24$",
            "why": "use $n=2$"
          }
        ],
        "answer": "$y=1-\\frac{x^2}{2}+\\frac{x^4}{24}+\\cdots$."
      },
      {
        "problem": "Find the recurrence for $y''-xy=0$.",
        "steps": [
          {
            "do": "Write $y''$",
            "result": "$\\sum_{n=0}^{\\infty}(n+2)(n+1)a_{n+2}x^n$",
            "why": "reindexed second derivative"
          },
          {
            "do": "Write $xy$",
            "result": "$\\sum_{n=0}^{\\infty}a_nx^{n+1}$",
            "why": "multiply by $x$"
          },
          {
            "do": "Reindex $xy$",
            "result": "$\\sum_{n=1}^{\\infty}a_{n-1}x^n$",
            "why": "align powers"
          },
          {
            "do": "Match coefficient for $n\\ge1$",
            "result": "$(n+2)(n+1)a_{n+2}-a_{n-1}=0$",
            "why": "coefficient of each $x^n$ is zero"
          },
          {
            "do": "Solve recurrence",
            "result": "$a_{n+2}=\\dfrac{a_{n-1}}{(n+2)(n+1)}$",
            "why": "isolate next coefficient"
          }
        ],
        "answer": "For $n\\ge1$, $a_{n+2}=a_{n-1}/((n+2)(n+1))$, with $a_2=0$ from the constant term."
      },
      {
        "problem": "Use $e^{-x}$ series to approximate $e^{-0.1}$ through $x^3$.",
        "steps": [
          {
            "do": "Write the truncated series",
            "result": "$1-x+x^2/2-x^3/6$",
            "why": "Taylor series for $e^{-x}$"
          },
          {
            "do": "Substitute $x=0.1$",
            "result": "$1-0.1+0.01/2-0.001/6$",
            "why": "plug in"
          },
          {
            "do": "Simplify middle terms",
            "result": "$0.9+0.005-0.0001667$",
            "why": "compute powers"
          },
          {
            "do": "Add",
            "result": "$0.9048333$",
            "why": "sum terms"
          },
          {
            "do": "Compare",
            "result": "$e^{-0.1}\\u0007pprox0.904837$",
            "why": "the approximation is close"
          }
        ],
        "answer": "$e^{-0.1}\\u0007pprox0.904833$ using terms through $x^3$."
      },
      {
        "problem": "A model response has $y=1-0.5t^2+0.0417t^4$. Estimate $y(0.2)$.",
        "steps": [
          {
            "do": "Compute $t^2$",
            "result": "$0.2^2=0.04$",
            "why": "square the input"
          },
          {
            "do": "Compute $t^4$",
            "result": "$0.04^2=0.0016$",
            "why": "square again"
          },
          {
            "do": "Substitute",
            "result": "$1-0.5(0.04)+0.0417(0.0016)$",
            "why": "use the series"
          },
          {
            "do": "Compute corrections",
            "result": "$1-0.02+0.0000667$",
            "why": "multiply coefficients"
          },
          {
            "do": "Add",
            "result": "$0.9800667$",
            "why": "sum terms"
          }
        ],
        "answer": "$y(0.2)\\u0007pprox0.980067$."
      }
    ],
    "applications": [
      {
        "title": "Airy functions",
        "background": "Airy equations arise in optics and quantum mechanics, and their solutions are naturally defined by series.",
        "numbers": "For $y''-xy=0$, recurrence steps show $a_2=0$ and $a_3=a_0/6$, so a solution begins $1+x^3/6+\\cdots$."
      },
      {
        "title": "Numerical solvers",
        "background": "Taylor methods use derivatives from the ODE to step forward with controlled local error.",
        "numbers": "Using $e^x\\u0007pprox1+x+x^2/2$ at $x=0.1$ gives $1.105$, close to $1.10517$."
      },
      {
        "title": "Small-angle physics",
        "background": "Series replace nonlinear functions by manageable polynomials near equilibrium.",
        "numbers": "At $\\theta=0.1$, $\\sin\\theta\\u0007pprox0.1-0.001/6=0.099833$."
      },
      {
        "title": "Activation approximations",
        "background": "Hardware sometimes approximates expensive functions by polynomials.",
        "numbers": "A sigmoid near $0$ satisfies $\\sigma(x)\\u0007pprox0.5+x/4$; at $x=0.2$, this gives $0.55$ versus about $0.5498$."
      },
      {
        "title": "Uncertainty propagation",
        "background": "Series expansions estimate how small input noise changes outputs.",
        "numbers": "For $f(x)=e^x$ near $0$, variance scale is approximately $(f'(0))^2=1$."
      },
      {
        "title": "Special-function libraries",
        "background": "Libraries compute functions with series in safe regions and switch methods elsewhere.",
        "numbers": "For $\\cos0.3\\u0007pprox1-0.09/2+0.0081/24=0.9553375$, close to $0.9553365$."
      }
    ],
    "applicationsClose": "Series solutions are patient: when closed forms are unavailable, coefficients still reveal the local function.",
    "takeaways": [
      "Assume a power series, differentiate, substitute, and match coefficients.",
      "Initial conditions set the first coefficients.",
      "Recurrences generate the rest of the series.",
      "Series are local objects governed by radius of convergence."
    ]
  },
  "math-03-26": {
    "id": "math-03-26",
    "title": "Special functions",
    "tagline": "Special functions are named solutions that appear so often we give them their own vocabulary.",
    "connections": {
      "buildsOn": [
        "Series solutions",
        "second-order ODEs",
        "integrals"
      ],
      "leadsTo": [
        "Laplace transforms",
        "Fourier analysis",
        "probability models"
      ],
      "usedWith": [
        "Bessel functions",
        "Legendre polynomials",
        "Gamma function",
        "error function"
      ]
    },
    "motivation": "<p>Not every useful differential equation ends in elementary functions like polynomials, exponentials, or sines. Rather than treating that as failure, mathematics names the recurring solutions.</p><p>Special functions are like standard library calls for analysis: carefully studied, efficiently computed, and shared across physics, statistics, and machine learning.</p>",
    "definition": "<p>A <b>special function</b> is a named function, often defined by a differential equation, integral, or series, that recurs across applications. Examples include Bessel functions from radial waves, Legendre polynomials from spherical geometry, the Gamma function extending factorials, and the error function from Gaussian integrals.</p><p>For instance, $J_0(x)$ solves $x^2y''+xy'+x^2y=0$ with $J_0(0)=1$, and its series begins $J_0(x)=1-x^2/4+x^4/64-\\cdots$. The Gamma function satisfies $\\Gamma(n)=(n-1)!$ for positive integers.</p><p><b>Assumptions that matter:</b> definitions come with domains, normalization choices, and convergence conditions; numerical libraries choose algorithms by input range; and named functions are often the closed form, not a stepping stone to elementary functions.</p>",
    "worked": {
      "problem": "Use the first three terms $J_0(x)\\u0007pprox1-x^2/4+x^4/64$ to estimate $J_0(0.5)$.",
      "skills": [
        "Bessel series",
        "approximation",
        "arithmetic"
      ],
      "strategy": "A special-function value can be computed from its defining series for small $x$.",
      "steps": [
        {
          "do": "Compute $x^2$",
          "result": "$0.5^2=0.25$",
          "why": "square the input"
        },
        {
          "do": "Compute the second term",
          "result": "$-x^2/4=-0.25/4=-0.0625$",
          "why": "apply the series"
        },
        {
          "do": "Compute $x^4$",
          "result": "$0.25^2=0.0625$",
          "why": "square $x^2$"
        },
        {
          "do": "Compute the third term",
          "result": "$x^4/64=0.0625/64=0.0009765625$",
          "why": "apply the series"
        },
        {
          "do": "Add terms",
          "result": "$1-0.0625+0.0009765625=0.9384765625$",
          "why": "sum the approximation"
        }
      ],
      "verify": "A calculator value is about $0.93847$, so the three-term series is already accurate at $x=0.5$.",
      "answer": "$J_0(0.5)\\u0007pprox0.93848$.",
      "connects": "Special functions often come with series that are practical computational definitions."
    },
    "practice": [
      {
        "problem": "Evaluate $\\Gamma(6)$.",
        "steps": [
          {
            "do": "Use integer rule",
            "result": "$\\Gamma(n)=(n-1)!$",
            "why": "Gamma extends factorial"
          },
          {
            "do": "Substitute $n=6$",
            "result": "$\\Gamma(6)=5!$",
            "why": "subtract one"
          },
          {
            "do": "Compute factorial",
            "result": "$5!=5\\cdot4\\cdot3\\cdot2\\cdot1$",
            "why": "definition"
          },
          {
            "do": "Multiply",
            "result": "$120$",
            "why": "product of integers"
          }
        ],
        "answer": "$\\Gamma(6)=120$."
      },
      {
        "problem": "Compute $P_2(0.5)$ for $P_2(x)=\\frac12(3x^2-1)$.",
        "steps": [
          {
            "do": "Square the input",
            "result": "$0.5^2=0.25$",
            "why": "needed in $P_2$"
          },
          {
            "do": "Multiply by $3$",
            "result": "$3\\cdot0.25=0.75$",
            "why": "inside the parentheses"
          },
          {
            "do": "Subtract $1$",
            "result": "$0.75-1=-0.25$",
            "why": "complete inner expression"
          },
          {
            "do": "Multiply by $1/2$",
            "result": "$-0.125$",
            "why": "apply the outer factor"
          }
        ],
        "answer": "$P_2(0.5)=-0.125$."
      },
      {
        "problem": "Approximate $\\operatorname{erf}(0.1)$ using $\\operatorname{erf}(x)\\u0007pprox\\frac{2}{\\sqrt\\pi}(x-x^3/3)$ with $2/\\sqrt\\pi\\u0007pprox1.1284$.",
        "steps": [
          {
            "do": "Compute $x^3$",
            "result": "$0.1^3=0.001$",
            "why": "cube the input"
          },
          {
            "do": "Compute inside",
            "result": "$0.1-0.001/3=0.0996667$",
            "why": "first two terms"
          },
          {
            "do": "Multiply",
            "result": "$1.1284\\cdot0.0996667$",
            "why": "apply scale factor"
          },
          {
            "do": "Approximate",
            "result": "$0.11246$",
            "why": "numeric product"
          }
        ],
        "answer": "$\\operatorname{erf}(0.1)\\u0007pprox0.11246$."
      },
      {
        "problem": "Use $J_0(x)\\u0007pprox1-x^2/4$ to estimate $J_0(0.2)$.",
        "steps": [
          {
            "do": "Compute $x^2$",
            "result": "$0.04$",
            "why": "square $0.2$"
          },
          {
            "do": "Divide by $4$",
            "result": "$0.01$",
            "why": "series correction"
          },
          {
            "do": "Subtract from $1$",
            "result": "$0.99$",
            "why": "two-term approximation"
          },
          {
            "do": "Interpret",
            "result": "near $1$",
            "why": "small radial argument gives small correction"
          }
        ],
        "answer": "$J_0(0.2)\\u0007pprox0.99$."
      },
      {
        "problem": "A Gaussian model uses $\\Phi(z)=\\frac12(1+\\operatorname{erf}(z/\\sqrt2))$. If $\\operatorname{erf}(1/\\sqrt2)\\u0007pprox0.6827$, find $\\Phi(1)$.",
        "steps": [
          {
            "do": "Substitute the given value",
            "result": "$\\Phi(1)=\\frac12(1+0.6827)$",
            "why": "use the definition"
          },
          {
            "do": "Add inside",
            "result": "$1.6827$",
            "why": "combine terms"
          },
          {
            "do": "Multiply by one half",
            "result": "$0.84135$",
            "why": "divide by $2$"
          },
          {
            "do": "Interpret",
            "result": "about $84.1\\%$",
            "why": "standard normal probability below one standard deviation"
          }
        ],
        "answer": "$\\Phi(1)\\u0007pprox0.84135$."
      }
    ],
    "applications": [
      {
        "title": "Radial waves and Bessel functions",
        "background": "Bessel functions appear when waves are circular or cylindrical, such as drumheads and antennas.",
        "numbers": "Using $J_0(1)\\u0007pprox1-1/4+1/64=0.765625$, the value is close to the true $0.7652$."
      },
      {
        "title": "Spherical harmonics",
        "background": "Legendre polynomials help describe functions on spheres, from gravity fields to lighting.",
        "numbers": "For $P_1(x)=x$, $P_2(1)=1$ and $P_2(0)=-0.5$, showing different angular weights."
      },
      {
        "title": "Gaussian probabilities",
        "background": "The error function packages the integral of the bell curve, central to statistics.",
        "numbers": "One standard deviation gives $\\Phi(1)\\u0007pprox0.8413$, so the central interval $[-1,1]$ has probability about $0.6826$."
      },
      {
        "title": "Bayesian distributions",
        "background": "The Gamma function normalizes gamma and beta distributions used for positive rates and probabilities.",
        "numbers": "For integer shape $3$, $\\Gamma(3)=2!=2$, so a Gamma density constant can include division by $2$."
      },
      {
        "title": "Kernel methods",
        "background": "Special functions appear in kernels for radial domains and Gaussian processes.",
        "numbers": "A squared-exponential kernel with distance $2$ and length $1$ gives $e^{-2^2/2}=e^{-2}\\u0007pprox0.135$."
      },
      {
        "title": "Scientific ML libraries",
        "background": "Physics-informed models often call special functions to compare neural predictions with known analytic baselines.",
        "numbers": "If a model predicts $J_0(0.5)=0.94$, the three-term series $0.93848$ gives absolute error about $0.00152$."
      }
    ],
    "applicationsClose": "Special functions are not exotic decorations; they are reusable named solutions for patterns that nature and data keep producing.",
    "takeaways": [
      "Special functions are often defined by ODEs, integrals, or convergent series.",
      "Bessel, Legendre, Gamma, and error functions each package a recurring mathematical pattern.",
      "A named special function can be the best closed form available.",
      "Numerical values usually come from series, recurrences, asymptotics, or library algorithms."
    ]
  }
};
