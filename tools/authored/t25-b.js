module.exports = {
  "math-25-11": {
    "id": "math-25-11",
    "title": "Limit cycles",
    "tagline": "A limit cycle is a closed orbit that nearby motion eventually traces again and again.",
    "connections": {
      "buildsOn": [
        "phase portraits",
        "equilibria and stability",
        "two-dimensional ODEs"
      ],
      "leadsTo": [
        "The Poincaré–Bendixson theorem",
        "bifurcations",
        "oscillatory systems"
      ],
      "usedWith": [
        "polar coordinates",
        "nullclines",
        "linearization",
        "periodic solutions"
      ]
    },
    "motivation": "<p>You already know equilibrium as a resting place: if a system reaches it, nothing changes. But many systems do not settle to stillness. A heartbeat, a clock, and a predator-prey cycle keep moving while still becoming predictable.</p><p>A <b>limit cycle</b> is that kind of predictable motion. The state returns to the same loop, not because it is stuck, but because the surrounding flow gently herds nearby trajectories toward a repeating orbit.</p>",
    "definition": "<p>For an autonomous system $\\dot{x}=f(x,y)$, $\\dot{y}=g(x,y)$, a <b>periodic orbit</b> is a nonconstant solution with $(x(t+T),y(t+T))=(x(t),y(t))$ for some period $T>0$. A <b>limit cycle</b> is an isolated periodic orbit: nearby closed orbits are not packed arbitrarily close to it.</p><p>In polar coordinates, a common test form is $\\dot{r}=h(r)$ and $\\dot{\\theta}=\\omega$. If $h(r_\\ast)=0$ and nearby radii move toward $r_\\ast$, then $r=r_\\ast$ gives a stable cycle. For example, $\\dot{r}=r(1-r)$ makes $r$ increase below $1$ and decrease above $1$, so the circle $r=1$ attracts nearby motion.</p><p><b>Assumptions that matter:</b> the system is autonomous so the phase portrait does not change with time; the periodic orbit is isolated; stability is judged from nearby initial states; and a closed curve is a trajectory only when the vector field is tangent to it everywhere.</p>",
    "worked": {
      "problem": "For $\\dot{r}=r(1-r)$ and $\\dot{\\theta}=2$, show that $r=1$ is a stable limit cycle and find its period.",
      "skills": [
        "polar systems",
        "radial stability",
        "period calculation"
      ],
      "strategy": "The radius decides attraction and the angular speed decides how long one lap takes.",
      "steps": [
        {
          "do": "Set the radial equation to zero",
          "result": "$r(1-r)=0$",
          "why": "constant-radius orbits need $\\dot{r}=0$"
        },
        {
          "do": "Solve for radii",
          "result": "$r=0$ or $r=1$",
          "why": "zero-product property"
        },
        {
          "do": "Check a radius below $1$",
          "result": "$r=0.5$ gives $\\dot{r}=0.25>0$",
          "why": "the radius moves outward"
        },
        {
          "do": "Check a radius above $1$",
          "result": "$r=1.5$ gives $\\dot{r}=-0.75<0$",
          "why": "the radius moves inward"
        },
        {
          "do": "Identify the attracting circle",
          "result": "$r=1$",
          "why": "nearby radii move toward it from both sides"
        },
        {
          "do": "Compute the period",
          "result": "$T=2\\pi/2=\\pi$",
          "why": "angular speed $2$ radians per time needs $2\\pi$ radians for one lap"
        }
      ],
      "verify": "A point with $r=0.8$ moves outward and one with $r=1.2$ moves inward, so both are pushed toward the same circle.",
      "answer": "$r=1$ is a stable limit cycle with period $\\pi$.",
      "connects": "A limit cycle is stability as a loop rather than stability as a point."
    },
    "practice": [
      {
        "problem": "For $\\dot{r}=r(2-r)$, $\\dot{\\theta}=1$, identify the attracting cycle and its period.",
        "steps": [
          {
            "do": "Set $\\dot{r}=0$",
            "result": "$r(2-r)=0$",
            "why": "constant radius requires zero radial velocity"
          },
          {
            "do": "Solve the radial equation",
            "result": "$r=0$ or $r=2$",
            "why": "zero-product property"
          },
          {
            "do": "Test $r=1$",
            "result": "$\\dot{r}=1>0$",
            "why": "radii below 2 move outward"
          },
          {
            "do": "Test $r=3$",
            "result": "$\\dot{r}=-3<0$",
            "why": "radii above 2 move inward"
          },
          {
            "do": "Compute the period",
            "result": "$T=2\\pi/1=2\\pi$",
            "why": "one revolution needs $2\\pi$ radians"
          }
        ],
        "answer": "The stable limit cycle is $r=2$ with period $2\\pi$."
      },
      {
        "problem": "For $\\dot{r}=r(r-1)$, $\\dot{\\theta}=4$, decide whether $r=1$ is stable or unstable and find the period.",
        "steps": [
          {
            "do": "Find the nonzero radial equilibrium",
            "result": "$r=1$",
            "why": "$r(r-1)=0$"
          },
          {
            "do": "Test just below the circle",
            "result": "r=0.5 gives $\\dot{r}=-0.25$",
            "why": "the radius moves inward, away from 1"
          },
          {
            "do": "Test just above the circle",
            "result": "r=1.5 gives $\\dot{r}=0.75$",
            "why": "the radius moves outward, away from 1"
          },
          {
            "do": "Classify the cycle",
            "result": "unstable",
            "why": "nearby radii move away on both sides"
          },
          {
            "do": "Compute the period",
            "result": "$T=2\\pi/4=\\pi/2$",
            "why": "angular speed is 4"
          }
        ],
        "answer": "The cycle $r=1$ is unstable, with period $\\pi/2$."
      },
      {
        "problem": "For $\\dot{r}=r(1-r^2)$, $\\dot{\\theta}=3$, show that $r=1$ attracts positive radii near it.",
        "steps": [
          {
            "do": "Set $\\dot{r}=0$",
            "result": "$r(1-r^2)=0$",
            "why": "constant radii occur where radial velocity vanishes"
          },
          {
            "do": "Solve for nonnegative radii",
            "result": "$r=0$ or $r=1$",
            "why": "negative radius is not used in this polar description"
          },
          {
            "do": "Test $r=0.8$",
            "result": "$0.8(1-0.64)=0.288>0$",
            "why": "below 1 moves outward"
          },
          {
            "do": "Test $r=1.2$",
            "result": "$1.2(1-1.44)=-0.528<0$",
            "why": "above 1 moves inward"
          },
          {
            "do": "Read the stability",
            "result": "stable cycle at $r=1$",
            "why": "both signs push toward the circle"
          }
        ],
        "answer": "$r=1$ is a stable limit cycle for nearby positive radii."
      },
      {
        "problem": "A trajectory on a circular limit cycle has angular speed $0.5$ radians per second. How many seconds does one loop take, and how many loops occur in $40$ seconds?",
        "steps": [
          {
            "do": "Use the period formula",
            "result": "$T=2\\pi/\\omega$",
            "why": "one loop is $2\\pi$ radians"
          },
          {
            "do": "Substitute $\\omega=0.5$",
            "result": "$T=2\\pi/0.5$",
            "why": "use the given speed"
          },
          {
            "do": "Simplify the period",
            "result": "$T=4\\pi\\approx12.57$ seconds",
            "why": "dividing by one half doubles"
          },
          {
            "do": "Divide total time by period",
            "result": "$40/(4\\pi)\\approx3.18$",
            "why": "number of loops is time over period"
          },
          {
            "do": "Interpret the count",
            "result": "about $3$ full loops plus part of another",
            "why": "$3.18$ exceeds 3 but is below 4"
          }
        ],
        "answer": "One loop takes $4\\pi\\approx12.57$ seconds; $40$ seconds contains about $3.18$ loops."
      },
      {
        "problem": "A two-state training monitor is modeled in polar coordinates by $\\dot{r}=0.2r(1-r)$, $\\dot{\\theta}=0.1$. If $r(0)=1.4$, what direction does $r$ initially move, and what is the cycle period?",
        "steps": [
          {
            "do": "Substitute the initial radius",
            "result": "$\\dot{r}=0.2(1.4)(1-1.4)$",
            "why": "evaluate radial motion"
          },
          {
            "do": "Simplify the sign",
            "result": "$\\dot{r}=-0.112$",
            "why": "$0.28\\cdot(-0.4)=-0.112$"
          },
          {
            "do": "Interpret the radial sign",
            "result": "$r$ decreases",
            "why": "negative radial velocity moves inward"
          },
          {
            "do": "Identify the attracting radius",
            "result": "$r=1$",
            "why": "radii above 1 decrease and below 1 increase"
          },
          {
            "do": "Compute the period",
            "result": "$T=2\\pi/0.1=20\\pi\\approx62.83$",
            "why": "slow angular speed means a long loop"
          }
        ],
        "answer": "The radius initially decreases toward $1$; the period is $20\\pi\\approx62.83$."
      }
    ],
    "applications": [
      {
        "title": "Heart rhythms",
        "background": "Physiology often models a healthy heartbeat as a self-sustained oscillator: after a small disturbance, the rhythm returns to its repeating cycle.",
        "numbers": "At $75$ beats per minute, one cycle takes $60/75=0.8$ seconds."
      },
      {
        "title": "Van der Pol oscillator",
        "background": "The Van der Pol equation was introduced for electrical circuits with nonlinear damping and became a classic source of stable oscillations.",
        "numbers": "If a simulated oscillator repeats every $6.3$ seconds, then $10$ minutes contains $600/6.3\\approx95.2$ cycles."
      },
      {
        "title": "Clock regulation",
        "background": "A pendulum clock is useful because many nearby swings return to nearly the same amplitude instead of dying instantly or exploding.",
        "numbers": "A clock ticking once per second has angular frequency $2\\pi$ radians per second for a one-second cycle."
      },
      {
        "title": "Predator-prey cycles",
        "background": "Ecology uses closed or near-closed phase curves to describe repeating rises and falls in populations.",
        "numbers": "If a hare-lynx cycle lasts $10$ years, then a $50$-year record covers about $5$ loops."
      },
      {
        "title": "Optimization oscillations",
        "background": "Momentum methods can circle around a valley before settling. A stable cycle is a warning that the parameters may keep repeating instead of converging.",
        "numbers": "If validation loss repeats every $400$ steps, then $2000$ steps show $2000/400=5$ loops."
      },
      {
        "title": "Neural oscillators",
        "background": "Central pattern generators in robotics produce rhythmic walking signals using stable cycles.",
        "numbers": "A gait frequency of $2$ Hz means period $1/2=0.5$ seconds per step cycle."
      }
    ],
    "applicationsClose": "Limit cycles show that stable long-run behavior can be rhythmic rather than still.",
    "takeaways": [
      "A limit cycle is an isolated periodic orbit.",
      "Stability asks whether nearby trajectories approach or leave the loop.",
      "In polar form, signs of $\\dot{r}$ around $r_\\ast$ reveal attraction or repulsion.",
      "The period comes from angular speed when $\\dot{\\theta}$ is constant."
    ]
  },
  "math-25-12": {
    "id": "math-25-12",
    "title": "The Poincaré–Bendixson theorem",
    "tagline": "In the plane, a trapped trajectory that avoids equilibria must eventually circle a periodic orbit.",
    "connections": {
      "buildsOn": [
        "limit cycles",
        "compact sets",
        "planar autonomous systems"
      ],
      "leadsTo": [
        "chaos in higher dimensions",
        "bifurcation theory",
        "strange attractors"
      ],
      "usedWith": [
        "phase portraits",
        "invariant regions",
        "equilibria",
        "omega-limit sets"
      ]
    },
    "motivation": "<p>You have seen that a two-dimensional system can settle to a point or to a loop. A natural question is whether something wilder can happen in the plane if a trajectory stays trapped forever.</p><p>The <b>Poincaré–Bendixson theorem</b> gives a surprisingly comforting answer. In a planar autonomous system, if motion remains in a closed bounded region and does not settle on an equilibrium, its long-run behavior must include a periodic orbit.</p>",
    "definition": "<p>One useful form says: for a continuously differentiable autonomous system in the plane, if a forward trajectory stays in a compact region $R$, and its omega-limit set contains no equilibrium point, then the omega-limit set is a periodic orbit. Here the <b>omega-limit set</b> means the states approached along times $t\\to\\infty$.</p><p>The idea is planar geometry. A trajectory in the plane cannot cross itself, because uniqueness would then force the same future from the crossing point. If it is trapped forever and cannot end at a rest point, the remaining organized possibility is circulation around a closed orbit.</p><p><b>Assumptions that matter:</b> the theorem is for two-dimensional autonomous systems; the vector field must be regular enough for uniqueness; the trapping region must be closed and bounded; and equilibria inside the limiting behavior change the conclusion.</p>",
    "worked": {
      "problem": "A planar system has a trapping annulus $1\\le r\\le3$, angular speed always positive, and no equilibria in the annulus. What does Poincaré–Bendixson guarantee?",
      "skills": [
        "theorem hypotheses",
        "trapping regions",
        "periodic orbits"
      ],
      "strategy": "Check the hypotheses one by one; the theorem is a guarantee machine only when all assumptions are present.",
      "steps": [
        {
          "do": "Identify the dimension",
          "result": "two-dimensional",
          "why": "the state is represented in the plane"
        },
        {
          "do": "Check boundedness",
          "result": "$1\\le r\\le3$ is bounded",
          "why": "radii cannot grow beyond 3"
        },
        {
          "do": "Check closedness",
          "result": "$1\\le r\\le3$ includes its boundaries",
          "why": "the annulus is closed"
        },
        {
          "do": "Use the trapping condition",
          "result": "the trajectory stays in the annulus",
          "why": "forward motion remains in a compact region"
        },
        {
          "do": "Use the no-equilibrium condition",
          "result": "no rest point lies in the annulus",
          "why": "the limiting set cannot be only an equilibrium"
        },
        {
          "do": "Apply the theorem",
          "result": "a periodic orbit exists in the annulus",
          "why": "trapped planar motion with no equilibrium must cycle"
        }
      ],
      "verify": "Each hypothesis is structural, not numerical: plane, compact trap, and no equilibria are exactly the ingredients needed.",
      "answer": "The theorem guarantees at least one periodic orbit in the annulus.",
      "connects": "Poincaré–Bendixson is powerful because it proves a cycle exists without solving the ODE."
    },
    "practice": [
      {
        "problem": "A trajectory of a planar autonomous system remains in the disk $x^2+y^2\\le4$, and the disk contains no equilibria. What can you conclude if the disk is forward invariant?",
        "steps": [
          {
            "do": "Read the region",
            "result": "$x^2+y^2\\le4$",
            "why": "this is a closed disk of radius 2"
          },
          {
            "do": "Check boundedness",
            "result": "radius is at most $2$",
            "why": "the region is bounded"
          },
          {
            "do": "Use forward invariance",
            "result": "the trajectory stays in the disk",
            "why": "motion is trapped"
          },
          {
            "do": "Use the equilibrium condition",
            "result": "no equilibria are in the disk",
            "why": "the limiting behavior cannot be a rest point"
          },
          {
            "do": "Apply Poincaré–Bendixson",
            "result": "a periodic orbit exists",
            "why": "the hypotheses match the theorem"
          }
        ],
        "answer": "There must be a periodic orbit in the disk."
      },
      {
        "problem": "Why can the theorem not be applied to $\\dot{x}=-x$, $\\dot{y}=-y$ on the disk $x^2+y^2\\le1$?",
        "steps": [
          {
            "do": "Find the equilibrium",
            "result": "$(0,0)$",
            "why": "both derivatives vanish there"
          },
          {
            "do": "Check that it lies in the disk",
            "result": "$0^2+0^2=0\\le1$",
            "why": "the rest point is inside"
          },
          {
            "do": "Compare with the theorem",
            "result": "the no-equilibrium hypothesis fails",
            "why": "Poincaré–Bendixson needs no equilibrium in the omega-limit set"
          },
          {
            "do": "Describe actual behavior",
            "result": "trajectories approach $(0,0)$",
            "why": "linear decay pulls inward"
          },
          {
            "do": "State the conclusion",
            "result": "no cycle is guaranteed",
            "why": "a failed hypothesis blocks the theorem"
          }
        ],
        "answer": "The theorem does not apply because the disk contains an equilibrium, and trajectories actually approach it."
      },
      {
        "problem": "A trapping region is $2\\le r\\le5$. Its area is not needed, but compute it and explain why compactness still matters.",
        "steps": [
          {
            "do": "Write the annulus area formula",
            "result": "$\\pi R^2-\\pi r^2$",
            "why": "outer disk minus inner disk"
          },
          {
            "do": "Substitute the radii",
            "result": "$\\pi(5^2)-\\pi(2^2)$",
            "why": "use $R=5$ and $r=2$"
          },
          {
            "do": "Simplify",
            "result": "$21\\pi$",
            "why": "$25\\pi-4\\pi=21\\pi$"
          },
          {
            "do": "Identify compactness",
            "result": "closed and bounded",
            "why": "both boundary circles are included and radii are limited"
          },
          {
            "do": "Connect to the theorem",
            "result": "trapped motion has accumulation points",
            "why": "compactness prevents escape to infinity"
          }
        ],
        "answer": "The annulus area is $21\\pi$, and its closed bounded shape is what lets long-run behavior stay in view."
      },
      {
        "problem": "A planar system is trapped in a square $[-1,1]\\times[-1,1]$, but one equilibrium lies at $(0.2,0.3)$. What extra information would you need before claiming a cycle?",
        "steps": [
          {
            "do": "Check the trapping region",
            "result": "the square is compact",
            "why": "closed and bounded"
          },
          {
            "do": "Locate the equilibrium",
            "result": "$(0.2,0.3)$ is inside",
            "why": "both coordinates lie between $-1$ and $1$"
          },
          {
            "do": "Notice the obstacle",
            "result": "an equilibrium is present",
            "why": "the simple no-equilibrium hypothesis fails"
          },
          {
            "do": "Name the needed information",
            "result": "the omega-limit set avoids that equilibrium",
            "why": "Poincaré–Bendixson can still help if the limiting set contains no rest point"
          },
          {
            "do": "State the cautious conclusion",
            "result": "cannot claim a cycle from the given data",
            "why": "the theorem's conditions are not yet verified"
          }
        ],
        "answer": "You would need to know the trajectory's omega-limit set contains no equilibrium; otherwise no cycle is guaranteed."
      },
      {
        "problem": "Why does Poincaré–Bendixson not explain chaotic attractors in three-dimensional systems?",
        "steps": [
          {
            "do": "State the theorem's dimension",
            "result": "planar systems",
            "why": "it is a two-dimensional result"
          },
          {
            "do": "Compare dimensions",
            "result": "three-dimensional systems are not planar",
            "why": "their trajectories have more room"
          },
          {
            "do": "Recall non-crossing intuition",
            "result": "plane curves cannot cross themselves",
            "why": "this restriction is weaker in 3D"
          },
          {
            "do": "Identify possible behavior",
            "result": "chaotic attractors can occur",
            "why": "3D systems can fold and stretch without crossing in the same way"
          },
          {
            "do": "State the limitation",
            "result": "the theorem does not apply",
            "why": "one hypothesis, dimension, fails"
          }
        ],
        "answer": "It does not apply because the theorem is planar; three-dimensional systems can support chaotic attractors."
      }
    ],
    "applications": [
      {
        "title": "Existence without formulas",
        "background": "Engineers often cannot solve nonlinear ODEs exactly. The theorem can still certify an oscillation from geometry.",
        "numbers": "If a simulation keeps $1\\le r\\le2$ for $10,000$ time units and no equilibrium is present, the theorem points to a cycle without needing a closed-form solution."
      },
      {
        "title": "Chemical oscillators",
        "background": "The Belousov-Zhabotinsky reaction made chemical oscillations famous. Planar reductions are often analyzed through trapping regions.",
        "numbers": "If concentration coordinates stay between $0.1$ and $0.9$, the square area is $0.8^2=0.64$."
      },
      {
        "title": "Population models",
        "background": "Predator-prey systems can be checked for bounded positive regions before looking for cycles.",
        "numbers": "If prey remains between $20$ and $80$ and predators between $5$ and $30$, the rectangle has area $60\\cdot25=1500$ in population units."
      },
      {
        "title": "Electrical circuits",
        "background": "Nonlinear circuits may oscillate because voltage-current states are trapped away from rest.",
        "numbers": "A voltage bounded by $[-5,5]$ and current by $[-2,2]$ gives a state rectangle of area $10\\cdot4=40$."
      },
      {
        "title": "Why planar RNNs are limited",
        "background": "A two-dimensional continuous-time recurrent system cannot have true chaos under the theorem's setting.",
        "numbers": "With two hidden coordinates bounded in $[-1,1]^2$, long-run behavior is far more restricted than in three hidden dimensions."
      },
      {
        "title": "Model debugging",
        "background": "When a 2D simulation looks irregular, Poincaré–Bendixson reminds you to check nonautonomous forcing, discontinuities, or numerical artifacts.",
        "numbers": "A step size of $0.1$ over $100$ seconds gives $1000$ updates; reducing to $0.01$ gives $10000$ updates to test whether the pattern persists."
      }
    ],
    "applicationsClose": "The theorem is a quiet boundary line: planar autonomous systems can cycle, but true chaos needs another ingredient.",
    "takeaways": [
      "Poincaré–Bendixson applies to planar autonomous systems with trapped forward motion.",
      "If the omega-limit set has no equilibrium, a periodic orbit must occur.",
      "The theorem proves existence, not the exact shape or period of the orbit.",
      "Its failure in higher dimensions helps explain why chaos first appears in richer systems."
    ]
  },
  "math-25-13": {
    "id": "math-25-13",
    "title": "Lyapunov functions",
    "tagline": "A Lyapunov function proves stability by finding an energy-like quantity that always decreases.",
    "connections": {
      "buildsOn": [
        "equilibria",
        "gradients",
        "positive definite functions"
      ],
      "leadsTo": [
        "LaSalle invariance",
        "control stability",
        "training dynamics"
      ],
      "usedWith": [
        "quadratic forms",
        "level sets",
        "eigenvalues",
        "differential inequalities"
      ]
    },
    "motivation": "<p>You already know how a marble behaves in a bowl: if its energy keeps going down, it cannot climb away forever. Stability theory borrows that idea even when there is no literal bowl.</p><p>A <b>Lyapunov function</b> is an invented energy. If it is smallest at the equilibrium and decreases along every nearby trajectory, it proves the equilibrium is stable without solving the system exactly.</p>",
    "definition": "<p>For $\\dot{x}=f(x)$ with equilibrium $x=0$, a scalar function $V(x)$ is a Lyapunov function near $0$ if $V(0)=0$, $V(x)>0$ for $x\\ne0$, and the derivative along trajectories $\\dot{V}(x)=\\nabla V(x)\\cdot f(x)$ is nonpositive. If $\\dot{V}(x)<0$ for $x\\ne0$, the equilibrium is asymptotically stable.</p><p>The derivative formula comes from the chain rule: as the state moves, $V$ changes at rate $\\sum_i (\\partial V/\\partial x_i)\\dot{x}_i=\\nabla V\\cdot f$. So stability becomes an inequality about a scalar function instead of a full solution formula.</p><p><b>Assumptions that matter:</b> $V$ must be differentiable where we use $\\nabla V$; positive definiteness is relative to the equilibrium; negative semidefinite $\\dot{V}$ proves weaker stability unless additional invariance arguments apply; and the result is local unless $V$ grows properly over the whole state space.</p>",
    "worked": {
      "problem": "Use $V(x,y)=x^2+y^2$ to test stability of $\\dot{x}=-2x$, $\\dot{y}=-y$ at the origin.",
      "skills": [
        "chain rule",
        "positive definiteness",
        "asymptotic stability"
      ],
      "strategy": "The candidate is a squared distance — differentiate it along the system and check the sign.",
      "steps": [
        {
          "do": "Check the value at the origin",
          "result": "$V(0,0)=0$",
          "why": "both squared terms vanish"
        },
        {
          "do": "Check positivity away from the origin",
          "result": "$x^2+y^2>0$ for $(x,y)\\ne(0,0)$",
          "why": "a sum of squares is positive unless both are zero"
        },
        {
          "do": "Compute the gradient",
          "result": "$\\nabla V=(2x,2y)$",
          "why": "differentiate with respect to each coordinate"
        },
        {
          "do": "Dot with the vector field",
          "result": "$\\dot{V}=(2x)(-2x)+(2y)(-y)$",
          "why": "chain rule along trajectories"
        },
        {
          "do": "Simplify",
          "result": "$\\dot{V}=-4x^2-2y^2$",
          "why": "multiply the terms"
        },
        {
          "do": "Classify the sign",
          "result": "$\\dot{V}<0$ for $(x,y)\\ne(0,0)$",
          "why": "at least one squared term is positive away from the origin"
        }
      ],
      "verify": "The derivative is zero only at the origin, so the energy strictly decreases along every nonzero nearby state.",
      "answer": "The origin is asymptotically stable.",
      "connects": "Lyapunov functions turn stability into a monotone quantity you can audit."
    },
    "practice": [
      {
        "problem": "For $\\dot{x}=-3x$, use $V=x^2$ to prove stability of $x=0$.",
        "steps": [
          {
            "do": "Check $V(0)$",
            "result": "$0$",
            "why": "the square of zero is zero"
          },
          {
            "do": "Check positivity",
            "result": "$x^2>0$ for $x\\ne0$",
            "why": "squares are positive away from zero"
          },
          {
            "do": "Differentiate $V$",
            "result": "$\\dot{V}=2x\\dot{x}$",
            "why": "chain rule"
          },
          {
            "do": "Substitute the dynamics",
            "result": "$\\dot{V}=2x(-3x)$",
            "why": "use $\\dot{x}=-3x$"
          },
          {
            "do": "Simplify the sign",
            "result": "$\\dot{V}=-6x^2<0$ for $x\\ne0$",
            "why": "negative multiple of a positive square"
          }
        ],
        "answer": "$x=0$ is asymptotically stable."
      },
      {
        "problem": "For $\\dot{x}=x$, test $V=x^2$. What does the sign say?",
        "steps": [
          {
            "do": "Check positivity of $V$",
            "result": "$x^2>0$ for $x\\ne0$",
            "why": "the candidate is positive definite"
          },
          {
            "do": "Differentiate along trajectories",
            "result": "$\\dot{V}=2x\\dot{x}$",
            "why": "chain rule"
          },
          {
            "do": "Substitute $\\dot{x}=x$",
            "result": "$\\dot{V}=2x^2$",
            "why": "replace the velocity"
          },
          {
            "do": "Read the sign",
            "result": "$\\dot{V}>0$ for $x\\ne0$",
            "why": "the quantity increases away from zero"
          },
          {
            "do": "Interpret stability",
            "result": "not stable by this test",
            "why": "energy growth indicates repulsion, not attraction"
          }
        ],
        "answer": "$V$ increases, so the origin is unstable rather than Lyapunov stable."
      },
      {
        "problem": "For $\\dot{x}=-x+y$, $\\dot{y}=-x-y$, compute $\\dot{V}$ for $V=x^2+y^2$.",
        "steps": [
          {
            "do": "Compute the gradient",
            "result": "$\\nabla V=(2x,2y)$",
            "why": "differentiate the sum of squares"
          },
          {
            "do": "Dot with the vector field",
            "result": "$\\dot{V}=2x(-x+y)+2y(-x-y)$",
            "why": "apply the chain rule"
          },
          {
            "do": "Expand the first term",
            "result": "$-2x^2+2xy$",
            "why": "multiply by $2x$"
          },
          {
            "do": "Expand the second term",
            "result": "$-2xy-2y^2$",
            "why": "multiply by $2y$"
          },
          {
            "do": "Combine terms",
            "result": "$\\dot{V}=-2x^2-2y^2$",
            "why": "the cross terms cancel"
          }
        ],
        "answer": "$\\dot{V}=-2x^2-2y^2<0$ away from the origin, so the origin is asymptotically stable."
      },
      {
        "problem": "Let $V(x,y)=4x^2+y^2$. Is it positive definite? Evaluate it at $(1,2)$ and $(0,0)$.",
        "steps": [
          {
            "do": "Evaluate at the origin",
            "result": "$V(0,0)=0$",
            "why": "both terms vanish"
          },
          {
            "do": "Inspect nonzero states",
            "result": "$4x^2+y^2>0$ if $(x,y)\\ne(0,0)$",
            "why": "positive coefficients multiply squares"
          },
          {
            "do": "Evaluate at $(1,2)$",
            "result": "$4(1)^2+2^2$",
            "why": "substitute the point"
          },
          {
            "do": "Simplify",
            "result": "$8$",
            "why": "$4+4=8$"
          },
          {
            "do": "State the property",
            "result": "positive definite",
            "why": "zero only at the origin and positive elsewhere"
          }
        ],
        "answer": "Yes. $V$ is positive definite, with $V(1,2)=8$ and $V(0,0)=0$."
      },
      {
        "problem": "Gradient descent on $L(w)=\\frac12w^2$ uses $w_{k+1}=w_k-0.4w_k$. Show the Lyapunov value $V_k=w_k^2$ decreases from $w_0=5$ to $w_1$.",
        "steps": [
          {
            "do": "Simplify the update",
            "result": "$w_{k+1}=0.6w_k$",
            "why": "$1-0.4=0.6$"
          },
          {
            "do": "Compute the next weight",
            "result": "$w_1=0.6\\cdot5=3$",
            "why": "apply the update"
          },
          {
            "do": "Compute the initial Lyapunov value",
            "result": "$V_0=5^2=25$",
            "why": "square the initial state"
          },
          {
            "do": "Compute the next Lyapunov value",
            "result": "$V_1=3^2=9$",
            "why": "square the next state"
          },
          {
            "do": "Compare values",
            "result": "$9<25$",
            "why": "the energy-like quantity decreased"
          }
        ],
        "answer": "The Lyapunov value drops from $25$ to $9$, so this step moves toward the stable fixed point."
      }
    ],
    "applications": [
      {
        "title": "Control systems",
        "background": "Lyapunov's method became central in control because aircraft and robots need stability guarantees without closed-form trajectories.",
        "numbers": "If $V$ drops from $10$ to $6$ in $2$ seconds, the average decrease rate is $(6-10)/2=-2$ per second."
      },
      {
        "title": "Robotics balance",
        "background": "A balancing robot can use mechanical energy as a Lyapunov-like quantity near upright posture.",
        "numbers": "If angle error is $0.1$ rad and angular velocity is $0.2$ rad/s, $V=0.1^2+0.2^2=0.05$."
      },
      {
        "title": "Gradient descent",
        "background": "For convex losses, the loss itself often behaves like a Lyapunov function under small enough steps.",
        "numbers": "If losses are $1.20,0.84,0.60$, the decreases are $0.36$ and $0.24$, both positive improvements."
      },
      {
        "title": "Neural network training monitors",
        "background": "Engineers watch whether training loss decreases smoothly; persistent increases suggest the step size may be too large.",
        "numbers": "A loss jump from $0.80$ to $1.12$ is a $40\\%$ increase because $1.12/0.80=1.4$."
      },
      {
        "title": "Markov chain convergence",
        "background": "Some stochastic processes use distance to stationarity as a Lyapunov-like drift measure.",
        "numbers": "If expected distance changes from $5$ to $0.9\\cdot5=4.5$, the drift is $-0.5$."
      },
      {
        "title": "Safe reinforcement learning",
        "background": "Safety filters often require a barrier or Lyapunov function not to increase beyond a threshold.",
        "numbers": "If safety value must satisfy $V\\le1$ and the current value is $0.64$, a proposed action predicting $V=0.81$ remains inside the limit."
      }
    ],
    "applicationsClose": "The shared move is to replace a hard trajectory question with an easier scalar question: does the energy go down?",
    "takeaways": [
      "A Lyapunov function is positive at nonzero states and zero at the equilibrium.",
      "The derivative along trajectories is $\\dot{V}=\\nabla V\\cdot f$.",
      "Strictly negative $\\dot{V}$ away from equilibrium proves asymptotic stability.",
      "Loss curves and energy measures are practical Lyapunov ideas in ML and control."
    ]
  },
  "math-25-14": {
    "id": "math-25-14",
    "title": "Discrete maps",
    "tagline": "A discrete map updates a state step by step, so dynamics become iteration.",
    "connections": {
      "buildsOn": [
        "fixed points",
        "stability",
        "iteration"
      ],
      "leadsTo": [
        "chaos",
        "bifurcations",
        "numerical simulation"
      ],
      "usedWith": [
        "fixed points",
        "derivatives",
        "linearization",
        "eigenvalues"
      ]
    },
    "motivation": "<p>You already know recursion: today's value becomes tomorrow's input. A discrete map is recursion treated as a dynamical system.</p><p>Instead of following $\\dot{x}$ continuously, we study $x_{n+1}=F(x_n)$. Fixed points, stability, cycles, and chaos all appear in this simple step-by-step world.</p>",
    "definition": "<p>A <b>discrete map</b> is an update rule $x_{n+1}=F(x_n)$, where $n$ is an integer time index and $F$ maps the current state to the next state. A <b>fixed point</b> satisfies $x^\\ast=F(x^\\ast)$.</p><p>In one dimension, a differentiable fixed point is locally attracting when $|F'(x^\\ast)|<1$ and repelling when $|F'(x^\\ast)|>1$. This comes from linearizing: if $e_n=x_n-x^\\ast$, then $e_{n+1}\\approx F'(x^\\ast)e_n$, so errors shrink exactly when the multiplier has absolute value below $1$.</p><p><b>Assumptions that matter:</b> time advances in integer steps; local stability uses differentiability near the fixed point; $|F'|=1$ is inconclusive by the simple test; and iterates can leave the intended domain unless the map preserves it.</p>",
    "worked": {
      "problem": "For $F(x)=0.5x+3$, find the fixed point and decide whether it attracts nearby iterates.",
      "skills": [
        "fixed points",
        "derivative test",
        "iteration"
      ],
      "strategy": "Solve $x=F(x)$, then use the slope magnitude to read local stability.",
      "steps": [
        {
          "do": "Write the fixed-point equation",
          "result": "$x=0.5x+3$",
          "why": "fixed points stay unchanged by the map"
        },
        {
          "do": "Subtract $0.5x$",
          "result": "$0.5x=3$",
          "why": "collect $x$ terms"
        },
        {
          "do": "Divide by $0.5$",
          "result": "$x=6$",
          "why": "solve for the fixed point"
        },
        {
          "do": "Differentiate the map",
          "result": "$F'(x)=0.5$",
          "why": "the map is linear"
        },
        {
          "do": "Take the absolute value",
          "result": "$|F'(6)|=0.5<1$",
          "why": "errors shrink by half each step"
        },
        {
          "do": "Classify the point",
          "result": "attracting",
          "why": "nearby iterates move toward $6$"
        }
      ],
      "verify": "Starting from $x_0=10$ gives $x_1=8$, closer to $6$, which matches the stability test.",
      "answer": "The fixed point is $6$, and it is attracting.",
      "connects": "A discrete map turns stability into the behavior of repeated updates."
    },
    "practice": [
      {
        "problem": "Iterate $x_{n+1}=0.5x_n+1$ from $x_0=0$ for three steps.",
        "steps": [
          {
            "do": "Compute $x_1$",
            "result": "$0.5\\cdot0+1=1$",
            "why": "apply the rule once"
          },
          {
            "do": "Compute $x_2$",
            "result": "$0.5\\cdot1+1=1.5$",
            "why": "feed $x_1$ back in"
          },
          {
            "do": "Compute $x_3$",
            "result": "$0.5\\cdot1.5+1=1.75$",
            "why": "feed $x_2$ back in"
          },
          {
            "do": "Find the fixed point",
            "result": "$x=0.5x+1$",
            "why": "compare with the destination"
          },
          {
            "do": "Solve it",
            "result": "$x=2$",
            "why": "the iterates are moving toward 2"
          }
        ],
        "answer": "The first three iterates are $1$, $1.5$, and $1.75$."
      },
      {
        "problem": "Find and classify the fixed point of $F(x)=2x-3$.",
        "steps": [
          {
            "do": "Set $x=F(x)$",
            "result": "$x=2x-3$",
            "why": "fixed point equation"
          },
          {
            "do": "Subtract $2x$",
            "result": "$-x=-3$",
            "why": "collect terms"
          },
          {
            "do": "Solve",
            "result": "$x=3$",
            "why": "multiply by $-1$"
          },
          {
            "do": "Differentiate",
            "result": "$F'(x)=2$",
            "why": "linear map slope"
          },
          {
            "do": "Classify",
            "result": "repelling",
            "why": "$|2|>1$ grows errors"
          }
        ],
        "answer": "The fixed point is $3$, and it is repelling."
      },
      {
        "problem": "For $F(x)=x^2$, classify fixed points $0$ and $1$ using derivatives.",
        "steps": [
          {
            "do": "Differentiate",
            "result": "$F'(x)=2x$",
            "why": "needed for the local test"
          },
          {
            "do": "Evaluate at $0$",
            "result": "$F'(0)=0$",
            "why": "substitute the first fixed point"
          },
          {
            "do": "Classify $0$",
            "result": "attracting",
            "why": "$|0|<1$"
          },
          {
            "do": "Evaluate at $1$",
            "result": "$F'(1)=2$",
            "why": "substitute the second fixed point"
          },
          {
            "do": "Classify $1$",
            "result": "repelling",
            "why": "$|2|>1$"
          }
        ],
        "answer": "$0$ is attracting and $1$ is repelling."
      },
      {
        "problem": "Find the period-2 orbit of $F(x)=1-x$.",
        "steps": [
          {
            "do": "Compose the map",
            "result": "$F(F(x))=1-(1-x)$",
            "why": "apply the rule twice"
          },
          {
            "do": "Simplify",
            "result": "$F(F(x))=x$",
            "why": "two steps return every point"
          },
          {
            "do": "Exclude fixed points",
            "result": "$x=1-x$",
            "why": "period 2 requires not period 1"
          },
          {
            "do": "Solve the fixed equation",
            "result": "$x=1/2$",
            "why": "only this point is fixed"
          },
          {
            "do": "State period-2 points",
            "result": "all $x\\ne1/2$ alternate with $1-x$",
            "why": "they return after two steps"
          }
        ],
        "answer": "Every $x\\ne1/2$ belongs to a period-2 orbit $x,1-x$."
      },
      {
        "problem": "A scalar RNN update is $h_{t+1}=0.8h_t+1$ with $h_0=0$. Compute three hidden states and the fixed point.",
        "steps": [
          {
            "do": "Compute $h_1$",
            "result": "$0.8\\cdot0+1=1$",
            "why": "first update"
          },
          {
            "do": "Compute $h_2$",
            "result": "$0.8\\cdot1+1=1.8$",
            "why": "second update"
          },
          {
            "do": "Compute $h_3$",
            "result": "$0.8\\cdot1.8+1=2.44$",
            "why": "third update"
          },
          {
            "do": "Set fixed point equation",
            "result": "$h=0.8h+1$",
            "why": "steady hidden state"
          },
          {
            "do": "Solve",
            "result": "$h=5$",
            "why": "$0.2h=1$"
          }
        ],
        "answer": "The states are $1$, $1.8$, $2.44$, and the attracting fixed point is $5$."
      }
    ],
    "applications": [
      {
        "title": "Iterated algorithms",
        "background": "Many algorithms are maps: the next estimate is computed from the current estimate.",
        "numbers": "Newton-style updates producing $2.0,1.5,1.4167$ are discrete iterates indexed by step."
      },
      {
        "title": "Simulation step size",
        "background": "Numerical solvers turn continuous systems into discrete maps, so stability can depend on the time step.",
        "numbers": "Euler on $\\dot{x}=-x$ gives $x_{n+1}=(1-h)x_n$; with $h=0.1$, the multiplier is $0.9$."
      },
      {
        "title": "Population fractions",
        "background": "Maps are natural when generations do not overlap or updates happen in batches.",
        "numbers": "A fraction $0.3$ updated by $2(0.3)(0.7)$ becomes $0.42$."
      },
      {
        "title": "Optimizer updates",
        "background": "Training loops are discrete dynamical systems on parameters.",
        "numbers": "If $w_{k+1}=0.8w_k$ and $w_0=5$, then $w_4=0.8^4\\cdot5=2.048$."
      },
      {
        "title": "Recurrent networks",
        "background": "RNN hidden states are repeatedly updated, so fixed points and cycles describe long-run memory.",
        "numbers": "With $h_{t+1}=0.6h_t+2$, the fixed point is $h=5$."
      },
      {
        "title": "Digital filters",
        "background": "Signal smoothing uses recurrence relations that must be stable to avoid runaway outputs.",
        "numbers": "For $y_{n+1}=0.9y_n+0.1x_n$, an old impulse has weight $0.9^{10}\\approx0.349$ after 10 steps."
      }
    ],
    "applicationsClose": "Across these examples, the same question keeps returning: what happens when the rule is applied again and again?",
    "takeaways": [
      "Iterating a rule creates a discrete dynamical system.",
      "Fixed points and cycles are long-run patterns of repeated updates.",
      "Derivative or multiplier magnitudes below $1$ shrink local errors.",
      "ML training loops and recurrent states use the same stability logic."
    ]
  },
  "math-25-15": {
    "id": "math-25-15",
    "title": "The logistic map",
    "tagline": "The logistic map shows how a tiny nonlinear update can grow, settle, oscillate, or become chaotic.",
    "connections": {
      "buildsOn": [
        "discrete maps",
        "fixed-point stability",
        "quadratic functions"
      ],
      "leadsTo": [
        "period doubling",
        "chaos",
        "bifurcation diagrams"
      ],
      "usedWith": [
        "fixed points",
        "derivatives",
        "linearization",
        "eigenvalues"
      ]
    },
    "motivation": "<p>You have seen linear updates where each step simply multiplies by a constant. The logistic map adds one gentle constraint: growth slows when the state gets large.</p><p>The rule $x_{n+1}=rx_n(1-x_n)$ became famous because it is only one line, yet it contains fixed points, period doubling, and chaos. It is a small laboratory for nonlinear dynamics.</p>",
    "definition": "<p>The <b>logistic map</b> is $x_{n+1}=F(x_n)=rx_n(1-x_n)$, usually with $0\\le x_n\\le1$ and $0\\le r\\le4$. The parameter $r$ controls growth strength, while the factor $(1-x_n)$ limits growth near carrying capacity.</p><p>Fixed points solve $x=rx(1-x)$. This gives $x=0$ or, when $r\\ne0$, $x=1-1/r$. Their stability follows from $F'(x)=r(1-2x)$: the nonzero fixed point is attracting when $|2-r|<1$, so $1<r<3$.</p><p><b>Assumptions that matter:</b> the usual interval model uses $0\\le r\\le4$ so $[0,1]$ maps into itself; fixed-point stability is local; long-run behavior can depend strongly on $r$; and numerical rounding can matter in chaotic regimes.</p>",
    "worked": {
      "problem": "For the logistic map with $r=2.5$, find the nonzero fixed point and test its stability.",
      "skills": [
        "fixed points",
        "logistic derivative",
        "stability interval"
      ],
      "strategy": "Solve the fixed-point equation, then evaluate the derivative at that point.",
      "steps": [
        {
          "do": "Write the nonzero formula",
          "result": "$x^\\ast=1-1/r$",
          "why": "from solving $x=rx(1-x)$"
        },
        {
          "do": "Substitute $r=2.5$",
          "result": "$x^\\ast=1-1/2.5$",
          "why": "use the parameter"
        },
        {
          "do": "Compute the fixed point",
          "result": "$x^\\ast=0.6$",
          "why": "$1/2.5=0.4$"
        },
        {
          "do": "Differentiate the map",
          "result": "$F'(x)=r(1-2x)$",
          "why": "derivative of $rx(1-x)$"
        },
        {
          "do": "Evaluate at $0.6$",
          "result": "$F'(0.6)=2.5(1-1.2)=-0.5$",
          "why": "substitute the fixed point"
        },
        {
          "do": "Classify",
          "result": "attracting",
          "why": "$|-0.5|<1$"
        }
      ],
      "verify": "The negative derivative means errors alternate signs, but the factor $0.5$ makes them shrink.",
      "answer": "The nonzero fixed point is $0.6$, and it is attracting.",
      "connects": "The logistic map packages nonlinear feedback into one quadratic update."
    },
    "practice": [
      {
        "problem": "For $r=2$, find the nonzero fixed point.",
        "steps": [
          {
            "do": "Use the formula",
            "result": "$x^\\ast=1-1/r$",
            "why": "nonzero logistic fixed point"
          },
          {
            "do": "Substitute $r=2$",
            "result": "$1-1/2$",
            "why": "use the parameter"
          },
          {
            "do": "Simplify",
            "result": "$1/2$",
            "why": "subtract"
          },
          {
            "do": "Check in the map",
            "result": "$2(1/2)(1-1/2)=1/2$",
            "why": "substitute back"
          },
          {
            "do": "State the fixed point",
            "result": "$0.5$",
            "why": "the value repeats"
          }
        ],
        "answer": "The nonzero fixed point is $0.5$."
      },
      {
        "problem": "Compute three iterates for $r=3$, $x_0=0.2$.",
        "steps": [
          {
            "do": "Compute $x_1$",
            "result": "$3(0.2)(0.8)=0.48$",
            "why": "apply the map"
          },
          {
            "do": "Compute $x_2$",
            "result": "$3(0.48)(0.52)=0.7488$",
            "why": "feed back $x_1$"
          },
          {
            "do": "Compute $x_3$",
            "result": "$3(0.7488)(0.2512)$",
            "why": "feed back $x_2$"
          },
          {
            "do": "Multiply",
            "result": "$x_3\\approx0.5643$",
            "why": "$0.7488\\cdot0.2512\\cdot3\\approx0.5643$"
          },
          {
            "do": "Interpret",
            "result": "values remain in $[0,1]$",
            "why": "$r=3$ preserves the interval"
          }
        ],
        "answer": "The iterates are $0.48$, $0.7488$, and about $0.5643$."
      },
      {
        "problem": "At $r=3.2$, test stability of the nonzero fixed point.",
        "steps": [
          {
            "do": "Find the fixed point",
            "result": "$x^\\ast=1-1/3.2=0.6875$",
            "why": "use the formula"
          },
          {
            "do": "Use derivative shortcut",
            "result": "$F'(x^\\ast)=2-r$",
            "why": "substitute $x^\\ast=1-1/r$ into $r(1-2x)$"
          },
          {
            "do": "Substitute $r=3.2$",
            "result": "$2-3.2=-1.2$",
            "why": "compute the multiplier"
          },
          {
            "do": "Take absolute value",
            "result": "$1.2>1$",
            "why": "errors grow"
          },
          {
            "do": "Classify",
            "result": "repelling",
            "why": "the fixed point has lost stability"
          }
        ],
        "answer": "The nonzero fixed point is repelling at $r=3.2$."
      },
      {
        "problem": "Find all fixed points when $r=4$.",
        "steps": [
          {
            "do": "Set $x=4x(1-x)$",
            "result": "fixed-point equation",
            "why": "same value after one step"
          },
          {
            "do": "Move all terms to one side",
            "result": "$0=3x-4x^2$",
            "why": "subtract $x$"
          },
          {
            "do": "Factor",
            "result": "$0=x(3-4x)$",
            "why": "common factor $x$"
          },
          {
            "do": "Solve first factor",
            "result": "$x=0$",
            "why": "zero-product property"
          },
          {
            "do": "Solve second factor",
            "result": "$x=3/4$",
            "why": "$3-4x=0$"
          }
        ],
        "answer": "The fixed points are $0$ and $3/4$."
      },
      {
        "problem": "A population fraction follows $x_{n+1}=2.8x_n(1-x_n)$ from $x_0=0.1$. Compute $x_1$ and $x_2$.",
        "steps": [
          {
            "do": "Compute $x_1$",
            "result": "$2.8(0.1)(0.9)$",
            "why": "apply the logistic rule"
          },
          {
            "do": "Simplify $x_1$",
            "result": "$0.252$",
            "why": "$2.8\\cdot0.09=0.252$"
          },
          {
            "do": "Compute $1-x_1$",
            "result": "$0.748$",
            "why": "needed for the next step"
          },
          {
            "do": "Compute $x_2$",
            "result": "$2.8(0.252)(0.748)$",
            "why": "apply the rule again"
          },
          {
            "do": "Multiply",
            "result": "$x_2\\approx0.5278$",
            "why": "$0.252\\cdot0.748\\cdot2.8\\approx0.5278$"
          }
        ],
        "answer": "$x_1=0.252$ and $x_2\\approx0.5278$."
      }
    ],
    "applications": [
      {
        "title": "Iterated algorithms",
        "background": "Many algorithms are maps: the next estimate is computed from the current estimate.",
        "numbers": "Newton-style updates producing $2.0,1.5,1.4167$ are discrete iterates indexed by step."
      },
      {
        "title": "Simulation step size",
        "background": "Numerical solvers turn continuous systems into discrete maps, so stability can depend on the time step.",
        "numbers": "Euler on $\\dot{x}=-x$ gives $x_{n+1}=(1-h)x_n$; with $h=0.1$, the multiplier is $0.9$."
      },
      {
        "title": "Population fractions",
        "background": "Maps are natural when generations do not overlap or updates happen in batches.",
        "numbers": "A fraction $0.3$ updated by $2(0.3)(0.7)$ becomes $0.42$."
      },
      {
        "title": "Optimizer updates",
        "background": "Training loops are discrete dynamical systems on parameters.",
        "numbers": "If $w_{k+1}=0.8w_k$ and $w_0=5$, then $w_4=0.8^4\\cdot5=2.048$."
      },
      {
        "title": "Recurrent networks",
        "background": "RNN hidden states are repeatedly updated, so fixed points and cycles describe long-run memory.",
        "numbers": "With $h_{t+1}=0.6h_t+2$, the fixed point is $h=5$."
      },
      {
        "title": "Digital filters",
        "background": "Signal smoothing uses recurrence relations that must be stable to avoid runaway outputs.",
        "numbers": "For $y_{n+1}=0.9y_n+0.1x_n$, an old impulse has weight $0.9^{10}\\approx0.349$ after 10 steps."
      }
    ],
    "applicationsClose": "Across these examples, the same question keeps returning: what happens when the rule is applied again and again?",
    "takeaways": [
      "Iterating a rule creates a discrete dynamical system.",
      "Fixed points and cycles are long-run patterns of repeated updates.",
      "Derivative or multiplier magnitudes below $1$ shrink local errors.",
      "ML training loops and recurrent states use the same stability logic."
    ]
  },
  "math-25-16": {
    "id": "math-25-16",
    "title": "Period doubling",
    "tagline": "Period doubling is the route where one stable rhythm becomes two, then four, then a cascade toward chaos.",
    "connections": {
      "buildsOn": [
        "logistic map",
        "fixed-point multipliers",
        "composition of maps"
      ],
      "leadsTo": [
        "chaos and sensitive dependence",
        "Feigenbaum scaling",
        "bifurcation diagrams"
      ],
      "usedWith": [
        "fixed points",
        "derivatives",
        "linearization",
        "eigenvalues"
      ]
    },
    "motivation": "<p>A stable fixed point is a rhythm of length one: same state every step. Sometimes changing a parameter makes that rhythm alternate between two values instead.</p><p>That first flip is called period doubling. Repeated flips, from period $1$ to $2$ to $4$ to $8$, are one of the clearest roads from order to chaos.</p>",
    "definition": "<p>For a map $x_{n+1}=F_r(x_n)$, a <b>period-2 orbit</b> satisfies $F_r(F_r(x))=x$ but $F_r(x)\\ne x$. <b>Period doubling</b> occurs when a stable period-$k$ orbit loses stability and a stable period-$2k$ orbit appears as a parameter changes.</p><p>The multiplier of a period-$k$ orbit is the product of derivatives around the orbit. Stability requires the absolute value of that product to be below $1$. A flip bifurcation typically occurs when the multiplier passes through $-1$, causing alternating errors to stop shrinking.</p><p><b>Assumptions that matter:</b> we are studying iterated maps; period means the smallest repeating step count; derivative products describe local stability; and period doubling is common but not the only route to chaos.</p>",
    "worked": {
      "problem": "For a period-2 orbit with derivatives $F'(a)=-0.4$ and $F'(b)=1.5$, decide whether the 2-cycle is stable.",
      "skills": [
        "cycle multipliers",
        "derivative products",
        "stability"
      ],
      "strategy": "A two-cycle returns after two steps, so multiply the two local slopes.",
      "steps": [
        {
          "do": "Write the multiplier",
          "result": "$m=F'(a)F'(b)$",
          "why": "derivatives multiply around a cycle"
        },
        {
          "do": "Substitute values",
          "result": "$m=(-0.4)(1.5)$",
          "why": "use the two slopes"
        },
        {
          "do": "Multiply",
          "result": "$m=-0.6$",
          "why": "compute the product"
        },
        {
          "do": "Take absolute value",
          "result": "$|m|=0.6$",
          "why": "stability uses magnitude"
        },
        {
          "do": "Compare with $1$",
          "result": "$0.6<1$",
          "why": "errors shrink every two steps"
        },
        {
          "do": "Classify",
          "result": "stable period-2 orbit",
          "why": "nearby states approach the alternating pair"
        }
      ],
      "verify": "The sign indicates alternation, but the magnitude below one indicates shrinking over full cycles.",
      "answer": "The 2-cycle is stable.",
      "connects": "Period doubling is stability bookkeeping over repeated returns."
    },
    "practice": [
      {
        "problem": "A fixed point multiplier changes from $-0.8$ to $-1.2$. What happens to local stability?",
        "steps": [
          {
            "do": "Check the first magnitude",
            "result": "$|-0.8|=0.8$",
            "why": "before the change"
          },
          {
            "do": "Classify the first case",
            "result": "stable",
            "why": "$0.8<1$"
          },
          {
            "do": "Check the second magnitude",
            "result": "$|-1.2|=1.2$",
            "why": "after the change"
          },
          {
            "do": "Classify the second case",
            "result": "unstable",
            "why": "$1.2>1$"
          },
          {
            "do": "Connect to period doubling",
            "result": "crossing $-1$ suggests a flip",
            "why": "alternating errors stop shrinking"
          }
        ],
        "answer": "The fixed point changes from stable to unstable, consistent with a period-doubling flip."
      },
      {
        "problem": "For a 2-cycle with slopes $0.5$ and $0.5$, classify it.",
        "steps": [
          {
            "do": "Multiply slopes",
            "result": "$m=0.5\\cdot0.5$",
            "why": "cycle multiplier"
          },
          {
            "do": "Simplify",
            "result": "$m=0.25$",
            "why": "product"
          },
          {
            "do": "Take magnitude",
            "result": "$|m|=0.25$",
            "why": "stability test"
          },
          {
            "do": "Compare with $1$",
            "result": "$0.25<1$",
            "why": "errors shrink every cycle"
          },
          {
            "do": "Classify",
            "result": "stable",
            "why": "nearby points approach the 2-cycle"
          }
        ],
        "answer": "The 2-cycle is stable."
      },
      {
        "problem": "For a 4-cycle with slopes $-0.5,1.1,-0.8,0.6$, classify it.",
        "steps": [
          {
            "do": "Write the product",
            "result": "$m=(-0.5)(1.1)(-0.8)(0.6)$",
            "why": "multiply around the orbit"
          },
          {
            "do": "Multiply first pair",
            "result": "$(-0.5)(1.1)=-0.55$",
            "why": "partial product"
          },
          {
            "do": "Multiply next factor",
            "result": "$(-0.55)(-0.8)=0.44$",
            "why": "partial product"
          },
          {
            "do": "Multiply final factor",
            "result": "$0.44\\cdot0.6=0.264$",
            "why": "cycle multiplier"
          },
          {
            "do": "Classify",
            "result": "stable",
            "why": "$|0.264|<1$"
          }
        ],
        "answer": "The 4-cycle is stable."
      },
      {
        "problem": "Starting from period $1$, list periods after four doublings.",
        "steps": [
          {
            "do": "First doubling",
            "result": "$1\\to2$",
            "why": "double the period"
          },
          {
            "do": "Second doubling",
            "result": "$2\\to4$",
            "why": "double again"
          },
          {
            "do": "Third doubling",
            "result": "$4\\to8$",
            "why": "double again"
          },
          {
            "do": "Fourth doubling",
            "result": "$8\\to16$",
            "why": "double again"
          },
          {
            "do": "List the sequence",
            "result": "$1,2,4,8,16$",
            "why": "include the starting period"
          }
        ],
        "answer": "The periods are $1,2,4,8,16$."
      },
      {
        "problem": "A validation metric alternates $0.72,0.81,0.72,0.81$. What is its period, and what would period doubling look like next?",
        "steps": [
          {
            "do": "Identify the repeating block",
            "result": "$0.72,0.81$",
            "why": "the two values repeat"
          },
          {
            "do": "Count the block length",
            "result": "$2$",
            "why": "two steps complete one pattern"
          },
          {
            "do": "State the period",
            "result": "period $2$",
            "why": "assuming the two values are distinct"
          },
          {
            "do": "Double the period",
            "result": "$2\\to4$",
            "why": "next period doubling"
          },
          {
            "do": "Describe a possible pattern",
            "result": "$a,b,c,d,a,b,c,d$",
            "why": "four distinct values would repeat"
          }
        ],
        "answer": "The observed period is $2$; another doubling would create a period-$4$ pattern."
      }
    ],
    "applications": [
      {
        "title": "Iterated algorithms",
        "background": "Many algorithms are maps: the next estimate is computed from the current estimate.",
        "numbers": "Newton-style updates producing $2.0,1.5,1.4167$ are discrete iterates indexed by step."
      },
      {
        "title": "Simulation step size",
        "background": "Numerical solvers turn continuous systems into discrete maps, so stability can depend on the time step.",
        "numbers": "Euler on $\\dot{x}=-x$ gives $x_{n+1}=(1-h)x_n$; with $h=0.1$, the multiplier is $0.9$."
      },
      {
        "title": "Population fractions",
        "background": "Maps are natural when generations do not overlap or updates happen in batches.",
        "numbers": "A fraction $0.3$ updated by $2(0.3)(0.7)$ becomes $0.42$."
      },
      {
        "title": "Optimizer updates",
        "background": "Training loops are discrete dynamical systems on parameters.",
        "numbers": "If $w_{k+1}=0.8w_k$ and $w_0=5$, then $w_4=0.8^4\\cdot5=2.048$."
      },
      {
        "title": "Recurrent networks",
        "background": "RNN hidden states are repeatedly updated, so fixed points and cycles describe long-run memory.",
        "numbers": "With $h_{t+1}=0.6h_t+2$, the fixed point is $h=5$."
      },
      {
        "title": "Digital filters",
        "background": "Signal smoothing uses recurrence relations that must be stable to avoid runaway outputs.",
        "numbers": "For $y_{n+1}=0.9y_n+0.1x_n$, an old impulse has weight $0.9^{10}\\approx0.349$ after 10 steps."
      }
    ],
    "applicationsClose": "Across these examples, the same question keeps returning: what happens when the rule is applied again and again?",
    "takeaways": [
      "Iterating a rule creates a discrete dynamical system.",
      "Fixed points and cycles are long-run patterns of repeated updates.",
      "Derivative or multiplier magnitudes below $1$ shrink local errors.",
      "ML training loops and recurrent states use the same stability logic."
    ]
  },
  "math-25-17": {
    "id": "math-25-17",
    "title": "Chaos and sensitive dependence",
    "tagline": "Chaos means deterministic rules can amplify tiny differences until prediction becomes fragile.",
    "connections": {
      "buildsOn": [
        "period doubling",
        "Lyapunov exponents",
        "bounded maps"
      ],
      "leadsTo": [
        "strange attractors",
        "fractals",
        "forecast limits"
      ],
      "usedWith": [
        "fixed points",
        "derivatives",
        "linearization",
        "eigenvalues"
      ]
    },
    "motivation": "<p>It is tempting to think deterministic means predictable forever. If the rule has no randomness, surely the future is fixed. It is fixed, but it may not be practically knowable.</p><p><b>Chaos</b> appears when nearby initial states separate rapidly while the motion remains bounded and structured. Sensitive dependence is the part you feel first: a tiny measurement error can become a large forecast error.</p>",
    "definition": "<p>A dynamical system has <b>sensitive dependence on initial conditions</b> if arbitrarily close starting states eventually separate by a noticeable amount. A common quantitative measure is a positive <b>Lyapunov exponent</b> $\\lambda$, where small errors grow roughly like $|\\delta_n|\\approx e^{\\lambda n}|\\delta_0|$ for discrete time.</p><p>This estimate comes from repeated linearization. Each step multiplies a small error by a local slope; over many steps, products of slopes turn into sums of logarithms. A positive average logarithmic growth rate means exponential error growth.</p><p><b>Assumptions that matter:</b> chaos is not mere randomness; the system is deterministic; boundedness keeps trajectories from simply escaping; and a positive Lyapunov exponent describes typical local error growth, not exact separation at every step.</p>",
    "worked": {
      "problem": "If two initial errors differ by $\\delta_0=10^{-6}$ and grow like $e^{0.7n}\\delta_0$, estimate the error after $10$ steps.",
      "skills": [
        "Lyapunov exponent",
        "exponential growth",
        "forecast horizon"
      ],
      "strategy": "Use the exponential error model and compare the result with the initial error.",
      "steps": [
        {
          "do": "Write the model",
          "result": "$\\delta_{10}=e^{0.7\\cdot10}10^{-6}$",
          "why": "substitute $n=10$"
        },
        {
          "do": "Multiply the exponent",
          "result": "$0.7\\cdot10=7$",
          "why": "compute growth exponent"
        },
        {
          "do": "Use $e^7\\approx1096.6$",
          "result": "$\\delta_{10}\\approx1096.6\\cdot10^{-6}$",
          "why": "evaluate the exponential"
        },
        {
          "do": "Simplify",
          "result": "$\\delta_{10}\\approx0.00110$",
          "why": "move the decimal"
        },
        {
          "do": "Compute amplification",
          "result": "$0.00110/10^{-6}\\approx1096.6$",
          "why": "compare final to initial"
        }
      ],
      "verify": "A millionth becoming about one thousandth is a large practical loss of precision.",
      "answer": "After $10$ steps the error is about $0.00110$.",
      "connects": "Sensitive dependence is exponential error growth made visible."
    },
    "practice": [
      {
        "problem": "An error doubles each step from $0.001$. What is it after $8$ steps?",
        "steps": [
          {
            "do": "Write the model",
            "result": "$\\delta_8=0.001\\cdot2^8$",
            "why": "doubling means multiply by $2^8$"
          },
          {
            "do": "Compute the power",
            "result": "$2^8=256$",
            "why": "eight doublings"
          },
          {
            "do": "Multiply",
            "result": "$0.001\\cdot256=0.256$",
            "why": "scale the initial error"
          },
          {
            "do": "Compare to start",
            "result": "$0.256/0.001=256$",
            "why": "amplification factor"
          },
          {
            "do": "Interpret",
            "result": "prediction is much less precise",
            "why": "the uncertainty grew strongly"
          }
        ],
        "answer": "The error is $0.256$."
      },
      {
        "problem": "With Lyapunov exponent $\\lambda=0.2$, how many steps until an error is multiplied by about $e^2$?",
        "steps": [
          {
            "do": "Set the exponent",
            "result": "$0.2n=2$",
            "why": "growth factor $e^{\\lambda n}$"
          },
          {
            "do": "Solve for $n$",
            "result": "$n=10$",
            "why": "divide by $0.2$"
          },
          {
            "do": "Compute the factor",
            "result": "$e^2\\approx7.389$",
            "why": "interpret growth"
          },
          {
            "do": "Check",
            "result": "$e^{0.2\\cdot10}=e^2$",
            "why": "substitute back"
          },
          {
            "do": "State the time",
            "result": "10 steps",
            "why": "integer step count"
          }
        ],
        "answer": "It takes $10$ steps."
      },
      {
        "problem": "For the map $F(x)=4x(1-x)$, compute the local error multiplier at $x=0.25$.",
        "steps": [
          {
            "do": "Differentiate",
            "result": "$F'(x)=4(1-2x)$",
            "why": "derivative of the logistic map"
          },
          {
            "do": "Substitute $x=0.25$",
            "result": "$F'(0.25)=4(1-0.5)$",
            "why": "evaluate the slope"
          },
          {
            "do": "Simplify",
            "result": "$F'(0.25)=2$",
            "why": "local multiplier"
          },
          {
            "do": "Interpret magnitude",
            "result": "$|2|>1$",
            "why": "nearby errors initially grow"
          },
          {
            "do": "State local effect",
            "result": "small separations double approximately",
            "why": "linearization near the point"
          }
        ],
        "answer": "The local error multiplier is $2$."
      },
      {
        "problem": "If measurement precision is $10^{-4}$ and errors grow by factor $3$ per step, when do they exceed $0.1$?",
        "steps": [
          {
            "do": "Write inequality",
            "result": "$10^{-4}3^n>0.1$",
            "why": "growth model"
          },
          {
            "do": "Divide by $10^{-4}$",
            "result": "$3^n>1000$",
            "why": "isolate the power"
          },
          {
            "do": "Compare powers",
            "result": "$3^6=729$",
            "why": "six steps is not enough"
          },
          {
            "do": "Compute next power",
            "result": "$3^7=2187$",
            "why": "seven steps exceeds 1000"
          },
          {
            "do": "State horizon",
            "result": "$7$ steps",
            "why": "first step count exceeding the threshold"
          }
        ],
        "answer": "The error exceeds $0.1$ after $7$ steps."
      },
      {
        "problem": "Two training runs start with losses differing by $0.0001$. After $12$ chaotic updates the difference is $0.4096$. What average per-step factor does this match if it is a power of $2$?",
        "steps": [
          {
            "do": "Compute amplification",
            "result": "$0.4096/0.0001=4096$",
            "why": "final difference over initial difference"
          },
          {
            "do": "Recognize the power",
            "result": "$4096=2^{12}$",
            "why": "standard power of two"
          },
          {
            "do": "Relate to steps",
            "result": "$12$ steps",
            "why": "given update count"
          },
          {
            "do": "Find per-step factor",
            "result": "$2$",
            "why": "$2^{12}$ over 12 steps"
          },
          {
            "do": "Interpret",
            "result": "differences doubled each step on average",
            "why": "sensitive dependence in update space"
          }
        ],
        "answer": "It matches an average factor of $2$ per step."
      }
    ],
    "applications": [
      {
        "title": "Iterated algorithms",
        "background": "Many algorithms are maps: the next estimate is computed from the current estimate.",
        "numbers": "Newton-style updates producing $2.0,1.5,1.4167$ are discrete iterates indexed by step."
      },
      {
        "title": "Simulation step size",
        "background": "Numerical solvers turn continuous systems into discrete maps, so stability can depend on the time step.",
        "numbers": "Euler on $\\dot{x}=-x$ gives $x_{n+1}=(1-h)x_n$; with $h=0.1$, the multiplier is $0.9$."
      },
      {
        "title": "Population fractions",
        "background": "Maps are natural when generations do not overlap or updates happen in batches.",
        "numbers": "A fraction $0.3$ updated by $2(0.3)(0.7)$ becomes $0.42$."
      },
      {
        "title": "Optimizer updates",
        "background": "Training loops are discrete dynamical systems on parameters.",
        "numbers": "If $w_{k+1}=0.8w_k$ and $w_0=5$, then $w_4=0.8^4\\cdot5=2.048$."
      },
      {
        "title": "Recurrent networks",
        "background": "RNN hidden states are repeatedly updated, so fixed points and cycles describe long-run memory.",
        "numbers": "With $h_{t+1}=0.6h_t+2$, the fixed point is $h=5$."
      },
      {
        "title": "Digital filters",
        "background": "Signal smoothing uses recurrence relations that must be stable to avoid runaway outputs.",
        "numbers": "For $y_{n+1}=0.9y_n+0.1x_n$, an old impulse has weight $0.9^{10}\\approx0.349$ after 10 steps."
      }
    ],
    "applicationsClose": "Across these examples, the same question keeps returning: what happens when the rule is applied again and again?",
    "takeaways": [
      "Iterating a rule creates a discrete dynamical system.",
      "Fixed points and cycles are long-run patterns of repeated updates.",
      "Derivative or multiplier magnitudes below $1$ shrink local errors.",
      "ML training loops and recurrent states use the same stability logic."
    ]
  },
  "math-25-18": {
    "id": "math-25-18",
    "title": "Strange attractors",
    "tagline": "A strange attractor pulls trajectories into a bounded set with folded, fractal-like structure.",
    "connections": {
      "buildsOn": [
        "chaos and sensitive dependence",
        "attractors",
        "phase space"
      ],
      "leadsTo": [
        "fractals",
        "ergodic ideas",
        "chaotic time series"
      ],
      "usedWith": [
        "fixed points",
        "derivatives",
        "linearization",
        "eigenvalues"
      ]
    },
    "motivation": "<p>You know an attractor can be a point or a loop. In chaotic systems, the long-run destination can be neither: trajectories stay bounded, never settle, and trace a delicate folded shape.</p><p>That object is a <b>strange attractor</b>. It attracts nearby states like a stable object, but motion on it remains sensitive and richly structured.</p>",
    "definition": "<p>A <b>strange attractor</b> is an attracting invariant set with complicated geometry, often fractal structure, and sensitive dependence on initial conditions. Invariance means that once a trajectory is on the set, the dynamics keep it on the set. Attraction means nearby trajectories approach the set over time.</p><p>The folding-and-stretching picture explains the paradox. Stretching separates nearby states, while folding keeps the set bounded. Repeating both operations creates layered structure: never escaping, never becoming a simple curve.</p><p><b>Assumptions that matter:</b> precise definitions vary across texts; attraction is judged for a basin of nearby initial states; sensitive dependence is behavior on the attractor; and numerical plots are approximations, not the attractor itself.</p>",
    "worked": {
      "problem": "A process stretches distances by $3$ and then folds them back into a bounded region each step. If two nearby points begin $0.0002$ apart, what is their separation after $5$ stretch phases before folding?",
      "skills": [
        "stretching",
        "boundedness",
        "chaotic amplification"
      ],
      "strategy": "Separate the local stretching calculation from the global folding that keeps motion bounded.",
      "steps": [
        {
          "do": "Write the stretch model",
          "result": "$d_5=0.0002\\cdot3^5$",
          "why": "each step triples local distance"
        },
        {
          "do": "Compute the power",
          "result": "$3^5=243$",
          "why": "five stretches"
        },
        {
          "do": "Multiply",
          "result": "$d_5=0.0486$",
          "why": "$0.0002\\cdot243$"
        },
        {
          "do": "Describe folding",
          "result": "the region remains bounded",
          "why": "folding prevents unlimited escape"
        },
        {
          "do": "Connect both effects",
          "result": "stretching plus folding",
          "why": "this combination supports strange attractors"
        }
      ],
      "verify": "The local separation grows, but folding is why the long-run set can stay finite.",
      "answer": "Before folding limits the geometry, the separation is $0.0486$.",
      "connects": "A strange attractor is organized by repeated stretching and folding."
    },
    "practice": [
      {
        "problem": "A bounded attractor lies in $0\\le x\\le2$, $0\\le y\\le3$. What rectangle contains it and what is the area?",
        "steps": [
          {
            "do": "Read the $x$ bounds",
            "result": "width $=2-0=2$",
            "why": "horizontal span"
          },
          {
            "do": "Read the $y$ bounds",
            "result": "height $=3-0=3$",
            "why": "vertical span"
          },
          {
            "do": "Write the rectangle",
            "result": "$[0,2]\\times[0,3]$",
            "why": "combine coordinate bounds"
          },
          {
            "do": "Compute area",
            "result": "$2\\cdot3=6$",
            "why": "rectangle area"
          },
          {
            "do": "Interpret boundedness",
            "result": "trajectories do not escape this box",
            "why": "attraction is to a contained set"
          }
        ],
        "answer": "The containing rectangle is $[0,2]\\times[0,3]$ with area $6$."
      },
      {
        "problem": "If distances grow by $e^{0.4t}$ on an attractor, estimate growth after $5$ time units.",
        "steps": [
          {
            "do": "Write the factor",
            "result": "$e^{0.4\\cdot5}$",
            "why": "use the exponent model"
          },
          {
            "do": "Multiply exponent",
            "result": "$2$",
            "why": "$0.4\\cdot5=2$"
          },
          {
            "do": "Evaluate",
            "result": "$e^2\\approx7.389$",
            "why": "standard approximation"
          },
          {
            "do": "Interpret",
            "result": "nearby distances grow about $7.4$ times",
            "why": "local sensitivity"
          },
          {
            "do": "Remember boundedness",
            "result": "growth cannot continue forever in raw distance",
            "why": "folding keeps the attractor bounded"
          }
        ],
        "answer": "The local growth factor is about $7.389$."
      },
      {
        "problem": "A simulation approaches an attractor: distances to the plotted set are $1.0,0.5,0.25,0.125$. What factor shrinks each step?",
        "steps": [
          {
            "do": "Compare first two",
            "result": "$0.5/1.0=0.5$",
            "why": "first shrink"
          },
          {
            "do": "Compare next two",
            "result": "$0.25/0.5=0.5$",
            "why": "second shrink"
          },
          {
            "do": "Compare final pair",
            "result": "$0.125/0.25=0.5$",
            "why": "third shrink"
          },
          {
            "do": "State the factor",
            "result": "$0.5$",
            "why": "consistent ratio"
          },
          {
            "do": "Interpret",
            "result": "distance halves each step",
            "why": "attraction toward the set"
          }
        ],
        "answer": "The distance-to-attractor shrinks by factor $0.5$ each step."
      },
      {
        "problem": "Why is a stable limit cycle not usually called strange?",
        "steps": [
          {
            "do": "Identify the geometry",
            "result": "a smooth closed curve",
            "why": "a limit cycle is one-dimensional and regular"
          },
          {
            "do": "Identify sensitivity",
            "result": "nearby phase errors do not typically grow chaotically",
            "why": "motion is predictable up to phase"
          },
          {
            "do": "Compare with strange attractors",
            "result": "fractal-like folded structure",
            "why": "strange geometry is more complicated"
          },
          {
            "do": "Compare dynamics",
            "result": "sensitive dependence on the attractor",
            "why": "strange attractors amplify nearby differences"
          },
          {
            "do": "State the distinction",
            "result": "attracting is not enough",
            "why": "strangeness adds geometry and sensitivity"
          }
        ],
        "answer": "A limit cycle attracts, but it lacks the fractal-like geometry and sensitive dependence typical of strange attractors."
      },
      {
        "problem": "A hidden-state model remains bounded with $\\|h_t\\|\\le5$ but nearby states separate from $0.001$ to $1.024$ after $10$ steps. What factor per step is suggested?",
        "steps": [
          {
            "do": "Compute amplification",
            "result": "$1.024/0.001=1024$",
            "why": "final over initial"
          },
          {
            "do": "Recognize the power",
            "result": "$1024=2^{10}$",
            "why": "power of two"
          },
          {
            "do": "Use the step count",
            "result": "10 steps",
            "why": "given duration"
          },
          {
            "do": "Find per-step factor",
            "result": "$2$",
            "why": "$2^{10}$ over ten steps"
          },
          {
            "do": "Interpret with boundedness",
            "result": "stretching happens inside a bounded region",
            "why": "a strange-attractor-like warning sign"
          }
        ],
        "answer": "The suggested per-step separation factor is $2$."
      }
    ],
    "applications": [
      {
        "title": "Iterated algorithms",
        "background": "Many algorithms are maps: the next estimate is computed from the current estimate.",
        "numbers": "Newton-style updates producing $2.0,1.5,1.4167$ are discrete iterates indexed by step."
      },
      {
        "title": "Simulation step size",
        "background": "Numerical solvers turn continuous systems into discrete maps, so stability can depend on the time step.",
        "numbers": "Euler on $\\dot{x}=-x$ gives $x_{n+1}=(1-h)x_n$; with $h=0.1$, the multiplier is $0.9$."
      },
      {
        "title": "Population fractions",
        "background": "Maps are natural when generations do not overlap or updates happen in batches.",
        "numbers": "A fraction $0.3$ updated by $2(0.3)(0.7)$ becomes $0.42$."
      },
      {
        "title": "Optimizer updates",
        "background": "Training loops are discrete dynamical systems on parameters.",
        "numbers": "If $w_{k+1}=0.8w_k$ and $w_0=5$, then $w_4=0.8^4\\cdot5=2.048$."
      },
      {
        "title": "Recurrent networks",
        "background": "RNN hidden states are repeatedly updated, so fixed points and cycles describe long-run memory.",
        "numbers": "With $h_{t+1}=0.6h_t+2$, the fixed point is $h=5$."
      },
      {
        "title": "Digital filters",
        "background": "Signal smoothing uses recurrence relations that must be stable to avoid runaway outputs.",
        "numbers": "For $y_{n+1}=0.9y_n+0.1x_n$, an old impulse has weight $0.9^{10}\\approx0.349$ after 10 steps."
      }
    ],
    "applicationsClose": "Across these examples, the same question keeps returning: what happens when the rule is applied again and again?",
    "takeaways": [
      "Iterating a rule creates a discrete dynamical system.",
      "Fixed points and cycles are long-run patterns of repeated updates.",
      "Derivative or multiplier magnitudes below $1$ shrink local errors.",
      "ML training loops and recurrent states use the same stability logic."
    ]
  },
  "math-25-19": {
    "id": "math-25-19",
    "title": "Fractals",
    "tagline": "Fractals are shapes whose detail persists across scales, often with non-integer dimension.",
    "connections": {
      "buildsOn": [
        "self-similarity",
        "logarithms",
        "strange attractors"
      ],
      "leadsTo": [
        "fractal dimension",
        "multiscale modeling",
        "chaotic boundaries"
      ],
      "usedWith": [
        "fixed points",
        "derivatives",
        "linearization",
        "eigenvalues"
      ]
    },
    "motivation": "<p>You already know ordinary dimensions: a line is one-dimensional, a square is two-dimensional. But some shapes are too crinkly to fit cleanly into those categories.</p><p><b>Fractals</b> describe patterns whose detail repeats or persists as you zoom in. They appear in chaotic attractors, branching networks, image compression, and the rough boundaries of many natural objects.</p>",
    "definition": "<p>A self-similar fractal is built from $N$ smaller copies of itself, each scaled by a factor $s$ in length. Its similarity dimension is $D=\\dfrac{\\log N}{\\log(1/s)}$ when the copies fit the ideal self-similar assumptions.</p><p>The formula comes from matching scale. A one-dimensional line split into two half-size copies has $2=(1/(1/2))^1$. A square split into four half-size copies has $4=(1/(1/2))^2$. Solving $N=(1/s)^D$ gives $D=\\log N/\\log(1/s)$.</p><p><b>Assumptions that matter:</b> exact similarity dimension assumes ideal self-similarity; real data only show scaling over a finite range; different fractal dimensions exist; and a fractal is not automatically chaotic, though chaos often creates fractal sets.</p>",
    "worked": {
      "problem": "Compute the similarity dimension of the Cantor set, built from $2$ copies scaled by $1/3$.",
      "skills": [
        "self-similarity",
        "logarithms",
        "dimension"
      ],
      "strategy": "Use $D=\\log N/\\log(1/s)$ with the copy count and scale factor.",
      "steps": [
        {
          "do": "Identify the number of copies",
          "result": "$N=2$",
          "why": "two remaining thirds"
        },
        {
          "do": "Identify the scale",
          "result": "$s=1/3$",
          "why": "each copy is one third as long"
        },
        {
          "do": "Compute the denominator",
          "result": "$\\log(1/s)=\\log3$",
          "why": "because $1/(1/3)=3$"
        },
        {
          "do": "Write the dimension",
          "result": "$D=\\log2/\\log3$",
          "why": "substitute into the formula"
        },
        {
          "do": "Approximate",
          "result": "$D\\approx0.631$",
          "why": "using natural or common logs gives the same ratio"
        }
      ],
      "verify": "The dimension lies between $0$ and $1$, matching a dust-like set richer than points but thinner than a line.",
      "answer": "The Cantor set has similarity dimension $\\log2/\\log3\\approx0.631$.",
      "connects": "Fractal dimension measures how detail scales, not just how a shape looks."
    },
    "practice": [
      {
        "problem": "Find the dimension of a line segment split into $2$ copies scaled by $1/2$.",
        "steps": [
          {
            "do": "Identify copies",
            "result": "$N=2$",
            "why": "two halves"
          },
          {
            "do": "Identify scale",
            "result": "$s=1/2$",
            "why": "each copy half-size"
          },
          {
            "do": "Compute denominator",
            "result": "$\\log(1/s)=\\log2$",
            "why": "reciprocal scale"
          },
          {
            "do": "Form the ratio",
            "result": "$D=\\log2/\\log2$",
            "why": "substitute"
          },
          {
            "do": "Simplify",
            "result": "$D=1$",
            "why": "a line is one-dimensional"
          }
        ],
        "answer": "The dimension is $1$."
      },
      {
        "problem": "Find the dimension of a square split into $4$ copies scaled by $1/2$.",
        "steps": [
          {
            "do": "Identify copies",
            "result": "$N=4$",
            "why": "four smaller squares"
          },
          {
            "do": "Identify scale",
            "result": "$s=1/2$",
            "why": "half-size copies"
          },
          {
            "do": "Write the ratio",
            "result": "$D=\\log4/\\log2$",
            "why": "similarity dimension"
          },
          {
            "do": "Use $4=2^2$",
            "result": "$\\log4=2\\log2$",
            "why": "log rule"
          },
          {
            "do": "Simplify",
            "result": "$D=2$",
            "why": "a square is two-dimensional"
          }
        ],
        "answer": "The dimension is $2$."
      },
      {
        "problem": "Find the Sierpinski triangle dimension with $3$ copies scaled by $1/2$.",
        "steps": [
          {
            "do": "Identify copies",
            "result": "$N=3$",
            "why": "three corner triangles"
          },
          {
            "do": "Identify scale",
            "result": "$s=1/2$",
            "why": "each copy half-size"
          },
          {
            "do": "Write dimension",
            "result": "$D=\\log3/\\log2$",
            "why": "substitute"
          },
          {
            "do": "Approximate logs",
            "result": "$D\\approx1.099/0.693$",
            "why": "natural log values"
          },
          {
            "do": "Divide",
            "result": "$D\\approx1.585$",
            "why": "between line and area"
          }
        ],
        "answer": "The dimension is $\\log3/\\log2\\approx1.585$."
      },
      {
        "problem": "A coastline estimate uses box sizes $1$, $1/2$, $1/4$ with counts $10$, $18$, $32$. Estimate dimension from first and last scales.",
        "steps": [
          {
            "do": "Compute count ratio",
            "result": "$32/10=3.2$",
            "why": "change in boxes"
          },
          {
            "do": "Compute scale ratio",
            "result": "$1/(1/4)=4$",
            "why": "finest boxes are four times smaller"
          },
          {
            "do": "Use dimension estimate",
            "result": "$D\\approx\\log3.2/\\log4$",
            "why": "box-counting slope"
          },
          {
            "do": "Approximate",
            "result": "$D\\approx1.163/1.386$",
            "why": "natural logs"
          },
          {
            "do": "Divide",
            "result": "$D\\approx0.839$",
            "why": "finite data gives a rough estimate"
          }
        ],
        "answer": "The rough estimate from those two scales is $D\\approx0.839$."
      },
      {
        "problem": "An image pyramid halves width and height each level. If level 0 has $1024\\times1024$ pixels, how many pixels are at level 3?",
        "steps": [
          {
            "do": "Compute side scale after 3 levels",
            "result": "$1024/2^3$",
            "why": "halve three times"
          },
          {
            "do": "Simplify side length",
            "result": "$128$",
            "why": "$1024/8=128$"
          },
          {
            "do": "Compute pixel count",
            "result": "$128\\cdot128$",
            "why": "area in pixels"
          },
          {
            "do": "Multiply",
            "result": "$16384$",
            "why": "square 128"
          },
          {
            "do": "Compare to original",
            "result": "$16384/1048576=1/64$",
            "why": "area scales by $(1/2)^{6}$ over three levels"
          }
        ],
        "answer": "Level 3 has $128\\times128=16384$ pixels."
      }
    ],
    "applications": [
      {
        "title": "Iterated algorithms",
        "background": "Many algorithms are maps: the next estimate is computed from the current estimate.",
        "numbers": "Newton-style updates producing $2.0,1.5,1.4167$ are discrete iterates indexed by step."
      },
      {
        "title": "Simulation step size",
        "background": "Numerical solvers turn continuous systems into discrete maps, so stability can depend on the time step.",
        "numbers": "Euler on $\\dot{x}=-x$ gives $x_{n+1}=(1-h)x_n$; with $h=0.1$, the multiplier is $0.9$."
      },
      {
        "title": "Population fractions",
        "background": "Maps are natural when generations do not overlap or updates happen in batches.",
        "numbers": "A fraction $0.3$ updated by $2(0.3)(0.7)$ becomes $0.42$."
      },
      {
        "title": "Optimizer updates",
        "background": "Training loops are discrete dynamical systems on parameters.",
        "numbers": "If $w_{k+1}=0.8w_k$ and $w_0=5$, then $w_4=0.8^4\\cdot5=2.048$."
      },
      {
        "title": "Recurrent networks",
        "background": "RNN hidden states are repeatedly updated, so fixed points and cycles describe long-run memory.",
        "numbers": "With $h_{t+1}=0.6h_t+2$, the fixed point is $h=5$."
      },
      {
        "title": "Digital filters",
        "background": "Signal smoothing uses recurrence relations that must be stable to avoid runaway outputs.",
        "numbers": "For $y_{n+1}=0.9y_n+0.1x_n$, an old impulse has weight $0.9^{10}\\approx0.349$ after 10 steps."
      }
    ],
    "applicationsClose": "Across these examples, the same question keeps returning: what happens when the rule is applied again and again?",
    "takeaways": [
      "Iterating a rule creates a discrete dynamical system.",
      "Fixed points and cycles are long-run patterns of repeated updates.",
      "Derivative or multiplier magnitudes below $1$ shrink local errors.",
      "ML training loops and recurrent states use the same stability logic."
    ]
  },
  "math-25-20": {
    "id": "math-25-20",
    "title": "Training dynamics & RNN stability",
    "tagline": "Training and recurrent models are dynamical systems, so stability tells us when signals learn, vanish, explode, or oscillate.",
    "connections": {
      "buildsOn": [
        "discrete maps",
        "Lyapunov functions",
        "chaos and sensitive dependence"
      ],
      "leadsTo": [
        "stable architectures",
        "optimizer tuning",
        "sequence modeling"
      ],
      "usedWith": [
        "fixed points",
        "derivatives",
        "linearization",
        "eigenvalues"
      ]
    },
    "motivation": "<p>You have already studied maps, fixed points, Lyapunov functions, and sensitive dependence. ML uses the same ideas every day, sometimes under different names.</p><p>Gradient descent iterates parameters. Recurrent neural networks iterate hidden states. Stability decides whether errors shrink, gradients vanish, activations explode, or a model keeps a useful memory without blowing up.</p>",
    "definition": "<p>A simple training update is $w_{k+1}=w_k-\\eta\\nabla L(w_k)$, a discrete dynamical system on parameters. A simple linear RNN is $h_t=Wh_{t-1}+Ux_t$, and with zero input its stability is governed by repeated multiplication by $W$.</p><p>If $W$ has spectral radius $\\rho(W)<1$, then powers $W^t$ tend to shrink typical hidden states; if $\\rho(W)>1$, some directions can grow. In one dimension, $h_t=ah_{t-1}$ gives $h_t=a^t h_0$, so the whole story is visible: $|a|<1$ vanishes, $|a|>1$ explodes, and negative $a$ alternates signs.</p><p><b>Assumptions that matter:</b> nonlinear activations can saturate or clip growth; local linearization uses Jacobians; training stability depends on learning rate and curvature; and useful memory often requires being near stable, not blindly making every multiplier tiny.</p>",
    "worked": {
      "problem": "A one-dimensional RNN has $h_t=1.2h_{t-1}$ with $h_0=0.5$. Compute $h_5$ and decide whether the zero state is stable.",
      "skills": [
        "RNN recurrence",
        "powers",
        "stability"
      ],
      "strategy": "Repeated multiplication tells us both the hidden value and whether errors grow.",
      "steps": [
        {
          "do": "Write the closed form",
          "result": "$h_t=1.2^t h_0$",
          "why": "iterate the same multiplier"
        },
        {
          "do": "Substitute $t=5$",
          "result": "$h_5=1.2^5\\cdot0.5$",
          "why": "use the requested step"
        },
        {
          "do": "Compute the power",
          "result": "$1.2^5\\approx2.48832$",
          "why": "multiply five factors"
        },
        {
          "do": "Compute $h_5$",
          "result": "$h_5\\approx1.24416$",
          "why": "multiply by $0.5$"
        },
        {
          "do": "Check the multiplier magnitude",
          "result": "$|1.2|>1$",
          "why": "hidden differences grow"
        },
        {
          "do": "Classify zero state",
          "result": "unstable",
          "why": "small nonzero states move away"
        }
      ],
      "verify": "The hidden state more than doubles in five steps, so the instability is visible numerically.",
      "answer": "$h_5\\approx1.24416$, and the zero state is unstable.",
      "connects": "RNN stability is dynamical-systems stability in ML clothing."
    },
    "practice": [
      {
        "problem": "For $h_t=0.7h_{t-1}$ with $h_0=10$, compute $h_3$ and classify stability.",
        "steps": [
          {
            "do": "Write closed form",
            "result": "$h_3=0.7^3\\cdot10$",
            "why": "iterate the multiplier"
          },
          {
            "do": "Compute power",
            "result": "$0.7^3=0.343$",
            "why": "multiply"
          },
          {
            "do": "Compute value",
            "result": "$h_3=3.43$",
            "why": "multiply by 10"
          },
          {
            "do": "Check magnitude",
            "result": "$|0.7|<1$",
            "why": "states shrink"
          },
          {
            "do": "Classify",
            "result": "stable toward zero",
            "why": "hidden state decays"
          }
        ],
        "answer": "$h_3=3.43$, and zero is stable."
      },
      {
        "problem": "Gradient descent on $L(w)=\\frac12(4)w^2$ uses $w_{k+1}=w_k-\\eta4w_k$. For $\\eta=0.3$, find the multiplier and classify.",
        "steps": [
          {
            "do": "Write the update",
            "result": "$w_{k+1}=(1-4\\eta)w_k$",
            "why": "factor out $w_k$"
          },
          {
            "do": "Substitute $\\eta=0.3$",
            "result": "$1-4(0.3)$",
            "why": "compute multiplier"
          },
          {
            "do": "Simplify",
            "result": "$-0.2$",
            "why": "$1-1.2=-0.2$"
          },
          {
            "do": "Check magnitude",
            "result": "$|-0.2|<1$",
            "why": "errors shrink"
          },
          {
            "do": "Interpret sign",
            "result": "alternating but stable",
            "why": "negative multiplier flips signs"
          }
        ],
        "answer": "The multiplier is $-0.2$, so the update is stable with sign alternation."
      },
      {
        "problem": "For the same loss, test $\\eta=0.6$.",
        "steps": [
          {
            "do": "Use multiplier formula",
            "result": "$1-4\\eta$",
            "why": "from the quadratic gradient"
          },
          {
            "do": "Substitute $0.6$",
            "result": "$1-2.4$",
            "why": "compute"
          },
          {
            "do": "Simplify",
            "result": "$-1.4$",
            "why": "multiplier"
          },
          {
            "do": "Check magnitude",
            "result": "$1.4>1$",
            "why": "errors grow"
          },
          {
            "do": "Classify",
            "result": "unstable",
            "why": "the learning rate is too large"
          }
        ],
        "answer": "The multiplier is $-1.4$, so the update is unstable."
      },
      {
        "problem": "A diagonal recurrent matrix has eigenvalues $0.9$ and $1.1$. Which direction dominates after many steps?",
        "steps": [
          {
            "do": "Compare magnitudes",
            "result": "$|0.9|=0.9$, $|1.1|=1.1$",
            "why": "growth depends on magnitude"
          },
          {
            "do": "Classify first direction",
            "result": "decays",
            "why": "$0.9^t\\to0$"
          },
          {
            "do": "Classify second direction",
            "result": "grows",
            "why": "$1.1^t$ increases"
          },
          {
            "do": "Compute after 10 steps",
            "result": "$1.1^{10}\\approx2.594$",
            "why": "growth factor"
          },
          {
            "do": "State dominant direction",
            "result": "eigenvalue $1.1$ direction",
            "why": "it expands while the other decays"
          }
        ],
        "answer": "The eigenvalue $1.1$ direction dominates and can cause exploding hidden states."
      },
      {
        "problem": "A gradient norm is clipped from $12$ to maximum $5$. What scale factor is applied, and what is the new norm?",
        "steps": [
          {
            "do": "Write the scale",
            "result": "$5/12$",
            "why": "target norm over current norm"
          },
          {
            "do": "Approximate",
            "result": "$5/12\\approx0.4167$",
            "why": "decimal scale"
          },
          {
            "do": "Apply to the norm",
            "result": "$12\\cdot(5/12)$",
            "why": "scale the vector"
          },
          {
            "do": "Simplify",
            "result": "$5$",
            "why": "clipped norm"
          },
          {
            "do": "Interpret",
            "result": "direction is preserved while size is limited",
            "why": "clipping controls unstable updates"
          }
        ],
        "answer": "The gradient is scaled by $5/12\\approx0.4167$, giving new norm $5$."
      }
    ],
    "applications": [
      {
        "title": "Vanishing hidden states",
        "background": "When recurrent multipliers are below one, old information fades exponentially.",
        "numbers": "With multiplier $0.8$, a signal after $20$ steps has weight $0.8^{20}\\approx0.0115$."
      },
      {
        "title": "Exploding gradients",
        "background": "Backpropagation through time multiplies Jacobians repeatedly, so norms can grow fast.",
        "numbers": "A factor $1.2$ over $30$ steps gives $1.2^{30}\\approx237.4$."
      },
      {
        "title": "Learning-rate stability",
        "background": "Quadratic losses show why too-large learning rates oscillate or diverge.",
        "numbers": "For curvature $10$, gradient descent is stable when $|1-10\\eta|<1$, so $0<\\eta<0.2$."
      },
      {
        "title": "Gradient clipping",
        "background": "Clipping was popularized in sequence models to control exploding gradients without changing direction.",
        "numbers": "A gradient norm $50$ clipped to $5$ is scaled by $5/50=0.1$."
      },
      {
        "title": "Residual connections",
        "background": "Residual updates keep Jacobians closer to identity, helping gradients move through depth.",
        "numbers": "If each layer multiplies by $0.98$, then $100$ layers give $0.98^{100}\\approx0.133$, much larger than $0.9^{100}\\approx0.000027$."
      },
      {
        "title": "Gated RNN memory",
        "background": "LSTM and GRU gates regulate multipliers so useful information can persist.",
        "numbers": "A forget gate $f=0.95$ keeps $0.95^{20}\\approx0.358$ of a signal after 20 steps."
      }
    ],
    "applicationsClose": "Across these examples, the same question keeps returning: what happens when the rule is applied again and again?",
    "takeaways": [
      "Iterating a rule creates a discrete dynamical system.",
      "Fixed points and cycles are long-run patterns of repeated updates.",
      "Derivative or multiplier magnitudes below $1$ shrink local errors.",
      "ML training loops and recurrent states use the same stability logic."
    ]
  }
};
